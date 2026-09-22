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
import { VoicePlate } from './VoicePlate'
import { TypeBed } from './TypeBed'
import { HeroOverscore } from './HeroOverscore'

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
    tracking: '-.045em',
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

const TITLE_SEGMENTS: Array<{ id: WordId | 'plain' | 'space'; text: string; mark?: boolean }> = [
  { id: 'm3', text: 'm³', mark: true },
  { id: 'space', text: ' ' },
  { id: 'good', text: 'good at', mark: true },
  { id: 'space', text: ' ' },
  { id: 'plain', text: 'frontend' }
]

const TITLE = 'is Minimax M3 good at frontend yet?'

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

        <div className="hero__eyebrow-row">
          <span className="hero__eyebrow">
            <span className="hero__eyebrow-glyph" aria-hidden="true">¶</span>
            <span>folio i</span>
            <span className="hero__eyebrow-sep" aria-hidden="true">·</span>
            <span className="hero__eyebrow-em">the question, set three ways</span>
          </span>
        </div>

        <HeroOverscore title={TITLE} eyebrow="registered · for the reader · at first light" />

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

        <TypeBed
          voice={voice}
          word={word}
          hover={hover}
          onWord={onWord}
          onHover={onHover}
          onWordKey={onWordKey}
        />

        <span className="hero__sub" aria-hidden="true">
          <span className="hero__sub-mark" aria-hidden="true">⌇</span>
          <em>{spec.gloss}</em>
          <span className="hero__sub-rule" />
          <em className="hero__sub-set">set in {spec.name.toLowerCase()}</em>
          <span className="hero__sub-mark" aria-hidden="true">⌇</span>
        </span>

        <span className="hero__read-witness" aria-hidden="true">
          <span className="hero__read-witness-rule" />
          <span className="hero__read-witness-rule" />
          <em>read it three times · let one voice hold</em>
        </span>

        <span className="hero__set-mark" aria-hidden="true">
          <span className="hero__set-mark-rule" />
          <span className="hero__set-mark-center">
            <svg className="hero__set-mark-glyph" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth=".6" />
              <circle cx="12" cy="12" r="6.4" fill="none" stroke="currentColor" strokeWidth=".4" strokeDasharray=".9 1.6" opacity=".55" />
              <line x1="12" y1="4" x2="12" y2="9" stroke="currentColor" strokeWidth=".6" strokeLinecap="round" />
              <line x1="12" y1="15" x2="12" y2="20" stroke="currentColor" strokeWidth=".6" strokeLinecap="round" />
              <line x1="4" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth=".6" strokeLinecap="round" />
              <line x1="15" y1="12" x2="20" y2="12" stroke="currentColor" strokeWidth=".6" strokeLinecap="round" />
              <circle cx="12" cy="12" r="1.6" fill="currentColor" />
            </svg>
            <em>set &amp; registered</em>
          </span>
          <span className="hero__set-mark-rule" />
        </span>
      </ChaseFrame>

      <VoicePlate voice={voice} pullSignal={pullSignal} onSelect={onVoice} />
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