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
import { Sheetbar } from './paper'
import { Plated } from './plate'
import { inRegister, plateOffset, PULL_REST, PullBed, snapPull } from './pull'
import { Pullsheet } from './pullsheet'
import { Ream } from './ream'
import { Ruling } from './ruling'
import { Signoff } from './signoff'
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

/* the pass a cross-reference takes you to, taken from the index itself. a sheet
   refers to another part of itself by its pass number and by nothing else, and
   the two numbers below are read out of the list at the top of the file rather
   than typed again, so a pass can be renumbered in one place. */
const passOf = (id: string) => NAV_ITEMS.find(item => item.id === id)?.number ?? ''

/* the way on, printed as one mark twice over: an arrow is the press, so it is
   pink here exactly as it is everywhere else on the sheet */
const ARROW = (
  <svg className="xlink__arrow" viewBox="0 0 20 20" aria-hidden="true" focusable="false">
    <path
      d="M4 10h11M10.5 4.5 16 10l-5.5 5.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

/* THE SHORT ANSWER, AS SET. one place for the sentence, because the sheet prints
   it twice — once on the slab where it is read, and once as a shadow of itself on
   the far side of the stock, where you can see it before anybody has pulled
   anything. two copies of a punchline that are allowed to disagree is a way of
   making sure one of them is wrong. */
const CLAIM = [
  'When the interface has a point of view',
  'you can feel,',
  'and it knows when to stop moving.',
] as const

/* the three tests the answer sets for itself. they used to be printed inside the
   proof, which put the only criteria the page ever states behind a card and
   then behind a sheet of newsprint: a grey ghost on a wide screen, a grey ghost
   two words wide on a phone. they stand in the slab now, in the light, beside
   the sentence they are testing — and they stamp off in the press's own order
   the moment the proof is pulled. */
const CHECKS = [
  'Hierarchy: could you name the second most important thing without thinking twice?',
  'Hand: the page hands you the blade. Does the tool actually do something?',
  'Restraint: does everything stop moving the moment you stop reading?',
] as const

/* THE LADDER, AS A LADDER. the sheet claims, in three places, that it has two
   poster sizes and nothing in between louder than a section head — and then said
   it as one run-on sentence stranded in the first column of a ruled band, with
   eight hundred pixels of empty sheet to the right of it. so the claim is a list
   now: the five steps of the scale in the order they are set, read out of the
   tokens the sheet actually sets them in, with the figures in the ink every
   measured thing on this page is printed in. */
const SCALE = [
  { token: '--question', role: 'the question', size: '7.2rem' },
  { token: '--claim', role: 'the short answer', size: '4.3rem' },
  { token: '--head', role: 'a section head', size: '3.2rem' },
  { token: '--specimen', role: 'the set phrase', size: '2.62rem' },
  { token: '--label', role: 'labels, and only labels', size: '.66rem' },
] as const

/* THE STANDING ARGUMENT. what the sheet says once the verdict is on the table
   above it. this used to be three sentences about the page's own furniture — how
   the title is set, how many plates print it, where the blade lives — which is
   an argument a reader has to already be interested in before it means anything.
   it is now the answer to the title instead, in the plainest voice on the sheet,
   and the furniture explains itself further down where there is room for it. */
const LEDE =
  'And the margin is thin. Any model can write the markup. It is the hundred small decisions nobody asked for — what leads, what gives way, what goes still the moment you stop reading.'

/* the foot of the proof. the standfirst has the honest part now, so the coda
   does the other half of the job: it says what the rest of the page is for and
   hands the reader the one control that answers the question the sheet is set
   in — the register. */
const CODA =
  'The rest of this sheet is the other hundred, made visible. Take the blade and the sentence comes into register.'

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
    'newsprint: drum banding, tooth in an inline filter, wet ink on a canvas, one fold below the close read, and thin enough at the foot of the run to read the answer through',
  ],
  [
    'register',
    'one number and one ramp: the gate is ±0.14, a unit of blade is 3px of paper, and the ink closes on both as the reader goes down the sheet. the gate is magnetic rather than sticky, so it takes the blade about a third of a unit out and the sheet comes into register underneath the hand instead of after it. the pull answers to a second ramp of its own, so the sentence the press is allowed to get right is said at the head of the run and printed at the foot of it, and the two land on the same beat',
  ],
  ['assets', 'local SVG and CSS only. no web fonts, no network, nothing stored'],
] as const

