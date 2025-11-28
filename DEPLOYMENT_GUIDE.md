# 部署指南 - 将项目发布到公网

本指南将帮助你将结构化产品交易录入系统部署到 Railway，通过 GitHub 进行版本控制。

## 📋 前置要求

1. **GitHub 账号**：如果没有，请访问 [github.com](https://github.com) 注册
2. **Railway 账号**：如果没有，请访问 [railway.app](https://railway.app) 注册（可以使用 GitHub 账号登录）
3. **Git**：确保你的电脑已安装 Git

## 🚀 部署步骤

### 第一步：准备项目并上传到 GitHub

#### 1.1 初始化 Git 仓库（如果还没有）

在项目根目录打开终端，执行：

```bash
git init
```

#### 1.2 添加所有文件到 Git

```bash
git add .
```

#### 1.3 创建初始提交

```bash
git commit -m "Initial commit: 结构化产品交易录入系统"
```

#### 1.4 在 GitHub 上创建新仓库

1. 登录 GitHub
2. 点击右上角的 "+" 号，选择 "New repository"
3. 填写仓库信息：
   - **Repository name**: `structured-product-trade-entry`（或你喜欢的名字）
   - **Description**: `结构化产品交易录入系统`
   - **Visibility**: 选择 Public 或 Private
   - **不要**勾选 "Initialize this repository with a README"（因为我们已经有了）
4. 点击 "Create repository"

#### 1.5 连接本地仓库到 GitHub

在 GitHub 创建仓库后，会显示连接命令。执行类似以下命令（替换为你的用户名和仓库名）：

```bash
git remote add origin https://github.com/你的用户名/structured-product-trade-entry.git
git branch -M main
git push -u origin main
```

如果遇到认证问题，可能需要：
- 使用 GitHub Personal Access Token（推荐）
- 或使用 SSH 密钥

### 第二步：配置 Railway 部署

#### 2.1 登录 Railway

1. 访问 [railway.app](https://railway.app)
2. 点击 "Login" 或 "Start a New Project"
3. 使用 GitHub 账号登录（推荐，这样可以直接连接 GitHub 仓库）

#### 2.2 创建新项目

1. 登录后，点击 "New Project"
2. 选择 "Deploy from GitHub repo"
3. 授权 Railway 访问你的 GitHub 仓库（如果需要）
4. 在仓库列表中找到你的项目 `structured-product-trade-entry`
5. 点击仓库进行部署

#### 2.3 配置项目设置

Railway 会自动检测项目类型，但我们需要做一些配置：

1. **构建命令**：
   - 在 Railway 项目设置中，找到 "Settings" > "Build & Deploy"
   - Build Command: `npm install && npm run build`
   - Start Command: `npx serve -s dist -l 3000`

2. **环境变量**（如果需要）：
   - 在 "Variables" 标签页添加环境变量
   - 目前项目不需要额外的环境变量

#### 2.4 安装 serve（用于提供静态文件）

由于这是前端静态项目，需要在 `package.json` 中添加 `serve` 作为依赖：

```bash
npm install --save-dev serve
```

或者手动添加到 `package.json` 的 `devDependencies`：

```json
"serve": "^14.2.0"
```

#### 2.5 配置端口

Railway 会自动提供 `PORT` 环境变量。我们需要创建一个简单的服务器脚本来使用这个端口。

### 第三步：优化部署配置

#### 3.1 更新 package.json 添加部署脚本

在 `package.json` 的 `scripts` 中添加：

```json
"start": "serve -s dist -l ${PORT:-3000}"
```

#### 3.2 创建 nixpacks.toml（可选，用于更精确的构建控制）

Railway 使用 Nixpacks 自动检测和构建项目，通常不需要额外配置。但如果需要自定义，可以创建 `nixpacks.toml`：

```toml
[phases.setup]
nixPkgs = ["nodejs-18_x", "npm-9_x"]

[phases.install]
cmds = ["npm ci"]

[phases.build]
cmds = ["npm run build"]

[start]
cmd = "npx serve -s dist -l ${PORT:-3000}"
```

## 🔧 详细配置说明

### Railway 自动部署

Railway 默认会：
1. 监听 GitHub 仓库的 `main` 分支
2. 当有新的提交（push）时自动重新部署
3. 自动构建和启动应用

### 构建过程

1. **安装依赖**：`npm install`
2. **构建项目**：`npm run build`（会生成 `dist` 文件夹）
3. **启动服务**：使用 `serve` 提供静态文件服务

### 访问部署的应用

部署成功后：
1. 在 Railway 项目页面，点击 "Settings"
2. 在 "Domains" 部分，Railway 会提供一个自动生成的域名（如：`your-project.up.railway.app`）
3. 你也可以添加自定义域名

## 🐛 常见问题

### 问题1：构建失败

**原因**：可能是 Node.js 版本不兼容

**解决**：创建 `.nvmrc` 文件指定 Node 版本：
```bash
echo "18" > .nvmrc
```

### 问题2：端口错误

**原因**：Railway 使用环境变量 `PORT`，但应用可能硬编码了端口

**解决**：确保使用环境变量 `PORT`，如 `${PORT:-3000}` 表示使用 `PORT` 环境变量，如果没有则默认 3000

### 问题3：路由 404 错误

**原因**：Vue Router 的 history 模式需要服务器配置

**解决**：如果使用了 Vue Router，确保配置了正确的 base 路径，或使用 hash 模式

### 问题4：静态资源路径错误

**原因**：Vite 构建后的资源路径可能需要配置

**解决**：在 `vite.config.ts` 中添加 `base` 配置（如果需要部署到子路径）

## 📝 更新部署

当你修改代码后：

1. **提交更改到 Git**：
   ```bash
   git add .
   git commit -m "你的提交信息"
   git push
   ```

2. **Railway 自动部署**：
   - Railway 会自动检测到新的提交
   - 自动开始构建和部署
   - 通常在 2-5 分钟内完成

3. **查看部署日志**：
   - 在 Railway 项目页面点击 "Deployments"
   - 可以查看构建日志和部署状态

## 🎯 快速部署清单

- [ ] GitHub 账号已创建
- [ ] Railway 账号已创建
- [ ] 项目已推送到 GitHub
- [ ] Railway 项目已创建并连接到 GitHub 仓库
- [ ] 构建和启动命令已配置
- [ ] `serve` 包已添加到 `package.json`
- [ ] 测试部署是否成功

## 🔗 有用链接

- [GitHub 文档](https://docs.github.com/)
- [Railway 文档](https://docs.railway.app/)
- [Vite 部署指南](https://vitejs.dev/guide/static-deploy.html)

## 💡 提示

1. **免费额度**：Railway 提供每月 $5 的免费额度，对于小型项目通常足够
2. **自动休眠**：免费计划的应用在闲置一段时间后会休眠，首次访问时会自动唤醒（需要等待几秒）
3. **日志查看**：Railway 提供实时日志查看，方便调试
4. **环境变量**：敏感信息（如 API 密钥）应该使用环境变量，不要提交到代码库

---

如有问题，请查看 Railway 的日志输出或联系支持。

