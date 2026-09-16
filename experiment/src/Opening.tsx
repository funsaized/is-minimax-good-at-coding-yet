import { useId, useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import type { VoiceId } from './Press'

type OpeningProps = {
  voice: VoiceId
  setToday: string
  children: ReactNode
}

const VOICE_TONE: Record<VoiceId, string> = {
  quiet: 'var(--blue)',
  human: 'var(--coral)',
  bold: 'var(--acid)',
}

const VOICE_NAME: Record<VoiceId, string> = {
  quiet: 'quiet cut',
  human: 'human hand',
  bold: 'bold signal',
}

export function Opening({ voice, setToday, children }: OpeningProps) {
  const baseId = useId().replace(/:/g, '')
  const paperId = `opening-paper-${baseId}`
  const creaseId = `opening-crease-${baseId}`
  const rootRef = useRef<HTMLDivElement>(null)
  const [revealed, setRevealed] = useState(false)
  const style = {
    '--opening-tone': VOICE_TONE[voice],
  } as CSSProperties

  useEffect(() => {
    const node = rootRef.current
    if (!node) return
    if (!('IntersectionObserver' in window)) {
      setRevealed(true)
      return
    }
    const observer = new IntersectionObserver(
      entries => {
        if (entries.some(entry => entry.isIntersecting)) {
          setRevealed(true)
          observer.disconnect()
        }
      },
      { threshold: 0.06, rootMargin: '0px 0px -4% 0px' },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={rootRef}
      className={`opening opening--${voice} ${revealed ? 'is-revealed' : ''}`}
      style={style}
      aria-label={`m³ press · folio i · the opening broadside · set in ${VOICE_NAME[voice]} on ${setToday}`}
    >
      <svg className="opening__defs" viewBox="0 0 1200 1200" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <filter id={paperId} x="-2%" y="-2%" width="104%" height="104%">
            <feTurbulence type="fractalNoise" baseFrequency="0.82" numOctaves="2" seed="31" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 .14  0 0 0 0 .12  0 0 0 0 .19  0 0 0 .035 0" />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
          <linearGradient id={creaseId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
            <stop offset="32%" stopColor="currentColor" stopOpacity=".18" />
            <stop offset="50%" stopColor="currentColor" stopOpacity=".32" />
            <stop offset="68%" stopColor="currentColor" stopOpacity=".18" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      <span className="opening__paper" aria-hidden="true">
        <svg viewBox="0 0 1200 1200" preserveAspectRatio="none">
          <rect x="0" y="0" width="1200" height="1200" filter={`url(#${paperId})`} opacity=".045" />
        </svg>
      </span>

      <header className="opening__plate" aria-hidden="true">
        <span className="opening__plate-mark">‡</span>
        <span className="opening__plate-title">
          m³ press
          <em>·</em>
          folio i
          <em>·</em>
          the opening
        </span>
        <span className="opening__plate-stamp">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="12" r="10.5" fill="none" stroke="currentColor" strokeWidth=".55" />
            <circle cx="12" cy="12" r="7" fill="none" stroke="currentColor" strokeWidth=".35" strokeDasharray=".8 1.6" opacity=".65" />
            <circle cx="12" cy="12" r="1.6" fill="currentColor" />
            <path d="M12 4v2M12 18v2M4 12h2M18 12h2" stroke="currentColor" strokeWidth=".5" strokeLinecap="round" opacity=".55" />
          </svg>
        </span>
        <span className="opening__plate-meta">
          set today · <em>{setToday}</em>
        </span>
        <span className="opening__plate-mark">‡</span>
      </header>

      <span className="opening__crease" aria-hidden="true">
        <svg viewBox="0 0 12 1200" preserveAspectRatio="none">
          <line x1="6" y1="0" x2="6" y2="1200" stroke={`url(#${creaseId})`} strokeWidth="1" strokeDasharray="1.4 3" strokeLinecap="round" />
        </svg>
        <span className="opening__crease-tag" aria-hidden="true">
          <span className="opening__crease-tag-rule" />
          <em>fold · here</em>
          <span className="opening__crease-tag-rule opening__crease-tag-rule--alt" />
        </span>
      </span>

      <div className="opening__stage">{children}</div>
    </div>
  )
}