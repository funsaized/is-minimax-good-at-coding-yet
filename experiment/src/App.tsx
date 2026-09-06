import { useEffect, useRef, useState } from 'react'

const TITLE = 'is Minimax M3 good at frontend yet?'
const ANSWER = '— and the page itself, which you are reading now.'
const REPLY = 'so read it once, then again — slower this time.'
const FOOTNOTE = 'relege · without a reader, silence'

type Phase = 'idle' | 'answering' | 'replying' | 'complete'

interface MarginaliaItem {
  mark: string
  note: string
}

const MARGINALIA: MarginaliaItem[] = [
  { mark: '¶', note: 'the question, plainly set' },
  { mark: '†', note: 'see folio lxxvii, rect.' },
  { mark: '‡', note: 'a self-answering page' },
]

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

function AsterismGlyph({ className }: { className?: string }) {
  return (
    <svg
      className={className ?? 'asterism-glyph'}
      viewBox="0 0 36 36"
      focusable="false"
      aria-hidden="true"
    >
      <g className="asterism-cluster">
        <g transform="translate(11 11)">
          <line x1="0" y1="-4.6" x2="0" y2="4.6" />
          <line x1="-4.6" y1="0" x2="4.6" y2="0" />
          <line x1="-3.3" y1="-3.3" x2="3.3" y2="3.3" />
          <line x1="3.3" y1="-3.3" x2="-3.3" y2="3.3" />
        </g>
        <g transform="translate(25 11)">
          <line x1="0" y1="-4.6" x2="0" y2="4.6" />
          <line x1="-4.6" y1="0" x2="4.6" y2="0" />
          <line x1="-3.3" y1="-3.3" x2="3.3" y2="3.3" />
          <line x1="3.3" y1="-3.3" x2="-3.3" y2="3.3" />
        </g>
        <g transform="translate(18 25)">
          <line x1="0" y1="-4.6" x2="0" y2="4.6" />
          <line x1="-4.6" y1="0" x2="4.6" y2="0" />
          <line x1="-3.3" y1="-3.3" x2="3.3" y2="3.3" />
          <line x1="3.3" y1="-3.3" x2="-3.3" y2="3.3" />
        </g>
      </g>
    </svg>
  )
}

function WaxSealInitial() {
  return (
    <span className="wax-seal" aria-hidden="true">
      <svg viewBox="0 0 100 100" focusable="false">
        <defs>
          <radialGradient id="wax-radial" cx="36%" cy="30%" r="72%">
            <stop offset="0%" stopColor="#ffb097" />
            <stop offset="22%" stopColor="#f37557" />
            <stop offset="58%" stopColor="#cf3b29" />
            <stop offset="100%" stopColor="#7d1c12" />
          </radialGradient>
          <radialGradient id="wax-shadow" cx="50%" cy="50%" r="50%">
            <stop offset="60%" stopColor="rgba(48, 10, 4, 0)" />
            <stop offset="100%" stopColor="rgba(48, 10, 4, 0.42)" />
          </radialGradient>
        </defs>
        <circle cx="50" cy="52" r="46" fill="url(#wax-shadow)" />
        <circle cx="50" cy="51" r="42" fill="url(#wax-radial)" />
        <circle
          cx="50"
          cy="51"
          r="36"
          fill="none"
          stroke="rgba(255, 245, 233, 0.55)"
          strokeWidth="0.45"
          strokeDasharray="0.9 2.4"
        />
        <ellipse
          cx="38"
          cy="34"
          rx="9"
          ry="5"
          fill="rgba(255, 245, 233, 0.22)"
          transform="rotate(-32 38 34)"
        />
        <text x="50" y="73" textAnchor="middle" className="wax-letter">
          i
        </text>
      </svg>
    </span>
  )
}

function ManuscriptStamp() {
  return (
    <div className="ms-stamp" aria-hidden="true">
      <span className="ms-stamp-row ms-stamp-row--top">M S · lxxvii</span>
      <span className="ms-stamp-rule" />
      <span className="ms-stamp-row ms-stamp-row--mid">FRONTEND</span>
      <span className="ms-stamp-rule ms-stamp-rule--short" />
      <span className="ms-stamp-row ms-stamp-row--bot">cap. xviii · rect.</span>
    </div>
  )
}

function Asterism({ label }: { label: string }) {
  return (
    <div className="asterism" role="separator" aria-hidden="true">
      <span className="asterism-line" />
      <AsterismGlyph />
      <span className="asterism-label">{label}</span>
      <AsterismGlyph />
      <span className="asterism-line" />
    </div>
  )
}

