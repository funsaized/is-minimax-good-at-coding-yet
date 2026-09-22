import {
  useEffect,
  useId,
  useState,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react'
import type { VoiceId } from './App'

type ThreeVoiceSpecimenProps = {
  voice: VoiceId
  onVoice: (voice: VoiceId) => void
}

type VoiceRow = {
  id: VoiceId
  letter: string
  name: string
  face: string
  sample: string
  glyph: string
  gloss: string
  family: string
  weight: number
  style: 'italic' | 'normal'
  tracking: string
  uppercased: boolean
  delay: number
  toneVar: string
}

const VOICE_ROWS: VoiceRow[] = [
  {
    id: 'quiet',
    letter: 'A',
    name: 'quiet cut',
    face: 'serif · italic · close set',
    sample: 'is m³ good at frontend yet?',
    glyph: '⌇',
    gloss: 'set softly, that the reader may hear themselves in it',
    family: "'Iowan Old Style', 'Palatino Linotype', Georgia, serif",
    weight: 400,
    style: 'italic',
    tracking: '-.022em',
    uppercased: false,
    delay: 0,
    toneVar: 'var(--quiet)',
  },
  {
    id: 'human',
    letter: 'B',
    name: 'human hand',
    face: 'serif · italic · warm',
    sample: 'is M3 good at frontend yet?',
    glyph: '∧',
    gloss: 'set by hand, that the page may feel less like a page',
    family: "'Iowan Old Style', 'Palatino Linotype', Georgia, serif",
    weight: 500,
    style: 'italic',
    tracking: '-.016em',
    uppercased: false,
    delay: 70,
    toneVar: 'var(--human)',
  },
  {
    id: 'bold',
    letter: 'C',
    name: 'bold signal',
    face: 'sans · heavy · no apology',
    sample: 'IS M3 GOOD AT FRONTEND YET?',
    glyph: '∴',
    gloss: 'set at full height, that the question may be heard once',
    family: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
    weight: 800,
    style: 'normal',
    tracking: '-.045em',
    uppercased: true,
    delay: 140,
    toneVar: 'var(--bold)',
  },
]

const VOICE_ORDER: VoiceId[] = ['quiet', 'human', 'bold']

export function ThreeVoiceSpecimen({ voice, onVoice }: ThreeVoiceSpecimenProps) {
  const baseId = useId().replace(/:/g, '')
  const [reducedMotion, setReducedMotion] = useState(false)
  const [arrived, setArrived] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mq.matches)
    const onChange = () => setReducedMotion(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    if (reducedMotion) {
      setArrived(true)
      return
    }
    const id = window.setTimeout(() => setArrived(true), 220)
    return () => window.clearTimeout(id)
  }, [reducedMotion])

  const onRowKey = (event: ReactKeyboardEvent<HTMLButtonElement>, target: VoiceId) => {
    const index = VOICE_ORDER.indexOf(target)
    let next = index
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      next = (index + 1) % VOICE_ORDER.length
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      next = (index - 1 + VOICE_ORDER.length) % VOICE_ORDER.length
    } else if (event.key === 'Home') {
      next = 0
    } else if (event.key === 'End') {
      next = VOICE_ORDER.length - 1
    }
    if (next === index) return
    event.preventDefault()
    onVoice(VOICE_ORDER[next])
  }

  return (
    <section
      className={`tvs tvs--${voice} ${arrived ? 'is-arrived' : ''}`}
      aria-label="The question set three ways, on one plate"
    >
      <svg
        className="tvs__defs"
        viewBox="0 0 1200 220"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={`tvs-line-${baseId}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(245,238,216,.0)" />
            <stop offset="10%" stopColor="rgba(245,238,216,.16)" />
            <stop offset="50%" stopColor="rgba(245,238,216,.28)" />
            <stop offset="90%" stopColor="rgba(245,238,216,.16)" />
            <stop offset="100%" stopColor="rgba(245,238,216,.0)" />
          </linearGradient>
          <linearGradient id={`tvs-bed-${baseId}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(245,238,216,.018)" />
            <stop offset="100%" stopColor="rgba(8,11,22,.0)" />
          </linearGradient>
        </defs>
      </svg>

      <span className="tvs__rule tvs__rule--top" aria-hidden="true">
        <span className="tvs__rule-line" />
        <span className="tvs__rule-glyph">
          <svg viewBox="0 0 96 8" preserveAspectRatio="none">
            <line x1="0" y1="4" x2="38" y2="4" stroke="currentColor" strokeWidth=".4" strokeDasharray="1 3" opacity=".7" />
            <circle cx="42" cy="4" r=".9" fill="currentColor" opacity=".85" />
            <circle cx="48" cy="4" r="1.6" fill="currentColor" />
            <circle cx="54" cy="4" r=".9" fill="currentColor" opacity=".85" />
            <line x1="58" y1="4" x2="96" y2="4" stroke="currentColor" strokeWidth=".4" strokeDasharray="1 3" opacity=".7" />
          </svg>
        </span>
        <span className="tvs__rule-line" />
      </span>

      <header className="tvs__head">
        <span className="tvs__eyebrow">
          <span className="tvs__eyebrow-mark" aria-hidden="true">¶</span>
          <em>folio i · the specimen</em>
          <span className="tvs__eyebrow-sep" aria-hidden="true">·</span>
          <em>the line set three ways</em>
        </span>
        <span className="tvs__head-meta" aria-hidden="true">
          <span className="tvs__head-bead" />
          <em>set on one plate · choose a voice</em>
        </span>
      </header>

      <ol className="tvs__rows" role="radiogroup" aria-label="Three voices of the question">
        {VOICE_ROWS.map(row => {
          const isActive = voice === row.id
          const sampleStyle = {
            fontFamily: row.family,
            fontWeight: row.weight,
            fontStyle: row.style,
            letterSpacing: row.tracking,
            textTransform: row.uppercased ? ('uppercase' as const) : ('none' as const),
          } as CSSProperties
          const rowStyle = {
            '--tvs-row-tone': row.toneVar,
            '--tvs-row-delay': `${row.delay}ms`,
          } as CSSProperties
          return (
            <li key={row.id} className={`tvs__row tvs__row--${row.id} ${isActive ? 'is-active' : ''}`} style={rowStyle}>
              <button
                type="button"
                role="radio"
                aria-checked={isActive}
                className="tvs__row-btn"
                onClick={() => onVoice(row.id)}
                onKeyDown={event => onRowKey(event, row.id)}
                tabIndex={isActive ? 0 : -1}
                aria-label={`${row.letter} · ${row.name} · ${row.face} · ${row.gloss}`}
              >
                <span className="tvs__row-pin" aria-hidden="true">
                  <svg viewBox="0 0 14 14">
                    <circle cx="7" cy="7" r="6" fill="var(--night)" stroke="currentColor" strokeWidth=".55" />
                    <circle cx="7" cy="7" r="2.4" fill="currentColor" />
                    <circle cx="7" cy="7" r=".7" fill="var(--night)" />
                  </svg>
                  <em className="tvs__row-letter">{row.letter}</em>
                </span>

                <span className="tvs__row-stack">
                  <span className="tvs__row-meta" aria-hidden="true">
                    <em className="tvs__row-name">{row.name}</em>
                    <span className="tvs__row-dot" aria-hidden="true">·</span>
                    <em className="tvs__row-face">{row.face}</em>
                  </span>
                  <span
                    className={`tvs__row-sample tvs__row-sample--${row.id}`}
                    style={sampleStyle}
                    aria-hidden="true"
                  >
                    {row.sample}
                  </span>
                  <span className="tvs__row-gloss" aria-hidden="true">
                    <em className="tvs__row-gloss-glyph">{row.glyph}</em>
                    <span className="tvs__row-gloss-line">{row.gloss}</span>
                  </span>
                </span>

                <span className="tvs__row-tail" aria-hidden="true">
                  <span className="tvs__row-tail-rule" />
                  <em>{isActive ? 'set' : 'set · hold'}</em>
                </span>
              </button>
            </li>
          )
        })}
      </ol>

      <footer className="tvs__foot" aria-hidden="true">
        <span className="tvs__foot-rule" />
        <em className="tvs__foot-line">
          one line, three voices · choose with <kbd>shift</kbd>+<kbd>v</kbd> or click a row
        </em>
        <span className="tvs__foot-rule" />
      </footer>
    </section>
  )
}