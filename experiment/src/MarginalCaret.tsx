import { useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import type { WordId } from './notes'

type MarginalCaretProps = {
  active: WordId
  tokenRefs: { current: Partial<Record<WordId, HTMLSpanElement | null>> }
}

const TOKEN_INK: Record<WordId, string> = {
  m3: 'var(--acid)',
  good: 'var(--coral)',
  yet: 'var(--blue)',
}

const TOKEN_GLYPH: Record<WordId, 'stet' | 'caret' | 'query'> = {
  m3: 'stet',
  good: 'caret',
  yet: 'query',
}

export function MarginalCaret({ active, tokenRefs }: MarginalCaretProps) {
  const caretRef = useRef<HTMLSpanElement>(null)
  const [pos, setPos] = useState<{ top: number; left: number; height: number } | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const measure = () => {
      const node = tokenRefs.current[active]
      if (!node) {
        setPos(null)
        return
      }
      const rect = node.getBoundingClientRect()
      const plate = node.closest('.hero__plate') as HTMLElement | null
      if (!plate) {
        setPos(null)
        return
      }
      const plateRect = plate.getBoundingClientRect()
      const top = rect.top - plateRect.top + rect.height * 0.55
      const left = rect.left - plateRect.left - 36
      setPos({ top, left, height: rect.height })
    }
    measure()
    const id = window.requestAnimationFrame(() => {
      measure()
      setReady(true)
    })
    window.addEventListener('resize', measure)
    window.addEventListener('scroll', measure, { passive: true })
    const observer = new ResizeObserver(measure)
    if (tokenRefs.current[active]) observer.observe(tokenRefs.current[active]!)
    const fonts = (document as Document & { fonts?: { ready?: Promise<unknown> } }).fonts
    const readyPromise = fonts?.ready ?? Promise.resolve()
    readyPromise.then(measure)
    return () => {
      window.cancelAnimationFrame(id)
      window.removeEventListener('resize', measure)
      window.removeEventListener('scroll', measure)
      observer.disconnect()
    }
  }, [active, tokenRefs])

  if (!pos) return null
  const ink = TOKEN_INK[active]
  const glyph = TOKEN_GLYPH[active]
  const style = {
    transform: `translate(${pos.left}px, ${pos.top}px)`,
    color: ink,
    height: `${pos.height}px`,
  } as CSSProperties

  return (
    <span
      ref={caretRef}
      className={`marginal-caret marginal-caret--${glyph} ${ready ? 'is-ready' : ''}`}
      style={style}
      aria-hidden="true"
    >
      <svg className="marginal-caret__line" viewBox="0 0 30 100" preserveAspectRatio="none">
        <path
          d="M2 4 C 8 22, 22 38, 8 56 S 18 78, 4 96"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          className="marginal-caret__stroke"
        />
      </svg>
      <span className="marginal-caret__knot" aria-hidden="true">
        <svg viewBox="0 0 14 14">
          <circle cx="7" cy="7" r="3.2" fill="currentColor" opacity="0.85" />
          <circle cx="7" cy="7" r="5.6" fill="none" stroke="currentColor" strokeWidth="0.6" opacity="0.5" />
        </svg>
      </span>
      <span className="marginal-caret__glyph" aria-hidden="true">
        {glyph === 'stet' ? '⌇' : glyph === 'caret' ? '∧' : '?'}
      </span>
    </span>
  )
}
