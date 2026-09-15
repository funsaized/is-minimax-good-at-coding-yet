import { useCallback, useEffect, useId, useRef, useState } from 'react'
import type { CSSProperties, KeyboardEvent as ReactKeyboardEvent } from 'react'
import type { VoiceId } from './Press'

type WayfinderFolio = {
  id: string
  index: string
  label: string
  hint: string
}

const FOLIOS: WayfinderFolio[] = [
  { id: 'question', index: 'i', label: 'the question', hint: 'a folio of one line, set three ways' },
  { id: 'press', index: 'ii', label: 'the press bed', hint: 'a lever, a stick, a pulled impression' },
  { id: 'contents', index: 'iii', label: 'this page, listed', hint: 'the press log · folio contents' },
  { id: 'day', index: 'iii·', label: 'the day sheet', hint: 'the hour, the week, the day’s record' },
  { id: 'note', index: '·', label: 'a folded slip', hint: 'a short letter to the reader' },
  { id: 'proof', index: 'iv', label: 'the second proof', hint: 'marks on the words worth keeping' },
  { id: 'pressings', index: 'v', label: 'three pressings', hint: 'the question set three ways' },
  { id: 'notes', index: 'vi', label: 'the marginalia', hint: 'three things worth keeping' },
  { id: 'answer', index: 'viii', label: 'the answer', hint: 'folded once, then folded back' },
]

const VOICE_TONE: Record<VoiceId, string> = {
  quiet: 'var(--blue)',
  human: 'var(--coral)',
  bold: 'var(--acid)',
}

type WayfinderSealProps = {
  activeId: string
  voice: VoiceId
  setToday: string
}

export function WayfinderSeal({ activeId, voice, setToday }: WayfinderSealProps) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const baseId = useId()
  const panelId = `wayfinder-panel-${baseId.replace(/:/g, '')}`
  const grainId = `wayfinder-grain-${baseId.replace(/:/g, '')}`

  const activeIndex = Math.max(0, FOLIOS.findIndex(f => f.id === activeId))
  const activeFolio = FOLIOS[activeIndex] ?? FOLIOS[0]
  const tone = VOICE_TONE[voice]
  const style = { '--wayfinder-tone': tone } as CSSProperties

  const close = useCallback(() => {
    setOpen(false)
    window.requestAnimationFrame(() => triggerRef.current?.focus())
  }, [])

  useEffect(() => {
    if (!open) return
    const onPointer = (event: PointerEvent) => {
      const root = rootRef.current
      if (!root) return
      if (event.target instanceof Node && !root.contains(event.target)) {
        setOpen(false)
      }
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        setOpen(false)
        window.requestAnimationFrame(() => triggerRef.current?.focus())
      }
    }
    document.addEventListener('pointerdown', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const onTriggerKey = (event: ReactKeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      setOpen(true)
    }
  }

  return (
    <div className={`wayfinder wayfinder--${voice} ${open ? 'is-open' : ''}`} ref={rootRef} style={style}>
      <button
        ref={triggerRef}
        type="button"
        className="wayfinder__seal"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={`Wayfinder · folio ${activeFolio.index} · ${activeFolio.label}. Open the folio index.`}
        onClick={() => setOpen(prev => !prev)}
        onKeyDown={onTriggerKey}
      >
        <span className="wayfinder__seal-frame" aria-hidden="true">
          <svg viewBox="0 0 64 64" className="wayfinder__seal-svg">
            <defs>
              <filter id={grainId} x="-10%" y="-10%" width="120%" height="120%">
                <feTurbulence type="fractalNoise" baseFrequency="2.4" numOctaves="2" seed="5" stitchTiles="stitch" />
                <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .45 0" />
                <feComposite in2="SourceGraphic" operator="in" />
              </filter>
            </defs>
            <g filter={`url(#${grainId})`} opacity=".92">
              <circle cx="32" cy="32" r="29" fill="none" stroke="currentColor" strokeWidth="1.1" />
              <circle cx="32" cy="32" r="24.5" fill="none" stroke="currentColor" strokeWidth=".4" strokeDasharray="1 2" />
              <text
                x="32"
                y="20"
                textAnchor="middle"
                fontFamily="ui-monospace, monospace"
                fontSize="3.6"
                letterSpacing="1.6"
                fill="currentColor"
              >PRESS · INDEX</text>
              <text
                x="32"
                y="38"
                textAnchor="middle"
                fontFamily="Georgia, serif"
                fontStyle="italic"
                fontSize="14"
                fill="currentColor"
              >m³</text>
              <text
                x="32"
                y="50"
                textAnchor="middle"
                fontFamily="ui-monospace, monospace"
                fontSize="3.4"
                letterSpacing="1.4"
                fill="currentColor"
              >FOLIO · {activeFolio.index}</text>
            </g>
          </svg>
          <span className="wayfinder__seal-shine" aria-hidden="true" />
        </span>
        <span className="wayfinder__seal-cue" aria-hidden="true">
          <span className="wayfinder__seal-cue-dot" />
          <span className="wayfinder__seal-cue-line" />
          <span className="wayfinder__seal-cue-folio">{activeFolio.index}</span>
        </span>
      </button>

      <div
        className="wayfinder__panel"
        id={panelId}
        role="dialog"
        aria-label="Folio index"
        aria-hidden={!open}
        tabIndex={-1}
      >
        <header className="wayfinder__panel-head">
          <span className="wayfinder__panel-eyebrow">
            <span className="wayfinder__panel-eyebrow-mark" aria-hidden="true">※</span>
            the folio index
            <span className="wayfinder__panel-eyebrow-mark" aria-hidden="true">※</span>
          </span>
          <span className="wayfinder__panel-set">
            set today · <em>{setToday}</em>
          </span>
        </header>
        <span className="wayfinder__panel-rule" aria-hidden="true">
          <svg viewBox="0 0 240 6" preserveAspectRatio="none">
            <path d="M2 3c20-4 40 4 60 0s40-4 60 0 40 4 60 0 40-4 58-1" fill="none" stroke="currentColor" strokeWidth=".8" strokeLinecap="round" />
            <circle cx="236" cy="3" r="1.1" fill="currentColor" />
          </svg>
        </span>
        <ol className="wayfinder__list" aria-label="Folios in reading order">
          {FOLIOS.map((folio, index) => {
            const isActive = index === activeIndex
            return (
              <li key={folio.id} className={`wayfinder__item ${isActive ? 'is-active' : ''}`}>
                <a className="wayfinder__link" href={`#${folio.id}`} aria-current={isActive ? 'location' : undefined} onClick={() => setOpen(false)}>
                  <span className="wayfinder__item-num" aria-hidden="true">{folio.index}</span>
                  <span className="wayfinder__item-rule" aria-hidden="true" />
                  <span className="wayfinder__item-copy">
                    <span className="wayfinder__item-label">{folio.label}</span>
                    <span className="wayfinder__item-hint">{folio.hint}</span>
                  </span>
                  <span className="wayfinder__item-pip" aria-hidden="true" />
                </a>
              </li>
            )
          })}
        </ol>
        <footer className="wayfinder__panel-foot" aria-hidden="true">
          <span className="wayfinder__panel-foot-mark" />
          <span>nine folios · one question · the press is open</span>
          <span className="wayfinder__panel-foot-mark" />
        </footer>
        <button type="button" className="wayfinder__close" onClick={close} aria-label="Close the folio index" tabIndex={open ? 0 : -1}>
          <svg viewBox="0 0 16 16" aria-hidden="true">
            <path d="M3 3l10 10M13 3L3 13" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
          <span>close</span>
        </button>
      </div>
    </div>
  )
}