import { Link } from 'react-router-dom'
import { useSiteData } from '../store/siteData'
import Icon from './Icon'

export default function Footer() {
  const { data } = useSiteData()
  const profile = data.profile

  return (
    <footer className="relative border-t border-black/[0.06] py-14">
      <div className="container-page">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Link to="/" className="flex items-baseline gap-1 text-lg font-semibold text-[#111827]">
              {profile.logo}
              <span className="h-2 w-2 rounded-full bg-gradient-to-br from-accent to-accent-violet" />
            </Link>
            <p className="mt-3 max-w-xs text-[13px] leading-6 text-muted">
              {data.settings.footerNote}
            </p>
            <div className="mt-5 flex items-center gap-2">
              <a
                href={profile.github}
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/10 text-muted transition-colors hover:border-accent/40 hover:text-[#111827]"
              >
                <Icon name="github" size={16} />
              </a>
              <a
                href={`mailto:${profile.email}`}
                aria-label="邮箱"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/10 text-muted transition-colors hover:border-accent/40 hover:text-[#111827]"
              >
                <Icon name="mail" size={16} />
              </a>
            </div>
          </div>

          <nav aria-label="页脚导航">
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted/60">导航</p>
            <ul className="mt-4 space-y-2.5 text-[13px]">
              <li>
                <Link to="/" className="text-muted transition-colors hover:text-[#111827]">
                  首页
                </Link>
              </li>
              <li>
                <Link to="/projects" className="text-muted transition-colors hover:text-[#111827]">
                  项目
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-muted transition-colors hover:text-[#111827]">
                  博客
                </Link>
              </li>
              <li>
                <a href="https://github.com/Sc30289/imagegrab" target="_blank" rel="noreferrer" className="text-muted transition-colors hover:text-[#111827]">
                  ImageGrab 源码
                </a>
              </li>
            </ul>
          </nav>

          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted/60">联系</p>
            <ul className="mt-4 space-y-2.5 text-[13px]">
              <li>
                <a href={`mailto:${profile.email}`} className="text-muted transition-colors hover:text-[#111827]">
                  {profile.email}
                </a>
              </li>
              <li>
                <a href={profile.github} target="_blank" rel="noreferrer" className="text-muted transition-colors hover:text-[#111827]">
                  github.com/{profile.githubName}
                </a>
              </li>
              <li className="text-muted/70">{profile.status}</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-black/[0.06] pt-6 text-[12px] text-muted/70 sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} 豆杰晟 · 保留所有权利</p>
          <div className="flex flex-wrap items-center gap-4">
            <Link to="/admin/login" className="transition-colors hover:text-[#111827]">
              管理后台
            </Link>
            <p className="inline-flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400/80" />
              使用 React + TypeScript + Vite 构建 · 部署于 GitHub Pages
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
