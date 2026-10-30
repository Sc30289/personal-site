import { Link } from 'react-router-dom'
import { useSiteData } from '../store/siteData'
import { shortDate } from '../lib/markdown'
import Icon from './Icon'
import Reveal from './Reveal'
import SectionHead from './SectionHead'

export default function BlogSection() {
  const { posts } = useSiteData()
  const latest = posts.slice(0, 3)

  return (
    <section id="blog" className="relative scroll-mt-24 py-24 sm:py-28">
      <div className="container-page">
        <SectionHead
          eyebrow="04 / Blog"
          title="最近写的"
          desc="把项目里踩过的坑、做过的取舍写下来，既是记录，也是复盘。"
          action={
            <Link to="/blog" className="btn-ghost">
              全部文章
              <Icon name="arrow-up-right" size={15} />
            </Link>
          }
        />

        <div className="mt-12 divide-y divide-black/[0.06] border-y border-black/[0.06]">
          {latest.map((post, index) => (
            <Reveal key={post.slug} delay={index * 60}>
              <Link
                to={`/blog/${post.slug}`}
                className="group grid gap-3 py-6 transition-colors hover:bg-black/[0.02] sm:grid-cols-[124px_1fr_40px] sm:items-center sm:gap-6"
              >
                <span className="font-mono text-[12px] tracking-wide text-muted/80">
                  {shortDate(post.date)}
                </span>
                <div>
                  <h3 className="text-[17px] font-medium text-[#111827] transition-colors group-hover:text-accent">
                    {post.title}
                  </h3>
                  <p className="mt-1.5 line-clamp-2 text-[13px] leading-6 text-muted">{post.summary}</p>
                  <div className="mt-2.5 flex flex-wrap items-center gap-2 text-[11px] text-muted/80">
                    {post.tags.map((tag) => (
                      <span key={tag} className="rounded-full bg-black/[0.05] px-2 py-0.5">
                        {tag}
                      </span>
                    ))}
                    <span className="inline-flex items-center gap-1">
                      <Icon name="clock" size={12} />
                      {post.readingTime} 分钟
                    </span>
                  </div>
                </div>
                <span className="hidden justify-self-end text-muted transition-all group-hover:translate-x-1 group-hover:text-accent sm:block">
                  <Icon name="arrow-right" size={18} />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
