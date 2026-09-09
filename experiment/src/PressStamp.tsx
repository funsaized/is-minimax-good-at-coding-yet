type VoiceId = 'quiet' | 'human' | 'bold'

type PressStampProps = {
  voice: VoiceId
  size?: number
  className?: string
}

const STAMP_LABELS: Record<VoiceId, { top: string; bottom: string; center: string; centerSize: number }> = {
  quiet: { top: 'PRESS · SET', bottom: 'FOLIO · TODAY', center: 'm³', centerSize: 24 },
  human: { top: 'SET BY HAND', bottom: 'FOR NOW', center: 'm³', centerSize: 26 },
  bold: { top: 'M³ · M³ · M³', bottom: 'OPUS', center: 'M³', centerSize: 22 },
}

export function PressStamp({ voice, size = 96, className = '' }: PressStampProps) {
  const labels = STAMP_LABELS[voice]
  const filterId = `press-stamp-grain-${voice}`
  return (
    <svg
      className={`press-stamp press-stamp--${voice} ${className}`}
      width={size}
      height={size}
      viewBox="0 0 100 100"
      aria-hidden="true"
    >
      <defs>
        <filter id={filterId} x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="1.8" numOctaves="2" seed="3" stitchTiles="stitch" />
          <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .55 0" />
          <feComposite in2="SourceGraphic" operator="in" />
        </filter>
      </defs>
      <g filter={`url(#${filterId})`} opacity="0.92">
        <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="1.1" />
        <circle cx="50" cy="50" r="39" fill="none" stroke="currentColor" strokeWidth=".4" strokeDasharray="1 2" />
        <text
          x="50" y="20"
          textAnchor="middle"
          fontFamily="ui-monospace, monospace"
          fontSize="4.6" letterSpacing="2.4"
          fill="currentColor"
        >{labels.top}</text>
        <text
          x="50" y="58"
          textAnchor="middle"
          fontFamily="Georgia, serif"
          fontStyle="italic"
          fontSize={labels.centerSize}
          fill="currentColor"
        >{labels.center}</text>
        <text
          x="50" y="86"
          textAnchor="middle"
          fontFamily="ui-monospace, monospace"
          fontSize="4.6" letterSpacing="2.4"
          fill="currentColor"
        >{labels.bottom}</text>
      </g>
    </svg>
  )
}
