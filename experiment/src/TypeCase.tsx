type VoiceId = 'quiet' | 'human' | 'bold'
type WordId = 'm3' | 'good' | 'yet'

type TypeCaseProps = {
  voice: VoiceId
  word: WordId
}

type Piece = {
  id: 'is' | WordId | 'frontend'
  text: { quiet: string; human: string; bold: string }
  marked: boolean
}

const PIECES: Piece[] = [
  { id: 'is', text: { quiet: 'is', human: 'is', bold: 'is' }, marked: false },
  { id: 'm3', text: { quiet: 'Minimax M3', human: 'M3', bold: 'M3' }, marked: true },
  { id: 'good', text: { quiet: 'good at', human: 'good at', bold: 'good at' }, marked: true },
  { id: 'frontend', text: { quiet: 'frontend', human: 'frontend', bold: 'frontend' }, marked: false },
  { id: 'yet', text: { quiet: 'yet?', human: 'yet?', bold: 'yet?' }, marked: true },
]

const VOICE_FACE: Record<VoiceId, string> = {
  quiet: 'serif · italic · 36pt',
  human: 'serif · italic · 36pt',
  bold: 'sans · heavy · 36pt',
}

const VOICE_INK: Record<VoiceId, string> = {
  quiet: 'midnight + acid',
  human: 'midnight + coral',
  bold: 'midnight + acid',
}

export function TypeCase({ voice, word }: TypeCaseProps) {
  return (
    <figure className={`type-case type-case--${voice}`} aria-label="Composing stick with the set type">
      <figcaption className="type-case__caption">
        <span className="type-case__label">
          <span className="type-case__dot" aria-hidden="true" />
          composing stick
        </span>
        <span className="type-case__face">{VOICE_FACE[voice]}</span>
        <span className="type-case__meta">
          <span className="type-case__folio" aria-hidden="true">folio iv</span>
          <span aria-hidden="true">·</span>
          <span>set today</span>
        </span>
      </figcaption>
      <div className="type-case__rail">
        <div className="type-case__line" role="list">
          {PIECES.map((piece) => {
            const isActive = piece.id === word
            return (
              <span
                key={piece.id}
                role="listitem"
                className={`type-case__piece ${piece.marked ? 'is-marked' : ''} ${isActive ? 'is-active' : ''}`}
                data-piece={piece.id}
              >
                <span className="type-case__face-text">{piece.text[voice]}</span>
                <span className="type-case__piece-kern" aria-hidden="true" />
              </span>
            )
          })}
        </div>
      </div>
      <div className="type-case__foot">
        <span className="type-case__count">× {PIECES.length} pieces</span>
        <div className="type-case__scale" aria-hidden="true">
          {Array.from({ length: 40 }).map((_, i) => (
            <span key={i} className={i % 5 === 0 ? 'is-major' : i % 1 === 0 ? 'is-minor' : ''} />
          ))}
        </div>
        <span className="type-case__ink">ink: {VOICE_INK[voice]}</span>
      </div>
    </figure>
  )
}
