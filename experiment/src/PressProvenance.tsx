import { useId, type CSSProperties } from 'react'
import type { VoiceId } from './Press'

type PressProvenanceProps = {
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

export function PressProvenance({ voice, setToday }: PressProvenanceProps) {
  const baseId = useId().replace(/:/g, '')
  const grainId = `provenance-grain-${baseId}`
  const style = {
    '--provenance-tone': VOICE_TONE[voice],
  } as CSSProperties

  return (
    <aside
      className={`press-provenance press-provenance--${voice}`}
      style={style}
      aria-label={`m³ press · volume i · the open question · set today ${setToday} in the ${VOICE_NAME[voice]} voice.`}
    >
      <svg className="press-provenance__defs" viewBox="0 0 800 24" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <filter id={grainId} x="-2%" y="-30%" width="104%" height="160%">
            <feTurbulence type="fractalNoise" baseFrequency="2.4" numOctaves="2" seed="53" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .5 0" />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
        </defs>
      </svg>

      <span className="press-provenance__rule press-provenance__rule--lead" aria-hidden="true">
        <svg viewBox="0 0 220 6" preserveAspectRatio="none">
          <path
            d="M218 3 L4 3"
            fill="none"
            stroke="currentColor"
            strokeWidth=".7"
            strokeLinecap="round"
            pathLength="100"
            strokeDasharray="100 100"
            className="press-provenance__rule-stroke"
          />
          <circle cx="218" cy="3" r="1.1" fill="currentColor" className="press-provenance__rule-bead" />
        </svg>
      </span>

      <span className="press-provenance__seal" aria-hidden="true">
        <svg viewBox="0 0 40 40">
          <g filter={`url(#${grainId})`}>
            <circle cx="20" cy="20" r="18" fill="none" stroke="currentColor" strokeWidth=".7" />
            <circle cx="20" cy="20" r="14" fill="none" stroke="currentColor" strokeWidth=".35" strokeDasharray=".7 1.4" opacity=".7" />
            <circle cx="20" cy="20" r="9" fill="none" stroke="currentColor" strokeWidth=".4" opacity=".55" />
            <path
              d="M20 4 L20 8 M20 32 L20 36 M4 20 L8 20 M32 20 L36 20 M9 9 L11.5 11.5 M28.5 28.5 L31 31 M9 31 L11.5 28.5 M28.5 11.5 L31 9"
              stroke="currentColor"
              strokeWidth=".5"
              strokeLinecap="round"
              opacity=".7"
            />
            <text
              x="20"
              y="25"
              textAnchor="middle"
              fontFamily="'Iowan Old Style', Georgia, serif"
              fontStyle="italic"
              fontSize="13"
              fill="currentColor"
            >m³</text>
          </g>
        </svg>
      </span>

      <span className="press-provenance__core">
        <span className="press-provenance__cell press-provenance__cell--press" aria-hidden="true">
          <span className="press-provenance__key">m³ press</span>
        </span>

        <span className="press-provenance__bead" aria-hidden="true">
          <svg viewBox="0 0 8 8">
            <circle cx="4" cy="4" r="1.4" fill="currentColor" />
          </svg>
        </span>

        <span className="press-provenance__cell press-provenance__cell--volume">
          <span className="press-provenance__key">volume</span>
          <em className="press-provenance__em">i</em>
          <span className="press-provenance__sub">· the open question</span>
        </span>

        <span className="press-provenance__bead" aria-hidden="true">
          <svg viewBox="0 0 8 8">
            <circle cx="4" cy="4" r="1.4" fill="currentColor" />
          </svg>
        </span>

        <span className={`press-provenance__cell press-provenance__cell--voice press-provenance__voice--${voice}`}>
          <span className="press-provenance__voice-letter" aria-hidden="true">{VOICE_LETTER[voice]}</span>
          <span className="press-provenance__key">in the</span>
          <em className="press-provenance__em">{VOICE_NAME[voice]}</em>
        </span>

        <span className="press-provenance__bead" aria-hidden="true">
          <svg viewBox="0 0 8 8">
            <circle cx="4" cy="4" r="1.4" fill="currentColor" />
          </svg>
        </span>

        <span className="press-provenance__cell press-provenance__cell--set" aria-label={`Set today ${setToday}`}>
          <span className="press-provenance__key">set today</span>
          <em className="press-provenance__em">{setToday}</em>
        </span>
      </span>

      <span className="press-provenance__rule press-provenance__rule--trail" aria-hidden="true">
        <svg viewBox="0 0 220 6" preserveAspectRatio="none">
          <path
            d="M2 3 L216 3"
            fill="none"
            stroke="currentColor"
            strokeWidth=".7"
            strokeLinecap="round"
            pathLength="100"
            strokeDasharray="100 100"
            className="press-provenance__rule-stroke"
          />
          <circle cx="2" cy="3" r="1.1" fill="currentColor" className="press-provenance__rule-bead" />
        </svg>
      </span>

      <span className="press-provenance__paper" aria-hidden="true">
        <svg viewBox="0 0 800 24" preserveAspectRatio="none">
          <rect x="0" y="0" width="800" height="24" filter={`url(#${grainId})`} opacity=".04" />
        </svg>
      </span>
    </aside>
  )
}
