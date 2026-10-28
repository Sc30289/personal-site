import GithubSlugger from 'github-slugger'

export interface TocItem {
  id: string
  text: string
  level: 2 | 3
}

export interface Frontmatter {
  [key: string]: string | string[]
}

/** 解析极简 frontmatter（只支持 key: value 与 key: [a, b]）。 */
export function parseFrontmatter(raw: string): { data: Frontmatter; body: string } {
  const normalized = raw.replace(/\r\n/g, '\n')
  if (!normalized.startsWith('---\n')) return { data: {}, body: normalized }

  const end = normalized.indexOf('\n---', 4)
  if (end === -1) return { data: {}, body: normalized }

  const head = normalized.slice(4, end)
  const body = normalized.slice(end + 4).replace(/^\n+/, '')

  const data: Frontmatter = {}
  for (const line of head.split('\n')) {
    const match = line.match(/^([A-Za-z0-9_-]+)\s*:\s*(.*)$/)
    if (!match) continue
    const [, key, rawValue] = match
    const value = rawValue.trim()
    if (value.startsWith('[') && value.endsWith(']')) {
      data[key] = value
        .slice(1, -1)
        .split(',')
        .map((item) => item.trim().replace(/^['"]|['"]$/g, ''))
        .filter(Boolean)
    } else {
      data[key] = value.replace(/^['"]|['"]$/g, '')
    }
  }
  return { data, body }
}

/** 从 Markdown 正文中提取 h2/h3，生成与 rehype-slug 一致的锚点。 */
export function extractToc(markdown: string): TocItem[] {
  const slugger = new GithubSlugger()
  const items: TocItem[] = []
  const lines = markdown.replace(/\r\n/g, '\n').split('\n')
  let inFence = false

  for (const line of lines) {
    if (/^\s*(```|~~~)/.test(line)) {
      inFence = !inFence
      continue
    }
    if (inFence) continue

    const match = line.match(/^(#{2,3})\s+(.+?)\s*#*\s*$/)
    if (!match) continue

    const level = match[1].length as 2 | 3
    const text = match[2]
      .replace(/`([^`]*)`/g, '$1')
      .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
      .replace(/[*_]{1,2}/g, '')
      .trim()

    items.push({ id: slugger.slug(text), text, level })
  }
  return items
}

/** 中文按 300 字/分钟、英文按 200 词/分钟估算阅读时长。 */
export function estimateReadingTime(markdown: string): number {
  const text = markdown.replace(/```[\s\S]*?```/g, ' ').replace(/[#>*_`|-]/g, ' ')
  const cjk = (text.match(/[\u4e00-\u9fa5]/g) ?? []).length
  const words = (text.replace(/[\u4e00-\u9fa5]/g, ' ').match(/[A-Za-z0-9]+/g) ?? []).length
  const minutes = cjk / 300 + words / 200
  return Math.max(1, Math.round(minutes))
}

const MONTHS = [
  '1 月',
  '2 月',
  '3 月',
  '4 月',
  '5 月',
  '6 月',
  '7 月',
  '8 月',
  '9 月',
  '10 月',
  '11 月',
  '12 月',
]

/** 2025-06-18 -> 2025 年 6 月 18 日 */
export function formatDate(value: string): string {
  const [year, month, day] = value.split('-').map((part) => Number(part))
  if (!year || !month || !day) return value
  return `${year} 年 ${MONTHS[month - 1]} ${day} 日`
}

export function shortDate(value: string): string {
  const [year, month, day] = value.split('-')
  return `${year}.${month}.${day}`
}
