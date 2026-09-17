import { useEffect, useId, useRef, useState, type CSSProperties } from 'react'
import type { VoiceId } from './Press'
import type { WordId } from './notes'

type TitleCodaProps = {
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

export function TitleCoda({ voice, word, setToday }: TitleCodaProps) {
  const baseId = useId().replace(/:/g, '')
  const grainId = `title-coda-grain-${baseId}`
  const haloId = `title-coda-halo-${baseId}`
  const rootRef = useRef<HTMLElement>(null)
  const [revealed, setRevealed] = useState(false)
  const tone = VOICE_TONE[voice]
  const style = {
    '--title-coda-tone': tone,
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
      { threshold: 0.18, rootMargin: '0px 0px -6% 0px' },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <aside
      ref={rootRef}
      className={`title-coda title-coda--${voice} title-coda--word-${word} ${revealed ? 'is-revealed' : ''}`}
      style={style}
      aria-label={`The title page's coda · folio i closes · set today ${setToday} · in the ${VOICE_NAME[voice]} voice · marked at ${WORD_LABEL[word]} (${WORD_MARK[word]}) · a small pressed mark before the page turns.`}
    >
      <svg className="title-coda__defs" viewBox="0 0 600 80" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <filter id={grainId} x="-2%" y="-12%" width="104%" height="124%">
            <feTurbulence type="fractalNoise" baseFrequency="2.4" numOctaves="2" seed="47" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .5 0" />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
          <radialGradient id={haloId} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="currentColor" stopOpacity=".42" />
            <stop offset="48%" stopColor="currentColor" stopOpacity=".14" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>

      <span className="title-coda__rule title-coda__rule--lead" aria-hidden="true">
        <svg viewBox="0 0 220 6" preserveAspectRatio="none">
          <g filter={`url(#${grainId})`}>
            <path
              className="title-coda__rule-stroke title-coda__rule-stroke--lead"
              d="M2 3c14-3 28 3 42 0s28-3 42 0 28 3 42 0 28-3 42 0 28 3 40 0"
              fill="none"
              stroke="currentColor"
              strokeWidth=".7"
              strokeLinecap="round"
              pathLength="100"
              strokeDasharray="100 100"
            />
          </g>
          <circle cx="2" cy="3" r="1.1" fill="currentColor" className="title-coda__rule-bead title-coda__rule-bead--lead" />
        </svg>
      </span>

      <span className="title-coda__seal" aria-hidden="true">
        <span className="title-coda__seal-halo">
          <svg viewBox="0 0 80 80" preserveAspectRatio="xMidYMid meet">
            <ellipse cx="40" cy="40" rx="36" ry="36" fill={`url(#${haloId})`} className="title-coda__seal-halo-fill" />
          </svg>
        </span>
        <span className="title-coda__seal-disc">
          <svg viewBox="0 0 64 64">
            <defs>
              <filter id={`title-coda-seal-grain-${baseId}`} x="-12%" y="-12%" width="124%" height="124%">
                <feTurbulence type="fractalNoise" baseFrequency="2.6" numOctaves="2" seed="11" stitchTiles="stitch" />
                <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .55 0" />
                <feComposite in2="SourceGraphic" operator="in" />
              </filter>
            </defs>
            <g filter={`url(#title-coda-seal-grain-${baseId})`} opacity=".95">
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
        <span className="title-coda__seal-wax" aria-hidden="true">
          <span className="title-coda__seal-wax-bead" />
          <span className="title-coda__seal-wax-wisp" />
        </span>
        <span className="title-coda__seal-letter" aria-hidden="true">{VOICE_LETTER[voice]}</span>
      </span>

      <span className="title-coda__copy">
        <span className="title-coda__copy-mark" aria-hidden="true">¶</span>
        <em className="title-coda__copy-line">
          folio i is set · a single line, three readings, one breath
        </em>
        <span className="title-coda__copy-mark title-coda__copy-mark--alt" aria-hidden="true">¶</span>
      </span>

      <span className="title-coda__signature" aria-hidden="true">
        <svg viewBox="0 0 220 36" preserveAspectRatio="xMidYMid meet">
          <g filter={`url(#${grainId})`}>
            <path
              className="title-coda__signature-stroke title-coda__signature-stroke--lead"
              d="M4 22c10-10 22 6 38-2s22-10 38-2 22 6 38-2 22-8 38-1 22 4 38-1 22-4 32 0"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
              pathLength="100"
            />
            <path
              className="title-coda__signature-stroke title-coda__signature-stroke--trail"
              d="M14 28c8-4 16 4 28-1s22-4 32 0 22 4 32-1 22-4 32-1 20 4 28-1 18-2 28-1 14 2 14 2"
              fill="none"
              stroke="currentColor"
              strokeWidth=".5"
              strokeLinecap="round"
              opacity=".55"
              pathLength="100"
            />
          </g>
          <circle className="title-coda__signature-bead" cx="214" cy="18" r="1.6" fill="currentColor" />
          <circle className="title-coda__signature-halo" cx="214" cy="18" r="4" fill="none" stroke="currentColor" strokeWidth=".3" strokeDasharray=".6 1.4" opacity=".65" />
        </svg>
        <span className="title-coda__signature-tag">
          <span className="title-coda__signature-tag-mark" aria-hidden="true" />
          <em>the title page closes, gently</em>
        </span>
      </span>

      <span className="title-coda__rule title-coda__rule--trail" aria-hidden="true">
        <svg viewBox="0 0 220 6" preserveAspectRatio="none">
          <g filter={`url(#${grainId})`}>
            <path
              className="title-coda__rule-stroke title-coda__rule-stroke--trail"
              d="M2 3c14-3 28 3 42 0s28-3 42 0 28 3 42 0 28-3 42 0 28 3 40 0"
              fill="none"
              stroke="currentColor"
              strokeWidth=".7"
              strokeLinecap="round"
              pathLength="100"
              strokeDasharray="100 100"
            />
          </g>
          <circle cx="218" cy="3" r="1.1" fill="currentColor" className="title-coda__rule-bead title-coda__rule-bead--trail" />
        </svg>
      </span>

      <span className="sr-only" aria-live="polite">
        {`Title page coda set in ${VOICE_NAME[voice]}, marked at ${WORD_LABEL[word]} (${WORD_MARK[word]}). Set today ${setToday}.`}
      </span>
    </aside>
  )
}