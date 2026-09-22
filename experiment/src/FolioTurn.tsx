import type { VoiceId } from './App'

type FolioTurnProps = {
  index: string
  title: string
  hint?: string
  voice: VoiceId
  soft?: boolean
}

export function FolioTurn({ index, title, hint, voice, soft }: FolioTurnProps) {
  return (
    <div
      className={`folio-turn folio-turn--${voice} ${soft ? 'folio-turn--soft' : ''}`}
      role="separator"
      aria-label={`Page turn · folio ${index} · ${title}`}
    >
      <span className="folio-turn__rule folio-turn__rule--l" aria-hidden="true" />
      <span className="folio-turn__core">
        <span className="folio-turn__num-wrap" aria-hidden="true">
          <span className="folio-turn__num-stitch" />
          <span className="folio-turn__num">{index}</span>
          <span className="folio-turn__num-stitch folio-turn__num-stitch--r" />
        </span>
        <span className="folio-turn__title">{title}</span>
        {hint && <em>· {hint}</em>}
      </span>
      <span className="folio-turn__rule folio-turn__rule--r" aria-hidden="true" />
      <span className="folio-turn__stitch" aria-hidden="true">
        <svg viewBox="0 0 120 12" preserveAspectRatio="none">
          <line x1="0" y1="6" x2="120" y2="6" stroke="currentColor" strokeWidth=".6" strokeDasharray="1.4 2.8" opacity=".55" />
          <circle cx="14" cy="6" r="1.4" fill="currentColor" opacity=".7" />
          <circle cx="60" cy="6" r="1" fill="currentColor" opacity=".55" />
          <circle cx="106" cy="6" r="1.4" fill="currentColor" opacity=".7" />
        </svg>
      </span>
      <span className="folio-turn__fold" aria-hidden="true">
        <svg viewBox="0 0 60 18" preserveAspectRatio="none">
          <path
            d="M2 14 L12 4 L22 14 L32 4 L42 14 L52 4 L58 14"
            fill="none"
            stroke="currentColor"
            strokeWidth=".55"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity=".7"
          />
          <circle cx="2" cy="14" r="1" fill="currentColor" opacity=".7" />
          <circle cx="58" cy="14" r="1" fill="currentColor" opacity=".7" />
        </svg>
      </span>
    </div>
  )
}