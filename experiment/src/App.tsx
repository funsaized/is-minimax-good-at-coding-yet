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
import { findNote, NOTES, WORD_IDS, type WordId } from './notes'
import { ControlEdge } from './edge'
import { InkTrap } from './ink'
import { prefersStill } from './motion'
import { CropMark, FoldMark, PlateTarget, RegistrationMark, Squeegee } from './marks'
import { Plated } from './plate'
import { inRegister, plateOffset, PULL_REST, PullBed, snapPull } from './pull'
import { Ream } from './ream'
import { TypeList } from './typelist'

const TITLE = 'is Minimax M3 good at frontend yet?'

/* the passes of a make-ready, and the order you meet them in. roman, not
   arabic: 01–03 already belongs to the three plates, and a page that uses the
   same figures for two different lists has thrown its hierarchy away */
const NAV_ITEMS = [
  { id: 'question', number: 'i', label: 'the question' },
  { id: 'close', number: 'ii', label: 'close read' },
  { id: 'type', number: 'iii', label: 'the type list' },
  { id: 'answer', number: 'iv', label: 'pull the proof' },
] as const

const INKS = [
  { id: 'black', name: 'black', use: 'every word you actually read' },
  { id: 'pink', name: 'fluorescent pink', use: 'the mark, the pull, the ?' },
  { id: 'blue', name: 'federal blue', use: 'the second impression' },
] as const

/* what the press itself answers to. the keys are printed on the bed rather than
   here, because the bed is the only one of the two the reader is already looking
   at when they wonder what they can press. the proof keeps its own pair, and it
   is the one control on the page that is never under the cursor when it is
   wanted. */

/* the press run's own job ticket. every line is a fact about the page, not a
   number anybody has to believe. the type used to be a row here; it is a whole
   section of the sheet now, so this line carries the one fact nothing else says
   out loud — the number the whole page answers to. */
const SLIP = [
  ['sentence', 'is Minimax M3 good at frontend yet? — seven words, three impressions'],
  [
    'stock',
    'newsprint: drum banding, tooth in an inline filter, wet ink on a canvas, one fold below the close read',
  ],
  [
    'register',
    'one number and one ramp: the gate is ±0.14, a unit of blade is 3px of paper, and the ink closes on both as the reader goes down the sheet',
  ],
  ['assets', 'local SVG and CSS only. no web fonts, no network, nothing stored'],
] as const

/* the four mechanisms, in the order you meet them going down the press. each one
   is a fact about the sheet, said once, in the pressman's own voice — the foot
   of a press run is a note about the run, not an essay about printing. */
const MACHINERY = [
  [
    'one number, and one ramp.',
    'Everything out of register on this page is the plate offset: the fringes, the shadows under the cards, the pools in the traps, the gauge, the marks at the ends of the fold, the seam where the press run begins — and how deep the type is pressed into the paper. The short answer is the exception — it prints in register whatever the blade is doing, because it is the one sentence the press is allowed to get right.',
  ],
  [
    'wet, then dry.',
    'The question prints at the press, three plates plainly apart. Two screens further down the same three plates have almost closed on the words, and that arc is the only reason the close read is readable at all. Nothing about it needs a hand from you — climb back to the question and the ink wets up again.',
  ],
  [
    'trapped corners.',
    'Where a stroke lands on a rule the paper notches away, so a pressman fills the notch on purpose. The pools are slivers until the blade reaches the gate, and only the pink plate beads up in a corner.',
  ],
  [
    'stops on request.',
    'Every movement here is a print decision, and each one ends the moment reduced motion is asked for. The blade, the register, the ramp and the traps keep working; nothing flies.',
  ],
] as const

