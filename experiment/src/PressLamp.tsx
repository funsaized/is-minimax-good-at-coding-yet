import { useEffect, useId, useState, type CSSProperties } from 'react'
import type { VoiceId } from './Press'

type PressLampProps = {
  voice: VoiceId
}

const VOICE_GLOW: Record<VoiceId, string> = {
  quiet: 'rgba(146, 186, 255, .16)',
  human: 'rgba(255, 138, 110, .18)',
  bold: 'rgba(216, 255, 106, .22)',
}

const VOICE_TONE: Record<VoiceId, string> = {
  quiet: 'var(--blue)',
  human: 'var(--coral)',
  bold: 'var(--acid)',
}

export function PressLamp({ voice }: PressLampProps) {
  const baseId = useId().replace(/:/g, '')
  const cordId = `press-lamp-cord-${baseId}`
  const bulbId = `press-lamp-bulb-${baseId}`
  const shadeId = `press-lamp-shade-${baseId}`
  const glowId = `press-lamp-glow-${baseId}`
  const [active, setActive] = useState(true)

  const style = {
    '--press-lamp-tone': VOICE_TONE[voice],
    '--press-lamp-glow': VOICE_GLOW[voice],
  } as CSSProperties

  useEffect(() => {
    if (typeof window === 'undefined') return
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) {
      setActive(true)
      return
    }
    let frame = 0
    const onScroll = () => {
      if (frame) return
      frame = window.requestAnimationFrame(() => {
        frame = 0
        const scrollY = window.scrollY || window.pageYOffset || 0
        const threshold = window.innerHeight * 0.85
        setActive(scrollY < threshold)
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <div
      className={`press-lamp press-lamp--${voice} ${active ? 'is-active' : 'is-faded'}`}
      style={style}
      aria-hidden="true"
    >
      <svg className="press-lamp__defs" viewBox="0 0 200 320" preserveAspectRatio="xMidYMin meet" aria-hidden="true">
        <defs>
          <linearGradient id={cordId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
            <stop offset="14%" stopColor="currentColor" stopOpacity=".42" />
            <stop offset="100%" stopColor="currentColor" stopOpacity=".78" />
          </linearGradient>
          <radialGradient id={bulbId} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--press-lamp-glow)" stopOpacity="1" />
            <stop offset="38%" stopColor="var(--press-lamp-glow)" stopOpacity=".55" />
            <stop offset="72%" stopColor="var(--press-lamp-glow)" stopOpacity=".14" />
            <stop offset="100%" stopColor="var(--press-lamp-glow)" stopOpacity="0" />
          </radialGradient>
          <radialGradient id={shadeId} cx="50%" cy="34%" r="58%">
            <stop offset="0%" stopColor="var(--press-lamp-glow)" stopOpacity=".95" />
            <stop offset="62%" stopColor="var(--press-lamp-glow)" stopOpacity=".18" />
            <stop offset="100%" stopColor="var(--press-lamp-glow)" stopOpacity="0" />
          </radialGradient>
          <filter id={glowId} x="-30%" y="-30%" width="160%" height="160%">
            <feTurbulence type="fractalNoise" baseFrequency="2.4" numOctaves="2" seed="29" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .4 0" />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
        </defs>
      </svg>

      <span className="press-lamp__cord" aria-hidden="true">
        <svg viewBox="0 0 2 240" preserveAspectRatio="none">
          <line x1="1" y1="0" x2="1" y2="240" stroke={`url(#${cordId})`} strokeWidth="0.9" strokeLinecap="round" />
          <circle cx="1" cy="240" r="0.9" fill="currentColor" opacity=".8" />
        </svg>
      </span>

      <span className="press-lamp__hood" aria-hidden="true">
        <svg viewBox="0 0 60 18" preserveAspectRatio="none">
          <path d="M0 4 L60 4" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" opacity=".7" />
          <path d="M8 4 L52 4" stroke="currentColor" strokeWidth="0.35" strokeDasharray="1.2 1.8" opacity=".55" />
        </svg>
      </span>

      <span className="press-lamp__shade" aria-hidden="true">
        <svg viewBox="0 0 64 64" className="press-lamp__shade-svg">
          <g filter={`url(#${glowId})`}>
            <path
              d="M10 22 Q10 8 32 8 Q54 8 54 22 L48 30 Q48 36 32 36 Q16 36 16 30 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.9"
              strokeLinejoin="round"
              opacity=".88"
            />
            <path
              d="M14 24 Q14 12 32 12 Q50 12 50 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.45"
              opacity=".55"
            />
            <path
              d="M18 26 Q18 16 32 16 Q46 16 46 26"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.35"
              opacity=".4"
            />
            <line x1="22" y1="30" x2="42" y2="30" stroke="currentColor" strokeWidth="0.45" opacity=".55" />
            <circle cx="22" cy="30" r="0.85" fill="currentColor" opacity=".7" />
            <circle cx="42" cy="30" r="0.85" fill="currentColor" opacity=".7" />
          </g>
        </svg>
      </span>

      <span className="press-lamp__filament" aria-hidden="true">
        <svg viewBox="0 0 28 20">
          <path
            d="M6 6 Q10 14 14 6 T22 6"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.6"
            strokeLinecap="round"
            opacity=".85"
          />
          <path
            d="M8 8 Q11 13 14 8 T20 8"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.4"
            strokeLinecap="round"
            opacity=".55"
          />
        </svg>
      </span>

      <span className="press-lamp__bulb" aria-hidden="true">
        <svg viewBox="0 0 36 36">
          <defs>
            <radialGradient id={`press-lamp-bulb-core-${baseId}`} cx="50%" cy="62%" r="44%">
              <stop offset="0%" stopColor="var(--press-lamp-glow)" stopOpacity="1" />
              <stop offset="55%" stopColor="var(--press-lamp-glow)" stopOpacity=".5" />
              <stop offset="100%" stopColor="var(--press-lamp-glow)" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="18" cy="20" r="12" fill={`url(#press-lamp-bulb-core-${baseId})`} />
          <circle cx="18" cy="20" r="4.2" fill="var(--press-lamp-tone)" opacity=".95" />
          <circle cx="18" cy="20" r="2.4" fill="var(--paper)" opacity=".9" />
          <circle cx="18" cy="20" r="9.5" fill="none" stroke="currentColor" strokeWidth="0.35" opacity=".4" />
        </svg>
      </span>

      <span className="press-lamp__cast" aria-hidden="true">
        <svg viewBox="0 0 320 360" preserveAspectRatio="xMidYMin meet">
          <ellipse cx="160" cy="40" rx="120" ry="180" fill={`url(#${shadeId})`} />
          <ellipse cx="160" cy="40" rx="80" ry="120" fill={`url(#${bulbId})`} opacity="0.95" />
        </svg>
      </span>

      <span className="press-lamp__stem" aria-hidden="true">
        <svg viewBox="0 0 12 28">
          <line x1="6" y1="0" x2="6" y2="28" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" opacity=".7" />
          <circle cx="6" cy="0" r="1.4" fill="currentColor" opacity=".9" />
          <circle cx="6" cy="28" r="1.2" fill="currentColor" opacity=".85" />
        </svg>
      </span>

      <span className="press-lamp__pull" aria-hidden="true">
        <svg viewBox="0 0 16 44">
          <line x1="8" y1="0" x2="8" y2="36" stroke="currentColor" strokeWidth="0.55" strokeDasharray="1.4 1.8" opacity=".5" />
          <circle cx="8" cy="40" r="3.4" fill="currentColor" opacity=".78" />
          <circle cx="8" cy="40" r="1.6" fill="var(--paper)" opacity=".55" />
        </svg>
      </span>
    </div>
  )
}