import { useId, useState, type CSSProperties, type KeyboardEvent } from 'react'
import type { VoiceId } from './Press'
import type { WordId } from './notes'

type TitleSweepProps = {
  voice: VoiceId
  word: WordId
  setToday: string
  onVoice?: (voice: VoiceId) => void
  onWord?: (word: WordId) => void
}

type SortFace = {
  letter: string
  name: string
  tag: string
  lines: [string, string, string]
  font: string
  weight: number
  style: 'normal' | 'italic'
  track: string
  size: string
  tone: string
  ink: string
  press: string
}

const SORT_FACES: Record<VoiceId, SortFace> = {
  quiet: {
    letter: 'A',
    name: 'quiet cut',
    tag: 'serif · close set',
    lines: ['is Minimax', 'good at frontend', 'yet?'],
    font: 'var(--serif)',
    weight: 400,
    style: 'italic',
    track: '-.03em',
    size: 'clamp(8.5px, 1.05vw, 12px)',
    tone: 'var(--blue)',
    ink: 'rgba(155, 188, 255, .85)',
    press: '#5b79cb',
  },
  human: {
    letter: 'B',
    name: 'human hand',
    tag: 'italic · a little warm',
    lines: ['is M3', 'good at frontend', 'yet?'],
    font: 'var(--serif)',
    weight: 500,
    style: 'italic',
    track: '-.02em',
    size: 'clamp(9.5px, 1.15vw, 13px)',
    tone: 'var(--coral)',
    ink: 'rgba(240, 110, 91, .9)',
    press: '#b34a3a',
  },
  bold: {
    letter: 'C',
    name: 'bold signal',
    tag: 'display · no apology',
    lines: ['IS', 'GOOD AT', 'FRONTEND YET?'],
    font: 'var(--sans)',
    weight: 800,
    style: 'normal',
    track: '-.07em',
    size: 'clamp(10.5px, 1.3vw, 14.5px)',
    tone: 'var(--acid)',
    ink: 'rgba(216, 240, 106, .95)',
    press: '#7c8a36',
  },
}

const VOICES: VoiceId[] = ['quiet', 'human', 'bold']
const WORDS: WordId[] = ['m3', 'good', 'yet']
const VOICE_NEXT: Record<VoiceId, VoiceId> = { quiet: 'human', human: 'bold', bold: 'quiet' }
const WORD_NEXT: Record<WordId, WordId> = { m3: 'good', good: 'yet', yet: 'm3' }

const WORD_GLYPH: Record<WordId, string> = { m3: 'm³', good: 'good at', yet: 'yet?' }
const WORD_INK: Record<WordId, string> = { m3: 'var(--acid)', good: 'var(--coral)', yet: 'var(--blue)' }
const WORD_MARK: Record<WordId, string> = { m3: 'stet', good: 'caret', yet: 'query' }

function SortTitle({ face, lifted, set }: { face: SortFace; lifted: boolean; set: boolean }) {
  return (
    <span className={`press-cabinet__sort-title ${lifted ? 'is-lifted' : ''} ${set ? 'is-set' : ''}`}>
      <span className="press-cabinet__sort-title-lead" aria-hidden="true">
        <span className="press-cabinet__sort-title-bead" />
      </span>
      <span className="press-cabinet__sort-title-rows">
        {face.lines.map((line, index) => (
          <span
            key={`${face.letter}-${index}`}
            className="press-cabinet__sort-title-row"
            style={{
              fontFamily: face.font,
              fontWeight: face.weight,
              fontStyle: face.style,
              letterSpacing: face.track,
              fontSize: face.size,
            }}
          >
            {line}
          </span>
        ))}
      </span>
      <span className="press-cabinet__sort-title-trail" aria-hidden="true">
        <span className="press-cabinet__sort-title-bead" />
      </span>
    </span>
  )
}

