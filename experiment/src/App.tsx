import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from 'react'
import { NOTES, type WordId } from './notes'

export type VoiceId = 'quiet' | 'human' | 'bold'

type VoiceSpec = {
  id: VoiceId
  letter: string
  name: string
  tagline: string
  sample: string
  detail: string
}

const TITLE = 'is Minimax M3 good at frontend yet?'

const VOICES: VoiceSpec[] = [
  {
    id: 'quiet',
    letter: 'A',
    name: 'quiet cut',
    tagline: 'a smaller kind of confidence',
    sample: 'is m3 good at frontend yet?',
    detail: 'Leave the answer in the margins until the reader leans in.',
  },
  {
    id: 'human',
    letter: 'B',
    name: 'human hand',
    tagline: 'warmth without noise',
    sample: 'is M3 good at frontend yet?',
    detail: 'A page can feel made by someone when its edges stay a little soft.',
  },
  {
    id: 'bold',
    letter: 'C',
    name: 'bold signal',
    tagline: 'a little less polite',
    sample: 'IS M3 GOOD AT FRONTEND YET?',
    detail: 'Say the whole thing once. Then leave enough space for the question to matter.',
  },
]

const NAV_ITEMS = [
  { id: 'question', label: 'question' },
  { id: 'field-notes', label: 'field notes' },
  { id: 'voices', label: 'voices' },
  { id: 'answer', label: 'the pause' },
] as const

