import { useEffect, useId, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react'
import type { VoiceId } from './Press'
import type { WordId } from './notes'
import type { ImpressionMark } from './ImpressionRibbon'

type FolioFoldProps = {
  voice: VoiceId
  word: WordId
  setToday: string
  marks: ReadonlyArray<ImpressionMark>
}

const VOICE_TONE: Record<VoiceId, string> = {
  quiet: 'var(--blue)',
  human: 'var(--coral)',
  bold: 'var(--acid)',
}
const VOICE_LABEL: Record<VoiceId, string> = {
  quiet: 'quiet cut',
  human: 'human hand',
  bold: 'bold signal',
}
const VOICE_FACE: Record<VoiceId, string> = {
  quiet: 'serif · italic · close set',
  human: 'serif · italic · a little warm',
  bold: 'sans · heavy · no apology',
}
const VOICE_LETTER: Record<VoiceId, string> = { quiet: 'A', human: 'B', bold: 'C' }
const VOICE_GLYPH: Record<VoiceId, string> = { quiet: '⌇', human: '✦', bold: '■' }

const WORD_LABEL: Record<WordId, string> = { m3: 'm³', good: 'good at', yet: 'yet?' }
const WORD_MARK: Record<WordId, string> = { m3: 'stet', good: 'caret', yet: 'query' }
const WORD_INK: Record<WordId, string> = {
  m3: 'var(--acid)',
  good: 'var(--coral)',
  yet: 'var(--blue)',
}

const TOOLS: { id: 'lever' | 'stick' | 'chase' | 'counter'; name: string; mark: string; note: string }[] = [
  { id: 'lever', name: 'the lever', mark: 'i.', note: 'one pull · one cycle' },
  { id: 'stick', name: 'the stick', mark: 'ii.', note: 'three sorts · one line' },
  { id: 'chase', name: 'the chase', mark: 'iii.', note: 'the bed, locked in' },
  { id: 'counter', name: 'the counter', mark: 'iv.', note: 'impressions · pulled' },
]

const FOLD_TICK = 4

function FolioGlyph({ id, voice, word, glyph }: { id: string; voice: VoiceId; word: WordId; glyph: string }) {
  if (id === 'lever') {
    return (
      <svg className="folio-fold__tool-svg" viewBox="0 0 64 64" aria-hidden="true">
        <line x1="18" y1="6" x2="46" y2="6" stroke="currentColor" strokeWidth=".7" strokeLinecap="round" opacity=".6" />
        <line x1="20" y1="12" x2="44" y2="12" stroke="currentColor" strokeWidth=".35" strokeDasharray="1 2" opacity=".45" />
        <line x1="32" y1="20" x2="32" y2="50" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        <line x1="32" y1="22" x2="32" y2="48" stroke="var(--night)" strokeWidth=".4" strokeLinecap="round" opacity=".5" />
        <circle cx="32" cy="20" r="6.5" fill="currentColor" />
        <circle cx="32" cy="20" r="3.4" fill="var(--night)" />
        <circle cx="30.6" cy="18.4" r=".7" fill="currentColor" opacity=".7" />
        <circle cx="32" cy="50" r="1.6" fill="currentColor" />
        <line x1="22" y1="56" x2="42" y2="56" stroke="currentColor" strokeWidth=".7" strokeLinecap="round" />
      </svg>
    )
  }
  if (id === 'stick') {
    return (
      <svg className="folio-fold__tool-svg" viewBox="0 0 64 64" aria-hidden="true">
        <line x1="8" y1="22" x2="56" y2="22" stroke="currentColor" strokeWidth=".5" strokeLinecap="round" />
        <line x1="8" y1="44" x2="56" y2="44" stroke="currentColor" strokeWidth=".5" strokeLinecap="round" />
        <line x1="14" y1="18" x2="14" y2="48" stroke="currentColor" strokeWidth=".35" strokeDasharray=".8 1.4" opacity=".5" />
        <line x1="50" y1="18" x2="50" y2="48" stroke="currentColor" strokeWidth=".35" strokeDasharray=".8 1.4" opacity=".5" />
        {(['m3', 'good', 'yet'] as WordId[]).map((wid, idx) => (
          <g key={wid} style={{ color: WORD_INK[wid] }} className={`folio-fold__tool-sort folio-fold__tool-sort--${wid} ${wid === word ? 'is-active' : ''}`}>
            <rect x={20 + idx * 9} y="26" width="6" height="14" fill="currentColor" opacity={wid === word ? .9 : .55} />
            <line x1={23 + idx * 9} y1="29" x2={23 + idx * 9} y2="37" stroke="var(--night)" strokeWidth=".35" />
          </g>
        ))}
        <text x="32" y="12" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="3.4" letterSpacing="1.4" fill="currentColor" opacity=".55">{VOICE_LETTER[voice]}</text>
        <text x="32" y="56" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="3.4" letterSpacing="1.4" fill="currentColor" opacity=".55">{WORD_MARK[word]}</text>
      </svg>
    )
  }
  if (id === 'chase') {
    return (
      <svg className="folio-fold__tool-svg" viewBox="0 0 64 64" aria-hidden="true">
        <rect x="8" y="14" width="48" height="36" fill="none" stroke="currentColor" strokeWidth=".55" opacity=".7" />
        <rect x="11" y="17" width="42" height="30" fill="none" stroke="currentColor" strokeWidth=".3" strokeDasharray="1 1.4" opacity=".5" />
        <line x1="14" y1="32" x2="50" y2="32" stroke="currentColor" strokeWidth=".25" opacity=".4" />
        <line x1="32" y1="20" x2="32" y2="44" stroke="currentColor" strokeWidth=".25" opacity=".35" />
        <text x="32" y="11" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="3.2" letterSpacing="1.6" fill="currentColor" opacity=".7">CHASE</text>
        <text x="32" y="58" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="3.2" letterSpacing="1.6" fill="currentColor" opacity=".7">FOLIO · ii</text>
        <text x="32" y="36" textAnchor="middle" fontFamily="Georgia, serif" fontStyle="italic" fontSize="9" fill="currentColor" style={{ color: 'var(--paper)' }}>{glyph}</text>
      </svg>
    )
  }
  return (
    <svg className="folio-fold__tool-svg" viewBox="0 0 64 64" aria-hidden="true">
      <circle cx="32" cy="32" r="22" fill="none" stroke="currentColor" strokeWidth=".7" />
      <circle cx="32" cy="32" r="17" fill="none" stroke="currentColor" strokeWidth=".35" strokeDasharray="1 1.6" opacity=".55" />
      <text x="32" y="11" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="3.2" letterSpacing="1.6" fill="currentColor" opacity=".7">COUNT</text>
      <text x="32" y="36" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="10" letterSpacing=".5" fill="currentColor" className="folio-fold__tool-counter-num">{glyph}</text>
      <text x="32" y="56" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="3.2" letterSpacing="1.4" fill="currentColor" opacity=".6">OF · 03</text>
    </svg>
  )
}

function CounterTicks({ active }: { active: number }) {
  return (
    <span className="folio-fold__ticks" aria-hidden="true">
      {Array.from({ length: FOLD_TICK }, (_, idx) => (
        <span
          key={idx}
          className={`folio-fold__tick ${idx < active ? 'is-on' : ''} ${idx === active ? 'is-now' : ''}`}
        />
      ))}
    </span>
  )
}

export function FolioFold({ voice, word, setToday, marks }: FolioFoldProps) {
  const baseId = useId().replace(/:/g, '')
  const grainId = `folio-fold-grain-${baseId}`
  const ruleId = `folio-fold-rule-${baseId}`
  const hingeGrainId = `folio-fold-hinge-grain-${baseId}`
  const rootRef = useRef<HTMLElement>(null)
  const [revealed, setRevealed] = useState(false)
  const [armed, setArmed] = useState(false)
  const [stampTick, setStampTick] = useState(0)

  const tone = VOICE_TONE[voice]
  const pullCount = marks.reduce((acc, mark) => (mark.kind === 'pull' ? acc + 1 : acc), 0)
  const wordCount = marks.reduce((acc, mark) => (mark.kind === 'word' ? acc + 1 : acc), 0)
  const voiceCount = marks.reduce((acc, mark) => (mark.kind === 'voice' ? acc + 1 : acc), 0)
  const impressionIndex = Math.min(FOLD_TICK - 1, Math.max(0, ['quiet', 'human', 'bold'].indexOf(voice)))
  const isReady = true

  const style = {
    '--folio-fold-tone': tone,
    '--folio-fold-grain': `url(#${grainId})`,
    '--folio-fold-rule': `url(#${ruleId})`,
    '--folio-fold-hinge-grain': `url(#${hingeGrainId})`,
    '--folio-fold-word-ink': WORD_INK[word],
  } as CSSProperties

  useEffect(() => {
    const node = rootRef.current
    if (!node) return
    if (!('IntersectionObserver' in window)) {
      setRevealed(true)
      return
    }
    const observer = new IntersectionObserver(
      entries => {
        const visible = entries.some(entry => entry.isIntersecting)
        if (visible) {
          setRevealed(true)
          observer.disconnect()
        }
      },
      { threshold: 0.16, rootMargin: '0px 0px -8% 0px' },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    setStampTick(tick => tick + 1)
  }, [voice, word])

  const handleKey = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      setArmed(value => !value)
    }
  }

  const glyphFor = (id: string) => {
    if (id === 'counter') return String(pullCount + 1).padStart(2, '0')
    if (id === 'chase') return VOICE_GLYPH[voice]
    return ''
  }

  return (
    <section
      ref={rootRef}
      className={`folio-fold folio-fold--${voice} folio-fold--word-${word} ${revealed ? 'is-revealed' : ''} ${armed ? 'is-armed' : ''} ${isReady ? 'is-ready' : ''}`}
      style={style}
      aria-labelledby="folio-fold-title"
    >
      <svg className="folio-fold__defs" viewBox="0 0 1200 600" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <filter id={grainId} x="0%" y="0%" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.86" numOctaves="2" seed="29" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 .14  0 0 0 0 .12  0 0 0 0 .19  0 0 0 .045 0" />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
          <linearGradient id={ruleId} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
            <stop offset="14%" stopColor="currentColor" stopOpacity=".55" />
            <stop offset="50%" stopColor="currentColor" stopOpacity=".85" />
            <stop offset="86%" stopColor="currentColor" stopOpacity=".55" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
          <filter id={hingeGrainId} x="-2%" y="-50%" width="104%" height="200%">
            <feTurbulence type="fractalNoise" baseFrequency="2.6" numOctaves="2" seed="47" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .42 0" />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
        </defs>
      </svg>

      <span className="folio-fold__crop folio-fold__crop--tl" aria-hidden="true" />
      <span className="folio-fold__crop folio-fold__crop--tr" aria-hidden="true" />
      <span className="folio-fold__crop folio-fold__crop--bl" aria-hidden="true" />
      <span className="folio-fold__crop folio-fold__crop--br" aria-hidden="true" />

      <span className="folio-fold__plate-tag" aria-hidden="true">
        <span className="folio-fold__plate-tag-mark" />
        the page folds once <em>·</em> folio i ends <em>·</em> folio ii begins
        <span className="folio-fold__plate-tag-mark folio-fold__plate-tag-mark--alt" />
      </span>

      <div className="folio-fold__head">
        <h2 id="folio-fold-title" className="folio-fold__title">
          <span className="folio-fold__title-eyebrow" aria-hidden="true">the press opens</span>
          <span className="folio-fold__title-line">Make-ready, <i>then pull.</i></span>
          <span className="folio-fold__title-tail" aria-hidden="true">
            <span className="folio-fold__title-tail-rule" />
            <span className="folio-fold__title-tail-tag">
              <span className="folio-fold__title-tail-dot" />
              set in <em>{VOICE_LABEL[voice]}</em>
              <span className="folio-fold__title-tail-dot" />
            </span>
            <span className="folio-fold__title-tail-rule folio-fold__title-tail-rule--alt" />
          </span>
        </h2>
      </div>

      <ol className="folio-fold__tools" aria-label="The four tools on the press bed, lined up and ready">
        {TOOLS.map((tool, index) => (
          <li
            key={tool.id}
            className={`folio-fold__tool folio-fold__tool--${tool.id} ${index === impressionIndex ? 'is-now' : ''}`}
            style={{ '--tool-i': index } as CSSProperties}
          >
            <span className="folio-fold__tool-frame" aria-hidden="true">
              <span className="folio-fold__tool-corner folio-fold__tool-corner--tl" />
              <span className="folio-fold__tool-corner folio-fold__tool-corner--tr" />
              <span className="folio-fold__tool-corner folio-fold__tool-corner--bl" />
              <span className="folio-fold__tool-corner folio-fold__tool-corner--br" />
              <span className="folio-fold__tool-rule folio-fold__tool-rule--top" />
              <span className="folio-fold__tool-rule folio-fold__tool-rule--bottom" />
            </span>
            <span className="folio-fold__tool-mark" aria-hidden="true">{tool.mark}</span>
            <span className="folio-fold__tool-glyph" aria-hidden="true">
              <FolioGlyph id={tool.id} voice={voice} word={word} glyph={glyphFor(tool.id)} />
            </span>
            <span className="folio-fold__tool-name">
              <span className="folio-fold__tool-name-line">{tool.name}</span>
              <span className="folio-fold__tool-name-note">{tool.note}</span>
            </span>
            {tool.id === 'counter' && (
              <span className="folio-fold__tool-ticks" aria-hidden="true">
                <CounterTicks active={impressionIndex} />
              </span>
            )}
          </li>
        ))}
      </ol>

      <div className="folio-fold__status" role="status" aria-live="polite">
        <button
          type="button"
          className="folio-fold__arm"
          onClick={() => setArmed(value => !value)}
          onKeyDown={handleKey}
          aria-pressed={armed}
          aria-label={`${armed ? 'Disarm' : 'Arm'} the press. ${armed ? 'Press is ready to pull.' : 'Press is resting.'}`}
        >
          <span className="folio-fold__arm-ring" aria-hidden="true">
            <span className="folio-fold__arm-ring-track" />
            <span className="folio-fold__arm-ring-fill" />
          </span>
          <span className="folio-fold__arm-copy">
            <span className="folio-fold__arm-eyebrow" aria-hidden="true">
              <span className="folio-fold__arm-eyebrow-dot" />
              press status
            </span>
            <span className="folio-fold__arm-state">
              <em>{armed ? 'armed' : 'at rest'}</em>
              <span className="folio-fold__arm-face">{armed ? 'ready to pull the lever' : 'waiting on a setting'}</span>
            </span>
          </span>
          <span className="folio-fold__arm-stamp" key={`arm-stamp-${stampTick}`} aria-hidden="true">
            <svg viewBox="0 0 56 28">
              <text x="28" y="14" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="6" letterSpacing="2.4" fill="currentColor">
                {armed ? 'ARMED' : 'AT · REST'}
              </text>
              <line x1="2" y1="20" x2="54" y2="20" stroke="currentColor" strokeWidth=".4" />
              <text x="28" y="26" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="3.6" letterSpacing="2" fill="currentColor" opacity=".7">
                {VOICE_LETTER[voice]} · {WORD_MARK[word]}
              </text>
            </svg>
          </span>
        </button>

        <div className="folio-fold__status-tail">
          <span className="folio-fold__status-rule" aria-hidden="true">
            <svg viewBox="0 0 200 6" preserveAspectRatio="none">
              <path
                d="M2 3c20-4 40 4 60 0s40-4 60 0 40 4 60 0 16 0 16 0"
                fill="none"
                stroke={`url(#${ruleId})`}
                strokeWidth=".7"
                strokeLinecap="round"
                pathLength="100"
                className="folio-fold__status-rule-stroke"
              />
              <circle cx="198" cy="3" r="1.1" fill="currentColor" />
            </svg>
          </span>

          <span className="folio-fold__ledger" aria-hidden="true">
            <span className="folio-fold__ledger-cell">
              <span className="folio-fold__ledger-key">pulls</span>
              <span className="folio-fold__ledger-value">
                <em>{String(pullCount).padStart(2, '0')}</em>
                <span className="folio-fold__ledger-suffix">{pullCount === 1 ? 'pull' : 'pulls'}</span>
              </span>
            </span>
            <span className="folio-fold__ledger-cell">
              <span className="folio-fold__ledger-key">marks</span>
              <span className="folio-fold__ledger-value">
                <em>{String(wordCount).padStart(2, '0')}</em>
                <span className="folio-fold__ledger-suffix">{wordCount === 1 ? 'mark' : 'marks'}</span>
              </span>
            </span>
            <span className="folio-fold__ledger-cell">
              <span className="folio-fold__ledger-key">voices</span>
              <span className="folio-fold__ledger-value">
                <em>{String(voiceCount).padStart(2, '0')}</em>
                <span className="folio-fold__ledger-suffix">{voiceCount === 1 ? 'set' : 'sets'}</span>
              </span>
            </span>
            <span className="folio-fold__ledger-cell folio-fold__ledger-cell--date">
              <span className="folio-fold__ledger-key">set today</span>
              <span className="folio-fold__ledger-value folio-fold__ledger-date">{setToday}</span>
            </span>
          </span>

          <span className="folio-fold__status-kbd" aria-hidden="true">
            <kbd>shift</kbd>
            <span aria-hidden="true">+</span>
            <kbd>v</kbd>
            <span className="folio-fold__status-kbd-tag">cycle the voice</span>
          </span>
        </div>
      </div>

      <button
        type="button"
        className="folio-fold__hinge"
        aria-label="Fold the page — the next folio is the press bed"
        onClick={() => {
          const target = document.getElementById('press')
          if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }}
      >
        <span className="folio-fold__hinge-rule folio-fold__hinge-rule--lead" aria-hidden="true">
          <svg viewBox="0 0 220 8" preserveAspectRatio="none">
            <path d="M2 4c20-3 40 3 60 0s40-3 60 0 40 3 60 0 36-3 38 0" fill="none" stroke="currentColor" strokeWidth=".7" strokeLinecap="round" />
            <circle cx="218" cy="4" r="1.1" fill="currentColor" />
          </svg>
        </span>
        <span className="folio-fold__hinge-fold" aria-hidden="true">
          <svg viewBox="0 0 72 32" preserveAspectRatio="none">
            <g filter={`url(#${hingeGrainId})`}>
              <path
                d="M2 16c12-10 24 10 36 0s24-10 32 1"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.1"
                strokeLinecap="round"
                pathLength="100"
                className="folio-fold__hinge-fold-stroke"
              />
            </g>
            <circle cx="2" cy="16" r="1.4" fill="currentColor" />
            <circle cx="70" cy="16" r="1.4" fill="currentColor" />
            <circle cx="36" cy="16" r="2.6" fill="currentColor" className="folio-fold__hinge-fold-bead" />
            <circle cx="36" cy="16" r="5.5" fill="none" stroke="currentColor" strokeWidth=".4" className="folio-fold__hinge-fold-ring" />
          </svg>
        </span>
        <span className="folio-fold__hinge-tag">
          <span className="folio-fold__hinge-tag-mark" aria-hidden="true">↓</span>
          <em>fold · the page · turn</em>
          <span className="folio-fold__hinge-tag-mark" aria-hidden="true">↓</span>
        </span>
        <span className="folio-fold__hinge-rule folio-fold__hinge-rule--trail" aria-hidden="true">
          <svg viewBox="0 0 220 8" preserveAspectRatio="none">
            <path d="M2 4c20-3 40 3 60 0s40-3 60 0 40 3 60 0 36-3 38 0" fill="none" stroke="currentColor" strokeWidth=".7" strokeLinecap="round" />
            <circle cx="2" cy="4" r="1.1" fill="currentColor" />
          </svg>
        </span>
        <span className="folio-fold__hinge-foot" aria-hidden="true">
          <span className="folio-fold__hinge-foot-rule" />
          <span className="folio-fold__hinge-foot-tag">
            <span className="folio-fold__hinge-foot-letter" aria-hidden="true">ii</span>
            <em>folio ii · the press bed</em>
            <span className="folio-fold__hinge-foot-letter" aria-hidden="true">ii</span>
          </span>
          <span className="folio-fold__hinge-foot-rule folio-fold__hinge-foot-rule--alt" />
        </span>

        <span className="folio-fold__hinge-wax" aria-hidden="true">
          <span className="folio-fold__hinge-wax-drop" />
          <span className="folio-fold__hinge-wax-bead" />
        </span>
      </button>

      <span className="folio-fold__faceprint" aria-hidden="true">
        <span className="folio-fold__faceprint-cell">
          <span className="folio-fold__faceprint-key">face</span>
          <em>{VOICE_FACE[voice]}</em>
        </span>
        <span className="folio-fold__faceprint-rule" aria-hidden="true" />
        <span className="folio-fold__faceprint-cell">
          <span className="folio-fold__faceprint-key">mark</span>
          <em>{WORD_LABEL[word]}</em>
        </span>
        <span className="folio-fold__faceprint-rule" aria-hidden="true" />
        <span className="folio-fold__faceprint-cell">
          <span className="folio-fold__faceprint-key">voice</span>
          <em>{VOICE_LETTER[voice]} · {VOICE_LABEL[voice]}</em>
        </span>
      </span>

      <span className="sr-only" aria-live="polite">
        {`Press status: ${armed ? 'armed' : 'at rest'}, set in ${VOICE_LABEL[voice]}, marked at ${WORD_LABEL[word]}, ${pullCount} ${pullCount === 1 ? 'pull' : 'pulls'}, ${wordCount} ${wordCount === 1 ? 'mark' : 'marks'}, on ${setToday}.`}
      </span>
    </section>
  )
}
