# 🚀 快速部署指南

## 一键部署到 Railway

### 准备工作（只需做一次）

1. **安装 serve**（用于提供静态文件）：
   ```bash
   npm install --save-dev serve
   ```

2. **初始化 Git**（如果还没有）：
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

### 步骤 1：上传到 GitHub

#### 1.1 在 GitHub 创建仓库
- 访问 [github.com/new](https://github.com/new)
- 填写仓库名（如：`structured-product-trade-entry`）
- 点击 "Create repository"

#### 1.2 推送代码到 GitHub
```bash
# 替换 YOUR_USERNAME 为你的 GitHub 用户名，REPO_NAME 为你的仓库名
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git
git branch -M main
git push -u origin main
```

**提示**：如果遇到认证问题：
- 使用 GitHub Personal Access Token 作为密码
- 或者配置 SSH 密钥

### 步骤 2：部署到 Railway

#### 2.1 访问 Railway
- 访问 [railway.app](https://railway.app)
- 使用 GitHub 账号登录

#### 2.2 创建新项目
1. 点击 **"New Project"**
2. 选择 **"Deploy from GitHub repo"**
3. 授权 Railway 访问 GitHub（如果需要）
4. 选择你的仓库 `structured-product-trade-entry`

#### 2.3 配置部署（Railway 通常会自动检测，但可以手动设置）

在 Railway 项目设置中：

1. **Settings** > **Build & Deploy**：
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`

2. **Variables**（如果需要）：
   - 添加环境变量（本项目暂不需要）

#### 2.4 获取访问地址
- 部署完成后，Railway 会自动提供一个域名
- 在 **Settings** > **Domains** 可以看到
- 格式类似：`your-project.up.railway.app`

### 步骤 3：自动更新部署

以后每次更新代码：

```bash
git add .
git commit -m "更新说明"
git push
```

Railway 会自动检测到新提交并重新部署！

## ✅ 部署检查清单

- [ ] 已安装 `serve` 包
- [ ] 代码已推送到 GitHub
- [ ] Railway 项目已创建并连接 GitHub
- [ ] 构建和启动命令已配置
- [ ] 访问域名已获取
- [ ] 测试网站是否可以正常访问

## 🐛 常见问题

**Q: 构建失败？**
A: 检查 Railway 日志，通常是 Node 版本问题，已添加 `.nvmrc` 文件指定 Node 18

**Q: 页面 404？**
A: 检查路由配置，确保使用了正确的 base 路径

**Q: 端口错误？**
A: Railway 会自动提供 PORT 环境变量，`npm start` 脚本已配置使用它

## 📚 详细说明

查看 [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) 获取更详细的部署说明。

