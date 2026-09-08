import { useEffect, useMemo, useRef, useState } from 'react'

const TITLE = 'is Minimax M3 good at frontend yet?'
const ANSWER = '— and the page itself, which you are reading now.'
const REPLY = 'so read it once, then again — slower this time.'
const FOOTNOTE = 'relege · without a reader, silence'
const EPIGRAPH = 'to ask a page — and let it answer in its own hand.'

const SYNODIC = 29.530588853
const NEW_MOON_REF = Date.UTC(2000, 0, 6, 18, 14, 0)

function moonPhaseOf(date: Date): number {
  const days = (date.getTime() - NEW_MOON_REF) / 86400000
  const phase = ((days % SYNODIC) + SYNODIC) % SYNODIC
  return phase / SYNODIC
}

function moonPhaseName(phase: number): string {
  if (phase < 0.03 || phase > 0.97) return 'new'
  if (phase < 0.22) return 'waxing crescent'
  if (phase < 0.28) return 'first quarter'
  if (phase < 0.47) return 'waxing gibbous'
  if (phase < 0.53) return 'full'
  if (phase < 0.72) return 'waning gibbous'
  if (phase < 0.78) return 'last quarter'
  return 'waning crescent'
}

function moonTerminatorPath(phase: number, cx: number, cy: number, r: number): string {
  if (phase <= 0.001 || phase >= 0.999) {
    return `M ${cx} ${cy - r} A 0.001 0.001 0 1 1 ${cx} ${cy - r} Z`
  }
  const angle = phase * 2 * Math.PI
  const rx = Math.max(0, Math.abs(Math.cos(angle)) * r)
  const waxing = phase < 0.5
  const limbSweep = waxing ? 1 : 0
  let termSweep: number
  if (waxing) {
    termSweep = phase < 0.25 ? 0 : 1
  } else {
    termSweep = phase < 0.75 ? 0 : 1
  }
  if (rx < 0.05) {
    return `M ${cx} ${cy - r} A ${r} ${r} 0 0 ${limbSweep} ${cx} ${cy + r} L ${cx} ${cy - r} Z`
  }
  return (
    `M ${cx} ${cy - r} ` +
    `A ${r} ${r} 0 0 ${limbSweep} ${cx} ${cy + r} ` +
    `A ${rx} ${r} 0 0 ${termSweep} ${cx} ${cy - r} Z`
  )
}

type Phase = 'idle' | 'answering' | 'replying' | 'complete'

interface MarginaliaItem {
  mark: string
  note: string
  gloss: string
}

const MARGINALIA: MarginaliaItem[] = [
  { mark: '¶', note: 'the question, plainly set', gloss: 'set plain as the day it was asked' },
  { mark: '†', note: 'see folio lxxvii, rect.', gloss: 'the same folio, turned to face you' },
  { mark: '‡', note: 'a self-answering page', gloss: 'a page that names itself in the act' },
]

interface SelfNote {
  id: string
  targetIndex: number
  wordLength: number
  glyph: string
  text: string
  top: number
}

const ANSWER_NOTES: SelfNote[] = [
  { id: 'page', targetIndex: 11, wordLength: 4, glyph: '¶', text: 'a self-answering page', top: 22 },
  { id: 'you', targetIndex: 30, wordLength: 3, glyph: '†', text: 'the attentive reader', top: 60 },
  { id: 'reading', targetIndex: 38, wordLength: 7, glyph: '‡', text: 'at the pace of attention', top: 86 },
]

interface ScholarGloss {
  word: string
  gloss: string
}

const ANSWER_GLOSSES: ScholarGloss[] = [
  { word: 'page', gloss: 'folium — the leaf that holds the question, recto and verso together' },
  { word: 'itself', gloss: 'ipse — itself; the page answers in its own hand' },
  { word: 'you', gloss: 'tu, lector — the attentive reader completes the verse' },
  { word: 'reading', gloss: 'legere — to gather, to choose, to mark; the reader is co-author' },
  { word: 'now', gloss: 'nunc — the only tense in which a page lives; the rest is type' },
]

const REPLY_GLOSSES: ScholarGloss[] = [
  { word: 'once', gloss: 'semel — once, while the ink is still wet' },
  { word: 'again', gloss: 'iterum — once more; the same leaf, the same press' },
  { word: 'slower', gloss: 'tarde — slowly, by the press’s own cadence' },
]

function scholarWordsByKey(glosses: ScholarGloss[]): Record<string, string> {
  const out: Record<string, string> = {}
  for (const g of glosses) out[g.word] = g.gloss
  return out
}

const SCHOLAR_GLOSS_MAP: Record<string, string> = {
  ...scholarWordsByKey(ANSWER_GLOSSES),
  ...scholarWordsByKey(REPLY_GLOSSES),
}

function wrapWithScholarAnchors(
  text: string,
  active: string | null,
  setActive: (key: string | null) => void,
): React.ReactNode {
  if (!text) return null
  const matches: { word: string; index: number; length: number }[] = []
  for (const word of Object.keys(SCHOLAR_GLOSS_MAP)) {
    const re = new RegExp(`\\b${word}\\b`, 'g')
    let m: RegExpExecArray | null
    while ((m = re.exec(text)) !== null) {
      matches.push({ word: m[0], index: m.index, length: m[0].length })
    }
  }
  matches.sort((a, b) => a.index - b.index)
  const parts: React.ReactNode[] = []
  let last = 0
  for (let i = 0; i < matches.length; i++) {
    const m = matches[i]
    if (m.index > last) parts.push(text.slice(last, m.index))
    parts.push(
      <span
        key={`scholar-${m.word}-${m.index}-${i}`}
        className={`scholar-anchor${active === m.word ? ' is-active' : ''}`}
        tabIndex={0}
        role="button"
        aria-label={`${m.word} — a scholar’s note: ${SCHOLAR_GLOSS_MAP[m.word]}`}
        onMouseEnter={() => setActive(m.word)}
        onMouseLeave={() => setActive(null)}
        onFocus={() => setActive(m.word)}
        onBlur={() => setActive(null)}
        onClick={(e) => {
          e.preventDefault()
          setActive(active === m.word ? null : m.word)
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            setActive(active === m.word ? null : m.word)
          } else if (e.key === 'Escape') {
            setActive(null)
          }
        }}
      >
        {m.word}
      </span>,
    )
    last = m.index + m.length
  }
  if (last < text.length) parts.push(text.slice(last))
  return parts
}

interface TrailStar {
  id: number
  x0: number
  y0: number
  x1: number
  y1: number
  cx: number
  cy: number
  delay: number
  duration: number
  r: number
  hue: number
}

const TRAIL_STARS: TrailStar[] = [
  { id: 0, x0: 0.50, y0: 0.32, x1: 0.66, y1: 0.50, cx: 0.58, cy: 0.40, delay: 0,    duration: 3.6, r: 1.6, hue: 0.0  },
  { id: 1, x0: 0.50, y0: 0.32, x1: 0.62, y1: 0.56, cx: 0.42, cy: 0.44, delay: 0.4,  duration: 3.8, r: 1.1, hue: 0.06 },
  { id: 2, x0: 0.50, y0: 0.32, x1: 0.70, y1: 0.54, cx: 0.66, cy: 0.36, delay: 0.9,  duration: 3.4, r: 1.3, hue: -0.05 },
  { id: 3, x0: 0.50, y0: 0.32, x1: 0.60, y1: 0.62, cx: 0.36, cy: 0.52, delay: 1.4,  duration: 4.0, r: 1.0, hue: 0.02 },
  { id: 4, x0: 0.50, y0: 0.32, x1: 0.72, y1: 0.58, cx: 0.74, cy: 0.42, delay: 1.8,  duration: 3.6, r: 1.4, hue: 0.08 },
  { id: 5, x0: 0.50, y0: 0.32, x1: 0.66, y1: 0.66, cx: 0.32, cy: 0.64, delay: 2.2,  duration: 3.8, r: 1.2, hue: -0.03 },
  { id: 6, x0: 0.50, y0: 0.32, x1: 0.72, y1: 0.70, cx: 0.76, cy: 0.66, delay: 2.6,  duration: 4.0, r: 1.5, hue: 0.04 },
  { id: 7, x0: 0.50, y0: 0.32, x1: 0.66, y1: 0.78, cx: 0.50, cy: 0.82, delay: 3.0,  duration: 4.2, r: 1.0, hue: 0.0 },
]

function ConstellationTrail({
  active,
  visible,
  reduced,
}: {
  active: boolean
  visible: boolean
  reduced: boolean
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const motesRef = useRef<
    {
      progress: number
      speed: number
      delay: number
      r: number
      hue: number
      cx: number
      cy: number
      x0: number
      y0: number
      x1: number
      y1: number
    }[]
  >([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf = 0
    let last = performance.now()

    const sizeCanvas = () => {
      const parent = canvas.parentElement
      if (!parent) return
      const rect = parent.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.max(1, Math.floor(rect.width * dpr))
      canvas.height = Math.max(1, Math.floor(rect.height * dpr))
      canvas.style.width = `${rect.width}px`
      canvas.style.height = `${rect.height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const draw = (now: number) => {
      const dt = Math.min(50, now - last) / 1000
      last = now

      const parent = canvas.parentElement
      if (!parent) return
      const rect = parent.getBoundingClientRect()
      ctx.clearRect(0, 0, rect.width, rect.height)

      if (!visible) {
        raf = requestAnimationFrame(draw)
        return
      }

      const motes = motesRef.current
      if (motes.length === 0) {
        motesRef.current = TRAIL_STARS.map((s) => ({
          progress: 0,
          speed: 1 / s.duration,
          delay: s.delay,
          r: s.r,
          hue: s.hue,
          cx: s.cx,
          cy: s.cy,
          x0: s.x0,
          y0: s.y0,
          x1: s.x1,
          y1: s.y1,
        }))
      }

      const quad = (t: number, c: number) => c * t * t * (3 - 2 * t)

      for (const m of motes) {
        if (active && !reduced) {
          const elapsed = (now / 1000 - m.delay) * m.speed
          m.progress = Math.max(0, Math.min(1.1, elapsed))
        } else if (reduced && visible) {
          m.progress = 1.05
        }
        if (m.progress <= 0) continue
        const p = Math.max(0, Math.min(1, m.progress))
        const eased = p < 0.5 ? quad(p * 2, 0.5) : 1 - quad((1 - p) * 2, 0.5)
        const x = (m.x0 + (m.x1 - m.x0) * eased) * rect.width
        const y = (m.y0 + (m.y1 - m.y0) * eased) * rect.height
        const ctrlX = m.cx * rect.width
        const ctrlY = m.cy * rect.height
        const bx =
          (1 - eased) * (1 - eased) * (m.x0 * rect.width) +
          2 * (1 - eased) * eased * ctrlX +
          eased * eased * (m.x1 * rect.width)
        const by =
          (1 - eased) * (1 - eased) * (m.y0 * rect.height) +
          2 * (1 - eased) * eased * ctrlY +
          eased * eased * (m.y1 * rect.height)
        const a = p > 1 ? 1 - (p - 1) * 4 : p < 0.15 ? p / 0.15 : 1
        const warmth = 245 + m.hue * 40
        const green = 198 + m.hue * 18
        const tintR = Math.round(Math.min(255, Math.max(200, warmth)))
        const tintG = Math.round(Math.min(232, Math.max(150, green)))
        const tintB = Math.round(120 + Math.max(0, -m.hue) * 30)

        const halo = ctx.createRadialGradient(bx, by, 0, bx, by, m.r * 6)
        halo.addColorStop(0, `rgba(${tintR}, ${tintG}, ${tintB}, ${a * 0.32})`)
        halo.addColorStop(0.4, `rgba(${tintR}, ${tintG}, ${tintB}, ${a * 0.12})`)
        halo.addColorStop(1, `rgba(${tintR}, ${tintG}, ${tintB}, 0)`)
        ctx.fillStyle = halo
        ctx.beginPath()
        ctx.arc(bx, by, m.r * 6, 0, Math.PI * 2)
        ctx.fill()

        ctx.fillStyle = `rgba(${tintR}, ${tintG}, ${tintB}, ${a})`
        ctx.beginPath()
        ctx.arc(bx, by, m.r * (0.85 + 0.25 * Math.sin(now * 0.002 + m.delay)), 0, Math.PI * 2)
        ctx.fill()

        ctx.fillStyle = `rgba(255, 248, 224, ${a * 0.85})`
        ctx.beginPath()
        ctx.arc(bx, by, m.r * 0.35, 0, Math.PI * 2)
        ctx.fill()

        if (p >= 0.95 && p <= 1.05) {
          const settleX = x
          const settleY = y
          ctx.save()
          ctx.translate(settleX, settleY)
          ctx.globalAlpha = (1 - Math.abs(p - 1) * 12) * 0.8
          ctx.fillStyle = `rgba(${tintR}, ${tintG}, ${tintB}, 0.5)`
          ctx.beginPath()
          for (let i = 0; i < 8; i++) {
            const a2 = (i / 8) * Math.PI * 2
            const r1 = m.r * 1.4
            const r2 = m.r * 0.5
            ctx.moveTo(0, 0)
            ctx.lineTo(Math.cos(a2) * r1, Math.sin(a2) * r1)
            ctx.lineTo(Math.cos(a2 + Math.PI / 8) * r2, Math.sin(a2 + Math.PI / 8) * r2)
          }
          ctx.fill()
          ctx.restore()
        }
      }

      raf = requestAnimationFrame(draw)
    }

    sizeCanvas()
    raf = requestAnimationFrame(draw)
    const ro = new ResizeObserver(() => sizeCanvas())
    if (canvas.parentElement) ro.observe(canvas.parentElement)

    return () => {
      if (raf) cancelAnimationFrame(raf)
      ro.disconnect()
    }
  }, [active, visible, reduced])

  return (
    <canvas
      ref={canvasRef}
      className={`constellation-trail${active ? ' is-active' : ''}${visible ? ' is-visible' : ''}`}
      aria-hidden="true"
    />
  )
}

/* ──────────────────────────────────────────────────────────────────────
   iteration 162 · a composed folio breath seal

   A single delicate impression that sits between the running head and
   the folio masthead. It is the page's first breath — three small
   breath dots arranged in a soft curve, a center coral-and-gold press
   pip, and an italic inscription that names the press in its own hand.
   Slow-reveals when the page arrives; never moves again.
   ────────────────────────────────────────────────────────────────────── */

function FolioBreath({ reduced }: { reduced: boolean }) {
  return (
    <figure
      className={`folio-breath${reduced ? ' is-static' : ''}`}
      aria-hidden="true"
    >
      <svg
        className="folio-breath-plate"
        viewBox="0 0 320 48"
        focusable="false"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="fb-rule" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(167, 60, 44, 0)" />
            <stop offset="14%" stopColor="rgba(167, 60, 44, 0.5)" />
            <stop offset="50%" stopColor="rgba(200, 146, 62, 0.74)" />
            <stop offset="86%" stopColor="rgba(167, 60, 44, 0.5)" />
            <stop offset="100%" stopColor="rgba(167, 60, 44, 0)" />
          </linearGradient>
          <linearGradient id="fb-rule-ghost" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(167, 60, 44, 0)" />
            <stop offset="50%" stopColor="rgba(167, 60, 44, 0.22)" />
            <stop offset="100%" stopColor="rgba(167, 60, 44, 0)" />
          </linearGradient>
          <radialGradient id="fb-face" cx="50%" cy="36%" r="64%">
            <stop offset="0%" stopColor="rgba(255, 246, 218, 0.74)" />
            <stop offset="62%" stopColor="rgba(245, 220, 168, 0.32)" />
            <stop offset="100%" stopColor="rgba(214, 178, 116, 0)" />
          </radialGradient>
          <radialGradient id="fb-halo" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(255, 220, 150, 0.18)" />
            <stop offset="100%" stopColor="rgba(255, 220, 150, 0)" />
          </radialGradient>
        </defs>

        <ellipse cx="160" cy="24" rx="68" ry="14" fill="url(#fb-halo)" />

        <line
          x1="6"
          y1="9"
          x2="314"
          y2="9"
          stroke="url(#fb-rule-ghost)"
          strokeWidth="0.32"
          strokeDasharray="0.6 1.6"
          strokeLinecap="round"
        />
        <line
          x1="6"
          y1="7"
          x2="314"
          y2="7"
          stroke="url(#fb-rule)"
          strokeWidth="0.5"
          strokeLinecap="round"
          className="folio-breath-rule"
        />

        <g className="folio-breath-dots" fill="rgba(167, 60, 44, 0.6)">
          <circle cx="44" cy="7" r="0.5" />
          <circle cx="276" cy="7" r="0.5" />
        </g>

        <g className="folio-breath-seal">
          <circle cx="160" cy="7" r="3.6" fill="url(#fb-face)" />
          <circle cx="160" cy="7" r="3.6" fill="none" stroke="url(#fb-rule)" strokeWidth="0.5" />
          <circle cx="160" cy="7" r="2.6" fill="none" stroke="url(#fb-rule)" strokeWidth="0.22" strokeDasharray="0.4 1.2" opacity="0.78" />
          <circle cx="160" cy="7" r="0.9" fill="rgba(167, 60, 44, 0.78)" />
          <circle cx="160" cy="7" r="0.32" fill="rgba(255, 248, 224, 0.95)" />
        </g>

        <g
          className="folio-breath-thread"
          stroke="rgba(167, 60, 44, 0.32)"
          strokeWidth="0.4"
          strokeDasharray="0.6 1.4"
          strokeLinecap="round"
          fill="none"
        >
          <path d="M 70 7 Q 100 10 130 7" />
          <path d="M 190 7 Q 220 4 250 7" />
        </g>

        <g className="folio-breath-curve">
          <path
            d="M 110 38 Q 130 30 150 36 Q 170 42 190 32 Q 210 22 230 36"
            stroke="rgba(167, 60, 44, 0.42)"
            strokeWidth="0.55"
            strokeLinecap="round"
            fill="none"
            className="folio-breath-curve-line"
          />
          <circle cx="110" cy="38" r="0.55" fill="rgba(167, 60, 44, 0.6)" />
          <circle cx="170" cy="42" r="0.7" fill="rgba(245, 198, 91, 0.74)" />
          <circle cx="170" cy="42" r="1.6" fill="rgba(245, 198, 91, 0.18)" className="folio-breath-curve-glow" />
          <circle cx="230" cy="36" r="0.55" fill="rgba(167, 60, 44, 0.6)" />
        </g>

        <text x="160" y="40" textAnchor="middle" className="folio-breath-cap">
          manu m · iii · primum halitum
        </text>
      </svg>
    </figure>
  )
}

function PressStamp({ visible, cycle, reduced }: { visible: boolean; cycle: number; reduced: boolean }) {
  const impression =
    cycle === 0 ? 'prima impressio' : cycle === 1 ? 'secunda impressio' : 'tertia impressio'
  return (
    <figure
      className={`press-stamp${visible ? ' is-visible' : ''}${reduced ? ' is-static' : ''}`}
      aria-hidden="true"
    >
      <svg className="press-stamp-disc" viewBox="0 0 96 96" focusable="false">
        <defs>
          <radialGradient id="ps-rim" cx="50%" cy="36%" r="68%">
            <stop offset="0%" stopColor="rgba(168, 52, 32, 0.96)" />
            <stop offset="60%" stopColor="rgba(118, 28, 18, 0.96)" />
            <stop offset="100%" stopColor="rgba(58, 12, 6, 0.96)" />
          </radialGradient>
          <radialGradient id="ps-face" cx="44%" cy="34%" r="74%">
            <stop offset="0%" stopColor="rgba(206, 70, 44, 0.94)" />
            <stop offset="55%" stopColor="rgba(140, 34, 22, 0.96)" />
            <stop offset="100%" stopColor="rgba(72, 14, 8, 0.98)" />
          </radialGradient>
          <linearGradient id="ps-sheen" x1="0.4" y1="0" x2="0.6" y2="1">
            <stop offset="0%" stopColor="rgba(255, 220, 180, 0.36)" />
            <stop offset="100%" stopColor="rgba(255, 220, 180, 0)" />
          </linearGradient>
          <path id="ps-arc-top" d="M 48 48 m -34 0 a 34 34 0 0 1 68 0" fill="none" />
          <path id="ps-arc-bot" d="M 48 48 m -34 0 a 34 34 0 1 0 68 0" fill="none" />
          <pattern id="ps-grain" width="3" height="3" patternUnits="userSpaceOnUse">
            <circle cx="0.6" cy="0.4" r="0.4" fill="rgba(255, 220, 180, 0.05)" />
            <circle cx="2.2" cy="1.6" r="0.3" fill="rgba(255, 220, 180, 0.04)" />
          </pattern>
        </defs>

        <circle cx="48" cy="48" r="44" fill="url(#ps-rim)" />
        <circle cx="48" cy="48" r="44" fill="url(#ps-grain)" opacity="0.85" />
        <circle cx="48" cy="48" r="38" fill="url(#ps-face)" />
        <ellipse cx="44" cy="28" rx="26" ry="10" fill="url(#ps-sheen)" />

        <circle cx="48" cy="48" r="38" fill="none" stroke="rgba(255, 232, 178, 0.4)" strokeWidth="0.5" />
        <circle
          cx="48"
          cy="48"
          r="34"
          fill="none"
          stroke="rgba(255, 232, 178, 0.22)"
          strokeWidth="0.3"
          strokeDasharray="0.4 1.4"
        />

        <text className="ps-arc ps-arc--top">
          <textPath href="#ps-arc-top" startOffset="50%" textAnchor="middle">
            manu m · iii · impressum
          </textPath>
        </text>
        <text className="ps-arc ps-arc--bot">
          <textPath href="#ps-arc-bot" startOffset="50%" textAnchor="middle">
            perlege · ad lucem ·
          </textPath>
        </text>

        <line x1="36" y1="36" x2="60" y2="36" stroke="rgba(255, 232, 178, 0.32)" strokeWidth="0.4" />
        <text x="48" y="56" textAnchor="middle" className="ps-letter">
          m
        </text>
        <text x="56" y="56" textAnchor="middle" className="ps-letter ps-letter--roman">
          ·iii
        </text>
        <line x1="36" y1="62" x2="60" y2="62" stroke="rgba(255, 232, 178, 0.32)" strokeWidth="0.4" />
        <text x="48" y="70" textAnchor="middle" className="ps-impression">
          {impression}
        </text>

        <g className="ps-flecks" fill="rgba(40, 8, 4, 0.55)">
          <circle cx="14" cy="14" r="0.4" />
          <circle cx="84" cy="18" r="0.35" />
          <circle cx="80" cy="78" r="0.4" />
          <circle cx="18" cy="82" r="0.4" />
        </g>
      </svg>
      <figcaption className="press-stamp-cap">
        <em className="press-stamp-cap-key">the reader's mark</em>
        <span className="press-stamp-cap-sep" aria-hidden="true">·</span>
        <em className="press-stamp-cap-tail">pressed in this folio</em>
      </figcaption>
    </figure>
  )
}

function BreathPip({ slow, active, reduced }: { slow: boolean; active: boolean; reduced: boolean }) {
  const cycle = slow ? 5.4 : 3.4
  return (
    <span
      className={`breath-pip${active ? ' is-active' : ''}${reduced ? ' is-static' : ''}`}
      style={{ '--breath-cycle': `${cycle}s` } as React.CSSProperties}
      aria-hidden="true"
    >
      <svg viewBox="0 0 18 18" focusable="false">
        <circle cx="9" cy="9" r="7.2" fill="none" stroke="currentColor" strokeWidth="0.32" strokeDasharray="0.5 1.4" opacity="0.5" />
        <circle className="breath-pip-ring" cx="9" cy="9" r="4.6" fill="none" stroke="currentColor" strokeWidth="0.4" />
        <circle className="breath-pip-core" cx="9" cy="9" r="1.6" fill="currentColor" fillOpacity="0.18" />
        <circle cx="9" cy="9" r="0.55" fill="currentColor" />
      </svg>
    </span>
  )
}

function useReducedMotion() {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(mediaQuery.matches)
    update()
    mediaQuery.addEventListener('change', update)
    return () => mediaQuery.removeEventListener('change', update)
  }, [])

  return reduced
}

function useNow() {
  const [now, setNow] = useState<Date>(() => new Date())
  useEffect(() => {
    let raf = 0
    let last = 0
    const tick = (t: number) => {
      if (t - last > 970) {
        last = t
        setNow(new Date())
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])
  return now
}

function useSheetPointer() {
  const [point, setPoint] = useState<{
    x: number
    y: number
    inside: boolean
  }>({ x: 0, y: 0, inside: false })

  useEffect(() => {
    let raf = 0
    let pending: { x: number; y: number; inside: boolean } | null = null

    const flush = () => {
      if (pending) {
        setPoint(pending)
        pending = null
      }
      raf = 0
    }

    const onMove = (e: PointerEvent) => {
      const sheet = document.querySelector('.sheet')
      if (!sheet) return
      const rect = sheet.getBoundingClientRect()
      const inside =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      const y = ((e.clientY - rect.top) / rect.height) * 2 - 1
      pending = { x, y, inside }
      if (!raf) raf = requestAnimationFrame(flush)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onMove)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return point
}

function PrinterEmblem() {
  return (
    <figure className="printer-emblem" aria-hidden="true">
      <svg className="printer-emblem-plate" viewBox="0 0 120 120" focusable="false">
        <defs>
          <radialGradient id="emblem-face" cx="50%" cy="36%" r="62%">
            <stop offset="0%" stopColor="rgba(255, 250, 232, 0.96)" />
            <stop offset="62%" stopColor="rgba(245, 220, 168, 0.86)" />
            <stop offset="100%" stopColor="rgba(214, 178, 116, 0.62)" />
          </radialGradient>
          <linearGradient id="emblem-gold" x1="0" y1="0" x2="0.1" y2="1">
            <stop offset="0%" stopColor="#f6d076" />
            <stop offset="48%" stopColor="#c8923e" />
            <stop offset="100%" stopColor="#8a5d1f" />
          </linearGradient>
          <linearGradient id="emblem-gold-soft" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f5c65b" />
            <stop offset="100%" stopColor="#a47026" />
          </linearGradient>
          <radialGradient id="emblem-halo" cx="50%" cy="50%" r="55%">
            <stop offset="0%" stopColor="rgba(255, 220, 150, 0.32)" />
            <stop offset="100%" stopColor="rgba(255, 220, 150, 0)" />
          </radialGradient>
          <path id="emblem-arc-top" d="M 60 60 m -40 0 a 40 40 0 0 1 80 0" fill="none" />
          <path id="emblem-arc-bot" d="M 60 60 m -40 0 a 40 40 0 1 0 80 0" fill="none" />
        </defs>

        <circle cx="60" cy="60" r="58" fill="url(#emblem-halo)" />

        <circle
          cx="60"
          cy="60"
          r="56"
          fill="url(#emblem-face)"
          stroke="url(#emblem-gold)"
          strokeWidth="1.2"
        />
        <circle
          cx="60"
          cy="60"
          r="51.5"
          fill="none"
          stroke="url(#emblem-gold)"
          strokeWidth="0.4"
          strokeDasharray="0.5 1.6"
          opacity="0.78"
        />
        <circle
          cx="60"
          cy="60"
          r="49.5"
          fill="none"
          stroke="rgba(107, 74, 37, 0.16)"
          strokeWidth="0.3"
        />

        <g className="emblem-vine emblem-vine--left" stroke="url(#emblem-gold-soft)" strokeWidth="0.65" fill="none" strokeLinecap="round">
          <path d="M 26 38 Q 18 50 22 66 Q 28 80 40 86" />
          <path d="M 22 50 Q 14 48 12 54 Q 16 58 20 56 Q 22 54 22 50 Z" fill="rgba(217, 101, 74, 0.42)" stroke="none" />
          <path d="M 26 64 Q 18 64 16 70 Q 20 74 24 72 Q 26 68 26 64 Z" fill="rgba(217, 101, 74, 0.42)" stroke="none" />
          <circle cx="14" cy="50" r="0.9" fill="#cf3b29" />
          <circle cx="18" cy="68" r="0.8" fill="#cf3b29" />
        </g>
        <g className="emblem-vine emblem-vine--right" stroke="url(#emblem-gold-soft)" strokeWidth="0.65" fill="none" strokeLinecap="round">
          <path d="M 94 38 Q 102 50 98 66 Q 92 80 80 86" />
          <path d="M 98 50 Q 106 48 108 54 Q 104 58 100 56 Q 98 54 98 50 Z" fill="rgba(217, 101, 74, 0.42)" stroke="none" />
          <path d="M 94 64 Q 102 64 104 70 Q 100 74 96 72 Q 94 68 94 64 Z" fill="rgba(217, 101, 74, 0.42)" stroke="none" />
          <circle cx="106" cy="50" r="0.9" fill="#cf3b29" />
          <circle cx="102" cy="68" r="0.8" fill="#cf3b29" />
        </g>

        <g className="emblem-pips" fill="url(#emblem-gold-soft)">
          <circle cx="60" cy="6" r="0.9" />
          <circle cx="60" cy="114" r="0.9" />
          <circle cx="6" cy="60" r="0.9" />
          <circle cx="114" cy="60" r="0.9" />
        </g>

        <g className="emblem-mono">
          <line x1="38" y1="50" x2="82" y2="50" stroke="url(#emblem-gold)" strokeWidth="0.55" strokeLinecap="round" opacity="0.78" />
          <text x="58" y="74" textAnchor="middle" className="emblem-letter">m</text>
          <text x="72" y="74" textAnchor="middle" className="emblem-letter-roman">·iii</text>
          <line x1="38" y1="80" x2="82" y2="80" stroke="url(#emblem-gold)" strokeWidth="0.55" strokeLinecap="round" opacity="0.78" />
        </g>

        <g className="emblem-corner emblem-corner--tl" fill="#cf3b29" fillOpacity="0.6">
          <path d="M 12 12 L 22 12 Q 22 16 18 17 L 18 22 L 12 22 Z" />
          <circle cx="15" cy="15" r="0.7" />
        </g>
        <g className="emblem-corner emblem-corner--br" fill="#a73c2c" fillOpacity="0.55">
          <path d="M 108 108 L 98 108 Q 98 104 102 103 L 102 98 L 108 98 Z" />
          <circle cx="105" cy="105" r="0.7" />
        </g>

        <text className="emblem-motto emblem-motto--top">
          <textPath href="#emblem-arc-top" startOffset="50%" textAnchor="middle">
            manu m · iii · mmxxvi
          </textPath>
        </text>
        <text className="emblem-motto emblem-motto--bot">
          <textPath href="#emblem-arc-bot" startOffset="50%" textAnchor="middle">
            ad lucem · perlege ·
          </textPath>
        </text>

        <g className="emblem-stamen" stroke="rgba(140, 82, 28, 0.42)" strokeWidth="0.35" fill="none" strokeLinecap="round">
          <path d="M 58 38 Q 56 56 60 70" />
          <path d="M 62 38 Q 64 56 60 70" />
        </g>
      </svg>
      <figcaption className="printer-emblem-cap">
        <span className="printer-emblem-cap-rule printer-emblem-cap-rule--left" />
        <span className="printer-emblem-cap-text">
          <em className="printer-emblem-cap-key">the printer's mark</em>
          <span className="printer-emblem-cap-sep" aria-hidden="true">·</span>
          <em className="printer-emblem-cap-tail">a press that bears a name</em>
        </span>
        <span className="printer-emblem-cap-rule printer-emblem-cap-rule--right" />
      </figcaption>
    </figure>
  )
}

function AlmanacBand({
  now,
  cycle,
  moonPhase,
}: {
  now: Date
  cycle: number
  moonPhase: number
}) {
  const dayName = WEEKDAYS[now.getDay()].slice(0, 3).toLowerCase()
  const dayOrdinal = ORDINALS[Math.min(ORDINALS.length - 1, now.getDate() - 1)]
  const monthName = MONTHS[now.getMonth()].slice(0, 3).toLowerCase()
  const yearRoman = toRomanYear(now.getFullYear())
  const hour24 = now.getHours()
  const minutes = now.getMinutes()
  const h12 = ((hour24 + 11) % 12) + 1
  const mm = String(minutes).padStart(2, '0')
  const period = hour24 >= 12 ? 'p.m.' : 'a.m.'
  const moonName = moonPhaseName(moonPhase)
  const sigils = ['¶', '†', '‡', '§']
  const tallyLit = Math.min(cycle + 1, sigils.length)
  const pressLabel =
    cycle === 0 ? 'awaiting the press' : `${ROMAN[Math.min(cycle - 1, ROMAN.length - 1)]} press`

  return (
    <p
      className={`almanac-band${cycle > 0 ? ' is-reread' : ''}`}
      aria-hidden="true"
    >
      <span className="almanac-band-rule almanac-band-rule--left" />
      <span className="almanac-band-cluster">
        <span className="almanac-band-cell almanac-band-cell--day">
          <em className="almanac-band-key">today</em>
          <span className="almanac-band-day">
            <em>{dayName}</em>
            <span className="almanac-band-day-tail">
              {' · the '}
              <em>{dayOrdinal}</em>
              {' of '}
              <em>{monthName}</em>
            </span>
            <span className="almanac-band-day-year">{' · '}{yearRoman}</span>
          </span>
        </span>

        <span className="almanac-band-divider" aria-hidden="true" />

        <span className="almanac-band-cell almanac-band-cell--hour">
          <em className="almanac-band-key">hour</em>
          <span className="almanac-band-hour">
            <em>{h12}</em>
            <span className="almanac-band-hour-m">:{mm}</span>
            <em className="almanac-band-hour-period">{period}</em>
          </span>
        </span>

        <span className="almanac-band-divider" aria-hidden="true" />

        <span className="almanac-band-cell almanac-band-cell--moon">
          <em className="almanac-band-key">moon</em>
          <span className="almanac-band-moon">
            <em>{moonName}</em>
            <span className="almanac-band-moon-tail">{Math.round((1 - Math.cos(moonPhase * 2 * Math.PI)) * 50)}%</span>
          </span>
        </span>

        <span className="almanac-band-divider" aria-hidden="true" />

        <span className="almanac-band-cell almanac-band-cell--press">
          <em className="almanac-band-key">readings</em>
          <span className="almanac-band-tally">
            {sigils.map((s, i) => (
              <span
                key={i}
                className={`almanac-band-sigil${i < tallyLit ? ' is-lit' : ''}${cycle > 0 && i === tallyLit - 1 ? ' is-latest' : ''}`}
                style={{ '--mark-i': i } as React.CSSProperties}
              >
                {s}
              </span>
            ))}
          </span>
          <span className="almanac-band-press">{pressLabel}</span>
        </span>
      </span>
      <span className="almanac-band-rule almanac-band-rule--right" />
    </p>
  )
}

function PrintedInitial({ letter }: { letter: string }) {
  return (
    <span className="printed-initial" aria-hidden="true">
      <svg viewBox="0 0 60 60" focusable="false">
        <defs>
          <pattern id="initial-hatch" width="3" height="3" patternUnits="userSpaceOnUse" patternTransform="rotate(38)">
            <line x1="0" y1="0" x2="0" y2="3" stroke="currentColor" strokeWidth="0.6" />
          </pattern>
        </defs>
        <rect
          x="2"
          y="2"
          width="56"
          height="56"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          rx="2"
        />
        <rect
          x="5"
          y="5"
          width="50"
          height="50"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.5"
          strokeDasharray="1.2 1.6"
          opacity="0.7"
        />
        <text x="30" y="44" textAnchor="middle" className="printed-initial-letter">
          {letter}
        </text>
        <line x1="6" y1="55" x2="54" y2="55" stroke="currentColor" strokeWidth="0.4" opacity="0.45" />
        <line x1="6" y1="5" x2="54" y2="5" stroke="currentColor" strokeWidth="0.4" opacity="0.45" />
      </svg>
    </span>
  )
}

function VersoDropCap({ letter }: { letter: string }) {
  const upper = letter.toLowerCase()
  return (
    <span className="verso-drop-cap" aria-hidden="true">
      <svg viewBox="0 0 86 96" focusable="false">
        <defs>
          <linearGradient id="vd-gold" x1="0" y1="0" x2="0.05" y2="1">
            <stop offset="0%" stopColor="#f6d076" />
            <stop offset="48%" stopColor="#c8923e" />
            <stop offset="100%" stopColor="#8a5d1f" />
          </linearGradient>
          <linearGradient id="vd-gold-soft" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f5c65b" />
            <stop offset="100%" stopColor="#a47026" />
          </linearGradient>
          <radialGradient id="vd-face" cx="38%" cy="28%" r="92%">
            <stop offset="0%" stopColor="rgba(255, 236, 188, 0.62)" />
            <stop offset="60%" stopColor="rgba(232, 188, 110, 0.16)" />
            <stop offset="100%" stopColor="rgba(150, 86, 38, 0.04)" />
          </radialGradient>
          <radialGradient id="vd-halo" cx="50%" cy="50%" r="55%">
            <stop offset="0%" stopColor="rgba(255, 220, 150, 0.42)" />
            <stop offset="100%" stopColor="rgba(255, 220, 150, 0)" />
          </radialGradient>
        </defs>

        <ellipse cx="43" cy="48" rx="42" ry="50" fill="url(#vd-halo)" />

        <rect
          x="4"
          y="4"
          width="78"
          height="88"
          rx="1.5"
          fill="url(#vd-face)"
          stroke="url(#vd-gold)"
          strokeWidth="0.85"
        />
        <rect
          x="7.5"
          y="7.5"
          width="71"
          height="81"
          rx="1"
          fill="none"
          stroke="url(#vd-gold)"
          strokeWidth="0.35"
          strokeDasharray="1.4 1.8"
          opacity="0.78"
        />

        <g className="vd-vine vd-vine--tr" stroke="url(#vd-gold-soft)" strokeWidth="0.7" fill="none" strokeLinecap="round">
          <path d="M 76 14 Q 64 18 58 28 Q 54 38 60 46 Q 66 52 62 60" />
          <path d="M 58 28 Q 52 22 46 24 Q 44 28 48 32 Q 56 34 58 28 Z" fill="rgba(217, 101, 74, 0.28)" stroke="none" />
          <circle cx="50" cy="20" r="1.2" fill="#cf3b29" />
        </g>
        <g className="vd-vine vd-vine--bl" stroke="url(#vd-gold-soft)" strokeWidth="0.7" fill="none" strokeLinecap="round">
          <path d="M 10 82 Q 22 78 28 68 Q 32 58 26 50 Q 20 44 24 36" />
          <path d="M 28 68 Q 34 74 40 70 Q 42 66 38 62 Q 32 60 28 68 Z" fill="rgba(217, 101, 74, 0.28)" stroke="none" />
          <circle cx="36" cy="76" r="1.2" fill="#cf3b29" />
        </g>

        <g className="vd-corner vd-corner--tl" fill="#cf3b29" fillOpacity="0.62">
          <path d="M 9 9 L 18 9 Q 18 12.5 14 13.5 L 14 18 L 9 18 Z" />
          <circle cx="11.5" cy="11.5" r="0.7" />
        </g>
        <g className="vd-corner vd-corner--br" fill="#a73c2c" fillOpacity="0.55">
          <path d="M 77 87 L 68 87 Q 68 83.5 72 82.5 L 72 78 L 77 78 Z" />
          <circle cx="74.5" cy="84.5" r="0.7" />
        </g>

        <g className="vd-pips" fill="url(#vd-gold-soft)">
          <circle cx="43" cy="9" r="0.6" />
          <circle cx="43" cy="87" r="0.6" />
          <circle cx="9" cy="48" r="0.6" />
          <circle cx="77" cy="48" r="0.6" />
        </g>

        <g className="vd-letter">
          <text
            x="43"
            y="68"
            textAnchor="middle"
            className="vd-letter-glyph"
          >
            {upper}
          </text>
          <line
            x1="28"
            y1="74"
            x2="58"
            y2="74"
            stroke="url(#vd-gold)"
            strokeWidth="0.5"
            strokeLinecap="round"
            opacity="0.78"
          />
        </g>
      </svg>
    </span>
  )
}

function ManuscriptStamp() {
  return (
    <div className="ms-stamp" aria-hidden="true">
      <span className="ms-stamp-row ms-stamp-row--top">M S · lxxvii</span>
      <span className="ms-stamp-rule" />
      <span className="ms-stamp-row ms-stamp-row--mid">FRONTEND</span>
      <span className="ms-stamp-rule ms-stamp-rule--short" />
      <span className="ms-stamp-row ms-stamp-row--bot">cap. xviii · vers.</span>
    </div>
  )
}

function Headpiece() {
  return (
    <svg
      className="headpiece"
      viewBox="0 0 320 48"
      focusable="false"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="headpiece-sun" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#f5c65b" />
          <stop offset="62%" stopColor="#c8923e" />
          <stop offset="100%" stopColor="#9c6e26" />
        </radialGradient>
      </defs>

      <g className="headpiece-rules" stroke="currentColor" strokeLinecap="round" fill="none">
        <line x1="0" y1="24" x2="92" y2="24" strokeWidth="0.55" />
        <line x1="0" y1="28" x2="74" y2="28" strokeWidth="0.3" strokeDasharray="0.4 1.4" opacity="0.6" />
        <path d="M 92 24 C 100 18, 108 30, 116 24" strokeWidth="0.55" />
        <path d="M 204 24 C 212 18, 220 30, 228 24" strokeWidth="0.55" />
        <line x1="228" y1="24" x2="320" y2="24" strokeWidth="0.55" />
        <line x1="246" y1="28" x2="320" y2="28" strokeWidth="0.3" strokeDasharray="0.4 1.4" opacity="0.6" />
      </g>

      <g className="headpiece-cluster">
        <circle cx="124" cy="24" r="1" />
        <path d="M 138 24 L 144 18 L 150 24 L 144 30 Z" />

        <g className="headpiece-sun-group" transform="translate(160 24)">
          <g className="headpiece-sun-rays" stroke="url(#headpiece-sun)" strokeWidth="0.7" strokeLinecap="round">
            <line x1="0" y1="-9" x2="0" y2="-12" />
            <line x1="0" y1="9" x2="0" y2="12" />
            <line x1="-9" y1="0" x2="-12" y2="0" />
            <line x1="9" y1="0" x2="12" y2="0" />
            <line x1="-6.4" y1="-6.4" x2="-8.5" y2="-8.5" />
            <line x1="6.4" y1="-6.4" x2="8.5" y2="-8.5" />
            <line x1="-6.4" y1="6.4" x2="-8.5" y2="8.5" />
            <line x1="6.4" y1="6.4" x2="8.5" y2="8.5" />
          </g>
          <circle r="5.5" fill="url(#headpiece-sun)" stroke="rgba(107, 74, 37, 0.42)" strokeWidth="0.4" />
          <circle r="2.2" fill="none" stroke="rgba(107, 74, 37, 0.42)" strokeWidth="0.3" strokeDasharray="0.4 1.2" />
          <circle r="1.4" fill="rgba(255, 246, 218, 0.92)" />
        </g>

        <g className="headpiece-leaf headpiece-leaf--left" transform="translate(124 38)">
          <path d="M -5 0 Q 0 -3 6 -1 Q 4 3 -5 0 Z" fill="currentColor" opacity="0.7" />
          <line x1="-4" y1="0" x2="3" y2="-1" stroke="var(--paper)" strokeWidth="0.3" />
        </g>
        <g className="headpiece-leaf headpiece-leaf--right" transform="translate(196 38)">
          <path d="M 5 0 Q 0 -3 -6 -1 Q -4 3 5 0 Z" fill="currentColor" opacity="0.7" />
          <line x1="4" y1="0" x2="-3" y2="-1" stroke="var(--paper)" strokeWidth="0.3" />
        </g>

        <circle cx="178" cy="24" r="0.9" />
        <circle cx="190" cy="24" r="0.7" />
      </g>
    </svg>
  )
}

function ChapterHead({
  now,
  witness = true,
}: {
  now: Date
  witness?: boolean
}) {
  const dayName = WEEKDAYS[now.getDay()]
  const dayOrdinal = ORDINALS[Math.min(ORDINALS.length - 1, now.getDate() - 1)]
  const monthName = MONTHS[now.getMonth()]
  const hour24 = now.getHours()
  const minutes = now.getMinutes()
  const period = hour24 >= 12 ? 'p.m.' : 'a.m.'
  const h12 = ((hour24 + 11) % 12) + 1
  const mm = String(minutes).padStart(2, '0')

  return (
    <div className="chapter-head" aria-hidden="true">
      <span className="chapter-mark">
        <span className="chapter-prefix">Caput</span>
        <span className="chapter-numeral">XVIII</span>
        <svg className="chapter-mark-orb" viewBox="0 0 12 12" focusable="false">
          <circle cx="6" cy="6" r="3.2" fill="none" stroke="currentColor" strokeWidth="0.5" />
          <circle cx="6" cy="6" r="1" fill="currentColor" />
        </svg>
      </span>
      <Headpiece />
      {witness && (
        <span className="chapter-witness">
          <span className="chapter-witness-rule chapter-witness-rule--left" aria-hidden="true" />
          <span className="chapter-witness-text">
            <em className="chapter-witness-key">opened</em>
            <span className="chapter-witness-sep" aria-hidden="true">·</span>
            <em className="chapter-witness-day">{dayName.slice(0, 3)}</em>
            <span className="chapter-witness-tail">
              ,&nbsp;the <em>{dayOrdinal}</em> of <em>{monthName}</em>
            </span>
            <span className="chapter-witness-sep" aria-hidden="true">·</span>
            <em className="chapter-witness-hour">{h12}</em>
            <span className="chapter-witness-min">:{mm}</span>
            <em className="chapter-witness-period">{period}</em>
          </span>
          <span className="chapter-witness-rule chapter-witness-rule--right" aria-hidden="true" />
        </span>
      )}
    </div>
  )
}

/* ──────────────────────────────────────────────────────────────────────
   iteration 148 · a chapter signature sits beneath the chapter head.

   A single italic line names the press, the timepiece, and a quiet
   "set for the reader". It replaces the looseness of the chapter
   witness — the day and hour are still shown, but as a single
   italic inscription beside the press name, not as a separate row.
   ────────────────────────────────────────────────────────────────────── */

function ChapterSignature({ now }: { now: Date }) {
  const yearRoman = toRomanYear(now.getFullYear())
  return (
    <p className="chapter-signature" aria-hidden="true">
      <span className="chapter-signature-rule chapter-signature-rule--left" />
      <span className="chapter-signature-cluster">
        <em className="chapter-signature-key">manu m · iii</em>
        <span className="chapter-signature-sep" aria-hidden="true">·</span>
        <em className="chapter-signature-tail">caput xviii · mmxxvi</em>
        <span className="chapter-signature-sep" aria-hidden="true">·</span>
        <em className="chapter-signature-mark">set for the reader</em>
      </span>
      <span className="chapter-signature-year">{yearRoman}</span>
      <span className="chapter-signature-rule chapter-signature-rule--right" />
    </p>
  )
}

/* ──────────────────────────────────────────────────────────────────────
   iteration 152 · the recto earns a composed title-tail

   A single horizontal inscription sits between the recto's ReadingTide
   and the AlmanacBand. It is the title-block's quiet closure: a thin
   gold rule that fades in from either side, a centered coral-and-gold
   fleuron, and a small italic line that names the press in its own
   hand — manu m · iii · ad lucem. The tail sits centered, never
   competing with the title above or the almanac below, and earns its
   space as the moment the title's setting becomes the press's action.
   ────────────────────────────────────────────────────────────────────── */

function ReadingTideTail({ visible, reduced }: { visible: boolean; reduced: boolean }) {
  return (
    <figure
      className={`recto-tide-tail${visible ? ' is-visible' : ''}${
        reduced ? ' is-static' : ''
      }`}
      aria-hidden="true"
    >
      <svg
        className="recto-tide-tail-svg"
        viewBox="0 0 320 16"
        focusable="false"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="rtt-rule" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(167, 60, 44, 0)" />
            <stop offset="14%" stopColor="rgba(167, 60, 44, 0.45)" />
            <stop offset="46%" stopColor="rgba(200, 146, 62, 0.65)" />
            <stop offset="54%" stopColor="rgba(200, 146, 62, 0.65)" />
            <stop offset="86%" stopColor="rgba(167, 60, 44, 0.45)" />
            <stop offset="100%" stopColor="rgba(167, 60, 44, 0)" />
          </linearGradient>
          <linearGradient id="rtt-rule-ghost" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(167, 60, 44, 0)" />
            <stop offset="14%" stopColor="rgba(167, 60, 44, 0.18)" />
            <stop offset="50%" stopColor="rgba(167, 60, 44, 0.22)" />
            <stop offset="86%" stopColor="rgba(167, 60, 44, 0.18)" />
            <stop offset="100%" stopColor="rgba(167, 60, 44, 0)" />
          </linearGradient>
          <radialGradient id="rtt-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(245, 198, 91, 0.45)" />
            <stop offset="62%" stopColor="rgba(245, 198, 91, 0.12)" />
            <stop offset="100%" stopColor="rgba(245, 198, 91, 0)" />
          </radialGradient>
        </defs>
        <line
          x1="6"
          y1="8"
          x2="314"
          y2="8"
          stroke="url(#rtt-rule-ghost)"
          strokeWidth="0.22"
          strokeDasharray="0.6 1.6"
          strokeLinecap="round"
        />
        <line
          x1="6"
          y1="8"
          x2="314"
          y2="8"
          stroke="url(#rtt-rule)"
          strokeWidth="0.55"
          strokeLinecap="round"
          className="recto-tide-tail-line"
        />
        <g className="recto-tide-tail-bloom" transform="translate(160 8)">
          <circle r="6" fill="url(#rtt-glow)" />
          <circle r="2.6" fill="rgba(245, 198, 91, 0.42)" />
          <circle r="1.2" fill="rgba(167, 60, 44, 0.85)" />
          <circle r="0.42" fill="rgba(255, 248, 224, 0.95)" />
        </g>
        <g className="recto-tide-tail-pip-l" transform="translate(56 8)">
          <circle r="0.5" fill="rgba(167, 60, 44, 0.6)" />
        </g>
        <g className="recto-tide-tail-pip-r" transform="translate(264 8)">
          <circle r="0.5" fill="rgba(167, 60, 44, 0.6)" />
        </g>
      </svg>
      <figcaption className="recto-tide-tail-cap">
        <span className="recto-tide-tail-cap-rule recto-tide-tail-cap-rule--left" aria-hidden="true" />
        <span className="recto-tide-tail-cap-cluster">
          <em className="recto-tide-tail-cap-key">manu m · iii</em>
          <span className="recto-tide-tail-cap-sep" aria-hidden="true">·</span>
          <em className="recto-tide-tail-cap-tail">ad lucem</em>
          <span className="recto-tide-tail-cap-mark" aria-hidden="true">¶</span>
        </span>
        <span className="recto-tide-tail-cap-rule recto-tide-tail-cap-rule--right" aria-hidden="true" />
      </figcaption>
    </figure>
  )
}

const CUL_RAYS = Array.from({ length: 16 }, (_, i) => {
  const theta = (i * 22.5 * Math.PI) / 180
  const isLong = i % 2 === 0
  const r2 = isLong ? 34 : 24
  return {
    x1: 100 + 21 * Math.cos(theta),
    y1: 44 + 21 * Math.sin(theta),
    x2: 100 + r2 * Math.cos(theta),
    y2: 44 + r2 * Math.sin(theta),
    key: i,
  }
})

const CUL_HATCH = Array.from({ length: 26 }, (_, i) => {
  const x = i * 8 + 1
  return { x1: x, y1: 78, x2: x + 4, y2: 108, key: i }
})

function CulDeLampe({
  inscriptionVisible,
}: {
  inscriptionVisible: boolean
}) {
  return (
    <div className="cul-de-lampe" aria-hidden="true">
      <svg
        className="cul-de-lampe-plate"
        viewBox="0 0 200 110"
        focusable="false"
      >
        <defs>
          <clipPath id="cul-hill-clip">
            <rect x="0" y="76" width="200" height="34" />
          </clipPath>
          <radialGradient id="cul-sun-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(245, 198, 91, 0.55)" />
            <stop offset="55%" stopColor="rgba(245, 198, 91, 0.18)" />
            <stop offset="100%" stopColor="rgba(245, 198, 91, 0)" />
          </radialGradient>
        </defs>

        <g className="cul-sky" opacity="0.24">
          <line x1="0" y1="20" x2="200" y2="20" stroke="currentColor" strokeWidth="0.3" />
          <line x1="0" y1="32" x2="200" y2="32" stroke="currentColor" strokeWidth="0.3" />
          <circle cx="38" cy="12" r="0.55" fill="currentColor" />
          <circle cx="174" cy="16" r="0.55" fill="currentColor" />
          <circle cx="118" cy="9" r="0.4" fill="currentColor" />
          <circle cx="64" cy="8" r="0.4" fill="currentColor" />
          <circle cx="156" cy="26" r="0.35" fill="currentColor" />
        </g>

        <circle
          className="cul-glow"
          cx="100"
          cy="44"
          r="34"
          fill="url(#cul-sun-glow)"
        />

        <g
          className="cul-rays"
          stroke="currentColor"
          strokeWidth="0.5"
          strokeLinecap="round"
          fill="none"
        >
          {CUL_RAYS.map((r) => (
            <line key={r.key} x1={r.x1} y1={r.y1} x2={r.x2} y2={r.y2} />
          ))}
        </g>

        <g className="cul-disc">
          <circle
            cx="100"
            cy="44"
            r="14"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.65"
          />
          <circle
            cx="100"
            cy="44"
            r="9"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.4"
            strokeDasharray="0.5 1.6"
            opacity="0.85"
          />
          <circle cx="100" cy="44" r="3.2" fill="currentColor" />
          <line
            x1="100"
            y1="34"
            x2="100"
            y2="54"
            stroke="currentColor"
            strokeWidth="0.3"
            opacity="0.55"
          />
          <line
            x1="92"
            y1="38"
            x2="108"
            y2="50"
            stroke="currentColor"
            strokeWidth="0.3"
            opacity="0.55"
          />
          <line
            x1="92"
            y1="50"
            x2="108"
            y2="38"
            stroke="currentColor"
            strokeWidth="0.3"
            opacity="0.55"
          />
        </g>

        <path
          className="cul-bird cul-bird--left"
          d="M 50 24 q 4 -3 8 0 q 4 -2 8 0"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.65"
          strokeLinecap="round"
        />
        <path
          className="cul-bird cul-bird--right"
          d="M 148 30 q 3 -2.5 6 0 q 3 -2 6 0"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.65"
          strokeLinecap="round"
        />

        <line
          x1="0"
          y1="76"
          x2="200"
          y2="76"
          stroke="currentColor"
          strokeWidth="0.5"
        />

        <rect
          x="0"
          y="76"
          width="200"
          height="34"
          fill="rgba(107, 74, 37, 0.06)"
        />

        <g clipPath="url(#cul-hill-clip)" opacity="0.5">
          {CUL_HATCH.map((h) => (
            <line
              key={h.key}
              x1={h.x1}
              y1={h.y1}
              x2={h.x2}
              y2={h.y2}
              stroke="currentColor"
              strokeWidth="0.3"
            />
          ))}
        </g>

        <path
          d="M 0 80 Q 26 74 52 78 T 100 76 T 148 80 T 200 78"
          stroke="currentColor"
          strokeWidth="0.7"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M 0 88 Q 26 82 52 86 T 100 84 T 148 88 T 200 86"
          stroke="currentColor"
          strokeWidth="0.45"
          fill="none"
          strokeLinecap="round"
          opacity="0.6"
        />

        <line
          x1="0"
          y1="106"
          x2="200"
          y2="106"
          stroke="currentColor"
          strokeWidth="0.55"
        />
      </svg>

      <p
        className={`cul-inscription${
          inscriptionVisible ? ' is-visible' : ''
        }`}
      >
        <span className="cul-inscription-rule" aria-hidden="true" />
        <em>explicit</em>
        <span className="cul-inscription-mark" aria-hidden="true">·</span>
        <em>caput xviii</em>
        <span className="cul-inscription-rule" aria-hidden="true" />
      </p>
    </div>
  )
}

/* ──────────────────────────────────────────────────────────────────────
   iteration 158 · the folio's own closing colophon

   A single composed silverpoint impression beneath the sheet-foot:
   a thin gold rule, a centered press monogram, and one italic line
   that names the press, the chapter and the year in their own hand.
   It mirrors the FolioPressPlate at the head, but at a slightly
   smaller scale — the press's closing signature, set after the
   reader has reached the bottom of the leaf.
   ────────────────────────────────────────────────────────────────────── */

function FolioPressColophon({
  now,
  reduced,
}: {
  now: Date
  reduced: boolean
}) {
  const yearRoman = toRomanYear(now.getFullYear())
  return (
    <figure
      className={`folio-press-colophon${reduced ? ' is-static' : ''}`}
      aria-hidden="true"
    >
      <svg
        className="folio-press-colophon-rule"
        viewBox="0 0 320 18"
        focusable="false"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="fpc-rule" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(167, 60, 44, 0)" />
            <stop offset="12%" stopColor="rgba(167, 60, 44, 0.55)" />
            <stop offset="50%" stopColor="rgba(200, 146, 62, 0.74)" />
            <stop offset="88%" stopColor="rgba(167, 60, 44, 0.55)" />
            <stop offset="100%" stopColor="rgba(167, 60, 44, 0)" />
          </linearGradient>
          <linearGradient id="fpc-rule-ghost" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(167, 60, 44, 0)" />
            <stop offset="50%" stopColor="rgba(167, 60, 44, 0.32)" />
            <stop offset="100%" stopColor="rgba(167, 60, 44, 0)" />
          </linearGradient>
          <linearGradient id="fpc-gold" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f6d076" />
            <stop offset="50%" stopColor="#c8923e" />
            <stop offset="100%" stopColor="#9c6e26" />
          </linearGradient>
        </defs>
        <line
          x1="6"
          y1="14"
          x2="314"
          y2="14"
          stroke="url(#fpc-rule-ghost)"
          strokeWidth="0.4"
          strokeDasharray="0.6 1.6"
          strokeLinecap="round"
        />
        <line
          x1="6"
          y1="11"
          x2="314"
          y2="11"
          stroke="url(#fpc-rule)"
          strokeWidth="0.6"
          strokeLinecap="round"
        />
        <g className="folio-press-colophon-mid" transform="translate(160 9)">
          <line x1="-78" y1="0" x2="-22" y2="0" stroke="url(#fpc-rule)" strokeWidth="0.4" strokeLinecap="round" opacity="0.78" />
          <line x1="22" y1="0" x2="78" y2="0" stroke="url(#fpc-rule)" strokeWidth="0.4" strokeLinecap="round" opacity="0.78" />

          <circle r="11" fill="rgba(255, 246, 218, 0.78)" stroke="url(#fpc-gold)" strokeWidth="0.55" />
          <circle r="9" fill="none" stroke="url(#fpc-gold)" strokeWidth="0.22" strokeDasharray="0.4 1.2" opacity="0.78" />
          <circle r="3.4" fill="none" stroke="rgba(107, 74, 37, 0.36)" strokeWidth="0.28" />
          <line x1="-7" y1="0" x2="-3.6" y2="0" stroke="rgba(107, 74, 37, 0.6)" strokeWidth="0.4" strokeLinecap="round" />
          <line x1="3.6" y1="0" x2="7" y2="0" stroke="rgba(107, 74, 37, 0.6)" strokeWidth="0.4" strokeLinecap="round" />
          <line x1="0" y1="-7" x2="0" y2="-3.6" stroke="rgba(107, 74, 37, 0.6)" strokeWidth="0.4" strokeLinecap="round" />
          <line x1="0" y1="3.6" x2="0" y2="7" stroke="rgba(107, 74, 37, 0.6)" strokeWidth="0.4" strokeLinecap="round" />
          <line x1="-5" y1="-5" x2="-3" y2="-3" stroke="rgba(107, 74, 37, 0.5)" strokeWidth="0.32" strokeLinecap="round" />
          <line x1="5" y1="5" x2="3" y2="3" stroke="rgba(107, 74, 37, 0.5)" strokeWidth="0.32" strokeLinecap="round" />
          <circle cx="0" cy="0" r="0.7" fill="rgba(167, 60, 44, 0.86)" />
        </g>
        <g className="folio-press-colophon-pips" fill="rgba(167, 60, 44, 0.5)">
          <circle cx="56" cy="9" r="0.5" />
          <circle cx="264" cy="9" r="0.5" />
        </g>
      </svg>
      <p className="folio-press-colophon-line">
        <em className="folio-press-colophon-key">explicit caput xviii</em>
        <span className="folio-press-colophon-sep" aria-hidden="true">·</span>
        <em className="folio-press-colophon-mid-text">manu m · iii · ad lucem</em>
        <span className="folio-press-colophon-sep" aria-hidden="true">·</span>
        <em className="folio-press-colophon-tail">{yearRoman}</em>
        <span className="folio-press-colophon-mark" aria-hidden="true">¶</span>
      </p>
    </figure>
  )
}

function IlluminatedInitial({ letter }: { letter: string }) {
  const upper = letter.toUpperCase()
  return (
    <span className="illuminated-initial" aria-hidden="true">
      <svg viewBox="0 0 86 108" focusable="false">
        <defs>
          <linearGradient id="illum-gold" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f5c65b" />
            <stop offset="50%" stopColor="#c8923e" />
            <stop offset="100%" stopColor="#9c6e26" />
          </linearGradient>
          <linearGradient id="illum-face" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="rgba(245, 220, 168, 0.5)" />
            <stop offset="100%" stopColor="rgba(217, 154, 84, 0.18)" />
          </linearGradient>
        </defs>

        <rect
          x="2"
          y="2"
          width="82"
          height="104"
          fill="url(#illum-face)"
          stroke="url(#illum-gold)"
          strokeWidth="0.9"
        />
        <rect
          x="6"
          y="6"
          width="74"
          height="96"
          fill="none"
          stroke="url(#illum-gold)"
          strokeWidth="0.4"
          strokeDasharray="1.4 2"
          opacity="0.85"
        />

        <g className="illum-vine illum-vine--tr" stroke="var(--coral-deep)" strokeWidth="0.55" fill="none" strokeLinecap="round">
          <path d="M 74 10 Q 64 14 60 24 Q 56 32 64 40 Q 70 46 66 54" />
          <path d="M 60 24 Q 56 18 50 20 Q 47 24 50 28 Q 56 30 60 24 Z" fill="var(--coral)" fillOpacity="0.4" />
          <path d="M 64 40 Q 70 36 74 40 Q 70 44 64 40 Z" fill="var(--coral)" fillOpacity="0.4" />
          <circle cx="56" cy="14" r="0.9" fill="var(--coral)" />
        </g>
        <g className="illum-vine illum-vine--bl" stroke="var(--coral-deep)" strokeWidth="0.55" fill="none" strokeLinecap="round">
          <path d="M 12 96 Q 22 92 26 82 Q 30 74 22 66 Q 16 60 20 52" />
          <path d="M 26 82 Q 30 88 36 86 Q 39 82 36 78 Q 30 76 26 82 Z" fill="var(--coral)" fillOpacity="0.4" />
          <path d="M 22 66 Q 16 70 12 66 Q 16 62 22 66 Z" fill="var(--coral)" fillOpacity="0.4" />
          <circle cx="30" cy="92" r="0.9" fill="var(--coral)" />
        </g>

        <g className="illum-corner illum-corner--tl" fill="var(--coral)" fillOpacity="0.55">
          <path d="M 9 9 L 16 9 Q 16 12 13 13 L 13 16 L 9 16 Z" />
          <circle cx="11" cy="11" r="0.7" />
        </g>
        <g className="illum-corner illum-corner--br" fill="var(--coral-deep)" fillOpacity="0.55">
          <path d="M 77 99 L 70 99 Q 70 96 73 95 L 73 92 L 77 92 Z" />
          <circle cx="75" cy="97" r="0.7" />
        </g>

        <g className="illum-dots" fill="var(--coral-deep)">
          <circle cx="43" cy="9" r="0.7" />
          <circle cx="43" cy="99" r="0.7" />
          <circle cx="9" cy="54" r="0.7" />
          <circle cx="77" cy="54" r="0.7" />
        </g>

        <g className="illum-letter" aria-hidden="true">
          <text
            x="43"
            y="82"
            textAnchor="middle"
            className="illum-letter-glyph"
          >
            {upper}
          </text>
          <line
            x1="34"
            y1="86"
            x2="52"
            y2="86"
            stroke="url(#illum-gold)"
            strokeWidth="0.6"
            strokeLinecap="round"
          />
        </g>
      </svg>
    </span>
  )
}

function BroadsheetDropCap({
  letter,
  pressed,
}: {
  letter: string
  pressed: boolean
}) {
  return (
    <span
      className={`broadsheet-initial${pressed ? ' is-pressed' : ''}`}
      aria-hidden="true"
    >
      <svg viewBox="0 0 160 200" focusable="false">
        <defs>
          <linearGradient id="bs-gold" x1="0" y1="0" x2="0.1" y2="1">
            <stop offset="0%" stopColor="#f6d076" />
            <stop offset="48%" stopColor="#c8923e" />
            <stop offset="100%" stopColor="#8a5d1f" />
          </linearGradient>
          <linearGradient id="bs-gold-soft" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f5c65b" />
            <stop offset="100%" stopColor="#a47026" />
          </linearGradient>
          <radialGradient id="bs-face" cx="35%" cy="28%" r="92%">
            <stop offset="0%" stopColor="rgba(255, 236, 188, 0.7)" />
            <stop offset="60%" stopColor="rgba(232, 188, 110, 0.22)" />
            <stop offset="100%" stopColor="rgba(150, 86, 38, 0.06)" />
          </radialGradient>
          <radialGradient id="bs-halo" cx="50%" cy="50%" r="55%">
            <stop offset="0%" stopColor="rgba(255, 220, 150, 0.55)" />
            <stop offset="100%" stopColor="rgba(255, 220, 150, 0)" />
          </radialGradient>
          <pattern id="bs-hatch" width="2.6" height="2.6" patternUnits="userSpaceOnUse" patternTransform="rotate(28)">
            <line x1="0" y1="0" x2="0" y2="2.6" stroke="rgba(140, 82, 28, 0.18)" strokeWidth="0.4" />
          </pattern>
        </defs>

        <ellipse cx="80" cy="100" rx="78" ry="98" fill="url(#bs-halo)" />

        <rect
          x="6"
          y="6"
          width="148"
          height="188"
          rx="2"
          fill="url(#bs-face)"
          stroke="url(#bs-gold)"
          strokeWidth="1.1"
        />
        <rect
          x="11"
          y="11"
          width="138"
          height="178"
          rx="1"
          fill="none"
          stroke="url(#bs-gold)"
          strokeWidth="0.45"
          strokeDasharray="2 2.4"
          opacity="0.85"
        />
        <rect
          x="14"
          y="14"
          width="132"
          height="172"
          rx="1"
          fill="url(#bs-hatch)"
          opacity="0.55"
        />

        <g className="bs-vine bs-vine--tr" stroke="url(#bs-gold-soft)" strokeWidth="0.85" fill="none" strokeLinecap="round">
          <path d="M 138 18 Q 122 22 116 36 Q 110 50 120 60 Q 130 68 124 80" />
          <path d="M 116 36 Q 108 26 100 30 Q 96 36 100 42 Q 110 46 116 36 Z" fill="rgba(217, 101, 74, 0.32)" stroke="none" />
          <path d="M 120 60 Q 130 56 136 60 Q 130 66 120 60 Z" fill="rgba(217, 101, 74, 0.32)" stroke="none" />
          <circle cx="106" cy="24" r="1.4" fill="#cf3b29" />
          <circle cx="134" cy="64" r="1.1" fill="#cf3b29" />
        </g>
        <g className="bs-vine bs-vine--bl" stroke="url(#bs-gold-soft)" strokeWidth="0.85" fill="none" strokeLinecap="round">
          <path d="M 22 182 Q 38 178 44 164 Q 50 150 40 140 Q 30 132 36 120" />
          <path d="M 44 164 Q 52 174 60 170 Q 64 164 60 158 Q 52 154 44 164 Z" fill="rgba(217, 101, 74, 0.32)" stroke="none" />
          <path d="M 40 140 Q 30 144 24 140 Q 30 134 40 140 Z" fill="rgba(217, 101, 74, 0.32)" stroke="none" />
          <circle cx="54" cy="176" r="1.4" fill="#cf3b29" />
          <circle cx="26" cy="136" r="1.1" fill="#cf3b29" />
        </g>

        <g className="bs-corner bs-corner--tl" fill="#cf3b29" fillOpacity="0.65">
          <path d="M 14 14 L 28 14 Q 28 19 22 21 L 22 28 L 14 28 Z" />
          <circle cx="18" cy="18" r="0.9" />
        </g>
        <g className="bs-corner bs-corner--tr" fill="#cf3b29" fillOpacity="0.55">
          <path d="M 146 14 L 132 14 Q 132 19 138 21 L 138 28 L 146 28 Z" />
          <circle cx="142" cy="18" r="0.9" />
        </g>
        <g className="bs-corner bs-corner--bl" fill="#a73c2c" fillOpacity="0.6">
          <path d="M 14 186 L 28 186 Q 28 181 22 179 L 22 172 L 14 172 Z" />
          <circle cx="18" cy="182" r="0.9" />
        </g>
        <g className="bs-corner bs-corner--br" fill="#a73c2c" fillOpacity="0.6">
          <path d="M 146 186 L 132 186 Q 132 181 138 179 L 138 172 L 146 172 Z" />
          <circle cx="142" cy="182" r="0.9" />
        </g>

        <g className="bs-pips" fill="url(#bs-gold-soft)">
          <circle cx="80" cy="14" r="0.9" />
          <circle cx="80" cy="186" r="0.9" />
          <circle cx="14" cy="100" r="0.9" />
          <circle cx="146" cy="100" r="0.9" />
        </g>

        <g className="bs-stamen" stroke="rgba(140, 82, 28, 0.45)" strokeWidth="0.4" fill="none" strokeLinecap="round">
          <path d="M 78 36 Q 76 60 80 84" />
          <path d="M 80 36 Q 82 60 80 84" />
        </g>

        <g className="bs-letter">
          <text
            x="80"
            y="160"
            textAnchor="middle"
            className="bs-letter-glyph"
          >
            {letter}
          </text>
          <line
            x1="58"
            y1="170"
            x2="102"
            y2="170"
            stroke="url(#bs-gold)"
            strokeWidth="0.7"
            strokeLinecap="round"
            opacity="0.85"
          />
        </g>
      </svg>
    </span>
  )
}

/* ──────────────────────────────────────────────────────────────────────
   iteration 153 · a recto catchword sits between the title rule and
   the specimen wordmark.

   A small, composed italic slip — the recto's "press catch" — names
   the question in its own right: a thin gold rule, the press's
   monogram, an italic inscription, and another thin rule. It uses
   the same idiom as the chapter-frontispiece half-title and the
   chapter-signature, but it is the question's own quiet signature,
   set in the space between the title's end and the specimen below.
   ────────────────────────────────────────────────────────────────────── */

function RectoCatchword({
  visible,
  reduced,
}: {
  visible: boolean
  reduced: boolean
}) {
  return (
    <figure
      className={`recto-catchword${visible ? ' is-visible' : ''}${
        reduced ? ' is-static' : ''
      }`}
      aria-hidden="true"
    >
      <span className="recto-catchword-rule recto-catchword-rule--left" />
      <span className="recto-catchword-cluster">
        <em className="recto-catchword-key">the question</em>
        <span className="recto-catchword-sep" aria-hidden="true">·</span>
        <em className="recto-catchword-tail">set in this folio</em>
      </span>
      <span className="recto-catchword-sigil" aria-hidden="true">
        <svg viewBox="0 0 18 18" focusable="false">
          <defs>
            <linearGradient id="rcw-gold" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f6d076" />
              <stop offset="50%" stopColor="#c8923e" />
              <stop offset="100%" stopColor="#9c6e26" />
            </linearGradient>
            <radialGradient id="rcw-face" cx="50%" cy="34%" r="64%">
              <stop offset="0%" stopColor="rgba(255, 246, 218, 0.55)" />
              <stop offset="62%" stopColor="rgba(245, 220, 168, 0.18)" />
              <stop offset="100%" stopColor="rgba(214, 178, 116, 0)" />
            </radialGradient>
          </defs>
          <circle cx="9" cy="9" r="8.2" fill="url(#rcw-face)" />
          <circle
            cx="9"
            cy="9"
            r="7.6"
            fill="none"
            stroke="url(#rcw-gold)"
            strokeWidth="0.45"
          />
          <circle
            cx="9"
            cy="9"
            r="6.4"
            fill="none"
            stroke="url(#rcw-gold)"
            strokeWidth="0.22"
            strokeDasharray="0.4 1.2"
            opacity="0.78"
          />
          <text
            x="9"
            y="10.6"
            textAnchor="middle"
            className="recto-catchword-letter"
          >
            m
          </text>
          <text
            x="9"
            y="13.2"
            textAnchor="middle"
            className="recto-catchword-roman"
          >
            ·iii
          </text>
          <line
            x1="6"
            y1="14"
            x2="12"
            y2="14"
            stroke="url(#rcw-gold)"
            strokeWidth="0.28"
            strokeLinecap="round"
            opacity="0.7"
          />
        </svg>
      </span>
      <span className="recto-catchword-rule recto-catchword-rule--right" />
    </figure>
  )
}

/* ──────────────────────────────────────────────────────────────────────
   iteration 154 · the verso earns its own composed press catchword.

   A delicate italic slip sits between the verso frontispiece and the
   three-voice verses, mirroring the recto's RectoCatchword in idiom
   but speaking in the reply's own slower voice. It uses the same
   thin gold rule, the same italic cluster, and the same hidden-sigil
   pattern — but bears a small leaf-and-fleuron sigil (not the
   printer's monogram) and an inscription that names the reply, not
   the question. Together with the recto catchword it completes the
   recto/verso opening symmetry: each side of the spread now earns
   its own quiet press signature, set by its own hand.
   ────────────────────────────────────────────────────────────────────── */

function ReplyCatchword({
  visible,
  reduced,
}: {
  visible: boolean
  reduced: boolean
}) {
  return (
    <figure
      className={`reply-catchword${visible ? ' is-visible' : ''}${
        reduced ? ' is-static' : ''
      }`}
      aria-hidden="true"
    >
      <span className="reply-catchword-rule reply-catchword-rule--left" />
      <span className="reply-catchword-cluster">
        <em className="reply-catchword-key">the reply</em>
        <span className="reply-catchword-sep" aria-hidden="true">·</span>
        <em className="reply-catchword-tail">set slowly, in this folio</em>
      </span>
      <span className="reply-catchword-sigil" aria-hidden="true">
        <svg viewBox="0 0 18 18" focusable="false">
          <defs>
            <linearGradient id="rpcw-gold" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f6d076" />
              <stop offset="50%" stopColor="#c8923e" />
              <stop offset="100%" stopColor="#9c6e26" />
            </linearGradient>
            <radialGradient id="rpcw-face" cx="50%" cy="34%" r="64%">
              <stop offset="0%" stopColor="rgba(255, 246, 218, 0.55)" />
              <stop offset="62%" stopColor="rgba(245, 220, 168, 0.18)" />
              <stop offset="100%" stopColor="rgba(214, 178, 116, 0)" />
            </radialGradient>
            <linearGradient id="rpcw-leaf" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(154, 110, 38, 0.55)" />
              <stop offset="100%" stopColor="rgba(78, 56, 28, 0.7)" />
            </linearGradient>
          </defs>
          <circle cx="9" cy="9" r="8.2" fill="url(#rpcw-face)" />
          <circle
            cx="9"
            cy="9"
            r="7.6"
            fill="none"
            stroke="url(#rpcw-gold)"
            strokeWidth="0.45"
          />
          <circle
            cx="9"
            cy="9"
            r="6.4"
            fill="none"
            stroke="url(#rpcw-gold)"
            strokeWidth="0.22"
            strokeDasharray="0.4 1.2"
            opacity="0.78"
          />
          <g className="rpcw-leaf-group" stroke="url(#rpcw-leaf)" strokeWidth="0.4" fill="none" strokeLinecap="round">
            <path d="M 9 4.5 Q 6.4 7 7 9.6 Q 9 11 9 4.5 Z" fill="rgba(154, 110, 38, 0.42)" stroke="none" />
            <path d="M 9 4.5 Q 11.6 7 11 9.6 Q 9 11 9 4.5 Z" fill="rgba(167, 60, 44, 0.32)" stroke="none" />
            <line x1="9" y1="4.5" x2="9" y2="11" stroke="rgba(107, 74, 37, 0.55)" strokeWidth="0.3" />
          </g>
          <line
            x1="6"
            y1="11.4"
            x2="12"
            y2="11.4"
            stroke="url(#rpcw-gold)"
            strokeWidth="0.28"
            strokeLinecap="round"
            opacity="0.7"
          />
          <path
            className="rpcw-fleuron"
            d="M 9 13.4 Q 7.2 12.6 7.6 11.6 M 9 13.4 Q 10.8 12.6 10.4 11.6"
            fill="none"
            stroke="rgba(167, 60, 44, 0.78)"
            strokeWidth="0.32"
            strokeLinecap="round"
          />
        </svg>
      </span>
      <span className="reply-catchword-rule reply-catchword-rule--right" />
    </figure>
  )
}

function TitleRule({
  visible,
  reduced,
}: {
  visible: boolean
  reduced: boolean
}) {
  return (
    <figure
      className={`title-rule${visible ? ' is-visible' : ''}${
        reduced ? ' is-static' : ''
      }`}
      aria-hidden="true"
    >
      <svg viewBox="0 0 320 24" focusable="false" className="title-rule-svg">
        <defs>
          <linearGradient id="tr-gold" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(167, 60, 44, 0)" />
            <stop offset="14%" stopColor="rgba(167, 60, 44, 0.55)" />
            <stop offset="34%" stopColor="rgba(200, 146, 62, 0.7)" />
            <stop offset="50%" stopColor="rgba(245, 198, 91, 0.85)" />
            <stop offset="66%" stopColor="rgba(200, 146, 62, 0.7)" />
            <stop offset="86%" stopColor="rgba(167, 60, 44, 0.55)" />
            <stop offset="100%" stopColor="rgba(167, 60, 44, 0)" />
          </linearGradient>
        </defs>
        <line
          x1="2"
          y1="12"
          x2="318"
          y2="12"
          stroke="url(#tr-gold)"
          strokeWidth="0.9"
          strokeLinecap="round"
          className="title-rule-line"
        />
        <line
          x1="2"
          y1="14.4"
          x2="318"
          y2="14.4"
          stroke="rgba(167, 60, 44, 0.18)"
          strokeWidth="0.35"
          strokeLinecap="round"
          className="title-rule-ghost"
        />
        <g
          className="title-rule-fleuron"
          transform="translate(160 12)"
          fill="none"
          stroke="rgba(167, 60, 44, 0.78)"
          strokeWidth="0.7"
          strokeLinecap="round"
        >
          <circle r="2.4" fill="rgba(245, 198, 91, 0.55)" stroke="rgba(167, 60, 44, 0.6)" strokeWidth="0.55" />
          <path d="M -10 0 Q -6 -3.4 -2 0" />
          <path d="M -10 0 Q -6 3.4 -2 0" />
          <path d="M 10 0 Q 6 -3.4 2 0" />
          <path d="M 10 0 Q 6 3.4 2 0" />
          <circle cx="-2" cy="0" r="0.55" fill="rgba(167, 60, 44, 0.78)" stroke="none" />
          <circle cx="2" cy="0" r="0.55" fill="rgba(167, 60, 44, 0.78)" stroke="none" />
          <circle cx="-13" cy="0" r="0.7" fill="rgba(167, 60, 44, 0.7)" stroke="none" />
          <circle cx="13" cy="0" r="0.7" fill="rgba(167, 60, 44, 0.7)" stroke="none" />
        </g>
        <g
          className="title-rule-diamond"
          transform="translate(64 12)"
          fill="rgba(167, 60, 44, 0.6)"
        >
          <path d="M 0 -2.2 L 2.2 0 L 0 2.2 L -2.2 0 Z" />
        </g>
        <g
          className="title-rule-diamond title-rule-diamond--right"
          transform="translate(256 12)"
          fill="rgba(167, 60, 44, 0.6)"
        >
          <path d="M 0 -2.2 L 2.2 0 L 0 2.2 L -2.2 0 Z" />
        </g>
      </svg>
      <figcaption className="title-rule-caption">the question · set in this folio</figcaption>
    </figure>
  )
}

/* ──────────────────────────────────────────────────────────────────────
   the question press mark — the printer's hand beneath the question.
   A small monogram sigil and a hand-drawn italic inscription that
   names the press and the leaf. Replaces the orphan recto-spread-foot
   and gives the recto its own quiet editorial closure.
   ────────────────────────────────────────────────────────────────────── */

function QuestionPressMark({
  visible,
  reduced,
}: {
  visible: boolean
  reduced: boolean
}) {
  return (
    <figure
      className={`question-press-mark${visible ? ' is-visible' : ''}${
        reduced ? ' is-static' : ''
      }`}
      aria-hidden="true"
    >
      <span className="question-press-mark-rule question-press-mark-rule--left" />
      <span className="question-press-mark-cluster">
        <span className="question-press-mark-sigil" aria-hidden="true">
          <svg viewBox="0 0 22 22" focusable="false">
            <defs>
              <linearGradient id="qpm-gold" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f6d076" />
                <stop offset="50%" stopColor="#c8923e" />
                <stop offset="100%" stopColor="#9c6e26" />
              </linearGradient>
              <radialGradient id="qpm-face" cx="50%" cy="34%" r="64%">
                <stop offset="0%" stopColor="rgba(255, 246, 218, 0.55)" />
                <stop offset="62%" stopColor="rgba(245, 220, 168, 0.18)" />
                <stop offset="100%" stopColor="rgba(214, 178, 116, 0)" />
              </radialGradient>
            </defs>
            <ellipse cx="11" cy="11" rx="10" ry="10" fill="url(#qpm-face)" />
            <circle
              cx="11"
              cy="11"
              r="9.4"
              fill="none"
              stroke="url(#qpm-gold)"
              strokeWidth="0.55"
            />
            <circle
              cx="11"
              cy="11"
              r="8.4"
              fill="none"
              stroke="url(#qpm-gold)"
              strokeWidth="0.28"
              strokeDasharray="0.5 1.4"
              opacity="0.78"
            />
            <text
              x="11"
              y="12.6"
              textAnchor="middle"
              className="question-press-mark-letter"
            >
              m
            </text>
            <text
              x="11"
              y="15.4"
              textAnchor="middle"
              className="question-press-mark-roman"
            >
              ·iii
            </text>
            <line
              x1="6.6"
              y1="16.6"
              x2="15.4"
              y2="16.6"
              stroke="url(#qpm-gold)"
              strokeWidth="0.3"
              strokeLinecap="round"
              opacity="0.7"
            />
          </svg>
        </span>
        <em className="question-press-mark-key">manu m · iii</em>
        <span className="question-press-mark-sep" aria-hidden="true">·</span>
        <em className="question-press-mark-tail">
          the question, pressed in this folio
        </em>
        <span className="question-press-mark-pilcrow" aria-hidden="true">¶</span>
      </span>
      <span className="question-press-mark-rule question-press-mark-rule--right" />
    </figure>
  )
}

function AnswerPlateCorner({ corner }: { corner: 'tl' | 'tr' | 'bl' | 'br' }) {
  const g = `apc-${corner}-gold`
  return (
    <svg viewBox="0 0 44 44" focusable="false" aria-hidden="true">
      <defs>
        <linearGradient id={`${g}-stroke`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#9c6e26" />
          <stop offset="50%" stopColor="#f5c65b" />
          <stop offset="100%" stopColor="#9c6e26" />
        </linearGradient>
        <radialGradient id={`${g}-pip`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(255, 232, 178, 0.95)" />
          <stop offset="55%" stopColor="#f5c65b" />
          <stop offset="100%" stopColor="#9c6e26" />
        </radialGradient>
      </defs>
      {corner === 'tl' && (
        <g>
          <path d="M 3 18 L 3 3 L 18 3" fill="none" stroke={`url(#${g}-stroke)`} strokeWidth="0.95" strokeLinecap="round" />
          <path d="M 8 18 L 8 8 L 18 8" fill="none" stroke={`url(#${g}-stroke)`} strokeWidth="0.46" opacity="0.7" />
          <path d="M 13 8 L 18 13" fill="none" stroke={`url(#${g}-stroke)`} strokeWidth="0.32" opacity="0.55" />
          <circle cx="6" cy="6" r="2.6" fill="none" stroke={`url(#${g}-stroke)`} strokeWidth="0.32" opacity="0.55" />
          <circle cx="6" cy="6" r="1.4" fill={`url(#${g}-pip)`} />
          <circle cx="6" cy="6" r="0.55" fill="rgba(255, 246, 218, 0.95)" />
          <path d="M 14 14 L 18 14 L 18 18" fill="none" stroke={`url(#${g}-stroke)`} strokeWidth="0.3" opacity="0.42" />
        </g>
      )}
      {corner === 'tr' && (
        <g>
          <path d="M 26 3 L 41 3 L 41 18" fill="none" stroke={`url(#${g}-stroke)`} strokeWidth="0.95" strokeLinecap="round" />
          <path d="M 26 8 L 36 8 L 36 18" fill="none" stroke={`url(#${g}-stroke)`} strokeWidth="0.46" opacity="0.7" />
          <path d="M 31 8 L 26 13" fill="none" stroke={`url(#${g}-stroke)`} strokeWidth="0.32" opacity="0.55" />
          <circle cx="38" cy="6" r="2.6" fill="none" stroke={`url(#${g}-stroke)`} strokeWidth="0.32" opacity="0.55" />
          <circle cx="38" cy="6" r="1.4" fill={`url(#${g}-pip)`} />
          <circle cx="38" cy="6" r="0.55" fill="rgba(255, 246, 218, 0.95)" />
          <path d="M 26 14 L 26 18 L 30 18" fill="none" stroke={`url(#${g}-stroke)`} strokeWidth="0.3" opacity="0.42" />
        </g>
      )}
      {corner === 'bl' && (
        <g>
          <path d="M 3 26 L 3 41 L 18 41" fill="none" stroke={`url(#${g}-stroke)`} strokeWidth="0.95" strokeLinecap="round" />
          <path d="M 8 26 L 8 36 L 18 36" fill="none" stroke={`url(#${g}-stroke)`} strokeWidth="0.46" opacity="0.7" />
          <path d="M 13 36 L 18 31" fill="none" stroke={`url(#${g}-stroke)`} strokeWidth="0.32" opacity="0.55" />
          <circle cx="6" cy="38" r="2.6" fill="none" stroke={`url(#${g}-stroke)`} strokeWidth="0.32" opacity="0.55" />
          <circle cx="6" cy="38" r="1.4" fill={`url(#${g}-pip)`} />
          <circle cx="6" cy="38" r="0.55" fill="rgba(255, 246, 218, 0.95)" />
          <path d="M 14 26 L 18 26 L 18 30" fill="none" stroke={`url(#${g}-stroke)`} strokeWidth="0.3" opacity="0.42" />
        </g>
      )}
      {corner === 'br' && (
        <g>
          <path d="M 26 41 L 41 41 L 41 26" fill="none" stroke={`url(#${g}-stroke)`} strokeWidth="0.95" strokeLinecap="round" />
          <path d="M 26 36 L 36 36 L 36 26" fill="none" stroke={`url(#${g}-stroke)`} strokeWidth="0.46" opacity="0.7" />
          <path d="M 31 36 L 26 31" fill="none" stroke={`url(#${g}-stroke)`} strokeWidth="0.32" opacity="0.55" />
          <circle cx="38" cy="38" r="2.6" fill="none" stroke={`url(#${g}-stroke)`} strokeWidth="0.32" opacity="0.55" />
          <circle cx="38" cy="38" r="1.4" fill={`url(#${g}-pip)`} />
          <circle cx="38" cy="38" r="0.55" fill="rgba(255, 246, 218, 0.95)" />
          <path d="M 26 30 L 26 26 L 30 26" fill="none" stroke={`url(#${g}-stroke)`} strokeWidth="0.3" opacity="0.42" />
        </g>
      )}
    </svg>
  )
}

function AnswerPlateFrame({
  visible,
  progress,
}: {
  visible: boolean
  progress: number
}) {
  const rim = Math.max(0, Math.min(1, progress))
  return (
    <div
      className={`answer-plate-frame${visible ? ' is-visible' : ''}`}
      aria-hidden="true"
      style={{
        '--plate-rim': rim,
      } as React.CSSProperties}
    >
      <svg
        className="answer-plate-rim"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        focusable="false"
      >
        <defs>
          <linearGradient id="apf-ink-rule" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(58, 40, 22, 0.95)" />
            <stop offset="100%" stopColor="rgba(28, 30, 26, 0.85)" />
          </linearGradient>
          <linearGradient id="apf-gold-rule" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#9c6e26" />
            <stop offset="50%" stopColor="#f5c65b" />
            <stop offset="100%" stopColor="#9c6e26" />
          </linearGradient>
        </defs>
        <rect
          className="apf-rim-outer"
          x="0.6"
          y="0.6"
          width="98.8"
          height="98.8"
          rx="0.4"
          fill="none"
          stroke="url(#apf-ink-rule)"
          strokeWidth="0.45"
          pathLength="100"
        />
        <rect
          className="apf-rim-inner"
          x="3"
          y="3"
          width="94"
          height="94"
          rx="0.2"
          fill="none"
          stroke="url(#apf-ink-rule)"
          strokeWidth="0.18"
          strokeDasharray="0.7 1.3"
          opacity="0.55"
        />

        <g className="apf-title-block">
          <rect x="38" y="3.2" width="24" height="6.8" fill="var(--paper)" opacity="0" />
          <line x1="38" y1="3.4" x2="62" y2="3.4" stroke="url(#apf-ink-rule)" strokeWidth="0.4" />
          <line x1="38" y1="8.6" x2="62" y2="8.6" stroke="url(#apf-ink-rule)" strokeWidth="0.4" />
          <text x="50" y="7.0" textAnchor="middle" className="apf-title">THE ANSWER</text>
        </g>

        <g className="apf-foot-block">
          <line x1="32" y1="93.2" x2="46" y2="93.2" stroke="url(#apf-gold-rule)" strokeWidth="0.32" />
          <line x1="54" y1="93.2" x2="68" y2="93.2" stroke="url(#apf-gold-rule)" strokeWidth="0.32" />
          <text x="50" y="94.4" textAnchor="middle" className="apf-foot">cap · xviii</text>
        </g>

        <g className="apf-side-ticks">
          <line x1="50" y1="3" x2="50" y2="5" stroke="url(#apf-ink-rule)" strokeWidth="0.3" opacity="0.55" />
          <line x1="50" y1="95" x2="50" y2="97" stroke="url(#apf-ink-rule)" strokeWidth="0.3" opacity="0.55" />
        </g>

        <g className="apf-corner-dots" fill="url(#apf-gold-rule)" opacity="0.7">
          <circle cx="3.6" cy="3.6" r="0.7" />
          <circle cx="96.4" cy="3.6" r="0.7" />
          <circle cx="3.6" cy="96.4" r="0.7" />
          <circle cx="96.4" cy="96.4" r="0.7" />
        </g>
      </svg>
    </div>
  )
}

function InkTrail({ active }: { active: boolean }) {
  const items = [
    { id: 0, x: 6, scale: 1 },
    { id: 1, x: 18, scale: 0.7 },
    { id: 2, x: 32, scale: 0.9 },
  ]
  return (
    <div className={`ink-trail${active ? ' is-active' : ''}`} aria-hidden="true">
      <svg viewBox="0 0 42 14" focusable="false" preserveAspectRatio="none">
        {items.map((it) => (
          <ellipse
            key={it.id}
            cx={it.x}
            cy={11}
            rx={1.6 * it.scale}
            ry={0.8 * it.scale}
            fill="rgba(28, 30, 40, 0.6)"
            className={`ink-trail-dot ink-trail-dot--${it.id}${active ? ' is-active' : ''}`}
          />
        ))}
      </svg>
    </div>
  )
}

function EphemerisConstellation({ cycle }: { cycle: number }) {
  return (
    <svg
      className={`ephemeris-constellation${cycle > 0 ? ' is-reread' : ''}`}
      viewBox="0 0 300 80"
      preserveAspectRatio="none"
      focusable="false"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="eph-constellation" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="rgba(167, 60, 44, 0.18)" />
          <stop offset="50%" stopColor="rgba(156, 110, 38, 0.55)" />
          <stop offset="100%" stopColor="rgba(167, 60, 44, 0.18)" />
        </linearGradient>
      </defs>
      <g className="eph-constellation-lines" stroke="url(#eph-constellation)" fill="none">
        <line x1="50" y1="40" x2="150" y2="40" strokeWidth="0.4" strokeDasharray="1.6 2.4" />
        <line x1="150" y1="40" x2="250" y2="40" strokeWidth="0.4" strokeDasharray="1.6 2.4" />
        <line x1="50" y1="40" x2="250" y2="40" strokeWidth="0.3" strokeDasharray="0.8 3.2" opacity="0.45" />
      </g>
      <g className="eph-constellation-nodes" fill="rgba(167, 60, 44, 0.55)">
        <circle cx="50" cy="40" r="1.4" />
        <circle cx="150" cy="40" r="1.6" />
        <circle cx="250" cy="40" r="1.4" />
      </g>
      <g className="eph-constellation-rings" fill="none" stroke="rgba(167, 60, 44, 0.42)">
        <circle cx="150" cy="40" r="3.2" strokeWidth="0.35" />
        <circle cx="150" cy="40" r="6.4" strokeWidth="0.25" strokeDasharray="0.4 1.2" opacity="0.6" />
      </g>
    </svg>
  )
}

function EphemerisPlate({
  visible,
  now,
  moonPhase,
  cycle,
  hours,
  minutes,
  seconds,
  reduced,
  registerHour,
  registerDaybook,
}: {
  visible: boolean
  now: Date
  moonPhase: number
  cycle: number
  hours: number
  minutes: number
  seconds: number
  reduced: boolean
  registerHour: (el: HTMLElement | null) => void
  registerDaybook: (el: HTMLElement | null) => void
}) {
  return (
    <aside
      className={`ephemeris-plate${visible ? ' is-visible' : ''}`}
      aria-label="ephemeris of this folio"
    >
      <header className="ephemeris-head">
        <span className="ephemeris-head-rule ephemeris-head-rule--left" />
        <span className="ephemeris-head-text">
          <em className="ephemeris-head-key">ephemeris</em>
          <span className="ephemeris-head-sep" aria-hidden="true">·</span>
          <em className="ephemeris-head-title">a printed table of this reading</em>
        </span>
        <span className="ephemeris-head-rule ephemeris-head-rule--right" />
      </header>

      <div
        data-section="sec-almanac"
        ref={registerDaybook}
        className="ephemeris-daybook-slot"
      >
        <AlmanacDaybook now={now} moonPhase={moonPhase} cycle={cycle} />
      </div>

      <div className="ephemeris-divider" aria-hidden="true">
        <span className="ephemeris-divider-line ephemeris-divider-line--left" />
        <span className="ephemeris-divider-glyph">§</span>
        <span className="ephemeris-divider-line ephemeris-divider-line--right" />
      </div>

      <div className="ephemeris-bench-wrap">
        <div className="ephemeris-volvelle-stage">
          <div ref={registerHour} data-section="sec-hour" className="bench-item bench-item--volvelle">
            <CelestialVolvelle
              hours={hours}
              minutes={minutes}
              seconds={seconds}
              moonPhase={moonPhase}
              reduced={reduced}
              visible={visible}
            />
          </div>
        </div>
      </div>

      <footer className="ephemeris-foot">
        <span className="ephemeris-foot-rule ephemeris-foot-rule--left" />
        <span className="ephemeris-foot-text">
          <em>pressed in this browser</em>
          <span className="ephemeris-foot-sep" aria-hidden="true">·</span>
          <em>m. iii · mmxxvi</em>
        </span>
        <span className="ephemeris-foot-rule ephemeris-foot-rule--right" />
      </footer>
    </aside>
  )
}



function CelestialVolvelle({
  hours,
  minutes,
  seconds,
  moonPhase,
  reduced,
  visible,
}: {
  hours: number
  minutes: number
  seconds: number
  moonPhase: number
  reduced: boolean
  visible: boolean
}) {
  const cx = 80
  const cy = 80
  const rOuter = 76
  const rSky = 62
  const rHourOuter = 52
  const rHourInner = 36
  const rMoon = 32
  const rInnerDisk = 22
  const cxMoon = cx + 0
  const cyMoon = cy + 0

  const minuteAngle = minutes * 6 + seconds * 0.1
  const hourAngle = (hours % 12) * 30 + minutes * 0.5

  const siderealHours = (((hours + minutes / 60 + seconds / 3600) * 1.00273790935) + 12) % 24
  const skyRotation = (siderealHours / 24) * 360

  const moonName = moonPhaseName(moonPhase)
  const illumination = Math.round((1 - Math.cos(moonPhase * 2 * Math.PI)) * 50)

  const hourTicks = Array.from({ length: 12 }, (_, i) => {
    const angle = (i * 30 - 90) * (Math.PI / 180)
    const inner = rHourInner
    const outer = rHourOuter
    return {
      x1: cx + inner * Math.cos(angle),
      y1: cy + inner * Math.sin(angle),
      x2: cx + outer * Math.cos(angle),
      y2: cy + outer * Math.sin(angle),
      angle: i * 30,
      isCardinal: i % 3 === 0,
    }
  })

  const numerals = Array.from({ length: 12 }, (_, i) => {
    const n = i === 0 ? 12 : i
    const angle = (i * 30 - 90) * (Math.PI / 180)
    const r = (rHourInner + rHourOuter) / 2
    return {
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
      n,
    }
  })

  const stars = [
    { x: 92, y: 38, r: 1.4, major: true },
    { x: 76, y: 30, r: 1.05 },
    { x: 56, y: 32, r: 0.85 },
    { x: 50, y: 46, r: 0.9 },
    { x: 46, y: 62, r: 1.05, major: true },
    { x: 60, y: 76, r: 0.85 },
    { x: 86, y: 76, r: 0.95 },
    { x: 102, y: 60, r: 1.1, major: true },
    { x: 110, y: 40, r: 0.7 },
    { x: 100, y: 22, r: 0.55 },
    { x: 68, y: 18, r: 0.55 },
    { x: 38, y: 24, r: 0.55 },
    { x: 30, y: 44, r: 0.5 },
    { x: 28, y: 64, r: 0.5 },
    { x: 44, y: 86, r: 0.45 },
    { x: 78, y: 92, r: 0.45 },
    { x: 108, y: 86, r: 0.45 },
    { x: 120, y: 68, r: 0.5 },
    { x: 122, y: 50, r: 0.5 },
  ]

  return (
    <div
      className={`volvelle${visible ? ' is-visible' : ''}`}
      aria-hidden="true"
    >
      <svg className="volvelle-dial" viewBox="0 0 160 160" focusable="false">
        <defs>
          <radialGradient id="volvelle-paper" cx="50%" cy="42%" r="62%">
            <stop offset="0%" stopColor="rgba(255, 248, 224, 0.96)" />
            <stop offset="64%" stopColor="rgba(245, 220, 168, 0.82)" />
            <stop offset="100%" stopColor="rgba(214, 178, 116, 0.62)" />
          </radialGradient>
          <radialGradient id="volvelle-sky" cx="50%" cy="38%" r="62%">
            <stop offset="0%" stopColor="rgba(46, 62, 102, 0.62)" />
            <stop offset="62%" stopColor="rgba(22, 30, 52, 0.52)" />
            <stop offset="100%" stopColor="rgba(10, 14, 24, 0.18)" />
          </radialGradient>
          <radialGradient id="volvelle-moon" cx="38%" cy="34%" r="80%">
            <stop offset="0%" stopColor="rgba(255, 246, 218, 0.96)" />
            <stop offset="62%" stopColor="rgba(238, 220, 178, 0.86)" />
            <stop offset="100%" stopColor="rgba(196, 162, 110, 0.62)" />
          </radialGradient>
          <radialGradient id="volvelle-moon-shadow" cx="60%" cy="60%" r="80%">
            <stop offset="0%" stopColor="rgba(28, 36, 48, 0.78)" />
            <stop offset="68%" stopColor="rgba(14, 22, 32, 0.92)" />
            <stop offset="100%" stopColor="rgba(6, 12, 22, 0.96)" />
          </radialGradient>
          <linearGradient id="volvelle-gold" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f5c65b" />
            <stop offset="50%" stopColor="#c8923e" />
            <stop offset="100%" stopColor="#9c6e26" />
          </linearGradient>
          <pattern id="volvelle-grain" width="3" height="3" patternUnits="userSpaceOnUse">
            <circle cx="0.6" cy="0.4" r="0.4" fill="rgba(107, 74, 37, 0.06)" />
            <circle cx="2.2" cy="1.6" r="0.3" fill="rgba(107, 74, 37, 0.05)" />
          </pattern>
        </defs>

        <circle cx={cx} cy={cy} r={rOuter} fill="url(#volvelle-paper)" stroke="url(#volvelle-gold)" strokeWidth="1.1" />
        <circle cx={cx} cy={cy} r={rOuter} fill="url(#volvelle-grain)" opacity="0.6" />
        <circle cx={cx} cy={cy} r={rOuter - 4} fill="none" stroke="rgba(156, 110, 38, 0.5)" strokeWidth="0.45" strokeDasharray="0.5 1.4" />
        <circle cx={cx} cy={cy} r={rSky + 3} fill="none" stroke="rgba(156, 110, 38, 0.6)" strokeWidth="0.5" />

        <g
          className="volvelle-sky-ring"
          style={{ transformOrigin: `${cx}px ${cy}px` }}
        >
          <circle cx={cx} cy={cy} r={rSky} fill="url(#volvelle-sky)" stroke="rgba(214, 168, 73, 0.55)" strokeWidth="0.55" />
          <circle cx={cx} cy={cy} r={rSky - 4} fill="none" stroke="rgba(214, 168, 73, 0.22)" strokeWidth="0.3" strokeDasharray="0.4 1.4" />

          <g
            className="volvelle-sky-stars"
            style={reduced ? undefined : { transformOrigin: `${cx}px ${cy}px`, transform: `rotate(${skyRotation}deg)` }}
          >
            {stars.map((s, i) => (
              <circle
                key={i}
                cx={s.x}
                cy={s.y}
                r={s.r}
                fill="#fff8e0"
                opacity={s.major ? 1 : 0.78}
              />
            ))}
            <g
              className="volvelle-sky-constellation"
              stroke="rgba(245, 198, 91, 0.42)"
              strokeWidth="0.4"
              fill="none"
              strokeLinecap="round"
            >
              <line x1="92" y1="38" x2="76" y2="30" />
              <line x1="76" y1="30" x2="56" y2="32" />
              <line x1="56" y1="32" x2="46" y2="62" />
              <line x1="46" y1="62" x2="60" y2="76" />
              <line x1="60" y1="76" x2="86" y2="76" />
              <line x1="86" y1="76" x2="102" y2="60" />
              <line x1="102" y1="60" x2="92" y2="38" />
            </g>
            <circle cx="92" cy="38" r="4.4" fill="rgba(245, 198, 91, 0.22)" className="volvelle-polaris-halo" />
            <circle cx="92" cy="38" r="2.2" fill="rgba(245, 198, 91, 0.6)" className="volvelle-polaris-glow" />
            <circle cx="92" cy="38" r="1.1" fill="#fff8e0" />
          </g>

          <g className="volvelle-cardinals" fill="rgba(245, 198, 91, 0.7)">
            <text x={cx} y={cy - rSky + 8} textAnchor="middle" className="volvelle-cardinal-letter">N</text>
            <text x={cx + rSky - 4} y={cy + 4} textAnchor="middle" className="volvelle-cardinal-letter">E</text>
            <text x={cx} y={cy + rSky - 2} textAnchor="middle" className="volvelle-cardinal-letter">S</text>
            <text x={cx - rSky + 4} y={cy + 4} textAnchor="middle" className="volvelle-cardinal-letter">W</text>
          </g>
          <g
            className="volvelle-horizon"
            stroke="rgba(214, 168, 73, 0.55)"
            strokeWidth="0.45"
            strokeLinecap="round"
            fill="none"
          >
            <path d={`M ${cx - rSky + 6} ${cy + 4} Q ${cx} ${cy + 8} ${cx + rSky - 6} ${cy + 4}`} />
          </g>
        </g>

        <g
          className="volvelle-hour-ring"
          style={{ transformOrigin: `${cx}px ${cy}px` }}
        >
          <circle cx={cx} cy={cy} r={rHourOuter} fill="rgba(255, 248, 224, 0.92)" stroke="rgba(107, 74, 37, 0.55)" strokeWidth="0.55" />
          <circle cx={cx} cy={cy} r={rHourInner} fill="none" stroke="rgba(107, 74, 37, 0.3)" strokeWidth="0.35" strokeDasharray="0.4 1.2" />

          {hourTicks.map((t, i) => (
            <line
              key={i}
              x1={t.x1}
              y1={t.y1}
              x2={t.x2}
              y2={t.y2}
              stroke="rgba(28, 39, 64, 0.78)"
              strokeWidth={t.isCardinal ? 1.1 : 0.5}
              strokeLinecap="round"
            />
          ))}

          {numerals.map((num) => (
            <text
              key={num.n}
              x={num.x}
              y={num.y + 3}
              textAnchor="middle"
              className="volvelle-numeral"
            >
              {num.n}
            </text>
          ))}

          <g transform={`rotate(${hourAngle} ${cx} ${cy})`}>
            <line
              x1={cx}
              y1={cy}
              x2={cx}
              y2={cy - rHourInner + 4}
              stroke="rgba(28, 39, 64, 0.92)"
              strokeWidth="2.0"
              strokeLinecap="round"
            />
            <polygon
              points={`${cx},${cy - rHourInner + 2} ${cx - 3},${cy - rHourInner + 8} ${cx + 3},${cy - rHourInner + 8}`}
              fill="rgba(28, 39, 64, 0.92)"
            />
          </g>

          <g transform={`rotate(${minuteAngle} ${cx} ${cy})`}>
            <line
              x1={cx}
              y1={cy + 4}
              x2={cx}
              y2={cy - rHourInner + 2}
              stroke="rgba(28, 39, 64, 0.98)"
              strokeWidth="1.1"
              strokeLinecap="round"
            />
          </g>

          <g className="volvelle-second-hand">
            <line
              x1={cx}
              y1={cy + 5}
              x2={cx}
              y2={cy - rHourInner + 1}
              stroke="rgba(217, 101, 74, 0.92)"
              strokeWidth="0.7"
              strokeLinecap="round"
              transform={`rotate(${seconds * 6} ${cx} ${cy})`}
            />
            <circle
              cx={cx}
              cy={cy - rHourInner + 1}
              r="1"
              fill="rgba(217, 101, 74, 0.96)"
              transform={`rotate(${seconds * 6} ${cx} ${cy})`}
            />
          </g>

          <circle cx={cx} cy={cy} r="2.2" fill="rgba(28, 39, 64, 0.96)" />
          <circle cx={cx} cy={cy} r="0.8" fill="rgba(217, 101, 74, 0.96)" />
        </g>

        <g
          className="volvelle-moon-pip"
          style={{ transformOrigin: `${cxMoon}px ${cyMoon}px` }}
        >
          <circle cx={cxMoon} cy={cyMoon} r={rMoon + 6} fill="none" stroke="rgba(156, 110, 38, 0.2)" strokeWidth="0.4" strokeDasharray="0.4 1.2" />
        </g>

        <circle cx={cx} cy={cy} r={rOuter - 0.4} fill="none" stroke="rgba(107, 74, 37, 0.18)" strokeWidth="0.6" />
      </svg>

      <div className="volvelle-inscription">
        <span className="volvelle-inscription-rule volvelle-inscription-rule--left" />
        <span className="volvelle-inscription-cluster">
          <em className="volvelle-inscription-key">volvelle</em>
          <span className="volvelle-inscription-sep" aria-hidden="true">·</span>
          <em className="volvelle-inscription-title">a printed dial of this hour</em>
        </span>
        <span className="volvelle-inscription-rule volvelle-inscription-rule--right" />
      </div>

      <div className="volvelle-readouts">
        <div className="volvelle-readout">
          <span className="volvelle-readout-key">hour</span>
          <span className="volvelle-readout-val">
            {String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}
          </span>
        </div>
        <span className="volvelle-readout-divider" aria-hidden="true">¶</span>
        <div className="volvelle-readout">
          <span className="volvelle-readout-key">moon</span>
          <span className="volvelle-readout-val">
            <em>{moonName}</em>
            <span className="volvelle-readout-pct">{illumination}%</span>
          </span>
        </div>
        <span className="volvelle-readout-divider" aria-hidden="true">¶</span>
        <div className="volvelle-readout">
          <span className="volvelle-readout-key">sky</span>
          <span className="volvelle-readout-val">
            <em>Polaris</em>
            <span className="volvelle-readout-pct">· still</span>
          </span>
        </div>
      </div>
    </div>
  )
}

function PressedLeaf({ visible, reduced }: { visible: boolean; reduced: boolean }) {
  return (
    <div
      className={`pressed-leaf${visible ? ' is-visible' : ''}${
        reduced ? ' is-static' : ''
      }`}
      aria-hidden="true"
    >
      <svg viewBox="0 0 70 96" focusable="false">
        <defs>
          <linearGradient id="leaf-body" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(154, 168, 96, 0.58)" />
            <stop offset="55%" stopColor="rgba(118, 138, 70, 0.62)" />
            <stop offset="100%" stopColor="rgba(78, 96, 44, 0.5)" />
          </linearGradient>
          <linearGradient id="leaf-shadow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(54, 70, 32, 0.18)" />
            <stop offset="100%" stopColor="rgba(54, 70, 32, 0.45)" />
          </linearGradient>
        </defs>

        <g className="pressed-leaf-shadow">
          <path
            d="M 6 88 Q 4 50 18 24 Q 38 4 56 16 Q 64 36 50 64 Q 32 86 12 90 Z"
            fill="url(#leaf-shadow)"
            opacity="0.6"
          />
        </g>

        <g className="pressed-leaf-body">
          <path
            d="M 8 86 Q 6 50 20 26 Q 38 8 54 18 Q 60 36 48 62 Q 30 82 14 88 Z"
            fill="url(#leaf-body)"
            stroke="rgba(58, 80, 38, 0.5)"
            strokeWidth="0.4"
          />
          <path
            className="pressed-leaf-vein-mid"
            d="M 16 86 Q 24 56 34 32 Q 42 22 50 22"
            stroke="rgba(58, 80, 38, 0.55)"
            strokeWidth="0.5"
            fill="none"
            strokeLinecap="round"
          />
          <g className="pressed-leaf-veins" stroke="rgba(58, 80, 38, 0.4)" strokeWidth="0.3" fill="none" strokeLinecap="round">
            <path d="M 22 76 Q 28 70 30 64" />
            <path d="M 26 66 Q 32 60 34 56" />
            <path d="M 30 56 Q 36 50 38 44" />
            <path d="M 34 46 Q 40 40 42 34" />
            <path d="M 18 78 Q 14 70 16 60" />
            <path d="M 18 58 Q 14 50 18 42" />
            <path d="M 22 40 Q 18 32 22 24" />
          </g>
          <g className="pressed-leaf-blotches" fill="rgba(58, 80, 38, 0.32)">
            <ellipse cx="34" cy="42" rx="2.2" ry="1" transform="rotate(-22 34 42)" />
            <ellipse cx="26" cy="60" rx="1.6" ry="0.8" transform="rotate(-30 26 60)" />
            <ellipse cx="42" cy="34" rx="1.4" ry="0.8" transform="rotate(-12 42 34)" />
          </g>
          <path
            className="pressed-leaf-stem"
            d="M 12 90 Q 8 94 4 96"
            stroke="rgba(78, 56, 28, 0.7)"
            strokeWidth="0.55"
            fill="none"
            strokeLinecap="round"
          />
        </g>

        <text x="35" y="93" textAnchor="middle" className="pressed-leaf-script">
          h · lo · xviii
        </text>
      </svg>
    </div>
  )
}

function TuckedNote({ visible }: { visible: boolean }) {
  return (
    <div
      className={`tucked-note${visible ? ' is-visible' : ''}`}
      aria-hidden="true"
    >
      <svg className="tucked-note-paper" viewBox="0 0 96 140" focusable="false">
        <defs>
          <linearGradient id="note-paper" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(245, 230, 188, 0.96)" />
            <stop offset="100%" stopColor="rgba(228, 210, 168, 0.92)" />
          </linearGradient>
          <linearGradient id="note-fold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="rgba(217, 184, 122, 0.94)" />
            <stop offset="100%" stopColor="rgba(180, 140, 86, 0.94)" />
          </linearGradient>
        </defs>

        <path
          d="M 6 4 L 88 4 L 90 8 L 90 134 L 6 134 Z"
          fill="url(#note-paper)"
          stroke="rgba(107, 74, 37, 0.42)"
          strokeWidth="0.5"
        />

        <path
          d="M 78 4 L 90 4 L 90 16 Z"
          fill="url(#note-fold)"
          stroke="rgba(107, 74, 37, 0.32)"
          strokeWidth="0.4"
        />
        <line
          x1="78"
          y1="4"
          x2="90"
          y2="16"
          stroke="rgba(107, 74, 37, 0.3)"
          strokeWidth="0.3"
          strokeDasharray="1 1.4"
        />

        <g className="tucked-note-rules" stroke="rgba(107, 74, 37, 0.18)" strokeWidth="0.35">
          <line x1="10" y1="22" x2="80" y2="22" />
          <line x1="10" y1="32" x2="74" y2="32" />
          <line x1="10" y1="42" x2="60" y2="42" strokeDasharray="2 2" />
          <line x1="10" y1="50" x2="78" y2="50" />
        </g>

        <g className="tucked-note-glyphs">
          <text x="48" y="64" textAnchor="middle" className="tucked-note-numeral">
            ii.
          </text>
          <line
            x1="30"
            y1="70"
            x2="66"
            y2="70"
            stroke="rgba(107, 74, 37, 0.36)"
            strokeWidth="0.45"
          />

          <text x="10" y="82" className="tucked-note-word">
            question —
          </text>
          <text x="10" y="92" className="tucked-note-word">
            is m · iii
          </text>
          <text x="10" y="102" className="tucked-note-word">
            good at
          </text>
          <text x="10" y="112" className="tucked-note-word tucked-note-word--struck">
            frontend yet?
          </text>
          <line
            x1="10"
            y1="111"
            x2="50"
            y2="111"
            stroke="rgba(17, 32, 42, 0.6)"
            strokeWidth="0.4"
          />

          <text x="10" y="124" className="tucked-note-foot">
            draft · ii · kept
          </text>
        </g>

        <g className="tucked-note-tape" opacity="0.72">
          <rect
            x="22"
            y="-4"
            width="34"
            height="10"
            fill="rgba(245, 220, 168, 0.75)"
            stroke="rgba(154, 110, 38, 0.32)"
            strokeWidth="0.32"
            transform="rotate(-4 22 -4)"
          />
          <line
            x1="26"
            y1="2"
            x2="52"
            y2="3"
            stroke="rgba(154, 110, 38, 0.42)"
            strokeWidth="0.35"
            strokeDasharray="1.4 2"
            transform="rotate(-4 22 -4)"
          />
        </g>

        <g className="tucked-note-scribble" stroke="rgba(107, 74, 37, 0.35)" strokeWidth="0.4" fill="none" strokeLinecap="round">
          <path d="M 60 36 q 3 -2 6 0 q 3 -2 6 0" />
        </g>
      </svg>
    </div>
  )
}

function InkFingerprint({ visible }: { visible: boolean }) {
  return (
    <div
      className={`ink-fingerprint${visible ? ' is-visible' : ''}`}
      aria-hidden="true"
    >
      <svg viewBox="0 0 28 36" focusable="false">
        <g className="ink-print">
          <ellipse cx="14" cy="18" rx="9" ry="13" fill="rgba(17, 32, 42, 0.10)" />
          <path
            d="M 14 5 Q 6 8 6 18 Q 6 28 14 31"
            stroke="rgba(17, 32, 42, 0.42)"
            strokeWidth="0.55"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M 14 5 Q 22 8 22 18 Q 22 28 14 31"
            stroke="rgba(17, 32, 42, 0.42)"
            strokeWidth="0.55"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M 14 7 Q 9 10 9 18 Q 9 26 14 30"
            stroke="rgba(17, 32, 42, 0.34)"
            strokeWidth="0.45"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M 14 7 Q 19 10 19 18 Q 19 26 14 30"
            stroke="rgba(17, 32, 42, 0.34)"
            strokeWidth="0.45"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M 14 9 Q 11 12 11 18 Q 11 24 14 28"
            stroke="rgba(17, 32, 42, 0.28)"
            strokeWidth="0.35"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M 14 9 Q 17 12 17 18 Q 17 24 14 28"
            stroke="rgba(17, 32, 42, 0.28)"
            strokeWidth="0.35"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M 13 11 Q 13 14 13 18 Q 13 22 13 26"
            stroke="rgba(17, 32, 42, 0.22)"
            strokeWidth="0.3"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M 15 11 Q 15 14 15 18 Q 15 22 15 26"
            stroke="rgba(17, 32, 42, 0.22)"
            strokeWidth="0.3"
            fill="none"
            strokeLinecap="round"
          />
        </g>
      </svg>
    </div>
  )
}

function ReaderInkMark() {
  return (
    <figure className="recto-reader-mark" aria-hidden="true">
      <svg viewBox="0 0 46 60" focusable="false">
        <defs>
          <radialGradient id="rim-thumb" cx="50%" cy="34%" r="68%">
            <stop offset="0%" stopColor="rgba(196, 86, 64, 0.62)" />
            <stop offset="55%" stopColor="rgba(140, 50, 36, 0.70)" />
            <stop offset="100%" stopColor="rgba(110, 40, 24, 0.18)" />
          </radialGradient>
          <radialGradient id="pad-thumb" cx="42%" cy="38%" r="62%">
            <stop offset="0%" stopColor="rgba(217, 101, 74, 0.42)" />
            <stop offset="62%" stopColor="rgba(167, 60, 44, 0.30)" />
            <stop offset="100%" stopColor="rgba(110, 40, 24, 0.04)" />
          </radialGradient>
          <pattern id="thumb-grain" width="2.6" height="2.6" patternUnits="userSpaceOnUse" patternTransform="rotate(38)">
            <line x1="0" y1="0" x2="0" y2="2.6" stroke="rgba(110, 40, 24, 0.10)" strokeWidth="0.4" />
          </pattern>
        </defs>
        <ellipse cx="23" cy="14" rx="11.6" ry="8.4" fill="url(#pad-thumb)" />
        <ellipse cx="23" cy="14" rx="11.6" ry="8.4" fill="url(#thumb-grain)" opacity="0.6" />
        <ellipse cx="23" cy="14" rx="11.6" ry="8.4" fill="none" stroke="url(#rim-thumb)" strokeWidth="0.55" />
        <path
          d="M 11.4 14 Q 14 6 23 6 Q 32 6 34.6 14"
          stroke="rgba(110, 40, 24, 0.45)"
          strokeWidth="0.45"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M 11.4 14 Q 14 22 23 22 Q 32 22 34.6 14"
          stroke="rgba(110, 40, 24, 0.45)"
          strokeWidth="0.45"
          fill="none"
          strokeLinecap="round"
        />
        <g
          className="thumbpad-loops"
          stroke="rgba(110, 40, 24, 0.30)"
          strokeWidth="0.32"
          fill="none"
          strokeLinecap="round"
        >
          <path d="M 14.5 11 Q 18 9 21.5 11" />
          <path d="M 14.5 13.5 Q 18 11.5 21.5 13.5" />
          <path d="M 14.5 16 Q 18 14 21.5 16" />
          <path d="M 24.5 11 Q 28 9 31.5 11" />
          <path d="M 24.5 13.5 Q 28 11.5 31.5 13.5" />
          <path d="M 24.5 16 Q 28 14 31.5 16" />
          <path d="M 19 18 Q 23 16.5 27 18" />
        </g>
        <ellipse cx="23" cy="32" rx="14.6" ry="20.2" fill="url(#pad-thumb)" />
        <ellipse cx="23" cy="32" rx="14.6" ry="20.2" fill="url(#thumb-grain)" opacity="0.55" />
        <ellipse cx="23" cy="32" rx="14.6" ry="20.2" fill="none" stroke="url(#rim-thumb)" strokeWidth="0.55" />
        <g
          className="thumbpad-spiral"
          stroke="rgba(110, 40, 24, 0.30)"
          strokeWidth="0.32"
          fill="none"
          strokeLinecap="round"
        >
          <path d="M 11 24 Q 16 18 23 19 Q 30 20 33 26" />
          <path d="M 11 28 Q 17 22 23 23 Q 29 24 33 30" />
          <path d="M 11 32 Q 17 26 23 27 Q 29 28 33 34" />
          <path d="M 11 36 Q 17 30 23 31 Q 29 32 33 38" />
          <path d="M 11 40 Q 17 34 23 35 Q 29 36 33 42" />
          <path d="M 11 44 Q 17 38 23 39 Q 29 40 33 46" />
        </g>
        <path
          d="M 19 53 Q 23 56 27 53"
          stroke="rgba(110, 40, 24, 0.30)"
          strokeWidth="0.32"
          fill="none"
          strokeLinecap="round"
        />
      </svg>
    </figure>
  )
}

function AnswerFinishing({ visible }: { visible: boolean }) {
  return (
    <div
      className={`answer-finishing${visible ? ' is-visible' : ''}`}
      aria-hidden="true"
    >
      <svg
        className="answer-finishing-stroke"
        viewBox="0 0 240 36"
        focusable="false"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="finishing-gold" x1="0" y1="0" x2="1" y2="0.2">
            <stop offset="0%" stopColor="rgba(156, 110, 38, 0)" />
            <stop offset="10%" stopColor="rgba(167, 60, 44, 0.55)" />
            <stop offset="42%" stopColor="rgba(200, 146, 62, 0.78)" />
            <stop offset="74%" stopColor="rgba(245, 198, 91, 0.65)" />
            <stop offset="100%" stopColor="rgba(245, 198, 91, 0)" />
          </linearGradient>
        </defs>
        <path
          d="M 2 22 Q 26 14 52 18 Q 78 24 102 14 Q 126 6 154 16 Q 184 26 210 12 Q 226 6 238 14"
          stroke="url(#finishing-gold)"
          strokeWidth="0.7"
          strokeLinecap="round"
          fill="none"
          className="answer-finishing-path"
        />
        <circle cx="238" cy="14" r="1.1" fill="rgba(245, 198, 91, 0.85)" className="answer-finishing-dot" />
        <circle cx="238" cy="14" r="2.6" fill="rgba(245, 198, 91, 0.18)" className="answer-finishing-halo" />
      </svg>
      <span className="answer-finishing-glyph" aria-hidden="true">
        <svg viewBox="0 0 12 12" focusable="false">
          <circle cx="6" cy="6" r="4.4" fill="none" stroke="currentColor" strokeWidth="0.35" strokeDasharray="0.5 1.4" />
          <circle cx="6" cy="6" r="0.9" fill="currentColor" />
        </svg>
      </span>
      <span className="answer-finishing-caption">
        <em className="answer-finishing-key">the answer</em>
        <span className="answer-finishing-sep" aria-hidden="true">·</span>
        <em className="answer-finishing-tail">set in this folio</em>
      </span>
    </div>
  )
}

function ReadingPaceIndicator({
  visible,
  slow,
}: {
  visible: boolean
  slow: boolean
}) {
  const segments = 7
  return (
    <div
      className={`pace-indicator${visible ? ' is-visible' : ''}${
        slow ? ' is-slow' : ' is-quick'
      }`}
      aria-hidden="true"
    >
      <svg
        className="pace-indicator-meter"
        viewBox="0 0 96 14"
        focusable="false"
      >
        <defs>
          <linearGradient id="pace-fill" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(167, 60, 44, 0.95)" />
            <stop offset="50%" stopColor="rgba(217, 101, 74, 0.92)" />
            <stop offset="100%" stopColor="rgba(245, 198, 91, 0.95)" />
          </linearGradient>
        </defs>
        <g className="pace-indicator-ticks" stroke="rgba(107, 74, 37, 0.32)" strokeWidth="0.5" fill="none" strokeLinecap="round">
          <line x1="2" y1="2" x2="2" y2="12" />
          <line x1="94" y1="2" x2="94" y2="12" />
          <line x1="16" y1="4" x2="16" y2="10" />
          <line x1="32" y1="4" x2="32" y2="10" />
          <line x1="48" y1="2" x2="48" y2="12" />
          <line x1="64" y1="4" x2="64" y2="10" />
          <line x1="80" y1="4" x2="80" y2="10" />
        </g>
        <g className="pace-indicator-segments" fill="rgba(107, 74, 37, 0.18)">
          {Array.from({ length: segments }, (_, i) => (
            <rect
              key={i}
              x={4 + i * 12}
              y="5"
              width="9"
              height="4"
              rx="1"
            />
          ))}
        </g>
        <rect
          className="pace-indicator-fill"
          x="4"
          y="5"
          width="0"
          height="4"
          rx="1"
          fill="url(#pace-fill)"
        />
      </svg>
      <span className="pace-indicator-cluster">
        <em className="pace-indicator-key">reading pace</em>
        <span className="pace-indicator-sep" aria-hidden="true">·</span>
        <em className="pace-indicator-tail">
          {slow ? 'page pace' : 'slow reading'}
        </em>
      </span>
    </div>
  )
}

function LeafCluster({
  className,
  label,
}: {
  className?: string
  label?: string
}) {
  return (
    <div
      className={`leaf-cluster ${className ?? ''}`}
      role={label ? 'separator' : undefined}
      aria-hidden="true"
    >
      <span className="leaf-cluster-stem leaf-cluster-stem--left" />
      <svg className="leaf-cluster-glyph" viewBox="0 0 132 36" focusable="false">
        <g className="leaf-cluster-leaves">
          <path d="M 18 18 Q 28 6 38 14 Q 30 22 18 18 Z" />
          <path d="M 38 14 Q 46 4 58 12 Q 50 24 38 14 Z" />
          <path d="M 22 22 Q 30 32 42 26 Q 32 18 22 22 Z" />
          <path d="M 42 26 Q 52 32 60 22 Q 52 18 42 26 Z" />
          <circle cx="66" cy="18" r="1.6" />
          <path d="M 114 18 Q 104 6 94 14 Q 102 22 114 18 Z" />
          <path d="M 94 14 Q 86 4 74 12 Q 82 24 94 14 Z" />
          <path d="M 110 22 Q 102 32 90 26 Q 100 18 110 22 Z" />
          <path d="M 90 26 Q 80 32 72 22 Q 80 18 90 26 Z" />
          <line x1="42" y1="26" x2="56" y2="22" stroke="currentColor" strokeWidth="0.35" />
          <line x1="90" y1="26" x2="76" y2="22" stroke="currentColor" strokeWidth="0.35" />
        </g>
        <line x1="60" y1="18" x2="72" y2="18" stroke="currentColor" strokeWidth="0.5" />
      </svg>
      {label && <span className="leaf-cluster-label">{label}</span>}
      <span className="leaf-cluster-stem leaf-cluster-stem--right" />
    </div>
  )
}

function RectoSignOff({ visible }: { visible: boolean }) {
  return (
    <div
      className={`recto-sign-off${visible ? ' is-visible' : ''}`}
      aria-hidden="true"
    >
      <span className="recto-sign-off-rule recto-sign-off-rule--left" />
      <span className="recto-sign-off-cluster">
        <span className="recto-sign-off-mark">¶</span>
        <em className="recto-sign-off-key">end of the recto</em>
        <span className="recto-sign-off-sep">·</span>
        <em className="recto-sign-off-tail">the verso replies</em>
        <svg
          className="recto-sign-off-glyph"
          viewBox="0 0 24 12"
          focusable="false"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="recto-sign-off-gold" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#9c6e26" />
              <stop offset="50%" stopColor="#f5c65b" />
              <stop offset="100%" stopColor="#9c6e26" />
            </linearGradient>
          </defs>
          <line
            x1="0"
            y1="6"
            x2="20"
            y2="6"
            stroke="url(#recto-sign-off-gold)"
            strokeWidth="0.5"
            strokeLinecap="round"
          />
          <path
            d="M 20 3 L 24 6 L 20 9 Z"
            fill="url(#recto-sign-off-gold)"
          />
        </svg>
      </span>
      <span className="recto-sign-off-rule recto-sign-off-rule--right" />
    </div>
  )
}

function MarginaliaStrip({ items }: { items: MarginaliaItem[] }) {
  return (
    <aside className="marginalia-strip" aria-label="marginalia">
      {items.map((item, i) => (
        <span key={item.mark} className="marginalia-row">
          <span
            className={`marginalia-note marginalia-note--${i}`}
            data-gloss={item.gloss}
            tabIndex={0}
          >
            <span className="marginalia-mark" aria-hidden="true">{item.mark}</span>
            <span className="marginalia-text">{item.note}</span>
          </span>
          {i < items.length - 1 && (
            <span className="marginalia-divider" aria-hidden="true">
              ·
            </span>
          )}
        </span>
      ))}
    </aside>
  )
}

function RectoVerses() {
  return (
    <div className="recto-verses" aria-label="the question, in three voices">
      <ol className="recto-verses-list">
        <li className="recto-verse recto-verse--first" style={{ '--i': 0 } as React.CSSProperties}>
          <span className="recto-verse-numeral" aria-hidden="true">i.</span>
          <span className="recto-verse-mark" aria-hidden="true">¶</span>
          <p className="recto-verse-text">
            A small typeset test of whether a page
            can <em>ask well</em> before it answers —
          </p>
        </li>
        <li className="recto-verse" style={{ '--i': 1 } as React.CSSProperties}>
          <span className="recto-verse-numeral" aria-hidden="true">ii.</span>
          <span className="recto-verse-mark" aria-hidden="true">†</span>
          <p className="recto-verse-text">
            an <em>initial in gilt</em>, three marginalia,
            and a <em>quiet reply</em> that turns the leaf.
          </p>
        </li>
        <li className="recto-verse recto-verse--close" style={{ '--i': 2 } as React.CSSProperties}>
          <span className="recto-verse-numeral" aria-hidden="true">iii.</span>
          <span className="recto-verse-mark" aria-hidden="true">‡</span>
          <p className="recto-verse-text">
            The answer is the page itself —
            read it once, then again,
            <span className="scribal-correction" aria-hidden="true">
              <em className="scribal-correction-word">slower</em>
              <svg className="scribal-correction-mark" viewBox="0 0 60 14" focusable="false" preserveAspectRatio="none">
                <path d="M 2 11 Q 14 4 30 8 Q 46 12 58 4" stroke="currentColor" strokeWidth="0.7" fill="none" strokeLinecap="round" />
                <path d="M 56 2 L 60 6 L 54 6 Z" fill="currentColor" />
              </svg>
              <span className="scribal-correction-gloss">at your pace</span>
            </span>
            <em>this time</em>.
          </p>
        </li>
      </ol>
      <div className="recto-verses-close" aria-hidden="true">
        <span className="recto-verses-close-line" />
        <span className="recto-verses-close-mark">¶</span>
        <span className="recto-verses-close-tail">end of the question</span>
        <span className="recto-verses-close-mark recto-verses-close-mark--close">¶</span>
        <span className="recto-verses-close-line" />
      </div>
    </div>
  )
}

function SelfAnnotation({
  note,
  revealed,
}: {
  note: SelfNote
  revealed: boolean
}) {
  return (
    <span
      className={`self-annotation self-annotation--${note.id}${revealed ? ' is-revealed' : ''}`}
      style={{ top: `${note.top}%` }}
      aria-hidden="true"
    >
      <svg
        className="self-annotation-leader"
        viewBox="0 0 38 8"
        focusable="false"
        preserveAspectRatio="none"
      >
        <line x1="6" y1="4" x2="36" y2="4" stroke="currentColor" strokeWidth="0.5" strokeDasharray="1.4 2.2" />
        <path d="M 8 1 L 2 4 L 8 7 Z" fill="currentColor" />
      </svg>
      <span className="self-annotation-card">
        <em className="self-annotation-glyph">{note.glyph}</em>
        <em className="self-annotation-text">{note.text}</em>
      </span>
    </span>
  )
}

function SelfAnnotations({ currentChars }: { currentChars: number }) {
  return (
    <div className="self-annotations" aria-hidden="true">
      <span className="self-annotations-rule" />
      {ANSWER_NOTES.map((note) => (
        <SelfAnnotation
          key={note.id}
          note={note}
          revealed={currentChars >= note.targetIndex}
        />
      ))}
    </div>
  )
}

function ProofSlip({
  visible,
  slow,
  reduced,
}: {
  visible: boolean
  slow: boolean
  reduced: boolean
}) {
  return (
    <aside
      className={`proof-slip${visible ? ' is-visible' : ''}${
        slow ? ' is-slow' : ''
      }${reduced ? ' is-static' : ''}`}
      aria-label="printer's proof sheet, the answer set a second time"
    >
      <span className="proof-slip-corner proof-slip-corner--tl" aria-hidden="true">
        <AnswerPlateCorner corner="tl" />
      </span>
      <span className="proof-slip-corner proof-slip-corner--tr" aria-hidden="true">
        <AnswerPlateCorner corner="tr" />
      </span>
      <span className="proof-slip-corner proof-slip-corner--bl" aria-hidden="true">
        <AnswerPlateCorner corner="bl" />
      </span>
      <span className="proof-slip-corner proof-slip-corner--br" aria-hidden="true">
        <AnswerPlateCorner corner="br" />
      </span>

      <span className="proof-slip-rim" aria-hidden="true">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" focusable="false">
          <defs>
            <linearGradient id="proof-slip-ink" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(58, 40, 22, 0.92)" />
              <stop offset="100%" stopColor="rgba(28, 30, 26, 0.82)" />
            </linearGradient>
            <linearGradient id="proof-slip-gold" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#9c6e26" />
              <stop offset="50%" stopColor="#f5c65b" />
              <stop offset="100%" stopColor="#9c6e26" />
            </linearGradient>
          </defs>
          <rect
            x="0.6"
            y="0.6"
            width="98.8"
            height="98.8"
            rx="0.4"
            fill="none"
            stroke="url(#proof-slip-ink)"
            strokeWidth="0.45"
          />
          <rect
            x="3.2"
            y="3.2"
            width="93.6"
            height="93.6"
            rx="0.2"
            fill="none"
            stroke="url(#proof-slip-ink)"
            strokeWidth="0.18"
            strokeDasharray="0.7 1.3"
            opacity="0.55"
          />
          <g className="proof-slip-rim-title">
            <line x1="32" y1="3.6" x2="68" y2="3.6" stroke="url(#proof-slip-ink)" strokeWidth="0.4" />
            <line x1="32" y1="8.6" x2="68" y2="8.6" stroke="url(#proof-slip-ink)" strokeWidth="0.4" />
            <text x="50" y="7.0" textAnchor="middle" className="proof-slip-rim-title-text">
              PROOF SHEET
            </text>
          </g>
          <g className="proof-slip-rim-foot">
            <line x1="30" y1="93.2" x2="46" y2="93.2" stroke="url(#proof-slip-gold)" strokeWidth="0.32" />
            <line x1="54" y1="93.2" x2="70" y2="93.2" stroke="url(#proof-slip-gold)" strokeWidth="0.32" />
            <text x="50" y="94.4" textAnchor="middle" className="proof-slip-rim-foot-text">
              second reading
            </text>
          </g>
          <line x1="50" y1="3" x2="50" y2="5" stroke="url(#proof-slip-ink)" strokeWidth="0.3" opacity="0.55" />
          <line x1="50" y1="95" x2="50" y2="97" stroke="url(#proof-slip-ink)" strokeWidth="0.3" opacity="0.55" />
        </svg>
      </span>

      <header className="proof-slip-head">
        <span className="proof-slip-head-rule proof-slip-head-rule--left" />
        <span className="proof-slip-head-cluster">
          <span className="proof-slip-head-mark" aria-hidden="true">
            <svg viewBox="0 0 14 14" focusable="false">
              <circle cx="7" cy="7" r="5.6" fill="none" stroke="currentColor" strokeWidth="0.5" />
              <path d="M 7 3 L 9 7 L 7 11 L 5 7 Z" fill="currentColor" fillOpacity="0.78" />
              <circle cx="7" cy="7" r="0.9" fill="var(--paper)" />
            </svg>
          </span>
          <em className="proof-slip-head-key">the proof sheet</em>
          <span className="proof-slip-head-sep" aria-hidden="true">·</span>
          <em className="proof-slip-head-tail">a galley proof of the answer</em>
        </span>
        <span className="proof-slip-head-rule proof-slip-head-rule--right" />
      </header>

      <div className="proof-slip-stage">
        <span className="proof-slip-margin proof-slip-margin--left" aria-hidden="true">
          <span className="proof-slip-margin-rule" />
          <span className="proof-slip-margin-numeral">a</span>
        </span>

        <div className="proof-slip-copy-wrap">
          <p className="proof-slip-copy">
            <span className="proof-slip-dash" aria-hidden="true">— </span>
            <span className="proof-slip-word">and</span>
            {' '}
            <span className="proof-slip-word">the</span>
            {' '}
            <span className="proof-slip-word">page</span>
            {' '}
            <span className="proof-slip-word proof-slip-word--caret">
              <span className="proof-slip-word-text">itself</span>
              <span className="proof-slip-mark proof-slip-mark--caret" aria-hidden="true">
                <svg className="proof-slip-mark-symbol" viewBox="0 0 24 10" focusable="false" preserveAspectRatio="none">
                  <path d="M 2 8 Q 12 2 22 8" stroke="currentColor" strokeWidth="0.7" fill="none" strokeLinecap="round" />
                </svg>
                <span className="proof-slip-mark-tail">still</span>
              </span>
            </span>
            <span className="proof-slip-sep">,</span>
            {' '}
            <span className="proof-slip-word proof-slip-word--struck">
              <span className="proof-slip-word-text">which you are reading</span>
              <span className="proof-slip-mark proof-slip-mark--strike" aria-hidden="true">
                <span className="proof-slip-mark-tail">the attentive reader</span>
              </span>
            </span>
            {' '}
            <span className="proof-slip-word proof-slip-word--em">
              <span className="proof-slip-word-text">now</span>
              <span className="proof-slip-mark proof-slip-mark--margin" aria-hidden="true">
                <span className="proof-slip-mark-tail">at your pace</span>
              </span>
            </span>
            <span className="proof-slip-sep">.</span>
          </p>

          <span className="proof-slip-line proof-slip-line--one" aria-hidden="true">
            <span className="proof-slip-line-rule" />
            <span className="proof-slip-line-tag">a · caret</span>
          </span>
          <span className="proof-slip-line proof-slip-line--two" aria-hidden="true">
            <span className="proof-slip-line-rule" />
            <span className="proof-slip-line-tag">b · struck</span>
          </span>
          <span className="proof-slip-line proof-slip-line--three" aria-hidden="true">
            <span className="proof-slip-line-rule" />
            <span className="proof-slip-line-tag">c · margin</span>
          </span>
        </div>

        <span className="proof-slip-margin proof-slip-margin--right" aria-hidden="true">
          <span className="proof-slip-margin-rule" />
          <span className="proof-slip-margin-numeral">b</span>
        </span>
      </div>

      <footer className="proof-slip-foot">
        <span className="proof-slip-foot-rule proof-slip-foot-rule--left" />
        <span className="proof-slip-foot-cluster">
          <span className="proof-slip-foot-mark" aria-hidden="true">¶</span>
          <em className="proof-slip-foot-key">pressed again</em>
          <span className="proof-slip-foot-sep" aria-hidden="true">·</span>
          <em className="proof-slip-foot-tail">read again, slower</em>
          <svg
            className="proof-slip-foot-fleuron"
            viewBox="0 0 24 12"
            focusable="false"
            aria-hidden="true"
          >
            <path
              d="M 4 6 Q 8 2 12 6 Q 16 10 20 6"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
              strokeLinecap="round"
            />
            <circle cx="12" cy="6" r="0.8" fill="currentColor" />
          </svg>
        </span>
        <span className="proof-slip-foot-rule proof-slip-foot-rule--right" />
      </footer>
    </aside>
  )
}

function BookmarkRibbon() {
  return (
    <svg
      className="bookmark-ribbon"
      viewBox="0 0 32 400"
      preserveAspectRatio="none"
      focusable="false"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="ribbon-front" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#7a1a0e" />
          <stop offset="22%" stopColor="#b8301f" />
          <stop offset="50%" stopColor="#dc4a30" />
          <stop offset="78%" stopColor="#b8301f" />
          <stop offset="100%" stopColor="#7a1a0e" />
        </linearGradient>
        <linearGradient id="ribbon-fold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5a1408" />
          <stop offset="100%" stopColor="#7a1a0e" />
        </linearGradient>
        <pattern id="ribbon-weave" width="2.4" height="4" patternUnits="userSpaceOnUse">
          <line x1="0" y1="0" x2="0" y2="4" stroke="rgba(255, 220, 200, 0.1)" strokeWidth="0.4" />
          <line x1="1.2" y1="0" x2="1.2" y2="4" stroke="rgba(40, 8, 4, 0.18)" strokeWidth="0.35" />
        </pattern>
      </defs>
      <path
        d="M 2 0 L 30 0 L 30 16 Q 28 19 26 17 L 16 23 L 6 17 Q 4 19 2 16 Z"
        fill="url(#ribbon-fold)"
      />
      <path
        d="M 2 16 L 30 16 L 30 360 L 16 388 L 2 360 Z"
        fill="url(#ribbon-front)"
      />
      <path
        d="M 2 16 L 30 16 L 30 360 L 16 388 L 2 360 Z"
        fill="url(#ribbon-weave)"
      />
      <line
        x1="16"
        y1="18"
        x2="16"
        y2="358"
        stroke="rgba(50, 8, 4, 0.42)"
        strokeWidth="0.5"
      />
      <path
        d="M 7 18 Q 7 188 7 358"
        fill="none"
        stroke="rgba(255, 220, 200, 0.22)"
        strokeWidth="0.7"
      />
      <path
        d="M 25 18 Q 25 188 25 358"
        fill="none"
        stroke="rgba(40, 8, 4, 0.22)"
        strokeWidth="0.7"
      />
      <path
        d="M 12 22 Q 12 188 12 354"
        fill="none"
        stroke="rgba(255, 230, 210, 0.12)"
        strokeWidth="0.4"
      />
      <g transform="translate(16 200) rotate(-90)" opacity="0.55">
        <text
          x="0"
          y="0"
          textAnchor="middle"
          fontFamily="serif"
          fontStyle="italic"
          fontSize="6"
          fill="rgba(255, 220, 200, 0.7)"
        >
          m · iii
        </text>
      </g>
    </svg>
  )
}

function Manicule() {
  return (
    <svg
      className="manicule"
      viewBox="0 0 64 26"
      focusable="false"
      aria-hidden="true"
    >
      <g fill="currentColor">
        <path d="M 0 8 Q 2 5 4 8 L 6 7 Q 8 5 10 8 L 12 7 Q 14 5 16 8 L 18 10 L 18 16 L 16 18 L 12 21 Q 10 19 8 21 L 6 19 Q 4 21 2 18 L 0 20 Z" />
        <path d="M 18 10 Q 22 9 26 12 L 26 14 Q 22 17 18 16 Z" />
        <path d="M 26 12 L 60 12 Q 62 12 62 13 Q 62 14 60 14 L 26 14 Z" />
        <path
          d="M 3 11 L 15 12"
          stroke="rgba(255, 250, 240, 0.55)"
          strokeWidth="0.5"
          fill="none"
        />
        <path
          d="M 4 14 L 16 15"
          stroke="rgba(255, 250, 240, 0.42)"
          strokeWidth="0.5"
          fill="none"
        />
        <path
          d="M 3 17 L 15 18"
          stroke="rgba(255, 250, 240, 0.3)"
          strokeWidth="0.5"
          fill="none"
        />
      </g>
    </svg>
  )
}

/* ──────────────────────────────────────────────────────────────────────
   iteration 142 · the verso earns a second reader's margin

   A small manuscript slip sits beneath the reply, as if a later reader
   had set their own italic note into the margin of the original press
   run. It is set in coral ink — the page's accent colour — and bears a
   "manu altera" mark, a short leader that points back to the reply, and
   a signature that names the hand as a second reader. The slip arrives
   with the reply and reads as a printerly coda: the page is its own
   proof; the reader only returns.
   ────────────────────────────────────────────────────────────────────── */

function ScholarEndnote({
  visible,
  reduced,
}: {
  visible: boolean
  reduced: boolean
}) {
  return (
    <aside
      className={`scholar-endnote${visible ? ' is-visible' : ''}${
        reduced ? ' is-static' : ''
      }`}
      aria-label="a later reader's note, set in the margin"
    >
      <span className="scholar-endnote-leader" aria-hidden="true">
        <svg viewBox="0 0 42 14" focusable="false" preserveAspectRatio="none">
          <line
            x1="1"
            y1="7"
            x2="36"
            y2="7"
            stroke="currentColor"
            strokeWidth="0.45"
            strokeDasharray="0.7 1.4"
          />
          <path d="M 34 3 L 40 7 L 34 11 Z" fill="currentColor" />
        </svg>
      </span>
      <div className="scholar-endnote-slip">
        <span className="scholar-endnote-mark" aria-hidden="true">
          <svg viewBox="0 0 28 28" focusable="false">
            <circle
              cx="14"
              cy="14"
              r="12.4"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
              strokeDasharray="0.5 1.2"
              opacity="0.55"
            />
            <circle
              cx="14"
              cy="14"
              r="7.6"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.55"
            />
            <text
              x="14"
              y="17.4"
              textAnchor="middle"
              className="scholar-endnote-mark-letter"
            >
              m
            </text>
            <text
              x="14"
              y="22.6"
              textAnchor="middle"
              className="scholar-endnote-mark-roman"
            >
              ·ii
            </text>
          </svg>
        </span>
        <div className="scholar-endnote-body">
          <p className="scholar-endnote-text">
            <em className="scholar-endnote-text-key">the press is set</em>
            <span className="scholar-endnote-text-sep" aria-hidden="true">;</span>
            {' '}the page itself, by being,
            <em className="scholar-endnote-text-emph">is the answer.</em>
          </p>
          <p className="scholar-endnote-signature">
            <span className="scholar-endnote-sig-mark" aria-hidden="true">¶</span>
            <em className="scholar-endnote-sig-key">manu altera</em>
            <span className="scholar-endnote-sig-sep" aria-hidden="true">·</span>
            <em className="scholar-endnote-sig-tail">
              a later reading, in this folio
            </em>
            <span className="scholar-endnote-sig-tick" aria-hidden="true">
              <svg viewBox="0 0 14 8" focusable="false">
                <path
                  d="M 1 4 Q 4 1 7 4 Q 10 7 13 3"
                  stroke="currentColor"
                  strokeWidth="0.5"
                  fill="none"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </p>
        </div>
      </div>
    </aside>
  )
}

function Fleuron() {
  return (
    <div className="fleuron" aria-hidden="true">
      <svg viewBox="0 0 220 220" focusable="false">
        <g className="fleuron-rings">
          <circle cx="110" cy="110" r="103" fill="none" stroke="currentColor" strokeWidth="0.6" />
          <circle
            cx="110"
            cy="110"
            r="94"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.4"
            strokeDasharray="0.6 2.2"
            opacity="0.7"
          />
        </g>
        <g className="fleuron-major" fill="currentColor">
          <path d="M 110 22 Q 134 70 110 110 Q 86 70 110 22 Z" />
          <path d="M 110 198 Q 86 150 110 110 Q 134 150 110 198 Z" />
          <path d="M 198 110 Q 150 86 110 110 Q 150 134 198 110 Z" />
          <path d="M 22 110 Q 70 134 110 110 Q 70 86 22 110 Z" />
        </g>
        <g className="fleuron-accent" fill="currentColor" opacity="0.78">
          <g transform="translate(110 110) rotate(45)">
            <path d="M 0 -88 Q 11 -64 0 -40 Q -11 -64 0 -88 Z" />
            <path d="M 0 88 Q -11 64 0 40 Q 11 64 0 88 Z" />
            <path d="M 88 0 Q 64 11 40 0 Q 64 -11 88 0 Z" />
            <path d="M -88 0 Q -64 -11 -40 0 Q -64 11 -88 0 Z" />
          </g>
        </g>
        <g className="fleuron-petals" fill="currentColor">
          <circle cx="110" cy="42" r="0.9" opacity="0.6" />
          <circle cx="178" cy="110" r="0.9" opacity="0.6" />
          <circle cx="110" cy="178" r="0.9" opacity="0.6" />
          <circle cx="42" cy="110" r="0.9" opacity="0.6" />
        </g>
        <g className="fleuron-core" fill="currentColor" transform="translate(110 110)">
          <ellipse cx="0" cy="-13" rx="4" ry="8" />
          <ellipse cx="12.4" cy="-4" rx="4" ry="8" transform="rotate(72 12.4 -4)" />
          <ellipse cx="7.7" cy="10.6" rx="4" ry="8" transform="rotate(144 7.7 10.6)" />
          <ellipse cx="-7.7" cy="10.6" rx="4" ry="8" transform="rotate(216 -7.7 10.6)" />
          <ellipse cx="-12.4" cy="-4" rx="4" ry="8" transform="rotate(288 -12.4 -4)" />
          <circle r="2.6" />
          <circle r="1" fill="#f3eadb" />
        </g>
      </svg>
    </div>
  )
}

function SiderealPocket({
  visible,
  reduced,
}: {
  visible: boolean
  reduced: boolean
}) {
  return (
    <div
      className={`sidereal-pocket${visible ? ' is-visible' : ''}`}
      aria-hidden="true"
    >
      <svg className="sidereal-pocket-dial" viewBox="0 0 90 90" focusable="false">
        <defs>
          <radialGradient id="sky-face" cx="50%" cy="42%" r="68%">
            <stop offset="0%" stopColor="rgba(46, 62, 102, 0.55)" />
            <stop offset="62%" stopColor="rgba(22, 30, 52, 0.45)" />
            <stop offset="100%" stopColor="rgba(12, 16, 30, 0.18)" />
          </radialGradient>
        </defs>
        <circle
          cx="45"
          cy="45"
          r="42"
          fill="url(#sky-face)"
          stroke="rgba(214, 168, 73, 0.5)"
          strokeWidth="0.5"
        />
        <circle
          cx="45"
          cy="45"
          r="36"
          fill="none"
          stroke="rgba(214, 168, 73, 0.22)"
          strokeWidth="0.3"
          strokeDasharray="0.4 1.6"
        />
        <circle
          cx="45"
          cy="45"
          r="30"
          fill="none"
          stroke="rgba(214, 168, 73, 0.16)"
          strokeWidth="0.25"
        />
        <g
          className="sky-rotation"
          style={reduced ? undefined : { transformOrigin: '45px 45px' }}
        >
          <g
            className="sky-constellation"
            stroke="rgba(245, 198, 91, 0.42)"
            strokeWidth="0.4"
            fill="none"
            strokeLinecap="round"
          >
            <line x1="63" y1="38" x2="51" y2="32" />
            <line x1="51" y1="32" x2="43" y2="38" />
            <line x1="43" y1="38" x2="33" y2="51" />
            <line x1="33" y1="51" x2="25" y2="59" />
            <line x1="25" y1="59" x2="37" y2="61" />
            <line x1="37" y1="61" x2="33" y2="51" />
          </g>
          <g className="stars-major">
            <circle cx="63" cy="38" r="1.4" fill="#fff8e0" />
            <circle cx="25" cy="59" r="1.2" fill="#fff8e0" />
            <circle cx="33" cy="51" r="1.05" fill="#fff8e0" />
          </g>
          <g className="stars-mid">
            <circle cx="51" cy="32" r="0.85" fill="#fff8e0" />
            <circle cx="43" cy="38" r="0.8" fill="#fff8e0" />
            <circle cx="37" cy="61" r="0.8" fill="#fff8e0" />
          </g>
          <g className="stars-faint">
            <circle cx="18" cy="22" r="0.4" fill="#fff8e0" />
            <circle cx="22" cy="42" r="0.4" fill="#fff8e0" />
            <circle cx="58" cy="68" r="0.4" fill="#fff8e0" />
            <circle cx="71" cy="24" r="0.45" fill="#fff8e0" />
            <circle cx="74" cy="48" r="0.4" fill="#fff8e0" />
            <circle cx="14" cy="68" r="0.4" fill="#fff8e0" />
            <circle cx="29" cy="14" r="0.35" fill="#fff8e0" />
            <circle cx="66" cy="62" r="0.35" fill="#fff8e0" />
            <circle cx="50" cy="71" r="0.35" fill="#fff8e0" />
            <circle cx="20" cy="50" r="0.32" fill="#fff8e0" />
            <circle cx="76" cy="60" r="0.32" fill="#fff8e0" />
            <circle cx="40" cy="76" r="0.3" fill="#fff8e0" />
          </g>
          <g className="polaris-halo">
            <circle cx="63" cy="38" r="4.2" fill="rgba(245, 198, 91, 0.18)" />
            <circle cx="63" cy="38" r="3" fill="rgba(245, 198, 91, 0.32)" />
            <circle cx="63" cy="38" r="1.6" fill="rgba(255, 248, 224, 0.92)" />
          </g>
        </g>
        <g className="sky-horizon">
          <path
            d="M 8 70 Q 45 76 82 70"
            fill="none"
            stroke="rgba(214, 168, 73, 0.5)"
            strokeWidth="0.4"
            strokeLinecap="round"
          />
          <path
            d="M 14 73 Q 45 78 76 73"
            fill="none"
            stroke="rgba(214, 168, 73, 0.3)"
            strokeWidth="0.25"
          />
        </g>
      </svg>
      <span className="sidereal-pocket-label">this sky</span>
      <span className="sidereal-pocket-sub">polaris · ur · minor</span>
    </div>
  )
}

function MoonPhase({
  phase,
  visible,
}: {
  phase: number
  visible: boolean
}) {
  const cx = 35
  const cy = 35
  const r = 28
  const litPath = moonTerminatorPath(phase, cx, cy, r)
  const name = moonPhaseName(phase)
  const illumination = Math.round((1 - Math.cos(phase * 2 * Math.PI)) * 50)

  return (
    <div
      className={`moon-phase${visible ? ' is-visible' : ''}`}
      aria-hidden="true"
    >
      <svg className="moon-phase-dial" viewBox="0 0 70 70" focusable="false">
        <defs>
          <radialGradient id="moon-disk" cx="38%" cy="34%" r="80%">
            <stop offset="0%" stopColor="rgba(255, 246, 218, 0.96)" />
            <stop offset="62%" stopColor="rgba(238, 220, 178, 0.86)" />
            <stop offset="100%" stopColor="rgba(196, 162, 110, 0.62)" />
          </radialGradient>
          <radialGradient id="moon-shadow" cx="60%" cy="60%" r="80%">
            <stop offset="0%" stopColor="rgba(28, 36, 48, 0.78)" />
            <stop offset="68%" stopColor="rgba(14, 22, 32, 0.92)" />
            <stop offset="100%" stopColor="rgba(6, 12, 22, 0.96)" />
          </radialGradient>
          <pattern id="moon-craters" width="6" height="6" patternUnits="userSpaceOnUse">
            <circle cx="1.6" cy="1.4" r="0.6" fill="rgba(154, 122, 70, 0.18)" />
            <circle cx="4.2" cy="3.6" r="0.4" fill="rgba(154, 122, 70, 0.14)" />
          </pattern>
        </defs>

        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="url(#moon-shadow)"
        />
        <path
          d={litPath}
          fill="url(#moon-disk)"
        />
        <path
          d={litPath}
          fill="url(#moon-craters)"
          opacity="0.55"
        />
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="rgba(214, 168, 73, 0.5)"
          strokeWidth="0.4"
          strokeDasharray="0.6 1.6"
        />
        <circle
          cx={cx}
          cy={cy - r - 3}
          r="0.55"
          fill="rgba(214, 168, 73, 0.7)"
        />
        <circle
          cx={cx - r + 2}
          cy={cy}
          r="0.4"
          fill="rgba(214, 168, 73, 0.45)"
        />
        <circle
          cx={cx + r - 2}
          cy={cy}
          r="0.4"
          fill="rgba(214, 168, 73, 0.45)"
        />
      </svg>
      <span className="moon-phase-label">this moon</span>
      <span className="moon-phase-sub">
        <em>{name}</em>
        <span className="moon-phase-pct" aria-hidden="true">
          {illumination}%
        </span>
      </span>
    </div>
  )
}

function MoonPip({ phase, visible }: { phase: number; visible: boolean }) {
  const cx = 24
  const cy = 24
  const r = 18
  const litPath = moonTerminatorPath(phase, cx, cy, r)
  const name = moonPhaseName(phase)
  const illumination = Math.round((1 - Math.cos(phase * 2 * Math.PI)) * 50)

  return (
    <figure
      className={`moon-pip${visible ? ' is-visible' : ''}`}
      aria-hidden="true"
    >
      <svg className="moon-pip-disc" viewBox="0 0 48 48" focusable="false" overflow="visible">
        <defs>
          <radialGradient id="moon-pip-face" cx="50%" cy="34%" r="64%">
            <stop offset="0%" stopColor="rgba(255, 248, 230, 0.96)" />
            <stop offset="62%" stopColor="rgba(245, 220, 168, 0.84)" />
            <stop offset="100%" stopColor="rgba(214, 178, 116, 0.6)" />
          </radialGradient>
          <radialGradient id="moon-pip-shadow" cx="60%" cy="60%" r="80%">
            <stop offset="0%" stopColor="rgba(28, 36, 48, 0.78)" />
            <stop offset="68%" stopColor="rgba(14, 22, 32, 0.92)" />
            <stop offset="100%" stopColor="rgba(6, 12, 22, 0.96)" />
          </radialGradient>
          <linearGradient id="moon-pip-gold" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f6d076" />
            <stop offset="48%" stopColor="#c8923e" />
            <stop offset="100%" stopColor="#9c6e26" />
          </linearGradient>
          <pattern id="moon-pip-grain" width="3" height="3" patternUnits="userSpaceOnUse">
            <circle cx="0.6" cy="0.4" r="0.3" fill="rgba(107, 74, 37, 0.05)" />
            <circle cx="2.2" cy="1.6" r="0.22" fill="rgba(107, 74, 37, 0.04)" />
          </pattern>
        </defs>

        <ellipse
          cx="24"
          cy="24"
          rx="22"
          ry="22"
          fill="rgba(245, 198, 91, 0.08)"
          className="moon-pip-halo"
        />

        <circle cx="24" cy="24" r="22" fill="url(#moon-pip-face)" />
        <circle cx="24" cy="24" r="22" fill="url(#moon-pip-grain)" opacity="0.6" />
        <circle
          cx="24"
          cy="24"
          r="22"
          fill="none"
          stroke="url(#moon-pip-gold)"
          strokeWidth="0.6"
        />
        <circle
          cx="24"
          cy="24"
          r="20"
          fill="none"
          stroke="url(#moon-pip-gold)"
          strokeWidth="0.25"
          strokeDasharray="0.4 1.4"
          opacity="0.78"
        />

        <circle cx="24" cy="24" r="18" fill="url(#moon-pip-shadow)" />
        <path d={litPath} fill="rgba(255, 246, 218, 0.94)" />
        <path
          d={litPath}
          fill="rgba(154, 122, 70, 0.18)"
          opacity="0.55"
        />
        <circle
          cx="24"
          cy="24"
          r="18"
          fill="none"
          stroke="rgba(214, 168, 73, 0.42)"
          strokeWidth="0.3"
          strokeDasharray="0.4 1.4"
        />

        <g fill="url(#moon-pip-gold)">
          <circle cx="24" cy="2.4" r="0.5" />
          <circle cx="24" cy="45.6" r="0.5" />
          <circle cx="2.4" cy="24" r="0.4" />
          <circle cx="45.6" cy="24" r="0.4" />
        </g>

        <g
          className="moon-pip-stamen"
          stroke="rgba(140, 82, 28, 0.4)"
          strokeWidth="0.25"
          fill="none"
          strokeLinecap="round"
        >
          <path d="M 22 10 Q 22 16 24 20" />
          <path d="M 26 10 Q 26 16 24 20" />
        </g>

        <path
          className="moon-pip-thread"
          d="M 24 0 Q 24 -6 22 -8"
          stroke="rgba(167, 60, 44, 0.5)"
          strokeWidth="0.45"
          fill="none"
          strokeLinecap="round"
          strokeDasharray="0.6 1.2"
        />
      </svg>
      <figcaption className="moon-pip-cap">
        <span className="moon-pip-cap-mark" aria-hidden="true">¶</span>
        <em className="moon-pip-cap-key">this moon</em>
        <span className="moon-pip-cap-sep" aria-hidden="true">·</span>
        <em className="moon-pip-cap-name">{name}</em>
        <span className="moon-pip-cap-pct" aria-hidden="true">
          {illumination}%
        </span>
      </figcaption>
    </figure>
  )
}

function Inkwell({ active }: { active: boolean }) {
  return (
    <div className={`inkwell${active ? ' is-active' : ''}`} aria-hidden="true">
      <svg viewBox="0 0 80 36" focusable="false">
        <defs>
          <linearGradient id="ink-pot" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(36, 32, 22, 0.92)" />
            <stop offset="55%" stopColor="rgba(24, 18, 12, 0.95)" />
            <stop offset="100%" stopColor="rgba(8, 6, 4, 0.96)" />
          </linearGradient>
          <radialGradient id="ink-pool" cx="50%" cy="42%" r="60%">
            <stop offset="0%" stopColor="rgba(20, 14, 8, 0.85)" />
            <stop offset="70%" stopColor="rgba(12, 8, 4, 0.95)" />
            <stop offset="100%" stopColor="rgba(4, 2, 1, 1)" />
          </radialGradient>
          <radialGradient id="ink-sheen" cx="50%" cy="35%" r="35%">
            <stop offset="0%" stopColor="rgba(255, 220, 180, 0.42)" />
            <stop offset="100%" stopColor="rgba(255, 220, 180, 0)" />
          </radialGradient>
        </defs>
        <ellipse cx="40" cy="33" rx="32" ry="2.4" fill="rgba(40, 12, 6, 0.18)" />
        <path
          d="M 14 16 L 12 26 Q 12 32 20 33 L 60 33 Q 68 32 68 26 L 66 16 Z"
          fill="url(#ink-pot)"
          stroke="rgba(20, 14, 8, 0.7)"
          strokeWidth="0.5"
        />
        <ellipse cx="40" cy="16" rx="26" ry="3.4" fill="url(#ink-pool)" />
        <ellipse cx="40" cy="15.4" rx="20" ry="2.2" fill="url(#ink-sheen)" />
        <path
          d="M 10 18 L 14 16 L 16 18"
          fill="none"
          stroke="rgba(20, 14, 8, 0.55)"
          strokeWidth="0.5"
          strokeLinecap="round"
        />
        <path
          d="M 70 18 L 66 16 L 64 18"
          fill="none"
          stroke="rgba(20, 14, 8, 0.55)"
          strokeWidth="0.5"
          strokeLinecap="round"
        />
        <line
          x1="22"
          y1="28"
          x2="58"
          y2="28"
          stroke="rgba(245, 198, 91, 0.16)"
          strokeWidth="0.4"
          strokeLinecap="round"
        />
      </svg>
      <span className="inkwell-vapor" aria-hidden="true" />
    </div>
  )
}

function EngravedRule({ className }: { className?: string }) {
  return (
    <div
      className={`engraved-rule ${className ?? ''}`}
      role="separator"
      aria-hidden="true"
    >
      <svg viewBox="0 0 220 12" focusable="false">
        <line x1="0" y1="6" x2="220" y2="6" stroke="currentColor" strokeWidth="0.5" />
        <line
          x1="0"
          y1="4"
          x2="220"
          y2="4"
          stroke="currentColor"
          strokeWidth="0.2"
          strokeDasharray="0.6 1.4"
          opacity="0.6"
        />
        <g stroke="currentColor" strokeWidth="0.55" strokeLinecap="round">
          <line x1="0" y1="3" x2="0" y2="9" />
          <line x1="20" y1="4.5" x2="20" y2="7.5" />
          <line x1="40" y1="3.5" x2="40" y2="8.5" />
          <line x1="60" y1="4.5" x2="60" y2="7.5" />
          <line x1="80" y1="3.5" x2="80" y2="8.5" />
          <line x1="100" y1="4.5" x2="100" y2="7.5" />
          <line x1="110" y1="2" x2="110" y2="10" />
          <line x1="120" y1="4.5" x2="120" y2="7.5" />
          <line x1="140" y1="3.5" x2="140" y2="8.5" />
          <line x1="160" y1="4.5" x2="160" y2="7.5" />
          <line x1="180" y1="3.5" x2="180" y2="8.5" />
          <line x1="200" y1="4.5" x2="200" y2="7.5" />
          <line x1="220" y1="3" x2="220" y2="9" />
        </g>
        <g fill="currentColor">
          <circle cx="50" cy="6" r="0.6" />
          <circle cx="110" cy="6" r="0.85" />
          <circle cx="170" cy="6" r="0.6" />
        </g>
      </svg>
    </div>
  )
}

function LeafHourDial({
  hours,
  minutes,
  seconds,
  visible,
}: {
  hours: number
  minutes: number
  seconds: number
  visible: boolean
}) {
  const secondColor = 'rgba(235, 91, 72, 0.92)'
  const hourAngle = (hours % 12) * 30 + minutes * 0.5
  const minuteAngle = minutes * 6 + seconds * 0.1
  const secondAngle = seconds * 6

  const hourText = String(hours).padStart(2, '0')
  const minText = String(minutes).padStart(2, '0')

  return (
    <div
      className={`leaf-hour${visible ? ' is-visible' : ''}`}
      aria-hidden="true"
    >
      <svg className="leaf-hour-dial" viewBox="0 0 70 70" focusable="false">
        <defs>
          <radialGradient id="dial-face" cx="50%" cy="38%" r="72%">
            <stop offset="0%" stopColor="rgba(255, 248, 234, 0.95)" />
            <stop offset="78%" stopColor="rgba(245, 232, 200, 0.78)" />
            <stop offset="100%" stopColor="rgba(232, 216, 178, 0.62)" />
          </radialGradient>
        </defs>
        <circle cx="35" cy="35" r="33" fill="url(#dial-face)" stroke="rgba(107, 74, 37, 0.68)" strokeWidth="0.8" />
        <circle
          cx="35"
          cy="35"
          r="30"
          fill="none"
          stroke="rgba(107, 74, 37, 0.34)"
          strokeWidth="0.4"
          strokeDasharray="0.4 1.4"
        />
        <g className="dial-hour-ticks" stroke="rgba(28, 39, 64, 0.7)" strokeWidth="1" strokeLinecap="round">
          <line x1="35" y1="6" x2="35" y2="10" />
          <line x1="35" y1="60" x2="35" y2="64" />
          <line x1="6" y1="35" x2="10" y2="35" />
          <line x1="60" y1="35" x2="64" y2="35" />
        </g>
        <g className="dial-tick-minor" stroke="rgba(28, 39, 64, 0.4)" strokeWidth="0.5" strokeLinecap="round">
          <line x1="50.4" y1="13.1" x2="49.1" y2="14.4" />
          <line x1="56.9" y1="19.6" x2="55.6" y2="20.9" />
          <line x1="56.9" y1="50.4" x2="55.6" y2="49.1" />
          <line x1="50.4" y1="56.9" x2="49.1" y2="55.6" />
          <line x1="19.6" y1="56.9" x2="20.9" y2="55.6" />
          <line x1="13.1" y1="50.4" x2="14.4" y2="49.1" />
          <line x1="13.1" y1="19.6" x2="14.4" y2="20.9" />
          <line x1="19.6" y1="13.1" x2="20.9" y2="14.4" />
        </g>
        <g className="dial-numerals">
          <text x="35" y="19" textAnchor="middle">12</text>
          <text x="52" y="38" textAnchor="middle">3</text>
          <text x="35" y="56" textAnchor="middle">6</text>
          <text x="18" y="38" textAnchor="middle">9</text>
        </g>
        <g transform={`rotate(${hourAngle} 35 35)`}>
          <line x1="35" y1="35" x2="35" y2="17" stroke="rgba(28, 39, 64, 0.85)" strokeWidth="1.8" strokeLinecap="round" />
        </g>
        <g transform={`rotate(${minuteAngle} 35 35)`}>
          <line x1="35" y1="35" x2="35" y2="13" stroke="rgba(28, 39, 64, 0.95)" strokeWidth="1.0" strokeLinecap="round" />
        </g>
        <g transform={`rotate(${secondAngle} 35 35)`} className="dial-second">
          <line x1="35" y1="36" x2="35" y2="10" stroke={secondColor} strokeWidth="0.8" strokeLinecap="round" />
          <circle cx="35" cy="10" r="1" fill={secondColor} />
          <line x1="35" y1="36" x2="35" y2="44" stroke={secondColor} strokeWidth="0.6" strokeLinecap="round" />
        </g>
        <circle cx="35" cy="35" r="1.6" fill="rgba(28, 39, 64, 0.92)" />
        <circle cx="35" cy="35" r="0.6" fill={secondColor} />
      </svg>
      <span className="leaf-hour-label">this hour</span>
      <span className="leaf-hour-readout">{hourText}:{minText}</span>
    </div>
  )
}

function ScribalQuill({ active, progress }: { active: boolean; progress: number }) {
  const tilt = active ? Math.sin(progress * 0.42) * 4 + Math.sin(progress * 0.18) * 1.4 : 0
  const xShift = active ? Math.sin(progress * 0.34) * 1.6 : 0
  const yShift = active ? Math.sin(progress * 0.58) * 0.9 : 0

  return (
    <div
      className={`scribal-quill${active ? ' is-active' : ''}`}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 110 36"
        focusable="false"
        style={
          active
            ? {
                transform: `translate(${xShift}px, ${yShift}px) rotate(${tilt}deg)`,
              }
            : undefined
        }
      >
        <defs>
          <linearGradient id="quill-shaft" x1="0" y1="0" x2="1" y2="0.1">
            <stop offset="0%" stopColor="rgba(60, 30, 8, 0.55)" />
            <stop offset="55%" stopColor="rgba(86, 56, 28, 0.85)" />
            <stop offset="100%" stopColor="rgba(40, 22, 8, 0.92)" />
          </linearGradient>
          <linearGradient id="quill-feather-fill" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(70, 42, 18, 0.42)" />
            <stop offset="50%" stopColor="rgba(138, 90, 50, 0.78)" />
            <stop offset="100%" stopColor="rgba(190, 150, 100, 0.88)" />
          </linearGradient>
        </defs>
        <g className="quill-feather">
          <path
            d="M 6 32 Q 12 4 32 6 Q 34 16 26 26 Q 18 32 10 32 Z"
            fill="url(#quill-feather-fill)"
          />
          <path
            d="M 8 30 Q 12 10 28 8"
            stroke="rgba(255, 240, 220, 0.35)"
            strokeWidth="0.4"
            fill="none"
          />
          <path
            d="M 12 27 Q 16 14 30 12"
            stroke="rgba(255, 240, 220, 0.22)"
            strokeWidth="0.4"
            fill="none"
          />
          <path
            d="M 16 24 Q 20 18 30 16"
            stroke="rgba(255, 240, 220, 0.14)"
            strokeWidth="0.4"
            fill="none"
          />
        </g>
        <g className="quill-shaft">
          <line
            x1="30"
            y1="6"
            x2="86"
            y2="2"
            stroke="url(#quill-shaft)"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </g>
        <g className="quill-nib">
          <path d="M 86 2 L 102 -1 L 104 2 L 100 5 Z" fill="#2a1106" />
          <path d="M 102 -1 L 104 2 L 100 5 Z" fill="#0d0502" />
          <line x1="90" y1="1.4" x2="104" y2="2" stroke="rgba(255, 240, 220, 0.45)" strokeWidth="0.3" />
          <ellipse cx="100" cy="2" rx="0.7" ry="0.5" fill="rgba(0, 0, 0, 0.7)" />
        </g>
      </svg>
    </div>
  )
}

function NightSky({ reduced }: { reduced: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const starsRef = useRef<
    {
      x: number
      y: number
      r: number
      a: number
      phase: number
      twinkle: number
      vy: number
    }[]
  >([])
  const planetRef = useRef<{
    x: number
    y: number
    r: number
    angle: number
  } | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf = 0
    let last = performance.now()

    const sizeCanvas = () => {
      const parent = canvas.parentElement
      if (!parent) return
      const rect = parent.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.max(1, Math.floor(rect.width * dpr))
      canvas.height = Math.max(1, Math.floor(rect.height * dpr))
      canvas.style.width = `${rect.width}px`
      canvas.style.height = `${rect.height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      seed()
    }

    const seed = () => {
      const parent = canvas.parentElement
      if (!parent) return
      const rect = parent.getBoundingClientRect()
      const count = Math.max(28, Math.floor((rect.width * rect.height) / 32000))
      starsRef.current = Array.from({ length: count }, () => {
        const warm = Math.random() < 0.32
        return {
          x: Math.random() * rect.width,
          y: Math.random() * rect.height,
          r: 0.3 + Math.random() * 1.15,
          a: 0.14 + Math.random() * 0.30,
          phase: Math.random() * Math.PI * 2,
          twinkle: 0.4 + Math.random() * 1.4,
          vy: -(0.04 + Math.random() * 0.08),
          warm,
        }
      })
      planetRef.current = {
        x: rect.width * 0.18,
        y: rect.height * 0.22,
        r: Math.min(rect.width, rect.height) * 0.08,
        angle: 0,
      }
    }

    const draw = (now: number) => {
      const dt = Math.min(50, now - last) / 1000
      last = now

      const parent = canvas.parentElement
      if (!parent) return
      const rect = parent.getBoundingClientRect()
      ctx.clearRect(0, 0, rect.width, rect.height)

      const planet = planetRef.current
      if (planet && !reduced) {
        planet.angle += dt * 0.04
        const grd = ctx.createRadialGradient(
          planet.x,
          planet.y,
          0,
          planet.x,
          planet.y,
          planet.r * 3.6,
        )
        grd.addColorStop(0, 'rgba(245, 198, 91, 0.18)')
        grd.addColorStop(0.4, 'rgba(245, 198, 91, 0.06)')
        grd.addColorStop(1, 'rgba(245, 198, 91, 0)')
        ctx.fillStyle = grd
        ctx.beginPath()
        ctx.arc(planet.x, planet.y, planet.r * 3.6, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = 'rgba(255, 246, 218, 0.72)'
        ctx.beginPath()
        ctx.arc(planet.x, planet.y, planet.r * 0.55, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = 'rgba(255, 246, 218, 0.32)'
        ctx.beginPath()
        ctx.arc(planet.x, planet.y, planet.r * 0.95, 0, Math.PI * 2)
        ctx.fill()
      }

      for (const s of starsRef.current) {
        if (!reduced) {
          s.phase += dt * s.twinkle
          s.y += s.vy
          if (s.y < -2) {
            s.y = rect.height + 2
            s.x = Math.random() * rect.width
          }
        }
        const a = s.a * (0.55 + 0.45 * Math.sin(s.phase))
        const baseTint = (s as { warm?: boolean }).warm ? '255, 214, 152' : '252, 232, 196'
        ctx.fillStyle = reduced
          ? `rgba(${baseTint}, ${s.a * 0.55})`
          : `rgba(${baseTint}, ${a})`
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fill()
      }

      if (!reduced) raf = requestAnimationFrame(draw)
    }

    sizeCanvas()
    if (reduced) {
      draw(performance.now())
    } else {
      raf = requestAnimationFrame(draw)
    }

    const ro = new ResizeObserver(() => sizeCanvas())
    if (canvas.parentElement) ro.observe(canvas.parentElement)

    return () => {
      if (raf) cancelAnimationFrame(raf)
      ro.disconnect()
    }
  }, [reduced])

  return <canvas ref={canvasRef} className="night-sky-canvas" aria-hidden="true" />
}

/* ──────────────────────────────────────────────────────────────────────
   iteration 145 · the verso earns a reader's wick

   A small hand-drawn candle sits in the verso's lower margin, just before
   the cul-de-lampe. Before reading, the wick is set but unlit. When the
   answer completes, the wick ignites — a quiet flame with a slow warm
   halo. It is the page's only persistent confirmation that a reader has
   visited it: the answer is read, the reply is read, and the wick
   remains lit. It reads as a single, intimate detail that earns the
   lower margin it occupies.
   ────────────────────────────────────────────────────────────────────── */

function ReadingWick({ lit, reduced }: { lit: boolean; reduced: boolean }) {
  return (
    <figure
      className={`reading-wick${lit ? ' is-lit' : ''}${reduced ? ' is-static' : ''}`}
      aria-hidden="true"
    >
      <div className="reading-wick-stage">
        <svg className="reading-wick-svg" viewBox="0 0 48 88" focusable="false">
          <defs>
            <radialGradient id="wick-halo" cx="50%" cy="38%" r="62%">
              <stop offset="0%" stopColor="rgba(255, 220, 150, 0.7)" />
              <stop offset="38%" stopColor="rgba(245, 198, 91, 0.32)" />
              <stop offset="78%" stopColor="rgba(217, 101, 74, 0.08)" />
              <stop offset="100%" stopColor="rgba(217, 101, 74, 0)" />
            </radialGradient>
            <linearGradient id="wick-flame-outer" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor="rgba(167, 60, 44, 0.88)" />
              <stop offset="40%" stopColor="rgba(217, 101, 74, 0.92)" />
              <stop offset="74%" stopColor="rgba(245, 198, 91, 0.96)" />
              <stop offset="100%" stopColor="rgba(255, 246, 218, 0.92)" />
            </linearGradient>
            <linearGradient id="wick-flame-core" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor="rgba(245, 198, 91, 0.78)" />
              <stop offset="100%" stopColor="rgba(255, 246, 218, 0.96)" />
            </linearGradient>
            <linearGradient id="wick-wax" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(245, 220, 168, 0.96)" />
              <stop offset="62%" stopColor="rgba(232, 188, 110, 0.92)" />
              <stop offset="100%" stopColor="rgba(196, 142, 78, 0.9)" />
            </linearGradient>
            <linearGradient id="wick-wax-edge" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="rgba(107, 74, 37, 0.5)" />
              <stop offset="50%" stopColor="rgba(107, 74, 37, 0.3)" />
              <stop offset="100%" stopColor="rgba(107, 74, 37, 0.5)" />
            </linearGradient>
            <radialGradient id="wick-wax-sheen" cx="34%" cy="14%" r="42%">
              <stop offset="0%" stopColor="rgba(255, 246, 218, 0.78)" />
              <stop offset="100%" stopColor="rgba(255, 246, 218, 0)" />
            </radialGradient>
          </defs>

          <ellipse className="wick-halo" cx="24" cy="34" rx="26" ry="32" fill="url(#wick-halo)" />

          <g className="wick-flame-group">
            <path
              className="wick-flame-outer"
              d="M 24 56 Q 16 50 16 40 Q 16 32 19 26 Q 21 22 22 18 Q 23 14 24 10 Q 25 14 26 18 Q 27 22 29 26 Q 32 32 32 40 Q 32 50 24 56 Z"
              fill="url(#wick-flame-outer)"
            />
            <path
              className="wick-flame-core"
              d="M 24 50 Q 19 44 19 38 Q 19 32 21 28 Q 23 24 24 20 Q 25 24 27 28 Q 29 32 29 38 Q 29 44 24 50 Z"
              fill="url(#wick-flame-core)"
            />
            <path
              className="wick-flame-base"
              d="M 24 52 Q 22 48 22 44 Q 22 40 24 38 Q 26 40 26 44 Q 26 48 24 52 Z"
              fill="rgba(255, 246, 218, 0.92)"
            />
          </g>

          <line
            className="wick-thread"
            x1="24"
            y1="54"
            x2="24"
            y2="62"
            stroke="rgba(28, 18, 8, 0.92)"
            strokeWidth="0.85"
            strokeLinecap="round"
          />
          <line
            className="wick-thread-glow"
            x1="24"
            y1="54"
            x2="24"
            y2="60"
            stroke="rgba(245, 198, 91, 0.5)"
            strokeWidth="0.35"
            strokeLinecap="round"
          />

          <ellipse cx="24" cy="80" rx="11" ry="2.4" fill="rgba(107, 74, 37, 0.18)" />
          <rect
            className="wick-body"
            x="15"
            y="60"
            width="18"
            height="18"
            rx="1.4"
            fill="url(#wick-wax)"
            stroke="url(#wick-wax-edge)"
            strokeWidth="0.45"
          />
          <rect
            className="wick-body-sheen"
            x="15"
            y="60"
            width="18"
            height="18"
            rx="1.4"
            fill="url(#wick-wax-sheen)"
          />
          <ellipse
            className="wick-body-rim"
            cx="24"
            cy="60"
            rx="8.6"
            ry="1.6"
            fill="rgba(245, 220, 168, 0.92)"
            stroke="rgba(107, 74, 37, 0.32)"
            strokeWidth="0.32"
          />
          <ellipse
            cx="24"
            cy="59.4"
            rx="6.6"
            ry="1"
            fill="rgba(255, 246, 218, 0.7)"
          />

          <path
            className="wick-drip"
            d="M 15.5 64 Q 14.4 68 14.8 72 Q 15.4 76 16.2 78"
            stroke="rgba(245, 198, 91, 0.62)"
            strokeWidth="0.55"
            fill="none"
            strokeLinecap="round"
          />
          <path
            className="wick-drip-soft"
            d="M 32.6 70 Q 33.6 73 33.2 76"
            stroke="rgba(245, 198, 91, 0.42)"
            strokeWidth="0.42"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <figcaption className="reading-wick-cap">
        <span className="reading-wick-cap-mark" aria-hidden="true">¶</span>
        <em className="reading-wick-cap-key">the wick</em>
        <span className="reading-wick-cap-sep" aria-hidden="true">·</span>
        <em className="reading-wick-cap-tail">
          {lit ? 'lit by your reading' : 'set, awaiting a reader'}
        </em>
      </figcaption>
    </figure>
  )
}

function ReadingLamp({ intensity }: { intensity: number }) {
  const phase = Math.max(0, Math.min(1, intensity))
  return (
    <div
      className="reading-lamp"
      aria-hidden="true"
      style={{ '--lamp-phase': phase } as React.CSSProperties}
    >
      <svg
        className="reading-lamp-shade"
        viewBox="0 0 80 36"
        focusable="false"
      >
        <defs>
          <linearGradient id="lamp-shade-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(217, 154, 84, 0.92)" />
            <stop offset="100%" stopColor="rgba(150, 86, 38, 0.92)" />
          </linearGradient>
          <radialGradient id="lamp-flare" cx="50%" cy="100%" r="55%">
            <stop offset="0%" stopColor="rgba(255, 220, 150, 0.85)" />
            <stop offset="100%" stopColor="rgba(255, 220, 150, 0)" />
          </radialGradient>
        </defs>
        <ellipse cx="40" cy="2" rx="30" ry="2.4" fill="rgba(245, 220, 170, 0.65)" />
        <path
          d="M 8 36 Q 40 10 72 36 Z"
          fill="url(#lamp-shade-fill)"
          stroke="rgba(80, 36, 14, 0.45)"
          strokeWidth="0.6"
        />
        <ellipse cx="40" cy="30" rx="22" ry="3.4" fill="url(#lamp-flare)" />
        <line x1="40" y1="2" x2="40" y2="14" stroke="rgba(80, 36, 14, 0.7)" strokeWidth="0.8" />
      </svg>
      <span className="reading-lamp-cone" />
      <span className="reading-lamp-glow" />
    </div>
  )
}

function FolioAnatomy({ visible }: { visible: boolean }) {
  return (
    <figure
      className={`folio-anatomy${visible ? ' is-visible' : ''}`}
      aria-hidden="true"
    >
      <figcaption className="folio-anatomy-cap">
        <span className="folio-anatomy-mark">¶</span>
        <span>anatomy of the folio</span>
      </figcaption>
      <svg className="folio-anatomy-plate" viewBox="0 0 240 110" focusable="false">
        <defs>
          <linearGradient id="anat-paper" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(255, 248, 230, 0.95)" />
            <stop offset="100%" stopColor="rgba(232, 216, 178, 0.92)" />
          </linearGradient>
        </defs>

        <path
          d="M 18 22 Q 14 24 14 30 L 14 80 Q 14 86 18 88 L 18 22 Z"
          fill="rgba(196, 156, 112, 0.32)"
          stroke="rgba(107, 74, 37, 0.5)"
          strokeWidth="0.4"
        />
        <path
          d="M 226 22 Q 230 24 230 30 L 230 80 Q 230 86 226 88 L 226 22 Z"
          fill="rgba(196, 156, 112, 0.32)"
          stroke="rgba(107, 74, 37, 0.5)"
          strokeWidth="0.4"
        />

        <rect
          x="18"
          y="22"
          width="100"
          height="66"
          fill="url(#anat-paper)"
          stroke="rgba(107, 74, 37, 0.5)"
          strokeWidth="0.45"
        />
        <rect
          x="120"
          y="22"
          width="106"
          height="66"
          fill="url(#anat-paper)"
          stroke="rgba(107, 74, 37, 0.5)"
          strokeWidth="0.45"
        />

        <line
          x1="119"
          y1="22"
          x2="119"
          y2="88"
          stroke="rgba(107, 74, 37, 0.45)"
          strokeWidth="0.45"
          strokeDasharray="1.6 1.8"
        />

        <g className="folio-anatomy-lines recto">
          <line x1="26" y1="34" x2="112" y2="34" stroke="rgba(17, 32, 42, 0.34)" strokeWidth="0.32" />
          <line x1="26" y1="42" x2="112" y2="42" stroke="rgba(17, 32, 42, 0.34)" strokeWidth="0.32" />
          <line x1="26" y1="50" x2="112" y2="50" stroke="rgba(17, 32, 42, 0.34)" strokeWidth="0.32" />
          <line x1="26" y1="58" x2="100" y2="58" stroke="rgba(17, 32, 42, 0.34)" strokeWidth="0.32" />
          <line x1="26" y1="66" x2="112" y2="66" stroke="rgba(17, 32, 42, 0.34)" strokeWidth="0.32" />
        </g>
        <g className="folio-anatomy-lines verso">
          <line x1="126" y1="34" x2="220" y2="34" stroke="rgba(17, 32, 42, 0.34)" strokeWidth="0.32" />
          <line x1="126" y1="42" x2="220" y2="42" stroke="rgba(17, 32, 42, 0.34)" strokeWidth="0.32" />
          <line x1="126" y1="50" x2="220" y2="50" stroke="rgba(17, 32, 42, 0.34)" strokeWidth="0.32" />
          <line x1="126" y1="58" x2="220" y2="58" stroke="rgba(17, 32, 42, 0.34)" strokeWidth="0.32" />
          <line x1="126" y1="66" x2="200" y2="66" stroke="rgba(17, 32, 42, 0.34)" strokeWidth="0.32" />
        </g>

        <g className="folio-anatomy-ledger">
          <line x1="46" y1="50" x2="78" y2="50" stroke="rgba(217, 101, 74, 0.55)" strokeWidth="0.6" />
          <circle cx="46" cy="50" r="0.9" fill="rgba(217, 101, 74, 0.8)" />
          <circle cx="78" cy="50" r="0.9" fill="rgba(217, 101, 74, 0.8)" />
        </g>
        <g className="folio-anatomy-italic">
          <line x1="146" y1="50" x2="170" y2="50" stroke="rgba(217, 101, 74, 0.55)" strokeWidth="0.6" />
          <circle cx="146" cy="50" r="0.9" fill="rgba(217, 101, 74, 0.8)" />
          <circle cx="170" cy="50" r="0.9" fill="rgba(217, 101, 74, 0.8)" />
        </g>

        <g className="folio-anatomy-callouts">
          <g className="folio-anatomy-callout recto-callout">
            <path d="M 66 30 Q 66 22 62 18" fill="none" stroke="rgba(217, 101, 74, 0.6)" strokeWidth="0.4" />
            <circle cx="66" cy="30" r="0.7" fill="rgba(217, 101, 74, 0.7)" />
          </g>
          <g className="folio-anatomy-callout spine-callout">
            <path d="M 119 14 Q 110 8 104 8" fill="none" stroke="rgba(217, 101, 74, 0.6)" strokeWidth="0.4" />
            <circle cx="119" cy="14" r="0.7" fill="rgba(217, 101, 74, 0.7)" />
          </g>
          <g className="folio-anatomy-callout verso-callout">
            <path d="M 174 30 Q 174 22 178 18" fill="none" stroke="rgba(217, 101, 74, 0.6)" strokeWidth="0.4" />
            <circle cx="174" cy="30" r="0.7" fill="rgba(217, 101, 74, 0.7)" />
          </g>
          <g className="folio-anatomy-callout gutter-callout">
            <path d="M 119 80 Q 110 100 104 102" fill="none" stroke="rgba(217, 101, 74, 0.6)" strokeWidth="0.4" />
            <circle cx="119" cy="80" r="0.7" fill="rgba(217, 101, 74, 0.7)" />
          </g>
        </g>

        <g className="folio-anatomy-labels">
          <text x="62" y="16" textAnchor="middle">recto</text>
          <text x="178" y="16" textAnchor="middle">verso</text>
          <text x="104" y="6" textAnchor="middle">spine</text>
          <text x="100" y="106" textAnchor="middle">gutter</text>
        </g>
      </svg>
      <span className="folio-anatomy-foot">
        <em>cap. xviii</em>
        <span aria-hidden="true">·</span>
        <em>sig. A2 / A3</em>
        <span aria-hidden="true">·</span>
        <em>folio lxxvii</em>
      </span>
    </figure>
  )
}

function DustMotes({ reduced }: { reduced: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const motesRef = useRef<
    { x: number; y: number; vx: number; vy: number; r: number; alpha: number; wob: number; warmth: number }[]
  >([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf = 0
    let last = performance.now()

    const sizeCanvas = () => {
      const parent = canvas.parentElement
      if (!parent) return
      const rect = parent.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.max(1, Math.floor(rect.width * dpr))
      canvas.height = Math.max(1, Math.floor(rect.height * dpr))
      canvas.style.width = `${rect.width}px`
      canvas.style.height = `${rect.height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      seed()
    }

    const seed = () => {
      const parent = canvas.parentElement
      if (!parent) return
      const rect = parent.getBoundingClientRect()
      const count = 9
      motesRef.current = Array.from({ length: count }, () => ({
        x: Math.random() * rect.width,
        y: rect.height * (0.55 + Math.random() * 0.55),
        vx: (Math.random() - 0.5) * 1.4,
        vy: -(0.55 + Math.random() * 0.95),
        r: 0.7 + Math.random() * 1.6,
        alpha: 0.22 + Math.random() * 0.28,
        wob: Math.random() * Math.PI * 2,
        warmth: 0.6 + Math.random() * 0.4,
      }))
    }

    const onPointer = (e: PointerEvent) => {
      const parent = canvas.parentElement
      if (!parent) return
      const rect = parent.getBoundingClientRect()
      const mx = e.clientX - rect.left
      const my = e.clientY - rect.top
      for (const m of motesRef.current) {
        const dx = m.x - mx
        const dy = m.y - my
        const dist = Math.hypot(dx, dy)
        if (dist > 0 && dist < 110) {
          const force = (1 - dist / 110) * 14
          m.vx += (dx / dist) * force * 0.04
          m.vy += (dy / dist) * force * 0.04
        }
      }
    }

    const draw = (now: number) => {
      const dt = Math.min(50, now - last) / 1000
      last = now

      const parent = canvas.parentElement
      if (!parent) return
      const rect = parent.getBoundingClientRect()
      ctx.clearRect(0, 0, rect.width, rect.height)

      for (const m of motesRef.current) {
        if (!reduced) {
          m.wob += dt * 0.45
          m.vx += Math.sin(m.wob) * 0.05
          m.vy -= dt * 0.9
          m.vx *= 0.994
          m.vy *= 0.994
          m.x += m.vx * dt * 22
          m.y += m.vy * dt * 22
          if (m.y < -10) {
            m.y = rect.height + 10
            m.x = Math.random() * rect.width
            m.vy = -(0.55 + Math.random() * 0.9)
          }
          if (m.x < -10) m.x = rect.width + 10
          if (m.x > rect.width + 10) m.x = -10
        }
        ctx.beginPath()
        const grd = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, m.r * 2.4)
        if (reduced) {
          grd.addColorStop(0, `rgba(245, 198, 91, ${m.alpha * 0.42})`)
          grd.addColorStop(1, 'rgba(245, 198, 91, 0)')
        } else {
          grd.addColorStop(0, `rgba(255, 220, 160, ${m.alpha * m.warmth})`)
          grd.addColorStop(0.6, `rgba(245, 198, 91, ${m.alpha * 0.35})`)
          grd.addColorStop(1, 'rgba(217, 101, 74, 0)')
        }
        ctx.fillStyle = grd
        ctx.beginPath()
        ctx.arc(m.x, m.y, m.r * 2.4, 0, Math.PI * 2)
        ctx.fill()
      }

      if (!reduced) raf = requestAnimationFrame(draw)
    }

    sizeCanvas()
    if (reduced) {
      draw(performance.now())
    } else {
      raf = requestAnimationFrame(draw)
    }

    const ro = new ResizeObserver(() => sizeCanvas())
    if (canvas.parentElement) ro.observe(canvas.parentElement)

    window.addEventListener('pointermove', onPointer, { passive: true })

    return () => {
      if (raf) cancelAnimationFrame(raf)
      ro.disconnect()
      window.removeEventListener('pointermove', onPointer)
    }
  }, [reduced])

  return <canvas ref={canvasRef} className="dust-canvas" aria-hidden="true" />
}

function MarginalInterlude({
  visible,
  reduced,
}: {
  visible: boolean
  reduced: boolean
}) {
  return (
    <aside
      className={`marginal-interlude${visible ? ' is-visible' : ''}`}
      aria-hidden="true"
    >
      <div className="marginal-interlude-rule" />

      <div className="marginal-interlude-row">
        <div className={`pressed-leaf${reduced ? ' is-static' : ''}`}>
          <svg viewBox="0 0 70 96" focusable="false">
            <defs>
              <linearGradient id="leaf-body" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(154, 168, 96, 0.58)" />
                <stop offset="55%" stopColor="rgba(118, 138, 70, 0.62)" />
                <stop offset="100%" stopColor="rgba(78, 96, 44, 0.5)" />
              </linearGradient>
              <linearGradient id="leaf-shadow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(54, 70, 32, 0.18)" />
                <stop offset="100%" stopColor="rgba(54, 70, 32, 0.45)" />
              </linearGradient>
            </defs>

            <g className="pressed-leaf-shadow">
              <path
                d="M 6 88 Q 4 50 18 24 Q 38 4 56 16 Q 64 36 50 64 Q 32 86 12 90 Z"
                fill="url(#leaf-shadow)"
                opacity="0.6"
              />
            </g>

            <g className="pressed-leaf-body">
              <path
                d="M 8 86 Q 6 50 20 26 Q 38 8 54 18 Q 60 36 48 62 Q 30 82 14 88 Z"
                fill="url(#leaf-body)"
                stroke="rgba(58, 80, 38, 0.5)"
                strokeWidth="0.4"
              />
              <path
                className="pressed-leaf-vein-mid"
                d="M 16 86 Q 24 56 34 32 Q 42 22 50 22"
                stroke="rgba(58, 80, 38, 0.55)"
                strokeWidth="0.5"
                fill="none"
                strokeLinecap="round"
              />
              <g className="pressed-leaf-veins" stroke="rgba(58, 80, 38, 0.4)" strokeWidth="0.3" fill="none" strokeLinecap="round">
                <path d="M 22 76 Q 28 70 30 64" />
                <path d="M 26 66 Q 32 60 34 56" />
                <path d="M 30 56 Q 36 50 38 44" />
                <path d="M 34 46 Q 40 40 42 34" />
                <path d="M 18 78 Q 14 70 16 60" />
                <path d="M 18 58 Q 14 50 18 42" />
                <path d="M 22 40 Q 18 32 22 24" />
              </g>
              <g className="pressed-leaf-blotches" fill="rgba(58, 80, 38, 0.32)">
                <ellipse cx="34" cy="42" rx="2.2" ry="1" transform="rotate(-22 34 42)" />
                <ellipse cx="26" cy="60" rx="1.6" ry="0.8" transform="rotate(-30 26 60)" />
                <ellipse cx="42" cy="34" rx="1.4" ry="0.8" transform="rotate(-12 42 34)" />
              </g>
              <path
                className="pressed-leaf-stem"
                d="M 12 90 Q 8 94 4 96"
                stroke="rgba(78, 56, 28, 0.7)"
                strokeWidth="0.55"
                fill="none"
                strokeLinecap="round"
              />
            </g>

            <text x="35" y="93" textAnchor="middle" className="pressed-leaf-script">
              h · lo · xviii
            </text>
          </svg>
        </div>

        <div className="marginal-interlude-text">
          <p className="marginal-interlude-line">
            <em>what is set once</em> is read
            <br />
            at the pace of attention.
          </p>
          <p className="marginal-interlude-tag">
            <span className="marginal-interlude-tag-mark">¶</span>
            corrig. · manu pr.
          </p>
        </div>
      </div>

      <div className="marginal-interlude-rule marginal-interlude-rule--tail" />
    </aside>
  )
}

function MarginaliaOwl({
  active,
  reduced,
  watchPoint,
  blinking,
}: {
  active: boolean
  reduced: boolean
  watchPoint: { x: number; y: number; inside: boolean }
  blinking: boolean
}) {
  const clamp = (v: number, lo: number, hi: number) =>
    Math.max(lo, Math.min(hi, v))
  const px = watchPoint.inside ? clamp(watchPoint.x * 2.6, -2.6, 2.6) : 0
  const py = watchPoint.inside ? clamp(watchPoint.y * 1.6, -1.6, 1.6) : 0

  return (
    <div
      className={`marginalia-owl${active ? ' is-active' : ''}${blinking ? ' is-blinking' : ''}`}
      aria-hidden="true"
    >
      <svg viewBox="0 0 90 100" focusable="false">
        <defs>
          <linearGradient id="owl-feather" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(196, 156, 112, 0.92)" />
            <stop offset="100%" stopColor="rgba(112, 80, 50, 0.95)" />
          </linearGradient>
          <radialGradient id="owl-belly" cx="50%" cy="55%" r="62%">
            <stop offset="0%" stopColor="rgba(255, 248, 230, 0.96)" />
            <stop offset="100%" stopColor="rgba(218, 192, 148, 0.42)" />
          </radialGradient>
          <radialGradient id="owl-eye-disc" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(255, 246, 218, 0.98)" />
            <stop offset="100%" stopColor="rgba(238, 220, 178, 0.62)" />
          </radialGradient>
          <linearGradient id="owl-perch" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(107, 74, 37, 0.0)" />
            <stop offset="22%" stopColor="rgba(107, 74, 37, 0.85)" />
            <stop offset="78%" stopColor="rgba(107, 74, 37, 0.85)" />
            <stop offset="100%" stopColor="rgba(107, 74, 37, 0.0)" />
          </linearGradient>
        </defs>

        <path
          d="M 6 92 Q 25 89 45 92 Q 65 95 84 92"
          stroke="url(#owl-perch)"
          strokeWidth="0.9"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M 14 91 L 11 88 M 18 92 L 16 88"
          stroke="rgba(107, 74, 37, 0.7)"
          strokeWidth="0.45"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M 72 93 L 75 89 M 76 93 L 72 88"
          stroke="rgba(107, 74, 37, 0.7)"
          strokeWidth="0.45"
          strokeLinecap="round"
          fill="none"
        />

        <ellipse cx="45" cy="94" rx="22" ry="1.8" fill="rgba(40, 12, 6, 0.16)" />

        <g className="owl-body">
          <path
            d="M 26 30 L 22 16 L 32 26 Z"
            fill="url(#owl-feather)"
          />
          <path
            d="M 64 30 L 68 16 L 58 26 Z"
            fill="url(#owl-feather)"
          />
          <ellipse cx="45" cy="56" rx="24" ry="30" fill="url(#owl-feather)" />
          <ellipse cx="45" cy="64" rx="15" ry="19" fill="url(#owl-belly)" />

          <path
            d="M 22 58 Q 17 70 23 84 L 28 84 Q 22 70 27 58 Z"
            fill="rgba(107, 74, 37, 0.35)"
          />
          <path
            d="M 68 58 Q 73 70 67 84 L 62 84 Q 68 70 63 58 Z"
            fill="rgba(107, 74, 37, 0.35)"
          />

          <g
            className="owl-chest"
            stroke="rgba(107, 74, 37, 0.32)"
            strokeWidth="0.45"
            fill="none"
          >
            <path d="M 38 70 Q 40 72 38 74" />
            <path d="M 45 72 Q 47 74 45 76" />
            <path d="M 52 70 Q 54 72 52 74" />
            <path d="M 38 78 Q 40 80 38 82" />
            <path d="M 45 80 Q 47 82 45 84" />
            <path d="M 52 78 Q 54 80 52 82" />
          </g>

          <circle cx="33" cy="48" r="9" fill="url(#owl-eye-disc)" />
          <circle cx="57" cy="48" r="9" fill="url(#owl-eye-disc)" />
          <circle
            cx="33"
            cy="48"
            r="9"
            fill="none"
            stroke="rgba(107, 74, 37, 0.55)"
            strokeWidth="0.55"
          />
          <circle
            cx="57"
            cy="48"
            r="9"
            fill="none"
            stroke="rgba(107, 74, 37, 0.55)"
            strokeWidth="0.55"
          />

          <g
            className="owl-pupil owl-pupil-left"
            style={
              reduced
                ? undefined
                : { transform: `translate(${px}px, ${py}px)` }
            }
          >
            <circle cx="33" cy="48" r="3.2" fill="rgba(20, 22, 32, 0.96)" />
            <circle cx="32" cy="47" r="0.9" fill="rgba(255, 248, 230, 0.95)" />
          </g>
          <g
            className="owl-pupil owl-pupil-right"
            style={
              reduced
                ? undefined
                : { transform: `translate(${px}px, ${py}px)` }
            }
          >
            <circle cx="57" cy="48" r="3.2" fill="rgba(20, 22, 32, 0.96)" />
            <circle cx="56" cy="47" r="0.9" fill="rgba(255, 248, 230, 0.95)" />
          </g>

          <ellipse
            cx="33"
            cy="48"
            rx="9"
            ry="9"
            fill="rgba(112, 80, 50, 0.94)"
            className="owl-eyelid owl-eyelid-left"
          />
          <ellipse
            cx="57"
            cy="48"
            rx="9"
            ry="9"
            fill="rgba(112, 80, 50, 0.94)"
            className="owl-eyelid owl-eyelid-right"
          />

          <g className="owl-beak">
            <path
              d="M 42 56 L 48 56 L 45 62 Z"
              fill="var(--coral)"
            />
          </g>

          <g
            className="owl-feet"
            stroke="var(--coral-dark)"
            strokeWidth="0.75"
            strokeLinecap="round"
            fill="none"
          >
            <path d="M 38 86 L 36 92" />
            <path d="M 33 92 L 40 92" />
            <path d="M 52 86 L 54 92" />
            <path d="M 50 92 L 57 92" />
          </g>
        </g>
      </svg>
    </div>
  )
}

function MarginalMoth({
  active,
  cycle,
  reduced,
}: {
  active: boolean
  cycle: number
  reduced: boolean
}) {
  const flap = active && !reduced
  return (
    <div
      className={`marginalia-moth${active ? ' is-active' : ''}${
        cycle > 0 ? ' is-reread' : ''
      }`}
      aria-hidden="true"
    >
      <svg viewBox="0 0 64 56" focusable="false">
        <defs>
          <radialGradient id="moth-body" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(107, 74, 37, 0.92)" />
            <stop offset="100%" stopColor="rgba(40, 22, 8, 0.96)" />
          </radialGradient>
          <radialGradient id="moth-wing" cx="50%" cy="50%" r="55%">
            <stop offset="0%" stopColor="rgba(245, 220, 168, 0.86)" />
            <stop offset="55%" stopColor="rgba(217, 154, 84, 0.78)" />
            <stop offset="100%" stopColor="rgba(150, 86, 38, 0.62)" />
          </radialGradient>
          <radialGradient id="moth-wing-deep" cx="50%" cy="50%" r="55%">
            <stop offset="0%" stopColor="rgba(217, 154, 84, 0.7)" />
            <stop offset="100%" stopColor="rgba(120, 60, 26, 0.5)" />
          </radialGradient>
        </defs>

        <g
          className={flap ? 'moth-flight' : ''}
          style={{ transformOrigin: '32px 28px' }}
        >
          <g
            className={`moth-wings moth-wings--upper${flap ? ' is-flapping' : ''}`}
            style={{ transformOrigin: '32px 26px' }}
          >
            <path
              d="M 32 26 Q 14 8 6 14 Q 4 22 12 28 Q 22 30 32 26 Z"
              fill="url(#moth-wing)"
              stroke="rgba(80, 36, 14, 0.55)"
              strokeWidth="0.35"
            />
            <path
              d="M 32 26 Q 50 8 58 14 Q 60 22 52 28 Q 42 30 32 26 Z"
              fill="url(#moth-wing)"
              stroke="rgba(80, 36, 14, 0.55)"
              strokeWidth="0.35"
            />
            <circle cx="14" cy="18" r="0.6" fill="rgba(80, 36, 14, 0.55)" />
            <circle cx="50" cy="18" r="0.6" fill="rgba(80, 36, 14, 0.55)" />
          </g>

          <g
            className={`moth-wings moth-wings--lower${flap ? ' is-flapping' : ''}`}
            style={{ transformOrigin: '32px 28px' }}
          >
            <path
              d="M 32 28 Q 16 32 12 44 Q 22 48 30 38 Q 32 32 32 28 Z"
              fill="url(#moth-wing-deep)"
              stroke="rgba(80, 36, 14, 0.45)"
              strokeWidth="0.3"
              opacity="0.92"
            />
            <path
              d="M 32 28 Q 48 32 52 44 Q 42 48 34 38 Q 32 32 32 28 Z"
              fill="url(#moth-wing-deep)"
              stroke="rgba(80, 36, 14, 0.45)"
              strokeWidth="0.3"
              opacity="0.92"
            />
          </g>

          <ellipse cx="32" cy="28" rx="2.4" ry="6" fill="url(#moth-body)" />

          <g
            className="moth-antennae"
            stroke="rgba(80, 36, 14, 0.7)"
            strokeWidth="0.4"
            strokeLinecap="round"
            fill="none"
          >
            <path d="M 31 23 Q 28 18 26 16" />
            <path d="M 33 23 Q 36 18 38 16" />
            <circle cx="26" cy="16" r="0.5" fill="rgba(80, 36, 14, 0.7)" />
            <circle cx="38" cy="16" r="0.5" fill="rgba(80, 36, 14, 0.7)" />
          </g>

          <g
            className="moth-eye-spots"
            fill="rgba(80, 36, 14, 0.55)"
          >
            <circle cx="20" cy="22" r="0.7" />
            <circle cx="44" cy="22" r="0.7" />
          </g>
        </g>

        <path
          className="moth-flight-line"
          d="M 6 50 Q 20 46 32 48 Q 44 50 58 46"
          stroke="rgba(214, 168, 73, 0.45)"
          strokeWidth="0.4"
          strokeLinecap="round"
          strokeDasharray="1.4 2.4"
          fill="none"
        />
      </svg>
      <span className="marginalia-moth-caption">
        <em>ad lucem</em>
        <span className="marginalia-moth-caption-tail" aria-hidden="true">
          · drawn to the lamp
        </span>
      </span>
    </div>
  )
}

/* ──────────────────────────────────────────────────────────────────────
   iteration 155 · a folio press head-note sits at the opening of each
   spread, mirroring the recto's RectoCatchword and the verso's
   ReplyCatchword in idiom — but speaking as the chapter's *first*
   voice: the moment the press announces itself to the reader. The
   recto slip names the chapter and the folio, in the press's quiet
   editorial hand; the verso slip answers in the same voice, naming
   the reply before the body of the reply arrives. Together with the
   recto's bottom colophon and the verso's cul-de-lampe, the folio
   earns a complete opening-closing symmetry: every spread now begins
   with a press signature and ends with one.
   ────────────────────────────────────────────────────────────────────── */

/* ──────────────────────────────────────────────────────────────────────
   iteration 158 · a silverpoint impression, set above the question.

   The folio's own press plate — an engraved, masterfully composed tableau
   that gathers the chapter, the hour, the press monogram and a thin
   epigraph into a single composed object above the question. The plate
   is the page's own signature: a printer's silverpoint at the head of
   the recto, like a coat-of-arms set above the title of an old edition.
   It replaces three stacked small inscriptions (head-note, hour-of-
   reading, epigraph) with one breathing, composed impression that earns
   the space the folio gives it.
   ────────────────────────────────────────────────────────────────────── */

function FolioPressPlate({
  now,
  reduced,
}: {
  now: Date
  reduced: boolean
}) {
  const dayName = WEEKDAYS[now.getDay()].slice(0, 3).toLowerCase()
  const dayOrdinal = ORDINALS[Math.min(ORDINALS.length - 1, now.getDate() - 1)]
  const monthName = MONTHS[now.getMonth()].slice(0, 3).toLowerCase()
  const yearRoman = toRomanYear(now.getFullYear())
  const hour24 = now.getHours()
  const minutes = now.getMinutes()
  const period = hour24 >= 12 ? 'p.m.' : 'a.m.'
  const h12 = ((hour24 + 11) % 12) + 1
  const mm = String(minutes).padStart(2, '0')

  return (
    <figure
      className={`folio-press-plate${reduced ? ' is-static' : ''}`}
      aria-hidden="true"
    >
      <svg
        className="folio-press-plate-field"
        viewBox="0 0 320 84"
        focusable="false"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="fpp-gold" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f6d076" />
            <stop offset="50%" stopColor="#c8923e" />
            <stop offset="100%" stopColor="#9c6e26" />
          </linearGradient>
          <linearGradient id="fpp-gold-soft" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f5c65b" />
            <stop offset="100%" stopColor="#a47026" />
          </linearGradient>
          <linearGradient id="fpp-rule-h" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(167, 60, 44, 0)" />
            <stop offset="14%" stopColor="rgba(167, 60, 44, 0.55)" />
            <stop offset="50%" stopColor="rgba(200, 146, 62, 0.72)" />
            <stop offset="86%" stopColor="rgba(167, 60, 44, 0.55)" />
            <stop offset="100%" stopColor="rgba(167, 60, 44, 0)" />
          </linearGradient>
          <radialGradient id="fpp-disc" cx="50%" cy="38%" r="64%">
            <stop offset="0%" stopColor="rgba(255, 246, 218, 0.85)" />
            <stop offset="62%" stopColor="rgba(245, 220, 168, 0.62)" />
            <stop offset="100%" stopColor="rgba(214, 178, 116, 0.32)" />
          </radialGradient>
          <radialGradient id="fpp-halo" cx="50%" cy="50%" r="55%">
            <stop offset="0%" stopColor="rgba(255, 220, 150, 0.32)" />
            <stop offset="100%" stopColor="rgba(255, 220, 150, 0)" />
          </radialGradient>
          <pattern id="fpp-grain" width="3" height="3" patternUnits="userSpaceOnUse">
            <circle cx="0.6" cy="0.4" r="0.4" fill="rgba(107, 74, 37, 0.06)" />
            <circle cx="2.2" cy="1.6" r="0.3" fill="rgba(107, 74, 37, 0.05)" />
          </pattern>
        </defs>

        <ellipse cx="160" cy="42" rx="148" ry="36" fill="url(#fpp-halo)" />

        <line
          x1="6"
          y1="12"
          x2="314"
          y2="12"
          stroke="url(#fpp-rule-h)"
          strokeWidth="0.55"
          strokeLinecap="round"
        />
        <line
          x1="6"
          y1="72"
          x2="314"
          y2="72"
          stroke="url(#fpp-rule-h)"
          strokeWidth="0.55"
          strokeLinecap="round"
        />
        <line
          x1="6"
          y1="14.4"
          x2="314"
          y2="14.4"
          stroke="rgba(167, 60, 44, 0.2)"
          strokeWidth="0.32"
          strokeDasharray="0.6 1.6"
          strokeLinecap="round"
        />
        <line
          x1="6"
          y1="69.6"
          x2="314"
          y2="69.6"
          stroke="rgba(167, 60, 44, 0.2)"
          strokeWidth="0.32"
          strokeDasharray="0.6 1.6"
          strokeLinecap="round"
        />

        <g className="folio-press-plate-glyph folio-press-plate-glyph--left" transform="translate(46 42)">
          <circle r="20" fill="url(#fpp-disc)" />
          <circle r="20" fill="url(#fpp-grain)" opacity="0.7" />
          <circle r="18" fill="none" stroke="url(#fpp-gold)" strokeWidth="0.55" />
          <circle r="16" fill="none" stroke="url(#fpp-gold)" strokeWidth="0.22" strokeDasharray="0.4 1.2" opacity="0.78" />
          <circle r="9" fill="none" stroke="url(#fpp-gold)" strokeWidth="0.3" />
          <text x="0" y="3.2" textAnchor="middle" className="fpp-letter">
            m
          </text>
          <text x="0" y="9" textAnchor="middle" className="fpp-roman">
            ·iii
          </text>
          <line x1="-7" y1="-7" x2="-10" y2="-10" stroke="url(#fpp-gold-soft)" strokeWidth="0.55" strokeLinecap="round" opacity="0.7" />
          <line x1="7" y1="-7" x2="10" y2="-10" stroke="url(#fpp-gold-soft)" strokeWidth="0.55" strokeLinecap="round" opacity="0.7" />
          <line x1="-7" y1="7" x2="-10" y2="10" stroke="url(#fpp-gold-soft)" strokeWidth="0.55" strokeLinecap="round" opacity="0.7" />
          <line x1="7" y1="7" x2="10" y2="10" stroke="url(#fpp-gold-soft)" strokeWidth="0.55" strokeLinecap="round" opacity="0.7" />
          <circle cx="0" cy="0" r="0.55" fill="rgba(107, 74, 37, 0.92)" />
        </g>

        <g className="folio-press-plate-glyph folio-press-plate-glyph--right" transform="translate(274 42)">
          <circle r="14" fill="none" stroke="url(#fpp-gold)" strokeWidth="0.5" />
          <circle r="12" fill="none" stroke="url(#fpp-gold)" strokeWidth="0.22" strokeDasharray="0.5 1.4" opacity="0.7" />
          <line x1="0" y1="-9" x2="0" y2="-12" stroke="url(#fpp-gold-soft)" strokeWidth="0.55" strokeLinecap="round" />
          <line x1="0" y1="9" x2="0" y2="12" stroke="url(#fpp-gold-soft)" strokeWidth="0.55" strokeLinecap="round" />
          <line x1="-9" y1="0" x2="-12" y2="0" stroke="url(#fpp-gold-soft)" strokeWidth="0.55" strokeLinecap="round" />
          <line x1="9" y1="0" x2="12" y2="0" stroke="url(#fpp-gold-soft)" strokeWidth="0.55" strokeLinecap="round" />
          <line x1="-6.4" y1="-6.4" x2="-8.5" y2="-8.5" stroke="url(#fpp-gold-soft)" strokeWidth="0.45" strokeLinecap="round" opacity="0.85" />
          <line x1="6.4" y1="-6.4" x2="8.5" y2="-8.5" stroke="url(#fpp-gold-soft)" strokeWidth="0.45" strokeLinecap="round" opacity="0.85" />
          <line x1="-6.4" y1="6.4" x2="-8.5" y2="8.5" stroke="url(#fpp-gold-soft)" strokeWidth="0.45" strokeLinecap="round" opacity="0.85" />
          <line x1="6.4" y1="6.4" x2="8.5" y2="8.5" stroke="url(#fpp-gold-soft)" strokeWidth="0.45" strokeLinecap="round" opacity="0.85" />
          <circle r="1.4" fill="url(#fpp-gold)" />
          <circle r="0.5" fill="rgba(107, 74, 37, 0.92)" />
        </g>

        <g className="folio-press-plate-mid">
          <line x1="80" y1="42" x2="118" y2="42" stroke="url(#fpp-rule-h)" strokeWidth="0.4" strokeLinecap="round" opacity="0.85" />
          <line x1="202" y1="42" x2="240" y2="42" stroke="url(#fpp-rule-h)" strokeWidth="0.4" strokeLinecap="round" opacity="0.85" />

          <circle cx="160" cy="32" r="1.2" fill="url(#fpp-gold-soft)" />
          <path d="M 156 38 Q 160 35 164 38" fill="none" stroke="rgba(167, 60, 44, 0.7)" strokeWidth="0.45" strokeLinecap="round" />
          <line x1="148" y1="42" x2="172" y2="42" stroke="url(#fpp-gold)" strokeWidth="0.55" strokeLinecap="round" opacity="0.85" />
          <path d="M 156 46 Q 160 49 164 46" fill="none" stroke="rgba(167, 60, 44, 0.7)" strokeWidth="0.45" strokeLinecap="round" />

          <text x="160" y="27" textAnchor="middle" className="fpp-crown">
            caput xviii · lxxvii
          </text>
          <text x="160" y="60.5" textAnchor="middle" className="fpp-base">
            {dayName} · the {dayOrdinal} of {monthName} · {h12}:{mm} {period} · {yearRoman}
          </text>

          <text x="160" y="68" textAnchor="middle" className="fpp-quote">
            ad lucem · perlege ·
          </text>
        </g>

        <g className="folio-press-plate-corner folio-press-plate-corner--tl" fill="#cf3b29" fillOpacity="0.55">
          <path d="M 6 8 L 12 8 Q 12 11 9.5 12 L 9.5 15 L 6 15 Z" />
          <circle cx="7.4" cy="9.4" r="0.45" />
        </g>
        <g className="folio-press-plate-corner folio-press-plate-corner--tr" fill="#cf3b29" fillOpacity="0.5">
          <path d="M 314 8 L 308 8 Q 308 11 310.5 12 L 310.5 15 L 314 15 Z" />
          <circle cx="312.6" cy="9.4" r="0.45" />
        </g>
        <g className="folio-press-plate-corner folio-press-plate-corner--bl" fill="#a73c2c" fillOpacity="0.5">
          <path d="M 6 76 L 12 76 Q 12 73 9.5 72 L 9.5 69 L 6 69 Z" />
          <circle cx="7.4" cy="74.6" r="0.45" />
        </g>
        <g className="folio-press-plate-corner folio-press-plate-corner--br" fill="#a73c2c" fillOpacity="0.5">
          <path d="M 314 76 L 308 76 Q 308 73 310.5 72 L 310.5 69 L 314 69 Z" />
          <circle cx="312.6" cy="74.6" r="0.45" />
        </g>
      </svg>

      <figcaption className="folio-press-plate-cap">
        <span className="folio-press-plate-cap-rule folio-press-plate-cap-rule--left" />
        <span className="folio-press-plate-cap-cluster">
          <em className="folio-press-plate-cap-key">the press plate</em>
          <span className="folio-press-plate-cap-sep" aria-hidden="true">·</span>
          <em className="folio-press-plate-cap-tail">a silverpoint at the head of the folio</em>
        </span>
        <span className="folio-press-plate-cap-rule folio-press-plate-cap-rule--right" />
      </figcaption>
    </figure>
  )
}

/* ──────────────────────────────────────────────────────────────────────
   iteration 161 · a composed folio masthead

   A single, breathing editorial header that unifies the silverpoint
   press plate, the chapter frontispiece, and the running head into
   one composed impression. The masthead is the folio's own opening
   signature: a delicate gold rule, a press monogram centerpiece, the
   chapter mark set in italic, the day and hour as a single composed
   inscription, and a closing "ad lucem" rule. It earns its place as
   the folio's quiet, self-contained opening — the press, the chapter
   and the hour set in a single composed typography, before the
   reader turns to the question.
   ────────────────────────────────────────────────────────────────────── */

function FolioMasthead({
  now,
  reduced,
}: {
  now: Date
  reduced: boolean
}) {
  const dayName = WEEKDAYS[now.getDay()].slice(0, 3).toLowerCase()
  const dayOrdinal = ORDINALS[Math.min(ORDINALS.length - 1, now.getDate() - 1)]
  const monthName = MONTHS[now.getMonth()].slice(0, 3).toLowerCase()
  const hour24 = now.getHours()
  const minutes = now.getMinutes()
  const period = hour24 >= 12 ? 'p.m.' : 'a.m.'
  const h12 = ((hour24 + 11) % 12) + 1
  const mm = String(minutes).padStart(2, '0')

  return (
    <figure
      className={`folio-masthead${reduced ? ' is-static' : ''}`}
      aria-hidden="true"
    >
      <svg
        className="folio-masthead-plate"
        viewBox="0 0 320 96"
        focusable="false"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="masthead-gold" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f6d076" />
            <stop offset="50%" stopColor="#c8923e" />
            <stop offset="100%" stopColor="#9c6e26" />
          </linearGradient>
          <linearGradient id="masthead-rule" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(167, 60, 44, 0)" />
            <stop offset="14%" stopColor="rgba(167, 60, 44, 0.55)" />
            <stop offset="50%" stopColor="rgba(200, 146, 62, 0.74)" />
            <stop offset="86%" stopColor="rgba(167, 60, 44, 0.55)" />
            <stop offset="100%" stopColor="rgba(167, 60, 44, 0)" />
          </linearGradient>
          <linearGradient id="masthead-rule-ghost" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(167, 60, 44, 0)" />
            <stop offset="50%" stopColor="rgba(167, 60, 44, 0.32)" />
            <stop offset="100%" stopColor="rgba(167, 60, 44, 0)" />
          </linearGradient>
          <radialGradient id="masthead-face" cx="50%" cy="34%" r="64%">
            <stop offset="0%" stopColor="rgba(255, 246, 218, 0.78)" />
            <stop offset="62%" stopColor="rgba(245, 220, 168, 0.32)" />
            <stop offset="100%" stopColor="rgba(214, 178, 116, 0)" />
          </radialGradient>
          <radialGradient id="masthead-halo" cx="50%" cy="50%" r="55%">
            <stop offset="0%" stopColor="rgba(255, 220, 150, 0.28)" />
            <stop offset="100%" stopColor="rgba(255, 220, 150, 0)" />
          </radialGradient>
        </defs>

        <ellipse cx="160" cy="48" rx="148" ry="40" fill="url(#masthead-halo)" />

        <line
          x1="6"
          y1="11"
          x2="314"
          y2="11"
          stroke="url(#masthead-rule-ghost)"
          strokeWidth="0.32"
          strokeDasharray="0.6 1.6"
          strokeLinecap="round"
        />
        <line
          x1="6"
          y1="8"
          x2="314"
          y2="8"
          stroke="url(#masthead-rule)"
          strokeWidth="0.55"
          strokeLinecap="round"
        />
        <g className="masthead-top-pip" transform="translate(160 8)">
          <circle r="2.6" fill="rgba(255, 246, 218, 0.78)" stroke="url(#masthead-gold)" strokeWidth="0.55" />
          <circle r="1.4" fill="rgba(167, 60, 44, 0.78)" />
          <circle r="0.4" fill="rgba(255, 248, 224, 0.95)" />
        </g>

        <text x="160" y="22" textAnchor="middle" className="masthead-half">
          folio lxxvii · caput xviii
        </text>

        <g className="folio-masthead-monogram" transform="translate(160 50)">
          <circle r="16" fill="url(#masthead-face)" />
          <circle r="14.5" fill="none" stroke="url(#masthead-gold)" strokeWidth="0.5" />
          <circle
            r="12.5"
            fill="none"
            stroke="url(#masthead-gold)"
            strokeWidth="0.22"
            strokeDasharray="0.4 1.2"
            opacity="0.78"
          />
          <circle r="7" fill="none" stroke="url(#masthead-gold)" strokeWidth="0.32" opacity="0.85" />
          <text x="-2.4" y="1.6" textAnchor="middle" className="masthead-letter">
            m
          </text>
          <text x="3.4" y="1.6" textAnchor="middle" className="masthead-roman">
            ·iii
          </text>
          <line
            x1="-5"
            y1="5"
            x2="5"
            y2="5"
            stroke="url(#masthead-gold)"
            strokeWidth="0.32"
            strokeLinecap="round"
            opacity="0.7"
          />
          <circle cx="0" cy="-10.4" r="0.55" fill="rgba(167, 60, 44, 0.78)" />
          <circle cx="10.4" cy="0" r="0.55" fill="rgba(167, 60, 44, 0.78)" />
          <circle cx="-10.4" cy="0" r="0.55" fill="rgba(167, 60, 44, 0.78)" />
          <circle cx="0" cy="10.4" r="0.55" fill="rgba(167, 60, 44, 0.78)" />
        </g>

        <text x="160" y="79" textAnchor="middle" className="masthead-base">
          {dayName}, the {dayOrdinal} of {monthName} · {h12}:{mm} {period}
        </text>
        <text x="160" y="89" textAnchor="middle" className="masthead-quote">
          ad lucem · perlege
        </text>

        <line
          x1="6"
          y1="93.5"
          x2="314"
          y2="93.5"
          stroke="url(#masthead-rule)"
          strokeWidth="0.5"
          strokeLinecap="round"
        />
        <g className="masthead-bottom-pips" fill="rgba(167, 60, 44, 0.5)">
          <circle cx="56" cy="93.5" r="0.55" />
          <circle cx="264" cy="93.5" r="0.55" />
        </g>
      </svg>

      <figcaption className="folio-masthead-cap">
        <span className="folio-masthead-cap-rule folio-masthead-cap-rule--left" />
        <span className="folio-masthead-cap-cluster">
          <em className="folio-masthead-cap-key">the folio opens</em>
          <span className="folio-masthead-cap-sep" aria-hidden="true">·</span>
          <em className="folio-masthead-cap-tail">a press, a chapter, an hour</em>
        </span>
        <span className="folio-masthead-cap-rule folio-masthead-cap-rule--right" />
      </figcaption>
    </figure>
  )
}

function PressHeadNote({
  visible,
  reduced,
  variant,
}: {
  visible: boolean
  reduced: boolean
  variant: 'recto' | 'verso'
}) {
  const isRecto = variant === 'recto'
  const cluster = isRecto
    ? {
        key: 'caput xviii · lxxvii',
        tail: 'the folio opens here',
        sigil: 'manu m · iii',
        glyph: '✦',
      }
    : {
        key: 'the reply',
        tail: 'set slowly · in this folio',
        sigil: 'manu m · iii',
        glyph: '✧',
      }

  return (
    <figure
      className={`press-head-note press-head-note--${variant}${
        visible ? ' is-visible' : ''
      }${reduced ? ' is-static' : ''}`}
      aria-hidden="true"
    >
      <span className="press-head-note-rule press-head-note-rule--left" />
      <span className="press-head-note-cluster">
        <em className="press-head-note-key">{cluster.key}</em>
        <span className="press-head-note-sep" aria-hidden="true">·</span>
        <em className="press-head-note-tail">{cluster.tail}</em>
        <span className="press-head-note-sigil" aria-hidden="true">
          <svg viewBox="0 0 16 16" focusable="false">
            <defs>
              <linearGradient id={`phn-${variant}-gold`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f6d076" />
                <stop offset="50%" stopColor="#c8923e" />
                <stop offset="100%" stopColor="#9c6e26" />
              </linearGradient>
            </defs>
            <circle
              cx="8"
              cy="8"
              r="7.2"
              fill="none"
              stroke={`url(#phn-${variant}-gold)`}
              strokeWidth="0.35"
              opacity="0.6"
            />
            <circle
              cx="8"
              cy="8"
              r="6.0"
              fill="none"
              stroke={`url(#phn-${variant}-gold)`}
              strokeWidth="0.22"
              strokeDasharray="0.4 1.1"
              opacity="0.7"
            />
            <g
              className="press-head-note-glyph"
              fill={`url(#phn-${variant}-gold)`}
            >
              <text
                x="8"
                y="9.4"
                textAnchor="middle"
                className="press-head-note-letter"
              >
                {cluster.glyph}
              </text>
            </g>
            <line
              x1="5"
              y1="11"
              x2="11"
              y2="11"
              stroke={`url(#phn-${variant}-gold)`}
              strokeWidth="0.22"
              strokeLinecap="round"
              opacity="0.65"
            />
          </svg>
        </span>
        <em className="press-head-note-mark">{cluster.sigil}</em>
      </span>
      <span className="press-head-note-rule press-head-note-rule--right" />
    </figure>
  )
}

function Epigraph() {
  return (
    <aside className="epigraph" aria-hidden="true">
      <span className="epigraph-rule epigraph-rule--top" />
      <p className="epigraph-line">
        <em className="epigraph-mark epigraph-mark--left">¶</em>
        <em className="epigraph-quote">{EPIGRAPH}</em>
        <em className="epigraph-mark epigraph-mark--right">¶</em>
      </p>
      <p className="epigraph-attribution">
        <em>set above the chapter, like a hand-set inscription</em>
      </p>
      <span className="epigraph-rule epigraph-rule--bottom" />
    </aside>
  )
}

function HourOfReading({ now }: { now: Date }) {
  const dayName = WEEKDAYS[now.getDay()].slice(0, 3).toLowerCase()
  const dayOrdinal = ORDINALS[Math.min(ORDINALS.length - 1, now.getDate() - 1)]
  const monthName = MONTHS[now.getMonth()].slice(0, 3).toLowerCase()
  const yearRoman = toRomanYear(now.getFullYear())
  const hour24 = now.getHours()
  const minutes = now.getMinutes()
  const period = hour24 >= 12 ? 'p.m.' : 'a.m.'
  const h12 = ((hour24 + 11) % 12) + 1
  const mm = String(minutes).padStart(2, '0')

  return (
    <aside className="hour-of-reading" aria-hidden="true">
      <span className="hour-of-reading-rule hour-of-reading-rule--left" />
      <span className="hour-of-reading-cluster">
        <span className="hour-of-reading-glyph" aria-hidden="true">
          <svg viewBox="0 0 22 16" focusable="false">
            <defs>
              <linearGradient id="hor-gold" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f6d076" />
                <stop offset="50%" stopColor="#c8923e" />
                <stop offset="100%" stopColor="#9c6e26" />
              </linearGradient>
            </defs>
            <circle cx="11" cy="8" r="6.2" fill="none" stroke="url(#hor-gold)" strokeWidth="0.55" />
            <circle cx="11" cy="8" r="6.2" fill="none" stroke="rgba(107, 74, 37, 0.18)" strokeWidth="0.3" strokeDasharray="0.4 1.2" />
            <line x1="11" y1="2.4" x2="11" y2="4.4" stroke="url(#hor-gold)" strokeWidth="0.55" strokeLinecap="round" />
            <line x1="11" y1="11.6" x2="11" y2="13.6" stroke="url(#hor-gold)" strokeWidth="0.55" strokeLinecap="round" />
            <line x1="2.4" y1="8" x2="4.4" y2="8" stroke="url(#hor-gold)" strokeWidth="0.55" strokeLinecap="round" />
            <line x1="17.6" y1="8" x2="19.6" y2="8" stroke="url(#hor-gold)" strokeWidth="0.55" strokeLinecap="round" />
            <line x1="11" y1="8" x2="11" y2="4.4" stroke="rgba(28, 30, 26, 0.92)" strokeWidth="0.55" strokeLinecap="round" />
            <line x1="11" y1="8" x2="13.6" y2="9.6" stroke="rgba(167, 60, 44, 0.92)" strokeWidth="0.45" strokeLinecap="round" />
            <circle cx="11" cy="8" r="0.6" fill="rgba(107, 74, 37, 0.92)" />
          </svg>
        </span>
        <em className="hour-of-reading-key">the hour of reading</em>
        <span className="hour-of-reading-sep" aria-hidden="true">·</span>
        <em className="hour-of-reading-day">{dayName}</em>
        <span className="hour-of-reading-tail">
          , the <em>{dayOrdinal}</em> of <em>{monthName}</em>
        </span>
        <span className="hour-of-reading-sep" aria-hidden="true">·</span>
        <em className="hour-of-reading-hour">{h12}</em>
        <span className="hour-of-reading-min">:{mm}</span>
        <em className="hour-of-reading-period">{period}</em>
        <span className="hour-of-reading-sep" aria-hidden="true">·</span>
        <em className="hour-of-reading-year">{yearRoman}</em>
        <span className="hour-of-reading-tail hour-of-reading-tail--quiet">
          · set in this browser
        </span>
      </span>
      <span className="hour-of-reading-rule hour-of-reading-rule--right" />
    </aside>
  )
}

function ReadingTally({ cycle }: { cycle: number }) {
  const sigils = ['¶', '†', '‡', '§', '⸺', '✦']
  const visible = Math.min(cycle + 1, sigils.length + 1)
  return (
    <p className={`reading-tally${cycle > 0 ? ' is-reread' : ''}`} aria-hidden="true">
      <span className="reading-tally-rule reading-tally-rule--left" />
      <span className="reading-tally-cluster">
        <span className="reading-tally-key">read</span>
        <span className="reading-tally-marks" aria-hidden="true">
          {Array.from({ length: sigils.length }, (_, i) => {
            const isLit = i < visible
            const isLatest = cycle > 0 && i === visible - 1
            return (
              <span
                key={i}
                className={`reading-tally-mark${isLit ? ' is-lit' : ' is-pending'}${
                  isLatest ? ' is-latest' : ''
                }`}
                style={{ '--mark-i': i } as React.CSSProperties}
              >
                <svg viewBox="0 0 14 14" focusable="false">
                  <circle
                    cx="7"
                    cy="7"
                    r="5.6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="0.45"
                    strokeDasharray={isLit ? '0' : '0.5 1.4'}
                  />
                  <text x="7" y="9.4" textAnchor="middle" className="reading-tally-glyph">
                    {sigils[i]}
                  </text>
                </svg>
              </span>
            )
          })}
        </span>
        <span className="reading-tally-tail">
          <em>{cycle === 0 ? 'awaiting the press' : `${visible} of ${sigils.length} impressions`}</em>
        </span>
      </span>
      <span className="reading-tally-rule reading-tally-rule--right" />
    </p>
  )
}

/* ──────────────────────────────────────────────────────────────────────
   iteration 149 · a refined specimen wordmark and a press key

   The recto title now earns two new composed elements:

   1. A small printer's specimen wordmark for "Minimax M3" — a hairline
      rule above and below, an italic wordmark set between them, with a
      small Roman numeral and a hand-drawn leaf beneath. It treats the
      model being tested as a real printer's specimen, not just a span
      styled with a hand-drawn rule.

   2. A single hand-drawn press key — a small leaf-and-key ornament
      that lives in the right margin of the title block as a quiet,
      memorable ornament. It draws the eye as a single, distinctive
      detail that earns its place beside the broadsheet drop cap.
   ────────────────────────────────────────────────────────────────────── */

function SpecimenWordmark({
  visible,
  reduced,
}: {
  visible: boolean
  reduced: boolean
}) {
  return (
    <figure
      className={`specimen-wordmark${visible ? ' is-visible' : ''}${
        reduced ? ' is-static' : ''
      }`}
      aria-hidden="true"
    >
      <svg
        className="specimen-wordmark-plate"
        viewBox="0 0 320 56"
        focusable="false"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="swm-rule" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(167, 60, 44, 0)" />
            <stop offset="14%" stopColor="rgba(167, 60, 44, 0.5)" />
            <stop offset="50%" stopColor="rgba(156, 110, 38, 0.62)" />
            <stop offset="86%" stopColor="rgba(167, 60, 44, 0.5)" />
            <stop offset="100%" stopColor="rgba(167, 60, 44, 0)" />
          </linearGradient>
          <linearGradient id="swm-gold" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f6d076" />
            <stop offset="50%" stopColor="#c8923e" />
            <stop offset="100%" stopColor="#9c6e26" />
          </linearGradient>
        </defs>

        <line
          x1="2"
          y1="6"
          x2="318"
          y2="6"
          stroke="url(#swm-rule)"
          strokeWidth="0.55"
          strokeLinecap="round"
        />
        <circle cx="160" cy="6" r="1.4" fill="url(#swm-gold)" />
        <circle cx="160" cy="6" r="0.5" fill="rgba(255, 248, 224, 0.95)" />

        <text x="160" y="32" textAnchor="middle" className="swm-text">
          Minimax M3
        </text>

        <line
          x1="2"
          y1="40"
          x2="318"
          y2="40"
          stroke="url(#swm-rule)"
          strokeWidth="0.32"
          strokeLinecap="round"
          strokeDasharray="0.6 1.4"
          opacity="0.7"
        />

        <g className="swm-leaf">
          <path
            d="M 152 48 Q 156 44 160 47 Q 164 44 168 48"
            fill="none"
            stroke="rgba(167, 60, 44, 0.6)"
            strokeWidth="0.45"
            strokeLinecap="round"
          />
          <path
            d="M 152 48 Q 156 52 160 49 Q 164 52 168 48"
            fill="none"
            stroke="rgba(167, 60, 44, 0.36)"
            strokeWidth="0.35"
            strokeLinecap="round"
          />
        </g>

        <text x="160" y="54" textAnchor="middle" className="swm-roman">
          specimen · no. xviii · set for the reader
        </text>
      </svg>
    </figure>
  )
}

/* ──────────────────────────────────────────────────────────────────────
   iteration 159 · the title's own composed press headline

   Replaces the stacked TitleRule + RectoCatchword + SpecimenWordmark
   with a single composed impression that does all three jobs in one
   typographic block: a horizontal gold rule that frames the press
   monogram, an italic catch that names the question, the specimen
   wordmark itself set between hairline rules, and a closing italic
   line naming the press's specimen number and reader. The composed
   impression earns its place as the title block's own quiet
   signature — a single piece of editorial typography, not three
   stacked ornaments.
   ────────────────────────────────────────────────────────────────────── */

function TitlePressHeadline({
  visible,
  reduced,
}: {
  visible: boolean
  reduced: boolean
}) {
  return (
    <figure
      className={`title-press-headline${visible ? ' is-visible' : ''}${
        reduced ? ' is-static' : ''
      }`}
      aria-hidden="true"
    >
      <svg
        className="title-press-headline-rule"
        viewBox="0 0 320 22"
        focusable="false"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="tph-rule" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(167, 60, 44, 0)" />
            <stop offset="14%" stopColor="rgba(167, 60, 44, 0.55)" />
            <stop offset="50%" stopColor="rgba(200, 146, 62, 0.74)" />
            <stop offset="86%" stopColor="rgba(167, 60, 44, 0.55)" />
            <stop offset="100%" stopColor="rgba(167, 60, 44, 0)" />
          </linearGradient>
          <linearGradient id="tph-rule-ghost" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(167, 60, 44, 0)" />
            <stop offset="50%" stopColor="rgba(167, 60, 44, 0.32)" />
            <stop offset="100%" stopColor="rgba(167, 60, 44, 0)" />
          </linearGradient>
          <linearGradient id="tph-gold" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f6d076" />
            <stop offset="50%" stopColor="#c8923e" />
            <stop offset="100%" stopColor="#9c6e26" />
          </linearGradient>
          <radialGradient id="tph-face" cx="50%" cy="34%" r="64%">
            <stop offset="0%" stopColor="rgba(255, 246, 218, 0.78)" />
            <stop offset="62%" stopColor="rgba(245, 220, 168, 0.32)" />
            <stop offset="100%" stopColor="rgba(214, 178, 116, 0)" />
          </radialGradient>
        </defs>
        <line
          x1="6"
          y1="14"
          x2="314"
          y2="14"
          stroke="url(#tph-rule-ghost)"
          strokeWidth="0.32"
          strokeDasharray="0.6 1.6"
          strokeLinecap="round"
        />
        <line
          x1="6"
          y1="11"
          x2="106"
          y2="11"
          stroke="url(#tph-rule)"
          strokeWidth="0.55"
          strokeLinecap="round"
          className="title-press-headline-rule-stroke"
        />
        <line
          x1="214"
          y1="11"
          x2="314"
          y2="11"
          stroke="url(#tph-rule)"
          strokeWidth="0.55"
          strokeLinecap="round"
          className="title-press-headline-rule-stroke"
        />
        <g className="title-press-headline-monogram" transform="translate(160 11)">
          <circle r="13" fill="url(#tph-face)" />
          <circle r="11.6" fill="none" stroke="url(#tph-gold)" strokeWidth="0.45" />
          <circle
            r="9.6"
            fill="none"
            stroke="url(#tph-gold)"
            strokeWidth="0.22"
            strokeDasharray="0.4 1.2"
            opacity="0.78"
          />
          <text x="-1" y="1.4" textAnchor="middle" className="tph-letter">
            m
          </text>
          <text x="4" y="1.4" textAnchor="middle" className="tph-letter-roman">
            ·iii
          </text>
          <line
            x1="-5"
            y1="4.2"
            x2="5"
            y2="4.2"
            stroke="url(#tph-gold)"
            strokeWidth="0.32"
            strokeLinecap="round"
            opacity="0.7"
          />
          <circle cx="0" cy="-7.4" r="0.45" fill="rgba(167, 60, 44, 0.6)" />
          <circle cx="7.4" cy="0" r="0.45" fill="rgba(167, 60, 44, 0.6)" />
          <circle cx="-7.4" cy="0" r="0.45" fill="rgba(167, 60, 44, 0.6)" />
          <circle cx="0" cy="7.4" r="0.45" fill="rgba(167, 60, 44, 0.6)" />
        </g>
      </svg>

      <p className="title-press-headline-caption">
        <em className="title-press-headline-key">the question</em>
        <span className="title-press-headline-sep" aria-hidden="true">·</span>
        <em className="title-press-headline-tail">set in this folio</em>
      </p>

      <div className="title-press-headline-specimen">
        <span className="title-press-headline-specimen-rule" aria-hidden="true" />
        <em className="title-press-headline-specimen-name">Minimax M3</em>
        <span className="title-press-headline-specimen-rule title-press-headline-specimen-rule--right" aria-hidden="true" />
      </div>

      <p className="title-press-headline-foot">
        <em className="title-press-headline-foot-key">specimen · no. xviii</em>
        <span className="title-press-headline-foot-sep" aria-hidden="true">·</span>
        <em className="title-press-headline-foot-tail">set for the reader</em>
      </p>
    </figure>
  )
}

/* ──────────────────────────────────────────────────────────────────────
   iteration 156 · the verso earns a twin specimen wordmark, completing
   the recto-verso opening-closing symmetry. The recto already closes its
   title block with a thin gold rule, a coral-marked specimen wordmark,
   and a press catchword (iteration 152-153). The verso opens with its
   own press head-note (iteration 155) and now closes its reply with a
   composed twin — the same idiom, but speaking in the reply voice: a
   delicate crescent glyph in the pin-prick (echoing the almanac and the
   hour-of-reading elsewhere on the page), the italic "the reply", and
   a roman foot set "relege · no. xviii · read once, then again". The
   folio now opens and closes on both spreads with the same composed
   hand.
   ────────────────────────────────────────────────────────────────────── */

function ReplySpecimen({
  visible,
  reduced,
}: {
  visible: boolean
  reduced: boolean
}) {
  return (
    <figure
      className={`reply-specimen${visible ? ' is-visible' : ''}${
        reduced ? ' is-static' : ''
      }`}
      aria-hidden="true"
    >
      <svg
        className="reply-specimen-plate"
        viewBox="0 0 320 56"
        focusable="false"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="rsp-rule" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(167, 60, 44, 0)" />
            <stop offset="14%" stopColor="rgba(167, 60, 44, 0.5)" />
            <stop offset="50%" stopColor="rgba(156, 110, 38, 0.62)" />
            <stop offset="86%" stopColor="rgba(167, 60, 44, 0.5)" />
            <stop offset="100%" stopColor="rgba(167, 60, 44, 0)" />
          </linearGradient>
          <linearGradient id="rsp-gold" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f6d076" />
            <stop offset="50%" stopColor="#c8923e" />
            <stop offset="100%" stopColor="#9c6e26" />
          </linearGradient>
        </defs>

        <line
          x1="2"
          y1="6"
          x2="318"
          y2="6"
          stroke="url(#rsp-rule)"
          strokeWidth="0.55"
          strokeLinecap="round"
        />
        <g className="rsp-pip">
          <circle cx="160" cy="6" r="1.4" fill="url(#rsp-gold)" />
          <path
            d="M 160.35 4.7 A 1.2 1.2 0 1 1 160.35 7.3 A 0.85 0.85 0 1 0 160.35 4.7 Z"
            fill="rgba(255, 248, 224, 0.95)"
          />
        </g>

        <text x="160" y="32" textAnchor="middle" className="rsp-text">
          the reply
        </text>

        <line
          x1="2"
          y1="40"
          x2="318"
          y2="40"
          stroke="url(#rsp-rule)"
          strokeWidth="0.32"
          strokeLinecap="round"
          strokeDasharray="0.6 1.4"
          opacity="0.7"
        />

        <g className="rsp-leaf">
          <path
            d="M 148 48 Q 154 44 160 47 Q 166 44 172 48"
            fill="none"
            stroke="rgba(167, 60, 44, 0.6)"
            strokeWidth="0.45"
            strokeLinecap="round"
          />
          <path
            d="M 148 48 Q 154 52 160 49 Q 166 52 172 48"
            fill="none"
            stroke="rgba(167, 60, 44, 0.36)"
            strokeWidth="0.35"
            strokeLinecap="round"
          />
        </g>

        <text x="160" y="54" textAnchor="middle" className="rsp-roman">
          relege · no. xviii · read once, then again
        </text>
      </svg>
    </figure>
  )
}

function PressKey({
  visible,
  reduced,
}: {
  visible: boolean
  reduced: boolean
}) {
  return (
    <figure
      className={`press-key${visible ? ' is-visible' : ''}${
        reduced ? ' is-static' : ''
      }`}
      aria-hidden="true"
    >
      <svg
        className="press-key-plate"
        viewBox="0 0 96 96"
        focusable="false"
      >
        <defs>
          <linearGradient id="pk-gold" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f6d076" />
            <stop offset="50%" stopColor="#c8923e" />
            <stop offset="100%" stopColor="#9c6e26" />
          </linearGradient>
          <linearGradient id="pk-gold-soft" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f5c65b" />
            <stop offset="100%" stopColor="#a47026" />
          </linearGradient>
          <radialGradient id="pk-halo" cx="50%" cy="50%" r="55%">
            <stop offset="0%" stopColor="rgba(255, 220, 150, 0.42)" />
            <stop offset="100%" stopColor="rgba(255, 220, 150, 0)" />
          </radialGradient>
        </defs>

        <ellipse cx="48" cy="48" rx="46" ry="46" fill="url(#pk-halo)" />

        <circle
          cx="48"
          cy="48"
          r="38"
          fill="rgba(255, 248, 224, 0.62)"
          stroke="url(#pk-gold)"
          strokeWidth="0.55"
        />
        <circle
          cx="48"
          cy="48"
          r="34"
          fill="none"
          stroke="url(#pk-gold)"
          strokeWidth="0.32"
          strokeDasharray="0.5 1.4"
          opacity="0.78"
        />

        <g
          className="press-key-bit"
          transform="translate(48 48) rotate(-22)"
        >
          <circle
            r="4.4"
            fill="none"
            stroke="url(#pk-gold)"
            strokeWidth="1.0"
          />
          <circle r="1.6" fill="rgba(107, 74, 37, 0.85)" />
          <line
            x1="0"
            y1="-22"
            x2="0"
            y2="-4.4"
            stroke="url(#pk-gold-soft)"
            strokeWidth="0.95"
            strokeLinecap="round"
          />
          <line
            x1="0"
            y1="4.4"
            x2="0"
            y2="22"
            stroke="url(#pk-gold-soft)"
            strokeWidth="0.95"
            strokeLinecap="round"
          />
          <line
            x1="-22"
            y1="0"
            x2="-4.4"
            y2="0"
            stroke="url(#pk-gold-soft)"
            strokeWidth="0.95"
            strokeLinecap="round"
          />
          <line
            x1="4.4"
            y1="0"
            x2="22"
            y2="0"
            stroke="url(#pk-gold-soft)"
            strokeWidth="0.95"
            strokeLinecap="round"
          />
          <line
            x1="15"
            y1="-15"
            x2="20"
            y2="-20"
            stroke="url(#pk-gold-soft)"
            strokeWidth="0.7"
            strokeLinecap="round"
            opacity="0.85"
          />
          <line
            x1="-15"
            y1="-15"
            x2="-20"
            y2="-20"
            stroke="url(#pk-gold-soft)"
            strokeWidth="0.7"
            strokeLinecap="round"
            opacity="0.85"
          />
        </g>

        <g
          className="press-key-leaf press-key-leaf--tr"
          transform="translate(72 18) rotate(20)"
        >
          <path
            d="M 0 0 Q 6 -6 12 -2 Q 10 4 0 0 Z"
            fill="rgba(217, 101, 74, 0.32)"
            stroke="rgba(107, 74, 37, 0.55)"
            strokeWidth="0.32"
          />
          <path
            d="M 2 -1 Q 6 -4 10 -2"
            fill="none"
            stroke="rgba(107, 74, 37, 0.55)"
            strokeWidth="0.3"
            strokeLinecap="round"
          />
        </g>
        <g
          className="press-key-leaf press-key-leaf--bl"
          transform="translate(22 78) rotate(-20)"
        >
          <path
            d="M 0 0 Q 6 -6 12 -2 Q 10 4 0 0 Z"
            fill="rgba(217, 101, 74, 0.32)"
            stroke="rgba(107, 74, 37, 0.55)"
            strokeWidth="0.32"
          />
          <path
            d="M 2 -1 Q 6 -4 10 -2"
            fill="none"
            stroke="rgba(107, 74, 37, 0.55)"
            strokeWidth="0.3"
            strokeLinecap="round"
          />
        </g>

        <g fill="url(#pk-gold-soft)">
          <circle cx="48" cy="9" r="0.55" />
          <circle cx="48" cy="87" r="0.55" />
          <circle cx="9" cy="48" r="0.5" />
          <circle cx="87" cy="48" r="0.5" />
        </g>
      </svg>
      <figcaption className="press-key-cap">
        <span className="press-key-cap-rule press-key-cap-rule--left" aria-hidden="true" />
        <span className="press-key-cap-text">
          <em className="press-key-cap-key">the press key</em>
          <span className="press-key-cap-sep" aria-hidden="true">·</span>
          <em className="press-key-cap-tail">set beside the question</em>
        </span>
        <span className="press-key-cap-rule press-key-cap-rule--right" aria-hidden="true" />
      </figcaption>
    </figure>
  )
}

/* ──────────────────────────────────────────────────────────────────────
   iteration 148 · a reading glance sits beneath the press instruction.

   A small horizontal whisper at the foot of the question panel. It
   tracks the answer's slow reveal — the right end is a quiet amber
   line that grows as more of the answer is set. The label shifts
   state (idle · reading · read) without becoming noisy. It is the
   recto's echo of the verso's reading tide, but smaller.
   ────────────────────────────────────────────────────────────────────── */

function ReadingGlance({
  progress,
  reduced,
}: {
  progress: number
  reduced: boolean
}) {
  const clamped = Math.max(0, Math.min(1, progress))
  const pct = Math.round(clamped * 100)
  const state =
    clamped <= 0.001 ? 'idle' : clamped >= 0.999 ? 'complete' : 'reading'
  const stateLabel =
    state === 'idle'
      ? 'awaiting the press'
      : state === 'complete'
        ? 'the page, read once'
        : 'the answer, setting'
  return (
    <aside
      className={`reading-glance is-${state}${reduced ? ' is-static' : ''}`}
      aria-hidden="true"
    >
      <span className="reading-glance-rule reading-glance-rule--left" />
      <span className="reading-glance-cluster">
        <em className="reading-glance-key">glance</em>
        <span className="reading-glance-sep" aria-hidden="true">·</span>
        <em className="reading-glance-state">{stateLabel}</em>
      </span>
      <span className="reading-glance-track" aria-hidden="true">
        <span
          className="reading-glance-fill"
          style={{ '--glance': clamped } as React.CSSProperties}
        >
          <span className="reading-glance-fill-head" />
        </span>
        <span
          className="reading-glance-fill-ticks"
          aria-hidden="true"
        >
          <span style={{ left: '25%' }} />
          <span style={{ left: '50%' }} />
          <span style={{ left: '75%' }} />
        </span>
      </span>
      <span className="reading-glance-pct" aria-hidden="true">
        <em>{String(pct).padStart(2, '0')}</em>
        <span className="reading-glance-pct-mark" aria-hidden="true">%</span>
      </span>
      <span className="reading-glance-rule reading-glance-rule--right" />
    </aside>
  )
}

function SpecimenImprint({
  cycle,
  breathing,
}: {
  cycle: number
  breathing: boolean
}) {
  const inscription =
    cycle === 0
      ? 'a specimen, printed for the first reader'
      : cycle === 1
        ? 'a specimen, pressed again — the reader slows'
        : `a specimen, pressed ${ordinal(cycle + 1)} times — the page unchanged`
  return (
    <p
      className={`specimen-imprint${cycle > 0 ? ' is-reread' : ''}${
        breathing ? ' is-breathing' : ''
      }`}
      aria-hidden="true"
    >
      <span className="specimen-imprint-rule specimen-imprint-rule--left" />
      <span className="specimen-imprint-text">
        <em className="specimen-imprint-key">specimen</em>
        <span className="specimen-imprint-roman">no. xviii</span>
        <em className="specimen-imprint-tail">{inscription}</em>
      </span>
      <span className="specimen-imprint-rule specimen-imprint-rule--right" />
    </p>
  )
}

function ReadingMoment({
  visible,
  cycle,
  now,
  firstMoment,
}: {
  visible: boolean
  cycle: number
  now: Date
  firstMoment: Date | null
}) {
  const hour24 = now.getHours()
  const minutes = now.getMinutes()
  const h12 = ((hour24 + 11) % 12) + 1
  const mm = String(minutes).padStart(2, '0')
  const period = hour24 >= 12 ? 'p.m.' : 'a.m.'
  const timeLabel = `${h12}:${mm} ${period}`
  const dayName = WEEKDAYS[now.getDay()].slice(0, 3).toLowerCase()
  const ordinalDay = ORDINALS[Math.min(ORDINALS.length - 1, now.getDate() - 1)]
  const monthName = MONTHS[now.getMonth()].slice(0, 3).toLowerCase()

  let label = ''
  let sub = ''
  if (firstMoment) {
    const firstHour = firstMoment.getHours()
    const firstMin = firstMoment.getMinutes()
    const firstH12 = ((firstHour + 11) % 12) + 1
    const firstMm = String(firstMin).padStart(2, '0')
    const firstPeriod = firstHour >= 12 ? 'p.m.' : 'a.m.'
    label = cycle === 0 ? 'first reading' : cycle === 1 ? 'second reading' : `${ordinal(cycle + 1)} reading`
    sub = `${dayName}, ${ordinalDay} of ${monthName} · opened ${firstH12}:${firstMm} ${firstPeriod}`
  } else {
    label = 'first reading'
    sub = `${dayName}, ${ordinalDay} of ${monthName} · awaiting the press`
  }

  return (
    <p
      className={`reading-moment${visible ? ' is-visible' : ''}${
        cycle > 0 ? ' is-reread' : ''
      }`}
      role="status"
      aria-live="polite"
      aria-label={`${label}, ${sub}`}
    >
      <span className="reading-moment-rule reading-moment-rule--left" aria-hidden="true" />
      <span className="reading-moment-cluster">
        <em className="reading-moment-key">{label}</em>
        <span className="reading-moment-sep" aria-hidden="true">·</span>
        <em className="reading-moment-sub">{sub}</em>
        <span className="reading-moment-now" aria-hidden="true">
          <span className="reading-moment-now-mark" />
          <em className="reading-moment-now-key">now</em>
          <em className="reading-moment-now-val">{timeLabel}</em>
        </span>
      </span>
      <span className="reading-moment-rule reading-moment-rule--right" aria-hidden="true" />
    </p>
  )
}

function RectoColophon({ visible, reduced }: { visible: boolean; reduced: boolean }) {
  return (
    <div
      className={`recto-colophon${visible ? ' is-visible' : ''}${
        reduced ? ' is-static' : ''
      }`}
      aria-hidden="true"
    >
      <span className="recto-colophon-rule" aria-hidden="true" />
      <span className="recto-colophon-cluster">
        <em className="recto-colophon-key">colophon</em>
        <span className="recto-colophon-sep" aria-hidden="true">·</span>
        <em className="recto-colophon-text">
          set in italic, in this folio
        </em>
        <span className="recto-colophon-sep recto-colophon-sep--tail" aria-hidden="true">·</span>
        <em className="recto-colophon-tail">
          for the attentive reader
        </em>
        <span className="recto-colophon-mark" aria-hidden="true">¶</span>
      </span>
    </div>
  )
}

function QuestionerMark({ visible, reduced }: { visible: boolean; reduced: boolean }) {
  return (
    <figure
      className={`questioner-mark${visible ? ' is-visible' : ''}${
        reduced ? ' is-static' : ''
      }`}
      aria-hidden="true"
    >
      <svg className="questioner-mark-card" viewBox="0 0 92 124" focusable="false">
        <defs>
          <linearGradient id="qmk-gold" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f6d076" />
            <stop offset="48%" stopColor="#c8923e" />
            <stop offset="100%" stopColor="#8a5d1f" />
          </linearGradient>
          <linearGradient id="qmk-gold-soft" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f5c65b" />
            <stop offset="100%" stopColor="#a47026" />
          </linearGradient>
          <radialGradient id="qmk-face" cx="50%" cy="22%" r="92%">
            <stop offset="0%" stopColor="rgba(255, 248, 224, 0.96)" />
            <stop offset="62%" stopColor="rgba(245, 220, 168, 0.78)" />
            <stop offset="100%" stopColor="rgba(214, 178, 116, 0.56)" />
          </radialGradient>
          <pattern id="qmk-grain" width="3" height="3" patternUnits="userSpaceOnUse">
            <circle cx="0.6" cy="0.4" r="0.32" fill="rgba(107, 74, 37, 0.05)" />
            <circle cx="2.2" cy="1.6" r="0.24" fill="rgba(107, 74, 37, 0.04)" />
          </pattern>
        </defs>

        <ellipse cx="46" cy="120" rx="34" ry="2.2" fill="rgba(40, 22, 8, 0.18)" />

        <rect
          x="2"
          y="2"
          width="88"
          height="118"
          rx="1.5"
          fill="url(#qmk-face)"
          stroke="url(#qmk-gold)"
          strokeWidth="0.85"
        />
        <rect
          x="2"
          y="2"
          width="88"
          height="118"
          rx="1.5"
          fill="url(#qmk-grain)"
          opacity="0.7"
        />
        <rect
          x="6"
          y="6"
          width="80"
          height="110"
          rx="1"
          fill="none"
          stroke="url(#qmk-gold)"
          strokeWidth="0.32"
          strokeDasharray="1.2 1.6"
          opacity="0.78"
        />

        <g className="qmk-corners" fill="#cf3b29" fillOpacity="0.55">
          <path d="M 9 9 L 16 9 Q 16 12.5 12.5 13.5 L 12.5 17 L 9 17 Z" />
          <circle cx="11" cy="11" r="0.6" />
          <path d="M 83 9 L 76 9 Q 76 12.5 79.5 13.5 L 79.5 17 L 83 17 Z" />
          <circle cx="81" cy="11" r="0.6" />
          <path d="M 9 113 L 16 113 Q 16 109.5 12.5 108.5 L 12.5 105 L 9 105 Z" />
          <circle cx="11" cy="111" r="0.6" />
          <path d="M 83 113 L 76 113 Q 76 109.5 79.5 108.5 L 79.5 105 L 83 105 Z" />
          <circle cx="81" cy="111" r="0.6" />
        </g>

        <g className="qmk-pips" fill="url(#qmk-gold-soft)">
          <circle cx="46" cy="9" r="0.7" />
          <circle cx="46" cy="113" r="0.7" />
          <circle cx="9" cy="60" r="0.6" />
          <circle cx="83" cy="60" r="0.6" />
        </g>

        <line x1="22" y1="22" x2="70" y2="22" stroke="url(#qmk-gold)" strokeWidth="0.4" strokeLinecap="round" />
        <circle cx="46" cy="22" r="1.2" fill="url(#qmk-gold)" />
        <line x1="36" y1="26" x2="56" y2="26" stroke="url(#qmk-gold)" strokeWidth="0.3" strokeDasharray="0.5 1.4" />

        <g className="qmk-glyph-group">
          <text x="46" y="72" textAnchor="middle" className="qmk-glyph">?</text>
          <path
            className="qmk-glyph-flourish"
            d="M 30 78 Q 40 84 50 80 Q 58 76 62 80"
            stroke="url(#qmk-gold)"
            strokeWidth="0.45"
            fill="none"
            strokeLinecap="round"
            opacity="0.7"
          />
        </g>

        <line x1="22" y1="88" x2="70" y2="88" stroke="url(#qmk-gold)" strokeWidth="0.4" strokeLinecap="round" />
        <text x="46" y="98" textAnchor="middle" className="qmk-label">the question</text>
        <text x="46" y="105" textAnchor="middle" className="qmk-label-sub">a mark of inquiry</text>
        <line x1="32" y1="109" x2="60" y2="109" stroke="url(#qmk-gold)" strokeWidth="0.3" strokeDasharray="0.4 1.4" opacity="0.7" />
      </svg>
    </figure>
  )
}

function SpecimenPlate({ visible, reduced }: { visible: boolean; reduced: boolean }) {
  return (
    <figure
      className={`specimen-plate${visible ? ' is-visible' : ''}${
        reduced ? ' is-static' : ''
      }`}
      aria-hidden="true"
    >
      <svg className="specimen-plate-card" viewBox="0 0 148 196" focusable="false">
        <defs>
          <linearGradient id="spec-plate-gold" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f6d076" />
            <stop offset="48%" stopColor="#c8923e" />
            <stop offset="100%" stopColor="#8a5d1f" />
          </linearGradient>
          <linearGradient id="spec-plate-gold-soft" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f5c65b" />
            <stop offset="100%" stopColor="#a47026" />
          </linearGradient>
          <radialGradient id="spec-plate-face" cx="50%" cy="22%" r="92%">
            <stop offset="0%" stopColor="rgba(255, 248, 224, 0.96)" />
            <stop offset="62%" stopColor="rgba(245, 220, 168, 0.78)" />
            <stop offset="100%" stopColor="rgba(214, 178, 116, 0.56)" />
          </radialGradient>
          <pattern id="spec-plate-grain" width="3" height="3" patternUnits="userSpaceOnUse">
            <circle cx="0.6" cy="0.4" r="0.32" fill="rgba(107, 74, 37, 0.05)" />
            <circle cx="2.2" cy="1.6" r="0.24" fill="rgba(107, 74, 37, 0.04)" />
          </pattern>
        </defs>

        <ellipse cx="74" cy="192" rx="46" ry="2.6" fill="rgba(40, 22, 8, 0.18)" />

        <rect
          x="2"
          y="2"
          width="144"
          height="190"
          rx="2"
          fill="url(#spec-plate-face)"
          stroke="url(#spec-plate-gold)"
          strokeWidth="0.85"
        />
        <rect
          x="2"
          y="2"
          width="144"
          height="190"
          rx="2"
          fill="url(#spec-plate-grain)"
          opacity="0.7"
        />
        <rect
          x="6"
          y="6"
          width="136"
          height="182"
          rx="1.5"
          fill="none"
          stroke="url(#spec-plate-gold)"
          strokeWidth="0.32"
          strokeDasharray="1.2 1.6"
          opacity="0.78"
        />

        <g className="spec-plate-corners" fill="#cf3b29" fillOpacity="0.55">
          <path d="M 9 9 L 16 9 Q 16 12.5 12.5 13.5 L 12.5 17 L 9 17 Z" />
          <circle cx="11" cy="11" r="0.6" />
          <path d="M 139 9 L 132 9 Q 132 12.5 135.5 13.5 L 135.5 17 L 139 17 Z" />
          <circle cx="137" cy="11" r="0.6" />
          <path d="M 9 187 L 16 187 Q 16 183.5 12.5 182.5 L 12.5 179 L 9 179 Z" />
          <circle cx="11" cy="185" r="0.6" />
          <path d="M 139 187 L 132 187 Q 132 183.5 135.5 182.5 L 135.5 179 L 139 179 Z" />
          <circle cx="137" cy="185" r="0.6" />
        </g>

        <g className="spec-plate-pips" fill="url(#spec-plate-gold-soft)">
          <circle cx="74" cy="9" r="0.7" />
          <circle cx="74" cy="187" r="0.7" />
          <circle cx="9" cy="98" r="0.6" />
          <circle cx="139" cy="98" r="0.6" />
        </g>

        <line x1="36" y1="22" x2="112" y2="22" stroke="url(#spec-plate-gold)" strokeWidth="0.45" strokeLinecap="round" />
        <circle cx="74" cy="22" r="1.4" fill="url(#spec-plate-gold)" />
        <line x1="58" y1="27" x2="90" y2="27" stroke="url(#spec-plate-gold)" strokeWidth="0.3" strokeDasharray="0.5 1.4" />

        <g className="spec-plate-display">
          <text x="74" y="68" textAnchor="middle" className="spec-plate-display-glyph">
            m
          </text>
          <text x="84" y="68" textAnchor="middle" className="spec-plate-display-roman">
            ·iii
          </text>
          <line x1="58" y1="76" x2="90" y2="76" stroke="url(#spec-plate-gold)" strokeWidth="0.55" strokeLinecap="round" />
        </g>

        <text x="74" y="92" textAnchor="middle" className="spec-plate-label">
          specimen · no. xviii
        </text>
        <text x="74" y="104" textAnchor="middle" className="spec-plate-label-sub">
          a study of a single question
        </text>

        <g className="spec-plate-rows" stroke="rgba(107, 74, 37, 0.22)" strokeWidth="0.3">
          <line x1="16" y1="116" x2="132" y2="116" strokeDasharray="1 1.4" />
          <line x1="16" y1="146" x2="132" y2="146" strokeDasharray="1 1.4" />
        </g>

        <g className="spec-plate-row spec-plate-row--set">
          <text x="16" y="128" className="spec-plate-key">set in</text>
          <text x="132" y="128" textAnchor="end" className="spec-plate-val">italic</text>
        </g>
        <g className="spec-plate-row spec-plate-row--weight">
          <text x="16" y="140" className="spec-plate-key">weight</text>
          <text x="132" y="140" textAnchor="end" className="spec-plate-val">semibold</text>
        </g>
        <g className="spec-plate-row spec-plate-row--measure">
          <text x="16" y="158" className="spec-plate-key">measure</text>
          <text x="132" y="158" textAnchor="end" className="spec-plate-val">36 em</text>
        </g>
        <g className="spec-plate-row spec-plate-row--paper">
          <text x="16" y="170" className="spec-plate-key">paper</text>
          <text x="132" y="170" textAnchor="end" className="spec-plate-val">laid · cream</text>
        </g>

        <line x1="32" y1="178" x2="116" y2="178" stroke="url(#spec-plate-gold)" strokeWidth="0.3" strokeDasharray="0.4 1.4" opacity="0.7" />

        <text x="74" y="187" textAnchor="middle" className="spec-plate-foot">
          studio · folio lxxvii
        </text>
      </svg>
    </figure>
  )
}

/* ──────────────────────────────────────────────────────────────────────
   iteration 140 · the verso earns a vade mecum
   A small manuscript card sits at the foot of the verso, after the
   reply. It is a key to the folio's own visual language: the drop
   cap, the marginal sigils, the italic note, the ruled hairline, the
   fleuron, and the wax stamp — each shown in miniature, with a short
   caption. The card arrives with the reply, in the same gold-and-
   cream palette as the rest of the folio, and reads as a printed
   specimen sheet, set by the printer for the reader's reference.
   ────────────────────────────────────────────────────────────────────── */

interface VadeRow {
  key: string
  mark: 'initial' | 'sigils' | 'italic' | 'rule' | 'fleuron' | 'wax'
  note: string
}

const VADE_ROWS: VadeRow[] = [
  { key: 'initial', mark: 'initial', note: 'gold leaf, on first word' },
  { key: 'sigils', mark: 'sigils', note: 'pilcrow · dagger · double-dagger' },
  { key: 'italic', mark: 'italic', note: 'a marginal voice' },
  { key: 'rule', mark: 'rule', note: 'solid hairline, with dotted trace' },
  { key: 'fleuron', mark: 'fleuron', note: 'an end ornament' },
  { key: 'wax', mark: 'wax', note: 'the reader’s mark' },
]

function VadeRowMark({ mark }: { mark: VadeRow['mark'] }) {
  if (mark === 'initial') {
    return (
      <svg viewBox="0 0 36 44" focusable="false" aria-hidden="true">
        <defs>
          <linearGradient id="vm-init-gold" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f5c65b" />
            <stop offset="50%" stopColor="#c8923e" />
            <stop offset="100%" stopColor="#9c6e26" />
          </linearGradient>
        </defs>
        <rect
          x="2"
          y="2"
          width="32"
          height="40"
          rx="1.2"
          fill="rgba(255, 248, 224, 0.94)"
          stroke="url(#vm-init-gold)"
          strokeWidth="0.55"
        />
        <rect
          x="5"
          y="5"
          width="26"
          height="34"
          rx="0.6"
          fill="none"
          stroke="url(#vm-init-gold)"
          strokeWidth="0.24"
          strokeDasharray="0.9 1.2"
          opacity="0.78"
        />
        <text
          x="18"
          y="32"
          textAnchor="middle"
          fill="url(#vm-init-gold)"
          fontSize="22"
          fontStyle="italic"
          fontWeight="700"
        >
          i
        </text>
      </svg>
    )
  }
  if (mark === 'sigils') {
    return (
      <span className="vade-mecum-sigils" aria-hidden="true">
        <em className="vade-mecum-sigil">¶</em>
        <em className="vade-mecum-sigil vade-mecum-sigil--dagger">†</em>
        <em className="vade-mecum-sigil vade-mecum-sigil--dbl">‡</em>
      </span>
    )
  }
  if (mark === 'italic') {
    return (
      <em className="vade-mecum-italic-sample" aria-hidden="true">
        the attentive reader
      </em>
    )
  }
  if (mark === 'rule') {
    return (
      <svg viewBox="0 0 80 6" focusable="false" aria-hidden="true" preserveAspectRatio="none">
        <line x1="2" y1="3" x2="78" y2="3" stroke="currentColor" strokeWidth="0.5" strokeLinecap="round" />
        <line x1="2" y1="5" x2="78" y2="5" stroke="currentColor" strokeWidth="0.22" strokeDasharray="0.6 1.4" opacity="0.6" />
        <circle cx="6" cy="3" r="0.5" fill="currentColor" />
        <circle cx="74" cy="3" r="0.5" fill="currentColor" />
      </svg>
    )
  }
  if (mark === 'fleuron') {
    return (
      <svg viewBox="0 0 56 12" focusable="false" aria-hidden="true">
        <path
          d="M 4 6 Q 10 1.5 14 6 Q 18 10.5 24 6"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.5"
          strokeLinecap="round"
        />
        <circle cx="14" cy="6" r="0.7" fill="currentColor" />
        <path
          d="M 32 6 Q 38 1.5 42 6 Q 46 10.5 52 6"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.5"
          strokeLinecap="round"
        />
        <circle cx="42" cy="6" r="0.7" fill="currentColor" />
      </svg>
    )
  }
  if (mark === 'wax') {
    return (
      <svg viewBox="0 0 26 26" focusable="false" aria-hidden="true">
        <defs>
          <radialGradient id="vm-wax" cx="50%" cy="34%" r="66%">
            <stop offset="0%" stopColor="rgba(186, 50, 30, 0.96)" />
            <stop offset="58%" stopColor="rgba(126, 30, 18, 0.96)" />
            <stop offset="100%" stopColor="rgba(58, 12, 6, 0.96)" />
          </radialGradient>
        </defs>
        <circle
          cx="13"
          cy="13"
          r="11"
          fill="url(#vm-wax)"
          stroke="rgba(40, 8, 4, 0.55)"
          strokeWidth="0.4"
        />
        <ellipse cx="11" cy="7.6" rx="6" ry="2.2" fill="rgba(255, 232, 200, 0.32)" />
        <circle
          cx="13"
          cy="13"
          r="7.6"
          fill="none"
          stroke="rgba(255, 232, 200, 0.3)"
          strokeWidth="0.3"
        />
        <text
          x="13"
          y="16.4"
          textAnchor="middle"
          fill="rgba(255, 232, 200, 0.95)"
          fontSize="8.6"
          fontStyle="italic"
          fontWeight="700"
        >
          m
        </text>
      </svg>
    )
  }
  return null
}

function VadeMecum({ visible, reduced }: { visible: boolean; reduced: boolean }) {
  return (
    <figure
      className={`vade-mecum${visible ? ' is-visible' : ''}${reduced ? ' is-static' : ''}`}
      aria-hidden="true"
    >
      <span className="vade-mecum-rule vade-mecum-rule--top" aria-hidden="true" />

      <header className="vade-mecum-head">
        <span className="vade-mecum-head-mark" aria-hidden="true">
          <svg viewBox="0 0 14 14" focusable="false">
            <circle cx="7" cy="7" r="5.6" fill="none" stroke="currentColor" strokeWidth="0.45" strokeDasharray="0.5 1.4" />
            <circle cx="7" cy="7" r="0.95" fill="currentColor" />
          </svg>
        </span>
        <span className="vade-mecum-head-text">
          <em className="vade-mecum-head-key">vade mecum</em>
          <span className="vade-mecum-head-sep" aria-hidden="true">·</span>
          <em className="vade-mecum-head-tail">a key to this folio</em>
        </span>
        <span className="vade-mecum-head-rule" aria-hidden="true" />
      </header>

      <ol className="vade-mecum-list">
        {VADE_ROWS.map((row, i) => (
          <li
            key={row.key}
            className="vade-mecum-row"
            style={{ '--i': i } as React.CSSProperties}
          >
            <span className="vade-mecum-row-key">{row.key}</span>
            <span className={`vade-mecum-row-mark vade-mecum-row-mark--${row.mark}`}>
              <VadeRowMark mark={row.mark} />
            </span>
            <span className="vade-mecum-row-note">{row.note}</span>
          </li>
        ))}
      </ol>

      <footer className="vade-mecum-foot" aria-hidden="true">
        <span className="vade-mecum-foot-rule vade-mecum-foot-rule--left" />
        <span className="vade-mecum-foot-cluster">
          <em className="vade-mecum-foot-key">printed for</em>
          <span className="vade-mecum-foot-sep" aria-hidden="true">·</span>
          <em className="vade-mecum-foot-tail">the reader, in this folio</em>
        </span>
        <span className="vade-mecum-foot-rule vade-mecum-foot-rule--right" />
      </footer>

      <span className="vade-mecum-rule vade-mecum-rule--bottom" aria-hidden="true" />
    </figure>
  )
}

function PressSignature({ cycle, slow }: { cycle: number; slow: boolean }) {
  const paths = [
    'M 4 22 Q 14 14 28 18 Q 38 22 46 12 Q 56 4 70 12 Q 80 20 92 14',
    'M 4 30 Q 22 36 38 32 Q 54 28 72 34 Q 86 38 96 32',
  ]
  return (
    <aside
      className={`press-signature${cycle > 0 ? ' is-reread' : ''}${
        slow ? ' is-slow' : ''
      }`}
      aria-hidden="true"
    >
      <svg
        className="press-signature-flourish"
        viewBox="0 0 100 44"
        focusable="false"
      >
        <defs>
          <linearGradient id="press-signature-ink" x1="0" y1="0" x2="1" y2="0.4">
            <stop offset="0%" stopColor="rgba(167, 60, 44, 0.0)" />
            <stop offset="14%" stopColor="rgba(167, 60, 44, 0.55)" />
            <stop offset="86%" stopColor="rgba(120, 30, 12, 0.6)" />
            <stop offset="100%" stopColor="rgba(120, 30, 12, 0.0)" />
          </linearGradient>
        </defs>
        <g
          className="press-signature-strokes"
          fill="none"
          stroke="url(#press-signature-ink)"
          strokeWidth="0.55"
          strokeLinecap="round"
        >
          {paths.map((d, i) => (
            <path key={i} d={d} className={`press-signature-stroke press-signature-stroke--${i}`} />
          ))}
        </g>
        <circle cx="50" cy="38" r="0.9" fill="rgba(120, 30, 12, 0.7)" className="press-signature-dot" />
      </svg>
      <span className="press-signature-script">
        <em className="press-signature-script-key">manu mea</em>
        <span className="press-signature-script-sep" aria-hidden="true">·</span>
        <em className="press-signature-script-tail">impressum · perlege</em>
      </span>
      <span className="press-signature-tag">
        <span className="press-signature-tag-mark" aria-hidden="true">¶</span>
        <em>the printer, signing off</em>
      </span>
    </aside>
  )
}

function WaxPressSeal({
  label,
  cycle,
  breaking,
  disabled,
  slow,
  onPress,
}: {
  label: string
  cycle: number
  breaking: boolean
  disabled: boolean
  slow: boolean
  onPress: () => void
}) {
  const impression =
    cycle === 0 ? 'first press' : cycle === 1 ? 'second press' : `${ordinal(cycle + 1)} press`
  return (
    <button
      type="button"
      className={`wax-seal${breaking ? ' is-breaking' : ''}${
        disabled ? ' is-sealed' : ''
      }${cycle > 0 ? ' is-reread' : ''}${slow ? ' is-slow' : ''}`}
      onClick={onPress}
      disabled={disabled || breaking}
      aria-label={label}
      aria-keyshortcuts="Space R"
      aria-describedby="reader-note"
    >
      <span className="wax-seal-stage" aria-hidden="true">
        <svg className="wax-seal-disc" viewBox="0 0 120 120" focusable="false">
          <defs>
            <radialGradient id="wps-rim" cx="50%" cy="35%" r="68%">
              <stop offset="0%" stopColor="rgba(176, 46, 28, 0.96)" />
              <stop offset="60%" stopColor="rgba(124, 30, 18, 0.96)" />
              <stop offset="100%" stopColor="rgba(58, 12, 6, 0.96)" />
            </radialGradient>
            <radialGradient id="wps-face" cx="42%" cy="32%" r="72%">
              <stop offset="0%" stopColor="rgba(220, 78, 48, 0.94)" />
              <stop offset="55%" stopColor="rgba(150, 36, 22, 0.96)" />
              <stop offset="100%" stopColor="rgba(76, 16, 8, 0.98)" />
            </radialGradient>
            <linearGradient id="wps-sheen" x1="0.4" y1="0" x2="0.6" y2="1">
              <stop offset="0%" stopColor="rgba(255, 220, 180, 0.32)" />
              <stop offset="100%" stopColor="rgba(255, 220, 180, 0)" />
            </linearGradient>
            <radialGradient id="wps-pip" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#f6d076" />
              <stop offset="55%" stopColor="#c8923e" />
              <stop offset="100%" stopColor="#9c6e26" />
            </radialGradient>
            <pattern id="wps-grain" width="3" height="3" patternUnits="userSpaceOnUse">
              <circle cx="0.6" cy="0.4" r="0.45" fill="rgba(255, 220, 180, 0.06)" />
              <circle cx="2.2" cy="1.6" r="0.35" fill="rgba(255, 220, 180, 0.05)" />
              <circle cx="1.4" cy="2.6" r="0.4" fill="rgba(255, 220, 180, 0.04)" />
            </pattern>
            <path id="wps-arc-top" d="M 60 60 m -42 0 a 42 42 0 0 1 84 0" fill="none" />
            <path id="wps-arc-bot" d="M 60 60 m -42 0 a 42 42 0 1 0 84 0" fill="none" />
            <clipPath id="wps-disc-clip">
              <circle cx="60" cy="60" r="56" />
            </clipPath>
            <clipPath id="wps-half-l">
              <path d="M 60 4 A 56 56 0 0 0 60 116 L 60 4 Z" />
            </clipPath>
            <clipPath id="wps-half-r">
              <path d="M 60 4 A 56 56 0 0 1 60 116 L 60 4 Z" />
            </clipPath>
          </defs>

          <g className="wps-disc-intact" clipPath="url(#wps-disc-clip)">
            <circle cx="60" cy="60" r="56" fill="url(#wps-rim)" />
            <circle cx="60" cy="60" r="56" fill="url(#wps-grain)" />
            <circle cx="60" cy="60" r="50" fill="url(#wps-face)" />
            <ellipse cx="55" cy="36" rx="34" ry="14" fill="url(#wps-sheen)" />

            <g className="wps-rim">
              <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255, 232, 178, 0.45)" strokeWidth="0.55" />
              <circle
                cx="60"
                cy="60"
                r="46"
                fill="none"
                stroke="rgba(255, 232, 178, 0.3)"
                strokeWidth="0.32"
                strokeDasharray="0.4 1.4"
              />
              <text className="wps-rim-text wps-rim-text--top">
                <textPath href="#wps-arc-top" startOffset="50%" textAnchor="middle">
                  press · ad lucem · press · ad lucem
                </textPath>
              </text>
              <text className="wps-rim-text wps-rim-text--bot">
                <textPath href="#wps-arc-bot" startOffset="50%" textAnchor="middle">
                  cap · xviii · lxxvii ·
                </textPath>
              </text>
            </g>

            <g className="wps-monogram">
              <line
                x1="46"
                y1="46"
                x2="74"
                y2="46"
                stroke="rgba(255, 232, 178, 0.32)"
                strokeWidth="0.55"
                strokeLinecap="round"
              />
              <text x="60" y="68" textAnchor="middle" className="wps-letter">
                m
              </text>
              <text
                x="68"
                y="68"
                textAnchor="middle"
                className="wps-letter wps-letter--roman"
              >
                ·iii
              </text>
              <line
                x1="46"
                y1="74"
                x2="74"
                y2="74"
                stroke="rgba(255, 232, 178, 0.32)"
                strokeWidth="0.55"
                strokeLinecap="round"
              />
              <text x="60" y="84" textAnchor="middle" className="wps-impression">
                {impression}
              </text>
            </g>

            <g className="wps-cracks">
              <path
                className="wps-crack wps-crack--1"
                d="M 60 8 L 58 30 L 64 48 L 54 66 L 60 86 L 56 110"
                stroke="rgba(40, 8, 4, 0.5)"
                strokeWidth="0.55"
                fill="none"
                strokeLinecap="round"
              />
              <path
                className="wps-crack wps-crack--2"
                d="M 60 8 L 56 28 L 60 42"
                stroke="rgba(40, 8, 4, 0.4)"
                strokeWidth="0.4"
                fill="none"
                strokeLinecap="round"
              />
              <path
                className="wps-crack wps-crack--3"
                d="M 8 60 L 30 58 L 46 62 L 64 56 L 84 60 L 110 60"
                stroke="rgba(40, 8, 4, 0.5)"
                strokeWidth="0.55"
                fill="none"
                strokeLinecap="round"
              />
              <path
                className="wps-crack wps-crack--4"
                d="M 28 30 L 40 40 L 50 36 L 60 44"
                stroke="rgba(40, 8, 4, 0.36)"
                strokeWidth="0.4"
                fill="none"
                strokeLinecap="round"
              />
              <path
                className="wps-crack wps-crack--5"
                d="M 92 30 L 80 40 L 76 50"
                stroke="rgba(40, 8, 4, 0.36)"
                strokeWidth="0.4"
                fill="none"
                strokeLinecap="round"
              />
              <path
                className="wps-crack wps-crack--6"
                d="M 36 92 L 50 84 L 60 90"
                stroke="rgba(40, 8, 4, 0.32)"
                strokeWidth="0.38"
                fill="none"
                strokeLinecap="round"
              />
              <path
                className="wps-crack wps-crack--7"
                d="M 84 92 L 70 84 L 60 90"
                stroke="rgba(40, 8, 4, 0.32)"
                strokeWidth="0.38"
                fill="none"
                strokeLinecap="round"
              />
            </g>

            <g className="wps-flecks" fill="rgba(40, 8, 4, 0.55)">
              <circle cx="14" cy="20" r="0.6" />
              <circle cx="100" cy="22" r="0.5" />
              <circle cx="106" cy="78" r="0.45" />
              <circle cx="18" cy="90" r="0.5" />
              <circle cx="92" cy="100" r="0.4" />
            </g>
          </g>

          <g className="wps-disc-broken" aria-hidden="true">
            <g className="wps-half wps-half--left">
              <g clipPath="url(#wps-half-l)">
                <circle cx="60" cy="60" r="56" fill="url(#wps-rim)" />
                <circle cx="60" cy="60" r="56" fill="url(#wps-grain)" />
                <circle cx="60" cy="60" r="50" fill="url(#wps-face)" />
                <ellipse cx="55" cy="36" rx="34" ry="14" fill="url(#wps-sheen)" />
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke="rgba(255, 232, 178, 0.45)"
                  strokeWidth="0.55"
                />
                <path
                  d="M 60 8 L 58 30 L 64 48 L 54 66 L 60 86"
                  stroke="rgba(40, 8, 4, 0.6)"
                  strokeWidth="0.55"
                  fill="none"
                  strokeLinecap="round"
                />
                <path
                  d="M 8 60 L 30 58 L 46 62"
                  stroke="rgba(40, 8, 4, 0.6)"
                  strokeWidth="0.55"
                  fill="none"
                  strokeLinecap="round"
                />
                <path
                  d="M 28 30 L 40 40 L 50 36 L 60 44"
                  stroke="rgba(40, 8, 4, 0.45)"
                  strokeWidth="0.4"
                  fill="none"
                  strokeLinecap="round"
                />
                <path
                  d="M 36 92 L 50 84 L 60 90"
                  stroke="rgba(40, 8, 4, 0.45)"
                  strokeWidth="0.4"
                  fill="none"
                  strokeLinecap="round"
                />
                <path
                  d="M 60 4 L 60 116"
                  stroke="rgba(255, 232, 178, 0.18)"
                  strokeWidth="0.45"
                  fill="none"
                />
              </g>
            </g>
            <g className="wps-half wps-half--right">
              <g clipPath="url(#wps-half-r)">
                <circle cx="60" cy="60" r="56" fill="url(#wps-rim)" />
                <circle cx="60" cy="60" r="56" fill="url(#wps-grain)" />
                <circle cx="60" cy="60" r="50" fill="url(#wps-face)" />
                <ellipse cx="55" cy="36" rx="34" ry="14" fill="url(#wps-sheen)" />
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke="rgba(255, 232, 178, 0.45)"
                  strokeWidth="0.55"
                />
                <path
                  d="M 60 8 L 58 30 L 64 48 L 54 66"
                  stroke="rgba(40, 8, 4, 0.6)"
                  strokeWidth="0.55"
                  fill="none"
                  strokeLinecap="round"
                />
                <path
                  d="M 46 62 L 64 56 L 84 60 L 110 60"
                  stroke="rgba(40, 8, 4, 0.6)"
                  strokeWidth="0.55"
                  fill="none"
                  strokeLinecap="round"
                />
                <path
                  d="M 92 30 L 80 40 L 76 50"
                  stroke="rgba(40, 8, 4, 0.45)"
                  strokeWidth="0.4"
                  fill="none"
                  strokeLinecap="round"
                />
                <path
                  d="M 84 92 L 70 84 L 60 90"
                  stroke="rgba(40, 8, 4, 0.45)"
                  strokeWidth="0.4"
                  fill="none"
                  strokeLinecap="round"
                />
                <path
                  d="M 60 4 L 60 116"
                  stroke="rgba(255, 232, 178, 0.18)"
                  strokeWidth="0.45"
                  fill="none"
                />
              </g>
            </g>
            <circle cx="60" cy="60" r="6" fill="rgba(255, 232, 178, 0.4)" className="wps-break-flash" />
          </g>

          <path
            className="wps-drip"
            d="M 56 112 Q 54 120 58 122 Q 62 120 60 112 Z"
            fill="url(#wps-rim)"
          />
        </svg>

        <span className="wps-chips" aria-hidden="true">
          <span className="wps-chip wps-chip--1" />
          <span className="wps-chip wps-chip--2" />
          <span className="wps-chip wps-chip--3" />
          <span className="wps-chip wps-chip--4" />
          <span className="wps-chip wps-chip--5" />
          <span className="wps-chip wps-chip--6" />
          <span className="wps-chip wps-chip--7" />
        </span>

        <span className="wps-dust" aria-hidden="true">
          <span className="wps-dust-mote wps-dust-mote--1" />
          <span className="wps-dust-mote wps-dust-mote--2" />
          <span className="wps-dust-mote wps-dust-mote--3" />
          <span className="wps-dust-mote wps-dust-mote--4" />
          <span className="wps-dust-mote wps-dust-mote--5" />
          <span className="wps-dust-mote wps-dust-mote--6" />
          <span className="wps-dust-mote wps-dust-mote--7" />
          <span className="wps-dust-mote wps-dust-mote--8" />
        </span>

        <span className="wps-smoke" aria-hidden="true">
          <svg className="wps-smoke-svg" viewBox="0 0 80 96" focusable="false" preserveAspectRatio="none">
            <defs>
              <linearGradient id="wps-smoke-grad" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor="rgba(167, 60, 44, 0.55)" />
                <stop offset="32%" stopColor="rgba(167, 60, 44, 0.28)" />
                <stop offset="72%" stopColor="rgba(217, 154, 84, 0.14)" />
                <stop offset="100%" stopColor="rgba(245, 198, 91, 0)" />
              </linearGradient>
            </defs>
            <path
              className="wps-smoke-wisp wps-smoke-wisp--a"
              d="M 40 90 C 36 76, 46 70, 42 56 C 38 44, 46 38, 44 26"
              fill="none"
              stroke="url(#wps-smoke-grad)"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
            <path
              className="wps-smoke-wisp wps-smoke-wisp--b"
              d="M 42 92 C 46 80, 38 74, 44 60 C 50 48, 42 40, 46 28"
              fill="none"
              stroke="url(#wps-smoke-grad)"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
          </svg>
        </span>
      </span>

      <span className="wax-seal-caption">
        <span className="wax-seal-label">{label}</span>
        <span className="wax-seal-keys" aria-hidden="true">
          <kbd>space</kbd>
        </span>
      </span>
    </button>
  )
}

function ReadingsCodex({
  readings,
  cycle,
}: {
  readings: Date[]
  cycle: number
}) {
  if (readings.length === 0) return null
  return (
    <aside
      className="readings-codex"
      role="status"
      aria-live="polite"
      aria-label={`codex of ${readings.length} reading${readings.length === 1 ? '' : 's'}`}
    >
      <header className="readings-codex-head">
        <span className="readings-codex-head-rule readings-codex-head-rule--left" aria-hidden="true" />
        <span className="readings-codex-head-cluster">
          <span className="readings-codex-head-mark" aria-hidden="true">
            <svg viewBox="0 0 12 12" focusable="false">
              <circle cx="6" cy="6" r="4.6" fill="none" stroke="currentColor" strokeWidth="0.4" strokeDasharray="0.4 1.4" />
              <circle cx="6" cy="6" r="0.9" fill="currentColor" />
            </svg>
          </span>
          <em className="readings-codex-head-key">codex</em>
          <span className="readings-codex-head-sep" aria-hidden="true">·</span>
          <em className="readings-codex-head-tail">a register of attentions</em>
        </span>
        <span className="readings-codex-head-rule readings-codex-head-rule--right" aria-hidden="true" />
      </header>

      <ol className="readings-codex-list" aria-hidden="true">
        {readings.map((date, i) => {
          const isLatest = i === readings.length - 1
          const roman = ROMAN[Math.min(i, ROMAN.length - 1)]
          const dayName = WEEKDAYS[date.getDay()]
          const monthName = MONTHS[date.getMonth()]
          const dayOrdinal = ORDINALS[Math.min(ORDINALS.length - 1, date.getDate() - 1)]
          const hour24 = date.getHours()
          const minutes = date.getMinutes()
          const period = hour24 >= 12 ? 'p.m.' : 'a.m.'
          const h12 = ((hour24 + 11) % 12) + 1
          const mm = String(minutes).padStart(2, '0')
          return (
            <li
              key={i}
              className={`readings-codex-row${isLatest ? ' is-latest' : ''}`}
              style={{ '--i': i } as React.CSSProperties}
            >
              <span className="readings-codex-numeral">{roman}.</span>
              <span className="readings-codex-day">
                <em>{dayName.slice(0, 3).toLowerCase()}</em>
                <span className="readings-codex-day-tail">
                  , the <em>{dayOrdinal}</em>
                </span>
                <span className="readings-codex-day-tail">
                  {' '}of <em>{monthName}</em>
                </span>
              </span>
              <span className="readings-codex-time">
                <em className="readings-codex-time-key">set at</em>
                <em className="readings-codex-time-h">{h12}</em>
                <span className="readings-codex-time-m">:{mm}</span>
                <em className="readings-codex-time-period">{period}</em>
              </span>
            </li>
          )
        })}
      </ol>

      <footer className="readings-codex-foot">
        <span className="readings-codex-foot-rule readings-codex-foot-rule--left" aria-hidden="true" />
        <span className="readings-codex-foot-cluster">
          <span className="readings-codex-foot-mark" aria-hidden="true">¶</span>
          <em className="readings-codex-foot-key">
            {cycle === 1 ? 'one reading' : `${ROMAN[Math.min(cycle - 1, ROMAN.length - 1)]} readings`}
          </em>
          <span className="readings-codex-foot-sep" aria-hidden="true">·</span>
          <em className="readings-codex-foot-tail">the page, unchanged</em>
        </span>
        <span className="readings-codex-foot-rule readings-codex-foot-rule--right" aria-hidden="true" />
      </footer>
    </aside>
  )
}

function PressInstructionPlate({
  cycle,
  phase,
  slow,
  items,
  buttonLabel,
  readerNote,
  readerSubNote,
  onRead,
  sealBreaking,
}: {
  cycle: number
  phase: Phase
  slow: boolean
  items: MarginaliaItem[]
  buttonLabel: string
  readerNote: string
  readerSubNote: string | null
  onRead: () => void
  sealBreaking: boolean
}) {
  const sealed = phase !== 'idle'
  return (
    <div
      className={`press-plate${sealed ? ' is-sealed' : ''}${
        cycle > 0 ? ' is-reread' : ''
      }${sealBreaking ? ' is-breaking' : ''}`}
    >
      <span className="press-plate-corner press-plate-corner--tl" aria-hidden="true">
        <svg viewBox="0 0 24 24" focusable="false">
          <path
            d="M 2 12 L 2 2 L 12 2"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.7"
            strokeLinecap="round"
          />
          <path
            d="M 5 12 L 5 5 L 12 5"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.32"
            opacity="0.55"
          />
          <circle cx="3.6" cy="3.6" r="0.7" fill="currentColor" />
        </svg>
      </span>
      <span className="press-plate-corner press-plate-corner--tr" aria-hidden="true">
        <svg viewBox="0 0 24 24" focusable="false">
          <path
            d="M 12 2 L 22 2 L 22 12"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.7"
            strokeLinecap="round"
          />
          <path
            d="M 12 5 L 19 5 L 19 12"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.32"
            opacity="0.55"
          />
          <circle cx="20.4" cy="3.6" r="0.7" fill="currentColor" />
        </svg>
      </span>
      <span className="press-plate-corner press-plate-corner--bl" aria-hidden="true">
        <svg viewBox="0 0 24 24" focusable="false">
          <path
            d="M 2 12 L 2 22 L 12 22"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.7"
            strokeLinecap="round"
          />
          <path
            d="M 5 12 L 5 19 L 12 19"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.32"
            opacity="0.55"
          />
          <circle cx="3.6" cy="20.4" r="0.7" fill="currentColor" />
        </svg>
      </span>
      <span className="press-plate-corner press-plate-corner--br" aria-hidden="true">
        <svg viewBox="0 0 24 24" focusable="false">
          <path
            d="M 12 22 L 22 22 L 22 12"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.7"
            strokeLinecap="round"
          />
          <path
            d="M 12 19 L 19 19 L 19 12"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.32"
            opacity="0.55"
          />
          <circle cx="20.4" cy="20.4" r="0.7" fill="currentColor" />
        </svg>
      </span>

      <header className="press-plate-head">
        <span className="press-plate-head-rule press-plate-head-rule--left" />
        <span className="press-plate-head-cluster">
          <svg className="press-plate-head-glyph" viewBox="0 0 24 12" focusable="false" aria-hidden="true">
            <g fill="currentColor">
              <path d="M 5 6 L 12 1 L 12 11 Z" opacity="0.85" />
              <path d="M 19 6 L 12 1 L 12 11 Z" opacity="0.85" />
              <circle cx="12" cy="6" r="0.9" fill="var(--paper)" />
            </g>
          </svg>
          <em className="press-plate-head-key">the press instruction</em>
          <span className="press-plate-head-sep" aria-hidden="true">·</span>
          <em className="press-plate-head-tail">
            {sealed ? 'the leaf is turning' : 'turn the leaf below'}
          </em>
        </span>
        <span className="press-plate-head-rule press-plate-head-rule--right" />
      </header>

      <ol className="press-plate-marks" aria-label="marginalia">
        {items.map((item, i) => (
          <li
            key={item.mark}
            className={`press-plate-mark press-plate-mark--${i}`}
            style={{ '--i': i } as React.CSSProperties}
          >
            <span
              className="press-plate-mark-note"
              data-gloss={item.gloss}
              tabIndex={0}
            >
              <span className="press-plate-mark-glyph" aria-hidden="true">
                {item.mark}
              </span>
              <span className="press-plate-mark-text">{item.note}</span>
            </span>
            {i < items.length - 1 && (
              <span className="press-plate-mark-dot" aria-hidden="true">
                ·
              </span>
            )}
          </li>
        ))}
      </ol>

      <div className="press-plate-divider" aria-hidden="true">
        <span className="press-plate-divider-line press-plate-divider-line--left" />
        <span className="press-plate-divider-orb" aria-hidden="true">
          <svg viewBox="0 0 12 12" focusable="false">
            <circle cx="6" cy="6" r="4.4" fill="none" stroke="currentColor" strokeWidth="0.4" strokeDasharray="0.5 1.2" />
            <circle cx="6" cy="6" r="1" fill="currentColor" />
          </svg>
        </span>
        <span className="press-plate-divider-line press-plate-divider-line--right" />
      </div>

      <div className="press-plate-action">
        <div className="press-plate-seal-wrap">
          <WaxPressSeal
            label={buttonLabel}
            cycle={cycle}
            breaking={sealBreaking}
            disabled={sealed && !sealBreaking && phase !== 'complete'}
            slow={slow}
            onPress={onRead}
          />
        </div>
        <p className="reader-note" id="reader-note">{readerNote}</p>
        {readerSubNote && (
          <p className="reader-sub-note">
            <span className="reader-sub-note-rule" />
            <em className="reader-sub-note-text">{readerSubNote}</em>
          </p>
        )}
      </div>

      <footer className="press-plate-foot">
        <span className="press-plate-foot-rule press-plate-foot-rule--left" />
        <span className="press-plate-foot-cluster">
          <span className="press-plate-foot-mark" aria-hidden="true">¶</span>
          <em className="press-plate-foot-key">explicit</em>
          <span className="press-plate-foot-sep" aria-hidden="true">·</span>
          <em className="press-plate-foot-tail">
            {cycle === 0
              ? 'the question, set'
              : cycle === 1
                ? 'the question, set again'
                : `the question, set ${ordinal(cycle + 1)} times`}
          </em>
          <svg
            className="press-plate-foot-fleuron"
            viewBox="0 0 24 12"
            focusable="false"
            aria-hidden="true"
          >
            <path
              d="M 4 6 Q 8 2 12 6 Q 16 10 20 6"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
              strokeLinecap="round"
            />
            <circle cx="12" cy="6" r="0.8" fill="currentColor" />
          </svg>
        </span>
        <span className="press-plate-foot-rule press-plate-foot-rule--right" />
      </footer>
    </div>
  )
}

function SpineThread({ stage, reduced }: { stage: number; reduced: boolean }) {
  const stageCount = 3
  const yPercent = Math.max(0, Math.min(1, stage / stageCount))
  const stitchCount = 9
  const stitches = Array.from({ length: stitchCount }, (_, i) => i)
  return (
    <span
      className={`spine-thread${reduced ? ' is-static' : ''}`}
      aria-hidden="true"
    >
      <svg viewBox="0 0 36 600" preserveAspectRatio="none" focusable="false">
        <defs>
          <linearGradient id="thread-gold" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(245, 198, 91, 0.55)" />
            <stop offset="40%" stopColor="rgba(200, 146, 62, 0.85)" />
            <stop offset="60%" stopColor="rgba(167, 60, 44, 0.7)" />
            <stop offset="100%" stopColor="rgba(245, 198, 91, 0.55)" />
          </linearGradient>
          <radialGradient id="thread-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(245, 198, 91, 0.42)" />
            <stop offset="60%" stopColor="rgba(245, 198, 91, 0.12)" />
            <stop offset="100%" stopColor="rgba(245, 198, 91, 0)" />
          </radialGradient>
        </defs>
        <line
          x1="18"
          y1="0"
          x2="18"
          y2="600"
          stroke="url(#thread-gold)"
          strokeWidth="0.4"
          strokeDasharray="1.4 2.2"
          opacity="0.55"
        />
        {stitches.map((i) => {
          const y = (i + 0.5) * (600 / stitchCount)
          const len = 18
          return (
            <line
              key={i}
              x1={18 - len / 2}
              y1={y}
              x2={18 + len / 2}
              y2={y}
              stroke="url(#thread-gold)"
              strokeWidth="0.55"
              strokeLinecap="round"
              opacity={i % 2 === 0 ? 0.78 : 0.55}
            />
          )
        })}
        <circle
          cx="18"
          cy={yPercent * 600}
          r="9"
          fill="url(#thread-glow)"
          className="spine-thread-pulse"
        />
      </svg>
    </span>
  )
}

function FingerSmudges({ visible }: { visible: boolean }) {
  if (!visible) return null
  return (
    <div className="finger-smudges" aria-hidden="true">
      <svg
        viewBox="0 0 96 36"
        className="finger-smudge finger-smudge--bl"
        focusable="false"
      >
        <defs>
          <radialGradient id="smudge-bl" cx="50%" cy="50%" r="55%">
            <stop offset="0%" stopColor="rgba(40, 22, 8, 0.22)" />
            <stop offset="65%" stopColor="rgba(40, 22, 8, 0.08)" />
            <stop offset="100%" stopColor="rgba(40, 22, 8, 0)" />
          </radialGradient>
        </defs>
        <ellipse cx="22" cy="20" rx="14" ry="4.4" fill="url(#smudge-bl)" transform="rotate(-12 22 20)" />
        <ellipse cx="56" cy="22" rx="16" ry="3.8" fill="url(#smudge-bl)" transform="rotate(-4 56 22)" />
        <ellipse cx="86" cy="18" rx="6" ry="2.4" fill="url(#smudge-bl)" transform="rotate(8 86 18)" opacity="0.7" />
      </svg>
      <svg
        viewBox="0 0 96 36"
        className="finger-smudge finger-smudge--tr"
        focusable="false"
      >
        <defs>
          <radialGradient id="smudge-tr" cx="50%" cy="50%" r="55%">
            <stop offset="0%" stopColor="rgba(40, 22, 8, 0.18)" />
            <stop offset="65%" stopColor="rgba(40, 22, 8, 0.06)" />
            <stop offset="100%" stopColor="rgba(40, 22, 8, 0)" />
          </radialGradient>
        </defs>
        <ellipse cx="10" cy="14" rx="5" ry="2.4" fill="url(#smudge-tr)" transform="rotate(-8 10 14)" opacity="0.7" />
        <ellipse cx="40" cy="16" rx="14" ry="3.6" fill="url(#smudge-tr)" transform="rotate(6 40 16)" />
        <ellipse cx="74" cy="14" rx="12" ry="3.4" fill="url(#smudge-tr)" transform="rotate(10 74 14)" />
      </svg>
    </div>
  )
}

function AlmanacPlateFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="almanac-plate" aria-hidden="false">
      <svg className="almanac-plate-corner almanac-plate-corner--tl" viewBox="0 0 32 32" focusable="false">
        <path d="M 2 14 L 2 2 L 14 2" fill="none" stroke="currentColor" strokeWidth="0.7" />
        <path d="M 6 14 L 6 6 L 14 6" fill="none" stroke="currentColor" strokeWidth="0.35" opacity="0.6" />
        <circle cx="4" cy="4" r="0.9" fill="currentColor" />
      </svg>
      <svg className="almanac-plate-corner almanac-plate-corner--tr" viewBox="0 0 32 32" focusable="false">
        <path d="M 18 2 L 30 2 L 30 14" fill="none" stroke="currentColor" strokeWidth="0.7" />
        <path d="M 18 6 L 26 6 L 26 14" fill="none" stroke="currentColor" strokeWidth="0.35" opacity="0.6" />
        <circle cx="28" cy="4" r="0.9" fill="currentColor" />
      </svg>
      <svg className="almanac-plate-corner almanac-plate-corner--bl" viewBox="0 0 32 32" focusable="false">
        <path d="M 2 18 L 2 30 L 14 30" fill="none" stroke="currentColor" strokeWidth="0.7" />
        <path d="M 6 18 L 6 26 L 14 26" fill="none" stroke="currentColor" strokeWidth="0.35" opacity="0.6" />
        <circle cx="4" cy="28" r="0.9" fill="currentColor" />
      </svg>
      <svg className="almanac-plate-corner almanac-plate-corner--br" viewBox="0 0 32 32" focusable="false">
        <path d="M 18 30 L 30 30 L 30 18" fill="none" stroke="currentColor" strokeWidth="0.7" />
        <path d="M 18 26 L 26 26 L 26 18" fill="none" stroke="currentColor" strokeWidth="0.35" opacity="0.6" />
        <circle cx="28" cy="28" r="0.9" fill="currentColor" />
      </svg>
      {children}
    </div>
  )
}

function Bookplate({ cycle }: { cycle: number }) {
  return (
    <div className="bookplate" aria-hidden="true">
      <svg className="bookplate-plate" viewBox="0 0 110 70" focusable="false">
        <defs>
          <linearGradient id="bookplate-gold" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f5c65b" />
            <stop offset="50%" stopColor="#c8923e" />
            <stop offset="100%" stopColor="#9c6e26" />
          </linearGradient>
        </defs>
        <rect
          x="2"
          y="2"
          width="106"
          height="66"
          fill="none"
          stroke="url(#bookplate-gold)"
          strokeWidth="0.7"
        />
        <rect
          x="6"
          y="6"
          width="98"
          height="58"
          fill="none"
          stroke="url(#bookplate-gold)"
          strokeWidth="0.3"
          strokeDasharray="0.6 1.4"
          opacity="0.7"
        />
        <g fill="url(#bookplate-gold)">
          <circle cx="9" cy="9" r="0.8" />
          <circle cx="101" cy="9" r="0.8" />
          <circle cx="9" cy="61" r="0.8" />
          <circle cx="101" cy="61" r="0.8" />
        </g>
        <g className="bookplate-laurel" stroke="url(#bookplate-gold)" strokeWidth="0.55" fill="none" strokeLinecap="round">
          <path d="M 28 36 Q 22 30 28 22" />
          <path d="M 82 36 Q 88 30 82 22" />
          <ellipse cx="24" cy="30" rx="2" ry="0.8" transform="rotate(-50 24 30)" fill="url(#bookplate-gold)" stroke="none" />
          <ellipse cx="26" cy="34" rx="1.8" ry="0.7" transform="rotate(-30 26 34)" fill="url(#bookplate-gold)" stroke="none" />
          <ellipse cx="86" cy="30" rx="2" ry="0.8" transform="rotate(50 86 30)" fill="url(#bookplate-gold)" stroke="none" />
          <ellipse cx="84" cy="34" rx="1.8" ry="0.7" transform="rotate(30 84 34)" fill="url(#bookplate-gold)" stroke="none" />
        </g>
        <g className="bookplate-monogram" fill="url(#bookplate-gold)">
          <text x="55" y="42" textAnchor="middle" className="bookplate-letter">m</text>
          <text x="64" y="42" textAnchor="middle" className="bookplate-letter bookplate-letter--roman">·iii</text>
        </g>
        <line x1="32" y1="48" x2="78" y2="48" stroke="url(#bookplate-gold)" strokeWidth="0.4" strokeLinecap="round" opacity="0.8" />
        <text x="55" y="58" textAnchor="middle" className="bookplate-tag">
          {cycle > 0 ? 'pressed again' : 'pressed once'}
        </text>
      </svg>
      <span className="bookplate-shadow" aria-hidden="true" />
    </div>
  )
}

function ordinal(n: number) {
  const s = ['th', 'st', 'nd', 'rd']
  const v = n % 100
  return n + (s[(v - 20) % 10] ?? s[v] ?? s[0])
}

const ROMAN = ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii', 'ix', 'x']

const WEEKDAYS = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday',
  'Thursday', 'Friday', 'Saturday',
]
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]
const ORDINALS = [
  'first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh',
  'eighth', 'ninth', 'tenth', 'eleventh', 'twelfth', 'thirteenth',
  'fourteenth', 'fifteenth', 'sixteenth', 'seventeenth', 'eighteenth',
  'nineteenth', 'twentieth', 'twenty-first', 'twenty-second', 'twenty-third',
  'twenty-fourth', 'twenty-fifth', 'twenty-sixth', 'twenty-seventh',
  'twenty-eighth', 'twenty-ninth', 'thirtieth', 'thirty-first',
]

function toRomanYear(year: number): string {
  const map: Array<[number, string]> = [
    [1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'],
    [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'],
    [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I'],
  ]
  let result = ''
  let n = Math.max(1, Math.floor(year))
  for (const [value, sym] of map) {
    while (n >= value) {
      result += sym
      n -= value
    }
  }
  return result
}

function ReadingLines({
  count,
  visible,
}: {
  count: number
  visible: boolean
}) {
  const lines = Math.min(count, ROMAN.length)
  return (
    <ol
      className={`reading-lines${visible ? ' is-visible' : ''}`}
      aria-hidden="true"
    >
      {Array.from({ length: lines }, (_, i) => (
        <li
          key={i}
          className="reading-line"
          style={{ '--i': i } as React.CSSProperties}
        >
          <span className="reading-line-rule" />
          <span className="reading-line-mark">
            <span className="reading-line-pilcrow">¶</span>
            <span className="reading-line-numeral">{ROMAN[i]}</span>
          </span>
        </li>
      ))}
    </ol>
  )
}

function VersoMarginRule({ visible, cycle }: { visible: boolean; cycle: number }) {
  return (
    <span
      className={`verso-margin-rule${visible ? ' is-visible' : ''}`}
      aria-hidden="true"
    >
      <span className="verso-margin-rule-line" />
      <span className="verso-margin-rule-tick verso-margin-rule-tick--a">
        <span className="verso-margin-rule-tick-mark" />
        <em className="verso-margin-rule-tick-key">the answer</em>
      </span>
      <span className="verso-margin-rule-tick verso-margin-rule-tick--b">
        <span className="verso-margin-rule-tick-mark" />
        <em className="verso-margin-rule-tick-key">the reply</em>
      </span>
      {cycle > 0 && (
        <span className="verso-margin-rule-tick verso-margin-rule-tick--reader">
          <span className="verso-margin-rule-tick-mark" />
          <em className="verso-margin-rule-tick-key">the reader, marked</em>
        </span>
      )}
      <span className="verso-margin-rule-tick verso-margin-rule-tick--c">
        <span className="verso-margin-rule-tick-mark" />
        <em className="verso-margin-rule-tick-key">cap · xviii</em>
      </span>
    </span>
  )
}

function ReaderNote({
  visible,
  cycle,
  reduced,
}: {
  visible: boolean
  cycle: number
  reduced: boolean
}) {
  const firstLine =
    cycle === 0
      ? 'the page, once set, is set —'
      : 'the page is patient —'
  const secondLine =
    cycle === 0
      ? 'what changes is the reader.'
      : 'read again; it has not moved.'
  return (
    <aside
      className={`page-voice${visible ? ' is-visible' : ''}${
        cycle > 0 ? ' is-reread' : ''
      }${reduced ? ' is-static' : ''}`}
      aria-hidden="true"
    >
      <span className="page-voice-rule page-voice-rule--left" aria-hidden="true" />
      <span className="page-voice-cluster">
        <span className="page-voice-mark" aria-hidden="true">
          <svg viewBox="0 0 14 14" focusable="false">
            <circle
              cx="7"
              cy="7"
              r="5.6"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.45"
              strokeDasharray="0.5 1.4"
            />
            <circle cx="7" cy="7" r="0.95" fill="currentColor" />
          </svg>
        </span>
        <span className="page-voice-lines">
          <em className="page-voice-line page-voice-line--one">{firstLine}</em>
          <em className="page-voice-line page-voice-line--two">{secondLine}</em>
        </span>
        <span className="page-voice-attribution" aria-hidden="true">
          <span className="page-voice-attribution-rule" />
          <em className="page-voice-attribution-key">a note, in the reader's hand</em>
          <span className="page-voice-attribution-mark">¶</span>
        </span>
      </span>
      <span className="page-voice-rule page-voice-rule--right" aria-hidden="true" />
    </aside>
  )
}

function RectoEdgeShadow({ active }: { active: boolean }) {
  return (
    <span
      className={`recto-edge-shadow${active ? ' is-active' : ''}`}
      aria-hidden="true"
    />
  )
}

function ReadingTrace({ cycle, reduced }: { cycle: number; reduced: boolean }) {
  const count = Math.min(4, cycle)
  if (count === 0) return null
  return (
    <div
      className="reading-trace"
      role="status"
      aria-live="polite"
      aria-label={`${count} re-reading${count === 1 ? '' : 's'} recorded`}
    >
      <span className="reading-trace-label" aria-hidden="true">trace</span>
      <span className="reading-trace-row">
        {Array.from({ length: count }, (_, i) => (
          <span
            key={i}
            className="reading-trace-dot"
            style={{ '--i': i } as React.CSSProperties}
          >
            <svg viewBox="0 0 12 14" focusable="false">
              <ellipse
                cx="6"
                cy="7"
                rx="3.4"
                ry="4.6"
                fill="rgba(17, 32, 42, 0.18)"
              />
              <ellipse
                cx="6"
                cy="7"
                rx="2.4"
                ry="3.4"
                fill="rgba(17, 32, 42, 0.32)"
              />
              <path
                d="M 5 4 Q 3 7 4 11"
                stroke="rgba(17, 32, 42, 0.42)"
                strokeWidth="0.45"
                fill="none"
                strokeLinecap="round"
              />
              <path
                d="M 7 4 Q 9 7 8 11"
                stroke="rgba(17, 32, 42, 0.42)"
                strokeWidth="0.45"
                fill="none"
                strokeLinecap="round"
              />
            </svg>
          </span>
        ))}
      </span>
      <span className="reading-trace-count" aria-hidden="true">
        {count} re-read{count === 1 ? '' : 's'}
      </span>
    </div>
  )
}

interface TideStation {
  roman: string
  name: string
  key: string
  glyph: React.ReactNode
}

const TIDE_STATIONS: TideStation[] = [
  {
    roman: 'i',
    name: 'the question',
    key: 'sec-question',
    glyph: (
      <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
        <path
          d="M 9 8 Q 9 5 12 5 Q 15 5 15 8 Q 15 11 12 12 L 12 14"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.9"
          strokeLinecap="round"
        />
        <circle cx="12" cy="17.4" r="0.9" fill="currentColor" />
      </svg>
    ),
  },
  {
    roman: 'ii',
    name: 'the press',
    key: 'sec-marginalia',
    glyph: (
      <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
        <circle cx="12" cy="12" r="6.4" fill="currentColor" fillOpacity="0.18" stroke="currentColor" strokeWidth="0.9" />
        <circle cx="12" cy="12" r="2.2" fill="currentColor" />
        <path d="M 12 4.6 L 12 3 M 12 19.4 L 12 21 M 4.6 12 L 3 12 M 19.4 12 L 21 12" stroke="currentColor" strokeWidth="0.7" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    roman: 'iii',
    name: 'the answer',
    key: 'sec-answer',
    glyph: (
      <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
        <path
          d="M 4 11 L 9 17 L 20 6"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.9"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M 4 19 L 20 19" stroke="currentColor" strokeWidth="0.45" strokeDasharray="1 1.6" opacity="0.6" />
      </svg>
    ),
  },
  {
    roman: 'iv',
    name: 'the reply',
    key: 'sec-reply',
    glyph: (
      <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
        <path
          d="M 3 6 Q 9 4 12 8 Q 15 12 21 10"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.9"
          strokeLinecap="round"
        />
        <path
          d="M 21 7.5 L 21.5 11 L 18 10.4"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    roman: 'v',
    name: 'the colophon',
    key: 'sec-almanac',
    glyph: (
      <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
        <path
          d="M 12 3 L 14.2 9.4 L 21 9.6 L 15.6 13.6 L 17.6 20 L 12 16.2 L 6.4 20 L 8.4 13.6 L 3 9.6 L 9.8 9.4 Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.85"
          strokeLinejoin="round"
        />
        <circle cx="12" cy="12" r="1.2" fill="currentColor" />
      </svg>
    ),
  },
]

const TIDE_BEAT_COUNT = TIDE_STATIONS.length - 1

function ReaderTide({
  phase,
  slow,
  cycle,
  activeSection,
  onSelect,
  reduced,
  answerChars,
  replyChars,
}: {
  phase: Phase
  slow: boolean
  cycle: number
  activeSection: string
  onSelect: (id: string) => void
  reduced: boolean
  answerChars: number
  replyChars: number
}) {
  const activeIndex = Math.max(
    0,
    TIDE_STATIONS.findIndex((s) => s.key === activeSection),
  )
  const progressRatio = Math.max(
    0,
    Math.min(
      1,
      phase === 'idle'
        ? 0
        : phase === 'answering'
          ? ANSWER.length > 0
            ? Math.min(1, answerChars / ANSWER.length)
            : 0
          : phase === 'replying'
            ? 0.6 + Math.min(
                0.35,
                REPLY.length > 0 ? (replyChars / REPLY.length) * 0.35 : 0,
              )
          : 1,
    ),
  )
  const beat = progressRatio * TIDE_BEAT_COUNT

  const position = beat / TIDE_BEAT_COUNT
  const tidePath = useMemo(() => {
    const w = 100
    const h = 12
    const cy = h / 2
    const amp = 2.6
    const segs = 28
    let d = `M 0 ${cy.toFixed(2)}`
    for (let i = 1; i <= segs; i++) {
      const x = (i / segs) * w
      const phaseStep = (i / segs) * Math.PI * 4.4
      const y = cy + Math.sin(phaseStep) * amp * (0.78 + 0.22 * Math.sin(i * 0.4))
      d += ` L ${x.toFixed(2)} ${y.toFixed(2)}`
    }
    return d
  }, [])

  const vesselX = (position * 100).toFixed(2)
  const vesselLabel =
    phase === 'idle'
      ? 'awaiting the press'
      : phase === 'answering'
        ? 'the answer, setting'
        : phase === 'replying'
          ? 'the reply, slow'
          : slow
            ? 'page pace · colophon'
            : 'second reading · colophon'

  return (
    <nav
      className={`reader-tide${reduced ? ' is-static' : ''}`}
      aria-label="reading tide · progress through the folio"
    >
      <span className="reader-tide-rule reader-tide-rule--top" aria-hidden="true" />
      <span className="reader-tide-head">
        <span className="reader-tide-head-key">reading tide</span>
        <span className="reader-tide-head-sep" aria-hidden="true">·</span>
        <span className="reader-tide-head-tail">{vesselLabel}</span>
        <span className="reader-tide-head-count" aria-hidden="true">
          {TIDE_STATIONS[Math.min(beat, TIDE_STATIONS.length - 1)].roman} / {ROMAN[TIDE_STATIONS.length - 1]}
        </span>
      </span>

      <div className="reader-tide-stage">
        <svg
          className="reader-tide-line"
          viewBox="0 0 100 14"
          preserveAspectRatio="none"
          focusable="false"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="tide-ink" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="rgba(167, 60, 44, 0.85)" />
              <stop offset="50%" stopColor="rgba(156, 110, 38, 0.95)" />
              <stop offset="100%" stopColor="rgba(245, 198, 91, 0.92)" />
            </linearGradient>
            <linearGradient id="tide-faded" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="rgba(107, 74, 37, 0.42)" />
              <stop offset="100%" stopColor="rgba(107, 74, 37, 0.42)" />
            </linearGradient>
          </defs>
          <path
            d={tidePath}
            className="reader-tide-line-faded"
            stroke="url(#tide-faded)"
            strokeWidth="0.45"
            strokeDasharray="0.8 1.4"
            fill="none"
          />
          <path
            d={tidePath}
            className="reader-tide-line-active"
            stroke="url(#tide-ink)"
            strokeWidth="0.7"
            fill="none"
            pathLength="100"
            strokeDasharray={`${position * 100} 100`}
          />
          <g
            className="reader-tide-crest"
            style={{ left: `${(position * 100).toFixed(2)}%` } as React.CSSProperties}
          >
            <circle r="0.9" fill="rgba(245, 198, 91, 0.9)" />
          </g>
        </svg>

        <span
          className="reader-tide-vessel"
          style={{ left: `${vesselX}%` } as React.CSSProperties}
          aria-hidden="true"
        >
          <svg viewBox="0 0 36 26" focusable="false">
            <g className="reader-tide-vessel-hull">
              <path
                d="M 4 18 Q 18 24 32 18 L 28 22 Q 18 25 8 22 Z"
                fill="rgba(107, 74, 37, 0.95)"
                stroke="rgba(40, 22, 8, 0.6)"
                strokeWidth="0.45"
              />
              <path d="M 4 18 Q 18 21 32 18" stroke="rgba(245, 198, 91, 0.7)" strokeWidth="0.4" fill="none" />
              <line x1="18" y1="9" x2="18" y2="20" stroke="rgba(40, 22, 8, 0.7)" strokeWidth="0.6" strokeLinecap="round" />
            </g>
            <g className="reader-tide-vessel-sail">
              <path
                d="M 18 4 L 27 16 L 18 16 Z"
                fill="rgba(245, 232, 200, 0.92)"
                stroke="rgba(107, 74, 37, 0.55)"
                strokeWidth="0.45"
                strokeLinejoin="round"
              />
              <path
                d="M 18 6 L 18 15"
                stroke="rgba(167, 60, 44, 0.45)"
                strokeWidth="0.32"
                fill="none"
              />
              <circle cx="22" cy="11" r="0.55" fill="rgba(167, 60, 44, 0.7)" />
            </g>
            <g className="reader-tide-vessel-wake">
              <path d="M 2 24 Q 6 25 10 24" stroke="rgba(107, 74, 37, 0.4)" strokeWidth="0.4" fill="none" strokeLinecap="round" />
              <path d="M 26 24 Q 30 25 34 24" stroke="rgba(107, 74, 37, 0.4)" strokeWidth="0.4" fill="none" strokeLinecap="round" />
            </g>
          </svg>
        </span>

        <ol className="reader-tide-stations">
          {TIDE_STATIONS.map((station, i) => {
            const reached = beat >= i
            const isActive = activeIndex === i
            return (
              <li
                key={station.roman}
                className={`reader-tide-station${reached ? ' is-reached' : ''}${
                  isActive ? ' is-active' : ''
                }`}
                style={{ left: `${(i / TIDE_BEAT_COUNT) * 100}%` } as React.CSSProperties}
              >
                <button
                  type="button"
                  className="reader-tide-station-button"
                  onClick={() => onSelect(station.key)}
                  aria-label={`jump to ${station.name}`}
                  aria-current={isActive ? 'true' : undefined}
                >
                  <span className="reader-tide-station-glyph" aria-hidden="true">
                    {station.glyph}
                  </span>
                  <span className="reader-tide-station-pip" aria-hidden="true" />
                  <span className="reader-tide-station-tick" aria-hidden="true">
                    <svg viewBox="0 0 4 8" focusable="false">
                      <line x1="2" y1="0" x2="2" y2="8" stroke="currentColor" strokeWidth="0.6" strokeLinecap="round" />
                    </svg>
                  </span>
                </button>
                <span className="reader-tide-station-label" aria-hidden="true">
                  <em className="reader-tide-station-roman">{station.roman}.</em>
                  <em className="reader-tide-station-name">{station.name}</em>
                </span>
              </li>
            )
          })}
        </ol>
      </div>

      <span className="reader-tide-rule reader-tide-rule--bottom" aria-hidden="true" />
    </nav>
  )
}

function BreathHalo({ slow, active, reduced }: { slow: boolean; active: boolean; reduced: boolean }) {
  const cycle = slow ? 5.4 : 3.4
  return (
    <span
      className={`breath-halo${active ? ' is-active' : ''}${reduced ? ' is-static' : ''}`}
      style={{ '--breath-cycle': `${cycle}s` } as React.CSSProperties}
      aria-hidden="true"
    >
      <svg viewBox="0 0 36 36" focusable="false">
        <circle
          cx="18"
          cy="18"
          r="14.4"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.32"
          strokeDasharray="0.6 1.4"
          opacity="0.5"
        />
        <circle className="breath-halo-ring" cx="18" cy="18" r="9" fill="none" stroke="currentColor" strokeWidth="0.45" />
        <circle className="breath-halo-core" cx="18" cy="18" r="3.6" fill="currentColor" fillOpacity="0.12" />
        <circle cx="18" cy="18" r="1.1" fill="currentColor" />
      </svg>
    </span>
  )
}

function FoldCorner() {
  return (
    <svg
      className="fold-corner"
      viewBox="0 0 60 60"
      focusable="false"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="fold-fold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="rgba(255, 250, 240, 0.96)" />
          <stop offset="100%" stopColor="rgba(232, 216, 178, 0.92)" />
        </linearGradient>
        <linearGradient id="fold-shadow" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="rgba(107, 74, 37, 0)" />
          <stop offset="100%" stopColor="rgba(107, 74, 37, 0.16)" />
        </linearGradient>
      </defs>
      <path
        className="fold-corner-fold"
        d="M 0 0 L 60 0 L 0 60 Z"
        fill="url(#fold-fold)"
        stroke="rgba(107, 74, 37, 0.34)"
        strokeWidth="0.6"
      />
      <path
        className="fold-corner-shadow"
        d="M 0 60 L 60 0 L 58 2 L 4 56 Z"
        fill="url(#fold-shadow)"
      />
      <path
        className="fold-corner-line"
        d="M 0 0 L 60 60"
        stroke="rgba(107, 74, 37, 0.32)"
        strokeWidth="0.5"
        strokeDasharray="1.6 2.4"
      />
      <circle cx="20" cy="20" r="0.7" fill="rgba(107, 74, 37, 0.55)" />
      <circle cx="40" cy="40" r="0.7" fill="rgba(107, 74, 37, 0.55)" />
    </svg>
  )
}

function ReadingRecord({ cycle }: { cycle: number }) {
  const slots = Math.max(0, Math.min(cycle, 4))
  const marks = Array.from({ length: 4 }, (_, i) => i)
  return (
    <div className="reading-record" aria-hidden="true">
      <span className="reading-record-rule reading-record-rule--left" />
      <span className="reading-record-cluster">
        <em className="reading-record-key">reading record</em>
        <span className="reading-record-sep" aria-hidden="true">·</span>
        <span className="reading-record-tally">
          {marks.map((i) => {
            const filled = i < slots
            const isLatest = i === slots - 1
            const roman = ROMAN[Math.min(i, ROMAN.length - 1)]
            return (
              <span
                key={i}
                className={`reading-record-mark${filled ? ' is-filled' : ''}${
                  isLatest ? ' is-latest' : ''
                }`}
                style={{ '--i': i } as React.CSSProperties}
              >
                <svg viewBox="0 0 18 18" focusable="false">
                  <defs>
                    <radialGradient id={`rr-wax-${i}`} cx="50%" cy="34%" r="68%">
                      <stop offset="0%" stopColor="rgba(186, 50, 30, 0.96)" />
                      <stop offset="58%" stopColor="rgba(126, 30, 18, 0.96)" />
                      <stop offset="100%" stopColor="rgba(58, 12, 6, 0.96)" />
                    </radialGradient>
                  </defs>
                  <circle cx="9" cy="9" r="8" fill={filled ? `url(#rr-wax-${i})` : 'none'} stroke="currentColor" strokeWidth="0.4" />
                  {filled && (
                    <>
                      <ellipse cx="7.4" cy="5" rx="3.4" ry="1.4" fill="rgba(255, 232, 200, 0.32)" />
                      <text x="9" y="11.6" textAnchor="middle" className="reading-record-roman">
                        {roman}
                      </text>
                    </>
                  )}
                </svg>
              </span>
            )
          })}
        </span>
        <span className="reading-record-tail">
          <em>{slots === 0 ? 'no press yet' : `${ROMAN[Math.min(slots - 1, ROMAN.length - 1)]} press${slots === 1 ? '' : 'es'}`}</em>
        </span>
      </span>
      <span className="reading-record-rule reading-record-rule--right" />
    </div>
  )
}

function Colophon({ cycle }: { cycle: number }) {
  return (
    <div className="colophon" aria-hidden="true">
      <svg className="colophon-mark" viewBox="0 0 80 80" focusable="false">
        <defs>
          <radialGradient id="colophon-gold" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#f5c65b" />
            <stop offset="60%" stopColor="#c8923e" />
            <stop offset="100%" stopColor="#9c6e26" />
          </radialGradient>
        </defs>
        <circle cx="40" cy="40" r="36" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="0.8 2" opacity="0.5" />
        <circle cx="40" cy="40" r="30" fill="none" stroke="currentColor" strokeWidth="0.45" opacity="0.6" />
        <g className="colophon-aster">
          <path d="M 40 14 L 44 26 L 56 26 L 46 33.5 L 50 45.5 L 40 38 L 30 45.5 L 34 33.5 L 24 26 L 36 26 Z" fill="url(#colophon-gold)" />
        </g>
        <g className="colophon-petals" fill="currentColor" opacity="0.7">
          <circle cx="40" cy="6" r="0.9" />
          <circle cx="74" cy="40" r="0.9" />
          <circle cx="40" cy="74" r="0.9" />
          <circle cx="6" cy="40" r="0.9" />
        </g>
        <circle cx="40" cy="40" r="1.6" fill="currentColor" />
      </svg>
      <div className="colophon-lines">
        <header className="colophon-head">
          <span className="colophon-head-mark" aria-hidden="true">¶</span>
          <em className="colophon-head-text">colophon · imprint</em>
        </header>
        <span className="colophon-line">
          <em className="colophon-key">set in</em>
          <span className="colophon-value">italic · 30 pt</span>
        </span>
        <span className="colophon-rule" />
        <span className="colophon-line">
          <em className="colophon-key">bound at</em>
          <span className="colophon-value">studio · folio lxxvii</span>
        </span>
        <span className="colophon-rule" />
        <span className="colophon-line">
          <em className="colophon-key">printed for</em>
          <span className="colophon-value">the attentive reader</span>
        </span>
        <span className="colophon-rule colophon-rule--thick" />
        <ReadingRecord cycle={cycle} />
        <span className="colophon-line colophon-line--sign">
          <em>manu mea</em>
          <span className="colophon-sep" aria-hidden="true">·</span>
          <em>impressum</em>
        </span>
      </div>
    </div>
  )
}

function AlmanacDaybook({ now, moonPhase, cycle }: { now: Date; moonPhase: number; cycle: number }) {
  const dayName = WEEKDAYS[now.getDay()]
  const monthName = MONTHS[now.getMonth()]
  const dayOrdinal = ORDINALS[Math.min(ORDINALS.length - 1, now.getDate() - 1)]
  const yearRoman = toRomanYear(now.getFullYear())

  const hour24 = now.getHours()
  const minutes = now.getMinutes()
  const period = hour24 >= 12 ? 'p.m.' : 'a.m.'
  const h12 = ((hour24 + 11) % 12) + 1
  const mm = String(minutes).padStart(2, '0')

  const siderealMinutes = (((hour24 * 60 + minutes + 558) / 60) % 24 + 24) % 24
  const sidH = String(Math.floor(siderealMinutes)).padStart(2, '0')
  const sidM = String(
    Math.floor((siderealMinutes - Math.floor(siderealMinutes)) * 60),
  ).padStart(2, '0')

  const moonName = moonPhaseName(moonPhase)
  const illumination = Math.round((1 - Math.cos(moonPhase * 2 * Math.PI)) * 50)
  const impression =
    cycle === 0 ? 'first impression' : cycle === 1 ? 'second press' : `press ${ordinal(cycle + 1)}`

  return (
    <aside
      className="almanac-daybook"
      aria-label="ephemeris of this reading"
    >
      <span className="almanac-frame" aria-hidden="true">
        <svg viewBox="0 0 600 8" focusable="false" preserveAspectRatio="none">
          <line x1="0" y1="0" x2="600" y2="0" stroke="currentColor" strokeWidth="0.4" strokeDasharray="1.4 2.4" opacity="0.6" />
        </svg>
      </span>

      <header className="almanac-head">
        <span className="almanac-mark" aria-hidden="true">
          <svg viewBox="0 0 26 26" focusable="false">
            <circle cx="13" cy="13" r="10" fill="none" stroke="currentColor" strokeWidth="0.5" />
            <circle cx="13" cy="13" r="5.5" fill="none" stroke="currentColor" strokeWidth="0.35" strokeDasharray="0.4 1.4" />
            <circle cx="13" cy="13" r="1.1" fill="currentColor" />
            <line x1="13" y1="1.5" x2="13" y2="5" stroke="currentColor" strokeWidth="0.35" />
            <line x1="13" y1="21" x2="13" y2="24.5" stroke="currentColor" strokeWidth="0.35" />
            <line x1="1.5" y1="13" x2="5" y2="13" stroke="currentColor" strokeWidth="0.35" />
            <line x1="21" y1="13" x2="24.5" y2="13" stroke="currentColor" strokeWidth="0.35" />
          </svg>
        </span>
        <span className="almanac-head-text">
          <em className="almanac-head-key">almanac</em>
          <span className="almanac-head-sep" aria-hidden="true">·</span>
          <em className="almanac-head-title">daybook of this reading</em>
          {cycle > 0 && (
            <>
              <span className="almanac-head-sep" aria-hidden="true">·</span>
              <em className="almanac-head-press">{impression}</em>
            </>
          )}
        </span>
        <span className="almanac-mark almanac-mark--right" aria-hidden="true">
          <svg viewBox="0 0 26 26" focusable="false">
            <circle cx="13" cy="13" r="10" fill="none" stroke="currentColor" strokeWidth="0.5" />
            <circle cx="13" cy="13" r="5.5" fill="none" stroke="currentColor" strokeWidth="0.35" strokeDasharray="0.4 1.4" />
            <circle cx="13" cy="13" r="1.1" fill="currentColor" />
            <line x1="13" y1="1.5" x2="13" y2="5" stroke="currentColor" strokeWidth="0.35" />
            <line x1="13" y1="21" x2="13" y2="24.5" stroke="currentColor" strokeWidth="0.35" />
            <line x1="1.5" y1="13" x2="5" y2="13" stroke="currentColor" strokeWidth="0.35" />
            <line x1="21" y1="13" x2="24.5" y2="13" stroke="currentColor" strokeWidth="0.35" />
          </svg>
        </span>
      </header>

      <div className="almanac-grid">
        <div className="almanac-cell almanac-cell--day">
          <span className="almanac-key">today</span>
          <span className="almanac-val almanac-val--day">
            <em className="almanac-day-name">{dayName}</em>
            <span className="almanac-day-tail">
              , the <em className="almanac-day-ord">{dayOrdinal}</em>
            </span>
            <span className="almanac-day-tail">
              {' '}of <em className="almanac-day-month">{monthName}</em>
            </span>
            <span className="almanac-day-tail">
              {' '}· <em className="almanac-day-year">{yearRoman}</em>
            </span>
          </span>
        </div>

        <span className="almanac-divider" aria-hidden="true" />

        <div className="almanac-cell almanac-cell--hour">
          <span className="almanac-key">hour</span>
          <span className="almanac-val almanac-val--hour">
            <em className="almanac-hour-h">{h12}</em>
            <span className="almanac-hour-m">:{mm}</span>
            <em className="almanac-hour-period">{period}</em>
          </span>
          <span className="almanac-aux">
            sidereal <em className="almanac-aux-strong">{sidH}h{sidM}</em>
          </span>
        </div>

        <span className="almanac-divider" aria-hidden="true" />

        <div className="almanac-cell almanac-cell--moon">
          <span className="almanac-key">moon</span>
          <span className="almanac-val almanac-val--moon">
            <em className="almanac-moon-name">{moonName}</em>
            <span className="almanac-moon-tail"> · {illumination}% lit</span>
          </span>
        </div>

        <span className="almanac-divider" aria-hidden="true" />

        <div className="almanac-cell almanac-cell--sky">
          <span className="almanac-key">stella</span>
          <span className="almanac-val almanac-val--sky">
            <em className="almanac-sky-name">Polaris</em>
            <span className="almanac-sky-tail"> · Ursae Minoris</span>
          </span>
          <span className="almanac-aux">
            above the folio, <em className="almanac-aux-strong">always still</em>
          </span>
        </div>
      </div>
    </aside>
  )
}

function FolioSpine({
  stage,
  cycle,
  reduced,
  children,
}: {
  stage: number
  cycle: number
  reduced: boolean
  children?: React.ReactNode
}) {
  const stages = [
    { roman: 'i', label: 'set' },
    { roman: 'ii', label: 'answer' },
    { roman: 'iii', label: 'reply' },
    { roman: 'iv', label: 'out' },
  ]
  const stageCount = stages.length - 1
  const yPercent = Math.max(0, Math.min(1, stage / stageCount))
  return (
    <div className="folio-spine" aria-hidden="true">
      <span className="folio-spine-cord folio-spine-cord--top" />
      <svg
        className="folio-spine-rule"
        viewBox="0 0 8 100"
        preserveAspectRatio="none"
        focusable="false"
      >
        <defs>
          <linearGradient id="spine-ink" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(156, 110, 38, 0.85)" />
            <stop offset="50%" stopColor="rgba(167, 60, 44, 0.6)" />
            <stop offset="100%" stopColor="rgba(156, 110, 38, 0.85)" />
          </linearGradient>
        </defs>
        <line x1="4" y1="0" x2="4" y2="100" stroke="url(#spine-ink)" strokeWidth="0.5" />
        <line x1="3" y1="0" x2="3" y2="100" stroke="rgba(156, 110, 38, 0.22)" strokeWidth="0.25" strokeDasharray="0.6 2" />
        <line x1="5" y1="0" x2="5" y2="100" stroke="rgba(167, 60, 44, 0.22)" strokeWidth="0.25" strokeDasharray="0.6 2" />
      </svg>

      <span className="folio-spine-joint folio-spine-joint--top">
        <svg viewBox="0 0 18 14" focusable="false">
          <path
            d="M 1 7 L 7 1 L 13 7 L 7 13 Z"
            fill="none"
            stroke="rgba(156, 110, 38, 0.7)"
            strokeWidth="0.5"
          />
          <circle cx="7" cy="7" r="1.4" fill="rgba(156, 110, 38, 0.85)" />
          <line x1="2" y1="7" x2="6" y2="7" stroke="rgba(156, 110, 38, 0.6)" strokeWidth="0.4" />
          <line x1="8" y1="7" x2="12" y2="7" stroke="rgba(156, 110, 38, 0.6)" strokeWidth="0.4" />
        </svg>
      </span>

      {stages.map((s, i) => {
        const passed = stage >= i
        const current = stage === i
        const top = (i / stageCount) * 100
        return (
          <span
            key={s.roman}
            className={`folio-spine-stop ${passed ? 'is-passed' : ''}${
              current ? ' is-current' : ''
            }`}
            style={{ top: `${top}%` }}
          >
            <span className="folio-spine-stop-tick" />
            <span className="folio-spine-stop-label">
              <em className="folio-spine-stop-roman">{s.roman}</em>
              <span className="folio-spine-stop-name">{s.label}</span>
            </span>
          </span>
        )
      })}

      <span
        className={`folio-spine-marker${reduced ? ' is-static' : ''}`}
        style={{ top: `${yPercent * 100}%` }}
      >
        <span className="folio-spine-marker-stem" />
        <svg className="folio-spine-marker-glyph" viewBox="0 0 14 14" focusable="false">
          <circle cx="7" cy="7" r="6" fill="rgba(245, 198, 91, 0.92)" />
          <circle cx="7" cy="7" r="6" fill="none" stroke="rgba(80, 36, 14, 0.55)" strokeWidth="0.5" />
          <circle cx="7" cy="7" r="2.2" fill="none" stroke="rgba(80, 36, 14, 0.55)" strokeWidth="0.3" strokeDasharray="0.4 1.1" />
          <circle cx="7" cy="7" r="0.9" fill="rgba(80, 36, 14, 0.85)" />
        </svg>
      </span>

      {cycle > 0 && (
        <span className="folio-spine-reread" aria-hidden="true">
          <span className="folio-spine-reread-mark">⟲</span>
          <span className="folio-spine-reread-text">re-reading</span>
        </span>
      )}

      <span className="folio-spine-joint folio-spine-joint--bottom">
        <svg viewBox="0 0 18 14" focusable="false">
          <path
            d="M 1 7 L 7 1 L 13 7 L 7 13 Z"
            fill="none"
            stroke="rgba(167, 60, 44, 0.7)"
            strokeWidth="0.5"
          />
          <circle cx="7" cy="7" r="1.4" fill="rgba(167, 60, 44, 0.85)" />
          <line x1="2" y1="7" x2="6" y2="7" stroke="rgba(167, 60, 44, 0.6)" strokeWidth="0.4" />
          <line x1="8" y1="7" x2="12" y2="7" stroke="rgba(167, 60, 44, 0.6)" strokeWidth="0.4" />
        </svg>
      </span>
      {children}
      <span className="folio-spine-cord folio-spine-cord--bottom" />
    </div>
  )
}

function RectoSeal({ cycle }: { cycle: number }) {
  const impression =
    cycle === 0
      ? 'the question, set'
      : cycle === 1
        ? 'the question, set again'
        : `the question, set ${ordinal(cycle + 1)} times`
  return (
    <div className={`recto-seal${cycle > 0 ? ' is-reread' : ''}`} aria-hidden="true">
      <span className="recto-seal-rule recto-seal-rule--left" />
      <span className="recto-seal-mark">
        <svg viewBox="0 0 48 48" focusable="false">
          <defs>
            <radialGradient id="recto-seal-gold" cx="50%" cy="42%" r="58%">
              <stop offset="0%" stopColor="#f5c65b" />
              <stop offset="60%" stopColor="#c8923e" />
              <stop offset="100%" stopColor="#9c6e26" />
            </radialGradient>
          </defs>
          <circle
            cx="24"
            cy="24"
            r="22"
            fill="none"
            stroke="url(#recto-seal-gold)"
            strokeWidth="0.55"
          />
          <circle
            cx="24"
            cy="24"
            r="18.5"
            fill="none"
            stroke="url(#recto-seal-gold)"
            strokeWidth="0.3"
            strokeDasharray="0.4 1.2"
            opacity="0.7"
          />
          <g className="recto-seal-rays" stroke="url(#recto-seal-gold)" strokeWidth="0.4" strokeLinecap="round">
            <line x1="24" y1="3.6" x2="24" y2="6.6" />
            <line x1="24" y1="41.4" x2="24" y2="44.4" />
            <line x1="3.6" y1="24" x2="6.6" y2="24" />
            <line x1="41.4" y1="24" x2="44.4" y2="24" />
          </g>
          <g className="recto-seal-letter" fill="url(#recto-seal-gold)">
            <text x="24" y="29" textAnchor="middle" className="recto-seal-letter-glyph">
              q
            </text>
          </g>
          <text x="24" y="36.6" textAnchor="middle" className="recto-seal-roman">
            recto
          </text>
        </svg>
      </span>
      <span className="recto-seal-text">
        <em className="recto-seal-key">explicit</em>
        <span className="recto-seal-sep" aria-hidden="true">·</span>
        <em className="recto-seal-tail">{impression}</em>
      </span>
      <span className="recto-seal-rule recto-seal-rule--right" />
    </div>
  )
}

function ReadingBreath({ active }: { active: boolean }) {
  return (
    <span
      className={`reading-breath${active ? ' is-active' : ''}`}
      aria-hidden="true"
    >
      <svg viewBox="0 0 24 24" focusable="false">
        <defs>
          <radialGradient id="reading-breath-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(245, 198, 91, 0.55)" />
            <stop offset="55%" stopColor="rgba(245, 198, 91, 0.18)" />
            <stop offset="100%" stopColor="rgba(245, 198, 91, 0)" />
          </radialGradient>
        </defs>
        <circle
          cx="12"
          cy="12"
          r="11"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.4"
          strokeDasharray="0.4 1.4"
          opacity="0.55"
        />
        <circle
          cx="12"
          cy="12"
          r="8"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.4"
          opacity="0.6"
        />
        <circle cx="12" cy="12" r="5" fill="url(#reading-breath-glow)" />
        <circle cx="12" cy="12" r="1.6" fill="currentColor" />
        <circle cx="12" cy="12" r="0.55" fill="var(--paper)" />
      </svg>
    </span>
  )
}

function ReadingLens({ intensity, reduced }: { intensity: number; reduced: boolean }) {
  const phase = Math.max(0, Math.min(1, intensity))
  return (
    <div
      className={`reading-lens${phase > 0 ? ' is-lit' : ''}`}
      aria-hidden="true"
      style={{ '--lens-phase': phase } as React.CSSProperties}
    >
      <span className="reading-lens-pool" />
      <span className={`reading-lens-beam${reduced ? ' is-static' : ''}`} />
      <svg className="reading-lens-motes" viewBox="0 0 220 220" focusable="false">
        <defs>
          <radialGradient id="reading-lens-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(255, 220, 150, 0.42)" />
            <stop offset="55%" stopColor="rgba(245, 198, 91, 0.16)" />
            <stop offset="100%" stopColor="rgba(245, 198, 91, 0)" />
          </radialGradient>
        </defs>
        <circle cx="110" cy="110" r="100" fill="url(#reading-lens-glow)" />
        <g className="reading-lens-dust" fill="rgba(255, 220, 168, 0.42)">
          <circle cx="74" cy="60" r="0.6" />
          <circle cx="148" cy="78" r="0.55" />
          <circle cx="84" cy="146" r="0.5" />
          <circle cx="160" cy="132" r="0.65" />
          <circle cx="120" cy="44" r="0.45" />
          <circle cx="56" cy="118" r="0.55" />
          <circle cx="184" cy="100" r="0.5" />
          <circle cx="100" cy="184" r="0.45" />
        </g>
      </svg>
    </div>
  )
}

function FoldShade({ active }: { active: boolean }) {
  return (
    <span
      className={`fold-shade${active ? ' is-active' : ''}`}
      aria-hidden="true"
    >
      <span className="fold-shade-rule" />
      <span className="fold-shade-glint" />
    </span>
  )
}

const WAX_STAMP_ROT = [-4, 3, -2, 5]
const WAX_STAMP_DX = [-2, 1, -1, 2]

function PressSeam({
  phase,
  inkProgress,
}: {
  phase: Phase
  inkProgress: number
}) {
  const lit = phase !== 'idle'
  return (
    <span
      className={`press-seam${lit ? ' is-lit' : ''}`}
      aria-hidden="true"
      style={{ '--seam-ink': inkProgress } as React.CSSProperties}
    >
      <svg viewBox="0 0 24 600" preserveAspectRatio="none" focusable="false">
        <defs>
          <linearGradient id="seam-gold" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(245, 198, 91, 0)" />
            <stop offset="6%" stopColor="rgba(245, 198, 91, 0.7)" />
            <stop offset="36%" stopColor="rgba(200, 146, 62, 0.92)" />
            <stop offset="64%" stopColor="rgba(167, 60, 44, 0.78)" />
            <stop offset="92%" stopColor="rgba(245, 198, 91, 0.65)" />
            <stop offset="100%" stopColor="rgba(245, 198, 91, 0)" />
          </linearGradient>
          <linearGradient id="seam-coral" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(167, 60, 44, 0)" />
            <stop offset="40%" stopColor="rgba(167, 60, 44, 0.55)" />
            <stop offset="60%" stopColor="rgba(167, 60, 44, 0.55)" />
            <stop offset="100%" stopColor="rgba(167, 60, 44, 0)" />
          </linearGradient>
        </defs>
        <line
          x1="12"
          y1="0"
          x2="12"
          y2="600"
          stroke="url(#seam-gold)"
          strokeWidth="0.55"
          className="press-seam-rule"
        />
        <line
          x1="12"
          y1="0"
          x2="12"
          y2="600"
          stroke="url(#seam-coral)"
          strokeWidth="0.35"
          strokeDasharray="0.6 1.6"
          className="press-seam-dash"
        />
        <g className="press-seam-beats">
          <circle cx="12" cy="120" r="1.6" className="press-seam-bead press-seam-bead--a" />
          <circle cx="12" cy="300" r="1.8" className="press-seam-bead press-seam-bead--b" />
          <circle cx="12" cy="480" r="1.6" className="press-seam-bead press-seam-bead--c" />
        </g>
        <circle
          cx="12"
          cy={120 + 360 * Math.max(0, Math.min(1, inkProgress))}
          r="3"
          className="press-seam-pulse"
        />
      </svg>
    </span>
  )
}

function WaxArchive({ cycle }: { cycle: number }) {
  const count = Math.min(Math.max(cycle, 0), 4)
  const stamps = Array.from({ length: count }, (_, i) => i)
  const roman = ROMAN[Math.min(Math.max(count - 1, 0), ROMAN.length - 1)]
  const noun = count === 1 ? 'press' : 'presses'

  return (
    <div className={`wax-archive is-visible`} aria-hidden="true">
      <span className="wax-archive-rule wax-archive-rule--top" />
      <div className="wax-archive-stage">
        {stamps.map((i) => {
          const rot = WAX_STAMP_ROT[i] ?? 0
          const dx = WAX_STAMP_DX[i] ?? 0
          const isLatest = i === count - 1
          return (
            <span
              key={i}
              className={`wax-archive-stamp${isLatest ? ' is-latest' : ''}`}
              style={
                {
                  '--i': i,
                  '--wax-rot': `${rot}deg`,
                  '--wax-dx': `${dx}px`,
                } as React.CSSProperties
              }
            >
              <span className="wax-archive-stamp-shadow" />
              <svg
                className="wax-archive-disc"
                viewBox="0 0 44 44"
                focusable="false"
              >
                <defs>
                  <radialGradient
                    id={`wax-arc-${i}`}
                    cx="50%"
                    cy="34%"
                    r="66%"
                  >
                    <stop offset="0%" stopColor="rgba(186, 50, 30, 0.95)" />
                    <stop offset="58%" stopColor="rgba(126, 30, 18, 0.96)" />
                    <stop offset="100%" stopColor="rgba(58, 12, 6, 0.96)" />
                  </radialGradient>
                  <radialGradient
                    id={`wax-sheen-${i}`}
                    cx="50%"
                    cy="20%"
                    r="58%"
                  >
                    <stop offset="0%" stopColor="rgba(255, 232, 200, 0.32)" />
                    <stop offset="100%" stopColor="rgba(255, 232, 200, 0)" />
                  </radialGradient>
                  <pattern
                    id={`wax-grain-${i}`}
                    width="3"
                    height="3"
                    patternUnits="userSpaceOnUse"
                  >
                    <circle
                      cx="0.6"
                      cy="0.4"
                      r="0.4"
                      fill="rgba(255, 220, 180, 0.06)"
                    />
                    <circle
                      cx="2.2"
                      cy="1.6"
                      r="0.3"
                      fill="rgba(255, 220, 180, 0.05)"
                    />
                    <circle
                      cx="1.4"
                      cy="2.6"
                      r="0.35"
                      fill="rgba(255, 220, 180, 0.04)"
                    />
                  </pattern>
                  <path
                    id={`wax-arc-top-${i}`}
                    d="M 22 22 m -14 0 a 14 14 0 0 1 28 0"
                    fill="none"
                  />
                  <path
                    id={`wax-arc-bot-${i}`}
                    d="M 22 22 m -14 0 a 14 14 0 1 0 28 0"
                    fill="none"
                  />
                </defs>

                <circle
                  cx="22"
                  cy="22"
                  r="20.5"
                  fill={`url(#wax-arc-${i})`}
                  stroke="rgba(40, 8, 4, 0.55)"
                  strokeWidth="0.5"
                />
                <circle
                  cx="22"
                  cy="22"
                  r="20.5"
                  fill={`url(#wax-grain-${i})`}
                  opacity="0.85"
                />
                <ellipse
                  cx="20"
                  cy="13"
                  rx="11"
                  ry="4.4"
                  fill={`url(#wax-sheen-${i})`}
                />

                <circle
                  cx="22"
                  cy="22"
                  r="17"
                  fill="none"
                  stroke="rgba(255, 232, 200, 0.32)"
                  strokeWidth="0.4"
                />
                <circle
                  cx="22"
                  cy="22"
                  r="14"
                  fill="none"
                  stroke="rgba(255, 232, 200, 0.18)"
                  strokeWidth="0.32"
                  strokeDasharray="0.4 1.4"
                />

                <text className="wax-archive-arc wax-archive-arc--top">
                  <textPath
                    href={`#wax-arc-top-${i}`}
                    startOffset="50%"
                    textAnchor="middle"
                  >
                    m · iii · press
                  </textPath>
                </text>
                <text className="wax-archive-arc wax-archive-arc--bot">
                  <textPath
                    href={`#wax-arc-bot-${i}`}
                    startOffset="50%"
                    textAnchor="middle"
                  >
                    cap · xviii ·
                  </textPath>
                </text>

                <line
                  x1="13"
                  y1="20"
                  x2="31"
                  y2="20"
                  stroke="rgba(255, 232, 200, 0.28)"
                  strokeWidth="0.32"
                  strokeLinecap="round"
                />
                <text
                  x="22"
                  y="29"
                  textAnchor="middle"
                  className="wax-archive-letter"
                >
                  {ROMAN[i] ?? String(i + 1)}
                </text>
                <line
                  x1="13"
                  y1="31.5"
                  x2="31"
                  y2="31.5"
                  stroke="rgba(255, 232, 200, 0.28)"
                  strokeWidth="0.32"
                  strokeLinecap="round"
                />

                <g
                  className="wax-archive-flecks"
                  fill="rgba(40, 8, 4, 0.55)"
                >
                  <circle cx="6" cy="8" r="0.4" />
                  <circle cx="38" cy="10" r="0.35" />
                  <circle cx="36" cy="34" r="0.35" />
                  <circle cx="8" cy="34" r="0.4" />
                  <circle cx="40" cy="22" r="0.3" />
                </g>
              </svg>
            </span>
          )
        })}
      </div>
      <span className="wax-archive-caption">
        <em className="wax-archive-key">the reader's wax</em>
        <span className="wax-archive-sep" aria-hidden="true">·</span>
        <em className="wax-archive-tail">
          {roman} {noun}
        </em>
        <span className="wax-archive-foliate" aria-hidden="true">
          <svg viewBox="0 0 16 8" focusable="false">
            <path
              d="M 1 4 Q 4 0.6 7 4 Q 10 7.4 13 4"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.45"
              strokeLinecap="round"
            />
            <circle cx="8" cy="4" r="0.6" fill="currentColor" />
          </svg>
        </span>
      </span>
      <span className="wax-archive-rule wax-archive-rule--bottom" />
    </div>
  )
}

/* ──────────────────────────────────────────────────────────────────────
   iteration 138 · the answer earns a calligraphic flourish and a quiet
   marginal echo. A small hand-drawn scrollwork sits at the opening of
   the answer, drawing on as the press delivers it; beside it, in the
   right margin, a delicate italic note acknowledges the reader. The
   reply, in turn, begins with an illuminated "S" — a manuscript capital
   in gold leaf — that draws on as the reply sets itself, line by line.
   ────────────────────────────────────────────────────────────────────── */

function AnswerFlourish({ visible, reduced }: { visible: boolean; reduced: boolean }) {
  return (
    <span
      className={`answer-flourish${visible ? ' is-visible' : ''}${reduced ? ' is-static' : ''}`}
      aria-hidden="true"
    >
      <svg className="answer-flourish-glyph" viewBox="0 0 96 36" focusable="false">
        <defs>
          <linearGradient id="af-ink" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(167, 60, 44, 0)" />
            <stop offset="20%" stopColor="rgba(167, 60, 44, 0.62)" />
            <stop offset="56%" stopColor="rgba(120, 30, 12, 0.78)" />
            <stop offset="82%" stopColor="rgba(167, 60, 44, 0.55)" />
            <stop offset="100%" stopColor="rgba(167, 60, 44, 0)" />
          </linearGradient>
          <linearGradient id="af-gold" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(245, 198, 91, 0)" />
            <stop offset="50%" stopColor="rgba(245, 198, 91, 0.62)" />
            <stop offset="100%" stopColor="rgba(245, 198, 91, 0)" />
          </linearGradient>
        </defs>
        <path
          className="answer-flourish-dash"
          d="M 6 20 Q 14 16 22 19 Q 30 22 38 18 Q 44 14.5 50 17.5"
          stroke="url(#af-ink)"
          strokeWidth="1.6"
          strokeLinecap="round"
          fill="none"
        />
        <path
          className="answer-flourish-trail"
          d="M 50 17.5 Q 56 18.5 62 16 Q 70 13 78 17 Q 84 19.5 90 17"
          stroke="url(#af-gold)"
          strokeWidth="0.5"
          strokeLinecap="round"
          fill="none"
        />
        <circle
          className="answer-flourish-pip"
          cx="50"
          cy="17.5"
          r="1.2"
          fill="rgba(120, 30, 12, 0.78)"
        />
        <circle
          className="answer-flourish-halo"
          cx="50"
          cy="17.5"
          r="3.4"
          fill="rgba(245, 198, 91, 0.18)"
        />
        <path
          className="answer-flourish-tail"
          d="M 86 14 q 3 -1 4 2 q -1 2 -3 1"
          stroke="url(#af-gold)"
          strokeWidth="0.45"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    </span>
  )
}

const MARGINAL_ECHO_LINES: Record<number, { line: string; gloss: string }> = {
  0: {
    line: 'and the page — having answered — rests.',
    gloss: 'the printer, setting down the quill',
  },
  1: {
    line: 'a second reading — the page is unchanged.',
    gloss: 'the reader, returning',
  },
  2: {
    line: 'a third reading — only the eye has moved.',
    gloss: 'the page, patient',
  },
}

function MarginalEcho({
  visible,
  cycle,
  reduced,
}: {
  visible: boolean
  cycle: number
  reduced: boolean
}) {
  const key = Math.min(cycle, 2)
  const entry = MARGINAL_ECHO_LINES[key]
  if (!entry) return null
  return (
    <aside
      className={`marginal-echo${visible ? ' is-visible' : ''}${cycle > 0 ? ' is-reread' : ''}${
        reduced ? ' is-static' : ''
      }`}
      aria-label="a marginal echo from the printer"
    >
      <span className="marginal-echo-rule" aria-hidden="true" />
      <span className="marginal-echo-cluster">
        <span className="marginal-echo-mark" aria-hidden="true">
          <svg viewBox="0 0 16 16" focusable="false">
            <circle cx="8" cy="8" r="6.4" fill="none" stroke="currentColor" strokeWidth="0.4" strokeDasharray="0.5 1.4" />
            <circle cx="8" cy="8" r="2.4" fill="none" stroke="currentColor" strokeWidth="0.32" />
            <circle cx="8" cy="8" r="0.8" fill="currentColor" />
            <line x1="8" y1="1" x2="8" y2="2.6" stroke="currentColor" strokeWidth="0.35" strokeLinecap="round" />
            <line x1="8" y1="13.4" x2="8" y2="15" stroke="currentColor" strokeWidth="0.35" strokeLinecap="round" />
            <line x1="1" y1="8" x2="2.6" y2="8" stroke="currentColor" strokeWidth="0.35" strokeLinecap="round" />
            <line x1="13.4" y1="8" x2="15" y2="8" stroke="currentColor" strokeWidth="0.35" strokeLinecap="round" />
          </svg>
        </span>
        <span className="marginal-echo-body">
          <em className="marginal-echo-line">{entry.line}</em>
          <span className="marginal-echo-attribution">
            <span className="marginal-echo-attribution-rule" aria-hidden="true" />
            <em className="marginal-echo-attribution-text">{entry.gloss}</em>
          </span>
        </span>
      </span>
      <span className="marginal-echo-rule marginal-echo-rule--tail" aria-hidden="true" />
    </aside>
  )
}

function ScholarGlosses({
  active,
  visible,
}: {
  active: string | null
  visible: boolean
}) {
  if (!active || !visible) return null
  const gloss = SCHOLAR_GLOSS_MAP[active]
  if (!gloss) return null
  return (
    <aside
      key={active}
      className="scholar-glosses is-visible"
      aria-live="polite"
      aria-label={`scholar’s note on ${active}`}
    >
      <span className="scholar-glosses-rule" aria-hidden="true" />
      <p className="scholar-glosses-card">
        <svg
          className="scholar-glosses-mark"
          viewBox="0 0 16 16"
          focusable="false"
          aria-hidden="true"
        >
          <path
            d="M 3 2 L 8 1 L 13 2 L 14 7 L 13 12 L 8 14 L 3 12 L 2 7 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
            strokeLinejoin="round"
          />
          <circle cx="8" cy="7" r="2" fill="currentColor" opacity="0.85" />
          <circle cx="8" cy="7" r="0.6" fill="var(--paper)" />
        </svg>
        <span className="scholar-glosses-cluster">
          <em className="scholar-glosses-key">{active}</em>
          <span className="scholar-glosses-sep" aria-hidden="true">·</span>
          <em className="scholar-glosses-text">{gloss}</em>
        </span>
      </p>
    </aside>
  )
}

function ReplyInitial({ visible, reduced }: { visible: boolean; reduced: boolean }) {
  return (
    <span
      className={`reply-initial${visible ? ' is-visible' : ''}${reduced ? ' is-static' : ''}`}
      aria-hidden="true"
    >
      <svg className="reply-initial-card" viewBox="0 0 92 110" focusable="false">
        <defs>
          <linearGradient id="ri-gold" x1="0" y1="0" x2="0.04" y2="1">
            <stop offset="0%" stopColor="#f6d076" />
            <stop offset="48%" stopColor="#c8923e" />
            <stop offset="100%" stopColor="#8a5d1f" />
          </linearGradient>
          <linearGradient id="ri-gold-soft" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f5c65b" />
            <stop offset="100%" stopColor="#a47026" />
          </linearGradient>
          <radialGradient id="ri-face" cx="38%" cy="22%" r="92%">
            <stop offset="0%" stopColor="rgba(255, 248, 224, 0.94)" />
            <stop offset="62%" stopColor="rgba(245, 220, 168, 0.74)" />
            <stop offset="100%" stopColor="rgba(214, 178, 116, 0.46)" />
          </radialGradient>
          <radialGradient id="ri-halo" cx="50%" cy="50%" r="55%">
            <stop offset="0%" stopColor="rgba(255, 220, 150, 0.42)" />
            <stop offset="100%" stopColor="rgba(255, 220, 150, 0)" />
          </radialGradient>
        </defs>

        <ellipse cx="46" cy="55" rx="44" ry="52" fill="url(#ri-halo)" />

        <rect
          x="3"
          y="3"
          width="86"
          height="104"
          rx="1.6"
          fill="url(#ri-face)"
          stroke="url(#ri-gold)"
          strokeWidth="0.9"
        />
        <rect
          x="7"
          y="7"
          width="78"
          height="96"
          rx="1"
          fill="none"
          stroke="url(#ri-gold)"
          strokeWidth="0.35"
          strokeDasharray="1.4 1.8"
          opacity="0.78"
        />

        <g className="ri-vine ri-vine--tr" stroke="url(#ri-gold-soft)" strokeWidth="0.65" fill="none" strokeLinecap="round">
          <path d="M 82 12 Q 70 16 64 26 Q 58 36 66 46 Q 72 54 66 64" />
          <path d="M 64 26 Q 58 20 52 22 Q 50 26 54 30 Q 62 32 64 26 Z" fill="rgba(217, 101, 74, 0.3)" stroke="none" />
          <circle cx="58" cy="16" r="0.9" fill="#cf3b29" />
        </g>
        <g className="ri-vine ri-vine--bl" stroke="url(#ri-gold-soft)" strokeWidth="0.65" fill="none" strokeLinecap="round">
          <path d="M 10 96 Q 22 92 28 82 Q 34 72 26 62 Q 20 54 26 44" />
          <path d="M 28 82 Q 34 88 40 86 Q 42 82 38 78 Q 32 76 28 82 Z" fill="rgba(217, 101, 74, 0.3)" stroke="none" />
          <circle cx="36" cy="90" r="0.9" fill="#cf3b29" />
        </g>

        <g className="ri-corner ri-corner--tl" fill="#cf3b29" fillOpacity="0.6">
          <path d="M 9 9 L 18 9 Q 18 12.5 14.5 13.5 L 14.5 18 L 9 18 Z" />
          <circle cx="11.5" cy="11.5" r="0.7" />
        </g>
        <g className="ri-corner ri-corner--br" fill="#a73c2c" fillOpacity="0.55">
          <path d="M 83 99 L 74 99 Q 74 95.5 77.5 94.5 L 77.5 90 L 83 90 Z" />
          <circle cx="80.5" cy="96.5" r="0.7" />
        </g>

        <g className="ri-pips" fill="url(#ri-gold-soft)">
          <circle cx="46" cy="9" r="0.7" />
          <circle cx="46" cy="101" r="0.7" />
          <circle cx="9" cy="55" r="0.6" />
          <circle cx="83" cy="55" r="0.6" />
        </g>

        <g className="ri-glyph">
          <text x="46" y="78" textAnchor="middle" className="ri-glyph-letter">
            s
          </text>
          <line
            x1="30"
            y1="84"
            x2="62"
            y2="84"
            stroke="url(#ri-gold)"
            strokeWidth="0.55"
            strokeLinecap="round"
          />
          <text x="46" y="93" textAnchor="middle" className="ri-glyph-caption">
            lege
          </text>
        </g>
      </svg>
    </span>
  )
}

/* ──────────────────────────────────────────────────────────────────────
   iteration 139 · the folio earns a single frontispiece compass
   A hand-drawn compass rose sits in the chapter opener, between the
   headpiece and the rule. Its four cardinal points are the four moments
   of the reading — question, press, answer, reply — and a small gold
   needle turns to indicate where the reader currently stands. The
   compass replaces the recto's quiet emptiness with one authored
   ornament that earns the eye before the question arrives.
   ────────────────────────────────────────────────────────────────────── */

const COMPASS_STATIONS: { roman: string; name: string; phase: Phase; angle: number; glyph: React.ReactNode }[] = [
  {
    roman: 'i',
    name: 'the question',
    phase: 'idle',
    angle: 270,
    glyph: (
      <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
        <path
          d="M 9 8 Q 9 5 12 5 Q 15 5 15 8 Q 15 11 12 12 L 12 14"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.9"
          strokeLinecap="round"
        />
        <circle cx="12" cy="17.4" r="0.9" fill="currentColor" />
      </svg>
    ),
  },
  {
    roman: 'ii',
    name: 'the answer',
    phase: 'answering',
    angle: 0,
    glyph: (
      <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
        <path
          d="M 4 11 L 9 17 L 20 6"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.9"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M 4 19 L 20 19" stroke="currentColor" strokeWidth="0.45" strokeDasharray="1 1.6" opacity="0.6" />
      </svg>
    ),
  },
  {
    roman: 'iii',
    name: 'the reply',
    phase: 'replying',
    angle: 90,
    glyph: (
      <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
        <path
          d="M 3 6 Q 9 4 12 8 Q 15 12 21 10"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.9"
          strokeLinecap="round"
        />
        <path
          d="M 21 7.5 L 21.5 11 L 18 10.4"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    roman: 'iv',
    name: 'the colophon',
    phase: 'complete',
    angle: 180,
    glyph: (
      <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
        <path
          d="M 12 3 L 14.2 9.4 L 21 9.6 L 15.6 13.6 L 17.6 20 L 12 16.2 L 6.4 20 L 8.4 13.6 L 3 9.6 L 9.8 9.4 Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.85"
          strokeLinejoin="round"
        />
        <circle cx="12" cy="12" r="1.2" fill="currentColor" />
      </svg>
    ),
  },
]

function FolioCompass({
  phase,
  reduced,
}: {
  phase: Phase
  reduced: boolean
}) {
  const activeIndex = Math.max(
    0,
    COMPASS_STATIONS.findIndex((s) => s.phase === phase),
  )
  const needleAngle = COMPASS_STATIONS[activeIndex].angle
  const [pulseKey, setPulseKey] = useState(0)
  const prevPhaseRef = useRef<Phase>('idle')

  useEffect(() => {
    if (prevPhaseRef.current !== phase && phase !== 'idle') {
      setPulseKey((k) => k + 1)
    }
    prevPhaseRef.current = phase
  }, [phase])

  return (
    <figure
      className={`folio-compass${reduced ? ' is-static' : ''}`}
      aria-hidden="true"
    >
      <svg
        className="folio-compass-plate"
        viewBox="0 0 240 240"
        focusable="false"
      >
        <defs>
          <radialGradient id="fc-face" cx="50%" cy="38%" r="64%">
            <stop offset="0%" stopColor="rgba(255, 248, 224, 0.96)" />
            <stop offset="62%" stopColor="rgba(245, 220, 168, 0.82)" />
            <stop offset="100%" stopColor="rgba(214, 178, 116, 0.62)" />
          </radialGradient>
          <radialGradient id="fc-halo" cx="50%" cy="50%" r="55%">
            <stop offset="0%" stopColor="rgba(255, 220, 150, 0.34)" />
            <stop offset="100%" stopColor="rgba(255, 220, 150, 0)" />
          </radialGradient>
          <linearGradient id="fc-gold" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f6d076" />
            <stop offset="50%" stopColor="#c8923e" />
            <stop offset="100%" stopColor="#8a5d1f" />
          </linearGradient>
          <linearGradient id="fc-gold-soft" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f5c65b" />
            <stop offset="100%" stopColor="#a47026" />
          </linearGradient>
          <pattern id="fc-grain" width="3" height="3" patternUnits="userSpaceOnUse">
            <circle cx="0.6" cy="0.4" r="0.32" fill="rgba(107, 74, 37, 0.05)" />
            <circle cx="2.2" cy="1.6" r="0.24" fill="rgba(107, 74, 37, 0.04)" />
          </pattern>
          <radialGradient id="fc-halo-pulse" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(245, 198, 91, 0.6)" />
            <stop offset="62%" stopColor="rgba(245, 198, 91, 0.18)" />
            <stop offset="100%" stopColor="rgba(245, 198, 91, 0)" />
          </radialGradient>
        </defs>

        <ellipse cx="120" cy="124" rx="106" ry="106" fill="url(#fc-halo)" />

        <circle
          cx="120"
          cy="120"
          r="100"
          fill="url(#fc-face)"
          stroke="url(#fc-gold)"
          strokeWidth="0.9"
        />
        <circle
          cx="120"
          cy="120"
          r="100"
          fill="url(#fc-grain)"
          opacity="0.65"
        />
        <circle
          cx="120"
          cy="120"
          r="94"
          fill="none"
          stroke="url(#fc-gold)"
          strokeWidth="0.32"
          strokeDasharray="1.6 2"
          opacity="0.78"
        />
        <circle
          cx="120"
          cy="120"
          r="88"
          fill="none"
          stroke="rgba(107, 74, 37, 0.18)"
          strokeWidth="0.3"
        />

        <g className="fc-tick-ring" stroke="rgba(107, 74, 37, 0.42)" fill="none" strokeLinecap="round">
          {Array.from({ length: 24 }, (_, i) => {
            const a = (i / 24) * Math.PI * 2 - Math.PI / 2
            const r1 = i % 6 === 0 ? 82 : i % 3 === 0 ? 84 : 86
            const r2 = i % 6 === 0 ? 90 : i % 3 === 0 ? 88 : 87
            return (
              <line
                key={i}
                x1={120 + r1 * Math.cos(a)}
                y1={120 + r1 * Math.sin(a)}
                x2={120 + r2 * Math.cos(a)}
                y2={120 + r2 * Math.sin(a)}
                strokeWidth={i % 6 === 0 ? 0.55 : 0.32}
              />
            )
          })}
        </g>

        <g className="fc-rose" style={{ transformOrigin: '120px 120px' }}>
          <g
            fill="url(#fc-gold-soft)"
            opacity="0.82"
            transform="rotate(0 120 120)"
          >
            <path d="M 120 56 L 126 112 L 120 124 L 114 112 Z" />
            <path d="M 120 184 L 114 128 L 120 116 L 126 128 Z" />
            <path d="M 56 120 L 112 114 L 124 120 L 112 126 Z" />
            <path d="M 184 120 L 128 126 L 116 120 L 128 114 Z" />
          </g>
          <g
            fill="url(#fc-gold)"
            opacity="0.62"
            transform="rotate(45 120 120)"
          >
            <path d="M 120 64 L 122 112 L 120 120 L 118 112 Z" />
            <path d="M 120 176 L 118 128 L 120 120 L 122 128 Z" />
            <path d="M 64 120 L 112 118 L 120 120 L 112 122 Z" />
            <path d="M 176 120 L 128 122 L 120 120 L 128 118 Z" />
          </g>
          <g
            stroke="rgba(107, 74, 37, 0.4)"
            strokeWidth="0.32"
            fill="none"
            opacity="0.55"
          >
            <circle cx="120" cy="120" r="58" />
            <circle cx="120" cy="120" r="44" strokeDasharray="0.4 1.4" />
          </g>
        </g>

        <g className="fc-station-labels">
          {COMPASS_STATIONS.map((station, i) => {
            const rad = ((station.angle - 90) * Math.PI) / 180
            const lx = 120 + 70 * Math.cos(rad)
            const ly = 120 + 70 * Math.sin(rad)
            const reached = i <= activeIndex
            return (
              <g
                key={station.roman}
                className={`fc-station${reached ? ' is-reached' : ''}${i === activeIndex ? ' is-active' : ''}`}
                transform={`translate(${lx} ${ly})`}
              >
                <circle
                  cx="0"
                  cy="0"
                  r="12"
                  fill="rgba(255, 248, 224, 0.7)"
                  stroke="url(#fc-gold)"
                  strokeWidth="0.4"
                  opacity={i === activeIndex ? 0.95 : 0.6}
                />
                <circle
                  cx="0"
                  cy="0"
                  r="12"
                  fill="none"
                  stroke="url(#fc-gold)"
                  strokeWidth="0.4"
                  strokeDasharray="0.4 1.2"
                  opacity="0.7"
                />
                <g
                  fill={i === activeIndex ? 'rgba(167, 60, 44, 0.95)' : 'rgba(107, 74, 37, 0.62)'}
                  transform="translate(-7 -7)"
                >
                  {station.glyph}
                </g>
              </g>
            )
          })}
        </g>

        {pulseKey > 0 && !reduced && (
          <circle
            key={`fc-halo-${pulseKey}`}
            cx="120"
            cy="120"
            r="60"
            fill="url(#fc-halo-pulse)"
            className="fc-needle-halo"
            style={{
              transformOrigin: '120px 120px',
              transform: `rotate(${needleAngle - 90}deg)`,
            }}
          />
        )}

        <g
          className="fc-needle"
        >
          <g
            style={{
              transformOrigin: '120px 120px',
              transform: `rotate(${needleAngle - 90}deg)`,
              transition: reduced ? 'none' : 'transform 1100ms cubic-bezier(.22, .86, .22, 1)',
            }}
          >
            <path
              d="M 120 28 L 124 116 L 120 124 L 116 116 Z"
              fill="url(#fc-gold)"
              stroke="rgba(107, 74, 37, 0.55)"
              strokeWidth="0.4"
            />
            <path
              d="M 120 28 L 124 116 L 120 124 L 116 116 Z"
              fill="none"
              stroke="rgba(255, 246, 218, 0.42)"
              strokeWidth="0.32"
              opacity="0.7"
            />
            <path
              d="M 120 212 L 116 124 L 120 116 L 124 124 Z"
              fill="rgba(107, 74, 37, 0.42)"
            />
          </g>
        </g>

        <circle cx="120" cy="120" r="5" fill="url(#fc-gold)" />
        <circle cx="120" cy="120" r="5" fill="none" stroke="rgba(80, 36, 14, 0.55)" strokeWidth="0.45" />
        <circle cx="120" cy="120" r="1.6" fill="rgba(80, 36, 14, 0.92)" />
        <circle cx="120" cy="120" r="0.55" fill="rgba(255, 248, 224, 0.95)" />

        <g className="fc-rim-text fc-rim-text--top">
          <path
            id="fc-rim-arc-top"
            d="M 120 120 m -78 0 a 78 78 0 0 1 156 0"
            fill="none"
          />
          <text>
            <textPath href="#fc-rim-arc-top" startOffset="50%" textAnchor="middle">
              ad lucem · perlege
            </textPath>
          </text>
        </g>
        <g className="fc-rim-text fc-rim-text--bot">
          <path
            id="fc-rim-arc-bot"
            d="M 120 120 m -78 0 a 78 78 0 1 0 156 0"
            fill="none"
          />
          <text>
            <textPath href="#fc-rim-arc-bot" startOffset="50%" textAnchor="middle">
              cap · xviii · folio lxxvii
            </textPath>
          </text>
        </g>

        <g
          className="fc-pips"
          fill="url(#fc-gold-soft)"
        >
          <circle cx="120" cy="20" r="0.7" />
          <circle cx="120" cy="220" r="0.7" />
          <circle cx="20" cy="120" r="0.7" />
          <circle cx="220" cy="120" r="0.7" />
        </g>
      </svg>
      <figcaption className="folio-compass-cap">
        <span className="folio-compass-cap-rule folio-compass-cap-rule--left" aria-hidden="true" />
        <span className="folio-compass-cap-text">
          <em className="folio-compass-cap-key">the folio compass</em>
          <span className="folio-compass-cap-sep" aria-hidden="true">·</span>
          <em className="folio-compass-cap-tail">
            <span className="folio-compass-cap-station">
              {COMPASS_STATIONS[activeIndex].name}
            </span>
          </em>
        </span>
        <span className="folio-compass-cap-rule folio-compass-cap-rule--right" aria-hidden="true" />
      </figcaption>
    </figure>
  )
}

/* ──────────────────────────────────────────────────────────────────────
   iteration 143 · the chapter spread earns a single reading tide and
   a small manuscript reader. A hand-drawn rule now runs beneath the
   H1 question, crosses the column, and ties the recto to the verso's
   answer-plate; a tiny marginal figure of a reader sits in the right
   gutter of the question, watching the press. Together they replace
   the question's quiet emptiness with one composed editorial gesture
   that earns the eye before the answer arrives.
   ────────────────────────────────────────────────────────────────────── */

function ReadingTide({
  progress,
  reduced,
}: {
  progress: number
  reduced: boolean
}) {
  const p = Math.max(0, Math.min(1, progress))
  return (
    <figure
      className="reading-tide-line"
      aria-hidden="true"
      style={{ '--tide-progress': p } as React.CSSProperties}
    >
      <svg
        className="reading-tide-svg"
        viewBox="0 0 1200 96"
        preserveAspectRatio="none"
        focusable="false"
      >
        <defs>
          <linearGradient id="tide-line-ink" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(156, 110, 38, 0)" />
            <stop offset="6%" stopColor="rgba(167, 60, 44, 0.42)" />
            <stop offset="32%" stopColor="rgba(120, 30, 12, 0.78)" />
            <stop offset="52%" stopColor="rgba(167, 60, 44, 0.62)" />
            <stop offset="76%" stopColor="rgba(245, 198, 91, 0.7)" />
            <stop offset="94%" stopColor="rgba(245, 198, 91, 0.18)" />
            <stop offset="100%" stopColor="rgba(245, 198, 91, 0)" />
          </linearGradient>
          <linearGradient id="tide-line-dash" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(107, 74, 37, 0)" />
            <stop offset="6%" stopColor="rgba(107, 74, 37, 0.34)" />
            <stop offset="50%" stopColor="rgba(107, 74, 37, 0.5)" />
            <stop offset="94%" stopColor="rgba(107, 74, 37, 0.34)" />
            <stop offset="100%" stopColor="rgba(107, 74, 37, 0)" />
          </linearGradient>
          <radialGradient id="tide-pip-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(245, 198, 91, 0.6)" />
            <stop offset="55%" stopColor="rgba(245, 198, 91, 0.18)" />
            <stop offset="100%" stopColor="rgba(245, 198, 91, 0)" />
          </radialGradient>
        </defs>

        <g className="reading-tide-track">
          <path
            d="M 12 64 Q 92 50 188 60 Q 284 70 376 56 Q 472 40 564 54 Q 660 70 752 58 Q 848 44 940 56 Q 1036 70 1124 60 Q 1170 56 1190 64"
            stroke="url(#tide-line-dash)"
            strokeWidth="0.5"
            strokeDasharray="1.2 4.2"
            fill="none"
            strokeLinecap="round"
          />
        </g>

        <path
          className="reading-tide-main"
          d="M 12 64 Q 92 50 188 60 Q 284 70 376 56 Q 472 40 564 54 Q 660 70 752 58 Q 848 44 940 56 Q 1036 70 1124 60 Q 1170 56 1190 64"
          stroke="url(#tide-line-ink)"
          strokeWidth="0.85"
          fill="none"
          strokeLinecap="round"
        />

        <g className="reading-tide-marks">
          <line x1="84" y1="44" x2="84" y2="78" stroke="rgba(107, 74, 37, 0.5)" strokeWidth="0.5" strokeLinecap="round" />
          <line x1="284" y1="44" x2="284" y2="80" stroke="rgba(107, 74, 37, 0.5)" strokeWidth="0.5" strokeLinecap="round" />
          <line x1="488" y1="36" x2="488" y2="80" stroke="rgba(107, 74, 37, 0.55)" strokeWidth="0.6" strokeLinecap="round" />
          <line x1="700" y1="42" x2="700" y2="80" stroke="rgba(107, 74, 37, 0.5)" strokeWidth="0.5" strokeLinecap="round" />
          <line x1="908" y1="44" x2="908" y2="78" stroke="rgba(107, 74, 37, 0.5)" strokeWidth="0.5" strokeLinecap="round" />
          <line x1="1108" y1="46" x2="1108" y2="76" stroke="rgba(107, 74, 37, 0.5)" strokeWidth="0.5" strokeLinecap="round" />

          <circle cx="84" cy="64" r="0.9" fill="rgba(167, 60, 44, 0.7)" />
          <circle cx="284" cy="64" r="0.9" fill="rgba(167, 60, 44, 0.7)" />
          <circle cx="488" cy="56" r="1.1" fill="rgba(120, 30, 12, 0.82)" />
          <circle cx="700" cy="64" r="0.9" fill="rgba(167, 60, 44, 0.7)" />
          <circle cx="908" cy="58" r="0.9" fill="rgba(167, 60, 44, 0.7)" />
          <circle cx="1108" cy="60" r="0.9" fill="rgba(167, 60, 44, 0.7)" />
        </g>

        <g className="reading-tide-letters" fill="rgba(107, 74, 37, 0.78)">
          <text x="84" y="32" textAnchor="middle" className="reading-tide-letter">¶</text>
          <text x="284" y="32" textAnchor="middle" className="reading-tide-letter">†</text>
          <text x="488" y="22" textAnchor="middle" className="reading-tide-letter reading-tide-letter--key">Q</text>
          <text x="700" y="32" textAnchor="middle" className="reading-tide-letter">A</text>
          <text x="908" y="32" textAnchor="middle" className="reading-tide-letter">R</text>
          <text x="1108" y="32" textAnchor="middle" className="reading-tide-letter">¶</text>
        </g>

        <g className="reading-tide-pendant" transform="translate(488 56)">
          <circle r="9" fill="url(#tide-pip-glow)" className="reading-tide-pendant-halo" />
          <circle r="3.4" fill="none" stroke="rgba(120, 30, 12, 0.78)" strokeWidth="0.6" />
          <circle r="1.6" fill="rgba(245, 198, 91, 0.95)" />
          <line x1="0" y1="3.6" x2="0" y2="22" stroke="rgba(107, 74, 37, 0.55)" strokeWidth="0.5" strokeLinecap="round" strokeDasharray="0.6 1.4" />
          <path d="M -2 24 L 0 28 L 2 24 Z" fill="rgba(107, 74, 37, 0.7)" />
        </g>

        <g className="reading-tide-arrow" transform="translate(1186 64)">
          <path d="M -6 -4 L 4 0 L -6 4 Z" fill="rgba(120, 30, 12, 0.7)" />
        </g>
      </svg>
      <figcaption className="reading-tide-cap" aria-hidden="true">
        <span className="reading-tide-cap-rule reading-tide-cap-rule--left" />
        <span className="reading-tide-cap-cluster">
          <em className="reading-tide-cap-key">the reading tide</em>
          <span className="reading-tide-cap-sep" aria-hidden="true">·</span>
          <em className="reading-tide-cap-tail">a single hand-drawn rule, beneath the question</em>
        </span>
        <span className="reading-tide-cap-rule reading-tide-cap-rule--right" />
      </figcaption>
    </figure>
  )
}

function ManuscriptReader({
  active,
  reduced,
  watchPoint,
}: {
  active: boolean
  reduced: boolean
  watchPoint: { x: number; y: number; inside: boolean }
}) {
  const clamp = (v: number, lo: number, hi: number) =>
    Math.max(lo, Math.min(hi, v))
  const headX = watchPoint.inside ? clamp(watchPoint.x * 1.6, -1.6, 1.6) : 0
  const headY = watchPoint.inside ? clamp(watchPoint.y * 1.0, -1.0, 1.0) : 0
  return (
    <figure
      className={`manuscript-reader${active ? ' is-active' : ''}${
        reduced ? ' is-static' : ''
      }`}
      aria-hidden="true"
    >
      <svg
        className="manuscript-reader-plate"
        viewBox="0 0 120 132"
        focusable="false"
      >
        <defs>
          <linearGradient id="mr-frame" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#9c6e26" />
            <stop offset="50%" stopColor="#c8923e" />
            <stop offset="100%" stopColor="#7a4f1a" />
          </linearGradient>
          <radialGradient id="mr-paper" cx="50%" cy="38%" r="64%">
            <stop offset="0%" stopColor="rgba(255, 248, 224, 0.94)" />
            <stop offset="62%" stopColor="rgba(245, 220, 168, 0.82)" />
            <stop offset="100%" stopColor="rgba(214, 178, 116, 0.6)" />
          </radialGradient>
          <radialGradient id="mr-halo" cx="50%" cy="50%" r="55%">
            <stop offset="0%" stopColor="rgba(255, 220, 150, 0.34)" />
            <stop offset="100%" stopColor="rgba(255, 220, 150, 0)" />
          </radialGradient>
          <linearGradient id="mr-cloak" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(167, 60, 44, 0.78)" />
            <stop offset="100%" stopColor="rgba(96, 28, 14, 0.92)" />
          </linearGradient>
          <linearGradient id="mr-skin" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(245, 198, 142, 0.96)" />
            <stop offset="100%" stopColor="rgba(196, 144, 96, 0.92)" />
          </linearGradient>
        </defs>

        <ellipse cx="60" cy="68" rx="56" ry="62" fill="url(#mr-halo)" />

        <rect
          x="2"
          y="2"
          width="116"
          height="128"
          rx="1.4"
          fill="url(#mr-paper)"
          stroke="url(#mr-frame)"
          strokeWidth="0.85"
        />
        <rect
          x="6"
          y="6"
          width="108"
          height="120"
          rx="0.8"
          fill="none"
          stroke="url(#mr-frame)"
          strokeWidth="0.32"
          strokeDasharray="1.2 1.6"
          opacity="0.78"
        />

        <g className="mr-corners" fill="#cf3b29" fillOpacity="0.55">
          <path d="M 9 9 L 16 9 Q 16 12 13 13 L 13 16 L 9 16 Z" />
          <circle cx="11" cy="11" r="0.6" />
          <path d="M 111 9 L 104 9 Q 104 12 107 13 L 107 16 L 111 16 Z" />
          <circle cx="109" cy="11" r="0.6" />
          <path d="M 9 123 L 16 123 Q 16 120 13 119 L 13 116 L 9 116 Z" />
          <circle cx="11" cy="121" r="0.6" />
          <path d="M 111 123 L 104 123 Q 104 120 107 119 L 107 116 L 111 116 Z" />
          <circle cx="109" cy="121" r="0.6" />
        </g>

        <g className="mr-pips" fill="url(#mr-frame)">
          <circle cx="60" cy="9" r="0.6" />
          <circle cx="60" cy="123" r="0.6" />
          <circle cx="9" cy="66" r="0.55" />
          <circle cx="111" cy="66" r="0.55" />
        </g>

        <g className="mr-pedestal" stroke="rgba(107, 74, 37, 0.6)" fill="none" strokeLinecap="round">
          <line x1="22" y1="110" x2="98" y2="110" strokeWidth="0.7" />
          <line x1="30" y1="113" x2="90" y2="113" strokeWidth="0.35" strokeDasharray="0.5 1.2" opacity="0.7" />
          <line x1="38" y1="110" x2="38" y2="116" strokeWidth="0.4" />
          <line x1="60" y1="110" x2="60" y2="118" strokeWidth="0.4" />
          <line x1="82" y1="110" x2="82" y2="116" strokeWidth="0.4" />
        </g>

        <g className="mr-body">
          <path
            d="M 32 108 Q 38 70 60 64 Q 82 70 88 108 L 32 108 Z"
            fill="url(#mr-cloak)"
            stroke="rgba(58, 12, 6, 0.55)"
            strokeWidth="0.5"
          />
          <path
            d="M 60 64 L 60 108"
            stroke="rgba(58, 12, 6, 0.32)"
            strokeWidth="0.4"
            strokeDasharray="0.4 1.2"
            opacity="0.6"
          />
          <g
            className="mr-fold-lines"
            stroke="rgba(255, 232, 200, 0.22)"
            strokeWidth="0.4"
            fill="none"
            strokeLinecap="round"
          >
            <path d="M 44 92 Q 48 88 52 92" />
            <path d="M 50 100 Q 54 96 58 100" />
            <path d="M 66 92 Q 70 88 74 92" />
            <path d="M 70 100 Q 74 96 78 100" />
            <path d="M 56 78 Q 60 74 64 78" />
          </g>
        </g>

        <g className="mr-book" transform="translate(60 92)">
          <path
            d="M -16 -2 L 0 -6 L 16 -2 L 14 6 L 0 4 L -14 6 Z"
            fill="rgba(245, 220, 168, 0.92)"
            stroke="rgba(107, 74, 37, 0.55)"
            strokeWidth="0.45"
          />
          <line x1="0" y1="-6" x2="0" y2="4" stroke="rgba(107, 74, 37, 0.45)" strokeWidth="0.4" />
          <line
            x1="-12"
            y1="0"
            x2="-4"
            y2="-1.4"
            stroke="rgba(107, 74, 37, 0.55)"
            strokeWidth="0.3"
            strokeDasharray="0.4 1.1"
          />
          <line
            x1="4"
            y1="-1.4"
            x2="12"
            y2="0"
            stroke="rgba(107, 74, 37, 0.55)"
            strokeWidth="0.3"
            strokeDasharray="0.4 1.1"
          />
        </g>

        <g
          className="mr-head"
          style={
            reduced
              ? undefined
              : { transform: `translate(${headX}px, ${headY}px)` }
          }
        >
          <ellipse cx="60" cy="48" rx="11" ry="13" fill="url(#mr-skin)" stroke="rgba(107, 74, 37, 0.45)" strokeWidth="0.4" />
          <path
            d="M 49 44 Q 60 30 71 44 Q 70 38 60 36 Q 50 38 49 44 Z"
            fill="rgba(58, 36, 18, 0.88)"
          />
          <path
            d="M 50 50 Q 60 56 70 50 Q 68 56 60 58 Q 52 56 50 50 Z"
            fill="rgba(167, 60, 44, 0.32)"
            opacity="0.85"
          />
          <g
            className="mr-eyes"
            fill="rgba(28, 22, 16, 0.92)"
          >
            <circle cx="55" cy="49" r="0.95" />
            <circle cx="65" cy="49" r="0.95" />
          </g>
          <line
            x1="60"
            y1="52"
            x2="60"
            y2="55"
            stroke="rgba(107, 74, 37, 0.55)"
            strokeWidth="0.4"
            strokeLinecap="round"
          />
        </g>

        <g
          className="mr-hand"
          stroke="url(#mr-skin)"
          strokeWidth="0.5"
          fill="rgba(196, 144, 96, 0.6)"
        >
          <ellipse cx="44" cy="92" rx="3" ry="1.6" transform="rotate(-8 44 92)" />
          <ellipse cx="76" cy="92" rx="3" ry="1.6" transform="rotate(8 76 92)" />
        </g>

        <g className="mr-quill" transform="translate(78 86)">
          <line
            x1="0"
            y1="0"
            x2="14"
            y2="-8"
            stroke="rgba(60, 36, 16, 0.7)"
            strokeWidth="0.6"
            strokeLinecap="round"
          />
          <path
            d="M 12 -7 Q 18 -10 22 -7 Q 20 -3 14 -4 Q 12 -6 12 -7 Z"
            fill="rgba(190, 150, 100, 0.78)"
            stroke="rgba(60, 36, 16, 0.5)"
            strokeWidth="0.3"
          />
          <circle cx="22" cy="-7" r="0.5" fill="rgba(28, 22, 16, 0.8)" />
        </g>

        <text x="60" y="126" textAnchor="middle" className="mr-tag">
          the reader
        </text>
      </svg>
    </figure>
  )
}

/* ──────────────────────────────────────────────────────────────────────
   iteration 144 · the recto spread earns a small tide lamp, a hand-drawn
   oil lamp set in the lower-left margin of the chapter spread. Its
   wick glows at idle, flickers softly while answering and replying, and
   settles to a steady warm flame when the reading is complete. A soft
   halo radiates onto the reading tide, balancing the manuscript reader
   in the upper-right and completing the recto composition.
   ────────────────────────────────────────────────────────────────────── */

function TideLamp({
  active,
  reduced,
}: {
  active: boolean
  reduced: boolean
}) {
  return (
    <figure
      className={`recto-tide-lamp${active ? ' is-active' : ''}${reduced ? ' is-static' : ''}`}
      aria-hidden="true"
    >
      <svg
        className="recto-tide-lamp-plate"
        viewBox="0 0 110 138"
        focusable="false"
      >
        <defs>
          <linearGradient id="tl-frame" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#9c6e26" />
            <stop offset="50%" stopColor="#c8923e" />
            <stop offset="100%" stopColor="#7a4f1a" />
          </linearGradient>
          <radialGradient id="tl-paper" cx="50%" cy="38%" r="64%">
            <stop offset="0%" stopColor="rgba(255, 248, 224, 0.94)" />
            <stop offset="62%" stopColor="rgba(245, 220, 168, 0.82)" />
            <stop offset="100%" stopColor="rgba(214, 178, 116, 0.6)" />
          </radialGradient>
          <radialGradient id="tl-halo" cx="50%" cy="50%" r="55%">
            <stop offset="0%" stopColor="rgba(255, 220, 150, 0.42)" />
            <stop offset="100%" stopColor="rgba(255, 220, 150, 0)" />
          </radialGradient>
          <radialGradient id="tl-halo-inner" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(255, 232, 178, 0.68)" />
            <stop offset="60%" stopColor="rgba(245, 198, 91, 0.18)" />
            <stop offset="100%" stopColor="rgba(245, 198, 91, 0)" />
          </radialGradient>
          <linearGradient id="tl-flame" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(255, 248, 224, 0.95)" />
            <stop offset="48%" stopColor="rgba(245, 198, 91, 0.92)" />
            <stop offset="100%" stopColor="rgba(217, 101, 74, 0.55)" />
          </linearGradient>
          <radialGradient id="tl-flame-core" cx="50%" cy="58%" r="50%">
            <stop offset="0%" stopColor="rgba(255, 248, 232, 0.96)" />
            <stop offset="55%" stopColor="rgba(255, 220, 150, 0.7)" />
            <stop offset="100%" stopColor="rgba(217, 101, 74, 0)" />
          </radialGradient>
          <radialGradient id="tl-reservoir" cx="40%" cy="32%" r="82%">
            <stop offset="0%" stopColor="rgba(255, 232, 178, 0.94)" />
            <stop offset="50%" stopColor="rgba(200, 152, 76, 0.85)" />
            <stop offset="100%" stopColor="rgba(107, 74, 37, 0.78)" />
          </radialGradient>
          <linearGradient id="tl-glass" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(245, 220, 168, 0.65)" />
            <stop offset="100%" stopColor="rgba(120, 80, 36, 0.55)" />
          </linearGradient>
          <pattern id="tl-hatch" width="2.4" height="2.4" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
            <line x1="0" y1="0" x2="0" y2="2.4" stroke="rgba(107, 74, 37, 0.28)" strokeWidth="0.32" />
          </pattern>
        </defs>

        <ellipse cx="76" cy="46" rx="50" ry="56" fill="url(#tl-halo)" className="tl-outer-halo" />
        <ellipse cx="76" cy="46" rx="22" ry="26" fill="url(#tl-halo-inner)" className="tl-inner-halo" />

        <rect
          x="2"
          y="2"
          width="106"
          height="134"
          rx="1.4"
          fill="url(#tl-paper)"
          stroke="url(#tl-frame)"
          strokeWidth="0.85"
        />
        <rect
          x="6"
          y="6"
          width="98"
          height="126"
          rx="0.8"
          fill="none"
          stroke="url(#tl-frame)"
          strokeWidth="0.32"
          strokeDasharray="1.2 1.6"
          opacity="0.78"
        />

        <g className="tl-corners" fill="#cf3b29" fillOpacity="0.55">
          <path d="M 9 9 L 16 9 Q 16 12 13 13 L 13 16 L 9 16 Z" />
          <circle cx="11" cy="11" r="0.6" />
          <path d="M 101 9 L 94 9 Q 94 12 97 13 L 97 16 L 101 16 Z" />
          <circle cx="99" cy="11" r="0.6" />
          <path d="M 9 129 L 16 129 Q 16 126 13 125 L 13 122 L 9 122 Z" />
          <circle cx="11" cy="127" r="0.6" />
          <path d="M 101 129 L 94 129 Q 94 126 97 125 L 97 122 L 101 122 Z" />
          <circle cx="99" cy="127" r="0.6" />
        </g>

        <g className="tl-pips" fill="url(#tl-frame)">
          <circle cx="55" cy="9" r="0.6" />
          <circle cx="55" cy="129" r="0.6" />
          <circle cx="9" cy="69" r="0.55" />
          <circle cx="101" cy="69" r="0.55" />
        </g>

        <g className="tl-baseline" stroke="rgba(107, 74, 37, 0.5)" fill="none" strokeLinecap="round">
          <line x1="22" y1="118" x2="78" y2="118" strokeWidth="0.7" />
          <line x1="30" y1="121" x2="70" y2="121" strokeWidth="0.35" strokeDasharray="0.5 1.2" opacity="0.7" />
          <line x1="34" y1="118" x2="34" y2="124" strokeWidth="0.4" />
          <line x1="50" y1="118" x2="50" y2="126" strokeWidth="0.4" />
          <line x1="66" y1="118" x2="66" y2="124" strokeWidth="0.4" />
        </g>

        <g className="tl-stand">
          <ellipse cx="50" cy="106" rx="13" ry="2.6" fill="rgba(107, 74, 37, 0.5)" />
          <path d="M 44 106 L 56 106 L 53 96 L 47 96 Z" fill="rgba(107, 74, 37, 0.62)" />
          <ellipse cx="50" cy="96" rx="10" ry="2" fill="rgba(150, 110, 56, 0.78)" stroke="rgba(107, 74, 37, 0.55)" strokeWidth="0.4" />
        </g>

        <g className="tl-reservoir-group">
          <ellipse cx="50" cy="80" rx="22" ry="18" fill="url(#tl-reservoir)" stroke="rgba(107, 74, 37, 0.6)" strokeWidth="0.55" />
          <ellipse cx="50" cy="80" rx="22" ry="18" fill="url(#tl-hatch)" opacity="0.45" />
          <ellipse cx="50" cy="80" rx="22" ry="18" fill="none" stroke="url(#tl-frame)" strokeWidth="0.32" strokeDasharray="0.6 1.4" opacity="0.6" />
          <ellipse cx="50" cy="80" rx="14" ry="11" fill="none" stroke="rgba(107, 74, 37, 0.4)" strokeWidth="0.32" opacity="0.7" />
          <ellipse cx="44" cy="73" rx="9" ry="3" fill="rgba(255, 246, 218, 0.55)" />

          <ellipse cx="50" cy="63" rx="11" ry="2.6" fill="rgba(107, 74, 37, 0.7)" />
          <rect x="44" y="60" width="12" height="3.6" fill="url(#tl-glass)" stroke="rgba(107, 74, 37, 0.55)" strokeWidth="0.4" rx="0.4" />
          <line x1="46" y1="62" x2="54" y2="62" stroke="rgba(107, 74, 37, 0.4)" strokeWidth="0.3" strokeDasharray="0.4 1" opacity="0.7" />
          <ellipse cx="50" cy="60" rx="8" ry="1.6" fill="rgba(245, 220, 168, 0.85)" stroke="rgba(107, 74, 37, 0.55)" strokeWidth="0.4" />
        </g>

        <g className="tl-spout">
          <path d="M 58 60 L 86 50 L 86 56 L 58 64 Z" fill="rgba(107, 74, 37, 0.72)" stroke="rgba(58, 36, 18, 0.55)" strokeWidth="0.4" />
          <ellipse cx="86" cy="53" rx="2.4" ry="3" fill="rgba(245, 220, 168, 0.78)" stroke="rgba(107, 74, 37, 0.55)" strokeWidth="0.4" />
          <path d="M 84 56 Q 88 58 88 60" fill="none" stroke="rgba(107, 74, 37, 0.5)" strokeWidth="0.3" />
          <line x1="86" y1="50" x2="86" y2="46" stroke="rgba(58, 36, 18, 0.78)" strokeWidth="0.55" strokeLinecap="round" />
        </g>

        <g className="tl-flame" transform="translate(86 44)">
          <ellipse cx="0" cy="-2" rx="8" ry="11" fill="url(#tl-flame)" className="tl-flame-body" />
          <ellipse cx="0" cy="-1" rx="4" ry="7" fill="url(#tl-flame-core)" className="tl-flame-inner" />
          <ellipse cx="0" cy="0" rx="1.2" ry="3.2" fill="rgba(255, 248, 224, 0.92)" className="tl-flame-tip" />
          <circle cx="0" cy="4" r="0.6" fill="rgba(245, 198, 91, 0.4)" className="tl-flame-base" />
        </g>

        <circle cx="86" cy="46" r="0.6" fill="rgba(245, 198, 91, 0.42)" className="tl-ember" />

        <text x="55" y="132" textAnchor="middle" className="tl-tag">
          the lamp
        </text>
      </svg>
    </figure>
  )
}

/* ──────────────────────────────────────────────────────────────────────
   iteration 160 · the verso's body earns its own composed plate.

   A single grand typographic impression that closes the reply's body,
   mirroring the recto's ReadingTideTail in idiom but speaking in the
   reply's slower voice. A thin gold rule fades in from either side, a
   leaf-and-fleuron sigil (the reply's own motif, shared with
   ReplyCatchword) takes the centre, and a single italic inscription —
   "the reply · ad lucem · perlege" — names the moment. It replaces
   the simple reply-close and earns its place as the verse's own quiet
   closure, completing the recto-verso typographic symmetry: every body
   on the folio now ends with a composed impression, not a small rule.
   ────────────────────────────────────────────────────────────────────── */

function FolioReplyPlate({
  visible,
  reduced,
  slow,
}: {
  visible: boolean
  reduced: boolean
  slow: boolean
}) {
  const label = slow ? 'set slowly · ad lucem' : 'ad lucem · perlege'
  return (
    <figure
      className={`folio-reply-plate${visible ? ' is-visible' : ''}${
        reduced ? ' is-static' : ''
      }${slow ? ' is-slow' : ''}`}
      aria-hidden="true"
    >
      <svg
        className="folio-reply-plate-rule"
        viewBox="0 0 320 22"
        focusable="false"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="frp-rule" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(167, 60, 44, 0)" />
            <stop offset="14%" stopColor="rgba(167, 60, 44, 0.5)" />
            <stop offset="46%" stopColor="rgba(200, 146, 62, 0.66)" />
            <stop offset="54%" stopColor="rgba(200, 146, 62, 0.66)" />
            <stop offset="86%" stopColor="rgba(167, 60, 44, 0.5)" />
            <stop offset="100%" stopColor="rgba(167, 60, 44, 0)" />
          </linearGradient>
          <linearGradient id="frp-rule-ghost" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(167, 60, 44, 0)" />
            <stop offset="14%" stopColor="rgba(167, 60, 44, 0.16)" />
            <stop offset="50%" stopColor="rgba(167, 60, 44, 0.22)" />
            <stop offset="86%" stopColor="rgba(167, 60, 44, 0.16)" />
            <stop offset="100%" stopColor="rgba(167, 60, 44, 0)" />
          </linearGradient>
          <linearGradient id="frp-gold" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f6d076" />
            <stop offset="50%" stopColor="#c8923e" />
            <stop offset="100%" stopColor="#9c6e26" />
          </linearGradient>
          <radialGradient id="frp-bloom" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(245, 198, 91, 0.45)" />
            <stop offset="62%" stopColor="rgba(245, 198, 91, 0.12)" />
            <stop offset="100%" stopColor="rgba(245, 198, 91, 0)" />
          </radialGradient>
          <linearGradient id="frp-leaf" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(154, 110, 38, 0.62)" />
            <stop offset="100%" stopColor="rgba(78, 56, 28, 0.78)" />
          </linearGradient>
        </defs>

        <line
          x1="6"
          y1="14"
          x2="314"
          y2="14"
          stroke="url(#frp-rule-ghost)"
          strokeWidth="0.22"
          strokeDasharray="0.6 1.6"
          strokeLinecap="round"
        />
        <line
          x1="6"
          y1="11"
          x2="314"
          y2="11"
          stroke="url(#frp-rule)"
          strokeWidth="0.55"
          strokeLinecap="round"
          className="folio-reply-plate-line"
        />

        <g className="folio-reply-plate-bloom" transform="translate(160 11)">
          <circle r="7.2" fill="url(#frp-bloom)" />
        </g>

        <g className="folio-reply-plate-leaf" transform="translate(160 11)">
          <path
            d="M 0 -6.4 Q 4.4 -4.4 5.4 -1 Q 4.4 4.4 0 6.4 Q -4.4 4.4 -5.4 1 Q -4.4 -4.4 0 -6.4 Z"
            fill="rgba(154, 110, 38, 0.34)"
            stroke="url(#frp-leaf)"
            strokeWidth="0.42"
          />
          <path
            d="M 0 -6.4 Q 4.4 -4.4 5.4 -1 Q 4.4 4.4 0 6.4 Z"
            fill="rgba(167, 60, 44, 0.22)"
            stroke="none"
          />
          <line
            x1="0"
            y1="-6"
            x2="0"
            y2="6"
            stroke="rgba(107, 74, 37, 0.55)"
            strokeWidth="0.32"
            strokeLinecap="round"
          />
          <line
            x1="0"
            y1="-3"
            x2="3"
            y2="-1"
            stroke="rgba(107, 74, 37, 0.5)"
            strokeWidth="0.28"
            strokeLinecap="round"
          />
          <line
            x1="0"
            y1="0"
            x2="3.4"
            y2="0"
            stroke="rgba(107, 74, 37, 0.5)"
            strokeWidth="0.28"
            strokeLinecap="round"
          />
          <line
            x1="0"
            y1="3"
            x2="3"
            y2="1"
            stroke="rgba(107, 74, 37, 0.5)"
            strokeWidth="0.28"
            strokeLinecap="round"
          />
          <line
            x1="0"
            y1="-3"
            x2="-3"
            y2="-1"
            stroke="rgba(107, 74, 37, 0.5)"
            strokeWidth="0.28"
            strokeLinecap="round"
          />
          <line
            x1="0"
            y1="0"
            x2="-3.4"
            y2="0"
            stroke="rgba(107, 74, 37, 0.5)"
            strokeWidth="0.28"
            strokeLinecap="round"
          />
          <line
            x1="0"
            y1="3"
            x2="-3"
            y2="1"
            stroke="rgba(107, 74, 37, 0.5)"
            strokeWidth="0.28"
            strokeLinecap="round"
          />
          <circle cx="0" cy="0" r="0.6" fill="rgba(167, 60, 44, 0.88)" />
          <circle cx="0" cy="0" r="0.18" fill="rgba(255, 248, 224, 0.95)" />

          <path
            className="folio-reply-plate-fleuron"
            d="M 0 7.6 Q -2.6 6.4 -3 5 M 0 7.6 Q 2.6 6.4 3 5"
            fill="none"
            stroke="rgba(167, 60, 44, 0.7)"
            strokeWidth="0.36"
            strokeLinecap="round"
          />
        </g>

        <g className="folio-reply-plate-pip folio-reply-plate-pip--l" transform="translate(58 11)">
          <circle r="0.5" fill="rgba(167, 60, 44, 0.62)" />
        </g>
        <g className="folio-reply-plate-pip folio-reply-plate-pip--r" transform="translate(262 11)">
          <circle r="0.5" fill="rgba(167, 60, 44, 0.62)" />
        </g>

        <g className="folio-reply-plate-diamond folio-reply-plate-diamond--l" transform="translate(96 11)">
          <path d="M 0 -1.6 L 1.6 0 L 0 1.6 L -1.6 0 Z" fill="rgba(167, 60, 44, 0.42)" />
        </g>
        <g className="folio-reply-plate-diamond folio-reply-plate-diamond--r" transform="translate(224 11)">
          <path d="M 0 -1.6 L 1.6 0 L 0 1.6 L -1.6 0 Z" fill="rgba(167, 60, 44, 0.42)" />
        </g>
      </svg>

      <figcaption className="folio-reply-plate-cap">
        <span className="folio-reply-plate-cap-rule folio-reply-plate-cap-rule--left" aria-hidden="true" />
        <span className="folio-reply-plate-cap-cluster">
          <em className="folio-reply-plate-cap-key">the reply</em>
          <span className="folio-reply-plate-cap-sep" aria-hidden="true">·</span>
          <em className="folio-reply-plate-cap-tail">{label}</em>
          <span className="folio-reply-plate-cap-mark" aria-hidden="true">¶</span>
        </span>
        <span className="folio-reply-plate-cap-rule folio-reply-plate-cap-rule--right" aria-hidden="true" />
      </figcaption>
    </figure>
  )
}

export function App() {
  const reduced = useReducedMotion()
  const now = useNow()
  const watchPoint = useSheetPointer()
  const [phase, setPhase] = useState<Phase>('idle')
  const [slow, setSlow] = useState(false)
  const [answerChars, setAnswerChars] = useState(0)
  const [replyChars, setReplyChars] = useState(0)
  const [cycle, setCycle] = useState(0)
  const [sealPressing, setSealPressing] = useState(false)
  const [pressSweeping, setPressSweeping] = useState(false)
  const [owlBlinking, setOwlBlinking] = useState(false)
  const [slipIntensity, setSlipIntensity] = useState(0)
  const [activeSection, setActiveSection] = useState<string>('sec-question')
  const [versoOpened, setVersoOpened] = useState(false)
  const [leafTurning, setLeafTurning] = useState(false)
  const [firstMoment, setFirstMoment] = useState<Date | null>(null)
  const [readings, setReadings] = useState<Date[]>([])
  const [activeGloss, setActiveGloss] = useState<string | null>(null)
  const prevPhaseRef = useRef<Phase>('idle')

  const sectionRefs = useRef<Record<string, HTMLElement | null>>({})
  const jumpRef = useRef<number | null>(null)

  const readAnswerRef = useRef<() => void>(() => {})
  const handleSealPressRef = useRef<() => void>(() => {})

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented) return
      const target = e.target as HTMLElement | null
      const tag = target?.tagName?.toLowerCase()
      if (tag === 'input' || tag === 'textarea' || target?.isContentEditable) return
      if (e.key === ' ' || e.key.toLowerCase() === 'r') {
        e.preventDefault()
        handleSealPressRef.current()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    if (phase !== 'answering') return
    if (answerChars >= ANSWER.length) {
      const timer = window.setTimeout(
        () => setPhase('replying'),
        reduced ? 60 : slow ? 720 : 430,
      )
      return () => window.clearTimeout(timer)
    }
    if (reduced) {
      setAnswerChars(ANSWER.length)
      return
    }
    const timer = window.setTimeout(
      () => setAnswerChars((current) => Math.min(ANSWER.length, current + 1)),
      slow ? 82 : 38,
    )
    return () => window.clearTimeout(timer)
  }, [answerChars, phase, reduced, slow])

  useEffect(() => {
    if (phase !== 'replying') return
    if (replyChars >= REPLY.length) {
      const timer = window.setTimeout(() => setPhase('complete'), reduced ? 40 : 520)
      return () => window.clearTimeout(timer)
    }
    if (reduced) {
      setReplyChars(REPLY.length)
      return
    }
    const timer = window.setTimeout(
      () => setReplyChars((current) => Math.min(REPLY.length, current + 1)),
      slow ? 68 : 30,
    )
    return () => window.clearTimeout(timer)
  }, [phase, reduced, replyChars, slow])

  useEffect(() => {
    if (prevPhaseRef.current === 'replying' && phase === 'complete') {
      setReadings((prev) => [...prev, new Date()])
    }
    if (prevPhaseRef.current === 'complete' && phase !== 'complete') {
      setActiveGloss(null)
    }
    prevPhaseRef.current = phase
  }, [phase])

  const readAnswer = () => {
    if (phase === 'idle') {
      setFirstMoment(new Date())
      setVersoOpened(true)
      setLeafTurning(true)
      window.setTimeout(() => setLeafTurning(false), reduced ? 220 : 1180)
    }
    if (phase === 'complete') setSlow((current) => !current)
    setAnswerChars(0)
    setReplyChars(0)
    setPhase('answering')
    if (phase === 'complete') setCycle((c) => c + 1)
  }

  const [sealBreaking, setSealBreaking] = useState(false)
  const sealBreakTimerRef = useRef<number | null>(null)
  const handleSealPress = () => {
    if (sealBreaking) return
    if (phase === 'answering' || phase === 'replying') return
    setSealBreaking(true)
    setPressSweeping(true)
    window.setTimeout(() => setPressSweeping(false), reduced ? 220 : 1180)
    if (sealBreakTimerRef.current !== null) window.clearTimeout(sealBreakTimerRef.current)
    sealBreakTimerRef.current = window.setTimeout(() => {
      setSealBreaking(false)
      readAnswer()
    }, reduced ? 80 : 720)
  }

  useEffect(() => {
    return () => {
      if (sealBreakTimerRef.current !== null) window.clearTimeout(sealBreakTimerRef.current)
    }
  }, [])

  useEffect(() => {
    readAnswerRef.current = readAnswer
  })

  useEffect(() => {
    handleSealPressRef.current = handleSealPress
  })

  const sealTimerRef = useRef<number | null>(null)
  useEffect(() => {
    if (cycle === 0) return
    setSealPressing(true)
    if (sealTimerRef.current !== null) window.clearTimeout(sealTimerRef.current)
    sealTimerRef.current = window.setTimeout(() => setSealPressing(false), 720)
    return () => {
      if (sealTimerRef.current !== null) window.clearTimeout(sealTimerRef.current)
    }
  }, [cycle])

  const blinkTimerRef = useRef<number | null>(null)
  useEffect(() => {
    if (phase === 'replying' || phase === 'complete') {
      setOwlBlinking(true)
      if (blinkTimerRef.current !== null) window.clearTimeout(blinkTimerRef.current)
      blinkTimerRef.current = window.setTimeout(() => setOwlBlinking(false), 360)
      return () => {
        if (blinkTimerRef.current !== null)
          window.clearTimeout(blinkTimerRef.current)
      }
    }
  }, [phase])

  const slipTimerRef = useRef<number | null>(null)
  useEffect(() => {
    if (phase === 'complete') {
      setSlipIntensity(0)
      let frame = 0
      const start = performance.now()
      const duration = 1100
      const animate = (now: number) => {
        const t = Math.min(1, (now - start) / duration)
        setSlipIntensity(t)
        if (t < 1) frame = requestAnimationFrame(animate)
      }
      frame = requestAnimationFrame(animate)
      return () => cancelAnimationFrame(frame)
    }
    if (slipTimerRef.current !== null) window.clearTimeout(slipTimerRef.current)
    if (phase === 'replying') {
      slipTimerRef.current = window.setTimeout(() => setSlipIntensity(0.4), 80)
    }
    return () => {
      if (slipTimerRef.current !== null)
        window.clearTimeout(slipTimerRef.current)
    }
  }, [phase])

  const handleSelectSection = (hash: string) => {
    const node = sectionRefs.current[hash]
    if (!node) return
    node.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' })
    setActiveSection(hash)
    if (typeof history !== 'undefined' && history.replaceState) {
      history.replaceState(null, '', `#${hash}`)
    }
  }

  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return
    const visible = new Map<string, number>()
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = (entry.target as HTMLElement).dataset.section
          if (!id) continue
          if (entry.isIntersecting) {
            visible.set(id, entry.intersectionRatio)
          } else {
            visible.delete(id)
          }
        }
        if (visible.size === 0) return
        let best = ''
        let bestRatio = -1
        visible.forEach((ratio, id) => {
          if (ratio > bestRatio) {
            bestRatio = ratio
            best = id
          }
        })
        if (best) setActiveSection(best)
      },
      {
        rootMargin: '-20% 0px -45% 0px',
        threshold: [0, 0.2, 0.4, 0.6, 0.8, 1],
      },
    )
    const observe = () => {
      Object.values(sectionRefs.current).forEach((node) => {
        if (node) observer.observe(node)
      })
    }
    observe()
    const t = window.setTimeout(observe, 80)
    return () => {
      window.clearTimeout(t)
      observer.disconnect()
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const onHash = () => {
      const id = window.location.hash.replace('#', '')
      if (id && sectionRefs.current[id]) {
        jumpRef.current = window.setTimeout(() => setActiveSection(id), 220)
      }
    }
    window.addEventListener('hashchange', onHash)
    if (window.location.hash) onHash()
    return () => {
      window.removeEventListener('hashchange', onHash)
      if (jumpRef.current !== null) window.clearTimeout(jumpRef.current)
    }
  }, [])

  const answerVisible = phase !== 'idle'
  const answerDisplay = ANSWER.slice(0, answerChars)
  const replyDisplay = REPLY.slice(0, replyChars)
  const isTyping = phase === 'answering' || phase === 'replying'
  const replyShown = phase === 'replying' || phase === 'complete'
  const benchShown = replyShown
  const pressSlipShown = phase === 'replying' || phase === 'complete'
  const owlShown = isTyping || phase === 'complete'
  const quillActive = phase === 'answering'
  const quillProgress = answerChars + replyChars

  const tideStage =
    phase === 'idle' ? 0 : phase === 'answering' ? 1 : phase === 'replying' ? 2 : 3

  const inkProgress =
    phase === 'idle'
      ? 0
      : phase === 'answering'
        ? answerChars / ANSWER.length
        : phase === 'replying'
          ? Math.min(1, (answerChars / ANSWER.length) + (replyChars / REPLY.length) * 0.45)
          : 1

  const buttonLabel =
    phase === 'idle'
      ? 'read the answer'
      : phase === 'complete'
        ? slow
          ? 'read again · page pace'
          : 'read again · slower'
        : 'setting the answer…'

  const readerNote =
    phase === 'complete'
      ? cycle === 1
        ? 'The second reading changes the pace, not the answer.'
        : cycle === 2
          ? 'A third reading — the page is unchanged; the eye, slower.'
          : 'Still reading — the words, the same. Ad lucem.'
      : 'One press opens it. The next asks you to slow down.'

  const readerSubNote =
    phase === 'complete'
      ? cycle === 1
        ? 'press the seal again, and the page answers slower.'
        : cycle === 2
          ? 'the wax is older now; the reader, the same.'
          : 'the lamp is steady; the line, well worn.'
      : null

  const hourDialVisible = phase !== 'idle'
  const hours = now.getHours()
  const minutes = now.getMinutes()
  const seconds = now.getSeconds()
  const moonPhase = moonPhaseOf(now)

  const totalChars = answerChars + replyChars
  const lineCount =
    totalChars > 0
      ? Math.min(ROMAN.length, Math.ceil(totalChars / 14))
      : 0
  const readingLinesVisible = answerVisible

  return (
    <main className="experiment-shell">
      <div className="ambient-stars" aria-hidden="true" />
      <div className="ambient-stars--twos" aria-hidden="true" />
      <div className="ambient-vignette" aria-hidden="true" />

      <article
        className={`sheet ${phase !== 'idle' ? 'has-answer' : ''}${
          phase === 'complete' ? ' is-complete' : ''
        }`}
      >
        <span
          className={`sheet-ambient${phase !== 'idle' ? ' is-lit' : ''}`}
          aria-hidden="true"
        />
        <span className="sheet-deckle sheet-deckle--top" aria-hidden="true" />
        <span className="sheet-deckle sheet-deckle--bottom" aria-hidden="true" />
        <ReadingLamp intensity={inkProgress} />
        <ReadingLens intensity={phase !== 'idle' ? Math.min(1, inkProgress + 0.18) : 0} reduced={reduced} />
        <DustMotes reduced={reduced} />
        <BookmarkRibbon />
        <FoldShade active={leafTurning} />
        <span
          className={`press-sweep${pressSweeping ? ' is-sweeping' : ''}`}
          aria-hidden="true"
        />
        <span className="gilded-edge" aria-hidden="true" />

        <span className="sheet-watermark" aria-hidden="true">
          <Fleuron />
        </span>

        <span
          className="sheet-reading-glint"
          data-state={phase === 'idle' ? 'idle' : phase === 'complete' ? 'complete' : 'reading'}
          aria-hidden="true"
        />

        <header className="sheet-header sheet-header--recto">
          <p className="running-head-title">
            <span aria-hidden="true">§</span> the question · caput xviii
          </p>
          <span className="running-head-pilcrow" aria-hidden="true">¶</span>
          <p className="running-head-folio">
            recto · <span>sig. A2</span>
          </p>
        </header>

        <FolioBreath reduced={reduced} />

        <FolioMasthead now={now} reduced={reduced} />

        <aside
          className={`chapter-frontispiece${versoOpened ? ' is-opened' : ''}`}
          aria-hidden="true"
        >
          <p className="chapter-frontispiece-half">
            <span className="chapter-frontispiece-half-rule chapter-frontispiece-half-rule--left" />
            <span className="chapter-frontispiece-half-cluster">
              <em className="chapter-frontispiece-half-key">the question</em>
              <span className="chapter-frontispiece-half-sep" aria-hidden="true">·</span>
              <em className="chapter-frontispiece-half-tail">a half-title of folio lxxvii</em>
            </span>
            <span className="chapter-frontispiece-half-rule chapter-frontispiece-half-rule--right" />
          </p>
        </aside>

        <div className="sheet-content">
          <section className="question-panel" aria-labelledby="page-title">
            <RectoEdgeShadow active={versoOpened} />
            <div className="annotation annotation--top">
              <span className="annotation-mark" aria-hidden="true">¶</span>
              <span className="annotation-text">the question · plainly set</span>
              <BreathPip
                slow={slow && phase === 'complete'}
                active={phase === 'answering' || phase === 'replying' || phase === 'complete'}
                reduced={reduced}
              />
            </div>
            <div className="broadsheet-title-rule" aria-hidden="true">
              <span className="broadsheet-title-rule-line" />
              <span className="broadsheet-title-rule-pip" />
              <span className="broadsheet-title-rule-line broadsheet-title-rule-line--right" />
            </div>
            <h1
              id="page-title"
              aria-label={TITLE}
              data-section="sec-question"
              ref={(el) => { sectionRefs.current['sec-question'] = el }}
              className="question-section broadsheet-title"
            >
              <span
                className={`title-initial-wrap${sealPressing ? ' is-pressing' : ''}`}
                aria-hidden="true"
              >
                <BroadsheetDropCap letter="i" pressed={phase !== 'idle'} />
              </span>
              <span className="title-flow">
                <span className="title-inkbloom" aria-hidden="true" />
                <span className="title-text title-text--set" style={{ '--word-i': 0 } as React.CSSProperties}>
                  s&nbsp;
                </span>
                <span className="title-subject title-text--set" style={{ '--word-i': 1 } as React.CSSProperties}>
                  Minimax M3
                  <span className="title-subject-rule" aria-hidden="true" />
                </span>
                <span className="title-text title-text--set" style={{ '--word-i': 2 } as React.CSSProperties}>
                  {' '}good at frontend yet<span className="title-questions">?</span>
                </span>
                <span className="title-paper-fold" aria-hidden="true" />
              </span>
            </h1>

            <span className="broadsheet-title-key" aria-hidden="true">
              <PressKey visible={phase !== 'idle'} reduced={reduced} />
            </span>

            <TitlePressHeadline visible={phase !== 'idle'} reduced={reduced} />

            <ReadingTide progress={Math.min(1, inkProgress + 0.15)} reduced={reduced} />

            <ReadingTideTail visible={phase !== 'idle'} reduced={reduced} />

            <div className="recto-reader-stage" aria-hidden="true">
              <ManuscriptReader
                active={phase !== 'idle'}
                reduced={reduced}
                watchPoint={watchPoint}
              />
            </div>

            <div className="recto-lamp-stage" aria-hidden="true">
              <TideLamp
                active={phase !== 'idle'}
                reduced={reduced}
              />
            </div>

            <AlmanacBand now={now} cycle={cycle} moonPhase={moonPhase} />

            <MoonPip phase={moonPhase} visible={!versoOpened} />

            <div
              data-section="sec-marginalia"
              ref={(el) => { sectionRefs.current['sec-marginalia'] = el }}
              className="marginalia-section"
            >
              <span className="recto-marginalia-glow" aria-hidden="true" />
              <ReadingMoment
                visible={phase !== 'idle'}
                cycle={cycle}
                now={now}
                firstMoment={firstMoment}
              />
              <PressInstructionPlate
                cycle={cycle}
                phase={phase}
                slow={slow}
                items={MARGINALIA}
                buttonLabel={buttonLabel}
                readerNote={readerNote}
                readerSubNote={readerSubNote}
                onRead={handleSealPress}
                sealBreaking={sealBreaking}
              />
              <ReadingGlance progress={inkProgress} reduced={reduced} />
            </div>
            <ReaderInkMark />
            <RectoColophon visible={versoOpened} reduced={reduced} />
          </section>

          <FolioSpine stage={tideStage} cycle={cycle} reduced={reduced}>
            <SpineThread stage={tideStage} reduced={reduced} />
            <PressSeam phase={phase} inkProgress={inkProgress} />
          </FolioSpine>

          <div
            className={`verso-leaf${versoOpened ? ' is-opened' : ' is-closed'}${
              leafTurning ? ' is-turning' : ''
            }`}
          >
          <span className="verso-spine-glint" aria-hidden="true" />
          <span className="verso-edge-glint" aria-hidden="true" />
          <section
            className={`response-panel response-panel--verso response-panel--verso-top ${replyShown ? 'is-revealed' : ''}`}
            aria-labelledby="response-title"
            aria-hidden={!versoOpened}
          >

            <PressHeadNote visible={replyShown} reduced={reduced} variant="verso" />

            <aside
              className={`verso-frontispiece${replyShown ? ' is-revealed' : ''}`}
              aria-hidden="true"
            >
              <p className="verso-frontispiece-half">
                <span className="verso-frontispiece-half-rule verso-frontispiece-half-rule--left" />
                <span className="verso-frontispiece-half-cluster">
                  <em className="verso-frontispiece-half-key">the reply</em>
                  <span className="verso-frontispiece-half-sep" aria-hidden="true">·</span>
                  <em className="verso-frontispiece-half-tail">a half-title of folio lxxvii</em>
                </span>
                <span className="verso-frontispiece-half-rule verso-frontispiece-half-rule--right" />
              </p>
              <div className="verso-frontispiece-pin" aria-hidden="true">
                <svg viewBox="0 0 220 18" focusable="false" preserveAspectRatio="none">
                  <line x1="2" y1="9" x2="218" y2="9" stroke="currentColor" strokeWidth="0.35" strokeDasharray="0.5 1.8" />
                  <circle cx="110" cy="9" r="1.2" fill="currentColor" />
                  <circle cx="110" cy="9" r="0.4" fill="var(--paper)" />
                </svg>
              </div>
            </aside>

            <ReplyCatchword visible={replyShown} reduced={reduced} />

            <RectoVerses />

            <ReadingTrace cycle={cycle} reduced={reduced} />


            <p className="catchword">
              <span className="catchword-rule" aria-hidden="true" />
              <span className="catchword-text">verso · reply</span>
              {owlShown && (
                <span
                  data-section="sec-owl"
                  ref={(el) => { sectionRefs.current['sec-owl'] = el }}
                  className="owl-anchor"
                >
                  <MarginaliaOwl
                    active
                    reduced={reduced}
                    watchPoint={watchPoint}
                    blinking={owlBlinking}
                  />
                </span>
              )}
              <span className="catchword-arrow" aria-hidden="true">↘</span>
            </p>

            <RectoSignOff visible={isTyping || phase === 'complete'} />

            <p
              className={`verso-frontispiece-foot${phase === 'complete' ? ' is-sealed' : ''}`}
              aria-hidden="true"
            >
              <span className="verso-frontispiece-foot-rule verso-frontispiece-foot-rule--left" />
              <span className="verso-frontispiece-foot-cluster">
                <em className="verso-frontispiece-foot-key">hîc folium replicatur</em>
                <span className="verso-frontispiece-foot-sep" aria-hidden="true">·</span>
                <em className="verso-frontispiece-foot-tail">the folio replies here</em>
                <span className="verso-frontispiece-foot-sep" aria-hidden="true">·</span>
                <em className="verso-frontispiece-foot-mark">set slowly</em>
              </span>
              <span className="verso-frontispiece-foot-rule verso-frontispiece-foot-rule--right" />
            </p>
          </section>

          <section
            className={`response-panel response-panel--verso response-panel--verso-main ${replyShown ? 'is-revealed' : ''}`}
            aria-labelledby="response-title"
            aria-hidden={!versoOpened}
          >
            <span className="verso-shine" aria-hidden="true" />
            <ReadingLines count={lineCount} visible={readingLinesVisible} />
            <VersoMarginRule visible={replyShown} cycle={cycle} />
            <FoldCorner />
            <MarginalMoth active={replyShown && !reduced} cycle={cycle} reduced={reduced} />
            <header className="sheet-header sheet-header--verso">
              <p className="running-head-title">
                <span aria-hidden="true">§</span> the reply · caput xviii
              </p>
              <span className="running-head-pilcrow" aria-hidden="true">¶</span>
              <p className="running-head-folio">
                verso · <span>sig. A3</span>
              </p>
            </header>

            <div className="response-heading">
              <span className="response-label" id="response-title">the reply</span>
              <span className="response-rule" aria-hidden="true" />
              <span className="response-arrow" aria-hidden="true">↘</span>
            </div>

            <div
              data-section="sec-answer"
              ref={(el) => { sectionRefs.current['sec-answer'] = el }}
              className={`answer-surface answer-surface--${phase}`}
            >
              <AnswerPlateFrame visible={phase !== 'idle'} progress={inkProgress} />
              <InkFingerprint visible={phase !== 'idle'} />
              <FingerSmudges visible={phase === 'complete' || phase === 'replying'} />
              <span className="answer-quote answer-quote--open" aria-hidden="true">"</span>
              {!answerVisible && (
                <p className="answer-placeholder">
                  press below
                  <br />
                  and let it arrive.
                </p>
              )}
              {answerVisible && (
                <div className="answer-copy-frame">
                  <p className="answer-copy" aria-live="polite">
                    <AnswerFlourish visible={answerVisible} reduced={reduced} />
                    {answerDisplay.length > 0 && (
                      <span className="answer-copy-lead" aria-hidden="true">
                        {answerDisplay.slice(0, 1)}
                      </span>
                    )}
                    <span className="answer-copy-rest">
                      {phase === 'complete'
                        ? wrapWithScholarAnchors(answerDisplay.slice(1), activeGloss, setActiveGloss)
                        : answerDisplay.slice(1)}
                    </span>
                    {phase === 'answering' && <span className="typing-caret" aria-hidden="true">|</span>}
                  </p>
                  <SelfAnnotations currentChars={answerChars} />
                  {phase === 'complete' && (
                    <ReadingPaceIndicator visible slow={slow} />
                  )}
                  <MarginalEcho
                    visible={phase === 'complete'}
                    cycle={cycle}
                    reduced={reduced}
                  />
                </div>
              )}
              {phase === 'complete' && (
                <ScholarGlosses active={activeGloss} visible={answerVisible} />
              )}
              {phase === 'complete' && (
                <AnswerFinishing visible />
              )}
              <span className="answer-quote answer-quote--close" aria-hidden="true">"</span>
              <span
                className="answer-sweep"
                style={{
                  transform: `translateX(${
                    phase === 'complete' ? 200 : (inkProgress - 0.5) * 200
                  }%)`,
                }}
                aria-hidden="true"
              />
              <Inkwell active={quillActive} />
              <ScribalQuill active={quillActive} progress={quillProgress} />
              {(phase === 'answering' || phase === 'replying') && (
                <InkTrail active />
              )}
              <PressStamp
                visible={phase === 'complete'}
                cycle={cycle}
                reduced={reduced}
              />
            </div>

            <ProofSlip
              visible={phase === 'complete' && slow}
              slow={slow}
              reduced={reduced}
            />

            <ReaderNote
              visible={phase === 'complete'}
              cycle={cycle}
              reduced={reduced}
            />

            <div
              data-section="sec-reply"
              ref={(el) => { sectionRefs.current['sec-reply'] = el }}
              className={`reply-copy ${replyShown ? 'is-visible' : ''}`}
              aria-live="polite"
            >
              {replyShown && (
                <header className="reply-head" aria-hidden="true">
                  <span className="reply-head-rule reply-head-rule--left" />
                  <span className="reply-head-cluster">
                    <span className="reply-head-mark">¶</span>
                    <em className="reply-head-key">the reply</em>
                    <span className="reply-head-sep">·</span>
                    <em className="reply-head-tail">set slowly · in this folio</em>
                  </span>
                  <span className="reply-head-rule reply-head-rule--right" />
                </header>
              )}
              <span className="reply-paragraph">
                {replyShown && (
                  <ReplyInitial visible={replyShown} reduced={reduced} />
                )}
                <span className="reply-text">
                  {replyChars > 0 && <span className="reply-text-lead" aria-hidden="true">{replyDisplay.slice(0, 1)}</span>}
                  <span className="reply-text-rest">
                    {phase === 'complete'
                      ? wrapWithScholarAnchors(replyDisplay.slice(1), activeGloss, setActiveGloss)
                      : replyDisplay.slice(1)}
                  </span>
                </span>
                {phase === 'replying' && <span className="typing-caret" aria-hidden="true">|</span>}
              </span>
              {phase === 'complete' && (
                <FolioReplyPlate visible reduced={reduced} slow={slow} />
              )}
              {phase === 'complete' && (
                <span className="reply-manicule">
                  <Manicule />
                </span>
              )}
            </div>

            <ScholarEndnote visible={replyShown} reduced={reduced} />

            <VadeMecum visible={replyShown} reduced={reduced} />

            {phase === 'complete' && (
              <div className="completion-note">
                <span className="completion-dot" aria-hidden="true" />
                <span>{FOOTNOTE}</span>
                <span className="completion-dot" aria-hidden="true" />
              </div>
            )}

            {readings.length > 0 && (
              <ReadingsCodex readings={readings} cycle={readings.length} />
            )}

            {cycle > 0 && <WaxArchive key={`wax-archive-${cycle}`} cycle={cycle} />}

            <EphemerisPlate
              visible={benchShown}
              now={now}
              moonPhase={moonPhase}
              cycle={cycle}
              hours={hours}
              minutes={minutes}
              seconds={seconds}
              reduced={reduced}
              registerHour={(el) => { sectionRefs.current['sec-hour'] = el }}
              registerDaybook={(el) => { sectionRefs.current['sec-almanac'] = el }}
            />

            <ReplySpecimen visible={replyShown} reduced={reduced} />

            <CulDeLampe inscriptionVisible={phase === 'complete'} />

            <ReadingWick lit={phase === 'complete'} reduced={reduced} />

            {phase === 'complete' && <PressSignature cycle={cycle} slow={slow} />}
          </section>
          </div>
        </div>

        <footer className="sheet-footer">
          <span className="footer-rule" aria-hidden="true" />
          <p className="footer-line">
            <em>the page itself</em> · printed for the attentive reader
          </p>
          <Bookplate cycle={cycle} />
        </footer>

        <FolioPressColophon now={now} reduced={reduced} />

        <ReaderTide
          phase={phase}
          slow={slow}
          cycle={cycle}
          activeSection={activeSection}
          onSelect={handleSelectSection}
          reduced={reduced}
          answerChars={answerChars}
          replyChars={replyChars}
        />

        <FolioAnatomy visible={replyShown} />

        <span className="paper-corner paper-corner--one" aria-hidden="true" />
        <span className="paper-corner paper-corner--two" aria-hidden="true" />
      </article>
    </main>
  )
}
