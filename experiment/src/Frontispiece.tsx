import { useEffect, useState, type CSSProperties } from 'react'
import type { VoiceId } from './App'

type FrontispieceProps = {
  voice: VoiceId
  setToday: string
  onVoice: (voice: VoiceId) => void
}

type VoiceRow = {
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
  tone: string
}

const VOICE_ROWS: VoiceRow[] = [
  {
    voice: 'quiet',
    letter: 'A',
    name: 'quiet cut',
    face: 'serif · italic · close set',
    text: 'is m³ good at frontend yet?',
    family: "'Iowan Old Style', 'Palatino Linotype', Georgia, serif",
    weight: 400,
    style: 'italic',
    tracking: '-.022em',
    uppercased: false,
    tone: 'var(--quiet)',
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
    tone: 'var(--human)',
  },
  {
    voice: 'bold',
    letter: 'C',
    name: 'bold signal',
    face: 'sans · heavy · no apology',
    text: 'IS M3 GOOD AT FRONTEND YET?',
    family: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
    weight: 800,
    style: 'normal',
    tracking: '-.045em',
    uppercased: true,
    tone: 'var(--bold)',
  },
]

const ORDER: VoiceId[] = ['quiet', 'human', 'bold']

export function Frontispiece({ voice, setToday, onVoice }: FrontispieceProps) {
  const [reduceMotion, setReduceMotion] = useState(false)
  const [hoverVoice, setHoverVoice] = useState<VoiceId | null>(null)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduceMotion(mq.matches)
    const onChange = () => setReduceMotion(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const id = window.setTimeout(() => setRevealed(true), reduceMotion ? 0 : 120)
    return () => window.clearTimeout(id)
  }, [reduceMotion])

  const focus = hoverVoice ?? voice
  const activeRow = VOICE_ROWS.find(r => r.voice === voice) ?? VOICE_ROWS[0]
  const style = {
    '--fp-tone': `var(--${voice})`,
    '--fp-focus': `var(--${focus})`,
    '--fp-active-tone': activeRow.tone,
  } as CSSProperties

  const onVerseKey = (
    event: React.KeyboardEvent<HTMLButtonElement>,
    target: VoiceId,
  ) => {
    const idx = ORDER.indexOf(target)
    let next: VoiceId | null = null
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
      event.preventDefault()
      next = ORDER[(idx + 1) % ORDER.length]
    } else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
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
    }
  }

  return (
    <section
      className={`frontispiece frontispiece--${voice} ${revealed ? 'is-revealed' : ''} ${reduceMotion ? 'is-quiet' : ''}`}
      style={style}
      aria-label={`Frontispiece · the question set in three voices · set on ${setToday}.`}
    >
      <span className="frontispiece__rule frontispiece__rule--top" aria-hidden="true">
        <svg viewBox="0 0 800 6" preserveAspectRatio="none">
          <line
            x1="0"
            y1="3"
            x2="800"
            y2="3"
            stroke="currentColor"
            strokeWidth=".5"
            strokeDasharray="1 4"
            opacity=".5"
          />
          <circle cx="2" cy="3" r="1" fill="currentColor" opacity=".85" />
          <circle cx="798" cy="3" r="1" fill="currentColor" opacity=".85" />
        </svg>
      </span>

      <header className="frontispiece__head">
        <span className="frontispiece__eyebrow" aria-hidden="true">
          <em className="frontispiece__eyebrow-mark">
            <svg viewBox="0 0 14 14" aria-hidden="true">
              <circle cx="7" cy="7" r="5.6" fill="none" stroke="currentColor" strokeWidth=".55" opacity=".75" />
              <circle cx="7" cy="7" r="2.6" fill="currentColor" opacity=".85" />
              <circle cx="7" cy="7" r=".9" fill="var(--night)" />
            </svg>
          </em>
          <em className="frontispiece__eyebrow-tag">m³ press</em>
          <span className="frontispiece__eyebrow-rule" aria-hidden="true" />
          <em className="frontispiece__eyebrow-sub">a half-title</em>
          <span className="frontispiece__eyebrow-rule" aria-hidden="true" />
          <em className="frontispiece__eyebrow-date">set on {setToday}</em>
        </span>
      </header>

      <ol
        className="frontispiece__verses"
        aria-label="The question, set in three voices on one plate"
      >
        {VOICE_ROWS.map(row => {
          const isActive = voice === row.voice
          const isHover = hoverVoice === row.voice
          const isMuted = !isActive && !isHover
          const lineStyle = {
            fontFamily: row.family,
            fontWeight: row.weight,
            fontStyle: row.style,
            letterSpacing: row.tracking,
            textTransform: row.uppercased ? 'uppercase' : 'none',
          } as CSSProperties
          const cue = isActive ? '· set' : isHover ? '· bring forward' : '· held'
          return (
            <li
              key={row.voice}
              className={`frontispiece__verse frontispiece__verse--${row.voice} ${isActive ? 'is-active' : ''} ${isHover ? 'is-hover' : ''} ${isMuted ? 'is-muted' : ''}`}
            >
              <button
                type="button"
                className="frontispiece__verse-btn"
                onClick={() => onVoice(row.voice)}
                onKeyDown={event => onVerseKey(event, row.voice)}
                onMouseEnter={() => setHoverVoice(row.voice)}
                onMouseLeave={() =>
                  setHoverVoice(prev => (prev === row.voice ? null : prev))
                }
                onFocus={() => setHoverVoice(row.voice)}
                onBlur={() =>
                  setHoverVoice(prev => (prev === row.voice ? null : prev))
                }
                aria-pressed={isActive}
                aria-label={`Voice ${row.letter} · ${row.name}. ${row.text}. Click to set this voice across the page.`}
              >
                <span className="frontispiece__verse-letter" aria-hidden="true">
                  <em className="frontispiece__verse-letter-circle">
                    <svg viewBox="0 0 22 22">
                      <circle cx="11" cy="11" r="10" fill="none" stroke="currentColor" strokeWidth=".5" opacity=".55" />
                      <circle cx="11" cy="11" r="6.6" fill="none" stroke="currentColor" strokeWidth=".3" strokeDasharray=".6 1.4" opacity=".5" />
                    </svg>
                  </em>
                  <em className="frontispiece__verse-letter-glyph">{row.letter}</em>
                </span>
                <span
                  className="frontispiece__verse-line"
                  style={lineStyle}
                  aria-hidden="true"
                >
                  {row.text}
                </span>
                <span className="frontispiece__verse-cue" aria-hidden="true">{cue}</span>
              </button>
              <span className="frontispiece__verse-face" aria-hidden="true">
                {row.name} <span aria-hidden="true">·</span> {row.face}
              </span>
            </li>
          )
        })}
      </ol>

      <footer className="frontispiece__foot">
        <span className="frontispiece__foot-rule" aria-hidden="true" />
        <span className="frontispiece__foot-text">
          <em className="frontispiece__foot-line">set in three voices</em>
          <span aria-hidden="true" className="frontispiece__foot-dot">·</span>
          <em className="frontispiece__foot-line">
            <kbd>shift</kbd>+<kbd>v</kbd> to cycle
          </em>
          <span aria-hidden="true" className="frontispiece__foot-dot">·</span>
          <em className="frontispiece__foot-line">begins at folio 0</em>
        </span>
        <span className="frontispiece__foot-rule" aria-hidden="true" />
      </footer>

      <span className="frontispiece__stitch" aria-hidden="true">
        <svg viewBox="0 0 200 6" preserveAspectRatio="none">
          <line x1="0" y1="3" x2="78" y2="3" stroke="currentColor" strokeWidth=".4" strokeDasharray=".6 2" opacity=".55" />
          <circle cx="84" cy="3" r="1" fill="currentColor" opacity=".85" />
          <circle cx="100" cy="3" r="1.6" fill="currentColor" />
          <circle cx="116" cy="3" r="1" fill="currentColor" opacity=".85" />
          <line x1="122" y1="3" x2="200" y2="3" stroke="currentColor" strokeWidth=".4" strokeDasharray=".6 2" opacity=".55" />
        </svg>
      </span>

      <span className="frontispiece__chop" aria-hidden="true">
        <svg viewBox="0 0 60 60">
          <circle cx="30" cy="30" r="28" fill="none" stroke="currentColor" strokeWidth=".4" opacity=".55" strokeDasharray=".8 2" />
          <circle cx="30" cy="30" r="22" fill="none" stroke="currentColor" strokeWidth=".35" opacity=".4" />
          <text
            x="30"
            y="34"
            textAnchor="middle"
            fontFamily="'Iowan Old Style', 'Palatino Linotype', Georgia, serif"
            fontStyle="italic"
            fontSize="20"
            fill="currentColor"
            opacity=".9"
          >
            m³
          </text>
          <text
            x="30"
            y="48"
            textAnchor="middle"
            fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
            fontSize="3.2"
            letterSpacing="1.2"
            fill="currentColor"
            opacity=".7"
          >
            PRESS · SET
          </text>
        </svg>
      </span>
    </section>
  )
}
