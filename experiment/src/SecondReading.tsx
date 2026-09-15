import { useEffect, useId, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react'
import type { VoiceId } from './PressBay'

type SecondReadingProps = {
  voice: VoiceId
  onSelect: (voice: VoiceId) => void
  setToday: string
}

type Reading = {
  id: VoiceId
  letter: string
  name: string
  face: string
  roman: string
  tempo: string
  breath: string
  measure: string
  mark: string
  scene: string
  emphasis: { word: number; tone: 'lift' | 'settle' | 'pull' }[]
  font: string
  weight: number
  style: 'normal' | 'italic'
  track: string
  size: string
  sizeMobile: string
  body: string
  specimenLines: [string, string, string]
  glyph: string
}

const READINGS: Reading[] = [
  {
    id: 'quiet',
    letter: 'A',
    name: 'quiet cut',
    face: 'serif · italic · close set',
    roman: 'the practical reading',
    tempo: 'andanza · walking',
    breath: 'taken at the comma',
    measure: 'one phrase per line',
    mark: 'stet · the maker',
    scene: 'a desk at the end of the day, a lamp still on',
    emphasis: [
      { word: 0, tone: 'settle' },
      { word: 1, tone: 'lift' },
      { word: 2, tone: 'settle' },
    ],
    font: 'var(--serif)',
    weight: 400,
    style: 'italic',
    track: '-.024em',
    size: 'clamp(40px, 5.6vw, 78px)',
    sizeMobile: 'clamp(28px, 8vw, 40px)',
    body: 'It gets out of the way and lets the question do the work. The serif gives the line weight without weight; the italic softens the verdict without removing it.',
    specimenLines: ['is Minimax', 'good at frontend', 'yet?'],
    glyph: '⌇',
  },
  {
    id: 'human',
    letter: 'B',
    name: 'human hand',
    face: 'serif · italic · a little warm',
    roman: 'the personal reading',
    tempo: 'poco rubato · a little give',
    breath: 'stolen before "good at"',
    measure: 'two beats per line',
    mark: 'caret · the verb',
    scene: 'a notebook at a kitchen table, half a cup of tea',
    emphasis: [
      { word: 0, tone: 'lift' },
      { word: 1, tone: 'pull' },
      { word: 2, tone: 'lift' },
    ],
    font: 'var(--serif)',
    weight: 500,
    style: 'italic',
    track: '-.018em',
    size: 'clamp(40px, 5.6vw, 78px)',
    sizeMobile: 'clamp(28px, 8vw, 40px)',
    body: 'A little wobble makes the machine feel less like a machine. The italics lean into the verb, and the verb leans into the person on the other side of the glass.',
    specimenLines: ['is M3', 'good at frontend', 'yet?'],
    glyph: '✦',
  },
  {
    id: 'bold',
    letter: 'C',
    name: 'bold signal',
    face: 'sans · heavy · no apology',
    roman: 'the poster reading',
    tempo: 'marziale · on the beat',
    breath: 'given back to the line',
    measure: 'one line per phrase',
    mark: 'query · the question',
    scene: 'a sign on a backlit wall, a quiet crowd',
    emphasis: [
      { word: 0, tone: 'settle' },
      { word: 1, tone: 'pull' },
      { word: 2, tone: 'lift' },
    ],
    font: 'var(--sans)',
    weight: 800,
    style: 'normal',
    track: '-.058em',
    size: 'clamp(34px, 4.8vw, 66px)',
    sizeMobile: 'clamp(26px, 7vw, 36px)',
    body: 'It answers with its whole chest, then leaves the room for doubt. The sans gives the line presence; the heavy weight gives the question permission to be loud.',
    specimenLines: ['IS', 'GOOD AT', 'FRONTEND YET?'],
    glyph: '■',
  },
]

function emphasisClass(tone: 'lift' | 'settle' | 'pull') {
  return `sr-${tone}`
}

function Breather({ reading }: { reading: Reading }) {
  return (
    <svg className={`second-reading__breather second-reading__breather--${reading.id}`} viewBox="0 0 80 12" aria-hidden="true">
      <path
        d="M2 6c8-5 16 5 24 0s16-5 24 0 16 5 24 0 16-5 24 0"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        pathLength="100"
        className="second-reading__breather-stroke"
      />
      <circle className="second-reading__breather-bead" cx="78" cy="6" r="1.3" fill="currentColor" />
    </svg>
  )
}

function VoiceGlyph({ glyph, ink }: { glyph: string; ink: string }) {
  return (
    <span className="second-reading__voice-glyph" style={{ color: ink }} aria-hidden="true">
      {glyph}
    </span>
  )
}

function Tension({ level }: { level: number }) {
  const cells = 5
  return (
    <span className="second-reading__tension" aria-hidden="true">
      {Array.from({ length: cells }, (_, index) => (
        <span
          key={index}
          className={`second-reading__tension-cell ${index < level ? 'is-set' : ''}`}
        />
      ))}
    </span>
  )
}

export function SecondReading({ voice, onSelect, setToday }: SecondReadingProps) {
  const baseId = useId().replace(/:/g, '')
  const grainId = `second-reading-grain-${baseId}`
  const ruleId = `second-reading-rule-${baseId}`
  const rootRef = useRef<HTMLDivElement>(null)
  const [revealed, setRevealed] = useState(false)
  const [hoveredId, setHoveredId] = useState<VoiceId | null>(null)
  const [focusedId, setFocusedId] = useState<VoiceId | null>(null)

  const inkStyle: Record<VoiceId, string> = {
    quiet: 'var(--blue)',
    human: 'var(--coral)',
    bold: 'var(--acid)',
  }

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
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  const onKey = (event: KeyboardEvent<HTMLButtonElement>, id: VoiceId) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
      event.preventDefault()
      const next = id === 'quiet' ? 'human' : id === 'human' ? 'bold' : 'quiet'
      const node = document.getElementById(`second-reading-row-${next}`) as HTMLButtonElement | null
      node?.focus()
    }
    if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
      event.preventDefault()
      const prev = id === 'bold' ? 'human' : id === 'human' ? 'quiet' : 'bold'
      const node = document.getElementById(`second-reading-row-${prev}`) as HTMLButtonElement | null
      node?.focus()
    }
    if (event.key === 'Home') {
      event.preventDefault()
      document.getElementById('second-reading-row-quiet')?.focus()
    }
    if (event.key === 'End') {
      event.preventDefault()
      document.getElementById('second-reading-row-bold')?.focus()
    }
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onSelect(id)
    }
  }

  return (
    <div
      ref={rootRef}
      className={`second-reading ${revealed ? 'is-revealed' : ''} second-reading--${voice}`}
      role="region"
      aria-label="The second reading — the same question set three ways to be read aloud"
    >
      <svg className="second-reading__defs" viewBox="0 0 800 800" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <filter id={grainId} x="0%" y="0%" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.82" numOctaves="2" seed="41" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 .14  0 0 0 0 .12  0 0 0 0 .19  0 0 0 .04 0" />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
          <linearGradient id={ruleId} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
            <stop offset="14%" stopColor="currentColor" stopOpacity=".5" />
            <stop offset="50%" stopColor="currentColor" stopOpacity=".85" />
            <stop offset="86%" stopColor="currentColor" stopOpacity=".5" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="800" height="800" filter={`url(#${grainId})`} />
      </svg>

      <span className="second-reading__crop second-reading__crop--tl" aria-hidden="true" />
      <span className="second-reading__crop second-reading__crop--tr" aria-hidden="true" />
      <span className="second-reading__crop second-reading__crop--bl" aria-hidden="true" />
      <span className="second-reading__crop second-reading__crop--br" aria-hidden="true" />

      <header className="second-reading__head">
        <span className="second-reading__head-eyebrow" aria-hidden="true">
          <span className="second-reading__head-eyebrow-mark" />
          the second reading
          <span className="second-reading__head-eyebrow-mark second-reading__head-eyebrow-mark--alt" />
        </span>
        <span className="second-reading__head-folio" aria-hidden="true">
          <span className="second-reading__head-folio-num">i·</span>
          <span className="second-reading__head-folio-name">the same line, read aloud</span>
        </span>
      </header>

      <p className="second-reading__lede">
        The page is read once with the eye, and again with the ear. Three readings sit side by side, each scored with breath marks, the active voice set forward and the others held in reserve. <em>Pick one to set the line above.</em>
      </p>

      <span className="second-reading__rule" aria-hidden="true">
        <svg viewBox="0 0 600 6" preserveAspectRatio="none">
          <g filter={`url(#${grainId})`}>
            <path
              d="M2 3c30-3 60 3 90 0s60-3 90 0 60 3 90 0 60-3 90 0 60 3 90 0 60-3 90 0 60 3 90 0 28 0"
              fill="none"
              stroke={`url(#${ruleId})`}
              strokeWidth=".9"
              strokeLinecap="round"
              pathLength="100"
              className="second-reading__rule-stroke"
            />
          </g>
          <circle cx="2" cy="3" r="1.1" fill="currentColor" />
          <circle cx="598" cy="3" r="1.1" fill="currentColor" />
        </svg>
      </span>

      <ol className="second-reading__list" role="list">
        {READINGS.map((reading) => {
          const isActive = reading.id === voice
          const isHover = hoveredId === reading.id
          const isFocus = focusedId === reading.id
          const lifted = isHover || isFocus
          const dimmed = !isActive && !lifted
          const style = {
            '--reading-tone': inkStyle[reading.id],
            '--reading-font': reading.font,
            '--reading-weight': String(reading.weight),
            '--reading-style': reading.style,
            '--reading-track': reading.track,
            '--reading-size': reading.size,
            '--reading-size-mobile': reading.sizeMobile,
          } as CSSProperties
          return (
            <li
              key={reading.id}
              className={`second-reading__item second-reading__item--${reading.id} ${isActive ? 'is-active' : ''} ${lifted ? 'is-lifted' : ''} ${dimmed ? 'is-dimmed' : ''}`}
              style={style}
            >
              <button
                id={`second-reading-row-${reading.id}`}
                type="button"
                className="second-reading__row"
                onClick={() => onSelect(reading.id)}
                onMouseEnter={() => setHoveredId(reading.id)}
                onMouseLeave={() => setHoveredId(prev => (prev === reading.id ? null : prev))}
                onFocus={() => {
                  setFocusedId(reading.id)
                  setHoveredId(reading.id)
                }}
                onBlur={() => {
                  setFocusedId(prev => (prev === reading.id ? null : prev))
                  setHoveredId(prev => (prev === reading.id ? null : prev))
                }}
                onKeyDown={event => onKey(event, reading.id)}
                aria-pressed={isActive}
                aria-label={`Set the voice to ${reading.name}, ${reading.face}, ${reading.roman}.`}
              >
                <span className="second-reading__row-marker" aria-hidden="true">
                  <span className="second-reading__row-letter">{reading.letter}</span>
                  <span className="second-reading__row-letter-rule" />
                </span>

                <div className="second-reading__row-meta">
                  <span className="second-reading__row-meta-head">
                    <span className="second-reading__row-name">{reading.name}</span>
                    <span className="second-reading__row-face">{reading.face}</span>
                  </span>
                  <span className="second-reading__row-roman">
                    <em className="second-reading__row-roman-mark">¶</em>
                    {reading.roman}
                  </span>
                  <span className="second-reading__row-scene" aria-hidden="true">
                    <svg viewBox="0 0 14 14" className="second-reading__row-scene-glyph">
                      <circle cx="7" cy="7" r="6" fill="none" stroke="currentColor" strokeWidth=".5" />
                      <circle cx="7" cy="7" r="2" fill="currentColor" />
                    </svg>
                    {reading.scene}
                  </span>
                </div>

                <div className="second-reading__row-typeset" aria-hidden="true">
                  <span className="second-reading__row-typeset-mark">
                    <VoiceGlyph glyph={reading.glyph} ink={inkStyle[reading.id]} />
                    <em>{reading.mark}</em>
                  </span>
                  {reading.specimenLines.map((line, index) => (
                    <span
                      key={`${reading.id}-${index}`}
                      className={`second-reading__row-line second-reading__row-line--${index} ${emphasisClass(reading.emphasis[index]?.tone ?? 'settle')}`}
                    >
                      <span className="second-reading__row-line-text">{line}</span>
                    </span>
                  ))}
                </div>

                <div className="second-reading__row-reading" aria-hidden="true">
                  <span className="second-reading__row-reading-eyebrow">
                    <span className="second-reading__row-reading-eyebrow-mark" />
                    <em>read aloud</em>
                    <span className="second-reading__row-reading-eyebrow-mark second-reading__row-reading-eyebrow-mark--alt" />
                  </span>
                  <span className="second-reading__row-reading-tempo">{reading.tempo}</span>
                  <span className="second-reading__row-reading-breath">
                    <span className="second-reading__row-reading-breath-key">breath</span>
                    <em>{reading.breath}</em>
                  </span>
                  <span className="second-reading__row-reading-measure">
                    <span className="second-reading__row-reading-measure-key">measure</span>
                    <em>{reading.measure}</em>
                  </span>
                  <span className="second-reading__row-reading-tension">
                    <span className="second-reading__row-reading-tension-key">tension</span>
                    <Tension level={reading.id === 'quiet' ? 2 : reading.id === 'human' ? 3 : 4} />
                  </span>
                </div>

                <span className="second-reading__row-mark" aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth=".7" />
                    <circle cx="12" cy="12" r="3" fill="currentColor" className="second-reading__row-mark-core" />
                  </svg>
                </span>

                <span className="second-reading__row-breather" aria-hidden="true">
                  <Breather reading={reading} />
                </span>

                <span className="second-reading__row-tag" aria-hidden="true">
                  <span className="second-reading__row-tag-line" />
                  <em>{isActive ? 'now setting' : 'pull to set'}</em>
                  <span className="second-reading__row-tag-line second-reading__row-tag-line--alt" />
                </span>
              </button>

              <p className="second-reading__item-caption">
                <span className="second-reading__item-caption-mark" aria-hidden="true">¶</span>
                {reading.body}
              </p>
            </li>
          )
        })}
      </ol>

      <footer className="second-reading__foot">
        <span className="second-reading__foot-cell second-reading__foot-cell--now">
          <span className="second-reading__foot-key">now reading</span>
          <span className="second-reading__foot-value">
            <em className="second-reading__foot-letter">{READINGS.find(r => r.id === voice)?.letter}</em>
            <span className="second-reading__foot-name">{READINGS.find(r => r.id === voice)?.name}</span>
          </span>
        </span>
        <span className="second-reading__foot-rule" aria-hidden="true">
          <svg viewBox="0 0 80 6" preserveAspectRatio="none">
            <path
              d="M2 3c10-3 20 3 30 0s20-3 30 0 20 3 18 0"
              fill="none"
              stroke="currentColor"
              strokeWidth=".5"
              strokeLinecap="round"
            />
            <circle cx="78" cy="3" r="1" fill="currentColor" />
          </svg>
        </span>
        <span className="second-reading__foot-cell second-reading__foot-cell--set">
          <span className="second-reading__foot-key">set today</span>
          <em className="second-reading__foot-value">{setToday}</em>
        </span>
        <span className="second-reading__foot-rule second-reading__foot-rule--end" aria-hidden="true">
          <svg viewBox="0 0 80 6" preserveAspectRatio="none">
            <path
              d="M2 3c10-3 20 3 30 0s20-3 30 0 20 3 18 0"
              fill="none"
              stroke="currentColor"
              strokeWidth=".5"
              strokeLinecap="round"
            />
            <circle cx="2" cy="3" r="1" fill="currentColor" />
          </svg>
        </span>
        <span className="second-reading__foot-cell second-reading__foot-cell--hint">
          <span className="second-reading__foot-key">tip</span>
          <em className="second-reading__foot-value">
            focus a reading <span aria-hidden="true">·</span> press <kbd>enter</kbd> to set
          </em>
        </span>
      </footer>

      <span className="sr-only" aria-live="polite">
        Now reading {READINGS.find(r => r.id === voice)?.name}. {READINGS.length} readings are available.
      </span>
    </div>
  )
}