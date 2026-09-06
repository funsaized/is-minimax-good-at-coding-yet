import {
  useEffect,
  useRef,
  useState,
  useCallback,
  type PointerEvent as ReactPointerEvent,
  type CSSProperties,
  type RefObject,
} from 'react'

// ─────────────────────────────────────────────────────────────────────────────
// Iteration 72 — direction: "the chapter, opened."
//
// The composition now reads as a single opened chapter page. Three new
// touches strengthen what the existing pieces already imply:
//
//   1. Chapter heading — a small "cap. xviii" mark sits in the upper
//      margin like a real chapter opener, with a printer's fleuron.
//   2. Bookmark ribbon — a slim vermilion ribbon hangs from the page's
//      upper edge, pinned through the folio number. Quiet detail;
//      earns its place as the page's only ornament not in the reading
//      order itself.
//   3. The reading pace control moves from the colophon's foot up to
//      sit directly beneath the question, where the reader's eye
//      naturally falls after the title — and where it can answer
//      the question rather than summarise the chapter.
//
// The answer's typography is also gently enlarged so the chapter's
// voice carries the weight of the question it answers, and the
// colophon's competing rules and seals are simplified into a single
// clean signature line — chapter → reading pace → answer → body
// cadence → colophon, in the order a scholar's reader would meet it.
// ─────────────────────────────────────────────────────────────────────────────

// The hero question mark — a hand-drawn bowl that opens wider at the top,
// tapers into the stem via a smooth curve, and finishes with a slightly
// off-centre dot that reads as a natural continuation of the stroke.
const HERO_PATH =
  'M 64 112 C 44 -22 200 -22 180 112 C 172 184 130 170 126 222 C 124 244 124 262 124 284'
const HERO_DOT = { cx: 124, cy: 310, r: 17 }
const HERO_HIGHLIGHT_PATH =
  'M 68 106 C 56 -8 184 -10 176 108'

// Lettered dust — biased toward the question's own letters, with a few
// manuscript abbreviations, so the candle-glow reads as illuminated
// letterforms being typed into the air, not generic embers.
const DUST_GLYPHS = [
  'i', 's', 'm', 'm', 'r', 'n', 't', 'f', 'l', 'a',
  'g', 'o', 'y', 'e', 'd',
  '·', '·', '·', '·', '·',
]

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

// ─── Paper grain ────────────────────────────────────────────────────────────
// A subtle warm noise painted across the whole stage — the page's
// parchment texture. Stays soft; never reads as visible noise.
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

// ─── Reading lantern ────────────────────────────────────────────────────────
// A soft warm halo that follows the cursor, like the reader's attention
// bringing its own light to the page. Fades in on the first pointermove
// and out shortly after the reader's attention drifts. Hidden on touch
// devices in steady state.
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

// ─── Taper (candle's cone of light) ─────────────────────────────────────────
// A diffused cone of warm light falling from the candle onto the chapter.
// Wider and softer than a shaft of light, so the candle feels like the
// page's true light source rather than a spotlight.
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
        x="0" y="0" width="80" height="240"
        fill="url(#taper-grad)" className="taper-fill"
      />
    </svg>
  )
}

