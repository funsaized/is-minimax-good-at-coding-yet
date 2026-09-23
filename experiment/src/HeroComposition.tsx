import { useId, type CSSProperties } from 'react'
import type { VoiceId } from './App'
import type { WordId } from './notes'

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
  markFull: string
  word: string
  face: string
  voice: VoiceId
  wordStyle: CSSProperties
}

const SORTS: Sort[] = [
  {
    id: 'm3',
    index: 'i',
    glyph: '⌇',
    mark: 'stet',
    markLabel: 'let it stand',
    markFull: 'stet — let the fingerprint stand',
    word: 'm³',
    face: 'ascender · small figure',
    voice: 'quiet',
    wordStyle: { letterSpacing: '-.01em' },
  },
  {
    id: 'good',
    index: 'ii',
    glyph: '∧',
    mark: 'caret',
    markLabel: 'make room',
    markFull: 'caret — make room for the verb',
    word: 'good at',
    face: 'x-height · the verb',
    voice: 'human',
    wordStyle: { letterSpacing: '-.018em' },
  },
  {
    id: 'yet',
    index: 'iii',
    glyph: '?',
    mark: 'query',
    markLabel: 'protect the pause',
    markFull: 'query — protect the pause',
    word: 'yet',
    face: 'descender · open',
    voice: 'bold',
    wordStyle: { letterSpacing: '-.01em', fontStyle: 'italic' },
  },
]

