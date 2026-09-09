import type { CSSProperties } from 'react'
import type { VoiceId } from './PressBay'

type SpecimenSpreadProps = {
  active: VoiceId
  onSelect: (id: VoiceId) => void
}

type Pressing = {
  voice: VoiceId
  letter: string
  name: string
  descriptor: string
  face: string
  pointSize: string
  ink: string
  inkSwatch: string
  paperTone: string
  textInk: string
  rules: [string, string, string]
  lines: [string, string, string]
}

const PRESSINGS: Pressing[] = [
  {
    voice: 'quiet',
    letter: 'A',
    name: 'quiet cut',
    descriptor: 'the practical reading',
    face: 'serif · italic · close set',
    pointSize: '88 pt',
    ink: 'paper on midnight',
    inkSwatch: 'var(--paper)',
    paperTone: 'rgba(243, 236, 214, .045)',
    textInk: 'var(--paper)',
    rules: ['cap', 'x', 'base'],
    lines: ['is Minimax', 'good at frontend', 'yet?'],
  },
  {
    voice: 'human',
    letter: 'B',
    name: 'human hand',
    descriptor: 'the personal reading',
    face: 'serif · italic · warm',
    pointSize: '88 pt',
    ink: 'coral on plum',
    inkSwatch: 'var(--coral)',
    paperTone: 'rgba(255, 118, 95, .055)',
    textInk: 'var(--coral)',
    rules: ['cap', 'x', 'base'],
    lines: ['is M3', 'good at frontend', 'yet?'],
  },
  {
    voice: 'bold',
    letter: 'C',
    name: 'bold signal',
    descriptor: 'the poster reading',
    face: 'sans · heavy · no apology',
    pointSize: '84 pt',
    ink: 'acid on midnight',
    inkSwatch: 'var(--acid)',
    paperTone: 'rgba(216, 255, 106, .055)',
    textInk: 'var(--acid)',
    rules: ['cap', 'x', 'base'],
    lines: ['IS', 'GOOD AT', 'FRONTEND YET?'],
  },
]

function RegMark({ corner }: { corner: 'tl' | 'tr' | 'bl' | 'br' }) {
  const rotation = corner === 'tl' ? 0 : corner === 'tr' ? 90 : corner === 'br' ? 180 : 270
  return (
    <svg viewBox="0 0 14 14" aria-hidden="true" style={{ transform: `rotate(${rotation}deg)` }}>
      <circle cx="7" cy="7" r="5.5" fill="none" stroke="currentColor" strokeWidth=".5" />
      <path d="M2 7h10M7 2v10" stroke="currentColor" strokeWidth=".55" fill="none" />
    </svg>
  )
}

function PulledStamp({ letter }: { letter: string }) {
  return (
    <svg viewBox="0 0 60 60" aria-hidden="true">
      <circle cx="30" cy="30" r="24" fill="none" stroke="currentColor" strokeWidth=".8" />
      <circle cx="30" cy="30" r="20" fill="none" stroke="currentColor" strokeWidth=".4" strokeDasharray="1 2" />
      <text
        x="30" y="20"
        textAnchor="middle"
        fontFamily="ui-monospace, monospace"
        fontSize="3.6" letterSpacing="1.6"
        fill="currentColor"
      >PULLED · {letter}</text>
      <text
        x="30" y="34"
        textAnchor="middle"
        fontFamily="Georgia, serif"
        fontStyle="italic"
        fontSize="11"
        fill="currentColor"
      >m³</text>
      <text
        x="30" y="44"
        textAnchor="middle"
        fontFamily="ui-monospace, monospace"
        fontSize="3.6" letterSpacing="1.6"
        fill="currentColor"
      >FOLIO · V</text>
    </svg>
  )
}

