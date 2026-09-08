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

type MarkKind = 'stet' | 'dele' | 'caret' | 'pilcrow' | 'question' | 'emdash' | 'trans' | 'italic'

type Mark = {
  id: string
  kind: MarkKind
  x: number
  y: number
  rot: number
  scale: number
}

const PROOFREADER_MARKS: { kind: MarkKind; short: string; name: string; hint: string }[] = [
  { kind: 'stet', short: 'stet', name: 'let it stand', hint: 'the original is correct — keep it' },
  { kind: 'dele', short: 'dele', name: 'delete', hint: 'strike through, remove the line' },
  { kind: 'caret', short: '^', name: 'insert', hint: 'add new material here' },
  { kind: 'pilcrow', short: '¶', name: 'paragraph', hint: 'break for a new ¶' },
  { kind: 'question', short: '?', name: 'flag', hint: 'this needs a second look' },
  { kind: 'emdash', short: '—', name: 'em-dash', hint: 'substitute a long pause' },
]

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
        <radialGradient id="seal-glow" cx="50%" cy="42%" r="62%">
          <stop offset="0%" stopColor="#d77b5e" />
          <stop offset="55%" stopColor="#a83a23" />
          <stop offset="100%" stopColor="#6c1d10" />
        </radialGradient>
      </defs>
      <path
        d="M32 3 C 50 4, 61 17, 60.5 33 C 60 50, 47.5 61, 32 60.5 C 17 60, 3.5 49.5, 4 32 C 4.5 16, 17.5 3.5, 32 3 Z"
        fill="url(#seal-glow)"
      />
      <path
        d="M32 4 C 49 5, 59 18, 58.5 33 C 58 49, 46 58.5, 32 58 C 18 57.5, 5 47, 5.5 32 C 6 17, 18 4.5, 32 4 Z"
        fill="none"
        stroke="rgba(60,18,8,.32)"
        strokeWidth="0.5"
      />
      <circle cx="32" cy="32" r="23" fill="none" stroke="rgba(255,235,225,.45)" strokeWidth="0.8" strokeDasharray="1.6 2.4" />
      <text x="32" y="38.5" textAnchor="middle" fontFamily="Georgia, serif" fontStyle="italic" fontSize="22" fill="#fff3ea">m³</text>
      <path d="M22 22 C 18 26, 17 32, 20 36" fill="none" stroke="rgba(255,235,225,.18)" strokeWidth="0.7" strokeLinecap="round" />
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
    <svg className={`signature ${drawn ? 'is-drawn' : ''}`} viewBox="0 0 130 30" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path className="sig-path" pathLength={1} d="M6 22 C 10 10, 14 14, 17 22 C 19 27, 22 24, 24 18 C 26 12, 30 14, 32 22" style={{ strokeDasharray: 1, strokeDashoffset: offset(0, 0.32) }} />
        <path className="sig-path" pathLength={1} d="M36 21 C 39 12, 43 13, 46 20 C 48 25, 52 22, 54 16" style={{ strokeDasharray: 1, strokeDashoffset: offset(0.1, 0.46) }} />
        <path className="sig-path" pathLength={1} d="M58 14 C 62 19, 64 25, 60 27 M 60 18 L 67 18 M 60 14 L 60 27" style={{ strokeDasharray: 1, strokeDashoffset: offset(0.22, 0.6) }} />
      </g>
      <g fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <path className="sig-path" pathLength={1} d="M82 22 C 86 11, 92 16, 94 23 C 95 27, 99 25, 100 19" style={{ strokeDasharray: 1, strokeDashoffset: offset(0.38, 0.68) }} />
        <path className="sig-path" pathLength={1} d="M104 19 C 107 13, 111 14, 113 21 C 114 26, 117 23, 118 17" style={{ strokeDasharray: 1, strokeDashoffset: offset(0.5, 0.78) }} />
      </g>
      <path className="sig-path" pathLength={1} d="M120 14 C 121 12, 124 13, 124 16 C 124 19, 120 19, 119 17 C 118 14, 122 13, 124 16" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" style={{ strokeDasharray: 1, strokeDashoffset: offset(0.62, 0.92) }} />
      <path className="sig-path" pathLength={1} d="M74 27 C 84 22, 100 25, 116 24" fill="none" stroke="currentColor" strokeWidth="0.7" strokeLinecap="round" opacity="0.55" style={{ strokeDasharray: 1, strokeDashoffset: offset(0.78, 0.98) }} />
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
        strokeWidth=".9"
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

