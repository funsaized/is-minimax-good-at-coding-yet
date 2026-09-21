import { useEffect, useId, useRef, useState, type CSSProperties } from 'react'
import type { VoiceId } from './Press'

type ReadingHingeProps = {
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

export function ReadingHinge({ voice, setToday }: ReadingHingeProps) {
  const baseId = useId().replace(/:/g, '')
  const grainId = `reading-hinge-grain-${baseId}`
  const rootRef = useRef<HTMLDivElement>(null)
  const [revealed, setRevealed] = useState(false)
  const tone = VOICE_TONE[voice]
  const style = {
    '--reading-hinge-tone': tone,
    '--reading-hinge-grain': `url(#${grainId})`,
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
      { threshold: 0.32, rootMargin: '0px 0px -8% 0px' },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={rootRef}
      className={`reading-hinge reading-hinge--${voice} ${revealed ? 'is-revealed' : ''}`}
      style={style}
      aria-label={`The reading hinge · a single line between the headline and the page's instructions · set in ${VOICE_NAME[voice]} · ${setToday}.`}
    >
      <svg className="reading-hinge__defs" viewBox="0 0 600 40" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <filter id={grainId} x="-2%" y="-50%" width="104%" height="200%">
            <feTurbulence type="fractalNoise" baseFrequency="2.4" numOctaves="2" seed="53" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .42 0" />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
        </defs>
      </svg>

      <span className="reading-hinge__rule reading-hinge__rule--lead" aria-hidden="true">
        <svg viewBox="0 0 320 6" preserveAspectRatio="none">
          <g filter={`url(#${grainId})`}>
            <path
              className="reading-hinge__rule-stroke"
              d="M2 3c16-3 32 3 48 0s32-3 48 0 32 3 48 0 32-3 48 0 32 3 48 0 32-3 32 0"
              fill="none"
              stroke="currentColor"
              strokeWidth=".55"
              strokeLinecap="round"
              pathLength="100"
            />
          </g>
          <circle className="reading-hinge__rule-bead" cx="2" cy="3" r="1" fill="currentColor" />
          <circle className="reading-hinge__rule-bead reading-hinge__rule-bead--end" cx="318" cy="3" r=".9" fill="currentColor" opacity=".55" />
        </svg>
      </span>

      <p className="reading-hinge__copy">
        <span className="reading-hinge__copy-mark" aria-hidden="true">¶</span>
        <em className="reading-hinge__copy-line">
          the question is set; the page asks for <em className="reading-hinge__copy-em">two readings</em>
        </em>
        <span className="reading-hinge__copy-mark reading-hinge__copy-mark--alt" aria-hidden="true">¶</span>
      </p>

      <span className="reading-hinge__flourish" aria-hidden="true">
        <svg viewBox="0 0 120 14" preserveAspectRatio="xMidYMid meet">
          <g filter={`url(#${grainId})`}>
            <path
              className="reading-hinge__flourish-stroke"
              d="M2 8c10-6 22 4 34-1s22-6 34-1 22 4 34-1 14-2 14 0"
              fill="none"
              stroke="currentColor"
              strokeWidth=".7"
              strokeLinecap="round"
              pathLength="100"
            />
          </g>
          <circle className="reading-hinge__flourish-bead" cx="116" cy="6" r="1.2" fill="currentColor" />
          <circle className="reading-hinge__flourish-halo" cx="116" cy="6" r="3" fill="none" stroke="currentColor" strokeWidth=".3" strokeDasharray=".6 1.2" opacity=".55" />
        </svg>
        <span className="reading-hinge__flourish-tag">
          <span className="reading-hinge__flourish-tag-mark" aria-hidden="true" />
          <em>a hand between the question and the page</em>
        </span>
      </span>

      <span className="reading-hinge__wax" aria-hidden="true">
        <span className="reading-hinge__wax-bead" />
        <span className="reading-hinge__wax-wisp" />
      </span>
    </div>
  )
}
