import { useEffect, useId, useState, type CSSProperties } from 'react'
import type { VoiceId } from './App'

type FirstLightPlateProps = {
  voice: VoiceId
  setToday: string
}

const DAY_NAME: Record<number, string> = {
  0: 'sunday',
  1: 'monday',
  2: 'tuesday',
  3: 'wednesday',
  4: 'thursday',
  5: 'friday',
  6: 'saturday',
}

function plateGreeting(hour: number) {
  if (hour < 5) return 'the small hours'
  if (hour < 8) return 'before first light'
  if (hour < 11) return 'at first light'
  if (hour < 14) return 'mid-morning'
  if (hour < 18) return 'mid-afternoon'
  if (hour < 21) return 'as the light softens'
  return 'in the late still'
}

function plateHour() {
  const now = new Date()
  let h = now.getHours()
  const m = now.getMinutes()
  const ampm = h >= 12 ? 'pm' : 'am'
  h = h % 12
  if (h === 0) h = 12
  return `${h}:${m.toString().padStart(2, '0')} ${ampm}`
}

function plateDateTokens(setToday: string) {
  const [month, day, year] = setToday.split(' ')
  const dayNum = parseInt(day, 10)
  return {
    month: month ?? '',
    day: dayNum.toString().padStart(2, '0'),
    year: year ?? '',
    dayOf: Number.isFinite(dayNum) ? dayNum : 0,
  }
}

