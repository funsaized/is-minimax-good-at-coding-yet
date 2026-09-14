import type { CSSProperties } from 'react'
import type { VoiceId } from './PressBay'

type TypePlateProps = {
  active: VoiceId
  onSelect: (id: VoiceId) => void
}

type PlateVoice = {
  voice: VoiceId
  letter: string
  name: string
  face: string
  ink: string
  swatch: string
  paperTone: string
  display: string
  body: string
  micro: string
  rule: string
  motto: string
}

const PLATE: PlateVoice[] = [
  {
    voice: 'quiet',
    letter: 'A',
    name: 'quiet cut',
    face: 'serif · italic · close set',
    ink: 'paper on midnight',
    swatch: 'var(--paper)',
    paperTone: 'rgba(243, 236, 214, .04)',
    display: 'is M3',
    body: 'good at frontend',
    micro: 'yet?',
    rule: 'attention, not ornament',
    motto: 'gets out of the way',
  },
  {
    voice: 'human',
    letter: 'B',
    name: 'human hand',
    face: 'serif · italic · warm',
    ink: 'coral on plum',
    swatch: 'var(--coral)',
    paperTone: 'rgba(255, 118, 95, .05)',
    display: 'is M3',
    body: 'good at frontend',
    micro: 'yet?',
    rule: 'a little wobble',
    motto: 'feels like a person',
  },
  {
    voice: 'bold',
    letter: 'C',
    name: 'bold signal',
    face: 'sans · heavy · no apology',
    ink: 'acid on midnight',
    swatch: 'var(--acid)',
    paperTone: 'rgba(216, 255, 106, .06)',
    display: 'IS',
    body: 'GOOD AT',
    micro: 'FRONTEND YET?',
    rule: 'the poster voice',
    motto: 'answers with its whole chest',
  },
]

function PlateScale({ voice, isActive, onSelect }: { voice: PlateVoice; isActive: boolean; onSelect: (id: VoiceId) => void }) {
  const style = {
    '--plate-paper': voice.paperTone,
    '--plate-ink': voice.swatch === 'var(--paper)' ? 'var(--paper)' : voice.swatch === 'var(--coral)' ? 'var(--coral)' : 'var(--acid)',
    '--plate-swatch': voice.swatch,
  } as CSSProperties
  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      tabIndex={isActive ? 0 : -1}
      onClick={() => onSelect(voice.voice)}
      className={`type-plate__row type-plate__row--${voice.voice} ${isActive ? 'is-active' : ''}`}
      style={style}
    >
      <span className="type-plate__bar" aria-hidden="true">
        <span className="type-plate__bar-letter">{voice.letter}</span>
        <span className="type-plate__bar-line" />
        <span className="type-plate__bar-name">{voice.name}</span>
        <span className="type-plate__bar-pip" />
      </span>
      <span className={`type-plate__display type-plate__display--${voice.voice}`}>
        {voice.display}
      </span>
      <span className={`type-plate__body type-plate__body--${voice.voice}`}>
        {voice.body}
      </span>
      <span className="type-plate__micro-row" aria-hidden="true">
        <span className={`type-plate__micro type-plate__micro--${voice.voice}`}>
          {voice.micro}
        </span>
        <span className="type-plate__meta">
          <span className="type-plate__meta-face">{voice.face}</span>
          <span className="type-plate__meta-ink">
            <span className="type-plate__meta-swatch" />
            {voice.ink}
          </span>
        </span>
      </span>
      <span className="type-plate__rule" aria-hidden="true">
        <svg viewBox="0 0 200 8" preserveAspectRatio="none">
          <path
            d="M2 4c12-5 24 4 36-1s24-5 36-2 24 4 36-2 24-4 36-1 24 4 36-1 14-2 14-2"
            fill="none"
            stroke="currentColor"
            strokeWidth=".9"
            strokeLinecap="round"
            pathLength="100"
            strokeDasharray="100 100"
            className="type-plate__rule-stroke"
          />
          <circle cx="194" cy="4" r="1.1" fill="currentColor" />
        </svg>
        <em>{voice.rule}</em>
        <span className="type-plate__rule-motto">{voice.motto}</span>
      </span>
    </button>
  )
}

export function TypePlate({ active, onSelect }: TypePlateProps) {
  return (
    <div className="type-plate" role="tablist" aria-label="The three voices, side by side">
      <span className="type-plate__head" aria-hidden="true">
        <span className="type-plate__head-rule" />
        <span className="type-plate__head-tag">folio v · specimen plate</span>
        <span className="type-plate__head-rule" />
      </span>
      <ol className="type-plate__stack">
        {PLATE.map(voice => (
          <li key={voice.voice} className="type-plate__cell">
            <PlateScale voice={voice} isActive={active === voice.voice} onSelect={onSelect} />
          </li>
        ))}
      </ol>
      <span className="type-plate__foot" aria-hidden="true">
        <span className="type-plate__foot-mark" />
        <span>three pressings · one mark · choose a row to set the press</span>
        <span className="type-plate__foot-mark" />
      </span>
    </div>
  )
}