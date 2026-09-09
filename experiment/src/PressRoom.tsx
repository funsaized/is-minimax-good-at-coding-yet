import { PressBay, type VoiceId } from './PressBay'
import type { WordId } from './notes'

type PressRoomProps = {
  voice: VoiceId
  word: WordId
  onVoice: (voice: VoiceId) => void
}

const VOICES: { letter: string; name: string; face: string; ink: string }[] = [
  { letter: 'A', name: 'quiet cut', face: 'serif · italic · close set', ink: 'paper on midnight' },
  { letter: 'B', name: 'human hand', face: 'serif · italic · warm', ink: 'coral on plum' },
  { letter: 'C', name: 'bold signal', face: 'sans · heavy · no apology', ink: 'acid on midnight' },
]

export function PressRoom({ voice, word, onVoice }: PressRoomProps) {
  return (
    <section className="press-room section" id="press-room" aria-labelledby="press-room-title">
      <div className="press-room__sheet">
        <span className="press-room__plate" aria-hidden="true">folio i· · the press bay</span>
        <span className="press-room__crop press-room__crop--tl" aria-hidden="true" />
        <span className="press-room__crop press-room__crop--tr" aria-hidden="true" />
        <span className="press-room__crop press-room__crop--bl" aria-hidden="true" />
        <span className="press-room__crop press-room__crop--br" aria-hidden="true" />

        <header className="press-room__head">
          <p className="eyebrow"><span className="eyebrow__line" />press bay <em>folio i· · the lever</em></p>
          <h2 id="press-room-title">Pull a lever, <i>change the reading.</i></h2>
          <p className="section__lede">The composing press moves out of the margin. Each pull swaps the title above and the spread below — typography is part of any honest answer.</p>
        </header>

        <div className="press-room__body">
          <aside className="press-room__notes" aria-label="Notes on the lever">
            <span className="press-room__notes-eyebrow">on the lever</span>
            <p>
              The lever is the page's most physical control. Pull it down and the type in the title above and the spread below settle into the next voice.
            </p>
            <ol className="press-room__voices">
              {VOICES.map(entry => (
                <li
                  key={entry.letter}
                  className={`press-room__voices-item press-room__voices-item--${entry.name.split(' ')[0]} ${voice === entry.name.split(' ')[0] ? 'is-current' : ''}`}
                >
                  <span className="press-room__voices-letter" aria-hidden="true">{entry.letter}</span>
                  <span className="press-room__voices-copy">
                    <strong>{entry.name}</strong>
                    <em>{entry.face}</em>
                  </span>
                </li>
              ))}
            </ol>
            <p className="press-room__notes-hint">
              click · or press <kbd>shift</kbd><span aria-hidden="true">+</span><kbd>v</kbd>
            </p>
          </aside>

          <div className="press-room__press">
            <PressBay voice={voice} word={word} onVoice={onVoice} />
          </div>
        </div>

        <p className="press-room__caption">
          <span aria-hidden="true">※</span>
          The lever is bound to the type ladder in the chapter above and to the composing stick that follows. One voice, three readings.
        </p>
      </div>
    </section>
  )
}