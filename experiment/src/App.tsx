import {
  useEffect,
  useRef,
  useState,
  useCallback,
  type PointerEvent as ReactPointerEvent,
  type CSSProperties,
  type RefObject,
} from 'react'

// A hand-drawn question mark with a slightly fuller bowl and a longer,
// more confident stem — the quill pressed harder at the bottom of the
// stroke, and the curl at the top of the bowl opens a little more so
// the terminal reads as a deliberate beginning, not a closed loop.
const HERO_PATH =
  'M 62 116 C 62 -10 178 -10 178 116 C 178 180 122 164 122 214 L 122 270'
const HERO_DOT = { cx: 122, cy: 306, r: 17 }

const WIDE_PATH =
  'M 192 348 C 192 0 528 218 528 348 C 528 522 362 472 362 620 L 362 762'
const WIDE_DOT = { cx: 362, cy: 864, r: 51 }

// Deliberate ink-arc spatter: a flourish that reads as one gesture, not noise.
const SPATTER = [
  { angle: 8,  distance: 70,  size: 2.4, delay: 0,   op: 1.0 },
  { angle: 28, distance: 96,  size: 2.0, delay: 18,  op: 0.95 },
  { angle: 48, distance: 118, size: 1.6, delay: 38,  op: 0.85 },
  { angle: 68, distance: 104, size: 1.4, delay: 58,  op: 0.75 },
  { angle: 122, distance: 88,  size: 1.7, delay: 30,  op: 0.8 },
  { angle: 152, distance: 110, size: 2.2, delay: 12,  op: 0.95 },
  { angle: 178, distance: 82,  size: 2.4, delay: 46,  op: 1.0 },
  { angle: 202, distance: 96,  size: 1.5, delay: 70,  op: 0.8 },
  { angle: 232, distance: 116, size: 1.8, delay: 22,  op: 0.9 },
  { angle: 262, distance: 104, size: 1.6, delay: 52,  op: 0.8 },
  { angle: 292, distance: 92,  size: 2.0, delay: 8,   op: 0.9 },
  { angle: 322, distance: 118, size: 1.7, delay: 36,  op: 0.85 },
  { angle: 352, distance: 80,  size: 2.2, delay: 64,  op: 0.95 },
]

// Letter dust — biased toward the question's own letters, with a few
// manuscript abbreviations, so the candle-glow reads as illuminated
// letterforms being typed into the air, not generic embers.
const DUST_GLYPHS = [
  'i', 's', 'm', 'm', 'r', 'n', 't', 'f', 'l', 'a',
  'g', 'o', 'y', 'e', 'd',
  '·', '·', '·', '·', '·',
]

type Whisper = { corner: Corner; text: string }

// Three marginalia — quiet top-left, top-right, and bottom-right.
// The chapter is a question; the margins hold three short notes —
// folio, reading, now — each a different aspect of how the page
// is held open.
const WHISPERS: Whisper[] = [
  { corner: 'tl', text: 'a folio, slowly composed; this page is its own footnote' },
  { corner: 'tr', text: 'the candle is patient; the reader is patient; the page, too — slow down' },
  { corner: 'br', text: 'read at your own pace — the page will not move on without you' },
]

// Catchword — the first word of the (hypothetical) next folio, set as a
// quiet italic at the bottom-right of the frame. A printer's mark that
// signals where the binding continues.
const CATCHWORD = 'respondetur'

const ANSWER =
  '— and the page itself, which you are reading now.'

const REPLY =
  'so read it once, then again — slower this time.'

// Scholastic footnote — a small bilingual marginal gloss written into
// the page after the reply has finished landing. Latin lemma in
// vermilion italic, English gloss in the page's own ink-soft, joined
// by a hand-cut middot. The footnote draws itself in like a scribe's
// late addition to a finished folio — the kind of gloss a careful
// reader might write in centuries after the page was set, connecting
// the reply's invitation to read again with the page's own patience.
const FOOTNOTE_TEXT = 'relege · without a reader, silence'
const FOOTNOTE_ARIA =
  'relege, without a reader, silence — read again, without a reader, silence'
const FOOTNOTE_STAGGER_MS = 38

// The rubricated initial that opens the answer — a small painted "I"
// (for the manuscript em-dash's companion, the verb "imponitur"), set in
// vermilion italic. Reads as the answer being a hand-illuminated reply.
const ANSWER_DROPCAP = 'I'

// Scholastic gloss in vermilion — a single rubricated marginal word
// sitting just outside the hero, the medieval reader's "Qu." (quaeritur).
const MARGINAL_RUBRIC = 'Qu.'

const ANSWER_STAGGER_MS = 34
const REPLY_STAGGER_MS = 26
const INTELLEXI_STAGGER_MS = 78

function useReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])
  return reduced
}

type Particle = {
  x: number
  y: number
  vx: number
  vy: number
  r: number
  a: number
  tone: 'warm' | 'cool' | 'pale'
  glyph: string
  spin: number
}

type Corner = 'tl' | 'tr' | 'bl' | 'br'

function Fleuron() {
  return (
    <svg className="fleuron" viewBox="0 0 160 14" aria-hidden="true">
      <g className="fleuron-rule fleuron-rule-l">
        <line x1="0" y1="7" x2="58" y2="7" pathLength="100" />
      </g>
      <g className="fleuron-rule fleuron-rule-r">
        <line x1="102" y1="7" x2="160" y2="7" pathLength="100" />
      </g>
      <g className="fleuron-dots">
        <circle cx="66" cy="7" r="1.1" />
        <circle cx="94" cy="7" r="1.1" />
      </g>
      <g className="fleuron-ornament">
        <circle cx="80" cy="7" r="3.2" className="fleuron-disc" />
        <path
          className="fleuron-bloom"
          d="M 80 1.4 L 81.9 5 L 85.6 7 L 81.9 9 L 80 12.6 L 78.1 9 L 74.4 7 L 78.1 5 Z"
        />
        <circle cx="80" cy="7" r="0.9" className="fleuron-pip" />
      </g>
    </svg>
  )
}

function FolioMark() {
  return (
    <svg
      className="folio-mark"
      viewBox="0 0 80 58"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="40" cy="5" r="1.4" className="folio-mark-dot" />
      <text
        x="40"
        y="40"
        textAnchor="middle"
        className="folio-mark-letter"
      >
        xviii
      </text>
      <path
        className="folio-mark-flourish"
        d="M 20 50 Q 40 54 60 50"
      />
      <circle cx="14" cy="48" r="0.9" className="folio-mark-pearl" />
      <circle cx="66" cy="48" r="0.9" className="folio-mark-pearl" />
    </svg>
  )
}

// IncipitCaption — a typed-in Latin caption for the rubric line. Opens
// the chapter in the manner of a scholastic marginal gloss.
const INCIPIT_TEXT = 'quaeritur · de fronte'
const INCIPIT_DELAY = 1500
const INCIPIT_STEP = 42

function IncipitCaption() {
  const [on, setOn] = useState(false)
  const [chars, setChars] = useState(0)
  useEffect(() => {
    const t = window.setTimeout(() => setOn(true), INCIPIT_DELAY)
    return () => clearTimeout(t)
  }, [])
  useEffect(() => {
    if (!on) return
    const id = window.setTimeout(
      () => setChars((c) => Math.min(INCIPIT_TEXT.length, c + 1)),
      INCIPIT_STEP,
    )
    return () => clearTimeout(id)
  }, [on, chars])
  const text = on ? INCIPIT_TEXT.slice(0, Math.max(0, chars)) : ''
  return (
    <span className={`incipit ${on ? 'is-on' : ''}`} aria-live="polite">
      <span className="incipit-text">{text}</span>
      {on && chars < INCIPIT_TEXT.length && (
        <span className="incipit-caret" aria-hidden="true">_</span>
      )}
    </span>
  )
}

// IlluminatedStar — a small vermilion asterisk-petal motif painted into
// the bowl of the question mark. Sits inside the bowl, rotates slowly,
// breathes in opacity, and flares when the reader approaches.
function IlluminatedStar() {
  return (
    <svg
      className="illuminated-star"
      viewBox="0 0 60 60"
      aria-hidden="true"
      focusable="false"
    >
      <g className="illuminated-star-petal-group">
        <path
          className="illuminated-star-petal"
          d="M 30 8 L 33.32 22.18 L 48 23.62 L 36 31.91 L 39.94 46 L 30 37.34 L 20.06 46 L 24 31.91 L 12 23.62 L 26.68 22.18 Z"
        />
      </g>
      <g className="illuminated-star-rays">
        <line x1="30" y1="2"  x2="30" y2="14" />
        <line x1="30" y1="46" x2="30" y2="58" />
        <line x1="2"  y1="30" x2="14" y2="30" />
        <line x1="46" y1="30" x2="58" y2="30" />
        <line x1="11" y1="11" x2="19" y2="19" />
        <line x1="41" y1="11" x2="49" y2="19" />
        <line x1="11" y1="49" x2="19" y2="41" />
        <line x1="41" y1="49" x2="49" y2="41" />
      </g>
      <circle cx="30" cy="30" r="3.2" className="illuminated-star-core" />
      <circle cx="30" cy="30" r="1.1" className="illuminated-star-pip" />
    </svg>
  )
}

// Catchword — the printer's bottom-right marker.
function Catchword() {
  return (
    <span className="catchword" aria-hidden="true">
      <span className="catchword-rule" />
      <span className="catchword-caret">›</span>
      <em className="catchword-text">{CATCHWORD}</em>
    </span>
  )
}

// PrinterLeaf — a tiny diamond-and-rule ornament used to flank the
// capitulum running title.
function PrinterLeaf() {
  return (
    <svg
      className="printer-leaf"
      viewBox="0 0 20 10"
      aria-hidden="true"
      focusable="false"
    >
      <line
        x1="0.5"
        y1="5"
        x2="4.5"
        y2="5"
        className="printer-leaf-rule"
        strokeLinecap="round"
      />
      <path
        d="M 6 5 L 10 1.4 L 14 5 L 10 8.6 Z"
        className="printer-leaf-blade"
      />
      <circle cx="10" cy="5" r="0.55" className="printer-leaf-pip" />
      <line
        x1="15.5"
        y1="5"
        x2="19.5"
        y2="5"
        className="printer-leaf-rule"
        strokeLinecap="round"
      />
    </svg>
  )
}

// PrinterDate — a delicate hairline + a typeset "comp. mmxxvi" mark
// that crowns the chapter above the capitulum, the manuscript's quiet
// record of when it was set. Pairs with the horologium at the hero
// (the hour of reading) — this is the year of composition, the
// printer's date that lets a folio know its own place in time.
function PrinterDate() {
  return (
    <p className="printer-date" aria-hidden="true">
      <span className="printer-date-rule" />
      <span className="printer-date-text">
        <em className="printer-date-it">comp.</em>
        <span className="printer-date-sep">·</span>
        <span className="printer-date-num">mmxxvi</span>
      </span>
      <span className="printer-date-rule" />
    </p>
  )
}

