import { useEffect, useId, useRef, useState, type CSSProperties } from 'react'
import type { VoiceId } from './App'
import type { WordId } from './notes'

type ProofLineProps = {
  voice: VoiceId
  selected: WordId
  pullSignal: number
  onSelect: (id: WordId, mode: 'word' | 'voice') => void
}

type VoiceSpec = {
  letter: string
  name: string
  face: string
  family: string
  weight: number
  style: 'italic' | 'normal'
  tracking: string
  uppercased: boolean
  index: string
  caption: string
}

const VOICES: Record<VoiceId, VoiceSpec> = {
  quiet: {
    letter: 'A',
    name: 'quiet cut',
    face: 'serif · italic · close',
    family: "'Iowan Old Style', 'Palatino Linotype', Georgia, serif",
    weight: 400,
    style: 'italic',
    tracking: '-.018em',
    uppercased: false,
    index: 'i',
    caption: 'the default voice',
  },
  human: {
    letter: 'B',
    name: 'human hand',
    face: 'serif · italic · warm',
    family: "'Iowan Old Style', 'Palatino Linotype', Georgia, serif",
    weight: 500,
    style: 'italic',
    tracking: '-.014em',
    uppercased: false,
    index: 'ii',
    caption: 'the middle voice',
  },
  bold: {
    letter: 'C',
    name: 'bold signal',
    face: 'sans · heavy · direct',
    family: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
    weight: 800,
    style: 'normal',
    tracking: '-.04em',
    uppercased: true,
    index: 'iii',
    caption: 'the loud voice',
  },
}

type LinePiece = { text: string; id: WordId | 'plain'; tone: VoiceId }

const LINE: LinePiece[] = [
  { text: 'is', id: 'plain', tone: 'quiet' },
  { text: ' ', id: 'plain', tone: 'quiet' },
  { text: 'm³', id: 'm3', tone: 'quiet' },
  { text: ' ', id: 'plain', tone: 'quiet' },
  { text: 'good at', id: 'good', tone: 'quiet' },
  { text: ' ', id: 'plain', tone: 'quiet' },
  { text: 'frontend', id: 'plain', tone: 'quiet' },
  { text: ' ', id: 'plain', tone: 'quiet' },
  { text: 'yet?', id: 'yet', tone: 'quiet' },
]

const PROOF: Record<WordId, { mark: string; glyph: string; tint: string }> = {
  m3: { mark: 'stet', glyph: '⌇', tint: 'rgba(168, 197, 255, .85)' },
  good: { mark: 'caret', glyph: '∧', tint: 'rgba(244, 132, 114, .85)' },
  yet: { mark: 'query', glyph: '?', tint: 'rgba(205, 238, 106, .85)' },
}

const ORDER: VoiceId[] = ['quiet', 'human', 'bold']

export function ProofLine({ voice, selected, pullSignal, onSelect }: ProofLineProps) {
  const [stamped, setStamped] = useState(0)
  const lastPull = useRef(pullSignal)

  useEffect(() => {
    if (lastPull.current === pullSignal) return
    lastPull.current = pullSignal
    const id = window.setTimeout(() => setStamped(pullSignal), 0)
    const id2 = window.setTimeout(() => setStamped(0), 1200)
    return () => {
      window.clearTimeout(id)
      window.clearTimeout(id2)
    }
  }, [pullSignal])

  return (
    <section
      className={`proof-line reveal`}
      id="notes"
      aria-labelledby="proof-line-title"
    >
      <header className="proof-line__header">
        <span className="eyebrow"><span className="eyebrow__line" />the proof line</span>
        <h2 id="proof-line-title" className="proof-line__title">
          Three proofs, <em>one line.</em>
        </h2>
        <p className="section__lede">
          Pulled from the same press, set three ways. Each card is a proof — pin it to set the page in that voice
          and mark its word at the same time. The cord is the voice you are currently reading in.
        </p>
      </header>

      <div className={`proof-line__board proof-line__board--${voice}`}>
        <span className="proof-line__cord" aria-hidden="true">
          <span className="proof-line__cord-knot proof-line__cord-knot--l" />
          <span className="proof-line__cord-line" />
          <span className="proof-line__cord-knot proof-line__cord-knot--r" />
        </span>

        <ol className="proof-line__list">
          {ORDER.map((v, idx) => (
            <ProofCard
              key={v}
              cardVoice={v}
              activeVoice={voice}
              marked={selected}
              onWord={() => onSelect(VOICE_FOR_WORD[v], 'word')}
              onVoice={() => onSelect(VOICE_FOR_WORD[v], 'voice')}
              index={idx}
              stamped={stamped === pullSignal}
            />
          ))}
        </ol>

        <span className="proof-line__rail" aria-hidden="true">
          <span className="proof-line__rail-bead" />
          <em>tap a card · set the page</em>
          <span className="proof-line__rail-bead" />
        </span>
      </div>
    </section>
  )
}

const VOICE_FOR_WORD: Record<VoiceId, WordId> = {
  quiet: 'm3',
  human: 'good',
  bold: 'yet',
}

