import { useId, type CSSProperties } from 'react'
import type { VoiceId } from './App'

type FocalQuestionMarkProps = {
  voice: VoiceId
  onSetLine?: () => void
}

const VOICE_LETTER: Record<VoiceId, string> = { quiet: 'a', human: 'b', bold: 'c' }
const VOICE_NAME: Record<VoiceId, string> = {
  quiet: 'quiet cut',
  human: 'human hand',
  bold: 'bold signal',
}

/**
 * FocalQuestionMark · the punctuation protagonist.
 *
 * A single hand-drawn question mark sits beneath the title as the visual
 * conclusion. It is set three ways — one per voice — and breathes gently
 * against a halo that follows the active tone. Clicking it (or pressing
 * Enter / Space when focused) re-sets the line, replaying the typeset
 * animation above.
 */
export function FocalQuestionMark({ voice, onSetLine }: FocalQuestionMarkProps) {
  const baseId = useId().replace(/:/g, '')
  const haloId = `fqm-halo-${baseId}`
  const strokeId = `fqm-stroke-${baseId}`
  const ringId = `fqm-ring-${baseId}`

  const style = {
    '--fqm-tone': `var(--${voice})`,
  } as CSSProperties

  const arcPath =
    voice === 'bold'
      ? 'M52 152 C 50 80, 100 28, 152 30 C 204 32, 218 78, 214 116 C 210 152, 184 174, 152 192 C 124 208, 118 228, 118 252'
      : voice === 'human'
      ? 'M58 148 C 56 80, 104 36, 148 38 C 192 40, 206 80, 202 112 C 198 144, 178 160, 152 178 C 128 190, 122 208, 122 230'
      : 'M62 144 C 60 82, 108 42, 142 44 C 182 46, 198 84, 196 110 C 194 138, 174 154, 148 170 C 128 182, 122 198, 122 222'

  const strokeWidth = voice === 'bold' ? 14 : voice === 'human' ? 9 : 5

  const caption = `punctuation · ${VOICE_NAME[voice]} · click to set the line again`

  return (
    <figure
      className={`focal-qmark focal-qmark--${voice}`}
      style={style}
      aria-label={caption}
    >
      <button
        type="button"
        className="focal-qmark__button"
        onClick={() => onSetLine?.()}
        aria-label="Set the line again · replays the typesetting animation"
        title="Set the line again"
      >
      <svg className="focal-qmark__defs" focusable="false">
        <defs>
          <radialGradient id={haloId} cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="var(--fqm-tone)" stopOpacity=".22" />
            <stop offset="40%" stopColor="var(--fqm-tone)" stopOpacity=".08" />
            <stop offset="100%" stopColor="var(--fqm-tone)" stopOpacity="0" />
          </radialGradient>
          <linearGradient id={strokeId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--fqm-tone)" stopOpacity="1" />
            <stop offset="100%" stopColor="var(--fqm-tone)" stopOpacity=".78" />
          </linearGradient>
          <radialGradient id={ringId} cx="50%" cy="50%" r="62%">
            <stop offset="0%" stopColor="var(--fqm-tone)" stopOpacity="0" />
            <stop offset="86%" stopColor="var(--fqm-tone)" stopOpacity="0" />
            <stop offset="88%" stopColor="var(--fqm-tone)" stopOpacity=".32" />
            <stop offset="92%" stopColor="var(--fqm-tone)" stopOpacity=".12" />
            <stop offset="100%" stopColor="var(--fqm-tone)" stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>

      <span className="focal-qmark__halo">
        <svg viewBox="0 0 280 280" preserveAspectRatio="xMidYMid meet">
          <circle cx="140" cy="140" r="140" fill={`url(#${haloId})`} />
        </svg>
      </span>

      <span className="focal-qmark__ring">
        <svg viewBox="0 0 280 280" preserveAspectRatio="xMidYMid meet">
          <circle
            cx="140"
            cy="140"
            r="132"
            fill="none"
            stroke="var(--fqm-tone)"
            strokeWidth=".5"
            strokeDasharray=".7 2.2"
            opacity=".55"
          />
          <circle
            cx="140"
            cy="140"
            r="118"
            fill="none"
            stroke="var(--fqm-tone)"
            strokeWidth=".32"
            strokeDasharray=".5 1.8"
            opacity=".35"
          />
          <circle
            cx="140"
            cy="140"
            r="104"
            fill="none"
            stroke="var(--fqm-tone)"
            strokeWidth=".28"
            opacity=".28"
          />
          <circle cx="140" cy="8" r="1.6" fill="var(--fqm-tone)" opacity=".78" />
          <circle cx="140" cy="272" r="1.6" fill="var(--fqm-tone)" opacity=".78" />
          <circle cx="8" cy="140" r="1.6" fill="var(--fqm-tone)" opacity=".78" />
          <circle cx="272" cy="140" r="1.6" fill="var(--fqm-tone)" opacity=".78" />
        </svg>
      </span>

      <svg
        className="focal-qmark__svg"
        viewBox="0 0 280 320"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* a faint ghost — the question drawn twice, very softly, behind */}
        <g className="focal-qmark__ghost">
          <path
            d={arcPath}
            fill="none"
            stroke="var(--fqm-tone)"
            strokeWidth={strokeWidth + 4}
            strokeLinecap="round"
            opacity=".08"
          />
          <path
            d={arcPath}
            fill="none"
            stroke="var(--fqm-tone)"
            strokeWidth={strokeWidth + 8}
            strokeLinecap="round"
            opacity=".04"
          />
        </g>

        {/* the live stroke — the protagonist */}
        <g className="focal-qmark__stroke">
          <path
            className="focal-qmark__stroke-path"
            d={arcPath}
            fill="none"
            stroke={`url(#${strokeId})`}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
        </g>

        {/* the bead — sits below the curve as the dot of the question */}
        <g className="focal-qmark__bead">
          {voice === 'bold' ? (
            <rect x="124" y="266" width="22" height="22" rx="2" fill="var(--fqm-tone)" />
          ) : voice === 'human' ? (
            <circle cx="135" cy="282" r="11" fill="var(--fqm-tone)" />
          ) : (
            <circle cx="135" cy="276" r="7.5" fill="var(--fqm-tone)" />
          )}
        </g>

        {/* a faint hand-printed drop beneath the bead — the ink's last drop */}
        <g className="focal-qmark__drop" aria-hidden="true">
          <ellipse
            cx={voice === 'bold' ? 135 : 135}
            cy={voice === 'bold' ? 304 : 304}
            rx={voice === 'bold' ? 8 : voice === 'human' ? 6 : 4}
            ry={voice === 'bold' ? 2 : voice === 'human' ? 1.6 : 1.2}
            fill="var(--fqm-tone)"
            opacity=".18"
          />
        </g>

        {/* a hairline that catches the eye — the press's last registration tick */}
        <g className="focal-qmark__tick" aria-hidden="true">
          <line
            x1="240"
            y1="22"
            x2="252"
            y2="22"
            stroke="var(--fqm-tone)"
            strokeWidth=".7"
            strokeLinecap="round"
            opacity=".6"
          />
          <line
            x1="240"
            y1="32"
            x2="248"
            y2="32"
            stroke="var(--fqm-tone)"
            strokeWidth=".55"
            strokeLinecap="round"
            opacity=".42"
          />
          <line
            x1="240"
            y1="42"
            x2="252"
            y2="42"
            stroke="var(--fqm-tone)"
            strokeWidth=".7"
            strokeLinecap="round"
            opacity=".6"
          />
          <circle cx="244" cy="22" r=".7" fill="var(--fqm-tone)" opacity=".7" />
          <circle cx="244" cy="42" r=".7" fill="var(--fqm-tone)" opacity=".7" />
        </g>
      </svg>
      </button>

      <figcaption className="focal-qmark__caption">
        <span className="focal-qmark__caption-rule" aria-hidden="true" />
        <span className="focal-qmark__caption-stack">
          <em className="focal-qmark__caption-verb">punctuation</em>
          <em className="focal-qmark__caption-line">the question, held open</em>
        </span>
        <span className="focal-qmark__caption-voice" aria-hidden="true">
          <span className="focal-qmark__caption-voice-letter">{VOICE_LETTER[voice]}</span>
          <span className="focal-qmark__caption-voice-rule" />
          <span className="focal-qmark__caption-voice-name">
            {voice === 'quiet' ? 'quiet cut' : voice === 'human' ? 'human hand' : 'bold signal'}
          </span>
        </span>
      </figcaption>
    </figure>
  )
}