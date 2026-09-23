import {
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
} from 'react'
import type { VoiceId } from './App'

type HalfTitleProps = {
  voice: VoiceId
  setToday: string
  onVoice?: (voice: VoiceId) => void
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

const ORDER: VoiceId[] = ['quiet', 'human', 'bold']

const TITLE_FULL = 'is Minimax M3 good at frontend yet?'
const TITLE_LINE_A = 'is Minimax M³'
const TITLE_LINE_B = 'good at frontend'
const TITLE_LINE_C = 'yet?'

export function HalfTitle({ voice, setToday, onVoice }: HalfTitleProps) {
  const baseId = useId().replace(/:/g, '')
  const skyId = `daybreak-sky-${baseId}`
  const orbId = `daybreak-orb-${baseId}`
  const orbCoreId = `daybreak-orb-core-${baseId}`
  const horizonGlowId = `daybreak-horizon-glow-${baseId}`
  const rayId = `daybreak-ray-${baseId}`
  const waxId = `daybreak-wax-${baseId}`

  const rootRef = useRef<HTMLElement | null>(null)
  const [revealed, setRevealed] = useState(false)
  const [orbRise, setOrbRise] = useState(false)
  const [orbSet, setOrbSet] = useState(false)
  const [reduceMotion, setReduceMotion] = useState(false)
  const [hour, setHour] = useState(() => plateHour())
  const [dayName, setDayName] = useState<string>(() => {
    const d = new Date().getDay()
    return DAY_NAME[d] ?? ''
  })
  const [hovered, setHovered] = useState<VoiceId | null>(null)

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
      setOrbSet(true)
      return
    }
    const node = rootRef.current
    if (!node) return
    const obs = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setRevealed(true)
            const riseDelay = reduceMotion ? 0 : 220
            const setDelay = reduceMotion ? 0 : 720
            window.setTimeout(() => setOrbRise(true), riseDelay)
            window.setTimeout(() => setOrbSet(true), setDelay)
            obs.unobserve(entry.target)
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' },
    )
    obs.observe(node)
    return () => obs.disconnect()
  }, [reduceMotion])

  useEffect(() => {
    const id = window.setInterval(() => {
      setHour(plateHour())
      const d = new Date()
      setDayName(DAY_NAME[d.getDay()] ?? '')
    }, 30_000)
    return () => window.clearInterval(id)
  }, [])

  const tokens = plateDateTokens(setToday)
  const focus = hovered ?? voice

  const style = {
    '--ht2-tone': `var(--${voice})`,
    '--ht2-tone-deep': `var(--${voice}-deep)`,
    '--ht2-focus': `var(--${focus})`,
  } as CSSProperties

  const focusVoice = (id: VoiceId) => {
    setHovered(id)
  }

  const blurVoice = (id: VoiceId) => {
    setHovered(prev => (prev === id ? null : prev))
  }

  const selectVoice = (id: VoiceId) => {
    onVoice?.(id)
  }

  return (
    <section
      ref={rootRef}
      className={`half-title half-title--${voice} ${revealed ? 'is-revealed' : ''} ${orbRise ? 'is-rise' : ''} ${orbSet ? 'is-set' : ''} ${reduceMotion ? 'is-quiet' : ''}`}
      style={style}
      aria-label={`Daybreak · ${TITLE_FULL} · set on ${dayName} ${tokens.month} ${tokens.day}, ${tokens.year} at ${hour}.`}
    >
      <svg className="half-title__defs" aria-hidden="true" focusable="false">
        <defs>
          <linearGradient id={skyId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--ht2-tone)" stopOpacity=".16" />
            <stop offset="48%" stopColor="var(--ht2-tone)" stopOpacity=".04" />
            <stop offset="100%" stopColor="var(--ht2-tone)" stopOpacity="0" />
          </linearGradient>
          <radialGradient id={orbId} cx="50%" cy="42%" r="58%">
            <stop offset="0%" stopColor="rgba(255, 248, 226, .98)" />
            <stop offset="46%" stopColor="rgba(255, 226, 184, .74)" />
            <stop offset="82%" stopColor="rgba(244, 198, 152, .22)" />
            <stop offset="100%" stopColor="rgba(244, 198, 152, 0)" />
          </radialGradient>
          <radialGradient id={orbCoreId} cx="50%" cy="42%" r="48%">
            <stop offset="0%" stopColor="rgba(255, 252, 234, .98)" />
            <stop offset="60%" stopColor="rgba(255, 240, 210, .7)" />
            <stop offset="100%" stopColor="rgba(255, 232, 192, 0)" />
          </radialGradient>
          <radialGradient id={horizonGlowId} cx="50%" cy="100%" r="62%">
            <stop offset="0%" stopColor="var(--ht2-tone)" stopOpacity=".22" />
            <stop offset="50%" stopColor="var(--ht2-tone)" stopOpacity=".06" />
            <stop offset="100%" stopColor="var(--ht2-tone)" stopOpacity="0" />
          </radialGradient>
          <radialGradient id={rayId} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--ht2-tone)" stopOpacity=".42" />
            <stop offset="80%" stopColor="var(--ht2-tone)" stopOpacity="0" />
          </radialGradient>
          <linearGradient id={waxId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--ht2-tone)" stopOpacity=".34" />
            <stop offset="60%" stopColor="var(--ht2-tone)" stopOpacity=".12" />
            <stop offset="100%" stopColor="var(--ht2-tone)" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      <span className="half-title__plate" aria-hidden="true">
        <svg viewBox="0 0 800 540" preserveAspectRatio="xMidYMid meet" className="half-title__plate-svg">
          <rect x="0" y="0" width="800" height="540" fill={`url(#${skyId})`} />
          <rect x="0" y="430" width="800" height="110" fill={`url(#${horizonGlowId})`} />
          <line x1="0" y1="430" x2="800" y2="430" stroke="currentColor" strokeWidth=".55" opacity=".4" />
          <line x1="0" y1="436" x2="800" y2="436" stroke="currentColor" strokeWidth=".32" strokeDasharray="1.2 2.4" opacity=".32" />
        </svg>
      </span>

      <div className="half-title__stage" aria-hidden="true">
        <svg viewBox="0 0 600 360" preserveAspectRatio="xMidYMax meet" className="half-title__stage-svg">
          <g className="half-title__rays">
            {Array.from({ length: 13 }).map((_, i) => {
              const a = (-90 + (i - 6) * 11) * (Math.PI / 180)
              const x1 = 300 + Math.cos(a) * 132
              const y1 = 318 + Math.sin(a) * 132
              const x2 = 300 + Math.cos(a) * 196
              const y2 = 318 + Math.sin(a) * 196
              return (
                <line
                  key={`ray-${i}`}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={`url(#${rayId})`}
                  strokeWidth={i % 2 === 0 ? 1.4 : 0.7}
                  strokeLinecap="round"
                  opacity={i % 2 === 0 ? 0.9 : 0.55}
                />
              )
            })}
          </g>

          <circle cx="300" cy="318" r="118" fill={`url(#${orbId})`} className="half-title__orb-half half-title__orb-half--halo" />
          <g className="half-title__orb-half">
            <circle cx="300" cy="318" r="78" fill={`url(#${orbCoreId})`} />
            <path
              d="M 222 318 A 78 78 0 0 1 378 318 L 378 430 L 222 430 Z"
              fill="var(--night)"
              opacity="0.92"
            />
            <path
              d="M 222 318 A 78 78 0 0 1 378 318"
              fill="none"
              stroke="rgba(255, 240, 210, .55)"
              strokeWidth=".7"
            />
            <line
              x1="222"
              y1="318"
              x2="378"
              y2="318"
              stroke="rgba(255, 240, 210, .35)"
              strokeWidth=".4"
              strokeDasharray="1.2 1.8"
            />
            <circle cx="300" cy="318" r="1.6" fill="rgba(255, 252, 234, .9)" />
          </g>

          <g className="half-title__dust" fill="currentColor">
            <circle cx="120" cy="160" r=".55" opacity=".5" />
            <circle cx="200" cy="124" r=".7" opacity=".55" />
            <circle cx="264" cy="148" r=".5" opacity=".42" />
            <circle cx="346" cy="118" r=".6" opacity=".48" />
            <circle cx="412" cy="142" r=".5" opacity=".42" />
            <circle cx="486" cy="170" r=".7" opacity=".5" />
            <circle cx="168" cy="220" r=".55" opacity=".42" />
            <circle cx="248" cy="244" r=".5" opacity=".4" />
            <circle cx="356" cy="232" r=".55" opacity=".42" />
            <circle cx="436" cy="252" r=".5" opacity=".42" />
            <circle cx="80" cy="298" r=".55" opacity=".42" />
            <circle cx="528" cy="306" r=".55" opacity=".42" />
          </g>

          <g className="half-title__notches" stroke="currentColor" strokeWidth=".4" opacity=".42">
            <line x1="148" y1="430" x2="148" y2="436" />
            <line x1="172" y1="430" x2="172" y2="438" />
            <line x1="196" y1="430" x2="196" y2="436" />
            <line x1="220" y1="430" x2="220" y2="438" />
            <line x1="244" y1="430" x2="244" y2="436" />
            <line x1="268" y1="430" x2="268" y2="438" />
            <line x1="292" y1="430" x2="292" y2="436" />
            <line x1="316" y1="430" x2="316" y2="438" />
            <line x1="340" y1="430" x2="340" y2="436" />
            <line x1="364" y1="430" x2="364" y2="438" />
            <line x1="388" y1="430" x2="388" y2="436" />
            <line x1="412" y1="430" x2="412" y2="438" />
            <line x1="436" y1="430" x2="436" y2="436" />
          </g>
        </svg>

        <span className="half-title__compass" aria-hidden="true">
          <svg viewBox="0 0 44 44">
            <circle cx="22" cy="22" r="20" fill="none" stroke="currentColor" strokeWidth=".55" opacity=".65" />
            <circle cx="22" cy="22" r="14" fill="none" stroke="currentColor" strokeWidth=".32" strokeDasharray=".8 1.6" opacity=".5" />
            <line x1="22" y1="4" x2="22" y2="10" stroke="currentColor" strokeWidth=".55" strokeLinecap="round" opacity=".75" />
            <line x1="22" y1="34" x2="22" y2="40" stroke="currentColor" strokeWidth=".4" strokeLinecap="round" opacity=".55" />
            <line x1="4" y1="22" x2="10" y2="22" stroke="currentColor" strokeWidth=".4" strokeLinecap="round" opacity=".55" />
            <line x1="34" y1="22" x2="40" y2="22" stroke="currentColor" strokeWidth=".4" strokeLinecap="round" opacity=".55" />
            <text x="22" y="3.5" textAnchor="middle" fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace" fontSize="3.4" letterSpacing="1.4" fill="currentColor" opacity=".78">N</text>
            <text x="22" y="43.6" textAnchor="middle" fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace" fontSize="3.4" letterSpacing="1.4" fill="currentColor" opacity=".6">S</text>
            <text x="2.6" y="23.4" textAnchor="middle" fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace" fontSize="3.4" letterSpacing="1.4" fill="currentColor" opacity=".6">W</text>
            <text x="41.4" y="23.4" textAnchor="middle" fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace" fontSize="3.4" letterSpacing="1.4" fill="currentColor" opacity=".6">E</text>
            <circle cx="22" cy="22" r="1.6" fill="currentColor" opacity=".85" />
            <circle cx="22" cy="22" r=".6" fill="var(--night)" />
          </svg>
          <em className="half-title__compass-key">first light</em>
        </span>
      </div>

      <header className="half-title__eyebrow" aria-hidden="true">
        <span className="half-title__eyebrow-rule half-title__eyebrow-rule--l">
          <svg viewBox="0 0 80 4" preserveAspectRatio="none">
            <line x1="0" y1="2" x2="80" y2="2" stroke="currentColor" strokeWidth=".4" strokeDasharray=".7 1.6" opacity=".55" />
            <circle cx="2" cy="2" r=".8" fill="currentColor" opacity=".8" />
            <circle cx="78" cy="2" r=".8" fill="currentColor" opacity=".8" />
          </svg>
        </span>
        <em className="half-title__eyebrow-text">daybreak · a half-title</em>
        <span className="half-title__eyebrow-rule half-title__eyebrow-rule--r">
          <svg viewBox="0 0 80 4" preserveAspectRatio="none">
            <line x1="0" y1="2" x2="80" y2="2" stroke="currentColor" strokeWidth=".4" strokeDasharray=".7 1.6" opacity=".55" />
            <circle cx="2" cy="2" r=".8" fill="currentColor" opacity=".8" />
            <circle cx="78" cy="2" r=".8" fill="currentColor" opacity=".8" />
          </svg>
        </span>
      </header>

      <h1 className="half-title__title">
        <span className="half-title__title-row half-title__title-row--a">
          <em className="half-title__piece half-title__piece--lead">{TITLE_LINE_A}</em>
        </span>
        <span className="half-title__title-row half-title__title-row--b">
          <em className="half-title__piece half-title__piece--verb">{TITLE_LINE_B}</em>
        </span>
        <span className="half-title__title-row half-title__title-row--c">
          <em className="half-title__piece half-title__piece--query">
            <span className="half-title__piece-rule" aria-hidden="true">
              <svg viewBox="0 0 200 4" preserveAspectRatio="none">
                <line x1="2" y1="2" x2="198" y2="2" stroke="currentColor" strokeWidth=".55" strokeLinecap="round" />
                <circle cx="2" cy="2" r="1.4" fill="currentColor" />
                <circle cx="198" cy="2" r="1.4" fill="currentColor" />
              </svg>
            </span>
            <span className="half-title__query-text">{TITLE_LINE_C}</span>
            <span className="half-title__query-mark" aria-hidden="true">
              <svg viewBox="0 0 14 22">
                <path d="M7 1 C 11 1, 12.5 4.5, 12.5 8 C 12.5 11, 10.5 13, 8 14 C 6.5 14.5, 5 15, 5 17" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                <circle cx="7" cy="20.4" r="1.3" fill="currentColor" />
              </svg>
            </span>
          </em>
        </span>
      </h1>

      <span className="half-title__rule" aria-hidden="true">
        <span className="half-title__rule-line half-title__rule-line--l" />
        <span className="half-title__rule-mark">
          <svg viewBox="0 0 28 8" preserveAspectRatio="none">
            <line x1="0" y1="4" x2="10" y2="4" stroke="currentColor" strokeWidth=".4" strokeDasharray=".5 1.8" opacity=".55" />
            <circle cx="14" cy="4" r="1.7" fill="currentColor" />
            <circle cx="14" cy="4" r=".55" fill="var(--night)" />
            <line x1="18" y1="4" x2="28" y2="4" stroke="currentColor" strokeWidth=".4" strokeDasharray=".5 1.8" opacity=".55" />
          </svg>
        </span>
        <span className="half-title__rule-line half-title__rule-line--r" />
      </span>

      <p className="half-title__note" aria-hidden="true">
        <em>the question opens once · the page sets the line in three voices · take your pick</em>
      </p>

      <div
        className="half-title__voices"
        role="group"
        aria-label="The three voices · click or use arrow keys to set the line"
      >
        {ORDER.map((v) => {
          const isActive = voice === v
          const isHover = hovered === v
          const rowStyle = { '--row-tone': `var(--${v})` } as CSSProperties
          return (
            <button
              key={v}
              type="button"
              className={`half-title__voice half-title__voice--${v} ${isActive ? 'is-active' : ''} ${isHover ? 'is-hover' : ''}`}
              style={rowStyle}
              onClick={() => selectVoice(v)}
              onMouseEnter={() => focusVoice(v)}
              onMouseLeave={() => blurVoice(v)}
              onFocus={() => focusVoice(v)}
              onBlur={() => blurVoice(v)}
              aria-pressed={voice === v}
              aria-label={`Set the line in ${VOICE_NAME[v]} — ${VOICE_FACE[v]}.`}
            >
              <span className="half-title__voice-letter" aria-hidden="true">{VOICE_LETTER[v]}</span>
              <span className="half-title__voice-stack">
                <em className="half-title__voice-name">{VOICE_NAME[v]}</em>
                <span className="half-title__voice-face">{VOICE_FACE[v]}</span>
              </span>
              <span className={`half-title__voice-line half-title__voice-line--${v}`} aria-hidden="true">
                {VOICE_LINE[v]}
              </span>
              <span className="half-title__voice-mark" aria-hidden="true">
                <span className="half-title__voice-mark-glyph">{VOICE_GLYPH[v]}</span>
              </span>
            </button>
          )
        })}
      </div>

      <footer className="half-title__ledger" aria-hidden="true">
        <span className="half-title__ledger-cell">
          <em className="half-title__ledger-key">set on</em>
          <span className="half-title__ledger-val">
            <em>{dayName}</em>
            <span aria-hidden="true">·</span>
            <em>{tokens.month} {tokens.day}, {tokens.year}</em>
          </span>
        </span>
        <span className="half-title__ledger-cell half-title__ledger-cell--now">
          <em className="half-title__ledger-key">at first light</em>
          <span className="half-title__ledger-val">
            <em className="half-title__ledger-hour">{hour}</em>
          </span>
        </span>
        <span className="half-title__ledger-cell">
          <em className="half-title__ledger-key">the broadside</em>
          <span className="half-title__ledger-val">
            <em>folio 0</em>
            <span aria-hidden="true">·</span>
            <em>follows</em>
          </span>
        </span>
      </footer>

      <span className="half-title__paper" aria-hidden="true" />

      <span className="half-title__dust-stage" aria-hidden="true">
        <svg viewBox="0 0 800 320" preserveAspectRatio="xMidYMid meet" className="half-title__dust-stage-svg">
          <g fill="currentColor">
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

      <span className="half-title__handoff" aria-hidden="true">
        <span className="half-title__handoff-rule half-title__handoff-rule--l" />
        <span className="half-title__handoff-stack">
          <em className="half-title__handoff-pip">
            <svg viewBox="0 0 14 14" aria-hidden="true">
              <circle cx="7" cy="7" r="5.4" fill="none" stroke="currentColor" strokeWidth=".55" opacity=".78" />
              <circle cx="7" cy="7" r="2.2" fill="currentColor" opacity=".85" />
              <circle cx="7" cy="7" r=".7" fill="var(--night)" />
            </svg>
          </em>
          <em className="half-title__handoff-text">the broadside, when ready</em>
        </span>
        <span className="half-title__handoff-arrow" aria-hidden="true">
          <svg viewBox="0 0 28 8" preserveAspectRatio="none">
            <line x1="0" y1="4" x2="24" y2="4" stroke="currentColor" strokeWidth=".55" strokeLinecap="round" />
            <path d="M 22 1 L 26 4 L 22 7" fill="none" stroke="currentColor" strokeWidth=".55" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <span className="half-title__handoff-rule half-title__handoff-rule--r" />
      </span>

      <span className="sr-only">
        {`Daybreak · ${TITLE_FULL} · set on ${dayName} ${tokens.month} ${tokens.day}, ${tokens.year} at ${hour} · voice set in ${VOICE_NAME[voice]} (${VOICE_FACE[voice]}) · the broadside follows at folio 0.`}
      </span>
    </section>
  )
}