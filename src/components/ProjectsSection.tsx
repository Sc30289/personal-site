import { Link } from 'react-router-dom'
import { useSiteData } from '../store/siteData'
import FeaturedCard from './FeaturedCard'
import Icon from './Icon'
import Reveal from './Reveal'
import SectionHead from './SectionHead'

export default function ProjectsSection() {
  const { data, featured, others } = useSiteData()

  return (
    <section id="projects" className="relative scroll-mt-24 py-24 sm:py-28">
      <div className="container-page">
        <SectionHead
          eyebrow="03 / Projects"
          title="精选作品"
          desc="三个从真实需求出发、完整跑通过的作品：零代码水印工具、电商图片提取扩展、AI 对话模型实验。点开卡片可以看实现思路。"
          action={
            <Link to="/projects" className="btn-ghost">
              全部 {data.projects.length} 个项目
              <Icon name="arrow-up-right" size={15} />
            </Link>
          }
        />

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((project, index) => (
            <Reveal key={project.slug} delay={index * 80} className="h-full">
              <FeaturedCard project={project} index={index} />
            </Reveal>
          ))}
        </div>

        {others.length > 0 ? (
          <Reveal delay={160}>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted/60">
                更多作品
              </span>
              {others.map((project) => (
                <Link
                  key={project.slug}
                  to={`/projects/${project.slug}`}
                  className="group inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.02] px-3.5 py-1.5 text-[12.5px] text-muted transition-colors hover:border-accent/40 hover:text-white"
                >
                  {project.title}
                  <Icon name="arrow-up-right" size={12} />
                </Link>
              ))}
            </div>
          </Reveal>
        ) : null}
      </div>
    </section>
  )
}
