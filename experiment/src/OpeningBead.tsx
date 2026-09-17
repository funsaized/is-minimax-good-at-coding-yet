import { useEffect, useId, useRef, useState, type CSSProperties } from 'react'
import type { VoiceId } from './Press'

type OpeningBeadProps = {
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

const INSCRIPTION: Record<VoiceId, string> = {
  quiet: 'the page, opened',
  human: 'the page, given breath',
  bold: 'the page, set down',
}

export function OpeningBead({ voice, setToday }: OpeningBeadProps) {
  const baseId = useId().replace(/:/g, '')
  const grainId = `opening-bead-grain-${baseId}`
  const rootRef = useRef<HTMLElement>(null)
  const [revealed, setRevealed] = useState(false)
  const tone = VOICE_TONE[voice]
  const style = {
    '--opening-bead-tone': tone,
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
      { threshold: 0.2, rootMargin: '0px 0px -6% 0px' },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <aside
      ref={rootRef}
      className={`opening-bead opening-bead--${voice} ${revealed ? 'is-revealed' : ''}`}
      style={style}
      aria-label={`The opening bead · a single considered gesture between the masthead and the headline · set today ${setToday} · in the ${VOICE_NAME[voice]} voice.`}
    >
      <svg className="opening-bead__defs" viewBox="0 0 800 12" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <filter id={grainId} x="-2%" y="-50%" width="104%" height="200%">
            <feTurbulence type="fractalNoise" baseFrequency="2.4" numOctaves="2" seed="151" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .42 0" />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
        </defs>
      </svg>

      <span className="opening-bead__rule opening-bead__rule--lead" aria-hidden="true">
        <svg viewBox="0 0 360 6" preserveAspectRatio="none">
          <g filter={`url(#${grainId})`}>
            <path
              className="opening-bead__rule-stroke opening-bead__rule-stroke--lead"
              d="M2 3c22-3 44 3 66 0s44-3 66 0 44 3 66 0 44-3 66 0 44 3 48 0"
              fill="none"
              stroke="currentColor"
              strokeWidth=".65"
              strokeLinecap="round"
              pathLength="100"
              strokeDasharray="100 100"
            />
          </g>
          <circle className="opening-bead__rule-bead" cx="2" cy="3" r="1.1" fill="currentColor" />
        </svg>
      </span>

      <span className="opening-bead__bead" aria-hidden="true">
        <svg viewBox="0 0 28 28" className="opening-bead__bead-svg">
          <g filter={`url(#${grainId})`}>
            <circle cx="14" cy="14" r="11.5" fill="none" stroke="currentColor" strokeWidth=".55" />
            <circle cx="14" cy="14" r="6.5" fill="none" stroke="currentColor" strokeWidth=".32" strokeDasharray=".5 1.1" opacity=".7" />
            <circle cx="14" cy="14" r="2.2" fill="currentColor" />
            <text
              x="14"
              y="17.4"
              textAnchor="middle"
              fontFamily="ui-monospace, monospace"
              fontSize="4.4"
              letter-spacing=".06em"
              fill="currentColor"
              opacity=".78"
            >{VOICE_LETTER[voice]}</text>
          </g>
        </svg>
      </span>

      <span className="opening-bead__copy" aria-hidden="true">
        <em className="opening-bead__copy-line">{INSCRIPTION[voice]}</em>
      </span>

      <span className="opening-bead__rule opening-bead__rule--trail" aria-hidden="true">
        <svg viewBox="0 0 360 6" preserveAspectRatio="none">
          <g filter={`url(#${grainId})`}>
            <path
              className="opening-bead__rule-stroke opening-bead__rule-stroke--trail"
              d="M2 3c22-3 44 3 66 0s44-3 66 0 44 3 66 0 44-3 66 0 44 3 48 0"
              fill="none"
              stroke="currentColor"
              strokeWidth=".65"
              strokeLinecap="round"
              pathLength="100"
              strokeDasharray="100 100"
            />
          </g>
          <circle className="opening-bead__rule-bead opening-bead__rule-bead--end" cx="358" cy="3" r="1.1" fill="currentColor" />
        </svg>
      </span>
    </aside>
  )
}
