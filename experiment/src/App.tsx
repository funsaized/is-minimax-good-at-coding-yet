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
  { id: 'field-notes', label: 'pressure points' },
  { id: 'voices', label: 'type trials' },
  { id: 'answer', label: 'short answer' },
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

const clampProbe = (value: number) => Math.max(9, Math.min(91, value))

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
    setAnnouncement(next ? 'The short answer is revealed.' : 'The short answer is covered again.')
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
      { rootMargin: '-18% 0px -67% 0px', threshold: [0.05, 0.2, 0.5] },
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
    <div className={`field-guide field-guide--${voice}`}>
      <div className="field-guide__atmosphere" aria-hidden="true">
        <span className="field-guide__sun" />
        <span className="field-guide__contour field-guide__contour--one" />
        <span className="field-guide__contour field-guide__contour--two" />
        <span className="field-guide__grain" />
      </div>
      <a className="skip-link" href="#question">Skip to the question</a>

      <header className="topbar">
        <a className="wordmark" href="#question" aria-label="M3 frontend field note, back to the question">
          <span className="wordmark__seal" aria-hidden="true"><i>M3</i></span>
          <span className="wordmark__words">
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
              <span>{String(index + 1).padStart(2, '0')}</span>
              {item.label}
            </a>
          ))}
        </nav>

        <div className="voice-picker" role="group" aria-label="Set the page's type voice">
          <span className="voice-picker__label">type voice</span>
          <div className="voice-picker__set">
            {VOICES.map(item => (
              <button
                key={item.id}
                type="button"
                className={`voice-key voice-key--${item.id} ${voice === item.id ? 'is-active' : ''}`}
                onClick={() => selectVoice(item.id)}
                aria-pressed={voice === item.id}
                aria-label={`Use the ${item.name} type voice`}
              >
                {item.letter}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="page-shell">
        <section id="question" className="hero-section" aria-labelledby="question-title">
          <div className="hero-section__rail">
            <span><i className="signal-dot" aria-hidden="true" /> working title</span>
            <span>the sentence, under a lens</span>
            <span>choose a phrase <b aria-hidden="true">↘</b></span>
          </div>

          <div className="hero-section__body">
            <div className="hero-copy">
              <div className="hero-copy__folio">
                <span>specimen / 01</span>
                <span>read the shape, not the claim</span>
              </div>
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
                  </button>{' '}
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
                <span className="title-line title-line--three">
                  <span>frontend </span>
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

              <div className="title-annotation" aria-hidden="true">
                <span>the pause is part of the point</span>
                <svg viewBox="0 0 160 34" focusable="false">
                  <path d="M3 24c29 9 49-8 76-6 24 2 38 14 77 1" />
                  <path d="m143 14 12 5-12 6" />
                </svg>
              </div>

              <p className="hero-lede">One question, three pressure points. Treat the sentence as a small interface: choose a phrase, change the type temperature, and notice what earns the second look.</p>

              <div className="hero-actions">
                <a className="primary-link" href="#field-notes">
                  <span>open the field notes</span>
                  <ArrowIcon />
                </a>
                <button type="button" className="voice-cycle" onClick={cycleVoice} aria-keyshortcuts="Shift+V">
                  <span>change the voice</span>
                  <kbd>shift</kbd><span>+</span><kbd>v</kbd>
                </button>
              </div>

              <p className="interaction-cue"><span className="interaction-cue__line" aria-hidden="true" /> select a phrase / move the lens</p>
            </div>

            <SignalMap note={activeNote} voiceName={activeVoice.name} onSelect={selectWord} />
          </div>

          <div className="hero-section__footer">
            <span><i className="hero-section__signal" aria-hidden="true" /> a title in three distances</span>
            <span>active phrase <strong>{activeNote.label}</strong></span>
            <span>look once, then look again</span>
          </div>
        </section>

        <div className="field-divider" aria-hidden="true">
          <span />
          <svg viewBox="0 0 120 28">
            <path d="M4 14h33M83 14h33M41 8l7 6-7 6M79 8l-7 6 7 6" />
            <circle cx="60" cy="14" r="3" />
          </svg>
          <span />
        </div>

        <section id="field-notes" className="pressure-section reveal" aria-labelledby="reading-title">
          <SectionIntro
            number="01"
            titleId="reading-title"
            eyebrow="pressure points"
            title={<>The sentence has <em>somewhere to stand.</em></>}
            lede="M3 names the maker. “good at” names the standard. “yet?” protects the honest pause. Choose a phrase to read its job."
          />

          <div className="pressure-layout">
            <div className="phrase-index" role="group" aria-label="Choose a phrase from the question">
              <div className="phrase-index__heading">
                <span>phrase index</span>
                <span aria-hidden="true">01—03</span>
              </div>
              <div className="phrase-index__list">
                {NOTES.map(note => (
                  <button
                    key={note.id}
                    type="button"
                    className={`phrase-choice phrase-choice--${note.id} ${selectedWord === note.id ? 'is-selected' : ''} ${hoveredWord === note.id ? 'is-hovered' : ''}`}
                    onClick={() => selectWord(note.id)}
                    onMouseEnter={() => setHoveredWord(note.id)}
                    onMouseLeave={() => setHoveredWord(null)}
                    onFocus={() => setHoveredWord(note.id)}
                    onBlur={() => setHoveredWord(null)}
                    aria-pressed={selectedWord === note.id}
                  >
                    <span className="phrase-choice__index">{note.index}</span>
                    <span className="phrase-choice__name">{note.label}</span>
                    <span className="phrase-choice__title">{note.title}</span>
                    <span className="phrase-choice__arrow" aria-hidden="true">↗</span>
                  </button>
                ))}
              </div>
              <div className="phrase-index__footer"><span>one sentence / three distances</span><span aria-hidden="true">↘</span></div>
            </div>

            <article className={`note-sheet note-sheet--${activeNote.id}`} key={activeNote.id} aria-live="polite">
              <div className="note-sheet__topline">
                <span>close read / {activeNote.index}</span>
                <span className="note-sheet__folio" aria-hidden="true">{activeNote.folio}</span>
              </div>
              <div className="note-sheet__body">
                <p className="note-sheet__kicker">{activeNote.gloss}</p>
                <h3>{activeNote.label}</h3>
                <p className="note-sheet__copy">{activeNote.body}</p>
                <div className="note-sheet__prompt"><b aria-hidden="true">↳</b> {activeNote.prompt}</div>
              </div>
              <WordGlyph id={activeNote.id} />
              <div className="note-sheet__footer">
                <span>{activeNote.editor}</span>
                <span>margin note / {activeNote.folio}</span>
              </div>
            </article>
          </div>
        </section>

        <section id="voices" className="voices-section reveal" aria-labelledby="trials-title">
          <SectionIntro
            number="02"
            titleId="trials-title"
            eyebrow="three type trials"
            title={<>One sentence.<em>Three handwritings.</em></>}
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
                    <span className="voice-card__state"><i aria-hidden="true" />{isActive ? 'selected voice' : 'set this voice'}</span>
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
              <span className="cover-button__icon" aria-hidden="true"><ArrowIcon /></span>
              <span>{answerOpen ? 'cover the answer' : 'lift the answer'}</span>
              {answerOpen && <kbd>esc</kbd>}
            </button>
          </div>

          <div className={`answer-card ${answerOpen ? 'is-open' : ''}`}>
            <div className="answer-card__topline">
              <span>short answer / no scorecard</span>
              <span aria-hidden="true">{answerOpen ? '●' : '○'}</span>
            </div>
            <div id="answer-window" className="answer-window" aria-live="polite">
              {answerOpen ? (
                <div className="answer-window__content">
                  <button ref={answerCloseRef} type="button" className="answer-close" onClick={toggleAnswer} aria-label="Cover the answer again">×</button>
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

function ArrowIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="M3 10h13M10.5 4.5 16 10l-5.5 5.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function SignalMap({ note, voiceName, onSelect }: { note: Note; voiceName: string; onSelect: (id: WordId) => void }) {
  const [probe, setProbe] = useState<ProbePosition>({ x: 50, y: 48 })

  const moveProbe = (event: ReactPointerEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect()
    if (!bounds.width || !bounds.height) return
    const x = ((event.clientX - bounds.left) / bounds.width) * 100
    const y = ((event.clientY - bounds.top) / bounds.height) * 100
    setProbe({ x: clampProbe(x), y: clampProbe(y) })
  }

  const beginProbe = (event: ReactPointerEvent<HTMLDivElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId)
    moveProbe(event)
  }

  const dragProbe = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.buttons === 0) return
    moveProbe(event)
  }

  const endProbe = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
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
    <aside className={`signal-map signal-map--${note.id}`} aria-label="Interactive close-reading map">
      <div className="signal-map__header">
        <span>phrase lens / {note.index}</span>
        <button type="button" className="map-reset" onPointerDown={event => event.stopPropagation()} onClick={() => setProbe({ x: 50, y: 48 })}>center point</button>
      </div>
      <span className="sr-only" id="map-keyboard-help">Use the arrow keys to move the reading point. Hold shift for a larger move.</span>
      <div
        className="signal-map__stage"
        onPointerDown={beginProbe}
        onPointerMove={dragProbe}
        onPointerUp={endProbe}
        onPointerCancel={endProbe}
        onKeyDown={nudgeProbe}
        tabIndex={0}
        role="group"
        aria-label="Reading point stage"
        aria-describedby="map-keyboard-help"
      >
        <span className="signal-map__label signal-map__label--top" aria-hidden="true">field / {note.index}</span>
        <span className="signal-map__label signal-map__label--side" aria-hidden="true">x / word · y / intent</span>
        <svg className="signal-map__drawing" viewBox="0 0 420 360" aria-hidden="true">
          <circle cx="210" cy="176" r="112" />
          <ellipse cx="210" cy="176" rx="170" ry="68" transform="rotate(-18 210 176)" />
          <path d="M40 236c91 76 222 78 337-4" />
          <line x1="210" y1="24" x2="210" y2="329" />
          <line x1="31" y1="176" x2="389" y2="176" />
          <path d="M110 93c45 22 105 27 169 10" />
        </svg>
        <div className="signal-map__crosshair" aria-hidden="true"><i /><i /></div>
        <div className="signal-map__probe" style={{ left: `${probe.x}%`, top: `${probe.y}%` }} aria-hidden="true" />
        <div className="signal-map__center" key={note.id}>
          <span>under the lens</span>
          <strong>?</strong>
          <em>{note.label}</em>
        </div>
        <div className="signal-map__nodes">
          {NOTES.map(item => (
            <button
              key={item.id}
              type="button"
              className={`map-node map-node--${item.id} ${note.id === item.id ? 'is-current' : ''}`}
              onPointerDown={event => event.stopPropagation()}
              onClick={() => onSelect(item.id)}
              aria-label={`Move the reading point to ${item.label}`}
              aria-pressed={note.id === item.id}
            >
              {item.label}
            </button>
          ))}
        </div>
        <span className="signal-map__hint" aria-hidden="true">drag / arrows to probe</span>
      </div>
      <div className="signal-map__footer">
        <div>
          <span>current reading</span>
          <strong>{note.title}</strong>
        </div>
        <span>{voiceName} voice</span>
      </div>
    </aside>
  )
}

function WordGlyph({ id }: { id: WordId }) {
  if (id === 'm3') {
    return (
      <svg className="word-glyph word-glyph--m3" viewBox="0 0 240 170" aria-hidden="true">
        <path d="M32 132V38l80 94V38M151 38v94M151 38h58M151 73h48" />
        <circle cx="151" cy="132" r="5" />
      </svg>
    )
  }
  if (id === 'good') {
    return (
      <svg className="word-glyph word-glyph--good" viewBox="0 0 240 170" aria-hidden="true">
        <path d="M30 132 82 34l52 98M50 92h64M139 132V34h45c27 0 40 15 40 36s-13 36-40 36h-45M139 103h50" />
      </svg>
    )
  }
  return (
    <svg className="word-glyph word-glyph--yet" viewBox="0 0 240 170" aria-hidden="true">
      <path d="M42 47c8-18 24-27 43-27 25 0 42 14 42 36 0 21-12 30-29 42-14 10-20 17-20 29M78 149v5" />
      <path d="M150 36v96M150 132h50" />
    </svg>
  )
}
