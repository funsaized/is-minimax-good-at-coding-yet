import { useEffect, useId, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react'
import type { VoiceId } from './Press'

type VoiceTrialProps = {
  voice: VoiceId
  setToday: string
  rehearsing: boolean
  trialTick: number
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

function PullGlyph() {
  return (
    <svg className="voice-trial__pull-glyph" viewBox="0 0 28 24" aria-hidden="true">
      <line x1="3" y1="12" x2="22" y2="12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" className="voice-trial__pull-bar" />
      <circle cx="3" cy="12" r="1.6" fill="currentColor" className="voice-trial__pull-bead voice-trial__pull-bead--lead" />
      <path
        d="M16 6 L24 12 L16 18"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="voice-trial__pull-arrow"
      />
      <circle cx="24" cy="12" r="1.4" fill="currentColor" className="voice-trial__pull-bead voice-trial__pull-bead--trail" />
    </svg>
  )
}

function VoicePip({ v, active, tone, onSelect, groupRef }: {
  v: VoiceId
  active: boolean
  tone: string
  onSelect: (v: VoiceId) => void
  groupRef: (node: HTMLButtonElement | null) => void
}) {
  const style = { '--voice-trial-pip-tone': tone } as CSSProperties
  return (
    <button
      ref={groupRef}
      type="button"
      className={`voice-trial__pip voice-trial__pip--${v} ${active ? 'is-active' : ''}`}
      style={style}
      onClick={() => onSelect(v)}
      aria-pressed={active}
      aria-label={`Set the press in the ${VOICE_NAME[v]} voice.`}
    >
      <span className="voice-trial__pip-ring" aria-hidden="true">
        <svg viewBox="0 0 28 28">
          <circle cx="14" cy="14" r="11" fill="none" stroke="currentColor" strokeWidth=".55" opacity=".4" />
          <circle cx="14" cy="14" r="7.5" fill="none" stroke="currentColor" strokeWidth=".35" strokeDasharray=".7 1.8" opacity=".5" />
          <circle cx="14" cy="14" r="2" fill="currentColor" className="voice-trial__pip-core" />
        </svg>
      </span>
      <span className="voice-trial__pip-stack">
        <span className="voice-trial__pip-letter" aria-hidden="true">{VOICE_LETTER[v]}</span>
        <span className="voice-trial__pip-name">{VOICE_NAME[v]}</span>
        <span className="voice-trial__pip-face" aria-hidden="true">{VOICE_FACE[v]}</span>
      </span>
      <span className="voice-trial__pip-state" aria-hidden="true">
        {active ? (
          <>
            <span className="voice-trial__pip-state-dot" />
            <span>now</span>
          </>
        ) : (
          <span className="voice-trial__pip-state-tag">set</span>
        )}
      </span>
    </button>
  )
}

export function VoiceTrial({ voice, setToday, rehearsing, trialTick, onVoice, onTrialPull }: VoiceTrialProps) {
  const baseId = useId().replace(/:/g, '')
  const grainId = `voice-trial-grain-${baseId}`
  const style = {
    '--voice-trial-grain': `url(#${grainId})`,
  } as CSSProperties

  const containerRef = useRef<HTMLDivElement>(null)
  const [revealed, setRevealed] = useState(false)
  const pipRefs = useRef<Partial<Record<VoiceId, HTMLButtonElement | null>>>({})

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

  const focusPip = (id: VoiceId) => {
    window.requestAnimationFrame(() => pipRefs.current[id]?.focus())
  }

  const onPipKey = (event: KeyboardEvent<HTMLButtonElement>, id: VoiceId) => {
    const idx = VOICE_ORDER.indexOf(id)
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault()
      const next = VOICE_ORDER[(idx + 1) % VOICE_ORDER.length]
      onVoice(next)
      focusPip(next)
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault()
      const next = VOICE_ORDER[(idx - 1 + VOICE_ORDER.length) % VOICE_ORDER.length]
      onVoice(next)
      focusPip(next)
    } else if (event.key === 'Home') {
      event.preventDefault()
      onVoice(VOICE_ORDER[0])
      focusPip(VOICE_ORDER[0])
    } else if (event.key === 'End') {
      event.preventDefault()
      onVoice(VOICE_ORDER[VOICE_ORDER.length - 1])
      focusPip(VOICE_ORDER[VOICE_ORDER.length - 1])
    } else if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault()
      onTrialPull()
    }
  }

  return (
    <div
      ref={containerRef}
      className={`voice-trial ${revealed ? 'is-revealed' : ''} ${rehearsing ? 'is-rehearsing' : ''}`}
      style={style}
      aria-label={`Press voice trial · set in ${VOICE_NAME[voice]}. Pull to rehearse the three voices in order.`}
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
          the voice trial
          <span className="voice-trial__masthead-mark voice-trial__masthead-mark--alt" />
        </span>
        <span className="voice-trial__masthead-rule" />
        <span className="voice-trial__masthead-set">
          <span>folio i · set today</span>
          <em>{setToday}</em>
        </span>
      </header>

      <div className="voice-trial__body" role="group" aria-label="Set the voice, or pull a rehearsal">
        {VOICE_ORDER.map((v) => (
          <VoicePip
            key={`voice-trial-pip-${v}`}
            v={v}
            active={v === voice}
            tone={VOICE_TONE[v]}
            onSelect={onVoice}
            groupRef={(node) => {
              pipRefs.current[v] = node
            }}
          />
        ))}
      </div>

      <div className="voice-trial__pull-row">
        <button
          type="button"
          className="voice-trial__pull"
          onClick={onTrialPull}
          aria-label="Pull a rehearsal — cycle the headline through all three voices once."
          aria-pressed={rehearsing}
        >
          <span className="voice-trial__pull-pad" aria-hidden="true">
            <PullGlyph />
          </span>
          <span className="voice-trial__pull-stack">
            <span className="voice-trial__pull-eyebrow">
              {rehearsing ? 'rehearsing' : 'pull once'}
            </span>
            <span className="voice-trial__pull-headline">
              {rehearsing ? 'a · b · c' : 'a rehearsal pull'}
            </span>
            <span className="voice-trial__pull-sub">
              {rehearsing
                ? `showing ${VOICE_NAME[voice]} · then settling`
                : 'all three voices, once'}
            </span>
          </span>
          <span className="voice-trial__pull-state" aria-hidden="true">
            <span
              className={`voice-trial__pull-state-ring voice-trial__pull-state-ring--${voice}`}
              key={`voice-trial-pull-ring-${trialTick}`}
            />
            <span className="voice-trial__pull-state-letter">{VOICE_LETTER[voice]}</span>
          </span>
        </button>

        <div className="voice-trial__trail" aria-hidden="true">
          <svg viewBox="0 0 240 8" preserveAspectRatio="none">
            <path
              className="voice-trial__trail-path"
              d="M2 4c20-3 40 3 60 0s40-3 60 0 40 3 60 0 40-3 56 0"
              fill="none"
              stroke="currentColor"
              strokeWidth=".7"
              strokeLinecap="round"
              pathLength="100"
            />
            <circle cx="2" cy="4" r="1.2" fill="currentColor" className="voice-trial__trail-bead voice-trial__trail-bead--lead" />
            <circle cx="238" cy="4" r="1.2" fill="currentColor" className="voice-trial__trail-bead voice-trial__trail-bead--trail" />
          </svg>
          <span className="voice-trial__trail-tag">
            <em>{rehearsing ? 'rehearsal in progress' : 'one pull · three voices · the chosen voice returns'}</em>
          </span>
        </div>
      </div>

      <span className="sr-only">
        Use the arrow keys to move between voices. Press space or enter to run a rehearsal pull that cycles the headline through all three voices.
      </span>
    </div>
  )
}