type ProofCardProps = {
  cardVoice: VoiceId
  activeVoice: VoiceId
  marked: WordId
  onWord: () => void
  onVoice: () => void
  index: number
  stamped: boolean
}

function ProofCard({ cardVoice, activeVoice, marked, onWord, onVoice, index, stamped }: ProofCardProps) {
  const spec = VOICES[cardVoice]
  const cardWord = VOICE_FOR_WORD[cardVoice]
  const isActive = activeVoice === cardVoice
  const wordHighlighted = marked === cardWord
  const isMarked = isActive && wordHighlighted
  const style = {
    fontFamily: spec.family,
    fontWeight: spec.weight,
    fontStyle: spec.style,
    letterSpacing: spec.tracking,
    textTransform: spec.uppercased ? ('uppercase' as const) : ('none' as const),
    '--card-tone': `var(--${cardVoice})`,
    '--card-rotate': `${(index - 1) * 0.8}deg`,
    '--card-delay': `${index * 70}ms`,
  } as CSSProperties

  const pinGradId = useId().replace(/:/g, '')

  return (
    <li className="proof-card-wrap">
      <button
        type="button"
        className={`proof-card proof-card--${cardVoice} ${isActive ? 'is-active' : ''} ${wordHighlighted ? 'is-marked' : ''} ${stamped ? 'is-stamping' : ''}`}
        style={style}
        onClick={() => {
          onVoice()
          onWord()
        }}
        aria-label={`Card ${spec.index} · set in ${spec.name}. Tap to set the page in ${spec.name} and mark the word "${spec.name === 'quiet cut' ? 'm³' : spec.name === 'human hand' ? 'good at' : 'yet?'}".`}
      >
        <span className="proof-card__corner proof-card__corner--tl" aria-hidden="true" />
        <span className="proof-card__corner proof-card__corner--tr" aria-hidden="true" />
        <span className="proof-card__corner proof-card__corner--bl" aria-hidden="true" />
        <span className="proof-card__corner proof-card__corner--br" aria-hidden="true" />

        <span className="proof-card__pin-wrap" aria-hidden="true">
          <svg className="proof-card__pin" viewBox="0 0 24 24" width="22" height="22">
            <defs>
              <radialGradient id={pinGradId} cx="35%" cy="35%" r="65%">
                <stop offset="0%" stopColor="rgba(245, 238, 216, .9)" />
                <stop offset="55%" stopColor="currentColor" stopOpacity=".75" />
                <stop offset="100%" stopColor="currentColor" stopOpacity=".3" />
              </radialGradient>
            </defs>
            <circle cx="12" cy="11" r="6" fill={`url(#${pinGradId})`} stroke="currentColor" strokeWidth=".6" />
            <circle cx="12" cy="11" r="2.6" fill="var(--night)" />
            <line x1="12" y1="14" x2="12" y2="22" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
          <span className="proof-card__pin-spike" aria-hidden="true" />
        </span>

        <header className="proof-card__head">
          <span className="proof-card__index" aria-hidden="true">№ {spec.index}</span>
          <span className="proof-card__voice" aria-hidden="true">
            <span className="proof-card__letter">{spec.letter}</span>
            <span className="proof-card__voice-copy">
              <em>{spec.name}</em>
              <span>{spec.face}</span>
            </span>
          </span>
          <span
            className={`proof-card__mark proof-card__mark--${cardWord}`}
            aria-hidden="true"
          >
            <span className="proof-card__mark-glyph">{PROOF[cardWord].glyph}</span>
            <span>{PROOF[cardWord].mark}</span>
          </span>
        </header>

        <p className="proof-card__line" aria-hidden="true">
          {LINE.map((piece, pidx) => {
            const isMarkedWord = piece.id === cardWord
            const segStyle = {
              '--seg-idx': String(pidx),
            } as CSSProperties
            if (piece.id === 'plain') {
              return (
                <span
                  key={`${cardVoice}-${pidx}`}
                  className="proof-card__seg"
                  style={segStyle}
                >
                  {piece.text}
                </span>
              )
            }
            return (
              <span
                key={`${cardVoice}-${pidx}`}
                className={`proof-card__seg proof-card__seg--marked ${isMarkedWord ? 'is-marked' : ''}`}
                style={segStyle}
                aria-hidden="true"
              >
                {piece.text}
                {isMarkedWord && (
                  <span className="proof-card__seg-mark" aria-hidden="true">
                    {PROOF[cardWord].glyph}
                  </span>
                )}
              </span>
            )
          })}
        </p>

        <footer className="proof-card__foot" aria-hidden="true">
          <span className="proof-card__foot-rule" />
          <em className="proof-card__foot-caption">{spec.caption}</em>
          <span className="proof-card__foot-rule" />
        </footer>

        <span className="proof-card__datum" aria-hidden="true">
          <span>tap to set</span>
          <span>folio · iii</span>
        </span>
      </button>
    </li>
  )
}
