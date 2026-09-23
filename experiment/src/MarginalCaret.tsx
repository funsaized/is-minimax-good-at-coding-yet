import { useEffect, useState, type CSSProperties } from 'react'
import type { VoiceId } from './App'

type MarginalCaretProps = {
  side?: 'left' | 'right'
  voice: VoiceId
  glyph?: string
  eyebrow: string
  note: string
  attribution?: string
  tone?: 'voice' | 'paper'
  offset?: number
}

/**
 * MarginalCaret — a small editorial note that hangs in the outer margin
 * of a folio. A single thin connector rule links the note to the folio
 * body; the note itself is set in italic with a small compositor glyph
 * (⌇ ∧ ? ∴ etc.) above. Fades in as the folio scrolls into view.
 */
export function MarginalCaret({
  side = 'right',
  voice,
  glyph = '∧',
  eyebrow,
  note,
  attribution,
  tone = 'voice',
  offset = 0,
}: MarginalCaretProps) {
  const [shown, setShown] = useState(false)
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
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setShown(true)
      return
    }
    const node = document.getElementById(`marginal-${eyebrow.replace(/\s+/g, '-').toLowerCase()}`)
    if (!node) {
      setShown(true)
      return
    }
    const obs = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShown(true)
            obs.unobserve(entry.target)
          }
        }
      },
      { threshold: 0.05, rootMargin: '0px 0px -8% 0px' },
    )
    obs.observe(node)
    return () => obs.disconnect()
  }, [eyebrow])

  const style = {
    '--caret-tone': tone === 'paper' ? 'var(--paper-soft)' : `var(--${voice})`,
    '--caret-offset': `${offset}px`,
  } as CSSProperties
  void style

  return (
    <aside
      id={`marginal-${eyebrow.replace(/\s+/g, '-').toLowerCase()}`}
      className={`marginal-caret marginal-caret--${side} marginal-caret--tone-${tone} ${
        shown ? 'is-shown' : ''
      } ${reduceMotion ? 'is-quiet' : ''}`}
      style={style}
      aria-hidden="true"
    >
      <span className="marginal-caret__rule">
        <svg viewBox="0 0 100 1" preserveAspectRatio="none" aria-hidden="true">
          <line
            x1={side === 'right' ? 0 : 100}
            y1="0.5"
            x2={side === 'right' ? 100 : 0}
            y2="0.5"
            stroke="currentColor"
            strokeWidth=".5"
            strokeDasharray="1 2.4"
            vectorEffect="non-scaling-stroke"
            opacity=".7"
          />
        </svg>
      </span>

      <span className="marginal-caret__body">
        <span className="marginal-caret__pin" aria-hidden="true">
          <svg viewBox="0 0 16 16" aria-hidden="true">
            <circle cx="8" cy="8" r="5.4" fill="none" stroke="currentColor" strokeWidth=".5" opacity=".75" />
            <circle cx="8" cy="8" r="2.2" fill="currentColor" opacity=".9" />
            <circle cx="8" cy="8" r=".8" fill="var(--night)" />
          </svg>
        </span>

        <span className="marginal-caret__head" aria-hidden="true">
          <em className="marginal-caret__glyph">{glyph}</em>
          <span className="marginal-caret__eyebrow">{eyebrow}</span>
        </span>

        <em className="marginal-caret__note">{note}</em>

        {attribution && <span className="marginal-caret__attr">— {attribution}</span>}
      </span>
    </aside>
  )
}