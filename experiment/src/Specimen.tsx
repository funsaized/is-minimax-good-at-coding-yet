import type { VoiceId } from './App'

type SpecimenProps = {
  active: VoiceId
  onSelect: (id: VoiceId) => void
}

type Row = {
  voice: VoiceId
  letter: string
  name: string
  face: string
  sample: string
}

const ROWS: Row[] = [
  { voice: 'quiet', letter: 'a', name: 'quiet cut', face: 'serif · italic · close set', sample: 'is m³ good at frontend yet?' },
  { voice: 'human', letter: 'b', name: 'human hand', face: 'serif · italic · warm', sample: 'is M3 good at frontend yet?' },
  { voice: 'bold', letter: 'c', name: 'bold signal', face: 'sans · heavy · no apology', sample: 'IS M3 GOOD AT FRONTEND YET?' },
]

export function Specimen({ active, onSelect }: SpecimenProps) {
  return (
    <section className="specimen reveal" id="specimen" aria-labelledby="specimen-title">
      <header className="specimen__head">
        <span className="eyebrow"><span className="eyebrow__line" />three pressings · one mark</span>
        <h2 id="specimen-title">
          One question, <em>three faces.</em>
        </h2>
        <p className="section__lede">
          A specimen plate laid on the press room floor. Three rows set the same line — quiet cut,
          human hand, bold signal. Pick a row to set the headline in that voice.
        </p>
      </header>

      <div className="specimen__rows" role="tablist" aria-label="The three voices">
        {ROWS.map(row => {
          const isActive = active === row.voice
          return (
            <button
              key={row.voice}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={`specimen__row specimen__row--${row.voice} ${isActive ? 'is-active' : ''}`}
              onClick={() => onSelect(row.voice)}
            >
              <span className="specimen__row-letter" aria-hidden="true">{row.letter}</span>
              <span className="specimen__row-sample">{row.sample}</span>
              <span className="specimen__row-meta">
                <em>{row.name}</em>
                <span>{row.face}</span>
              </span>
            </button>
          )
        })}
      </div>
    </section>
  )
}
