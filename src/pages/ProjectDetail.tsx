import { Link, useParams } from 'react-router-dom'
import CoverArt from '../components/CoverArt'
import Icon from '../components/Icon'
import Markdown from '../components/Markdown'
import NotFound from './NotFound'
import { useSiteData } from '../store/siteData'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

const linkIcon = { github: 'github', demo: 'external', doc: 'download' } as const

export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>()
  const { data } = useSiteData()
  const projects = data.projects
  const profile = data.profile
  const project = projects.find((item) => item.slug === slug)
  useDocumentTitle(project ? project.title : '项目未找到')

  if (!project) return <NotFound />

  const index = projects.findIndex((item) => item.slug === project.slug)
  const next = projects[(index + 1) % projects.length]

  return (
    <main id="main" className="pb-24">
      <div className="container-page pt-28 sm:pt-32">
        <Link
          to="/projects"
          className="inline-flex items-center gap-1.5 text-[13px] text-muted transition-colors hover:text-white"
        >
          <Icon name="arrow-left" size={15} />
          全部项目
        </Link>

        <div className="mt-8 flex flex-wrap items-center gap-2 text-[12px] text-muted">
          <span className="font-mono">{project.year}</span>
          <span className="h-1 w-1 rounded-full bg-muted/50" />
          {project.tags.map((tag) => (
            <span key={tag} className="rounded-full bg-white/[0.05] px-2.5 py-1">
              {tag}
            </span>
          ))}
        </div>

        <h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
          {project.title}
        </h1>
        <p className="mt-4 max-w-2xl text-[15px] leading-7 text-muted">{project.subtitle}</p>

        <div className="mt-7 flex flex-wrap items-center gap-3">
          {project.links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              className={link.kind === 'demo' ? 'btn-primary' : 'btn-ghost'}
            >
              <Icon name={linkIcon[link.kind]} size={15} />
              {link.label}
              <Icon name="arrow-up-right" size={13} />
            </a>
          ))}
        </div>

        <CoverArt
          from={project.cover.from}
          to={project.cover.to}
          pattern={project.cover.pattern}
          mark={project.cover.mark}
          className="mt-10 h-44 w-full rounded-2xl border border-white/[0.08] sm:h-56"
        />

        <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,1fr)_280px]">
          <div className="min-w-0">
            <Markdown content={project.description} />
          </div>

          <aside className="space-y-5 lg:sticky lg:top-28 lg:self-start">
            <div className="card p-6">
              <h2 className="text-sm font-medium text-white">项目亮点</h2>
              <ul className="mt-4 space-y-3">
                {project.highlights.map((item) => (
                  <li key={item} className="flex gap-2.5 text-[12.5px] leading-6 text-muted">
                    <Icon name="check" size={14} className="mt-1 shrink-0 text-accent" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="card p-6">
              <h2 className="text-sm font-medium text-white">联系方式</h2>
              <p className="mt-3 text-[12.5px] leading-6 text-muted">
                对这个项目有疑问，或者想聊类似的东西？欢迎直接发邮件。
              </p>
              <a href={`mailto:${profile.email}`} className="mt-4 inline-flex items-center gap-1.5 text-[13px] text-accent hover:text-amber-200">
                <Icon name="mail" size={14} />
                {profile.email}
              </a>
            </div>
          </aside>
        </div>

        <div className="mt-16 border-t border-white/[0.06] pt-8">
          <Link to={`/projects/${next.slug}`} className="group flex items-center justify-between gap-6">
            <div>
              <p className="text-[11px] uppercase tracking-[0.25em] text-muted/60">下一个项目</p>
              <p className="mt-2 text-lg font-medium text-white transition-colors group-hover:text-accent">
                {next.title}
              </p>
            </div>
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-muted transition-all group-hover:border-accent/40 group-hover:text-accent">
              <Icon name="arrow-right" size={18} />
            </span>
          </Link>
        </div>
      </div>
    </main>
  )
}
