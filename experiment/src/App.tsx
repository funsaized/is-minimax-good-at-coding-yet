import { useEffect, useState } from 'react'

const TITLE = 'is Minimax M3 good at frontend yet?'
const ANSWER = '— and the page itself, which you are reading now.'
const REPLY = 'so read it once, then again — slower this time.'
const FOOTNOTE = 'relege · without a reader, silence'

type Phase = 'idle' | 'answering' | 'replying' | 'complete'

function useReducedMotion() {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(mediaQuery.matches)
    update()
    mediaQuery.addEventListener('change', update)
    return () => mediaQuery.removeEventListener('change', update)
  }, [])

  return reduced
}

function PrinterEmblem() {
  return (
    <svg className="printer-emblem" viewBox="0 0 160 160" aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id="emblem-wash" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ff755b" stopOpacity="0.1" />
          <stop offset="62%" stopColor="#ff755b" stopOpacity="0.02" />
          <stop offset="100%" stopColor="#ff755b" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="80" cy="80" r="74" fill="url(#emblem-wash)" />
      <g className="emblem-rings">
        <circle cx="80" cy="80" r="64" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.45" />
        <circle cx="80" cy="80" r="56" fill="none" stroke="currentColor" strokeWidth="0.4" strokeDasharray="1 5" opacity="0.5" />
        <circle cx="80" cy="80" r="44" fill="none" stroke="currentColor" strokeWidth="0.4" opacity="0.3" />
      </g>
      <g className="emblem-points" fill="currentColor" opacity="0.75">
        <path d="M 80 18 L 83 28 L 77 28 Z" />
        <path d="M 80 142 L 83 132 L 77 132 Z" />
        <path d="M 18 80 L 28 77 L 28 83 Z" />
        <path d="M 142 80 L 132 77 L 132 83 Z" />
      </g>
      <g className="emblem-ticks" stroke="currentColor" opacity="0.55" strokeWidth="0.9" strokeLinecap="round">
        <line x1="40" y1="40" x2="46" y2="46" />
        <line x1="120" y1="120" x2="114" y2="114" />
        <line x1="40" y1="120" x2="46" y2="114" />
        <line x1="120" y1="40" x2="114" y2="46" />
      </g>
      <text x="80" y="86" textAnchor="middle" className="emblem-question">?</text>
      <text x="80" y="105" textAnchor="middle" className="emblem-monogram">M · III</text>
      <text x="80" y="28" textAnchor="middle" className="emblem-rim">N E</text>
      <text x="80" y="140" textAnchor="middle" className="emblem-rim">— adytum —</text>
    </svg>
  )
}

