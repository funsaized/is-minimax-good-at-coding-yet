import { useEffect, useId, useMemo, useRef, useState, type CSSProperties } from 'react'
import type { VoiceId } from './Press'
import type { WordId } from './notes'
import type { ImpressionMark } from './ImpressionRibbon'

type PressLogProps = {
  voice: VoiceId
  word: WordId
  marks: ImpressionMark[]
  setToday: string
}

const VOICE_LETTER: Record<VoiceId, string> = { quiet: 'A', human: 'B', bold: 'C' }
const VOICE_NAME: Record<VoiceId, string> = { quiet: 'quiet cut', human: 'human hand', bold: 'bold signal' }
const VOICE_FACE: Record<VoiceId, string> = {
  quiet: 'serif · italic · close set',
  human: 'serif · italic · a little warm',
  bold: 'sans · heavy · no apology',
}
const VOICE_TONE: Record<VoiceId, string> = {
  quiet: 'var(--blue)',
  human: 'var(--coral)',
  bold: 'var(--acid)',
}
const WORD_GLYPH: Record<WordId, string> = { m3: '⌇', good: '∧', yet: '?' }
const WORD_LABEL: Record<WordId, string> = { m3: 'm³', good: 'good at', yet: 'yet?' }
const WORD_MARK: Record<WordId, string> = { m3: 'stet', good: 'caret', yet: 'query' }
const WORD_TONE: Record<WordId, string> = { m3: 'var(--acid)', good: 'var(--coral)', yet: 'var(--blue)' }

const COLUMN_ORDER: Array<{ key: 'pull' | 'word' | 'voice'; label: string; hint: string; eyebrow: string }> = [
  { key: 'pull', label: 'pulls', hint: 'levers pulled this session', eyebrow: 'the lever · pulled' },
  { key: 'word', label: 'marks', hint: 'words marked in the marginalia', eyebrow: 'the words · marked' },
  { key: 'voice', label: 'voices', hint: 'voices set on the press', eyebrow: 'the voice · set' },
]

const SHELF_LIMIT = 5
const TIMELINE_LIMIT = 24

function MarkRow({ mark, index }: { mark: ImpressionMark; index: number }) {
  if (mark.kind === 'pull') {
    return (
      <li className={`press-log__shelf-row press-log__shelf-row--pull press-log__shelf-row--voice-${mark.voice}`}>
        <span className="press-log__shelf-index" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
        <span className="press-log__shelf-glyph" aria-hidden="true">
          <svg viewBox="0 0 16 16">
            <path d="M2 14 L8 4 L14 14" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="8" cy="11.6" r="1.1" fill="currentColor" />
          </svg>
        </span>
        <span className="press-log__shelf-copy">
          <em className="press-log__shelf-line">pulled → <em className="press-log__shelf-letter">{VOICE_LETTER[mark.voice]}</em> · <em>{VOICE_NAME[mark.voice]}</em></em>
          <span className="press-log__shelf-from" aria-hidden="true">from <em>{VOICE_LETTER[mark.from]}</em></span>
        </span>
        <span className="press-log__shelf-tail" aria-hidden="true">
          <span className="press-log__tail-rule" />
          <span className="press-log__tail-bead" />
        </span>
      </li>
    )
  }
  if (mark.kind === 'voice') {
    return (
      <li className={`press-log__shelf-row press-log__shelf-row--voice press-log__shelf-row--voice-${mark.voice}`}>
        <span className="press-log__shelf-index" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
        <span className="press-log__shelf-glyph" aria-hidden="true">
          <svg viewBox="0 0 16 16">
            <circle cx="8" cy="8" r="5.4" fill="none" stroke="currentColor" strokeWidth=".9" />
            <circle cx="8" cy="8" r="2" fill="currentColor" />
          </svg>
        </span>
        <span className="press-log__shelf-copy">
          <em className="press-log__shelf-line">set to <em className="press-log__shelf-letter">{VOICE_LETTER[mark.voice]}</em> · <em>{VOICE_NAME[mark.voice]}</em></em>
          <span className="press-log__shelf-from" aria-hidden="true">{VOICE_FACE[mark.voice]}</span>
        </span>
        <span className="press-log__shelf-tail" aria-hidden="true">
          <span className="press-log__tail-rule" />
          <span className="press-log__tail-bead" />
        </span>
      </li>
    )
  }
  return (
    <li className={`press-log__shelf-row press-log__shelf-row--word press-log__shelf-row--word-${mark.word}`}>
      <span className="press-log__shelf-index" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
      <span className="press-log__shelf-glyph" aria-hidden="true" style={{ '--shelf-tone': WORD_TONE[mark.word] } as CSSProperties}>
        <svg viewBox="0 0 16 16">
          <circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" strokeWidth=".7" />
          <text x="8" y="11.6" textAnchor="middle" fontFamily="Georgia, serif" fontStyle="italic" fontSize="9" fill="currentColor">{WORD_GLYPH[mark.word]}</text>
        </svg>
      </span>
      <span className="press-log__shelf-copy">
        <em className="press-log__shelf-line">marked <em className="press-log__shelf-letter">{WORD_GLYPH[mark.word]}</em> · <em>{WORD_LABEL[mark.word]}</em></em>
        <span className="press-log__shelf-from" aria-hidden="true">{WORD_MARK[mark.word]}</span>
      </span>
      <span className="press-log__shelf-tail" aria-hidden="true">
        <span className="press-log__tail-rule" />
        <span className="press-log__tail-bead" />
      </span>
    </li>
  )
}

