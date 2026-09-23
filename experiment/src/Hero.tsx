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
import { HeroComposition } from './HeroComposition'
import { PressProofStamp } from './PressProofStamp'
import { ReaderMarginalia } from './ReaderMarginalia'

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

        <div className="hero__eyebrow-row">
          <span className="hero__eyebrow">
            <span className="hero__eyebrow-glyph" aria-hidden="true">¶</span>
            <span>folio i</span>
            <span className="hero__eyebrow-sep" aria-hidden="true">·</span>
            <span className="hero__eyebrow-em">the question</span>
          </span>
          <span className="hero__eyebrow-date" aria-hidden="true">
            <span className="hero__eyebrow-date-rule" />
            <em>set today</em>
            <span className="hero__eyebrow-date-tag">{setToday}</span>
          </span>
        </div>

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
          <svg viewBox="0 0 1200 18" preserveAspectRatio="none" className="hero__title-rule-svg">
            <line
              x1="2"
              y1="9"
              x2="1198"
              y2="9"
              stroke="currentColor"
              strokeWidth=".5"
              strokeDasharray="1 4"
              opacity=".5"
            />
            <line
              x1="2"
              y1="9"
              x2="1198"
              y2="9"
              stroke="currentColor"
              strokeWidth=".8"
              opacity=".25"
              className="hero__title-rule-line"
            />
          </svg>
          <span
            className={`hero__title-bead hero__title-bead--m3 ${word === 'm3' ? 'is-marked' : ''}`}
            aria-hidden="true"
          >
            <svg viewBox="0 0 14 14">
              <circle cx="7" cy="7" r="5.4" fill="var(--night)" stroke="currentColor" strokeWidth=".55" />
              <circle cx="7" cy="7" r="2.6" fill="currentColor" opacity=".85" />
              <circle cx="7" cy="7" r=".8" fill="var(--night)" />
            </svg>
            <em className="hero__title-bead-mark">⌇</em>
          </span>
          <span
            className={`hero__title-bead hero__title-bead--good ${word === 'good' ? 'is-marked' : ''}`}
            aria-hidden="true"
          >
            <svg viewBox="0 0 14 14">
              <circle cx="7" cy="7" r="5.4" fill="var(--night)" stroke="currentColor" strokeWidth=".55" />
              <circle cx="7" cy="7" r="2.6" fill="currentColor" opacity=".85" />
              <circle cx="7" cy="7" r=".8" fill="var(--night)" />
            </svg>
            <em className="hero__title-bead-mark">∧</em>
          </span>
          <span
            className={`hero__title-bead hero__title-bead--yet ${word === 'yet' ? 'is-marked' : ''}`}
            aria-hidden="true"
          >
            <svg viewBox="0 0 14 14">
              <circle cx="7" cy="7" r="5.4" fill="var(--night)" stroke="currentColor" strokeWidth=".55" />
              <circle cx="7" cy="7" r="2.6" fill="currentColor" opacity=".85" />
              <circle cx="7" cy="7" r=".8" fill="var(--night)" />
            </svg>
            <em className="hero__title-bead-mark">?</em>
          </span>
        </span>

        <ReaderMarginalia word={word} hover={hover} voice={voice} pullSignal={pullSignal} />

        <HeroComposition voice={voice} word={word} hover={hover} />

        <footer className="hero__ledger" aria-label="The composer&rsquo;s ledger at the foot of the folio">
          <div className="hero__ledger-row">
            <span className="hero__ledger-rule hero__ledger-rule--l" aria-hidden="true" />
            <span className="hero__ledger-core">
              <em className="hero__ledger-mark" aria-hidden="true">
                <svg viewBox="0 0 16 16">
                  <circle cx="8" cy="8" r="6.4" fill="none" stroke="currentColor" strokeWidth=".55" />
                  <circle cx="8" cy="8" r="3.4" fill="currentColor" opacity=".4" />
                  <circle cx="8" cy="8" r="1" fill="var(--night)" />
                </svg>
              </em>
              <em className="hero__ledger-line">
                <span className="hero__ledger-verb">read it three times</span>
                <span className="hero__ledger-dot" aria-hidden="true">·</span>
                <span className="hero__ledger-let">let one voice hold</span>
              </em>
            </span>
            <span className="hero__ledger-set" aria-hidden="true">
              <span className="hero__ledger-set-rule" />
              <em>set on {setToday}</em>
              <span className="hero__ledger-set-rule" />
            </span>
            <span className="hero__ledger-rule hero__ledger-rule--r" aria-hidden="true" />
          </div>
          <HeroVoices voice={voice} pullSignal={pullSignal} onSelect={onVoice} compact />
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

