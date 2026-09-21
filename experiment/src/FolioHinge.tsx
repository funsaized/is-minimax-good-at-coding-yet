import { useEffect, useId, useRef, useState, type CSSProperties } from 'react'
import type { VoiceId } from './Press'

type FolioHingeProps = {
  voice: VoiceId
  setToday: string
}

const VOICE_TONE: Record<VoiceId, string> = {
  quiet: 'var(--blue)',
  human: 'var(--coral)',
  bold: 'var(--acid)',
}

const VOICE_LETTER: Record<VoiceId, string> = { quiet: 'A', human: 'B', bold: 'C' }
const VOICE_NAME: Record<VoiceId, string> = {
  quiet: 'quiet cut',
  human: 'human hand',
  bold: 'bold signal',
}

const SEASON = (() => {
  const month = new Date().getMonth()
  if (month <= 1 || month === 11) return 'winter'
  if (month <= 4) return 'spring'
  if (month <= 7) return 'summer'
  return 'autumn'
})()

export function FolioHinge({ voice, setToday }: FolioHingeProps) {
  const baseId = useId().replace(/:/g, '')
  const ruleId = `folio-hinge-rule-${baseId}`
  const grainId = `folio-hinge-grain-${baseId}`
  const sealId = `folio-hinge-seal-${baseId}`
  const rootRef = useRef<HTMLDivElement>(null)
  const [revealed, setRevealed] = useState(false)

  const tone = VOICE_TONE[voice]
  const style = {
    '--folio-hinge-tone': tone,
    '--folio-hinge-rule': `url(#${ruleId})`,
  } as CSSProperties

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
      { threshold: 0.18, rootMargin: '0px 0px -6% 0px' },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  const fold = () => {
    const target = document.getElementById('press')
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div
      ref={rootRef}
      className={`folio-hinge folio-hinge--${voice} ${revealed ? 'is-revealed' : ''}`}
      style={style}
      aria-label={`The fold between folio i and folio ii · the page turns once · set in ${VOICE_NAME[voice]} · ${SEASON} · set on ${setToday}.`}
    >
      <svg className="folio-hinge__defs" viewBox="0 0 1000 240" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id={ruleId} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
            <stop offset="14%" stopColor="currentColor" stopOpacity=".5" />
            <stop offset="50%" stopColor="currentColor" stopOpacity=".85" />
            <stop offset="86%" stopColor="currentColor" stopOpacity=".5" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
          <filter id={grainId} x="-2%" y="-50%" width="104%" height="200%">
            <feTurbulence type="fractalNoise" baseFrequency="2.4" numOctaves="2" seed="37" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .42 0" />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
          <filter id={sealId} x="-12%" y="-12%" width="124%" height="124%">
            <feTurbulence type="fractalNoise" baseFrequency="2.6" numOctaves="2" seed="43" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .5 0" />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
        </defs>
      </svg>

      <button
        type="button"
        className="folio-hinge__plate"
        onClick={fold}
        aria-label={`Fold the page · turn to folio ii · the press bed · set in ${VOICE_NAME[voice]}`}
      >
        <span className="folio-hinge__corner folio-hinge__corner--tl" aria-hidden="true" />
        <span className="folio-hinge__corner folio-hinge__corner--tr" aria-hidden="true" />
        <span className="folio-hinge__corner folio-hinge__corner--bl" aria-hidden="true" />
        <span className="folio-hinge__corner folio-hinge__corner--br" aria-hidden="true" />

        <span className="folio-hinge__eyebrow" aria-hidden="true">
          <span className="folio-hinge__eyebrow-rule" />
          <span className="folio-hinge__eyebrow-tag">
            <span className="folio-hinge__eyebrow-dot" />
            folio <em>i</em> ends
            <span className="folio-hinge__eyebrow-sep">·</span>
            the page folds once
            <span className="folio-hinge__eyebrow-dot" />
          </span>
          <span className="folio-hinge__eyebrow-rule folio-hinge__eyebrow-rule--alt" />
        </span>

        <span className="folio-hinge__seam">
          <svg className="folio-hinge__rule folio-hinge__rule--lead" viewBox="0 0 480 6" preserveAspectRatio="none" aria-hidden="true">
            <g filter={`url(#${grainId})`}>
              <path
                className="folio-hinge__rule-stroke"
                d="M2 3c40-2 80 2 120 0s80-2 120 0 80 2 120 0 76-2 116 0"
                fill="none"
                stroke={`url(#${ruleId})`}
                strokeWidth=".9"
                strokeLinecap="round"
                pathLength="100"
              />
            </g>
            <circle cx="478" cy="3" r="1.1" fill="currentColor" />
          </svg>

          <span className="folio-hinge__seal" aria-hidden="true">
            <svg viewBox="0 0 64 64">
              <g filter={`url(#${sealId})`} opacity=".95">
                <circle cx="32" cy="32" r="26" fill="none" stroke="currentColor" strokeWidth="1" />
                <circle cx="32" cy="32" r="20" fill="none" stroke="currentColor" strokeWidth=".4" strokeDasharray="1 1.6" opacity=".65" />
                <text x="32" y="22" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="3.6" letterSpacing="1.6" fill="currentColor">FOLIO · ii</text>
                <text x="32" y="38" textAnchor="middle" fontFamily="Georgia, serif" fontStyle="italic" fontSize="13" fill="currentColor">m³</text>
                <text x="32" y="48" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="3.2" letterSpacing="1.4" fill="currentColor">PRESS · BED</text>
              </g>
            </svg>
            <span className="folio-hinge__seal-wax" aria-hidden="true">
              <span className="folio-hinge__seal-wax-bead" />
              <span className="folio-hinge__seal-wax-wisp" />
            </span>
          </span>

          <svg className="folio-hinge__rule folio-hinge__rule--trail" viewBox="0 0 480 6" preserveAspectRatio="none" aria-hidden="true">
            <g filter={`url(#${grainId})`}>
              <path
                className="folio-hinge__rule-stroke folio-hinge__rule-stroke--alt"
                d="M2 3c40-2 80 2 120 0s80-2 120 0 80 2 120 0 76-2 116 0"
                fill="none"
                stroke={`url(#${ruleId})`}
                strokeWidth=".9"
                strokeLinecap="round"
                pathLength="100"
              />
            </g>
            <circle cx="2" cy="3" r="1.1" fill="currentColor" />
          </svg>
        </span>

        <p className="folio-hinge__caption">
          <span className="folio-hinge__caption-mark" aria-hidden="true">¶</span>
          folio <em>ii</em> begins · turn · <em>the press bed</em>
          <span className="folio-hinge__caption-mark folio-hinge__caption-mark--alt" aria-hidden="true">¶</span>
        </p>

        <span className="folio-hinge__hint" aria-hidden="true">
          <span className="folio-hinge__hint-rule" />
          one fold · one breath · {VOICE_LETTER[voice]} · {setToday}
          <span className="folio-hinge__hint-rule folio-hinge__hint-rule--alt" />
        </span>

        <span className="folio-hinge__arrow" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path
              d="M5 12h13M12 5l7 7-7 7"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>
    </div>
  )
}
