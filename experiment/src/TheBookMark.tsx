import {
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react'
import type { VoiceId } from './App'

type TheBookMarkProps = {
  voice: VoiceId
  setToday: string
}

type VoiceLine = {
  voice: VoiceId
  letter: string
  name: string
  line: string
  gloss: string
}

const VOICE_ORDER: VoiceId[] = ['quiet', 'human', 'bold']

const LINES: VoiceLine[] = [
  {
    voice: 'quiet',
    letter: 'a',
    name: 'quiet cut',
    line: 'set the line softly — the reader hears themselves in it.',
    gloss: 'held close · for the next reader',
  },
  {
    voice: 'human',
    letter: 'b',
    name: 'human hand',
    line: 'set it by hand — the page warms, and the line answers back.',
    gloss: 'kept · where the line was written',
  },
  {
    voice: 'bold',
    letter: 'c',
    name: 'bold signal',
    line: 'SAY IT ONCE — IN THE LOUDEST VOICE YOU CAN KEEP HONEST.',
    gloss: 'kept · shouted once, and folded',
  },
]

export function TheBookMark({ voice, setToday }: TheBookMarkProps) {
  const baseId = useId().replace(/:/g, '')
  const gradientId = `bookmark-veil-${baseId}`
  const rootRef = useRef<HTMLElement | null>(null)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mq.matches)
    const onChange = () => setReducedMotion(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!('IntersectionObserver' in window)) {
      setMounted(true)
      return
    }
    const node = rootRef.current
    if (!node) return
    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed')
            observer.disconnect()
          }
        }
      },
      { threshold: 0.18, rootMargin: '0px 0px -8% 0px' },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  const lineRefs = useRef<Partial<Record<VoiceId, HTMLButtonElement | null>>>({})
  const style = {
    '--bookmark-tone': `var(--${voice})`,
  } as CSSProperties

  const onLineKey = (
    event: ReactKeyboardEvent<HTMLButtonElement>,
    target: VoiceId,
  ) => {
    const idx = VOICE_ORDER.indexOf(target)
    let next: VoiceId | null = null
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
      event.preventDefault()
      next = VOICE_ORDER[(idx + 1) % VOICE_ORDER.length]
    } else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
      event.preventDefault()
      next = VOICE_ORDER[(idx - 1 + VOICE_ORDER.length) % VOICE_ORDER.length]
    } else if (event.key === 'Home') {
      event.preventDefault()
      next = VOICE_ORDER[0]
    } else if (event.key === 'End') {
      event.preventDefault()
      next = VOICE_ORDER[VOICE_ORDER.length - 1]
    }
    if (!next) return
    const target_node = lineRefs.current[next]
    if (target_node) {
      target_node.focus({ preventScroll: true })
    }
  }

  const activeIdx = VOICE_ORDER.indexOf(voice)

  return (
    <section
      ref={rootRef}
      className={`the-bookmark the-bookmark--${voice} ${mounted ? 'is-revealed' : ''} ${reducedMotion ? 'is-quiet' : ''}`}
      style={style}
      aria-labelledby={`bookmark-head-${baseId}`}
    >
      <svg className="the-bookmark__defs" viewBox="0 0 600 400" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--bookmark-tone, var(--quiet))" stopOpacity="0" />
            <stop offset="42%" stopColor="var(--bookmark-tone, var(--quiet))" stopOpacity=".14" />
            <stop offset="100%" stopColor="var(--bookmark-tone, var(--quiet))" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      <header className="the-bookmark__head">
        <span className="the-bookmark__eyebrow" aria-hidden="true">
          <span className="the-bookmark__eyebrow-mark">
            <svg viewBox="0 0 16 16" aria-hidden="true">
              <path
                d="M2 2 L8 6 L14 2 L14 14 L2 14 Z"
                fill="none"
                stroke="currentColor"
                strokeWidth=".55"
                strokeLinejoin="round"
                opacity=".78"
              />
              <line x1="2" y1="2" x2="14" y2="2" stroke="currentColor" strokeWidth=".45" opacity=".55" />
            </svg>
          </span>
          <span className="the-bookmark__eyebrow-key">folio</span>
          <span className="the-bookmark__eyebrow-rule" aria-hidden="true" />
          <em className="the-bookmark__eyebrow-idx">vi½</em>
          <span className="the-bookmark__eyebrow-rule" aria-hidden="true" />
          <span className="the-bookmark__eyebrow-key">the bookmark</span>
          <span className="the-bookmark__eyebrow-rule the-bookmark__eyebrow-rule--right" aria-hidden="true" />
          <em className="the-bookmark__eyebrow-date">{setToday}</em>
        </span>
        <h2 id={`bookmark-head-${baseId}`} className="the-bookmark__title">
          the page <em>folds once,</em>
          <br />
          and one line stays with the reader.
        </h2>
        <p className="the-bookmark__lede">
          A bookmark is a small piece of paper that the reader keeps after the broadside is set down.
          Three readings made one plate — choose one line to carry out of the press, and the page
          will remember the choice.
        </p>
      </header>

      <ol className="the-bookmark__lines" role="radiogroup" aria-label="The three readings, kept as a bookmark">
        {LINES.map((line, idx) => {
          const isActive = voice === line.voice
          const order = idx - activeIdx
          const lift = Math.abs(order)
          const lineStyle = {
            '--bm-line-tone': `var(--${line.voice})`,
            '--bm-lift': String(lift),
            '--bm-order': String(order),
          } as CSSProperties
          return (
            <li
              key={line.voice}
              className={`the-bookmark__line ${isActive ? 'is-active' : ''}`}
              style={lineStyle}
            >
              <button
                type="button"
                role="radio"
                aria-checked={isActive}
                ref={node => {
                  lineRefs.current[line.voice] = node
                }}
                onKeyDown={event => onLineKey(event, line.voice)}
                className="the-bookmark__line-btn"
                aria-label={`${line.letter} · ${line.name} · ${line.line}`}
              >
                <span className="the-bookmark__line-head" aria-hidden="true">
                  <span className="the-bookmark__line-letter">{line.letter}</span>
                  <span className="the-bookmark__line-name">{line.name}</span>
                  <span className="the-bookmark__line-tick" />
                </span>
                <span className="the-bookmark__line-text">{line.line}</span>
                <span className="the-bookmark__line-gloss" aria-hidden="true">
                  <span className="the-bookmark__line-gloss-rule" />
                  <em>{line.gloss}</em>
                </span>
              </button>
              {isActive && (
                <span className="the-bookmark__line-pin" aria-hidden="true">
                  <svg viewBox="0 0 18 18">
                    <circle cx="9" cy="9" r="7" fill="currentColor" opacity=".88" />
                    <circle cx="9" cy="9" r="7" fill="none" stroke="var(--night)" strokeWidth=".4" opacity=".7" />
                    <circle cx="9" cy="9" r="2.6" fill="var(--night)" />
                  </svg>
                  <em>kept · with the reader</em>
                </span>
              )}
            </li>
          )
        })}
      </ol>

      <footer className="the-bookmark__foot" aria-hidden="true">
        <span className="the-bookmark__foot-rule" />
        <span className="the-bookmark__foot-row">
          <em className="the-bookmark__foot-key">kept in</em>
          <span className="the-bookmark__foot-word">{LINES.find(l => l.voice === voice)?.name}</span>
          <span className="the-bookmark__foot-dot">·</span>
          <em className="the-bookmark__foot-key">set on</em>
          <em className="the-bookmark__foot-date">{setToday}</em>
          <span className="the-bookmark__foot-dot">·</span>
          <em className="the-bookmark__foot-key">arrow keys</em>
          <span className="the-bookmark__foot-tag">to walk the three</span>
        </span>
        <span className="the-bookmark__foot-rule" />
      </footer>

      <span className="the-bookmark__veil" aria-hidden="true" />

      <span className="the-bookmark__chop" aria-hidden="true">
        <svg viewBox="0 0 90 90">
          <circle cx="45" cy="45" r="42" fill="none" stroke="currentColor" strokeWidth=".5" opacity=".55" strokeDasharray=".8 2" />
          <circle cx="45" cy="45" r="36" fill="none" stroke="currentColor" strokeWidth=".35" opacity=".4" />
          <path d="M22 22 L36 36 L28 50 L42 46 L58 60 L34 64 L30 80 L18 64 Z" fill="none" stroke="currentColor" strokeWidth=".45" strokeLinejoin="round" opacity=".55" />
          <path d="M68 22 L54 36 L62 50 L48 46 L32 60 L56 64 L60 80 L72 64 Z" fill="none" stroke="currentColor" strokeWidth=".45" strokeLinejoin="round" opacity=".55" />
          <circle cx="45" cy="45" r="2.4" fill="currentColor" />
          <circle cx="45" cy="45" r=".9" fill="var(--night)" />
          <text x="45" y="14" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="3.6" letterSpacing="1.4" fill="currentColor" opacity=".7">
            KEPT · CLOSE
          </text>
          <text x="45" y="84" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="3.6" letterSpacing="1.4" fill="currentColor" opacity=".7">
            M³ · FOLIO VI½
          </text>
        </svg>
      </span>
    </section>
  )
}
