import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from 'react'
import { NOTES, type WordId } from './notes'

type VoiceId = 'editorial' | 'plain' | 'black'

type VoiceSpec = {
  id: VoiceId
  letter: string
  name: string
  manner: string
  detail: string
}

const TITLE = 'is Minimax M3 good at frontend yet?'

const VOICES: VoiceSpec[] = [
  {
    id: 'editorial',
    letter: 'A',
    name: 'editorial',
    manner: 'serif / measured',
    detail: 'Old-style warmth, hairline rules instead of boxes, and a palette that stays out of the way.',
  },
  {
    id: 'plain',
    letter: 'B',
    name: 'plain',
    manner: 'sans / open',
    detail: 'Humanist sans, generous leading, one spot colour, and nothing underlined twice.',
  },
  {
    id: 'black',
    letter: 'C',
    name: 'black',
    manner: 'poster / emphatic',
    detail: 'Heavy weight, tight fit, spent once at the top of the page — a poster, not a whole system.',
  },
]

const NEXT_VOICE: Record<VoiceId, VoiceId> = {
  editorial: 'plain',
  plain: 'black',
  black: 'editorial',
}

const NAV_ITEMS = [
  { id: 'question', label: 'question' },
  { id: 'phrases', label: 'close read' },
  { id: 'voices', label: 'type trials' },
  { id: 'answer', label: 'short answer' },
] as const

const WORD_IDS: WordId[] = ['m3', 'good', 'yet']

