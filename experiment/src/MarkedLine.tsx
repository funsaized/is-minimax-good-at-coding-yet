import { useEffect, useId, useRef, useState, type CSSProperties } from 'react'
import type { VoiceId } from './App'
import type { WordId } from './notes'

type MarkedLineProps = {
  word: WordId
  voice: VoiceId
  pullSignal: number
  setToday: string
}

const WORD_LABEL: Record<WordId, string> = { m3: 'm³', good: 'good at', yet: 'yet?' }
const WORD_GLYPH: Record<WordId, string> = { m3: '⌇', good: '∧', yet: '?' }
const WORD_TONE: Record<WordId, VoiceId> = { m3: 'quiet', good: 'human', yet: 'bold' }
const WORD_NOTE: Record<WordId, string> = {
  m3: 'keep the fingerprint',
  good: 'choose one clear thing',
  yet: 'protect the pause',
}

const ORDER: WordId[] = ['m3', 'good', 'yet']

export function MarkedLine({ word, voice, pullSignal, setToday }: MarkedLineProps) {
  const baseId = useId().replace(/:/g, '')
  const gradId = `ml-grad-${baseId}`
  const [reducedMotion, setReducedMotion] = useState(false)
  const lastPull = useRef(pullSignal)
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
    if (lastPull.current === pullSignal) return
    lastPull.current = pullSignal
    setStampKey(k => k + 1)
  }, [pullSignal])

  const style = {
    '--ml-tone': `var(--${voice})`,
    '--ml-stamp': stampKey.toString(),
  } as CSSProperties

  return (
    <div
      className={`marked-line marked-line--${voice} marked-line--word-${word} ${reducedMotion ? 'is-quiet' : ''}`}
      style={style}
      role="group"
      aria-label={`The marked line · three sorts set on the page · now set at ${WORD_LABEL[word]}`}
    >
      <svg
        className="marked-line__svg"
        viewBox="0 0 1200 56"
        preserveAspectRatio="none"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--ml-tone)" stopOpacity="0" />
            <stop offset="6%" stopColor="var(--ml-tone)" stopOpacity=".32" />
            <stop offset="22%" stopColor="var(--ml-tone)" stopOpacity=".6" />
            <stop offset="50%" stopColor="var(--ml-tone)" stopOpacity=".78" />
            <stop offset="78%" stopColor="var(--ml-tone)" stopOpacity=".6" />
            <stop offset="94%" stopColor="var(--ml-tone)" stopOpacity=".32" />
            <stop offset="100%" stopColor="var(--ml-tone)" stopOpacity="0" />
          </linearGradient>
          <linearGradient id={`${gradId}-pulse`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--ml-tone)" stopOpacity="0" />
            <stop offset="50%" stopColor="var(--ml-tone)" stopOpacity=".9" />
            <stop offset="100%" stopColor="var(--ml-tone)" stopOpacity="0" />
          </linearGradient>
        </defs>

        <line
          x1="6"
          y1="28"
          x2="1194"
          y2="28"
          stroke={`url(#${gradId})`}
          strokeWidth=".7"
          strokeLinecap="round"
        />

        <line
          x1="6"
          y1="28"
          x2="1194"
          y2="28"
          stroke="rgba(245, 238, 216, .1)"
          strokeWidth=".35"
          strokeDasharray="1.4 3.2"
        />

        <line
          key={`pulse-${stampKey}`}
          className="marked-line__pulse"
          x1="0"
          y1="28"
          x2="1200"
          y2="28"
          stroke={`url(#${gradId}-pulse)`}
          strokeWidth="1.4"
          strokeLinecap="round"
        />

        {/* hand-drawn tick marks at intervals */}
        <g className="marked-line__ticks" stroke="rgba(245, 238, 216, .22)" strokeLinecap="round">
          {Array.from({ length: 47 }, (_, i) => {
            const x = 12 + (i / 46) * 1176
            const isMajor = i % 12 === 0
            return (
              <line
                key={`tick-${i}`}
                x1={x}
                y1={isMajor ? 24 : 26}
                x2={x}
                y2={isMajor ? 32 : 30}
                strokeWidth={isMajor ? '.5' : '.3'}
                opacity={isMajor ? '.5' : '.25'}
              />
            )
          })}
        </g>

        {/* three sort anchors — small marks where the line meets each word position */}
        <g className="marked-line__anchors" aria-hidden="true">
          <circle cx="200" cy="28" r="2" fill="currentColor" opacity=".75" />
          <circle cx="600" cy="28" r="2" fill="currentColor" opacity=".75" />
          <circle cx="1000" cy="28" r="2" fill="currentColor" opacity=".75" />
          <circle cx="200" cy="28" r="5" fill="none" stroke="currentColor" strokeWidth=".35" opacity=".35" />
          <circle cx="600" cy="28" r="5" fill="none" stroke="currentColor" strokeWidth=".35" opacity=".35" />
          <circle cx="1000" cy="28" r="5" fill="none" stroke="currentColor" strokeWidth=".35" opacity=".35" />
        </g>
      </svg>

      <ol className="marked-line__sorts">
        {ORDER.map((id, idx) => {
          const isMarked = id === word
          const tone = WORD_TONE[id]
          const cellStyle = {
            '--ml-cell-tone': `var(--${tone})`,
            '--ml-cell-delay': `${idx * 90}ms`,
          } as CSSProperties
          return (
            <li
              key={id}
              className={`ml-sort ml-sort--${id} ${isMarked ? 'is-marked' : ''}`}
              style={cellStyle}
              aria-current={isMarked ? 'true' : undefined}
            >
              <span className="ml-sort__cap" aria-hidden="true">
                <span className="ml-sort__cap-rule" />
                <em className="ml-sort__cap-num">{String(idx + 1).padStart(2, '0')}</em>
                <span className="ml-sort__cap-rule ml-sort__cap-rule--r" />
              </span>
              <span className="ml-sort__piece" aria-hidden="true">
                <span className="ml-sort__piece-rule ml-sort__piece-rule--top" />
                <span className="ml-sort__piece-rule ml-sort__piece-rule--bot" />
                <span className="ml-sort__piece-glyph">{WORD_GLYPH[id]}</span>
                <span className="ml-sort__piece-word">{WORD_LABEL[id]}</span>
                <span className="ml-sort__piece-edge ml-sort__piece-edge--l" aria-hidden="true" />
                <span className="ml-sort__piece-edge ml-sort__piece-edge--r" aria-hidden="true" />
              </span>
              <span className="ml-sort__note" aria-hidden="true">
                <em>{WORD_NOTE[id]}</em>
              </span>
              {isMarked && <span className="ml-sort__aura" aria-hidden="true" key={`aura-${stampKey}`} />}
            </li>
          )
        })}
      </ol>

      <span className="marked-line__legend" aria-hidden="true">
        <span className="marked-line__legend-rule" />
        <em className="marked-line__legend-key">set today</em>
        <span className="marked-line__legend-date">{setToday}</span>
        <span className="marked-line__legend-rule" />
        <em className="marked-line__legend-tail">the marked line · three sorts on one chase</em>
      </span>
    </div>
  )
}
