import { useEffect, useId, useRef, useState, type CSSProperties } from 'react'
import type { VoiceId } from './Press'
import type { WordId } from './notes'
import type { ImpressionMark } from './ImpressionRibbon'

type PressRegisterProps = {
  voice: VoiceId
  word: WordId
  marks: ImpressionMark[]
  setToday: string
}

const VOICE_LETTER: Record<VoiceId, string> = { quiet: 'A', human: 'B', bold: 'C' }
const VOICE_NAME: Record<VoiceId, string> = { quiet: 'quiet cut', human: 'human hand', bold: 'bold signal' }
const VOICE_FACE: Record<VoiceId, string> = {
  quiet: 'serif · italic · close set',
  human: 'serif · italic · warm',
  bold: 'sans · heavy · no apology',
}
const VOICE_TONE: Record<VoiceId, string> = {
  quiet: 'var(--blue)',
  human: 'var(--coral)',
  bold: 'var(--acid)',
}

const WORD_GLYPH: Record<WordId, string> = { m3: '⌇', good: '∧', yet: '?' }
const WORD_LABEL: Record<WordId, string> = { m3: 'm³', good: 'good at', yet: 'yet?' }
const WORD_MARK: Record<WordId, string> = { m3: 'stet', good: 'caret', yet: 'query' }
const WORD_TONE: Record<WordId, string> = { m3: 'var(--acid)', good: 'var(--coral)', yet: 'var(--blue)' }

const MAX_THREAD_MARKS = 16

