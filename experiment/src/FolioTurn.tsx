import type { VoiceId } from './App'

type FolioTurnProps = {
  index: string
  title: string
  hint?: string
  voice: VoiceId
  soft?: boolean
  note?: string
}

const COMP_NOTE: Record<string, string> = {
  bed:
    'the lever is the question — pull once, and the page answers in a new face.',
  line:
    'three proofs are pinned to the same cord — mark one, and the page sets itself there.',
  key:
    'the plates are kept close — the loud face and the quiet face read the same line.',
  answer:
    'the leaf is folded once — the dawn will follow when the reader is ready.',
  colophon:
    'the compositor signs off — the reader keeps the question.',
  pouch:
    'three slips remain — kept by the reader, after the page is set down.',
}

export function FolioTurn({ index, title, hint, voice, soft, note }: FolioTurnProps) {
  const resolvedNote = note ?? COMP_NOTE[(title || '').toLowerCase().split(' ').slice(-1)[0]] ?? hint

  return (
    <div
      className={`folio-turn folio-turn--${voice} ${soft ? 'folio-turn--soft' : ''}`}
      role="separator"
      aria-label={`Page turn · folio ${index} · ${title}${resolvedNote ? ` — ${resolvedNote}` : ''}`}
    >
      <span className="folio-turn__rule folio-turn__rule--l" aria-hidden="true" />
      <span className="folio-turn__core">
        <span className="folio-turn__num-wrap" aria-hidden="true">
          <span className="folio-turn__num-stitch" />
          <span className="folio-turn__num">{index}</span>
          <span className="folio-turn__num-stitch folio-turn__num-stitch--r" />
        </span>
        <span className="folio-turn__title">{title}</span>
        {hint && <em className="folio-turn__hint">· {hint}</em>}
      </span>
      <span className="folio-turn__rule folio-turn__rule--r" aria-hidden="true" />

      {resolvedNote && (
        <span className="folio-turn__note" aria-hidden="true">
          <svg className="folio-turn__note-mark" viewBox="0 0 12 12">
            <circle cx="6" cy="6" r="4.4" fill="none" stroke="currentColor" strokeWidth=".5" opacity=".7" />
            <circle cx="6" cy="6" r="1.6" fill="currentColor" opacity=".7" />
          </svg>
          <em>{resolvedNote}</em>
          <span className="folio-turn__note-tail" aria-hidden="true">
            <svg viewBox="0 0 24 4" preserveAspectRatio="none">
              <line x1="0" y1="2" x2="24" y2="2" stroke="currentColor" strokeWidth=".45" strokeDasharray="1 2" opacity=".55" />
            </svg>
          </span>
        </span>
      )}

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