import { useState, type CSSProperties } from 'react'
import type { VoiceId } from './Press'

type Folio = {
  id: string
  index: string
  label: string
}

const FOLIOS: Folio[] = [
  { id: 'question', index: 'i', label: 'the question' },
  { id: 'press', index: 'ii', label: 'the press bed' },
  { id: 'contents', index: 'iii', label: 'the contents' },
  { id: 'day', index: 'iii·', label: 'the day sheet' },
  { id: 'note', index: '·', label: 'a folded slip' },
  { id: 'proof', index: 'iv', label: 'the proof' },
  { id: 'pressings', index: 'v', label: 'the pressings' },
  { id: 'notes', index: 'vi', label: 'the marginalia' },
  { id: 'answer', index: 'viii', label: 'the answer' },
]

const VOICE_TONE: Record<VoiceId, string> = {
  quiet: 'var(--blue)',
  human: 'var(--coral)',
  bold: 'var(--acid)',
}

type PressSpineProps = {
  activeId: string
  voice: VoiceId
}

export function PressSpine({ activeId, voice }: PressSpineProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const activeIndex = Math.max(0, FOLIOS.findIndex(f => f.id === activeId))
  const activeFolio = FOLIOS[activeIndex] ?? FOLIOS[0]
  const tone = VOICE_TONE[voice]
  const style = { '--spine-tone': tone } as CSSProperties

  return (
    <nav className={`press-spine press-spine--${voice}`} style={style} aria-label="Folio binding thread">
      <span className="sr-only">
        The press is bound across {FOLIOS.length} folios. Now reading folio {activeFolio.index}: {activeFolio.label}.
      </span>
      <div className="press-spine__thread" aria-hidden="true">
        <span className="press-spine__thread-line" />
        <span className="press-spine__thread-cap press-spine__thread-cap--top">
          <svg viewBox="0 0 12 12" aria-hidden="true">
            <path d="M2 6h8M6 2v8" stroke="currentColor" strokeWidth=".7" strokeLinecap="round" />
          </svg>
        </span>
        <span className="press-spine__thread-cap press-spine__thread-cap--bot">
          <svg viewBox="0 0 12 12" aria-hidden="true">
            <path d="M2 6h8M6 2v8" stroke="currentColor" strokeWidth=".7" strokeLinecap="round" />
          </svg>
        </span>
      </div>
      <ol className="press-spine__folios">
        {FOLIOS.map((folio, index) => {
          const isActive = index === activeIndex
          const isPast = index < activeIndex
          const isHovered = hoveredId === folio.id
          return (
            <li
              key={folio.id}
              className={`press-spine__folio ${isActive ? 'is-active' : ''} ${isPast ? 'is-past' : ''}`}
              style={{ '--folio-i': index } as CSSProperties}
              onMouseEnter={() => setHoveredId(folio.id)}
              onMouseLeave={() => setHoveredId(null)}
              onFocus={() => setHoveredId(folio.id)}
              onBlur={() => setHoveredId(null)}
            >
              <a
                href={`#${folio.id}`}
                className="press-spine__knot"
                aria-label={`Jump to folio ${folio.index}: ${folio.label}`}
                aria-current={isActive ? 'location' : undefined}
              >
                <svg viewBox="0 0 24 24" className="press-spine__knot-svg" aria-hidden="true">
                  <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth=".7" />
                  <circle cx="12" cy="12" r="5.6" fill="none" stroke="currentColor" strokeWidth=".45" strokeDasharray="1 1.8" opacity=".7" />
                  <circle cx="12" cy="12" r="2.2" fill="currentColor" className="press-spine__knot-core" />
                  <path d="M12 3v3M12 18v3M3 12h3M18 12h3" stroke="currentColor" strokeWidth=".6" strokeLinecap="round" className="press-spine__knot-cross" />
                </svg>
              </a>
              <span className={`press-spine__caption ${isActive || isHovered ? 'is-visible' : ''}`}>
                <span className="press-spine__caption-index">{folio.index}</span>
                <span className="press-spine__caption-label">{folio.label}</span>
              </span>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
