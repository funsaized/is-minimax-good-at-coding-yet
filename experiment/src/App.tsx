import {
  useEffect,
  useRef,
  useState,
  useCallback,
  type PointerEvent as ReactPointerEvent,
  type CSSProperties,
} from 'react'

const HERO_PATH =
  'M 65 115 C 65 5 175 5 175 115 C 175 172 120 156 120 205 L 120 250'
const HERO_DOT = { cx: 120, cy: 286, r: 17 }

// Watermark — same curve as the hero, blown up, ghosted into the page
const WIDE_PATH =
  'M 195 345 C 195 15 525 15 525 345 C 525 516 360 468 360 615 L 360 750'
const WIDE_DOT = { cx: 360, cy: 858, r: 51 }

// Deliberate ink-arc spatter: a flourish that reads as one gesture, not noise
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

// Letter dust — the alphabet motes that drift up through the chapter.
// Each canvas particle carries one glyph from the question and the
// manuscript's vocabulary, so the candle-glow above the question mark
// reads as illuminated letterforms, not generic embers.
const DUST_GLYPHS = [
  'i', 's', 'M', 'm', 'r', 'n', 't', 'f', 'l', 'a',
  '·', '·', '·', '·', '·',
]

type Whisper = { corner: Corner; text: string }

const WHISPERS: Whisper[] = [
  { corner: 'tl', text: 'this page is its own footnote' },
  { corner: 'tr', text: 'the browser is the chapter; the cursor, the pen' },
  { corner: 'bl', text: 'lit not by display, but by attention' },
  { corner: 'br', text: 'this instant, the only one that ever arrives' },
]

const ANSWER =
  '— and the page itself, which you are reading now.'

const REPLY =
  'so read it once, then again — slower this time.'

// Scholastic gloss in vermilion — a single rubricated marginal word
// sitting just outside the hero, the medieval reader's "Qu." (quaeritur).
const MARGINAL_RUBRIC = 'Qu.'

const ANSWER_STAGGER_MS = 34
const REPLY_STAGGER_MS = 26

// Scholastic glosses — short italicized commentaries that surface near the
// hero when the reader approaches. Three notes, cycled gently.
const SCHOLASTIC_NOTES: string[] = [
  'a question first asked, then asked again',
  '— still being composed, never quite set',
  'asked each time; settled each time differently',
]
const SCHOLASTIC_CYCLE_MS = 4400

// A short self-typed caption that sits above the chapter piece, like a
// printer's margin note introducing the folio without ceremony.
const PRINTER_NOTE = '· a question, typeset in pixels ·'
const PRINTER_NOTE_DELAY = 2400
const PRINTER_NOTE_STEP = 42

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

function useTick(intervalMs: number) {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), intervalMs)
    return () => clearInterval(id)
  }, [intervalMs])
  return now
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
        xiii
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

// PrinterLeaf — a tiny diamond-and-rule ornament used to flank the
// capitulum running title, in the manner of an old printer's typog-
// raphic mark. Geometric strokes only, no organic curves.
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

// Capitulum — the running title that crowns the chapter, the way a real
// manuscript folio declares where it sits in a bound volume. Mixed
// typography: a manuscript abbreviation in small-caps mono, an italic
// folio number, a Latin gloss for the chapter — flanked by twin printer's
// leaves. Declares nothing the page can't fulfill.
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
        <span className="capitulum-num">xiii</span>
        <span className="capitulum-sep">·</span>
        <em className="capitulum-it">de quaestione frontis</em>
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

function Nib() {
  return (
    <svg
      className="orn-glyph"
      viewBox="0 0 18 26"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M 9 1.5 L 14.4 14 L 9 24.5 L 3.6 14 Z"
        className="glyph-stroke"
      />
      <line x1="9" y1="3.6" x2="9" y2="11.5" className="glyph-spine" />
      <circle cx="9" cy="13.6" r="0.9" className="glyph-inkwell" />
      <line x1="6.6" y1="16.6" x2="11.4" y2="16.6" className="glyph-spine" />
      <line x1="7.2" y1="19.2" x2="10.8" y2="19.2" className="glyph-spine" opacity="0.6" />
    </svg>
  )
}

