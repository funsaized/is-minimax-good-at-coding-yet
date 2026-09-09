import { useEffect, useState } from 'react'

type ThreadSection = {
  id: string
  index: string
  label: string
  note: string
}

const THREAD_SECTIONS: ThreadSection[] = [
  { id: 'question', index: 'i', label: 'question', note: 'the question is set' },
  { id: 'press-room', index: 'i·', label: 'press bay', note: 'the voice is pulled' },
  { id: 'compose', index: 'ii', label: 'compose', note: 'a working spread of type and margin' },
  { id: 'contents', index: 'iii', label: 'contents', note: 'the press log' },
  { id: 'note', index: '·', label: 'note', note: 'a folded slip' },
  { id: 'proof', index: 'iv', label: 'proof', note: 'the question, marked up' },
  { id: 'pressings', index: 'v', label: 'pressings', note: 'the question set three ways' },
  { id: 'notes', index: 'vi', label: 'marginalia', note: 'three things worth keeping' },
  { id: 'voices', index: 'vii', label: 'voices', note: 'the words try on clothes' },
  { id: 'answer', index: 'viii', label: 'answer', note: 'the answer is tipped in' },
]

export function MarginalThread({ activeId }: { activeId: string }) {
  const [progress, setProgress] = useState(0)

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

  const activeIndex = Math.max(0, THREAD_SECTIONS.findIndex(s => s.id === activeId))

  return (
    <aside className="marginal-thread" aria-hidden="true">
      <span className="marginal-thread__caption">a reading trace</span>
      <ol className="marginal-thread__list">
        <span
          className="marginal-thread__progress"
          style={{ height: `${progress * 100}%` }}
        />
        <span
          className="marginal-thread__bead"
          style={{ top: `calc(14px + (100% - 28px) * ${progress})` }}
          aria-hidden="true"
        />
        {THREAD_SECTIONS.map((section, index) => (
          <li
            key={section.id}
            className={`marginal-thread__item ${index === activeIndex ? 'is-active' : ''} ${index < activeIndex ? 'is-past' : ''}`}
          >
            <span className="marginal-thread__node">
              <span className="marginal-thread__dot" />
              <span className="marginal-thread__index">{section.index}</span>
            </span>
            <span className="marginal-thread__label">
              <strong>{section.label}</strong>
              <em>{section.note}</em>
            </span>
          </li>
        ))}
      </ol>
      <span className="marginal-thread__seal" aria-hidden="true">
        <svg viewBox="0 0 40 40">
          <circle cx="20" cy="20" r="14" fill="none" stroke="currentColor" strokeWidth="0.7" strokeDasharray="2 2" />
          <text x="20" y="23" textAnchor="middle" fontFamily="Georgia, serif" fontStyle="italic" fontSize="11" fill="currentColor">m³</text>
        </svg>
      </span>
      <span className="marginal-thread__foot">read at your own pace</span>
    </aside>
  )
}