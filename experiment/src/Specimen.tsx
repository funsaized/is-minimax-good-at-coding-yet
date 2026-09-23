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
  sub: string
  caption: string
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
    reading: 'the default voice',
    sub: 'read low, read close',
    caption: 'the line said quietly',
  },
  {
    voice: 'human',
    letter: 'b',
    name: 'human hand',
    face: 'serif · italic · warm',
    sample: 'is M3 good at frontend yet?',
    glyph: '∧',
    mark: 'caret',
    reading: 'the middle voice',
    sub: 'read at hand',
    caption: 'the line as a hand might write it',
  },
  {
    voice: 'bold',
    letter: 'c',
    name: 'bold signal',
    face: 'sans · heavy · no apology',
    sample: 'IS M3 GOOD AT FRONTEND YET?',
    glyph: '∴',
    mark: 'query',
    reading: 'the loud face',
    sub: 'read once',
    caption: 'the line, shouted honestly',
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
          Three plates of the same line — set in their own voice, against their own field. Click a plate
          to set the page in that voice.
        </p>
      </header>

      <div className="specimen__plates">
        {ORDER.map(v => {
          const row = ROWS.find(r => r.voice === v)!
          const isActive = active === v
          const style = { '--plate-tone': `var(--${row.voice})` } as CSSProperties
          return (
            <button
              key={v}
              type="button"
              role="radio"
              aria-checked={isActive}
              className={`plate plate--${v} ${isActive ? 'is-active' : ''}`}
              style={style}
              onClick={() => onSelect(v)}
            >
              <span className="plate__hairline" aria-hidden="true">
                <svg viewBox="0 0 280 6" preserveAspectRatio="none">
                  <path d="M2 3c40-3 80 3 120 0s80-3 120 0 36-3 36 0" fill="none" stroke="currentColor" strokeWidth=".7" strokeLinecap="round" />
                  <circle cx="2" cy="3" r="1" fill="currentColor" />
                  <circle cx="278" cy="3" r="1" fill="currentColor" />
                </svg>
              </span>

              {row.voice === 'quiet' && (
                <span className="plate__fold plate__fold--quiet" aria-hidden="true">
                  <svg viewBox="0 0 280 6" preserveAspectRatio="none">
                    <line x1="0" y1="3" x2="280" y2="3" stroke="currentColor" strokeWidth=".45" strokeDasharray="1.2 3" opacity=".55" />
                    <circle cx="140" cy="3" r="1.6" fill="currentColor" opacity=".7" />
                    <circle cx="140" cy="3" r="3.2" fill="none" stroke="currentColor" strokeWidth=".4" opacity=".45" />
                  </svg>
                </span>
              )}
              {row.voice === 'human' && (
                <span className="plate__fold plate__fold--human" aria-hidden="true">
                  <svg viewBox="0 0 60 28" preserveAspectRatio="none">
                    <path d="M2 2 L58 2 L58 14 L52 14 L52 22 L8 22 L8 14 L2 14 Z" fill="none" stroke="currentColor" strokeWidth=".45" opacity=".65" />
                    <path d="M30 4 L30 22" stroke="currentColor" strokeWidth=".55" strokeLinecap="round" opacity=".55" />
                    <path d="M22 11 q4 -3 8 0" fill="none" stroke="currentColor" strokeWidth=".45" opacity=".5" />
                    <path d="M22 17 q4 3 8 0" fill="none" stroke="currentColor" strokeWidth=".45" opacity=".5" />
                  </svg>
                </span>
              )}
              {row.voice === 'bold' && (
                <span className="plate__fold plate__fold--bold" aria-hidden="true">
                  <svg viewBox="0 0 28 28" preserveAspectRatio="none">
                    <path d="M2 2 L26 2 L26 18 L18 26 L2 26 Z" fill="currentColor" opacity=".1" />
                    <path d="M2 2 L26 2 L26 18 L18 26 L2 26 Z" fill="none" stroke="currentColor" strokeWidth=".5" opacity=".7" />
                    <path d="M18 26 L26 18 L18 18 Z" fill="currentColor" opacity=".55" />
                    <path d="M18 26 L26 18" stroke="currentColor" strokeWidth=".4" opacity=".7" />
                  </svg>
                </span>
              )}

              <header className="plate__head">
                <span className="plate__head-letter" aria-hidden="true">{row.letter}</span>
                <span className="plate__head-stack">
                  <span className="plate__head-name">{row.name}</span>
                  <span className="plate__head-face">{row.face}</span>
                </span>
                <span className="plate__head-pip" aria-hidden="true">
                  <span className="plate__head-pip-ring" />
                  <span className="plate__head-pip-bead" />
                </span>
              </header>

              <div className="plate__specimen" aria-hidden="true">
                <p className={`plate__sample plate__sample--${v}`}>{row.sample}</p>
                <p className={`plate__caption-line plate__caption-line--${v}`}>— {row.caption} —</p>
              </div>

              <footer className="plate__foot">
                <span className="plate__foot-cell">
                  <span className="plate__foot-key">mark</span>
                  <span className="plate__foot-mark">
                    <span className="plate__foot-glyph" aria-hidden="true">{row.glyph}</span>
                    <em>{row.mark}</em>
                  </span>
                </span>
                <span className="plate__foot-cell">
                  <span className="plate__foot-key">read as</span>
                  <span className="plate__foot-val">{row.reading}</span>
                </span>
              </footer>

              <span className="plate__caption" aria-hidden="true">
                <span className="plate__caption-rule" />
                <em>{row.caption}</em>
                <span className="plate__caption-rule" />
              </span>

              <span className="plate__sub" aria-hidden="true">{row.sub}</span>
            </button>
          )
        })}
      </div>

      <footer className="specimen__foot">
        <span className="specimen__foot-rule" />
        <em>three plates · one line · set in the voice</em>
        <span className="specimen__foot-rule" />
      </footer>
    </section>
  )
}