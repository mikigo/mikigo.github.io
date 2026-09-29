---
date: 2026-09-23
authors: ['mikigo']
description: '从零拆解 pytest-xdist 多机器分布式架构：execnet 通信、Worker 生命周期、五大调度策略、崩溃恢复机制，并与 Swarm 做全方位对比'
sidebar: false
pageType: doc-wide
cover: ./cover.png
---

# Pytest-Xdist 多机器分布式执行是如何实现的

从零拆解 pytest-xdist 的远程分布式架构，并与 Swarm 做全方位对比。

## 当 `-n auto` 不够用的时候

你大概率用过这行命令：

```bash
pytest -n auto
```

它让你的测试从"一个核慢慢跑"变成了"所有核一起上"，速度提升肉眼可见。这是 pytest-xdist 最出名的功能——**本地多进程并行**。

但如果你的测试集有 5000 个用例，本机只有 8 核，跑完要 20 分钟，怎么办？最快的办法是把隔壁老王的那台 32 核机器也用上——这就是**多机器分布式执行**。

本文带你从源码层面拆解 pytest-xdist 是怎么做到的，以及它和另一个分布式测试框架 Swarm 的对比。

![](./images/image-01.png)

## 基本概念：用 `-n auto` 打底

在进入多机器之前，必须先搞懂单机并行——因为多机器只是在单机基础上**换了一条通信链路**而已。

```mermaid
sequenceDiagram
    participant C as Controller
    participant W1 as Worker1 gw0
    participant W2 as Worker2 gw1

    C->>W1: execnet fork, 加载 remote.py
    C->>W2: execnet fork, 加载 remote.py

    Note over W1,W2: 各自启动独立 pytest Session

    W1->>C: workerready + workerinfo
    W2->>C: workerready + workerinfo

    Note over W1,W2: 各自全量收集所有测试

    W1->>C: collectionfinish + nodeid列表
    W2->>C: collectionfinish + nodeid列表

    Note over C: 校验收集结果必须完全一致

    C->>W1: runtests indices=[0,3,5,7]
    C->>W2: runtests indices=[1,2,4,6]

    loop 执行汇报循环
        W1->>C: testreport
        W1->>C: runtest_protocol_complete
    end

    C->>W1: shutdown
    C->>W2: shutdown
```

核心设计：Worker 先**全量收集**，Controller 再通过**整数索引**告诉它"跑哪几个"。Worker 之间不需要知道彼此的存在。

## 远程模式：当 Worker 不在本机时

### 通信层：execnet + socketserver

