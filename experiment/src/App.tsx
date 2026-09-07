import { useEffect, useRef, useState } from 'react'

const TITLE = 'is Minimax M3 good at frontend yet?'
const ANSWER = '— and the page itself, which you are reading now.'
const REPLY = 'so read it once, then again — slower this time.'
const FOOTNOTE = 'relege · without a reader, silence'

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

function WaxSealInitial() {
  return (
    <span className="wax-seal" aria-hidden="true">
      <span className="wax-halo" />
      <span className="wax-bezant wax-bezant--one" />
      <span className="wax-bezant wax-bezant--two" />
      <span className="wax-bezant wax-bezant--three" />
      <span className="wax-bezant wax-bezant--four" />
      <span className="wax-bezant wax-bezant--five" />
      <svg viewBox="0 0 100 100" focusable="false">
        <defs>
          <radialGradient id="wax-radial" cx="36%" cy="30%" r="72%">
            <stop offset="0%" stopColor="#ffb097" />
            <stop offset="22%" stopColor="#f37557" />
            <stop offset="58%" stopColor="#cf3b29" />
            <stop offset="100%" stopColor="#7d1c12" />
          </radialGradient>
          <radialGradient id="wax-shadow" cx="50%" cy="50%" r="50%">
            <stop offset="60%" stopColor="rgba(48, 10, 4, 0)" />
            <stop offset="100%" stopColor="rgba(48, 10, 4, 0.42)" />
          </radialGradient>
          <radialGradient id="wax-rim" cx="50%" cy="50%" r="50%">
            <stop offset="86%" stopColor="rgba(255, 220, 160, 0)" />
            <stop offset="96%" stopColor="rgba(255, 220, 160, 0.55)" />
            <stop offset="100%" stopColor="rgba(255, 220, 160, 0)" />
          </radialGradient>
        </defs>
        <circle cx="50" cy="52" r="46" fill="url(#wax-shadow)" />
        <circle cx="50" cy="51" r="42" fill="url(#wax-radial)" />
        <circle cx="50" cy="51" r="42" fill="url(#wax-rim)" />
        <circle
          cx="50"
          cy="51"
          r="36"
          fill="none"
          stroke="rgba(255, 245, 233, 0.55)"
          strokeWidth="0.45"
          strokeDasharray="0.9 2.4"
        />
        <circle
          cx="50"
          cy="51"
          r="30"
          fill="none"
          stroke="rgba(255, 245, 233, 0.18)"
          strokeWidth="0.3"
        />
        <ellipse
          cx="38"
          cy="34"
          rx="9"
          ry="5"
          fill="rgba(255, 245, 233, 0.22)"
          transform="rotate(-32 38 34)"
        />
        <g className="wax-monogram" aria-hidden="true">
          <text x="50" y="73" textAnchor="middle" className="wax-letter">
            i
          </text>
        </g>
      </svg>
    </span>
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

function ReadingBreath({ visible }: { visible: boolean }) {
  return (
    <div
      className={`reading-breath${visible ? ' is-visible' : ''}`}
      aria-hidden="true"
    >
      <svg viewBox="0 0 220 24" focusable="false">
        <g className="reading-breath-mark">
          <line x1="0" y1="12" x2="80" y2="12" stroke="currentColor" strokeWidth="0.5" />
          <path
            d="M 80 12 C 92 4, 100 20, 110 12"
            stroke="currentColor"
            strokeWidth="0.5"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M 110 12 C 120 4, 128 20, 140 12"
            stroke="currentColor"
            strokeWidth="0.5"
            fill="none"
            strokeLinecap="round"
          />
          <line x1="140" y1="12" x2="220" y2="12" stroke="currentColor" strokeWidth="0.5" />
          <g transform="translate(110 12)">
            <circle cx="0" cy="0" r="3.2" fill="var(--paper)" stroke="currentColor" strokeWidth="0.55" />
            <circle cx="0" cy="0" r="0.9" fill="currentColor" />
          </g>
        </g>
      </svg>
      <span className="reading-breath-script">a breath between stanzas</span>
    </div>
  )
}

function ScholarAnnotation({ visible }: { visible: boolean }) {
  return (
    <div
      className={`scholar-annotation${visible ? ' is-visible' : ''}`}
      aria-hidden="true"
    >
      <svg viewBox="0 0 132 38" focusable="false">
        <g className="pencil-mark">
          <text
            x="6"
            y="22"
            className="pencil-text"
            fill="currentColor"
          >
            type-set.
          </text>
          <path
            d="M 4 28 Q 16 26 28 28 T 52 28 T 76 28 T 96 28"
            stroke="currentColor"
            strokeWidth="0.55"
            fill="none"
            strokeLinecap="round"
            opacity="0.7"
          />
          <path
            d="M 102 14 L 108 18 M 102 18 L 108 14"
            stroke="currentColor"
            strokeWidth="0.5"
            strokeLinecap="round"
            opacity="0.7"
          />
          <circle cx="118" cy="6" r="0.7" fill="currentColor" opacity="0.6" />
          <circle cx="122" cy="32" r="0.5" fill="currentColor" opacity="0.45" />
        </g>
      </svg>
      <span className="scholar-annotation-mark">manu · pr.</span>
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
    { numeral: 'iv', name: 'this hour', gloss: 'the dial of the leaf', hash: 'sec-hour' },
    { numeral: 'v', name: 'this sky', gloss: 'polaris above ur. minor', hash: 'sec-sky' },
    { numeral: 'vi', name: 'this moon', gloss: 'tide & illumination', hash: 'sec-moon' },
    { numeral: 'vii', name: 'this almanac', gloss: 'today, set in this folio', hash: 'sec-almanac' },
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

function LitLeafMark() {
  return (
    <span className="lit-leaf" aria-hidden="true">
      <svg viewBox="0 0 22 16" focusable="false">
        <path
          d="M 11 2 Q 18 4 17 11 Q 14 14 11 14 Q 8 14 5 11 Q 4 4 11 2 Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.7"
        />
        <line x1="11" y1="3" x2="11" y2="13" stroke="currentColor" strokeWidth="0.4" />
        <line x1="11" y1="6" x2="8" y2="8" stroke="currentColor" strokeWidth="0.3" />
        <line x1="11" y1="6" x2="14" y2="8" stroke="currentColor" strokeWidth="0.3" />
        <line x1="11" y1="9" x2="8.5" y2="11" stroke="currentColor" strokeWidth="0.3" />
        <line x1="11" y1="9" x2="13.5" y2="11" stroke="currentColor" strokeWidth="0.3" />
      </svg>
      <span className="lit-leaf-text">lit. leaf</span>
    </span>
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
      const count = Math.max(40, Math.floor((rect.width * rect.height) / 22000))
      starsRef.current = Array.from({ length: count }, () => ({
        x: Math.random() * rect.width,
        y: Math.random() * rect.height,
        r: 0.3 + Math.random() * 1.1,
        a: 0.18 + Math.random() * 0.32,
        phase: Math.random() * Math.PI * 2,
        twinkle: 0.4 + Math.random() * 1.4,
        vy: -(0.04 + Math.random() * 0.08),
      }))
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
        ctx.fillStyle = reduced
          ? `rgba(245, 232, 200, ${s.a * 0.7})`
          : `rgba(245, 232, 200, ${a})`
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

function PressCorrectionSlip({ visible, intensity }: { visible: boolean; intensity: number }) {
  return (
    <div
      className={`press-correction-slip${visible ? ' is-visible' : ''}`}
      aria-hidden="true"
    >
      <svg className="press-correction-tape" viewBox="0 0 64 16" focusable="false">
        <path
          d="M 3 1.6 L 61 2.8 L 59.4 13 L 2 12 Z"
          fill="rgba(245, 222, 162, 0.7)"
          stroke="rgba(196, 138, 50, 0.32)"
          strokeWidth="0.32"
        />
        <line
          x1="7"
          y1="5.5"
          x2="57"
          y2="6.8"
          stroke="rgba(196, 138, 50, 0.42)"
          strokeWidth="0.4"
          strokeDasharray="1.6 2.2"
        />
        <line
          x1="12"
          y1="9"
          x2="51"
          y2="10.4"
          stroke="rgba(255, 248, 224, 0.32)"
          strokeWidth="0.32"
        />
      </svg>
      <header className="press-correction-head">
        <span className="press-correction-title">press correction</span>
        <span className="press-correction-mark" aria-hidden="true">¶</span>
      </header>
      <span className="press-correction-rule" aria-hidden="true" />
      <p className="press-correction-body">
        <em>what is set once is read</em>
        <br />
        <em>at the pace of attention.</em>
      </p>
      <footer className="press-correction-foot">
        <span className="press-correction-foot-mark">corrig.</span>
        <span className="press-correction-foot-sep" aria-hidden="true">·</span>
        <span className="press-correction-foot-hand">manu pr.</span>
      </footer>
      {intensity > 0 && (
        <span
          className="press-correction-ink"
          style={{ opacity: Math.min(1, intensity) }}
          aria-hidden="true"
        />
      )}
    </div>
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

function ReadingTide({ stage, cycle }: { stage: number; cycle: number }) {
  const stops = [
    { label: 'set', glyph: '§' },
    { label: 'answer', glyph: '¶' },
    { label: 'reply', glyph: '†' },
    { label: 'out', glyph: '‡' },
  ]
  const yPercent = Math.max(0, Math.min(1, stage / (stops.length - 1)))
  return (
    <div className="reading-tide" aria-hidden="true">
      <span className="reading-tide-rule" />
      {stops.map((stop, i) => (
        <span
          key={stop.label}
          className={`reading-tide-stop ${stage >= i ? 'is-passed' : ''}${
            stage === i ? ' is-current' : ''
          }`}
          style={{ top: `${(i / (stops.length - 1)) * 100}%` }}
        >
          <span className="reading-tide-glyph">{stop.glyph}</span>
          <span className="reading-tide-label">{stop.label}</span>
        </span>
      ))}
      <span
        className="reading-tide-marker"
        style={{ top: `${yPercent * 100}%` }}
      >
        <svg viewBox="0 0 14 14" focusable="false">
          <circle cx="7" cy="7" r="5" fill="var(--gold)" />
          <circle
            cx="7"
            cy="7"
            r="5"
            fill="none"
            stroke="var(--ink)"
            strokeWidth="0.8"
          />
        </svg>
      </span>
      {cycle > 0 && (
        <span className="reading-tide-reread" aria-hidden="true">
          <span className="reading-tide-reread-mark">⟲</span>
          <span className="reading-tide-reread-text">re-reading</span>
        </span>
      )}
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

function HalfTitle() {
  return (
    <div className="half-title" aria-hidden="true">
      <span className="half-title-mark">¶</span>
      <span className="half-title-text">an experiment in questioning</span>
      <span className="half-title-sep">·</span>
      <span className="half-title-sub">set in this browser</span>
    </div>
  )
}

function EditionLine({ cycle }: { cycle: number }) {
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
      className={`edition-line${cycle > 0 ? ' is-reread' : ''}`}
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

function TitleCartouche({ children }: { children: React.ReactNode }) {
  return (
    <span className="title-cartouche" aria-hidden="true">
      <svg className="title-cartouche-frame" viewBox="0 0 110 110" focusable="false">
        <g className="cartouche-outer">
          <rect x="6" y="6" width="98" height="98" rx="2" />
          <rect
            x="10"
            y="10"
            width="90"
            height="90"
            rx="1"
            fill="none"
            strokeDasharray="1.4 2.2"
          />
        </g>
        <g className="cartouche-corner cartouche-corner--tl">
          <path d="M 6 18 Q 6 6 18 6" fill="none" />
          <path d="M 12 18 Q 12 12 18 12" fill="none" />
        </g>
        <g className="cartouche-corner cartouche-corner--tr">
          <path d="M 92 6 Q 104 6 104 18" fill="none" />
          <path d="M 92 12 Q 98 12 98 18" fill="none" />
        </g>
        <g className="cartouche-corner cartouche-corner--bl">
          <path d="M 6 92 Q 6 104 18 104" fill="none" />
          <path d="M 12 92 Q 12 98 18 98" fill="none" />
        </g>
        <g className="cartouche-corner cartouche-corner--br">
          <path d="M 92 104 Q 104 104 104 92" fill="none" />
          <path d="M 92 98 Q 98 98 98 92" fill="none" />
        </g>
        <g className="cartouche-marks">
          <circle cx="55" cy="9" r="0.9" />
          <circle cx="55" cy="101" r="0.9" />
          <circle cx="9" cy="55" r="0.9" />
          <circle cx="101" cy="55" r="0.9" />
        </g>
      </svg>
      <span className="title-cartouche-inner">{children}</span>
    </span>
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

function ReaderCat({ visible }: { visible: boolean }) {
  return (
    <div className={`reader-cat${visible ? ' is-visible' : ''}`} aria-hidden="true">
      <svg className="reader-cat-glyph" viewBox="0 0 140 80" focusable="false">
        <defs>
          <linearGradient id="cat-body" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(112, 80, 50, 0.92)" />
            <stop offset="100%" stopColor="rgba(60, 38, 20, 0.95)" />
          </linearGradient>
          <radialGradient id="cat-pad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(217, 101, 74, 0.55)" />
            <stop offset="100%" stopColor="rgba(167, 60, 44, 0)" />
          </radialGradient>
        </defs>

        <ellipse cx="70" cy="68" rx="50" ry="3" fill="rgba(40, 18, 8, 0.18)" />

        <g className="reader-cat-form">
          <path
            d="M 30 56 Q 22 56 22 48 Q 22 38 32 36 Q 36 28 48 28 L 80 28 Q 96 28 100 38 L 110 38 Q 116 40 116 46 Q 116 52 110 54 L 100 56 Q 96 64 86 66 L 36 66 Q 28 64 30 56 Z"
            fill="url(#cat-body)"
            stroke="rgba(40, 22, 8, 0.6)"
            strokeWidth="0.6"
          />

          <path
            d="M 92 38 L 96 30 L 100 38 Z"
            fill="url(#cat-body)"
            stroke="rgba(40, 22, 8, 0.5)"
            strokeWidth="0.5"
          />
          <path
            d="M 96 32 L 100 38"
            stroke="rgba(245, 198, 91, 0.4)"
            strokeWidth="0.4"
            fill="none"
          />
          <path
            d="M 100 38 L 102 32 L 106 38 Z"
            fill="rgba(217, 101, 74, 0.85)"
          />

          <ellipse cx="40" cy="46" rx="2.4" ry="3.2" fill="rgba(20, 18, 12, 0.92)" />
          <path
            d="M 38 47 Q 40 49 42 47"
            stroke="rgba(245, 220, 160, 0.4)"
            strokeWidth="0.4"
            fill="none"
          />

          <path
            d="M 40 50 Q 38 54 42 56"
            stroke="rgba(40, 22, 8, 0.4)"
            strokeWidth="0.45"
            fill="none"
          />

          <path
            d="M 96 50 Q 110 48 116 52 Q 122 54 122 60 Q 122 64 118 64 Q 110 62 100 60 Q 94 58 96 50 Z"
            fill="url(#cat-body)"
            opacity="0.94"
          />
          <path
            d="M 116 58 Q 122 60 120 64"
            stroke="rgba(40, 22, 8, 0.4)"
            strokeWidth="0.4"
            fill="none"
          />
          <ellipse cx="116" cy="62" rx="1.4" ry="2.2" fill="rgba(217, 101, 74, 0.78)" />

          <path
            d="M 26 50 Q 18 56 18 62"
            stroke="rgba(40, 22, 8, 0.5)"
            strokeWidth="0.6"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M 28 56 Q 22 64 22 70"
            stroke="rgba(40, 22, 8, 0.5)"
            strokeWidth="0.6"
            fill="none"
            strokeLinecap="round"
          />

          <path
            d="M 96 64 Q 100 70 102 74"
            stroke="rgba(40, 22, 8, 0.5)"
            strokeWidth="0.6"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M 100 64 Q 106 70 110 74"
            stroke="rgba(40, 22, 8, 0.5)"
            strokeWidth="0.6"
            fill="none"
            strokeLinecap="round"
          />
        </g>

        <g className="reader-cat-breath" opacity="0.5">
          <circle cx="40" cy="46" r="6" fill="url(#cat-pad)" />
        </g>

        <path
          d="M 30 36 Q 24 18 28 8"
          stroke="rgba(245, 198, 91, 0.32)"
          strokeWidth="0.6"
          fill="none"
          strokeDasharray="1.2 2.6"
          strokeLinecap="round"
        />
        <path
          d="M 30 8 Q 32 4 36 4"
          stroke="rgba(245, 198, 91, 0.32)"
          strokeWidth="0.6"
          fill="none"
          strokeLinecap="round"
        />
      </svg>
      <span className="reader-cat-caption">
        <em>quiet reader</em>
        <span className="reader-cat-caption-tail" aria-hidden="true">· settled at the foot of the page</span>
      </span>
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
        <ReadingLamp intensity={inkProgress} />
        <DustMotes reduced={reduced} />
        <BookmarkRibbon />
        <span className="gilded-edge" aria-hidden="true" />
        <ReadingTide stage={tideStage} cycle={cycle} />

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

        <div className="chapter-opener">
          <ChapterHead now={now} />
        </div>

        <div className="sheet-content">
          <section className="question-panel" aria-labelledby="page-title">
            <HalfTitle />
            <div className="annotation annotation--top">
              <span className="annotation-mark" aria-hidden="true">¶</span>
              <span>the question · plainly set</span>
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
                <span className="title-text"> good at frontend yet?</span>
              </span>
            </h1>
            <EditionLine cycle={cycle} />

            <div
              data-section="sec-marginalia"
              ref={(el) => { sectionRefs.current['sec-marginalia'] = el }}
              className="marginalia-section"
            >
              <MarginaliaStrip items={MARGINALIA} />
            </div>

            <div className="question-stanzas" aria-label="argument of the folio">
              <p className="question-stanza">
                <span className="question-stanza-mark" aria-hidden="true">¶</span>
                <span className="question-stanza-lines">
                  A small typeset test of whether a page
                  can <em>ask well</em> before it answers —
                </span>
              </p>
              <p className="question-stanza">
                <span className="question-stanza-mark" aria-hidden="true">†</span>
                <span className="question-stanza-lines">
                  an <em>initial in gilt</em>, three marginalia,
                  and a <em>quiet reply</em> that turns the leaf.
                </span>
              </p>
              <p className="question-stanza question-stanza--close">
                <span className="question-stanza-mark" aria-hidden="true">‡</span>
                <span className="question-stanza-lines">
                  The answer is the page itself —
                  read it once, then again, <em>slower this time</em>.
                </span>
              </p>
            </div>

            <ReadingTrace cycle={cycle} reduced={reduced} />

            <LeafCluster
              className={`leaf-cluster--turn ${isTyping || phase === 'complete' ? 'is-sealed' : ''}`}
              label="turn the leaf"
            />

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
          </section>

          <section
            className={`response-panel response-panel--verso ${replyShown ? 'is-revealed' : ''}`}
            aria-labelledby="response-title"
          >
            <span className="verso-shine" aria-hidden="true" />
            <ReadingLines count={lineCount} visible={readingLinesVisible} />
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
              <span className="answer-corner answer-corner--tl" aria-hidden="true" />
              <span className="answer-corner answer-corner--tr" aria-hidden="true" />
              <span className="answer-corner answer-corner--bl" aria-hidden="true" />
              <span className="answer-corner answer-corner--br" aria-hidden="true" />
              <InkFingerprint visible={phase !== 'idle'} />
              {answerVisible && (
                <span className="answer-letter-head" aria-hidden="true">
                  <span className="answer-letter-head-mark">¶</span>
                  <span className="answer-letter-head-text">set in italic · 30 pt · leaded</span>
                  <span className="answer-letter-head-rule" />
                </span>
              )}
              <span className="answer-quote answer-quote--open" aria-hidden="true">"</span>
              {!answerVisible && (
                <p className="answer-placeholder">
                  press below
                  <br />
                  and let it arrive.
                </p>
              )}
              {answerVisible && (
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
              )}
              <span className="answer-quote answer-quote--close" aria-hidden="true">"</span>
              {phase === 'complete' && (
                <span className="answer-letter-close" aria-hidden="true">
                  <span className="answer-letter-close-rule" />
                  <em>— cap. xviii · sig. m.iii</em>
                </span>
              )}
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
            </div>

            <TypefaceSpecimen visible={specimenVisible} />

            <div
              data-section="sec-reply"
              ref={(el) => { sectionRefs.current['sec-reply'] = el }}
              className={`reply-copy ${replyShown ? 'is-visible' : ''}`}
              aria-live="polite"
            >
              <span className="reply-paragraph">
                {replyChars > 0 && (
                  <span className="reply-initial" aria-hidden="true">
                    <PrintedInitial letter={REPLY.charAt(0)} />
                  </span>
                )}
                <span className="reply-text">{replyDisplay}</span>
                {phase === 'replying' && <span className="typing-caret" aria-hidden="true">|</span>}
              </span>
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

            <button
              className={`read-button${slow ? ' is-slow' : ''}`}
              type="button"
              onClick={readAnswer}
              aria-describedby="reader-note"
              aria-keyshortcuts="Space R"
            >
              <span className="button-mark" aria-hidden="true">↗</span>
              <span className="button-label">{buttonLabel}</span>
              <span className="button-pace" aria-hidden="true">
                {slow ? '· slow' : '· fast'}
              </span>
              <span className="button-keys" aria-hidden="true">
                <kbd>space</kbd>
              </span>
            </button>
            <p className="reader-note" id="reader-note">{readerNote}</p>

            <PressSeal
              visible={phase === 'complete'}
              cycle={cycle}
            />

            <div className={`scholars-bench ${benchShown ? 'is-revealed' : ''}`}>
              <span className="scholars-bench-label" aria-hidden="true">
                <span className="scholars-bench-label-mark">§</span>
                <em>the scholar's bench</em>
                <span className="scholars-bench-label-mark">§</span>
              </span>
              <EngravedRule className="scholars-bench-rule" />
              <div className="scholars-bench-row">
                <div
                  data-section="sec-hour"
                  ref={(el) => { sectionRefs.current['sec-hour'] = el }}
                  className="bench-item"
                >
                  <LeafHourDial
                    hours={hours}
                    minutes={minutes}
                    seconds={seconds}
                    visible={hourDialVisible}
                  />
                </div>
                <div
                  data-section="sec-sky"
                  ref={(el) => { sectionRefs.current['sec-sky'] = el }}
                  className="bench-item"
                >
                  <SiderealPocket visible={hourDialVisible} reduced={reduced} />
                </div>
                <div
                  data-section="sec-moon"
                  ref={(el) => { sectionRefs.current['sec-moon'] = el }}
                  className="bench-item"
                >
                  <MoonPhase phase={moonPhase} visible={hourDialVisible} />
                </div>
              </div>
            </div>

            <div
              data-section="sec-almanac"
              ref={(el) => { sectionRefs.current['sec-almanac'] = el }}
              className="almanac-anchor"
            >
              <AlmanacDaybook now={now} moonPhase={moonPhase} cycle={cycle} />
            </div>

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

            <ReaderCat visible={phase === 'complete'} />

            {phase === 'complete' && <Colophon cycle={cycle} />}
          </section>
        </div>

        <footer className="sheet-footer">
          <span className="footer-rule" aria-hidden="true" />
          <p className="footer-line">the interface is part of the answer</p>
          <SignatureMark sig="A3" side="v" />
          <PrinterDevice />
        </footer>

        <FolioAnatomy visible={replyShown} />

        <span className="paper-corner paper-corner--one" aria-hidden="true" />
        <span className="paper-corner paper-corner--two" aria-hidden="true" />
      </article>
    </main>
  )
}
