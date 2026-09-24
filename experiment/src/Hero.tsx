import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type MutableRefObject,
} from 'react'
import type { VoiceId } from './App'
import type { WordId } from './notes'
import { SpecimenSheet } from './SpecimenSheet'
import { ReadThreeTimes } from './ReadThreeTimes'
import { PressProofStamp } from './PressProofStamp'
import { FolioRule } from './FolioRule'
import { TitleSignature } from './TitleSignature'
import { CompositorInk } from './CompositorInk'
import { BroadsideInscription } from './BroadsideInscription'
import { FocalQuestionMark } from './FocalQuestionMark'

type HeroProps = {
  voice: VoiceId
  word: WordId
  hover: WordId | null
  setToday: string
  pullSignal: number
  setAnnouncement?: (text: string) => void
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
  setAnnouncement,
  onVoice,
  onWord,
  onHover,
  onWordKey,
  tokenRefs,
}: HeroProps) {
  const toneStyle = { '--hero-tone': `var(--${voice})` } as CSSProperties

  const [setProgress, setSetProgress] = useState(() => segmentOffsets(0))
  const [reduceMotion, setReduceMotion] = useState(false)
  const [resetTick, setResetTick] = useState(0)
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
  }, [reduceMotion, resetTick])

  const setTheLineAgain = useCallback(() => {
    if (reduceMotion) return
    setResetTick(t => t + 1)
    setAnnouncement?.('The line is set again.')
  }, [reduceMotion])

  return (
    <div className="hero__inner" style={toneStyle}>
      <FolioRule word={word} voice={voice} pullSignal={pullSignal} setToday={setToday} />

      <div className="hero__broadside">
        <BroadsideInscription voice={voice} setToday={setToday} />

        <span className="hero__title-flourish" aria-hidden="true">
          <svg viewBox="0 0 360 28" preserveAspectRatio="none">
            <path
              className="hero__title-flourish-stroke"
              d="M 4 16 Q 60 4 132 12 T 270 10 Q 320 12 356 6"
              fill="none"
              stroke="currentColor"
              strokeWidth=".55"
              strokeLinecap="round"
            />
            <path
              className="hero__title-flourish-shadow"
              d="M 12 19 Q 70 11 132 17 T 256 15 Q 304 17 348 12"
              fill="none"
              stroke="currentColor"
              strokeWidth=".28"
              strokeLinecap="round"
              opacity=".42"
            />
            <circle className="hero__title-flourish-cap hero__title-flourish-cap--l" cx="4" cy="16" r="1.3" fill="currentColor" opacity=".85" />
            <circle className="hero__title-flourish-cap hero__title-flourish-cap--l" cx="4" cy="16" r=".4" fill="var(--night)" />
            <circle className="hero__title-flourish-cap hero__title-flourish-cap--r" cx="356" cy="6" r="1.3" fill="currentColor" opacity=".85" />
            <circle className="hero__title-flourish-cap hero__title-flourish-cap--r" cx="356" cy="6" r=".4" fill="var(--night)" />
            <circle className="hero__title-flourish-bead" cx="180" cy="11" r="1" fill="currentColor" opacity=".7" />
          </svg>
        </span>

        <span className="hero__title-corner hero__title-corner--tl" aria-hidden="true">
          <span className="hero__title-corner-rule" />
          <em>set at first light</em>
        </span>
        <span className="hero__title-corner hero__title-corner--tr" aria-hidden="true">
          <em>folio ii · the question</em>
          <span className="hero__title-corner-rule" />
        </span>

        <span className="hero__broadside-pin hero__broadside-pin--tl" aria-hidden="true">
          <svg viewBox="0 0 26 26">
            <circle cx="13" cy="13" r="11" fill="none" stroke="currentColor" strokeWidth=".55" opacity=".75" />
            <circle cx="13" cy="13" r="6" fill="none" stroke="currentColor" strokeWidth=".32" strokeDasharray=".7 1.6" opacity=".55" />
            <circle cx="13" cy="13" r="1.4" fill="currentColor" />
            <circle cx="13" cy="13" r=".5" fill="var(--night)" />
            <path d="M 6 8 Q 9 5.5 12 8" fill="none" stroke="currentColor" strokeWidth=".4" strokeLinecap="round" opacity=".6" />
          </svg>
        </span>
        <span className="hero__broadside-pin hero__broadside-pin--tr" aria-hidden="true">
          <svg viewBox="0 0 26 26">
            <circle cx="13" cy="13" r="11" fill="none" stroke="currentColor" strokeWidth=".55" opacity=".75" />
            <circle cx="13" cy="13" r="6" fill="none" stroke="currentColor" strokeWidth=".32" strokeDasharray=".7 1.6" opacity=".55" />
            <circle cx="13" cy="13" r="1.4" fill="currentColor" />
            <circle cx="13" cy="13" r=".5" fill="var(--night)" />
            <line x1="17" y1="6" x2="20" y2="6" stroke="currentColor" strokeWidth=".4" strokeLinecap="round" opacity=".6" />
            <circle cx="22" cy="6" r=".8" fill="currentColor" opacity=".7" />
          </svg>
        </span>
        <span className="hero__broadside-pin hero__broadside-pin--bl" aria-hidden="true">
          <svg viewBox="0 0 26 26">
            <circle cx="13" cy="13" r="11" fill="none" stroke="currentColor" strokeWidth=".55" opacity=".75" />
            <circle cx="13" cy="13" r="6" fill="none" stroke="currentColor" strokeWidth=".32" strokeDasharray=".7 1.6" opacity=".55" />
            <circle cx="13" cy="13" r="1.4" fill="currentColor" />
            <circle cx="13" cy="13" r=".5" fill="var(--night)" />
            <line x1="4" y1="20" x2="9" y2="20" stroke="currentColor" strokeWidth=".35" strokeLinecap="round" strokeDasharray=".5 1" opacity=".55" />
          </svg>
        </span>
        <span className="hero__broadside-pin hero__broadside-pin--br" aria-hidden="true">
          <svg viewBox="0 0 26 26">
            <circle cx="13" cy="13" r="11" fill="none" stroke="currentColor" strokeWidth=".55" opacity=".75" />
            <circle cx="13" cy="13" r="6" fill="none" stroke="currentColor" strokeWidth=".32" strokeDasharray=".7 1.6" opacity=".55" />
            <circle cx="13" cy="13" r="1.4" fill="currentColor" />
            <circle cx="13" cy="13" r=".5" fill="var(--night)" />
            <path d="M 17 20 L 20 18 L 21 20" fill="none" stroke="currentColor" strokeWidth=".4" strokeLinecap="round" strokeLinejoin="round" opacity=".6" />
          </svg>
        </span>

        <h1
          id="hero-title-label"
          className={`hero__title hero__title--${voice} hero__title--arrange`}
          aria-label="is Minimax M3 good at frontend yet?"
        >
          <span className="hero__title-row hero__title-row--a">
            <span className="hero__title-baseline" aria-hidden="true" />
            <span className="hero__title-lead-wrap" aria-hidden="true">
              <span className="hero__title-swash" aria-hidden="true">
                <svg viewBox="0 0 28 36" preserveAspectRatio="none">
                  <path
                    className="hero__title-swash-stroke"
                    d="M3 30 C7 24, 9 18, 8 12 C7.4 6, 12 4, 18 6 C24 8, 26 14, 24 20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth=".7"
                    strokeLinecap="round"
                    opacity=".75"
                  />
                  <circle className="hero__title-swash-bead" cx="3" cy="30" r="1.1" fill="currentColor" opacity=".85" />
                  <circle className="hero__title-swash-bead hero__title-swash-bead--top" cx="24" cy="20" r="1.4" fill="currentColor" opacity=".95" />
                  <circle cx="24" cy="20" r=".5" fill="var(--night)" />
                </svg>
              </span>
              <span className="hero__title-lead">is</span>
            </span>
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

        <span className="hero__held-breath" aria-hidden="true">
          <span className="hero__held-breath-rule" />
          <span className="hero__held-breath-mark">
            <svg viewBox="0 0 36 14" preserveAspectRatio="none">
              <line x1="2" y1="7" x2="14" y2="7" stroke="currentColor" strokeWidth=".4" strokeDasharray=".6 2" opacity=".55" />
              <circle cx="18" cy="7" r="2.2" fill="currentColor" opacity=".78" />
              <circle cx="18" cy="7" r=".7" fill="var(--night)" />
              <line x1="22" y1="7" x2="34" y2="7" stroke="currentColor" strokeWidth=".4" strokeDasharray=".6 2" opacity=".55" />
            </svg>
          </span>
          <span className="hero__held-breath-rule" />
          <em className="hero__held-breath-key">the page holds</em>
          <span className="hero__held-breath-rule" />
          <span className="hero__held-breath-mark hero__held-breath-mark--end">
            <svg viewBox="0 0 36 14" preserveAspectRatio="none">
              <line x1="2" y1="7" x2="14" y2="7" stroke="currentColor" strokeWidth=".4" strokeDasharray=".6 2" opacity=".55" />
              <circle cx="18" cy="7" r="1.2" fill="currentColor" opacity=".78" />
              <circle cx="18" cy="7" r=".4" fill="var(--night)" />
              <line x1="22" y1="7" x2="34" y2="7" stroke="currentColor" strokeWidth=".4" strokeDasharray=".6 2" opacity=".55" />
            </svg>
          </span>
          <span className="hero__held-breath-rule" />
        </span>

        <FocalQuestionMark voice={voice} onSetLine={setTheLineAgain} />

        <CompositorInk voice={voice} word={word} />

        <TitleSignature voice={voice} />
      </div>

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
          <span className="ht__under" aria-hidden="true">
            <svg viewBox="0 0 200 6" preserveAspectRatio="none" className="ht__under-svg">
              <line
                x1="2"
                y1="3.4"
                x2="190"
                y2="3.4"
                stroke="currentColor"
                strokeWidth=".45"
                strokeDasharray="1.1 1.6"
                strokeLinecap="round"
                opacity=".55"
              />
              <circle cx="2" cy="3.4" r=".9" fill="currentColor" opacity=".75" />
              <path
                d="M184 1 L192 3.4 L184 5.8"
                fill="none"
                stroke="currentColor"
                strokeWidth=".5"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity=".75"
              />
            </svg>
          </span>
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
          <span className="ht__word-mark" aria-hidden="true">
            <svg viewBox="0 0 80 8" preserveAspectRatio="none" className="ht__word-mark-svg">
              <line x1="2" y1="6" x2="78" y2="6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              <circle cx="2" cy="6" r="1.6" fill="currentColor" />
              <circle cx="78" cy="6" r="1.6" fill="currentColor" />
            </svg>
          </span>
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
              <span className="ht__punct-halo" aria-hidden="true" />
              <span className="ht__punct-mark">?</span>
              <span className="ht__query-seal" aria-hidden="true">
                <svg viewBox="0 0 36 36" className="ht__query-seal-svg">
                  <line
                    x1="18"
                    y1="0"
                    x2="18"
                    y2="6"
                    stroke="currentColor"
                    strokeWidth=".55"
                    strokeLinecap="round"
                    opacity=".6"
                  />
                  <circle cx="18" cy="18" r="15" fill="none" stroke="currentColor" strokeWidth=".5" strokeDasharray=".7 1.6" opacity=".65" />
                  <circle cx="18" cy="18" r="11.6" fill="none" stroke="currentColor" strokeWidth=".35" opacity=".45" />
                  <circle cx="18" cy="18" r="9.2" fill="none" stroke="currentColor" strokeWidth=".28" strokeDasharray=".4 1.2" opacity=".4" />
                  <text
                    x="18"
                    y="21.5"
                    textAnchor="middle"
                    fontFamily="'Iowan Old Style', 'Palatino Linotype', Georgia, serif"
                    fontStyle="italic"
                    fontSize="11"
                    fill="currentColor"
                    opacity=".95"
                  >
                    ?
                  </text>
                  <circle cx="18" cy="6" r=".6" fill="currentColor" opacity=".7" />
                  <circle cx="18" cy="30" r=".6" fill="currentColor" opacity=".7" />
                </svg>
              </span>
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
        <span className="ht__word-mark" aria-hidden="true">
          <svg viewBox="0 0 80 8" preserveAspectRatio="none" className="ht__word-mark-svg">
            <line x1="2" y1="6" x2="78" y2="6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            <circle cx="2" cy="6" r="1.6" fill="currentColor" />
            <circle cx="78" cy="6" r="1.6" fill="currentColor" />
          </svg>
        </span>
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