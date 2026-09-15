import { useId } from 'react'
import type { CSSProperties } from 'react'
import type { VoiceId } from './Press'

type PlateProvenanceProps = {
  voice: VoiceId
  setToday: string
}

const VOICE_TONE: Record<VoiceId, string> = {
  quiet: 'var(--blue)',
  human: 'var(--coral)',
  bold: 'var(--acid)',
}

function formatYear(): string {
  return String(new Date().getFullYear())
}

export function PlateProvenance({ voice, setToday }: PlateProvenanceProps) {
  const baseId = useId().replace(/:/g, '')
  const grainId = `plate-provenance-grain-${baseId}`
  const tone = VOICE_TONE[voice]
  const year = formatYear()
  const style = { '--provenance-tone': tone } as CSSProperties

  return (
    <figure className={`plate-provenance plate-provenance--${voice}`} style={style} aria-label="Plate provenance">
      <svg
        className="plate-provenance__stamp"
        viewBox="0 0 320 88"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
      >
        <defs>
          <filter id={grainId} x="-6%" y="-30%" width="112%" height="160%">
            <feTurbulence type="fractalNoise" baseFrequency="2.4" numOctaves="2" seed="19" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .5 0" />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
        </defs>

        <g filter={`url(#${grainId})`} className="plate-provenance__group">
          <path
            className="plate-provenance__rule plate-provenance__rule--top"
            d="M2 14 L318 14"
            fill="none"
            stroke="currentColor"
            strokeWidth=".5"
            strokeLinecap="round"
            strokeDasharray="2 4"
          />
          <path
            className="plate-provenance__rule plate-provenance__rule--bot"
            d="M2 74 L318 74"
            fill="none"
            stroke="currentColor"
            strokeWidth=".5"
            strokeLinecap="round"
            strokeDasharray="2 4"
          />
          <text
            x="160"
            y="34"
            textAnchor="middle"
            fontFamily="ui-monospace, 'SFMono-Regular', Consolas, ui-monospace, monospace"
            fontSize="9"
            letterSpacing="2.4"
            fill="currentColor"
            className="plate-provenance__eyebrow"
          >
            M³ · PRESS · PLATE · I
          </text>
          <text
            x="160"
            y="58"
            textAnchor="middle"
            fontFamily="Georgia, 'Iowan Old Style', serif"
            fontStyle="italic"
            fontSize="20"
            letterSpacing=".01em"
            fill="currentColor"
            className="plate-provenance__name"
          >
            an open question
          </text>
          <line
            x1="80"
            y1="46"
            x2="240"
            y2="46"
            stroke="currentColor"
            strokeWidth=".4"
            strokeDasharray=".6 1.4"
            opacity=".5"
            className="plate-provenance__name-rule"
          />
        </g>

        <g className="plate-provenance__corner plate-provenance__corner--tl" aria-hidden="true">
          <path d="M2 4 L2 12 M2 4 L10 4" fill="none" stroke="currentColor" strokeWidth=".6" strokeLinecap="round" />
        </g>
        <g className="plate-provenance__corner plate-provenance__corner--tr" aria-hidden="true">
          <path d="M318 4 L318 12 M318 4 L310 4" fill="none" stroke="currentColor" strokeWidth=".6" strokeLinecap="round" />
        </g>
        <g className="plate-provenance__corner plate-provenance__corner--bl" aria-hidden="true">
          <path d="M2 84 L2 76 M2 84 L10 84" fill="none" stroke="currentColor" strokeWidth=".6" strokeLinecap="round" />
        </g>
        <g className="plate-provenance__corner plate-provenance__corner--br" aria-hidden="true">
          <path d="M318 84 L318 76 M318 84 L310 84" fill="none" stroke="currentColor" strokeWidth=".6" strokeLinecap="round" />
        </g>

        <g className="plate-provenance__seal" aria-hidden="true">
          <circle cx="20" cy="44" r="9.5" fill="none" stroke="currentColor" strokeWidth=".5" />
          <circle cx="20" cy="44" r="6.5" fill="none" stroke="currentColor" strokeWidth=".3" strokeDasharray=".6 1.6" opacity=".7" />
          <text x="20" y="48" textAnchor="middle" fontFamily="Georgia, serif" fontStyle="italic" fontSize="9" fill="currentColor">m³</text>
        </g>
        <g className="plate-provenance__seal plate-provenance__seal--alt" aria-hidden="true">
          <circle cx="300" cy="44" r="9.5" fill="none" stroke="currentColor" strokeWidth=".5" />
          <circle cx="300" cy="44" r="6.5" fill="none" stroke="currentColor" strokeWidth=".3" strokeDasharray=".6 1.6" opacity=".7" />
          <text x="300" y="48" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="6" letterSpacing=".6" fill="currentColor">i</text>
        </g>
      </svg>

      <figcaption className="plate-provenance__caption">
        <span className="plate-provenance__caption-mark" aria-hidden="true">
          <svg viewBox="0 0 16 16">
            <circle cx="8" cy="8" r="6.4" fill="none" stroke="currentColor" strokeWidth=".4" />
            <circle cx="8" cy="8" r="1.4" fill="currentColor" />
          </svg>
        </span>
        <span className="plate-provenance__caption-text">
          <em>plate i</em>
          <span className="plate-provenance__caption-divider" aria-hidden="true">·</span>
          the title page
          <span className="plate-provenance__caption-divider" aria-hidden="true">·</span>
          m³ press · anno <em>{year}</em>
        </span>
        <span className="plate-provenance__caption-mark" aria-hidden="true">
          <svg viewBox="0 0 16 16">
            <circle cx="8" cy="8" r="6.4" fill="none" stroke="currentColor" strokeWidth=".4" />
            <circle cx="8" cy="8" r="1.4" fill="currentColor" />
          </svg>
        </span>
      </figcaption>
    </figure>
  )
}
