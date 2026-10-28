import { useEffect, useState } from 'react'
import type { TocItem } from '../lib/markdown'

export default function Toc({ items }: { items: TocItem[] }) {
  const [active, setActive] = useState<string>(items[0]?.id ?? '')

  useEffect(() => {
    if (!items.length) return
    const elements = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => Boolean(el))
    if (!elements.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]
        if (visible) setActive(visible.target.id)
      },
      { rootMargin: '-15% 0px -70% 0px', threshold: [0, 1] },
    )
    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [items])

  if (!items.length) return null

  return (
    <nav aria-label="文章目录" className="sticky top-28 hidden max-h-[70vh] overflow-auto lg:block">
      <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted/60">目录</p>
      <ul className="mt-4 space-y-1 border-l border-white/10">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              onClick={(event) => {
                event.preventDefault()
                document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
              }}
              className={`-ml-px block border-l py-1.5 text-[12.5px] leading-5 transition-colors ${
                item.level === 3 ? 'pl-6' : 'pl-4'
              } ${
                active === item.id
                  ? 'border-accent text-accent'
                  : 'border-transparent text-muted hover:border-white/20 hover:text-white'
              }`}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
