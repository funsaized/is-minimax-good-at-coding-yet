import { useEffect, useState } from 'react'

const FRAGMENT = 'a small, stubborn question · composed, not generated'

export function Watermark() {
  const [scrolled, setScrolled] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      if (max <= 0) {
        setScrolled(0)
        return
      }
      setScrolled(Math.max(0, Math.min(1, window.scrollY / max)))
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const opacity = Math.max(0.022, 0.058 * (1 - scrolled * 1.6))

  return (
    <div className="watermark" aria-hidden="true" style={{ opacity }}>
      <svg className="watermark__seal" viewBox="0 0 420 420">
        <circle cx="210" cy="210" r="186" fill="none" stroke="currentColor" strokeWidth=".7" />
        <circle cx="210" cy="210" r="158" fill="none" stroke="currentColor" strokeWidth=".35" strokeDasharray="2 6" />
        <circle cx="210" cy="210" r="120" fill="none" stroke="currentColor" strokeWidth=".3" strokeDasharray="1 4" />
        <g aria-hidden="true">
          <line x1="210" y1="14" x2="210" y2="28" stroke="currentColor" strokeWidth=".6" />
          <line x1="210" y1="392" x2="210" y2="406" stroke="currentColor" strokeWidth=".6" />
          <line x1="14" y1="210" x2="28" y2="210" stroke="currentColor" strokeWidth=".6" />
          <line x1="392" y1="210" x2="406" y2="210" stroke="currentColor" strokeWidth=".6" />
          <circle cx="210" cy="14" r="1.6" fill="currentColor" />
          <circle cx="210" cy="406" r="1.6" fill="currentColor" />
          <circle cx="14" cy="210" r="1.6" fill="currentColor" />
          <circle cx="406" cy="210" r="1.6" fill="currentColor" />
        </g>
        <text
          x="210"
          y="296"
          textAnchor="middle"
          fontFamily="Georgia, 'Iowan Old Style', serif"
          fontStyle="italic"
          fontWeight="400"
          fontSize="92"
          fill="currentColor"
          letterSpacing="-.04em"
        >
          m³
        </text>
        <text
          x="210"
          y="148"
          textAnchor="middle"
          fontFamily="ui-monospace, monospace"
          fontSize="9"
          letterSpacing="6"
          fill="currentColor"
        >
          PRESS · BROADSIDE
        </text>
        <text
          x="210"
          y="328"
          textAnchor="middle"
          fontFamily="ui-monospace, monospace"
          fontSize="8"
          letterSpacing="3.6"
          fill="currentColor"
        >
          SET · ON · TODAY
        </text>
        <line x1="120" y1="206" x2="170" y2="206" stroke="currentColor" strokeWidth=".5" />
        <line x1="250" y1="206" x2="300" y2="206" stroke="currentColor" strokeWidth=".5" />
        <line x1="120" y1="214" x2="170" y2="214" stroke="currentColor" strokeWidth=".3" opacity=".6" />
        <line x1="250" y1="214" x2="300" y2="214" stroke="currentColor" strokeWidth=".3" opacity=".6" />
        <circle cx="210" cy="210" r="2.4" fill="currentColor" opacity=".7" />
        <circle cx="210" cy="210" r="5" fill="none" stroke="currentColor" strokeWidth=".4" opacity=".5" />
      </svg>
      <span className="watermark__line">
        <span className="watermark__line-rule" aria-hidden="true" />
        <span className="watermark__line-text">{FRAGMENT}</span>
        <span className="watermark__line-rule" aria-hidden="true" />
      </span>
    </div>
  )
}