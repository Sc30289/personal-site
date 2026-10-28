import { Link } from 'react-router-dom'
import { profile } from '../content/profile'
import StarField from './StarField'
import Icon from './Icon'
import Reveal from './Reveal'

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative isolate flex min-h-[100svh] items-center overflow-hidden pb-20 pt-28 sm:pb-24 sm:pt-32"
    >
      <StarField />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-grid-fade" aria-hidden="true" />
      <div
        className="pointer-events-none absolute -left-24 top-1/3 -z-10 h-72 w-72 rounded-full bg-accent/10 blur-[110px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-16 top-20 -z-10 h-80 w-80 rounded-full bg-accent-violet/10 blur-[120px]"
        aria-hidden="true"
      />

      <div className="container-page grid items-center gap-14 lg:grid-cols-[1.12fr_0.88fr] lg:gap-10">
        <div>
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/[0.07] px-3.5 py-1.5 text-xs font-medium text-emerald-300">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              {profile.status}
            </span>
          </Reveal>

          <Reveal delay={80}>
            <h1 className="mt-7 text-4xl font-semibold leading-[1.12] tracking-tight text-white sm:text-5xl lg:text-[64px]">
              你好，我是 <span className="gradient-text">Sc</span>
            </h1>
          </Reveal>

          <Reveal delay={150}>
            <p className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 text-lg text-mist/90 sm:text-xl">
              <span>{profile.role}</span>
              <span className="hidden h-1 w-1 rounded-full bg-muted sm:inline-block" />
              <span className="text-accent">{profile.focus.join(' · ')}</span>
            </p>
          </Reveal>

          <Reveal delay={220}>
            <p className="mt-6 max-w-xl text-[15px] leading-8 text-muted">{profile.tagline}</p>
          </Reveal>

          <Reveal delay={290}>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link to="/projects" className="btn-primary">
                查看项目
                <Icon name="arrow-right" size={16} />
              </Link>
              <Link to="/blog" className="btn-ghost">
                阅读博客
                <Icon name="arrow-up-right" size={15} />
              </Link>
              <a
                href={`mailto:${profile.email}`}
                className="inline-flex items-center gap-2 px-2 py-2 text-sm text-muted transition-colors hover:text-white"
              >
                <Icon name="mail" size={16} />
                {profile.email}
              </a>
            </div>
          </Reveal>

          <Reveal delay={360}>
            <div className="mt-12 flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-muted/70">
              <span className="h-px w-10 bg-gradient-to-r from-accent/60 to-transparent" />
              scroll
            </div>
          </Reveal>
        </div>

        <Reveal delay={200} className="relative">
          <div className="relative mx-auto w-full max-w-sm">
            <div className="card relative overflow-hidden p-6 shadow-card">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
                <span className="ml-auto font-mono text-[10px] uppercase tracking-[0.25em] text-muted/60">
                  profile.card
                </span>
              </div>

              <div className="mt-6 flex items-center gap-4">
                <div className="relative h-16 w-16 shrink-0 rounded-2xl bg-gradient-to-br from-accent via-accent-violet to-accent-cyan p-[2px]">
                  <div className="flex h-full w-full items-center justify-center rounded-[14px] bg-ink-900 text-lg font-semibold tracking-wide text-white">
                    SC
                  </div>
                </div>
                <div>
                  <p className="text-base font-semibold text-white">{profile.name}</p>
                  <p className="mt-0.5 text-[13px] text-muted">{profile.role}</p>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-4 gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
                {profile.stats.map((stat) => (
                  <div key={stat.label} className="text-center">
                    <p className="text-lg font-semibold text-white">{stat.value}</p>
                    <p className="mt-0.5 text-[10px] text-muted">{stat.label}</p>
                  </div>
                ))}
              </div>

              <div className="mt-5 space-y-2.5 text-[13px]">
                <div className="flex items-center justify-between">
                  <span className="text-muted">技术方向</span>
                  <span className="text-mist">{profile.focus.slice(0, 2).join(' / ')}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted">邮箱</span>
                  <a href={`mailto:${profile.email}`} className="text-accent hover:text-cyan-300">
                    {profile.email}
                  </a>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted">GitHub</span>
                  <a
                    href={profile.github}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-accent hover:text-cyan-300"
                  >
                    @{profile.githubName}
                    <Icon name="arrow-up-right" size={12} />
                  </a>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-1.5">
                {['React', 'TypeScript', 'Vite', 'Tailwind'].map((item) => (
                  <span key={item} className="chip">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
