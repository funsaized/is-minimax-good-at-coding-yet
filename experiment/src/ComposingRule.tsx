import { useEffect, useRef } from 'react'

const TONE_HEX: Record<string, string> = {
  quiet: '#9bbcff',
  human: '#f07d6a',
  bold: '#d6f06a',
}

type Bead = {
  x: number
  y: number
  r: number
  vy: number
  life: number
  maxLife: number
  tone: string
  wobble: number
  phase: number
}

type ComposingRuleProps = {
  voice: 'quiet' | 'human' | 'bold'
}

const COUNT = 28

export function ComposingRule({ voice }: ComposingRuleProps) {
  const ref = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas || typeof window === 'undefined') return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (reduceMotion.matches) {
      canvas.style.display = 'none'
      return
    }

    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    let width = 0
    let height = 0
    let dpr = 1
    let animationId = 0
    let lastTime = performance.now()
    let beads: Bead[] = []

    const tone = TONE_HEX[voice] ?? TONE_HEX.quiet

    const reseed = () => {
      beads = Array.from({ length: COUNT }, () => makeBead(width, height, tone))
    }

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      width = Math.max(40, rect.width)
      height = Math.max(20, rect.height)
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    resize()
    reseed()
    window.addEventListener('resize', resize)

    const tick = (now: number) => {
      const delta = Math.min(2, (now - lastTime) / 16.67)
      lastTime = now
      const seconds = now / 1000

      ctx.clearRect(0, 0, width, height)

      const baseY = height / 2
      const amplitude = height * 0.32

      ctx.strokeStyle = 'rgba(243, 236, 214, 0.10)'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(0, baseY)
      ctx.lineTo(width, baseY)
      ctx.stroke()

      ctx.strokeStyle = hexToRgba(tone, 0.32)
      ctx.lineWidth = 1.1
      ctx.beginPath()
      for (let x = 0; x <= width; x += 3) {
        const t = x / Math.max(1, width - 1)
        const y =
          baseY +
          Math.sin(t * Math.PI * 1.6 + seconds * 0.18) * amplitude * 0.5 +
          Math.sin(t * Math.PI * 4 + seconds * 0.32) * amplitude * 0.16
        if (x === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.stroke()

      const tickCount = Math.max(8, Math.floor(width / 90))
      ctx.strokeStyle = 'rgba(243, 236, 214, 0.18)'
      ctx.lineWidth = 1
      for (let i = 0; i <= tickCount; i += 1) {
        const x = (i / tickCount) * width
        const tickHeight = i % 5 === 0 ? 8 : 4
        ctx.beginPath()
        ctx.moveTo(x, baseY - tickHeight / 2)
        ctx.lineTo(x, baseY + tickHeight / 2)
        ctx.stroke()
      }

      for (let i = beads.length - 1; i >= 0; i -= 1) {
        const bead = beads[i]
        bead.life += delta * 16.67
        bead.y -= bead.vy * delta
        bead.x += bead.wobble * delta
        if (bead.life >= bead.maxLife || bead.y < -8 || bead.x < -8 || bead.x > width + 8) {
          beads[i] = makeBead(width, height, tone)
          beads[i].y = height + 6
          continue
        }

        const lifeRatio = bead.life / bead.maxLife
        const fade =
          lifeRatio < 0.18
            ? lifeRatio / 0.18
            : lifeRatio > 0.7
            ? (1 - lifeRatio) / 0.3
            : 1
        const twinkle = 0.55 + 0.45 * Math.sin(seconds * 0.9 + bead.phase)
        const opacity = 0.6 * Math.max(0, Math.min(1, fade)) * twinkle

        ctx.fillStyle = hexToRgba(bead.tone, opacity)
        ctx.beginPath()
        ctx.arc(bead.x, bead.y, bead.r, 0, Math.PI * 2)
        ctx.fill()
      }

      animationId = requestAnimationFrame(tick)
    }

    animationId = requestAnimationFrame(tick)

    const onMotionChange = () => {
      if (reduceMotion.matches && animationId) {
        cancelAnimationFrame(animationId)
        animationId = 0
        ctx.clearRect(0, 0, width, height)
      }
    }
    reduceMotion.addEventListener('change', onMotionChange)

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', resize)
      reduceMotion.removeEventListener('change', onMotionChange)
    }
  }, [voice])

  return <canvas ref={ref} className="composing-rule" aria-hidden="true" />
}

function makeBead(width: number, height: number, tone: string): Bead {
  return {
    x: Math.random() * width,
    y: height + 6 + Math.random() * 4,
    r: 0.5 + Math.random() * 1.4,
    vy: 0.25 + Math.random() * 0.45,
    life: 0,
    maxLife: 5000 + Math.random() * 6000,
    tone,
    wobble: (Math.random() - 0.5) * 0.18,
    phase: Math.random() * Math.PI * 2,
  }
}

function hexToRgba(hex: string, alpha: number): string {
  const clean = hex.replace('#', '')
  const r = parseInt(clean.slice(0, 2), 16)
  const g = parseInt(clean.slice(2, 4), 16)
  const b = parseInt(clean.slice(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}