function MarkPath({ kind }: { kind: MarkKind }) {
  switch (kind) {
    case 'stet':
      return (
        <g>
          <ellipse cx="40" cy="16" rx="32" ry="9" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <text x="40" y="20" textAnchor="middle" fontFamily="Georgia, serif" fontStyle="italic" fontSize="11" fill="currentColor">stet</text>
        </g>
      )
    case 'dele':
      return (
        <g>
          <path d="M6 16 C 14 10, 22 22, 30 16 C 38 10, 46 22, 54 16 C 62 10, 70 22, 74 16"
            fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <text x="40" y="28" textAnchor="middle" fontFamily="Georgia, serif" fontStyle="italic" fontSize="9" fill="currentColor">dele</text>
        </g>
      )
    case 'caret':
      return (
        <g>
          <path d="M28 6 L 40 1 L 52 6"
            fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M10 24 L 70 24"
            fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </g>
      )
    case 'pilcrow':
      return (
        <g>
          <path d="M26 4 C 18 4, 14 12, 18 20 C 22 24, 30 24, 34 20 C 36 18, 36 16, 34 14"
            fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M26 4 L 26 28 M 38 4 L 38 28"
            fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        </g>
      )
    case 'question':
      return (
        <g>
          <path d="M40 6 C 30 6, 24 14, 32 22 C 36 25, 42 25, 44 22 M 40 6 C 50 6, 56 14, 48 22 C 44 25, 42 22, 42 22"
            fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="43" cy="29" r="1.6" fill="currentColor" />
        </g>
      )
    case 'emdash':
      return (
        <g>
          <path d="M22 16 L 58 16"
            fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
        </g>
      )
    case 'trans':
      return (
        <g>
          <text x="40" y="22" textAnchor="middle" fontFamily="Georgia, serif" fontStyle="italic" fontSize="16" fill="currentColor">tr</text>
        </g>
      )
    case 'italic':
      return (
        <g>
          <text x="40" y="22" textAnchor="middle" fontFamily="Georgia, serif" fontStyle="italic" fontSize="13" fill="currentColor">ital</text>
        </g>
      )
  }
}

function MarkGlyph({ kind, small = false }: { kind: MarkKind; small?: boolean }) {
  return (
    <svg className={`mark-glyph ${small ? 'mark-glyph--small' : ''}`} viewBox="0 0 80 32" aria-hidden="true">
      <MarkPath kind={kind} />
    </svg>
  )
}

