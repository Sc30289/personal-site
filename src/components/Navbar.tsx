import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useSiteData } from '../store/siteData'
import Icon from './Icon'

type NavLink =
  | { label: string; kind: 'route'; to: string }
  | { label: string; kind: 'section'; id: string }

const links: NavLink[] = [
  { label: '首页', kind: 'route', to: '/' },
  { label: '关于', kind: 'section', id: 'about' },
  { label: '技能', kind: 'section', id: 'skills' },
  { label: '项目', kind: 'route', to: '/projects' },
  { label: '博客', kind: 'route', to: '/blog' },
  { label: '联系', kind: 'section', id: 'contact' },
]

export default function Navbar() {
  const { data } = useSiteData()
  const profile = data.profile
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [activeSection, setActiveSection] = useState<string>('')
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const pendingSection = useRef<string | null>(null)

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 12)
      if (window.scrollY < 200) setActiveSection('')
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = ''
      }
    }
    document.body.style.overflow = ''
    return undefined
  }, [open])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // 首页滚动时高亮「关于 / 技能 / 联系」
  useEffect(() => {
    if (pathname !== '/') {
      setActiveSection('')
      return
    }
    const ids = ['about', 'skills', 'projects', 'contact']
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el))
    if (!sections.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible) setActiveSection(visible.target.id)
      },
      { rootMargin: '-35% 0px -55% 0px', threshold: [0.05, 0.25, 0.5] },
    )
    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [pathname])

  useEffect(() => {
    if (pathname === '/' && pendingSection.current) {
      const id = pendingSection.current
      pendingSection.current = null
      const timer = window.setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 80)
      return () => window.clearTimeout(timer)
    }
    return undefined
  }, [pathname])

  const goSection = (id: string) => {
    setOpen(false)
    if (pathname === '/') {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } else {
      pendingSection.current = id
      navigate('/')
    }
  }

  const isActive = (link: NavLink) => {
    if (link.kind === 'route') {
      if (link.to === '/') return pathname === '/' && !activeSection
      return pathname.startsWith(link.to)
    }
    return pathname === '/' && activeSection === link.id
  }

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-accent focus:px-4 focus:py-2 focus:text-ink-950"
      >
        跳到主要内容
      </a>

      <header
        className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${
          scrolled ? 'glass py-2.5' : 'bg-transparent py-4'
        }`}
      >
        <nav className="container-page flex items-center justify-between" aria-label="主导航">
          <Link
            to="/"
            className="group flex items-baseline gap-1 text-lg font-semibold tracking-tight text-white"
            onClick={() => setOpen(false)}
          >
            <span>{profile.logo}</span>
            <span className="h-2 w-2 rounded-full bg-gradient-to-br from-accent to-accent-violet transition-transform group-hover:scale-125" />
            <span className="ml-2 hidden font-mono text-[10px] uppercase tracking-[0.3em] text-muted sm:inline">
              portfolio
            </span>
          </Link>

          <ul className="hidden items-center gap-1 lg:flex">
            {links.map((link) =>
              link.kind === 'route' ? (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className={`rounded-full px-3.5 py-2 text-sm transition-colors ${
                      isActive(link)
                        ? 'bg-white/[0.06] text-white'
                        : 'text-muted hover:text-white'
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ) : (
                <li key={link.id}>
                  <button
                    type="button"
                    onClick={() => goSection(link.id)}
                    className={`rounded-full px-3.5 py-2 text-sm transition-colors ${
                      isActive(link)
                        ? 'bg-white/[0.06] text-white'
                        : 'text-muted hover:text-white'
                    }`}
                  >
                    {link.label}
                  </button>
                </li>
              ),
            )}
          </ul>

          <div className="flex items-center gap-2">
            <a
              href={profile.github}
              target="_blank"
              rel="noreferrer"
              className="hidden h-9 w-9 items-center justify-center rounded-full border border-white/10 text-muted transition-colors hover:border-accent/40 hover:text-white sm:inline-flex"
              aria-label="GitHub 主页"
            >
              <Icon name="github" size={17} />
            </a>
            <button
              type="button"
              onClick={() => goSection('contact')}
              className="btn-primary hidden text-[13px] sm:inline-flex"
            >
              联系我
              <Icon name="arrow-up-right" size={15} />
            </button>
            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-mist lg:hidden"
              aria-label={open ? '关闭菜单' : '打开菜单'}
              aria-expanded={open}
              aria-controls="mobile-menu"
            >
              <Icon name={open ? 'close' : 'menu'} size={20} />
            </button>
          </div>
        </nav>
      </header>

      {/* 移动端全屏菜单 */}
      <div
        id="mobile-menu"
        className={`fixed inset-0 z-30 bg-ink-950/95 backdrop-blur-xl transition-all duration-300 lg:hidden ${
          open ? 'visible opacity-100' : 'invisible opacity-0'
        }`}
      >
        <div className="container-page flex h-full flex-col justify-center gap-2 pb-16 pt-24">
          {links.map((link, index) =>
            link.kind === 'route' ? (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between border-b border-white/[0.06] py-4 text-2xl font-medium text-white transition-colors hover:text-accent"
                style={{ transitionDelay: `${index * 30}ms` }}
              >
                {link.label}
                <Icon name="arrow-up-right" size={18} className="text-muted" />
              </Link>
            ) : (
              <button
                key={link.id}
                type="button"
                onClick={() => goSection(link.id)}
                className="flex items-center justify-between border-b border-white/[0.06] py-4 text-left text-2xl font-medium text-white transition-colors hover:text-accent"
              >
                {link.label}
                <Icon name="arrow-up-right" size={18} className="text-muted" />
              </button>
            ),
          )}
          <div className="mt-8 flex items-center gap-3">
            <a href={profile.github} target="_blank" rel="noreferrer" className="btn-ghost">
              <Icon name="github" size={16} />
              GitHub
            </a>
            <a href={`mailto:${profile.email}`} className="btn-primary">
              <Icon name="mail" size={16} />
              邮件联系
            </a>
          </div>
        </div>
      </div>
    </>
  )
}
