import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
  type RefObject,
} from 'react'
import { findNote, NOTES, phraseLines, WORD_IDS, type WordId } from './notes'
import { ControlEdge } from './edge'
import { CropMark, PlateTarget, RegistrationMark, Squeegee } from './marks'
import { Plated } from './plate'
import { inRegister, plateOffset, PULL_REST, PullBed, snapPull } from './pull'

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

const SHORTCUTS = [
  { keys: ['1', '2', '3'], label: 'put a plate up' },
  { keys: ['←', '→'], label: 'nudge the blade' },
  { keys: ['0'], label: 'snap to the gate' },
  { keys: ['esc'], label: 'cover the proof sheet' },
] as const

const prefersStill = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function App() {
  const [active, setActive] = useState<WordId>('good')
  const [hover, setHover] = useState<WordId | null>(null)
  const [section, setSection] = useState<string>('question')
  const [proof, setProof] = useState(false)
  const [reg, setReg] = useState(PULL_REST)
  const [catchTick, setCatchTick] = useState(0)
  const [announce, setAnnounce] = useState('')
  const pressRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const specimenRef = useRef<HTMLDivElement>(null)
  const plateRefs = useRef<Record<string, HTMLButtonElement | null>>({})
  const wasSettled = useRef(false)
  const regRef = useRef(reg)
  regRef.current = reg

  const shown = hover ?? active
  const settled = inRegister(reg)

  const select = useCallback((id: WordId) => {
    setActive(id)
    setHover(id)
    const found = findNote(id)
    setAnnounce(`Plate ${found.index}. ${found.label}. ${found.title}.`)
  }, [])

  /* One source of truth for the plate, and it answers to two questions.
     The true offset -- which every readout follows, the gauge, the control
     strip, the shadows under the cards. And the fringe: the same offset, faded
     as the sheet dries going down the press. The question prints wet, three
     plates plainly apart; the close read beneath it prints dry, which is the
     only reason anyone can read the close read at all.

     The scroll listener is attached once. When the blade moves there is no
     listener to re-attach, just a repaint -- dragging the bed must not churn
     the DOM sixty times a second. */
  const paintPlate = useRef<() => void>(() => {})
  useEffect(() => {
    const root = document.documentElement
    const still = prefersStill()
    let frame = 0

    const sync = () => {
      const { x, y } = plateOffset(regRef.current)
      root.style.setProperty('--reg-x', `${x.toFixed(2)}px`)
      root.style.setProperty('--reg-y', `${y.toFixed(2)}px`)
      const travel = still ? 1 : Math.min(1, window.scrollY / Math.max(1, window.innerHeight * 1.5))
      const dry = travel * travel * (3 - 2 * travel)
      const wet = 1 - dry * 0.88
      root.style.setProperty('--dry', dry.toFixed(3))
      root.style.setProperty('--fringe-x', `${(x * wet).toFixed(2)}px`)
      root.style.setProperty('--fringe-y', `${(y * wet).toFixed(2)}px`)
    }
    paintPlate.current = sync

    const onMove = () => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        sync()
      })
    }

    sync()
    window.addEventListener('scroll', onMove, { passive: true })
    window.addEventListener('resize', onMove)
    return () => {
      window.removeEventListener('scroll', onMove)
      window.removeEventListener('resize', onMove)
      if (frame) cancelAnimationFrame(frame)
      paintPlate.current = () => {}
    }
  }, [])

  /* the blade moved: the whole sheet reprints, at the new offset */
  useEffect(() => {
    paintPlate.current()
  }, [reg, settled])

  useEffect(() => {
    const root = document.documentElement
    root.style.setProperty('--settle', settled ? '1' : '0')
    root.dataset.register = settled ? 'on' : 'off'
  }, [settled])

  /* the moment the three impressions agree, and only then */
  useEffect(() => {
    if (settled && !wasSettled.current) {
      setCatchTick(tick => tick + 1)
      setAnnounce('Ink in register. All three impressions agree.')
    }
    wasSettled.current = settled
  }, [settled])

  /* the pull lands: every colour plate on the sheet flies home, black prints over the top */
  useEffect(() => {
    if (!catchTick) return
    const nodes = [pressRef.current, titleRef.current, specimenRef.current].filter(
      Boolean,
    ) as HTMLElement[]
    if (!nodes.length) return
    const timers = nodes.map(node => {
      node.classList.add('is-catch')
      return window.setTimeout(() => node.classList.remove('is-catch'), 1200)
    })
    return () => {
      timers.forEach(id => window.clearTimeout(id))
      nodes.forEach(node => node.classList.remove('is-catch'))
    }
  }, [catchTick])

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
    /* a printed sheet cannot sit half-inked: if nobody ever scrolls, or a tool
       captures the page whole, let it all show rather than leave holes in it */
    const failsafe = window.setTimeout(() => {
      reveals.forEach(node => node.classList.add('is-in'))
      observer.disconnect()
    }, 2400)
    return () => {
      window.clearTimeout(failsafe)
      observer.disconnect()
    }
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
      if (event.key === '0') {
        event.preventDefault()
        setReg(0)
        return
      }
      /* the legend promises the arrows nudge the blade, so they do — from anywhere
         that has not already claimed them (the bed, a plate, a word in the title) */
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault()
        const reach = event.shiftKey ? 0.5 : 0.12
        setReg(value => snapPull(value + (event.key === 'ArrowRight' ? reach : -reach)))
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

  const walk = (from: WordId, step: number) =>
    WORD_IDS[(WORD_IDS.indexOf(from) + step + WORD_IDS.length) % WORD_IDS.length]

  /* arrow keys walk the radiogroup; focus follows, as a radio group should */
  const nudge = (event: ReactKeyboardEvent<HTMLElement>, id: WordId) => {
    let next: WordId | null = null
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = walk(id, 1)
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = walk(id, -1)
    else if (event.key === 'Home') next = WORD_IDS[0]
    else if (event.key === 'End') next = WORD_IDS[WORD_IDS.length - 1]
    if (!next) return
    event.preventDefault()
    select(next)
    plateRefs.current[next]?.focus()
  }

  return (
    <div className="press" ref={pressRef}>
      <div className="stock" aria-hidden="true">
        <span className="stock__fibre" />
        <span className="stock__grain" />
        <span className="stock__wash" />
        <span className="stock__roller" />
        <span className="stock__sheen" />
        <span className="sprockets" />
      </div>

      <ControlEdge />

      <a className="skip-link" href="#question">Skip to the question</a>

      <header className="slugbar">
        <a className="brand" href="#question" aria-label="Press sheet, back to the question">
          <RegistrationMark className="brand__mark" />
          <span className="brand__text">
            <strong>press sheet · make ready</strong>
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

        <p className="gauge" data-on={settled ? 'on' : 'off'}>
          <span className="gauge__plates" aria-hidden="true">
            <i className="gauge__dot gauge__dot--black" />
            <i className="gauge__dot gauge__dot--pink" />
            <i className="gauge__dot gauge__dot--blue" />
          </span>
          <span className="gauge__read">{settled ? 'in register' : 'off register'}</span>
        </p>
      </header>

      <main className="page">
        <section id="question" className="sheet" aria-labelledby="question-title">
          <p className="slugline sheet__slug">
            <span className="sheet__slug-lead">
              <RegistrationMark className="slugline__mark" />
              the question · set three times · pulled once
            </span>
            <span className="sheet__slug-fact">one sentence · seven words · three impressions</span>
          </p>

          <QuestionTitle
            titleRef={titleRef}
            selected={active}
            hot={shown}
            onSelect={select}
            onPreview={setHover}
          />

          <div className="bedrow">
            <PullBed reg={reg} onSlide={value => setReg(value)} />
          </div>

          <div className="workstrip">
            <p className="workstrip__note">
              <span aria-hidden="true">↳</span> pick a phrase — in the title or on a plate — and the
              sheet follows you
            </p>
            <div className="workstrip__keys">
              <span className="workstrip__label">the blade responds to</span>
              <ul className="keys">
                {SHORTCUTS.map(item => (
                  <li key={item.label}>
                    {item.keys.map(key => (
                      <kbd key={key}>{key}</kbd>
                    ))}
                    <span>{item.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div
            className="plates"
            role="radiogroup"
            aria-label="Which phrase is on the plate"
            aria-describedby="plates-help"
          >
            {NOTES.map(item => (
              <button
                key={item.id}
                type="button"
                role="radio"
                ref={node => {
                  plateRefs.current[item.id] = node
                }}
                tabIndex={item.id === active ? 0 : -1}
                aria-checked={item.id === active}
                className={`plates__row ${item.id === active ? 'is-active' : ''} ${
                  item.id === shown ? 'is-hot' : ''
                }`}
                onClick={() => select(item.id)}
                onMouseEnter={() => setHover(item.id)}
                onMouseLeave={() => setHover(null)}
                onFocus={() => setHover(item.id)}
                onBlur={() => setHover(null)}
                onKeyDown={event => nudge(event, item.id)}
              >
                <span className="plates__num" aria-hidden="true">{item.index}</span>
                <Plated
                  className="plates__stack"
                  render={() => <span className="plates__type">{item.label}</span>}
                />
                <span className="plates__role">{item.gloss}</span>
              </button>
            ))}
          </div>
          <p className="sr-only" id="plates-help">
            Choosing a plate moves the highlight in the title above and the specimen below.
          </p>

          <div className="band">
            <p className="margin-note">
              <span className="margin-note__rule" aria-hidden="true" />
              <span className="margin-note__text">
                The question mark is load-bearing. <em>Give it somewhere to land.</em>
              </span>
            </p>

            <div className="band__say">
              <p className="lede">
                The sentence is short enough to take apart, and short enough to print badly on
                purpose. Every word above is set three times over — black, pink, blue — and the
                plates do not agree with each other until you do something about it.
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
            </div>
          </div>
        </section>

        <section id="close" className="read" aria-labelledby="close-title">
          <header className="read__head reveal">
            <p className="slugline">
              <RegistrationMark className="slugline__mark" />
              close read
            </p>
            <div className="read__intro">
              <h2 id="close-title">One plate, <em>taken apart.</em></h2>
              <p>
                The sentence has three phrases and each one is doing a different job. Take them in
                turn: what the page is being asked, where the type is actually set, and what it
                refuses to finish.
              </p>
            </div>
          </header>

          <Specimen
            stageRef={specimenRef}
            note={findNote(active)}
            onStep={step => select(walk(active, step))}
          />
        </section>

        <section id="answer" className="answer" aria-labelledby="answer-title">
          <div className="answer__grid">
            <div className="answer__copy reveal">
              <p className="slugline">
                <RegistrationMark className="slugline__mark" />
                the short answer
              </p>
              <h2 id="answer-title">One sentence. <em>No speech.</em></h2>
              <p>
                The question does not need a speech. It needs one honest sentence and enough quiet
                around it to land.
              </p>
              <p className="answer__note">Held under the sheet until you pull it.</p>
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
                  <li><span>02</span>Hand: the page hands you the blade. Does the tool actually do something?</li>
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
              Three impressions, deliberately out of register until you take the blade to the gate.
              The sheet prints wet at the top and dries as it goes down the press, so the question
              is three plates arguing and the close read beneath it is one clean voice. The offset
              shadows under the cards are the pink plate, which is why they travel with the blade.
              The wet ink on the bed is drawn in a canvas and the paper tooth is an inline filter —
              nothing here is downloaded. Set with the fonts already on your machine: one grotesque,
              one serif, one mono. No web fonts, no network, nothing stored. Every movement on this
              page is a print decision, and each one stops the moment you ask it to.
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

/** One phrase, magnified: the same three impressions, at reading size. */
function Specimen({
  note,
  stageRef,
  onStep,
}: {
  note: ReturnType<typeof findNote>
  stageRef: RefObject<HTMLDivElement | null>
  onStep: (step: number) => void
}) {
  const lines = phraseLines(note.label, note.drop)

  return (
    <article className="specimen" aria-labelledby="specimen-title" key={note.id}>
      <p className="specimen__slug">
        <span>close read · {note.index} of 03</span>
        <span>{note.measure} · {note.set}</span>
      </p>

      <div ref={stageRef} className={`specimen__stage specimen__stage--${note.id}`}>
        <Plated
          className="specimen__stack"
          render={ghost => (
            <span className="specimen__word">
              {ghost ? null : <span className="sr-only">{note.label}</span>}
              <span className="specimen__main">
                {lines.map(line => (
                  <span
                    key={line}
                    className={line === note.drop ? 'specimen__line specimen__line--drop' : 'specimen__line'}
                  >
                    {line}
                  </span>
                ))}
              </span>
            </span>
          )}
        />

        {note.drop ? <span className="specimen__pad" aria-hidden="true" /> : null}

        <p className="specimen__rule" aria-hidden="true">
          <span className="specimen__rule-count">{note.chars}</span>
          <span className="specimen__rule-word">{note.measure}</span>
        </p>

        <span className="specimen__reg" aria-hidden="true">
          <RegistrationMark />
        </span>
      </div>

      <div className="specimen__body">
        <p className="specimen__gloss">{note.gloss}</p>
        <div className="specimen__lede">
          <h3 id="specimen-title">{note.title}</h3>
          <p className="specimen__copy">{note.body}</p>
        </div>
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

      <div className="specimen__foot">
        <p className="specimen__prompt"><span aria-hidden="true">↳</span> {note.prompt}</p>
        <p className="specimen__turn">
          <button type="button" onClick={() => onStep(-1)}>← back</button>
          <button type="button" onClick={() => onStep(1)}>next plate →</button>
        </p>
      </div>
    </article>
  )
}

function QuestionTitle({
  titleRef,
  selected,
  hot,
  onSelect,
  onPreview,
}: {
  titleRef: RefObject<HTMLHeadingElement | null>
  selected: WordId
  hot: WordId
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

  /* the type leans toward the cursor, and the plates behind it lag a little */
  const track = useCallback((event: ReactPointerEvent<HTMLElement>) => {
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
        el.style.setProperty('--dx', `${(dx * 0.022 * pull).toFixed(2)}px`)
        el.style.setProperty('--dy', `${(dy * 0.02 * pull - pull * 4.5).toFixed(2)}px`)
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
    const here = WORD_IDS.indexOf(id)
    const next = forward
      ? WORD_IDS[(here + 1) % WORD_IDS.length]
      : WORD_IDS[(here + WORD_IDS.length - 1) % WORD_IDS.length]
    onSelect(next)
    words.current[next]?.focus()
  }

  const word = (ghost: boolean) => (id: WordId, children: ReactNode) => {
    const shape = `w w--${id}`
    if (ghost) {
      return <span className={shape}>{children}</span>
    }
    const found = findNote(id)
    return (
      <button
        ref={node => {
          words.current[id] = node
        }}
        type="button"
        className={`${shape} ${selected === id ? 'is-selected' : ''} ${hot === id ? 'is-hot' : ''}`}
        onClick={() => onSelect(id)}
        onMouseEnter={() => onPreview(id)}
        onMouseLeave={() => onPreview(null)}
        onFocus={() => onPreview(id)}
        onBlur={() => onPreview(null)}
        onKeyDown={event => step(event, id)}
        aria-pressed={selected === id}
      >
        {children}
        <span className="sr-only">
          {' '}
          — plate {found.index}, {found.gloss}
        </span>
      </button>
    )
  }

  const lines = (ghost: boolean) => {
    const w = word(ghost)
    return (
      <span className="q__lines">
        <span className="q__line q__line--1" style={{ '--i': 0 } as CSSProperties}>
          <span className="q__plain">is Minimax </span>
          {w('m3', <span className="chip">M3</span>)}
        </span>
        <span className="q__line q__line--2" style={{ '--i': 1 } as CSSProperties}>
          {w('good', 'good at')}
        </span>
        <span className="q__line q__line--3" style={{ '--i': 2 } as CSSProperties}>
          <span className="q__plain">frontend </span>
          {w('yet', <>yet<span className="mark">?</span></>)}
          {/* the rule the question mark lands on. printed three times, it is three
              short stubs until the blade reaches the gate, and then one rule
              running the full measure */}
          <span className="q__land" aria-hidden="true" />
        </span>
      </span>
    )
  }

  return (
    <h1
      id="question-title"
      ref={titleRef}
      className={`question is-on-${hot}`}
      onPointerMove={track}
      onPointerLeave={clear}
    >
      {/* the void the two-column split leaves is not filled with texture: it
          holds the instrument. the same three crosses the control strip carries,
          set large enough to read, reporting the plate from the middle of the
          sheet. at the gate it is one bullseye and nothing else. */}
      <span className="question__gate" aria-hidden="true">
        <PlateTarget className="question__target" />
        <span className="question__gate-read">reg. mark · live read</span>
      </span>
      <Plated className="question__stack" render={lines} />
      <span className="question__wash" aria-hidden="true" />
    </h1>
  )
}
