import { useId, type CSSProperties } from 'react'
import type { VoiceId } from './Press'
import type { WordId } from './notes'

type FolioOpeningProps = {
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
const VOICE_FACE: Record<VoiceId, string> = {
  quiet: 'serif · close set',
  human: 'italic · a little warm',
  bold: 'display · no apology',
}
const WORD_LABEL: Record<WordId, string> = { m3: 'm³', good: 'good at', yet: 'yet?' }
const WORD_MARK: Record<WordId, string> = { m3: 'stet', good: 'caret', yet: 'query' }
const WORD_GLYPH: Record<WordId, string> = { m3: '∧', good: '∧', yet: '⌇' }

export function FolioOpening({ voice, word, setToday }: FolioOpeningProps) {
  const baseId = useId().replace(/:/g, '')
  const grainId = `folio-opening-grain-${baseId}`
  const tone = VOICE_TONE[voice]
  const style = {
    '--opening-tone': tone,
    '--opening-grain': `url(#${grainId})`,
  } as CSSProperties
  return (
    <aside
      className={`folio-opening folio-opening--${voice} folio-opening--word-${word}`}
      aria-label={`Folio i · the opening plate · ${VOICE_NAME[voice]} · marked at ${WORD_LABEL[word]} · set today ${setToday}`}
      style={style}
    >
      <svg className="folio-opening__defs" viewBox="0 0 1000 60" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <filter id={grainId} x="-2%" y="-50%" width="104%" height="200%">
            <feTurbulence type="fractalNoise" baseFrequency="2.4" numOctaves="2" seed="61" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .4 0" />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
        </defs>
      </svg>

      <span className="folio-opening__crop folio-opening__crop--tl" aria-hidden="true" />
      <span className="folio-opening__crop folio-opening__crop--tr" aria-hidden="true" />
      <span className="folio-opening__crop folio-opening__crop--bl" aria-hidden="true" />
      <span className="folio-opening__crop folio-opening__crop--br" aria-hidden="true" />

      <span className="folio-opening__lead" aria-hidden="true">
        <span className="folio-opening__lead-rule folio-opening__lead-rule--a" />
        <span className="folio-opening__lead-tag">
          <span className="folio-opening__lead-glyph">※</span>
          <em>folio i·</em>
          <span className="folio-opening__lead-key">the opening plate</span>
        </span>
        <span className="folio-opening__lead-rule folio-opening__lead-rule--b" />
      </span>

      <span className="folio-opening__diamond" aria-hidden="true">
        <svg viewBox="0 0 64 24" preserveAspectRatio="xMidYMid meet">
          <g filter={`url(#${grainId})`} opacity=".95">
            <line x1="2" y1="12" x2="18" y2="12" stroke="currentColor" strokeWidth=".55" strokeLinecap="round" />
            <line x1="46" y1="12" x2="62" y2="12" stroke="currentColor" strokeWidth=".55" strokeLinecap="round" />
            <path d="M32 4 L40 12 L32 20 L24 12 Z" fill="none" stroke="currentColor" strokeWidth=".7" strokeLinejoin="round" />
            <circle cx="32" cy="12" r="1.4" fill="currentColor" />
          </g>
        </svg>
      </span>

      <div className="folio-opening__plate">
        <span className="folio-opening__cell folio-opening__cell--voice" aria-hidden="true">
          <span className="folio-opening__cell-key">set in</span>
          <span className="folio-opening__cell-row">
            <span className={`folio-opening__cell-letter folio-opening__cell-letter--${voice}`}>{VOICE_LETTER[voice]}</span>
            <em className="folio-opening__cell-value">{VOICE_NAME[voice]}</em>
          </span>
          <span className="folio-opening__cell-face">{VOICE_FACE[voice]}</span>
        </span>

        <span className="folio-opening__rule folio-opening__rule--v" aria-hidden="true">
          <svg viewBox="0 0 2 60" preserveAspectRatio="none">
            <line x1="1" y1="2" x2="1" y2="58" stroke="currentColor" strokeWidth=".4" strokeDasharray="1 2.4" opacity=".5" />
          </svg>
        </span>

        <span className="folio-opening__cell folio-opening__cell--word" aria-hidden="true">
          <span className="folio-opening__cell-key">marked at</span>
          <span className="folio-opening__cell-row">
            <span className="folio-opening__cell-glyph">{WORD_GLYPH[word]}</span>
            <em className="folio-opening__cell-value">{WORD_LABEL[word]}</em>
          </span>
          <span className="folio-opening__cell-face">
            <em>{WORD_MARK[word]}</em>
            <span aria-hidden="true">·</span>
            <span>{word === 'm3' ? 'let it stand' : word === 'good' ? 'make room' : 'protect the pause'}</span>
          </span>
        </span>

        <span className="folio-opening__rule folio-opening__rule--v" aria-hidden="true">
          <svg viewBox="0 0 2 60" preserveAspectRatio="none">
            <line x1="1" y1="2" x2="1" y2="58" stroke="currentColor" strokeWidth=".4" strokeDasharray="1 2.4" opacity=".5" />
          </svg>
        </span>

        <span className="folio-opening__cell folio-opening__cell--set" aria-hidden="true">
          <span className="folio-opening__cell-key">set today</span>
          <span className="folio-opening__cell-row">
            <em className="folio-opening__cell-value folio-opening__cell-value--date">{setToday}</em>
          </span>
          <span className="folio-opening__cell-face">
            <em>composed by hand</em>
            <span aria-hidden="true">·</span>
            <span>kept open</span>
          </span>
        </span>
      </div>

      <span className="folio-opening__trail" aria-hidden="true">
        <span className="folio-opening__trail-mark folio-opening__trail-mark--a" />
        <span className="folio-opening__trail-tag">
          <span className="folio-opening__trail-tag-glyph" aria-hidden="true">‡</span>
          a folio opens here · the question lands below
          <span className="folio-opening__trail-tag-glyph" aria-hidden="true">‡</span>
        </span>
        <span className="folio-opening__trail-mark folio-opening__trail-mark--b" />
      </span>
    </aside>
  )
}
