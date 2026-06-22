---
sidebar: false
---

# 📝 django-blog — 基于 Django 的博客系统

> "功能完整的 Django 博客，前后端一体，开箱即用。"

## 概述

`django-blog` 是一个使用 Django 构建的全栈博客系统，采用 MTV 模式（Django 模板引擎渲染前端），提供 RESTful API 接口、在线接口文档、Markdown 编辑器、后台管理等功能。

**GitHub**: [https://github.com/mikigo/django-blog](https://github.com/mikigo/django-blog)

**文档站**: [https://mikigo.github.io/django-blog/](https://mikigo.github.io/django-blog/)

**许可证**: Apache 2.0

## 核心特性

### RESTful API

基于 Django Rest Framework 构建数据接口，提供博客文章、评论等资源的 CRUD 操作。

### 在线接口文档

集成 drf-yasg 生成 Swagger 在线接口文档，API 可视化浏览和调试。

### Django 模板渲染

使用 Django 模板引擎渲染前端页面，Bootstrap 美化 UI，无需单独的前端框架。

### 后台管理

集成 Django SimpleUI 强化后台管理系统，支持：

- 文章管理（新建、编辑、删除）
- 评论管理
- Markdown 富文本编辑（django-ckeditor）
- 自动补全（django-autocomplete-light）
- 图片处理（pillow）

### Markdown 内容管理

使用 mistune 解析和渲染 Markdown 内容，后台编辑支持所见即所得的富文本编辑。

### 三 App 架构

| App | 用途 |
|-----|------|
| `blog` | 博客核心：文章、分类、标签 |
| `comment` | 评论系统 |
| `config` | 站点配置 |

## 技术栈

| 组件 | 技术 |
|------|------|
| Web 框架 | Django |
| REST API | Django Rest Framework |
| API 文档 | drf-yasg（Swagger） |
| 前端 | Django Templates + Bootstrap |
| 后台 UI | Django SimpleUI |
| 数据库 | SQLite |
| Markdown | mistune |
| 富文本编辑器 | django-ckeditor |
| 自动补全 | django-autocomplete-light |
| 图片处理 | pillow |
| 包管理器 | pipenv |
| 文档 | MkDocs Material |

## 项目结构

```
django-blog/
├── django_blog/                 # Django 项目配置
│   ├── settings.py              # 全局配置（5.7KB）
│   ├── urls.py                  # URL 路由（3.5KB）
│   ├── wsgi.py                  # WSGI 入口
│   ├── autocomplete.py          # 自动补全配置
│   └── uploads/                 # 上传文件目录
├── apps/                        # Django 应用
│   ├── blog/                    # 博客核心 App
│   ├── comment/                 # 评论 App
│   └── config/                  # 站点配置 App
├── themes/                      # 自定义主题
├── docs/                        # 文档站源文件
├── manage.py                    # Django 管理入口
├── mkdocs.yml                   # 文档站配置
├── db.sqlite3                   # SQLite 数据库
├── Pipfile / Pipfile.lock       # pipenv 依赖管理
└── requirements.txt             # pip 依赖列表
```

## 效果展示

**首页**：

![博客首页](/images/project/django-blog/home.png)

**文章详情**：

![博客详情](/images/project/django-blog/detail.png)

**后台管理**：

![后台管理](/images/project/django-blog/admin.png)

**Markdown 编辑器**：

![Markdown编辑](/images/project/django-blog/admin_md.png)

## 使用方式

### 环境准备

系统要求：deepin / Linux（其他平台亦可）

```bash
# 安装 pip3
sudo apt install python3-pip

# 安装 pipenv
pip3 install pipenv
```

### 安装与启动

```bash
# 进入项目目录
cd django-blog/

# 安装环境依赖
pipenv install

# 进入虚拟环境
pipenv shell

# 启动服务
python manage.py runserver
```

### 访问地址

| 地址 | 说明 |
|------|------|
| `http://127.0.0.1:8000` | 博客首页 |
| `http://127.0.0.1:8000/admin` | 后台管理 |

### 默认管理员

| 用户名 | 密码 |
|--------|------|
| `mikigo` | `123456` |

## 许可证

Apache 2.0
