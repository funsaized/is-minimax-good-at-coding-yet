import { useId, type CSSProperties } from 'react'
import type { VoiceId } from './App'

/**
 * IterationMark — a pressed-wax seal that names the current folio of the
 * press. Iteration 464 makes the seal more confident: a layered wax
 * construction reads like a real letterpress impression (a slightly
 * irregular rim, an upper-left highlight, a lower-right shadow, an
 * inset engravement), so the mark sits on the page like a thumbprint
 * rather than as a flat glyph.
 *
 * Designed to read as a quiet, ornamented signature wherever it sits —
 * topbar, daybreak plate, colophon, or the closing card. The mark
 * shifts colour as the voice cycles; the numeral sits inside the wax
 * with the Roman numeral held close as a small 'page-side stamp'.
 */

type IterationMarkProps = {
  voice: VoiceId
  size?: number
  variant?: 'inline' | 'corner' | 'closing'
  label?: string
  numeral?: string
  roman?: string
  caption?: string
}

export function IterationMark({
  voice,
  size = 44,
  variant = 'inline',
  label = 'folio cdlxiv',
  numeral = '464',
  roman = 'cdlxiv',
  caption,
}: IterationMarkProps) {
  const baseId = useId().replace(/:/g, '')
  const fadeId = `im-fade-${baseId}`
  const waxFillId = `im-wax-fill-${baseId}`
  const waxDeepId = `im-wax-deep-${baseId}`
  const waxHilightId = `im-wax-hi-${baseId}`
  const waxInkId = `im-wax-ink-${baseId}`
  const rimId = `im-rim-${baseId}`
  const groundId = `im-ground-${baseId}`
  const innerId = `im-inner-${baseId}`
  const tone = `var(--${voice})`
  const style = {
    '--mark-tone': tone,
    width: `${size}px`,
    height: `${size}px`,
  } as CSSProperties

  const captionText = (caption ?? label).toUpperCase()

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
        {/* a pressed-wax puddle fill — light bleeding from upper-left to a deep rim */}
        <radialGradient id={waxFillId} cx="38%" cy="32%" r="72%">
          <stop offset="0%" stopColor={tone} stopOpacity=".95" />
          <stop offset="46%" stopColor={tone} stopOpacity=".72" />
          <stop offset="86%" stopColor={tone} stopOpacity=".42" />
          <stop offset="100%" stopColor={tone} stopOpacity=".18" />
        </radialGradient>
        {/* the deep, shadowed bottom-right edge of the wax */}
        <radialGradient id={waxDeepId} cx="76%" cy="84%" r="60%">
          <stop offset="0%" stopColor="rgba(0,0,0,0)" />
          <stop offset="64%" stopColor="rgba(0,0,0,0)" />
          <stop offset="84%" stopColor="rgba(0,0,0,.32)" />
          <stop offset="100%" stopColor="rgba(0,0,0,.5)" />
        </radialGradient>
        {/* the upper-left highlight, hot and small */}
        <radialGradient id={waxHilightId} cx="32%" cy="26%" r="22%">
          <stop offset="0%" stopColor="rgba(255, 255, 255, .55)" />
          <stop offset="60%" stopColor="rgba(255, 255, 255, .12)" />
          <stop offset="100%" stopColor="rgba(255, 255, 255, 0)" />
        </radialGradient>
        {/* a thin ink halo around the seal, like the wax soaked into the paper */}
        <radialGradient id={waxInkId} cx="50%" cy="50%" r="52%">
          <stop offset="84%" stopColor={tone} stopOpacity="0" />
          <stop offset="92%" stopColor={tone} stopOpacity=".18" />
          <stop offset="100%" stopColor={tone} stopOpacity="0" />
        </radialGradient>
        {/* the outer rim — a confident gold-ish line that holds the wax */}
        <linearGradient id={rimId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(245, 238, 216, .55)" />
          <stop offset="50%" stopColor="rgba(245, 238, 216, .18)" />
          <stop offset="100%" stopColor="rgba(245, 238, 216, .42)" />
        </linearGradient>
        <radialGradient id={innerId} cx="50%" cy="50%" r="56%">
          <stop offset="0%" stopColor="rgba(8, 10, 18, .22)" />
          <stop offset="60%" stopColor="rgba(8, 10, 18, .05)" />
          <stop offset="100%" stopColor="rgba(8, 10, 18, 0)" />
        </radialGradient>
        <radialGradient id={groundId} cx="50%" cy="58%" r="58%">
          <stop offset="0%" stopColor="currentColor" stopOpacity=".10" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* the ground wash — a faint radial lift behind the seal */}
      <circle cx="30" cy="30" r="26.5" fill={`url(#${groundId})`} />

      {/* the wax halo — a thin ink ring that soaks into the paper around the seal */}
      <circle cx="30" cy="30" r="29" fill={`url(#${waxInkId})`} />

      {/* the irregular wax puddle — four overlapping circles that read
          as a molten blob that spread slightly when pressed.
          the silhouette becomes a confident thumbprint shape. */}
      <path
        className="iteration-mark__puddle"
        d="M 30 4
           C 39 4, 47 9, 51.6 17
           C 55.6 22.4, 56 30, 55.4 36.4
           C 56 42.4, 53.4 49.4, 47.6 52.6
           C 41.4 56, 33.2 56.4, 26 54.4
           C 18.4 53.4, 11.4 49.4, 7.6 42.4
           C 4 36, 4 27.4, 7.4 21
           C 11 12.6, 19 6, 26.4 4.4
           Z"
        fill={`url(#${waxFillId})`}
      />

      {/* the lower-right shadow — pulled down by gravity */}
      <path
        className="iteration-mark__shadow"
        d="M 30 4
           C 39 4, 47 9, 51.6 17
           C 55.6 22.4, 56 30, 55.4 36.4
           C 56 42.4, 53.4 49.4, 47.6 52.6
           C 41.4 56, 33.2 56.4, 26 54.4
           C 18.4 53.4, 11.4 49.4, 7.6 42.4
           C 4 36, 4 27.4, 7.4 21
           C 11 12.6, 19 6, 26.4 4.4
           Z"
        fill={`url(#${waxDeepId})`}
        opacity=".95"
      />

      {/* the upper-left highlight — light catching the spread wax */}
      <path
        className="iteration-mark__hilite"
        d="M 30 4
           C 39 4, 47 9, 51.6 17
           C 55.6 22.4, 56 30, 55.4 36.4
           C 56 42.4, 53.4 49.4, 47.6 52.6
           C 41.4 56, 33.2 56.4, 26 54.4
           C 18.4 53.4, 11.4 49.4, 7.6 42.4
           C 4 36, 4 27.4, 7.4 21
           C 11 12.6, 19 6, 26.4 4.4
           Z"
        fill={`url(#${waxHilightId})`}
      />

      {/* the inner orb — a faint radial wash that deepens the centre */}
      <circle cx="30" cy="30" r="22" fill={`url(#${innerId})`} />

      {/* the confident rim — three concentric rounds, the outermost
          catching the wax edge, the next a faint inner ridge, the
          last the inner shadow of the seal */}
      <path
        className="iteration-mark__rim-outer"
        d="M 30 4
           C 39 4, 47 9, 51.6 17
           C 55.6 22.4, 56 30, 55.4 36.4
           C 56 42.4, 53.4 49.4, 47.6 52.6
           C 41.4 56, 33.2 56.4, 26 54.4
           C 18.4 53.4, 11.4 49.4, 7.6 42.4
           C 4 36, 4 27.4, 7.4 21
           C 11 12.6, 19 6, 26.4 4.4
           Z"
        fill="none"
        stroke={`url(#${rimId})`}
        strokeWidth=".7"
        opacity=".7"
      />
      <circle cx="30" cy="30" r="26.4" fill="none" stroke="currentColor" strokeWidth=".26" opacity=".34" />
      <circle cx="30" cy="30" r="24.8" fill="none" stroke="currentColor" strokeWidth=".18" strokeDasharray=".5 1.4" opacity=".26" />

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

      {/* a tiny wax crackle — three short arcs that hint at chilled wax */}
      <g className="iteration-mark__crackle" stroke="currentColor" fill="none" strokeLinecap="round" opacity=".18">
        <path d="M14.4 18.6 q1.6 -.6 3 -.2" strokeWidth=".2" />
        <path d="M44.4 44 q1.4 .8 2.6 .6" strokeWidth=".2" />
        <path d="M44 22 q1 -.4 1.8 -.2" strokeWidth=".18" />
      </g>

      {/* the meridian sweep — a single soft arc that ties left to right */}
      <path
        d="M8 32 Q30 12 52 32"
        fill="none"
        stroke={`url(#${fadeId})`}
        strokeWidth=".55"
        strokeLinecap="round"
        opacity=".5"
      />
      <path
        d="M9.5 32 Q30 49 50.5 32"
        fill="none"
        stroke={`url(#${fadeId})`}
        strokeWidth=".4"
        strokeLinecap="round"
        opacity=".28"
      />

      {/* the four cardinal pips — sitting on the rim */}
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

      {/* the numeral — set INSIDE the wax with a subtle inset shadow
          so the number reads as engraved rather than drawn. the
          Roman numeral sits beneath it as a quiet secondary detail. */}
      <g className="iteration-mark__numeral">
        <text
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
        <text
          className="iteration-mark__roman"
          x="30"
          y="40.4"
          textAnchor="middle"
          fontFamily="ui-monospace, 'SFMono-Regular', Menlo, monospace"
          fontSize="2.6"
          letterSpacing="1"
          fill="currentColor"
          opacity=".7"
        >
          {roman}
        </text>
      </g>

      {/* the small caption along the bottom arc */}
      <text
        className="iteration-mark__caption"
        x="30"
        y="48"
        textAnchor="middle"
        fontFamily="ui-monospace, 'SFMono-Regular', Menlo, 'Consolas', monospace"
        fontSize="3"
        letterSpacing="2"
        fill="currentColor"
        opacity=".82"
      >
        {captionText}
      </text>

      {/* the engraver's flourish — a tiny pen-stroke beneath the caption */}
      <g className="iteration-mark__flourish" stroke="currentColor" fill="none" strokeLinecap="round" opacity=".5">
        <path d="M22 51.6 Q30 49.7 38 51.6" strokeWidth=".26" />
        <circle cx="30" cy="50.6" r=".45" fill="currentColor" stroke="none" />
      </g>

      {/* a single, hot pip near the upper-left, catching the imagined light */}
      <circle cx="22" cy="14" r="1.5" fill="rgba(255, 248, 222, .55)" />
      <circle cx="22" cy="14" r=".7" fill="rgba(255, 252, 240, .95)" />
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
  numeral = '464',
  caption,
  meta,
}: IterationFolioCardProps) {
  const style = {
    '--mark-tone': `var(--${voice})`,
  } as CSSProperties
  const roman = romanOf(numeral)
  return (
    <aside
      className={`iteration-card iteration-card--${voice} iteration-card--${variant}`}
      style={style}
      role="group"
      aria-label={`Iteration ${numeral} of the press`}
    >
      <span className="iteration-card__rule iteration-card__rule--l" aria-hidden="true" />
      <span className="iteration-card__stack">
        <IterationMark voice={voice} size={variant === 'closing' ? 64 : 48} variant={variant} numeral={numeral} roman={roman} />
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

function romanOf(input: string): string {
  const n = parseInt(input, 10)
  if (!Number.isFinite(n) || n <= 0) return input
  const map: Array<[number, string]> = [
    [1000, 'm'], [900, 'cm'], [500, 'd'], [400, 'cd'],
    [100, 'c'], [90, 'xc'], [50, 'l'], [40, 'xl'],
    [10, 'x'], [9, 'ix'], [5, 'v'], [4, 'iv'], [1, 'i'],
  ]
  let value = n
  let out = ''
  for (const [v, sym] of map) {
    while (value >= v) {
      out += sym
      value -= v
    }
  }
  return out
}
