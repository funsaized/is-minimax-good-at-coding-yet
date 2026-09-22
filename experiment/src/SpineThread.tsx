import { useEffect, useId, useRef, useState, type CSSProperties } from 'react'
import type { VoiceId } from './App'

type FolioRef = { id: string; index: string; label: string }

type SpineThreadProps = {
  folios: FolioRef[]
  activeId: string
  voice: VoiceId
  pullSignal: number
  isPulling: boolean
}

const PAD_TOP = 0.045
const PAD_BOT = 0.06

export function SpineThread({ folios, activeId, voice, pullSignal, isPulling }: SpineThreadProps) {
  const [progress, setProgress] = useState(0)
  const [tighten, setTighten] = useState(0)
  const [reducedMotion, setReducedMotion] = useState(false)
  const tightenId = useId().replace(/:/g, '')
  const lastPull = useRef(pullSignal)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mq.matches)
    const onChange = () => setReducedMotion(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

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
  }, [])

  useEffect(() => {
    if (lastPull.current === pullSignal) return
    lastPull.current = pullSignal
    if (reducedMotion) return
    setTighten(p => p + 1)
    const id = window.setTimeout(() => setTighten(p => p), 900)
    return () => window.clearTimeout(id)
  }, [pullSignal, reducedMotion])

  const style = {
    '--spine-tone': `var(--${voice})`,
  } as CSSProperties

  const tickPositions = folios.map((_f, idx) => {
    const denom = Math.max(folios.length - 1, 1)
    return PAD_TOP + ((idx / denom) * (1 - PAD_TOP - PAD_BOT))
  })

  return (
    <div
      className={`spine-thread ${isPulling ? 'is-pulling' : ''} ${reducedMotion ? 'is-quiet' : ''}`}
      style={style}
      aria-hidden="true"
    >
      <svg
        className="spine-thread__svg"
        viewBox="0 0 64 1000"
        preserveAspectRatio="none"
        role="presentation"
      >
        <defs>
          <linearGradient id={`spine-fade-${tightenId}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--spine-tone)" stopOpacity=".0" />
            <stop offset="6%" stopColor="var(--spine-tone)" stopOpacity=".55" />
            <stop offset="92%" stopColor="var(--spine-tone)" stopOpacity=".62" />
            <stop offset="100%" stopColor="var(--spine-tone)" stopOpacity=".0" />
          </linearGradient>
        </defs>

        <path
          className="spine-thread__line"
          d="M32 0 L32 1000"
          fill="none"
          stroke={`url(#spine-fade-${tightenId})`}
          strokeWidth=".6"
        />

        <path
          className="spine-thread__dash"
          d="M32 0 L32 1000"
          fill="none"
          stroke="rgba(245, 238, 216, .18)"
          strokeWidth=".45"
          strokeDasharray="1.4 2.6"
        />

        <g className="spine-thread__knots">
          {folios.map((f, idx) => {
            const y = tickPositions[idx] * 1000
            const isActive = f.id === activeId
            const isPast = tickPositions[idx] < progress
            return (
              <g
                key={f.id}
                className={`spine-thread__knot ${isActive ? 'is-active' : ''} ${isPast ? 'is-past' : ''}`}
                transform={`translate(32 ${y})`}
              >
                <circle className="spine-thread__knot-ring" r="6" fill="none" stroke="currentColor" strokeWidth=".4" opacity=".45" />
                <circle className="spine-thread__knot-arc" r="3.2" fill="none" stroke="currentColor" strokeWidth=".7" />
                <circle className="spine-thread__knot-bead" r="1.4" fill="currentColor" />
                <circle className="spine-thread__knot-eye" r=".55" fill="var(--night)" />
                <text
                  className="spine-thread__knot-num"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  dy="-12"
                  fill="currentColor"
                  fontFamily="ui-monospace, 'SFMono-Regular', Menlo, monospace"
                  fontSize="3.4"
                  letterSpacing=".6"
                  opacity=".7"
                >
                  {f.index}
                </text>
              </g>
            )
          })}
        </g>

        <g className="spine-thread__tied">
          <path
            d="M32 950 q-6 6 -10 12 q4 -2 8 -1 q-2 3 -1 6"
            fill="none"
            stroke="currentColor"
            strokeWidth=".65"
            strokeLinecap="round"
            opacity=".7"
          />
          <path
            d="M32 950 q6 6 10 12 q-4 -2 -8 -1 q2 3 1 6"
            fill="none"
            stroke="currentColor"
            strokeWidth=".65"
            strokeLinecap="round"
            opacity=".7"
          />
          <circle cx="32" cy="948" r="1.4" fill="currentColor" />
        </g>

        <g
          className="spine-thread__tug"
          key={`tug-${tighten}`}
          transform={`translate(32 ${progress * 1000})`}
        >
          <circle r="3" fill="none" stroke="currentColor" strokeWidth=".4" opacity=".55" />
          <circle r="1.2" fill="currentColor" />
        </g>
      </svg>

      <span className="spine-thread__caption">
        <em>bound</em>
      </span>
    </div>
  )
}