// ─── Candle flame ───────────────────────────────────────────────────────────
// The page's authored light source. Three nested teardrops (outer warm
// halo, inner gold body, hot white core) plus a thin wick and a brass
// dish. The flame breathes and sways; a ref-based pointer proximity
// variable brightens the halo when the reader approaches the question.
function CandleFlame({
  wrapRef,
  lit,
  flaring,
}: {
  wrapRef: RefObject<HTMLSpanElement | null>
  lit: boolean
  flaring: boolean
}) {
  return (
    <span
      ref={wrapRef}
      className={`candle-flame${flaring ? ' is-flaring' : ''} ${lit ? 'is-lit' : 'is-ember'}`}
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
        <circle cx="28" cy="42" r="28" fill="url(#flame-halo-grad)" className="flame-halo" />
        <path
          d="M 28 6 Q 20 22 20 40 Q 20 56 28 60 Q 36 56 36 40 Q 36 22 28 6 Z"
          fill="url(#flame-outer-grad)" className="flame-outer"
        />
        <path
          d="M 28 14 Q 23 26 23 40 Q 23 48 28 52 Q 33 48 33 40 Q 33 26 28 14 Z"
          fill="url(#flame-inner-grad)" className="flame-inner"
        />
        <ellipse cx="28" cy="44" rx="3.2" ry="7.6"
          fill="url(#flame-base-grad)" className="flame-base" />
        <ellipse cx="28" cy="44" rx="2.2" ry="6"
          fill="#fff5d4" className="flame-core" />
        <line x1="28" y1="50" x2="28" y2="68"
          stroke="#4a2e1a" strokeWidth="0.9" strokeLinecap="round"
          className="flame-wick" />
        <circle cx="28" cy="56" r="1.4" className="flame-ember" />
        <g className="candle-dish">
          <ellipse cx="28" cy="84" rx="22" ry="2.6" className="candle-dish-shadow" />
          <path
            d="M 10 76 Q 10 84 28 84 Q 46 84 46 76 L 44 73 L 12 73 Z"
            className="candle-dish-body" fill="url(#dish-grad)"
          />
          <ellipse cx="28" cy="73" rx="16" ry="2.4" className="candle-dish-rim" />
          <path d="M 14 78 Q 14 82 28 82 Q 42 82 42 78" className="candle-dish-groove" />
          <ellipse cx="22" cy="79" rx="2.6" ry="0.6" className="candle-dish-shine" />
        </g>
      </svg>
    </span>
  )
}

// ─── Chapter heading (cap. xviii mark) ──────────────────────────────────────
// A small printer's chapter heading sits above the candle, in the upper
// margin: a thin rule, a small fleuron, the chapter roman, the chapter
// title in Latin. It anchors the page as a real chapter opener from a
// real manuscript — the candle is reading this folio in particular.
function ChapterHeading() {
  return (
    <p className="chapter-heading" aria-hidden="true">
      <span className="chapter-heading-rule chapter-heading-rule--left" />
      <span className="chapter-heading-mark">
        <svg viewBox="0 0 10 10" focusable="false" className="chapter-heading-fleuron">
          <path
            d="M 5 1 C 5 3 4 4 2 5 C 4 6 5 7 5 9 C 5 7 6 6 8 5 C 6 4 5 3 5 1 Z"
            fill="currentColor"
          />
        </svg>
        <span className="chapter-heading-caput">cap. xviii</span>
        <svg viewBox="0 0 10 10" focusable="false" className="chapter-heading-fleuron">
          <path
            d="M 5 1 C 5 3 4 4 2 5 C 4 6 5 7 5 9 C 5 7 6 6 8 5 C 6 4 5 3 5 1 Z"
            fill="currentColor"
          />
        </svg>
      </span>
      <span className="chapter-heading-title">de scriptore et lumine</span>
      <span className="chapter-heading-rule chapter-heading-rule--right" />
    </p>
  )
}

// ─── Page glow (behind the question) ───────────────────────────────────────
// A single soft warm halo that breathes behind the hero and the question
// when the reader is hovering the chapter. The page acknowledges the
// reader's attention by glowing — a continuous gesture that ties the
// hero above to the question text below into one lit body. Hidden in
// steady state; brightens with cursor proximity; briefly flares on
// acknowledge, then settles into the steady reading state.
function PageGlow({ lit, flaring }: { lit: boolean; flaring: boolean }) {
  return (
    <span
      className={`page-glow${lit ? ' is-lit' : ''} ${flaring ? 'is-flaring' : ''}`}
      aria-hidden="true"
    />
  )
}

// ─── Bookmark ribbon ────────────────────────────────────────────────────────
// A slim vermilion ribbon hangs from the page's upper-right corner,
// tucked behind the chapter heading. Pinned through the folio number,
// so the folio marks itself. The page's only ornament outside the
// reading order — quietly earns its place.
function BookmarkRibbon() {
  return (
    <span className="bookmark-ribbon" aria-hidden="true">
      <svg viewBox="0 0 28 240" preserveAspectRatio="none" focusable="false">
        <defs>
          <linearGradient id="ribbon-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="#7d3a26" />
            <stop offset="50%"  stopColor="#c6684a" />
            <stop offset="100%" stopColor="#7d3a26" />
          </linearGradient>
          <linearGradient id="ribbon-shade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="rgba(0,0,0,0)" />
            <stop offset="40%"  stopColor="rgba(0,0,0,0.18)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.34)" />
          </linearGradient>
        </defs>
        <path
          d="M 0 0 L 28 0 L 28 218 L 14 234 L 0 218 Z"
          fill="url(#ribbon-grad)"
        />
        <path
          d="M 0 0 L 28 0 L 28 218 L 14 234 L 0 218 Z"
          fill="url(#ribbon-shade)"
        />
        <line x1="14" y1="6" x2="14" y2="222"
          stroke="rgba(0,0,0,0.22)" strokeWidth="0.5" />
        <text
          x="14" y="118"
          textAnchor="middle"
          transform="rotate(-90 14 118)"
          className="ribbon-numeral"
        >
          xviii
        </text>
      </svg>
    </span>
  )
}

