import { useId, type CSSProperties, type KeyboardEvent as ReactKeyboardEvent } from 'react'
import type { VoiceId } from './App'

type VoicePlateProps = {
  voice: VoiceId
  pullSignal: number
  onSelect: (voice: VoiceId) => void
}

type VoiceSpec = {
  letter: string
  name: string
  face: string
  point: string
  measure: string
  caption: string
  family: string
  weight: number
  style: 'italic' | 'normal'
  tracking: string
  uppercased: boolean
  sample: string
}

const VOICE: Record<VoiceId, VoiceSpec> = {
  quiet: {
    letter: 'A',
    name: 'quiet cut',
    face: 'serif · italic · close set',
    point: '24 pt · leading 26',
    measure: '12 characters on the plate',
    caption: 'the line said softly',
    family: "'Iowan Old Style', 'Palatino Linotype', Georgia, serif",
    weight: 400,
    style: 'italic',
    tracking: '-.018em',
    uppercased: false,
    sample: 'is m³ good at frontend yet?',
  },
  human: {
    letter: 'B',
    name: 'human hand',
    face: 'serif · italic · warm',
    point: '24 pt · leading 28',
    measure: '12 characters on the plate',
    caption: 'the line as a hand might write it',
    family: "'Iowan Old Style', 'Palatino Linotype', Georgia, serif",
    weight: 500,
    style: 'italic',
    tracking: '-.014em',
    uppercased: false,
    sample: 'is M3 good at frontend yet?',
  },
  bold: {
    letter: 'C',
    name: 'bold signal',
    face: 'sans · heavy · no apology',
    point: '22 pt · leading 24',
    measure: '12 characters on the plate',
    caption: 'the line, shouted honestly',
    family: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
    weight: 800,
    style: 'normal',
    tracking: '-.04em',
    uppercased: true,
    sample: 'IS M3 GOOD AT FRONTEND YET?',
  },
}

const ORDER: VoiceId[] = ['quiet', 'human', 'bold']

