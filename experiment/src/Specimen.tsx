import type { CSSProperties } from 'react'
import type { VoiceId } from './App'

type SpecimenProps = {
  active: VoiceId
  onSelect: (id: VoiceId) => void
}

type Pressing = {
  voice: VoiceId
  letter: string
  name: string
  face: string
  paper: 'blue' | 'coral' | 'acid'
  sample: string
  measurement: { set: string; lead: string; track: string }
  glyph: string
  stock: string
}

const PRESSINGS: Pressing[] = [
  {
    voice: 'quiet',
    letter: 'a',
    name: 'quiet cut',
    face: 'serif · italic · close set',
    paper: 'blue',
    sample: 'is m³ good at frontend yet?',
    measurement: { set: '24 pt', lead: '30 pt', track: '−10' },
    glyph: '⌇',
    stock: 'paper · blue laid',
  },
  {
    voice: 'human',
    letter: 'b',
    name: 'human hand',
    face: 'serif · italic · warm',
    paper: 'coral',
    sample: 'is M3 good at frontend yet?',
    measurement: { set: '24 pt', lead: '32 pt', track: '−05' },
    glyph: '∧',
    stock: 'paper · coral wove',
  },
  {
    voice: 'bold',
    letter: 'c',
    name: 'bold signal',
    face: 'sans · heavy · no apology',
    paper: 'acid',
    sample: 'IS M3 GOOD AT FRONTEND YET?',
    measurement: { set: '22 pt', lead: '24 pt', track: '−30' },
    glyph: '∴',
    stock: 'paper · acid card',
  },
]

const PAPER_INK: Record<Pressing['paper'], string> = {
  blue: 'var(--quiet)',
  coral: 'var(--human)',
  acid: 'var(--bold)',
}

export function Specimen({ active, onSelect }: SpecimenProps) {
  return (
    <section className="specimen reveal" id="specimen" aria-labelledby="specimen-title">
      <header className="specimen__head">
        <span className="eyebrow"><span className="eyebrow__line" />specimen plate · folio iv</span>
        <h2 id="specimen-title">
          One line, <em>three pressings.</em>
        </h2>
        <p className="section__lede">
          A specimen plate laid on the press room floor. Three sheets, three papers, the same line set in
          three faces. Click a sheet to lift it — the whole page falls in step.
        </p>
      </header>

      <div className="specimen__plate" role="tablist" aria-label="The three pressings">
        <div className="specimen__plate-head" aria-hidden="true">
          <span className="specimen__plate-key">
            press <em>·</em> sheet <em>iv</em>/<em>iii</em>
          </span>
          <span className="specimen__plate-rule" />
          <span className="specimen__plate-key">
            type-case <em>open</em>
          </span>
          <span className="specimen__plate-rule" />
          <span className="specimen__plate-key">
            forme <em>04</em> <em>·</em> pulled today
          </span>
        </div>

        <div className="specimen__papers">
          {PRESSINGS.map(pressing => {
            const isActive = active === pressing.voice
            const style = { '--paper-ink': PAPER_INK[pressing.paper] } as CSSProperties
            return (
              <button
                key={pressing.voice}
                type="button"
                role="tab"
                aria-selected={isActive}
                className={`specimen__paper specimen__paper--${pressing.voice} ${isActive ? 'is-active' : ''}`}
                style={style}
                onClick={() => onSelect(pressing.voice)}
              >
                <span className="specimen__paper-tag" aria-hidden="true">
                  <span className="specimen__paper-tag-letter">{pressing.letter}</span>
                  <span className="specimen__paper-tag-name">{pressing.name}</span>
                  <span className="specimen__paper-tag-stock">{pressing.stock}</span>
                </span>

                <span className="specimen__paper-rule" aria-hidden="true" />

                <span className="specimen__paper-set" aria-hidden="true">
                  <span>set</span>
                  <em>{pressing.measurement.set}</em>
                  <span>·</span>
                  <span>lead</span>
                  <em>{pressing.measurement.lead}</em>
                  <span>·</span>
                  <span>track</span>
                  <em>{pressing.measurement.track}</em>
                </span>

                <span className="specimen__paper-stage" aria-hidden="true">
                  <span className="specimen__paper-baseline" />
                  <span className="specimen__paper-tick" />
                  <span className="specimen__paper-tick specimen__paper-tick--alt" />
                  <span className="specimen__paper-glyph">{pressing.glyph}</span>
                </span>

                <span className="specimen__paper-line">{pressing.sample}</span>

                <span className="specimen__paper-foot" aria-hidden="true">
                  <span>{pressing.face}</span>
                  <span className="specimen__paper-foot-state">
                    <span className="specimen__paper-foot-pip" />
                    {isActive ? 'lifted' : 'in case'}
                  </span>
                </span>
              </button>
            )
          })}
        </div>

        <div className="specimen__plate-foot" aria-hidden="true">
          <span className="specimen__plate-stamp">
            <svg viewBox="0 0 64 64" width="52" height="52" aria-hidden="true">
              <circle cx="32" cy="32" r="29" fill="none" stroke="currentColor" strokeWidth="1" />
              <circle cx="32" cy="32" r="24" fill="none" stroke="currentColor" strokeWidth=".4" strokeDasharray="1 2" opacity=".7" />
              <text x="32" y="38" textAnchor="middle" fontFamily="Georgia, serif" fontStyle="italic" fontSize="16" fill="currentColor">iv</text>
              <text x="32" y="16" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="4" letterSpacing="2" fill="currentColor">SHEET</text>
              <text x="32" y="54" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="4" letterSpacing="2" fill="currentColor">PULLED</text>
            </svg>
            <span className="specimen__plate-stamp-label">
              three pullings <em>·</em> one question <em>·</em> one mark
            </span>
          </span>
          <span className="specimen__plate-note">
            a specimen plate for the question <em>set three ways</em>
          </span>
        </div>
      </div>
    </section>
  )
}