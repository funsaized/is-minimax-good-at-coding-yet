import { useId } from 'react'
import type { CSSProperties } from 'react'
import type { WordId } from './notes'
import type { VoiceId } from './Press'

type TitleTraceProps = {
  voice: VoiceId
  active: WordId
  hovered: WordId | null
}

const VOICE_TONE: Record<VoiceId, string> = {
  quiet: 'var(--blue)',
  human: 'var(--coral)',
  bold: 'var(--acid)',
}

const WORD_LABEL: Record<WordId, string> = {
  m3: 'i · M3',
  good: 'ii · good at',
  yet: 'iii · yet?',
}

export function TitleTrace({ voice, active, hovered }: TitleTraceProps) {
  const display = hovered ?? active
  const baseId = useId()
  const ruleId = `title-trace-rule-${baseId.replace(/:/g, '')}`
  const style = { '--trace-tone': VOICE_TONE[voice] } as CSSProperties

  return (
    <svg
      className="title-trace"
      viewBox="0 0 1200 36"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
      style={style}
    >
      <defs>
        <linearGradient id={ruleId} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
          <stop offset="10%" stopColor="currentColor" stopOpacity=".55" />
          <stop offset="50%" stopColor="currentColor" stopOpacity=".85" />
          <stop offset="90%" stopColor="currentColor" stopOpacity=".55" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>

      <line
        x1="2"
        y1="18"
        x2="1198"
        y2="18"
        stroke={`url(#${ruleId})`}
        strokeWidth=".8"
        className="title-trace__rule"
      />

      <g className={`title-trace__node title-trace__node--m3 ${display === 'm3' ? 'is-active' : ''}`}>
        <circle className="title-trace__node-pulse" cx="240" cy="18" r="6" fill="none" stroke="currentColor" strokeWidth=".55" />
        <circle className="title-trace__node-ring" cx="240" cy="18" r="3.4" fill="none" stroke="currentColor" strokeWidth=".6" />
        <circle className="title-trace__node-bead" cx="240" cy="18" r="1.6" fill="currentColor" />
        <line x1="240" y1="3" x2="240" y2="11" stroke="currentColor" strokeWidth=".4" opacity=".6" />
        <line x1="240" y1="25" x2="240" y2="33" stroke="currentColor" strokeWidth=".4" opacity=".6" />
        <text
          x="240"
          y="3.6"
          textAnchor="middle"
          fontFamily="ui-monospace, monospace"
          fontSize="3.6"
          letterSpacing="1.4"
          fill="currentColor"
          className="title-trace__label"
        >
          {WORD_LABEL.m3}
        </text>
      </g>

      <g className={`title-trace__node title-trace__node--good ${display === 'good' ? 'is-active' : ''}`}>
        <circle className="title-trace__node-pulse" cx="600" cy="18" r="6" fill="none" stroke="currentColor" strokeWidth=".55" />
        <circle className="title-trace__node-ring" cx="600" cy="18" r="3.4" fill="none" stroke="currentColor" strokeWidth=".6" />
        <circle className="title-trace__node-bead" cx="600" cy="18" r="1.6" fill="currentColor" />
        <line x1="600" y1="3" x2="600" y2="11" stroke="currentColor" strokeWidth=".4" opacity=".6" />
        <line x1="600" y1="25" x2="600" y2="33" stroke="currentColor" strokeWidth=".4" opacity=".6" />
        <text
          x="600"
          y="3.6"
          textAnchor="middle"
          fontFamily="ui-monospace, monospace"
          fontSize="3.6"
          letterSpacing="1.4"
          fill="currentColor"
          className="title-trace__label"
        >
          {WORD_LABEL.good}
        </text>
      </g>

      <g className={`title-trace__node title-trace__node--yet ${display === 'yet' ? 'is-active' : ''}`}>
        <circle className="title-trace__node-pulse" cx="960" cy="18" r="6" fill="none" stroke="currentColor" strokeWidth=".55" />
        <circle className="title-trace__node-ring" cx="960" cy="18" r="3.4" fill="none" stroke="currentColor" strokeWidth=".6" />
        <circle className="title-trace__node-bead" cx="960" cy="18" r="1.6" fill="currentColor" />
        <line x1="960" y1="3" x2="960" y2="11" stroke="currentColor" strokeWidth=".4" opacity=".6" />
        <line x1="960" y1="25" x2="960" y2="33" stroke="currentColor" strokeWidth=".4" opacity=".6" />
        <text
          x="960"
          y="3.6"
          textAnchor="middle"
          fontFamily="ui-monospace, monospace"
          fontSize="3.6"
          letterSpacing="1.4"
          fill="currentColor"
          className="title-trace__label"
        >
          {WORD_LABEL.yet}
        </text>
      </g>
    </svg>
  )
}