pytest-xdist 远程通信依赖 [execnet](https://codespeak.net/execnet)，专门为"跨进程执行 Python 代码"设计。它配合一个不到 133 行的 `socketserver.py` 实现远程 Worker 的启动。

```mermaid
flowchart LR
    subgraph Controller机
        C[Controller]
        CH[execnet Channel]
    end

    subgraph 远程Worker机
        SS[socketserver.py 监听端口]
        W1[Worker 进程 remote.py]
    end

    C -->|execnet.connect| SS
    SS -->|accept + exec| W1
    CH <-->|双向 channel| W1
```

#### 启动步骤

**远端机器**（只需做一次）：

```bash
# 下载 socketserver.py 并启动
python socketserver.py
# 输出: Entering Accept loop (0.0.0.0:8888)
```

> `socketserver.py` 兼容 Windows/Linux/macOS。Windows 上 `fcntl` 不可用时会自动降级，功能不受影响。

**Controller 机器**：

```bash
pytest -d --tx socket=192.168.1.102:8888
```

#### 底层发生了什么

```python
# Controller 端 (workermanage.py)
spec = execnet.XSpec("socket=192.168.1.102:8888")
gateway = group.makegateway(spec)          # 建立 TCP 连接

# 把 xdist/remote.py 推送到远端执行
channel = gateway.remote_exec(remote_module)
# 远端进程 exec(remote.py)
# 进入 if __name__ == "__channelexec__": 分支

# 发送初始数据——只发配置，不发代码！
channel.send((workerinput, args, option_dict, change_sys_path))
```

**重要**：`remote_exec()` 只传了 `xdist/remote.py`（约 437 行的 runner 框架），你的测试代码**不会**通过 execnet 传输。测试代码必须已经存在于远程机器的文件系统上。

### 单通道 vs 双通道

```mermaid
flowchart TB
    subgraph PX ["pytest-xdist: 单通道复用 命令事件数据全走一条"]
        C1[Controller] --> CH1[execnet Channel] --> WX[Worker]
    end

    subgraph SW ["Swarm: 双通道分离"]
        S1[Server] -->|WebSocket 任务下发状态| CL1[Client]
        S1 -->|HTTP 文件上传API| CL2[Client]
    end
```

pytest-xdist 的 channel 是**双向的**：Controller 通过它发命令（`runtests`/`shutdown`/`steal`），Worker 通过它发事件（`testreport`/`collectionfinish`/`logstart`）。所有通信复用同一条 TCP 连接。

### Worker 的完整生命周期

```mermaid
sequenceDiagram
    participant C as Controller
    participant W as 远程 Worker

    C->>W: channel.send workerinput args
    Note over W: remote.py __channelexec__ 入口

    W->>W: _prepareconfig args
    W->>W: 创建独立 pytest Config/Session
    W->>W: 注册 WorkerInteractor 插件

    W->>W: pytest_cmdline_main
    Note over W: 启动完整 pytest 生命周期

    W->>C: pytest_sessionstart workerready
    Note over C: sched.add_node node

    W->>W: pytest_collection 全量收集
    W->>C: collectionfinish nodeid列表

    Note over C: 校验所有Worker收集一致
    Note over C: sched.schedule 开始分发

    C->>W: runtests indices [0,3,7]
    Note over W: torun.put 0 3 7

    loop 测试执行循环
        W->>W: torun.get item=items[idx]
        W->>W: runtestprotocol item nextitem
        W->>C: logstart testreport complete
    end

    C->>W: shutdown
    W->>W: torun.put Marker.SHUTDOWN
    W->>C: workerfinished
```

每个远程 Worker 内部跑的是一个**完整但被劫持了的 pytest Session**：

```python
# remote.py — Worker 进程入口
config = _prepareconfig(args, None)          # ① 构建独立 Config
setup_config(config, basetemp)               # ② 强制 dist=no
config.workerinput = workerinput             # ③ 注入 Worker 身份
config.workeroutput = {}                     # ④ workeroutput 通道
interactor = WorkerInteractor(config, channel) # ⑤ 注册劫持插件
config.hook.pytest_cmdline_main(config=config) # ⑥ 启动完整 pytest
```

> 一个 Worker 就是一个"被远程操控的 pytest"。它正常收集所有测试、正常创建 Session，只是 `runtestloop` 被 WorkerInteractor 劫持——不再自动遍历 `session.items`，而是从 Controller 的指令队列 `torun` 里取索引。

## 五大调度策略

pytest-xdist 提供了 **5 种调度器**，通过 `--dist` 参数选择：

```mermaid
flowchart TD
    S[--dist 参数] --> E[each: 每个Worker跑全部]
    S --> L[load: 负载均衡 按块分发]
    S --> LS[loadscope: 按模块/类分组]
    S --> LF[loadfile: 按文件分组]
    S --> LG[loadgroup: 按xdist_group标记分组]
    S --> WS[worksteal: 均匀分配+动态窃取]
```

### LoadScheduling：朴素的负载均衡

```python
# load.py — 发测试的逻辑极其简单
def _send_tests(self, node, num):
    tests_per_node = self.pending[:num]    # 从全局池子切 num 块
    del self.pending[:num]                 # 从池子移除已分配
    self.node2pending[node].extend(tests_per_node)  # 记账
    node.send_runtest_some(tests_per_node)           # 发索引给Worker
```

```mermaid
flowchart LR
    P[pending: 0..7] --> W1[Worker1]
    P --> W2[Worker2]
    P --> PR[pending: 4..7]
    W1 --> PR
    PR --> W1
```

**low-watermark 机制**：Worker 待执行数低于阈值自动补充。如果单个测试慢（>0.1秒），减少补充量避免堆积：

```python
# load.py — 慢测试不急着塞
if duration >= 0.1 and len(node_pending) >= 2:
    return  # 等它跑完再给
```

### WorkStealingScheduling：快的别闲着

场景：Worker1 分到了很多慢测试，Worker2 全是快测试，Worker2 跑完在发呆。

```mermaid
sequenceDiagram
    participant W1 as Worker1 慢
    participant C as Controller
    participant W2 as Worker2 快

    C->>W1: runtests [0..7]
    C->>W2: runtests [8..15]

    Note over W2: 快速执行完大半 只剩1个待执行
    W2->>C: runtest_protocol_complete x7

    Note over C: check_schedule: W2空闲
    Note over C: steal_from=最忙的W1
    Note over C: num_steal=偷一半

    C->>W1: steal indices [4,5,6,7]
    Note over W1: 原子偷取: 全在才偷
    W1->>C: unscheduled [4,5,6,7]

    C->>W2: runtests [4,5,6,7]
    Note over W2: 继续干活
```

steal 的原子性保证：

```python
# worksteal.py — 要么全偷，要么一个不偷
with self.torun.lock() as locked_queue:
    stolen = list(i for i in locked_queue if i in requested_set)
    if len(stolen) == len(requested_set):
        # 所有请求的测试都还在队列 → 偷走
        self.torun.replace(
            i for i in locked_queue if i not in requested_set
        )
    else:
        stolen = []  # 有一个已经跑了 → 一个不偷
```

> "要么全偷，要么一个不偷"——工作窃取的艺术。

![](./images/image-02.png)

### LoadScopeScheduling：别反复创建 fixture

当你有 `session` 级别的 fixture（比如数据库连接），不同 Worker 反复创建/销毁非常浪费。`loadscope` 让共享 fixture 的测试尽可能留在同一个 Worker。

```python
# loadscope.py — scope 划分
def _split_scope(self, nodeid):
    return nodeid.rsplit("::", 1)[0]
# test_module.py::test_a          → test_module.py        模块级
# test_module.py::TestAPI::test_b  → test_module.py::TestAPI 类级
```

```mermaid
flowchart LR
    T1["test_user.py::test_login"]
    T2["test_user.py::test_logout"]
    T3["test_user.py::test_profile"]
    T4["test_order.py::test_create"]
    T5["test_order.py::test_cancel"]

    T1 & T2 & T3 -->|scope:test_user.py| W1[Worker1]
    T4 & T5 -->|scope:test_order.py| W2[Worker2]
```

同一个 scope 下的所有测试绑定到同一个 Worker，Worker 的 Session 内 `module`/`class` scoped fixture 只创建一次。

## 崩溃恢复

![](./images/image-03.png)

```mermaid
sequenceDiagram
    participant W1 as Worker1 正常
    participant C as Controller
    participant W2 as Worker2 崩溃
    participant W2b as Worker2 重生

    W2--xC: 进程崩溃/网络断开

    Note over C: channel 关闭 Marker.END
    C->>C: process_from_remote END

    Note over C: worker_errordown:
    Note over C: 1. crashitem=remove_node
    Note over C: 正在跑的→FAILED
    Note over C: 未跑的→回pending池
    Note over C: 2. 检查重启次数
    Note over C: 3. _clone_node

    C->>W2b: 重新连接 fork 新Worker
    W2b->>C: workerready
    C->>W2b: 分发回收的测试
```

```python
# dsession.py — 崩溃恢复核心
def worker_errordown(self, node, error):
    crashitem = sched.remove_node(node)     # 回收未完成测试
    self._failed_nodes_count += 1
    maximum_reached = (
        self._max_worker_restart is not None
        and self._failed_nodes_count > self._max_worker_restart
    )
    if maximum_reached:
        self.triggershutdown()               # 超过次数上限，散会
    else:
        self._clone_node(node)               # 复活吧，Worker
```

默认最大重启次数 = `Worker数量 × 4`，可通过 `--max-worker-restart` 调整。

## 多机器实操步骤

```mermaid
flowchart TD
    subgraph prep ["准备工作 每台远程机器一次性"]
        A1["pip install pytest-xdist execnet"]
        A2["git clone 测试仓库到相同路径"]
        A3["pip install -r requirements.txt"]
        A4["python socketserver.py"]
    end

    subgraph exec ["每次执行"]
        B1["确认 socketserver 存活"]
        B2["Controller: pytest -d --tx socket=IP1:8888<br/>--tx socket=IP2:8888 --dist=worksteal -n 0"]
    end

    A1 --> A2 --> A3 --> A4
    A4 --> B1 --> B2
```

> `-n 0` 表示 Controller 本地不跑测试，全部发给远程 Worker。

## pytest-xdist vs Swarm

[Swarm](https://github.com/mikigo/swarm) 是另一个分布式测试框架，采用 Server-Client 架构。下面从**纯多机器远程测试**的角度做对比。

### 连接模型

```mermaid
flowchart TB
    subgraph PX ["pytest-xdist: 推模型"]
        C1[Controller] -->|TCP| Wx1[Worker1]
        C1 -->|TCP| Wx2[Worker2]
    end

    subgraph SW ["Swarm: 拉模型"]
        S1[Server:8000]
        CL1[Client1] -->|WebSocket| S1
        CL2[Client2] -->|WebSocket| S1
    end
```

| | pytest-xdist | Swarm |
|---|---|---|
| 连接方向 | Controller → Worker | Client → Server |
| 网络要求 | Controller 必须直连每台 Worker | Worker 只需连 Server |
| 防火墙友好度 | 每台 Worker 要开端口 | 只开 Server 一个端口 |
| 动态加机器 | 改命令行加 `--tx`，重启 | 客户端随时连，热插拔 |

### 分发粒度——最根本的差异

```mermaid
flowchart LR
    subgraph PX2 ["pytest-xdist: 用例级"]
        COL["session.items = a b c d"]
        COL -->|索引0,2| WTa[Worker1: 跑a c]
        COL -->|索引1,3| WTb[Worker2: 跑b d]
    end

    subgraph SW2 ["Swarm: 文件级"]
        FILES["test_api.py test_db.py test_web.py"]
        FILES -->|test_api.py| CLa[Client1]
        FILES -->|test_db.py| CLb[Client2]
        FILES -->|test_web.py| CLc[Client3空闲...]
    end
```

假设 3 台机器，3 个文件。`test_slow.py` 100 个慢用例（每用例 5s），另外两个文件各 100 个快用例：

| | pytest-xdist 用例级 | Swarm 文件级 |
|---|---|---|
| Worker1 耗时 | ~201s（慢用例被拆给 3 人） | 500s（独占整个慢文件） |
| Worker2 耗时 | ~201s | 100s → 空闲 400s |
| Worker3 耗时 | ~203s | 10s → 空闲 490s |
| **总耗时** | **~203s** | **500s** |

### 环境管理

```
pytest-xdist:
  每台 Worker:
    ① git clone 代码          ← 手动
    ② pip install 依赖         ← 手动
    ③ python socketserver.py   ← 手动
    ④ 每次执行: 直接跑         ← 零额外开销

Swarm:
  每台 Client:
    ① pip install swarm        ← 一次性
    ② swarm client start       ← 一次性
    ③ 每次任务: git clone → venv → pip install → 执行
    ④ 每次任务额外耗时 30-60s，但完全自动化
```

### 故障恢复

| 场景 | pytest-xdist | Swarm |
|---|---|---|
| Worker 断开检测 | channel 关闭即时触发 | 30s 心跳超时后检测 |
| 正在跑的测试 | 标记 FAILED + 自动重分配 | 无结果返回，状态不确定 |
| 未跑的测试 | 自动回 pending 池 | 无追溯机制 |
| Worker 替换 | `_clone_node()` 自动重建 | 重连即可，丢失上下文 |
| 需要人工介入 | 不需要 | **需要** |

### 报告与可观测性

| | pytest-xdist | Swarm |
|---|---|---|
| 实时输出 | `[gw0] PASSED test_xxx` | WebSocket 推送到 Server |
| 最终报告 | pytest 原生（JUnit XML 等） | 服务端汇总 Allure HTML |
| Worker 日志 | 不可见（execnet 限制） | 集中查看 |
| `-s` / `--capture=no` | ❌ 不支持 | ✅ |
| Web 面板 | ❌ 纯 CLI | ✅ HTTP API |

### 综合定位

```mermaid
flowchart LR
    subgraph Q2 ["  调度精细度高  "]
        A["pytest-xdist 远程"]
    end
    subgraph Q1 ["  理想: 两者兼得  "]
        C["Swarm + -n auto"]
    end
    subgraph Q3 ["  简单场景  "]
    end
    subgraph Q4 ["  运维自动化程度高  "]
        B["Swarm"]
    end
```

## 选型指南

```mermaid
flowchart TD
    Q1{机器数量会经常变化吗}
    Q1 -->|固定几台| Q2{需要精细负载均衡吗}
    Q1 -->|经常增减| Q4{需要自动环境搭建吗}

    Q2 -->|测试耗时差异大| A1[pytest-xdist --dist=worksteal]
    Q2 -->|测试耗时均匀| Q3{需要统一报告吗}

    Q3 -->|需要| A3[Swarm]
    Q3 -->|不需要| A2[pytest-xdist --dist=load]

    Q4 -->|需要| A3
    Q4 -->|不需要| Q5{需要Web管理面板吗}

    Q5 -->|需要| A3
    Q5 -->|不需要| Q2
```

## 结语

pytest-xdist 的远程分布式模式本质上是一个**设计精巧的"远程遥控"系统**。它没有试图成为一个完整的测试平台，而是在 pytest 已有的生态里，用最小改动（一个 plugin、一个 remote 模块、一个 socket server）实现了多机器的协作。

它的核心哲学：**Worker 不需要知道全局，只需要知道自己的 `session.items` 列表和 Controller 让它跑的第几个。Controller 负责所有协调。**

Codebase 小（核心约 2200 行）、概念少（Controller + Worker + Channel）、和 pytest 生态零摩擦。代价是运维工作压在你身上——每台机器都要手动 clone、装依赖、起 socketserver。

Swarm 走了另一条路：用独立服务接管运维，但牺牲了调度精细度。没有谁绝对更好——**场景说了算**。

如果你想兼得两者优势：**Swarm 分发文件到客户端 + 客户端内部用 `pytest -n auto`**——这是目前最接近"理想"的方案。

---

*文中源码引用基于 pytest-xdist v3.8.0 和 Swarm v0.1.0。*