function SortForm({ face, active }: { face: SortFace; active: boolean }) {
  return (
    <svg
      className={`press-cabinet__sort-form press-cabinet__sort-form--${face.letter.toLowerCase()} ${active ? 'is-active' : ''}`}
      viewBox="0 0 80 100"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`cabinet-form-fill-${face.letter}-${active ? 'on' : 'off'}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--lead-1)" stopOpacity={active ? .98 : .86} />
          <stop offset="40%" stopColor="var(--lead-2)" stopOpacity={active ? .96 : .82} />
          <stop offset="100%" stopColor="var(--lead-3)" stopOpacity={active ? .94 : .78} />
        </linearGradient>
        <linearGradient id={`cabinet-form-rim-${face.letter}-${active ? 'on' : 'off'}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={face.press} stopOpacity={active ? .9 : .65} />
          <stop offset="100%" stopColor={face.press} stopOpacity={active ? .35 : .22} />
        </linearGradient>
      </defs>
      <rect x="3" y="3" width="74" height="94" rx="3" fill={`url(#cabinet-form-rim-${face.letter}-${active ? 'on' : 'off'})`} />
      <rect x="6" y="6" width="68" height="88" rx="2" fill={`url(#cabinet-form-fill-${face.letter}-${active ? 'on' : 'off'})`} />
      <path d="M6 8 H74" stroke="var(--ink)" strokeWidth=".4" opacity=".5" />
      <path d="M6 92 H74" stroke="var(--ink)" strokeWidth=".4" opacity=".5" />
      <path d="M8 6 V94" stroke="var(--ink)" strokeWidth=".3" opacity=".35" />
      <path d="M72 6 V94" stroke="var(--ink)" strokeWidth=".3" opacity=".35" />
      <circle cx="40" cy="11" r="1.2" fill={face.ink} opacity={active ? .9 : .5} />
      <circle cx="40" cy="89" r="1" fill="var(--ink)" opacity=".5" />
    </svg>
  )
}

function CabinetWordSort({ id, active, lifted, onPick, onHover }: { id: WordId; active: boolean; lifted: boolean; onPick: () => void; onHover?: () => void }) {
  const handleKey = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      const next = WORD_NEXT[id]
      document.getElementById(`cabinet-word-${next}`)?.focus()
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault()
      const prev = WORD_NEXT[WORD_NEXT[id]]
      document.getElementById(`cabinet-word-${prev}`)?.focus()
    } else if (event.key === 'Home') {
      event.preventDefault()
      document.getElementById('cabinet-word-m3')?.focus()
    } else if (event.key === 'End') {
      event.preventDefault()
      document.getElementById('cabinet-word-yet')?.focus()
    }
  }
  return (
    <button
      type="button"
      id={`cabinet-word-${id}`}
      className={`press-cabinet__word press-cabinet__word--${id} ${active ? 'is-active' : ''} ${lifted ? 'is-lifted' : ''}`}
      onClick={onPick}
      onMouseEnter={onHover}
      onFocus={onHover}
      onKeyDown={handleKey}
      aria-pressed={active}
      aria-label={`Mark the word ${WORD_GLYPH[id]} (${WORD_MARK[id]}) on the type case`}
      style={{ '--word-tone': WORD_INK[id] } as CSSProperties}
    >
      <span className="press-cabinet__word-cap" aria-hidden="true" />
      <span className="press-cabinet__word-face">
        <span className="press-cabinet__word-glyph" aria-hidden="true">{WORD_MARK[id].charAt(0).toUpperCase()}</span>
        <span className="press-cabinet__word-name">{WORD_GLYPH[id]}</span>
      </span>
      <span className="press-cabinet__word-mark" aria-hidden="true">{WORD_MARK[id]}</span>
      <svg className="press-cabinet__word-shadow" viewBox="0 0 80 8" preserveAspectRatio="none" aria-hidden="true">
        <ellipse cx="40" cy="4" rx="36" ry="2" fill="var(--ink)" opacity=".25" />
      </svg>
    </button>
  )
}

function CabinetSort({ id, face, active, lifted, onPick, onHover }: { id: VoiceId; face: SortFace; active: boolean; lifted: boolean; onPick: () => void; onHover?: () => void }) {
  const handleKey = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      const next = VOICE_NEXT[id]
      document.getElementById(`cabinet-sort-${next}`)?.focus()
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault()
      const prev = VOICE_NEXT[VOICE_NEXT[id]]
      document.getElementById(`cabinet-sort-${prev}`)?.focus()
    } else if (event.key === 'Home') {
      event.preventDefault()
      document.getElementById('cabinet-sort-quiet')?.focus()
    } else if (event.key === 'End') {
      event.preventDefault()
      document.getElementById('cabinet-sort-bold')?.focus()
    }
  }
  return (
    <button
      type="button"
      id={`cabinet-sort-${id}`}
      className={`press-cabinet__sort press-cabinet__sort--${id} ${active ? 'is-active' : ''} ${lifted ? 'is-lifted' : ''}`}
      onClick={onPick}
      onMouseEnter={onHover}
      onFocus={onHover}
      onKeyDown={handleKey}
      aria-pressed={active}
      aria-label={`Set the title's voice to ${face.name}, set in ${face.tag}`}
      style={{
        '--sort-tone': face.tone,
        '--sort-ink': face.ink,
      } as CSSProperties}
    >
      <SortForm face={face} active={active} />
      <SortTitle face={face} lifted={lifted} set={active} />
      <svg className="press-cabinet__sort-shadow" viewBox="0 0 100 12" preserveAspectRatio="none" aria-hidden="true">
        <ellipse cx="50" cy="6" rx="46" ry="2.6" fill="var(--ink)" opacity={active ? .36 : .22} />
        <ellipse cx="50" cy="6" rx="32" ry="1.2" fill="var(--ink)" opacity={active ? .5 : .3} />
      </svg>
      <span className="press-cabinet__sort-foot">
        <span className="press-cabinet__sort-letter" aria-hidden="true">{face.letter}</span>
        <span className="press-cabinet__sort-name">{face.name}</span>
        <span className="press-cabinet__sort-tag" aria-hidden="true">{face.tag}</span>
      </span>
      <span className="press-cabinet__sort-ink" aria-hidden="true">
        <span className="press-cabinet__sort-ink-blot" />
        <span className="press-cabinet__sort-ink-bleed" />
      </span>
    </button>
  )
}

