import { useId } from 'react'
import type { CSSProperties } from 'react'
import type { WordId } from './notes'

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
      <svg className="hero__folio-mark-rule" viewBox="0 0 200 6" preserveAspectRatio="none">
        <defs>
          <linearGradient id={ruleId} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
            <stop offset="20%" stopColor="currentColor" stopOpacity=".65" />
            <stop offset="80%" stopColor="currentColor" stopOpacity=".65" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
        </defs>
        <line x1="2" y1="3" x2="198" y2="3" stroke={`url(#${ruleId})`} strokeWidth=".8" />
      </svg>
      <span className="hero__folio-mark-line">
        <span className="hero__folio-mark-folio">folio {folio}</span>
        <span className="hero__folio-mark-sep" aria-hidden="true">·</span>
        <span className="hero__folio-mark-name">the question</span>
        <span className="hero__folio-mark-sep" aria-hidden="true">·</span>
        <span className="hero__folio-mark-press">m³ press</span>
        <span className="hero__folio-mark-sep" aria-hidden="true">·</span>
        <span className="hero__folio-mark-voice">
          <span className="hero__folio-mark-voice-letter">{voiceLetter}</span>
          <span className="hero__folio-mark-voice-name">{voiceLabel}</span>
        </span>
        <span className="hero__folio-mark-sep" aria-hidden="true">·</span>
        <span className="hero__folio-mark-date">set {setToday}</span>
      </span>
    </div>
  )
}