import { useId } from 'react'
import type { CSSProperties } from 'react'
import type { WordId } from './notes'
import type { VoiceId } from './Press'

type TitleRuleProps = {
  voice: VoiceId
  active: WordId
  hovered: WordId | null
  setToday: string
}

const VOICE_TONE: Record<VoiceId, string> = {
  quiet: 'var(--blue)',
  human: 'var(--coral)',
  bold: 'var(--acid)',
}

const VOICE_LABEL: Record<VoiceId, string> = {
  quiet: 'quiet cut',
  human: 'human hand',
  bold: 'bold signal',
}

const NODES: { id: WordId; mark: string; label: string; x: number }[] = [
  { id: 'm3', mark: 'stet', label: 'i · M3', x: 240 },
  { id: 'good', mark: 'caret', label: 'ii · good at', x: 600 },
  { id: 'yet', mark: 'query', label: 'iii · yet?', x: 960 },
]

export function TitleRule({ voice, active, hovered, setToday }: TitleRuleProps) {
  const display = hovered ?? active
  const baseId = useId()
  const ruleId = `title-rule-${baseId.replace(/:/g, '')}`
  const style = { '--rule-tone': VOICE_TONE[voice] } as CSSProperties

  return (
    <figure className="title-rule" aria-hidden="true" style={style}>
      <svg
        className="title-rule__arc"
        viewBox="0 0 1200 64"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={ruleId} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
            <stop offset="8%" stopColor="currentColor" stopOpacity=".55" />
            <stop offset="50%" stopColor="currentColor" stopOpacity=".9" />
            <stop offset="92%" stopColor="currentColor" stopOpacity=".55" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
          <filter id={`${ruleId}-grain`} x="-2%" y="-50%" width="104%" height="200%">
            <feTurbulence type="fractalNoise" baseFrequency="3.2" numOctaves="2" seed="3" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .55 0" />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
        </defs>

        <g filter={`url(#${ruleId}-grain)`} opacity=".85">
          <path
            className="title-rule__arc-stroke"
            d="M2 42 C 90 42, 130 18, 240 18 S 460 50, 600 28 S 820 6, 960 22 S 1110 42, 1198 36"
            fill="none"
            stroke={`url(#${ruleId})`}
            strokeWidth="1"
            strokeLinecap="round"
            pathLength="100"
          />
        </g>

        <g className="title-rule__nub title-rule__nub--start">
          <circle cx="2" cy="42" r="1.5" fill="currentColor" />
        </g>
        <g className="title-rule__nub title-rule__nub--end">
          <circle cx="1198" cy="36" r="1.6" fill="currentColor" />
          <circle cx="1198" cy="36" r="4" fill="none" stroke="currentColor" strokeWidth=".35" opacity=".4" />
        </g>

        {NODES.map((node, index) => {
          const isActive = node.id === display
          const y = node.id === 'good' ? 28 : node.id === 'm3' ? 18 : 22
          return (
            <g
              key={node.id}
              className={`title-rule__node title-rule__node--${node.id} ${isActive ? 'is-active' : ''}`}
              style={{ animationDelay: `${1.05 + index * .18}s` }}
            >
              <line
                x1={node.x}
                y1={y - 14}
                x2={node.x}
                y2={y - 5}
                stroke="currentColor"
                strokeWidth=".45"
                opacity=".55"
              />
              <line
                x1={node.x}
                y1={y + 5}
                x2={node.x}
                y2={y + 14}
                stroke="currentColor"
                strokeWidth=".45"
                opacity=".55"
              />
              <circle
                className="title-rule__node-pulse"
                cx={node.x}
                cy={y}
                r="8"
                fill="none"
                stroke="currentColor"
                strokeWidth=".5"
              />
              <circle
                className="title-rule__node-ring"
                cx={node.x}
                cy={y}
                r="5.5"
                fill="none"
                stroke="currentColor"
                strokeWidth=".7"
              />
              <circle
                className="title-rule__node-bead"
                cx={node.x}
                cy={y}
                r="2.4"
                fill="currentColor"
              />
              <text
                className="title-rule__node-label"
                x={node.x}
                y={y - 18}
                textAnchor="middle"
                fontFamily="ui-monospace, monospace"
                fontSize="9"
                letterSpacing="2"
                fill="currentColor"
                opacity=".7"
              >
                {node.mark}
              </text>
            </g>
          )
        })}
      </svg>

      <figcaption className="title-rule__caption">
        <span className="title-rule__caption-mark" aria-hidden="true">
          <svg viewBox="0 0 12 12">
            <path d="M2 6h8M6 2v8" stroke="currentColor" strokeWidth=".7" strokeLinecap="round" />
          </svg>
        </span>
        <span className="title-rule__caption-text">
          composed by hand · set in <em>{VOICE_LABEL[voice]}</em> · {setToday}
        </span>
        <span className="title-rule__caption-mark title-rule__caption-mark--alt" aria-hidden="true">
          <svg viewBox="0 0 12 12">
            <path d="M2 6h8M6 2v8" stroke="currentColor" strokeWidth=".7" strokeLinecap="round" />
          </svg>
        </span>
      </figcaption>
    </figure>
  )
}
