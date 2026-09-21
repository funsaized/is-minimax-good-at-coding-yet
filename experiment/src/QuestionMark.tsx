import type { CSSProperties } from 'react'
import type { VoiceId } from './App'
import type { WordId } from './notes'

type QuestionMarkProps = {
  voice: VoiceId
  word: WordId
}

const Q_TONE: Record<VoiceId, string> = {
  quiet: 'var(--quiet)',
  human: 'var(--human)',
  bold: 'var(--bold)',
}

export function QuestionMark({ voice, word }: QuestionMarkProps) {
  const tone = Q_TONE[voice]
  const style = {
    '--q-tone': tone,
  } as CSSProperties
  const isLive = word === 'yet'

  return (
    <figure
      className={`qmark qmark--${voice} ${isLive ? 'is-live' : ''}`}
      style={style}
      aria-hidden="true"
    >
      <svg className="qmark__svg" viewBox="0 0 220 320" preserveAspectRatio="xMidYMid meet">
        <g className="qmark__ghost" aria-hidden="true">
          {voice === 'quiet' && (
            <path
              d="M58 138 C58 78 102 38 138 38 C186 38 200 76 200 102 C200 134 180 152 152 168 C130 180 124 198 124 224"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              opacity=".22"
            />
          )}
          {voice === 'human' && (
            <path
              d="M50 140 C50 76 96 30 140 30 C192 30 208 70 208 104 C208 142 184 162 152 180 C128 192 122 210 122 232"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              opacity=".22"
            />
          )}
          {voice === 'bold' && (
            <path
              d="M44 144 C44 72 92 22 144 22 C202 22 218 68 218 110 C218 154 192 178 156 196 C128 210 122 230 122 254"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              opacity=".22"
            />
          )}
        </g>

        <g className="qmark__stroke" aria-hidden="true">
          {voice === 'quiet' && (
            <path
              d="M62 142 C62 84 104 46 138 46 C184 46 196 84 196 108 C196 138 176 156 148 170 C128 180 122 196 122 222"
              fill="none"
              stroke="currentColor"
              strokeWidth="5"
              strokeLinecap="round"
            />
          )}
          {voice === 'human' && (
            <path
              d="M54 144 C54 80 100 38 142 38 C190 38 204 78 204 108 C204 144 180 162 148 178 C124 190 118 206 118 228"
              fill="none"
              stroke="currentColor"
              strokeWidth="9"
              strokeLinecap="round"
            />
          )}
          {voice === 'bold' && (
            <path
              d="M48 148 C48 78 96 30 146 30 C198 30 214 74 214 112 C214 154 188 176 152 192 C124 204 118 222 118 246"
              fill="none"
              stroke="currentColor"
              strokeWidth="14"
              strokeLinecap="round"
            />
          )}
        </g>

        <g className="qmark__bead" aria-hidden="true">
          {voice === 'quiet' && (
            <circle cx="122" cy="276" r="7.5" fill="currentColor" />
          )}
          {voice === 'human' && (
            <circle cx="118" cy="282" r="11" fill="currentColor" />
          )}
          {voice === 'bold' && (
            <rect x="106" y="270" width="22" height="22" rx="1" fill="currentColor" />
          )}
        </g>

        <g className="qmark__tick" aria-hidden="true">
          <line x1="200" y1="14" x2="210" y2="14" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity=".55" />
          <line x1="200" y1="22" x2="206" y2="22" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity=".4" />
          <line x1="200" y1="30" x2="210" y2="30" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity=".55" />
        </g>
      </svg>

      <span className="qmark__caption" aria-hidden="true">
        <em>punctuation</em>
        <span>protagonist</span>
      </span>
    </figure>
  )
}