// ─── Inkpot and quill (chapter's closing mark) ─────────────────────────────
// A small composed still life at the chapter's foot: a glass inkpot
// with vermilion ink inside, a quill laid across the rim, a single
// ink-drop hanging from the nib. Reads as the writer's instrument
// beside the chapter it just composed.
function InkpotAndQuill({
  active,
  acknowledged,
}: {
  active: boolean
  acknowledged: boolean
}) {
  return (
    <span
      className={`inkpot-and-quill${active ? ' is-active' : ''}${acknowledged ? ' is-acknowledged' : ''}`}
      aria-hidden="true"
    >
      <svg viewBox="0 0 120 42" focusable="false">
        <defs>
          <linearGradient id="inkpot-ink-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#c6684a" />
            <stop offset="55%" stopColor="#9c4530" />
            <stop offset="100%" stopColor="#7d3a26" />
          </linearGradient>
          <linearGradient id="inkpot-glass-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(240, 212, 154, 0.18)" />
            <stop offset="60%" stopColor="rgba(184, 169, 143, 0.06)" />
            <stop offset="100%" stopColor="rgba(150, 116, 76, 0.04)" />
          </linearGradient>
        </defs>
        <line x1="8" y1="37" x2="112" y2="37" className="inkpot-rest-line" />
        <g className="inkpot-pot">
          <ellipse cx="60" cy="35" rx="20" ry="1.4" className="inkpot-shadow" />
          <path
            d="M 42 14 Q 39 22 42 32 L 78 32 Q 81 22 78 14 Z"
            className="inkpot-glass" fill="url(#inkpot-glass-grad)"
          />
          <ellipse
            cx="60" cy="22" rx="15" ry="5.2"
            className="inkpot-ink-fill" fill="url(#inkpot-ink-grad)"
          />
          <ellipse cx="60" cy="14" rx="18" ry="2.4" className="inkpot-rim" />
          <ellipse cx="60" cy="14" rx="13" ry="1.5" className="inkpot-opening" />
        </g>
        <g className="inkpot-quill">
          <line x1="22" y1="22" x2="84" y2="11" className="inkpot-quill-shaft" />
          <path d="M 82 11 L 102 4 L 105 8 L 86 12.5 Z" className="inkpot-quill-feather" />
          <path d="M 20 21.6 L 25 22.4 L 22 23.6 Z" className="inkpot-quill-nib" />
        </g>
        <circle cx="19" cy="24.5" r="1.05" className="inkpot-drop" />
      </svg>
    </span>
  )
}

// ─── Scholastic footnote ───────────────────────────────────────────────────
const ANSWER = '— and the page itself, which you are reading now.'
const REPLY = 'so read it once, then again — slower this time.'
const FOOTNOTE_TEXT = 'relege · without a reader, silence'
const FOOTNOTE_ARIA =
  'relege, without a reader, silence — read again, without a reader, silence'
const FOOTNOTE_STAGGER_MS = 38

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
      <span className="footnote-row">
        <em className="footnote-latin">{latin}</em>
        {dotIdx >= 0 && (
          <span className="footnote-sep" aria-hidden="true">·</span>
        )}
        {english !== '' && (
          <span className="footnote-en">{english}</span>
        )}
        {typing && <span className="footnote-caret" aria-hidden="true">|</span>}
      </span>
    </p>
  )
}

// ─── Intellexi (the reader's quiet sign-off) ───────────────────────────────
const INTELLEXI_STAGGER_MS = 78

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
      <em className="intellexi-nota-text">{text}</em>
      {typing && <span className="intellexi-nota-caret" aria-hidden="true">|</span>}
    </p>
  )
}