const NEXT_VOICE: Record<VoiceId, VoiceId> = { quiet: 'human', human: 'bold', bold: 'quiet' }
const VOICE_NAME: Record<VoiceId, string> = { quiet: 'quiet cut', human: 'human hand', bold: 'bold signal' }

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
  const shellStyle = { '--tone': `var(--${voice})` } as CSSProperties

  const selectWord = useCallback((id: WordId) => {
    setSelectedWord(id)
    const note = NOTES.find(item => item.id === id)
    if (note) setAnnouncement(`${note.title}. ${note.gloss}.`)
  }, [])

  const selectVoice = useCallback((id: VoiceId) => {
    setVoice(id)
    setAnnouncement(`The page is set in ${VOICE_NAME[id]}.`)
  }, [])

  const cycleVoice = useCallback(() => {
    setVoice(current => {
      const next = NEXT_VOICE[current]
      setAnnouncement(`The page is set in ${VOICE_NAME[next]}.`)
      return next
    })
  }, [])

  const toggleAnswer = useCallback(() => {
    setAnswerOpen(current => {
      const next = !current
      setAnnouncement(next ? 'The answer is unfolded.' : 'The answer is folded back.')
      if (next) {
        window.requestAnimationFrame(() => answerCloseRef.current?.focus())
      } else {
        window.requestAnimationFrame(() => answerTriggerRef.current?.focus())
      }
      return next
    })
  }, [])

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
      { rootMargin: '-28% 0px -58% 0px', threshold: [0.08, 0.2, 0.5] },
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
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in')
            observer.unobserve(entry.target)
          }
        })
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.08 },
    )
    reveals.forEach(element => observer.observe(element))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    let frame = 0
    const updateProgress = () => {
      const scrollRange = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
      const progress = Math.min(1, Math.max(0, window.scrollY / scrollRange))
      document.documentElement.style.setProperty('--scroll-progress', progress.toFixed(3))
      frame = 0
    }
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(updateProgress)
    }
    updateProgress()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])

  useEffect(() => {
    if (!answerOpen) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        toggleAnswer()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [answerOpen, toggleAnswer])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented) return
      const target = event.target as HTMLElement | null
      const tag = target?.tagName.toLowerCase()
      if (tag === 'input' || tag === 'textarea' || target?.isContentEditable) return
      if (event.shiftKey && (event.key === 'V' || event.key === 'v')) {
        event.preventDefault()
        cycleVoice()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [cycleVoice])

  const onOrbitMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect()
    const x = Math.min(88, Math.max(12, ((event.clientX - bounds.left) / bounds.width) * 100))
    const y = Math.min(84, Math.max(16, ((event.clientY - bounds.top) / bounds.height) * 100))
    event.currentTarget.style.setProperty('--orbit-x', `${x}%`)
    event.currentTarget.style.setProperty('--orbit-y', `${y}%`)
  }

  const onOrbitLeave = (event: ReactPointerEvent<HTMLDivElement>) => {
    event.currentTarget.style.setProperty('--orbit-x', '50%')
    event.currentTarget.style.setProperty('--orbit-y', '50%')
  }

  return (
    <div className={`app app--${voice}`} style={shellStyle}>
      <div className="app__ambient app__ambient--top" aria-hidden="true" />
      <div className="app__ambient app__ambient--bottom" aria-hidden="true" />
      <div className="app__grain" aria-hidden="true" />
      <div className="app__progress" aria-hidden="true"><span /></div>
      <a className="skip-link" href="#question">Skip to the question</a>

      <header className="site-header">
        <a className="brand" href="#question" aria-label="M3 frontend field note, home">
          <span className="brand__mark" aria-hidden="true">
            <svg viewBox="0 0 40 40" role="presentation">
              <rect x="1" y="1" width="38" height="38" rx="12" fill="currentColor" />
              <path d="M11 27V13h4.2l4.8 7 4.8-7H29v14h-4v-7.7l-5 7.1-5-7.1V27z" fill="var(--night)" />
              <circle cx="31" cy="9" r="2" fill="var(--coral)" />
            </svg>
          </span>
          <span className="brand__copy">
            <strong>frontend / field note</strong>
            <small>an experiment in making room</small>
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
              {item.label}
            </a>
          ))}
        </nav>

        <div className="header-note" aria-label="Page premise">
          <span className="header-note__dot" aria-hidden="true" />
          <span>one question</span>
          <span className="header-note__slash" aria-hidden="true">/</span>
          <span>three readings</span>
        </div>
      </header>

      <aside className="side-index" aria-label="On this page">
        <span className="side-index__label">on this page</span>
        <div className="side-index__list">
          {NAV_ITEMS.map((item, index) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={activeSection === item.id ? 'is-active' : ''}
              aria-current={activeSection === item.id ? 'location' : undefined}
            >
              <span className="side-index__dot" aria-hidden="true" />
              <span className="side-index__text">{item.label}</span>
              <span className="side-index__number">0{index + 1}</span>
            </a>
          ))}
        </div>
        <span className="side-index__rule" aria-hidden="true" />
        <span className="side-index__hint">read slowly</span>
      </aside>

      <main className="page-content">
        <section id="question" className="hero-section reveal" aria-labelledby="question-title">
          <div className="hero-section__topline">
            <span className="eyebrow"><span className="eyebrow__dash" />a small test of judgment</span>
            <span className="hero-section__aside">frontend / open question</span>
          </div>

          <div className="hero-card">
            <div className="hero-card__copy">
              <span className="hero-card__chapter">the first impression</span>
              <h1 id="question-title" className={`hero-title hero-title--${voice}`} aria-label={TITLE}>
                <span className="hero-title__line">is Minimax </span>
                <button
                  type="button"
                  className={`title-token title-token--model ${selectedWord === 'm3' ? 'is-selected' : ''}`}
                  onClick={() => selectWord('m3')}
                  onMouseEnter={() => setHoveredWord('m3')}
                  onMouseLeave={() => setHoveredWord(null)}
                  onFocus={() => setHoveredWord('m3')}
                  onBlur={() => setHoveredWord(null)}
                  aria-label="M3 — open margin note"
                >
                  M3
                </button>
                <span className="hero-title__line" aria-hidden="true"> </span>
                <button
                  type="button"
                  className={`title-token title-token--good ${selectedWord === 'good' ? 'is-selected' : ''}`}
                  onClick={() => selectWord('good')}
                  onMouseEnter={() => setHoveredWord('good')}
                  onMouseLeave={() => setHoveredWord(null)}
                  onFocus={() => setHoveredWord('good')}
                  onBlur={() => setHoveredWord(null)}
                  aria-label="good at — open margin note"
                >
                  good at
                </button>
                <span className="hero-title__line"> frontend </span>
                <button
                  type="button"
                  className={`title-token title-token--yet ${selectedWord === 'yet' ? 'is-selected' : ''}`}
                  onClick={() => selectWord('yet')}
                  onMouseEnter={() => setHoveredWord('yet')}
                  onMouseLeave={() => setHoveredWord(null)}
                  onFocus={() => setHoveredWord('yet')}
                  onBlur={() => setHoveredWord(null)}
                  aria-label="yet — open margin note"
                >
                  yet<span className="title-token__question">?</span>
                </button>
              </h1>
              <p className="hero-card__lede">
                A page can answer before it performs. This one is trying to find the exact balance:
                enough character to feel authored, enough restraint to let the question stay yours.
              </p>
              <div className="hero-card__actions">
                <a className="button button--ink" href="#field-notes">
                  <span>read the field notes</span>
                  <svg viewBox="0 0 18 18" aria-hidden="true">
                    <path d="M3 9h11M9.5 4.5 14 9l-4.5 4.5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
                <span className="hero-card__hint"><span className="hint-dot" aria-hidden="true" />tap a word to open its margin note</span>
              </div>
            </div>

            <OrbitCard voice={voice} onVoice={selectVoice} onMove={onOrbitMove} onLeave={onOrbitLeave} />
          </div>

          <div className="hero-section__footnote">
            <span><span className="footnote-mark" aria-hidden="true">↳</span> the question is the interface</span>
            <span>the answer is allowed to take its time</span>
          </div>
        </section>

        <div className="page-divider reveal" aria-hidden="true">
          <span />
          <svg viewBox="0 0 100 8" preserveAspectRatio="none">
            <path d="M0 4h36m28 0h36" fill="none" stroke="currentColor" strokeWidth=".7" strokeDasharray="1 3" />
            <circle cx="50" cy="4" r="2" fill="currentColor" />
          </svg>
          <span />
        </div>

        <section id="field-notes" className="field-section reveal" aria-labelledby="field-title">
          <div className="section-heading">
            <div>
              <span className="eyebrow"><span className="eyebrow__dash" />the margin notes</span>
              <h2 id="field-title">Three words.<br /><em>One point of view.</em></h2>
            </div>
            <p className="section-heading__lede">
              The sentence is a tiny instrument. Touch a word to hear the decision hiding underneath it.
            </p>
          </div>

          <div className="word-lab">
            <div className="word-list" role="list" aria-label="Question words">
              {NOTES.map(note => (
                <button
                  key={note.id}
                  type="button"
                  className={`word-row ${selectedWord === note.id ? 'is-selected' : ''} ${hoveredWord === note.id ? 'is-hovered' : ''}`}
                  onClick={() => selectWord(note.id)}
                  onMouseEnter={() => setHoveredWord(note.id)}
                  onMouseLeave={() => setHoveredWord(null)}
                  onFocus={() => setHoveredWord(note.id)}
                  onBlur={() => setHoveredWord(null)}
                  aria-pressed={selectedWord === note.id}
                >
                  <span className="word-row__index">{note.index}</span>
                  <span className="word-row__name">{note.label}</span>
                  <span className="word-row__gloss">{note.gloss}</span>
                  <span className="word-row__arrow" aria-hidden="true">↗</span>
                </button>
              ))}
            </div>

            <article className="margin-note" key={activeNote.id} aria-live="polite">
              <div className="margin-note__top">
                <span>margin note / {activeNote.folio}</span>
                <span className="margin-note__mark">{activeNote.id === 'm3' ? '⌇' : activeNote.id === 'good' ? '∧' : '?'}</span>
              </div>
              <div className="margin-note__body">
                <p className="margin-note__kicker">{activeNote.title}</p>
                <h3>{activeNote.gloss}</h3>
                <p>{activeNote.body}</p>
              </div>
              <div className="margin-note__footer">
                <span>{activeNote.prompt}</span>
                <span>{activeNote.seen}</span>
              </div>
            </article>
          </div>
        </section>

        <div className="page-divider page-divider--short reveal" aria-hidden="true"><span /><span /></div>

        <section id="voices" className="voices-section reveal" aria-labelledby="voices-title">
          <div className="section-heading section-heading--voices">
            <div>
              <span className="eyebrow"><span className="eyebrow__dash" />the same line, three voices</span>
              <h2 id="voices-title">Change the <em>temperature.</em></h2>
            </div>
            <p className="section-heading__lede">
              Typography is not a coat of paint. It changes what the reader is asked to do.
            </p>
          </div>

          <div className="voice-grid">
            {VOICES.map(item => {
              const isActive = item.id === voice
              return (
                <article key={item.id} className={`voice-card voice-card--${item.id} ${isActive ? 'is-active' : ''}`}>
                  <button type="button" onClick={() => selectVoice(item.id)} aria-pressed={isActive} aria-label={`Set the page in ${item.name} voice`}>
                    <span className="voice-card__topline">
                      <span className="voice-card__letter">{item.letter}</span>
                      <span className="voice-card__state">{isActive ? 'currently set' : 'set this voice'}</span>
                      <span className="voice-card__arrow" aria-hidden="true">↗</span>
                    </span>
                    <span className="voice-card__name">{item.name}</span>
                    <span className="voice-card__tagline">{item.tagline}</span>
                    <span className={`voice-card__sample voice-card__sample--${item.id}`}>{item.sample}</span>
                    <span className="voice-card__detail">{item.detail}</span>
                  </button>
                </article>
              )
            })}
          </div>
          <div className="voice-footnote"><span className="voice-footnote__key">shortcut</span><kbd>shift</kbd><span>+</span><kbd>v</kbd><span>cycle the voice</span></div>
        </section>

        <section id="answer" className="answer-section reveal" aria-labelledby="answer-title">
          <div className="answer-intro">
            <span className="eyebrow"><span className="eyebrow__dash" />the pause</span>
            <h2 id="answer-title">Some answers<br />need <em>room.</em></h2>
            <p>Not because the page is withholding something. Because a good answer should arrive after the reader has made a little space for it.</p>
            <button ref={answerTriggerRef} type="button" className="fold-button" onClick={toggleAnswer} aria-expanded={answerOpen} aria-controls="answer-leaf">
              <span className="fold-button__icon" aria-hidden="true">
                <svg viewBox="0 0 18 18">
                  <path d="M3 9h12M9 3v12" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                </svg>
              </span>
              <span>{answerOpen ? 'fold the answer back' : 'unfold the answer'}</span>
              <span className="fold-button__key" aria-hidden="true">esc</span>
            </button>
          </div>

          <div className={`answer-leaf ${answerOpen ? 'is-open' : ''}`} id="answer-leaf">
            <div className="answer-leaf__closed" aria-hidden={answerOpen}>
              <span className="answer-leaf__question">?</span>
              <span>the answer is folded here</span>
              <span className="answer-leaf__crease" aria-hidden="true" />
            </div>
            {answerOpen && (
              <div className="answer-leaf__content">
                <div className="answer-leaf__header">
                  <span>one answer / three ways in</span>
                  <button ref={answerCloseRef} type="button" className="answer-leaf__close" onClick={toggleAnswer} aria-label="Fold the answer back">
                    <span>fold back</span>
                    <span aria-hidden="true">×</span>
                  </button>
                </div>
                <div className="answer-columns">
                  <article className="answer-column answer-column--quiet">
                    <span className="answer-column__letter">A</span>
                    <h3>Yes, when it knows when to stop.</h3>
                    <p>Clarity is not emptiness. It is the shape of the thing you chose to keep.</p>
                  </article>
                  <article className="answer-column answer-column--human">
                    <span className="answer-column__letter">B</span>
                    <h3>Yes, when it leaves a little warmth on the page.</h3>
                    <p>A human detail is not a decoration. It is evidence that someone was paying attention.</p>
                  </article>
                  <article className="answer-column answer-column--bold">
                    <span className="answer-column__letter">C</span>
                    <h3>Yes, with a question mark that still has somewhere to go.</h3>
                    <p>Confidence can be loud. It should still be generous enough to let the reader finish the thought.</p>
                  </article>
                </div>
                <div className="answer-leaf__verdict"><span>the useful answer</span><strong>yes — but only when it earns the pause.</strong></div>
              </div>
            )}
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <a className="footer-mark" href="#question" aria-label="Back to the question">
          <span className="footer-mark__dot" aria-hidden="true" />
          <span>m³ / return to the question</span>
        </a>
        <p>the work is the question.</p>
        <span className="footer-signature">a client-side field guide</span>
      </footer>

      <span className="sr-only" aria-live="polite">{announcement}</span>
      <span className="sr-only">{`Current voice: ${VOICE_NAME[voice]}. Selected margin note: ${activeNote.title}.`}</span>
    </div>
  )
}

