#!/usr/bin/env node

/**
 * Hermes Desktop 中文汉化一键安装脚本
 *
 * 功能：
 * 1. 自动检测 Hermes Desktop 安装路径
 * 2. 复制 i18n 翻译文件
 * 3. 应用字符串替换规则
 * 4. 注入 import 语句
 * 5. 创建备份
 *
 * 用法：node patcher/index.js [安装路径]
 */

'use strict'

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

// ─── 配色工具 ─────────────────────────────────────────────────────────
const GREEN = '\x1b[32m'
const RED = '\x1b[31m'
const YELLOW = '\x1b[33m'
const CYAN = '\x1b[36m'
const BOLD = '\x1b[1m'
const DIM = '\x1b[2m'
const RESET = '\x1b[0m'

function log(msg) { console.log(msg) }
function ok(msg) { console.log(`${GREEN}  ✓${RESET} ${msg}`) }
function warn(msg) { console.log(`${YELLOW}  ⚠${RESET} ${msg}`) }
function fail(msg) { console.log(`${RED}  ✗${RESET} ${msg}`) }
function info(msg) { console.log(`${CYAN}  →${RESET} ${msg}`) }
function dim(msg) { console.log(`${DIM}    ${msg}${RESET}`) }

// ─── 路径检测 ─────────────────────────────────────────────────────────

/**
 * 检测 Hermes Desktop 安装路径
 * 优先级：命令行参数 > 常见安装路径
 */
function detectInstallPath(cliArg) {
  // 1. 命令行参数
  if (cliArg) {
    const p = path.resolve(cliArg)
    if (fs.existsSync(p)) return p
    fail(`命令行指定的路径不存在: ${p}`)
    process.exit(1)
  }

  // 2. 常见安装路径
  const candidates = []

  if (process.platform === 'win32') {
    const localAppData = process.env.LOCALAPPDATA || ''
    const appData = process.env.APPDATA || ''
    if (localAppData) candidates.push(path.join(localAppData, 'hermes', 'hermes-agent'))
    if (appData) candidates.push(path.join(appData, 'hermes', 'hermes-agent'))
  } else if (process.platform === 'darwin') {
    const home = process.env.HOME || ''
    candidates.push(
      path.join(home, 'Library', 'Application Support', 'hermes', 'hermes-agent'),
      path.join(home, '.hermes', 'hermes-agent')
    )
  } else {
    const home = process.env.HOME || ''
    candidates.push(
      path.join(home, '.local', 'share', 'hermes', 'hermes-agent'),
      path.join(home, '.hermes', 'hermes-agent')
    )
  }

  for (const p of candidates) {
    if (fs.existsSync(p)) {
      info(`自动检测到安装路径: ${p}`)
      return p
    }
  }

  fail('无法自动检测 Hermes Desktop 安装路径')
  dim('请手动指定路径: node patcher/index.js <安装路径>')
  log('')
  log(`已尝试以下路径:`)
  for (const p of candidates) dim(`  ${p}`)
  process.exit(1)
}

// ─── 验证 ─────────────────────────────────────────────────────────────

function validateInstallPath(root) {
  const desktopDir = path.join(root, 'apps', 'desktop')
  if (!fs.existsSync(desktopDir)) {
    fail(`未找到 apps/desktop/ 目录: ${desktopDir}`)
    dim('请确认路径是否正确')
    process.exit(1)
  }
  ok(`找到 apps/desktop/ 目录`)
}

// ─── 复制 i18n 文件 ───────────────────────────────────────────────────

function copyI18nFiles(root, patcherDir) {
  const targetDir = path.join(root, 'apps', 'desktop', 'src', 'i18n')
  const sourceDir = path.join(patcherDir, 'i18n')

  // 确保目标目录存在
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true })
    info(`创建目录: src/i18n/`)
  }

  const files = ['zh-CN.ts', 'index.ts']
  for (const file of files) {
    const src = path.join(sourceDir, file)
    const dest = path.join(targetDir, file)
    if (!fs.existsSync(src)) {
      warn(`源文件不存在: i18n/${file}（跳过）`)
      continue
    }
    fs.copyFileSync(src, dest)
    ok(`复制 i18n/${file} → apps/desktop/src/i18n/`)
  }
}

// ─── 替换逻辑 ─────────────────────────────────────────────────────────

