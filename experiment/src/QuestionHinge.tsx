import { useEffect, useId, useRef, useState, type CSSProperties } from 'react'
import type { VoiceId } from './App'
import type { WordId } from './notes'
import { QuestionMark } from './QuestionMark'

type QuestionHingeProps = {
  voice: VoiceId
  word: WordId
  setToday: string
}

const VOICE_NAME: Record<VoiceId, string> = {
  quiet: 'quiet cut',
  human: 'human hand',
  bold: 'bold signal',
}
const VOICE_LETTER: Record<VoiceId, string> = { quiet: 'A', human: 'B', bold: 'C' }
const VOICE_FACE: Record<VoiceId, string> = {
  quiet: 'serif · italic · close set',
  human: 'serif · italic · warm',
  bold: 'sans · heavy · no apology',
}

const HINGE_NOTE: Record<VoiceId, string> = {
  quiet: 'the punctuation sits last — soft, but it carries the line.',
  human: 'the punctuation sits last — set by hand, with the weight of one breath.',
  bold: 'the punctuation sits last — loud, and earned.',
}

const HINGE_VOICE_LINE: Record<VoiceId, string> = {
  quiet: 'set in voice a · quiet cut',
  human: 'set in voice b · human hand',
  bold: 'set in voice c · bold signal',
}

export function QuestionHinge({ voice, word, setToday }: QuestionHingeProps) {
  const baseId = useId().replace(/:/g, '')
  const ruleId = `qh-rule-${baseId}`
  const rootRef = useRef<HTMLDivElement | null>(null)
  const [revealed, setRevealed] = useState(false)
  const [reduceMotion, setReduceMotion] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduceMotion(mq.matches)
    const onChange = () => setReduceMotion(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setRevealed(true)
      return
    }
    const node = rootRef.current
    if (!node) return
    const obs = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setRevealed(true)
            obs.unobserve(entry.target)
          }
        }
      },
      { threshold: 0.32, rootMargin: '0px 0px -10% 0px' },
    )
    obs.observe(node)
    return () => obs.disconnect()
  }, [])

  const tone = `var(--${voice})`
  const style = {
    '--qh-tone': tone,
  } as CSSProperties

  return (
    <div
      ref={rootRef}
      className={`question-hinge question-hinge--${voice} ${revealed ? 'is-revealed' : ''} ${reduceMotion ? 'is-quiet' : ''}`}
      style={style}
      aria-label={`The question's hinge — folio i opening. ${HINGE_NOTE[voice]} Marked word: ${word}.`}
    >
      <svg className="question-hinge__defs" aria-hidden="true">
        <defs>
          <linearGradient id={ruleId} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
            <stop offset="14%" stopColor="currentColor" stopOpacity=".55" />
            <stop offset="50%" stopColor="currentColor" stopOpacity=".85" />
            <stop offset="86%" stopColor="currentColor" stopOpacity=".55" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      <span className="question-hinge__approach" aria-hidden="true">
        <svg viewBox="0 0 240 24" preserveAspectRatio="none">
          <line
            x1="0"
            y1="12"
            x2="240"
            y2="12"
            stroke={`url(#${ruleId})`}
            strokeWidth=".55"
            strokeLinecap="round"
          />
          <circle cx="2" cy="12" r="1.1" fill="currentColor" />
          <circle cx="120" cy="12" r="1.7" fill="currentColor" />
          <circle cx="238" cy="12" r="1.1" fill="currentColor" />
        </svg>
      </span>

      <div className="question-hinge__plate">
        <span className="question-hinge__mark">
          <QuestionMark voice={voice} word={word} />
        </span>

        <div className="question-hinge__copy">
          <span className="question-hinge__eyebrow">
            <em className="question-hinge__eyebrow-key">folio i</em>
            <span className="question-hinge__eyebrow-sep" aria-hidden="true">·</span>
            <em className="question-hinge__eyebrow-tag">the question opens</em>
          </span>

          <p className="question-hinge__line">
            <em className="question-hinge__line-lead">the page's</em>
            <em className="question-hinge__line-mark">last mark</em>
            <em className="question-hinge__line-tail">, set in three voices —</em>
            <em className="question-hinge__line-gloss">read it once, then read it again.</em>
          </p>

          <span className="question-hinge__voices" aria-label={`The hinge is set in voice ${VOICE_LETTER[voice]} · ${VOICE_NAME[voice]}`}>
            <span className={`question-hinge__voice question-hinge__voice--quiet ${voice === 'quiet' ? 'is-active' : ''}`} aria-hidden="true">
              <span className="question-hinge__voice-bead" />
              <em>a</em>
            </span>
            <span className="question-hinge__voice-rule" aria-hidden="true" />
            <span className={`question-hinge__voice question-hinge__voice--human ${voice === 'human' ? 'is-active' : ''}`} aria-hidden="true">
              <span className="question-hinge__voice-bead" />
              <em>b</em>
            </span>
            <span className="question-hinge__voice-rule" aria-hidden="true" />
            <span className={`question-hinge__voice question-hinge__voice--bold ${voice === 'bold' ? 'is-active' : ''}`} aria-hidden="true">
              <span className="question-hinge__voice-bead" />
              <em>c</em>
            </span>
          </span>

          <span className="question-hinge__foot">
            <em className="question-hinge__foot-line">{HINGE_VOICE_LINE[voice]}</em>
            <span className="question-hinge__foot-rule" aria-hidden="true" />
            <em className="question-hinge__foot-face">{VOICE_FACE[voice]}</em>
            <span className="question-hinge__foot-rule" aria-hidden="true" />
            <em className="question-hinge__foot-date">{setToday}</em>
          </span>
        </div>
      </div>

      <span className="question-hinge__depart" aria-hidden="true">
        <svg viewBox="0 0 240 24" preserveAspectRatio="none">
          <line
            x1="0"
            y1="12"
            x2="240"
            y2="12"
            stroke={`url(#${ruleId})`}
            strokeWidth=".55"
            strokeLinecap="round"
          />
          <circle cx="120" cy="12" r="1.1" fill="currentColor" opacity=".65" />
          <path
            d="M232 8 L240 12 L232 16"
            fill="none"
            stroke="currentColor"
            strokeWidth=".55"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </div>
  )
}
