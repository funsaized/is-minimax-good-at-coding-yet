import { useRef, useState } from 'react'
import type { VoiceId } from './App'
export type { VoiceId } from './App'
import type { WordId } from './notes'

type PressProps = {
  voice: VoiceId
  word: WordId
  onVoice: (voice: VoiceId) => void
  setToday: string
}

const ORDER: VoiceId[] = ['quiet', 'human', 'bold']
const NEXT_VOICE: Record<VoiceId, VoiceId> = { quiet: 'human', human: 'bold', bold: 'quiet' }
const VOICE_NAME: Record<VoiceId, string> = { quiet: 'quiet cut', human: 'human hand', bold: 'bold signal' }
const VOICE_LETTER: Record<VoiceId, string> = { quiet: 'A', human: 'B', bold: 'C' }
const VOICE_FACE: Record<VoiceId, string> = {
  quiet: 'serif · italic',
  human: 'serif · italic · warm',
  bold: 'sans · heavy',
}

type Piece = {
  id: 'is' | WordId | 'frontend'
  text: Record<VoiceId, string>
  marked: boolean
  glyph?: string
}

const PIECES: Piece[] = [
  { id: 'is', text: { quiet: 'is', human: 'is', bold: 'is' }, marked: false },
  { id: 'm3', text: { quiet: 'm³', human: 'M3', bold: 'M3' }, marked: true, glyph: '⌇' },
  { id: 'good', text: { quiet: 'good at', human: 'good at', bold: 'good at' }, marked: true, glyph: '∧' },
  { id: 'frontend', text: { quiet: 'frontend', human: 'frontend', bold: 'frontend' }, marked: false },
  { id: 'yet', text: { quiet: 'yet?', human: 'yet?', bold: 'yet?' }, marked: true, glyph: '?' },
]

const PROOF: Record<WordId, { label: string; sub: string }> = {
  m3: { label: 'stet', sub: 'let it stand' },
  good: { label: 'caret', sub: 'make room' },
  yet: { label: 'query', sub: 'protect the pause' },
}

const PRESS_DURATION = 800
const MOTTO: Record<VoiceId, string> = {
  quiet: 'a quiet line is a careful line — let the page do less, then less again.',
  human: 'a small wobble makes the machine feel less like a machine.',
  bold: 'say the whole thing once, in the loudest voice you can keep honest.',
}

export function Press({ voice, word, onVoice, setToday }: PressProps) {
  const [pulling, setPulling] = useState(false)
  const lockRef = useRef(false)

  const pull = () => {
    if (lockRef.current) return
    lockRef.current = true
    setPulling(true)
    onVoice(NEXT_VOICE[voice])
    window.setTimeout(() => {
      setPulling(false)
      lockRef.current = false
    }, PRESS_DURATION)
  }

  const next = NEXT_VOICE[voice]

  return (
    <section className="press reveal" id="press" aria-labelledby="press-title">
      <header className="press__header">
        <span className="eyebrow"><span className="eyebrow__line" />the press bed</span>
        <h2 id="press-title">
          One lever. <em>One line.</em>
        </h2>
        <p className="section__lede">
          Pull the lever to cycle the voice. The sheet on the right is the pulled impression — same line,
          a new face. Click the knob, or press <kbd>shift</kbd>+<kbd>v</kbd>.
        </p>
        <p className="press__motto" aria-hidden="true">
          <em>{MOTTO[voice]}</em>
        </p>
      </header>

      <div className={`press__table press__table--${voice} ${pulling ? 'is-pulling' : ''}`}>
        <div className="press__cell press__cell--lever">
          <button
            type="button"
            className={`press-lever press-lever--${voice} ${pulling ? 'is-pulled' : ''}`}
            onClick={pull}
            aria-label={`Pull the composing lever. Current voice is ${VOICE_NAME[voice]} (${VOICE_FACE[voice]}); next pull will set the line in ${VOICE_NAME[next]}.`}
          >
            <span className="press-lever__cage" aria-hidden="true">
              <span className="press-lever__cage-tick press-lever__cage-tick--top" />
              <span className="press-lever__cage-tick press-lever__cage-tick--mid" />
              <span className="press-lever__cage-tick press-lever__cage-tick--bot" />
            </span>
            <span className="press-lever__shaft" aria-hidden="true">
              <span className="press-lever__knob" aria-hidden="true" />
            </span>
            <span className="press-lever__label" aria-hidden="true">
              <em>pull</em>
              <span>{VOICE_LETTER[voice]}</span>
            </span>
            <span className="press-lever__hint" aria-hidden="true">
              <kbd>shift</kbd>+<kbd>v</kbd>
            </span>
          </button>

          <div className="press-state" aria-live="polite">
            <div className="press-state__row">
              <span className="press-state__key">now</span>
              <em className="press-state__voice">{VOICE_NAME[voice]}</em>
              <span className="press-state__face">{VOICE_FACE[voice]}</span>
            </div>
            <div className="press-state__row press-state__row--next">
              <span className="press-state__key">next</span>
              <em className="press-state__next">{VOICE_NAME[next]}</em>
              <span className="press-state__rule" aria-hidden="true" />
            </div>
            <div className="press-state__row press-state__row--mark">
              <span className="press-state__key">mark</span>
              <em className="press-state__mark">
                <span className="press-state__mark-glyph">{PROOF[word].label === 'stet' ? '⌇' : PROOF[word].label === 'caret' ? '∧' : '?'}</span>
                <span>{PROOF[word].label}</span>
                <em>· {PROOF[word].sub}</em>
              </em>
            </div>
          </div>
        </div>

        <div className="press__cell press__cell--impression">
          <span className="press__cell-key">the impression</span>
          <div className="press__cell-body">
            <div className="press-impression">
              <div className="press-impression__stamp" aria-hidden="true">
                <span>pulled · folio ii</span>
                <span>voice {VOICE_LETTER[voice]}</span>
              </div>
              <div className="press-impression__body">
                {PIECES.map(piece => (
                  <span
                    key={piece.id}
                    className={`press-impression__line ${piece.marked ? 'is-marked' : ''}`}
                    data-glyph={piece.glyph ?? ''}
                  >
                    {piece.text[voice]}
                  </span>
                ))}
              </div>
              <div className="press-impression__sig">
                <span className="press-impression__sig-label">{setToday}</span>
                <span className="press-impression__sig-rule" aria-hidden="true" />
                <span className="press-impression__sig-label">{VOICE_NAME[voice]}</span>
              </div>
              <span className="press-impression__corner" aria-hidden="true" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}