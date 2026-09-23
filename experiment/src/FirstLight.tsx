import { useId } from 'react'

/**
 * FirstLight — the page's sky.
 *
 * A single horizon arc and a rising orb hang over the top of the page.
 * The orb's horizontal position follows scroll progress (set on the root
 * as --page-prog), so the sun reads the page from left (pre-dawn) to
 * right (late still). Voice colour shifts the orb's hue.
 */
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
  const groundId = `fl-ground-${id}`

  return (
    <div className="first-light" aria-hidden="true">
      <svg
        className="first-light__svg"
        viewBox="0 0 1600 900"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={skyId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(168, 197, 255, .16)" />
            <stop offset="22%" stopColor="rgba(168, 197, 255, .075)" />
            <stop offset="58%" stopColor="rgba(255, 220, 178, .03)" />
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
            <stop offset="55%" stopColor="rgba(255, 220, 180, .035)" />
            <stop offset="100%" stopColor="rgba(255, 220, 180, .085)" />
          </linearGradient>
          <linearGradient id={rayGradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(255, 232, 196, 0)" />
            <stop offset="22%" stopColor="rgba(255, 232, 196, .12)" />
            <stop offset="60%" stopColor="rgba(255, 220, 178, .05)" />
            <stop offset="100%" stopColor="rgba(255, 220, 178, 0)" />
          </linearGradient>
          <radialGradient id={orbGradId} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(255, 246, 220, .92)" />
            <stop offset="48%" stopColor="rgba(255, 226, 188, .62)" />
            <stop offset="82%" stopColor="rgba(244, 198, 152, .16)" />
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
          <linearGradient id={groundId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(168, 197, 255, 0)" />
            <stop offset="100%" stopColor="rgba(168, 197, 255, .04)" />
          </linearGradient>
        </defs>

        {/* sky wash — covers the full SVG so the whole top of the page glows */}
        <rect x="0" y="0" width="1600" height="900" fill={`url(#${skyId})`} />

        {/* a quiet ground wash that warms with scroll */}
        <rect className="first-light__ground" x="0" y="0" width="1600" height="900" fill={`url(#${groundId})`} />

        {/* the wash that drifts down toward the horizon line */}
        <rect className="first-light__wash" x="0" y="500" width="1600" height="400" fill={`url(#${washId})`} />

        {/* — stars, only at the very top, fading toward the horizon — */}
        <g className="first-light__stars" fill="rgba(255, 234, 200, .55)">
          <circle className="first-light__star first-light__star--a" cx="120" cy="62" r="0.95" />
          <circle className="first-light__star first-light__star--b" cx="372" cy="44" r="1.15" />
          <circle className="first-light__star first-light__star--c" cx="588" cy="82" r="0.75" />
          <circle className="first-light__star first-light__star--d" cx="848" cy="56" r="1.05" />
          <circle className="first-light__star first-light__star--e" cx="1080" cy="78" r="0.8" />
          <circle className="first-light__star first-light__star--f" cx="1242" cy="48" r="0.65" />
          <circle className="first-light__star first-light__star--g" cx="280" cy="124" r="0.6" />
          <circle className="first-light__star first-light__star--h" cx="744" cy="138" r="0.55" />
          <circle className="first-light__star first-light__star--i" cx="1180" cy="138" r="0.6" />
          <circle className="first-light__star first-light__star--j" cx="440" cy="190" r="0.45" />
          <circle className="first-light__star first-light__star--k" cx="900" cy="208" r="0.5" />
        </g>

        {/* — the dawn halo: a soft glow that warms the upper page — */}
        <ellipse
          className="first-light__halo"
          cx="800"
          cy="600"
          rx="900"
          ry="320"
          fill={`url(#${haloId})`}
        />

        {/* — light rays, drawn as long thin spokes from the rising sun — */}
        <g className="first-light__rays" stroke={`url(#${rayGradId})`} strokeLinecap="round" fill="none">
          {[
            { x1: 800, y1: 600, x2: 80,   y2: 100, w: 1.4, op: .65 },
            { x1: 800, y1: 600, x2: 220,  y2: 60,  w: .9,  op: .45 },
            { x1: 800, y1: 600, x2: 360,  y2: 30,  w: 1.1, op: .55 },
            { x1: 800, y1: 600, x2: 500,  y2: 16,  w: .7,  op: .35 },
            { x1: 800, y1: 600, x2: 640,  y2: 22,  w: .9,  op: .45 },
            { x1: 800, y1: 600, x2: 800,  y2: 18,  w: 1.2, op: .6  },
            { x1: 800, y1: 600, x2: 960,  y2: 22,  w: .9,  op: .45 },
            { x1: 800, y1: 600, x2: 1100, y2: 16,  w: .7,  op: .35 },
            { x1: 800, y1: 600, x2: 1240, y2: 30,  w: 1.1, op: .55 },
            { x1: 800, y1: 600, x2: 1380, y2: 60,  w: .9,  op: .45 },
            { x1: 800, y1: 600, x2: 1520, y2: 100, w: 1.4, op: .65 },
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

        {/* — the sun's first arc, drawn in one confident stroke — */}
        <path
          className="first-light__arc"
          d="M 200 600 A 600 600 0 0 1 1400 600"
          fill="none"
          stroke={`url(#${arcId})`}
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <path
          className="first-light__arc first-light__arc--second"
          d="M 320 620 A 480 480 0 0 1 1280 620"
          fill="none"
          stroke={`url(#${arcId})`}
          strokeWidth=".9"
          strokeLinecap="round"
          opacity=".4"
        />

        {/* — the horizon — a single confident rule the dawn rises from — */}
        <line
          className="first-light__horizon"
          x1="0"
          y1="600"
          x2="1600"
          y2="600"
          stroke={`url(#${horizonId})`}
          strokeWidth="1.4"
          strokeLinecap="round"
        />
        <line
          className="first-light__horizon first-light__horizon--trail"
          x1="120"
          y1="612"
          x2="1480"
          y2="612"
          stroke={`url(#${horizonId})`}
          strokeWidth=".4"
          strokeLinecap="round"
          opacity=".4"
        />

        {/* — the dawn orb itself, sliding across the sky with scroll.
     outer frame animates the fade-in; inner group is translated by scroll. — */}
        <g className="first-light__orb-frame">
          <g className="first-light__orb-group">
            <circle className="first-light__orb-aura" cx="800" cy="600" r="220" fill={`url(#${orbAuraId})`} />
            <circle className="first-light__orb-corona" cx="800" cy="600" r="148" fill={`url(#${orbCoronaId})`} />
            <circle className="first-light__orb" cx="800" cy="600" r="92" fill={`url(#${orbGradId})`} />
            <circle cx="800" cy="600" r="92" fill="none" stroke="rgba(255, 240, 214, .45)" strokeWidth=".6" />
            <circle cx="800" cy="600" r="74" fill="none" stroke="rgba(255, 240, 214, .18)" strokeWidth=".4" strokeDasharray="1 4" />
            <circle cx="800" cy="600" r="58" fill="none" stroke="rgba(255, 240, 214, .12)" strokeWidth=".3" strokeDasharray="1 6" />
          </g>
        </g>

        {/* — three thin tick marks at the horizon — hand-drawn registration points — */}
        <g
          className="first-light__ticks"
          stroke="rgba(255, 220, 178, .32)"
          strokeLinecap="round"
        >
          <line x1="540" y1="594" x2="540" y2="606" strokeWidth=".5" />
          <line x1="800" y1="590" x2="800" y2="610" strokeWidth=".55" />
          <line x1="1060" y1="594" x2="1060" y2="606" strokeWidth=".5" />
        </g>
      </svg>
    </div>
  )
}