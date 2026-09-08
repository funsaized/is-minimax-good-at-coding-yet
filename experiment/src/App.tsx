import { useCallback, useEffect, useId, useRef, useState } from 'react'

const TITLE = 'is Minimax M3 good at frontend yet?'

type Gloss = {
  id: string
  n: string
  head: string
  gloss: string
  text: string
  scribble: string
  blot: string
  tether: string
  note: string
  mark: string
}

const MARGINALIA: Gloss[] = [
  {
    id: 'm3',
    n: 'i.',
    head: 'Keep the fingerprint',
    gloss: 'a habit, not a name',
    text: 'The maker is a habit, not a name. When the model rotates, the page should still feel like someone — or something — was here.',
    scribble: 'M2 9 C 8 3, 16 15, 24 9 C 30 5, 38 13, 46 9',
    blot: 'M11 3 C 17 5, 21 11, 18 17 C 14 21, 5 20, 3 14 C 1 9, 6 3, 11 3 Z',
    tether: 'M58 4 C 40 14, 18 28, 4 56',
    note: 'the press remembers the hand, not the pressman',
    mark: 'M2 8 L18 8 M10 2 L10 14',
  },
  {
    id: 'good',
    n: 'ii.',
    head: 'Choose a side',
    gloss: 'one confident claim',
    text: 'A page gets clearer when it makes one confident choice instead of presenting every possible direction at once.',
    scribble: 'M2 9 C 12 3, 22 15, 32 9 C 42 3, 52 15, 62 9',
    blot: 'M10 4 C 16 3, 21 8, 20 14 C 19 20, 11 21, 6 17 C 1 13, 4 6, 10 4 Z',
    tether: 'M58 6 C 36 14, 14 32, 4 64',
    note: 'a clean claim is a kindness to the reader',
    mark: 'M2 8 L18 8 M14 2 L14 14 M6 5 L14 5',
  },
  {
    id: 'yet',
    n: 'iii.',
    head: 'Protect the quiet',
    gloss: 'the pause that matters',
    text: '"Yet" carries the question. The pause before it is where the answer lives — and where the page earns its reading.',
    scribble: 'M2 9 C 8 3, 16 15, 24 9 C 30 5, 36 13, 42 9',
    blot: 'M9 3 C 14 2, 20 7, 19 13 C 18 19, 10 20, 5 16 C 1 11, 4 4, 9 3 Z',
    tether: 'M58 8 C 40 18, 20 38, 4 70',
    note: 'leave room for the reader to arrive',
    mark: 'M2 8 L18 8 M2 2 L18 14',
  },
]

type Specimen = {
  id: 'cut' | 'hand' | 'wood'
  n: 'i.' | 'ii.' | 'iii.'
  name: string
  press: string
  casing: 'small' | 'italic' | 'wood'
  note: string
  ornament: string
}

const SPECIMENS: Specimen[] = [
  {
    id: 'cut',
    n: 'i.',
    name: 'the foundry cut',
    press: 'roman, 12pt · leaded',
    casing: 'small',
    note: 'reads like a job ticket — useful, no flourish',
    ornament: 'M2 8 L18 8 M10 2 L10 14',
  },
  {
    id: 'hand',
    n: 'ii.',
    name: "the scribe's hand",
    press: 'italic copperplate, 18pt',
    casing: 'italic',
    note: 'reads like a dedication — quiet, slightly personal',
    ornament: 'M2 9 C 6 3, 10 15, 14 9 C 16 5, 18 11, 20 8',
  },
  {
    id: 'wood',
    n: 'iii.',
    name: 'the wood type',
    press: 'clarendon, 48pt · reversed',
    casing: 'wood',
    note: 'reads like a poster — answers whether you like it or not',
    ornament: 'M2 8 L18 8 M5 2 L13 14 M13 2 L5 14',
  },
]

type Mark = { id: string; d: string }

function useNow(intervalMs: number) {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), intervalMs)
    return () => window.clearInterval(id)
  }, [intervalMs])
  return now
}

function useScrollState() {
  const [state, setState] = useState<{ progress: number; activeWord: string | null; activeSection: string | null }>({ progress: 0, activeWord: null, activeSection: null })
  useEffect(() => {
    let raf = 0
    const update = () => {
      raf = 0
      const h = document.documentElement
      const max = h.scrollHeight - h.clientHeight
      const progress = max > 0 ? Math.min(1, Math.max(0, h.scrollTop / max)) : 0

      const center = window.innerHeight * 0.5
      const threshold = Math.max(120, window.innerHeight * 0.32)
      const words = document.querySelectorAll<HTMLElement>('.word[data-id]')
      let found: string | null = null
      let bestDistance = Infinity
      for (const w of words) {
        const rect = w.getBoundingClientRect()
        if (rect.bottom < -40 || rect.top > window.innerHeight + 40) continue
        const wordCenter = (rect.top + rect.bottom) / 2
        const distance = Math.abs(wordCenter - center)
        if (distance < bestDistance && distance < threshold) {
          bestDistance = distance
          found = w.dataset.id || null
        }
      }

      const eyeY = window.scrollY + window.innerHeight * 0.32
      const sectionIds = ['question', 'answer', 'marginalia', 'specimens']
      let section: string | null = null
      for (const id of sectionIds) {
        const el = document.getElementById(id)
        if (!el) continue
        const rect = el.getBoundingClientRect()
        const top = window.scrollY + rect.top
        const bottom = top + rect.height
        if (eyeY >= top && eyeY <= bottom) {
          section = id
          break
        }
      }
      if (!section) {
        const last = sectionIds[sectionIds.length - 1]
        const lastEl = document.getElementById(last)
        if (lastEl) {
          const r = lastEl.getBoundingClientRect()
          if (r.top < window.innerHeight * 0.5) section = last
        }
      }

      setState(prev => {
        if (prev.progress === progress && prev.activeWord === found && prev.activeSection === section) return prev
        return { progress, activeWord: found, activeSection: section }
      })
    }
    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(update)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    update()
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])
  return state
}