function MarkPalette({ selected, onSelect }: { selected: MarkKind; onSelect: (k: MarkKind) => void }) {
  return (
    <div className="mark-palette" role="radiogroup" aria-label="Proofreader's marks">
      <span className="mark-palette__legend" aria-hidden="true">
        <span className="mark-palette__legend-rule" />
        <em>pick a mark, then click the proof</em>
      </span>
      <div className="mark-palette__row">
        {PROOFREADER_MARKS.map(m => (
          <button
            key={m.kind}
            type="button"
            className={`mark-palette__btn ${selected === m.kind ? 'is-selected' : ''}`}
            onClick={() => onSelect(m.kind)}
            role="radio"
            aria-checked={selected === m.kind}
            aria-label={`${m.short} — ${m.name}`}
            title={`${m.short} — ${m.hint}`}
          >
            <MarkGlyph kind={m.kind} small />
            <span className="mark-palette__label" aria-hidden="true">{m.short}</span>
          </button>
        ))}
      </div>
    </div>
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
  superscript?: boolean
}

function TitleWord({ text, id, active, onEnter, onLeave, scribble, delay, superscript }: WordProps) {
  const cls = `tline${id ? ` word ${active ? 'word--active' : ''}` : ''}`
  const style = delay !== undefined ? { animationDelay: `${delay}s` } : undefined
  if (!id) {
    return (
      <span className={cls} style={style}>
        {text}
      </span>
    )
  }
  if (superscript) {
    const base = text.slice(0, -1)
    const sup = text.slice(-1)
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
        <svg className="word__circle" viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true">
          <ellipse cx="50" cy="20" rx="49" ry="13" />
        </svg>
        <span className="word__brackets" aria-hidden="true">
          <span className="bracket bracket--tl" />
          <span className="bracket bracket--tr" />
        </span>
        <span className="word__base">{base}</span>
        <span className="word__sup" aria-hidden="true">{sup}</span>
        {scribble && <Scribble path={scribble} />}
        <svg className="word__wire" viewBox="0 0 100 26" preserveAspectRatio="none" aria-hidden="true">
          <path d="M2 14 Q 40 6 98 14" />
        </svg>
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
      <svg className="word__circle" viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true">
        <ellipse cx="50" cy="20" rx="49" ry="13" />
      </svg>
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
  svgRef: React.RefObject<SVGSVGElement | null>
  onStamp: (x: number, y: number) => void
}

function MarkLayer({ active, marks, svgRef, onStamp }: MarkLayerProps) {
  const handleDown = (e: React.PointerEvent) => {
    if (!active) return
    if (e.button !== undefined && e.button !== 0) return
    const svg = svgRef.current
    if (!svg) return
    const rect = svg.getBoundingClientRect()
    if (rect.width <= 0 || rect.height <= 0) return
    const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left))
    const y = Math.max(0, Math.min(rect.height, e.clientY - rect.top))
    onStamp(x, y)
    e.preventDefault()
  }

  return (
    <svg
      ref={svgRef}
      className={`marks ${active ? 'marks--active' : ''}`}
      preserveAspectRatio="none"
      onPointerDown={handleDown}
      aria-hidden="true"
    >
      <defs>
        <filter id="markRough" x="-2%" y="-2%" width="104%" height="104%">
          <feTurbulence type="fractalNoise" baseFrequency="0.028" numOctaves="2" seed="5" />
          <feDisplacementMap in="SourceGraphic" scale="1.1" />
        </filter>
      </defs>
      <g className="marks__g" filter="url(#markRough)">
        {marks.map(m => (
          <g
            key={m.id}
            transform={`translate(${m.x} ${m.y}) rotate(${m.rot}) translate(-40 -16) scale(${m.scale})`}
            className="mark-stamp"
          >
            <svg width="80" height="32" viewBox="0 0 80 32">
              <MarkPath kind={m.kind} />
            </svg>
          </g>
        ))}
      </g>
    </svg>
  )
}

function SpecimenSetting({ s }: { s: Specimen }) {
  const lineA = s.id === 'cut' ? 'is Minimax' : s.id === 'hand' ? 'is M³' : 'IS'
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
  isOpen,
  onToggle,
  cardId,
}: {
  s: Specimen
  isOpen: boolean
  onToggle: () => void
  cardId: string
}) {
  return (
    <article
      className={`slip slip--${s.casing} ${isOpen ? 'is-open' : ''}`}
      data-n={s.n}
    >
      <button
        type="button"
        className="slip__flap"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={cardId}
        aria-label={`${isOpen ? 'Close' : 'Open'} ${s.name}`}
        title={isOpen ? 'Close this voice' : `Open the ${s.name}`}
      >
        <span className="slip__flap-fold" aria-hidden="true" />
        <span className="slip__flap-row">
          <span className="slip__flap-n">{s.n}</span>
          <span className="slip__flap-name">{s.name}</span>
        </span>
        <span className="slip__flap-press">{s.press}</span>
        <span className="slip__flap-ornament" aria-hidden="true">
          <svg viewBox="0 0 20 16">
            <path d={s.ornament} fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </button>
      <div className="slip__leaf" id={cardId}>
        <span className="slip__leaf-mark" aria-hidden="true">{s.n}</span>
        <SpecimenSetting s={s} />
        <span className="slip__leaf-press">{s.press}</span>
      </div>
      <footer className="slip__foot">
        <p className="slip__note">{s.note}</p>
      </footer>
    </article>
  )
}

function ReadingRibbon({ progress }: { progress: number }) {
  const pct = Math.min(100, Math.max(0, progress * 100))
  const stops = [
    { top: 8, label: 'Q' },
    { top: 30, label: 'A' },
    { top: 54, label: 'M' },
    { top: 76, label: 'S' },
    { top: 92, label: '·' },
  ]
  return (
    <div className="ribbon" aria-hidden="true">
      <span className="ribbon__band" style={{ height: `${pct}%` }}>
        <span className="ribbon__gloss" />
      </span>
      <span className="ribbon__ruler">
        {stops.map((s, i) => (
          <span
            key={i}
            className={`ribbon__stop ${pct >= s.top ? 'is-passed' : ''}`}
            style={{ top: `${s.top}%` }}
            data-label={s.label}
          />
        ))}
      </span>
      <span className="ribbon__tail" style={{ top: `${pct}%` }}>
        <span className="ribbon__notch ribbon__notch--l" />
        <span className="ribbon__notch ribbon__notch--r" />
        <span className="ribbon__seal">m³</span>
      </span>
    </div>
  )
}

