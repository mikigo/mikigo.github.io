---
sidebar: false
---

# 🔒 safe-vitepress — 带身份认证的 VitePress 文档站

> "文档站也能有登录，公开页面随便看，受保护页面要登录。"

## 概述

`safe-vitepress` 是一个参考演示项目，展示如何将 VitePress 静态文档站点与 FastAPI 后端结合，实现基于 JWT 的身份认证和角色权限控制。核心理念：部分文档页面公开访问，部分需要用户登录后才能查看。VitePress 前端检测每个页面的 `protected` frontmatter 标记，对未认证用户显示登录弹窗。

**GitHub**: [https://github.com/mikigo/safe-vitepress](https://github.com/mikigo/safe-vitepress)

## 解决的痛点

- 内部文档需要权限控制，但 VitePress 是纯静态站点，没有内置认证机制
- 希望部分页面全员可看，部分页面仅登录用户可看
- 需要一个轻量级的认证方案，不需要复杂的全栈框架
- 作为参考实现，演示 VitePress + FastAPI 结合的最佳实践

## 核心流程

```
用户访问页面 → AuthGuard 检查 frontmatter.protected → 未登录则弹窗 → 用户名密码登录 → JWT 下发 → 页面内容显示
```

## 核心特性

### 页面级访问控制

每篇 Markdown 页面通过 frontmatter 声明是否需要保护：

```yaml
---
protected: true   # 需要登录
protected: false  # 公开访问
---
```

### 前端认证组件

自定义的 VitePress 主题注入了三个组件到导航栏 `#nav-bar-content-before` 插槽：

| 组件 | 显示条件 | 功能 |
|------|---------|------|
| `LoginButton` | 未登录 | 显示登录按钮 + 模态弹窗表单 |
| `LogoutButton` | 已登录 | 退出登录 |
| `UserProfile` | 已登录 | 用户头像/名称缩写展示 |

### AuthGuard 守卫组件

`AuthGuard.vue` 包裹整个布局，在挂载时尝试获取当前用户信息。渲染页面时检查 `frontmatter.protected`：
- 为 `true` 且未认证 → 显示登录提示，隐藏页面内容
- 为 `false` → 直接渲染页面

### JWT 认证

后端使用 OAuth2 密码流签发 JWT Token（HS256），有效期 30 分钟。Token 存储在前端 `localStorage`，Axios 拦截器自动为所有请求附加 `Authorization: Bearer <token>` 头。

### 角色控制

用户模型包含 `is_admin` 字段，创建新用户需要 admin 权限。

### 前端状态管理

通过 Vue composable `useAuth()` 管理认证状态，使用 `@vueuse/core` 的 `useStorage` 将 token 持久化到 localStorage。页面刷新后自动恢复登录态。

## 技术栈

| 层级 | 技术 | 版本 |
|------|------|------|
| 静态站点生成 | VitePress | 1.6.3 |
| 前端框架 | Vue 3 | 3.5.13 |
| 构建工具 | Vite | 6.2.1 |
| 包管理器 | pnpm | 10 |
| 后端框架 | FastAPI | 0.104.1 |
| ASGI 服务器 | Uvicorn | 0.24.0 |
| ORM | Tortoise-ORM | 0.20.0 |
| 数据库迁移 | Aerich | 0.7.0 |
| 数据库 | SQLite | — |
| JWT | python-jose | 3.3.0 |
| 密码哈希 | passlib[bcrypt] | — |
| HTTP 客户端 | Axios | 1.11.0 |
| Vue 工具库 | @vueuse/core | 13.6.0 |

## 项目结构

```
safe-vitepress/
├── backend/                        # FastAPI 后端
│   ├── main.py                     # FastAPI 应用入口 + 路由
│   ├── auth.py                     # JWT 签发、验证、用户依赖注入
│   └── models/
│       └── user.py                 # Tortoise-ORM User 模型 + Pydantic schema
├── docs/                           # VitePress 内容
│   ├── .vitepress/
│   │   ├── config.mts              # 站点配置（标题、导航、搜索、base路径）
│   │   ├── theme/
│   │   │   ├── index.ts            # 主题入口（继承 DefaultTheme）
│   │   │   ├── Layout.vue          # 自定义布局，注入认证组件到导航栏
│   │   │   └── styles.css          # 全局样式
│   │   ├── auth/
│   │   │   └── authService.ts      # useAuth() 组合式函数（状态 + Axios）
│   │   └── components/
│   │       ├── AuthGuard.vue       # 页面守卫（检查 protected 标记）
│   │       ├── LoginButton.vue     # 登录按钮 + 模态弹窗
│   │       ├── LogoutButton.vue    # 退出按钮
│   │       └── UserProfile.vue     # 用户头像展示
│   ├── index.md                    # 首页（公开）
│   ├── markdown-examples.md        # Markdown 示例（受保护）
│   ├── api-examples.md             # API 示例（受保护）
│   └── non-protected.md            # 非保护页面（公开）
├── run.py                          # 后端启动入口
├── create_admin_db.py              # 管理员创建脚本
├── requirements.txt                # Python 依赖
└── package.json                    # Node.js 依赖
```

## 后端 API

| 方法 | 路径 | 认证要求 | 说明 |
|------|------|---------|------|
| `GET` | `/` | 无 | 欢迎信息 |
| `GET` | `/health` | 无 | 健康检查 |
| `POST` | `/token` | 用户名+密码 | 登录，返回 JWT |
| `GET` | `/users/me` | 任意活跃用户 | 当前用户信息 |
| `POST` | `/users/` | admin | 创建新用户 |

## 数据模型

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | UUID | 主键 |
| `username` | str | 唯一用户名 |
| `email` | str | 唯一邮箱 |
| `hashed_password` | str | bcrypt 哈希密码 |
| `is_active` | bool | 是否激活（默认 true） |
| `is_admin` | bool | 是否管理员（默认 false） |
| `created_at` | datetime | 创建时间 |
| `updated_at` | datetime | 更新时间 |

## 效果展示

**受保护页面需要登录**：

![受保护页面](/images/project/safe-vitepress/1.png)

**登录弹窗**：

![登录弹窗](/images/project/safe-vitepress/2.png)

**登录成功**：

![登录成功](/images/project/safe-vitepress/3.png)

**用户信息和登出**：

![用户信息](/images/project/safe-vitepress/4.png)

## 使用方式

### 环境要求

- Python 3.10+
- Node.js 18+
- pnpm

### 后端启动

```bash
pipenv --python 3
pipenv shell
pip install -r requirements.txt
python run.py                      # 启动在 http://0.0.0.0:8000
```

### 创建管理员

```bash
python create_admin_db.py
```

交互式输入用户名和密码，直接通过 Tortoise-ORM 写入数据库，`is_admin=True`。

### 前端启动

```bash
pnpm i
pnpm dev      # http://localhost:5173
```

### 页面保护配置

在任意 `.md` 文件的 frontmatter 中添加：

```yaml
---
protected: true
---
```

### 配置项

| 变量 | 用途 |
|------|------|
| `API_URL` | 后端 API 地址（默认 `http://localhost:8000`） |
| `SECRET_KEY` | JWT 签名密钥（生产环境务必修改） |
| `DATABASE_URL` | 数据库连接 URL（默认 `sqlite://./db.sqlite3`） |

### 部署

`.github/workflows/deploy.yml`：推送 `main` 分支自动构建 VitePress 并部署到 GitHub Pages。注意后端需要单独部署，GitHub Pages 仅托管前端静态文件。

## 设计说明

- **演示项目**：这是一个参考实现，展示了 VitePress + FastAPI 结合的最佳实践，安全密钥使用占位符，CORS 全开放，适合作为学习或定制起点
- **认证状态持久化**：token 存储在 localStorage，刷新页面自动恢复登录状态
- **VitePress 主题扩展**：通过 `#nav-bar-content-before` 插槽注入认证组件，不破坏默认主题结构

## 许可证

Apache 2.0
