import {
  useId,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type MutableRefObject,
} from 'react'
import type { VoiceId } from './App'
import type { WordId } from './notes'
import { PrinterFlourish } from './PrinterFlourish'

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
  glyph: string
  gloss: string
}

const VOICE: Record<VoiceId, VoiceSpec> = {
  quiet: {
    name: 'quiet cut',
    face: 'serif · italic · close set',
    letter: 'a',
    sample: 'is m³ good at frontend yet?',
    glyph: '⌇',
    gloss: 'the default voice · read low',
  },
  human: {
    name: 'human hand',
    face: 'serif · italic · warm',
    letter: 'b',
    sample: 'is M3 good at frontend yet?',
    glyph: '∧',
    gloss: 'the middle voice · read at hand',
  },
  bold: {
    name: 'bold signal',
    face: 'sans · heavy · no apology',
    letter: 'c',
    sample: 'IS M3 GOOD AT FRONTEND YET?',
    glyph: '∴',
    gloss: 'the loud voice · read once',
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
      <article className="hero__stage" style={toneStyle} aria-labelledby="hero-title-label">
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
            <rect x="0" y="0" width="1200" height="800" filter={`url(#${grainId})`} opacity=".045" />
          </svg>
        </span>

        <header className="hero__stage-head">
          <span className="hero__stage-eyebrow">
            <span className="hero__stage-mark" aria-hidden="true">¶</span>
            <span>folio i</span>
            <span className="hero__stage-eyebrow-sep" aria-hidden="true">·</span>
            <span>the question</span>
          </span>
          <span className="hero__stage-set">
            <em>set on</em>
            <em className="hero__stage-set-date">{setToday}</em>
          </span>
        </header>

        <div className="hero__flourish" aria-hidden="true">
          <PrinterFlourish voice={voice} />
        </div>

        <h1
          id="hero-title-label"
          className={`hero__title hero__title--${voice}`}
          aria-label="is Minimax M3 good at frontend yet?"
        >
          <span className="hero__title-row hero__title-row--line hero__title-row--line-a">
            <span className="hero__title-word hero__title-word--plain">is</span>
            <span className="hero__title-space" aria-hidden="true" />

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

            <span className="hero__title-space" aria-hidden="true" />

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
          </span>

          <span className="hero__title-row hero__title-row--line hero__title-row--line-b">
            <span className="hero__title-word hero__title-word--plain">frontend</span>
            <span className="hero__title-space" aria-hidden="true" />

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
                className="ht__token ht__token--yet"
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
                <span className={`ht__token-punct ht__token-punct--${voice}`} aria-hidden="true">?</span>
              </button>
            </span>
          </span>

          <span className="hero__title-row hero__title-row--sub" aria-hidden="true">
            <span className="hero__title-sub-mark">⌇</span>
            <em>set in {spec.name.toLowerCase()}</em>
            <span className="hero__title-sub-rule" />
            <em>read at hand</em>
            <span className="hero__title-sub-mark">⌇</span>
          </span>
        </h1>

        <div className="hero__stage-rule hero__stage-rule--bot" aria-hidden="true">
          <span className="hero__stage-rule-tick" />
          <span className="hero__stage-rule-tick" />
          <span className="hero__stage-rule-tick" />
          <span className="hero__stage-rule-line" />
          <span className="hero__stage-rule-tick" />
          <span className="hero__stage-rule-tick" />
          <span className="hero__stage-rule-tick" />
        </div>

        <footer className="hero__stage-foot">
          <span className="hero__stage-foot-cell hero__stage-foot-cell--key">
            <span className="hero__stage-foot-key">reading</span>
            <em className="hero__stage-foot-mark">
              {word === 'm3' && <>⌇ stet</>}
              {word === 'good' && <>∧ caret</>}
              {word === 'yet' && <>? query</>}
            </em>
          </span>
          <span className="hero__stage-foot-cell hero__stage-foot-cell--voice">
            <span className="hero__stage-foot-key">voice</span>
            <em className="hero__stage-foot-voice">
              <span className="hero__stage-foot-letter">{spec.letter}</span>
              {spec.name}
              <span className="hero__stage-foot-face">· {spec.face}</span>
            </em>
          </span>
          <span className="hero__stage-foot-cell hero__stage-foot-cell--hint">
            <span className="hero__stage-foot-key">cycle</span>
            <em className="hero__stage-foot-keys">
              <kbd>shift</kbd>+<kbd>v</kbd>
            </em>
          </span>
        </footer>
      </article>

      <aside
        className="voice-spec"
        role="radiogroup"
        aria-label="Voice specimen · the line set in three voices"
      >
        <header className="voice-spec__head" aria-hidden="true">
          <span className="voice-spec__key">the line set three ways</span>
          <span className="voice-spec__hint">
            <em>click a row to set the page in that voice</em>
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
                  <span className={`voice-spec__sample voice-spec__sample--${v}`}>{row.sample}</span>
                  <span className="voice-spec__meta" aria-hidden="true">
                    <span className="voice-spec__name">{row.name}</span>
                    <span className="voice-spec__face">{row.face}</span>
                  </span>
                  <span className="voice-spec__pip" aria-hidden="true">
                    <span className="voice-spec__pip-bead" />
                  </span>
                </button>
              </li>
            )
          })}
        </ol>

        <footer className="voice-spec__foot" aria-hidden="true">
          <span className="voice-spec__foot-rule" />
          <em>three voices, one line, set on {setToday}</em>
          <span className="voice-spec__foot-rule" />
        </footer>
      </aside>
    </div>
  )
}