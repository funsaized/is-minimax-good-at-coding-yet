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
const WORD_INK: Record<WordId, string> = { m3: 'var(--acid)', good: 'var(--coral)', yet: 'var(--blue)' }
const WORD_NEXT: Record<WordId, WordId> = { m3: 'good', good: 'yet', yet: 'm3' }

const TICK_COUNT = 8

function WheelMark({ word, letter }: { word: WordId; letter: string }) {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" className="press-handwheel__mark-svg">
      <circle cx="32" cy="32" r="26" fill="none" stroke="currentColor" strokeWidth=".6" opacity=".55" />
      <circle cx="32" cy="32" r="20" fill="none" stroke="currentColor" strokeWidth=".3" strokeDasharray="1 2" opacity=".4" />
      <text
        x="32"
        y="24"
        textAnchor="middle"
        fontFamily="ui-monospace, monospace"
        fontSize="3.4"
        letterSpacing="1.4"
        fill="currentColor"
        opacity=".7"
      >MARK</text>
      <text
        x="32"
        y="40"
        textAnchor="middle"
        fontFamily="Georgia, serif"
        fontStyle="italic"
        fontSize="13"
        fill="currentColor"
      >{letter}</text>
      <text
        x="32"
        y="50"
        textAnchor="middle"
        fontFamily="ui-monospace, monospace"
        fontSize="2.8"
        letterSpacing="1.2"
        fill="currentColor"
        opacity=".6"
      >{word === 'm3' ? 'STET' : word === 'good' ? 'CARET' : 'QUERY'}</text>
    </svg>
  )
}

