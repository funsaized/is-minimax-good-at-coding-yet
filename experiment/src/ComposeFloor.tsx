import { useEffect, useState } from 'react'
import { NOTES, type WordId } from './notes'

type VoiceId = 'quiet' | 'human' | 'bold'

type ComposeFloorProps = {
  voice: VoiceId
  word: WordId
}

type Piece = {
  id: 'is' | WordId | 'frontend'
  text: Record<VoiceId, string>
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
  quiet: 'serif · italic · close set',
  human: 'serif · italic · warm',
  bold: 'sans · heavy · no apology',
}

const PROOF_LABEL: Record<WordId, string> = {
  m3: 'stet',
  good: 'caret',
  yet: 'query',
}

const PROOF_SUB: Record<WordId, string> = {
  m3: 'let it stand',
  good: 'insert here',
  yet: 'mark for review',
}

function PushPin({ tone }: { tone: 'wax' | 'acid' | 'blue' }) {
  const fill = tone === 'acid' ? 'var(--acid)' : tone === 'blue' ? 'var(--blue)' : 'var(--wax)'
  return (
    <svg className={`compose-floor__pin compose-floor__pin--${tone}`} viewBox="0 0 22 22" aria-hidden="true">
      <ellipse cx="11" cy="19" rx="4.5" ry="1.2" fill="rgba(0, 0, 0, .35)" />
      <line x1="11" y1="14" x2="11" y2="20" stroke="rgba(0, 0, 0, .35)" strokeWidth=".8" />
      <circle cx="11" cy="9" r="6.5" fill={fill} />
      <circle cx="9.5" cy="7.5" r="2" fill="rgba(255, 255, 255, .45)" />
      <circle cx="12" cy="10.5" r="1.2" fill="rgba(0, 0, 0, .25)" />
    </svg>
  )
}

export function ComposeFloor({ voice, word }: ComposeFloorProps) {
  const [resetting, setResetting] = useState(false)
  useEffect(() => {
    setResetting(true)
    const timer = window.setTimeout(() => setResetting(false), 700)
    return () => window.clearTimeout(timer)
  }, [voice])
  const note = NOTES.find(n => n.id === word) ?? NOTES[0]
  const indexNumber = NOTES.findIndex(n => n.id === word)
  const ink: 'acid' | 'coral' | 'blue' =
    word === 'm3' ? 'acid' : word === 'good' ? 'coral' : 'blue'
  const pinTone: 'wax' | 'acid' | 'blue' =
    word === 'm3' ? 'acid' : word === 'good' ? 'wax' : 'blue'

  return (
    <section className="compose-floor section" id="compose" aria-labelledby="compose-floor-title">
      <div className="compose-floor__sheet">
        <span className="compose-floor__plate" aria-hidden="true">folio ii · the compose floor</span>
        <span className="compose-floor__crop compose-floor__crop--tl" aria-hidden="true" />
        <span className="compose-floor__crop compose-floor__crop--tr" aria-hidden="true" />
        <span className="compose-floor__crop compose-floor__crop--bl" aria-hidden="true" />
        <span className="compose-floor__crop compose-floor__crop--br" aria-hidden="true" />

        <header className="compose-floor__head">
          <p className="eyebrow"><span className="eyebrow__line" />the compose floor <em>where the words get set</em></p>
          <h2 id="compose-floor-title">A line is set, then <i>marked up.</i></h2>
          <p className="section__lede">The composing stick below holds the title in pieces. Hover a marked word in the question above and the active piece here rises to meet the margin.</p>
        </header>

        <figure className={`compose-floor__case compose-floor__case--${voice} ${resetting ? 'is-voice-changing' : ''}`} aria-label="Composing stick with the set type">
          <figcaption className="compose-floor__case-caption">
            <span className="compose-floor__case-label">
              <span className="compose-floor__case-dot" aria-hidden="true" />
              composing stick · folio ii
            </span>
            <span className="compose-floor__case-face">{VOICE_FACE[voice]}</span>
            <span className="compose-floor__case-ink">
              ink · <em className={`compose-floor__case-ink-tone compose-floor__case-ink-tone--${ink}`}>{ink}</em>
            </span>
          </figcaption>

          <div className="compose-floor__rail" aria-hidden="false">
            <div className="compose-floor__line" role="list">
              {PIECES.map(piece => {
                const isActive = piece.id === word
                return (
                  <span
                    key={piece.id}
                    role="listitem"
                    className={`compose-floor__piece ${piece.marked ? 'is-marked' : ''} ${isActive ? 'is-active' : ''}`}
                    data-piece={piece.id}
                  >
                    <span className="compose-floor__piece-text">{piece.text[voice]}</span>
                    <span className="compose-floor__piece-kern" aria-hidden="true" />
                  </span>
                )
              })}
            </div>
          </div>

          <div className="compose-floor__case-foot" aria-hidden="true">
            <span className="compose-floor__case-count">× {PIECES.length} pieces · {PIECES.filter(p => p.marked).length} marked</span>
            <span className="compose-floor__case-rule" />
            <span className="compose-floor__case-jog">
              <span className="compose-floor__case-jog-line" />
              <span className="compose-floor__case-jog-line" />
              <span className="compose-floor__case-jog-line" />
            </span>
          </div>
        </figure>

        <aside className={`compose-floor__margin compose-floor__margin--${word}`} aria-label="Working margin note">
          <span className="compose-floor__margin-pin" aria-hidden="true">
            <PushPin tone={pinTone} />
          </span>
          <span className="compose-floor__margin-rule" aria-hidden="true" />
          <div className="compose-floor__margin-card" key={word}>
            <span className="compose-floor__margin-head">
              <span className="compose-floor__margin-num">№ {String(indexNumber + 1).padStart(2, '0')}</span>
              <span className="compose-floor__margin-mark">{PROOF_LABEL[word]}</span>
              <span className="compose-floor__margin-folio">folio {note.folio}</span>
            </span>
            <span className="compose-floor__margin-grid">
              <span className="compose-floor__margin-title">
                <span className="compose-floor__margin-label">{note.label}</span>
                <strong>{note.title}</strong>
              </span>
              <span className="compose-floor__margin-text">
                <em>{note.gloss}</em>
                <p>{note.body}</p>
              </span>
            </span>
            <span className="compose-floor__margin-foot">
              <span className="compose-floor__margin-prompt">{note.prompt}</span>
              <span className="compose-floor__margin-seen">
                <span aria-hidden="true">→</span>
                {PROOF_SUB[word]}
                <span aria-hidden="true" className="compose-floor__margin-dot">·</span>
                {note.seen}
              </span>
            </span>
          </div>
        </aside>

        <p className="compose-floor__caption" aria-hidden="true">
          <span className="compose-floor__caption-mark">※</span>
          The active piece above is the marked word the eye is resting on. The margin below answers it without raising its voice.
        </p>
      </div>
    </section>
  )
}
