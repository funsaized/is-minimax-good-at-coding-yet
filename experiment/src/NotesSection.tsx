import { type CSSProperties } from 'react'
import { NOTES, type WordId } from './notes'

type NotesSectionProps = {
  selected: WordId
  onSelect: (id: WordId) => void
}

type Slip = {
  id: WordId
  index: string
  folio: string
  label: string
  title: string
  gloss: string
  body: string
  prompt: string
  editor: string
  seen: string
  ink: 'acid' | 'coral' | 'blue'
  glyph: 'stet' | 'caret' | 'query'
  rotate: number
  rise: number
  kept: boolean
}

const SLIPS: Slip[] = [
  {
    id: 'm3',
    index: '01',
    folio: 'i · the maker',
    label: 'stet',
    title: 'Keep the fingerprint.',
    gloss: 'a habit, not a name',
    body: 'A useful page leaves evidence of a point of view. Not a logo. A small, repeatable act of judgment.',
    prompt: 'the maker is a habit',
    editor: 'a quiet corner of the title — leave it alone',
    seen: 'seen twice today',
    ink: 'acid',
    glyph: 'stet',
    rotate: -1.4,
    rise: -6,
    kept: false,
  },
  {
    id: 'good',
    index: '02',
    folio: 'ii · the verb',
    label: 'caret',
    title: 'Choose one clear thing.',
    gloss: 'confidence is generous',
    body: 'The interface gets quieter when it stops presenting every possible answer. A confident choice gives the reader somewhere to stand.',
    prompt: 'make room for attention',
    editor: 'keep it present tense',
    seen: 'read aloud once',
    ink: 'coral',
    glyph: 'caret',
    rotate: 0.6,
    rise: 14,
    kept: true,
  },
  {
    id: 'yet',
    index: '03',
    folio: 'iii · the pause',
    label: 'query',
    title: 'Protect the pause.',
    gloss: 'the question stays open',
    body: '“Yet” carries the honest part. The space before an answer is not a gap to decorate; it is where the reader arrives.',
    prompt: 'leave room to arrive',
    editor: 'the question mark is doing real work',
    seen: 'circled in pencil',
    ink: 'blue',
    glyph: 'query',
    rotate: -0.4,
    rise: -2,
    kept: false,
  },
]

function GlyphMark({ glyph }: { glyph: Slip['glyph'] }) {
  if (glyph === 'stet') {
    return (
      <svg className="slip__glyph-svg" viewBox="0 0 48 18" aria-hidden="true">
        <path
          d="M2 12c5-5 9 5 14 0s9-5 14 0 9 5 14 0"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
          strokeDasharray="100 100"
          pathLength="100"
          className="slip__glyph-stroke"
        />
        <circle cx="46" cy="12" r="1.4" fill="currentColor" className="slip__glyph-bead" />
      </svg>
    )
  }
  if (glyph === 'caret') {
    return (
      <svg className="slip__glyph-svg" viewBox="0 0 48 22" aria-hidden="true">
        <path d="M24 19l-11-15h22z" fill="currentColor" className="slip__glyph-fill" />
        <line x1="2" y1="19" x2="46" y2="19" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
      </svg>
    )
  }
  return (
    <svg className="slip__glyph-svg" viewBox="0 0 48 26" aria-hidden="true">
      <ellipse cx="24" cy="14" rx="14" ry="11" fill="none" stroke="currentColor" strokeWidth="1.1" strokeDasharray="100 100" pathLength="100" className="slip__glyph-stroke" />
      <text x="24" y="19" textAnchor="middle" fontFamily="Georgia, serif" fontStyle="italic" fontSize="14" fill="currentColor">?</text>
    </svg>
  )
}

function FoldedCorner() {
  return (
    <svg className="slip__fold" viewBox="0 0 32 32" aria-hidden="true">
      <path d="M32 0L0 0L0 32Z" fill="rgba(243, 236, 214, .04)" />
      <path d="M32 0L32 32L0 32" fill="none" stroke="currentColor" strokeWidth=".8" opacity=".55" />
      <path d="M32 0L18 14" fill="none" stroke="currentColor" strokeWidth=".6" opacity=".35" />
      <path d="M32 0L8 24" fill="none" stroke="currentColor" strokeWidth=".5" opacity=".22" />
    </svg>
  )
}

function WaxSpot({ ink }: { ink: Slip['ink'] }) {
  return (
    <svg className={`slip__wax slip__wax--${ink}`} viewBox="0 0 24 24" aria-hidden="true">
      <ellipse cx="12" cy="20" rx="5" ry="1.2" fill="rgba(0,0,0,.32)" />
      <circle cx="12" cy="11" r="7.5" fill="currentColor" />
      <circle cx="9.5" cy="8.5" r="2.2" fill="rgba(255, 255, 255, .35)" />
      <circle cx="14" cy="13.5" r="1.4" fill="rgba(0, 0, 0, .22)" />
    </svg>
  )
}

function SlipSeal({ ink, label }: { ink: Slip['ink']; label: string }) {
  return (
    <svg className={`slip__seal slip__seal--${ink}`} viewBox="0 0 64 64" aria-hidden="true">
      <ellipse cx="32" cy="58" rx="14" ry="2" fill="rgba(0,0,0,.35)" />
      <circle cx="32" cy="30" r="20" fill="currentColor" opacity=".95" />
      <circle cx="32" cy="30" r="15.5" fill="none" stroke="rgba(255,255,255,.5)" strokeWidth=".7" />
      <circle cx="32" cy="30" r="11.5" fill="none" stroke="rgba(0,0,0,.25)" strokeWidth=".5" strokeDasharray="1 2" />
      <text x="32" y="33.5" textAnchor="middle" fontFamily="Georgia, serif" fontStyle="italic" fontSize="13" fill="rgba(255,255,255,.92)">m³</text>
      <text x="32" y="50" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="3.5" letterSpacing="1.6" fill="rgba(0,0,0,.55)">{label}</text>
    </svg>
  )
}

