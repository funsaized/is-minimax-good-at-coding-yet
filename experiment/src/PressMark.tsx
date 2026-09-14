import { type CSSProperties } from 'react'
import type { VoiceId } from './Press'

type PressMarkProps = {
  voice: VoiceId
  setToday: string
  className?: string
}

const LABEL: Record<VoiceId, string> = {
  quiet: 'PRESS · SET',
  human: 'PRESS · BY HAND',
  bold: 'PRESS · SIGNAL',
}

const MARK: Record<VoiceId, string> = {
  quiet: '⌇',
  human: '✦',
  bold: '✕',
}

export function PressMark({ voice, setToday, className = '' }: PressMarkProps) {
  const style = { '--pm-tone': `var(--${voice === 'quiet' ? 'blue' : voice === 'human' ? 'coral' : 'acid'})` } as CSSProperties
  return (
    <span className={`press-mark ${className}`} style={style} aria-hidden="true">
      <svg viewBox="0 0 96 96">
        <defs>
          <filter id="press-mark-grain" x="-6%" y="-6%" width="112%" height="112%">
            <feTurbulence type="fractalNoise" baseFrequency="2.2" numOctaves="2" seed="4" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .55 0" />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
        </defs>
        <g filter="url(#press-mark-grain)" opacity=".92">
          <circle cx="48" cy="48" r="42" fill="none" stroke="currentColor" strokeWidth=".9" />
          <circle cx="48" cy="48" r="36" fill="none" stroke="currentColor" strokeWidth=".4" strokeDasharray="1 2" opacity=".7" />
          <text
            x="48"
            y="22"
            textAnchor="middle"
            fontFamily="ui-monospace, monospace"
            fontSize="4.4"
            letterSpacing="2.2"
            fill="currentColor"
          >{LABEL[voice]}</text>
          <text
            x="48"
            y="56"
            textAnchor="middle"
            fontFamily="Georgia, serif"
            fontStyle="italic"
            fontSize="22"
            fill="currentColor"
          >{MARK[voice]}</text>
          <text
            x="48"
            y="74"
            textAnchor="middle"
            fontFamily="ui-monospace, monospace"
            fontSize="4"
            letterSpacing="2"
            fill="currentColor"
            opacity=".85"
          >SET · {setToday.toUpperCase()}</text>
        </g>
      </svg>
    </span>
  )
}
