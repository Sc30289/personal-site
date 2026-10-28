import type { ReactNode } from 'react'
import Reveal from './Reveal'

interface SectionHeadProps {
  eyebrow: string
  title: string
  desc?: string
  action?: ReactNode
}

export default function SectionHead({ eyebrow, title, desc, action }: SectionHeadProps) {
  return (
    <Reveal>
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <p className="eyebrow">{eyebrow}</p>
          <h2 className="section-title">{title}</h2>
          {desc ? <p className="mt-4 text-[15px] leading-7 text-muted">{desc}</p> : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
    </Reveal>
  )
}
