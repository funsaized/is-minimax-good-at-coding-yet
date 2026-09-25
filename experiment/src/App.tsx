import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { NOTES, type WordId } from './notes'

export type VoiceId = 'quiet' | 'human' | 'bold'

type VoiceSpec = {
  id: VoiceId
  letter: string
  name: string
  manner: string
  sample: string
  detail: string
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
    manner: 'soft italic / open',
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
  const activeNote = NOTES.find(note => note.id === activeWord) ?? NOTES[1]
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
    <div className={`folio folio--${voice}`}>
      <div className="paper-fleck" aria-hidden="true" />
      <a className="skip-link" href="#question">Skip to the question</a>

      <header className="topbar">
        <a className="brand" href="#question" aria-label="M3 frontend type trial, back to the question">
          <span className="brand__stamp" aria-hidden="true">m³</span>
          <span className="brand__name">
            <strong>frontend type trial</strong>
            <small>question under examination</small>
          </span>
        </a>

        <nav className="site-nav" aria-label="Page sections">
          {NAV_ITEMS.map(item => (
            <a
              key={item.id}
              className={activeSection === item.id ? 'is-active' : ''}
              href={`#${item.id}`}
              aria-current={activeSection === item.id ? 'location' : undefined}
            >
              <span>{item.label}</span>
            </a>
          ))}
        </nav>

        <div className="mode-switcher" role="group" aria-label="Set the page's type voice">
          <span className="mode-switcher__label">voice</span>
          <div className="mode-switcher__set">
            {VOICES.map(item => (
              <button
                key={item.id}
                type="button"
                className={`mode-button mode-button--${item.id} ${voice === item.id ? 'is-active' : ''}`}
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
        <section id="question" className="question-section" aria-labelledby="question-title">
          <div className="question-poster">
            <div className="poster-meta" aria-hidden="true">
              <span>frontend / type trial</span>
              <span>one question under a loupe</span>
              <span>read · touch · decide</span>
            </div>

            <div className="question-layout">
              <div className="question-copy">
                <p className="poster-kicker"><span aria-hidden="true">✳</span>Not a benchmark. A closer look.</p>
                <h1 id="question-title" className="question-title">
                  <span className="title-row title-row--one">is Minimax</span>{' '}
                  <span className="title-row title-row--two">
                    <button
                      type="button"
                      className={`title-word title-word--m3 ${selectedWord === 'm3' ? 'is-selected' : ''}`}
                      onClick={() => selectWord('m3')}
                      onMouseEnter={() => setHoveredWord('m3')}
                      onMouseLeave={() => setHoveredWord(null)}
                      onFocus={() => setHoveredWord('m3')}
                      onBlur={() => setHoveredWord(null)}
                      aria-pressed={selectedWord === 'm3'}
                    >
                      M3
                    </button>
                  </span>{' '}
                  <span className="title-row title-row--three">
                    <button
                      type="button"
                      className={`title-word title-word--good ${selectedWord === 'good' ? 'is-selected' : ''}`}
                      onClick={() => selectWord('good')}
                      onMouseEnter={() => setHoveredWord('good')}
                      onMouseLeave={() => setHoveredWord(null)}
                      onFocus={() => setHoveredWord('good')}
                      onBlur={() => setHoveredWord(null)}
                      aria-pressed={selectedWord === 'good'}
                    >
                      good at
                    </button>
                  </span>{' '}
                  <span className="title-row title-row--four">frontend</span>{' '}
                  <span className="title-row title-row--five">
                    <button
                      type="button"
                      className={`title-word title-word--yet ${selectedWord === 'yet' ? 'is-selected' : ''}`}
                      onClick={() => selectWord('yet')}
                      onMouseEnter={() => setHoveredWord('yet')}
                      onMouseLeave={() => setHoveredWord(null)}
                      onFocus={() => setHoveredWord('yet')}
                      onBlur={() => setHoveredWord(null)}
                      aria-pressed={selectedWord === 'yet'}
                    >
                      yet?
                    </button>
                    <span className="title-caret" aria-hidden="true" />
                  </span>
                </h1>

                <div className="question-copy__footer">
                  <p>Judged by what is here: a point of view, a clear reading path, and motion that knows when to leave the room.</p>
                  <div className="question-actions">
                    <a className="primary-link" href="#field-notes">
                      <span>read the close-up</span>
                      <ArrowIcon />
                    </a>
                    <button type="button" className="voice-cycle" onClick={cycleVoice} aria-keyshortcuts="Shift+V">
                      <span>try another voice</span>
                      <kbd>shift</kbd><span>+</span><kbd>v</kbd>
                    </button>
                  </div>
                </div>
              </div>

              <Loupe note={activeNote} voiceName={activeVoice.name} />
            </div>

            <div className="poster-footer">
              <p id="word-note-instruction"><span aria-hidden="true">↖</span> Touch a colored word to move the loupe.</p>
              <div className="poster-footer__mode">
                <span>page voice</span>
                <strong>{activeVoice.name}</strong>
              </div>
              <div className="poster-stamp" aria-hidden="true">
                <span>point of view</span>
                <strong>?</strong>
                <span>not a verdict</span>
              </div>
            </div>
          </div>
        </section>

        <PrintRule />

        <section id="field-notes" className="reading-section reveal" aria-labelledby="reading-title">
          <SectionIntro
            titleId="reading-title"
            eyebrow="close reading"
            title={<>The sentence has <em>pressure points.</em></>}
            lede="M3 names the maker, “good at” names the standard, and “yet?” protects the honest pause. Choose a phrase to read its job."
          />

          <div className="reading-grid">
            <div className="note-index" role="group" aria-label="Choose a phrase from the question">
              {NOTES.map(note => (
                <button
                  key={note.id}
                  type="button"
                  className={`note-tab ${selectedWord === note.id ? 'is-selected' : ''} ${hoveredWord === note.id ? 'is-hovered' : ''}`}
                  onClick={() => selectWord(note.id)}
                  onMouseEnter={() => setHoveredWord(note.id)}
                  onMouseLeave={() => setHoveredWord(null)}
                  onFocus={() => setHoveredWord(note.id)}
                  onBlur={() => setHoveredWord(null)}
                  aria-pressed={selectedWord === note.id}
                >
                  <span className="note-tab__number">{note.index}</span>
                  <span className="note-tab__word">{note.label}</span>
                  <span className="note-tab__gloss">{note.gloss}</span>
                  <span className="note-tab__arrow" aria-hidden="true">↗</span>
                </button>
              ))}
            </div>

            <article className="note-sheet" key={activeNote.id} aria-live="polite">
              <div className="note-sheet__topline">
                <span>phrase / {activeNote.index}</span>
                <span aria-hidden="true">{activeNote.id === 'm3' ? '∿' : activeNote.id === 'good' ? '↗' : '?'}</span>
              </div>
              <div className="note-sheet__body">
                <span className="note-sheet__phrase">{activeNote.label}</span>
                <p className="note-sheet__kicker">{activeNote.title}</p>
                <blockquote>{activeNote.body}</blockquote>
              </div>
              <div className="note-sheet__footer">
                <span>{activeNote.prompt}</span>
                <span>{activeNote.editor}</span>
              </div>
              <span className="note-sheet__ghost" aria-hidden="true">{activeNote.label}</span>
            </article>
          </div>
        </section>

        <PrintRule />

        <section id="voices" className="trials-section reveal" aria-labelledby="trials-title">
          <SectionIntro
            titleId="trials-title"
            eyebrow="three type trials"
            title={<>Same words. <em>Different manners.</em></>}
            lede="Choose a specimen and the whole page changes its voice. The words stay put; the personality changes around them."
          />

          <div className="trial-grid">
            {VOICES.map(item => {
              const isActive = item.id === voice
              return (
                <article key={item.id} className={`trial-card trial-card--${item.id} ${isActive ? 'is-active' : ''}`}>
                  <button
                    type="button"
                    onClick={() => selectVoice(item.id)}
                    aria-pressed={isActive}
                    aria-label={`Set the page in the ${item.name} voice`}
                  >
                    <span className="trial-card__topline">
                      <span className="trial-card__letter">{item.letter}</span>
                      <span>{item.manner}</span>
                      <span className="trial-card__arrow" aria-hidden="true">↗</span>
                    </span>
                    <span className="trial-card__name">{item.name}</span>
                    <span className={`trial-card__sample trial-card__sample--${item.id}`}>{item.sample}</span>
                    <span className="trial-card__detail">{item.detail}</span>
                    <span className="trial-card__state">
                      <i aria-hidden="true" />
                      {isActive ? 'now setting the page' : 'apply this voice'}
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

        <section id="answer" className="answer-section reveal" aria-labelledby="answer-title">
          <div className="answer-intro">
            <p className="answer-intro__eyebrow"><span aria-hidden="true">✳</span> the useful answer</p>
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

          <div className={`answer-sheet ${answerOpen ? 'is-open' : ''}`}>
            <div className="answer-sheet__topline">
              <span>answer / no scorecard</span>
              <span aria-hidden="true">{answerOpen ? '●' : '○'}</span>
            </div>
            <div id="answer-window" className="answer-window" aria-live="polite">
              {answerOpen ? (
                <div className="answer-window__content">
                  <button ref={answerCloseRef} type="button" className="answer-close" onClick={toggleAnswer} aria-label="Cover the answer again">
                    <span aria-hidden="true">×</span>
                  </button>
                  <span className="answer-window__yes">yes.</span>
                  <h3>When restraint and character pull in the same direction.</h3>
                  <p>A useful frontend has a point of view you can feel, a hierarchy you can read, and interactions that reward attention without demanding it.</p>
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
        <span>self-contained / client-side / type in motion</span>
      </footer>

      <span className="sr-only" aria-live="polite">{announcement}</span>
      <span className="sr-only">Current type voice: {activeVoice.name}. Active phrase: {activeNote.label}.</span>
    </div>
  )
}

function SectionIntro({ titleId, eyebrow, title, lede }: { titleId: string; eyebrow: string; title: ReactNode; lede: string }) {
  return (
    <header className="section-intro">
      <div>
        <p className="eyebrow"><span aria-hidden="true">✳</span>{eyebrow}</p>
        <h2 id={titleId}>{title}</h2>
      </div>
      <p className="section-intro__lede">{lede}</p>
    </header>
  )
}

function PrintRule() {
  return (
    <div className="print-rule" aria-hidden="true">
      <span />
      <svg viewBox="0 0 74 24">
        <path d="M2 12h23M49 12h23" fill="none" stroke="currentColor" strokeWidth="1" />
        <path d="m31 6 6 6-6 6M43 6l-6 6 6 6" fill="none" stroke="currentColor" strokeWidth="1" />
        <circle cx="37" cy="12" r="2" fill="currentColor" />
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

function Loupe({ note, voiceName }: { note: (typeof NOTES)[number]; voiceName: string }) {
  return (
    <aside className="loupe-card" aria-label="Close reading loupe">
      <div className="loupe-card__header">
        <span>close reading</span>
        <span aria-hidden="true">word / lens</span>
      </div>
      <div className="loupe-stage">
        <svg className="loupe-stage__drawing" viewBox="0 0 320 330" aria-hidden="true">
          <circle cx="160" cy="156" r="115" />
          <ellipse cx="160" cy="156" rx="137" ry="51" transform="rotate(-18 160 156)" />
          <path d="M41 217c72 72 194 79 249-11" />
          <line x1="160" y1="25" x2="160" y2="288" />
          <line x1="28" y1="156" x2="292" y2="156" />
        </svg>
        <span className="loupe-stage__coordinate loupe-stage__coordinate--x" aria-hidden="true">x / word</span>
        <span className="loupe-stage__coordinate loupe-stage__coordinate--y" aria-hidden="true">y / intent</span>
        <div className="loupe-lens" key={note.id}>
          <span>under the lens</span>
          <strong>{note.label}</strong>
          <em>{note.gloss}</em>
        </div>
        <span className="loupe-stage__dot" aria-hidden="true" />
      </div>
      <div className="loupe-card__footer">
        <div>
          <span>current reading</span>
          <strong>{note.title}</strong>
        </div>
        <span className="loupe-card__voice">{voiceName} voice</span>
      </div>
    </aside>
  )
}
