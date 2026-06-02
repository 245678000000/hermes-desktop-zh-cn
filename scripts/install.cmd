@echo off
chcp 65001 >nul
echo.
echo ╔══════════════════════════════════════════════╗
echo ║  Hermes Desktop 中文汉化一键安装工具 v1.0    ║
echo ╚══════════════════════════════════════════════╝
echo.

REM 检测 Node.js
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo [错误] 未检测到 Node.js
    echo.
    echo 请先安装 Node.js 18 或更高版本
    echo 下载地址: https://nodejs.org/
    echo.
    pause
    exit /b 1
)

REM 显示 Node.js 版本
for /f "tokens=*" %%i in ('node -v') do echo Node.js 版本: %%i
echo.

REM 运行汉化脚本
node "%~dp0..\patcher\index.js" %*
if %errorlevel% neq 0 (
    echo.
    echo [错误] 汉化过程中出现错误，请查看上方日志
    echo.
    pause
    exit /b 1
)

echo.
echo 提示：请重启 Hermes Desktop 使汉化生效
echo.
pause
