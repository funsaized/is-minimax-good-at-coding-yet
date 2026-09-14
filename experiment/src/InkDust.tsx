import { useEffect, useRef } from 'react'

type Mote = {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  life: number
  maxLife: number
  tone: 'acid' | 'coral' | 'blue' | 'paper'
}

const MOTE_COUNT = 26

const TONE_COLOR: Record<Mote['tone'], string> = {
  acid: '216, 255, 106',
  coral: '255, 118, 95',
  blue: '155, 188, 255',
  paper: '243, 236, 214',
}

function makeMote(width: number, height: number): Mote {
  const tonePool: Mote['tone'][] = ['paper', 'paper', 'paper', 'acid', 'acid', 'coral', 'blue']
  return {
    x: Math.random() * width,
    y: height * (0.6 + Math.random() * 0.6),
    vx: (Math.random() - 0.5) * 0.08,
    vy: -0.04 - Math.random() * 0.16,
    size: 0.4 + Math.random() * 1.4,
    life: 0,
    maxLife: 480 + Math.random() * 1400,
    tone: tonePool[Math.floor(Math.random() * tonePool.length)],
  }
}

export function InkDust() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    if (typeof window === 'undefined') return

    const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (reduceMotionQuery.matches) return

    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    let width = window.innerWidth
    let height = window.innerHeight
    let animationId = 0
    let motes: Mote[] = Array.from({ length: MOTE_COUNT }, () => makeMote(width, height))

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    resize()
    window.addEventListener('resize', resize)

    let lastTime = performance.now()
    const tick = (now: number) => {
      const delta = Math.min(1, (now - lastTime) / 16.67)
      lastTime = now

      ctx.clearRect(0, 0, width, height)

      for (const mote of motes) {
        mote.x += mote.vx * delta
        mote.y += mote.vy * delta
        mote.life += delta

        if (
          mote.life >= mote.maxLife ||
          mote.y < -12 ||
          mote.x < -12 ||
          mote.x > width + 12
        ) {
          Object.assign(mote, makeMote(width, height), { y: height + 14, life: 0 })
          continue
        }

        const lifeRatio = mote.life / mote.maxLife
        const fade = lifeRatio < 0.12
          ? lifeRatio / 0.12
          : lifeRatio > 0.85
          ? (1 - lifeRatio) / 0.15
          : 1
        const opacity = 0.32 * Math.max(0, Math.min(1, fade))
        const color = TONE_COLOR[mote.tone]

        ctx.fillStyle = `rgba(${color}, ${opacity})`
        ctx.beginPath()
        ctx.arc(mote.x, mote.y, mote.size, 0, Math.PI * 2)
        ctx.fill()

        if (mote.size > 1) {
          ctx.fillStyle = `rgba(${color}, ${opacity * 0.55})`
          ctx.beginPath()
          ctx.arc(mote.x - mote.size * 0.5, mote.y - mote.size * 0.4, mote.size * 0.35, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      animationId = requestAnimationFrame(tick)
    }

    animationId = requestAnimationFrame(tick)

    const onMotionChange = () => {
      if (reduceMotionQuery.matches && animationId) {
        cancelAnimationFrame(animationId)
        animationId = 0
        ctx.clearRect(0, 0, width, height)
      }
    }
    reduceMotionQuery.addEventListener('change', onMotionChange)

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', resize)
      reduceMotionQuery.removeEventListener('change', onMotionChange)
    }
  }, [])

  return <canvas ref={canvasRef} className="ink-dust" aria-hidden="true" />
}