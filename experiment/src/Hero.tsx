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
import { TypeBed } from './TypeBed'

type HeroProps = {
  voice: VoiceId
  word: WordId
  hover: WordId | null
  setToday: string
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

export function Hero({
  voice,
  word,
  hover,
  setToday,
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

        <DawnBreak />

        <TypeBed tone={`var(--hero-tone, var(--quiet))`} />

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

        <span className="hero__quoin" aria-hidden="true">
          <svg viewBox="0 0 60 60">
            <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
              <path
                className="hero__quoin-stamp"
                d="M8 44 L52 16 L48 38 L12 50 Z"
                strokeWidth="1.1"
              />
              <path d="M14 42 L48 22" strokeWidth=".45" opacity=".55" />
              <path d="M22 38 L42 24" strokeWidth=".45" opacity=".4" />
              <circle cx="14" cy="44" r="1.6" fill="currentColor" />
            </g>
            <text
              x="30"
              y="32"
              textAnchor="middle"
              fontFamily="ui-monospace, 'SFMono-Regular', Menlo, monospace"
              fontSize="5.5"
              letterSpacing="1.4"
              fill="currentColor"
            >
              STET
            </text>
          </svg>
        </span>

        <span className="hero__type-high" aria-hidden="true">
          <svg viewBox="0 0 16 80" preserveAspectRatio="none">
            <line x1="2" y1="0" x2="2" y2="80" stroke="currentColor" strokeWidth=".4" strokeDasharray="1.5 2" opacity=".55" />
            <line x1="2" y1="20" x2="5" y2="20" stroke="currentColor" strokeWidth=".5" />
            <line x1="2" y1="40" x2="6" y2="40" stroke="currentColor" strokeWidth=".5" />
            <line x1="2" y1="60" x2="5" y2="60" stroke="currentColor" strokeWidth=".5" />
            <text x="9" y="42" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="2.6" letterSpacing=".8" fill="currentColor" opacity=".7">23.875</text>
          </svg>
        </span>
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

function DawnBreak() {
  const id = useId().replace(/:/g, '')
  const orbId = `dawn-orb-${id}`
  const tideId = `dawn-tide-${id}`
  const rayId = `dawn-rays-${id}`
  const moteId = `dawn-mote-${id}`

  return (
    <span className="hero__dawn" aria-hidden="true">
      <svg viewBox="0 0 600 360" preserveAspectRatio="xMidYMid slice">
        <defs>
          <radialGradient id={orbId} cx="50%" cy="55%" r="56%">
            <stop offset="0%" stopColor="rgba(255, 232, 198, .46)" />
            <stop offset="32%" stopColor="rgba(244, 188, 150, .24)" />
            <stop offset="68%" stopColor="rgba(168, 197, 255, .1)" />
            <stop offset="100%" stopColor="rgba(168, 197, 255, 0)" />
          </radialGradient>

          <linearGradient id={tideId} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(255, 226, 184, 0)" />
            <stop offset="22%" stopColor="rgba(255, 226, 184, .14)" />
            <stop offset="48%" stopColor="rgba(255, 234, 200, .26)" />
            <stop offset="68%" stopColor="rgba(255, 226, 184, .14)" />
            <stop offset="100%" stopColor="rgba(255, 226, 184, 0)" />
          </linearGradient>

          <linearGradient id={rayId} x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="rgba(255, 226, 184, .18)" />
            <stop offset="55%" stopColor="rgba(255, 226, 184, .06)" />
            <stop offset="100%" stopColor="rgba(255, 226, 184, 0)" />
          </linearGradient>

          <radialGradient id={moteId} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(255, 232, 198, .9)" />
            <stop offset="100%" stopColor="rgba(255, 232, 198, 0)" />
          </radialGradient>
        </defs>

        <rect x="0" y="148" width="600" height="212" fill={`url(#${rayId})`} className="hero__dawn-rays" />

        <circle className="hero__dawn-orb" cx="300" cy="222" r="156" fill={`url(#${orbId})`} />

        <g className="hero__dawn-horizon">
          <rect
            className="hero__dawn-horizon-line"
            x="0"
            y="222"
            width="600"
            height="1.1"
            fill={`url(#${tideId})`}
            opacity=".9"
          />
          <path
            d="M40 224 L162 224 L172 218 L208 240 L218 224 L298 224 L312 210 L334 210 L348 224 L420 224 L432 216 L478 216 L490 224 L568 224"
            fill="none"
            stroke={`url(#${tideId})`}
            strokeWidth=".5"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity=".55"
          />
          <path
            d="M40 232 L120 232 L130 226 L160 226 L172 232 L256 232 L268 218 L288 218 L302 232 L380 232 L390 224 L432 224 L444 232 L568 232"
            fill="none"
            stroke="rgba(255, 226, 184, .14)"
            strokeWidth=".35"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity=".5"
          />
        </g>

        <g className="hero__dawn-arc">
          <path
            d="M168 148 Q300 24 432 148"
            fill="none"
            stroke="rgba(245, 238, 216, .34)"
            strokeWidth=".55"
            strokeLinecap="round"
            strokeDasharray="0.8 3.2"
            opacity=".85"
          />
        </g>

        <g className="hero__dawn-ticks" fill="rgba(245, 238, 216, .42)">
          <circle cx="178" cy="138" r=".9" />
          <circle cx="216" cy="98" r=".7" />
          <circle cx="258" cy="58" r="1.1" />
          <circle cx="300" cy="34" r="1.4" />
          <circle cx="342" cy="58" r="1.1" />
          <circle cx="384" cy="98" r=".7" />
          <circle cx="422" cy="138" r=".9" />
        </g>

        <g className="hero__dawn-motes">
          <circle cx="78" cy="190" r="6" fill={`url(#${moteId})`} className="hero__dawn-mote" />
          <circle cx="502" cy="174" r="7" fill={`url(#${moteId})`} className="hero__dawn-mote hero__dawn-mote--b" />
          <circle cx="222" cy="232" r="4" fill={`url(#${moteId})`} className="hero__dawn-mote hero__dawn-mote--c" />
          <circle cx="406" cy="206" r="5" fill={`url(#${moteId})`} className="hero__dawn-mote hero__dawn-mote--d" />
          <circle cx="148" cy="160" r="3" fill={`url(#${moteId})`} className="hero__dawn-mote hero__dawn-mote--e" />
          <circle cx="478" cy="142" r="3.5" fill={`url(#${moteId})`} className="hero__dawn-mote hero__dawn-mote--f" />
        </g>

        <g className="hero__dawn-stars" fill="rgba(245, 238, 216, .55)">
          <circle cx="74" cy="58" r="1" />
          <circle cx="528" cy="46" r="1.2" />
          <circle cx="48" cy="114" r=".7" />
          <circle cx="562" cy="100" r=".8" />
        </g>
      </svg>
    </span>
  )
}