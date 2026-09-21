import { useId } from 'react'
import type { VoiceId } from './Press'

type FolioTurnProps = {
  index: string
  title: string
  hint?: string
  voice: VoiceId
  soft?: boolean
}

function TurnMark({ id, side }: { id: string; side: 'lead' | 'trail' }) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className={`folio-turn__mark folio-turn__mark--${side}`}>
      <g filter={`url(#${id})`}>
        <circle cx="8" cy="8" r="6.5" fill="none" stroke="currentColor" strokeWidth=".55" />
        <circle cx="8" cy="8" r="2.6" fill="currentColor" />
      </g>
    </svg>
  )
}

function TurnRule({ id }: { id: string }) {
  return (
    <svg viewBox="0 0 200 6" preserveAspectRatio="none" className="folio-turn__rule-svg" aria-hidden="true">
      <g filter={`url(#${id})`}>
        <path
          d="M2 3c16-2 32 2 48 0s32-2 48 0 32 2 48 0 32-2 50 0"
          fill="none"
          stroke="currentColor"
          strokeWidth=".55"
          strokeLinecap="round"
          pathLength="100"
          className="folio-turn__rule-stroke"
        />
      </g>
      <circle cx="2" cy="3" r=".9" fill="currentColor" />
      <circle cx="198" cy="3" r=".9" fill="currentColor" />
    </svg>
  )
}

export function FolioTurn({ index, title, hint, voice, soft }: FolioTurnProps) {
  const baseId = useId().replace(/:/g, '')
  const grainId = `folio-turn-grain-${baseId}`
  return (
    <div
      className={`folio-turn folio-turn--voice-${voice} ${soft ? 'folio-turn--soft' : ''}`}
      role="separator"
      aria-label={`Page turn · folio ${index} · ${title}`}
    >
      <svg className="folio-turn__defs" aria-hidden="true">
        <defs>
          <filter id={grainId} x="-2%" y="-50%" width="104%" height="200%">
            <feTurbulence type="fractalNoise" baseFrequency="2.4" numOctaves="2" seed="11" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .4 0" />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
        </defs>
      </svg>

      <span className="folio-turn__rule folio-turn__rule--lead" aria-hidden="true">
        <TurnRule id={grainId} />
      </span>

      <span className="folio-turn__core">
        <TurnMark id={grainId} side="lead" />
        <span className="folio-turn__tag">
          <span className="folio-turn__index" aria-hidden="true">folio</span>
          <em className="folio-turn__num">{index}</em>
        </span>
        <span className="folio-turn__title-stack">
          <span className="folio-turn__title">{title}</span>
          {hint && <span className="folio-turn__hint">{hint}</span>}
        </span>
        <TurnMark id={grainId} side="trail" />
      </span>

      <span className="folio-turn__rule folio-turn__rule--trail" aria-hidden="true">
        <TurnRule id={grainId} />
      </span>
    </div>
  )
}
