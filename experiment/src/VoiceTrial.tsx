import { useEffect, useId, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react'
import type { VoiceId } from './Press'

type VoiceTrialProps = {
  voice: VoiceId
  setToday: string
  rehearsing: boolean
  rehearsalCount: number
  onVoice: (voice: VoiceId) => void
  onTrialPull: () => void
}

const VOICE_ORDER: VoiceId[] = ['quiet', 'human', 'bold']
const VOICE_LETTER: Record<VoiceId, string> = { quiet: 'A', human: 'B', bold: 'C' }
const VOICE_NAME: Record<VoiceId, string> = {
  quiet: 'quiet cut',
  human: 'human hand',
  bold: 'bold signal',
}
const VOICE_FACE: Record<VoiceId, string> = {
  quiet: 'serif · italic · close set',
  human: 'serif · italic · warm',
  bold: 'sans · heavy · no apology',
}
const VOICE_TONE: Record<VoiceId, string> = {
  quiet: 'var(--blue)',
  human: 'var(--coral)',
  bold: 'var(--acid)',
}

function PullWheel({ rehearsing, voice }: { rehearsing: boolean; voice: VoiceId }) {
  return (
    <svg className={`voice-trial__wheel ${rehearsing ? 'is-spinning' : ''}`} viewBox="0 0 64 64" aria-hidden="true">
      <defs>
        <radialGradient id={`voice-trial-wheel-glow-${voice}`} cx="50%" cy="50%" r="55%">
          <stop offset="0%" stopColor={VOICE_TONE[voice]} stopOpacity=".45" />
          <stop offset="60%" stopColor={VOICE_TONE[voice]} stopOpacity=".08" />
          <stop offset="100%" stopColor={VOICE_TONE[voice]} stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="32" cy="32" r="29" fill={`url(#voice-trial-wheel-glow-${voice})`} />
      <g className="voice-trial__wheel-rings">
        <circle cx="32" cy="32" r="20" fill="none" stroke="currentColor" strokeWidth=".55" opacity=".55" />
        <circle cx="32" cy="32" r="14.5" fill="none" stroke="currentColor" strokeWidth=".4" strokeDasharray="1.2 2.2" opacity=".5" />
      </g>
      <g className="voice-trial__wheel-bearings">
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i * 30) * (Math.PI / 180)
          const x1 = 32 + Math.cos(angle) * 24
          const y1 = 32 + Math.sin(angle) * 24
          const x2 = 32 + Math.cos(angle) * 27
          const y2 = 32 + Math.sin(angle) * 27
          return (
            <line
              key={`voice-trial-wheel-bearing-${i}`}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="currentColor"
              strokeWidth=".7"
              strokeLinecap="round"
              opacity=".55"
            />
          )
        })}
      </g>
      <g className="voice-trial__wheel-letters">
        {VOICE_ORDER.map((v, idx) => {
          const angle = (-90 + idx * 120) * (Math.PI / 180)
          const x = 32 + Math.cos(angle) * 9.5
          const y = 32 + Math.sin(angle) * 9.5 + 2.5
          const isActive = v === voice
          return (
            <text
              key={`voice-trial-wheel-letter-${v}`}
              x={x}
              y={y}
              textAnchor="middle"
              fontFamily="ui-monospace, monospace"
              fontSize={isActive ? 4.6 : 3.6}
              letterSpacing="1.2"
              fill="currentColor"
              opacity={isActive ? 1 : 0.45}
              className={`voice-trial__wheel-letter voice-trial__wheel-letter--${v} ${isActive ? 'is-active' : ''}`}
            >
              {VOICE_LETTER[v]}
            </text>
          )
        })}
      </g>
      <circle cx="32" cy="32" r="2.6" fill="currentColor" className="voice-trial__wheel-core" />
      <circle cx="32" cy="32" r="5.6" fill="none" stroke="currentColor" strokeWidth=".5" opacity=".65" className="voice-trial__wheel-halo" />
    </svg>
  )
}

