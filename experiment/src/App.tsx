import { useEffect, useRef, useState, useCallback } from 'react'

const HERO_PATH = 'M 65 115 C 65 5 175 5 175 115 C 175 172 120 156 120 205 L 120 250'
const HERO_DOT = { cx: 120, cy: 286, r: 17 }

function useReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])
  return reduced
}

type Particle = {
  x: number
  y: number
  vx: number
  vy: number
  r: number
  a: number
  warm: boolean
}

export function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const reduced = useReducedMotion()
  const [ready, setReady] = useState(false)
  const [drawn, setDrawn] = useState(false)
  const [pulsing, setPulsing] = useState(false)
  const pulseRef = useRef(0)
  const partsRef = useRef<Particle[]>([])
  const dimsRef = useRef({ w: 0, h: 0 })
  const pointerRef = useRef({ x: 0, y: 0, active: false })

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 60)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    const t = setTimeout(() => setDrawn(true), reduced ? 0 : 120)
    return () => clearTimeout(t)
  }, [reduced])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const setupDims = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const w = window.innerWidth
      const h = window.innerHeight
      dimsRef.current = { w, h }
      canvas.width = Math.floor(w * dpr)
      canvas.height = Math.floor(h * dpr)
      canvas.style.width = w + 'px'
      canvas.style.height = h + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    setupDims()

    const seed = () => {
      const { w, h } = dimsRef.current
      const count = Math.min(110, Math.floor((w * h) / 15000))
      const arr: Particle[] = []
      for (let i = 0; i < count; i++) {
        arr.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.1,
          vy: (Math.random() - 0.5) * 0.1,
          r: Math.random() * 1.1 + 0.35,
          a: Math.random() * 0.45 + 0.15,
          warm: Math.random() < 0.18,
        })
      }
      partsRef.current = arr
    }
    seed()

    const draw = () => {
      const { w, h } = dimsRef.current
      ctx.clearRect(0, 0, w, h)
      const boost = pulseRef.current
      for (const p of partsRef.current) {
        const alpha = p.a * (1 + boost * 1.1)
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r * (1 + boost * 0.5), 0, Math.PI * 2)
        ctx.fillStyle = p.warm
          ? `rgba(217,176,116,${alpha})`
          : `rgba(240,232,218,${alpha})`
        ctx.fill()
      }
    }

    const step = () => {
      const { w, h } = dimsRef.current
      const parts = partsRef.current
      const ptr = pointerRef.current
      if (pulseRef.current > 0) pulseRef.current = Math.max(0, pulseRef.current - 0.014)
      for (const p of parts) {
        if (ptr.active) {
          const dx = ptr.x - p.x
          const dy = ptr.y - p.y
          const d2 = dx * dx + dy * dy
          const R = 240
          if (d2 < R * R && d2 > 1) {
            const d = Math.sqrt(d2)
            const f = (1 - d / R) * 0.045
            p.vx += (dx / d) * f
            p.vy += (dy / d) * f
          }
        }
        p.vx *= 0.985
        p.vy *= 0.985
        p.vx += (Math.random() - 0.5) * 0.012
        p.vy += (Math.random() - 0.5) * 0.012
        p.x += p.vx
        p.y += p.vy
        if (p.x < -2) p.x = w + 2
        else if (p.x > w + 2) p.x = -2
        if (p.y < -2) p.y = h + 2
        else if (p.y > h + 2) p.y = -2
      }
      draw()
    }

    const onMove = (e: PointerEvent) => {
      pointerRef.current.x = e.clientX
      pointerRef.current.y = e.clientY
      pointerRef.current.active = true
    }
    const onLeave = () => {
      pointerRef.current.active = false
    }
    const onResize = () => {
      setupDims()
      seed()
      draw()
    }

    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerleave', onLeave)
    window.addEventListener('resize', onResize)

    let raf = 0
    let alive = true
    if (!reduced) {
      const tick = () => {
        if (!alive) return
        step()
        raf = requestAnimationFrame(tick)
      }
      tick()
    } else {
      draw()
    }

    return () => {
      alive = false
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerleave', onLeave)
      window.removeEventListener('resize', onResize)
    }
  }, [reduced])

  useEffect(() => {
    if (!pulsing) return
    const t = setTimeout(() => setPulsing(false), 720)
    return () => clearTimeout(t)
  }, [pulsing])

  const acknowledge = useCallback(() => {
    if (reduced) return
    pulseRef.current = 1
    setPulsing(true)
  }, [reduced])

  return (
    <main className="stage">
      <canvas ref={canvasRef} className="dust" aria-hidden="true" />
      <span className="index-mark" aria-hidden="true">—</span>
      <div className={`composition ${ready ? 'ready' : ''}`}>
        <button
          type="button"
          className={`hero ${drawn ? 'drawn' : ''} ${pulsing ? 'pulse' : ''}`}
          onClick={acknowledge}
          aria-label="the question"
        >
          <svg viewBox="0 0 240 340" className="hero-svg" aria-hidden="true">
            <path className="hero-stroke" d={HERO_PATH} pathLength={100} />
            <circle className="hero-dot" cx={HERO_DOT.cx} cy={HERO_DOT.cy} r={HERO_DOT.r} />
          </svg>
        </button>
        <h1 className="question">is Minimax M3 good at frontend yet?</h1>
      </div>
    </main>
  )
}
