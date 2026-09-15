import { useId, useState, type CSSProperties } from 'react'
import type { VoiceId } from './Press'

type SpecimenTrayProps = {
  active: VoiceId
  onSelect: (voice: VoiceId) => void
}

type Specimen = {
  id: VoiceId
  letter: string
  name: string
  face: string
  ink: string
  paper: string
  edge: string
  inkLabel: string
  paperLabel: string
  display: string
  body: string
  micro: string
  motto: string
  proof: string
  set: string
  kern: string
  tilt: number
  stackX: number
  stackY: number
  fontFamily: string
  fontWeight: number
  fontStyle: 'normal' | 'italic'
  tracking: string
  displayWeight: number
  displayStyle: 'normal' | 'italic'
  bodyWeight: number
  bodyStyle: 'normal' | 'italic'
}

const SPECIMENS: Specimen[] = [
  {
    id: 'quiet',
    letter: 'A',
    name: 'quiet cut',
    face: 'serif · italic · close set',
    ink: 'var(--paper)',
    paper: '#161a26',
    edge: 'rgba(155, 188, 255, .34)',
    inkLabel: 'paper on midnight',
    paperLabel: 'midnight · paper',
    display: 'is M3',
    body: 'good at frontend',
    micro: 'yet?',
    motto: 'gets out of the way',
    proof: 'press a · folio i',
    set: 'specimen № a',
    kern: '-0.022em',
    tilt: -3.2,
    stackX: -14,
    stackY: -10,
    fontFamily: 'var(--serif)',
    fontWeight: 400,
    fontStyle: 'italic',
    tracking: '-0.024em',
    displayWeight: 400,
    displayStyle: 'italic',
    bodyWeight: 400,
    bodyStyle: 'italic',
  },
  {
    id: 'human',
    letter: 'B',
    name: 'human hand',
    face: 'serif · italic · warm',
    ink: 'var(--coral)',
    paper: '#1a131c',
    edge: 'rgba(255, 118, 95, .42)',
    inkLabel: 'coral on plum',
    paperLabel: 'plum · coral',
    display: 'is M3',
    body: 'good at frontend',
    micro: 'yet?',
    motto: 'feels like a person',
    proof: 'press b · folio i·',
    set: 'specimen № b',
    kern: '-0.014em',
    tilt: 1.4,
    stackX: 0,
    stackY: 0,
    fontFamily: 'var(--serif)',
    fontWeight: 500,
    fontStyle: 'italic',
    tracking: '-0.018em',
    displayWeight: 500,
    displayStyle: 'italic',
    bodyWeight: 500,
    bodyStyle: 'italic',
  },
  {
    id: 'bold',
    letter: 'C',
    name: 'bold signal',
    face: 'sans · heavy · no apology',
    ink: 'var(--acid)',
    paper: '#0d131a',
    edge: 'rgba(216, 240, 106, .4)',
    inkLabel: 'acid on midnight',
    paperLabel: 'midnight · acid',
    display: 'IS M3',
    body: 'GOOD AT FRONTEND',
    micro: 'YET?',
    motto: 'answers with its whole chest',
    proof: 'press c · folio v',
    set: 'specimen № c',
    kern: '-0.05em',
    tilt: -1.8,
    stackX: 12,
    stackY: 14,
    fontFamily: 'var(--sans)',
    fontWeight: 850,
    fontStyle: 'normal',
    tracking: '-0.06em',
    displayWeight: 800,
    displayStyle: 'normal',
    bodyWeight: 800,
    bodyStyle: 'normal',
  },
]

const Z_ORDER: Record<VoiceId, number> = { quiet: 1, human: 2, bold: 3 }

function PaperGrain({ id, tone }: { id: string; tone: 'cool' | 'warm' | 'coolDeep' }) {
  const matrix =
    tone === 'warm'
      ? '0 0 0 0 .14  0 0 0 0 .08  0 0 0 0 .04  0 0 0 .09 0'
      : tone === 'coolDeep'
      ? '0 0 0 0 .07  0 0 0 0 .09  0 0 0 0 .14  0 0 0 .12 0'
      : '0 0 0 0 .09  0 0 0 0 .1  0 0 0 0 .16  0 0 0 .1 0'
  return (
    <svg className="specimen-tray__grain" viewBox="0 0 400 280" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <filter id={id} x="0%" y="0%" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.92" numOctaves="2" seed="42" stitchTiles="stitch" />
          <feColorMatrix type="matrix" values={matrix} />
          <feComposite in2="SourceGraphic" operator="in" />
        </filter>
      </defs>
      <rect x="0" y="0" width="400" height="280" filter={`url(#${id})`} />
    </svg>
  )
}

