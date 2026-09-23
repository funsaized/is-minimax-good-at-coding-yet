import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react'
import type { VoiceId } from './App'

type FolioRef = { id: string; index: string; label: string; hint: string }

type PrinterAtlasProps = {
  folios: FolioRef[]
  activeId: string
  voice: VoiceId
  timeOfDay: string
}

const TICK_COUNT = 22

export function PrinterAtlas({ folios, activeId, voice, timeOfDay }: PrinterAtlasProps) {
  const [reducedMotion, setReducedMotion] = useState(false)
  const [activeIdx, setActiveIdx] = useState(() =>
    Math.max(0, folios.findIndex(f => f.id === activeId)),
  )
  const lastActive = useRef(activeId)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mq.matches)
    const onChange = () => setReducedMotion(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    if (lastActive.current === activeId) return
    lastActive.current = activeId
    setActiveIdx(Math.max(0, folios.findIndex(f => f.id === activeId)))
  }, [activeId, folios])

  const total = folios.length
  const active = folios[activeIdx] ?? folios[0]
  const next = folios[(activeIdx + 1) % total]

  const voiceTone = `var(--${voice})`
  const style = {
    '--pa-tone': voiceTone,
  } as CSSProperties

  const ticks = Array.from({ length: TICK_COUNT }, (_, i) => i)

  const onKey = (event: ReactKeyboardEvent<HTMLAnchorElement>) => {
    const currentIdx = Math.max(0, folios.findIndex(f => f.id === activeId))
    let nextIdx = currentIdx
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
      nextIdx = (currentIdx + 1) % total
    } else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
      nextIdx = (currentIdx - 1 + total) % total
    } else if (event.key === 'Home') {
      nextIdx = 0
    } else if (event.key === 'End') {
      nextIdx = total - 1
    }
    if (nextIdx === currentIdx) return
    event.preventDefault()
    const target = document.getElementById(folios[nextIdx].id)
    if (target) {
      target.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' })
      const link = document.querySelector<HTMLAnchorElement>(`a[href="#${folios[nextIdx].id}"]`)
      window.requestAnimationFrame(() => link?.focus())
    }
  }

  return (
    <aside
      className={`printer-atlas printer-atlas--${voice} ${reducedMotion ? 'is-quiet' : ''}`}
      style={style}
      aria-label="The printer's atlas · a folio index for the page"
    >
      <a
        className="printer-atlas__seal"
        href="#question"
        aria-label={`Back to the question — folio ${active.index} · ${active.label}`}
        onKeyDown={onKey}
      >
        <svg viewBox="0 0 36 36" aria-hidden="true">
          <circle cx="18" cy="18" r="15.4" fill="none" stroke="currentColor" strokeWidth=".6" />
          <circle cx="18" cy="18" r="11.6" fill="none" stroke="currentColor" strokeWidth=".35" strokeDasharray=".6 1.4" opacity=".55" />
          <path
            d="M10 18 A8 8 0 0 1 26 18"
            fill="none"
            stroke="currentColor"
            strokeWidth=".55"
            strokeLinecap="round"
          />
          <line x1="18" y1="2.4" x2="18" y2="6.6" stroke="currentColor" strokeWidth=".55" strokeLinecap="round" opacity=".7" />
          <line x1="18" y1="29.4" x2="18" y2="33.6" stroke="currentColor" strokeWidth=".55" strokeLinecap="round" opacity=".7" />
          <line x1="2.4" y1="18" x2="6.6" y2="18" stroke="currentColor" strokeWidth=".55" strokeLinecap="round" opacity=".7" />
          <line x1="29.4" y1="18" x2="33.6" y2="18" stroke="currentColor" strokeWidth=".55" strokeLinecap="round" opacity=".7" />
        </svg>
        <span className="printer-atlas__seal-mark" aria-hidden="true">m³</span>
      </a>

      <span className="printer-atlas__rule" aria-hidden="true">
        <svg viewBox={`0 0 12 ${TICK_COUNT * 12}`} preserveAspectRatio="none">
          <line x1="6" y1="0" x2="6" y2={TICK_COUNT * 12} stroke="currentColor" strokeWidth=".55" opacity=".55" />
          {ticks.map(i => {
            const isMajor = i % 4 === 0
            const half = isMajor ? 4.2 : 2.4
            return (
              <line
                key={`tick-${i}`}
                x1={6 - half}
                y1={i * 12 + 6}
                x2={6 + half}
                y2={i * 12 + 6}
                stroke="currentColor"
                strokeWidth={isMajor ? '.65' : '.4'}
                opacity={isMajor ? '.85' : '.45'}
              />
            )
          })}
          <circle cx="6" cy="6" r="1.1" fill="currentColor" opacity=".85" />
          <circle cx="6" cy={(TICK_COUNT - 1) * 12 + 6} r="1.1" fill="currentColor" opacity=".85" />
        </svg>
      </span>

      <span className="printer-atlas__folio" aria-hidden="true">
        <em className="printer-atlas__folio-idx">{active.index}</em>
        <em className="printer-atlas__folio-label">{active.label}</em>
      </span>

      <span className="printer-atlas__catch" aria-hidden="true">
        <span className="printer-atlas__catch-key">next</span>
        <em className="printer-atlas__catch-glyph" aria-hidden="true">↳</em>
        <span className="printer-atlas__catch-text">{next.hint.split('·')[0].trim()}</span>
      </span>

      <span className="printer-atlas__time" aria-hidden="true">
        <span className="printer-atlas__time-glyph" />
        <em className="printer-atlas__time-word">{timeOfDay}</em>
      </span>

      <span className="printer-atlas__sig" aria-hidden="true">
        <svg viewBox="0 0 28 28" aria-hidden="true">
          <path d="M14 2 L14 26 M2 14 L26 14" stroke="currentColor" strokeWidth=".55" strokeLinecap="round" opacity=".55" />
          <circle cx="14" cy="14" r="5.4" fill="none" stroke="currentColor" strokeWidth=".55" />
          <circle cx="14" cy="14" r="2" fill="currentColor" />
          <circle cx="14" cy="14" r=".7" fill="var(--night)" />
        </svg>
      </span>
    </aside>
  )
}