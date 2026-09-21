import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type MutableRefObject,
} from 'react'
import type { VoiceId } from './Press'
import type { WordId } from './notes'

type HeroTitleProps = {
  voice: VoiceId
  word: WordId
  hover: WordId | null
  setToday: string
  onVoice: (voice: VoiceId) => void
  onWord: (word: WordId, focus?: boolean) => void
  onHover: (word: WordId | null) => void
  tokenRefs: MutableRefObject<Partial<Record<WordId, HTMLSpanElement | null>>>
}

type VoiceFace = {
  letter: string
  name: string
  descriptor: string
  family: string
  weight: number
  style: 'italic' | 'normal'
  tracking: string
  uppercased: boolean
  sizeScalar: number
}

const VOICE_FACE: Record<VoiceId, VoiceFace> = {
  quiet: {
    letter: 'A',
    name: 'quiet cut',
    descriptor: 'serif · italic · close set',
    family: "'Iowan Old Style', 'Palatino Linotype', Georgia, serif",
    weight: 400,
    style: 'italic',
    tracking: '-.03em',
    uppercased: false,
    sizeScalar: 0.94,
  },
  human: {
    letter: 'B',
    name: 'human hand',
    descriptor: 'serif · italic · a little warm',
    family: "'Iowan Old Style', 'Palatino Linotype', Georgia, serif",
    weight: 500,
    style: 'italic',
    tracking: '-.02em',
    uppercased: false,
    sizeScalar: 1.02,
  },
  bold: {
    letter: 'C',
    name: 'bold signal',
    descriptor: 'sans · heavy · no apology',
    family: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
    weight: 900,
    style: 'normal',
    tracking: '-.055em',
    uppercased: true,
    sizeScalar: 1.12,
  },
}

const VOICE_ORDER: VoiceId[] = ['quiet', 'human', 'bold']
const PHRASE_ORDER: WordId[] = ['m3', 'good', 'yet']

const WORD_LABEL: Record<WordId, string> = { m3: 'm³', good: 'good at', yet: 'yet?' }
const WORD_KIND: Record<WordId, string> = { m3: 'stet', good: 'caret', yet: 'query' }
const WORD_GLOSS: Record<WordId, string> = { m3: 'let it stand', good: 'make room', yet: 'protect the pause' }
const WORD_HEAD: Record<WordId, string> = { m3: 'the maker', good: 'the verb', yet: 'the pause' }
const WORD_GLYPH: Record<WordId, string> = { m3: '⌇', good: '∧', yet: '?' }

const SEASON = (() => {
  const month = new Date().getMonth()
  if (month <= 1 || month === 11) return 'winter'
  if (month <= 4) return 'spring'
  if (month <= 7) return 'summer'
  return 'autumn'
})()

