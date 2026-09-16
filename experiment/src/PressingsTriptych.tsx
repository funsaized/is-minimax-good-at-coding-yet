import { useId, type CSSProperties, type KeyboardEvent, type MutableRefObject } from 'react'
import type { VoiceId } from './Press'
import type { WordId } from './notes'

type PressingsTriptychProps = {
  voice: VoiceId
  word: WordId
  hover: WordId | null
  setToday: string
  onVoice: (voice: VoiceId) => void
  onWord: (word: WordId, focus?: boolean) => void
  onHover: (word: WordId | null) => void
  tokenRefs: MutableRefObject<Partial<Record<WordId, HTMLSpanElement | null>>>
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

const VOICE_LETTER: Record<VoiceId, string> = { quiet: 'A', human: 'B', bold: 'C' }
const VOICE_TAGLINE: Record<VoiceId, string> = {
  quiet: 'gets out of the way',
  human: 'feels like a person',
  bold: 'answers with its whole chest',
}

type Display = {
  fontFamily: string
  fontWeight: number
  fontStyle: 'normal' | 'italic'
  tracking: string
  uppercased: boolean
}

const DISPLAY: Record<VoiceId, Display> = {
  quiet: { fontFamily: 'var(--serif)', fontWeight: 400, fontStyle: 'italic', tracking: '-0.014em', uppercased: false },
  human: { fontFamily: 'var(--serif)', fontWeight: 500, fontStyle: 'italic', tracking: '-0.012em', uppercased: false },
  bold: { fontFamily: 'var(--sans)', fontWeight: 800, fontStyle: 'normal', tracking: '-0.05em', uppercased: true },
}

const TOKEN_TEXT: Record<WordId, string> = { m3: 'M3', good: 'good at', yet: 'yet' }

const ORDER: VoiceId[] = ['quiet', 'human', 'bold']

function PressingToken({
  id,
  text,
  selected,
  hover,
  display,
  onSelect,
  onHover,
  onLeave,
  tokenRef,
}: {
  id: WordId
  text: string
  selected: boolean
  hover: boolean
  display: Display
  onSelect: (id: WordId) => void
  onHover: (id: WordId) => void
  onLeave: () => void
  tokenRef: (node: HTMLSpanElement | null) => void
}) {
  const label = display.uppercased ? text.toUpperCase() : text
  const style: CSSProperties = {
    fontFamily: display.fontFamily,
    fontWeight: display.fontWeight,
    fontStyle: display.fontStyle,
    letterSpacing: display.tracking,
  }
  return (
    <span
      ref={tokenRef}
      className={`pressings-token pressings-token--${id} ${selected ? 'is-selected' : ''} ${hover ? 'is-hover' : ''}`}
      style={style}
      data-word={id}
      role="button"
      tabIndex={0}
      aria-pressed={selected}
      aria-label={`Mark the word ${text} on the title`}
      onClick={(event) => {
        event.stopPropagation()
        onSelect(id)
      }}
      onMouseEnter={() => onHover(id)}
      onMouseLeave={onLeave}
      onFocus={() => onHover(id)}
      onBlur={onLeave}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onSelect(id)
        }
      }}
    >
      <span className="pressings-token__text">{label}</span>
      <span className="pressings-token__caret" aria-hidden="true">
        <svg viewBox="0 0 60 10" preserveAspectRatio="none">
          <path
            d="M2 6 C 12 2, 22 8, 32 4 S 50 2, 58 6"
            fill="none"
            stroke="currentColor"
            strokeWidth=".9"
            strokeLinecap="round"
          />
          <circle cx="58" cy="6" r="1.2" fill="currentColor" />
        </svg>
      </span>
    </span>
  )
}

