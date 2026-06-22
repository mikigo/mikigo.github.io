---
sidebar: false
---

# 📜 Funnylog — Python 类方法自动日志装饰器

> "给类挂一个装饰器，所有方法的调用全自动记录，文档即日志。"

## 概述

`funnylog` 是一个简单易用、功能强大的 Python 日志工具。只需在类上挂一个 `@log` 装饰器，就能自动输出该类所有方法的调用日志——日志内容直接取自方法的 docstring，并通过参数占位符 `{参数名}` 实现动态替换。

**GitHub**: [https://github.com/linuxdeepin/funnylog](https://github.com/linuxdeepin/funnylog)

**文档站**: [https://linuxdeepin.github.io/funnylog/](https://linuxdeepin.github.io/funnylog/)

**PyPI**: [https://pypi.org/project/funnylog/](https://pypi.org/project/funnylog/)

**版本**: 2024.5.24

## 解决的痛点

- 手动在每个方法里加日志语句，重复劳动且容易遗漏
- docstring 已经写了方法说明，但只在 IDE 里可见，运行时看不到
- 测试自动化中希望自动记录每个步骤的执行情况
- 日志输出格式不统一，缺少美观的彩色终端输出

## 核心特性

### `@log` 类装饰器

一个装饰器搞定所有。类中所有公开方法（包括实例方法、类方法、静态方法）自动包装日志记录：

```python
from funnylog import log, logger

logger("DEBUG")  # 初始化日志级别

@log
class TestMyCase:
    """我的测试类"""

    def click_button(self, button_name):
        """点击 {button_name} 按钮"""
        ...

    def input_text(self, field, text):
        """在 {field} 输入 {text}"""
        ...

TestMyCase().click_button("提交")
# [click_button]: 点击 提交 按钮
```

### 文档即日志

日志内容直接取自方法的 docstring，通过 `{参数名}` 占位符实现参数值动态替换。写好文档的同时，日志也就写好了。

### 继承链自动覆盖

基类的方法也会被 `@log` 装饰器自动捕获，子类调用继承的方法同样输出日志。

### 彩色终端输出

| 级别 | 颜色 | 用途 |
|------|------|------|
| INFO | 绿色方法名 + 白色消息 | 步骤信息 |
| DEBUG | 蓝色 | 调试信息 |
| ERROR | 红色 | 错误信息 |

终端输出格式：`系统架构-IP尾号: 时间戳 | LEVEL | [方法名]: 日志内容`

### 智能 DEBUG 日志

若调用方是 `test_` 开头的测试用例函数，`debug()` 方法会自动升级为 `info` 级别输出，确保测试步骤在默认日志级别下可见。

### 配套日志方法

```python
logger.info("测试通过")       # INFO 级别
logger.debug("调试信息")      # DEBUG 级别（测试用例中自动升为 INFO）
logger.error("发生错误")      # ERROR 级别
logger.warning("注意")       # WARNING 级别
logger.exception("异常信息")  # 异常级别（含 traceback）
```

所有方法自动在消息前添加调用函数名：`[函数名]: 消息内容`。

### 双文件日志

每天生成两个日志文件到 `/tmp/_logs/logs/`：
- `YYYY-MM-DD_debug.log` — 所有 DEBUG 及以上日志
- `YYYY-MM-DD_error.log` — 仅 ERROR 和异常日志

### Allure 集成

可选依赖 `allure-pytest`，安装后 `@log` 装饰器自动将每个方法调用包装为 Allure step，在测试报告中展示步骤层级。

### 类名过滤

通过 `setting` 可控制装饰器的生效范围：

```python
from funnylog.conf import setting

setting.CLASS_NAME_ENDSWITH = ("Log",)      # 仅类名以 Log 结尾的类自动日志
setting.CLASS_NAME_STARTSWITH = ("Test",)   # 仅类名以 Test 开头的类
setting.CLASS_NAME_CONTAIN = ("Case",)      # 仅类名包含 Case 的类
```

### 线程安全单例

`logger` 类基于单例模式，带 `threading.Lock` 保证线程安全，通过 `weakref.WeakValueDictionary` 缓存不同参数的实例。

## 技术栈

| 组件 | 技术 |
|------|------|
| 语言 | Python 3.6+ |
| 构建系统 | Hatchling |
| 文档 | MkDocs Material |
| 核心依赖 | 无（零外部强依赖） |
| 可选依赖 | allure-pytest（Allure 报告集成） |
| 测试 | pytest |

## 项目结构

```
funnylog/
├── funnylog/                  # 主包
│   ├── __init__.py            # 核心代码（~13KB）
│   │   ├── Singleton          # 线程安全单例元类
│   │   ├── log()              # @log 类装饰器
│   │   ├── _trace()           # 方法追踪包装器
│   │   ├── logger             # 日志记录器（单例）
│   │   ├── _ColoredFormatter  # 彩色终端格式化器
│   │   └── IgnoreFilter       # 日志过滤器
│   ├── conf.py                # 全局配置 _Setting
│   └── __version__.py         # 版本号
├── example/                   # 示例代码
├── test/                      # 测试用例
├── docs/                      # 文档站源文件
├── mkdocs.yml                 # 文档站配置
├── pyproject.toml             # 项目元数据
└── publish.sh                 # PyPI 发布脚本
```

## 架构设计

### `@log` 装饰器工作流程

```
@log 装饰类
  → 遍历类中所有函数/方法
  → 检查方法所在类名是否匹配过滤条件
  → 将匹配的方法替换为 _trace(func) 包装
  → _trace 在方法执行时:
      解析 docstring 中的 {参数名} 占位符
      用实际参数值替换
      输出 [方法名]: 日志内容
      若安装了 allure → 包装为 Allure StepContext
      执行原方法
```

### 单例 logger 生命周期

```
首次调用 logger() 或任何静态方法
  → Singleton 元类检查缓存
  → 不存在 → 创建实例（配置 handlers、formatters、文件路径）
  → 存在 → 返回缓存实例
```

## 使用方式

### 安装

```bash
pip install funnylog
```

### 基本用法

```python
from funnylog import logger, log
from funnylog.conf import setting

# 配置过滤规则（可选）
setting.CLASS_NAME_ENDSWITH = ("Log",)

# 初始化日志级别
logger("DEBUG")

# 挂装饰器即可
@log
class TestLog:
    """继承了基类BaseLog"""

    def self_method(self):
        """我是类里面的实例方法"""

    @classmethod
    def cls_method(self):
        """我是类里面的类方法"""

    @staticmethod
    def static_method():
        """我是类里面的静态方法"""

if __name__ == '__main__':
    TestLog().self_method()   # 自动打印: [self_method]: 我是类里面的实例方法
    TestLog().cls_method()    # 自动打印: [cls_method]: 我是类里面的类方法
    TestLog().static_method() # 自动打印: [static_method]: 我是类里面的静态方法
```

### 带参数的日志

```python
@log
class TestApi:
    def get_user(self, user_id):
        """查询用户 {user_id} 的信息"""
        ...

TestApi().get_user("12345")
# 输出: [get_user]: 查询用户 12345 的信息
```

### 配置项

```python
from funnylog.conf import setting

setting.LOG_LEVEL = "DEBUG"           # 日志级别
setting.LOG_FILE_PATH = "/tmp/_logs"  # 日志文件路径
setting.CLASS_NAME_ENDSWITH = ("Log",)  # 仅类名以指定后缀结尾的类生效
setting.CLASS_NAME_STARTSWITH = ()    # 仅类名以指定前缀开头的类生效
setting.CLASS_NAME_CONTAIN = ()       # 仅类名包含指定字符串的类生效
```

## 许可证

Apache Software License
