import { Link } from 'react-router-dom'
import Icon from '../components/Icon'
import { useSiteData } from '../store/siteData'

export default function Dashboard() {
  const { data, posts, featured } = useSiteData()
  const custom =
    typeof window !== 'undefined' && Boolean(window.localStorage.getItem('personal-site:data:v1'))

  const stats = [
    { label: '作品', value: data.projects.length, to: '/admin/projects', icon: 'code' as const },
    { label: '博客', value: data.posts.length, to: '/admin/posts', icon: 'tag' as const },
    { label: '技能项', value: data.skills.reduce((sum, group) => sum + group.skills.length, 0), to: '/admin/skills', icon: 'layers' as const },
    { label: '精选', value: featured.length, to: '/admin/projects', icon: 'star' as const },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-white">仪表盘</h1>
        <p className="mt-1 text-[12px] text-muted">
          这里可以修改站点内容。数据保存在浏览器 localStorage，公开页面读取同一份数据。
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            to={stat.to}
            className="rounded-2xl border border-white/[0.07] bg-ink-800/60 p-5 transition-colors hover:border-accent/30"
          >
            <div className="flex items-center justify-between text-muted">
              <span className="text-[12px]">{stat.label}</span>
              <Icon name={stat.icon} size={15} />
            </div>
            <p className="mt-3 text-2xl font-semibold text-white">{stat.value}</p>
          </Link>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-2xl border border-white/[0.07] bg-ink-800/60 p-6">
          <h2 className="text-[14px] font-semibold text-white">快捷操作</h2>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {[
              { to: '/admin/profile', label: '修改个人信息' },
              { to: '/admin/projects', label: '管理作品' },
              { to: '/admin/posts', label: '写一篇文章' },
              { to: '/admin/settings', label: '站点设置 / 重置' },
            ].map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="flex items-center justify-between rounded-xl border border-white/10 px-3.5 py-2.5 text-[12px] text-mist hover:border-accent/40"
              >
                {item.label}
                <Icon name="arrow-right" size={14} className="text-muted" />
              </Link>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-white/[0.07] bg-ink-800/60 p-6">
          <h2 className="text-[14px] font-semibold text-white">最近文章</h2>
          <ul className="mt-4 space-y-2">
            {posts.slice(0, 4).map((post) => (
              <li key={post.slug}>
                <Link
                  to="/admin/posts"
                  className="flex items-center justify-between gap-3 rounded-lg px-2 py-1.5 text-[12px] text-muted hover:bg-white/[0.04] hover:text-white"
                >
                  <span className="truncate">{post.title}</span>
                  <span className="shrink-0 font-mono text-[11px] text-muted/60">{post.date}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="rounded-2xl border border-white/[0.07] bg-ink-800/40 p-5 text-[12px] text-muted">
        数据来源：{custom ? '本地已保存的自定义数据' : '站点默认数据'}。修改后可在「站点设置」里导出 JSON 备份或恢复默认。
      </div>
    </div>
  )
}
