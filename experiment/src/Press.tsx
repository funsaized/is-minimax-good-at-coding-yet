import { useId, useRef, type CSSProperties } from 'react'
import type { VoiceId } from './App'
export type { VoiceId } from './App'
import type { WordId } from './notes'

type PressProps = {
  voice: VoiceId
  word: WordId
  pullSignal: number
  isPulling: boolean
  pullCount: number
  onPull: () => void
  setToday: string
}

const ORDER: VoiceId[] = ['quiet', 'human', 'bold']
const NEXT_VOICE: Record<VoiceId, VoiceId> = { quiet: 'human', human: 'bold', bold: 'quiet' }
const VOICE_NAME: Record<VoiceId, string> = { quiet: 'quiet cut', human: 'human hand', bold: 'bold signal' }
const VOICE_LETTER: Record<VoiceId, string> = { quiet: 'A', human: 'B', bold: 'C' }
const VOICE_FACE: Record<VoiceId, string> = {
  quiet: 'serif · italic',
  human: 'serif · italic · warm',
  bold: 'sans · heavy',
}

type Piece = {
  id: 'is' | WordId | 'frontend'
  text: Record<VoiceId, string>
  marked: boolean
  glyph?: string
}

const PIECES: Piece[] = [
  { id: 'is', text: { quiet: 'is', human: 'is', bold: 'is' }, marked: false },
  { id: 'm3', text: { quiet: 'm³', human: 'M3', bold: 'M3' }, marked: true, glyph: '⌇' },
  { id: 'good', text: { quiet: 'good at', human: 'good at', bold: 'good at' }, marked: true, glyph: '∧' },
  { id: 'frontend', text: { quiet: 'frontend', human: 'frontend', bold: 'frontend' }, marked: false },
  { id: 'yet', text: { quiet: 'yet?', human: 'yet?', bold: 'yet?' }, marked: true, glyph: '?' },
]

const PROOF: Record<WordId, { label: string; sub: string }> = {
  m3: { label: 'stet', sub: 'let it stand' },
  good: { label: 'caret', sub: 'make room' },
  yet: { label: 'query', sub: 'protect the pause' },
}

const MOTTO: Record<VoiceId, string> = {
  quiet: 'a quiet line is a careful line — let the page do less, then less again.',
  human: 'a small wobble makes the machine feel less like a machine.',
  bold: 'say the whole thing once, in the loudest voice you can keep honest.',
}

const LONG_MOTTO: Record<VoiceId, string> = {
  quiet: 'pull once · the line settles · the page listens',
  human: 'pull once · the line warms · the page answers back',
  bold: 'pull once · the line stands up · the page says so',
}

const COMPOSITOR_NOTE: Record<VoiceId, string> = {
  quiet: 'every pull sets the line a little softer — the page keeps the quietest pull on top.',
  human: 'every pull warms the same letterforms a little — the machine carries the heat in the type.',
  bold: 'every pull stands the line a little taller — the press prefers the loudest pull at first light.',
}

const COMPOSITOR_NOTE_HELD: Record<VoiceId, string> = {
  quiet: 'pull the lever once, and i will tell you what the press has learned.',
  human: 'pull the lever once, and i will tell you what the press has learned.',
  bold: 'pull the lever once, and i will tell you what the press has learned.',
}

