import type { CSSProperties } from 'react'

type ChaseFrameProps = {
  tone?: string
  intensity?: 'light' | 'full'
  className?: string
  children?: React.ReactNode
}

type CornerProps = { tone: string }

function Corner({ tone }: CornerProps) {
  return (
    <svg viewBox="0 0 18 18" aria-hidden="true" className="chase-frame__corner">
      <g fill="none" stroke={tone} strokeWidth=".7" strokeLinecap="square">
        <path d="M.5 .5h17" />
        <path d="M.5 .5v17" />
        <path d="M.5 .5h17M.5 .5v17" strokeWidth=".25" strokeDasharray="1.4 1.6" opacity=".6" />
      </g>
      <circle cx="2.4" cy="2.4" r="1.2" fill="none" stroke={tone} strokeWidth=".5" />
      <circle cx="2.4" cy="2.4" r=".6" fill={tone} />
      <path
        d="M5.5 .5v5M.5 5.5h5"
        fill="none"
        stroke={tone}
        strokeWidth=".25"
        strokeDasharray="1 1.2"
        opacity=".55"
      />
    </svg>
  )
}

function Tick({ tone, side }: { tone: string; side: 'top' | 'bottom' | 'left' | 'right' }) {
  const isHoriz = side === 'top' || side === 'bottom'
  const w = isHoriz ? 1 : 7
  const h = isHoriz ? 7 : 1
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio="none"
      aria-hidden="true"
      className={`chase-frame__tick chase-frame__tick--${side}`}
    >
      <line
        x1={isHoriz ? 0 : 0}
        y1={isHoriz ? 0 : 0}
        x2={isHoriz ? w : 0}
        y2={isHoriz ? 0 : h}
        stroke={tone}
        strokeWidth=".5"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function ChaseFrame({ tone = 'currentColor', intensity = 'full', className = '', children }: ChaseFrameProps) {
  const style = { '--chase-tone': tone } as CSSProperties
  return (
    <div
      className={`chase-frame chase-frame--${intensity} ${className}`}
      style={style}
      aria-hidden="false"
    >
      <span className="chase-frame__rule chase-frame__rule--outer" />
      <span className="chase-frame__rule chase-frame__rule--inner" />
      <span className="chase-frame__bed" aria-hidden="true">
        <span className="chase-frame__grain" aria-hidden="true" />
      </span>
      <span className="chase-frame__corner chase-frame__corner--tl">
        <Corner tone={tone} />
      </span>
      <span className="chase-frame__corner chase-frame__corner--tr">
        <Corner tone={tone} />
      </span>
      <span className="chase-frame__corner chase-frame__corner--bl">
        <Corner tone={tone} />
      </span>
      <span className="chase-frame__corner chase-frame__corner--br">
        <Corner tone={tone} />
      </span>
      <span className="chase-frame__ticks" aria-hidden="true">
        <Tick tone={tone} side="top" />
        <Tick tone={tone} side="bottom" />
        <Tick tone={tone} side="left" />
        <Tick tone={tone} side="right" />
      </span>
      <span className="chase-frame__inner">{children}</span>
    </div>
  )
}