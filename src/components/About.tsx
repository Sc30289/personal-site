import { useSiteData } from '../store/siteData'
import Icon from './Icon'
import Reveal from './Reveal'
import SectionHead from './SectionHead'

export default function About() {
  const { data } = useSiteData()
  const profile = data.profile

  return (
    <section id="about" className="relative scroll-mt-24 py-24 sm:py-28">
      <div className="container-page">
        <SectionHead
          eyebrow="01 / About"
          title="关于我"
          desc="一个把「想法 → 文档 → 可用产品」当作习惯的学生开发者。"
        />

        <div className="mt-14 grid gap-12 lg:grid-cols-[1.08fr_0.92fr] lg:gap-16">
          <div>
            <div className="space-y-5 text-[15px] leading-8 text-muted">
              {profile.intro.map((paragraph) => (
                <Reveal key={paragraph.slice(0, 12)}>
                  <p>{paragraph}</p>
                </Reveal>
              ))}
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {profile.principles.map((item, index) => (
                <Reveal key={item.title} delay={index * 60}>
                  <div className="card h-full p-5">
                    <div className="flex items-center gap-2 text-sm font-medium text-[#111827]">
                      <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-accent/10 text-accent">
                        <Icon name="sparkles" size={14} />
                      </span>
                      {item.title}
                    </div>
                    <p className="mt-2.5 text-[13px] leading-6 text-muted">{item.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <Reveal delay={80}>
              <div className="card p-6">
                <h3 className="flex items-center gap-2 text-sm font-medium text-[#111827]">
                  <Icon name="briefcase" size={16} className="text-accent" />
                  时间线
                </h3>
                <ol className="relative mt-6 space-y-6 border-l border-black/10 pl-6">
                  {profile.timeline.map((item) => (
                    <li key={item.period} className="relative">
                      <span className="absolute -left-[29px] top-1.5 h-2.5 w-2.5 rounded-full bg-accent ring-4 ring-accent/15" />
                      <p className="font-mono text-[11px] tracking-wider text-accent/90">{item.period}</p>
                      <p className="mt-1 text-sm font-medium text-[#111827]">{item.title}</p>
                      <p className="mt-1 text-[13px] leading-6 text-muted">{item.desc}</p>
                    </li>
                  ))}
                </ol>
              </div>
            </Reveal>

            <Reveal delay={140}>
              <div className="card p-6">
                <h3 className="text-sm font-medium text-[#111827]">快速了解</h3>
                <dl className="mt-4 space-y-3 text-[13px]">
                  <div className="flex items-center justify-between gap-4">
                    <dt className="inline-flex items-center gap-2 text-muted">
                      <Icon name="map-pin" size={15} />
                      所在地
                    </dt>
                    <dd className="text-mist">{profile.location}</dd>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <dt className="inline-flex items-center gap-2 text-muted">
                      <Icon name="briefcase" size={15} />
                      学校
                    </dt>
                    <dd className="text-mist">{profile.school}</dd>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <dt className="inline-flex items-center gap-2 text-muted">
                      <Icon name="mail" size={15} />
                      邮箱
                    </dt>
                    <dd>
                      <a href={`mailto:${profile.email}`} className="text-accent hover:text-amber-700">
                        {profile.email}
                      </a>
                    </dd>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <dt className="inline-flex items-center gap-2 text-muted">
                      <Icon name="github" size={15} />
                      GitHub
                    </dt>
                    <dd>
                      <a
                        href={profile.github}
                        target="_blank"
                        rel="noreferrer"
                        className="text-accent hover:text-amber-700"
                      >
                        @{profile.githubName}
                      </a>
                    </dd>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <dt className="inline-flex items-center gap-2 text-muted">
                      <Icon name="star" size={15} />
                      关注方向
                    </dt>
                    <dd className="text-mist">{profile.focus.join(' / ')}</dd>
                  </div>
                </dl>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
