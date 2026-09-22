import { useEffect, useId, useRef, useState, type CSSProperties } from 'react'
import type { VoiceId } from './App'
import type { WordId } from './notes'

type QuestionHeldProps = {
  voice: VoiceId
  word: WordId
}

const HOLD_COPY: Record<VoiceId, string> = {
  quiet: 'set softly',
  human: 'set by hand',
  bold: 'set at full height',
}

const HOLD_NOTE: Record<VoiceId, string> = {
  quiet: 'the line is held open — the reader is invited, never instructed.',
  human: 'the line is held warm — the page remembers who is on the other side.',
  bold: 'the line is held tall — the question stands, the page answers back.',
}

const TITLE = 'is Minimax M3 good at frontend yet?'

export function QuestionHeld({ voice, word }: QuestionHeldProps) {
  const baseId = useId().replace(/:/g, '')
  const trackId = `qh-track-${baseId}`
  const glowId = `qh-glow-${baseId}`
  const rootRef = useRef<HTMLElement | null>(null)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setRevealed(true)
      return
    }
    const node = rootRef.current
    if (!node) return
    const obs = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setRevealed(true)
            obs.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.18, rootMargin: '0px 0px -8% 0px' },
    )
    obs.observe(node)
    return () => obs.disconnect()
  }, [])

  const toneStyle = {
    '--qh-tone': `var(--${voice})`,
    '--qh-mark': `var(--qh-mark-${word})`,
  } as CSSProperties

  return (
    <section
      ref={rootRef}
      className={`qh qh--${voice} qh--word-${word} ${revealed ? 'is-revealed' : ''}`}
      style={toneStyle}
      aria-label="The question, held open at the close of the page"
    >
      <span className="qh__sky" aria-hidden="true" />

      <svg
        className="qh__defs"
        viewBox="0 0 1200 80"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={trackId} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--qh-tone)" stopOpacity="0" />
            <stop offset="22%" stopColor="var(--qh-tone)" stopOpacity=".28" />
            <stop offset="50%" stopColor="var(--qh-tone)" stopOpacity=".55" />
            <stop offset="78%" stopColor="var(--qh-tone)" stopOpacity=".28" />
            <stop offset="100%" stopColor="var(--qh-tone)" stopOpacity="0" />
          </linearGradient>
          <radialGradient id={glowId} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--qh-tone)" stopOpacity=".34" />
            <stop offset="55%" stopColor="var(--qh-tone)" stopOpacity=".08" />
            <stop offset="100%" stopColor="var(--qh-tone)" stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>

      <span className="qh__rule qh__rule--top" aria-hidden="true">
        <span className="qh__rule-line" />
        <span className="qh__rule-glyph" aria-hidden="true">
          <svg viewBox="0 0 32 12">
            <circle cx="16" cy="6" r="2" fill="currentColor" />
            <circle cx="16" cy="6" r="5" fill="none" stroke="currentColor" strokeWidth=".5" opacity=".55" />
            <circle cx="2" cy="6" r=".8" fill="currentColor" opacity=".6" />
            <circle cx="30" cy="6" r=".8" fill="currentColor" opacity=".6" />
          </svg>
        </span>
        <span className="qh__rule-line" />
      </span>

      <header className="qh__head" aria-hidden="true">
        <em className="qh__eyebrow">the question, held</em>
        <span className="qh__head-dot" />
        <em className="qh__eyebrow qh__eyebrow--right">{HOLD_COPY[voice]}</em>
      </header>

      <p className="qh__line" aria-label={TITLE}>
        <span className="qh__line-word qh__line-word--is">is</span>
        <span className="qh__line-mark qh__line-mark--m3" aria-hidden="true">
          <svg viewBox="0 0 12 12">
            <circle cx="6" cy="6" r="4.4" fill="none" stroke="currentColor" strokeWidth=".55" />
            <circle cx="6" cy="6" r="1.4" fill="currentColor" />
          </svg>
        </span>
        <span className="qh__line-word qh__line-word--name">Minimax M3</span>
        <span className="qh__line-mark qh__line-mark--good" aria-hidden="true">
          <svg viewBox="0 0 12 12">
            <circle cx="6" cy="6" r="4.4" fill="none" stroke="currentColor" strokeWidth=".55" />
            <circle cx="6" cy="6" r="1.4" fill="currentColor" />
          </svg>
        </span>
        <span className="qh__line-word qh__line-word--good">good at frontend</span>
        <span className="qh__line-mark qh__line-mark--yet" aria-hidden="true">
          <svg viewBox="0 0 12 12">
            <circle cx="6" cy="6" r="4.4" fill="none" stroke="currentColor" strokeWidth=".55" />
            <circle cx="6" cy="6" r="1.4" fill="currentColor" />
          </svg>
        </span>
        <span className="qh__line-word qh__line-word--yet">yet</span>
        <span className="qh__line-q" aria-hidden="true">?</span>
      </p>

      <span className="qh__thread" aria-hidden="true">
        <svg viewBox="0 0 1200 24" preserveAspectRatio="none">
          <line
            x1="0"
            y1="12"
            x2="1200"
            y2="12"
            stroke={`url(#${trackId})`}
            strokeWidth=".9"
            strokeLinecap="round"
          />
          <line
            x1="0"
            y1="12"
            x2="1200"
            y2="12"
            stroke="currentColor"
            strokeWidth=".4"
            strokeDasharray="1.4 4.6"
            opacity=".45"
          />
        </svg>
      </span>

      <p className="qh__note" aria-hidden="true">
        <em>{HOLD_NOTE[voice]}</em>
      </p>

      <footer className="qh__foot" aria-hidden="true">
        <span className="qh__foot-rule" />
        <span className="qh__foot-mark">
          <svg viewBox="0 0 18 18">
            <circle cx="9" cy="9" r="7.2" fill={`url(#${glowId})`} />
            <circle cx="9" cy="9" r="3.2" fill="currentColor" />
            <circle cx="9" cy="9" r=".8" fill="var(--night)" />
          </svg>
        </span>
        <em className="qh__foot-line">let the question stand · set three ways · read again</em>
        <span className="qh__foot-mark">
          <svg viewBox="0 0 18 18">
            <circle cx="9" cy="9" r="7.2" fill={`url(#${glowId})`} />
            <circle cx="9" cy="9" r="3.2" fill="currentColor" />
            <circle cx="9" cy="9" r=".8" fill="var(--night)" />
          </svg>
        </span>
        <span className="qh__foot-rule" />
      </footer>
    </section>
  )
}
