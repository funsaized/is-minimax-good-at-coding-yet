import { useCallback, useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from 'react'

type WayfinderProps = {
  folios: { id: string; index: string; label: string; hint: string }[]
  activeId: string
  voice: 'quiet' | 'human' | 'bold'
  setToday: string
}

export function Wayfinder({ folios, activeId, voice, setToday }: WayfinderProps) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement | null>(null)
  const triggerRef = useRef<HTMLButtonElement | null>(null)
  const activeIndex = Math.max(0, folios.findIndex(f => f.id === activeId))
  const active = folios[activeIndex] ?? folios[0]

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
        close()
      }
    }
    document.addEventListener('pointerdown', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [open, close])

  const onTriggerKey = (event: ReactKeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      setOpen(true)
    }
  }

  return (
    <div className={`wayfinder ${open ? 'is-open' : ''}`} ref={rootRef}>
      <button
        ref={triggerRef}
        type="button"
        className="wayfinder__seal"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={`Wayfinder · folio ${active.index} · ${active.label}. Open the folio index.`}
        onClick={() => setOpen(prev => !prev)}
        onKeyDown={onTriggerKey}
      >
        <svg className="wayfinder__seal-svg" viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="9.5" fill="none" stroke="currentColor" strokeWidth=".7" />
          <circle cx="12" cy="12" r="6.5" fill="none" stroke="currentColor" strokeWidth=".5" strokeDasharray="0.9 1.8" opacity=".7" />
          <text x="12" y="15" textAnchor="middle" fontFamily="Georgia, serif" fontStyle="italic" fontSize="9" fill="currentColor">m³</text>
        </svg>
      </button>

      <div className="wayfinder__panel" role="dialog" aria-label="Folio index" aria-hidden={!open}>
        <header className="wayfinder__panel-head">
          <span>the folio index</span>
          <em>set today · {setToday}</em>
        </header>
        <ol className="wayfinder__list">
          {folios.map((folio, idx) => {
            const isActive = idx === activeIndex
            return (
              <li key={folio.id} className={`wayfinder__item ${isActive ? 'is-active' : ''}`}>
                <a
                  className="wayfinder__link"
                  href={`#${folio.id}`}
                  aria-current={isActive ? 'location' : undefined}
                  onClick={() => setOpen(false)}
                >
                  <span className="wayfinder__link-num">{folio.index}</span>
                  <span>
                    <span className="wayfinder__link-label">{folio.label}</span>
                    <span className="wayfinder__link-hint">{folio.hint}</span>
                  </span>
                  <span className="wayfinder__link-pip" aria-hidden="true" />
                </a>
              </li>
            )
          })}
        </ol>
        <button type="button" className="wayfinder__close" onClick={close} aria-label="Close the folio index" tabIndex={open ? 0 : -1}>
          <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
            <path d="M3 3l10 10M13 3L3 13" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
          <span>close</span>
        </button>
      </div>
    </div>
  )
}
