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
      { threshold: 0.18, rootMargin: '0px 0px -8% 0px' },
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
      <svg className="press-signal__defs" viewBox="0 0 400 240" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <filter id={grainId} x="-2%" y="-2%" width="104%" height="104%">
            <feTurbulence type="fractalNoise" baseFrequency="2.4" numOctaves="2" seed="21" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .48 0" />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
        </defs>
      </svg>

      <span className="press-signal__thread" aria-hidden="true">
        <svg viewBox="0 0 100 200" preserveAspectRatio="none">
          <g filter={`url(#${grainId})`}>
            <path
              className="press-signal__thread-lead"
              d="M50 4 C 50 32, 36 56, 50 80 S 64 124, 50 148 S 36 184, 50 196"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.1"
              strokeLinecap="round"
              pathLength="100"
            />
            <path
              className="press-signal__thread-trail"
              d="M48 12 C 56 38, 40 62, 52 88 S 66 124, 52 148 S 40 180, 54 196"
              fill="none"
              stroke="currentColor"
              strokeWidth=".5"
              strokeLinecap="round"
              opacity=".55"
              pathLength="100"
            />
          </g>
          <circle className="press-signal__thread-bead press-signal__thread-bead--top" cx="50" cy="4" r="1.6" fill="currentColor" />
          <circle className="press-signal__thread-bead press-signal__thread-bead--bot" cx="50" cy="196" r="2.4" fill="currentColor" />
        </svg>
      </span>

      <span className="press-signal__mark" aria-hidden="true">
        <span className="press-signal__mark-halo" />
        <span className="press-signal__mark-disc">
          <svg viewBox="0 0 56 56">
            <g filter={`url(#${grainId})`} opacity=".94">
              <circle cx="28" cy="28" r="24" fill="none" stroke="currentColor" strokeWidth=".9" />
              <circle cx="28" cy="28" r="19" fill="none" stroke="currentColor" strokeWidth=".35" strokeDasharray=".7 1.4" opacity=".7" />
              <text
                x="28"
                y="21"
                textAnchor="middle"
                fontFamily="ui-monospace, monospace"
                fontSize="3.6"
                letterSpacing="1.4"
                fill="currentColor"
              >FOLIO · I·</text>
              <text
                x="28"
                y="34"
                textAnchor="middle"
                fontFamily="'Iowan Old Style', Georgia, serif"
                fontStyle="italic"
                fontSize="13"
                fill="currentColor"
              >m³</text>
              <text
                x="28"
                y="44"
                textAnchor="middle"
                fontFamily="ui-monospace, monospace"
                fontSize="3.2"
                letterSpacing="1.2"
                fill="currentColor"
              >PRESS · ON</text>
            </g>
          </svg>
        </span>
        <span className="press-signal__mark-wisp" aria-hidden="true" />
      </span>

      <span className="press-signal__tag" aria-hidden="true">
        <em className="press-signal__tag-line">
          {SEASON_LABEL} · a hand at the lever
        </em>
      </span>
    </div>
  )
}