function PressingRow({
  pressingVoice,
  isActive,
  word,
  hover,
  onVoice,
  onWord,
  onHover,
  onLeave,
  tokenRefs,
}: {
  pressingVoice: VoiceId
  isActive: boolean
  word: WordId
  hover: WordId | null
  onVoice: (voice: VoiceId) => void
  onWord: (word: WordId, focus?: boolean) => void
  onHover: (word: WordId | null) => void
  onLeave: () => void
  tokenRefs: MutableRefObject<Partial<Record<WordId, HTMLSpanElement | null>>>
}) {
  const tone = VOICE_TONE[pressingVoice]
  const style = {
    '--pressing-tone': tone,
  } as CSSProperties

  const handlePressingKey = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (isActive) {
      if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
        event.preventDefault()
        const next = ORDER[(ORDER.indexOf(pressingVoice) - 1 + ORDER.length) % ORDER.length]
        onVoice(next)
      } else if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
        event.preventDefault()
        const next = ORDER[(ORDER.indexOf(pressingVoice) + 1) % ORDER.length]
        onVoice(next)
      } else if (event.key === 'Home') {
        event.preventDefault()
        onVoice(ORDER[0])
      } else if (event.key === 'End') {
        event.preventDefault()
        onVoice(ORDER[ORDER.length - 1])
      }
      return
    }
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onVoice(pressingVoice)
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault()
      const next = ORDER[(ORDER.indexOf(pressingVoice) - 1 + ORDER.length) % ORDER.length]
      onVoice(next)
    } else if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault()
      const next = ORDER[(ORDER.indexOf(pressingVoice) + 1) % ORDER.length]
      onVoice(next)
    }
  }

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      tabIndex={isActive ? 0 : -1}
      className={`pressing-row pressing-row--${pressingVoice} ${isActive ? 'is-active' : ''}`}
      style={style}
      onClick={() => onVoice(pressingVoice)}
      onKeyDown={handlePressingKey}
      aria-label={`Pressing ${VOICE_LETTER[pressingVoice]} · ${VOICE_LABEL[pressingVoice]} · ${isActive ? 'currently set' : 'press to set this voice'}`}
    >
      <span className="pressing-row__head" aria-hidden="true">
        <span className="pressing-row__head-letter">{VOICE_LETTER[pressingVoice]}</span>
        <span className="pressing-row__head-name">{VOICE_LABEL[pressingVoice]}</span>
        <span className="pressing-row__head-rule" />
        <span className="pressing-row__head-tag">{VOICE_TAGLINE[pressingVoice]}</span>
      </span>

      <span className="pressing-row__line" aria-hidden={!isActive}>
        <span className={`pressing-row__phrase ${pressingVoice === 'bold' ? 'is-upper' : ''}`}>
          <em>is Minimax</em>
        </span>
        {isActive ? (
          <>
            <PressingToken
              id="m3"
              text={TOKEN_TEXT.m3}
              selected={word === 'm3'}
              hover={hover === 'm3'}
              display={DISPLAY[pressingVoice]}
              onSelect={(id) => onWord(id, true)}
              onHover={onHover}
              onLeave={onLeave}
              tokenRef={(node) => {
                tokenRefs.current.m3 = node
              }}
            />
            <PressingToken
              id="good"
              text={TOKEN_TEXT.good}
              selected={word === 'good'}
              hover={hover === 'good'}
              display={DISPLAY[pressingVoice]}
              onSelect={(id) => onWord(id, true)}
              onHover={onHover}
              onLeave={onLeave}
              tokenRef={(node) => {
                tokenRefs.current.good = node
              }}
            />
            <em className={`pressing-row__phrase ${pressingVoice === 'bold' ? 'is-upper' : ''}`}>frontend</em>
            <PressingToken
              id="yet"
              text={TOKEN_TEXT.yet}
              selected={word === 'yet'}
              hover={hover === 'yet'}
              display={DISPLAY[pressingVoice]}
              onSelect={(id) => onWord(id, true)}
              onHover={onHover}
              onLeave={onLeave}
              tokenRef={(node) => {
                tokenRefs.current.yet = node
              }}
            />
            <span className={`pressing-row__question ${pressingVoice === 'bold' ? 'is-upper' : ''}`} aria-hidden="true">?</span>
          </>
        ) : (
          <span className={`pressing-row__phrase pressing-row__phrase--ghost ${pressingVoice === 'bold' ? 'is-upper' : ''}`}>
            {pressingVoice === 'bold' ? 'M3 GOOD AT FRONTEND YET?' : 'M3 good at frontend yet?'}
          </span>
        )}
      </span>

      <span className="pressing-row__now" aria-hidden="true">
        {isActive ? (
          <>
            <span className="pressing-row__now-dot" />
            <span>set</span>
          </>
        ) : (
          <span className="pressing-row__now-tag">press to set</span>
        )}
      </span>
    </button>
  )
}

