# 项目启动指南

## 前置要求

在启动项目之前，您需要先安装 Node.js。

### 检查 Node.js 是否已安装

在 PowerShell 或命令提示符中运行：
```bash
node --version
npm --version
```

如果命令无法识别，说明需要安装 Node.js。

## 安装 Node.js

### 方法一：从官网下载安装（推荐）

1. 访问 Node.js 官网：https://nodejs.org/
2. 下载 LTS（长期支持）版本（推荐 v18.x 或 v20.x）
3. 运行安装程序，按照向导完成安装
4. **重要**：安装时勾选 "Add to PATH" 选项
5. 安装完成后，重启命令行窗口或重新打开 Cursor

### 方法二：使用包管理器安装

#### Windows - 使用 Chocolatey
```powershell
choco install nodejs
```

#### Windows - 使用 winget
```powershell
winget install OpenJS.NodeJS.LTS
```

## 验证安装

安装完成后，重启命令行窗口，然后运行：
```bash
node --version
npm --version
```

应该能看到版本号，例如：
```
v18.17.0
9.6.7
```

## 启动项目

安装 Node.js 后，按照以下步骤启动项目：

### 1. 安装项目依赖

在项目目录下运行：
```bash
npm install
```

这将安装所有必需的依赖包，包括：
- Vue 3
- TypeScript
- Element Plus
- Vite
- 以及其他依赖

### 2. 启动开发服务器

运行以下命令：
```bash
npm run dev
```

### 3. 访问应用

开发服务器启动后，您会看到类似以下输出：
```
  VITE v5.0.10  ready in 500 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

在浏览器中打开 `http://localhost:3000` 即可访问应用。

## 常见问题

### 问题1：npm 命令无法识别

**原因**：Node.js 没有安装或没有添加到 PATH 环境变量中。

**解决方案**：
1. 重新安装 Node.js，确保勾选 "Add to PATH"
2. 或者手动添加 Node.js 安装目录到系统 PATH 环境变量

### 问题2：依赖安装失败

**原因**：可能是网络问题或依赖版本冲突。

**解决方案**：
```bash
# 清除 npm 缓存
npm cache clean --force

# 删除 node_modules 和 package-lock.json（如果存在）
rmdir /s node_modules
del package-lock.json

# 重新安装
npm install
```

### 问题3：端口被占用

**原因**：3000 端口已被其他应用使用。

**解决方案**：
1. 修改 `vite.config.ts` 中的端口号：
```typescript
server: {
  port: 3001, // 改为其他端口
  open: true
}
```

2. 或者在启动时指定端口：
```bash
npm run dev -- --port 3001
```

### 问题4：构建错误

如果遇到 TypeScript 编译错误，可以尝试：
```bash
# 检查 TypeScript 版本
npx tsc --version

# 重新安装依赖
npm install
```

## 其他可用命令

```bash
# 构建生产版本
npm run build

# 预览生产版本
npm run preview

# 代码检查
npm run lint
```

## 需要帮助？

如果遇到其他问题，请检查：
1. Node.js 版本是否符合要求（>= 16.0.0）
2. 项目依赖是否正确安装
3. 端口是否被占用
4. 查看控制台错误信息

---

**注意**：安装 Node.js 后，请重启 Cursor 或命令行窗口，以确保环境变量生效。


