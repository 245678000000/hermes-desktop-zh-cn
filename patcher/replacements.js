/**
 * Hermes Desktop 中文汉化替换规则
 *
 * 每条规则定义了需要替换的文件路径（相对于 apps/desktop/）以及精确字符串替换。
 * patcher 会读取此文件，逐一应用替换并注入 import 语句。
 *
 * 注意：已使用 t() 函数的文件（如 constants.ts, boot.ts, page-loader.tsx 等）不需要在此列出。
 */

'use strict'

module.exports = [
  // ═══════════════════════════════════════════════════════════════════
  // about-settings.tsx — 部分残留英文
  // ═══════════════════════════════════════════════════════════════════
  {
    file: 'src/app/settings/about-settings.tsx',
    replacements: [
      // "Last checked" 时间显示前缀
      { find: "Last checked {relativeTime(status?.fetchedAt)}", replace: "上次检查 {relativeTime(status?.fetchedAt)}" },
    ]
  },

  // ═══════════════════════════════════════════════════════════════════
  // desktop-onboarding-overlay.tsx — 大量硬编码英文
  // ═══════════════════════════════════════════════════════════════════
  {
    file: 'src/components/desktop-onboarding-overlay.tsx',
    addImport: "import { t } from '@/i18n'",
    replacements: [
      // FlowSubtitle 常量 - 需要替换带引号的完整值
      { find: "pkce: 'Opens your browser to sign in, then continues here',", replace: "pkce: t('onboarding.pkceSubtitle')," },
      { find: "device_code: 'Opens a verification page in your browser \u2014 Hermes connects automatically',", replace: "device_code: t('onboarding.deviceCodeSubtitle')," },
      { find: "external: 'Sign in once in your terminal, then come back to chat'", replace: "external: t('onboarding.externalSubtitle')" },

      // Header 组件
      { find: "Let's get you setup with Hermes Agent", replace: "t('onboarding.title')" },
      { find: "Connect a model provider to start chatting. Most options take one click.", replace: "t('onboarding.subtitle')" },

      // Preparing 组件
      { find: "'Hermes is finishing install. This usually takes under a minute on first run.'", replace: "t('onboarding.installing')" },
      { find: "'Starting Hermes\u2026'", replace: "t('onboarding.starting')" },

      // Picker 组件
      { find: "'Looking up providers...'", replace: "t('common.loading')" },
      { find: "{showAll ? 'Collapse' : 'Other providers'}", replace: "{showAll ? t('onboarding.collapse') : t('onboarding.otherProviders')}" },
      { find: "I have an API key", replace: "t('onboarding.haveKey')" },

      // FeaturedProviderRow - 使用更精确的匹配
      { find: ">{Recommended}<", replace: `>{t('onboarding.recommended')}<` },

      // FEATURED_PITCH 常量
      { find: "'One subscription, 300+ frontier models \u2014 the recommended way to run Hermes'", replace: "t('onboarding.nousDesc')" },

      // KeyProviderRow
      { find: "'One key, hundreds of models \u2014 a solid default'", replace: "t('onboarding.oneKey')" },

      // ApiKeyForm
      { find: "Back to sign in", replace: "t('onboarding.backToSignIn')" },
      { find: "'Could not save credential.'", replace: "t('onboarding.saveFailed')" },
      { find: "'Paste API key'", replace: "t('onboarding.pasteKey')" },
      { find: "{saving ? 'Connecting' : 'Connect'}", replace: "{saving ? t('onboarding.connecting') : t('onboarding.connect')}" },

      // FlowPanel
      { find: "`Starting sign-in for ${title}...`", replace: "t('onboarding.startingSignIn', { provider: title })" },
      { find: "`Verifying your code with ${title}...`", replace: "t('onboarding.verifying', { provider: title })" },
      { find: "`${title} connected. Picking a default model...`", replace: "t('onboarding.pickingModel')" },
      { find: "'Sign-in failed. Try again.'", replace: "t('onboarding.signInFailed')" },
      { find: "Pick a different provider", replace: "t('onboarding.pickDifferent')" },
      { find: "`Sign in with ${title}`", replace: "t('onboarding.signInWith', { provider: title })" },
      { find: "`We opened ${title} in your browser.`", replace: "t('onboarding.openedBrowser', { provider: title })" },
      { find: "Authorize Hermes there.", replace: "t('onboarding.authorize')" },
      { find: "Copy the authorization code and paste it below.", replace: "t('onboarding.copyCode')" },
      { find: "'Paste authorization code'", replace: "t('onboarding.pasteCode')" },
      { find: "Re-open authorization page", replace: "t('onboarding.reopenAuth')" },
      // external_pending
      { find: "`Waiting for you to authorize...`", replace: "t('onboarding.authorize') + '...'" },

      // CodeBlock
      { find: "{copied ? <Check className=\"size-4\" /> : 'Copy'}", replace: "{copied ? <Check className=\"size-4\" /> : t('onboarding.copy')}" },

      // ConfirmingModelPanel
      { find: ">Default model<", replace: `>{t('onboarding.defaultModel')}<` },
      { find: ">Free tier<", replace: `>{t('onboarding.freeTier')}<` },
      { find: ">Pro<", replace: `>{t('onboarding.pro')}<` },
      { find: "price.free ? 'Free' : `${price.input || '?'} in / ${price.output || '?'} out per Mtok`", replace: "price.free ? t('onboarding.free') : t('onboarding.tokenInOut', { in: price.input || '?', out: price.output || '?' })" },
      { find: ">Change<", replace: `>{t('onboarding.change')}<` },
      { find: ">Start chatting<", replace: `>{t('onboarding.startChatting')}<` },

      // DocsLink (Get a key)
      { find: ">Get a key<", replace: `>{t('onboarding.getAKey')}<` },
    ]
  },

  // ═══════════════════════════════════════════════════════════════════
  // updates-overlay.tsx — 部分残留英文
  // ═══════════════════════════════════════════════════════════════════
  {
    file: 'src/app/updates-overlay.tsx',
    replacements: [
      // ApplyingView
      { find: "'Updating Hermes\u2026'", replace: "t('update.restarting')" },
      // ErrorView
      { find: ">Try again<", replace: `>{t('common.retry')}<` },
      { find: ">Not now<", replace: `>{t('update.notNow')}<` },
    ]
  },

  // ═══════════════════════════════════════════════════════════════════
  // sidebar/index.tsx — 硬编码英文导航和标签
  // ═══════════════════════════════════════════════════════════════════
  {
    file: 'src/app/chat/sidebar/index.tsx',
    addImport: "import { t } from '@/i18n'",
    replacements: [
      // SIDEBAR_NAV
      { find: "label: 'New agent'", replace: "label: t('sidebar.newAgent')" },
      { find: "label: 'Skills'", replace: "label: t('sidebar.skills')" },
      { find: "label: 'Messaging'", replace: "label: t('sidebar.messaging')" },
      { find: "label: 'Artifacts'", replace: "label: t('sidebar.artifacts')" },
      // SidebarAllPinnedState
      { find: "Everything here is pinned. Unpin a chat to show it in recents.", replace: "t('sidebar.allPinned')" },
      // SidebarPinnedEmptyState
      { find: "Shift click to pin a chat", replace: "t('sidebar.shiftClickPin')" },
      // Section labels
      { find: 'label="Pinned"', replace: 'label={t("sidebar.pinned")}' },
      { find: 'label="Agents"', replace: 'label={t("sidebar.agents")}' },
      // aria-labels
      { find: "aria-label={agentsGrouped ? 'Show agents as a single list' : 'Group agents by workspace'}", replace: "aria-label={agentsGrouped ? t('sidebar.showSingle') : t('sidebar.groupWorkspace')}" },
      { find: "title={agentsGrouped ? 'Ungroup agents' : 'Group by workspace'}", replace: "title={agentsGrouped ? t('sidebar.ungroup') : t('sidebar.group')}" },
      // SidebarLoadMoreRow
      { find: "const label = loading ? 'Loading\u2026' : step > 0 ? `Load ${step} more` : 'Load more'", replace: "const label = loading ? t('sidebar.loading') : step > 0 ? t('sidebar.loadNMore', { n: step }) : t('sidebar.loadMore')" },
      // No workspace fallback
      { find: "'No workspace'", replace: "t('cron.noWorkspace')" },
    ]
  },

  // ═══════════════════════════════════════════════════════════════════
  // composer/index.tsx — 硬编码英文 placeholder 和按钮
  // ═══════════════════════════════════════════════════════════════════
  {
    file: 'src/app/chat/composer/index.tsx',
    addImport: "import { t } from '@/i18n'",
    replacements: [
      // placeholder
      { find: "const placeholder = disabled ? 'Starting Hermes...' : 'Send follow-up'", replace: "const placeholder = disabled ? t('composer.startingHermes') : t('composer.sendFollowUp')" },
      // aria-label
      { find: 'aria-label="Message"', replace: 'aria-label={t("composer.message")}' },
      // Editing queued turn
      { find: "Editing queued turn in composer", replace: "t('composer.editingQueue')" },
      // Cancel / Save buttons in queue edit
      { find: ">Cancel<", replace: `>{t('composer.cancel')}<` },
      { find: ">Save<", replace: `>{t('composer.save')}<` },
    ]
  },

  // ═══════════════════════════════════════════════════════════════════
  // composer/controls.tsx — 硬编码英文 aria-label 和 title
  // ═══════════════════════════════════════════════════════════════════
  {
    file: 'src/app/chat/composer/controls.tsx',
    addImport: "import { t } from '@/i18n'",
    replacements: [
      // Start voice conversation
      { find: 'aria-label="Start voice conversation"', replace: 'aria-label={t("composer.startVoice")}' },
      { find: 'title="Start voice conversation"', replace: 'title={t("composer.startVoice")}' },
      // Send/Queue/Stop aria-label
      { find: "aria-label={busy ? (busyAction === 'queue' ? 'Queue message' : 'Stop') : 'Send'}", replace: "aria-label={busy ? (busyAction === 'queue' ? t('composer.queueMessage') : t('composer.stop')) : t('composer.send')}" },
      { find: "title={busy ? (busyAction === 'queue' ? 'Queue message' : 'Stop') : 'Send'}", replace: "title={busy ? (busyAction === 'queue' ? t('composer.queueMessage') : t('composer.stop')) : t('composer.send')}" },
      // ConversationPill - mute
      { find: "aria-label={muted ? 'Unmute microphone' : 'Mute microphone'}", replace: "aria-label={muted ? t('composer.unmute') : t('composer.mute')}" },
      { find: "title={muted ? 'Unmute microphone' : 'Mute microphone'}", replace: "title={muted ? t('composer.unmute') : t('composer.mute')}" },
      // Stop listening
      { find: 'aria-label="Stop listening and send"', replace: 'aria-label={t("composer.stopListening")}' },
      { find: 'title="Stop listening and send"', replace: 'title={t("composer.stopListening")}' },
      { find: "<span>Stop</span>", replace: "<span>{t('composer.stop')}</span>" },
      // End voice conversation
      { find: 'aria-label="End voice conversation"', replace: 'aria-label={t("composer.endVoice")}' },
      { find: 'title="End voice conversation"', replace: 'title={t("composer.endVoice")}' },
      { find: "<span>End</span>", replace: "<span>{t('composer.end')}</span>" },
      // Conversation status label
      { find: "? 'Speaking'", replace: "? t('composer.speaking')" },
      { find: ": 'Transcribing'", replace: ": t('composer.transcribing')" },
      { find: ": 'Thinking'", replace: ": t('composer.thinking')" },
      { find: ": 'Muted'", replace: ": t('composer.muted')" },
      { find: ": 'Listening'", replace: ": t('composer.listening')" },
    ]
  },

  // ═══════════════════════════════════════════════════════════════════
  // composer/context-menu.tsx — 硬编码英文菜单项
  // ═══════════════════════════════════════════════════════════════════
  {
    file: 'src/app/chat/composer/context-menu.tsx',
    addImport: "import { t } from '@/i18n'",
    replacements: [
      { find: ">Attach<", replace: `>{t('ctx.attach')}<` },
      { find: "Files\u2026", replace: "t('ctx.files')" },
      { find: "Folder\u2026", replace: "t('ctx.folder')" },
      { find: "Images\u2026", replace: "t('ctx.images')" },
      { find: "Paste image", replace: "t('ctx.pasteImage')" },
      { find: "URL\u2026", replace: "t('ctx.url')" },
      { find: "<span>Prompt snippets</span>", replace: `<span>{t('ctx.promptSnippets')}</span>` },
      { find: "{ label: 'Code review'", replace: "{ label: t('ctx.codeReview')" },
      { find: "{ label: 'Implementation plan'", replace: "{ label: t('ctx.implementationPlan')" },
      { find: "{ label: 'Explain this'", replace: "{ label: t('ctx.explainThis')" },
    ]
  },

  // ═══════════════════════════════════════════════════════════════════
  // session-actions-menu.tsx — 硬编码英文菜单和对话框
  // ═══════════════════════════════════════════════════════════════════
  {
    file: 'src/app/chat/sidebar/session-actions-menu.tsx',
    addImport: "import { t } from '@/i18n'",
    replacements: [
      // Menu items
      { find: "label: pinned ? 'Unpin' : 'Pin'", replace: "label: pinned ? t('session.unpin') : t('session.pin')" },
      { find: "label: 'Copy ID'", replace: "label: t('session.copyId')" },
      { find: "label: 'Export'", replace: "label: t('session.export')" },
      { find: "label: 'Rename'", replace: "label: t('session.rename')" },
      { find: "label: 'Delete'", replace: "label: t('session.delete')" },
      // Rename dialog
      { find: "<DialogTitle>Rename session</DialogTitle>", replace: "<DialogTitle>{t('session.renameTitle')}</DialogTitle>" },
      { find: "<DialogDescription>Give this chat a memorable title. Leave empty to clear.</DialogDescription>", replace: `<DialogDescription>{t('session.renameHint')}</DialogDescription>` },
      { find: "'Untitled session'", replace: "t('session.untitled')" },
      { find: "notify({ durationMs: 2_000, kind: 'success', message: 'Renamed' })", replace: "notify({ durationMs: 2_000, kind: 'success', message: t('session.renamed') })" },
      { find: "notifyError(err, 'Rename failed')", replace: "notifyError(err, t('session.renameFailed'))" },
      { find: ">Cancel<", replace: `>{t('common.cancel')}<` },
      { find: ">Save<", replace: `>{t('common.save')}<` },
    ]
  },

  // ═══════════════════════════════════════════════════════════════════
  // notifications.tsx — 少量残留英文
  // ═══════════════════════════════════════════════════════════════════
  {
    file: 'src/components/notifications.tsx',
    replacements: [
      { find: 'aria-label="Notifications"', replace: 'aria-label={t("common.notifications")}' },
      { find: 'aria-label="Dismiss notification"', replace: 'aria-label={t("common.close")}' },
    ]
  },

  // ═══════════════════════════════════════════════════════════════════
  // chat/intro.tsx — Fallback copy 英文
  // ═══════════════════════════════════════════════════════════════════
  {
    file: 'src/components/chat/intro.tsx',
    addImport: "import { t } from '@/i18n'",
    replacements: [
      // FALLBACK_COPY - 仅替换 headline
      { find: "'What are we moving today?'", replace: "t('intro.greetings')" },
      { find: "'What\\'s on your mind?'", replace: "t('intro.greetings')" },
      { find: "'What should Hermes look at?'", replace: "t('intro.greetings')" },
      { find: "'Where should we start?'", replace: "t('intro.greetings')" },
      { find: "'What needs attention?'", replace: "t('intro.greetings')" },
    ]
  },

  // ═══════════════════════════════════════════════════════════════════
  // desktop-install-overlay.tsx — 残留英文
  // ═══════════════════════════════════════════════════════════════════
  {
    file: 'src/components/desktop-install-overlay.tsx',
    replacements: [
      // 日志行数显示
      { find: "({state.log.length} line{state.log.length === 1 ? '' : 's'})", replace: "({state.log.length} {state.log.length === 1 ? 'line' : 'lines'})" },
      // 日志保存提示
      { find: "Full transcript saved to", replace: "t('install.fullTranscript') + ' '" },
    ]
  },

  // ═══════════════════════════════════════════════════════════════════
  // plugins/hermes-bots/plugin.js — Hermes Bots 插件界面汉化
  // ═══════════════════════════════════════════════════════════════════
  {
    file: 'src/plugins/hermes-bots/plugin.js',
    replacements: [
      { find: '"New Bot"', replace: '"新建机器人"' },
      { find: '"Create Bot"', replace: '"创建机器人"' },
      { find: '"What should this Bot help with?"', replace: '"这个机器人主要负责什么工作？"' },
      { find: '"What should this agent help with?"', replace: '"该智能体主要负责什么？"' },
      { find: '"New chat with this agent"', replace: '"与该智能体开启新对话"' },
      { find: '"Hidden from the roster"', replace: '"从花名册中隐藏"' },
      { find: '"The default profile cannot be deleted."', replace: '"默认配置不能被删除。"' },
      { find: '"Agent Inbox"', replace: '"智能体收件箱"' },
      { find: '"A bot"', replace: '"机器人"' },
      { find: '"Routines"', replace: '"例程任务"' },
      { find: '"Schedule"', replace: '"执行计划"' },
      { find: '"Create Cronjob"', replace: '"创建定时任务"' },
      { find: '"Create a cronjob for this bot"', replace: '"为此机器人创建定时任务"' },
      { find: '"Delete cronjob"', replace: '"删除定时任务"' },
      { find: '"Manage groups"', replace: '"管理群组"' },
      { find: '"Remove from all groups"', replace: '"从所有群组中移除"' },
      { find: '"Select a Bot or group first."', replace: '"请先选择一个机器人或群组。"' },
      { find: '"Bot Chat"', replace: '"机器人对话"' },
      { find: '"Status unknown"', replace: '"状态未知"' },
      { find: '"Could not load bot metadata"', replace: '"无法加载机器人元数据"' },
      { find: '"Could not load bot"', replace: '"无法加载机器人"' },
      { find: '"Could not load bot groups"', replace: '"无法加载机器人群组"' },
      { find: '"Could not create the agent."', replace: '"创建智能体失败。"' },
      { find: '"Update this gateway to use Bot Mode"', replace: '"请升级网关以启用机器人模式"' },
      { find: '"Update Hermes Desktop to open another Bot chat."', replace: '"请升级 Hermes Desktop 以打开新的机器人对话。"' },
      { find: '"Group picture generation failed"', replace: '"群头像生成失败"' },
      { find: '"No free name for the group."', replace: '"群组名称已被占用。"' },
    ]
  },
]

