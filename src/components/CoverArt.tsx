import { useId } from 'react'
import type { CoverPattern } from '../content/projects'

interface CoverArtProps {
  from: string
  to: string
  pattern: CoverPattern
  mark: string
  className?: string
}

/** 项目封面：渐变底 + 程序化 SVG 图案，不依赖任何图片资源。 */
export default function CoverArt({ from, to, pattern, mark, className = '' }: CoverArtProps) {
  const rawId = useId()
  const id = rawId.replace(/[^a-zA-Z0-9]/g, '')

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ backgroundImage: `linear-gradient(135deg, ${from} 0%, ${to} 100%)` }}
      aria-hidden="true"
    >
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 640 400" preserveAspectRatio="xMidYMid slice">
        <defs>
          {pattern === 'grid' && (
            <pattern id={`grid-${id}`} width="28" height="28" patternUnits="userSpaceOnUse">
              <path d="M28 0H0v28" fill="none" stroke="rgba(255,255,255,0.16)" strokeWidth="1" />
            </pattern>
          )}
          <radialGradient id={`fade-${id}`}>
            <stop offset="0%" stopColor="rgba(7,10,18,0)" />
            <stop offset="100%" stopColor="rgba(7,10,18,0.55)" />
          </radialGradient>
        </defs>

        {pattern === 'grid' && <rect width="640" height="400" fill={`url(#grid-${id})`} />}

        {pattern === 'orbit' && (
          <g fill="none" stroke="rgba(255,255,255,0.28)" strokeWidth="1.4">
            <circle cx="420" cy="120" r="70" />
            <circle cx="420" cy="120" r="120" strokeOpacity="0.55" />
            <circle cx="420" cy="120" r="180" strokeOpacity="0.28" />
            <circle cx="420" cy="120" r="240" strokeOpacity="0.14" />
            <circle cx="420" cy="120" r="6" fill="rgba(255,255,255,0.9)" stroke="none" />
            <circle cx="540" cy="120" r="4" fill="rgba(255,255,255,0.8)" stroke="none" />
            <circle cx="300" cy="120" r="3" fill="rgba(255,255,255,0.6)" stroke="none" />
          </g>
        )}

        {pattern === 'wave' && (
          <g fill="none" stroke="rgba(255,255,255,0.32)" strokeWidth="2">
            <path d="M-40 150 Q 40 90 120 150 T 280 150 T 440 150 T 600 150 T 760 150" />
            <path d="M-40 200 Q 40 140 120 200 T 280 200 T 440 200 T 600 200 T 760 200" strokeOpacity="0.7" />
            <path d="M-40 250 Q 40 190 120 250 T 280 250 T 440 250 T 600 250 T 760 250" strokeOpacity="0.45" />
            <path d="M-40 300 Q 40 240 120 300 T 280 300 T 440 300 T 600 300 T 760 300" strokeOpacity="0.25" />
          </g>
        )}

        {pattern === 'circuit' && (
          <g fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.6">
            <path d="M60 80h120v60h90V80h110v90h120" />
            <path d="M60 300h80v-60h110v90h150v-70h120" />
            <path d="M300 40v80" strokeOpacity="0.5" />
            <path d="M420 260v70" strokeOpacity="0.5" />
            <g fill="rgba(255,255,255,0.85)" stroke="none">
              <circle cx="60" cy="80" r="4" />
              <circle cx="180" cy="140" r="4" />
              <circle cx="270" cy="80" r="4" />
              <circle cx="380" cy="170" r="4" />
              <circle cx="500" cy="80" r="4" />
              <circle cx="140" cy="300" r="4" />
              <circle cx="250" cy="240" r="4" />
              <circle cx="400" cy="330" r="4" />
              <circle cx="550" cy="260" r="4" />
            </g>
          </g>
        )}

        {pattern === 'stamp' && (
          <g fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5">
            <circle cx="480" cy="120" r="46" />
            <circle cx="480" cy="120" r="78" strokeOpacity="0.6" />
            <circle cx="480" cy="120" r="110" strokeOpacity="0.35" />
            <circle cx="480" cy="120" r="142" strokeOpacity="0.18" />
            <circle cx="480" cy="120" r="6" fill="rgba(255,255,255,0.9)" stroke="none" />
            <g strokeOpacity="0.16">
              <path d="M20 360 L260 120" />
              <path d="M60 400 L300 160" />
              <path d="M100 440 L340 200" />
              <path d="M140 480 L380 240" />
            </g>
          </g>
        )}

        <rect width="640" height="400" fill={`url(#fade-${id})`} />
      </svg>

      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

      <span className="absolute bottom-4 left-5 font-mono text-4xl font-semibold tracking-tight text-white/90 drop-shadow">
        {mark}
      </span>
    </div>
  )
}
