import { useEffect, useId, useRef, useState, type CSSProperties } from 'react'
import type { VoiceId } from './Press'

type FirstImpressionProps = {
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
  quiet: 'set quietly, before the line was set',
  human: 'set by hand, in a single breath',
  bold: 'set first, in the loudest honest voice',
}

export function FirstImpression({ voice, setToday }: FirstImpressionProps) {
  const baseId = useId().replace(/:/g, '')
  const grainId = `first-impression-grain-${baseId}`
  const sealGrainId = `first-impression-seal-grain-${baseId}`
  const haloId = `first-impression-halo-${baseId}`
  const ruleId = `first-impression-rule-${baseId}`
  const rootRef = useRef<HTMLElement>(null)
  const [revealed, setRevealed] = useState(false)
  const [tick, setTick] = useState(0)
  const tone = VOICE_TONE[voice]
  const style = {
    '--first-impression-tone': tone,
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
      { threshold: 0.18, rootMargin: '0px 0px -6% 0px' },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    setTick(value => value + 1)
  }, [voice])

  return (
    <aside
      ref={rootRef}
      className={`first-impression first-impression--${voice} ${revealed ? 'is-revealed' : ''}`}
      style={style}
      aria-label={`The first impression · the page's own mark · set in ${VOICE_NAME[voice]} · set today ${setToday}`}
    >
      <svg className="first-impression__defs" viewBox="0 0 800 220" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <filter id={grainId} x="-2%" y="-50%" width="104%" height="200%">
            <feTurbulence type="fractalNoise" baseFrequency="2.4" numOctaves="2" seed="151" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .42 0" />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
          <filter id={sealGrainId} x="-12%" y="-12%" width="124%" height="124%">
            <feTurbulence type="fractalNoise" baseFrequency="2.6" numOctaves="2" seed="167" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .5 0" />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
          <radialGradient id={haloId} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="currentColor" stopOpacity=".32" />
            <stop offset="58%" stopColor="currentColor" stopOpacity=".1" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </radialGradient>
          <linearGradient id={ruleId} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
            <stop offset="14%" stopColor="currentColor" stopOpacity=".5" />
            <stop offset="50%" stopColor="currentColor" stopOpacity=".78" />
            <stop offset="86%" stopColor="currentColor" stopOpacity=".5" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      <span className="first-impression__halo" aria-hidden="true">
        <svg viewBox="0 0 800 220" preserveAspectRatio="none">
          <ellipse cx="400" cy="110" rx="380" ry="98" fill={`url(#${haloId})`} />
        </svg>
      </span>

      <span className="first-impression__rule first-impression__rule--lead" aria-hidden="true">
        <svg viewBox="0 0 240 6" preserveAspectRatio="none">
          <g filter={`url(#${grainId})`}>
            <path
              className="first-impression__rule-stroke first-impression__rule-stroke--lead"
              d="M2 3c18-3 36 3 54 0s36-3 54 0 36 3 54 0 36-3 54 0 36 3 14 0"
              fill="none"
              stroke={`url(#${ruleId})`}
              strokeWidth=".7"
              strokeLinecap="round"
              pathLength="100"
              strokeDasharray="100 100"
            />
          </g>
          <circle cx="2" cy="3" r="1.1" fill="currentColor" />
        </svg>
      </span>

      <span className="first-impression__seal" aria-hidden="true" key={`seal-${tick}`}>
        <span className="first-impression__seal-shadow" />
        <span className="first-impression__seal-disc">
          <svg viewBox="0 0 96 96">
            <g filter={`url(#${sealGrainId})`} opacity=".96">
              <circle cx="48" cy="48" r="42" fill="none" stroke="currentColor" strokeWidth="1.1" />
              <circle cx="48" cy="48" r="35" fill="none" stroke="currentColor" strokeWidth=".4" strokeDasharray=".9 1.8" opacity=".7" />
              <circle cx="48" cy="48" r="26" fill="none" stroke="currentColor" strokeWidth=".32" opacity=".45" />
              <path d="M48 14 L48 22 M48 74 L48 82 M14 48 L22 48 M74 48 L82 48" stroke="currentColor" strokeWidth=".55" strokeLinecap="round" opacity=".65" />
              <text
                x="48"
                y="44"
                textAnchor="middle"
                fontFamily="ui-monospace, monospace"
                fontSize="5"
                letterSpacing="2"
                fill="currentColor"
                opacity=".82"
              >{VOICE_LETTER[voice]}</text>
              <text
                x="48"
                y="58"
                textAnchor="middle"
                fontFamily="'Iowan Old Style', 'Palatino Linotype', Georgia, serif"
                fontStyle="italic"
                fontSize="22"
                letterSpacing="-.02em"
                fill="currentColor"
              >m³</text>
              <text
                x="48"
                y="72"
                textAnchor="middle"
                fontFamily="ui-monospace, monospace"
                fontSize="4"
                letterSpacing="1.6"
                fill="currentColor"
                opacity=".78"
              >FIRST · IMPRESSION</text>
            </g>
          </svg>
        </span>
        <span className="first-impression__seal-wax" aria-hidden="true">
          <span className="first-impression__seal-wax-bead" />
          <span className="first-impression__seal-wax-wisp" />
        </span>
      </span>

      <span className="first-impression__copy" aria-hidden="true">
        <span className="first-impression__copy-mark">¶</span>
        <em className="first-impression__copy-line">{INSCRIPTION[voice]}</em>
        <span className="first-impression__copy-mark first-impression__copy-mark--alt">¶</span>
      </span>

      <span className="first-impression__signature" aria-hidden="true">
        <svg viewBox="0 0 240 32" preserveAspectRatio="xMidYMid meet">
          <g filter={`url(#${grainId})`}>
            <path
              className="first-impression__signature-stroke first-impression__signature-stroke--lead"
              d="M4 20c12-10 26 6 48-2s26-10 48-2 26 6 48-2 26-8 48-1 26 4 36-1"
              fill="none"
              stroke="currentColor"
              strokeWidth=".95"
              strokeLinecap="round"
              pathLength="100"
            />
            <path
              className="first-impression__signature-stroke first-impression__signature-stroke--trail"
              d="M14 26c10-4 20 4 36-1s26-4 38 0 26 4 38-1 26-4 32-1 18 4 24-1 16-2 18-2"
              fill="none"
              stroke="currentColor"
              strokeWidth=".5"
              strokeLinecap="round"
              opacity=".55"
              pathLength="100"
            />
          </g>
          <circle className="first-impression__signature-bead" cx="234" cy="16" r="1.6" fill="currentColor" />
          <circle className="first-impression__signature-halo" cx="234" cy="16" r="4" fill="none" stroke="currentColor" strokeWidth=".3" strokeDasharray=".6 1.4" opacity=".6" />
        </svg>
        <span className="first-impression__signature-tag">
          <span className="first-impression__signature-tag-mark" />
          <em>pressed first, before the line was set</em>
        </span>
      </span>

      <span className="first-impression__rule first-impression__rule--trail" aria-hidden="true">
        <svg viewBox="0 0 240 6" preserveAspectRatio="none">
          <g filter={`url(#${grainId})`}>
            <path
              className="first-impression__rule-stroke first-impression__rule-stroke--trail"
              d="M2 3c18-3 36 3 54 0s36-3 54 0 36 3 54 0 36-3 54 0 36 3 14 0"
              fill="none"
              stroke={`url(#${ruleId})`}
              strokeWidth=".7"
              strokeLinecap="round"
              pathLength="100"
              strokeDasharray="100 100"
            />
          </g>
          <circle cx="238" cy="3" r="1.1" fill="currentColor" />
        </svg>
      </span>

      <span className="first-impression__corner first-impression__corner--tl" aria-hidden="true" />
      <span className="first-impression__corner first-impression__corner--tr" aria-hidden="true" />
      <span className="first-impression__corner first-impression__corner--bl" aria-hidden="true" />
      <span className="first-impression__corner first-impression__corner--br" aria-hidden="true" />

      <span className="sr-only" aria-live="polite">
        {`First impression set in ${VOICE_NAME[voice]}. Set today ${setToday}.`}
      </span>
    </aside>
  )
}