import { extractToc, estimateReadingTime, parseFrontmatter, type TocItem } from '../lib/markdown'

export interface Post {
  slug: string
  title: string
  date: string
  tags: string[]
  summary: string
  content: string
  readingTime: number
  toc: TocItem[]
}

const modules = import.meta.glob('./posts/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

export const posts: Post[] = Object.entries(modules)
  .map(([path, raw]) => {
    const slug = path.split('/').pop()!.replace(/\.md$/, '')
    const { data, body } = parseFrontmatter(raw)
    const tags = Array.isArray(data.tags) ? data.tags : data.tags ? [data.tags] : []
    return {
      slug,
      title: String(data.title ?? slug),
      date: String(data.date ?? ''),
      tags,
      summary: String(data.summary ?? ''),
      content: body,
      readingTime: estimateReadingTime(body),
      toc: extractToc(body),
    }
  })
  .sort((a, b) => (a.date < b.date ? 1 : -1))

export function getPost(slug: string): Post | undefined {
  return posts.find((post) => post.slug === slug)
}

export function getAdjacent(slug: string): { prev?: Post; next?: Post } {
  const index = posts.findIndex((post) => post.slug === slug)
  return {
    prev: index > 0 ? posts[index - 1] : undefined,
    next: index >= 0 && index < posts.length - 1 ? posts[index + 1] : undefined,
  }
}

export const allTags: string[] = Array.from(new Set(posts.flatMap((post) => post.tags))).sort()
