import type { CSSProperties } from 'react'
import type { VoiceId } from './PressBay'
import type { WordId } from './notes'

type PressSignatureProps = {
  folio: string
  voice: VoiceId
  word: WordId
  setToday: string
  variant?: 'inline' | 'footer'
  label?: string
}

const VOICE_LABEL: Record<VoiceId, string> = { quiet: 'quiet cut', human: 'human hand', bold: 'bold signal' }
const VOICE_LETTER: Record<VoiceId, string> = { quiet: 'A', human: 'B', bold: 'C' }
const WORD_LABEL: Record<WordId, string> = { m3: 'm³', good: 'good at', yet: 'yet?' }
const WORD_MARK: Record<WordId, string> = { m3: 'stet', good: 'caret', yet: 'query' }
const FOLIO_TITLE: Record<string, string> = {
  i: 'the question',
  'i·': 'the press bay',
  ii: 'the compose floor',
  iii: 'this page, listed',
  'iii·': 'the day sheet',
  '·': 'a folded slip',
  iv: 'the second proof',
  v: 'three pressings',
  vi: 'the marginalia',
  viii: 'the answer',
}

export function PressSignature({ folio, voice, word, setToday, variant = 'inline', label }: PressSignatureProps) {
  const folioTitle = FOLIO_TITLE[folio] ?? 'a folio'
  const style = {
    '--sig-voice': `var(--sig-${voice})`,
  } as CSSProperties
  return (
    <div className={`press-signature press-signature--${voice} press-signature--${variant}`} style={style} aria-hidden="true">
      <span className="press-signature__rule press-signature__rule--left" />
      <span className="press-signature__core">
        <span className="press-signature__seal">
          <svg viewBox="0 0 56 56" aria-hidden="true">
            <defs>
              <radialGradient id={`sig-wax-${voice}`} cx="50%" cy="38%" r="62%">
                <stop offset="0%" stopColor="currentColor" stopOpacity=".92" />
                <stop offset="65%" stopColor="currentColor" stopOpacity=".72" />
                <stop offset="100%" stopColor="currentColor" stopOpacity=".5" />
              </radialGradient>
            </defs>
            <circle cx="28" cy="28" r="26" fill="none" stroke="currentColor" strokeWidth=".4" strokeDasharray="1 2.4" opacity=".55" />
            <circle cx="28" cy="28" r="22" fill={`url(#sig-wax-${voice})`} />
            <circle cx="28" cy="28" r="22" fill="none" stroke="currentColor" strokeWidth=".6" />
            <circle cx="28" cy="28" r="17" fill="none" stroke="currentColor" strokeWidth=".3" opacity=".55" />
            <text
              x="28"
              y="20"
              textAnchor="middle"
              fontFamily="ui-monospace, monospace"
              fontSize="3.2"
              letterSpacing="1.6"
              fill="currentColor"
              opacity=".78"
            >PRESS</text>
            <text
              x="28"
              y="34"
              textAnchor="middle"
              fontFamily="Georgia, serif"
              fontStyle="italic"
              fontSize="11"
              fill="currentColor"
            >m³</text>
            <text
              x="28"
              y="42"
              textAnchor="middle"
              fontFamily="ui-monospace, monospace"
              fontSize="2.6"
              letterSpacing="1.2"
              fill="currentColor"
              opacity=".7"
            >FOLIO {folio}</text>
            <circle cx="6.5" cy="28" r=".9" fill="currentColor" opacity=".5" />
            <circle cx="49.5" cy="28" r=".9" fill="currentColor" opacity=".5" />
            <circle cx="28" cy="6.5" r=".7" fill="currentColor" opacity=".5" />
            <circle cx="28" cy="49.5" r=".7" fill="currentColor" opacity=".5" />
          </svg>
        </span>
        <span className="press-signature__text">
          <span className="press-signature__row press-signature__row--head">
            <span className="press-signature__mark">m³ press</span>
            <span className="press-signature__dot" aria-hidden="true">·</span>
            <span className="press-signature__folio">folio {folio}</span>
            <span className="press-signature__dot" aria-hidden="true">·</span>
            <span className="press-signature__title">{label ?? folioTitle}</span>
          </span>
          <span className="press-signature__row press-signature__row--sub">
            <span className="press-signature__voice">
              <span className="press-signature__voice-letter">{VOICE_LETTER[voice]}</span>
              <span className="press-signature__voice-name">{VOICE_LABEL[voice]}</span>
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
      </span>
      <span className="press-signature__rule press-signature__rule--right" />
      <span className="press-signature__sweep" aria-hidden="true">
        <svg viewBox="0 0 220 22" preserveAspectRatio="none">
          <path
            d="M2 14c10-9 22 6 36-2s22-9 36-1 22 7 36-2 22-7 36-1 22 6 36-2 18-4 18-4"
            fill="none"
            stroke="currentColor"
            strokeWidth=".9"
            strokeLinecap="round"
            className="press-signature__sweep-stroke"
          />
          <circle cx="216" cy="11" r="1.6" fill="currentColor" className="press-signature__sweep-dot" />
        </svg>
      </span>
    </div>
  )
}
