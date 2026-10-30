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
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-gradient-to-r from-accent to-transparent" aria-hidden="true" />
            <p className="eyebrow">{eyebrow}</p>
          </div>
          <h2 className="section-title text-balance">{title}</h2>
          {desc ? <p className="mt-4 max-w-xl text-[15px] leading-7 text-muted">{desc}</p> : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
    </Reveal>
  )
}