export function PressHandwheel({ voice, word, setToday, marks, onVoice, onWord, onArm }: PressHandwheelProps) {
  const baseId = useId().replace(/:/g, '')
  const grainId = `press-handwheel-grain-${baseId}`
  const rootRef = useRef<HTMLDivElement>(null)
  const [revealed, setRevealed] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [pullCount, setPullCount] = useState(0)
  const [spinAngle, setSpinAngle] = useState(0)
  const [strikeKey, setStrikeKey] = useState(0)
  const lastVoiceRef = useRef<VoiceId>(voice)
  const lastWordRef = useRef<WordId>(word)
  const wheelRotateRef = useRef<HTMLSpanElement>(null)
  const markRotateRef = useRef<HTMLSpanElement>(null)

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
  } as CSSProperties

  const onWheelKey = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      const next = VOICE_NEXT[voice]
      onVoice?.(next)
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      onVoice?.(VOICE_NEXT[voice])
    }
    if (event.key === 'ArrowLeft') {
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

  const wheelRotateStyle = { '--press-wheel-spin': `${spinAngle}deg` } as CSSProperties

  return (
    <div
      ref={rootRef}
      className={`press-handwheel press-handwheel--${voice} press-handwheel--word-${word} press-handwheel--${state} ${revealed ? 'is-revealed' : ''} ${isHovered ? 'is-hovered' : ''}`}
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
        </defs>
      </svg>

      <span className="press-handwheel__corner press-handwheel__corner--tl" aria-hidden="true" />
      <span className="press-handwheel__corner press-handwheel__corner--tr" aria-hidden="true" />
      <span className="press-handwheel__corner press-handwheel__corner--bl" aria-hidden="true" />
      <span className="press-handwheel__corner press-handwheel__corner--br" aria-hidden="true" />

      <button
        type="button"
        className="press-handwheel__wheel"
        onClick={() => onVoice?.(VOICE_NEXT[voice])}
        onKeyDown={onWheelKey}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onFocus={() => setIsHovered(true)}
        onBlur={() => setIsHovered(false)}
        aria-label={`Pull the voice to ${VOICE_NEXT[voice]} (${VOICE_NAME[VOICE_NEXT[voice]]}). The press is now ${state}.`}
        aria-pressed={false}
      >
        <span className="press-handwheel__wheel-housing" aria-hidden="true">
          <span className="press-handwheel__wheel-studs" aria-hidden="true">
            {Array.from({ length: 8 }).map((_, index) => (
              <span key={`stud-${index}`} className={`press-handwheel__wheel-stud press-handwheel__wheel-stud--${index + 1}`} />
            ))}
          </span>
          <span
            ref={wheelRotateRef}
            key={`wheel-rotate-${voice}`}
            className={`press-handwheel__wheel-rotate press-handwheel__wheel-rotate--${voice}`}
            style={wheelRotateStyle}
            aria-hidden="true"
          >
            <svg viewBox="0 0 64 64" className="press-handwheel__wheel-svg">
              <g className={`press-handwheel__wheel-gear press-handwheel__wheel-gear--${voice}`}>
                <circle cx="32" cy="32" r="24" fill="none" stroke="currentColor" strokeWidth=".5" opacity=".4" />
                {Array.from({ length: 12 }).map((_, index) => {
                  const angle = (index * 30 * Math.PI) / 180
                  const inner = 22
                  const outer = 28
                  return (
                    <line
                      key={`tooth-${index}`}
                      x1={32 + Math.cos(angle) * inner}
                      y1={32 + Math.sin(angle) * inner}
                      x2={32 + Math.cos(angle) * outer}
                      y2={32 + Math.sin(angle) * outer}
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      opacity={index % 3 === 0 ? '1' : '.55'}
                    />
                  )
                })}
                <circle cx="32" cy="32" r="20" fill="none" stroke="currentColor" strokeWidth=".7" />
                <circle cx="32" cy="32" r="14" fill="none" stroke="currentColor" strokeWidth=".4" strokeDasharray="1 1.4" opacity=".7" />
                <g className="press-handwheel__wheel-hand">
                  <line x1="32" y1="32" x2="32" y2="14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  <circle cx="32" cy="14" r="1.6" fill="currentColor" />
                </g>
                <circle cx="32" cy="32" r="3.4" fill="currentColor" />
                <circle cx="32" cy="32" r="1.6" fill="var(--night)" opacity=".7" />
              </g>
            </svg>
            <span key={`wheel-strike-${strikeKey}`} className="press-handwheel__wheel-strike" aria-hidden="true">
              <svg viewBox="0 0 64 64">
                <circle cx="32" cy="32" r="28" fill="currentColor" opacity=".12" />
              </svg>
            </span>
          </span>
          <span className="press-handwheel__wheel-letter" aria-hidden="true">
            <span>{VOICE_LETTER[voice]}</span>
            <span className="press-handwheel__wheel-letter-faint">·{VOICE_LETTER[VOICE_NEXT[voice]]}·</span>
          </span>
        </span>
        <span className="press-handwheel__wheel-readout" aria-hidden="true">
          <span className="press-handwheel__wheel-readout-row">
            <span className="press-handwheel__wheel-readout-mark">press</span>
            <span className={`press-handwheel__wheel-readout-state press-handwheel__wheel-readout-state--${state}`}>
              <span className="press-handwheel__wheel-readout-state-dot" />
              {state}
            </span>
          </span>
          <span className="press-handwheel__wheel-readout-row">
            <span className="press-handwheel__wheel-readout-mark">voice</span>
            <span className="press-handwheel__wheel-readout-voice">{VOICE_NAME[voice]}</span>
          </span>
          <span className="press-handwheel__wheel-readout-row press-handwheel__wheel-readout-row--face">
            <span className="press-handwheel__wheel-readout-face">{VOICE_FACE[voice]}</span>
          </span>
        </span>
        <span className="press-handwheel__wheel-tickmark" aria-hidden="true">
          <svg viewBox="0 0 200 8" preserveAspectRatio="none" className="press-handwheel__wheel-tickmark-svg">
            <path
              className="press-handwheel__wheel-tickmark-stroke"
              d="M2 4c20-3 40 3 60 0s40-3 60 0 40 3 60 0 16-1 18 0"
              fill="none"
              stroke="currentColor"
              strokeWidth=".7"
              strokeLinecap="round"
              pathLength="100"
            />
            <circle cx="2" cy="4" r="1" fill="currentColor" />
            <circle cx="198" cy="4" r="1.4" fill="currentColor" />
          </svg>
        </span>
      </button>

      <button
        type="button"
        className="press-handwheel__mark"
        onClick={() => onWord?.(WORD_NEXT[word])}
        onKeyDown={onMarkKey}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onFocus={() => setIsHovered(true)}
        onBlur={() => setIsHovered(false)}
        aria-label={`Cycle the active mark to ${WORD_NEXT[word]} (${WORD_LABEL[WORD_NEXT[word]]}). Currently marked at ${WORD_LABEL[word]}.`}
        aria-pressed={false}
      >
        <span className="press-handwheel__mark-plate" aria-hidden="true">
          <WheelMark word={word} letter={WORD_LABEL[word]} />
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
          <span className="press-handwheel__mark-readout-tick" aria-hidden="true">
            {Array.from({ length: TICK_COUNT }).map((_, index) => (
              <span
                key={`tick-${index}`}
                className={`press-handwheel__mark-readout-tick-cell ${index < filledTicks ? 'is-on' : ''} ${index === justSetTick && justSetTick >= 0 ? 'is-just-set' : ''}`}
              />
            ))}
          </span>
        </span>
      </button>

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
