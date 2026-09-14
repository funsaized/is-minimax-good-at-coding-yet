import type { CSSProperties } from 'react'
import type { WordId } from './notes'
import type { VoiceId } from './Press'

type MarginGutterProps = {
  active: WordId
  hovered: WordId | null
  voice: VoiceId
  onSelect: (id: WordId) => void
  onHover: (id: WordId) => void
  onLeave: () => void
}

type MarginEntry = {
  id: WordId
  index: string
  folio: string
  glyph: 'stet' | 'caret' | 'query'
  mark: string
  markLabel: string
  word: string
  gloss: string
  ink: 'acid' | 'coral' | 'blue'
}

const MARGINS: MarginEntry[] = [
  {
    id: 'm3',
    index: 'i',
    folio: 'i',
    glyph: 'stet',
    mark: 'stet',
    markLabel: 'let it stand',
    word: 'm³',
    gloss: 'keep the fingerprint — the maker is a habit, not a logo.',
    ink: 'acid',
  },
  {
    id: 'good',
    index: 'ii',
    folio: 'ii',
    glyph: 'caret',
    mark: 'caret',
    markLabel: 'insert here',
    word: 'good at',
    gloss: 'choose one clear thing — make room for the reader to stand.',
    ink: 'coral',
  },
  {
    id: 'yet',
    index: 'iii',
    folio: 'iii',
    glyph: 'query',
    mark: 'query',
    markLabel: 'is this true?',
    word: 'yet?',
    gloss: 'protect the pause — the question mark is doing real work.',
    ink: 'blue',
  },
]

const VOICE_LABEL: Record<VoiceId, string> = {
  quiet: 'quiet cut',
  human: 'human hand',
  bold: 'bold signal',
}

function MarkGlyph({ glyph, ink }: { glyph: MarginEntry['glyph']; ink: MarginEntry['ink'] }) {
  if (glyph === 'stet') {
    return (
      <svg className="margin-gutter__glyph-svg" viewBox="0 0 56 22" aria-hidden="true">
        <path
          d="M2 18c6-4 10 4 16 0s10-4 16 0 10 4 16 0"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
          className="margin-gutter__glyph-stroke margin-gutter__glyph-stroke--draw"
        />
        <circle cx="54" cy="18" r="1.2" fill="currentColor" className="margin-gutter__glyph-bead" />
      </svg>
    )
  }
  if (glyph === 'caret') {
    return (
      <svg className="margin-gutter__glyph-svg" viewBox="0 0 40 22" aria-hidden="true">
        <path d="M20 18l-7-9h14z" fill="currentColor" className="margin-gutter__glyph-fill" />
        <line x1="3" y1="18" x2="37" y2="18" stroke="currentColor" strokeWidth=".9" strokeLinecap="round" />
      </svg>
    )
  }
  return (
    <svg className="margin-gutter__glyph-svg" viewBox="0 0 44 22" aria-hidden="true">
      <ellipse cx="32" cy="14" rx="8" ry="6" fill="none" stroke="currentColor" strokeWidth=".8" className="margin-gutter__glyph-stroke margin-gutter__glyph-stroke--draw" />
      <text
        x="32"
        y="18"
        textAnchor="middle"
        fontFamily="Georgia, 'Iowan Old Style', serif"
        fontStyle="italic"
        fontSize="14"
        fill="currentColor"
      >
        ?
      </text>
    </svg>
  )
}

export function MarginGutter({ active, hovered, voice, onSelect, onHover, onLeave }: MarginGutterProps) {
  const display = hovered ?? active
  const style = { '--gutter-ink': `var(--${display === 'm3' ? 'acid' : display === 'good' ? 'coral' : 'blue'})` } as CSSProperties

  return (
    <aside className="margin-gutter" aria-label="Marginalia anchored to the title" style={style}>
      <span className="margin-gutter__rule margin-gutter__rule--top" aria-hidden="true" />
      <header className="margin-gutter__head">
        <span className="margin-gutter__head-rule" aria-hidden="true" />
        <span className="margin-gutter__head-tag">
          <span className="margin-gutter__head-dot" aria-hidden="true" />
          <span className="margin-gutter__head-eyebrow">margin</span>
          <span className="margin-gutter__head-title">folio i · marginalia</span>
        </span>
        <span className="margin-gutter__head-rule margin-gutter__head-rule--alt" aria-hidden="true" />
      </header>

      <ol className="margin-gutter__list">
        {MARGINS.map((entry) => {
          const isActive = entry.id === display
          return (
            <li
              key={entry.id}
              className={`margin-gutter__item margin-gutter__item--${entry.id} ${isActive ? 'is-active' : ''}`}
            >
              <button
                type="button"
                className={`margin-gutter__card margin-gutter__card--${entry.ink}`}
                onClick={() => onSelect(entry.id)}
                onMouseEnter={() => onHover(entry.id)}
                onMouseLeave={onLeave}
                onFocus={() => onHover(entry.id)}
                onBlur={onLeave}
                aria-pressed={isActive}
                aria-describedby={`note-${entry.id}`}
              >
                <span className="margin-gutter__thread" aria-hidden="true">
                  <svg viewBox="0 0 64 40" preserveAspectRatio="none">
                    <path
                      d="M62 20 C 40 20, 20 20, 4 14"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="0.6"
                      strokeDasharray="1 2"
                      className={`margin-gutter__thread-path margin-gutter__thread-path--${entry.id}`}
                    />
                    <circle cx="62" cy="20" r="1.1" fill="currentColor" className="margin-gutter__thread-bead" />
                    <circle cx="4" cy="14" r="0.7" fill="currentColor" className="margin-gutter__thread-tip" />
                  </svg>
                </span>
                <span className="margin-gutter__head-row">
                  <span className="margin-gutter__index">{entry.index}</span>
                  <span className="margin-gutter__folio" aria-hidden="true">folio {entry.folio}</span>
                  <span className="margin-gutter__divider" aria-hidden="true">·</span>
                  <span className={`margin-gutter__mark-tag margin-gutter__mark-tag--${entry.ink}`}>
                    {entry.mark}
                  </span>
                </span>
                <span className={`margin-gutter__word margin-gutter__word--${entry.ink}`}>{entry.word}</span>
                <span className="margin-gutter__glyph">
                  <MarkGlyph glyph={entry.glyph} ink={entry.ink} />
                </span>
                <span className="margin-gutter__gloss">
                  <em className={`margin-gutter__gloss-mark margin-gutter__gloss-mark--${entry.ink}`}>↳</em>
                  <span>{entry.gloss}</span>
                </span>
                <span className="margin-gutter__meta">
                  <span>{entry.markLabel}</span>
                </span>
              </button>
            </li>
          )
        })}
      </ol>

      <footer className="margin-gutter__foot">
        <span className="margin-gutter__foot-mark" aria-hidden="true">※</span>
        <span className="margin-gutter__foot-text">
          set in <em>{VOICE_LABEL[voice]}</em> · follow the mark
        </span>
      </footer>
      <span className="margin-gutter__rule margin-gutter__rule--bottom" aria-hidden="true" />
    </aside>
  )
}