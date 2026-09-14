import type { CSSProperties } from 'react'

export type VoiceId = 'quiet' | 'human' | 'bold'
export type WordId = 'm3' | 'good' | 'yet'

type PressSignatureProps = {
  voice: VoiceId
  word: WordId
  tone?: 'plate' | 'card' | 'plate-light'
}

const VOICE_LABEL: Record<VoiceId, string> = {
  quiet: 'quiet cut',
  human: 'human hand',
  bold: 'bold signal',
}

const VOICE_FACE: Record<VoiceId, string> = {
  quiet: 'serif · italic · close set',
  human: 'serif · italic · warm',
  bold: 'sans · heavy · no apology',
}

const VOICE_LETTER: Record<VoiceId, string> = {
  quiet: 'A',
  human: 'B',
  bold: 'C',
}

const WORD_LABEL: Record<WordId, string> = {
  m3: 'm³',
  good: 'good at',
  yet: 'yet?',
}

const WORD_MARK: Record<WordId, string> = {
  m3: 'stet',
  good: 'caret',
  yet: 'query',
}

const WORD_GLYPH: Record<WordId, string> = {
  m3: '⌇',
  good: '∧',
  yet: '?',
}

function VoicePrint({ voice, size = 56 }: { voice: VoiceId; size?: number }) {
  if (voice === 'quiet') {
    return (
      <svg className="press-signature__print" width={size} height={size} viewBox="0 0 56 56" aria-hidden="true">
        <circle cx="28" cy="28" r="25" fill="none" stroke="currentColor" strokeWidth=".6" opacity=".35" />
        <circle cx="28" cy="28" r="18" fill="none" stroke="currentColor" strokeWidth=".4" strokeDasharray="1 2.4" opacity=".55" />
        <path
          d="M14 32c4-6 8 6 14 0s10-6 14 0"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.1"
          strokeLinecap="round"
        />
        <text x="28" y="24" textAnchor="middle" fontFamily="Georgia, serif" fontStyle="italic" fontSize="11" fill="currentColor">a</text>
        <circle cx="44" cy="36" r="1" fill="currentColor" />
      </svg>
    )
  }
  if (voice === 'human') {
    return (
      <svg className="press-signature__print" width={size} height={size} viewBox="0 0 56 56" aria-hidden="true">
        <ellipse cx="28" cy="28" rx="24" ry="22" fill="none" stroke="currentColor" strokeWidth=".6" opacity=".35" />
        <ellipse cx="28" cy="28" rx="17" ry="15" fill="none" stroke="currentColor" strokeWidth=".4" strokeDasharray="1 2" opacity=".5" />
        <path
          d="M16 26c2-4 6-2 8 2s4 6 8 4 6-4 8 0"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <text x="28" y="44" textAnchor="middle" fontFamily="Georgia, serif" fontStyle="italic" fontSize="10" fill="currentColor">b</text>
        <circle cx="44" cy="40" r="1.2" fill="currentColor" />
      </svg>
    )
  }
  return (
    <svg className="press-signature__print" width={size} height={size} viewBox="0 0 56 56" aria-hidden="true">
      <rect x="3" y="3" width="50" height="50" fill="none" stroke="currentColor" strokeWidth=".6" opacity=".35" />
      <rect x="9" y="9" width="38" height="38" fill="none" stroke="currentColor" strokeWidth=".4" strokeDasharray="1.5 2" opacity=".5" />
      <text x="28" y="34" textAnchor="middle" fontFamily="ui-sans-serif, system-ui, -apple-system, sans-serif" fontWeight="900" fontSize="22" letterSpacing="-1.2" fill="currentColor">M³</text>
      <path d="M14 44h28" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  )
}

function WordMark({ word }: { word: WordId }) {
  return (
    <span className={`press-signature__wordmark press-signature__wordmark--${word}`} aria-hidden="true">
      <svg viewBox="0 0 40 40">
        <circle cx="20" cy="20" r="17" fill="none" stroke="currentColor" strokeWidth=".7" opacity=".5" />
        {word === 'm3' && (
          <>
            <path d="M8 22c4-8 8 8 12-2s8 6 12-4" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            <circle cx="8" cy="22" r="1.1" fill="currentColor" />
          </>
        )}
        {word === 'good' && (
          <>
            <path d="M20 30l-9-10h18z" fill="currentColor" opacity=".85" />
            <line x1="9" y1="30" x2="31" y2="30" stroke="currentColor" strokeWidth=".9" strokeLinecap="round" />
          </>
        )}
        {word === 'yet' && (
          <>
            <text x="20" y="26" textAnchor="middle" fontFamily="Georgia, serif" fontStyle="italic" fontSize="22" fill="currentColor">?</text>
            <ellipse cx="20" cy="20" rx="11" ry="9" fill="none" stroke="currentColor" strokeWidth=".8" strokeDasharray="60 60" opacity=".7" />
          </>
        )}
      </svg>
    </span>
  )
}

export function PressSignature({ voice, word, tone = 'plate' }: PressSignatureProps) {
  const style = { '--sig-tone': tone } as CSSProperties
  return (
    <div className={`press-signature press-signature--${voice} press-signature--${tone} press-signature--word-${word}`} style={style}>
      <span className="press-signature__plate" aria-hidden="true">
        <VoicePrint voice={voice} size={56} />
      </span>
      <span className="press-signature__body">
        <span className="press-signature__eyebrow">
          <span className="press-signature__eyebrow-mark" aria-hidden="true" />
          press signature · {VOICE_LETTER[voice]}
        </span>
        <span className="press-signature__line">
          <span className="press-signature__name">{VOICE_LABEL[voice]}</span>
          <span className="press-signature__sep" aria-hidden="true">/</span>
          <span className={`press-signature__word press-signature__word--${word}`}>
            <WordMark word={word} />
            <span className="press-signature__word-label">{WORD_LABEL[word]}</span>
            <span className="press-signature__word-mark">{WORD_MARK[word]}</span>
          </span>
        </span>
        <span className="press-signature__face">{VOICE_FACE[voice]}</span>
      </span>
      <span className="press-signature__sign" aria-hidden="true">
        <svg viewBox="0 0 80 22" preserveAspectRatio="none">
          <path
            d="M2 14c6-6 14 4 22-2s14-6 22-1 14 4 18-2 8-2 14-2"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.1"
            strokeLinecap="round"
            pathLength="100"
            strokeDasharray="100 100"
            className="press-signature__sign-stroke"
          />
          <circle cx="78" cy="14" r="1.6" fill="currentColor" />
        </svg>
      </span>
    </div>
  )
}
