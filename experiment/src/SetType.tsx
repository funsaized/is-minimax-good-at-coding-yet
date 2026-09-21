import { useEffect, useId, useRef, useState, type CSSProperties } from 'react'
import type { VoiceId } from './Press'

type SetTypeProps = {
  voice: VoiceId
  setToday: string
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

type Piece = {
  id: string
  text: Record<VoiceId, string>
  width: number
}

const PIECES: Piece[] = [
  { id: 'is', text: { quiet: 'is', human: 'is', bold: 'is' }, width: 0.18 },
  { id: 'm3', text: { quiet: 'Minimax M3', human: 'M3', bold: 'M3' }, width: 0.24 },
  { id: 'good', text: { quiet: 'good at', human: 'good at', bold: 'good at' }, width: 0.22 },
  { id: 'frontend', text: { quiet: 'frontend', human: 'frontend', bold: 'frontend' }, width: 0.22 },
  { id: 'yet', text: { quiet: 'yet?', human: 'yet?', bold: 'yet?' }, width: 0.14 },
]

const SET_LINES: Record<VoiceId, { face: string; tone: string }> = {
  quiet: { face: 'serif · italic · close set', tone: 'set in close-set italic, letter by letter' },
  human: { face: 'serif · italic · a hand', tone: 'set by a hand that learned its warmth' },
  bold: { face: 'sans · heavy · no apology', tone: 'set without apology, then read it once' },
}

const STEP_MS = 720
const LOCK_MS = PIECES.length * STEP_MS + 900

const PIECE_FACE: Record<VoiceId, { family: string; weight: number; style: 'italic' | 'normal'; uppercased: boolean; size: string; tracking: string; lineHeight: number }> = {
  quiet: {
    family: "'Iowan Old Style', 'Palatino Linotype', Georgia, serif",
    weight: 500,
    style: 'italic',
    uppercased: false,
    size: 'clamp(15px, 1.6vw, 22px)',
    tracking: '-.018em',
    lineHeight: 1.2,
  },
  human: {
    family: "'Iowan Old Style', 'Palatino Linotype', Georgia, serif",
    weight: 500,
    style: 'italic',
    uppercased: false,
    size: 'clamp(15px, 1.6vw, 22px)',
    tracking: '-.014em',
    lineHeight: 1.2,
  },
  bold: {
    family: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
    weight: 900,
    style: 'normal',
    uppercased: true,
    size: 'clamp(14px, 1.5vw, 21px)',
    tracking: '-.04em',
    lineHeight: 1.2,
  },
}

export function SetType({ voice, setToday }: SetTypeProps) {
  const baseId = useId().replace(/:/g, '')
  const grainId = `set-type-grain-${baseId}`
  const ruleGrainId = `set-type-rule-grain-${baseId}`
  const setTypeBedGrainId = `set-type-bed-grain-${baseId}`
  const rootRef = useRef<HTMLElement>(null)
  const [revealed, setRevealed] = useState(false)
  const [composing, setComposing] = useState(false)
  const [locked, setLocked] = useState(false)
  const [restored, setRestored] = useState(false)
  const timersRef = useRef<number[]>([])

  const style = {
    '--set-type-tone': VOICE_TONE[voice],
    '--set-type-tone-quiet': 'var(--blue)',
    '--set-type-tone-human': 'var(--coral)',
    '--set-type-tone-bold': 'var(--acid)',
  } as CSSProperties

  useEffect(() => {
    const node = rootRef.current
    if (!node || typeof window === 'undefined' || !('IntersectionObserver' in window)) {
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

  const clearTimers = () => {
    timersRef.current.forEach(id => window.clearTimeout(id))
    timersRef.current = []
  }

  useEffect(() => {
    clearTimers()
    if (!revealed) return
    setComposing(false)
    setLocked(false)
    setRestored(true)
    const beginId = window.setTimeout(() => {
      setRestored(false)
      setComposing(true)
    }, 220)
    const lockId = window.setTimeout(() => {
      setComposing(true)
      setLocked(true)
    }, LOCK_MS)
    timersRef.current.push(beginId, lockId)
    return () => clearTimers()
  }, [revealed])

  useEffect(() => () => clearTimers(), [])

  const face = PIECE_FACE[voice]

  return (
    <section
      ref={rootRef}
      className={`set-type set-type--${voice} ${revealed ? 'is-revealed' : ''} ${composing ? 'is-composing' : ''} ${locked ? 'is-locked' : ''} ${restored ? 'is-restored' : ''}`}
      style={style}
      aria-label={`The composing stand · the headline is hand-set one word at a time in the ${VOICE_NAME[voice]} voice, set on ${setToday}.`}
    >
      <svg className="set-type__defs" viewBox="0 0 1200 320" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <filter id={grainId} x="-2%" y="-2%" width="104%" height="104%">
            <feTurbulence type="fractalNoise" baseFrequency="0.78" numOctaves="2" seed="83" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 .14  0 0 0 0 .12  0 0 0 0 .19  0 0 0 .035 0" />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
          <filter id={ruleGrainId} x="-2%" y="-50%" width="104%" height="200%">
            <feTurbulence type="fractalNoise" baseFrequency="2.4" numOctaves="2" seed="61" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .55 0" />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
          <filter id={setTypeBedGrainId} x="-2%" y="-2%" width="104%" height="104%">
            <feTurbulence type="fractalNoise" baseFrequency="2.2" numOctaves="2" seed="71" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .6 0" />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
          <linearGradient id={`set-type-bed-grad-${baseId}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(255, 255, 255, .14)" />
            <stop offset="42%" stopColor="rgba(255, 255, 255, .05)" />
            <stop offset="100%" stopColor="rgba(0, 0, 0, .25)" />
          </linearGradient>
          <linearGradient id={`set-type-bed-edge-${baseId}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(255, 255, 255, 0)" />
            <stop offset="6%" stopColor="rgba(255, 255, 255, .15)" />
            <stop offset="94%" stopColor="rgba(0, 0, 0, .25)" />
            <stop offset="100%" stopColor="rgba(0, 0, 0, 0)" />
          </linearGradient>
        </defs>
      </svg>

      <header className="set-type__head" aria-hidden="false">
        <span className="set-type__head-key">
          <span className="set-type__head-key-mark" aria-hidden="true" />
          <em>the composing stand</em>
        </span>
        <span className="set-type__head-rule" aria-hidden="true" />
        <em className="set-type__head-note">five typepieces, set one at a time</em>
      </header>

      <div className="set-type__stage" aria-hidden="false">
        <span className="set-type__above-rule" aria-hidden="true">
          <svg viewBox="0 0 200 12" preserveAspectRatio="none">
            <g filter={`url(#${ruleGrainId})`}>
              <path
                className="set-type__above-rule-stroke"
                d="M2 6c12-2 24 2 36 0s24-2 36 0 24-2 36 0 24 2 36 0 24-2 36 0 12 2 16 0"
                fill="none"
                stroke="currentColor"
                strokeWidth=".55"
                strokeLinecap="round"
                pathLength="100"
              />
            </g>
            <circle cx="2" cy="6" r=".9" fill="currentColor" opacity=".7" />
            <circle cx="198" cy="6" r=".9" fill="currentColor" opacity=".7" />
          </svg>
        </span>

        <span className="set-type__typecase" aria-hidden="true">
          {PIECES.map((piece, idx) => (
            <span
              key={`set-type-case-${piece.id}`}
              className={`set-type__case-piece set-type__case-piece--${piece.id}`}
              style={{
                '--case-index': String(idx),
                '--case-fraction': String(idx / (PIECES.length - 1)),
              } as CSSProperties}
              aria-hidden="true"
            >
              <svg viewBox="0 0 80 40" preserveAspectRatio="none">
                <g filter={`url(#${setTypeBedGrainId})`} opacity=".95">
                  <rect x="2" y="6" width="76" height="28" fill={`url(#set-type-bed-edge-${baseId})`} />
                  <rect x="2" y="6" width="76" height="28" fill="none" stroke="currentColor" strokeWidth=".6" />
                  <rect x="6" y="10" width="68" height="20" fill="none" stroke="currentColor" strokeWidth=".35" strokeDasharray="1.5 1.2" opacity=".5" />
                </g>
                <text
                  x="40"
                  y="25"
                  textAnchor="middle"
                  fontFamily={face.family}
                  fontWeight={face.weight}
                  fontStyle={face.style}
                  fontSize="13"
                  letterSpacing={face.tracking}
                  fill="currentColor"
                >{face.uppercased ? piece.text[voice].toUpperCase() : piece.text[voice]}</text>
              </svg>
            </span>
          ))}
        </span>

        <span className="set-type__case-line" aria-hidden="true">
          <svg viewBox="0 0 1200 12" preserveAspectRatio="none">
            <g filter={`url(#${ruleGrainId})`} opacity=".6">
              <path d="M2 6c20-2 40 2 60 0s40-2 60 0 40 2 60 0 40-2 60 0 40 2 60 0 40-2 60 0 40 2 60 0 200-2 220 0" fill="none" stroke="currentColor" strokeWidth=".5" strokeLinecap="round" />
            </g>
          </svg>
        </span>

        <div
          className="set-type__bed"
          role="presentation"
        >
          <span className="set-type__bed-frame" aria-hidden="true">
            <svg viewBox="0 0 1200 80" preserveAspectRatio="none">
              <rect x="0" y="0" width="1200" height="80" fill={`url(#set-type-bed-edge-${baseId})`} />
              <rect x="0" y="2" width="1200" height="2" fill="currentColor" opacity=".5" />
              <rect x="0" y="76" width="1200" height="2" fill="currentColor" opacity=".3" />
            </svg>
          </span>

          <span className="set-type__bed-rule set-type__bed-rule--top" aria-hidden="true">
            <svg viewBox="0 0 1200 6" preserveAspectRatio="none">
              <g filter={`url(#${ruleGrainId})`} opacity=".7">
                <path d="M2 3c80-2 160 2 240 0s160-2 240 0 160 2 240 0 160-2 240 0 40 2 36 0" fill="none" stroke="currentColor" strokeWidth=".55" strokeLinecap="round" />
              </g>
            </svg>
          </span>

          <span className="set-type__bed-rule set-type__bed-rule--bottom" aria-hidden="true">
            <svg viewBox="0 0 1200 6" preserveAspectRatio="none">
              <g filter={`url(#${ruleGrainId})`} opacity=".55">
                <path d="M2 3c80-2 160 2 240 0s160-2 240 0 160 2 240 0 160-2 240 0 40 2 36 0" fill="none" stroke="currentColor" strokeWidth=".45" strokeLinecap="round" />
              </g>
            </svg>
          </span>

          <span className="set-type__bed-mark set-type__bed-mark--lead" aria-hidden="true">
            <svg viewBox="0 0 16 16">
              <circle cx="8" cy="8" r="5" fill="currentColor" opacity=".65" />
              <circle cx="8" cy="8" r="2.4" fill="var(--paper)" opacity=".85" />
            </svg>
          </span>
          <span className="set-type__bed-mark set-type__bed-mark--trail" aria-hidden="true">
            <svg viewBox="0 0 16 16">
              <circle cx="8" cy="8" r="5" fill="currentColor" opacity=".55" />
              <circle cx="8" cy="8" r="2" fill="var(--paper)" opacity=".75" />
            </svg>
          </span>

          <span className="set-type__bed-lip" aria-hidden="true">
            <svg viewBox="0 0 1200 6" preserveAspectRatio="none">
              <rect x="0" y="0" width="1200" height="2" fill="currentColor" opacity=".4" />
              <rect x="0" y="3" width="1200" height="1" fill="currentColor" opacity=".2" />
            </svg>
          </span>

          <div className="set-type__slots" aria-hidden="true">
            {PIECES.map((_, idx) => (
              <span
                key={`set-type-slot-${idx}`}
                className="set-type__slot"
                style={{ '--slot-index': String(idx) } as CSSProperties}
              >
                <svg viewBox="0 0 4 36" preserveAspectRatio="none">
                  <line x1="2" y1="0" x2="2" y2="36" stroke="currentColor" strokeWidth=".45" strokeDasharray="1.6 1.6" opacity=".5" />
                </svg>
              </span>
            ))}
          </div>

          <ol className="set-type__pieces">
            {PIECES.map((piece, idx) => {
              const label = face.uppercased ? piece.text[voice].toUpperCase() : piece.text[voice]
              return (
                <li
                  key={`set-type-piece-${piece.id}`}
                  className={`set-type__piece set-type__piece--${piece.id}`}
                  style={{
                    '--piece-index': String(idx),
                    '--piece-fraction': String(idx / (PIECES.length - 1)),
                    '--piece-width': String(piece.width),
                  } as CSSProperties}
                >
                  <span className="set-type__piece-card">
                    <span className="set-type__piece-edge set-type__piece-edge--top" aria-hidden="true" />
                    <span className="set-type__piece-edge set-type__piece-edge--bottom" aria-hidden="true" />
                    <span className="set-type__piece-edge set-type__piece-edge--lead" aria-hidden="true" />
                    <span className="set-type__piece-edge set-type__piece-edge--trail" aria-hidden="true" />
                    <span className="set-type__piece-face">
                      <span
                        className="set-type__piece-text"
                        style={{
                          fontFamily: face.family,
                          fontWeight: face.weight,
                          fontStyle: face.style,
                          letterSpacing: face.tracking,
                          lineHeight: face.lineHeight,
                          fontSize: face.size,
                        }}
                      >
                        {label}
                      </span>
                    </span>
                    <span className="set-type__piece-base" aria-hidden="true" />
                    <span className="set-type__piece-wax" aria-hidden="true">
                      <span className="set-type__piece-wax-bead" />
                      <span className="set-type__piece-wax-wisp" />
                    </span>
                  </span>
                  <span className="set-type__piece-puff" aria-hidden="true">
                    <svg viewBox="0 0 32 12" preserveAspectRatio="none">
                      <line x1="2" y1="6" x2="30" y2="6" stroke="currentColor" strokeWidth=".4" strokeLinecap="round" pathLength="100" className="set-type__piece-puff-stroke" />
                    </svg>
                  </span>
                  <span className="set-type__piece-shadow" aria-hidden="true" />
                </li>
              )
            })}
          </ol>

          <span className="set-type__bed-tipping-rule" aria-hidden="true">
            <svg viewBox="0 0 200 8" preserveAspectRatio="none">
              <g filter={`url(#${ruleGrainId})`} opacity=".8">
                <path
                  className="set-type__bed-tipping-stroke"
                  d="M2 4c14-4 28 4 42 0s28-4 42 0 28 4 42 0 28-4 42 0 14 4 22 0"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth=".7"
                  strokeLinecap="round"
                  pathLength="100"
                />
              </g>
              <circle className="set-type__bed-tipping-bead" cx="198" cy="4" r="1.2" fill="currentColor" />
            </svg>
          </span>
        </div>

        <span className="set-type__below-rule" aria-hidden="true">
          <svg viewBox="0 0 1200 12" preserveAspectRatio="none">
            <g filter={`url(#${ruleGrainId})`} opacity=".7">
              <path
                className="set-type__below-rule-stroke"
                d="M2 6c40-2 80 2 120 0s80-2 120 0 80 2 120 0 80-2 120 0 80 2 120 0 80-2 120 0 240-2 260 0"
                fill="none"
                stroke="currentColor"
                strokeWidth=".6"
                strokeLinecap="round"
                pathLength="100"
                strokeDasharray="100 100"
              />
            </g>
            <circle cx="2" cy="6" r="1" fill="currentColor" opacity=".85" />
            <circle cx="1198" cy="6" r="1" fill="currentColor" opacity=".85" />
          </svg>
        </span>
      </div>

      <footer className="set-type__foot" aria-hidden="false">
        <span className="set-type__foot-cell set-type__foot-cell--status">
          <span className="set-type__foot-key">now</span>
          <span className="set-type__foot-value">
            <em className="set-type__foot-dot" aria-hidden="true" />
            <span className="set-type__foot-status">{composing ? (locked ? 'set' : 'setting') : 'restored'}</span>
          </span>
        </span>
        <span className="set-type__foot-rule" aria-hidden="true" />
        <span className="set-type__foot-cell set-type__foot-cell--voice">
          <span className="set-type__foot-key">set in</span>
          <span className="set-type__foot-value">
            <em>{VOICE_NAME[voice]}</em>
            <span className="set-type__foot-face">{SET_LINES[voice].face}</span>
          </span>
        </span>
        <span className="set-type__foot-rule set-type__foot-rule--alt" aria-hidden="true" />
        <span className="set-type__foot-cell set-type__foot-cell--date">
          <span className="set-type__foot-key">on</span>
          <em className="set-type__foot-value set-type__foot-value--date">{setToday}</em>
        </span>
      </footer>

      <span className="sr-only" aria-live="polite">
        {`Composing stand · the headline is being hand-set one word at a time in the ${VOICE_NAME[voice]} voice. Set on ${setToday}.`}
      </span>
    </section>
  )
}