export function TitleSweep({ voice, word, setToday, onVoice, onWord }: TitleSweepProps) {
  const baseId = useId().replace(/:/g, '')
  const [hoverVoice, setHoverVoice] = useState<VoiceId | null>(null)
  const [hoverWord, setHoverWord] = useState<WordId | null>(null)
  const activeFace = SORT_FACES[voice]
  const style = {
    '--cabinet-tone': activeFace.tone,
    '--cabinet-tone-soft': activeFace.tone,
    '--cabinet-word-tone': WORD_INK[word],
    '--cabinet-grain': `url(#cabinet-grain-${baseId})`,
    '--cabinet-tray-grain': `url(#cabinet-tray-grain-${baseId})`,
  } as CSSProperties

  return (
    <figure
      className={`press-cabinet press-cabinet--voice-${voice} press-cabinet--word-${word}`}
      style={style}
      aria-label="The type case that sets the title above"
    >
      <svg className="press-cabinet__pulp" viewBox="0 0 800 360" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <filter id={`cabinet-grain-${baseId}`} x="-2%" y="-2%" width="104%" height="104%">
            <feTurbulence type="fractalNoise" baseFrequency=".7" numOctaves="2" seed="61" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 .14  0 0 0 0 .12  0 0 0 0 .19  0 0 0 .09 0" />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
          <filter id={`cabinet-tray-grain-${baseId}`} x="-2%" y="-2%" width="104%" height="104%">
            <feTurbulence type="fractalNoise" baseFrequency="1.4" numOctaves="2" seed="73" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .32 0" />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
          <linearGradient id={`cabinet-frame-${baseId}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--lead-3)" />
            <stop offset="38%" stopColor="var(--lead-2)" />
            <stop offset="62%" stopColor="var(--lead-1)" />
            <stop offset="100%" stopColor="var(--lead-3)" />
          </linearGradient>
          <linearGradient id={`cabinet-tray-${baseId}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--paper)" />
            <stop offset="100%" stopColor="var(--paper-2)" />
          </linearGradient>
        </defs>
      </svg>

      <span className="press-cabinet__crop press-cabinet__crop--tl" aria-hidden="true" />
      <span className="press-cabinet__crop press-cabinet__crop--tr" aria-hidden="true" />
      <span className="press-cabinet__crop press-cabinet__crop--bl" aria-hidden="true" />
      <span className="press-cabinet__crop press-cabinet__crop--br" aria-hidden="true" />

      <header className="press-cabinet__head" aria-hidden="true">
        <span className="press-cabinet__head-rule" />
        <span className="press-cabinet__head-tag">
          <span className="press-cabinet__head-tick" />
          the type case <em>·</em> set the title above
          <span className="press-cabinet__head-tick press-cabinet__head-tick--alt" />
        </span>
        <span className="press-cabinet__head-rule" />
      </header>

      <span className="press-cabinet__plate" aria-hidden="true">
        <span className="press-cabinet__plate-key">folio i·</span>
        <span className="press-cabinet__plate-divider">·</span>
        <span className="press-cabinet__plate-tag">type case</span>
        <span className="press-cabinet__plate-dot" />
      </span>

      <div className="press-cabinet__drawer">
        <span className="press-cabinet__drawer-edge press-cabinet__drawer-edge--top" aria-hidden="true" />
        <span className="press-cabinet__drawer-edge press-cabinet__drawer-edge--bottom" aria-hidden="true" />

        <span className="press-cabinet__handle press-cabinet__handle--left" aria-hidden="true">
          <span className="press-cabinet__handle-stud" />
          <span className="press-cabinet__handle-stem" />
        </span>
        <span className="press-cabinet__handle press-cabinet__handle--right" aria-hidden="true">
          <span className="press-cabinet__handle-stud" />
          <span className="press-cabinet__handle-stem" />
        </span>

        <span className="press-cabinet__cabret" aria-hidden="true">
          <span className="press-cabinet__cabret-mark">m³</span>
          <span className="press-cabinet__cabret-stamp" />
          <span className="press-cabinet__cabret-name">case 01</span>
        </span>

        <div
          className="press-cabinet__tray"
          role="group"
          aria-label="Three voice sorts set into the title above"
          onMouseLeave={() => setHoverVoice(null)}
        >
          <span className="press-cabinet__tray-rule press-cabinet__tray-rule--top" aria-hidden="true">
            <svg viewBox="0 0 600 6" preserveAspectRatio="none">
              <path
                d="M2 3 L598 3"
                stroke="var(--lead-3)"
                strokeWidth=".55"
                strokeDasharray="1.6 2.4"
                fill="none"
              />
            </svg>
          </span>
          <span className="press-cabinet__tray-cuts" aria-hidden="true">
            {[0, 1, 2].map(index => (
              <span key={index} className="press-cabinet__tray-cut" />
            ))}
          </span>

          {VOICES.map(id => (
            <CabinetSort
              key={id}
              id={id}
              face={SORT_FACES[id]}
              active={id === voice}
              lifted={hoverVoice === id && id !== voice}
              onPick={() => {
                if (onVoice) onVoice(id)
                setHoverVoice(null)
              }}
              onHover={() => setHoverVoice(id)}
            />
          ))}
          <span className="press-cabinet__tray-rule press-cabinet__tray-rule--bottom" aria-hidden="true">
            <svg viewBox="0 0 600 6" preserveAspectRatio="none">
              <path
                d="M2 3 L598 3"
                stroke="var(--lead-3)"
                strokeWidth=".55"
                strokeDasharray="1.6 2.4"
                fill="none"
              />
            </svg>
          </span>
        </div>

        <span className="press-cabinet__lever" aria-hidden="true">
          <span className="press-cabinet__lever-rule" />
          <span className="press-cabinet__lever-row">
            <span className="press-cabinet__lever-dot" />
            <span className="press-cabinet__lever-tag">title answers with whichever is set</span>
            <span className="press-cabinet__lever-dot" />
          </span>
          <span className="press-cabinet__lever-rule" />
        </span>

        <div
          className="press-cabinet__word-shelf"
          role="group"
          aria-label="Three marked word sorts keyed to the type case"
          onMouseLeave={() => setHoverWord(null)}
        >
          <span className="press-cabinet__word-shelf-eyebrow" aria-hidden="true">
            <span className="press-cabinet__word-shelf-eyebrow-mark" />
            marked words
            <span className="press-cabinet__word-shelf-eyebrow-rule" />
          </span>
          <span className="press-cabinet__word-shelf-rule" aria-hidden="true">
            <svg viewBox="0 0 600 4" preserveAspectRatio="none">
              <path d="M2 2 L598 2" stroke="var(--lead-3)" strokeWidth=".4" strokeDasharray=".7 2.6" fill="none" />
            </svg>
          </span>
          <span className="press-cabinet__word-shelf-row">
            {WORDS.map(id => (
              <CabinetWordSort
                key={id}
                id={id}
                active={id === word}
                lifted={hoverWord === id && id !== word}
                onPick={() => {
                  if (onWord) onWord(id)
                  setHoverWord(null)
                }}
                onHover={() => setHoverWord(id)}
              />
            ))}
          </span>
          <span className="press-cabinet__word-shelf-rule" aria-hidden="true">
            <svg viewBox="0 0 600 4" preserveAspectRatio="none">
              <path d="M2 2 L598 2" stroke="var(--lead-3)" strokeWidth=".4" strokeDasharray=".7 2.6" fill="none" />
            </svg>
          </span>
        </div>
      </div>

      <figcaption className="press-cabinet__caption">
        <span className="press-cabinet__caption-mark" aria-hidden="true">※</span>
        <span className="press-cabinet__caption-line">
          three metal sorts, lined up in their drawer · pick a sort to set the title above · marked words return to the marginalia
        </span>
        <span className="press-cabinet__caption-mark press-cabinet__caption-mark--alt" aria-hidden="true">※</span>
        <span className="press-cabinet__caption-date">set today · {setToday}</span>
      </figcaption>

      <span className="press-cabinet__rising-arrow" aria-hidden="true">
        <svg viewBox="0 0 24 36" preserveAspectRatio="none">
          <path
            d="M12 34 C 8 28, 14 24, 12 18 S 16 12, 12 6 S 14 2, 12 2"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.1"
            strokeLinecap="round"
            strokeDasharray=".6 2.4"
            opacity=".55"
          />
          <path d="M6 6 L12 2 L18 6" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="12" cy="33" r="1.4" fill="currentColor" />
        </svg>
      </span>
    </figure>
  )
}
