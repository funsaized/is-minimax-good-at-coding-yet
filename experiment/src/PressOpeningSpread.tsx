import { useEffect, useId, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react'
import type { VoiceId } from './Press'
import { PressStamp } from './PressStamp'

type PressOpeningSpreadProps = {
  voice: VoiceId
  setToday: string
}

const VOICE_ORDER: VoiceId[] = ['quiet', 'human', 'bold']

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

const VOICE_LETTER: Record<VoiceId, string> = { quiet: 'A', human: 'B', bold: 'C' }

const VOICE_GLYPH: Record<VoiceId, string> = { quiet: 'a', human: 'b', bold: 'c' }

const VOICE_FACE: Record<VoiceId, { family: string; weight: number; style: 'italic' | 'normal'; tracking: string; sample: string; uppercased: boolean; size: number }> = {
  quiet: {
    family: "'Iowan Old Style', 'Palatino Linotype', Georgia, serif",
    weight: 400,
    style: 'italic',
    tracking: '-.025em',
    sample: 'is m³ good at frontend yet?',
    uppercased: false,
    size: 0.78,
  },
  human: {
    family: "'Iowan Old Style', 'Palatino Linotype', Georgia, serif",
    weight: 500,
    style: 'italic',
    tracking: '-.02em',
    sample: 'is M3 good at frontend yet?',
    uppercased: false,
    size: 0.86,
  },
  bold: {
    family: 'Inter, ui-sans-serif, system-ui, -apple-system, sans-serif',
    weight: 900,
    style: 'normal',
    tracking: '-.045em',
    sample: 'IS M³ GOOD AT FRONTEND YET?',
    uppercased: true,
    size: 1.0,
  },
}

const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec']
const MONTHS_FULL = [
  'january', 'february', 'march', 'april', 'may', 'june',
  'july', 'august', 'september', 'october', 'november', 'december',
]
const HOURS = ['twelve', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven']
const ORDINALS = [
  'first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth',
  'tenth', 'eleventh', 'twelfth', 'thirteenth', 'fourteenth', 'fifteenth', 'sixteenth',
  'seventeenth', 'eighteenth', 'nineteenth', 'twentieth', 'twenty-first', 'twenty-second',
  'twenty-third', 'twenty-fourth', 'twenty-fifth', 'twenty-sixth', 'twenty-seventh',
  'twenty-eighth', 'twenty-ninth', 'thirtieth', 'thirty-first',
]
const WEEKDAYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']

function seasonOf(month: number) {
  if (month <= 1 || month === 11) return 'winter'
  if (month <= 4) return 'spring'
  if (month <= 7) return 'summer'
  return 'autumn'
}

function atmosphereOf(hour: number) {
  if (hour < 5) return 'small hours'
  if (hour < 8) return 'early'
  if (hour < 11) return 'morning'
  if (hour < 14) return 'midday'
  if (hour < 18) return 'afternoon'
  if (hour < 21) return 'evening'
  return 'late'
}

const FOLIO_LIST: { index: string; label: string; hint: string }[] = [
  { index: 'i', label: 'the question', hint: 'one line, set three ways' },
  { index: 'ii', label: 'the press bed', hint: 'a lever · a stick · a pulled impression' },
  { index: 'iii', label: 'this page, listed', hint: 'the press log · folio contents' },
  { index: 'iii·', label: 'the day sheet', hint: 'the hour · the week · the day’s record' },
  { index: 'iv', label: 'the second proof', hint: 'marks on the words worth keeping' },
  { index: 'v', label: 'three pressings', hint: 'the question set three ways' },
  { index: 'vi', label: 'the marginalia', hint: 'three things worth keeping' },
  { index: 'viii', label: 'the answer', hint: 'folded once · folded back' },
]

export function PressOpeningSpread({ voice, setToday }: PressOpeningSpreadProps) {
  const baseId = useId().replace(/:/g, '')
  const grainId = `press-opening-grain-${baseId}`
  const ruleGrainId = `press-opening-rule-grain-${baseId}`
  const rootRef = useRef<HTMLDivElement>(null)
  const [revealed, setRevealed] = useState(false)
  const [stampKey, setStampKey] = useState(0)
  const toneStyle = {
    '--pos-tone': VOICE_TONE[voice],
    '--pos-tone-quiet': 'var(--blue)',
    '--pos-tone-human': 'var(--coral)',
    '--pos-tone-bold': 'var(--acid)',
  } as CSSProperties

  useEffect(() => {
    const node = rootRef.current
    if (!node) {
      setRevealed(true)
      return
    }
    if (!('IntersectionObserver' in window)) {
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
      { threshold: 0.08, rootMargin: '0px 0px -6% 0px' },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    
    setStampKey(prev => prev + 1)
  }, [voice])

  const now = new Date()
  const monthIndex = now.getMonth()
  const monthShort = MONTHS[monthIndex]
  const monthLong = MONTHS_FULL[monthIndex]
  const day = now.getDate()
  const dayWord = ORDINALS[day - 1] ?? `${day}`
  const weekday = WEEKDAYS[now.getDay()]
  const year = now.getFullYear()
  const hour = now.getHours()
  const hour12 = hour % 12
  const hourWord = HOURS[hour12 === 0 ? 0 : hour12 - 1 + 1] ?? HOURS[0]
  const minute = String(now.getMinutes()).padStart(2, '0')
  const season = seasonOf(monthIndex)
  const atmosphere = atmosphereOf(hour)

  const slugShort = `${monthShort} · ${String(day).padStart(2, '0')} · ${String(year).slice(-2)}`
  const slugLong = `${weekday}, ${monthLong} ${dayWord}, ${year} · ${atmosphere} · ${hour === 0 ? 12 : hour > 12 ? hour - 12 : hour}:${minute}`

  const onVoiceKey = (event: KeyboardEvent<HTMLButtonElement>, id: VoiceId) => {
    const idx = VOICE_ORDER.indexOf(id)
    let next = idx
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (idx + 1) % VOICE_ORDER.length
    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (idx - 1 + VOICE_ORDER.length) % VOICE_ORDER.length
    if (event.key === 'Home') next = 0
    if (event.key === 'End') next = VOICE_ORDER.length - 1
    if (next === idx) return
    event.preventDefault()
    const nextVoice = VOICE_ORDER[next]
    
    setStampKey(prev => prev + 1)
    const target = event.currentTarget.parentElement?.querySelector<HTMLButtonElement>(
      `[data-pos-voice="${nextVoice}"]`,
    )
    target?.focus()
  }

  const onVoice = (id: VoiceId) => {
    
    setStampKey(prev => prev + 1)
  }

  return (
    <div
      ref={rootRef}
      className={`press-opening press-opening--${voice} ${revealed ? 'is-revealed' : ''}`}
      style={toneStyle}
      aria-label={`m³ press · folio 0 · the opening spread · set on ${slugLong} in ${VOICE_NAME[voice]}.`}
    >
      <svg className="press-opening__defs" viewBox="0 0 1200 1200" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <filter id={grainId} x="-2%" y="-2%" width="104%" height="104%">
            <feTurbulence type="fractalNoise" baseFrequency="0.84" numOctaves="2" seed="41" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 .14  0 0 0 0 .12  0 0 0 0 .19  0 0 0 .035 0" />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
          <filter id={ruleGrainId} x="-2%" y="-50%" width="104%" height="200%">
            <feTurbulence type="fractalNoise" baseFrequency="2.4" numOctaves="2" seed="47" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .55 0" />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
        </defs>
      </svg>

      <span className="press-opening__paper" aria-hidden="true">
        <svg viewBox="0 0 1200 600" preserveAspectRatio="none">
          <rect x="0" y="0" width="1200" height="600" filter={`url(#${grainId})`} opacity=".045" />
        </svg>
      </span>

      <header className="press-opening__slug" aria-label={`Set on ${slugLong}`}>
        <span className="press-opening__slug-edge press-opening__slug-edge--lead" aria-hidden="true">
          <svg viewBox="0 0 80 12" preserveAspectRatio="none">
            <g filter={`url(#${ruleGrainId})`}>
              <path
                className="press-opening__slug-stroke press-opening__slug-stroke--lead"
                d="M2 6c12-2 24 2 36 0s24-2 36 0 6 2 6 0"
                fill="none"
                stroke="currentColor"
                strokeWidth=".6"
                strokeLinecap="round"
                pathLength="100"
                strokeDasharray="100 100"
              />
            </g>
            <circle cx="2" cy="6" r=".9" fill="currentColor" opacity=".7" />
            <circle cx="78" cy="6" r=".9" fill="currentColor" opacity=".7" />
          </svg>
        </span>
        <span className="press-opening__slug-stack">
          <span className="press-opening__slug-line press-opening__slug-line--top">
            <span className="press-opening__slug-key">set on</span>
            <em className="press-opening__slug-today">{slugShort}</em>
          </span>
          <span className="press-opening__slug-line press-opening__slug-line--mid">
            <span className="press-opening__slug-rule" aria-hidden="true" />
            <span className="press-opening__slug-mark" aria-hidden="true">¶</span>
            <em className="press-opening__slug-long">{slugLong}</em>
            <span className="press-opening__slug-mark" aria-hidden="true">¶</span>
            <span className="press-opening__slug-rule" aria-hidden="true" />
          </span>
          <span className="press-opening__slug-line press-opening__slug-line--bot">
            <span className="press-opening__slug-tag">{season}</span>
            <span className="press-opening__slug-sep" aria-hidden="true">·</span>
            <span className="press-opening__slug-tag press-opening__slug-tag--alt">{atmosphere}</span>
            <span className="press-opening__slug-sep" aria-hidden="true">·</span>
            <span className="press-opening__slug-tag">m³ press · folio 0</span>
          </span>
        </span>
        <span className="press-opening__slug-edge press-opening__slug-edge--trail" aria-hidden="true">
          <svg viewBox="0 0 80 12" preserveAspectRatio="none">
            <g filter={`url(#${ruleGrainId})`}>
              <path
                className="press-opening__slug-stroke press-opening__slug-stroke--trail"
                d="M2 6c6-2 14 2 24 0s18-2 24 0 22 2 24 0"
                fill="none"
                stroke="currentColor"
                strokeWidth=".55"
                strokeLinecap="round"
                opacity=".7"
                pathLength="100"
                strokeDasharray="100 100"
              />
            </g>
            <circle cx="2" cy="6" r=".9" fill="currentColor" opacity=".6" />
            <circle cx="78" cy="6" r=".9" fill="currentColor" opacity=".6" />
          </svg>
        </span>
      </header>

      <section className="press-opening__type-line" aria-label="Three pressings of one question, set in three voices">
        <span className="press-opening__type-line-key" aria-hidden="true">
          <span className="press-opening__type-line-key-mark" />
          <em>three pressings</em>
          <span className="press-opening__type-line-key-rule" aria-hidden="true" />
          <span className="press-opening__type-line-key-meta">folio 0 · a single line, set three ways</span>
        </span>
        <span className="press-opening__type-line-frame" aria-hidden="true">
          <span className="press-opening__type-line-corner press-opening__type-line-corner--tl" />
          <span className="press-opening__type-line-corner press-opening__type-line-corner--tr" />
          <span className="press-opening__type-line-corner press-opening__type-line-corner--bl" />
          <span className="press-opening__type-line-corner press-opening__type-line-corner--br" />
          <span className="press-opening__type-line-bed">
            <svg viewBox="0 0 1200 200" preserveAspectRatio="none">
              <line x1="0" y1="22" x2="1200" y2="22" stroke="currentColor" strokeWidth=".35" opacity=".5" />
              <line x1="0" y1="178" x2="1200" y2="178" stroke="currentColor" strokeWidth=".35" opacity=".5" />
            </svg>
          </span>
        </span>
        <div className="press-opening__specimens" role="group" aria-label="Three voices of the question">
          {VOICE_ORDER.map(v => {
            const face = VOICE_FACE[v]
            const isActive = v === voice
            return (
              <button
                key={`pos-voice-${v}`}
                data-pos-voice={v}
                type="button"
                className={`press-opening__specimen press-opening__specimen--${v} ${isActive ? 'is-active' : ''}`}
                onClick={() => onVoice(v)}
                onKeyDown={event => onVoiceKey(event, v)}
                aria-pressed={isActive}
                aria-label={`Preview the question set in the ${VOICE_NAME[v]} voice.`}
              >
                <span className="press-opening__specimen-head" aria-hidden="true">
                  <span className="press-opening__specimen-letter">{VOICE_LETTER[v]}</span>
                  <span className="press-opening__specimen-name">{VOICE_NAME[v]}</span>
                  <span className="press-opening__specimen-pip">
                    <span className="press-opening__specimen-pip-ring" />
                    <span className="press-opening__specimen-pip-bead" />
                  </span>
                </span>
                <span
                  className="press-opening__specimen-line"
                  style={{
                    fontFamily: face.family,
                    fontWeight: face.weight,
                    fontStyle: face.style,
                    letterSpacing: face.tracking,
                    fontSize: `calc(clamp(17px, 2.6vw, 36px) * ${face.size})`,
                  }}
                >
                  {face.sample}
                </span>
                <span className="press-opening__specimen-foot" aria-hidden="true">
                  <span className="press-opening__specimen-foot-mark" />
                  <em>{v === 'quiet' ? 'close set' : v === 'human' ? 'a hand, learning its warmth' : 'no apology'}</em>
                  <span className="press-opening__specimen-foot-mark" />
                </span>
              </button>
            )
          })}
        </div>
      </section>

      <aside className="press-opening__press" aria-label="The press signature">
        <span className="press-opening__press-key" aria-hidden="true">
          <span className="press-opening__press-key-rule" />
          <em>press signature</em>
          <span className="press-opening__press-key-mark">¶</span>
          <em>folio 0</em>
          <span className="press-opening__press-key-rule press-opening__press-key-rule--alt" />
        </span>
        <div className="press-opening__press-disc" aria-hidden="true">
          <span className="press-opening__press-disc-halo" />
          <span className="press-opening__press-disc-stamp" key={`press-opening-stamp-${stampKey}`}>
            <PressStamp voice={voice} size={132} />
          </span>
          <span className="press-opening__press-disc-wax">
            <span className="press-opening__press-disc-wax-bead" />
            <span className="press-opening__press-disc-wax-wisp" />
          </span>
        </div>
        <ul className="press-opening__press-list" aria-label="Voice ledger">
          {VOICE_ORDER.map(v => (
            <li
              key={`pos-press-list-${v}`}
              className={`press-opening__press-item press-opening__press-item--${v} ${v === voice ? 'is-on' : ''}`}
            >
              <span className="press-opening__press-item-letter" aria-hidden="true">{VOICE_LETTER[v]}</span>
              <span className="press-opening__press-item-name">{VOICE_NAME[v]}</span>
              <span className="press-opening__press-item-glyph" aria-hidden="true">{VOICE_GLYPH[v]}</span>
            </li>
          ))}
        </ul>
        <p className="press-opening__press-motto" aria-hidden="true">
          <em>{voice === 'quiet' ? 'a quiet line is a careful line' : voice === 'human' ? 'a small wobble — the hand learning its warmth' : 'say the whole thing once, no apology'}</em>
        </p>
      </aside>

      <aside className="press-opening__toc" aria-label="A short folio index">
        <header className="press-opening__toc-head">
          <span className="press-opening__toc-key" aria-hidden="true">
            <span className="press-opening__toc-key-mark" />
            <em>folio index</em>
          </span>
          <span className="press-opening__toc-meta" aria-hidden="true">
            <span className="press-opening__toc-bead" />
            {FOLIO_LIST.length}
            <span className="press-opening__toc-meta-tag">folios</span>
          </span>
        </header>
        <ol className="press-opening__toc-list">
          {FOLIO_LIST.map(folio => (
            <li key={`pos-toc-${folio.index}`} className="press-opening__toc-item">
              <a className="press-opening__toc-link" href={`#${folio.index === 'iii·' ? 'day' : folio.index === 'iv' ? 'proof' : folio.index === 'v' ? 'pressings' : folio.index === 'vi' ? 'notes' : folio.index === 'viii' ? 'answer' : folio.index === 'ii' ? 'press' : 'question'}`}>
                <span className="press-opening__toc-num" aria-hidden="true">{folio.index}</span>
                <span className="press-opening__toc-rule" aria-hidden="true" />
                <span className="press-opening__toc-stack">
                  <span className="press-opening__toc-label">{folio.label}</span>
                  <span className="press-opening__toc-hint">{folio.hint}</span>
                </span>
                <span className="press-opening__toc-tick" aria-hidden="true" />
              </a>
            </li>
          ))}
        </ol>
      </aside>

      <span className="press-opening__descent" aria-hidden="true">
        <span className="press-opening__descent-tag">
          <span className="press-opening__descent-tag-rule" />
          <em>the opening, exhaling toward folio i</em>
          <span className="press-opening__descent-tag-rule press-opening__descent-tag-rule--alt" />
        </span>
        <svg className="press-opening__descent-svg" viewBox="0 0 20 110" preserveAspectRatio="none">
          <g filter={`url(#${ruleGrainId})`}>
            <path
              className="press-opening__descent-stroke press-opening__descent-stroke--lead"
              d="M10 2c1.2 16-2 32 0 50s-1.6 30 0 50"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.1"
              strokeLinecap="round"
              pathLength="100"
              strokeDasharray="100 100"
            />
            <path
              className="press-opening__descent-stroke press-opening__descent-stroke--trail"
              d="M13 4c.6 14-1 24 .2 38s-1 22 .6 32"
              fill="none"
              stroke="currentColor"
              strokeWidth=".5"
              strokeLinecap="round"
              opacity=".5"
              pathLength="100"
              strokeDasharray="100 100"
            />
          </g>
          <circle className="press-opening__descent-bead" cx="10.2" cy="106" r="2.1" fill="currentColor" />
          <circle className="press-opening__descent-halo" cx="10.2" cy="106" r="5" fill="none" stroke="currentColor" strokeWidth=".3" strokeDasharray=".8 1.6" opacity=".6" />
        </svg>
      </span>

      <footer className="press-opening__foot" aria-hidden="true">
        <span className="press-opening__foot-rule" />
        <span className="press-opening__foot-key">folio 0 · the opening spread</span>
        <span className="press-opening__foot-bead" />
        <span className="press-opening__foot-voice">set in <em>{VOICE_NAME[voice]}</em></span>
        <span className="press-opening__foot-bead" />
        <span className="press-opening__foot-date">opened at <em>{slugShort}</em></span>
        <span className="press-opening__foot-rule press-opening__foot-rule--alt" />
      </footer>

      <span className="sr-only" aria-live="polite">{`Opening spread revealed. Set on ${slugShort}. Voice now ${VOICE_NAME[voice]}.`}</span>
    </div>
  )
}
