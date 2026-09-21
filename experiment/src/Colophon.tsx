import type { CSSProperties } from 'react'
import type { VoiceId } from './App'
import type { WordId } from './notes'

type ColophonProps = {
  voice: VoiceId
  word: WordId
  setToday: string
}

const VOICE_NAME: Record<VoiceId, string> = { quiet: 'quiet cut', human: 'human hand', bold: 'bold signal' }
const VOICE_LETTER: Record<VoiceId, string> = { quiet: 'A', human: 'B', bold: 'C' }
const WORD_LABEL: Record<WordId, string> = { m3: 'm³', good: 'good at', yet: 'yet?' }
const WORD_MARK: Record<WordId, string> = { m3: 'stet', good: 'caret', yet: 'query' }
const WORD_NOTE: Record<WordId, string> = {
  m3: 'keep the fingerprint',
  good: 'choose one clear thing',
  yet: 'protect the pause',
}

const SEAL_TEXT: Record<VoiceId, { top: string; bot: string; glyph: string }> = {
  quiet: { top: 'PRESS · SET', bot: 'FOLIO · TODAY', glyph: 'm³' },
  human: { top: 'SET BY HAND', bot: 'FOR NOW', glyph: 'm³' },
  bold: { top: 'M³ · YES · M³', bot: 'AGAIN', glyph: 'M³' },
}

export function Colophon({ voice, word, setToday }: ColophonProps) {
  const tone = voice === 'quiet' ? 'var(--quiet)' : voice === 'human' ? 'var(--human)' : 'var(--bold)'
  const sealStyle = { color: tone } as CSSProperties
  const seal = SEAL_TEXT[voice]

  return (
    <section className="colophon reveal" id="colophon" aria-labelledby="colophon-title">
      <div className="colophon__inner">
        <header className="colophon__head">
          <span className="colophon__eyebrow">the colophon</span>
          <h2 id="colophon-title" className="colophon__title">
            The page <em>signed off,</em>
            <br />
            and the question left open.
          </h2>
          <p className="section__lede">
            A colophon is where a book tells you how it was made. This one is the short list of choices
            that earned their place on the page — and the one that didn't.
          </p>
        </header>

        <div className="colophon__body">
          <p className="colophon__line">
            Composed in three voices for the same line, this page is a small drawing of an
            honest process — <em>quiet by default, bold on demand, and human in the middle.</em>
          </p>

          <div className="colophon__meta">
            <div className="colophon__cell">
              <span className="colophon__cell-key">composed in</span>
              <em>{VOICE_LETTER[voice]} · {VOICE_NAME[voice]}</em>
            </div>
            <div className="colophon__cell">
              <span className="colophon__cell-key">marked at</span>
              <em>{WORD_LABEL[word]} · {WORD_MARK[word]}</em>
            </div>
            <div className="colophon__cell">
              <span className="colophon__cell-key">set on</span>
              <em>{setToday}</em>
            </div>
            <div className="colophon__cell">
              <span className="colophon__cell-key">the rule</span>
              <em>{WORD_NOTE[word]}</em>
            </div>
          </div>

          <div className="colophon__signoff" aria-label="The page, signed">
            <svg className="colophon__seal" viewBox="0 0 100 100" aria-hidden="true" style={sealStyle}>
              <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth=".9" />
              <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth=".35" strokeDasharray="1 2.5" opacity=".5" />
              <circle cx="50" cy="50" r="35" fill="none" stroke="currentColor" strokeWidth=".3" opacity=".3" />
              <circle cx="50" cy="6" r="1.4" fill="currentColor" opacity=".85" />
              <circle cx="50" cy="94" r="1.4" fill="currentColor" opacity=".85" />
              <circle cx="6" cy="50" r="1.4" fill="currentColor" opacity=".85" />
              <circle cx="94" cy="50" r="1.4" fill="currentColor" opacity=".85" />
              <text x="50" y="22" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="5" letterSpacing="2" fill="currentColor">
                {seal.top}
              </text>
              <text
                x="50"
                y="58"
                textAnchor="middle"
                fontFamily="Georgia, serif"
                fontStyle={voice === 'bold' ? 'normal' : 'italic'}
                fontSize={voice === 'bold' ? 32 : 38}
                fontWeight={voice === 'bold' ? 800 : 500}
                fill="currentColor"
              >
                {seal.glyph}
              </text>
              <text x="50" y="86" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="5" letterSpacing="2" fill="currentColor">
                {seal.bot}
              </text>
            </svg>

            <p className="colophon__signoff-line">
              a single line, set three ways, marked at <em>{WORD_LABEL[word]}</em> — <em>{WORD_NOTE[word]}</em>.
            </p>

            <span className="colophon__signoff-set">
              <span className="colophon__signoff-rule" aria-hidden="true" />
              composed in {VOICE_NAME[voice]}
              <em>· {setToday}</em>
              <span className="colophon__signoff-rule" aria-hidden="true" />
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}