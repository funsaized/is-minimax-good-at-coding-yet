import { useEffect, useId, useRef, useState, type CSSProperties } from 'react'
import type { VoiceId } from './Press'
import type { WordId } from './notes'

type AnswerCodaProps = {
  voice: VoiceId
  word: WordId
  setToday: string
}

const VOICE_TONE: Record<VoiceId, string> = {
  quiet: 'var(--blue)',
  human: 'var(--coral)',
  bold: 'var(--acid)',
}

const VOICE_NAME: Record<VoiceId, string> = {
  quiet: 'quiet cut',
  human: 'human hand',
  bold: 'bold signal',
}

const VOICE_LETTER: Record<VoiceId, string> = { quiet: 'A', human: 'B', bold: 'C' }

const WORD_LABEL: Record<WordId, string> = { m3: 'm³', good: 'good at', yet: 'yet?' }
const WORD_MARK: Record<WordId, string> = { m3: 'stet', good: 'caret', yet: 'query' }

export function AnswerCoda({ voice, word, setToday }: AnswerCodaProps) {
  const baseId = useId().replace(/:/g, '')
  const grainId = `answer-coda-grain-${baseId}`
  const ruleGrainId = `answer-coda-rule-grain-${baseId}`
  const sealGrainId = `answer-coda-seal-grain-${baseId}`
  const rootRef = useRef<HTMLDivElement>(null)
  const [revealed, setRevealed] = useState(false)
  const tone = VOICE_TONE[voice]
  const style = {
    '--answer-coda-tone': tone,
  } as CSSProperties

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
      { threshold: 0.2, rootMargin: '0px 0px -8% 0px' },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={rootRef}
      className={`answer-coda answer-coda--${voice} answer-coda--word-${word} ${revealed ? 'is-revealed' : ''}`}
      style={style}
      aria-label={`The answer leaf's coda · folio viii closes · set today ${setToday} · in the ${VOICE_NAME[voice]} voice · marked at ${WORD_LABEL[word]} (${WORD_MARK[word]}) · a small pressed mark before the leaf folds back.`}
    >
      <svg className="answer-coda__defs" viewBox="0 0 600 80" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <filter id={grainId} x="-2%" y="-12%" width="104%" height="124%">
            <feTurbulence type="fractalNoise" baseFrequency="2.4" numOctaves="2" seed="83" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .42 0" />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
          <filter id={ruleGrainId} x="-2%" y="-50%" width="104%" height="200%">
            <feTurbulence type="fractalNoise" baseFrequency="2.6" numOctaves="2" seed="89" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .5 0" />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
          <filter id={sealGrainId} x="-12%" y="-12%" width="124%" height="124%">
            <feTurbulence type="fractalNoise" baseFrequency="2.6" numOctaves="2" seed="97" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .5 0" />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
        </defs>
      </svg>

      <span className="answer-coda__rule answer-coda__rule--lead" aria-hidden="true">
        <svg viewBox="0 0 220 6" preserveAspectRatio="none">
          <g filter={`url(#${ruleGrainId})`}>
            <path
              className="answer-coda__rule-stroke answer-coda__rule-stroke--lead"
              d="M2 3c14-3 28 3 42 0s28-3 42 0 28 3 42 0 28-3 42 0 28 3 40 0"
              fill="none"
              stroke="currentColor"
              strokeWidth=".7"
              strokeLinecap="round"
              pathLength="100"
              strokeDasharray="100 100"
            />
          </g>
          <circle cx="2" cy="3" r="1.1" fill="currentColor" className="answer-coda__rule-bead answer-coda__rule-bead--lead" />
        </svg>
      </span>

      <span className="answer-coda__seal" aria-hidden="true">
        <span className="answer-coda__seal-disc">
          <svg viewBox="0 0 64 64">
            <g filter={`url(#${sealGrainId})`} opacity=".92">
              <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeWidth=".9" />
              <circle cx="32" cy="32" r="22" fill="none" stroke="currentColor" strokeWidth=".35" strokeDasharray=".8 1.6" opacity=".7" />
              <circle cx="32" cy="32" r="14" fill="none" stroke="currentColor" strokeWidth=".4" opacity=".55" />
              <path
                d="M32 6 L32 12 M32 52 L32 58 M6 32 L12 32 M52 32 L58 32 M11 11 L15 15 M49 49 L53 53 M11 53 L15 49 M49 15 L53 11"
                stroke="currentColor"
                strokeWidth=".5"
                strokeLinecap="round"
                opacity=".7"
              />
              <text
                x="32"
                y="38"
                textAnchor="middle"
                fontFamily="'Iowan Old Style', Georgia, serif"
                fontStyle="italic"
                fontSize="22"
                fill="currentColor"
              >m³</text>
            </g>
          </svg>
        </span>
        <span className="answer-coda__seal-wax" aria-hidden="true">
          <span className="answer-coda__seal-wax-bead" />
          <span className="answer-coda__seal-wax-wisp" />
        </span>
        <span className="answer-coda__seal-letter" aria-hidden="true">{VOICE_LETTER[voice]}</span>
      </span>

      <span className="answer-coda__copy">
        <span className="answer-coda__copy-mark" aria-hidden="true">¶</span>
        <em className="answer-coda__copy-line">
          folio viii is set · the leaf folds back, the question stays open
        </em>
        <span className="answer-coda__copy-mark answer-coda__copy-mark--alt" aria-hidden="true">¶</span>
      </span>

      <span className="answer-coda__signature" aria-hidden="true">
        <svg viewBox="0 0 220 36" preserveAspectRatio="xMidYMid meet">
          <g filter={`url(#${grainId})`}>
            <path
              className="answer-coda__signature-stroke answer-coda__signature-stroke--lead"
              d="M4 18c8-8 18 4 32-2s22-6 36-1 22 4 36-2 22-4 36 0 22 2 36-2 18 2 18 2"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
              pathLength="100"
            />
            <path
              className="answer-coda__signature-stroke answer-coda__signature-stroke--trail"
              d="M12 24c10-2 18 4 30 0s20-4 30 0 20 2 30-1 20-2 30 0 18 2 26 0 16-1 16-1"
              fill="none"
              stroke="currentColor"
              strokeWidth=".5"
              strokeLinecap="round"
              opacity=".55"
              pathLength="100"
            />
          </g>
          <circle className="answer-coda__signature-bead" cx="212" cy="18" r="1.6" fill="currentColor" />
          <circle className="answer-coda__signature-halo" cx="212" cy="18" r="4" fill="none" stroke="currentColor" strokeWidth=".3" strokeDasharray=".6 1.4" opacity=".65" />
        </svg>
        <span className="answer-coda__signature-tag">
          <span className="answer-coda__signature-tag-mark" aria-hidden="true" />
          <em>the answer leaf closes, gently</em>
        </span>
      </span>

      <span className="answer-coda__rule answer-coda__rule--trail" aria-hidden="true">
        <svg viewBox="0 0 220 6" preserveAspectRatio="none">
          <g filter={`url(#${ruleGrainId})`}>
            <path
              className="answer-coda__rule-stroke answer-coda__rule-stroke--trail"
              d="M2 3c14-3 28 3 42 0s28-3 42 0 28 3 42 0 28-3 42 0 28 3 40 0"
              fill="none"
              stroke="currentColor"
              strokeWidth=".7"
              strokeLinecap="round"
              pathLength="100"
              strokeDasharray="100 100"
            />
          </g>
          <circle cx="218" cy="3" r="1.1" fill="currentColor" className="answer-coda__rule-bead answer-coda__rule-bead--trail" />
        </svg>
      </span>

      <span className="sr-only" aria-live="polite">
        {`Answer leaf coda set in ${VOICE_NAME[voice]}, marked at ${WORD_LABEL[word]} (${WORD_MARK[word]}). Set today ${setToday}.`}
      </span>
    </div>
  )
}