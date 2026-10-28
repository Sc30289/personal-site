import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import Icon from './Icon'

interface PageHeaderProps {
  eyebrow: string
  title: string
  desc?: string
  backTo?: string
  backLabel?: string
  children?: ReactNode
}

export default function PageHeader({
  eyebrow,
  title,
  desc,
  backTo = '/',
  backLabel = '返回首页',
  children,
}: PageHeaderProps) {
  return (
    <header className="pt-28 sm:pt-32">
      <div className="container-page">
        <Link
          to={backTo}
          className="inline-flex items-center gap-1.5 text-[13px] text-muted transition-colors hover:text-white"
        >
          <Icon name="arrow-left" size={15} />
          {backLabel}
        </Link>
        <p className="eyebrow mt-8">{eyebrow}</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white sm:text-5xl">{title}</h1>
        {desc ? <p className="mt-5 max-w-2xl text-[15px] leading-8 text-muted">{desc}</p> : null}
        {children}
      </div>
    </header>
  )
}
