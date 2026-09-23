import {
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react'
import type { VoiceId } from './App'

type DaybreakProps = {
  voice: VoiceId
  setToday: string
  onVoice: (voice: VoiceId) => void
}

const VOICE_NAME: Record<VoiceId, string> = {
  quiet: 'quiet cut',
  human: 'human hand',
  bold: 'bold signal',
}
const VOICE_FACE: Record<VoiceId, string> = {
  quiet: 'serif · italic · close set',
  human: 'serif · italic · warm',
  bold: 'sans · heavy · no apology',
}
const VOICE_LETTER: Record<VoiceId, string> = { quiet: 'A', human: 'B', bold: 'C' }
const VOICE_GLYPH: Record<VoiceId, string> = { quiet: '⌇', human: '∧', bold: '∴' }
const VOICE_MARK: Record<VoiceId, string> = { quiet: 'stet', human: 'caret', bold: 'query' }
const VOICE_NOTE: Record<VoiceId, string> = {
  quiet: 'set softly — the reader hears themselves in it',
  human: 'set by hand — the page warms',
  bold: 'set at full height — heard once, clearly',
}

const VOICE_FAMILY: Record<VoiceId, string> = {
  quiet: "'Iowan Old Style', 'Palatino Linotype', 'Book Antiqua', Palatino, Georgia, 'Times New Roman', serif",
  human: "'Iowan Old Style', 'Palatino Linotype', 'Book Antiqua', Palatino, Georgia, 'Times New Roman', serif",
  bold: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
}
const VOICE_STYLE: Record<VoiceId, 'italic' | 'normal'> = {
  quiet: 'italic',
  human: 'italic',
  bold: 'normal',
}
const VOICE_WEIGHT: Record<VoiceId, number> = { quiet: 400, human: 500, bold: 800 }
const VOICE_TRACKING: Record<VoiceId, string> = {
  quiet: '-.022em',
  human: '-.014em',
  bold: '-.045em',
}
const VOICE_TRANSFORM: Record<VoiceId, 'none' | 'uppercase'> = {
  quiet: 'none',
  human: 'none',
  bold: 'uppercase',
}

const VOICE_LINE: Record<VoiceId, string> = {
  quiet: 'is m³ good at frontend yet?',
  human: 'is M3 good at frontend yet?',
  bold: 'IS M3 GOOD AT FRONTEND YET?',
}

const ORDER: VoiceId[] = ['quiet', 'human', 'bold']
const TITLE_FULL = 'is Minimax M3 good at frontend yet?'

const DAY_NAME: Record<number, string> = {
  0: 'sunday',
  1: 'monday',
  2: 'tuesday',
  3: 'wednesday',
  4: 'thursday',
  5: 'friday',
  6: 'saturday',
}

function plateDateTokens(setToday: string) {
  const [month, day, year] = setToday.split(' ')
  const dayNum = parseInt(day, 10)
  return {
    month: month ?? '',
    day: Number.isFinite(dayNum) ? dayNum.toString().padStart(2, '0') : '',
    year: year ?? '',
  }
}

function plateHour() {
  const now = new Date()
  let h = now.getHours()
  const m = now.getMinutes()
  const ampm = h >= 12 ? 'pm' : 'am'
  h = h % 12
  if (h === 0) h = 12
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} ${ampm}`
}

export function Daybreak({ voice, setToday, onVoice }: DaybreakProps) {
  const baseId = useId().replace(/:/g, '')
  const skyId = `day-sky-${baseId}`
  const haloId = `day-halo-${baseId}`
  const orbId = `day-orb-${baseId}`
  const orbCoreId = `day-orb-core-${baseId}`
  const rayId = `day-ray-${baseId}`
  const waxId = `day-wax-${baseId}`
  const cordId = `day-cord-${baseId}`
  const sealFillId = `day-seal-fill-${baseId}`
  const sealGlowId = `day-seal-glow-${baseId}`

  const rootRef = useRef<HTMLElement | null>(null)
  const [revealed, setRevealed] = useState(false)
  const [orbRise, setOrbRise] = useState(false)
  const [reduceMotion, setReduceMotion] = useState(false)
  const [hovered, setHovered] = useState<VoiceId | null>(null)
  const [hour, setHour] = useState(() => plateHour())
  const [dayName, setDayName] = useState<string>(() => {
    const d = new Date().getDay()
    return DAY_NAME[d] ?? ''
  })

  useEffect(() => {
    if (typeof window === 'undefined') return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduceMotion(mq.matches)
    const onChange = () => setReduceMotion(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setRevealed(true)
      setOrbRise(true)
      return
    }
    const node = rootRef.current
    if (!node) return
    const obs = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setRevealed(true)
            const riseDelay = reduceMotion ? 0 : 320
            window.setTimeout(() => setOrbRise(true), riseDelay)
            obs.unobserve(entry.target)
          }
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -4% 0px' },
    )
    obs.observe(node)
    return () => obs.disconnect()
  }, [reduceMotion])

  useEffect(() => {
    const id = window.setInterval(() => {
      setHour(plateHour())
      setDayName(DAY_NAME[new Date().getDay()] ?? '')
    }, 30_000)
    return () => window.clearInterval(id)
  }, [])

  const tokens = plateDateTokens(setToday)
  const focus = hovered ?? voice

  const style = {
    '--day-tone': `var(--${voice})`,
    '--day-focus': `var(--${focus})`,
    '--day-tone-deep': `var(--${voice}-deep)`,
  } as CSSProperties

  const handleVoiceKey = (event: ReactKeyboardEvent<HTMLButtonElement>, id: VoiceId) => {
    const idx = ORDER.indexOf(id)
    let next: VoiceId | null = null
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
      event.preventDefault()
      next = ORDER[(idx + 1) % ORDER.length]
    } else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
      event.preventDefault()
      next = ORDER[(idx - 1 + ORDER.length) % ORDER.length]
    } else if (event.key === 'Home') {
      event.preventDefault()
      next = ORDER[0]
    } else if (event.key === 'End') {
      event.preventDefault()
      next = ORDER[ORDER.length - 1]
    }
    if (next && next !== id) {
      onVoice(next)
      const node = rootRef.current?.querySelector<HTMLButtonElement>(`[data-voice="${next}"]`)
      node?.focus()
    }
  }

  return (
    <section
      ref={rootRef}
      id="prologue"
      className={`daybreak daybreak--${voice} ${revealed ? 'is-revealed' : ''} ${orbRise ? 'is-rise' : ''} ${reduceMotion ? 'is-quiet' : ''}`}
      style={style}
      aria-label={`The daybreak · m³ press · folio zero · the prologue · the question "${TITLE_FULL}" set in three voices · set on ${dayName} ${tokens.month} ${tokens.day}, ${tokens.year} at ${hour} · voice set in ${VOICE_NAME[voice]}.`}
    >
      <svg className="daybreak__defs" aria-hidden="true" focusable="false">
        <defs>
          <linearGradient id={skyId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--day-focus)" stopOpacity=".16" />
            <stop offset="44%" stopColor="var(--day-focus)" stopOpacity=".04" />
            <stop offset="100%" stopColor="var(--day-focus)" stopOpacity="0" />
          </linearGradient>
          <radialGradient id={haloId} cx="50%" cy="50%" r="55%">
            <stop offset="0%" stopColor="var(--day-focus)" stopOpacity=".18" />
            <stop offset="55%" stopColor="var(--day-focus)" stopOpacity=".05" />
            <stop offset="100%" stopColor="var(--day-focus)" stopOpacity="0" />
          </radialGradient>
          <radialGradient id={orbId} cx="50%" cy="42%" r="58%">
            <stop offset="0%" stopColor="rgba(255, 248, 226, .96)" />
            <stop offset="46%" stopColor="rgba(255, 226, 184, .72)" />
            <stop offset="82%" stopColor="rgba(244, 198, 152, .2)" />
            <stop offset="100%" stopColor="rgba(244, 198, 152, 0)" />
          </radialGradient>
          <radialGradient id={orbCoreId} cx="50%" cy="42%" r="48%">
            <stop offset="0%" stopColor="rgba(255, 252, 234, .98)" />
            <stop offset="60%" stopColor="rgba(255, 240, 210, .68)" />
            <stop offset="100%" stopColor="rgba(255, 232, 192, 0)" />
          </radialGradient>
          <radialGradient id={rayId} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--day-focus)" stopOpacity=".42" />
            <stop offset="80%" stopColor="var(--day-focus)" stopOpacity="0" />
          </radialGradient>
          <linearGradient id={waxId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--day-focus)" stopOpacity=".34" />
            <stop offset="60%" stopColor="var(--day-focus)" stopOpacity=".12" />
            <stop offset="100%" stopColor="var(--day-focus)" stopOpacity="0" />
          </linearGradient>
          <linearGradient id={cordId} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
            <stop offset="22%" stopColor="currentColor" stopOpacity=".5" />
            <stop offset="50%" stopColor="currentColor" stopOpacity=".8" />
            <stop offset="78%" stopColor="currentColor" stopOpacity=".5" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
          <radialGradient id={sealGlowId} cx="50%" cy="40%" r="62%">
            <stop offset="0%" stopColor="currentColor" stopOpacity=".18" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </radialGradient>
          <radialGradient id={sealFillId} cx="42%" cy="38%" r="62%">
            <stop offset="0%" stopColor={voice === 'quiet' ? 'rgba(168, 197, 255, 0.55)' : voice === 'human' ? 'rgba(244, 132, 114, 0.6)' : 'rgba(205, 238, 106, 0.6)'} />
            <stop offset="60%" stopColor={voice === 'quiet' ? 'rgba(120, 158, 240, 0.85)' : voice === 'human' ? 'rgba(216, 80, 64, 0.85)' : 'rgba(168, 214, 50, 0.85)'} />
            <stop offset="100%" stopColor="rgba(8, 10, 18, 0.85)" />
          </radialGradient>
        </defs>
      </svg>

      <span className="daybreak__sky" aria-hidden="true">
        <svg viewBox="0 0 800 320" preserveAspectRatio="xMidYMid meet" className="daybreak__sky-svg">
          <rect x="0" y="0" width="800" height="320" fill={`url(#${skyId})`} />
          <g fill="currentColor" opacity=".7" className="daybreak__sky-stars">
            <circle cx="120" cy="62" r=".7" />
            <circle cx="244" cy="44" r=".5" />
            <circle cx="356" cy="86" r=".9" opacity=".85" />
            <circle cx="468" cy="58" r=".55" />
            <circle cx="572" cy="92" r=".7" />
            <circle cx="664" cy="56" r=".55" />
            <circle cx="180" cy="124" r=".55" />
            <circle cx="316" cy="138" r=".9" opacity=".85" />
            <circle cx="488" cy="118" r=".7" />
            <circle cx="612" cy="156" r=".55" />
            <circle cx="76" cy="172" r=".55" />
            <circle cx="724" cy="142" r=".55" />
            <circle cx="402" cy="32" r=".5" opacity=".6" />
            <circle cx="294" cy="186" r=".6" opacity=".65" />
          </g>
        </svg>
      </span>

      <span className="daybreak__orb-stage" aria-hidden="true">
        <svg viewBox="0 0 600 240" preserveAspectRatio="xMidYMax meet" className="daybreak__orb-svg">
          <line
            x1="0"
            y1="200"
            x2="600"
            y2="200"
            stroke="currentColor"
            strokeWidth=".55"
            opacity=".42"
          />
          <line
            x1="0"
            y1="206"
            x2="600"
            y2="206"
            stroke="currentColor"
            strokeWidth=".32"
            strokeDasharray="1.2 2.4"
            opacity=".3"
          />
          <g className="daybreak__rays">
            {Array.from({ length: 11 }).map((_, i) => {
              const a = (-90 + (i - 5) * 10) * (Math.PI / 180)
              const x1 = 300 + Math.cos(a) * 78
              const y1 = 200 + Math.sin(a) * 78
              const x2 = 300 + Math.cos(a) * 152
              const y2 = 200 + Math.sin(a) * 152
              return (
                <line
                  key={`ray-${i}`}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={`url(#${rayId})`}
                  strokeWidth={i % 2 === 0 ? 1.2 : 0.6}
                  strokeLinecap="round"
                  opacity={i % 2 === 0 ? 0.85 : 0.5}
                />
              )
            })}
          </g>
          <circle cx="300" cy="200" r="56" fill={`url(#${orbId})`} className="daybreak__orb-half daybreak__orb-half--halo" />
          <g className="daybreak__orb-half">
            <circle cx="300" cy="200" r="34" fill={`url(#${orbCoreId})`} />
            <path
              d="M 266 200 A 34 34 0 0 1 334 200 L 334 240 L 266 240 Z"
              fill="var(--night)"
              opacity="0.94"
            />
            <path
              d="M 266 200 A 34 34 0 0 1 334 200"
              fill="none"
              stroke="rgba(255, 240, 210, .55)"
              strokeWidth=".6"
            />
            <line
              x1="266"
              y1="200"
              x2="334"
              y2="200"
              stroke="rgba(255, 240, 210, .35)"
              strokeWidth=".4"
              strokeDasharray="1 1.6"
            />
          </g>
          <g className="daybreak__notches" stroke="currentColor" strokeWidth=".4" opacity=".4">
            <line x1="100" y1="200" x2="100" y2="206" />
            <line x1="124" y1="200" x2="124" y2="208" />
            <line x1="148" y1="200" x2="148" y2="206" />
            <line x1="172" y1="200" x2="172" y2="208" />
            <line x1="196" y1="200" x2="196" y2="206" />
            <line x1="220" y1="200" x2="220" y2="208" />
            <line x1="244" y1="200" x2="244" y2="206" />
            <line x1="268" y1="200" x2="268" y2="208" />
            <line x1="332" y1="200" x2="332" y2="208" />
            <line x1="356" y1="200" x2="356" y2="206" />
            <line x1="380" y1="200" x2="380" y2="208" />
            <line x1="404" y1="200" x2="404" y2="206" />
            <line x1="428" y1="200" x2="428" y2="208" />
            <line x1="452" y1="200" x2="452" y2="206" />
            <line x1="476" y1="200" x2="476" y2="208" />
            <line x1="500" y1="200" x2="500" y2="206" />
          </g>
        </svg>
      </span>

      <header className="daybreak__masthead" aria-hidden="true">
        <span className="daybreak__masthead-rule daybreak__masthead-rule--l">
          <svg viewBox="0 0 220 10" preserveAspectRatio="none">
            <line x1="0" y1="5" x2="220" y2="5" stroke={`url(#${cordId})`} strokeWidth=".55" />
            <line x1="0" y1="5" x2="220" y2="5" stroke="currentColor" strokeWidth=".3" strokeDasharray=".5 2.4" opacity=".42" />
            <circle cx="2" cy="5" r="1.1" fill="currentColor" />
            <circle cx="110" cy="5" r="1.8" fill="currentColor" />
            <circle cx="110" cy="5" r=".6" fill="var(--night)" />
            <circle cx="218" cy="5" r="1.1" fill="currentColor" />
          </svg>
        </span>
        <span className="daybreak__masthead-stack">
          <span className="daybreak__masthead-press">
            <span className="daybreak__masthead-mark" aria-hidden="true">
              <svg viewBox="0 0 22 22">
                <circle cx="11" cy="11" r="9.2" fill="none" stroke="currentColor" strokeWidth=".55" opacity=".85" />
                <circle cx="11" cy="11" r="6.4" fill="none" stroke="currentColor" strokeWidth=".32" strokeDasharray=".6 1.4" opacity=".6" />
                <circle cx="11" cy="11" r="2.2" fill="currentColor" opacity=".95" />
                <circle cx="11" cy="11" r=".7" fill="var(--night)" />
                <line x1="11" y1="0.5" x2="11" y2="2.6" stroke="currentColor" strokeWidth=".55" strokeLinecap="round" opacity=".75" />
                <line x1="11" y1="19.4" x2="11" y2="21.5" stroke="currentColor" strokeWidth=".55" strokeLinecap="round" opacity=".75" />
                <line x1="0.5" y1="11" x2="2.6" y2="11" stroke="currentColor" strokeWidth=".5" strokeLinecap="round" opacity=".75" />
                <line x1="19.4" y1="11" x2="21.5" y2="11" stroke="currentColor" strokeWidth=".5" strokeLinecap="round" opacity=".75" />
              </svg>
            </span>
            <em className="daybreak__masthead-name">m³ press</em>
          </span>
          <span className="daybreak__masthead-meta">
            <em>folio zero</em>
            <span aria-hidden="true">·</span>
            <em>the prologue</em>
            <span aria-hidden="true">·</span>
            <em>{dayName} {tokens.month} {tokens.day}, {tokens.year}</em>
            <span aria-hidden="true">·</span>
            <em>{hour}</em>
          </span>
        </span>
        <span className="daybreak__masthead-rule daybreak__masthead-rule--r">
          <svg viewBox="0 0 220 10" preserveAspectRatio="none">
            <line x1="0" y1="5" x2="220" y2="5" stroke={`url(#${cordId})`} strokeWidth=".55" />
            <line x1="0" y1="5" x2="220" y2="5" stroke="currentColor" strokeWidth=".3" strokeDasharray=".5 2.4" opacity=".42" />
            <circle cx="2" cy="5" r="1.1" fill="currentColor" />
            <circle cx="110" cy="5" r="1.8" fill="currentColor" />
            <circle cx="110" cy="5" r=".6" fill="var(--night)" />
            <circle cx="218" cy="5" r="1.1" fill="currentColor" />
          </svg>
        </span>
      </header>

      <span className="daybreak__eyebrow" aria-hidden="true">
        <span className="daybreak__eyebrow-pip">
          <svg viewBox="0 0 14 14" aria-hidden="true">
            <circle cx="7" cy="7" r="5.4" fill="none" stroke="currentColor" strokeWidth=".55" opacity=".78" />
            <circle cx="7" cy="7" r="2.2" fill="currentColor" opacity=".85" />
            <circle cx="7" cy="7" r=".7" fill="var(--night)" />
          </svg>
        </span>
        <em>the daybreak opens with a single line</em>
        <span aria-hidden="true">·</span>
        <em>set in three voices</em>
        <span aria-hidden="true">·</span>
        <em>the question, kept open</em>
        <span className="daybreak__eyebrow-pip daybreak__eyebrow-pip--end">
          <svg viewBox="0 0 14 14" aria-hidden="true">
            <circle cx="7" cy="7" r="5.4" fill="none" stroke="currentColor" strokeWidth=".55" opacity=".78" />
            <circle cx="7" cy="7" r="2.2" fill="currentColor" opacity=".85" />
            <circle cx="7" cy="7" r=".7" fill="var(--night)" />
          </svg>
        </span>
      </span>

      <h1 className="daybreak__title">
        <span className="daybreak__title-row daybreak__title-row--a">
          <span
            className={`daybreak__line daybreak__line--quiet`}
            style={{
              fontFamily: VOICE_FAMILY.quiet,
              fontStyle: VOICE_STYLE.quiet,
              fontWeight: VOICE_WEIGHT.quiet,
              letterSpacing: VOICE_TRACKING.quiet,
              textTransform: VOICE_TRANSFORM.quiet,
            }}
            aria-hidden="true"
          >
            <span className="daybreak__line-pip daybreak__line-pip--quiet" aria-hidden="true">
              <svg viewBox="0 0 18 18"><circle cx="9" cy="9" r="7.4" fill="none" stroke="currentColor" strokeWidth=".55" opacity=".7" /><circle cx="9" cy="9" r="2" fill="currentColor" opacity=".95" /><circle cx="9" cy="9" r=".7" fill="var(--night)" /></svg>
            </span>
            {VOICE_LINE.quiet}
          </span>
        </span>
        <span className="daybreak__title-row daybreak__title-row--b">
          <span
            className={`daybreak__line daybreak__line--human`}
            style={{
              fontFamily: VOICE_FAMILY.human,
              fontStyle: VOICE_STYLE.human,
              fontWeight: VOICE_WEIGHT.human,
              letterSpacing: VOICE_TRACKING.human,
              textTransform: VOICE_TRANSFORM.human,
            }}
            aria-hidden="true"
          >
            <span className="daybreak__line-pip daybreak__line-pip--human" aria-hidden="true">
              <svg viewBox="0 0 18 18"><circle cx="9" cy="9" r="7.4" fill="none" stroke="currentColor" strokeWidth=".55" opacity=".7" /><circle cx="9" cy="9" r="2" fill="currentColor" opacity=".95" /><circle cx="9" cy="9" r=".7" fill="var(--night)" /></svg>
            </span>
            {VOICE_LINE.human}
          </span>
        </span>
        <span className="daybreak__title-row daybreak__title-row--c">
          <span
            className={`daybreak__line daybreak__line--bold`}
            style={{
              fontFamily: VOICE_FAMILY.bold,
              fontStyle: VOICE_STYLE.bold,
              fontWeight: VOICE_WEIGHT.bold,
              letterSpacing: VOICE_TRACKING.bold,
              textTransform: VOICE_TRANSFORM.bold,
            }}
            aria-hidden="true"
          >
            <span className="daybreak__line-pip daybreak__line-pip--bold" aria-hidden="true">
              <svg viewBox="0 0 18 18"><circle cx="9" cy="9" r="7.4" fill="none" stroke="currentColor" strokeWidth=".55" opacity=".7" /><circle cx="9" cy="9" r="2" fill="currentColor" opacity=".95" /><circle cx="9" cy="9" r=".7" fill="var(--night)" /></svg>
            </span>
            {VOICE_LINE.bold}
          </span>
        </span>
      </h1>

      <span className="daybreak__rule" aria-hidden="true">
        <span className="daybreak__rule-line" />
        <span className="daybreak__rule-mark">
          <svg viewBox="0 0 32 8" preserveAspectRatio="none">
            <line x1="0" y1="4" x2="12" y2="4" stroke="currentColor" strokeWidth=".4" strokeDasharray=".5 1.8" opacity=".55" />
            <circle cx="16" cy="4" r="1.8" fill="currentColor" />
            <circle cx="16" cy="4" r=".6" fill="var(--night)" />
            <line x1="20" y1="4" x2="32" y2="4" stroke="currentColor" strokeWidth=".4" strokeDasharray=".5 1.8" opacity=".55" />
          </svg>
        </span>
        <span className="daybreak__rule-line" />
      </span>

      <div
        className="daybreak__voices"
        role="group"
        aria-label="The three voices · click or use arrow keys to set the line"
      >
        {ORDER.map((v, i) => {
          const isActive = voice === v
          const isHover = hovered === v
          const rowStyle = { '--row-tone': `var(--${v})` } as CSSProperties
          return (
            <button
              key={v}
              type="button"
              data-voice={v}
              className={`daybreak__voice daybreak__voice--${v} ${isActive ? 'is-active' : ''} ${isHover ? 'is-hover' : ''}`}
              style={rowStyle}
              onClick={() => onVoice(v)}
              onMouseEnter={() => setHovered(v)}
              onMouseLeave={() => setHovered(prev => (prev === v ? null : prev))}
              onFocus={() => setHovered(v)}
              onBlur={() => setHovered(prev => (prev === v ? null : prev))}
              onKeyDown={event => handleVoiceKey(event, v)}
              aria-pressed={voice === v}
              aria-label={`Set the line in ${VOICE_NAME[v]} — ${VOICE_FACE[v]}. ${VOICE_NOTE[v]}. Mark: ${VOICE_MARK[v]}.`}
            >
              <span className="daybreak__voice-letter" aria-hidden="true">
                <svg viewBox="0 0 26 26">
                  <circle cx="13" cy="13" r="11" fill="none" stroke="currentColor" strokeWidth=".55" />
                  <circle cx="13" cy="13" r="6" fill="none" stroke="currentColor" strokeWidth=".32" strokeDasharray=".6 1.4" opacity=".55" />
                  <text
                    x="13"
                    y="17"
                    textAnchor="middle"
                    fontFamily="'Iowan Old Style', 'Palatino Linotype', Georgia, serif"
                    fontStyle="italic"
                    fontSize="11"
                    fontWeight="500"
                    fill="currentColor"
                  >
                    {VOICE_LETTER[v]}
                  </text>
                </svg>
              </span>
              <span className="daybreak__voice-stack">
                <em className="daybreak__voice-name">{VOICE_NAME[v]}</em>
                <span className="daybreak__voice-face">{VOICE_FACE[v]}</span>
                <span className="daybreak__voice-note">{VOICE_NOTE[v]}</span>
              </span>
              <span
                className={`daybreak__voice-line daybreak__voice-line--${v}`}
                aria-hidden="true"
                style={{
                  fontFamily: VOICE_FAMILY[v],
                  fontStyle: VOICE_STYLE[v],
                  fontWeight: VOICE_WEIGHT[v],
                  letterSpacing: VOICE_TRACKING[v],
                  textTransform: VOICE_TRANSFORM[v],
                }}
              >
                {VOICE_LINE[v]}
              </span>
              <span className="daybreak__voice-mark" aria-hidden="true">
                <span className="daybreak__voice-mark-glyph">{VOICE_GLYPH[v]}</span>
                <em>{VOICE_MARK[v]}</em>
              </span>
              {i < ORDER.length - 1 && (
                <span className="daybreak__voice-cord" aria-hidden="true">
                  <svg viewBox="0 0 24 8" preserveAspectRatio="none">
                    <line x1="0" y1="4" x2="24" y2="4" stroke="currentColor" strokeWidth=".4" strokeDasharray=".6 1.6" opacity=".55" />
                    <circle cx="12" cy="4" r=".9" fill="currentColor" opacity=".7" />
                  </svg>
                </span>
              )}
            </button>
          )
        })}
      </div>

      <span className="daybreak__set-rule" aria-hidden="true">
        <svg viewBox="0 0 720 6" preserveAspectRatio="none" className="daybreak__set-rule-svg">
          <line x1="0" y1="3" x2="360" y2="3" stroke={`url(#${waxId})`} strokeWidth=".55" />
          <line x1="360" y1="3" x2="720" y2="3" stroke={`url(#${waxId})`} strokeWidth=".55" />
          <circle cx="2" cy="3" r="1.1" fill="currentColor" />
          <circle cx="180" cy="3" r="1" fill="currentColor" opacity=".7" />
          <circle cx="360" cy="3" r="2.1" fill="currentColor" />
          <circle cx="360" cy="3" r=".6" fill="var(--night)" />
          <circle cx="540" cy="3" r="1" fill="currentColor" opacity=".7" />
          <circle cx="718" cy="3" r="1.1" fill="currentColor" />
        </svg>
      </span>

      <span className="daybreak__seal" aria-hidden="true">
        <svg viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="58" fill={`url(#${sealGlowId})`} />
          <circle cx="60" cy="60" r="55" fill={`url(#${sealFillId})`} stroke="currentColor" strokeWidth=".95" strokeOpacity=".75" />
          <circle cx="60" cy="60" r="50" fill="none" stroke="currentColor" strokeWidth=".4" strokeDasharray="1 2.4" opacity=".55" />
          <circle cx="60" cy="60" r="42" fill="none" stroke="rgba(255,255,255,0.32)" strokeWidth=".28" />
          <text x="60" y="38" textAnchor="middle" fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace" fontSize="6" letterSpacing="2.6" fill="rgba(8, 10, 18, 0.92)">PRO · ZERO</text>
          <text x="60" y="74" textAnchor="middle" fontFamily="'Iowan Old Style', 'Palatino Linotype', Georgia, serif" fontStyle="italic" fontSize="14" fill="rgba(8, 10, 18, 0.92)">m³</text>
          <text x="60" y="90" textAnchor="middle" fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace" fontSize="4" letterSpacing="2" fill="rgba(8, 10, 18, 0.92)">SET · OPEN</text>
          <circle cx="60" cy="14" r="1.4" fill="rgba(8, 10, 18, 0.85)" />
          <circle cx="60" cy="106" r="1.4" fill="rgba(8, 10, 18, 0.85)" />
          <circle cx="14" cy="60" r="1.4" fill="rgba(8, 10, 18, 0.85)" />
          <circle cx="106" cy="60" r="1.4" fill="rgba(8, 10, 18, 0.85)" />
        </svg>
      </span>

      <footer className="daybreak__ledger" aria-hidden="true">
        <span className="daybreak__ledger-cell">
          <em className="daybreak__ledger-key">set on</em>
          <span className="daybreak__ledger-val">
            <em>{dayName}</em>
            <span aria-hidden="true">·</span>
            <em>{tokens.month} {tokens.day}, {tokens.year}</em>
          </span>
        </span>
        <span className="daybreak__ledger-cell daybreak__ledger-cell--now">
          <em className="daybreak__ledger-key">at first light</em>
          <span className="daybreak__ledger-val">
            <em className="daybreak__ledger-hour">{hour}</em>
            <span aria-hidden="true">·</span>
            <em>voice {VOICE_LETTER[voice]} · {VOICE_NAME[voice]}</em>
          </span>
        </span>
        <span className="daybreak__ledger-cell">
          <em className="daybreak__ledger-key">read in</em>
          <span className="daybreak__ledger-val">
            <em>folio i</em>
            <span aria-hidden="true">·</span>
            <em>the question follows</em>
          </span>
        </span>
      </footer>

      <span className="daybreak__handoff" aria-hidden="true">
        <span className="daybreak__handoff-rule daybreak__handoff-rule--l" />
        <span className="daybreak__handoff-stack">
          <span className="daybreak__handoff-pip" aria-hidden="true">
            <svg viewBox="0 0 14 14">
              <circle cx="7" cy="7" r="5.6" fill="none" stroke="currentColor" strokeWidth=".55" opacity=".78" />
              <circle cx="7" cy="7" r="2.4" fill="currentColor" opacity=".85" />
              <circle cx="7" cy="7" r=".9" fill="var(--night)" />
            </svg>
          </span>
          <em>the broadside, when ready</em>
          <span className="daybreak__handoff-key">folio i</span>
        </span>
        <span className="daybreak__handoff-arrow" aria-hidden="true">
          <svg viewBox="0 0 28 8" preserveAspectRatio="none">
            <line x1="0" y1="4" x2="24" y2="4" stroke="currentColor" strokeWidth=".55" strokeLinecap="round" />
            <path d="M 22 1 L 26 4 L 22 7" fill="none" stroke="currentColor" strokeWidth=".55" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <span className="daybreak__handoff-rule daybreak__handoff-rule--r" />
      </span>

      <span className="daybreak__dust" aria-hidden="true">
        <svg viewBox="0 0 800 280" preserveAspectRatio="xMidYMid meet" className="daybreak__dust-svg">
          <g fill="currentColor" className="daybreak__dust-grains">
            <circle cx="140" cy="64" r=".7" opacity=".5" />
            <circle cx="262" cy="120" r=".5" opacity=".42" />
            <circle cx="378" cy="86" r=".9" opacity=".6" />
            <circle cx="488" cy="148" r=".55" opacity=".42" />
            <circle cx="572" cy="92" r=".7" opacity=".5" />
            <circle cx="682" cy="156" r=".55" opacity=".42" />
            <circle cx="196" cy="194" r=".55" opacity=".42" />
            <circle cx="336" cy="208" r=".9" opacity=".55" />
            <circle cx="504" cy="218" r=".7" opacity=".48" />
            <circle cx="624" cy="266" r=".55" opacity=".42" />
            <circle cx="84" cy="232" r=".55" opacity=".42" />
            <circle cx="734" cy="92" r=".55" opacity=".42" />
          </g>
        </svg>
      </span>

      <span className="daybreak__paper" aria-hidden="true" />

      <span className="sr-only">
        {`The daybreak · m³ press · folio zero · the prologue · the question "${TITLE_FULL}" set in three voices (${VOICE_NAME.quiet}: ${VOICE_LINE.quiet}, ${VOICE_NAME.human}: ${VOICE_LINE.human}, ${VOICE_NAME.bold}: ${VOICE_LINE.bold}) · voice set in ${VOICE_NAME[voice]} (${VOICE_FACE[voice]}) · set on ${setToday} at ${hour} · the broadside follows at folio i.`}
      </span>
    </section>
  )
}