// Capitulum — the running title that crowns the chapter.
function Capitulum() {
  return (
    <p className="capitulum" aria-hidden="true">
      <span className="capitulum-mark capitulum-mark-l">
        <PrinterLeaf />
      </span>
      <span className="capitulum-text">
        <span className="capitulum-mono">mss</span>
        <span className="capitulum-sep">·</span>
        <em className="capitulum-it">fol.</em>
        <span className="capitulum-num">xviii</span>
        <span className="capitulum-sep">·</span>
        <em className="capitulum-it">de initiali lucente</em>
      </span>
      <span className="capitulum-mark capitulum-mark-r">
        <PrinterLeaf />
      </span>
    </p>
  )
}

function Bifolio() {
  return (
    <svg
      className="orn-glyph"
      viewBox="0 0 28 20"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M 14 2 L 2 5 L 2 17 L 14 14.5 Z"
        className="glyph-stroke"
      />
      <path
        d="M 14 2 L 26 5 L 26 17 L 14 14.5 Z"
        className="glyph-stroke"
      />
      <line x1="14" y1="2.5" x2="14" y2="14.5" className="glyph-spine" />
      <line x1="4.5" y1="8" x2="11" y2="7.4" className="glyph-rule" />
      <line x1="4.5" y1="10.6" x2="11" y2="10" className="glyph-rule" />
      <line x1="4.5" y1="13.2" x2="11" y2="12.6" className="glyph-rule" />
      <line x1="17" y1="7.4" x2="23.5" y2="8" className="glyph-rule" />
      <line x1="17" y1="10" x2="23.5" y2="10.6" className="glyph-rule" />
      <line x1="17" y1="12.6" x2="23.5" y2="13.2" className="glyph-rule" />
    </svg>
  )
}

// Wax seal — a pressed vermilion monogram "Mm" at the close of the folio.
function WaxSeal() {
  return (
    <svg
      className="wax-seal"
      viewBox="0 0 44 44"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <radialGradient id="wax-shade" cx="38%" cy="36%" r="72%">
          <stop offset="0%"   stopColor="#cd6044" />
          <stop offset="55%"  stopColor="#9c4530" />
          <stop offset="100%" stopColor="#4f2114" />
        </radialGradient>
      </defs>
      <circle cx="22" cy="22" r="20" fill="url(#wax-shade)" />
      <circle
        cx="22"
        cy="22"
        r="20"
        fill="none"
        stroke="rgba(36, 14, 6, 0.55)"
        strokeWidth="0.7"
      />
      <circle
        cx="22"
        cy="22"
        r="15.5"
        fill="none"
        stroke="rgba(255, 210, 180, 0.16)"
        strokeWidth="0.5"
      />
      <text
        x="22"
        y="27"
        textAnchor="middle"
        className="seal-letter"
      >
        Mm
      </text>
      <circle cx="22" cy="9"  r="0.7" fill="rgba(255, 218, 188, 0.45)" />
      <circle cx="22" cy="35" r="0.7" fill="rgba(20, 8, 4, 0.4)" />
    </svg>
  )
}

// GuideRule — a hairline that runs from a margin towards the chapter
// when the reader approaches a marginal note.
function GuideRule({ corner }: { corner: Corner }) {
  return (
    <span className={`guide-rule guide-rule-${corner}`} aria-hidden="true">
      <svg viewBox="0 0 100 100" preserveAspectRatio="xMinYMin meet">
        <line
          className="guide-rule-line"
          x1="0"
          y1="0"
          x2="100"
          y2="100"
          pathLength="100"
        />
        <circle className="guide-rule-dot" cx="100" cy="100" r="2.6" />
      </svg>
    </span>
  )
}

function PaperGrain() {
  return (
    <svg className="paper-grain" aria-hidden="true" focusable="false">
      <defs>
        <filter id="pg-noise">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.85"
            numOctaves="2"
            stitchTiles="stitch"
            seed="7"
          />
          <feColorMatrix
            values="0 0 0 0 0.94
                    0 0 0 0 0.86
                    0 0 0 0 0.66
                    0 0 0 0.55 0"
          />
        </filter>
      </defs>
      <rect width="100%" height="100%" filter="url(#pg-noise)" />
    </svg>
  )
}

// ReadingLantern — a soft warm halo that follows the cursor, like a
// reader's attention bringing its own light to the page. Fades in on
// the first pointermove and tracks every subsequent one; fades out
// shortly after the reader's attention drifts away. Hidden on touch
// devices in steady state, since there is no cursor to follow once a
// finger lifts. Falls back to the candle's position via CSS defaults
// when idle, so the page still feels lit even before the reader
// arrives. A second, softer halo trails the cursor with eased lag,
// so the reader's passage leaves a brief trace of warm light on the
// parchment — the page quietly records the path of attention.
function ReadingLantern() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let raf = 0
    let hideTimer = 0
    let trailRaf = 0
    let trailX = window.innerWidth / 2
    let trailY = window.innerHeight / 2
    let currX = trailX
    let currY = trailY
    const show = () => {
      if (!el.classList.contains('is-on')) el.classList.add('is-on')
      if (hideTimer) {
        window.clearTimeout(hideTimer)
        hideTimer = 0
      }
    }
    const scheduleHide = () => {
      if (hideTimer) window.clearTimeout(hideTimer)
      hideTimer = window.setTimeout(() => {
        el.classList.remove('is-on')
        hideTimer = 0
      }, 1400)
    }
    const applyTrail = () => {
      trailRaf = 0
      if (ref.current) {
        ref.current.style.setProperty('--lantern-x-prev', `${trailX}px`)
        ref.current.style.setProperty('--lantern-y-prev', `${trailY}px`)
      }
    }
    const tickTrail = () => {
      trailX += (currX - trailX) * 0.16
      trailY += (currY - trailY) * 0.16
      applyTrail()
      if (Math.abs(currX - trailX) > 0.4 || Math.abs(currY - trailY) > 0.4) {
        trailRaf = requestAnimationFrame(tickTrail)
      } else {
        trailRaf = 0
      }
    }
    const setVars = (x: number, y: number) => {
      currX = x
      currY = y
      el.style.setProperty('--lantern-x', `${x}px`)
      el.style.setProperty('--lantern-y', `${y}px`)
      if (reduced) {
        trailX = x
        trailY = y
        applyTrail()
        return
      }
      if (!trailRaf) trailRaf = requestAnimationFrame(tickTrail)
    }
    const onMove = (e: PointerEvent) => {
      if (reduced) {
        setVars(e.clientX, e.clientY)
      } else if (!raf) {
        raf = requestAnimationFrame(() => {
          raf = 0
          if (!ref.current) return
          setVars(e.clientX, e.clientY)
        })
      }
      show()
      scheduleHide()
    }
    const onLeave = () => el.classList.remove('is-on')
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerleave', onLeave)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerleave', onLeave)
      if (raf) cancelAnimationFrame(raf)
      if (hideTimer) window.clearTimeout(hideTimer)
      if (trailRaf) cancelAnimationFrame(trailRaf)
    }
  }, [])
  return <div ref={ref} className="reading-lantern" aria-hidden="true" />
}

// Watermark — a faint oversized ghost of the hero curve behind everything.
function Watermark() {
  return (
    <svg
      className="watermark"
      viewBox="0 0 720 1020"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
      focusable="false"
    >
      <path
        className="watermark-stroke"
        d={WIDE_PATH}
        fill="none"
        stroke="currentColor"
        strokeWidth="58"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        className="watermark-dot"
        cx={WIDE_DOT.cx}
        cy={WIDE_DOT.cy}
        r={WIDE_DOT.r}
      />
    </svg>
  )
}

// DriftConstellation — a small arc of seven asterisks that drift slowly
// across the upper region of the composition, like the heavens the
// speculum charts. Each star twinkles on its own phase and translates
// with parallax — the reader's pointer subtly shifts the constellation
// in the opposite direction, so the celestial field feels suspended in
// depth rather than painted onto the page. The constellation appears
// after the speculum has settled, so the two instruments feel like a
// single quiet observatory laid out at the start of a reading session.
type DriftStar = {
  x: number   // percentage across (0-100)
  y: number   // pixels from top of arc
  r: number   // radius of the asterisk in px
  phase: number
  drift: number
  twinkle: number
  color: 'gold' | 'vermilion' | 'pale'
}

const DRIFT_STARS: DriftStar[] = [
  { x:  8, y: 10, r: 1.8, phase: 0.0,  drift: 0.42, twinkle: 5.6, color: 'gold' },
  { x: 21, y:  4, r: 1.2, phase: 1.4,  drift: 0.28, twinkle: 6.8, color: 'pale' },
  { x: 38, y:  9, r: 2.1, phase: 2.6,  drift: 0.36, twinkle: 7.4, color: 'gold' },
  { x: 51, y:  2, r: 1.4, phase: 0.7,  drift: 0.22, twinkle: 5.2, color: 'gold' },
  { x: 64, y:  7, r: 1.9, phase: 3.2,  drift: 0.34, twinkle: 6.4, color: 'vermilion' },
  { x: 78, y:  3, r: 1.3, phase: 1.9,  drift: 0.26, twinkle: 7.0, color: 'pale' },
  { x: 92, y: 11, r: 2.0, phase: 4.1,  drift: 0.40, twinkle: 5.8, color: 'gold' },
]

function DriftConstellation() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let raf = 0
    let px = 0
    let py = 0
    let tx = 0
    let ty = 0
    let cx = 0
    let cy = 0
    const onMove = (e: PointerEvent) => {
      const w = window.innerWidth || 1
      const h = window.innerHeight || 1
      tx = (e.clientX - w / 2) / (w / 2)
      ty = (e.clientY - h / 2) / (h / 2)
    }
    const tick = () => {
      raf = requestAnimationFrame(tick)
      px += (tx - px) * 0.05
      py += (ty - py) * 0.05
      cx += (-px - cx) * 0.18
      cy += (-py - cy) * 0.18
      el.style.setProperty('--const-x', cx.toFixed(3))
      el.style.setProperty('--const-y', cy.toFixed(3))
    }
    if (reduced) {
      el.style.setProperty('--const-x', '0')
      el.style.setProperty('--const-y', '0')
    } else {
      window.addEventListener('pointermove', onMove, { passive: true })
      raf = requestAnimationFrame(tick)
    }
    return () => {
      window.removeEventListener('pointermove', onMove)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])
  return (
    <div className="drift-constellation" aria-hidden="true" ref={ref}>
      {DRIFT_STARS.map((s, i) => (
        <span
          key={i}
          className={`drift-star drift-star-${s.color}`}
          style={
            {
              '--star-x': `${s.x}%`,
              '--star-y': `${s.y}px`,
              '--star-r': `${s.r}px`,
              '--star-phase': `${s.phase}s`,
              '--star-drift': `${s.drift}s`,
              '--star-twinkle': `${s.twinkle}s`,
              '--star-i': i,
            } as CSSProperties
          }
        />
      ))}
      <svg className="drift-arc" viewBox="0 0 200 30" preserveAspectRatio="none" aria-hidden="true">
        <path
          className="drift-arc-curve"
          d="M 4 24 Q 100 -4 196 24"
        />
        <circle cx="4"   cy="24" r="0.7" className="drift-arc-end" />
        <circle cx="196" cy="24" r="0.7" className="drift-arc-end" />
      </svg>
    </div>
  )
}