/* the mechanisms, in the order you meet them going down the press. each one
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
    'printed through a screen.',
    'Every colour impression on this sheet is laid down through a rag screen rather than painted as a flat tint, so the pinholes in the ink are the paper showing through it — which is the whole difference between a printed sheet and a styled one. The screen is a property of the press, not of the register, so nothing about it moves when the blade does.',
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
  const [pullTick, setPullTick] = useState(0)
  const [reg, setReg] = useState(PULL_REST)
  const [plateTick, setPlateTick] = useState(0)
  const [catchTick, setCatchTick] = useState(0)
  const [announce, setAnnounce] = useState('')
  const pressRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const specimenRef = useRef<HTMLDivElement>(null)
  const slugRef = useRef<HTMLElement>(null)
  const runRef = useRef<HTMLDivElement>(null)
  const navRef = useRef<HTMLElement>(null)
  const onSlab = useRef(false)
  const plateRefs = useRef<Record<string, HTMLButtonElement | null>>({})
  const wasSettled = useRef(false)
  const wasReady = useRef(false)
  const regRef = useRef(reg)
  regRef.current = reg

  const shown = hover ?? active
  const settled = inRegister(reg)
  /* THE SHEET IS SIGNED OFF. the blade and the pull are two separate pieces of
     machinery and each of them had a reward of its own, which meant a reader could
     work neither, work one, or work both and the page could not tell the three
     apart. so the two are given a joint condition — the plates agree AND the proof
     is out — and that is the only state here that says the reader ran the press
     rather than watched it run. it prints one chop on the proof sheet, and it is
     said in plain words at the foot of the run, where somebody who never opened the
     proof can still read it. */
  const ready = settled && proof
  /* which of the three cells of the case the blade is standing over. read out of
     the same list the cells are printed from, so a plate cannot be on the bed and
     off the case at the same time */
  const plateSeat = Math.max(0, WORD_IDS.indexOf(active))

  const select = useCallback((id: WordId) => {
    setActive(id)
    setHover(id)
    setPlateTick(tick => tick + 1)
    const found = findNote(id)
    setAnnounce(`Plate ${found.index}. ${found.label}. ${found.title}.`)
  }, [])

  /* THE PULL, FROM EITHER END. the proof can be pulled from the key it prints on
     the proof sheet or from the key it prints beside the answer, and both of them
     have to travel the same road: the sheet is pressed, not just the card. one
     callback so the whole-sheet blade and the word on --land can never come apart
     and leave a reader pressing the key and watching nothing cross the page. */
  const pullProof = useCallback((next: boolean) => {
    setProof(next)
    if (next) setPullTick(tick => tick + 1)
    setAnnounce(next ? 'The proof is pulled. The short answer is set.' : 'The proof is covered again.')
  }, [])

  /* and the blade is taken off the sheet once it has dried, so a reader who has
     pulled the answer twenty times is not holding twenty full-viewport layers */
  useEffect(() => {
    if (!pullTick) return
    const gone = window.setTimeout(() => setPullTick(0), 2400)
    return () => window.clearTimeout(gone)
  }, [pullTick])

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
    /* where the sheet turns over, and how tall the trim edge is. both are
       measured rather than read per frame, because the scroll handler is
       already writing custom properties and a layout read after a write costs
       the reader a frame */
    let runTop = Infinity
    let barH = 0

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

      /* and the sheet turns over at the seam. a position and not a state, so it
         does not need motion to work and it does not care which way the reader
         came past the line. */
      const on = window.scrollY + barH > runTop
      if (on !== onSlab.current) {
        onSlab.current = on
        if (on) root.dataset.slab = 'on'
        else delete root.dataset.slab
      }
    }
    paintPlate.current = sync

    const onMove = () => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        sync()
      })
    }

    const remeasure = () => {
      const bar = slugRef.current?.getBoundingClientRect()
      const run = runRef.current?.getBoundingClientRect()
      if (bar) barH = bar.height
      /* the seam is a place in the document, and the document can be scrolled
         while it is being measured, so the box is put back where it was found */
      if (run) runTop = window.scrollY + run.top
      onMove()
    }

    /* the bar is its own size and everything above the seam feeds the height of
       the page, so these two observers between them catch every layout the
       reader could produce -- a rotated phone, a wrapped slug, a type list that
       measured its own face a beat later -- without the scroll listener ever
       asking the page where anything is */
    const measure =
      typeof ResizeObserver === 'function' ? new ResizeObserver(remeasure) : null
    if (measure) {
      if (slugRef.current) measure.observe(slugRef.current)
      measure.observe(document.body)
    }

    remeasure()
    window.addEventListener('scroll', onMove, { passive: true })
    window.addEventListener('resize', remeasure)
    return () => {
      window.removeEventListener('scroll', onMove)
      window.removeEventListener('resize', remeasure)
      if (frame) cancelAnimationFrame(frame)
      measure?.disconnect()
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

  /* THE PULL, ON THE WHOLE SHEET. --land is the second ramp on the page, and it
     is the answer's own: 0 while the proof is covered, 1 once the reader has
     pulled it. nothing on the light sheet answers to the blade, so nothing up
     here moves when the blade moves — but the verdict in the standfirst above is
     the same four words the proof is stamped with, and when the proof lands the
     sheet has been pressed, so the rule under the verdict runs the full width of
     the argument, the ink gathers in both its corners and the sentence takes the
     same impression the poster takes at the gate.

     one number, written on the root, so the two ends of the page land on the
     same beat and neither has to know about the other. */
  useEffect(() => {
    const root = document.documentElement
    root.style.setProperty('--land', proof ? '1' : '0')
    root.dataset.pulled = proof ? 'on' : 'off'
  }, [proof])

  /* the moment the three impressions agree, and only then */
  useEffect(() => {
    if (settled && !wasSettled.current) {
      setCatchTick(tick => tick + 1)
      setAnnounce('Ink in register. All three impressions agree.')
    }
    wasSettled.current = settled
  }, [settled])

  /* THE SIGN-OFF, and the only place on the sheet where the two halves of the press
     are asked about each other. one attribute on the root, so the chop on the proof
     and the line at the foot of the run are the same fact rather than two copies of
     it, and said once, because a stamp that lands without a word is a stamp the
     reader is told about rather than shown. */
  useEffect(() => {
    document.documentElement.dataset.ready = ready ? 'on' : 'off'
    if (ready && !wasReady.current) {
      setAnnounce('Signed off. The proof is pulled and the plates are in register.')
    }
    wasReady.current = ready
  }, [ready])

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

  /* THE INDEX FOLLOWS THE READER. below 1180 the slug is a scrolling strip, which
     is the right answer for four caps slugs in the mono on a phone — and it means
     the pass the reader is standing in can sit off the end of the bar, under a
     hairline mask, telling them nothing. so the bar brings the current pass back
     into view when it changes, and only when there is genuinely somewhere to go:
     a strip that fits is left exactly as it was printed. */
  useEffect(() => {
    const nav = navRef.current
    if (!nav || nav.scrollWidth <= nav.clientWidth + 1) return
    const here = nav.querySelector<HTMLAnchorElement>('[aria-current="location"]')
    if (!here) return
    const want = here.offsetLeft - (nav.clientWidth - here.offsetWidth) / 2
    nav.scrollTo({
      left: Math.max(0, want),
      behavior: prefersStill() ? 'auto' : 'smooth',
    })
  }, [section])

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
        pullProof(!proof)
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
  }, [proof, pullProof, select])

  const walk = (from: WordId, step: number) =>
    WORD_IDS[(WORD_IDS.indexOf(from) + step + WORD_IDS.length) % WORD_IDS.length]

  /* arrow keys walk the radiogroup; focus follows, as a radio group should.

     and the walk is claimed outright: the bed's own promise that the arrows nudge
     the blade is kept on the window, so without stopping the event here a reader
     who put a plate on with the arrow keys also moved the blade half a unit on the
     way — two machines answering one key, one of them silently. */
  const nudge = (event: ReactKeyboardEvent<HTMLElement>, id: WordId) => {
    let next: WordId | null = null
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = walk(id, 1)
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = walk(id, -1)
    else if (event.key === 'Home') next = WORD_IDS[0]
    else if (event.key === 'End') next = WORD_IDS[WORD_IDS.length - 1]
    if (!next) return
    event.preventDefault()
    event.stopPropagation()
    select(next)
    plateRefs.current[next]?.focus()
  }

  return (
    <div className="press" ref={pressRef}>
      {/* the room, not the paper: the key light, the tooth, the press's own
          bloom in the stock, the roller — and the lamp, which is the one layer
          here that answers to the register rather than to the light. */}
      <div className="stock" aria-hidden="true">
        <span className="stock__fibre" />
        <span className="stock__grain" />
        <span className="stock__wash" />
        <span className="stock__roller" />
        <span className="stock__lamp" />
        <span className="stock__sheen" />
        <span className="sprockets" />
      </div>

      <ControlEdge />

      {/* the pull, on the whole sheet rather than inside the last card. it is
          mounted only for the length of the drag and keyed on the count, so two
          pulls in a row are two pulls rather than one that never restarted */}
      {pullTick ? <Pullsheet key={pullTick} /> : null}

      <a className="skip-link" href="#question">Skip to the question</a>

      <header className="slugbar" ref={slugRef}>
        <a className="brand" href="#question" aria-label="Press sheet, back to the question">
          <RegistrationMark className="brand__mark" />
          <span className="brand__text">
            <strong>press sheet · make ready</strong>
            <small>black · fluorescent pink · federal blue</small>
          </span>
        </a>

        <nav className="nav" aria-label="Page sections" ref={navRef}>
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

        {/* THE READOUT IS A WAY TO THE INSTRUMENT.

            the bar reports the plate, so it reports the number too — otherwise
            the reader is told there is a problem and given no way to judge it.
            and it names the plate that is up, because the phrase the reader
            chose forty seconds ago on the other side of the question is not
            anywhere in view from here, and the gauge is the one fixed thing
            they are always looking at.

            and it was a readout about something four screens down the sheet: the
            reader was told the press was off register by a unit and a bit, and
            the blade that fixes it was under a poster, a job ticket and a
            paragraph of argument. so the whole gauge is the way to the bed. it
            says the number, it says which plate is up, and it is a link, and
            from anywhere on the page — from the answer, from the type list, from
            the middle of the close read — one press of it puts the blade under
            the reader's hand. the sheet's own third test is that the page hands
            you the blade, and the hand-off used to be somewhere else. */}
        <a className="gauge" data-on={settled ? 'on' : 'off'} href="#bed">
          <span className="gauge__plates" aria-hidden="true">
            <i className="gauge__dot gauge__dot--black" />
            <i className="gauge__dot gauge__dot--pink" />
            <i className="gauge__dot gauge__dot--blue" />
          </span>
          <span className="gauge__read">
            {settled ? 'in register' : `off ${reg > 0 ? '+' : '−'}${Math.abs(reg).toFixed(2)}`}
          </span>
          <span className="gauge__plate" aria-hidden="true">
            <i className="gauge__pin" key={plateTick} />
            {findNote(active).index}
          </span>
          <span className="gauge__to" aria-hidden="true">↓</span>
          <span className="sr-only"> — the press bed, further down the sheet</span>
        </a>
      </header>

      <main className="main">
        <div className="page">
          {/* the armature, one step back: this is the sheet carrying the poster,
              and the grid underneath a headline is the loudest thing on a
              press sheet after the headline itself */}
          <Ruling veil />
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

            {/* THE PLATE CASE, DIRECTLY UNDER THE POSTER.

                it used to be the last thing in this band, under the standfirst
                and under the press bed — which put the only choice on the whole
                sheet a paragraph and an instrument away from the one thing it
                changes. the reader arrived at the question, read some argument,
                played with a machine they had not been told what it was for, and
                only then found the three phrases. on a phone that was three
                screens, and the bed is a tall one.

                so the order is now the order the eye wants: the poster, the three
                plates that are set from it, the argument, and then the blade that
                prints all of it. the bed keeps the place the stylesheet has been
                claiming for it all along — immediately under the argument,
                bringing its own frame, with no rule between them — and the
                argument keeps the place it was given, which is over the type.

                the cue under the slug now points forward rather than sideways, and
                the help text says the title is above the reader instead of below. */}
            <header className="plates__head">
              <p className="slugline">
                <RegistrationMark className="slugline__mark" />
                the plate on the bed
              </p>
              <p className="plates__cue">
                <span aria-hidden="true">↳</span> one at a time — the blade is further down the
                sheet
              </p>
            </header>

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
                  {/* the case states each plate in one line before it sets it:
                      the figure, which is a count and so is blue, and the job the
                      phrase does in the sentence. the count of the run goes under
                      the setting, where the specimen measures the same run at
                      four times the size — so a reader choosing a plate knows what
                      they are choosing without having to go and look. */}
                  <span className="plates__meta">
                    <span className="plates__num" aria-hidden="true">{item.index}</span>
                    <span className="plates__gloss">{item.gloss}</span>
                  </span>
                  <Plated
                    className="plates__stack"
                    wet={0.6}
                    render={() => <span className="plates__type">{item.label}</span>}
                  />
                  <span className="plates__count" aria-hidden="true">{item.measure}</span>
                </button>
              ))}

              {/* THE BLADE. one squeegee on the top rule of the case, and it
                  travels to whichever cell is up — so putting a different plate
                  on the press is a pass of the blade across the bed, which is
                  what it is, instead of three separate bars snapping on and off
                  in three places at once. it is a single element positioned off
                  one number rather than three elements cross-fading, so the ink
                  keeps its direction: the leading edge is the end the reader
                  came from, and the mark is a wedge for the same reason the
                  wedge under a word in the title is a wedge.

                  and on a phone the case is three stacked lines of a form rather
                  than three columns, so the blade turns with it and runs down
                  the left edge. one mark, two orientations — the same answer the
                  job ticket already gave its own rules. */}
              <span
                className="plates__blade"
                style={{ '--blade': plateSeat } as CSSProperties}
                aria-hidden="true"
              />
            </div>
            <p className="sr-only" id="plates-help">
              Choosing a plate lights that phrase in the title above you, and pulls its sheet to the
              top of the ream below. Keys 1, 2 and 3 pick a plate from anywhere on the sheet.
            </p>

            {/* THE ANSWER, IN THE FIRST SCREEN.

                the argument belongs under the title, not under the furniture. it is
                the standfirst a spread opens with, and for a long time the
                standfirst was three sentences about the page's own machinery — how
                the title is set, how many plates print it, where the blade lives.
                which meant the one page in the document whose whole job is
                answering a question spent its first screen describing itself, and
                did not answer it until six screens down, in the faintest ink a
                press can lay, behind a cover.

                so the verdict is said here, in the first screen, in the same words
                the proof sheet is stamped with at the foot of the run: the same
                four-word answer, set by the same two voices on one baseline, under
                the same rule the question mark lands on. and the band finally
                opens the way every other band on the light sheet opens — on the
                2px rule, with a slug and a fact on it — because it is a band now
                and not a paragraph somebody parked above a machine. */}
            <div className="standfirst">
              <p className="slugline standfirst__slug">
                <span className="standfirst__slug-lead">
                  <RegistrationMark className="slugline__mark" />
                  the answer, said once
                </span>
                <span className="standfirst__slug-fact">and printed once, at the foot of the run</span>
              </p>

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
                {/* THE VERDICT. one line, and it is the line the proof sheet is
                    stamped with six screens down — the sheet keeps the two copies
                    of it in register by hand, which is the joke and the mechanic at
                    once.

                    set as a lockup rather than a run of words: the verb in the
                    press voice at the claim step, the rest of the sentence in the
                    reading voice on the same baseline, so the page hands the
                    question over to itself in two typefaces. and the rule beneath
                    it is the poster's landing rule at a third of the size — a
                    short stub while the answer is only spoken, and then, the beat
                    the reader pulls the proof at the other end of the page, the
                    full width of the argument with the ink pooled in both corners,
                    because a sheet that has been pressed draws a full rule. same
                    number, same traps, same landing as the title and the proof. */}
                <p className="verdict">
                  <span className="verdict__bloom" aria-hidden="true" />
                  <span className="verdict__yes">yes</span>
                  <span className="verdict__rest">— with a hand.</span>
                  <span className="verdict__land" aria-hidden="true">
                    <InkTrap className="verdict__trap verdict__trap--start" rule={false} />
                    <InkTrap className="verdict__trap verdict__trap--end" rule={false} />
                  </span>
                </p>

                <p className="lede">{LEDE}</p>
              </div>

              {/* THE WAY ON. the standfirst used to end in the last two rounded
                  rectangles on the page, which is a poor contradiction of an
                  argument that the whole sheet is not a web app. so the way on
                  is a way on: a kicker, and two ruled cross-references in the
                  furniture face, each carrying the number of the pass it takes
                  you to. the reader is not asked to trust that the page has
                  somewhere to go — the number is read out of the index at the
                  top of the bar, and it is the same numbering all the way
                  through.

                  and it is not under the argument either. the standfirst was
                  printing the note in three columns, the lede in nine and the
                  way on under the lede, which left the last four columns of the
                  type area with nothing on them at all — a band that stops two
                  thirds of the way across a ruled sheet reads as a band that ran
                  out of ideas. so the way on takes the last four columns, which
                  is a division like any other, and the three parts read in the
                  order the eye goes: what to notice, what the page says, where
                  to go next. */}
              <nav className="xlinks" aria-label="Where to go next">
                <p className="xlinks__kicker">
                  <span aria-hidden="true">↳</span> where to next
                </p>
                <a className="xlink" href="#close">
                  {ARROW}
                  <span className="xlink__label">read it closely</span>
                  <span className="xlink__to" aria-hidden="true">{passOf('close')}</span>
                </a>
                <a className="xlink xlink--quiet" href="#answer">
                  {ARROW}
                  <span className="xlink__label">go to the pulled answer</span>
                  <span className="xlink__to" aria-hidden="true">{passOf('answer')}</span>
                </a>
              </nav>
            </div>

            <div className="bedrow" id="bed">
              <PullBed reg={reg} onSlide={value => setReg(value)} />
            </div>
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
          {/* the far side of the fold is ruled the same way the near side was: the
              sheet was folded once and the ruling goes through the crease, so the
              type list is set in the same type area the question was */}
          <Ruling />
          {/* THE TYPE LIST. the last thing on the light sheet, and the only
              quiet one: a make-ready note rather than a section with a heading,
              because a type list is furniture and furniture does not get a
              heading. three ruled cells, one per face, each a ladder of the
              sizes that face really uses — and each naming the family this
              machine actually resolved, measured at run time. the one step this
              band does not print is the widest on the page: the title is set
              across the full measure, and a second poster in a third of the
              width would undo the only two the sheet is allowed.

              and the band no longer runs out two thirds of the way across. it
              printed a slug across the whole measure, then a paragraph in the
              first six columns and nothing at all in the last six — which on a
              ruled sheet is not restraint, it is a band that ran out of ideas
              with the column rules going on right through the hole. so the
              claim the band has been making in three places, that the scale has
              two posters and nothing louder than a head in between, is printed
              as a ladder in the columns the paragraph gave up. */}
          <section id="type" className="type" aria-labelledby="type-title">
            <header className="type__head reveal">
              <h2 className="slugline type__slugline" id="type-title">
                <RegistrationMark className="slugline__mark" />
                the type list
                <span className="type__slug-fact">three faces · nothing downloaded</span>
              </h2>
              <div className="type__intro">
                <p className="type__lede">
                  No font file is loaded to set this page — it is set in the three faces the machine
                  already has, and spaced so the differences do not show. Each cell prints the widest
                  step of every size the page really uses it at, and each then names the family your
                  machine resolved, which is a fact about this computer and not an opinion about the
                  design.
                </p>

                <section className="scale" aria-labelledby="scale-title">
                  <h3 className="scale__kicker" id="scale-title">
                    <RegistrationMark className="scale__mark" />
                    the scale, in order
                  </h3>
                  <ol className="scale__list">
                    {SCALE.map((step, index) => (
                      <li key={step.token} style={{ '--i': index } as CSSProperties}>
                        <span className="scale__token">{step.token}</span>
                        <span className="scale__role">{step.role}</span>
                        <span className="scale__size">{step.size}</span>
                      </li>
                    ))}
                  </ol>
                  <p className="scale__note">
                    <span aria-hidden="true">↳</span> two posters, then a head, then a specimen.
                    the figures are blue because they are measurements.
                  </p>
                </section>
              </div>
            </header>

            <TypeList reg={reg} />
          </section>

          {/* THE FOOT OF THE SHEET. a sheet has a foot margin and a slug in it,
              and this one had nothing: the type list ended, and then there was
              bare stock until the ink slab began. that is a hole, not an end.

              and it is the last place on the light sheet where the plates are
              still wide open. by now the type above has dried to a twelfth of
              the press offset, the ruling has almost closed on itself, and the
              three flats standing here are still riding the true offset — the
              three marks the press keeps for itself, printed at the foot of the
              sheet where they can be read without reading anything at all.

              and at the gate they fuse: the black flat takes the pink and the two
              colour flats go, which is the reward the gauge and the bar already
              give, said one last time by the three smallest marks on the page. */}
          <footer className="sheetfoot">
            <p className="sheetfoot__edge">
              <span className="sheetfoot__flats" aria-hidden="true">
                <i className="sheetfoot__flat sheetfoot__flat--black" />
                <i className="sheetfoot__flat sheetfoot__flat--pink" />
                <i className="sheetfoot__flat sheetfoot__flat--blue" />
              </span>
              end of the light sheet
            </p>
            <p className="sheetfoot__next">
              said once at the head of the sheet, printed once below, in register
            </p>
          </footer>
        </div>

        {/* THE PRESS RUN. the light sheet ends and the ink slab begins, and the
            join is the page's whole idea restated one last time: three rules at
            the current plate offset, printed one per plate, sitting a hair apart.
            at the gate they are one line. the answer is pulled down here too, and
            it lands the only way the answer is allowed to land — in register. */}
        <div className={`run ${proof ? 'is-open' : ''}`} ref={runRef}>
          <span className="run__seam" aria-hidden="true">
            <i className="run__seam-rule run__seam-rule--black" />
            <i className="run__seam-rule run__seam-rule--pink" />
            <i className="run__seam-rule run__seam-rule--blue" />
          </span>
          <span className="run__glow" aria-hidden="true" />

          {/* the ink slab is ruled too. it cannot multiply — there is no paper
              under it to darken — so the same three rules are printed as light
              on it, and they ride the blade rather than the drying ramp, because
              by the time the reader is this far down the press the sheet has
              already dried. */}
          <Ruling tone="slab" />

          <div className="page">
            <section id="answer" className="answer" aria-labelledby="answer-title">
              <div className="answer__grid">
                <div className="answer__copy reveal">
                  <p className="slugline">
                    <RegistrationMark className="slugline__mark" />
                    the answer, pulled
                  </p>
                  <h2 id="answer-title">One sentence. <em>No speech.</em></h2>
                  <p>
                    The question does not need a speech. It needs one honest sentence and enough
                    quiet around it to land.
                  </p>

                  {/* THE RUBRIC. the three tests used to be set inside the proof,
                      which is the one place on the page where nothing can be
                      read: behind a card, and then behind a sheet of newsprint,
                      and on a phone behind a card two words wide. they are the
                      only criteria the page ever states about itself, so they
                      stand out here instead, in the slab's own light, in the
                      column that carries the argument — and they stamp off in
                      the press's order when the proof is pulled, which is the
                      moment they were written for. */}
                  <section className="rubric" aria-labelledby="rubric-title">
                    <h3 className="rubric__kicker" id="rubric-title">
                      <span aria-hidden="true">↳</span> and the three things it is checked against
                    </h3>
                    <ol className="rubric__list">
                      {CHECKS.map((line, index) => (
                        <li key={line} style={{ '--i': index } as CSSProperties}>
                          <span>{String(index + 1).padStart(2, '0')}</span>
                          <p>{line}</p>
                          <svg
                            className="rubric__tick"
                            viewBox="0 0 18 18"
                            preserveAspectRatio="xMidYMid meet"
                            aria-hidden="true"
                            focusable="false"
                          >
                            <rect className="rubric__tick-box" x="1.5" y="1.5" width="15" height="15" rx="2.6" />
                            <path className="rubric__tick-mark" d="M5.1 9.3 7.8 12 12.9 6.1" />
                          </svg>
                        </li>
                      ))}
                    </ol>
                  </section>

                  <p className="answer__note">
                    The words come through the stock before you pull it.
                    <span className="answer__key">
                      <kbd>p</kbd> pulls it
                      <span aria-hidden="true">·</span>
                      <kbd>esc</kbd> covers it
                    </span>
                  </p>
                </div>

                <div className={`proof ${proof ? 'is-open' : ''}`}>
                  {/* the same trim mark the close read wears, on the proof's own
                      foot margin. the proof is the second piece of paper on the
                      page and it was the only one whose edge said nothing about
                      the press */}
                  <Sheetbar />

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
                      onClick={() => pullProof(!proof)}
                    >
                      <Squeegee className="toggle__icon" />
                      {proof ? 'sheet back' : 'pull proof'}
                    </button>
                  </div>

                  {/* THE SHOW-THROUGH. the answer is set on a sheet that is lying
                      face down under this one, and newsprint is thin: ink set on
                      it comes through as a soft grey shadow of itself. so the
                      proof was never actually hidden — the reader could see the
                      whole sentence sitting there under the sheet, out of focus
                      and half-lit, and pulling the proof is not a reveal. it is
                      a print. the same words, the same three lines, coming into
                      focus in the exact box the ghost was standing in.

                      and because both copies occupy the same box, nothing on the
                      page moves when the proof is pulled. the card reserves the
                      room the proof needs either way, so a reader who pulls it
                      halfway down the sheet is not yanked by their own hand — the
                      one jump the old card made is the one jump this removes. */}
                  <div className="proof__stage">
                    <span className="proof__cover" aria-hidden="true" />

                    <div className="proof__held" aria-hidden="true">
                      <ProofSheet through />
                      <p className="proof__through">
                        <Squeegee className="proof__through-icon" />
                        <span>showing through the stock</span>
                        <kbd>p</kbd>
                      </p>
                    </div>

                    <div
                      className="proof__window"
                      id="proof-body"
                      role="region"
                      aria-label="The short answer"
                      aria-hidden={!proof}
                    >
                      <ProofSheet />
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      <footer className="colophon">
        <Ruling tone="slab" />
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

            {/* THE SIGN-OFF, IN WORDS. the chop on the proof sheet is the reward for
                finishing the press, and a reward that only exists inside one card is
                a reward only the readers who happen to be looking at that card
                ever find. so the foot of the run says the same thing in the plainest
                voice the sheet owns: what the sheet is waiting for, and the plain
                fact that it is no longer waiting. both halves of the sentence are
                facts about the reader's own hands, and it is the only text on the
                page that changes — which is why it is set to change rather than
                swapped out from under the eye. */}
            <p className="colophon__signoff" data-on={ready ? 'on' : 'off'}>
              <span className="colophon__signoff-box" aria-hidden="true">ok</span>
              <span className="colophon__signoff-text">
                {ready
                  ? 'signed off — the blade is at the gate and the proof is pulled'
                  : 'not signed off — the blade has to reach the gate, and the proof has to be pulled'}
              </span>
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
    /* the same claim as the case below the poster: the title walks its own three
       plates on the arrows, and the blade must not hear about it */
    event.stopPropagation()
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
          {w('yet', (
            <span className="mark">
              ?
              {/* THE DROP. the pad under the mark is where the pause lands, and a
                  pad is only worth printing if something arrives on it — so when
                  the turn is the plate on the press the mark sheds one bead of
                  ink, which falls the height of the pad and is taken by the
                  screen underneath it. one fall per plate, and nothing is left
                  behind it but the pool the sheet was already printing. */}
              <i className="mark__bead" />
            </span>
          ))}
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
      className={`question is-on-${hot} is-up-${selected}`}
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

