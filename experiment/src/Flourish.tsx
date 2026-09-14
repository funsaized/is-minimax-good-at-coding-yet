import { useId } from 'react'
import type { CSSProperties } from 'react'
import type { WordId } from './notes'
import type { VoiceId } from './Press'

type FlourishProps = {
  voice: VoiceId
  active: WordId
  hovered: WordId | null
}

const VOICE_TONE: Record<VoiceId, string> = {
  quiet: 'var(--blue)',
  human: 'var(--coral)',
  bold: 'var(--acid)',
}

const WORD_TONE: Record<WordId, string> = {
  m3: 'var(--acid)',
  good: 'var(--coral)',
  yet: 'var(--blue)',
}

export function Flourish({ voice, active, hovered }: FlourishProps) {
  const display = hovered ?? active
  const style = { '--flourish-tone': VOICE_TONE[voice] } as CSSProperties
  const baseId = useId()
  const strokeId = `flourish-stroke-${baseId.replace(/:/g, '')}`
  const trailId = `flourish-trail-${baseId.replace(/:/g, '')}`

  return (
    <svg
      className="hero__flourish"
      viewBox="0 0 1200 64"
      preserveAspectRatio="none"
      aria-hidden="true"
      style={style}
    >
      <defs>
        <linearGradient id={strokeId} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
          <stop offset="8%" stopColor="currentColor" stopOpacity=".75" />
          <stop offset="92%" stopColor="currentColor" stopOpacity=".75" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={trailId} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
          <stop offset="12%" stopColor="currentColor" stopOpacity=".55" />
          <stop offset="88%" stopColor="currentColor" stopOpacity=".55" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>

      <g className="hero__flourish-group">
        <path
          className="hero__flourish-trail"
          d="M2 38 C 140 22, 260 54, 400 36 S 660 18, 800 38 S 1060 56, 1198 32"
          fill="none"
          stroke={`url(#${trailId})`}
          strokeWidth="1.1"
          strokeLinecap="round"
          strokeDasharray="100 100"
          pathLength="100"
        />
        <path
          className="hero__flourish-stroke"
          d="M2 38 C 140 22, 260 54, 400 36 S 660 18, 800 38 S 1060 56, 1198 32"
          fill="none"
          stroke={`url(#${strokeId})`}
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeDasharray="100 100"
          pathLength="100"
        />

        <path
          className="hero__flourish-tail hero__flourish-tail--start"
          d="M18 40 q -8 0 -14 -4 M18 40 q -6 6 -10 12 M22 40 q 4 -2 6 -6"
          fill="none"
          stroke="currentColor"
          strokeWidth=".8"
          strokeLinecap="round"
          opacity="0"
        />

        <path
          className="hero__flourish-tail hero__flourish-tail--end"
          d="M1192 32 c 6 -2 12 4 18 -2 M1196 32 c -2 6 -10 8 -14 4 M1188 32 c -4 6 -2 12 4 14"
          fill="none"
          stroke="currentColor"
          strokeWidth=".8"
          strokeLinecap="round"
          opacity="0"
        />

        <g className={`hero__flourish-node hero__flourish-node--m3 ${display === 'm3' ? 'is-active' : ''}`}>
          <circle className="hero__flourish-node-pulse" cx="240" cy="36" r="9" fill="none" stroke="currentColor" strokeWidth=".6" opacity=".35" />
          <circle className="hero__flourish-node-ring" cx="240" cy="36" r="5" fill="none" stroke="currentColor" strokeWidth=".7" opacity=".5" />
          <circle className="hero__flourish-node-bead" cx="240" cy="36" r="2.6" fill="currentColor" />
          <text x="240" y="14" textAnchor="middle" className="hero__flourish-label" fontFamily="ui-monospace, monospace" fontSize="6.4" letterSpacing="1.4" fill="currentColor">i · M3</text>
        </g>

        <g className={`hero__flourish-node hero__flourish-node--good ${display === 'good' ? 'is-active' : ''}`}>
          <circle className="hero__flourish-node-pulse" cx="600" cy="38" r="9" fill="none" stroke="currentColor" strokeWidth=".6" opacity=".35" />
          <circle className="hero__flourish-node-ring" cx="600" cy="38" r="5" fill="none" stroke="currentColor" strokeWidth=".7" opacity=".5" />
          <circle className="hero__flourish-node-bead" cx="600" cy="38" r="2.6" fill="currentColor" />
          <text x="600" y="58" textAnchor="middle" className="hero__flourish-label" fontFamily="ui-monospace, monospace" fontSize="6.4" letterSpacing="1.4" fill="currentColor">ii · GOOD</text>
        </g>

        <g className={`hero__flourish-node hero__flourish-node--yet ${display === 'yet' ? 'is-active' : ''}`}>
          <circle className="hero__flourish-node-pulse" cx="960" cy="36" r="9" fill="none" stroke="currentColor" strokeWidth=".6" opacity=".35" />
          <circle className="hero__flourish-node-ring" cx="960" cy="36" r="5" fill="none" stroke="currentColor" strokeWidth=".7" opacity=".5" />
          <circle className="hero__flourish-node-bead" cx="960" cy="36" r="2.6" fill="currentColor" />
          <text x="960" y="14" textAnchor="middle" className="hero__flourish-label" fontFamily="ui-monospace, monospace" fontSize="6.4" letterSpacing="1.4" fill="currentColor">iii · YET?</text>
        </g>
      </g>
    </svg>
  )
}