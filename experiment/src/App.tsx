import { useEffect, useId, useState } from 'react'

const TITLE = 'is Minimax M3 good at frontend yet?'

type Note = {
  label: string
  title: string
  body: string
  glyph: 'stroke' | 'sprig' | 'needle'
  gloss: string
}

const NOTES: Note[] = [
  {
    label: '01',
    title: 'Make a choice',
    body: 'A point of view is more useful than a cloud of possibilities. The page stops hedging once a choice is on it — even a small one.',
    glyph: 'stroke',
    gloss: 'on choosing',
  },
  {
    label: '02',
    title: 'Leave a trace',
    body: 'The little decisions — a pause, a border, a strange detail — are the work. They are what the reader remembers without knowing why.',
    glyph: 'sprig',
    gloss: 'on detail',
  },
  {
    label: '03',
    title: 'Let it breathe',
    body: 'Good interfaces do not fill every quiet space. The empty half of the canvas is doing as much as the full half.',
    glyph: 'needle',
    gloss: 'on restraint',
  },
]

function Mark() {
  return (
    <svg className="mark" viewBox="0 0 64 64" aria-hidden="true">
      <circle cx="32" cy="32" r="28" />
      <path d="M32 10v44M10 32h44" />
      <circle cx="32" cy="32" r="13" />
      <circle cx="32" cy="32" r="2.6" fill="currentColor" />
    </svg>
  )
}

function GlyphStroke() {
  return (
    <svg className="glyph" viewBox="0 0 64 64" aria-hidden="true">
      <path d="M8 50 C 18 16, 30 12, 38 24 S 56 48, 56 22" />
      <circle cx="56" cy="22" r="3" fill="currentColor" />
      <path d="M10 56h44" />
    </svg>
  )
}

function GlyphSprig() {
  return (
    <svg className="glyph" viewBox="0 0 64 64" aria-hidden="true">
      <path d="M32 56 V 20" />
      <path d="M32 30 C 22 28, 16 20, 22 10 C 30 14, 33 22, 32 30 Z" />
      <path d="M32 40 C 44 38, 50 28, 44 18 C 36 22, 32 30, 32 40 Z" />
      <circle cx="32" cy="18" r="2.2" fill="currentColor" />
    </svg>
  )
}

function GlyphNeedle() {
  return (
    <svg className="glyph" viewBox="0 0 64 64" aria-hidden="true">
      <circle cx="32" cy="32" r="22" />
      <path d="M32 14 L 36 32 L 32 50 L 28 32 Z" fill="currentColor" />
      <path d="M14 32 H 50" />
      <circle cx="32" cy="32" r="2" fill="var(--paper)" />
    </svg>
  )
}

function Glyph({ name }: { name: Note['glyph'] }) {
  if (name === 'sprig') return <GlyphSprig />
  if (name === 'needle') return <GlyphNeedle />
  return <GlyphStroke />
}

/* Broadside headmark — a composed type impression, set in concentric rules.
   Replaces the auto-spinning press disc with a still, authored mark that
   responds only to attention. */
function Headmark() {
  return (
    <svg className="headmark" viewBox="0 0 220 220" aria-hidden="true">
      <defs>
        <path
          id="headmark-arc-outer"
          d="M 110 110 m -100 0 a 100 100 0 1 1 200 0 a 100 100 0 1 1 -200 0"
        />
        <path
          id="headmark-arc-inner"
          d="M 110 110 m -78 0 a 78 78 0 1 1 156 0 a 78 78 0 1 1 -156 0"
        />
      </defs>
      <circle cx="110" cy="110" r="106" />
      <circle cx="110" cy="110" r="102" />
      <circle cx="110" cy="110" r="68" />
      <circle cx="110" cy="110" r="64" />
      <text className="headmark__arc">
        <textPath href="#headmark-arc-outer" startOffset="0">
          a proof · a press · a proof · a press ·
        </textPath>
      </text>
      <text className="headmark__arc headmark__arc--inner">
        <textPath href="#headmark-arc-inner" startOffset="0">
          composed for the slow reader · composed for the slow reader ·
        </textPath>
      </text>
      <g className="headmark__ticks">
        <line x1="110" y1="10" x2="110" y2="20" />
        <line x1="110" y1="200" x2="110" y2="210" />
        <line x1="10" y1="110" x2="20" y2="110" />
        <line x1="200" y1="110" x2="210" y2="110" />
        <line x1="43" y1="43" x2="50" y2="50" />
        <line x1="177" y1="43" x2="170" y2="50" />
        <line x1="43" y1="177" x2="50" y2="170" />
        <line x1="177" y1="177" x2="170" y2="170" />
      </g>
      <g className="headmark__core">
        <text x="110" y="100" textAnchor="middle" className="headmark__q">Q</text>
        <line x1="92" y1="110" x2="128" y2="110" />
        <text x="110" y="135" textAnchor="middle" className="headmark__a">A</text>
        <text x="110" y="156" textAnchor="middle" className="headmark__note">in good faith</text>
      </g>
    </svg>
  )
}

