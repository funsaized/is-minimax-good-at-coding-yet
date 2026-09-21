import { useEffect, useId, useRef, useState, type CSSProperties } from 'react'
import type { VoiceId } from './Press'

type ReadingPulseProps = {
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

const VOICE_GLYPH: Record<VoiceId, string> = {
  quiet: '∽',
  human: '∾',
  bold: '◊',
}

const READING_TICK = {
  quiet: 'a pause · set once · held still',
  human: 'a breath · taken once · shared',
  bold: 'a beat · felt once · named',
} as const

export function ReadingPulse({ voice, setToday }: ReadingPulseProps) {
  const baseId = useId().replace(/:/g, '')
  const grainId = `reading-pulse-grain-${baseId}`
  const ruleGrainId = `reading-pulse-rule-grain-${baseId}`
  const rootRef = useRef<HTMLElement>(null)
  const [revealed, setRevealed] = useState(false)
  const [held, setHeld] = useState(false)
  const [pulseTick, setPulseTick] = useState(0)
  const tone = VOICE_TONE[voice]

  const style = {
    '--reading-pulse-tone': tone,
    '--reading-pulse-tone-quiet': 'var(--blue)',
    '--reading-pulse-tone-human': 'var(--coral)',
    '--reading-pulse-tone-bold': 'var(--acid)',
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
      { threshold: 0.2, rootMargin: '0px 0px -8% 0px' },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    setPulseTick(value => value + 1)
  }, [voice])

  const jumpToTitle = () => {
    const target = document.getElementById('question')
    if (!target) return
    target.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <section
      ref={rootRef}
      className={`reading-pulse reading-pulse--${voice} ${revealed ? 'is-revealed' : ''} ${held ? 'is-held' : ''}`}
      style={style}
      aria-label={`Reading pulse · the held breath between folio 0 and folio i · set in the ${VOICE_NAME[voice]} voice on ${setToday}.`}
    >
      <svg className="reading-pulse__defs" viewBox="0 0 1200 80" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <filter id={grainId} x="-2%" y="-50%" width="104%" height="200%">
            <feTurbulence type="fractalNoise" baseFrequency="0.84" numOctaves="2" seed="29" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 .14  0 0 0 0 .12  0 0 0 0 .19  0 0 0 .04 0" />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
          <filter id={ruleGrainId} x="-2%" y="-50%" width="104%" height="200%">
            <feTurbulence type="fractalNoise" baseFrequency="2.4" numOctaves="2" seed="61" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .48 0" />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
        </defs>
      </svg>

      <span className="reading-pulse__rule reading-pulse__rule--lead" aria-hidden="true">
        <svg viewBox="0 0 320 8" preserveAspectRatio="none">
          <g filter={`url(#${ruleGrainId})`} opacity=".9">
            <path
              className="reading-pulse__rule-stroke reading-pulse__rule-stroke--lead"
              d="M2 4c24-2 48 2 72 0s48-2 72 0 48 2 72 0 48-2 72 0 24 2 24 0"
              fill="none"
              stroke="currentColor"
              strokeWidth=".65"
              strokeLinecap="round"
              pathLength="100"
            />
          </g>
          <circle className="reading-pulse__rule-mark reading-pulse__rule-mark--lead" cx="316" cy="4" r="1" fill="currentColor" opacity=".7" />
        </svg>
      </span>

      <button
        type="button"
        className="reading-pulse__button"
        onClick={jumpToTitle}
        onMouseEnter={() => setHeld(true)}
        onMouseLeave={() => setHeld(false)}
        onFocus={() => setHeld(true)}
        onBlur={() => setHeld(false)}
        aria-label="Open the title page · folio i"
      >
        <span className="reading-pulse__halo" aria-hidden="true">
          <svg viewBox="0 0 96 96">
            <g filter={`url(#${ruleGrainId})`} opacity=".85">
              <circle cx="48" cy="48" r="38" fill="none" stroke="currentColor" strokeWidth=".5" />
              <circle cx="48" cy="48" r="30" fill="none" stroke="currentColor" strokeWidth=".3" strokeDasharray=".7 1.5" opacity=".75" />
              <circle cx="48" cy="48" r="20" fill="none" stroke="currentColor" strokeWidth=".25" opacity=".55" />
            </g>
          </svg>
        </span>

        <span className="reading-pulse__heart" aria-hidden="true" key={pulseTick}>
          <svg viewBox="0 0 48 48">
            <g filter={`url(#${ruleGrainId})`} opacity=".95">
              <circle className="reading-pulse__heart-ring" cx="24" cy="24" r="14" fill="none" stroke="currentColor" strokeWidth=".65" />
              <circle className="reading-pulse__heart-inner" cx="24" cy="24" r="9" fill="none" stroke="currentColor" strokeWidth=".35" strokeDasharray=".8 1.6" opacity=".75" />
            </g>
            <text
              className="reading-pulse__heart-glyph"
              x="24"
              y="29"
              textAnchor="middle"
              fontFamily="'Iowan Old Style', Georgia, serif"
              fontStyle="italic"
              fontSize="20"
              fill="currentColor"
            >{VOICE_GLYPH[voice]}</text>
          </svg>
        </span>
      </button>

      <span className="reading-pulse__rule reading-pulse__rule--trail" aria-hidden="true">
        <svg viewBox="0 0 320 8" preserveAspectRatio="none">
          <g filter={`url(#${ruleGrainId})`} opacity=".9">
            <path
              className="reading-pulse__rule-stroke reading-pulse__rule-stroke--trail"
              d="M2 4c24-2 48 2 72 0s48-2 72 0 48 2 72 0 48-2 72 0 24 2 24 0"
              fill="none"
              stroke="currentColor"
              strokeWidth=".65"
              strokeLinecap="round"
              pathLength="100"
            />
          </g>
          <circle className="reading-pulse__rule-mark reading-pulse__rule-mark--trail" cx="4" cy="4" r="1" fill="currentColor" opacity=".7" />
        </svg>
      </span>

      <span className="reading-pulse__caption" aria-hidden="false">
        <span className="reading-pulse__caption-key">held breath</span>
        <span className="reading-pulse__caption-rule" aria-hidden="true" />
        <em className="reading-pulse__caption-line">{READING_TICK[voice]}</em>
      </span>

      <span className="sr-only" aria-live="polite">
        {`The held breath, set in ${VOICE_NAME[voice]}. Press the mark to open the title page.`}
      </span>
    </section>
  )
}
