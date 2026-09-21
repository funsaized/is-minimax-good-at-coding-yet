import type { CSSProperties } from 'react'
import type { WordId } from './notes'

type MarginaliaProps = {
  selected: WordId
  onSelect: (id: WordId) => void
}

type Card = {
  id: WordId
  index: string
  label: string
  title: string
  gloss: string
  body: string
  tone: 'quiet' | 'human' | 'bold'
  ink: 'acid' | 'coral' | 'blue'
  keep?: boolean
}

const CARDS: Card[] = [
  {
    id: 'm3',
    index: '01',
    label: 'stet',
    title: 'Keep the fingerprint.',
    gloss: 'a habit, not a name',
    body: 'A useful page leaves evidence of a point of view. Not a logo. A small, repeatable act of judgment.',
    tone: 'quiet',
    ink: 'acid',
    keep: false,
  },
  {
    id: 'good',
    index: '02',
    label: 'caret',
    title: 'Choose one clear thing.',
    gloss: 'confidence is generous',
    body: 'The interface gets quieter when it stops presenting every possible answer. A confident choice gives the reader somewhere to stand.',
    tone: 'human',
    ink: 'coral',
    keep: true,
  },
  {
    id: 'yet',
    index: '03',
    label: 'query',
    title: 'Protect the pause.',
    gloss: 'the question stays open',
    body: '"Yet" carries the honest part. The space before an answer is not a gap to decorate; it is where the reader arrives.',
    tone: 'bold',
    ink: 'blue',
    keep: false,
  },
]

const INK_COLOR: Record<Card['ink'], string> = {
  acid: 'var(--bold)',
  coral: 'var(--human)',
  blue: 'var(--quiet)',
}

export function Marginalia({ selected, onSelect }: MarginaliaProps) {
  return (
    <section className="marginalia reveal" id="notes" aria-labelledby="marginalia-title">
      <header className="marginalia__header">
        <span className="eyebrow"><span className="eyebrow__line" />the marginalia</span>
        <h2 id="marginalia-title">
          The page gets better when it <em>pays attention.</em>
        </h2>
        <p className="section__lede">
          Three notes pinned to the same reading rule. Hover or focus a marked word above and its note
          stands up to be read; the others settle back into the row.
        </p>
      </header>

      <div className="marginalia__rule" aria-hidden="true">
        <span className="marginalia__rule-line" />
        <em>three slips pinned · one of them kept</em>
        <span className="marginalia__rule-line" />
      </div>

      <div className="marginalia__cards" role="list">
        {CARDS.map(card => {
          const isActive = selected === card.id
          const style = { '--note-ink': INK_COLOR[card.ink] } as CSSProperties
          return (
            <article
              key={card.id}
              className={`note-card note-card--${card.tone} ${isActive ? 'is-active' : ''} ${card.keep ? 'is-kept' : ''}`}
              style={style}
              role="listitem"
            >
              <span className="note-card__head">
                <span className="note-card__label">{card.label}</span>
                {card.keep ? <span className="note-card__kept">· kept</span> : null}
                <span className="note-card__num" aria-hidden="true">{card.index}</span>
              </span>

              <h3 className="note-card__title">
                <button type="button" onClick={() => onSelect(card.id)} aria-pressed={isActive}>
                  {card.title}
                </button>
              </h3>

              <p className="note-card__gloss"><em>{card.gloss}</em></p>
              <p className="note-card__body">{card.body}</p>

              <span className="note-card__foot">
                <span><span className="note-card__foot-mark" aria-hidden="true">{card.index}</span>folio i</span>
                <span>{card.label}</span>
              </span>
            </article>
          )
        })}
      </div>
    </section>
  )
}
