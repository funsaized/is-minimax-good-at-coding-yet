import { useEffect, useId, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import type { VoiceId } from './Press'

type FirstReadingProps = {
  voice: VoiceId
  setToday: string
}

const VOICE_TONE: Record<VoiceId, string> = {
  quiet: 'var(--blue)',
  human: 'var(--coral)',
  bold: 'var(--acid)',
}

const READINGS = [
  'read it once with the eye',
  'then again with the ear',
]

export function FirstReading({ voice, setToday }: FirstReadingProps) {
  const baseId = useId().replace(/:/g, '')
  const ruleId = `first-reading-rule-${baseId}`
  const grainId = `first-reading-grain-${baseId}`
  const nodeRef = useRef<HTMLDivElement>(null)
  const [revealed, setRevealed] = useState(false)
  const tone = VOICE_TONE[voice]
  const style = { '--first-reading-tone': tone } as CSSProperties

  useEffect(() => {
    const node = nodeRef.current
    if (!node) return
    if (!('IntersectionObserver' in window)) {
      setRevealed(true)
      return
    }
    const observer = new IntersectionObserver(
      entries => {
        const visible = entries.some(entry => entry.isIntersecting)
        if (visible) {
          setRevealed(true)
          observer.disconnect()
        }
      },
      { threshold: 0.32, rootMargin: '0px 0px -6% 0px' },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={nodeRef}
      className={`first-reading first-reading--${voice} ${revealed ? 'is-revealed' : ''}`}
      style={style}
      aria-label="A reading instruction, set between the title and the colophon"
    >
      <span className="first-reading__crop first-reading__crop--tl" aria-hidden="true" />
      <span className="first-reading__crop first-reading__crop--tr" aria-hidden="true" />

      <svg
        className="first-reading__rule"
        viewBox="0 0 1200 14"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={ruleId} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
            <stop offset="6%" stopColor="currentColor" stopOpacity=".55" />
            <stop offset="48%" stopColor="currentColor" stopOpacity=".85" />
            <stop offset="52%" stopColor="currentColor" stopOpacity=".85" />
            <stop offset="94%" stopColor="currentColor" stopOpacity=".55" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
          <filter id={grainId} x="-2%" y="-50%" width="104%" height="200%">
            <feTurbulence type="fractalNoise" baseFrequency="2.4" numOctaves="2" seed="13" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .4 0" />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
        </defs>
        <g filter={`url(#${grainId})`}>
          <path
            className="first-reading__rule-stroke"
            d="M2 7 L1198 7"
            fill="none"
            stroke={`url(#${ruleId})`}
            strokeWidth=".9"
            strokeLinecap="round"
            pathLength="100"
          />
        </g>
        <circle className="first-reading__rule-bead" cx="2" cy="7" r="1.2" fill="currentColor" />
        <circle className="first-reading__rule-bead first-reading__rule-bead--end" cx="1198" cy="7" r="1.2" fill="currentColor" />
      </svg>

      <span className="first-reading__inscription">
        <span className="first-reading__inscription-mark first-reading__inscription-mark--lead" aria-hidden="true">
          <svg viewBox="0 0 16 16">
            <circle cx="8" cy="8" r="6.2" fill="none" stroke="currentColor" strokeWidth=".4" />
            <circle cx="8" cy="8" r="1.4" fill="currentColor" />
          </svg>
        </span>
        <span className="first-reading__inscription-body">
          <span className="first-reading__inscription-line">
            <em className="first-reading__inscription-em">{READINGS[0]}</em>
            <span className="first-reading__inscription-comma" aria-hidden="true">·</span>
          </span>
          <span className="first-reading__inscription-line first-reading__inscription-line--alt">
            <em className="first-reading__inscription-em first-reading__inscription-em--alt">{READINGS[1]}</em>
          </span>
        </span>
        <span className="first-reading__inscription-mark first-reading__inscription-mark--trail" aria-hidden="true">
          <svg viewBox="0 0 16 16">
            <circle cx="8" cy="8" r="6.2" fill="none" stroke="currentColor" strokeWidth=".4" />
            <path d="M5 8h6M8 5v6" stroke="currentColor" strokeWidth=".4" strokeLinecap="round" />
          </svg>
        </span>
      </span>

      <span className="first-reading__sign" aria-hidden="true">
        <svg viewBox="0 0 120 18" preserveAspectRatio="none" className="first-reading__sign-svg">
          <path
            className="first-reading__sign-stroke"
            d="M2 12c12-8 26 4 42-1s28-7 44-1 26 5 42-2 26-7 42-1 24 5 46-1"
            fill="none"
            stroke="currentColor"
            strokeWidth=".85"
            strokeLinecap="round"
            pathLength="100"
          />
          <circle className="first-reading__sign-bead" cx="116" cy="9" r="1.4" fill="currentColor" />
        </svg>
        <span className="first-reading__sign-tag">
          <span className="first-reading__sign-tag-dot" aria-hidden="true" />
          a small reading rule <em aria-hidden="true">·</em> set on {setToday}
        </span>
      </span>
    </div>
  )
}
