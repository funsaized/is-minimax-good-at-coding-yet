import { useId, type CSSProperties, type KeyboardEvent as ReactKeyboardEvent } from 'react'
import type { VoiceId } from './App'
import type { WordId } from './notes'

type ReadingCordProps = {
  voice: VoiceId
  active: WordId
  onSelect: (id: WordId) => void
}

type CordMark = {
  id: WordId
  index: string
  glyph: string
  mark: string
  label: string
  tone: VoiceId
  ink: string
  caption: string
}

const MARKS: CordMark[] = [
  {
    id: 'm3',
    index: '01',
    glyph: '⌇',
    mark: 'stet',
    label: 'let it stand',
    tone: 'quiet',
    ink: '168, 197, 255',
    caption: 'the maker is a habit, not a name',
  },
  {
    id: 'good',
    index: '02',
    glyph: '∧',
    mark: 'caret',
    label: 'make room',
    tone: 'human',
    ink: '244, 132, 114',
    caption: 'choose one clear thing',
  },
  {
    id: 'yet',
    index: '03',
    glyph: '?',
    mark: 'query',
    label: 'protect the pause',
    tone: 'bold',
    ink: '205, 238, 106',
    caption: 'the question stays open',
  },
]

const INK_FOR_VOICE: Record<VoiceId, string> = {
  quiet: '168, 197, 255',
  human: '244, 132, 114',
  bold: '205, 238, 106',
}

export function ReadingCord({ voice, active, onSelect }: ReadingCordProps) {
  const baseId = useId().replace(/:/g, '')
  const cordGrad = `rc-cord-${baseId}`
  const beadGrad = `rc-bead-${baseId}`

  const cordStyle = {
    '--rc-tone': `var(--${voice})`,
    '--rc-voice-ink': INK_FOR_VOICE[voice],
  } as CSSProperties

  const onKey = (event: ReactKeyboardEvent<HTMLButtonElement>, id: WordId) => {
    const order: WordId[] = ['m3', 'good', 'yet']
    const idx = order.indexOf(id)
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault()
      onSelect(order[(idx + 1) % order.length])
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault()
      onSelect(order[(idx - 1 + order.length) % order.length])
    } else if (event.key === 'Home') {
      event.preventDefault()
      onSelect(order[0])
    } else if (event.key === 'End') {
      event.preventDefault()
      onSelect(order[order.length - 1])
    }
  }

  return (
    <figure
      className={`reading-cord reading-cord--${voice}`}
      style={cordStyle}
      aria-label="The reading cord · three marks on one thread"
    >
      <span className="reading-cord__head" aria-hidden="true">
        <em>the reading cord</em>
        <span className="reading-cord__head-rule" />
        <em>three marks · one thread</em>
      </span>

      <div className="reading-cord__rail-wrap">
        <svg
          className="reading-cord__svg"
          viewBox="0 0 1000 60"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id={cordGrad} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={`rgba(${INK_FOR_VOICE.quiet}, .22)`} />
              <stop offset="50%" stopColor={`rgba(${INK_FOR_VOICE[voice]}, .6)`} />
              <stop offset="100%" stopColor={`rgba(${INK_FOR_VOICE.bold}, .22)`} />
            </linearGradient>
            <radialGradient id={beadGrad} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={`rgba(${INK_FOR_VOICE[voice]}, .85)`} />
              <stop offset="56%" stopColor={`rgba(${INK_FOR_VOICE[voice]}, .22)`} />
              <stop offset="100%" stopColor={`rgba(${INK_FOR_VOICE[voice]}, 0)`} />
            </radialGradient>
          </defs>

          <line
            className="reading-cord__rail reading-cord__rail--ghost"
            x1="20" y1="30" x2="980" y2="30"
            stroke="rgba(245, 238, 216, .07)"
            strokeWidth="1"
            strokeDasharray="1.4 4.6"
          />

          <line
            className="reading-cord__rail"
            x1="20" y1="30" x2="980" y2="30"
            stroke={`url(#${cordGrad})`}
            strokeWidth="1.2"
            strokeLinecap="round"
          />

          <g className="reading-cord__ticks" fill="rgba(245, 238, 216, .25)">
            <circle cx="20" cy="30" r="1.2" />
            <circle cx="980" cy="30" r="1.2" />
          </g>
        </svg>

        <ol className="reading-cord__marks" role="list">
          {MARKS.map(mark => {
            const isActive = mark.id === active
            const isVoiceMark = mark.tone === voice
            return (
              <li
                key={mark.id}
                className={`reading-cord__cell reading-cord__cell--${mark.tone} ${isActive ? 'is-active' : ''} ${isVoiceMark ? 'is-voice' : ''}`}
                style={{ '--rc-ink': mark.ink } as CSSProperties}
              >
                <button
                  type="button"
                  className="reading-cord__node"
                  onClick={() => onSelect(mark.id)}
                  onKeyDown={event => onKey(event, mark.id)}
                  aria-pressed={isActive}
                  aria-label={`Mark ${mark.index} · ${mark.mark} — ${mark.label}. ${mark.caption}.`}
                >
                  <span className="reading-cord__node-bead" aria-hidden="true">
                    <svg viewBox="0 0 28 28">
                      <circle className="reading-cord__node-aura" cx="14" cy="14" r="13" fill={`url(#${beadGrad})`} />
                      <circle className="reading-cord__node-ring" cx="14" cy="14" r="11.2" fill="none" stroke="currentColor" strokeWidth=".4" strokeDasharray="0.8 2.2" opacity=".55" />
                      <circle className="reading-cord__node-shell" cx="14" cy="14" r="7.4" fill="rgba(8, 10, 18, .78)" stroke="currentColor" strokeWidth=".7" />
                      <text
                        x="14"
                        y="17.6"
                        textAnchor="middle"
                        fontFamily="'Iowan Old Style', Georgia, serif"
                        fontStyle="italic"
                        fontWeight="500"
                        fontSize="10"
                        fill="currentColor"
                      >
                        {mark.glyph}
                      </text>
                    </svg>
                  </span>

                  <span className="reading-cord__node-stack" aria-hidden="true">
                    <span className="reading-cord__node-idx">{mark.index}</span>
                    <em className="reading-cord__node-mark">{mark.mark}</em>
                  </span>
                </button>

                <span className="reading-cord__cell-cap" aria-hidden="true">
                  <em>{mark.label}</em>
                  <span className="reading-cord__cell-dot">·</span>
                  <span className="reading-cord__cell-quote">{mark.caption}</span>
                </span>
              </li>
            )
          })}
        </ol>
      </div>

      <span className="reading-cord__foot" aria-hidden="true">
        <em>read aloud</em>
        <span className="reading-cord__foot-rule" />
        <em>three times</em>
        <span className="reading-cord__foot-dot">·</span>
        <em>let one voice hold</em>
      </span>
    </figure>
  )
}