export function App() {
  const [active, setActive] = useState<WordId>('good')
  const [hover, setHover] = useState<WordId | null>(null)
  const [section, setSection] = useState<string>('question')
  const [proof, setProof] = useState(false)
  const [reg, setReg] = useState(PULL_REST)
  const [plateTick, setPlateTick] = useState(0)
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
    setPlateTick(tick => tick + 1)
    const found = findNote(id)
    setAnnounce(`Plate ${found.index}. ${found.label}. ${found.title}.`)
  }, [])

  /* One source of truth for the plate, and it answers to two questions.
     The true offset -- which every readout follows, the gauge, the control
     strip, the shadows under the cards, the marks at the ends of the fold.
     And the ink: how far the spread has closed up, which is the same offset
     taken through a drying ramp. The question prints wet, three plates plainly
     apart; the close read beneath it has had time to settle and is nearly one
     voice, and that arc is the only reason anyone can read the close read.

     Exactly one number does the drying, --ink-close, and it is measured from
     the top of the document rather than from the motion preference: an ink
     ramp is a position, not a journey, so a reader who has asked for stillness
     still gets a sheet that is as dry at the foot of the page as it would have
     been with motion on -- and still opens on the press with the plates plainly
     apart, which is the one thing a still browser must not lose. --dry is left
     to the paper wash, which is the only other thing on the sheet that cares
     how far down the press you are, and it is the one that is allowed to give
     up early.

     The scroll listener is attached once. When the blade moves there is no
     listener to re-attach, just a repaint -- dragging the bed must not churn
     the DOM sixty times a second. */
  const paintPlate = useRef<() => void>(() => {})
  useEffect(() => {
    const root = document.documentElement
    const still = prefersStill()
    let frame = 0

    const ease = (value: number) => value * value * (3 - 2 * value)

    const sync = () => {
      const { x, y } = plateOffset(regRef.current)
      root.style.setProperty('--reg-x', `${x.toFixed(2)}px`)
      root.style.setProperty('--reg-y', `${y.toFixed(2)}px`)
      root.style.setProperty('--fringe-x', `${x.toFixed(2)}px`)
      root.style.setProperty('--fringe-y', `${y.toFixed(2)}px`)

      /* the wash on the paper behind the sheet, which is the only background on
         the page that cools off as the sheet dries */
      const wash = still ? 1 : Math.min(1, window.scrollY / Math.max(1, window.innerHeight * 1.5))
      root.style.setProperty('--dry', ease(wash).toFixed(3))

      /* the ink. three and a bit screens is roughly where the light sheet runs
         out, so the last of the spread is gone by the time the reader reaches
         the type list -- and the short answer below that is printed into paper
         that has already agreed with itself. it eases, because ink does not dry
         at a constant rate, and it is a function of position rather than of
         history, so climbing back to the question wets the sheet up again. */
      const reach = Math.min(1, window.scrollY / Math.max(1, window.innerHeight * 3.2))
      root.style.setProperty('--ink-close', (1 - ease(reach) * 0.88).toFixed(3))
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

      /* the proof has a key of its own, so the sheet can be worked end to end
         without ever having to reach for the pointer */
      if (event.key === 'p' || event.key === 'P') {
        event.preventDefault()
        setProof(value => {
          const next = !value
          setAnnounce(next ? 'The short answer is revealed.' : 'The short answer is covered again.')
          return next
        })
        return
      }
      if (event.key === 'Escape' && proof) {
        event.preventDefault()
        setProof(false)
        setAnnounce('The short answer is covered again.')
        return
      }
      if (event.key === '0') {
        event.preventDefault()
        setReg(0)
        /* the bed reports itself through its own slider role, but this key moves
           it from anywhere on the sheet, so it has to say so as well */
        setAnnounce('Blade snapped to the gate.')
        return
      }
      /* the bed foot promises the arrows nudge the blade, so they do — from
         anywhere that has not already claimed them (the bed, a plate, a word in
         the title) */
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
          {/* the bar reports the plate, so it reports the number too — otherwise
              the reader is told there is a problem and given no way to judge it.
              and it names the plate that is up, because the phrase the reader
              chose forty seconds ago on the other side of the question is not
              anywhere in view from here, and the gauge is the one fixed thing
              they are always looking at. */}
          <span className="gauge__read">
            {settled ? 'in register' : `off ${reg > 0 ? '+' : '−'}${Math.abs(reg).toFixed(2)}`}
          </span>
          <span className="gauge__plate" aria-hidden="true">
            <i className="gauge__pin" key={plateTick} />
            {findNote(active).index}
          </span>
        </p>
      </header>

      <main className="main">
        <div className="page">
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

            {/* the argument belongs under the title, not under the furniture. it is
                the standfirst a spread opens with: what the page is, then the
                instrument it is asking to be handed. */}
            <div className="standfirst">
              <p className="standfirst__note">
                <span className="standfirst__kicker">
                  <RegistrationMark className="standfirst__mark" />
                  on the mark
                </span>
                <span className="standfirst__note-text">
                  The question mark is load-bearing. <em>Give it somewhere to land.</em>
                </span>
              </p>

              <div className="standfirst__say">
                <p className="lede">
                  Seven words — short enough to take apart, short enough to print badly on purpose.
                  Each one is set three times over, black and pink and blue, and the plates refuse to
                  agree with each other until you take the blade in your hand. This page is that
                  argument, printed.
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

            <div className="bedrow">
              <PullBed reg={reg} onSlide={value => setReg(value)} />
            </div>

            {/* the instruction belongs to the thing it is about. it used to be its
                own band of labels between the instrument and the plates, which
                made four short sentences sitting between two panels look like a
                fifth module; the keys are on the bed now, where they work, and
                the one line left is the one thing a reader cannot guess. */}
            <p className="plates__cue">
              <span aria-hidden="true">↳</span> or take the blade and pull a proof — the sheet follows
              you either way
            </p>

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
                    wet={0.6}
                    render={() => <span className="plates__type">{item.label}</span>}
                  />
                  <span className="plates__role">{item.gloss}</span>
                </button>
              ))}
            </div>
            <p className="sr-only" id="plates-help">
              Choosing a plate moves the highlight in the title above, and pulls that sheet to the
              top of the ream below. Keys 1, 2 and 3 pick a plate from anywhere on the sheet.
            </p>
          </section>

          <section id="close" className="read" aria-labelledby="close-title">
            <header className="read__head reveal">
              <p className="slugline">
                <RegistrationMark className="slugline__mark" />
                close read
              </p>
              <div className="read__intro">
                <h2 id="close-title">Three sheets, <em>one at a time.</em></h2>
                <p>
                  The sentence has three phrases and each one is doing a different job. All three
                  are printed: the one you are reading is on top of the ream, the other two are
                  still in it behind. The ink has been setting since the top of the sheet, so by
                  the time you get here the three impressions have almost closed on the words.
                </p>
              </div>
            </header>

            <Ream active={active} stageRef={specimenRef} onStep={step => select(walk(active, step))} />
          </section>
        </div>

        {/* THE FOLD. a press sheet is posted folded, and the fold is a crease
            rather than a cut: the paper is crushed at the line, the ink skips
            there, and the half that curls under is a shade deeper than the half
            that does not. it sits exactly where the sheet changes purpose --
            the close read above it is the argument, the type list below it is
            the proofing -- so the one piece of pure paper on the page is also
            the piece that says where the reader has got to.

            and it carries the register. a target is printed at each end of the
            crease, in the same three plates and at the same offsets as the rest
            of the sheet, so by the time the type around it has dried and closed
            up, the marks at the ends of the fold are the last thing on the page
            still telling the reader where the plates are. */}
        <div className="fold" aria-hidden="true">
          <FoldMark className="fold__mark fold__mark--start" />
          <FoldMark className="fold__mark fold__mark--end" />
        </div>

        <div className="page">
          {/* THE TYPE LIST. the last thing on the light sheet, and the only
              quiet one: a make-ready note rather than a section with a heading,
              because a type list is furniture and furniture does not get a
              heading. three ruled cells, one per face, each a ladder of the
              sizes that face really uses — and each naming the family this
              machine actually resolved, measured at run time. the one step this
              band does not print is the widest on the page: the title is set
              across the full measure, and a second poster in a third of the
              width would undo the only two the sheet is allowed. */}
          <section id="type" className="type" aria-labelledby="type-title">
            <header className="type__head reveal">
              <h2 className="slugline type__slugline" id="type-title">
                <RegistrationMark className="slugline__mark" />
                the type list
                <span className="type__slug-fact">three faces · nothing downloaded</span>
              </h2>
              <p className="type__lede">
                No font file is loaded to set this page — it is set in the three faces the machine
                already has, and spaced so the differences do not show. Each cell prints the widest
                step of every size the page really uses it at, and each then names the family your
                machine resolved, which is a fact about this computer and not an opinion about the
                design.
              </p>
            </header>

            <TypeList reg={reg} />
          </section>
        </div>

        {/* THE PRESS RUN. the light sheet ends and the ink slab begins, and the
            join is the page's whole idea restated one last time: three rules at
            the current plate offset, printed one per plate, sitting a hair apart.
            at the gate they are one line. the answer is pulled down here too, and
            it lands the only way the answer is allowed to land — in register. */}
        <div className={`run ${proof ? 'is-open' : ''}`}>
          <span className="run__seam" aria-hidden="true">
            <i className="run__seam-rule run__seam-rule--black" />
            <i className="run__seam-rule run__seam-rule--pink" />
            <i className="run__seam-rule run__seam-rule--blue" />
          </span>
          <span className="run__glow" aria-hidden="true" />

          <div className="page">
            <section id="answer" className="answer" aria-labelledby="answer-title">
              <div className="answer__grid">
                <div className="answer__copy reveal">
                  <p className="slugline">
                    <RegistrationMark className="slugline__mark" />
                    the short answer
                  </p>
                  <h2 id="answer-title">One sentence. <em>No speech.</em></h2>
                  <p>
                    The question does not need a speech. It needs one honest sentence and enough
                    quiet around it to land.
                  </p>
                  <p className="answer__note">
                    Held under the sheet until you pull it.
                    <span className="answer__key">
                      <kbd>p</kbd> pulls it
                      <span aria-hidden="true">·</span>
                      <kbd>esc</kbd> covers it
                    </span>
                  </p>
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
                      aria-keyshortcuts="p"
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

                    {/* the punchline is the second poster on the page, so it is
                        set like one: the same face, the same weight, the same
                        tracking as the question, and no longer than it needs to
                        be. and it is printed by the page's own three plates —
                        except these three are always in register, because the
                        answer is the one sentence the press is allowed to get
                        right. they arrive a hair apart and lock. */}
                    <p className="proof__statement">
                      <Plated
                        className="proof__stack"
                        /* the answer does not answer to the blade, and it does not
                           answer to the ramp either: the sentence the press is
                           allowed to get right is dry before it is ever pulled */
                        wet={0}
                        render={() => (
                          <span className="proof__claim">
                            <span className="proof__claim-a">When the interface has a point of view</span>
                            <span className="proof__claim-b">you can feel,</span>
                            <span className="proof__claim-c">and it knows when to stop moving.</span>
                          </span>
                        )}
                      />
                    </p>

                    {/* the same landing the mark gets on the title: a rule to
                        stand on, and the two corners of it trapped. */}
                    <p className="proof__land" aria-hidden="true">
                      <InkTrap className="proof__trap proof__trap--start" rule={false} />
                      <InkTrap className="proof__trap proof__trap--end" rule={false} />
                    </p>

                    <ol className="proof__tests">
                      {[
                        'Hierarchy: could you name the second most important thing without thinking twice?',
                        'Hand: the page hands you the blade. Does the tool actually do something?',
                        'Restraint: does everything stop moving the moment you stop reading?',
                      ].map((line, index) => (
                        <li key={line} style={{ '--i': index } as CSSProperties}>
                          <span>{String(index + 1).padStart(2, '0')}</span>
                          <p>{line}</p>
                          <svg
                            className="proof__tick"
                            viewBox="0 0 18 18"
                            preserveAspectRatio="xMidYMid meet"
                            aria-hidden="true"
                            focusable="false"
                          >
                            <rect className="proof__tick-box" x="1.5" y="1.5" width="15" height="15" rx="2.6" />
                            <path className="proof__tick-mark" d="M5.1 9.3 7.8 12 12.9 6.1" />
                          </svg>
                        </li>
                      ))}
                    </ol>
                    <p className="proof__coda">
                      And the honest part: any model can write the markup. The difference lives in the
                      hundred small decisions nobody asked for.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
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
            <dl className="colophon__slip">
              {SLIP.map(([term, detail]) => (
                <div className="colophon__slip-row" key={term}>
                  <dt>{term}</dt>
                  <dd>
                    {term === 'sentence' ? <em>{detail}</em> : detail}
                    {term === 'sentence' ? (
                      <span className="colophon__inks">
                        {INKS.map(ink => (
                          <span key={ink.id}>
                            <i
                              className={`colophon__swatch colophon__swatch--${ink.id}`}
                              aria-hidden="true"
                            />
                            {ink.name}
                          </span>
                        ))}
                      </span>
                    ) : null}
                  </dd>
                </div>
              ))}
            </dl>

            <ul className="colophon__machine">
              {MACHINERY.map(([lead, rest]) => (
                <li key={lead}>
                  <strong>{lead}</strong> {rest}
                </li>
              ))}
            </ul>
          </div>

          <div className="colophon__foot">
            <a className="colophon__return" href="#question">
              <span aria-hidden="true">↑</span> back to the question
            </a>
            <p className="colophon__closing">
              <CropMark className="colophon__crop" />
              The experiment is the page.
            </p>
          </div>
        </div>
      </footer>

      <span className="sr-only" aria-live="polite">{announce}</span>
    </div>
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
        aria-current={selected === id}
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
              running the full measure — and the two corners where it meets the
              trim are ink traps, so they fill as the sheet comes into register */}
          <span className="q__land" aria-hidden="true">
            <InkTrap className="q__trap q__trap--start" rule={false} />
            <InkTrap className="q__trap q__trap--end" rule={false} />
          </span>
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
      <Plated className="question__stack" wet={1} render={lines} />
      <span className="question__wash" aria-hidden="true" />
    </h1>
  )
}
