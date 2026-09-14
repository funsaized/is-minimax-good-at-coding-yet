import { useState, type CSSProperties } from 'react'
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
  lines: [string, string, string]
  font: string
  weight: number
  style: 'normal' | 'italic'
  track: string
  sampleFont: string
  sampleWeight: number
  sampleStyle: 'normal' | 'italic'
  sampleTrack: string
  mark: string
  note: string
}

const READINGS: Reading[] = [
  {
    id: 'quiet',
    letter: 'A',
    name: 'quiet cut',
    face: 'serif · italic · close set',
    lines: ['is Minimax', 'good at frontend', 'yet?'],
    font: 'var(--serif)',
    weight: 400,
    style: 'italic',
    track: '-.024em',
    sampleFont: 'var(--serif)',
    sampleWeight: 400,
    sampleStyle: 'italic',
    sampleTrack: '-.02em',
    mark: 'press a · folio i',
    note: 'the type that gets out of the way',
  },
  {
    id: 'human',
    letter: 'B',
    name: 'human hand',
    face: 'serif · italic · warm',
    lines: ['is M3', 'good at frontend', 'yet?'],
    font: 'var(--serif)',
    weight: 500,
    style: 'italic',
    track: '-.018em',
    sampleFont: 'var(--serif)',
    sampleWeight: 500,
    sampleStyle: 'italic',
    sampleTrack: '-.01em',
    mark: 'press b · folio i·',
    note: 'a little wobble, on purpose',
  },
  {
    id: 'bold',
    letter: 'C',
    name: 'bold signal',
    face: 'sans · heavy · no apology',
    lines: ['IS', 'GOOD AT', 'FRONTEND YET?'],
    font: 'var(--sans)',
    weight: 800,
    style: 'normal',
    track: '-.06em',
    sampleFont: 'var(--sans)',
    sampleWeight: 800,
    sampleStyle: 'normal',
    sampleTrack: '-.04em',
    mark: 'press c · folio v',
    note: 'the answer with its whole chest',
  },
]

export function SecondReading({ voice, onSelect, setToday }: SecondReadingProps) {
  const [hovered, setHovered] = useState<VoiceId | null>(null)
  const display = hovered ?? voice
  const reading = READINGS.find(r => r.id === display) ?? READINGS[0]
  const style = {
    '--read-font': reading.font,
    '--read-weight': String(reading.weight),
    '--read-style': reading.style,
    '--read-track': reading.track,
  } as CSSProperties
  return (
    <div
      className={`second-reading second-reading--${display}`}
      style={style}
      role="group"
      aria-label="A second reading of the same question in three voices"
    >
      <header className="second-reading__head">
        <span className="second-reading__head-tag">a second reading</span>
        <span className="second-reading__head-folio">folio i· · the same line, again</span>
      </header>
      <h3 className="second-reading__title">
        Pull a voice. <em>The line follows.</em>
      </h3>
      <div className="second-reading__display" aria-live="polite">
        <span className="second-reading__display-mark">{reading.mark}</span>
        {reading.lines.map((line, index) => (
          <span key={`${reading.id}-${index}`} className="second-reading__display-line">{line}</span>
        ))}
      </div>
      <div className="second-reading__tabs" role="tablist" aria-label="Choose a voice for the second reading">
        {READINGS.map(r => (
          <button
            key={r.id}
            type="button"
            role="tab"
            aria-selected={display === r.id}
            className={`second-reading__tab second-reading__tab--${r.id} ${display === r.id ? 'is-active' : ''}`}
            onClick={() => onSelect(r.id)}
            onMouseEnter={() => setHovered(r.id)}
            onMouseLeave={() => setHovered(null)}
            onFocus={() => setHovered(r.id)}
            onBlur={() => setHovered(null)}
            style={{
              '--sample-font': r.sampleFont,
              '--sample-weight': String(r.sampleWeight),
              '--sample-style': r.sampleStyle,
              '--sample-track': r.sampleTrack,
            } as CSSProperties}
          >
            <span className="second-reading__tab-letter" aria-hidden="true">{r.letter}</span>
            <span className="second-reading__tab-sample" aria-hidden="true">{r.name}</span>
            <span className="second-reading__tab-name">{r.face}</span>
          </button>
        ))}
      </div>
      <p className="second-reading__foot">
        <span><span aria-hidden="true">※</span> now reading <em>{reading.name}</em></span>
        <span>set today · {setToday}</span>
      </p>
    </div>
  )
}
