import type { CSSProperties } from 'react'

type VoiceId = 'quiet' | 'human' | 'bold'

type FolioSealProps = {
  voice: VoiceId
  folio: string
  setToday: string
  size?: number
  className?: string
}

const VOICE_TOP: Record<VoiceId, string> = {
  quiet: 'm³ · quiet cut',
  human: 'm³ · human hand',
  bold: 'm³ · bold signal',
}

const VOICE_LETTER: Record<VoiceId, string> = {
  quiet: 'A',
  human: 'B',
  bold: 'C',
}

export function FolioSeal({ voice, folio, setToday, size = 168, className = '' }: FolioSealProps) {
  const id = `folio-seal-${voice}`
  const radius = 64
  const circ = 2 * Math.PI * radius
  const style = { '--seal-circ': circ.toFixed(2) } as CSSProperties
  return (
    <svg
      className={`folio-seal folio-seal--${voice} ${className}`}
      width={size}
      height={size}
      viewBox="0 0 168 168"
      aria-hidden="true"
      style={style}
    >
      <defs>
        <filter id={`${id}-grain`} x="-6%" y="-6%" width="112%" height="112%">
          <feTurbulence type="fractalNoise" baseFrequency="2.1" numOctaves="2" seed="5" stitchTiles="stitch" />
          <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .5 0" />
          <feComposite in2="SourceGraphic" operator="in" />
        </filter>
        <radialGradient id={`${id}-wax`} cx="50%" cy="40%" r="65%">
          <stop offset="0%" stopColor="currentColor" stopOpacity=".95" />
          <stop offset="60%" stopColor="currentColor" stopOpacity=".78" />
          <stop offset="100%" stopColor="currentColor" stopOpacity=".55" />
        </radialGradient>
      </defs>

      <g className="folio-seal__halo" opacity=".35">
        <circle cx="84" cy="84" r="80" fill="none" stroke="currentColor" strokeWidth=".3" strokeDasharray="1 3" />
      </g>

      <g className="folio-seal__disc" filter={`url(#${id}-grain)`}>
        <circle cx="84" cy="84" r="72" fill={`url(#${id}-wax)`} />
        <circle cx="84" cy="84" r="72" fill="none" stroke="currentColor" strokeWidth=".8" />
        <circle cx="84" cy="84" r="64" fill="none" stroke="currentColor" strokeWidth=".4" strokeDasharray="2 1.6" opacity=".7" />
        <circle cx="84" cy="84" r="56" fill="none" stroke="currentColor" strokeWidth=".5" opacity=".55" />
      </g>

      <g className="folio-seal__ring" fill="none" stroke="currentColor">
        <path
          className="folio-seal__ring-path"
          d="M84,84 m-58,0 a58,58 0 1,1 116,0 a58,58 0 1,1 -116,0"
          strokeWidth=".7"
        />
      </g>

      <g className="folio-seal__type" fill="currentColor">
        <text
          className="folio-seal__arc-top"
          x="84"
          y="44"
          textAnchor="middle"
          fontFamily="ui-monospace, monospace"
          fontSize="5.4"
          letterSpacing="3.4"
        >{VOICE_TOP[voice]}</text>
        <text
          className="folio-seal__arc-bot"
          x="84"
          y="130"
          textAnchor="middle"
          fontFamily="ui-monospace, monospace"
          fontSize="5.4"
          letterSpacing="3.4"
        >set on {setToday} · folio {folio}</text>
      </g>

      <g className="folio-seal__center" fill="currentColor">
        <circle cx="84" cy="84" r="32" fill="none" stroke="currentColor" strokeWidth=".5" opacity=".6" />
        <text
          x="84"
          y="78"
          textAnchor="middle"
          fontFamily="Georgia, serif"
          fontStyle="italic"
          fontSize="9"
          letterSpacing="0"
          opacity=".85"
        >folio</text>
        <text
          className="folio-seal__folio"
          x="84"
          y="100"
          textAnchor="middle"
          fontFamily="Georgia, serif"
          fontStyle="italic"
          fontSize="22"
          letterSpacing="-.02em"
        >{folio}</text>
        <text
          x="84"
          y="114"
          textAnchor="middle"
          fontFamily="ui-monospace, monospace"
          fontSize="5.2"
          letterSpacing="2.6"
          opacity=".8"
        >voice {VOICE_LETTER[voice]}</text>
      </g>

      <g className="folio-seal__drip" fill="currentColor">
        <path
          className="folio-seal__drip-shape"
          d="M158 96c2 6-1 12 1 18s-2 8 1 14"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.1"
          strokeLinecap="round"
          opacity=".7"
        />
        <circle className="folio-seal__drip-bead" cx="160" cy="134" r="2.4" />
      </g>
    </svg>
  )
}