import { useId, useState, type CSSProperties, type KeyboardEvent as ReactKeyboardEvent } from 'react'
import type { VoiceId } from './App'
import type { WordId } from './notes'

type TypeCaseProps = {
  voice: VoiceId
  word: WordId
  setToday: string
  onWord?: (id: WordId, focus?: boolean) => void
}

const VOICE_NAME: Record<VoiceId, string> = {
  quiet: 'quiet cut',
  human: 'human hand',
  bold: 'bold signal',
}
const VOICE_FACE: Record<VoiceId, string> = {
  quiet: 'serif · italic · close set',
  human: 'serif · italic · warm',
  bold: 'sans · heavy · no apology',
}
const VOICE_LETTER: Record<VoiceId, string> = { quiet: 'A', human: 'B', bold: 'C' }

const WORD_GLYPH: Record<WordId, string> = { m3: '⌇', good: '∧', yet: '?' }
const WORD_NAME: Record<WordId, string> = { m3: 'the maker', good: 'the verb', yet: 'the pause' }
const WORD_MARK: Record<WordId, string> = { m3: 'stet', good: 'caret', yet: 'query' }

type TypePiece = {
  id: WordId
  letter: string
  glyph: string
  size: 'sm' | 'md' | 'lg'
  tilt: number
  inkDepth: number
  shape: 'round' | 'square' | 'tall'
  setLine: { quiet: string; human: string; bold: string }
}

const PIECES: TypePiece[] = [
  {
    id: 'm3',
    letter: 'A',
    glyph: '⌇',
    size: 'md',
    tilt: -1.6,
    inkDepth: 0.92,
    shape: 'square',
    setLine: { quiet: 'm³', human: 'M3', bold: 'M3' },
  },
  {
    id: 'good',
    letter: 'B',
    glyph: '∧',
    size: 'lg',
    tilt: 0.7,
    inkDepth: 0.86,
    shape: 'tall',
    setLine: { quiet: 'good at', human: 'good at', bold: 'good at' },
  },
  {
    id: 'yet',
    letter: 'C',
    glyph: '?',
    size: 'sm',
    tilt: -0.4,
    inkDepth: 0.95,
    shape: 'round',
    setLine: { quiet: 'yet?', human: 'yet?', bold: 'yet?' },
  },
]

const ORDER: VoiceId[] = ['quiet', 'human', 'bold']

function handlePieceKey(
  event: ReactKeyboardEvent<HTMLButtonElement>,
  id: WordId,
  pieces: TypePiece[],
) {
  if (event.defaultPrevented) return
  const idx = pieces.findIndex(p => p.id === id)
  if (idx < 0) return
  let next = idx
  if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (idx + 1) % pieces.length
  if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (idx - 1 + pieces.length) % pieces.length
  if (event.key === 'Home') next = 0
  if (event.key === 'End') next = pieces.length - 1
  if (next === idx) return
  event.preventDefault()
  const target = event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>('button')[next]
  target?.focus()
}

