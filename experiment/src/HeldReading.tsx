import {
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react'
import type { VoiceId } from './App'

type HeldReadingProps = {
  voice: VoiceId
  setToday: string
  onVoice: (voice: VoiceId) => void
}

type Ghost = {
  voice: VoiceId
  letter: string
  name: string
  face: string
  text: string
  family: string
  weight: number
  style: 'italic' | 'normal'
  tracking: string
  uppercased: boolean
  x: number
  y: number
  rot: number
  tint: string
  hint: string
}

const ORDER: VoiceId[] = ['quiet', 'human', 'bold']

const GHOSTS: Ghost[] = [
  {
    voice: 'quiet',
    letter: 'A',
    name: 'quiet cut',
    face: 'serif · italic',
    text: 'is m³ good at frontend yet?',
    family: "'Iowan Old Style', 'Palatino Linotype', Georgia, serif",
    weight: 400,
    style: 'italic',
    tracking: '-.018em',
    uppercased: false,
    x: -3.4,
    y: 1.4,
    rot: -0.45,
    tint: 'rgba(168, 197, 255, .85)',
    hint: 'the line, set softly',
  },
  {
    voice: 'human',
    letter: 'B',
    name: 'human hand',
    face: 'serif · italic · warm',
    text: 'is M3 good at frontend yet?',
    family: "'Iowan Old Style', 'Palatino Linotype', Georgia, serif",
    weight: 500,
    style: 'italic',
    tracking: '-.014em',
    uppercased: false,
    x: 0,
    y: 0,
    rot: 0,
    tint: 'rgba(244, 132, 114, .88)',
    hint: 'the line, set by hand',
  },
  {
    voice: 'bold',
    letter: 'C',
    name: 'bold signal',
    face: 'sans · heavy',
    text: 'IS M3 GOOD AT FRONTEND YET?',
    family: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
    weight: 800,
    style: 'normal',
    tracking: '-.05em',
    uppercased: true,
    x: 2.6,
    y: -1.6,
    rot: 0.32,
    tint: 'rgba(205, 238, 106, .88)',
    hint: 'the line, set at full height',
  },
]

const CONSENSUS = 'yes — but only when it earns the pause.'

export function HeldReading({ voice, setToday, onVoice }: HeldReadingProps) {
  const baseId = useId().replace(/:/g, '')
  const washId = `hr-wash-${baseId}`
  const [reducedMotion, setReducedMotion] = useState(false)
  const [hoverVoice, setHoverVoice] = useState<VoiceId | null>(null)
  const [revealed, setRevealed] = useState(false)
  const rootRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mq.matches)
    const onChange = () => setReducedMotion(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setRevealed(true)
      return
    }
    const node = rootRef.current
    if (!node) return
    const obs = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setRevealed(true)
            obs.unobserve(entry.target)
          }
        }
      },
      { threshold: 0.2, rootMargin: '0px 0px -6% 0px' },
    )
    obs.observe(node)
    return () => obs.disconnect()
  }, [])

  const focusVoice = hoverVoice ?? voice
  const style = {
    '--hr-tone': `var(--${voice})`,
    '--hr-focus': `var(--${focusVoice})`,
  } as CSSProperties

  const onProofKey = (
    event: ReactKeyboardEvent<HTMLButtonElement>,
    target: VoiceId,
  ) => {
    const idx = ORDER.indexOf(target)
    let next: VoiceId | null = null
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault()
      next = ORDER[(idx + 1) % ORDER.length]
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault()
      next = ORDER[(idx - 1 + ORDER.length) % ORDER.length]
    } else if (event.key === 'Home') {
      event.preventDefault()
      next = ORDER[0]
    } else if (event.key === 'End') {
      event.preventDefault()
      next = ORDER[ORDER.length - 1]
    }
    if (next) {
      onVoice(next)
      window.requestAnimationFrame(() => {
        const node = document.getElementById(`hr-proof-${next}-${baseId}`) as HTMLButtonElement | null
        node?.focus({ preventScroll: true })
      })
    }
  }

  return (
    <section
      ref={rootRef}
      id="held"
      className={`held-reading held-reading--${voice} ${revealed ? 'is-revealed' : ''} ${reducedMotion ? 'is-quiet' : ''}`}
      style={style}
      aria-labelledby={`held-title-${baseId}`}
    >
      <svg className="held-reading__defs" aria-hidden="true" focusable="false">
        <defs>
          <linearGradient id={washId} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--hr-tone)" stopOpacity="0" />
            <stop offset="22%" stopColor="var(--hr-tone)" stopOpacity=".35" />
            <stop offset="50%" stopColor="var(--hr-tone)" stopOpacity=".55" />
            <stop offset="78%" stopColor="var(--hr-tone)" stopOpacity=".35" />
            <stop offset="100%" stopColor="var(--hr-tone)" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      <span className="held-reading__halo" aria-hidden="true" />
      <span className="held-reading__grain" aria-hidden="true" />

      <header className="held-reading__head">
        <span className="held-reading__eyebrow" aria-hidden="true">
          <span className="held-reading__eyebrow-mark">
            <svg viewBox="0 0 14 14">
              <circle cx="7" cy="7" r="5.6" fill="none" stroke="currentColor" strokeWidth=".55" opacity=".7" />
              <circle cx="7" cy="7" r="2.6" fill="currentColor" opacity=".75" />
              <circle cx="7" cy="7" r=".9" fill="var(--night)" />
            </svg>
          </span>
          <em>folio iv · the held reading</em>
          <span className="held-reading__eyebrow-sep">·</span>
          <em>three proofs, one plate, one breath</em>
        </span>

        <h2 id={`held-title-${baseId}`} className="held-reading__title">
          One line, <em>held three ways.</em>
        </h2>

        <p className="section__lede held-reading__lede">
          A single proof sheet pulled three times — the line set softly, set by hand, set at full height,
          one on top of the next. Click any voice to bring it forward; the others ghost through.
        </p>
      </header>

      <figure className="held-reading__plate" aria-label="The line held in three voices on one plate">
        <span className="held-reading__plate-corner held-reading__plate-corner--tl" aria-hidden="true">
          <svg viewBox="0 0 18 18">
            <path d="M2 16 L2 2 L16 2" fill="none" stroke="currentColor" strokeWidth=".55" strokeLinecap="round" />
            <circle cx="2" cy="2" r="1.2" fill="currentColor" />
          </svg>
        </span>
        <span className="held-reading__plate-corner held-reading__plate-corner--tr" aria-hidden="true">
          <svg viewBox="0 0 18 18">
            <path d="M16 16 L16 2 L2 2" fill="none" stroke="currentColor" strokeWidth=".55" strokeLinecap="round" />
            <circle cx="16" cy="2" r="1.2" fill="currentColor" />
          </svg>
        </span>
        <span className="held-reading__plate-corner held-reading__plate-corner--bl" aria-hidden="true">
          <svg viewBox="0 0 18 18">
            <path d="M2 2 L2 16 L16 16" fill="none" stroke="currentColor" strokeWidth=".55" strokeLinecap="round" />
            <circle cx="2" cy="16" r="1.2" fill="currentColor" />
          </svg>
        </span>
        <span className="held-reading__plate-corner held-reading__plate-corner--br" aria-hidden="true">
          <svg viewBox="0 0 18 18">
            <path d="M16 2 L16 16 L2 16" fill="none" stroke="currentColor" strokeWidth=".55" strokeLinecap="round" />
            <circle cx="16" cy="16" r="1.2" fill="currentColor" />
          </svg>
        </span>

        <span className="held-reading__plate-warm" aria-hidden="true" />
        <span className="held-reading__plate-bed" aria-hidden="true" />

        <span className="held-reading__plate-rule held-reading__plate-rule--top" aria-hidden="true">
          <svg viewBox="0 0 600 4" preserveAspectRatio="none">
            <line x1="0" y1="2" x2="600" y2="2" stroke={`url(#${washId})`} strokeWidth=".6" />
          </svg>
        </span>
        <span className="held-reading__plate-rule held-reading__plate-rule--bot" aria-hidden="true">
          <svg viewBox="0 0 600 4" preserveAspectRatio="none">
            <line x1="0" y1="2" x2="600" y2="2" stroke={`url(#${washId})`} strokeWidth=".6" />
          </svg>
        </span>

        <ol
          className="held-reading__proofs"
          aria-label="Three voice proofs of the question, layered on one plate"
        >
          {GHOSTS.map(ghost => {
            const isActive = voice === ghost.voice
            const isHover = hoverVoice === ghost.voice
            const isGhost = !isActive
            const ghostStyle: CSSProperties = {
              fontFamily: ghost.family,
              fontWeight: ghost.weight,
              fontStyle: ghost.style,
              letterSpacing: ghost.tracking,
              textTransform: ghost.uppercased ? 'uppercase' : 'none',
            }
            return (
              <li
                key={ghost.voice}
                className={`held-reading__proof held-reading__proof--${ghost.voice} ${isActive ? 'is-active' : ''} ${isHover ? 'is-hover' : ''} ${isGhost ? 'is-ghost' : ''}`}
                style={{
                  '--hr-ghost-x': `${ghost.x}%`,
                  '--hr-ghost-y': `${ghost.y}px`,
                  '--hr-ghost-rot': `${ghost.rot}deg`,
                  '--hr-ghost-tint': ghost.tint,
                } as CSSProperties}
              >
                <button
                  id={`hr-proof-${ghost.voice}-${baseId}`}
                  type="button"
                  className="held-reading__proof-btn"
                  onClick={() => onVoice(ghost.voice)}
                  onKeyDown={event => onProofKey(event, ghost.voice)}
                  onMouseEnter={() => setHoverVoice(ghost.voice)}
                  onMouseLeave={() => setHoverVoice(prev => (prev === ghost.voice ? null : prev))}
                  onFocus={() => setHoverVoice(ghost.voice)}
                  onBlur={() => setHoverVoice(prev => (prev === ghost.voice ? null : prev))}
                  aria-label={`${ghost.letter} · ${ghost.name} · ${ghost.face}. ${ghost.hint}. Click to bring forward.`}
                  aria-pressed={isActive}
                >
                  <span className="held-reading__proof-pin" aria-hidden="true">
                    <svg viewBox="0 0 16 16">
                      <circle cx="8" cy="8" r="6.2" fill="none" stroke="currentColor" strokeWidth=".5" opacity={isActive ? '.95' : '.55'} />
                      <circle cx="8" cy="8" r="2.4" fill="currentColor" opacity={isActive ? '1' : '.55'} />
                      <circle cx="8" cy="8" r=".9" fill="var(--night)" />
                    </svg>
                  </span>

                  <span className="held-reading__proof-line" style={ghostStyle} aria-hidden="true">
                    {ghost.text}
                  </span>

                  <span className="held-reading__proof-meta" aria-hidden="true">
                    <em className="held-reading__proof-letter">{ghost.letter}</em>
                    <span className="held-reading__proof-stack">
                      <em className="held-reading__proof-name">{ghost.name}</em>
                      <span className="held-reading__proof-face">{ghost.face}</span>
                    </span>
                    <span className="held-reading__proof-cue">
                      {isActive ? 'on the plate' : isHover ? 'bring forward' : 'ghost through'}
                    </span>
                  </span>
                </button>
              </li>
            )
          })}
        </ol>

        <span className="held-reading__plate-watermark" aria-hidden="true">
          <svg viewBox="0 0 220 40" preserveAspectRatio="none">
            <text
              x="110"
              y="32"
              textAnchor="middle"
              fontFamily="ui-monospace, 'SFMono-Regular', Menlo, monospace"
              fontSize="9"
              letterSpacing="3.5"
              fill="currentColor"
              opacity=".5"
            >
              m³ · three proofs · one plate
            </text>
          </svg>
        </span>

        <span className="held-reading__plate-register" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth=".4" opacity=".65" />
            <line x1="12" y1="0" x2="12" y2="24" stroke="currentColor" strokeWidth=".35" opacity=".5" />
            <line x1="0" y1="12" x2="24" y2="12" stroke="currentColor" strokeWidth=".35" opacity=".5" />
            <circle cx="12" cy="12" r="1.6" fill="currentColor" />
          </svg>
        </span>

        <figcaption className="held-reading__consensus" aria-label="The three voices, held together">
          <span className="held-reading__consensus-rule held-reading__consensus-rule--l" aria-hidden="true" />
          <span className="held-reading__consensus-stitch" aria-hidden="true">
            <svg viewBox="0 0 60 12" preserveAspectRatio="none">
              <line x1="0" y1="6" x2="60" y2="6" stroke="currentColor" strokeWidth=".5" strokeDasharray="1.4 2.4" opacity=".55" />
              <circle cx="14" cy="6" r="1.2" fill="currentColor" />
              <circle cx="46" cy="6" r="1.2" fill="currentColor" />
            </svg>
          </span>
          <em className="held-reading__consensus-line">
            <em className="held-reading__consensus-yes">yes</em>
            <span className="held-reading__consensus-em"> — but only when it earns the pause.</span>
          </em>
          <span className="held-reading__consensus-stitch" aria-hidden="true">
            <svg viewBox="0 0 60 12" preserveAspectRatio="none">
              <line x1="0" y1="6" x2="60" y2="6" stroke="currentColor" strokeWidth=".5" strokeDasharray="1.4 2.4" opacity=".55" />
              <circle cx="14" cy="6" r="1.2" fill="currentColor" />
              <circle cx="46" cy="6" r="1.2" fill="currentColor" />
            </svg>
          </span>
          <span className="held-reading__consensus-rule held-reading__consensus-rule--r" aria-hidden="true" />
        </figcaption>
      </figure>

      <footer className="held-reading__foot" aria-hidden="true">
        <span className="held-reading__foot-rule" />
        <span className="held-reading__foot-meta">
          <em className="held-reading__foot-cell">
            <span className="held-reading__foot-key">set on</span>
            <span className="held-reading__foot-word">{setToday}</span>
          </em>
          <span className="held-reading__foot-dot">·</span>
          <em className="held-reading__foot-cell">
            <span className="held-reading__foot-key">now in</span>
            <span className="held-reading__foot-word">
              {ORDER.find(o => o === voice) ? voice : voice} · {GHOSTS.find(g => g.voice === voice)?.name ?? ''}
            </span>
          </em>
          <span className="held-reading__foot-dot">·</span>
          <em className="held-reading__foot-cell">
            <span className="held-reading__foot-key">three ghosts</span>
            <span className="held-reading__foot-word">
              {hoverVoice && hoverVoice !== voice ? `one in hand · ${hoverVoice}` : 'all held'}
            </span>
          </em>
        </span>
        <span className="held-reading__foot-rule" />
      </footer>

      <span className="sr-only">
        The held reading · the line set in three voices on one plate · {CONSENSUS} Now reading in {voice}.
      </span>
    </section>
  )
}
