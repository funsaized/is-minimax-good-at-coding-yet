import {
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type MutableRefObject,
} from 'react'
import type { VoiceId } from './App'
import type { WordId } from './notes'
import { ChaseFrame } from './ChaseFrame'

type HeroProps = {
  voice: VoiceId
  word: WordId
  hover: WordId | null
  setToday: string
  pullSignal: number
  onVoice: (voice: VoiceId) => void
  onWord: (word: WordId, focus?: boolean) => void
  onHover: (word: WordId | null) => void
  onWordKey: (event: ReactKeyboardEvent<HTMLButtonElement>, id: WordId) => void
  tokenRefs: MutableRefObject<Partial<Record<WordId, HTMLButtonElement | null>>>
}

type VoiceSpec = {
  letter: string
  name: string
  face: string
  sample: string
  gloss: string
  note: string
  family: string
  weight: number
  style: 'italic' | 'normal'
  tracking: string
  uppercased: boolean
}

const VOICE: Record<VoiceId, VoiceSpec> = {
  quiet: {
    letter: 'A',
    name: 'quiet cut',
    face: 'serif · italic · close set',
    sample: 'is m³ good at frontend yet?',
    gloss: 'the default voice',
    note: 'set the line softly, that the reader may hear themselves in it.',
    family: "'Iowan Old Style', 'Palatino Linotype', Georgia, serif",
    weight: 400,
    style: 'italic',
    tracking: '-.018em',
    uppercased: false,
  },
  human: {
    letter: 'B',
    name: 'human hand',
    face: 'serif · italic · warm',
    sample: 'is M3 good at frontend yet?',
    gloss: 'the middle voice',
    note: 'set the line by hand, that the page may feel less like a page.',
    family: "'Iowan Old Style', 'Palatino Linotype', Georgia, serif",
    weight: 500,
    style: 'italic',
    tracking: '-.014em',
    uppercased: false,
  },
  bold: {
    letter: 'C',
    name: 'bold signal',
    face: 'sans · heavy · no apology',
    sample: 'IS M3 GOOD AT FRONTEND YET?',
    gloss: 'the loud voice',
    note: 'set the line at full height, that the question may be heard once and clearly.',
    family: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
    weight: 800,
    style: 'normal',
    tracking: '-.04em',
    uppercased: true,
  },
}

type TokenCopy = {
  label: string
  glyph: string
  tone: string
  mark: string
}

const TOKEN_COPY: Record<WordId, TokenCopy> = {
  m3: { label: 'm³', glyph: '⌇', tone: 'the maker', mark: 'stet' },
  good: { label: 'good at', glyph: '∧', tone: 'the verb', mark: 'caret' },
  yet: { label: 'yet?', glyph: '?', tone: 'the pause', mark: 'query' },
}

const ORDER: VoiceId[] = ['quiet', 'human', 'bold']

const TITLE_SEGMENTS: Array<{ id: WordId | 'plain' | 'space'; text: string; mark?: boolean }> = [
  { id: 'm3', text: 'm³', mark: true },
  { id: 'space', text: ' ' },
  { id: 'good', text: 'good at', mark: true },
  { id: 'space', text: ' ' },
  { id: 'plain', text: 'frontend' },
]

const SET_DURATION_MS = 1500
const STEP_MS = 70
const SET_BASE_DELAY_MS = 700

const PROOF_NUMBER = String(Math.floor(Math.random() * 800) + 1200).padStart(4, '0')

