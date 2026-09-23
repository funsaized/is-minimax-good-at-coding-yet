import { useEffect, useState, type CSSProperties } from 'react'
import type { VoiceId } from './App'

type ConstellationProps = {
  voice: VoiceId
  pullSignal: number
}

const FOLIOS = [
  { id: 'question', ratio: 0.04 },
  { id: 'press', ratio: 0.22 },
  { id: 'notes', ratio: 0.36 },
  { id: 'specimen', ratio: 0.5 },
  { id: 'answer', ratio: 0.66 },
  { id: 'colophon', ratio: 0.8 },
  { id: 'pouch', ratio: 0.94 },
]

/**
 * Constellation — a faint background curve that ties the
 * three marked words across the page. A single SVG path
 * traces through fixed positions; three "star" nodes mark
 * the marked words. Visible only as the reader scrolls past
 * the question folio.
 */
export function Constellation({ voice, pullSignal }: ConstellationProps) {
  const [progress, setProgress] = useState(0)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    let raf = 0
    const compute = () => {
      const doc = document.documentElement
      const scrolled = window.scrollY
      const total = Math.max(1, doc.scrollHeight - window.innerHeight)
      const ratio = Math.max(0, Math.min(1, scrolled / total))
      setProgress(ratio)
      setRevealed(ratio > 0.04)
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

  const style = {
    '--constellation-progress': progress.toFixed(3),
  } as CSSProperties

  const fadeIn = Math.min(1, Math.max(0, (progress - 0.04) * 4))
  const fadeOut = Math.min(1, Math.max(0, (1 - progress) * 6))

  const reveal = fadeIn * fadeOut

  return (
    <div
      className={`constellation constellation--voice-${voice} ${revealed ? 'is-revealed' : ''}`}
      style={{ ...style, opacity: reveal * 0.75 }}
      aria-hidden="true"
      key={`const-${pullSignal}`}
    >
      <svg
        className="constellation__svg"
        viewBox="0 0 1200 900"
        preserveAspectRatio="xMidYMid slice"
        focusable="false"
      >
        <defs>
          <linearGradient id="constellation-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
            <stop offset="20%" stopColor="currentColor" stopOpacity=".55" />
            <stop offset="50%" stopColor="currentColor" stopOpacity=".85" />
            <stop offset="80%" stopColor="currentColor" stopOpacity=".55" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
        </defs>

        <path
          className="constellation__path"
          d="M 60 280 C 280 200, 460 360, 600 320 S 880 220, 1140 360 S 1100 620, 720 640 S 320 720, 80 660"
          stroke="url(#constellation-grad)"
          style={{
            strokeDashoffset: 0,
            opacity: 0.6,
          }}
        />

        <path
          className="constellation__path"
          d="M 80 420 C 360 540, 560 380, 720 460 S 1020 540, 1140 480"
          stroke="url(#constellation-grad)"
          style={{ opacity: 0.32 }}
        />

        {/* three "stars" — one per marked word */}
        <g className="constellation__stars" aria-hidden="true">
          <g className="constellation__star constellation__star--m3">
            <circle cx="180" cy="300" r="2.4" fill="currentColor" opacity=".85" />
            <circle cx="180" cy="300" r="6" fill="none" stroke="currentColor" strokeWidth=".35" opacity=".45" />
          </g>
          <g className="constellation__star constellation__star--good">
            <circle cx="600" cy="340" r="2.4" fill="currentColor" opacity=".85" />
            <circle cx="600" cy="340" r="6" fill="none" stroke="currentColor" strokeWidth=".35" opacity=".45" />
          </g>
          <g className="constellation__star constellation__star--yet">
            <circle cx="1020" cy="380" r="2.4" fill="currentColor" opacity=".85" />
            <circle cx="1020" cy="380" r="6" fill="none" stroke="currentColor" strokeWidth=".35" opacity=".45" />
          </g>
        </g>

        {/* tiny secondary stars */}
        <g className="constellation__dust" fill="currentColor" aria-hidden="true">
          {FOLIOS.map((f, i) => {
            const cx = 90 + (i * 1020) / FOLIOS.length + Math.sin(i * 3.1) * 12
            const cy = 120 + Math.cos(i * 2.7) * 36 + (i % 3) * 80
            return (
              <circle
                key={`dust-${f.id}`}
                cx={cx}
                cy={cy}
                r={i % 2 === 0 ? 1.1 : 0.7}
                opacity={0.35}
              />
            )
          })}
        </g>
      </svg>
    </div>
  )
}