function QuillFlourish({
  drawing,
  progress,
}: {
  drawing: boolean
  progress: number
}) {
  const strokeOffset = (1 - progress).toFixed(3)
  return (
    <svg
      className={`quill-flourish ${drawing ? 'is-drawing' : ''}`}
      viewBox="0 0 320 30"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <circle className="quill-flourish-nib" cx="4" cy="22" r="1.8" />
      <path
        className="quill-flourish-path"
        d="M 5 22 C 22 8, 58 30, 98 16 S 172 4, 220 18 S 284 8, 302 4"
        pathLength="1"
        strokeDasharray="1 1"
        strokeDashoffset={strokeOffset}
      />
      <path
        className="quill-flourish-curl"
        d="M 302 4 C 314 0, 318 10, 310 13 C 304 16, 300 9, 306 5"
        pathLength="1"
        strokeDasharray="1 1"
        strokeDashoffset={strokeOffset}
      />
    </svg>
  )
}

function MarginaliaStrip({ items }: { items: MarginaliaItem[] }) {
  return (
    <aside className="marginalia-strip" aria-label="marginalia">
      {items.map((item, i) => (
        <span key={item.mark} className="marginalia-row">
          <span className={`marginalia-note marginalia-note--${i}`}>
            <span className="marginalia-mark">{item.mark}</span>
            <span className="marginalia-text">{item.note}</span>
          </span>
          {i < items.length - 1 && (
            <span className="marginalia-divider" aria-hidden="true">
              ·
            </span>
          )}
        </span>
      ))}
    </aside>
  )
}

function BookmarkRibbon() {
  return (
    <svg
      className="bookmark-ribbon"
      viewBox="0 0 32 400"
      preserveAspectRatio="none"
      focusable="false"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="ribbon-front" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#7a1a0e" />
          <stop offset="22%" stopColor="#b8301f" />
          <stop offset="50%" stopColor="#dc4a30" />
          <stop offset="78%" stopColor="#b8301f" />
          <stop offset="100%" stopColor="#7a1a0e" />
        </linearGradient>
        <linearGradient id="ribbon-fold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5a1408" />
          <stop offset="100%" stopColor="#7a1a0e" />
        </linearGradient>
      </defs>
      <path
        d="M 2 0 L 30 0 L 30 16 Q 28 19 26 17 L 16 23 L 6 17 Q 4 19 2 16 Z"
        fill="url(#ribbon-fold)"
      />
      <path
        d="M 2 16 L 30 16 L 30 360 L 16 388 L 2 360 Z"
        fill="url(#ribbon-front)"
      />
      <line
        x1="16"
        y1="18"
        x2="16"
        y2="358"
        stroke="rgba(50, 8, 4, 0.42)"
        strokeWidth="0.5"
      />
      <path
        d="M 7 18 Q 7 188 7 358"
        fill="none"
        stroke="rgba(255, 220, 200, 0.22)"
        strokeWidth="0.7"
      />
      <path
        d="M 25 18 Q 25 188 25 358"
        fill="none"
        stroke="rgba(40, 8, 4, 0.22)"
        strokeWidth="0.7"
      />
      <path
        d="M 12 22 Q 12 188 12 354"
        fill="none"
        stroke="rgba(255, 230, 210, 0.12)"
        strokeWidth="0.4"
      />
    </svg>
  )
}

function Catchword() {
  return (
    <div className="catchword" aria-hidden="true">
      <span className="catchword-rule" />
      <span className="catchword-text">reply</span>
      <span className="catchword-arrow">⤳</span>
    </div>
  )
}

function Manicule() {
  return (
    <svg
      className="manicule"
      viewBox="0 0 64 26"
      focusable="false"
      aria-hidden="true"
    >
      <g fill="currentColor">
        <path d="M 0 8 Q 2 5 4 8 L 6 7 Q 8 5 10 8 L 12 7 Q 14 5 16 8 L 18 10 L 18 16 L 16 18 L 12 21 Q 10 19 8 21 L 6 19 Q 4 21 2 18 L 0 20 Z" />
        <path d="M 18 10 Q 22 9 26 12 L 26 14 Q 22 17 18 16 Z" />
        <path d="M 26 12 L 60 12 Q 62 12 62 13 Q 62 14 60 14 L 26 14 Z" />
        <path
          d="M 3 11 L 15 12"
          stroke="rgba(255, 250, 240, 0.55)"
          strokeWidth="0.5"
          fill="none"
        />
        <path
          d="M 4 14 L 16 15"
          stroke="rgba(255, 250, 240, 0.42)"
          strokeWidth="0.5"
          fill="none"
        />
        <path
          d="M 3 17 L 15 18"
          stroke="rgba(255, 250, 240, 0.3)"
          strokeWidth="0.5"
          fill="none"
        />
      </g>
    </svg>
  )
}

