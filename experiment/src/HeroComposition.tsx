import { useId, type CSSProperties } from 'react'
import type { WordId } from './notes'

type VoiceId = 'quiet' | 'human' | 'bold'

type HeroCompositionProps = {
  voice: VoiceId
  word: WordId
  hover: WordId | null
}

type Sort = {
  id: WordId
  index: string
  glyph: string
  mark: 'stet' | 'caret' | 'query'
  markLabel: string
  word: string
  tone: 'blue' | 'coral' | 'acid'
  face: string
  wordStyle: CSSProperties
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
    tone: 'blue',
    wordStyle: { fontFeatureSettings: "'ss01' 1, 'lnum' 1", letterSpacing: '-.01em' },
  },
  {
    id: 'good',
    index: 'ii',
    glyph: '∧',
    mark: 'caret',
    markLabel: 'make room',
    word: 'good at',
    face: 'x-height · clear verb',
    tone: 'coral',
    wordStyle: { letterSpacing: '-.018em' },
  },
  {
    id: 'yet',
    index: 'iii',
    glyph: '?',
    mark: 'query',
    markLabel: 'protect the pause',
    word: 'yet',
    face: 'descender · open',
    tone: 'acid',
    wordStyle: { letterSpacing: '-.01em', fontStyle: 'italic' },
  },
]

export function HeroComposition({ voice, word, hover }: HeroCompositionProps) {
  const id = useId().replace(/:/g, '')
  const gradId = `hc-bed-${id}`

  const toneStyle = {
    '--hc-tone': `var(--${voice})`,
    '--hc-word': `var(--${hover ?? word === 'm3' ? 'quiet' : word === 'good' ? 'human' : 'bold'})`,
  } as CSSProperties

  const activeId = hover ?? word

  return (
    <figure
      className="hero-composition"
      style={toneStyle}
      aria-label="The composing bed · three sorts set on one chase"
    >
      <svg
        className="hero-composition__defs"
        viewBox="0 0 1200 80"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
            <stop offset="20%" stopColor="currentColor" stopOpacity=".22" />
            <stop offset="50%" stopColor="currentColor" stopOpacity=".5" />
            <stop offset="80%" stopColor="currentColor" stopOpacity=".22" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      <span className="hero-composition__rail" aria-hidden="true">
        <span className="hero-composition__rail-pin hero-composition__rail-pin--l">
          <svg viewBox="0 0 8 8">
            <circle cx="4" cy="4" r="3.4" fill="currentColor" opacity=".75" />
            <circle cx="4" cy="4" r="1.6" fill="var(--night)" />
          </svg>
        </span>
        <span className="hero-composition__rail-line">
          <svg viewBox="0 0 1200 6" preserveAspectRatio="none">
            <line
              x1="0"
              y1="3"
              x2="1200"
              y2="3"
              stroke="currentColor"
              strokeWidth=".55"
              strokeDasharray="1 5"
              opacity=".7"
            />
          </svg>
        </span>
        <span
          className="hero-composition__rail-fill"
          style={{ background: `url(#${gradId})` }}
          aria-hidden="true"
        />
        <span className="hero-composition__rail-pin hero-composition__rail-pin--r">
          <svg viewBox="0 0 8 8">
            <circle cx="4" cy="4" r="3.4" fill="currentColor" opacity=".75" />
            <circle cx="4" cy="4" r="1.6" fill="var(--night)" />
          </svg>
        </span>
      </span>

      <ol className="hero-composition__sorts">
        {SORTS.map((sort, idx) => {
          const isActive = activeId === sort.id
          const sortStyle = {
            '--hc-sort-tone': `var(--${sort.tone})`,
            '--hc-sort-delay': `${idx * 70}ms`,
          } as CSSProperties
          return (
            <li
              key={sort.id}
              className={`hero-composition__sort hero-composition__sort--${sort.id} hero-composition__sort--${sort.tone} ${isActive ? 'is-active' : ''}`}
              style={sortStyle}
            >
              <span className="hero-composition__sort-index" aria-hidden="true">
                {sort.index}
              </span>
              <span className="hero-composition__sort-rail" aria-hidden="true" />
              <span className="hero-composition__sort-bead" aria-hidden="true">
                <svg viewBox="0 0 14 14">
                  <circle cx="7" cy="7" r="6" fill="var(--night)" stroke="currentColor" strokeWidth=".55" />
                  <circle cx="7" cy="7" r="3" fill="none" stroke="currentColor" strokeWidth=".3" strokeDasharray=".6 1.2" opacity=".75" />
                  <circle cx="7" cy="7" r="1" fill="currentColor" />
                </svg>
              </span>
              <span className="hero-composition__sort-marker" aria-hidden="true">
                <em>{sort.glyph}</em>
              </span>
              <span
                className="hero-composition__sort-word"
                style={sort.wordStyle}
                aria-hidden="true"
              >
                {sort.word}
              </span>
              <span className="hero-composition__sort-mark" aria-hidden="true">
                <em>{sort.mark}</em>
                <span>·</span>
                <em className="hero-composition__sort-mark-sub">{sort.markLabel}</em>
              </span>
              <span className="hero-composition__sort-face" aria-hidden="true">
                {sort.face}
              </span>
            </li>
          )
        })}
      </ol>
    </figure>
  )
}
