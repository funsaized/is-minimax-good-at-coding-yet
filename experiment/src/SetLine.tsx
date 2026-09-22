import { useEffect, useRef, useState, type CSSProperties } from 'react'

type FolioRef = { id: string; index: string; label: string; hint: string }

type SetLineProps = {
  folios: FolioRef[]
  activeId: string
  voice: 'quiet' | 'human' | 'bold'
  pullSignal: number
  isPulling: boolean
}

const PAD_X = 0.05

export function SetLine({ folios, activeId, voice, pullSignal, isPulling }: SetLineProps) {
  const trackRef = useRef<HTMLDivElement | null>(null)
  const [progress, setProgress] = useState(0)
  const [tpShown, setTpShown] = useState(false)

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
      className={`set-line ${isPulling ? 'is-pulling' : ''} ${tpShown ? 'is-stamping' : ''}`}
      ref={trackRef}
      style={style}
      aria-label="Reading set line · folio progress, voiced"
      role="presentation"
    >
      <div className="set-line__rail" aria-hidden="true">
        <span className="set-line__hairline" />
        <span
          className="set-line__fill"
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
                <span className="set-line__tick-mark" aria-hidden="true" />
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
          <span className="set-line__cursor-dot" />
          <span className="set-line__cursor-beam" />
        </span>
        <span className="set-line__end set-line__end--l" aria-hidden="true">
          <span className="set-line__end-cap" />
        </span>
        <span className="set-line__end set-line__end--r" aria-hidden="true">
          <span className="set-line__end-cap" />
        </span>
      </div>
    </div>
  )
}
