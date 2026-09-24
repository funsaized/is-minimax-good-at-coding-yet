import { useId, type CSSProperties } from 'react'
import type { VoiceId } from './App'

/**
 * BroadsideFolio — a signature seal embedded in the broadside plate.
 *
 * Iteration 465 reads the broadside as one composed letterpress impression.
 * Where iteration 464 placed four corner pins and two corner notes, this
 * component folds the page's signature into a single, confident moment:
 * a small wax seal sits at the heart of the plate, naming the iteration
 * number, the press, and the day, set in the current voice.
 *
 * The seal reads as a thumbprint impressed onto the page — three concentric
 * rings (a wax rim, a quiet inner ridge, a dash-dot inner band), an
 * engraver's star at the centre, the iteration numeral, and a tiny
 * "m³ press" wordmark curving along the bottom. The seal gently tilts
 * toward the cursor on hover, and a hot pip lifts at its upper-left so the
 * wax feels wet, as if just pressed.
 */

type BroadsideFolioProps = {
  voice: VoiceId
  numeral?: string
  roman?: string
  setToday: string
  folioIndex?: string
  folioLabel?: string
}

const VOICE_LETTER: Record<VoiceId, string> = { quiet: 'A', human: 'B', bold: 'C' }
const VOICE_NAME: Record<VoiceId, string> = {
  quiet: 'quiet cut',
  human: 'human hand',
  bold: 'bold signal',
}

