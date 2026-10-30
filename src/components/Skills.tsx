import { useSiteData } from '../store/siteData'
import Icon, { type IconName } from './Icon'
import Reveal from './Reveal'
import SectionHead from './SectionHead'

const iconMap: Record<string, IconName> = {
  code: 'code',
  layers: 'layers',
  spark: 'sparkles',
  chip: 'chip',
}

export default function Skills() {
  const { data } = useSiteData()
  const skillGroups = data.skills
  const toolbox = data.toolbox

  return (
    <section id="skills" className="relative scroll-mt-24 py-24 sm:py-28">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-black/10 to-transparent"
        aria-hidden="true"
      />
      <div className="container-page">
        <SectionHead
          eyebrow="02 / Skills"
          title="技能地图"
          desc="不追求「全都会」，更在意每个方向都能独立做出完整的东西。"
        />

        <div className="mt-14 grid gap-5 md:grid-cols-2">
          {skillGroups.map((group, index) => (
            <Reveal key={group.key} delay={index * 70}>
              <div className="card h-full p-6 transition-colors hover:border-accent/20">
                <div className="flex items-start gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-accent/20 to-accent-violet/20 text-accent">
                    <Icon name={iconMap[group.icon]} size={19} />
                  </span>
                  <div>
                    <h3 className="text-base font-semibold text-[#111827]">{group.title}</h3>
                    <p className="mt-0.5 text-[12px] text-muted">{group.subtitle}</p>
                  </div>
                </div>

                <ul className="mt-6 space-y-4">
                  {group.skills.map((skill) => (
                    <li key={skill.name}>
                      <div className="flex items-baseline justify-between gap-3">
                        <span className="text-[13px] font-medium text-mist">{skill.name}</span>
                        <span className="font-mono text-[11px] text-muted/70">{skill.level}</span>
                      </div>
                      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-black/[0.06]">
                        <div
                          className="skill-fill h-full rounded-full bg-gradient-to-r from-accent to-accent-violet"
                          style={{ width: `${skill.level}%` }}
                        />
                      </div>
                      {skill.note ? (
                        <p className="mt-1.5 text-[11px] text-muted/70">{skill.note}</p>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={120}>
          <div className="mt-8 flex flex-wrap items-center gap-2">
            <span className="mr-2 font-mono text-[11px] uppercase tracking-[0.25em] text-muted/60">
              toolbox
            </span>
            {Array.from(new Set(toolbox)).map((tool) => (
              <span key={tool} className="chip">
                {tool}
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
