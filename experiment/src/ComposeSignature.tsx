import { useId, type CSSProperties } from 'react'
import type { VoiceId } from './Press'
import type { WordId } from './notes'

type ComposeSignatureProps = {
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
const VOICE_NAME: Record<VoiceId, string> = { quiet: 'quiet cut', human: 'human hand', bold: 'bold signal' }

const WORD_LABEL: Record<WordId, string> = { m3: 'm³', good: 'good at', yet: 'yet?' }
const WORD_GLYPH: Record<WordId, string> = { m3: '⌇', good: '∧', yet: '?' }
const WORD_NOTE: Record<WordId, string> = {
  m3: 'keep the fingerprint',
  good: 'choose one clear thing',
  yet: 'protect the pause',
}

const SEASON = (() => {
  const month = new Date().getMonth()
  if (month <= 1 || month === 11) return 'winter'
  if (month <= 4) return 'spring'
  if (month <= 7) return 'summer'
  return 'autumn'
})()

export function ComposeSignature({ voice, word, setToday }: ComposeSignatureProps) {
  const baseId = useId().replace(/:/g, '')
  const grainId = `compose-signature-grain-${baseId}`
  const ruleGrainId = `compose-signature-rule-grain-${baseId}`
  const tone = VOICE_TONE[voice]
  const style = { '--sig-tone': tone } as CSSProperties

  return (
    <aside className="compose-signature" aria-label="Press signature — the page in one breath" style={style}>
      <svg className="compose-signature__defs" aria-hidden="true" focusable="false">
        <defs>
          <filter id={grainId} x="-12%" y="-12%" width="124%" height="124%">
            <feTurbulence type="fractalNoise" baseFrequency="2.4" numOctaves="2" seed="19" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .55 0" />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
          <filter id={ruleGrainId} x="-2%" y="-50%" width="104%" height="200%">
            <feTurbulence type="fractalNoise" baseFrequency="2.4" numOctaves="2" seed="23" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .45 0" />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
        </defs>
      </svg>

      <span className="compose-signature__rule compose-signature__rule--lead" aria-hidden="true">
        <svg viewBox="0 0 200 6" preserveAspectRatio="none">
          <g filter={`url(#${ruleGrainId})`}>
            <path
              className="compose-signature__rule-stroke"
              d="M2 3c16-4 32 4 48 0s32-4 48 0 32 4 48 0 32-4 48 0"
              fill="none"
              stroke="currentColor"
              strokeWidth=".7"
              strokeLinecap="round"
              pathLength="100"
            />
          </g>
          <circle cx="198" cy="3" r="1" fill="currentColor" />
        </svg>
      </span>

      <span className="compose-signature__monogram" aria-hidden="true">
        <svg viewBox="0 0 120 120" preserveAspectRatio="xMidYMid meet">
          <g filter={`url(#${grainId})`} opacity=".95">
            <circle cx="60" cy="60" r="54" fill="none" stroke="currentColor" strokeWidth="1" />
            <circle cx="60" cy="60" r="46" fill="none" stroke="currentColor" strokeWidth=".4" strokeDasharray="1 2" opacity=".7" />
            <circle cx="60" cy="60" r="38" fill="none" stroke="currentColor" strokeWidth=".3" opacity=".45" />
            <path
              d="M60 10 L60 18 M60 102 L60 110 M10 60 L18 60 M102 60 L110 60"
              stroke="currentColor"
              strokeWidth=".5"
              strokeLinecap="round"
              opacity=".6"
            />
            <text
              x="60"
              y="72"
              textAnchor="middle"
              fontFamily="'Iowan Old Style', Georgia, serif"
              fontStyle="italic"
              fontSize="42"
              letterSpacing="-.06em"
              fill="currentColor"
            >m³</text>
          </g>
        </svg>
      </span>

      <span className="compose-signature__crown" aria-hidden="true">
        <span className="compose-signature__crown-tag">composed in the</span>
        <em className="compose-signature__crown-voice">{VOICE_NAME[voice]}</em>
        <span className="compose-signature__crown-letter">{VOICE_LETTER[voice]}</span>
      </span>

      <p className="compose-signature__sentence">
        a single line, set three ways, marked at <em>{WORD_LABEL[word]}</em>
        <span className="compose-signature__sentence-mark" aria-hidden="true">{WORD_GLYPH[word]}</span>
      </p>

      <span className="compose-signature__note" aria-hidden="true">
        <span className="compose-signature__note-mark">¶</span>
        <em>{WORD_NOTE[word]}</em>
      </span>

      <span className="compose-signature__rule compose-signature__rule--trail" aria-hidden="true">
        <svg viewBox="0 0 200 6" preserveAspectRatio="none">
          <g filter={`url(#${ruleGrainId})`}>
            <path
              className="compose-signature__rule-stroke compose-signature__rule-stroke--trail"
              d="M2 3c16-4 32 4 48 0s32-4 48 0 32 4 48 0 32-4 48 0"
              fill="none"
              stroke="currentColor"
              strokeWidth=".7"
              strokeLinecap="round"
              opacity=".7"
              pathLength="100"
            />
          </g>
          <circle cx="2" cy="3" r="1" fill="currentColor" opacity=".7" />
        </svg>
      </span>

      <span className="compose-signature__set">
        <span className="compose-signature__set-key">set</span>
        <em className="compose-signature__set-date">{setToday}</em>
        <span className="compose-signature__set-sep" aria-hidden="true">·</span>
        <span className="compose-signature__set-season">{SEASON}</span>
      </span>

      <span className="sr-only">
        {`Press signature · composed in the ${VOICE_NAME[voice]} voice · marked at ${WORD_LABEL[word]} (${WORD_GLYPH[word]}) · set on ${setToday} · ${SEASON}.`}
      </span>
    </aside>
  )
}