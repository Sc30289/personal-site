import { Link, NavLink, Navigate, Outlet, useLocation } from 'react-router-dom'
import type { ReactNode } from 'react'
import Icon, { type IconName } from '../components/Icon'
import { isAuthed, logout } from './auth'

const nav: { to: string; label: string; icon: IconName; end?: boolean }[] = [
  { to: '/admin', label: '仪表盘', icon: 'star', end: true },
  { to: '/admin/profile', label: '个人信息', icon: 'briefcase' },
  { to: '/admin/skills', label: '技能管理', icon: 'layers' },
  { to: '/admin/projects', label: '项目管理', icon: 'code' },
  { to: '/admin/posts', label: '博客管理', icon: 'tag' },
  { to: '/admin/settings', label: '站点设置', icon: 'chip' },
]

const titles: Record<string, string> = {
  '/admin': '仪表盘',
  '/admin/profile': '个人信息',
  '/admin/skills': '技能管理',
  '/admin/projects': '项目管理',
  '/admin/posts': '博客管理',
  '/admin/settings': '站点设置',
}

export function RequireAuth({ children }: { children: ReactNode }) {
  const location = useLocation()
  if (!isAuthed()) {
    return <Navigate to="/admin/login" state={{ from: location.pathname }} replace />
  }
  return <>{children}</>
}

export default function AdminLayout() {
  const { pathname } = useLocation()
  const current = pathname.startsWith('/admin/projects/')
    ? '项目管理'
    : pathname.startsWith('/admin/posts/')
      ? '博客管理'
      : titles[pathname] ?? '管理后台'

  const handleLogout = () => {
    logout()
    window.location.hash = '#/admin/login'
  }

  return (
    <div className="min-h-screen bg-ink-950 text-mist">
      <div className="flex">
        <aside className="sticky top-0 hidden h-screen w-56 shrink-0 flex-col border-r border-black/[0.06] bg-ink-900/80 p-4 md:flex">
          <Link to="/" className="flex items-center gap-2 px-2 py-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-accent to-accent-violet text-sm font-semibold text-[#201509]">
              豆
            </span>
            <div>
              <p className="text-[13px] font-medium text-[#111827]">管理后台</p>
              <p className="text-[10px] text-muted/60">localStorage 模式</p>
            </div>
          </Link>

          <nav className="mt-6 space-y-1">
            {nav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] transition-colors ${
                    isActive
                      ? 'bg-accent/12 text-accent'
                      : 'text-muted hover:bg-black/[0.04] hover:text-[#111827]'
                  }`
                }
              >
                <Icon name={item.icon} size={16} />
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="mt-auto space-y-2 border-t border-black/[0.06] pt-4 text-[12px]">
            <Link to="/" className="flex items-center gap-2 rounded-lg px-3 py-2 text-muted hover:text-[#111827]">
              <Icon name="external" size={14} />
              查看站点
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-muted hover:text-[#111827]"
            >
              <Icon name="arrow-left" size={14} />
              退出登录
            </button>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-20 flex h-14 items-center justify-between gap-4 border-b border-black/[0.06] bg-ink-900/85 px-6 backdrop-blur">
            <div className="flex items-center gap-2 text-[12px] text-muted">
              <span>内容管理</span>
              <span className="text-muted/40">/</span>
              <span className="text-[#111827]">{current}</span>
            </div>
            <div className="flex items-center gap-2">
              <Link to="/" className="hidden text-[12px] text-muted hover:text-[#111827] sm:inline">
                查看站点 ↗
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-full border border-black/10 px-3 py-1.5 text-[12px] text-muted hover:text-[#111827] md:hidden"
              >
                退出
              </button>
            </div>
          </header>

          <nav className="flex gap-1 overflow-x-auto border-b border-black/[0.06] px-4 py-2 md:hidden">
            {nav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `whitespace-nowrap rounded-full px-3 py-1.5 text-[12px] ${
                    isActive ? 'bg-accent/15 text-accent' : 'text-muted'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <main className="mx-auto max-w-5xl px-5 pb-28 pt-6 sm:px-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}
