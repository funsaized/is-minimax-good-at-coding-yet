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
import { findNote, NOTES, phraseLines, WORD_IDS, type WordId } from './notes'
import { CropMark, HandArrow, RegistrationMark, Squeegee } from './marks'

const TITLE = 'is Minimax M3 good at frontend yet?'

const NAV_ITEMS = [
  { id: 'question', number: '01', label: 'the question' },
  { id: 'close', number: '02', label: 'close read' },
  { id: 'answer', number: '03', label: 'the short answer' },
] as const

const INKS = [
  { id: 'black', name: 'black', use: 'every word you actually read' },
  { id: 'pink', name: 'fluorescent pink', use: 'the mark, the pull, the ?' },
  { id: 'blue', name: 'federal blue', use: 'the second impression' },
] as const

const prefersStill = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function App() {
  const [active, setActive] = useState<WordId>('good')
  const [hover, setHover] = useState<WordId | null>(null)
  const [section, setSection] = useState<string>('question')
  const [proof, setProof] = useState(false)
  const [announce, setAnnounce] = useState('')
  const sheetRef = useRef<HTMLDivElement | null>(null)
  const indexRefs = useRef<Record<string, HTMLButtonElement | null>>({})

  const shown = hover ?? active
  const note = findNote(shown)
  const lines = phraseLines(note.label, note.drop)
  const engaged = hover !== null

  const select = useCallback((id: WordId, announceIt = true) => {
    setActive(id)
    setHover(id)
    if (!announceIt) return
    const found = findNote(id)
    setAnnounce(`${found.index}. ${found.label}. ${found.title}.`)
  }, [])

  /* park the lens on the chosen phrase so the halftone bloom follows the eye */
  useEffect(() => {
    const host = sheetRef.current
    if (!host) return
    const place = () => {
      const el = host.querySelector<HTMLElement>(`[data-word="${shown}"]`)
      if (!el) return
      const box = host.getBoundingClientRect()
      const mark = el.getBoundingClientRect()
      host.style.setProperty('--bx', `${(mark.left + mark.width / 2 - box.left).toFixed(1)}px`)
      host.style.setProperty('--by', `${(mark.top + mark.height / 2 - box.top).toFixed(1)}px`)
    }
    place()
    window.addEventListener('resize', place)
    return () => window.removeEventListener('resize', place)
  }, [shown])

  useEffect(() => {
    document.title = TITLE
  }, [])

  useEffect(() => {
    if (!('IntersectionObserver' in window)) return
    const nodes = NAV_ITEMS.map(item => document.getElementById(item.id)).filter(
      (node): node is HTMLElement => Boolean(node),
    )
    const observer = new IntersectionObserver(
      entries => {
        const visible = entries
          .filter(entry => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (visible[0]) setSection(visible[0].target.id)
      },
      { rootMargin: '-18% 0px -68% 0px', threshold: [0.04, 0.2, 0.5] },
    )
    nodes.forEach(node => observer.observe(node))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const reveals = Array.from(document.querySelectorAll<HTMLElement>('.reveal'))
    /* only arm the hidden state when an observer can actually un-hide it */
    if (!('IntersectionObserver' in window)) {
      reveals.forEach(node => node.classList.add('is-in'))
      return
    }
    document.documentElement.dataset.reveal = 'on'
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return
          entry.target.classList.add('is-in')
          observer.unobserve(entry.target)
        })
      },
      { rootMargin: '0px 0px -6% 0px', threshold: 0.05 },
    )
    reveals.forEach(node => observer.observe(node))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.repeat) return
      if (event.metaKey || event.ctrlKey || event.altKey) return
      const target = event.target as HTMLElement | null
      const tag = target?.tagName.toLowerCase()
      if (tag === 'input' || tag === 'textarea' || target?.isContentEditable) return

      if (event.key === 'Escape' && proof) {
        event.preventDefault()
        setProof(false)
        setAnnounce('The short answer is covered again.')
        return
      }
      if (event.key >= '1' && event.key <= '3') {
        const id = WORD_IDS[Number(event.key) - 1]
        if (!id) return
        event.preventDefault()
        select(id)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [proof, select])

  const nudgeIndex = (event: ReactKeyboardEvent<HTMLButtonElement>, id: WordId) => {
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
    select(next, false)
    indexRefs.current[next]?.focus()
  }

  return (
    <div className="press">
      <div className="stock" aria-hidden="true">
        <span className="stock__fibre" />
        <span className="stock__halftone" />
        <span className="stock__wash" />
        <span className="sprockets sprockets--left" />
        <span className="sprockets sprockets--right" />
      </div>

      <a className="skip-link" href="#question">Skip to the question</a>

      <header className="slugbar">
        <a className="brand" href="#question" aria-label="Two-colour press sheet, back to the question">
          <RegistrationMark className="brand__mark" />
          <span className="brand__text">
            <strong>two-colour press sheet</strong>
            <small>black · fluorescent pink · federal blue</small>
          </span>
        </a>

        <nav className="nav" aria-label="Page sections">
          {NAV_ITEMS.map(item => (
            <a
              key={item.id}
              className={section === item.id ? 'is-active' : ''}
              href={`#${item.id}`}
              aria-current={section === item.id ? 'location' : undefined}
            >
              <span className="nav__number" aria-hidden="true">{item.number}</span>
              {item.label}
            </a>
          ))}
        </nav>

        <p className="readout" aria-hidden="true">
          <span className="readout__dot" />
          lens <strong>{note.index}</strong> {note.label}
        </p>
      </header>

      <main className="page">
        <section id="question" className="sheet" aria-labelledby="question-title">
          <p className="rail" aria-hidden="true">
            <span>one sentence</span>
            <span>two inks</span>
            <span>printed here</span>
          </p>

          <div className="sheet__grid">
            <div className="sheet__main" ref={sheetRef}>
              <span className="bloom" aria-hidden="true" />

              <p className="slugline">
                <RegistrationMark className="slugline__mark" />
                the title, at reading size
              </p>

              <QuestionTitle selected={active} onSelect={select} onPreview={setHover} />

              <p className="margin-note">
                <span className="margin-note__text">
                  The question mark is load-bearing. <em>Give it somewhere to land.</em>
                </span>
                <HandArrow className="margin-note__arrow" />
              </p>

              <p className="lede">
                The sentence is short enough to take apart. Lean toward a phrase and the sheet
                answers: what that fragment carries, and what it asks of the page.
              </p>

              <div className="actions">
                <a className="button button--ink" href="#close">
                  read it closely
                  <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false">
                    <path
                      d="M3 10h13M10.5 4.5 16 10l-5.5 5.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </a>
                <a className="button button--quiet" href="#answer">
                  skip to the short answer
                </a>
              </div>

              <p className="hint" id="lens-help">
                <span aria-hidden="true">↳</span> hover, tap or focus a phrase in the title
              </p>
            </div>

            <aside className={`loupe ${engaged ? 'is-engaged' : ''}`} aria-label="Loupe, the phrase under the lens">
              <div className="loupe__frame">
                <span className="loupe__mark" aria-hidden="true">
                  <RegistrationMark />
                </span>

                <p className="loupe__word">
                  <span className="sr-only">{note.label}</span>
                  <span className="loupe__ink" aria-hidden="true">{note.label}</span>
                  <span className="loupe__ghost" aria-hidden="true">{note.label}</span>
                </p>

                <p className="loupe__slugs">
                  <span>{note.index} · {note.gloss}</span>
                  <span className="loupe__state">{engaged ? 'in the lens' : 'at rest'}</span>
                </p>
              </div>

              <dl className="keycard">
                <div><dt><kbd>1</kbd><kbd>2</kbd><kbd>3</kbd></dt><dd>pull a phrase into the lens</dd></div>
                <div><dt><kbd>tab</kbd></dt><dd>step through the title</dd></div>
                <div><dt><kbd>esc</kbd></dt><dd>put the proof sheet back</dd></div>
              </dl>
            </aside>
          </div>
        </section>

        <section id="close" className="read" aria-labelledby="close-title">
          <header className="read__head reveal">
            <p className="slugline">
              <RegistrationMark className="slugline__mark" />
              close read
            </p>
            <div className="read__intro">
              <h2 id="close-title">Three phrases. <em>Three jobs.</em></h2>
              <p>
                Take the sentence apart. Each phrase below is a brief: pick one and the sheet shows
                how it is set here, and what it is asking the page to do.
              </p>
            </div>
          </header>

          <div className="read__grid">
            <div
              className="index"
              role="radiogroup"
              aria-label="Choose a phrase to read closely"
              aria-describedby="index-help"
            >
              {NOTES.map(item => {
                const isActive = item.id === active
                return (
                  <button
                    key={item.id}
                    type="button"
                    role="radio"
                    ref={node => {
                      indexRefs.current[item.id] = node
                    }}
                    tabIndex={isActive ? 0 : -1}
                    aria-checked={isActive}
                    className={`index__row ${isActive ? 'is-active' : ''} ${shown === item.id ? 'is-hot' : ''}`}
                    onClick={() => select(item.id)}
                    onMouseEnter={() => setHover(item.id)}
                    onMouseLeave={() => setHover(null)}
                    onFocus={() => setHover(item.id)}
                    onBlur={() => setHover(null)}
                    onKeyDown={event => nudgeIndex(event, item.id)}
                  >
                    <span className="index__number" aria-hidden="true">{item.index}</span>
                    <span className="index__body">
                      <span className="index__label">{item.label}</span>
                      <span className="index__gloss">{item.gloss}</span>
                    </span>
                    <span className="index__measure" aria-hidden="true">{item.measure}</span>
                  </button>
                )
              })}
              <p className="index__help" id="index-help">
                Arrow keys move. The loupe above follows.
              </p>
            </div>

            <article className="specimen" key={note.id} aria-labelledby="specimen-title">
              <p className="specimen__slug">
                <span>close read / {note.index}</span>
                <span>{note.set}</span>
              </p>

              <div className={`specimen__stage specimen__stage--${note.id}`}>
                <p className="specimen__word">
                  <span className="sr-only">{note.label}</span>
                  <span className="specimen__ghost specimen__ghost--pink" aria-hidden="true">
                    {lines.map(line => <span key={line}>{line}</span>)}
                  </span>
                  <span className="specimen__ghost specimen__ghost--blue" aria-hidden="true">
                    {lines.map(line => <span key={line}>{line}</span>)}
                  </span>
                  <span className="specimen__main" aria-hidden="true">
                    {lines.map(line => <span key={line}>{line}</span>)}
                  </span>
                </p>
                <span className="specimen__reg" aria-hidden="true">
                  <RegistrationMark />
                </span>
              </div>

              <div className="specimen__body">
                <p className="specimen__gloss">{note.gloss}</p>
                <h3 id="specimen-title">{note.title}</h3>
                <p className="specimen__copy">{note.body}</p>
                <p className="specimen__margin">{note.margin}</p>
              </div>

              <ol className="brief">
                {note.look.map((line, position) => (
                  <li key={line}>
                    <span aria-hidden="true">{String(position + 1).padStart(2, '0')}</span>
                    {line}
                  </li>
                ))}
              </ol>

              <p className="specimen__prompt"><span aria-hidden="true">↳</span> {note.prompt}</p>
            </article>
          </div>
        </section>

        <section id="answer" className="answer" aria-labelledby="answer-title">
          <div className="answer__grid">
            <div className="answer__copy reveal">
              <p className="slugline">
                <RegistrationMark className="slugline__mark" />
                the short answer
              </p>
              <h2 id="answer-title">One sentence, delivered <em>plainly.</em></h2>
              <p>
                The question does not need a speech. It needs one honest sentence and enough quiet
                around it to land.
              </p>
              <p className="answer__note">The proof sheet is held until you pull it.</p>
            </div>

            <div className={`proof ${proof ? 'is-open' : ''}`}>
              <div className="proof__bar">
                <span className="proof__tag">
                  <RegistrationMark className="proof__tag-mark" />
                  proof sheet
                </span>
                <button
                  type="button"
                  className="toggle"
                  aria-expanded={proof}
                  aria-controls="proof-body"
                  onClick={() => {
                    const next = !proof
                    setProof(next)
                    setAnnounce(next ? 'The short answer is revealed.' : 'The short answer is covered again.')
                  }}
                >
                  <Squeegee className="toggle__icon" />
                  {proof ? 'sheet back' : 'pull proof'}
                </button>
              </div>

              <div className="proof__held" aria-hidden="true">
                <span className="proof__held-mark"><RegistrationMark /></span>
                <p>one sentence, held under the sheet</p>
              </div>

              <div className="proof__window" id="proof-body" role="region" aria-label="The short answer" hidden={!proof}>
                <span className="proof__sweep" aria-hidden="true" />
                <p className="proof__yes">yes — with a hand</p>
                <p className="proof__claim">
                  When the interface has a point of view you can feel, and knows when to stop moving.
                </p>
                <ol className="proof__tests">
                  <li><span>01</span>Hierarchy: could you name the second most important thing without thinking twice?</li>
                  <li><span>02</span>Hand: is there one detail that only this page could have?</li>
                  <li><span>03</span>Restraint: does everything stop moving the moment you stop reading?</li>
                </ol>
                <p className="proof__coda">
                  And the honest part: any model can write the markup. The difference lives in the
                  hundred small decisions nobody asked for.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="colophon">
        <div className="colophon__inner">
          <p className="colophon__echo" aria-hidden="true">{TITLE}</p>

          <div className="colophon__bar" aria-hidden="true">
            {INKS.map(ink => (
              <span className={`inkbar inkbar--${ink.id}`} key={ink.id} />
            ))}
          </div>

          <div className="colophon__grid">
            <a className="colophon__return" href="#question">
              <span aria-hidden="true">↑</span> back to the question
            </a>

            <div className="colophon__notes">
              {INKS.map(ink => (
                <p key={ink.id}>
                  <span className={`colophon__swatch colophon__swatch--${ink.id}`} aria-hidden="true" />
                  <strong>{ink.name}</strong> — {ink.use}
                </p>
              ))}
            </div>

            <p className="colophon__note">
              Set with the fonts already on your machine: one grotesque, one serif, one mono. No web
              fonts, no images, no network calls, no accounts. The only motion is a print pull.
            </p>
          </div>

          <p className="colophon__closing">
            <CropMark className="colophon__crop" />
            The experiment is the page.
          </p>
        </div>
      </footer>

      <span className="sr-only" aria-live="polite">{announce}</span>
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
    const reach = Math.min(300, Math.max(150, host.getBoundingClientRect().width * 0.32))
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
        const pull = Math.hypot(dx, dy) > reach ? 0 : (1 - Math.hypot(dx, dy) / reach) ** 2
        el.style.setProperty('--pull', pull.toFixed(3))
        el.style.setProperty('--dx', `${(dx * 0.13 * pull).toFixed(2)}px`)
        el.style.setProperty('--dy', `${(dy * 0.1 * pull - pull * 2.5).toFixed(2)}px`)
      })
    })
  }, [])

  useEffect(
    () => () => {
      if (frame.current) cancelAnimationFrame(frame.current)
    },
    [],
  )

  const step = (event: ReactKeyboardEvent<HTMLButtonElement>, id: WordId) => {
    const forward = event.key === 'ArrowRight' || event.key === 'ArrowDown'
    const back = event.key === 'ArrowLeft' || event.key === 'ArrowUp'
    if (!forward && !back) return
    event.preventDefault()
    const at = WORD_IDS.indexOf(id)
    const next = forward
      ? WORD_IDS[(at + 1) % WORD_IDS.length]
      : WORD_IDS[(at + WORD_IDS.length - 1) % WORD_IDS.length]
    onSelect(next)
    words.current[next]?.focus()
  }

  const word = (id: WordId, children: ReactNode) => (
    <button
      ref={node => {
        words.current[id] = node
      }}
      type="button"
      data-word={id}
      className={`question__word question__word--${id} ${selected === id ? 'is-selected' : ''}`}
      onClick={() => onSelect(id)}
      onMouseEnter={() => onPreview(id)}
      onMouseLeave={() => onPreview(null)}
      onFocus={() => onPreview(id)}
      onBlur={() => onPreview(null)}
      onKeyDown={event => step(event, id)}
      aria-pressed={selected === id}
      aria-describedby="lens-help"
    >
      {children}
    </button>
  )

  return (
    <h1 id="question-title" className="question" onPointerMove={track} onPointerLeave={clear}>
      <span className="question__line" style={{ '--i': 0 } as CSSProperties}>
        <span className="question__plain">is Minimax </span>
        {word('m3', 'M3')}
      </span>{' '}
      <span className="question__line" style={{ '--i': 1 } as CSSProperties}>
        {word('good', 'good at')}
      </span>{' '}
      <span className="question__line" style={{ '--i': 2 } as CSSProperties}>
        <span className="question__plain">frontend </span>
        {word('yet', <>yet<span className="question__mark">?</span></>)}
      </span>
    </h1>
  )
}
