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

type QuestionDialProps = {
  voice: VoiceId
  onVoice: (id: VoiceId) => void
  onMove: (event: ReactPointerEvent<HTMLDivElement>) => void
  onLeave: (event: ReactPointerEvent<HTMLDivElement>) => void
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
const DIAL_NODES: Record<VoiceId, { x: number; y: number }> = {
  quiet: { x: 17, y: 23 },
  human: { x: 78, y: 22 },
  bold: { x: 73, y: 77 },
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
      window.requestAnimationFrame(() => {
        if (next) answerCloseRef.current?.focus()
        else answerTriggerRef.current?.focus()
      })
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
      { rootMargin: '-24% 0px -62% 0px', threshold: [0.05, 0.2, 0.5, 0.8] },
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
      { rootMargin: '0px 0px -9% 0px', threshold: 0.08 },
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
      if (event.shiftKey && event.key.toLowerCase() === 'v') {
        event.preventDefault()
        cycleVoice()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [cycleVoice])

  const onDialMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect()
    if (!bounds.width || !bounds.height) return
    const x = Math.min(88, Math.max(12, ((event.clientX - bounds.left) / bounds.width) * 100))
    const y = Math.min(84, Math.max(16, ((event.clientY - bounds.top) / bounds.height) * 100))
    event.currentTarget.style.setProperty('--dial-x', `${x}%`)
    event.currentTarget.style.setProperty('--dial-y', `${y}%`)
  }

  const onDialLeave = (event: ReactPointerEvent<HTMLDivElement>) => {
    event.currentTarget.style.setProperty('--dial-x', '50%')
    event.currentTarget.style.setProperty('--dial-y', '50%')
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
              <path d="M8 28V12h4.1l7.9 9.7 7.9-9.7H32v16h-4.4v-8.5L20 28l-7.6-9.5V28z" fill="currentColor" />
              <circle cx="31.5" cy="9" r="2.1" fill="var(--ink)" />
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

        <div className="header-tone">
          <span className="header-tone__label">temperature</span>
          <div className="header-tone__options" role="group" aria-label="Set the page voice">
            {VOICES.map(item => (
              <button
                key={item.id}
                type="button"
                className={`header-tone__button header-tone__button--${item.id} ${voice === item.id ? 'is-active' : ''}`}
                onClick={() => selectVoice(item.id)}
                aria-pressed={voice === item.id}
                aria-label={`Set the page in ${item.name} voice`}
              >
                {item.letter}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="page-content">
        <section id="question" className="hero-section reveal" aria-labelledby="question-title">
          <div className="hero-section__topline">
            <span className="eyebrow"><span className="eyebrow__spark">✳</span>the opening question</span>
            <span className="hero-section__aside">one sentence / three ways to hear it</span>
          </div>

          <div className="hero-card">
            <div className="hero-card__copy">
              <div className="hero-card__topline">
                <span>the short version</span>
                <span>folio / i</span>
              </div>
              <div className="hero-card__chapter">a small test of judgment</div>
              <h1 id="question-title" className={`hero-title hero-title--${voice}`} aria-label={TITLE}>
                <span className="hero-title__prefix">is Minimax</span>{' '}
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
                </button>{' '}
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
                </button>{' '}
                <span className="hero-title__phrase">frontend</span>{' '}
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
                Not a verdict. A small reading of the moment: can this page hold a point of view, invite a touch, and still know when to become quiet?
              </p>
              <div className="hero-card__actions">
                <a className="button button--ink" href="#field-notes">
                  <span>read the field notes</span>
                  <ArrowIcon />
                </a>
                <button type="button" className="voice-cycle" onClick={cycleVoice}>
                  <span>change the temperature</span>
                  <kbd>shift</kbd><span>+</span><kbd>v</kbd>
                </button>
              </div>
              <p className="hero-card__hint"><span className="hint-dot" aria-hidden="true" />tap a word to open its margin note</p>
            </div>

            <QuestionDial voice={voice} onVoice={selectVoice} onMove={onDialMove} onLeave={onDialLeave} />
          </div>

          <div className="hero-section__footnote">
            <span><span className="footnote-mark" aria-hidden="true">↳</span> the question is the interface</span>
            <span>the answer is allowed to take its time</span>
          </div>
        </section>

        <div className="page-divider reveal" aria-hidden="true">
          <span />
          <svg viewBox="0 0 120 12" preserveAspectRatio="none">
            <path d="M0 6h43m34 0h43" fill="none" stroke="currentColor" strokeWidth=".7" strokeDasharray="1 4" />
            <circle cx="60" cy="6" r="2.2" fill="currentColor" />
            <circle cx="60" cy="6" r="5" fill="none" stroke="currentColor" strokeWidth=".5" opacity=".5" />
          </svg>
          <span />
        </div>

        <section id="field-notes" className="field-section reveal" aria-labelledby="field-title">
          <SectionHeading
            eyebrow="the margin notes"
            title={<>Three words.<br /><em>One point of view.</em></>}
            lede="The sentence is a tiny instrument. Touch a word to hear the decision hiding underneath it."
          />

          <div className="word-lab">
            <div className="word-list" role="list" aria-label="Question words">
              <div className="word-list__header"><span>choose a word</span><span>the small evidence</span></div>
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
                <span>{activeNote.editor}</span>
              </div>
            </article>
          </div>
        </section>

        <div className="page-divider page-divider--short reveal" aria-hidden="true"><span /><span /></div>

        <section id="voices" className="voices-section reveal" aria-labelledby="voices-title">
          <SectionHeading
            eyebrow="the same line, three voices"
            title={<>Change the <em>temperature.</em></>}
            lede="Typography is not a coat of paint. It changes what the reader is asked to do."
            className="section-heading--voices"
          />

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
                    <span className="voice-card__bottom">
                      <span className="voice-card__underline" aria-hidden="true"><i /><i /><i /></span>
                      <span>{isActive ? 'selected' : 'select'}</span>
                    </span>
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
            <span className="eyebrow"><span className="eyebrow__spark">✳</span>the pause</span>
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

          <div className={`answer-leaf ${answerOpen ? 'is-open' : ''}`} id="answer-leaf" role="region" aria-label="The answer">
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

function SectionHeading({
  eyebrow,
  title,
  lede,
  className = '',
}: {
  eyebrow: string
  title: React.ReactNode
  lede: string
  className?: string
}) {
  return (
    <div className={`section-heading ${className}`}>
      <div>
        <span className="eyebrow"><span className="eyebrow__spark">✳</span>{eyebrow}</span>
        <h2>{title}</h2>
      </div>
      <p className="section-heading__lede">{lede}</p>
    </div>
  )
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 18 18" aria-hidden="true">
      <path d="M3 9h11M9.5 4.5 14 9l-4.5 4.5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function QuestionDial({ voice, onVoice, onMove, onLeave }: QuestionDialProps) {
  const active = VOICES.find(item => item.id === voice) ?? VOICES[0]

  return (
    <div className="question-dial" onPointerMove={onMove} onPointerLeave={onLeave} role="group" aria-label="Three voice field around the question">
      <div className="question-dial__header">
        <span>the question, in orbit</span>
        <span>move / touch</span>
      </div>
      <div className="question-dial__stage">
        <svg className="question-dial__drawing" viewBox="0 0 520 500" aria-hidden="true">
          <defs>
            <radialGradient id="dial-halo" cx="50%" cy="50%" r="50%">
              <stop offset="0" stopColor="var(--tone)" stopOpacity=".22" />
              <stop offset=".62" stopColor="var(--tone)" stopOpacity=".05" />
              <stop offset="1" stopColor="var(--tone)" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="260" cy="250" r="174" fill="url(#dial-halo)" />
          <circle className="question-dial__ring question-dial__ring--outer" cx="260" cy="250" r="170" />
          <ellipse className="question-dial__ring question-dial__ring--tilt" cx="260" cy="250" rx="202" ry="77" transform="rotate(-23 260 250)" />
          <ellipse className="question-dial__ring question-dial__ring--inner" cx="260" cy="250" rx="96" ry="42" transform="rotate(-23 260 250)" />
          <path className="question-dial__path" d="M94 173C151 62 345 52 422 155s-41 235-173 223S55 274 94 173Z" />
          <path className="question-dial__path question-dial__path--ghost" d="M103 335c62 88 234 101 320-6" />
          <line className="question-dial__axis" x1="260" y1="38" x2="260" y2="462" />
          <line className="question-dial__axis" x1="48" y1="250" x2="472" y2="250" />
          <circle className="question-dial__center-ring" cx="260" cy="250" r="58" />
          <circle className="question-dial__center-dot" cx="260" cy="250" r="4" />
        </svg>
        <span className="question-dial__spark" aria-hidden="true" />
        <div className="question-dial__center">
          <span className="question-dial__eyebrow">hold here</span>
          <strong>?</strong>
          <span className="question-dial__subline">m3 / open question</span>
        </div>
        <div className="question-dial__nodes">
          {VOICES.map(item => (
            <button
              key={item.id}
              type="button"
              className={`dial-node dial-node--${item.id} ${voice === item.id ? 'is-active' : ''}`}
              style={{ '--node-x': `${DIAL_NODES[item.id].x}%`, '--node-y': `${DIAL_NODES[item.id].y}%` } as CSSProperties}
              onClick={() => onVoice(item.id)}
              aria-label={`Use the ${item.name} voice`}
              aria-pressed={voice === item.id}
            >
              <span>{item.letter}</span>
            </button>
          ))}
        </div>
        <div className="question-dial__readout">
          <span>current voice</span>
          <strong>{active.name}</strong>
        </div>
      </div>
      <div className="question-dial__footer">
        <span className={`question-dial__swatch question-dial__swatch--${voice}`} aria-hidden="true" />
        <span>click a node to set the type</span>
        <span className="question-dial__arrow" aria-hidden="true">↘</span>
      </div>
    </div>
  )
}
