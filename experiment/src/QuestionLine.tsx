import { useId, type CSSProperties } from 'react'
import type { WordId } from './notes'

type QuestionLineProps = {
  active: WordId
  hover: WordId | null
  tone: string
}

const WORD_INFO: Record<WordId, { x: number; label: string; mark: string }> = {
  m3: { x: 220, label: 'stet', mark: '⌇' },
  good: { x: 500, label: 'caret', mark: '∧' },
  yet: { x: 780, label: 'query', mark: '?' },
}

const CONTINUOUS_PATH =
  'M12 28c40-6 90 6 130-2s60-8 80-4 60 8 100 2 70-6 110-2 80-6 130-2 90 4 130-2 80-6 100-2 60 6 100 0'

export function QuestionLine({ active, hover, tone }: QuestionLineProps) {
  const baseId = useId().replace(/:/g, '')
  const grainId = `question-line-grain-${baseId}`
  const inkId = `question-line-ink-${baseId}`
  const haloId = `question-line-halo-${baseId}`
  const fillId = `question-line-fill-${baseId}`

  return (
    <figure
      className="question-line"
      aria-hidden="true"
      style={{ '--question-line-tone': tone } as CSSProperties}
    >
      <svg className="question-line__svg" viewBox="0 0 1000 56" preserveAspectRatio="xMidYMid meet">
        <defs>
          <filter id={grainId} x="-2%" y="-50%" width="104%" height="200%">
            <feTurbulence type="fractalNoise" baseFrequency="0.95" numOctaves="2" seed="83" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 .14  0 0 0 0 .12  0 0 0 0 .19  0 0 0 .05 0" />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
          <filter id={inkId} x="-2%" y="-50%" width="104%" height="200%">
            <feTurbulence type="fractalNoise" baseFrequency="2.2" numOctaves="2" seed="89" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .55 0" />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
          <radialGradient id={haloId} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="currentColor" stopOpacity=".28" />
            <stop offset="55%" stopColor="currentColor" stopOpacity=".07" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </radialGradient>
          <linearGradient id={fillId} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="currentColor" stopOpacity=".22" />
            <stop offset="50%" stopColor="currentColor" stopOpacity=".7" />
            <stop offset="100%" stopColor="currentColor" stopOpacity=".22" />
          </linearGradient>
        </defs>

        <path
          d={CONTINUOUS_PATH}
          fill="none"
          stroke={`url(#${fillId})`}
          strokeWidth="14"
          strokeLinecap="round"
          opacity="0"
          className="question-line__wash"
          filter={`url(#${grainId})`}
        />

        <path
          d={CONTINUOUS_PATH}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          pathLength="100"
          strokeDasharray="100 100"
          strokeDashoffset="100"
          className="question-line__stroke"
          filter={`url(#${inkId})`}
        />

        <path
          d={CONTINUOUS_PATH}
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          pathLength="100"
          strokeDasharray="0.6 3.2"
          opacity="0"
          className="question-line__rail"
        />

        {(['m3', 'good', 'yet'] as WordId[]).map((id) => (
          <circle
            key={`halo-${id}`}
            cx={WORD_INFO[id].x}
            cy={26}
            r={id === active ? 20 : id === hover ? 15 : 11}
            fill={`url(#${haloId})`}
            className={`question-line__halo-dot question-line__halo-dot--${id} ${active === id ? 'is-active' : ''} ${hover === id ? 'is-hover' : ''}`}
          />
        ))}

        {(['m3', 'good', 'yet'] as WordId[]).map((id) => (
          <g
            key={`bead-${id}`}
            transform={`translate(${WORD_INFO[id].x} 26)`}
            className={`question-line__bead-group question-line__bead-group--${id} ${active === id ? 'is-active' : ''} ${hover === id ? 'is-hover' : ''}`}
          >
            <circle r={active === id ? 16 : 11} fill="none" stroke="currentColor" strokeWidth=".35" opacity=".35" className="question-line__bead-glow" />
            <circle r={active === id ? 8 : hover === id ? 6.5 : 5} fill="currentColor" className="question-line__bead-core" />
            <circle r={active === id ? 13 : 9} fill="none" stroke="currentColor" strokeWidth=".5" strokeDasharray=".8 1.6" opacity=".7" className="question-line__bead-ring" />
            <circle r={active === id ? 19 : 14} fill="none" stroke="currentColor" strokeWidth=".4" opacity=".3" className="question-line__bead-ring question-line__bead-ring--outer" />
          </g>
        ))}

        {(['m3', 'good', 'yet'] as WordId[]).map((id) => (
          <g
            key={`mark-${id}`}
            transform={`translate(${WORD_INFO[id].x} 50)`}
            className={`question-line__mark question-line__mark--${id} ${active === id ? 'is-active' : ''} ${hover === id ? 'is-hover' : ''}`}
          >
            <text textAnchor="middle" fontFamily="'Iowan Old Style', Georgia, serif" fontStyle="italic" fontSize="10" letterSpacing=".22em" fill="currentColor">{WORD_INFO[id].mark}</text>
            <text y="11" textAnchor="middle" fontFamily="ui-monospace, ui-monospace, monospace" fontSize="7" letterSpacing=".26em" fill="currentColor" opacity=".78">{WORD_INFO[id].label}</text>
          </g>
        ))}

        <path
          d="M880 28c14-2 28 4 42-1s28-4 42-1 28 4 36 1"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.1"
          strokeLinecap="round"
          pathLength="100"
          strokeDasharray="100 100"
          strokeDashoffset="100"
          className="question-line__tail"
          filter={`url(#${inkId})`}
        />
        <circle cx="1000" cy="28" r="2" fill="currentColor" className="question-line__tail-bead" />
      </svg>
    </figure>
  )
}