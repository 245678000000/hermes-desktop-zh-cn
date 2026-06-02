#!/usr/bin/env bash
# Hermes Desktop 中文汉化一键安装脚本 (macOS/Linux)

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PATCHER_DIR="$(dirname "$SCRIPT_DIR")"

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
BOLD='\033[1m'
NC='\033[0m'

echo ""
echo -e "${BOLD}╔══════════════════════════════════════════════╗"
echo -e "║  Hermes Desktop 中文汉化一键安装工具 v1.0    ║"
echo -e "╚══════════════════════════════════════════════╝${NC}"
echo ""

# 检测 Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}[错误] 未检测到 Node.js${NC}"
    echo ""
    echo "请先安装 Node.js 18 或更高版本"
    echo "  macOS: brew install node"
    echo "  Ubuntu/Debian: sudo apt install nodejs"
    echo "  通用: https://nodejs.org/"
    exit 1
fi

echo -e "Node.js 版本: $(node -v)"
echo ""

# 运行汉化脚本
node "$PATCHER_DIR/patcher/index.js" "$@"

echo ""
echo -e "${BOLD}提示：请重启 Hermes Desktop 使汉化生效${NC}"
echo ""
