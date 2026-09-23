import { useId, type CSSProperties } from 'react'
import type { VoiceId } from './App'

type ImprintProps = {
  voice: VoiceId
  setToday: string
}

const VOICE_NAME: Record<VoiceId, string> = { quiet: 'quiet cut', human: 'human hand', bold: 'bold signal' }
const VOICE_LETTER: Record<VoiceId, string> = { quiet: 'A', human: 'B', bold: 'C' }
const VOICE_FACE: Record<VoiceId, string> = {
  quiet: 'serif · italic · close set',
  human: 'serif · italic · warm',
  bold: 'sans · heavy · direct',
}

const MOTTO: Record<VoiceId, string> = {
  quiet: 'set at first light, read in the dark, kept close',
  human: 'set by hand, felt warm, kept close',
  bold: 'set at full height, read once, kept close',
}

const SIGN_OFF: Record<VoiceId, string> = {
  quiet: 'the quiet cut · signed off · the question stays open',
  human: 'the human hand · signed off · the question stays open',
  bold: 'the bold signal · signed off · the question stays open',
}

const TITLE = 'is Minimax M3 good at frontend yet?'

export function Imprint({ voice, setToday }: ImprintProps) {
  const baseId = useId().replace(/:/g, '')
  const washId = `im-wash-${baseId}`
  const sealGradId = `im-seal-${baseId}`
  const sealGlowId = `im-glow-${baseId}`
  const sealCoreId = `im-core-${baseId}`

  const tone = `var(--${voice})`
  const style = { '--im-tone': tone } as CSSProperties

  const sealFill =
    voice === 'quiet'
      ? 'rgba(168, 197, 255, 0.5)'
      : voice === 'human'
        ? 'rgba(244, 132, 114, 0.55)'
        : 'rgba(205, 238, 106, 0.55)'

  const sealDeep =
    voice === 'quiet'
      ? 'rgba(120, 158, 240, 0.92)'
      : voice === 'human'
        ? 'rgba(216, 80, 64, 0.92)'
        : 'rgba(168, 214, 50, 0.92)'

  return (
    <footer className={`imprint imprint--${voice}`} style={style} aria-label="The page, signed off at the imprint">
      <svg className="imprint__defs" aria-hidden="true">
        <defs>
          <linearGradient id={washId} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--im-tone)" stopOpacity="0" />
            <stop offset="22%" stopColor="var(--im-tone)" stopOpacity=".32" />
            <stop offset="50%" stopColor="var(--im-tone)" stopOpacity=".58" />
            <stop offset="78%" stopColor="var(--im-tone)" stopOpacity=".32" />
            <stop offset="100%" stopColor="var(--im-tone)" stopOpacity="0" />
          </linearGradient>
          <radialGradient id={sealGlowId} cx="50%" cy="40%" r="62%">
            <stop offset="0%" stopColor="currentColor" stopOpacity=".18" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </radialGradient>
          <radialGradient id={sealGradId} cx="40%" cy="36%" r="68%">
            <stop offset="0%" stopColor={sealFill} />
            <stop offset="56%" stopColor={sealDeep} />
            <stop offset="100%" stopColor="rgba(8, 10, 18, 0.9)" />
          </radialGradient>
          <radialGradient id={sealCoreId} cx="50%" cy="38%" r="55%">
            <stop offset="0%" stopColor="rgba(255, 255, 255, 0.32)" />
            <stop offset="60%" stopColor="rgba(255, 255, 255, 0.08)" />
            <stop offset="100%" stopColor="rgba(255, 255, 255, 0)" />
          </radialGradient>
        </defs>
      </svg>

      <span className="imprint__rule imprint__rule--top" aria-hidden="true">
        <svg viewBox="0 0 1200 12" preserveAspectRatio="none">
          <line
            x1="0"
            y1="6"
            x2="1200"
            y2="6"
            stroke={`url(#${washId})`}
            strokeWidth="1"
            strokeLinecap="round"
          />
          <line
            x1="0"
            y1="6"
            x2="1200"
            y2="6"
            stroke="rgba(245, 238, 216, .12)"
            strokeWidth=".35"
            strokeDasharray="1 4"
          />
          <circle cx="600" cy="6" r="3.2" fill="var(--im-tone)" />
          <circle cx="600" cy="6" r="6" fill="none" stroke="var(--im-tone)" strokeWidth=".45" opacity=".55" />
          <circle cx="600" cy="6" r="1.2" fill="var(--night)" />
          <circle cx="0" cy="6" r="1.4" fill="var(--im-tone)" opacity=".7" />
          <circle cx="1200" cy="6" r="1.4" fill="var(--im-tone)" opacity=".7" />
        </svg>
      </span>

      <span className="imprint__key" aria-hidden="true">
        <em>the printer&apos;s imprint</em>
        <span className="imprint__key-rule" />
        <em>set on {setToday}</em>
      </span>

      <p className="imprint__title" aria-label={TITLE}>
        <em className="imprint__title-lead">is</em>
        <span className="imprint__title-main">{TITLE}</span>
      </p>

      <span className="imprint__seal" aria-hidden="true">
        <svg viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="48" fill={`url(#${sealGlowId})`} />
          <circle cx="50" cy="50" r="46" fill={`url(#${sealGradId})`} stroke="currentColor" strokeWidth="1.1" strokeOpacity=".75" />
          <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth=".35" strokeDasharray=".6 1.4" opacity=".55" />
          <circle cx="50" cy="50" r="36" fill="none" stroke="rgba(255, 255, 255, 0.32)" strokeWidth=".3" />
          <circle cx="50" cy="50" r="29" fill="none" stroke="rgba(255, 255, 255, 0.18)" strokeWidth=".25" />
          <circle cx="50" cy="50" r="44" fill={`url(#${sealCoreId})`} opacity=".7" />

          <text x="50" y="22" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="5.4" letterSpacing="2" fill="rgba(8, 10, 18, 0.92)">
            m³ · press
          </text>
          <text x="50" y="76" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="3.6" letterSpacing="1.4" fill="rgba(8, 10, 18, 0.92)">
            {VOICE_LETTER[voice]} · imprint
          </text>
          <text x="50" y="86" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="3.6" letterSpacing="1.4" fill="rgba(8, 10, 18, 0.92)">
            folio · vi
          </text>

          <circle cx="50" cy="6" r="1.4" fill="rgba(8, 10, 18, 0.85)" />
          <circle cx="50" cy="94" r="1.4" fill="rgba(8, 10, 18, 0.85)" />
          <circle cx="6" cy="50" r="1.4" fill="rgba(8, 10, 18, 0.85)" />
          <circle cx="94" cy="50" r="1.4" fill="rgba(8, 10, 18, 0.85)" />

          <g className="imprint__seal-engraving">
            <circle cx="50" cy="44" r="8" fill="rgba(8, 10, 18, 0.92)" />
            <circle cx="50" cy="44" r="8" fill="none" stroke="rgba(245, 238, 216, .35)" strokeWidth=".32" strokeDasharray=".6 1.4" />
            <circle cx="53" cy="42" r="7" fill={`url(#${sealGradId})`} />
            <line x1="34" y1="54" x2="66" y2="54" stroke="rgba(8, 10, 18, 0.92)" strokeWidth=".7" strokeLinecap="round" />
            <circle cx="40" cy="54" r="1.2" fill="rgba(8, 10, 18, 0.92)" />
            <circle cx="60" cy="54" r="1.2" fill="rgba(8, 10, 18, 0.92)" />
          </g>

          <path d="M28 24 Q36 30 32 38 Q26 48 32 58 Q40 68 36 78" fill="none" stroke="rgba(8, 10, 18, 0.18)" strokeWidth=".55" />
          <path d="M72 24 Q64 30 68 38 Q74 48 68 58 Q60 68 64 78" fill="none" stroke="rgba(8, 10, 18, 0.18)" strokeWidth=".55" />
        </svg>
      </span>

      <p className="imprint__motto" aria-hidden="true">
        <em>{MOTTO[voice]}</em>
      </p>

      <span className="imprint__signature" aria-hidden="true">
        <span className="imprint__signature-rule imprint__signature-rule--l" />
        <em className="imprint__signature-name">
          m<sup>3</sup> press
        </em>
        <span className="imprint__signature-dot">·</span>
        <em className="imprint__signature-voice">{VOICE_NAME[voice]}</em>
        <span className="imprint__signature-dot">·</span>
        <em className="imprint__signature-face">{VOICE_FACE[voice]}</em>
        <span className="imprint__signature-rule imprint__signature-rule--r" />
      </span>

      <a className="imprint__return" href="#question">
        <span className="imprint__return-glyph" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path
              d="M5 12h13M11 6l-6 6 6 6"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        back to the question
        <span className="imprint__return-tail" aria-hidden="true">
          <svg viewBox="0 0 32 6" preserveAspectRatio="none">
            <line x1="0" y1="3" x2="32" y2="3" stroke="currentColor" strokeWidth=".45" strokeDasharray="1 2" opacity=".7" />
            <circle cx="32" cy="3" r="1" fill="currentColor" opacity=".7" />
          </svg>
        </span>
      </a>

      <p className="imprint__signoff" aria-hidden="true">
        <em>{SIGN_OFF[voice]}.</em>
      </p>

      <span className="imprint__rule imprint__rule--bottom" aria-hidden="true">
        <svg viewBox="0 0 1200 6" preserveAspectRatio="none">
          <line
            x1="0"
            y1="3"
            x2="1200"
            y2="3"
            stroke="rgba(245, 238, 216, .18)"
            strokeWidth=".45"
            strokeDasharray="1.4 4"
          />
        </svg>
      </span>

      <span className="sr-only">{`Printer's imprint: ${TITLE} — set on ${setToday} — composed in ${VOICE_NAME[voice]} (${VOICE_LETTER[voice]}, ${VOICE_FACE[voice]}) — ${MOTTO[voice]}.`}</span>
    </footer>
  )
}
