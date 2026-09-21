import { useEffect, useRef, type CSSProperties, type RefObject } from 'react'
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
          <span className="answer__reveal-mark" aria-hidden="true">
            <svg viewBox="0 0 16 16" width="14" height="14">
              <path d="M2 8h12M8 2v12" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
          </span>
          <span className="answer__reveal-text">{open ? 'fold it back' : 'unfold the answer'}</span>
          <span className="answer__reveal-key" aria-hidden="true">↵</span>
        </button>
      </header>

      <div
        id="answer-leaf"
        ref={leafRef}
        className={`answer__leaf ${open ? 'is-open' : ''}`}
        aria-hidden={!open}
      >
        <span className="answer__crease" aria-hidden="true">
          <svg viewBox="0 0 4 80" preserveAspectRatio="none">
            <path d="M2 0c-1.5 13 1.5 27 0 40s1.5 27 0 40" fill="none" stroke="currentColor" strokeWidth=".8" strokeLinecap="round" />
            <circle cx="2" cy="40" r="1.4" fill="currentColor" />
          </svg>
          <em>the crease</em>
        </span>

        <span className="answer__shadow" aria-hidden="true" />

        <div className="answer__copy">
          <p className="answer__line">
            <span className="answer__initial" aria-hidden="true">Y</span>
            <span className="answer__line-rest">
              es — when it <em>stops trying to look impressive.</em>
            </span>
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
            className="answer__reveal answer__reveal--mini"
            onClick={onToggle}
            tabIndex={open ? 0 : -1}
            aria-label="Fold the answer back into the page"
          >
            <span className="answer__reveal-mark" aria-hidden="true">
              <svg viewBox="0 0 16 16" width="12" height="12">
                <path d="M2 8h12M8 2v12" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
            </span>
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
  const style = { color: tone } as CSSProperties
  const l = labels[voice]
  const isBold = voice === 'bold'
  return (
    <svg className={`answer__seal answer__seal--${voice}`} viewBox="0 0 100 100" aria-hidden="true" style={style}>
      <defs>
        <radialGradient id={`seal-glow-${voice}`} cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.18" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="48" fill={`url(#seal-glow-${voice})`} />
      <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="1.1" />
      <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth=".4" strokeDasharray="1 2.5" opacity=".65" />
      <circle cx="50" cy="50" r="35" fill="none" stroke="currentColor" strokeWidth=".3" opacity=".35" />
      <circle cx="50" cy="50" r="28" fill="none" stroke="currentColor" strokeWidth=".25" opacity=".2" />
      <text x="50" y="20" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="5" letterSpacing="2" fill="currentColor">
        {l.top}
      </text>
      <text
        x="50"
        y="60"
        textAnchor="middle"
        fontFamily="Georgia, serif"
        fontStyle={isBold ? 'normal' : 'italic'}
        fontSize={isBold ? 28 : 32}
        fontWeight={isBold ? 800 : 500}
        fill="currentColor"
      >
        {glyph}
      </text>
      <text x="50" y="86" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="5" letterSpacing="2" fill="currentColor">
        {l.bottom}
      </text>
      <circle cx="50" cy="6" r="1.4" fill="currentColor" />
      <circle cx="50" cy="94" r="1.4" fill="currentColor" />
      <circle cx="6" cy="50" r="1.4" fill="currentColor" />
      <circle cx="94" cy="50" r="1.4" fill="currentColor" />
      <path d="M50 14 Q56 22 50 50 Q44 78 50 86" fill="none" stroke="currentColor" strokeWidth=".3" opacity=".25" />
      <path d="M50 14 Q44 22 50 50 Q56 78 50 86" fill="none" stroke="currentColor" strokeWidth=".3" opacity=".25" />
    </svg>
  )
}