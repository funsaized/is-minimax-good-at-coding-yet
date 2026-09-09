type WordId = 'm3' | 'good' | 'yet'

type Mark = {
  id: WordId
  symbol: 'stet' | 'caret' | 'query'
  label: string
  note: string
  glyph: string
  ink: 'acid' | 'coral' | 'blue'
}

const MARKS: Mark[] = [
  {
    id: 'm3',
    symbol: 'stet',
    label: 'stet',
    note: 'let it stand — the maker is a habit, not a logo',
    glyph: '⌇',
    ink: 'acid',
  },
  {
    id: 'good',
    symbol: 'caret',
    label: 'insert',
    note: 'make room for the verb — keep it present tense',
    glyph: '∧',
    ink: 'coral',
  },
  {
    id: 'yet',
    symbol: 'query',
    label: 'query',
    note: 'protect the question mark — it is doing real work',
    glyph: '?',
    ink: 'blue',
  },
]

type MarkedProofProps = {
  selected: WordId
  onSelect: (id: WordId) => void
}

function StetMark({ ink }: { ink: Mark['ink'] }) {
  return (
    <svg className="proof-mark__svg" viewBox="0 0 120 36" aria-hidden="true">
      <text x="2" y="11" className={`proof-mark__label proof-mark__label--${ink}`}>stet</text>
      <path
        d="M2 22c8-6 14 6 22 0s14-6 22 0 14 6 22 0 14-6 22 0 14 6 22 0"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeDasharray="200 200"
      />
    </svg>
  )
}

function CaretMark({ ink }: { ink: Mark['ink'] }) {
  return (
    <svg className="proof-mark__svg" viewBox="0 0 60 36" aria-hidden="true">
      <text x="2" y="11" className={`proof-mark__label proof-mark__label--${ink}`}>insert</text>
      <path
        d="M30 32l-12-14h24z"
        fill="currentColor"
        opacity=".85"
      />
      <line x1="6" y1="32" x2="54" y2="32" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    </svg>
  )
}

function QueryMark({ ink }: { ink: Mark['ink'] }) {
  return (
    <svg className="proof-mark__svg" viewBox="0 0 80 36" aria-hidden="true">
      <text x="2" y="11" className={`proof-mark__label proof-mark__label--${ink}`}>query</text>
      <text x="40" y="30" textAnchor="middle" fontFamily="Georgia, serif" fontStyle="italic" fontSize="22" fill="currentColor">?</text>
      <ellipse cx="40" cy="22" rx="14" ry="11" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="80 80" />
    </svg>
  )
}

function ProofMark({ mark, active }: { mark: Mark; active: boolean }) {
  return (
    <span className={`proof-mark proof-mark--${mark.symbol} proof-mark--${mark.ink} ${active ? 'is-active' : ''}`} aria-hidden="true">
      {mark.symbol === 'stet' && <StetMark ink={mark.ink} />}
      {mark.symbol === 'caret' && <CaretMark ink={mark.ink} />}
      {mark.symbol === 'query' && <QueryMark ink={mark.ink} />}
    </span>
  )
}