export function HeroComposition({ voice, word, hover }: HeroCompositionProps) {
  const id = useId().replace(/:/g, '')
  const gradId = `hc-bed-${id}`
  const activeId = hover ?? word
  const activeIdx = SORTS.findIndex(s => s.id === activeId)
  const activeMark = SORTS[activeIdx]

  const toneStyle = {
    '--hc-tone': `var(--${voice})`,
    '--hc-active': `var(--${activeMark.voice})`,
  } as CSSProperties

  return (
    <figure
      className="hero-composition"
      style={toneStyle}
      aria-label={`The type bed · three sorts set on one chase · active mark ${activeMark.mark}`}
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
            <stop offset="18%" stopColor="currentColor" stopOpacity=".18" />
            <stop offset="50%" stopColor="currentColor" stopOpacity=".42" />
            <stop offset="82%" stopColor="currentColor" stopOpacity=".18" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      <header className="hero-composition__head" aria-hidden="true">
        <span className="hero-composition__head-key">
          <span className="hero-composition__head-glyph">
            <svg viewBox="0 0 14 14">
              <rect x="1" y="1" width="12" height="12" fill="none" stroke="currentColor" strokeWidth=".55" rx="1" />
              <line x1="1" y1="7" x2="13" y2="7" stroke="currentColor" strokeWidth=".35" opacity=".55" />
              <line x1="7" y1="1" x2="7" y2="13" stroke="currentColor" strokeWidth=".35" opacity=".55" />
              <rect x="2.5" y="2.5" width="3.5" height="3.5" fill="currentColor" opacity=".5" />
            </svg>
          </span>
          <em className="hero-composition__head-name">the type bed</em>
          <span className="hero-composition__head-dot">·</span>
          <em className="hero-composition__head-sub">three sorts on one chase</em>
        </span>
        <span className="hero-composition__head-mark" aria-hidden="true">
          <span className="hero-composition__head-mark-rule" />
          <em>specimen · {activeMark.face}</em>
        </span>
      </header>

      <div className="hero-composition__plate" aria-hidden="true">
        <span className="hero-composition__plate-rule hero-composition__plate-rule--top" />
        <span className="hero-composition__plate-rule hero-composition__plate-rule--bot" />

        <span className="hero-composition__plate-edge hero-composition__plate-edge--l">
          <svg viewBox="0 0 4 60" preserveAspectRatio="none">
            <line x1="2" y1="0" x2="2" y2="60" stroke="currentColor" strokeWidth=".55" opacity=".55" />
            <line x1="1" y1="14" x2="3" y2="14" stroke="currentColor" strokeWidth=".4" opacity=".7" />
            <line x1="1" y1="46" x2="3" y2="46" stroke="currentColor" strokeWidth=".4" opacity=".7" />
          </svg>
        </span>
        <span className="hero-composition__plate-edge hero-composition__plate-edge--r">
          <svg viewBox="0 0 4 60" preserveAspectRatio="none">
            <line x1="2" y1="0" x2="2" y2="60" stroke="currentColor" strokeWidth=".55" opacity=".55" />
            <line x1="1" y1="14" x2="3" y2="14" stroke="currentColor" strokeWidth=".4" opacity=".7" />
            <line x1="1" y1="46" x2="3" y2="46" stroke="currentColor" strokeWidth=".4" opacity=".7" />
          </svg>
        </span>

        <span className="hero-composition__plate-ticks" aria-hidden="true">
          <svg viewBox="0 0 1200 14" preserveAspectRatio="none">
            <g stroke="currentColor" strokeWidth=".35" opacity=".55">
              <line x1="40" y1="0" x2="40" y2="6" />
              <line x1="160" y1="0" x2="160" y2="6" />
              <line x1="280" y1="0" x2="280" y2="6" />
              <line x1="400" y1="0" x2="400" y2="6" />
              <line x1="520" y1="0" x2="520" y2="6" />
              <line x1="640" y1="0" x2="640" y2="6" />
              <line x1="760" y1="0" x2="760" y2="6" />
              <line x1="880" y1="0" x2="880" y2="6" />
              <line x1="1000" y1="0" x2="1000" y2="6" />
              <line x1="1120" y1="0" x2="1120" y2="6" />
            </g>
            <g fill="currentColor" opacity=".7">
              <circle cx="40" cy="11" r=".7" />
              <circle cx="280" cy="11" r=".7" />
              <circle cx="640" cy="11" r="1.2" />
              <circle cx="1000" cy="11" r=".7" />
              <circle cx="1120" cy="11" r=".7" />
            </g>
          </svg>
        </span>

        <span className="hero-composition__stick" aria-hidden="true">
          <svg viewBox="0 0 1200 60" preserveAspectRatio="none">
            <defs>
              <linearGradient id={`hc-stick-edge-${id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(245, 238, 216, .42)" />
                <stop offset="100%" stopColor="rgba(245, 238, 216, .14)" />
              </linearGradient>
            </defs>
            <rect x="22" y="22" width="1156" height="16" fill={`url(#${gradId})`} opacity=".18" />
            <rect x="22" y="22" width="1156" height="2" fill={`url(#hc-stick-edge-${id})`} opacity=".7" />
            <rect x="22" y="36" width="1156" height="2" fill={`url(#hc-stick-edge-${id})`} opacity=".55" />
            <line x1="22" y1="29" x2="1178" y2="29" stroke="rgba(245, 238, 216, .14)" strokeWidth=".55" />
            <line x1="22" y1="31" x2="1178" y2="31" stroke="rgba(245, 238, 216, .08)" strokeWidth=".35" />
          </svg>
        </span>

        <ol className="hero-composition__sorts">
          {SORTS.map((sort, idx) => {
            const isActive = activeId === sort.id
            const sortStyle = {
              '--hc-sort-tone': `var(--${sort.voice})`,
              '--hc-sort-delay': `${idx * 90}ms`,
              '--hc-sort-lift': isActive ? '-6px' : '0px',
            } as CSSProperties
            const wordStyle = {
              ...sort.wordStyle,
              color: isActive ? `var(--${sort.voice})` : 'var(--paper)',
            } as CSSProperties
            return (
              <li
                key={sort.id}
                className={`hero-composition__sort hero-composition__sort--${sort.id} hero-composition__sort--${sort.voice} ${isActive ? 'is-active' : ''}`}
                style={sortStyle}
              >
                <span className="hero-composition__sort-mark" aria-hidden="true">
                  <span className="hero-composition__sort-mark-glyph">{sort.glyph}</span>
                  <span className="hero-composition__sort-mark-key">{sort.mark}</span>
                </span>

                <span className="hero-composition__sort-piece" aria-hidden="true">
                  <span className="hero-composition__sort-piece-edge" />
                  <span className="hero-composition__sort-piece-bearing">
                    <svg viewBox="0 0 60 28" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id={`hc-bearing-${id}-${idx}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="rgba(245, 238, 216, .12)" />
                          <stop offset="60%" stopColor="rgba(245, 238, 216, .04)" />
                          <stop offset="100%" stopColor="rgba(245, 238, 216, 0)" />
                        </linearGradient>
                      </defs>
                      <rect x="0" y="0" width="60" height="28" fill={`url(#hc-bearing-${id}-${idx})`} />
                      <rect x="0" y="0" width="60" height="2" fill="rgba(245, 238, 216, .22)" />
                      <line x1="0" y1="6" x2="60" y2="6" stroke="rgba(245, 238, 216, .08)" strokeWidth=".35" />
                      <line x1="0" y1="24" x2="60" y2="24" stroke="rgba(245, 238, 216, .14)" strokeWidth=".35" />
                      <circle cx="6" cy="14" r=".8" fill="rgba(245, 238, 216, .28)" />
                      <circle cx="54" cy="14" r=".8" fill="rgba(245, 238, 216, .28)" />
                    </svg>
                  </span>
                  <span className="hero-composition__sort-word" style={wordStyle}>
                    {sort.word}
                  </span>
                  <span className="hero-composition__sort-piece-shadow" />
                </span>

                <span className="hero-composition__sort-legend" aria-hidden="true">
                  <em className="hero-composition__sort-legend-idx">{sort.index}</em>
                  <span className="hero-composition__sort-legend-mark">{sort.markLabel}</span>
                </span>
              </li>
            )
          })}
        </ol>

        <span className="hero-composition__quoin hero-composition__quoin--l" aria-hidden="true">
          <svg viewBox="0 0 28 60" preserveAspectRatio="none">
            <path d="M2 4 L26 4 L22 14 L26 24 L22 34 L26 44 L22 56 L2 56 Z" fill="rgba(245, 238, 216, .14)" stroke="rgba(245, 238, 216, .42)" strokeWidth=".55" />
            <path d="M2 4 L26 4 L22 14 L26 24 L22 34 L26 44 L22 56 L2 56 Z" fill="none" stroke="rgba(245, 238, 216, .28)" strokeWidth=".35" />
            <line x1="6" y1="14" x2="22" y2="14" stroke="rgba(245, 238, 216, .42)" strokeWidth=".4" />
            <line x1="6" y1="24" x2="22" y2="24" stroke="rgba(245, 238, 216, .42)" strokeWidth=".4" />
            <line x1="6" y1="34" x2="22" y2="34" stroke="rgba(245, 238, 216, .42)" strokeWidth=".4" />
            <line x1="6" y1="44" x2="22" y2="44" stroke="rgba(245, 238, 216, .42)" strokeWidth=".4" />
            <circle cx="14" cy="9" r="1" fill="currentColor" />
            <circle cx="14" cy="50" r="1" fill="currentColor" />
          </svg>
        </span>
        <span className="hero-composition__quoin hero-composition__quoin--r" aria-hidden="true">
          <svg viewBox="0 0 28 60" preserveAspectRatio="none">
            <path d="M26 4 L2 4 L6 14 L2 24 L6 34 L2 44 L6 56 L26 56 Z" fill="rgba(245, 238, 216, .14)" stroke="rgba(245, 238, 216, .42)" strokeWidth=".55" />
            <path d="M26 4 L2 4 L6 14 L2 24 L6 34 L2 44 L6 56 L26 56 Z" fill="none" stroke="rgba(245, 238, 216, .28)" strokeWidth=".35" />
            <line x1="6" y1="14" x2="22" y2="14" stroke="rgba(245, 238, 216, .42)" strokeWidth=".4" />
            <line x1="6" y1="24" x2="22" y2="24" stroke="rgba(245, 238, 216, .42)" strokeWidth=".4" />
            <line x1="6" y1="34" x2="22" y2="34" stroke="rgba(245, 238, 216, .42)" strokeWidth=".4" />
            <line x1="6" y1="44" x2="22" y2="44" stroke="rgba(245, 238, 216, .42)" strokeWidth=".4" />
            <circle cx="14" cy="9" r="1" fill="currentColor" />
            <circle cx="14" cy="50" r="1" fill="currentColor" />
          </svg>
        </span>

        <span className="hero-composition__plate-progress" aria-hidden="true">
          <svg viewBox="0 0 1200 4" preserveAspectRatio="none">
            <line
              x1="0"
              y1="2"
              x2={1200 * ((activeIdx + 1) / SORTS.length)}
              y2="2"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              opacity=".75"
            />
            <line
              x1="0"
              y1="2"
              x2="1200"
              y2="2"
              stroke="rgba(245, 238, 216, .12)"
              strokeWidth=".55"
              strokeDasharray="1 4"
            />
          </svg>
        </span>
      </div>

      <footer className="hero-composition__foot" aria-hidden="true">
        <span className="hero-composition__foot-key">now set</span>
        <em className="hero-composition__foot-mark">
          <span className="hero-composition__foot-mark-glyph">{activeMark.glyph}</span>
          <span className="hero-composition__foot-mark-word">{activeMark.markFull}</span>
        </em>
        <span className="hero-composition__foot-dot">·</span>
        <em className="hero-composition__foot-voice">
          {activeMark.word} sits proud at folio i
        </em>
        <span className="hero-composition__foot-rule" />
      </footer>
    </figure>
  )
}