const prefersStill = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function App() {
  const [voice, setVoice] = useState<VoiceId>('editorial')
  const [selected, setSelected] = useState<WordId>('good')
  const [hovered, setHovered] = useState<WordId | null>(null)
  const [activeSection, setActiveSection] = useState<string>('question')
  const [answerOpen, setAnswerOpen] = useState(false)
  const [announcement, setAnnouncement] = useState('')
  const answerSealRef = useRef<HTMLButtonElement | null>(null)
  const answerCloseRef = useRef<HTMLButtonElement | null>(null)
  const choiceRefs = useRef<Record<string, HTMLButtonElement | null>>({})

  const activeId = hovered ?? selected
  const activeNote = NOTES.find(note => note.id === activeId) ?? NOTES[0]
  const activeVoice = VOICES.find(item => item.id === voice) ?? VOICES[0]

  const selectWord = useCallback((id: WordId) => {
    setSelected(id)
    const note = NOTES.find(item => item.id === id)
    if (note) setAnnouncement(`${note.label}. ${note.title}. ${note.gloss}.`)
  }, [])

  const setVoiceAndAnnounce = useCallback((id: VoiceId) => {
    setVoice(id)
    const found = VOICES.find(item => item.id === id)
    if (found) setAnnouncement(`The page is now set in the ${found.name} voice.`)
  }, [])

  const cycleVoice = useCallback(() => {
    setVoiceAndAnnounce(NEXT_VOICE[voice])
  }, [setVoiceAndAnnounce, voice])

  const toggleAnswer = useCallback(() => {
    const next = !answerOpen
    setAnswerOpen(next)
    setAnnouncement(next ? 'The short answer is revealed.' : 'The short answer is covered again.')
    window.requestAnimationFrame(() => {
      if (next) answerCloseRef.current?.focus()
      else answerSealRef.current?.focus()
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
      { rootMargin: '-20% 0px -66% 0px', threshold: [0.04, 0.2, 0.5] },
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
      { rootMargin: '0px 0px -8% 0px', threshold: 0.06 },
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

  const nudgeChoice = (event: ReactKeyboardEvent<HTMLButtonElement>, id: WordId) => {
    let next: WordId | null = null
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
      next = WORD_IDS[(WORD_IDS.indexOf(id) + 1) % WORD_IDS.length]
    } else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
      next = WORD_IDS[(WORD_IDS.indexOf(id) + WORD_IDS.length - 1) % WORD_IDS.length]
    } else if (event.key === 'Home') {
      next = WORD_IDS[0]
    } else if (event.key === 'End') {
      next = WORD_IDS[WORD_IDS.length - 1]
    }
    if (!next) return
    event.preventDefault()
    selectWord(next)
    choiceRefs.current[next]?.focus()
  }

  return (
    <div className={`desk desk--${voice}`}>
      <div className="desk__atmosphere" aria-hidden="true">
        <span className="desk__wash desk__wash--red" />
        <span className="desk__wash desk__wash--blue" />
        <span className="desk__grid" />
        <span className="desk__grain" />
      </div>

      <a className="skip-link" href="#question">Skip to the question</a>

      <header className="topbar">
        <a className="wordmark" href="#question" aria-label="Reading desk, back to the question">
          <span className="wordmark__seal" aria-hidden="true">M3</span>
          <span className="wordmark__words">
            <strong>frontend, read closely</strong>
            <small>one sentence, three distances</small>
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
              <span className="section-nav__number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
              {item.label}
            </a>
          ))}
        </nav>

        <div className="voice-picker" role="group" aria-label="Set the page's type voice">
          <span className="voice-picker__label">voice</span>
          <div className="voice-picker__keys">
            {VOICES.map(item => (
              <button
                key={item.id}
                type="button"
                className={`voice-key ${voice === item.id ? 'is-active' : ''}`}
                onClick={() => setVoiceAndAnnounce(item.id)}
                aria-pressed={voice === item.id}
                aria-label={`Use the ${item.name} type voice`}
              >
                {item.letter}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="page">
        <section id="question" className="hero" aria-labelledby="question-title">
          <div className="hero__copy">
            <p className="kicker">
              <span className="kicker__star" aria-hidden="true">✳</span>
              <span className="kicker__text">a working page, answering the question by being one</span>
            </p>

            <QuestionTitle selected={selected} onSelect={selectWord} onPreview={setHovered} />

            <Legend active={activeNote.id} />

            <div className="hero__note">
              <p>
                The question mark is load-bearing.{' '}
                <em>Give it somewhere to land.</em>
              </p>
              <svg viewBox="0 0 200 48" preserveAspectRatio="none" aria-hidden="true" focusable="false">
                <path d="M6 44C62 44 116 30 158 6" />
                <path d="m145 8 15-2-4 15" />
              </svg>
            </div>

            <p className="lede">
              One sentence, three jobs. Choose a phrase to read what it carries, change the type
              voice to feel the temperature move, then open the short answer.
            </p>

            <div className="hero__actions">
              <a className="button button--solid" href="#phrases">
                <span>read the sentence closely</span>
                <ArrowIcon />
              </a>
              <button type="button" className="button button--ghost" onClick={cycleVoice} aria-keyshortcuts="Shift+V">
                <span>change the voice</span>
                <kbd>shift</kbd>
                <span aria-hidden="true">+</span>
                <kbd>v</kbd>
              </button>
            </div>

            <p className="hero__hint" id="word-help">
              <span aria-hidden="true">↳</span> hover, tap or focus a phrase in the title — the page leans toward it
            </p>
          </div>

          <aside className="ladder" aria-label="The sentence at three distances">
            <div className="ladder__head">
              <h2>three distances</h2>
              <p>A sentence that survives being made small has a shape worth keeping.</p>
            </div>
            <LadderRow size="lg" active={activeNote.id} />
            <LadderRow size="md" active={activeNote.id} />
            <LadderRow size="sm" active={activeNote.id} />
            <div className="ladder__foot">
              <span>set in the <strong>{activeVoice.name}</strong> voice</span>
              <a href="#voices">see the trials <span aria-hidden="true">↘</span></a>
            </div>
          </aside>
        </section>

        <section id="phrases" className="phrases" aria-labelledby="phrases-title">
          <SectionHead
            number="01"
            titleId="phrases-title"
            kicker="close read"
            title={<>Three phrases.{' '}<em>Three jobs.</em></>}
            lede="The sentence is short enough to take apart. Pick a phrase and the reading desk shows what that fragment carries, and what it asks of the page."
          />

          <div className="phrases__body">
            <div className="choices" role="radiogroup" aria-label="Choose a phrase to read closely" aria-describedby="choices-help">
              <div className="choices__list">
                {NOTES.map(note => (
                  <button
                    key={note.id}
                    type="button"
                    role="radio"
                    ref={node => {
                      choiceRefs.current[note.id] = node
                    }}
                    tabIndex={selected === note.id ? 0 : -1}
                    aria-checked={selected === note.id}
                    className={`choice choice--${note.id} ${selected === note.id ? 'is-selected' : ''} ${activeNote.id === note.id ? 'is-hot' : ''}`}
                    onClick={() => selectWord(note.id)}
                    onMouseEnter={() => setHovered(note.id)}
                    onMouseLeave={() => setHovered(null)}
                    onFocus={() => setHovered(note.id)}
                    onBlur={() => setHovered(null)}
                    onKeyDown={event => nudgeChoice(event, note.id)}
                  >
                    <span className="choice__index" aria-hidden="true">{note.index}</span>
                    <span className="choice__text">
                      <span className="choice__label">{note.label}</span>
                      <span className="choice__title">{note.title}</span>
                    </span>
                    <span className="choice__measure" aria-hidden="true">{note.measure}</span>
                  </button>
                ))}
              </div>
              <p className="choices__help" id="choices-help">
                Arrow keys move between phrases. Enter or space opens the reading.
              </p>
            </div>

            <article className={`reading reading--${activeNote.id}`} key={activeNote.id} aria-live="polite">
              <div className="reading__top">
                <span className="reading__folio">close read / {activeNote.index}</span>
                <span className="reading__stamp" aria-hidden="true">M3</span>
              </div>

              <div className="reading__specimen">
                <p className="reading__fragment">{activeNote.label}</p>
                <svg className="reading__underline" viewBox="0 0 320 26" preserveAspectRatio="none" aria-hidden="true" focusable="false">
                  <path d="M3 17C58 7 122 19 184 11c42-6 84 1 133 7" />
                  <path className="reading__underline--ghost" d="M9 23C64 13 128 24 190 16c40-5 82 1 126 8" />
                </svg>
              </div>

              <div className="reading__body">
                <p className="reading__gloss">{activeNote.gloss}</p>
                <h3>{activeNote.title}</h3>
                <p className="reading__copy">{activeNote.body}</p>
              </div>

              <ul className="reading__look">
                {activeNote.look.map(item => (
                  <li key={item}><span aria-hidden="true">→</span>{item}</li>
                ))}
              </ul>

              <div className="reading__foot">
                <p className="reading__prompt"><span aria-hidden="true">↳</span> {activeNote.prompt}</p>
                <p className="reading__margin">{activeNote.margin}</p>
              </div>
            </article>
          </div>
        </section>

        <section id="voices" className="voices" aria-labelledby="voices-title">
          <SectionHead
            number="02"
            titleId="voices-title"
            kicker="type trials"
            title={<>Same words.{' '}<em>Three temperatures.</em></>}
            lede="The palette and the layout never move — only the type does. Choose a voice and the whole page, title included, is re-cut in it."
          />

          <div className="voices__grid">
            {VOICES.map(item => {
              const isActive = item.id === voice
              return (
                <article key={item.id} className={`trial trial--${item.id} ${isActive ? 'is-active' : ''}`}>
                  <button
                    type="button"
                    onClick={() => setVoiceAndAnnounce(item.id)}
                    aria-pressed={isActive}
                    aria-label={`Set the page in the ${item.name} voice`}
                  >
                    <span className="trial__top">
                      <span className="trial__letter" aria-hidden="true">{item.letter}</span>
                      <span className="trial__manner">{item.manner}</span>
                    </span>
                    <span className="trial__sample">
                      <MiniSentence active={activeNote.id} />
                    </span>
                    <span className="trial__name">{item.name}</span>
                    <span className="trial__detail">{item.detail}</span>
                    <span className="trial__state">
                      <i aria-hidden="true" />
                      {isActive ? 'in use on this page' : 'set this voice'}
                    </span>
                  </button>
                </article>
              )
            })}
          </div>

          <p className="voices__note">
            <span>Keyboard shortcut</span>
            <kbd>shift</kbd>
            <span aria-hidden="true">+</span>
            <kbd>v</kbd>
            <span>cycles the type voice</span>
          </p>
        </section>

        <section id="answer" className="answer" aria-labelledby="answer-title">
          <div className="answer__intro">
            <p className="kicker">
              <span className="kicker__star" aria-hidden="true">✳</span>
              <span className="kicker__text">the short answer</span>
            </p>
            <h2 id="answer-title">One sentence,<br /><em>delivered plainly.</em></h2>
            <p>
              The question does not need a speech. It needs one honest sentence and enough quiet
              around it to land.
            </p>
          </div>

          <div className={`seal-card ${answerOpen ? 'is-open' : ''}`}>
            {answerOpen ? (
              <div className="seal-card__open" id="answer-window" aria-live="polite">
                <button
                  ref={answerCloseRef}
                  type="button"
                  className="seal-card__close"
                  onClick={toggleAnswer}
                  aria-label="Cover the short answer again"
                >
                  <span aria-hidden="true">×</span>
                </button>
                <p className="seal-card__yes">yes — with a hand.</p>
                <p className="seal-card__claim">
                  When the interface has a point of view you can feel, and knows when to stop moving.
                </p>
                <ul className="seal-card__tests">
                  <li><span>01</span>Hierarchy: could you name the second most important thing without thinking twice?</li>
                  <li><span>02</span>Hand: is there one detail that only this page could have?</li>
                  <li><span>03</span>Restraint: does everything stop moving the moment you stop reading?</li>
                </ul>
                <p className="seal-card__coda">
                  And the honest part: any model can write the markup. The difference lives in the
                  hundred small decisions nobody asked for.
                </p>
              </div>
            ) : (
              <button
                ref={answerSealRef}
                type="button"
                className="seal-card__sealed"
                onClick={toggleAnswer}
                aria-expanded={false}
              >
                <span className="seal-card__slip" aria-hidden="true">
                  <span>the short answer</span>
                  <span>sealed</span>
                </span>
                <span className="seal-card__glyph" aria-hidden="true">?</span>
                <span className="seal-card__invite">lift the cover</span>
                <span className="seal-card__hint" aria-hidden="true">one sentence is waiting under the dot</span>
              </button>
            )}
          </div>
        </section>
      </main>

      <footer className="footer">
        <p className="footer__echo" aria-hidden="true">{TITLE}</p>
        <div className="footer__grid">
          <a className="footer__return" href="#question">
            <span aria-hidden="true">↑</span> back to the question
          </a>
          <div className="footer__colophon">
            <p>Set with the fonts already on your machine: one serif, one sans, one mono. No web fonts, no images, no network calls.</p>
            <p>Ink: chalk, near-black, vermillion, electric blue. Everything else is a rule.</p>
          </div>
          <p className="footer__closing">The experiment is the page.</p>
        </div>
      </footer>

      <span className="sr-only" aria-live="polite">{announcement}</span>
      <span className="sr-only">Current type voice: {activeVoice.name}. Phrase under the lens: {activeNote.label}.</span>
    </div>
  )
}

function QuestionTitle({
  selected,
  onSelect,
  onPreview,
}: {
  selected: WordId
  onSelect: (id: WordId) => void
  onPreview: (id: WordId | null) => void
}) {
  const words = useRef<Record<string, HTMLButtonElement | null>>({})
  const frame = useRef(0)

  const clear = useCallback(() => {
    WORD_IDS.forEach(id => {
      const el = words.current[id]
      if (!el) return
      el.style.setProperty('--pull', '0')
      el.style.setProperty('--dx', '0px')
      el.style.setProperty('--dy', '0px')
    })
  }, [])

  const track = useCallback((event: ReactPointerEvent<HTMLHeadingElement>) => {
    if (event.pointerType !== 'mouse' || prefersStill()) return
    const host = event.currentTarget
    const hostBox = host.getBoundingClientRect()
    const reach = Math.min(280, Math.max(140, hostBox.width * 0.34))
    const px = event.clientX
    const py = event.clientY
    if (frame.current) cancelAnimationFrame(frame.current)
    frame.current = requestAnimationFrame(() => {
      frame.current = 0
      WORD_IDS.forEach(id => {
        const el = words.current[id]
        if (!el) return
        const box = el.getBoundingClientRect()
        const dx = px - (box.left + box.width / 2)
        const dy = py - (box.top + box.height / 2)
        const distance = Math.hypot(dx, dy)
        const pull = distance > reach ? 0 : (1 - distance / reach) ** 2
        el.style.setProperty('--pull', pull.toFixed(3))
        el.style.setProperty('--dx', `${(dx * 0.15 * pull).toFixed(2)}px`)
        el.style.setProperty('--dy', `${(dy * 0.12 * pull - pull * 3).toFixed(2)}px`)
      })
    })
  }, [])

  useEffect(() => () => {
    if (frame.current) cancelAnimationFrame(frame.current)
  }, [])

  const word = (id: WordId, text: string) => (
    <button
      ref={node => {
        words.current[id] = node
      }}
      type="button"
      className={`question__word question__word--${id} ${selected === id ? 'is-selected' : ''}`}
      onClick={() => onSelect(id)}
      onMouseEnter={() => onPreview(id)}
      onMouseLeave={() => onPreview(null)}
      onFocus={() => onPreview(id)}
      onBlur={() => onPreview(null)}
      aria-pressed={selected === id}
      aria-describedby="word-help"
    >
      {text}
    </button>
  )

  return (
    <h1 id="question-title" className="question" aria-label={TITLE} onPointerMove={track} onPointerLeave={clear}>
      <span className="question__line" style={{ '--i': 0 } as CSSProperties}>
        <span className="question__plain">is Minimax </span>
        {word('m3', 'M3')}
      </span>{' '}
      <span className="question__line question__line--indent" style={{ '--i': 1 } as CSSProperties}>
        {word('good', 'good at')}
      </span>{' '}
      <span className="question__line" style={{ '--i': 2 } as CSSProperties}>
        <span className="question__plain">frontend </span>
        {word('yet', 'yet?')}
      </span>
    </h1>
  )
}

function Legend({ active }: { active: WordId }) {
  return (
    <ol className="legend" aria-label="The sentence, divided into three phrases">
      {NOTES.map(note => (
        <li key={note.id} className={`legend__item legend__item--${note.id} ${active === note.id ? 'is-active' : ''}`}>
          <span className="legend__tick" aria-hidden="true" />
          <span className="legend__index" aria-hidden="true">{note.index}</span>
          <span className="legend__label">{note.label}</span>
        </li>
      ))}
    </ol>
  )
}

function MiniSentence({ active }: { active: WordId }) {
  return (
    <span className="mini">
      <span className="mini__plain">is Minimax </span>
      <b className={active === 'm3' ? 'is-on' : ''}>M3</b>{' '}
      <b className={active === 'good' ? 'is-on' : ''}>good at</b>{' '}
      <span className="mini__plain">frontend </span>
      <b className={active === 'yet' ? 'is-on' : ''}>yet?</b>
    </span>
  )
}

function LadderRow({ size, active }: { size: 'lg' | 'md' | 'sm'; active: WordId }) {
  const labels = { lg: 'close', md: 'mid', sm: 'far' } as const
  return (
    <div className={`ladder__row ladder__row--${size}`} aria-hidden="true">
      <span className="ladder__label">{labels[size]}</span>
      <p className="ladder__type"><MiniSentence active={active} /></p>
    </div>
  )
}

function SectionHead({
  number,
  titleId,
  kicker,
  title,
  lede,
}: {
  number: string
  titleId: string
  kicker: string
  title: ReactNode
  lede: string
}) {
  return (
    <header className="section-head reveal">
      <p className="section-head__kicker">
        <span className="section-head__number" aria-hidden="true">{number}</span>
        <span className="printed">{kicker}</span>
      </p>
      <div className="section-head__grid">
        <h2 id={titleId}>{title}</h2>
        <p className="section-head__lede">{lede}</p>
      </div>
    </header>
  )
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false">
      <path d="M3 10h13M10.5 4.5 16 10l-5.5 5.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
