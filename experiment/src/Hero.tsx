import {
  useId,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type MutableRefObject,
} from 'react'
import type { VoiceId } from './App'
import type { WordId } from './notes'

type HeroProps = {
  voice: VoiceId
  word: WordId
  hover: WordId | null
  setToday: string
  onVoice: (voice: VoiceId) => void
  onWord: (word: WordId, focus?: boolean) => void
  onHover: (word: WordId | null) => void
  onWordKey: (event: ReactKeyboardEvent<HTMLButtonElement>, id: WordId) => void
  tokenRefs: MutableRefObject<Partial<Record<WordId, HTMLButtonElement | null>>>
}

type VoiceSpec = {
  name: string
  face: string
  letter: string
  sample: string
  gloss: string
}

const VOICE: Record<VoiceId, VoiceSpec> = {
  quiet: {
    name: 'quiet cut',
    face: 'serif · italic · close set',
    letter: 'a',
    sample: 'is m³ good at frontend yet?',
    gloss: 'the default voice',
  },
  human: {
    name: 'human hand',
    face: 'serif · italic · warm',
    letter: 'b',
    sample: 'is M3 good at frontend yet?',
    gloss: 'the middle voice',
  },
  bold: {
    name: 'bold signal',
    face: 'sans · heavy · no apology',
    letter: 'c',
    sample: 'IS M3 GOOD AT FRONTEND YET?',
    gloss: 'the loud voice',
  },
}

type TokenCopy = {
  label: string
  glyph: string
  tone: string
}

const TOKEN_COPY: Record<WordId, TokenCopy> = {
  m3: { label: 'm³', glyph: '⌇', tone: 'the maker' },
  good: { label: 'good at', glyph: '∧', tone: 'the verb' },
  yet: { label: 'yet', glyph: '?', tone: 'the pause' },
}

const ORDER: VoiceId[] = ['quiet', 'human', 'bold']

