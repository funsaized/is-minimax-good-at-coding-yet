import { useId, type CSSProperties, type KeyboardEvent, type MutableRefObject } from 'react'
import type { VoiceId } from './Press'
import type { WordId } from './notes'

type TitleLineProps = {
  voice: VoiceId
  word: WordId
  hover: WordId | null
  setToday: string
  onVoice: (voice: VoiceId) => void
  onWord: (word: WordId, focus?: boolean) => void
  onHover: (word: WordId | null) => void
  tokenRefs: MutableRefObject<Partial<Record<WordId, HTMLSpanElement | null>>>
}

type Display = {
  fontFamily: string
  fontWeight: number
  fontStyle: 'normal' | 'italic'
  tracking: string
  uppercased: boolean
}

const DISPLAY: Record<VoiceId, Display> = {
  quiet: { fontFamily: "'Iowan Old Style', 'Palatino Linotype', Georgia, serif", fontWeight: 400, fontStyle: 'italic', tracking: '-0.028em', uppercased: false },
  human: { fontFamily: "'Iowan Old Style', 'Palatino Linotype', Georgia, serif", fontWeight: 500, fontStyle: 'italic', tracking: '-0.022em', uppercased: false },
  bold: { fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif', fontWeight: 850, fontStyle: 'normal', tracking: '-0.062em', uppercased: true },
}

const VOICE_TONE: Record<VoiceId, string> = {
  quiet: 'var(--blue)',
  human: 'var(--coral)',
  bold: 'var(--acid)',
}

const VOICE_NAME: Record<VoiceId, string> = { quiet: 'quiet cut', human: 'human hand', bold: 'bold signal' }
const VOICE_LETTER: Record<VoiceId, string> = { quiet: 'A', human: 'B', bold: 'C' }
const VOICE_DESCRIPTOR: Record<VoiceId, string> = {
  quiet: 'serif · italic · close set',
  human: 'serif · italic · a little warm',
  bold: 'sans · heavy · no apology',
}

const WORD_LABEL: Record<WordId, string> = { m3: 'M3', good: 'good at', yet: 'yet' }
const TOKEN_TEXT: Record<WordId, string> = { m3: 'M3', good: 'good at', yet: 'yet' }
const WORD_MARK: Record<WordId, string> = { m3: 'stet', good: 'caret', yet: 'query' }
const WORD_KIND: Record<WordId, string> = { m3: 'let it stand', good: 'make room', yet: 'protect the pause' }
const WORD_KIND_SHORT: Record<WordId, string> = { m3: 'let stand', good: 'make room', yet: 'protect pause' }

const ORDER: VoiceId[] = ['quiet', 'human', 'bold']
const WORDS: WordId[] = ['m3', 'good', 'yet']

function ProofGlyph({ id, active, tone }: { id: WordId; active: boolean; tone: string }) {
  const baseId = useId().replace(/:/g, '')
  const grainId = `titleline-proof-grain-${id}-${baseId}`
  const activeClass = active ? 'is-active' : 'is-quiet'

  if (id === 'm3') {
    return (
      <svg className={`titleline__proof-svg titleline__proof-svg--stet ${activeClass}`} viewBox="0 0 80 24" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        <defs>
          <filter id={grainId} x="-6%" y="-12%" width="112%" height="124%">
            <feTurbulence type="fractalNoise" baseFrequency="2.4" numOctaves="2" seed="29" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .5 0" />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
        </defs>
        <g filter={`url(#${grainId})`} style={{ color: tone } as CSSProperties}>
          <path d="M6 12 L62 12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" pathLength="100" className="titleline__proof-stet-stroke" />
          <circle cx="6" cy="12" r="1.6" fill="currentColor" className="titleline__proof-bead titleline__proof-bead--lead" />
          <circle cx="62" cy="12" r="1.6" fill="currentColor" className="titleline__proof-bead titleline__proof-bead--trail" />
          <path d="M66 7 L72 12 L66 17 L60 12 Z" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" opacity=".85" className="titleline__proof-arrow" />
        </g>
      </svg>
    )
  }

  if (id === 'good') {
    return (
      <svg className={`titleline__proof-svg titleline__proof-svg--caret ${activeClass}`} viewBox="0 0 80 24" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        <defs>
          <filter id={grainId} x="-6%" y="-12%" width="112%" height="124%">
            <feTurbulence type="fractalNoise" baseFrequency="2.4" numOctaves="2" seed="31" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .5 0" />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
        </defs>
        <g filter={`url(#${grainId})`} style={{ color: tone } as CSSProperties}>
          <path d="M6 22 C 22 22, 36 8, 56 8" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" pathLength="100" className="titleline__proof-caret-curve" />
          <path d="M50 2 L62 8 L54 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className="titleline__proof-caret-point" />
          <circle cx="62" cy="8" r="1.6" fill="currentColor" className="titleline__proof-bead titleline__proof-bead--lead" />
        </g>
      </svg>
    )
  }

  return (
    <svg className={`titleline__proof-svg titleline__proof-svg--query ${activeClass}`} viewBox="0 0 80 24" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      <defs>
        <filter id={grainId} x="-6%" y="-12%" width="112%" height="124%">
          <feTurbulence type="fractalNoise" baseFrequency="2.4" numOctaves="2" seed="37" stitchTiles="stitch" />
          <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .5 0" />
          <feComposite in2="SourceGraphic" operator="in" />
        </filter>
      </defs>
      <g filter={`url(#${grainId})`} style={{ color: tone } as CSSProperties}>
        <circle cx="20" cy="11" r="8" fill="none" stroke="currentColor" strokeWidth="1.2" className="titleline__proof-query-ring" />
        <path d="M18 8 C 18 4, 23 4, 23 8 C 23 11, 20 11, 20 14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" pathLength="100" className="titleline__proof-query-hook" />
        <circle cx="20" cy="17.5" r="1.4" fill="currentColor" className="titleline__proof-query-dot" />
      </g>
    </svg>
  )
}

function HeadlineWord({
  id,
  text,
  marked,
  hover,
  display,
  onSelect,
  onHover,
  onLeave,
  tokenRef,
}: {
  id: WordId
  text: string
  marked: boolean
  hover: boolean
  display: Display
  onSelect: (id: WordId) => void
  onHover: (id: WordId) => void
  onLeave: () => void
  tokenRef: (node: HTMLSpanElement | null) => void
}) {
  const label = display.uppercased ? text.toUpperCase() : text
  const style: CSSProperties = {
    fontFamily: display.fontFamily,
    fontWeight: display.fontWeight,
    fontStyle: display.fontStyle,
    letterSpacing: display.tracking,
  }
  return (
    <span
      ref={tokenRef}
      className={`titleline__token titleline__token--${id} ${marked ? 'is-marked' : ''} ${hover ? 'is-hover' : ''}`}
      style={style}
      data-word={id}
      role="button"
      tabIndex={0}
      aria-pressed={marked}
      aria-label={`Mark the word ${text} on the title`}
      onClick={(event) => {
        event.stopPropagation()
        onSelect(id)
      }}
      onMouseEnter={() => onHover(id)}
      onMouseLeave={onLeave}
      onFocus={() => onHover(id)}
      onBlur={onLeave}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onSelect(id)
        }
      }}
    >
      <span className="titleline__token-text">{label}</span>
      <span className="titleline__token-mark" aria-hidden="true">
        <span className="titleline__token-mark-line" />
      </span>
    </span>
  )
}