// Taper — a faint candlelight beam falling onto the question mark from above.
// Iteration 40 widens the beam into a softer, more diffused cone so the
// candle feels like the page's true light source. Stops are eased so the
// falloff reads as candlelight, not as a hard shaft.
function Taper() {
  return (
    <svg
      className="taper"
      viewBox="0 0 80 240"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id="taper-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="currentColor" stopOpacity="0" />
          <stop offset="18%"  stopColor="currentColor" stopOpacity="0.04" />
          <stop offset="44%"  stopColor="currentColor" stopOpacity="0.13" />
          <stop offset="72%"  stopColor="currentColor" stopOpacity="0.28" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.22" />
        </linearGradient>
      </defs>
      <rect
        x="0"
        y="0"
        width="80"
        height="240"
        fill="url(#taper-grad)"
        className="taper-fill"
      />
    </svg>
  )
}

// CandleFlame — a small drawn candle that is the page's authored light
// source. Three nested teardrops (outer warm halo, inner gold body, hot
// white core) plus a thin wick. The flame breathes and sways, and a
// ref-based pointer proximity variable brightens the halo when the
// reader approaches the question — the candle leaning towards what
// the reader is reading.
function CandleFlame({ wrapRef, flaring }: {
  wrapRef: RefObject<HTMLSpanElement | null>
  flaring: boolean
}) {
  return (
    <span
      ref={wrapRef}
      className={`candle-flame${flaring ? ' is-flaring' : ''}`}
      aria-hidden="true"
    >
      <svg viewBox="0 0 56 100" focusable="false">
        <defs>
          <radialGradient id="flame-halo-grad" cx="50%" cy="46%" r="50%">
            <stop offset="0%"   stopColor="#f5d99c" stopOpacity="0.55" />
            <stop offset="48%"  stopColor="#e89a6a" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#b0533a" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="flame-outer-grad" cx="50%" cy="66%" r="58%">
            <stop offset="0%"   stopColor="#f0a370" stopOpacity="0.95" />
            <stop offset="55%"  stopColor="#d9b074" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#d9b074" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="flame-inner-grad" cx="50%" cy="58%" r="55%">
            <stop offset="0%"   stopColor="#fff5d4" stopOpacity="1" />
            <stop offset="50%"  stopColor="#f0d49a" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#f0d49a" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="flame-base-grad" cx="50%" cy="40%" r="55%">
            <stop offset="0%"   stopColor="#d9b074" stopOpacity="0.0" />
            <stop offset="55%"  stopColor="#7d9ab8" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#5e7593" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="dish-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#a88556" />
            <stop offset="55%"  stopColor="#7d5e36" />
            <stop offset="100%" stopColor="#4a361f" />
          </linearGradient>
        </defs>
        <circle
          cx="28"
          cy="42"
          r="28"
          fill="url(#flame-halo-grad)"
          className="flame-halo"
        />
        <path
          d="M 28 6 Q 20 22 20 40 Q 20 56 28 60 Q 36 56 36 40 Q 36 22 28 6 Z"
          fill="url(#flame-outer-grad)"
          className="flame-outer"
        />
        <path
          d="M 28 14 Q 23 26 23 40 Q 23 48 28 52 Q 33 48 33 40 Q 33 26 28 14 Z"
          fill="url(#flame-inner-grad)"
          className="flame-inner"
        />
        <ellipse
          cx="28"
          cy="44"
          rx="3.2"
          ry="7.6"
          fill="url(#flame-base-grad)"
          className="flame-base"
        />
        <ellipse
          cx="28"
          cy="44"
          rx="2.2"
          ry="6"
          fill="#fff5d4"
          className="flame-core"
        />
        <line
          x1="28"
          y1="50"
          x2="28"
          y2="68"
          stroke="#4a2e1a"
          strokeWidth="0.9"
          strokeLinecap="round"
          className="flame-wick"
        />
        {/* Brass candle dish — a small hand-drawn dish beneath the
            candle, anchoring the flame to the page. Drawn in once the
            candle has settled, so the light has somewhere to rest. */}
        <g className="candle-dish">
          <ellipse
            cx="28"
            cy="84"
            rx="22"
            ry="2.6"
            className="candle-dish-shadow"
          />
          <path
            d="M 10 76 Q 10 84 28 84 Q 46 84 46 76 L 44 73 L 12 73 Z"
            className="candle-dish-body"
            fill="url(#dish-grad)"
          />
          <ellipse
            cx="28"
            cy="73"
            rx="16"
            ry="2.4"
            className="candle-dish-rim"
          />
          <path
            d="M 14 78 Q 14 82 28 82 Q 42 82 42 78"
            className="candle-dish-groove"
          />
          <ellipse
            cx="22"
            cy="79"
            rx="2.6"
            ry="0.6"
            className="candle-dish-shine"
          />
        </g>
      </svg>
    </span>
  )
}

// Signature — a typeset gathering mark for the colophon.
function Signature() {
  return (
    <svg
      className="signature"
      viewBox="0 0 64 14"
      aria-hidden="true"
      focusable="false"
    >
      <line x1="2"  y1="9" x2="14" y2="9" className="sig-rule" />
      <text x="32" y="11.5" textAnchor="middle" className="sig-letter">xviii</text>
      <line x1="50" y1="9" x2="62" y2="9" className="sig-rule" />
      <circle cx="18" cy="9" r="0.7" className="sig-pip" />
      <circle cx="46" cy="9" r="0.7" className="sig-pip" />
    </svg>
  )
}

// PenTrial — a small scribal flourish at the end of the colophon, the
// kind a scribe leaves when finishing a page. A few small flourishes
// and pips, like a quill being tested on the parchment. The whole
// flourish draws in with a soft easing, just after the seal.
function PenTrial() {
  return (
    <span className="pen-trial" aria-hidden="true">
      <svg viewBox="0 0 60 10" className="pen-trial-svg" focusable="false">
        <path
          className="pen-trial-mark pen-trial-mark-1"
          d="M 2 6 Q 8 1 14 6"
        />
        <circle cx="16.5" cy="6" r="0.7" className="pen-trial-pip pen-trial-pip-1" />
        <path
          className="pen-trial-mark pen-trial-mark-2"
          d="M 20 6 L 28 6"
        />
        <path
          className="pen-trial-mark pen-trial-mark-3"
          d="M 32 2 Q 36 6 32 10"
        />
        <circle cx="40" cy="6" r="0.9" className="pen-trial-pip pen-trial-pip-2" />
        <path
          className="pen-trial-mark pen-trial-mark-4"
          d="M 44 5 Q 50 1 54 5 Q 50 9 44 7"
        />
        <circle cx="57" cy="5" r="0.5" className="pen-trial-pip pen-trial-pip-3 pen-trial-pip-sm" />
      </svg>
    </span>
  )
}

// Maniculum — the medieval reader's pointing hand that emerges from the
// right margin to mark the question's climax word ("yet?"). Always present
// as a quiet marginal mark; brightens and leans in when the reader engages
// the hero. Pairs with the left-margin "Qu." rubric so the question is
// framed by two gestures: a scholastic gloss on the left, a reader's hand
// on the right.
function Maniculum({ active }: { active: boolean }) {
  return (
    <span
      className={`maniculum ${active ? 'is-active' : ''}`}
      aria-hidden="true"
    >
      <span className="maniculum-lead" />
      <svg
        className="maniculum-svg"
        viewBox="0 0 70 38"
        focusable="false"
      >
        {/* Sleeve band — a slim vermilion ribbon at the cuff */}
        <rect
          x="44"
          y="5"
          width="1.6"
          height="28"
          className="maniculum-band"
        />

        {/* Sleeve / cuff — gold, gently tapered */}
        <path
          className="maniculum-cuff"
          d="M 45.5 4 L 66 7.5 L 66 30.5 L 45.5 34 Z"
        />

        {/* Cuff diagonal seams — suggest cut and drape */}
        <line
          x1="49"
          y1="9"
          x2="62.5"
          y2="30"
          className="maniculum-seam"
        />
        <line
          x1="49"
          y1="11.5"
          x2="62.5"
          y2="32"
          className="maniculum-seam"
        />

        {/* Cuff embroidery pip */}
        <circle cx="54" cy="18" r="0.9" className="maniculum-pip" />

        {/* Hand back — gold, softens at the knuckles */}
        <path
          className="maniculum-hand"
          d="M 22 11 L 44 11.5 L 46 14.5 L 46 23.5 L 44 26.5 L 22 27 Z"
        />

        {/* Folded fingers (three small ridges on the underside) */}
        <path
          d="M 25 27 Q 27 29 30 27"
          className="maniculum-fold"
        />
        <path
          d="M 31 27 Q 33 29 36 27"
          className="maniculum-fold"
        />
        <path
          d="M 37 27 Q 39 29 42 27"
          className="maniculum-fold"
        />

        {/* Thumb crease — a small arc on top */}
        <path
          d="M 30 14 Q 33 12.5 36 14"
          className="maniculum-crease"
        />

        {/* Index finger — extended, pointing left toward the question */}
        <path
          className="maniculum-finger"
          d="M 0 15 L 22 14.5 L 22 23.5 L 0 23 Z"
        />

        {/* First knuckle crease on the finger */}
        <line
          x1="12"
          y1="15"
          x2="12"
          y2="23"
          className="maniculum-knuckle"
        />

        {/* Fingernail — a small gold-bright wedge at the tip */}
        <path
          className="maniculum-nail"
          d="M 0 16 L 3.5 15.4 L 3.5 22.6 L 0 22 Z"
        />

        {/* Tip pulse — a tiny gold dot that flickers when active */}
        <circle cx="-1" cy="19" r="0.7" className="maniculum-tip" />
      </svg>
    </span>
  )
}

