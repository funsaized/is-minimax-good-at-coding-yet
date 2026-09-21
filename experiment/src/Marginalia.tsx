import type { CSSProperties } from 'react'
import type { WordId } from './notes'

type MarginaliaProps = {
  selected: WordId
  onSelect: (id: WordId) => void
}

type Slip = {
  id: WordId
  index: string
  label: string
  title: string
  gloss: string
  body: string
  paper: 'paper' | 'acid' | 'blue' | 'coral'
  keep?: boolean
  rotation: number
  pin: 'tack' | 'clip' | 'pin'
}

const SLIPS: Slip[] = [
  {
    id: 'm3',
    index: 'i',
    label: 'stet',
    title: 'Keep the fingerprint.',
    gloss: 'a habit, not a name',
    body: 'A useful page leaves evidence of a point of view. Not a logo. A small, repeatable act of judgment that another page can recognize.',
    paper: 'paper',
    rotation: -1.2,
    pin: 'tack',
  },
  {
    id: 'good',
    index: 'ii',
    label: 'caret',
    title: 'Choose one clear thing.',
    gloss: 'confidence is generous',
    body: 'The interface gets quieter when it stops presenting every possible answer. A confident choice gives the reader somewhere to stand, instead of somewhere to pick from.',
    paper: 'acid',
    keep: true,
    rotation: 0.4,
    pin: 'clip',
  },
  {
    id: 'yet',
    index: 'iii',
    label: 'query',
    title: 'Protect the pause.',
    gloss: 'the question stays open',
    body: '"Yet" carries the honest part. The space before an answer is not a gap to decorate; it is where the reader arrives, and the page should leave them there.',
    paper: 'blue',
    rotation: 0.8,
    pin: 'pin',
  },
]

const SLIP_INK: Record<Slip['paper'], string> = {
  paper: 'var(--quiet)',
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
          Three notes pinned to the same reading rule. Hover or focus a marked word above and its slip
          straightens to be read; the others settle back into the row. One of them is kept.
        </p>
      </header>

      <div className="marginalia__rule" aria-hidden="true">
        <span className="marginalia__rule-line" />
        <em>three slips pinned <em>·</em> one of them kept</em>
        <span className="marginalia__rule-line" />
      </div>

      <div className="marginalia__board" role="list">
        <span className="marginalia__board-cord" aria-hidden="true" />
        <span className="marginalia__board-cord marginalia__board-cord--lower" aria-hidden="true" />
        {SLIPS.map(slip => {
          const isActive = selected === slip.id
          const style = {
            '--slip-tilt': `${slip.rotation}deg`,
            '--slip-ink': SLIP_INK[slip.paper],
          } as CSSProperties
          return (
            <article
              key={slip.id}
              className={`slip slip--${slip.paper} ${isActive ? 'is-active' : ''} ${slip.keep ? 'is-kept' : ''}`}
              style={style}
              role="listitem"
            >
              <span className={`slip__pin slip__pin--${slip.pin}`} aria-hidden="true">
                <svg viewBox="0 0 24 24" width="14" height="14">
                  {slip.pin === 'tack' && (
                    <>
                      <circle cx="12" cy="12" r="3" fill="currentColor" />
                      <circle cx="12" cy="12" r="5" fill="none" stroke="currentColor" strokeWidth=".6" />
                    </>
                  )}
                  {slip.pin === 'clip' && (
                    <path d="M9 3v18h2V5h7V3M11 11h7" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                  )}
                  {slip.pin === 'pin' && (
                    <>
                      <circle cx="12" cy="6" r="3" fill="currentColor" />
                      <path d="M12 9v12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                    </>
                  )}
                </svg>
              </span>

              <span className="slip__index" aria-hidden="true">
                <em>{slip.index}</em>
                <span>{slip.label}</span>
              </span>

              <h3 className="slip__title">
                <button type="button" onClick={() => onSelect(slip.id)} aria-pressed={isActive}>
                  {slip.title}
                </button>
              </h3>

              <p className="slip__gloss"><em>{slip.gloss}</em></p>
              <p className="slip__body">{slip.body}</p>

              {slip.keep && (
                <span className="slip__stamp" aria-hidden="true">
                  <svg viewBox="0 0 60 60" width="56" height="56">
                    <circle cx="30" cy="30" r="27" fill="none" stroke="currentColor" strokeWidth="1.2" />
                    <circle cx="30" cy="30" r="22" fill="none" stroke="currentColor" strokeWidth=".4" strokeDasharray="1.5 1.5" />
                    <text x="30" y="22" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="4.5" letterSpacing="2" fill="currentColor">KEPT · NO ii</text>
                    <text x="30" y="38" textAnchor="middle" fontFamily="Georgia, serif" fontStyle="italic" fontSize="14" fill="currentColor">caret</text>
                    <text x="30" y="50" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="3.5" letterSpacing="2" fill="currentColor">FOR THE KEEPING</text>
                  </svg>
                </span>
              )}

              <span className="slip__foot" aria-hidden="true">
                <span>folio iii <em>·</em> pinned</span>
                <span>slip № {slip.index}</span>
              </span>
            </article>
          )
        })}
      </div>
    </section>
  )
}