function Asterism() {
  return (
    <svg
      className="orn-glyph"
      viewBox="0 0 26 26"
      aria-hidden="true"
      focusable="false"
    >
      <g className="glyph-rays">
        <line x1="13" y1="3" x2="13" y2="23" />
        <line x1="4.3" y1="8" x2="21.7" y2="18" />
        <line x1="4.3" y1="18" x2="21.7" y2="8" />
      </g>
      <circle cx="13" cy="13" r="1.7" className="glyph-core" />
      <circle cx="13" cy="3.5" r="0.7" className="glyph-bead" />
      <circle cx="13" cy="22.5" r="0.7" className="glyph-bead" />
      <circle cx="4.5" cy="8.3" r="0.7" className="glyph-bead" />
      <circle cx="21.5" cy="17.7" r="0.7" className="glyph-bead" />
      <circle cx="4.5" cy="17.7" r="0.7" className="glyph-bead" />
      <circle cx="21.5" cy="8.3" r="0.7" className="glyph-bead" />
    </svg>
  )
}

// Manicule — a small pointing hand, the medieval reader's symbol for
// "look here". Sits below the question mark like an invitation to press.
function Manicule() {
  return (
    <svg
      className="manicule"
      viewBox="0 0 22 30"
      aria-hidden="true"
      focusable="false"
    >
      {/* Sleeve cuff */}
      <path
        className="manicule-stroke"
        d="M 4 26 L 4 28.5 L 18 28.5 L 18 26"
      />
      <line
        x1="4.4"
        y1="27.2"
        x2="17.6"
        y2="27.2"
        className="manicule-rule"
      />

      {/* Wrist and palm */}
      <path
        className="manicule-stroke"
        d="M 5.5 26 L 5.5 22.4 Q 5.5 20.4 7 19.6 L 14.5 19.6 Q 16 19.8 16.4 21.2 L 16.4 26"
      />

      {/* Curled fingers (three lines suggesting knuckles) */}
      <path
        className="manicule-knuckle"
        d="M 7.2 19.6 Q 6.6 17.4 8.2 17 Q 9.4 17 9.4 19"
      />
      <path
        className="manicule-knuckle"
        d="M 9.6 19.4 Q 9.6 17.2 11 17 Q 12 17.2 11.6 19.4"
      />
      <path
        className="manicule-knuckle"
        d="M 13.8 19.4 Q 13.8 17.2 14.4 17 Q 15.6 16.8 15.4 19.4"
      />

      {/* Thumb wrap */}
      <path
        className="manicule-knuckle"
        d="M 5.8 22 Q 4 21 4.4 19.2 Q 5 18 6.2 18.6"
      />

      {/* Index finger pointing up */}
      <path
        className="manicule-stroke"
        d="M 11 19 L 11 4 Q 11 2.6 12 2.6 Q 13 2.6 13 4 L 13 18.6"
      />
      <path
        className="manicule-knuckle"
        d="M 11.2 14 Q 11.2 12.6 12 12.6 Q 12.8 12.6 12.8 14"
      />
    </svg>
  )
}

// The printer's seal — a small italic "Mm" monogram inside a double ring,
// standing in for a handwritten sign-manual. Renders between the colophon lines.
function PrinterSeal() {
  return (
    <svg
      className="printer-seal"
      viewBox="0 0 40 40"
      aria-hidden="true"
      focusable="false"
    >
      <circle
        cx="20"
        cy="20"
        r="18"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.6"
        className="seal-ring seal-ring-outer"
      />
      <circle
        cx="20"
        cy="20"
        r="14"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.4"
        className="seal-ring seal-ring-inner"
      />
      <text
        x="20"
        y="25"
        textAnchor="middle"
        className="seal-letter"
      >
        Mm
      </text>
      <circle cx="20" cy="8.5" r="0.5" className="seal-pip" />
      <circle cx="20" cy="31.5" r="0.5" className="seal-pip" />
    </svg>
  )
}