export function Press({ voice, word, pullSignal, isPulling, pullCount, onPull, setToday }: PressProps) {
  const bleedRef = useRef<HTMLSpanElement | null>(null)

  const next = NEXT_VOICE[voice]
  const pulling = isPulling

  return (
    <section className="press reveal" id="press" aria-labelledby="press-title">
      <header className="press__header">
        <span className="eyebrow"><span className="eyebrow__line" />the press bed</span>
        <h2 id="press-title">
          One lever. <em>One line.</em>
        </h2>
        <p className="section__lede">
          Pull the lever to cycle the voice. The sheet on the right is the pulled impression — same line,
          a new face. Click the knob, or press <kbd>shift</kbd>+<kbd>v</kbd>.
        </p>
        <p className="press__motto" aria-hidden="true">
          <em>{MOTTO[voice]}</em>
        </p>
      </header>

      <PressRule voice={voice} count={pullCount} pulling={pulling} />

      <div className={`press__table press__table--${voice} ${pulling ? 'is-pulling' : ''}`}>
        <div className="press__cell press__cell--lever">
          <button
            type="button"
            className={`press-lever press-lever--${voice} ${pulling ? 'is-pulled' : ''}`}
            onClick={onPull}
            aria-label={`Pull the composing lever. Current voice is ${VOICE_NAME[voice]} (${VOICE_FACE[voice]}); next pull will set the line in ${VOICE_NAME[next]}.`}
          >
            <span className="press-lever__cage" aria-hidden="true">
              <span className="press-lever__cage-tick press-lever__cage-tick--top" />
              <span className="press-lever__cage-tick press-lever__cage-tick--mid" />
              <span className="press-lever__cage-tick press-lever__cage-tick--bot" />
            </span>
            <span className="press-lever__shaft" aria-hidden="true">
              <span className="press-lever__knob" aria-hidden="true" />
            </span>
            <span
              ref={bleedRef}
              className={`press-lever__bleed press-lever__bleed--${voice} ${pulling ? 'is-active' : ''}`}
              aria-hidden="true"
              key={`bleed-${pullSignal}`}
            />
            <span
              className={`press-lever__dust press-lever__dust--${voice} ${pulling ? 'is-active' : ''}`}
              aria-hidden="true"
              key={`dust-${pullSignal}`}
            >
              <span className="press-lever__dust-grain press-lever__dust-grain--a" />
              <span className="press-lever__dust-grain press-lever__dust-grain--b" />
              <span className="press-lever__dust-grain press-lever__dust-grain--c" />
              <span className="press-lever__dust-grain press-lever__dust-grain--d" />
              <span className="press-lever__dust-grain press-lever__dust-grain--e" />
            </span>
            <span className="press-lever__label" aria-hidden="true">
              <em>pull</em>
              <span>{VOICE_LETTER[voice]}</span>
            </span>
            <span className="press-lever__hint" aria-hidden="true">
              <kbd>shift</kbd>+<kbd>v</kbd>
            </span>
            <span className="press-lever__rail" aria-hidden="true">
              <span className={`press-lever__rail-fill press-lever__rail-fill--${voice}`} />
            </span>
          </button>

          <div className="press-state" aria-live="polite">
            <div className="press-state__row">
              <span className="press-state__key">now</span>
              <em className="press-state__voice">{VOICE_NAME[voice]}</em>
              <span className="press-state__face">{VOICE_FACE[voice]}</span>
            </div>
            <div className="press-state__row press-state__row--next">
              <span className="press-state__key">next</span>
              <em className="press-state__next">{VOICE_NAME[next]}</em>
              <span className="press-state__rule" aria-hidden="true" />
            </div>
            <div className="press-state__row press-state__row--mark">
              <span className="press-state__key">mark</span>
              <em className="press-state__mark">
                <span className="press-state__mark-glyph">{PROOF[word].label === 'stet' ? '⌇' : PROOF[word].label === 'caret' ? '∧' : '?'}</span>
                <span>{PROOF[word].label}</span>
                <em>· {PROOF[word].sub}</em>
              </em>
            </div>
          </div>

          <PullDial count={pullCount} voice={voice} pulling={pulling} />
        </div>

        <div className="press__cell press__cell--impression">
          <span className="press__cell-key">the impression</span>
          <div className="press__cell-body">
            <div className={`press-impression press-impression--${voice} ${pulling ? 'is-pulled' : ''}`}>
              <div className="press-impression__stamp" aria-hidden="true">
                <span>impression № {String(pullCount).padStart(3, '0')} · folio ii · at first light</span>
                <span>voice {VOICE_LETTER[voice]}</span>
              </div>
              <div className="press-impression__body">
                {PIECES.map(piece => (
                  <span
                    key={piece.id}
                    className={`press-impression__line ${piece.marked ? 'is-marked' : ''}`}
                    data-glyph={piece.glyph ?? ''}
                  >
                    {piece.text[voice]}
                  </span>
                ))}
              </div>
              <div className="press-impression__sig">
                <span className="press-impression__sig-label">{setToday}</span>
                <span className="press-impression__sig-rule" aria-hidden="true" />
                <span className="press-impression__sig-label">{VOICE_NAME[voice]}</span>
              </div>
              <span className="press-impression__platen" aria-hidden="true" key={`platen-${pullSignal}`} />
              <span className="press-impression__color-bar" aria-hidden="true">
                <span className="press-impression__color-swatch" />
                <span className="press-impression__color-swatch" />
                <span className="press-impression__color-swatch" />
              </span>
              <span className="press-impression__corner" aria-hidden="true" />
              <span className="press-impression__register" aria-hidden="true">
                <svg viewBox="0 0 28 28">
                  <circle cx="14" cy="14" r="11" fill="none" stroke="currentColor" strokeWidth=".7" opacity=".6" />
                  <line x1="14" y1="0" x2="14" y2="28" stroke="currentColor" strokeWidth=".5" opacity=".55" />
                  <line x1="0" y1="14" x2="28" y2="14" stroke="currentColor" strokeWidth=".5" opacity=".55" />
                  <circle cx="14" cy="14" r="1.4" fill="currentColor" />
                </svg>
              </span>
              <span className="press-impression__register-stamp" aria-hidden="true">
                <span>reg · ii</span>
                <span>{String(pullCount).padStart(3, '0')}</span>
              </span>
              <span className={`press-impression__bleed press-impression__bleed--${voice} ${pulling ? 'is-active' : ''}`} aria-hidden="true" key={`ib-${pullSignal}`} />
              <span className={`press-impression__ring press-impression__ring--${voice} ${pulling ? 'is-active' : ''}`} aria-hidden="true" key={`ir1-${pullSignal}`} />
              <span className={`press-impression__ring press-impression__ring--second press-impression__ring--${voice} ${pulling ? 'is-active' : ''}`} aria-hidden="true" key={`ir2-${pullSignal}`} />
            </div>
            <p className="press__pull-coda" aria-hidden="true">
              <em>{LONG_MOTTO[voice]}</em>
            </p>

            <div className="press-impression__rule" aria-hidden="true">
              <span className="press-impression__rule-rule" />
              <em>printed in {VOICE_NAME[voice]}</em>
              <span className="press-impression__rule-rule" />
            </div>
          </div>
        </div>
      </div>

      <figure className={`press__compositor ${pullCount > 0 ? 'is-revealed' : ''}`} aria-label="A note from the compositor">
        <svg className="press__compositor-mark" viewBox="0 0 64 18" aria-hidden="true">
          <line x1="0" y1="9" x2="20" y2="9" stroke="currentColor" strokeWidth=".5" strokeLinecap="round" opacity=".5" />
          <line x1="44" y1="9" x2="64" y2="9" stroke="currentColor" strokeWidth=".5" strokeLinecap="round" opacity=".5" />
          <path d="M22 9 Q26 2 30 9 Q26 16 22 9" fill="currentColor" opacity=".35" />
          <path d="M22 9 Q26 2 30 9" fill="none" stroke="currentColor" strokeWidth=".5" strokeLinecap="round" opacity=".65" />
          <path d="M34 9 Q38 2 42 9 Q38 16 34 9" fill="currentColor" opacity=".35" />
          <path d="M34 9 Q38 2 42 9" fill="none" stroke="currentColor" strokeWidth=".5" strokeLinecap="round" opacity=".65" />
          <circle cx="32" cy="9" r="2.6" fill="currentColor" />
          <circle cx="32" cy="9" r="1" fill="#080a12" />
          <circle cx="6" cy="9" r=".8" fill="currentColor" opacity=".7" />
          <circle cx="58" cy="9" r=".8" fill="currentColor" opacity=".7" />
        </svg>
        <figcaption>
          <em>{pullCount > 0 ? 'a note from the compositor —' : 'a note held by the compositor —'}</em>
          <span>{pullCount > 0 ? COMPOSITOR_NOTE[voice] : COMPOSITOR_NOTE_HELD[voice]}</span>
        </figcaption>
      </figure>
    </section>
  )
}

