import { useMemo, useState } from 'react'
import PageHeader from '../components/PageHeader'
import ProjectCard from '../components/ProjectCard'
import Reveal from '../components/Reveal'
import { projectCategories, projects } from '../content/projects'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export default function ProjectsPage() {
  useDocumentTitle('项目')
  const [filter, setFilter] = useState<string>('all')

  const visible = useMemo(
    () => (filter === 'all' ? projects : projects.filter((project) => project.category === filter)),
    [filter],
  )

  return (
    <main id="main" className="pb-24">
      <PageHeader
        eyebrow="Projects"
        title="项目与作品"
        desc={`${projects.length} 个完整跑通过的作品：零代码水印工具、电商图片提取扩展、前端应用、AI 对话模型与嵌入式实验。每个都附有实现思路与踩坑记录。`}
      >
        <div className="mt-8 flex flex-wrap gap-2">
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
      </PageHeader>

      <div className="container-page mt-10 grid gap-5 md:grid-cols-2">
        {visible.map((project, index) => (
          <Reveal key={project.slug} delay={index * 50}>
            <ProjectCard project={project} />
          </Reveal>
        ))}
      </div>
    </main>
  )
}
