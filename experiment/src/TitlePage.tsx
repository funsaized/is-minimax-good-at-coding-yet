import { useId } from 'react'
import type { CSSProperties } from 'react'
import type { VoiceId } from './Press'
import type { WordId } from './notes'

type TitlePageProps = {
  voice: VoiceId
  word: WordId
  setToday: string
}

const VOICE_TONE: Record<VoiceId, string> = {
  quiet: 'var(--blue)',
  human: 'var(--coral)',
  bold: 'var(--acid)',
}

const VOICE_NAME: Record<VoiceId, string> = {
  quiet: 'quiet cut',
  human: 'human hand',
  bold: 'bold signal',
}

const VOICE_LETTER: Record<VoiceId, string> = { quiet: 'A', human: 'B', bold: 'C' }

const WORD_LABEL: Record<WordId, string> = { m3: 'M3', good: 'good at', yet: 'yet' }
const WORD_GLYPH: Record<WordId, string> = { m3: '⌇', good: '∧', yet: '?' }
const WORD_KIND: Record<WordId, string> = { m3: 'stet', good: 'caret', yet: 'query' }
const WORD_KIND_NOTE: Record<WordId, string> = {
  m3: 'let it stand',
  good: 'make room',
  yet: 'protect the pause',
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

export function TitlePage({ voice, word, setToday }: TitlePageProps) {
  const baseId = useId().replace(/:/g, '')
  const grainId = `title-page-grain-${baseId}`
  const waxGrainId = `title-page-wax-grain-${baseId}`
  const paperGrainId = `title-page-paper-grain-${baseId}`
  const inkId = `title-page-ink-${baseId}`
  const ruleId = `title-page-rule-${baseId}`
  const style = {
    '--title-page-tone': VOICE_TONE[voice],
  } as CSSProperties
  const yearSuffix = formatYearSuffix()
  const season = formatSeason()
  const voiceName = VOICE_NAME[voice]

  return (
    <header
      className={`title-page title-page--${voice} title-page--word-${word}`}
      style={style}
      aria-label={`Title page · m³ press, folio i, set today ${setToday}, in the ${voiceName} voice, marked at ${WORD_LABEL[word]}`}
    >
      <svg className="title-page__defs" viewBox="0 0 1000 600" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <filter id={paperGrainId} x="0%" y="0%" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.86" numOctaves="2" seed="37" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 .14  0 0 0 0 .12  0 0 0 0 .19  0 0 0 .075 0" />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
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
          <filter id={waxGrainId} x="-12%" y="-12%" width="124%" height="124%">
            <feTurbulence type="fractalNoise" baseFrequency="2.6" numOctaves="2" seed="59" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .55 0" />
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

        <span className="title-page__paper" aria-hidden="true">
          <svg viewBox="0 0 1000 600" preserveAspectRatio="none">
            <rect x="0" y="0" width="1000" height="600" filter={`url(#${paperGrainId})`} opacity=".08" />
          </svg>
        </span>

        <span key={`stamp-${voice}`} className="title-page__stamp" aria-hidden="true">
          <span className="title-page__stamp-ring" />
          <span className="title-page__stamp-ring title-page__stamp-ring--inner" />
          <span className="title-page__stamp-mark">
            <svg viewBox="0 0 96 96" className="title-page__stamp-svg">
              <g filter={`url(#${waxGrainId})`} opacity=".95">
                <circle cx="48" cy="48" r="44" fill="none" stroke="currentColor" strokeWidth="1.1" />
                <circle cx="48" cy="48" r="36" fill="none" stroke="currentColor" strokeWidth=".4" strokeDasharray="1 2.4" />
                <text x="48" y="28" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="4.4" letterSpacing="2" fill="currentColor">PRESSED</text>
                <text x="48" y="58" textAnchor="middle" fontFamily="Georgia, serif" fontStyle="italic" fontSize="22" fill="currentColor">{VOICE_LETTER[voice]}</text>
                <text x="48" y="74" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="3.6" letterSpacing="1.6" fill="currentColor">{voiceName.toUpperCase()}</text>
                <path d="M48 4v8M48 84v8M4 48h8M84 48h8" stroke="currentColor" strokeWidth=".7" strokeLinecap="round" />
                <circle cx="48" cy="6" r="1.2" fill="currentColor" />
                <circle cx="48" cy="90" r="1.2" fill="currentColor" />
                <circle cx="6" cy="48" r="1.2" fill="currentColor" />
                <circle cx="90" cy="48" r="1.2" fill="currentColor" />
              </g>
            </svg>
          </span>
          <span className="title-page__stamp-drip" aria-hidden="true">
            <span className="title-page__stamp-drip-bead" />
            <span className="title-page__stamp-drip-wisp" />
          </span>
          <span className="title-page__stamp-caption" aria-hidden="true">
            <span>pressed in</span>
            <em>{voiceName}</em>
          </span>
        </span>

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

          <div className={`title-page__title title-page__title--${voice}`}>
            <span className="title-page__title-row title-page__title-row--lead">
              <span className="title-page__title-italic">is</span>
              <span className="title-page__title-spacer" />
              <span className="title-page__title-italic">Minimax</span>
            </span>
            <span className={`title-page__title-row title-page__title-row--mid ${word === 'm3' ? 'is-marked' : ''}`}>
              <span className="title-page__title-keyword">M3</span>
              <span className="title-page__title-mark" aria-hidden="true">
                <span className="title-page__title-mark-rule" />
                <span className="title-page__title-mark-glyph">{WORD_GLYPH.m3}</span>
                <span className="title-page__title-mark-tag">{WORD_KIND.m3}</span>
              </span>
            </span>
            <span className="title-page__title-row title-page__title-row--mid-2">
              <span className={`title-page__title-phrase ${word === 'good' ? 'is-marked' : ''}`}>
                good at
                <span className="title-page__title-mark" aria-hidden="true">
                  <span className="title-page__title-mark-rule" />
                  <span className="title-page__title-mark-glyph">{WORD_GLYPH.good}</span>
                  <span className="title-page__title-mark-tag">{WORD_KIND.good}</span>
                </span>
              </span>
              <span className="title-page__title-spacer" />
              <span className="title-page__title-italic">frontend</span>
            </span>
            <span className={`title-page__title-row title-page__title-row--trail ${word === 'yet' ? 'is-marked' : ''}`}>
              <span className="title-page__title-keyword title-page__title-keyword--yet">yet?</span>
              <span className="title-page__title-mark" aria-hidden="true">
                <span className="title-page__title-mark-rule" />
                <span className="title-page__title-mark-glyph">{WORD_GLYPH.yet}</span>
                <span className="title-page__title-mark-tag">{WORD_KIND.yet}</span>
              </span>
            </span>
          </div>

          <span className="title-page__display-annotation" aria-hidden="true">
            <span className="title-page__display-annotation-line" />
            <span className="title-page__display-annotation-tag">
              <span className="title-page__display-annotation-dot" />
              marked at <em>{WORD_LABEL[word]}</em>
              <span className="title-page__display-annotation-glyph">{WORD_GLYPH[word]}</span>
              <span className="title-page__display-annotation-note">— {WORD_KIND_NOTE[word]}</span>
              <span className="title-page__display-annotation-dot" />
            </span>
            <span className="title-page__display-annotation-line" />
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