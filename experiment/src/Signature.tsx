import type { VoiceId } from './App'
import type { WordId } from './notes'

type SignatureProps = {
  voice: VoiceId
  word: WordId
  setToday: string
}

const VOICE_NAME: Record<VoiceId, string> = { quiet: 'quiet cut', human: 'human hand', bold: 'bold signal' }
const VOICE_LETTER: Record<VoiceId, string> = { quiet: 'A', human: 'B', bold: 'C' }
const WORD_NOTE: Record<WordId, string> = {
  m3: 'keep the fingerprint',
  good: 'choose one clear thing',
  yet: 'protect the pause',
}
const WORD_LABEL: Record<WordId, string> = { m3: 'm³', good: 'good at', yet: 'yet?' }

export function Signature({ voice, word, setToday }: SignatureProps) {
  const tone = voice === 'quiet' ? 'var(--quiet)' : voice === 'human' ? 'var(--human)' : 'var(--bold)'
  const style = { color: tone } as React.CSSProperties
  return (
    <aside className="signature reveal" aria-label="The page, signed off in one breath">
      <svg className="signature__seal" viewBox="0 0 100 100" aria-hidden="true" style={style}>
        <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth=".9" />
        <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth=".4" strokeDasharray="1 2" opacity=".55" />
        <circle cx="50" cy="50" r="34" fill="none" stroke="currentColor" strokeWidth=".3" opacity=".35" />
        <text
          x="50"
          y="58"
          textAnchor="middle"
          fontFamily="Georgia, serif"
          fontStyle="italic"
          fontSize={voice === 'bold' ? 32 : 38}
          fontWeight={voice === 'bold' ? 800 : 500}
          fill="currentColor"
        >
          m³
        </text>
        <text x="50" y="22" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="5" letterSpacing="2" fill="currentColor">
          VOICE · {VOICE_LETTER[voice].toUpperCase()}
        </text>
        <text x="50" y="86" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="5" letterSpacing="2" fill="currentColor">
          SET · TODAY
        </text>
      </svg>

      <p className="signature__line">
        a single line, set three ways, marked at <em>{WORD_LABEL[word]}</em> — <em>{WORD_NOTE[word]}</em>.
      </p>

      <span className="signature__set">
        <span className="signature__rule" aria-hidden="true" />
        composed in {VOICE_NAME[voice]}
        <em>· {setToday}</em>
        <span className="signature__rule" aria-hidden="true" />
      </span>
    </aside>
  )
}
