import { useId, type CSSProperties } from 'react'
import type { VoiceId } from './Press'

type ArrivalMarkProps = {
  voice: VoiceId
  setToday: string
}

const VOICE_LETTER: Record<VoiceId, string> = { quiet: 'a', human: 'b', bold: 'c' }
const VOICE_NAME: Record<VoiceId, string> = { quiet: 'quiet cut', human: 'human hand', bold: 'bold signal' }

export function ArrivalMark({ voice, setToday }: ArrivalMarkProps) {
  const baseId = useId().replace(/:/g, '')
  const grainId = `arrival-mark-grain-${baseId}`
  const descentGrainId = `arrival-mark-descent-grain-${baseId}`
  const seedPath = 'M2 6c20-4 40 4 60 0s40-4 60 0 40 4 60 0 40-4 58-1'
  const toneStyle = { '--arrival-tone': 'var(--titleline-tone, var(--coral))' } as CSSProperties
  return (
    <div
      className={`arrival-mark arrival-mark--${voice}`}
      style={toneStyle}
      aria-hidden="true"
    >
      <svg className="arrival-mark__defs" viewBox="0 0 200 12" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <filter id={grainId} x="-6%" y="-50%" width="112%" height="200%">
            <feTurbulence type="fractalNoise" baseFrequency="2.6" numOctaves="2" seed="47" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .5 0" />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
        </defs>
      </svg>

      <span className="arrival-mark__greeting" aria-hidden="true">
        <span className="arrival-mark__greeting-mark" />
        <em>for whoever opened it, today</em>
        <span className="arrival-mark__greeting-mark arrival-mark__greeting-mark--alt" />
      </span>

      <span className="arrival-mark__rule arrival-mark__rule--lead" aria-hidden="true">
        <svg viewBox="0 0 240 12" preserveAspectRatio="none">
          <g filter={`url(#${grainId})`}>
            <path
              className="arrival-mark__rule-stroke"
              d={seedPath}
              fill="none"
              stroke="currentColor"
              strokeWidth=".8"
              strokeLinecap="round"
              pathLength="100"
              strokeDasharray="100 100"
            />
          </g>
          <circle className="arrival-mark__rule-bead" cx="2" cy="6" r="1.1" fill="currentColor" />
          <circle className="arrival-mark__rule-bead arrival-mark__rule-bead--end" cx="238" cy="6" r="1.1" fill="currentColor" />
        </svg>
      </span>

      <span className="arrival-mark__seed">
        <span className="arrival-mark__seed-mark" aria-hidden="true">
          <svg viewBox="0 0 16 16" aria-hidden="true">
            <circle cx="8" cy="8" r="6.4" fill="none" stroke="currentColor" strokeWidth=".55" />
            <circle cx="8" cy="8" r="3.6" fill="none" stroke="currentColor" strokeWidth=".35" strokeDasharray=".7 1.4" opacity=".7" />
            <text
              x="8"
              y="11.5"
              textAnchor="middle"
              fontFamily="Georgia, 'Iowan Old Style', serif"
              fontStyle="italic"
              fontSize="9"
              letterSpacing="-.02em"
              fill="currentColor"
            >m³</text>
          </svg>
        </span>
        <span className="arrival-mark__seed-stack">
          <span className="arrival-mark__seed-line">
            <em className="arrival-mark__seed-em">m³ press</em>
            <span className="arrival-mark__seed-sep" aria-hidden="true">·</span>
            <span className="arrival-mark__seed-key">an open question</span>
          </span>
          <span className="arrival-mark__seed-line arrival-mark__seed-line--alt">
            <span className="arrival-mark__seed-key">set today</span>
            <span className="arrival-mark__seed-sep" aria-hidden="true">·</span>
            <em className="arrival-mark__seed-em">{setToday}</em>
            <span className="arrival-mark__seed-sep" aria-hidden="true">·</span>
            <span className="arrival-mark__seed-voice">{VOICE_NAME[voice]}</span>
          </span>
        </span>
        <span className="arrival-mark__seed-voice-dots" aria-hidden="true">
          {(['quiet', 'human', 'bold'] as VoiceId[]).map(v => (
            <span
              key={`arrival-dot-${v}`}
              className={`arrival-mark__seed-voice-dot arrival-mark__seed-voice-dot--${v} ${v === voice ? 'is-on' : ''}`}
            >
              <span className="arrival-mark__seed-voice-letter">{VOICE_LETTER[v]}</span>
            </span>
          ))}
        </span>
      </span>

      <span className="arrival-mark__rule arrival-mark__rule--trail" aria-hidden="true">
        <svg viewBox="0 0 240 12" preserveAspectRatio="none">
          <g filter={`url(#${grainId})`}>
            <path
              className="arrival-mark__rule-stroke arrival-mark__rule-stroke--alt"
              d={seedPath}
              fill="none"
              stroke="currentColor"
              strokeWidth=".55"
              strokeLinecap="round"
              opacity=".7"
              pathLength="100"
              strokeDasharray="100 100"
            />
          </g>
          <circle className="arrival-mark__rule-bead" cx="2" cy="6" r="1.1" fill="currentColor" opacity=".75" />
          <circle className="arrival-mark__rule-bead arrival-mark__rule-bead--end" cx="238" cy="6" r="1.1" fill="currentColor" opacity=".75" />
        </svg>
      </span>

      <span className="arrival-mark__descent" aria-hidden="true">
        <span className="arrival-mark__descent-tag" aria-hidden="true">
          <span className="arrival-mark__descent-tag-rule" />
          <em>the arrival, exhaling down</em>
          <span className="arrival-mark__descent-tag-rule arrival-mark__descent-tag-rule--alt" />
        </span>
        <svg className="arrival-mark__descent-svg" viewBox="0 0 20 78" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <filter id={descentGrainId} x="-30%" y="-4%" width="160%" height="108%">
              <feTurbulence type="fractalNoise" baseFrequency="2.6" numOctaves="2" seed="53" stitchTiles="stitch" />
              <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .5 0" />
              <feComposite in2="SourceGraphic" operator="in" />
            </filter>
          </defs>
          <g filter={`url(#${descentGrainId})`}>
            <path
              className="arrival-mark__descent-stroke arrival-mark__descent-stroke--lead"
              d="M10 2c1.2 12-2 24 0 36s-1.6 18 0 32"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.05"
              strokeLinecap="round"
              pathLength="100"
              strokeDasharray="100 100"
            />
            <path
              className="arrival-mark__descent-stroke arrival-mark__descent-stroke--trail"
              d="M13 4c.6 10-1 18 .2 28s-1 16 .6 24"
              fill="none"
              stroke="currentColor"
              strokeWidth=".5"
              strokeLinecap="round"
              opacity=".5"
              pathLength="100"
              strokeDasharray="100 100"
            />
          </g>
          <circle className="arrival-mark__descent-bead" cx="10.2" cy="76" r="2" fill="currentColor" />
          <circle className="arrival-mark__descent-halo" cx="10.2" cy="76" r="4.6" fill="none" stroke="currentColor" strokeWidth=".3" strokeDasharray=".7 1.6" opacity=".6" />
        </svg>
      </span>
    </div>
  )
}