function PageMark({ active }: { active: string | null }) {
  const labels: Record<string, string> = {
    question: 'the question',
    answer: 'the answer',
    marginalia: 'the margin',
    specimens: 'the specimens',
  }
  const order = ['question', 'answer', 'marginalia', 'specimens']
  const i = active ? Math.max(0, order.indexOf(active)) : 0
  const label = labels[order[i]] || labels.question
  return (
    <span className="page-mark" aria-hidden="true">
      <span className="page-mark__rule" />
      <span className="page-mark__chip">
        <span className="page-mark__chip-n">{String(i + 1).padStart(2, '0')}</span>
        <span className="page-mark__chip-of">/</span>
        <span className="page-mark__chip-total">{String(order.length).padStart(2, '0')}</span>
      </span>
      <span className="page-mark__label">{label}</span>
      <span className="page-mark__rule" />
    </span>
  )
}

type PressRow = { kind: 'key' | 'icon' | 'mark'; glyph: string; label: string; hint?: string; markKind?: MarkKind }

function PressKey() {
  const rows: PressRow[] = [
    { kind: 'key', glyph: 'P', label: 'lift the pencil', hint: 'then click the proof to stamp a mark' },
    { kind: 'key', glyph: 'Esc', label: 'put the pencil down' },
    { kind: 'key', glyph: '⌫', label: 'shake off the marks' },
    ...PROOFREADER_MARKS.map(m => ({
      kind: 'mark' as const,
      glyph: m.kind,
      label: m.short,
      hint: m.hint,
      markKind: m.kind,
    })),
    { kind: 'icon', glyph: '◯', label: 'hover a title word', hint: 'it wakes its matching note' },
    { kind: 'icon', glyph: '◇', label: 'click a specimen flap', hint: 'the title takes its voice' },
    { kind: 'icon', glyph: '↺', label: 'press the seal', hint: 'the answer tips into the proof' },
  ]
  return (
    <aside className="press-key" aria-labelledby="press-key-title">
      <span className="press-key__corner press-key__corner--tl" aria-hidden="true">
        <svg viewBox="0 0 16 16">
          <path d="M2 2 L14 2 M2 2 L2 14" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
        </svg>
      </span>
      <span className="press-key__corner press-key__corner--br" aria-hidden="true">
        <svg viewBox="0 0 16 16">
          <path d="M2 14 L14 14 M14 2 L14 14" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
        </svg>
      </span>
      <header className="press-key__head">
        <p className="kicker">
          <span>compositor's key</span>
          <b />
          <em>for the curious reader</em>
        </p>
        <h3 className="press-key__title" id="press-key-title">
          a small <i>legend</i> for the page's hidden presses
        </h3>
      </header>
      <ol className="press-key__grid">
        {rows.map((r, i) => (
          <li key={i} className={`press-key__row press-key__row--${r.kind}`}>
            <span className={`press-key__glyph press-key__glyph--${r.kind}`} aria-hidden="true">
              {r.kind === 'icon' ? (
                <svg viewBox="0 0 24 24" className="press-key__icon">
                  <circle cx="12" cy="12" r="7" fill="none" stroke="currentColor" strokeWidth="1.4" />
                  {r.glyph === '◇' && <path d="M12 5 L19 12 L12 19 L5 12 Z" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />}
                  {r.glyph === '↺' && (
                    <>
                      <path d="M19 12 A 7 7 0 1 1 12 5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                      <path d="M12 5 L15 3 L15 7 Z" fill="currentColor" />
                    </>
                  )}
                </svg>
              ) : r.kind === 'mark' && r.markKind ? (
                <MarkGlyph kind={r.markKind} small />
              ) : (
                <kbd className="press-key__kbd">{r.glyph}</kbd>
              )}
            </span>
            <span className="press-key__copy">
              <strong>{r.label}</strong>
              {r.hint && <em>{r.hint}</em>}
            </span>
          </li>
        ))}
      </ol>
    </aside>
  )
}