type HeroVoicesProps = {
  voice: VoiceId
  pullSignal: number
  onSelect: (voice: VoiceId) => void
  compact?: boolean
}

type VoiceChip = {
  voice: VoiceId
  letter: string
  name: string
  face: string
  caption: string
  family: string
  weight: number
  style: 'italic' | 'normal'
  tracking: string
  uppercased: boolean
  sample: string
}

const HERO_VOICES: Record<VoiceId, VoiceChip> = {
  quiet: {
    voice: 'quiet',
    letter: 'A',
    name: 'quiet cut',
    face: 'serif · italic · close set',
    caption: 'the line, set softly',
    family: "'Iowan Old Style', 'Palatino Linotype', Georgia, serif",
    weight: 400,
    style: 'italic',
    tracking: '-.022em',
    uppercased: false,
    sample: 'is m³ good at frontend yet?',
  },
  human: {
    voice: 'human',
    letter: 'B',
    name: 'human hand',
    face: 'serif · italic · warm',
    caption: 'the line, set by hand',
    family: "'Iowan Old Style', 'Palatino Linotype', Georgia, serif",
    weight: 500,
    style: 'italic',
    tracking: '-.016em',
    uppercased: false,
    sample: 'is M3 good at frontend yet?',
  },
  bold: {
    voice: 'bold',
    letter: 'C',
    name: 'bold signal',
    face: 'sans · heavy',
    caption: 'the line, set at full height',
    family: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
    weight: 800,
    style: 'normal',
    tracking: '-.04em',
    uppercased: true,
    sample: 'IS M3 GOOD AT FRONTEND YET?',
  },
}

const HERO_VOICE_ORDER: VoiceId[] = ['quiet', 'human', 'bold']

