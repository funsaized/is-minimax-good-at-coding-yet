import { useEffect, useId, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react'
import type { VoiceId } from './Press'
import type { WordId } from './notes'

type ExhalationPlateProps = {
  voice: VoiceId
  word: WordId
  setToday: string
  onOpenAnswer: () => void
}

const VOICE_TONE: Record<VoiceId, string> = {
  quiet: 'var(--blue)',
  human: 'var(--coral)',
  bold: 'var(--acid)',
}

const VOICE_NAME: Record<VoiceId, string> = {
  quiet: 'quiet cut',
  human: 'human hand',
  bold: 'bold signal',
}

const VOICE_FACE: Record<VoiceId, string> = {
  quiet: 'serif · italic · close set',
  human: 'serif · italic · a little warm',
  bold: 'display · no apology',
}

const VOICE_LETTER: Record<VoiceId, string> = { quiet: 'A', human: 'B', bold: 'C' }

const WORD_LABEL: Record<WordId, string> = { m3: 'm³', good: 'good at', yet: 'yet?' }
const WORD_MARK: Record<WordId, string> = { m3: 'stet', good: 'caret', yet: 'query' }
const WORD_GLYPH: Record<WordId, string> = { m3: '⌇', good: '∧', yet: '?' }

const RESTATE: Record<VoiceId, { text: string; family: string; weight: number; style: 'italic' | 'normal'; track: string }> = {
  quiet: {
    text: 'is M3 good at frontend yet?',
    family: "'Iowan Old Style', 'Palatino Linotype', Georgia, serif",
    weight: 400,
    style: 'italic',
    track: '-.018em',
  },
  human: {
    text: 'is M3 good at frontend yet?',
    family: "'Iowan Old Style', 'Palatino Linotype', Georgia, serif",
    weight: 500,
    style: 'italic',
    track: '-.014em',
  },
  bold: {
    text: 'IS M3 GOOD AT FRONTEND YET?',
    family: 'Inter, ui-sans-serif, system-ui, sans-serif',
    weight: 800,
    style: 'normal',
    track: '-.04em',
  },
}

const BREATHS: { id: 'read' | 'rest' | 'pull'; tone: string; line: string }[] = [
  { id: 'read', tone: 'the line', line: 'the page has been read twice' },
  { id: 'rest', tone: 'the lever', line: 'the question is held in the throat' },
  { id: 'pull', tone: 'the leaf', line: 'pull · the folded thing uncurls' },
]

const SEASON = (() => {
  const month = new Date().getMonth()
  if (month <= 1 || month === 11) return 'winter'
  if (month <= 4) return 'spring'
  if (month <= 7) return 'summer'
  return 'autumn'
})()

export function ExhalationPlate({ voice, word, setToday, onOpenAnswer }: ExhalationPlateProps) {
  const baseId = useId().replace(/:/g, '')
  const grainId = `exhalation-grain-${baseId}`
  const ruleId = `exhalation-rule-${baseId}`
  const rootRef = useRef<HTMLElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [revealed, setRevealed] = useState(false)
  const [stamping, setStamping] = useState(false)

  const tone = VOICE_TONE[voice]
  const restate = RESTATE[voice]

  const style = {
    '--exhalation-tone': tone,
    '--exhalation-rule': `url(#${ruleId})`,
    '--exhalation-grain': `url(#${grainId})`,
    '--exhalation-restate-family': restate.family,
    '--exhalation-restate-weight': String(restate.weight),
    '--exhalation-restate-style': restate.style,
    '--exhalation-restate-track': restate.track,
  } as CSSProperties

  useEffect(() => {
    const node = rootRef.current
    if (!node) {
      setRevealed(true)
      return
    }
    if (!('IntersectionObserver' in window)) {
      setRevealed(true)
      return
    }
    const observer = new IntersectionObserver(
      entries => {
        if (entries.some(entry => entry.isIntersecting)) {
          setRevealed(true)
          observer.disconnect()
        }
      },
      { threshold: 0.16, rootMargin: '0px 0px -6% 0px' },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    setStamping(true)
    const timer = window.setTimeout(() => setStamping(false), 700)
    return () => window.clearTimeout(timer)
  }, [voice, word])

  const open = () => {
    setStamping(true)
    window.setTimeout(() => setStamping(false), 700)
    onOpenAnswer()
  }

  const onKey = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      open()
    }
  }

  return (
    <aside
      ref={rootRef}
      className={`exhalation exhalation--${voice} exhalation--word-${word} ${revealed ? 'is-revealed' : ''} ${stamping ? 'is-stamping' : ''}`}
      style={style}
      aria-label={`A single hand-pressed plate · the page takes one breath before the editor's note · folio vii · set in ${VOICE_NAME[voice]} · marked at ${WORD_LABEL[word]} (${WORD_MARK[word]}) · ${setToday}.`}
    >
      <svg className="exhalation__defs" viewBox="0 0 1000 200" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id={ruleId} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
            <stop offset="14%" stopColor="currentColor" stopOpacity=".42" />
            <stop offset="50%" stopColor="currentColor" stopOpacity=".78" />
            <stop offset="86%" stopColor="currentColor" stopOpacity=".42" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
          <filter id={grainId} x="-2%" y="-50%" width="104%" height="200%">
            <feTurbulence type="fractalNoise" baseFrequency="2.4" numOctaves="2" seed="19" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .42 0" />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
        </defs>
      </svg>

      <span className="exhalation__rule exhalation__rule--top" aria-hidden="true">
        <svg viewBox="0 0 1000 6" preserveAspectRatio="none">
          <g filter={`url(#${grainId})`}>
            <path d="M2 3c40-2 80 2 120 0s80-2 120 0 80 2 120 0 80-2 120 0 80 2 120 0 80-2 120 0 80 2 156 0" fill="none" stroke={`url(#${ruleId})`} strokeWidth=".9" strokeLinecap="round" />
          </g>
          <circle cx="996" cy="3" r="1.2" fill="currentColor" />
        </svg>
      </span>

      <span className="exhalation__eyebrow" aria-hidden="true">
        <span className="exhalation__eyebrow-mark" />
        <span className="exhalation__eyebrow-key">then · before the answer</span>
        <span className="exhalation__eyebrow-folio">folio vii</span>
        <span className="exhalation__eyebrow-mark exhalation__eyebrow-mark--alt" />
      </span>

      <figure className="exhalation__quote" aria-hidden="true">
        <span className="exhalation__quote-folio">folio vii · the page, exhaled</span>
        <span
          className="exhalation__quote-text"
          style={{
            fontFamily: restate.family,
            fontWeight: restate.weight,
            fontStyle: restate.style,
            letterSpacing: restate.track,
          }}
        >
          {restate.text}
        </span>
        <span className="exhalation__quote-mark">
          <svg viewBox="0 0 56 56">
            <g filter={`url(#${grainId})`} opacity=".9">
              <circle cx="28" cy="28" r="22" fill="none" stroke="currentColor" strokeWidth=".65" />
              <circle cx="28" cy="28" r="16" fill="none" stroke="currentColor" strokeWidth=".32" strokeDasharray=".7 1.4" opacity=".55" />
              <text x="28" y="34" textAnchor="middle" fontFamily="'Iowan Old Style', Georgia, serif" fontStyle="italic" fontSize="18" letterSpacing=".04em" fill="currentColor">m³</text>
            </g>
          </svg>
        </span>
        <span className="exhalation__quote-rule" aria-hidden="true">
          <svg viewBox="0 0 600 8" preserveAspectRatio="none">
            <g filter={`url(#${grainId})`}>
              <path
                className="exhalation__quote-rule-stroke"
                d="M2 4c40-2 80 2 120 0s80-2 120 0 80 2 120 0 80-2 120 0 80 2 96 0"
                fill="none"
                stroke="currentColor"
                strokeWidth=".8"
                strokeLinecap="round"
                pathLength="100"
              />
            </g>
            <circle cx="2" cy="4" r="1.2" fill="currentColor" />
            <circle cx="598" cy="4" r="1.2" fill="currentColor" />
          </svg>
        </span>
      </figure>

      <ol className="exhalation__breaths" aria-label="Three breaths before the answer">
        {BREATHS.map(breath => (
          <li key={breath.id} className={`exhalation__breath exhalation__breath--${breath.id}`}>
            <span className="exhalation__breath-tone" aria-hidden="true">{breath.tone}</span>
            <span className="exhalation__breath-line">{breath.line}</span>
          </li>
        ))}
      </ol>

      <span className="exhalation__sign" aria-hidden="true">
        <svg viewBox="0 0 220 14" preserveAspectRatio="none">
          <g filter={`url(#${grainId})`}>
            <path
              className="exhalation__sign-stroke"
              d="M2 8c16-6 32 4 48-1s32-7 48-1 32 4 48-2 32-7 30-1"
              fill="none"
              stroke="currentColor"
              strokeWidth=".8"
              strokeLinecap="round"
              pathLength="100"
            />
          </g>
          <circle className="exhalation__sign-bead" cx="218" cy="6" r="1.3" fill="currentColor" />
          <circle cx="2" cy="9" r=".9" fill="currentColor" opacity=".6" />
        </svg>
      </span>

      <div className="exhalation__action">
        <span className="exhalation__action-eyebrow" aria-hidden="true">
          <span className="exhalation__action-eyebrow-mark" />
          <span>then · pull the leaf</span>
          <span className="exhalation__action-eyebrow-mark exhalation__action-eyebrow-mark--alt" />
        </span>
        <button
          ref={buttonRef}
          type="button"
          className="exhalation__action-button"
          onClick={open}
          onKeyDown={onKey}
          aria-label="Open the editor's note · folio viii · pull the leaf"
          aria-controls="answer"
        >
          <span className="exhalation__action-corner exhalation__action-corner--tl" aria-hidden="true" />
          <span className="exhalation__action-corner exhalation__action-corner--tr" aria-hidden="true" />
          <span className="exhalation__action-corner exhalation__action-corner--bl" aria-hidden="true" />
          <span className="exhalation__action-corner exhalation__action-corner--br" aria-hidden="true" />
          <span className="exhalation__action-folio" aria-hidden="true">folio viii · the editor's note</span>
          <span className="exhalation__action-line">
            <em>pull the leaf open</em>
          </span>
          <span className="exhalation__action-arrow" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path d="M4 12h15M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </button>
        <span className="exhalation__action-foot" aria-hidden="true">
          <span className="exhalation__action-foot-bead" />
          the leaf is folded once · the question mark is leaning
        </span>
      </div>

      <footer className="exhalation__foot" aria-hidden="true">
        <span className="exhalation__foot-cell">
          <span className="exhalation__foot-key">now setting in</span>
          <span className="exhalation__foot-value">
            <span className="exhalation__foot-letter">{VOICE_LETTER[voice]}</span>
            <em>{VOICE_NAME[voice]}</em>
          </span>
          <span className="exhalation__foot-face">{VOICE_FACE[voice]}</span>
        </span>
        <span className="exhalation__foot-rule" aria-hidden="true">
          <svg viewBox="0 0 60 6" preserveAspectRatio="none">
            <path d="M2 3c8-3 16 3 24 0s16-3 24 0 8 1 8 0" fill="none" stroke="currentColor" strokeWidth=".45" strokeLinecap="round" />
            <circle cx="58" cy="3" r=".9" fill="currentColor" />
          </svg>
        </span>
        <span className="exhalation__foot-cell exhalation__foot-cell--word">
          <span className="exhalation__foot-key">marked at</span>
          <span className="exhalation__foot-value">
            <span className="exhalation__foot-glyph">{WORD_GLYPH[word]}</span>
            <em>{WORD_LABEL[word]}</em>
          </span>
          <span className="exhalation__foot-face">{WORD_MARK[word]} · folio i</span>
        </span>
        <span className="exhalation__foot-rule" aria-hidden="true">
          <svg viewBox="0 0 60 6" preserveAspectRatio="none">
            <path d="M2 3c8-3 16 3 24 0s16-3 24 0 8 1 8 0" fill="none" stroke="currentColor" strokeWidth=".45" strokeLinecap="round" />
            <circle cx="58" cy="3" r=".9" fill="currentColor" />
          </svg>
        </span>
        <span className="exhalation__foot-cell">
          <span className="exhalation__foot-key">set today</span>
          <em className="exhalation__foot-value exhalation__foot-value--date">{setToday}</em>
          <span className="exhalation__foot-face">{SEASON} · folio vii</span>
        </span>
      </footer>

      <span className="exhalation__rule exhalation__rule--bottom" aria-hidden="true">
        <svg viewBox="0 0 1000 6" preserveAspectRatio="none">
          <g filter={`url(#${grainId})`}>
            <path d="M2 3c40-2 80 2 120 0s80-2 120 0 80 2 120 0 80-2 120 0 80 2 120 0 80-2 120 0 80 2 156 0" fill="none" stroke={`url(#${ruleId})`} strokeWidth=".55" strokeLinecap="round" opacity=".6" />
          </g>
          <circle cx="2" cy="3" r="1" fill="currentColor" opacity=".55" />
        </svg>
      </span>
    </aside>
  )
}