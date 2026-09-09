import { useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from 'react'

const TITLE = 'is Minimax M3 good at frontend yet?'

type WordId = 'm3' | 'good' | 'yet'
type VoiceId = 'quiet' | 'human' | 'bold'

type Note = {
  id: WordId
  index: string
  label: string
  title: string
  gloss: string
  body: string
  prompt: string
}

type Voice = {
  id: VoiceId
  name: string
  descriptor: string
  body: string
  lines: [string, string, string]
}

const NOTES: Note[] = [
  {
    id: 'm3',
    index: '01',
    label: 'M3',
    title: 'Keep the fingerprint',
    gloss: 'a habit, not a name',
    body: 'A useful page should leave evidence of a point of view. Not a logo. Not a trick. A small, repeatable act of judgment.',
    prompt: 'the maker is a habit',
  },
  {
    id: 'good',
    index: '02',
    label: 'good at',
    title: 'Choose one clear thing',
    gloss: 'confidence is generous',
    body: 'The interface gets quieter when it stops presenting every possible answer. A confident choice gives the reader somewhere to stand.',
    prompt: 'make room for attention',
  },
  {
    id: 'yet',
    index: '03',
    label: 'yet?',
    title: 'Protect the pause',
    gloss: 'the question stays open',
    body: '“Yet” carries the honest part. The space before an answer is not a gap to decorate; it is where the reader arrives.',
    prompt: 'leave room to arrive',
  },
]

const VOICES: Voice[] = [
  {
    id: 'quiet',
    name: 'quiet cut',
    descriptor: 'small caps / close set',
    body: 'The practical reading. It gets out of the way and lets the question do the work.',
    lines: ['is Minimax', 'good at frontend', 'yet?'],
  },
  {
    id: 'human',
    name: 'human hand',
    descriptor: 'italic / a little warm',
    body: 'The personal reading. A little wobble makes the machine feel less like a machine.',
    lines: ['is M3', 'good at frontend', 'yet?'],
  },
  {
    id: 'bold',
    name: 'bold signal',
    descriptor: 'display / no apology',
    body: 'The poster reading. It answers with its whole chest, then leaves the room for doubt.',
    lines: ['IS', 'GOOD AT', 'FRONTEND YET?'],
  },
]

function LogoMark() {
  return (
    <svg className="brand__mark" viewBox="0 0 42 42" aria-hidden="true">
      <circle cx="21" cy="21" r="18" fill="none" stroke="currentColor" strokeWidth="1" />
      <circle cx="21" cy="21" r="12" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="1.5 2.5" />
      <path d="M9 21h24M21 9v24" stroke="currentColor" strokeWidth=".7" opacity=".55" />
      <text x="21" y="25.5" textAnchor="middle" fontFamily="Georgia, serif" fontStyle="italic" fontSize="12" fill="currentColor">m³</text>
    </svg>
  )
}

function ArrowIcon() {
  return (
    <svg className="arrow-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 12h15M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function OrbitGlyph() {
  return (
    <svg className="orbit-glyph" viewBox="0 0 420 420" aria-hidden="true">
      <circle className="orbit-glyph__outer" cx="210" cy="210" r="164" />
      <ellipse className="orbit-glyph__tilt" cx="210" cy="210" rx="164" ry="74" />
      <ellipse className="orbit-glyph__tilt orbit-glyph__tilt--reverse" cx="210" cy="210" rx="164" ry="74" />
      <circle className="orbit-glyph__core" cx="210" cy="210" r="45" />
      <circle className="orbit-glyph__dot orbit-glyph__dot--one" cx="210" cy="46" r="5" />
      <circle className="orbit-glyph__dot orbit-glyph__dot--two" cx="370" cy="210" r="4" />
      <circle className="orbit-glyph__dot orbit-glyph__dot--three" cx="89" cy="303" r="3" />
      <path className="orbit-glyph__cross" d="M210 128v164M128 210h164" />
      <text x="210" y="222" textAnchor="middle" fontFamily="Georgia, serif" fontStyle="italic" fontSize="34">m³</text>
    </svg>
  )
}

function NoteGlyph({ id }: { id: WordId }) {
  if (id === 'm3') {
    return (
      <svg viewBox="0 0 40 24" aria-hidden="true">
        <path d="M2 17c6-14 10 10 17-3 6-12 10 7 19-7" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    )
  }
  if (id === 'good') {
    return (
      <svg viewBox="0 0 40 24" aria-hidden="true">
        <path d="M2 12h36M20 3v18M14 6l6-3 6 3" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 40 24" aria-hidden="true">
      <path d="M3 5l16 14L37 5M3 19l8-7M37 19l-8-7" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function TitleToken({
  id,
  text,
  selected,
  onSelect,
  onHover,
  onLeave,
  tokenRef,
}: {
  id: WordId
  text: string
  selected: boolean
  onSelect: (id: WordId) => void
  onHover: (id: WordId) => void
  onLeave: () => void
  tokenRef: (node: HTMLButtonElement | null) => void
}) {
  return (
    <button
      ref={tokenRef}
      type="button"
      className={`title-token title-token--${id} ${selected ? 'is-selected' : ''}`}
      data-word={id}
      aria-pressed={selected}
      aria-describedby={`note-${id}`}
      onClick={() => onSelect(id)}
      onMouseEnter={() => onHover(id)}
      onMouseLeave={onLeave}
      onFocus={() => onHover(id)}
      onBlur={onLeave}
    >
      {text}
    </button>
  )
}

function SignalCard({ word, voice }: { word: WordId; voice: VoiceId }) {
  const wordLabel = NOTES.find(note => note.id === word)?.prompt ?? 'make room for attention'
  return (
    <aside className={`signal-card signal-card--${voice}`} aria-label="A visual study of the question">
      <div className="signal-card__topline">
        <span>field note</span>
        <span>the signal desk</span>
      </div>
      <div className="signal-card__art">
        <OrbitGlyph />
        <span className="signal-card__crosshair signal-card__crosshair--one" aria-hidden="true" />
        <span className="signal-card__crosshair signal-card__crosshair--two" aria-hidden="true" />
        <span className="signal-card__annotation signal-card__annotation--top">attention</span>
        <span className="signal-card__annotation signal-card__annotation--side">pause / repeat</span>
      </div>
      <div className="signal-card__bottomline">
        <span className="signal-card__prompt">{wordLabel}</span>
        <span className="signal-card__mark" aria-hidden="true">↗</span>
      </div>
    </aside>
  )
}

function AnswerPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <section
      className={`answer-panel ${open ? 'is-open' : ''}`}
      id="answer"
      aria-labelledby="answer-title"
      aria-hidden={!open}
    >
      <div className="answer-panel__clip">
        <div className="answer-panel__paper">
          <span className="answer-panel__pin answer-panel__pin--one" aria-hidden="true" />
          <span className="answer-panel__pin answer-panel__pin--two" aria-hidden="true" />
          <div className="answer-panel__grid">
            <div className="answer-panel__stamp" aria-hidden="true">
              <span className="answer-panel__stamp-ring">m³</span>
              <span>for now</span>
            </div>
            <div className="answer-panel__copy">
              <p className="eyebrow eyebrow--dark"><span className="eyebrow__line" />the answer <em>for now</em></p>
              <h2 id="answer-title">Yes — when it stops trying to look impressive.</h2>
              <div className="answer-panel__columns">
                <p>The good part is not the gradient, the flourish, or the clever little mechanism. It is the moment the page gives you room to notice <em>one thing</em>. Then another.</p>
                <p>So this is a qualified yes: good at front-end means attentive to the person on the other side of the glass. The rest is decoration with a job to do.</p>
              </div>
              <div className="answer-panel__pull"><span />attention, not ornament<span /></div>
              <div className="answer-panel__footer">
                <span>an answer can remain unfinished</span>
                <button type="button" onClick={onClose} tabIndex={open ? 0 : -1}>
                  fold it back <ArrowIcon />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function NotesSection({ selected, onSelect }: { selected: WordId; onSelect: (id: WordId) => void }) {
  return (
    <section className="section notes-section" id="notes" aria-labelledby="notes-title">
      <div className="section__header">
        <p className="eyebrow"><span className="eyebrow__line" />marginalia <em>three things worth keeping</em></p>
        <h2 id="notes-title">The page gets better when it <i>pays attention.</i></h2>
        <p className="section__lede">Hover or focus a marked word above. These are not rules; they are the small decisions underneath the surface.</p>
      </div>
      <div className="notes-grid">
        {NOTES.map(note => (
          <button
            key={note.id}
            id={`note-${note.id}`}
            type="button"
            className={`note-card note-card--${note.id} ${selected === note.id ? 'is-selected' : ''}`}
            aria-pressed={selected === note.id}
            onClick={() => onSelect(note.id)}
          >
            <span className="note-card__head">
              <span>{note.index}</span>
              <NoteGlyph id={note.id} />
            </span>
            <span className="note-card__label">{note.label}</span>
            <strong>{note.title}</strong>
            <em>{note.gloss}</em>
            <span className="note-card__body">{note.body}</span>
            <span className="note-card__prompt">{note.prompt} <span aria-hidden="true">↗</span></span>
          </button>
        ))}
      </div>
    </section>
  )
}

function VoicesSection({ voice, onVoice, voiceRefs }: {
  voice: VoiceId
  onVoice: (id: VoiceId) => void
  voiceRefs: React.MutableRefObject<Partial<Record<VoiceId, HTMLButtonElement | null>>>
}) {
  const selectByKey = (event: ReactKeyboardEvent<HTMLButtonElement>, id: VoiceId) => {
    const index = VOICES.findIndex(item => item.id === id)
    let nextIndex = index
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') nextIndex = (index + 1) % VOICES.length
    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') nextIndex = (index - 1 + VOICES.length) % VOICES.length
    if (event.key === 'Home') nextIndex = 0
    if (event.key === 'End') nextIndex = VOICES.length - 1
    if (nextIndex === index) return
    event.preventDefault()
    const next = VOICES[nextIndex].id
    onVoice(next)
    window.requestAnimationFrame(() => voiceRefs.current[next]?.focus())
  }

  const current = VOICES.find(item => item.id === voice) ?? VOICES[0]

  return (
    <section className="section voices-section" id="voices" aria-labelledby="voices-title">
      <div className="section__header voices-section__header">
        <p className="eyebrow eyebrow--dark"><span className="eyebrow__line" />type drawer <em>one question, three readings</em></p>
        <h2 id="voices-title">Let the same words <i>change clothes.</i></h2>
        <p className="section__lede">Choose a voice. The title above shifts with it, because typography is part of the answer.</p>
      </div>
      <div className="voices-board">
        <div className="voice-tabs" role="tablist" aria-label="Choose a typographic voice">
          {VOICES.map(item => (
            <button
              key={item.id}
              ref={node => { voiceRefs.current[item.id] = node }}
              type="button"
              className={`voice-tab voice-tab--${item.id} ${voice === item.id ? 'is-active' : ''}`}
              role="tab"
              aria-selected={voice === item.id}
              aria-controls="voice-panel"
              tabIndex={voice === item.id ? 0 : -1}
              onClick={() => onVoice(item.id)}
              onKeyDown={event => selectByKey(event, item.id)}
            >
              <span className="voice-tab__number">{item.id === 'quiet' ? 'A' : item.id === 'human' ? 'B' : 'C'}</span>
              <span>
                <strong>{item.name}</strong>
                <em>{item.descriptor}</em>
              </span>
              <span className="voice-tab__arrow" aria-hidden="true">↗</span>
            </button>
          ))}
        </div>
        <div className={`voice-stage voice-stage--${voice}`} id="voice-panel" role="tabpanel" aria-label={`${current.name} specimen`}>
          <div className="voice-stage__topline">
            <span>the selected setting</span>
            <span>{current.descriptor}</span>
          </div>
          <div className="voice-stage__sample" aria-hidden="true">
            <span>{current.lines[0]}</span>
            <span>{current.lines[1]}</span>
            <span>{current.lines[2]}</span>
          </div>
          <div className="voice-stage__bottomline">
            <p>{current.body}</p>
            <span className="voice-stage__cursor" aria-hidden="true">▌</span>
          </div>
        </div>
      </div>
    </section>
  )
}

export function App() {
  const [answerOpen, setAnswerOpen] = useState(false)
  const [selectedWord, setSelectedWord] = useState<WordId>('good')
  const [hoveredWord, setHoveredWord] = useState<WordId | null>(null)
  const [voice, setVoice] = useState<VoiceId>('quiet')
  const [activeSection, setActiveSection] = useState('question')
  const [announcement, setAnnouncement] = useState('')
  const tokenRefs = useRef<Partial<Record<WordId, HTMLButtonElement | null>>>({})
  const voiceRefs = useRef<Partial<Record<VoiceId, HTMLButtonElement | null>>>({})
  const answerTriggerRef = useRef<HTMLButtonElement>(null)

  const activeWord = hoveredWord ?? selectedWord

  useEffect(() => {
    document.title = TITLE
  }, [])

  useEffect(() => {
    const elements = ['question', 'answer', 'notes', 'voices']
      .map(id => document.getElementById(id))
      .filter((element): element is HTMLElement => Boolean(element))
    if (!('IntersectionObserver' in window)) return
    const observer = new IntersectionObserver(
      entries => {
        const visible = entries
          .filter(entry => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (visible[0]) setActiveSection(visible[0].target.id)
      },
      { rootMargin: '-22% 0px -58% 0px', threshold: [0.05, 0.25, 0.6] },
    )
    elements.forEach(element => observer.observe(element))
    return () => observer.disconnect()
  }, [answerOpen])

  const selectWord = (id: WordId, focus = false) => {
    const note = NOTES.find(item => item.id === id)
    setSelectedWord(id)
    setAnnouncement(note ? `${note.label}: ${note.title}.` : '')
    if (focus) window.requestAnimationFrame(() => tokenRefs.current[id]?.focus())
  }

  const selectVoice = (id: VoiceId) => {
    const next = VOICES.find(item => item.id === id)
    setVoice(id)
    setAnnouncement(next ? `${next.name} selected.` : '')
  }

  const toggleAnswer = () => {
    const next = !answerOpen
    setAnswerOpen(next)
    setAnnouncement(next ? 'Answer revealed.' : 'Answer folded away.')
    if (!next) window.requestAnimationFrame(() => answerTriggerRef.current?.focus())
  }

  const openAnswerFromNav = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    if (!answerOpen) setAnswerOpen(true)
    window.requestAnimationFrame(() => document.getElementById('answer')?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
  }

  return (
    <main className={`app app--voice-${voice} app--word-${activeWord}`}>
      <div className="app__grain" aria-hidden="true" />
      <header className="site-header">
        <a className="brand" href="#question" aria-label="Return to the question">
          <LogoMark />
          <span className="brand__copy">
            <strong>m³ / front-end</strong>
            <em>an open question</em>
          </span>
        </a>
        <nav className="site-nav" aria-label="Sections">
          <a href="#question" className={activeSection === 'question' ? 'is-active' : ''} aria-current={activeSection === 'question' ? 'location' : undefined}>question</a>
          <a href="#answer" className={activeSection === 'answer' ? 'is-active' : ''} aria-current={activeSection === 'answer' ? 'location' : undefined} onClick={openAnswerFromNav}>answer</a>
          <a href="#notes" className={activeSection === 'notes' ? 'is-active' : ''} aria-current={activeSection === 'notes' ? 'location' : undefined}>notes</a>
          <a href="#voices" className={activeSection === 'voices' ? 'is-active' : ''} aria-current={activeSection === 'voices' ? 'location' : undefined}>voices</a>
        </nav>
        <span className="site-header__note">a page that listens</span>
      </header>

      <div className="page">
        <section className="hero" id="question" aria-labelledby="page-title">
          <div className="hero__eyebrow-row">
            <p className="eyebrow"><span className="eyebrow__line" />frontend experiment <em>read the question first</em></p>
            <span className="hero__coordinates">signal / noise / care</span>
          </div>
          <div className="hero__layout">
            <div className="hero__copy">
              <h1 className={`hero__title hero__title--${voice}`} id="page-title" aria-label={TITLE}>
                <span className="title__line">is Minimax </span>
                <span className="title__line">
                  <TitleToken id="m3" text="M3" selected={activeWord === 'm3'} onSelect={id => selectWord(id)} onHover={setHoveredWord} onLeave={() => setHoveredWord(null)} tokenRef={node => { tokenRefs.current.m3 = node }} />{' '}
                  <TitleToken id="good" text="good at" selected={activeWord === 'good'} onSelect={id => selectWord(id)} onHover={setHoveredWord} onLeave={() => setHoveredWord(null)} tokenRef={node => { tokenRefs.current.good = node }} />
                </span>
                <span className="title__line"> frontend <TitleToken id="yet" text="yet" selected={activeWord === 'yet'} onSelect={id => selectWord(id)} onHover={setHoveredWord} onLeave={() => setHoveredWord(null)} tokenRef={node => { tokenRefs.current.yet = node }} />?</span>
              </h1>
              <p className="hero__summary">A small, stubborn inquiry into whether a machine can make a page feel like <em>someone was here.</em></p>
              <div className="hero__actions">
                <button ref={answerTriggerRef} type="button" className={`button button--primary ${answerOpen ? 'is-open' : ''}`} onClick={toggleAnswer} aria-expanded={answerOpen} aria-controls="answer">
                  <span>{answerOpen ? 'fold the answer' : 'reveal the answer'}</span>
                  <ArrowIcon />
                </button>
                <a className="text-link" href="#notes">follow the annotation <span aria-hidden="true">↓</span></a>
              </div>
              <div className="hero__note">
                <span className="hero__note-mark" aria-hidden="true">*</span>
                <p><strong>Good front-end work</strong> is less about showing what can be made than noticing what should remain quiet.</p>
              </div>
            </div>
            <SignalCard word={activeWord} voice={voice} />
          </div>
          <div className="hero__footer">
            <span><i className="hero__footer-dot" /> drag your attention slowly</span>
            <span>the marked words open the margin</span>
            <a href="#answer" onClick={openAnswerFromNav} aria-label="Jump to the answer">↓</a>
          </div>
        </section>

        <AnswerPanel open={answerOpen} onClose={toggleAnswer} />
        <NotesSection selected={selectedWord} onSelect={id => selectWord(id, true)} />
        <VoicesSection voice={voice} onVoice={selectVoice} voiceRefs={voiceRefs} />

        <footer className="site-footer">
          <div className="site-footer__rule"><span /><LogoMark /><span /></div>
          <p className="site-footer__line">the question remains useful <i>because the answer can change</i></p>
          <a className="site-footer__back" href="#question">back to the question <ArrowIcon /></a>
        </footer>
      </div>
      <span className="sr-only" aria-live="polite">{announcement}</span>
    </main>
  )
}
