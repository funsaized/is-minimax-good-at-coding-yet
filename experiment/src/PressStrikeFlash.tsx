import { type CSSProperties } from 'react'
import type { VoiceId } from './Press'

type PressStrikeFlashProps = {
  strikeTick: number
  voice: VoiceId
}

const TONE: Record<VoiceId, string> = {
  quiet: 'rgba(155, 188, 255, .35)',
  human: 'rgba(255, 118, 95, .35)',
  bold: 'rgba(216, 255, 106, .4)',
}

export function PressStrikeFlash({ strikeTick, voice }: PressStrikeFlashProps) {
  if (strikeTick === 0) return null
  const style = { '--strike-color': TONE[voice] } as CSSProperties
  return (
    <span key={`strike-${strikeTick}`} className="press-strike" aria-hidden="true" style={style}>
      <svg className="press-strike__line" viewBox="0 0 200 60" preserveAspectRatio="none" aria-hidden="true">
        <path
          className="press-strike__line-path"
          d="M2 30c20-2 40 4 60 0s40-6 60-1 40 5 76-2"
          pathLength="100"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
      </svg>
      <span className="press-strike__ring" />
      <span className="press-strike__spark" />
    </span>
  )
}