import { useId } from 'react'
import type { CSSProperties } from 'react'
import type { VoiceId } from './Press'

type PressImprintProps = {
  voice: VoiceId
  folio?: string
  label?: string
  setToday?: string
  tone?: string
}

const VOICE_TONE: Record<VoiceId, string> = {
  quiet: 'var(--blue)',
  human: 'var(--coral)',
  bold: 'var(--acid)',
}

const VOICE_VERB: Record<VoiceId, string> = {
  quiet: 'set with care',
  human: 'set by hand',
  bold: 'set, without apology',
}

const VOICE_MARK: Record<VoiceId, string> = {
  quiet: 'A',
  human: 'B',
  bold: 'C',
}

export function PressImprint({
  voice,
  folio = 'folio i',
  label = 'm³',
  setToday,
  tone,
}: PressImprintProps) {
  const baseId = useId().replace(/:/g, '')
  const grainId = `press-imprint-grain-${baseId}`
  const inkId = `press-imprint-ink-${baseId}`
  const resolve = tone ?? VOICE_TONE[voice]
  const style = {
    '--imprint-tone': resolve,
    '--imprint-grain': `url(#${grainId})`,
    '--imprint-ink': `url(#${inkId})`,
  } as CSSProperties
  return (
    <figure
      className={`press-imprint press-imprint--${voice}`}
      style={style}
      aria-label={`Press imprint · ${label} · ${folio} · ${VOICE_VERB[voice]}`}
    >
      <svg className="press-imprint__defs" viewBox="0 0 240 240" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <filter id={grainId} x="-12%" y="-12%" width="124%" height="124%">
            <feTurbulence type="fractalNoise" baseFrequency="2.6" numOctaves="2" seed="11" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .48 0" />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
          <linearGradient id={inkId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
            <stop offset="14%" stopColor="currentColor" stopOpacity=".62" />
            <stop offset="50%" stopColor="currentColor" stopOpacity=".9" />
            <stop offset="86%" stopColor="currentColor" stopOpacity=".62" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      <span className="press-imprint__plate" aria-hidden="true">
        <svg viewBox="0 0 168 168" className="press-imprint__seal">
          <g filter={`url(#${grainId})`} opacity=".95">
            <circle cx="84" cy="84" r="76" fill="none" stroke="currentColor" strokeWidth="1" />
            <circle cx="84" cy="84" r="68" fill="none" stroke="currentColor" strokeWidth=".4" strokeDasharray="1.4 2.4" opacity=".55" />
            <circle cx="84" cy="84" r="50" fill="none" stroke="currentColor" strokeWidth=".35" opacity=".35" />
            <line x1="14" y1="84" x2="154" y2="84" stroke="currentColor" strokeWidth=".3" opacity=".25" />
            <line x1="84" y1="14" x2="84" y2="154" stroke="currentColor" strokeWidth=".3" opacity=".25" />
            <text
              x="84"
              y="34"
              textAnchor="middle"
              fontFamily="ui-monospace, monospace"
              fontSize="5.6"
              letterSpacing="2.6"
              fill="currentColor"
              opacity=".65"
            >
              PRESS · IMPRINT
            </text>
            <text
              x="84"
              y="98"
              textAnchor="middle"
              fontFamily="Georgia, 'Iowan Old Style', serif"
              fontStyle="italic"
              fontSize="38"
              letterSpacing="-.04em"
              fill="currentColor"
            >
              {label}
            </text>
            <text
              x="84"
              y="118"
              textAnchor="middle"
              fontFamily="ui-monospace, monospace"
              fontSize="4.2"
              letterSpacing="2"
              fill="currentColor"
              opacity=".55"
            >
              {folio}
            </text>
            <text
              x="84"
              y="142"
              textAnchor="middle"
              fontFamily="ui-monospace, monospace"
              fontSize="4"
              letterSpacing="2"
              fill="currentColor"
              opacity=".45"
            >
              {VOICE_VERB[voice]}
            </text>
          </g>
          <circle className="press-imprint__bead" cx="148" cy="120" r="2" fill="currentColor" />
          <circle className="press-imprint__bead press-imprint__bead--halo" cx="148" cy="120" r="5" fill="none" stroke="currentColor" strokeWidth=".3" opacity=".4" />
        </svg>
        <span className="press-imprint__plate-mark" aria-hidden="true">
          <span className="press-imprint__plate-mark-dot" />
          <span className="press-imprint__plate-mark-key">voice</span>
          <span className="press-imprint__plate-mark-letter">{VOICE_MARK[voice]}</span>
        </span>
      </span>

      <figcaption className="press-imprint__caption">
        <span className="press-imprint__caption-row press-imprint__caption-row--lead">
          <span className="press-imprint__caption-mark" aria-hidden="true">※</span>
          <em className="press-imprint__caption-lead">a press imprint</em>
        </span>
        <span className="press-imprint__caption-row">
          <span className="press-imprint__caption-key">set today</span>
          {setToday ? (
            <span className="press-imprint__caption-value">{setToday}</span>
          ) : (
            <span className="press-imprint__caption-value press-imprint__caption-value--set">composed for the next reader</span>
          )}
        </span>
        <span className="press-imprint__caption-row">
          <span className="press-imprint__caption-key">marked at</span>
          <span className="press-imprint__caption-value press-imprint__caption-value--quiet">
            <em>three words</em>
            <span aria-hidden="true">·</span>
            <em>three voices</em>
            <span aria-hidden="true">·</span>
            <em>one question, kept open</em>
          </span>
        </span>
      </figcaption>
    </figure>
  )
}