export function Hero({
  voice,
  word,
  hover,
  setToday,
  pullSignal,
  onVoice,
  onWord,
  onHover,
  onWordKey,
  tokenRefs,
}: HeroProps) {
  const baseId = useId().replace(/:/g, '')
  const grainId = `hero-grain-${baseId}`
  const spec = VOICE[voice]
  const toneStyle = { '--hero-tone': `var(--${voice})` } as CSSProperties

  const [setProgress, setSetProgress] = useState(() => segmentOffsets(0))
  const [reduceMotion, setReduceMotion] = useState(false)
  const [hour, setHour] = useState(() => formatHeroHour())
  const cleanupRef = useRef<(() => void) | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduceMotion(mq.matches)
    const onChange = () => setReduceMotion(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    if (reduceMotion) {
      setSetProgress(segmentOffsets(TITLE_SEGMENTS.length))
      return
    }
    let i = 0
    const total = TITLE_SEGMENTS.length
    setSetProgress(segmentOffsets(0))
    const startId = window.setTimeout(() => {
      const id = window.setInterval(() => {
        i += 1
        setSetProgress(segmentOffsets(Math.min(i, total)))
        if (i >= total) {
          window.clearInterval(id)
        }
      }, STEP_MS)
      cleanupRef.current = () => window.clearInterval(id)
    }, SET_BASE_DELAY_MS)
    const totalId = window.setTimeout(() => {
      if (cleanupRef.current) cleanupRef.current()
    }, SET_DURATION_MS + SET_BASE_DELAY_MS + 200)
    return () => {
      window.clearTimeout(startId)
      window.clearTimeout(totalId)
      if (cleanupRef.current) cleanupRef.current()
    }
  }, [reduceMotion])

  return (
    <div className="hero__inner" style={toneStyle}>
      <ChaseFrame tone={`var(--hero-tone, var(--quiet))`} className="hero__chase" intensity="full">
        <svg className="hero__defs" viewBox="0 0 1200 800" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <filter id={grainId} x="-2%" y="-2%" width="104%" height="104%">
              <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="23" stitchTiles="stitch" />
              <feColorMatrix type="matrix" values="0 0 0 0 .14  0 0 0 0 .12  0 0 0 0 .19  0 0 0 .04 0" />
              <feComposite in2="SourceGraphic" operator="in" />
            </filter>
          </defs>
        </svg>

        <span className="hero__stage-grain" aria-hidden="true">
          <svg viewBox="0 0 1200 800" preserveAspectRatio="none">
            <rect x="0" y="0" width="1200" height="800" filter={`url(#${grainId})`} opacity=".04" />
          </svg>
        </span>

        <DawnCrescent key={`dawn-${pullSignal}`} />

        <span className="hero__trim hero__trim--tl" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path d="M0 6 L24 6 M6 0 L6 24" fill="none" stroke="currentColor" strokeWidth=".7" strokeLinecap="round" />
            <circle cx="6" cy="6" r="1.4" fill="none" stroke="currentColor" strokeWidth=".4" />
          </svg>
        </span>
        <span className="hero__trim hero__trim--tr" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path d="M0 6 L24 6 M18 0 L18 24" fill="none" stroke="currentColor" strokeWidth=".7" strokeLinecap="round" />
            <circle cx="18" cy="6" r="1.4" fill="none" stroke="currentColor" strokeWidth=".4" />
          </svg>
        </span>
        <span className="hero__trim hero__trim--bl" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path d="M0 18 L24 18 M6 0 L6 24" fill="none" stroke="currentColor" strokeWidth=".7" strokeLinecap="round" />
            <circle cx="6" cy="18" r="1.4" fill="none" stroke="currentColor" strokeWidth=".4" />
          </svg>
        </span>
        <span className="hero__trim hero__trim--br" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path d="M0 18 L24 18 M18 0 L18 24" fill="none" stroke="currentColor" strokeWidth=".7" strokeLinecap="round" />
            <circle cx="18" cy="18" r="1.4" fill="none" stroke="currentColor" strokeWidth=".4" />
          </svg>
        </span>

        <header className="hero__slip" aria-hidden="true">
          <span className="hero__slip-side hero__slip-side--l">
            <span className="hero__slip-key">proof</span>
            <span className="hero__slip-num">{PROOF_NUMBER}</span>
            <span className="hero__slip-rule" />
            <span className="hero__slip-key">plate</span>
            <span className="hero__slip-num">i</span>
          </span>
          <span className="hero__slip-mid">
            <span className="hero__slip-bead hero__slip-bead--l" />
            <span className="hero__slip-bead hero__slip-bead--c" />
            <span className="hero__slip-bead hero__slip-bead--r" />
          </span>
          <span className="hero__slip-side hero__slip-side--r">
            <span className="hero__slip-key">at</span>
            <span className="hero__slip-num">{hour}</span>
            <span className="hero__slip-rule" />
            <span className="hero__slip-key">voice</span>
            <span className="hero__slip-num">{spec.letter}</span>
          </span>
        </header>

        <div className="hero__eyebrow-row">
          <span className="hero__eyebrow">
            <span className="hero__eyebrow-glyph" aria-hidden="true">¶</span>
            <span>folio i</span>
            <span className="hero__eyebrow-sep" aria-hidden="true">·</span>
            <span className="hero__eyebrow-em">the question, set at first light</span>
          </span>
          <span className="hero__set">
            <em>set on</em>
            <em className="hero__eyebrow-em">{setToday}</em>
          </span>
        </div>

        <h1
          id="hero-title-label"
          className={`hero__title hero__title--${voice}`}
          aria-label="is Minimax M3 good at frontend yet?"
        >
          <span className="hero__title-line hero__title-line-a">
            <span className="hero__title-baseline" aria-hidden="true" />
            {renderTitleSegments({
              lineId: 'a',
              progress: setProgress,
              word,
              hover,
              onWord,
              onHover,
              onWordKey,
              tokenRefs,
            })}
          </span>
          <span className="hero__title-lead" aria-hidden="true">
            <em>·</em>
            <em>·</em>
            <em>·</em>
          </span>
          <span className="hero__title-line hero__title-line-b">
            <span className="hero__title-baseline" aria-hidden="true" />
            <span
              className={`ht__word ht__word--yet ${word === 'yet' ? 'is-marked' : ''} ${hover === 'yet' ? 'is-hover' : ''}`}
              aria-hidden="true"
            >
              <button
                type="button"
                ref={node => {
                  tokenRefs.current.yet = node
                }}
                className="ht__token ht__token--yet"
                onClick={() => onWord('yet')}
                onMouseEnter={() => onHover('yet')}
                onMouseLeave={() => onHover(null)}
                onFocus={() => onHover('yet')}
                onBlur={() => onHover(null)}
                onKeyDown={event => onWordKey(event, 'yet')}
                aria-pressed={word === 'yet'}
                aria-label={`${TOKEN_COPY.yet.label} — ${TOKEN_COPY.yet.tone} (mark: ${TOKEN_COPY.yet.mark})`}
              >
                <span className="ht__kern ht__kern--before" aria-hidden="true">
                  <svg viewBox="0 0 8 12" preserveAspectRatio="none">
                    <path d="M1 0 L8 6 L1 12" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <span className="ht__token-yet">yet</span>
                <span className={`ht__punct ht__punct--${voice}`} aria-hidden="true">
                  <span className="ht__punct-kern ht__punct-kern--before" aria-hidden="true">
                    <svg viewBox="0 0 6 10" preserveAspectRatio="none">
                      <path d="M1 0 L6 5 L1 10" fill="none" stroke="currentColor" strokeWidth=".9" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <span className="ht__punct-mark">?</span>
                  <span className="ht__punct-kern ht__punct-kern--after" aria-hidden="true">
                    <svg viewBox="0 0 6 10" preserveAspectRatio="none">
                      <path d="M5 0 L0 5 L5 10" fill="none" stroke="currentColor" strokeWidth=".9" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <span className="ht__punct-ghost ht__punct-ghost--a" aria-hidden="true">?</span>
                  <span className="ht__punct-ghost ht__punct-ghost--b" aria-hidden="true">?</span>
                </span>
                <span className="ht__kern ht__kern--after" aria-hidden="true">
                  <svg viewBox="0 0 8 12" preserveAspectRatio="none">
                    <path d="M7 0 L0 6 L7 12" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </button>
            </span>
          </span>
        </h1>

        <span className="hero__sub" aria-hidden="true">
          <span className="hero__sub-mark" aria-hidden="true">⌇</span>
          <em>set in {spec.name.toLowerCase()}</em>
          <span className="hero__sub-rule" />
          <em>{spec.gloss}</em>
          <span className="hero__sub-mark" aria-hidden="true">⌇</span>
          <span className="hero__sub-tail" aria-hidden="true">a question, set three ways · one line · one chase</span>
        </span>

        <span className="hero__fold" aria-hidden="true">
          <svg viewBox="0 0 4 600" preserveAspectRatio="none">
            <path
              d="M2 0c-1.5 80 1.5 160 0 240s1.5 240 0 320"
              fill="none"
              stroke="currentColor"
              strokeWidth=".6"
              strokeLinecap="round"
              opacity=".55"
              strokeDasharray="1.2 3.6"
            />
            <circle cx="2" cy="300" r="1.2" fill="currentColor" opacity=".7" />
          </svg>
        </span>

        <span className="hero__register" aria-hidden="true">
          <svg viewBox="0 0 28 28">
            <circle cx="14" cy="14" r="11" fill="none" stroke="currentColor" strokeWidth=".7" opacity=".6" />
            <line x1="14" y1="0" x2="14" y2="28" stroke="currentColor" strokeWidth=".5" opacity=".55" />
            <line x1="0" y1="14" x2="28" y2="14" stroke="currentColor" strokeWidth=".5" opacity=".55" />
            <circle cx="14" cy="14" r="1.4" fill="currentColor" />
          </svg>
          <em>register</em>
        </span>

        <figure className="hero__compositor" aria-label="A note from the compositor">
          <svg className="hero__compositor-mark" viewBox="0 0 64 18" aria-hidden="true">
            <line x1="0" y1="9" x2="20" y2="9" stroke="currentColor" strokeWidth=".5" strokeLinecap="round" opacity=".5" />
            <line x1="44" y1="9" x2="64" y2="9" stroke="currentColor" strokeWidth=".5" strokeLinecap="round" opacity=".5" />
            <path d="M22 9 Q26 2 30 9 Q26 16 22 9" fill="currentColor" opacity=".35" />
            <path d="M22 9 Q26 2 30 9" fill="none" stroke="currentColor" strokeWidth=".5" strokeLinecap="round" opacity=".65" />
            <path d="M34 9 Q38 2 42 9 Q38 16 34 9" fill="currentColor" opacity=".35" />
            <path d="M34 9 Q38 2 42 9" fill="none" stroke="currentColor" strokeWidth=".5" strokeLinecap="round" opacity=".65" />
            <circle cx="32" cy="9" r="2.6" fill="currentColor" />
            <circle cx="32" cy="9" r="1" fill="#080a12" />
            <circle cx="6" cy="9" r=".8" fill="currentColor" opacity=".7" />
            <circle cx="58" cy="9" r=".8" fill="currentColor" opacity=".7" />
          </svg>
          <figcaption>
            <em>a note from the compositor —</em>
            <span>{spec.note}</span>
          </figcaption>
        </figure>
      </ChaseFrame>

      <aside
        className="voice-column"
        role="radiogroup"
        aria-label="Voice specimen · the line set in three voices"
      >
        <header className="voice-column__head" aria-hidden="true">
          <span className="voice-column__eyebrow">specimen · the line, three ways</span>
          <span className="voice-column__hint">
            <em>click a line · set the page in that voice</em>
          </span>
        </header>

        <ol className="voice-column__list">
          {ORDER.map(v => {
            const row = VOICE[v]
            const isActive = voice === v
            const rowStyle = {
              fontFamily: row.family,
              fontWeight: row.weight,
              fontStyle: row.style,
              letterSpacing: row.tracking,
              textTransform: row.uppercased ? ('uppercase' as const) : ('none' as const),
              '--line-tone': `var(--${v})`,
            } as CSSProperties
            return (
              <li key={v} className={`voice-column__row ${isActive ? 'is-active' : ''}`}>
                <button
                  type="button"
                  role="radio"
                  aria-checked={isActive}
                  className={`voice-column__item voice-column__item--${v}`}
                  onClick={() => onVoice(v)}
                >
                  <span className="voice-column__num" aria-hidden="true">{row.letter}</span>
                  <span className="voice-column__sample" style={rowStyle} aria-hidden="true">
                    {row.sample}
                  </span>
                  <span className="voice-column__meta" aria-hidden="true">
                    <em>{row.name}</em>
                    <span className="voice-column__meta-sep" aria-hidden="true" />
                    <span>{row.face}</span>
                  </span>
                </button>
              </li>
            )
          })}
        </ol>

        <footer className="voice-column__foot" aria-hidden="true">
          <span className="voice-column__foot-rule" />
          <span className="voice-column__foot-bead" />
          <em>three voices · one line · one chase</em>
          <span className="voice-column__foot-bead" />
          <span className="voice-column__foot-rule" />
        </footer>

        <span className="voice-column__cycle" aria-hidden="true">
          <em>cycle</em>
          <kbd>shift</kbd>
          <span>+</span>
          <kbd>v</kbd>
        </span>
      </aside>
    </div>
  )
}

