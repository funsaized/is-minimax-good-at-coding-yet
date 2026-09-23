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
import { SpecimenSheet } from './SpecimenSheet'
import { ReadThreeTimes } from './ReadThreeTimes'
import { PressProofStamp } from './PressProofStamp'
import { FolioRule } from './FolioRule'

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
    tracking: '-.022em',
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
    tracking: '-.016em',
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

type SegmentId = WordId | 'plain' | 'space'

type Segment = {
  id: SegmentId
  text: string
  mark?: boolean
  line: 'a' | 'b'
}

const TITLE_SEGMENTS: Segment[] = [
  { id: 'm3', text: 'm³', mark: true, line: 'a' },
  { id: 'space', text: ' ', line: 'a' },
  { id: 'good', text: 'good at', mark: true, line: 'a' },
  { id: 'plain', text: 'frontend', line: 'b' },
  { id: 'space', text: ' ', line: 'b' },
  { id: 'yet', text: 'yet', mark: true, line: 'b' },
]

const TITLE = 'is Minimax M3 good at frontend yet?'

const SET_DURATION_MS = 1500
const STEP_MS = 90
const SET_BASE_DELAY_MS = 700

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

        <FolioRule word={word} voice={voice} pullSignal={pullSignal} setToday={setToday} />

        <h1
          id="hero-title-label"
          className={`hero__title hero__title--${voice} hero__title--arrange`}
          aria-label="is Minimax M3 good at frontend yet?"
        >
          <span className="hero__title-row hero__title-row--a">
            <span className="hero__title-baseline" aria-hidden="true" />
            <span className="hero__title-lead" aria-hidden="true">is</span>
            <span className="hero__title-lead-space" aria-hidden="true"> </span>
            {renderLineSegments({
              lineId: 'a',
              segments: TITLE_SEGMENTS.filter(s => s.line === 'a'),
              offset: 0,
              progress: setProgress,
              word,
              hover,
              voice,
              onWord,
              onHover,
              onWordKey,
              tokenRefs,
            })}
          </span>
          <span className="hero__title-row hero__title-row--b">
            <span className="hero__title-baseline" aria-hidden="true" />
            {renderLineSegments({
              lineId: 'b',
              segments: TITLE_SEGMENTS.filter(s => s.line === 'b'),
              offset: TITLE_SEGMENTS.filter(s => s.line === 'a').length,
              progress: setProgress,
              word,
              hover,
              voice,
              onWord,
              onHover,
              onWordKey,
              tokenRefs,
            })}
          </span>
        </h1>

        <span className="hero__title-rule" aria-hidden="true">
          <svg viewBox="0 0 1200 14" preserveAspectRatio="none" className="hero__title-rule-svg">
            <line
              x1="2"
              y1="7"
              x2="1198"
              y2="7"
              stroke="currentColor"
              strokeWidth=".5"
              strokeDasharray="1 4"
              opacity=".5"
            />
            <line
              x1="2"
              y1="7"
              x2="1198"
              y2="7"
              stroke="currentColor"
              strokeWidth=".8"
              opacity=".25"
              className="hero__title-rule-line"
            />
          </svg>
        </span>

        <SpecimenSheet
          voice={voice}
          word={word}
          hover={hover}
          pullSignal={pullSignal}
          setToday={setToday}
          onSelect={onVoice}
        />

        <footer className="hero__ledger" aria-label="A trial proof · the question set three ways">
          <ReadThreeTimes
            voice={voice}
            word={word}
            setToday={setToday}
            onVoice={onVoice}
          />
        </footer>

        <PressProofStamp
          voice={voice}
          word={word}
          setToday={setToday}
          pullSignal={pullSignal}
        />
      </ChaseFrame>
    </div>
  )
}

function segmentOffsets(reached: number): number[] {
  return TITLE_SEGMENTS.map((_, idx) => (idx < reached ? 1 : 0))
}

type RenderArgs = {
  lineId: 'a' | 'b'
  segments: Segment[]
  offset: number
  progress: number[]
  word: WordId
  hover: WordId | null
  voice: VoiceId
  onWord: (word: WordId, focus?: boolean) => void
  onHover: (word: WordId | null) => void
  onWordKey: (event: ReactKeyboardEvent<HTMLButtonElement>, id: WordId) => void
  tokenRefs: MutableRefObject<Partial<Record<WordId, HTMLButtonElement | null>>>
}

function renderLineSegments({
  lineId,
  segments,
  offset,
  progress,
  word,
  hover,
  voice,
  onWord,
  onHover,
  onWordKey,
  tokenRefs,
}: RenderArgs) {
  return segments.map((seg, idx) => {
    const realIdx = offset + idx
    const p = progress[realIdx] ?? 0
    const visible = p >= 1
    const setStyle = {
      '--set-idx': String(realIdx),
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
    if (id === 'yet') {
      return (
        <span
          key={`${lineId}-${id}`}
          className={`ht__word ht__word--yet ${isMarked ? 'is-marked' : ''} ${isHover ? 'is-hover' : ''}`}
          aria-hidden="true"
          style={setStyle}
          data-set={visible ? 'in' : 'pending'}
        >
          {isMarked && <span className="ht__glyph">{copy.glyph}</span>}
          <button
            type="button"
            ref={node => {
              tokenRefs.current.yet = node
            }}
            className="ht__token ht__token--yet"
            data-word-token="yet"
            onClick={() => onWord('yet')}
            onMouseEnter={() => onHover('yet')}
            onMouseLeave={() => onHover(null)}
            onFocus={() => onHover('yet')}
            onBlur={() => onHover(null)}
            onKeyDown={event => onWordKey(event, 'yet')}
            aria-pressed={word === 'yet'}
            aria-label={`${copy.label} — ${copy.tone} (mark: ${copy.mark})`}
          >
            <span className="ht__token-yet">yet</span>
            <span className={`ht__punct ht__punct--${voice}`} aria-hidden="true">
              <span className="ht__punct-mark">?</span>
            </span>
          </button>
        </span>
      )
    }
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
          data-word-token={id}
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
