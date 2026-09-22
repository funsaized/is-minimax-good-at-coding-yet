import { useEffect, useId, useState, type CSSProperties } from 'react'

type HeroOverscoreProps = {
  title: string
  eyebrow: string
  onArrive?: () => void
}

export function HeroOverscore({ title, eyebrow, onArrive }: HeroOverscoreProps) {
  const baseId = useId().replace(/:/g, '')
  const [reduceMotion, setReduceMotion] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduceMotion(mq.matches)
    const onChange = () => setReduceMotion(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    if (!onArrive) return
    const id = window.setTimeout(onArrive, reduceMotion ? 0 : 1100)
    return () => window.clearTimeout(id)
  }, [onArrive, reduceMotion])

  const style = { '--overscore-id': baseId } as CSSProperties
  const noMotion = reduceMotion

  return (
    <figure
      className={`hero-overscore ${noMotion ? 'is-static' : ''}`}
      style={style}
      aria-hidden="true"
    >
      <svg
        className="hero-overscore__svg"
        viewBox="0 0 1200 64"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={`${baseId}-rule`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
            <stop offset="14%" stopColor="currentColor" stopOpacity=".65" />
            <stop offset="50%" stopColor="currentColor" stopOpacity="1" />
            <stop offset="86%" stopColor="currentColor" stopOpacity=".65" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
          <linearGradient id={`${baseId}-ghost`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
            <stop offset="35%" stopColor="currentColor" stopOpacity=".22" />
            <stop offset="50%" stopColor="currentColor" stopOpacity=".34" />
            <stop offset="65%" stopColor="currentColor" stopOpacity=".22" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
        </defs>

        <line
          className="hero-overscore__ghost"
          x1="20"
          y1="20"
          x2="1180"
          y2="20"
          stroke={`url(#${baseId}-ghost)`}
          strokeWidth="1.6"
          strokeLinecap="round"
        />

        <path
          className="hero-overscore__stroke"
          d="M 24 30 C 220 22, 460 18, 600 22 S 980 38, 1176 30"
          fill="none"
          stroke={`url(#${baseId}-rule)`}
          strokeWidth="2"
          strokeLinecap="round"
        />

        <g className="hero-overscore__cap hero-overscore__cap--l">
          <circle cx="24" cy="30" r="3.4" fill="currentColor" />
          <circle cx="24" cy="30" r="6.4" fill="none" stroke="currentColor" strokeWidth=".6" strokeDasharray=".9 1.6" />
          <path d="M16 30h6" stroke="currentColor" strokeWidth=".5" strokeLinecap="round" opacity=".7" />
        </g>

        <g className="hero-overscore__cap hero-overscore__cap--r">
          <circle cx="1176" cy="30" r="3.4" fill="currentColor" />
          <circle cx="1176" cy="30" r="6.4" fill="none" stroke="currentColor" strokeWidth=".6" strokeDasharray=".9 1.6" />
          <path d="M1178 30h6" stroke="currentColor" strokeWidth=".5" strokeLinecap="round" opacity=".7" />
        </g>

        <g className="hero-overscore__beads">
          <circle cx="320" cy="24" r="1.6" fill="currentColor" />
          <circle cx="600" cy="22" r="2.2" fill="currentColor" />
          <circle cx="880" cy="26" r="1.6" fill="currentColor" />
        </g>

        <g className="hero-overscore__label">
          <text
            x="600"
            y="56"
            textAnchor="middle"
            fontFamily="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"
            fontSize="9"
            letterSpacing="3.5"
            fill="currentColor"
          >
            {eyebrow.toUpperCase()}
          </text>
        </g>
      </svg>

      <figcaption className="sr-only">{`${title} — ${eyebrow}`}</figcaption>
    </figure>
  )
}
