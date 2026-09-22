import { useId, type CSSProperties } from 'react'
import type { VoiceId } from './App'

type LastLightProps = {
  voice: VoiceId
  setToday: string
  pullCount: number
}

const MARKS: Array<{
  id: 'm3' | 'good' | 'yet'
  glyph: string
  label: string
  sub: string
  tone: string
  ink: string
}> = [
  { id: 'm3', glyph: '⌇', label: 'stet', sub: 'let it stand', tone: 'quiet', ink: '168, 197, 255' },
  { id: 'good', glyph: '∧', label: 'caret', sub: 'make room', tone: 'human', ink: '244, 132, 114' },
  { id: 'yet', glyph: '?', label: 'query', sub: 'protect the pause', tone: 'bold', ink: '205, 238, 106' },
]

function dateTokens(setToday: string) {
  const [month, day, year] = setToday.split(' ')
  const dayNum = parseInt(day, 10)
  return {
    month: month ?? '',
    day: Number.isFinite(dayNum) ? dayNum.toString().padStart(2, '0') : '',
    year: year ?? '',
  }
}

export function LastLight({ voice, setToday, pullCount }: LastLightProps) {
  const baseId = useId().replace(/:/g, '')
  const skyGrad = `last-light-sky-${baseId}`
  const moonGrad = `last-light-moon-${baseId}`
  const haloGrad = `last-light-halo-${baseId}`

  const toneStyle = {
    '--last-tone': `var(--${voice})`,
  } as CSSProperties

  const tokens = dateTokens(setToday)

  const stars: Array<{ cx: number; cy: number; r: number; d: number }> = [
    { cx: 116, cy: 56, r: 0.95, d: 0.2 },
    { cx: 212, cy: 86, r: 0.65, d: 1.1 },
    { cx: 308, cy: 36, r: 0.55, d: 1.8 },
    { cx: 540, cy: 72, r: 0.85, d: 0.6 },
    { cx: 700, cy: 38, r: 0.65, d: 1.4 },
  ]

  const threadBeads = [
    { x: 200, r: 4, mark: 'm3', delay: 0.0 },
    { x: 400, r: 5, mark: 'good', delay: 0.18 },
    { x: 600, r: 4.5, mark: 'yet', delay: 0.36 },
  ]

  return (
    <section
      className="last-light"
      style={toneStyle}
      aria-label="The last light plate · the day closing, the question held open"
    >
      <svg
        className="last-light__defs"
        viewBox="0 0 800 280"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={skyGrad} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(168, 197, 255, 0)" />
            <stop offset="34%" stopColor="rgba(168, 197, 255, .04)" />
            <stop offset="78%" stopColor="rgba(168, 197, 255, .09)" />
            <stop offset="100%" stopColor="rgba(168, 197, 255, .14)" />
          </linearGradient>
          <radialGradient id={haloGrad} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(255, 240, 214, .22)" />
            <stop offset="48%" stopColor="rgba(244, 218, 178, .08)" />
            <stop offset="100%" stopColor="rgba(168, 197, 255, 0)" />
          </radialGradient>
          <radialGradient id={moonGrad} cx="38%" cy="36%" r="64%">
            <stop offset="0%" stopColor="rgba(255, 246, 224, .78)" />
            <stop offset="55%" stopColor="rgba(220, 214, 196, .55)" />
            <stop offset="100%" stopColor="rgba(168, 178, 200, .35)" />
          </radialGradient>
        </defs>
      </svg>

      <span className="last-light__sky" aria-hidden="true">
        <svg viewBox="0 0 800 280" preserveAspectRatio="none">
          <rect x="0" y="0" width="800" height="280" fill={`url(#${skyGrad})`} />

          <g className="last-light__stars" fill="rgba(255, 240, 214, .65)">
            {stars.map((s, i) => (
              <circle
                key={`last-star-${i}`}
                cx={s.cx}
                cy={s.cy}
                r={s.r}
                style={{ animationDelay: `${s.d}s` } as CSSProperties}
              />
            ))}
          </g>

          <ellipse
            className="last-light__moon-halo"
            cx="400"
            cy="116"
            rx="230"
            ry="92"
            fill={`url(#${haloGrad})`}
          />

          <g className="last-light__moon">
            <circle cx="400" cy="116" r="62" fill={`url(#${moonGrad})`} />
            <circle cx="416" cy="108" r="56" fill="#0c0f18" />
            <circle cx="400" cy="116" r="62" fill="none" stroke="rgba(255, 240, 214, .32)" strokeWidth=".4" />
            <circle cx="400" cy="116" r="56" fill="none" stroke="rgba(255, 240, 214, .16)" strokeWidth=".3" strokeDasharray=".8 2.4" />
          </g>

          <line
            className="last-light__horizon"
            x1="60"
            y1="226"
            x2="740"
            y2="226"
            stroke="rgba(168, 197, 255, .28)"
            strokeWidth=".5"
            strokeLinecap="round"
            strokeDasharray="1.6 5"
          />

          <g className="last-light__ticks" fill="rgba(168, 197, 255, .42)">
            <circle cx="180" cy="226" r=".8" />
            <circle cx="400" cy="226" r="1.1" />
            <circle cx="620" cy="226" r=".8" />
          </g>
        </svg>
      </span>

      <header className="last-light__head" aria-hidden="true">
        <span className="last-light__head-eyebrow">
          <span className="last-light__head-bead" />
          <em>last light</em>
          <span aria-hidden="true">·</span>
          <em>the day closing</em>
        </span>
        <span className="last-light__head-folio">
          <span className="last-light__head-rule" />
          <em>folio vi</em>
          <span aria-hidden="true">·</span>
          <em>the close</em>
          <span className="last-light__head-rule" />
        </span>
      </header>

      <div className="last-light__body">
        <p className="last-light__line">
          <span className="last-light__opening-quote" aria-hidden="true">“</span>
          <em>i let the page </em>
          <em className="last-light__line-em">stand</em>
          <em>, and the question held open</em>
          <span className="last-light__closing-quote" aria-hidden="true">”</span>
        </p>

        <p className="last-light__sub">
          <span>— one line, set three ways, asked once · the answer held close, the question left open.</span>
        </p>

        <div className="last-light__thread" aria-hidden="true">
          <svg viewBox="0 0 800 32" preserveAspectRatio="none">
            <path
              d="M 24 16 Q 200 6, 400 14 T 776 16"
              fill="none"
              stroke="currentColor"
              strokeWidth=".55"
              strokeLinecap="round"
              strokeDasharray="1.4 3.4"
              opacity=".5"
            />
            <path
              d="M 24 16 Q 200 6, 400 14 T 776 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
              opacity=".18"
            />
          </svg>

          {threadBeads.map((bead, idx) => {
            const mark = MARKS.find(m => m.id === bead.mark)!
            return (
              <span
                key={`bead-${bead.mark}`}
                className={`last-light__bead last-light__bead--${mark.tone}`}
                style={{
                  left: `${(bead.x / 800) * 100}%`,
                  animationDelay: `${bead.delay}s`,
                  ['--bead-ink' as string]: mark.ink,
                } as CSSProperties}
                aria-hidden="true"
              >
                <svg viewBox="0 0 14 14">
                  <circle cx="7" cy="7" r="6.4" fill={`rgba(${mark.ink}, .28)`} stroke={`rgba(${mark.ink}, .9)`} strokeWidth=".6" />
                  <circle cx="7" cy="7" r="3.4" fill="rgba(8, 10, 18, .85)" />
                  <circle cx="7" cy="7" r="1.6" fill={`rgba(${mark.ink}, .95)`} />
                </svg>
                <em className="last-light__bead-label">{mark.glyph}</em>
              </span>
            )
          })}

          <span className="last-light__thread-key" aria-hidden="true">
            <em>three marks · one thread · let it stand</em>
          </span>
        </div>
      </div>

      <footer className="last-light__foot" aria-hidden="true">
        <span className="last-light__marks" aria-label="The three marks, set today">
          {MARKS.map(mark => (
            <span
              key={mark.id}
              className={`last-light__mark last-light__mark--${mark.tone} ${mark.tone === voice ? 'is-active' : ''}`}
              style={{ ['--mark-ink' as string]: mark.ink } as CSSProperties}
            >
              <svg viewBox="0 0 14 14" aria-hidden="true">
                <circle cx="7" cy="7" r="6.4" fill="rgba(8,10,18,.7)" stroke="currentColor" strokeWidth=".5" />
                <circle cx="7" cy="7" r="4.2" fill="none" stroke="currentColor" strokeWidth=".35" strokeDasharray=".6 1.2" opacity=".55" />
              </svg>
              <em className="last-light__mark-glyph" aria-hidden="true">{mark.glyph}</em>
              <span className="last-light__mark-stack">
                <em className="last-light__mark-label">{mark.label}</em>
                <span className="last-light__mark-sub">· {mark.sub}</span>
              </span>
            </span>
          ))}
        </span>

        <span className="last-light__coda" aria-hidden="true">
          <em>set at first light</em>
          <span aria-hidden="true">·</span>
          <em>read in the dark</em>
          <span aria-hidden="true">·</span>
          <em>{pullCount} impressions kept</em>
        </span>
      </footer>

      <span className="last-light__day" aria-hidden="true">
        <em>{tokens.month}</em>
        <span className="last-light__day-sep" aria-hidden="true">·</span>
        <em>{tokens.day}</em>
        <span className="last-light__day-sep" aria-hidden="true">·</span>
        <em>{tokens.year}</em>
      </span>

      <span className="last-light__stitch" aria-hidden="true">
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