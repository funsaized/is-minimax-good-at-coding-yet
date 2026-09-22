import { useEffect, useId, useRef, useState, type CSSProperties } from 'react'

type FolioRef = { id: string; index: string; label: string; hint: string }

type SetLineProps = {
  folios: FolioRef[]
  activeId: string
  voice: 'quiet' | 'human' | 'bold'
  pullSignal: number
  isPulling: boolean
}

const PAD_X = 0.08

export function SetLine({ folios, activeId, voice, pullSignal, isPulling }: SetLineProps) {
  const trackRef = useRef<HTMLDivElement | null>(null)
  const [progress, setProgress] = useState(0)
  const [tpShown, setTpShown] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const weaveId = useId().replace(/:/g, '')

  useEffect(() => {
    const compute = () => {
      const doc = document.documentElement
      const scrolled = window.scrollY
      const total = Math.max(1, doc.scrollHeight - window.innerHeight)
      const ratio = Math.max(0, Math.min(1, scrolled / total))
      setProgress(ratio)
    }
    compute()
    window.addEventListener('scroll', compute, { passive: true })
    window.addEventListener('resize', compute)
    return () => {
      window.removeEventListener('scroll', compute)
      window.removeEventListener('resize', compute)
    }
  }, [folios])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mq.matches)
    const onChange = () => setReducedMotion(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    if (!isPulling) return
    const id = window.setTimeout(() => setTpShown(true), 60)
    const id2 = window.setTimeout(() => setTpShown(false), 980)
    return () => {
      window.clearTimeout(id)
      window.clearTimeout(id2)
    }
  }, [pullSignal, isPulling])

  const ticks = folios.map((f, idx) => ({
    ...f,
    pos: folios.length === 1 ? 0.5 : idx / (folios.length - 1),
  }))

  const style = {
    '--set-tone': `var(--${voice})`,
  } as CSSProperties

  const activeIndex = Math.max(0, folios.findIndex(f => f.id === activeId))

  return (
    <div
      className={`set-line ${isPulling ? 'is-pulling' : ''} ${tpShown ? 'is-stamping' : ''} ${reducedMotion ? 'is-quiet' : ''}`}
      ref={trackRef}
      style={style}
      aria-label="Reading set line · folio progress, voiced"
      role="presentation"
    >
      <svg
        className="set-line__defs"
        viewBox="0 0 1200 40"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <pattern id={`thread-weave-${weaveId}`} x="0" y="0" width="6" height="4" patternUnits="userSpaceOnUse">
            <path d="M0 2c1.6 -1.6 4.4 -1.6 6 0" fill="none" stroke="rgba(245,238,216,0.18)" strokeWidth=".5" />
            <path d="M0 2c1.6 1.6 4.4 1.6 6 0" fill="none" stroke="rgba(0,0,0,0.20)" strokeWidth=".5" />
          </pattern>
          <linearGradient id={`thread-grad-${weaveId}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(245, 238, 216, 0.05)" />
            <stop offset="8%" stopColor="rgba(245, 238, 216, 0.32)" />
            <stop offset="50%" stopColor="rgba(245, 238, 216, 0.42)" />
            <stop offset="92%" stopColor="rgba(245, 238, 216, 0.32)" />
            <stop offset="100%" stopColor="rgba(245, 238, 216, 0.05)" />
          </linearGradient>
          <linearGradient id={`thread-fill-${weaveId}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--set-tone, var(--quiet))" stopOpacity=".0" />
            <stop offset="6%" stopColor="var(--set-tone, var(--quiet))" stopOpacity=".55" />
            <stop offset="92%" stopColor="var(--set-tone, var(--quiet))" stopOpacity=".85" />
            <stop offset="100%" stopColor="var(--set-tone, var(--quiet))" stopOpacity="1" />
          </linearGradient>
        </defs>
      </svg>

      <div className="set-line__rail" aria-hidden="true">
        <span className="set-line__hairline" />

        <span
          className="set-line__thread"
          style={{ backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 4'><path d='M0 2c3 -2 9 -2 12 0' fill='none' stroke='%23f5eed8' stroke-opacity='.5' stroke-width='.6'/><path d='M0 2c3 2 9 2 12 0' fill='none' stroke='%23000' stroke-opacity='.35' stroke-width='.6'/></svg>")` }}
        />

        <span
          className="set-line__fill"
          style={{ transform: `scaleX(${Math.max(0.001, progress)})` }}
        />

        <span
          className="set-line__thread-fill"
          style={{ transform: `scaleX(${Math.max(0.001, progress)})` }}
        />

        <ol className="set-line__ticks" aria-hidden="true">
          {ticks.map((t, i) => {
            const leftClamped = Math.min(1 - PAD_X, Math.max(PAD_X, t.pos))
            const isActive = i === activeIndex
            const isPast = i < activeIndex
            return (
              <li
                key={t.id}
                className={`set-line__tick ${isActive ? 'is-active' : ''} ${isPast ? 'is-past' : ''}`}
                style={{ left: `${leftClamped * 100}%` }}
              >
                <span className="set-line__tick-wrap">
                  <span className="set-line__tick-knot" aria-hidden="true">
                    <svg viewBox="0 0 14 14">
                      <circle cx="7" cy="7" r="5.6" fill="var(--night)" stroke="currentColor" strokeWidth=".7" />
                      <circle cx="7" cy="7" r="3.4" fill="none" stroke="currentColor" strokeWidth=".3" strokeDasharray="1 1.6" opacity=".7" />
                      <circle cx="7" cy="7" r="1.1" fill="currentColor" />
                    </svg>
                  </span>
                </span>
                <span className="set-line__tick-stem set-line__tick-stem--a" aria-hidden="true" />
                <span className="set-line__tick-stem set-line__tick-stem--b" aria-hidden="true" />
                <span className="set-line__tick-num" aria-hidden="true">{t.index}</span>
                <span className="set-line__tick-label" aria-hidden="true">
                  {t.label}
                </span>
              </li>
            )
          })}
        </ol>

        <span
          className="set-line__cursor"
          style={{ left: `${Math.max(0, Math.min(1, progress)) * 100}%` }}
          aria-hidden="true"
        >
          <span className="set-line__cursor-pin" aria-hidden="true">
            <span className="set-line__cursor-pin-head" />
            <span className="set-line__cursor-pin-eye" />
          </span>
          <span className="set-line__cursor-thread" aria-hidden="true" />
        </span>

        <span className="set-line__end set-line__end--l" aria-hidden="true">
          <span className="set-line__end-fray" />
          <span className="set-line__end-tied" />
        </span>
        <span className="set-line__end set-line__end--r" aria-hidden="true">
          <span className="set-line__end-fray" />
          <span className="set-line__end-tied" />
        </span>
      </div>
    </div>
  )
}
