import { useId } from 'react'

export function FirstLight() {
  const id = useId().replace(/:/g, '')
  const washId = `first-light-wash-${id}`
  const edgeId = `first-light-edge-${id}`

  return (
    <div className="first-light" aria-hidden="true">
      <svg
        className="first-light__svg"
        viewBox="0 0 1400 320"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={washId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(255, 222, 184, .14)" />
            <stop offset="22%" stopColor="rgba(255, 218, 178, .07)" />
            <stop offset="55%" stopColor="rgba(255, 222, 184, .02)" />
            <stop offset="100%" stopColor="rgba(255, 222, 184, 0)" />
          </linearGradient>
          <linearGradient id={edgeId} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(255, 220, 178, 0)" />
            <stop offset="32%" stopColor="rgba(255, 220, 178, .14)" />
            <stop offset="50%" stopColor="rgba(255, 222, 184, .2)" />
            <stop offset="68%" stopColor="rgba(255, 220, 178, .14)" />
            <stop offset="100%" stopColor="rgba(255, 220, 178, 0)" />
          </linearGradient>
        </defs>

        <rect x="0" y="0" width="1400" height="320" fill={`url(#${washId})`} />

        <rect
          className="first-light__edge"
          x="0"
          y="0"
          width="1400"
          height="1.2"
          fill={`url(#${edgeId})`}
        />

        <g className="first-light__particles" fill="rgba(255, 226, 188, .55)">
          <circle cx="180" cy="46" r=".8" />
          <circle cx="412" cy="78" r="1.1" />
          <circle cx="678" cy="36" r=".9" />
          <circle cx="924" cy="64" r="1" />
          <circle cx="1180" cy="42" r=".7" />
          <circle cx="262" cy="112" r=".5" />
          <circle cx="852" cy="98" r=".6" />
          <circle cx="1096" cy="124" r=".5" />
        </g>

        <g className="first-light__rays" stroke="rgba(255, 220, 178, .35)">
          <line x1="540" y1="0" x2="640" y2="180" strokeWidth=".35" strokeDasharray="0.8 3.2" />
          <line x1="700" y1="0" x2="780" y2="180" strokeWidth=".35" strokeDasharray="0.8 3.2" />
          <line x1="860" y1="0" x2="920" y2="180" strokeWidth=".35" strokeDasharray="0.8 3.2" />
        </g>
      </svg>
    </div>
  )
}