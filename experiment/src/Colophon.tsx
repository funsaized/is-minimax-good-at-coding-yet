import type { CSSProperties } from 'react'
import type { VoiceId } from './App'
import type { WordId } from './notes'
import { PrinterFlourish } from './PrinterFlourish'

type ColophonProps = {
  voice: VoiceId
  word: WordId
  pullSignal: number
  pullCount: number
  setToday: string
}

const VOICE_NAME: Record<VoiceId, string> = { quiet: 'quiet cut', human: 'human hand', bold: 'bold signal' }
const VOICE_LETTER: Record<VoiceId, string> = { quiet: 'A', human: 'B', bold: 'C' }
const VOICE_FACE: Record<VoiceId, string> = {
  quiet: 'serif · italic · close set',
  human: 'serif · italic · warm',
  bold: 'sans · heavy · no apology',
}
const VOICE_MARK: Record<VoiceId, { glyph: string; label: string; sub: string }> = {
  quiet: { glyph: '⌇', label: 'stet', sub: 'let it stand' },
  human: { glyph: '∧', label: 'caret', sub: 'make room' },
  bold:  { glyph: '∴', label: 'query', sub: 'protect the pause' },
}
const WORD_LABEL: Record<WordId, string> = { m3: 'm³', good: 'good at', yet: 'yet?' }
const WORD_MARK: Record<WordId, string> = { m3: 'stet', good: 'caret', yet: 'query' }
const WORD_NOTE: Record<WordId, string> = {
  m3: 'keep the fingerprint',
  good: 'choose one clear thing',
  yet: 'protect the pause',
}

const VOICE_ORDER: VoiceId[] = ['quiet', 'human', 'bold']

const SEAL_TEXT: Record<VoiceId, { top: string; bot: string; glyph: string }> = {
  quiet: { top: 'PRESS · SET', bot: 'FOLIO · TODAY', glyph: 'm³ · folio v' },
  human: { top: 'SET BY HAND', bot: 'FOR NOW', glyph: 'm³ · folio v' },
  bold: { top: 'M³ · YES · M³', bot: 'AGAIN', glyph: 'M³ · FOLIO V' },
}

const SIGN_OFF_NOTE: Record<VoiceId, string> = {
  quiet: 'the quiet cut says it as softly as it can',
  human: 'the human hand sets it by hand, in warmth',
  bold: 'the bold signal says it once, at full height',
}

const LEDGER_NOTE: Record<VoiceId, string> = {
  quiet: 'the line, set so the reader hears themselves in it.',
  human: 'the line, set by hand so the page warms.',
  bold:  'the line, set at full height so it can be heard once.',
}

