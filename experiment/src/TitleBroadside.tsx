import { useEffect, useId, useRef, useState, type CSSProperties, type KeyboardEvent, type MutableRefObject } from 'react'
import type { VoiceId } from './Press'
import type { WordId } from './notes'
import { PressStamp } from './PressStamp'

type TitleBroadsideProps = {
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
  lineHeight: number
  sizeScalar: number
  inkHint: string
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
    lineHeight: 1.04,
    sizeScalar: 0.92,
    inkHint: 'the page holds its breath',
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
    lineHeight: 1.04,
    sizeScalar: 1.02,
    inkHint: 'set by hand, then read aloud',
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
    lineHeight: 0.98,
    sizeScalar: 1.18,
    inkHint: 'set without apology, then read it once',
  },
}

const VOICE_ORDER: VoiceId[] = ['quiet', 'human', 'bold']

const WORD_KIND: Record<WordId, string> = { m3: 'stet', good: 'caret', yet: 'query' }
const WORD_GLOSS: Record<WordId, string> = { m3: 'let it stand', good: 'make room', yet: 'protect the pause' }
const WORD_HEAD: Record<WordId, string> = { m3: 'the maker', good: 'the verb', yet: 'the pause' }
const WORD_LABEL: Record<WordId, string> = { m3: 'M3', good: 'good at', yet: 'yet?' }
const WORD_GLYPH: Record<WordId, string> = { m3: '⌇', good: '∧', yet: '?' }

const OPERATOR_NOTE: Record<VoiceId, string> = {
  quiet: 'set in close-set italic, then read it once aloud',
  human: 'set in a hand that learned its warmth',
  bold: 'set without apology, then read it like a poster',
}

const SIGN_OFF: Record<VoiceId, { mark: string; note: string }> = {
  quiet: { mark: '—m³', note: 'composed once · read twice' },
  human: { mark: '—m³', note: 'a hand, learning its warmth' },
  bold: { mark: '—M³', note: 'set without apology' },
}

const SEASON = (() => {
  const month = new Date().getMonth()
  if (month <= 1 || month === 11) return 'winter'
  if (month <= 4) return 'spring'
  if (month <= 7) return 'summer'
  return 'autumn'
})()

const PHRASE_ORDER: WordId[] = ['m3', 'good', 'yet']

