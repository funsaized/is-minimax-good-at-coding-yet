import { useEffect, useId, useRef, useState, type CSSProperties, type KeyboardEvent, type MutableRefObject } from 'react'
import type { VoiceId } from './Press'
import type { WordId } from './notes'

type QuestionMonumentProps = {
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
}

const VOICE_FACE: Record<VoiceId, VoiceFace> = {
  quiet: { letter: 'A', name: 'quiet cut', descriptor: 'serif · italic · close set', family: "'Iowan Old Style', 'Palatino Linotype', Georgia, serif", weight: 400, style: 'italic', tracking: '-.026em', uppercased: false },
  human: { letter: 'B', name: 'human hand', descriptor: 'serif · italic · a little warm', family: "'Iowan Old Style', 'Palatino Linotype', Georgia, serif", weight: 500, style: 'italic', tracking: '-.018em', uppercased: false },
  bold: { letter: 'C', name: 'bold signal', descriptor: 'sans · heavy · no apology', family: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif', weight: 850, style: 'normal', tracking: '-.054em', uppercased: true },
}

const VOICE_ORDER: VoiceId[] = ['quiet', 'human', 'bold']

const WORD_LINE: Record<WordId, string> = { m3: 'M3', good: 'good at', yet: 'yet' }
const WORD_NOTE: Record<WordId, string> = { m3: 'm³', good: 'good at', yet: 'yet?' }
const WORD_KIND: Record<WordId, string> = { m3: 'stet', good: 'caret', yet: 'query' }
const WORD_GLOSS: Record<WordId, string> = { m3: 'let it stand', good: 'make room', yet: 'protect the pause' }
const WORD_HEAD: Record<WordId, string> = { m3: 'the maker', good: 'the verb', yet: 'the pause' }

const PHRASE_ORDER: WordId[] = ['m3', 'good', 'yet']

export function QuestionMonument({
  voice,
  word,
  hover,
  setToday,
  onVoice,
  onWord,
  onHover,
  tokenRefs,
}: QuestionMonumentProps) {
  const baseId = useId().replace(/:/g, '')
  const grainId = `question-monument-grain-${baseId}`
  const sealGrainId = `question-monument-seal-grain-${baseId}`
  const ruleGrainId = `question-monument-rule-grain-${baseId}`
  const rootRef = useRef<HTMLElement>(null)
  const [revealed, setRevealed] = useState(false)
  const [impressing, setImpressing] = useState(false)
  const impressTimerRef = useRef<number | null>(null)
  const firstVoiceRef = useRef(true)
  const face = VOICE_FACE[voice]

  const titleStyle: CSSProperties = {
    fontFamily: face.family,
    fontWeight: face.weight,
    fontStyle: face.style,
    letterSpacing: face.tracking,
  }

  useEffect(() => {
    const node = rootRef.current
    if (!node) return
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
      { threshold: 0.16, rootMargin: '0px 0px -6% 0px' },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (firstVoiceRef.current) {
      firstVoiceRef.current = false
      return
    }
    setImpressing(true)
    if (impressTimerRef.current !== null) window.clearTimeout(impressTimerRef.current)
    impressTimerRef.current = window.setTimeout(() => {
      setImpressing(false)
      impressTimerRef.current = null
    }, 820)
    return () => {
      if (impressTimerRef.current !== null) {
        window.clearTimeout(impressTimerRef.current)
        impressTimerRef.current = null
      }
    }
  }, [voice])

  const handleWordKey = (event: KeyboardEvent<HTMLElement>, id: WordId) => {
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
    const label = face.uppercased ? WORD_LINE[id].toUpperCase() : WORD_LINE[id]
    return (
      <button
        key={`monument-token-${id}`}
        ref={node => {
          tokenRefs.current[id] = node
        }}
        type="button"
        className={`question-monument__token question-monument__token--${id} ${isMarked ? 'is-marked' : ''} ${isHover ? 'is-hover' : ''}`}
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
          handleWordKey(event, id)
        }}
        aria-pressed={isMarked}
        aria-label={`Mark the word ${WORD_NOTE[id]} · ${WORD_KIND[id]} · ${WORD_GLOSS[id]}.`}
      >
        <span className="question-monument__token-text" style={titleStyle}>{label}</span>
        <span className="question-monument__token-mark" aria-hidden="true">
          <span className="question-monument__token-mark-glyph">
            {id === 'm3' ? '⌇' : id === 'good' ? '∧' : '?'}
          </span>
          <span className="question-monument__token-mark-rule" />
        </span>
      </button>
    )
  }

  return (
    <figure
      ref={rootRef}
      className={`question-monument question-monument--${voice} question-monument--word-${word} ${revealed ? 'is-revealed' : ''} ${impressing ? 'is-impressing' : ''}`}
      aria-label={`The headline: is ${face.uppercased ? 'MINIMAX M3' : 'Minimax M3'} good at frontend yet?, set in the ${face.name} voice, marked at ${WORD_NOTE[word]} (${WORD_KIND[word]}).`}
    >
      <svg className="question-monument__defs" viewBox="0 0 1000 600" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <filter id={grainId} x="-2%" y="-12%" width="104%" height="124%">
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

      <span className="question-monument__paper" aria-hidden="true">
        <svg viewBox="0 0 1000 600" preserveAspectRatio="none">
          <rect x="0" y="0" width="1000" height="600" filter={`url(#${grainId})`} opacity=".07" />
        </svg>
      </span>

      <header className="question-monument__cap" aria-hidden="true">
        <span className="question-monument__cap-eyebrow">
          <span className="question-monument__cap-eyebrow-mark" />
          <span className="question-monument__cap-eyebrow-text">the headline</span>
          <span className="question-monument__cap-eyebrow-mark question-monument__cap-eyebrow-mark--alt" />
        </span>
        <span className="question-monument__cap-rule">
          <svg viewBox="0 0 240 6" preserveAspectRatio="none">
            <g filter={`url(#${ruleGrainId})`}>
              <path
                className="question-monument__cap-rule-stroke"
                d="M2 3c20-3 40 3 60 0s40-3 60 0 40 3 60 0 40-3 56 0"
                fill="none"
                stroke="currentColor"
                strokeWidth=".65"
                strokeLinecap="round"
                pathLength="100"
              />
            </g>
            <circle cx="238" cy="3" r="1.1" fill="currentColor" />
          </svg>
        </span>
        <span className="question-monument__cap-voice">
          <span className="question-monument__cap-voice-letter">{face.letter}</span>
          <span className="question-monument__cap-voice-name">{face.name}</span>
        </span>
      </header>

      <h2
        className={`question-monument__statement question-monument__statement--${voice}`}
        style={titleStyle}
        onClick={event => {
          if (event.target === event.currentTarget) {
            const idx = VOICE_ORDER.indexOf(voice)
            onVoice(VOICE_ORDER[(idx + 1) % VOICE_ORDER.length])
          }
        }}
        role="group"
        aria-label={`The headline set in ${face.name}, ${face.style === 'italic' ? 'italic' : 'upright'} ${face.family.split(',')[0].replace(/['"]/g, '').trim()}`}
      >
        <span className="question-monument__pressmark" aria-hidden="true">
          <svg viewBox="0 0 280 6" preserveAspectRatio="none">
            <path d="M2 3c40-3 80 3 120 0s80-3 120 0 36 3 36 0" fill="none" stroke="currentColor" strokeWidth=".7" strokeLinecap="round" className="question-monument__pressmark-stroke" />
            <circle cx="276" cy="3" r="1.1" fill="currentColor" className="question-monument__pressmark-bead" />
          </svg>
        </span>

        <span className="question-monument__line question-monument__line--a">
          <span className="question-monument__line-lead">is</span>
          {renderToken('m3')}
        </span>

        <span className="question-monument__line question-monument__line--b">
          {renderToken('good')}
          <span className="question-monument__line-mid">frontend</span>
        </span>

        <span className="question-monument__line question-monument__line--c">
          {renderToken('yet')}
          <span className="question-monument__query" aria-hidden="true">
            <span className="question-monument__query-mark">?</span>
            <span className="question-monument__query-kiss">
              <span className="question-monument__query-kiss-bead" />
              <span className="question-monument__query-kiss-wisp" />
            </span>
          </span>
        </span>
      </h2>

      <span className="question-monument__seal" aria-hidden="true">
        <span className="question-monument__seal-disc">
          <svg viewBox="0 0 64 64">
            <g filter={`url(#${sealGrainId})`} opacity=".95">
              <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeWidth="1" />
              <circle cx="32" cy="32" r="22" fill="none" stroke="currentColor" strokeWidth=".35" strokeDasharray=".8 1.6" opacity=".7" />
              <circle cx="32" cy="32" r="14" fill="none" stroke="currentColor" strokeWidth=".4" opacity=".55" />
              <text x="32" y="38" textAnchor="middle" fontFamily="'Iowan Old Style', Georgia, serif" fontStyle="italic" fontSize="22" letterSpacing=".04em" fill="currentColor">m³</text>
              <path d="M32 6 L32 12 M32 52 L32 58 M6 32 L12 32 M52 32 L58 32" stroke="currentColor" strokeWidth=".55" strokeLinecap="round" opacity=".65" />
            </g>
          </svg>
        </span>
        <span className="question-monument__seal-tag">
          <span className="question-monument__seal-tag-key">voice</span>
          <em>{face.letter}</em>
        </span>
      </span>

      <span className="question-monument__exhale" aria-hidden="true">
        <span className="question-monument__exhale-rule">
          <svg viewBox="0 0 600 8" preserveAspectRatio="none">
            <g filter={`url(#${ruleGrainId})`}>
              <path
                className="question-monument__exhale-stroke question-monument__exhale-stroke--lead"
                d="M2 4c40-3 80 3 120 0s120-3 180 0s120 3 180 0s40-3 76 0"
                fill="none"
                stroke="currentColor"
                strokeWidth=".85"
                strokeLinecap="round"
                pathLength="100"
              />
              <path
                className="question-monument__exhale-stroke question-monument__exhale-stroke--trail"
                d="M40 7c24-3 48 3 72 0s48-3 72 0 48 3 72-1 48-3 72-1 48 3 72-1 48-3 72-1 24-2 24-2"
                fill="none"
                stroke="currentColor"
                strokeWidth=".4"
                strokeLinecap="round"
                opacity=".55"
                pathLength="100"
              />
            </g>
            <circle className="question-monument__exhale-bead" cx="596" cy="4" r="1.6" fill="currentColor" />
          </svg>
        </span>
        <span className="question-monument__exhale-tag">
          <span className="question-monument__exhale-tag-mark" />
          <em>the question, exhaling across the page</em>
        </span>
      </span>

      <footer className="question-monument__foot" aria-hidden="true">
        <div className="question-monument__voices" role="group" aria-label="Cycle the voice of the headline">
          {VOICE_ORDER.map(v => {
            const isActive = v === voice
            return (
              <button
                key={`monument-voice-${v}`}
                type="button"
                className={`question-monument__voice question-monument__voice--${v} ${isActive ? 'is-active' : ''}`}
                onClick={() => onVoice(v)}
                onKeyDown={event => {
                  const idx = VOICE_ORDER.indexOf(v)
                  if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
                    event.preventDefault()
                    onVoice(VOICE_ORDER[(idx + 1) % VOICE_ORDER.length])
                  } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
                    event.preventDefault()
                    onVoice(VOICE_ORDER[(idx - 1 + VOICE_ORDER.length) % VOICE_ORDER.length])
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
                <span className="question-monument__voice-letter">{VOICE_FACE[v].letter}</span>
                <span className="question-monument__voice-stack">
                  <span className="question-monument__voice-name">{VOICE_FACE[v].name}</span>
                  <span className="question-monument__voice-face">{VOICE_FACE[v].descriptor}</span>
                </span>
                <span className="question-monument__voice-now">
                  {isActive ? (
                    <>
                      <span className="question-monument__voice-now-dot" />
                      <span>now</span>
                    </>
                  ) : (
                    <span className="question-monument__voice-now-tag">set</span>
                  )}
                </span>
              </button>
            )
          })}
        </div>

        <div className="question-monument__meta">
          <span className="question-monument__meta-cell question-monument__meta-cell--marked">
            <span className="question-monument__meta-key">marked at</span>
            <span className="question-monument__meta-value">
              <em>{face.uppercased ? WORD_NOTE[word].toUpperCase() : WORD_NOTE[word]}</em>
              <span className="question-monument__meta-mark-tag">{WORD_KIND[word]}</span>
            </span>
          </span>
          <span className="question-monument__meta-bead" aria-hidden="true">
            <svg viewBox="0 0 8 8">
              <circle cx="4" cy="4" r="1.2" fill="currentColor" />
            </svg>
          </span>
          <span className="question-monument__meta-cell question-monument__meta-cell--set">
            <span className="question-monument__meta-key">set today</span>
            <em className="question-monument__meta-value">{setToday}</em>
          </span>
          <span className="question-monument__meta-bead" aria-hidden="true">
            <svg viewBox="0 0 8 8">
              <circle cx="4" cy="4" r="1.2" fill="currentColor" />
            </svg>
          </span>
          <span className="question-monument__meta-cell question-monument__meta-cell--cycle">
            <span className="question-monument__meta-key">cycle the voice</span>
            <span className="question-monument__meta-value">
              <kbd>shift</kbd><span aria-hidden="true">+</span><kbd>v</kbd>
            </span>
          </span>
        </div>
      </footer>

      <span className="sr-only" aria-live="polite">
        {`Headline set in ${face.name}. Marked at ${WORD_NOTE[word]}, ${WORD_KIND[word]}. Set today ${setToday}.`}
      </span>
    </figure>
  )
}