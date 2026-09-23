import {
  useId,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react'
import type { VoiceId } from './App'
import type { WordId } from './notes'

type ReadThreeTimesProps = {
  voice: VoiceId
  word: WordId
  setToday: string
  onVoice: (voice: VoiceId) => void
}

type VoiceLine = {
  voice: VoiceId
  letter: string
  name: string
  face: string
  sample: string
  markedText: Record<WordId, string>
  rule: string
  family: string
  weight: number
  style: 'italic' | 'normal'
  tracking: string
  uppercased: boolean
  size: number
}

const LINES: VoiceLine[] = [
  {
    voice: 'quiet',
    letter: 'A',
    name: 'quiet cut',
    face: 'serif · italic · close set',
    sample: 'is m³ good at frontend yet?',
    markedText: { m3: 'm³', good: 'good at', yet: 'yet' },
    rule: 'so the reader hears themselves in it',
    family: "'Iowan Old Style', 'Palatino Linotype', Georgia, serif",
    weight: 400,
    style: 'italic',
    tracking: '-.022em',
    uppercased: false,
    size: 1.0,
  },
  {
    voice: 'human',
    letter: 'B',
    name: 'human hand',
    face: 'serif · italic · warm',
    sample: 'is M3 good at frontend yet?',
    markedText: { m3: 'M3', good: 'good at', yet: 'yet' },
    rule: 'so the page warms and answers back',
    family: "'Iowan Old Style', 'Palatino Linotype', Georgia, serif",
    weight: 500,
    style: 'italic',
    tracking: '-.016em',
    uppercased: false,
    size: 1.06,
  },
  {
    voice: 'bold',
    letter: 'C',
    name: 'bold signal',
    face: 'sans · heavy · no apology',
    sample: 'IS M3 GOOD AT FRONTEND YET?',
    markedText: { m3: 'M3', good: 'GOOD AT', yet: 'YET' },
    rule: 'so the question is heard once, clearly',
    family: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
    weight: 800,
    style: 'normal',
    tracking: '-.045em',
    uppercased: true,
    size: 1.04,
  },
]

const ORDER: VoiceId[] = ['quiet', 'human', 'bold']

type MarkedSegment = { text: string; marked: boolean }

function buildSegments(line: VoiceLine, word: WordId): MarkedSegment[] {
  const sample = line.sample
  const target = line.markedText[word]
  if (line.uppercased) {
    const before = sample.indexOf(target)
    if (before === -1) return [{ text: sample, marked: false }]
    const out: MarkedSegment[] = []
    if (before > 0) out.push({ text: sample.slice(0, before), marked: false })
    out.push({ text: target, marked: true })
    const after = before + target.length
    if (after < sample.length) out.push({ text: sample.slice(after), marked: false })
    return out
  }
  const lower = sample.toLowerCase()
  const lowerTarget = target.toLowerCase()
  const at = lower.indexOf(lowerTarget)
  if (at === -1) return [{ text: sample, marked: false }]
  const out: MarkedSegment[] = []
  if (at > 0) out.push({ text: sample.slice(0, at), marked: false })
  out.push({ text: sample.slice(at, at + lowerTarget.length), marked: true })
  const after = at + lowerTarget.length
  if (after < sample.length) out.push({ text: sample.slice(after), marked: false })
  return out
}

export function ReadThreeTimes({ voice, word, setToday, onVoice }: ReadThreeTimesProps) {
  const baseId = useId().replace(/:/g, '')
  const style = {
    '--rt-tone': `var(--${voice})`,
  } as CSSProperties

  const onLineKey = (
    event: ReactKeyboardEvent<HTMLButtonElement>,
    target: VoiceId,
  ) => {
    const idx = ORDER.indexOf(target)
    let next: VoiceId | null = null
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      next = ORDER[(idx + 1) % ORDER.length]
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      next = ORDER[(idx - 1 + ORDER.length) % ORDER.length]
    } else if (event.key === 'Home') {
      next = ORDER[0]
    } else if (event.key === 'End') {
      next = ORDER[ORDER.length - 1]
    }
    if (!next) return
    event.preventDefault()
    onVoice(next)
  }

  return (
    <section
      className={`read-three read-three--${voice}`}
      style={style}
      aria-labelledby={`read-three-head-${baseId}`}
    >
      <span className="read-three__plate" aria-hidden="true">
        <span className="read-three__plate-corner read-three__plate-corner--tl" />
        <span className="read-three__plate-corner read-three__plate-corner--tr" />
        <span className="read-three__plate-corner read-three__plate-corner--bl" />
        <span className="read-three__plate-corner read-three__plate-corner--br" />
      </span>

      <header className="read-three__head">
        <em id={`read-three-head-${baseId}`} className="read-three__lead">
          read the page three times · let one voice hold
        </em>
        <span className="read-three__plate-tag" aria-hidden="true">
          <span className="read-three__plate-tag-rule" />
          <em>trial proof</em>
          <span className="read-three__plate-tag-rule" />
          <span className="read-three__plate-tag-sep">·</span>
          <em>of three</em>
        </span>
      </header>

      <ol className="read-three__lines" role="radiogroup" aria-label="Choose a voice · A quiet, B human, C bold">
        {LINES.map(line => {
          const isActive = voice === line.voice
          const segments = buildSegments(line, word)
          const sampleStyle: CSSProperties = {
            fontFamily: line.family,
            fontWeight: line.weight,
            fontStyle: line.style,
            letterSpacing: line.tracking,
            textTransform: line.uppercased ? 'uppercase' : 'none',
            fontSize: `calc(${line.size} * var(--rt-line-size, 22px))`,
          }
          const label = `${line.letter} · ${line.name} · ${line.face}`
          return (
            <li
              key={line.voice}
              className={`read-three__row read-three__row--${line.voice} ${isActive ? 'is-active' : ''}`}
            >
              <button
                type="button"
                role="radio"
                aria-checked={isActive}
                onClick={() => onVoice(line.voice)}
                onKeyDown={e => onLineKey(e, line.voice)}
                aria-label={label}
                className="read-three__line"
              >
                <span className="read-three__cell read-three__cell--letter" aria-hidden="true">
                  <span className="read-three__cell-letter">{line.letter}</span>
                </span>
                <span className="read-three__cell read-three__cell--text" aria-hidden="true">
                  <span className="read-three__sample" style={sampleStyle}>
                    {segments.map((seg, i) => (
                      <span
                        key={`${line.voice}-${word}-${i}`}
                        className={`read-three__seg ${seg.marked ? 'is-marked' : ''}`}
                      >
                        {seg.text}
                      </span>
                    ))}
                  </span>
                </span>
                <span className="read-three__cell read-three__cell--meta">
                  <em className="read-three__cell-name">{line.name}</em>
                  <em className="read-three__cell-rule">{line.rule}</em>
                </span>
                <span className="read-three__cell read-three__cell--mark" aria-hidden="true">
                  <svg viewBox="0 0 14 14">
                    <circle cx="7" cy="7" r="5.6" fill="none" stroke="currentColor" strokeWidth=".45" />
                    {isActive ? (
                      <circle cx="7" cy="7" r="2.4" fill="currentColor" />
                    ) : (
                      <circle cx="7" cy="7" r=".9" fill="currentColor" opacity=".4" />
                    )}
                  </svg>
                </span>
              </button>
            </li>
          )
        })}
      </ol>

      <footer className="read-three__foot" aria-hidden="true">
        <span className="read-three__foot-rule" />
        <em className="read-three__foot-set">
          <span className="read-three__foot-set-key">set on</span>
          <span className="read-three__foot-set-word">{setToday}</span>
        </em>
        <span className="read-three__foot-rule" />
      </footer>
    </section>
  )
}
