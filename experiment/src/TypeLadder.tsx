type VoiceId = 'quiet' | 'human' | 'bold'

type LadderEntry = {
  voice: VoiceId
  letter: string
  face: string
  ink: string
  swatch: string
  lines: [string, string, string]
}

const LADDER: LadderEntry[] = [
  {
    voice: 'quiet',
    letter: 'a',
    face: 'serif · italic · close set',
    ink: 'paper on midnight',
    swatch: 'var(--paper)',
    lines: ['is Minimax', 'good at frontend', 'yet?'],
  },
  {
    voice: 'human',
    letter: 'b',
    face: 'serif · italic · warm',
    ink: 'coral on plum',
    swatch: 'var(--coral)',
    lines: ['is M3', 'good at frontend', 'yet?'],
  },
  {
    voice: 'bold',
    letter: 'c',
    face: 'sans · heavy · no apology',
    ink: 'acid on midnight',
    swatch: 'var(--acid)',
    lines: ['IS', 'GOOD AT', 'FRONTEND YET?'],
  },
]

type TypeLadderProps = {
  active: VoiceId
  onSelect: (id: VoiceId) => void
}

export function TypeLadder({ active, onSelect }: TypeLadderProps) {
  return (
    <section className="type-ladder" id="ladder" aria-label="Three settings of the question">
      <header className="type-ladder__head">
        <p className="eyebrow">
          <span className="eyebrow__line" />
          one question, three pressings <em>choose a voice · the title follows</em>
        </p>
        <span className="type-ladder__folio" aria-hidden="true">folio v · type ladder</span>
      </header>
      <ol className="type-ladder__rows" role="list">
        {LADDER.map(entry => {
          const isActive = entry.voice === active
          return (
            <li key={entry.voice} className={`type-ladder__cell type-ladder__cell--${entry.voice} ${isActive ? 'is-active' : ''}`}>
              {isActive && (
                <span className="type-ladder__now" aria-hidden="true">
                  <span className="type-ladder__now-tick" />
                  now setting
                </span>
              )}
              <button
                type="button"
                className="type-ladder__row"
                onClick={() => onSelect(entry.voice)}
                aria-pressed={isActive}
                aria-label={`Set the title in the ${entry.face} voice`}
              >
                <span className="type-ladder__letter" aria-hidden="true">{entry.letter}</span>
                <span className={`type-ladder__specimen type-ladder__specimen--${entry.voice}`} aria-hidden="true">
                  <span>{entry.lines[0]}</span>
                  <span>{entry.lines[1]}</span>
                  <span>{entry.lines[2]}</span>
                </span>
                <span className="type-ladder__meta" aria-hidden="true">
                  <span className="type-ladder__face">{entry.face}</span>
                  <span className="type-ladder__ink">
                    <span className="type-ladder__swatch" style={{ background: entry.swatch }} />
                    <em>{entry.ink}</em>
                  </span>
                </span>
                <span className="type-ladder__set" aria-hidden="true">
                  <span className="type-ladder__set-dot" />
                  <span className="type-ladder__set-word">{isActive ? 'set' : 'press'}</span>
                </span>
              </button>
            </li>
          )
        })}
      </ol>
    </section>
  )
}