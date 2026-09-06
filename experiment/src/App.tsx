import { useEffect, useRef, useState } from 'react'

const TITLE = 'is Minimax M3 good at frontend yet?'
const ANSWER = '— and the page itself, which you are reading now.'
const REPLY = 'so read it once, then again — slower this time.'
const FOOTNOTE = 'relege · without a reader, silence'

type Phase = 'idle' | 'answering' | 'replying' | 'complete'

interface MarginaliaItem {
  mark: string
  note: string
  gloss: string
}

const MARGINALIA: MarginaliaItem[] = [
  { mark: '¶', note: 'the question, plainly set', gloss: 'set plain as the day it was asked' },
  { mark: '†', note: 'see folio lxxvii, rect.', gloss: 'the same folio, turned to face you' },
  { mark: '‡', note: 'a self-answering page', gloss: 'a page that names itself in the act' },
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

function PrintedInitial({ letter }: { letter: string }) {
  return (
    <span className="printed-initial" aria-hidden="true">
      <svg viewBox="0 0 60 60" focusable="false">
        <defs>
          <pattern id="initial-hatch" width="3" height="3" patternUnits="userSpaceOnUse" patternTransform="rotate(38)">
            <line x1="0" y1="0" x2="0" y2="3" stroke="currentColor" strokeWidth="0.6" />
          </pattern>
        </defs>
        <rect
          x="2"
          y="2"
          width="56"
          height="56"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          rx="2"
        />
        <rect
          x="5"
          y="5"
          width="50"
          height="50"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.5"
          strokeDasharray="1.2 1.6"
          opacity="0.7"
        />
        <text x="30" y="44" textAnchor="middle" className="printed-initial-letter">
          {letter}
        </text>
        <line x1="6" y1="55" x2="54" y2="55" stroke="currentColor" strokeWidth="0.4" opacity="0.45" />
        <line x1="6" y1="5" x2="54" y2="5" stroke="currentColor" strokeWidth="0.4" opacity="0.45" />
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
      <span className="ms-stamp-row ms-stamp-row--bot">cap. xviii · vers.</span>
    </div>
  )
}

function Headpiece() {
  return (
    <svg
      className="headpiece"
      viewBox="0 0 260 24"
      focusable="false"
      aria-hidden="true"
    >
      <g className="headpiece-rules">
        <line x1="0" y1="12" x2="78" y2="12" />
        <path d="M 78 12 C 88 5, 98 19, 108 12" fill="none" />
        <path d="M 182 12 C 172 5, 162 19, 152 12" fill="none" />
        <line x1="182" y1="12" x2="260" y2="12" />
      </g>
      <g className="headpiece-cluster">
        <circle cx="118" cy="12" r="1.1" />
        <path d="M 130 12 L 135 6 L 140 12 L 135 18 Z" />
        <circle cx="130" cy="12" r="1.2" fill="var(--paper)" />
        <circle cx="150" cy="12" r="1.1" />
      </g>
    </svg>
  )
}

function ChapterHead() {
  return (
    <div className="chapter-head" aria-hidden="true">
      <span className="chapter-mark">
        <span className="chapter-prefix">Caput</span>
        <span className="chapter-numeral">XVIII</span>
      </span>
      <Headpiece />
      <span className="chapter-subtitle">of folio lxxvii, set in question</span>
    </div>
  )
}

function LeafCluster({
  className,
  label,
}: {
  className?: string
  label?: string
}) {
  return (
    <div
      className={`leaf-cluster ${className ?? ''}`}
      role={label ? 'separator' : undefined}
      aria-hidden="true"
    >
      <span className="leaf-cluster-stem leaf-cluster-stem--left" />
      <svg className="leaf-cluster-glyph" viewBox="0 0 132 36" focusable="false">
        <g className="leaf-cluster-leaves">
          <path d="M 18 18 Q 28 6 38 14 Q 30 22 18 18 Z" />
          <path d="M 38 14 Q 46 4 58 12 Q 50 24 38 14 Z" />
          <path d="M 22 22 Q 30 32 42 26 Q 32 18 22 22 Z" />
          <path d="M 42 26 Q 52 32 60 22 Q 52 18 42 26 Z" />
          <circle cx="66" cy="18" r="1.6" />
          <path d="M 114 18 Q 104 6 94 14 Q 102 22 114 18 Z" />
          <path d="M 94 14 Q 86 4 74 12 Q 82 24 94 14 Z" />
          <path d="M 110 22 Q 102 32 90 26 Q 100 18 110 22 Z" />
          <path d="M 90 26 Q 80 32 72 22 Q 80 18 90 26 Z" />
          <line x1="42" y1="26" x2="56" y2="22" stroke="currentColor" strokeWidth="0.35" />
          <line x1="90" y1="26" x2="76" y2="22" stroke="currentColor" strokeWidth="0.35" />
        </g>
        <line x1="60" y1="18" x2="72" y2="18" stroke="currentColor" strokeWidth="0.5" />
      </svg>
      {label && <span className="leaf-cluster-label">{label}</span>}
      <span className="leaf-cluster-stem leaf-cluster-stem--right" />
    </div>
  )
}

function MarginaliaStrip({ items }: { items: MarginaliaItem[] }) {
  return (
    <aside className="marginalia-strip" aria-label="marginalia">
      {items.map((item, i) => (
        <span key={item.mark} className="marginalia-row">
          <span
            className={`marginalia-note marginalia-note--${i}`}
            data-gloss={item.gloss}
            tabIndex={0}
          >
            <span className="marginalia-mark" aria-hidden="true">{item.mark}</span>
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
      <g transform="translate(16 200) rotate(-90)" opacity="0.55">
        <text
          x="0"
          y="0"
          textAnchor="middle"
          fontFamily="serif"
          fontStyle="italic"
          fontSize="6"
          fill="rgba(255, 220, 200, 0.7)"
        >
          m · iii
        </text>
      </g>
    </svg>
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

function PrinterDevice() {
  return (
    <div className="printer-device" aria-hidden="true">
      <svg viewBox="0 0 60 60" focusable="false">
        <circle className="device-frame" cx="30" cy="30" r="27" fill="none" />
        <circle
          className="device-frame-inner"
          cx="30"
          cy="30"
          r="22.5"
          fill="none"
        />
        <g className="device-laurel">
          <ellipse
            cx="20"
            cy="13"
            rx="3.6"
            ry="1.4"
            transform="rotate(-32 20 13)"
          />
          <ellipse cx="30" cy="9" rx="4" ry="1.4" />
          <ellipse
            cx="40"
            cy="13"
            rx="3.6"
            ry="1.4"
            transform="rotate(32 40 13)"
          />
          <ellipse
            cx="24"
            cy="18"
            rx="2.6"
            ry="1.2"
            transform="rotate(-18 24 18)"
          />
          <ellipse
            cx="36"
            cy="18"
            rx="2.6"
            ry="1.2"
            transform="rotate(18 36 18)"
          />
          <ellipse
            cx="9"
            cy="30"
            rx="1.4"
            ry="3.6"
            transform="rotate(58 9 30)"
          />
          <ellipse
            cx="11"
            cy="22"
            rx="1.2"
            ry="3"
            transform="rotate(80 11 22)"
          />
          <ellipse
            cx="11"
            cy="38"
            rx="1.2"
            ry="3"
            transform="rotate(38 11 38)"
          />
          <ellipse
            cx="51"
            cy="30"
            rx="1.4"
            ry="3.6"
            transform="rotate(-58 51 30)"
          />
          <ellipse
            cx="49"
            cy="22"
            rx="1.2"
            ry="3"
            transform="rotate(-80 49 22)"
          />
          <ellipse
            cx="49"
            cy="38"
            rx="1.2"
            ry="3"
            transform="rotate(-38 49 38)"
          />
          <ellipse
            cx="22"
            cy="46"
            rx="2.6"
            ry="1.2"
            transform="rotate(-50 22 46)"
          />
          <ellipse
            cx="38"
            cy="46"
            rx="2.6"
            ry="1.2"
            transform="rotate(50 38 46)"
          />
        </g>
        <g className="device-star">
          <path d="M 30 20 L 32 26 L 38.5 26 L 33 30 L 35.2 36.5 L 30 32.7 L 24.8 36.5 L 27 30 L 21.5 26 L 28 26 Z" />
        </g>
        <g className="device-ribbon">
          <path d="M 14 49 Q 30 53.5 46 49 L 43.5 52 Q 30 55.5 16.5 52 Z" />
          <path d="M 11 47.5 L 14 49 L 14.5 52.5 L 11.2 51 Z" />
          <path d="M 49 47.5 L 46 49 L 45.5 52.5 L 48.8 51 Z" />
        </g>
      </svg>
      <span className="printer-device-text">m · iii</span>
    </div>
  )
}

function SignatureMark({ sig, side }: { sig: string; side: 'r' | 'v' }) {
  return (
    <span className="signature-mark" aria-hidden="true">
      <em className="sig-prefix">sig.</em>
      <span className="sig-letter">{sig}</span>
      <sup className="sig-side">{side}</sup>
    </span>
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
  const replyShown = phase === 'replying' || phase === 'complete'

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

        <span className="sheet-watermark" aria-hidden="true">
          <PrinterDevice />
        </span>

        <header className="sheet-header sheet-header--recto">
          <p className="running-head-title">
            <span aria-hidden="true">§</span> cap. xviii · an experiment in questioning
          </p>
          <span className="running-head-pilcrow" aria-hidden="true">¶</span>
          <p className="running-head-folio">
            recto · <span>sig. A2</span>
          </p>
        </header>

        <div className="chapter-opener">
          <ChapterHead />
        </div>

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
              an initial in wax, three marginalia, and a quiet reply that turns the leaf.
            </p>

            <LeafCluster
              className={`leaf-cluster--turn ${isTyping || phase === 'complete' ? 'is-sealed' : ''}`}
              label="turn the leaf"
            />

            <p className="catchword">
              <span className="catchword-rule" aria-hidden="true" />
              <span className="catchword-text">verso · reply</span>
              <span className="catchword-arrow" aria-hidden="true">↘</span>
            </p>
          </section>

          <section
            className={`response-panel response-panel--verso ${replyShown ? 'is-revealed' : ''}`}
            aria-labelledby="response-title"
          >
            <header className="sheet-header sheet-header--verso">
              <p className="running-head-title">
                <span aria-hidden="true">§</span> the reply · set in italic
              </p>
              <span className="running-head-pilcrow" aria-hidden="true">¶</span>
              <p className="running-head-folio">
                verso · <span>sig. A3</span>
              </p>
            </header>

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
              className={`reply-copy ${replyShown ? 'is-visible' : ''}`}
              aria-live="polite"
            >
              <span className="reply-paragraph">
                {replyChars > 0 && (
                  <span className="reply-initial" aria-hidden="true">
                    <PrintedInitial letter={REPLY.charAt(0)} />
                  </span>
                )}
                <span className="reply-text">{replyDisplay}</span>
                {phase === 'replying' && <span className="typing-caret" aria-hidden="true">|</span>}
              </span>
              {phase === 'complete' && (
                <span className="reply-manicule">
                  <Manicule />
                </span>
              )}
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
          <SignatureMark sig="A3" side="v" />
          <PrinterDevice />
        </footer>

        <span className="paper-corner paper-corner--one" aria-hidden="true" />
        <span className="paper-corner paper-corner--two" aria-hidden="true" />
      </article>
    </main>
  )
}
