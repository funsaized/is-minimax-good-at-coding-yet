import { useEffect, useState, type CSSProperties } from 'react'

type ReadingTraceProps = {
  className?: string
}

type Trace = {
  id: string
  index: string
  label: string
  hint: string
}

const TRACE: Trace[] = [
  { id: 'question', index: 'i', label: 'the question', hint: 'a single line, set in three voices' },
  { id: 'press', index: 'ii', label: 'the press bed', hint: 'a lever, a stick, a pulled impression' },
  { id: 'contents', index: 'iii', label: 'this page, listed', hint: 'the press log · folio contents' },
  { id: 'day', index: 'iii·', label: 'the day sheet', hint: 'the hour, the week, the record' },
  { id: 'note', index: '·', label: 'a folded slip', hint: 'a short letter to the reader' },
  { id: 'proof', index: 'iv', label: 'the proof', hint: 'marks attached to the words' },
  { id: 'pressings', index: 'v', label: 'three pressings', hint: 'the same question, set again' },
  { id: 'notes', index: 'vi', label: 'the marginalia', hint: 'three things worth keeping' },
  { id: 'answer', index: 'viii', label: 'the answer', hint: 'folded once, then folded back' },
]

export function ReadingTrace({ className = '' }: ReadingTraceProps) {
  const [progress, setProgress] = useState(0)
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const compute = () => {
      const doc = document.documentElement
      const max = doc.scrollHeight - window.innerHeight
      if (max <= 0) {
        setProgress(0)
        return
      }
      const value = Math.max(0, Math.min(1, window.scrollY / max))
      setProgress(value)
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
    const elements = TRACE.map(item => document.getElementById(item.id)).filter(
      (element): element is HTMLElement => Boolean(element),
    )
    if (!('IntersectionObserver' in window)) return
    const observer = new IntersectionObserver(
      entries => {
        const visible = entries
          .filter(entry => entry.isIntersecting && entry.intersectionRatio > 0.05)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (visible[0]) {
          const idx = TRACE.findIndex(item => item.id === visible[0].target.id)
          if (idx >= 0) setActiveIndex(idx)
        }
      },
      { rootMargin: '-30% 0px -50% 0px', threshold: [0.05, 0.25, 0.6] },
    )
    elements.forEach(element => observer.observe(element))
    return () => observer.disconnect()
  }, [])

  const active = TRACE[activeIndex]
  const fillWidth = `${progress * 100}%`

  return (
    <div
      className={`reading-trace ${className}`}
      role="navigation"
      aria-label="Reading map"
      style={{ '--trace-progress': progress } as CSSProperties}
    >
      <span className="reading-trace__rule">
        <span className="reading-trace__fill" style={{ width: fillWidth }} />
      </span>
      <ol className="reading-trace__dots" aria-label="Folios in reading order">
        {TRACE.map((item, index) => (
          <li
            key={item.id}
            className={`reading-trace__dot-wrap ${index === activeIndex ? 'is-active' : ''} ${index < activeIndex ? 'is-past' : ''}`}
            style={{ left: `${(index / (TRACE.length - 1)) * 100}%` }}
          >
            <a
              href={`#${item.id}`}
              className={`reading-trace__dot ${index === activeIndex ? 'is-active' : ''} ${index < activeIndex ? 'is-past' : ''}`}
              aria-label={`Folio ${item.index} · ${item.label}`}
              aria-current={index === activeIndex ? 'location' : undefined}
            >
              <span className="reading-trace__dot-num">{item.index}</span>
              <span className="reading-trace__dot-label">{item.label}</span>
            </a>
          </li>
        ))}
      </ol>
      <span className="reading-trace__readout" aria-hidden="true">
        <span className="reading-trace__readout-eyebrow">now</span>
        <span className="reading-trace__readout-folio">{active.index}</span>
        <span className="reading-trace__readout-name">{active.label}</span>
      </span>
    </div>
  )
}