export function TypeCase({ voice, word, setToday, onWord }: TypeCaseProps) {
  const baseId = useId().replace(/:/g, '')
  const inkId = `tc-ink-${baseId}`
  const stainId = `tc-stain-${baseId}`
  const cornerId = `tc-corner-${baseId}`

  const [hovered, setHovered] = useState<WordId | null>(null)
  const [hoveredVoice, setHoveredVoice] = useState<VoiceId | null>(null)
  const focus = hovered ?? word
  const voiceFocus = hoveredVoice ?? voice

  const style = {
    '--tc-tone': `var(--${voice})`,
    '--tc-piece-tone': `var(--${voice})`,
    '--tc-voice-tone': `var(--${voiceFocus})`,
  } as CSSProperties

  return (
    <section className="type-case type-case--reveal" aria-label="The three words, set as physical type">
      <svg className="type-case__defs" aria-hidden="true" focusable="false">
        <defs>
          <linearGradient id={inkId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="currentColor" stopOpacity=".04" />
            <stop offset="42%" stopColor="currentColor" stopOpacity=".10" />
            <stop offset="100%" stopColor="currentColor" stopOpacity=".22" />
          </linearGradient>
          <radialGradient id={stainId} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="currentColor" stopOpacity=".32" />
            <stop offset="60%" stopColor="currentColor" stopOpacity=".08" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </radialGradient>
          <linearGradient id={cornerId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="currentColor" stopOpacity=".6" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      <header className="type-case__crest" aria-hidden="true">
        <span className="type-case__crest-rule type-case__crest-rule--l">
          <svg viewBox="0 0 160 6" preserveAspectRatio="none">
            <line x1="0" y1="3" x2="160" y2="3" stroke="currentColor" strokeWidth=".45" strokeDasharray=".4 2.4" opacity=".6" />
            <circle cx="0" cy="3" r="1.1" fill="currentColor" />
            <circle cx="160" cy="3" r="1.1" fill="currentColor" />
          </svg>
        </span>
        <span className="type-case__crest-stack">
          <em className="type-case__crest-key">the three tokens</em>
          <span className="type-case__crest-line">
            <em>set in their own wood</em>
            <span aria-hidden="true">·</span>
            <em>touched by the voice</em>
          </span>
        </span>
        <span className="type-case__crest-rule type-case__crest-rule--r">
          <svg viewBox="0 0 160 6" preserveAspectRatio="none">
            <line x1="0" y1="3" x2="160" y2="3" stroke="currentColor" strokeWidth=".45" strokeDasharray=".4 2.4" opacity=".6" />
            <circle cx="0" cy="3" r="1.1" fill="currentColor" />
            <circle cx="160" cy="3" r="1.1" fill="currentColor" />
          </svg>
        </span>
      </header>

      <div className="type-case__board" style={style}>
        <span className="type-case__board-grain" aria-hidden="true" />
        <span className="type-case__board-edge" aria-hidden="true" />

        <div className="type-case__pieces" aria-label="The three words as physical type · click to mark">
          {PIECES.map((piece, idx) => {
            const isFocus = focus === piece.id
            const tone = isFocus ? 'var(--tc-voice-tone)' : 'var(--paper-soft)'
            const pieceStyle = {
              '--piece-tilt': `${piece.tilt}deg`,
              '--piece-ink': piece.inkDepth.toString(),
              '--piece-tone': tone,
            } as CSSProperties
            return (
              <button
                key={piece.id}
                type="button"
                className={`type-case__piece type-case__piece--${piece.id} type-case__piece--${piece.size} type-case__piece--${piece.shape} ${isFocus ? 'is-focus' : ''}`}
                style={pieceStyle}
                aria-pressed={word === piece.id}
                aria-label={`Mark ${piece.id} — ${WORD_NAME[piece.id]} (mark: ${WORD_MARK[piece.id]}). Voice ${VOICE_LETTER[voice]} reads it as "${piece.setLine[voice]}".`}
                onMouseEnter={() => setHovered(piece.id)}
                onMouseLeave={() => setHovered(prev => (prev === piece.id ? null : prev))}
                onFocus={() => setHovered(piece.id)}
                onBlur={() => setHovered(prev => (prev === piece.id ? null : prev))}
                onClick={() => onWord?.(piece.id)}
                onKeyDown={(event) => handlePieceKey(event, piece.id, PIECES)}
              >
                <span className="type-case__piece-shadow" aria-hidden="true" />
                <span className="type-case__piece-block">
                  <span className="type-case__piece-edge" aria-hidden="true" />
                  <span className="type-case__piece-face">
                    <span className="type-case__piece-ink" aria-hidden="true" />
                    <span className="type-case__piece-type" aria-hidden="true">
                      {piece.setLine[voice]}
                    </span>
                    <span className="type-case__piece-mark" aria-hidden="true">
                      <svg viewBox="0 0 24 24" preserveAspectRatio="none">
                        <path
                          d="M2 12 Q8 4 14 12 Q20 20 22 12"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth=".7"
                          strokeLinecap="round"
                          opacity=".55"
                        />
                        <circle cx="2" cy="12" r=".9" fill="currentColor" opacity=".7" />
                        <circle cx="22" cy="12" r=".9" fill="currentColor" opacity=".7" />
                      </svg>
                    </span>
                    <span className="type-case__piece-nail" aria-hidden="true">
                      <svg viewBox="0 0 8 8">
                        <circle cx="4" cy="4" r="2.4" fill="currentColor" opacity=".5" />
                        <circle cx="4" cy="4" r="1" fill="var(--night)" />
                      </svg>
                    </span>
                  </span>
                  <span className="type-case__piece-base" aria-hidden="true">
                    <svg viewBox="0 0 100 12" preserveAspectRatio="none">
                      <line x1="2" y1="6" x2="98" y2="6" stroke="currentColor" strokeWidth=".4" strokeDasharray=".4 1.2" opacity=".4" />
                    </svg>
                  </span>
                </span>
                <span className="type-case__piece-label" aria-hidden="true">
                  <em className="type-case__piece-letter">{piece.letter}</em>
                  <span className="type-case__piece-glyph">{piece.glyph}</span>
                  <span className="type-case__piece-markname">{WORD_MARK[piece.id]}</span>
                </span>
              </button>
            )
          })}
        </div>

        <span className="type-case__center-pin" aria-hidden="true">
          <svg viewBox="0 0 60 60">
            <circle cx="30" cy="30" r="22" fill="none" stroke="currentColor" strokeWidth=".5" opacity=".35" />
            <circle cx="30" cy="30" r="14" fill="none" stroke="currentColor" strokeWidth=".32" strokeDasharray=".4 1.4" opacity=".55" />
            <circle cx="30" cy="30" r="6" fill="currentColor" opacity=".78" />
            <circle cx="30" cy="30" r="2" fill="var(--night)" />
            <line x1="30" y1="6" x2="30" y2="14" stroke="currentColor" strokeWidth=".4" strokeLinecap="round" opacity=".55" />
            <line x1="30" y1="46" x2="30" y2="54" stroke="currentColor" strokeWidth=".4" strokeLinecap="round" opacity=".55" />
            <line x1="6" y1="30" x2="14" y2="30" stroke="currentColor" strokeWidth=".4" strokeLinecap="round" opacity=".55" />
            <line x1="46" y1="30" x2="54" y2="30" stroke="currentColor" strokeWidth=".4" strokeLinecap="round" opacity=".55" />
          </svg>
        </span>
      </div>

      <div className="type-case__voice-row" role="group" aria-label="The three voices, cycled on the type">
        <span className="type-case__voice-key" aria-hidden="true">
          <em>voice</em>
          <span className="type-case__voice-key-rule" />
          <em>{VOICE_LETTER[voice]}</em>
        </span>
        <ol className="type-case__voice-list">
          {ORDER.map((v, i) => {
            const isActive = voiceFocus === v
            const rowStyle = { '--voice-row-tone': `var(--${v})` } as CSSProperties
            const sample = PIECES[1].setLine[v]
            return (
              <li
                key={v}
                className={`type-case__voice-cell type-case__voice-cell--${v} ${isActive ? 'is-active' : ''}`}
                style={rowStyle}
                onMouseEnter={() => setHoveredVoice(v)}
                onMouseLeave={() => setHoveredVoice(prev => (prev === v ? null : prev))}
              >
                <span className="type-case__voice-cell-letter" aria-hidden="true">{VOICE_LETTER[v]}</span>
                <span className="type-case__voice-cell-stack">
                  <em className="type-case__voice-cell-name">{VOICE_NAME[v]}</em>
                  <span className="type-case__voice-cell-face">{VOICE_FACE[v]}</span>
                </span>
                <span className={`type-case__voice-cell-sample type-case__voice-cell-sample--${v}`} aria-hidden="true">
                  {sample}
                </span>
                {i < ORDER.length - 1 && (
                  <span className="type-case__voice-cell-stitch" aria-hidden="true">
                    <svg viewBox="0 0 24 6" preserveAspectRatio="none">
                      <line x1="0" y1="3" x2="24" y2="3" stroke="currentColor" strokeWidth=".4" strokeDasharray=".4 1.4" opacity=".5" />
                    </svg>
                  </span>
                )}
              </li>
            )
          })}
        </ol>
      </div>

      <footer className="type-case__ledger" aria-hidden="true">
        <span className="type-case__ledger-cell">
          <em className="type-case__ledger-key">set on</em>
          <span className="type-case__ledger-val">{setToday}</span>
        </span>
        <span className="type-case__ledger-cell">
          <em className="type-case__ledger-key">touch</em>
          <span className="type-case__ledger-val">{word === 'm3' ? 'the maker' : word === 'good' ? 'the verb' : 'the pause'}</span>
        </span>
        <span className="type-case__ledger-cell">
          <em className="type-case__ledger-key">voice</em>
          <span className="type-case__ledger-val">{VOICE_NAME[voice]}</span>
        </span>
      </footer>
    </section>
  )
}
