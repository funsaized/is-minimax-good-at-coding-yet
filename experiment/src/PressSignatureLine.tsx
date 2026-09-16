import { useId, type CSSProperties } from 'react'
import type { VoiceId } from './Press'

type PressSignatureLineProps = {
  voice: VoiceId
  setToday: string
}

const VOICE_TONE: Record<VoiceId, string> = {
  quiet: 'var(--blue)',
  human: 'var(--coral)',
  bold: 'var(--acid)',
}

const VOICE_KEPT: Record<VoiceId, string> = {
  quiet: 'kept in the quiet cut',
  human: 'kept by hand',
  bold: 'kept without apology',
}

export function PressSignatureLine({ voice, setToday }: PressSignatureLineProps) {
  const baseId = useId().replace(/:/g, '')
  const grainId = `press-sigline-grain-${baseId}`
  const tone = VOICE_TONE[voice]
  const style = {
    '--sigline-tone': tone,
    '--sigline-grain': `url(#${grainId})`,
  } as CSSProperties

  return (
    <aside
      className={`press-sigline press-sigline--${voice}`}
      style={style}
      aria-label={`A press signature line · ${VOICE_KEPT[voice]} · set on ${setToday}`}
    >
      <svg className="press-sigline__defs" viewBox="0 0 200 200" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <filter id={grainId} x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency="2.4" numOctaves="2" seed="19" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .5 0" />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
        </defs>
      </svg>

      <span className="press-sigline__rule press-sigline__rule--lead" aria-hidden="true">
        <svg viewBox="0 0 220 12" preserveAspectRatio="none">
          <g filter={`url(#${grainId})`} opacity=".65">
            <path
              className="press-sigline__rule-path"
              d="M2 6c14-4 28 4 42-1s28-4 42-1 28 4 42-2 28-4 42-1 28 4 42-1"
              fill="none"
              stroke="currentColor"
              strokeWidth=".7"
              strokeLinecap="round"
              pathLength="100"
            />
          </g>
          <circle cx="2" cy="6" r="1" fill="currentColor" className="press-sigline__rule-bead press-sigline__rule-bead--lead" />
          <circle cx="218" cy="6" r="1.1" fill="currentColor" className="press-sigline__rule-bead press-sigline__rule-bead--trail" />
        </svg>
      </span>

      <span className="press-sigline__seal" aria-hidden="true">
        <svg viewBox="0 0 80 80">
          <g filter={`url(#${grainId})`} opacity=".95">
            <circle cx="40" cy="40" r="36" fill="none" stroke="currentColor" strokeWidth="1.1" />
            <circle cx="40" cy="40" r="28" fill="none" stroke="currentColor" strokeWidth=".35" strokeDasharray=".9 1.8" opacity=".6" />
            <text
              x="40"
              y="22"
              textAnchor="middle"
              fontFamily="ui-monospace, monospace"
              fontSize="3.6"
              letterSpacing="2.2"
              fill="currentColor"
              opacity=".7"
            >
              PRESS · KEEP
            </text>
            <text
              x="40"
              y="48"
              textAnchor="middle"
              fontFamily="Georgia, 'Iowan Old Style', serif"
              fontStyle="italic"
              fontSize="22"
              letterSpacing="-.04em"
              fill="currentColor"
            >
              m³
            </text>
            <text
              x="40"
              y="62"
              textAnchor="middle"
              fontFamily="ui-monospace, monospace"
              fontSize="3.2"
              letterSpacing="1.6"
              fill="currentColor"
              opacity=".65"
            >
              FOLIO · I
            </text>
          </g>
        </svg>
      </span>

      <span className="press-sigline__copy">
        <em className="press-sigline__kept">{VOICE_KEPT[voice]}</em>
        <span className="press-sigline__date" aria-hidden="true">
          <span className="press-sigline__date-mark" />
          <span>set on <em>{setToday}</em></span>
          <span className="press-sigline__date-mark press-sigline__date-mark--alt" />
        </span>
      </span>

      <span className="press-sigline__rule press-sigline__rule--trail" aria-hidden="true">
        <svg viewBox="0 0 220 12" preserveAspectRatio="none">
          <g filter={`url(#${grainId})`} opacity=".5">
            <path
              d="M2 6c14-4 28 4 42-1s28-4 42-1 28 4 42-2 28-4 42-1 28 4 42-1"
              fill="none"
              stroke="currentColor"
              strokeWidth=".7"
              strokeLinecap="round"
            />
          </g>
          <circle cx="2" cy="6" r="1" fill="currentColor" />
          <circle cx="218" cy="6" r="1.1" fill="currentColor" />
        </svg>
      </span>
    </aside>
  )
}