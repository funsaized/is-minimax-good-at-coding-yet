import { useEffect, useId, useRef, useState, type CSSProperties } from 'react'
import type { VoiceId } from './Press'
import type { WordId } from './notes'

type PressReceiptProps = {
  voice: VoiceId
  word: WordId
  setToday: string
}

const VOICE_TONE: Record<VoiceId, string> = {
  quiet: 'var(--blue)',
  human: 'var(--coral)',
  bold: 'var(--acid)',
}

const VOICE_LETTER: Record<VoiceId, string> = { quiet: 'a', human: 'b', bold: 'c' }
const VOICE_NAME: Record<VoiceId, string> = {
  quiet: 'quiet cut',
  human: 'human hand',
  bold: 'bold signal',
}

const VOICES_TOUCHED: VoiceId[] = ['quiet', 'human', 'bold']

const WORD_LABEL: Record<WordId, string> = { m3: 'm³', good: 'good at', yet: 'yet?' }
const WORD_MARK: Record<WordId, string> = { m3: 'stet', good: 'caret', yet: 'query' }
const WORD_GLYPH: Record<WordId, string> = { m3: '⌇', good: '∧', yet: '?' }

export function PressReceipt({ voice, word, setToday }: PressReceiptProps) {
  const baseId = useId().replace(/:/g, '')
  const ruleGrainId = `press-receipt-rule-grain-${baseId}`
  const rootRef = useRef<HTMLElement>(null)
  const [revealed, setRevealed] = useState(false)
  const tone = VOICE_TONE[voice]
  const style = { '--press-receipt-tone': tone } as CSSProperties

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
        const visible = entries.some(entry => entry.isIntersecting)
        if (visible) {
          setRevealed(true)
          observer.disconnect()
        }
      },
      { threshold: 0.16, rootMargin: '0px 0px -6% 0px' },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={rootRef}
      className={`press-receipt press-receipt--${voice} ${revealed ? 'is-revealed' : ''}`}
      style={style}
      aria-label={`Press receipt · impression of folio viii · voice ${VOICE_NAME[voice]} · marked at ${WORD_LABEL[word]} (${WORD_MARK}) · set ${setToday}`}
    >
      <svg className="press-receipt__defs" viewBox="0 0 200 12" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <filter id={ruleGrainId} x="-2%" y="-50%" width="104%" height="200%">
            <feTurbulence type="fractalNoise" baseFrequency="2.4" numOctaves="2" seed="79" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .42 0" />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
        </defs>
      </svg>

      <span className="press-receipt__rule press-receipt__rule--lead" aria-hidden="true">
        <svg viewBox="0 0 600 4" preserveAspectRatio="none">
          <g filter={`url(#${ruleGrainId})`}>
            <path
              className="press-receipt__rule-stroke"
              d="M2 2c40-2 80 2 120 0s80-2 120 0 80 2 120 0 80-2 120 0 40-2 78 0"
              fill="none"
              stroke="currentColor"
              strokeWidth=".5"
              strokeLinecap="round"
              pathLength="100"
            />
          </g>
          <circle className="press-receipt__rule-bead" cx="2" cy="2" r=".9" fill="currentColor" />
          <circle className="press-receipt__rule-bead press-receipt__rule-bead--end" cx="598" cy="2" r=".9" fill="currentColor" />
        </svg>
      </span>

      <div className="press-receipt__body">
        <span className="press-receipt__cell press-receipt__cell--voices" aria-hidden="false">
          <span className="press-receipt__cell-key">voices touched</span>
          <span className="press-receipt__cell-value press-receipt__voices">
            {VOICES_TOUCHED.map((v, idx) => (
              <span key={`pr-voice-${v}`} className="press-receipt__voice-stack">
                <span
                  className={`press-receipt__voice-letter press-receipt__voice-letter--${v} ${v === voice ? 'is-active' : ''}`}
                  aria-hidden="true"
                  aria-label={`voice ${VOICE_NAME[v]}`}
                >
                  {VOICE_LETTER[v]}
                </span>
                {idx < VOICES_TOUCHED.length - 1 && <span className="press-receipt__voice-tick" aria-hidden="true">·</span>}
              </span>
            ))}
          </span>
        </span>

        <span className="press-receipt__divider" aria-hidden="true">
          <svg viewBox="0 0 12 24" preserveAspectRatio="none">
            <g filter={`url(#${ruleGrainId})`}>
              <line x1="6" y1="2" x2="6" y2="22" stroke="currentColor" strokeWidth=".45" strokeDasharray="1.2 2" strokeLinecap="round" />
            </g>
            <circle cx="6" cy="2" r=".9" fill="currentColor" opacity=".7" />
            <circle cx="6" cy="22" r=".9" fill="currentColor" opacity=".7" />
          </svg>
        </span>

        <span className="press-receipt__cell press-receipt__cell--word" aria-hidden="false">
          <span className="press-receipt__cell-key">marked at</span>
          <span className="press-receipt__cell-value press-receipt__word">
            <span className="press-receipt__word-glyph" aria-hidden="true">{WORD_GLYPH[word]}</span>
            <em className="press-receipt__word-label">{WORD_LABEL[word]}</em>
            <span className="press-receipt__word-mark">{WORD_MARK[word]}</span>
          </span>
        </span>

        <span className="press-receipt__divider" aria-hidden="true">
          <svg viewBox="0 0 12 24" preserveAspectRatio="none">
            <g filter={`url(#${ruleGrainId})`}>
              <line x1="6" y1="2" x2="6" y2="22" stroke="currentColor" strokeWidth=".45" strokeDasharray="1.2 2" strokeLinecap="round" />
            </g>
            <circle cx="6" cy="2" r=".9" fill="currentColor" opacity=".7" />
            <circle cx="6" cy="22" r=".9" fill="currentColor" opacity=".7" />
          </svg>
        </span>

        <span className="press-receipt__cell press-receipt__cell--date" aria-hidden="false">
          <span className="press-receipt__cell-key">impression set</span>
          <span className="press-receipt__cell-value press-receipt__date">
            <em className="press-receipt__date-text">{setToday}</em>
            <span className="press-receipt__date-mark" aria-hidden="true">m³</span>
          </span>
        </span>
      </div>

      <span className="press-receipt__rule press-receipt__rule--trail" aria-hidden="true">
        <svg viewBox="0 0 600 4" preserveAspectRatio="none">
          <g filter={`url(#${ruleGrainId})`}>
            <path
              className="press-receipt__rule-stroke press-receipt__rule-stroke--trail"
              d="M2 2c40-2 80 2 120 0s80-2 120 0 80 2 120 0 80-2 120 0 40-2 78 0"
              fill="none"
              stroke="currentColor"
              strokeWidth=".4"
              strokeLinecap="round"
              opacity=".55"
              pathLength="100"
            />
          </g>
          <circle className="press-receipt__rule-bead" cx="2" cy="2" r=".8" fill="currentColor" opacity=".6" />
          <circle className="press-receipt__rule-bead press-receipt__rule-bead--end" cx="598" cy="2" r=".8" fill="currentColor" opacity=".6" />
        </svg>
      </span>

      <span className="press-receipt__postscript" aria-hidden="false">
        <span className="press-receipt__postscript-mark" aria-hidden="true">¶</span>
        <em className="press-receipt__postscript-text">
          a single composed receipt, set today <span aria-hidden="true">·</span> voice <em>{VOICE_NAME[voice]}</em> <span aria-hidden="true">·</span> marked <em>{WORD_LABEL[word]}</em>
        </em>
      </span>

      <span className="sr-only" aria-live="polite">
        {`Press receipt. Voice ${VOICE_NAME[voice]}. Marked at ${WORD_LABEL[word]}, ${WORD_MARK[word]}. Set ${setToday}.`}
      </span>
    </section>
  )
}