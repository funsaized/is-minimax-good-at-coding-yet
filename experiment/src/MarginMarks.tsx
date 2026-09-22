import {
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
} from 'react'
import type { VoiceId } from './App'
import type { WordId } from './notes'

type MarginMarksProps = {
  active: WordId
  hover: WordId | null
  voice: VoiceId
  pullSignal: number
  onSelect: (id: WordId) => void
  onHover: (id: WordId | null) => void
}

type MarkEntry = {
  id: WordId
  index: string
  mark: 'stet' | 'caret' | 'query'
  markLabel: string
  glyph: string
  word: string
  gloss: string
  ink: 'blue' | 'coral' | 'acid'
  bead: string
}

const MARKS: MarkEntry[] = [
  {
    id: 'm3',
    index: '01',
    mark: 'stet',
    markLabel: 'let it stand',
    glyph: 'stet',
    word: 'm³',
    gloss: 'keep the fingerprint — the maker is a habit, not a logo.',
    ink: 'blue',
    bead: 'a thin ink ring around a single point',
  },
  {
    id: 'good',
    index: '02',
    mark: 'caret',
    markLabel: 'make room',
    glyph: 'caret',
    word: 'good at',
    gloss: 'a clear verb — leave a small clear space around it.',
    ink: 'coral',
    bead: 'a caret tucked under the line',
  },
  {
    id: 'yet',
    index: '03',
    mark: 'query',
    markLabel: 'protect the pause',
    glyph: 'query',
    word: 'yet?',
    gloss: 'the question mark is doing real work — let it.',
    ink: 'acid',
    bead: 'a circled question mark in the margin',
  },
]

const VOICE_INK: Record<VoiceId, MarkEntry['ink']> = {
  quiet: 'blue',
  human: 'coral',
  bold: 'acid',
}

const PROSE: Record<WordId, { line: string; aside: string }> = {
  m3: {
    line: 'the maker is a habit, not a name.',
    aside: 'leave the fingerprint on the page',
  },
  good: {
    line: 'one clear verb is worth three clever ones.',
    aside: 'make room for attention',
  },
  yet: {
    line: 'the question mark is doing real work here.',
    aside: 'protect the pause',
  },
}

const STITCH_ID = 'margin-marks-stitch'

