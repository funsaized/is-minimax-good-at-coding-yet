import { useId } from 'react'

export function FirstLight() {
  const id = useId().replace(/:/g, '')
  const skyId = `fl-sky-${id}`
  const arcId = `fl-arc-${id}`
  const haloId = `fl-halo-${id}`
  const horizonId = `fl-horizon-${id}`
  const washId = `fl-wash-${id}`
  const rayGradId = `fl-ray-${id}`
  const orbGradId = `fl-orb-${id}`
  const orbAuraId = `fl-orb-aura-${id}`
  const orbCoronaId = `fl-orb-corona-${id}`

  return (
    <div className="first-light" aria-hidden="true">
      <svg
        className="first-light__svg"
        viewBox="0 0 1400 380"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={skyId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(255, 226, 188, .14)" />
            <stop offset="22%" stopColor="rgba(255, 220, 180, .075)" />
            <stop offset="58%" stopColor="rgba(255, 220, 178, .02)" />
            <stop offset="100%" stopColor="rgba(255, 220, 178, 0)" />
          </linearGradient>
          <radialGradient id={arcId} cx="50%" cy="100%" r="62%">
            <stop offset="0%" stopColor="rgba(255, 234, 198, .7)" />
            <stop offset="48%" stopColor="rgba(255, 222, 180, .18)" />
            <stop offset="100%" stopColor="rgba(255, 218, 176, 0)" />
          </radialGradient>
          <radialGradient id={haloId} cx="50%" cy="100%" r="62%">
            <stop offset="0%" stopColor="rgba(255, 240, 214, .28)" />
            <stop offset="38%" stopColor="rgba(255, 226, 188, .11)" />
            <stop offset="74%" stopColor="rgba(255, 220, 178, .03)" />
            <stop offset="100%" stopColor="rgba(255, 218, 178, 0)" />
          </radialGradient>
          <linearGradient id={horizonId} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(255, 220, 178, 0)" />
            <stop offset="14%" stopColor="rgba(255, 220, 178, .22)" />
            <stop offset="50%" stopColor="rgba(255, 226, 192, .5)" />
            <stop offset="86%" stopColor="rgba(255, 220, 178, .22)" />
            <stop offset="100%" stopColor="rgba(255, 220, 178, 0)" />
          </linearGradient>
          <linearGradient id={washId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(255, 220, 180, 0)" />
            <stop offset="50%" stopColor="rgba(255, 220, 180, .035)" />
            <stop offset="100%" stopColor="rgba(255, 220, 180, .075)" />
          </linearGradient>
          <linearGradient id={rayGradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(255, 232, 196, 0)" />
            <stop offset="20%" stopColor="rgba(255, 232, 196, .11)" />
            <stop offset="60%" stopColor="rgba(255, 220, 178, .05)" />
            <stop offset="100%" stopColor="rgba(255, 220, 178, 0)" />
          </linearGradient>
          <radialGradient id={orbGradId} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(255, 246, 220, .85)" />
            <stop offset="48%" stopColor="rgba(255, 226, 188, .6)" />
            <stop offset="82%" stopColor="rgba(244, 198, 152, .14)" />
            <stop offset="100%" stopColor="rgba(244, 198, 152, 0)" />
          </radialGradient>
          <radialGradient id={orbAuraId} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(255, 240, 214, .28)" />
            <stop offset="100%" stopColor="rgba(255, 220, 178, 0)" />
          </radialGradient>
          <radialGradient id={orbCoronaId} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(255, 246, 220, 0)" />
            <stop offset="40%" stopColor="rgba(255, 240, 214, .08)" />
            <stop offset="78%" stopColor="rgba(255, 230, 192, .025)" />
            <stop offset="100%" stopColor="rgba(255, 220, 178, 0)" />
          </radialGradient>
        </defs>

        <rect x="0" y="0" width="1400" height="380" fill={`url(#${skyId})`} />

        <rect className="first-light__wash" x="0" y="220" width="1400" height="160" fill={`url(#${washId})`} />

        {/* — the dawn orb itself, resting on the horizon — */}
        <g className="first-light__orb-group">
          <circle className="first-light__orb-aura" cx="700" cy="276" r="180" fill={`url(#${orbAuraId})`} />
          <circle className="first-light__orb-corona" cx="700" cy="276" r="120" fill={`url(#${orbCoronaId})`} />
          <circle className="first-light__orb" cx="700" cy="276" r="78" fill={`url(#${orbGradId})`} />
          <circle cx="700" cy="276" r="78" fill="none" stroke="rgba(255, 240, 214, .45)" strokeWidth=".6" />
          <circle cx="700" cy="276" r="64" fill="none" stroke="rgba(255, 240, 214, .18)" strokeWidth=".4" strokeDasharray="1 4" />
        </g>

        {/* — the dawn halo — a soft glow rising above the horizon — */}
        <ellipse
          className="first-light__halo"
          cx="700"
          cy="280"
          rx="720"
          ry="260"
          fill={`url(#${haloId})`}
        />

        {/* — light rays, drawn in hand-spaced spokes from the rising sun — */}
        <g className="first-light__rays" stroke={`url(#${rayGradId})`} strokeLinecap="round" fill="none">
          {[
            { x1: 700, y1: 276, x2: 180, y2: 8, w: 1.4, op: .7 },
            { x1: 700, y1: 276, x2: 260, y2: 4, w: .9, op: .45 },
            { x1: 700, y1: 276, x2: 360, y2: 0, w: 1.1, op: .55 },
            { x1: 700, y1: 276, x2: 460, y2: 8, w: .7, op: .35 },
            { x1: 700, y1: 276, x2: 580, y2: 12, w: .9, op: .45 },
            { x1: 700, y1: 276, x2: 820, y2: 12, w: .9, op: .45 },
            { x1: 700, y1: 276, x2: 940, y2: 8, w: .7, op: .35 },
            { x1: 700, y1: 276, x2: 1040, y2: 0, w: 1.1, op: .55 },
            { x1: 700, y1: 276, x2: 1140, y2: 4, w: .9, op: .45 },
            { x1: 700, y1: 276, x2: 1220, y2: 8, w: 1.4, op: .7 },
          ].map((ray, i) => (
            <line
              key={`ray-${i}`}
              className={`first-light__ray first-light__ray--${i}`}
              x1={ray.x1}
              y1={ray.y1}
              x2={ray.x2}
              y2={ray.y2}
              strokeWidth={ray.w}
              opacity={ray.op}
            />
          ))}
        </g>

        {/* — the sun's first arc — a single thin curve catching the light — */}
        <path
          className="first-light__arc"
          d="M 440 272 A 260 260 0 0 1 960 272"
          fill="none"
          stroke={`url(#${arcId})`}
          strokeWidth="1.4"
          strokeLinecap="round"
        />

        {/* — a soft secondary arc, half a hand lower — */}
        <path
          className="first-light__arc first-light__arc--second"
          d="M 480 300 A 220 220 0 0 1 920 300"
          fill="none"
          stroke={`url(#${arcId})`}
          strokeWidth=".8"
          strokeLinecap="round"
          opacity=".4"
        />

        {/* — the horizon — a single confident rule the dawn rises from — */}
        <line
          className="first-light__horizon"
          x1="0"
          y1="276"
          x2="1400"
          y2="276"
          stroke={`url(#${horizonId})`}
          strokeWidth="1.4"
          strokeLinecap="round"
        />

        {/* — a thinner trail just below, drifting into the page — */}
        <line
          className="first-light__horizon first-light__horizon--trail"
          x1="120"
          y1="284"
          x2="1280"
          y2="284"
          stroke={`url(#${horizonId})`}
          strokeWidth=".4"
          strokeLinecap="round"
          opacity=".4"
        />

        {/* — a handful of stars — placed by hand, not by algorithm — */}
        <g className="first-light__stars" fill="rgba(255, 234, 200, .55)">
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
          stroke="rgba(255, 220, 178, .32)"
          strokeLinecap="round"
        >
          <line x1="500" y1="270" x2="500" y2="282" strokeWidth=".5" />
          <line x1="700" y1="268" x2="700" y2="284" strokeWidth=".55" />
          <line x1="900" y1="270" x2="900" y2="282" strokeWidth=".5" />
        </g>
      </svg>
    </div>
  )
}