export function MarkedProof({ selected, onSelect }: MarkedProofProps) {
  return (
    <section className="marked-proof section" id="proof" aria-labelledby="marked-proof-title">
      <div className="marked-proof__sheet">
        <span className="marked-proof__crop marked-proof__crop--tl" aria-hidden="true" />
        <span className="marked-proof__crop marked-proof__crop--tr" aria-hidden="true" />
        <span className="marked-proof__crop marked-proof__crop--bl" aria-hidden="true" />
        <span className="marked-proof__crop marked-proof__crop--br" aria-hidden="true" />
        <span className="marked-proof__plate" aria-hidden="true">second proof · editor's pass</span>

        <div className="marked-proof__head">
          <p className="eyebrow"><span className="eyebrow__line" />editor's proof <em>folio ii · second reading</em></p>
          <h2 id="marked-proof-title">The question, <i>marked up.</i></h2>
          <p className="section__lede">A working proof of the same line, with proofreader's marks attached to the words worth keeping. Tap a mark to follow the thought into the margin.</p>
        </div>

        <div className="marked-proof__body">
          <div className="marked-proof__lines" role="list" aria-label="The question, typeset with editorial marks">
            <div className="marked-proof__line" role="listitem">
              <span className="marked-proof__linenum" aria-hidden="true">1</span>
              <span className="marked-proof__type">
                <span className="marked-proof__text">is </span>
                <button
                  type="button"
                  className={`marked-proof__word marked-proof__word--m3 ${selected === 'm3' ? 'is-selected' : ''}`}
                  onClick={() => onSelect('m3')}
                  aria-pressed={selected === 'm3'}
                >
                  <span className="marked-proof__mark-slot">
                    <ProofMark mark={MARKS[0]} active={selected === 'm3'} />
                  </span>
                  <span className="marked-proof__wordtype">Minimax M3</span>
                  <span className="marked-proof__underline" aria-hidden="true" />
                </button>
              </span>
            </div>
            <div className="marked-proof__line" role="listitem">
              <span className="marked-proof__linenum" aria-hidden="true">2</span>
              <span className="marked-proof__type">
                <button
                  type="button"
                  className={`marked-proof__word marked-proof__word--good ${selected === 'good' ? 'is-selected' : ''}`}
                  onClick={() => onSelect('good')}
                  aria-pressed={selected === 'good'}
                >
                  <span className="marked-proof__mark-slot">
                    <ProofMark mark={MARKS[1]} active={selected === 'good'} />
                  </span>
                  <span className="marked-proof__wordtype">good at</span>
                  <span className="marked-proof__caret" aria-hidden="true">
                    <svg viewBox="0 0 30 18">
                      <path d="M15 17L4 4h22z" fill="currentColor" />
                    </svg>
                  </span>
                </button>
                <span className="marked-proof__text"> frontend</span>
              </span>
            </div>
            <div className="marked-proof__line" role="listitem">
              <span className="marked-proof__linenum" aria-hidden="true">3</span>
              <span className="marked-proof__type">
                <span className="marked-proof__text"> </span>
                <button
                  type="button"
                  className={`marked-proof__word marked-proof__word--yet ${selected === 'yet' ? 'is-selected' : ''}`}
                  onClick={() => onSelect('yet')}
                  aria-pressed={selected === 'yet'}
                >
                  <span className="marked-proof__mark-slot">
                    <ProofMark mark={MARKS[2]} active={selected === 'yet'} />
                  </span>
                  <span className="marked-proof__wordtype">yet</span>
                  <span className="marked-proof__querycircle" aria-hidden="true">
                    <svg viewBox="0 0 28 28">
                      <ellipse cx="14" cy="14" rx="11" ry="9" fill="none" stroke="currentColor" strokeWidth="1.2" strokeDasharray="70 70" />
                    </svg>
                  </span>
                </button>
                <span className="marked-proof__text">?</span>
              </span>
            </div>
          </div>

          <aside className="marked-proof__margin" aria-label="Margin notes for the proof">
            <span className="marked-proof__margin-rule" aria-hidden="true" />
            {MARKS.map((mark, index) => (
              <button
                key={mark.id}
                type="button"
                className={`marked-proof__note marked-proof__note--${mark.ink} ${selected === mark.id ? 'is-active' : ''}`}
                onClick={() => onSelect(mark.id)}
                aria-pressed={selected === mark.id}
              >
                <span className="marked-proof__note-head">
                  <span className="marked-proof__note-symbol">{mark.symbol}</span>
                  <span className="marked-proof__note-folio">note {String(index + 1).padStart(2, '0')}</span>
                </span>
                <span className="marked-proof__note-text">{mark.note}</span>
                <span className="marked-proof__note-thread" aria-hidden="true" />
              </button>
            ))}
          </aside>
        </div>

        <div className="marked-proof__foot">
          <span className="marked-proof__stamp" aria-hidden="true">
            <svg viewBox="0 0 48 48">
              <circle cx="24" cy="24" r="20" fill="none" stroke="currentColor" strokeWidth="1.1" />
              <circle cx="24" cy="24" r="16" fill="none" stroke="currentColor" strokeWidth=".4" strokeDasharray="1 2" opacity=".7" />
              <text x="24" y="20" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="4" letterSpacing="1.6" fill="currentColor">PROOF · 02</text>
              <text x="24" y="30" textAnchor="middle" fontFamily="Georgia, serif" fontStyle="italic" fontSize="11" fill="currentColor">m³</text>
              <text x="24" y="38" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="3.6" letterSpacing="1.4" fill="currentColor">FOLIO ii</text>
            </svg>
          </span>
          <p className="marked-proof__caption">
            <span aria-hidden="true">※</span>
            The marks are not corrections. They are the editor deciding which words to keep close.
          </p>
          <span className="marked-proof__pagecount" aria-hidden="true">page 1 of 1</span>
        </div>
      </div>
    </section>
  )
}
