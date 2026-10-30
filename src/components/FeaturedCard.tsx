import { Link } from 'react-router-dom'
import type { Project } from '../content/projects'
import CoverArt from './CoverArt'
import Icon from './Icon'

const linkIcon = { github: 'github', demo: 'external', doc: 'download' } as const

interface FeaturedCardProps {
  project: Project
  index: number
}

/** 首页「精选作品」大卡片：整卡可点击进入详情页，右下角保留在线体验入口。 */
export default function FeaturedCard({ project, index }: FeaturedCardProps) {
  const demo = project.links.find((link) => link.kind === 'demo')

  return (
    <article className="group card relative flex h-full flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:border-accent/30 hover:shadow-glow">
      <Link
        to={`/projects/${project.slug}`}
        className="absolute inset-0 z-10 rounded-2xl focus-visible:ring-2 focus-visible:ring-accent"
        aria-label={`查看项目：${project.title}`}
      />

      <div className="relative">
        <CoverArt
          from={project.cover.from}
          to={project.cover.to}
          pattern={project.cover.pattern}
          mark={project.cover.mark}
          className="h-52 w-full transition-transform duration-500 group-hover:scale-[1.03]"
        />
        <span className="absolute left-4 top-4 rounded-full border border-white/15 bg-ink-950/70 px-3 py-1 text-[11px] font-medium text-white/90 backdrop-blur">
          精选 0{index + 1}
        </span>
      </div>

      <div className="relative flex flex-1 flex-col p-6">
        <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted">
          <span className="font-mono">{project.year}</span>
          <span className="h-1 w-1 rounded-full bg-muted/50" />
          {project.tags.map((tag) => (
            <span key={tag} className="rounded-full bg-white/[0.05] px-2 py-0.5">
              {tag}
            </span>
          ))}
        </div>

        <h3 className="mt-3 text-xl font-semibold leading-7 text-white transition-colors group-hover:text-accent">
          {project.title}
        </h3>
        <p className="mt-2 line-clamp-3 text-[13px] leading-6 text-muted">{project.summary}</p>

        <div className="mt-auto flex items-center justify-between gap-3 pt-6">
          <span className="link-arrow">
            查看详情
            <Icon name="arrow-right" size={15} />
          </span>
          {demo ? (
            <a
              href={demo.href}
              target="_blank"
              rel="noreferrer"
              className="relative z-20 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[12px] text-mist transition-colors hover:border-accent/40 hover:text-white"
            >
              <Icon name={linkIcon[demo.kind]} size={13} />
              {demo.label}
              <Icon name="arrow-up-right" size={11} />
            </a>
          ) : null}
        </div>
      </div>
    </article>
  )
}