function formatTime(d: Date) {
  const h = d.getHours()
  const m = d.getMinutes().toString().padStart(2, '0')
  const s = d.getSeconds().toString().padStart(2, '0')
  return `${h}:${m}:${s}`
}

const MONTHS = [
  'january', 'february', 'march', 'april', 'may', 'june',
  'july', 'august', 'september', 'october', 'november', 'december',
]
function formatDate(d: Date) {
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`
}

function uid() {
  return Math.random().toString(36).slice(2, 9)
}

function Dust() {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let raf = 0
    let w = 0
    let h = 0
    type P = { x: number; y: number; r: number; vy: number; vx: number; a: number; ph: number; tw: number; hue: number }
    let motes: P[] = []

    const seed = () => {
      const area = w * h
      const count = Math.min(56, Math.max(22, Math.floor(area / 28000)))
      motes = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 0.25 + Math.random() * 1.4,
        vy: 0.03 + Math.random() * 0.1,
        vx: (Math.random() - 0.5) * 0.04,
        a: 0.04 + Math.random() * 0.14,
        ph: Math.random() * Math.PI * 2,
        tw: 0.4 + Math.random() * 0.6,
        hue: Math.random(),
      }))
    }

    const resize = () => {
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = Math.floor(w * dpr)
      canvas.height = Math.floor(h * dpr)
      canvas.style.width = w + 'px'
      canvas.style.height = h + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      seed()
    }

    const tick = (t: number) => {
      ctx.clearRect(0, 0, w, h)
      for (const p of motes) {
        p.y -= p.vy
        p.x += p.vx + Math.sin(t * 0.0005 + p.ph) * 0.04
        if (p.y < -6) {
          p.y = h + 6
          p.x = Math.random() * w
        }
        if (p.x < -6) p.x = w + 6
        if (p.x > w + 6) p.x = -6
        const flicker = 0.6 + 0.4 * Math.sin(t * 0.0008 * p.tw + p.ph)
        const warm = p.hue > 0.78
        if (warm) {
          ctx.beginPath()
          ctx.fillStyle = `rgba(199, 91, 59, ${p.a * flicker * 1.1})`
          ctx.arc(p.x, p.y, p.r * 0.9, 0, Math.PI * 2)
          ctx.fill()
        } else {
          ctx.beginPath()
          ctx.fillStyle = `rgba(24, 43, 53, ${p.a * flicker})`
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
          ctx.fill()
        }
      }
      if (!reduce) raf = requestAnimationFrame(tick)
    }

    resize()
    window.addEventListener('resize', resize)
    if (!reduce) {
      raf = requestAnimationFrame(tick)
    } else {
      for (const p of motes) {
        ctx.beginPath()
        ctx.fillStyle = `rgba(24, 43, 53, ${p.a})`
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fill()
      }
    }
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={ref} className="dust" aria-hidden="true" />
}

function CropMarks() {
  return (
    <div className="crops" aria-hidden="true">
      <span className="crop crop--tl" />
      <span className="crop crop--tr" />
      <span className="crop crop--bl" />
      <span className="crop crop--br" />
    </div>
  )
}

function EditionPlate() {
  return (
    <div className="plate" aria-hidden="true">
      <span className="plate__row plate__row--top">
        <span className="plate__rule" />
        <span className="plate__label">proof sheet</span>
      </span>
      <span className="plate__row plate__row--bot">
        <span className="plate__sub">not for issue</span>
        <span className="plate__rule plate__rule--end" />
      </span>
    </div>
  )
}

function Seal() {
  return (
    <svg className="seal" viewBox="0 0 64 64" aria-hidden="true">
      <defs>
        <radialGradient id="seal-glow" cx="50%" cy="38%" r="65%">
          <stop offset="0%" stopColor="#e7a48c" />
          <stop offset="55%" stopColor="#dd684b" />
          <stop offset="100%" stopColor="#a83a23" />
        </radialGradient>
      </defs>
      <circle cx="32" cy="32" r="29" fill="url(#seal-glow)" />
      <circle cx="32" cy="32" r="29" fill="none" stroke="rgba(50,16,8,.25)" strokeWidth="0.6" />
      <circle cx="32" cy="32" r="23" fill="none" stroke="rgba(255,235,225,.55)" strokeWidth="0.8" strokeDasharray="1.6 2.4" />
      <text x="32" y="38.5" textAnchor="middle" fontFamily="Georgia, serif" fontStyle="italic" fontSize="22" fill="#fff3ea">m³</text>
    </svg>
  )
}

function Spark() {
  return (
    <svg className="spark" viewBox="0 0 80 12" aria-hidden="true">
      <path d="M0 6h30M50 6h30M40 1l5 5-5 5" />
    </svg>
  )
}

function Kite() {
  return (
    <svg className="kite" viewBox="0 0 80 80" aria-hidden="true">
      <path d="M40 6 L74 40 L40 74 L6 40 Z" />
      <path d="M40 6 L40 74 M6 40 L74 40" />
      <circle cx="40" cy="40" r="2" fill="currentColor" />
    </svg>
  )
}

function Caret() {
  return (
    <svg className="caret" viewBox="0 0 12 12" aria-hidden="true">
      <path d="M6 1 L11 10 L1 10 Z" />
    </svg>
  )
}

function Scribble({ path }: { path: string }) {
  return (
    <svg className="scribble" viewBox="0 0 100 18" preserveAspectRatio="none" aria-hidden="true">
      <path d={path} />
    </svg>
  )
}

function InkBlot({ path }: { path: string }) {
  return (
    <svg className="inkblot" viewBox="0 0 24 24" aria-hidden="true">
      <path d={path} />
    </svg>
  )
}

function Flourish() {
  return (
    <svg className="flourish" viewBox="0 0 60 18" aria-hidden="true">
      <path d="M2 9 C 12 2, 22 16, 30 9 C 38 2, 48 16, 58 9" />
      <circle cx="30" cy="9" r="1.2" fill="currentColor" />
    </svg>
  )
}

type SignatureProps = { drawn?: boolean; progress?: number }
function Signature({ drawn = true, progress = 1 }: SignatureProps) {
  const offset = (start: number, end: number) => {
    const t = Math.max(0, Math.min(1, (progress - start) / (end - start)))
    return (1 - t).toFixed(3)
  }
  return (
    <svg className={`signature ${drawn ? 'is-drawn' : ''}`} viewBox="0 0 110 30" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path className="sig-path" pathLength={1} d="M6 22 C 9 12, 13 18, 16 22" style={{ strokeDasharray: 1, strokeDashoffset: offset(0, 0.62) }} />
        <path className="sig-path" pathLength={1} d="M20 24 C 22 16, 26 10, 27 18 C 28 24, 30 22, 32 16" style={{ strokeDasharray: 1, strokeDashoffset: offset(0.08, 0.7) }} />
        <path className="sig-path" pathLength={1} d="M44 12 C 40 16, 39 24, 46 24 C 52 24, 52 16, 48 12 C 44 9, 42 16, 47 19" style={{ strokeDasharray: 1, strokeDashoffset: offset(0.16, 0.78) }} />
        <path className="sig-path" pathLength={1} d="M60 12 C 64 16, 64 24, 60 24 M 60 18 L 67 18" style={{ strokeDasharray: 1, strokeDashoffset: offset(0.24, 0.84) }} />
        <path className="sig-path" pathLength={1} d="M74 24 L 74 12 L 86 24 L 86 12" style={{ strokeDasharray: 1, strokeDashoffset: offset(0.32, 0.9) }} />
      </g>
      <path className="sig-path" pathLength={1} d="M93 26 C 96 18, 100 22, 102 18" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" style={{ strokeDasharray: 1, strokeDashoffset: offset(0.42, 0.96) }} />
    </svg>
  )
}

function PressTally({ count }: { count: number }) {
  const visible = Math.min(count, 6)
  const over = Math.max(0, count - 6)
  return (
    <div className={`press-tally ${count > 0 ? 'press-tally--has' : ''}`} aria-hidden="true">
      <span className="press-tally__rule" />
      <span className="press-tally__label">{count === 0 ? 'no pass yet' : `${count} pass${count === 1 ? '' : 'es'}`}</span>
      <span className="press-tally__row">
        {Array.from({ length: visible }).map((_, i) => (
          <svg key={i} className="press-tally__blot" viewBox="0 0 12 12">
            <path d="M6 1.5 C 9 1.5, 11 4.5, 10.4 7.2 C 9.8 9.8, 6.6 10.6, 4.2 9.4 C 1.6 8.2, 1.6 5, 3.4 3.2 C 4.6 2, 5.6 1.5, 6 1.5 Z" />
          </svg>
        ))}
        {over > 0 && <span className="press-tally__more">+{over}</span>}
      </span>
    </div>
  )
}

function BinderThread() {
  return (
    <div className="binder-thread" aria-hidden="true">
      <svg viewBox="0 0 18 600" preserveAspectRatio="none">
        <line
          className="binder-thread__line"
          x1="9"
          y1="14"
          x2="9"
          y2="596"
        />
        <circle cx="9" cy="6" r="3.5" className="binder-thread__knot" />
      </svg>
    </div>
  )
}

function DropcapSwash() {
  return (
    <svg className="answer__dropcap-swash" viewBox="0 0 60 24" preserveAspectRatio="none" aria-hidden="true">
      <path
        d="M2 6 C 8 2, 14 10, 22 8 C 30 6, 38 12, 46 9 C 52 7, 58 11, 58 14"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <circle cx="58" cy="14" r="1.4" fill="currentColor" />
    </svg>
  )
}

function DropcapGlyph() {
  return (
    <svg className="dropcap-glyph" viewBox="0 0 64 64" aria-hidden="true">
      <path
        d="M44 8 C 32 8, 22 14, 20 26 C 18 36, 24 46, 36 48 C 42 49, 48 47, 50 44 M44 8 C 44 18, 44 28, 44 38 M44 8 C 38 12, 32 16, 28 22 M44 38 C 40 42, 36 46, 30 48"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M48 50 C 50 54, 54 56, 58 56"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        opacity="0.7"
      />
      <circle cx="58" cy="56" r="1.6" fill="currentColor" opacity="0.85" />
    </svg>
  )
}

function PressMark() {
  return (
    <svg className="press-mark" viewBox="0 0 64 64" aria-hidden="true">
      <circle cx="32" cy="32" r="29" fill="none" stroke="currentColor" strokeWidth="0.9" />
      <circle cx="32" cy="32" r="23" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="1.2 2.4" />
      <text x="32" y="38" textAnchor="middle" fontFamily="Georgia, serif" fontStyle="italic" fontSize="20" fill="currentColor">m³</text>
      <path d="M16 48 Q 32 54 48 48" fill="none" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" />
      <circle cx="14" cy="32" r="0.8" fill="currentColor" />
      <circle cx="50" cy="32" r="0.8" fill="currentColor" />
    </svg>
  )
}

function PencilGlyph({ active }: { active: boolean }) {
  return (
    <svg className="pencil-glyph" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M3 21 L7 17 L18 6 L21 3 L18 0 L15 3 L4 14 L3 21 Z"
        fill="currentColor"
        fillOpacity={active ? 0.85 : 0.18}
      />
      <path
        d="M14 7 L18 11"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M3 21 L7 17"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M18 0 L21 3"
        stroke="currentColor"
        strokeWidth="0.9"
        strokeLinecap="round"
        fill="none"
        opacity="0.5"
      />
    </svg>
  )
}

function EraserGlyph() {
  return (
    <svg className="eraser-glyph" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3 16 L11 8 L19 16 L14 21 L7 21 Z" fill="currentColor" fillOpacity="0.2" />
      <path d="M3 16 L11 8 L19 16" stroke="currentColor" strokeWidth="1.1" fill="none" strokeLinejoin="round" />
      <path d="M3 16 L14 21" stroke="currentColor" strokeWidth="1.1" fill="none" strokeLinecap="round" />
      <path d="M11 8 L14 21" stroke="currentColor" strokeWidth="0.8" fill="none" strokeDasharray="1.5 1.6" opacity="0.5" />
    </svg>
  )
}

type WordProps = {
  text: string
  id?: string
  active?: boolean
  onEnter?: () => void
  onLeave?: () => void
  scribble?: string
  delay?: number
}

function TitleWord({ text, id, active, onEnter, onLeave, scribble, delay }: WordProps) {
  const cls = `tline${id ? ` word ${active ? 'word--active' : ''}` : ''}`
  const style = delay !== undefined ? { animationDelay: `${delay}s` } : undefined
  if (!id) {
    return (
      <span className={cls} style={style}>
        {text}
      </span>
    )
  }
  return (
    <span
      className={cls}
      style={style}
      data-id={id}
      tabIndex={0}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onFocus={onEnter}
      onBlur={onLeave}
      aria-describedby={`gloss-${id}`}
    >
      <span className="word__brackets" aria-hidden="true">
        <span className="bracket bracket--tl" />
        <span className="bracket bracket--tr" />
      </span>
      {text}
      {scribble && <Scribble path={scribble} />}
      <svg className="word__wire" viewBox="0 0 100 26" preserveAspectRatio="none" aria-hidden="true">
        <path d="M2 14 Q 40 6 98 14" />
      </svg>
    </span>
  )
}

type MarkLayerProps = {
  active: boolean
  marks: Mark[]
  currentPath: string
  svgRef: React.RefObject<SVGSVGElement | null>
  onPathStart: (x: number, y: number) => void
  onPathMove: (x: number, y: number) => void
  onPathEnd: () => void
  onPathCancel: () => void
}

function MarkLayer({ active, marks, currentPath, svgRef, onPathStart, onPathMove, onPathEnd, onPathCancel }: MarkLayerProps) {
  const downRef = useRef(false)

  const getPoint = (e: React.PointerEvent) => {
    const svg = svgRef.current
    if (!svg) return null
    const rect = svg.getBoundingClientRect()
    if (rect.width <= 0 || rect.height <= 0) return null
    return {
      x: Math.max(0, Math.min(rect.width, e.clientX - rect.left)),
      y: Math.max(0, Math.min(rect.height, e.clientY - rect.top)),
    }
  }

  const handleDown = (e: React.PointerEvent) => {
    if (!active) return
    if (e.button !== undefined && e.button !== 0) return
    const p = getPoint(e)
    if (!p) return
    downRef.current = true
    try {
      ;(e.target as Element).setPointerCapture?.(e.pointerId)
    } catch {
      // ignore capture failures
    }
    onPathStart(p.x, p.y)
    e.preventDefault()
  }

  const handleMove = (e: React.PointerEvent) => {
    if (!active || !downRef.current) return
    const p = getPoint(e)
    if (!p) return
    onPathMove(p.x, p.y)
  }

  const handleUp = (e: React.PointerEvent) => {
    if (!active) return
    if (!downRef.current) return
    downRef.current = false
    try {
      ;(e.target as Element).releasePointerCapture?.(e.pointerId)
    } catch {
      // ignore release failures
    }
    onPathEnd()
  }

  const handleCancel = () => {
    if (!active) return
    if (!downRef.current) return
    downRef.current = false
    onPathCancel()
  }

  return (
    <svg
      ref={svgRef}
      className={`marks ${active ? 'marks--active' : ''}`}
      preserveAspectRatio="none"
      onPointerDown={handleDown}
      onPointerMove={handleMove}
      onPointerUp={handleUp}
      onPointerCancel={handleCancel}
      onPointerLeave={handleUp}
      aria-hidden="true"
    >
      <defs>
        <filter id="markRough" x="-2%" y="-2%" width="104%" height="104%">
          <feTurbulence type="fractalNoise" baseFrequency="0.022" numOctaves="2" seed="7" />
          <feDisplacementMap in="SourceGraphic" scale="1.6" />
        </filter>
      </defs>
      <g className="marks__g" filter="url(#markRough)">
        {marks.map(m => (
          <path
            key={m.id}
            className="marks__stroke"
            d={m.d}
          />
        ))}
        {currentPath && (
          <path
            className="marks__stroke"
            d={currentPath}
          />
        )}
      </g>
    </svg>
  )
}

function SpecimenSetting({ s }: { s: Specimen }) {
  const lineA = s.id === 'cut' ? 'is Minimax' : s.id === 'hand' ? 'is M^3' : 'IS'
  const lineB = s.id === 'cut' ? 'good at frontend' : s.id === 'hand' ? 'good at frontend' : 'GOOD AT'
  const lineC = s.id === 'cut' ? 'yet ?' : s.id === 'hand' ? 'yet?' : 'FRONTEND YET'
  return (
    <div className={`specimen__setting specimen__setting--${s.casing}`} aria-hidden="true">
      <span className="specimen__line specimen__line--a">{lineA}</span>
      <span className="specimen__line specimen__line--b">{lineB}</span>
      <span className="specimen__line specimen__line--c">{lineC}</span>
    </div>
  )
}

function SpecimenCard({
  s,
  active,
  onEnter,
  onLeave,
}: {
  s: Specimen
  active: boolean
  onEnter: () => void
  onLeave: () => void
}) {
  return (
    <article
      className={`specimen specimen--${s.casing} ${active ? 'is-active' : ''}`}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onFocus={onEnter}
      onBlur={onLeave}
      tabIndex={0}
    >
      <span className="specimen__corner specimen__corner--tl" aria-hidden="true" />
      <span className="specimen__corner specimen__corner--tr" aria-hidden="true" />
      <span className="specimen__corner specimen__corner--bl" aria-hidden="true" />
      <span className="specimen__corner specimen__corner--br" aria-hidden="true" />
      <header className="specimen__head">
        <span className="specimen__n">{s.n}</span>
        <span className="specimen__rule" />
        <span className="specimen__press">{s.press}</span>
      </header>
      <SpecimenSetting s={s} />
      <footer className="specimen__foot">
        <h3 className="specimen__name">{s.name}</h3>
        <p className="specimen__note">{s.note}</p>
        <span className="specimen__ornament" aria-hidden="true">
          <svg viewBox="0 0 20 16">
            <path d={s.ornament} fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </footer>
    </article>
  )
}

export function App() {
  const [open, setOpen] = useState(false)
  const [hovered, setHovered] = useState<string | null>(null)
  const [pulse, setPulse] = useState(0)
  const [pencil, setPencil] = useState(false)
  const [marks, setMarks] = useState<Mark[]>([])
  const [currentPath, setCurrentPath] = useState('')
  const [announcement, setAnnouncement] = useState('')
  const [sealPasses, setSealPasses] = useState(0)
  const [sigVisible, setSigVisible] = useState(false)
  const [specimenFocus, setSpecimenFocus] = useState<string | null>(null)
  const [specimenRest, setSpecimenRest] = useState(true)
  const answerId = useId()
  const now = useNow(1000)
  const { progress, activeWord, activeSection } = useScrollState()
  const sealRef = useRef<HTMLButtonElement>(null)
  const pencilRef = useRef<HTMLButtonElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const colophonRef = useRef<HTMLElement>(null)

  const effectiveActive = hovered || activeWord

  const onToggle = () => {
    setOpen(v => !v)
    setPulse(p => p + 1)
    setSealPasses(p => p + 1)
  }

  const onPencilToggle = useCallback(() => {
    setPencil(v => {
      const next = !v
      setAnnouncement(next ? 'Pencil on. Drag to mark the proof.' : 'Pencil off.')
      return next
    })
  }, [])

  const onClearMarks = useCallback(() => {
    setMarks([])
    setCurrentPath('')
    setAnnouncement('Marks cleared.')
  }, [])

  useEffect(() => {
    if (!pencil) {
      setCurrentPath('')
    }
  }, [pencil])

  useEffect(() => {
    const el = colophonRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setSigVisible(true)
            obs.disconnect()
            break
          }
        }
      },
      { threshold: 0.35 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      setSpecimenRest(false)
      return
    }
    const id = window.setTimeout(() => setSpecimenRest(false), 2200)
    return () => window.clearTimeout(id)
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return
      if (e.key === 'p' || e.key === 'P') {
        if (e.metaKey || e.ctrlKey || e.altKey) return
        e.preventDefault()
        onPencilToggle()
      } else if (e.key === 'Escape' && pencil) {
        e.preventDefault()
        setPencil(false)
        setAnnouncement('Pencil off.')
      } else if ((e.key === 'Backspace' || e.key === 'Delete') && pencil && marks.length > 0) {
        if (e.metaKey || e.ctrlKey || e.altKey) return
        e.preventDefault()
        onClearMarks()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [pencil, marks.length, onPencilToggle, onClearMarks])

  const onPathStart = useCallback((x: number, y: number) => {
    setCurrentPath(`M${x.toFixed(1)} ${y.toFixed(1)}`)
  }, [])

  const onPathMove = useCallback((x: number, y: number) => {
    setCurrentPath(prev => (prev ? `${prev} L${x.toFixed(1)} ${y.toFixed(1)}` : `M${x.toFixed(1)} ${y.toFixed(1)}`))
  }, [])

  const onPathEnd = useCallback(() => {
    setCurrentPath(prev => {
      if (prev && prev.length > 12) {
        setMarks(m => [...m, { id: uid(), d: prev }])
      }
      return ''
    })
  }, [])

  const onPathCancel = useCallback(() => {
    setCurrentPath('')
  }, [])

  const scribbles = Object.fromEntries(MARGINALIA.map(m => [m.id, m.scribble]))
  const blots = Object.fromEntries(MARGINALIA.map(m => [m.id, m.blot]))
  const marksSvg = Object.fromEntries(MARGINALIA.map(m => [m.id, m.mark]))

  const beatOn = now.getSeconds() % 2 === 0
  const titleDelays = [0.0, 0.08, 0.16, 0.24, 0.32, 0.4, 0.48]
  const marked = marks.length > 0

  const focusedSpecimen = SPECIMENS.find(s => s.id === specimenFocus) || null

  return (
    <main
      className={`folio ${open ? 'folio--open' : ''} ${pencil ? 'folio--pencil' : ''} ${focusedSpecimen ? `folio--voice-${focusedSpecimen.id}` : ''}`}
      style={{
        ['--progress' as string]: progress,
        ['--ink-set' as string]: String(Math.min(1, Math.max(0, progress * 5))),
        ['--voice-tint' as string]: focusedSpecimen ? '1' : '0',
      }}
    >
      <Dust />
      <div className="folio__lamp" aria-hidden="true" />
      <div className="folio__lamp folio__lamp--warm" aria-hidden="true" />
      <div className="folio__vignette" aria-hidden="true" />
      <div className="folio__grain" aria-hidden="true" />
      <span className="sr-only" aria-live="polite">{announcement}</span>

      <header className="folio__head">
        <a className="folio__sig" href="#top" aria-label="Return to the question">
          <span className="folio__mark" aria-hidden="true">m³</span>
          <span className="folio__press">
            <span>a small</span>
            <strong>front-end press</strong>
          </span>
        </a>
        <nav aria-label="Sections" className="folio__nav">
          <a href="#question" className={activeSection === 'question' ? 'is-active' : ''}>question</a>
          <a href="#answer" onClick={() => setOpen(true)} className={activeSection === 'answer' ? 'is-active' : ''}>answer</a>
          <a href="#marginalia" className={activeSection === 'marginalia' ? 'is-active' : ''}>margin</a>
          <a href="#specimens" className={activeSection === 'specimens' ? 'is-active' : ''}>specimens</a>
        </nav>
        <span className="folio__edition" aria-label="Publication note">
          an unfinished<br /><i>answer</i>
        </span>
      </header>

      <article className="proof" id="top">
        <CropMarks />

        <aside className="proof__rail" aria-hidden="true">
          <span className="proof__q">Q.</span>
          <span className="proof__thread">
            <span className={`proof__thread-mark proof__thread-mark--1 ${progress >= 0.12 ? 'is-on' : ''}`} />
            <span className={`proof__thread-mark proof__thread-mark--2 ${progress >= 0.32 ? 'is-on' : ''}`} />
            <span className={`proof__thread-mark proof__thread-mark--3 ${progress >= 0.52 ? 'is-on' : ''}`} />
            <span className={`proof__thread-mark proof__thread-mark--4 ${progress >= 0.72 ? 'is-on' : ''}`} />
            <span className={`proof__thread-mark proof__thread-mark--5 ${progress >= 0.9 ? 'is-on' : ''}`} />
          </span>
          <small className="proof__hint">read<br />slowly</small>
        </aside>

        <EditionPlate />

        <div className="proof__cue-tools" aria-label="Editor's tools">
          <button
            ref={pencilRef}
            type="button"
            className={`pencil-toggle ${pencil ? 'pencil-toggle--on' : ''}`}
            onClick={onPencilToggle}
            aria-pressed={pencil}
            aria-label={pencil ? 'Pencil on, drag to mark the proof' : 'Pencil off, click to mark the proof'}
            title={pencil ? 'Pencil on (press P or Esc to turn off)' : 'Pencil off (press P to turn on)'}
          >
            <span className="pencil-toggle__rule" aria-hidden="true" />
            <span className="pencil-toggle__face" aria-hidden="true">
              <PencilGlyph active={pencil} />
            </span>
            <span className="pencil-toggle__text">
              <strong>{pencil ? 'marking' : 'mark'}</strong>
              <em>the proof</em>
            </span>
            <span className="pencil-toggle__count" aria-hidden="true">
              {marked ? <>{marks.length}<i>{marks.length === 1 ? 'mark' : 'marks'}</i></> : <i>empty</i>}
            </span>
          </button>
          {marked && (
            <button
              type="button"
              className="pencil-clear"
              onClick={onClearMarks}
              aria-label={`Clear all ${marks.length} marks`}
              title="Clear all marks (Backspace)"
            >
              <EraserGlyph />
              <span>shake off</span>
            </button>
          )}
        </div>

        <div className="proof__stage" ref={stageRef}>
          <BinderThread />
          <MarkLayer
            active={pencil}
            marks={marks}
            currentPath={currentPath}
            svgRef={svgRef}
            onPathStart={onPathStart}
            onPathMove={onPathMove}
            onPathEnd={onPathEnd}
            onPathCancel={onPathCancel}
          />

          <div className="proof__layout">
            <div className="proof__main">
              <header className="proof__head" id="question">
                <p className="kicker">
                  <span>the question</span>
                  <b />
                  <em>pressed in good faith</em>
                </p>
                <h1 className="proof__title">
                  <span aria-hidden="true" className="proof__title-rule" />
                  <TitleWord text="is Minimax " delay={titleDelays[0]} />
                  <TitleWord
                    text="M3"
                    id="m3"
                    active={effectiveActive === 'm3'}
                    onEnter={() => setHovered('m3')}
                    onLeave={() => setHovered(null)}
                    scribble={scribbles.m3}
                    delay={titleDelays[1]}
                  />
                  <TitleWord text=" " delay={titleDelays[2]} />
                  <TitleWord
                    text="good at"
                    id="good"
                    active={effectiveActive === 'good'}
                    onEnter={() => setHovered('good')}
                    onLeave={() => setHovered(null)}
                    scribble={scribbles.good}
                    delay={titleDelays[3]}
                  />
                  <TitleWord text=" frontend " delay={titleDelays[4]} />
                  <TitleWord
                    text="yet"
                    id="yet"
                    active={effectiveActive === 'yet'}
                    onEnter={() => setHovered('yet')}
                    onLeave={() => setHovered(null)}
                    scribble={scribbles.yet}
                    delay={titleDelays[5]}
                  />
                  <TitleWord text="?" delay={titleDelays[6]} />
                  <span aria-hidden="true" className="proof__title-rule" />
                </h1>
                <p className="proof__subtitle" aria-hidden="true">
                  <span>set by hand</span>
                  <i />
                  <em>this edition, for one reader</em>
                </p>
                <p className="proof__lede">
                  A small, stubborn inquiry into whether a machine can make a page feel like <em>someone was here</em>.
                </p>

                <div className="proof__cue">
                  <button
                    ref={sealRef}
                    type="button"
                    className={`seal-cta ${open ? 'seal-cta--open' : ''}`}
                    onClick={onToggle}
                    aria-expanded={open}
                    aria-controls={answerId}
                    data-pulse={pulse}
                  >
                    <span className="seal-cta__halo" aria-hidden="true" />
                    <span className="seal-cta__disc" aria-hidden="true">
                      <span className="seal-cta__icon"><Seal /></span>
                    </span>
                    <span className="seal-cta__text">
                      <strong className="seal-cta__label">
                        {open ? 'lift the seal' : 'press the seal'}
                      </strong>
                      <em className="seal-cta__sub">
                        {open ? 'to fold the page back' : 'and the answer tips in'}
                      </em>
                    </span>
                    <span className="seal-cta__splat" aria-hidden="true">
                      <svg viewBox="0 0 40 40" preserveAspectRatio="none">
                        <path d="M20 18 C 26 16, 32 22, 28 28 C 24 34, 14 32, 12 26 C 10 20, 16 14, 22 18 C 26 22, 20 26, 18 22 Z" />
                      </svg>
                    </span>
                  </button>
                  <p className="proof__aside">
                    <i>a useful question</i><br />
                    is rarely tidy
                  </p>
                </div>
                <PressTally count={sealPasses} />
              </header>

              <section
                className={`answer ${open ? 'answer--open' : ''}`}
                id="answer"
                aria-hidden={!open}
                aria-labelledby="answer-title"
              >
                <div className="answer__plate">
                  <div className="answer__hatch" aria-hidden="true" />
                  <span className="answer__crease" aria-hidden="true" />
                  <span className="answer__pin answer__pin--tl" aria-hidden="true" />
                  <span className="answer__pin answer__pin--tr" aria-hidden="true" />
                  <div className="answer__inner">
                    <div className="answer__stamp">
                      <Seal />
                      <span className="answer__stamp-text">
                        pressed<br />
                        <b>by hand</b>
                      </span>
                    </div>
                    <div className="answer__body" id={answerId}>
                      <p className="kicker kicker--ink" id="answer-title">
                        <span>the answer</span>
                        <b />
                        <em>for now</em>
                      </p>
                      <p className="answer__lead">
                        <span className="answer__dropcap" aria-hidden="true">
                          <span className="answer__dropcap-letter">Y</span>
                          <span className="answer__dropcap-glyph" aria-hidden="true">
                            <DropcapGlyph />
                          </span>
                          <span className="answer__dropcap-flourish"><Flourish /></span>
                          <span className="answer__dropcap-swash"><DropcapSwash /></span>
                        </span>
                        <span className="sr-only">Y</span>es — when it stops trying to look impressive.
                      </p>
                      <div className="answer__columns">
                        <p>
                          The good part is not the gradient, the flourish, or the clever little mechanism. It is the moment the page gives you room to notice <em>one thing</em>. Then another.
                        </p>
                        <p>
                          So this is a qualified yes: <em>good at front-end</em> means attentive to the person on the other side of the glass. The rest is decoration with a job to do.
                        </p>
                      </div>
                      <p className="answer__pull" aria-hidden="true">
                        <span className="answer__pull-rule" />
                        <em>attention, not ornament</em>
                        <span className="answer__pull-rule answer__pull-rule--end" />
                      </p>
                      <div className="answer__sign">
                        <Spark />
                        <span>— m³, still learning the pause</span>
                        <span className="answer__sign-corner" aria-hidden="true">
                          <Kite />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            <aside className="margin" id="marginalia" aria-labelledby="margin-title">
              <header className="margin__head">
                <p className="kicker">
                  <span>marginalia</span>
                  <b />
                  <em>read, or hover a word</em>
                </p>
                <h2 id="margin-title" className="margin__title">
                  three notes from <i>the fold</i>
                </h2>
                <p className="margin__lede">
                  Not rules. The residue of pressing this page.
                </p>
              </header>
              <ol className="margin__list">
                {MARGINALIA.map(m => (
                  <li
                    key={m.n}
                    className={`margin__item ${effectiveActive === m.id ? 'margin__item--active' : ''}`}
                    onMouseEnter={() => setHovered(m.id)}
                    onMouseLeave={() => setHovered(null)}
                    onFocus={() => setHovered(m.id)}
                    onBlur={() => setHovered(null)}
                    tabIndex={0}
                    aria-describedby={`gloss-${m.id}`}
                  >
                    <span className="margin__n">{m.n}</span>
                    <div className="margin__copy">
                      <span className="margin__mark" aria-hidden="true">
                        <svg viewBox="0 0 20 16">
                          <path d={marksSvg[m.id]} fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                        </svg>
                      </span>
                      <span className="margin__tether" aria-hidden="true">
                        <svg viewBox="0 0 60 80" preserveAspectRatio="none">
                          <path d={m.tether} />
                        </svg>
                      </span>
                      <span className="margin__blot" aria-hidden="true">
                        <InkBlot path={blots[m.id]} />
                      </span>
                      <h3 className="margin__h" id={`gloss-${m.id}`}>
                        {m.head}
                        <span className="margin__gloss">— {m.gloss}</span>
                      </h3>
                      <p className="margin__p">{m.text}</p>
                      <p className="margin__note" aria-hidden="true">
                        <span className="margin__note-rule" />
                        <em>ed.</em> {m.note}
                      </p>
                      <span className="margin__caret" aria-hidden="true">
                        <Caret />
                      </span>
                    </div>
                  </li>
                ))}
              </ol>
            </aside>
          </div>

          <section className="specimens" id="specimens" aria-labelledby="specimens-title">
            <header className="specimens__head">
              <p className="kicker">
                <span>specimens</span>
                <b />
                <em>from the press drawer</em>
              </p>
              <h2 id="specimens-title" className="specimens__title">
                three ways to <i>set the question</i>
              </h2>
              <p className="specimens__lede">
                The same question, pulled three times from the drawer. Read any one aloud and the answer changes a little.
              </p>
            </header>
            <div className={`specimens__wall ${specimenRest ? 'is-rest' : ''}`}>
              {SPECIMENS.map(s => (
                <SpecimenCard
                  key={s.id}
                  s={s}
                  active={specimenFocus === s.id}
                  onEnter={() => setSpecimenFocus(s.id)}
                  onLeave={() => setSpecimenFocus(null)}
                />
              ))}
            </div>
            <p className="specimens__hint" aria-hidden="true">
              <span className="specimens__hint-rule" />
              <em>hover a card</em> — the title above takes its voice
              <span className="specimens__hint-rule" />
            </p>
          </section>
        </div>

        <div className="proof__device" aria-hidden="true">
          <span className="proof__device-rule" />
          <PressMark />
          <span className="proof__device-text">
            <em>m³ press</em>
            <small>set & printed in-browser</small>
          </span>
          <span className="proof__device-rule proof__device-rule--end" />
        </div>

        <footer className="colophon" aria-label="Colophon" ref={colophonRef}>
          <div className="colophon__rule" aria-hidden="true">
            <span />
            <i>m³</i>
            <span />
          </div>
          <p className="colophon__line">
            pressed at <b>{formatTime(now)}</b>
            <span className={`colophon__beat ${beatOn ? 'is-on' : ''}`} aria-hidden="true" />
            <span className="colophon__sep">·</span>
            {formatDate(now)}
             <span className="colophon__sep">·</span>
             {marked
               ? <>marked with care<small className="colophon__marks">· {marks.length} hand-drawn</small></>
               : 'made with intent, not certainty'}
             {sealPasses > 0 && (<>
               <span className="colophon__sep">·</span>
               <span className="colophon__passes">{sealPasses === 1 ? 'one stamp' : `${sealPasses} stamps`}</span>
             </>)}
             {focusedSpecimen && (<>
               <span className="colophon__sep">·</span>
               <span className="colophon__voice">in the voice of <em>{focusedSpecimen.name}</em></span>
             </>)}
          </p>
          <div className={`colophon__sign ${sigVisible ? 'is-drawn' : ''}`} aria-hidden="true">
            <Signature drawn={sigVisible} progress={progress} />
            <span className="colophon__sign-cap">{marked ? 'signed & annotated' : 'signed at the press'}</span>
          </div>
          <a className="colophon__up" href="#top">return to the question <span aria-hidden="true">↑</span></a>
        </footer>
      </article>
    </main>
  )
}