import { useId } from 'react'
import type { CSSProperties } from 'react'
import type { VoiceId } from './Press'

type TitlePageProps = {
  voice: VoiceId
  setToday: string
}

const VOICE_TONE: Record<VoiceId, string> = {
  quiet: 'var(--blue)',
  human: 'var(--coral)',
  bold: 'var(--acid)',
}

const VOICE_GLYPH: Record<VoiceId, string> = {
  quiet: '·',
  human: '✦',
  bold: '■',
}

const VOICE_LETTER: Record<VoiceId, string> = { quiet: 'A', human: 'B', bold: 'C' }
const VOICE_NAME: Record<VoiceId, string> = {
  quiet: 'quiet cut',
  human: 'human hand',
  bold: 'bold signal',
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

export function TitlePage({ voice, setToday }: TitlePageProps) {
  const baseId = useId().replace(/:/g, '')
  const grainId = `title-page-grain-${baseId}`
  const ruleId = `title-page-rule-${baseId}`
  const inkId = `title-page-ink-${baseId}`
  const style = {
    '--title-page-tone': VOICE_TONE[voice],
    '--title-page-glyph': `"${VOICE_GLYPH[voice]}"`,
  } as CSSProperties
  const yearSuffix = formatYearSuffix()
  const season = formatSeason()
  const voiceName = VOICE_NAME[voice]

  return (
    <header
      className={`title-page title-page--${voice}`}
      style={style}
      aria-label={`Title page · m³ press, folio i, set today ${setToday}, in the ${voiceName} voice`}
    >
      <svg className="title-page__defs" viewBox="0 0 1000 600" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <filter id={grainId} x="-2%" y="-2%" width="104%" height="104%">
            <feTurbulence type="fractalNoise" baseFrequency="0.78" numOctaves="2" seed="37" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 .14  0 0 0 0 .12  0 0 0 0 .19  0 0 0 .075 0" />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
          <linearGradient id={ruleId} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
            <stop offset="14%" stopColor="currentColor" stopOpacity=".55" />
            <stop offset="50%" stopColor="currentColor" stopOpacity=".95" />
            <stop offset="86%" stopColor="currentColor" stopOpacity=".55" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
          <filter id={inkId} x="-4%" y="-50%" width="108%" height="200%">
            <feTurbulence type="fractalNoise" baseFrequency="2.4" numOctaves="2" seed="49" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .46 0" />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
        </defs>
      </svg>

      <span className="title-page__plate-tag" aria-hidden="true">
        <span className="title-page__plate-tag-glyph" />
        the title page · folio i · volume i
        <span className="title-page__plate-tag-glyph title-page__plate-tag-glyph--alt" />
      </span>

      <div className="title-page__plate" aria-hidden="true">
        <span className="title-page__crop title-page__crop--tl" />
        <span className="title-page__crop title-page__crop--tr" />
        <span className="title-page__crop title-page__crop--bl" />
        <span className="title-page__crop title-page__crop--br" />

        <span className="title-page__topline">
          <span className="title-page__topline-row">
            <span className="title-page__topline-tick" />
            <em>m³ press</em>
            <span className="title-page__topline-tick title-page__topline-tick--alt" />
          </span>
          <span className="title-page__topline-rule" aria-hidden="true">
            <svg viewBox="0 0 600 6" preserveAspectRatio="none">
              <g filter={`url(#${inkId})`}>
                <path d="M2 3c30-3 60 3 90 0s60-3 90 0 60 3 90 0 60-3 90 0 60 3 90 0 60-3 90 0 60 3 90 0 60-3 28 0" fill="none" stroke={`url(#${ruleId})`} strokeWidth=".7" strokeLinecap="round" pathLength="100" />
              </g>
              <circle cx="2" cy="3" r="1.1" fill="currentColor" />
              <circle cx="598" cy="3" r="1.1" fill="currentColor" />
            </svg>
          </span>
          <span className="title-page__topline-row title-page__topline-row--alt">
            <span>anno · {yearSuffix}</span>
            <span aria-hidden="true">·</span>
            <em>{season}</em>
            <span aria-hidden="true">·</span>
            <span>set today</span>
          </span>
        </span>

        <div className="title-page__monogram" aria-hidden="true">
          <span className="title-page__monogram-fleur title-page__monogram-fleur--lead">❦</span>
          <svg className="title-page__monogram-svg" viewBox="0 0 132 132">
            <defs>
              <filter id={`title-page-monogram-grain-${baseId}`} x="-12%" y="-12%" width="124%" height="124%">
                <feTurbulence type="fractalNoise" baseFrequency="2.4" numOctaves="2" seed="53" stitchTiles="stitch" />
                <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .5 0" />
                <feComposite in2="SourceGraphic" operator="in" />
              </filter>
            </defs>
            <g filter={`url(#title-page-monogram-grain-${baseId})`} opacity=".95">
              <circle cx="66" cy="66" r="60" fill="none" stroke="currentColor" strokeWidth="1.4" />
              <circle cx="66" cy="66" r="50" fill="none" stroke="currentColor" strokeWidth=".5" strokeDasharray="1 2.4" opacity=".7" />
              <circle cx="66" cy="66" r="42" fill="none" stroke="currentColor" strokeWidth=".35" opacity=".4" />
              <text x="66" y="32" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="5" letterSpacing="2.4" fill="currentColor">PRESS · MONOGRAM</text>
              <text x="66" y="78" textAnchor="middle" fontFamily="Georgia, serif" fontStyle="italic" fontSize="34" fill="currentColor">m³</text>
              <text x="66" y="98" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="4.4" letterSpacing="2" fill="currentColor">FOLIO · i</text>
              <text x="66" y="112" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="3.8" letterSpacing="1.6" fill="currentColor" opacity=".7">TITLE · OPENED</text>
              <path d="M6 66h6M120 66h6M66 6v6M66 120v6" stroke="currentColor" strokeWidth=".7" strokeLinecap="round" />
              <circle cx="66" cy="6" r="1.4" fill="currentColor" />
              <circle cx="66" cy="120" r="1.4" fill="currentColor" />
              <circle cx="6" cy="66" r="1.1" fill="currentColor" />
              <circle cx="120" cy="66" r="1.1" fill="currentColor" />
            </g>
          </svg>
          <span className="title-page__monogram-fleur title-page__monogram-fleur--trail">❦</span>
        </div>

        <div className="title-page__display">
          <span className="title-page__display-row title-page__display-row--top">
            <span className="title-page__display-rule title-page__display-rule--lead" aria-hidden="true" />
            <span className="title-page__display-eyebrow">
              <span className="title-page__display-eyebrow-tick" aria-hidden="true" />
              <em>an open question</em>
              <span className="title-page__display-eyebrow-tick title-page__display-eyebrow-tick--alt" aria-hidden="true" />
            </span>
            <span className="title-page__display-rule" aria-hidden="true" />
          </span>
          <h2 className="title-page__display-title" aria-hidden="true">
            <em className="title-page__display-title-em title-page__display-title-em--quiet">is Minimax</em>
            <span className="title-page__display-title-sep" aria-hidden="true">
              <span className="title-page__display-title-sep-rule" />
              <span className="title-page__display-title-sep-bead" />
              <span className="title-page__display-title-sep-rule title-page__display-title-sep-rule--alt" />
            </span>
            <em className="title-page__display-title-em title-page__display-title-em--loud">M3</em>
          </h2>
          <span className="title-page__display-row title-page__display-row--bot">
            <span className="title-page__display-sub">
              <em>good at frontend</em>
              <span aria-hidden="true">·</span>
              <em>yet?</em>
            </span>
          </span>
        </div>

        <span className="title-page__flourish" aria-hidden="true">
          <svg viewBox="0 0 720 28" preserveAspectRatio="none">
            <g filter={`url(#${inkId})`}>
              <path
                className="title-page__flourish-stroke"
                d="M2 14c30-9 60 9 90 0s60-12 90-2 60 12 90 2 60-12 90-2 60 9 90 0 60-9 90-2 60 12 90 2"
                fill="none"
                stroke={`url(#${ruleId})`}
                strokeWidth="1.1"
                strokeLinecap="round"
                pathLength="100"
                strokeDasharray="100 100"
              />
            </g>
            <circle className="title-page__flourish-bead title-page__flourish-bead--lead" cx="2" cy="14" r="1.6" fill="currentColor" />
            <circle className="title-page__flourish-bead title-page__flourish-bead--trail" cx="718" cy="14" r="1.6" fill="currentColor" />
          </svg>
        </span>

        <div className="title-page__cells" aria-hidden="true">
          <span className="title-page__cell title-page__cell--folio">
            <span className="title-page__cell-key">folio</span>
            <span className="title-page__cell-value"><em>i</em></span>
          </span>
          <span className="title-page__cell-rule" aria-hidden="true" />
          <span className="title-page__cell title-page__cell--title">
            <span className="title-page__cell-key">the title page</span>
            <span className="title-page__cell-value"><em>set today</em></span>
          </span>
          <span className="title-page__cell-rule" aria-hidden="true" />
          <span className="title-page__cell title-page__cell--voice">
            <span className="title-page__cell-key">now in</span>
            <span className="title-page__cell-value">
              <span className={`title-page__cell-voice-letter title-page__cell-voice-letter--${voice}`}>
                {VOICE_LETTER[voice]}
              </span>
              <em>{voiceName}</em>
            </span>
          </span>
          <span className="title-page__cell-rule" aria-hidden="true" />
          <span className="title-page__cell title-page__cell--date">
            <span className="title-page__cell-key">set on</span>
            <span className="title-page__cell-value"><em>{setToday}</em></span>
          </span>
        </div>

        <p className="title-page__dedication" aria-hidden="true">
          <span className="title-page__dedication-mark title-page__dedication-mark--lead">※</span>
          <em className="title-page__dedication-line">
            composed by hand <span aria-hidden="true">·</span> folded once <span aria-hidden="true">·</span> kept by the next reader
          </em>
          <span className="title-page__dedication-mark title-page__dedication-mark--trail">※</span>
        </p>
      </div>

      <span className="title-page__handed" aria-hidden="true">
        <svg viewBox="0 0 320 18" preserveAspectRatio="none">
          <path
            className="title-page__handed-stroke"
            d="M2 10c14-7 28 4 42-1s28-7 42-1 28 4 42-2 28-7 42-1 28 4 42-2 28-7 42-1 28 4 42-1 14 0 14 0"
            fill="none"
            stroke="currentColor"
            strokeWidth=".85"
            strokeLinecap="round"
            pathLength="100"
            strokeDasharray="100 100"
          />
          <circle cx="316" cy="9" r="1.4" fill="currentColor" className="title-page__handed-bead" />
        </svg>
        <span className="title-page__handed-tag">read on · the question lands below</span>
      </span>
    </header>
  )
}
