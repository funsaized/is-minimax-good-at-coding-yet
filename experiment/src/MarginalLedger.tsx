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

function MarkGlyph({ glyph }: { glyph: LedgerMark['glyph'] }) {
  if (glyph === 'stet') {
    return (
      <svg className="marginal-ledger__glyph-svg" viewBox="0 0 22 14" aria-hidden="true">
        <path
          d="M2 8c3-3 5 3 8 0s5-3 8 0 3 1 3 1"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
        />
        <circle cx="20" cy="8" r=".9" fill="currentColor" />
      </svg>
    )
  }
  if (glyph === 'caret') {
    return (
      <svg className="marginal-ledger__glyph-svg" viewBox="0 0 22 14" aria-hidden="true">
        <path d="M11 12l-5-7h10z" fill="currentColor" opacity=".88" />
        <line x1="2" y1="12" x2="20" y2="12" stroke="currentColor" strokeWidth=".9" strokeLinecap="round" />
      </svg>
    )
  }
  return (
    <svg className="marginal-ledger__glyph-svg" viewBox="0 0 22 14" aria-hidden="true">
      <ellipse cx="15" cy="8" rx="6" ry="4.5" fill="none" stroke="currentColor" strokeWidth=".9" />
      <text
        x="15"
        y="11"
        textAnchor="middle"
        fontFamily="Georgia, 'Iowan Old Style', serif"
        fontStyle="italic"
        fontSize="9"
        fill="currentColor"
      >
        ?
      </text>
    </svg>
  )
}

export function MarginalLedger({ active, hovered, onHover, onLeave, onSelect }: MarginalLedgerProps) {
  const display = hovered ?? active
  const activeIndex = MARKS.findIndex(mark => mark.id === display)
  const activeMark = MARKS[activeIndex] ?? MARKS[0]

  return (
    <aside className="marginal-ledger" aria-label="Editor's marginal ledger against the title">
      <span className="marginal-ledger__head" aria-hidden="true">
        <span className="marginal-ledger__head-rule" />
        <span className="marginal-ledger__head-tag">ledger</span>
      </span>

      <ol className="marginal-ledger__list">
        {MARKS.map((mark, i) => {
          const isActive = mark.id === display
          const isPast = activeIndex > i
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
                <span className="marginal-ledger__tick-num" aria-hidden="true">{mark.index}</span>
                <span className="marginal-ledger__tick-glyph" aria-hidden="true">
                  <MarkGlyph glyph={mark.glyph} />
                </span>
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
        <span className="marginal-ledger__foot-text">
          <em>{activeMark.label}</em>
        </span>
      </span>
    </aside>
  )
}
