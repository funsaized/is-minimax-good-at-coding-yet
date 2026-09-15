import type { WordId } from './notes'

type MarginaliaStripProps = {
  active: WordId
  hovered: WordId | null
  onHover: (id: WordId) => void
  onLeave: () => void
  onSelect: (id: WordId) => void
}

type StripMark = {
  id: WordId
  index: string
  glyph: 'stet' | 'caret' | 'query'
  word: string
  label: string
  note: string
  ink: 'acid' | 'coral' | 'blue'
}

const STRIP_MARKS: StripMark[] = [
  {
    id: 'm3',
    index: 'i',
    glyph: 'stet',
    word: 'M3',
    label: 'stet',
    note: 'a habit, not a logo',
    ink: 'acid',
  },
  {
    id: 'good',
    index: 'ii',
    glyph: 'caret',
    word: 'good at',
    label: 'caret',
    note: 'make room for attention',
    ink: 'coral',
  },
  {
    id: 'yet',
    index: 'iii',
    glyph: 'query',
    word: 'yet?',
    label: 'query',
    note: 'the question stays open',
    ink: 'blue',
  },
]

function MarkGlyph({ glyph }: { glyph: StripMark['glyph'] }) {
  if (glyph === 'stet') {
    return (
      <svg viewBox="0 0 24 14" aria-hidden="true">
        <path
          d="M2 8c3-3 5 3 8 0s5-3 8 0 3 1 3 1"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.1"
          strokeLinecap="round"
        />
        <circle cx="22" cy="8" r="1" fill="currentColor" />
      </svg>
    )
  }
  if (glyph === 'caret') {
    return (
      <svg viewBox="0 0 24 14" aria-hidden="true">
        <path d="M12 12l-5-7h10z" fill="currentColor" opacity="0.9" />
        <line x1="2" y1="12" x2="22" y2="12" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 24 14" aria-hidden="true">
      <ellipse cx="16" cy="8" rx="6.4" ry="4.6" fill="none" stroke="currentColor" strokeWidth="1" />
      <text
        x="16"
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

export function MarginaliaStrip({ active, hovered, onHover, onLeave, onSelect }: MarginaliaStripProps) {
  const display = hovered ?? active
  const activeIndex = STRIP_MARKS.findIndex(mark => mark.id === display)
  const activeMark = STRIP_MARKS[Math.max(0, activeIndex)]

  return (
    <aside className="marginalia" aria-label="Editor's marginalia against the title">
      <span className="marginalia__rule marginalia__rule--lead" aria-hidden="true" />
      <span className="marginalia__head">
        <span className="marginalia__head-mark" aria-hidden="true">※</span>
        <span className="marginalia__head-tag">marginalia</span>
        <span className="marginalia__head-tag-em">the press's three marks</span>
      </span>

      <ol className="marginalia__list">
        {STRIP_MARKS.map((mark, i) => {
          const isActive = mark.id === display
          const isPast = activeIndex > i
          return (
            <li
              key={mark.id}
              className={`marginalia__row marginalia__row--${mark.id} ${isActive ? 'is-active' : ''} ${isPast ? 'is-past' : ''}`}
            >
              <button
                type="button"
                className={`marginalia__tick marginalia__tick--${mark.ink}`}
                onClick={() => onSelect(mark.id)}
                onMouseEnter={() => onHover(mark.id)}
                onMouseLeave={onLeave}
                onFocus={() => onHover(mark.id)}
                onBlur={onLeave}
                aria-pressed={isActive}
                aria-describedby={`note-${mark.id}`}
                aria-label={`${mark.label} — ${mark.word}`}
              >
                <span className="marginalia__tick-num" aria-hidden="true">{mark.index}</span>
                <span className="marginalia__tick-glyph" aria-hidden="true">
                  <MarkGlyph glyph={mark.glyph} />
                </span>
                <span className="marginalia__tick-copy">
                  <span className="marginalia__tick-word">{mark.word}</span>
                  <span className="marginalia__tick-label">{mark.label}</span>
                </span>
                <span className="marginalia__tick-note" aria-hidden="true">{mark.note}</span>
              </button>
              {i < STRIP_MARKS.length - 1 && (
                <span className="marginalia__divider" aria-hidden="true">
                  <svg viewBox="0 0 14 18" preserveAspectRatio="none">
                    <path d="M2 2 C 10 6, 6 12, 12 16" fill="none" stroke="currentColor" strokeWidth="0.6" opacity="0.55" />
                  </svg>
                </span>
              )}
            </li>
          )
        })}
      </ol>

      <span className="marginalia__rule marginalia__rule--trail" aria-hidden="true" />

      <span className="marginalia__caption" aria-hidden="true">
        <span className="marginalia__caption-mark" aria-hidden="true">→</span>
        the active mark is <em>{activeMark.label}</em> · <em>{activeMark.note}</em>
      </span>
    </aside>
  )
}
