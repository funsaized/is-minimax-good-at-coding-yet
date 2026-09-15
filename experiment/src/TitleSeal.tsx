import type { CSSProperties } from 'react'
import type { VoiceId } from './Press'

type TitleSealProps = {
  voice: VoiceId
  voiceLabel: string
  voiceLetter: string
  setToday: string
}

const VOICE_TONE: Record<VoiceId, string> = {
  quiet: 'var(--blue)',
  human: 'var(--coral)',
  bold: 'var(--acid)',
}

export function TitleSeal({ voice, voiceLabel, voiceLetter, setToday }: TitleSealProps) {
  const tone = VOICE_TONE[voice]
  const style = { '--seal-tone': tone } as CSSProperties

  return (
    <div className="title-seal" style={style} aria-hidden="true">
      <svg className="title-seal__rule" viewBox="0 0 320 6" preserveAspectRatio="none">
        <defs>
          <linearGradient id="title-seal-rule" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
            <stop offset="22%" stopColor="currentColor" stopOpacity=".6" />
            <stop offset="78%" stopColor="currentColor" stopOpacity=".6" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
        </defs>
        <line x1="2" y1="3" x2="318" y2="3" stroke="url(#title-seal-rule)" strokeWidth=".7" />
      </svg>

      <span className="title-seal__row">
        <span className="title-seal__cell title-seal__cell--press">
          <span className="title-seal__cell-tag">press</span>
          <span className="title-seal__cell-main">
            <svg className="title-seal__press-mark" viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="12" r="10.5" fill="none" stroke="currentColor" strokeWidth=".7" />
              <circle cx="12" cy="12" r="6.5" fill="none" stroke="currentColor" strokeWidth=".4" strokeDasharray="1 2" opacity=".7" />
              <text x="12" y="15.5" textAnchor="middle" fontFamily="Georgia, serif" fontStyle="italic" fontSize="9" fill="currentColor">m³</text>
            </svg>
            <span className="title-seal__press-name">m³ press</span>
          </span>
          <span className="title-seal__cell-foot">folio i · the question</span>
        </span>

        <span className="title-seal__divider" aria-hidden="true" />

        <span className="title-seal__cell title-seal__cell--voice">
          <span className="title-seal__cell-tag">voice</span>
          <span className="title-seal__cell-main">
            <span className="title-seal__voice-letter">{voiceLetter}</span>
            <span className="title-seal__voice-name">{voiceLabel}</span>
          </span>
          <span className="title-seal__cell-foot">shift + v to cycle</span>
        </span>

        <span className="title-seal__divider" aria-hidden="true" />

        <span className="title-seal__cell title-seal__cell--date">
          <span className="title-seal__cell-tag">set today</span>
          <span className="title-seal__cell-main">
            <span className="title-seal__date-text">{setToday}</span>
          </span>
          <span className="title-seal__cell-foot">a single impression</span>
        </span>
      </span>

      <svg className="title-seal__sweep" viewBox="0 0 320 14" preserveAspectRatio="none">
        <path
          d="M2 7c20-2 40 4 60 0s40-6 60-1 40 5 60-2 40-5 60 0 40 5 78 2"
          fill="none"
          stroke="currentColor"
          strokeWidth=".9"
          strokeLinecap="round"
          pathLength="100"
          strokeDasharray="100 100"
          className="title-seal__sweep-stroke"
        />
        <circle cx="318" cy="6" r="1.6" fill="currentColor" className="title-seal__sweep-dot" />
      </svg>
    </div>
  )
}