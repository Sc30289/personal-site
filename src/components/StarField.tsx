import { useEffect, useRef } from 'react'

interface Star {
  x: number
  y: number
  r: number
  depth: number
  phase: number
  speed: number
  color: string
}

/**
 * 首页星空：Canvas 粒子，缓慢闪烁 + 滚动/鼠标视差。
 * - 移动端自动减少粒子数量
 * - 尊重 prefers-reduced-motion：只绘制静态星空
 * - 页面不可见时暂停 requestAnimationFrame
 */
export default function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const host = canvas.parentElement
    if (!host) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    let width = 0
    let height = 0
    let stars: Star[] = []
    let raf = 0
    let lastTime = 0
    let scrollOffset = 0
    let pointerX = 0
    let pointerTarget = 0
    let pointerY = 0
    let pointerYTarget = 0

    const palette = ['#ffffff', '#fde68a', '#fdba74', '#fcd34d']

    const build = () => {
      const count = Math.round((width * height) / 11000)
      const total = Math.min(220, Math.max(36, count))
      stars = Array.from({ length: total }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.25 + 0.35,
        depth: Math.random() * 0.85 + 0.15,
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.9 + 0.35,
        color: palette[Math.floor(Math.random() * palette.length)],
      }))
    }

    const resize = () => {
      const rect = host.getBoundingClientRect()
      width = Math.max(1, rect.width)
      height = Math.max(1, rect.height)
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      build()
      if (reduceMotion) draw(0)
    }

    const draw = (time: number) => {
      ctx.clearRect(0, 0, width, height)
      const t = time / 1000

      for (const star of stars) {
        const twinkle = reduceMotion ? 0.75 : 0.45 + 0.4 * Math.sin(t * star.speed + star.phase)
        const parallaxY = scrollOffset * star.depth * 0.25
        const x = star.x + pointerX * star.depth * 1.6
        const y = (star.y + parallaxY + pointerY * star.depth * 1.2) % (height + 40)

        ctx.globalAlpha = Math.max(0.08, Math.min(1, twinkle))
        ctx.fillStyle = star.color
        ctx.beginPath()
        ctx.arc(x, y, star.r, 0, Math.PI * 2)
        ctx.fill()

        if (star.r > 1.2 && !reduceMotion) {
          ctx.globalAlpha *= 0.14
          ctx.beginPath()
          ctx.arc(x, y, star.r * 4.5, 0, Math.PI * 2)
          ctx.fill()
        }
      }
      ctx.globalAlpha = 1
    }

    const loop = (time: number) => {
      if (time - lastTime > 24) {
        pointerX += (pointerTarget - pointerX) * 0.06
        pointerY += (pointerYTarget - pointerY) * 0.06
        draw(time)
        lastTime = time
      }
      raf = requestAnimationFrame(loop)
    }

    const onScroll = () => {
      scrollOffset = window.scrollY
    }

    const onPointerMove = (event: PointerEvent) => {
      pointerTarget = (event.clientX / window.innerWidth - 0.5) * 14
      pointerYTarget = (event.clientY / window.innerHeight - 0.5) * 10
    }

    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(raf)
        raf = 0
      } else if (!reduceMotion && !raf) {
        raf = requestAnimationFrame(loop)
      }
    }

    const observer = new ResizeObserver(resize)
    observer.observe(host)
    resize()

    if (!reduceMotion) {
      raf = requestAnimationFrame(loop)
      window.addEventListener('scroll', onScroll, { passive: true })
      window.addEventListener('pointermove', onPointerMove, { passive: true })
      document.addEventListener('visibilitychange', onVisibility)
    }

    return () => {
      cancelAnimationFrame(raf)
      observer.disconnect()
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('pointermove', onPointerMove)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />
}