export function App() {
  const reduced = useReducedMotion()
  const [phase, setPhase] = useState<Phase>('idle')
  const [slow, setSlow] = useState(false)
  const [answerChars, setAnswerChars] = useState(0)
  const [replyChars, setReplyChars] = useState(0)

  useEffect(() => {
    if (phase !== 'answering') return
    if (answerChars >= ANSWER.length) {
      const timer = window.setTimeout(
        () => setPhase('replying'),
        reduced ? 60 : slow ? 720 : 430,
      )
      return () => window.clearTimeout(timer)
    }
    if (reduced) {
      setAnswerChars(ANSWER.length)
      return
    }
    const timer = window.setTimeout(
      () => setAnswerChars((current) => Math.min(ANSWER.length, current + 1)),
      slow ? 82 : 38,
    )
    return () => window.clearTimeout(timer)
  }, [answerChars, phase, reduced, slow])

  useEffect(() => {
    if (phase !== 'replying') return
    if (replyChars >= REPLY.length) {
      const timer = window.setTimeout(() => setPhase('complete'), reduced ? 40 : 520)
      return () => window.clearTimeout(timer)
    }
    if (reduced) {
      setReplyChars(REPLY.length)
      return
    }
    const timer = window.setTimeout(
      () => setReplyChars((current) => Math.min(REPLY.length, current + 1)),
      slow ? 68 : 30,
    )
    return () => window.clearTimeout(timer)
  }, [phase, reduced, replyChars, slow])

  const readAnswer = () => {
    if (phase === 'complete') setSlow((current) => !current)
    setAnswerChars(0)
    setReplyChars(0)
    setPhase('answering')
  }

  const answerVisible = phase !== 'idle'
  const answerDisplay = ANSWER.slice(0, answerChars)
  const replyDisplay = REPLY.slice(0, replyChars)
  const isTyping = phase === 'answering' || phase === 'replying'

  const inkProgress =
    phase === 'idle'
      ? 0
      : phase === 'answering'
        ? answerChars / ANSWER.length
        : phase === 'replying'
          ? Math.min(1, (answerChars / ANSWER.length) + (replyChars / REPLY.length) * 0.45)
          : 1

  const strokeOffset = (1 - inkProgress).toFixed(3)

  const buttonLabel =
    phase === 'idle'
      ? 'read the answer'
      : phase === 'complete'
        ? slow
          ? 'read again · page pace'
          : 'read again · slower'
        : 'setting the answer…'

  const readerNote =
    phase === 'complete'
      ? 'The second reading changes the pace, not the answer.'
      : 'One press opens it. The next asks you to slow down.'

  return (
    <main className="experiment-shell">
      <div className="ambient-grid" aria-hidden="true" />
      <div className="ambient-glow ambient-glow--one" aria-hidden="true" />
      <div className="ambient-glow ambient-glow--two" aria-hidden="true" />

      <article className={`sheet ${phase !== 'idle' ? 'has-answer' : ''}`}>
        <header className="sheet-header">
          <p className="running-head-title">
            <span aria-hidden="true">§</span> an experiment in questioning
          </p>
          <span className="running-head-ornament" aria-hidden="true">
            <svg width="18" height="12" viewBox="0 0 18 12" focusable="false">
              <path d="M 9 1 L 10.2 5.4 L 14.6 5.4 L 10.9 8.1 L 12.1 12.5 L 9 9.8 L 5.9 12.5 L 7.1 8.1 L 3.4 5.4 L 7.8 5.4 Z" />
            </svg>
          </span>
          <p className="running-head-folio">folio <span>lxxvi</span></p>
        </header>

        <div className="sheet-content">
          <section className="question-panel" aria-labelledby="page-title">
            <div className="annotation annotation--top">
              <span className="annotation-mark" aria-hidden="true">¶</span>
              <span>the question</span>
            </div>
            <h1 id="page-title" aria-label={TITLE}>
              <span className="drop-cap" aria-hidden="true">i</span>
              <span className="title-text" aria-hidden="true">s </span>
              <span className="title-subject" aria-hidden="true">Minimax M3</span>
              <span className="title-text" aria-hidden="true"> good at frontend yet?</span>
            </h1>

            <p className="question-deck">
              A small typeset test of whether a page can ask well before it answers —
              set in italic display, with a coral pilrow and a quiet reply beneath.
            </p>

            <svg
              className={`ink-stroke ${isTyping || phase === 'complete' ? 'is-drawing' : ''}`}
              viewBox="0 0 320 12"
              preserveAspectRatio="none"
              aria-hidden="true"
              focusable="false"
            >
              <path
                className="ink-stroke-path"
                d="M 2 6 C 28 1, 56 11, 96 6 S 168 1, 220 8 S 282 3, 318 7"
                pathLength="1"
                strokeDasharray="1 1"
                strokeDashoffset={strokeOffset}
              />
            </svg>

            <div className="question-signature" aria-hidden="true">
              <span className="signature-line" />
              <span className="signature-text">follow the mark</span>
              <span className="signature-arrow">→</span>
            </div>
          </section>

          <section className="response-panel" aria-labelledby="response-title">
            <div className="response-heading">
              <span className="response-label" id="response-title">the reply</span>
              <span className="response-rule" aria-hidden="true" />
              <span className="response-arrow" aria-hidden="true">↘</span>
            </div>

            <div className={`answer-surface answer-surface--${phase}`}>
              <span className="answer-quote answer-quote--open" aria-hidden="true">“</span>
              {!answerVisible && (
                <p className="answer-placeholder">
                  press below
                  <br />
                  and let it arrive.
                </p>
              )}
              {answerVisible && (
                <p className="answer-copy" aria-live="polite">
                  {answerDisplay}
                  {phase === 'answering' && <span className="typing-caret" aria-hidden="true">|</span>}
                </p>
              )}
              <span className="answer-quote answer-quote--close" aria-hidden="true">”</span>
              <span className="answer-attribution" aria-hidden="true">— set in italic</span>
            </div>

            <div
              className={`reply-copy ${phase === 'replying' || phase === 'complete' ? 'is-visible' : ''}`}
              aria-live="polite"
            >
              {replyDisplay}
              {phase === 'replying' && <span className="typing-caret" aria-hidden="true">|</span>}
            </div>

            {phase === 'complete' && (
              <div className="completion-note">
                <span className="completion-dot" aria-hidden="true" />
                <span>{FOOTNOTE}</span>
                <span className="completion-dot" aria-hidden="true" />
              </div>
            )}

            <button
              className={`read-button${slow ? ' is-slow' : ''}`}
              type="button"
              onClick={readAnswer}
              aria-describedby="reader-note"
            >
              <span className="button-mark" aria-hidden="true">↗</span>
              <span className="button-label">{buttonLabel}</span>
              <span className="button-pace" aria-hidden="true">
                {slow ? '· slow' : '· fast'}
              </span>
            </button>
            <p className="reader-note" id="reader-note">{readerNote}</p>
          </section>
        </div>

        <footer className="sheet-footer">
          <span className="footer-rule" aria-hidden="true" />
          <p className="footer-line">the interface is part of the answer</p>
          <p className="footer-folio">
            <span aria-hidden="true">— </span>exper. lxxvi<span aria-hidden="true"> —</span>
          </p>
          <span className="footer-rule" aria-hidden="true" />
        </footer>

        <PrinterEmblem />
        <span className="paper-corner paper-corner--one" aria-hidden="true" />
        <span className="paper-corner paper-corner--two" aria-hidden="true" />
        <span className="paper-edge" aria-hidden="true" />
      </article>
    </main>
  )
}