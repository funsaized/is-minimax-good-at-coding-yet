import { useId } from 'react'
import type { CSSProperties } from 'react'

type FolioMarkProps = {
  folio: string
  setToday: string
  voiceLabel: string
  voiceLetter: string
  voiceTone: string
}

export function FolioMark({ folio, setToday, voiceLabel, voiceLetter, voiceTone }: FolioMarkProps) {
  const baseId = useId()
  const ruleId = `folio-rule-${baseId.replace(/:/g, '')}`
  const style = { '--folio-tone': voiceTone } as CSSProperties
  return (
    <div className="hero__folio-mark" style={style} aria-hidden="true">
      <svg className="hero__folio-mark-rule" viewBox="0 0 220 6" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id={ruleId} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
            <stop offset="22%" stopColor="currentColor" stopOpacity=".7" />
            <stop offset="78%" stopColor="currentColor" stopOpacity=".7" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
        </defs>
        <line x1="2" y1="3" x2="218" y2="3" stroke={`url(#${ruleId})`} strokeWidth=".7" className="hero__folio-mark-stroke" />
      </svg>
      <span className="hero__folio-mark-row">
        <span className="hero__folio-mark-folio">folio <em>{folio}</em></span>
        <span className="hero__folio-mark-bead" aria-hidden="true" />
        <span className="hero__folio-mark-title"><em>the question, set</em></span>
        <span className="hero__folio-mark-bead" aria-hidden="true" />
        <span className="hero__folio-mark-voice">
          <span className="hero__folio-mark-voice-letter">{voiceLetter}</span>
          <span className="hero__folio-mark-voice-name">{voiceLabel}</span>
        </span>
        <span className="hero__folio-mark-bead" aria-hidden="true" />
        <span className="hero__folio-mark-date">set <em>{setToday}</em></span>
      </span>
    </div>
  )
}
