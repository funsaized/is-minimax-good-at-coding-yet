import { forwardRef, useId, type CSSProperties } from 'react'
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
  const baseId = useId().replace(/:/g, '')
  const grainId = `press-lever-grain-${baseId}`
  const dropGrainId = `press-lever-drop-grain-${baseId}`
  const style = { '--press-lever-tone': tone } as CSSProperties

  return (
    <aside
      className={`press-lever press-lever--${voice} ${answerOpen ? 'is-open' : ''} ${reader ? 'is-signed' : ''}`}
      aria-label="The press lever · opens the editor's note"
      style={style}
    >
      <svg className="press-lever__defs" viewBox="0 0 400 400" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <filter id={grainId} x="-2%" y="-2%" width="104%" height="104%">
            <feTurbulence type="fractalNoise" baseFrequency="2.6" numOctaves="2" seed="21" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .5 0" />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
          <filter id={dropGrainId} x="-6%" y="-6%" width="112%" height="112%">
            <feTurbulence type="fractalNoise" baseFrequency="2.2" numOctaves="2" seed="37" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .45 0" />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
        </defs>
      </svg>

      <span className="press-lever__bloom" aria-hidden="true" />

      <header className="press-lever__head" aria-hidden="true">
        <span className="press-lever__head-rule" />
        <span className="press-lever__head-tag">
          <span className="press-lever__head-dot" />
          <em>the press lever</em>
          <span className="press-lever__head-key">folio viii</span>
          <span className="press-lever__head-dot press-lever__head-dot--alt" />
        </span>
        <span className="press-lever__head-rule press-lever__head-rule--alt" />
      </header>

      <div className="press-lever__main">
        <figure className={`press-lever__lever ${answerOpen ? 'is-pulled' : ''} ${stamping ? 'is-stamping' : ''}`} aria-hidden="true">
          <span className="press-lever__lever-tag">
            <span className="press-lever__lever-tag-dot" />
            {answerOpen ? 'pulled' : 'pull'}
          </span>

          <svg className="press-lever__lever-svg" viewBox="0 0 96 240" preserveAspectRatio="xMidYMid meet">
            <g className="press-lever__lever-cage">
              <path d="M14 6 H82" stroke="currentColor" strokeWidth=".7" strokeLinecap="round" opacity=".5" />
              <path d="M18 12 H78" stroke="currentColor" strokeWidth=".35" strokeDasharray="1.4 2.2" opacity=".4" />
              <path d="M16 230 H80" stroke="currentColor" strokeWidth=".55" strokeLinecap="round" opacity=".42" />
            </g>

            <g className="press-lever__lever-base">
              <rect x="22" y="218" width="52" height="14" rx="2" fill="none" stroke="currentColor" strokeWidth=".7" />
              <line x1="26" y1="223" x2="70" y2="223" stroke="currentColor" strokeWidth=".35" opacity=".5" />
              <line x1="26" y1="227" x2="70" y2="227" stroke="currentColor" strokeWidth=".35" opacity=".5" />
              <circle cx="48" cy="225" r=".9" fill="currentColor" opacity=".55" />
            </g>

            <g className="press-lever__lever-pivot">
              <circle cx="48" cy="208" r="6.5" fill="none" stroke="currentColor" strokeWidth=".7" />
              <circle cx="48" cy="208" r="2.6" fill="currentColor" />
            </g>

            <g className="press-lever__lever-shaft-group">
              <line
                className="press-lever__lever-shaft"
                x1="48" y1="22"
                x2="48" y2="208"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
              <line
                x1="48" y1="44" x2="48" y2="196"
                stroke="var(--night)"
                strokeWidth=".4"
                strokeLinecap="round"
                opacity=".5"
              />

              <g className="press-lever__lever-knob">
                <circle cx="48" cy="34" r="14.5" fill="none" stroke="currentColor" strokeWidth=".55" opacity=".5" />
                <circle cx="48" cy="34" r="11" fill="currentColor" />
                <circle cx="48" cy="34" r="9.5" fill="none" stroke="var(--night)" strokeWidth=".4" opacity=".55" />
                <circle cx="48" cy="34" r="6" fill="var(--night)" />
                <circle cx="48" cy="34" r="2.4" fill="currentColor" />
                <circle cx="46" cy="32" r=".85" fill="var(--paper)" opacity=".65" />
              </g>
            </g>
          </svg>

          <span className="press-lever__lever-drop" aria-hidden="true">
            <svg viewBox="0 0 64 200" preserveAspectRatio="xMidYMin meet">
              <g filter={`url(#${dropGrainId})`}>
                <path
                  className="press-lever__lever-drop-stroke"
                  d="M32 4c-1 16 4 28 -2 44s-6 30 1 46 -4 30 1 46 -2 30 1 46"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth=".95"
                  strokeLinecap="round"
                  pathLength="100"
                />
                <circle className="press-lever__lever-drop-bead" cx="32" cy="194" r="2.4" fill="currentColor" />
                <circle className="press-lever__lever-drop-halo" cx="32" cy="194" r="6" fill="none" stroke="currentColor" strokeWidth=".3" strokeDasharray=".6 1.6" opacity=".55" />
              </g>
            </svg>
          </span>

          <span className="press-lever__lever-hint">
            <span className="press-lever__lever-hint-mark" />
            rest · pulled · rest
          </span>
        </figure>

        <div className="press-lever__action">
          <span className="press-lever__action-eyebrow" aria-hidden="true">
            <span className="press-lever__action-eyebrow-rule" />
            <span className="press-lever__action-eyebrow-tag">then · read</span>
            <span className="press-lever__action-eyebrow-rule press-lever__action-eyebrow-rule--alt" />
          </span>
          <button
            ref={triggerRef}
            type="button"
            className={`press-lever__action-button ${answerOpen ? 'is-open' : ''} ${stamping ? 'is-stamping' : ''}`}
            onClick={onToggleAnswer}
            aria-expanded={answerOpen}
            aria-controls="answer"
          >
            <span className="press-lever__action-folio" aria-hidden="true">folio viii · the editor's note</span>
            <span className="press-lever__action-line">
              <em>{answerOpen ? 'fold the answer back' : 'open the editor’s note'}</em>
              <span className="press-lever__action-line-underline" aria-hidden="true">
                <svg viewBox="0 0 220 6" preserveAspectRatio="none">
                  <g filter={`url(#${grainId})`}>
                    <path
                      className="press-lever__action-line-underline-stroke"
                      d="M2 3c20-2 40 2 60 0s40-2 60 0 40 2 60 0 36-2 36 0"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth=".7"
                      strokeLinecap="round"
                      pathLength="100"
                    />
                  </g>
                  <circle cx="2" cy="3" r=".95" fill="currentColor" />
                  <circle cx="218" cy="3" r=".95" fill="currentColor" />
                </svg>
              </span>
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
          <span className="press-lever__foot-key-rule press-lever__foot-key-rule--alt" />
        </span>
        <span className="press-lever__foot-date">
          <span className="press-lever__foot-date-mark" aria-hidden="true" />
          set today · {setToday}
        </span>
      </footer>
    </aside>
  )
})