function RegisterCross() {
  return (
    <svg
      className="register-cross"
      viewBox="0 0 10 10"
      width="10"
      height="10"
      aria-hidden="true"
    >
      <circle cx="5" cy="5" r="3.4" fill="none" stroke="currentColor" strokeWidth="0.5" />
      <line x1="0" y1="5" x2="10" y2="5" stroke="currentColor" strokeWidth="0.5" />
      <line x1="5" y1="0" x2="5" y2="10" stroke="currentColor" strokeWidth="0.5" />
    </svg>
  )
}

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

// A faint oversized ghost of the hero curve, behind everything — the page's shadow
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

// Taper — a faint candlelight beam falling onto the question mark from above.
// Reads as the page being read by lamplight: warm, vertical, almost a breath.
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
          <stop offset="58%"  stopColor="currentColor" stopOpacity="0.18" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.46" />
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

// Signature — a typeset gathering mark for the colophon, in the manner of an
// old printer's signature on a folio. Replaces a plain "folio xi" label.
function Signature() {
  return (
    <svg
      className="signature"
      viewBox="0 0 64 14"
      aria-hidden="true"
      focusable="false"
    >
      <line x1="2"  y1="9" x2="14" y2="9" className="sig-rule" />
      <text x="32" y="11.5" textAnchor="middle" className="sig-letter">xiii</text>
      <line x1="50" y1="9" x2="62" y2="9" className="sig-rule" />
      <circle cx="18" cy="9" r="0.7" className="sig-pip" />
      <circle cx="46" cy="9" r="0.7" className="sig-pip" />
    </svg>
  )
}

// Bee — the printer's bee, Aldine mark. A small messenger that emerges
// from the question when it is acknowledged and carries the reply to one
// of the four marginalia corners. Hovers in place once it has arrived.
function Bee() {
  return (
    <svg className="bee-glyph" viewBox="0 0 32 24" aria-hidden="true" focusable="false">
      <g className="bee-body-group">
        <ellipse className="bee-wing bee-wing-l" cx="11" cy="6" rx="5.6" ry="3.7" />
        <ellipse className="bee-wing bee-wing-r" cx="21" cy="6" rx="5.6" ry="3.7" />
        <ellipse className="bee-body" cx="16" cy="14.2" rx="7.6" ry="4.6" />
        <path className="bee-stripe" d="M 11.4 11.6 Q 11.8 14.2 11.4 16.9" />
        <path className="bee-stripe" d="M 16 11.2 Q 16 14.2 16 17.2" />
        <path className="bee-stripe" d="M 20.6 11.6 Q 20.2 14.2 20.6 16.9" />
        <circle className="bee-head" cx="23.7" cy="13.7" r="2.4" />
        <circle className="bee-eye" cx="24.5" cy="13.2" r="0.45" />
        <path className="bee-ant" d="M 24.1 11.7 Q 25 10 25.8 8.6" />
        <path className="bee-ant" d="M 25.1 12.1 Q 26.4 10.9 27.4 9.5" />
      </g>
    </svg>
  )
}

// MarginalRubric — a small vermilion annotation sitting in the left margin
// of the hero, connected by a hairline to the bracket. The scribal "Qu."
// (quaeritur) — a tag hung next to a passage to flag it as a question.
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
// Subtle enough to read as paper, never as a gimmick.
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

// BracketFlourish — a delicate curled bracket that flanks the hero like the
// scoring around an illuminated initial. Pairs left and right; one tiny
// vermillion pip gives it the rubric accent of a manuscript drop-cap.
function BracketFlourish({ side }: { side: 'left' | 'right' }) {
  const d =
    side === 'left'
      ? 'M 24 6 Q 6 6 6 26 L 6 74 Q 6 94 24 94'
      : 'M 4 6 Q 22 6 22 26 L 22 74 Q 22 94 4 94'
  return (
    <svg
      className={`bracket-flourish bracket-flourish-${side}`}
      viewBox="0 0 28 100"
      aria-hidden="true"
      focusable="false"
    >
      <path className="bracket-curve" d={d} pathLength={100} />
      <circle
        cx={side === 'left' ? 12 : 16}
        cy="50"
        r="1.4"
        className="bracket-pip"
      />
      <circle
        cx={side === 'left' ? 12 : 16}
        cy="50"
        r="3.2"
        className="bracket-pip-halo"
      />
      <circle
        cx={side === 'left' ? 3 : 25}
        cy="50"
        r="0.8"
        className="bracket-pip-faint"
      />
    </svg>
  )
}