/**
 * THE PROOF, PRINTED TWICE.
 *
 * The short answer used to live behind a button: a hatched panel, a registration
 * mark and the promise that there was a sentence down there somewhere. That is a
 * gate, and the one thing a page whose job is answering a question should not do
 * is make the reader ask twice before they are told.
 *
 * So it is not behind anything. The answer is set on a sheet lying face down
 * under this one, and newsprint is thin enough that ink shows through it as a
 * soft grey shadow of itself — you can read the whole sentence through the stock
 * before you touch anything, and the panel that used to hold the secret is now
 * holding the sentence.
 *
 * Which is why this is one component and not two. The copy under the sheet and
 * the copy on it have to be the same words in the same box, or pulling the proof
 * is a swap rather than a print, and the reader watches a sentence teleport
 * rather than set. `through` therefore changes the one thing that is genuinely
 * different about the far side of a sheet — the claim is a single faint plate
 * there, not three — and leaves the geometry to the stylesheet.
 */
function ProofSheet({ through = false }: { through?: boolean }) {
  const claim = (
    <span className="proof__claim">
      <span className="proof__claim-a">{CLAIM[0]}</span>
      <span className="proof__claim-b">{CLAIM[1]}</span>
      <span className="proof__claim-c">{CLAIM[2]}</span>
    </span>
  )

  return (
    <>
      {/* THE HEAD LINE OF THE PROOF, AND THE SIGN-OFF.

          the two marks on this sheet sit on one line and are set against each
          other: the sheet says what it thinks at the left, and the pressman says
          what he thinks of it at the right. both of them are in the pink plate,
          because both of them are the press — a verdict about a press sheet, set
          in the ink the press itself uses.

          the row is in both copies of the proof, not just the top one, because the
          shadow under the sheet has to reserve the same space the sheet will use:
          otherwise pulling the proof would shove the poster down a line, and a
          print is not supposed to move the type around it. only the copy on top
          carries the chop, and the chop only prints once the two halves of the
          press agree — see Signoff. */}
      <p className="proof__yes-row">
        <span className="proof__yes">yes — with a hand</span>
        {through ? null : <Signoff />}
      </p>

      {/* the punchline is the second poster on the page, so it is set like one:
          the same face, the same weight, the same tracking as the question, and
          no longer than it needs to be. and it is printed by the page's own three
          plates — except these three are always in register, because the answer
          is the one sentence the press is allowed to get right. they arrive a
          hair apart and lock. */}
      <p className="proof__statement">
        {through ? (
          <span className="proof__stack proof__stack--through">{claim}</span>
        ) : (
          <Plated
            className="proof__stack"
            /* the answer does not answer to the blade, and it does not answer to
               the ramp either: the sentence the press is allowed to get right is
               dry before it is ever pulled */
            wet={0}
            render={() => claim}
          />
        )}
      </p>

      {/* the same landing the mark gets on the title: a rule to stand on, and the
          two corners of it trapped. */}
      <p className="proof__land" aria-hidden="true">
        <InkTrap className="proof__trap proof__trap--start" rule={false} />
        <InkTrap className="proof__trap proof__trap--end" rule={false} />
      </p>

      <p className="proof__coda">{CODA}</p>

      {/* THE FOOT OF THE PROOF. a proof sheet has a slug in its bottom margin
          and this one did not, which left the card with a hundred pixels of
          bare stock under the last line of type — and the light sheet prints
          its own foot two bands above, so the one sheet on the page with the
          most to say had the least furniture. it carries the same three facts
          the run does, and it only prints once the sheet has been pulled. */}
      {through ? null : (
        <p className="proof__foot">
          <span aria-hidden="true">↳</span> the pulled answer · set in register · nothing downloaded
        </p>
      )}
    </>
  )
}
