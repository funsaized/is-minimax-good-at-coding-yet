import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from 'react'
import { NOTES, type Note, type WordId } from './notes'

export type VoiceId = 'quiet' | 'human' | 'bold'

type VoiceSpec = {
  id: VoiceId
  letter: string
  name: string
  manner: string
  sample: string
  detail: string
}

type ProbePosition = {
  x: number
  y: number
}

const TITLE = 'is Minimax M3 good at frontend yet?'

const VOICES: VoiceSpec[] = [
  {
    id: 'quiet',
    letter: 'A',
    name: 'measured',
    manner: 'serif / spacious',
    sample: 'is M3 good at frontend yet?',
    detail: 'A little restraint gives every word a clean edge and enough air to be understood.',
  },
  {
    id: 'human',
    letter: 'B',
    name: 'warm',
    manner: 'sans / open',
    sample: 'is M3 good at frontend yet?',
    detail: 'A human tilt, without losing the sentence. Warmth stays in the gesture, not the noise.',
  },
  {
    id: 'bold',
    letter: 'C',
    name: 'direct',
    manner: 'sans / emphatic',
    sample: 'IS M3 GOOD AT FRONTEND YET?',
    detail: 'A firmer voice with blunt hierarchy. The page becomes louder only where it needs to.',
  },
]

const NAV_ITEMS = [
  { id: 'question', label: 'question' },
  { id: 'field-notes', label: 'close read' },
  { id: 'voices', label: 'type trials' },
  { id: 'answer', label: 'answer' },
] as const

const NEXT_VOICE: Record<VoiceId, VoiceId> = {
  quiet: 'human',
  human: 'bold',
  bold: 'quiet',
}

const VOICE_NAME: Record<VoiceId, string> = {
  quiet: 'measured',
  human: 'warm',
  bold: 'direct',
}

const clampProbe = (value: number) => Math.max(8, Math.min(92, value))