function Seal() {
  return (
    <svg className="seal" viewBox="0 0 140 140" aria-hidden="true">
      <defs>
        <path id="seal-arc" d="M 70 70 m -52 0 a 52 52 0 1 1 104 0 a 52 52 0 1 1 -104 0" />
      </defs>
      <circle cx="70" cy="70" r="66" />
      <circle cx="70" cy="70" r="58" />
      <circle cx="70" cy="70" r="44" />
      <text className="seal__ring">
        <textPath href="#seal-arc" startOffset="2%">
          proofed · for the reader · proofed · for the reader ·
        </textPath>
      </text>
      <text x="70" y="68" textAnchor="middle" className="seal__main">PROOFED</text>
      <line x1="46" y1="80" x2="94" y2="80" />
      <text x="70" y="93" textAnchor="middle" className="seal__sub">in good faith</text>
      <path d="M70 30 l2 5 5 1 -4 4 1 5 -4 -3 -4 3 1 -5 -4 -4 5 -1 z" />
    </svg>
  )
}

function Ornament() {
  return (
    <svg className="ornament" viewBox="0 0 80 12" aria-hidden="true">
      <line x1="0" y1="6" x2="30" y2="6" />
      <circle cx="40" cy="6" r="2.2" />
      <path d="M40 6 l5 -4 M40 6 l5 4 M40 6 l-5 -4 M40 6 l-5 4" />
      <circle cx="40" cy="6" r="2.2" />
      <line x1="50" y1="6" x2="80" y2="6" />
    </svg>
  )
}

/* Marginalia — handwritten-feel margin notes, set in italic display type. */
function Marginalia({
  children,
  side,
}: {
  children: React.ReactNode
  side: 'left' | 'right'
}) {
  return (
    <span className={`marginalia marginalia--${side}`} aria-hidden="true">
      {children}
    </span>
  )
}

/* Colophon — the publication imprint, set as a closing composition. */
function Colophon() {
  return (
    <aside className="colophon" aria-label="Colophon">
      <div className="colophon__head">
        <span className="colophon__kicker">colophon</span>
        <Ornament />
      </div>
      <dl className="colophon__list">
        <div className="colophon__row">
          <dt>set in</dt>
          <dd>Georgia, italic where the hand wants it.</dd>
        </div>
        <div className="colophon__row">
          <dt>printed on</dt>
          <dd>paper the color of a quiet afternoon.</dd>
        </div>
        <div className="colophon__row">
          <dt>made for</dt>
          <dd>a reader who is still here.</dd>
        </div>
      </dl>
      <span className="colophon__signoff">— m3, signed in the margin</span>
    </aside>
  )
}

