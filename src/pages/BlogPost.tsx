import { Link, useParams } from 'react-router-dom'
import Icon from '../components/Icon'
import Markdown from '../components/Markdown'
import Toc from '../components/Toc'
import NotFound from './NotFound'
import { getAdjacent, getPost } from '../content/posts'
import { formatDate } from '../lib/markdown'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>()
  const post = slug ? getPost(slug) : undefined
  useDocumentTitle(post ? post.title : '文章未找到')

  if (!post) return <NotFound />

  const { prev, next } = getAdjacent(post.slug)

  return (
    <main id="main" className="pb-24">
      <article className="container-page pt-28 sm:pt-32">
        <Link
          to="/blog"
          className="inline-flex items-center gap-1.5 text-[13px] text-muted transition-colors hover:text-white"
        >
          <Icon name="arrow-left" size={15} />
          返回博客列表
        </Link>

        <header className="mt-8 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted">
            {post.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-white/[0.05] px-2.5 py-1">
                {tag}
              </span>
            ))}
          </div>
          <h1 className="mt-4 text-3xl font-semibold leading-tight tracking-tight text-white sm:text-[40px]">
            {post.title}
          </h1>
          <div className="mt-5 flex flex-wrap items-center gap-4 text-[12px] text-muted">
            <span className="inline-flex items-center gap-1.5">
              <Icon name="calendar" size={14} />
              {formatDate(post.date)}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Icon name="clock" size={14} />
              约 {post.readingTime} 分钟读完
            </span>
          </div>
          <div className="mt-6 h-px w-full bg-gradient-to-r from-white/15 to-transparent" />
        </header>

        <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,1fr)_220px]">
          <div className="min-w-0">
            <Markdown content={post.content} />

            <div className="mt-14 grid gap-4 border-t border-white/[0.06] pt-8 sm:grid-cols-2">
              {prev ? (
                <Link to={`/blog/${prev.slug}`} className="card group p-5">
                  <p className="text-[11px] text-muted">上一篇</p>
                  <p className="mt-1.5 text-sm font-medium text-white transition-colors group-hover:text-accent">
                    {prev.title}
                  </p>
                </Link>
              ) : (
                <span />
              )}
              {next ? (
                <Link to={`/blog/${next.slug}`} className="card group p-5 sm:text-right">
                  <p className="text-[11px] text-muted">下一篇</p>
                  <p className="mt-1.5 text-sm font-medium text-white transition-colors group-hover:text-accent">
                    {next.title}
                  </p>
                </Link>
              ) : null}
            </div>
          </div>

          <aside>
            <Toc items={post.toc} />
          </aside>
        </div>
      </article>
    </main>
  )
}
