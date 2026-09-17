import { useEffect, useId, useRef, useState, type CSSProperties } from 'react'
import type { VoiceId } from './Press'

type TitleSigilProps = {
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
const VOICE_LETTER: Record<VoiceId, string> = { quiet: 'A', human: 'B', bold: 'C' }

const SIGIL_LINES: Record<VoiceId, string> = {
  quiet: 'one line · three voices · one question',
  human: 'set by hand, in a single breath',
  bold: 'no apology, set down loud',
}

const SIGIL_GLYPH: Record<VoiceId, string> = { quiet: '⌇', human: '✦', bold: '■' }

export function TitleSigil({ voice, setToday }: TitleSigilProps) {
  const baseId = useId().replace(/:/g, '')
  const grainId = `title-sigil-grain-${baseId}`
  const ringId = `title-sigil-ring-${baseId}`
  const innerGrainId = `title-sigil-inner-grain-${baseId}`
  const rootRef = useRef<HTMLDivElement>(null)
  const [revealed, setRevealed] = useState(false)
  const [pulse, setPulse] = useState(0)
  const tone = VOICE_TONE[voice]

  const style = {
    '--title-sigil-tone': tone,
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
      { threshold: 0.16, rootMargin: '0px 0px -4% 0px' },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    setPulse(tick => tick + 1)
  }, [voice])

  return (
    <aside
      ref={rootRef}
      className={`title-sigil title-sigil--${voice} ${revealed ? 'is-revealed' : ''}`}
      style={style}
      aria-label={`The title sigil · the page's own imprint · set in ${VOICE_NAME[voice]} · set today ${setToday}`}
    >
      <svg className="title-sigil__defs" viewBox="0 0 240 240" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        <defs>
          <filter id={grainId} x="-12%" y="-12%" width="124%" height="124%">
            <feTurbulence type="fractalNoise" baseFrequency="2.4" numOctaves="2" seed="113" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .5 0" />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
          <filter id={innerGrainId} x="-12%" y="-12%" width="124%" height="124%">
            <feTurbulence type="fractalNoise" baseFrequency="2.8" numOctaves="2" seed="131" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .42 0" />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
          <radialGradient id={ringId} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
            <stop offset="60%" stopColor="currentColor" stopOpacity="0" />
            <stop offset="76%" stopColor="currentColor" stopOpacity=".18" />
            <stop offset="86%" stopColor="currentColor" stopOpacity=".32" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>

      <span className="title-sigil__rule title-sigil__rule--lead" aria-hidden="true">
        <svg viewBox="0 0 320 8" preserveAspectRatio="none">
          <g filter={`url(#${grainId})`}>
            <path
              className="title-sigil__rule-stroke title-sigil__rule-stroke--lead"
              d="M2 4c30-3 60 3 90 0s60-3 90 0 60 3 90 0 60-3 46 0"
              fill="none"
              stroke="currentColor"
              strokeWidth=".55"
              strokeLinecap="round"
              pathLength="100"
              strokeDasharray="100 100"
            />
          </g>
          <circle className="title-sigil__rule-bead" cx="318" cy="4" r="1.1" fill="currentColor" />
        </svg>
      </span>

      <span className="title-sigil__device" aria-hidden="true" key={`sigil-${pulse}`}>
        <svg viewBox="0 0 240 240" preserveAspectRatio="xMidYMid meet">
          <ellipse className="title-sigil__halo" cx="120" cy="120" rx="116" ry="116" fill={`url(#${ringId})`} />

          <g filter={`url(#${grainId})`}>
            <path
              className="title-sigil__octagon"
              d="M120 26 L186 60 L214 120 L186 180 L120 214 L54 180 L26 120 L54 60 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.1"
              strokeLinejoin="round"
              pathLength="100"
            />
            <path
              className="title-sigil__octagon-inner"
              d="M120 38 L178 68 L202 120 L178 172 L120 202 L62 172 L38 120 L62 68 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth=".45"
              strokeDasharray="1.2 2.2"
              opacity=".7"
              pathLength="100"
            />
            <path
              className="title-sigil__octagon-ghost"
              d="M120 50 L168 76 L190 120 L168 164 L120 190 L72 164 L50 120 L72 76 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth=".32"
              opacity=".42"
            />
          </g>

          <g filter={`url(#${innerGrainId})`} opacity=".92">
            <circle cx="120" cy="120" r="46" fill="none" stroke="currentColor" strokeWidth=".55" />
            <circle cx="120" cy="120" r="40" fill="none" stroke="currentColor" strokeWidth=".25" strokeDasharray=".7 1.4" opacity=".65" />
            <circle cx="120" cy="120" r="32" fill="none" stroke="currentColor" strokeWidth=".32" opacity=".4" />
            <path d="M120 86 L120 92 M120 148 L120 154 M86 120 L92 120 M148 120 L154 120" stroke="currentColor" strokeWidth=".5" strokeLinecap="round" opacity=".6" />
            <text
              x="120"
              y="129"
              textAnchor="middle"
              fontFamily="'Iowan Old Style', 'Palatino Linotype', Georgia, serif"
              fontStyle="italic"
              fontSize="38"
              letterSpacing="-.02em"
              fill="currentColor"
            >m³</text>
            <text
              x="120"
              y="100"
              textAnchor="middle"
              fontFamily="ui-monospace, monospace"
              fontSize="5"
              letterSpacing="2"
              fill="currentColor"
              opacity=".78"
            >{VOICE_LETTER[voice]}</text>
            <text
              x="120"
              y="148"
              textAnchor="middle"
              fontFamily="ui-monospace, monospace"
              fontSize="5"
              letterSpacing="1.6"
              fill="currentColor"
              opacity=".78"
            >PRESS · I</text>
          </g>

          <g className="title-sigil__petals" aria-hidden="true">
            {Array.from({ length: 8 }, (_, i) => {
              const angle = (i * 45 * Math.PI) / 180
              const cx = 120 + Math.cos(angle) * 110
              const cy = 120 + Math.sin(angle) * 110
              return (
                <circle
                  key={`petal-${i}`}
                  cx={cx}
                  cy={cy}
                  r="1.6"
                  fill="currentColor"
                  className={`title-sigil__petal title-sigil__petal--${i}`}
                  opacity=".7"
                />
              )
            })}
          </g>

          <g className="title-sigil__sparks" aria-hidden="true">
            <circle className="title-sigil__spark title-sigil__spark--a" cx="58" cy="58" r="1.2" fill="currentColor" opacity=".6" />
            <circle className="title-sigil__spark title-sigil__spark--b" cx="184" cy="56" r=".9" fill="currentColor" opacity=".5" />
            <circle className="title-sigil__spark title-sigil__spark--c" cx="190" cy="180" r="1.1" fill="currentColor" opacity=".55" />
            <circle className="title-sigil__spark title-sigil__spark--d" cx="50" cy="184" r=".8" fill="currentColor" opacity=".45" />
          </g>
        </svg>
      </span>

      <span className="title-sigil__glyph" aria-hidden="true">
        <span className="title-sigil__glyph-mark">{SIGIL_GLYPH[voice]}</span>
        <span className="title-sigil__glyph-line" />
        <span className="title-sigil__glyph-name">{VOICE_NAME[voice]}</span>
      </span>

      <p className="title-sigil__copy" aria-hidden="true">
        <em className="title-sigil__copy-line">{SIGIL_LINES[voice]}</em>
      </p>

      <span className="title-sigil__rule title-sigil__rule--trail" aria-hidden="true">
        <svg viewBox="0 0 320 8" preserveAspectRatio="none">
          <g filter={`url(#${grainId})`}>
            <path
              className="title-sigil__rule-stroke title-sigil__rule-stroke--trail"
              d="M2 4c30-3 60 3 90 0s60-3 90 0 60 3 90 0 60-3 46 0"
              fill="none"
              stroke="currentColor"
              strokeWidth=".55"
              strokeLinecap="round"
              pathLength="100"
              strokeDasharray="100 100"
            />
          </g>
          <circle className="title-sigil__rule-bead title-sigil__rule-bead--trail" cx="2" cy="4" r="1.1" fill="currentColor" />
        </svg>
      </span>
    </aside>
  )
}