export function Colophon({ voice, word, pullSignal, pullCount, setToday }: ColophonProps) {
  const tone = voice === 'quiet' ? 'var(--quiet)' : voice === 'human' ? 'var(--human)' : 'var(--bold)'
  const sealStyle = { color: tone } as CSSProperties
  const seal = SEAL_TEXT[voice]

  return (
    <section className="colophon reveal" id="colophon" aria-labelledby="colophon-title">
      <div className="colophon__inner">
        <header className="colophon__head">
          <span className="colophon__eyebrow">the colophon</span>
          <h2 id="colophon-title" className="colophon__title">
            The page <em>signed off,</em>
            <br />
            and the question left open.
          </h2>
          <p className="section__lede">
            A colophon is where a book tells you how it was made. This one is the short list of choices
            that earned their place on the page — and the one that didn't. Set at first light, for the
            reader who arrived in the dark.
          </p>
        </header>

        <div className="colophon__body">
          <p className="colophon__line">
            Composed in three voices for the same line, this page is a small drawing of an
            honest process — <em>quiet by default, bold on demand, and human in the middle.</em>
            The answer, when it unfolds, is set the same way: three readings on the same plate,
            converging on a single line at the foot of the broadside.
          </p>

          <div className="colophon__meta">
            <div className="colophon__cell">
              <span className="colophon__cell-key">composed in</span>
              <em>{VOICE_LETTER[voice]} · {VOICE_NAME[voice]}</em>
            </div>
            <div className="colophon__cell">
              <span className="colophon__cell-key">marked at</span>
              <em>{WORD_LABEL[word]} · {WORD_MARK[word]}</em>
            </div>
            <div className="colophon__cell">
              <span className="colophon__cell-key">set on</span>
              <em>{setToday}</em>
            </div>
            <div className="colophon__cell">
              <span className="colophon__cell-key">the rule</span>
              <em>{WORD_NOTE[word]}</em>
            </div>
          </div>

          <div className="colophon__ledger" aria-label="The three voices, kept today">
            <span className="colophon__ledger-head">
              <em className="colophon__ledger-eyebrow">the three readings</em>
              <span className="colophon__ledger-rule" aria-hidden="true" />
              <em className="colophon__ledger-meta">set today, kept here</em>
            </span>
            <div className="colophon__ledger-board">
              <span className="colophon__ledger-cord" aria-hidden="true">
                <span className="colophon__ledger-knot colophon__ledger-knot--l" />
                <span className="colophon__ledger-line" />
                <span className="colophon__ledger-knot colophon__ledger-knot--r" />
              </span>
              <ol className="colophon__ledger-list">
                {VOICE_ORDER.map(v => (
                  <ColophonSlip key={v} voice={v} active={voice === v} />
                ))}
              </ol>
              <span className="colophon__ledger-tail" aria-hidden="true">
                <em>three readings</em>
                <span>·</span>
                <em>one page</em>
                <span>·</span>
                <em>kept today</em>
              </span>
            </div>
          </div>

          <div className="colophon__flourish" aria-hidden="true">
            <PrinterFlourish voice={voice} />
          </div>

          <figure className="colophon__compositor" aria-label="The compositor, signing off">
            <svg className="colophon__compositor-mark" viewBox="0 0 64 18" aria-hidden="true">
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
              <em>signing off —</em>
              <span>{SIGN_OFF_NOTE[voice]}.</span>
            </figcaption>
          </figure>

          <div className="colophon__signoff" aria-label="The page, signed">
            <svg className={`colophon__seal colophon__seal--${voice}`} viewBox="0 0 100 100" aria-hidden="true" style={sealStyle}>
              <defs>
                <radialGradient id={`col-seal-glow-${voice}`} cx="50%" cy="40%" r="60%">
                  <stop offset="0%" stopColor="currentColor" stopOpacity="0.18" />
                  <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
                </radialGradient>
                <radialGradient id={`col-seal-fill-${voice}`} cx="42%" cy="38%" r="62%">
                  <stop offset="0%" stopColor={voice === 'quiet' ? 'rgba(168, 197, 255, 0.55)' : voice === 'human' ? 'rgba(244, 132, 114, 0.6)' : 'rgba(205, 238, 106, 0.6)'} />
                  <stop offset="60%" stopColor={voice === 'quiet' ? 'rgba(120, 158, 240, 0.9)' : voice === 'human' ? 'rgba(216, 80, 64, 0.9)' : 'rgba(168, 214, 50, 0.9)'} />
                  <stop offset="100%" stopColor="rgba(8, 10, 18, 0.85)" />
                </radialGradient>
              </defs>
              <circle cx="50" cy="50" r="48" fill={`url(#col-seal-glow-${voice})`} />
              <circle cx="50" cy="50" r="46" fill={`url(#col-seal-fill-${voice})`} stroke="currentColor" strokeWidth="1.1" strokeOpacity=".75" />
              <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth=".4" strokeDasharray="1 2.5" opacity=".55" />
              <circle cx="50" cy="50" r="35" fill="none" stroke="rgba(255, 255, 255, 0.35)" strokeWidth=".3" />
              <circle cx="50" cy="50" r="28" fill="none" stroke="rgba(255, 255, 255, 0.18)" strokeWidth=".25" />

              {/* the engraving — a small press-and-dawn emblem, matching the answer seal */}
              <g className="colophon__seal-engraving">
                <circle cx="50" cy="46" r="9" fill="rgba(8, 10, 18, 0.92)" />
                <circle cx="50" cy="46" r="9" fill="none" stroke="rgba(245, 238, 216, .35)" strokeWidth=".35" strokeDasharray=".6 1.4" />
                <circle cx="54" cy="44" r="8" fill={`url(#col-seal-fill-${voice})`} />
                <line x1="32" y1="56" x2="68" y2="56" stroke="rgba(8, 10, 18, 0.92)" strokeWidth=".7" strokeLinecap="round" />
                <circle cx="40" cy="56" r="1.2" fill="rgba(8, 10, 18, 0.92)" />
                <circle cx="60" cy="56" r="1.2" fill="rgba(8, 10, 18, 0.92)" />
                <line x1="50" y1="32" x2="50" y2="38" stroke="rgba(8, 10, 18, 0.92)" strokeWidth=".45" strokeLinecap="round" />
              </g>

              <circle cx="50" cy="6" r="1.4" fill="rgba(8, 10, 18, 0.85)" />
              <circle cx="50" cy="94" r="1.4" fill="rgba(8, 10, 18, 0.85)" />
              <circle cx="6" cy="50" r="1.4" fill="rgba(8, 10, 18, 0.85)" />
              <circle cx="94" cy="50" r="1.4" fill="rgba(8, 10, 18, 0.85)" />
              <path d="M28 22 Q36 28 32 36 Q26 46 32 56 Q40 66 36 78" fill="none" stroke="rgba(8, 10, 18, 0.18)" strokeWidth=".55" />
              <path d="M72 22 Q64 28 68 36 Q74 46 68 56 Q60 66 64 78" fill="none" stroke="rgba(8, 10, 18, 0.18)" strokeWidth=".55" />

              <text x="50" y="22" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="5" letterSpacing="2" fill="rgba(8, 10, 18, 0.92)">
                {seal.top}
              </text>
              <text x="50" y="74" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="3.6" letterSpacing="1.4" fill="rgba(8, 10, 18, 0.92)">
                {seal.glyph}
              </text>
              <text x="50" y="86" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="5" letterSpacing="2" fill="rgba(8, 10, 18, 0.92)">
                {seal.bot}
              </text>
            </svg>

            <p className="colophon__signoff-line">
              a single line, set three ways, marked at <em>{WORD_LABEL[word]}</em> — <em>{WORD_NOTE[word]}</em>.
            </p>

            <span className="colophon__signoff-set">
              <span className="colophon__signoff-rule" aria-hidden="true" />
              composed in {VOICE_NAME[voice]}
              <em>· {setToday}</em>
              <span className="colophon__signoff-rule" aria-hidden="true" />
            </span>

            <span className="colophon__signoff-impressions" aria-hidden="true">
              <em>{String(pullCount).padStart(3, '0')}</em>
              <span className="colophon__signoff-impressions-rule" />
              <span className="colophon__signoff-impressions-key">impressions on the day</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}

function ColophonSlip({ voice, active }: { voice: VoiceId; active: boolean }) {
  const mark = VOICE_MARK[voice]
  return (
    <li className={`colophon-slip colophon-slip--${voice} ${active ? 'is-active' : ''}`}>
      <span className="colophon-slip__pin" aria-hidden="true">
        <svg viewBox="0 0 18 18">
          <circle cx="9" cy="8" r="5" fill="currentColor" opacity=".85" />
          <circle cx="9" cy="8" r="5" fill="none" stroke="var(--night)" strokeWidth=".4" opacity=".55" />
          <circle cx="9" cy="8" r="1.6" fill="var(--night)" />
          <line x1="9" y1="11" x2="9" y2="17" stroke="currentColor" strokeWidth=".9" strokeLinecap="round" opacity=".75" />
        </svg>
      </span>
      <header className="colophon-slip__head">
        <span className="colophon-slip__letter">{VOICE_LETTER[voice]}</span>
        <span className="colophon-slip__stack">
          <em className="colophon-slip__name">{VOICE_NAME[voice]}</em>
          <span className="colophon-slip__face">{VOICE_FACE[voice]}</span>
        </span>
      </header>
      <p className="colophon-slip__line">{LEDGER_NOTE[voice]}</p>
      <footer className="colophon-slip__foot">
        <span className="colophon-slip__rule" />
        <span className="colophon-slip__mark">
          <span className="colophon-slip__mark-glyph">{mark.glyph}</span>
          <em>{mark.label}</em>
          <span className="colophon-slip__mark-sub">· {mark.sub}</span>
        </span>
      </footer>
      <span className="colophon-slip__kept" aria-hidden="true">
        <em>{active ? 'kept · on the page' : 'kept · in the press'}</em>
      </span>
    </li>
  )
}