export function PressLog({ voice, word, marks, setToday }: PressLogProps) {
  const baseId = useId().replace(/:/g, '')
  const grainId = `press-log-grain-${baseId}`
  const ruleId = `press-log-rule-${baseId}`
  const rootRef = useRef<HTMLDivElement>(null)
  const [revealed, setRevealed] = useState(false)
  const [pulse, setPulse] = useState(0)

  const tone = VOICE_TONE[voice]
  const style = {
    '--press-log-tone': tone,
    '--press-log-grain': `url(#${grainId})`,
    '--press-log-rule': `url(#${ruleId})`,
    '--press-log-ink': `var(--paper)`,
  } as CSSProperties

  useEffect(() => {
    if (!('IntersectionObserver' in window)) {
      setRevealed(true)
      return
    }
    const node = rootRef.current
    if (!node) return
    const observer = new IntersectionObserver(
      entries => {
        const visible = entries.some(entry => entry.isIntersecting)
        if (visible) {
          setRevealed(true)
          observer.disconnect()
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    setPulse(value => value + 1)
  }, [marks.length])

  const columns = useMemo(() => {
    return COLUMN_ORDER.map(col => {
      const filtered = marks
        .map((mark, originalIndex) => ({ mark, originalIndex }))
        .filter(entry => entry.mark.kind === col.key)
        .slice(-SHELF_LIMIT)
        .reverse()
      return { ...col, entries: filtered }
    })
  }, [marks])

  const totalPulls = marks.reduce((acc, mark) => (mark.kind === 'pull' ? acc + 1 : acc), 0)
  const totalMarks = marks.reduce((acc, mark) => (mark.kind === 'word' ? acc + 1 : acc), 0)
  const totalVoiceSets = marks.reduce((acc, mark) => (mark.kind === 'voice' ? acc + 1 : acc), 0)
  const totalEvents = marks.length
  const last = marks[marks.length - 1]

  const timeline = marks.slice(-TIMELINE_LIMIT)
  const timelineLast = timeline[timeline.length - 1]
  const timelineFirst = timeline[0]

  return (
    <div
      ref={rootRef}
      className={`press-log press-log--${voice} ${revealed ? 'is-revealed' : ''} ${marks.length === 0 ? 'is-idle' : ''}`}
      style={style}
      role="group"
      aria-label="Press session log"
    >
      <svg className="press-log__defs" viewBox="0 0 800 600" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id={ruleId} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
            <stop offset="14%" stopColor="currentColor" stopOpacity=".55" />
            <stop offset="50%" stopColor="currentColor" stopOpacity=".85" />
            <stop offset="86%" stopColor="currentColor" stopOpacity=".55" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
          <filter id={grainId} x="-2%" y="-2%" width="104%" height="104%">
            <feTurbulence type="fractalNoise" baseFrequency="2.4" numOctaves="2" seed="29" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .38 0" />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
        </defs>
      </svg>

      <span className="press-log__crop press-log__crop--tl" aria-hidden="true" />
      <span className="press-log__crop press-log__crop--tr" aria-hidden="true" />
      <span className="press-log__crop press-log__crop--bl" aria-hidden="true" />
      <span className="press-log__crop press-log__crop--br" aria-hidden="true" />

      <header className="press-log__head">
        <span className="press-log__head-rule" aria-hidden="true" />
        <span className="press-log__head-tag">
          <span className="press-log__head-tick" />
          <span className="press-log__head-title">the press log</span>
          <span className="press-log__head-folio">folio ii · the session</span>
          <span className="press-log__head-tick press-log__head-tick--alt" />
        </span>
        <span className="press-log__head-rule press-log__head-rule--end" aria-hidden="true" />
      </header>

      <div className="press-log__topline" aria-hidden="true">
        <span className="press-log__topline-cell press-log__topline-cell--voice">
          <span className="press-log__topline-key">now in</span>
          <span className={`press-log__topline-voice press-log__topline-voice--${voice}`}>
            <span className="press-log__topline-voice-letter">{VOICE_LETTER[voice]}</span>
            <em>{VOICE_NAME[voice]}</em>
          </span>
          <span className="press-log__topline-face">{VOICE_FACE[voice]}</span>
        </span>
        <span className="press-log__topline-rule" aria-hidden="true" />
        <span className="press-log__topline-cell press-log__topline-cell--mark">
          <span className="press-log__topline-key">the active mark is</span>
          <span className="press-log__topline-mark" style={{ '--mark-tone': WORD_TONE[word] } as CSSProperties}>
            <span className="press-log__topline-mark-glyph" aria-hidden="true">{WORD_GLYPH[word]}</span>
            <em>{WORD_LABEL[word]}</em>
          </span>
          <span className="press-log__topline-face">{WORD_MARK[word]}</span>
        </span>
        <span className="press-log__topline-rule" aria-hidden="true" />
        <span className="press-log__topline-cell press-log__topline-cell--date">
          <span className="press-log__topline-key">set today</span>
          <em className="press-log__topline-date">{setToday}</em>
          <span className="press-log__topline-face">this impression</span>
        </span>
      </div>

      <div className="press-log__timeline" aria-hidden="true">
        <span className="press-log__timeline-rule" aria-hidden="true">
          <svg viewBox="0 0 1200 8" preserveAspectRatio="none">
            <g filter={`url(#${grainId})`} opacity=".85">
              <path d="M2 4c40-3 80 3 120 0s80-3 120 0 80 3 120 0 80-3 120 0 80 3 120 0 80-3 120 0 80 3 120 0 80-3 120 0 78 3 38 0" fill="none" stroke={`url(#${ruleId})`} strokeWidth=".85" strokeLinecap="round" pathLength="100" className="press-log__timeline-rule-stroke" />
            </g>
            <circle cx="2" cy="4" r="1.3" fill="currentColor" />
            <circle cx="1198" cy="4" r="1.3" fill="currentColor" />
          </svg>
        </span>
        <ol className="press-log__timeline-marks">
          {timeline.map((mark, index) => {
            const ratio = timeline.length <= 1 ? 1 : index / (timeline.length - 1)
            const isLatest = index === timeline.length - 1
            const kindClass = mark.kind === 'pull' ? 'pull' : mark.kind === 'voice' ? `voice-${mark.voice}` : `word-${mark.word}`
            return (
              <li
                key={`${mark.kind}-${index}-${ratio.toFixed(3)}`}
                className={`press-log__timeline-mark press-log__timeline-mark--${kindClass} ${isLatest ? 'is-latest' : ''}`}
                style={{ left: `${ratio * 100}%` }}
              >
                <span className="press-log__timeline-mark-bead" />
                {isLatest && <span key={`tl-splash-${pulse}`} className="press-log__timeline-mark-splash" />}
              </li>
            )
          })}
        </ol>
        <span
          key={`tl-now-${pulse}`}
          className={`press-log__timeline-now ${timelineLast ? `press-log__timeline-now--${timelineLast.kind === 'voice' ? `voice-${timelineLast.voice}` : timelineLast.kind === 'word' ? `word-${timelineLast.word}` : 'pull'}` : 'press-log__timeline-now--idle'}`}
          style={{ left: `${timeline.length === 0 ? 0 : 100}%` }}
          aria-hidden="true"
        >
          <span className="press-log__timeline-now-bead" />
          <span className="press-log__timeline-now-tail" />
        </span>
        <span className="press-log__timeline-meta" aria-hidden="true">
          <span className="press-log__timeline-meta-cell press-log__timeline-meta-cell--lead">
            <span className="press-log__timeline-meta-dot" />
            <span className="press-log__timeline-meta-key">first</span>
            <span className="press-log__timeline-meta-tag">{timelineFirst ? `№ ${timelineFirst.kind === 'voice' ? 'voice' : timelineFirst.kind === 'word' ? 'mark' : 'pull'}` : 'awaiting'}</span>
          </span>
          <span className="press-log__timeline-meta-rule" />
          <span className="press-log__timeline-meta-cell press-log__timeline-meta-cell--trail">
            <span className="press-log__timeline-meta-dot press-log__timeline-meta-dot--trail" />
            <span className="press-log__timeline-meta-key">now</span>
            <span className="press-log__timeline-meta-tag">{timelineLast ? `№ ${timelineLast.kind === 'voice' ? 'voice' : timelineLast.kind === 'word' ? 'mark' : 'pull'}` : '—'}</span>
          </span>
        </span>
      </div>

      <div className="press-log__shelves">
        {columns.map(col => (
          <section key={col.key} className={`press-log__shelf press-log__shelf--${col.key}`} aria-label={col.hint}>
            <header className="press-log__shelf-head">
              <span className="press-log__shelf-rule" aria-hidden="true" />
              <span className="press-log__shelf-tag">
                <span className="press-log__shelf-eyebrow">{col.eyebrow}</span>
                <em className="press-log__shelf-label">{col.label}</em>
                <span className="press-log__shelf-count">{col.entries.length}</span>
              </span>
              <span className="press-log__shelf-rule press-log__shelf-rule--end" aria-hidden="true" />
            </header>
            {col.entries.length === 0 ? (
              <p className="press-log__shelf-empty">
                <span className="press-log__empty-mark" aria-hidden="true">·</span>
                no {col.label} this session · awaiting the first
              </p>
            ) : (
              <ol className="press-log__shelf-list">
                {col.entries.map((entry, index) => (
                  <MarkRow key={`${entry.mark.kind}-${entry.originalIndex}-${index}`} mark={entry.mark} index={col.entries.length - 1 - index} />
                ))}
              </ol>
            )}
          </section>
        ))}
      </div>

      <footer className="press-log__foot">
        <span className="press-log__foot-rule" aria-hidden="true" />
        <span className="press-log__foot-row">
          <span className="press-log__foot-cell press-log__foot-cell--now">
            <span className="press-log__foot-cell-key">now</span>
            <span className="press-log__foot-cell-value">
              {last
                ? last.kind === 'voice'
                  ? <>set to <em>{VOICE_LETTER[last.voice]}</em> · {VOICE_NAME[last.voice]}</>
                  : last.kind === 'pull'
                  ? <>pulled → <em>{VOICE_LETTER[last.voice]}</em> · from {VOICE_LETTER[last.from]}</>
                  : <>marked <em>{WORD_LABEL[last.word]}</em> · {WORD_MARK[last.word]}</>
                : 'awaiting the first press'}
            </span>
          </span>
          <span className="press-log__foot-rule-cell" aria-hidden="true" />
          <span className="press-log__foot-cell press-log__foot-cell--totals">
            <span className="press-log__foot-cell-key">this session</span>
            <span className="press-log__foot-cell-value">
              <em className="press-log__foot-num">{String(totalPulls).padStart(2, '0')}</em>
              <span className="press-log__foot-suffix">{totalPulls === 1 ? 'pull' : 'pulls'}</span>
              <span className="press-log__foot-dot" aria-hidden="true">·</span>
              <em className="press-log__foot-num">{String(totalMarks).padStart(2, '0')}</em>
              <span className="press-log__foot-suffix">{totalMarks === 1 ? 'mark' : 'marks'}</span>
              <span className="press-log__foot-dot" aria-hidden="true">·</span>
              <em className="press-log__foot-num">{String(totalVoiceSets).padStart(2, '0')}</em>
              <span className="press-log__foot-suffix">{totalVoiceSets === 1 ? 'voice set' : 'voice sets'}</span>
            </span>
          </span>
          <span className="press-log__foot-rule-cell" aria-hidden="true" />
          <span className="press-log__foot-cell press-log__foot-cell--events">
            <span className="press-log__foot-cell-key">events</span>
            <span className="press-log__foot-cell-value">
              <em className="press-log__foot-num press-log__foot-num--soft">{String(totalEvents).padStart(2, '0')}</em>
              <span className="press-log__foot-suffix">on the session</span>
            </span>
          </span>
        </span>
        <span className="press-log__foot-rule press-log__foot-rule--trail" aria-hidden="true" />
      </footer>

      <span className="press-log__pencil" aria-hidden="true">
        <svg viewBox="0 0 220 18" preserveAspectRatio="none">
          <path
            d="M2 12c12-8 24 4 36-1s24-6 36-2 24 6 36-2 24-6 36-1 24 4 38-2"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            pathLength="100"
            className="press-log__pencil-stroke"
          />
          <circle className="press-log__pencil-bead" cx="216" cy="9" r="1.6" fill="currentColor" />
        </svg>
      </span>

      <span className="sr-only" aria-live="polite">
        {marks.length === 0
          ? 'Press log idle. Awaiting the first action.'
          : `Press log: ${totalPulls} ${totalPulls === 1 ? 'pull' : 'pulls'}, ${totalMarks} ${totalMarks === 1 ? 'mark' : 'marks'}, ${totalVoiceSets} ${totalVoiceSets === 1 ? 'voice set' : 'voice sets'}, ${totalEvents} events on the session.`}
      </span>
    </div>
  )
}