export function PressRegister({ voice, word, marks, setToday }: PressRegisterProps) {
  const baseId = useId().replace(/:/g, '')
  const ruleGrainId = `press-register-rule-grain-${baseId}`
  const rootRef = useRef<HTMLDivElement>(null)
  const [revealed, setRevealed] = useState(false)
  const [pressedTick, setPressedTick] = useState(0)

  const tone = VOICE_TONE[voice]
  const wordTone = WORD_TONE[word]
  const style = {
    '--pr-tone': tone,
    '--pr-word-tone': wordTone,
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
      { threshold: 0.05, rootMargin: '0px 0px -2% 0px' },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    setPressedTick(value => value + 1)
  }, [marks.length])

  const thread = marks.slice(-MAX_THREAD_MARKS)
  const last = thread[thread.length - 1]
  const totalMarks = marks.length

  const markDescription = last
    ? last.kind === 'voice'
      ? `voice ${VOICE_LETTER[last.voice]} · ${VOICE_NAME[last.voice]}`
      : last.kind === 'pull'
      ? `pulled to ${VOICE_LETTER[last.voice]} · ${VOICE_NAME[last.voice]}`
      : `marked ${WORD_LABEL[last.word]} · ${WORD_MARK[last.word]}`
    : 'awaiting the first press'

  return (
    <div
      ref={rootRef}
      className={`press-register press-register--${voice} press-register--word-${word} ${revealed ? 'is-revealed' : ''} ${totalMarks === 0 ? 'is-idle' : ''}`}
      style={style}
      role="group"
      aria-label={`Press register · active voice ${VOICE_LETTER[voice]} · ${VOICE_NAME[voice]} · marked at ${WORD_LABEL[word]} · ${WORD_MARK[word]} · set on ${setToday} · ${markDescription}.`}
    >
      <svg className="press-register__defs" viewBox="0 0 1200 60" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <filter id={ruleGrainId} x="-2%" y="-50%" width="104%" height="200%">
            <feTurbulence type="fractalNoise" baseFrequency="2.4" numOctaves="2" seed="31" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .45 0" />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
        </defs>
      </svg>

      <span className="press-register__hairline press-register__hairline--top" aria-hidden="true" />

      <span className="press-register__crop press-register__crop--tl" aria-hidden="true" />
      <span className="press-register__crop press-register__crop--tr" aria-hidden="true" />
      <span className="press-register__crop press-register__crop--bl" aria-hidden="true" />
      <span className="press-register__crop press-register__crop--br" aria-hidden="true" />

      <div className="press-register__cell press-register__cell--voice" aria-live="polite">
        <span className="press-register__cell-key" aria-hidden="true">
          <span className="press-register__cell-key-mark" />
          voice
        </span>
        <span className={`press-register__voice press-register__voice--${voice}`} aria-hidden="true">
          <span className="press-register__voice-letter">{VOICE_LETTER[voice]}</span>
          <span className="press-register__voice-glow" />
        </span>
        <span className="press-register__cell-name">
          <em>{VOICE_NAME[voice]}</em>
          <span className="press-register__cell-face">{VOICE_FACE[voice]}</span>
        </span>
      </div>

      <span className="press-register__rule press-register__rule--lead" aria-hidden="true">
        <svg viewBox="0 0 80 8" preserveAspectRatio="none">
          <g filter={`url(#${ruleGrainId})`}>
            <path
              className="press-register__rule-stroke"
              d="M2 4c10-3 20 3 30 0s20-3 30 0 14 1 16 0"
              fill="none"
              stroke="currentColor"
              strokeWidth=".7"
              strokeLinecap="round"
              pathLength="100"
            />
          </g>
          <circle cx="78" cy="4" r="1" fill="currentColor" className="press-register__rule-bead" />
        </svg>
      </span>

      <div className="press-register__thread" aria-hidden="true">
        <span className="press-register__thread-rail" />
        <span className="press-register__thread-rail press-register__thread-rail--in" />
        <ol className="press-register__thread-marks">
          {thread.map((mark, index) => {
            const ratio = thread.length <= 1 ? 1 : index / (thread.length - 1)
            const isLatest = index === thread.length - 1
            const cls =
              mark.kind === 'pull'
                ? `press-register__thread-mark press-register__thread-mark--pull press-register__thread-mark--voice-${mark.voice}`
                : mark.kind === 'voice'
                ? `press-register__thread-mark press-register__thread-mark--voice press-register__thread-mark--voice-${mark.voice}`
                : `press-register__thread-mark press-register__thread-mark--word press-register__thread-mark--word-${mark.word}`
            return (
              <li
                key={`pr-${mark.kind}-${index}-${ratio.toFixed(3)}`}
                className={`${cls} ${isLatest ? 'is-latest' : ''}`}
                style={{ left: `${ratio * 100}%` }}
              >
                <span className="press-register__thread-mark-bead" />
                {mark.kind === 'voice' && (
                  <span className="press-register__thread-mark-letter">{VOICE_LETTER[mark.voice]}</span>
                )}
                {mark.kind === 'word' && (
                  <span className="press-register__thread-mark-glyph">{WORD_GLYPH[mark.word]}</span>
                )}
                {mark.kind === 'pull' && <span className="press-register__thread-mark-pull" />}
                {isLatest && pressedTick > 1 && (
                  <span key={`pr-splash-${pressedTick}-${index}`} className="press-register__thread-mark-splash" />
                )}
              </li>
            )
          })}
        </ol>
        <span
          key={`pr-now-${pressedTick}`}
          className={`press-register__thread-now ${
            last
              ? last.kind === 'pull'
                ? 'press-register__thread-now--pull'
                : last.kind === 'voice'
                ? `press-register__thread-now--voice-${last.voice}`
                : `press-register__thread-now--word-${last.word}`
              : 'press-register__thread-now--idle'
          }`}
          style={{ left: `${thread.length === 0 ? 0 : 100}%` }}
        >
          <span className="press-register__thread-now-bead" />
          <span className="press-register__thread-now-tail" />
        </span>
      </div>

      <span className="press-register__rule press-register__rule--trail" aria-hidden="true">
        <svg viewBox="0 0 80 8" preserveAspectRatio="none">
          <g filter={`url(#${ruleGrainId})`}>
            <path
              className="press-register__rule-stroke press-register__rule-stroke--trail"
              d="M2 4c10-3 20 3 30 0s20-3 30 0 14 1 16 0"
              fill="none"
              stroke="currentColor"
              strokeWidth=".7"
              strokeLinecap="round"
              opacity=".7"
              pathLength="100"
            />
          </g>
          <circle cx="2" cy="4" r="1" fill="currentColor" className="press-register__rule-bead press-register__rule-bead--trail" />
        </svg>
      </span>

      <div className="press-register__cell press-register__cell--word" aria-live="polite">
        <span className="press-register__cell-key" aria-hidden="true">
          mark
          <span className="press-register__cell-key-mark press-register__cell-key-mark--alt" />
        </span>
        <span className={`press-register__word press-register__word--${word}`} aria-hidden="true">
          <span className="press-register__word-glyph">{WORD_GLYPH[word]}</span>
          <span className="press-register__word-glow" />
        </span>
        <span className="press-register__cell-name">
          <em>{WORD_LABEL[word]}</em>
          <span className="press-register__cell-face">{WORD_MARK[word]}</span>
        </span>
      </div>

      <span className="press-register__set" aria-hidden="true">
        <span className="press-register__set-mark" />
        <span className="press-register__set-line">
          set <em>{setToday}</em>
        </span>
        <span className="press-register__set-mark press-register__set-mark--alt" />
      </span>

      <span className="press-register__hairline press-register__hairline--bottom" aria-hidden="true" />
    </div>
  )
}