// ─── Reading pace ──────────────────────────────────────────────────────────
// The chapter's only interactive control. Press once to read the
// answer at the page's pace; press again to slow the cadence (because
// the chapter's reply asks the reader to read again, slower); press
// once more to return to the page's pace. A real control with a real,
// single behaviour.
function ReadingPace({
  hasRead,
  slow,
  onRead,
}: {
  hasRead: boolean
  slow: boolean
  onRead: () => void
}) {
  const latin = hasRead ? 'relege' : 'lege'
  const gloss = slow
    ? 'again, at reading pace'
    : hasRead
      ? 'again, slower'
      : 'read the answer'
  const label = slow
    ? 'read the answer again at reading pace'
    : hasRead
      ? 'read the answer again, more slowly'
      : 'read the answer'
  return (
    <div className="reading-pace">
      <button
        type="button"
        className={`reading-pace-btn${slow ? ' is-slow' : ''}`}
        onClick={onRead}
        aria-label={label}
      >
        <span className="reading-pace-pip" aria-hidden="true" />
        <em className="reading-pace-latin">{latin}</em>
        <span className="reading-pace-sep" aria-hidden="true">·</span>
        <span className="reading-pace-gloss">{gloss}</span>
        <span className="reading-pace-rule" aria-hidden="true" />
      </button>
    </div>
  )
}

// ─── Explicit (chapter closure) ────────────────────────────────────────────
function Explicit() {
  return (
    <p className="explicit" aria-hidden="true">
      <span className="explicit-rule" />
      <em className="explicit-text">explicit · fol. xviii</em>
      <span className="explicit-rule" />
    </p>
  )
}

// ─── App ───────────────────────────────────────────────────────────────────

const ANSWER_STAGGER_MS = 34
const REPLY_STAGGER_MS = 26