export function App() {
  const [revealed, setRevealed] = useState(false)
  const [focusMode, setFocusMode] = useState(false)
  const [openNote, setOpenNote] = useState<number | null>(0)
  const answerId = useId()

  useEffect(() => {
    if (!revealed) setOpenNote(0)
  }, [revealed])

  return (
    <main className={`studio ${focusMode ? 'studio--focus' : ''} ${revealed ? 'studio--proved' : ''}`}>
      <div className="grain" aria-hidden="true" />
      <div className="trim" aria-hidden="true" />

      <header className="topbar">
        <a className="wordmark" href="#question" aria-label="Return to the question">
          <Mark />
          <span className="wordmark__lines">
            <span>an ongoing</span>
            <b>frontend experiment</b>
          </span>
        </a>
        <nav className="topnav" aria-label="Sections">
          <a href="#question">the question</a>
          <a href="#answer">the answer</a>
          <a href="#notes">the notes</a>
        </nav>
        <div className="topbar__right">
          <span className="topbar__date">a page in progress</span>
          <button
            className="focus-toggle"
            type="button"
            onClick={() => setFocusMode((m) => !m)}
            aria-pressed={focusMode}
          >
            <span className="focus-toggle__dot" />
            {focusMode ? 'exit focus' : 'focus mode'}
          </button>
        </div>
      </header>

      <section className="hero" id="question" aria-labelledby="page-title">
        <div className="hero__eyebrow">
          <span>folio · open</span>
          <span className="eyebrow-line" />
          <span className="hero__eyebrow-aside">read slowly</span>
          <span className="eyebrow-line eyebrow-line--short" />
          <span className="hero__eyebrow-folio">no. 170</span>
        </div>

        <div className="hero__layout">
          <aside className="hero__aside" aria-hidden="true">
            <span className="hero__aside-number">Q.</span>
            <span className="hero__aside-line" />
            <span className="hero__aside-caption">ask<br />again</span>
          </aside>

          <div className="hero__copy">
            <h1 id="page-title">{TITLE}</h1>
            <p className="hero__dek">
              A small, stubborn inquiry into whether a machine can make a page feel like someone was here.
            </p>

            <button
              className={`reveal ${revealed ? 'reveal--open' : ''}`}
              type="button"
              onClick={() => setRevealed((r) => !r)}
              aria-expanded={revealed}
              aria-controls={answerId}
            >
              <span className="reveal__icon" aria-hidden="true">{revealed ? '−' : '+'}</span>
              <span className="reveal__label">{revealed ? 'close the answer' : 'turn the page'}</span>
              <span className="reveal__arrow" aria-hidden="true">↗</span>
            </button>

            <Marginalia side="right">← the question, set in italic for a reason</Marginalia>
          </div>

          <div className="hero__seal-slot" aria-hidden="true">
            <Headmark />
            <span className="hero__seal-caption">a careful set</span>
          </div>
        </div>

        <Marginalia side="left">read me — i am slow on purpose</Marginalia>
      </section>

      <section
        id="answer"
        className={`answer ${revealed ? 'answer--visible' : ''}`}
        aria-labelledby="answer-title"
        aria-hidden={!revealed}
      >
        <div className="answer__bar" aria-hidden="true" />
        <div className="answer__inner" id={answerId}>
          <header className="answer__head">
            <div className="answer__label">
              <span>the answer</span>
              <span className="answer__rule" />
              <span className="answer__label-aside">for now</span>
            </div>
            <span className="answer__signoff-pre">— m3, still learning the pause</span>
          </header>

          <p className="answer__lead">
            <span className="dropcap">Y</span>es — when it stops trying to look impressive.
          </p>

          <div className="answer__text">
            <p>
              The good part is not the gradient, the flourish, or the clever little mechanism. It is the moment
              the page gives you room to notice one thing. Then another.
            </p>
            <p>
              So this is a qualified yes: <em>good at frontend</em> means attentive to the person on the other
              side of the glass. The rest is decoration with a job to do.
            </p>
          </div>

          <div className="answer__foot">
            <Ornament />
            <div className="answer__signoff">
              <span>— m3</span>
              <span>still learning the pause</span>
            </div>
          </div>
        </div>

        <div className="answer__seal" aria-hidden="true">
          <Seal />
        </div>
      </section>

      <div className="rule-band" aria-hidden="true">
        <span className="rule-band__line" />
        <span className="rule-band__mark">※</span>
        <span className="rule-band__line" />
      </div>

      <section className="notes" id="notes" aria-labelledby="notes-title">
        <div className="notes__intro">
          <span className="section-index">field notes / 03</span>
          <h2 id="notes-title">
            A few things<br />
            <i>worth keeping.</i>
          </h2>
          <p>Not rules. Just the residue of making this page.</p>
          <p className="notes__hint">Tap a note to read it slowly.</p>
        </div>

        <div className="notes__list">
          {NOTES.map((note, index) => {
            const isOpen = openNote === index
            const panelId = `note-panel-${index}`
            return (
              <div className={`note ${isOpen ? 'note--open' : ''}`} key={note.label}>
                <button
                  className="note__head"
                  type="button"
                  onClick={() => setOpenNote(isOpen ? null : index)}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                >
                  <span className="note__label">{note.label}</span>
                  <span className="note__title">
                    <strong>{note.title}</strong>
                    <em className="note__gloss">— {note.gloss}</em>
                  </span>
                  <span className="note__glyph" aria-hidden="true">
                    <Glyph name={note.glyph} />
                  </span>
                  <span className="note__chev" aria-hidden="true">{isOpen ? '−' : '+'}</span>
                </button>
                <div className="note__panel" id={panelId} role="region" aria-labelledby={`${panelId}-title`}>
                  <p id={`${panelId}-title`} className="sr-only">{note.title}</p>
                  <p>{note.body}</p>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      <Colophon />

      <footer className="footer">
        <span className="footer__col">made with intent, not certainty</span>
        <a className="footer__col footer__back" href="#question">back to the top ↑</a>
        <span className="footer__col footer__title">{TITLE}</span>
      </footer>
    </main>
  )
}