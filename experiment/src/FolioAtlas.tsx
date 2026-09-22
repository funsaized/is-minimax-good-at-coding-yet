import {
  useEffect,
  useId,
  useState,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react'
import type { VoiceId } from './App'

export type FolioRef = { id: string; index: string; label: string; hint: string }

type FolioAtlasProps = {
  folios: FolioRef[]
  activeId: string
  voice: VoiceId
  setToday: string
}

const PROGRESS_PADDING = 0.08

function positionFor(idx: number, total: number) {
  const denom = Math.max(total - 1, 1)
  return PROGRESS_PADDING + (idx / denom) * (1 - PROGRESS_PADDING * 2)
}

export function FolioAtlas({ folios, activeId, voice, setToday }: FolioAtlasProps) {
  const baseId = useId().replace(/:/g, '')
  const [progress, setProgress] = useState(0)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mq.matches)
    const onChange = () => setReducedMotion(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    let raf = 0
    const compute = () => {
      const doc = document.documentElement
      const scrolled = window.scrollY
      const total = Math.max(1, doc.scrollHeight - window.innerHeight)
      const ratio = Math.max(0, Math.min(1, scrolled / total))
      setProgress(ratio)
      raf = 0
    }
    const onScroll = () => {
      if (raf) return
      raf = window.requestAnimationFrame(compute)
    }
    compute()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) window.cancelAnimationFrame(raf)
    }
  }, [])

  const onNodeKey = (event: ReactKeyboardEvent<HTMLAnchorElement>, idx: number) => {
    const total = folios.length
    let next = idx
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (idx + 1) % total
    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (idx - 1 + total) % total
    if (event.key === 'Home') next = 0
    if (event.key === 'End') next = total - 1
    if (next === idx) return
    event.preventDefault()
    const target = document.getElementById(folios[next].id)
    if (target) {
      target.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' })
      const link = document.querySelector<HTMLAnchorElement>(`a[href="#${folios[next].id}"]`)
      window.requestAnimationFrame(() => link?.focus())
    }
  }

  const style = {
    '--atlas-tone': `var(--${voice})`,
  } as CSSProperties

  const activeIdx = Math.max(0, folios.findIndex(f => f.id === activeId))
  const total = folios.length
  const positions = folios.map((_f, idx) => positionFor(idx, total))

  const lineId = `atlas-line-${baseId}`
  const washId = `atlas-wash-${baseId}`
  const dayId = `atlas-day-${baseId}`

  return (
    <section
      className={`folio-atlas ${reducedMotion ? 'is-quiet' : ''}`}
      style={style}
      aria-label="The folio atlas · a reader's map through the page"
    >
      <svg
        className="folio-atlas__defs"
        viewBox="0 0 1200 260"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={lineId} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(245, 238, 216, 0)" />
            <stop offset="14%" stopColor="rgba(245, 238, 216, .14)" />
            <stop offset="50%" stopColor="rgba(245, 238, 216, .28)" />
            <stop offset="86%" stopColor="rgba(245, 238, 216, .14)" />
            <stop offset="100%" stopColor="rgba(245, 238, 216, 0)" />
          </linearGradient>
          <linearGradient id={washId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(245, 238, 216, .04)" />
            <stop offset="100%" stopColor="rgba(245, 238, 216, 0)" />
          </linearGradient>
          <radialGradient id={dayId} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--atlas-tone)" stopOpacity=".42" />
            <stop offset="60%" stopColor="var(--atlas-tone)" stopOpacity=".1" />
            <stop offset="100%" stopColor="var(--atlas-tone)" stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>

      <header className="folio-atlas__head">
        <span className="folio-atlas__head-key" aria-hidden="true">
          <svg viewBox="0 0 12 12" className="folio-atlas__head-glyph">
            <circle cx="6" cy="6" r="5" fill="none" stroke="currentColor" strokeWidth=".55" />
            <circle cx="6" cy="6" r="2" fill="currentColor" />
            <line x1="6" y1="0" x2="6" y2="12" stroke="currentColor" strokeWidth=".4" />
            <line x1="0" y1="6" x2="12" y2="6" stroke="currentColor" strokeWidth=".4" />
          </svg>
          <em>the reader's atlas</em>
        </span>
        <span className="folio-atlas__head-rule" aria-hidden="true" />
        <span className="folio-atlas__head-meta">
          <em className="folio-atlas__head-count">
            {String(activeIdx + 1).padStart(2, '0')} <span aria-hidden="true">/</span> {String(total).padStart(2, '0')}
          </em>
          <span className="folio-atlas__head-sep" aria-hidden="true">·</span>
          <em className="folio-atlas__head-set">set on {setToday}</em>
        </span>
      </header>

      <div className="folio-atlas__plate" role="group" aria-label="Folio index">
        <span className="folio-atlas__wash" aria-hidden="true">
          <svg viewBox="0 0 1200 260" preserveAspectRatio="none">
            <rect x="0" y="0" width="1200" height="260" fill={`url(#${washId})`} />
          </svg>
        </span>

        <span className="folio-atlas__day-arc" aria-hidden="true">
          <svg viewBox="0 0 1200 80" preserveAspectRatio="none" className="folio-atlas__day-arc-svg">
            <path
              d={(() => {
                const pts = folios.map((_f, idx) => ({
                  x: positions[idx] * 1200,
                  y: 40 + Math.sin(idx * 0.85) * 14,
                }))
                const first = pts[0]
                let d = `M ${first.x} ${first.y}`
                for (let i = 1; i < pts.length; i++) {
                  const prev = pts[i - 1]
                  const cur = pts[i]
                  const cx1 = prev.x + (cur.x - prev.x) * 0.4
                  const cx2 = prev.x + (cur.x - prev.x) * 0.6
                  d += ` C ${cx1} ${prev.y}, ${cx2} ${cur.y}, ${cur.x} ${cur.y}`
                }
                return d
              })()}
              fill="none"
              stroke="currentColor"
              strokeWidth=".5"
              strokeDasharray="1.4 4"
              opacity=".55"
            />
          </svg>
        </span>

        <span className="folio-atlas__track" aria-hidden="true">
          <svg viewBox="0 0 1200 6" preserveAspectRatio="none" className="folio-atlas__track-svg">
            <line x1="0" y1="3" x2="1200" y2="3" stroke="rgba(245, 238, 216, .08)" strokeWidth="1" strokeDasharray="1.4 4" />
            <line
              x1="0"
              y1="3"
              x2={progress * 1200}
              y2="3"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              opacity=".85"
            />
            <line
              x1="0"
              y1="3"
              x2="1200"
              y2="3"
              stroke={`url(#${lineId})`}
              strokeWidth=".6"
            />
          </svg>
        </span>

        <span className="folio-atlas__sun" aria-hidden="true">
          <svg viewBox="0 0 1200 80" preserveAspectRatio="none" className="folio-atlas__sun-svg">
            <circle cx={progress * 1200} cy="40" r="22" fill={`url(#${dayId})`} />
            <circle cx={progress * 1200} cy="40" r="5" fill="none" stroke="currentColor" strokeWidth=".5" opacity=".55" />
            <circle cx={progress * 1200} cy="40" r="2.4" fill="currentColor" />
          </svg>
        </span>

        <ol className="folio-atlas__nodes">
          {folios.map((folio, idx) => {
            const isActive = folio.id === activeId
            const isPast = positions[idx] <= progress
            const left = `${positions[idx] * 100}%`
            const nodeStyle = {
              '--node-x': left,
              '--node-tone': `var(--${voice})`,
            } as CSSProperties
            return (
              <li
                key={folio.id}
                className={`folio-atlas__node folio-atlas__node--${folio.id} ${isActive ? 'is-active' : ''} ${isPast ? 'is-past' : ''}`}
                style={nodeStyle}
              >
                <a
                  href={`#${folio.id}`}
                  className="folio-atlas__node-anchor"
                  aria-label={`Folio ${folio.index} · ${folio.label}. ${folio.hint}`}
                  aria-current={isActive ? 'location' : undefined}
                  onKeyDown={event => onNodeKey(event, idx)}
                >
                  <span className="folio-atlas__node-stem" aria-hidden="true" />
                  <span className="folio-atlas__node-bead" aria-hidden="true">
                    <svg viewBox="0 0 22 22">
                      <circle className="folio-atlas__node-halo" cx="11" cy="11" r="10.2" fill="none" stroke="currentColor" strokeWidth=".35" strokeDasharray="1 2.6" opacity=".55" />
                      <circle className="folio-atlas__node-shell" cx="11" cy="11" r="6.6" fill="var(--night)" stroke="currentColor" strokeWidth=".55" />
                      <circle className="folio-atlas__node-eye" cx="11" cy="11" r="2.4" fill="currentColor" />
                      <circle className="folio-atlas__node-spark" cx="11" cy="11" r=".7" fill="var(--night)" />
                    </svg>
                  </span>
                  <span className="folio-atlas__node-tag" aria-hidden="true">
                    <em className="folio-atlas__node-idx">{folio.index}</em>
                    <span className="folio-atlas__node-name">{folio.label}</span>
                  </span>
                </a>
              </li>
            )
          })}
        </ol>

        <span className="folio-atlas__hint" aria-hidden="true">
          <span className="folio-atlas__hint-rule" />
          <em>jump to a folio · or keep reading</em>
          <span className="folio-atlas__hint-rule" />
        </span>
      </div>
    </section>
  )
}