function RibbonKnot() {
  return (
    <svg className="ribbon-knot" viewBox="0 0 100 24" aria-hidden="true">
      <path
        d="M2 12 C 12 4, 22 20, 34 12"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        d="M66 12 C 78 4, 88 20, 98 12"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        d="M34 12 C 38 8, 44 8, 48 12 C 52 16, 58 16, 62 12 C 64 10, 66 10, 66 12"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="50" cy="12" r="3" fill="currentColor" />
      <circle cx="50" cy="12" r="1" fill="var(--paper-tip)" />
    </svg>
  )
}

export function App() {
  const [open, setOpen] = useState(false)
  const [hovered, setHovered] = useState<string | null>(null)
  const [pulse, setPulse] = useState(0)
  const [pencil, setPencil] = useState(false)
  const [marks, setMarks] = useState<Mark[]>([])
  const [selectedMark, setSelectedMark] = useState<MarkKind>('stet')
  const [announcement, setAnnouncement] = useState('')
  const [sealPasses, setSealPasses] = useState(0)
  const [sigVisible, setSigVisible] = useState(false)
  const [openCase, setOpenCase] = useState<string | null>(null)
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
      setAnnouncement(next ? `Pencil on — ${PROOFREADER_MARKS.find(m => m.kind === selectedMark)?.short || 'stet'} selected.` : 'Pencil off.')
      return next
    })
  }, [selectedMark])

  const onSelectMark = useCallback((kind: MarkKind) => {
    setSelectedMark(kind)
    const found = PROOFREADER_MARKS.find(m => m.kind === kind)
    setAnnouncement(found ? `${found.short} selected — ${found.hint}` : '')
  }, [])

  const onClearMarks = useCallback(() => {
    const n = marks.length
    setMarks([])
    setAnnouncement(n === 0 ? 'No marks to shake off.' : `Shaken off ${n} mark${n === 1 ? '' : 's'}.`)
  }, [marks.length])

  const onStamp = useCallback((x: number, y: number) => {
    const rot = (Math.random() - 0.5) * 10
    const scale = 0.95 + Math.random() * 0.12
    setMarks(m => [...m, { id: uid(), kind: selectedMark, x, y, rot, scale }])
  }, [selectedMark])

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

  const scribbles = Object.fromEntries(MARGINALIA.map(m => [m.id, m.scribble]))
  const blots = Object.fromEntries(MARGINALIA.map(m => [m.id, m.blot]))
  const marksSvg = Object.fromEntries(MARGINALIA.map(m => [m.id, m.mark]))

  const beatOn = now.getSeconds() % 2 === 0
  const titleDelays = [0.0, 0.08, 0.16, 0.24, 0.32, 0.4, 0.48]
  const marked = marks.length > 0

  const openSpecimen = SPECIMENS.find(s => s.id === openCase) || null
  const markByKind = (k: MarkKind) => marks.filter(m => m.kind === k).length
  const lastStamped = marks.length > 0 ? marks[marks.length - 1] : null
  const lastStampInfo = lastStamped ? PROOFREADER_MARKS.find(m => m.kind === lastStamped.kind) : null

  return (
    <main
      className={`folio ${open ? 'folio--open' : ''} ${pencil ? 'folio--pencil' : ''} ${openSpecimen ? `folio--voice-${openSpecimen.id}` : ''}`}
      style={{
        ['--progress' as string]: progress,
        ['--ink-set' as string]: String(Math.min(1, Math.max(0, progress * 5))),
        ['--voice-tint' as string]: openSpecimen ? '1' : '0',
      }}
    >
      <Dust />
      <ReadingRibbon progress={progress} />
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
        <PageMark active={activeSection} />
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
            aria-label={pencil ? `Pencil on, ${lastStampInfo ? lastStampInfo.short : 'stet'} ready` : 'Pencil off, click to lift it'}
            title={pencil ? `Pencil on — ${PROOFREADER_MARKS.find(m => m.kind === selectedMark)?.short} (P or Esc to turn off)` : 'Pencil off (press P to lift)'}
          >
            <span className="pencil-toggle__rule" aria-hidden="true" />
            <span className="pencil-toggle__face" aria-hidden="true">
              <PencilGlyph active={pencil} />
            </span>
            <span className="pencil-toggle__text">
              <strong>{pencil ? 'stamping' : 'pencil'}</strong>
              <em>{pencil ? `${PROOFREADER_MARKS.find(m => m.kind === selectedMark)?.short} ready` : 'lift to mark'}</em>
            </span>
            <span className="pencil-toggle__count" aria-hidden="true">
              {marked ? <>{marks.length}<i>{marks.length === 1 ? 'mark' : 'marks'}</i></> : <i>empty</i>}
            </span>
          </button>
          {pencil && (
            <MarkPalette selected={selectedMark} onSelect={onSelectMark} />
          )}
          {marked && (
            <button
              type="button"
              className="pencil-clear"
              onClick={onClearMarks}
              aria-label={`Clear all ${marks.length} marks`}
              title="Shake off all marks (Backspace)"
            >
              <EraserGlyph />
              <span>shake off</span>
              <span className="pencil-clear__count" aria-hidden="true">{marks.length}</span>
            </button>
          )}
        </div>

        <div className="proof__stage" ref={stageRef}>
          <MarkLayer
            active={pencil}
            marks={marks}
            svgRef={svgRef}
            onStamp={onStamp}
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
                    superscript
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
                <p className={`proof__subtitle ${openSpecimen ? 'proof__subtitle--voiced' : ''}`} aria-hidden="true">
                  <span>{openSpecimen ? `set in ${openSpecimen.name}` : 'set by hand'}</span>
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
            <p className="specimens__cue" aria-live="polite">
              <span className="specimens__cue-rule" />
              <span>
                <em>click a flap</em> — the title above takes the voice inside
              </span>
              <span className="specimens__cue-rule" />
            </p>
            <div className={`slips__wall ${specimenRest ? 'is-rest' : ''} ${openCase ? 'has-open' : ''}`}>
              {SPECIMENS.map(s => (
                <SpecimenCard
                  key={s.id}
                  s={s}
                  cardId={`slip-leaf-${s.id}`}
                  isOpen={openCase === s.id}
                  onToggle={() => setOpenCase(prev => (prev === s.id ? null : s.id))}
                />
              ))}
            </div>
            <p className="specimens__hint" aria-hidden="true">
              <span className="specimens__hint-rule" />
              <em>{openSpecimen ? `now set in ${openSpecimen.name}` : 'click a flap to lift the page'}</em>
              <span className="specimens__hint-rule" />
            </p>
          </section>
        </div>

        <PressKey />

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
               ? <>marked with care<small className="colophon__marks">· {marks.length} hand-stamped{marks.length === 1 ? '' : 's'}</small></>
               : 'made with intent, not certainty'}
             {sealPasses > 0 && (<>
               <span className="colophon__sep">·</span>
               <span className="colophon__passes">{sealPasses === 1 ? 'one stamp' : `${sealPasses} stamps`}</span>
             </>)}
             {openSpecimen && (<>
                <span className="colophon__sep">·</span>
                <span className="colophon__voice">in the voice of <em>{openSpecimen.name}</em></span>
              </>)}
          </p>
          <p className="colophon__tonight" aria-hidden="true">
            <span>tonight's proof — pressed for one reader, returned with care</span>
          </p>
          <div className={`colophon__sign ${sigVisible ? 'is-drawn' : ''}`} aria-hidden="true">
            <Signature drawn={sigVisible} progress={progress} />
            <span className="colophon__sign-cap">{marked ? 'signed & annotated' : 'signed at the press'}</span>
          </div>
          <div className={`colophon__tied ${sigVisible ? 'is-tied' : ''}`} aria-hidden="true">
            <RibbonKnot />
            <span className="colophon__tied-text">
              tied with care <em>— a finished proof</em>
            </span>
          </div>
          {marked && (
            <div className="colophon__ledger" aria-label="Marks stamped on this proof">
              <span className="colophon__ledger-rule" aria-hidden="true" />
              <span className="colophon__ledger-head">the proofreader's hand:</span>
              <ul className="colophon__ledger-list">
                {PROOFREADER_MARKS.filter(m => markByKind(m.kind) > 0).map(m => (
                  <li key={m.kind} className="colophon__ledger-item">
                    <span className="colophon__ledger-glyph" aria-hidden="true">
                      <MarkGlyph kind={m.kind} small />
                    </span>
                    <span className="colophon__ledger-count">{markByKind(m.kind)}</span>
                    <span className="colophon__ledger-name">{m.short}</span>
                  </li>
                ))}
              </ul>
              <span className="colophon__ledger-rule colophon__ledger-rule--end" aria-hidden="true" />
            </div>
          )}
          <a className="colophon__up" href="#top">return to the question <span aria-hidden="true">↑</span></a>
        </footer>
      </article>
    </main>
  )
}