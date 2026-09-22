import { useId, useRef, useState, type CSSProperties } from 'react'
import type { VoiceId } from './App'
import type { WordId } from './notes'

type PressProofStampProps = {
  voice: VoiceId
  word: WordId
  setToday: string
  pullSignal: number
}

const VOICE_LETTER: Record<VoiceId, string> = { quiet: 'A', human: 'B', bold: 'C' }
const VOICE_NAME: Record<VoiceId, string> = {
  quiet: 'quiet cut',
  human: 'human hand',
  bold: 'bold signal',
}
const MARK: Record<WordId, { glyph: string; label: string }> = {
  m3: { glyph: '⌇', label: 'stet' },
  good: { glyph: '∧', label: 'caret' },
  yet: { glyph: '?', label: 'query' },
}

const FOLIO = 'folio · i'

function shortDate(setToday: string) {
  const parts = setToday.split(' ')
  if (parts.length < 3) return setToday
  const [month, day, year] = parts
  return `${month.slice(0, 3)} ${day.replace(/,/, '')} ${year.slice(-2)}`
}

export function PressProofStamp({ voice, word, setToday, pullSignal }: PressProofStampProps) {
  const baseId = useId().replace(/:/g, '')
  const stampRef = useRef<HTMLDivElement | null>(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const id = `proof-stamp-${baseId}`
  const letter = VOICE_LETTER[voice]
  const mark = MARK[word]
  const tone = `var(--${voice})`

  const style = {
    '--pps-tone': tone,
    '--pps-tilt-x': `${tilt.x}deg`,
    '--pps-tilt-y': `${tilt.y}deg`,
  } as CSSProperties

  const onMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const node = stampRef.current
    if (!node) return
    const rect = node.getBoundingClientRect()
    const x = (event.clientX - rect.left) / rect.width - 0.5
    const y = (event.clientY - rect.top) / rect.height - 0.5
    setTilt({ x: x * 8, y: y * -8 })
  }
  const onLeave = () => setTilt({ x: 0, y: 0 })

  return (
    <div
      ref={stampRef}
      className={`press-proof-stamp press-proof-stamp--${voice}`}
      style={style}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      aria-label={`Press proof stamp · set in ${VOICE_NAME[voice]} · marked at ${mark.label} · ${setToday}`}
      key={`stamp-${id}-${pullSignal}`}
    >
      <span className="press-proof-stamp__shadow" aria-hidden="true" />
      <span className="press-proof-stamp__halo" aria-hidden="true" />
      <div className="press-proof-stamp__tilt">
        <svg
          className="press-proof-stamp__seal"
          viewBox="0 0 240 240"
          aria-hidden="true"
          role="img"
        >
        <defs>
          <radialGradient id={`${id}-fill`} cx="42%" cy="36%" r="68%">
            <stop offset="0%" stopColor="rgba(245, 238, 216, .18)" />
            <stop offset="38%" stopColor="rgba(245, 238, 216, .06)" />
            <stop offset="100%" stopColor="rgba(8, 10, 18, 0)" />
          </radialGradient>
          <radialGradient id={`${id}-ink`} cx="50%" cy="50%" r="52%">
            <stop offset="0%" stopColor="currentColor" stopOpacity=".04" />
            <stop offset="60%" stopColor="currentColor" stopOpacity=".12" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </radialGradient>
          <radialGradient id={`${id}-bevel`} cx="50%" cy="32%" r="60%">
            <stop offset="0%" stopColor="rgba(245, 238, 216, .22)" />
            <stop offset="60%" stopColor="rgba(245, 238, 216, 0)" />
            <stop offset="100%" stopColor="rgba(8, 10, 18, .55)" />
          </radialGradient>
          <filter id={`${id}-grain`} x="-2%" y="-2%" width="104%" height="104%">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 .55 0" />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
        </defs>

        {/* the wax body */}
        <circle cx="120" cy="120" r="118" fill={`url(#${id}-fill)`} />
        <circle cx="120" cy="120" r="110" fill={`url(#${id}-ink)`} />

        {/* outer rim — double */}
        <circle
          cx="120"
          cy="120"
          r="104"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeOpacity=".88"
        />
        <circle
          cx="120"
          cy="120"
          r="100"
          fill="none"
          stroke="currentColor"
          strokeWidth=".6"
          strokeOpacity=".55"
        />

        {/* engraved rim dashes — twelve tick marks at the cardinal hours */}
        <g stroke="currentColor" strokeLinecap="round" strokeOpacity=".7">
          {Array.from({ length: 24 }).map((_, i) => {
            const a = (i / 24) * Math.PI * 2 - Math.PI / 2
            const isMajor = i % 6 === 0
            const r1 = 100
            const r2 = isMajor ? 92 : 96
            const x1 = 120 + Math.cos(a) * r1
            const y1 = 120 + Math.sin(a) * r1
            const x2 = 120 + Math.cos(a) * r2
            const y2 = 120 + Math.sin(a) * r2
            return (
              <line
                key={`tick-${i}`}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                strokeWidth={isMajor ? '1.1' : '.55'}
                opacity={isMajor ? '.9' : '.55'}
              />
            )
          })}
        </g>

        {/* small cardinal beads */}
        <g fill="currentColor" opacity=".78">
          <circle cx="120" cy="14" r="2.2" />
          <circle cx="120" cy="226" r="2.2" />
          <circle cx="14" cy="120" r="2.2" />
          <circle cx="226" cy="120" r="2.2" />
        </g>

        {/* rim text — top arc, set on a gentle curve */}
        <path
          id={`${id}-arc-top`}
          d="M 36 120 A 84 84 0 0 1 204 120"
          fill="none"
        />
        <path
          id={`${id}-arc-bot`}
          d="M 36 124 A 84 84 0 0 0 204 124"
          fill="none"
        />

        <text
          fill="currentColor"
          fontFamily="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"
          fontSize="9.5"
          letterSpacing="3.6"
          opacity=".95"
        >
          <textPath href={`#${id}-arc-top`} xlinkHref={`#${id}-arc-top`} startOffset="50%" textAnchor="middle">
            {`PROOF  ·  SET  ·  m³`}
          </textPath>
        </text>

        <text
          fill="currentColor"
          fontFamily="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"
          fontSize="8.4"
          letterSpacing="3"
          opacity=".85"
        >
          <textPath href={`#${id}-arc-bot`} xlinkHref={`#${id}-arc-bot`} startOffset="50%" textAnchor="middle">
            {`${FOLIO.toUpperCase()}  ·  ${shortDate(setToday).toUpperCase()}`}
          </textPath>
        </text>

        {/* inner field — soft */}
        <circle
          cx="120"
          cy="120"
          r="68"
          fill="rgba(8, 10, 18, .35)"
          stroke="currentColor"
          strokeWidth=".55"
          strokeOpacity=".55"
        />
        <circle
          cx="120"
          cy="120"
          r="64"
          fill="none"
          stroke="currentColor"
          strokeWidth=".35"
          strokeDasharray="1 2.2"
          opacity=".55"
        />
        <circle
          cx="120"
          cy="120"
          r="44"
          fill="none"
          stroke="rgba(245, 238, 216, .25)"
          strokeWidth=".3"
        />

        {/* a small dawn above the letter */}
        <g opacity=".75">
          <circle cx="120" cy="80" r="2.4" fill="currentColor" />
          <circle cx="120" cy="80" r="5.5" fill="none" stroke="currentColor" strokeWidth=".4" strokeDasharray=".6 1.4" />
          <line x1="100" y1="80" x2="108" y2="80" stroke="currentColor" strokeWidth=".4" strokeLinecap="round" />
          <line x1="132" y1="80" x2="140" y2="80" stroke="currentColor" strokeWidth=".4" strokeLinecap="round" />
        </g>

        {/* the big italic voice letter */}
        <text
          x="120"
          y="142"
          textAnchor="middle"
          fontFamily="'Iowan Old Style', 'Palatino Linotype', Georgia, serif"
          fontStyle="italic"
          fontWeight="500"
          fontSize="64"
          fill="currentColor"
        >
          {letter}
        </text>

        {/* the mark glyph under the letter */}
        <g>
          <text
            x="120"
            y="172"
            textAnchor="middle"
            fontFamily="'Iowan Old Style', 'Palatino Linotype', Georgia, serif"
            fontSize="22"
            fill="currentColor"
            opacity=".92"
          >
            {mark.glyph}
          </text>
        </g>

        {/* a slim cord under the glyph — the press bed */}
        <line
          x1="92"
          y1="184"
          x2="148"
          y2="184"
          stroke="currentColor"
          strokeWidth=".55"
          strokeLinecap="round"
          opacity=".7"
        />
        <circle cx="100" cy="184" r="1.2" fill="currentColor" opacity=".75" />
        <circle cx="140" cy="184" r="1.2" fill="currentColor" opacity=".75" />

        {/* engraving grain */}
        <circle
          cx="120"
          cy="120"
          r="100"
          fill="rgba(245, 238, 216, .05)"
          filter={`url(#${id}-grain)`}
        />

        {/* a soft top bevel for the 3D feel */}
        <circle cx="120" cy="120" r="118" fill={`url(#${id}-bevel)`} opacity=".85" />

        {/* a few engraved commas along the rim — the press's chatter */}
        <g fill="currentColor" opacity=".7">
          <circle cx="62" cy="36" r=".9" />
          <circle cx="178" cy="36" r=".9" />
          <circle cx="62" cy="204" r=".9" />
          <circle cx="178" cy="204" r=".9" />
        </g>
      </svg>
      </div>

      <span className="press-proof-stamp__caption" aria-hidden="true">
        <span className="press-proof-stamp__caption-rule" />
        <em>set &amp; registered · at first light</em>
        <span className="press-proof-stamp__caption-rule" />
      </span>

      <span className="press-proof-stamp__meta" aria-hidden="true">
        <span className="press-proof-stamp__meta-key">in</span>
        <em>{VOICE_NAME[voice]}</em>
        <span className="press-proof-stamp__meta-dot">·</span>
        <span className="press-proof-stamp__meta-key">at</span>
        <em>{mark.label}</em>
      </span>
    </div>
  )
}