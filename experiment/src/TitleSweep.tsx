import { useId } from 'react'
import type { CSSProperties } from 'react'
import type { VoiceId } from './Press'

type TitleSweepProps = {
  voice: VoiceId
  setToday: string
}

const VOICE_TONE: Record<VoiceId, string> = {
  quiet: 'var(--blue)',
  human: 'var(--coral)',
  bold: 'var(--acid)',
}

export function TitleSweep({ voice, setToday }: TitleSweepProps) {
  const baseId = useId().replace(/:/g, '')
  const style = { '--signature-tone': VOICE_TONE[voice] } as CSSProperties
  return (
    <figure className="press-signature" aria-hidden="true" style={style}>
      <svg
        className="press-signature__sweep"
        viewBox="0 0 720 56"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id={`sig-${baseId}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
            <stop offset="14%" stopColor="currentColor" stopOpacity=".55" />
            <stop offset="50%" stopColor="currentColor" stopOpacity=".95" />
            <stop offset="86%" stopColor="currentColor" stopOpacity=".55" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
          <filter id={`sig-grain-${baseId}`} x="-2%" y="-50%" width="104%" height="200%">
            <feTurbulence type="fractalNoise" baseFrequency="2.6" numOctaves="2" seed="7" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .55 0" />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
        </defs>

        <g filter={`url(#sig-grain-${baseId})`}>
          <path
            d="M2 36 C 80 18, 160 56, 240 30 S 400 8, 480 38 S 640 56, 716 24"
            fill="none"
            stroke={`url(#sig-${baseId})`}
            strokeWidth="1.3"
            strokeLinecap="round"
            pathLength="100"
            strokeDasharray="100 100"
            strokeDashoffset="100"
            className="press-signature__stroke"
          />
        </g>

        <circle cx="4" cy="36" r="1.6" fill="currentColor" className="press-signature__bead press-signature__bead--start" />
        <circle cx="716" cy="24" r="1.6" fill="currentColor" className="press-signature__bead press-signature__bead--end" />
        <circle cx="358" cy="22" r="2.6" fill="currentColor" className="press-signature__knot" />
        <circle cx="358" cy="22" r="6.5" fill="none" stroke="currentColor" strokeWidth="0.4" strokeDasharray="0.8 1.8" opacity="0.55" className="press-signature__knot-ring" />
      </svg>
      <figcaption className="press-signature__caption">
        <span className="press-signature__caption-rule" aria-hidden="true" />
        <span className="press-signature__caption-text">
          <em>composed by hand</em>
          <span className="press-signature__caption-sep" aria-hidden="true">·</span>
          <em>{setToday}</em>
        </span>
        <span className="press-signature__caption-rule" aria-hidden="true" />
      </figcaption>
    </figure>
  )
}
