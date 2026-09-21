import { useEffect, useId, useRef, useState } from 'react'
import type { VoiceId } from './Press'

type OpeningLedeProps = {
  voice: VoiceId
  setToday: string
}

const VOICE_META: Record<VoiceId, { letter: string; name: string }> = {
  quiet: { letter: 'A', name: 'quiet cut' },
  human: { letter: 'B', name: 'human hand' },
  bold: { letter: 'C', name: 'bold signal' },
}

const MOTTO = 'one page, set three ways; the question stays open until the reader asks for the answer.'

function LedeMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="lede__mark">
      <path
        d="M12 3l1.6 4.4 4.6.4-3.5 3 1 4.5-3.7-2.4-3.7 2.4 1-4.5-3.5-3 4.6-.4z"
        fill="none"
        stroke="currentColor"
        strokeWidth=".9"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function OpeningLede({ voice, setToday }: OpeningLedeProps) {
  const ref = useRef<HTMLElement>(null)
  const [revealed, setRevealed] = useState(false)
  const baseId = useId().replace(/:/g, '')
  const grainId = `lede-grain-${baseId}`

  useEffect(() => {
    const node = ref.current
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
      { threshold: 0.2, rootMargin: '0px 0px -6% 0px' },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  const meta = VOICE_META[voice]

  return (
    <aside
      ref={ref}
      className={`lede lede--voice-${voice} ${revealed ? 'is-revealed' : ''}`}
      aria-label="The page's opening lede"
    >
      <svg className="lede__defs" aria-hidden="true">
        <defs>
          <filter id={grainId} x="-2%" y="-50%" width="104%" height="200%">
            <feTurbulence type="fractalNoise" baseFrequency="2.4" numOctaves="2" seed="13" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .42 0" />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
        </defs>
      </svg>

      <span className="lede__plate-mark lede__plate-mark--lead" aria-hidden="true">
        <LedeMark />
      </span>

      <p className="lede__copy">
        <span className="lede__copy-soft">A folio of</span>{' '}
        <em className="lede__copy-em">{MOTTO}</em>
      </p>

      <span className="lede__rule" aria-hidden="true">
        <svg viewBox="0 0 200 6" preserveAspectRatio="none">
          <g filter={`url(#${grainId})`}>
            <path
              className="lede__rule-stroke"
              d="M2 3c16-2 32 2 48 0s32-2 48 0 32 2 48 0 32-2 50 0"
              fill="none"
              stroke="currentColor"
              strokeWidth=".55"
              strokeLinecap="round"
              pathLength="100"
            />
          </g>
          <circle cx="2" cy="3" r=".9" fill="currentColor" />
          <circle cx="198" cy="3" r=".9" fill="currentColor" />
        </svg>
      </span>

      <span className="lede__meta">
        <span className="lede__meta-key">read with</span>
        <span className="lede__meta-voice">
          <span className="lede__meta-letter" aria-hidden="true">{meta.letter}</span>
          <em>{meta.name}</em>
        </span>
        <span className="lede__meta-rule" aria-hidden="true" />
        <span className="lede__meta-date">set today · <em>{setToday}</em></span>
      </span>

      <span className="lede__plate-mark lede__plate-mark--trail" aria-hidden="true">
        <LedeMark />
      </span>
    </aside>
  )
}