// Horologium — a small drawn sundial in the upper-left margin of the
// hero, paired with the marginal rubric. A semicircle dial face with
// five hour marks, a thin gnomon rising from the center, and a faint
// vermilion shadow line cast toward the current hour. The reader's
// "now" is recorded quietly in the page's margin — the chapter is
// being read at this hour, by this light (the candle above). The
// whole dial draws in slowly on page load, like an instrument being
// laid out at the start of a reading session.
function Horologium() {
  return (
    <aside className="horologium" aria-label="the hour of reading">
      <svg viewBox="0 0 40 32" className="horologium-svg" aria-hidden="true" focusable="false">
        {/* Dial face — a hairline semicircle, upper half */}
        <path
          className="horologium-dial"
          d="M 4 28 A 16 16 0 0 1 36 28"
          pathLength="100"
        />
        {/* Base — the horizontal diameter, a quiet rule beneath the dial */}
        <line
          className="horologium-base"
          x1="4"
          y1="28"
          x2="36"
          y2="28"
        />
        {/* Hour marks — five major: IX, XI, XII, I, III */}
        <line className="horologium-tick" x1="4"   y1="28" x2="6.5" y2="28" />
        <line className="horologium-tick horologium-tick-sm" x1="10.7" y1="19.6" x2="12.5" y2="20.8" />
        <line className="horologium-tick" x1="20"  y1="12" x2="20"  y2="15.2" />
        <line className="horologium-tick horologium-tick-sm" x1="27.5" y1="20.8" x2="29.3" y2="19.6" />
        <line className="horologium-tick" x1="33.5" y1="28" x2="36"  y2="28" />
        {/* Gnomon — the vertical pin that casts the shadow */}
        <line
          className="horologium-gnomon"
          x1="20"
          y1="28"
          x2="20"
          y2="19.5"
        />
        {/* Shadow — a vermilion hairline cast toward the hour of reading */}
        <line
          className="horologium-shadow"
          x1="20"
          y1="20"
          x2="27.5"
          y2="22.6"
        />
        {/* Hour pip — a vermilion drop at the dial's east point */}
        <circle
          className="horologium-pip"
          cx="36"
          cy="28"
          r="1.3"
        />
        {/* Center — a small gold pip at the gnomon's foot */}
        <circle
          className="horologium-center"
          cx="20"
          cy="28"
          r="0.8"
        />
      </svg>
      <span className="horologium-label">
        <span className="horologium-rule" />
        <em className="horologium-text">horologium</em>
      </span>
    </aside>
  )
}

// Speculum — a small celestial almanac chart that mirrors the
// horologium on the opposite margin of the hero. Three concentric
// circles hold twelve hour marks, a sun at the top, a crescent moon
// at the foot, and a single vermilion star — the configuration of
// the heavens at the moment of reading, paired to its hour the way
// the horologium is paired to its time on earth. Drawn in slowly
// after the horologium has settled, so the two instruments feel
// laid out together at the start of a reading session; the star
// then twinkles faintly, like a still constellation on a clear
// manuscript evening.
function Speculum() {
  const ticks = Array.from({ length: 12 }, (_, i) => {
    const a = (i * 30 - 90) * Math.PI / 180
    return {
      x1: 28 + Math.cos(a) * 21.6,
      y1: 28 + Math.sin(a) * 21.6,
      x2: 28 + Math.cos(a) * 24,
      y2: 28 + Math.sin(a) * 24,
      major: i % 3 === 0,
    }
  })
  return (
    <aside className="speculum" aria-label="the configuration of the heavens">
      <svg viewBox="0 0 56 56" className="speculum-svg" aria-hidden="true" focusable="false">
        <defs>
          <radialGradient id="speculum-bloom-grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.18" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="28" cy="28" r="22" fill="url(#speculum-bloom-grad)" className="speculum-bloom" />
        <circle cx="28" cy="28" r="24" className="speculum-outer" pathLength="100" />
        <circle cx="28" cy="28" r="17" className="speculum-middle" pathLength="100" />
        <circle cx="28" cy="28" r="9" className="speculum-inner" pathLength="100" />
        {ticks.map((t, i) => (
          <line
            key={i}
            className={`speculum-tick${t.major ? ' speculum-tick-major' : ''}`}
            x1={t.x1}
            y1={t.y1}
            x2={t.x2}
            y2={t.y2}
          />
        ))}
        <line x1="28" y1="22" x2="28" y2="34" className="speculum-axis" />
        <line x1="22" y1="28" x2="34" y2="28" className="speculum-axis" />
        <circle cx="28" cy="28" r="0.9" className="speculum-center" />
        <g className="speculum-sun">
          <circle cx="28" cy="12" r="2.4" className="speculum-sun-disc" />
          <line x1="28" y1="6" x2="28" y2="8" className="speculum-sun-ray" />
          <line x1="28" y1="16" x2="28" y2="18" className="speculum-sun-ray" />
          <line x1="22" y1="12" x2="24" y2="12" className="speculum-sun-ray" />
          <line x1="32" y1="12" x2="34" y2="12" className="speculum-sun-ray" />
          <line x1="23.6" y1="7.6" x2="25" y2="9" className="speculum-sun-ray" />
          <line x1="32.4" y1="7.6" x2="31" y2="9" className="speculum-sun-ray" />
          <line x1="23.6" y1="16.4" x2="25" y2="15" className="speculum-sun-ray" />
          <line x1="32.4" y1="16.4" x2="31" y2="15" className="speculum-sun-ray" />
        </g>
        <g className="speculum-moon">
          <circle cx="28" cy="44" r="2.4" className="speculum-moon-disc" />
          <circle cx="28.9" cy="43.5" r="2.0" className="speculum-moon-shadow" />
        </g>
        <g className="speculum-star-group">
          <path
            d="M 44 16 L 44.5 17.2 L 45.7 17.5 L 44.5 17.8 L 44 19 L 43.5 17.8 L 42.3 17.5 L 43.5 17.2 Z"
            className="speculum-star"
          />
        </g>
      </svg>
      <span className="speculum-label">
        <span className="speculum-rule" />
        <em className="speculum-text">specvlvm</em>
      </span>
    </aside>
  )
}

// MarginalRubric — a small vermilion annotation sitting in the left margin
// of the hero, connected by a hairline to the bracket.
function MarginalRubric() {
  return (
    <span className="marginal-rubric" aria-hidden="true">
      <span className="marginal-rubric-text">{MARGINAL_RUBRIC}</span>
      <svg className="marginal-rubric-arc" viewBox="0 0 60 24" preserveAspectRatio="none">
        <path
          d="M 0 14 Q 28 8 56 14"
          className="marginal-rubric-arc-line"
        />
      </svg>
    </span>
  )
}

// BifolioSpine — a soft vertical crease suggesting an open book spread.
function BifolioSpine() {
  return (
    <div className="bifolio" aria-hidden="true">
      <span className="bifolio-crease" />
      <span className="bifolio-gilt" />
      <span className="bifolio-shadow bifolio-shadow-l" />
      <span className="bifolio-shadow bifolio-shadow-r" />
    </div>
  )
}

// Bookmark ribbon — a slim vermilion fabric ribbon hanging from the top
// of the page like a marker left in a bound volume.
function Ribbon() {
  return (
    <div className="ribbon" aria-hidden="true">
      <div className="ribbon-inner">
        <svg viewBox="0 0 20 220" preserveAspectRatio="none">
          <defs>
            <linearGradient id="ribbon-shade" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%"   stopColor="#3e1a10" />
              <stop offset="22%"  stopColor="#7d3a26" />
              <stop offset="50%"  stopColor="#b15a3c" />
              <stop offset="78%"  stopColor="#7d3a26" />
              <stop offset="100%" stopColor="#3e1a10" />
            </linearGradient>
            <linearGradient id="ribbon-top" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"  stopColor="black" stopOpacity="0.55" />
              <stop offset="22%" stopColor="black" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M 0 0 L 20 0 L 20 198 L 10 214 L 0 198 Z"
            fill="url(#ribbon-shade)"
          />
          <path
            d="M 0 0 L 20 0 L 20 48 L 0 48 Z"
            fill="url(#ribbon-top)"
          />
          <line
            x1="10"
            y1="0"
            x2="10"
            y2="214"
            stroke="rgba(255, 210, 180, 0.10)"
            strokeWidth="0.7"
          />
        </svg>
      </div>
    </div>
  )
}

// AnswerDropCap — a small painted "I" that opens the answer line, set
// in vermilion italic as a manuscript illuminated initial. Pulls the eye
// into the chapter's reply as the climax lands. Iteration 35 elevates
// it to a true illuminated initial: a taller, more present vermilion
// capital, with gold-leaf flourishes above and below and a tiny four-
// pointed star nested inside its body — the answer opens like the
// opening of a sacramentary, with the same celestial mark that closes
// the colophon now answering the chapter's question.
function AnswerDropCap({ visible: show }: { visible: boolean }) {
  return (
    <span className={`answer-dropcap-wrap ${show ? 'is-on' : ''}`} aria-hidden="true">
      <span className="answer-dropcap-gold" />
      <span className="answer-dropcap">{ANSWER_DROPCAP}</span>
      <span className="answer-dropcap-star" aria-hidden="true">
        <svg viewBox="0 0 12 12" focusable="false">
          <path
            d="M 6 1.2 L 6.86 4.86 L 10.6 5.2 L 7.4 7.2 L 8.4 10.8 L 6 8.6 L 3.6 10.8 L 4.6 7.2 L 1.4 5.2 L 5.14 4.86 Z"
          />
        </svg>
      </span>
      <span className="answer-dropcap-shadow" />
    </span>
  )
}

// ChapterStamp — a small typeset gathering mark placed in the top-right
// corner of the editorial card. Replaces the standalone folio mark
// above the rubric, tucking the chapter reference into the desk frame
// where it reads as a marginal stamp rather than a centered emblem.
function ChapterStamp() {
  return (
    <span className="chapter-stamp" aria-hidden="true">
      <svg viewBox="0 0 64 30" className="chapter-stamp-svg">
        <line x1="4" y1="10" x2="22" y2="10" className="chapter-stamp-rule" />
        <circle cx="4"  cy="10" r="0.85" className="chapter-stamp-pip" />
        <circle cx="22" cy="10" r="0.85" className="chapter-stamp-pip" />
        <text x="32" y="14.5" textAnchor="middle" className="chapter-stamp-num">xviii</text>
        <line x1="42" y1="10" x2="60" y2="10" className="chapter-stamp-rule" />
        <circle cx="42" cy="10" r="0.85" className="chapter-stamp-pip" />
        <circle cx="60" cy="10" r="0.85" className="chapter-stamp-pip" />
        <text x="32" y="25" textAnchor="middle" className="chapter-stamp-label">fol · mss</text>
      </svg>
    </span>
  )
}

// SealImpression — a quiet vermilion ink stamp that blooms outward
// from the hero when the reader acknowledges the question. Replaces
// the prior bee messenger with a more deliberate gesture: a small
// "Mm" monogram pressed into the page, expanding and fading. Ties
// visually to the wax seal that closes the colophon — the question
// is answered by the same mark that closes the chapter.
function SealImpression({ sealing }: { sealing: boolean }) {
  return (
    <span
      className={`seal-impression${sealing ? ' is-stamping' : ''}`}
      aria-hidden="true"
    >
      <span className="seal-impression-halo" />
      <span className="seal-impression-ring seal-impression-ring-1" />
      <span className="seal-impression-ring seal-impression-ring-2" />
      <span className="seal-impression-mark">Mm</span>
    </span>
  )
}

// Explicit — the chapter's formal closing mark, set beneath the footnote
// once the gloss has finished. A single gold rule, the Latin "explicit"
// set in serif italic between flanking gold-deep middots, and a small
// vermilion pilcrow to mark the chapter's true end. Reads as the final
// line a scribe would add when a folio is complete — "the chapter is
// ended; the binding continues on the next folio."
function Explicit() {
  return (
    <p className="explicit" aria-hidden="true">
      <span className="explicit-rule" />
      <em className="explicit-text">explicit</em>
      <span className="explicit-sep">·</span>
      <em className="explicit-text explicit-text-faint">fol. xviii</em>
      <span className="explicit-pilcrow">¶</span>
    </p>
  )
}

