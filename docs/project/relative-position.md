---
sidebar: false
---

# 📐 relative-position — 跨平台 UI 元素相对定位库

> "相对于窗口定位元素，告别手动像素计算。"

## 概述

`relative-position` 是一个跨平台 Python 库，用于在桌面应用程序中程序化地定位和操作 UI 元素。核心思想是定义 UI 元素相对于其父窗口的位置（使用如"左上角"、"右下角"等参考点），库自动计算出屏幕绝对坐标，然后执行点击、双击、右键、悬停等操作——无需手动计算像素坐标。

**GitHub**: [https://github.com/mikigo/relative-position](https://github.com/mikigo/relative-position)

**PyPI**: [https://pypi.org/project/relative-position/](https://pypi.org/project/relative-position/)

## 解决的痛点

- GUI 自动化中需要手动计算屏幕绝对坐标，繁琐且易出错
- 窗口位置变化后坐标失效，缺乏相对定位能力
- 跨平台 GUI 操作 API 不统一，写一套代码需要适配多个平台
- 元素定位逻辑与业务逻辑耦合，代码难以维护和复用

## 核心特性

### 九方向定位参考点

元素可基于窗口的 9 个参考点进行相对定位：

| 枚举值 | 说明 |
|--------|------|
| `LEFT_TOP` | 左上角 |
| `RIGHT_TOP` | 右上角 |
| `LEFT_BOTTOM` | 左下角 |
| `RIGHT_BOTTOM` | 右下角 |
| `TOP_CENTER` | 上边中点 |
| `BOTTOM_CENTER` | 下边中点 |
| `LEFT_CENTER` | 左边中点 |
| `RIGHT_CENTER` | 右边中点 |
| `WINDOW_SIZE` | 窗口中心 |

### 两种元素定义方式

- **bbox（包围盒）**：`[x偏移, y偏移, 宽度, 高度]` — 定义元素的矩形区域
- **center（中心点）**：`[x偏移, y偏移]` — 直接从参考点偏移

### 自动坐标计算

定位过程：
1. 根据元素名查找元素配置
2. 从窗口信息提供器获取窗口的屏幕绝对坐标
3. 基于参考点偏移计算元素绝对位置
4. bbox 模式下计算矩形中心点作为操作目标

### 鼠标操作

计算出元素中心坐标后，通过 `pyautogui` 执行：

```python
btn.click()          # 左键单击
btn.right_click()    # 右键单击
btn.double_click()   # 左键双击
btn.hover()          # 鼠标悬停
btn.center()         # 获取元素中心坐标
```

### 多元素管理

使用 `Elements` 类批量管理多个元素，支持字典式访问：

```python
elements = Elements()
elements.add("close_btn", Ele(direction=Direction.LEFT_BOTTOM, bbox=[20, 20, 50, 35]))
close_btn = elements["close_btn"]
```

### 窗口操作

```python
app.focus_window()     # 聚焦目标窗口
app.window_position()  # 窗口左上角坐标
app.window_size()      # 窗口宽高
app.window_center()    # 窗口中心坐标
app.window_info()      # 完整窗口信息
```

### 跨平台支持

| 平台 | 窗口信息获取方式 |
|------|------------------|
| Windows | `ctypes` 调用 `user32.dll`（EnumWindows、GetWindowRect）+ psutil 进程匹配 |
| Linux X11 | xdotool + xwininfo 命令行工具 |
| Linux Wayland | libdtkwmjack.so（Deepin 桌面）通过 ctypes 调用 |

平台在导入时自动检测，用户只需传入应用名称，无需关心底层实现。

## 技术栈

| 组件 | 技术 |
|------|------|
| 语言 | Python 3.6+ |
| 构建系统 | Hatchling |
| 鼠标操作 | pyautogui >= 0.9.54 |
| Windows 进程管理 | psutil >= 5.9.0 |
| Linux D-Bus | dbus-python >= 1.3.2 |
| Linux 系统依赖 | xdotool、x11-utils（X11）、libdtkwmjack.so（Wayland） |

## 项目结构

```
relative-position/
├── pyproject.toml                     # 包元数据和构建配置
├── README.md                          # 完整中文文档
├── example/
│   └── test_ele.py                    # 使用示例
└── relative_position/                 # 主包
    ├── __init__.py                    # 公开 API：Ele、Direction、App、Mouse
    ├── __version__.py                 # 版本号 1.0.0
    ├── app.py                         # App 类（主入口）+ Mouse 类
    ├── elements.py                    # Ele、Direction 枚举、Elements 类
    ├── config.py                      # 平台检测（Windows / X11 / Wayland）
    ├── exceptions.py                  # 自定义异常
    ├── utils.py                       # 日志、命令控制、快捷键工具
    ├── linux/
    │   ├── base.py                    # RelativePositionBase 抽象基类 + WindowInfoProvider ABC
    │   ├── main.py                    # Linux RelativePosition 实现
    │   ├── x11_wininfo.py             # X11 窗口信息提供器
    │   └── wayland_wininfo.py         # Wayland 窗口信息提供器
    └── windows/
        ├── main.py                    # Windows RelativePosition 实现
        └── windows_wininfo.py         # Windows 窗口信息提供器
```

## 架构设计

### 三层分层架构

1. **公开 API 层**（`app.py`、`elements.py`）— 用户面向的 `App`、`Ele`、`Direction`、`Mouse`、`Elements` 类
2. **平台抽象层**（`linux/base.py`）— `RelativePositionBase` 抽象基类，定义窗口/元素定位接口
3. **平台实现层**（`linux/main.py`、`windows/main.py`）— 具体平台实现，调用各自的窗口信息提供器

### 设计模式

| 模式 | 应用场景 |
|------|---------|
| **工厂模式** | `App` 类运行时检测平台，实例化对应的 `RelativePosition` |
| **策略模式** | 平台窗口信息提供器（X11 / Wayland / Windows）统一实现 `WindowInfoProvider` ABC |
| **模板方法** | `RelativePositionBase` 定义共享定位逻辑（`btn_center()`、`btn_size()`），子类实现抽象方法 |
| **枚举模式** | `Direction` 枚举提供类型安全的参考点定义，同时兼容字符串值 |
| **依赖注入** | `Ele` 对象接收 `App` 实例用于坐标计算 |

### 平台检测逻辑

```python
# sys.platform.startswith('win')  → 'windows'
# sys.platform.startswith('linux') + XDG_SESSION_TYPE=wayland → 'wayland'
# 其他 Linux → 'x11'
```

## 使用方式

### 安装

```bash
pip install relative-position
```

### 基本用法

```python
from relative_position import App, Direction

# 创建 App 实例（自动检测平台）
app = App(appname="explorer.exe")   # Windows
# app = App(appname="gedit")        # Linux

# 基于左上角，用 bbox 定义元素
btn = app.Ele(
    direction=Direction.LEFT_TOP,
    bbox=[20, 20, 50, 35]  # [x偏移, y偏移, 宽度, 高度]
)

# 或使用中心点偏移
btn = app.Ele(
    direction=Direction.LEFT_TOP,
    center=[30, 30]
)

# 执行操作
btn.click()
btn.right_click()
btn.double_click()
btn.hover()

# 获取元素中心坐标
x, y = btn.center()

# 窗口操作
app.focus_window()
pos = app.window_position()
size = app.window_size()
```

### 批量管理元素

```python
from relative_position import Ele, Elements, Direction

elements = Elements()
elements.add("close_button", Ele(direction=Direction.LEFT_BOTTOM, bbox=[20, 20, 50, 35]))
elements.add("open_button", Ele(direction=Direction.RIGHT_TOP, bbox=[10, 10, 40, 30]))

elements["close_button"].click()
```

### 独立鼠标操作

```python
from relative_position import Mouse

Mouse.move_to(500, 500)
Mouse.click(button='left')
Mouse.double_click(button='left')
```

## 设计特点

- **程序化定义**：元素作为 Python 对象定义，非配置文件，享受 IDE 自动补全和类型检查
- **运行时平台检测**：导入时自动检测 Windows / Linux X11 / Linux Wayland
- **类型安全的枚举方向**：`Direction` 枚举提供自动补全，同时兼容字符串值
- **重试机制**：Linux 和 Windows 实现均支持窗口信息获取重试（可配置 `retry` 参数）
- **Wayland 限制**：Wayland 协议下 `focus_window()` 为空操作，仅 Deepin 桌面完整支持

## 许可证

Apache 2.0