function formatHeroHour() {
  const now = new Date()
  let h = now.getHours()
  const m = now.getMinutes()
  const ampm = h >= 12 ? 'pm' : 'am'
  h = h % 12
  if (h === 0) h = 12
  return `${h}:${m.toString().padStart(2, '0')} ${ampm}`
}

function segmentOffsets(reached: number): number[] {
  return TITLE_SEGMENTS.map((_, idx) => (idx < reached ? 1 : 0))
}

type RenderArgs = {
  lineId: 'a' | 'b'
  progress: number[]
  word: WordId
  hover: WordId | null
  onWord: (word: WordId, focus?: boolean) => void
  onHover: (word: WordId | null) => void
  onWordKey: (event: ReactKeyboardEvent<HTMLButtonElement>, id: WordId) => void
  tokenRefs: MutableRefObject<Partial<Record<WordId, HTMLButtonElement | null>>>
}

function renderTitleSegments({
  lineId,
  progress,
  word,
  hover,
  onWord,
  onHover,
  onWordKey,
  tokenRefs,
}: RenderArgs) {
  const segs = TITLE_SEGMENTS
  return segs.map((seg, idx) => {
    const p = progress[segIndex(seg.id)] ?? 0
    const visible = p >= 1
    const setStyle = {
      '--set-idx': String(TITLE_SEGMENTS.indexOf(seg)),
      '--set-progress': String(p),
    } as CSSProperties
    if (seg.id === 'space') {
      return (
        <span
          key={`${lineId}-space-${idx}`}
          className="hero__title-space"
          aria-hidden="true"
          style={setStyle}
          data-set={visible ? 'in' : 'pending'}
        >
          {' '}
        </span>
      )
    }
    if (seg.id === 'plain') {
      return (
        <span
          key={`${lineId}-plain-${idx}`}
          className="ht__word ht__word--plain"
          aria-hidden="true"
          style={setStyle}
          data-set={visible ? 'in' : 'pending'}
        >
          {seg.text}
        </span>
      )
    }
    const id = seg.id as WordId
    const copy = TOKEN_COPY[id]
    const isMarked = word === id
    const isHover = hover === id
    return (
      <span
        key={`${lineId}-${id}`}
        className={`ht__word ht__word--${id} ${isMarked ? 'is-marked' : ''} ${isHover ? 'is-hover' : ''}`}
        aria-hidden="true"
        style={setStyle}
        data-set={visible ? 'in' : 'pending'}
      >
        {isMarked && <span className="ht__glyph">{copy.glyph}</span>}
        <button
          type="button"
          ref={node => {
            tokenRefs.current[id] = node
          }}
          className="ht__token"
          onClick={() => onWord(id)}
          onMouseEnter={() => onHover(id)}
          onMouseLeave={() => onHover(null)}
          onFocus={() => onHover(id)}
          onBlur={() => onHover(null)}
          onKeyDown={event => onWordKey(event, id)}
          aria-pressed={word === id}
          aria-label={`${copy.label} — ${copy.tone} (mark: ${copy.mark})`}
        >
          {copy.label}
        </button>
      </span>
    )
  })
}

