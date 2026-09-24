import { useId, type CSSProperties } from 'react'
import type { VoiceId } from './App'

/**
 * IterationMark — a small engraved seal that names the current folio
 * of the press. Designed to read as a quiet, ornamented signature
 * wherever it sits — top-right of the topbar, corner of the daybreak
 * folio, or as the closing mark on the colophon.
 *
 * The mark is composed of concentric circles, a meridian sweep, four
 * cardinal pips and a numeric centre. The numeral is set in a confident
 * italic with a small superscript accent; the caption reads as a
 * letterpress engraving beneath. The mark shifts colour as the voice
 * cycles and never carries chrome that competes with the title's type.
 */

type IterationMarkProps = {
  voice: VoiceId
  size?: number
  variant?: 'inline' | 'corner' | 'closing'
  label?: string
  numeral?: string
  caption?: string
}

export function IterationMark({
  voice,
  size = 44,
  variant = 'inline',
  label = 'folio cdlxii',
  numeral = '462',
  caption,
}: IterationMarkProps) {
  const baseId = useId().replace(/:/g, '')
  const fadeId = `im-fade-${baseId}`
  const innerId = `im-inner-${baseId}`
  const groundId = `im-ground-${baseId}`
  const tone = `var(--${voice})`
  const style = {
    '--mark-tone': tone,
    width: `${size}px`,
    height: `${size}px`,
  } as CSSProperties

  const captionText = caption ?? label

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
          <stop offset="0%" stopColor="currentColor" stopOpacity=".18" />
          <stop offset="62%" stopColor="currentColor" stopOpacity=".05" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={groundId} cx="50%" cy="58%" r="58%">
          <stop offset="0%" stopColor="currentColor" stopOpacity=".12" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* the ground wash — a faint radial lift behind the seal */}
      <circle cx="30" cy="30" r="26" fill={`url(#${groundId})`} />

      {/* the outer frame — three concentric rounds that read as a letterpress impression */}
      <circle cx="30" cy="30" r="28" fill="none" stroke="currentColor" strokeWidth=".7" opacity=".7" />
      <circle cx="30" cy="30" r="26.4" fill="none" stroke="currentColor" strokeWidth=".26" opacity=".34" />
      <circle cx="30" cy="30" r="24.8" fill="none" stroke="currentColor" strokeWidth=".18" strokeDasharray=".5 1.4" opacity=".26" />

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
      {/* a paired counter-arc beneath, lifting the lower half of the seal */}
      <path
        d="M9.5 32 Q30 49 50.5 32"
        fill="none"
        stroke={`url(#${fadeId})`}
        strokeWidth=".4"
        strokeLinecap="round"
        opacity=".32"
      />

      {/* the four cardinal pips */}
      <circle cx="30" cy="6.5" r="1.1" fill="currentColor" opacity=".7" />
      <circle cx="30" cy="53.5" r="1.1" fill="currentColor" opacity=".7" />
      <circle cx="6.5" cy="30" r="1.1" fill="currentColor" opacity=".7" />
      <circle cx="53.5" cy="30" r="1.1" fill="currentColor" opacity=".7" />

      {/* the small bead at the centre — a star inside a star */}
      <circle cx="30" cy="30" r="14" fill="none" stroke="currentColor" strokeWidth=".32" strokeDasharray=".6 1.4" opacity=".55" />
      <circle cx="30" cy="30" r="9" fill="none" stroke="currentColor" strokeWidth=".22" strokeDasharray=".4 1.2" opacity=".42" />

      {/* a tiny pencil-line that reads as the engraver's mark above the numeral */}
      <line x1="24" y1="22.4" x2="36" y2="22.4" stroke="currentColor" strokeWidth=".26" strokeLinecap="round" opacity=".55" />
      <circle cx="30" cy="22.4" r=".55" fill="currentColor" opacity=".7" />

      {/* the numeral — a confident italic that anchors the seal */}
      <text
        className="iteration-mark__numeral"
        x="30"
        y="34.5"
        textAnchor="middle"
        fontFamily="'Iowan Old Style', 'Palatino Linotype', 'Book Antiqua', Georgia, serif"
        fontStyle="italic"
        fontWeight="500"
        fontSize="15"
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
        opacity=".82"
      >
        {captionText.toUpperCase()}
      </text>

      {/* the engraver's flourish — a tiny pen-stroke beneath the caption */}
      <g className="iteration-mark__flourish" stroke="currentColor" fill="none" strokeLinecap="round" opacity=".5">
        <path d="M22 49.5 Q30 47.6 38 49.5" strokeWidth=".26" />
        <circle cx="30" cy="48.5" r=".45" fill="currentColor" stroke="none" />
      </g>
    </svg>
  )
}

/**
 * IterationFolioCard — the iteration mark set inside a small ruled card.
 * Used as a corner detail on the daybreak folio and as the closing mark
 * on the colophon. The card adds a horizontal rule above and below the
 * seal so the mark sits as a signature line, not an isolated icon.
 *
 * The closing variant opens a third line that names the press, so the
 * card reads as the press's final signature beneath the colophon.
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
        <IterationMark voice={voice} size={variant === 'closing' ? 64 : 48} variant={variant} numeral={numeral} />
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
        {variant === 'closing' && (
          <span className="iteration-card__signature" aria-hidden="true">
            <span className="iteration-card__signature-rule iteration-card__signature-rule--l" />
            <em className="iteration-card__signature-mark">m³ press</em>
            <span className="iteration-card__signature-rule iteration-card__signature-rule--r" />
          </span>
        )}
        {meta && <span className="iteration-card__meta">{meta}</span>}
      </span>
      <span className="iteration-card__rule iteration-card__rule--r" aria-hidden="true" />
    </aside>
  )
}