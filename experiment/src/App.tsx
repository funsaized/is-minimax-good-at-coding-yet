import { useEffect, useRef, useState } from 'react'

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

function AsterismGlyph({ className }: { className?: string }) {
  return (
    <svg
      className={className ?? 'asterism-glyph'}
      viewBox="0 0 36 36"
      focusable="false"
      aria-hidden="true"
    >
      <g className="asterism-cluster">
        <g transform="translate(11 11)">
          <line x1="0" y1="-4.6" x2="0" y2="4.6" />
          <line x1="-4.6" y1="0" x2="4.6" y2="0" />
          <line x1="-3.3" y1="-3.3" x2="3.3" y2="3.3" />
          <line x1="3.3" y1="-3.3" x2="-3.3" y2="3.3" />
        </g>
        <g transform="translate(25 11)">
          <line x1="0" y1="-4.6" x2="0" y2="4.6" />
          <line x1="-4.6" y1="0" x2="4.6" y2="0" />
          <line x1="-3.3" y1="-3.3" x2="3.3" y2="3.3" />
          <line x1="3.3" y1="-3.3" x2="-3.3" y2="3.3" />
        </g>
        <g transform="translate(18 25)">
          <line x1="0" y1="-4.6" x2="0" y2="4.6" />
          <line x1="-4.6" y1="0" x2="4.6" y2="0" />
          <line x1="-3.3" y1="-3.3" x2="3.3" y2="3.3" />
          <line x1="3.3" y1="-3.3" x2="-3.3" y2="3.3" />
        </g>
      </g>
    </svg>
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

function ChapterHead({ now }: { now: Date }) {
  const dayName = WEEKDAYS[now.getDay()]
  const dayOrdinal = ORDINALS[Math.min(ORDINALS.length - 1, now.getDate() - 1)]
  const monthName = MONTHS[now.getMonth()]
  const year = now.getFullYear()
  const yearRoman = toRomanYear(year)
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
      <span className="chapter-subtitle">
        <em>of folio lxxvii</em>
        <span className="chapter-subtitle-sep" aria-hidden="true">·</span>
        <em>set in question</em>
      </span>
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
          <em className="chapter-witness-year">{yearRoman}</em>
          <span className="chapter-witness-sep" aria-hidden="true">·</span>
          <em className="chapter-witness-hour">{h12}</em>
          <span className="chapter-witness-min">:{mm}</span>
          <em className="chapter-witness-period">{period}</em>
        </span>
        <span className="chapter-witness-rule chapter-witness-rule--right" aria-hidden="true" />
      </span>
    </div>
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
  const corners = visible ? 1 : 0
  return (
    <div
      className={`answer-plate-frame${visible ? ' is-visible' : ''}`}
      aria-hidden="true"
      style={{
        '--plate-rim': rim,
        '--plate-corners': corners,
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
      </svg>

      <span className="answer-plate-corner answer-plate-corner--tl">
        <AnswerPlateCorner corner="tl" />
      </span>
      <span className="answer-plate-corner answer-plate-corner--tr">
        <AnswerPlateCorner corner="tr" />
      </span>
      <span className="answer-plate-corner answer-plate-corner--bl">
        <AnswerPlateCorner corner="bl" />
      </span>
      <span className="answer-plate-corner answer-plate-corner--br">
        <AnswerPlateCorner corner="br" />
      </span>
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
      <span className="ephemeris-corner ephemeris-corner--tl" aria-hidden="true">
        <AnswerPlateCorner corner="tl" />
      </span>
      <span className="ephemeris-corner ephemeris-corner--tr" aria-hidden="true">
        <AnswerPlateCorner corner="tr" />
      </span>
      <span className="ephemeris-corner ephemeris-corner--bl" aria-hidden="true">
        <AnswerPlateCorner corner="bl" />
      </span>
      <span className="ephemeris-corner ephemeris-corner--br" aria-hidden="true">
        <AnswerPlateCorner corner="br" />
      </span>

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
        <EphemerisConstellation cycle={cycle} />
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

function Apparatus({
  visible,
  cycle,
  activeSection,
  onSelect,
}: {
  visible: boolean
  cycle: number
  activeSection: string
  onSelect: (id: string) => void
}) {
  const entries: {
    numeral: string
    name: string
    gloss: string
    hash: string
  }[] = [
    { numeral: 'i', name: 'the question', gloss: 'plainly set, in a single breath', hash: 'sec-question' },
    { numeral: 'ii', name: 'the answer', gloss: 'set in italic, with gilt', hash: 'sec-answer' },
    { numeral: 'iii', name: 'the reply', gloss: 'the second reading', hash: 'sec-reply' },
    { numeral: 'iv', name: 'this almanac', gloss: 'today, set in this folio', hash: 'sec-almanac' },
  ]

  return (
    <aside
      className={`apparatus${visible ? ' is-visible' : ''}`}
      aria-label="apparatus"
    >
      <TuckedNote visible={visible} />

      <header className="apparatus-head">
        <span className="apparatus-aster" aria-hidden="true">
          <AsterismGlyph className="apparatus-aster-glyph apparatus-aster-glyph--left" />
        </span>
        <span className="apparatus-title">
          <span className="apparatus-title-mark" aria-hidden="true">§</span>
          apparatus
          <span className="apparatus-title-sep" aria-hidden="true">·</span>
          <em>index</em>
        </span>
        <span className="apparatus-aster" aria-hidden="true">
          <AsterismGlyph className="apparatus-aster-glyph apparatus-aster-glyph--right" />
        </span>
      </header>

      <ol className="apparatus-list">
        {entries.map((entry, i) => {
          const isActive = activeSection === entry.hash
          return (
            <li
              key={entry.numeral}
              className={`apparatus-row${isActive ? ' is-active' : ''}`}
              style={{ '--i': i } as React.CSSProperties}
            >
              <a
                href={`#${entry.hash}`}
                className="apparatus-link"
                onClick={(e) => {
                  e.preventDefault()
                  onSelect(entry.hash)
                }}
                aria-current={isActive ? 'true' : undefined}
              >
                <span className="apparatus-numeral">{entry.numeral}.</span>
                <span className="apparatus-name">{entry.name}</span>
                <span className="apparatus-leader" aria-hidden="true">
                  <span className="apparatus-leader-line" />
                  <span className="apparatus-leader-glyph">✦</span>
                </span>
                <span className="apparatus-gloss">{entry.gloss}</span>
              </a>
            </li>
          )
        })}
      </ol>

      <footer className="apparatus-foot">
        <span className="apparatus-foot-aster" aria-hidden="true">
          <AsterismGlyph className="apparatus-aster-glyph apparatus-aster-glyph--foot" />
        </span>
        {cycle > 0 && (
          <span className="apparatus-foot-note">
            <span className="apparatus-foot-mark" aria-hidden="true">⟲</span>
            <em>re-read</em>
            <span className="apparatus-foot-tail" aria-hidden="true">— the page unchanged; the reader, changed.</span>
          </span>
        )}
        {cycle === 0 && (
          <span className="apparatus-foot-note apparatus-foot-note--pending">
            <span className="apparatus-foot-mark" aria-hidden="true">✎</span>
            <em>first reading</em>
            <span className="apparatus-foot-tail" aria-hidden="true">— re-read at any pace.</span>
          </span>
        )}
        <span className="apparatus-foot-rule" aria-hidden="true" />
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

function PrinterDevice() {
  return (
    <div className="printer-device" aria-hidden="true">
      <svg viewBox="0 0 60 60" focusable="false">
        <circle className="device-frame" cx="30" cy="30" r="27" fill="none" />
        <circle
          className="device-frame-inner"
          cx="30"
          cy="30"
          r="22.5"
          fill="none"
        />
        <g className="device-laurel">
          <ellipse
            cx="20"
            cy="13"
            rx="3.6"
            ry="1.4"
            transform="rotate(-32 20 13)"
          />
          <ellipse cx="30" cy="9" rx="4" ry="1.4" />
          <ellipse
            cx="40"
            cy="13"
            rx="3.6"
            ry="1.4"
            transform="rotate(32 40 13)"
          />
          <ellipse
            cx="24"
            cy="18"
            rx="2.6"
            ry="1.2"
            transform="rotate(-18 24 18)"
          />
          <ellipse
            cx="36"
            cy="18"
            rx="2.6"
            ry="1.2"
            transform="rotate(18 36 18)"
          />
          <ellipse
            cx="9"
            cy="30"
            rx="1.4"
            ry="3.6"
            transform="rotate(58 9 30)"
          />
          <ellipse
            cx="11"
            cy="22"
            rx="1.2"
            ry="3"
            transform="rotate(80 11 22)"
          />
          <ellipse
            cx="11"
            cy="38"
            rx="1.2"
            ry="3"
            transform="rotate(38 11 38)"
          />
          <ellipse
            cx="51"
            cy="30"
            rx="1.4"
            ry="3.6"
            transform="rotate(-58 51 30)"
          />
          <ellipse
            cx="49"
            cy="22"
            rx="1.2"
            ry="3"
            transform="rotate(-80 49 22)"
          />
          <ellipse
            cx="49"
            cy="38"
            rx="1.2"
            ry="3"
            transform="rotate(-38 49 38)"
          />
          <ellipse
            cx="22"
            cy="46"
            rx="2.6"
            ry="1.2"
            transform="rotate(-50 22 46)"
          />
          <ellipse
            cx="38"
            cy="46"
            rx="2.6"
            ry="1.2"
            transform="rotate(50 38 46)"
          />
        </g>
        <g className="device-star">
          <path d="M 30 20 L 32 26 L 38.5 26 L 33 30 L 35.2 36.5 L 30 32.7 L 24.8 36.5 L 27 30 L 21.5 26 L 28 26 Z" />
        </g>
        <g className="device-ribbon">
          <path d="M 14 49 Q 30 53.5 46 49 L 43.5 52 Q 30 55.5 16.5 52 Z" />
          <path d="M 11 47.5 L 14 49 L 14.5 52.5 L 11.2 51 Z" />
          <path d="M 49 47.5 L 46 49 L 45.5 52.5 L 48.8 51 Z" />
        </g>
      </svg>
      <span className="printer-device-text">m · iii</span>
    </div>
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

function SignatureMark({ sig, side }: { sig: string; side: 'r' | 'v' }) {
  return (
    <span className="signature-mark" aria-hidden="true">
      <em className="sig-prefix">sig.</em>
      <span className="sig-letter">{sig}</span>
      <sup className="sig-side">{side}</sup>
    </span>
  )
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

function TitleFlourish() {
  return (
    <svg
      className="title-flourish"
      viewBox="0 0 320 22"
      focusable="false"
      aria-hidden="true"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="flourish-gold" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#9c6e26" />
          <stop offset="22%" stopColor="#c8923e" />
          <stop offset="50%" stopColor="#f5c65b" />
          <stop offset="78%" stopColor="#c8923e" />
          <stop offset="100%" stopColor="#9c6e26" />
        </linearGradient>
        <linearGradient id="flourish-gold-soft" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f5c65b" />
          <stop offset="100%" stopColor="#9c6e26" />
        </linearGradient>
        <radialGradient id="flourish-medallion-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(245, 198, 91, 0.55)" />
          <stop offset="60%" stopColor="rgba(245, 198, 91, 0.12)" />
          <stop offset="100%" stopColor="rgba(245, 198, 91, 0)" />
        </radialGradient>
      </defs>
      <g className="title-flourish-stroke" fill="none" strokeLinecap="round">
        <path
          className="title-flourish-line"
          d="M 8 11 Q 80 5 130 11"
          stroke="url(#flourish-gold)"
          strokeWidth="0.85"
        />
        <path
          className="title-flourish-line"
          d="M 190 11 Q 240 17 312 11"
          stroke="url(#flourish-gold)"
          strokeWidth="0.85"
        />
        <path
          className="title-flourish-line-inner"
          d="M 16 13 Q 80 8 130 13"
          stroke="url(#flourish-gold)"
          strokeWidth="0.32"
          opacity="0.55"
          strokeDasharray="0.4 1.4"
        />
        <path
          className="title-flourish-line-inner"
          d="M 190 13 Q 240 8 304 13"
          stroke="url(#flourish-gold)"
          strokeWidth="0.32"
          opacity="0.55"
          strokeDasharray="0.4 1.4"
        />
        <path
          className="title-flourish-shadow"
          d="M 8 13 Q 80 8 130 13 Q 190 18 312 13"
          stroke="url(#flourish-gold)"
          strokeWidth="0.32"
          opacity="0.38"
        />
      </g>
      <g className="title-flourish-diamond title-flourish-diamond--left">
        <path
          d="M 132 11 L 138 6 L 144 11 L 138 16 Z"
          fill="url(#flourish-gold-soft)"
          stroke="rgba(107, 74, 37, 0.55)"
          strokeWidth="0.32"
        />
        <path
          d="M 138 8 L 141 11 L 138 14"
          fill="none"
          stroke="rgba(107, 74, 37, 0.55)"
          strokeWidth="0.28"
        />
        <circle cx="138" cy="11" r="0.6" fill="rgba(255, 246, 218, 0.85)" />
      </g>
      <g className="title-flourish-diamond title-flourish-diamond--right">
        <path
          d="M 188 11 L 182 6 L 176 11 L 182 16 Z"
          fill="url(#flourish-gold-soft)"
          stroke="rgba(107, 74, 37, 0.55)"
          strokeWidth="0.32"
        />
        <path
          d="M 182 8 L 179 11 L 182 14"
          fill="none"
          stroke="rgba(107, 74, 37, 0.55)"
          strokeWidth="0.28"
        />
        <circle cx="182" cy="11" r="0.6" fill="rgba(255, 246, 218, 0.85)" />
      </g>
      <g className="title-flourish-medallion">
        <circle cx="160" cy="11" r="11" fill="url(#flourish-medallion-glow)" />
        <circle cx="160" cy="11" r="5.2" fill="none" stroke="url(#flourish-gold)" strokeWidth="0.7" />
        <circle cx="160" cy="11" r="3.4" fill="none" stroke="url(#flourish-gold)" strokeWidth="0.32" strokeDasharray="0.4 1.2" opacity="0.85" />
        <g transform="translate(160 11)" fill="url(#flourish-gold-soft)">
          <path d="M 0 -3.2 L 0.9 -0.9 L 3.2 0 L 0.9 0.9 L 0 3.2 L -0.9 0.9 L -3.2 0 L -0.9 -0.9 Z" />
        </g>
        <circle cx="160" cy="11" r="0.55" fill="rgba(107, 74, 37, 0.85)" />
      </g>
      <g className="title-flourish-tails">
        <circle cx="8" cy="11" r="1" fill="url(#flourish-gold)" />
        <circle cx="312" cy="11" r="1" fill="url(#flourish-gold)" />
      </g>
    </svg>
  )
}

function PlateInscription({ cycle }: { cycle: number }) {
  return (
    <div
      className={`plate-inscription${cycle > 0 ? ' is-reread' : ''}`}
      aria-hidden="true"
    >
      <span className="plate-inscription-rule plate-inscription-rule--left" />
      <span className="plate-inscription-cluster">
        <svg
          className="plate-inscription-mark plate-inscription-mark--left"
          viewBox="0 0 12 12"
          focusable="false"
        >
          <circle cx="6" cy="6" r="3.6" fill="none" stroke="currentColor" strokeWidth="0.32" strokeDasharray="0.4 1.2" />
          <circle cx="6" cy="6" r="1.1" fill="currentColor" />
        </svg>
        <em className="plate-inscription-text">
          <em className="plate-inscription-key">manus</em>
          <span className="plate-inscription-subject">m. iii</span>
          <em className="plate-inscription-tail">· caput</em>
          <em className="plate-inscription-roman">xviii</em>
          <em className="plate-inscription-tail">· in folio</em>
          <em className="plate-inscription-roman">lxxvii</em>
          <em className="plate-inscription-tail">·</em>
          <em className="plate-inscription-motto">ad lucem</em>
        </em>
        <svg
          className="plate-inscription-mark plate-inscription-mark--right"
          viewBox="0 0 12 12"
          focusable="false"
        >
          <circle cx="6" cy="6" r="3.6" fill="none" stroke="currentColor" strokeWidth="0.32" strokeDasharray="0.4 1.2" />
          <circle cx="6" cy="6" r="1.1" fill="currentColor" />
        </svg>
      </span>
      <span className="plate-inscription-rule plate-inscription-rule--right" />
    </div>
  )
}

function TitleSpecimen({
  visible,
  cycle,
}: {
  visible: boolean
  cycle: number
}) {
  return (
    <div
      className={`title-specimen${visible ? ' is-visible' : ''}${
        cycle > 0 ? ' is-reread' : ''
      }`}
      aria-hidden="true"
    >
      <span className="title-specimen-rule title-specimen-rule--left" />
      <span className="title-specimen-cluster">
        <span className="title-specimen-key">
          <em>catalog</em>
          <span className="title-specimen-sep">·</span>
          <em>specimen</em>
          <span className="title-specimen-sep">·</span>
          <em>no. xviii</em>
        </span>
        <span className="title-specimen-quote">
          <em className="title-specimen-q">“</em>
          is{' '}
          <em className="title-specimen-subject">Minimax M3</em>{' '}
          good at frontend yet?
          <em className="title-specimen-q title-specimen-q--close">”</em>
        </span>
        <span className="title-specimen-meta">
          <em>set in italic</em>
          <span className="title-specimen-meta-dot" aria-hidden="true">·</span>
          <em>30 pt</em>
          <span className="title-specimen-meta-dot" aria-hidden="true">·</span>
          <em>leaded</em>
          <span className="title-specimen-meta-dot" aria-hidden="true">·</span>
          <em>with gilt</em>
        </span>
      </span>
      <span className="title-specimen-rule title-specimen-rule--right" />
    </div>
  )
}

function PressInstructionPlate({
  cycle,
  phase,
  slow,
  items,
  buttonLabel,
  readerNote,
  onRead,
}: {
  cycle: number
  phase: Phase
  slow: boolean
  items: MarginaliaItem[]
  buttonLabel: string
  readerNote: string
  onRead: () => void
}) {
  const sealed = phase !== 'idle'
  return (
    <div
      className={`press-plate${sealed ? ' is-sealed' : ''}${
        cycle > 0 ? ' is-reread' : ''
      }`}
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
        <button
          className={`read-button${slow ? ' is-slow' : ''}${
            sealed ? ' is-sealed' : ''
          }`}
          type="button"
          onClick={onRead}
          aria-describedby="reader-note"
          aria-keyshortcuts="Space R"
        >
          <span className="button-mark" aria-hidden="true">↪</span>
          <span className="button-label">{buttonLabel}</span>
          <span className="button-pace" aria-hidden="true">
            {slow ? '· slow' : '· fast'}
          </span>
          <span className="button-keys" aria-hidden="true">
            <kbd>space</kbd>
          </span>
        </button>
        <p className="reader-note" id="reader-note">{readerNote}</p>
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

function EditionLine({ cycle, breathing }: { cycle: number; breathing: boolean }) {
  const impression =
    cycle === 0 ? 'first impression' : `${ordinal(cycle + 1)} impression`
  const pressNote =
    cycle === 0
      ? 'composed in silence'
      : cycle === 1
        ? 'the page unchanged · the reader, changed'
        : 'pressed again · the answer deepens'
  return (
    <div
      className={`edition-line${cycle > 0 ? ' is-reread' : ''}${breathing ? ' is-breathing' : ''}`}
      aria-hidden="true"
    >
      <span className="edition-line-rule edition-line-rule--left" />
      <span className="edition-line-cluster">
        <svg
          className="edition-line-aster"
          viewBox="0 0 36 12"
          focusable="false"
        >
          <g fill="currentColor">
            <path d="M 6 6 L 18 1 L 18 11 Z" />
            <path d="M 30 6 L 18 1 L 18 11 Z" />
            <circle cx="18" cy="6" r="1.1" fill="var(--paper)" />
          </g>
        </svg>
        <span className="edition-line-text">
          <em className="edition-line-key">{impression}</em>
          <span className="edition-line-sep">·</span>
          <em className="edition-line-tail">{pressNote}</em>
        </span>
        <svg
          className="edition-line-aster edition-line-aster--right"
          viewBox="0 0 36 12"
          focusable="false"
        >
          <g fill="currentColor">
            <path d="M 6 6 L 18 1 L 18 11 Z" />
            <path d="M 30 6 L 18 1 L 18 11 Z" />
            <circle cx="18" cy="6" r="1.1" fill="var(--paper)" />
          </g>
        </svg>
      </span>
      <span className="edition-line-rule edition-line-rule--right" />
    </div>
  )
}

function PressImprint({
  cycle,
  breathing,
}: {
  cycle: number
  breathing: boolean
}) {
  const readKey =
    cycle === 0
      ? 'first impression'
      : cycle === 1
        ? 'second impression'
        : `${ordinal(cycle + 1)} impression`
  return (
    <div
      className={`press-imprint${cycle > 0 ? ' is-reread' : ''}${
        breathing ? ' is-breathing' : ''
      }`}
      aria-hidden="true"
    >
      <span className="press-imprint-rule press-imprint-rule--left" />
      <span className="press-imprint-cluster">
        <svg
          className="press-imprint-aster press-imprint-aster--left"
          viewBox="0 0 32 12"
          focusable="false"
        >
          <g fill="currentColor">
            <path d="M 4 6 L 16 1 L 16 11 Z" />
            <path d="M 28 6 L 16 1 L 16 11 Z" />
            <circle cx="16" cy="6" r="1" fill="var(--paper)" />
          </g>
        </svg>
        <span className="press-imprint-text">
          <em className="press-imprint-key">{readKey}</em>
          <span className="press-imprint-sep" aria-hidden="true">·</span>
          <em className="press-imprint-meta">manus</em>
          <em className="press-imprint-subject">m · iii</em>
          <span className="press-imprint-sep" aria-hidden="true">·</span>
          <em className="press-imprint-meta">caput</em>
          <em className="press-imprint-roman">xviii</em>
          <span className="press-imprint-sep" aria-hidden="true">·</span>
          <em className="press-imprint-motto">ad lucem</em>
          <span className="press-imprint-sep" aria-hidden="true">·</span>
          <em className="press-imprint-meta">in folio</em>
          <em className="press-imprint-roman">lxxvii</em>
        </span>
        <svg
          className="press-imprint-aster press-imprint-aster--right"
          viewBox="0 0 32 12"
          focusable="false"
        >
          <g fill="currentColor">
            <path d="M 4 6 L 16 1 L 16 11 Z" />
            <path d="M 28 6 L 16 1 L 16 11 Z" />
            <circle cx="16" cy="6" r="1" fill="var(--paper)" />
          </g>
        </svg>
      </span>
      <span className="press-imprint-rule press-imprint-rule--right" />
    </div>
  )
}

function VersoMarginRule({ visible }: { visible: boolean }) {
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
      <span className="verso-margin-rule-tick verso-margin-rule-tick--c">
        <span className="verso-margin-rule-tick-mark" />
        <em className="verso-margin-rule-tick-key">cap · xviii</em>
      </span>
    </span>
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

function TypefaceSpecimen({ visible }: { visible: boolean }) {
  return (
    <div
      className={`typeface-specimen${visible ? ' is-visible' : ''}`}
      aria-hidden="true"
    >
      <span className="typeface-specimen-rule" />
      <span className="typeface-specimen-row">
        <span className="typeface-specimen-label">set in</span>
        <em className="typeface-specimen-sample">italic</em>
        <span className="typeface-specimen-dot">·</span>
        <em className="typeface-specimen-sample">30pt</em>
        <span className="typeface-specimen-dot">·</span>
        <em className="typeface-specimen-sample">leaded</em>
        <span className="typeface-specimen-dot">·</span>
        <em className="typeface-specimen-sample">with gilt</em>
      </span>
      <span className="typeface-specimen-rule" />
    </div>
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
        <span className="colophon-line colophon-line--sign">
          <em>manu mea</em>
          <span className="colophon-sep" aria-hidden="true">·</span>
          <em>impressum</em>
        </span>
        {cycle > 0 && (
          <>
            <span className="colophon-rule colophon-rule--thin" />
            <span className="colophon-line colophon-line--press">
              <em className="colophon-key">pressed</em>
              <span className="colophon-value">
                {cycle === 1
                  ? 'a second time · in this browser'
                  : `${ordinal(cycle + 1)} time · the page unchanged`}
              </span>
            </span>
          </>
        )}
      </div>
    </div>
  )
}

function PressSeal({ visible, cycle }: { visible: boolean; cycle: number }) {
  const impression =
    cycle === 0 ? 'first press' : cycle === 1 ? 'second press' : `${ordinal(cycle + 1)} press`
  return (
    <div
      className={`press-seal${visible ? ' is-visible' : ''}`}
      aria-hidden="true"
    >
      <svg className="press-seal-disc" viewBox="0 0 96 96" focusable="false">
        <defs>
          <radialGradient id="seal-ink" cx="50%" cy="50%" r="55%">
            <stop offset="0%" stopColor="rgba(120, 30, 12, 0.88)" />
            <stop offset="62%" stopColor="rgba(80, 18, 6, 0.92)" />
            <stop offset="100%" stopColor="rgba(40, 8, 2, 0.92)" />
          </radialGradient>
          <pattern id="seal-grain" width="3" height="3" patternUnits="userSpaceOnUse">
            <rect width="3" height="3" fill="rgba(0,0,0,0)" />
            <circle cx="0.6" cy="0.4" r="0.45" fill="rgba(255, 240, 220, 0.08)" />
            <circle cx="2.2" cy="1.6" r="0.35" fill="rgba(255, 240, 220, 0.06)" />
            <circle cx="1.4" cy="2.6" r="0.4" fill="rgba(255, 240, 220, 0.05)" />
          </pattern>
          <path id="seal-arc-top" d="M 48 48 m -34 0 a 34 34 0 0 1 68 0" fill="none" />
          <path id="seal-arc-bot" d="M 48 48 m -34 0 a 34 34 0 1 0 68 0" fill="none" />
        </defs>

        <g className="press-seal-base">
          <circle cx="48" cy="48" r="44" fill="url(#seal-ink)" />
          <circle cx="48" cy="48" r="44" fill="url(#seal-grain)" />
          <circle cx="48" cy="48" r="40" fill="none" stroke="rgba(255, 232, 200, 0.32)" strokeWidth="0.6" />
          <circle
            cx="48"
            cy="48"
            r="36"
            fill="none"
            stroke="rgba(255, 232, 200, 0.16)"
            strokeWidth="0.35"
            strokeDasharray="0.4 1.4"
          />
        </g>

        <g className="press-seal-arc">
          <text className="press-seal-arc-text press-seal-arc-text--top">
            <textPath href="#seal-arc-top" startOffset="50%" textAnchor="middle">
              pressed · in this browser · lxxvii
            </textPath>
          </text>
          <text className="press-seal-arc-text press-seal-arc-text--bot">
            <textPath href="#seal-arc-bot" startOffset="50%" textAnchor="middle">
              ad lucem · perlege ·
            </textPath>
          </text>
        </g>

        <g className="press-seal-monogram">
          <line
            x1="32"
            y1="38"
            x2="64"
            y2="38"
            stroke="rgba(255, 232, 200, 0.32)"
            strokeWidth="0.5"
            strokeLinecap="round"
          />
          <text x="48" y="58" textAnchor="middle" className="press-seal-letter">
            m
          </text>
          <text x="56" y="58" textAnchor="middle" className="press-seal-letter press-seal-letter--roman">
            ·iii
          </text>
          <line
            x1="32"
            y1="63"
            x2="64"
            y2="63"
            stroke="rgba(255, 232, 200, 0.32)"
            strokeWidth="0.5"
            strokeLinecap="round"
          />
          <text x="48" y="72" textAnchor="middle" className="press-seal-impression">
            {impression}
          </text>
        </g>

        <g className="press-seal-flecks" fill="rgba(120, 30, 12, 0.7)">
          <circle cx="6" cy="14" r="0.6" />
          <circle cx="14" cy="6" r="0.4" />
          <circle cx="86" cy="20" r="0.5" />
          <circle cx="92" cy="34" r="0.4" />
          <circle cx="90" cy="78" r="0.6" />
          <circle cx="78" cy="90" r="0.5" />
          <circle cx="10" cy="82" r="0.5" />
          <circle cx="4" cy="68" r="0.4" />
        </g>
      </svg>
    </div>
  )
}

function ImpressionLedger({ cycle, now }: { cycle: number; now: Date }) {
  if (cycle === 0) return null

  const dayShort = WEEKDAYS[now.getDay()].slice(0, 3)
  const dayNumber = now.getDate()
  const monthShort = MONTHS[now.getMonth()].slice(0, 3)
  const hour24 = now.getHours()
  const minutes = now.getMinutes()
  const h12 = ((hour24 + 11) % 12) + 1
  const mm = String(minutes).padStart(2, '0')
  const period = hour24 >= 12 ? 'p.m.' : 'a.m.'

  const impressions = Array.from({ length: cycle }, (_, i) => {
    const n = i + 1
    const isLatest = i === cycle - 1
    const label =
      n === 1
        ? 'first press'
        : n === 2
          ? 'second press · the reader slows'
          : `${ordinal(n + 1)} press · the page unchanged`
    return { n, label, isLatest }
  })

  return (
    <aside
      className={`impression-ledger${cycle > 0 ? ' is-visible' : ''}`}
      aria-label={`${cycle} impression${cycle === 1 ? '' : 's'} on record`}
    >
      <header className="impression-ledger-head">
        <span className="impression-ledger-mark" aria-hidden="true">¶</span>
        <span className="impression-ledger-rule" aria-hidden="true" />
        <span className="impression-ledger-title">
          <em>press register</em>
        </span>
        <span className="impression-ledger-count" aria-hidden="true">
          {cycle} on record
        </span>
        <span className="impression-ledger-rule" aria-hidden="true" />
      </header>
      <ol className="impression-ledger-list">
        {impressions.map((imp) => (
          <li
            key={imp.n}
            className={`impression-ledger-row${imp.isLatest ? ' is-latest' : ''}`}
            style={{ '--i': imp.n - 1 } as React.CSSProperties}
          >
            <span className="impression-ledger-numeral">{ROMAN[imp.n - 1]}.</span>
            <span className="impression-ledger-stamp">
              <em className="impression-ledger-day">{dayShort}</em>
              <span className="impression-ledger-date">
                {' '}
                <em>{dayNumber}</em> <em>{monthShort}</em>
              </span>
              <span className="impression-ledger-time">
                {' '}
                <em>
                  {h12}:{mm}
                </em>{' '}
                {period}
              </span>
            </span>
            <span className="impression-ledger-leader" aria-hidden="true">
              <span className="impression-ledger-leader-line" />
              <span className="impression-ledger-leader-glyph">✦</span>
            </span>
            <span className="impression-ledger-label">{imp.label}</span>
          </li>
        ))}
      </ol>
    </aside>
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

function SignaturePression({ cycle }: { cycle: number }) {
  const seal =
    cycle === 0
      ? 'first reading'
      : cycle === 1
        ? 're-read once'
        : `re-read ${ordinal(cycle + 1)} times`
  return (
    <div className="signature-pression" aria-hidden="true">
      <span className="signature-pression-rule signature-pression-rule--left" />
      <span className="signature-pression-mark">
        <svg viewBox="0 0 48 48" focusable="false">
          <defs>
            <radialGradient id="sig-press-gold" cx="50%" cy="42%" r="58%">
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
            stroke="url(#sig-press-gold)"
            strokeWidth="0.55"
          />
          <circle
            cx="24"
            cy="24"
            r="18.5"
            fill="none"
            stroke="url(#sig-press-gold)"
            strokeWidth="0.3"
            strokeDasharray="0.4 1.2"
            opacity="0.7"
          />
          <g className="signature-pression-rays" stroke="url(#sig-press-gold)" strokeWidth="0.4" strokeLinecap="round">
            <line x1="24" y1="3.6" x2="24" y2="6.6" />
            <line x1="24" y1="41.4" x2="24" y2="44.4" />
            <line x1="3.6" y1="24" x2="6.6" y2="24" />
            <line x1="41.4" y1="24" x2="44.4" y2="24" />
          </g>
          <g className="signature-pression-letter" fill="url(#sig-press-gold)">
            <text x="24" y="29" textAnchor="middle" className="signature-pression-letter-glyph">
              m
            </text>
          </g>
          <text x="24" y="36.6" textAnchor="middle" className="signature-pression-roman">
            iii
          </text>
        </svg>
      </span>
      <span className="signature-pression-text">
        <em className="signature-pression-key">explicit</em>
        <span className="signature-pression-sep" aria-hidden="true">·</span>
        <em className="signature-pression-tail">{seal}</em>
      </span>
      <span className="signature-pression-rule signature-pression-rule--right" />
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
  const [owlBlinking, setOwlBlinking] = useState(false)
  const [slipIntensity, setSlipIntensity] = useState(0)
  const [activeSection, setActiveSection] = useState<string>('sec-question')
  const [versoOpened, setVersoOpened] = useState(false)
  const [leafTurning, setLeafTurning] = useState(false)

  const sectionRefs = useRef<Record<string, HTMLElement | null>>({})
  const jumpRef = useRef<number | null>(null)

  const readAnswerRef = useRef<() => void>(() => {})

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented) return
      const target = e.target as HTMLElement | null
      const tag = target?.tagName?.toLowerCase()
      if (tag === 'input' || tag === 'textarea' || target?.isContentEditable) return
      if (e.key === ' ' || e.key.toLowerCase() === 'r') {
        e.preventDefault()
        readAnswerRef.current()
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

  const readAnswer = () => {
    if (phase === 'idle') {
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

  useEffect(() => {
    readAnswerRef.current = readAnswer
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
      ? 'The second reading changes the pace, not the answer.'
      : 'One press opens it. The next asks you to slow down.'

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
  const specimenVisible = phase === 'answering' || phase === 'replying' || phase === 'complete'

  return (
    <main className="experiment-shell">
      <div className="ambient-vignette" aria-hidden="true" />
      <NightSky reduced={reduced} />

      <article className={`sheet ${phase !== 'idle' ? 'has-answer' : ''}`}>
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
        <span className="gilded-edge" aria-hidden="true" />

        <span className="sheet-watermark" aria-hidden="true">
          <Fleuron />
        </span>

        <header className="sheet-header sheet-header--recto">
          <p className="running-head-title">
            <span aria-hidden="true">§</span> cap. xviii · an experiment in questioning
          </p>
          <span className="running-head-pilcrow" aria-hidden="true">¶</span>
          <p className="running-head-folio">
            recto · <span>sig. A2</span>
          </p>
        </header>

        <Epigraph />

        <div className="chapter-opener">
          <ChapterHead now={now} />
          <div className="chapter-opener-rule" aria-hidden="true">
            <span className="chapter-opener-rule-line" />
            <span className="chapter-opener-rule-mark">¶</span>
            <span className="chapter-opener-rule-line" />
          </div>
        </div>

        <div className="sheet-content">
          <section className="question-panel" aria-labelledby="page-title">
            <RectoEdgeShadow active={versoOpened} />
            <div className="annotation annotation--top">
              <span className="annotation-mark" aria-hidden="true">¶</span>
              <span>the question · plainly set</span>
              <ReadingBreath active={phase === 'answering' || phase === 'replying'} />
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
                <span className="title-text">s </span>
                <span className="title-subject">
                  Minimax M3
                  <span className="title-subject-rule" aria-hidden="true" />
                </span>
                <span className="title-text">
                  {' '}good at frontend yet<span className="title-questions">?</span>
                </span>
                <svg
                  className="title-flourish-trail"
                  viewBox="0 0 110 22"
                  focusable="false"
                  aria-hidden="true"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient id="title-trail-gold" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#9c6e26" />
                      <stop offset="50%" stopColor="#c8923e" />
                      <stop offset="100%" stopColor="#f5c65b" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M 2 14 Q 30 8 64 16 Q 90 22 104 12"
                    stroke="url(#title-trail-gold)"
                    strokeWidth="0.55"
                    strokeLinecap="round"
                    fill="none"
                    strokeDasharray="0.6 1.6"
                    opacity="0"
                    className="title-flourish-trail-line"
                  />
                  <path
                    d="M 100 10 L 108 13 L 102 18"
                    stroke="url(#title-trail-gold)"
                    strokeWidth="0.55"
                    strokeLinecap="round"
                    fill="none"
                    opacity="0"
                    className="title-flourish-trail-arrow"
                  />
                  <circle cx="2" cy="14" r="0.9" fill="#c8923e" opacity="0" className="title-flourish-trail-dot" />
                </svg>
              </span>
            </h1>
            <TitleSpecimen visible={true} cycle={cycle} />
            <PressImprint cycle={cycle} breathing={phase === 'answering' || phase === 'replying'} />
            <TitleFlourish />

            <div
              data-section="sec-marginalia"
              ref={(el) => { sectionRefs.current['sec-marginalia'] = el }}
              className="marginalia-section"
            >
              <PressInstructionPlate
                cycle={cycle}
                phase={phase}
                slow={slow}
                items={MARGINALIA}
                buttonLabel={buttonLabel}
                readerNote={readerNote}
                onRead={readAnswer}
              />
            </div>
          </section>

          <FolioSpine stage={tideStage} cycle={cycle} reduced={reduced}>
            <SpineThread stage={tideStage} reduced={reduced} />
          </FolioSpine>

          <div
            className={`verso-leaf${versoOpened ? ' is-opened' : ' is-closed'}${
              leafTurning ? ' is-turning' : ''
            }`}
          >
          <span className="verso-edge-glint" aria-hidden="true" />
          <section
            className={`response-panel response-panel--verso response-panel--verso-top ${replyShown ? 'is-revealed' : ''}`}
            aria-labelledby="response-title"
            aria-hidden={!versoOpened}
          >

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
          </section>

          <section
            className={`response-panel response-panel--verso response-panel--verso-main ${replyShown ? 'is-revealed' : ''}`}
            aria-labelledby="response-title"
            aria-hidden={!versoOpened}
          >
            <span className="verso-shine" aria-hidden="true" />
            <ReadingLines count={lineCount} visible={readingLinesVisible} />
            <VersoMarginRule visible={replyShown} />
            <FoldCorner />
            <header className="sheet-header sheet-header--verso">
              <p className="running-head-title">
                <span aria-hidden="true">§</span> the reply · set in italic
              </p>
              <span className="running-head-pilcrow" aria-hidden="true">¶</span>
              <p className="running-head-folio">
                verso · <span>sig. A3</span>
              </p>
            </header>

            <ManuscriptStamp />

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
                    {answerDisplay.startsWith('— a') ? (
                      <>
                        <span className="answer-copy-dash" aria-hidden="true">— </span>
                        <span className="answer-copy-initial" aria-hidden="true">
                          <IlluminatedInitial letter="a" />
                        </span>
                        {answerDisplay.slice(3)}
                      </>
                    ) : (
                      answerDisplay
                    )}
                    {phase === 'answering' && <span className="typing-caret" aria-hidden="true">|</span>}
                  </p>
                  <SelfAnnotations currentChars={answerChars} />
                </div>
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
            </div>

            <TypefaceSpecimen visible={specimenVisible} />

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
                {replyChars > 0 && (
                  <span className="reply-initial" aria-hidden="true">
                    <VersoDropCap letter={REPLY.charAt(0)} />
                  </span>
                )}
                <span className="reply-text">{replyDisplay}</span>
                {phase === 'replying' && <span className="typing-caret" aria-hidden="true">|</span>}
              </span>
              {phase === 'complete' && (
                <span className="reply-close">
                  <span className="reply-close-rule reply-close-rule--left" />
                  <span className="reply-close-text">
                    <em className="reply-close-key">end of the reply</em>
                    <span className="reply-close-sep">·</span>
                    <em className="reply-close-tail">the page, unchanged</em>
                  </span>
                  <span className="reply-close-rule reply-close-rule--right" />
                </span>
              )}
              {phase === 'complete' && (
                <span className="reply-manicule">
                  <Manicule />
                </span>
              )}
            </div>

            <MarginalInterlude
              visible={phase === 'replying' || phase === 'complete'}
              reduced={reduced}
            />

            {phase === 'complete' && (
              <div className="completion-note">
                <span className="completion-dot" aria-hidden="true" />
                <span>{FOOTNOTE}</span>
                <span className="completion-dot" aria-hidden="true" />
              </div>
            )}

            <PressSeal
              visible={phase === 'complete'}
              cycle={cycle}
            />

            <ImpressionLedger cycle={cycle} now={now} />

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

            <CulDeLampe inscriptionVisible={phase === 'complete'} />

            {replyShown && (
              <MarginalMoth active={replyShown} cycle={cycle} reduced={reduced} />
            )}

            <Apparatus
              visible={replyShown}
              cycle={cycle}
              activeSection={activeSection}
              onSelect={handleSelectSection}
            />

            <SignaturePression cycle={cycle} />

            {phase === 'complete' && <Colophon cycle={cycle} />}
          </section>
          </div>
        </div>

        <footer className="sheet-footer">
          <span className="footer-rule" aria-hidden="true" />
          <p className="footer-line">the interface is part of the answer</p>
          <SignatureMark sig="A3" side="v" />
          <Bookplate cycle={cycle} />
          <PrinterDevice />
        </footer>

        <FolioAnatomy visible={replyShown} />

        <span className="paper-corner paper-corner--one" aria-hidden="true" />
        <span className="paper-corner paper-corner--two" aria-hidden="true" />
      </article>
    </main>
  )
}
