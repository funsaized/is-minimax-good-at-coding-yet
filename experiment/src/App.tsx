import {
  useEffect,
  useRef,
  useState,
  useCallback,
  type PointerEvent as ReactPointerEvent,
  type CSSProperties,
} from 'react'

const HERO_PATH =
  'M 65 115 C 65 5 175 5 175 115 C 175 172 120 156 120 205 L 120 250'
const HERO_DOT = { cx: 120, cy: 286, r: 17 }

const SPATTER = [
  { angle: 18, distance: 78, size: 2.2, delay: 0 },
  { angle: 56, distance: 102, size: 1.5, delay: 42 },
  { angle: 96, distance: 84, size: 1.9, delay: 76 },
  { angle: 142, distance: 92, size: 1.6, delay: 22 },
  { angle: 178, distance: 68, size: 2.4, delay: 58 },
  { angle: 222, distance: 86, size: 1.7, delay: 12 },
  { angle: 262, distance: 104, size: 2.0, delay: 50 },
  { angle: 304, distance: 74, size: 1.6, delay: 34 },
  { angle: 342, distance: 90, size: 2.1, delay: 86 },
]

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

function useTick(intervalMs: number) {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), intervalMs)
    return () => clearInterval(id)
  }, [intervalMs])
  return now
}

type Particle = {
  x: number
  y: number
  vx: number
  vy: number
  r: number
  a: number
  tone: 'warm' | 'cool' | 'pale'
}

type Corner = 'tl' | 'tr' | 'bl' | 'br'

function Fleuron() {
  return (
    <svg className="fleuron" viewBox="0 0 160 14" aria-hidden="true">
      <g className="fleuron-rule fleuron-rule-l">
        <line x1="0" y1="7" x2="58" y2="7" pathLength="100" />
      </g>
      <g className="fleuron-rule fleuron-rule-r">
        <line x1="102" y1="7" x2="160" y2="7" pathLength="100" />
      </g>
      <g className="fleuron-dots">
        <circle cx="66" cy="7" r="1.1" />
        <circle cx="94" cy="7" r="1.1" />
      </g>
      <g className="fleuron-ornament">
        <circle cx="80" cy="7" r="3.2" className="fleuron-disc" />
        <path
          className="fleuron-bloom"
          d="M 80 1.4 L 81.9 5 L 85.6 7 L 81.9 9 L 80 12.6 L 78.1 9 L 74.4 7 L 78.1 5 Z"
        />
        <circle cx="80" cy="7" r="0.9" className="fleuron-pip" />
      </g>
    </svg>
  )
}

function GuideRule({ corner }: { corner: Corner }) {
  return (
    <span className={`guide-rule guide-rule-${corner}`} aria-hidden="true">
      <svg viewBox="0 0 100 100" preserveAspectRatio="xMinYMin meet">
        <line
          className="guide-rule-line"
          x1="0"
          y1="0"
          x2="100"
          y2="100"
          pathLength="100"
        />
        <circle className="guide-rule-dot" cx="100" cy="100" r="2.6" />
      </svg>
    </span>
  )
}

function Marg({
  corner,
  id,
  label,
  body,
  active,
  wave,
  onHover,
  ariaLabel,
  children,
}: {
  corner: Corner
  id: string
  label: string
  body?: string
  active: string | null
  wave: boolean
  onHover: (id: string | null) => void
  ariaLabel?: string
  children?: React.ReactNode
}) {
  const dim = active !== null && active !== id
  const classes = [`marg`, `marg-${corner}`]
  if (dim) classes.push('dim')
  if (wave) classes.push('echo-wave')
  return (
    <aside
      className={classes.join(' ')}
      onMouseEnter={() => onHover(id)}
      onMouseLeave={() => onHover(null)}
      onFocus={() => onHover(id)}
      onBlur={() => onHover(null)}
      tabIndex={0}
      aria-label={ariaLabel ?? `${label}${body ? ': ' + body : ''}`}
    >
      <span className="marg-rule" />
      <span className="marg-label">{label}</span>
      {body !== undefined && <span className="marg-body">{body}</span>}
      {children}
      <GuideRule corner={corner} />
    </aside>
  )
}

