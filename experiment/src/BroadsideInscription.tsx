import { useEffect, useId, useState, type CSSProperties } from 'react'
import type { VoiceId } from './App'

type BroadsideInscriptionProps = {
  voice: VoiceId
  setToday: string
}

const VOICE_LETTER: Record<VoiceId, string> = { quiet: 'a', human: 'b', bold: 'c' }
const VOICE_LETTER_UPPER: Record<VoiceId, string> = { quiet: 'A', human: 'B', bold: 'C' }
const VOICE_NAME: Record<VoiceId, string> = {
  quiet: 'quiet cut',
  human: 'human hand',
  bold: 'bold signal',
}

export function BroadsideInscription({ voice, setToday }: BroadsideInscriptionProps) {
  const baseId = useId().replace(/:/g, '')
  const gradId = `bi-grad-${baseId}`
  const [reduceMotion, setReduceMotion] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduceMotion(mq.matches)
    const onChange = () => setReduceMotion(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const toneStyle = { '--bi-tone': `var(--${voice})` } as CSSProperties

  return (
    <div
      className={`broadside-inscription broadside-inscription--${voice} ${
        reduceMotion ? 'is-quiet' : ''
      }`}
      style={toneStyle}
      role="presentation"
    >
      <svg className="broadside-inscription__defs" aria-hidden="true">
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--bi-tone)" stopOpacity="0" />
            <stop offset="14%" stopColor="var(--bi-tone)" stopOpacity=".22" />
            <stop offset="50%" stopColor="var(--bi-tone)" stopOpacity=".58" />
            <stop offset="86%" stopColor="var(--bi-tone)" stopOpacity=".22" />
            <stop offset="100%" stopColor="var(--bi-tone)" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      <span className="broadside-inscription__lead" aria-hidden="true">
        <svg viewBox="0 0 220 14" preserveAspectRatio="none">
          <line
            className="broadside-inscription__lead-line"
            x1="0"
            y1="7"
            x2="220"
            y2="7"
            stroke={`url(#${gradId})`}
            strokeWidth=".55"
            strokeLinecap="round"
          />
          <line
            className="broadside-inscription__lead-hair"
            x1="0"
            y1="7"
            x2="220"
            y2="7"
            stroke="currentColor"
            strokeWidth=".32"
            strokeDasharray=".5 2.6"
            opacity=".5"
          />
          <circle className="broadside-inscription__lead-bead broadside-inscription__lead-bead--l" cx="2" cy="7" r="1.1" fill="currentColor" />
          <circle className="broadside-inscription__lead-bead broadside-inscription__lead-bead--r" cx="218" cy="7" r="1.1" fill="currentColor" />
          <circle className="broadside-inscription__lead-eye broadside-inscription__lead-eye--l" cx="2" cy="7" r=".4" fill="var(--night)" />
          <circle className="broadside-inscription__lead-eye broadside-inscription__lead-eye--r" cx="218" cy="7" r=".4" fill="var(--night)" />
          <path
            className="broadside-inscription__lead-cap broadside-inscription__lead-cap--r"
            d="M214 3 L220 7 L214 11"
            fill="none"
            stroke="currentColor"
            strokeWidth=".45"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity=".55"
          />
        </svg>
      </span>

      <span className="broadside-inscription__text">
        <em className="broadside-inscription__press">m³ press</em>
        <span className="broadside-inscription__dot" aria-hidden="true">·</span>
        <em className="broadside-inscription__verb">set on</em>
        <em className="broadside-inscription__date">{setToday}</em>
        <span className="broadside-inscription__dot" aria-hidden="true">·</span>
        <em className="broadside-inscription__verb">composed in</em>
        <span className="broadside-inscription__voice" aria-hidden="true">
          <span className="broadside-inscription__voice-letter">{VOICE_LETTER_UPPER[voice]}</span>
          <span className="broadside-inscription__voice-rule" />
          <span className="broadside-inscription__voice-name">{VOICE_NAME[voice]}</span>
        </span>
        <span className="broadside-inscription__dot" aria-hidden="true">·</span>
        <em className="broadside-inscription__folio">
          <span className="broadside-inscription__folio-key">folio</span>
          <span className="broadside-inscription__folio-num">i</span>
        </em>
      </span>

      <span className="broadside-inscription__trail" aria-hidden="true">
        <svg viewBox="0 0 220 14" preserveAspectRatio="none">
          <path
            className="broadside-inscription__trail-cap broadside-inscription__trail-cap--l"
            d="M6 3 L0 7 L6 11"
            fill="none"
            stroke="currentColor"
            strokeWidth=".45"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity=".55"
          />
          <line
            className="broadside-inscription__trail-line"
            x1="0"
            y1="7"
            x2="220"
            y2="7"
            stroke={`url(#${gradId})`}
            strokeWidth=".55"
            strokeLinecap="round"
          />
          <line
            className="broadside-inscription__trail-hair"
            x1="0"
            y1="7"
            x2="220"
            y2="7"
            stroke="currentColor"
            strokeWidth=".32"
            strokeDasharray=".5 2.6"
            opacity=".5"
          />
          <circle className="broadside-inscription__trail-bead broadside-inscription__trail-bead--l" cx="2" cy="7" r="1.1" fill="currentColor" />
          <circle className="broadside-inscription__trail-bead broadside-inscription__trail-bead--r" cx="218" cy="7" r="1.1" fill="currentColor" />
          <circle className="broadside-inscription__trail-eye broadside-inscription__trail-eye--l" cx="2" cy="7" r=".4" fill="var(--night)" />
          <circle className="broadside-inscription__trail-eye broadside-inscription__trail-eye--r" cx="218" cy="7" r=".4" fill="var(--night)" />
        </svg>
      </span>

      <span className="sr-only">{`Set-up line · m³ press · set on ${setToday} · composed in ${VOICE_NAME[voice]} (voice ${VOICE_LETTER[voice].toUpperCase()}) · folio i.`}</span>
    </div>
  )
}
