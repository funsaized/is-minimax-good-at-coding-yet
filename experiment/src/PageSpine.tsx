import { useEffect, useState, type CSSProperties, type KeyboardEvent as ReactKeyboardEvent } from 'react'
import type { VoiceId } from './App'

export type SpineFolio = {
  id: string
  index: string
  label: string
}

type PageSpineProps = {
  folios: SpineFolio[]
  activeId: string
  voice: VoiceId
  progress: number
  onJump?: (id: string) => void
}

/**
 * PageSpine — the architectural thread that binds the page.
 *
 * A single vertical hairline sits on the outer edge of the page (left on LTR
 * reading). Each folio is marked by a small stitch on the line, with the
 * active folio lifted into focus. The line is bound to scroll progress — a
 * thin inner glow crawls down with the reader so the page reads as a single
 * bound folio being thumbed, not as a stack of separate sections.
 *
 * Reduced motion: the line and marks render statically, no glow crawl.
 * Mobile (narrow viewports): the spine is folded down into a quiet horizontal
 * ribbon under the folio register so the column never competes with content.
 * Accessibility: each mark is a real <button>, keyboard navigable, with the
 * folio index and label announced. The spine itself is `aria-hidden` and the
 * folios are exposed via the topbar register, so the spine is decorative.
 */
export function PageSpine({ folios, activeId, voice, progress, onJump }: PageSpineProps) {
  const [reducedMotion, setReducedMotion] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mq.matches)
    const onChange = () => setReducedMotion(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const id = window.setTimeout(() => setMounted(true), reduce ? 0 : 120)
    return () => window.clearTimeout(id)
  }, [])

  const safeProgress = Math.max(0, Math.min(1, progress))
  const activeIndex = Math.max(0, folios.findIndex(f => f.id === activeId))

  const style = {
    '--spine-progress': safeProgress.toFixed(3),
    '--spine-active': String(activeIndex),
    '--spine-tone': `var(--${voice})`,
  } as CSSProperties

  const onKey = (event: ReactKeyboardEvent<HTMLButtonElement>, idx: number) => {
    if (!onJump) return
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault()
      const next = (idx + 1) % folios.length
      onJump(folios[next].id)
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault()
      const next = (idx - 1 + folios.length) % folios.length
      onJump(folios[next].id)
    } else if (event.key === 'Home') {
      event.preventDefault()
      onJump(folios[0].id)
    } else if (event.key === 'End') {
      event.preventDefault()
      onJump(folios[folios.length - 1].id)
    }
  }

  return (
    <nav
      className={`page-spine page-spine--${voice} ${reducedMotion ? 'is-quiet' : ''} ${mounted ? 'is-in' : ''}`}
      style={style}
      aria-label="The page's spine · folio register"
    >
      <svg className="page-spine__svg" aria-hidden="true" viewBox="0 0 24 600" preserveAspectRatio="none">
        <defs>
          <linearGradient id="page-spine-thread" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
            <stop offset="6%" stopColor="currentColor" stopOpacity=".35" />
            <stop offset="50%" stopColor="currentColor" stopOpacity=".65" />
            <stop offset="94%" stopColor="currentColor" stopOpacity=".35" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="page-spine-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
            <stop offset="18%" stopColor="currentColor" stopOpacity=".18" />
            <stop offset="50%" stopColor="currentColor" stopOpacity=".42" />
            <stop offset="82%" stopColor="currentColor" stopOpacity=".18" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
        </defs>
        <line
          className="page-spine__thread"
          x1="12"
          y1="0"
          x2="12"
          y2="600"
          stroke="url(#page-spine-thread)"
          strokeWidth=".55"
          strokeLinecap="round"
        />
        <line
          className="page-spine__thread page-spine__thread--trail"
          x1="12"
          y1="0"
          x2="12"
          y2="600"
          stroke="url(#page-spine-thread)"
          strokeWidth=".3"
          strokeLinecap="round"
          strokeDasharray=".6 3.2"
          opacity=".55"
        />
        <line
          className="page-spine__fill"
          x1="12"
          y1="0"
          x2="12"
          y2={600 * safeProgress}
          stroke="url(#page-spine-fill)"
          strokeWidth="1.1"
          strokeLinecap="round"
        />
        <circle className="page-spine__head" cx="12" cy="6" r="1.2" fill="currentColor" opacity=".85" />
        <circle className="page-spine__head page-spine__head--ring" cx="12" cy="6" r="3" fill="none" stroke="currentColor" strokeWidth=".35" opacity=".55" />
        <circle className="page-spine__foot" cx="12" cy="594" r="1.2" fill="currentColor" opacity=".85" />
        <circle className="page-spine__foot page-spine__foot--ring" cx="12" cy="594" r="3" fill="none" stroke="currentColor" strokeWidth=".35" opacity=".55" />
      </svg>

      <ol className="page-spine__marks" role="list">
        {folios.map((f, idx) => {
          const isActive = f.id === activeId
          const passed = idx / Math.max(1, folios.length - 1) <= safeProgress + 0.01
          const labelId = `page-spine-label-${f.id}`
          return (
            <li
              key={f.id}
              className={`page-spine__mark ${isActive ? 'is-active' : ''} ${passed ? 'is-passed' : ''}`}
              style={{ '--mark-i': String(idx) } as CSSProperties}
            >
              <span className="page-spine__mark-tick" aria-hidden="true">
                <svg viewBox="0 0 24 8" preserveAspectRatio="none">
                  <line
                    x1="0"
                    y1="4"
                    x2="24"
                    y2="4"
                    stroke="currentColor"
                    strokeWidth={isActive ? '.9' : '.45'}
                    strokeLinecap="round"
                    opacity={isActive ? '.95' : '.5'}
                  />
                  {isActive && (
                    <line
                      x1="0"
                      y1="4"
                      x2="24"
                      y2="4"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      opacity=".22"
                    />
                  )}
                </svg>
              </span>
              <button
                type="button"
                className="page-spine__mark-button"
                onClick={() => onJump?.(f.id)}
                onKeyDown={event => onKey(event, idx)}
                aria-label={`Folio ${f.index} · ${f.label}${isActive ? ' · now reading' : ''}`}
                aria-current={isActive ? 'true' : undefined}
                aria-describedby={labelId}
              >
                <span className="page-spine__mark-bead" aria-hidden="true">
                  <svg viewBox="0 0 12 12">
                    <circle cx="6" cy="6" r={isActive ? 3.4 : 2.4} fill="currentColor" opacity={isActive ? '.95' : '.7'} />
                    <circle cx="6" cy="6" r={isActive ? 5 : 3.6} fill="none" stroke="currentColor" strokeWidth=".35" opacity={isActive ? '.6' : '.35'} />
                    <circle cx="6" cy="6" r="1" fill="var(--night)" />
                  </svg>
                </span>
                <span className="page-spine__mark-copy" id={labelId}>
                  <em className="page-spine__mark-idx">{f.index}</em>
                  <span className="page-spine__mark-label">{f.label}</span>
                </span>
              </button>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
