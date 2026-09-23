import {
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
} from 'react'
import type { VoiceId } from './App'
import type { WordId } from './notes'

type SettingSealProps = {
  voice: VoiceId
  word: WordId
  setToday: string
}

const VOICE_NAME: Record<VoiceId, string> = {
  quiet: 'quiet cut',
  human: 'human hand',
  bold: 'bold signal',
}
const VOICE_FACE: Record<VoiceId, string> = {
  quiet: 'serif · italic · close set',
  human: 'serif · italic · warm',
  bold: 'sans · heavy · no apology',
}
const VOICE_LETTER: Record<VoiceId, string> = { quiet: 'a', human: 'b', bold: 'c' }

const ORDER: VoiceId[] = ['quiet', 'human', 'bold']

const SEAL_GLYPH: Record<WordId, string> = { m3: 'm³', good: '∧', yet: '?' }
const SEAL_TITLE: Record<WordId, string> = {
  m3: 'the maker, sealed',
  good: 'the verb, sealed',
  yet: 'the pause, sealed',
}

const SEAL_DEDICATION: Record<VoiceId, string> = {
  quiet: 'set softly — for the question to come',
  human: 'set by hand — for the question to come',
  bold: 'set at full height — for the question to come',
}

const SEAL_TIME_NOTE: Record<VoiceId, string> = {
  quiet: 'first light, the page is cold',
  human: 'morning, the press is warm',
  bold: 'midday, the page is held',
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

function tokenArc(label: string, radius: number, startAngle: number, endAngle: number) {
  const cx = 200
  const cy = 200
  const start = polar(cx, cy, radius, startAngle)
  const end = polar(cx, cy, radius, endAngle)
  const largeArc = endAngle - startAngle > Math.PI ? 1 : 0
  return { d: `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} 1 ${end.x} ${end.y}`, label }
}

function polar(cx: number, cy: number, r: number, angle: number) {
  return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) }
}