// IntellexiNota — the reader's quiet response to the chapter, written
// into the page once the footnote has settled. The note is "intellexi"
// — "I have understood" — completing the chapter's Latin dialogue:
// quaeritur (the page asks) → respondetur (the catchword answers) →
// relege (the footnote invites another reading) → intellexi (the reader
// accepts) → legi (the colophon confirms) → explicit (the chapter
// closes). A small drawn quill flourish above the word, like the reader
// set down a single hairline stroke before writing their gloss.
//
// Iteration 37 lets the gloss write itself: the flourish draws in
// first, then the word types itself out one character at a time, with
// a blinking caret while the reader is still setting quill to page.
// This unifies the chapter's verbal choreography — answer, reply,
// footnote, and now the reader's own sign-off all share the same
// manuscript cadence.
function IntellexiNota({
  visible,
  text,
  done,
}: {
  visible: boolean
  text: string
  done: boolean
}) {
  const typing = visible && !done
  return (
    <p
      className={`intellexi-nota ${visible ? 'is-on' : ''} ${done ? 'is-done' : ''}`}
      aria-live="polite"
    >
      <svg
        className="intellexi-nota-flourish"
        viewBox="0 0 32 7"
        focusable="false"
        aria-hidden="true"
      >
        <path
          className="intellexi-nota-flourish-curve"
          d="M 2 4 Q 9 1 16 3.5 Q 23 6 30 2"
        />
        <circle
          className="intellexi-nota-flourish-pip"
          cx="30"
          cy="2"
          r="0.55"
        />
      </svg>
      <em className="intellexi-nota-text">{text}</em>
      {typing && <span className="intellexi-nota-caret" aria-hidden="true">|</span>}
      <span className="intellexi-nota-strike" aria-hidden="true" />
    </p>
  )
}

// VineCorner — small hand-drawn vine ornament that replaces the plain
// gold L brackets on the question block. A leaf curls in from the
// corner toward the text, like a printer's flourish painted over
// the type. Iteration 39 completes the four-corner frame on the
// chapter opening: top-left, top-right, bottom-left, and bottom-right,
// so the question block reads as a proper opened folio rather than
// a half-framed editorial card.
function VineCorner({
  position,
}: {
  position: 'tl' | 'tr' | 'bl' | 'br'
}) {
  return (
    <svg
      className={`vine-corner vine-corner-${position}`}
      viewBox="0 0 22 22"
      aria-hidden="true"
      focusable="false"
    >
      <path className="vine-stem" d="M 2 20 Q 9 13 19 4" />
      <path className="vine-leaf" d="M 7 14 Q 11 10 16 8 Q 14 13 7 14 Z" />
      <path className="vine-leaf vine-leaf-sm" d="M 4 18 Q 6 14 10 13 Q 9 17 4 18 Z" />
      <circle cx="17" cy="6" r="0.9" className="vine-pip" />
      <circle cx="13" cy="11" r="0.5" className="vine-pip vine-pip-sm" />
    </svg>
  )
}

// FolioOpener — a delicate rule + four-pointed mark that crowns the
// chapter body inside the question block. Reads as the small fleuron
// a printer would set at the formal opening of a section: two thin
// gold rules that draw outward from a vermilion pip. Sits just above
// the chapter's question and below its kicker, so the chapter body
// has its own clear opening punctuation, distinct from the larger
// fleuron that sits between the rubric and the hero.
function FolioOpener() {
  return (
    <div className="folio-opener" aria-hidden="true">
      <span className="folio-opener-rule folio-opener-rule-l" />
      <span className="folio-opener-mark">
        <svg viewBox="0 0 12 12" focusable="false">
          <path
            d="M 6 1.2 L 6.86 4.86 L 10.6 5.2 L 7.4 7.2 L 8.4 10.8 L 6 8.6 L 3.6 10.8 L 4.6 7.2 L 1.4 5.2 L 5.14 4.86 Z"
            className="folio-opener-pip"
          />
        </svg>
      </span>
      <span className="folio-opener-rule folio-opener-rule-r" />
    </div>
  )
}

// ChapterSpine — a thin vertical axis through the centerline of the
// composition, deliberately understated: a column of small gold pin-
// pricks running from above the hero down to the colophon. Two small
// compass pips cap it at the top and bottom — the chapter's own axis,
// distinct from the bifolio crease of the open book. Sits behind all
// of the in-flow content so it reads as the page's quiet central
// spine, gathering the hero, the question, the answer, and the reply
// into a single vertical column.
//
// Iteration 37 activates this axis: a soft gold pulse travels from
// the top of the column down to the compass mark whenever the chapter
// is engaged (welcome on first settle, on every acknowledge, and a
// final resolved glow when the reader has understood). The pulse
// element is a single translucent halo that rides the spine; the
// existing pin-pricks stay where they are so the column keeps its
// manuscript texture. The pulse is purely additive — it never
// replaces the existing ornament, it makes the orifice feel alive.
function ChapterSpine({
  pulseKey,
  sealed,
}: {
  pulseKey: number
  sealed: boolean
}) {
  return (
    <div
      className={`chapter-spine ${sealed ? 'is-sealed' : ''}`}
      aria-hidden="true"
    >
      <span key={pulseKey} className="chapter-spine-pulse" />
    </div>
  )
}

// CompassMark — a small four-pointed star that sits at the top of the
// colophon, the chapter's formal terminus. Echoes the gold pips that
// cap the chapter spine, so the axis reads as a single ornament from
// hero to colophon: the page began at the hero's bowl and ends at
// this star. Set in vermilion and gold, drawn in once the colophon
// has settled.
function CompassMark() {
  return (
    <span className="colophon-compass" aria-hidden="true">
      <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
        <path
          className="colophon-compass-star"
          d="M 12 3 L 13.4 11 L 21 12 L 13.4 13 L 12 21 L 10.6 13 L 3 12 L 10.6 11 Z"
        />
        <circle
          className="colophon-compass-core"
          cx="12"
          cy="12"
          r="0.9"
        />
      </svg>
    </span>
  )
}

// QuestionFlourish — a small vermilion ink-stain beneath the question
// mark character. Drawn from a flourish that begins beneath the "?"
// and ends in a single drop, like a quill's slip.
function QuestionFlourish() {
  return (
    <svg
      className="question-flourish"
      viewBox="0 0 36 10"
      aria-hidden="true"
      focusable="false"
    >
      <path className="question-flourish-curve" d="M 3 6 Q 14 2 24 5 Q 30 7 34 4" />
      <circle cx="32" cy="3.5" r="1.1" className="question-flourish-drop" />
    </svg>
  )
}

// HeroSparkle — a small cluster of ink-dust motes that drift upward
// from the bowl of the hero question mark when the reader approaches.
// Reads as the candle's light catching the dust of the manuscript —
// three vermilion and three gold motes, each on a slightly different
// cadence, so the cluster never feels like a loop. Respects reduced
// motion: the cluster is hidden entirely when motion is reduced, so
// the hover state stays calm and the existing hero choreography is
// never doubled.
const HERO_SPARKLES: Array<{
  x: number; y: number; dx: number; dy: number; delay: number
}> = [
  { x: 50, y: 18, dx:  6, dy: -22, delay:   0 },
  { x: 38, y: 22, dx: -8, dy: -18, delay: 220 },
  { x: 62, y: 24, dx: 10, dy: -14, delay: 480 },
  { x: 46, y: 28, dx: -4, dy: -26, delay: 720 },
  { x: 56, y: 30, dx:  4, dy: -28, delay: 980 },
  { x: 42, y: 34, dx: -10, dy: -20, delay:1240 },
]

function HeroSparkle() {
  return (
    <span className="hero-sparkle" aria-hidden="true">
      {HERO_SPARKLES.map((s, i) => (
        <span
          key={i}
          className="hero-sparkle-dot"
          style={
            {
              '--sp-x': `${s.x}%`,
              '--sp-y': `${s.y}%`,
              '--sp-dx': `${s.dx}px`,
              '--sp-dy': `${s.dy}px`,
              '--sp-delay': `${s.delay}ms`,
            } as CSSProperties
          }
        />
      ))}
    </span>
  )
}

// VideAnnotation — a small scholastic gloss in the left margin that
// asks the reader to "look" (Latin: vide) at the answer. A vermilion
// caret at the foot of the rule points into the answer/reply text —
// the page's gentle instruction to attend to what is written below.
// Pairs with the existing "Qu." rubric (top) and the "Mm" inkpot
// (middle) on the left margin, so the left side of the folio reads as
// a chain of scholastic marginalia: a question, a writer, an
// instruction. The whole annotation drifts in after the answer has
// begun to write itself, like a scribe adding one more marginal mark
// once the chapter has started to speak.
function VideAnnotation({ visible }: { visible: boolean }) {
  return (
    <aside
      className={`vide-annotation ${visible ? 'is-on' : ''}`}
      aria-hidden="true"
    >
      <span className="vide-annotation-rule" />
      <span className="vide-annotation-text">
        <em>vide</em>
        <span className="vide-annotation-sep">·</span>
        <span className="vide-annotation-en">look</span>
      </span>
      <svg
        className="vide-annotation-caret"
        viewBox="0 0 16 14"
        preserveAspectRatio="none"
      >
        <path
          className="vide-annotation-caret-line"
          d="M 8 0 Q 7 6 8 13"
        />
        <path
          className="vide-annotation-caret-tip"
          d="M 5.6 10.4 L 8 13.2 L 10.6 10.6"
        />
      </svg>
    </aside>
  )
}

// PredicateRule — a thin gold ink rule drawn beneath the predicate
// "good at frontend", mirroring the gold rule beneath the named
// subject "Minimax M3". Two quiet underlines frame the verb phrase
// being examined — the page's quiet way of marking the noun and the
// predicate equally, so the reader sees the question as a balanced
// triple: subject, predicate, climax.
function PredicateRule() {
  return <span className="predicate-rule" aria-hidden="true" />
}

// AnswerOrnament — a small printer's flourish that punctuates the
// transition between answer and reply. Two rules flanking a
// diamond and two pips.
function AnswerOrnament() {
  return (
    <span className="answer-ornament" aria-hidden="true">
      <svg viewBox="0 0 64 8">
        <line x1="2" y1="4" x2="22" y2="4" className="orn-rule" />
        <circle cx="24" cy="4" r="1.1" className="orn-pip" />
        <path d="M 28 4 L 32 1 L 36 4 L 32 7 Z" className="orn-diamond" />
        <circle cx="40" cy="4" r="1.1" className="orn-pip" />
        <line x1="42" y1="4" x2="62" y2="4" className="orn-rule" />
      </svg>
    </span>
  )
}

