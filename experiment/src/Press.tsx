import { useEffect, useRef, useState } from 'react'
import { NOTES, type WordId } from './notes'
import { FolioImprint } from './FolioImprint'

export type VoiceId = 'quiet' | 'human' | 'bold'

type PressProps = {
  voice: VoiceId
  word: WordId
  onVoice: (voice: VoiceId) => void
}

const VOICE_ORDER: VoiceId[] = ['quiet', 'human', 'bold']
const NEXT_VOICE: Record<VoiceId, VoiceId> = { quiet: 'human', human: 'bold', bold: 'quiet' }
const VOICE_LABEL: Record<VoiceId, string> = { quiet: 'quiet cut', human: 'human hand', bold: 'bold signal' }
const VOICE_LETTER: Record<VoiceId, string> = { quiet: 'A', human: 'B', bold: 'C' }
const VOICE_FACE: Record<VoiceId, string> = {
  quiet: 'serif · italic · close set',
  human: 'serif · italic · warm',
  bold: 'sans · heavy · no apology',
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

const PROOF_LABEL: Record<WordId, string> = { m3: 'stet', good: 'caret', yet: 'query' }
const PROOF_SUB: Record<WordId, string> = { m3: 'let it stand', good: 'insert here', yet: 'mark for review' }

const PRESS_DURATION = 1500

export function Press({ voice, word, onVoice }: PressProps) {
  const [pulling, setPulling] = useState(false)
  const [impressionIndex, setImpressionIndex] = useState(VOICE_ORDER.indexOf(voice))
  const lockRef = useRef(false)
  const note = NOTES.find(n => n.id === word) ?? NOTES[0]
  const activeIndex = Math.max(0, NOTES.findIndex(n => n.id === word))
  const nextVoice = NEXT_VOICE[voice]
  const voiceIndex = VOICE_ORDER.indexOf(voice)
  const nextLetter = VOICE_LETTER[nextVoice]

  useEffect(() => {
    if (pulling) return
    setImpressionIndex(voiceIndex)
  }, [voiceIndex, pulling])

  const pull = () => {
    if (lockRef.current) return
    lockRef.current = true
    setPulling(true)
    onVoice(nextVoice)
    window.setTimeout(() => {
      setPulling(false)
      lockRef.current = false
    }, PRESS_DURATION)
  }

  return (
    <section className="press section" id="press" aria-labelledby="press-title">
      <div className={`press__sheet press__sheet--${voice} ${pulling ? 'is-pulling' : ''}`}>
        <span className="press__plate" aria-hidden="true">folio ii · the press bed</span>
        <span className="press__crop press__crop--tl" aria-hidden="true" />
        <span className="press__crop press__crop--tr" aria-hidden="true" />
        <span className="press__crop press__crop--bl" aria-hidden="true" />
        <span className="press__crop press__crop--br" aria-hidden="true" />

        <header className="press__head">
          <p className="eyebrow">
            <span className="eyebrow__line" />
            the press bed <em>where the line gets set</em>
          </p>
          <h2 id="press-title">One lever. <i>One line.</i> Three settings.</h2>
          <p className="section__lede">
            A working spread of the press itself: the lever on the left, the composing stick in the middle, the pulled impression on the right. Pull the lever and the line gets set in the next voice.
          </p>
          <p className="press__motto">
            <span className="press__motto-mark" />
            <em className="press__motto-line">
              {voice === 'quiet'
                ? 'a quiet line is a careful line — let the page do less, then less again.'
                : voice === 'human'
                ? 'a small wobble makes the machine feel less like a machine.'
                : 'say the whole thing once, in the loudest voice you can keep honest.'}
            </em>
            <span className="press__motto-mark press__motto-mark--alt" />
          </p>
        </header>

        <div className="press__spread">
          <div className="press__lever-zone" aria-label="The composing lever">
            <span className="press__lever-eyebrow" aria-hidden="true">the lever</span>
            <button
              type="button"
              className={`press__lever press__lever--${voice} ${pulling ? 'is-pulling' : ''}`}
              onClick={pull}
              aria-label={`Pull the composing lever. The current press is set in the ${VOICE_LABEL[voice]} voice. Pulling cycles to ${VOICE_LABEL[nextVoice]}.`}
            >
              <span className="press__lever-cage" aria-hidden="true">
                <span className="press__lever-cage-rail press__lever-cage-rail--left" />
                <span className="press__lever-cage-rail press__lever-cage-rail--right" />
                <span className="press__lever-cage-cap" />
                <span className="press__lever-cage-tick press__lever-cage-tick--top" />
                <span className="press__lever-cage-tick press__lever-cage-tick--mid" />
              </span>
              <span className="press__lever-pull" aria-hidden="true">pull</span>
              <span className="press__lever-handle" aria-hidden="true">
                <span className="press__lever-knob" />
                <span className="press__lever-knob-shadow" />
                <span className="press__lever-knob-highlight" />
                <span className="press__lever-knob-band" />
                <span className="press__lever-knob-rivet press__lever-knob-rivet--a" />
                <span className="press__lever-knob-rivet press__lever-knob-rivet--b" />
              </span>
              <span className="press__lever-stem" aria-hidden="true">
                <span className="press__lever-stem-rail" />
                <span className="press__lever-stem-pin" />
              </span>
            </button>
            <span className="press__lever-hint" aria-hidden="true">
              click · or <kbd>shift</kbd><span aria-hidden="true">+</span><kbd>v</kbd>
            </span>

            <span className="press__lever-now" aria-live="polite">
              <span className="press__lever-now-eyebrow">the press is set in</span>
              <span className="press__lever-now-row">
                <span className={`press__lever-now-letter press__lever-now-letter--${voice}`}>{VOICE_LETTER[voice]}</span>
                <span className="press__lever-now-name">{VOICE_LABEL[voice]}</span>
              </span>
              <span className="press__lever-now-face">{VOICE_FACE[voice]}</span>
              <span className="press__lever-next" aria-hidden="true">
                <span className="press__lever-next-tag">next pull</span>
                <span className={`press__lever-next-letter press__lever-next-letter--${nextVoice}`}>{nextLetter}</span>
                <span className="press__lever-next-name">{VOICE_LABEL[nextVoice]}</span>
              </span>
            </span>
          </div>

          <div className="press__stick-zone" aria-label="The composing stick">
            <span className="press__stick-eyebrow" aria-hidden="true">the composing stick</span>
            <span className="press__stick-rule press__stick-rule--top" aria-hidden="true" />
            <div className={`press__stick press__stick--${voice}`}>
              <div className="press__stick-line">
                {PIECES.map(piece => {
                  const isActive = piece.id === word
                  return (
                    <span
                      key={piece.id}
                      className={`press__stick-piece ${piece.marked ? 'is-marked' : ''} ${isActive ? 'is-active' : ''}`}
                      data-piece={piece.id}
                    >
                      <span className="press__stick-piece-text">{piece.text[voice]}</span>
                      <span className="press__stick-piece-kern" aria-hidden="true" />
                    </span>
                  )
                })}
              </div>
            </div>
            <span className="press__stick-rule press__stick-rule--bottom" aria-hidden="true" />

            <span className="press__stick-callout" aria-live="polite">
              <span className="press__stick-callout-mark" aria-hidden="true">↑</span>
              <span className="press__stick-callout-copy">
                <span className="press__stick-callout-label">active piece</span>
                <strong>{note.label}</strong>
              </span>
              <span className="press__stick-callout-meta">
                <span className="press__stick-callout-folio">№ {String(activeIndex + 1).padStart(2, '0')}</span>
                <span className="press__stick-callout-mark-tag">{PROOF_LABEL[word]}</span>
                <span className="press__stick-callout-mark-sub">{PROOF_SUB[word]}</span>
              </span>
            </span>

            <span className="press__stick-active-rule" aria-hidden="true">
              <svg viewBox="0 0 200 12" preserveAspectRatio="none">
                <path
                  d="M2 6c10-6 22 4 36-1s22-5 36-2 22 4 36-2 22-4 36-1 22 4 36-1 14-2 14-2"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.9"
                  strokeLinecap="round"
                />
                <circle cx="196" cy="6" r="1.1" fill="currentColor" />
              </svg>
            </span>
          </div>

          <div className="press__impression-zone" aria-label="The pulled impression">
            <span className="press__impression-eyebrow" aria-hidden="true">the impression</span>
            <div className="press__impression-frame">
              <span className="press__impression-corner press__impression-corner--tl" aria-hidden="true" />
              <span className="press__impression-corner press__impression-corner--tr" aria-hidden="true" />
              <span className="press__impression-corner press__impression-corner--bl" aria-hidden="true" />
              <span className="press__impression-corner press__impression-corner--br" aria-hidden="true" />
              <span className="press__impression-bed" aria-hidden="true">
                <svg viewBox="0 0 100 100" preserveAspectRatio="none">
                  <line x1="0" y1="14" x2="100" y2="14" stroke="currentColor" strokeWidth=".25" opacity=".55" />
                  <line x1="0" y1="42" x2="100" y2="42" stroke="currentColor" strokeWidth=".2" opacity=".4" />
                  <line x1="0" y1="58" x2="100" y2="58" stroke="currentColor" strokeWidth=".2" opacity=".4" />
                  <line x1="0" y1="86" x2="100" y2="86" stroke="currentColor" strokeWidth=".25" opacity=".55" />
                </svg>
              </span>
              <span className="press__impression-colorbar" aria-hidden="true">
                <span style={{ background: 'rgba(146, 186, 255, .9)' }} />
                <span style={{ background: 'rgba(216, 255, 106, .85)' }} />
                <span style={{ background: 'rgba(255, 118, 95, .85)' }} />
                <span style={{ background: 'rgba(17, 21, 33, .9)' }} />
              </span>
              {VOICE_ORDER.map((v, idx) => (
                <div
                  key={v}
                  className={`press__impression-sheet press__impression-sheet--${v} ${
                    impressionIndex === idx ? 'is-active' : ''
                  } ${impressionIndex > idx ? 'is-past' : ''}`}
                  aria-hidden={impressionIndex !== idx}
                >
                  <span className="press__impression-sheet-folio" aria-hidden="true">
                    folio ii · pulled {String(idx + 1).padStart(2, '0')}/03
                  </span>
                  <div className={`press__impression-title press__impression-title--${v}`}>
                    {PIECES.map((piece) => (
                      <span key={piece.id} className={`press__impression-line ${piece.marked ? 'is-marked' : ''}`}>
                        <span className="press__impression-line-text">{piece.text[v]}</span>
                        {piece.marked && (
                          <span className="press__impression-line-mark" aria-hidden="true">
                            {piece.id === 'm3' ? '⌇' : piece.id === 'good' ? '∧' : '?'}
                          </span>
                        )}
                      </span>
                    ))}
                  </div>
                  <span className="press__impression-stamp" aria-hidden="true">
                    <svg viewBox="0 0 48 48">
                      <circle cx="24" cy="24" r="20" fill="none" stroke="currentColor" strokeWidth="1.1" />
                      <circle cx="24" cy="24" r="16" fill="none" stroke="currentColor" strokeWidth=".4" strokeDasharray="1 2" opacity=".7" />
                      <text x="24" y="20" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="3.6" letterSpacing="1.4" fill="currentColor">PULLED</text>
                      <text x="24" y="30" textAnchor="middle" fontFamily="Georgia, serif" fontStyle="italic" fontSize="11" fill="currentColor">m³</text>
                      <text x="24" y="38" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="3.2" letterSpacing="1.2" fill="currentColor">{VOICE_LETTER[v].toUpperCase()} · {idx + 1}</text>
                    </svg>
                  </span>
                  <span className="press__impression-foot">
                    <span className="press__impression-foot-mark">{PROOF_LABEL[word]}</span>
                    <span className="press__impression-foot-voice">set in {VOICE_LABEL[v]}</span>
                  </span>
                </div>
              ))}
            </div>
            <span className="press__impression-hint" aria-hidden="true">
              a sheet pulled from the press · the words you keep close stay marked
            </span>
          </div>
        </div>

        <p className="press__caption">
          <span aria-hidden="true">※</span>
          The lever is bound to the title above and the type plate that follows. One voice, three readings, one line.
        </p>

        <div className="press__sign-off">
          <FolioImprint voice={voice} variant="motto" number="№ ii · 1/3" />
        </div>
      </div>
    </section>
  )
}
