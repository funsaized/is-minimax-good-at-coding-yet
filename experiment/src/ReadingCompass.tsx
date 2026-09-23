import { useId, type CSSProperties } from 'react'
import type { VoiceId } from './App'
import type { WordId } from './notes'

type ReadingCompassProps = {
  voice: VoiceId
  word: WordId
  pageTime: number
  setToday: string
  pullSignal: number
}

const VOICE_LETTER: Record<VoiceId, string> = { quiet: 'A', human: 'B', bold: 'C' }
const VOICE_NAME: Record<VoiceId, string> = { quiet: 'quiet cut', human: 'human hand', bold: 'bold signal' }
const VOICE_FACE: Record<VoiceId, string> = {
  quiet: 'serif · italic · close set',
  human: 'serif · italic · warm',
  bold: 'sans · heavy · direct',
}

const WORD_GLYPH: Record<WordId, string> = { m3: '⌇', good: '∧', yet: '?' }
const WORD_LABEL: Record<WordId, string> = { m3: 'm³', good: 'good at', yet: 'yet?' }
const WORD_NOTE: Record<WordId, string> = {
  m3: 'a habit, not a name',
  good: 'confidence is generous',
  yet: 'the question stays open',
}

export function ReadingCompass({ voice, word, pageTime, setToday, pullSignal }: ReadingCompassProps) {
  const baseId = useId().replace(/:/g, '')
  const haloId = `rc-halo-${baseId}`
  const rayId = `rc-ray-${baseId}`

  const toneStyle = {
    '--rc-tone': `var(--${voice})`,
    '--rc-active': `var(--${word === 'm3' ? 'quiet' : word === 'good' ? 'human' : 'bold'})`,
    '--rc-time-angle': `${(-90 + pageTime * 360).toFixed(2)}deg`,
  } as CSSProperties

  const sweepTransform = `rotate(${(-90 + pageTime * 360).toFixed(2)}deg)`

  return (
    <div
      className={`reading-compass reading-compass--${voice}`}
      style={toneStyle}
      role="group"
      aria-label={`Reading compass · voice ${VOICE_NAME[voice]} (${VOICE_LETTER[voice]}) · marked at ${WORD_LABEL[word]} · set on ${setToday}`}
      data-pull={pullSignal}
    >
      <svg
        className="reading-compass__svg"
        viewBox="0 0 64 64"
        aria-hidden="true"
      >
        <defs>
          <radialGradient id={haloId} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--rc-tone)" stopOpacity=".22" />
            <stop offset="64%" stopColor="var(--rc-tone)" stopOpacity=".06" />
            <stop offset="100%" stopColor="var(--rc-tone)" stopOpacity="0" />
          </radialGradient>
          <linearGradient id={rayId} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--rc-tone)" stopOpacity="0" />
            <stop offset="50%" stopColor="var(--rc-tone)" stopOpacity=".85" />
            <stop offset="100%" stopColor="var(--rc-tone)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* soft halo that follows the active voice */}
        <circle cx="32" cy="32" r="30" fill={`url(#${haloId})`} />

        {/* outermost tick ring — 24 hour-of-the-broadside marks */}
        <g className="reading-compass__hours" stroke="currentColor" strokeLinecap="round" fill="none">
          {Array.from({ length: 24 }, (_, i) => {
            const angle = (i / 24) * Math.PI * 2 - Math.PI / 2
            const isMajor = i % 6 === 0
            const inner = isMajor ? 24 : 25.4
            const outer = 28
            const x1 = 32 + Math.cos(angle) * inner
            const y1 = 32 + Math.sin(angle) * inner
            const x2 = 32 + Math.cos(angle) * outer
            const y2 = 32 + Math.sin(angle) * outer
            const isPast = i / 24 < pageTime
            return (
              <line
                key={`hr-${i}`}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                strokeWidth={isMajor ? '.55' : '.32'}
                opacity={isPast ? (isMajor ? .85 : .55) : isMajor ? .5 : .25}
              />
            )
          })}
        </g>

        {/* a thin outer ring that holds the hour marks together */}
        <circle cx="32" cy="32" r="22.4" fill="none" stroke="currentColor" strokeWidth=".4" opacity=".55" />
        <circle cx="32" cy="32" r="22.4" fill="none" stroke="currentColor" strokeWidth=".3" strokeDasharray=".5 1.6" opacity=".35" />

        {/* the page-time sweep — a single thin needle that walks with scroll */}
        <g className="reading-compass__sweep" style={{ transform: sweepTransform }}>
          <line x1="32" y1="32" x2="32" y2="13" stroke="currentColor" strokeWidth=".55" strokeLinecap="round" opacity=".95" />
          <circle cx="32" cy="13" r="1.2" fill="currentColor" />
          <circle cx="32" cy="13" r="2.4" fill="none" stroke="currentColor" strokeWidth=".3" opacity=".55" />
        </g>

        {/* the inner ring — voice letter, sits in the centre */}
        <circle cx="32" cy="32" r="16" fill="var(--night)" stroke="currentColor" strokeWidth=".55" opacity=".9" />
        <circle cx="32" cy="32" r="13.6" fill="none" stroke="currentColor" strokeWidth=".3" strokeDasharray=".6 1.4" opacity=".55" />

        {/* the active word glyph — sits small inside the voice letter */}
        <g className="reading-compass__word" aria-hidden="true">
          <text
            x="32"
            y="28.5"
            textAnchor="middle"
            fontFamily="'Iowan Old Style', 'Palatino Linotype', Georgia, serif"
            fontStyle="italic"
            fontSize="11.5"
            fontWeight="500"
            letterSpacing="0"
            fill="currentColor"
            opacity=".95"
          >
            {VOICE_LETTER[voice]}
          </text>
          <text
            x="32"
            y="42"
            textAnchor="middle"
            fontFamily="'Iowan Old Style', 'Palatino Linotype', Georgia, serif"
            fontStyle="italic"
            fontSize="11"
            letterSpacing="0"
            fill="var(--rc-active)"
            opacity=".95"
          >
            {WORD_GLYPH[word]}
          </text>
        </g>

        {/* a single cardinal mark at top — "now" */}
        <g className="reading-compass__cardinal">
          <circle cx="32" cy="6" r="1.4" fill="currentColor" />
          <line x1="32" y1="6" x2="32" y2="9.4" stroke="currentColor" strokeWidth=".4" strokeLinecap="round" opacity=".7" />
        </g>

        {/* three tiny cardinal beads — quiet / human / bold, one per side */}
        <g className="reading-compass__beads" aria-hidden="true">
          <circle cx="6" cy="32" r=".9" fill={voice === 'quiet' ? 'currentColor' : 'currentColor'} opacity={voice === 'quiet' ? .85 : .35} />
          <circle cx="58" cy="32" r=".9" fill="currentColor" opacity={voice === 'human' ? .85 : .35} />
          <circle cx="32" cy="58" r=".9" fill="currentColor" opacity={voice === 'bold' ? .85 : .35} />
        </g>
      </svg>

      <span className="reading-compass__cap" aria-hidden="true">
        <span className="reading-compass__cap-rule reading-compass__cap-rule--l" />
        <em className="reading-compass__cap-key">now</em>
        <span className="reading-compass__cap-rule reading-compass__cap-rule--r" />
      </span>

      <span className="sr-only">
        Reading compass: voice {VOICE_NAME[voice]} ({VOICE_LETTER[voice]}, {VOICE_FACE[voice]}); marked at {WORD_LABEL[word]} — {WORD_NOTE[word]}; set on {setToday}.
      </span>
    </div>
  )
}