// ScholasticGloss — a single line of italicized scholarly commentary that
// surfaces beneath the hero when the reader approaches. Cycles slowly
// through three notes; in reduced motion a single static note stays.
function ScholasticGloss({
  active,
  reduced,
}: {
  active: boolean
  reduced: boolean
}) {
  const [idx, setIdx] = useState(0)
  const [visible, setVisible] = useState(false)
  const timerRef = useRef<number>(0)
  const fadeTimerRef = useRef<number>(0)

  useEffect(() => {
    if (reduced) {
      setIdx(0)
      setVisible(active)
      return
    }
    if (active) {
      setVisible(true)
      timerRef.current = window.setTimeout(() => {
        setIdx((i) => (i + 1) % SCHOLASTIC_NOTES.length)
      }, SCHOLASTIC_CYCLE_MS)
      return () => clearTimeout(timerRef.current)
    }
    fadeTimerRef.current = window.setTimeout(() => setVisible(false), 420)
    return () => clearTimeout(fadeTimerRef.current)
  }, [active, idx, reduced])

  const note = SCHOLASTIC_NOTES[idx]
  return (
    <p
      className={`scholastic-gloss ${visible ? 'is-on' : ''}`}
      aria-live="polite"
    >
      <span className="scholastic-gloss-rule" aria-hidden="true" />
      <span key={idx} className="scholastic-gloss-text">
        {note}
      </span>
    </p>
  )
}

