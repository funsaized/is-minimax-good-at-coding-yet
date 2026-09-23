import { useEffect, useId, useRef, useState, type CSSProperties } from 'react'
import type { VoiceId } from './App'

type ArrivalPlateProps = {
  voice: VoiceId
  setToday: string
}

const VOICE_LETTER: Record<VoiceId, string> = { quiet: 'A', human: 'B', bold: 'C' }
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
const VOICE_GLYPH: Record<VoiceId, string> = { quiet: '⌇', human: '∧', bold: '∴' }
const VOICE_LINE: Record<VoiceId, string> = {
  quiet: 'is m³ good at frontend yet?',
  human: 'is M3 good at frontend yet?',
  bold: 'IS M3 GOOD AT FRONTEND YET?',
}

const OPENING: Record<VoiceId, string> = {
  quiet: 'a single line, set softly, in the dark.',
  human: 'a single line, set by hand, while the room is still cold.',
  bold: 'a single line, set at full height, before anyone is listening.',
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

function plateHour() {
  const now = new Date()
  let h = now.getHours()
  const m = now.getMinutes()
  const ampm = h >= 12 ? 'pm' : 'am'
  h = h % 12
  if (h === 0) h = 12
  return `${h}:${m.toString().padStart(2, '0')} ${ampm}`
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

const ORDER: VoiceId[] = ['quiet', 'human', 'bold']

export function ArrivalPlate({ voice, setToday }: ArrivalPlateProps) {
  const baseId = useId().replace(/:/g, '')
  const haloId = `arr-halo-${baseId}`
  const rayId = `arr-ray-${baseId}`
  const sweepId = `arr-sweep-${baseId}`

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
      { threshold: 0.16, rootMargin: '0px 0px -6% 0px' },
    )
    obs.observe(node)
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    const id = window.setInterval(() => {
      setHour(plateHour())
      const d = new Date().getDay()
      setDayName(DAY_NAME[d] ?? '')
    }, 30_000)
    return () => window.clearInterval(id)
  }, [])

  const tokens = plateDateTokens(setToday)
  const focus = hovered ?? voice

  const style = {
    '--arr-tone': `var(--${voice})`,
    '--arr-focus': `var(--${focus})`,
    '--arr-tone-deep': `var(--${voice}-deep)`,
  } as CSSProperties

  return (
    <section
      ref={rootRef}
      id="opening"
      className={`arrival arrival--${voice} ${revealed ? 'is-revealed' : ''} ${reduceMotion ? 'is-quiet' : ''}`}
      style={style}
      aria-label={`The opening folio · folio zero · m³ press · set ${setToday} at ${hour}.`}
    >
      <svg className="arrival__defs" aria-hidden="true" focusable="false">
        <defs>
          <radialGradient id={haloId} cx="50%" cy="46%" r="58%">
            <stop offset="0%" stopColor="var(--arr-focus)" stopOpacity=".18" />
            <stop offset="55%" stopColor="var(--arr-focus)" stopOpacity=".05" />
            <stop offset="100%" stopColor="var(--arr-focus)" stopOpacity="0" />
          </radialGradient>
          <linearGradient id={rayId} x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="var(--arr-focus)" stopOpacity=".42" />
            <stop offset="55%" stopColor="var(--arr-focus)" stopOpacity=".14" />
            <stop offset="100%" stopColor="var(--arr-focus)" stopOpacity="0" />
          </linearGradient>
          <linearGradient id={sweepId} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--arr-focus)" stopOpacity="0" />
            <stop offset="22%" stopColor="var(--arr-focus)" stopOpacity=".5" />
            <stop offset="50%" stopColor="var(--arr-focus)" stopOpacity=".75" />
            <stop offset="78%" stopColor="var(--arr-focus)" stopOpacity=".5" />
            <stop offset="100%" stopColor="var(--arr-focus)" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      <span className="arrival__halo" aria-hidden="true">
        <svg viewBox="0 0 800 320" preserveAspectRatio="xMidYMid meet">
          <rect x="0" y="0" width="800" height="320" fill={`url(#${haloId})`} />
        </svg>
      </span>

      <header className="arrival__crest" aria-hidden="true">
        <span className="arrival__crest-rule arrival__crest-rule--l">
          <svg viewBox="0 0 220 10" preserveAspectRatio="none">
            <line x1="0" y1="5" x2="220" y2="5" stroke={`url(#${sweepId})`} strokeWidth=".55" />
            <line x1="0" y1="5" x2="220" y2="5" stroke="currentColor" strokeWidth=".3" strokeDasharray=".5 2.6" opacity=".5" />
            <circle cx="2" cy="5" r="1.1" fill="currentColor" />
            <circle cx="110" cy="5" r="1.8" fill="currentColor" />
            <circle cx="110" cy="5" r=".6" fill="var(--night)" />
            <circle cx="218" cy="5" r="1.1" fill="currentColor" />
          </svg>
        </span>
        <span className="arrival__crest-stack">
          <em className="arrival__crest-press">m³ press</em>
          <span className="arrival__crest-sub">
            <em>folio zero</em>
            <span aria-hidden="true">·</span>
            <em>the open</em>
            <span aria-hidden="true">·</span>
            <em>{tokens.day} {tokens.month} {tokens.year}</em>
          </span>
        </span>
        <span className="arrival__crest-rule arrival__crest-rule--r">
          <svg viewBox="0 0 220 10" preserveAspectRatio="none">
            <line x1="0" y1="5" x2="220" y2="5" stroke={`url(#${sweepId})`} strokeWidth=".55" />
            <line x1="0" y1="5" x2="220" y2="5" stroke="currentColor" strokeWidth=".3" strokeDasharray=".5 2.6" opacity=".5" />
            <circle cx="2" cy="5" r="1.1" fill="currentColor" />
            <circle cx="110" cy="5" r="1.8" fill="currentColor" />
            <circle cx="110" cy="5" r=".6" fill="var(--night)" />
            <circle cx="218" cy="5" r="1.1" fill="currentColor" />
          </svg>
        </span>
      </header>

      <div className="arrival__board">
        <span className="arrival__initial" aria-hidden="true">
          <svg viewBox="0 0 140 160" className="arrival__initial-svg">
            <circle cx="70" cy="80" r="64" fill="none" stroke="currentColor" strokeWidth=".55" opacity=".32" />
            <circle cx="70" cy="80" r="58" fill="none" stroke="currentColor" strokeWidth=".32" opacity=".5" strokeDasharray=".7 1.6" />
            <path
              className="arrival__initial-stroke"
              d="M 36 112 C 36 88, 36 70, 48 60 C 60 50, 76 50, 86 60 C 96 70, 92 84, 78 90 C 64 96, 60 102, 60 112 C 60 122, 68 128, 80 132"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity=".92"
            />
            <path
              d="M 46 132 L 92 132"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              opacity=".78"
            />
            <circle cx="36" cy="112" r="2.4" fill="currentColor" />
            <circle cx="86" cy="60" r="1.9" fill="currentColor" opacity=".85" />
            <circle cx="80" cy="132" r="1.5" fill="currentColor" opacity=".7" />
            <circle cx="36" cy="112" r=".9" fill="var(--night)" />
            <text
              x="70"
              y="20"
              textAnchor="middle"
              fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
              fontSize="6"
              letterSpacing="2.4"
              fill="currentColor"
              opacity=".7"
            >
              SET · OPEN
            </text>
            <text
              x="70"
              y="152"
              textAnchor="middle"
              fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
              fontSize="5"
              letterSpacing="2.2"
              fill="currentColor"
              opacity=".65"
            >
              FOLIO · 0
            </text>
          </svg>
        </span>

        <div className="arrival__copy">
          <span className="arrival__eyebrow" aria-hidden="true">
            <em className="arrival__eyebrow-mark">
              <svg viewBox="0 0 12 12">
                <circle cx="6" cy="6" r="4.6" fill="none" stroke="currentColor" strokeWidth=".55" opacity=".78" />
                <circle cx="6" cy="6" r="1.6" fill="currentColor" opacity=".85" />
                <circle cx="6" cy="6" r=".55" fill="var(--night)" />
              </svg>
            </em>
            <em>a quiet opening</em>
            <span aria-hidden="true">·</span>
            <em>at first light</em>
          </span>

          <h1 className="arrival__line">
            <em className="arrival__line-lead">before</em>
            <em className="arrival__line-set">
              <span className="arrival__line-the">the</span>
              <em className="arrival__line-key">question,</em>
            </em>
            <em className="arrival__line-tail">a hand reaches for the type.</em>
          </h1>

          <p className="arrival__open" aria-hidden="true">
            <em className="arrival__open-mark">
              <svg viewBox="0 0 20 20">
                <path d="M 4 4 L 4 16 M 4 4 L 10 4 Q 14 4 14 8 Q 14 11 10 11 L 4 11" fill="none" stroke="currentColor" strokeWidth=".7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </em>
            <em>{OPENING[voice]}</em>
          </p>
        </div>
      </div>

      <span className="arrival__set-line" aria-hidden="true">
        <svg viewBox="0 0 720 8" preserveAspectRatio="none" className="arrival__set-line-svg">
          <line x1="0" y1="4" x2="360" y2="4" stroke={`url(#${rayId})`} strokeWidth=".55" />
          <line x1="360" y1="4" x2="720" y2="4" stroke={`url(#${rayId})`} strokeWidth=".55" />
          <circle cx="2" cy="4" r="1.2" fill="currentColor" />
          <circle cx="120" cy="4" r="1" fill="currentColor" opacity=".78" />
          <circle cx="240" cy="4" r="1.2" fill="currentColor" />
          <circle cx="360" cy="4" r="2.2" fill="currentColor" />
          <circle cx="360" cy="4" r=".7" fill="var(--night)" />
          <circle cx="480" cy="4" r="1.2" fill="currentColor" />
          <circle cx="600" cy="4" r="1" fill="currentColor" opacity=".78" />
          <circle cx="718" cy="4" r="1.2" fill="currentColor" />
        </svg>
      </span>

      <div
        className="arrival__notation"
        role="group"
        aria-label="The three voices, set as a notation strip"
      >
        <span className="arrival__notation-key" aria-hidden="true">
          <em>the line, set three ways</em>
          <span className="arrival__notation-key-rule" />
          <em>choose one — or read all three</em>
        </span>

        <ol className="arrival__notation-list">
          {ORDER.map((v, i) => {
            const isActive = voice === v
            const isHover = hovered === v
            const rowStyle = {
              '--row-tone': `var(--${v})`,
            } as CSSProperties
            return (
              <li
                key={v}
                className={`arrival__notation-row arrival__notation-row--${v} ${isActive ? 'is-active' : ''} ${isHover ? 'is-hover' : ''}`}
                style={rowStyle}
                onMouseEnter={() => setHovered(v)}
                onMouseLeave={() => setHovered(prev => (prev === v ? null : prev))}
              >
                <span className="arrival__notation-letter" aria-hidden="true">{VOICE_LETTER[v]}</span>
                <span className="arrival__notation-stack">
                  <em className="arrival__notation-name">{VOICE_NAME[v]}</em>
                  <span className="arrival__notation-face">{VOICE_FACE[v]}</span>
                </span>
                <span
                  className={`arrival__notation-line arrival__notation-line--${v}`}
                  aria-hidden="true"
                >
                  {VOICE_LINE[v]}
                </span>
                <span className="arrival__notation-mark" aria-hidden="true">
                  <span className="arrival__notation-mark-glyph">{VOICE_GLYPH[v]}</span>
                  <em>{v === 'quiet' ? 'stet' : v === 'human' ? 'caret' : 'query'}</em>
                </span>
                <span className="arrival__notation-cord" aria-hidden="true">
                  {i < ORDER.length - 1 && (
                    <svg viewBox="0 0 24 8" preserveAspectRatio="none">
                      <line x1="0" y1="4" x2="24" y2="4" stroke="currentColor" strokeWidth=".4" strokeDasharray=".6 1.8" opacity=".55" />
                      <circle cx="12" cy="4" r=".9" fill="currentColor" opacity=".7" />
                    </svg>
                  )}
                </span>
              </li>
            )
          })}
        </ol>
      </div>

      <footer className="arrival__ledger" aria-hidden="true">
        <span className="arrival__ledger-cell">
          <em className="arrival__ledger-key">set on</em>
          <span className="arrival__ledger-val">
            <em>{dayName}</em>
            <span aria-hidden="true">·</span>
            <em>{tokens.day}</em>
            <span aria-hidden="true">·</span>
            <em>{tokens.month}</em>
            <span aria-hidden="true">·</span>
            <em>{tokens.year}</em>
          </span>
        </span>

        <span className="arrival__ledger-cell arrival__ledger-cell--now">
          <em className="arrival__ledger-key">at</em>
          <span className="arrival__ledger-val">
            <em className="arrival__ledger-hour">{hour}</em>
            <span aria-hidden="true">·</span>
            <em>voice {VOICE_LETTER[voice]} · {VOICE_NAME[voice]}</em>
          </span>
        </span>

        <span className="arrival__ledger-cell arrival__ledger-cell--next">
          <em className="arrival__ledger-key">read in</em>
          <span className="arrival__ledger-val">
            <em>{tokens.month} {tokens.day}</em>
            <span aria-hidden="true">·</span>
            <em>folio i · the question follows</em>
          </span>
        </span>
      </footer>

      <span className="arrival__handoff" aria-hidden="true">
        <span className="arrival__handoff-rule arrival__handoff-rule--l" />
        <span className="arrival__handoff-stack">
          <span className="arrival__handoff-pip" aria-hidden="true">
            <svg viewBox="0 0 14 14">
              <circle cx="7" cy="7" r="5.6" fill="none" stroke="currentColor" strokeWidth=".55" opacity=".78" />
              <circle cx="7" cy="7" r="2.4" fill="currentColor" opacity=".85" />
              <circle cx="7" cy="7" r=".9" fill="var(--night)" />
            </svg>
          </span>
          <em>the question, when ready</em>
          <span className="arrival__handoff-key">folio i</span>
        </span>
        <span className="arrival__handoff-arrow" aria-hidden="true">
          <svg viewBox="0 0 28 8" preserveAspectRatio="none">
            <line x1="0" y1="4" x2="24" y2="4" stroke="currentColor" strokeWidth=".55" strokeLinecap="round" />
            <path d="M 22 1 L 26 4 L 22 7" fill="none" stroke="currentColor" strokeWidth=".55" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <span className="arrival__handoff-rule arrival__handoff-rule--r" />
      </span>

      <span className="arrival__dust" aria-hidden="true">
        <svg viewBox="0 0 800 240" preserveAspectRatio="xMidYMid meet">
          <g className="arrival__dust-grains" fill="currentColor">
            <circle cx="120" cy="64" r=".7" opacity=".5" />
            <circle cx="240" cy="120" r=".5" opacity=".42" />
            <circle cx="356" cy="86" r=".9" opacity=".6" />
            <circle cx="468" cy="148" r=".55" opacity=".42" />
            <circle cx="556" cy="92" r=".7" opacity=".5" />
            <circle cx="664" cy="156" r=".55" opacity=".42" />
            <circle cx="180" cy="194" r=".55" opacity=".42" />
            <circle cx="316" cy="208" r=".9" opacity=".55" />
            <circle cx="488" cy="218" r=".7" opacity=".48" />
            <circle cx="612" cy="206" r=".55" opacity=".42" />
          </g>
        </svg>
      </span>

      <span className="sr-only">
        {`The opening folio · m³ press · folio zero · the open · set on ${setToday} at ${hour} · the question is set in three voices (${VOICE_NAME.quiet}, ${VOICE_NAME.human}, ${VOICE_NAME.bold}) · the question follows at folio i.`}
      </span>
    </section>
  )
}