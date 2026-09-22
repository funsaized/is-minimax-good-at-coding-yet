import { useId, type CSSProperties } from 'react'
import type { VoiceId } from './App'

type BreathPlateProps = {
  voice: VoiceId
  caption?: string
  aside?: string
}

export function BreathPlate({ voice, caption = 'one breath', aside = 'set the line · read the page' }: BreathPlateProps) {
  const baseId = useId().replace(/:/g, '')
  const haloId = `breath-halo-${baseId}`
  const tickId = `breath-tick-${baseId}`

  const style = {
    '--breath-tone': `var(--${voice})`,
  } as CSSProperties

  return (
    <aside className="breath-plate" style={style} aria-hidden="true">
      <svg className="breath-plate__defs" viewBox="0 0 400 80" preserveAspectRatio="none">
        <defs>
          <radialGradient id={haloId} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--breath-tone)" stopOpacity=".55" />
            <stop offset="55%" stopColor="var(--breath-tone)" stopOpacity=".12" />
            <stop offset="100%" stopColor="var(--breath-tone)" stopOpacity="0" />
          </radialGradient>
          <linearGradient id={tickId} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--breath-tone)" stopOpacity="0" />
            <stop offset="50%" stopColor="var(--breath-tone)" stopOpacity=".7" />
            <stop offset="100%" stopColor="var(--breath-tone)" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      <span className="breath-plate__rule breath-plate__rule--l">
        <svg viewBox="0 0 120 24" preserveAspectRatio="none">
          <path
            d="M2 12 Q40 6 80 12 T118 12"
            fill="none"
            stroke="currentColor"
            strokeWidth=".5"
            strokeDasharray="1.6 3.4"
            opacity=".55"
            className="breath-plate__rule-line"
          />
          <circle cx="2" cy="12" r="1" fill="currentColor" opacity=".7" className="breath-plate__rule-cap" />
        </svg>
      </span>

      <span className="breath-plate__center">
        <span className="breath-plate__halo" aria-hidden="true">
          <svg viewBox="0 0 80 80">
            <circle cx="40" cy="40" r="36" fill={`url(#${haloId})`} className="breath-plate__halo-pulse" />
          </svg>
        </span>

        <span className="breath-plate__ring breath-plate__ring--a" aria-hidden="true">
          <svg viewBox="0 0 64 64">
            <circle cx="32" cy="32" r="30" fill="none" stroke="currentColor" strokeWidth=".45" strokeDasharray="1.4 3" opacity=".55" className="breath-plate__ring-spin" />
          </svg>
        </span>

        <span className="breath-plate__ring breath-plate__ring--b" aria-hidden="true">
          <svg viewBox="0 0 64 64">
            <circle cx="32" cy="32" r="22" fill="none" stroke="currentColor" strokeWidth=".35" opacity=".4" />
            <circle cx="32" cy="32" r="22" fill="none" stroke="url(#tickId)" strokeWidth=".4" className="breath-plate__ring-spin breath-plate__ring-spin--reverse" />
          </svg>
        </span>

        <span className="breath-plate__bead" aria-hidden="true">
          <svg viewBox="0 0 18 18">
            <circle cx="9" cy="9" r="8" fill="var(--night)" stroke="currentColor" strokeWidth=".6" />
            <circle cx="9" cy="9" r="4.6" fill="currentColor" opacity=".55" className="breath-plate__bead-inner" />
            <circle cx="9" cy="9" r="1.4" fill="var(--night)" />
            <line x1="9" y1="2" x2="9" y2="6" stroke="currentColor" strokeWidth=".5" strokeLinecap="round" opacity=".7" />
            <line x1="9" y1="12" x2="9" y2="16" stroke="currentColor" strokeWidth=".5" strokeLinecap="round" opacity=".7" />
            <line x1="2" y1="9" x2="6" y2="9" stroke="currentColor" strokeWidth=".5" strokeLinecap="round" opacity=".7" />
            <line x1="12" y1="9" x2="16" y2="9" stroke="currentColor" strokeWidth=".5" strokeLinecap="round" opacity=".7" />
          </svg>
        </span>

        <span className="breath-plate__copy">
          <span className="breath-plate__caption">
            <em>{caption}</em>
          </span>
          <span className="breath-plate__aside">
            <em>{aside}</em>
          </span>
        </span>
      </span>

      <span className="breath-plate__rule breath-plate__rule--r">
        <svg viewBox="0 0 120 24" preserveAspectRatio="none">
          <path
            d="M118 12 Q80 6 40 12 T2 12"
            fill="none"
            stroke="currentColor"
            strokeWidth=".5"
            strokeDasharray="1.6 3.4"
            opacity=".55"
            className="breath-plate__rule-line"
          />
          <circle cx="118" cy="12" r="1" fill="currentColor" opacity=".7" className="breath-plate__rule-cap" />
        </svg>
      </span>

      <span className="breath-plate__stitch" aria-hidden="true">
        <svg viewBox="0 0 200 6" preserveAspectRatio="none">
          <line x1="0" y1="3" x2="200" y2="3" stroke="currentColor" strokeWidth=".4" strokeDasharray="1 4" opacity=".45" />
          <circle cx="40" cy="3" r=".8" fill="currentColor" opacity=".6" />
          <circle cx="100" cy="3" r="1.1" fill="currentColor" opacity=".75" />
          <circle cx="160" cy="3" r=".8" fill="currentColor" opacity=".6" />
        </svg>
      </span>
    </aside>
  )
}
