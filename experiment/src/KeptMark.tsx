import { useId } from 'react'
import type { CSSProperties } from 'react'
import type { VoiceId } from './Press'

type KeptMarkVariant = 'hero' | 'answer' | 'colophon' | 'inline'

type KeptMarkProps = {
  voice: VoiceId
  label?: string
  size?: number
  variant?: KeptMarkVariant
  caption?: string
}

const VOICE_TONE: Record<VoiceId, string> = {
  quiet: 'var(--blue)',
  human: 'var(--coral)',
  bold: 'var(--acid)',
}

const VOICE_CAPTION: Record<VoiceId, string> = {
  quiet: 'kept in the quiet cut',
  human: 'kept by hand',
  bold: 'kept, without apology',
}

export function KeptMark({
  voice,
  label = 'm³',
  size = 168,
  variant = 'hero',
  caption,
}: KeptMarkProps) {
  const baseId = useId()
  const inkId = `kept-mark-ink-${baseId.replace(/:/g, '')}`
  const style = { '--kept-tone': VOICE_TONE[voice] } as CSSProperties
  const display = caption ?? VOICE_CAPTION[voice]

  return (
    <figure className={`kept-mark kept-mark--${voice} kept-mark--${variant}`} style={style} aria-hidden="true">
      <svg
        className="kept-mark__seal"
        width={size}
        height={size}
        viewBox="0 0 168 168"
      >
        <defs>
          <linearGradient id={inkId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
            <stop offset="20%" stopColor="currentColor" stopOpacity=".78" />
            <stop offset="80%" stopColor="currentColor" stopOpacity=".78" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
        </defs>

        <circle
          className="kept-mark__ring"
          cx="84"
          cy="84"
          r="76"
          fill="none"
          stroke={`url(#${inkId})`}
          strokeWidth=".9"
        />
        <circle
          className="kept-mark__ring-inner"
          cx="84"
          cy="84"
          r="60"
          fill="none"
          stroke="currentColor"
          strokeWidth=".4"
          strokeDasharray="1 3.4"
          opacity=".5"
        />
        <line x1="14" y1="84" x2="154" y2="84" stroke="currentColor" strokeWidth=".32" opacity=".32" />
        <line x1="84" y1="14" x2="84" y2="154" stroke="currentColor" strokeWidth=".32" opacity=".32" />

        <text
          x="84"
          y="32"
          textAnchor="middle"
          fontFamily="ui-monospace, monospace"
          fontSize="6.4"
          letterSpacing="3"
          fill="currentColor"
          opacity=".7"
          className="kept-mark__tag kept-mark__tag--top"
        >
          KEPT · BY · M³
        </text>
        <text
          x="84"
          y="146"
          textAnchor="middle"
          fontFamily="ui-monospace, monospace"
          fontSize="6"
          letterSpacing="2.6"
          fill="currentColor"
          opacity=".55"
          className="kept-mark__tag kept-mark__tag--bottom"
        >
          FOLIO · KEPT · I
        </text>

        <text
          x="84"
          y="96"
          textAnchor="middle"
          fontFamily="Georgia, 'Iowan Old Style', serif"
          fontStyle="italic"
          fontSize="42"
          letterSpacing="-.04em"
          fill="currentColor"
          className="kept-mark__glyph"
        >
          {label}
        </text>

        <path
          className="kept-mark__flourish"
          d="M28 116 C 50 100, 70 138, 96 116 S 132 104, 148 124"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          pathLength="100"
          strokeDasharray="100 100"
          strokeDashoffset="100"
        />
        <path
          className="kept-mark__flourish kept-mark__flourish--under"
          d="M34 122 C 56 110, 78 132, 100 120 S 130 110, 142 122"
          fill="none"
          stroke="currentColor"
          strokeWidth=".55"
          strokeLinecap="round"
          opacity=".5"
          pathLength="100"
          strokeDasharray="100 100"
          strokeDashoffset="100"
        />

        <circle className="kept-mark__bead" cx="150" cy="124" r="2.2" fill="currentColor" />
        <circle className="kept-mark__bead kept-mark__bead--halo" cx="150" cy="124" r="6" fill="none" stroke="currentColor" strokeWidth=".35" opacity=".35" />
      </svg>
      <figcaption className="kept-mark__caption">
        <span className="kept-mark__caption-mark" aria-hidden="true">※</span>
        <span>{display}</span>
      </figcaption>
    </figure>
  )
}