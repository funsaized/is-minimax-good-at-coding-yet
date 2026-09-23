import { useEffect, useId, useRef, useState, type CSSProperties, type KeyboardEvent as ReactKeyboardEvent } from 'react'
import type { VoiceId } from './App'

export type RegisterFolio = {
  id: string
  index: string
  label: string
}

type CompositionRegisterProps = {
  folios: RegisterFolio[]
  activeId: string
  voice: VoiceId
  setToday: string
  timeOfDay: string
  onCycleVoice: () => void
  onJump: (id: string) => void
  onCycleVoiceLabel?: string
}

const ORDER: VoiceId[] = ['quiet', 'human', 'bold']
const VOICE_LETTER: Record<VoiceId, string> = { quiet: 'A', human: 'B', bold: 'C' }
const VOICE_NAME: Record<VoiceId, string> = { quiet: 'quiet cut', human: 'human hand', bold: 'bold signal' }

export function CompositionRegister({
  folios,
  activeId,
  voice,
  setToday,
  timeOfDay,
  onCycleVoice,
  onJump,
  onCycleVoiceLabel,
}: CompositionRegisterProps) {
  const baseId = useId().replace(/:/g, '')
  const [reducedMotion, setReducedMotion] = useState(false)
  const [progress, setProgress] = useState(0)
  const idRef = useRef(activeId)
  idRef.current = activeId

  useEffect(() => {
    if (typeof window === 'undefined') return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mq.matches)
    const onChange = () => setReducedMotion(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    let raf = 0
    const compute = () => {
      const doc = document.documentElement
      const scrolled = window.scrollY
      const total = Math.max(1, doc.scrollHeight - window.innerHeight)
      const ratio = Math.max(0, Math.min(1, scrolled / total))
      setProgress(ratio)
      raf = 0
    }
    const onScroll = () => {
      if (raf) return
      raf = window.requestAnimationFrame(compute)
    }
    compute()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) window.cancelAnimationFrame(raf)
    }
  }, [])

  const nextVoice = ORDER[(ORDER.indexOf(voice) + 1) % ORDER.length]
  const cycleLabel = onCycleVoiceLabel ?? `cycle to ${VOICE_NAME[nextVoice]} (voice ${VOICE_LETTER[nextVoice]})`

  const onKey = (event: ReactKeyboardEvent<HTMLOListElement>) => {
    const target = event.target as HTMLElement | null
    if (target?.tagName?.toLowerCase() !== 'a') return
    const idx = folios.findIndex(f => f.id === idRef.current)
    if (idx < 0) return
    let nextIdx = idx
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') nextIdx = (idx + 1) % folios.length
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') nextIdx = (idx - 1 + folios.length) % folios.length
    else if (event.key === 'Home') nextIdx = 0
    else if (event.key === 'End') nextIdx = folios.length - 1
    if (nextIdx === idx) return
    event.preventDefault()
    onJump(folios[nextIdx].id)
  }

  const style = {
    '--register-tone': `var(--${voice})`,
    '--register-progress': progress.toFixed(3),
  } as CSSProperties

  return (
    <div
      className={`compose-register compose-register--${voice} ${reducedMotion ? 'is-quiet' : ''}`}
      style={style}
      role="presentation"
    >
      <svg className="compose-register__defs" aria-hidden="true">
        <defs>
          <linearGradient id={`register-track-${baseId}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
            <stop offset="6%" stopColor="currentColor" stopOpacity=".55" />
            <stop offset="50%" stopColor="currentColor" stopOpacity=".7" />
            <stop offset="94%" stopColor="currentColor" stopOpacity=".55" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
          <linearGradient id={`register-fill-${baseId}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
            <stop offset="14%" stopColor="currentColor" stopOpacity=".85" />
            <stop offset="100%" stopColor="currentColor" stopOpacity=".95" />
          </linearGradient>
        </defs>
      </svg>

      <span className="compose-register__gutter compose-register__gutter--l" aria-hidden="true">
        <svg viewBox="0 0 18 12" preserveAspectRatio="none" aria-hidden="true">
          <line x1="0" y1="6" x2="18" y2="6" stroke="currentColor" strokeWidth=".5" strokeLinecap="round" />
          <circle cx="3" cy="6" r=".9" fill="currentColor" />
          <circle cx="15" cy="6" r=".9" fill="currentColor" />
        </svg>
      </span>

      <ol
        className="compose-register__folios"
        aria-label="Folio register · jump to any folio"
        onKeyDown={onKey}
      >
        {folios.map((f, idx) => {
          const isActive = f.id === activeId
          return (
            <li key={f.id} className={`compose-register__folio ${isActive ? 'is-active' : ''}`}>
              <a
                href={`#${f.id}`}
                className="compose-register__mark"
                aria-label={`Folio ${f.index} · ${f.label}${isActive ? ' · now reading' : ''}`}
                aria-current={isActive ? 'true' : undefined}
                onClick={event => {
                  event.preventDefault()
                  onJump(f.id)
                }}
              >
                <span className="compose-register__index" aria-hidden="true">{f.index}</span>
                <span className="compose-register__dot" aria-hidden="true">
                  <svg viewBox="0 0 8 8">
                    <circle cx="4" cy="4" r="2.6" fill="currentColor" />
                    <circle cx="4" cy="4" r="1" fill="var(--night)" />
                  </svg>
                </span>
                <span className="compose-register__label" aria-hidden="true">{f.label}</span>
              </a>
            </li>
          )
        })}
      </ol>

      <span className="compose-register__rail" aria-hidden="true">
        <svg viewBox="0 0 200 4" preserveAspectRatio="none">
          <line
            x1="0"
            y1="2"
            x2="200"
            y2="2"
            stroke={`url(#${baseId ? `register-track-${baseId}` : 'register-track'})`}
            strokeWidth=".55"
            strokeLinecap="round"
          />
          <line
            x1="0"
            y1="2"
            x2={200 * progress}
            y2="2"
            stroke={`url(#${baseId ? `register-fill-${baseId}` : 'register-fill'})`}
            strokeWidth=".85"
            strokeLinecap="round"
            opacity=".85"
          />
        </svg>
      </span>

      <span className="compose-register__gutter compose-register__gutter--r" aria-hidden="true">
        <svg viewBox="0 0 18 12" preserveAspectRatio="none" aria-hidden="true">
          <line x1="0" y1="6" x2="18" y2="6" stroke="currentColor" strokeWidth=".5" strokeLinecap="round" />
          <circle cx="3" cy="6" r=".9" fill="currentColor" />
          <circle cx="15" cy="6" r=".9" fill="currentColor" />
        </svg>
      </span>

      <span className="compose-register__date" aria-label={`Set on ${setToday}`}>
        <em>set on</em>
        <span className="compose-register__date-word">{setToday}</span>
      </span>

      <span className="compose-register__sky" aria-hidden="true">
        <span className="compose-register__sky-word">{timeOfDay}</span>
      </span>

      <button
        type="button"
        className={`compose-register__voice compose-register__voice--${voice}`}
        onClick={onCycleVoice}
        aria-label={cycleLabel}
        title={cycleLabel}
      >
        <span className="compose-register__voice-letter" aria-hidden="true">{VOICE_LETTER[voice]}</span>
        <span className="compose-register__voice-stack">
          <em className="compose-register__voice-name">{VOICE_NAME[voice]}</em>
          <span className="compose-register__voice-hint">
            <kbd>shift</kbd>+<kbd>v</kbd>
            <span className="compose-register__voice-hint-dot" aria-hidden="true">·</span>
            cycle voice
          </span>
        </span>
        <span className="compose-register__voice-mark" aria-hidden="true">
          <svg viewBox="0 0 14 14">
            <path d="M3 7 a4 4 0 0 1 8 0" fill="none" stroke="currentColor" strokeWidth=".85" strokeLinecap="round" />
            <path d="M11 1 a6 6 0 0 1 0 12" fill="none" stroke="currentColor" strokeWidth=".55" strokeLinecap="round" opacity=".55" />
            <path d="M9 1.5 L11.5 1 L11 3.5" fill="none" stroke="currentColor" strokeWidth=".85" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </button>
    </div>
  )
}
