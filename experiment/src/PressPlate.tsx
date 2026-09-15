import { forwardRef, type CSSProperties } from 'react'
import type { KeyboardEvent as ReactKeyboardEvent } from 'react'
import type { VoiceId } from './Press'

type PressPlateProps = {
  voice: VoiceId
  answerOpen: boolean
  readerName: string
  onVoice: (voice: VoiceId) => void
  onVoiceKey: (event: ReactKeyboardEvent<HTMLButtonElement>, voice: VoiceId) => void
  onToggleAnswer: () => void
  setToday: string
}

type VoiceEntry = {
  id: VoiceId
  letter: string
  name: string
  face: string
  tone: string
}

const VOICES: VoiceEntry[] = [
  { id: 'quiet', letter: 'A', name: 'quiet cut', face: 'serif · close set', tone: 'var(--blue)' },
  { id: 'human', letter: 'B', name: 'human hand', face: 'italic · a little warm', tone: 'var(--coral)' },
  { id: 'bold', letter: 'C', name: 'bold signal', face: 'display · no apology', tone: 'var(--acid)' },
]

export const PressPlate = forwardRef<HTMLButtonElement, PressPlateProps>(function PressPlate(
  { voice, answerOpen, readerName, onVoice, onVoiceKey, onToggleAnswer, setToday },
  triggerRef,
) {
  const reader = readerName.trim()
  const style = { '--press-plate-tone': `var(--${voice === 'quiet' ? 'blue' : voice === 'human' ? 'coral' : 'acid'})` } as CSSProperties
  return (
    <aside className={`press-plate press-plate--${voice} ${answerOpen ? 'is-answer-open' : ''}`} aria-label="Press bed plate" style={style}>
      <span className="press-plate__crop press-plate__crop--tl" aria-hidden="true" />
      <span className="press-plate__crop press-plate__crop--tr" aria-hidden="true" />
      <span className="press-plate__crop press-plate__crop--bl" aria-hidden="true" />
      <span className="press-plate__crop press-plate__crop--br" aria-hidden="true" />

      <header className="press-plate__head" aria-hidden="true">
        <span className="press-plate__head-mark">※</span>
        <span className="press-plate__head-line">the press bed · plate</span>
        <span className="press-plate__head-mark press-plate__head-mark--alt">※</span>
      </header>

      <div className="press-plate__inner" role="group" aria-label="Press controls">
        <div className="press-plate__voices" role="tablist" aria-label="Choose a typographic voice">
          <span className="press-plate__voices-eyebrow" aria-hidden="true">
            <span className="press-plate__voices-eyebrow-rule" />
            <span className="press-plate__voices-eyebrow-tag">set in</span>
            <span className="press-plate__voices-eyebrow-rule" />
          </span>
          <ol className="press-plate__voices-list">
            {VOICES.map((entry, index) => {
              const isActive = entry.id === voice
              return (
                <li key={entry.id} className={`press-plate__voice ${isActive ? 'is-active' : ''}`}>
                  <button
                    type="button"
                    className={`press-plate__voice-button press-plate__voice-button--${entry.id}`}
                    onClick={() => onVoice(entry.id)}
                    onKeyDown={event => onVoiceKey(event, entry.id)}
                    role="tab"
                    aria-selected={isActive}
                    aria-controls="page-title"
                    tabIndex={isActive ? 0 : -1}
                  >
                    <span className="press-plate__voice-bullet" aria-hidden="true">
                      <span className="press-plate__voice-bullet-dot" />
                      <span className="press-plate__voice-bullet-ring" />
                    </span>
                    <span className="press-plate__voice-letter" aria-hidden="true">{entry.letter}</span>
                    <span className="press-plate__voice-copy">
                      <span className="press-plate__voice-name">{entry.name}</span>
                      <span className="press-plate__voice-face">{entry.face}</span>
                    </span>
                  </button>
                  {index < VOICES.length - 1 && (
                    <span className="press-plate__voice-divider" aria-hidden="true">
                      <svg viewBox="0 0 12 18" preserveAspectRatio="none">
                        <path d="M2 3 C 9 7, 4 11, 10 15" fill="none" stroke="currentColor" strokeWidth=".55" />
                      </svg>
                    </span>
                  )}
                </li>
              )
            })}
          </ol>
        </div>

        <span className="press-plate__rule" aria-hidden="true">
          <span className="press-plate__rule-line press-plate__rule-line--a" />
          <span className="press-plate__rule-mark" aria-hidden="true">
            <svg viewBox="0 0 18 18">
              <circle cx="9" cy="9" r="6.4" fill="none" stroke="currentColor" strokeWidth=".4" />
              <circle cx="9" cy="9" r="1.5" fill="currentColor" />
            </svg>
          </span>
          <span className="press-plate__rule-line press-plate__rule-line--b" />
        </span>

        <div className="press-plate__action" aria-label="Open the editor's note">
          <span className="press-plate__action-eyebrow" aria-hidden="true">
            <span className="press-plate__action-eyebrow-rule" />
            <span className="press-plate__action-eyebrow-tag">then read</span>
            <span className="press-plate__action-eyebrow-rule" />
          </span>
          <button
            ref={triggerRef}
            type="button"
            className={`press-plate__action-button ${answerOpen ? 'is-open' : ''}`}
            onClick={onToggleAnswer}
            aria-expanded={answerOpen}
            aria-controls="answer"
          >
            <span className="press-plate__action-corner" aria-hidden="true">
              <svg viewBox="0 0 32 32">
                <path
                  d="M5 6 L5 28 L27 28"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth=".6"
                  strokeLinecap="round"
                  className="press-plate__action-corner-crease"
                />
                <path
                  d="M5 6 L27 28"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth=".9"
                  strokeLinecap="round"
                  className="press-plate__action-corner-fold"
                />
                <circle cx="16" cy="18" r="1.2" fill="currentColor" className="press-plate__action-corner-bead" />
              </svg>
            </span>
            <span className="press-plate__action-copy">
              <span className="press-plate__action-eyebrow-2">folio viii</span>
              <span className="press-plate__action-line">{answerOpen ? 'fold the answer back' : "open the editor's note"}</span>
              {reader.length > 0 && (
                <span className="press-plate__action-for">
                  <span className="press-plate__action-for-rule" aria-hidden="true" />
                  for <em>{reader}</em>
                </span>
              )}
            </span>
            <span className="press-plate__action-arrow" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path
                  d="M4 12h15M13 6l6 6-6 6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </button>
        </div>
      </div>

      <footer className="press-plate__foot" aria-hidden="true">
        <span className="press-plate__foot-rule press-plate__foot-rule--a" />
        <span className="press-plate__foot-row">
          <span className="press-plate__foot-cell">
            <span className="press-plate__foot-cell-key">now setting in</span>
            <em className="press-plate__foot-cell-value">the {VOICES.find(v => v.id === voice)?.name}</em>
          </span>
          <span className="press-plate__foot-cell press-plate__foot-cell--key">
            <span className="press-plate__foot-cell-key">cycle</span>
            <em className="press-plate__foot-cell-value press-plate__foot-cell-kbd">
              <kbd>shift</kbd><span aria-hidden="true">+</span><kbd>v</kbd>
            </em>
          </span>
          <span className="press-plate__foot-cell press-plate__foot-cell--key">
            <span className="press-plate__foot-cell-key">set today</span>
            <em className="press-plate__foot-cell-value">{setToday}</em>
          </span>
        </span>
        <span className="press-plate__foot-rule press-plate__foot-rule--b" />
      </footer>
    </aside>
  )
})
