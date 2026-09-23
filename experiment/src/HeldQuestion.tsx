import {
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react'
import type { VoiceId } from './App'

type HeldQuestionProps = {
  voice: VoiceId
  setToday: string
  onVoice: (voice: VoiceId) => void
}

type VoicePlate = {
  voice: VoiceId
  letter: string
  name: string
  face: string
  line: string
  family: string
  weight: number
  style: 'italic' | 'normal'
  tracking: string
  uppercased: boolean
  glyph: string
  markLabel: string
  note: string
  tone: string
}

const ORDER: VoiceId[] = ['quiet', 'human', 'bold']

const PLATES: VoicePlate[] = [
  {
    voice: 'quiet',
    letter: 'A',
    name: 'quiet cut',
    face: 'serif · italic · close set',
    line: 'is m³ good at frontend yet?',
    family: "'Iowan Old Style', 'Palatino Linotype', 'Book Antiqua', Palatino, Georgia, serif",
    weight: 400,
    style: 'italic',
    tracking: '-.024em',
    uppercased: false,
    glyph: '⌇',
    markLabel: 'stet',
    note: 'set softly — the reader hears themselves in it',
    tone: 'var(--quiet)',
  },
  {
    voice: 'human',
    letter: 'B',
    name: 'human hand',
    face: 'serif · italic · warm',
    line: 'is M3 good at frontend yet?',
    family: "'Iowan Old Style', 'Palatino Linotype', 'Book Antiqua', Palatino, Georgia, serif",
    weight: 500,
    style: 'italic',
    tracking: '-.014em',
    uppercased: false,
    glyph: '∧',
    markLabel: 'caret',
    note: 'set by hand — the page warms',
    tone: 'var(--human)',
  },
  {
    voice: 'bold',
    letter: 'C',
    name: 'bold signal',
    face: 'sans · heavy · no apology',
    line: 'IS M3 GOOD AT FRONTEND YET?',
    family: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    weight: 800,
    style: 'normal',
    tracking: '-.046em',
    uppercased: true,
    glyph: '∴',
    markLabel: 'query',
    note: 'set at full height — heard once, clearly',
    tone: 'var(--bold)',
  },
]

const HELD_LINE = 'the page holds the question — let it land before you answer'

export function HeldQuestion({ voice, setToday, onVoice }: HeldQuestionProps) {
  const baseId = useId().replace(/:/g, '')
  const ruleId = `hq-rule-${baseId}`
  const washId = `hq-wash-${baseId}`
  const sealGlowId = `hq-seal-glow-${baseId}`
  const sealFillId = `hq-seal-fill-${baseId}`
  const plateTopId = `hq-plate-top-${baseId}`
  const plateBotId = `hq-plate-bot-${baseId}`

  const rootRef = useRef<HTMLElement | null>(null)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [revealed, setRevealed] = useState(false)
  const [hoverVoice, setHoverVoice] = useState<VoiceId | null>(null)
  const [setProgress, setSetProgress] = useState(0)

  const active = PLATES.find(p => p.voice === voice) ?? PLATES[0]
  const focus = hoverVoice ?? voice

  useEffect(() => {
    if (typeof window === 'undefined') return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mq.matches)
    const onChange = () => setReducedMotion(mq.matches)
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
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' },
    )
    obs.observe(node)
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    if (reducedMotion) {
      setSetProgress(1)
      return
    }
    let raf = 0
    let start: number | null = null
    const step = (now: number) => {
      if (start === null) start = now
      const elapsed = (now - start) / 1100
      const eased = elapsed >= 1 ? 1 : 1 - Math.pow(1 - Math.min(1, elapsed), 2.4)
      setSetProgress(eased)
      if (elapsed < 1) {
        raf = window.requestAnimationFrame(step)
      }
    }
    raf = window.requestAnimationFrame(step)
    return () => {
      if (raf) window.cancelAnimationFrame(raf)
    }
  }, [revealed, reducedMotion])

  const onKey = (
    event: ReactKeyboardEvent<HTMLButtonElement>,
    target: VoiceId,
  ) => {
    const idx = ORDER.indexOf(target)
    let next: VoiceId | null = null
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault()
      next = ORDER[(idx + 1) % ORDER.length]
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault()
      next = ORDER[(idx - 1 + ORDER.length) % ORDER.length]
    } else if (event.key === 'Home') {
      event.preventDefault()
      next = ORDER[0]
    } else if (event.key === 'End') {
      event.preventDefault()
      next = ORDER[ORDER.length - 1]
    }
    if (next && next !== target) {
      onVoice(next)
      window.requestAnimationFrame(() => {
        const node = document.getElementById(`hq-voice-${next}-${baseId}`) as HTMLButtonElement | null
        node?.focus({ preventScroll: true })
      })
    }
  }

  const toneStyle = {
    '--hq-tone': `var(--${voice})`,
    '--hq-focus': `var(--${focus})`,
    '--hq-progress': setProgress.toFixed(3),
  } as CSSProperties

  return (
    <section
      ref={rootRef}
      id="held"
      className={`held-question held-question--${voice} ${revealed ? 'is-revealed' : ''} ${reducedMotion ? 'is-quiet' : ''}`}
      style={toneStyle}
      aria-labelledby={`held-question-title-${baseId}`}
    >
      <svg className="held-question__defs" aria-hidden="true" focusable="false">
        <defs>
          <linearGradient id={ruleId} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--hq-tone)" stopOpacity="0" />
            <stop offset="14%" stopColor="var(--hq-tone)" stopOpacity=".55" />
            <stop offset="50%" stopColor="var(--hq-tone)" stopOpacity=".75" />
            <stop offset="86%" stopColor="var(--hq-tone)" stopOpacity=".55" />
            <stop offset="100%" stopColor="var(--hq-tone)" stopOpacity="0" />
          </linearGradient>
          <radialGradient id={washId} cx="50%" cy="50%" r="62%">
            <stop offset="0%" stopColor="var(--hq-tone)" stopOpacity=".12" />
            <stop offset="60%" stopColor="var(--hq-tone)" stopOpacity=".04" />
            <stop offset="100%" stopColor="var(--hq-tone)" stopOpacity="0" />
          </radialGradient>
          <radialGradient id={sealGlowId} cx="50%" cy="42%" r="62%">
            <stop offset="0%" stopColor="var(--hq-tone)" stopOpacity=".18" />
            <stop offset="100%" stopColor="var(--hq-tone)" stopOpacity="0" />
          </radialGradient>
          <radialGradient id={sealFillId} cx="42%" cy="38%" r="64%">
            <stop
              offset="0%"
              stopColor={
                voice === 'quiet' ? 'rgba(168, 197, 255, 0.55)' :
                voice === 'human' ? 'rgba(244, 132, 114, 0.6)' :
                'rgba(205, 238, 106, 0.6)'
              }
            />
            <stop
              offset="60%"
              stopColor={
                voice === 'quiet' ? 'rgba(120, 158, 240, 0.85)' :
                voice === 'human' ? 'rgba(216, 80, 64, 0.85)' :
                'rgba(168, 214, 50, 0.85)'
              }
            />
            <stop offset="100%" stopColor="rgba(8, 10, 18, 0.85)" />
          </radialGradient>
          <linearGradient id={plateTopId} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--hq-tone)" stopOpacity="0" />
            <stop offset="50%" stopColor="var(--hq-tone)" stopOpacity=".65" />
            <stop offset="100%" stopColor="var(--hq-tone)" stopOpacity="0" />
          </linearGradient>
          <linearGradient id={plateBotId} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--hq-tone)" stopOpacity="0" />
            <stop offset="50%" stopColor="var(--hq-tone)" stopOpacity=".4" />
            <stop offset="100%" stopColor="var(--hq-tone)" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      <span className="held-question__wash" aria-hidden="true" />
      <span className="held-question__halo" aria-hidden="true" />

      <header className="held-question__head" aria-hidden="true">
        <span className="held-question__eyebrow">
          <span className="held-question__eyebrow-pip" aria-hidden="true">
            <svg viewBox="0 0 14 14">
              <circle cx="7" cy="7" r="5.4" fill="none" stroke="currentColor" strokeWidth=".55" opacity=".78" />
              <circle cx="7" cy="7" r="2.2" fill="currentColor" opacity=".85" />
              <circle cx="7" cy="7" r=".7" fill="var(--night)" />
            </svg>
          </span>
          <em>folio iv½ · the held question</em>
          <span className="held-question__eyebrow-sep">·</span>
          <em>one plate · one line · three faces</em>
        </span>

        <span className="held-question__eyebrow-tag" aria-hidden="true">
          <span className="held-question__eyebrow-rule" />
          <em>set on</em>
          <span className="held-question__eyebrow-date">{setToday}</span>
        </span>
      </header>

      <figure className="held-question__plate" aria-label="The question, held once on a single plate">
        <span className="held-question__plate-corner held-question__plate-corner--tl" aria-hidden="true">
          <svg viewBox="0 0 22 22">
            <path d="M2 20 L2 2 L20 2" fill="none" stroke="currentColor" strokeWidth=".55" strokeLinecap="round" />
            <circle cx="2" cy="2" r="1.6" fill="currentColor" />
            <line x1="2" y1="9" x2="9" y2="2" stroke="currentColor" strokeWidth=".35" opacity=".5" />
          </svg>
        </span>
        <span className="held-question__plate-corner held-question__plate-corner--tr" aria-hidden="true">
          <svg viewBox="0 0 22 22">
            <path d="M20 20 L20 2 L2 2" fill="none" stroke="currentColor" strokeWidth=".55" strokeLinecap="round" />
            <circle cx="20" cy="2" r="1.6" fill="currentColor" />
            <circle cx="13" cy="6" r=".8" fill="currentColor" opacity=".65" />
          </svg>
        </span>
        <span className="held-question__plate-corner held-question__plate-corner--bl" aria-hidden="true">
          <svg viewBox="0 0 22 22">
            <path d="M2 2 L2 20 L20 20" fill="none" stroke="currentColor" strokeWidth=".55" strokeLinecap="round" />
            <circle cx="2" cy="20" r="1.6" fill="currentColor" />
            <line x1="2" y1="14" x2="6" y2="20" stroke="currentColor" strokeWidth=".35" opacity=".5" />
          </svg>
        </span>
        <span className="held-question__plate-corner held-question__plate-corner--br" aria-hidden="true">
          <svg viewBox="0 0 22 22">
            <path d="M20 2 L20 20 L2 20" fill="none" stroke="currentColor" strokeWidth=".55" strokeLinecap="round" />
            <circle cx="20" cy="20" r="1.6" fill="currentColor" />
            <path d="M16 17 L20 20 L16 20" fill="currentColor" opacity=".55" />
          </svg>
        </span>

        <span className="held-question__plate-bed" aria-hidden="true" />
        <span className="held-question__plate-warm" aria-hidden="true" />

        <span className="held-question__plate-rule held-question__plate-rule--top" aria-hidden="true">
          <svg viewBox="0 0 600 4" preserveAspectRatio="none">
            <line x1="0" y1="2" x2="600" y2="2" stroke={`url(#${plateTopId})`} strokeWidth=".7" />
          </svg>
        </span>
        <span className="held-question__plate-rule held-question__plate-rule--bot" aria-hidden="true">
          <svg viewBox="0 0 600 4" preserveAspectRatio="none">
            <line x1="0" y1="2" x2="600" y2="2" stroke={`url(#${plateBotId})`} strokeWidth=".55" />
          </svg>
        </span>

        <span className="held-question__plate-eyebrow" aria-hidden="true">
          <span className="held-question__plate-eyebrow-rule" />
          <em>the question, held once</em>
          <span className="held-question__plate-eyebrow-letter">{active.letter}</span>
          <span className="held-question__plate-eyebrow-rule held-question__plate-eyebrow-rule--r" />
        </span>

        <h2 id={`held-question-title-${baseId}`} className="held-question__title">
          <span className="held-question__title-baseline" aria-hidden="true">
            <svg viewBox="0 0 600 2" preserveAspectRatio="none">
              <line
                x1="0"
                y1="1"
                x2="600"
                y2="1"
                stroke="currentColor"
                strokeWidth=".4"
                strokeDasharray="1.4 2.6"
                opacity=".42"
              />
            </svg>
          </span>
          <span
            className="held-question__title-line"
            style={{
              fontFamily: active.family,
              fontStyle: active.style,
              fontWeight: active.weight,
              letterSpacing: active.tracking,
              textTransform: active.uppercased ? 'uppercase' : 'none',
            }}
            aria-hidden="true"
          >
            {active.line}
          </span>
        </h2>

        <span className="held-question__held-line" aria-hidden="true">
          <span className="held-question__held-pip" aria-hidden="true">
            <svg viewBox="0 0 12 12">
              <circle cx="6" cy="6" r="4.6" fill="none" stroke="currentColor" strokeWidth=".45" opacity=".7" />
              <circle cx="6" cy="6" r="1.4" fill="currentColor" opacity=".75" />
              <circle cx="6" cy="6" r=".4" fill="var(--night)" />
            </svg>
          </span>
          <em>{HELD_LINE}</em>
          <span className="held-question__held-pip held-question__held-pip--end" aria-hidden="true">
            <svg viewBox="0 0 12 12">
              <circle cx="6" cy="6" r="4.6" fill="none" stroke="currentColor" strokeWidth=".45" opacity=".7" />
              <circle cx="6" cy="6" r="1.4" fill="currentColor" opacity=".75" />
              <circle cx="6" cy="6" r=".4" fill="var(--night)" />
            </svg>
          </span>
        </span>

        <figcaption className="held-question__voices" aria-label="The three voices, one plate">
          <span className="held-question__voices-eyebrow" aria-hidden="true">
            <span className="held-question__voices-eyebrow-mark" aria-hidden="true">
              <svg viewBox="0 0 12 12">
                <line x1="0" y1="6" x2="12" y2="6" stroke="currentColor" strokeWidth=".5" strokeDasharray=".6 1.6" opacity=".7" />
              </svg>
            </span>
            <em>three faces</em>
            <span aria-hidden="true">·</span>
            <em>one plate</em>
            <span aria-hidden="true">·</span>
            <em>click to bring forward</em>
            <span className="held-question__voices-eyebrow-mark" aria-hidden="true">
              <svg viewBox="0 0 12 12">
                <line x1="0" y1="6" x2="12" y2="6" stroke="currentColor" strokeWidth=".5" strokeDasharray=".6 1.6" opacity=".7" />
              </svg>
            </span>
          </span>

          <div
            className="held-question__voices-grid"
            role="group"
            aria-label="The three voices — click or use arrow keys to bring a voice forward"
          >
            {PLATES.map((plate, i) => {
              const isActive = voice === plate.voice
              const isHover = hoverVoice === plate.voice
              const cellStyle = { '--hq-cell-tone': plate.tone } as CSSProperties
              return (
                <button
                  key={plate.voice}
                  id={`hq-voice-${plate.voice}-${baseId}`}
                  type="button"
                  className={`held-question__voice held-question__voice--${plate.voice} ${isActive ? 'is-active' : ''} ${isHover ? 'is-hover' : ''}`}
                  style={cellStyle}
                  onClick={() => onVoice(plate.voice)}
                  onKeyDown={event => onKey(event, plate.voice)}
                  onMouseEnter={() => setHoverVoice(plate.voice)}
                  onMouseLeave={() => setHoverVoice(prev => (prev === plate.voice ? null : prev))}
                  onFocus={() => setHoverVoice(plate.voice)}
                  onBlur={() => setHoverVoice(prev => (prev === plate.voice ? null : prev))}
                  aria-pressed={isActive}
                  aria-label={`${plate.letter} · ${plate.name} · ${plate.face}. ${plate.note}. Mark: ${plate.markLabel}. Click to bring forward.`}
                >
                  <span className="held-question__voice-letter" aria-hidden="true">
                    <svg viewBox="0 0 22 22">
                      <circle cx="11" cy="11" r="9.2" fill="none" stroke="currentColor" strokeWidth=".55" opacity={isActive ? '1' : '.55'} />
                      <circle cx="11" cy="11" r="6.2" fill="none" stroke="currentColor" strokeWidth=".32" strokeDasharray=".6 1.4" opacity={isActive ? '.7' : '.4'} />
                      <text
                        x="11"
                        y="14.5"
                        textAnchor="middle"
                        fontFamily="'Iowan Old Style', 'Palatino Linotype', Georgia, serif"
                        fontStyle="italic"
                        fontSize="11"
                        fontWeight="500"
                        fill="currentColor"
                      >
                        {plate.letter}
                      </text>
                    </svg>
                  </span>

                  <span className="held-question__voice-stack">
                    <em className="held-question__voice-name">{plate.name}</em>
                    <span className="held-question__voice-face">{plate.face}</span>
                  </span>

                  <span
                    className="held-question__voice-sample"
                    style={{
                      fontFamily: plate.family,
                      fontStyle: plate.style,
                      fontWeight: plate.weight,
                      letterSpacing: plate.tracking,
                      textTransform: plate.uppercased ? 'uppercase' : 'none',
                    }}
                    aria-hidden="true"
                  >
                    {plate.line}
                  </span>

                  <span className="held-question__voice-mark" aria-hidden="true">
                    <span className="held-question__voice-mark-glyph">{plate.glyph}</span>
                    <em>{plate.markLabel}</em>
                  </span>

                  {i < PLATES.length - 1 && (
                    <span className="held-question__voice-cord" aria-hidden="true">
                      <svg viewBox="0 0 22 6" preserveAspectRatio="none">
                        <line x1="0" y1="3" x2="22" y2="3" stroke="currentColor" strokeWidth=".4" strokeDasharray=".6 1.4" opacity=".55" />
                        <circle cx="11" cy="3" r=".8" fill="currentColor" opacity=".7" />
                      </svg>
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          <span className="held-question__voices-foot" aria-hidden="true">
            <span className="held-question__voices-foot-rule" />
            <em className="held-question__voices-foot-key">now in</em>
            <span className="held-question__voices-foot-val">
              <em>{active.letter}</em>
              <span aria-hidden="true">·</span>
              <em>{active.name}</em>
              <span aria-hidden="true">·</span>
              <em>{active.markLabel}</em>
            </span>
            <span className="held-question__voices-foot-rule" />
          </span>
        </figcaption>

        <span className="held-question__plate-watermark" aria-hidden="true">
          <svg viewBox="0 0 280 22" preserveAspectRatio="none">
            <text
              x="140"
              y="17"
              textAnchor="middle"
              fontFamily="ui-monospace, 'SFMono-Regular', Menlo, monospace"
              fontSize="8.5"
              letterSpacing="3.2"
              fill="currentColor"
              opacity=".5"
            >
              m³ · folio iv½ · one plate · three faces · the question held
            </text>
          </svg>
        </span>

        <span className="held-question__plate-register" aria-hidden="true">
          <svg viewBox="0 0 28 28">
            <circle cx="14" cy="14" r="12" fill="none" stroke="currentColor" strokeWidth=".4" opacity=".65" />
            <line x1="14" y1="0" x2="14" y2="28" stroke="currentColor" strokeWidth=".35" opacity=".5" />
            <line x1="0" y1="14" x2="28" y2="14" stroke="currentColor" strokeWidth=".35" opacity=".5" />
            <circle cx="14" cy="14" r="1.6" fill="currentColor" />
          </svg>
        </span>

        <span className="held-question__seal" aria-hidden="true">
          <svg viewBox="0 0 92 92">
            <circle cx="46" cy="46" r="44" fill={`url(#${sealGlowId})`} />
            <circle cx="46" cy="46" r="40" fill={`url(#${sealFillId})`} stroke="currentColor" strokeWidth=".85" strokeOpacity=".7" />
            <circle cx="46" cy="46" r="36" fill="none" stroke="currentColor" strokeWidth=".4" strokeDasharray="1 2.4" opacity=".55" />
            <text
              x="46"
              y="30"
              textAnchor="middle"
              fontFamily="ui-monospace, 'SFMono-Regular', Menlo, monospace"
              fontSize="5.5"
              letterSpacing="2.4"
              fill="rgba(8, 10, 18, 0.92)"
            >
              HELD · ONCE
            </text>
            <text
              x="46"
              y="56"
              textAnchor="middle"
              fontFamily="'Iowan Old Style', 'Palatino Linotype', Georgia, serif"
              fontStyle="italic"
              fontSize="13"
              fill="rgba(8, 10, 18, 0.92)"
            >
              {active.letter}
            </text>
            <text
              x="46"
              y="72"
              textAnchor="middle"
              fontFamily="ui-monospace, 'SFMono-Regular', Menlo, monospace"
              fontSize="4"
              letterSpacing="2"
              fill="rgba(8, 10, 18, 0.92)"
            >
              FOLIO · IV½
            </text>
            <circle cx="46" cy="10" r="1.1" fill="rgba(8, 10, 18, 0.85)" />
            <circle cx="46" cy="82" r="1.1" fill="rgba(8, 10, 18, 0.85)" />
            <circle cx="10" cy="46" r="1.1" fill="rgba(8, 10, 18, 0.85)" />
            <circle cx="82" cy="46" r="1.1" fill="rgba(8, 10, 18, 0.85)" />
          </svg>
        </span>
      </figure>

      <footer className="held-question__foot" aria-hidden="true">
        <span className="held-question__foot-rule" />
        <span className="held-question__foot-meta">
          <em className="held-question__foot-cell">
            <span className="held-question__foot-key">read in</span>
            <span className="held-question__foot-word">folio iv½</span>
          </em>
          <span className="held-question__foot-dot">·</span>
          <em className="held-question__foot-cell">
            <span className="held-question__foot-key">the page</span>
            <span className="held-question__foot-word">listens, then answers</span>
          </em>
          <span className="held-question__foot-dot">·</span>
          <em className="held-question__foot-cell">
            <span className="held-question__foot-key">set on</span>
            <span className="held-question__foot-word">{setToday}</span>
          </em>
        </span>
        <span className="held-question__foot-rule" />
      </footer>

      <span className="sr-only">
        The held question · one plate · three faces · the question, set once in {active.name} ({active.face}). The page holds the question before it answers — {HELD_LINE}. Now in {active.name}.
      </span>
    </section>
  )
}
