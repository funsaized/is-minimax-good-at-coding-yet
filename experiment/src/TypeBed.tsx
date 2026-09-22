import {
  useId,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react'
import type { WordId } from './notes'

type VoiceId = 'quiet' | 'human' | 'bold'

type TypeBedProps = {
  voice: VoiceId
  word: WordId
  hover: WordId | null
  onWord: (word: WordId, focus?: boolean) => void
  onHover: (word: WordId | null) => void
  onWordKey: (event: ReactKeyboardEvent<HTMLButtonElement>, id: WordId) => void
}

type Sort = {
  id: WordId
  index: string
  glyph: string
  mark: 'stet' | 'caret' | 'query'
  markLabel: string
  word: string
  face: string
  tone: string
  ascii: string
  label: string
  width: string
  ink: 'blue' | 'coral' | 'acid'
}

const SORTS: Sort[] = [
  {
    id: 'm3',
    index: 'i',
    glyph: '⌇',
    mark: 'stet',
    markLabel: 'let it stand',
    word: 'm³',
    face: 'ascender · small figure',
    tone: 'the maker',
    ascii: 'm³',
    label: 'A small mark for a habit.',
    width: '11 ems',
    ink: 'blue',
  },
  {
    id: 'good',
    index: 'ii',
    glyph: '∧',
    mark: 'caret',
    markLabel: 'make room',
    word: 'good at',
    face: 'x-height · clear verb',
    tone: 'the verb',
    ascii: 'good at',
    label: 'One clear verb, in plain sight.',
    width: '14 ems',
    ink: 'coral',
  },
  {
    id: 'yet',
    index: 'iii',
    glyph: '?',
    mark: 'query',
    markLabel: 'protect the pause',
    word: 'yet?',
    face: 'descender · open',
    tone: 'the pause',
    ascii: 'yet?',
    label: 'The question mark, doing real work.',
    width: '9 ems',
    ink: 'acid',
  },
]

export function TypeBed({ voice, word, hover, onWord, onHover, onWordKey }: TypeBedProps) {
  const baseId = useId().replace(/:/g, '')
  const railGradId = `tb-rail-${baseId}`
  const toneStyle = { '--tb-tone': `var(--${voice})` } as CSSProperties

  return (
    <figure
      className={`type-bed type-bed--${voice}`}
      style={toneStyle}
      aria-label="The three words as composing sorts, set on a single rail"
    >
      <svg className="type-bed__defs" viewBox="0 0 480 140" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id={railGradId} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--tb-tone)" stopOpacity="0" />
            <stop offset="8%" stopColor="var(--tb-tone)" stopOpacity=".5" />
            <stop offset="50%" stopColor="var(--tb-tone)" stopOpacity=".7" />
            <stop offset="92%" stopColor="var(--tb-tone)" stopOpacity=".5" />
            <stop offset="100%" stopColor="var(--tb-tone)" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      <header className="type-bed__head" aria-hidden="true">
        <span className="type-bed__head-key">
          <span className="type-bed__head-bead" />
          composing bed
        </span>
        <span className="type-bed__head-rule" />
        <span className="type-bed__head-sub">three sorts · one rail · one chase</span>
      </header>

      <span className="type-bed__rail" aria-hidden="true">
        <span className="type-bed__rail-line" />
        <span className="type-bed__rail-fill" />
        <span className="type-bed__rail-pin type-bed__rail-pin--l">
          <svg viewBox="0 0 12 12"><circle cx="6" cy="6" r="5" fill="var(--night)" stroke="currentColor" strokeWidth=".5" /><circle cx="6" cy="6" r="1.4" fill="currentColor" /></svg>
        </span>
        <span className="type-bed__rail-pin type-bed__rail-pin--r">
          <svg viewBox="0 0 12 12"><circle cx="6" cy="6" r="5" fill="var(--night)" stroke="currentColor" strokeWidth=".5" /><circle cx="6" cy="6" r="1.4" fill="currentColor" /></svg>
        </span>
      </span>

      <ol className="type-bed__sorts">
        {SORTS.map((sort, idx) => {
          const isActive = word === sort.id
          const isHover = hover === sort.id
          const sortStyle = {
            '--tb-sort-tone': `var(--${sort.ink})`,
            '--tb-sort-delay': `${idx * 90}ms`,
          } as CSSProperties
          return (
            <li
              key={sort.id}
              className={`type-bed__sort type-bed__sort--${sort.id} type-bed__sort--${sort.ink} ${isActive ? 'is-active' : ''} ${isHover ? 'is-hover' : ''}`}
              style={sortStyle}
            >
              <span className="type-bed__sort-pin" aria-hidden="true">
                <svg viewBox="0 0 14 14">
                  <circle cx="7" cy="7" r="6" fill="var(--night)" stroke="currentColor" strokeWidth=".5" />
                  <circle cx="7" cy="7" r="3.4" fill="none" stroke="currentColor" strokeWidth=".3" strokeDasharray=".9 1.4" opacity=".7" />
                  <circle cx="7" cy="7" r="1" fill="currentColor" />
                </svg>
              </span>

              <span className="type-bed__sort-glyph" aria-hidden="true">{sort.glyph}</span>

              <button
                type="button"
                className="type-bed__sort-bed"
                onClick={() => onWord(sort.id, true)}
                onMouseEnter={() => onHover(sort.id)}
                onMouseLeave={() => onHover(null)}
                onFocus={() => onHover(sort.id)}
                onBlur={() => onHover(null)}
                onKeyDown={event => onWordKey(event, sort.id)}
                aria-pressed={isActive}
                aria-label={`Sort ${sort.index} · ${sort.word} · ${sort.markLabel}. ${sort.tone}.`}
              >
                <span className="type-bed__sort-ascii" aria-hidden="true">
                  <span className="type-bed__sort-ascender" aria-hidden="true" />
                  <span className="type-bed__sort-stem" aria-hidden="true">
                    <span className="type-bed__sort-cap">{sort.ascii}</span>
                  </span>
                  <span className="type-bed__sort-baseline" aria-hidden="true" />
                  <span className="type-bed__sort-foot" aria-hidden="true" />
                </span>
                <span className="type-bed__sort-mark" aria-hidden="true">
                  <em>{sort.mark}</em>
                  <span>{sort.markLabel}</span>
                </span>
              </button>

              <span className="type-bed__sort-tone" aria-hidden="true">{sort.tone}</span>

              {idx < SORTS.length - 1 && (
                <span className="type-bed__sort-kern" aria-hidden="true" key={`kern-${baseId}-${idx}`}>
                  <svg viewBox="0 0 10 16" preserveAspectRatio="none">
                    <path d="M1 0 L9 8 L1 16" fill="none" stroke="currentColor" strokeWidth=".7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              )}
            </li>
          )
        })}
      </ol>

      <footer className="type-bed__foot" aria-hidden="true">
        <span className="type-bed__foot-rule" />
        <span className="type-bed__foot-tag">
          <em>tap a sort · set the mark</em>
        </span>
        <span className="type-bed__foot-num">
          <em>iii</em>
          <span>sorts on the bed</span>
        </span>
        <span className="type-bed__foot-rule" />
      </footer>
    </figure>
  )
}
