import { type CSSProperties } from 'react'
import type { VoiceId } from './PressBay'

type PressRibbonProps = {
  voice: VoiceId
  setToday: string
  className?: string
}

const VOICE_LINE: Record<VoiceId, string> = {
  quiet: 'is Minimax good at frontend yet?',
  human: 'is M3 good at frontend yet?',
  bold: 'IS GOOD AT FRONTEND YET?',
}

const VOICE_TAG: Record<VoiceId, string> = {
  quiet: 'A · quiet cut',
  human: 'B · human hand',
  bold: 'C · bold signal',
}

const VOICE_LETTER: Record<VoiceId, string> = {
  quiet: 'A',
  human: 'B',
  bold: 'C',
}

const SETTING_BAR: { roman: string; sans: string; italic: string; monospace: string } = {
  roman: 'Aa',
  sans: 'Aa',
  italic: 'Aa',
  monospace: 'Aa',
}

export function PressRibbon({ voice, setToday, className = '' }: PressRibbonProps) {
  const style = {
    '--ribbon-voice': `var(--${voice === 'quiet' ? 'blue' : voice === 'human' ? 'coral' : 'acid'})`,
  } as CSSProperties
  return (
    <aside className={`press-ribbon press-ribbon--${voice} ${className}`} aria-hidden="true" style={style}>
      <span className="press-ribbon__rule press-ribbon__rule--left">
        <svg viewBox="0 0 120 14" preserveAspectRatio="none">
          <path
            d="M2 7c8 0 16 6 24 2s16-8 24-2 16 6 24-2 16-6 24-2 16 4 22 0"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            className="press-ribbon__rule-stroke"
          />
          <circle cx="118" cy="7" r="1.4" fill="currentColor" className="press-ribbon__rule-dot" />
        </svg>
      </span>

      <span className="press-ribbon__core">
        <span className="press-ribbon__slot">
          <span className="press-ribbon__slot-letter">{SETTING_BAR.roman.charAt(0)}</span>
          <span className="press-ribbon__slot-letter press-ribbon__slot-letter--sans">{SETTING_BAR.sans.charAt(1)}</span>
        </span>
        <span className="press-ribbon__title">
          <span className="press-ribbon__title-mark" aria-hidden="true">
            <svg viewBox="0 0 60 14" preserveAspectRatio="none">
              <path
                d="M2 7c4-3 8 3 12 0s8-3 12 0 8 3 12 0 8-3 12 0 8 3 8 3"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.8"
                strokeLinecap="round"
                className="press-ribbon__title-stroke"
              />
            </svg>
          </span>
          <span className="press-ribbon__title-text">{VOICE_LINE[voice]}</span>
          <span className="press-ribbon__title-mark press-ribbon__title-mark--right" aria-hidden="true">
            <svg viewBox="0 0 60 14" preserveAspectRatio="none">
              <path
                d="M58 7c-4-3-8 3-12 0s-8-3-12 0-8 3-12 0-8-3-12 0-8 3-8 3"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.8"
                strokeLinecap="round"
                className="press-ribbon__title-stroke"
              />
            </svg>
          </span>
        </span>
        <span className="press-ribbon__tags">
          <span className="press-ribbon__tag press-ribbon__tag--quiet">
            <span className="press-ribbon__tag-letter">A</span>
            <span className="press-ribbon__tag-text">quiet</span>
          </span>
          <span className="press-ribbon__tag press-ribbon__tag--human">
            <span className="press-ribbon__tag-letter">B</span>
            <span className="press-ribbon__tag-text">human</span>
          </span>
          <span className="press-ribbon__tag press-ribbon__tag--bold">
            <span className="press-ribbon__tag-letter">C</span>
            <span className="press-ribbon__tag-text">bold</span>
          </span>
          <span className="press-ribbon__tag press-ribbon__tag--now">
            <span className="press-ribbon__tag-letter">{VOICE_LETTER[voice]}</span>
            <span className="press-ribbon__tag-text">now</span>
          </span>
        </span>
      </span>

      <span className="press-ribbon__rule press-ribbon__rule--right">
        <svg viewBox="0 0 120 14" preserveAspectRatio="none">
          <path
            d="M118 7c-8 0-16 6-24 2s-16-8-24-2-16 6-24-2-16-6-24-2-16 4-22 0"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            className="press-ribbon__rule-stroke"
          />
          <circle cx="2" cy="7" r="1.4" fill="currentColor" className="press-ribbon__rule-dot" />
        </svg>
      </span>

      <span className="press-ribbon__meta">
        <span className="press-ribbon__meta-line">
          <span className="press-ribbon__meta-dot" aria-hidden="true" />
          set on {setToday} · press ribbon · folio i
          <span className="press-ribbon__meta-dot" aria-hidden="true" />
        </span>
        <span className="press-ribbon__meta-voice">
          voice <em>{VOICE_TAG[voice]}</em>
        </span>
      </span>
    </aside>
  )
}
