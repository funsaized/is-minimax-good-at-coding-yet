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

const WORD_LABEL: Record<WordId, string> = { m3: 'M3', good: 'good at', yet: 'yet?' }
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
      aria-label={`Title page caption · folio i · the question · ${season} · set today ${setToday} · in the ${VOICE_NAME[voice]} voice · marked at ${WORD_LABEL[word]} (${WORD_MARK[word]}).`}
    >
      <svg className="title-page__defs" viewBox="0 0 1200 4" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id={ruleId} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
            <stop offset="14%" stopColor="currentColor" stopOpacity=".42" />
            <stop offset="50%" stopColor="currentColor" stopOpacity=".72" />
            <stop offset="86%" stopColor="currentColor" stopOpacity=".42" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      <p className="title-page__line">
        <span className="title-page__line-cell title-page__line-cell--key">
          <span className="title-page__line-mark" aria-hidden="true" />
          <em>the question</em>
        </span>
        <span className="title-page__line-sep" aria-hidden="true">·</span>
        <span className="title-page__line-cell title-page__line-cell--folio">
          folio <em>i</em>
        </span>
        <span className="title-page__line-sep" aria-hidden="true">·</span>
        <span className="title-page__line-cell title-page__line-cell--season">
          {season}
        </span>
        <span className="title-page__line-rule" aria-hidden="true">
          <svg viewBox="0 0 1200 2" preserveAspectRatio="none">
            <path d="M2 1c80-1 160 1 240 0s160-1 240 0 160 1 240 0 160-1 240 0 160 1 236 0" fill="none" stroke={`url(#${ruleId})`} strokeWidth=".55" strokeLinecap="round" />
          </svg>
        </span>
        <span className="title-page__line-sep" aria-hidden="true">·</span>
        <span className="title-page__line-cell title-page__line-cell--set">
          set today <em>{setToday}</em>
        </span>
        <span className="title-page__line-sep" aria-hidden="true">·</span>
        <span className="title-page__line-cell title-page__line-cell--voice">
          <span className="title-page__line-voice-glyph" aria-hidden="true" />
          <em>{VOICE_NAME[voice]}</em>
          <span className="title-page__line-face">{VOICE_FACE[voice]}</span>
        </span>
      </p>
    </header>
  )
}