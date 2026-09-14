import type { WordId } from './notes'

type MarginalLedgerProps = {
  active: WordId
  hovered: WordId | null
  onHover: (id: WordId) => void
  onLeave: () => void
  onSelect: (id: WordId) => void
}

type LedgerMark = {
  id: WordId
  index: 'i' | 'ii' | 'iii'
  glyph: 'stet' | 'caret' | 'query'
  word: string
  label: string
  ink: 'acid' | 'coral' | 'blue'
}

const MARKS: LedgerMark[] = [
  {
    id: 'm3',
    index: 'i',
    glyph: 'stet',
    word: 'M3',
    label: 'stet',
    ink: 'acid',
  },
  {
    id: 'good',
    index: 'ii',
    glyph: 'caret',
    word: 'good at',
    label: 'caret',
    ink: 'coral',
  },
  {
    id: 'yet',
    index: 'iii',
    glyph: 'query',
    word: 'yet?',
    label: 'query',
    ink: 'blue',
  },
]

function MarkGlyph({ glyph, ink }: { glyph: LedgerMark['glyph']; ink: LedgerMark['ink'] }) {
  if (glyph === 'stet') {
    return (
      <svg className="marginal-ledger__glyph-svg" viewBox="0 0 28 18" aria-hidden="true">
        <path
          d="M2 12c3-4 6 4 9 0s6-4 9 0 6 4 6 4"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.1"
          strokeLinecap="round"
        />
        <circle cx="26" cy="12" r="1" fill="currentColor" />
      </svg>
    )
  }
  if (glyph === 'caret') {
    return (
      <svg className="marginal-ledger__glyph-svg" viewBox="0 0 28 18" aria-hidden="true">
        <path d="M14 14l-7-9h14z" fill="currentColor" opacity=".88" />
        <line x1="2" y1="14" x2="26" y2="14" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      </svg>
    )
  }
  return (
    <svg className="marginal-ledger__glyph-svg" viewBox="0 0 28 18" aria-hidden="true">
      <ellipse cx="20" cy="11" rx="7" ry="5" fill="none" stroke="currentColor" strokeWidth=".9" />
      <text
        x="20"
        y="14.5"
        textAnchor="middle"
        fontFamily="Georgia, 'Iowan Old Style', serif"
        fontStyle="italic"
        fontSize="11"
        fill="currentColor"
      >
        ?
      </text>
    </svg>
  )
}

export function MarginalLedger({ active, hovered, onHover, onLeave, onSelect }: MarginalLedgerProps) {
  const display = hovered ?? active

  return (
    <aside className="marginal-ledger" aria-label="Editor's marginal ledger against the title">
      <span className="marginal-ledger__head" aria-hidden="true">
        <span className="marginal-ledger__head-rule" />
        <span className="marginal-ledger__head-tag">
          <span className="marginal-ledger__head-dot" />
          <span className="marginal-ledger__head-eyebrow">ledger</span>
        </span>
      </span>

      <ol className="marginal-ledger__list">
        {MARKS.map((mark, i) => {
          const isActive = mark.id === display
          const isPast = MARKS.findIndex(m => m.id === display) > i
          return (
            <li
              key={mark.id}
              className={`marginal-ledger__row marginal-ledger__row--${mark.id} ${isActive ? 'is-active' : ''} ${isPast ? 'is-past' : ''}`}
            >
              <button
                type="button"
                className={`marginal-ledger__tick marginal-ledger__tick--${mark.ink}`}
                onClick={() => onSelect(mark.id)}
                onMouseEnter={() => onHover(mark.id)}
                onMouseLeave={onLeave}
                onFocus={() => onHover(mark.id)}
                onBlur={onLeave}
                aria-pressed={isActive}
                aria-describedby={`note-${mark.id}`}
                aria-label={`${mark.label} — ${mark.word}`}
              >
                <span className="marginal-ledger__tick-glyph" aria-hidden="true">
                  <MarkGlyph glyph={mark.glyph} ink={mark.ink} />
                </span>
                <span className="marginal-ledger__tick-num" aria-hidden="true">{mark.index}</span>
                <span className="marginal-ledger__tick-label" aria-hidden="true">{mark.label}</span>
              </button>
            </li>
          )
        })}
      </ol>

      <span className="marginal-ledger__rule" aria-hidden="true">
        <svg viewBox="0 0 4 240" preserveAspectRatio="none">
          <line x1="2" y1="2" x2="2" y2="238" stroke="currentColor" strokeWidth=".9" strokeLinecap="round" strokeDasharray="2 4" />
        </svg>
      </span>

      <span className="marginal-ledger__foot" aria-hidden="true">
        <span className="marginal-ledger__foot-mark">※</span>
        <span className="marginal-ledger__foot-text">three marks <em>kept close</em></span>
      </span>

      <span className="marginal-ledger__scribble" aria-hidden="true">
        <svg viewBox="0 0 100 12" preserveAspectRatio="none">
          <path
            d="M2 8c10-5 20 4 30-1s20-5 30-2 20 4 30-2 6-2 6-2"
            fill="none"
            stroke="currentColor"
            strokeWidth=".9"
            strokeLinecap="round"
            strokeDasharray="120 120"
            className="marginal-ledger__scribble-stroke"
          />
          <circle cx="98" cy="6" r=".9" fill="currentColor" className="marginal-ledger__scribble-dot" />
        </svg>
      </span>
    </aside>
  )
}