export function BroadsideFolio({
  voice,
  numeral = '465',
  roman = 'cdlxv',
  setToday,
  folioIndex = 'i',
  folioLabel = 'the question',
}: BroadsideFolioProps) {
  const baseId = useId().replace(/:/g, '')
  const waxFillId = `bf-wax-fill-${baseId}`
  const waxDeepId = `bf-wax-deep-${baseId}`
  const waxHiId = `bf-wax-hi-${baseId}`
  const rimId = `bf-rim-${baseId}`
  const fadeId = `bf-fade-${baseId}`

  const tone = `var(--${voice})`

  const style = {
    '--bf-tone': tone,
  } as CSSProperties

  return (
    <aside
      className={`broadside-folio broadside-folio--${voice}`}
      style={style}
      aria-label={`Broadside folio ${roman} · ${folioLabel} · composed ${setToday} · set in ${VOICE_NAME[voice]} (voice ${VOICE_LETTER[voice]}).`}
    >
      <span className="broadside-folio__rule broadside-folio__rule--l" aria-hidden="true">
        <svg viewBox="0 0 220 6" preserveAspectRatio="none">
          <line x1="0" y1="3" x2="220" y2="3" stroke="currentColor" strokeWidth=".55" strokeLinecap="round" />
          <line x1="0" y1="3" x2="220" y2="3" stroke="currentColor" strokeWidth=".32" strokeDasharray=".5 2.4" opacity=".42" />
          <circle cx="2" cy="3" r="1.1" fill="currentColor" />
          <circle cx="218" cy="3" r="1.1" fill="currentColor" />
        </svg>
      </span>

      <span className="broadside-folio__stack" aria-hidden="true">
        <span className="broadside-folio__lead">
          <em className="broadside-folio__press">m³ press</em>
          <span className="broadside-folio__sep">·</span>
          <span className="broadside-folio__folio">
            <span className="broadside-folio__folio-key">folio</span>
            <span className="broadside-folio__folio-num">{folioIndex}</span>
          </span>
        </span>

        <svg
          className="broadside-folio__seal"
          viewBox="0 0 80 80"
          role="img"
          aria-label={`Iteration ${numeral}, folio ${roman}, the press's seal on this broadside`}
        >
          <defs>
            <radialGradient id={waxFillId} cx="38%" cy="32%" r="74%">
              <stop offset="0%" stopColor={tone} stopOpacity=".92" />
              <stop offset="48%" stopColor={tone} stopOpacity=".66" />
              <stop offset="88%" stopColor={tone} stopOpacity=".36" />
              <stop offset="100%" stopColor={tone} stopOpacity=".14" />
            </radialGradient>
            <radialGradient id={waxDeepId} cx="76%" cy="84%" r="62%">
              <stop offset="0%" stopColor="rgba(0,0,0,0)" />
              <stop offset="62%" stopColor="rgba(0,0,0,0)" />
              <stop offset="84%" stopColor="rgba(0,0,0,.32)" />
              <stop offset="100%" stopColor="rgba(0,0,0,.5)" />
            </radialGradient>
            <radialGradient id={waxHiId} cx="32%" cy="26%" r="22%">
              <stop offset="0%" stopColor="rgba(255, 255, 255, .55)" />
              <stop offset="60%" stopColor="rgba(255, 255, 255, .12)" />
              <stop offset="100%" stopColor="rgba(255, 255, 255, 0)" />
            </radialGradient>
            <linearGradient id={rimId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(245, 238, 216, .55)" />
              <stop offset="50%" stopColor="rgba(245, 238, 216, .18)" />
              <stop offset="100%" stopColor="rgba(245, 238, 216, .42)" />
            </linearGradient>
            <linearGradient id={fadeId} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
              <stop offset="50%" stopColor="currentColor" stopOpacity="1" />
              <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
            </linearGradient>
          </defs>

          <path
            className="broadside-folio__puddle"
            d="M 40 6
               C 50 6, 59 11, 64 19
               C 68 24.4, 69 32, 68.4 38.4
               C 69 44.4, 66.4 51.4, 60.4 54.6
               C 54 58, 45.6 58.4, 38 56.4
               C 30 55.4, 22.6 51.4, 18.4 44.4
               C 14.4 38, 14.4 29.4, 18 23
               C 21.8 14.6, 30 8, 38 6.4
               Z"
            fill={`url(#${waxFillId})`}
          />
          <path
            className="broadside-folio__shadow"
            d="M 40 6
               C 50 6, 59 11, 64 19
               C 68 24.4, 69 32, 68.4 38.4
               C 69 44.4, 66.4 51.4, 60.4 54.6
               C 54 58, 45.6 58.4, 38 56.4
               C 30 55.4, 22.6 51.4, 18.4 44.4
               C 14.4 38, 14.4 29.4, 18 23
               C 21.8 14.6, 30 8, 38 6.4
               Z"
            fill={`url(#${waxDeepId})`}
          />
          <path
            className="broadside-folio__hilite"
            d="M 40 6
               C 50 6, 59 11, 64 19
               C 68 24.4, 69 32, 68.4 38.4
               C 69 44.4, 66.4 51.4, 60.4 54.6
               C 54 58, 45.6 58.4, 38 56.4
               C 30 55.4, 22.6 51.4, 18.4 44.4
               C 14.4 38, 14.4 29.4, 18 23
               C 21.8 14.6, 30 8, 38 6.4
               Z"
            fill={`url(#${waxHiId})`}
          />

          <path
            className="broadside-folio__rim"
            d="M 40 6
               C 50 6, 59 11, 64 19
               C 68 24.4, 69 32, 68.4 38.4
               C 69 44.4, 66.4 51.4, 60.4 54.6
               C 54 58, 45.6 58.4, 38 56.4
               C 30 55.4, 22.6 51.4, 18.4 44.4
               C 14.4 38, 14.4 29.4, 18 23
               C 21.8 14.6, 30 8, 38 6.4
               Z"
            fill="none"
            stroke={`url(#${rimId})`}
            strokeWidth=".6"
            opacity=".7"
          />
          <circle cx="40" cy="40" r="35" fill="none" stroke="currentColor" strokeWidth=".26" opacity=".34" />
          <circle cx="40" cy="40" r="32.6" fill="none" stroke="currentColor" strokeWidth=".18" strokeDasharray=".5 1.4" opacity=".28" />

          <g className="broadside-folio__ticks" stroke="currentColor" strokeLinecap="round" opacity=".5">
            <line x1="40" y1="2.4" x2="40" y2="5" strokeWidth=".55" />
            <line x1="40" y1="75" x2="40" y2="77.6" strokeWidth=".55" />
            <line x1="2.4" y1="40" x2="5" y2="40" strokeWidth=".55" />
            <line x1="75" y1="40" x2="77.6" y2="40" strokeWidth=".55" />
          </g>

          <path
            d="M12 44 Q40 18 68 44"
            fill="none"
            stroke={`url(#${fadeId})`}
            strokeWidth=".5"
            strokeLinecap="round"
            opacity=".45"
          />
          <path
            d="M14 44 Q40 64 66 44"
            fill="none"
            stroke={`url(#${fadeId})`}
            strokeWidth=".4"
            strokeLinecap="round"
            opacity=".28"
          />

          <circle cx="40" cy="10" r="1" fill="currentColor" opacity=".7" />
          <circle cx="40" cy="70" r="1" fill="currentColor" opacity=".7" />
          <circle cx="10" cy="40" r="1" fill="currentColor" opacity=".7" />
          <circle cx="70" cy="40" r="1" fill="currentColor" opacity=".7" />

          <circle cx="40" cy="40" r="14" fill="none" stroke="currentColor" strokeWidth=".32" strokeDasharray=".6 1.4" opacity=".55" />
          <circle cx="40" cy="40" r="9" fill="none" stroke="currentColor" strokeWidth=".22" strokeDasharray=".4 1.2" opacity=".42" />

          <line x1="34" y1="30" x2="46" y2="30" stroke="currentColor" strokeWidth=".26" strokeLinecap="round" opacity=".55" />
          <circle cx="40" cy="30" r=".5" fill="currentColor" opacity=".7" />

          <text
            x="40"
            y="46"
            textAnchor="middle"
            fontFamily="'Iowan Old Style', 'Palatino Linotype', 'Book Antiqua', Georgia, serif"
            fontStyle="italic"
            fontWeight="500"
            fontSize="20"
            fill="currentColor"
          >
            {numeral}
          </text>
          <text
            x="40"
            y="54"
            textAnchor="middle"
            fontFamily="ui-monospace, 'SFMono-Regular', Menlo, monospace"
            fontSize="3.2"
            letterSpacing="1.2"
            fill="currentColor"
            opacity=".75"
          >
            {roman}
          </text>

          <text
            x="40"
            y="64"
            textAnchor="middle"
            fontFamily="ui-monospace, 'SFMono-Regular', Menlo, 'Consolas', monospace"
            fontSize="3"
            letterSpacing="2"
            fill="currentColor"
            opacity=".82"
          >
            M³ · PRESS
          </text>

          <g stroke="currentColor" fill="none" strokeLinecap="round" opacity=".5">
            <path d="M30 68 Q40 66.4 50 68" strokeWidth=".26" />
            <circle cx="40" cy="67" r=".4" fill="currentColor" stroke="none" />
          </g>

          <circle cx="32" cy="20" r="1.5" fill="rgba(255, 248, 222, .55)" />
          <circle cx="32" cy="20" r=".7" fill="rgba(255, 252, 240, .95)" />
        </svg>

        <span className="broadside-folio__trail">
          <span className="broadside-folio__trail-key">composed</span>
          <span className="broadside-folio__trail-sep" aria-hidden="true">·</span>
          <em className="broadside-folio__trail-date">{setToday}</em>
          <span className="broadside-folio__trail-sep" aria-hidden="true">·</span>
          <span className="broadside-folio__trail-voice">
            voice <em>{VOICE_LETTER[voice]}</em> · {VOICE_NAME[voice]}
          </span>
        </span>
      </span>

      <span className="broadside-folio__rule broadside-folio__rule--r" aria-hidden="true">
        <svg viewBox="0 0 220 6" preserveAspectRatio="none">
          <line x1="0" y1="3" x2="220" y2="3" stroke="currentColor" strokeWidth=".55" strokeLinecap="round" />
          <line x1="0" y1="3" x2="220" y2="3" stroke="currentColor" strokeWidth=".32" strokeDasharray=".5 2.4" opacity=".42" />
          <circle cx="2" cy="3" r="1.1" fill="currentColor" />
          <circle cx="218" cy="3" r="1.1" fill="currentColor" />
        </svg>
      </span>
    </aside>
  )
}
