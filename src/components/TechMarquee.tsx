const items = [
  'React 18',
  'TypeScript',
  'Vite',
  'Tailwind CSS',
  'Chrome MV3',
  'Canvas',
  'Node.js',
  'Python',
  'PyTorch · LoRA',
  'C51 / 单片机',
  'Keil',
  'Git',
  'Figma',
]

/** 首页技术栈跑马灯：纯 CSS 无限滚动，悬停暂停。 */
export default function TechMarquee() {
  return (
    <section
      aria-label="常用技术栈"
      className="relative overflow-hidden border-y border-black/[0.06] bg-white/60 py-3.5"
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-[#F6F7F9] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-[#F6F7F9] to-transparent" />
      <div className="flex w-max animate-marquee gap-10 hover:[animation-play-state:paused]">
        {[0, 1].map((group) => (
          <div key={group} className="flex shrink-0 items-center gap-10" aria-hidden={group === 1}>
            {items.map((item) => (
              <span
                key={`${group}-${item}`}
                className="inline-flex items-center gap-2.5 whitespace-nowrap font-mono text-[11px] uppercase tracking-[0.2em] text-muted/80"
              >
                <span className="h-1 w-1 rounded-full bg-accent/70" />
                {item}
              </span>
            ))}
          </div>
        ))}
      </div>
    </section>
  )
}