function Colophon() {
  return (
    <div className="colophon" aria-hidden="true">
      <svg viewBox="0 0 22 22" focusable="false">
        <g fill="none" stroke="currentColor" strokeLinecap="round">
          <circle cx="11" cy="11" r="9" strokeWidth="0.5" opacity="0.55" />
          <circle cx="11" cy="11" r="6.5" strokeWidth="0.4" strokeDasharray="0.6 1.8" opacity="0.45" />
        </g>
        <g fill="currentColor">
          <path d="M 11 4.5 L 12 9 L 16.5 9 L 12.7 11.5 L 13.7 16 L 11 13.5 L 8.3 16 L 9.3 11.5 L 5.5 9 L 10 9 Z" opacity="0.88" />
        </g>
      </svg>
      <span className="colophon-text">m · iii</span>
    </div>
  )
}

export function App() {
  const reduced = useReducedMotion()
  const [phase, setPhase] = useState<Phase>('idle')
  const [slow, setSlow] = useState(false)
  const [answerChars, setAnswerChars] = useState(0)
  const [replyChars, setReplyChars] = useState(0)
  const [cycle, setCycle] = useState(0)
  const [sealPressing, setSealPressing] = useState(false)

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
    if (phase === 'complete') setCycle((c) => c + 1)
  }

  const sealTimerRef = useRef<number | null>(null)
  useEffect(() => {
    if (cycle === 0) return
    setSealPressing(true)
    if (sealTimerRef.current !== null) window.clearTimeout(sealTimerRef.current)
    sealTimerRef.current = window.setTimeout(() => setSealPressing(false), 720)
    return () => {
      if (sealTimerRef.current !== null) window.clearTimeout(sealTimerRef.current)
    }
  }, [cycle])

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
        <BookmarkRibbon />
        <span className="gilded-edge" aria-hidden="true" />

        <header className="sheet-header">
          <p className="running-head-title">
            <span aria-hidden="true">§</span> an experiment in questioning
          </p>
          <span className="running-head-ornament" aria-hidden="true">
            <svg width="18" height="12" viewBox="0 0 18 12" focusable="false">
              <path d="M 9 1 L 10.2 5.4 L 14.6 5.4 L 10.9 8.1 L 12.1 12.5 L 9 9.8 L 5.9 12.5 L 7.1 8.1 L 3.4 5.4 L 7.8 5.4 Z" />
            </svg>
          </span>
          <p className="running-head-folio">folio <span>lxxvii</span></p>
        </header>

        <div className="sheet-content">
          <section className="question-panel" aria-labelledby="page-title">
            <div className="annotation annotation--top">
              <span className="annotation-mark" aria-hidden="true">¶</span>
              <span>the question</span>
            </div>
            <h1 id="page-title" aria-label={TITLE}>
              <span className={`wax-seal-wrap${sealPressing ? ' is-pressing' : ''}`}>
                <WaxSealInitial />
              </span>
              <span className="title-text" aria-hidden="true">s </span>
              <span className="title-subject" aria-hidden="true">Minimax M3</span>
              <span className="title-text" aria-hidden="true"> good at frontend yet?</span>
            </h1>

            <MarginaliaStrip items={MARGINALIA} />

            <p className="question-deck">
              A small typeset test of whether a page can ask well before it answers —
              an initial in wax, three marginalia, and a quiet reply beneath.
            </p>

            <QuillFlourish drawing={isTyping || phase === 'complete'} progress={inkProgress} />

            <Asterism label="the reply follows" />

            <Catchword />
          </section>

          <section className="response-panel" aria-labelledby="response-title">
            <ManuscriptStamp />

            <div className="response-heading">
              <span className="response-label" id="response-title">the reply</span>
              <span className="response-rule" aria-hidden="true" />
              <span className="response-arrow" aria-hidden="true">↘</span>
            </div>

            <div className={`answer-surface answer-surface--${phase}`}>
              <span className="answer-corner answer-corner--tl" aria-hidden="true" />
              <span className="answer-corner answer-corner--tr" aria-hidden="true" />
              <span className="answer-corner answer-corner--bl" aria-hidden="true" />
              <span className="answer-corner answer-corner--br" aria-hidden="true" />
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
              {phase === 'complete' && <Manicule />}
              <span className="reply-text">{replyDisplay}</span>
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
            <span aria-hidden="true">— </span>exper. lxxvii<span aria-hidden="true"> —</span>
          </p>
          <Colophon />
        </footer>

        <span className="paper-corner paper-corner--one" aria-hidden="true" />
        <span className="paper-corner paper-corner--two" aria-hidden="true" />
      </article>
    </main>
  )
}