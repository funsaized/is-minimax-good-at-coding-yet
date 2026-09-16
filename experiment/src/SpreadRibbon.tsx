import { useId, type CSSProperties } from 'react'
import type { VoiceId } from './Press'
import type { WordId } from './notes'

type SpreadRibbonProps = {
  voice: VoiceId
  word: WordId
  setToday: string
  activeSection: string
  totalSections: number
}

const VOICE_NAME: Record<VoiceId, string> = {
  quiet: 'quiet cut',
  human: 'human hand',
  bold: 'bold signal',
}

const VOICE_LETTER: Record<VoiceId, string> = { quiet: 'A', human: 'B', bold: 'C' }

const WORD_LABEL: Record<WordId, string> = { m3: 'm³', good: 'good at', yet: 'yet?' }
const WORD_MARK: Record<WordId, string> = { m3: 'stet', good: 'caret', yet: 'query' }

const FOLIO_HINT: Record<string, string> = {
  question: 'the question',
  press: 'the press bed',
  contents: 'the contents',
  day: 'the day sheet',
  note: 'a folded slip',
  'reader-plate': 'the bookplate',
  proof: 'the proof',
  pressings: 'the pressings',
  catch: 'the signature',
  notes: 'the marginalia',
  answer: 'the answer',
}

export function SpreadRibbon({ voice, word, setToday, activeSection, totalSections }: SpreadRibbonProps) {
  const baseId = useId().replace(/:/g, '')
  const grainId = `spread-ribbon-grain-${baseId}`
  const ruleId = `spread-ribbon-rule-${baseId}`
  const tone = `var(--${voice === 'quiet' ? 'blue' : voice === 'human' ? 'coral' : 'acid'})`
  const style = {
    '--ribbon-tone': tone,
    '--ribbon-grain': `url(#${grainId})`,
    '--ribbon-rule': `url(#${ruleId})`,
  } as CSSProperties

  const folioHint = FOLIO_HINT[activeSection] ?? 'the question'
  const sectionKeys = Object.keys(FOLIO_HINT)
  const activeIndex = Math.max(0, sectionKeys.indexOf(activeSection))

  return (
    <aside
      className={`spread-ribbon spread-ribbon--${voice} spread-ribbon--word-${word}`}
      style={style}
      aria-label={`m³ press · broadside identifier · set in ${VOICE_NAME[voice]}, marked at ${WORD_LABEL[word]}, on ${setToday}, now reading: ${folioHint}.`}
    >
      <svg className="spread-ribbon__defs" viewBox="0 0 1200 80" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <filter id={grainId} x="-2%" y="-50%" width="104%" height="200%">
            <feTurbulence type="fractalNoise" baseFrequency="2.2" numOctaves="2" seed="73" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .38 0" />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
          <linearGradient id={ruleId} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
            <stop offset="6%" stopColor="currentColor" stopOpacity=".45" />
            <stop offset="50%" stopColor="currentColor" stopOpacity=".95" />
            <stop offset="94%" stopColor="currentColor" stopOpacity=".45" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      <span className="spread-ribbon__rule" aria-hidden="true">
        <svg viewBox="0 0 1200 6" preserveAspectRatio="none">
          <g filter={`url(#${grainId})`} opacity=".85">
            <path
              d="M2 3c40-2 80 2 120 0s80-2 120 0 80 2 120 0 80-2 120 0 80 2 120 0 80-2 120 0 80 2 120 0 80-2 120 0 80 2 158 0"
              fill="none"
              stroke={`url(#${ruleId})`}
              strokeWidth=".85"
              strokeLinecap="round"
              pathLength="100"
              className="spread-ribbon__rule-stroke"
            />
          </g>
          <circle cx="2" cy="3" r="1.3" fill="currentColor" opacity=".7" className="spread-ribbon__rule-bead spread-ribbon__rule-bead--lead" />
          <circle cx="1198" cy="3" r="1.3" fill="currentColor" opacity=".7" className="spread-ribbon__rule-bead spread-ribbon__rule-bead--trail" />
        </svg>
      </span>

      <div className="spread-ribbon__row">
        <span className="spread-ribbon__cell spread-ribbon__cell--press">
          <span className="spread-ribbon__cell-mark" aria-hidden="true">‡</span>
          <span className="spread-ribbon__cell-stack">
            <span className="spread-ribbon__cell-key">m³ press</span>
            <em>an open folio</em>
          </span>
        </span>

        <span className="spread-ribbon__fleuron" aria-hidden="true">
          <svg viewBox="0 0 120 16" preserveAspectRatio="xMidYMid meet">
            <g filter={`url(#${grainId})`} opacity=".92">
              <line x1="2" y1="8" x2="38" y2="8" stroke="currentColor" strokeWidth=".55" strokeLinecap="round" />
              <circle cx="42" cy="8" r="1.4" fill="currentColor" />
              <path d="M60 2 L66 8 L60 14 L54 8 Z" fill="none" stroke="currentColor" strokeWidth=".7" strokeLinejoin="round" />
              <line x1="60" y1="5" x2="60" y2="11" stroke="currentColor" strokeWidth=".5" strokeLinecap="round" />
              <circle cx="60" cy="8" r="1.1" fill="currentColor" />
              <circle cx="78" cy="8" r="1.4" fill="currentColor" />
              <line x1="82" y1="8" x2="118" y2="8" stroke="currentColor" strokeWidth=".55" strokeLinecap="round" />
            </g>
          </svg>
        </span>

        <span className="spread-ribbon__cell spread-ribbon__cell--voice">
          <span className={`spread-ribbon__cell-letter spread-ribbon__cell-letter--${voice}`}>{VOICE_LETTER[voice]}</span>
          <span className="spread-ribbon__cell-stack">
            <span className="spread-ribbon__cell-key">set in</span>
            <em>{VOICE_NAME[voice]}</em>
          </span>
        </span>

        <span className="spread-ribbon__fleuron spread-ribbon__fleuron--alt" aria-hidden="true">
          <svg viewBox="0 0 120 16" preserveAspectRatio="xMidYMid meet">
            <g filter={`url(#${grainId})`} opacity=".92">
              <line x1="2" y1="8" x2="38" y2="8" stroke="currentColor" strokeWidth=".55" strokeLinecap="round" />
              <circle cx="42" cy="8" r="1.4" fill="currentColor" />
              <path d="M60 2 L66 8 L60 14 L54 8 Z" fill="none" stroke="currentColor" strokeWidth=".7" strokeLinejoin="round" />
              <line x1="60" y1="5" x2="60" y2="11" stroke="currentColor" strokeWidth=".5" strokeLinecap="round" />
              <circle cx="60" cy="8" r="1.1" fill="currentColor" />
              <circle cx="78" cy="8" r="1.4" fill="currentColor" />
              <line x1="82" y1="8" x2="118" y2="8" stroke="currentColor" strokeWidth=".55" strokeLinecap="round" />
            </g>
          </svg>
        </span>

        <span className="spread-ribbon__cell spread-ribbon__cell--word">
          <span className="spread-ribbon__cell-key">marked at</span>
          <span className="spread-ribbon__cell-stack">
            <em>{WORD_LABEL[word]}</em>
            <span className="spread-ribbon__cell-mark-tag">{WORD_MARK[word]}</span>
          </span>
        </span>

        <span className="spread-ribbon__fleuron" aria-hidden="true">
          <svg viewBox="0 0 120 16" preserveAspectRatio="xMidYMid meet">
            <g filter={`url(#${grainId})`} opacity=".92">
              <line x1="2" y1="8" x2="38" y2="8" stroke="currentColor" strokeWidth=".55" strokeLinecap="round" />
              <circle cx="42" cy="8" r="1.4" fill="currentColor" />
              <path d="M60 2 L66 8 L60 14 L54 8 Z" fill="none" stroke="currentColor" strokeWidth=".7" strokeLinejoin="round" />
              <line x1="60" y1="5" x2="60" y2="11" stroke="currentColor" strokeWidth=".5" strokeLinecap="round" />
              <circle cx="60" cy="8" r="1.1" fill="currentColor" />
              <circle cx="78" cy="8" r="1.4" fill="currentColor" />
              <line x1="82" y1="8" x2="118" y2="8" stroke="currentColor" strokeWidth=".55" strokeLinecap="round" />
            </g>
          </svg>
        </span>

        <span className="spread-ribbon__cell spread-ribbon__cell--date">
          <span className="spread-ribbon__cell-key">set today</span>
          <em>{setToday}</em>
        </span>

        <span className="spread-ribbon__cell spread-ribbon__cell--mark" aria-hidden="true">‡</span>
      </div>

      <div className="spread-ribbon__trace" aria-label="The reading trace — where the reader is in the broadside">
        <span className="spread-ribbon__trace-eyebrow">
          <span className="spread-ribbon__trace-eyebrow-mark" />
          <em>the reading trace</em>
          <span className="spread-ribbon__trace-eyebrow-mark spread-ribbon__trace-eyebrow-mark--alt" />
        </span>

        <ol className="spread-ribbon__trace-track" role="list">
          {sectionKeys.slice(0, totalSections).map((key, index) => {
            const isCurrent = key === activeSection
            const isPassed = index < activeIndex
            return (
              <li
                key={`trace-${key}`}
                className={`spread-ribbon__trace-cell ${isPassed ? 'is-passed' : ''} ${isCurrent ? 'is-current' : ''}`}
                aria-current={isCurrent ? 'step' : undefined}
              >
                <span className="spread-ribbon__trace-bead" />
                <span className="spread-ribbon__trace-tick" />
                <span className="spread-ribbon__trace-label">{FOLIO_HINT[key]}</span>
              </li>
            )
          })}
        </ol>

        <span className="spread-ribbon__trace-now" aria-live="polite">
          <span className="spread-ribbon__trace-now-tag">now reading</span>
          <em className="spread-ribbon__trace-now-text">{folioHint}</em>
          <span className="spread-ribbon__trace-now-count">{activeIndex + 1}<span aria-hidden="true">/</span>{totalSections}</span>
        </span>
      </div>
    </aside>
  )
}
