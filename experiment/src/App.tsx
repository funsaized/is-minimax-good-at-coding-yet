import { useId, useState } from 'react'

const TITLE = 'is Minimax M3 good at frontend yet?'

type Note = { number: string; title: string; text: string }

const NOTES: Note[] = [
  { number: '01', title: 'Choose a side', text: 'A page gets clearer when it makes one confident choice instead of presenting every possible direction at once.' },
  { number: '02', title: 'Keep the fingerprint', text: 'A pause, an off-kilter line, a detail with no obvious reason: these are the traces that make a surface feel authored.' },
  { number: '03', title: 'Protect the quiet', text: 'Whitespace is not an empty state. It is the interval that lets the important thing arrive.' },
]

function Compass() {
  return <svg className="compass" viewBox="0 0 160 160" aria-hidden="true"><circle cx="80" cy="80" r="67" /><circle cx="80" cy="80" r="55" /><path d="M80 8v18M80 134v18M8 80h18M134 80h18M29 29l13 13M118 118l13 13M131 29l-13 13M42 118l-13 13" /><path className="compass__needle" d="m80 37 9 43-9 43-9-43z" /><circle cx="80" cy="80" r="4" fill="currentColor" /><text x="80" y="74" textAnchor="middle">Q</text><text x="80" y="101" textAnchor="middle">A</text></svg>
}

function Spark() {
  return <svg className="spark" viewBox="0 0 70 20" aria-hidden="true"><path d="M0 10h25m20 0h25M35 2v16M28 10l7-7 7 7-7 7z" /></svg>
}

export function App() {
  const [revealed, setRevealed] = useState(false)
  const [openNote, setOpenNote] = useState(0)
  const answerId = useId()

  return <main className="desk">
    <div className="desk__noise" aria-hidden="true" />
    <header className="masthead">
      <a className="signature" href="#question" aria-label="Return to the question"><span className="signature__mark">m3</span><span>an ongoing<br /><strong>frontend experiment</strong></span></a>
      <nav aria-label="Sections"><a href="#question">question</a><a href="#answer">answer</a><a href="#notes">field notes</a></nav>
      <span className="edition">a page in progress <i>·</i> folio 170</span>
    </header>

    <section className="opening" id="question" aria-labelledby="page-title">
      <div className="opening__rail"><span>Q.</span><i /><small>look<br />closely</small></div>
      <div className="opening__copy">
        <p className="overline"><span>the question</span><b /> <em>read slowly</em></p>
        <h1 id="page-title">{TITLE}</h1>
        <p className="intro">A small, stubborn inquiry into whether a machine can make a page feel like someone was here.</p>
        <button className={`turn ${revealed ? 'turn--open' : ''}`} onClick={() => setRevealed(value => !value)} aria-expanded={revealed} aria-controls={answerId}><span>{revealed ? '−' : '+'}</span>{revealed ? 'close the answer' : 'turn the page'}<b>↗</b></button>
        <p className="scribble">a useful question<br /><i>is rarely tidy</i></p>
      </div>
      <div className="opening__compass"><Compass /><span>not a verdict<br />a direction</span></div>
    </section>

    <section className={`answer ${revealed ? 'answer--visible' : ''}`} id="answer" aria-hidden={!revealed} aria-labelledby="answer-title">
      <div className="answer__stamp">pressed<br /><strong>by hand</strong></div>
      <div className="answer__body" id={answerId}><p className="overline" id="answer-title"><span>the answer</span><b /><em>for now</em></p><p className="answer__lead"><span>Y</span>es — when it stops trying to look impressive.</p><div className="answer__columns"><p>The good part is not the gradient, the flourish, or the clever little mechanism. It is the moment the page gives you room to notice one thing. Then another.</p><p>So this is a qualified yes: <em>good at frontend</em> means attentive to the person on the other side of the glass. The rest is decoration with a job to do.</p></div><div className="answer__sign"><Spark /><span>— m3, still learning the pause</span></div></div>
    </section>

    <section className="notes" id="notes" aria-labelledby="notes-title"><div className="notes__intro"><p className="overline"><span>field notes / 03</span><b /></p><h2 id="notes-title">A few things<br /><i>worth keeping.</i></h2><p>Not rules. Just the residue of making this page.</p></div><div className="notes__list">{NOTES.map((note, index) => { const open = openNote === index; const panel = `note-${index}`; return <article className={`note ${open ? 'note--open' : ''}`} key={note.number}><button onClick={() => setOpenNote(open ? -1 : index)} aria-expanded={open} aria-controls={panel}><span>{note.number}</span><strong>{note.title}</strong><i>{open ? '−' : '+'}</i></button><div id={panel} className="note__text"><p>{note.text}</p></div></article> })}</div></section>

    <footer className="footer"><Spark /><span>made with intent, not certainty</span><a href="#question">return to the question ↑</a></footer>
  </main>
}
