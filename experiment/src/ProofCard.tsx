import type { CSSProperties } from 'react'
import type { WordId } from './notes'

type VoiceId = 'quiet' | 'human' | 'bold'

type ProofCardProps = {
  word: WordId
  voice: VoiceId
}

const WORD_DISPLAY: Record<WordId, { set: string; mark: string; markLabel: string; ink: string }> = {
  m3: { set: 'M3', mark: 'stet', markLabel: 'let it stand', ink: 'var(--acid)' },
  good: { set: 'good at', mark: 'caret', markLabel: 'insert here', ink: 'var(--coral)' },
  yet: { set: 'yet', mark: 'query', markLabel: 'is this true?', ink: 'var(--blue)' },
}

const WORD_NOTE: Record<WordId, { hand: string; pencil: string; margin: string }> = {
  m3: {
    hand: 'Keep the fingerprint. A useful page leaves evidence of a point of view — not a logo, but a habit.',
    pencil: 'the maker is a habit, not a name.',
    margin: 'a quiet corner of the title — leave it alone.',
  },
  good: {
    hand: 'Choose one clear thing. The interface gets quieter when it stops presenting every possible answer.',
    pencil: 'make room for the reader to stand somewhere.',
    margin: 'the verb of the question — keep it present tense.',
  },
  yet: {
    hand: 'Protect the pause. The space before an answer is not a gap to decorate; it is where the reader arrives.',
    pencil: 'leave room to arrive before any answer.',
    margin: 'the question mark is doing real work here.',
  },
}

const WORD_FOLIO: Record<WordId, string> = { m3: 'folio i', good: 'folio ii', yet: 'folio iii' }
const WORD_INDEX: Record<WordId, string> = { m3: '01', good: '02', yet: '03' }
const VOICE_TONE: Record<VoiceId, string> = { quiet: 'quiet cut', human: 'human hand', bold: 'bold signal' }
const VOICE_LETTER: Record<VoiceId, string> = { quiet: 'a', human: 'b', bold: 'c' }

export function ProofCard({ word, voice }: ProofCardProps) {
  const display = WORD_DISPLAY[word]
  const note = WORD_NOTE[word]
  const style = { '--proof-ink': display.ink } as CSSProperties
  return (
    <aside className="proof-card" key={word} aria-label={`Editor's note on ${display.set}`} style={style}>
      <span className="proof-card__corner proof-card__corner--tl" aria-hidden="true" />
      <span className="proof-card__corner proof-card__corner--tr" aria-hidden="true" />
      <span className="proof-card__corner proof-card__corner--bl" aria-hidden="true" />
      <span className="proof-card__corner proof-card__corner--br" aria-hidden="true" />

      <span className="proof-card__pin" aria-hidden="true">
        <svg viewBox="0 0 22 22">
          <ellipse cx="11" cy="19" rx="4.5" ry="1.2" fill="rgba(0, 0, 0, .35)" />
          <line x1="11" y1="14" x2="11" y2="20" stroke="rgba(0, 0, 0, .35)" strokeWidth=".8" />
          <circle cx="11" cy="9" r="6.5" fill="currentColor" />
          <circle cx="9.5" cy="7.5" r="2" fill="rgba(255, 255, 255, .45)" />
        </svg>
      </span>

      <span className="proof-card__plate" aria-hidden="true">
        <span className="proof-card__plate-line" />
        <span className="proof-card__plate-tag">
          <span className="proof-card__plate-tag-mark" />
          editor's note · {WORD_FOLIO[word]}
        </span>
        <span className="proof-card__plate-line" />
      </span>

      <div className="proof-card__inner">
        <div className="proof-card__type">
          <span className="proof-card__type-linenum" aria-hidden="true">{WORD_INDEX[word]}</span>
          <span className="proof-card__type-word">{display.set}</span>
          <span className="proof-card__type-glyph" aria-hidden="true">
            <svg viewBox="0 0 60 60">
              <circle cx="30" cy="30" r="24" fill="none" stroke="currentColor" strokeWidth=".8" />
              <circle cx="30" cy="30" r="20" fill="none" stroke="currentColor" strokeWidth=".4" strokeDasharray="1 2" opacity=".6" />
              <text x="30" y="22" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="4" letterSpacing="1.4" fill="currentColor">PROOF · {WORD_INDEX[word]}</text>
              <text x="30" y="36" textAnchor="middle" fontFamily="Georgia, serif" fontStyle="italic" fontSize="11" fill="currentColor">
                {word === 'm3' ? 'stet' : word === 'good' ? '∧' : '?'}
              </text>
              <text x="30" y="46" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="3.6" letterSpacing="1.4" fill="currentColor">FOLIO {WORD_FOLIO[word].split(' ')[1].toUpperCase()}</text>
            </svg>
          </span>
        </div>

        <div className="proof-card__body">
          <p className="proof-card__hand">{note.hand}</p>
          <p className="proof-card__pencil">
            <span className="proof-card__pencil-mark" aria-hidden="true">↳</span>
            <em>{note.pencil}</em>
          </p>
        </div>

        <div className="proof-card__margin">
          <span className="proof-card__margin-thread" aria-hidden="true">
            <svg viewBox="0 0 6 60" preserveAspectRatio="none">
              <path d="M3 0c0 10-2 18 0 28s0 18 1 30" fill="none" stroke="currentColor" strokeWidth=".6" strokeLinecap="round" />
              <circle cx="3" cy="58" r="1.1" fill="currentColor" />
            </svg>
          </span>
          <p className="proof-card__margin-note">{note.margin}</p>
        </div>
      </div>

      <footer className="proof-card__foot">
        <span className="proof-card__foot-mark">
          <svg viewBox="0 0 90 18" preserveAspectRatio="none" aria-hidden="true">
            <path d="M2 11c6-6 14 4 22-2s14-6 22-1 14 4 22-2 14-6 18-1" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
            <circle cx="86" cy="10" r="1.4" fill="currentColor" />
          </svg>
        </span>
        <span className="proof-card__foot-meta">
          marked <em>{display.markLabel}</em> · pulled in <em>{VOICE_TONE[voice]}</em>
        </span>
        <span className="proof-card__foot-letter" aria-hidden="true">{VOICE_LETTER[voice]}</span>
      </footer>
    </aside>
  )
}