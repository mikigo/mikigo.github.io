---
sidebar: false
---

# 📦 PyPKG — Python 包一键生成器

> "一键创建 Python 工程，模板即代码，变量自动替换。"

## 概述

`PyPKG` 是一个 Python 包工程生成器。只需一行命令，自动在当前目录生成完整的 Python 包目录结构、PyPI 发布配置文件、许可证、README 等，并智能替换模板变量。从一个空目录到一个可发布的 Python 包，一步到位。

**Gitee**: [https://gitee.com/deepin-autotest/pypkg](https://gitee.com/deepin-autotest/pypkg)

**PyPI**: [https://pypi.org/project/pypkg-tpl/](https://pypi.org/project/pypkg-tpl/)

**许可证**: GPL-2.0

## 解决的痛点

- 新建 Python 包项目需要手动创建目录结构、setup/pyproject、版本文件等，重复劳动
- 每个项目的包名、作者、日期等元信息需要逐一手动修改
- 缺乏统一的项目模板，团队各自创建的项目结构不一致
- PyPI 发布流程不熟悉，缺少开箱即用的发布脚本

## 核心设计

```mermaid
flowchart LR
    A[空目录] -->|"pypkg 命令"| B[复制模板 tpl_pkg]
    B --> C["目录名替换<br/>${app_name} → 实际包名"]
    C --> D["文件内容替换<br/>变量占位符 → 实际值"]
    D --> E[去除 -tpl 后缀]
    E --> F[完整的 Python 包工程]
```

## 核心特性

### 一键生成

```bash
mkdir my_python_pkg
cd my_python_pkg
pypkg
```

执行后自动生成完整的包工程结构（见下方目录结构）。

### 模板变量替换

模板中的占位符会自动替换为实际值：

| 占位符 | 替换为 | 来源 |
|--------|--------|------|
| `${app_name}` | 当前目录名（小写） | `pathlib.Path.cwd().name` |
| `${APP_NAME}` | 当前目录名（大写） | 自动转换 |
| `${AppName}` | 当前目录名（驼峰） | `str.title()` |
| `${USER}` | 当前系统用户名 | `getpass.getuser()` |
| `${DATE}` | 当前日期 | `strftime("%Y/%m/%d")` |
| `${TIME}` | 当前时间 | `strftime("%H:%M:%S")` |

### 模板目录结构

```
tpl_pkg/
├── ${app_name}/              # 主包目录（替换为实际包名）
│   ├── __init__.py           # 空文件
│   └── __version__.py        # 版本号
├── __init__.py               # 根包初始化（空）
├── pyproject.toml-tpl        # Hatchling 构建配置
├── README.md-tpl             # 项目说明文档
├── LICENSE-tpl               # 开源许可证
├── publish.sh-tpl            # PyPI 发布脚本
├── .gitignore-tpl            # Git 忽略配置
└── .env-tpl                  # 环境变量示例
```

生成时自动：目录 `-tpl` 后缀 → 替换变量 → 去除 `-tpl` 后缀。

### 一键发布到 PyPI

生成的 `publish.sh` 脚本包含完整的 PyPI 发布流程：

```bash
bash publish.sh
```

### CLI 命令

基于 Click 框架，提供 `pypkg` 命令：

```python
@click.command()
def cli():
    pkg = PKG()
    pkg.dirs()     # 创建/重命名模板目录
    pkg.file()     # 处理并重命名模板文件
    print_tree()   # 打印生成后的目录树
```

### 目录树打印

生成完成后自动打印项目的目录结构，一目了然。

## 技术栈

| 组件 | 技术 |
|------|------|
| 语言 | Python 3.x |
| 构建系统 | Hatchling |
| CLI 框架 | Click |
| 目录树打印 | youqu3 |
| 模板引擎 | 正则替换（`re.sub`） |

## 项目结构

```
pypkg/
├── pypkg/                     # 主包
│   ├── __init__.py            # 空
│   ├── __version__.py         # 版本号
│   ├── cli.py                 # Click CLI 入口
│   ├── main.py                # PKG 类（核心逻辑 ~2.9KB）
│   │   ├── PKG.__init__()     # 获取目录名（app_name/APP_NAME/AppName）
│   │   ├── PKG.copy_template_to_apps()  # 复制模板到当前目录
│   │   ├── PKG.dirs()         # 目录名变量替换 + 重命名
│   │   └── PKG.file()         # 文件内容变量替换 + 去 -tpl 后缀
│   ├── config.py              # 配置（模板路径、用户名）
│   ├── tree.py                # 目录树打印
│   └── tpl_pkg/               # 工程模板
│       ├── ${app_name}/       # 主包模板目录
│       ├── pyproject.toml-tpl # 构建配置模板
│       ├── README.md-tpl      # 文档模板
│       ├── LICENSE-tpl        # 许可证模板
│       ├── publish.sh-tpl     # 发布脚本模板
│       ├── .gitignore-tpl     # Git 忽略模板
│       └── .env-tpl           # 环境变量模板
├── pyproject.toml             # 自身构建配置
├── publish.sh                 # 自身发布脚本
└── README.md                  # 项目说明
```

## 使用方式

### 安装

```bash
pip install pypkg-tpl
```

### 使用流程

```bash
# 1. 创建目录
mkdir my_python_pkg
cd my_python_pkg

# 2. 一键生成
pypkg

# 3. 发布到 PyPI
bash publish.sh
```

### 生成效果示例

假设在 `my-pkg` 目录下执行 `pypkg`：

```
my-pkg/
├── my_pkg/                    # ${app_name} → my_pkg
│   ├── __init__.py
│   └── __version__.py
├── __init__.py
├── pyproject.toml             # 变量已替换
├── README.md
├── LICENSE
├── publish.sh
├── .gitignore
└── .env
```

许可证

GPL-2.0
