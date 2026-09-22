import { useId, type CSSProperties } from 'react'
import type { VoiceId } from './App'
import type { WordId } from './notes'

type PressSignatureProps = {
  voice: VoiceId
  word: WordId
  setToday: string
}

type MarkCell = {
  id: WordId
  glyph: string
  mark: string
  markVerb: string
  word: string
  wordSub: string
  testimony: string
  ink: 'quiet' | 'human' | 'bold'
}

const CELLS: MarkCell[] = [
  {
    id: 'm3',
    glyph: '⌇',
    mark: 'stet',
    markVerb: 'let it stand',
    word: 'm³',
    wordSub: 'the maker',
    testimony: 'a fingerprint, kept by the page',
    ink: 'quiet',
  },
  {
    id: 'good',
    glyph: '∧',
    mark: 'caret',
    markVerb: 'make room',
    word: 'good at',
    wordSub: 'the verb',
    testimony: 'one clear thing, held in present tense',
    ink: 'human',
  },
  {
    id: 'yet',
    glyph: '?',
    mark: 'query',
    markVerb: 'protect the pause',
    word: 'yet?',
    wordSub: 'the question',
    testimony: 'the pause before any answer',
    ink: 'bold',
  },
]

const VOICE_NAME: Record<VoiceId, string> = { quiet: 'quiet cut', human: 'human hand', bold: 'bold signal' }
const VOICE_LETTER: Record<VoiceId, string> = { quiet: 'a', human: 'b', bold: 'c' }

export function PressSignature({ voice, word, setToday }: PressSignatureProps) {
  const baseId = useId().replace(/:/g, '')
  const gradId = `press-sig-grad-${baseId}`

  const style = {
    '--press-sig-tone': `var(--${voice})`,
  } as CSSProperties

  return (
    <figure className="press-signature" style={style} aria-label="The three marks of the day, composed as the page's signature">
      <svg
        className="press-signature__defs"
        viewBox="0 0 600 24"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--press-sig-tone)" stopOpacity="0" />
            <stop offset="50%" stopColor="var(--press-sig-tone)" stopOpacity=".85" />
            <stop offset="100%" stopColor="var(--press-sig-tone)" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      <header className="press-signature__head" aria-hidden="true">
        <span className="press-signature__eyebrow">three marks · the page's signature</span>
        <span className="press-signature__head-rule" />
        <em className="press-signature__head-meta">
          composed in <span className="press-signature__head-voice">{VOICE_LETTER[voice]}</span> · {VOICE_NAME[voice]}
        </em>
      </header>

      <ol className="press-signature__row">
        {CELLS.map((cell, idx) => {
          const isMarked = cell.id === word
          const cellStyle = {
            '--press-sig-ink': `var(--${cell.ink})`,
          } as CSSProperties
          return (
            <li
              key={cell.id}
              className={`press-signature__cell press-signature__cell--${cell.ink} ${isMarked ? 'is-marked' : ''}`}
              style={cellStyle}
            >
              <span className="press-signature__cell-rule" aria-hidden="true">
                <svg viewBox="0 0 100 6" preserveAspectRatio="none">
                  <line
                    x1="0"
                    y1="3"
                    x2="100"
                    y2="3"
                    stroke={`url(#${gradId})`}
                    strokeWidth=".7"
                    strokeLinecap="round"
                  />
                </svg>
              </span>

              <span className="press-signature__cell-cap" aria-hidden="true">
                <span className="press-signature__cell-cap-glyph">{cell.glyph}</span>
                <span className="press-signature__cell-cap-mark">{cell.mark}</span>
              </span>

              <span className="press-signature__cell-word">{cell.word}</span>
              <span className="press-signature__cell-sub">{cell.wordSub}</span>

              <span className="press-signature__cell-testimony">
                <span className="press-signature__cell-testimony-line">{cell.testimony}</span>
                <em className="press-signature__cell-testimony-verb">— {cell.markVerb}</em>
              </span>

              <span className="press-signature__cell-bead" aria-hidden="true">
                <svg viewBox="0 0 14 14">
                  <circle cx="7" cy="7" r="6" fill="var(--night)" stroke="currentColor" strokeWidth=".6" />
                  <circle cx="7" cy="7" r="3.4" fill="none" stroke="currentColor" strokeWidth=".3" strokeDasharray=".8 1.4" opacity=".7" />
                  <circle cx="7" cy="7" r="1.1" fill="currentColor" />
                </svg>
              </span>

              {idx < CELLS.length - 1 && (
                <span className="press-signature__cell-divider" aria-hidden="true">
                  <svg viewBox="0 0 8 36" preserveAspectRatio="none">
                    <line x1="4" y1="0" x2="4" y2="36" stroke="currentColor" strokeWidth=".5" strokeDasharray=".9 2" opacity=".55" />
                    <circle cx="4" cy="6" r=".9" fill="currentColor" opacity=".65" />
                    <circle cx="4" cy="30" r=".9" fill="currentColor" opacity=".65" />
                  </svg>
                </span>
              )}
            </li>
          )
        })}
      </ol>

      <footer className="press-signature__foot" aria-hidden="true">
        <span className="press-signature__foot-rule" />
        <em className="press-signature__foot-line">
          composed and set on <span className="press-signature__foot-date">{setToday}</span>
          <span className="press-signature__foot-dot">·</span>
          the press of <span className="press-signature__foot-press">m³</span>
        </em>
        <span className="press-signature__foot-rule" />
      </footer>
    </figure>
  )
}