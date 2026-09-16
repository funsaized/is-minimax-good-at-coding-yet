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

const VOICE_FACE: Record<VoiceId, string> = {
  quiet: 'serif · italic · close set',
  human: 'serif · italic · a little warm',
  bold: 'sans · heavy · no apology',
}

const VOICE_GLYPH: Record<VoiceId, string> = { quiet: '·', human: '✦', bold: '■' }

const WORD_LABEL: Record<WordId, string> = { m3: 'm³', good: 'good at', yet: 'yet?' }
const WORD_MARK: Record<WordId, string> = { m3: 'stet', good: 'caret', yet: 'query' }

function formatSeason(): string {
  const month = new Date().getMonth()
  if (month <= 1 || month === 11) return 'winter'
  if (month <= 4) return 'spring'
  if (month <= 7) return 'summer'
  return 'autumn'
}

export function TitlePage({ voice, word, setToday }: TitlePageProps) {
  const baseId = useId().replace(/:/g, '')
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
      aria-label={`Title page header · m³ press · folio i · the question · set today ${setToday} · in the ${VOICE_NAME[voice]} voice · marked at ${WORD_LABEL[word]} (${WORD_MARK[word]}).`}
    >
      <svg className="title-page__defs" viewBox="0 0 1200 24" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id={ruleId} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
            <stop offset="14%" stopColor="currentColor" stopOpacity=".55" />
            <stop offset="50%" stopColor="currentColor" stopOpacity=".95" />
            <stop offset="86%" stopColor="currentColor" stopOpacity=".55" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      <span className="title-page__rule" aria-hidden="true">
        <svg viewBox="0 0 1200 4" preserveAspectRatio="none">
          <path
            className="title-page__rule-stroke"
            d="M2 2c40-1 80 1 120 0s80-1 120 0 80 1 120 0 80-1 120 0 80 1 120 0 80-1 120 0 80 1 120 0 80-1 158 0"
            fill="none"
            stroke={`url(#${ruleId})`}
            strokeWidth=".7"
            strokeLinecap="round"
            pathLength="100"
          />
        </svg>
      </span>

      <div className="title-page__row">
        <span className="title-page__cell title-page__cell--press">
          <span className="title-page__cell-key">m³ press</span>
          <span className="title-page__cell-value">
            <em>folio i</em>
            <span className="title-page__cell-sep" aria-hidden="true">·</span>
            <span>the question</span>
          </span>
        </span>

        <span className="title-page__fleuron" aria-hidden="true">
          <svg viewBox="0 0 88 16" preserveAspectRatio="xMidYMid meet">
            <line x1="2" y1="8" x2="28" y2="8" stroke="currentColor" strokeWidth=".55" strokeLinecap="round" opacity=".7" />
            <circle cx="32" cy="8" r="1.4" fill="currentColor" />
            <path d="M44 2 L50 8 L44 14 L38 8 Z" fill="none" stroke="currentColor" strokeWidth=".7" strokeLinejoin="round" />
            <line x1="44" y1="5" x2="44" y2="11" stroke="currentColor" strokeWidth=".5" strokeLinecap="round" opacity=".7" />
            <circle cx="44" cy="8" r="1.1" fill="currentColor" />
            <circle cx="56" cy="8" r="1.4" fill="currentColor" />
            <line x1="60" y1="8" x2="86" y2="8" stroke="currentColor" strokeWidth=".55" strokeLinecap="round" opacity=".7" />
          </svg>
          <span className="title-page__fleuron-tag" aria-hidden="true">
            <em>{season}</em>
            <span className="title-page__fleuron-tag-sep" aria-hidden="true">·</span>
            <span>{setToday}</span>
          </span>
        </span>

        <span className="title-page__cell title-page__cell--voice">
          <span className="title-page__cell-key">now in</span>
          <span className="title-page__cell-value title-page__cell-voice">
            <span className="title-page__cell-voice-glyph" aria-hidden="true" />
            <em>{VOICE_NAME[voice]}</em>
          </span>
          <span className="title-page__cell-face">{VOICE_FACE[voice]}</span>
        </span>
      </div>

      <span className="title-page__rule title-page__rule--foot" aria-hidden="true">
        <svg viewBox="0 0 1200 4" preserveAspectRatio="none">
          <path
            className="title-page__rule-stroke title-page__rule-stroke--foot"
            d="M2 2c40-1 80 1 120 0s80-1 120 0 80 1 120 0 80-1 120 0 80 1 120 0 80-1 120 0 80 1 120 0 80-1 158 0"
            fill="none"
            stroke={`url(#${ruleId})`}
            strokeWidth=".7"
            strokeLinecap="round"
            pathLength="100"
          />
        </svg>
      </span>
    </header>
  )
}