import { useEffect, useId, useState, type CSSProperties } from 'react'
import type { VoiceId } from './App'
import type { WordId } from './notes'

type FolioRuleProps = {
  word: WordId
  voice: VoiceId
  pullSignal: number
  setToday: string
}

const WORD_LABEL: Record<WordId, string> = { m3: 'm³', good: 'good at', yet: 'yet?' }
const WORD_GLYPH: Record<WordId, string> = { m3: '⌇', good: '∧', yet: '?' }
const WORD_NOTE: Record<WordId, string> = {
  m3: 'keep the fingerprint',
  good: 'choose one clear thing',
  yet: 'protect the pause',
}
const WORD_TONE: Record<WordId, VoiceId> = { m3: 'quiet', good: 'human', yet: 'bold' }

const ORDER: WordId[] = ['m3', 'good', 'yet']

export function FolioRule({ word, voice, pullSignal, setToday }: FolioRuleProps) {
  const baseId = useId().replace(/:/g, '')
  const gradId = `fr-grad-${baseId}`
  const [reducedMotion, setReducedMotion] = useState(false)
  const [stampKey, setStampKey] = useState(0)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mq.matches)
    const onChange = () => setReducedMotion(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    setStampKey(k => k + 1)
  }, [pullSignal, voice])

  const style = {
    '--fr-tone': `var(--${voice})`,
  } as CSSProperties

  return (
    <div
      className={`folio-rule folio-rule--${voice} folio-rule--word-${word} ${reducedMotion ? 'is-quiet' : ''}`}
      style={style}
      role="group"
      aria-label={`The folio's set rule · one sound below the question · now set at ${WORD_LABEL[word]}`}
    >
      <header className="folio-rule__head" aria-hidden="true">
        <span className="folio-rule__head-key">
          <span className="folio-rule__head-mark" />
          <em>folio i</em>
          <span className="folio-rule__head-dot" aria-hidden="true">·</span>
          <em>the question</em>
        </span>
        <span className="folio-rule__head-set">
          <span className="folio-rule__head-set-rule" />
          <em>set on</em>
          <span className="folio-rule__head-set-date">{setToday}</span>
          <span className="folio-rule__head-set-rule" />
        </span>
      </header>

      <div className="folio-rule__rail" aria-hidden="true">
        <svg
          className="folio-rule__rail-svg"
          viewBox="0 0 1200 14"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="var(--fr-tone)" stopOpacity="0" />
              <stop offset="14%" stopColor="var(--fr-tone)" stopOpacity=".32" />
              <stop offset="50%" stopColor="var(--fr-tone)" stopOpacity=".7" />
              <stop offset="86%" stopColor="var(--fr-tone)" stopOpacity=".32" />
              <stop offset="100%" stopColor="var(--fr-tone)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <line
            x1="0" y1="7" x2="1200" y2="7"
            stroke={`url(#${gradId})`}
            strokeWidth=".8"
            strokeLinecap="round"
          />
          <line
            x1="0" y1="7" x2="1200" y2="7"
            stroke="rgba(245, 238, 216, .14)"
            strokeWidth=".4"
            strokeDasharray="1.2 3"
          />
          <line
            key={`pulse-${stampKey}`}
            className="folio-rule__pulse"
            x1="0" y1="7" x2="1200" y2="7"
            stroke="var(--fr-tone)"
            strokeWidth="1.2"
            strokeLinecap="round"
            opacity=".55"
          />
        </svg>
      </div>

      <ol className="folio-rule__sorts">
        {ORDER.map((id, idx) => {
          const isMarked = id === word
          const tone = WORD_TONE[id]
          const cellStyle = {
            '--fr-cell-tone': `var(--${tone})`,
            '--fr-cell-delay': `${idx * 90}ms`,
          } as CSSProperties
          return (
            <li
              key={id}
              className={`fr-sort fr-sort--${id} ${isMarked ? 'is-marked' : ''}`}
              style={cellStyle}
              aria-current={isMarked ? 'true' : undefined}
            >
              <span className="fr-sort__cap" aria-hidden="true">
                <span className="fr-sort__cap-rule" />
                <em className="fr-sort__cap-num">{String(idx + 1).padStart(2, '0')}</em>
                <span className="fr-sort__cap-rule fr-sort__cap-rule--r" />
              </span>
              <span className="fr-sort__piece" aria-hidden="true">
                <span className="fr-sort__piece-rule fr-sort__piece-rule--top" />
                <span className="fr-sort__piece-rule fr-sort__piece-rule--bot" />
                <span className="fr-sort__piece-glyph">{WORD_GLYPH[id]}</span>
                <span className="fr-sort__piece-word">{WORD_LABEL[id]}</span>
                <span className="fr-sort__piece-edge fr-sort__piece-edge--l" aria-hidden="true" />
                <span className="fr-sort__piece-edge fr-sort__piece-edge--r" aria-hidden="true" />
              </span>
              <span className="fr-sort__note" aria-hidden="true">
                <em>{WORD_NOTE[id]}</em>
              </span>
              {isMarked && <span className="fr-sort__aura" aria-hidden="true" key={`aura-${stampKey}`} />}
            </li>
          )
        })}
      </ol>
    </div>
  )
}