type VoiceId = 'quiet' | 'human' | 'bold'

type ComposeSpecimenProps = {
  voice: VoiceId
  display?: string
}

const TRACK_TICKS = Array.from({ length: 29 })

export function ComposeSpecimen({ voice, display = 'is M3 good at frontend yet?' }: ComposeSpecimenProps) {
  return (
    <svg className={`specimen specimen--${voice}`} viewBox="0 0 320 480" aria-hidden="true">
      <defs>
        <linearGradient id="specimen-trace" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
          <stop offset="32%" stopColor="currentColor" stopOpacity=".9" />
          <stop offset="68%" stopColor="currentColor" stopOpacity=".9" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="specimen-colorbar" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="rgba(146, 186, 255, .9)" />
          <stop offset="33%" stopColor="rgba(216, 255, 98, .85)" />
          <stop offset="66%" stopColor="rgba(255, 118, 95, .85)" />
          <stop offset="100%" stopColor="rgba(17, 21, 33, .9)" />
        </linearGradient>
        <radialGradient id="specimen-pin" cx=".4" cy=".4" r=".7">
          <stop offset="0%" stopColor="rgba(255, 200, 170, .85)" />
          <stop offset="55%" stopColor="var(--wax)" />
          <stop offset="100%" stopColor="rgba(60, 22, 18, .85)" />
        </radialGradient>
        <filter id="specimen-pin-shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.4" />
        </filter>
      </defs>

      <g className="specimen__crops">
        <path className="specimen__crop" d="M4 14h10M14 4v10" />
        <path className="specimen__crop" d="M306 4v10M316 14h-10" />
        <path className="specimen__crop" d="M316 446h-10M306 456v-10" />
        <path className="specimen__crop" d="M14 456v-10M4 446h10" />
      </g>

      <g className="specimen__pin" transform="translate(160, 18)">
        <ellipse cx="0" cy="6" rx="6" ry="1.2" fill="rgba(0, 0, 0, .35)" filter="url(#specimen-pin-shadow)" />
        <circle cx="0" cy="0" r="4.6" fill="url(#specimen-pin)" />
        <circle cx="-1.2" cy="-1.2" r="1.6" fill="rgba(255, 255, 255, .55)" />
        <line x1="0" y1="4.6" x2="0" y2="7" stroke="currentColor" strokeWidth=".7" opacity=".55" />
      </g>

      <g className="specimen__heading">
        <text x="28" y="44" fontSize="7" letterSpacing="2.4" fontFamily="ui-monospace, monospace" fill="currentColor" opacity=".7">TYPE LADDER · SPEC № 03</text>
        <line x1="28" y1="50" x2="128" y2="50" stroke="currentColor" strokeWidth=".4" opacity=".5" />
        <text x="294" y="44" textAnchor="end" fontSize="7" letterSpacing="1.8" fontFamily="ui-monospace, monospace" fill="currentColor" opacity=".65">FOLIO iii</text>
      </g>

      <g className="specimen__guides">
        <line className="specimen__guide specimen__guide--row" x1="28" y1="116" x2="290" y2="116" />
        <line className="specimen__guide specimen__guide--row" x1="28" y1="178" x2="290" y2="178" />
        <line className="specimen__guide specimen__guide--row" x1="28" y1="226" x2="290" y2="226" />
      </g>

      <g className="specimen__caps">
        <line className="specimen__cap" x1="28" y1="68" x2="290" y2="68" />
        <line className="specimen__cap" x1="28" y1="148" x2="290" y2="148" />
        <line className="specimen__cap" x1="28" y1="200" x2="290" y2="200" />
      </g>

      <g className="specimen__xheight">
        <line className="specimen__x-line" x1="28" y1="96" x2="290" y2="96" />
        <line className="specimen__x-line" x1="28" y1="166" x2="290" y2="166" />
        <line className="specimen__x-line" x1="28" y1="216" x2="290" y2="216" />
      </g>

      <g className="specimen__type">
        <text className="specimen__line specimen__line--display" x="28" y="116" fontSize="38" fontStyle="italic" letterSpacing="-1.6">
          {display}
        </text>
        <text className="specimen__line specimen__line--medium" x="28" y="178" fontSize="22">
          {display}
        </text>
        <text className="specimen__line specimen__line--small" x="28" y="226" fontSize="14" fontStyle="italic">
          {display}
        </text>
      </g>

      <g className="specimen__points">
        <text className="specimen__point" x="296" y="73" fontSize="7">38 pt</text>
        <text className="specimen__point" x="296" y="153" fontSize="7">22 pt</text>
        <text className="specimen__point" x="296" y="205" fontSize="7">14 pt</text>
      </g>

      <g className="specimen__under">
        <line className="specimen__under specimen__under--display" x1="28" y1="122" x2="290" y2="122" />
        <line className="specimen__under specimen__under--medium" x1="28" y1="184" x2="290" y2="184" />
        <line className="specimen__under specimen__under--small" x1="28" y1="230" x2="290" y2="230" />
      </g>

      <g className="specimen__ruler">
        <line className="specimen__ruler-line" x1="20" y1="252" x2="300" y2="252" />
        {TRACK_TICKS.map((_, index) => {
          const x = 22 + index * 10
          const isMajor = index % 3 === 0
          const height = isMajor ? 7 : 4
          return (
            <line
              key={index}
              x1={x}
              y1={252}
              x2={x}
              y2={252 + height}
              strokeWidth={isMajor ? 0.9 : 0.4}
              className={`specimen__tick${isMajor ? ' specimen__tick--major' : ''}`}
            />
          )
        })}
        <line className="specimen__ruler-cap" x1="20" y1="262" x2="300" y2="262" />
      </g>

      <g className="specimen__trace-bar" aria-hidden="true">
        <line className="specimen__trace-line" x1="20" y1="78" x2="300" y2="78" stroke="url(#specimen-trace)" strokeWidth=".9" />
        <circle className="specimen__trace-bead" cx="160" cy="78" r="1.6" />
      </g>

      <g className="specimen__align">
        <line x1="60" y1="290" x2="260" y2="290" stroke="currentColor" strokeWidth=".5" opacity=".35" />
        <line x1="60" y1="290" x2="60" y2="306" stroke="currentColor" strokeWidth=".5" opacity=".35" />
        <line x1="260" y1="290" x2="260" y2="306" stroke="currentColor" strokeWidth=".5" opacity=".35" />
        <text x="160" y="304" fontSize="6" textAnchor="middle" fontFamily="ui-monospace, monospace" letterSpacing="2" fill="currentColor" opacity=".6">CENTER · ALIGN</text>
      </g>

      <g className="specimen__colorbar">
        <rect x="20" y="322" width="280" height="9" rx="0" fill="url(#specimen-colorbar)" opacity=".85" />
        <line x1="20" y1="331" x2="300" y2="331" stroke="currentColor" strokeWidth=".3" opacity=".5" />
        <text x="22" y="346" fontSize="6" letterSpacing="1.6" fontFamily="ui-monospace, monospace" fill="currentColor" opacity=".55">CMYK · BAR</text>
        <text x="298" y="346" textAnchor="end" fontSize="6" letterSpacing="1.6" fontFamily="ui-monospace, monospace" fill="currentColor" opacity=".55">C 60 / Y 40 / M 20</text>
      </g>

      <g className="specimen__press">
        <text x="28" y="378" fontSize="7" letterSpacing="2" fontFamily="ui-monospace, monospace" fill="currentColor" opacity=".6">PRESS · ONE QUESTION SET TODAY</text>
        <line x1="28" y1="386" x2="200" y2="386" stroke="currentColor" strokeWidth=".3" opacity=".4" />
        <text x="28" y="408" fontSize="9" letterSpacing="1.6" fontFamily="ui-monospace, monospace" fill="currentColor" opacity=".85">№ 3 / 3</text>
        <text x="100" y="408" fontSize="9" letterSpacing="1.6" fontFamily="ui-monospace, monospace" fill="currentColor" opacity=".85">FOLIO iii</text>
        <text x="180" y="408" fontSize="9" letterSpacing="1.6" fontFamily="ui-monospace, monospace" fill="currentColor" opacity=".85">SET IN SYSTEM SERIF</text>
      </g>

      <g className="specimen__seal" transform="translate(252, 416)">
        <ellipse cx="0" cy="3" rx="22" ry="2" fill="rgba(0, 0, 0, .35)" filter="url(#specimen-pin-shadow)" />
        <circle cx="0" cy="0" r="22" fill="none" stroke="var(--coral)" strokeWidth="1.2" opacity=".7" />
        <circle cx="0" cy="0" r="18" fill="none" stroke="var(--coral)" strokeWidth=".4" strokeDasharray="1 2" opacity=".5" />
        <text x="0" y="-2" textAnchor="middle" fontSize="11" fontFamily="Georgia, serif" fontStyle="italic" fill="var(--coral)">m³</text>
        <text x="0" y="9" textAnchor="middle" fontSize="4.5" letterSpacing="1.5" fontFamily="ui-monospace, monospace" fill="var(--coral)" opacity=".85">SET TODAY</text>
      </g>
    </svg>
  )
}