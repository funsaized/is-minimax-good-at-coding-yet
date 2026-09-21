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
}

const VOICE: Record<VoiceId, VoiceSpec> = {
  quiet: {
    name: 'quiet cut',
    face: 'serif · italic',
    letter: 'a',
    sample: 'is m³ good at frontend yet?',
  },
  human: {
    name: 'human hand',
    face: 'serif · italic · warm',
    letter: 'b',
    sample: 'is M3 good at frontend yet?',
  },
  bold: {
    name: 'bold signal',
    face: 'sans · heavy',
    letter: 'c',
    sample: 'IS M3 GOOD AT FRONTEND YET?',
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
      <div className="hero__head">
        <div className="hero__meta" aria-hidden="true">
          <span>folio i</span>
          <em>set today · {setToday}</em>
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

        <span className="hero__composing" aria-hidden="true">
          <span className="hero__composing-rule">
            <span className="hero__composing-tick" style={{ left: '10%' }} />
            <span className="hero__composing-tick" style={{ left: '38%' }} />
            <span className="hero__composing-tick" style={{ left: '72%' }} />
          </span>
          <span className="hero__composing-meta">
            <em>set</em> 72pt <em>·</em> lead 76pt <em>·</em> track −30
          </span>
        </span>

        <p className="hero__under">
          <span className="hero__under-rule" aria-hidden="true" />
          A folio of one line, set in <em>three voices</em>. Hover the words to mark one at a time;
          pick a voice with the buttons on the right, or pull the lever below.
        </p>
      </div>

      <div className="voice-bar" role="group" aria-label="Voice selector · three settings for the headline">
        <span className="voice-bar__key" aria-hidden="true">set the line in</span>
        {ORDER.map(v => {
          const spec = VOICE[v]
          const isActive = voice === v
          return (
            <button
              key={v}
              type="button"
              className={`voice-bar__item voice-bar__item--${v} ${isActive ? 'is-active' : ''}`}
              onClick={() => onVoice(v)}
              aria-pressed={isActive}
              style={{ color: `var(--${v})` }}
            >
              <span className="voice-bar__letter" aria-hidden="true">{spec.letter}</span>
              <span className="voice-bar__copy">
                <span className="voice-bar__name">{spec.name}</span>
                <span className="voice-bar__face" aria-hidden="true">{spec.face}</span>
              </span>
              <span className="voice-bar__pip" aria-hidden="true" />
            </button>
          )
        })}
        <span className="voice-bar__hint" aria-hidden="true">
          <kbd>shift</kbd>+<kbd>v</kbd>
          to cycle
        </span>
      </div>
    </div>
  )
}