// ScholasticFootnote — a small bilingual marginal gloss that writes
// itself into the page after the reply has finished. The rule above
// draws first (a thin gold hairline growing outward from center); the
// superscript "¹" then settles in; finally the body types itself out
// in a slow, deliberate cadence. The Latin lemma ("relege") is set in
// vermilion italic; the English gloss in the page's own ink-soft,
// joined by a small hand-cut middot. A blinking caret mirrors the
// answer/reply scribes. A small drawn flourish at the end suggests
// the scribe's quill lifting from the page.
function ScholasticFootnote({
  visible,
  text,
  done,
}: {
  visible: boolean
  text: string
  done: boolean
}) {
  const dotIdx = text.indexOf('·')
  const latin = dotIdx >= 0 ? text.slice(0, dotIdx) : text
  const english = dotIdx >= 0 ? text.slice(dotIdx + 1).replace(/^\s+/, '') : ''
  const typing = visible && !done
  return (
    <p
      className={`footnote ${visible ? 'is-on' : ''} ${done ? 'is-done' : ''}`}
      aria-live="polite"
      aria-label={visible ? FOOTNOTE_ARIA : undefined}
    >
      <span className="footnote-rule" aria-hidden="true" />
      <span className="footnote-row">
        <span className="footnote-mark" aria-hidden="true">
          ¹
        </span>
        <em className="footnote-latin">{latin}</em>
        {dotIdx >= 0 && (
          <span className="footnote-sep" aria-hidden="true">
            ·
          </span>
        )}
        {english !== '' && (
          <span className="footnote-en">{english}</span>
        )}
        {typing && <span className="footnote-caret" aria-hidden="true">|</span>}
      </span>
      <svg
        className="footnote-flourish"
        viewBox="0 0 28 6"
        aria-hidden="true"
        focusable="false"
      >
        <path
          className="footnote-flourish-curve"
          d="M 2 4 Q 8 1 14 3 Q 20 5 26 2"
        />
        <circle
          className="footnote-flourish-pip"
          cx="26"
          cy="2"
          r="0.55"
        />
      </svg>
    </p>
  )
}

function Marg({
  corner,
  id,
  label,
  body,
  whisper,
  whisperText,
  active,
  wave,
  onHover,
  ariaLabel,
  glyph,
  children,
}: {
  corner: Corner
  id: string
  label: string
  body?: string
  whisper: boolean
  whisperText: string
  active: string | null
  wave: boolean
  onHover: (id: string | null) => void
  ariaLabel?: string
  glyph?: React.ReactNode
  children?: React.ReactNode
}) {
  const dim = active !== null && active !== id
  const classes = [`marg`, `marg-${corner}`]
  if (dim) classes.push('dim')
  if (wave) classes.push('echo-wave')
  const wordList = whisperText.split(' ')
  return (
    <aside
      className={classes.join(' ')}
      onMouseEnter={() => onHover(id)}
      onMouseLeave={() => onHover(null)}
      onFocus={() => onHover(id)}
      onBlur={() => onHover(null)}
      tabIndex={0}
      aria-label={ariaLabel ?? `${label}${body ? ': ' + body : ''}`}
    >
      <span className="marg-rule" />
      {glyph && <span className="marg-glyph">{glyph}</span>}
      <span className="marg-label">{label}</span>
      {body !== undefined && <span className="marg-body">{body}</span>}
      {children}
      <GuideRule corner={corner} />
      <span className="marg-whisper-slot">
        <span
          className={`marg-whisper${whisper ? ' is-shown' : ''}`}
          aria-hidden="true"
        >
          {wordList.map((word, i) => (
            <span
              key={i}
              className={`whisper-word${whisper ? ' is-shown' : ''}`}
              style={{ '--wi': i } as CSSProperties}
            >
              {word}
              {i < wordList.length - 1 ? '\u00a0' : ''}
            </span>
          ))}
        </span>
      </span>
    </aside>
  )
}

