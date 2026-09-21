import type {
  MutableRefObject,
  KeyboardEvent as ReactKeyboardEvent,
  CSSProperties,
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
  glyph: string
}

const VOICE: Record<VoiceId, VoiceSpec> = {
  quiet: {
    name: 'quiet cut',
    face: 'serif · italic · close set',
    letter: 'a',
    sample: 'is m³ good at frontend yet?',
    glyph: '⌇',
  },
  human: {
    name: 'human hand',
    face: 'serif · italic · warm',
    letter: 'b',
    sample: 'is M3 good at frontend yet?',
    glyph: '∧',
  },
  bold: {
    name: 'bold signal',
    face: 'sans · heavy',
    letter: 'c',
    sample: 'IS M3 GOOD AT FRONTEND YET?',
    glyph: '∴',
  },
}

const TOKEN_COPY: Record<WordId, { label: string; glyph: string; tone: string }> = {
  m3: { label: 'm³', glyph: '⌇', tone: 'the maker' },
  good: { label: 'good at', glyph: '∧', tone: 'the verb' },
  yet: { label: 'yet?', glyph: '?', tone: 'the pause' },
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
  return (
    <div className="hero__inner">
      <div className="hero__plate">
        <div className="hero__plate-rule hero__plate-rule--top" aria-hidden="true">
          <span className="hero__plate-rule-line" />
          <em>folio i · the question</em>
          <span className="hero__plate-rule-line" />
        </div>

        <h1
          id="hero-title-label"
          className={`hero__title hero__title--${voice}`}
          aria-label="is Minimax M3 good at frontend yet?"
        >
          <span aria-hidden="true">is </span>
          {(['m3', 'good', 'yet'] as WordId[]).map((id, idx) => {
            const isMarked = word === id
            const isHover = hover === id
            const copy = TOKEN_COPY[id]
            return (
              <span
                key={id}
                className={`ht__word ht__word--${id} ${isMarked ? 'is-marked' : ''} ${isHover ? 'is-hover' : ''}`}
                aria-hidden="true"
              >
                {isMarked && <span className="ht__glyph">{copy.glyph}</span>}
                <button
                  type="button"
                  ref={node => {
                    tokenRefs.current[id] = node
                  }}
                  className="ht__token"
                  onClick={() => onWord(id)}
                  onMouseEnter={() => onHover(id)}
                  onMouseLeave={() => onHover(null)}
                  onFocus={() => onHover(id)}
                  onBlur={() => onHover(null)}
                  onKeyDown={event => onWordKey(event, id)}
                  aria-pressed={isMarked}
                  aria-label={`${copy.label} — ${copy.tone}`}
                >
                  {copy.label}
                </button>
                {idx < 2 && <span aria-hidden="true"> </span>}
              </span>
            )
          })}
        </h1>

        <div className="hero__plate-rule hero__plate-rule--bot" aria-hidden="true">
          <span className="hero__plate-rule-line" />
          <em>set on {setToday} · {VOICE[voice].face}</em>
          <span className="hero__plate-rule-line" />
        </div>
      </div>

      <div
        className="voice-spec"
        role="radiogroup"
        aria-label="Voice specimen · the line set in three voices"
      >
        <header className="voice-spec__head" aria-hidden="true">
          <span className="voice-spec__key">the line set three ways</span>
          <span className="voice-spec__hint">
            <kbd>shift</kbd>+<kbd>v</kbd>
            <em>to cycle</em>
          </span>
        </header>

        <ol className="voice-spec__list">
          {ORDER.map(v => {
            const spec = VOICE[v]
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
                  <span className="voice-spec__letter" aria-hidden="true">{spec.letter}</span>
                  <span className={`voice-spec__sample voice-spec__sample--${v}`}>{spec.sample}</span>
                  <span className="voice-spec__meta" aria-hidden="true">
                    <span className="voice-spec__name">{spec.name}</span>
                    <span className="voice-spec__face">{spec.face}</span>
                  </span>
                  <span className="voice-spec__pip" aria-hidden="true">
                    <span className="voice-spec__pip-bead" />
                  </span>
                </button>
              </li>
            )
          })}
        </ol>
      </div>
    </div>
  )
}