function PressRule({ voice, count, pulling }: { voice: VoiceId; count: number; pulling: boolean }) {
  const id = useId().replace(/:/g, '')
  return (
    <div className={`press__rule ${pulling ? 'is-pulling' : ''}`} aria-hidden="true">
      <span className="press__rule-line press__rule-line--l" />
      <span className="press__rule-middle">
        <span className="press__rule-quoin press__rule-quoin--l">
          <svg viewBox="0 0 16 16">
            <path d="M2 14 L8 8 L14 14 Z" fill="currentColor" opacity=".85" />
            <path d="M5 14 L8 11 L11 14" fill="none" stroke="rgba(8,10,18,.55)" strokeWidth=".5" />
          </svg>
        </span>
        <span className="press__rule-copy">
          <em>the lever pulls</em>
          <span className="press__rule-dot" aria-hidden="true" />
          <em>the line answers</em>
          <span className="press__rule-dot" aria-hidden="true" />
          <em>the page remembers</em>
        </span>
        <span className="press__rule-quoin press__rule-quoin--r">
          <svg viewBox="0 0 16 16">
            <path d="M2 2 L8 8 L14 2 Z" fill="currentColor" opacity=".85" />
            <path d="M5 2 L8 5 L11 2" fill="none" stroke="rgba(8,10,18,.55)" strokeWidth=".5" />
          </svg>
        </span>
        <span className="press__rule-counter" aria-hidden="true">
          <span className="press__rule-counter-rule" />
          <span className="press__rule-counter-num">{String(count).padStart(3, '0')}</span>
          <span className="press__rule-counter-rule" />
        </span>
      </span>
      <span className="press__rule-line press__rule-line--r" />
      <span className="press__rule-marks" aria-hidden="true">
        <svg viewBox="0 0 200 6" preserveAspectRatio="none">
          <line x1="0" y1="3" x2="200" y2="3" stroke="rgba(245,238,216,.06)" strokeWidth=".4" strokeDasharray="1 4" />
        </svg>
      </span>
      <span className="press__rule-stamp" aria-hidden="true">
        <span className={`press__rule-stamp-dot press__rule-stamp-dot--${voice}`} key={`stamp-${id}`} />
        <span>in operation</span>
      </span>
    </div>
  )
}

