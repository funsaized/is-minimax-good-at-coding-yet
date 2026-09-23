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

const TIME_BEATS: Array<{ ratio: number; name: string; short: string; pos: 'first' | 'mid' | 'soft' | 'late' }> = [
  { ratio: 0, name: 'first light', short: 'first', pos: 'first' },
  { ratio: 0.18, name: 'morning', short: 'morning', pos: 'first' },
  { ratio: 0.5, name: 'midday', short: 'midday', pos: 'mid' },
  { ratio: 0.78, name: 'softening', short: 'soft', pos: 'soft' },
  { ratio: 1, name: 'late still', short: 'late', pos: 'late' },
]

const COMPASS_NOTE: Array<{ at: number; line: string }> = [
  { at: 0.0, line: 'at first light' },
  { at: 0.18, line: 'morning · the room warms' },
  { at: 0.5, line: 'midday · the line stands tall' },
  { at: 0.78, line: 'softening · the page exhales' },
  { at: 1.0, line: 'late still · the question, kept' },
]

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
  const sunArcId = `rc-sun-arc-${baseId}`
  const sunOrbId = `rc-sun-orb-${baseId}`

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
  const sweepAngle = (ratio - 0.5) * TIME_ANGLE_MAX

  const sunT = ratio
  const sunCx = 32 - Math.cos(sunT * Math.PI) * 18.4
  const sunCy = 32 - Math.sin(sunT * Math.PI) * 22.4
  const moonCx = 32 - Math.cos(sunT * Math.PI) * 18.4
  const moonCy = 32 + Math.sin(sunT * Math.PI) * 22.4
  const sunVisible = sunT < 0.78
  const moonVisible = sunT > 0.22

  const nearestBeat = [...TIME_BEATS].sort((a, b) => Math.abs(a.ratio - ratio) - Math.abs(b.ratio - ratio))[0]
  const poetNote = COMPASS_NOTE.reduce((best, cur) =>
    Math.abs(cur.at - ratio) < Math.abs(best.at - ratio) ? cur : best,
  COMPASS_NOTE[0])

  const style = {
    '--rc-tone': `var(--${voice})`,
    '--rc-active': `var(--${voice})`,
    '--rc-time-angle': `${sweepAngle.toFixed(2)}deg`,
    '--rc-sun-t': sunT.toFixed(3),
    '--rc-beat': nearestBeat.short,
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

  const beatTicks = TIME_BEATS.map(b => {
    const angle = (b.ratio - 0.5) * TIME_ANGLE_MAX * (Math.PI / 180)
    const inner = 21.4
    const outer = 30
    return {
      cx: 32,
      cy: 32,
      x1: 32 + Math.sin(angle) * inner,
      y1: 32 - Math.cos(angle) * inner,
      x2: 32 + Math.sin(angle) * outer,
      y2: 32 - Math.cos(angle) * outer,
      name: b.name,
      short: b.short,
      isFirst: b.pos === 'first',
      isMid: b.pos === 'mid',
      isSoft: b.pos === 'soft',
      isLate: b.pos === 'late',
    }
  })

  return (
    <aside
      className={`reading-compass reading-compass--${voice} ${reducedMotion ? 'is-quiet' : ''} ${isPulling ? 'is-pulling' : ''}`}
      style={style}
      data-pull={activePull > 0 ? activePull : undefined}
      data-word={word}
      data-beat={nearestBeat.short}
      aria-label={`The reading compass · voice ${VOICE_LETTER[voice]} · marked at ${word} (${WORD_NAME[word]}) · the day has reached ${nearestBeat.name}, set on ${setToday}.`}
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
          <linearGradient id={sunArcId} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="currentColor" stopOpacity=".32" />
            <stop offset="22%" stopColor="currentColor" stopOpacity=".6" />
            <stop offset="50%" stopColor="currentColor" stopOpacity=".85" />
            <stop offset="78%" stopColor="currentColor" stopOpacity=".6" />
            <stop offset="100%" stopColor="currentColor" stopOpacity=".32" />
          </linearGradient>
          <radialGradient id={sunOrbId} cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="currentColor" stopOpacity=".95" />
            <stop offset="55%" stopColor="currentColor" stopOpacity=".5" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </radialGradient>
        </defs>

        <circle cx="32" cy="32" r="30.5" fill="rgba(8, 10, 18, .55)" stroke="currentColor" strokeWidth=".6" strokeOpacity=".55" />
        <circle cx="32" cy="32" r="27.5" fill="none" stroke="currentColor" strokeWidth=".32" strokeDasharray=".7 1.6" strokeOpacity=".42" />
        <circle cx="32" cy="32" r="22" fill="none" stroke="currentColor" strokeWidth=".28" strokeOpacity=".32" />

        <circle cx="32" cy="32" r="20" fill={`url(#${sweepGlowId})`} />

        {/* — the day's sun-arc, a single curve that lifts at midday, sets in the evening — */}
        <g className="reading-compass__sun-arc" aria-hidden="true">
          <path
            d="M 13.6 32 Q 32 8.4 50.4 32"
            fill="none"
            stroke={`url(#${sunArcId})`}
            strokeWidth=".7"
            strokeDasharray=".6 2"
            strokeLinecap="round"
          />
          <path
            d="M 13.6 32 Q 32 8.4 50.4 32"
            fill="none"
            stroke="currentColor"
            strokeWidth=".32"
            strokeLinecap="round"
            opacity=".32"
          />
        </g>

        {/* — the moon-arc, the night-side companion — */}
        <g className="reading-compass__moon-arc" aria-hidden="true">
          <path
            d="M 13.6 32 Q 32 55.6 50.4 32"
            fill="none"
            stroke="currentColor"
            strokeWidth=".4"
            strokeDasharray=".5 2.4"
            strokeLinecap="round"
            opacity=".28"
          />
        </g>

        {/* — the sun orb, riding the day's arc — */}
        <g className="reading-compass__sun" aria-hidden="true">
          {sunVisible && (
            <>
              <circle cx={sunCx} cy={sunCy} r="3.4" fill={`url(#${sunOrbId})`} opacity=".55" />
              <circle cx={sunCx} cy={sunCy} r="1.4" fill="currentColor" />
              <circle cx={sunCx} cy={sunCy} r=".55" fill="rgba(8, 10, 18, .95)" />
            </>
          )}
        </g>

        {/* — the moon, visible when the day is past the morning — */}
        <g className="reading-compass__moon" aria-hidden="true">
          {moonVisible && (
            <>
              <circle cx={moonCx} cy={moonCy} r="2.2" fill="none" stroke="currentColor" strokeWidth=".4" opacity=".5" />
              <circle cx={moonCx} cy={moonCy} r="1.2" fill="rgba(8, 10, 18, .92)" stroke="currentColor" strokeWidth=".28" opacity=".7" />
              <circle cx={moonCx + 0.6} cy={moonCy - 0.3} r="1" fill="currentColor" opacity=".32" />
            </>
          )}
        </g>

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

        {/* — the four time-of-day beats, set on the outer dial — */}
        <g className="reading-compass__beats" stroke="currentColor" strokeLinecap="round">
          {beatTicks.map((b, i) => (
            <g key={`${tickRingId}-beat-${i}`} className={`reading-compass__beat reading-compass__beat--${b.short}`}>
              <line
                x1={b.x1}
                y1={b.y1}
                x2={b.x2}
                y2={b.y2}
                strokeWidth={b.isMid ? '.85' : '.55'}
                strokeOpacity={b.isMid ? '.92' : '.7'}
              />
              <circle
                cx={b.x2 + (b.isMid ? 0 : Math.sign(b.x2 - 32) * 1.2)}
                cy={b.y2 + (b.isMid ? -1.2 : 0)}
                r={b.isMid ? '1.4' : '.9'}
                fill="currentColor"
                opacity={b.isMid ? '.95' : '.7'}
              />
            </g>
          ))}
        </g>

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

        <circle cx="32" cy="32" r="9.5" fill="rgba(8, 10, 18, .85)" stroke="currentColor" strokeWidth=".45" strokeOpacity=".78" />
        <circle cx="32" cy="32" r="7.4" fill="none" stroke="currentColor" strokeWidth=".25" strokeDasharray=".4 1" strokeOpacity=".55" />

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

        <line x1="14" y1="32" x2="50" y2="32" stroke="currentColor" strokeWidth=".22" strokeDasharray=".5 1.4" opacity=".18" />
      </svg>

      <span className="reading-compass__cap" aria-hidden="true">
        <span className="reading-compass__cap-rule reading-compass__cap-rule--l" />
        <em className="reading-compass__cap-key">{WORD_SHORT[word]}</em>
        <span className="reading-compass__cap-rule reading-compass__cap-rule--r" />
      </span>

      <span className="reading-compass__poet" aria-hidden="true">
        <em className="reading-compass__poet-key">the day</em>
        <span className="reading-compass__poet-rule" />
        <em className="reading-compass__poet-line">{poetNote.line}</em>
      </span>
    </aside>
  )
}