export function MarginMarks({ active, hover, voice, pullSignal, onSelect, onHover }: MarginMarksProps) {
  const baseId = useId().replace(/:/g, '')
  const stitchGradId = `${STITCH_ID}-${baseId}`
  const [reduceMotion, setReduceMotion] = useState(false)
  const [pulse, setPulse] = useState(0)
  const lastPull = useRef(pullSignal)

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
    setPulse(p => p + 1)
    const id = window.setTimeout(() => setPulse(p => p), 700)
    return () => window.clearTimeout(id)
  }, [pullSignal, reduceMotion])

  const display = hover ?? active
  const voiceInk = VOICE_INK[voice]
  const style = { '--mm-voice': `var(--${voice})` } as CSSProperties

  return (
    <aside
      className={`margin-marks ${pulse > 0 ? 'is-pulse' : ''}`}
      style={style}
      aria-label="Reader's marginal marks · the three words annotated"
    >
      <svg className="margin-marks__defs" viewBox="0 0 200 800" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id={stitchGradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--mm-voice)" stopOpacity="0" />
            <stop offset="14%" stopColor="var(--mm-voice)" stopOpacity=".55" />
            <stop offset="50%" stopColor="var(--mm-voice)" stopOpacity=".7" />
            <stop offset="86%" stopColor="var(--mm-voice)" stopOpacity=".55" />
            <stop offset="100%" stopColor="var(--mm-voice)" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      <span className="margin-marks__rail" aria-hidden="true">
        <span className="margin-marks__rail-line" />
        <span className={`margin-marks__rail-thread margin-marks__rail-thread--${display}`} />
        <span className="margin-marks__rail-cap margin-marks__rail-cap--t">
          <svg viewBox="0 0 18 14">
            <path d="M2 6c3 -3 6 -3 9 0s3 2 6 -2" fill="none" stroke="currentColor" strokeWidth=".7" strokeLinecap="round" />
            <circle cx="2" cy="6" r="1" fill="currentColor" />
          </svg>
        </span>
        <span className="margin-marks__rail-cap margin-marks__rail-cap--b">
          <svg viewBox="0 0 18 14">
            <path d="M16 6c-3 -3 -6 -3 -9 0s-3 2 -6 -2" fill="none" stroke="currentColor" strokeWidth=".7" strokeLinecap="round" />
            <circle cx="16" cy="6" r="1" fill="currentColor" />
          </svg>
        </span>
      </span>

      <header className="margin-marks__head" aria-hidden="true">
        <span className="margin-marks__head-key">marginalia</span>
        <span className="margin-marks__head-rule" />
        <span className="margin-marks__head-sub">three marks · read the question with the page</span>
      </header>

      <ol className="margin-marks__list">
        {MARKS.map((entry, idx) => {
          const isActive = display === entry.id
          const isVoiceInk = voiceInk === entry.ink
          const prose = PROSE[entry.id]
          const rowStyle = {
            '--mm-row-tone': `var(--${entry.ink})`,
            '--mm-row-delay': `${idx * 90}ms`,
          } as CSSProperties
          return (
            <li
              key={entry.id}
              className={`margin-marks__row margin-marks__row--${entry.ink} ${isActive ? 'is-active' : ''} ${isVoiceInk ? 'is-voice' : ''}`}
              style={rowStyle}
            >
              <span className="margin-marks__row-stem" aria-hidden="true">
                <svg viewBox="0 0 30 30" preserveAspectRatio="none">
                  <path
                    d="M0 15 C 8 15, 14 15, 30 15"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth=".5"
                    strokeLinecap="round"
                    strokeDasharray="1 2.6"
                    opacity=".7"
                  />
                </svg>
              </span>
              <span className="margin-marks__row-bead" aria-hidden="true">
                <svg viewBox="0 0 14 14">
                  <circle cx="7" cy="7" r="6" fill="var(--night)" stroke="currentColor" strokeWidth=".6" />
                  <circle cx="7" cy="7" r="3.6" fill="none" stroke="currentColor" strokeWidth=".3" strokeDasharray="1 1.4" opacity=".7" />
                  <circle cx="7" cy="7" r="1.2" fill="currentColor" />
                </svg>
              </span>
              <button
                type="button"
                className="margin-marks__row-card"
                onClick={() => onSelect(entry.id)}
                onMouseEnter={() => onHover(entry.id)}
                onMouseLeave={() => onHover(null)}
                onFocus={() => onHover(entry.id)}
                onBlur={() => onHover(null)}
                aria-pressed={isActive}
                aria-label={`Mark ${entry.index} · ${entry.word} · ${entry.gloss}`}
              >
                <span className="margin-marks__row-head">
                  <span className="margin-marks__row-index">{entry.index}</span>
                  <span className="margin-marks__row-mark">
                    <MarkGlyph entry={entry} />
                  </span>
                  <span className="margin-marks__row-markLabel">{entry.markLabel}</span>
                </span>
                <span className="margin-marks__row-word">{entry.word}</span>
                <span className="margin-marks__row-line">{prose.line}</span>
                <span className="margin-marks__row-aside">{prose.aside}</span>
                <span className="margin-marks__row-bead-bed" aria-hidden="true">
                  {entry.bead}
                </span>
              </button>
            </li>
          )
        })}
      </ol>

      <footer className="margin-marks__foot" aria-hidden="true">
        <span className="margin-marks__foot-rule" />
        <em>read close · the marks are kept close</em>
        <span className="margin-marks__foot-rule" />
      </footer>
    </aside>
  )
}

function MarkGlyph({ entry }: { entry: MarkEntry }) {
  if (entry.glyph === 'stet') {
    return (
      <svg className="margin-marks__glyph-svg" viewBox="0 0 80 18" aria-hidden="true">
        <text x="2" y="6.5" className={`margin-marks__glyph-tag margin-marks__glyph-tag--${entry.ink}`}>
          stet
        </text>
        <path
          d="M2 14c6-3 10 3 16 0s10-3 16 0 10 3 16 0 10-3 16 0"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
          strokeDasharray="160 160"
          className="margin-marks__glyph-stroke"
        />
      </svg>
    )
  }
  if (entry.glyph === 'caret') {
    return (
      <svg className="margin-marks__glyph-svg" viewBox="0 0 60 18" aria-hidden="true">
        <text x="2" y="6.5" className={`margin-marks__glyph-tag margin-marks__glyph-tag--${entry.ink}`}>
          insert
        </text>
        <path d="M30 16l-7-9h14z" fill="currentColor" opacity=".85" className="margin-marks__glyph-fill" />
        <line x1="2" y1="16" x2="58" y2="16" stroke="currentColor" strokeWidth=".9" strokeLinecap="round" />
      </svg>
    )
  }
  return (
    <svg className="margin-marks__glyph-svg" viewBox="0 0 70 18" aria-hidden="true">
      <text x="2" y="6.5" className={`margin-marks__glyph-tag margin-marks__glyph-tag--${entry.ink}`}>
        query
      </text>
      <ellipse
        cx="56"
        cy="13"
        rx="10"
        ry="6"
        fill="none"
        stroke="currentColor"
        strokeWidth=".8"
        strokeDasharray="56 56"
        className="margin-marks__glyph-stroke"
      />
      <text
        x="56"
        y="16"
        textAnchor="middle"
        fontFamily="'Iowan Old Style', Georgia, serif"
        fontStyle="italic"
        fontSize="13"
        fill="currentColor"
        className="margin-marks__glyph-fill"
      >
        ?
      </text>
    </svg>
  )
}