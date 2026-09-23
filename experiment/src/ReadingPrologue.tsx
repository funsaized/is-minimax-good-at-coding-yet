import {
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react'
import type { VoiceId } from './App'

type ReadingPrologueProps = {
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
const VOICE_LINE: Record<VoiceId, string> = {
  quiet: 'is m³ good at frontend yet?',
  human: 'is M3 good at frontend yet?',
  bold: 'IS M3 GOOD AT FRONTEND YET?',
}
const VOICE_NOTE: Record<VoiceId, string> = {
  quiet: 'set softly — that the reader may hear themselves in it',
  human: 'set by hand — that the page may feel less like a page',
  bold: 'set at full height — that the question may be heard once',
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

export function ReadingPrologue({ voice, setToday, onVoice }: ReadingPrologueProps) {
  const baseId = useId().replace(/:/g, '')
  const inkId = `prologue-ink-${baseId}`
  const cordId = `prologue-cord-${baseId}`
  const sealId = `prologue-seal-${baseId}`
  const glowId = `prologue-glow-${baseId}`
  const markFillId = `prologue-mark-fill-${baseId}`

  const rootRef = useRef<HTMLElement | null>(null)
  const [revealed, setRevealed] = useState(false)
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
      return
    }
    const node = rootRef.current
    if (!node) return
    const obs = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setRevealed(true)
            obs.unobserve(entry.target)
          }
        }
      },
      { threshold: 0.06, rootMargin: '0px 0px -4% 0px' },
    )
    obs.observe(node)
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    const id = window.setInterval(() => {
      setHour(plateHour())
      setDayName(DAY_NAME[new Date().getDay()] ?? '')
    }, 30_000)
    return () => window.clearInterval(id)
  }, [])

  const tokens = plateDateTokens(setToday)
  const focus = hovered ?? voice
  const isMarked = (v: VoiceId) => voice === v
  const isHover = (v: VoiceId) => hovered === v

  const handleVoiceKey = (event: ReactKeyboardEvent<HTMLButtonElement>, id: VoiceId) => {
    const idx = ORDER.indexOf(id)
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault()
      const next = ORDER[(idx + 1) % ORDER.length]
      onVoice(next)
      const node = rootRef.current?.querySelector<HTMLButtonElement>(`[data-voice="${next}"]`)
      node?.focus()
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault()
      const next = ORDER[(idx - 1 + ORDER.length) % ORDER.length]
      onVoice(next)
      const node = rootRef.current?.querySelector<HTMLButtonElement>(`[data-voice="${next}"]`)
      node?.focus()
    } else if (event.key === 'Home') {
      event.preventDefault()
      onVoice(ORDER[0])
      rootRef.current?.querySelector<HTMLButtonElement>(`[data-voice="${ORDER[0]}"]`)?.focus()
    } else if (event.key === 'End') {
      event.preventDefault()
      onVoice(ORDER[ORDER.length - 1])
      rootRef.current
        ?.querySelector<HTMLButtonElement>(`[data-voice="${ORDER[ORDER.length - 1]}"]`)
        ?.focus()
    }
  }

  const style = {
    '--pro-tone': `var(--${voice})`,
    '--pro-focus': `var(--${focus})`,
    '--pro-tone-deep': `var(--${voice}-deep)`,
  } as CSSProperties

  const voiceFamily =
    voice === 'bold'
      ? 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif'
      : "'Iowan Old Style', 'Palatino Linotype', 'Book Antiqua', Palatino, Georgia, 'Times New Roman', serif"
  const voiceStyle: 'italic' | 'normal' = voice === 'bold' ? 'normal' : 'italic'
  const voiceWeight = voice === 'bold' ? 800 : voice === 'human' ? 500 : 400
  const voiceTracking = voice === 'bold' ? '-.045em' : voice === 'human' ? '-.016em' : '-.022em'

  return (
    <section
      ref={rootRef}
      id="prologue"
      className={`prologue prologue--${voice} ${revealed ? 'is-revealed' : ''} ${reduceMotion ? 'is-quiet' : ''}`}
      style={style}
      aria-label={`The reading prologue · m³ press · the question "${TITLE_FULL}" · set on ${dayName} ${tokens.month} ${tokens.day}, ${tokens.year} at ${hour} · voice set in ${VOICE_NAME[voice]}.`}
    >
      <svg className="prologue__defs" aria-hidden="true" focusable="false">
        <defs>
          <linearGradient id={inkId} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--pro-tone)" stopOpacity="0" />
            <stop offset="22%" stopColor="var(--pro-tone)" stopOpacity=".55" />
            <stop offset="50%" stopColor="var(--pro-tone)" stopOpacity=".85" />
            <stop offset="78%" stopColor="var(--pro-tone)" stopOpacity=".55" />
            <stop offset="100%" stopColor="var(--pro-tone)" stopOpacity="0" />
          </linearGradient>
          <radialGradient id={glowId} cx="50%" cy="50%" r="55%">
            <stop offset="0%" stopColor="var(--pro-tone)" stopOpacity=".26" />
            <stop offset="55%" stopColor="var(--pro-tone)" stopOpacity=".06" />
            <stop offset="100%" stopColor="var(--pro-tone)" stopOpacity="0" />
          </radialGradient>
          <linearGradient id={cordId} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
            <stop offset="50%" stopColor="currentColor" stopOpacity=".7" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
          <radialGradient id={sealId} cx="50%" cy="40%" r="62%">
            <stop offset="0%" stopColor="currentColor" stopOpacity=".18" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </radialGradient>
          <radialGradient id={markFillId} cx="42%" cy="38%" r="62%">
            <stop
              offset="0%"
              stopColor={
                voice === 'quiet'
                  ? 'rgba(168, 197, 255, 0.55)'
                  : voice === 'human'
                  ? 'rgba(244, 132, 114, 0.6)'
                  : 'rgba(205, 238, 106, 0.6)'
              }
            />
            <stop
              offset="60%"
              stopColor={
                voice === 'quiet'
                  ? 'rgba(120, 158, 240, 0.85)'
                  : voice === 'human'
                  ? 'rgba(216, 80, 64, 0.85)'
                  : 'rgba(168, 214, 50, 0.85)'
              }
            />
            <stop offset="100%" stopColor="rgba(8, 10, 18, 0.85)" />
          </radialGradient>
        </defs>
      </svg>

      <span className="prologue__wash" aria-hidden="true">
        <svg viewBox="0 0 800 480" preserveAspectRatio="xMidYMid meet">
          <rect x="0" y="0" width="800" height="480" fill={`url(#${glowId})`} />
        </svg>
      </span>

      <span className="prologue__paper" aria-hidden="true" />

      <header className="prologue__masthead" aria-hidden="true">
        <span className="prologue__masthead-rule prologue__masthead-rule--l">
          <svg viewBox="0 0 220 10" preserveAspectRatio="none">
            <line x1="0" y1="5" x2="220" y2="5" stroke={`url(#${cordId})`} strokeWidth=".55" />
            <line
              x1="0"
              y1="5"
              x2="220"
              y2="5"
              stroke="currentColor"
              strokeWidth=".3"
              strokeDasharray=".5 2.4"
              opacity=".42"
            />
            <circle cx="2" cy="5" r="1.1" fill="currentColor" />
            <circle cx="110" cy="5" r="1.8" fill="currentColor" />
            <circle cx="110" cy="5" r=".6" fill="var(--night)" />
            <circle cx="218" cy="5" r="1.1" fill="currentColor" />
          </svg>
        </span>
        <span className="prologue__masthead-stack">
          <span className="prologue__masthead-press">
            <span className="prologue__masthead-mark">
              <svg viewBox="0 0 22 22" aria-hidden="true">
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
            <em className="prologue__masthead-name">m³ press</em>
          </span>
          <span className="prologue__masthead-meta">
            <em>folio zero</em>
            <span aria-hidden="true">·</span>
            <em>the reading prologue</em>
            <span aria-hidden="true">·</span>
            <em>{dayName} {tokens.month} {tokens.day}, {tokens.year}</em>
            <span aria-hidden="true">·</span>
            <em>{hour}</em>
          </span>
        </span>
        <span className="prologue__masthead-rule prologue__masthead-rule--r">
          <svg viewBox="0 0 220 10" preserveAspectRatio="none">
            <line x1="0" y1="5" x2="220" y2="5" stroke={`url(#${cordId})`} strokeWidth=".55" />
            <line
              x1="0"
              y1="5"
              x2="220"
              y2="5"
              stroke="currentColor"
              strokeWidth=".3"
              strokeDasharray=".5 2.4"
              opacity=".42"
            />
            <circle cx="2" cy="5" r="1.1" fill="currentColor" />
            <circle cx="110" cy="5" r="1.8" fill="currentColor" />
            <circle cx="110" cy="5" r=".6" fill="var(--night)" />
            <circle cx="218" cy="5" r="1.1" fill="currentColor" />
          </svg>
        </span>
      </header>

      <span className="prologue__eyebrow" aria-hidden="true">
        <span className="prologue__eyebrow-pip">
          <svg viewBox="0 0 14 14">
            <circle cx="7" cy="7" r="5.4" fill="none" stroke="currentColor" strokeWidth=".55" opacity=".78" />
            <circle cx="7" cy="7" r="2.2" fill="currentColor" opacity=".85" />
            <circle cx="7" cy="7" r=".7" fill="var(--night)" />
          </svg>
        </span>
        <em>a single question · set in three voices</em>
        <span aria-hidden="true">·</span>
        <em>the page, kept open</em>
        <span className="prologue__eyebrow-pip prologue__eyebrow-pip--end">
          <svg viewBox="0 0 14 14">
            <circle cx="7" cy="7" r="5.4" fill="none" stroke="currentColor" strokeWidth=".55" opacity=".78" />
            <circle cx="7" cy="7" r="2.2" fill="currentColor" opacity=".85" />
            <circle cx="7" cy="7" r=".7" fill="var(--night)" />
          </svg>
        </span>
      </span>

      <h1 className="prologue__title">
        <span className="prologue__title-frame" aria-hidden="true">
          <svg viewBox="0 0 800 360" preserveAspectRatio="xMidYMid meet">
            <circle cx="120" cy="60" r="14" fill="none" stroke="currentColor" strokeWidth=".55" opacity=".42" />
            <circle cx="680" cy="60" r="14" fill="none" stroke="currentColor" strokeWidth=".55" opacity=".42" />
            <circle cx="120" cy="300" r="14" fill="none" stroke="currentColor" strokeWidth=".55" opacity=".42" />
            <circle cx="680" cy="300" r="14" fill="none" stroke="currentColor" strokeWidth=".55" opacity=".42" />
            <circle cx="120" cy="60" r="2.4" fill="currentColor" />
            <circle cx="680" cy="60" r="2.4" fill="currentColor" />
            <circle cx="120" cy="300" r="2.4" fill="currentColor" />
            <circle cx="680" cy="300" r="2.4" fill="currentColor" />
            <line x1="134" y1="60" x2="666" y2="60" stroke="currentColor" strokeWidth=".3" strokeDasharray=".5 2" opacity=".32" />
            <line x1="134" y1="300" x2="666" y2="300" stroke="currentColor" strokeWidth=".3" strokeDasharray=".5 2" opacity=".32" />
            <line x1="120" y1="74" x2="120" y2="286" stroke="currentColor" strokeWidth=".3" strokeDasharray=".5 2" opacity=".32" />
            <line x1="680" y1="74" x2="680" y2="286" stroke="currentColor" strokeWidth=".3" strokeDasharray=".5 2" opacity=".32" />
          </svg>
        </span>
        <span className="prologue__title-row prologue__title-row--a">
          <span className="prologue__title-lead">is</span>
          <span className="prologue__title-m3">
            <span className="prologue__title-word-text" style={{ fontFamily: voiceFamily, fontStyle: voiceStyle, fontWeight: voiceWeight, letterSpacing: voiceTracking }}>
              m<sup>3</sup>
            </span>
          </span>
          <span className="prologue__title-good">
            <span className="prologue__title-word-text" style={{ fontFamily: voiceFamily, fontStyle: voiceStyle, fontWeight: voiceWeight, letterSpacing: voiceTracking }}>
              good at
            </span>
          </span>
        </span>
        <span className="prologue__title-row prologue__title-row--b">
          <span className="prologue__title-front">
            <span className="prologue__title-word-text" style={{ fontFamily: voiceFamily, fontStyle: voiceStyle, fontWeight: voiceWeight, letterSpacing: voiceTracking }}>
              frontend
            </span>
          </span>
          <span className="prologue__title-yet">
            <span className="prologue__title-word-text" style={{ fontFamily: voiceFamily, fontStyle: voiceStyle, fontWeight: voiceWeight, letterSpacing: voiceTracking }}>
              yet
            </span>
            <span className="prologue__title-punct" aria-hidden="true">
              <span className="prologue__title-punct-mark">?</span>
            </span>
          </span>
        </span>
      </h1>

      <span className="prologue__hand" aria-hidden="true">
        <svg viewBox="0 0 120 70" className="prologue__hand-svg">
          <path
            className="prologue__hand-stroke"
            d="M 4 38 C 22 30, 38 26, 52 30 C 64 33, 72 40, 80 44 C 88 48, 96 50, 106 46 C 110 44, 112 40, 110 36"
            fill="none"
            stroke="currentColor"
            strokeWidth=".7"
            strokeLinecap="round"
          />
          <circle className="prologue__hand-bead" cx="4" cy="38" r="1.6" fill="currentColor" />
          <circle className="prologue__hand-bead prologue__hand-bead--tip" cx="110" cy="36" r="2.1" fill="currentColor" />
          <circle cx="110" cy="36" r=".6" fill="var(--night)" />
        </svg>
      </span>

      <span className="prologue__inkwell" aria-hidden="true">
        <span className="prologue__inkwell-key">a hand, three readings, one line</span>
      </span>

      <div
        className="prologue__voices"
        role="group"
        aria-label="The three voices · click or use arrow keys to set the line"
      >
        {ORDER.map((v, i) => {
          const isActive = isMarked(v)
          const isHovering = isHover(v)
          const rowStyle = { '--row-tone': `var(--${v})` } as CSSProperties
          return (
            <button
              key={v}
              type="button"
              data-voice={v}
              className={`prologue__voice prologue__voice--${v} ${isActive ? 'is-active' : ''} ${isHovering ? 'is-hover' : ''}`}
              style={rowStyle}
              onClick={() => onVoice(v)}
              onMouseEnter={() => setHovered(v)}
              onMouseLeave={() => setHovered(prev => (prev === v ? null : prev))}
              onFocus={() => setHovered(v)}
              onBlur={() => setHovered(prev => (prev === v ? null : prev))}
              onKeyDown={event => handleVoiceKey(event, v)}
              aria-pressed={voice === v}
              aria-label={`Set the line in ${VOICE_NAME[v]} — ${VOICE_FACE[v]}. ${VOICE_NOTE[v]}.`}
            >
              <span className="prologue__voice-letter" aria-hidden="true">
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
              <span className="prologue__voice-stack">
                <em className="prologue__voice-name">{VOICE_NAME[v]}</em>
                <span className="prologue__voice-face">{VOICE_FACE[v]}</span>
              </span>
              <span className={`prologue__voice-line prologue__voice-line--${v}`} aria-hidden="true">
                {VOICE_LINE[v]}
              </span>
              <span className="prologue__voice-mark" aria-hidden="true">
                <span className="prologue__voice-mark-glyph">{VOICE_GLYPH[v]}</span>
                <em>{v === 'quiet' ? 'stet' : v === 'human' ? 'caret' : 'query'}</em>
              </span>
              {i < ORDER.length - 1 && (
                <span className="prologue__voice-cord" aria-hidden="true">
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

      <span className="prologue__set-rule" aria-hidden="true">
        <svg viewBox="0 0 720 6" preserveAspectRatio="none" className="prologue__set-rule-svg">
          <line x1="0" y1="3" x2="360" y2="3" stroke={`url(#${inkId})`} strokeWidth=".55" />
          <line x1="360" y1="3" x2="720" y2="3" stroke={`url(#${inkId})`} strokeWidth=".55" />
          <circle cx="2" cy="3" r="1.1" fill="currentColor" />
          <circle cx="180" cy="3" r="1" fill="currentColor" opacity=".7" />
          <circle cx="360" cy="3" r="2.1" fill="currentColor" />
          <circle cx="360" cy="3" r=".6" fill="var(--night)" />
          <circle cx="540" cy="3" r="1" fill="currentColor" opacity=".7" />
          <circle cx="718" cy="3" r="1.1" fill="currentColor" />
        </svg>
      </span>

      <span className="prologue__press-seal" aria-hidden="true">
        <svg viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="58" fill={`url(#${sealId})`} />
          <circle cx="60" cy="60" r="55" fill={`url(#${markFillId})`} stroke="currentColor" strokeWidth=".95" strokeOpacity=".78" />
          <circle cx="60" cy="60" r="50" fill="none" stroke="currentColor" strokeWidth=".4" strokeDasharray="1 2.4" opacity=".55" />
          <circle cx="60" cy="60" r="42" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth=".28" />
          <text
            x="60"
            y="38"
            textAnchor="middle"
            fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
            fontSize="6"
            letterSpacing="2.6"
            fill="rgba(8, 10, 18, 0.92)"
          >
            PRO · ONE
          </text>
          <text
            x="60"
            y="74"
            textAnchor="middle"
            fontFamily="'Iowan Old Style', 'Palatino Linotype', Georgia, serif"
            fontStyle="italic"
            fontSize="14"
            fill="rgba(8, 10, 18, 0.92)"
          >
            m³
          </text>
          <text
            x="60"
            y="90"
            textAnchor="middle"
            fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
            fontSize="4"
            letterSpacing="2"
            fill="rgba(8, 10, 18, 0.92)"
          >
            SET · OPEN
          </text>
          <circle cx="60" cy="14" r="1.4" fill="rgba(8, 10, 18, 0.85)" />
          <circle cx="60" cy="106" r="1.4" fill="rgba(8, 10, 18, 0.85)" />
          <circle cx="14" cy="60" r="1.4" fill="rgba(8, 10, 18, 0.85)" />
          <circle cx="106" cy="60" r="1.4" fill="rgba(8, 10, 18, 0.85)" />
        </svg>
      </span>

      <footer className="prologue__ledger" aria-hidden="true">
        <span className="prologue__ledger-cell">
          <em className="prologue__ledger-key">set today</em>
          <span className="prologue__ledger-val">
            <em>{dayName}</em>
            <span aria-hidden="true">·</span>
            <em>{tokens.month} {tokens.day}, {tokens.year}</em>
          </span>
        </span>
        <span className="prologue__ledger-cell prologue__ledger-cell--now">
          <em className="prologue__ledger-key">at first light</em>
          <span className="prologue__ledger-val">
            <em className="prologue__ledger-hour">{hour}</em>
            <span aria-hidden="true">·</span>
            <em>voice {VOICE_LETTER[voice]} · {VOICE_NAME[voice]}</em>
          </span>
        </span>
        <span className="prologue__ledger-cell">
          <em className="prologue__ledger-key">read in</em>
          <span className="prologue__ledger-val">
            <em>folio i</em>
            <span aria-hidden="true">·</span>
            <em>the question follows</em>
          </span>
        </span>
      </footer>

      <span className="prologue__handoff" aria-hidden="true">
        <span className="prologue__handoff-rule prologue__handoff-rule--l" />
        <span className="prologue__handoff-stack">
          <span className="prologue__handoff-pip" aria-hidden="true">
            <svg viewBox="0 0 14 14">
              <circle cx="7" cy="7" r="5.6" fill="none" stroke="currentColor" strokeWidth=".55" opacity=".78" />
              <circle cx="7" cy="7" r="2.4" fill="currentColor" opacity=".85" />
              <circle cx="7" cy="7" r=".9" fill="var(--night)" />
            </svg>
          </span>
          <em>the broadside, when ready</em>
          <span className="prologue__handoff-key">folio i</span>
        </span>
        <span className="prologue__handoff-arrow" aria-hidden="true">
          <svg viewBox="0 0 28 8" preserveAspectRatio="none">
            <line x1="0" y1="4" x2="24" y2="4" stroke="currentColor" strokeWidth=".55" strokeLinecap="round" />
            <path d="M 22 1 L 26 4 L 22 7" fill="none" stroke="currentColor" strokeWidth=".55" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <span className="prologue__handoff-rule prologue__handoff-rule--r" />
      </span>

      <span className="prologue__dust" aria-hidden="true">
        <svg viewBox="0 0 800 320" preserveAspectRatio="xMidYMid meet">
          <g fill="currentColor">
            <circle cx="120" cy="64" r=".7" opacity=".5" />
            <circle cx="240" cy="120" r=".5" opacity=".42" />
            <circle cx="356" cy="86" r=".9" opacity=".6" />
            <circle cx="468" cy="148" r=".55" opacity=".42" />
            <circle cx="556" cy="92" r=".7" opacity=".5" />
            <circle cx="664" cy="156" r=".55" opacity=".42" />
            <circle cx="180" cy="194" r=".55" opacity=".42" />
            <circle cx="316" cy="208" r=".9" opacity=".55" />
            <circle cx="488" cy="218" r=".7" opacity=".48" />
            <circle cx="612" cy="266" r=".55" opacity=".42" />
            <circle cx="76" cy="232" r=".55" opacity=".42" />
            <circle cx="724" cy="92" r=".55" opacity=".42" />
            <circle cx="402" cy="44" r=".5" opacity=".4" />
            <circle cx="294" cy="280" r=".6" opacity=".45" />
          </g>
        </svg>
      </span>

      <span className="sr-only">
        {`The reading prologue · m³ press · folio zero · the question "${TITLE_FULL}" set in three voices (${VOICE_NAME.quiet}, ${VOICE_NAME.human}, ${VOICE_NAME.bold}) · voice set in ${VOICE_NAME[voice]} (${VOICE_FACE[voice]}) · set on ${setToday} at ${hour} · the broadside follows at folio i.`}
      </span>
    </section>
  )
}