function CropMark({ corner }: { corner: 'tl' | 'tr' | 'bl' | 'br' }) {
  const transform =
    corner === 'tl'
      ? 'translate(0,0)'
      : corner === 'tr'
      ? 'translate(32,0) scale(-1,1)'
      : corner === 'bl'
      ? 'translate(0,32) scale(1,-1)'
      : 'translate(32,32) scale(-1,-1)'
  return (
    <svg className={`specimen-tray__crop specimen-tray__crop--${corner}`} viewBox="0 0 32 32" aria-hidden="true">
      <g transform={transform}>
        <path d="M2 12h8M12 2v8" stroke="currentColor" strokeWidth=".7" strokeLinecap="round" opacity=".7" />
        <circle cx="2" cy="2" r="1.1" fill="currentColor" opacity=".6" />
      </g>
    </svg>
  )
}

function InkChip({ letter, ink, paper, inkLabel, paperLabel }: { letter: string; ink: string; paper: string; inkLabel: string; paperLabel: string }) {
  return (
    <span className="specimen-tray__chip" aria-hidden="true">
      <span className="specimen-tray__chip-disc" style={{ background: ink, color: paper }} title={`${inkLabel} on ${paperLabel}`}>
        <em>{letter}</em>
        <span className="specimen-tray__chip-disc-ring" />
      </span>
      <span className="specimen-tray__chip-rule" />
    </span>
  )
}

function SpecimenCard({ specimen, isActive, isHovered, onSelect, onHover, onLeave, grainId }: {
  specimen: Specimen
  isActive: boolean
  isHovered: boolean
  onSelect: (id: VoiceId) => void
  onHover: (id: VoiceId) => void
  onLeave: () => void
  grainId: string
}) {
  const tiltVar = `${specimen.tilt}deg`
  const style: CSSProperties = {
    '--specimen-tilt': tiltVar,
    '--specimen-stack-x': `${specimen.stackX}px`,
    '--specimen-stack-y': `${specimen.stackY}px`,
    '--specimen-edge': specimen.edge,
    '--specimen-ink': specimen.ink,
    '--specimen-paper': specimen.paper,
    '--specimen-kern': specimen.kern,
    '--specimen-z': String(Z_ORDER[specimen.id]),
  } as CSSProperties
  const tone = specimen.id === 'human' ? 'warm' : specimen.id === 'bold' ? 'coolDeep' : 'cool'
  const inkLabel = specimen.inkLabel
  const paperLabel = specimen.paperLabel
  const displayStyle: CSSProperties = {
    fontFamily: specimen.fontFamily,
    fontWeight: specimen.displayWeight,
    fontStyle: specimen.displayStyle,
    letterSpacing: specimen.tracking,
  }
  const bodyStyle: CSSProperties = {
    fontFamily: specimen.fontFamily,
    fontWeight: specimen.bodyWeight,
    fontStyle: specimen.bodyStyle,
    letterSpacing: specimen.tracking,
  }
  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      tabIndex={isActive ? 0 : -1}
      className={`specimen-tray__sheet specimen-tray__sheet--${specimen.id} ${isActive ? 'is-active' : ''} ${isHovered && !isActive ? 'is-hovered' : ''}`}
      style={style}
      onClick={() => onSelect(specimen.id)}
      onMouseEnter={() => onHover(specimen.id)}
      onMouseLeave={onLeave}
      onFocus={() => onHover(specimen.id)}
      onBlur={onLeave}
    >
      <span className="specimen-tray__paper" aria-hidden="true">
        <PaperGrain id={grainId} tone={tone} />
      </span>
      <span className="specimen-tray__edge specimen-tray__edge--top" aria-hidden="true" />
      <span className="specimen-tray__edge specimen-tray__edge--bottom" aria-hidden="true" />

      <span className="specimen-tray__corners" aria-hidden="true">
        <CropMark corner="tl" />
        <CropMark corner="tr" />
        <CropMark corner="bl" />
        <CropMark corner="br" />
      </span>

      <span className="specimen-tray__plate" aria-hidden="true">
        <span className="specimen-tray__plate-rule" />
        <span className="specimen-tray__plate-tag">
          <span className="specimen-tray__plate-tag-dot" />
          {specimen.proof}
          <span className="specimen-tray__plate-tag-dot" />
        </span>
        <span className="specimen-tray__plate-rule" />
      </span>

      <span className="specimen-tray__chip-row">
        <InkChip
          letter={specimen.letter}
          ink={specimen.id === 'quiet' ? 'var(--paper)' : specimen.id === 'human' ? 'var(--coral)' : 'var(--acid)'}
          paper={specimen.paper}
          inkLabel={inkLabel}
          paperLabel={paperLabel}
        />
        <span className="specimen-tray__chip-meta">
          <span className="specimen-tray__chip-name">{specimen.name}</span>
          <span className="specimen-tray__chip-face">{specimen.face}</span>
        </span>
        <span className="specimen-tray__chip-swatch" aria-hidden="true">
          <span className="specimen-tray__chip-swatch-ink" style={{ background: specimen.ink }} />
          <span className="specimen-tray__chip-swatch-rule" aria-hidden="true" />
        </span>
      </span>

      <span className="specimen-tray__sample" aria-hidden="false">
        <span className="specimen-tray__sample-display" style={displayStyle}>{specimen.display}</span>
        <span className="specimen-tray__sample-body" style={bodyStyle}>{specimen.body}</span>
        <span className="specimen-tray__sample-micro" style={bodyStyle}>{specimen.micro}</span>
      </span>

      <span className="specimen-tray__motto" aria-hidden="true">
        <span className="specimen-tray__motto-rule" />
        <em>{specimen.motto}</em>
        <span className="specimen-tray__motto-rule" />
      </span>

      <span className="specimen-tray__foot">
        <span className="specimen-tray__foot-row">
          <span className="specimen-tray__foot-tag">ink · paper</span>
          <em className="specimen-tray__foot-value">{inkLabel} <span aria-hidden="true">/</span> {paperLabel}</em>
        </span>
        <span className="specimen-tray__foot-row specimen-tray__foot-row--alt">
          <span className="specimen-tray__foot-tag">{specimen.set}</span>
          <em className="specimen-tray__foot-value">kern · {specimen.kern}</em>
        </span>
      </span>

      <span className="specimen-tray__now" aria-hidden="true">
        <span className="specimen-tray__now-dot" />
        <span className="specimen-tray__now-text">{isActive ? 'active setting' : isHovered ? 'preview' : 'press to set'}</span>
      </span>
    </button>
  )
}

