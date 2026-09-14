import { type CSSProperties } from 'react'
import type { VoiceId } from './PressBay'

export type MarginFolio = {
  id: string
  index: string
  label: string
  hint: string
  voice?: VoiceId
}

const MARGIN_FOLIOS: MarginFolio[] = [
  { id: 'question', index: 'i', label: 'the question', hint: 'a folio of one line, set three ways', voice: 'human' },
  { id: 'press-room', index: 'i·', label: 'the press bay', hint: 'a lever, three voices, one pull' },
  { id: 'compose', index: 'ii', label: 'the compose floor', hint: 'the line held in pieces' },
  { id: 'contents', index: 'iii', label: 'this page, listed', hint: 'the press log · folio contents' },
  { id: 'day', index: 'iii·', label: 'the day sheet', hint: 'the hour, the week, the day’s record' },
  { id: 'note', index: '·', label: 'a folded slip', hint: 'a short letter to the reader' },
  { id: 'proof', index: 'iv', label: 'the second proof', hint: 'marks on the words worth keeping' },
  { id: 'pressings', index: 'v', label: 'three pressings', hint: 'the question set three ways' },
  { id: 'notes', index: 'vi', label: 'the marginalia', hint: 'three things worth keeping' },
  { id: 'answer', index: 'viii', label: 'the answer', hint: 'folded once, then folded back' },
]

type MarginThreadProps = {
  activeId: string
  progress: number
  voice: VoiceId
}

export function MarginThread({ activeId, progress, voice }: MarginThreadProps) {
  const activeIndex = Math.max(0, MARGIN_FOLIOS.findIndex(f => f.id === activeId))
  const voiceClass = `margin-thread margin-thread--${voice}`
  const style = { '--margin-progress': progress.toFixed(4) } as CSSProperties
  return (
    <nav className={voiceClass} aria-label="Folio margin thread" style={style}>
      <div className="margin-thread__stick" aria-hidden="true">
        <span className="margin-thread__stick-head">
          <span className="margin-thread__stick-head-dot" />
          <span className="margin-thread__stick-head-rule" />
          <span className="margin-thread__stick-head-tag">folio margin</span>
          <span className="margin-thread__stick-head-rule" />
        </span>
        <span className="margin-thread__stick-rail">
          <span className="margin-thread__stick-rail-fill" />
          {MARGIN_FOLIOS.map((folio, index) => {
            const isActive = index === activeIndex
            const isPast = index < activeIndex
            return (
              <span
                key={folio.id}
                className={`margin-thread__stick-node ${isActive ? 'is-active' : ''} ${isPast ? 'is-past' : ''}`}
                style={{ '--node-i': index } as CSSProperties}
                aria-hidden="true"
              >
                <span className="margin-thread__stick-node-pip" />
                <span className="margin-thread__stick-node-tick" />
              </span>
            )
          })}
        </span>
        <span className="margin-thread__stick-foot">
          <span className="margin-thread__stick-foot-rule" />
          <span className="margin-thread__stick-foot-tag">
            <span className="margin-thread__stick-foot-num">{String(activeIndex + 1).padStart(2, '0')}</span>
            <span aria-hidden="true">/</span>
            <span>{String(MARGIN_FOLIOS.length).padStart(2, '0')}</span>
          </span>
          <span className="margin-thread__stick-foot-rule" />
        </span>
      </div>
      <ol className="margin-thread__list" aria-label="Folios in reading order">
        {MARGIN_FOLIOS.map((folio, index) => {
          const isActive = index === activeIndex
          return (
            <li
              key={folio.id}
              className={`margin-thread__item ${isActive ? 'is-active' : ''}`}
              aria-current={isActive ? 'location' : undefined}
            >
              <a className="margin-thread__link" href={`#${folio.id}`}>
                <span className="margin-thread__num" aria-hidden="true">{folio.index}</span>
                <span className="margin-thread__copy">
                  <span className="margin-thread__label">{folio.label}</span>
                  <span className="margin-thread__hint">{folio.hint}</span>
                </span>
                <span className="margin-thread__corner" aria-hidden="true">
                  <svg viewBox="0 0 14 14">
                    <path d="M2 7h9M8 3l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </a>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

export { MARGIN_FOLIOS }