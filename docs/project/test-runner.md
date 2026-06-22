---
sidebar: false
---

# 🏃 TestRunner — 自动化测试任务可视化管理平台

> "浏览无需登录，动手才需验身。"

## 概述

`TestRunner` 是一个自动化测试任务的可视化管理平台，提供基于 Web 的界面来管理用户、角色、权限和测试项目。核心理念：未登录用户可以自由查看测试报告和数据，只有在执行创建、修改或删除操作时才需要登录验证。

**在线地址**: [https://testrunner.mikigo.site/](https://testrunner.mikigo.site/)

**GitHub**: [https://github.com/mikigo/TestRunner](https://github.com/mikigo/TestRunner)

## 解决的痛点

- 测试报告分散在各处，缺乏统一的可视化管理平台
- 传统 RBAC 系统强制登录，分享测试报告给外部人员不方便
- 需要一套可复用的后台管理基础框架（CRUD、认证、权限、审计日志）
- 测试任务执行缺乏可视化的调度和追踪能力

## 核心特性

### 匿名浏览 + 按需认证

- **GET 请求**：匿名用户可自由浏览所有数据（测试报告、列表、详情）
- **写操作**：POST/PUT/DELETE 触发 `401`，提示用户登录
- **无缝体验**：登录后自动获得完整操作权限，登出后回退到只读模式

### 三级 RBAC 权限模型

```
用户 ──→ 角色 ──→ API + 菜单
```

- 超级管理员始终全权限放行
- 角色可精确控制到每个 API 的方法 + 路径
- 菜单根据角色动态生成，不同角色看到不同的导航结构

### 种子数据

首次运行自动初始化：

| 账号 | 密码 | 权限 |
|------|------|------|
| `admin` | `123456` | 超管，所有权限 |
| 匿名用户 | 无需登录 | 访客角色，所有 GET 只读 |

两个预置角色：`管理员`（所有 API + 所有菜单）、`普通用户`（所有菜单 + 仅 GET API）。

### 通用 CRUD 基类

`CRUDBase` 抽象基类提供 `get`、`list`、`create`、`update`、`remove` 标准操作。新业务模型只需继承并实现控制器类，即可获得完整的 CRUD 能力，减少重复代码。

### API 自动注册

`ApiController.refresh_api()` 自动扫描 FastAPI 所有已注册路由，同步到数据库 `api` 表（存储 method、path、summary、tags）。每次启动自动刷新，确保权限配置始终映射最新路由。

### 审计日志

`HttpAuditLogMiddleware` 中间件拦截所有 HTTP 请求，记录：
- 用户 ID、用户名
- 请求方法、路径、状态码、耗时（毫秒）
- 请求参数和响应体（最大 1MB）
- 模块标签和摘要

支持按用户、模块、方法、路径、状态码、时间范围查询。

### 部门管理（闭包表）

使用闭包表模式（`Dept` + `DeptClosure`）实现任意深度的树形组织架构，支持高效的祖先/后代查询和低成本的重新父级分配，支持软删除。

### 动态路由

前端从后端接口获取菜单结构，通过 `buildRoutes()` 动态生成 Vue Router 路由。菜单和页面可访问性完全由角色控制。

### 国际化

前端使用 `vue-i18n` 支持中文（默认）和英文，头部提供语言切换。

### 测试任务执行（规划中）

基于 [swarm](https://github.com/mikigo/swarm) 执行引擎的自动化测试模块，计划的数据模型：Project（Git 仓库配置）→ Module（逻辑分组）→ Case（测试用例）→ Task（执行记录，关联 swarm 任务 ID 和 Allure 报告 URL）。

## 技术栈

| 层级 | 技术 | 版本 |
|------|------|------|
| 后端框架 | FastAPI | 0.111.0 |
| ORM | Tortoise-ORM + Aerich | 0.23.0 / 0.8.1 |
| 数据库 | SQLite（WAL 模式） | — |
| 认证 | JWT（HS256）+ argon2 | — |
| 前端框架 | Vue 3（Composition API） | 3.3.4 |
| 构建工具 | Vite | 4.4.6 |
| UI 组件库 | Naive UI | 2.34.4 |
| 状态管理 | Pinia | 2.1.6 |
| CSS | UnoCSS | 0.55.7 |
| 图标 | Iconify + unplugin-icons | — |
| HTTP 客户端 | Axios | 1.4.0 |
| 国际化 | vue-i18n | 9 |
| 包管理器 | pnpm | 8+ |

## 项目结构

```
TestRunner/
├── app/                          # FastAPI 后端
│   ├── api/v1/                   # HTTP 路由层
│   │   ├── apis/                 # API 注册管理端点
│   │   ├── auditlog/             # 审计日志查询端点
│   │   ├── base/                 # 认证端点（登录、用户信息、菜单、密码修改）
│   │   ├── depts/                # 部门 CRUD 端点
│   │   ├── menus/                # 菜单 CRUD 端点
│   │   ├── roles/                # 角色 CRUD + 授权端点
│   │   └── users/                # 用户 CRUD + 密码重置端点
│   ├── controllers/              # 业务逻辑层（继承 CRUDBase）
│   ├── core/                     # 框架核心
│   │   ├── crud.py               # 通用异步 CRUD 基类
│   │   ├── dependency.py         # AuthControl（JWT）+ PermissionControl（RBAC）
│   │   ├── init_app.py           # 应用启动：迁移、种子数据
│   │   ├── middlewares.py        # CORS、后台任务、审计日志中间件
│   │   └── exceptions.py         # 全局异常处理器
│   ├── models/                   # Tortoise-ORM 数据模型
│   │   ├── admin.py              # User、Role、Api、Menu、Dept、DeptClosure、AuditLog
│   │   └── enums.py              # MethodType 枚举
│   └── schemas/                  # Pydantic 请求/响应模型
├── web/                          # Vue 3 前端
│   ├── src/
│   │   ├── views/                # 页面：登录、工作台、个人中心、系统管理、错误页
│   │   ├── layout/               # 布局组件（侧边栏、头部、标签页）
│   │   ├── router/               # Vue Router + 动态路由 + 导航守卫
│   │   ├── store/                # Pinia 状态（用户、权限、应用、标签）
│   │   ├── components/           # 可复用组件（表格、模态框、查询栏）
│   │   └── composables/          # Vue composables（useCRUD）
│   └── i18n/                     # 国际化（中文 + 英文）
├── run.py                        # 后端启动入口（uvicorn，端口 9999）
├── requirements.txt              # Python 依赖
└── runner设计方案.md              # 测试任务执行模块设计文档
```

## 数据模型

| 模型 | 表名 | 用途 |
|------|------|------|
| User | users | 用户信息，关联角色 |
| Role | roles | 角色定义，关联菜单和 API |
| Menu | menus | 菜单树（支持无限层级） |
| Api | apis | API 注册信息（method、path、summary、tags） |
| Dept | depts | 部门（树形，闭包表） |
| DeptClosure | dept_closure | 部门闭包表（祖先/后代关系） |
| AuditLog | audit_logs | HTTP 请求审计日志 |

## API 端点

所有端点以 `/api/v1/` 为前缀，统一响应格式 `{code, msg, data}`。

### 认证（`/base`）

| 方法 | 路径 | 说明 |
|------|------|------|
| `POST` | `/access_token` | 登录，获取 JWT |
| `GET` | `/userinfo` | 当前用户信息 |
| `GET` | `/usermenu` | 当前用户菜单 |
| `GET` | `/userapi` | 当前用户 API 列表 |
| `POST` | `/update_password` | 修改密码 |

### 管理 CRUD（RBAC 保护）

| 模块 | 路径前缀 | 说明 |
|------|---------|------|
| 用户 | `/user` | 用户 CRUD + 密码重置 |
| 角色 | `/role` | 角色 CRUD + 菜单/API 授权 |
| 菜单 | `/menu` | 菜单 CRUD（树形） |
| API | `/api` | API 注册管理 + 自动刷新 |
| 部门 | `/dept` | 部门 CRUD（树形） |
| 审计 | `/auditlog` | 审计日志查询 |

## 使用方式

### 后端

```bash
pip install -r requirements.txt
python run.py                # http://0.0.0.0:9999，热重载
```

首次启动自动完成：数据库迁移 → 种子数据（admin / 123456）→ 默认菜单、API 注册、预置角色。

### 前端

```bash
cd web
pnpm install
pnpm dev                     # http://localhost:3100，代理 /api 到 :9999
```

### 生产构建

```bash
cd web
pnpm build                   # 输出到 web/dist/
```

### 默认账号

- 超级管理员：`admin` / `123456`
- 访客：无需登录，只读访问所有 GET 接口

## 设计文档

- `设计方案.md` — 匿名访问功能的详细设计（3 个后端文件 + 3 个前端模块的改造方案）
- `runner设计方案.md` — 自动化测试平台模块规划，与 swarm 执行引擎集成的数据模型和 API 设计

## 许可证

MIT
