import type { CSSProperties } from 'react'
import type { VoiceId } from './App'

type SpecimenProps = {
  active: VoiceId
  onSelect: (id: VoiceId) => void
}

type KeyRow = {
  voice: VoiceId
  letter: string
  name: string
  face: string
  sample: string
  glyph: string
  mark: string
  reading: string
  tone: 'quiet' | 'human' | 'bold'
}

const ROWS: KeyRow[] = [
  {
    voice: 'quiet',
    letter: 'a',
    name: 'quiet cut',
    face: 'serif · italic · close set',
    sample: 'is m³ good at frontend yet?',
    glyph: '⌇',
    mark: 'stet',
    reading: 'the default · read low',
    tone: 'quiet',
  },
  {
    voice: 'human',
    letter: 'b',
    name: 'human hand',
    face: 'serif · italic · warm',
    sample: 'is M3 good at frontend yet?',
    glyph: '∧',
    mark: 'caret',
    reading: 'the middle voice · read at hand',
    tone: 'human',
  },
  {
    voice: 'bold',
    letter: 'c',
    name: 'bold signal',
    face: 'sans · heavy · no apology',
    sample: 'IS M3 GOOD AT FRONTEND YET?',
    glyph: '∴',
    mark: 'query',
    reading: 'the loud face · read once',
    tone: 'bold',
  },
]

const ORDER: VoiceId[] = ['quiet', 'human', 'bold']

export function Specimen({ active, onSelect }: SpecimenProps) {
  return (
    <section className="specimen reveal" id="specimen" aria-labelledby="specimen-title">
      <header className="specimen__head">
        <span className="eyebrow"><span className="eyebrow__line" />notation key · folio iv</span>
        <h2 id="specimen-title">
          How the <em>three voices</em> read.
        </h2>
        <p className="section__lede">
          Three swatches, one key. Each row holds the line in its voice, the mark it answers to, and a
          short reading note. Click a row to set the page in that voice.
        </p>
      </header>

      <div className="specimen__key" role="radiogroup" aria-label="The notation key">
        <header className="specimen__key-head" aria-hidden="true">
          <span className="specimen__key-col specimen__key-col--letter">letter</span>
          <span className="specimen__key-col specimen__key-col--sample">the line, set</span>
          <span className="specimen__key-col specimen__key-col--mark">mark</span>
          <span className="specimen__key-col specimen__key-col--note">a reading note</span>
        </header>

        <ol className="specimen__key-list">
          {ORDER.map(v => {
            const row = ROWS.find(r => r.voice === v)!
            const isActive = active === v
            const style = { '--paper-ink': `var(--${row.tone})` } as CSSProperties
            return (
              <li key={v} className="specimen__key-row-wrap">
                <button
                  type="button"
                  role="radio"
                  aria-checked={isActive}
                  className={`specimen__key-row specimen__key-row--${v} ${isActive ? 'is-active' : ''}`}
                  style={style}
                  onClick={() => onSelect(v)}
                >
                  <span className="specimen__key-col specimen__key-col--letter" aria-hidden="true">
                    <span className="specimen__key-letter">{row.letter}</span>
                    <span className="specimen__key-name">{row.name}</span>
                  </span>
                  <span className={`specimen__key-col specimen__key-col--sample specimen__key-col--sample-${v}`}>
                    <span className="specimen__key-sample specimen__key-sample--big">{row.sample}</span>
                    <span className="specimen__key-sample specimen__key-sample--small" aria-hidden="true">
                      {row.sample}
                    </span>
                    <span className="specimen__key-face" aria-hidden="true">{row.face}</span>
                  </span>
                  <span className="specimen__key-col specimen__key-col--mark" aria-hidden="true">
                    <span className="specimen__key-mark-glyph">{row.glyph}</span>
                    <span className="specimen__key-mark-label">{row.mark}</span>
                  </span>
                  <span className="specimen__key-col specimen__key-col--note" aria-hidden="true">
                    {row.reading}
                  </span>
                  <span className="specimen__key-pip" aria-hidden="true">
                    <span className="specimen__key-pip-bead" />
                  </span>
                </button>
              </li>
            )
          })}
        </ol>

        <footer className="specimen__key-foot" aria-hidden="true">
          <span className="specimen__key-foot-rule" />
          <em>three voices · one line · read as set</em>
          <span className="specimen__key-foot-rule" />
        </footer>
      </div>
    </section>
  )
}