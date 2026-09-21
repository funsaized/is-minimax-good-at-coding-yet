import { useCallback, useEffect, useRef, useState, type CSSProperties, type KeyboardEvent as ReactKeyboardEvent } from 'react'

type Folio = { id: string; index: string; label: string; hint: string }

type ReadingLedgerProps = {
  folios: Folio[]
  activeId: string
  voice: 'quiet' | 'human' | 'bold'
  setToday: string
}

const VOICE_TONE: Record<ReadingLedgerProps['voice'], string> = {
  quiet: 'var(--quiet)',
  human: 'var(--human)',
  bold: 'var(--bold)',
}

const VOICE_NAME: Record<ReadingLedgerProps['voice'], string> = {
  quiet: 'quiet cut',
  human: 'human hand',
  bold: 'bold signal',
}

export function ReadingLedger({ folios, activeId, voice, setToday }: ReadingLedgerProps) {
  const [open, setOpen] = useState(false)
  const [progress, setProgress] = useState(0)
  const rootRef = useRef<HTMLDivElement | null>(null)
  const panelRef = useRef<HTMLDivElement | null>(null)
  const triggerRef = useRef<HTMLButtonElement | null>(null)
  const closeRef = useRef<HTMLButtonElement | null>(null)
  const activeIndex = Math.max(0, folios.findIndex(f => f.id === activeId))
  const active = folios[activeIndex] ?? folios[0]
  const tone = VOICE_TONE[voice]
  const style = { '--rl-tone': tone } as CSSProperties

  const close = useCallback(() => {
    setOpen(false)
    window.requestAnimationFrame(() => triggerRef.current?.focus())
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const onScroll = () => {
      const doc = document.documentElement
      const scrolled = window.scrollY
      const total = Math.max(1, doc.scrollHeight - window.innerHeight)
      const ratio = Math.max(0, Math.min(1, scrolled / total))
      setProgress(ratio)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
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

  useEffect(() => {
    if (!open) return
    window.requestAnimationFrame(() => {
      const node = panelRef.current?.querySelector<HTMLElement>('.rl__item.is-active .rl__link')
      if (node) node.focus({ preventScroll: true })
    })
  }, [open])

  const onTriggerKey = (event: ReactKeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      setOpen(true)
    }
  }

  return (
    <aside
      ref={rootRef}
      className={`rl ${open ? 'is-open' : ''}`}
      style={style}
      aria-label="The reading ledger · folio index and reading position"
    >
      <span className="rl__track" aria-hidden="true">
        <span className="rl__track-line" />
        <span
          className="rl__track-fill"
          style={{ transform: `scaleY(${progress})` }}
        />
        <ol className="rl__stations">
          {folios.map((folio, idx) => {
            const isActive = idx === activeIndex
            const isPast = idx < activeIndex
            return (
              <li
                key={folio.id}
                className={`rl__station ${isActive ? 'is-active' : ''} ${isPast ? 'is-past' : ''}`}
                style={{ top: `calc(${(idx / Math.max(folios.length - 1, 1)) * 100}% - 5px)` }}
              >
                <a className="rl__station-link" href={`#${folio.id}`} aria-label={`Folio ${folio.index} · ${folio.label}`}>
                  <span className="rl__station-bead" />
                  <span className="rl__station-num" aria-hidden="true">{folio.index}</span>
                </a>
                <span className="rl__station-tooltip" aria-hidden="true">
                  <em>{folio.label}</em>
                  <span>{folio.hint}</span>
                </span>
              </li>
            )
          })}
        </ol>
        <span className="rl__cursor" style={{ top: `calc(${progress * 100}% - 5px)` }} aria-hidden="true">
          <span className="rl__cursor-bead" />
        </span>
      </span>

      <span className="rl__caption" aria-hidden="true">
        <span className="rl__caption-cell">
          <em>now on</em>
          <span className="rl__caption-num">{active.index}</span>
          <span>{active.label}</span>
        </span>
        <span className="rl__caption-cell rl__caption-cell--meta">
          <em>{Math.round(progress * 100)}<small>%</small></em>
          <span>read</span>
        </span>
      </span>

      <button
        ref={triggerRef}
        type="button"
        className="rl__trigger"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={`The reading ledger · folio ${active.index} · ${active.label} · open the index.`}
        onClick={() => setOpen(prev => !prev)}
        onKeyDown={onTriggerKey}
      >
        <svg className="rl__trigger-glyph" viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="9.5" fill="none" stroke="currentColor" strokeWidth=".7" />
          <circle cx="12" cy="12" r="6.5" fill="none" stroke="currentColor" strokeWidth=".5" strokeDasharray=".9 1.8" opacity=".7" />
          <text x="12" y="15.5" textAnchor="middle" fontFamily="Georgia, serif" fontStyle="italic" fontSize="9" fill="currentColor">m³</text>
        </svg>
        <span className="rl__trigger-tag">
          <em>folio</em>
          <strong>{active.index}</strong>
        </span>
      </button>

      <div
        ref={panelRef}
        className="rl__panel"
        role="dialog"
        aria-label="The folio index"
        aria-hidden={!open}
      >
        <header className="rl__head">
          <span className="rl__head-eyebrow">the folio index</span>
          <em className="rl__head-meta">composed in {VOICE_NAME[voice]} <em>·</em> {setToday}</em>
        </header>
        <ol className="rl__list">
          {folios.map((folio, idx) => {
            const isActive = idx === activeIndex
            return (
              <li key={folio.id} className={`rl__item ${isActive ? 'is-active' : ''} ${idx < activeIndex ? 'is-past' : ''}`}>
                <a
                  className="rl__link"
                  href={`#${folio.id}`}
                  aria-current={isActive ? 'location' : undefined}
                  onClick={() => setOpen(false)}
                >
                  <span className="rl__link-num" aria-hidden="true">{folio.index}</span>
                  <span className="rl__link-stack">
                    <span className="rl__link-label">{folio.label}</span>
                    <span className="rl__link-hint">{folio.hint}</span>
                  </span>
                  <span className="rl__link-pip" aria-hidden="true" />
                </a>
              </li>
            )
          })}
        </ol>
        <span className="rl__panel-foot" aria-hidden="true">
          <span className="rl__panel-foot-rule" />
          <em>a single composed page, read in any order</em>
          <span className="rl__panel-foot-rule" />
        </span>
        <button
          ref={closeRef}
          type="button"
          className="rl__close"
          onClick={close}
          aria-label="Close the folio index"
          tabIndex={open ? 0 : -1}
        >
          <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
            <path d="M3 3l10 10M13 3L3 13" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
          <span>close</span>
        </button>
      </div>
    </aside>
  )
}
