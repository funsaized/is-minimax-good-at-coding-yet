import { useId, type CSSProperties } from 'react'
import type { VoiceId } from './App'

type FrontispieceProps = {
  voice: VoiceId
  setToday: string
}

function dateTokens(setToday: string) {
  const [month, day, year] = setToday.split(' ')
  const dayNum = parseInt(day, 10)
  return {
    month: month ?? '',
    day: Number.isFinite(dayNum) ? dayNum.toString().padStart(2, '0') : '',
    year: year ?? '',
  }
}

const PLATE_CAPTION: Record<VoiceId, { caption: string; sub: string }> = {
  quiet: {
    caption: 'fig. i — the press at first light',
    sub: 'a single chase, a single lever, the line held soft',
  },
  human: {
    caption: 'fig. i — the press set by hand',
    sub: 'the chase warms as the arm is pulled',
  },
  bold: {
    caption: 'FIG. I — THE PRESS AT FULL HEIGHT',
    sub: 'set in capital, heard once, in a single breath',
  },
}

export function Frontispiece({ voice, setToday }: FrontispieceProps) {
  const id = useId().replace(/:/g, '')
  const gradBaseId = `fp-base-${id}`
  const gradPlateId = `fp-plate-${id}`
  const gradPlatenId = `fp-platen-${id}`
  const gradArmId = `fp-arm-${id}`
  const gradSunId = `fp-sun-${id}`
  const gradHaloId = `fp-halo-${id}`
  const gradRollId = `fp-roll-${id}`

  const toneStyle = {
    '--fp-tone': `var(--${voice})`,
    '--fp-tone-deep': `var(--${voice}-deep)`,
  } as CSSProperties

  const tokens = dateTokens(setToday)
  const fullDate = `${tokens.month} ${tokens.day}, ${tokens.year}`
  const caption = PLATE_CAPTION[voice]

  const lineItalic: CSSProperties = {
    fontFamily: "'Iowan Old Style', 'Palatino Linotype', Georgia, serif",
    fontStyle: voice === 'bold' ? 'normal' : 'italic',
    fontWeight: voice === 'bold' ? 700 : voice === 'human' ? 500 : 400,
    letterSpacing: voice === 'bold' ? '-.022em' : '-.018em',
  }

  const lineDisplay: CSSProperties = {
    fontFamily:
      voice === 'bold'
        ? 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif'
        : "'Iowan Old Style', 'Palatino Linotype', Georgia, serif",
    fontStyle: voice === 'bold' ? 'normal' : 'italic',
    fontWeight: voice === 'bold' ? 700 : voice === 'human' ? 500 : 400,
    letterSpacing: voice === 'bold' ? '-.045em' : '-.022em',
    textTransform: voice === 'bold' ? 'uppercase' : 'none',
  }

  return (
    <figure
      className={`frontispiece frontispiece--${voice}`}
      style={toneStyle}
      aria-label={`Frontispiece · ${caption.caption.toLowerCase()}, set on ${fullDate}.`}
    >
      <svg
        className="frontispiece__defs"
        viewBox="0 0 1200 360"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={gradBaseId} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--fp-tone)" stopOpacity="0" />
            <stop offset="22%" stopColor="var(--fp-tone)" stopOpacity=".22" />
            <stop offset="50%" stopColor="var(--fp-tone)" stopOpacity=".36" />
            <stop offset="78%" stopColor="var(--fp-tone)" stopOpacity=".22" />
            <stop offset="100%" stopColor="var(--fp-tone)" stopOpacity="0" />
          </linearGradient>
          <radialGradient id={gradPlateId} cx="50%" cy="60%" r="62%">
            <stop offset="0%" stopColor="var(--fp-tone)" stopOpacity=".22" />
            <stop offset="64%" stopColor="var(--fp-tone)" stopOpacity=".06" />
            <stop offset="100%" stopColor="var(--fp-tone)" stopOpacity="0" />
          </radialGradient>
          <radialGradient id={gradPlatenId} cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="var(--fp-tone)" stopOpacity=".22" />
            <stop offset="100%" stopColor="var(--fp-tone)" stopOpacity="0" />
          </radialGradient>
          <linearGradient id={gradArmId} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--fp-tone)" stopOpacity="0" />
            <stop offset="14%" stopColor="var(--fp-tone)" stopOpacity=".55" />
            <stop offset="50%" stopColor="var(--fp-tone)" stopOpacity=".85" />
            <stop offset="86%" stopColor="var(--fp-tone)" stopOpacity=".55" />
            <stop offset="100%" stopColor="var(--fp-tone)" stopOpacity="0" />
          </linearGradient>
          <radialGradient id={gradSunId} cx="50%" cy="50%" r="55%">
            <stop offset="0%" stopColor="var(--fp-tone)" stopOpacity=".45" />
            <stop offset="48%" stopColor="var(--fp-tone)" stopOpacity=".18" />
            <stop offset="100%" stopColor="var(--fp-tone)" stopOpacity="0" />
          </radialGradient>
          <radialGradient id={gradHaloId} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--fp-tone)" stopOpacity=".18" />
            <stop offset="100%" stopColor="var(--fp-tone)" stopOpacity="0" />
          </radialGradient>
          <linearGradient id={gradRollId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--fp-tone)" stopOpacity=".42" />
            <stop offset="100%" stopColor="var(--fp-tone)" stopOpacity=".12" />
          </linearGradient>

          <pattern id={`fp-bed-${id}`} width="22" height="22" patternUnits="userSpaceOnUse">
            <path d="M0 22 L22 22" stroke="var(--fp-tone)" strokeWidth=".4" opacity=".22" />
            <path d="M11 0 L11 22" stroke="var(--fp-tone)" strokeWidth=".22" opacity=".12" />
          </pattern>

          <pattern id={`fp-grain-${id}`} width="6" height="6" patternUnits="userSpaceOnUse">
            <circle cx="1.4" cy="1.4" r=".3" fill="var(--fp-tone)" opacity=".14" />
            <circle cx="4.6" cy="3.2" r=".22" fill="var(--fp-tone)" opacity=".1" />
          </pattern>
        </defs>
      </svg>

      <span className="frontispiece__plate">
        <span className="frontispiece__plate-decor" aria-hidden="true">
          <svg viewBox="0 0 1200 360" preserveAspectRatio="none">
          {/* the paper tone behind the engraving — a single soft plate */}
          <rect
            x="0"
            y="0"
            width="1200"
            height="360"
            fill={`url(#${gradPlateId})`}
            opacity=".55"
          />

          {/* — the ground, a bed of quiet cross-hatch the press stands on — */}
          <rect
            className="frontispiece__bed"
            x="120"
            y="246"
            width="960"
            height="64"
            fill={`url(#fp-bed-${id})`}
            opacity=".7"
          />
          <line
            className="frontispiece__ground"
            x1="100"
            y1="246"
            x2="1100"
            y2="246"
            stroke="var(--fp-tone)"
            strokeWidth=".55"
            strokeLinecap="round"
            opacity=".55"
          />
          <line
            x1="160"
            y1="310"
            x2="1040"
            y2="310"
            stroke="var(--fp-tone)"
            strokeWidth=".35"
            strokeDasharray="1 4"
            opacity=".35"
          />

          {/* — the cobbles, hand-placed ticks beneath the bench — */}
          <g
            className="frontispiece__cobbles"
            stroke="var(--fp-tone)"
            strokeWidth=".4"
            strokeLinecap="round"
            opacity=".42"
          >
            {[
              { cx: 178, cy: 312 },
              { cx: 220, cy: 318 },
              { cx: 264, cy: 314 },
              { cx: 308, cy: 320 },
              { cx: 354, cy: 316 },
              { cx: 402, cy: 322 },
              { cx: 448, cy: 318 },
              { cx: 494, cy: 320 },
              { cx: 540, cy: 314 },
              { cx: 586, cy: 320 },
              { cx: 632, cy: 316 },
              { cx: 678, cy: 322 },
              { cx: 724, cy: 318 },
              { cx: 770, cy: 314 },
              { cx: 816, cy: 320 },
              { cx: 862, cy: 316 },
              { cx: 908, cy: 322 },
              { cx: 954, cy: 318 },
              { cx: 1000, cy: 316 },
              { cx: 1042, cy: 320 },
            ].map((tick, i) => (
              <line
                key={`cobble-${i}`}
                x1={tick.cx - 5}
                y1={tick.cy + 6}
                x2={tick.cx + 5}
                y2={tick.cy + 6}
              />
            ))}
          </g>

          {/* — the bench — a low slab the press sits on — */}
          <g className="frontispiece__bench" stroke="var(--fp-tone)" fill="none">
            <path
              d="M 180 246 L 180 268 L 1020 268 L 1020 246"
              strokeWidth=".7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <line x1="180" y1="268" x2="1020" y2="268" strokeWidth=".7" strokeLinecap="round" />
            <line x1="200" y1="250" x2="220" y2="250" strokeWidth=".45" opacity=".55" />
            <line x1="980" y1="250" x2="1000" y2="250" strokeWidth=".45" opacity=".55" />
            <path
              className="frontispiece__bench-leg frontispiece__bench-leg--l"
              d="M 192 268 L 188 282 L 196 282 Z"
              fill="var(--fp-tone)"
              opacity=".35"
            />
            <path
              className="frontispiece__bench-leg frontispiece__bench-leg--r"
              d="M 1008 268 L 1012 282 L 1004 282 Z"
              fill="var(--fp-tone)"
              opacity=".35"
            />
          </g>

          {/* — the chase (the bed of type) — a long oak plank with a frame and a single line of type — */}
          <g className="frontispiece__chase">
            <rect
              x="240"
              y="190"
              width="720"
              height="56"
              fill="rgba(8,11,22,.55)"
              stroke="var(--fp-tone)"
              strokeWidth=".55"
            />
            <rect
              x="248"
              y="198"
              width="704"
              height="40"
              fill={`url(#fp-grain-${id})`}
              opacity=".5"
            />
            <line
              x1="248"
              y1="218"
              x2="952"
              y2="218"
              stroke="var(--fp-tone)"
              strokeWidth=".35"
              strokeDasharray="1 3"
              opacity=".42"
            />

            {/* the line itself is overlaid by HTML, not painted here, so the
                voice-set stays legible at every container width */}

            {/* the two side-stops */}
            <g
              className="frontispiece__quoins"
              fill="var(--fp-tone)"
              opacity=".68"
            >
              <rect x="234" y="188" width="6" height="60" />
              <rect x="960" y="188" width="6" height="60" />
              <line x1="237" y1="190" x2="237" y2="246" stroke="rgba(8,11,22,.7)" strokeWidth=".4" />
              <line x1="963" y1="190" x2="963" y2="246" stroke="rgba(8,11,22,.7)" strokeWidth=".4" />
            </g>

            {/* the chase gutters, every pica of type-high — registration ticks */}
            <g
              className="frontispiece__chase-ticks"
              stroke="var(--fp-tone)"
              strokeWidth=".35"
              strokeLinecap="round"
              opacity=".55"
            >
              {Array.from({ length: 24 }, (_, i) => (
                <line
                  key={`gt-${i}`}
                  x1={252 + i * 29}
                  y1="184"
                  x2={252 + i * 29}
                  y2="190"
                />
              ))}
            </g>
          </g>

          {/* — the platen, a stout roller arm above the chase that presses the paper — */}
          <g className="frontispiece__platen">
            <ellipse
              cx="600"
              cy="158"
              rx="420"
              ry="12"
              fill={`url(#${gradRollId})`}
              opacity=".7"
            />
            <rect
              x="180"
              y="148"
              width="840"
              height="16"
              rx="2"
              fill="rgba(8,11,22,.5)"
              stroke="var(--fp-tone)"
              strokeWidth=".6"
            />
            <line x1="200" y1="156" x2="1000" y2="156" stroke="var(--fp-tone)" strokeWidth=".3" opacity=".5" />
            <circle cx="200" cy="156" r="2.4" fill="var(--fp-tone)" />
            <circle cx="1000" cy="156" r="2.4" fill="var(--fp-tone)" />
            <circle cx="200" cy="156" r=".9" fill="rgba(8,11,22,.85)" />
            <circle cx="1000" cy="156" r=".9" fill="rgba(8,11,22,.85)" />
          </g>

          {/* — the press frame, two pillars at the side, connected at the top with a low arch — */}
          <g
            className="frontispiece__frame"
            stroke="var(--fp-tone)"
            fill="none"
            strokeLinecap="round"
          >
            <path d="M 180 268 L 180 100 L 220 60 L 980 60 L 1020 100 L 1020 268" strokeWidth=".7" />
            <line x1="190" y1="110" x2="210" y2="80" strokeWidth=".35" opacity=".55" />
            <line x1="1010" y1="110" x2="990" y2="80" strokeWidth=".35" opacity=".55" />
            <line x1="220" y1="60" x2="980" y2="60" strokeWidth=".5" />
            <line x1="180" y1="170" x2="240" y2="170" strokeWidth=".4" opacity=".65" />
            <line x1="960" y1="170" x2="1020" y2="170" strokeWidth=".4" opacity=".65" />
          </g>

          {/* — the hand-wheel & spindle, a small ornament on the right pillar — */}
          <g className="frontispiece__wheel">
            <circle cx="990" cy="118" r="18" stroke="var(--fp-tone)" strokeWidth=".55" fill="none" />
            <circle cx="990" cy="118" r="3.4" fill="var(--fp-tone)" />
            <g
              stroke="var(--fp-tone)"
              strokeWidth=".4"
              strokeLinecap="round"
              opacity=".7"
            >
              <line x1="990" y1="100" x2="990" y2="136" />
              <line x1="972" y1="118" x2="1008" y2="118" />
              <line x1="977" y1="105" x2="1003" y2="131" />
              <line x1="1003" y1="105" x2="977" y2="131" />
            </g>
            <line x1="990" y1="136" x2="990" y2="184" stroke="var(--fp-tone)" strokeWidth=".4" opacity=".6" />
          </g>

          {/* — the press arm, descending from the right pillar to the chase — */}
          <path
            className="frontispiece__arm"
            d="M 990 184 Q 820 156 600 158"
            fill="none"
            stroke={`url(#${gradArmId})`}
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <path
            d="M 990 184 Q 820 156 600 158"
            fill="none"
            stroke="var(--fp-tone)"
            strokeWidth="3.6"
            strokeLinecap="round"
            opacity=".22"
          />
          <circle cx="990" cy="184" r="2.8" fill="var(--fp-tone)" />
          <circle cx="990" cy="184" r="1.1" fill="rgba(8,11,22,.85)" />
          <circle cx="600" cy="158" r="2.4" fill="var(--fp-tone)" />

          {/* — a series of faint pressure pulses along the chase — */}
          <g
            className="frontispiece__pressures"
            stroke="var(--fp-tone)"
            fill="none"
            strokeLinecap="round"
            opacity=".5"
          >
            <path d="M 260 168 q 80 -8 160 0 q 80 8 160 0 q 80 -8 160 0 q 80 8 160 0" strokeWidth=".4" />
          </g>

          {/* — a thin trailing smoke, hand-drawn along the arm — */}
          <path
            className="frontispiece__smoke"
            d="M 990 80 Q 1010 56 990 36 Q 970 16 1004 4"
            fill="none"
            stroke="var(--fp-tone)"
            strokeWidth=".5"
            strokeLinecap="round"
            opacity=".45"
            strokeDasharray="1.4 3.4"
          />

          {/* — the catch-tray, a small wooden drawer at the foot of the chase — */}
          <g className="frontispiece__tray">
            <rect
              x="380"
              y="280"
              width="440"
              height="14"
              rx="2"
              fill="rgba(8,11,22,.6)"
              stroke="var(--fp-tone)"
              strokeWidth=".5"
            />
            <line x1="392" y1="287" x2="808" y2="287" stroke="var(--fp-tone)" strokeWidth=".3" strokeDasharray="1 3" opacity=".55" />
            <circle cx="404" cy="287" r=".8" fill="var(--fp-tone)" opacity=".7" />
            <circle cx="500" cy="287" r=".8" fill="var(--fp-tone)" opacity=".7" />
            <circle cx="600" cy="287" r=".8" fill="var(--fp-tone)" opacity=".7" />
            <circle cx="700" cy="287" r=".8" fill="var(--fp-tone)" opacity=".7" />
            <circle cx="796" cy="287" r=".8" fill="var(--fp-tone)" opacity=".7" />
          </g>

          {/* — the catch-tray caption strip — */}
          <text
            x="600"
            y="308"
            textAnchor="middle"
            fontFamily="ui-monospace, 'SFMono-Regular', Menlo, monospace"
            fontSize="8.2"
            letterSpacing=".4em"
            fill="var(--fp-tone)"
            opacity=".55"
          >
            m³  ·  register  ·  q on the chase  ·  one line  ·  one pull
          </text>

          {/* — the registration marker, a thin pin and circle on the top cross-bar — */}
          <g className="frontispiece__register">
            <circle cx="600" cy="60" r="6" fill="none" stroke="var(--fp-tone)" strokeWidth=".45" opacity=".7" />
            <circle cx="600" cy="60" r="1.8" fill="var(--fp-tone)" />
            <line x1="600" y1="44" x2="600" y2="50" stroke="var(--fp-tone)" strokeWidth=".4" opacity=".55" />
          </g>

          {/* — the corner ticks, hand-placed on each corner of the plate, like a printer's crop mark — */}
          <g
            className="frontispiece__cropmarks"
            stroke="var(--fp-tone)"
            strokeWidth=".5"
            strokeLinecap="round"
            opacity=".55"
          >
            <path d="M 96 96 L 96 78 M 96 96 L 114 96" />
            <path d="M 1104 96 L 1104 78 M 1104 96 L 1086 96" />
            <path d="M 96 320 L 96 338 M 96 320 L 114 320" />
            <path d="M 1104 320 L 1104 338 M 1104 320 L 1086 320" />
          </g>

          {/* — a single sun over the press — the day breaking on the engraving — */}
          <g className="frontispiece__sun">
            <circle cx="600" cy="36" r="44" fill={`url(#${gradSunId})`} />
            <circle cx="600" cy="36" r="14" fill={`url(#${gradSunId})`} opacity=".85" />
            <circle cx="600" cy="36" r="9" fill="var(--fp-tone)" opacity=".22" />
            <circle cx="600" cy="36" r="4" fill="var(--fp-tone)" />
            <circle cx="600" cy="36" r="1.4" fill="rgba(245,238,216,.9)" />
            <circle cx="600" cy="36" r="56" fill="none" stroke="var(--fp-tone)" strokeWidth=".32" strokeDasharray="1 6" opacity=".45" />
          </g>

          {/* — a thin halo around the sun, hand-drawn — */}
          <ellipse
            className="frontispiece__halo"
            cx="600"
            cy="36"
            rx="220"
            ry="60"
            fill={`url(#${gradHaloId})`}
            opacity=".4"
          />

          {/* — a pair of orbits over the press, marked at type-high and press-stop — */}
          <g
            className="frontispiece__orbits"
            stroke="var(--fp-tone)"
            fill="none"
            strokeLinecap="round"
            opacity=".42"
          >
            <path d="M 240 64 Q 600 24 960 64" strokeWidth=".3" strokeDasharray="1 4" />
            <path d="M 260 78 Q 600 38 940 78" strokeWidth=".28" strokeDasharray="1 5" />
          </g>
        </svg>
        </span>

        <span className="frontispiece__chase-type" aria-hidden="true">
          <em className="frontispiece__chase-piece frontispiece__chase-piece--a" style={lineItalic}>
            is&nbsp;m<sup>3</sup>&nbsp;good&nbsp;at
          </em>
          <em
            className="frontispiece__chase-piece frontispiece__chase-piece--b"
            style={lineDisplay}
          >
            FRONTEND
          </em>
          <em
            className="frontispiece__chase-piece frontispiece__chase-piece--c"
            style={lineItalic}
          >
            yet?
          </em>
        </span>

        <span className="frontispiece__tray-caption" aria-hidden="true">
          <em>m³</em>
          <span className="frontispiece__tray-caption-dot">·</span>
          <em>register</em>
          <span className="frontispiece__tray-caption-dot">·</span>
          <em>q on the chase</em>
          <span className="frontispiece__tray-caption-dot">·</span>
          <em>one line</em>
          <span className="frontispiece__tray-caption-dot">·</span>
          <em>one pull</em>
        </span>
      </span>

      <figcaption className="frontispiece__cap">
        <span className="frontispiece__cap-rule" aria-hidden="true" />
        <span className="frontispiece__cap-key" aria-hidden="true">
          <em>the press · standing</em>
        </span>
        <span
          className="frontispiece__cap-headline"
          style={lineDisplay}
        >
          {caption.caption}
        </span>
        <span className="frontispiece__cap-line" aria-hidden="true">
          <em>{caption.sub}</em>
          <span className="frontispiece__cap-line-dot" aria-hidden="true">·</span>
          <em>set on {fullDate}</em>
        </span>
        <span className="frontispiece__cap-rule" aria-hidden="true" />
      </figcaption>
    </figure>
  )
}