function PressingCard({ pressing, isActive, onSelect }: { pressing: Pressing; isActive: boolean; onSelect: (id: VoiceId) => void }) {
  const style = {
    '--card-paper': pressing.paperTone,
    '--card-ink': pressing.textInk,
  } as CSSProperties
  return (
    <li className={`specimen-drawer__slot specimen-drawer__slot--${pressing.voice} ${isActive ? 'is-active' : ''}`}>
      <button
        type="button"
        className={`specimen-drawer__card specimen-drawer__card--${pressing.voice}`}
        onClick={() => onSelect(pressing.voice)}
        aria-pressed={isActive}
        aria-label={`Press the title in the ${pressing.name} voice`}
        style={style}
      >
        <span className="specimen-drawer__corner specimen-drawer__corner--tl" aria-hidden="true" />
        <span className="specimen-drawer__corner specimen-drawer__corner--tr" aria-hidden="true" />
        <span className="specimen-drawer__corner specimen-drawer__corner--bl" aria-hidden="true" />
        <span className="specimen-drawer__corner specimen-drawer__corner--br" aria-hidden="true" />

        <span className="specimen-drawer__reg specimen-drawer__reg--tl" aria-hidden="true"><RegMark corner="tl" /></span>
        <span className="specimen-drawer__reg specimen-drawer__reg--tr" aria-hidden="true"><RegMark corner="tr" /></span>
        <span className="specimen-drawer__reg specimen-drawer__reg--bl" aria-hidden="true"><RegMark corner="bl" /></span>
        <span className="specimen-drawer__reg specimen-drawer__reg--br" aria-hidden="true"><RegMark corner="br" /></span>

        <header className="specimen-drawer__head">
          <span className="specimen-drawer__letter" aria-hidden="true">{pressing.letter}</span>
          <span className="specimen-drawer__copy">
            <span className="specimen-drawer__name">{pressing.name}</span>
            <span className="specimen-drawer__descriptor">{pressing.descriptor}</span>
          </span>
        </header>

        <div className="specimen-drawer__stage" aria-hidden="true">
          <div className="specimen-drawer__guides">
            <span className="specimen-drawer__guide specimen-drawer__guide--cap" />
            <span className="specimen-drawer__guide specimen-drawer__guide--x" />
            <span className="specimen-drawer__guide specimen-drawer__guide--base" />
          </div>
          <div className={`specimen-drawer__specimen specimen-drawer__specimen--${pressing.voice}`}>
            <span>{pressing.lines[0]}</span>
            <span>{pressing.lines[1]}</span>
            <span>{pressing.lines[2]}</span>
          </div>
        </div>

        <footer className="specimen-drawer__foot">
          <div className="specimen-drawer__row">
            <span className="specimen-drawer__row-label">face</span>
            <span className="specimen-drawer__row-value">{pressing.face}</span>
          </div>
          <div className="specimen-drawer__row">
            <span className="specimen-drawer__row-label">size</span>
            <span className="specimen-drawer__row-value">{pressing.pointSize}</span>
          </div>
          <div className="specimen-drawer__row">
            <span className="specimen-drawer__row-label">ink</span>
            <span className="specimen-drawer__row-value specimen-drawer__row-value--ink">
              <span className="specimen-drawer__swatch" style={{ background: pressing.inkSwatch }} aria-hidden="true" />
              {pressing.ink}
            </span>
          </div>
        </footer>

        <span className="specimen-drawer__pulled" aria-hidden="true">
          <PulledStamp letter={pressing.letter} />
        </span>
      </button>
    </li>
  )
}

export function SpecimenSpread({ active, onSelect }: SpecimenSpreadProps) {
  return (
    <section className="specimen-spread section" id="pressings" aria-labelledby="specimen-spread-title">
      <header className="section__header specimen-spread__header">
        <p className="eyebrow"><span className="eyebrow__line" />type specimen <em>folio v · the open drawer</em></p>
        <h2 id="specimen-spread-title">One question, <i>three pressings.</i></h2>
        <p className="section__lede">The drawer is open. Three proofs of the same question, each set in its own voice. Pull one out and the title above answers with it.</p>
      </header>

      <div className="specimen-drawer">
        <div className="specimen-drawer__rail" aria-hidden="true">
          <span className="specimen-drawer__rail-handle">
            <span className="specimen-drawer__rail-dot" />
            <span className="specimen-drawer__rail-dot specimen-drawer__rail-dot--mid" />
            <span className="specimen-drawer__rail-dot" />
          </span>
          <span className="specimen-drawer__rail-line" />
          <span className="specimen-drawer__rail-text">drawer open · three proofs laid out</span>
          <span className="specimen-drawer__rail-line" />
          <span className="specimen-drawer__rail-tag">folio v</span>
        </div>

        <ol className="specimen-drawer__stack" role="list" aria-label="Three pressings of the title">
          {PRESSINGS.map(pressing => (
            <PressingCard
              key={pressing.voice}
              pressing={pressing}
              isActive={active === pressing.voice}
              onSelect={onSelect}
            />
          ))}
        </ol>

        <div className="specimen-drawer__plate" aria-hidden="true">
          <span className="specimen-drawer__plate-bar" />
          <span className="specimen-drawer__plate-text">three readings · one mark · the question keeps moving</span>
          <span className="specimen-drawer__plate-bar" />
        </div>
      </div>

      <p className="specimen-drawer__foot-note">
        <span aria-hidden="true">※</span>
        Each pressing is a different answer to the same question. None of them are final. The marked words above remain marked in every reading.
      </p>
    </section>
  )
}
