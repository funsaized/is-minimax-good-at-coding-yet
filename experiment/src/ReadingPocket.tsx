import type { CSSProperties } from 'react'
import type { KeyboardEvent as ReactKeyboardEvent } from 'react'
import type { VoiceId } from './Press'
import { NOTES, type WordId } from './notes'

type ReadingPocketProps = {
  voice: VoiceId
  word: WordId
  setToday: string
  answerOpen: boolean
  answerTriggerRef: React.RefObject<HTMLButtonElement | null>
  onToggleAnswer: () => void
}

const VOICE_META: Record<VoiceId, { name: string; letter: string; face: string }> = {
  quiet: { name: 'quiet cut', letter: 'A', face: 'serif · italic · close set' },
  human: { name: 'human hand', letter: 'B', face: 'serif · italic · warm' },
  bold: { name: 'bold signal', letter: 'C', face: 'sans · heavy · no apology' },
}

const POCKET_FOLIOS: { id: string; index: string; label: string; hint: string; tone: VoiceId }[] = [
  { id: 'question', index: 'i', label: 'the question', hint: 'one line, set three ways', tone: 'quiet' },
  { id: 'press', index: 'ii', label: 'the press bed', hint: 'pull a lever, take an impression', tone: 'human' },
  { id: 'notes', index: 'iii', label: 'the marginalia', hint: 'three things worth keeping', tone: 'quiet' },
  { id: 'pressings', index: 'iv', label: 'three pressings', hint: 'the same line, three faces', tone: 'bold' },
  { id: 'answer', index: 'v', label: 'the answer', hint: 'folded once, then folded back', tone: 'human' },
]

function PenIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M3 21l4-1 11-11-3-3L4 17l-1 4zM14.5 6.5l3 3"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function PocketArrow({ open }: { open: boolean }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={`pocket__arrow ${open ? 'is-open' : ''}`}>
      <path
        d="M4 12h15M13 6l6 6-6 6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function PocketFleur({ side }: { side: 'lead' | 'trail' }) {
  return (
    <svg viewBox="0 0 24 12" aria-hidden="true" className={`pocket__fleur pocket__fleur--${side}`}>
      <path
        d="M2 6h6m0 0L5 3m3 3l-3 3m14-3h6m-6 0l3-3m-3 3l3 3"
        fill="none"
        stroke="currentColor"
        strokeWidth=".85"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="6" r="1.4" fill="currentColor" />
    </svg>
  )
}

function PocketMark({ tone }: { tone: VoiceId }) {
  const color = tone === 'bold' ? 'var(--acid)' : tone === 'human' ? 'var(--coral)' : 'var(--blue)'
  return (
    <span className="pocket__folio-mark" aria-hidden="true">
      <svg viewBox="0 0 14 14">
        <circle cx="7" cy="7" r="6" fill="none" stroke="currentColor" strokeWidth=".7" style={{ color }} />
        <circle cx="7" cy="7" r="2.4" fill="currentColor" style={{ color }} />
      </svg>
    </span>
  )
}

export function ReadingPocket({
  voice,
  word,
  setToday,
  answerOpen,
  answerTriggerRef,
  onToggleAnswer,
}: ReadingPocketProps) {
  const activeNote = NOTES.find(item => item.id === word) ?? NOTES[0]

  const onAnswerKey = (event: ReactKeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onToggleAnswer()
    }
  }

  const style = { '--pocket-tone': 'var(--paper)' } as CSSProperties

  return (
    <aside className={`pocket pocket--voice-${voice} ${answerOpen ? 'is-answer-open' : ''}`} aria-label="Reading pocket" style={style}>
      <div className="pocket__plate">
        <span className="pocket__corner pocket__corner--tl" aria-hidden="true" />
        <span className="pocket__corner pocket__corner--tr" aria-hidden="true" />
        <span className="pocket__corner pocket__corner--bl" aria-hidden="true" />
        <span className="pocket__corner pocket__corner--br" aria-hidden="true" />

        <header className="pocket__head">
          <PocketFleur side="lead" />
          <span className="pocket__head-stack">
            <em className="pocket__head-eyebrow">the reading pocket</em>
            <span className="pocket__head-title">
              five folios <span aria-hidden="true">·</span> one question
            </span>
          </span>
          <PocketFleur side="trail" />
        </header>

        <ol className="pocket__list" aria-label="Folios in reading order">
          {POCKET_FOLIOS.map((folio, idx) => {
            const isLast = idx === POCKET_FOLIOS.length - 1
            return (
              <li key={folio.id} className={`pocket__item ${isLast ? 'is-last' : ''}`}>
                <a className="pocket__link" href={`#${folio.id}`}>
                  <PocketMark tone={folio.tone} />
                  <span className="pocket__link-num" aria-hidden="true">{folio.index}</span>
                  <span className="pocket__link-copy">
                    <span className="pocket__link-label">{folio.label}</span>
                    <span className="pocket__link-hint">{folio.hint}</span>
                  </span>
                  <span className="pocket__link-tick" aria-hidden="true" />
                </a>
              </li>
            )
          })}
        </ol>

        <span className="pocket__rule" aria-hidden="true">
          <svg viewBox="0 0 200 6" preserveAspectRatio="none">
            <path
              d="M2 3c12-2 24 2 36 0s24-2 36 0 24 2 36 0 24-2 36 0 24 2 36 0 12-2 16 0"
              fill="none"
              stroke="currentColor"
              strokeWidth=".6"
              strokeLinecap="round"
            />
            <circle cx="100" cy="3" r="1.4" fill="currentColor" />
          </svg>
        </span>

        <button
          ref={answerTriggerRef}
          type="button"
          className={`pocket__reveal ${answerOpen ? 'is-open' : ''}`}
          onClick={onToggleAnswer}
          onKeyDown={onAnswerKey}
          aria-expanded={answerOpen}
          aria-controls="answer"
        >
          <span className="pocket__reveal-stack">
            <span className="pocket__reveal-eyebrow">
              <span className="pocket__reveal-eyebrow-mark" aria-hidden="true" />
              <em>{answerOpen ? 'folded open · see how it lands' : 'unfold the answer, when ready'}</em>
            </span>
            <span className="pocket__reveal-line">
              <PenIcon />
              <em>{answerOpen ? 'fold it back into the page' : 'no commitment · the question stays open'}</em>
            </span>
          </span>
          <PocketArrow open={answerOpen} />
        </button>

        <footer className="pocket__foot" aria-hidden="true">
          <span className="pocket__foot-mark" />
          <em className="pocket__foot-line">
            set today <span aria-hidden="true">·</span> {setToday}
          </em>
          <span className="pocket__foot-mark pocket__foot-mark--alt" />
        </footer>
      </div>

      <span className="sr-only" aria-live="polite">
        {`Reading pocket · ${VOICE_META[voice].name} · marked at ${activeNote.label}, ${activeNote.title}.`}
      </span>
    </aside>
  )
}