export function SettingSeal({ voice, word, setToday }: SettingSealProps) {
  const baseId = useId().replace(/:/g, '')
  const ringGradId = `seal-ring-${baseId}`
  const waxGlowId = `seal-wax-${baseId}`
  const waxHiId = `seal-wax-hi-${baseId}`
  const pressAuraId = `seal-aura-${baseId}`

  const rootRef = useRef<HTMLElement | null>(null)
  const [revealed, setRevealed] = useState(false)
  const [reduceMotion, setReduceMotion] = useState(false)
  const [hour, setHour] = useState(() => plateHour())
  const [hoveredVoice, setHoveredVoice] = useState<VoiceId | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduceMotion(mq.matches)
    const onChange = () => setReduceMotion(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setRevealed(true)
      return
    }
    const node = rootRef.current
    if (!node) return
    const obs = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setRevealed(true)
            obs.unobserve(entry.target)
          }
        }
      },
      { threshold: 0.18, rootMargin: '0px 0px -8% 0px' },
    )
    obs.observe(node)
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    const id = window.setInterval(() => setHour(plateHour()), 30_000)
    return () => window.clearInterval(id)
  }, [])

  const focusVoice = hoveredVoice ?? voice
  const isYet = word === 'yet'

  const ringPaths = ORDER.map((v, i) => {
    const start = -Math.PI / 2 + i * 0.46
    const end = start + 0.46 * 2 - 0.06
    return { voice: v, ...tokenArc('', 138 + i * 18, start, end) }
  })

  const style = {
    '--seal-tone': `var(--${voice})`,
    '--seal-focus': `var(--${focusVoice})`,
    '--seal-tone-deep': `var(--${voice}-deep)`,
    '--seal-warm': 'var(--wax)',
  } as CSSProperties

  return (
    <section
      ref={rootRef}
      className={`setting-seal setting-seal--${voice} ${revealed ? 'is-revealed' : ''} ${reduceMotion ? 'is-quiet' : ''}`}
      style={style}
      aria-label={`The question, sealed · folio i · set on ${setToday} at ${hour}. Three voices, three rings — the question is sealed in ${VOICE_NAME[voice]}.`}
    >
      <svg className="setting-seal__defs" aria-hidden="true" focusable="false">
        <defs>
          <radialGradient id={pressAuraId} cx="50%" cy="48%" r="55%">
            <stop offset="0%" stopColor="var(--seal-focus)" stopOpacity=".16" />
            <stop offset="50%" stopColor="var(--seal-focus)" stopOpacity=".05" />
            <stop offset="100%" stopColor="var(--seal-focus)" stopOpacity="0" />
          </radialGradient>
          <radialGradient id={waxGlowId} cx="42%" cy="38%" r="62%">
            <stop offset="0%" stopColor="rgba(245, 232, 198, .78)" />
            <stop offset="36%" stopColor="rgba(214, 178, 124, .55)" />
            <stop offset="68%" stopColor="rgba(140, 86, 56, .42)" />
            <stop offset="100%" stopColor="rgba(56, 28, 18, .68)" />
          </radialGradient>
          <radialGradient id={waxHiId} cx="36%" cy="32%" r="32%">
            <stop offset="0%" stopColor="rgba(255, 248, 226, .82)" />
            <stop offset="42%" stopColor="rgba(255, 232, 188, .18)" />
            <stop offset="100%" stopColor="rgba(255, 240, 200, 0)" />
          </radialGradient>
          <linearGradient id={ringGradId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--seal-focus)" stopOpacity=".85" />
            <stop offset="100%" stopColor="var(--seal-focus)" stopOpacity=".15" />
          </linearGradient>
        </defs>
      </svg>

      <span className="setting-seal__aura" aria-hidden="true">
        <svg viewBox="0 0 400 400" preserveAspectRatio="xMidYMid meet">
          <rect x="0" y="0" width="400" height="400" fill={`url(#${pressAuraId})`} />
        </svg>
      </span>

      <header className="setting-seal__crest" aria-hidden="true">
        <span className="setting-seal__crest-rule setting-seal__crest-rule--l">
          <svg viewBox="0 0 200 8" preserveAspectRatio="none">
            <line x1="0" y1="4" x2="200" y2="4" stroke="currentColor" strokeWidth=".45" strokeDasharray=".4 2.4" opacity=".55" />
            <circle cx="2" cy="4" r="1" fill="currentColor" opacity=".75" />
            <circle cx="100" cy="4" r="1.4" fill="currentColor" />
            <circle cx="198" cy="4" r="1" fill="currentColor" opacity=".75" />
          </svg>
        </span>
        <span className="setting-seal__crest-stack">
          <em className="setting-seal__crest-key">folio i</em>
          <span className="setting-seal__crest-line">
            <em>the question</em>
            <span aria-hidden="true">·</span>
            <em>sealed</em>
          </span>
        </span>
        <span className="setting-seal__crest-rule setting-seal__crest-rule--r">
          <svg viewBox="0 0 200 8" preserveAspectRatio="none">
            <line x1="0" y1="4" x2="200" y2="4" stroke="currentColor" strokeWidth=".45" strokeDasharray=".4 2.4" opacity=".55" />
            <circle cx="2" cy="4" r="1" fill="currentColor" opacity=".75" />
            <circle cx="100" cy="4" r="1.4" fill="currentColor" />
            <circle cx="198" cy="4" r="1" fill="currentColor" opacity=".75" />
          </svg>
        </span>
      </header>

      <div className="setting-seal__stage">
        <figure className="setting-seal__plate" aria-hidden="true">
          <svg
            className="setting-seal__plate-svg"
            viewBox="0 0 400 400"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <path
                id={`seal-arc-top-${baseId}`}
                d="M 80 200 A 120 120 0 0 1 320 200"
                fill="none"
              />
              <path
                id={`seal-arc-bot-${baseId}`}
                d="M 320 200 A 120 120 0 0 1 80 200"
                fill="none"
              />
              <path
                id={`seal-arc-mark-${baseId}`}
                d="M 96 200 A 104 104 0 1 1 304 200 A 104 104 0 1 1 96 200"
                fill="none"
              />
            </defs>

            {/* the wax drips — a few soft uneven tabs around the plate */}
            <g className="setting-seal__drips">
              <path d="M 60 96 Q 56 110 64 122 Q 70 130 78 124 Q 84 116 80 100 Z" fill={`url(#${waxGlowId})`} opacity=".85" />
              <path d="M 332 76 Q 338 92 330 108 Q 322 116 314 108 Q 310 96 318 80 Z" fill={`url(#${waxGlowId})`} opacity=".78" />
              <path d="M 348 244 Q 354 262 344 274 Q 334 282 326 270 Q 322 256 332 240 Z" fill={`url(#${waxGlowId})`} opacity=".82" />
              <path d="M 80 322 Q 76 340 86 348 Q 96 354 102 344 Q 106 332 96 320 Z" fill={`url(#${waxGlowId})`} opacity=".75" />
              <path d="M 196 348 Q 192 362 200 370 Q 210 372 214 360 Q 214 348 206 342 Z" fill={`url(#${waxGlowId})`} opacity=".8" />
            </g>

            {/* the wax body — slightly imperfect circle */}
            <g className="setting-seal__body">
              <path
                className="setting-seal__body-fill"
                d="M 200 60 C 280 60 340 120 340 200 C 340 282 282 340 200 340 C 118 340 60 282 60 200 C 60 118 120 60 200 60 Z"
                fill={`url(#${waxGlowId})`}
              />
              <path
                className="setting-seal__body-edge"
                d="M 200 60 C 280 60 340 120 340 200 C 340 282 282 340 200 340 C 118 340 60 282 60 200 C 60 118 120 60 200 60 Z"
                fill="none"
                stroke={`url(#${ringGradId})`}
                strokeWidth="1.6"
                strokeOpacity=".85"
              />
              {/* tiny cracks to give the wax a fresh, pressed feel */}
              <path d="M 110 152 Q 130 156 144 148" fill="none" stroke="rgba(40, 22, 12, .32)" strokeWidth=".45" strokeLinecap="round" />
              <path d="M 296 244 Q 282 254 270 250" fill="none" stroke="rgba(40, 22, 12, .32)" strokeWidth=".45" strokeLinecap="round" />
              <path d="M 230 318 L 250 326" fill="none" stroke="rgba(40, 22, 12, .28)" strokeWidth=".4" strokeLinecap="round" />

              {/* the highlight — the upper-left press light */}
              <ellipse cx="148" cy="120" rx="68" ry="42" fill={`url(#${waxHiId})`} opacity=".78" />
              <ellipse cx="124" cy="106" rx="34" ry="18" fill="rgba(255, 246, 220, .25)" />

              {/* a faint inner ring — the engraving plate boundary */}
              <circle cx="200" cy="200" r="124" fill="none" stroke="rgba(40, 22, 12, .42)" strokeWidth=".55" />
              <circle cx="200" cy="200" r="120" fill="none" stroke="rgba(40, 22, 12, .22)" strokeWidth=".4" strokeDasharray=".8 2.2" />
            </g>

            {/* the three concentric voice rings */}
            <g className="setting-seal__voice-rings">
              {ringPaths.map((ring, i) => (
                <path
                  key={ring.voice}
                  d={ring.d}
                  fill="none"
                  stroke={`var(--${ring.voice})`}
                  strokeWidth={focusVoice === ring.voice ? 2.4 : 1.2}
                  strokeOpacity={focusVoice === ring.voice ? 0.95 : 0.4}
                  className={`setting-seal__voice-ring setting-seal__voice-ring--${ring.voice}`}
                  style={{ '--ring-i': i } as CSSProperties}
                />
              ))}
            </g>

            {/* the central seal medallion */}
            <g className="setting-seal__medallion">
              <circle cx="200" cy="200" r="46" fill="rgba(8, 10, 18, .86)" />
              <circle cx="200" cy="200" r="46" fill="none" stroke="rgba(245, 232, 198, .55)" strokeWidth=".6" />
              <circle cx="200" cy="200" r="42" fill="none" stroke="rgba(245, 232, 198, .3)" strokeWidth=".35" strokeDasharray=".6 1.6" />
              <circle cx="200" cy="200" r="36" fill="none" stroke="rgba(245, 232, 198, .22)" strokeWidth=".3" />
              <circle cx="200" cy="200" r="29" fill="none" stroke="rgba(245, 232, 198, .14)" strokeWidth=".25" />

              {/* the question mark engraved — voice-aware weight */}
              {isYet ? (
                <text
                  x="200"
                  y="222"
                  textAnchor="middle"
                  fontFamily={voice === 'bold' ? 'Inter, ui-sans-serif, system-ui, sans-serif' : "'Iowan Old Style', 'Palatino Linotype', Georgia, serif"}
                  fontStyle={voice === 'bold' ? 'normal' : 'italic'}
                  fontWeight={voice === 'bold' ? 800 : voice === 'human' ? 500 : 400}
                  fontSize={voice === 'bold' ? '46' : voice === 'human' ? '52' : '54'}
                  fill="rgba(245, 232, 198, .94)"
                  letterSpacing={voice === 'bold' ? '-.06em' : '-.04em'}
                  textRendering="geometricPrecision"
                >
                  ?
                </text>
              ) : (
                <text
                  x="200"
                  y="216"
                  textAnchor="middle"
                  fontFamily="'Iowan Old Style', 'Palatino Linotype', Georgia, serif"
                  fontStyle="italic"
                  fontWeight="500"
                  fontSize="36"
                  fill="rgba(245, 232, 198, .88)"
                  letterSpacing="-.02em"
                >
                  {SEAL_GLYPH[word]}
                </text>
              )}

              {/* tiny registration crosshairs inside the medallion */}
              <line x1="200" y1="156" x2="200" y2="166" stroke="rgba(245, 232, 198, .6)" strokeWidth=".4" strokeLinecap="round" />
              <line x1="200" y1="234" x2="200" y2="244" stroke="rgba(245, 232, 198, .6)" strokeWidth=".4" strokeLinecap="round" />
              <line x1="156" y1="200" x2="166" y2="200" stroke="rgba(245, 232, 198, .6)" strokeWidth=".4" strokeLinecap="round" />
              <line x1="234" y1="200" x2="244" y2="200" stroke="rgba(245, 232, 198, .6)" strokeWidth=".4" strokeLinecap="round" />
            </g>

            {/* the outer inscription arc — top */}
            <g className="setting-seal__inscription">
              <text
                className="setting-seal__inscription-top"
                fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
                fontSize="9.4"
                letterSpacing="3.6"
                fill="rgba(40, 22, 12, .84)"
              >
                <textPath href={`#seal-arc-top-${baseId}`} startOffset="50%" textAnchor="middle">
                  THE QUESTION · SEALED FOR THE DAY
                </textPath>
              </text>
              <text
                className="setting-seal__inscription-bot"
                fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
                fontSize="8"
                letterSpacing="2.4"
                fill="rgba(40, 22, 12, .72)"
              >
                <textPath href={`#seal-arc-bot-${baseId}`} startOffset="50%" textAnchor="middle">
                  {`M³ · ${setToday.toUpperCase()} · ${hour.toUpperCase()}`}
                </textPath>
              </text>

              {/* three tiny voice ticks around the medallion */}
              <circle cx="200" cy="74" r="2.2" fill="rgba(40, 22, 12, .72)" />
              <circle cx="200" cy="74" r=".8" fill="rgba(245, 232, 198, .72)" />
              <circle cx="326" cy="200" r="2.2" fill="rgba(40, 22, 12, .72)" />
              <circle cx="326" cy="200" r=".8" fill="rgba(245, 232, 198, .72)" />
              <circle cx="200" cy="326" r="2.2" fill="rgba(40, 22, 12, .72)" />
              <circle cx="200" cy="326" r=".8" fill="rgba(245, 232, 198, .72)" />
              <circle cx="74" cy="200" r="2.2" fill="rgba(40, 22, 12, .72)" />
              <circle cx="74" cy="200" r=".8" fill="rgba(245, 232, 198, .72)" />

              {/* the press mark — a small monogram in the upper-left */}
              <g className="setting-seal__press-mark" transform="translate(120 110) rotate(-12)">
                <line x1="0" y1="0" x2="34" y2="0" stroke="rgba(40, 22, 12, .7)" strokeWidth=".45" strokeLinecap="round" />
                <text x="17" y="-2.5" textAnchor="middle" fontFamily="'Iowan Old Style', 'Palatino Linotype', Georgia, serif" fontStyle="italic" fontSize="7" fill="rgba(40, 22, 12, .82)" letterSpacing=".5">m³</text>
                <text x="17" y="9" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="4.2" fill="rgba(40, 22, 12, .68)" letterSpacing="1.2">PRESS</text>
              </g>
            </g>

            {/* a single hairline crack that catches the press light */}
            <path
              className="setting-seal__hairline"
              d="M 168 96 Q 192 124 184 152 Q 178 184 196 208"
              fill="none"
              stroke="rgba(255, 246, 220, .55)"
              strokeWidth=".6"
              strokeLinecap="round"
            />
          </svg>

          <span className="setting-seal__plate-tick setting-seal__plate-tick--n" aria-hidden="true" />
          <span className="setting-seal__plate-tick setting-seal__plate-tick--e" aria-hidden="true" />
          <span className="setting-seal__plate-tick setting-seal__plate-tick--s" aria-hidden="true" />
          <span className="setting-seal__plate-tick setting-seal__plate-tick--w" aria-hidden="true" />
        </figure>

        <div className="setting-seal__legend">
          <span className="setting-seal__legend-key">
            <em>the seal</em>
            <span className="setting-seal__legend-key-rule" />
            <em>three readings</em>
          </span>

          <span className="setting-seal__legend-title">
            <em className="setting-seal__legend-lead">before</em>
            <em className="setting-seal__legend-line">the question,</em>
            <em className="setting-seal__legend-tail">a press-mark holds it.</em>
          </span>

          <p className="setting-seal__legend-copy">
            <em className="setting-seal__legend-quote">
              <svg viewBox="0 0 16 14" aria-hidden="true">
                <path d="M2 12 L6 4 L4 4 L8 4 L4 12 Z M10 12 L14 4 L12 4 L16 4 L12 12 Z" fill="currentColor" opacity=".5" />
              </svg>
            </em>
            <em>{SEAL_DEDICATION[voice]}</em>
          </p>

          <ol className="setting-seal__legend-voices">
            {ORDER.map((v, i) => {
              const isActive = focusVoice === v
              return (
                <li
                  key={v}
                  className={`setting-seal__legend-voice setting-seal__legend-voice--${v} ${isActive ? 'is-active' : ''}`}
                  style={{ '--legend-tone': `var(--${v})` } as CSSProperties}
                  onMouseEnter={() => setHoveredVoice(v)}
                  onMouseLeave={() => setHoveredVoice(prev => (prev === v ? null : prev))}
                >
                  <span className="setting-seal__legend-voice-letter" aria-hidden="true">{VOICE_LETTER[v]}</span>
                  <span className="setting-seal__legend-voice-stack">
                    <em className="setting-seal__legend-voice-name">{VOICE_NAME[v]}</em>
                    <span className="setting-seal__legend-voice-face">{VOICE_FACE[v]}</span>
                  </span>
                  <span className="setting-seal__legend-voice-ring" aria-hidden="true">
                    <svg viewBox="0 0 32 32">
                      <circle cx="16" cy="16" r="13" fill="none" stroke="currentColor" strokeWidth={isActive ? 1.6 : .8} strokeOpacity={isActive ? .9 : .4} />
                      <circle cx="16" cy="16" r="6" fill="currentColor" strokeOpacity={isActive ? .8 : .35} />
                    </svg>
                  </span>
                  {i < ORDER.length - 1 && (
                    <span className="setting-seal__legend-voice-cord" aria-hidden="true">
                      <svg viewBox="0 0 16 6" preserveAspectRatio="none">
                        <line x1="0" y1="3" x2="16" y2="3" stroke="currentColor" strokeWidth=".4" strokeDasharray=".4 1.4" opacity=".55" />
                      </svg>
                    </span>
                  )}
                </li>
              )
            })}
          </ol>

          <footer className="setting-seal__legend-foot">
            <span className="setting-seal__legend-foot-cell">
              <em className="setting-seal__legend-foot-key">sealed at</em>
              <span className="setting-seal__legend-foot-val">{hour}</span>
            </span>
            <span className="setting-seal__legend-foot-cell">
              <em className="setting-seal__legend-foot-key">for</em>
              <span className="setting-seal__legend-foot-val">{SEAL_TITLE[word]}</span>
            </span>
            <span className="setting-seal__legend-foot-cell">
              <em className="setting-seal__legend-foot-key">the note</em>
              <span className="setting-seal__legend-foot-val">{SEAL_TIME_NOTE[voice]}</span>
            </span>
          </footer>
        </div>
      </div>

      <footer className="setting-seal__foot" aria-hidden="true">
        <span className="setting-seal__foot-rule setting-seal__foot-rule--l" />
        <span className="setting-seal__foot-stack">
          <span className="setting-seal__foot-pip" aria-hidden="true">
            <svg viewBox="0 0 14 14">
              <circle cx="7" cy="7" r="5.6" fill="none" stroke="currentColor" strokeWidth=".55" opacity=".75" />
              <circle cx="7" cy="7" r="2.4" fill="currentColor" opacity=".85" />
              <circle cx="7" cy="7" r=".9" fill="var(--night)" />
            </svg>
          </span>
          <em>the question opens at folio i</em>
        </span>
        <span className="setting-seal__foot-arrow" aria-hidden="true">
          <svg viewBox="0 0 28 8" preserveAspectRatio="none">
            <line x1="0" y1="4" x2="24" y2="4" stroke="currentColor" strokeWidth=".55" strokeLinecap="round" />
            <path d="M 22 1 L 26 4 L 22 7" fill="none" stroke="currentColor" strokeWidth=".55" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <span className="setting-seal__foot-rule setting-seal__foot-rule--r" />
      </footer>

      <span className="sr-only">
        {`The question, sealed · folio i · set on ${setToday} at ${hour} · three voices: ${VOICE_NAME.quiet} (${VOICE_LETTER.quiet}), ${VOICE_NAME.human} (${VOICE_LETTER.human}), ${VOICE_NAME.bold} (${VOICE_LETTER.bold}) · ${SEAL_TITLE[word]}.`}
      </span>
    </section>
  )
}
