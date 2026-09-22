import type { CSSProperties } from 'react'
import type { VoiceId } from './App'
import type { WordId } from './notes'

type KeptTallyProps = {
  voice: VoiceId
  counts: Record<WordId, number>
  marked: WordId
}

const ORDER: WordId[] = ['m3', 'good', 'yet']

const WORD_LABEL: Record<WordId, string> = { m3: 'm³', good: 'good at', yet: 'yet?' }
const WORD_INK: Record<WordId, string> = { m3: 'var(--quiet)', good: 'var(--human)', yet: 'var(--bold)' }
const WORD_MARK: Record<WordId, string> = { m3: 'stet', good: 'caret', yet: 'query' }

export function KeptTally({ voice, counts, marked }: KeptTallyProps) {
  const total = ORDER.reduce((sum, id) => sum + (counts[id] ?? 0), 0)
  const widest = Math.max(1, ...ORDER.map(id => counts[id] ?? 0))
  const style = { '--kept-tone': `var(--${voice})` } as CSSProperties

  return (
    <figure className="kept-tally" style={style} aria-label="The marks kept during this reading">
      <header className="kept-tally__head" aria-hidden="true">
        <span className="kept-tally__eyebrow">kept · on the day</span>
        <span className="kept-tally__rule" />
        <em className="kept-tally__note">three marks · set in the voice</em>
      </header>

      <ol className="kept-tally__list">
        {ORDER.map(id => {
          const count = counts[id] ?? 0
          const ratio = count / widest
          const isMarked = id === marked
          const rowStyle = {
            '--kt-ink': WORD_INK[id],
            '--kt-ratio': String(ratio),
          } as CSSProperties
          return (
            <li
              key={id}
              className={`kept-tally__row ${count > 0 ? 'is-kept' : ''} ${isMarked ? 'is-marked' : ''}`}
              style={rowStyle}
            >
              <span className="kept-tally__row-key">
                <span className="kept-tally__row-glyph" aria-hidden="true">
                  {WORD_MARK[id] === 'stet' ? '⌇' : WORD_MARK[id] === 'caret' ? '∧' : '?'}
                </span>
                <em>{WORD_LABEL[id]}</em>
              </span>
              <span className="kept-tally__row-bar" aria-hidden="true">
                <span className="kept-tally__row-fill" />
                <span className="kept-tally__row-marks">
                  {Array.from({ length: count }, (_, i) => (
                    <span key={i} className="kept-tally__row-tick" />
                  ))}
                </span>
              </span>
              <span className="kept-tally__row-count">
                <span className="kept-tally__row-num">{String(count).padStart(2, '0')}</span>
                <span className="kept-tally__row-label">
                  {count === 0 ? 'not yet' : count === 1 ? 'kept once' : `kept ${count} times`}
                </span>
              </span>
            </li>
          )
        })}
      </ol>

      <footer className="kept-tally__foot" aria-hidden="true">
        <span className="kept-tally__foot-rule" />
        <span className="kept-tally__foot-total">
          <em>{String(total).padStart(3, '0')}</em>
          <span>marks kept · this reading</span>
        </span>
        <span className="kept-tally__foot-rule" />
      </footer>
    </figure>
  )
}