export function TitleLine({
  voice,
  word,
  hover,
  setToday,
  onVoice,
  onWord,
  onHover,
  tokenRefs,
}: TitleLineProps) {
  const baseId = useId().replace(/:/g, '')
  const grainId = `titleline-grain-${baseId}`
  const display = DISPLAY[voice]
  const tone = VOICE_TONE[voice]
  const style = {
    '--titleline-tone': tone,
    '--titleline-grain': `url(#${grainId})`,
  } as CSSProperties
  const voiceIndex = ORDER.indexOf(voice)

  const handleWordKey = (event: KeyboardEvent<HTMLElement>, id: WordId) => {
    const idx = WORDS.indexOf(id)
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault()
      const next = WORDS[(idx + 1) % WORDS.length]
      onWord(next)
      window.requestAnimationFrame(() => tokenRefs.current[next]?.focus())
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault()
      const next = WORDS[(idx - 1 + WORDS.length) % WORDS.length]
      onWord(next)
      window.requestAnimationFrame(() => tokenRefs.current[next]?.focus())
    } else if (event.key === 'Home') {
      event.preventDefault()
      onWord('m3')
      window.requestAnimationFrame(() => tokenRefs.current.m3?.focus())
    } else if (event.key === 'End') {
      event.preventDefault()
      onWord('yet')
      window.requestAnimationFrame(() => tokenRefs.current.yet?.focus())
    }
  }

  const cycleVoice = (direction: 1 | -1) => {
    const next = ORDER[(voiceIndex + direction + ORDER.length) % ORDER.length]
    onVoice(next)
  }

  return (
    <figure
      className={`titleline titleline--${voice} titleline--word-${word}`}
      style={style}
      aria-label={`The headline: is M3 good at frontend yet?, set in the ${VOICE_NAME[voice]} voice, marked at ${WORD_LABEL[word]} (${WORD_MARK[word]}).`}
    >
      <svg className="titleline__defs" viewBox="0 0 1000 200" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <filter id={grainId} x="-2%" y="-12%" width="104%" height="124%">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="41" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 .14  0 0 0 0 .12  0 0 0 0 .19  0 0 0 .06 0" />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
        </defs>
      </svg>

      <header className="titleline__running" aria-hidden="true">
        <span className="titleline__running-cell">
          <span className="titleline__running-mark" />
          <em>the headline</em>
        </span>
        <span className="titleline__running-rule" />
        <span className="titleline__running-cell titleline__running-cell--voice">
          <span className={`titleline__running-voice-letter titleline__running-voice-letter--${voice}`}>{VOICE_LETTER[voice]}</span>
          <span className="titleline__running-voice-name">{VOICE_NAME[voice]}</span>
        </span>
        <span className="titleline__running-rule" />
        <span className="titleline__running-cell">
          <em className="titleline__running-set">set today</em>
          <span className="titleline__running-set-sep" aria-hidden="true">·</span>
          <span className="titleline__running-set-value">{setToday}</span>
        </span>
      </header>

      <h2
        className={`titleline__headline titleline__headline--${voice}`}
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            const next = ORDER[(voiceIndex + 1) % ORDER.length]
            onVoice(next)
          }
        }}
        role="group"
        aria-label={`The headline set in ${VOICE_NAME[voice]}, ${display.fontStyle === 'italic' ? 'italic' : 'upright'} ${display.fontFamily.split(',')[0].replace(/['"]/g, '').trim()}`}
      >
        <span className="titleline__line titleline__line--a">
          <span className="titleline__line-lead">is</span>
          <HeadlineWord
            id="m3"
            text={TOKEN_TEXT.m3}
            marked={word === 'm3'}
            hover={hover === 'm3'}
            display={display}
            onSelect={(id) => onWord(id)}
            onHover={onHover}
            onLeave={() => onHover(null)}
            tokenRef={(node) => {
              tokenRefs.current.m3 = node
            }}
          />
        </span>
        <span className="titleline__line titleline__line--b">
          <HeadlineWord
            id="good"
            text={TOKEN_TEXT.good}
            marked={word === 'good'}
            hover={hover === 'good'}
            display={display}
            onSelect={(id) => onWord(id)}
            onHover={onHover}
            onLeave={() => onHover(null)}
            tokenRef={(node) => {
              tokenRefs.current.good = node
            }}
          />
          <span className="titleline__line-mid">frontend</span>
        </span>
        <span className="titleline__line titleline__line--c">
          <HeadlineWord
            id="yet"
            text={TOKEN_TEXT.yet}
            marked={word === 'yet'}
            hover={hover === 'yet'}
            display={display}
            onSelect={(id) => onWord(id)}
            onHover={onHover}
            onLeave={() => onHover(null)}
            tokenRef={(node) => {
              tokenRefs.current.yet = node
            }}
          />
          <span className="titleline__query" aria-hidden="true">
            <span className="titleline__query-mark">?</span>
            <span className="titleline__query-tail">
              <svg viewBox="0 0 96 14" preserveAspectRatio="none" aria-hidden="true">
                <path
                  className="titleline__query-tail-stroke"
                  d="M2 7c14-6 30 5 46-1s26-4 40 1"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth=".95"
                  strokeLinecap="round"
                  pathLength="100"
                />
              </svg>
            </span>
          </span>
        </span>
      </h2>

      <ol className="titleline__proofs" aria-label="Three proof marks beneath the question">
        {WORDS.map((id) => {
          const isActive = id === word
          return (
            <li
              key={`titleline-proof-${id}`}
              className={`titleline__proof titleline__proof--${id} ${isActive ? 'is-active' : ''} ${hover === id ? 'is-hover' : ''}`}
              onClick={() => onWord(id)}
              onMouseEnter={() => onHover(id)}
              onMouseLeave={() => onHover(null)}
              onFocus={() => onHover(id)}
              onBlur={() => onHover(null)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  onWord(id)
                } else {
                  handleWordKey(event, id)
                }
              }}
              tabIndex={0}
              role="button"
              aria-pressed={isActive}
              aria-label={`Mark the word ${WORD_LABEL[id]} · proof mark ${WORD_MARK[id]} · ${WORD_KIND[id]}.`}
            >
              <span className="titleline__proof-key" aria-hidden="true">
                <span className="titleline__proof-key-letter">{WORDS.indexOf(id) + 1}</span>
                <span className="titleline__proof-key-mark">{WORD_MARK[id]}</span>
              </span>
              <span className="titleline__proof-glyph" aria-hidden="true">
                <ProofGlyph id={id} active={isActive} tone={tone} />
              </span>
              <span className="titleline__proof-meta">
                <span className="titleline__proof-word">{display.uppercased ? WORD_LABEL[id].toUpperCase() : WORD_LABEL[id]}</span>
                <span className="titleline__proof-kind">{WORD_KIND_SHORT[id]}</span>
              </span>
              <span className="titleline__proof-active" aria-hidden="true">
                <span className="titleline__proof-active-dot" />
                {isActive ? 'now' : 'set'}
              </span>
            </li>
          )
        })}
      </ol>

      <div className="titleline__voices" role="group" aria-label="Cycle the voice of the headline">
        <span className="titleline__voices-tag" aria-hidden="true">
          <span className="titleline__voices-tag-mark" />
          cycle the voice
          <span className="titleline__voices-tag-mark titleline__voices-tag-mark--alt" />
        </span>
        <div className="titleline__voices-row">
          {ORDER.map((v) => {
            const isActive = v === voice
            return (
              <button
                key={`voice-tab-${v}`}
                type="button"
                className={`titleline__voice titleline__voice--${v} ${isActive ? 'is-active' : ''}`}
                onClick={() => onVoice(v)}
                onKeyDown={(event) => {
                  if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
                    event.preventDefault()
                    cycleVoice(1)
                  } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
                    event.preventDefault()
                    cycleVoice(-1)
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
                aria-label={`Set the headline in the ${VOICE_NAME[v]} voice.`}
              >
                <span className="titleline__voice-letter" aria-hidden="true">{VOICE_LETTER[v]}</span>
                <span className="titleline__voice-stack">
                  <span className="titleline__voice-name">{VOICE_NAME[v]}</span>
                  <span className="titleline__voice-face">{VOICE_DESCRIPTOR[v]}</span>
                </span>
                <span className="titleline__voice-now" aria-hidden="true">
                  {isActive ? (
                    <>
                      <span className="titleline__voice-now-dot" />
                      <span>now</span>
                    </>
                  ) : (
                    <span className="titleline__voice-now-tag">set</span>
                  )}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      <footer className="titleline__footer" aria-hidden="true">
        <span className="titleline__footer-cell">
          <span className="titleline__footer-key">folio</span>
          <span className="titleline__footer-value">i</span>
        </span>
        <span className="titleline__footer-sep" aria-hidden="true">
          <span className="titleline__footer-sep-bead" />
        </span>
        <span className="titleline__footer-cell">
          <span className="titleline__footer-key">marked at</span>
          <span className="titleline__footer-value">{display.uppercased ? WORD_LABEL[word].toUpperCase() : WORD_LABEL[word]}</span>
        </span>
        <span className="titleline__footer-sep" aria-hidden="true">
          <span className="titleline__footer-sep-bead" />
        </span>
        <span className="titleline__footer-cell">
          <span className="titleline__footer-key">set today</span>
          <span className="titleline__footer-value">{setToday}</span>
        </span>
      </footer>

      <span className="sr-only">
        Use Tab to move between the three marked words. Use the arrow keys to step between the proof marks, or shift + v to pull a rehearsal across all three voices.
      </span>
      <span className="sr-only" aria-live="polite">
        {`Marked at ${WORD_LABEL[word]}, ${WORD_MARK[word]}. Set in ${VOICE_NAME[voice]}.`}
      </span>
    </figure>
  )
}