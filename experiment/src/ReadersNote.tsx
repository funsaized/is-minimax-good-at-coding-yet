import { useEffect, useId, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react'
import type { VoiceId } from './Press'
import type { WordId } from './notes'

type ReadersNoteProps = {
  voice: VoiceId
  word: WordId
  hover: WordId | null
  setToday: string
  onVoice: (voice: VoiceId) => void
  onWord: (word: WordId, focus?: boolean) => void
  onHover: (word: WordId | null) => void
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

const VOICE_LETTER: Record<VoiceId, string> = { quiet: 'A', human: 'B', bold: 'C' }

const VOICE_FACE: Record<VoiceId, string> = {
  quiet: 'serif · italic · close set',
  human: 'serif · italic · a little warm',
  bold: 'sans · heavy · no apology',
}

const VOICE_ORDER: VoiceId[] = ['quiet', 'human', 'bold']

const WORD_ORDER: WordId[] = ['m3', 'good', 'yet']

const WORD_KIND: Record<WordId, string> = { m3: 'stet', good: 'caret', yet: 'query' }
const WORD_LABEL: Record<WordId, string> = { m3: 'M3', good: 'good at', yet: 'yet?' }
const WORD_GLOSS: Record<WordId, string> = { m3: 'let it stand', good: 'make room', yet: 'protect the pause' }
const WORD_GLYPH: Record<WordId, string> = { m3: '⌇', good: '∧', yet: '⌇' }

const SEASON = (() => {
  const month = new Date().getMonth()
  if (month <= 1 || month === 11) return 'winter'
  if (month <= 4) return 'spring'
  if (month <= 7) return 'summer'
  return 'autumn'
})()

export function ReadersNote({
  voice,
  word,
  hover,
  setToday,
  onVoice,
  onWord,
  onHover,
}: ReadersNoteProps) {
  const baseId = useId().replace(/:/g, '')
  const grainId = `readers-note-grain-${baseId}`
  const ruleGrainId = `readers-note-rule-grain-${baseId}`
  const rootRef = useRef<HTMLElement>(null)
  const [revealed, setRevealed] = useState(false)
  const tone = VOICE_TONE[voice]

  const style = {
    '--rn-tone': tone,
    '--rn-tone-quiet': 'var(--blue)',
    '--rn-tone-human': 'var(--coral)',
    '--rn-tone-bold': 'var(--acid)',
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

  const onWordKey = (event: KeyboardEvent<HTMLButtonElement>, id: WordId) => {
    const idx = WORD_ORDER.indexOf(id)
    const focus = (next: WordId) => {
      onWord(next)
      window.requestAnimationFrame(() => {
        const el = rootRef.current?.querySelector<HTMLButtonElement>(`[data-rn-word="${next}"]`)
        el?.focus()
      })
    }
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault()
      focus(WORD_ORDER[(idx + 1) % WORD_ORDER.length])
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault()
      focus(WORD_ORDER[(idx - 1 + WORD_ORDER.length) % WORD_ORDER.length])
    } else if (event.key === 'Home') {
      event.preventDefault()
      focus('m3')
    } else if (event.key === 'End') {
      event.preventDefault()
      focus('yet')
    }
  }

  const onVoiceKey = (event: KeyboardEvent<HTMLButtonElement>, id: VoiceId) => {
    const idx = VOICE_ORDER.indexOf(id)
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault()
      onVoice(VOICE_ORDER[(idx + 1) % VOICE_ORDER.length])
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault()
      onVoice(VOICE_ORDER[(idx - 1 + VOICE_ORDER.length) % VOICE_ORDER.length])
    } else if (event.key === 'Home') {
      event.preventDefault()
      onVoice('quiet')
    } else if (event.key === 'End') {
      event.preventDefault()
      onVoice('bold')
    }
  }

  return (
    <article
      ref={rootRef}
      className={`rn rn--${voice} rn--word-${word} ${revealed ? 'is-revealed' : ''}`}
      style={style}
      aria-label={`The reader's note · front matter · folio i· · the question, three marked words, three voices · set in ${VOICE_NAME[voice]} · marked at ${WORD_LABEL[word]} (${WORD_KIND[word]}) · set today ${setToday} · ${SEASON}.`}
    >
      <svg className="rn__defs" viewBox="0 0 1200 600" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <filter id={grainId} x="-2%" y="-2%" width="104%" height="104%">
            <feTurbulence type="fractalNoise" baseFrequency="0.84" numOctaves="2" seed="53" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 .14  0 0 0 0 .12  0 0 0 0 .19  0 0 0 .04 0" />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
          <filter id={ruleGrainId} x="-2%" y="-50%" width="104%" height="200%">
            <feTurbulence type="fractalNoise" baseFrequency="2.4" numOctaves="2" seed="59" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .42 0" />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
        </defs>
      </svg>

      <header className="rn__head">
        <p className="rn__eyebrow">
          <span className="rn__eyebrow-mark" aria-hidden="true" />
          <span className="rn__eyebrow-key">folio <em>i·</em></span>
          <span className="rn__eyebrow-sep">·</span>
          <span className="rn__eyebrow-key">the reader's note</span>
          <span className="rn__eyebrow-sep">·</span>
          <span className="rn__eyebrow-key">{SEASON}</span>
          <span className="rn__eyebrow-rule" aria-hidden="true">
            <svg viewBox="0 0 200 4" preserveAspectRatio="none">
              <g filter={`url(#${ruleGrainId})`}>
                <path
                  d="M2 2c24-2 48 2 72 0s48-2 72 0 50 2 50 0"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth=".5"
                  strokeLinecap="round"
                  pathLength="100"
                  className="rn__eyebrow-rule-stroke"
                />
              </g>
              <circle cx="198" cy="2" r=".9" fill="currentColor" />
            </svg>
          </span>
          <span className="rn__eyebrow-key rn__eyebrow-key--date">set <em>today</em></span>
          <span className="rn__eyebrow-date">{setToday}</span>
        </p>
      </header>

      <div className="rn__lead">
        <span className="rn__lead-mark" aria-hidden="true">¶</span>
        <h2 className="rn__lead-title">
          The title answers in the voice you pull, and reads back the word you mark.
        </h2>
        <span className="rn__lead-mark rn__lead-mark--alt" aria-hidden="true">¶</span>
      </div>

      <div className="rn__plate" aria-hidden="true">
        <span className="rn__plate-corner rn__plate-corner--tl" />
        <span className="rn__plate-corner rn__plate-corner--tr" />
        <span className="rn__plate-corner rn__plate-corner--bl" />
        <span className="rn__plate-corner rn__plate-corner--br" />
      </div>

      <div className="rn__rows">
        <section className="rn__row rn__row--words" aria-labelledby="rn-words-eyebrow">
          <header className="rn__row-head">
            <span className="rn__row-rule rn__row-rule--lead" aria-hidden="true" />
            <span className="rn__row-tag">
              <span className="rn__row-tag-dot" aria-hidden="true" />
              <em id="rn-words-eyebrow">three marked words</em>
              <span className="rn__row-tag-key">a marginalium</span>
              <span className="rn__row-tag-dot rn__row-tag-dot--alt" aria-hidden="true" />
            </span>
            <span className="rn__row-rule rn__row-rule--trail" aria-hidden="true" />
          </header>
          <ol className="rn__words" role="group" aria-label="Mark a word of the title">
            {WORD_ORDER.map((id, idx) => {
              const isActive = word === id
              const isHover = hover === id
              const mark = WORD_KIND[id]
              return (
                <li key={id} className={`rn__word-cell rn__word-cell--${id}`}>
                  <button
                    type="button"
                    data-rn-word={id}
                    className={`rn__word ${isActive ? 'is-active' : ''} ${isHover ? 'is-hover' : ''}`}
                    onClick={() => onWord(id)}
                    onMouseEnter={() => onHover(id)}
                    onMouseLeave={() => onHover(null)}
                    onFocus={() => onHover(id)}
                    onBlur={() => onHover(null)}
                    onKeyDown={event => onWordKey(event, id)}
                    aria-pressed={isActive}
                    aria-label={`Mark the word ${WORD_LABEL[id]} · ${mark} · ${WORD_GLOSS[id]}.`}
                  >
                    <span className="rn__word-mark" aria-hidden="true">{mark}</span>
                    <span className="rn__word-glyph" aria-hidden="true">{WORD_GLYPH[id]}</span>
                    <span className="rn__word-label">{WORD_LABEL[id]}</span>
                    <span className="rn__word-gloss">{WORD_GLOSS[id]}</span>
                    <span className="rn__word-rule" aria-hidden="true">
                      <svg viewBox="0 0 80 8" preserveAspectRatio="none">
                        <path
                          d="M2 4c10-3 20 3 30 0s20-3 30 0 14 1 16 0"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth=".75"
                          strokeLinecap="round"
                          pathLength="100"
                          className="rn__word-rule-stroke"
                        />
                        <circle cx="78" cy="4" r="1.2" fill="currentColor" />
                      </svg>
                    </span>
                  </button>
                  {idx < WORD_ORDER.length - 1 && <span className="rn__word-sep" aria-hidden="true">·</span>}
                </li>
              )
            })}
          </ol>
        </section>

        <section className="rn__row rn__row--voices" aria-labelledby="rn-voices-eyebrow">
          <header className="rn__row-head">
            <span className="rn__row-rule rn__row-rule--lead" aria-hidden="true" />
            <span className="rn__row-tag">
              <span className="rn__row-tag-dot" aria-hidden="true" />
              <em id="rn-voices-eyebrow">three voices</em>
              <span className="rn__row-tag-key">one question</span>
              <span className="rn__row-tag-dot rn__row-tag-dot--alt" aria-hidden="true" />
            </span>
            <span className="rn__row-rule rn__row-rule--trail" aria-hidden="true" />
          </header>
          <div className="rn__voices" role="group" aria-label="Voice selector · three settings for the title">
            <span
              className="rn__voice-wax"
              aria-hidden="true"
              style={{ left: `calc((100% / 3) * (${VOICE_ORDER.indexOf(voice)} + 0.5))` }}
            >
              <span className="rn__voice-wax-bead" />
            </span>
            {VOICE_ORDER.map(v => {
              const isActive = v === voice
              return (
                <button
                  key={`rn-voice-${v}`}
                  type="button"
                  className={`rn__voice rn__voice--${v} ${isActive ? 'is-active' : ''}`}
                  onClick={() => onVoice(v)}
                  onKeyDown={event => onVoiceKey(event, v)}
                  aria-pressed={isActive}
                  tabIndex={isActive ? 0 : -1}
                  aria-label={`Set the title in the ${VOICE_NAME[v]} voice.`}
                >
                  <span className="rn__voice-letter" aria-hidden="true">{VOICE_LETTER[v]}</span>
                  <span className="rn__voice-stack">
                    <span className="rn__voice-name">{VOICE_NAME[v]}</span>
                    <span className="rn__voice-face">{VOICE_FACE[v]}</span>
                  </span>
                  <span className="rn__voice-pip" aria-hidden="true">
                    <span className="rn__voice-pip-ring" />
                    <span className="rn__voice-pip-bead" />
                  </span>
                </button>
              )
            })}
          </div>
          <p className="rn__voices-hint" aria-hidden="true">
            <kbd>shift</kbd><span aria-hidden="true">+</span><kbd>v</kbd>
            <span className="rn__voices-hint-tag">cycles through the three voices</span>
          </p>
        </section>
      </div>

      <figure className="rn__pull">
        <span className="rn__pull-rule rn__pull-rule--lead" aria-hidden="true">
          <svg viewBox="0 0 220 6" preserveAspectRatio="none">
            <g filter={`url(#${ruleGrainId})`}>
              <path
                d="M2 3c14-3 28 3 42 0s28-3 42 0 28 3 42 0 28-3 42 0 28 3 36 0"
                fill="none"
                stroke="currentColor"
                strokeWidth=".55"
                strokeLinecap="round"
                pathLength="100"
                className="rn__pull-rule-stroke rn__pull-rule-stroke--lead"
              />
            </g>
          </svg>
        </span>
        <blockquote className="rn__pull-body">
          <span className="rn__pull-quote" aria-hidden="true">“</span>
          <em>attention, not ornament.</em>
          <span className="rn__pull-quote rn__pull-quote--alt" aria-hidden="true">”</span>
        </blockquote>
        <figcaption className="rn__pull-note">
          <span className="rn__pull-note-mark" aria-hidden="true" />
          <em>the rest is decoration with a job to do</em>
        </figcaption>
        <span className="rn__pull-rule rn__pull-rule--trail" aria-hidden="true">
          <svg viewBox="0 0 220 6" preserveAspectRatio="none">
            <g filter={`url(#${ruleGrainId})`}>
              <path
                d="M2 3c14-3 28 3 42 0s28-3 42 0 28 3 42 0 28-3 42 0 28 3 36 0"
                fill="none"
                stroke="currentColor"
                strokeWidth=".55"
                strokeLinecap="round"
                pathLength="100"
                className="rn__pull-rule-stroke rn__pull-rule-stroke--trail"
              />
            </g>
          </svg>
        </span>
      </figure>

      <footer className="rn__foot" aria-hidden="true">
        <span className="rn__foot-cell">
          <span className="rn__foot-key">marked at</span>
          <span className="rn__foot-value">
            <em>{WORD_LABEL[word]}</em>
            <span className="rn__foot-mark-tag">{WORD_KIND[word]}</span>
          </span>
        </span>
        <span className="rn__foot-bead" aria-hidden="true">
          <svg viewBox="0 0 8 8"><circle cx="4" cy="4" r="1.4" fill="currentColor" /></svg>
        </span>
        <span className="rn__foot-cell">
          <span className="rn__foot-key">in voice</span>
          <span className="rn__foot-value">
            <em>{VOICE_NAME[voice]}</em>
            <span className="rn__foot-mark-tag">{VOICE_LETTER[voice]}</span>
          </span>
        </span>
        <span className="rn__foot-bead" aria-hidden="true">
          <svg viewBox="0 0 8 8"><circle cx="4" cy="4" r="1.4" fill="currentColor" /></svg>
        </span>
        <span className="rn__foot-cell">
          <span className="rn__foot-key">pulls the lever</span>
          <span className="rn__foot-value"><em>to folio viii</em></span>
        </span>
      </footer>

      <span className="sr-only" aria-live="polite">
        {`Reader's note. Marked at ${WORD_LABEL[word]}, ${WORD_KIND[word]}. Set in ${VOICE_NAME[voice]}. Set today ${setToday}.`}
      </span>
    </article>
  )
}
