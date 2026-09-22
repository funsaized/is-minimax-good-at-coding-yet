import { useId, type CSSProperties } from 'react'
import type { VoiceId } from './App'

type PressEpigraphProps = {
  voice: VoiceId
}

const SEASON_NOTE: Record<VoiceId, string> = {
  quiet: 'set softly · held close',
  human: 'set by hand · felt warm',
  bold: 'set at full height',
}

const VOICE_NAME: Record<VoiceId, string> = {
  quiet: 'quiet cut',
  human: 'human hand',
  bold: 'bold signal',
}

export function PressEpigraph({ voice }: PressEpigraphProps) {
  const baseId = useId().replace(/:/g, '')
  const toneStyle = { '--ep-tone': `var(--${voice})` } as CSSProperties
  const season = SEASON_NOTE[voice]

  return (
    <section
      className={`press-epigraph press-epigraph--${voice}`}
      style={toneStyle}
      aria-label="The compositor's note — the press manifesto"
    >
      <span className="press-epigraph__defs" aria-hidden="true">
        <svg width="0" height="0" viewBox="0 0 200 60" preserveAspectRatio="none">
          <defs>
            <linearGradient id={`ep-grad-${baseId}`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="var(--ep-tone, var(--quiet))" stopOpacity="0" />
              <stop offset="14%" stopColor="var(--ep-tone, var(--quiet))" stopOpacity=".6" />
              <stop offset="50%" stopColor="var(--ep-tone, var(--quiet))" stopOpacity=".85" />
              <stop offset="86%" stopColor="var(--ep-tone, var(--quiet))" stopOpacity=".6" />
              <stop offset="100%" stopColor="var(--ep-tone, var(--quiet))" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </span>

      <header className="press-epigraph__head" aria-hidden="true">
        <span className="press-epigraph__head-mark">
          <svg viewBox="0 0 28 28">
            <circle cx="14" cy="14" r="11.5" fill="none" stroke="currentColor" strokeWidth=".6" />
            <circle cx="14" cy="14" r="8" fill="none" stroke="currentColor" strokeWidth=".35" strokeDasharray=".8 1.6" opacity=".6" />
            <line x1="14" y1="2.5" x2="14" y2="25.5" stroke="currentColor" strokeWidth=".35" opacity=".55" />
            <line x1="2.5" y1="14" x2="25.5" y2="14" stroke="currentColor" strokeWidth=".35" opacity=".55" />
            <circle cx="14" cy="14" r="2" fill="currentColor" />
            <circle cx="14" cy="14" r=".7" fill="var(--night)" />
          </svg>
        </span>
        <span className="press-epigraph__head-key">
          <em>from the press</em>
          <span className="press-epigraph__head-dot" aria-hidden="true" />
          <span className="press-epigraph__head-sub">a compositor's note · set in {VOICE_NAME[voice]}</span>
        </span>
      </header>

      <blockquote className="press-epigraph__body">
        <p className="press-epigraph__line">
          one line, set three ways, marked once —
          <span className="press-epigraph__em"> kept close to the press.</span>
        </p>
        <p className="press-epigraph__line">
          a quiet cut, a human hand, a bold signal —
          <span className="press-epigraph__em"> one line holds all three.</span>
        </p>
        <p className="press-epigraph__line press-epigraph__line--coda">
          read it three times · let one voice hold · fold the answer back.
        </p>
      </blockquote>

      <footer className="press-epigraph__foot" aria-hidden="true">
        <span className="press-epigraph__foot-set">
          <em>set at first light</em>
          <span className="press-epigraph__foot-dot" aria-hidden="true" />
          <em>{season}</em>
        </span>
        <span className="press-epigraph__foot-dot" aria-hidden="true" />
        <span className="press-epigraph__foot-mark" aria-hidden="true">
          <svg viewBox="0 0 24 12" preserveAspectRatio="none">
            <path
              d="M2 6 c4 -6 8 -6 12 0 s8 6 8 0"
              fill="none"
              stroke="currentColor"
              strokeWidth=".55"
              strokeLinecap="round"
              opacity=".75"
            />
            <circle cx="12" cy="6" r="1.1" fill="currentColor" />
          </svg>
        </span>
      </footer>
    </section>
  )
}
