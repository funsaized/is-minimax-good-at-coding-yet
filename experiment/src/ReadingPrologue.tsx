import { useEffect, useId, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react'
import type { VoiceId } from './Press'
import type { WordId } from './notes'

type ReadingPrologueProps = {
  voice: VoiceId
  word: WordId
  setToday: string
  onWord?: (word: WordId) => void
  onLeverHint?: () => void
}

const VOICE_TONE: Record<VoiceId, string> = {
  quiet: 'var(--blue)',
  human: 'var(--coral)',
  bold: 'var(--acid)',
}

const VOICE_FACE: Record<VoiceId, string> = {
  quiet: 'serif · italic · close set',
  human: 'serif · italic · a little warm',
  bold: 'sans · heavy · no apology',
}

const VOICE_LETTER: Record<VoiceId, string> = { quiet: 'A', human: 'B', bold: 'C' }

const READINGS: { id: 'eye' | 'ear'; glyph: string; mark: string; markKind: 'caret' | 'query'; word?: WordId; line: string; echo: string }[] = [
  { id: 'eye', glyph: '∧', mark: 'i.', markKind: 'caret', word: 'good', line: 'read it once with the eye', echo: 'the title holds a verb, a verb, a verb' },
  { id: 'ear', glyph: '⌇', mark: 'ii.', markKind: 'query', word: 'yet', line: 'then again with the ear', echo: 'the question mark is doing real work' },
]

const WORD_GLYPH: Record<WordId, string> = { m3: 'm³', good: 'good at', yet: 'yet?' }

export function ReadingPrologue({ voice, word, setToday, onWord, onLeverHint }: ReadingPrologueProps) {
  const baseId = useId().replace(/:/g, '')
  const ruleId = `reading-prologue-rule-${baseId}`
  const grainId = `reading-prologue-grain-${baseId}`
  const threadId = `reading-prologue-thread-${baseId}`
  const rootRef = useRef<HTMLElement>(null)
  const [revealed, setRevealed] = useState(false)
  const [hoveredReading, setHoveredReading] = useState<'eye' | 'ear' | null>(null)
  const tone = VOICE_TONE[voice]
  const activeReading = READINGS.find(reading => reading.word === word) ?? READINGS[0]

  const style = {
    '--reading-prologue-tone': tone,
    '--reading-prologue-rule': `url(#${ruleId})`,
    '--reading-prologue-grain': `url(#${grainId})`,
    '--reading-prologue-thread': `url(#${threadId})`,
  } as CSSProperties

  useEffect(() => {
    const node = rootRef.current
    if (!node) return
    if (!('IntersectionObserver' in window)) {
      setRevealed(true)
      return
    }
    const observer = new IntersectionObserver(
      entries => {
        const visible = entries.some(entry => entry.isIntersecting)
        if (visible) {
          setRevealed(true)
          observer.disconnect()
        }
      },
      { threshold: 0.22, rootMargin: '0px 0px -6% 0px' },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  const selectReading = (id: 'eye' | 'ear') => {
    const target = READINGS.find(reading => reading.id === id)
    if (target?.word && onWord) onWord(target.word)
  }

  const onReadingKey = (event: KeyboardEvent<HTMLButtonElement>, id: 'eye' | 'ear') => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
      event.preventDefault()
      selectReading('ear')
    }
    if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
      event.preventDefault()
      selectReading('eye')
    }
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      selectReading(id)
    }
  }

  return (
    <aside
      ref={rootRef}
      className={`reading-prologue reading-prologue--${voice} ${revealed ? 'is-revealed' : ''} reading-prologue--word-${word}`}
      style={style}
      aria-label="The reading prologue, between the title and the press lever"
    >
      <svg className="reading-prologue__defs" viewBox="0 0 800 600" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id={ruleId} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
            <stop offset="6%" stopColor="currentColor" stopOpacity=".55" />
            <stop offset="50%" stopColor="currentColor" stopOpacity=".85" />
            <stop offset="94%" stopColor="currentColor" stopOpacity=".55" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
          <filter id={grainId} x="-2%" y="-50%" width="104%" height="200%">
            <feTurbulence type="fractalNoise" baseFrequency="2.4" numOctaves="2" seed="17" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .42 0" />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
          <linearGradient id={threadId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
            <stop offset="42%" stopColor="currentColor" stopOpacity=".35" />
            <stop offset="100%" stopColor="currentColor" stopOpacity=".75" />
          </linearGradient>
        </defs>
      </svg>

      <span className="reading-prologue__crop reading-prologue__crop--tl" aria-hidden="true" />
      <span className="reading-prologue__crop reading-prologue__crop--tr" aria-hidden="true" />
      <span className="reading-prologue__crop reading-prologue__crop--bl" aria-hidden="true" />
      <span className="reading-prologue__crop reading-prologue__crop--br" aria-hidden="true" />

      <header className="reading-prologue__head" aria-hidden="true">
        <span className="reading-prologue__head-rule" />
        <span className="reading-prologue__head-tag">
          <span className="reading-prologue__head-glyph">§</span>
          <span className="reading-prologue__head-text">the reading prologue</span>
          <span className="reading-prologue__head-folio">folio i·</span>
          <span className="reading-prologue__head-glyph reading-prologue__head-glyph--alt">§</span>
        </span>
        <span className="reading-prologue__head-rule" />
      </header>

      <div className="reading-prologue__plate">
        <p className="reading-prologue__lede">
          <span className="reading-prologue__lede-mark" aria-hidden="true">¶</span>
          Before the lever is pulled, the page asks for <em>two reads</em>. The first takes the line at face value. The second listens for the word the question mark is leaning on.
        </p>

        <span className="reading-prologue__rule" aria-hidden="true">
          <svg viewBox="0 0 800 8" preserveAspectRatio="none">
            <g filter={`url(#${grainId})`}>
              <path
                className="reading-prologue__rule-stroke"
                d="M2 4c30-3 60 3 90 0s60-3 90 0 60 3 90 0 60-3 90 0 60 3 90 0 60-3 90 0 60 3 90 0 60-3 28 0"
                fill="none"
                stroke={`url(#${ruleId})`}
                strokeWidth=".9"
                strokeLinecap="round"
                pathLength="100"
              />
            </g>
            <circle className="reading-prologue__rule-bead" cx="2" cy="4" r="1.2" fill="currentColor" />
            <circle className="reading-prologue__rule-bead reading-prologue__rule-bead--end" cx="798" cy="4" r="1.2" fill="currentColor" />
          </svg>
        </span>

        <ol className="reading-prologue__readings" aria-label="Two readings, before the lever">
          {READINGS.map((reading, index) => {
            const isHover = hoveredReading === reading.id
            const isActive = word === reading.word
            return (
              <li
                key={reading.id}
                className={`reading-prologue__reading reading-prologue__reading--${reading.id} ${isHover ? 'is-hover' : ''} ${isActive ? 'is-active' : ''}`}
              >
                <span className="reading-prologue__reading-rule" aria-hidden="true" />
                <span className="reading-prologue__reading-mark" aria-hidden="true">
                  <svg viewBox="0 0 20 20">
                    <circle cx="10" cy="10" r="9" fill="none" stroke="currentColor" strokeWidth=".45" />
                    <text x="10" y="13.5" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="8" letterSpacing=".5" fill="currentColor">{reading.mark}</text>
                  </svg>
                </span>
                <button
                  type="button"
                  className={`reading-prologue__reading-button ${isHover ? 'is-hover' : ''} ${isActive ? 'is-active' : ''}`}
                  onClick={() => selectReading(reading.id)}
                  onMouseEnter={() => setHoveredReading(reading.id)}
                  onMouseLeave={() => setHoveredReading(prev => (prev === reading.id ? null : prev))}
                  onFocus={() => setHoveredReading(reading.id)}
                  onBlur={() => setHoveredReading(prev => (prev === reading.id ? null : prev))}
                  onKeyDown={event => onReadingKey(event, reading.id)}
                  aria-pressed={isActive}
                  aria-label={`${reading.line} · mark the word ${reading.word ? WORD_GLYPH[reading.word] : ''}`}
                >
                  <span className="reading-prologue__reading-index" aria-hidden="true">{reading.markKind === 'caret' ? '∧' : '⌇'}</span>
                  <span className="reading-prologue__reading-line">
                    <em className="reading-prologue__reading-em">{reading.line}</em>
                  </span>
                  <span className="reading-prologue__reading-echo" aria-hidden="true">
                    <span className="reading-prologue__reading-echo-rule" />
                    <span className="reading-prologue__reading-echo-text">{reading.echo}</span>
                  </span>
                  {reading.word && (
                    <span className="reading-prologue__reading-word" aria-hidden="true">
                      <span className="reading-prologue__reading-word-key">mark</span>
                      <span className={`reading-prologue__reading-word-tag reading-prologue__reading-word-tag--${reading.word}`}>{WORD_GLYPH[reading.word]}</span>
                    </span>
                  )}
                </button>
                {index < READINGS.length - 1 && (
                  <span className="reading-prologue__reading-tick" aria-hidden="true">
                    <svg viewBox="0 0 16 16">
                      <path d="M3 4l5 5 5-5" fill="none" stroke="currentColor" strokeWidth=".8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                )}
              </li>
            )
          })}
        </ol>

        <span className="reading-prologue__sign" aria-hidden="true">
          <svg viewBox="0 0 160 14" preserveAspectRatio="none">
            <path
              className="reading-prologue__sign-stroke"
              d="M2 9c14-7 28 4 42-1s28-7 42-1 28 4 42-2 28-7 14-1"
              fill="none"
              stroke="currentColor"
              strokeWidth=".85"
              strokeLinecap="round"
              pathLength="100"
            />
            <circle className="reading-prologue__sign-bead" cx="156" cy="6" r="1.4" fill="currentColor" />
          </svg>
          <span className="reading-prologue__sign-tag">
            <span className="reading-prologue__sign-tag-dot" />
            set in <em>{activeReading.line}</em>
          </span>
        </span>
      </div>

      <span className="reading-prologue__thread" aria-hidden="true">
        <svg viewBox="0 0 60 80" preserveAspectRatio="none">
          <path
            className="reading-prologue__thread-stroke"
            d="M30 2 C 30 24, 14 38, 30 56 S 30 76, 30 78"
            fill="none"
            stroke={`url(#${threadId})`}
            strokeWidth="1"
            strokeLinecap="round"
          />
          <circle className="reading-prologue__thread-bead" cx="30" cy="78" r="2" fill="currentColor" />
        </svg>
        <span className="reading-prologue__thread-tag" aria-hidden="true">
          <span className="reading-prologue__thread-tag-rule" />
          <span className="reading-prologue__thread-tag-text">then · pull</span>
          <span className="reading-prologue__thread-tag-mark" aria-hidden="true">↓</span>
        </span>
      </span>

      <footer className="reading-prologue__foot" aria-hidden="true">
        <span className="reading-prologue__foot-cell reading-prologue__foot-cell--voice">
          <span className="reading-prologue__foot-key">now setting in</span>
          <span className="reading-prologue__foot-value">
            <span className="reading-prologue__foot-voice-letter">{VOICE_LETTER[voice]}</span>
            <em>{voice === 'quiet' ? 'quiet cut' : voice === 'human' ? 'human hand' : 'bold signal'}</em>
          </span>
          <span className="reading-prologue__foot-face">{VOICE_FACE[voice]}</span>
        </span>
        <span className="reading-prologue__foot-cell reading-prologue__foot-cell--date">
          <span className="reading-prologue__foot-key">set today</span>
          <em className="reading-prologue__foot-value">{setToday}</em>
        </span>
        {onLeverHint && (
          <button
            type="button"
            className="reading-prologue__foot-cell reading-prologue__foot-cell--lever"
            onClick={onLeverHint}
            aria-label="Skip to the press lever"
          >
            <span className="reading-prologue__foot-key">to the lever</span>
            <span className="reading-prologue__foot-value">
              <em>folio viii</em>
              <svg viewBox="0 0 18 18" aria-hidden="true">
                <path d="M3 9h11M9 4l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <span className="reading-prologue__foot-face">press · once · open</span>
          </button>
        )}
      </footer>
    </aside>
  )
}