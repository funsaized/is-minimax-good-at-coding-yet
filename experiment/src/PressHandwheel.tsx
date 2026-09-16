import { useEffect, useId, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react'
import type { VoiceId } from './Press'
import type { WordId } from './notes'
import type { ImpressionMark } from './ImpressionRibbon'

type PressHandwheelProps = {
  voice: VoiceId
  word: WordId
  setToday: string
  marks: ReadonlyArray<ImpressionMark>
  onVoice?: (voice: VoiceId) => void
  onWord?: (word: WordId) => void
  onArm?: () => void
}

const VOICE_TONE: Record<VoiceId, string> = {
  quiet: 'var(--blue)',
  human: 'var(--coral)',
  bold: 'var(--acid)',
}
const VOICE_LETTER: Record<VoiceId, string> = { quiet: 'A', human: 'B', bold: 'C' }
const VOICE_NAME: Record<VoiceId, string> = {
  quiet: 'quiet cut',
  human: 'human hand',
  bold: 'bold signal',
}
const VOICE_FACE: Record<VoiceId, string> = {
  quiet: 'serif · italic · close set',
  human: 'serif · italic · a little warm',
  bold: 'sans · heavy · no apology',
}
const VOICE_NEXT: Record<VoiceId, VoiceId> = { quiet: 'human', human: 'bold', bold: 'quiet' }

const WORD_LABEL: Record<WordId, string> = { m3: 'm³', good: 'good at', yet: 'yet?' }
const WORD_MARK: Record<WordId, string> = { m3: 'stet', good: 'caret', yet: 'query' }
const WORD_NOTE: Record<WordId, string> = {
  m3: 'let it stand',
  good: 'make room',
  yet: 'protect the pause',
}
const WORD_INK: Record<WordId, string> = { m3: 'var(--acid)', good: 'var(--coral)', yet: 'var(--blue)' }
const WORD_NEXT: Record<WordId, WordId> = { m3: 'good', good: 'yet', yet: 'm3' }

const TICK_COUNT = 8

function VoiceDial({
  voice,
  isActive,
  glyph,
}: {
  voice: VoiceId
  isActive: boolean
  glyph: string
}) {
  return (
    <svg
      className={`press-handwheel__voice-dial-svg press-handwheel__voice-dial-svg--${voice}`}
      viewBox="0 0 64 64"
      aria-hidden="true"
    >
      <g className={`press-handwheel__voice-dial-glyph press-handwheel__voice-dial-glyph--${voice}`}>
        <text
          x="32"
          y="38"
          textAnchor="middle"
          fontFamily="Georgia, 'Iowan Old Style', serif"
          fontStyle="italic"
          fontSize="22"
          letterSpacing="-.02em"
          fill="currentColor"
        >
          {glyph}
        </text>
      </g>
      <text
        x="32"
        y="50"
        textAnchor="middle"
        fontFamily="ui-monospace, monospace"
        fontSize="3.4"
        letterSpacing="1.6"
        fill="currentColor"
        opacity=".55"
      >
        {isActive ? 'NOW SET' : 'PULL'}
      </text>
    </svg>
  )
}

export function PressHandwheel({ voice, word, setToday, marks, onVoice, onWord, onArm }: PressHandwheelProps) {
  const baseId = useId().replace(/:/g, '')
  const grainId = `press-handwheel-grain-${baseId}`
  const dialGrainId = `press-handwheel-dial-grain-${baseId}`
  const rootRef = useRef<HTMLDivElement>(null)
  const [revealed, setRevealed] = useState(false)
  const [hoveredFace, setHoveredFace] = useState<'wheel' | 'mark' | null>(null)
  const [pullCount, setPullCount] = useState(0)
  const [spinAngle, setSpinAngle] = useState(0)
  const [strikeKey, setStrikeKey] = useState(0)
  const lastVoiceRef = useRef<VoiceId>(voice)
  const lastWordRef = useRef<WordId>(word)
  const wheelHandRef = useRef<SVGGElement>(null)

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
      { threshold: 0.05, rootMargin: '0px 0px -8% 0px' },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (lastVoiceRef.current !== voice) {
      lastVoiceRef.current = voice
      setPullCount(value => value + 1)
      setStrikeKey(value => value + 1)
      setSpinAngle(value => value + 96)
    }
  }, [voice])

  useEffect(() => {
    if (lastWordRef.current !== word) {
      lastWordRef.current = word
      setStrikeKey(value => value + 1)
    }
  }, [word])

  const totalMarks = marks.length
  const totalEvents = totalMarks + pullCount
  const filledTicks = Math.min(TICK_COUNT, totalEvents)
  const justSetTick = totalEvents === 0 ? -1 : (totalEvents - 1) % TICK_COUNT
  const state =
    !revealed ? 'standby' :
    pullCount === 0 ? 'cold' :
    pullCount === 1 ? 'warming' :
    pullCount < 4 ? 'armed' : 'hot'

  const tone = VOICE_TONE[voice]
  const style = {
    '--handwheel-tone': tone,
    '--handwheel-word-ink': WORD_INK[word],
    '--handwheel-grain': `url(#${grainId})`,
    '--handwheel-dial-grain': `url(#${dialGrainId})`,
  } as CSSProperties

  const onWheelKey = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault()
      onVoice?.(VOICE_NEXT[voice])
    }
    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault()
      onVoice?.(VOICE_NEXT[VOICE_NEXT[VOICE_NEXT[voice]]])
    }
  }

  const onMarkKey = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault()
      onWord?.(WORD_NEXT[word])
    }
    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault()
      onWord?.(WORD_NEXT[WORD_NEXT[WORD_NEXT[word]]])
    }
  }

  const cycleWheel = () => onVoice?.(VOICE_NEXT[voice])
  const cycleMark = () => onWord?.(WORD_NEXT[word])

  const voiceOrder: VoiceId[] = ['quiet', 'human', 'bold']
  const voiceIndex = voiceOrder.indexOf(voice)

  return (
    <div
      ref={rootRef}
      className={`press-handwheel press-handwheel--${voice} press-handwheel--word-${word} press-handwheel--${state} ${revealed ? 'is-revealed' : ''}`}
      style={style}
      aria-label="Press handwheel — the press room's live status"
    >
      <svg className="press-handwheel__defs" viewBox="0 0 200 60" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <filter id={grainId} x="-2%" y="-2%" width="104%" height="104%">
            <feTurbulence type="fractalNoise" baseFrequency="2.4" numOctaves="2" seed="83" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .42 0" />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
          <filter id={dialGrainId} x="-6%" y="-6%" width="112%" height="112%">
            <feTurbulence type="fractalNoise" baseFrequency="1.6" numOctaves="2" seed="59" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .35 0" />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
        </defs>
      </svg>

      <span className="press-handwheel__corner press-handwheel__corner--tl" aria-hidden="true" />
      <span className="press-handwheel__corner press-handwheel__corner--tr" aria-hidden="true" />
      <span className="press-handwheel__corner press-handwheel__corner--bl" aria-hidden="true" />
      <span className="press-handwheel__corner press-handwheel__corner--br" aria-hidden="true" />

      <header className="press-handwheel__masthead" aria-hidden="true">
        <span className="press-handwheel__masthead-rule" />
        <span className="press-handwheel__masthead-tag">
          <span className="press-handwheel__masthead-glyph">※</span>
          <span className="press-handwheel__masthead-eyebrow">the press handwheel</span>
          <span className="press-handwheel__masthead-mark">folio i</span>
          <span className="press-handwheel__masthead-glyph press-handwheel__masthead-glyph--alt">※</span>
        </span>
        <span className="press-handwheel__masthead-rule press-handwheel__masthead-rule--alt" />
      </header>

      <div className="press-handwheel__plate">
        <div
          className={`press-handwheel__dial press-handwheel__dial--${voice} ${hoveredFace === 'wheel' ? 'is-hovered' : ''}`}
          style={{ '--press-dial-spin': `${spinAngle}deg` } as CSSProperties}
        >
          <span className="press-handwheel__dial-flange" aria-hidden="true" />

          <button
            type="button"
            className="press-handwheel__dial-button"
            onClick={cycleWheel}
            onKeyDown={onWheelKey}
            onMouseEnter={() => setHoveredFace('wheel')}
            onMouseLeave={() => setHoveredFace(prev => (prev === 'wheel' ? null : prev))}
            onFocus={() => setHoveredFace('wheel')}
            onBlur={() => setHoveredFace(prev => (prev === 'wheel' ? null : prev))}
            aria-label={`The voice handwheel. The press is now set in ${VOICE_NAME[voice]}. Click or use the arrow keys to cycle through the voices.`}
          >
            <span className="press-handwheel__dial-face" aria-hidden="true">
              <svg viewBox="0 0 200 200" className="press-handwheel__dial-svg">
                <g
                  ref={wheelHandRef}
                  className="press-handwheel__dial-rotate"
                  style={{ transform: `rotate(${spinAngle}deg)` }}
                >
                  <circle cx="100" cy="100" r="92" fill="none" stroke="currentColor" strokeWidth=".6" opacity=".32" />
                  <circle cx="100" cy="100" r="82" fill="none" stroke="currentColor" strokeWidth=".35" strokeDasharray=".9 2.4" opacity=".45" />
                  <circle cx="100" cy="100" r="68" fill="none" stroke="currentColor" strokeWidth=".25" opacity=".32" />

                  {Array.from({ length: 24 }).map((_, index) => {
                    const angle = (index * 15 - 90) * (Math.PI / 180)
                    const inner = index % 6 === 0 ? 76 : 80
                    const outer = 88
                    return (
                      <line
                        key={`dial-tick-${index}`}
                        x1={100 + Math.cos(angle) * inner}
                        y1={100 + Math.sin(angle) * inner}
                        x2={100 + Math.cos(angle) * outer}
                        y2={100 + Math.sin(angle) * outer}
                        stroke="currentColor"
                        strokeWidth={index % 6 === 0 ? 1.2 : .5}
                        strokeLinecap="round"
                        opacity={index % 6 === 0 ? .85 : .4}
                      />
                    )
                  })}

                  <text
                    x="100"
                    y="22"
                    textAnchor="middle"
                    fontFamily="ui-monospace, monospace"
                    fontSize="6.4"
                    letterSpacing="2.4"
                    fill="currentColor"
                    opacity=".55"
                  >
                    SET · VOICE
                  </text>

                  <g
                    className={`press-handwheel__dial-pip press-handwheel__dial-pip--${voice}`}
                  >
                    <circle cx="100" cy="30" r="3.6" fill="currentColor" />
                    <circle cx="100" cy="30" r="6" fill="none" stroke="currentColor" strokeWidth=".5" opacity=".55" />
                  </g>

                  <g className="press-handwheel__dial-pointer">
                    <line x1="100" y1="100" x2="100" y2="42" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
                    <circle cx="100" cy="42" r="3.4" fill="currentColor" />
                    <circle cx="100" cy="100" r="6" fill="var(--night)" />
                    <circle cx="100" cy="100" r="3" fill="currentColor" />
                  </g>

                  <circle cx="100" cy="100" r="48" fill="none" stroke="currentColor" strokeWidth=".4" opacity=".4" />
                  <circle cx="100" cy="100" r="34" fill="none" stroke="currentColor" strokeWidth=".25" strokeDasharray="1 2" opacity=".32" />
                </g>

                <g className="press-handwheel__dial-letter" key={`dial-letter-${voice}`}>
                  <text
                    x="100"
                    y="116"
                    textAnchor="middle"
                    fontFamily="Georgia, 'Iowan Old Style', serif"
                    fontStyle="italic"
                    fontSize="56"
                    letterSpacing="-.04em"
                    fill="currentColor"
                  >
                    {VOICE_LETTER[voice]}
                  </text>
                  <text
                    x="100"
                    y="146"
                    textAnchor="middle"
                    fontFamily="ui-monospace, monospace"
                    fontSize="6"
                    letterSpacing="2"
                    fill="currentColor"
                    opacity=".6"
                  >
                    {voiceIndex === 0 ? 'a' : voiceIndex === 1 ? 'b' : 'c'} · OF · III
                  </text>
                </g>

                <g
                  className="press-handwheel__dial-strike"
                  key={`dial-strike-${strikeKey}`}
                  aria-hidden="true"
                >
                  <circle cx="100" cy="100" r="98" fill="none" stroke="currentColor" strokeWidth="2" opacity=".25" />
                  <circle cx="100" cy="100" r="92" fill="currentColor" opacity=".04" />
                </g>
              </svg>
            </span>

            <span className="press-handwheel__dial-readout">
              <span className="press-handwheel__dial-readout-row">
                <span className="press-handwheel__dial-readout-key">voice handwheel</span>
                <span className={`press-handwheel__dial-readout-state press-handwheel__dial-readout-state--${state}`}>
                  <span className="press-handwheel__dial-readout-state-dot" />
                  {state}
                </span>
              </span>
              <span className="press-handwheel__dial-readout-row">
                <span className="press-handwheel__dial-readout-key">set in</span>
                <span className="press-handwheel__dial-readout-voice">{VOICE_NAME[voice]}</span>
              </span>
              <span className="press-handwheel__dial-readout-row press-handwheel__dial-readout-row--face">
                <span className="press-handwheel__dial-readout-face">{VOICE_FACE[voice]}</span>
              </span>
              <span className="press-handwheel__dial-readout-hint">
                <kbd>click</kbd>
                <span aria-hidden="true">·</span>
                <span><em>or</em> arrow keys to cycle</span>
              </span>
            </span>
          </button>
        </div>

        <span className="press-handwheel__rule press-handwheel__rule--v" aria-hidden="true" />

        <div
          className={`press-handwheel__mark press-handwheel__mark--${word} ${hoveredFace === 'mark' ? 'is-hovered' : ''}`}
        >
          <button
            type="button"
            className="press-handwheel__mark-button"
            onClick={cycleMark}
            onKeyDown={onMarkKey}
            onMouseEnter={() => setHoveredFace('mark')}
            onMouseLeave={() => setHoveredFace(prev => (prev === 'mark' ? null : prev))}
            onFocus={() => setHoveredFace('mark')}
            onBlur={() => setHoveredFace(prev => (prev === 'mark' ? null : prev))}
            aria-label={`The marked-word plate. The press is marked at ${WORD_LABEL[word]} (${WORD_MARK[word]}). Click or use the arrow keys to cycle through the marked words.`}
          >
            <span className="press-handwheel__mark-plate" aria-hidden="true">
              <svg viewBox="0 0 200 200" className="press-handwheel__mark-svg">
                <circle cx="100" cy="100" r="88" fill="none" stroke="currentColor" strokeWidth=".6" opacity=".32" />
                <circle cx="100" cy="100" r="76" fill="none" stroke="currentColor" strokeWidth=".4" strokeDasharray="1 2.4" opacity=".5" />
                <circle cx="100" cy="100" r="62" fill="none" stroke="currentColor" strokeWidth=".3" opacity=".32" />
                <circle cx="100" cy="100" r="44" fill="currentColor" opacity=".05" />

                <text
                  x="100"
                  y="34"
                  textAnchor="middle"
                  fontFamily="ui-monospace, monospace"
                  fontSize="6.4"
                  letterSpacing="2.4"
                  fill="currentColor"
                  opacity=".55"
                >
                  MARKED · AT
                </text>

                <text
                  x="100"
                  y="58"
                  textAnchor="middle"
                  fontFamily="ui-monospace, monospace"
                  fontSize="5"
                  letterSpacing="1.8"
                  fill="currentColor"
                  opacity=".7"
                >
                  {WORD_MARK[word].toUpperCase()}
                </text>

                <g className={`press-handwheel__mark-glyph press-handwheel__mark-glyph--${word}`} key={`mark-glyph-${word}`}>
                  <text
                    x="100"
                    y="116"
                    textAnchor="middle"
                    fontFamily="Georgia, 'Iowan Old Style', serif"
                    fontStyle="italic"
                    fontSize="38"
                    letterSpacing="-.025em"
                    fill="currentColor"
                  >
                    {word === 'm3' ? 'm³' : word === 'good' ? 'good at' : 'yet?'}
                  </text>
                  <text
                    x="100"
                    y="148"
                    textAnchor="middle"
                    fontFamily="ui-monospace, monospace"
                    fontSize="6"
                    letterSpacing="2.2"
                    fill="currentColor"
                    opacity=".6"
                  >
                    {word === 'm3' ? 'i.' : word === 'good' ? 'ii.' : 'iii.'} · OF · III
                  </text>
                </g>

                <text
                  x="100"
                  y="178"
                  textAnchor="middle"
                  fontFamily="ui-monospace, monospace"
                  fontSize="5.4"
                  letterSpacing="1.8"
                  fill="currentColor"
                  opacity=".5"
                >
                  {WORD_NOTE[word]}
                </text>

                <g
                  className="press-handwheel__mark-strike"
                  key={`mark-strike-${strikeKey}`}
                  aria-hidden="true"
                >
                  <circle cx="100" cy="100" r="84" fill="currentColor" opacity=".06" />
                </g>
              </svg>
            </span>

            <span className="press-handwheel__mark-readout">
              <span className="press-handwheel__mark-readout-row">
                <span className="press-handwheel__mark-readout-key">marked at</span>
                <span className="press-handwheel__mark-readout-value">{WORD_LABEL[word]}</span>
              </span>
              <span className="press-handwheel__mark-readout-row">
                <span className="press-handwheel__mark-readout-key">mark kind</span>
                <span className="press-handwheel__mark-readout-mark">{WORD_MARK[word]}</span>
              </span>
              <span className="press-handwheel__mark-readout-row press-handwheel__mark-readout-row--note">
                <span className="press-handwheel__mark-readout-note">{WORD_NOTE[word]}</span>
              </span>
              <span className="press-handwheel__mark-readout-tick" aria-hidden="true">
                {Array.from({ length: TICK_COUNT }).map((_, index) => (
                  <span
                    key={`mark-tick-${index}`}
                    className={`press-handwheel__mark-readout-tick-cell ${index < filledTicks ? 'is-on' : ''} ${index === justSetTick && justSetTick >= 0 ? 'is-just-set' : ''}`}
                  />
                ))}
              </span>
              <span className="press-handwheel__mark-readout-hint">
                <kbd>click</kbd>
                <span aria-hidden="true">·</span>
                <span><em>or</em> arrow keys to cycle</span>
              </span>
            </span>
          </button>
        </div>

        <span className="press-handwheel__rule press-handwheel__rule--v" aria-hidden="true" />

        <div className="press-handwheel__voice-list" role="group" aria-label="The three voice options, click to set">
          {voiceOrder.map((v, index) => {
            const isActive = v === voice
            return (
              <button
                key={`voice-${v}`}
                type="button"
                className={`press-handwheel__voice-cell press-handwheel__voice-cell--${v} ${isActive ? 'is-active' : ''}`}
                onClick={() => onVoice?.(v)}
                tabIndex={-1}
                aria-label={`Pull the voice to ${VOICE_NAME[v]}.`}
                aria-pressed={isActive}
              >
                <span className="press-handwheel__voice-cell-pip" aria-hidden="true">
                  <VoiceDial voice={v} isActive={isActive} glyph={VOICE_LETTER[v]} />
                </span>
                <span className="press-handwheel__voice-cell-readout">
                  <span className="press-handwheel__voice-cell-row">
                    <span className="press-handwheel__voice-cell-letter">{VOICE_LETTER[v]}</span>
                    <span className="press-handwheel__voice-cell-name">{VOICE_NAME[v]}</span>
                    {isActive && <span className="press-handwheel__voice-cell-now" aria-hidden="true">now</span>}
                  </span>
                  <span className="press-handwheel__voice-cell-face">{VOICE_FACE[v]}</span>
                </span>
              </button>
            )
          })}
        </div>
      </div>

      <button
        type="button"
        className="press-handwheel__arm"
        onClick={onArm}
        aria-label="Arm the press for a pull — opens the editor's note"
      >
        <span className="press-handwheel__arm-arm" aria-hidden="true">
          <span className="press-handwheel__arm-pivot" />
          <span className="press-handwheel__arm-bar" />
          <span className="press-handwheel__arm-knob" />
        </span>
        <span className="press-handwheel__arm-copy">
          <span className="press-handwheel__arm-eyebrow">turn the lever</span>
          <span className="press-handwheel__arm-headline">tipped-in folio viii <em>·</em> the editor's note</span>
        </span>
        <span className="press-handwheel__arm-arrow" aria-hidden="true">
          <svg viewBox="0 0 14 14">
            <path d="M2 7h10M8 3l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </button>

      <span className="press-handwheel__rule press-handwheel__rule--top" aria-hidden="true">
        <svg viewBox="0 0 600 4" preserveAspectRatio="none">
          <path d="M2 2 L598 2" stroke="currentColor" strokeWidth=".4" strokeDasharray=".7 2.6" fill="none" />
        </svg>
      </span>
      <span className="press-handwheel__rule press-handwheel__rule--bottom" aria-hidden="true">
        <svg viewBox="0 0 600 4" preserveAspectRatio="none">
          <path d="M2 2 L598 2" stroke="currentColor" strokeWidth=".4" strokeDasharray=".7 2.6" fill="none" />
        </svg>
      </span>
      <span className="press-handwheel__date" aria-hidden="true">
        <span className="press-handwheel__date-mark" />
        set today · <em>{setToday}</em>
        <span className="press-handwheel__date-mark press-handwheel__date-mark--alt" />
      </span>
    </div>
  )
}
