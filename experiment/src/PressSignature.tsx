import { useId } from 'react'
import type { CSSProperties } from 'react'
import type { VoiceId } from './Press'
import type { WordId } from './notes'

type PressSignatureProps = {
  folio: string
  voice: VoiceId
  word: WordId
  setToday: string
  variant?: string
}

const VOICE_LETTER: Record<VoiceId, string> = { quiet: 'A', human: 'B', bold: 'C' }
const VOICE_NAME: Record<VoiceId, string> = { quiet: 'quiet cut', human: 'human hand', bold: 'bold signal' }
const WORD_LABEL: Record<WordId, string> = { m3: 'm³', good: 'good at', yet: 'yet?' }
const WORD_MARK: Record<WordId, string> = { m3: 'stet', good: 'caret', yet: 'query' }

export function PressSignature({ folio, voice, word, setToday, variant }: PressSignatureProps) {
  const baseId = useId().replace(/:/g, '')
  const style = { '--sig-voice': voice === 'quiet' ? 'var(--sig-quiet)' : voice === 'human' ? 'var(--sig-human)' : 'var(--sig-bold)' } as CSSProperties
  const isFooter = variant === 'footer'
  return (
    <aside
      className={`press-signature press-signature--${voice} ${isFooter ? 'press-signature--footer' : ''}`}
      style={style}
      aria-label={`Press signature for folio ${folio}, set in ${VOICE_NAME[voice]} voice`}
    >
      <span className="press-signature__rule" aria-hidden="true" />
      <div className="press-signature__core">
        <span className="press-signature__seal" aria-hidden="true">
          <svg viewBox="0 0 56 56">
            <defs>
              <filter id={`sig-press-grain-${baseId}`} x="-10%" y="-10%" width="120%" height="120%">
                <feTurbulence type="fractalNoise" baseFrequency="2.6" numOctaves="2" seed="3" stitchTiles="stitch" />
                <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .5 0" />
                <feComposite in2="SourceGraphic" operator="in" />
              </filter>
            </defs>
            <g filter={`url(#sig-press-grain-${baseId})`} opacity="0.95">
              <circle cx="28" cy="28" r="25" fill="none" stroke="currentColor" strokeWidth="1.1" />
              <circle cx="28" cy="28" r="20" fill="none" stroke="currentColor" strokeWidth=".35" strokeDasharray="1 2" opacity=".6" />
              <text x="28" y="20" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="3.4" letterSpacing="1.4" fill="currentColor">FOLIO {folio}</text>
              <text x="28" y="36" textAnchor="middle" fontFamily="Georgia, serif" fontStyle="italic" fontSize="14" fill="currentColor">m³</text>
              <text x="28" y="46" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="3.2" letterSpacing="1.2" fill="currentColor">PRESS · SIGNED</text>
            </g>
          </svg>
        </span>
        <span className="press-signature__text">
          <span className="press-signature__row press-signature__row--head">
            <span className="press-signature__mark">M³ PRESS</span>
            <span className="press-signature__dot" aria-hidden="true">·</span>
            <span className="press-signature__folio">FOLIO {folio}</span>
            <span className="press-signature__dot" aria-hidden="true">·</span>
            <span className="press-signature__title">the question, set</span>
          </span>
          <span className="press-signature__row press-signature__row--sub">
            <span className="press-signature__voice">
              <span className="press-signature__voice-letter">{VOICE_LETTER[voice]}</span>
              <span className="press-signature__voice-name">{VOICE_NAME[voice]}</span>
            </span>
            <span className="press-signature__dot" aria-hidden="true">·</span>
            <span className="press-signature__word">
              <span className="press-signature__word-mark">{WORD_MARK[word]}</span>
              <span className="press-signature__word-name">{WORD_LABEL[word]}</span>
            </span>
            <span className="press-signature__dot" aria-hidden="true">·</span>
            <span className="press-signature__date">set on {setToday}</span>
          </span>
        </span>
      </div>
      <span className="press-signature__rule press-signature__rule--right" aria-hidden="true" />
      <svg className="press-signature__sweep" viewBox="0 0 360 22" preserveAspectRatio="none" aria-hidden="true">
        <path
          d="M2 12c30-9 60 9 90 0s60-9 90 0 60 9 90 0 60-9 88-1"
          fill="none"
          stroke="currentColor"
          strokeWidth=".9"
          strokeLinecap="round"
          className="press-signature__sweep-stroke"
        />
        <circle cx="358" cy="11" r="1.4" fill="currentColor" className="press-signature__sweep-dot" />
      </svg>
    </aside>
  )
}