export function VoiceTrial({ voice, setToday, rehearsing, rehearsalCount, onVoice, onTrialPull }: VoiceTrialProps) {
  const baseId = useId().replace(/:/g, '')
  const grainId = `voice-trial-grain-${baseId}`
  const style = {
    '--voice-trial-grain': `url(#${grainId})`,
  } as CSSProperties

  const containerRef = useRef<HTMLDivElement>(null)
  const [revealed, setRevealed] = useState(false)
  const [pullTick, setPullTick] = useState(0)

  useEffect(() => {
    const node = containerRef.current
    if (!node) return
    if (!('IntersectionObserver' in window)) {
      setRevealed(true)
      return
    }
    const observer = new IntersectionObserver(
      entries => {
        if (entries.some(entry => entry.isIntersecting)) {
          setRevealed(true)
          observer.disconnect()
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (rehearsing) setPullTick(tick => tick + 1)
  }, [rehearsing])

  const cycle = (direction: 1 | -1) => {
    const idx = VOICE_ORDER.indexOf(voice)
    const next = VOICE_ORDER[(idx + direction + VOICE_ORDER.length) % VOICE_ORDER.length]
    onVoice(next)
  }

  const handleKey = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault()
      cycle(1)
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault()
      cycle(-1)
    } else if (event.key === 'Home') {
      event.preventDefault()
      onVoice('quiet')
    } else if (event.key === 'End') {
      event.preventDefault()
      onVoice('bold')
    } else if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault()
      onTrialPull()
    }
  }

  const voiceIndex = VOICE_ORDER.indexOf(voice)
  const progress = (voiceIndex + 1) / VOICE_ORDER.length

  return (
    <div
      ref={containerRef}
      className={`voice-trial ${revealed ? 'is-revealed' : ''} ${rehearsing ? 'is-rehearsing' : ''} voice-trial--voice-${voice}`}
      style={style}
      aria-label={`Press rehearsal · set in ${VOICE_NAME[voice]}. Pull once to cycle through all three voices.`}
    >
      <svg className="voice-trial__defs" viewBox="0 0 200 60" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <filter id={grainId} x="-4%" y="-10%" width="108%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency="2.4" numOctaves="2" seed="61" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .4 0" />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
        </defs>
      </svg>

      <span className="voice-trial__paper" aria-hidden="true" />

      <header className="voice-trial__masthead" aria-hidden="true">
        <span className="voice-trial__masthead-rule voice-trial__masthead-rule--lead" />
        <span className="voice-trial__masthead-tag">
          <span className="voice-trial__masthead-mark" />
          the press rehearsal
          <span className="voice-trial__masthead-mark voice-trial__masthead-mark--alt" />
        </span>
        <span className="voice-trial__masthead-set">
          <span>folio i · set today</span>
          <em>{setToday}</em>
        </span>
        <span className="voice-trial__masthead-rule voice-trial__masthead-rule--trail" />
      </header>

      <div className="voice-trial__bed">
        <span className="voice-trial__bed-rule voice-trial__bed-rule--top" aria-hidden="true" />
        <button
          type="button"
          className={`voice-trial__wheel-button ${rehearsing ? 'is-pulling' : ''}`}
          onClick={onTrialPull}
          onKeyDown={handleKey}
          aria-label={`Pull the rehearsal wheel. Currently set in ${VOICE_NAME[voice]} (${VOICE_LETTER[voice]}). The wheel cycles the headline through ${VOICE_NAME.quiet}, ${VOICE_NAME.human}, and ${VOICE_NAME.bold} before settling on ${VOICE_NAME[voice]}. Use the arrow keys to set the voice, space to rehearse.`}
          aria-pressed={rehearsing}
        >
          <PullWheel rehearsing={rehearsing} voice={voice} />
          <span className="voice-trial__wheel-readout" aria-hidden="true">
            <span className="voice-trial__wheel-readout-row">
              <span className="voice-trial__wheel-readout-key">set in</span>
              <em className="voice-trial__wheel-readout-voice">{VOICE_NAME[voice]}</em>
            </span>
            <span className="voice-trial__wheel-readout-face">{VOICE_FACE[voice]}</span>
          </span>
        </button>
        <span className="voice-trial__bed-track" aria-hidden="true">
          <svg viewBox="0 0 320 6" preserveAspectRatio="none">
            <line x1="2" y1="3" x2="318" y2="3" stroke="currentColor" strokeWidth=".5" strokeLinecap="round" opacity=".3" />
            <line
              x1="2"
              y1="3"
              x2={`${Math.max(2, 2 + progress * 314)}`}
              y2="3"
              stroke="currentColor"
              strokeWidth=".9"
              strokeLinecap="round"
              className="voice-trial__bed-track-progress"
              key={`voice-trial-progress-${voice}-${pullTick}`}
            />
          </svg>
          <span className="voice-trial__bed-track-cell voice-trial__bed-track-cell--lead">
            <span className="voice-trial__bed-track-cell-letter">{VOICE_LETTER.quiet}</span>
            <span className="voice-trial__bed-track-cell-name">{VOICE_NAME.quiet}</span>
          </span>
          <span className="voice-trial__bed-track-cell voice-trial__bed-track-cell--mid">
            <span className="voice-trial__bed-track-cell-letter">{VOICE_LETTER.human}</span>
            <span className="voice-trial__bed-track-cell-name">{VOICE_NAME.human}</span>
          </span>
          <span className="voice-trial__bed-track-cell voice-trial__bed-track-cell--trail">
            <span className="voice-trial__bed-track-cell-letter">{VOICE_LETTER.bold}</span>
            <span className="voice-trial__bed-track-cell-name">{VOICE_NAME.bold}</span>
          </span>
        </span>
        <span className="voice-trial__bed-rule voice-trial__bed-rule--bottom" aria-hidden="true" />
      </div>

      <div className="voice-trial__pull-row">
        <button
          type="button"
          className={`voice-trial__pull ${rehearsing ? 'is-pulling' : ''}`}
          onClick={onTrialPull}
          aria-label="Pull a rehearsal — cycle the headline through all three voices once."
          aria-pressed={rehearsing}
        >
          <span className="voice-trial__pull-pad" aria-hidden="true">
            <svg className="voice-trial__pull-glyph" viewBox="0 0 32 28" aria-hidden="true">
              <line x1="3" y1="14" x2="24" y2="14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" className="voice-trial__pull-bar" />
              <circle cx="3" cy="14" r="1.8" fill="currentColor" className="voice-trial__pull-bead voice-trial__pull-bead--lead" />
              <path
                d="M18 7 L27 14 L18 21"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="voice-trial__pull-arrow"
              />
              <circle cx="27" cy="14" r="1.6" fill="currentColor" className="voice-trial__pull-bead voice-trial__pull-bead--trail" />
            </svg>
          </span>
          <span className="voice-trial__pull-stack">
            <span className="voice-trial__pull-eyebrow">
              {rehearsing ? 'rehearsing · in motion' : 'pull once'}
            </span>
            <span className="voice-trial__pull-headline">
              {rehearsing ? 'cycling · a · b · c' : 'a rehearsal pull'}
            </span>
            <span className="voice-trial__pull-sub">
              {rehearsing
                ? `now showing ${VOICE_NAME[voice]} · settling soon`
                : 'all three voices, once'}
            </span>
          </span>
        </button>

        <div className="voice-trial__counter" aria-label="Rehearsals pulled this session">
          <span className="voice-trial__counter-tag" aria-hidden="true">
            <span className="voice-trial__counter-tag-mark" />
            rehearsals pulled
          </span>
          <span className="voice-trial__counter-row">
            <em className="voice-trial__counter-num">{String(rehearsalCount).padStart(3, '0')}</em>
            <span className="voice-trial__counter-suffix">this session</span>
          </span>
        </div>
      </div>

      <span className="voice-trial__hint" aria-hidden="true">
        <span className="voice-trial__hint-mark" />
        click the wheel · or the pull · or use space · arrows cycle the voice
        <span className="voice-trial__hint-mark voice-trial__hint-mark--alt" />
      </span>

      <span className="sr-only">
        A press rehearsal. Click the wheel, the pull, or press space to cycle the headline through quiet cut, human hand, and bold signal before settling on the current voice. Use the arrow keys to set the voice directly.
      </span>
    </div>
  )
}