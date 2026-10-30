import { Link } from 'react-router-dom'
import type { Project } from '../content/projects'
import CoverArt from './CoverArt'
import Icon from './Icon'

const linkIcon: Record<string, 'github' | 'external' | 'download'> = {
  github: 'github',
  demo: 'external',
  doc: 'download',
}

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="group card relative flex h-full flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-accent/25 hover:shadow-glow">
      {/* 整卡点击进入详情页；外链通过更高层级保持可点 */}
      <Link
        to={`/projects/${project.slug}`}
        className="absolute inset-0 z-10 rounded-2xl focus-visible:ring-2 focus-visible:ring-accent"
        aria-label={`查看项目：${project.title}`}
      />

      <CoverArt
        from={project.cover.from}
        to={project.cover.to}
        pattern={project.cover.pattern}
        mark={project.cover.mark}
        className="h-44 w-full"
      />

      <div className="relative flex flex-1 flex-col p-6">
        <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted">
          <span className="font-mono">{project.year}</span>
          <span className="h-1 w-1 rounded-full bg-muted/50" />
          {project.tags.map((tag) => (
            <span key={tag} className="rounded-full bg-black/[0.05] px-2 py-0.5">
              {tag}
            </span>
          ))}
        </div>

        <h3 className="mt-3 text-lg font-semibold text-[#111827] transition-colors group-hover:text-accent">
          {project.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-[13px] leading-6 text-muted">{project.summary}</p>

        <div className="mt-auto flex items-center justify-between pt-5">
          <span className="link-arrow">
            查看详情
            <Icon name="arrow-right" size={15} />
          </span>
          <div className="relative z-20 flex items-center gap-1">
            {project.links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                aria-label={`${project.title}：${link.label}`}
                title={link.label}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full text-muted transition-colors hover:bg-black/[0.06] hover:text-[#111827]"
              >
                <Icon name={linkIcon[link.kind]} size={15} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </article>
  )
}