function OrbitCard({
  voice,
  onVoice,
  onMove,
  onLeave,
}: {
  voice: VoiceId
  onVoice: (id: VoiceId) => void
  onMove: (event: ReactPointerEvent<HTMLDivElement>) => void
  onLeave: (event: ReactPointerEvent<HTMLDivElement>) => void
}) {
  const active = VOICES.find(item => item.id === voice) ?? VOICES[0]

  return (
    <div className="orbit-card" onPointerMove={onMove} onPointerLeave={onLeave} aria-label="A three voice orbit around the question">
      <div className="orbit-card__header">
        <span>the three voice field</span>
        <span>move / touch</span>
      </div>
      <div className="orbit-card__stage">
        <svg className="orbit-card__drawing" viewBox="0 0 480 420" aria-hidden="true">
          <defs>
            <radialGradient id="orbit-halo" cx="50%" cy="50%" r="50%">
              <stop offset="0" stopColor="var(--tone)" stopOpacity=".2" />
              <stop offset="1" stopColor="var(--tone)" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="240" cy="210" r="116" fill="url(#orbit-halo)" />
          <circle className="orbit-card__ring orbit-card__ring--outer" cx="240" cy="210" r="142" />
          <ellipse className="orbit-card__ring orbit-card__ring--tilt" cx="240" cy="210" rx="176" ry="68" transform="rotate(-24 240 210)" />
          <ellipse className="orbit-card__ring orbit-card__ring--inner" cx="240" cy="210" rx="82" ry="38" transform="rotate(-24 240 210)" />
          <path className="orbit-card__path" d="M95 140C160 52 333 46 390 143s-45 206-163 192S57 225 95 140Z" />
          <path className="orbit-card__path orbit-card__path--ghost" d="M109 281C176 353 315 355 373 276" />
          <circle className="orbit-card__center-ring" cx="240" cy="210" r="48" />
          <circle className="orbit-card__center-dot" cx="240" cy="210" r="4" />
        </svg>
        <span className="orbit-card__spark" aria-hidden="true" />
        <span className="orbit-card__center">
          <strong>M3</strong>
          <span>one question</span>
        </span>
        {VOICES.map((item, index) => (
          <button
            key={item.id}
            type="button"
            className={`orbit-node orbit-node--${item.id} ${voice === item.id ? 'is-active' : ''}`}
            style={{ '--node-x': `${[16, 79, 58][index]}%`, '--node-y': `${[22, 25, 78][index]}%` } as CSSProperties}
            onClick={() => onVoice(item.id)}
            aria-label={`Use the ${item.name} voice`}
            aria-pressed={voice === item.id}
          >
            <span>{item.letter}</span>
          </button>
        ))}
      </div>
      <div className="orbit-card__footer">
        <span className={`orbit-card__swatch orbit-card__swatch--${voice}`} aria-hidden="true" />
        <span>now listening: <strong>{active.name}</strong></span>
        <span className="orbit-card__footer-arrow" aria-hidden="true">↘</span>
      </div>
    </div>
  )
}
