type VoiceId = 'quiet' | 'human' | 'bold'

type SpecimenSpreadProps = {
  active: VoiceId
  onSelect: (id: VoiceId) => void
}

type Pressing = {
  voice: VoiceId
  letter: string
  name: string
  descriptor: string
  face: string
  pointSize: string
  ink: string
  inkSwatch: string
  lines: [string, string, string]
}

const PRESSINGS: Pressing[] = [
  {
    voice: 'quiet',
    letter: 'A',
    name: 'quiet cut',
    descriptor: 'the practical reading',
    face: 'serif · italic · paper',
    pointSize: '88 pt',
    ink: 'paper on midnight',
    inkSwatch: 'var(--paper)',
    lines: ['is Minimax', 'good at frontend', 'yet?'],
  },
  {
    voice: 'human',
    letter: 'B',
    name: 'human hand',
    descriptor: 'the personal reading',
    face: 'serif · italic · warm',
    pointSize: '88 pt',
    ink: 'coral on plum',
    inkSwatch: 'var(--coral)',
    lines: ['is M3', 'good at frontend', 'yet?'],
  },
  {
    voice: 'bold',
    letter: 'C',
    name: 'bold signal',
    descriptor: 'the poster reading',
    face: 'sans · heavy · no apology',
    pointSize: '84 pt',
    ink: 'acid on midnight',
    inkSwatch: 'var(--acid)',
    lines: ['IS', 'GOOD AT', 'FRONTEND YET?'],
  },
]

const FOLIO = 'iv'

export function SpecimenSpread({ active, onSelect }: SpecimenSpreadProps) {
  return (
    <section className="specimen-spread section" id="pressings" aria-labelledby="specimen-spread-title">
      <header className="section__header specimen-spread__header">
        <p className="eyebrow"><span className="eyebrow__line" />type specimen <em>folio {FOLIO} · the question set three ways</em></p>
        <h2 id="specimen-spread-title">One question, <i>three pressings.</i></h2>
        <p className="section__lede">The same words typeset three different ways. Pick a pressing and the title above settles into its voice — typography is part of the answer.</p>
      </header>

      <ol className="pressings" role="list" aria-label="Pressings of the title in three voices">
        {PRESSINGS.map((pressing, index) => {
          const isActive = pressing.voice === active
          return (
            <li key={pressing.voice} className={`pressings__row pressings__row--${pressing.voice} ${isActive ? 'is-active' : ''}`}>
              <button
                type="button"
                className="pressings__button"
                onClick={() => onSelect(pressing.voice)}
                aria-pressed={isActive}
                aria-label={`Set the title in the ${pressing.name} voice`}
              >
                <span className="pressings__sidemark" aria-hidden="true">
                  <span className="pressings__sidemark-letter">{pressing.letter}</span>
                  <span className="pressings__sidemark-rule" />
                </span>

                <span className={`pressings__specimen pressings__specimen--${pressing.voice}`} aria-hidden="true">
                  <span className="pressings__guide pressings__guide--cap" />
                  <span className="pressings__guide pressings__guide--x" />
                  <span className="pressings__guide pressings__guide--base" />
                  <span className="pressings__guide pressings__guide--drop" />
                  <span className="pressings__lines">
                    <span className="pressings__line">{pressing.lines[0]}</span>
                    <span className="pressings__line">{pressing.lines[1]}</span>
                    <span className="pressings__line">{pressing.lines[2]}</span>
                  </span>
                </span>

                <span className="pressings__meta" aria-hidden="true">
                  <span className="pressings__name">{pressing.name}</span>
                  <span className="pressings__descriptor">{pressing.descriptor}</span>
                  <span className="pressings__legend">
                    <span><em>face</em>{pressing.face}</span>
                    <span><em>size</em>{pressing.pointSize}</span>
                    <span className="pressings__ink">
                      <em>ink</em>
                      <span className="pressings__ink-dot" style={{ background: pressing.inkSwatch }} />
                      {pressing.ink}
                    </span>
                  </span>
                </span>

                <span className="pressings__select" aria-hidden="true">
                  <span className="pressings__select-dot" />
                  <span className="pressings__select-label">{isActive ? 'set' : 'press'}</span>
                </span>
              </button>
              <span className="pressings__plate" aria-hidden="true">
                <svg className="pressings__cutter" viewBox="0 0 24 24">
                  <path d="M4 4l16 16M4 20L20 4" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
                </svg>
                <span className="pressings__plate-folio">pressing {String(index + 1).padStart(2, '0')}</span>
              </span>
            </li>
          )
        })}
      </ol>

      <p className="pressings__foot">
        <span aria-hidden="true">※</span>
        Each pressing is a different answer to the same question. None of them are final.
      </p>
    </section>
  )
}
