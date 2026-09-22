import {
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react'
import type { VoiceId } from './App'
import type { WordId } from './notes'

type TypeCaseProps = {
  voice: VoiceId
  word: WordId
  hover: WordId | null
  pullSignal: number
  isPulling: boolean
  onWord: (word: WordId, focus?: boolean) => void
  onHover: (word: WordId | null) => void
}

type Sort = {
  id: WordId
  index: string
  glyph: string
  mark: string
  markLabel: string
  word: string
  face: string
  typeNote: string
  tone: 'blue' | 'coral' | 'acid'
}

const SORTS: Sort[] = [
  {
    id: 'm3',
    index: '01',
    glyph: '⌇',
    mark: 'stet',
    markLabel: 'let it stand',
    word: 'm³',
    face: 'small figure',
    typeNote: 'A · ascender sort',
    tone: 'blue',
  },
  {
    id: 'good',
    index: '02',
    glyph: '∧',
    mark: 'caret',
    markLabel: 'make room',
    word: 'good at',
    face: 'x-height sort',
    typeNote: 'B · caret sort',
    tone: 'coral',
  },
  {
    id: 'yet',
    index: '03',
    glyph: '?',
    mark: 'query',
    markLabel: 'protect the pause',
    word: 'yet?',
    face: 'descender sort',
    typeNote: 'C · query sort',
    tone: 'acid',
  },
]

const ORDER: WordId[] = ['m3', 'good', 'yet']

export function TypeCase({
  voice,
  word,
  hover,
  pullSignal,
  isPulling,
  onWord,
  onHover,
}: TypeCaseProps) {
  const baseId = useId().replace(/:/g, '')
  const washId = `tc-wash-${baseId}`
  const lastPull = useRef(pullSignal)
  const [tighten, setTighten] = useState(0)
  const [reduceMotion, setReduceMotion] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduceMotion(mq.matches)
    const onChange = () => setReduceMotion(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    if (lastPull.current === pullSignal) return
    lastPull.current = pullSignal
    if (reduceMotion) return
    setTighten(t => t + 1)
    const id = window.setTimeout(() => setTighten(t => t), 850)
    return () => window.clearTimeout(id)
  }, [pullSignal, reduceMotion])

  const display = hover ?? word
  const style = {
    '--tc-voice': `var(--${voice})`,
    '--tc-tone': `var(--${display === 'm3' ? 'quiet' : display === 'good' ? 'human' : 'bold'})`,
  } as CSSProperties

  const onKey = (event: ReactKeyboardEvent<HTMLButtonElement>, id: WordId) => {
    const idx = ORDER.indexOf(id)
    let next = idx
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (idx + 1) % ORDER.length
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (idx - 1 + ORDER.length) % ORDER.length
    else if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = ORDER.length - 1
    if (next === idx) return
    event.preventDefault()
    onWord(ORDER[next], true)
  }

  return (
    <figure
      className={`type-case type-case--${voice} ${isPulling ? 'is-pulling' : ''} ${tighten > 0 ? 'is-tightening' : ''}`}
      style={style}
      aria-label="The composing case · three type pieces set on one chase, awaiting the lever"
    >
      <svg className="type-case__defs" viewBox="0 0 1200 240" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id={washId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--tc-tone)" stopOpacity="0" />
            <stop offset="50%" stopColor="var(--tc-tone)" stopOpacity=".18" />
            <stop offset="100%" stopColor="var(--tc-tone)" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      <span className="type-case__wash" aria-hidden="true">
        <svg viewBox="0 0 1200 240" preserveAspectRatio="none">
          <rect x="0" y="0" width="1200" height="240" fill={`url(#${washId})`} />
        </svg>
      </span>

      <header className="type-case__head" aria-hidden="true">
        <span className="type-case__head-key">
          <span className="type-case__head-line" />
          <em>the composing case</em>
        </span>
        <span className="type-case__head-meta">
          <em>three sorts</em>
          <span className="type-case__head-dot" aria-hidden="true">·</span>
          <em>one chase</em>
          <span className="type-case__head-dot" aria-hidden="true">·</span>
          <em>awaiting the lever</em>
        </span>
        <span className="type-case__head-key type-case__head-key--right">
          <em>folio i ↦ ii</em>
          <span className="type-case__head-line" />
        </span>
      </header>

      <span className="type-case__rule type-case__rule--top" aria-hidden="true">
        <svg viewBox="0 0 1200 12" preserveAspectRatio="none">
          <line x1="0" y1="6" x2="1200" y2="6" stroke="currentColor" strokeWidth=".5" strokeDasharray="1 4" opacity=".5" />
        </svg>
        <span className="type-case__rule-pin type-case__rule-pin--l" />
        <span className="type-case__rule-pin type-case__rule-pin--r" />
      </span>

      <ol className="type-case__sorts" role="list">
        {SORTS.map((sort, idx) => {
          const isActive = display === sort.id
          const sortStyle = {
            '--tc-sort-tone': `var(--${sort.tone})`,
            '--tc-sort-key': String(idx + 1),
            '--tc-sort-delay': `${idx * 80}ms`,
          } as CSSProperties
          return (
            <li
              key={sort.id}
              className={`type-case__cell type-case__cell--${sort.tone} ${isActive ? 'is-active' : ''}`}
              style={sortStyle}
            >
              <button
                type="button"
                className={`type-case__sort type-case__sort--${sort.tone} ${isActive ? 'is-active' : ''}`}
                style={sortStyle}
                onClick={() => onWord(sort.id)}
                onMouseEnter={() => onHover(sort.id)}
                onMouseLeave={() => onHover(null)}
                onFocus={() => onHover(sort.id)}
                onBlur={() => onHover(null)}
                onKeyDown={event => onKey(event, sort.id)}
                aria-pressed={isActive}
                aria-label={`Sort ${sort.index} · ${sort.word} · ${sort.mark} — ${sort.markLabel}. Tap to set the page on this word.`}
              >
                <span className="type-case__sort-compartment" aria-hidden="true">
                  <span className="type-case__sort-bed" />
                  <span className="type-case__sort-shadow" />
                  <span className="type-case__sort-cord" />
                </span>

                <span className="type-case__sort-meta" aria-hidden="true">
                  <span className="type-case__sort-key-num">{sort.index}</span>
                  <span className="type-case__sort-type-note">{sort.typeNote}</span>
                </span>

                <span className="type-case__sort-block" aria-hidden="true">
                  <span className="type-case__sort-block-face">{sort.face}</span>
                  <span className="type-case__sort-glyph">{sort.glyph}</span>
                  <span className="type-case__sort-mark-row">
                    <span className="type-case__sort-mark">{sort.mark}</span>
                    <span className="type-case__sort-mark-dot" aria-hidden="true">·</span>
                    <span className="type-case__sort-mark-sub">{sort.markLabel}</span>
                  </span>
                </span>

                <span className="type-case__sort-word" aria-hidden="true">{sort.word}</span>

                <span className="type-case__sort-tug" aria-hidden="true">
                  <svg viewBox="0 0 18 18">
                    <path d="M3 4 L9 9 L15 4" fill="none" stroke="currentColor" strokeWidth=".6" strokeLinecap="round" />
                    <circle cx="9" cy="9" r="1.2" fill="currentColor" />
                    <path d="M9 9 L9 15" fill="none" stroke="currentColor" strokeWidth=".5" strokeLinecap="round" opacity=".6" />
                  </svg>
                </span>
              </button>
            </li>
          )
        })}
      </ol>

      <span className="type-case__rule type-case__rule--bot" aria-hidden="true">
        <svg viewBox="0 0 1200 12" preserveAspectRatio="none">
          <line x1="0" y1="6" x2="1200" y2="6" stroke="currentColor" strokeWidth=".5" strokeDasharray="1 4" opacity=".5" />
        </svg>
        <span className="type-case__rule-pin type-case__rule-pin--l" />
        <span className="type-case__rule-pin type-case__rule-pin--r" />
      </span>

      <footer className="type-case__foot" aria-hidden="true">
        <span className="type-case__foot-rule" />
        <em className="type-case__foot-line">
          click a sort <span className="type-case__foot-dot">·</span> set the word <span className="type-case__foot-dot">·</span> the chase tightens with the lever
        </em>
        <span className="type-case__foot-rule" />
      </footer>
    </figure>
  )
}