function segIndex(id: WordId | 'plain' | 'space' | 'punct'): number {
  return TITLE_SEGMENTS.findIndex(s => s.id === id)
}

function DawnCrescent() {
  const id = useId().replace(/:/g, '')
  const orbId = `dawn-orb-${id}`
  const washId = `dawn-wash-${id}`
  const beamId = `dawn-beam-${id}`
  const moonId = `dawn-moon-${id}`
  const rimId = `dawn-rim-${id}`

  return (
    <span className="hero__dawn" aria-hidden="true">
      <svg viewBox="0 0 600 320" preserveAspectRatio="xMidYMid meet">
        <defs>
          <radialGradient id={orbId} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(255, 232, 198, .42)" />
            <stop offset="40%" stopColor="rgba(244, 188, 150, .18)" />
            <stop offset="78%" stopColor="rgba(168, 197, 255, .08)" />
            <stop offset="100%" stopColor="rgba(168, 197, 255, 0)" />
          </radialGradient>

          <radialGradient id={washId} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(255, 234, 200, .14)" />
            <stop offset="100%" stopColor="rgba(255, 234, 200, 0)" />
          </radialGradient>

          <linearGradient id={beamId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(255, 226, 184, 0)" />
            <stop offset="60%" stopColor="rgba(255, 226, 184, .07)" />
            <stop offset="100%" stopColor="rgba(255, 226, 184, .14)" />
          </linearGradient>

          <radialGradient id={moonId} cx="40%" cy="38%" r="64%">
            <stop offset="0%" stopColor="rgba(255, 240, 214, .92)" />
            <stop offset="58%" stopColor="rgba(244, 218, 178, .78)" />
            <stop offset="100%" stopColor="rgba(196, 168, 130, .55)" />
          </radialGradient>

          <radialGradient id={rimId} cx="50%" cy="50%" r="50%">
            <stop offset="60%" stopColor="rgba(255, 226, 184, 0)" />
            <stop offset="80%" stopColor="rgba(255, 226, 184, .35)" />
            <stop offset="100%" stopColor="rgba(255, 226, 184, 0)" />
          </radialGradient>
        </defs>

        {/* the wash — a faint band of light behind the title */}
        <rect x="0" y="120" width="600" height="200" fill={`url(#${beamId})`} className="hero__dawn-beam" />

        {/* the orb — the moon's soft glow */}
        <circle className="hero__dawn-orb" cx="300" cy="160" r="92" fill={`url(#${orbId})`} />

        {/* the rim — a soft ring that catches the air around the moon */}
        <circle className="hero__dawn-halo" cx="300" cy="160" r="78" fill={`url(#${rimId})`} />

        {/* the moon — a waxing crescent made by subtracting a dark circle from the lit disc */}
        <g className="hero__dawn-moon">
          {/* the lit disc */}
          <circle cx="300" cy="160" r="62" fill={`url(#${moonId})`} />
          {/* the bite — same colour as the night sky, offset to the upper-right */}
          <circle cx="320" cy="152" r="58" fill="#080a12" />
          {/* a thin lit sliver where the two circles overlap */}
          <path
            d="M300 98 A62 62 0 0 1 320 98 A58 58 0 0 0 300 98 Z"
            fill={`url(#${moonId})`}
            opacity=".55"
          />
        </g>

        {/* a faint horizon — a single line that suggests 'just above the press bed' */}
        <line
          className="hero__dawn-horizon"
          x1="60"
          y1="244"
          x2="540"
          y2="244"
          stroke="rgba(255, 226, 184, .14)"
          strokeWidth=".4"
          strokeLinecap="round"
          strokeDasharray="1.5 4"
        />

        {/* a few quiet ticks — typesetter's marks at the horizon */}
        <g className="hero__dawn-ticks" fill="rgba(255, 226, 184, .35)">
          <circle cx="100" cy="244" r=".9" />
          <circle cx="200" cy="244" r=".9" />
          <circle cx="400" cy="244" r=".9" />
          <circle cx="500" cy="244" r=".9" />
        </g>

        {/* a soft outer wash that softens the corners */}
        <circle cx="300" cy="160" r="200" fill={`url(#${washId})`} className="hero__dawn-soft" />
      </svg>
    </span>
  )
}