export function PressingsTriptych({
  voice,
  word,
  hover,
  setToday,
  onVoice,
  onWord,
  onHover,
  tokenRefs,
}: PressingsTriptychProps) {
  const baseId = useId().replace(/:/g, '')
  const ruleGrainId = `pressings-rule-${baseId}`
  const ruleGradientId = `pressings-rule-grad-${baseId}`
  const headlineId = `pressings-triptych-headline-${baseId}`
  const style = {
    '--pressings-rule-grain': `url(#${ruleGrainId})`,
  } as CSSProperties

  const voices: VoiceId[] = ['quiet', 'human', 'bold']

  return (
    <figure className="pressings-triptych" aria-labelledby={headlineId} style={style}>
      <svg className="pressings-triptych__defs" viewBox="0 0 1200 600" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <filter id={ruleGrainId} x="-2%" y="-50%" width="104%" height="200%">
            <feTurbulence type="fractalNoise" baseFrequency="2.4" numOctaves="2" seed="91" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .5 0" />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
          <linearGradient id={ruleGradientId} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
            <stop offset="14%" stopColor="currentColor" stopOpacity=".55" />
            <stop offset="50%" stopColor="currentColor" stopOpacity=".95" />
            <stop offset="86%" stopColor="currentColor" stopOpacity=".55" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      <span className="pressings-triptych__caption" aria-hidden="true">
        <span className="pressings-triptych__caption-mark" />
        folio i· · a typesetting case
        <span className="pressings-triptych__caption-mark pressings-triptych__caption-mark--alt" />
      </span>

      <figcaption className="pressings-triptych__headline">
        <h2 id={headlineId} className="pressings-triptych__headline-text">
          the line, <i>in three settings.</i>
        </h2>
        <p className="pressings-triptych__headline-lede">
          The same question, set three ways. Press any row to set the voice above. Mark a word on the active row to read it back. <em>Set on {setToday}</em>.
        </p>
      </figcaption>

      <div className="pressings-triptych__case" role="tablist" aria-label="Three pressings of the question, one per voice">
        <span className="pressings-triptych__case-rule pressings-triptych__case-rule--top" aria-hidden="true">
          <svg viewBox="0 0 1200 6" preserveAspectRatio="none">
            <g filter={`url(#${ruleGrainId})`}>
              <path d="M2 3 L1198 3" stroke={`url(#${ruleGradientId})`} strokeWidth=".7" fill="none" strokeLinecap="round" pathLength="100" />
            </g>
          </svg>
        </span>

        <span className="pressings-triptych__rows">
          {voices.map((v) => (
            <PressingRow
              key={`pressing-${v}`}
              pressingVoice={v}
              isActive={v === voice}
              word={word}
              hover={hover}
              onVoice={onVoice}
              onWord={onWord}
              onHover={onHover}
              onLeave={() => onHover(null)}
              tokenRefs={tokenRefs}
            />
          ))}
        </span>

        <span className="pressings-triptych__case-rule pressings-triptych__case-rule--bot" aria-hidden="true">
          <svg viewBox="0 0 1200 6" preserveAspectRatio="none">
            <g filter={`url(#${ruleGrainId})`}>
              <path d="M2 3 L1198 3" stroke={`url(#${ruleGradientId})`} strokeWidth=".7" fill="none" strokeLinecap="round" pathLength="100" />
            </g>
          </svg>
        </span>

        <span className="pressings-triptych__case-foot" aria-hidden="true">
          <span className="pressings-triptych__case-foot-mark" />
          press any row · the title answers with whichever is set · arrow keys cycle, home/end jump
          <span className="pressings-triptych__case-foot-mark pressings-triptych__case-foot-mark--alt" />
        </span>
      </div>
    </figure>
  )
}