export function VoicePlate({ voice, pullSignal, onSelect }: VoicePlateProps) {
  const baseId = useId().replace(/:/g, '')
  const grainId = `vp-grain-${baseId}`
  const bleedId = `vp-bleed-${baseId}`
  const washId = `vp-wash-${baseId}`
  const spec = VOICE[voice]
  const toneStyle = { '--vp-tone': `var(--${voice})` } as CSSProperties
  const sampleStyle = {
    fontFamily: spec.family,
    fontWeight: spec.weight,
    fontStyle: spec.style,
    letterSpacing: spec.tracking,
    textTransform: spec.uppercased ? ('uppercase' as const) : ('none' as const),
  } as CSSProperties

  const onChipKey = (event: ReactKeyboardEvent<HTMLButtonElement>, target: VoiceId) => {
    const index = ORDER.indexOf(target)
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault()
      onSelect(ORDER[(index + 1) % ORDER.length])
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault()
      onSelect(ORDER[(index - 1 + ORDER.length) % ORDER.length])
    } else if (event.key === 'Home') {
      event.preventDefault()
      onSelect(ORDER[0])
    } else if (event.key === 'End') {
      event.preventDefault()
      onSelect(ORDER[ORDER.length - 1])
    }
  }

  return (
    <aside
      className={`voice-plate voice-plate--${voice}`}
      style={toneStyle}
      aria-label={`Specimen plate · the line set in ${spec.name}`}
    >
      <svg className="voice-plate__defs" viewBox="0 0 320 480" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <filter id={grainId} x="-2%" y="-2%" width="104%" height="104%">
            <feTurbulence type="fractalNoise" baseFrequency="1.6" numOctaves="2" seed="31" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 .09  0 0 0 0 .08  0 0 0 0 .12  0 0 0 .04 0" />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
          <filter id={bleedId} x="-12%" y="-12%" width="124%" height="124%">
            <feTurbulence type="fractalNoise" baseFrequency="2.4" numOctaves="2" seed="47" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 .1  0 0 0 0 .08  0 0 0 0 .12  0 0 0 .18 0" />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
          <radialGradient id={washId} cx="50%" cy="40%" r="70%">
            <stop offset="0%" stopColor="rgba(255, 248, 226, .35)" />
            <stop offset="56%" stopColor="rgba(255, 248, 226, .12)" />
            <stop offset="100%" stopColor="rgba(255, 248, 226, 0)" />
          </radialGradient>
        </defs>
      </svg>

      <header className="voice-plate__head" aria-hidden="true">
        <span className="voice-plate__eyebrow">
          <span className="voice-plate__eyebrow-bead" />
          specimen · this voice
        </span>
        <span className="voice-plate__head-rule" />
        <span className="voice-plate__head-letter">{spec.letter}</span>
      </header>

      <figure className={`voice-plate__paper voice-plate__paper--${voice}`} aria-hidden="true">
        <span className="voice-plate__paper-grain">
          <svg viewBox="0 0 320 480" preserveAspectRatio="none">
            <rect x="0" y="0" width="320" height="480" filter={`url(#${grainId})`} opacity=".05" />
          </svg>
        </span>
        <span className="voice-plate__paper-wash">
          <svg viewBox="0 0 320 480" preserveAspectRatio="none">
            <rect x="0" y="0" width="320" height="480" fill={`url(#${washId})`} />
          </svg>
        </span>

        <span className="voice-plate__corner voice-plate__corner--tl" aria-hidden="true">
          <svg viewBox="0 0 18 18">
            <path d="M.5 .5h17M.5 .5v17" stroke="currentColor" strokeWidth=".7" fill="none" strokeLinecap="square" />
            <path d="M4.5 .5v4M.5 4.5h4" stroke="currentColor" strokeWidth=".4" fill="none" opacity=".7" />
            <circle cx="2.4" cy="2.4" r="1.1" fill="none" stroke="currentColor" strokeWidth=".4" />
            <circle cx="2.4" cy="2.4" r=".4" fill="currentColor" />
          </svg>
        </span>
        <span className="voice-plate__corner voice-plate__corner--tr" aria-hidden="true">
          <svg viewBox="0 0 18 18">
            <path d="M.5 .5h17M.5 .5v17" stroke="currentColor" strokeWidth=".7" fill="none" strokeLinecap="square" />
            <path d="M13.5 .5v4M.5 4.5h4" stroke="currentColor" strokeWidth=".4" fill="none" opacity=".7" />
            <circle cx="2.4" cy="2.4" r="1.1" fill="none" stroke="currentColor" strokeWidth=".4" />
            <circle cx="2.4" cy="2.4" r=".4" fill="currentColor" />
          </svg>
        </span>
        <span className="voice-plate__corner voice-plate__corner--bl" aria-hidden="true">
          <svg viewBox="0 0 18 18">
            <path d="M.5 .5h17M.5 .5v17" stroke="currentColor" strokeWidth=".7" fill="none" strokeLinecap="square" />
            <path d="M4.5 13.5v4M.5 13.5h4" stroke="currentColor" strokeWidth=".4" fill="none" opacity=".7" />
            <circle cx="2.4" cy="15.6" r="1.1" fill="none" stroke="currentColor" strokeWidth=".4" />
            <circle cx="2.4" cy="15.6" r=".4" fill="currentColor" />
          </svg>
        </span>
        <span className="voice-plate__corner voice-plate__corner--br" aria-hidden="true">
          <svg viewBox="0 0 18 18">
            <path d="M.5 .5h17M.5 .5v17" stroke="currentColor" strokeWidth=".7" fill="none" strokeLinecap="square" />
            <path d="M13.5 13.5v4M.5 13.5h4" stroke="currentColor" strokeWidth=".4" fill="none" opacity=".7" />
            <circle cx="2.4" cy="15.6" r="1.1" fill="none" stroke="currentColor" strokeWidth=".4" />
            <circle cx="2.4" cy="15.6" r=".4" fill="currentColor" />
          </svg>
        </span>

        <span className="voice-plate__paper-stamp" aria-hidden="true">
          <span className="voice-plate__paper-stamp-key">plate</span>
          <span className="voice-plate__paper-stamp-rule" />
          <span className="voice-plate__paper-stamp-num">i</span>
          <span className="voice-plate__paper-stamp-dot" />
        </span>

        <span className="voice-plate__paper-head" aria-hidden="true">
          <span className="voice-plate__paper-head-row">
            <em>{spec.name}</em>
            <span className="voice-plate__paper-head-bead" />
          </span>
          <span className="voice-plate__paper-face">{spec.face}</span>
        </span>

        <span className="voice-plate__paper-baseline voice-plate__paper-baseline--a" aria-hidden="true">
          <span className="voice-plate__paper-baseline-tick voice-plate__paper-baseline-tick--l" />
          <span className="voice-plate__paper-baseline-rule" />
          <span className="voice-plate__paper-baseline-tick voice-plate__paper-baseline-tick--r" />
        </span>

        <p className="voice-plate__paper-line" style={sampleStyle} key={`plate-${voice}-${pullSignal}`}>
          {spec.sample}
        </p>

        <span className="voice-plate__paper-baseline voice-plate__paper-baseline--b" aria-hidden="true">
          <span className="voice-plate__paper-baseline-tick voice-plate__paper-baseline-tick--l" />
          <span className="voice-plate__paper-baseline-rule" />
          <span className="voice-plate__paper-baseline-tick voice-plate__paper-baseline-tick--r" />
        </span>

        <span className="voice-plate__paper-caption" aria-hidden="true">
          <em>— {spec.caption} —</em>
        </span>

        <footer className="voice-plate__paper-foot" aria-hidden="true">
          <span className="voice-plate__paper-foot-row">
            <span className="voice-plate__paper-foot-key">point</span>
            <em>{spec.point}</em>
          </span>
          <span className="voice-plate__paper-foot-row">
            <span className="voice-plate__paper-foot-key">measure</span>
            <em>{spec.measure}</em>
          </span>
          <span className="voice-plate__paper-foot-row">
            <span className="voice-plate__paper-foot-key">letter</span>
            <em>{spec.letter}</em>
          </span>
        </footer>

        <span className="voice-plate__paper-watermark" aria-hidden="true">
          <span>m³</span>
        </span>

        <span className="voice-plate__paper-fold" aria-hidden="true">
          <svg viewBox="0 0 4 240" preserveAspectRatio="none">
            <path
              d="M2 0c-1.4 40 1.4 80 0 120s1.4 80 0 120"
              fill="none"
              stroke="rgba(22, 21, 28, .18)"
              strokeWidth=".6"
              strokeLinecap="round"
              strokeDasharray="1 3.2"
            />
          </svg>
        </span>

        <span className="voice-plate__paper-corner-fold" aria-hidden="true">
          <svg viewBox="0 0 22 22">
            <path
              d="M22 0 L0 0 L0 22 Z"
              fill="rgba(22, 21, 28, .08)"
            />
            <path d="M0 0 L22 22" fill="none" stroke="rgba(22, 21, 28, .12)" strokeWidth=".4" />
          </svg>
        </span>

        <span className="voice-plate__paper-bleed" aria-hidden="true">
          <svg viewBox="0 0 320 480" preserveAspectRatio="none">
            <ellipse cx="160" cy="170" rx="120" ry="60" fill="currentColor" filter={`url(#${bleedId})`} opacity=".22" />
          </svg>
        </span>
      </figure>

      <div className="voice-plate__chips" role="radiogroup" aria-label="Switch the voice · A quiet, B human, C bold">
        <span className="voice-plate__chips-head" aria-hidden="true">
          <em>set in</em>
          <span className="voice-plate__chips-rule" />
        </span>
        <div className="voice-plate__chips-list">
          {ORDER.map(v => {
            const row = VOICE[v]
            const isActive = voice === v
            return (
              <button
                key={v}
                type="button"
                role="radio"
                aria-checked={isActive}
                className={`voice-plate__chip voice-plate__chip--${v} ${isActive ? 'is-active' : ''}`}
                onClick={() => onSelect(v)}
                onKeyDown={event => onChipKey(event, v)}
                aria-label={`${row.letter} · ${row.name}`}
              >
                <span className="voice-plate__chip-glyph" aria-hidden="true">
                  <svg viewBox="0 0 22 22">
                    <circle cx="11" cy="11" r="10" fill="none" stroke="currentColor" strokeWidth=".7" />
                    <circle cx="11" cy="11" r="6.4" fill="none" stroke="currentColor" strokeWidth=".4" strokeDasharray=".8 1.6" opacity=".55" />
                    <text
                      x="11"
                      y="14.5"
                      textAnchor="middle"
                      fontFamily="'Iowan Old Style', Georgia, serif"
                      fontStyle={v === 'bold' ? 'normal' : 'italic'}
                      fontWeight={v === 'bold' ? 800 : 500}
                      fontSize="11"
                      fill="currentColor"
                    >
                      {row.letter}
                    </text>
                  </svg>
                </span>
                <span className="voice-plate__chip-name" aria-hidden="true">{row.name}</span>
              </button>
            )
          })}
        </div>
      </div>

      <footer className="voice-plate__foot" aria-hidden="true">
        <span className="voice-plate__foot-rule" />
        <em className="voice-plate__foot-line">
          <span className="voice-plate__foot-set">set in {spec.name.toLowerCase()} · one line · one plate</span>
        </em>
        <span className="voice-plate__foot-key">
          cycle <kbd>shift</kbd>+<kbd>v</kbd>
        </span>
        <span className="voice-plate__foot-rule" />
      </footer>
    </aside>
  )
}