export function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const reduced = useReducedMotion()
  const [ready, setReady] = useState(false)
  const [drawn, setDrawn] = useState(false)
  const [pulsing, setPulsing] = useState(false)
  const [tracing, setTracing] = useState(false)
  const [spattering, setSpattering] = useState(false)
  const [active, setActive] = useState<string | null>(null)
  const [echoIdx, setEchoIdx] = useState(-1)
  const [whispersOn, setWhispersOn] = useState<Record<Corner, boolean>>({
    tl: false,
    tr: false,
    bl: false,
    br: false,
  })
  const [noteNonce, setNoteNonce] = useState(0)
  const [answerOn, setAnswerOn] = useState(false)
  const [answerChars, setAnswerChars] = useState(0)
  const [replyOn, setReplyOn] = useState(false)
  const [replyChars, setReplyChars] = useState(0)
  const [footnoteOn, setFootnoteOn] = useState(false)
  const [footnoteChars, setFootnoteChars] = useState(0)
  const [pointing, setPointing] = useState(false)
  const [sealing, setSealing] = useState(false)
  const [intellexiOn, setIntellexiOn] = useState(false)
  const [intellexiChars, setIntellexiChars] = useState(0)
  const [quietus, setQuietus] = useState(false)
  const [spinePulseKey, setSpinePulseKey] = useState(0)
  const [spineSealed, setSpineSealed] = useState(false)
  const [bifolioAttending, setBifolioAttending] = useState(false)
  const pulseRef = useRef(0)
  const echoRef = useRef(0)
  const partsRef = useRef<Particle[]>([])
  const dimsRef = useRef({ w: 0, h: 0 })
  const pointerRef = useRef({ x: 0, y: 0, over: false, active: false })
  const heroBoxRef = useRef<DOMRect | null>(null)
  const heroRef = useRef<HTMLButtonElement>(null)
  const flameWrapRef = useRef<HTMLSpanElement>(null)
  const flameWarmthRef = useRef(0)
  const waveTimeoutsRef = useRef<number[]>([])

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 60)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    const t = setTimeout(() => setDrawn(true), reduced ? 0 : 160)
    return () => clearTimeout(t)
  }, [reduced])

  useEffect(() => {
    if (!answerOn) {
      setAnswerChars(0)
      return
    }
    if (reduced) {
      setAnswerChars(ANSWER.length)
      return
    }
    const total = ANSWER.length
    if (answerChars >= total) return
    const id = window.setTimeout(
      () => setAnswerChars((c) => Math.min(total, c + 1)),
      ANSWER_STAGGER_MS,
    )
    return () => clearTimeout(id)
  }, [answerOn, answerChars, reduced])

  useEffect(() => {
    if (!answerOn || answerChars < ANSWER.length) {
      if (!answerOn) setReplyOn(false)
      return
    }
    const t = window.setTimeout(
      () => setReplyOn(true),
      reduced ? 80 : 520,
    )
    return () => clearTimeout(t)
  }, [answerOn, answerChars, reduced])

  useEffect(() => {
    if (!replyOn) {
      setReplyChars(0)
      return
    }
    if (reduced) {
      setReplyChars(REPLY.length)
      return
    }
    const total = REPLY.length
    if (replyChars >= total) return
    const id = window.setTimeout(
      () => setReplyChars((c) => Math.min(total, c + 1)),
      REPLY_STAGGER_MS,
    )
    return () => clearTimeout(id)
  }, [replyOn, replyChars, reduced])

  // The footnote arrives once the reply has finished being written.
  // It waits a beat so the page's reply can land on its own before the
  // scribe adds a marginal gloss — the cadence of someone who has just
  // finished reading and reaches for the pen to write in the margin.
  useEffect(() => {
    if (!replyOn || replyChars < REPLY.length) return
    const t = window.setTimeout(
      () => setFootnoteOn(true),
      reduced ? 60 : 760,
    )
    return () => window.clearTimeout(t)
  }, [replyOn, replyChars, reduced])

  useEffect(() => {
    if (!footnoteOn) {
      setFootnoteChars(0)
      return
    }
    if (reduced) {
      setFootnoteChars(FOOTNOTE_TEXT.length)
      return
    }
    const total = FOOTNOTE_TEXT.length
    if (footnoteChars >= total) return
    const id = window.setTimeout(
      () => setFootnoteChars((c) => Math.min(total, c + 1)),
      FOOTNOTE_STAGGER_MS,
    )
    return () => clearTimeout(id)
  }, [footnoteOn, footnoteChars, reduced])

  // The reader's quiet response — "intellexi" — appears after the
  // footnote has fully settled. It waits a beat so the chapter's own
  // conclusion lands before the reader signs off, like closing a book
  // and writing a single word in the endpaper. The hero receives a
  // matching inward breath at the same moment, so the emblem above
  // and the gloss below settle into the same quiet. Iteration 37 lets
  // the gloss write itself character by character so the reader's
  // response shares the chapter's manuscript cadence — answer, reply,
  // footnote, and now intellexi all use the same slow hand.
  useEffect(() => {
    if (!footnoteOn || footnoteChars < FOOTNOTE_TEXT.length) return
    const t = window.setTimeout(
      () => {
        setIntellexiOn(true)
        setQuietus(true)
      },
      reduced ? 80 : 720,
    )
    return () => window.clearTimeout(t)
  }, [footnoteOn, footnoteChars, reduced])

  // Intellexi typing — the reader's gloss writes itself in the same
  // cadence as the answer, reply, and footnote. Staggered wider
  // because it is a single short word, not a sentence, and the slower
  // hand reads as deliberate ("I have understood") rather than hurried.
  useEffect(() => {
    if (!intellexiOn) {
      setIntellexiChars(0)
      return
    }
    const total = 'intellexi'.length
    if (reduced) {
      setIntellexiChars(total)
      return
    }
    if (intellexiChars >= total) return
    const id = window.setTimeout(
      () => setIntellexiChars((c) => Math.min(total, c + 1)),
      INTELLEXI_STAGGER_MS,
    )
    return () => window.clearTimeout(id)
  }, [intellexiOn, intellexiChars, reduced])

  // Spine pulse — a soft gold light travels from the top of the
  // chapter spine to the compass mark at three narrative moments:
  //   1. A welcome pulse after the spine has finished fading in, so
  //      the reader knows the column is alive.
  //   2. A reading pulse on every acknowledge, so the column carries
  //      the chapter's first word down to its signature.
  //   3. A final sealed glow when intellexi is fully written, so the
  //      spine reads as a single settled hairline — the chapter has
  //      been completed, the binding closed.
  // The pulse uses an incrementing key so the keyed child element
  // remounts and its CSS animation replays cleanly each time.
  useEffect(() => {
    if (reduced) return
    const t = window.setTimeout(() => {
      setSpinePulseKey((k) => k + 1)
    }, 1900)
    return () => window.clearTimeout(t)
  }, [reduced])

  useEffect(() => {
    if (!intellexiOn) return
    if (reduced) return
    if (intellexiChars < 'intellexi'.length) return
    const t = window.setTimeout(() => {
      setSpineSealed(true)
    }, 220)
    return () => window.clearTimeout(t)
  }, [intellexiOn, intellexiChars, reduced])

  // Bifolio attention — the page's central gilt brightens subtly when
  // the reader's pointer is over the composition (the book is being
  // held open more attentively) and settles back when they wander
  // off. A single listener is attached once on mount; the response is
  // entirely CSS-driven so the gesture stays smooth.
  useEffect(() => {
    if (reduced) return
    let leaveTimer = 0
    const onMove = () => {
      if (leaveTimer) {
        window.clearTimeout(leaveTimer)
        leaveTimer = 0
      }
      if (!bifolioAttending) setBifolioAttending(true)
    }
    const onLeave = () => {
      if (leaveTimer) window.clearTimeout(leaveTimer)
      leaveTimer = window.setTimeout(() => setBifolioAttending(false), 700)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerleave', onLeave)
    return () => {
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', onLeave)
      if (leaveTimer) window.clearTimeout(leaveTimer)
    }
  }, [bifolioAttending, reduced])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const setupDims = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const w = window.innerWidth
      const h = window.innerHeight
      dimsRef.current = { w, h }
      canvas.width = Math.floor(w * dpr)
      canvas.height = Math.floor(h * dpr)
      canvas.style.width = w + 'px'
      canvas.style.height = h + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    setupDims()

    const seed = () => {
      const { w, h } = dimsRef.current
      const count = Math.min(86, Math.floor((w * h) / 18000))
      const arr: Particle[] = []
      for (let i = 0; i < count; i++) {
        const r = Math.random()
        const tone: Particle['tone'] =
          r < 0.34 ? 'warm' : r < 0.62 ? 'pale' : 'cool'
        arr.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.04,
          vy: -Math.random() * 0.10 - 0.018,
          r: Math.random() * 1.0 + 0.35,
          a: Math.random() * 0.42 + 0.14,
          tone,
          glyph: DUST_GLYPHS[Math.floor(Math.random() * DUST_GLYPHS.length)],
          spin: (Math.random() - 0.5) * 0.4,
        })
      }
      partsRef.current = arr
    }
    seed()

    const draw = () => {
      const { w, h } = dimsRef.current
      ctx.clearRect(0, 0, w, h)
      const boost = pulseRef.current
      const eBoost = echoRef.current
      const ptr = pointerRef.current
      const hb = heroBoxRef.current

      for (const p of partsRef.current) {
        const yRatio = Math.min(1, Math.max(0, p.y / Math.max(1, h)))
        const heightFade = 0.32 + 0.68 * (1 - yRatio)
        let alpha = p.a * heightFade * (1 + boost * 1.1)
        let radius = p.r * (1 + boost * 0.5)
        if (hb) {
          const cxp = (hb.left + hb.right) / 2
          const cyp = (hb.top + hb.bottom) / 2
          const dx = cxp - p.x
          const dy = cyp - p.y
          const d2 = dx * dx + dy * dy
          const R = 280
          if (d2 < R * R) {
            const d = Math.sqrt(d2) || 1
            const k = 1 - d / R
            alpha += k * 0.22
            radius += k * 0.18
          }
        }
        if (ptr.over) {
          const dx = ptr.x - p.x
          const dy = ptr.y - p.y
          const d2 = dx * dx + dy * dy
          const R = 210
          if (d2 < R * R) {
            const d = Math.sqrt(d2) || 1
            const k = 1 - d / R
            alpha += k * 0.35
            radius += k * 0.3
          }
        }
        if (eBoost > 0 && hb) {
          const cxp = (hb.left + hb.right) / 2
          const cyp = (hb.top + hb.bottom) / 2
          const dx = cxp - p.x
          const dy = cyp - p.y
          const d2 = dx * dx + dy * dy
          const R = 360
          if (d2 < R * R) {
            const d = Math.sqrt(d2) || 1
            const k = 1 - d / R
            alpha += k * eBoost * 0.55
            radius += k * eBoost * 0.5
          }
        }
        ctx.beginPath()
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2)
        if (p.tone === 'warm')
          ctx.fillStyle = `rgba(232,188,124,${Math.min(1, alpha)})`
        else if (p.tone === 'cool')
          ctx.fillStyle = `rgba(150,170,196,${Math.min(1, alpha * 0.6)})`
        else ctx.fillStyle = `rgba(245,232,210,${Math.min(1, alpha * 0.85)})`
        ctx.fill()

        const isPunct = p.glyph === '·'
        const baseSize = isPunct
          ? 6 + radius * 4
          : 7 + radius * 7
        const pxSize = Math.max(6, Math.min(15, baseSize))
        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.spin)
        ctx.font = `${pxSize}px "Iowan Old Style", "Apple Garamond", Baskerville, Georgia, "Times New Roman", serif`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        const letterA = Math.min(1, alpha * 1.55)
        if (p.tone === 'warm')
          ctx.fillStyle = `rgba(248,218,168,${letterA})`
        else if (p.tone === 'cool')
          ctx.fillStyle = `rgba(202,220,236,${letterA * 0.78})`
        else ctx.fillStyle = `rgba(250,238,214,${letterA * 0.92})`
        ctx.fillText(p.glyph, 0, 0)
        ctx.restore()
      }
    }

    const step = () => {
      const { w, h } = dimsRef.current
      const parts = partsRef.current
      const ptr = pointerRef.current
      if (pulseRef.current > 0) pulseRef.current = Math.max(0, pulseRef.current - 0.014)
      if (echoRef.current > 0) echoRef.current = Math.max(0, echoRef.current - 0.0065)

      // Drive the candle flame's warmth from pointer proximity to the
      // hero — when the reader draws near the question, the flame
      // leans toward them, halo brightening. Eased gently so the
      // change feels like the candle, not the cursor.
      const hb = heroBoxRef.current
      let targetWarmth = 0
      if (hb && ptr.over) {
        const cxp = (hb.left + hb.right) / 2
        const cyp = (hb.top + hb.bottom) / 2
        const dx = ptr.x - cxp
        const dy = ptr.y - cyp
        const d2 = dx * dx + dy * dy
        const R = 460
        if (d2 < R * R) {
          const d = Math.sqrt(d2) || 1
          targetWarmth = 1 - d / R
        }
      }
      flameWarmthRef.current += (targetWarmth - flameWarmthRef.current) * 0.06
      const flameEl = flameWrapRef.current
      if (flameEl) {
        flameEl.style.setProperty(
          '--flame-warmth',
          flameWarmthRef.current.toFixed(3),
        )
      }

      for (const p of parts) {
        if (ptr.active) {
          const dx = ptr.x - p.x
          const dy = ptr.y - p.y
          const d2 = dx * dx + dy * dy
          const R = 220
          if (d2 < R * R && d2 > 1) {
            const d = Math.sqrt(d2)
            const f = (1 - d / R) * 0.035
            p.vx += (dx / d) * f
            p.vy += (dy / d) * f
          }
        }
        p.vx *= 0.978
        p.vy = p.vy * 0.982 - 0.0065
        p.vx += (Math.random() - 0.5) * 0.010
        p.vy += (Math.random() - 0.5) * 0.006 - 0.0010
        p.x += p.vx
        p.y += p.vy
        if (p.x < -4) p.x = w + 4
        else if (p.x > w + 4) p.x = -4
        if (p.y < -4) {
          p.y = h + 4
          p.x = Math.random() * w
          p.vy = -Math.random() * 0.14 - 0.02
          p.vx = (Math.random() - 0.5) * 0.05
        } else if (p.y > h + 4) p.y = h + 4
      }
      draw()
    }

    const onResize = () => {
      setupDims()
      seed()
      draw()
    }

    window.addEventListener('resize', onResize)

    let raf = 0
    let alive = true
    if (!reduced) {
      const tick = () => {
        if (!alive) return
        step()
        raf = requestAnimationFrame(tick)
      }
      tick()
    } else {
      draw()
    }

    return () => {
      alive = false
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
    }
  }, [reduced])

  useEffect(() => {
    if (!pulsing) return
    const t = setTimeout(() => setPulsing(false), 720)
    return () => clearTimeout(t)
  }, [pulsing])

  useEffect(() => {
    if (!tracing) return
    const t = setTimeout(() => setTracing(false), 1200)
    return () => clearTimeout(t)
  }, [tracing])

  useEffect(() => {
    if (!spattering) return
    const t = setTimeout(() => setSpattering(false), 1000)
    return () => clearTimeout(t)
  }, [spattering])

  useEffect(() => {
    if (!sealing) return
    const t = window.setTimeout(
      () => setSealing(false),
      reduced ? 900 : 1600,
    )
    return () => window.clearTimeout(t)
  }, [sealing, reduced])

  // The hero "quietus" — a single inward breath when the reader has
  // understood the chapter. Once the breath has settled, the flag is
  // cleared so the page returns to its idle state and the chapter
  // can be re-engaged from a quiet baseline.
  useEffect(() => {
    if (!quietus) return
    const t = window.setTimeout(
      () => setQuietus(false),
      reduced ? 1100 : 1900,
    )
    return () => window.clearTimeout(t)
  }, [quietus, reduced])

  const acknowledge = useCallback(() => {
    pulseRef.current = reduced ? 0 : 1
    echoRef.current = reduced ? 0 : 1
    setPulsing(true)
    setTracing(true)
    setSpattering(true)
    setNoteNonce((n) => n + 1)
    setPointing(true)
    setSealing(true)
    setSpineSealed(false)
    if (!reduced) setSpinePulseKey((k) => k + 1)
    const order: Corner[] = ['tl', 'tr', 'br']
    waveTimeoutsRef.current.forEach((t) => window.clearTimeout(t))
    waveTimeoutsRef.current = []
    const stagger = reduced ? 0 : 360
    const stepDelay = reduced ? 0 : 280
    const holdMs = reduced ? 1800 : 3800
    order.forEach((corner, i) => {
      const at = stepDelay + i * stagger
      const t1 = window.setTimeout(() => setEchoIdx(i), at)
      const t2 = window.setTimeout(
        () => setWhispersOn((w) => ({ ...w, [corner]: true })),
        at + (reduced ? 0 : 80),
      )
      const t3 = window.setTimeout(
        () => setWhispersOn((w) => ({ ...w, [corner]: false })),
        at + holdMs,
      )
      waveTimeoutsRef.current.push(t1, t2, t3)
    })
    const end = window.setTimeout(
      () => setEchoIdx(-1),
      stepDelay + order.length * stagger + (reduced ? 200 : 260),
    )
    waveTimeoutsRef.current.push(end)
    setAnswerChars(0)
    setReplyChars(0)
    setFootnoteChars(0)
    setIntellexiChars(0)
    setReplyOn(false)
    setFootnoteOn(false)
    setIntellexiOn(false)
    setQuietus(false)
    setAnswerOn(true)
    const ansOff = window.setTimeout(
      () => {
        setAnswerOn(false)
        setPointing(false)
      },
      reduced ? 2600 : 5200,
    )
    waveTimeoutsRef.current.push(ansOff)
  }, [reduced])

  const onHeroEnter = useCallback((e: ReactPointerEvent) => {
    pointerRef.current.over = true
    heroBoxRef.current = (e.currentTarget as HTMLElement).getBoundingClientRect()
  }, [])
  const onHeroLeave = useCallback(() => {
    pointerRef.current.over = false
    const el = heroRef.current
    if (el) {
      el.style.setProperty('--gaze-x', '0')
      el.style.setProperty('--gaze-y', '0')
    }
  }, [])
  const onHeroMove = useCallback((e: ReactPointerEvent) => {
    const el = e.currentTarget as HTMLElement
    heroBoxRef.current = el.getBoundingClientRect()
    const rect = heroBoxRef.current
    if (!rect) return
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const dx = (e.clientX - cx) / (rect.width / 2)
    const dy = (e.clientY - cy) / (rect.height / 2)
    const x = Math.max(-1, Math.min(1, dx))
    const y = Math.max(-1, Math.min(1, dy))
    el.style.setProperty('--gaze-x', String(x))
    el.style.setProperty('--gaze-y', String(y))
  }, [])

  const answerDisplay = answerOn ? ANSWER.slice(0, Math.max(0, answerChars)) : ''
  const replyDisplay = replyOn ? REPLY.slice(0, Math.max(0, replyChars)) : ''
  const footnoteDisplay = footnoteOn
    ? FOOTNOTE_TEXT.slice(0, Math.max(0, footnoteChars))
    : ''
  const footnoteDone = footnoteOn && footnoteChars >= FOOTNOTE_TEXT.length

  // Whether to render the rubricated initial: show it once the answer
  // has begun writing itself.
  const answerDropCapVisible = answerOn

  return (
    <main className={`stage ${bifolioAttending ? 'is-attending' : ''}`}>
      <canvas ref={canvasRef} className="dust" aria-hidden="true" />
      <div className="rim" aria-hidden="true" />
      <div className="codex-edge" aria-hidden="true" />
      <PaperGrain />
      <ReadingLantern />
      <BifolioSpine />
      <Watermark />
      <DriftConstellation />
      <Ribbon />

      <div className={`frame ${ready ? 'ready' : ''}`}>
        <CandleFlame wrapRef={flameWrapRef} flaring={pulsing} />
        <Taper />
        <Marg
          corner="tl"
          id="tl"
          label="folio"
          body="a question, slowly composed"
          whisper={whispersOn.tl}
          whisperText={WHISPERS[0].text}
          active={active}
          wave={echoIdx === 0}
          onHover={setActive}
          glyph={<Bifolio />}
        />
        <Marg
          corner="tr"
          id="tr"
          label="reading"
          body="the candle, the reader, the page"
          whisper={whispersOn.tr}
          whisperText={WHISPERS[1].text}
          active={active}
          wave={echoIdx === 1}
          onHover={setActive}
          ariaLabel="reading: the candle, the reader, the page"
        />
        <Marg
          corner="br"
          id="br"
          label="now"
          body="this instant, the only one that ever arrives"
          whisper={whispersOn.br}
          whisperText={WHISPERS[2].text}
          active={active}
          wave={echoIdx === 2}
          onHover={setActive}
          ariaLabel="now: this instant, the only one that ever arrives"
        />

        <div className={`composition ${ready ? 'ready' : ''} ${pointing ? 'is-pointing' : ''} ${quietus ? 'is-quietus' : ''}`}>
          <ChapterSpine pulseKey={spinePulseKey} sealed={spineSealed} />
          <PrinterDate />
          <Capitulum />
          <span className="rubric">
            <span className="rubric-pilcrow" aria-hidden="true">§</span>
            <span className="rubric-text">an inquiry</span>
            <span className="rubric-sep" aria-hidden="true">·</span>
            <IncipitCaption />
          </span>
          <Fleuron />
          <div className="hero-frame">
            <Horologium />
            <Speculum />
            <MarginalRubric />
            <button
              type="button"
            ref={heroRef}
            className={`hero ${drawn ? 'drawn' : ''} ${pulsing ? 'pulse' : ''} ${tracing ? 'echo' : ''} ${quietus ? 'is-quietus' : ''}`}
            onClick={acknowledge}
            onPointerEnter={(e) => {
              setPointing(true)
              onHeroEnter(e)
            }}
            onPointerLeave={() => {
              setPointing(false)
              onHeroLeave()
            }}
            onPointerMove={onHeroMove}
            onFocus={() => setPointing(true)}
            onBlur={() => setPointing(false)}
            aria-label="the question"
          >
            <span className="hero-svg-wrap">
              <svg viewBox="0 0 240 340" className="hero-svg" aria-hidden="true">
                <defs>
                  <radialGradient
                    id="auriole-radial"
                    cx="50%"
                    cy="50%"
                    r="50%"
                  >
                    <stop offset="0%"   stopColor="currentColor" stopOpacity="0.28" />
                    <stop offset="55%"  stopColor="currentColor" stopOpacity="0.08" />
                    <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
                  </radialGradient>
                  <radialGradient
                    id="bowl-bloom"
                    cx="50%"
                    cy="46%"
                    r="55%"
                  >
                    <stop offset="0%"   stopColor="currentColor" stopOpacity="0.42" />
                    <stop offset="58%"  stopColor="currentColor" stopOpacity="0.16" />
                    <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
                  </radialGradient>
                  <clipPath id="bowl-clip">
                    <ellipse cx="120" cy="71" rx="40" ry="30" />
                  </clipPath>
                </defs>
                <g className="auriole">
                  <circle
                    cx={120}
                    cy={170}
                    r={120}
                    fill="url(#auriole-radial)"
                    className="auriole-radial"
                  />
                  <circle
                    cx={120}
                    cy={170}
                    r={92}
                    className="auriole-trace"
                    pathLength={100}
                  />
                  <g className="auriole-pips">
                    <circle cx={120} cy={70} r={1.2} />
                    <circle cx={120} cy={270} r={1.2} />
                    <circle cx={20} cy={170} r={1.2} />
                    <circle cx={220} cy={170} r={1.2} />
                  </g>
                </g>
                <g className="hero-stack">
                  <path className="hero-stroke" d={HERO_PATH} pathLength={100} />
                  <path className="hero-trace" d={HERO_PATH} pathLength={100} />
                  <g className="hero-bowl-illumination" clipPath="url(#bowl-clip)">
                    <circle
                      cx="120"
                      cy="71"
                      r="44"
                      fill="url(#bowl-bloom)"
                      className="hero-bowl-bloom"
                    />
                    <IlluminatedStar />
                  </g>
                  <circle
                    className="hero-dot-ring"
                    cx={HERO_DOT.cx}
                    cy={HERO_DOT.cy}
                    r={HERO_DOT.r + 6}
                  />
                  <circle
                    className="hero-dot"
                    cx={HERO_DOT.cx}
                    cy={HERO_DOT.cy}
                    r={HERO_DOT.r}
                  />
                </g>
              </svg>
            </span>
            {spattering && (
              <span className="hero-spatter" aria-hidden="true">
                {SPATTER.map((s, i) => (
                  <span
                    key={i}
                    className="spatter-dot"
                    style={
                      {
                        '--angle': `${s.angle}deg`,
                        '--distance': `${s.distance}px`,
                        '--size': `${s.size}px`,
                        '--delay': `${s.delay}ms`,
                        '--op': `${s.op}`,
                      } as CSSProperties
                    }
                  />
                ))}
              </span>
            )}
            <SealImpression sealing={sealing} />
            <HeroSparkle />
            <span className="hero-question-link" aria-hidden="true" />
          </button>
          </div>
             <div className="question-block">
             <ChapterStamp />
             <VineCorner position="tl" />
             <VineCorner position="tr" />
             <VineCorner position="bl" />
             <VineCorner position="br" />
             <span className="question-kicker">a question in public</span>
             <FolioOpener />
             <h1 className="question">
              <span className="question-line">
                <span className="question-lead-punctus" aria-hidden="true">
                  <span className="question-lead-punctus-dot" />
                </span>
                <em className="incipit-i question-word">i</em>
                <em className="question-lead question-word">s</em>
              <span className="question-space"> </span>
                <em className="question-name question-word">Minimax&nbsp;M3</em>
                <span className="question-name-pause" aria-hidden="true">
                  <span className="question-name-pause-dot" />
                </span>
                <span className="question-verb-wrap">
                  <span className="question-verb question-word"> good at frontend </span>
                  <PredicateRule />
                </span>
                <span className="question-yet-pause" aria-hidden="true">
                  <span className="question-yet-pause-dot" />
                </span>
                <em className="question-yet question-word">yet</em>
                <span className="question-mark-group">
                  <span className="question-mark question-word">?</span>
                  <QuestionFlourish />
                </span>
              </span>
            </h1>
             <Maniculum active={pointing} />
             <VideAnnotation visible={answerOn && answerChars >= 6} />
             <p className="question-prompt">press the mark · the page answers</p>
            <span
              key={noteNonce}
              className={`question-underline${noteNonce > 0 ? ' is-on' : ''}`}
              aria-hidden="true"
            />
            <p
              className={`answer ${answerOn ? 'is-on' : ''}`}
              aria-live="polite"
            >
              {answerDropCapVisible && <AnswerDropCap visible={answerOn} />}
              <span className="answer-text">{answerDisplay}</span>
              {answerOn && answerChars < ANSWER.length && (
                <span className="answer-caret" aria-hidden="true">|</span>
              )}
            </p>
            {replyOn && <AnswerOrnament />}
            <p
              className={`reply ${replyOn ? 'is-on' : ''}`}
              aria-live="polite"
            >
              {replyOn && (
                <span className="reply-rule" aria-hidden="true" />
              )}
              <span className="reply-text">{replyDisplay}</span>
              {replyOn && replyChars < REPLY.length && (
                <span className="reply-caret" aria-hidden="true">|</span>
              )}
              {replyOn && replyChars >= REPLY.length && (
                <span className="reply-end" aria-hidden="true">
                  <Fleuron />
                </span>
              )}
            </p>
            <ScholasticFootnote
              visible={footnoteOn}
              text={footnoteDisplay}
              done={footnoteDone}
            />
            <Explicit />
            <IntellexiNota
              visible={intellexiOn}
              text={intellexiOn ? 'intellexi'.slice(0, Math.max(0, intellexiChars)) : ''}
              done={intellexiOn && intellexiChars >= 'intellexi'.length}
            />
          </div>
        </div>

        <div className="colophon" aria-hidden="true">
          <span className="colophon-seal">
            <CompassMark />
            <WaxSeal />
          </span>
          <span className="colophon-rule" />
          <span className="colophon-pair">
            <em className="colophon-quaeritur">quaeritur</em>
            <span className="colophon-pair-arrow" aria-hidden="true">›</span>
            <em className="colophon-respondetur">respondetur</em>
          </span>
          <span className="colophon-rule" />
          <span className="colophon-signature-row">
            <Signature />
            <span className="colophon-folio">folio · xviii</span>
          </span>
          <PenTrial />
          <span className="colophon-provenance">legi · mmxxvi</span>
        </div>
      </div>
    </main>
  )
}