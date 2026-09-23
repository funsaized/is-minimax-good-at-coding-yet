import {
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
} from 'react'
import type { VoiceId } from './App'

type TitlePlateProps = {
  voice: VoiceId
  setToday: string
  onVoice?: (voice: VoiceId) => void
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
const VOICE_LINE: Record<VoiceId, string> = {
  quiet: 'is m³ good at frontend yet?',
  human: 'is M3 good at frontend yet?',
  bold: 'IS M3 GOOD AT FRONTEND YET?',
}

const ORDER: VoiceId[] = ['quiet', 'human', 'bold']

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
  return `${h}:${m.toString().padStart(2, '0')} ${ampm}`
}

const DAY_NAME: Record<number, string> = {
  0: 'sunday',
  1: 'monday',
  2: 'tuesday',
  3: 'wednesday',
  4: 'thursday',
  5: 'friday',
  6: 'saturday',
}

export function TitlePlate({ voice, setToday, onVoice }: TitlePlateProps) {
  const baseId = useId().replace(/:/g, '')
  const haloId = `tp-halo-${baseId}`
  const cordId = `tp-cord-${baseId}`
  const sealGlowId = `tp-seal-glow-${baseId}`
  const sealFillId = `tp-seal-fill-${baseId}`

  const rootRef = useRef<HTMLElement | null>(null)
  const [revealed, setRevealed] = useState(false)
  const [reduceMotion, setReduceMotion] = useState(false)
  const [hovered, setHovered] = useState<VoiceId | null>(null)
  const [hour, setHour] = useState(() => plateHour())
  const [dayName, setDayName] = useState<string>(() => DAY_NAME[new Date().getDay()] ?? '')

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
      { threshold: 0.08, rootMargin: '0px 0px -4% 0px' },
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

  const setVoiceFromClick = (next: VoiceId) => {
    onVoice?.(next)
  }

  const style = {
    '--tp-tone': `var(--${voice})`,
    '--tp-focus': `var(--${focus})`,
    '--tp-tone-deep': `var(--${voice}-deep)`,
  } as CSSProperties

  return (
    <section
      ref={rootRef}
      className={`title-plate title-plate--${voice} ${revealed ? 'is-revealed' : ''} ${reduceMotion ? 'is-quiet' : ''}`}
      style={style}
      aria-label={`The title plate · m³ press · folio 0 · the broadside · set ${setToday} at ${hour} · ${VOICE_NAME[voice]}.`}
    >
      <svg className="title-plate__defs" aria-hidden="true" focusable="false">
        <defs>
          <radialGradient id={haloId} cx="50%" cy="50%" r="55%">
            <stop offset="0%" stopColor="var(--tp-focus)" stopOpacity=".22" />
            <stop offset="60%" stopColor="var(--tp-focus)" stopOpacity=".06" />
            <stop offset="100%" stopColor="var(--tp-focus)" stopOpacity="0" />
          </radialGradient>
          <linearGradient id={cordId} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
            <stop offset="20%" stopColor="currentColor" stopOpacity=".55" />
            <stop offset="50%" stopColor="currentColor" stopOpacity=".85" />
            <stop offset="80%" stopColor="currentColor" stopOpacity=".55" />
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

      <span className="title-plate__halo" aria-hidden="true">
        <svg viewBox="0 0 800 480" preserveAspectRatio="xMidYMid meet">
          <rect x="0" y="0" width="800" height="480" fill={`url(#${haloId})`} />
        </svg>
      </span>

      <span className="title-plate__seal" aria-hidden="true">
        <svg viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="58" fill={`url(#${sealGlowId})`} />
          <circle cx="60" cy="60" r="55" fill={`url(#${sealFillId})`} stroke="currentColor" strokeWidth=".95" strokeOpacity=".75" />
          <circle cx="60" cy="60" r="50" fill="none" stroke="currentColor" strokeWidth=".4" strokeDasharray="1 2.4" opacity=".55" />
          <circle cx="60" cy="60" r="42" fill="none" stroke="rgba(255, 255, 255, 0.32)" strokeWidth=".28" />
          <circle cx="60" cy="60" r="34" fill="none" stroke="rgba(255, 255, 255, 0.16)" strokeWidth=".22" />

          <text x="60" y="38" textAnchor="middle" fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace" fontSize="6" letterSpacing="2.6" fill="rgba(8, 10, 18, 0.92)">
            SET · OPEN
          </text>
          <text x="60" y="74" textAnchor="middle" fontFamily="'Iowan Old Style', 'Palatino Linotype', Georgia, serif" fontStyle="italic" fontSize="14" fill="rgba(8, 10, 18, 0.92)">
            m³
          </text>
          <text x="60" y="90" textAnchor="middle" fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace" fontSize="4" letterSpacing="2" fill="rgba(8, 10, 18, 0.92)">
            FOLIO · 0
          </text>
          <circle cx="60" cy="14" r="1.4" fill="rgba(8, 10, 18, 0.85)" />
          <circle cx="60" cy="106" r="1.4" fill="rgba(8, 10, 18, 0.85)" />
          <circle cx="14" cy="60" r="1.4" fill="rgba(8, 10, 18, 0.85)" />
          <circle cx="106" cy="60" r="1.4" fill="rgba(8, 10, 18, 0.85)" />
          <path d="M30 30 Q40 38 36 50 Q30 60 36 70 Q44 80 36 90" fill="none" stroke="rgba(8, 10, 18, 0.16)" strokeWidth=".55" />
          <path d="M90 30 Q80 38 84 50 Q90 60 84 70 Q76 80 84 90" fill="none" stroke="rgba(8, 10, 18, 0.16)" strokeWidth=".55" />
        </svg>
      </span>

      <header className="title-plate__crest" aria-hidden="true">
        <span className="title-plate__crest-rule title-plate__crest-rule--l">
          <svg viewBox="0 0 220 10" preserveAspectRatio="none">
            <line x1="0" y1="5" x2="220" y2="5" stroke={`url(#${cordId})`} strokeWidth=".55" />
            <circle cx="2" cy="5" r="1.1" fill="currentColor" />
            <circle cx="218" cy="5" r="1.1" fill="currentColor" />
          </svg>
        </span>
        <span className="title-plate__crest-stack">
          <span className="title-plate__crest-press">
            <span className="title-plate__crest-mark">
              <svg viewBox="0 0 18 18" aria-hidden="true">
                <circle cx="9" cy="9" r="7.4" fill="none" stroke="currentColor" strokeWidth=".55" opacity=".85" />
                <circle cx="9" cy="9" r="4.6" fill="none" stroke="currentColor" strokeWidth=".32" strokeDasharray=".7 1.4" opacity=".6" />
                <circle cx="9" cy="9" r="1.8" fill="currentColor" opacity=".9" />
                <circle cx="9" cy="9" r=".6" fill="var(--night)" />
                <line x1="9" y1="0.5" x2="9" y2="2.4" stroke="currentColor" strokeWidth=".5" strokeLinecap="round" opacity=".75" />
                <line x1="9" y1="15.6" x2="9" y2="17.5" stroke="currentColor" strokeWidth=".5" strokeLinecap="round" opacity=".75" />
              </svg>
            </span>
            <em className="title-plate__crest-name">m³ press</em>
          </span>
          <span className="title-plate__crest-meta">
            <em>folio 0</em>
            <span aria-hidden="true">·</span>
            <em>the broadside</em>
            <span aria-hidden="true">·</span>
            <em>{dayName} {tokens.month} {tokens.day}, {tokens.year}</em>
          </span>
        </span>
        <span className="title-plate__crest-rule title-plate__crest-rule--r">
          <svg viewBox="0 0 220 10" preserveAspectRatio="none">
            <line x1="0" y1="5" x2="220" y2="5" stroke={`url(#${cordId})`} strokeWidth=".55" />
            <circle cx="2" cy="5" r="1.1" fill="currentColor" />
            <circle cx="218" cy="5" r="1.1" fill="currentColor" />
          </svg>
        </span>
      </header>

      <span className="title-plate__eyebrow" aria-hidden="true">
        <span className="title-plate__eyebrow-mark" aria-hidden="true">
          <svg viewBox="0 0 14 14">
            <circle cx="7" cy="7" r="5.4" fill="none" stroke="currentColor" strokeWidth=".55" opacity=".78" />
            <circle cx="7" cy="7" r="2.2" fill="currentColor" opacity=".85" />
            <circle cx="7" cy="7" r=".7" fill="var(--night)" />
          </svg>
        </span>
        <em>a single line, set three ways</em>
        <span aria-hidden="true">·</span>
        <em>the question, kept open</em>
        <span className="title-plate__eyebrow-mark title-plate__eyebrow-mark--end" aria-hidden="true">
          <svg viewBox="0 0 14 14">
            <circle cx="7" cy="7" r="5.4" fill="none" stroke="currentColor" strokeWidth=".55" opacity=".78" />
            <circle cx="7" cy="7" r="2.2" fill="currentColor" opacity=".85" />
            <circle cx="7" cy="7" r=".7" fill="var(--night)" />
          </svg>
        </span>
      </span>

      <h1 className="title-plate__headline">
        <span className="title-plate__headline-row title-plate__headline-row--a">
          <span className="title-plate__lead" aria-hidden="true">is</span>
          <span className="title-plate__word title-plate__word--m3">
            <span className="title-plate__word-eyebrow" aria-hidden="true">a habit, set as</span>
            <span className={`title-plate__word-text title-plate__word-text--${voice}`} aria-hidden="true">m<sup>3</sup></span>
            <span className="title-plate__word-underline" aria-hidden="true">
              <svg viewBox="0 0 200 6" preserveAspectRatio="none">
                <line x1="2" y1="3.2" x2="190" y2="3.2" stroke="currentColor" strokeWidth=".45" strokeDasharray="1.1 1.8" strokeLinecap="round" opacity=".55" />
                <circle cx="2" cy="3.2" r="1" fill="currentColor" opacity=".8" />
                <circle cx="190" cy="3.2" r="1" fill="currentColor" opacity=".8" />
              </svg>
            </span>
          </span>
          <span className="title-plate__word title-plate__word--good">
            <span className="title-plate__word-eyebrow" aria-hidden="true">the verb, kept</span>
            <span className={`title-plate__word-text title-plate__word-text--${voice}`} aria-hidden="true">good at</span>
            <span className="title-plate__word-underline" aria-hidden="true">
              <svg viewBox="0 0 200 6" preserveAspectRatio="none">
                <line x1="2" y1="3.2" x2="190" y2="3.2" stroke="currentColor" strokeWidth=".45" strokeDasharray="1.1 1.8" strokeLinecap="round" opacity=".55" />
                <circle cx="2" cy="3.2" r="1" fill="currentColor" opacity=".8" />
                <circle cx="190" cy="3.2" r="1" fill="currentColor" opacity=".8" />
              </svg>
            </span>
          </span>
        </span>
        <span className="title-plate__headline-row title-plate__headline-row--b">
          <span className={`title-plate__plain title-plate__plain--${voice}`} aria-hidden="true">
            <span className="title-plate__plain-line" aria-hidden="true">
              <svg viewBox="0 0 200 6" preserveAspectRatio="none">
                <line x1="2" y1="3.2" x2="190" y2="3.2" stroke="currentColor" strokeWidth=".45" strokeDasharray=".6 1.6" strokeLinecap="round" opacity=".4" />
              </svg>
            </span>
            frontend
          </span>
          <span className="title-plate__word title-plate__word--yet">
            <span className="title-plate__word-eyebrow" aria-hidden="true">the pause, opened as</span>
            <span className={`title-plate__word-text title-plate__word-text--${voice}`} aria-hidden="true">
              yet<span className={`title-plate__punct title-plate__punct--${voice}`} aria-hidden="true">?</span>
            </span>
            <span className="title-plate__word-underline title-plate__word-underline--yet" aria-hidden="true">
              <svg viewBox="0 0 200 6" preserveAspectRatio="none">
                <line x1="2" y1="3.2" x2="190" y2="3.2" stroke="currentColor" strokeWidth=".6" strokeLinecap="round" />
                <circle cx="2" cy="3.2" r="1.4" fill="currentColor" />
                <circle cx="190" cy="3.2" r="1.4" fill="currentColor" />
              </svg>
            </span>
          </span>
        </span>
      </h1>

      <span className="title-plate__rule" aria-hidden="true">
        <span className="title-plate__rule-line" />
        <span className="title-plate__rule-mark">
          <svg viewBox="0 0 32 8" preserveAspectRatio="none">
            <line x1="0" y1="4" x2="12" y2="4" stroke="currentColor" strokeWidth=".4" strokeDasharray=".5 1.8" opacity=".55" />
            <circle cx="16" cy="4" r="1.8" fill="currentColor" />
            <circle cx="16" cy="4" r=".6" fill="var(--night)" />
            <line x1="20" y1="4" x2="32" y2="4" stroke="currentColor" strokeWidth=".4" strokeDasharray=".5 1.8" opacity=".55" />
          </svg>
        </span>
        <span className="title-plate__rule-line" />
      </span>

      <div
        className="title-plate__voices"
        role="group"
        aria-label="The three voices · click or use arrow keys to read the title in each voice"
      >
        {ORDER.map((v) => {
          const isActive = voice === v
          const isHover = hovered === v
          const rowStyle = { '--row-tone': `var(--${v})` } as CSSProperties
          return (
            <button
              key={v}
              type="button"
              className={`title-plate__voice title-plate__voice--${v} ${isActive ? 'is-active' : ''} ${isHover ? 'is-hover' : ''}`}
              style={rowStyle}
              onClick={() => setVoiceFromClick(v)}
              onMouseEnter={() => setHovered(v)}
              onMouseLeave={() => setHovered(prev => (prev === v ? null : prev))}
              onFocus={() => setHovered(v)}
              onBlur={() => setHovered(prev => (prev === v ? null : prev))}
              aria-pressed={voice === v}
              aria-label={`Read the title in ${VOICE_NAME[v]} — ${VOICE_FACE[v]}. Mark: ${VOICE_MARK[v]}.`}
            >
              <span className="title-plate__voice-letter" aria-hidden="true">{VOICE_LETTER[v]}</span>
              <span className="title-plate__voice-stack">
                <em className="title-plate__voice-name">{VOICE_NAME[v]}</em>
                <span className="title-plate__voice-face">{VOICE_FACE[v]}</span>
              </span>
              <span className={`title-plate__voice-line title-plate__voice-line--${v}`} aria-hidden="true">
                {VOICE_LINE[v]}
              </span>
              <span className="title-plate__voice-mark" aria-hidden="true">
                <span className="title-plate__voice-mark-glyph">{VOICE_GLYPH[v]}</span>
                <em>{VOICE_MARK[v]}</em>
              </span>
            </button>
          )
        })}
      </div>

      <footer className="title-plate__ledger" aria-hidden="true">
        <span className="title-plate__ledger-cell">
          <em className="title-plate__ledger-key">set on</em>
          <span className="title-plate__ledger-val">
            <em>{dayName}</em>
            <span aria-hidden="true">·</span>
            <em>{tokens.month} {tokens.day}, {tokens.year}</em>
          </span>
        </span>
        <span className="title-plate__ledger-cell title-plate__ledger-cell--now">
          <em className="title-plate__ledger-key">at first light</em>
          <span className="title-plate__ledger-val">
            <em className="title-plate__ledger-hour">{hour}</em>
            <span aria-hidden="true">·</span>
            <em>voice {VOICE_LETTER[voice]} · {VOICE_NAME[voice]}</em>
          </span>
        </span>
        <span className="title-plate__ledger-cell">
          <em className="title-plate__ledger-key">read in</em>
          <span className="title-plate__ledger-val">
            <em>folio i</em>
            <span aria-hidden="true">·</span>
            <em>the question follows</em>
          </span>
        </span>
      </footer>

      <span className="title-plate__paper" aria-hidden="true" />

      <span className="title-plate__handoff" aria-hidden="true">
        <span className="title-plate__handoff-rule title-plate__handoff-rule--l" />
        <span className="title-plate__handoff-stack">
          <span className="title-plate__handoff-pip" aria-hidden="true">
            <svg viewBox="0 0 14 14">
              <circle cx="7" cy="7" r="5.4" fill="none" stroke="currentColor" strokeWidth=".55" opacity=".78" />
              <circle cx="7" cy="7" r="2.2" fill="currentColor" opacity=".85" />
              <circle cx="7" cy="7" r=".7" fill="var(--night)" />
            </svg>
          </span>
          <em>the question, when ready</em>
          <span className="title-plate__handoff-key">folio i</span>
        </span>
        <span className="title-plate__handoff-arrow" aria-hidden="true">
          <svg viewBox="0 0 28 8" preserveAspectRatio="none">
            <line x1="0" y1="4" x2="24" y2="4" stroke="currentColor" strokeWidth=".55" strokeLinecap="round" />
            <path d="M 22 1 L 26 4 L 22 7" fill="none" stroke="currentColor" strokeWidth=".55" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <span className="title-plate__handoff-rule title-plate__handoff-rule--r" />
      </span>

      <span className="title-plate__dust" aria-hidden="true">
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
          </g>
        </svg>
      </span>

      <span className="sr-only">
        {`The title plate · m³ press · folio 0 · the broadside · set on ${setToday} at ${hour} · the question "is Minimax M3 good at frontend yet?" is set three ways (${VOICE_NAME.quiet}, ${VOICE_NAME.human}, ${VOICE_NAME.bold}) · the question follows at folio i.`}
      </span>
    </section>
  )
}