---
sidebar: false
---

# 🧪 Autotest-Basic-Template — Pytest 自动化测试工程模板

> "最小化的最佳实践，开箱即用的测试工程骨架。"

## 概述

`Autotest-Basic-Template` 是一个基于 pytest 的自动化测试工程模板，完整实现了 **Page Object Model（POM）** 设计模式。它是一个最小化、最佳实践的测试工程起点，预置了 pytest、Ruff 静态分析、调试入口，适用于 Web UI 测试、桌面应用 UI 测试、接口测试和性能测试。

**GitHub**: [https://github.com/mikigo/Autotest-Basic-Template](https://github.com/mikigo/Autotest-Basic-Template)

## 解决的痛点

- 新建自动化测试项目缺乏标准结构，每次从零搭建费时费力
- POM 模式概念清晰但实现起来容易走样，缺少参考模板
- 缺乏统一的断言和调试入口，测试代码散乱
- 依赖过多难以维护，需要一个最小化起点

## 核心特性

### 三层 POM 架构

将传统 POM 适配为**方法对象模型（Method Object Model）**，适用于 Web UI、桌面 UI、接口等多种测试场景：

```
method/   —— 操作方法层（"怎么做"）：封装所有用户交互和断言逻辑
case/     —— 测试用例层（"测什么"）：pytest 测试用例，调用操作层
conftest  —— 共享 Fixture 层：提供跨用例的夹具
```

### 自定义断言助手

`Asserts` 类封装标准断言方法，提供清晰的错误信息：

```python
self.assert_equal(actual, expected, message)
self.assert_true(condition, message)
self.assert_false(condition, message)
```

断言可通过两种方式使用：继承 `BaseCase`（`self.assert_*`） 或通过 fixture 注入。

### 预配置 pytest

`pytest.ini` 预设了详细的运行参数：详细输出、颜色高亮、代码高亮、无头信息、失败/错误/跳过汇总、集合错误继续执行、运行计数显示。

### 预配置 Ruff

`ruff.toml` 配置了 Python 3.7+ 目标、行长 100、双引号、pyflakes + select pycodestyle 规则集，兼容 Black 格式化风格。

### 全局调试入口

`debug.py` 直接调用 `pytest.console_main()`，可在 IDE 中一键运行调试全部测试。

### 路径助手

`setting.py` 提供 `setting.ROOTDIR` 常量，指向项目根目录，方便构建项目相对路径。

## 技术栈

| 组件 | 技术 |
|------|------|
| 语言 | Python 3.7+ |
| 测试框架 | pytest |
| 静态分析 | Ruff |
| 设计模式 | Page Object Model（适配为 Method Object Model） |
| IDE 配置 | VS Code（pytest 自动发现）、PyCharm |

## 项目结构

```
Autotest-Basic-Template/
├── conftest.py              # 共享 Fixture（Asserts 夹具）
├── debug.py                 # 全局调试入口（pytest.console_main()）
├── pytest.ini               # pytest 详细配置
├── ruff.toml                # Ruff 格式化/检查配置
├── requirements.txt         # 依赖（pytest + ruff）
├── setting.py               # 项目路径助手（ROOTDIR）
├── case/                    # 测试用例层
│   ├── __init__.py
│   ├── base_case.py         # BaseCase 基类（继承 Asserts）
│   └── test_module_001.py   # 示例测试用例
├── method/                  # 操作方法层
│   ├── __init__.py
│   ├── base_method.py       # BaseMethod 空基类（扩展点）
│   ├── method.py            # 具体操作类 Method
│   └── asserts.py           # 自定义断言助手 Asserts
└── .vscode/
    └── settings.json        # VS Code pytest 发现配置
```

## 架构设计

### 继承关系

```
Asserts                          # 断言方法
  ↑
BaseCase                         # 继承 Asserts，测试基类
  ↑
TestMyCase                       # 具体测试类，调用 Method 执行操作
```

### 操作与断言分离

```python
# 操作层（method/method.py）- 封装交互逻辑
class Method(BaseMethod):
    def click_file_manager_on_dock(self):
        # 元素定位 + 点击逻辑
        ...

# 用例层（case/test_module_001.py）- 编排操作 + 断言
class TestMyCase(BaseCase):
    def test_example(self):
        Method().click_file_manager_on_dock()
        self.assert_true(True)
```

## 使用方式

### 安装

```bash
pip install -r requirements.txt    # pytest + ruff
```

### 运行测试

```bash
pytest                   # 直接运行
python debug.py          # 调试入口
```

### 编写新测试

1. 在 `method/method.py` 中添加操作方法（或新建 `method/` 下的文件）
2. 在 `case/` 中创建以 `test_` 开头的测试文件，继承 `BaseCase`
3. 调用 `Method().your_method()` 执行操作，`self.assert_*(...)` 做断言

### 代码检查

```bash
ruff check .
ruff format .
```

## 设计理念

- **极简依赖**：仅 `pytest` + `ruff`，按需扩展（selenium、appium、pywinauto、dogtail 等）
- **范式无关**：`method/` 而非 `page/`，使模板适配 Web、桌面、API 等多种测试类型
- **双重断言入口**：fixture 注入 + 基类继承，灵活选择使用方式
- **零配置运行**：Clone 即用，所有配置预设完毕

## 许可证

Apache 2.0
