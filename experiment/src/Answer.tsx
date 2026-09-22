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
          <WaxSeal voice={voice} broken={open} />
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

function WaxSeal({ voice, broken }: { voice: VoiceId; broken: boolean }) {
  const labels = {
    quiet: { top: 'PRESS · SET', bottom: 'FOLIO · TODAY' },
    human: { top: 'SET BY HAND', bottom: 'FOR NOW' },
    bold: { top: 'M³ · YES · M³', bottom: 'AGAIN' },
  }
  const tone = voice === 'quiet' ? 'var(--quiet)' : voice === 'human' ? 'var(--human)' : 'var(--bold)'
  const glyph = voice === 'bold' ? 'M³ · FOLIO V' : 'm³ · folio v'
  const style = { color: tone } as CSSProperties
  const l = labels[voice]

  const fillTone = voice === 'quiet'
    ? 'rgba(168, 197, 255, 0.55)'
    : voice === 'human'
      ? 'rgba(244, 132, 114, 0.6)'
      : 'rgba(205, 238, 106, 0.6)'

  const fillDeep = voice === 'quiet'
    ? 'rgba(120, 158, 240, 0.95)'
    : voice === 'human'
      ? 'rgba(216, 80, 64, 0.95)'
      : 'rgba(168, 214, 50, 0.95)'

  return (
    <div className={`answer__seal-wrap answer__seal-wrap--${voice} ${broken ? 'is-broken' : ''}`} aria-hidden="true">
      <span className="answer__seal-shadow" />
      <svg className="answer__seal-shadow-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
        <ellipse cx="50" cy="86" rx="34" ry="5" fill="currentColor" opacity=".25" />
      </svg>

      <svg className="answer__seal answer__seal--whole" viewBox="0 0 100 100" style={style}>
        <defs>
          <radialGradient id={`seal-fill-${voice}`} cx="42%" cy="38%" r="62%">
            <stop offset="0%" stopColor={fillTone} />
            <stop offset="60%" stopColor={fillDeep} />
            <stop offset="100%" stopColor="rgba(8, 10, 18, 0.85)" />
          </radialGradient>
          <radialGradient id={`seal-glow-${voice}`} cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.18" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="50" cy="50" r="48" fill={`url(#seal-glow-${voice})`} />
        <circle cx="50" cy="50" r="46" fill={`url(#seal-fill-${voice})`} stroke="currentColor" strokeWidth="1.2" strokeOpacity=".75" />
        <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth=".4" strokeDasharray="1 2.5" opacity=".55" />
        <circle cx="50" cy="50" r="35" fill="none" stroke="rgba(255, 255, 255, 0.4)" strokeWidth=".3" />
        <circle cx="50" cy="50" r="28" fill="none" stroke="rgba(255, 255, 255, 0.18)" strokeWidth=".25" />

        {/* the engraving — a small press-and-dawn emblem */}
        <g className="answer__seal-engraving">
          {/* the dawn orb */}
          <circle cx="50" cy="46" r="9" fill="rgba(8, 10, 18, 0.92)" />
          <circle cx="50" cy="46" r="9" fill="none" stroke="rgba(245, 238, 216, .35)" strokeWidth=".35" strokeDasharray=".6 1.4" />
          {/* the crescent — the bite out of the orb */}
          <circle cx="54" cy="44" r="8" fill={`url(#seal-fill-${voice})`} />
          {/* horizon line — the press bed */}
          <line x1="32" y1="56" x2="68" y2="56" stroke="rgba(8, 10, 18, 0.92)" strokeWidth=".7" strokeLinecap="round" />
          {/* the lever pin */}
          <circle cx="40" cy="56" r="1.2" fill="rgba(8, 10, 18, 0.92)" />
          <circle cx="60" cy="56" r="1.2" fill="rgba(8, 10, 18, 0.92)" />
          {/* a type-high tick rising above the orb */}
          <line x1="50" y1="32" x2="50" y2="38" stroke="rgba(8, 10, 18, 0.92)" strokeWidth=".45" strokeLinecap="round" />
        </g>

        <text x="50" y="20" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="5" letterSpacing="2" fill="rgba(8, 10, 18, 0.85)" opacity=".95">
          {l.top}
        </text>
        <text x="50" y="74" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="3.6" letterSpacing="1.4" fill="rgba(8, 10, 18, 0.85)" opacity=".95">
          {glyph}
        </text>
        <text x="50" y="84" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="5" letterSpacing="2" fill="rgba(8, 10, 18, 0.85)" opacity=".95">
          {l.bottom}
        </text>
        <circle cx="50" cy="6" r="1.4" fill="rgba(8, 10, 18, 0.85)" />
        <circle cx="50" cy="94" r="1.4" fill="rgba(8, 10, 18, 0.85)" />
        <circle cx="6" cy="50" r="1.4" fill="rgba(8, 10, 18, 0.85)" />
        <circle cx="94" cy="50" r="1.4" fill="rgba(8, 10, 18, 0.85)" />
        <path d="M28 22 Q36 28 32 36 Q26 46 32 56 Q40 66 36 78" fill="none" stroke="rgba(8, 10, 18, 0.18)" strokeWidth=".55" />
        <path d="M72 22 Q64 28 68 36 Q74 46 68 56 Q60 66 64 78" fill="none" stroke="rgba(8, 10, 18, 0.18)" strokeWidth=".55" />
      </svg>

      <svg className="answer__seal answer__seal--cracked" viewBox="0 0 100 100" style={style}>
        <g className="answer__seal-piece answer__seal-piece--top">
          <defs>
            <radialGradient id={`seal-fill-top-${voice}`} cx="50%" cy="20%" r="80%">
              <stop offset="0%" stopColor={fillTone} />
              <stop offset="100%" stopColor={fillDeep} />
            </radialGradient>
          </defs>
          <path
            d="M50 50 L50 4 A46 46 0 0 1 89.84 73 Z"
            fill={`url(#seal-fill-top-${voice})`}
            stroke="currentColor"
            strokeWidth="1"
            strokeOpacity=".6"
            strokeLinejoin="round"
          />
          <path d="M50 50 L50 4" fill="none" stroke="rgba(8, 10, 18, 0.45)" strokeWidth=".7" strokeDasharray="1 1.5" />
        </g>
        <g className="answer__seal-piece answer__seal-piece--right">
          <defs>
            <radialGradient id={`seal-fill-right-${voice}`} cx="65%" cy="55%" r="80%">
              <stop offset="0%" stopColor={fillTone} />
              <stop offset="100%" stopColor={fillDeep} />
            </radialGradient>
          </defs>
          <path
            d="M50 50 L89.84 73 A46 46 0 0 1 10.16 73 Z"
            fill={`url(#seal-fill-right-${voice})`}
            stroke="currentColor"
            strokeWidth="1"
            strokeOpacity=".6"
            strokeLinejoin="round"
          />
          <path d="M50 50 L89.84 73" fill="none" stroke="rgba(8, 10, 18, 0.45)" strokeWidth=".7" strokeDasharray="1 1.5" />
        </g>
        <g className="answer__seal-piece answer__seal-piece--left">
          <defs>
            <radialGradient id={`seal-fill-left-${voice}`} cx="35%" cy="55%" r="80%">
              <stop offset="0%" stopColor={fillTone} />
              <stop offset="100%" stopColor={fillDeep} />
            </radialGradient>
          </defs>
          <path
            d="M50 50 L10.16 73 A46 46 0 0 1 50 4 Z"
            fill={`url(#seal-fill-left-${voice})`}
            stroke="currentColor"
            strokeWidth="1"
            strokeOpacity=".6"
            strokeLinejoin="round"
          />
          <path d="M50 50 L10.16 73" fill="none" stroke="rgba(8, 10, 18, 0.45)" strokeWidth=".7" strokeDasharray="1 1.5" />
        </g>
      </svg>

      <span className="answer__seal-cracks" aria-hidden="true">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M48 4 L52 24 L46 40 L54 56 L48 72 L52 92" fill="none" stroke="rgba(8, 10, 18, 0.55)" strokeWidth=".7" strokeLinecap="round" />
        </svg>
      </span>
    </div>
  )
}