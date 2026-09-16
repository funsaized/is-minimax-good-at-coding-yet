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

const WORD_LABEL: Record<WordId, string> = { m3: 'm³', good: 'good at', yet: 'yet?' }
const WORD_MARK: Record<WordId, string> = { m3: 'stet', good: 'caret', yet: 'query' }

const FOLIO_INDEX: Record<string, string> = {
  question: 'i',
  press: 'ii',
  contents: 'iii',
  day: 'iii·',
  note: 'iv',
  'reader-plate': 'v',
  proof: 'vi',
  pressings: 'vii',
  catch: 'vii·',
  notes: 'viii',
  answer: 'viii·',
}

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
  const folioIndex = FOLIO_INDEX[activeSection] ?? 'i'
  const sectionKeys = Object.keys(FOLIO_HINT)
  const activeIndex = Math.max(0, sectionKeys.indexOf(activeSection))

  return (
    <aside
      className={`spread-ribbon spread-ribbon--${voice} spread-ribbon--word-${word}`}
      style={style}
      aria-label={`m³ press · broadside identifier · set in ${VOICE_NAME[voice]}, marked at ${WORD_LABEL[word]}, on ${setToday}, now reading folio ${folioIndex}: ${folioHint}`}
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

      <span className="spread-ribbon__crop spread-ribbon__crop--tl" aria-hidden="true" />
      <span className="spread-ribbon__crop spread-ribbon__crop--tr" aria-hidden="true" />
      <span className="spread-ribbon__crop spread-ribbon__crop--bl" aria-hidden="true" />
      <span className="spread-ribbon__crop spread-ribbon__crop--br" aria-hidden="true" />

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

      <div className="spread-ribbon__plate">
        <span className="spread-ribbon__tag" aria-hidden="true">
          <span className="spread-ribbon__tag-mark">※</span>
          <span className="spread-ribbon__tag-eyebrow">m³ press</span>
          <span className="spread-ribbon__tag-sep" aria-hidden="true">·</span>
          <em className="spread-ribbon__tag-line">an open folio, set in three voices</em>
          <span className="spread-ribbon__tag-mark spread-ribbon__tag-mark--alt">※</span>
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

        <span className="spread-ribbon__verse" aria-hidden="true">
          <svg viewBox="0 0 800 14" preserveAspectRatio="none">
            <path
              className="spread-ribbon__verse-stroke"
              d="M2 7c20-4 40 4 60 0s40-4 60 0 40 4 60 0 40-4 60 0 40 4 60 0 40-4 60 0 40 4 60 0 40-4 60 0 40 4 60 0 40-4 60 0 60 4 80 0"
              fill="none"
              stroke="currentColor"
              strokeWidth=".7"
              strokeLinecap="round"
              pathLength="100"
              opacity=".5"
            />
          </svg>
          <em className="spread-ribbon__verse-text">
            set on {setToday} <span aria-hidden="true">·</span> marked at <span className="spread-ribbon__verse-mark">{WORD_MARK[word]}</span> {WORD_LABEL[word]} <span aria-hidden="true">·</span> set in {VOICE_NAME[voice]}
          </em>
        </span>

        <div className="spread-ribbon__trace" aria-label="The reading trace — where the reader is in the broadside">
          <span className="spread-ribbon__trace-eyebrow">
            <span className="spread-ribbon__trace-eyebrow-mark" />
            <em>the reading trace</em>
            <span className="spread-ribbon__trace-eyebrow-folio">folio <span className="spread-ribbon__trace-eyebrow-num">{folioIndex}</span></span>
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
      </div>

      <span className="spread-ribbon__trail" aria-hidden="true">
        <span className="spread-ribbon__trail-tag">
          <span className="spread-ribbon__trail-tag-mark" />
          <em>read on</em>
          <span className="spread-ribbon__trail-tag-rule" />
        </span>
        <svg viewBox="0 0 60 30" preserveAspectRatio="none">
          <path
            className="spread-ribbon__trail-stroke"
            d="M30 2 C 30 12, 22 18, 30 24 S 30 28, 30 30"
            fill="none"
            stroke="currentColor"
            strokeWidth=".9"
            strokeLinecap="round"
            pathLength="100"
          />
          <circle className="spread-ribbon__trail-bead" cx="30" cy="30" r="1.6" fill="currentColor" />
        </svg>
      </span>
    </aside>
  )
}