export function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const reduced = useReducedMotion()
  const [ready, setReady] = useState(false)
  const [drawn, setDrawn] = useState(false)
  const [pulsing, setPulsing] = useState(false)
  const [candleLit, setCandleLit] = useState(false)
  const [active, setActive] = useState(false)
  const [answerOn, setAnswerOn] = useState(false)
  const [answerChars, setAnswerChars] = useState(0)
  const [replyOn, setReplyOn] = useState(false)
  const [replyChars, setReplyChars] = useState(0)
  const [footnoteOn, setFootnoteOn] = useState(false)
  const [footnoteChars, setFootnoteChars] = useState(0)
  const [intellexiOn, setIntellexiOn] = useState(false)
  const [intellexiChars, setIntellexiChars] = useState(0)
  const [quietus, setQuietus] = useState(false)
  const [slowRead, setSlowRead] = useState(false)
  const paceRef = useRef(1)
  const pulseRef = useRef(0)
  const partsRef = useRef<Particle[]>([])
  const dimsRef = useRef({ w: 0, h: 0 })
  const pointerRef = useRef({ x: 0, y: 0, over: false, active: false })
  const heroBoxRef = useRef<DOMRect | null>(null)
  const heroRef = useRef<HTMLButtonElement>(null)
  const flameWrapRef = useRef<HTMLSpanElement>(null)
  const flameWarmthRef = useRef(0)

  // First paint and first-light ignition.
  useEffect(() => {
    const t = setTimeout(() => setReady(true), 60)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    const t = setTimeout(() => setDrawn(true), reduced ? 0 : 160)
    return () => clearTimeout(t)
  }, [reduced])

  // The candle begins as an ember and ignites into its full flame a
  // couple of seconds after the page has settled, so the reader's
  // arrival lights the page.
  useEffect(() => {
    const t = window.setTimeout(() => setCandleLit(true), reduced ? 80 : 2400)
    return () => window.clearTimeout(t)
  }, [reduced])

  // Typing cadence — answer → reply → footnote → intellexi.
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
      Math.round(ANSWER_STAGGER_MS * paceRef.current),
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
      reduced ? 80 : Math.round(520 * paceRef.current),
    )
    return () => window.clearTimeout(t)
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
      Math.round(REPLY_STAGGER_MS * paceRef.current),
    )
    return () => clearTimeout(id)
  }, [replyOn, replyChars, reduced])

  useEffect(() => {
    if (!replyOn || replyChars < REPLY.length) return
    const t = window.setTimeout(
      () => setFootnoteOn(true),
      reduced ? 60 : Math.round(760 * paceRef.current),
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
      Math.round(FOOTNOTE_STAGGER_MS * paceRef.current),
    )
    return () => clearTimeout(id)
  }, [footnoteOn, footnoteChars, reduced])

  useEffect(() => {
    if (!footnoteOn || footnoteChars < FOOTNOTE_TEXT.length) return
    const t = window.setTimeout(
      () => {
        setIntellexiOn(true)
        setQuietus(true)
      },
      reduced ? 80 : Math.round(720 * paceRef.current),
    )
    return () => window.clearTimeout(t)
  }, [footnoteOn, footnoteChars, reduced])

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
      Math.round(INTELLEXI_STAGGER_MS * paceRef.current),
    )
    return () => clearTimeout(id)
  }, [intellexiOn, intellexiChars, reduced])

  useEffect(() => {
    if (!pulsing) return
    const t = setTimeout(() => setPulsing(false), 720)
    return () => clearTimeout(t)
  }, [pulsing])

  useEffect(() => {
    if (!quietus) return
    const t = window.setTimeout(
      () => setQuietus(false),
      reduced ? 1100 : 1900,
    )
    return () => window.clearTimeout(t)
  }, [quietus, reduced])

  const acknowledge = useCallback((pace: number = 1) => {
    paceRef.current = pace
    setSlowRead(pace > 1)
    pulseRef.current = reduced ? 0 : 1
    setPulsing(true)
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
      () => setAnswerOn(false),
      reduced ? 2600 : Math.round(5200 * paceRef.current),
    )
    return () => window.clearTimeout(ansOff)
  }, [reduced])

  // Hero pointer handling — track proximity for flame warmth and
  // question glow.
  const onHeroEnter = useCallback((e: ReactPointerEvent) => {
    setActive(true)
    pointerRef.current.over = true
    heroBoxRef.current = (e.currentTarget as HTMLElement).getBoundingClientRect()
  }, [])
  const onHeroLeave = useCallback(() => {
    setActive(false)
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

  // Dust canvas — the embers rising from the candle.
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

      // Drive the candle flame's warmth from pointer proximity to the
      // hero — when the reader draws near the question, the flame
      // leans toward them, halo brightening.
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

  return (
    <main className={`stage ${active ? 'is-attending' : ''}`}>
      <canvas ref={canvasRef} className="dust" aria-hidden="true" />
      <div className="rim" aria-hidden="true" />
      <PaperGrain />
      <ReadingLantern />

      <div className={`frame ${ready ? 'ready' : ''}`}>
        <ChapterHeading />
        <BookmarkRibbon />

        <div className="candle-station">
          <Taper />
          <CandleFlame
            wrapRef={flameWrapRef}
            lit={candleLit}
            flaring={pulsing}
          />
        </div>

        <div className={`composition ${ready ? 'ready' : ''} ${quietus ? 'is-quietus' : ''}`}>
          <PageGlow lit={active} flaring={pulsing} />

          <button
            type="button"
            ref={heroRef}
            className={`hero ${drawn ? 'drawn' : ''} ${pulsing ? 'pulse' : ''} ${quietus ? 'is-quietus' : ''}`}
            onClick={() => acknowledge(paceRef.current)}
            onPointerEnter={(e) => {
              onHeroEnter(e)
            }}
            onPointerLeave={() => {
              onHeroLeave()
            }}
            onPointerMove={onHeroMove}
            onFocus={() => setActive(true)}
            onBlur={() => setActive(false)}
            aria-label="read the answer to the question"
          >
            <span className="hero-svg-wrap">
              <svg viewBox="0 0 240 340" className="hero-svg" aria-hidden="true">
                <defs>
                  <radialGradient id="auriole-radial" cx="50%" cy="50%" r="50%">
                    <stop offset="0%"   stopColor="currentColor" stopOpacity="0.28" />
                    <stop offset="55%"  stopColor="currentColor" stopOpacity="0.08" />
                    <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
                  </radialGradient>
                  <radialGradient id="bowl-bloom" cx="50%" cy="46%" r="55%">
                    <stop offset="0%"   stopColor="currentColor" stopOpacity="0.42" />
                    <stop offset="58%"  stopColor="currentColor" stopOpacity="0.16" />
                    <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
                  </radialGradient>
                  <linearGradient id="hero-stroke-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor="#f0d49a" />
                    <stop offset="38%"  stopColor="currentColor" />
                    <stop offset="100%" stopColor="#a88556" />
                  </linearGradient>
                </defs>
                <g className="auriole">
                  <circle cx={120} cy={170} r={120}
                    fill="url(#auriole-radial)" className="auriole-radial" />
                </g>
                <g className="hero-stack">
                  <path className="hero-shadow" d={HERO_PATH} pathLength={100} />
                  <path className="hero-scribal-trail" d={HERO_PATH} pathLength={100} />
                  <path className="hero-stroke" d={HERO_PATH} pathLength={100}
                    stroke="url(#hero-stroke-grad)" />
                  <path className="hero-highlight" d={HERO_HIGHLIGHT_PATH} pathLength={100} />
                  <path className="hero-trace" d={HERO_PATH} pathLength={100} />
                  <ellipse
                    className="hero-ink-pool"
                    cx={HERO_DOT.cx}
                    cy={HERO_DOT.cy + 14}
                    rx={HERO_DOT.r + 9}
                    ry={2.4}
                  />
                  <circle
                    className="hero-ink-pool-pip"
                    cx={HERO_DOT.cx + 1}
                    cy={HERO_DOT.cy + 14}
                    r={1.1}
                  />
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
          </button>

          <div className="question-block">
            <h1 className="question">
              <span className="question-line">
                <em className="question-word question-lead-i" style={{ '--wi': 0 } as CSSProperties}>is</em>
                <span className="question-space" style={{ '--wi': 1 } as CSSProperties}> </span>
                <em className="question-word question-name" style={{ '--wi': 2 } as CSSProperties}>Minimax&nbsp;M3</em>
                <span className="question-space" style={{ '--wi': 3 } as CSSProperties}> </span>
                <em className="question-word question-verb" style={{ '--wi': 4 } as CSSProperties}>good at frontend</em>
                <span className="question-space" style={{ '--wi': 5 } as CSSProperties}> </span>
                <em className="question-word question-yet" style={{ '--wi': 6 } as CSSProperties}>yet</em>
                <span className="question-mark-wrap">
                  <span className="question-mark" style={{ '--wi': 7 } as CSSProperties}>?</span>
                </span>
              </span>
            </h1>
          </div>

          <ReadingPace
            hasRead={answerOn || intellexiChars > 0}
            slow={slowRead}
            onRead={() => acknowledge(slowRead ? 1 : 1.75)}
          />

          <div className="chapter-body">
            <p
              className={`answer ${answerOn ? 'is-on' : ''}`}
              aria-live="polite"
            >
              <span className="answer-rule" aria-hidden="true" />
              <span className="answer-text">{answerDisplay}</span>
              {answerOn && answerChars < ANSWER.length && (
                <span className="answer-caret" aria-hidden="true">|</span>
              )}
            </p>

            <p
              className={`reply ${replyOn ? 'is-on' : ''}`}
              aria-live="polite"
            >
              <span className="reply-text">{replyDisplay}</span>
              {replyOn && replyChars < REPLY.length && (
                <span className="reply-caret" aria-hidden="true">|</span>
              )}
            </p>

            <ScholasticFootnote
              visible={footnoteOn}
              text={footnoteDisplay}
              done={footnoteDone}
            />

            {footnoteDone && (
              <IntellexiNota
                visible={intellexiOn}
                text={intellexiOn ? 'intellexi'.slice(0, Math.max(0, intellexiChars)) : ''}
                done={intellexiOn && intellexiChars >= 'intellexi'.length}
              />
            )}

            {footnoteDone && <Explicit />}
          </div>

          <div className="colophon" aria-hidden="true">
            <span className="colophon-rule" />
            <span className="colophon-pair">
              <em className="colophon-quaeritur">quaeritur</em>
              <span className="colophon-pair-arrow" aria-hidden="true">›</span>
              <em className="colophon-respondetur">respondetur</em>
            </span>
            <InkpotAndQuill
              active={footnoteDone && intellexiOn && intellexiChars >= 'intellexi'.length}
              acknowledged={pulsing}
            />
            <span className="colophon-provenance">legi · mmxxvi</span>
            <span className="colophon-rule" />
          </div>
        </div>
      </div>
    </main>
  )
}