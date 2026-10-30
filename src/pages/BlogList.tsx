import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import Icon from '../components/Icon'
import { useSiteData } from '../store/siteData'
import { shortDate } from '../lib/markdown'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export default function BlogList() {
  useDocumentTitle('博客')
  const { posts } = useSiteData()
  const allTags = useMemo(
    () => Array.from(new Set(posts.flatMap((post) => post.tags))).sort(),
    [posts],
  )
  const [query, setQuery] = useState('')
  const [tag, setTag] = useState('全部')

  const filtered = useMemo(() => {
    const keyword = query.trim().toLowerCase()
    return posts.filter((post) => {
      const byTag = tag === '全部' || post.tags.includes(tag)
      const byQuery =
        !keyword ||
        post.title.toLowerCase().includes(keyword) ||
        post.summary.toLowerCase().includes(keyword) ||
        post.tags.some((item) => item.toLowerCase().includes(keyword))
      return byTag && byQuery
    })
  }, [query, tag])

  return (
    <main id="main" className="pb-24">
      <PageHeader
        eyebrow="Blog"
        title="写点东西"
        desc="关于前端、扩展、AI 和单片机。多数文章来自真实项目里的问题与取舍。"
      >
        <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center">
          <label className="relative block w-full sm:max-w-xs">
            <span className="sr-only">搜索文章</span>
            <Icon
              name="search"
              size={16}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
            />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="搜索标题、摘要或标签"
              className="w-full rounded-full border border-white/10 bg-white/[0.03] py-2.5 pl-11 pr-4 text-sm text-mist placeholder:text-muted/60 focus:border-accent/50 focus:outline-none"
            />
          </label>
          <div className="flex flex-wrap gap-2">
            {['全部', ...allTags].map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setTag(item)}
                aria-pressed={tag === item}
                className={`rounded-full px-3.5 py-1.5 text-[12px] transition-all ${
                  tag === item
                    ? 'bg-accent text-ink-950'
                    : 'border border-white/10 text-muted hover:text-white'
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </PageHeader>

      <div className="container-page mt-10">
        <p className="text-[12px] text-muted">共 {filtered.length} 篇文章</p>

        {filtered.length === 0 ? (
          <div className="card mt-6 flex flex-col items-center justify-center gap-3 py-20 text-center">
            <Icon name="search" size={24} className="text-muted" />
            <p className="text-sm text-mist">没有找到匹配的文章</p>
            <p className="text-[12px] text-muted">换个关键词或标签试试</p>
          </div>
        ) : (
          <div className="mt-4 grid gap-5 md:grid-cols-2">
            {filtered.map((post) => (
              <Link
                key={post.slug}
                to={`/blog/${post.slug}`}
                className="card group flex h-full flex-col p-6 transition-all duration-300 hover:-translate-y-1 hover:border-accent/25"
              >
                <div className="flex items-center justify-between text-[11px] text-muted">
                  <span className="font-mono">{shortDate(post.date)}</span>
                  <span className="inline-flex items-center gap-1">
                    <Icon name="clock" size={12} />
                    {post.readingTime} 分钟
                  </span>
                </div>
                <h2 className="mt-3 text-lg font-semibold leading-7 text-white transition-colors group-hover:text-accent">
                  {post.title}
                </h2>
                <p className="mt-2 line-clamp-3 text-[13px] leading-6 text-muted">{post.summary}</p>
                <div className="mt-auto flex flex-wrap items-center gap-2 pt-5 text-[11px] text-muted/80">
                  {post.tags.map((item) => (
                    <span key={item} className="rounded-full bg-white/[0.05] px-2 py-0.5">
                      {item}
                    </span>
                  ))}
                  <span className="ml-auto inline-flex items-center gap-1 text-accent opacity-0 transition-opacity group-hover:opacity-100">
                    阅读
                    <Icon name="arrow-right" size={13} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
