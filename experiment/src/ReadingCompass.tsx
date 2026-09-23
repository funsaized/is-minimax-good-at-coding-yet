import {
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
} from 'react'
import type { VoiceId } from './App'
import type { WordId } from './notes'

type ReadingCompassProps = {
  voice: VoiceId
  word: WordId
  pageTime: number
  pullSignal: number
  isPulling: boolean
  setToday: string
}

const VOICE_LETTER: Record<VoiceId, string> = { quiet: 'A', human: 'B', bold: 'C' }
const WORD_GLYPH: Record<WordId, string> = { m3: '⌇', good: '∧', yet: '?' }
const WORD_NAME: Record<WordId, string> = { m3: 'the maker', good: 'the verb', yet: 'the pause' }
const WORD_SHORT: Record<WordId, string> = { m3: 'maker', good: 'verb', yet: 'pause' }

const HOURLY_TICKS = 24
const TIME_ANGLE_MAX = 320

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v))
}

export function ReadingCompass({
  voice,
  word,
  pageTime,
  pullSignal,
  isPulling,
  setToday,
}: ReadingCompassProps) {
  const baseId = useId().replace(/:/g, '')
  const tickRingId = `rc-ring-${baseId}`
  const sweepGlowId = `rc-sweep-glow-${baseId}`
  const sweepLineId = `rc-sweep-line-${baseId}`

  const [reducedMotion, setReducedMotion] = useState(false)
  const [activePull, setActivePull] = useState(0)
  const lastPull = useRef(pullSignal)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mq.matches)
    const onChange = () => setReducedMotion(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    if (lastPull.current === pullSignal) return
    lastPull.current = pullSignal
    setActivePull(p => p + 1)
    if (reducedMotion) return
    const id = window.setTimeout(() => setActivePull(0), 920)
    return () => window.clearTimeout(id)
  }, [pullSignal, reducedMotion])

  const ratio = clamp(pageTime, 0, 1)
  // sweep goes from -TIME_ANGLE_MAX/2 to +TIME_ANGLE_MAX/2, so the dial reads
  // like a sundial that has swept across the day.
  const sweepAngle = (ratio - 0.5) * TIME_ANGLE_MAX
  const wordAngle = ({ m3: -90, good: 90, yet: 180 } as Record<WordId, number>)[word]

  const style = {
    '--rc-tone': `var(--${voice})`,
    '--rc-active': `var(--${voice})`,
    '--rc-time-angle': `${sweepAngle.toFixed(2)}deg`,
    '--rc-word-angle': `${wordAngle}deg`,
  } as CSSProperties

  const ticks = Array.from({ length: HOURLY_TICKS }, (_, i) => {
    const isMajor = i % 6 === 0
    const isMid = i % 3 === 0
    const angle = (i / HOURLY_TICKS) * Math.PI * 2 - Math.PI / 2
    const inner = isMajor ? 23 : isMid ? 25 : 26.4
    const outer = 29.2
    return {
      x1: 32 + Math.cos(angle) * inner,
      y1: 32 + Math.sin(angle) * inner,
      x2: 32 + Math.cos(angle) * outer,
      y2: 32 + Math.sin(angle) * outer,
      width: isMajor ? 0.7 : isMid ? 0.5 : 0.32,
      opacity: isMajor ? 0.85 : isMid ? 0.55 : 0.32,
      major: isMajor,
    }
  })

  return (
    <aside
      className={`reading-compass reading-compass--${voice} ${reducedMotion ? 'is-quiet' : ''} ${isPulling ? 'is-pulling' : ''}`}
      style={style}
      data-pull={activePull > 0 ? activePull : undefined}
      data-word={word}
      aria-label={`The reading compass · voice ${VOICE_LETTER[voice]} · marked at ${word} (${WORD_NAME[word]}) · the day is ${(ratio * 100).toFixed(0)} percent read, set on ${setToday}.`}
    >
      <svg
        className="reading-compass__svg"
        viewBox="0 0 64 64"
        role="img"
        aria-hidden="true"
      >
        <defs>
          <radialGradient id={sweepGlowId} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="currentColor" stopOpacity=".55" />
            <stop offset="55%" stopColor="currentColor" stopOpacity=".14" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </radialGradient>
          <linearGradient id={sweepLineId} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
            <stop offset="40%" stopColor="currentColor" stopOpacity=".8" />
            <stop offset="100%" stopColor="currentColor" stopOpacity=".95" />
          </linearGradient>
        </defs>

        {/* — the outer dial face — */}
        <circle cx="32" cy="32" r="30.5" fill="rgba(8, 10, 18, .55)" stroke="currentColor" strokeWidth=".6" strokeOpacity=".55" />
        <circle cx="32" cy="32" r="27.5" fill="none" stroke="currentColor" strokeWidth=".32" strokeDasharray=".7 1.6" strokeOpacity=".42" />
        <circle cx="32" cy="32" r="22" fill="none" stroke="currentColor" strokeWidth=".28" strokeOpacity=".32" />

        {/* — a soft inner glow that warms with the sweep — */}
        <circle cx="32" cy="32" r="20" fill={`url(#${sweepGlowId})`} />

        {/* — the hour-tick ring, rotated as a whole so the day moves with the page — */}
        <g className="reading-compass__ticks">
          {ticks.map((t, i) => (
            <line
              key={`${tickRingId}-${i}`}
              x1={t.x1}
              y1={t.y1}
              x2={t.x2}
              y2={t.y2}
              stroke="currentColor"
              strokeWidth={t.width}
              strokeLinecap="round"
              opacity={t.opacity}
            />
          ))}
        </g>

        {/* — the four cardinal pricks, set at 0/90/180/270, the page's compass points — */}
        <g className="reading-compass__cardinals" stroke="currentColor" strokeLinecap="round">
          <line x1="32" y1="2.6" x2="32" y2="5.2" strokeWidth=".7" opacity=".78" />
          <line x1="32" y1="58.8" x2="32" y2="61.4" strokeWidth=".7" opacity=".78" />
          <line x1="2.6" y1="32" x2="5.2" y2="32" strokeWidth=".7" opacity=".78" />
          <line x1="58.8" y1="32" x2="61.4" y2="32" strokeWidth=".7" opacity=".78" />
          <circle cx="32" cy="2.6" r=".9" fill="currentColor" opacity=".78" />
          <circle cx="32" cy="61.4" r=".9" fill="currentColor" opacity=".78" />
          <circle cx="2.6" cy="32" r=".9" fill="currentColor" opacity=".78" />
          <circle cx="61.4" cy="32" r=".9" fill="currentColor" opacity=".78" />
        </g>

        {/* — the sweep hand, a single tapered line that rotates with the page time — */}
        <g
          className="reading-compass__sweep"
          transform={`rotate(${sweepAngle.toFixed(2)} 32 32)`}
        >
          <line
            x1="32"
            y1="32"
            x2="32"
            y2="8.6"
            stroke={`url(#${sweepLineId})`}
            strokeWidth="1.4"
            strokeLinecap="round"
          />
          <circle cx="32" cy="8.6" r="1.4" fill="currentColor" />
          <circle cx="32" cy="8.6" r=".5" fill="rgba(8, 10, 18, .95)" />
          <line
            x1="32"
            y1="32"
            x2="32"
            y2="55.4"
            stroke="currentColor"
            strokeWidth=".42"
            strokeLinecap="round"
            opacity=".35"
            strokeDasharray=".6 1.6"
          />
        </g>

        {/* — a small inner ring that frames the voice letter — */}
        <circle cx="32" cy="32" r="9.5" fill="rgba(8, 10, 18, .85)" stroke="currentColor" strokeWidth=".45" strokeOpacity=".78" />
        <circle cx="32" cy="32" r="7.4" fill="none" stroke="currentColor" strokeWidth=".25" strokeDasharray=".4 1" strokeOpacity=".55" />

        {/* — the voice letter, set in italic display at the centre — */}
        <text
          x="32"
          y="35.6"
          textAnchor="middle"
          fontFamily="'Iowan Old Style', 'Palatino Linotype', Georgia, serif"
          fontStyle="italic"
          fontSize="11.5"
          fontWeight="500"
          fill="currentColor"
          letterSpacing="-.01em"
        >
          {VOICE_LETTER[voice]}
        </text>

        {/* — the word glyph, set below the centre — */}
        <g className="reading-compass__word">
          <line x1="27" y1="46.5" x2="31" y2="46.5" stroke="currentColor" strokeWidth=".4" strokeLinecap="round" opacity=".55" />
          <line x1="33" y1="46.5" x2="37" y2="46.5" stroke="currentColor" strokeWidth=".4" strokeLinecap="round" opacity=".55" />
          <text
            x="32"
            y="54"
            textAnchor="middle"
            fontFamily="'Iowan Old Style', 'Palatino Linotype', Georgia, serif"
            fontStyle="italic"
            fontSize="9"
            fill="currentColor"
            opacity=".9"
          >
            {WORD_GLYPH[word]}
          </text>
        </g>

        {/* — a single hairline that ties the day together — */}
        <line x1="14" y1="32" x2="50" y2="32" stroke="currentColor" strokeWidth=".22" strokeDasharray=".5 1.4" opacity=".18" />
      </svg>

      <span className="reading-compass__cap" aria-hidden="true">
        <span className="reading-compass__cap-rule reading-compass__cap-rule--l" />
        <em className="reading-compass__cap-key">{WORD_SHORT[word]}</em>
        <span className="reading-compass__cap-rule reading-compass__cap-rule--r" />
      </span>
    </aside>
  )
}