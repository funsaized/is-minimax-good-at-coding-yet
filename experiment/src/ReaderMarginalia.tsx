import { useEffect, useId, useRef, useState, type CSSProperties } from 'react'
import type { VoiceId } from './App'
import type { WordId } from './notes'

type ReaderMarginaliaProps = {
  word: WordId
  hover: WordId | null
  voice: VoiceId
  pullSignal: number
}

type NoteSpec = {
  id: WordId
  index: string
  glyph: string
  label: string
  tone: VoiceId
  toneVar: string
  title: string
  gloss: string
  prompt: string
  seen: string
}

const NOTES: NoteSpec[] = [
  {
    id: 'm3',
    index: 'i',
    glyph: '⌇',
    label: 'm³',
    tone: 'quiet',
    toneVar: 'var(--quiet)',
    title: 'Keep the fingerprint',
    gloss: 'a habit, not a name',
    prompt: 'the maker is a habit',
    seen: 'seen twice today',
  },
  {
    id: 'good',
    index: 'ii',
    glyph: '∧',
    label: 'good at',
    tone: 'human',
    toneVar: 'var(--human)',
    title: 'Choose one clear thing',
    gloss: 'confidence is generous',
    prompt: 'make room for attention',
    seen: 'read aloud once',
  },
  {
    id: 'yet',
    index: 'iii',
    glyph: '?',
    label: 'yet?',
    tone: 'bold',
    toneVar: 'var(--bold)',
    title: 'Protect the pause',
    gloss: 'the question stays open',
    prompt: 'leave room to arrive',
    seen: 'circled in pencil',
  },
]

