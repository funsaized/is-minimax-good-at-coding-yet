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
      <span className="folio-turn__rule" aria-hidden="true" />
      <span className="folio-turn__core">
        <span className="folio-turn__num" aria-hidden="true">{index}</span>
        <span>{title}</span>
        {hint && <em>· {hint}</em>}
      </span>
      <span className="folio-turn__rule" aria-hidden="true" />
    </div>
  )
}
