import { useId, useRef, useState, type CSSProperties, type KeyboardEvent, type MutableRefObject } from 'react'
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
  scale: number
}

const DISPLAY: Record<VoiceId, Display> = {
  quiet: { fontFamily: "'Iowan Old Style', Georgia, serif", fontWeight: 400, fontStyle: 'italic', tracking: '-0.018em', uppercased: false, scale: 1 },
  human: { fontFamily: "'Iowan Old Style', Georgia, serif", fontWeight: 500, fontStyle: 'italic', tracking: '-0.014em', uppercased: false, scale: 1.06 },
  bold: { fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif', fontWeight: 800, fontStyle: 'normal', tracking: '-0.045em', uppercased: true, scale: 1.1 },
}

const VOICE_TONE: Record<VoiceId, string> = {
  quiet: 'var(--blue)',
  human: 'var(--coral)',
  bold: 'var(--acid)',
}

const VOICE_NAME: Record<VoiceId, string> = { quiet: 'quiet cut', human: 'human hand', bold: 'bold signal' }
const VOICE_LETTER: Record<VoiceId, string> = { quiet: 'A', human: 'B', bold: 'C' }
const VOICE_DESCRIPTOR: Record<VoiceId, string> = {
  quiet: 'serif · close set',
  human: 'serif · a little warm',
  bold: 'sans · heavy · no apology',
}

const WORD_LABEL: Record<WordId, string> = { m3: 'Minimax M3', good: 'good at', yet: 'yet' }
const TOKEN_TEXT: Record<WordId, string> = { m3: 'M3', good: 'good at', yet: 'yet?' }
const WORD_MARK: Record<WordId, string> = { m3: 'stet', good: 'caret', yet: 'query' }
const WORD_KIND: Record<WordId, string> = { m3: 'let it stand', good: 'make room', yet: 'protect the pause' }

const ORDER: VoiceId[] = ['quiet', 'human', 'bold']

function ProofMark({ id, tone }: { id: WordId; tone: string }) {
  const baseId = useId().replace(/:/g, '')
  const grainId = `titleline-proof-grain-${id}-${baseId}`
  if (id === 'm3') {
    return (
      <svg className="titleline__proof-svg" viewBox="0 0 220 36" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        <defs>
          <filter id={grainId} x="-6%" y="-12%" width="112%" height="124%">
            <feTurbulence type="fractalNoise" baseFrequency="2.4" numOctaves="2" seed="29" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .5 0" />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
        </defs>
        <g filter={`url(#${grainId})`} style={{ color: tone } as CSSProperties}>
          <path d="M14 16 L86 16" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" pathLength="100" className="titleline__proof-stet" />
          <circle cx="14" cy="16" r="1.6" fill="currentColor" className="titleline__proof-bead titleline__proof-bead--lead" />
          <circle cx="86" cy="16" r="1.6" fill="currentColor" className="titleline__proof-bead titleline__proof-bead--trail" />
          <path d="M92 9 L98 16 L92 23 L86 16 Z" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" opacity=".85" className="titleline__proof-arrow" />
          <text x="124" y="20" textAnchor="start" fontFamily="'Iowan Old Style', Georgia, serif" fontStyle="italic" fontSize="13" fill="currentColor">stet</text>
          <text x="124" y="30" textAnchor="start" fontFamily="ui-monospace, monospace" fontSize="6" letterSpacing="2.2" fill="currentColor" opacity=".55">LET IT STAND</text>
        </g>
      </svg>
    )
  }
  if (id === 'good') {
    return (
      <svg className="titleline__proof-svg" viewBox="0 0 220 36" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        <defs>
          <filter id={grainId} x="-6%" y="-12%" width="112%" height="124%">
            <feTurbulence type="fractalNoise" baseFrequency="2.4" numOctaves="2" seed="31" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .5 0" />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
        </defs>
        <g filter={`url(#${grainId})`} style={{ color: tone } as CSSProperties}>
          <path d="M14 30 C 30 30, 50 14, 110 14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" pathLength="100" className="titleline__proof-caret-curve" />
          <path d="M104 8 L116 14 L108 22" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className="titleline__proof-caret-point" />
          <circle cx="116" cy="14" r="1.6" fill="currentColor" className="titleline__proof-bead titleline__proof-bead--lead" />
          <text x="138" y="20" textAnchor="start" fontFamily="'Iowan Old Style', Georgia, serif" fontStyle="italic" fontSize="13" fill="currentColor">caret</text>
          <text x="138" y="30" textAnchor="start" fontFamily="ui-monospace, monospace" fontSize="6" letterSpacing="2.2" fill="currentColor" opacity=".55">MAKE ROOM</text>
        </g>
      </svg>
    )
  }
  return (
    <svg className="titleline__proof-svg" viewBox="0 0 220 36" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      <defs>
        <filter id={grainId} x="-6%" y="-12%" width="112%" height="124%">
          <feTurbulence type="fractalNoise" baseFrequency="2.4" numOctaves="2" seed="37" stitchTiles="stitch" />
          <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .5 0" />
          <feComposite in2="SourceGraphic" operator="in" />
        </filter>
      </defs>
      <g filter={`url(#${grainId})`} style={{ color: tone } as CSSProperties}>
        <circle cx="40" cy="18" r="14" fill="none" stroke="currentColor" strokeWidth="1.2" className="titleline__proof-query-ring" />
        <path d="M36 12 C 36 7, 44 7, 44 12 C 44 16, 40 16, 40 21" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" pathLength="100" className="titleline__proof-query-hook" />
        <circle cx="40" cy="25.5" r="1.4" fill="currentColor" className="titleline__proof-query-dot" />
        <text x="68" y="20" textAnchor="start" fontFamily="'Iowan Old Style', Georgia, serif" fontStyle="italic" fontSize="13" fill="currentColor">query</text>
        <text x="68" y="30" textAnchor="start" fontFamily="ui-monospace, monospace" fontSize="6" letterSpacing="2.2" fill="currentColor" opacity=".55">PROTECT THE PAUSE</text>
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
    '--titleline-scale': String(display.scale),
  } as CSSProperties
  const containerRef = useRef<HTMLDivElement>(null)
  const [strikeKey, setStrikeKey] = useState(0)

  const voiceIndex = ORDER.indexOf(voice)

  const handleWordKey = (event: KeyboardEvent<HTMLButtonElement | HTMLDivElement>, id: WordId) => {
    const ids: WordId[] = ['m3', 'good', 'yet']
    const idx = ids.indexOf(id)
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault()
      const next = ids[(idx + 1) % ids.length]
      onWord(next)
      window.requestAnimationFrame(() => tokenRefs.current[next]?.focus())
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault()
      const next = ids[(idx - 1 + ids.length) % ids.length]
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
      ref={containerRef}
      className={`titleline titleline--${voice} titleline--word-${word}`}
      style={style}
      aria-label={`The headline: ${WORD_LABEL.m3} ${WORD_LABEL.good} frontend ${WORD_LABEL.yet}?, set in the ${VOICE_NAME[voice]} voice, marked at ${WORD_LABEL[word]} (${WORD_MARK[word]}).`}
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

      <div
        className="titleline__stage"
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            const next = ORDER[(voiceIndex + 1) % ORDER.length]
            onVoice(next)
          }
        }}
        role="group"
        aria-label={`The headline set in ${VOICE_NAME[voice]}, ${display.fontStyle === 'italic' ? 'italic' : 'upright'} ${display.fontFamily.split(',')[0].replace(/['"]/g, '').trim()}`}
      >
        <div className="titleline__strike" key={`titleline-strike-${voice}-${strikeKey}`} aria-hidden="true" />

        <div className="titleline__eyebrow" aria-hidden="true">
          <span className="titleline__eyebrow-mark" />
          <span className="titleline__eyebrow-rule titleline__eyebrow-rule--lead" />
          <span className="titleline__eyebrow-cell">
            <em>the headline</em>
          </span>
          <span className="titleline__eyebrow-rule" />
          <span className="titleline__eyebrow-voice">
            <span className={`titleline__eyebrow-voice-letter titleline__eyebrow-voice-letter--${voice}`}>{VOICE_LETTER[voice]}</span>
            <span className="titleline__eyebrow-voice-stack">
              <em className="titleline__eyebrow-voice-name">{VOICE_NAME[voice]}</em>
              <span className="titleline__eyebrow-voice-face">{VOICE_DESCRIPTOR[voice]}</span>
            </span>
          </span>
          <span className="titleline__eyebrow-rule titleline__eyebrow-rule--alt" />
          <span className="titleline__eyebrow-mark titleline__eyebrow-mark--alt" />
        </div>

        <h2 className={`titleline__headline titleline__headline--${voice}`}>
          <span className="titleline__headline-fragment titleline__headline-fragment--lead">is</span>
          <HeadlineWord
            id="m3"
            text={TOKEN_TEXT.m3}
            marked={word === 'm3'}
            hover={hover === 'm3'}
            display={display}
            onSelect={(id) => {
              onWord(id)
              setStrikeKey((k) => k + 1)
            }}
            onHover={onHover}
            onLeave={() => onHover(null)}
            tokenRef={(node) => {
              tokenRefs.current.m3 = node
            }}
          />
          <span className="titleline__headline-sep" aria-hidden="true" />
          <HeadlineWord
            id="good"
            text={TOKEN_TEXT.good}
            marked={word === 'good'}
            hover={hover === 'good'}
            display={display}
            onSelect={(id) => {
              onWord(id)
              setStrikeKey((k) => k + 1)
            }}
            onHover={onHover}
            onLeave={() => onHover(null)}
            tokenRef={(node) => {
              tokenRefs.current.good = node
            }}
          />
          <span className="titleline__headline-fragment titleline__headline-fragment--mid">frontend</span>
          <span className="titleline__headline-sep titleline__headline-sep--alt" aria-hidden="true" />
          <HeadlineWord
            id="yet"
            text={TOKEN_TEXT.yet}
            marked={word === 'yet'}
            hover={hover === 'yet'}
            display={display}
            onSelect={(id) => {
              onWord(id)
              setStrikeKey((k) => k + 1)
            }}
            onHover={onHover}
            onLeave={() => onHover(null)}
            tokenRef={(node) => {
              tokenRefs.current.yet = node
            }}
          />
          <span className="titleline__headline-query" aria-hidden="true">
            <span className="titleline__headline-query-mark">?</span>
          </span>
        </h2>

        <span className="titleline__trail" aria-hidden="true">
          <span className="titleline__trail-rule titleline__trail-rule--lead" />
          <span className="titleline__trail-bead titleline__trail-bead--lead" />
          <span className="titleline__trail-tag">
            <em>set today</em>
            <span className="titleline__trail-sep" aria-hidden="true">·</span>
            <span>{setToday}</span>
          </span>
          <span className="titleline__trail-bead" />
          <span className="titleline__trail-rule" />
        </span>

        <div className="titleline__proof" aria-hidden="true">
          <span className="titleline__proof-tag">
            <span className="titleline__proof-tag-dot" />
            marked at <em>{WORD_LABEL[word]}</em>
            <span className="titleline__proof-tag-sep">·</span>
            <span className="titleline__proof-tag-mark">{WORD_MARK[word]}</span>
            <span className="titleline__proof-tag-dot titleline__proof-tag-dot--alt" />
          </span>
          <ProofMark id={word} tone={tone} />
        </div>
      </div>

      <span className="titleline__rule" aria-hidden="true">
        <svg viewBox="0 0 1000 6" preserveAspectRatio="none">
          <g filter={`url(#${grainId})`}>
            <path
              d="M2 3c40-2 80 2 120 0s80-2 120 0 80 2 120 0 80-2 120 0 80 2 120 0 80-2 120 0 80 2 120 0 80-2 120 0 80 2 120 0 36-1 38-1"
              fill="none"
              stroke="currentColor"
              strokeWidth=".9"
              strokeLinecap="round"
              pathLength="100"
              className="titleline__rule-stroke"
            />
          </g>
          <circle cx="2" cy="3" r="1.4" fill="currentColor" className="titleline__rule-bead titleline__rule-bead--lead" />
          <circle cx="998" cy="3" r="1.4" fill="currentColor" className="titleline__rule-bead titleline__rule-bead--trail" />
        </svg>
      </span>

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

      <span className="sr-only">
        Use Tab to move between marked words and the three voice tabs. Use the arrow keys to cycle the voice. Use shift + v to pull a rehearsal.
      </span>
      <span className="sr-only" aria-live="polite">
        {`Marked at ${WORD_LABEL[word]}, ${WORD_MARK[word]}. Set in ${VOICE_NAME[voice]}.`}
      </span>
    </figure>
  )
}