export function SpecimenTray({ active, onSelect }: SpecimenTrayProps) {
  const [hovered, setHovered] = useState<VoiceId | null>(null)
  const baseId = useId().replace(/:/g, '')
  return (
    <div className="specimen-tray" role="tablist" aria-label="A specimen tray of the three voices">
      <span className="specimen-tray__rail" aria-hidden="true">
        <svg viewBox="0 0 240 200" preserveAspectRatio="none">
          <path
            d="M2 12 L238 12 M2 188 L238 188"
            stroke="currentColor"
            strokeWidth=".7"
            strokeLinecap="round"
            opacity=".42"
          />
          <path
            d="M2 12 L2 188 M238 12 L238 188"
            stroke="currentColor"
            strokeWidth=".4"
            strokeDasharray="2 4"
            opacity=".35"
          />
          <path
            d="M2 100 L120 96 L238 100"
            stroke="currentColor"
            strokeWidth=".5"
            strokeDasharray="3 3"
            opacity=".55"
          />
          <circle cx="120" cy="96" r="1.4" fill="currentColor" opacity=".7" />
          <circle cx="2" cy="100" r="1.2" fill="currentColor" opacity=".6" />
          <circle cx="238" cy="100" r="1.2" fill="currentColor" opacity=".6" />
        </svg>
      </span>
      <span className="specimen-tray__rail-tag" aria-hidden="true">
        <span className="specimen-tray__rail-tag-mark" />
        folio · the specimen tray
      </span>
      <span className="specimen-tray__deck" aria-hidden="false">
        {SPECIMENS.map((specimen, index) => {
          const grainId = `specimen-tray-grain-${baseId}-${index}`
          const isActive = active === specimen.id
          const isHovered = hovered === specimen.id
          return (
            <SpecimenCard
              key={specimen.id}
              specimen={specimen}
              isActive={isActive}
              isHovered={isHovered}
              onSelect={onSelect}
              onHover={setHovered}
              onLeave={() => setHovered(null)}
              grainId={grainId}
            />
          )
        })}
      </span>
      <span className="specimen-tray__hint" aria-hidden="true">
        <span className="specimen-tray__hint-dot" />
        a press tray · the active sheet stands forward · click any to set the page
      </span>
    </div>
  )
}
