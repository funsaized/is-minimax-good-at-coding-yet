import { forwardRef, type CSSProperties } from 'react'
import type { VoiceId } from './Press'

type PressLeverProps = {
  voice: VoiceId
  answerOpen: boolean
  readerName: string
  onToggleAnswer: () => void
  setToday: string
  stamping?: boolean
}

const VOICE_TONE: Record<VoiceId, string> = {
  quiet: 'var(--blue)',
  human: 'var(--coral)',
  bold: 'var(--acid)',
}

const VOICE_LETTER: Record<VoiceId, string> = { quiet: 'A', human: 'B', bold: 'C' }
const VOICE_NAME: Record<VoiceId, string> = { quiet: 'quiet cut', human: 'human hand', bold: 'bold signal' }
const VOICE_FACE: Record<VoiceId, string> = {
  quiet: 'serif · close set',
  human: 'italic · a little warm',
  bold: 'display · no apology',
}

export const PressLever = forwardRef<HTMLButtonElement, PressLeverProps>(function PressLever(
  { voice, answerOpen, readerName, onToggleAnswer, setToday, stamping = false },
  triggerRef,
) {
  const reader = readerName.trim()
  const tone = VOICE_TONE[voice]
  const style = { '--press-lever-tone': tone } as CSSProperties

  return (
    <aside
      className={`press-lever press-lever--${voice} ${answerOpen ? 'is-open' : ''} ${reader ? 'is-signed' : ''}`}
      aria-label="The press lever · opens the editor's note"
      style={style}
    >

      <span className="press-lever__crop press-lever__crop--tl" aria-hidden="true" />
      <span className="press-lever__crop press-lever__crop--tr" aria-hidden="true" />
      <span className="press-lever__crop press-lever__crop--bl" aria-hidden="true" />
      <span className="press-lever__crop press-lever__crop--br" aria-hidden="true" />

      <span className="press-lever__bloom" aria-hidden="true" />

      <header className="press-lever__head" aria-hidden="true">
        <span className="press-lever__head-rule" />
        <span className="press-lever__head-tag">
          <span className="press-lever__head-mark">※</span>
          the press lever
          <span className="press-lever__head-mark press-lever__head-mark--alt">※</span>
        </span>
        <span className="press-lever__head-key">folio viii</span>
        <span className="press-lever__head-rule" />
      </header>

      <div className="press-lever__main">
        <span
          className={`press-lever__lever ${answerOpen ? 'is-pulled' : ''}`}
          aria-hidden="true"
        >
          <span className="press-lever__lever-rule" />
          <span className="press-lever__lever-rule press-lever__lever-rule--low" />
          <svg viewBox="0 0 80 240" className="press-lever__lever-svg" preserveAspectRatio="xMidYMid meet">
            <g className="press-lever__lever-cage">
              <path d="M14 6 H66" stroke="currentColor" strokeWidth=".8" strokeLinecap="round" opacity=".6" />
              <path d="M16 14 H64" stroke="currentColor" strokeWidth=".4" strokeDasharray="1.6 2.4" opacity=".45" />
              <path d="M14 230 H66" stroke="currentColor" strokeWidth=".8" strokeLinecap="round" opacity=".5" />
            </g>
            <g className="press-lever__lever-pivot">
              <circle cx="40" cy="208" r="6" fill="none" stroke="currentColor" strokeWidth=".7" />
              <circle cx="40" cy="208" r="2.6" fill="currentColor" />
            </g>
            <g className="press-lever__lever-shaft-group">
              <line
                className="press-lever__lever-shaft"
                x1="40" y1="22"
                x2="40" y2="208"
                stroke="currentColor"
                strokeWidth="2.6"
                strokeLinecap="round"
              />
              <line
                x1="40" y1="40" x2="40" y2="190"
                stroke="var(--night)"
                strokeWidth=".6"
                strokeLinecap="round"
                opacity=".55"
              />
              <g className="press-lever__lever-knob">
                {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(angle => {
                  const rad = (angle * Math.PI) / 180
                  return (
                    <line
                      key={angle}
                      x1={40 + Math.cos(rad) * 12.5}
                      y1={34 + Math.sin(rad) * 12.5}
                      x2={40 + Math.cos(rad) * 16.5}
                      y2={34 + Math.sin(rad) * 16.5}
                      stroke="var(--night)"
                      strokeWidth=".5"
                      strokeLinecap="round"
                      opacity=".55"
                    />
                  )
                })}
                <circle cx="40" cy="34" r="14.5" fill="currentColor" />
                <circle cx="40" cy="34" r="9.5" fill="var(--night)" />
                <circle cx="40" cy="34" r="4.2" fill="currentColor" />
                <circle cx="40" cy="34" r="11.5" fill="none" stroke="var(--night)" strokeWidth=".4" opacity=".45" />
              </g>
            </g>
            <g className="press-lever__lever-base">
              <rect x="20" y="220" width="40" height="14" rx="2" fill="none" stroke="currentColor" strokeWidth=".7" />
              <line x1="24" y1="225" x2="56" y2="225" stroke="currentColor" strokeWidth=".35" opacity=".5" />
              <line x1="24" y1="229" x2="56" y2="229" stroke="currentColor" strokeWidth=".35" opacity=".5" />
            </g>
          </svg>
          <span className="press-lever__lever-tag" aria-hidden="true">
            <span className="press-lever__lever-tag-dot" />
            {answerOpen ? 'pulled' : 'pull'}
          </span>
          <span className="press-lever__lever-hint" aria-hidden="true">
            <span className="press-lever__lever-hint-mark" />
            rest · pulled · rest
          </span>
          <span className="press-lever__lever-ink" aria-hidden="true" />
        </span>

        <div className="press-lever__action">
          <span className="press-lever__action-eyebrow" aria-hidden="true">
            <span className="press-lever__action-eyebrow-rule" />
            <span className="press-lever__action-eyebrow-tag">then · read</span>
            <span className="press-lever__action-eyebrow-rule" />
          </span>
          <button
            ref={triggerRef}
            type="button"
            className={`press-lever__action-button ${answerOpen ? 'is-open' : ''} ${stamping ? 'is-stamping' : ''}`}
            onClick={onToggleAnswer}
            aria-expanded={answerOpen}
            aria-controls="answer"
          >
            <span className="press-lever__action-corner press-lever__action-corner--tl" aria-hidden="true" />
            <span className="press-lever__action-corner press-lever__action-corner--tr" aria-hidden="true" />
            <span className="press-lever__action-corner press-lever__action-corner--bl" aria-hidden="true" />
            <span className="press-lever__action-corner press-lever__action-corner--br" aria-hidden="true" />
            <span className="press-lever__action-folio" aria-hidden="true">folio viii · the editor's note</span>
            <span className="press-lever__action-line">
              {answerOpen ? 'fold the answer back' : 'open the editor’s note'}
            </span>
            <span className="press-lever__action-for" aria-hidden={reader.length === 0}>
              <span className="press-lever__action-for-rule" aria-hidden="true" />
              <em>impressed for {reader || 'the next reader'}</em>
            </span>
            <span className="press-lever__action-arrow" aria-hidden="true">
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
          <span className="press-lever__action-foot" aria-hidden="true">
            <span className="press-lever__action-foot-bead" />
            the answer gets pressed onto folio viii · the lever sets it open
          </span>
        </div>
      </div>

      <footer className="press-lever__foot" aria-hidden="false">
        <span className="press-lever__foot-voice">
          <span className="press-lever__foot-voice-letter" aria-hidden="true">{VOICE_LETTER[voice]}</span>
          <span className="press-lever__foot-voice-meta">
            <span className="press-lever__foot-voice-name">
              now setting in <em>{VOICE_NAME[voice]}</em>
            </span>
            <span className="press-lever__foot-voice-face">{VOICE_FACE[voice]}</span>
          </span>
        </span>
        <span className="press-lever__foot-key" aria-hidden="true">
          <span className="press-lever__foot-key-rule" />
          <span className="press-lever__foot-key-tag">
            cycle voice
            <span className="press-lever__foot-key-kbd">
              <kbd>shift</kbd>
              <span aria-hidden="true">+</span>
              <kbd>v</kbd>
            </span>
          </span>
          <span className="press-lever__foot-key-rule" />
        </span>
        <span className="press-lever__foot-date">
          <span className="press-lever__foot-date-mark" aria-hidden="true" />
          set today · {setToday}
        </span>
      </footer>
    </aside>
  )
})
