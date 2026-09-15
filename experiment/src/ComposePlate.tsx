import { useId } from 'react'
import type { CSSProperties } from 'react'
import type { VoiceId } from './Press'
import type { WordId } from './notes'

type ComposePlateProps = {
  voice: VoiceId
  word: WordId
  setToday: string
}

const VOICE_TONE: Record<VoiceId, string> = {
  quiet: 'var(--blue)',
  human: 'var(--coral)',
  bold: 'var(--acid)',
}

const VOICE_LABEL: Record<VoiceId, string> = {
  quiet: 'quiet cut',
  human: 'human hand',
  bold: 'bold signal',
}

const VOICE_GLYPH: Record<VoiceId, string> = {
  quiet: 'A',
  human: 'B',
  bold: 'C',
}

const WORD_LABEL: Record<WordId, string> = {
  m3: 'M3',
  good: 'good at',
  yet: 'yet?',
}

export function ComposePlate({ voice, word, setToday }: ComposePlateProps) {
  const baseId = useId()
  const ruleId = `compose-plate-rule-${baseId.replace(/:/g, '')}`
  const style = { '--plate-tone': VOICE_TONE[voice] } as CSSProperties

  return (
    <figure className="compose-plate" aria-hidden="true" style={style}>
      <svg className="compose-plate__rule" viewBox="0 0 720 2" preserveAspectRatio="none">
        <defs>
          <linearGradient id={ruleId} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
            <stop offset="14%" stopColor="currentColor" stopOpacity=".65" />
            <stop offset="50%" stopColor="currentColor" stopOpacity=".95" />
            <stop offset="86%" stopColor="currentColor" stopOpacity=".65" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
        </defs>
        <line x1="2" y1="1" x2="718" y2="1" stroke={`url(#${ruleId})`} strokeWidth=".9" />
      </svg>

      <span className="compose-plate__edge compose-plate__edge--start">
        <svg viewBox="0 0 22 14" aria-hidden="true">
          <path d="M2 7h14" stroke="currentColor" strokeWidth=".8" strokeLinecap="round" />
          <circle cx="18" cy="7" r="2.2" fill="none" stroke="currentColor" strokeWidth=".8" />
          <circle cx="18" cy="7" r=".8" fill="currentColor" />
        </svg>
      </span>
      <span className="compose-plate__edge compose-plate__edge--end">
        <svg viewBox="0 0 22 14" aria-hidden="true">
          <path d="M6 7h14" stroke="currentColor" strokeWidth=".8" strokeLinecap="round" />
          <circle cx="4" cy="7" r="2.2" fill="none" stroke="currentColor" strokeWidth=".8" />
          <circle cx="4" cy="7" r=".8" fill="currentColor" />
        </svg>
      </span>

      <span className="compose-plate__cell compose-plate__cell--left">
        <span className="compose-plate__tag">composed by hand</span>
        <span className="compose-plate__rule-soft" />
      </span>

      <span className="compose-plate__monogram" aria-hidden="true">
        <svg viewBox="0 0 72 36">
          <circle cx="36" cy="18" r="14.5" fill="none" stroke="currentColor" strokeWidth=".55" />
          <circle cx="36" cy="18" r="9.5" fill="none" stroke="currentColor" strokeWidth=".35" strokeDasharray="1 2.2" opacity=".6" />
          <line x1="36" y1="2" x2="36" y2="34" stroke="currentColor" strokeWidth=".3" opacity=".4" />
          <line x1="20" y1="18" x2="52" y2="18" stroke="currentColor" strokeWidth=".3" opacity=".4" />
          <text
            x="36"
            y="22.5"
            textAnchor="middle"
            fontFamily="Georgia, 'Iowan Old Style', serif"
            fontStyle="italic"
            fontSize="13"
            letterSpacing="-.02em"
            fill="currentColor"
          >
            m³
          </text>
          <text
            x="36"
            y="6.5"
            textAnchor="middle"
            fontFamily="ui-monospace, monospace"
            fontSize="3.2"
            letterSpacing="1.6"
            fill="currentColor"
            opacity=".65"
          >
            PRESS
          </text>
          <text
            x="36"
            y="32"
            textAnchor="middle"
            fontFamily="ui-monospace, monospace"
            fontSize="3"
            letterSpacing="1.4"
            fill="currentColor"
            opacity=".55"
          >
            FOLIO · I
          </text>
        </svg>
      </span>

      <span className="compose-plate__cell compose-plate__cell--right">
        <span className="compose-plate__rule-soft" />
        <span className="compose-plate__tag">set on {setToday}</span>
      </span>

      <figcaption className="compose-plate__caption">
        <span className="compose-plate__caption-eyebrow">a pressman's plate</span>
        <span className="compose-plate__caption-mark" aria-hidden="true">※</span>
        <em>attention, not ornament</em>
        <span className="compose-plate__caption-meta">
          <span className={`compose-plate__chip compose-plate__chip--voice`}>
            <span className="compose-plate__chip-letter">{VOICE_GLYPH[voice]}</span>
            <span>{VOICE_LABEL[voice]}</span>
          </span>
          <span className="compose-plate__chip-sep" aria-hidden="true">·</span>
          <span className="compose-plate__chip">active word <em>{WORD_LABEL[word]}</em></span>
        </span>
      </figcaption>
    </figure>
  )
}
