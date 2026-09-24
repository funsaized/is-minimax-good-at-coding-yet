import { useId, type CSSProperties } from 'react'
import type { VoiceId } from './App'

/**
 * IterationMark — a small engraved seal that names the current folio
 * of the press (folio 462). Designed to read as a quiet, ornamented
 * signature wherever it sits — top-right of the topbar, corner of the
 * daybreak folio, or as the closing mark on the colophon.
 *
 * The mark is composed of three concentric circles carrying a numeral,
 * set inside a thin frame the device reads as a letterpress impression.
 * It shifts colour as the voice cycles and never carries chrome that
 * competes with the title's type.
 */

type IterationMarkProps = {
  voice: VoiceId
  size?: number
  variant?: 'inline' | 'corner' | 'closing'
  label?: string
  numeral?: string
}

export function IterationMark({
  voice,
  size = 44,
  variant = 'inline',
  label = 'folio cdlxii',
  numeral = '462',
}: IterationMarkProps) {
  const baseId = useId().replace(/:/g, '')
  const fadeId = `im-fade-${baseId}`
  const innerId = `im-inner-${baseId}`
  const tone = `var(--${voice})`
  const style = {
    '--mark-tone': tone,
    width: `${size}px`,
    height: `${size}px`,
  } as CSSProperties

  return (
    <svg
      className={`iteration-mark iteration-mark--${voice} iteration-mark--${variant}`}
      viewBox="0 0 60 60"
      style={style}
      role={variant === 'closing' ? 'img' : 'presentation'}
      aria-label={variant === 'closing' ? `${label}, the iteration seal of the page` : undefined}
      data-iteration-mark={numeral}
    >
      <defs>
        <linearGradient id={fadeId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
          <stop offset="50%" stopColor="currentColor" stopOpacity="1" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
        <radialGradient id={innerId} cx="50%" cy="42%" r="60%">
          <stop offset="0%" stopColor="currentColor" stopOpacity=".16" />
          <stop offset="62%" stopColor="currentColor" stopOpacity=".04" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* the outer frame — a thin, two-stroke roundel that reads as an impression */}
      <circle cx="30" cy="30" r="28" fill="none" stroke="currentColor" strokeWidth=".7" opacity=".62" />
      <circle cx="30" cy="30" r="26.4" fill="none" stroke="currentColor" strokeWidth=".28" opacity=".32" />

      {/* the inner orb — a faint radial wash that lifts the numeral */}
      <circle cx="30" cy="30" r="22" fill={`url(#${innerId})`} />

      {/* the dash ring — a mid-band of small ticks that mark the hours */}
      <g className="iteration-mark__ticks" stroke="currentColor" strokeLinecap="round" opacity=".5">
        <line x1="30" y1="2.4" x2="30" y2="4.6" strokeWidth=".55" />
        <line x1="30" y1="55.4" x2="30" y2="57.6" strokeWidth=".55" />
        <line x1="2.4" y1="30" x2="4.6" y2="30" strokeWidth=".55" />
        <line x1="55.4" y1="30" x2="57.6" y2="30" strokeWidth=".55" />
        <line x1="10.4" y1="10.4" x2="12" y2="12" strokeWidth=".4" opacity=".7" />
        <line x1="49.6" y1="10.4" x2="48" y2="12" strokeWidth=".4" opacity=".7" />
        <line x1="10.4" y1="49.6" x2="12" y2="48" strokeWidth=".4" opacity=".7" />
        <line x1="49.6" y1="49.6" x2="48" y2="48" strokeWidth=".4" opacity=".7" />
      </g>

      {/* the meridian sweep — a single soft arc that ties left to right */}
      <path
        d="M8 32 Q30 12 52 32"
        fill="none"
        stroke={`url(#${fadeId})`}
        strokeWidth=".6"
        strokeLinecap="round"
        opacity=".55"
      />

      {/* the four cardinal pips */}
      <circle cx="30" cy="6.5" r="1.1" fill="currentColor" opacity=".7" />
      <circle cx="30" cy="53.5" r="1.1" fill="currentColor" opacity=".7" />
      <circle cx="6.5" cy="30" r="1.1" fill="currentColor" opacity=".7" />
      <circle cx="53.5" cy="30" r="1.1" fill="currentColor" opacity=".7" />

      {/* the small bead at the centre — a star inside a star */}
      <circle cx="30" cy="30" r="14" fill="none" stroke="currentColor" strokeWidth=".32" strokeDasharray=".6 1.4" opacity=".5" />

      {/* the numeral */}
      <text
        className="iteration-mark__numeral"
        x="30"
        y="34"
        textAnchor="middle"
        fontFamily="'Iowan Old Style', 'Palatino Linotype', 'Book Antiqua', Georgia, serif"
        fontStyle="italic"
        fontWeight="500"
        fontSize="14"
        fill="currentColor"
      >
        {numeral}
      </text>

      {/* the small caption along the bottom arc */}
      <text
        className="iteration-mark__caption"
        x="30"
        y="44.5"
        textAnchor="middle"
        fontFamily="ui-monospace, 'SFMono-Regular', Menlo, 'Consolas', monospace"
        fontSize="3.2"
        letterSpacing="2"
        fill="currentColor"
        opacity=".78"
      >
        {label.toUpperCase()}
      </text>
    </svg>
  )
}

/**
 * IterationFolioCard — the iteration mark set inside a small ruled card.
 * Used as a corner detail on the daybreak folio and as the closing mark
 * on the colophon. The card adds a horizontal rule above and below the
 * seal so the mark sits as a signature line, not an isolated icon.
 */

type IterationFolioCardProps = {
  voice: VoiceId
  variant?: 'corner' | 'closing'
  numeral?: string
  caption?: string
  meta?: string
}

export function IterationFolioCard({
  voice,
  variant = 'corner',
  numeral = '462',
  caption,
  meta,
}: IterationFolioCardProps) {
  const style = {
    '--mark-tone': `var(--${voice})`,
  } as CSSProperties
  return (
    <aside
      className={`iteration-card iteration-card--${voice} iteration-card--${variant}`}
      style={style}
      role="group"
      aria-label={`Iteration ${numeral} of the press`}
    >
      <span className="iteration-card__rule iteration-card__rule--l" aria-hidden="true" />
      <span className="iteration-card__stack">
        <IterationMark voice={voice} size={variant === 'closing' ? 56 : 44} variant={variant} numeral={numeral} />
        <span className="iteration-card__caption">
          <em className="iteration-card__caption-key">the iteration</em>
          <span className="iteration-card__caption-rule" aria-hidden="true" />
          <em className="iteration-card__caption-val">no. {numeral}</em>
          {caption && (
            <>
              <span className="iteration-card__caption-dot" aria-hidden="true">·</span>
              <em className="iteration-card__caption-tag">{caption}</em>
            </>
          )}
        </span>
        {meta && <span className="iteration-card__meta">{meta}</span>}
      </span>
      <span className="iteration-card__rule iteration-card__rule--r" aria-hidden="true" />
    </aside>
  )
}