export function Hero({
  voice,
  word,
  hover,
  setToday,
  onVoice,
  onWord,
  onHover,
  onWordKey,
  tokenRefs,
}: HeroProps) {
  const baseId = useId().replace(/:/g, '')
  const grainId = `hero-grain-${baseId}`
  const spec = VOICE[voice]
  const toneStyle = { '--hero-tone': `var(--${voice})` } as CSSProperties
  const isYet = word === 'yet'

  return (
    <div className="hero__inner">
      <div className="hero__title-block" style={toneStyle}>
        <svg className="hero__defs" viewBox="0 0 1200 800" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <filter id={grainId} x="-2%" y="-2%" width="104%" height="104%">
              <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="23" stitchTiles="stitch" />
              <feColorMatrix type="matrix" values="0 0 0 0 .14  0 0 0 0 .12  0 0 0 0 .19  0 0 0 .04 0" />
              <feComposite in2="SourceGraphic" operator="in" />
            </filter>
          </defs>
        </svg>

        <span className="hero__stage-grain" aria-hidden="true">
          <svg viewBox="0 0 1200 800" preserveAspectRatio="none">
            <rect x="0" y="0" width="1200" height="800" filter={`url(#${grainId})`} opacity=".04" />
          </svg>
        </span>

        <div className="hero__eyebrow-row">
          <span className="hero__eyebrow">
            <span className="hero__eyebrow-glyph" aria-hidden="true">¶</span>
            <span>folio i</span>
            <span className="hero__eyebrow-sep" aria-hidden="true">·</span>
            <span className="hero__eyebrow-em">the question</span>
          </span>
          <span className="hero__set">
            <em>set on</em>
            <em className="hero__eyebrow-em">{setToday}</em>
          </span>
        </div>

        <div className="hero__qmark" aria-hidden="true">
          <QMarkGlyph voice={voice} />
          <span className="hero__qmark-cap">
            <em>punctuation protagonist</em>
            <span aria-hidden="true">·</span>
            <em>draws itself</em>
          </span>
        </div>

        <h1
          id="hero-title-label"
          className={`hero__title hero__title--${voice}`}
          aria-label="is Minimax M3 good at frontend yet?"
        >
          <span className="hero__title-line hero__title-line-a">
            <span
              className={`ht__word ht__word--m3 ${word === 'm3' ? 'is-marked' : ''} ${hover === 'm3' ? 'is-hover' : ''}`}
              aria-hidden="true"
            >
              {word === 'm3' && <span className="ht__glyph">{TOKEN_COPY.m3.glyph}</span>}
              <button
                type="button"
                ref={node => {
                  tokenRefs.current.m3 = node
                }}
                className="ht__token"
                onClick={() => onWord('m3')}
                onMouseEnter={() => onHover('m3')}
                onMouseLeave={() => onHover(null)}
                onFocus={() => onHover('m3')}
                onBlur={() => onHover(null)}
                onKeyDown={event => onWordKey(event, 'm3')}
                aria-pressed={word === 'm3'}
                aria-label={`${TOKEN_COPY.m3.label} — ${TOKEN_COPY.m3.tone}`}
              >
                {TOKEN_COPY.m3.label}
              </button>
            </span>

            <span className="hero__title-space" aria-hidden="true"> </span>

            <span
              className={`ht__word ht__word--good ${word === 'good' ? 'is-marked' : ''} ${hover === 'good' ? 'is-hover' : ''}`}
              aria-hidden="true"
            >
              {word === 'good' && <span className="ht__glyph">{TOKEN_COPY.good.glyph}</span>}
              <button
                type="button"
                ref={node => {
                  tokenRefs.current.good = node
                }}
                className="ht__token"
                onClick={() => onWord('good')}
                onMouseEnter={() => onHover('good')}
                onMouseLeave={() => onHover(null)}
                onFocus={() => onHover('good')}
                onBlur={() => onHover(null)}
                onKeyDown={event => onWordKey(event, 'good')}
                aria-pressed={word === 'good'}
                aria-label={`${TOKEN_COPY.good.label} — ${TOKEN_COPY.good.tone}`}
              >
                {TOKEN_COPY.good.label}
              </button>
            </span>

            <span className="hero__title-space" aria-hidden="true"> </span>

            <span className="ht__word ht__word--plain" aria-hidden="true">frontend</span>
          </span>

          <span className="hero__title-line hero__title-line-b">
            <span
              className={`ht__word ht__word--yet ${word === 'yet' ? 'is-marked' : ''} ${hover === 'yet' ? 'is-hover' : ''} ${isYet ? 'ht__word--punct' : ''}`}
              aria-hidden="true"
            >
              {word === 'yet' && <span className="ht__glyph">{TOKEN_COPY.yet.glyph}</span>}
              <button
                type="button"
                ref={node => {
                  tokenRefs.current.yet = node
                }}
                className="ht__token"
                onClick={() => onWord('yet')}
                onMouseEnter={() => onHover('yet')}
                onMouseLeave={() => onHover(null)}
                onFocus={() => onHover('yet')}
                onBlur={() => onHover(null)}
                onKeyDown={event => onWordKey(event, 'yet')}
                aria-pressed={word === 'yet'}
                aria-label={`${TOKEN_COPY.yet.label} — ${TOKEN_COPY.yet.tone}`}
              >
                <span className="ht__token-yet">yet</span>
                <span className={`ht__punct ht__punct--${voice}`} aria-hidden="true">
                  ?
                  <span className="ht__punct-ghost ht__punct-ghost--a" aria-hidden="true">?</span>
                  <span className="ht__punct-ghost ht__punct-ghost--b" aria-hidden="true">?</span>
                </span>
              </button>
            </span>
          </span>
        </h1>

        <span className="hero__sub" aria-hidden="true">
          <span className="hero__sub-mark">⌇</span>
          <em>set in {spec.name.toLowerCase()}</em>
          <span className="hero__sub-rule" />
          <em>read at hand</em>
          <span className="hero__sub-mark">⌇</span>
        </span>

        <div className="hero__foot">
          <span className="hero__foot-cell">
            <span className="hero__foot-key">marked at</span>
            <em className="hero__foot-val">
              {word === 'm3' && <span className="hero__sub-mark" aria-hidden="true">⌇</span>}
              {word === 'good' && <span className="hero__sub-mark" aria-hidden="true">∧</span>}
              {word === 'yet' && <span className="hero__sub-mark" aria-hidden="true">?</span>}
              <em>{TOKEN_COPY[word].label}</em>
              <em className="hero__foot-face">· {TOKEN_COPY[word].tone}</em>
            </em>
          </span>
          <span className="hero__foot-cell">
            <span className="hero__foot-key">voice</span>
            <em className="hero__foot-val">
              <span className="hero__foot-letter">{spec.letter}</span>
              <em>{spec.name}</em>
              <em className="hero__foot-face">· {spec.face}</em>
            </em>
          </span>
          <span className="hero__foot-cell">
            <span className="hero__foot-key">cycle</span>
            <em className="hero__foot-val hero__foot-keys">
              <kbd>shift</kbd>+<kbd>v</kbd>
            </em>
          </span>
        </div>
      </div>

      <aside
        className="voice-spec"
        role="radiogroup"
        aria-label="Voice specimen · the line set in three voices"
      >
        <header className="voice-spec__head" aria-hidden="true">
          <span className="voice-spec__key">the line, three ways</span>
          <span className="voice-spec__hint">
            <em>set the page in that voice</em>
          </span>
        </header>

        <ol className="voice-spec__list">
          {ORDER.map(v => {
            const row = VOICE[v]
            const isActive = voice === v
            return (
              <li key={v} className="voice-spec__row">
                <button
                  type="button"
                  role="radio"
                  aria-checked={isActive}
                  className={`voice-spec__item voice-spec__item--${v} ${isActive ? 'is-active' : ''}`}
                  onClick={() => onVoice(v)}
                >
                  <span className="voice-spec__letter" aria-hidden="true">{row.letter}</span>
                  <span className="voice-spec__body">
                    <span className={`voice-spec__sample voice-spec__sample--${v}`}>{row.sample}</span>
                  </span>
                  <span className="voice-spec__meta" aria-hidden="true">
                    <span className="voice-spec__meta-name">{row.name}</span>
                    <span className="voice-spec__meta-face">{row.gloss}</span>
                  </span>
                </button>
              </li>
            )
          })}
        </ol>

        <footer className="voice-spec__foot" aria-hidden="true">
          <span className="voice-spec__foot-rule" />
          <em>three voices, one line</em>
          <span className="voice-spec__foot-rule" />
        </footer>
      </aside>
    </div>
  )
}

