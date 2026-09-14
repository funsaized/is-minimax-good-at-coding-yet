import type { CSSProperties } from 'react'
import type { WordId } from './notes'
import type { VoiceId } from './PressBay'

type AnnotationRibbonProps = {
  active: WordId
  hovered: WordId | null
  voice: VoiceId
  onSelect: (id: WordId) => void
  onHover: (id: WordId) => void
  onLeave: () => void
}

type RibbonEntry = {
  id: WordId
  index: string
  folio: string
  mark: string
  markLabel: string
  glyph: 'stet' | 'caret' | 'query'
  word: string
  gloss: string
  ink: 'acid' | 'coral' | 'blue'
}

const RIBBON: RibbonEntry[] = [
  {
    id: 'm3',
    index: '01',
    folio: 'i',
    mark: 'stet',
    markLabel: 'let it stand',
    glyph: 'stet',
    word: 'm³',
    gloss: 'keep the fingerprint — the maker is a habit, not a logo.',
    ink: 'acid',
  },
  {
    id: 'good',
    index: '02',
    folio: 'ii',
    mark: 'caret',
    markLabel: 'insert here',
    glyph: 'caret',
    word: 'good at',
    gloss: 'choose one clear thing — make room for the reader to stand.',
    ink: 'coral',
  },
  {
    id: 'yet',
    index: '03',
    folio: 'iii',
    mark: 'query',
    markLabel: 'is this true?',
    glyph: 'query',
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

const VOICE_LETTER: Record<VoiceId, string> = { quiet: 'A', human: 'B', bold: 'C' }

function MarkGlyph({ glyph, ink }: { glyph: RibbonEntry['glyph']; ink: RibbonEntry['ink'] }) {
  if (glyph === 'stet') {
    return (
      <svg className="annotation-ribbon__mark-svg" viewBox="0 0 70 28" aria-hidden="true">
        <text x="2" y="9" className={`annotation-ribbon__mark-tag annotation-ribbon__mark-tag--${ink}`}>stet</text>
        <path
          d="M2 22c6-4 10 4 16 0s10-4 16 0 10 4 16 0 10-4 16 0"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.1"
          strokeLinecap="round"
          strokeDasharray="160 160"
          className="annotation-ribbon__mark-stroke"
        />
      </svg>
    )
  }
  if (glyph === 'caret') {
    return (
      <svg className="annotation-ribbon__mark-svg" viewBox="0 0 50 28" aria-hidden="true">
        <text x="2" y="9" className={`annotation-ribbon__mark-tag annotation-ribbon__mark-tag--${ink}`}>insert</text>
        <path d="M25 24l-9-11h18z" fill="currentColor" opacity=".85" className="annotation-ribbon__mark-fill" />
        <line x1="4" y1="24" x2="46" y2="24" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      </svg>
    )
  }
  return (
    <svg className="annotation-ribbon__mark-svg" viewBox="0 0 60 28" aria-hidden="true">
      <text x="2" y="9" className={`annotation-ribbon__mark-tag annotation-ribbon__mark-tag--${ink}`}>query</text>
      <text x="48" y="24" textAnchor="end" fontFamily="Georgia, serif" fontStyle="italic" fontSize="18" fill="currentColor" className="annotation-ribbon__mark-fill">?</text>
      <ellipse cx="48" cy="20" rx="10" ry="8" fill="none" stroke="currentColor" strokeWidth=".9" strokeDasharray="56 56" className="annotation-ribbon__mark-stroke" />
    </svg>
  )
}

export function AnnotationRibbon({ active, hovered, voice, onSelect, onHover, onLeave }: AnnotationRibbonProps) {
  const display = hovered ?? active
  const style = { '--ribbon-voice-letter': `'${VOICE_LETTER[voice]}'` } as CSSProperties
  return (
    <aside className="annotation-ribbon" aria-label="Reader's marginalia on the title" style={style}>
      <span className="annotation-ribbon__head" aria-hidden="true">
        <span className="annotation-ribbon__head-line" />
        <span className="annotation-ribbon__head-tag">
          <span className="annotation-ribbon__head-dot" />
          reader's marginalia
        </span>
        <span className="annotation-ribbon__head-line" />
      </span>
      <span className="annotation-ribbon__cap" aria-hidden="true">
        <span className="annotation-ribbon__cap-folio">folio i · three marks</span>
        <span className="annotation-ribbon__cap-press">set in {VOICE_LABEL[voice]}</span>
      </span>
      <ol className="annotation-ribbon__list">
        {RIBBON.map((entry) => {
          const isActive = entry.id === display
          return (
            <li
              key={entry.id}
              className={`annotation-ribbon__item annotation-ribbon__item--${entry.id} ${isActive ? 'is-active' : ''}`}
            >
              <button
                type="button"
                className={`annotation-ribbon__card annotation-ribbon__card--${entry.ink}`}
                onClick={() => onSelect(entry.id)}
                onMouseEnter={() => onHover(entry.id)}
                onMouseLeave={onLeave}
                onFocus={() => onHover(entry.id)}
                onBlur={onLeave}
                aria-pressed={isActive}
                aria-describedby={`note-${entry.id}`}
              >
                <span className="annotation-ribbon__rule" aria-hidden="true" />
                <span className="annotation-ribbon__pin" aria-hidden="true">
                  <svg viewBox="0 0 18 18">
                    <ellipse cx="9" cy="16" rx="3.2" ry=".8" fill="rgba(0, 0, 0, .35)" />
                    <line x1="9" y1="11" x2="9" y2="16" stroke="rgba(0, 0, 0, .35)" strokeWidth=".55" />
                    <circle cx="9" cy="7" r="5" fill={`var(--${entry.ink})`} />
                    <circle cx="7.5" cy="5.5" r="1.6" fill="rgba(255, 255, 255, .45)" />
                  </svg>
                </span>
                <span className="annotation-ribbon__head-row">
                  <span className="annotation-ribbon__num">{entry.index}</span>
                  <span className="annotation-ribbon__folio">folio {entry.folio}</span>
                  <span className="annotation-ribbon__divider" aria-hidden="true">·</span>
                  <span className={`annotation-ribbon__mark annotation-ribbon__mark--${entry.ink}`}>
                    <MarkGlyph glyph={entry.glyph} ink={entry.ink} />
                  </span>
                </span>
                <span className={`annotation-ribbon__word annotation-ribbon__word--${entry.ink}`}>
                  {entry.word}
                </span>
                <span className="annotation-ribbon__gloss">
                  <em className={`annotation-ribbon__gloss-mark annotation-ribbon__gloss-mark--${entry.ink}`}>↳</em>
                  {entry.gloss}
                </span>
                <span className="annotation-ribbon__meta">
                  <span className="annotation-ribbon__meta-mark">{entry.mark}</span>
                  <span className="annotation-ribbon__meta-sep" aria-hidden="true">·</span>
                  <span className="annotation-ribbon__meta-label">{entry.markLabel}</span>
                </span>
                <span className="annotation-ribbon__scribble" aria-hidden="true">
                  <svg viewBox="0 0 80 12" preserveAspectRatio="none">
                    <path
                      d="M2 8c8-5 16 4 24-1s16-5 24-2 16 4 24-2"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="0.9"
                      strokeLinecap="round"
                      strokeDasharray="120 120"
                      className="annotation-ribbon__scribble-stroke"
                    />
                    <circle cx="78" cy="6" r="0.9" fill="currentColor" className="annotation-ribbon__scribble-dot" />
                  </svg>
                </span>
              </button>
              <span className="annotation-ribbon__connector-slot" aria-hidden="true">
                {isActive && (
                  <svg className="annotation-ribbon__thread" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                    <path
                      d="M 100 50 C 82 50, 70 36, 44 30"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="0.5"
                      strokeLinecap="round"
                      strokeDasharray="1 2"
                      className="annotation-ribbon__thread-path"
                    />
                    <circle cx="100" cy="50" r="1.2" fill="currentColor" className="annotation-ribbon__thread-bead" />
                    <circle cx="44" cy="30" r="0.7" fill="currentColor" className="annotation-ribbon__thread-tip" />
                  </svg>
                )}
              </span>
            </li>
          )
        })}
      </ol>
      <span className="annotation-ribbon__foot" aria-hidden="true">
        <span className="annotation-ribbon__foot-mark">※</span>
        <span className="annotation-ribbon__foot-text">
          the marked words above are kept close. hover, focus, or tap a card to follow the mark.
        </span>
      </span>
    </aside>
  )
}