export function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const reduced = useReducedMotion()
  const [ready, setReady] = useState(false)
  const [drawn, setDrawn] = useState(false)
  const [pulsing, setPulsing] = useState(false)
  const [tracing, setTracing] = useState(false)
  const [spattering, setSpattering] = useState(false)
  const [active, setActive] = useState<string | null>(null)
  const [echoIdx, setEchoIdx] = useState(-1)
  const pulseRef = useRef(0)
  const echoRef = useRef(0)
  const partsRef = useRef<Particle[]>([])
  const dimsRef = useRef({ w: 0, h: 0 })
  const pointerRef = useRef({ x: 0, y: 0, active: false, over: false })
  const heroBoxRef = useRef<DOMRect | null>(null)
  const waveTimeoutsRef = useRef<number[]>([])
  const now = useTick(reduced ? 60_000 : 1000)

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 60)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    const t = setTimeout(() => setDrawn(true), reduced ? 0 : 160)
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
      const count = Math.min(150, Math.floor((w * h) / 11000))
      const arr: Particle[] = []
      for (let i = 0; i < count; i++) {
        const r = Math.random()
        const tone: Particle['tone'] =
          r < 0.16 ? 'warm' : r < 0.26 ? 'cool' : 'pale'
        arr.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.08,
          vy: (Math.random() - 0.5) * 0.08,
          r: Math.random() * 1.1 + 0.3,
          a: Math.random() * 0.45 + 0.1,
          tone,
        })
      }
      partsRef.current = arr
    }
    seed()

    const draw = () => {
      const { w, h } = dimsRef.current
      ctx.clearRect(0, 0, w, h)
      const boost = pulseRef.current
      const eBoost = echoRef.current
      const ptr = pointerRef.current
      const hb = heroBoxRef.current

      for (const p of partsRef.current) {
        let alpha = p.a * (1 + boost * 1.1)
        let radius = p.r * (1 + boost * 0.5)
        if (ptr.over) {
          const dx = ptr.x - p.x
          const dy = ptr.y - p.y
          const d2 = dx * dx + dy * dy
          const R = 220
          if (d2 < R * R) {
            const d = Math.sqrt(d2) || 1
            const k = 1 - d / R
            alpha += k * 0.4
            radius += k * 0.35
          }
        }
        if (eBoost > 0 && hb) {
          const cxp = (hb.left + hb.right) / 2
          const cyp = (hb.top + hb.bottom) / 2
          const dx = cxp - p.x
          const dy = cyp - p.y
          const d2 = dx * dx + dy * dy
          const R = 360
          if (d2 < R * R) {
            const d = Math.sqrt(d2) || 1
            const k = 1 - d / R
            alpha += k * eBoost * 0.55
            radius += k * eBoost * 0.5
          }
        }
        ctx.beginPath()
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2)
        if (p.tone === 'warm')
          ctx.fillStyle = `rgba(217,176,116,${Math.min(1, alpha)})`
        else if (p.tone === 'cool')
          ctx.fillStyle = `rgba(150,170,196,${Math.min(1, alpha * 0.7)})`
        else ctx.fillStyle = `rgba(240,232,218,${Math.min(1, alpha)})`
        ctx.fill()
      }
    }

    const step = () => {
      const { w, h } = dimsRef.current
      const parts = partsRef.current
      const ptr = pointerRef.current
      if (pulseRef.current > 0) pulseRef.current = Math.max(0, pulseRef.current - 0.014)
      if (echoRef.current > 0) echoRef.current = Math.max(0, echoRef.current - 0.0065)
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
      pointerRef.current.over = false
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

  useEffect(() => {
    if (!tracing) return
    const t = setTimeout(() => setTracing(false), 1200)
    return () => clearTimeout(t)
  }, [tracing])

  useEffect(() => {
    if (!spattering) return
    const t = setTimeout(() => setSpattering(false), 1000)
    return () => clearTimeout(t)
  }, [spattering])

  const acknowledge = useCallback(() => {
    if (reduced) return
    pulseRef.current = 1
    echoRef.current = 1
    setPulsing(true)
    setTracing(true)
    setSpattering(true)
    const order: Corner[] = ['tl', 'tr', 'bl', 'br']
    waveTimeoutsRef.current.forEach((t) => window.clearTimeout(t))
    waveTimeoutsRef.current = []
    order.forEach((_, i) => {
      const t = window.setTimeout(() => setEchoIdx(i), 260 + i * 300)
      waveTimeoutsRef.current.push(t)
    })
    const end = window.setTimeout(
      () => setEchoIdx(-1),
      260 + order.length * 300 + 260,
    )
    waveTimeoutsRef.current.push(end)
  }, [reduced])

  const onHeroEnter = useCallback((e: ReactPointerEvent) => {
    pointerRef.current.over = true
    heroBoxRef.current = (e.currentTarget as HTMLElement).getBoundingClientRect()
  }, [])
  const onHeroLeave = useCallback(() => {
    pointerRef.current.over = false
  }, [])
  const onHeroMove = useCallback((e: ReactPointerEvent) => {
    heroBoxRef.current = (e.currentTarget as HTMLElement).getBoundingClientRect()
  }, [])

  const d = new Date(now)
  const secAngle =
    (d.getSeconds() / 60) * 360 + (d.getMilliseconds() / 1000) * (360 / 60)
  const minAngle = (d.getMinutes() / 60) * 360 + (d.getSeconds() / 60) * 6
  const hh = d.getHours().toString().padStart(2, '0')
  const mm = d.getMinutes().toString().padStart(2, '0')

  return (
    <main className="stage">
      <canvas ref={canvasRef} className="dust" aria-hidden="true" />
      <div className="rim" aria-hidden="true" />
      <div className="codex-edge" aria-hidden="true" />

      <div className={`frame ${ready ? 'ready' : ''}`}>
        <Marg
          corner="tl"
          id="tl"
          label="folio"
          body="a question, slowly composed"
          active={active}
          wave={echoIdx === 0}
          onHover={setActive}
        />
        <Marg
          corner="tr"
          id="tr"
          label="medium"
          body="the browser is the paper"
          active={active}
          wave={echoIdx === 1}
          onHover={setActive}
        />
        <Marg
          corner="bl"
          id="bl"
          label="craft"
          body="typeset in pixels, drawn in code"
          active={active}
          wave={echoIdx === 2}
          onHover={setActive}
        />
        <Marg
          corner="br"
          id="br"
          label="now"
          active={active}
          wave={echoIdx === 3}
          onHover={setActive}
          ariaLabel={`Local time ${hh}:${mm}`}
        >
          <span className="marg-now">
            <span className="marg-now-time">
              {hh}
              <span className="clock-colon">:</span>
              {mm}
            </span>
            <span className="clock" aria-hidden="true">
              <span className="clock-ring" />
              <span className="clock-pivot" />
              <span
                className="clock-hand clock-hand-min"
                style={{ transform: `rotate(${minAngle}deg)` }}
              />
              <span
                className="clock-hand clock-hand-sec"
                style={{ transform: `rotate(${secAngle}deg)` }}
              />
            </span>
          </span>
        </Marg>

        <div className={`composition ${ready ? 'ready' : ''}`}>
          <span className="rubric">an inquiry</span>
          <Fleuron />
          <button
            type="button"
            className={`hero ${drawn ? 'drawn' : ''} ${pulsing ? 'pulse' : ''} ${tracing ? 'echo' : ''}`}
            onClick={acknowledge}
            onPointerEnter={onHeroEnter}
            onPointerLeave={onHeroLeave}
            onPointerMove={onHeroMove}
            aria-label="the question"
          >
            <svg viewBox="0 0 240 340" className="hero-svg" aria-hidden="true">
              <path className="hero-stroke" d={HERO_PATH} pathLength={100} />
              <path className="hero-trace" d={HERO_PATH} pathLength={100} />
              <circle
                className="hero-dot-ring"
                cx={HERO_DOT.cx}
                cy={HERO_DOT.cy}
                r={HERO_DOT.r + 6}
              />
              <circle
                className="hero-dot"
                cx={HERO_DOT.cx}
                cy={HERO_DOT.cy}
                r={HERO_DOT.r}
              />
            </svg>
            {spattering && (
              <span className="hero-spatter" aria-hidden="true">
                {SPATTER.map((s, i) => (
                  <span
                    key={i}
                    className="spatter-dot"
                    style={
                      {
                        '--angle': `${s.angle}deg`,
                        '--distance': `${s.distance}px`,
                        '--size': `${s.size}px`,
                        '--delay': `${s.delay}ms`,
                      } as CSSProperties
                    }
                  />
                ))}
              </span>
            )}
          </button>
          <div className="ruling" aria-hidden="true">
            <span className="ruling-mark ruling-mark-l" />
            <span className="ruling-line" />
            <span className="ruling-mark ruling-mark-r" />
          </div>
          <h1 className="question">is Minimax M3 good at frontend yet?</h1>
        </div>

        <div className="folio-mark" aria-hidden="true">
          <span className="folio-mark-rule folio-mark-rule-l" />
          <span className="folio-mark-text">quaeritur</span>
          <span className="folio-mark-rule folio-mark-rule-r" />
        </div>
      </div>
    </main>
  )
}