export function FirstLightPlate({ voice, setToday }: FirstLightPlateProps) {
  const baseId = useId().replace(/:/g, '')
  const haloGrad = `first-light-plate-halo-${baseId}`
  const skyGrad = `first-light-plate-sky-${baseId}`
  const moonGrad = `first-light-plate-moon-${baseId}`
  const rimGrad = `first-light-plate-rim-${baseId}`
  const rayGrad = `first-light-plate-ray-${baseId}`

  const [hour, setHour] = useState(() => plateHour())
  const [dayName, setDayName] = useState<string>(() => {
    const d = new Date().getDay()
    return DAY_NAME[d] ?? ''
  })

  useEffect(() => {
    const id = window.setInterval(() => {
      setHour(plateHour())
      const d = new Date().getDay()
      setDayName(DAY_NAME[d] ?? '')
    }, 30_000)
    return () => window.clearInterval(id)
  }, [])

  const dateTokens = plateDateTokens(setToday)
  const currentHour = new Date().getHours()
  const greeting = plateGreeting(currentHour)
  const plateStyle = {
    '--plate-tone': `var(--${voice})`,
  } as CSSProperties

  const stars: Array<{ cx: number; cy: number; r: number; d: number }> = [
    { cx: 132, cy: 58, r: 0.9, d: 0.3 },
    { cx: 226, cy: 36, r: 0.7, d: 1.1 },
    { cx: 582, cy: 34, r: 0.8, d: 0.7 },
    { cx: 668, cy: 64, r: 0.6, d: 1.5 },
    { cx: 312, cy: 78, r: 0.55, d: 0.5 },
  ]

  return (
    <section
      className="first-light-plate"
      style={plateStyle}
      aria-label="The first light plate · how the page was set at first light"
    >
      <svg
        className="first-light-plate__defs"
        viewBox="0 0 800 220"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <radialGradient id={haloGrad} cx="50%" cy="44%" r="50%">
            <stop offset="0%" stopColor="rgba(255, 232, 198, .32)" />
            <stop offset="40%" stopColor="rgba(244, 188, 150, .14)" />
            <stop offset="78%" stopColor="rgba(168, 197, 255, .05)" />
            <stop offset="100%" stopColor="rgba(168, 197, 255, 0)" />
          </radialGradient>
          <linearGradient id={skyGrad} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(255, 226, 184, 0)" />
            <stop offset="60%" stopColor="rgba(255, 226, 184, .06)" />
            <stop offset="100%" stopColor="rgba(255, 226, 184, .14)" />
          </linearGradient>
          <radialGradient id={moonGrad} cx="40%" cy="38%" r="64%">
            <stop offset="0%" stopColor="rgba(255, 240, 214, .92)" />
            <stop offset="58%" stopColor="rgba(244, 218, 178, .78)" />
            <stop offset="100%" stopColor="rgba(196, 168, 130, .55)" />
          </radialGradient>
          <radialGradient id={rimGrad} cx="50%" cy="50%" r="50%">
            <stop offset="60%" stopColor="rgba(255, 226, 184, 0)" />
            <stop offset="82%" stopColor="rgba(255, 226, 184, .42)" />
            <stop offset="100%" stopColor="rgba(255, 226, 184, 0)" />
          </radialGradient>
          <radialGradient id={rayGrad} cx="50%" cy="100%" r="80%">
            <stop offset="0%" stopColor="rgba(255, 226, 184, .28)" />
            <stop offset="40%" stopColor="rgba(255, 226, 184, .08)" />
            <stop offset="100%" stopColor="rgba(255, 226, 184, 0)" />
          </radialGradient>
        </defs>
      </svg>

      <div className="first-light-plate__sky" aria-hidden="true">
        <svg viewBox="0 0 800 220" preserveAspectRatio="none">
          <rect x="0" y="0" width="800" height="220" fill={`url(#${skyGrad})`} />

          <g className="first-light-plate__stars" fill="rgba(255, 240, 214, .7)">
            {stars.map((s, i) => (
              <circle
                key={`star-${i}`}
                cx={s.cx}
                cy={s.cy}
                r={s.r}
                style={{ animationDelay: `${s.d}s` } as CSSProperties}
              />
            ))}
          </g>

          <ellipse cx="400" cy="200" rx="320" ry="62" fill={`url(#${rayGrad})`} className="first-light-plate__rays" />

          <circle className="first-light-plate__orb" cx="400" cy="120" r="92" fill={`url(#${haloGrad})`} />
          <circle className="first-light-plate__halo" cx="400" cy="120" r="70" fill={`url(#${rimGrad})`} />

          <g className="first-light-plate__moon">
            <circle cx="400" cy="120" r="52" fill={`url(#${moonGrad})`} />
            <circle cx="416" cy="114" r="48" fill="#080a12" />
            <circle cx="400" cy="120" r="52" fill="none" stroke="rgba(255, 240, 214, .35)" strokeWidth=".35" />
          </g>

          <line
            className="first-light-plate__horizon"
            x1="120"
            y1="182"
            x2="680"
            y2="182"
            stroke="rgba(255, 226, 184, .18)"
            strokeWidth=".4"
            strokeLinecap="round"
            strokeDasharray="1.5 4"
          />

          <g className="first-light-plate__ticks" fill="rgba(255, 226, 184, .4)">
            <circle cx="200" cy="182" r=".7" />
            <circle cx="600" cy="182" r=".7" />
          </g>
        </svg>
      </div>

      <header className="first-light-plate__head" aria-hidden="true">
        <span className="first-light-plate__brand">
          <span className="first-light-plate__brand-mark">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth=".7" />
              <circle cx="12" cy="12" r="6" fill="none" stroke="currentColor" strokeWidth=".4" strokeDasharray="1 2" opacity=".7" />
              <path d="M14 9 a4 4 0 1 1 -2 4" fill="none" stroke="currentColor" strokeWidth=".8" strokeLinecap="round" />
              <circle cx="12" cy="12" r="1.2" fill="currentColor" />
            </svg>
          </span>
          <span className="first-light-plate__brand-copy">
            <em>the press of first light</em>
            <strong>m³ press</strong>
          </span>
        </span>
        <span className="first-light-plate__folio-tag">
          <span className="first-light-plate__folio-tag-rule" />
          <em>folio zero</em>
          <span>·</span>
          <em>the open</em>
          <span className="first-light-plate__folio-tag-rule" />
        </span>
      </header>

      <div className="first-light-plate__body">
        <p className="first-light-plate__line" aria-label="A note from the compositor, set at first light">
          <span className="first-light-plate__opening-quote" aria-hidden="true">“</span>
          <em>i set the page </em>
          <em className="first-light-plate__line-em">{greeting}</em>
          <em>, for the reader who arrived in the dark</em>
          <span className="first-light-plate__closing-quote" aria-hidden="true">”</span>
        </p>

        <p className="first-light-plate__sub-line">
          <span>— a single line, set three ways, asked once · a question that earns its pause.</span>
        </p>

        <div className="first-light-plate__prompt" aria-hidden="true">
          <span className="first-light-plate__prompt-rule" />
          <em>set at first light · read in the dark</em>
          <span className="first-light-plate__prompt-rule" />
        </div>
      </div>

      <footer className="first-light-plate__foot" aria-hidden="true">
        <span className="first-light-plate__seal" aria-hidden="true">
          <svg viewBox="0 0 100 100">
            <defs>
              <radialGradient id={`fl-seal-glow-${baseId}`} cx="50%" cy="40%" r="60%">
                <stop offset="0%" stopColor="currentColor" stopOpacity="0.22" />
                <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
              </radialGradient>
            </defs>
            <circle cx="50" cy="50" r="48" fill={`url(#fl-seal-glow-${baseId})`} />
            <circle
              cx="50"
              cy="50"
              r="44"
              fill="rgba(8, 10, 18, .55)"
              stroke="currentColor"
              strokeWidth="1"
              strokeOpacity=".75"
            />
            <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth=".35" strokeDasharray="1 2.4" opacity=".55" />
            <circle cx="50" cy="50" r="32" fill="none" stroke="rgba(255, 255, 255, 0.32)" strokeWidth=".3" />
            <circle cx="50" cy="50" r="24" fill="none" stroke="rgba(255, 255, 255, 0.16)" strokeWidth=".25" />

            <circle cx="50" cy="46" r="9" fill="rgba(8, 10, 18, 0.92)" />
            <circle cx="50" cy="46" r="9" fill="none" stroke="rgba(245, 238, 216, .35)" strokeWidth=".35" strokeDasharray=".6 1.4" />
            <circle cx="54" cy="44" r="8" fill="rgba(8, 10, 18, 0.92)" />
            <line x1="32" y1="56" x2="68" y2="56" stroke="rgba(8, 10, 18, 0.92)" strokeWidth=".7" strokeLinecap="round" />
            <circle cx="40" cy="56" r="1.2" fill="rgba(8, 10, 18, 0.92)" />
            <circle cx="60" cy="56" r="1.2" fill="rgba(8, 10, 18, 0.92)" />
            <line x1="50" y1="32" x2="50" y2="38" stroke="rgba(8, 10, 18, 0.92)" strokeWidth=".45" strokeLinecap="round" />

            <text
              x="50"
              y="22"
              textAnchor="middle"
              fontFamily="ui-monospace, monospace"
              fontSize="5"
              letterSpacing="2"
              fill="rgba(245, 238, 216, .85)"
            >
              SET · OPEN
            </text>
            <text
              x="50"
              y="74"
              textAnchor="middle"
              fontFamily="ui-monospace, monospace"
              fontSize="3.6"
              letterSpacing="1.4"
              fill="rgba(245, 238, 216, .85)"
            >
              m³ · folio 0
            </text>
            <text
              x="50"
              y="84"
              textAnchor="middle"
              fontFamily="ui-monospace, monospace"
              fontSize="5"
              letterSpacing="2"
              fill="rgba(245, 238, 216, .85)"
            >
              FIRST · LIGHT
            </text>

            <circle cx="50" cy="6" r="1.4" fill="rgba(245, 238, 216, .8)" />
            <circle cx="50" cy="94" r="1.4" fill="rgba(245, 238, 216, .8)" />
            <circle cx="6" cy="50" r="1.4" fill="rgba(245, 238, 216, .8)" />
            <circle cx="94" cy="50" r="1.4" fill="rgba(245, 238, 216, .8)" />
          </svg>
        </span>

        <span className="first-light-plate__meta">
          <span className="first-light-plate__meta-row">
            <em className="first-light-plate__meta-key">day</em>
            <span className="first-light-plate__meta-val">
              <em>{dayName}</em>
              <span aria-hidden="true">·</span>
              <em className="first-light-plate__meta-day">{dateTokens.day}</em>
              <span aria-hidden="true">·</span>
              <em className="first-light-plate__meta-month">{dateTokens.month}</em>
              <span aria-hidden="true">·</span>
              <em className="first-light-plate__meta-year">{dateTokens.year}</em>
            </span>
          </span>
          <span className="first-light-plate__meta-row">
            <em className="first-light-plate__meta-key">at</em>
            <span className="first-light-plate__meta-val">
              <em className="first-light-plate__meta-hour">{hour}</em>
              <span aria-hidden="true">·</span>
              <em>voice {voice === 'quiet' ? 'a · quiet cut' : voice === 'human' ? 'b · human hand' : 'c · bold signal'}</em>
            </span>
          </span>
          <span className="first-light-plate__meta-row first-light-plate__meta-row--quiet">
            <em className="first-light-plate__meta-key">for</em>
            <em className="first-light-plate__meta-aside">the reader, who arrived in the dark</em>
          </span>
        </span>

        <span className="first-light-plate__key" aria-hidden="true">
          <span className="first-light-plate__key-line" />
          <span className="first-light-plate__key-line" />
          <span className="first-light-plate__key-line" />
        </span>
      </footer>

      <span className="first-light-plate__stitch" aria-hidden="true">
        <svg viewBox="0 0 200 6" preserveAspectRatio="none">
          <line x1="0" y1="3" x2="200" y2="3" stroke="currentColor" strokeWidth=".4" strokeDasharray="1 4" />
          <circle cx="20" cy="3" r="1" fill="currentColor" />
          <circle cx="100" cy="3" r="1.4" fill="currentColor" />
          <circle cx="180" cy="3" r="1" fill="currentColor" />
        </svg>
      </span>
    </section>
  )
}