export function ReaderMarginalia({ word, hover, voice, pullSignal }: ReaderMarginaliaProps) {
  const baseId = useId().replace(/:/g, '')
  const ruleId = `rm-rule-${baseId}`
  const activeId = hover ?? word
  const lastPull = useRef(pullSignal)
  const [stampKey, setStampKey] = useState(0)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mq.matches)
    const onChange = () => setReducedMotion(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    if (lastPull.current === pullSignal) return
    lastPull.current = pullSignal
    setStampKey(k => k + 1)
  }, [pullSignal])

  const style = {
    '--rm-tone': `var(--${voice})`,
  } as CSSProperties

  return (
    <aside
      className={`reader-marginalia reader-marginalia--${voice} reader-marginalia--word-${word} ${reducedMotion ? 'is-quiet' : ''}`}
      style={style}
      aria-label="The reader's marginalia — three handwritten notes for the marked words of the question"
    >
      <svg
        className="reader-marginalia__defs"
        viewBox="0 0 1200 24"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={ruleId} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
            <stop offset="14%" stopColor="currentColor" stopOpacity=".55" />
            <stop offset="50%" stopColor="currentColor" stopOpacity=".78" />
            <stop offset="86%" stopColor="currentColor" stopOpacity=".55" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      <header className="reader-marginalia__head" aria-hidden="true">
        <span className="reader-marginalia__head-key">
          <span className="reader-marginalia__head-glyph">
            <svg viewBox="0 0 14 14">
              <rect x="1" y="1" width="12" height="12" fill="none" stroke="currentColor" strokeWidth=".5" rx="1" />
              <line x1="2" y1="7" x2="12" y2="7" stroke="currentColor" strokeWidth=".35" opacity=".55" />
              <line x1="7" y1="2" x2="7" y2="12" stroke="currentColor" strokeWidth=".35" opacity=".55" />
              <circle cx="7" cy="7" r="1.4" fill="currentColor" opacity=".75" />
            </svg>
          </span>
          <em className="reader-marginalia__head-name">the reader&rsquo;s marginalia</em>
          <span className="reader-marginalia__head-dot" aria-hidden="true">·</span>
          <em className="reader-marginalia__head-sub">three notes, set beside the line</em>
        </span>
        <span className="reader-marginalia__head-meta">
          <span className="reader-marginalia__head-meta-rule" />
          <em>now at</em>
          <span className="reader-marginalia__head-meta-idx" key={`meta-${stampKey}`}>
            {NOTES.find(n => n.id === activeId)?.index ?? '·'}
          </span>
        </span>
      </header>

      <ol className="reader-marginalia__notes" aria-label="Three marginalia notes for the marked words">
        {NOTES.map((note, idx) => {
          const isActive = activeId === note.id
          const cellStyle = {
            '--rm-note-tone': note.toneVar,
            '--rm-note-delay': `${idx * 80}ms`,
            '--rm-note-lift': isActive ? '1' : '0',
          } as CSSProperties
          return (
            <li
              key={note.id}
              className={`rm-note rm-note--${note.id} rm-note--${note.tone} ${isActive ? 'is-active' : ''}`}
              style={cellStyle}
              aria-current={isActive ? 'true' : undefined}
            >
              {isActive && <span className="rm-note__aura" key={`aura-${stampKey}`} aria-hidden="true" />}
              <span className="rm-note__rule rm-note__rule--top" aria-hidden="true">
                <svg viewBox="0 0 200 6" preserveAspectRatio="none">
                  <line x1="2" y1="3" x2="198" y2="3" stroke="currentColor" strokeWidth=".5" strokeDasharray="1.6 2.6" opacity={isActive ? '.85' : '.4'} />
                </svg>
              </span>

              <span className="rm-note__cap" aria-hidden="true">
                <span className="rm-note__cap-mark">
                  <svg viewBox="0 0 16 16">
                    <circle cx="8" cy="8" r="6.4" fill="none" stroke="currentColor" strokeWidth=".55" />
                    <circle cx="8" cy="8" r="3.2" fill="currentColor" opacity=".75" />
                    <text x="8" y="11.4" textAnchor="middle" fontFamily="'Iowan Old Style', Georgia, serif" fontStyle="italic" fontSize="9" fill="var(--night)">
                      {note.index}
                    </text>
                  </svg>
                </span>
                <span className="rm-note__cap-glyph" aria-hidden="true">{note.glyph}</span>
                <span className="rm-note__cap-voice" aria-hidden="true">
                  <em>voice</em>
                  <span className="rm-note__cap-voice-letter">{note.tone === 'quiet' ? 'A' : note.tone === 'human' ? 'B' : 'C'}</span>
                </span>
              </span>

              <div className="rm-note__body">
                <span className="rm-note__label" aria-hidden="true">{note.label}</span>
                <h3 className="rm-note__title">{note.title}</h3>
                <p className="rm-note__gloss">{note.gloss}</p>
                <p className="rm-note__prompt" aria-hidden="true">
                  <span className="rm-note__prompt-tick">·</span>
                  <em>{note.prompt}</em>
                </p>
                <p className="rm-note__seen" aria-hidden="true">
                  <span className="rm-note__seen-mark">✓</span>
                  <em>{note.seen}</em>
                </p>
              </div>

              <span className="rm-note__caret" aria-hidden="true">
                <svg viewBox="0 0 14 14">
                  <path
                    d="M2 11 L7 3 L12 11"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth=".8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity={isActive ? '.9' : '.4'}
                  />
                  <circle cx="7" cy="3" r="1" fill="currentColor" opacity={isActive ? '.9' : '.4'} />
                </svg>
                <em className="rm-note__caret-mark">stet</em>
              </span>

              <span className="rm-note__rule rm-note__rule--bot" aria-hidden="true">
                <svg viewBox="0 0 200 6" preserveAspectRatio="none">
                  <line x1="2" y1="3" x2="198" y2="3" stroke={`url(#${ruleId})`} strokeWidth=".6" />
                </svg>
              </span>
            </li>
          )
        })}
      </ol>

      <footer className="reader-marginalia__foot" aria-hidden="true">
        <span className="reader-marginalia__foot-rule" />
        <em className="reader-marginalia__foot-key">set beside the line</em>
        <span className="reader-marginalia__foot-dot">·</span>
        <em className="reader-marginalia__foot-tail">
          three notes for three marks &mdash; each in its own voice
        </em>
        <span className="reader-marginalia__foot-rule" />
      </footer>
    </aside>
  )
}