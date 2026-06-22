---
sidebar: false
---

# 📝 RepoPress — 文档仓库在线编辑 CMS

> "让非开发人员也能直接在浏览器里编辑 Markdown 文档，一键保存，自动提交到 Git。"

## 概述

`RepoPress` 是一个轻量级 CMS 层，架设在静态文档站点（VitePress、Rspress、Docusaurus、MkDocs 等）和 Git 仓库之间。它的核心目的是让不懂 Git 的人也能在浏览器中直接编辑 Markdown / MDX 文档，实时预览，一键保存、提交、推送——完全不用碰 Git CLI、分支或 Pull Request。

**GitHub**: [https://github.com/mikigo/RepoPress](https://github.com/mikigo/RepoPress)

## 解决的痛点

- 文档站点内容修改需要走 Git 工作流，非技术人员无法直接参与
- 修改一个错别字也要 clone 仓库、建分支、commit、push、提 PR，流程太重
- 内容编辑者（产品、运营、翻译）不熟悉 Git，需要开发人员中转
- 静态文档站点缺少便捷的在线编辑能力，内容更新门槛高

## 核心设计理念

| 理念 | 说明 |
|------|------|
| **Git 是唯一数据源** | RepoPress 不存储文档内容，所有文档都在用户的 Git 仓库中。后端 SQLite 数据库只存用户、角色、权限和仓库连接配置 |
| **零侵入** | 不需要改动文档项目的目录结构、构建流程或 SSG 配置。现有的 CI/CD 和部署流程完全不受影响 |
| **一键保存** | 浏览器中按 `Ctrl+S`，自动执行 pull → rebase → 写文件 → commit → push 全流程 |

## 核心特性

### 在线 Markdown / MDX 编辑器

基于 CodeMirror 6 构建，支持 Markdown 语法高亮、行号、自动补全、搜索替换、历史撤销。顶部工具栏提供常用格式化按钮（加粗、斜体、标题、链接、图片、行内代码、代码块、列表、引用）。

### 实时预览

编辑器右侧面板使用 markdown-it 实时渲染预览，支持 Mermaid 图表、KaTeX 数学公式。编辑器和预览面板滚动位置同步，宽度可拖拽调整。

### 一键保存

按下 `Ctrl+S` 或点击保存按钮，后端自动执行：

1. **Fetch + Rebase**：`git pull --rebase`，自动 stash 本地未提交修改
2. **写文件**：写入内容到磁盘，`git add` + `git commit`
3. **Push**：`git push origin <branch>`

遇到 rebase 冲突会自动中止并提示用户。

### 文件管理

左侧边栏展示 Git 仓库的文件目录树，支持：
- 点击文件进行编辑
- 新建文件和目录（自动添加 `.md` 后缀）
- 删除文件和目录
- 重命名 / 移动文件
- 查看文件提交历史
- 目录展开/折叠状态持久化到 localStorage

### 角色权限控制

内置三种角色：`admin`（管理员）、`editor`（编辑者）、`viewer`（查看者）。管理员可访问用户管理、仓库管理和权限配置页面，路由守卫限制页面访问。

### 灵活认证模式

- `authenticated` 模式（默认）：需要 JWT 登录
- `open` 模式：无需认证，直接访问编辑器

### 多仓库支持

一个 RepoPress 实例可以管理多个文档仓库，每个仓库独立配置本地路径、文档目录、SSG 类型、默认分支、隐藏文件扩展名等。

### 状态恢复

当前编辑的文件路径和内容自动保存到 localStorage，刷新页面后自动恢复上次的编辑状态。

## 技术栈

| 层级 | 技术 |
|------|------|
| 前端框架 | Vue 3 + TypeScript（Composition API） |
| 构建工具 | Vite 5 |
| 状态管理 | Pinia |
| 路由 | Vue Router 4 |
| 代码编辑器 | CodeMirror 6 |
| Markdown 渲染 | markdown-it + KaTeX + Mermaid |
| UI 组件库 | Naive UI（支持暗色主题） |
| CSS 引擎 | UnoCSS |
| 后端框架 | FastAPI（Python 3.8+） |
| ORM | Tortoise-ORM + aiosqlite |
| 数据校验 | Pydantic v2 |
| 数据库 | SQLite |
| Git 操作 | asyncio subprocess（调用原生 git CLI） |
| 认证 | JWT + bcrypt |

## 项目结构

```
RepoPress/
├── server/                 # FastAPI 后端
│   ├── cli.py              # CLI：start/stop/restart/createsuperuser
│   ├── config.py           # 配置管理（REPOPRESS_ 环境变量）
│   ├── main.py             # FastAPI 应用工厂 + 生命周期
│   ├── middleware.py        # 中间件：CORS、JWT、限流、日志
│   ├── models.py           # 数据模型：User、Role、Permission、UserGroup、RepoConfig
│   ├── schemas.py          # Pydantic v2 请求/响应模型
│   ├── services.py         # 业务逻辑：认证、管理、文档操作、目录树
│   ├── repo.py             # Git 操作抽象层 + 本地 Git 实现
│   ├── routers/
│   │   ├── auth.py         # /login、/logout、/user
│   │   ├── admin.py        # 仓库/用户/权限 CRUD
│   │   └── docs.py         # 文件树、读写、删除、重命名、历史
│   └── data/               # 运行时数据（gitignored）
├── web/                    # Vue 3 前端
│   └── src/
│       ├── views/          # 页面：Login、Editor、User、Setting
│       ├── components/     # 组件：Header、Sidebar、FileTree、Editor、Preview、Toolbar
│       ├── stores.ts       # Pinia 状态管理
│       ├── composables.ts  # 编辑器/预览/文件树逻辑
│       └── api.ts          # HTTP 客户端
└── integrations/
    └── rspress/
        └── EditLink.tsx    # Rspress 编辑链接组件
```

## 数据模型

| 模型 | 表名 | 用途 |
|------|------|------|
| User | users | UUID 主键，用户名、邮箱、显示名、密码哈希、激活状态、超级用户标记 |
| Role | roles | UUID 主键，角色名、系统标记（admin/editor/viewer） |
| Permission | permissions | UUID 主键，关联用户/用户组/角色，glob 路径模式 |
| UserGroup | user_groups | UUID 主键，用户组名 |
| RepoConfig | repo_configs | UUID 主键，仓库名、本地路径、文档目录、SSG 类型、默认分支、提交模板、隐藏扩展名 |

## API 端点

### 文档操作（`/api/docs`）

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/tree` | 获取文件目录树 |
| GET | `/{path}` | 获取文件内容 |
| POST | `/save` | 创建/更新文件 |
| DELETE | `/{path}` | 删除文件 |
| POST | `/rename` | 重命名/移动文件 |
| GET | `/{path}/history` | 文件提交历史 |

### 认证（`/api/auth`）

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/login` | 登录获取 JWT |
| POST | `/logout` | 登出 |
| GET | `/user` | 当前用户信息 |

### 管理（`/api/admin`）

| 方法 | 路径 | 说明 |
|------|------|------|
| CRUD | `/repos` | 仓库配置管理 |
| CRUD | `/users` | 用户管理 |
| PUT | `/permissions` | 权限配置 |

### 健康检查

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/health` | 服务健康检查 |

## 中间件栈

ASGI 中间件（从外到内）：

1. **CORSMiddleware** — 跨域处理，开发模式宽松，生产模式严格
2. **RateLimitMiddleware** — 登录接口限流（5 次/分钟/IP）
3. **JWTAuthMiddleware** — Bearer Token 提取校验，跳过公开路径
4. **RequestLoggingMiddleware** — 请求日志（方法、路径、状态码、耗时）

## Git 操作架构

`GitProvider` 抽象基类定义了 6 个抽象方法：`get_file`、`create_or_update_file`、`get_file_history`、`get_tree`、`delete_file`、`push`。

目前唯一的实现是 `LocalGitProvider`，通过 `asyncio.create_subprocess_exec()` 调用原生 `git` CLI 完成所有操作。架构设计支持扩展——可通过子类化 `GitProvider` 添加新的 Provider（如 GitLab API、Gitea API、GitHub API）。

关键操作逻辑：
- Rebase 前自动 stash 本地修改，rebase 后 pop 回来
- 冲突检测：rebase 和 stash pop 阶段都会检测冲突
- 快速路径：无远程仓库或无远程分支时跳过 fetch/rebase

## 使用方式

### 开发环境

```bash
# 后端
cd server
pip install -e .
python -m server.cli start    # http://0.0.0.0:8000

# 前端
cd web
npm install
npm run dev                   # http://localhost:5173，代理 /api 到 :8000
```

### 生产构建

```bash
cd web
npm install && npm run build     # 输出到 server/static/

cd ../server
pip install -e .
python -m server.cli start       # FastAPI 同时提供 API 和前端 SPA
```

### CLI 命令

```bash
python -m server.cli start              # 启动服务
python -m server.cli stop               # 停止服务
python -m server.cli restart            # 重启服务
python -m server.cli createsuperuser    # 交互式创建超级用户
```

### 配置项

所有配置通过 `REPOPRESS_` 环境变量设置：

| 变量 | 默认值 | 说明 |
|------|--------|------|
| `REPOPRESS_HOST` | `0.0.0.0` | 服务绑定地址 |
| `REPOPRESS_PORT` | `8000` | 服务端口 |
| `REPOPRESS_DATABASE_URL` | `sqlite://data/repopress.db` | 数据库 URL |
| `REPOPRESS_AUTH_MODE` | `authenticated` | 认证模式（authenticated / open） |
| `REPOPRESS_JWT_SECRET` | 自动生成 | JWT 签名密钥 |
| `REPOPRESS_JWT_EXPIRE_MINUTES` | `1440` | Token 过期时间（24 小时） |

### 集成到文档站点

1. 在 RepoPress 管理后台添加文档仓库配置
2. 复制 `integrations/rspress/EditLink.tsx` 组件到 SSG 主题中
3. 配置文档站点的 `editLink` 指向 RepoPress 编辑器
4. 每篇文档页面自动显示编辑链接，点击即可在浏览器中编辑

默认超级用户：`admin` / `admin123`（仅首次运行时创建，无用户时生效）。

## 许可证

Apache 2.0
