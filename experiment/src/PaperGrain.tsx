import { useEffect, useRef } from 'react'

const GRAIN_COUNT = 240

type Grain = {
  x: number
  y: number
  size: number
  tone: 'paper' | 'ink' | 'acid' | 'coral' | 'blue'
  drift: number
  phase: number
  life: number
  maxLife: number
}

const TONE_COLOR: Record<Grain['tone'], string> = {
  paper: '243, 236, 214',
  ink: '22, 21, 28',
  acid: '216, 255, 106',
  coral: '255, 118, 95',
  blue: '155, 188, 255',
}

const TONE_POOL: Grain['tone'][] = [
  'paper', 'paper', 'paper', 'paper', 'paper', 'paper',
  'ink', 'ink',
  'acid',
  'coral',
  'blue',
]

function makeGrain(width: number, height: number): Grain {
  return {
    x: Math.random() * width,
    y: Math.random() * height,
    size: 0.4 + Math.random() * 1.6,
    tone: TONE_POOL[Math.floor(Math.random() * TONE_POOL.length)],
    drift: (Math.random() - 0.5) * 0.012,
    phase: Math.random() * Math.PI * 2,
    life: Math.random() * 4000,
    maxLife: 6000 + Math.random() * 10000,
  }
}

export function PaperGrain() {
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
    let grains: Grain[] = Array.from({ length: GRAIN_COUNT }, () => makeGrain(width, height))

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
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
      const delta = Math.min(2, (now - lastTime) / 16.67)
      lastTime = now
      const seconds = now / 1000

      ctx.clearRect(0, 0, width, height)

      for (const grain of grains) {
        grain.life += delta * 16.67
        if (grain.life >= grain.maxLife) {
          Object.assign(grain, makeGrain(width, height))
          grain.life = 0
          continue
        }
        const lifeRatio = grain.life / grain.maxLife
        const fade =
          lifeRatio < 0.15
            ? lifeRatio / 0.15
            : lifeRatio > 0.85
            ? (1 - lifeRatio) / 0.15
            : 1
        const twinkle = 0.55 + 0.45 * Math.sin(seconds * 0.7 + grain.phase)
        const opacity = 0.18 * Math.max(0, Math.min(1, fade)) * twinkle
        const color = TONE_COLOR[grain.tone]
        grain.x += grain.drift * delta
        grain.y -= 0.006 * delta

        if (grain.y < -6) grain.y = height + 6
        if (grain.x < -6) grain.x = width + 6
        if (grain.x > width + 6) grain.x = -6

        ctx.fillStyle = `rgba(${color}, ${opacity})`
        ctx.beginPath()
        ctx.arc(grain.x, grain.y, grain.size, 0, Math.PI * 2)
        ctx.fill()
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

  return <canvas ref={canvasRef} className="paper-grain" aria-hidden="true" />
}