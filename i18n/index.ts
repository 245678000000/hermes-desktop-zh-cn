/**
 * Lightweight i18n utility for Hermes Desktop.
 * No external dependencies — just a typed lookup with fallback.
 */

import zhCN from './zh-CN'

/**
 * Translate a key to Chinese.
 * Supports simple template interpolation: {{n}}, {{in}}, {{out}}, {{key}}
 */
export function t(key: string, vars?: Record<string, string | number>): string {
  const raw = zhCN[key]
  if (raw === undefined) return key // fallback: return key itself
  if (!vars) return raw
  return raw.replace(/\{\{(\w+)\}\}/g, (_, name) => String(vars[name] ?? `{{${name}}}`))
}

/**
 * Hook-compatible wrapper: use `const { t } = useI18n()`
 * in React components. Returns the same `t` function.
 */
export function useI18n() {
  return { t }
}

export default zhCN
