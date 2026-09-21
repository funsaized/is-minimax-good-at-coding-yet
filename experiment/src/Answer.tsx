import { useEffect, useRef, type RefObject } from 'react'
import type { VoiceId } from './App'
import type { WordId } from './notes'

type AnswerProps = {
  open: boolean
  onToggle: () => void
  triggerRef: RefObject<HTMLButtonElement | null>
  voice: VoiceId
  word: WordId
  setToday: string
}

const VOICE_NAME: Record<VoiceId, string> = { quiet: 'quiet cut', human: 'human hand', bold: 'bold signal' }
const VOICE_LETTER: Record<VoiceId, string> = { quiet: 'A', human: 'B', bold: 'C' }
const WORD_LABEL: Record<WordId, string> = { m3: 'm³', good: 'good at', yet: 'yet?' }

export function Answer({ open, onToggle, triggerRef, voice, word, setToday }: AnswerProps) {
  const leafRef = useRef<HTMLDivElement | null>(null)
  const closeRef = useRef<HTMLButtonElement | null>(null)

  useEffect(() => {
    if (open && typeof window !== 'undefined') {
      window.requestAnimationFrame(() => {
        document.getElementById('answer')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      })
    }
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onToggle()
        window.requestAnimationFrame(() => triggerRef.current?.focus())
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onToggle, triggerRef])

  return (
    <section className="answer reveal" id="answer" aria-labelledby="answer-title">
      <header className="answer__head">
        <span className="eyebrow"><span className="eyebrow__line" />the answer, when ready</span>
        <h2 id="answer-title">
          Folded once, <em>then folded back.</em>
        </h2>
        <p className="section__lede">
          The page holds the question open until you ask for the answer. Press the seal to unfold.
        </p>
        <button
          ref={triggerRef}
          type="button"
          className={`answer__reveal ${open ? 'is-open' : ''}`}
          onClick={onToggle}
          aria-expanded={open}
          aria-controls="answer-leaf"
        >
          <svg className="answer__reveal-icon" viewBox="0 0 16 16" aria-hidden="true">
            <path d="M2 8h12M8 2v12" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
          {open ? 'fold it back' : 'unfold the answer'}
        </button>
      </header>

      <div
        id="answer-leaf"
        ref={leafRef}
        className={`answer__leaf ${open ? 'is-open' : ''}`}
        aria-hidden={!open}
      >
        <div className="answer__copy">
          <p className="answer__line">
            Yes — when it <em>stops trying to look impressive.</em>
          </p>
          <div className="answer__columns">
            <p>
              The good part is not the gradient, the flourish, or the clever little mechanism. It is
              the moment the page gives you room to notice <em>one thing</em>. Then another.
            </p>
            <p>
              So this is a qualified yes: good at front-end means attentive to the person on the other
              side of the glass. The rest is decoration with a job to do.
            </p>
          </div>
          <p className="answer__pull">
            <span className="answer__pull-rule" aria-hidden="true" />
            attention, not ornament
          </p>
        </div>

        <aside className="answer__aside">
          <PressSeal voice={voice} />
          <div className="answer__aside-cell">
            <span className="answer__aside-key">composed in</span>
            <span>{VOICE_LETTER[voice]} · {VOICE_NAME[voice]}</span>
          </div>
          <div className="answer__aside-cell">
            <span className="answer__aside-key">marked at</span>
            <span>{WORD_LABEL[word]}</span>
          </div>
          <div className="answer__aside-cell">
            <span className="answer__aside-key">set today</span>
            <span>{setToday}</span>
          </div>
          <button
            ref={closeRef}
            type="button"
            className="answer__reveal"
            onClick={onToggle}
            tabIndex={open ? 0 : -1}
            aria-label="Fold the answer back into the page"
          >
            <svg className="answer__reveal-icon" viewBox="0 0 16 16" aria-hidden="true">
              <path d="M2 8h12M8 2v12" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
            fold it back
          </button>
        </aside>
      </div>
    </section>
  )
}

function PressSeal({ voice }: { voice: VoiceId }) {
  const labels = {
    quiet: { top: 'PRESS · SET', bottom: 'FOLIO · TODAY' },
    human: { top: 'SET BY HAND', bottom: 'FOR NOW' },
    bold: { top: 'M³ · YES · M³', bottom: 'AGAIN' },
  }
  const tone = voice === 'quiet' ? 'var(--quiet)' : voice === 'human' ? 'var(--human)' : 'var(--bold)'
  const glyph = voice === 'bold' ? 'M³' : 'm³'
  const style = { color: tone } as React.CSSProperties
  const l = labels[voice]
  return (
    <svg className="answer__seal" viewBox="0 0 100 100" aria-hidden="true" style={style}>
      <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth=".9" />
      <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth=".35" strokeDasharray="1 2" opacity=".65" />
      <text x="50" y="20" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="5" letterSpacing="2" fill="currentColor">
        {l.top}
      </text>
      <text
        x="50"
        y="60"
        textAnchor="middle"
        fontFamily="Georgia, serif"
        fontStyle="italic"
        fontSize={voice === 'bold' ? 26 : 30}
        fontWeight="500"
        fill="currentColor"
      >
        {glyph}
      </text>
      <text x="50" y="86" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="5" letterSpacing="2" fill="currentColor">
        {l.bottom}
      </text>
    </svg>
  )
}
