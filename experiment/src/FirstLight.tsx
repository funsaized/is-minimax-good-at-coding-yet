import { useId } from 'react'

export function FirstLight() {
  const id = useId().replace(/:/g, '')
  const skyId = `fl-sky-${id}`
  const arcId = `fl-arc-${id}`
  const haloId = `fl-halo-${id}`
  const horizonId = `fl-horizon-${id}`

  return (
    <div className="first-light" aria-hidden="true">
      <svg
        className="first-light__svg"
        viewBox="0 0 1400 320"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={skyId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(255, 226, 188, .16)" />
            <stop offset="22%" stopColor="rgba(255, 220, 180, .085)" />
            <stop offset="58%" stopColor="rgba(255, 220, 178, .025)" />
            <stop offset="100%" stopColor="rgba(255, 220, 178, 0)" />
          </linearGradient>
          <radialGradient id={arcId} cx="50%" cy="100%" r="62%">
            <stop offset="0%" stopColor="rgba(255, 224, 188, .65)" />
            <stop offset="48%" stopColor="rgba(255, 218, 176, .16)" />
            <stop offset="100%" stopColor="rgba(255, 218, 176, 0)" />
          </radialGradient>
          <radialGradient id={haloId} cx="50%" cy="100%" r="58%">
            <stop offset="0%" stopColor="rgba(255, 236, 208, .22)" />
            <stop offset="60%" stopColor="rgba(255, 218, 178, .05)" />
            <stop offset="100%" stopColor="rgba(255, 218, 178, 0)" />
          </radialGradient>
          <linearGradient id={horizonId} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(255, 220, 178, 0)" />
            <stop offset="14%" stopColor="rgba(255, 220, 178, .22)" />
            <stop offset="50%" stopColor="rgba(255, 222, 184, .42)" />
            <stop offset="86%" stopColor="rgba(255, 220, 178, .22)" />
            <stop offset="100%" stopColor="rgba(255, 220, 178, 0)" />
          </linearGradient>
        </defs>

        <rect x="0" y="0" width="1400" height="320" fill={`url(#${skyId})`} />

        {/* — the dawn halo — a soft glow rising above the horizon — */}
        <ellipse
          className="first-light__halo"
          cx="700"
          cy="260"
          rx="640"
          ry="220"
          fill={`url(#${haloId})`}
        />

        {/* — the sun's first arc — a single thin curve catching the light — */}
        <path
          className="first-light__arc"
          d="M 460 250 A 240 240 0 0 1 940 250"
          fill="none"
          stroke={`url(#${arcId})`}
          strokeWidth="1.2"
          strokeLinecap="round"
        />

        {/* — the horizon — a single confident rule the dawn rises from — */}
        <line
          className="first-light__horizon"
          x1="0"
          y1="252"
          x2="1400"
          y2="252"
          stroke={`url(#${horizonId})`}
          strokeWidth="1.4"
          strokeLinecap="round"
        />

        {/* — a handful of stars — placed by hand, not by algorithm — */}
        <g className="first-light__stars" fill="rgba(255, 234, 200, .68)">
          <circle className="first-light__star first-light__star--a" cx="162" cy="62" r="0.85" />
          <circle className="first-light__star first-light__star--b" cx="372" cy="44" r="1.05" />
          <circle className="first-light__star first-light__star--c" cx="588" cy="82" r="0.7" />
          <circle className="first-light__star first-light__star--d" cx="848" cy="56" r="0.95" />
          <circle className="first-light__star first-light__star--e" cx="1080" cy="78" r="0.75" />
          <circle className="first-light__star first-light__star--f" cx="1242" cy="48" r="0.6" />
          <circle className="first-light__star first-light__star--g" cx="280" cy="124" r="0.55" />
          <circle className="first-light__star first-light__star--h" cx="744" cy="138" r="0.5" />
          <circle className="first-light__star first-light__star--i" cx="1180" cy="138" r="0.55" />
        </g>

        {/* — three thin tick marks at the horizon — hand-drawn registration points — */}
        <g
          className="first-light__ticks"
          stroke="rgba(255, 220, 178, .42)"
          strokeLinecap="round"
        >
          <line x1="500" y1="246" x2="500" y2="258" strokeWidth=".5" />
          <line x1="700" y1="244" x2="700" y2="260" strokeWidth=".55" />
          <line x1="900" y1="246" x2="900" y2="258" strokeWidth=".5" />
        </g>
      </svg>
    </div>
  )
}