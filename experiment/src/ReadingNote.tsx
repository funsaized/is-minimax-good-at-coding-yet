import { useEffect, useId, useRef, useState, type CSSProperties } from 'react'
import type { VoiceId } from './App'

type ReadingNoteProps = {
  children: React.ReactNode
  voice?: VoiceId
  align?: 'left' | 'center' | 'right'
  ornament?: 'dots' | 'rule' | 'bead' | 'none'
  size?: 'sm' | 'md' | 'lg'
  tone?: 'paper' | 'voice'
  caption?: string
  delayMs?: number
}

export function ReadingNote({
  children,
  voice,
  align = 'center',
  ornament = 'dots',
  size = 'md',
  tone = 'voice',
  caption,
  delayMs = 0,
}: ReadingNoteProps) {
  const ref = useRef<HTMLParagraphElement | null>(null)
  const noteId = useId().replace(/:/g, '')
  const [shown, setShown] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const node = ref.current
    if (!node) return
    if (reduceMotion.matches) {
      setShown(true)
      return
    }
    if (typeof IntersectionObserver === 'undefined') {
      setShown(true)
      return
    }
    const obs = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            window.setTimeout(() => setShown(true), delayMs)
            obs.disconnect()
            return
          }
        }
      },
      { threshold: 0.4, rootMargin: '0px 0px -10% 0px' },
    )
    obs.observe(node)
    return () => obs.disconnect()
  }, [delayMs])

  const style = voice
    ? ({ '--note-tone': `var(--${voice})` } as CSSProperties)
    : undefined

  return (
    <figure
      ref={ref}
      className={[
        'reading-note',
        `reading-note--${align}`,
        `reading-note--${size}`,
        `reading-note--tone-${tone}`,
        shown ? 'is-shown' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      style={style}
      aria-label={typeof children === 'string' ? (children as string) : caption}
    >
      <span className="reading-note__rule reading-note__rule--pre" aria-hidden="true">
        <span className="reading-note__rule-line" />
        <svg className="reading-note__rule-bead" viewBox="0 0 8 8" aria-hidden="true">
          <circle cx="4" cy="4" r="2" fill="currentColor" opacity=".85" />
          <circle cx="4" cy="4" r="3.4" fill="none" stroke="currentColor" strokeWidth=".45" opacity=".55" />
        </svg>
        <span className="reading-note__rule-line" />
      </span>

      <span className={`reading-note__ornament reading-note__ornament--${ornament} reading-note__ornament--pre`} aria-hidden="true">
        <OrnamentGlyph kind={ornament} id={`${noteId}-pre`} side="pre" />
      </span>

      <em className="reading-note__line">
        <span className="reading-note__line-inner">{children}</span>
      </em>

      <span className={`reading-note__ornament reading-note__ornament--${ornament} reading-note__ornament--post`} aria-hidden="true">
        <OrnamentGlyph kind={ornament} id={`${noteId}-post`} side="post" />
      </span>

      <span className="reading-note__rule reading-note__rule--post" aria-hidden="true">
        <span className="reading-note__rule-line" />
        <svg className="reading-note__rule-bead" viewBox="0 0 8 8" aria-hidden="true">
          <circle cx="4" cy="4" r="2" fill="currentColor" opacity=".85" />
          <circle cx="4" cy="4" r="3.4" fill="none" stroke="currentColor" strokeWidth=".45" opacity=".55" />
        </svg>
        <span className="reading-note__rule-line" />
      </span>

      {caption && <figcaption className="reading-note__caption">{caption}</figcaption>}
    </figure>
  )
}

function OrnamentGlyph({ kind, id, side }: { kind: ReadingNoteProps['ornament']; id: string; side: 'pre' | 'post' }) {
  if (kind === 'none') return null
  if (kind === 'rule') {
    return (
      <svg viewBox="0 0 80 6" preserveAspectRatio="none" aria-hidden="true">
        <line
          x1={side === 'pre' ? 80 : 0}
          y1="3"
          x2={side === 'pre' ? 0 : 80}
          y2="3"
          stroke="currentColor"
          strokeWidth=".45"
          strokeLinecap="round"
          strokeDasharray="1.4 2.4"
          opacity=".6"
        />
      </svg>
    )
  }
  if (kind === 'bead') {
    return (
      <svg viewBox="0 0 12 12" aria-hidden="true">
        <circle cx="6" cy="6" r="2.2" fill="currentColor" opacity=".9" />
        <circle cx="6" cy="6" r="4" fill="none" stroke="currentColor" strokeWidth=".4" strokeDasharray=".6 1.2" opacity=".7" />
        <circle cx="6" cy="6" r=".7" fill="var(--night)" />
      </svg>
    )
  }
  // dots
  return (
    <svg viewBox="0 0 18 4" aria-hidden="true">
      <circle cx={side === 'pre' ? 13 : 5} cy="2" r=".9" fill="currentColor" opacity=".9" />
      <circle cx={side === 'pre' ? 9 : 9} cy="2" r="1.4" fill="currentColor" opacity=".95" />
      <circle cx={side === 'pre' ? 5 : 13} cy="2" r=".9" fill="currentColor" opacity=".9" />
    </svg>
  )
}
