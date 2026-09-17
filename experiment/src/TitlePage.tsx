import { useId, type CSSProperties } from 'react'
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

const VOICE_GLYPH: Record<VoiceId, string> = { quiet: '·', human: '✦', bold: '■' }
const VOICE_LETTER: Record<VoiceId, string> = { quiet: 'A', human: 'B', bold: 'C' }
const VOICE_FACE: Record<VoiceId, string> = {
  quiet: 'italic · close set',
  human: 'italic · a little warm',
  bold: 'display · no apology',
}

const WORD_LABEL: Record<WordId, string> = { m3: 'M3', good: 'good at', yet: 'yet?' }
const WORD_MARK: Record<WordId, string> = { m3: 'stet', good: 'caret', yet: 'query' }
const WORD_KIND: Record<WordId, string> = { m3: 'let it stand', good: 'make room', yet: 'protect the pause' }

const OPERATOR_NOTE: Record<VoiceId, string> = {
  quiet: 'set in close-set italic, then read aloud once',
  human: 'set in a hand that learned its warmth',
  bold: 'set without apology, then read it like a poster',
}

const OPERATOR_TAG: Record<VoiceId, string> = {
  quiet: 'a quiet setting',
  human: 'a hand-set line',
  bold: 'a full-voice setting',
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
  const sealGrainId = `title-page-seal-grain-${baseId}`
  const ruleId = `title-page-rule-${baseId}`
  const style = {
    '--title-page-tone': VOICE_TONE[voice],
    '--title-page-glyph': `"${VOICE_GLYPH[voice]}"`,
  } as CSSProperties
  const season = formatSeason()

  return (
    <header
      className={`title-page title-page--${voice} title-page--word-${word}`}
      style={style}
      aria-label={`Title page masthead · folio i · the question · ${season} · set today ${setToday} · in the ${VOICE_NAME[voice]} voice · marked at ${WORD_LABEL[word]} (${WORD_MARK[word]}).`}
    >
      <svg className="title-page__defs" viewBox="0 0 1200 240" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id={ruleId} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
            <stop offset="14%" stopColor="currentColor" stopOpacity=".4" />
            <stop offset="50%" stopColor="currentColor" stopOpacity=".78" />
            <stop offset="86%" stopColor="currentColor" stopOpacity=".4" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
          <filter id={sealGrainId} x="-12%" y="-12%" width="124%" height="124%">
            <feTurbulence type="fractalNoise" baseFrequency="2.6" numOctaves="2" seed="73" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .5 0" />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
        </defs>
      </svg>

      <p className="title-page__eyebrow" aria-hidden="true">
        <span className="title-page__eyebrow-mark" />
        <span className="title-page__eyebrow-cell title-page__eyebrow-cell--key">
          <em>the title page</em>
        </span>
        <span className="title-page__eyebrow-sep" aria-hidden="true">·</span>
        <span className="title-page__eyebrow-cell title-page__eyebrow-cell--folio">
          folio <em>i</em>
        </span>
        <span className="title-page__eyebrow-sep" aria-hidden="true">·</span>
        <span className="title-page__eyebrow-cell title-page__eyebrow-cell--season">
          {season}
        </span>
        <span className="title-page__eyebrow-rule" aria-hidden="true">
          <svg viewBox="0 0 320 6" preserveAspectRatio="none">
            <path d="M2 3c30-3 60 3 90 0s60-3 90 0 60 3 90 0 60-3 36 0" fill="none" stroke={`url(#${ruleId})`} strokeWidth=".65" strokeLinecap="round" />
          </svg>
        </span>
        <span className="title-page__eyebrow-cell title-page__eyebrow-cell--marked">
          marked <em>{WORD_LABEL[word]}</em>
          <span className="title-page__eyebrow-mark-tag" aria-hidden="true">{WORD_MARK[word]}</span>
        </span>
      </p>

      <div className="title-page__plate" aria-hidden="true">
        <span className="title-page__plate-cornermark title-page__plate-cornermark--tl" />
        <span className="title-page__plate-cornermark title-page__plate-cornermark--tr" />
        <span className="title-page__plate-cornermark title-page__plate-cornermark--bl" />
        <span className="title-page__plate-cornermark title-page__plate-cornermark--br" />

        <span className="title-page__plate-cell title-page__plate-cell--left">
          <span className="title-page__plate-key">set today</span>
          <span className="title-page__plate-value title-page__plate-value--date">{setToday}</span>
          <span className="title-page__plate-sub">{season} · folio i</span>
        </span>

        <span className="title-page__plate-medallion" aria-hidden="true">
          <span className="title-page__plate-medallion-ring" />
          <svg viewBox="0 0 64 64" className="title-page__plate-medallion-disc">
            <g filter={`url(#${sealGrainId})`} opacity=".96">
              <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeWidth=".85" />
              <circle cx="32" cy="32" r="22" fill="none" stroke="currentColor" strokeWidth=".32" strokeDasharray=".7 1.4" opacity=".7" />
              <circle cx="32" cy="32" r="14" fill="none" stroke="currentColor" strokeWidth=".32" opacity=".55" />
              <path
                d="M32 6 L32 12 M32 52 L32 58 M6 32 L12 32 M52 32 L58 32 M11 11 L15 15 M49 49 L53 53 M11 53 L15 49 M49 15 L53 11"
                stroke="currentColor"
                strokeWidth=".45"
                strokeLinecap="round"
                opacity=".75"
              />
              <text
                x="32"
                y="38"
                textAnchor="middle"
                fontFamily="'Iowan Old Style', Georgia, serif"
                fontStyle="italic"
                fontSize="22"
                letterSpacing=".02em"
                fill="currentColor"
              >m³</text>
            </g>
          </svg>
          <span className="title-page__plate-medallion-letter">{VOICE_LETTER[voice]}</span>
        </span>

        <span className="title-page__plate-cell title-page__plate-cell--right">
          <span className="title-page__plate-key">setting in</span>
          <span className="title-page__plate-value title-page__plate-value--voice">{VOICE_NAME[voice]}</span>
          <span className="title-page__plate-sub">{VOICE_FACE[voice]}</span>
        </span>
      </div>

      <span className="title-page__kind" aria-hidden="true">
        <span className="title-page__kind-mark" />
        <em>{WORD_KIND[word]}</em>
        <span className="title-page__kind-mark title-page__kind-mark--alt" />
        <span className="title-page__kind-mark-tag" aria-hidden="true">{WORD_MARK[word]}</span>
      </span>

      <p className="title-page__note" aria-hidden="true">
        <span className="title-page__note-tag">{OPERATOR_TAG[voice]}</span>
        <span className="title-page__note-body">
          <em>{OPERATOR_NOTE[voice]}</em>
          <span className="title-page__note-pencil" aria-hidden="true">
            <svg viewBox="0 0 240 8" preserveAspectRatio="none">
              <path
                className="title-page__note-pencil-stroke"
                d="M2 5c18-5 36 4 54-1s36-5 54-1 36 4 54-1 36-5 54-1 16-2 16-2"
                fill="none"
                stroke="currentColor"
                strokeWidth=".55"
                strokeLinecap="round"
                pathLength="100"
              />
              <circle className="title-page__note-pencil-bead" cx="238" cy="4" r="1" fill="currentColor" />
            </svg>
          </span>
        </span>
      </p>
    </header>
  )
}
