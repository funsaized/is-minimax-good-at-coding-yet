import type { CSSProperties } from 'react'
import type { VoiceId } from './Press'

type PublicationMarkProps = {
  voice: VoiceId
  setToday: string
  className?: string
}

const VOICE_LETTER: Record<VoiceId, string> = { quiet: 'A', human: 'B', bold: 'C' }
const VOICE_NAME: Record<VoiceId, string> = { quiet: 'quiet cut', human: 'human hand', bold: 'bold signal' }

export function PublicationMark({ voice, setToday, className = '' }: PublicationMarkProps) {
  const style = { '--pm-tone': `var(--${voice === 'quiet' ? 'blue' : voice === 'human' ? 'coral' : 'acid'})` } as CSSProperties
  return (
    <div className={`publication-mark ${className}`} style={style} aria-hidden="true">
      <span className="publication-mark__rule publication-mark__rule--left" />
      <span className="publication-mark__core">
        <span className="publication-mark__core-mark">
          <svg viewBox="0 0 32 32" aria-hidden="true">
            <circle cx="16" cy="16" r="12.5" fill="none" stroke="currentColor" strokeWidth=".7" />
            <circle cx="16" cy="16" r="8" fill="none" stroke="currentColor" strokeWidth=".3" strokeDasharray="1 2" opacity=".55" />
            <text
              x="16"
              y="20.5"
              textAnchor="middle"
              fontFamily="Georgia, 'Iowan Old Style', serif"
              fontStyle="italic"
              fontSize="11"
              fill="currentColor"
            >m³</text>
            <circle cx="16" cy="3.4" r=".55" fill="currentColor" />
            <circle cx="16" cy="28.6" r=".55" fill="currentColor" />
          </svg>
        </span>
        <span className="publication-mark__core-row">
          <span className="publication-mark__press">
            <span className="publication-mark__press-mark">m³ press</span>
            <span className="publication-mark__press-sep" aria-hidden="true">·</span>
            <span className="publication-mark__press-folio">folio i</span>
          </span>
          <span className="publication-mark__voice">
            <span className="publication-mark__voice-letter">{VOICE_LETTER[voice]}</span>
            <span className="publication-mark__voice-name">{VOICE_NAME[voice]}</span>
          </span>
          <span className="publication-mark__date">
            <span className="publication-mark__date-tag">set</span>
            <span className="publication-mark__date-text">{setToday}</span>
          </span>
        </span>
      </span>
      <span className="publication-mark__rule publication-mark__rule--right" />
      <svg className="publication-mark__sweep" viewBox="0 0 220 14" preserveAspectRatio="none" aria-hidden="true">
        <path
          d="M2 8c10-6 22 4 36-1s22-6 36-1 22 5 36-2 22-5 36 0 22 6 36-2 18-3 18-3"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
        />
        <circle cx="216" cy="7" r="1.5" fill="currentColor" />
      </svg>
    </div>
  )
}
