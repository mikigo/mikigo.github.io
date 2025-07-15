# 安装

## 后端

1. 安装依赖
```bash
pipenv --python 3
pipenv shell
pip install -r requirements.txt
```

2. 启动服务
```bash
python run.py
```

服务现在应该正在运行，访问 http://localhost:9999/docs 查看API文档

## 前端


1. 进入前端目录
```bash
cd web
```

2. 安装依赖
```bash
pnpm i
```

3. 启动
```bash
pnpm run dev
```