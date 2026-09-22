import { useId, type CSSProperties } from 'react'

type TypeBedProps = {
  tone?: string
}

const TICKS: Array<{ pt: string; note: string }> = [
  { pt: '60', note: 'display' },
  { pt: '36', note: 'subhead' },
  { pt: '24', note: 'body' },
  { pt: '14', note: 'mark' },
]

export function TypeBed({ tone = 'currentColor' }: TypeBedProps) {
  const id = useId().replace(/:/g, '')
  const style = { '--type-bed-tone': tone } as CSSProperties

  return (
    <div className="type-bed" aria-hidden="true" style={style}>
      <svg viewBox="0 0 30 320" preserveAspectRatio="xMinYMin meet" className="type-bed__svg">
        <line
          x1="15"
          y1="34"
          x2="15"
          y2="298"
          stroke={tone}
          strokeWidth=".5"
          strokeDasharray="1.2 2.4"
          opacity=".55"
        />

        <g className="type-bed__head">
          <circle cx="15" cy="28" r="3" fill="none" stroke={tone} strokeWidth=".55" opacity=".7" />
          <circle cx="15" cy="28" r="1" fill={tone} opacity=".9" />
          <line x1="15" y1="22" x2="15" y2="14" stroke={tone} strokeWidth=".45" opacity=".55" />
          <line x1="11" y1="14" x2="19" y2="14" stroke={tone} strokeWidth=".45" opacity=".55" />
        </g>

        {TICKS.map((tick, idx) => {
          const y = 286 - idx * 70
          const isMajor = idx % 2 === 0
          return (
            <g key={`${tick.pt}-${id}`} className={`type-bed__tick ${isMajor ? 'is-major' : ''}`}>
              <line
                x1={isMajor ? 4 : 8}
                y1={y}
                x2={isMajor ? 26 : 22}
                y2={y}
                stroke={tone}
                strokeWidth={isMajor ? '.5' : '.4'}
                opacity={isMajor ? '.6' : '.45'}
              />
              <line
                x1="15"
                y1={y}
                x2="15"
                y2={y + (isMajor ? 5 : 3)}
                stroke={tone}
                strokeWidth=".4"
                opacity=".5"
              />
              <text
                x="2"
                y={y - 5}
                textAnchor="start"
                fontFamily="ui-monospace, 'SFMono-Regular', Menlo, monospace"
                fontSize={isMajor ? '6.5' : '5.5'}
                letterSpacing=".3"
                fill={tone}
                opacity={isMajor ? '.85' : '.65'}
              >
                {tick.pt}
              </text>
              <text
                x="28"
                y={y - 5}
                textAnchor="end"
                fontFamily="ui-monospace, 'SFMono-Regular', Menlo, monospace"
                fontSize="4.6"
                letterSpacing=".6"
                fill={tone}
                opacity=".5"
              >
                pt
              </text>
            </g>
          )
        })}

        <g className="type-bed__foot">
          <line x1="9" y1="298" x2="21" y2="298" stroke={tone} strokeWidth=".55" opacity=".7" />
          <line x1="15" y1="298" x2="15" y2="304" stroke={tone} strokeWidth=".55" opacity=".7" />
          <circle cx="15" cy="308" r="1.4" fill={tone} opacity=".7" />
        </g>
      </svg>

      <span className="type-bed__caption">
        <em>type-high</em>
        <span>in points</span>
      </span>
    </div>
  )
}