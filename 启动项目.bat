@echo off
chcp 65001 >nul
echo ====================================
echo 结构化产品交易录入系统 - 启动脚本
echo ====================================
echo.

REM 检查 Node.js 是否安装
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo [错误] 未检测到 Node.js！
    echo.
    echo 请先安装 Node.js：
    echo 1. 访问 https://nodejs.org/
    echo 2. 下载并安装 LTS 版本
    echo 3. 安装时勾选 "Add to PATH"
    echo 4. 安装完成后重新运行此脚本
    echo.
    pause
    exit /b 1
)

REM 显示 Node.js 和 npm 版本
echo [信息] 检测到 Node.js：
node --version
npm --version
echo.

REM 检查 node_modules 是否存在
if not exist "node_modules" (
    echo [信息] 未找到 node_modules 目录，开始安装依赖...
    echo.
    call npm install
    if %errorlevel% neq 0 (
        echo.
        echo [错误] 依赖安装失败！
        echo 请检查网络连接或运行：npm cache clean --force
        pause
        exit /b 1
    )
    echo.
    echo [成功] 依赖安装完成！
    echo.
) else (
    echo [信息] 依赖已存在，跳过安装步骤
    echo.
)

REM 启动开发服务器
echo [信息] 正在启动开发服务器...
echo.
echo 服务器启动后，请在浏览器中访问：http://localhost:3000
echo 按 Ctrl+C 可以停止服务器
echo.
echo ====================================
echo.

call npm run dev

pause