function QMarkGlyph({ voice }: { voice: VoiceId }) {
  const isBold = voice === 'bold'
  return (
    <svg className="hero__qmark-svg" viewBox="0 0 240 320" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        {/* main stroke · draws itself on arrival */}
        <path
          className="hero__qmark-stroke"
          d="M55 90 Q55 36 120 36 Q186 36 186 96 Q186 134 156 162 Q120 196 120 224"
          strokeWidth={isBold ? 14 : 8}
        />
        {/* soft inner echo */}
        <path
          className="hero__qmark-echo"
          d="M62 92 Q62 44 120 44 Q178 44 178 96 Q178 130 152 156 Q124 184 124 220"
          stroke="currentColor"
          strokeOpacity={isBold ? 0 : .35}
          strokeWidth="1.4"
        />
      </g>
      {/* bead · pops in after the stroke */}
      <g className="hero__qmark-bead">
        <circle cx="120" cy="270" r={isBold ? 13 : 11} fill="currentColor" />
        <circle cx="120" cy="270" r={isBold ? 20 : 18} fill="none" stroke="currentColor" strokeOpacity=".3" strokeWidth="1.2" />
        <circle cx="120" cy="270" r={isBold ? 26 : 24} fill="none" stroke="currentColor" strokeOpacity=".18" strokeWidth=".8" strokeDasharray="1.5 2.5" />
      </g>
    </svg>
  )
}