export function HeroTitle({
  voice,
  word,
  hover,
  setToday,
  onVoice,
  onWord,
  onHover,
  tokenRefs,
}: HeroTitleProps) {
  const baseId = useId().replace(/:/g, '')
  const grainId = `hero-title-grain-${baseId}`
  const ruleGrainId = `hero-title-rule-grain-${baseId}`
  const rootRef = useRef<HTMLElement>(null)
  const [revealed, setRevealed] = useState(false)
  const [stamping, setStamping] = useState(false)
  const stampTimerRef = useRef<number | null>(null)
  const firstVoiceRef = useRef(true)
  const face = VOICE_FACE[voice]

  const headlineStyle: CSSProperties = useMemo(() => ({
    fontFamily: face.family,
    fontWeight: face.weight,
    fontStyle: face.style,
    letterSpacing: face.tracking,
    fontSize: `calc(clamp(46px, 8.2vw, 108px) * ${face.sizeScalar})`,
    lineHeight: 1.02,
  }), [face])

  const displayText = (label: string) => (face.uppercased ? label.toUpperCase() : label)

  const toneStyle = {
    '--ht-tone': `var(--ht-tone-${voice})`,
    '--ht-tone-quiet': 'var(--blue)',
    '--ht-tone-human': 'var(--coral)',
    '--ht-tone-bold': 'var(--acid)',
  } as CSSProperties

  useEffect(() => {
    const node = rootRef.current
    if (!node) {
      setRevealed(true)
      return
    }
    if (!('IntersectionObserver' in window)) {
      setRevealed(true)
      return
    }
    const observer = new IntersectionObserver(
      entries => {
        if (entries.some(entry => entry.isIntersecting)) {
          setRevealed(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -4% 0px' },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (firstVoiceRef.current) {
      firstVoiceRef.current = false
      return
    }
    setStamping(true)
    if (stampTimerRef.current !== null) window.clearTimeout(stampTimerRef.current)
    stampTimerRef.current = window.setTimeout(() => {
      setStamping(false)
      stampTimerRef.current = null
    }, 720)
    return () => {
      if (stampTimerRef.current !== null) {
        window.clearTimeout(stampTimerRef.current)
        stampTimerRef.current = null
      }
    }
  }, [voice])

  const onWordKey = (event: ReactKeyboardEvent<HTMLButtonElement>, id: WordId) => {
    const idx = PHRASE_ORDER.indexOf(id)
    const focus = (next: WordId) => {
      onWord(next)
      window.requestAnimationFrame(() => tokenRefs.current[next]?.focus())
    }
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault()
      focus(PHRASE_ORDER[(idx + 1) % PHRASE_ORDER.length])
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault()
      focus(PHRASE_ORDER[(idx - 1 + PHRASE_ORDER.length) % PHRASE_ORDER.length])
    } else if (event.key === 'Home') {
      event.preventDefault()
      focus('m3')
    } else if (event.key === 'End') {
      event.preventDefault()
      focus('yet')
    }
  }

  const onVoiceKey = (event: ReactKeyboardEvent<HTMLButtonElement>, id: VoiceId) => {
    const idx = VOICE_ORDER.indexOf(id)
    let nextIdx = idx
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') nextIdx = (idx + 1) % VOICE_ORDER.length
    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') nextIdx = (idx - 1 + VOICE_ORDER.length) % VOICE_ORDER.length
    if (event.key === 'Home') nextIdx = 0
    if (event.key === 'End') nextIdx = VOICE_ORDER.length - 1
    if (nextIdx === idx) return
    event.preventDefault()
    onVoice(VOICE_ORDER[nextIdx])
  }

  const renderToken = (id: WordId) => {
    const isMarked = word === id
    const isHover = hover === id
    const label = displayText(WORD_LABEL[id])
    return (
      <span
        key={`ht-token-${id}`}
        className={`ht__word ht__word--${id} ${isMarked ? 'is-marked' : ''} ${isHover ? 'is-hover' : ''}`}
      >
        <button
          ref={node => {
            tokenRefs.current[id] = node
          }}
          type="button"
          className="ht__token"
          onClick={event => {
            event.stopPropagation()
            onWord(id)
          }}
          onMouseEnter={() => onHover(id)}
          onMouseLeave={() => onHover(null)}
          onFocus={() => onHover(id)}
          onBlur={() => onHover(null)}
          onKeyDown={event => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault()
              onWord(id)
              return
            }
            onWordKey(event, id)
          }}
          aria-pressed={isMarked}
          aria-label={`Mark the word ${WORD_LABEL[id]} · ${WORD_KIND[id]} · ${WORD_GLOSS[id]}.`}
        >
          <span className="ht__token-rule ht__token-rule--lead" aria-hidden="true" />
          <span className="ht__token-text" style={headlineStyle}>{label}</span>
          <span className="ht__token-rule ht__token-rule--trail" aria-hidden="true" />
        </button>
        <span className="ht__word-mark" aria-hidden="true">
          <span className="ht__word-mark-glyph">{WORD_GLYPH[id]}</span>
          <span className="ht__word-mark-name">{WORD_KIND[id]}</span>
        </span>
      </span>
    )
  }

  const ariaLabel = `${displayText('is')} ${displayText(WORD_LABEL.m3)} ${displayText(WORD_LABEL.good)} ${displayText('frontend')} ${displayText(WORD_LABEL.yet)}`

  return (
    <article
      ref={rootRef}
      className={`ht ht--${voice} ht--word-${word} ${revealed ? 'is-revealed' : ''} ${stamping ? 'is-stamping' : ''}`}
      style={toneStyle}
      aria-label={`The headline · folio i · the question · set in ${face.name} · marked at ${WORD_LABEL[word]} (${WORD_KIND[word]}) · set today ${setToday}.`}
    >
      <svg className="ht__defs" viewBox="0 0 1200 1200" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <filter id={grainId} x="-2%" y="-2%" width="104%" height="104%">
            <feTurbulence type="fractalNoise" baseFrequency="0.84" numOctaves="2" seed="41" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 .14  0 0 0 0 .12  0 0 0 0 .19  0 0 0 .05 0" />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
          <filter id={ruleGrainId} x="-2%" y="-50%" width="104%" height="200%">
            <feTurbulence type="fractalNoise" baseFrequency="2.4" numOctaves="2" seed="47" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .5 0" />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
        </defs>
      </svg>

      <span className="ht__paper" aria-hidden="true">
        <svg viewBox="0 0 1200 1200" preserveAspectRatio="none">
          <rect x="0" y="0" width="1200" height="1200" filter={`url(#${grainId})`} opacity=".045" />
        </svg>
      </span>

      <header className="ht__band">
        <span className="ht__band-rule" aria-hidden="true">
          <svg viewBox="0 0 120 8" preserveAspectRatio="none">
            <g filter={`url(#${ruleGrainId})`}>
              <path
                className="ht__band-rule-stroke"
                d="M2 4c10-3 20 3 30 0s20-3 30 0 20 3 30 0 20-3 26 0"
                fill="none"
                stroke="currentColor"
                strokeWidth=".55"
                strokeLinecap="round"
                pathLength="100"
              />
            </g>
            <circle cx="2" cy="4" r=".9" fill="currentColor" />
            <circle cx="118" cy="4" r=".9" fill="currentColor" />
          </svg>
        </span>
        <span className="ht__band-folio" aria-hidden="false">
          <span className="ht__band-folio-key">folio</span>
          <em className="ht__band-folio-num">i</em>
          <span className="ht__band-folio-line">the question</span>
        </span>
        <span className="ht__band-set" aria-hidden="false">
          <span className="ht__band-set-key">set</span>
          <em className="ht__band-set-date">{setToday}</em>
          <span className="ht__band-set-season">{SEASON}</span>
        </span>
      </header>

      <h2 className="ht__headline" aria-label={ariaLabel}>
        <span className="ht__lead" style={headlineStyle} aria-hidden="true">is</span>
        <span className="ht__lead-space" aria-hidden="true"> </span>
        {renderToken('m3')}
        <span className="ht__gap-space" aria-hidden="true"> </span>
        {renderToken('good')}
        <span className="ht__gap" style={headlineStyle} aria-hidden="true">frontend</span>
        <span className="ht__gap-space" aria-hidden="true"> </span>
        {renderToken('yet')}
      </h2>

      <span className="ht__rule" aria-hidden="true">
        <svg viewBox="0 0 460 6" preserveAspectRatio="none">
          <g filter={`url(#${ruleGrainId})`}>
            <path
              className="ht__rule-lead"
              d="M2 3c30-2 60 2 90 0s60-2 90 0 60 2 90 0 60-2 90 0 30 2 50 0 30-2 48 0"
              fill="none"
              stroke="currentColor"
              strokeWidth=".7"
              strokeLinecap="round"
              pathLength="100"
            />
          </g>
          <circle className="ht__rule-mark" cx="230" cy="3" r="2.2" fill="currentColor" />
        </svg>
      </span>

      <div className="ht__mark-callout" aria-live="polite">
        <span className="ht__mark-callout-key">
          <span className="ht__mark-callout-pilcrow" aria-hidden="true">¶</span>
          <em>marked at</em>
        </span>
        <span className="ht__mark-callout-row">
          <span className="ht__mark-callout-tag">{WORD_KIND[word]}</span>
          <em className="ht__mark-callout-label">{displayText(WORD_LABEL[word])}</em>
          <span className="ht__mark-callout-head">— {WORD_HEAD[word]}</span>
        </span>
        <span className="ht__mark-callout-gloss">{WORD_GLOSS[word]}</span>
      </div>

      <div className="ht__voices" role="group" aria-label="Voice selector · three settings for the headline">
        <span className="ht__voices-key">
          <span className="ht__voices-key-mark" aria-hidden="true" />
          set the line in
          <span className="ht__voices-key-rule" aria-hidden="true" />
        </span>
        <div className="ht__voices-stations">
          {VOICE_ORDER.map((v, idx) => {
            const isActive = v === voice
            const sampleText = `${face.uppercased ? 'IS' : 'is'} ${VOICE_FACE[v].uppercased ? WORD_LABEL.m3.toUpperCase() : WORD_LABEL.m3} ${VOICE_FACE[v].uppercased ? WORD_LABEL.good.toUpperCase() : WORD_LABEL.good} ${VOICE_FACE[v].uppercased ? 'FRONTEND' : 'frontend'} ${VOICE_FACE[v].uppercased ? WORD_LABEL.yet.toUpperCase() : WORD_LABEL.yet}`
            const stationStyle = {
              fontFamily: VOICE_FACE[v].family,
              fontWeight: VOICE_FACE[v].weight,
              fontStyle: VOICE_FACE[v].style,
              letterSpacing: VOICE_FACE[v].tracking,
              fontSize: `calc(clamp(20px, 2.6vw, 30px) * ${VOICE_FACE[v].sizeScalar})`,
              lineHeight: 1.05,
            } as CSSProperties
            return (
              <button
                key={`ht-voice-${v}`}
                type="button"
                className={`ht__voice ht__voice--${v} ${isActive ? 'is-active' : ''}`}
                data-station-index={idx}
                onClick={() => onVoice(v)}
                onKeyDown={event => onVoiceKey(event, v)}
                aria-pressed={isActive}
                tabIndex={isActive ? 0 : -1}
                aria-label={`Set the headline in the ${VOICE_FACE[v].name} voice.`}
              >
                <span className="ht__voice-head">
                  <span className="ht__voice-letter" aria-hidden="true">{VOICE_FACE[v].letter}</span>
                  <span className="ht__voice-stack">
                    <span className="ht__voice-name">{VOICE_FACE[v].name}</span>
                    <span className="ht__voice-face">{VOICE_FACE[v].descriptor}</span>
                  </span>
                  <span className="ht__voice-pip" aria-hidden="true">
                    <span className="ht__voice-pip-ring" />
                    <span className="ht__voice-pip-bead" />
                  </span>
                </span>
                <span className="ht__voice-sample" aria-hidden="true" style={stationStyle}>
                  {sampleText}
                </span>
              </button>
            )
          })}
        </div>
        <span className="ht__voices-hint" aria-hidden="true">
          <kbd>shift</kbd>
          <span aria-hidden="true">+</span>
          <kbd>v</kbd>
          <span className="ht__voices-hint-tag">to cycle the voice</span>
        </span>
      </div>

      <footer className="ht__foot" aria-hidden="true">
        <span className="ht__foot-cell">
          <span className="ht__foot-key">marked at</span>
          <span className="ht__foot-value">
            <em>{displayText(WORD_LABEL[word])}</em>
            <span className="ht__foot-mark-tag">{WORD_KIND[word]}</span>
          </span>
        </span>
        <span className="ht__foot-bead" aria-hidden="true">
          <svg viewBox="0 0 8 8"><circle cx="4" cy="4" r="1.4" fill="currentColor" /></svg>
        </span>
        <span className="ht__foot-cell">
          <span className="ht__foot-key">in voice</span>
          <span className="ht__foot-value">
            <em>{face.name}</em>
            <span className="ht__foot-mark-tag">{face.letter}</span>
          </span>
        </span>
        <span className="ht__foot-bead" aria-hidden="true">
          <svg viewBox="0 0 8 8"><circle cx="4" cy="4" r="1.4" fill="currentColor" /></svg>
        </span>
        <span className="ht__foot-cell">
          <span className="ht__foot-key">set today</span>
          <span className="ht__foot-value"><em>{setToday}</em></span>
        </span>
      </footer>

      <span className="sr-only" aria-live="polite">
        {`Headline set in ${face.name}. Marked at ${WORD_LABEL[word]}, ${WORD_KIND[word]}. Set today ${setToday}.`}
      </span>
    </article>
  )
}