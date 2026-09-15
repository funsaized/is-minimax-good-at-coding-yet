import { useId } from 'react'
import type { CSSProperties } from 'react'
import type { VoiceId } from './Press'

type PressSignatureMarkProps = {
  voice: VoiceId
  setToday: string
}

const VOICE_TONE: Record<VoiceId, string> = {
  quiet: 'var(--blue)',
  human: 'var(--coral)',
  bold: 'var(--acid)',
}

const VOICE_PHRASE: Record<VoiceId, string> = {
  quiet: 'kept in the quiet cut',
  human: 'kept by hand',
  bold: 'kept without apology',
}

export function PressSignatureMark({ voice, setToday }: PressSignatureMarkProps) {
  const baseId = useId()
  const inkId = `sig-mark-ink-${baseId.replace(/:/g, '')}`
  const grainId = `sig-mark-grain-${baseId.replace(/:/g, '')}`
  const style = { '--sig-tone': VOICE_TONE[voice] } as CSSProperties

  return (
    <figure className="sig-mark" aria-hidden="true" style={style}>
      <svg
        className="sig-mark__seal"
        viewBox="0 0 96 96"
        width="96"
        height="96"
      >
        <defs>
          <linearGradient id={inkId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
            <stop offset="22%" stopColor="currentColor" stopOpacity=".75" />
            <stop offset="78%" stopColor="currentColor" stopOpacity=".75" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
          <filter id={grainId} x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency="2.4" numOctaves="2" seed="7" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .5 0" />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
        </defs>

        <g filter={`url(#${grainId})`}>
          <circle
            cx="48"
            cy="48"
            r="44"
            fill="none"
            stroke={`url(#${inkId})`}
            strokeWidth="1.1"
            className="sig-mark__ring"
          />
          <circle
            cx="48"
            cy="48"
            r="36"
            fill="none"
            stroke="currentColor"
            strokeWidth=".35"
            strokeDasharray=".8 2.6"
            opacity=".55"
            className="sig-mark__ring-inner"
          />
        </g>

        <path
          className="sig-mark__flourish"
          d="M14 60 C 28 50, 36 70, 50 56 S 74 50, 84 64"
          fill="none"
          stroke="currentColor"
          strokeWidth=".7"
          strokeLinecap="round"
          opacity=".75"
        />

        <text
          x="48"
          y="22"
          textAnchor="middle"
          fontFamily="ui-monospace, monospace"
          fontSize="4.4"
          letterSpacing="2.4"
          fill="currentColor"
          opacity=".7"
        >
          KEPT · BY
        </text>
        <text
          x="48"
          y="56"
          textAnchor="middle"
          fontFamily="Georgia, 'Iowan Old Style', serif"
          fontStyle="italic"
          fontSize="26"
          letterSpacing="-.04em"
          fill="currentColor"
          className="sig-mark__glyph"
        >
          m³
        </text>
        <text
          x="48"
          y="80"
          textAnchor="middle"
          fontFamily="ui-monospace, monospace"
          fontSize="4"
          letterSpacing="2.2"
          fill="currentColor"
          opacity=".55"
        >
          M³ · PRESS
        </text>

        <circle className="sig-mark__bead" cx="84" cy="64" r="1.6" fill="currentColor" />
      </svg>
      <figcaption className="sig-mark__caption">
        <span className="sig-mark__caption-rule" aria-hidden="true" />
        <span className="sig-mark__caption-text">
          <em>{VOICE_PHRASE[voice]}</em>
          <span aria-hidden="true">·</span>
          <span>set <em>{setToday}</em></span>
        </span>
        <span className="sig-mark__caption-rule sig-mark__caption-rule--alt" aria-hidden="true" />
      </figcaption>
    </figure>
  )
}
