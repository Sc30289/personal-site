import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { projectCategories, projects } from '../content/projects'
import ProjectCard from './ProjectCard'
import Reveal from './Reveal'
import SectionHead from './SectionHead'
import Icon from './Icon'

export default function ProjectsSection() {
  const [filter, setFilter] = useState<string>('all')

  const visible = useMemo(
    () => (filter === 'all' ? projects : projects.filter((project) => project.category === filter)),
    [filter],
  )

  return (
    <section id="projects" className="relative scroll-mt-24 py-24 sm:py-28">
      <div className="container-page">
        <SectionHead
          eyebrow="03 / Projects"
          title="作品集"
          desc="从浏览器扩展到单片机，每一个都从真实问题出发，并且完整地跑通过一遍。"
          action={
            <Link to="/projects" className="btn-ghost">
              全部项目
              <Icon name="arrow-up-right" size={15} />
            </Link>
          }
        />

        <Reveal delay={60}>
          <div className="mt-10 flex flex-wrap gap-2">
            {projectCategories.map((category) => (
              <button
                key={category.key}
                type="button"
                onClick={() => setFilter(category.key)}
                aria-pressed={filter === category.key}
                className={`rounded-full px-4 py-1.5 text-[13px] transition-all ${
                  filter === category.key
                    ? 'bg-accent text-ink-950'
                    : 'border border-white/10 bg-white/[0.03] text-muted hover:text-white'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </Reveal>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {visible.map((project, index) => (
            <Reveal key={project.slug} delay={index * 60}>
              <ProjectCard project={project} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
