import { useEffect, useId, useRef, type CSSProperties } from 'react'
import type { VoiceId } from './App'

type LastLampProps = {
  voice: VoiceId
  setToday: string
}

const LAMP_NOTE: Record<VoiceId, string> = {
  quiet: 'the compositor works after dark — let the room be still',
  human: 'the compositor keeps the lamp close — the line warms',
  bold: 'THE LAMP STAYS ON — THE LINE IS HELD UNTIL DAWN',
}

const LAMP_NOTE_COPY: Record<VoiceId, string> = {
  quiet: 'read the page once more, in the dark. the question is the same.',
  human: 'read the page by the lamp. the question stays open for the reader.',
  bold: 'READ IT AGAIN. THE QUESTION HAS NOT MOVED.',
}

export function LastLamp({ voice, setToday }: LastLampProps) {
  const ref = useRef<HTMLElement | null>(null)
  const baseId = useId().replace(/:/g, '')
  const haloId = `ll-halo-${baseId}`
  const bulbId = `ll-bulb-${baseId}`
  const bulbCoreId = `ll-bulb-core-${baseId}`
  const beamId = `ll-beam-${baseId}`
  const cordId = `ll-cord-${baseId}`
  const shadeTopId = `ll-shade-top-${baseId}`
  const shadeBotId = `ll-shade-bot-${baseId}`
  const glowId = `ll-glow-${baseId}`

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!('IntersectionObserver' in window)) return
    const node = ref.current
    if (!node) return
    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-lit')
            observer.disconnect()
          }
        }
      },
      { threshold: 0.18, rootMargin: '0px 0px -10% 0px' },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  const toneStyle = { '--ll-tone': `var(--${voice})` } as CSSProperties

  return (
    <section
      ref={ref}
      className={`last-lamp last-lamp--${voice}`}
      id="last-lamp"
      aria-label="The composer's lamp, set at the foot of the page"
      style={toneStyle}
    >
      <div className="last-lamp__stage">
        <svg
          className="last-lamp__sky"
          viewBox="0 0 1200 520"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden="true"
        >
          <defs>
            <radialGradient id={haloId} cx="50%" cy="22%" r="48%">
              <stop offset="0%" stopColor="rgba(255, 240, 214, .42)" />
              <stop offset="38%" stopColor="rgba(255, 226, 188, .14)" />
              <stop offset="78%" stopColor="rgba(255, 220, 178, .03)" />
              <stop offset="100%" stopColor="rgba(255, 220, 178, 0)" />
            </radialGradient>
            <radialGradient id={bulbId} cx="50%" cy="42%" r="58%">
              <stop offset="0%" stopColor="rgba(255, 248, 222, .98)" />
              <stop offset="48%" stopColor="rgba(255, 226, 180, .74)" />
              <stop offset="82%" stopColor="rgba(244, 198, 152, .22)" />
              <stop offset="100%" stopColor="rgba(244, 198, 152, 0)" />
            </radialGradient>
            <radialGradient id={bulbCoreId} cx="50%" cy="42%" r="48%">
              <stop offset="0%" stopColor="rgba(255, 252, 234, .95)" />
              <stop offset="60%" stopColor="rgba(255, 240, 210, .6)" />
              <stop offset="100%" stopColor="rgba(255, 232, 192, 0)" />
            </radialGradient>
            <radialGradient id={glowId} cx="50%" cy="42%" r="62%">
              <stop offset="0%" stopColor="currentColor" stopOpacity=".42" />
              <stop offset="48%" stopColor="currentColor" stopOpacity=".14" />
              <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
            </radialGradient>
            <linearGradient id={beamId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(255, 240, 210, .22)" />
              <stop offset="55%" stopColor="rgba(255, 232, 192, .06)" />
              <stop offset="100%" stopColor="rgba(255, 232, 192, 0)" />
            </linearGradient>
            <linearGradient id={cordId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(245, 238, 216, .42)" />
              <stop offset="100%" stopColor="rgba(245, 238, 216, .18)" />
            </linearGradient>
            <linearGradient id={shadeTopId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(245, 238, 216, .04)" />
              <stop offset="100%" stopColor="rgba(245, 238, 216, 0)" />
            </linearGradient>
            <linearGradient id={shadeBotId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(245, 238, 216, 0)" />
              <stop offset="100%" stopColor="rgba(245, 238, 216, .03)" />
            </linearGradient>
          </defs>

          <rect x="0" y="0" width="1200" height="520" fill={`url(#${haloId})`} className="last-lamp__sky-halo" />

          {/* the cord — a single line from the top edge to the shade */}
          <line
            className="last-lamp__cord"
            x1="600"
            y1="0"
            x2="600"
            y2="116"
            stroke={`url(#${cordId})`}
            strokeWidth=".8"
            strokeLinecap="round"
          />

          {/* the shade — a soft cone holding the bulb */}
          <g className="last-lamp__shade">
            <path
              d="M 522 116 L 678 116 L 644 184 L 556 184 Z"
              fill={`url(#${shadeTopId})`}
              stroke="rgba(245, 238, 216, .42)"
              strokeWidth=".7"
              strokeLinejoin="round"
            />
            <path
              d="M 556 184 L 644 184 L 632 198 L 568 198 Z"
              fill={`url(#${shadeBotId})`}
              stroke="rgba(245, 238, 216, .32)"
              strokeWidth=".55"
              strokeLinejoin="round"
            />
            <line x1="540" y1="124" x2="660" y2="124" stroke="rgba(245, 238, 216, .32)" strokeWidth=".45" />
            <line x1="544" y1="138" x2="656" y2="138" stroke="rgba(245, 238, 216, .22)" strokeWidth=".35" />
            <line x1="548" y1="152" x2="652" y2="152" stroke="rgba(245, 238, 216, .14)" strokeWidth=".3" />
          </g>

          {/* the bulb — the warm glow at the heart of the lamp */}
          <g className="last-lamp__bulb">
            <circle className="last-lamp__bulb-glow" cx="600" cy="216" r="64" fill={`url(#${glowId})`} />
            <circle className="last-lamp__bulb-aura" cx="600" cy="216" r="34" fill={`url(#${bulbId})`} />
            <circle className="last-lamp__bulb-core" cx="600" cy="216" r="20" fill={`url(#${bulbCoreId})`} />
            <circle cx="600" cy="216" r="20" fill="none" stroke="rgba(255, 240, 214, .55)" strokeWidth=".5" />
            <circle cx="600" cy="216" r="14" fill="none" stroke="rgba(255, 240, 214, .28)" strokeWidth=".4" strokeDasharray="1 3" />

            {/* a tiny filament coil — a hand-drawn spring inside the bulb */}
            <g className="last-lamp__filament">
              <path
                d="M 592 222 q 1 -3 2 -3 q 1 0 1.5 1 q .5 1 1.5 1 q 1 0 1.5 -1 q .5 -1 1.5 -1 q 1 0 1.5 1 q .5 1 1.5 1 q 1 0 1.5 -1 q .5 -1 1.5 -1"
                fill="none"
                stroke="rgba(120, 96, 64, .55)"
                strokeWidth=".5"
                strokeLinecap="round"
              />
              <line x1="592" y1="222" x2="592" y2="216" stroke="rgba(120, 96, 64, .45)" strokeWidth=".5" strokeLinecap="round" />
              <line x1="608" y1="216" x2="608" y2="222" stroke="rgba(120, 96, 64, .45)" strokeWidth=".5" strokeLinecap="round" />
            </g>
          </g>

          {/* the beam — a soft cone of light falling onto the page */}
          <g className="last-lamp__beam">
            <path
              d="M 580 236 L 620 236 L 760 520 L 440 520 Z"
              fill={`url(#${beamId})`}
              opacity=".65"
            />
            <path
              d="M 590 236 L 610 236 L 700 520 L 500 520 Z"
              fill={`url(#${beamId})`}
              opacity=".55"
            />
          </g>

          {/* the constellation — a small set of stars, hand-placed, twinkling */}
          <g className="last-lamp__stars">
            {/* a few faint constellation lines connecting selected stars */}
            <g className="last-lamp__const-lines" stroke="rgba(255, 240, 214, .22)" strokeWidth=".4" strokeLinecap="round" fill="none">
              <line x1="120" y1="80" x2="230" y2="60" />
              <line x1="230" y1="60" x2="340" y2="120" />
              <line x1="340" y1="120" x2="420" y2="60" />
              <line x1="800" y1="40" x2="880" y2="80" />
              <line x1="880" y1="80" x2="980" y2="140" />
              <line x1="980" y1="140" x2="1080" y2="60" />
              <line x1="920" y1="220" x2="1060" y2="220" />
              <line x1="1060" y1="220" x2="1100" y2="280" />
            </g>
            {[
              { cx: 120, cy: 80, r: 1.4, o: .85, s: 0 },
              { cx: 230, cy: 60, r: 1, o: .7, s: 1 },
              { cx: 340, cy: 120, r: 1.6, o: .9, s: 2 },
              { cx: 180, cy: 180, r: .9, o: .55, s: 3 },
              { cx: 80, cy: 240, r: 1.2, o: .75, s: 4 },
              { cx: 280, cy: 220, r: .8, o: .55, s: 5 },
              { cx: 420, cy: 60, r: 1.1, o: .7, s: 6 },
              { cx: 880, cy: 80, r: 1.4, o: .85, s: 7 },
              { cx: 980, cy: 140, r: .9, o: .65, s: 8 },
              { cx: 1080, cy: 60, r: 1.2, o: .8, s: 9 },
              { cx: 920, cy: 220, r: 1, o: .6, s: 10 },
              { cx: 1100, cy: 280, r: .8, o: .5, s: 11 },
              { cx: 800, cy: 40, r: 1.1, o: .72, s: 12 },
              { cx: 1020, cy: 360, r: .9, o: .55, s: 13 },
              { cx: 60, cy: 380, r: 1, o: .6, s: 14 },
              { cx: 160, cy: 460, r: .8, o: .5, s: 15 },
              { cx: 1140, cy: 460, r: 1, o: .65, s: 16 },
              { cx: 1060, cy: 220, r: .9, o: .55, s: 17 },
              { cx: 760, cy: 200, r: .8, o: .5, s: 18 },
              { cx: 460, cy: 300, r: .7, o: .42, s: 19 },
            ].map(star => {
              const delay = (star.s % 5) * 0.7
              const twinkle = 0.55 + 0.45 * Math.sin(star.s * 0.8)
              return (
                <circle
                  key={`ll-star-${star.s}`}
                  className={`last-lamp__star last-lamp__star--${star.s}`}
                  cx={star.cx}
                  cy={star.cy}
                  r={star.r}
                  fill="rgba(255, 240, 214, .85)"
                  style={{ '--ll-star-delay': `${delay}s`, '--ll-star-twinkle': twinkle.toFixed(2) } as CSSProperties}
                  opacity={star.o}
                />
              )
            })}
          </g>

          {/* a thin hairline horizon — where the lamp light meets the page */}
          <line
            className="last-lamp__horizon"
            x1="0"
            y1="498"
            x2="1200"
            y2="498"
            stroke="rgba(255, 220, 178, .14)"
            strokeWidth=".55"
            strokeDasharray="1 4"
          />

          {/* a slow drift of dust motes catching the light */}
          <g className="last-lamp__dust" aria-hidden="true">
            {[
              { x: 510, y: 320, r: .8, s: 0 },
              { x: 540, y: 380, r: .6, s: 1 },
              { x: 660, y: 340, r: .9, s: 2 },
              { x: 580, y: 420, r: .7, s: 3 },
              { x: 700, y: 440, r: .8, s: 4 },
              { x: 490, y: 460, r: .5, s: 5 },
              { x: 620, y: 480, r: .6, s: 6 },
              { x: 720, y: 380, r: .7, s: 7 },
            ].map(mote => (
              <circle
                key={`ll-mote-${mote.s}`}
                className={`last-lamp__mote last-lamp__mote--${mote.s}`}
                cx={mote.x}
                cy={mote.y}
                r={mote.r}
                fill="rgba(255, 240, 214, .6)"
                style={{ '--ll-mote-delay': `${mote.s * 0.4}s` } as CSSProperties}
              />
            ))}
          </g>
        </svg>

        <header className="last-lamp__head" aria-hidden="true">
          <span className="last-lamp__head-rule last-lamp__head-rule--l" />
          <em className="last-lamp__head-key">the lamp, after dark</em>
          <span className="last-lamp__head-mark">
            <span className="last-lamp__head-bead" />
            <span className="last-lamp__head-bead last-lamp__head-bead--alt" />
            <em className="last-lamp__head-meta">set on {setToday}</em>
          </span>
          <span className="last-lamp__head-rule last-lamp__head-rule--r" />
        </header>

        <p className="last-lamp__note" aria-label={`A compositor's note at the lamp · ${LAMP_NOTE[voice]}`}>
          <em className="last-lamp__note-line">{LAMP_NOTE[voice]}</em>
          <span className="last-lamp__note-rule" aria-hidden="true" />
          <em className="last-lamp__note-copy">{LAMP_NOTE_COPY[voice]}</em>
        </p>

        <footer className="last-lamp__foot" aria-hidden="true">
          <span className="last-lamp__foot-mark">
            <svg viewBox="0 0 36 36" aria-hidden="true">
              <circle cx="18" cy="18" r="15" fill="none" stroke="currentColor" strokeWidth=".55" />
              <circle cx="18" cy="18" r="11" fill="none" stroke="currentColor" strokeWidth=".4" strokeDasharray="1 2.5" opacity=".55" />
              <path d="M18 6 v3 M18 27 v3 M6 18 h3 M27 18 h3" stroke="currentColor" strokeWidth=".55" strokeLinecap="round" opacity=".7" />
              <circle cx="18" cy="18" r="3" fill="currentColor" />
              <circle cx="18" cy="18" r="1.2" fill="var(--night)" />
            </svg>
          </span>
          <span className="last-lamp__foot-text">
            <em>the compositor&apos;s lamp · at the foot of the page</em>
            <span className="last-lamp__foot-dot" aria-hidden="true">·</span>
            <em>
              set in {voice === 'bold' ? <strong>{voice}</strong> : voice}
            </em>
          </span>
          <span className="last-lamp__foot-rule" aria-hidden="true" />
        </footer>

        <span className="sr-only">{`The composer's lamp at folio vi · ${LAMP_NOTE[voice]} ${LAMP_NOTE_COPY[voice]}`}</span>
      </div>
    </section>
  )
}