import { useEffect, useRef, useState } from 'react'
import type { VoiceId } from './PressBay'
import type { WordId } from './notes'

export type ImpressionMark =
  | { kind: 'voice'; voice: VoiceId }
  | { kind: 'word'; word: WordId }
  | { kind: 'pull'; voice: VoiceId; from: VoiceId }

const MAX_MARKS = 18

type ImpressionRibbonProps = {
  voice: VoiceId
  word: WordId
  marks: ImpressionMark[]
  setToday: string
}

const VOICE_LETTER: Record<VoiceId, string> = { quiet: 'A', human: 'B', bold: 'C' }
const WORD_GLYPH: Record<WordId, string> = { m3: '⌇', good: '∧', yet: '?' }

export function ImpressionRibbon({ voice, word, marks, setToday }: ImpressionRibbonProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [pulse, setPulse] = useState(0)
  const [splashTick, setSplashTick] = useState(0)

  useEffect(() => {
    setPulse(value => value + 1)
    if (marks.length > 0) setSplashTick(value => value + 1)
  }, [marks.length])

  const visible = marks.slice(-MAX_MARKS)
  const last = visible[visible.length - 1]
  const pullCount = marks.reduce<Record<VoiceId, number>>((acc, mark) => {
    if (mark.kind === 'pull') {
      acc[mark.voice] = (acc[mark.voice] ?? 0) + 1
    }
    return acc
  }, { quiet: 0, human: 0, bold: 0 })
  const totalPulls = pullCount.quiet + pullCount.human + pullCount.bold

  return (
    <div className="impression-ribbon" role="group" aria-label="Press session impression log">
      <span className="impression-ribbon__tag" aria-hidden="true">
        <span className="impression-ribbon__tag-dot" />
        impression log
        <span className="impression-ribbon__tag-date">{setToday}</span>
      </span>
      <span className="impression-ribbon__tape" ref={ref}>
        <span className="impression-ribbon__line" aria-hidden="true" />
        <span className="impression-ribbon__line impression-ribbon__line--in" aria-hidden="true" />
        <span className="impression-ribbon__marks">
          {visible.map((mark, index) => {
            const ratio = visible.length <= 1 ? 1 : index / (visible.length - 1)
            const isLatest = index === visible.length - 1
            return (
              <MarkOnRibbon key={`${mark.kind}-${index}-${ratio.toFixed(3)}`} mark={mark} ratio={ratio} latest={isLatest} splashTick={isLatest ? splashTick : 0} />
            )
          })}
          <span
            key={`now-${pulse}`}
            className={`impression-ribbon__now impression-ribbon__now--${last?.kind ?? 'idle'}`}
            style={{ left: `${visible.length === 0 ? 0 : 100}%` }}
            aria-hidden="true"
          >
            <span className="impression-ribbon__now-bead" />
          </span>
        </span>
      </span>
      <span className="impression-ribbon__now-label" aria-live="polite">
        <span className="impression-ribbon__now-label-tag">now</span>
        <span className="impression-ribbon__now-label-text">
          {last
            ? last.kind === 'voice'
              ? `voice → ${VOICE_LETTER[last.voice]}`
              : last.kind === 'pull'
              ? `pull → ${VOICE_LETTER[last.voice]}`
              : `mark → ${WORD_GLYPH[last.word]}`
            : 'awaiting the first pull'}
        </span>
        <span className="impression-ribbon__now-label-meta">
          {voice === 'quiet' ? 'A' : voice === 'human' ? 'B' : 'C'} · {word === 'm3' ? 'm³' : word === 'good' ? 'good at' : 'yet?'} · {totalPulls} {totalPulls === 1 ? 'pull' : 'pulls'} this session
        </span>
      </span>
    </div>
  )
}

function MarkOnRibbon({ mark, ratio, latest, splashTick }: { mark: ImpressionMark; ratio: number; latest: boolean; splashTick: number }) {
  if (mark.kind === 'pull') {
    return (
      <span
        className={`impression-ribbon__mark impression-ribbon__mark--pull impression-ribbon__mark--voice-${mark.voice}`}
        style={{ left: `${ratio * 100}%` }}
        aria-hidden="true"
      >
        {latest && splashTick > 0 && (
          <span key={`splash-${splashTick}`} className="impression-ribbon__mark-splash" aria-hidden="true" />
        )}
        <span className="impression-ribbon__mark-pull" />
        <span className="impression-ribbon__mark-pull-glow" />
      </span>
    )
  }
  if (mark.kind === 'voice') {
    return (
      <span
        className={`impression-ribbon__mark impression-ribbon__mark--voice impression-ribbon__mark--voice-${mark.voice}`}
        style={{ left: `${ratio * 100}%` }}
        aria-hidden="true"
      >
        {latest && splashTick > 0 && (
          <span key={`splash-${splashTick}`} className="impression-ribbon__mark-splash" aria-hidden="true" />
        )}
        <span className="impression-ribbon__mark-voice-dot" />
        <span className="impression-ribbon__mark-voice-letter">{VOICE_LETTER[mark.voice]}</span>
      </span>
    )
  }
  return (
    <span
      className={`impression-ribbon__mark impression-ribbon__mark--word impression-ribbon__mark--word-${mark.word}`}
      style={{ left: `${ratio * 100}%` }}
      aria-hidden="true"
    >
      {latest && splashTick > 0 && (
        <span key={`splash-${splashTick}`} className="impression-ribbon__mark-splash" aria-hidden="true" />
      )}
      <span className="impression-ribbon__mark-word-glyph">{WORD_GLYPH[mark.word]}</span>
    </span>
  )
}
