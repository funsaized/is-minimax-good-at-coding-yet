import { useEffect, useId, useRef, useState, type CSSProperties } from 'react'
import type { VoiceId } from './Press'

type PressBreathProps = {
  voice: VoiceId
  active: boolean
}

const VOICE_TONE: Record<VoiceId, string> = {
  quiet: 'var(--blue)',
  human: 'var(--coral)',
  bold: 'var(--acid)',
}

const VOICE_FACE: Record<VoiceId, string> = {
  quiet: 'the press exhales',
  human: 'the press answers',
  bold: 'the press answers',
}

export function PressBreath({ voice, active }: PressBreathProps) {
  const baseId = useId().replace(/:/g, '')
  const ruleGrainId = `press-breath-rule-grain-${baseId}`
  const rootRef = useRef<HTMLDivElement>(null)
  const [revealed, setRevealed] = useState(false)
  const tone = VOICE_TONE[voice]
  const style = { '--press-breath-tone': tone } as CSSProperties

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
      { threshold: 0.18, rootMargin: '0px 0px -6% 0px' },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={rootRef}
      className={`press-breath press-breath--${voice} ${revealed ? 'is-revealed' : ''} ${active ? 'is-active' : ''}`}
      style={style}
      aria-hidden="true"
    >
      <svg className="press-breath__defs" viewBox="0 0 800 40" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <filter id={ruleGrainId} x="-2%" y="-30%" width="104%" height="160%">
            <feTurbulence type="fractalNoise" baseFrequency="2.4" numOctaves="2" seed="29" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .42 0" />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
        </defs>
      </svg>

      <span className="press-breath__rule" aria-hidden="true">
        <svg viewBox="0 0 800 6" preserveAspectRatio="none">
          <g filter={`url(#${ruleGrainId})`}>
            <path
              className="press-breath__rule-stroke press-breath__rule-stroke--lead"
              d="M2 3c30-3 60 3 90 0s60-3 90 0 60 3 90 0 60-3 90 0 60 3 90 0 60-3 90 0 60 3 88 0"
              fill="none"
              stroke="currentColor"
              strokeWidth=".55"
              strokeLinecap="round"
              pathLength="100"
            />
            <path
              className="press-breath__rule-stroke press-breath__rule-stroke--trail"
              d="M40 4c20-2 40 2 60 0s40-2 60 0 40 2 60 0 40-2 60 0 40 2 60 0 40-2 60 0 40 2 60 0 40-2 60 0 20 1 20 1"
              fill="none"
              stroke="currentColor"
              strokeWidth=".3"
              strokeLinecap="round"
              opacity=".5"
              pathLength="100"
            />
          </g>
          <circle className="press-breath__rule-bead press-breath__rule-bead--lead" cx="2" cy="3" r=".95" fill="currentColor" />
          <circle className="press-breath__rule-bead press-breath__rule-bead--trail" cx="798" cy="3" r="1.4" fill="currentColor" />
          <circle className="press-breath__rule-halo" cx="798" cy="3" r="5" fill="none" stroke="currentColor" strokeWidth=".3" strokeDasharray=".8 1.6" />
        </svg>
      </span>

      <span className="press-breath__mark" aria-hidden="true">
        <span className="press-breath__mark-rule" />
        <em className="press-breath__mark-line">{VOICE_FACE[voice]}</em>
        <span className="press-breath__mark-bead" />
        <span className="press-breath__mark-rule press-breath__mark-rule--alt" />
      </span>
    </div>
  )
}