export function TitleBroadside({
  voice,
  word,
  hover,
  setToday,
  onVoice,
  onWord,
  onHover,
  tokenRefs,
}: TitleBroadsideProps) {
  const baseId = useId().replace(/:/g, '')
  const grainId = `title-broadside-grain-${baseId}`
  const sealGrainId = `title-broadside-seal-grain-${baseId}`
  const ruleGrainId = `title-broadside-rule-grain-${baseId}`
  const rootRef = useRef<HTMLElement>(null)
  const [revealed, setRevealed] = useState(false)
  const [stamping, setStamping] = useState(false)
  const stampTimerRef = useRef<number | null>(null)
  const firstVoiceRef = useRef(true)
  const face = VOICE_FACE[voice]

  const headlineStyle: CSSProperties = {
    fontFamily: face.family,
    fontWeight: face.weight,
    fontStyle: face.style,
    letterSpacing: face.tracking,
    lineHeight: face.lineHeight,
    fontSize: `calc(clamp(48px, 8.4vw, 112px) * ${face.sizeScalar})`,
  }

  const staticStyle: CSSProperties = {
    fontFamily: face.family,
    fontWeight: face.weight,
    fontStyle: face.style,
    letterSpacing: face.tracking,
    lineHeight: face.lineHeight,
    fontSize: `calc(clamp(48px, 8.4vw, 112px) * ${face.sizeScalar})`,
  }

  const toneStyle: Record<string, string> = {
    '--tb-tone': `var(--tb-tone-${voice})`,
    '--tb-tone-quiet': 'var(--blue)',
    '--tb-tone-human': 'var(--coral)',
    '--tb-tone-bold': 'var(--acid)',
  }

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
    }, 760)
    return () => {
      if (stampTimerRef.current !== null) {
        window.clearTimeout(stampTimerRef.current)
        stampTimerRef.current = null
      }
    }
  }, [voice])

  const onWordKey = (event: KeyboardEvent<HTMLElement>, id: WordId) => {
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

  const renderToken = (id: WordId) => {
    const isMarked = word === id
    const isHover = hover === id
    const label = face.uppercased ? WORD_LABEL[id].toUpperCase() : WORD_LABEL[id]
    return (
      <button
        key={`tb-token-${id}`}
        ref={node => {
          tokenRefs.current[id] = node
        }}
        type="button"
        className={`tb__token tb__token--${id} ${isMarked ? 'is-marked' : ''} ${isHover ? 'is-hover' : ''}`}
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
        <span className="tb__token-text" style={staticStyle}>{label}</span>
        <span className="tb__token-mark" aria-hidden="true">
          <span className="tb__token-mark-rule" />
          <span className="tb__token-mark-tag">
            <span className="tb__token-mark-glyph">{WORD_GLYPH[id]}</span>
            <span className="tb__token-mark-name">{WORD_KIND[id]}</span>
          </span>
        </span>
      </button>
    )
  }

  return (
    <article
      ref={rootRef}
      className={`tb tb--${voice} tb--word-${word} ${revealed ? 'is-revealed' : ''} ${stamping ? 'is-stamping' : ''}`}
      style={toneStyle}
      aria-label={`The title broadside · folio i · the question · set in ${face.name} · marked at ${WORD_LABEL[word]} (${WORD_KIND[word]}) · ${setToday}.`}
    >
      <svg className="tb__defs" viewBox="0 0 1200 1200" preserveAspectRatio="none" aria-hidden="true">
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
          <filter id={sealGrainId} x="-12%" y="-12%" width="124%" height="124%">
            <feTurbulence type="fractalNoise" baseFrequency="2.6" numOctaves="2" seed="11" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .55 0" />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
        </defs>
      </svg>

      <span className="tb__paper" aria-hidden="true">
        <svg viewBox="0 0 1200 1200" preserveAspectRatio="none">
          <rect x="0" y="0" width="1200" height="1200" filter={`url(#${grainId})`} opacity=".06" />
        </svg>
      </span>

      <div className="tb__band" aria-hidden="false">
        <h2 className="sr-only">{`is Minimax M3 good at frontend yet? — folio i — the question`}</h2>
        <span className="tb__band-mark tb__band-mark--lead" aria-hidden="true">
          <svg viewBox="0 0 80 12" preserveAspectRatio="none">
            <g filter={`url(#${ruleGrainId})`}>
              <path
                className="tb__band-mark-stroke tb__band-mark-stroke--lead"
                d="M2 6c12-2 24 2 36 0s24-2 36 0 6 2 6 0"
                fill="none"
                stroke="currentColor"
                strokeWidth=".55"
                strokeLinecap="round"
                pathLength="100"
              />
            </g>
            <circle cx="2" cy="6" r=".9" fill="currentColor" opacity=".8" />
            <circle cx="78" cy="6" r=".9" fill="currentColor" opacity=".8" />
          </svg>
        </span>
        <span className="tb__band-folio" aria-hidden="false">
          <span className="tb__band-folio-key">folio</span>
          <em className="tb__band-folio-num">i</em>
          <span className="tb__band-folio-sep" aria-hidden="true">·</span>
          <span className="tb__band-folio-line">the question</span>
        </span>
        <span className="tb__band-pivot" aria-hidden="true">
          <span className="tb__band-pivot-rule tb__band-pivot-rule--lead" />
          <span className="tb__band-pivot-bead" />
          <span className="tb__band-pivot-glyph" aria-hidden="true">{face.uppercased ? '◆' : '✦'}</span>
          <span className="tb__band-pivot-bead tb__band-pivot-bead--alt" />
          <span className="tb__band-pivot-rule tb__band-pivot-rule--trail" />
        </span>
        <span className="tb__band-set" aria-hidden="false">
          <span className="tb__band-set-key">set</span>
          <em className="tb__band-set-today">today</em>
          <span className="tb__band-set-sep" aria-hidden="true">·</span>
          <span className="tb__band-set-date">{setToday}</span>
          <span className="tb__band-set-meta" aria-hidden="true">
            <span className="tb__band-set-meta-dot" />
            <em>{SEASON}</em>
            <span className="tb__band-set-meta-dot tb__band-set-meta-dot--alt" />
          </span>
        </span>
        <span className="tb__band-mark tb__band-mark--trail" aria-hidden="true">
          <svg viewBox="0 0 80 12" preserveAspectRatio="none">
            <g filter={`url(#${ruleGrainId})`}>
              <path
                className="tb__band-mark-stroke tb__band-mark-stroke--trail"
                d="M2 6c6-2 14 2 24 0s18-2 24 0 22 2 24 0"
                fill="none"
                stroke="currentColor"
                strokeWidth=".55"
                strokeLinecap="round"
                opacity=".7"
                pathLength="100"
              />
            </g>
            <circle cx="2" cy="6" r=".9" fill="currentColor" opacity=".6" />
            <circle cx="78" cy="6" r=".9" fill="currentColor" opacity=".6" />
          </svg>
        </span>
      </div>

      <span className="tb__signature" aria-hidden="true">
        <span className="tb__signature-monogram">
          <svg viewBox="0 0 84 84" preserveAspectRatio="xMidYMid meet">
            <g filter={`url(#${sealGrainId})`} opacity=".94">
              <circle cx="42" cy="42" r="36" fill="none" stroke="currentColor" strokeWidth=".75" />
              <circle cx="42" cy="42" r="29" fill="none" stroke="currentColor" strokeWidth=".35" strokeDasharray=".9 1.8" opacity=".75" />
              <circle cx="42" cy="42" r="20" fill="none" stroke="currentColor" strokeWidth=".3" opacity=".55" />
              <path
                d="M42 8 L42 14 M42 70 L42 76 M8 42 L14 42 M70 42 L76 42"
                stroke="currentColor"
                strokeWidth=".5"
                strokeLinecap="round"
                opacity=".55"
              />
              <text
                x="42"
                y="51"
                textAnchor="middle"
                fontFamily="'Iowan Old Style', Georgia, serif"
                fontStyle="italic"
                fontSize="28"
                letterSpacing="-.06em"
                fill="currentColor"
              >m³</text>
            </g>
          </svg>
        </span>
        <span className="tb__signature-stack">
          <span className="tb__signature-line tb__signature-line--top">
            <span className="tb__signature-bead" />
            <em>m³ press</em>
          </span>
          <span className="tb__signature-line tb__signature-line--mid">
            <span className="tb__signature-rule tb__signature-rule--lead" />
            <em>folio i</em>
            <span className="tb__signature-rule" />
            <em>the question</em>
            <span className="tb__signature-rule tb__signature-rule--trail" />
          </span>
          <span className="tb__signature-line tb__signature-line--date">
            <span className="tb__signature-date">{setToday}</span>
            <span className="tb__signature-meta" aria-hidden="true">
              <span className="tb__signature-meta-dot" />
              {SEASON}
              <span className="tb__signature-meta-dot tb__signature-meta-dot--alt" />
            </span>
          </span>
        </span>
      </span>

      <span className="tb__plate" aria-hidden="true">
        <span className="tb__plate-corner tb__plate-corner--tl" />
        <span className="tb__plate-corner tb__plate-corner--tr" />
        <span className="tb__plate-corner tb__plate-corner--bl" />
        <span className="tb__plate-corner tb__plate-corner--br" />
      </span>

      <div className="tb__seal" aria-hidden="true">
        <span className="tb__seal-halo" />
        <span className="tb__seal-disc">
          <PressStamp voice={voice} size={104} />
        </span>
        <span className="tb__seal-tag">
          <span className="tb__seal-tag-key">voice</span>
          <span className="tb__seal-tag-letter">{face.letter}</span>
        </span>
      </div>

      <div className="tb__statement">
        <h3 className="tb__statement-lines">
          <span className="tb__line tb__line--a">
            <span className="tb__statement-lead" style={headlineStyle}>is</span>
            {renderToken('m3')}
          </span>
          <span className="tb__line tb__line--b">
            {renderToken('good')}
            <span className="tb__statement-static" style={staticStyle}>{face.uppercased ? 'FRONTEND' : 'frontend'}</span>
          </span>
          <span className="tb__line tb__line--c">
            {renderToken('yet')}
          </span>
        </h3>

        <span className="tb__signoff" aria-hidden="true">
          <span className="tb__signoff-curve">
            <svg viewBox="0 0 200 14" preserveAspectRatio="none">
              <g filter={`url(#${ruleGrainId})`}>
                <path
                  className="tb__signoff-curve-stroke"
                  d="M2 8c18-6 36 4 54 0s36-4 54 0 36 4 54 0 18-4 36 0"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth=".9"
                  strokeLinecap="round"
                  pathLength="100"
                />
              </g>
              <circle className="tb__signoff-curve-bead" cx="198" cy="7" r="1.2" fill="currentColor" />
            </svg>
          </span>
          <span className="tb__signoff-mark">{SIGN_OFF[voice].mark}</span>
          <span className="tb__signoff-note">{SIGN_OFF[voice].note}</span>
        </span>
      </div>

      <span className="tb__rule" aria-hidden="true">
        <svg viewBox="0 0 460 6" preserveAspectRatio="none">
          <g filter={`url(#${ruleGrainId})`}>
            <path
              className="tb__rule-lead"
              d="M2 3c30-2 60 2 90 0s60-2 90 0 60 2 90 0 60-2 90 0 30 2 50 0 30-2 48 0"
              fill="none"
              stroke="currentColor"
              strokeWidth=".7"
              strokeLinecap="round"
              pathLength="100"
            />
          </g>
          <circle className="tb__rule-mark" cx="230" cy="3" r="2.2" fill="currentColor" />
        </svg>
      </span>

      <p className="tb__operator" aria-label={`Operator's note · ${OPERATOR_NOTE[voice]}`}>
        <span className="tb__operator-mark" aria-hidden="true">¶</span>
        <em className="tb__operator-line">{OPERATOR_NOTE[voice]}</em>
      </p>

      <span className="tb__exhale" aria-hidden="true">
        <svg viewBox="0 0 600 8" preserveAspectRatio="none">
          <g filter={`url(#${ruleGrainId})`}>
            <path className="tb__exhale-lead" d="M2 4c40-3 80 3 120 0s120-3 180 0 120 3 180 0 40-3 76 0" fill="none" stroke="currentColor" strokeWidth=".85" strokeLinecap="round" pathLength="100" />
            <path className="tb__exhale-trail" d="M40 7c24-3 48 3 72 0s48-3 72 0 48 3 72-1 48-3 72-1 48 3 72-1 48-3 72-1 24-2 24-2" fill="none" stroke="currentColor" strokeWidth=".4" strokeLinecap="round" opacity=".55" pathLength="100" />
          </g>
          <circle className="tb__exhale-bead" cx="596" cy="4" r="1.6" fill="currentColor" />
        </svg>
        <span className="tb__exhale-tag">
          <span className="tb__exhale-tag-mark" />
          <em>the question, exhaling across the page</em>
        </span>
      </span>

      <div className="tb__voices" role="group" aria-label="Voice selector · three settings for the headline">
        <span className="tb__voices-key">set the line in</span>
        <div className="tb__voices-stations">
          {VOICE_ORDER.map((v, idx) => {
            const isActive = v === voice
            return (
              <button
                key={`tb-voice-${v}`}
                type="button"
                className={`tb__voice tb__voice--${v} ${isActive ? 'is-active' : ''}`}
                data-station-index={idx}
                onClick={() => onVoice(v)}
                onKeyDown={event => {
                  const i = VOICE_ORDER.indexOf(v)
                  if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
                    event.preventDefault()
                    onVoice(VOICE_ORDER[(i + 1) % VOICE_ORDER.length])
                  } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
                    event.preventDefault()
                    onVoice(VOICE_ORDER[(i - 1 + VOICE_ORDER.length) % VOICE_ORDER.length])
                  } else if (event.key === 'Home') {
                    event.preventDefault()
                    onVoice('quiet')
                  } else if (event.key === 'End') {
                    event.preventDefault()
                    onVoice('bold')
                  }
                }}
                aria-pressed={isActive}
                tabIndex={isActive ? 0 : -1}
                aria-label={`Set the headline in the ${VOICE_FACE[v].name} voice.`}
              >
                <span className="tb__voice-letter" aria-hidden="true">{VOICE_FACE[v].letter}</span>
                <span className="tb__voice-stack">
                  <span className="tb__voice-name">{VOICE_FACE[v].name}</span>
                  <span className="tb__voice-face">{VOICE_FACE[v].descriptor}</span>
                </span>
                <span className="tb__voice-pip" aria-hidden="true">
                  <span className="tb__voice-pip-ring" />
                  <span className="tb__voice-pip-bead" />
                </span>
              </button>
            )
          })}
          <span
            className="tb__voice-wax is-set"
            aria-hidden="true"
            style={{ left: `calc((100% / 3) * (${VOICE_ORDER.indexOf(voice)} + 0.5))` }}
          >
            <span className="tb__voice-wax-bead" />
          </span>
        </div>
        <span className="tb__voices-hint" aria-hidden="true">
          <kbd>shift</kbd><span>+</span><kbd>v</kbd>
          <span className="tb__voices-hint-tag">to cycle the voice</span>
        </span>
      </div>

      <footer className="tb__foot" aria-hidden="true">
        <span className="tb__foot-cell">
          <span className="tb__foot-key">marked at</span>
          <span className="tb__foot-value">
            <em>{face.uppercased ? WORD_LABEL[word].toUpperCase() : WORD_LABEL[word]}</em>
            <span className="tb__foot-mark-tag">{WORD_KIND[word]}</span>
          </span>
          <span className="tb__foot-gloss">{WORD_HEAD[word]} <em>·</em> {WORD_GLOSS[word]}</span>
        </span>
        <span className="tb__foot-bead" aria-hidden="true">
          <svg viewBox="0 0 8 8"><circle cx="4" cy="4" r="1.4" fill="currentColor" /></svg>
        </span>
        <span className="tb__foot-cell">
          <span className="tb__foot-key">in voice</span>
          <span className="tb__foot-value">
            <em>{face.name}</em>
            <span className="tb__foot-mark-tag">{face.letter}</span>
          </span>
          <span className="tb__foot-gloss">{face.descriptor}</span>
        </span>
        <span className="tb__foot-bead" aria-hidden="true">
          <svg viewBox="0 0 8 8"><circle cx="4" cy="4" r="1.4" fill="currentColor" /></svg>
        </span>
        <span className="tb__foot-cell">
          <span className="tb__foot-key">set today</span>
          <span className="tb__foot-value"><em>{setToday}</em></span>
          <span className="tb__foot-gloss">folio <em>i</em> <span>·</span> {SEASON}</span>
        </span>
      </footer>

      <span className="sr-only" aria-live="polite">
        {`Headline set in ${face.name}. Marked at ${WORD_LABEL[word]}, ${WORD_KIND[word]}. Set today ${setToday}.`}
      </span>
    </article>
  )
}
