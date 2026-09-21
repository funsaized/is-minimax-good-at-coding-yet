import { useEffect, useId, useRef, useState, type CSSProperties } from 'react'
import type { VoiceId } from './Press'

type DayMarginProps = {
  voice: VoiceId
  setToday: string
}

const VOICE_TONE: Record<VoiceId, string> = {
  quiet: 'var(--blue)',
  human: 'var(--coral)',
  bold: 'var(--acid)',
}
const VOICE_NAME: Record<VoiceId, string> = {
  quiet: 'quiet cut',
  human: 'human hand',
  bold: 'bold signal',
}

const HOURS_LONG = ['twelve', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven']
const MONTHS_LONG = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december']
const MONTHS_SHORT = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec']
const WEEKDAYS_SHORT = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']
const ORDINALS = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth', 'tenth', 'eleventh', 'twelfth', 'thirteenth', 'fourteenth', 'fifteenth', 'sixteenth', 'seventeenth', 'eighteenth', 'nineteenth', 'twentieth', 'twenty-first', 'twenty-second', 'twenty-third', 'twenty-fourth', 'twenty-fifth', 'twenty-sixth', 'twenty-seventh', 'twenty-eighth', 'twenty-ninth', 'thirtieth', 'thirty-first']

function seasonOf(month: number) {
  if (month <= 1 || month === 11) return 'winter'
  if (month <= 4) return 'spring'
  if (month <= 7) return 'summer'
  return 'autumn'
}

function timeOfDay(hour: number) {
  if (hour < 5) return 'late night'
  if (hour < 8) return 'early morning'
  if (hour < 12) return 'morning'
  if (hour < 14) return 'midday'
  if (hour < 18) return 'afternoon'
  if (hour < 21) return 'evening'
  return 'night'
}

function spokenHour(hour: number) {
  const h = hour % 12 || 12
  return HOURS_LONG[h - 1]
}

function padTwo(value: number) {
  return String(value).padStart(2, '0')
}

function DielSketch({ hour }: { hour: number }) {
  const angle = ((hour % 24) / 24) * 360 - 90
  const isDay = hour >= 6 && hour < 18
  const cx = 32 + Math.cos((angle * Math.PI) / 180) * 16
  const cy = 32 + Math.sin((angle * Math.PI) / 180) * 16

  return (
    <svg className="day-margin__diel-svg" viewBox="0 0 64 64" aria-hidden="true">
      <defs>
        <linearGradient id="day-margin-diel-arc" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="currentColor" stopOpacity=".0" />
          <stop offset="50%" stopColor="currentColor" stopOpacity=".65" />
          <stop offset="100%" stopColor="currentColor" stopOpacity=".0" />
        </linearGradient>
      </defs>
      <g className="day-margin__diel-frame">
        <circle cx="32" cy="32" r="26" fill="none" stroke="currentColor" strokeWidth=".55" opacity=".4" />
        <circle cx="32" cy="32" r="22" fill="none" stroke="currentColor" strokeWidth=".3" strokeDasharray=".6 1.4" opacity=".35" />
      </g>
      <g className="day-margin__diel-arc">
        <path
          d="M 8 32 A 24 24 0 0 1 56 32"
          fill="none"
          stroke="url(#day-margin-diel-arc)"
          strokeWidth=".7"
          strokeLinecap="round"
        />
        <line x1="32" y1="32" x2={cx} y2={cy} stroke="currentColor" strokeWidth=".8" strokeLinecap="round" opacity=".75" />
        <circle cx={cx} cy={cy} r="1.5" fill="currentColor" />
        <circle cx={cx} cy={cy} r="3.2" fill="none" stroke="currentColor" strokeWidth=".3" strokeDasharray=".4 1" opacity=".5" />
      </g>
      <g className="day-margin__diel-body" transform={`translate(${isDay ? 56 : 8} 32)`}>
        {isDay ? (
          <>
            <circle r="2.6" fill="currentColor" opacity=".95" />
            <g stroke="currentColor" strokeWidth=".5" strokeLinecap="round" opacity=".55">
              <line x1="0" y1="-5" x2="0" y2="-7" />
              <line x1="0" y1="5" x2="0" y2="7" />
              <line x1="-5" y1="0" x2="-7" y2="0" />
              <line x1="5" y1="0" x2="7" y2="0" />
              <line x1="-3.5" y1="-3.5" x2="-5" y2="-5" />
              <line x1="3.5" y1="3.5" x2="5" y2="5" />
              <line x1="-3.5" y1="3.5" x2="-5" y2="5" />
              <line x1="3.5" y1="-3.5" x2="5" y2="-5" />
            </g>
          </>
        ) : (
          <path
            d="M 1.5 -3 a 4 4 0 1 0 2 5 a 3 3 0 0 1 -2 -5z"
            fill="currentColor"
            opacity=".85"
          />
        )}
      </g>
      <text
        x="32"
        y="61"
        textAnchor="middle"
        fontFamily="ui-monospace, monospace"
        fontSize="3.2"
        letterSpacing="1.2"
        fill="currentColor"
        opacity=".55"
      >
        {isDay ? 'SUN · ARC' : 'MOON · ARC'}
      </text>
    </svg>
  )
}

export function DayMargin({ voice, setToday }: DayMarginProps) {
  const baseId = useId().replace(/:/g, '')
  const grainId = `day-margin-grain-${baseId}`
  const rootRef = useRef<HTMLElement>(null)
  const [now, setNow] = useState(() => new Date())
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    const reduceMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) {
      setRevealed(true)
      return
    }
    const node = rootRef.current
    if (!node || !('IntersectionObserver' in window)) {
      setRevealed(true)
      return
    }
    const observer = new IntersectionObserver(
      entries => {
        if (entries.some(entry => entry.isIntersecting)) {
          setRevealed(true)
          observer.disconnect()
        }
      },
      { threshold: 0.04, rootMargin: '0px 0px -3% 0px' },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) return
    const timer = window.setInterval(() => setNow(new Date()), 30000)
    return () => window.clearInterval(timer)
  }, [])

  const hour = now.getHours()
  const minute = now.getMinutes()
  const month = now.getMonth()
  const day = now.getDate()
  const weekday = now.getDay()
  const season = seasonOf(month)
  const moment = timeOfDay(hour)
  const spoken = spokenHour(hour)
  const monthShort = MONTHS_SHORT[month]
  const weekdayShort = WEEKDAYS_SHORT[weekday]
  const ordinal = ORDINALS[day - 1] ?? String(day)
  const timeCompact = `${padTwo(hour)}:${padTwo(minute)}`
  const timeSpoken = `${minute === 0 ? spoken : `${spoken} · ${padTwo(minute)} minutes past`}`
  const tone = VOICE_TONE[voice]
  const style = {
    '--day-margin-tone': tone,
    '--day-margin-grain': `url(#${grainId})`,
  } as CSSProperties

  return (
    <aside
      ref={rootRef}
      className={`day-margin day-margin--${voice} ${revealed ? 'is-revealed' : ''}`}
      style={style}
      aria-label={`Day margin · ${WEEKDAYS_SHORT[weekday]}day, the ${ordinal} of ${MONTHS_LONG[month]} · set today ${setToday} · ${season} · ${moment}, ${timeSpoken} · reading in ${VOICE_NAME[voice]}`}
    >
      <svg className="day-margin__defs" viewBox="0 0 800 32" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <filter id={grainId} x="-2%" y="-50%" width="104%" height="200%">
            <feTurbulence type="fractalNoise" baseFrequency="2.6" numOctaves="2" seed="83" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .42 0" />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
        </defs>
      </svg>

      <span className="day-margin__rule day-margin__rule--lead" aria-hidden="true">
        <svg viewBox="0 0 240 6" preserveAspectRatio="none">
          <g filter={`url(#${grainId})`}>
            <path
              className="day-margin__rule-stroke"
              d="M2 3c20-2 40 2 60 0s40-2 60 0 40 2 60 0 40-2 56-1"
              fill="none"
              stroke="currentColor"
              strokeWidth=".5"
              strokeLinecap="round"
              pathLength="100"
            />
          </g>
          <circle cx="2" cy="3" r=".85" fill="currentColor" />
          <circle cx="238" cy="3" r=".85" fill="currentColor" />
        </svg>
      </span>

      <span className="day-margin__head" aria-hidden="true">
        <span className="day-margin__head-glyph">§</span>
        <span className="day-margin__head-key">the day margin</span>
        <span className="day-margin__head-sep">·</span>
        <span className="day-margin__head-folio">folio i</span>
        <span className="day-margin__head-glyph day-margin__head-glyph--alt">§</span>
      </span>

      <div className="day-margin__grid">
        <span className="day-margin__cell day-margin__cell--date" aria-hidden="false">
          <span className="day-margin__cell-key">today</span>
          <span className="day-margin__cell-rule" />
          <span className="day-margin__cell-value day-margin__date">
            <em className="day-margin__date-weekday">{weekdayShort}.</em>
            <em className="day-margin__date-ordinal">{ordinal}</em>
            <span className="day-margin__date-month">{monthShort}</span>
          </span>
          <span className="day-margin__cell-meta">
            <span className="day-margin__cell-meta-dot" aria-hidden="true" />
            <span>the {ordinal} of {MONTHS_LONG[month]}</span>
          </span>
        </span>

        <span className="day-margin__cell day-margin__cell--time" aria-hidden="false">
          <span className="day-margin__cell-key">the hour</span>
          <span className="day-margin__cell-rule" />
          <span className="day-margin__cell-value day-margin__time">
            <span className="day-margin__time-figure">{timeCompact}</span>
            <span className="day-margin__time-mark" aria-hidden="true">
              <DielSketch hour={hour} />
            </span>
            <em className="day-margin__time-moment">{moment}</em>
          </span>
          <span className="day-margin__cell-meta">
            <span className="day-margin__cell-meta-dot" aria-hidden="true" />
            <span>{timeSpoken}</span>
          </span>
        </span>

        <span className="day-margin__cell day-margin__cell--season" aria-hidden="false">
          <span className="day-margin__cell-key">the season</span>
          <span className="day-margin__cell-rule" />
          <span className="day-margin__cell-value day-margin__season">
            <span className="day-margin__season-glyph" aria-hidden="true">❦</span>
            <em className="day-margin__season-name">{season}</em>
          </span>
          <span className="day-margin__cell-meta">
            <span className="day-margin__cell-meta-dot" aria-hidden="true" />
            <span>the year reads {now.getFullYear()}</span>
          </span>
        </span>

        <span className="day-margin__cell day-margin__cell--voice" aria-hidden="false">
          <span className="day-margin__cell-key">reading in</span>
          <span className="day-margin__cell-rule" />
          <span className="day-margin__cell-value day-margin__voice">
            <span className="day-margin__voice-letter" aria-hidden="true">{voice.charAt(0).toUpperCase()}</span>
            <em className="day-margin__voice-name">{VOICE_NAME[voice]}</em>
          </span>
          <span className="day-margin__cell-meta">
            <span className="day-margin__cell-meta-dot" aria-hidden="true" />
            <span>the lever is bound to this voice</span>
          </span>
        </span>
      </div>

      <span className="day-margin__sign" aria-hidden="true">
        <svg viewBox="0 0 320 14" preserveAspectRatio="none">
          <g filter={`url(#${grainId})`}>
            <path
              className="day-margin__sign-stroke"
              d="M2 8c14-6 28 4 42-1s28-7 42-1 28 4 42-2 28-7 42-1 28 4 42-2 28-7 42-1 14 4 14 4"
              fill="none"
              stroke="currentColor"
              strokeWidth=".7"
              strokeLinecap="round"
              pathLength="100"
            />
          </g>
          <circle className="day-margin__sign-bead" cx="318" cy="6" r="1.1" fill="currentColor" />
        </svg>
        <span className="day-margin__sign-tag">
          <span className="day-margin__sign-tag-mark" aria-hidden="true" />
          <em>the margin marks the day, the day marks the page</em>
        </span>
      </span>

      <span className="day-margin__rule day-margin__rule--trail" aria-hidden="true">
        <svg viewBox="0 0 240 6" preserveAspectRatio="none">
          <g filter={`url(#${grainId})`}>
            <path
              className="day-margin__rule-stroke day-margin__rule-stroke--alt"
              d="M2 3c20-2 40 2 60 0s40-2 60 0 40 2 60 0 40-2 56-1"
              fill="none"
              stroke="currentColor"
              strokeWidth=".35"
              strokeLinecap="round"
              opacity=".6"
              pathLength="100"
            />
          </g>
          <circle cx="2" cy="3" r=".7" fill="currentColor" opacity=".6" />
          <circle cx="238" cy="3" r=".7" fill="currentColor" opacity=".6" />
        </svg>
      </span>

      <span className="sr-only" aria-live="polite">
        {`Day margin. ${WEEKDAYS_SHORT[weekday]}day, the ${ordinal} of ${MONTHS_LONG[month]}. ${season}, ${moment}, ${timeCompact}. Set today ${setToday}. Reading in ${VOICE_NAME[voice]}.`}
      </span>
    </aside>
  )
}
