import { useEffect, useId, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react'
import type { VoiceId } from './Press'

type PressCadenceProps = {
  voice: VoiceId
  setToday: string
}

const VOICE_ORDER: VoiceId[] = ['quiet', 'human', 'bold']

const VOICE_NAME: Record<VoiceId, string> = {
  quiet: 'quiet cut',
  human: 'human hand',
  bold: 'bold signal',
}

const VOICE_LETTER: Record<VoiceId, string> = { quiet: 'A', human: 'B', bold: 'C' }

const VOICE_GLYPH: Record<VoiceId, string> = { quiet: 'a', human: 'b', bold: 'c' }

const STAFF_BEATS = [
  { voice: 'quiet' as VoiceId, fraction: 0.16, name: 'quiet cut' },
  { voice: 'human' as VoiceId, fraction: 0.5, name: 'human hand' },
  { voice: 'bold' as VoiceId, fraction: 0.84, name: 'bold signal' },
]

export function PressCadence({ voice, setToday }: PressCadenceProps) {
  const baseId = useId().replace(/:/g, '')
  const grainId = `press-cadence-grain-${baseId}`
  const ruleGrainId = `press-cadence-rule-grain-${baseId}`
  const rootRef = useRef<HTMLElement>(null)
  const [revealed, setRevealed] = useState(false)
  const [activeBeat, setActiveBeat] = useState<VoiceId>(voice)
  const lastUserBeatRef = useRef<number>(0)

  const toneStyle = {
    '--pc-tone': voice === 'quiet' ? 'var(--blue)' : voice === 'human' ? 'var(--coral)' : 'var(--acid)',
    '--pc-tone-quiet': 'var(--blue)',
    '--pc-tone-human': 'var(--coral)',
    '--pc-tone-bold': 'var(--acid)',
  } as CSSProperties

  useEffect(() => {
    const node = rootRef.current
    if (!node) {
      setRevealed(true)
      return
    }
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
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

  useEffect(() => {
    if (!revealed) return
    const now = performance.now()
    if (now - lastUserBeatRef.current < 420) return
    setActiveBeat(voice)
  }, [voice, revealed])

  const onBeatClick = (next: VoiceId) => {
    lastUserBeatRef.current = performance.now()
    setActiveBeat(next)
  }

  const onBeatKey = (event: KeyboardEvent<HTMLButtonElement>, beat: VoiceId) => {
    const idx = STAFF_BEATS.findIndex(item => item.voice === beat)
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault()
      const next = STAFF_BEATS[(idx + 1) % STAFF_BEATS.length].voice
      const target = event.currentTarget.parentElement?.querySelector<HTMLButtonElement>(
        `[data-pc-beat="${next}"]`,
      )
      target?.focus()
      onBeatClick(next)
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault()
      const next = STAFF_BEATS[(idx - 1 + STAFF_BEATS.length) % STAFF_BEATS.length].voice
      const target = event.currentTarget.parentElement?.querySelector<HTMLButtonElement>(
        `[data-pc-beat="${next}"]`,
      )
      target?.focus()
      onBeatClick(next)
    } else if (event.key === 'Home') {
      event.preventDefault()
      onBeatClick('quiet')
      const target = event.currentTarget.parentElement?.querySelector<HTMLButtonElement>('[data-pc-beat="quiet"]')
      target?.focus()
    } else if (event.key === 'End') {
      event.preventDefault()
      onBeatClick('bold')
      const target = event.currentTarget.parentElement?.querySelector<HTMLButtonElement>('[data-pc-beat="bold"]')
      target?.focus()
    }
  }

  const activeIndex = STAFF_BEATS.findIndex(beat => beat.voice === activeBeat)

  return (
    <section
      ref={rootRef}
      className={`press-cadence press-cadence--${voice} ${revealed ? 'is-revealed' : ''}`}
      style={toneStyle}
      aria-label={`Press cadence · the line, set three ways · three readings · one breath · set on ${setToday}.`}
    >
      <svg className="press-cadence__defs" viewBox="0 0 1200 200" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <filter id={grainId} x="-2%" y="-6%" width="104%" height="112%">
            <feTurbulence type="fractalNoise" baseFrequency="0.78" numOctaves="2" seed="53" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 .14  0 0 0 0 .12  0 0 0 0 .19  0 0 0 .04 0" />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
          <filter id={ruleGrainId} x="-2%" y="-50%" width="104%" height="200%">
            <feTurbulence type="fractalNoise" baseFrequency="2.6" numOctaves="2" seed="73" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .45 0" />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
          <linearGradient id={`press-cadence-fade-${baseId}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
            <stop offset="14%" stopColor="currentColor" stopOpacity=".7" />
            <stop offset="50%" stopColor="currentColor" stopOpacity="1" />
            <stop offset="86%" stopColor="currentColor" stopOpacity=".7" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      <span className="press-cadence__paper" aria-hidden="true">
        <svg viewBox="0 0 1200 200" preserveAspectRatio="none">
          <rect x="0" y="0" width="1200" height="200" filter={`url(#${grainId})`} opacity=".04" />
        </svg>
      </span>

      <span className="press-cadence__edge press-cadence__edge--lead" aria-hidden="true">
        <svg viewBox="0 0 24 24">
          <g filter={`url(#${ruleGrainId})`} opacity=".9">
            <circle cx="12" cy="12" r="6" fill="none" stroke="currentColor" strokeWidth=".55" />
            <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth=".35" strokeDasharray=".7 1.6" />
            <circle cx="12" cy="12" r="1.4" fill="currentColor" />
          </g>
        </svg>
      </span>

      <header className="press-cadence__caption" aria-hidden="false">
        <span className="press-cadence__caption-key">press cadence</span>
        <span className="press-cadence__caption-rule" aria-hidden="true" />
        <em className="press-cadence__caption-line">three readings · one line · one breath</em>
      </header>

      <div className="press-cadence__staff" role="group" aria-label="Three voice stations on a single rule">
        <svg
          className="press-cadence__staff-rule"
          viewBox="0 0 1200 60"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <line
            x1="0"
            y1="30"
            x2="1200"
            y2="30"
            stroke={`url(#press-cadence-fade-${baseId})`}
            strokeWidth=".6"
            strokeLinecap="round"
          />
          <g filter={`url(#${ruleGrainId})`}>
            <path
              className="press-cadence__staff-path"
              d="M2 30c60-3 120 3 180 0s120-3 180 0 120 3 180 0 120-3 180 0 120 3 180 0 60-3 116 0 60-3 100 0"
              fill="none"
              stroke="currentColor"
              strokeWidth=".9"
              strokeLinecap="round"
              pathLength="100"
              strokeDasharray="100 100"
              strokeDashoffset="100"
            />
          </g>
        </svg>

        {STAFF_BEATS.map((beat, i) => {
          const isActive = beat.voice === activeBeat
          const isVoice = beat.voice === voice
          return (
            <button
              key={`pc-beat-${beat.voice}`}
              data-pc-beat={beat.voice}
              type="button"
              className={`press-cadence__beat press-cadence__beat--${beat.voice} ${isActive ? 'is-active' : ''} ${isVoice ? 'is-voice' : ''}`}
              style={{ '--beat-fraction': beat.fraction } as CSSProperties}
              onClick={() => onBeatClick(beat.voice)}
              onKeyDown={event => onBeatKey(event, beat.voice)}
              onMouseEnter={() => onBeatClick(beat.voice)}
              onMouseLeave={() => onBeatClick(voice)}
              onFocus={() => onBeatClick(beat.voice)}
              onBlur={() => onBeatClick(voice)}
              aria-pressed={isActive}
              aria-label={`${VOICE_NAME[beat.voice]} · beat ${i + 1} of 3`}
              tabIndex={isActive ? 0 : -1}
            >
              <span className="press-cadence__beat-line" aria-hidden="true">
                <svg viewBox="0 0 12 60" preserveAspectRatio="none">
                  <line x1="6" y1="0" x2="6" y2="60" stroke="currentColor" strokeWidth=".5" strokeDasharray="1.4 3" opacity=".45" />
                </svg>
              </span>
              <span className="press-cadence__beat-disc" aria-hidden="true">
                <svg viewBox="0 0 56 56">
                  <g filter={`url(#${ruleGrainId})`} opacity=".95">
                    <circle cx="28" cy="28" r="22" fill="none" stroke="currentColor" strokeWidth=".7" />
                    <circle cx="28" cy="28" r="16" fill="none" stroke="currentColor" strokeWidth=".35" strokeDasharray=".8 1.6" opacity=".7" />
                  </g>
                </svg>
              </span>
              <span className="press-cadence__beat-letter" aria-hidden="true">
                {VOICE_LETTER[beat.voice]}
              </span>
              <span className="press-cadence__beat-name" aria-hidden="true">
                {VOICE_NAME[beat.voice]}
              </span>
            </button>
          )
        })}

        <span className="press-cadence__pulse" aria-hidden="true" style={{ '--pulse-fraction': STAFF_BEATS[activeIndex]?.fraction ?? 0.5 } as CSSProperties}>
          <svg viewBox="0 0 12 60" preserveAspectRatio="none">
            <line x1="6" y1="2" x2="6" y2="58" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" opacity=".85" />
          </svg>
        </span>
      </div>

      <footer className="press-cadence__foot" aria-hidden="false">
        <span className="press-cadence__foot-key">m³ press</span>
        <span className="press-cadence__foot-rule" aria-hidden="true" />
        <span className="press-cadence__foot-stack">
          <em>set on {setToday}</em>
          <span className="press-cadence__foot-sub">the line, held for one breath</span>
        </span>
        <span className="press-cadence__foot-rule press-cadence__foot-rule--alt" aria-hidden="true" />
        <span className="press-cadence__foot-glyph" aria-hidden="true">
          <em>{VOICE_GLYPH[activeBeat]}</em>
        </span>
      </footer>

      <span className="press-cadence__edge press-cadence__edge--trail" aria-hidden="true">
        <svg viewBox="0 0 24 24">
          <g filter={`url(#${ruleGrainId})`} opacity=".9">
            <circle cx="12" cy="12" r="6" fill="none" stroke="currentColor" strokeWidth=".55" />
            <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth=".35" strokeDasharray=".7 1.6" />
            <circle cx="12" cy="12" r="1.4" fill="currentColor" />
          </g>
        </svg>
      </span>

      <span className="sr-only" aria-live="polite">
        {`Cadence set to ${VOICE_NAME[activeBeat]}. One line, three readings. Set on ${setToday}.`}
      </span>
    </section>
  )
}
