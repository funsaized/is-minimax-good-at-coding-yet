import { useId, type CSSProperties } from 'react'
import type { VoiceId } from './Press'

type TitleLampProps = {
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

export function TitleLamp({ voice, setToday }: TitleLampProps) {
  const baseId = useId().replace(/:/g, '')
  const grainId = `title-lamp-grain-${baseId}`
  const rayGrainId = `title-lamp-ray-grain-${baseId}`
  const haloId = `title-lamp-halo-${baseId}`
  const style = {
    '--title-lamp-tone': VOICE_TONE[voice],
  } as CSSProperties

  return (
    <aside
      className={`title-lamp title-lamp--${voice}`}
      style={style}
      aria-label={`The title lamp · the press is lit · set in the ${VOICE_NAME[voice]} voice · set today ${setToday}`}
    >
      <svg className="title-lamp__defs" viewBox="0 0 1200 240" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <filter id={grainId} x="-6%" y="-50%" width="112%" height="200%">
            <feTurbulence type="fractalNoise" baseFrequency="2.6" numOctaves="2" seed="73" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .5 0" />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
          <filter id={rayGrainId} x="-12%" y="-12%" width="124%" height="124%">
            <feTurbulence type="fractalNoise" baseFrequency="2.2" numOctaves="2" seed="79" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .42 0" />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
          <radialGradient id={haloId} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="currentColor" stopOpacity=".55" />
            <stop offset="38%" stopColor="currentColor" stopOpacity=".22" />
            <stop offset="72%" stopColor="currentColor" stopOpacity=".07" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>

      <span className="title-lamp__rule title-lamp__rule--lead" aria-hidden="true">
        <svg viewBox="0 0 480 6" preserveAspectRatio="none">
          <g filter={`url(#${grainId})`}>
            <path
              className="title-lamp__rule-stroke title-lamp__rule-stroke--lead"
              d="M2 3c40-3 80 3 120 0s80-3 120 0 80 3 120 0 80-3 116 0"
              fill="none"
              stroke="currentColor"
              strokeWidth=".7"
              strokeLinecap="round"
              pathLength="100"
              strokeDasharray="100 100"
            />
          </g>
          <circle cx="478" cy="3" r="1.1" fill="currentColor" />
        </svg>
      </span>

      <span className="title-lamp__halo" aria-hidden="true">
        <svg viewBox="0 0 220 140" preserveAspectRatio="xMidYMid meet">
          <ellipse cx="110" cy="64" rx="98" ry="56" fill={`url(#${haloId})`} className="title-lamp__halo-fill" />
        </svg>
      </span>

      <span className="title-lamp__cage" aria-hidden="true">
        <svg viewBox="0 0 80 132" preserveAspectRatio="xMidYMid meet">
          <g filter={`url(#${rayGrainId})`}>
            <path
              className="title-lamp__ray title-lamp__ray--a"
              d="M40 4 L40 18"
              stroke="currentColor"
              strokeWidth=".9"
              strokeLinecap="round"
              fill="none"
              opacity=".85"
              pathLength="100"
            />
            <path
              className="title-lamp__ray title-lamp__ray--b"
              d="M14 14 L24 24"
              stroke="currentColor"
              strokeWidth=".7"
              strokeLinecap="round"
              fill="none"
              opacity=".7"
              pathLength="100"
            />
            <path
              className="title-lamp__ray title-lamp__ray--c"
              d="M66 14 L56 24"
              stroke="currentColor"
              strokeWidth=".7"
              strokeLinecap="round"
              fill="none"
              opacity=".7"
              pathLength="100"
            />
            <path
              className="title-lamp__ray title-lamp__ray--d"
              d="M4 30 L18 32"
              stroke="currentColor"
              strokeWidth=".55"
              strokeLinecap="round"
              fill="none"
              opacity=".55"
              pathLength="100"
            />
            <path
              className="title-lamp__ray title-lamp__ray--e"
              d="M76 30 L62 32"
              stroke="currentColor"
              strokeWidth=".55"
              strokeLinecap="round"
              fill="none"
              opacity=".55"
              pathLength="100"
            />

            <path
              d="M22 38 L58 38 L62 50 L18 50 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth=".95"
              strokeLinejoin="round"
              strokeLinecap="round"
              className="title-lamp__cage-cap"
            />
            <line x1="22" y1="44" x2="58" y2="44" stroke="currentColor" strokeWidth=".35" strokeDasharray="1 1.4" opacity=".5" />
            <line x1="26" y1="38" x2="22" y2="50" stroke="currentColor" strokeWidth=".5" opacity=".65" />
            <line x1="34" y1="38" x2="32" y2="50" stroke="currentColor" strokeWidth=".5" opacity=".65" />
            <line x1="42" y1="38" x2="42" y2="50" stroke="currentColor" strokeWidth=".5" opacity=".65" />
            <line x1="50" y1="38" x2="52" y2="50" stroke="currentColor" strokeWidth=".5" opacity=".65" />
            <line x1="58" y1="38" x2="62" y2="50" stroke="currentColor" strokeWidth=".5" opacity=".65" />

            <ellipse cx="40" cy="56" rx="14" ry="4.4" fill="currentColor" className="title-lamp__glass" />
            <ellipse cx="40" cy="56" rx="14" ry="4.4" fill="none" stroke="currentColor" strokeWidth=".55" className="title-lamp__glass-rim" />
            <path
              d="M28 56 C 30 78, 50 78, 52 56"
              fill="currentColor"
              opacity=".22"
              className="title-lamp__glow"
            />

            <path d="M22 84 L58 84" stroke="currentColor" strokeWidth=".75" strokeLinecap="round" className="title-lamp__stem" />
            <path d="M28 84 L26 102" stroke="currentColor" strokeWidth=".7" strokeLinecap="round" />
            <path d="M52 84 L54 102" stroke="currentColor" strokeWidth=".7" strokeLinecap="round" />
            <path d="M40 84 L40 102" stroke="currentColor" strokeWidth=".7" strokeLinecap="round" />
            <circle cx="40" cy="108" r="3.4" fill="currentColor" className="title-lamp__base" />
            <circle cx="40" cy="108" r="1.4" fill="var(--night)" opacity=".7" />
            <path d="M30 118 L50 118" stroke="currentColor" strokeWidth=".7" strokeLinecap="round" />
            <path d="M28 122 L52 122" stroke="currentColor" strokeWidth=".55" strokeLinecap="round" opacity=".6" />

            <circle cx="40" cy="56" r="3.2" fill="currentColor" className="title-lamp__flame" />
            <circle cx="40" cy="56" r="3.2" fill="none" stroke="currentColor" strokeWidth=".25" strokeDasharray=".5 1.2" className="title-lamp__flame-ring" opacity=".7" />
            <path d="M38 50 C 39 53, 41 53, 42 50" stroke="currentColor" strokeWidth=".4" strokeLinecap="round" fill="none" opacity=".7" className="title-lamp__flame-tip" />
          </g>
        </svg>
      </span>

      <p className="title-lamp__copy">
        <span className="title-lamp__copy-mark" aria-hidden="true">¶</span>
        <em className="title-lamp__copy-line">
          the press is lit · read it once with the eye, once with the ear
        </em>
        <span className="title-lamp__copy-mark title-lamp__copy-mark--alt" aria-hidden="true">¶</span>
        <span className="title-lamp__copy-tag" aria-hidden="true">
          <span className="title-lamp__copy-tag-mark" />
          <span>set in</span>
          <em>{VOICE_NAME[voice]}</em>
          <span className="title-lamp__copy-tag-mark title-lamp__copy-tag-mark--alt" />
        </span>
      </p>

      <span className="title-lamp__rule title-lamp__rule--trail" aria-hidden="true">
        <svg viewBox="0 0 480 6" preserveAspectRatio="none">
          <g filter={`url(#${grainId})`}>
            <path
              className="title-lamp__rule-stroke title-lamp__rule-stroke--trail"
              d="M2 3c40-3 80 3 120 0s80-3 120 0 80 3 120 0 80-3 116 0"
              fill="none"
              stroke="currentColor"
              strokeWidth=".7"
              strokeLinecap="round"
              pathLength="100"
              strokeDasharray="100 100"
            />
          </g>
          <circle cx="2" cy="3" r="1.1" fill="currentColor" />
        </svg>
      </span>

      <span className="title-lamp__corner title-lamp__corner--tl" aria-hidden="true" />
      <span className="title-lamp__corner title-lamp__corner--tr" aria-hidden="true" />
      <span className="title-lamp__corner title-lamp__corner--bl" aria-hidden="true" />
      <span className="title-lamp__corner title-lamp__corner--br" aria-hidden="true" />
    </aside>
  )
}