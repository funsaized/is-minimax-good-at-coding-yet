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

const FOLIO = 'v'

function PressingTab({ pressing, isActive, onSelect }: { pressing: Pressing; isActive: boolean; onSelect: (id: VoiceId) => void }) {
  return (
    <button
      type="button"
      className={`pressings__tab pressings__tab--${pressing.voice} ${isActive ? 'is-active' : ''}`}
      onClick={() => onSelect(pressing.voice)}
      aria-pressed={isActive}
      aria-label={`Press the title in the ${pressing.name} voice`}
    >
      <span className="pressings__tab-letter" aria-hidden="true">{pressing.letter}</span>
      <span className={`pressings__tab-mini pressings__tab-mini--${pressing.voice}`} aria-hidden="true">
        <span>{pressing.lines[0]}</span>
        <span>{pressing.lines[1]}</span>
        <span>{pressing.lines[2]}</span>
      </span>
      <span className="pressings__tab-name">{pressing.name}</span>
      <span className="pressings__tab-mark" aria-hidden="true">
        <span className="pressings__tab-mark-dot" style={{ background: pressing.inkSwatch }} />
        {isActive ? 'set' : 'press'}
      </span>
    </button>
  )
}

export function SpecimenSpread({ active, onSelect }: SpecimenSpreadProps) {
  const activeIndex = PRESSINGS.findIndex(pressing => pressing.voice === active)
  const pressing = PRESSINGS[activeIndex] ?? PRESSINGS[0]
  return (
    <section className="specimen-spread section" id="pressings" aria-labelledby="specimen-spread-title">
      <header className="section__header specimen-spread__header">
        <p className="eyebrow"><span className="eyebrow__line" />type specimen <em>folio {FOLIO} · one question, three pressings</em></p>
        <h2 id="specimen-spread-title">One question, <i>three pressings.</i></h2>
        <p className="section__lede">Pick a pressing below. The title above shifts with it — typography is part of any honest answer, not a decoration after.</p>
      </header>

      <div className="specimen-spread__stage">
        <article key={pressing.voice} className={`specimen-stage specimen-stage--${pressing.voice}`} aria-label={`Pressing ${pressing.letter} of three: ${pressing.name}`}>
          <span className="specimen-stage__corner specimen-stage__corner--tl" aria-hidden="true" />
          <span className="specimen-stage__corner specimen-stage__corner--tr" aria-hidden="true" />
          <span className="specimen-stage__corner specimen-stage__corner--bl" aria-hidden="true" />
          <span className="specimen-stage__corner specimen-stage__corner--br" aria-hidden="true" />

          <span className="specimen-stage__plate" aria-hidden="true">
            <svg viewBox="0 0 32 32">
              <circle cx="16" cy="16" r="13" fill="none" stroke="currentColor" strokeWidth=".8" />
              <text x="16" y="20" textAnchor="middle" fontFamily="Georgia, serif" fontStyle="italic" fontSize="11" fill="currentColor">{pressing.letter}</text>
            </svg>
            pressing {String(activeIndex + 1).padStart(2, '0')} / 03
          </span>

          <div className="specimen-stage__guides" aria-hidden="true">
            <span className="specimen-stage__guide specimen-stage__guide--cap" />
            <span className="specimen-stage__guide specimen-stage__guide--x" />
            <span className="specimen-stage__guide specimen-stage__guide--base" />
            <span className="specimen-stage__guide specimen-stage__guide--drop" />
          </div>

          <div className={`specimen-stage__lines specimen-stage__lines--${pressing.voice}`} aria-hidden="true">
            <span>{pressing.lines[0]}</span>
            <span>{pressing.lines[1]}</span>
            <span>{pressing.lines[2]}</span>
          </div>

          <span className="specimen-stage__scale" aria-hidden="true">
            <span /> <span /> <span className="is-major" /> <span /> <span /> <span className="is-major" /> <span /> <span /> <span className="is-major" /> <span /> <span /> <span className="is-major" />
          </span>
        </article>

        <aside key={`legend-${pressing.voice}`} className="specimen-stage__legend" aria-label="Pressing details">
          <span className="specimen-stage__legend-eyebrow" aria-hidden="true">on the press</span>
          <h3 className="specimen-stage__legend-name">{pressing.name}</h3>
          <p className="specimen-stage__legend-descriptor">{pressing.descriptor}</p>
          <dl className="specimen-stage__legend-grid">
            <div className="specimen-stage__legend-row">
              <dt>face</dt>
              <dd>{pressing.face}</dd>
            </div>
            <div className="specimen-stage__legend-row">
              <dt>size</dt>
              <dd>{pressing.pointSize}</dd>
            </div>
            <div className="specimen-stage__legend-row">
              <dt>ink</dt>
              <dd>
                <span className="specimen-stage__legend-dot" style={{ background: pressing.inkSwatch }} aria-hidden="true" />
                {pressing.ink}
              </dd>
            </div>
            <div className="specimen-stage__legend-row">
              <dt>folio</dt>
              <dd>v · pressing {String(activeIndex + 1).padStart(2, '0')}</dd>
            </div>
          </dl>
        </aside>
      </div>

      <ol className="pressings__tabs" role="list" aria-label="Pressings of the title">
        {PRESSINGS.map(entry => (
          <li key={entry.voice} className="pressings__tab-item">
            <PressingTab pressing={entry} isActive={entry.voice === active} onSelect={onSelect} />
          </li>
        ))}
      </ol>

      <p className="pressings__foot">
        <span aria-hidden="true">※</span>
        Each pressing is a different answer to the same question. None of them are final.
      </p>
    </section>
  )
}