function InkFlourish() {
  return (
    <svg className="slip__flourish" viewBox="0 0 200 14" preserveAspectRatio="none" aria-hidden="true">
      <path
        d="M2 9c12-6 24 4 36-1s24-6 36-2 24 4 36-2 24-4 36-1 24 4 24 4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeDasharray="200 200"
        pathLength="100"
        className="slip__flourish-stroke"
      />
      <circle cx="196" cy="9" r="1.1" fill="currentColor" className="slip__flourish-bead" />
    </svg>
  )
}

export function NotesSection({ selected, onSelect }: NotesSectionProps) {
  return (
    <section className="section marginalia-section" id="notes" aria-labelledby="marginalia-title">
      <div className="section__header marginalia-section__header">
        <p className="eyebrow">
          <span className="eyebrow__line" />
          marginal ledger <em>three things worth keeping</em>
        </p>
        <h2 id="marginalia-title">
          The page gets better when it <i>pays attention.</i>
        </h2>
        <p className="section__lede">
          Three slips pinned to the same reading rule. Hover or focus a marked word above and its slip stands up to be read; the others settle back into the column.
        </p>
      </div>

      <span className="marginalia-section__thread" aria-hidden="true">
        <svg viewBox="0 0 200 80" preserveAspectRatio="none">
          <path
            d="M2 56c16-8 32 8 48-2s32-10 48-4 32 6 48-2 32-10 48-4"
            fill="none"
            stroke="currentColor"
            strokeWidth=".9"
            strokeLinecap="round"
            strokeDasharray="200 200"
            pathLength="100"
            className="marginalia-section__thread-stroke"
          />
          <circle cx="198" cy="44" r="1.2" fill="currentColor" className="marginalia-section__thread-bead" />
        </svg>
      </span>

      <div className="marginalia-section__rule" aria-hidden="true">
        <span className="marginalia-section__rule-edge" />
        <span className="marginalia-section__rule-line" />
        <span className="marginalia-section__rule-tag">
          <span aria-hidden="true">※</span>
          the slips ride the same reading rule · the kept one wears the seal
        </span>
        <span className="marginalia-section__rule-line" />
        <span className="marginalia-section__rule-edge" />
      </div>

      <div className="marginalia-section__rail" role="list" aria-label="The three kept notes, pinned to the rule">
        {SLIPS.map((slip, index) => {
          const isSelected = selected === slip.id
          const isDimmed = selected !== null && !isSelected
          const style = {
            '--slip-rise': `${slip.rise}px`,
            '--slip-rotate': `${slip.rotate}deg`,
            '--slip-tone': `var(--${slip.ink})`,
          } as CSSProperties
          return (
            <article
              key={slip.id}
              id={`note-${slip.id}`}
              className={`slip slip--${slip.id} slip--${slip.ink} ${isSelected ? 'is-selected' : ''} ${isDimmed ? 'is-dimmed' : ''} ${slip.kept ? 'is-kept' : ''}`}
              style={style}
              role="listitem"
            >
              <span className="slip__pin" aria-hidden="true">
                <WaxSpot ink={slip.ink} />
              </span>

              <FoldedCorner />

              <span className="slip__head" aria-hidden="true">
                <span className="slip__index">{slip.index}</span>
                <span className="slip__folio">{slip.folio}</span>
              </span>

              <span className="slip__rule" aria-hidden="true" />

              <span className="slip__label">
                <span className="slip__label-eyebrow">kept note</span>
                <span className="slip__label-mark">{slip.label}</span>
              </span>

              <h3 className="slip__title">
                <button
                  type="button"
                  className="slip__select"
                  onClick={() => onSelect(slip.id)}
                  aria-pressed={isSelected}
                  aria-describedby={`note-${slip.id}-body`}
                >
                  <span className="slip__title-text">{slip.title}</span>
                </button>
              </h3>

              <p className="slip__gloss" id={`note-${slip.id}-body`}>
                <em>{slip.gloss}</em>
                <span aria-hidden="true">·</span>
                <span className="slip__gloss-editor">{slip.editor}</span>
              </p>

              <p className="slip__body">{slip.body}</p>

              <span className="slip__mark" aria-hidden="true">
                <GlyphMark glyph={slip.glyph} />
              </span>

              <span className="slip__foot">
                <span className="slip__foot-rule" aria-hidden="true" />
                <InkFlourish />
                <span className="slip__foot-prompt">
                  <span className="slip__foot-prompt-mark" aria-hidden="true">↗</span>
                  <span>{slip.prompt}</span>
                </span>
                <span className="slip__foot-seen" aria-hidden="true">
                  <span aria-hidden="true">·</span>
                  {slip.seen}
                </span>
              </span>

              {slip.kept && (
                <span className="slip__seal-wrap" aria-hidden="true">
                  <SlipSeal ink={slip.ink} label={slip.index} />
                </span>
              )}

              <span className="slip__tack" aria-hidden="true" />
              <span className="slip__tack-slip" aria-hidden="true" />
            </article>
          )
        })}
      </div>

      <p className="marginalia-section__caption">
        <span aria-hidden="true">※</span>
        three marks pinned, one of them kept <span aria-hidden="true">·</span> the rest live in the body of the page.
      </p>
    </section>
  )
}
