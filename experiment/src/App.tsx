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

function QuestionOrbit() {
  return (
    <div className="question-orbit" aria-hidden="true">
      <svg viewBox="0 0 520 520" focusable="false">
        <defs>
          <radialGradient id="orbit-wash" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ff755b" stopOpacity="0.16" />
            <stop offset="62%" stopColor="#ff755b" stopOpacity="0.04" />
            <stop offset="100%" stopColor="#ff755b" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="question-ink" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ff8369" />
            <stop offset="52%" stopColor="#ef6047" />
            <stop offset="100%" stopColor="#b73545" />
          </linearGradient>
        </defs>
        <circle className="orbit-wash" cx="260" cy="260" r="214" fill="url(#orbit-wash)" />
        <g className="orbit-track">
          <ellipse cx="260" cy="260" rx="212" ry="112" />
          <ellipse cx="260" cy="260" rx="212" ry="112" transform="rotate(62 260 260)" />
          <ellipse cx="260" cy="260" rx="212" ry="112" transform="rotate(-62 260 260)" />
        </g>
        <g className="orbit-dots">
          <circle cx="84" cy="266" r="5" />
          <circle cx="393" cy="91" r="4" />
          <circle cx="430" cy="369" r="7" />
          <circle cx="183" cy="461" r="3" />
        </g>
        <g className="question-ink">
          <path d="M 205 180 C 197 104 286 76 337 120 C 390 166 367 232 322 255 C 283 275 271 299 272 335" fill="none" stroke="url(#question-ink)" strokeWidth="25" strokeLinecap="round" />
          <path d="M 218 176 C 213 120 283 98 324 131" fill="none" stroke="#ffb09a" strokeOpacity="0.78" strokeWidth="4" strokeLinecap="round" />
          <circle cx="272" cy="398" r="17" fill="#ef6047" />
          <circle cx="268" cy="394" r="4" fill="#ffd9c9" fillOpacity="0.72" />
        </g>
        <path className="orbit-pencil-line" d="M 111 372 C 159 420 217 441 278 441 C 347 441 405 413 431 363" />
        <text className="orbit-caption" x="260" y="262" textAnchor="middle">ASK / LOOK / READ</text>
      </svg>
    </div>
  )
}

function CornerGlyph() {
  return (
    <svg className="corner-glyph" viewBox="0 0 48 48" aria-hidden="true" focusable="false">
      <path d="M 24 5 L 27 20 L 43 24 L 27 28 L 24 43 L 21 28 L 5 24 L 21 20 Z" />
      <circle cx="24" cy="24" r="3" />
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
  const buttonLabel = phase === 'idle'
    ? 'read the answer'
    : phase === 'complete'
      ? slow ? 'read again · page pace' : 'read again · slower'
      : 'setting the answer…'
  const readerNote = phase === 'complete'
    ? 'The second reading changes the pace, not the answer.'
    : 'One press opens it. The next asks you to slow down.'

  return (
    <main className="experiment-shell">
      <div className="ambient-grid" aria-hidden="true" />
      <div className="ambient-glow ambient-glow--one" aria-hidden="true" />
      <div className="ambient-glow ambient-glow--two" aria-hidden="true" />

      <article className={`sheet ${phase !== 'idle' ? 'has-answer' : ''}`}>
        <header className="sheet-header">
          <p className="eyebrow"><span className="eyebrow-mark" aria-hidden="true" />a frontend question</p>
          <p className="header-note">question / answer / repeat</p>
          <CornerGlyph />
        </header>

        <div className="sheet-content">
          <section className="question-panel" aria-labelledby="page-title">
            <div className="annotation annotation--top"><span />written to be looked at</div>
            <h1 id="page-title" aria-label={TITLE}>
              <span>is </span>
              <span className="title-subject">Minimax M3</span>
              <span> good at frontend yet?</span>
            </h1>
            <p className="question-deck">A small test of whether a page can ask well before it answers.</p>
            <div className="question-signature" aria-hidden="true">
              <span className="signature-line" />
              <span className="signature-text">follow the mark</span>
            </div>
          </section>

          <section className="response-panel" aria-labelledby="response-title">
            <div className="response-heading">
              <span className="response-label" id="response-title">the reply</span>
              <span className="response-rule" aria-hidden="true" />
              <span className="response-arrow" aria-hidden="true">↘</span>
            </div>

            <div className={`answer-surface answer-surface--${phase}`}>
              <span className="answer-bracket" aria-hidden="true">[</span>
              {!answerVisible && (
                <p className="answer-placeholder">press below<br />and let it arrive.</p>
              )}
              {answerVisible && (
                <p className="answer-copy" aria-live="polite">
                  {answerDisplay}
                  {phase === 'answering' && <span className="typing-caret" aria-hidden="true">|</span>}
                </p>
              )}
              <span className="answer-bracket answer-bracket--right" aria-hidden="true">]</span>
            </div>

            <div className={`reply-copy ${phase === 'replying' || phase === 'complete' ? 'is-visible' : ''}`} aria-live="polite">
              {replyDisplay}
              {phase === 'replying' && <span className="typing-caret" aria-hidden="true">|</span>}
            </div>

            {phase === 'complete' && (
              <div className="completion-note">
                <span className="completion-dot" aria-hidden="true" />
                <span>{FOOTNOTE}</span>
              </div>
            )}

            <button className={`read-button${slow ? ' is-slow' : ''}`} type="button" onClick={readAnswer} aria-describedby="reader-note">
              <span className="button-mark" aria-hidden="true">↗</span>
              <span>{buttonLabel}</span>
            </button>
            <p className="reader-note" id="reader-note">{readerNote}</p>
          </section>
        </div>

        <footer className="sheet-footer">
          <span className="footer-rule" aria-hidden="true" />
          <p>the interface is part of the answer</p>
          <span className="footer-rule" aria-hidden="true" />
        </footer>

        <QuestionOrbit />
        <span className="paper-corner paper-corner--one" aria-hidden="true" />
        <span className="paper-corner paper-corner--two" aria-hidden="true" />
        <span className="paper-edge" aria-hidden="true" />
        <span className={`motion-trace ${isTyping ? 'is-active' : ''}`} aria-hidden="true" />
      </article>
    </main>
  )
}