export function App() {
  const [voice, setVoice] = useState<VoiceId>('quiet')
  const [selectedWord, setSelectedWord] = useState<WordId>('good')
  const [hoveredWord, setHoveredWord] = useState<WordId | null>(null)
  const [activeSection, setActiveSection] = useState<string>('question')
  const [answerOpen, setAnswerOpen] = useState(false)
  const [announcement, setAnnouncement] = useState('')
  const answerTriggerRef = useRef<HTMLButtonElement | null>(null)
  const answerCloseRef = useRef<HTMLButtonElement | null>(null)

  const activeWord = hoveredWord ?? selectedWord
  const activeNote = NOTES.find(note => note.id === activeWord) ?? NOTES[0]
  const activeVoice = VOICES.find(item => item.id === voice) ?? VOICES[0]

  const selectWord = useCallback((id: WordId) => {
    setSelectedWord(id)
    const note = NOTES.find(item => item.id === id)
    if (note) setAnnouncement(`${note.label}: ${note.title}. ${note.gloss}.`)
  }, [])

  const selectVoice = useCallback((id: VoiceId) => {
    setVoice(id)
    setAnnouncement(`The page is now set in the ${VOICE_NAME[id]} voice.`)
  }, [])

  const cycleVoice = useCallback(() => {
    const next = NEXT_VOICE[voice]
    setVoice(next)
    setAnnouncement(`The page is now set in the ${VOICE_NAME[next]} voice.`)
  }, [voice])

  const toggleAnswer = useCallback(() => {
    const next = !answerOpen
    setAnswerOpen(next)
    setAnnouncement(next ? 'The answer is revealed.' : 'The answer is covered again.')
    window.requestAnimationFrame(() => {
      if (next) answerCloseRef.current?.focus()
      else answerTriggerRef.current?.focus()
    })
  }, [answerOpen])

  useEffect(() => {
    document.title = TITLE
  }, [])

  useEffect(() => {
    if (!('IntersectionObserver' in window)) return
    const sections = NAV_ITEMS.map(item => document.getElementById(item.id)).filter(
      (node): node is HTMLElement => Boolean(node),
    )
    const observer = new IntersectionObserver(
      entries => {
        const visible = entries
          .filter(entry => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (visible[0]) setActiveSection(visible[0].target.id)
      },
      { rootMargin: '-18% 0px -66% 0px', threshold: [0.05, 0.2, 0.5] },
    )
    sections.forEach(section => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const reveals = Array.from(document.querySelectorAll<HTMLElement>('.reveal'))
    if (!('IntersectionObserver' in window)) {
      reveals.forEach(element => element.classList.add('is-in'))
      return
    }
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return
          entry.target.classList.add('is-in')
          observer.unobserve(entry.target)
        })
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.08 },
    )
    reveals.forEach(element => observer.observe(element))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!answerOpen) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      event.preventDefault()
      toggleAnswer()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [answerOpen, toggleAnswer])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.repeat) return
      const target = event.target as HTMLElement | null
      const tag = target?.tagName.toLowerCase()
      if (tag === 'input' || tag === 'textarea' || target?.isContentEditable) return
      if (event.shiftKey && event.key.toLowerCase() === 'v') {
        event.preventDefault()
        cycleVoice()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [cycleVoice])

  return (
    <div className={`atlas-page atlas-page--${voice}`}>
      <div className="page-grain" aria-hidden="true" />
      <a className="skip-link" href="#question">Skip to the question</a>

      <header className="masthead">
        <a className="wordmark" href="#question" aria-label="M3 frontend field note, back to the question">
          <span className="wordmark__stamp" aria-hidden="true">M3</span>
          <span className="wordmark__copy">
            <strong>frontend field note</strong>
            <small>one question, closely read</small>
          </span>
        </a>

        <nav className="section-nav" aria-label="Page sections">
          {NAV_ITEMS.map((item, index) => (
            <a
              key={item.id}
              className={activeSection === item.id ? 'is-active' : ''}
              href={`#${item.id}`}
              aria-current={activeSection === item.id ? 'location' : undefined}
            >
              <span className="section-nav__index">0{index + 1}</span>
              <span>{item.label}</span>
            </a>
          ))}
        </nav>

        <div className="voice-picker" role="group" aria-label="Set the page's type voice">
          <span className="voice-picker__label">voice</span>
          <div className="voice-picker__set">
            {VOICES.map(item => (
              <button
                key={item.id}
                type="button"
                className={`voice-key voice-key--${item.id} ${voice === item.id ? 'is-active' : ''}`}
                onClick={() => selectVoice(item.id)}
                aria-pressed={voice === item.id}
                aria-label={`Use the ${item.name} type voice`}
                title={item.name}
              >
                {item.letter}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="page-shell">
        <section id="question" className="hero-panel" aria-labelledby="question-title">
          <div className="hero-panel__header">
            <span><i className="signal-dot" aria-hidden="true" /> opening question</span>
            <span className="hero-panel__instruction">choose a phrase / move the lens</span>
            <span>the sentence, under glass</span>
          </div>

          <div className="hero-panel__grid">
            <div className="hero-panel__copy">
              <p className="eyebrow"><span className="eyebrow__star" aria-hidden="true" />a close reading of a good question</p>
              <h1 id="question-title" className="question-title" aria-label={TITLE}>
                <span className="title-line title-line--one">is Minimax</span>{' '}
                <span className="title-line title-line--two">
                  <button
                    type="button"
                    className={`title-word title-word--m3 ${selectedWord === 'm3' ? 'is-selected' : ''}`}
                    onClick={() => selectWord('m3')}
                    onMouseEnter={() => setHoveredWord('m3')}
                    onMouseLeave={() => setHoveredWord(null)}
                    onFocus={() => setHoveredWord('m3')}
                    onBlur={() => setHoveredWord(null)}
                    aria-pressed={selectedWord === 'm3'}
                    aria-label="Move the lens to M3"
                  >
                    M3
                  </button>
                </span>{' '}
                <span className="title-line title-line--three">
                  <button
                    type="button"
                    className={`title-word title-word--good ${selectedWord === 'good' ? 'is-selected' : ''}`}
                    onClick={() => selectWord('good')}
                    onMouseEnter={() => setHoveredWord('good')}
                    onMouseLeave={() => setHoveredWord(null)}
                    onFocus={() => setHoveredWord('good')}
                    onBlur={() => setHoveredWord(null)}
                    aria-pressed={selectedWord === 'good'}
                    aria-label="Move the lens to good at"
                  >
                    good at
                  </button>
                </span>{' '}
                <span className="title-line title-line--four">frontend</span>{' '}
                <span className="title-line title-line--five">
                  <button
                    type="button"
                    className={`title-word title-word--yet ${selectedWord === 'yet' ? 'is-selected' : ''}`}
                    onClick={() => selectWord('yet')}
                    onMouseEnter={() => setHoveredWord('yet')}
                    onMouseLeave={() => setHoveredWord(null)}
                    onFocus={() => setHoveredWord('yet')}
                    onBlur={() => setHoveredWord(null)}
                    aria-pressed={selectedWord === 'yet'}
                    aria-label="Move the lens to yet"
                  >
                    yet?
                  </button>
                  <span className="title-caret" aria-hidden="true" />
                </span>
              </h1>

              <p className="hero-lede">A question is already a tiny interface. This page treats the sentence as a specimen: choose a phrase, change the temperature, and notice what asks to be looked at twice.</p>

              <div className="hero-actions">
                <a className="primary-link" href="#field-notes">
                  <span>read the close-up</span>
                  <ArrowIcon />
                </a>
                <button type="button" className="voice-cycle" onClick={cycleVoice} aria-keyshortcuts="Shift+V">
                  <span>try another voice</span>
                  <kbd>shift</kbd><span>+</span><kbd>v</kbd>
                </button>
              </div>

              <p className="interaction-cue"><span className="interaction-cue__line" aria-hidden="true" /> touch a colored phrase to move the lens</p>
            </div>

            <LensInstrument note={activeNote} voiceName={activeVoice.name} />
          </div>

          <div className="hero-panel__footer">
            <span><i className="hero-panel__signal" aria-hidden="true" /> the page is asking, not declaring</span>
            <span>active phrase <strong>{activeNote.label}</strong></span>
            <span>read the shape, not the claim</span>
          </div>
        </section>

        <ThreadBreak />

        <section id="field-notes" className="reading-panel section--paper reveal" aria-labelledby="reading-title">
          <SectionIntro
            number="01"
            titleId="reading-title"
            eyebrow="close reading"
            title={<>The sentence has <em>pressure points.</em></>}
            lede="M3 names the maker. “good at” names the standard. “yet?” protects the honest pause. Choose a phrase to read its job."
          />

          <div className="reading-layout">
            <div className="phrase-index" role="group" aria-label="Choose a phrase from the question">
              <div className="phrase-index__header">
                <span>choose a pressure point</span>
                <span aria-hidden="true">01—03</span>
              </div>
              <div className="phrase-list">
                {NOTES.map(note => (
                  <button
                    key={note.id}
                    type="button"
                    className={`phrase-button ${selectedWord === note.id ? 'is-selected' : ''} ${hoveredWord === note.id ? 'is-hovered' : ''}`}
                    onClick={() => selectWord(note.id)}
                    onMouseEnter={() => setHoveredWord(note.id)}
                    onMouseLeave={() => setHoveredWord(null)}
                    onFocus={() => setHoveredWord(note.id)}
                    onBlur={() => setHoveredWord(null)}
                    aria-pressed={selectedWord === note.id}
                  >
                    <span className="phrase-button__index">{note.index}</span>
                    <span className="phrase-button__label">{note.label}</span>
                    <span className="phrase-button__copy">
                      <strong>{note.title}</strong>
                      <small>{note.gloss}</small>
                    </span>
                    <span className="phrase-button__arrow" aria-hidden="true">↗</span>
                  </button>
                ))}
              </div>
              <p className="phrase-index__hint">The same sentence, read from three distances.</p>
            </div>

            <article className={`note-card note-card--${activeNote.id}`} key={activeNote.id} aria-live="polite">
              <div className="note-card__topline">
                <span>close read / {activeNote.index}</span>
                <span aria-hidden="true">{activeNote.folio}</span>
              </div>
              <div className="note-card__body">
                <p className="note-card__kicker">{activeNote.title}</p>
                <h3>{activeNote.label}</h3>
                <p className="note-card__copy">{activeNote.body}</p>
                <div className="note-card__prompt"><b aria-hidden="true">↳</b> {activeNote.prompt}</div>
              </div>
              <WordGlyph id={activeNote.id} />
              <div className="note-card__footer">
                <span>{activeNote.editor}</span>
                <span>margin note / {activeNote.folio}</span>
              </div>
            </article>
          </div>
        </section>

        <section id="voices" className="voices-panel section--dark reveal" aria-labelledby="trials-title">
          <SectionIntro
            number="02"
            titleId="trials-title"
            eyebrow="three type trials"
            title={<>One sentence.<em>Three temperatures.</em></>}
            lede="Switch the voice; the words stay in place. A useful interface has a point of view before it has a palette."
          />

          <div className="voice-grid">
            {VOICES.map(item => {
              const isActive = item.id === voice
              return (
                <article key={item.id} className={`voice-card voice-card--${item.id} ${isActive ? 'is-active' : ''}`}>
                  <button
                    type="button"
                    onClick={() => selectVoice(item.id)}
                    aria-pressed={isActive}
                    aria-label={`Set the page in the ${item.name} voice`}
                  >
                    <span className="voice-card__topline">
                      <span className="voice-card__letter">{item.letter}</span>
                      <span>{item.name} voice</span>
                      <span className="voice-card__arrow" aria-hidden="true">↗</span>
                    </span>
                    <span className="voice-card__name">{item.name}</span>
                    <span className="voice-card__manner">{item.manner}</span>
                    <span className={`voice-card__sample voice-card__sample--${item.id}`}>{item.sample}</span>
                    <span className="voice-card__detail">{item.detail}</span>
                    <span className="voice-card__state">
                      <i aria-hidden="true" />
                      {isActive ? 'selected voice' : 'set this voice'}
                    </span>
                  </button>
                </article>
              )
            })}
          </div>

          <div className="shortcut-note">
            <span>Keyboard shortcut</span>
            <kbd>shift</kbd><span>+</span><kbd>v</kbd><span>cycles the type voice</span>
          </div>
        </section>

        <section id="answer" className="answer-panel section--dark reveal" aria-labelledby="answer-title">
          <div className="answer-intro">
            <p className="eyebrow"><span className="eyebrow__star" aria-hidden="true" /> the useful answer</p>
            <h2 id="answer-title">Small answer.<br /><em>Clear breath.</em></h2>
            <p>The question does not need a speech. It needs one honest sentence—and enough space around it to land.</p>
            <button
              ref={answerTriggerRef}
              type="button"
              className="cover-button"
              onClick={toggleAnswer}
              aria-expanded={answerOpen}
              aria-controls="answer-window"
            >
              <span className="cover-button__icon" aria-hidden="true">
                <svg viewBox="0 0 20 20">
                  <path d="M4 10h12M10.5 4.5 16 10l-5.5 5.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <span>{answerOpen ? 'cover the answer' : 'lift the answer'}</span>
              {answerOpen && <kbd>esc</kbd>}
            </button>
          </div>

          <div className={`answer-card ${answerOpen ? 'is-open' : ''}`}>
            <div className="answer-card__topline">
              <span>answer / no scorecard</span>
              <span aria-hidden="true">{answerOpen ? '●' : '○'}</span>
            </div>
            <div id="answer-window" className="answer-window" aria-live="polite">
              {answerOpen ? (
                <div className="answer-window__content">
                  <button ref={answerCloseRef} type="button" className="answer-close" onClick={toggleAnswer} aria-label="Cover the answer again">
                    <span aria-hidden="true">×</span>
                  </button>
                  <span className="answer-window__yes">yes, with a hand.</span>
                  <h3>When the interface has a point of view you can feel.</h3>
                  <p>A useful frontend has a hierarchy you can read, a little warmth in the details, and motion that rewards attention without demanding it.</p>
                  <ul>
                    <li><span>A</span>Choose one clear idea.</li>
                    <li><span>B</span>Let warmth live in the details.</li>
                    <li><span>C</span>Make motion earn its place.</li>
                  </ul>
                </div>
              ) : (
                <div className="answer-window__cover" aria-hidden="true">
                  <span className="answer-window__question">?</span>
                  <span>one sentence waits under the dot</span>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <a href="#question" className="footer-return"><span aria-hidden="true">↑</span> return to the question</a>
        <p>the work is the question.</p>
        <span>close read / type trial / clear answer</span>
      </footer>

      <span className="sr-only" aria-live="polite">{announcement}</span>
      <span className="sr-only">Current type voice: {activeVoice.name}. Active phrase: {activeNote.label}.</span>
    </div>
  )
}

function SectionIntro({ number, titleId, eyebrow, title, lede }: { number: string; titleId: string; eyebrow: string; title: ReactNode; lede: string }) {
  return (
    <header className="section-intro">
      <div>
        <p className="section-kicker"><span className="section-kicker__number">{number}</span>{eyebrow}</p>
        <h2 id={titleId}>{title}</h2>
      </div>
      <p className="section-intro__lede">{lede}</p>
    </header>
  )
}

function ThreadBreak() {
  return (
    <div className="thread-break" aria-hidden="true">
      <span />
      <svg viewBox="0 0 110 30">
        <path d="M4 15h30M76 15h30" fill="none" stroke="currentColor" strokeWidth="1" />
        <path d="m38 7 7 8-7 8M72 7l-7 8 7 8" fill="none" stroke="currentColor" strokeWidth="1" />
        <circle cx="55" cy="15" r="3" fill="currentColor" />
      </svg>
      <span />
    </div>
  )
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="M3 10h13M10.5 4.5 16 10l-5.5 5.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function LensInstrument({ note, voiceName }: { note: Note; voiceName: string }) {
  const [probe, setProbe] = useState<ProbePosition>({ x: 50, y: 48 })

  const moveProbe = (event: ReactPointerEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect()
    const x = ((event.clientX - bounds.left) / bounds.width) * 100
    const y = ((event.clientY - bounds.top) / bounds.height) * 100
    setProbe({ x: clampProbe(x), y: clampProbe(y) })
  }

  const nudgeProbe = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    const amount = event.shiftKey ? 10 : 4
    const offsets: Record<string, [number, number]> = {
      ArrowLeft: [-amount, 0],
      ArrowRight: [amount, 0],
      ArrowUp: [0, -amount],
      ArrowDown: [0, amount],
    }
    const offset = offsets[event.key]
    if (!offset) return
    event.preventDefault()
    setProbe(current => ({ x: clampProbe(current.x + offset[0]), y: clampProbe(current.y + offset[1]) }))
  }

  return (
    <aside className={`lens-instrument lens-instrument--${note.id}`} aria-label="Interactive close-reading lens" aria-live="polite">
      <div className="lens-instrument__header">
        <span>close reading / lens</span>
        <span className="lens-instrument__mark" aria-hidden="true">{note.index} / 03</span>
      </div>
      <span className="sr-only" id="lens-keyboard-help">Use the arrow keys to move the reading point. Hold shift for a larger move.</span>
      <div
        className="lens-instrument__stage"
        onPointerDown={moveProbe}
        onPointerMove={moveProbe}
        onPointerLeave={() => setProbe({ x: 50, y: 48 })}
        onKeyDown={nudgeProbe}
        tabIndex={0}
        role="group"
        aria-label="Lens stage"
        aria-describedby="lens-keyboard-help"
      >
        <span className="lens-instrument__label lens-instrument__label--top" aria-hidden="true">field / {note.index}</span>
        <span className="lens-instrument__label lens-instrument__label--side" aria-hidden="true">x / word · y / intent</span>
        <svg className="lens-instrument__drawing" viewBox="0 0 360 360" aria-hidden="true">
          <circle cx="180" cy="170" r="122" />
          <ellipse cx="180" cy="170" rx="146" ry="58" transform="rotate(-19 180 170)" />
          <path d="M45 237c84 76 202 77 270-13" />
          <line x1="180" y1="28" x2="180" y2="312" />
          <line x1="34" y1="170" x2="326" y2="170" />
          <path d="M101 87c38 19 87 24 137 11" />
        </svg>
        <div className="lens-instrument__crosshair" aria-hidden="true"><i /><i /></div>
        <div className="lens-instrument__probe" style={{ left: `${probe.x}%`, top: `${probe.y}%` }} aria-hidden="true" />
        <div className="lens-disc" key={note.id}>
          <span>under the lens</span>
          <strong>{note.label}</strong>
          <em>{note.gloss}</em>
        </div>
        <div className="lens-instrument__nodes" aria-hidden="true">
          <span className="lens-node lens-node--m3">M3</span>
          <span className={`lens-node lens-node--good ${note.id === 'good' ? 'is-current' : ''}`}>good</span>
          <span className={`lens-node lens-node--yet ${note.id === 'yet' ? 'is-current' : ''}`}>yet?</span>
        </div>
        <span className="lens-instrument__hint" aria-hidden="true">drag / arrows to probe</span>
      </div>
      <div className="lens-instrument__footer">
        <div>
          <span>current reading</span>
          <strong>{note.title}</strong>
        </div>
        <span className="lens-instrument__voice">{voiceName} voice</span>
      </div>
    </aside>
  )
}

function WordGlyph({ id }: { id: WordId }) {
  if (id === 'm3') {
    return (
      <svg className="word-glyph word-glyph--m3" viewBox="0 0 220 160" aria-hidden="true">
        <path d="M32 126V34l78 92V34M146 34v92M146 34h58M146 70h48" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square" />
        <circle cx="146" cy="126" r="5" fill="currentColor" />
      </svg>
    )
  }
  if (id === 'good') {
    return (
      <svg className="word-glyph word-glyph--good" viewBox="0 0 220 160" aria-hidden="true">
        <path d="M28 126 78 32l50 94M48 89h61M128 126V32h42c25 0 37 14 37 34 0 19-12 34-37 34h-42M128 100h47" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square" strokeLinejoin="miter" />
      </svg>
    )
  }
  return (
    <svg className="word-glyph word-glyph--yet" viewBox="0 0 220 160" aria-hidden="true">
      <path d="M39 43c7-17 22-25 40-25 24 0 39 13 39 34 0 19-11 27-27 38-13 9-18 15-18 27M73 142v4" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square" />
      <path d="M139 33v94M139 127h49" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square" />
    </svg>
  )
}
