import { useEffect, useId, useRef, useState, type CSSProperties } from 'react'
import type { VoiceId } from './Press'

type ReadingFloorProps = {
  voice: VoiceId
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
const VOICE_LETTER: Record<VoiceId, string> = {
  quiet: 'A',
  human: 'B',
  bold: 'C',
}
const VOICE_FACE: Record<VoiceId, string> = {
  quiet: 'serif · italic · close set',
  human: 'serif · italic · warm',
  bold: 'sans · heavy · no apology',
}
const VOICE_LINES: Record<VoiceId, [string, string, string]> = {
  quiet: ['is Minimax', 'good at frontend', 'yet?'],
  human: ['is M3', 'good at frontend', 'yet?'],
  bold: ['IS', 'GOOD AT', 'FRONTEND YET?'],
}
const VOICE_GLYPH: Record<VoiceId, string> = {
  quiet: '⌇',
  human: '✦',
  bold: '■',
}

const VOICES: VoiceId[] = ['quiet', 'human', 'bold']

const VOICE_SETTING: Record<VoiceId, { family: string; weight: number; style: 'normal' | 'italic'; track: string; size: string; sizeMobile: string }> = {
  quiet: { family: 'var(--serif)', weight: 400, style: 'italic', track: '-.022em', size: 'clamp(38px, 5.4vw, 74px)', sizeMobile: 'clamp(28px, 8vw, 40px)' },
  human: { family: 'var(--serif)', weight: 500, style: 'italic', track: '-.018em', size: 'clamp(38px, 5.4vw, 74px)', sizeMobile: 'clamp(28px, 8vw, 40px)' },
  bold: { family: 'var(--sans)', weight: 800, style: 'normal', track: '-.05em', size: 'clamp(32px, 4.8vw, 64px)', sizeMobile: 'clamp(24px, 7vw, 34px)' },
}

export function ReadingFloor({ voice, setToday }: ReadingFloorProps) {
  const rootRef = useRef<HTMLElement>(null)
  const [revealed, setRevealed] = useState(false)
  const [pulse, setPulse] = useState(0)
  const baseId = useId().replace(/:/g, '')
  const grainId = `reading-floor-grain-${baseId}`
  const inkId = `reading-floor-ink-${baseId}`
  const setting = VOICE_SETTING[voice]
  const tone = VOICE_TONE[voice]
  const lines = VOICE_LINES[voice]
  const glyph = VOICE_GLYPH[voice]

  const style = {
    '--reading-floor-tone': tone,
    '--reading-floor-paper': 'rgba(243, 236, 214, .045)',
    '--reading-font': setting.family,
    '--reading-weight': String(setting.weight),
    '--reading-style': setting.style,
    '--reading-track': setting.track,
    '--reading-size': setting.size,
    '--reading-size-mobile': setting.sizeMobile,
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

  useEffect(() => {
    setPulse(value => value + 1)
  }, [voice])

  return (
    <section
      ref={rootRef}
      className={`reading-floor reading-floor--${voice} ${revealed ? 'is-revealed' : ''}`}
      style={style}
      aria-label="A reading floor between the second reading and the answer"
    >
      <span className="reading-floor__plate-tag" aria-hidden="true">folio vii · the reading floor</span>

      <svg className="reading-floor__grain" viewBox="0 0 1200 600" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <filter id={grainId} x="0%" y="0%" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.86" numOctaves="2" seed="33" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 .14  0 0 0 0 .13  0 0 0 0 .2  0 0 0 .04 0" />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
          <filter id={inkId} x="-2%" y="-30%" width="104%" height="160%">
            <feTurbulence type="fractalNoise" baseFrequency="2.6" numOctaves="2" seed="19" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .42 0" />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
        </defs>
        <rect x="0" y="0" width="1200" height="600" filter={`url(#${grainId})`} />
      </svg>

      <span className="reading-floor__crop reading-floor__crop--tl" aria-hidden="true" />
      <span className="reading-floor__crop reading-floor__crop--tr" aria-hidden="true" />
      <span className="reading-floor__crop reading-floor__crop--bl" aria-hidden="true" />
      <span className="reading-floor__crop reading-floor__crop--br" aria-hidden="true" />

      <span className="reading-floor__dogeare reading-floor__dogeare--tr" aria-hidden="true">
        <svg viewBox="0 0 60 60" preserveAspectRatio="none">
          <path d="M60 0 L0 60 L60 60 Z" fill="rgba(17,21,33,.08)" />
          <path d="M60 0 L0 60" stroke="rgba(17,21,33,.22)" strokeWidth=".8" fill="none" />
        </svg>
      </span>

      <header className="reading-floor__head">
        <span className="reading-floor__head-eyebrow" aria-hidden="true">
          <span className="reading-floor__head-eyebrow-line" />
          <span>the reading floor</span>
          <span className="reading-floor__head-eyebrow-sep" aria-hidden="true">·</span>
          <em>a breath before the answer</em>
          <span className="reading-floor__head-eyebrow-line reading-floor__head-eyebrow-line--alt" />
        </span>
        <p className="reading-floor__head-lede">
          Before the answer is folded open, <em>read the question one last time</em> in the voice you have set on the press.
        </p>
      </header>

      <div className="reading-floor__stage" aria-hidden="true">
        <span className="reading-floor__stage-frame reading-floor__stage-frame--tl" />
        <span className="reading-floor__stage-frame reading-floor__stage-frame--tr" />
        <span className="reading-floor__stage-frame reading-floor__stage-frame--bl" />
        <span className="reading-floor__stage-frame reading-floor__stage-frame--br" />

        <span className="reading-floor__stage-mark reading-floor__stage-mark--lead">
          <svg viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth=".5" />
            <circle cx="12" cy="12" r="3" fill="currentColor" />
          </svg>
        </span>
        <span className="reading-floor__stage-mark reading-floor__stage-mark--trail">
          <svg viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth=".5" />
            <path d="M12 6v12M6 12h12" stroke="currentColor" strokeWidth=".55" strokeLinecap="round" />
          </svg>
        </span>

        <span className="reading-floor__stage-tag reading-floor__stage-tag--lead">folio vii</span>
        <span className="reading-floor__stage-tag reading-floor__stage-tag--trail">set in <em>{VOICE_NAME[voice]}</em></span>

        <div
          key={`reading-${voice}-${pulse}`}
          className={`reading-floor__specimen reading-floor__specimen--${voice}`}
        >
          {lines.map((line, idx) => (
            <span key={`${voice}-${idx}-${pulse}`} className="reading-floor__specimen-line">
              {line}
            </span>
          ))}
        </div>

        <span className="reading-floor__stage-glyph" aria-hidden="true">{glyph}</span>

        <span className="reading-floor__stage-rule reading-floor__stage-rule--top">
          <svg viewBox="0 0 800 8" preserveAspectRatio="none">
            <path
              className="reading-floor__stage-rule-stroke"
              d="M2 4c30-3 60 3 90 0s60-3 90 0 60 3 90 0 60-3 90 0 60 3 90 0 60-3 90 0 60 3 90 0 60-3 90 0 30 1 28 0"
              fill="none"
              stroke="currentColor"
              strokeWidth=".7"
              strokeLinecap="round"
              pathLength="100"
            />
            <circle cx="2" cy="4" r="1.1" fill="currentColor" />
            <circle cx="798" cy="4" r="1.1" fill="currentColor" />
          </svg>
        </span>
        <span className="reading-floor__stage-rule reading-floor__stage-rule--bottom">
          <svg viewBox="0 0 800 8" preserveAspectRatio="none">
            <path
              className="reading-floor__stage-rule-stroke reading-floor__stage-rule-stroke--alt"
              d="M2 4c30-3 60 3 90 0s60-3 90 0 60 3 90 0 60-3 90 0 60 3 90 0 60-3 90 0 60 3 90 0 60-3 90 0 30 1 28 0"
              fill="none"
              stroke="currentColor"
              strokeWidth=".7"
              strokeLinecap="round"
              pathLength="100"
            />
            <circle cx="2" cy="4" r="1.1" fill="currentColor" />
            <circle cx="798" cy="4" r="1.1" fill="currentColor" />
          </svg>
        </span>
      </div>

      <div className="reading-floor__voices">
        <span className="reading-floor__voices-eyebrow" aria-hidden="true">
          <span className="reading-floor__voices-eyebrow-rule" />
          the three voices
          <span className="reading-floor__voices-eyebrow-rule" />
        </span>
        <ol className="reading-floor__voice-list" aria-label="The three voices">
          {VOICES.map((id) => {
            const isActive = id === voice
            return (
              <li
                key={id}
                className={`reading-floor__voice reading-floor__voice--${id} ${isActive ? 'is-active' : ''}`}
              >
                <span className="reading-floor__voice-mark" aria-hidden="true">
                  <svg viewBox="0 0 16 16">
                    <circle cx="8" cy="8" r="6.6" fill="none" stroke="currentColor" strokeWidth=".5" />
                    <circle cx="8" cy="8" r={isActive ? '2.6' : '1.5'} fill="currentColor" />
                  </svg>
                </span>
                <span className="reading-floor__voice-letter" aria-hidden="true">{VOICE_LETTER[id]}</span>
                <span className="reading-floor__voice-copy">
                  <span className="reading-floor__voice-name">{VOICE_NAME[id]}</span>
                  <span className="reading-floor__voice-face">{VOICE_FACE[id]}</span>
                </span>
                {isActive && <span className="reading-floor__voice-now" aria-hidden="true">now</span>}
              </li>
            )
          })}
        </ol>
      </div>

      <footer className="reading-floor__foot">
        <span className="reading-floor__fold" aria-hidden="true">
          <svg className="reading-floor__fold-svg" viewBox="0 0 200 32" preserveAspectRatio="none">
            <path
              d="M2 16c20-12 50 12 80 0s60-16 100-2"
              fill="none"
              stroke="currentColor"
              strokeWidth=".8"
              strokeLinecap="round"
              strokeDasharray="2 2.4"
            />
          </svg>
          <span className="reading-floor__fold-tag">
            <span className="reading-floor__fold-tag-mark" aria-hidden="true">↓</span>
            fold · here
            <span className="reading-floor__fold-tag-mark" aria-hidden="true">↓</span>
          </span>
        </span>
        <span className="reading-floor__meta">
          <span className="reading-floor__meta-cell">
            <span className="reading-floor__meta-key">set today</span>
            <em className="reading-floor__meta-value">{setToday}</em>
          </span>
          <span className="reading-floor__meta-cell">
            <span className="reading-floor__meta-key">the next impression</span>
            <em className="reading-floor__meta-value">folio viii · the answer</em>
          </span>
          <span className="reading-floor__meta-cell">
            <span className="reading-floor__meta-key">one question</span>
            <em className="reading-floor__meta-value">three settings · one mark</em>
          </span>
        </span>
      </footer>
    </section>
  )
}