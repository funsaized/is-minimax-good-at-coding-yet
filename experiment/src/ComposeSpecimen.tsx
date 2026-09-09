type VoiceId = 'quiet' | 'human' | 'bold'

type ComposeSpecimenProps = {
  voice: VoiceId
}

export function ComposeSpecimen({ voice }: ComposeSpecimenProps) {
  return (
    <svg className={`specimen specimen--${voice}`} viewBox="0 0 320 360" aria-hidden="true">
      <g className="specimen__crops">
        <path className="specimen__crop" d="M4 14h10M14 4v10" />
        <path className="specimen__crop" d="M306 4v10M316 14h-10" />
        <path className="specimen__crop" d="M316 346h-10M306 356v-10" />
        <path className="specimen__crop" d="M14 356v-10M4 346h10" />
      </g>

      <text className="specimen__label specimen__label--top" x="28" y="42">specimen · set 1</text>
      <line className="specimen__trace" x1="118" y1="38" x2="138" y2="38" />

      <g className="specimen__guides">
        <line className="specimen__guide" x1="28" y1="100" x2="232" y2="100" />
        <line className="specimen__guide" x1="28" y1="166" x2="232" y2="166" />
        <line className="specimen__guide" x1="28" y1="232" x2="232" y2="232" />
      </g>

      <g className="specimen__caps">
        <line className="specimen__cap" x1="28" y1="76" x2="232" y2="76" />
        <line className="specimen__cap" x1="28" y1="152" x2="232" y2="152" />
        <line className="specimen__cap" x1="28" y1="224" x2="232" y2="224" />
      </g>

      <g className="specimen__xheight">
        <line className="specimen__x-line" x1="28" y1="88" x2="232" y2="88" />
        <line className="specimen__x-line" x1="28" y1="160" x2="232" y2="160" />
        <line className="specimen__x-line" x1="28" y1="228" x2="232" y2="228" />
      </g>

      <g className="specimen__type">
        <text
          className="specimen__line specimen__line--lg"
          x="28"
          y="100"
          fontSize="32"
          fontStyle="italic"
        >
          good at frontend yet
        </text>
        <text
          className="specimen__line specimen__line--md"
          x="28"
          y="166"
          fontSize="18"
        >
          good at frontend yet
        </text>
        <text
          className="specimen__line specimen__line--sm"
          x="28"
          y="232"
          fontSize="12"
        >
          good at frontend yet
        </text>
      </g>

      <g className="specimen__underline">
        <line className="specimen__under" x1="28" y1="104" x2="232" y2="104" />
        <line className="specimen__under" x1="28" y1="169" x2="232" y2="169" />
        <line className="specimen__under" x1="28" y1="234" x2="232" y2="234" />
      </g>

      <g className="specimen__ruler">
        <line className="specimen__ruler-line" x1="262" y1="68" x2="262" y2="252" />
        <line className="specimen__tick specimen__tick--major" x1="256" y1="68" x2="268" y2="68" />
        <line className="specimen__tick" x1="258" y1="84" x2="266" y2="84" />
        <line className="specimen__tick specimen__tick--major" x1="256" y1="100" x2="268" y2="100" />
        <line className="specimen__tick" x1="258" y1="116" x2="266" y2="116" />
        <line className="specimen__tick specimen__tick--major" x1="256" y1="132" x2="268" y2="132" />
        <line className="specimen__tick" x1="258" y1="148" x2="266" y2="148" />
        <line className="specimen__tick specimen__tick--major" x1="256" y1="164" x2="268" y2="164" />
        <line className="specimen__tick" x1="258" y1="180" x2="266" y2="180" />
        <line className="specimen__tick specimen__tick--major" x1="256" y1="196" x2="268" y2="196" />
        <line className="specimen__tick" x1="258" y1="212" x2="266" y2="212" />
        <line className="specimen__tick specimen__tick--major" x1="256" y1="228" x2="268" y2="228" />
        <line className="specimen__tick" x1="258" y1="244" x2="266" y2="244" />
      </g>

      <g className="specimen__points">
        <text className="specimen__point" x="276" y="71" fontSize="7">32</text>
        <text className="specimen__point" x="276" y="103" fontSize="7">18</text>
        <text className="specimen__point" x="276" y="135" fontSize="7">12</text>
      </g>

      <g className="specimen__seal" aria-hidden="true">
        <circle cx="284" cy="306" r="18" />
        <circle cx="284" cy="306" r="14" />
        <text x="284" y="310" fontSize="11" textAnchor="middle" fontStyle="italic">m³</text>
      </g>

      <text className="specimen__label specimen__label--bottom" x="28" y="306">
        set in serif · measured in points
      </text>
      <text className="specimen__label specimen__label--meta" x="28" y="330">
        a study, no. 1
      </text>
      <line className="specimen__trace specimen__trace--end" x1="86" y1="326" x2="118" y2="326" />
    </svg>
  )
}
