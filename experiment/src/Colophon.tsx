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

export function Colophon({ voice, word, setToday }: ColophonProps) {
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
            A colophon is where a book tells you how it was made. This one is a short list of the
            choices that earned their place on the page — and the ones that didn't.
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
          </div>
        </div>
      </div>
    </section>
  )
}