// A small ink-trail dot that lingers where the cursor has been.
// It decays back to invisible when the cursor stops moving — the page
// marks only what's being read.
function InkTrail({
  x,
  y,
  active,
}: {
  x: number
  y: number
  active: boolean
}) {
  return (
    <span
      className={`ink-trail${active ? ' is-active' : ''}`}
      style={{ transform: `translate(${x}px, ${y}px)` } as CSSProperties}
      aria-hidden="true"
    >
      <span className="ink-trail-core" />
      <span className="ink-trail-halo" />
    </span>
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
  const [glossActive, setGlossActive] = useState(false)
  const [noteNonce, setNoteNonce] = useState(0)
  const [answerOn, setAnswerOn] = useState(false)
  const [answerChars, setAnswerChars] = useState(0)
  const [replyOn, setReplyOn] = useState(false)
  const [replyChars, setReplyChars] = useState(0)
  const [printerNoteOn, setPrinterNoteOn] = useState(false)
  const [printerNoteChars, setPrinterNoteChars] = useState(0)
  const [bee, setBee] = useState<{
    visible: boolean
    flying: boolean
    arrived: boolean
    startX: number
    startY: number
    tx: string
    ty: string
    rot: string
  }>({
    visible: false,
    flying: false,
    arrived: false,
    startX: 0,
    startY: 0,
    tx: '0px',
    ty: '0px',
    rot: '0deg',
  })
  const beeTimeoutsRef = useRef<number[]>([])
  const pulseRef = useRef(0)
  const echoRef = useRef(0)
  const partsRef = useRef<Particle[]>([])
  const dimsRef = useRef({ w: 0, h: 0 })
  const pointerRef = useRef({ x: 0, y: 0, active: false, over: false })
  const heroBoxRef = useRef<DOMRect | null>(null)
  const heroRef = useRef<HTMLButtonElement>(null)
  const waveTimeoutsRef = useRef<number[]>([])
  const trailRef = useRef({ x: -100, y: -100, active: false, last: 0 })
  const [trail, setTrail] = useState({ x: -100, y: -100, active: false })
  const now = useTick(reduced ? 60_000 : 1000)
  const arrivalRef = useRef<number>(Date.now())

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

  // Begin typing the reply once the answer has finished writing itself out.
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

  // Printer's note — a self-typed caption that settles above the chapter
  // piece once the rest of the folio has composed itself.
  useEffect(() => {
    if (reduced) {
      const t = window.setTimeout(
        () => setPrinterNoteOn(true),
        Math.min(PRINTER_NOTE_DELAY, 800),
      )
      return () => clearTimeout(t)
    }
    const t = window.setTimeout(
      () => setPrinterNoteOn(true),
      PRINTER_NOTE_DELAY,
    )
    return () => clearTimeout(t)
  }, [reduced])

  useEffect(() => {
    if (!printerNoteOn) {
      setPrinterNoteChars(0)
      return
    }
    if (reduced) {
      setPrinterNoteChars(PRINTER_NOTE.length)
      return
    }
    const total = PRINTER_NOTE.length
    if (printerNoteChars >= total) return
    const id = window.setTimeout(
      () => setPrinterNoteChars((c) => Math.min(total, c + 1)),
      PRINTER_NOTE_STEP,
    )
    return () => clearTimeout(id)
  }, [printerNoteOn, printerNoteChars, reduced])

  // Cursor ink-trail — a single faint dot that lingers under the pointer
  // and fades when the cursor stops moving. Tracks in a rAF loop so the
  // visual update isn't coupled to React's pointer event rate.
  useEffect(() => {
    if (reduced) return
    let raf = 0
    let alive = true
    const tick = () => {
      if (!alive) return
      const t = trailRef.current
      const dx = pointerRef.current.x - t.x
      const dy = pointerRef.current.y - t.y
      const dist2 = dx * dx + dy * dy
      if (dist2 > 4 || t.active) {
        t.x += dx * 0.28
        t.y += dy * 0.28
        const moving = dist2 > 36
        t.active = moving
        if (moving || performance.now() - t.last < 220) {
          setTrail({ x: t.x, y: t.y, active: true })
        } else {
          setTrail((p) => ({ ...p, active: false }))
        }
      }
      raf = requestAnimationFrame(tick)
    }
    const onMove = (e: PointerEvent) => {
      pointerRef.current.x = e.clientX
      pointerRef.current.y = e.clientY
      trailRef.current.last = performance.now()
      trailRef.current.active = true
    }
    const onLeave = () => {
      trailRef.current.active = false
    }
    tick()
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerleave', onLeave)
    return () => {
      alive = false
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerleave', onLeave)
    }
  }, [reduced])

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
        // Embers brighter near their source (bottom), fading as they rise —
        // height-based attenuation so the column above the question feels lit.
        const yRatio = Math.min(1, Math.max(0, p.y / Math.max(1, h)))
        const heightFade = 0.32 + 0.68 * (1 - yRatio)
        let alpha = p.a * heightFade * (1 + boost * 1.1)
        let radius = p.r * (1 + boost * 0.5)
        // Always-on warm glow around the question mark — the candle.
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

        // Letter-mote: render a single small glyph on top of the halo,
        // so the dust reads as a drift of illuminated letterforms.
        // Larger dots carry larger letters; smaller dots become punctuation.
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
        // Embers drift gently upward; small random sway.
        p.vx *= 0.978
        p.vy = p.vy * 0.982 - 0.0065
        p.vx += (Math.random() - 0.5) * 0.010
        p.vy += (Math.random() - 0.5) * 0.006 - 0.0010
        p.x += p.vx
        p.y += p.vy
        if (p.x < -4) p.x = w + 4
        else if (p.x > w + 4) p.x = -4
        // Top → bottom respawn, like fresh embers rising from the candle.
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

  const launchBee = useCallback(() => {
    if (reduced) return
    const hero = heroRef.current
    if (!hero) return
    const rect = hero.getBoundingClientRect()
    const startX = rect.left + rect.width / 2
    const startY = rect.top + rect.height / 2
    const vw = window.innerWidth
    const vh = window.innerHeight
    // Pick a random corner that isn't already occupied by an active whisper.
    // If multiple are lit at this moment, prefer the one furthest from the
    // mouse — bees, like questions, tend toward quiet corners.
    const corners: Corner[] = ['tl', 'tr', 'bl', 'br']
    const isSmall = vw < 520
    const padX = isSmall ? 70 : 150
    const padY = isSmall ? 70 : 95
    const baseTarget = (corner: Corner) => ({
      x:
        corner === 'tl'
          ? padX
          : corner === 'tr'
            ? vw - padX
            : corner === 'bl'
              ? padX
              : vw - padX,
      y:
        corner === 'tl'
          ? padY
          : corner === 'tr'
            ? padY
            : corner === 'bl'
              ? vh - padY
              : vh - padY,
    })
    const corner = corners[Math.floor(Math.random() * corners.length)]
    const target = baseTarget(corner)
    // Reset to start position, invisible — the bee isn't on the page yet.
    beeTimeoutsRef.current.forEach((t) => window.clearTimeout(t))
    beeTimeoutsRef.current = []
    setBee({
      visible: false,
      flying: false,
      arrived: false,
      startX,
      startY,
      tx: '0px',
      ty: '0px',
      rot: '0deg',
    })
    // Summon: the bee is born from the question mark after a brief breath.
    // Two-step state change so the element mounts at start before flying,
    // which lets the CSS transition animate the flight instead of snapping.
    const showDelay = 720
    const flightMs = 2200
    const t1 = window.setTimeout(() => {
      setBee((b) => ({
        ...b,
        visible: true,
        flying: false,
        tx: '0px',
        ty: '0px',
        rot: '0deg',
      }))
      // Next frame: kick off the flight.
      const t2 = window.setTimeout(() => {
        setBee((b) => ({
          ...b,
          flying: true,
          tx: `${target.x - startX}px`,
          ty: `${target.y - startY}px`,
          rot: `${(Math.random() - 0.5) * 26}deg`,
        }))
        // Arrive: stop flying, begin gentle hovering at the corner.
        const t3 = window.setTimeout(() => {
          setBee((b) => ({ ...b, flying: false, arrived: true }))
        }, flightMs)
        beeTimeoutsRef.current.push(t3)
      }, 60)
      beeTimeoutsRef.current.push(t2)
    }, showDelay)
    beeTimeoutsRef.current.push(t1)
  }, [reduced])

  const acknowledge = useCallback(() => {
    pulseRef.current = reduced ? 0 : 1
    echoRef.current = reduced ? 0 : 1
    setPulsing(true)
    setTracing(true)
    setSpattering(true)
    setNoteNonce((n) => n + 1)
    const order: Corner[] = ['tl', 'tr', 'bl', 'br']
    waveTimeoutsRef.current.forEach((t) => window.clearTimeout(t))
    waveTimeoutsRef.current = []
    const stagger = reduced ? 0 : 300
    const stepDelay = reduced ? 0 : 260
    const holdMs = reduced ? 1600 : 3400
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
    setReplyOn(false)
    setAnswerOn(true)
    const ansOff = window.setTimeout(
      () => setAnswerOn(false),
      reduced ? 2600 : 5200,
    )
    waveTimeoutsRef.current.push(ansOff)
    launchBee()
  }, [reduced, launchBee])

  const onHeroEnter = useCallback((e: ReactPointerEvent) => {
    pointerRef.current.over = true
    heroBoxRef.current = (e.currentTarget as HTMLElement).getBoundingClientRect()
    setGlossActive(true)
  }, [])
  const onHeroLeave = useCallback(() => {
    pointerRef.current.over = false
    setGlossActive(false)
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

  const d = new Date(now)
  const secAngle =
    (d.getSeconds() / 60) * 360 + (d.getMilliseconds() / 1000) * (360 / 60)
  const minAngle = (d.getMinutes() / 60) * 360 + (d.getSeconds() / 60) * 6
  const hh = d.getHours().toString().padStart(2, '0')
  const mm = d.getMinutes().toString().padStart(2, '0')

  // Reading-since — a quiet timestamp of when the page first noticed you.
  const arrivedAt = new Date(arrivalRef.current)
  const arrivedHH = arrivedAt.getHours().toString().padStart(2, '0')
  const arrivedMM = arrivedAt.getMinutes().toString().padStart(2, '0')
  const elapsedMin = Math.max(
    0,
    Math.floor((now - arrivalRef.current) / 60_000),
  )

  const answerDisplay = answerOn ? ANSWER.slice(0, Math.max(0, answerChars)) : ''
  const replyDisplay = replyOn ? REPLY.slice(0, Math.max(0, replyChars)) : ''

  return (
    <main className="stage">
      <canvas ref={canvasRef} className="dust" aria-hidden="true" />
      <div className="rim" aria-hidden="true" />
      <div className="codex-edge" aria-hidden="true" />
      <PaperGrain />
      <BifolioSpine />
      <Watermark />

      <div className={`frame ${ready ? 'ready' : ''}`}>
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
          label="medium"
          body="the browser is the paper"
          whisper={whispersOn.tr}
          whisperText={WHISPERS[1].text}
          active={active}
          wave={echoIdx === 1}
          onHover={setActive}
          glyph={<Nib />}
        />
        <Marg
          corner="bl"
          id="bl"
          label="craft"
          body="typeset in pixels, drawn in code"
          whisper={whispersOn.bl}
          whisperText={WHISPERS[2].text}
          active={active}
          wave={echoIdx === 2}
          onHover={setActive}
          glyph={<Asterism />}
        />
        <Marg
          corner="br"
          id="br"
          label="now"
          whisper={whispersOn.br}
          whisperText={WHISPERS[3].text}
          active={active}
          wave={echoIdx === 3}
          onHover={setActive}
          ariaLabel={`Local time ${hh}:${mm}. Reading since ${arrivedHH}:${arrivedMM}.`}
        >
          <span className="marg-now">
            <span className="marg-now-time">
              {hh}
              <span className="clock-colon">:</span>
              {mm}
            </span>
            <span className="clock" aria-hidden="true">
              <span className="clock-ring" />
              <span className="clock-pivot" />
              <span
                className="clock-hand clock-hand-min"
                style={{ transform: `rotate(${minAngle}deg)` }}
              />
              <span
                className="clock-hand clock-hand-sec"
                style={{ transform: `rotate(${secAngle}deg)` }}
              />
            </span>
          </span>
          <span className="marg-since" aria-hidden="true">
            <span className="marg-since-rule" />
            <span className="marg-since-label">since</span>
            <span className="marg-since-time">{arrivedHH}:{arrivedMM}</span>
            <span className="marg-since-dim">· {elapsedMin}m read</span>
          </span>
        </Marg>

        <div className={`composition ${ready ? 'ready' : ''}`}>
          <Capitulum />
          <p
            className={`printer-note ${printerNoteOn ? 'is-on' : ''}`}
            aria-live="polite"
          >
            <span className="printer-note-text">
              {PRINTER_NOTE.slice(0, Math.max(0, printerNoteChars))}
            </span>
            {printerNoteOn && printerNoteChars < PRINTER_NOTE.length && (
              <span className="printer-note-caret" aria-hidden="true">_</span>
            )}
          </p>
          <FolioMark />
          <span className="rubric">
            <span className="rubric-pilcrow" aria-hidden="true">§</span>
            <span className="rubric-text">an inquiry</span>
          </span>
          <Fleuron />
          <div className="hero-frame">
            <MarginalRubric />
            <BracketFlourish side="left" />
            <button
              type="button"
            ref={heroRef}
            className={`hero ${drawn ? 'drawn' : ''} ${pulsing ? 'pulse' : ''} ${tracing ? 'echo' : ''}`}
            onClick={acknowledge}
            onPointerEnter={onHeroEnter}
            onPointerLeave={onHeroLeave}
            onPointerMove={onHeroMove}
            onFocus={() => setGlossActive(true)}
            onBlur={() => setGlossActive(false)}
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
                    <stop offset="0%"   stopColor="currentColor" stopOpacity="0.26" />
                    <stop offset="55%"  stopColor="currentColor" stopOpacity="0.08" />
                    <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
                  </radialGradient>
                </defs>
                <g className="auriole">
                  <circle
                    cx={120}
                    cy={170}
                    r={134}
                    fill="url(#auriole-radial)"
                    className="auriole-radial"
                  />
                  <circle
                    cx={120}
                    cy={170}
                    r={36}
                    className="auriole-ring auriole-r3"
                  />
                  <circle
                    cx={120}
                    cy={170}
                    r={48}
                    className="auriole-spinner"
                    pathLength={100}
                  />
                  <circle
                    cx={120}
                    cy={170}
                    r={60}
                    className="auriole-ring auriole-r2"
                  />
                  <circle
                    cx={120}
                    cy={170}
                    r={86}
                    className="auriole-ring auriole-r1"
                  />
                  <g className="auriole-pips">
                    <circle cx={120} cy={56} r={1.2} />
                    <circle cx={120} cy={284} r={1.2} />
                    <circle cx={6} cy={170} r={1.2} />
                    <circle cx={234} cy={170} r={1.2} />
                    <circle cx={41} cy={91} r={0.9} />
                    <circle cx={199} cy={91} r={0.9} />
                    <circle cx={41} cy={249} r={0.9} />
                    <circle cx={199} cy={249} r={0.9} />
                  </g>
                </g>
                <g className="hero-stack">
                  <path className="hero-stroke" d={HERO_PATH} pathLength={100} />
                  <path className="hero-trace" d={HERO_PATH} pathLength={100} />
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
          </button>
            <BracketFlourish side="right" />
          </div>
          <div className="manicule-wrap" aria-hidden="true">
            <Manicule />
          </div>
          <ScholasticGloss active={glossActive} reduced={reduced} />
          <div className="question-block">
            <h1 className="question">
              <span className="question-rule" aria-hidden="true" />
              <em className="question-lead">is</em>{' '}
              <em className="question-name">Minimax M3</em> good at frontend{' '}
              <em className="question-yet">yet</em>?
            </h1>
            <span
              key={noteNonce}
              className={`question-underline${noteNonce > 0 ? ' is-on' : ''}`}
              aria-hidden="true"
            />
            <p
              className={`answer ${answerOn ? 'is-on' : ''}`}
              aria-live="polite"
            >
              <span className="answer-text">{answerDisplay}</span>
              {answerOn && answerChars < ANSWER.length && (
                <span className="answer-caret" aria-hidden="true">|</span>
              )}
            </p>
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
          </div>
        </div>

        <div className="colophon" aria-hidden="true">
          <Signature />
          <span className="colophon-rule" />
          <span className="colophon-quaeritur">quaeritur</span>
          <span className="colophon-rule" />
          <span className="colophon-folio">folio · xiii</span>
          <span className="colophon-line colophon-line-1">
            typeset in pixels · lit by attention
          </span>
          <span className="colophon-seal">
            <PrinterSeal />
          </span>
          <span className="colophon-mark">
            <RegisterCross />
          </span>
          <span className="catchword">
            <span className="catchword-rule" />
            <span className="catchword-label">catch</span>
            <span className="catchword-dot" aria-hidden="true">·</span>
            <span className="catchword-word">iterum</span>
          </span>
        </div>
      </div>

      <InkTrail x={trail.x} y={trail.y} active={trail.active} />
      {bee.visible && (
        <div
          className={`bee-flight ${bee.flying ? 'is-flying' : ''} ${bee.arrived ? 'is-arrived' : ''}`}
          style={{
            left: `${bee.startX}px`,
            top: `${bee.startY}px`,
            transform: `translate(${bee.tx}, ${bee.ty}) rotate(${bee.rot})`,
          }}
          aria-hidden="true"
        >
          <span className="bee-hover">
            <Bee />
          </span>
        </div>
      )}
    </main>
  )
}
