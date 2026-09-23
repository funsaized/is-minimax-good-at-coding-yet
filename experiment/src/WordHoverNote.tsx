import { useEffect, useState, type CSSProperties } from 'react'
import type { VoiceId } from './App'
import type { WordId } from './notes'

type WordHoverNoteProps = {
  active: WordId
  hover: WordId | null
  voice: VoiceId
}

/**
 * WordHoverNote — a small compositor's note that hovers beside the
 * active word in the hero. Surfaces the editorial copy behind each
 * marked word (m³ / good at / yet?) without re-arranging the layout.
 *
 * The note follows the active word's button position when the user
 * hovers or tabs to a token; it fades in and out softly and respects
 * reduced-motion preferences.
 */
const HOV_NOTE: Record<WordId, { glyph: string; mark: string; title: string; gloss: string }> = {
  m3: {
    glyph: '⌇',
    mark: 'stet',
    title: 'keep the fingerprint',
    gloss: 'a habit, not a name — the maker is a habit.',
  },
  good: {
    glyph: '∧',
    mark: 'caret',
    title: 'choose one clear thing',
    gloss: 'confidence is generous — make room for attention.',
  },
  yet: {
    glyph: '?',
    mark: 'query',
    title: 'protect the pause',
    gloss: 'the space before an answer is where the reader arrives.',
  },
}

export function WordHoverNote({ active, hover, voice }: WordHoverNoteProps) {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null)
  const [shown, setShown] = useState(false)
  const [reduceMotion, setReduceMotion] = useState(false)
  const [isCoarse, setIsCoarse] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduceMotion(reduce.matches)
    const coarse = window.matchMedia('(hover: none)')
    setIsCoarse(coarse.matches)
    const onReduce = () => setReduceMotion(reduce.matches)
    const onCoarse = () => setIsCoarse(coarse.matches)
    reduce.addEventListener('change', onReduce)
    coarse.addEventListener('change', onCoarse)
    return () => {
      reduce.removeEventListener('change', onReduce)
      coarse.removeEventListener('change', onCoarse)
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const id = window.setTimeout(() => setShown(true), 80)
    return () => window.clearTimeout(id)
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined' || isCoarse) return
    const handler = () => {
      const id = hover ?? active
      const node = document.querySelector<HTMLButtonElement>(`[data-word-token="${id}"]`)
      if (!node) {
        setPos(null)
        return
      }
      const rect = node.getBoundingClientRect()
      setPos({
        x: rect.left + rect.width / 2 + window.scrollX,
        y: rect.top + window.scrollY,
      })
    }
    handler()
    window.addEventListener('resize', handler)
    window.addEventListener('scroll', handler, { passive: true })
    return () => {
      window.removeEventListener('resize', handler)
      window.removeEventListener('scroll', handler)
    }
  }, [active, hover, isCoarse])

  const effective = hover ?? active
  const note = HOV_NOTE[effective]
  const tone = voice === 'quiet' ? 'var(--quiet)' : voice === 'human' ? 'var(--human)' : 'var(--bold)'
  const accent = effective === 'm3' ? 'var(--quiet)' : effective === 'good' ? 'var(--human)' : 'var(--bold)'

  if (isCoarse || !pos) return null

  const style = {
    top: `${pos.y}px`,
    left: `${pos.x}px`,
    '--note-voice-tone': tone,
    '--note-word-tone': accent,
  } as CSSProperties

  return (
    <aside
      className={`word-hover-note word-hover-note--${voice} word-hover-note--${effective} ${
        shown ? 'is-shown' : ''
      } ${reduceMotion ? 'is-quiet' : ''} ${hover ? 'is-hover' : 'is-active'}`}
      style={style}
      aria-hidden="true"
      data-word-note={effective}
    >
      <span className="word-hover-note__cord" aria-hidden="true">
        <svg viewBox="0 0 14 26" preserveAspectRatio="none" aria-hidden="true">
          <path
            d="M 7 6 Q 4 12 7 18 T 7 24"
            fill="none"
            stroke="currentColor"
            strokeWidth=".55"
            strokeLinecap="round"
            strokeDasharray="1 2"
            opacity=".7"
          />
          <circle cx="7" cy="6" r="1.2" fill="currentColor" />
        </svg>
      </span>

      <span className="word-hover-note__head" aria-hidden="true">
        <em className="word-hover-note__glyph">{note.glyph}</em>
        <span className="word-hover-note__mark">{note.mark}</span>
      </span>

      <em className="word-hover-note__title">{note.title}</em>
      <span className="word-hover-note__gloss">{note.gloss}</span>

      <span className="word-hover-note__rule" aria-hidden="true">
        <svg viewBox="0 0 80 1" preserveAspectRatio="none">
          <line x1="0" y1="0.5" x2="80" y2="0.5" stroke="currentColor" strokeWidth=".4" strokeDasharray="1.2 2.4" opacity=".55" />
        </svg>
      </span>

      <span className="word-hover-note__extra" aria-hidden="true">
        <em>compositor's note</em>
        <span className="word-hover-note__extra-dot">·</span>
        <em>folio i</em>
      </span>

      <span className="sr-only">{`${note.mark} · ${note.title}. ${note.gloss}`}</span>
    </aside>
  )
}