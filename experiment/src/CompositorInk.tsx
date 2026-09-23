import { useEffect, useId, useState, type CSSProperties } from 'react'
import type { VoiceId } from './App'
import type { WordId } from './notes'

type CompositorInkProps = {
  voice: VoiceId
  word: WordId
}

const VOICE_NOTE: Record<VoiceId, { lead: string; rule: string }> = {
  quiet: {
    lead: 'set softly, once, against itself',
    rule: 'a quiet line is a careful line',
  },
  human: {
    lead: 'set by hand, with a small wobble of warmth',
    rule: 'a hand has touched the line',
  },
  bold: {
    lead: 'set once, at full height, no apology',
    rule: 'the loud voice, kept honest',
  },
}

const WORD_TONE_VAR: Record<WordId, string> = {
  m3: 'var(--quiet)',
  good: 'var(--human)',
  yet: 'var(--bold)',
}

const WORD_GLYPH: Record<WordId, string> = {
  m3: '⌇',
  good: '∧',
  yet: '?',
}

export function CompositorInk({ voice, word }: CompositorInkProps) {
  const baseId = useId().replace(/:/g, '')
  const strokeId = `ci-stroke-${baseId}`
  const glowId = `ci-glow-${baseId}`
  const [reducedMotion, setReducedMotion] = useState(false)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mq.matches)
    const onChange = () => setReducedMotion(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const id = window.setTimeout(() => setShown(true), 180)
    return () => window.clearTimeout(id)
  }, [])

  const note = VOICE_NOTE[voice]
  const wordTone = WORD_TONE_VAR[word]

  const style = {
    '--ci-tone': `var(--${voice})`,
    '--ci-word-tone': wordTone,
  } as CSSProperties

  return (
    <figure
      className={`compositor-ink compositor-ink--${voice} compositor-ink--word-${word} ${
        shown ? 'is-shown' : ''
      } ${reducedMotion ? 'is-quiet' : ''}`}
      style={style}
      aria-label={`The compositor's note · ${note.lead}. ${note.rule}. Marked at ${word}.`}
    >
      <svg className="compositor-ink__defs" aria-hidden="true">
        <defs>
          <linearGradient id={strokeId} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--ci-tone)" stopOpacity="0" />
            <stop offset="14%" stopColor="var(--ci-tone)" stopOpacity=".5" />
            <stop offset="50%" stopColor="var(--ci-tone)" stopOpacity=".85" />
            <stop offset="86%" stopColor="var(--ci-tone)" stopOpacity=".5" />
            <stop offset="100%" stopColor="var(--ci-tone)" stopOpacity="0" />
          </linearGradient>
          <radialGradient id={glowId} cx="50%" cy="50%" r="62%">
            <stop offset="0%" stopColor="var(--ci-tone)" stopOpacity=".14" />
            <stop offset="60%" stopColor="var(--ci-tone)" stopOpacity=".05" />
            <stop offset="100%" stopColor="var(--ci-tone)" stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>

      <span className="compositor-ink__caret" aria-hidden="true">
        <svg viewBox="0 0 14 28">
          <path
            d="M2 4 L8 12 L2 20"
            fill="none"
            stroke="currentColor"
            strokeWidth=".55"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity=".7"
          />
          <circle cx="2" cy="22" r="1.3" fill="currentColor" opacity=".85" />
          <circle cx="2" cy="22" r=".4" fill="var(--night)" />
        </svg>
      </span>

      <span className="compositor-ink__stack">
        <span className="compositor-ink__lead">
          <em className="compositor-ink__lead-quote" aria-hidden="true">“</em>
          <em className="compositor-ink__lead-text">{note.lead}</em>
          <em className="compositor-ink__lead-quote compositor-ink__lead-quote--r" aria-hidden="true">”</em>
        </span>
        <span className="compositor-ink__rule" aria-hidden="true">
          <svg viewBox="0 0 320 6" preserveAspectRatio="none" className="compositor-ink__rule-svg">
            <line
              className="compositor-ink__rule-lead"
              x1="2"
              y1="3"
              x2="318"
              y2="3"
              stroke={`url(#${strokeId})`}
              strokeWidth=".9"
              strokeLinecap="round"
            />
            <line
              className="compositor-ink__rule-hair"
              x1="2"
              y1="3"
              x2="318"
              y2="3"
              stroke="var(--ci-tone)"
              strokeWidth=".32"
              strokeDasharray=".8 3.2"
              opacity=".5"
            />
          </svg>
        </span>
        <span className="compositor-ink__gloss">
          <em className="compositor-ink__gloss-key">the rule</em>
          <span className="compositor-ink__gloss-dot" aria-hidden="true">·</span>
          <em className="compositor-ink__gloss-text">{note.rule}</em>
          <span className="compositor-ink__gloss-dot compositor-ink__gloss-dot--r" aria-hidden="true">·</span>
          <em className="compositor-ink__gloss-key compositor-ink__gloss-key--r">marked at</em>
          <span className="compositor-ink__gloss-bead">
            <span className="compositor-ink__gloss-glyph">{WORD_GLYPH[word]}</span>
            <em className="compositor-ink__gloss-word">{word === 'm3' ? 'm³' : word === 'good' ? 'good at' : 'yet?'}</em>
          </span>
        </span>
      </span>

      <span className="compositor-ink__seal" aria-hidden="true">
        <svg viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="16" fill={`url(#${glowId})`} />
          <circle
            cx="18"
            cy="18"
            r="14.5"
            fill="none"
            stroke="currentColor"
            strokeWidth=".35"
            strokeDasharray=".5 1.6"
            opacity=".55"
          />
          <circle cx="18" cy="18" r="11.5" fill="none" stroke="currentColor" strokeWidth=".3" opacity=".4" />
          <text
            x="18"
            y="20.5"
            textAnchor="middle"
            fontFamily="'Iowan Old Style', 'Palatino Linotype', Georgia, serif"
            fontStyle="italic"
            fontSize="11"
            fill="currentColor"
            opacity=".92"
          >
            m³
          </text>
          <text
            x="18"
            y="28.5"
            textAnchor="middle"
            fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
            fontSize="2.6"
            letterSpacing="1.2"
            fill="currentColor"
            opacity=".7"
          >
            INK
          </text>
          <circle cx="18" cy="6" r=".7" fill="currentColor" opacity=".6" />
          <circle cx="18" cy="30" r=".7" fill="currentColor" opacity=".6" />
        </svg>
      </span>

      <figcaption className="sr-only">{`The compositor's note · ${note.lead}. ${note.rule}. Marked at ${word}.`}</figcaption>
    </figure>
  )
}
