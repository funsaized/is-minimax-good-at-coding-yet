import { useId } from 'react'
import type { CSSProperties } from 'react'
import type { VoiceId } from './Press'

type PressMastheadProps = {
  voice: VoiceId
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

const VOICE_LETTER: Record<VoiceId, string> = { quiet: 'A', human: 'B', bold: 'C' }

const VOICE_FACE: Record<VoiceId, string> = {
  quiet: 'serif · italic · close set',
  human: 'serif · italic · a little warm',
  bold: 'display · heavy · no apology',
}

function formatYearSuffix(): string {
  return String(new Date().getFullYear()).slice(-2)
}

function formatSeason(): string {
  const month = new Date().getMonth()
  if (month <= 1 || month === 11) return 'winter'
  if (month <= 4) return 'spring'
  if (month <= 7) return 'summer'
  return 'autumn'
}

export function PressMasthead({ voice, setToday }: PressMastheadProps) {
  const baseId = useId().replace(/:/g, '')
  const grainId = `press-masthead-grain-${baseId}`
  const style = { '--masthead-tone': VOICE_TONE[voice] } as CSSProperties
  const yearSuffix = formatYearSuffix()
  const season = formatSeason()
  const voiceName = VOICE_LABEL[voice]

  return (
    <header
      className={`press-masthead press-masthead--${voice}`}
      style={style}
      aria-label={`Press masthead — m³ press, folio i the title page, set today ${setToday}, in the ${voiceName} voice.`}
    >
      <svg className="press-masthead__defs" viewBox="0 0 800 320" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <filter id={grainId} x="-2%" y="-2%" width="104%" height="104%">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="31" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 .14  0 0 0 0 .12  0 0 0 0 .19  0 0 0 .07 0" />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
          <linearGradient id={`press-masthead-rule-${baseId}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
            <stop offset="14%" stopColor="currentColor" stopOpacity=".55" />
            <stop offset="50%" stopColor="currentColor" stopOpacity=".85" />
            <stop offset="86%" stopColor="currentColor" stopOpacity=".55" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      <span className="press-masthead__crop press-masthead__crop--tl" aria-hidden="true" />
      <span className="press-masthead__crop press-masthead__crop--tr" aria-hidden="true" />
      <span className="press-masthead__crop press-masthead__crop--bl" aria-hidden="true" />
      <span className="press-masthead__crop press-masthead__crop--br" aria-hidden="true" />

      <div className="press-masthead__topline" aria-hidden="true">
        <span className="press-masthead__topline-tag press-masthead__topline-tag--lead">
          <span className="press-masthead__topline-tick" />
          m<sup>3</sup> press
        </span>
        <span className="press-masthead__topline-rule" />
        <span className="press-masthead__topline-tag">anno · <em>{yearSuffix}</em></span>
        <span className="press-masthead__topline-rule press-masthead__topline-rule--mid" />
        <span className="press-masthead__topline-tag">volume i · folio i</span>
        <span className="press-masthead__topline-rule" />
        <span className="press-masthead__topline-tag press-masthead__topline-tag--trail">
          {season} edition
          <span className="press-masthead__topline-tick press-masthead__topline-tick--alt" />
        </span>
      </div>

      <div className="press-masthead__plate">
        <span className="press-masthead__fleuron press-masthead__fleuron--lead" aria-hidden="true">❦</span>

        <h2 className="press-masthead__display" aria-hidden="true">
          <span className="press-masthead__display-pre">
            <span className="press-masthead__display-pre-rule" />
            <span className="press-masthead__display-pre-tag">the masthead</span>
          </span>
          <span className="press-masthead__display-row">
            <em className="press-masthead__display-em press-masthead__display-em--lead">m³</em>
            <span className="press-masthead__display-divider" aria-hidden="true">
              <span className="press-masthead__display-divider-rule" />
              <span className="press-masthead__display-divider-bead" />
              <span className="press-masthead__display-divider-rule press-masthead__display-divider-rule--alt" />
            </span>
            <em className="press-masthead__display-em press-masthead__display-em--trail">press</em>
          </span>
          <span className="press-masthead__display-sub">
            <em>an editorial experiment</em>
            <span className="press-masthead__display-sub-tag" aria-hidden="true">·</span>
            <span>set in one page</span>
          </span>
        </h2>

        <span className="press-masthead__fleuron press-masthead__fleuron--trail" aria-hidden="true">❦</span>
      </div>

      <span className="press-masthead__rule" aria-hidden="true">
        <svg viewBox="0 0 800 8" preserveAspectRatio="none">
          <g opacity=".9">
            <path
              d="M2 4c30-3 60 3 90 0s60-3 90 0 60 3 90 0 60-3 90 0 60 3 90 0 60-3 90 0 60 3 90 0 60-3 28 0"
              fill="none"
              stroke={`url(#press-masthead-rule-${baseId})`}
              strokeWidth=".85"
              strokeLinecap="round"
              pathLength="100"
              strokeDasharray="100 100"
              className="press-masthead__rule-stroke"
            />
          </g>
          <circle cx="2" cy="4" r="1.3" fill="currentColor" className="press-masthead__rule-bead press-masthead__rule-bead--lead" />
          <circle cx="798" cy="4" r="1.3" fill="currentColor" className="press-masthead__rule-bead press-masthead__rule-bead--trail" />
        </svg>
      </span>

      <div className="press-masthead__cells" aria-hidden="true">
        <span className="press-masthead__cell press-masthead__cell--folio">
          <span className="press-masthead__cell-key">folio</span>
          <span className="press-masthead__cell-value"><em>i</em></span>
        </span>
        <span className="press-masthead__cell-rule" aria-hidden="true" />
        <span className="press-masthead__cell press-masthead__cell--title">
          <span className="press-masthead__cell-key">the</span>
          <span className="press-masthead__cell-value"><em>title page</em></span>
        </span>
        <span className="press-masthead__cell-rule" aria-hidden="true" />
        <span className="press-masthead__cell press-masthead__cell--voice">
          <span className="press-masthead__cell-key">now in</span>
          <span className="press-masthead__cell-value">
            <span className={`press-masthead__cell-voice-letter press-masthead__cell-voice-letter--${voice}`}>
              {VOICE_LETTER[voice]}
            </span>
            <em>{voiceName}</em>
          </span>
          <span className="press-masthead__cell-face">{VOICE_FACE[voice]}</span>
        </span>
        <span className="press-masthead__cell-rule" aria-hidden="true" />
        <span className="press-masthead__cell press-masthead__cell--date">
          <span className="press-masthead__cell-key">set today</span>
          <span className="press-masthead__cell-value"><em>{setToday}</em></span>
        </span>
      </div>

      <p className="press-masthead__tagline" aria-hidden="true">
        <span className="press-masthead__tagline-mark">※</span>
        composed by hand <span className="press-masthead__tagline-sep">·</span> folded once <span className="press-masthead__tagline-sep">·</span> kept in time
        <span className="press-masthead__tagline-mark press-masthead__tagline-mark--alt">※</span>
      </p>
    </header>
  )
}