function HeroVoices({ voice, pullSignal, onSelect, compact }: HeroVoicesProps) {
  const active = HERO_VOICES[voice]
  const activeSampleStyle = {
    fontFamily: active.family,
    fontWeight: active.weight,
    fontStyle: active.style,
    letterSpacing: active.tracking,
    textTransform: active.uppercased ? ('uppercase' as const) : ('none' as const),
  } as CSSProperties

  const onChipKey = (event: ReactKeyboardEvent<HTMLButtonElement>, target: VoiceId) => {
    const index = HERO_VOICE_ORDER.indexOf(target)
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault()
      onSelect(HERO_VOICE_ORDER[(index + 1) % HERO_VOICE_ORDER.length])
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault()
      onSelect(HERO_VOICE_ORDER[(index - 1 + HERO_VOICE_ORDER.length) % HERO_VOICE_ORDER.length])
    } else if (event.key === 'Home') {
      event.preventDefault()
      onSelect(HERO_VOICE_ORDER[0])
    } else if (event.key === 'End') {
      event.preventDefault()
      onSelect(HERO_VOICE_ORDER[HERO_VOICE_ORDER.length - 1])
    }
  }

  return (
    <aside
      className={`hero-voices hero-voices--${voice} ${compact ? 'hero-voices--compact' : ''}`}
      aria-label="The three voices, set on the same line"
    >
      {!compact && (
        <header className="hero-voices__head" aria-hidden="true">
          <span className="hero-voices__head-key">
            <span className="hero-voices__head-line" />
            <em>three voices</em>
          </span>
          <span className="hero-voices__head-meta">
            <span className="hero-voices__head-dot" />
            <em>set in</em>
            <span className="hero-voices__head-name">{active.name}</span>
          </span>
        </header>
      )}

      {compact ? (
        <div className="hero-voices__marginalia" role="radiogroup" aria-label="Switch the voice · A quiet, B human, C bold">
          <span className="hero-voices__marginalia-key" aria-hidden="true">
            <span className="hero-voices__marginalia-rule" />
            <em>three voices · set on the same line</em>
            <span className="hero-voices__marginalia-rule" />
          </span>
          <div className="hero-voices__marginalia-cord">
            <span className="hero-voices__marginalia-note">
              <em className="hero-voices__marginalia-note-label">compositor&apos;s note</em>
              <span className="hero-voices__marginalia-note-line" aria-hidden="true">
                <span className="hero-voices__marginalia-note-rule" />
                <em className="hero-voices__marginalia-note-glyph">¶</em>
                <em className="hero-voices__marginalia-note-copy">
                  the page reads best in <strong>{active.name.toLowerCase()}</strong> — but the other two voices are kept close.
                </em>
                <span className="hero-voices__marginalia-note-rule" />
              </span>
            </span>
            <ol className="hero-voices__marginalia-row">
              {HERO_VOICE_ORDER.map(v => {
                const row = HERO_VOICES[v]
                const isActive = voice === v
                return (
                  <li key={v} className="hero-voices__marginalia-cell">
                    <button
                      type="button"
                      role="radio"
                      aria-checked={isActive}
                      className={`hero-voices__marginalia-chip hero-voices__marginalia-chip--${v} ${isActive ? 'is-active' : ''}`}
                      onClick={() => onSelect(v)}
                      onKeyDown={event => onChipKey(event, v)}
                      aria-label={`${row.letter} · ${row.name} · ${row.face}`}
                    >
                      <span className="hero-voices__marginalia-letter" aria-hidden="true">{row.letter}</span>
                      <span className="hero-voices__marginalia-stack">
                        <em className="hero-voices__marginalia-name">{row.name}</em>
                        <span className="hero-voices__marginalia-face">{row.face}</span>
                      </span>
                      <span className="hero-voices__marginalia-marker" aria-hidden="true">
                        <svg viewBox="0 0 12 12">
                          <line x1="2" y1="6" x2="10" y2="6" stroke="currentColor" strokeWidth=".55" strokeLinecap="round" />
                          <circle cx="6" cy="6" r="1" fill="currentColor" />
                        </svg>
                      </span>
                    </button>
                  </li>
                )
              })}
            </ol>
          </div>
        </div>
      ) : (
        <>
          <p
            className={`hero-voices__sample hero-voices__sample--${voice}`}
            style={activeSampleStyle}
            key={`sample-${voice}-${pullSignal}`}
          >
            {active.sample}
          </p>

          <p className="hero-voices__caption" aria-hidden="true">
            <em>{active.caption}</em>
            <span className="hero-voices__caption-dot" aria-hidden="true">·</span>
            <em className="hero-voices__caption-face">{active.face}</em>
          </p>

          <div className="hero-voices__chips" role="radiogroup" aria-label="Switch the voice · A quiet, B human, C bold">
            {HERO_VOICE_ORDER.map(v => {
              const row = HERO_VOICES[v]
              const isActive = voice === v
              return (
                <button
                  key={v}
                  type="button"
                  role="radio"
                  aria-checked={isActive}
                  className={`hero-voices__chip hero-voices__chip--${v} ${isActive ? 'is-active' : ''}`}
                  onClick={() => onSelect(v)}
                  onKeyDown={event => onChipKey(event, v)}
                  aria-label={`${row.letter} · ${row.name} · ${row.face}`}
                >
                  <span className="hero-voices__chip-letter" aria-hidden="true">{row.letter}</span>
                  <span className="hero-voices__chip-stack">
                    <em className="hero-voices__chip-name">{row.name}</em>
                    <span className="hero-voices__chip-face">{row.face}</span>
                  </span>
                  <span className="hero-voices__chip-pip" aria-hidden="true" />
                </button>
              )
            })}
          </div>

          <footer className="hero-voices__foot" aria-hidden="true">
            <span className="hero-voices__foot-rule" />
            <em className="hero-voices__foot-line">
              cycle <kbd>shift</kbd>+<kbd>v</kbd>
              <span className="hero-voices__foot-dot" aria-hidden="true">·</span>
              or click a chip
            </em>
            <span className="hero-voices__foot-rule" />
          </footer>
        </>
      )}
    </aside>
  )
}