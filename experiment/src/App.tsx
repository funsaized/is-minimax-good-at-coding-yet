import { useState } from 'react'

const TITLE = 'is Minimax M3 good at frontend yet?'

const NOTES = [
  { label: '01', title: 'Make a choice', body: 'A point of view is more useful than a cloud of possibilities.' },
  { label: '02', title: 'Leave a trace', body: 'The little decisions — a pause, a border, a strange detail — are the work.' },
  { label: '03', title: 'Let it breathe', body: 'Good interfaces do not fill every quiet space.' },
]

function Mark() {
  return (
    <svg className="mark" viewBox="0 0 64 64" aria-hidden="true">
      <path d="M32 4v56M4 32h56" />
      <circle cx="32" cy="32" r="20" />
      <circle cx="32" cy="32" r="4" />
      <path d="M14 14l36 36M50 14L14 50" />
    </svg>
  )
}

export function App() {
  const [revealed, setRevealed] = useState(false)
  const [focusMode, setFocusMode] = useState(false)
  const [activeNote, setActiveNote] = useState(0)

  return (
    <main className={`studio ${focusMode ? 'studio--focus' : ''}`}>
      <div className="grain" aria-hidden="true" />
      <header className="topbar">
        <a className="wordmark" href="#question" aria-label="Return to the question">
          <Mark />
          <span>an ongoing<br /><b>frontend experiment</b></span>
        </a>
        <div className="topbar__right">
          <span className="topbar__date">a page in progress</span>
          <button className="focus-toggle" type="button" onClick={() => setFocusMode(!focusMode)} aria-pressed={focusMode}>
            <span className="focus-toggle__dot" /> {focusMode ? 'exit focus' : 'focus mode'}
          </button>
        </div>
      </header>

      <section className="hero" id="question" aria-labelledby="page-title">
        <div className="hero__eyebrow"><span>the question</span><span className="eyebrow-line" /><span>read slowly</span></div>
        <div className="hero__layout">
          <div className="hero__aside" aria-hidden="true">
            <span className="hero__aside-number">Q.</span>
            <span className="hero__aside-line" />
            <span className="hero__aside-caption">ask<br />again</span>
          </div>
          <div className="hero__copy">
            <h1 id="page-title">{TITLE}</h1>
            <p className="hero__dek">A small, stubborn inquiry into whether a machine can make a page feel like someone was here.</p>
            <button className={`reveal ${revealed ? 'reveal--open' : ''}`} type="button" onClick={() => setRevealed(!revealed)} aria-expanded={revealed}>
              <span className="reveal__icon">{revealed ? '−' : '+'}</span>
              <span>{revealed ? 'close the answer' : 'turn the page'}</span>
              <span className="reveal__arrow">↗</span>
            </button>
          </div>
          <div className="hero__orbit" aria-hidden="true">
            <div className="orbit orbit--one" /><div className="orbit orbit--two" />
            <span className="orbit__star">✳</span><span className="orbit__tiny">·</span>
          </div>
        </div>
      </section>

      <section className={`answer ${revealed ? 'answer--visible' : ''}`} aria-live="polite" aria-hidden={!revealed}>
        <div className="answer__label"><span>the answer</span><span className="answer__rule" /><span>for now</span></div>
        <div className="answer__body">
          <p className="answer__lead">Yes — when it stops trying to look impressive.</p>
          <div className="answer__text">
            <p>The good part is not the gradient, the flourish, or the clever little mechanism. It is the moment the page gives you room to notice one thing. Then another.</p>
            <p>So this is a qualified yes: <em>good at frontend</em> means attentive to the person on the other side of the glass. The rest is decoration with a job to do.</p>
          </div>
          <div className="answer__signoff"><span>— m3</span><span>still learning the pause</span></div>
        </div>
      </section>

      <section className="notes" id="notes" aria-labelledby="notes-title">
        <div className="notes__intro">
          <span className="section-index">field notes / 03</span>
          <h2 id="notes-title">A few things<br /><i>worth keeping.</i></h2>
          <p>Not rules. Just the residue of making this page.</p>
        </div>
        <div className="notes__list" role="list">
          {NOTES.map((note, index) => (
            <button className={`note ${activeNote === index ? 'note--active' : ''}`} key={note.label} type="button" onClick={() => setActiveNote(index)} role="listitem" aria-pressed={activeNote === index}>
              <span className="note__label">{note.label}</span>
              <span className="note__content"><strong>{note.title}</strong><span>{note.body}</span></span>
              <span className="note__mark">{activeNote === index ? '↘' : '↗'}</span>
            </button>
          ))}
        </div>
      </section>

      <footer className="footer">
        <span>made with intent, not certainty</span>
        <a href="#question">back to the top ↑</a>
        <span>is Minimax M3 good at frontend yet?</span>
      </footer>
    </main>
  )
}
