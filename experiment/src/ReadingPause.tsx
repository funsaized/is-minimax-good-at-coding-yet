import { useEffect, useId, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react'
import type { VoiceId } from './Press'

type ReadingPauseProps = {
  voice: VoiceId
  setToday: string
  onOpenAnswer: () => void
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

const VOICE_NAME: Record<VoiceId, string> = {
  quiet: 'quiet cut',
  human: 'human hand',
  bold: 'bold signal',
}

const VOICE_LETTER: Record<VoiceId, string> = { quiet: 'A', human: 'B', bold: 'C' }

const VOICE_RESTATE: Record<VoiceId, { display: string; family: string; weight: number; style: 'italic' | 'normal'; track: string; size: string }> = {
  quiet: { display: 'is M3 good at frontend yet?', family: "'Iowan Old Style', Georgia, serif", weight: 400, style: 'italic', track: '-.018em', size: 'clamp(28px, 3.4vw, 46px)' },
  human: { display: 'is M3 good at frontend yet?', family: "'Iowan Old Style', Georgia, serif", weight: 500, style: 'italic', track: '-.014em', size: 'clamp(28px, 3.4vw, 46px)' },
  bold: { display: 'IS M3 GOOD AT FRONTEND YET?', family: 'Inter, ui-sans-serif, system-ui, sans-serif', weight: 800, style: 'normal', track: '-.04em', size: 'clamp(26px, 3.1vw, 42px)' },
}

const BREATHS: { id: 'inhale' | 'hold' | 'exhale'; mark: string; line: string; tone: string }[] = [
  { id: 'inhale', mark: 'i.', line: 'the page has been read twice', tone: 'before the lever' },
  { id: 'hold', mark: 'ii.', line: 'the question is held in the throat', tone: 'one breath before the answer' },
  { id: 'exhale', mark: 'iii.', line: 'pull · the leaf opens', tone: 'a small folded thing uncurls' },
]

export function ReadingPause({ voice, setToday, onOpenAnswer }: ReadingPauseProps) {
  const baseId = useId().replace(/:/g, '')
  const grainId = `reading-pause-grain-${baseId}`
  const ruleId = `reading-pause-rule-${baseId}`
  const rootRef = useRef<HTMLElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [revealed, setRevealed] = useState(false)
  const [hovered, setHovered] = useState(false)
  const tone = VOICE_TONE[voice]
  const restate = VOICE_RESTATE[voice]

  const style = {
    '--reading-pause-tone': tone,
    '--reading-pause-rule': `url(#${ruleId})`,
    '--reading-pause-grain': `url(#${grainId})`,
    '--reading-pause-restate-family': restate.family,
    '--reading-pause-restate-weight': String(restate.weight),
    '--reading-pause-restate-style': restate.style,
    '--reading-pause-restate-track': restate.track,
    '--reading-pause-restate-size': restate.size,
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
        if (entries.some(entry => entry.isIntersecting)) {
          setRevealed(true)
          observer.disconnect()
        }
      },
      { threshold: 0.18, rootMargin: '0px 0px -8% 0px' },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  const onKey = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onOpenAnswer()
    }
  }

  return (
    <aside
      ref={rootRef}
      className={`reading-pause reading-pause--${voice} ${revealed ? 'is-revealed' : ''} ${hovered ? 'is-hover' : ''}`}
      style={style}
      aria-label="A pause between the readings and the answer"
    >
      <svg className="reading-pause__defs" viewBox="0 0 800 240" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id={ruleId} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
            <stop offset="14%" stopColor="currentColor" stopOpacity=".42" />
            <stop offset="50%" stopColor="currentColor" stopOpacity=".8" />
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

      <span className="reading-pause__crop reading-pause__crop--tl" aria-hidden="true" />
      <span className="reading-pause__crop reading-pause__crop--tr" aria-hidden="true" />
      <span className="reading-pause__crop reading-pause__crop--bl" aria-hidden="true" />
      <span className="reading-pause__crop reading-pause__crop--br" aria-hidden="true" />

      <header className="reading-pause__head" aria-hidden="true">
        <span className="reading-pause__head-rule" />
        <span className="reading-pause__head-tag">
          <span className="reading-pause__head-mark">§</span>
          <span className="reading-pause__head-text">a pause</span>
          <span className="reading-pause__head-folio">folio vii</span>
          <span className="reading-pause__head-mark reading-pause__head-mark--alt">§</span>
        </span>
        <span className="reading-pause__head-rule" />
      </header>

      <div className="reading-pause__plate">
        <p className="reading-pause__lede">
          <span className="reading-pause__lede-mark" aria-hidden="true">¶</span>
          Before the leaf opens, the page takes one breath. <em>Read the line once more.</em> Hear the question mark do its work. Then pull.
        </p>

        <figure className="reading-pause__restate" aria-hidden="true">
          <span className="reading-pause__restate-folio">folio vii · one breath</span>
          <span className="reading-pause__restate-text" style={{
            fontFamily: restate.family,
            fontWeight: restate.weight,
            fontStyle: restate.style,
            letterSpacing: restate.track,
            fontSize: restate.size,
          }}>
            {restate.display}
          </span>
          <span className="reading-pause__restate-mark" aria-hidden="true">
            <svg viewBox="0 0 64 64">
              <defs>
                <filter id={`reading-pause-mark-grain-${baseId}`} x="-12%" y="-12%" width="124%" height="124%">
                  <feTurbulence type="fractalNoise" baseFrequency="2.4" numOctaves="2" seed="21" stitchTiles="stitch" />
                  <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .5 0" />
                  <feComposite in2="SourceGraphic" operator="in" />
                </filter>
              </defs>
              <g filter={`url(#reading-pause-mark-grain-${baseId})`} opacity=".85">
                <circle cx="32" cy="32" r="20" fill="none" stroke="currentColor" strokeWidth=".7" />
                <circle cx="32" cy="32" r="15" fill="none" stroke="currentColor" strokeWidth=".3" strokeDasharray=".8 1.4" opacity=".55" />
                <text x="32" y="38" textAnchor="middle" fontFamily="'Iowan Old Style', Georgia, serif" fontStyle="italic" fontSize="18" letterSpacing=".04em" fill="currentColor">m³</text>
              </g>
            </svg>
          </span>
          <span className="reading-pause__restate-rule">
            <svg viewBox="0 0 800 8" preserveAspectRatio="none">
              <g filter={`url(#${grainId})`}>
                <path
                  className="reading-pause__restate-rule-stroke"
                  d="M2 4c40-2 80 2 120 0s80-2 120 0 80 2 120 0 80-2 120 0 80 2 120 0 80-2 120 0 80 2 78 0"
                  fill="none"
                  stroke={`url(#${ruleId})`}
                  strokeWidth=".9"
                  strokeLinecap="round"
                  pathLength="100"
                />
              </g>
              <circle cx="2" cy="4" r="1.2" fill="currentColor" className="reading-pause__restate-rule-bead reading-pause__restate-rule-bead--lead" />
              <circle cx="798" cy="4" r="1.2" fill="currentColor" className="reading-pause__restate-rule-bead reading-pause__restate-rule-bead--trail" />
            </svg>
          </span>
        </figure>

        <ol className="reading-pause__breaths" aria-label="Three breaths before the answer">
          {BREATHS.map((breath) => (
            <li key={breath.id} className={`reading-pause__breath reading-pause__breath--${breath.id}`}>
              <span className="reading-pause__breath-mark" aria-hidden="true">
                <svg viewBox="0 0 22 22">
                  <circle cx="11" cy="11" r="10" fill="none" stroke="currentColor" strokeWidth=".5" />
                  <text x="11" y="14.5" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="8" letterSpacing=".4" fill="currentColor">{breath.mark}</text>
                </svg>
              </span>
              <span className="reading-pause__breath-stack">
                <span className="reading-pause__breath-line">{breath.line}</span>
                <span className="reading-pause__breath-tone">{breath.tone}</span>
              </span>
            </li>
          ))}
        </ol>

        <span className="reading-pause__sign" aria-hidden="true">
          <svg viewBox="0 0 180 14" preserveAspectRatio="none">
            <path
              className="reading-pause__sign-stroke"
              d="M2 9c14-7 28 4 42-1s28-7 42-1 28 4 42-2 28-7 24-1"
              fill="none"
              stroke="currentColor"
              strokeWidth=".85"
              strokeLinecap="round"
              pathLength="100"
            />
            <circle className="reading-pause__sign-bead" cx="176" cy="6" r="1.4" fill="currentColor" />
          </svg>
        </span>
      </div>

      <div className="reading-pause__action">
        <span className="reading-pause__action-eyebrow" aria-hidden="true">
          <span className="reading-pause__action-eyebrow-mark" />
          then · pull the leaf
          <span className="reading-pause__action-eyebrow-mark reading-pause__action-eyebrow-mark--alt" />
        </span>
        <button
          ref={buttonRef}
          type="button"
          className="reading-pause__action-button"
          onClick={onOpenAnswer}
          onKeyDown={onKey}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onFocus={() => setHovered(true)}
          onBlur={() => setHovered(false)}
          aria-label="Open the answer · folio viii · the editor's note"
        >
          <span className="reading-pause__action-corner reading-pause__action-corner--tl" aria-hidden="true" />
          <span className="reading-pause__action-corner reading-pause__action-corner--tr" aria-hidden="true" />
          <span className="reading-pause__action-corner reading-pause__action-corner--bl" aria-hidden="true" />
          <span className="reading-pause__action-corner reading-pause__action-corner--br" aria-hidden="true" />
          <span className="reading-pause__action-folio" aria-hidden="true">folio viii · the editor's note</span>
          <span className="reading-pause__action-line">
            <em>pull the leaf open</em>
          </span>
          <span className="reading-pause__action-arrow" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path d="M4 12h15M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </button>
        <span className="reading-pause__action-foot" aria-hidden="true">
          <span className="reading-pause__action-foot-bead" />
          the leaf is folded once · the question mark is leaning
        </span>
      </div>

      <footer className="reading-pause__foot" aria-hidden="true">
        <span className="reading-pause__foot-cell">
          <span className="reading-pause__foot-key">now setting in</span>
          <span className="reading-pause__foot-value">
            <span className="reading-pause__foot-letter">{VOICE_LETTER[voice]}</span>
            <em>{VOICE_NAME[voice]}</em>
          </span>
          <span className="reading-pause__foot-face">{VOICE_FACE[voice]}</span>
        </span>
        <span className="reading-pause__foot-rule" aria-hidden="true">
          <svg viewBox="0 0 80 6" preserveAspectRatio="none">
            <path d="M2 3c10-3 20 3 30 0s20-3 30 0 20 3 18 0" fill="none" stroke="currentColor" strokeWidth=".5" strokeLinecap="round" />
            <circle cx="78" cy="3" r="1" fill="currentColor" />
          </svg>
        </span>
        <span className="reading-pause__foot-cell">
          <span className="reading-pause__foot-key">set today</span>
          <em className="reading-pause__foot-value reading-pause__foot-value--date">{setToday}</em>
        </span>
      </footer>
    </aside>
  )
}
