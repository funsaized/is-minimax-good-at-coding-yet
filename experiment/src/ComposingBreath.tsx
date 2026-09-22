import { useEffect, useRef, useState } from 'react'
import { ComposingRule } from './ComposingRule'
import type { VoiceId } from './App'

type ComposingBreathProps = {
  voice: VoiceId
  count?: number
}

export function ComposingBreath({ voice, count }: ComposingBreathProps) {
  const total = count ?? 6
  const labelIndex = `${Math.min(total, 6)} of ${total}`
  const ref = useRef<HTMLDivElement | null>(null)
  const [active, setActive] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setActive(true)
      return
    }
    const node = ref.current
    if (!node) {
      setActive(true)
      return
    }
    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) setActive(entry.isIntersecting)
      },
      { rootMargin: '120px 0px 120px 0px', threshold: 0.01 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`composing-breath composing-breath--${voice} ${active ? 'is-active' : 'is-idle'}`}
      role="presentation"
      aria-hidden="true"
      data-breath={labelIndex}
    >
      <span className="composing-breath__pin composing-breath__pin--l" aria-hidden="true">
        <svg viewBox="0 0 14 14">
          <circle cx="7" cy="7" r="5.4" fill="none" stroke="currentColor" strokeWidth=".55" opacity=".85" />
          <circle cx="7" cy="7" r="2.2" fill="currentColor" opacity=".75" />
          <circle cx="7" cy="7" r=".7" fill="var(--night)" />
        </svg>
      </span>
      <span className="composing-breath__rule composing-breath__rule--l" aria-hidden="true" />
      <span className="composing-breath__line" aria-hidden="true">
        {active ? <ComposingRule voice={voice} /> : <span className="composing-breath__line-stub" />}
      </span>
      <span className="composing-breath__rule composing-breath__rule--r" aria-hidden="true" />
      <span className="composing-breath__pin composing-breath__pin--r" aria-hidden="true">
        <svg viewBox="0 0 14 14">
          <circle cx="7" cy="7" r="5.4" fill="none" stroke="currentColor" strokeWidth=".55" opacity=".85" />
          <circle cx="7" cy="7" r="2.2" fill="currentColor" opacity=".75" />
          <circle cx="7" cy="7" r=".7" fill="var(--night)" />
        </svg>
      </span>
    </div>
  )
}