function PullDial({ count, voice, pulling }: { count: number; voice: VoiceId; pulling: boolean }) {
  const angle = (count * 30) - 90
  const safeAngle = Number.isFinite(angle) ? angle : -90
  const handStyle = {
    transform: `rotate(${safeAngle}deg)`,
    transformOrigin: '32px 32px',
  } as CSSProperties
  const ticks = Array.from({ length: 12 }, (_, i) => {
    const a = ((i * 30 - 90) * Math.PI) / 180
    const isMajor = i % 3 === 0
    const inner = isMajor ? 16 : 19
    const outer = 27
    return {
      x1: 32 + Math.cos(a) * inner,
      y1: 32 + Math.sin(a) * inner,
      x2: 32 + Math.cos(a) * outer,
      y2: 32 + Math.sin(a) * outer,
      major: isMajor,
    }
  })
  const numerals = Array.from({ length: 12 }, (_, i) => {
    const a = ((i * 30 - 90) * Math.PI) / 180
    return {
      x: 32 + Math.cos(a) * 22.5,
      y: 32 + Math.sin(a) * 22.5,
      label: i === 0 ? 12 : i,
    }
  })

  return (
    <div className={`press-dial press-dial--${voice} ${pulling ? 'is-pulling' : ''}`} aria-hidden="true">
      <svg viewBox="0 0 64 64" className="press-dial__face">
        <circle cx="32" cy="32" r="30" fill="rgba(8,10,18,.55)" stroke="currentColor" strokeWidth=".5" opacity=".95" />
        <circle cx="32" cy="32" r="26" fill="none" stroke="currentColor" strokeWidth=".35" strokeDasharray="1 2.5" opacity=".55" />
        <circle cx="32" cy="32" r="22" fill="none" stroke="currentColor" strokeWidth=".3" opacity=".35" />
        <g className="press-dial__numerals" fill="currentColor" opacity=".65" fontFamily="ui-monospace, monospace" fontSize="4.4" letterSpacing=".3" textAnchor="middle">
          {numerals.map(n => (
            <text key={n.label} x={n.x} y={n.y + 1.5}>{n.label}</text>
          ))}
        </g>
        <g className="press-dial__ticks" stroke="currentColor" strokeLinecap="round">
          {ticks.map((t, i) => (
            <line
              key={i}
              x1={t.x1}
              y1={t.y1}
              x2={t.x2}
              y2={t.y2}
              strokeWidth={t.major ? '.8' : '.4'}
              opacity={t.major ? '.85' : '.45'}
            />
          ))}
        </g>
        <g className="press-dial__hand" style={handStyle}>
          <path d="M32 32 L30.4 8 L33.6 8 Z" fill="currentColor" />
          <line x1="32" y1="32" x2="32" y2="14" stroke="rgba(8,10,18,.6)" strokeWidth=".6" strokeLinecap="round" />
        </g>
        <circle cx="32" cy="32" r="2.4" fill="currentColor" />
        <circle cx="32" cy="32" r="3.2" fill="none" stroke="currentColor" strokeWidth=".5" opacity=".55" />
        <text
          x="32"
          y="44"
          textAnchor="middle"
          fontFamily="ui-monospace, 'SFMono-Regular', Menlo, monospace"
          fontSize="6.5"
          letterSpacing="1"
          fill="currentColor"
          opacity=".85"
        >
          {String(count).padStart(3, '0')}
        </text>
      </svg>
      <span className="press-dial__legend">
        <span className="press-dial__legend-key">impressions · on the day</span>
        <span className="press-dial__legend-rule" aria-hidden="true" />
        <span className="press-dial__legend-mark" aria-hidden="true">
          <span className={`press-dial__legend-dot press-dial__legend-dot--${voice}`} />
          cycle · {voice}
        </span>
      </span>
    </div>
  )
}
