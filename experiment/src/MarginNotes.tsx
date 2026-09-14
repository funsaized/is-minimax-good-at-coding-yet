import { type CSSProperties } from 'react'
import type { VoiceId } from './Press'

export type MarginNote = {
  id: string
  sectionId: string
  position: 'top' | 'mid' | 'low'
  glyph: 'caret' | 'query' | 'stet' | 'tick' | 'star' | 'arrow'
  ink: 'acid' | 'coral' | 'blue' | 'paper'
  text: string
  hand: 'left' | 'right'
}

const NOTES: MarginNote[] = [
  {
    id: 'mn-1',
    sectionId: 'question',
    position: 'top',
    glyph: 'caret',
    ink: 'coral',
    hand: 'left',
    text: 'a question that knows it is a question — that is the whole craft',
  },
  {
    id: 'mn-2',
    sectionId: 'press',
    position: 'mid',
    glyph: 'tick',
    ink: 'acid',
    hand: 'left',
    text: 'the lever is a kind of honesty',
  },
  {
    id: 'mn-3',
    sectionId: 'contents',
    position: 'mid',
    glyph: 'star',
    ink: 'paper',
    hand: 'left',
    text: 'a page that lists itself is a page you can find your way back into',
  },
  {
    id: 'mn-4',
    sectionId: 'day',
    position: 'low',
    glyph: 'arrow',
    ink: 'blue',
    hand: 'left',
    text: 'set today — that word earns its keep',
  },
  {
    id: 'mn-5',
    sectionId: 'proof',
    position: 'mid',
    glyph: 'query',
    ink: 'blue',
    hand: 'left',
    text: 'the marks are the editor thinking out loud',
  },
  {
    id: 'mn-6',
    sectionId: 'pressings',
    position: 'mid',
    glyph: 'stet',
    ink: 'coral',
    hand: 'left',
    text: 'three settings, one line — that is the whole game',
  },
  {
    id: 'mn-7',
    sectionId: 'notes',
    position: 'low',
    glyph: 'caret',
    ink: 'acid',
    hand: 'left',
    text: 'three things worth keeping is more than three things worth saying',
  },
]

type MarginNotesProps = {
  activeId: string
  voice: VoiceId
}

const GLYPH: Record<MarginNote['glyph'], string> = {
  caret: '∧',
  query: '?',
  stet: '⌇',
  tick: '✓',
  star: '✦',
  arrow: '→',
}

export function MarginNotes({ activeId, voice }: MarginNotesProps) {
  const match = NOTES.find(note => note.sectionId === activeId)
  const style = match ? ({ '--mn-ink': `var(--${match.ink})` } as CSSProperties) : undefined

  if (!match) {
    return (
      <aside
        className={`margin-notes margin-notes--idle margin-notes--voice-${voice}`}
        aria-label="No marginal note for this folio"
        aria-hidden="true"
      >
        <span className="margin-notes__rule" aria-hidden="true" />
        <span className="margin-notes__hand">
          <span className="margin-notes__hand-mark margin-notes__hand-mark--idle" aria-hidden="true">·</span>
          <span className="margin-notes__hand-copy">
            <span className="margin-notes__hand-tag">no marginal note</span>
            <em className="margin-notes__hand-text">the page keeps its silence here</em>
          </span>
        </span>
        <span className="margin-notes__rule" aria-hidden="true" />
      </aside>
    )
  }

  const active = match
  return (
    <aside
      className={`margin-notes margin-notes--${active.ink} margin-notes--voice-${voice}`}
      aria-label="Handwritten margin note for the current folio"
      aria-live="polite"
      style={style}
    >
      <span className="margin-notes__rule margin-notes__rule--top" aria-hidden="true" />
      <span className="margin-notes__hand">
        <span className="margin-notes__hand-mark" aria-hidden="true">{GLYPH[active.glyph]}</span>
        <span className="margin-notes__hand-copy">
          <span className="margin-notes__hand-tag">a hand in the margin</span>
          <em className="margin-notes__hand-text">{active.text}</em>
          <span className="margin-notes__hand-sig">— the editor, passing through</span>
        </span>
      </span>
      <span className="margin-notes__rule margin-notes__rule--bottom" aria-hidden="true" />
      <span className="margin-notes__scroll" aria-hidden="true">
        <svg viewBox="0 0 60 18" preserveAspectRatio="none">
          <path
            d="M2 10c6-7 14 4 22-2s14-7 22-2 14 4 14 4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            className="margin-notes__scroll-stroke"
          />
          <circle cx="58" cy="10" r="1.4" fill="currentColor" className="margin-notes__scroll-dot" />
        </svg>
      </span>
    </aside>
  )
}
