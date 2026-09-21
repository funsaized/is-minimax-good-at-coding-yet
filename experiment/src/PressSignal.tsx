import { useEffect, useId, useRef, useState, type CSSProperties } from 'react'
import type { VoiceId } from './Press'

type PressSignalProps = {
  voice: VoiceId
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

const SEASON_LABEL = (() => {
  const month = new Date().getMonth()
  if (month <= 1 || month === 11) return 'winter light'
  if (month <= 4) return 'spring light'
  if (month <= 7) return 'summer light'
  return 'autumn light'
})()

export function PressSignal({ voice }: PressSignalProps) {
  const baseId = useId().replace(/:/g, '')
  const grainId = `press-signal-grain-${baseId}`
  const rootRef = useRef<HTMLDivElement>(null)
  const [revealed, setRevealed] = useState(false)
  const tone = VOICE_TONE[voice]
  const style = { '--press-signal-tone': tone } as CSSProperties

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
      { threshold: 0.2, rootMargin: '0px 0px -8% 0px' },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={rootRef}
      className={`press-signal press-signal--${voice} ${revealed ? 'is-revealed' : ''}`}
      style={style}
      aria-hidden="true"
    >
      <svg className="press-signal__defs" viewBox="0 0 600 280" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <filter id={grainId} x="-2%" y="-2%" width="104%" height="104%">
            <feTurbulence type="fractalNoise" baseFrequency="2.4" numOctaves="2" seed="21" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .48 0" />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
        </defs>
      </svg>

      <span className="press-signal__rule press-signal__rule--lead" aria-hidden="true">
        <svg viewBox="0 0 600 4" preserveAspectRatio="none">
          <g filter={`url(#${grainId})`}>
            <path
              className="press-signal__rule-stroke"
              d="M2 2c40-2 80 2 120 0s80-2 120 0 80 2 120 0 80-2 120 0 80 2 116 0"
              fill="none"
              stroke="currentColor"
              strokeWidth=".55"
              strokeLinecap="round"
              pathLength="100"
            />
          </g>
          <circle cx="2" cy="2" r=".9" fill="currentColor" />
        </svg>
      </span>

      <span className="press-signal__strike" aria-hidden="true">
        <span className="press-signal__strike-flash" />
        <span className="press-signal__strike-disc">
          <svg viewBox="0 0 96 96">
            <g filter={`url(#${grainId})`} opacity=".94">
              <circle cx="48" cy="48" r="44" fill="none" stroke="currentColor" strokeWidth="1" />
              <circle cx="48" cy="48" r="36" fill="none" stroke="currentColor" strokeWidth=".4" strokeDasharray=".8 1.6" opacity=".7" />
              <circle cx="48" cy="48" r="26" fill="none" stroke="currentColor" strokeWidth=".5" opacity=".55" />
              <path
                d="M48 8 L48 16 M48 80 L48 88 M8 48 L16 48 M80 48 L88 48 M18 18 L24 24 M72 72 L78 78 M18 78 L24 72 M72 24 L78 18"
                stroke="currentColor"
                strokeWidth=".55"
                strokeLinecap="round"
                opacity=".7"
              />
              <text
                x="48"
                y="36"
                textAnchor="middle"
                fontFamily="ui-monospace, monospace"
                fontSize="4.6"
                letterSpacing="1.6"
                fill="currentColor"
              >FOLIO · I·</text>
              <text
                x="48"
                y="56"
                textAnchor="middle"
                fontFamily="'Iowan Old Style', Georgia, serif"
                fontStyle="italic"
                fontSize="22"
                fill="currentColor"
              >m³</text>
              <text
                x="48"
                y="70"
                textAnchor="middle"
                fontFamily="ui-monospace, monospace"
                fontSize="4"
                letterSpacing="1.4"
                fill="currentColor"
              >PRESS · ON</text>
            </g>
          </svg>
        </span>
        <span className="press-signal__strike-wisp" />
        <span className="press-signal__strike-splash" aria-hidden="true">
          <svg viewBox="0 0 220 32" preserveAspectRatio="none">
            <g filter={`url(#${grainId})`}>
              <path
                className="press-signal__strike-splash-stroke"
                d="M2 16c14-7 28 4 42-1s28-7 42-1 28 4 42-2 28-7 42-1 28 4 28 0"
                fill="none"
                stroke="currentColor"
                strokeWidth=".7"
                strokeLinecap="round"
                opacity=".6"
                pathLength="100"
              />
            </g>
            <circle cx="2" cy="16" r=".8" fill="currentColor" opacity=".7" />
            <circle cx="218" cy="16" r=".8" fill="currentColor" opacity=".7" />
          </svg>
        </span>
      </span>

      <span className="press-signal__tag" aria-hidden="true">
        <em className="press-signal__tag-line">
          {SEASON_LABEL} <span className="press-signal__tag-sep">·</span> a hand at the lever
        </em>
      </span>

      <span className="press-signal__rule press-signal__rule--trail" aria-hidden="true">
        <svg viewBox="0 0 600 4" preserveAspectRatio="none">
          <g filter={`url(#${grainId})`}>
            <path
              className="press-signal__rule-stroke press-signal__rule-stroke--alt"
              d="M2 2c40-2 80 2 120 0s80-2 120 0 80 2 120 0 80-2 120 0 80 2 116 0"
              fill="none"
              stroke="currentColor"
              strokeWidth=".4"
              strokeLinecap="round"
              opacity=".6"
              pathLength="100"
            />
          </g>
          <circle cx="598" cy="2" r=".7" fill="currentColor" opacity=".7" />
        </svg>
      </span>
    </div>
  )
}