function applyReplacements(root, patcherDir) {
  const rulesPath = path.join(patcherDir, 'patcher', 'replacements.js')
  if (!fs.existsSync(rulesPath)) {
    warn(`替换规则文件不存在: ${rulesPath}`)
    return { filesModified: 0, replacementsApplied: 0 }
  }

  // 加载替换规则（使用 require 会自动执行 .js）
  // 清除模块缓存以确保获取最新内容
  delete require.cache[require.resolve(rulesPath)]
  const rules = require(rulesPath)

  let filesModified = 0
  let replacementsApplied = 0

  for (const rule of rules) {
    const filePath = path.join(root, 'apps', 'desktop', rule.file)
    if (!fs.existsSync(filePath)) {
      warn(`源文件不存在，跳过: ${rule.file}`)
      continue
    }

    // 创建备份
    const bakPath = filePath + '.bak'
    if (!fs.existsSync(bakPath)) {
      fs.copyFileSync(filePath, bakPath)
    }

    // 读取文件内容
    let content = fs.readFileSync(filePath, 'utf8')
    const originalContent = content

    // 注入 import（如果需要且文件中还没有）
    if (rule.addImport && !content.includes(rule.addImport)) {
      // 在最后一个 import 语句之后注入
      const lastImportIdx = findLastImportIndex(content)
      if (lastImportIdx >= 0) {
        const before = content.substring(0, lastImportIdx)
        const after = content.substring(lastImportIdx)
        content = before + rule.addImport + '\n' + after
        replacementsApplied++
      } else {
        // 没有找到 import，在文件开头添加
        content = rule.addImport + '\n' + content
        replacementsApplied++
      }
    }

    // 应用字符串替换
    for (const r of rule.replacements) {
      if (content.includes(r.find)) {
        content = content.split(r.find).join(r.replace)
        replacementsApplied++
      } else {
        warn(`未找到匹配文本: ${rule.file} → "${r.find.substring(0, 60)}..."`)
      }
    }

    // 写回文件
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8')
      filesModified++
      ok(`修改: ${rule.file} (${rule.replacements.length} 条规则)`)
    } else {
      dim(`无变化: ${rule.file}`)
    }
  }

  return { filesModified, replacementsApplied }
}

/**
 * 查找最后一个 import 语句的结束位置
 */
function findLastImportIndex(content) {
  const lines = content.split('\n')
  let lastIdx = -1

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    // 匹配 import ... from ... 和 import '...'
    if (line.startsWith('import ') && line.endsWith(';')) {
      // 找到这行的结束位置
      let pos = 0
      for (let j = 0; j <= i; j++) {
        pos += lines[j].length + 1 // +1 for \n
      }
      lastIdx = pos
    }
    // 也匹配 'import type' 语句
    if (line.startsWith('import type ') && line.endsWith(';')) {
      let pos = 0
      for (let j = 0; j <= i; j++) {
        pos += lines[j].length + 1
      }
      lastIdx = pos
    }
  }

  return lastIdx
}

// ─── 自动构建 ──────────────────────────────────────────────────────────

function tryBuild(root) {
  info('尝试自动构建 Desktop...')
  try {
    execSync('npm run build --workspace=@hermes/desktop', {
      cwd: root,
      stdio: 'inherit',
      timeout: 300000 // 5分钟超时
    })
    ok('构建成功')
  } catch (err) {
    warn('自动构建失败，你可以手动运行构建')
    dim(`  cd "${root}" && npm run build --workspace=@hermes/desktop`)
  }
}

// ─── 主函数 ───────────────────────────────────────────────────────────

function main() {
  console.log('')
  console.log(`${BOLD}╔══════════════════════════════════════════╗`)
  console.log(`${BOLD}║   Hermes Desktop 中文汉化一键安装工具     ║`)
  console.log(`${BOLD}╚══════════════════════════════════════════╝${RESET}`)
  console.log('')

  // 获取 patcher 目录（本脚本所在目录的父级）
  const patcherDir = path.resolve(__dirname, '..')

  // 检测安装路径
  const cliArg = process.argv[2]
  const root = detectInstallPath(cliArg)

  // 验证
  validateInstallPath(root)

  log('')
  log(`${BOLD}[1/3]${RESET} 复制 i18n 翻译文件`)
  log('─'.repeat(40))
  copyI18nFiles(root, patcherDir)

  log('')
  log(`${BOLD}[2/3]${RESET} 应用字符串替换`)
  log('─'.repeat(40))
  const { filesModified, replacementsApplied } = applyReplacements(root, patcherDir)

  log('')
  log(`${BOLD}[3/3]${RESET} 统计信息`)
  log('─'.repeat(40))
  ok(`共修改 ${filesModified} 个文件`)
  ok(`共应用 ${replacementsApplied} 处替换`)

  // 询问是否自动构建
  if (filesModified > 0) {
    log('')
    log(`${BOLD}[可选]${RESET} 是否自动运行 npm run build？(y/N)`)
    // 非交互模式下跳过
    if (process.stdin.isTTY) {
      const readline = require('readline')
      const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
      rl.question('', (answer) => {
        rl.close()
        if (answer.trim().toLowerCase() === 'y') {
          tryBuild(root)
        }
        log('')
        console.log(`${BOLD}╔══════════════════════════════════════════╗`)
        console.log(`${BOLD}║   汉化完成！请重启 Hermes Desktop        ║`)
        console.log(`${BOLD}╚══════════════════════════════════════════╝${RESET}`)
        console.log('')
      })
    } else {
      // 非交互模式：如果是 install.cmd/sh 调用的，跳过交互
      log('')
      console.log(`${BOLD}╔══════════════════════════════════════════╗`)
      console.log(`${BOLD}║   汉化完成！请重启 Hermes Desktop        ║`)
      console.log(`${BOLD}╚══════════════════════════════════════════╝${RESET}`)
      console.log('')
    }
  } else {
    log('')
    warn('没有文件需要修改，可能已经汉化过了')
    console.log('')
  }
}

main()
