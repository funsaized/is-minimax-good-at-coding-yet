import { useId } from 'react'
import type { CSSProperties } from 'react'
import { NOTES, type WordId } from './notes'
import type { VoiceId } from './Press'

type ReaderNoteProps = {
  active: WordId
  hovered: WordId | null
  voice: VoiceId
  onHover: (id: WordId) => void
  onLeave: () => void
  onSelect: (id: WordId) => void
}

const INK: Record<WordId, string> = {
  m3: 'var(--acid)',
  good: 'var(--coral)',
  yet: 'var(--blue)',
}

const MARK_LABEL: Record<WordId, string> = {
  m3: 'stet',
  good: 'caret',
  yet: 'query',
}

const VOICE_GLYPH: Record<VoiceId, string> = {
  quiet: 'quiet cut',
  human: 'human hand',
  bold: 'bold signal',
}

export function ReaderNote({ active, hovered, voice, onHover, onLeave, onSelect }: ReaderNoteProps) {
  const display = hovered ?? active
  const note = NOTES.find(item => item.id === display) ?? NOTES[0]
  const ink = INK[display]
  const style = { '--note-ink': ink } as CSSProperties
  const baseId = useId()
  const ruleId = `reader-note-rule-${baseId.replace(/:/g, '')}`

  return (
    <aside className="reader-note" aria-label="Reader's note for the active marked word" style={style}>
      <span className="reader-note__tape reader-note__tape--top" aria-hidden="true">
        <svg viewBox="0 0 120 18" preserveAspectRatio="none">
          <path d="M2 9c10-4 22 4 34 0s22-5 34-1 22 5 36-1 12-3 12-3" fill="none" stroke="currentColor" strokeWidth=".6" strokeLinecap="round" strokeDasharray="1 2.4" />
        </svg>
      </span>

      <header className="reader-note__head">
        <span className="reader-note__head-mark" aria-hidden="true">※</span>
        <span className="reader-note__head-eyebrow">a reader's note</span>
        <span className="reader-note__head-folio">folio i · marked words</span>
      </header>

      <span className="reader-note__rule" aria-hidden="true">
        <svg viewBox="0 0 320 2" preserveAspectRatio="none">
          <defs>
            <linearGradient id={ruleId} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
              <stop offset="22%" stopColor="currentColor" stopOpacity=".7" />
              <stop offset="78%" stopColor="currentColor" stopOpacity=".7" />
              <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
            </linearGradient>
          </defs>
          <line x1="2" y1="1" x2="318" y2="1" stroke={`url(#${ruleId})`} strokeWidth=".9" />
        </svg>
      </span>

      <ol className="reader-note__index" aria-label="Marked words in this folio">
        {NOTES.map(item => {
          const isActive = item.id === display
          return (
            <li key={item.id} className={`reader-note__index-item reader-note__index-item--${item.id} ${isActive ? 'is-active' : ''}`}>
              <button
                type="button"
                className="reader-note__index-tick"
                onClick={() => onSelect(item.id)}
                onMouseEnter={() => onHover(item.id)}
                onMouseLeave={onLeave}
                onFocus={() => onHover(item.id)}
                onBlur={onLeave}
                aria-pressed={isActive}
                aria-label={`${MARK_LABEL[item.id]} — ${item.label}`}
              >
                <span className="reader-note__index-mark" aria-hidden="true">{MARK_LABEL[item.id]}</span>
                <span className="reader-note__index-word" aria-hidden="true">{item.label}</span>
              </button>
            </li>
          )
        })}
      </ol>

      <article className="reader-note__leaf" key={display}>
        <span className="reader-note__leaf-row">
          <span className={`reader-note__leaf-mark reader-note__leaf-mark--${display}`}>{MARK_LABEL[display]}</span>
          <span className="reader-note__leaf-folio" aria-hidden="true">folio {note.folio}</span>
          <span className="reader-note__leaf-sep" aria-hidden="true">·</span>
          <span className="reader-note__leaf-word">{note.label}</span>
        </span>

        <h3 className="reader-note__title">
          <span aria-hidden="true" className="reader-note__title-orn">
            <svg viewBox="0 0 24 24">
              <path d="M4 18 C 8 8, 16 8, 20 18" fill="none" stroke="currentColor" strokeWidth=".9" strokeLinecap="round" />
              <circle cx="20" cy="18" r="1.2" fill="currentColor" />
            </svg>
          </span>
          {note.title}
        </h3>

        <p className="reader-note__gloss">
          <span className="reader-note__gloss-mark" aria-hidden="true">—</span>
          <em>{note.gloss}</em>
        </p>

        <p className="reader-note__body">{note.body}</p>

        <span className="reader-note__pull" aria-hidden="true">
          <span className="reader-note__pull-rule" />
          <em>{note.prompt}</em>
          <span className="reader-note__pull-rule reader-note__pull-rule--end" />
        </span>

        <span className="reader-note__editor">
          <span className="reader-note__editor-tag">editor's pencil</span>
          <span className="reader-note__editor-note">{note.editor}</span>
        </span>
      </article>

      <footer className="reader-note__foot" aria-hidden="true">
        <span className="reader-note__foot-rule" />
        <span className="reader-note__foot-text">
          set in <em>{VOICE_GLYPH[voice]}</em>
        </span>
        <span className="reader-note__foot-seen">{note.seen}</span>
        <span className="reader-note__foot-rule reader-note__foot-rule--end" />
      </footer>
    </aside>
  )
}