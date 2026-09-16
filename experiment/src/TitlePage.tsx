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

const VOICE_FACE: Record<VoiceId, string> = {
  quiet: 'serif · italic · close set',
  human: 'serif · italic · a little warm',
  bold: 'sans · heavy · no apology',
}

const VOICE_TAGLINE: Record<VoiceId, string> = {
  quiet: 'a small line, set with care',
  human: 'a small line, set by hand',
  bold: 'a small line, set without apology',
}

const VOICE_PRESS_TAG: Record<VoiceId, string> = {
  quiet: 'a quiet pull',
  human: 'a hand-set pull',
  bold: 'a final pull',
}

const WORD_LABEL: Record<WordId, string> = { m3: 'M3', good: 'good at', yet: 'yet' }
const WORD_GLYPH: Record<WordId, string> = { m3: '⌇', good: '∧', yet: '?' }
const WORD_KIND: Record<WordId, string> = { m3: 'stet', good: 'caret', yet: 'query' }
const WORD_NOTE: Record<WordId, string> = {
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
  const inkId = `title-page-ink-${baseId}`
  const ruleId = `title-page-rule-${baseId}`
  const strikeGrainId = `title-page-strike-${baseId}`
  const strikeInkId = `title-page-strike-ink-${baseId}`
  const askStrokeId = `title-page-ask-${baseId}`
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
          <filter id={strikeGrainId} x="-12%" y="-12%" width="124%" height="124%">
            <feTurbulence type="fractalNoise" baseFrequency="1.4" numOctaves="2" seed="113" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .4 0" />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
          <filter id={strikeInkId} x="-6%" y="-6%" width="112%" height="112%">
            <feTurbulence type="fractalNoise" baseFrequency="2.2" numOctaves="2" seed="127" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .55 0" />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
        </defs>
      </svg>

      <span className="title-page__plate-tag" aria-hidden="true">
        <span className="title-page__plate-tag-mark" />
        m³ press <em>·</em> an open question <em>·</em> folio i <em>·</em> set today
        <span className="title-page__plate-tag-mark title-page__plate-tag-mark--alt" />
      </span>

      <div className="title-page__plate">
        <span className="title-page__crop title-page__crop--tl" />
        <span className="title-page__crop title-page__crop--tr" />
        <span className="title-page__crop title-page__crop--bl" />
        <span className="title-page__crop title-page__crop--br" />

        <span className="title-page__paper" aria-hidden="true">
          <svg viewBox="0 0 1000 600" preserveAspectRatio="none">
            <rect x="0" y="0" width="1000" height="600" filter={`url(#${grainId})`} opacity=".06" />
          </svg>
        </span>

        <span className="title-page__seal" aria-hidden="true">
          <svg viewBox="0 0 96 96" className="title-page__seal-svg">
            <g filter={`url(#${grainId})`} opacity=".78">
              <circle cx="48" cy="48" r="44" fill="none" stroke="currentColor" strokeWidth="1.2" />
              <circle cx="48" cy="48" r="36" fill="none" stroke="currentColor" strokeWidth=".4" strokeDasharray=".8 1.8" opacity=".6" />
              <circle cx="48" cy="48" r="30" fill="none" stroke="currentColor" strokeWidth=".25" opacity=".35" />
              <path d="M48 14 L48 22 M48 74 L48 82 M14 48 L22 48 M74 48 L82 48" stroke="currentColor" strokeWidth=".55" strokeLinecap="round" opacity=".5" />
              <text x="48" y="29" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="3.6" letterSpacing="2" fill="currentColor">FOLIO · I</text>
              <text x="48" y="58" textAnchor="middle" fontFamily="Georgia, serif" fontStyle="italic" fontSize="24" fill="currentColor">m³</text>
              <text x="48" y="71" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="3" letterSpacing="1.8" fill="currentColor" opacity=".85">PRESSED TODAY</text>
            </g>
          </svg>
        </span>

        <div className={`title-page__display title-page__display--${voice}`}>
          <span className="title-page__display-eyebrow" aria-hidden="true">
            <span className="title-page__display-eyebrow-line" />
            <em>{VOICE_TAGLINE[voice]}</em>
            <span className="title-page__display-eyebrow-line title-page__display-eyebrow-line--alt" />
          </span>

          <h1 className={`title-page__title title-page__title--${voice}`}>
            <span className="title-page__title-row title-page__title-row--lead">
              <span className="title-page__title-italic">is</span>
              <span className="title-page__title-spacer" />
              <span className="title-page__title-italic">Minimax</span>
              <span className={`title-page__title-mark title-page__title-mark--${word === 'm3' ? 'on' : 'off'}`} aria-hidden="true">
                <span className="title-page__title-mark-rule" />
                <span className="title-page__title-mark-glyph">{WORD_GLYPH.m3}</span>
                <span className="title-page__title-mark-tag">{WORD_KIND.m3}</span>
              </span>
            </span>
            <span className={`title-page__title-row title-page__title-row--mid ${word === 'm3' ? 'is-marked' : ''}`}>
              <span className="title-page__title-keyword">M3</span>
            </span>
            <span className={`title-page__title-row title-page__title-row--mid-2 ${word === 'good' ? 'is-marked' : ''}`}>
              <span className="title-page__title-phrase">
                good at
                <span className={`title-page__title-mark title-page__title-mark--${word === 'good' ? 'on' : 'off'}`} aria-hidden="true">
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
              <span className={`title-page__title-mark title-page__title-mark--${word === 'yet' ? 'on' : 'off'}`} aria-hidden="true">
                <span className="title-page__title-mark-rule" />
                <span className="title-page__title-mark-glyph">{WORD_GLYPH.yet}</span>
                <span className="title-page__title-mark-tag">{WORD_KIND.yet}</span>
              </span>
              <span className="title-page__title-ask" aria-hidden="true">
                <svg viewBox="0 0 220 18" preserveAspectRatio="none" className="title-page__title-ask-svg">
                  <path
                    className="title-page__title-ask-stroke"
                    d="M2 11c18-7 36 4 54-1s36-7 54-1 36 4 54-2 36-7 54-1"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    pathLength="100"
                    id={askStrokeId}
                  />
                  <circle cx="2" cy="11" r="1.4" fill="currentColor" className="title-page__title-ask-bead title-page__title-ask-bead--lead" />
                  <circle cx="218" cy="9" r="1.6" fill="currentColor" className="title-page__title-ask-bead title-page__title-ask-bead--trail" />
                </svg>
              </span>
            </span>
          </h1>

          <span className="title-page__display-annotation" aria-hidden="true">
            <span className="title-page__display-annotation-line" />
            <span className="title-page__display-annotation-tag">
              <span className="title-page__display-annotation-glyph">{WORD_GLYPH[word]}</span>
              <em>marked at {WORD_LABEL[word]}</em>
              <span className="title-page__display-annotation-note">— {WORD_NOTE[word]}</span>
            </span>
            <span className="title-page__display-annotation-line" />
          </span>
        </div>

        <span className="title-page__fleuron" aria-hidden="true">
          <svg viewBox="0 0 96 16" preserveAspectRatio="xMidYMid meet" className="title-page__fleuron-svg">
            <g filter={`url(#${inkId})`}>
              <path
                className="title-page__fleuron-rule title-page__fleuron-rule--lead"
                d="M2 8 L36 8"
                fill="none"
                stroke="currentColor"
                strokeWidth=".55"
                strokeLinecap="round"
                pathLength="100"
              />
              <path
                className="title-page__fleuron-rule title-page__fleuron-rule--trail"
                d="M60 8 L94 8"
                fill="none"
                stroke="currentColor"
                strokeWidth=".55"
                strokeLinecap="round"
                pathLength="100"
              />
              <circle className="title-page__fleuron-bead title-page__fleuron-bead--lead" cx="40" cy="8" r="1.2" fill="currentColor" />
              <path
                className="title-page__fleuron-diamond"
                d="M48 1.5 L55 8 L48 14.5 L41 8 Z"
                fill="none"
                stroke="currentColor"
                strokeWidth=".7"
                strokeLinejoin="round"
              />
              <path
                className="title-page__fleuron-spine"
                d="M48 4 L48 12"
                fill="none"
                stroke="currentColor"
                strokeWidth=".55"
                strokeLinecap="round"
              />
              <circle className="title-page__fleuron-bead title-page__fleuron-bead--trail" cx="56" cy="8" r="1.2" fill="currentColor" />
            </g>
          </svg>
          <span className="title-page__fleuron-tag" aria-hidden="true">
            <em>typesetter's mark</em>
            <span className="title-page__fleuron-tag-sep" aria-hidden="true">·</span>
            <span>folio i</span>
          </span>
        </span>

        <span className="title-page__strike" aria-hidden="true">
          <span className="title-page__strike-ring" />
          <span className="title-page__strike-ring title-page__strike-ring--alt" />
          <svg className="title-page__strike-mark" viewBox="0 0 100 100">
            <g filter={`url(#${strikeGrainId})`} opacity="0.9">
              <circle cx="50" cy="50" r="36" fill="none" stroke="currentColor" strokeWidth="1.4" />
              <circle cx="50" cy="50" r="29" fill="none" stroke="currentColor" strokeWidth=".5" strokeDasharray="1.1 1.8" opacity=".6" />
              <circle cx="50" cy="50" r="22" fill="none" stroke="currentColor" strokeWidth=".3" opacity=".35" />
              <path d="M50 22 L50 30 M50 70 L50 78 M22 50 L30 50 M70 50 L78 50" stroke="currentColor" strokeWidth=".7" strokeLinecap="round" opacity=".55" />
              <text x="50" y="40" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="3.6" letterSpacing="1.4" fill="currentColor" opacity=".75">ASKED</text>
              <text x="50" y="58" textAnchor="middle" fontFamily="Georgia, serif" fontStyle="italic" fontSize="14" fill="currentColor">m³</text>
              <text x="50" y="70" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="3" letterSpacing="1.4" fill="currentColor" opacity=".65">FOLIO · I</text>
            </g>
            <g filter={`url(#${strikeInkId})`} opacity=".7">
              <circle cx="34" cy="36" r="3" fill="currentColor" />
              <circle cx="68" cy="62" r="2" fill="currentColor" opacity=".55" />
            </g>
          </svg>
          <span className="title-page__strike-tag">
            <span className="title-page__strike-tag-mark" />
            <em>{VOICE_PRESS_TAG[voice]}</em>
            <span className="title-page__strike-tag-mark title-page__strike-tag-mark--alt" />
          </span>
        </span>

        <span className="title-page__flourish" aria-hidden="true">
          <svg viewBox="0 0 720 12" preserveAspectRatio="none">
            <g filter={`url(#${inkId})`}>
              <path
                className="title-page__flourish-stroke"
                d="M2 6c30-5 60 5 90 0s60-8 90-2 60 8 90 2 60-8 90-2 60 5 90 0 60-5 90-2 60 8 90 2"
                fill="none"
                stroke={`url(#${ruleId})`}
                strokeWidth="1"
                strokeLinecap="round"
                pathLength="100"
                strokeDasharray="100 100"
              />
            </g>
            <circle className="title-page__flourish-bead title-page__flourish-bead--lead" cx="2" cy="6" r="1.4" fill="currentColor" />
            <circle className="title-page__flourish-bead title-page__flourish-bead--trail" cx="718" cy="6" r="1.4" fill="currentColor" />
          </svg>
        </span>

        <p className="title-page__dedication" aria-hidden="true">
          <span className="title-page__dedication-mark title-page__dedication-mark--lead">※</span>
          <em className="title-page__dedication-line">
            composed by hand <span aria-hidden="true">·</span> folded once <span aria-hidden="true">·</span> kept by the next reader
          </em>
          <span className="title-page__dedication-mark title-page__dedication-mark--trail">※</span>
        </p>

        <span className="title-page__voice" aria-hidden="true">
          <span className="title-page__voice-mark" />
          <span className="title-page__voice-tag">now setting in <em>{voiceName}</em></span>
          <span className="title-page__voice-face">{VOICE_FACE[voice]}</span>
          <span className="title-page__voice-mark title-page__voice-mark--alt" />
        </span>

        <span className="title-page__colophon" aria-hidden="true">
          <span className="title-page__colophon-row">
            <em>anno</em> <span aria-hidden="true">·</span> {yearSuffix}
            <span className="title-page__colophon-sep" aria-hidden="true">·</span>
            <em>{season}</em>
            <span className="title-page__colophon-sep" aria-hidden="true">·</span>
            set <em>{setToday}</em>
          </span>
        </span>
      </div>

      <span className="title-page__handed" aria-hidden="true">
        <svg viewBox="0 0 320 12" preserveAspectRatio="none">
          <path
            className="title-page__handed-stroke"
            d="M2 6c14-5 28 4 42-1s28-5 42-1 28 4 42-2 28-5 42-1 28 4 42-2 28-5 42-1 28 4 42-1 14 0 14 0"
            fill="none"
            stroke="currentColor"
            strokeWidth=".7"
            strokeLinecap="round"
            pathLength="100"
            strokeDasharray="100 100"
          />
          <circle cx="316" cy="6" r="1.2" fill="currentColor" className="title-page__handed-bead" />
        </svg>
        <span className="title-page__handed-tag">read on · the question lands below</span>
      </span>
    </header>
  )
}