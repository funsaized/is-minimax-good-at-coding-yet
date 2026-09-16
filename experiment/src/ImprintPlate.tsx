import { useEffect, useId, useRef, useState, type CSSProperties } from 'react'
import type { VoiceId } from './Press'
import type { WordId } from './notes'

type ImprintPlateProps = {
  voice: VoiceId
  word: WordId
  setToday: string
  readerName: string
}

const VOICE_TONE: Record<VoiceId, string> = {
  quiet: 'var(--blue)',
  human: 'var(--coral)',
  bold: 'var(--acid)',
}
const VOICE_LETTER: Record<VoiceId, string> = { quiet: 'A', human: 'B', bold: 'C' }
const VOICE_NAME: Record<VoiceId, string> = {
  quiet: 'quiet cut',
  human: 'human hand',
  bold: 'bold signal',
}
const VOICE_FACE: Record<VoiceId, string> = {
  quiet: 'serif · italic · close set',
  human: 'serif · italic · a little warm',
  bold: 'display · heavy · no apology',
}

const WORD_LABEL: Record<WordId, string> = { m3: 'm³', good: 'good at', yet: 'yet?' }
const WORD_MARK: Record<WordId, string> = { m3: 'stet', good: 'caret', yet: 'query' }
const WORD_KIND: Record<WordId, string> = {
  m3: 'let it stand',
  good: 'make room',
  yet: 'protect the pause',
}
const WORD_INK: Record<WordId, string> = {
  m3: 'var(--acid)',
  good: 'var(--coral)',
  yet: 'var(--blue)',
}

function pad(n: number) {
  return String(n).padStart(2, '0')
}

function formatSeason(): string {
  const month = new Date().getMonth()
  if (month <= 1 || month === 11) return 'winter'
  if (month <= 4) return 'spring'
  if (month <= 7) return 'summer'
  return 'autumn'
}

function formatHourMinute(): string {
  const now = new Date()
  const h = pad(now.getHours() % 12 || 12)
  const m = pad(now.getMinutes())
  return `${h}:${m}`
}

function SeasonalGlyph({ season }: { season: string }) {
  if (season === 'winter') {
    return (
      <svg className="imprint-plate__season-svg" viewBox="0 0 28 28" aria-hidden="true">
        <line x1="14" y1="3" x2="14" y2="25" stroke="currentColor" strokeWidth=".55" strokeLinecap="round" />
        <line x1="3" y1="14" x2="25" y2="14" stroke="currentColor" strokeWidth=".55" strokeLinecap="round" />
        <line x1="6" y1="6" x2="22" y2="22" stroke="currentColor" strokeWidth=".45" strokeLinecap="round" opacity=".75" />
        <line x1="22" y1="6" x2="6" y2="22" stroke="currentColor" strokeWidth=".45" strokeLinecap="round" opacity=".75" />
        <circle cx="14" cy="14" r="2.4" fill="currentColor" opacity=".7" />
        <circle cx="14" cy="14" r="4.4" fill="none" stroke="currentColor" strokeWidth=".3" strokeDasharray=".6 1.2" opacity=".5" />
      </svg>
    )
  }
  if (season === 'spring') {
    return (
      <svg className="imprint-plate__season-svg" viewBox="0 0 28 28" aria-hidden="true">
        <path d="M14 24 C 14 18, 14 14, 14 6" fill="none" stroke="currentColor" strokeWidth=".55" strokeLinecap="round" />
        <path d="M14 14 C 8 12, 4 8, 4 4 C 8 4, 12 8, 14 14 Z" fill="none" stroke="currentColor" strokeWidth=".55" strokeLinejoin="round" />
        <path d="M14 12 C 20 10, 24 6, 24 2 C 20 2, 16 6, 14 12 Z" fill="none" stroke="currentColor" strokeWidth=".55" strokeLinejoin="round" opacity=".85" />
        <path d="M14 18 C 10 16, 6 16, 4 18" fill="none" stroke="currentColor" strokeWidth=".45" strokeLinecap="round" opacity=".7" />
        <path d="M14 20 C 18 18, 22 18, 24 20" fill="none" stroke="currentColor" strokeWidth=".45" strokeLinecap="round" opacity=".7" />
        <circle cx="14" cy="24" r="1.2" fill="currentColor" />
      </svg>
    )
  }
  if (season === 'summer') {
    return (
      <svg className="imprint-plate__season-svg" viewBox="0 0 28 28" aria-hidden="true">
        <circle cx="14" cy="14" r="5.6" fill="none" stroke="currentColor" strokeWidth=".55" />
        <line x1="14" y1="2" x2="14" y2="5.5" stroke="currentColor" strokeWidth=".55" strokeLinecap="round" />
        <line x1="14" y1="22.5" x2="14" y2="26" stroke="currentColor" strokeWidth=".55" strokeLinecap="round" />
        <line x1="2" y1="14" x2="5.5" y2="14" stroke="currentColor" strokeWidth=".55" strokeLinecap="round" />
        <line x1="22.5" y1="14" x2="26" y2="14" stroke="currentColor" strokeWidth=".55" strokeLinecap="round" />
        <line x1="5.5" y1="5.5" x2="8" y2="8" stroke="currentColor" strokeWidth=".45" strokeLinecap="round" opacity=".8" />
        <line x1="20" y1="20" x2="22.5" y2="22.5" stroke="currentColor" strokeWidth=".45" strokeLinecap="round" opacity=".8" />
        <line x1="22.5" y1="5.5" x2="20" y2="8" stroke="currentColor" strokeWidth=".45" strokeLinecap="round" opacity=".8" />
        <line x1="8" y1="20" x2="5.5" y2="22.5" stroke="currentColor" strokeWidth=".45" strokeLinecap="round" opacity=".8" />
        <circle cx="14" cy="14" r="2" fill="currentColor" opacity=".7" />
      </svg>
    )
  }
  return (
    <svg className="imprint-plate__season-svg" viewBox="0 0 28 28" aria-hidden="true">
      <path
        d="M14 3 C 9 4, 5 8, 4 14 C 3 20, 7 25, 14 25 C 21 25, 25 20, 24 14 C 23 8, 19 4, 14 3 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth=".55"
        strokeLinejoin="round"
      />
      <line x1="14" y1="3" x2="14" y2="25" stroke="currentColor" strokeWidth=".45" strokeLinecap="round" opacity=".55" />
      <line x1="4" y1="14" x2="24" y2="14" stroke="currentColor" strokeWidth=".45" strokeLinecap="round" opacity=".55" />
      <line x1="7" y1="7" x2="21" y2="21" stroke="currentColor" strokeWidth=".35" strokeLinecap="round" opacity=".4" />
      <line x1="21" y1="7" x2="7" y2="21" stroke="currentColor" strokeWidth=".35" strokeLinecap="round" opacity=".4" />
      <circle cx="20" cy="8" r="1" fill="currentColor" opacity=".6" />
      <circle cx="8" cy="20" r="1" fill="currentColor" opacity=".6" />
    </svg>
  )
}

export function ImprintPlate({ voice, word, setToday, readerName }: ImprintPlateProps) {
  const baseId = useId().replace(/:/g, '')
  const grainId = `imprint-plate-grain-${baseId}`
  const ruleId = `imprint-plate-rule-${baseId}`
  const threadId = `imprint-plate-thread-${baseId}`
  const rootRef = useRef<HTMLElement>(null)
  const [revealed, setRevealed] = useState(false)
  const season = formatSeason()
  const hourMinute = formatHourMinute()
  const signedReader = readerName.trim()

  const style = {
    '--imprint-tone': VOICE_TONE[voice],
    '--imprint-word-tone': WORD_INK[word],
    '--imprint-grain': `url(#${grainId})`,
    '--imprint-rule': `url(#${ruleId})`,
    '--imprint-thread': `url(#${threadId})`,
  } as CSSProperties

  useEffect(() => {
    const node = rootRef.current
    if (!node) return
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
      { threshold: 0.18, rootMargin: '0px 0px -6% 0px' },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={rootRef}
      className={`imprint-plate imprint-plate--${voice} imprint-plate--word-${word} ${revealed ? 'is-revealed' : ''} ${signedReader ? 'is-signed' : ''}`}
      aria-label={`The page's imprint, set in the ${VOICE_NAME[voice]} voice, marked at ${WORD_LABEL[word]}, on ${setToday}.`}
      style={style}
    >
      <svg className="imprint-plate__defs" viewBox="0 0 1200 600" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <filter id={grainId} x="-2%" y="-12%" width="104%" height="124%">
            <feTurbulence type="fractalNoise" baseFrequency="0.95" numOctaves="2" seed="71" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 .12  0 0 0 0 .10  0 0 0 0 .16  0 0 0 .045 0" />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
          <filter id={threadId} x="-30%" y="-4%" width="160%" height="108%">
            <feTurbulence type="fractalNoise" baseFrequency="2.4" numOctaves="2" seed="79" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .5 0" />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
          <linearGradient id={ruleId} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
            <stop offset="14%" stopColor="currentColor" stopOpacity=".55" />
            <stop offset="50%" stopColor="currentColor" stopOpacity=".85" />
            <stop offset="86%" stopColor="currentColor" stopOpacity=".55" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      <span className="imprint-plate__rule imprint-plate__rule--lead" aria-hidden="true">
        <svg viewBox="0 0 1200 6" preserveAspectRatio="none">
          <g filter={`url(#${grainId})`}>
            <path
              className="imprint-plate__rule-stroke"
              d="M2 3c60-3 120 3 180 0s120-3 180 0 120 3 180 0 120-3 180 0 120 3 180 0 60-3 118 0"
              fill="none"
              stroke={`url(#${ruleId})`}
              strokeWidth=".75"
              strokeLinecap="round"
              pathLength="100"
              strokeDasharray="100 100"
            />
          </g>
          <circle cx="2" cy="3" r="1.1" fill="currentColor" />
          <circle cx="1198" cy="3" r="1.1" fill="currentColor" />
        </svg>
      </span>

      <header className="imprint-plate__head">
        <span className="imprint-plate__head-mark" aria-hidden="true">
          <svg viewBox="0 0 20 20">
            <circle cx="10" cy="10" r="8.4" fill="none" stroke="currentColor" strokeWidth=".55" />
            <circle cx="10" cy="10" r="4.6" fill="none" stroke="currentColor" strokeWidth=".35" strokeDasharray=".7 1.4" opacity=".7" />
            <text x="10" y="13.6" textAnchor="middle" fontFamily="Georgia, 'Iowan Old Style', serif" fontStyle="italic" fontSize="10.5" fill="currentColor">m³</text>
          </svg>
        </span>
        <span className="imprint-plate__head-stack">
          <span className="imprint-plate__head-eyebrow" aria-hidden="true">
            <span className="imprint-plate__head-eyebrow-mark" />
            <em>the imprint</em>
            <span className="imprint-plate__head-eyebrow-mark imprint-plate__head-eyebrow-mark--alt" />
          </span>
          <span className="imprint-plate__head-title">
            <em>what this page reads,</em>
            <span className="imprint-plate__head-title-row">
              <span>right now</span>
              <span className="imprint-plate__head-title-folio" aria-hidden="true">folio i·½</span>
            </span>
          </span>
        </span>
        <span className="imprint-plate__head-stamp" aria-hidden="true">
          <svg viewBox="0 0 72 72">
            <defs>
              <filter id={`imprint-plate-stamp-grain-${baseId}`} x="-12%" y="-12%" width="124%" height="124%">
                <feTurbulence type="fractalNoise" baseFrequency="2.6" numOctaves="2" seed="13" stitchTiles="stitch" />
                <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .5 0" />
                <feComposite in2="SourceGraphic" operator="in" />
              </filter>
            </defs>
            <g filter={`url(#imprint-plate-stamp-grain-${baseId})`} opacity=".92">
              <circle cx="36" cy="36" r="32" fill="none" stroke="currentColor" strokeWidth="1.1" />
              <circle cx="36" cy="36" r="26" fill="none" stroke="currentColor" strokeWidth=".35" strokeDasharray="1 2" opacity=".65" />
              <text x="36" y="22" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="3.6" letterSpacing="1.6" fill="currentColor">IMPRINT · YES</text>
              <text x="36" y="42" textAnchor="middle" fontFamily="Georgia, serif" fontStyle="italic" fontSize="17" fill="currentColor">{VOICE_LETTER[voice]}</text>
              <text x="36" y="54" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="3.4" letterSpacing="1.4" fill="currentColor">FOLIO · I½</text>
            </g>
          </svg>
          <span className="imprint-plate__head-stamp-wax" aria-hidden="true">
            <span className="imprint-plate__head-stamp-wax-bead" />
            <span className="imprint-plate__head-stamp-wax-wisp" />
          </span>
        </span>
      </header>

      <div className="imprint-plate__grid" role="list">
        <div className="imprint-plate__cell imprint-plate__cell--voice" role="listitem">
          <span className="imprint-plate__cell-key">
            <span className="imprint-plate__cell-key-mark" aria-hidden="true" />
            voice
            <span className="imprint-plate__cell-key-mark imprint-plate__cell-key-mark--alt" aria-hidden="true" />
          </span>
          <span className="imprint-plate__cell-row">
            <span className="imprint-plate__cell-letter" aria-hidden="true">{VOICE_LETTER[voice]}</span>
            <span className="imprint-plate__cell-stack">
              <em className="imprint-plate__cell-name">{VOICE_NAME[voice]}</em>
              <span className="imprint-plate__cell-face">{VOICE_FACE[voice]}</span>
            </span>
          </span>
        </div>

        <span className="imprint-plate__cell-rule" aria-hidden="true">
          <svg viewBox="0 0 6 60" preserveAspectRatio="none">
            <line x1="3" y1="2" x2="3" y2="58" stroke="currentColor" strokeWidth=".4" strokeDasharray="1.2 2" opacity=".55" />
          </svg>
        </span>

        <div className={`imprint-plate__cell imprint-plate__cell--word imprint-plate__cell--word-${word}`} role="listitem">
          <span className="imprint-plate__cell-key">
            <span className="imprint-plate__cell-key-mark" aria-hidden="true" />
            marked
            <span className="imprint-plate__cell-key-mark imprint-plate__cell-key-mark--alt" aria-hidden="true" />
          </span>
          <span className="imprint-plate__cell-row">
            <span className="imprint-plate__cell-stack">
              <em className="imprint-plate__cell-word-label">{WORD_LABEL[word]}</em>
              <span className="imprint-plate__cell-face">{WORD_KIND[word]}</span>
            </span>
            <span className="imprint-plate__cell-mark-tag">
              <span className="imprint-plate__cell-mark-tag-rule" aria-hidden="true" />
              <em>{WORD_MARK[word]}</em>
            </span>
          </span>
        </div>

        <span className="imprint-plate__cell-rule" aria-hidden="true">
          <svg viewBox="0 0 6 60" preserveAspectRatio="none">
            <line x1="3" y1="2" x2="3" y2="58" stroke="currentColor" strokeWidth=".4" strokeDasharray="1.2 2" opacity=".55" />
          </svg>
        </span>

        <div className="imprint-plate__cell imprint-plate__cell--today" role="listitem">
          <span className="imprint-plate__cell-key">
            <span className="imprint-plate__cell-key-mark" aria-hidden="true" />
            set today
            <span className="imprint-plate__cell-key-mark imprint-plate__cell-key-mark--alt" aria-hidden="true" />
          </span>
          <span className="imprint-plate__cell-row">
            <span className="imprint-plate__cell-stack">
              <em className="imprint-plate__cell-today-value">{setToday}</em>
              <span className="imprint-plate__cell-face">{season} · at {hourMinute}</span>
            </span>
            <span className="imprint-plate__cell-season" aria-hidden="true">
              <SeasonalGlyph season={season} />
              <span className="imprint-plate__cell-season-tag">{season}</span>
            </span>
          </span>
        </div>

        {signedReader && (
          <>
            <span className="imprint-plate__cell-rule" aria-hidden="true">
              <svg viewBox="0 0 6 60" preserveAspectRatio="none">
                <line x1="3" y1="2" x2="3" y2="58" stroke="currentColor" strokeWidth=".4" strokeDasharray="1.2 2" opacity=".55" />
              </svg>
            </span>
            <div className="imprint-plate__cell imprint-plate__cell--reader" role="listitem">
              <span className="imprint-plate__cell-key">
                <span className="imprint-plate__cell-key-mark" aria-hidden="true" />
                impressed for
                <span className="imprint-plate__cell-key-mark imprint-plate__cell-key-mark--alt" aria-hidden="true" />
              </span>
              <span className="imprint-plate__cell-row">
                <span className="imprint-plate__cell-stack">
                  <em className="imprint-plate__cell-reader-name">{signedReader}</em>
                  <span className="imprint-plate__cell-face">a quiet inscription</span>
                </span>
                <span className="imprint-plate__cell-reader-rule" aria-hidden="true">
                  <svg viewBox="0 0 80 10" preserveAspectRatio="none">
                    <path
                      d="M2 5c10-4 20 4 32-1s22-4 32 0 22 4 12 0"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth=".55"
                      strokeLinecap="round"
                      opacity=".7"
                    />
                    <circle cx="78" cy="5" r=".9" fill="currentColor" />
                  </svg>
                </span>
              </span>
            </div>
          </>
        )}
      </div>

      <span className="imprint-plate__thread" aria-hidden="true">
        <svg viewBox="0 0 18 96" preserveAspectRatio="xMidYMid meet">
          <g filter={`url(#${threadId})`}>
            <path
              className="imprint-plate__thread-stroke imprint-plate__thread-stroke--lead"
              d="M9 2c1.2 14-2 26 0 38s-1.4 24 .6 50"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.05"
              strokeLinecap="round"
              pathLength="100"
              strokeDasharray="100 100"
            />
            <path
              className="imprint-plate__thread-stroke imprint-plate__thread-stroke--trail"
              d="M11 4c.6 12-1 22 .2 32s-1 22 .4 32"
              fill="none"
              stroke="currentColor"
              strokeWidth=".5"
              strokeLinecap="round"
              opacity=".5"
              pathLength="100"
              strokeDasharray="100 100"
            />
          </g>
          <circle className="imprint-plate__thread-bead" cx="9" cy="92" r="1.8" fill="currentColor" />
          <circle className="imprint-plate__thread-halo" cx="9" cy="92" r="4" fill="none" stroke="currentColor" strokeWidth=".3" strokeDasharray=".6 1.4" opacity=".55" />
        </svg>
        <span className="imprint-plate__thread-tag" aria-hidden="true">
          <span className="imprint-plate__thread-tag-mark" />
          <em>then · turn the page</em>
          <span className="imprint-plate__thread-tag-mark imprint-plate__thread-tag-mark--alt" />
        </span>
      </span>

      <footer className="imprint-plate__foot">
        <span className="imprint-plate__foot-rule imprint-plate__foot-rule--lead" aria-hidden="true">
          <svg viewBox="0 0 200 6" preserveAspectRatio="none">
            <path
              d="M2 3c20-3 40 3 60 0s40-3 60 0 40 3 60 0 16-3 18 0"
              fill="none"
              stroke="currentColor"
              strokeWidth=".5"
              strokeDasharray="2 2.4"
              strokeLinecap="round"
              opacity=".55"
            />
          </svg>
        </span>
        <span className="imprint-plate__foot-stack">
          <span className="imprint-plate__foot-line">
            <em>set in</em>
            <span className="imprint-plate__foot-voice">{VOICE_NAME[voice]}</span>
            <span aria-hidden="true">·</span>
            <span className="imprint-plate__foot-mark">
              <em>{WORD_MARK[word]}</em>
              <span className="imprint-plate__foot-mark-dot" aria-hidden="true" />
              <span className="imprint-plate__foot-mark-word">{WORD_LABEL[word]}</span>
            </span>
            <span aria-hidden="true">·</span>
            <span className="imprint-plate__foot-today">{setToday}</span>
            <span aria-hidden="true">·</span>
            <span className="imprint-plate__foot-season">{season}</span>
          </span>
          <span className="imprint-plate__foot-line imprint-plate__foot-line--alt">
            <em>composed by hand</em>
            <span aria-hidden="true">·</span>
            <span>folded once</span>
            <span aria-hidden="true">·</span>
            <em>set for</em>
            <span className="imprint-plate__foot-reader">{signedReader || 'the next reader'}</span>
          </span>
        </span>
        <span className="imprint-plate__foot-rule imprint-plate__foot-rule--trail" aria-hidden="true">
          <svg viewBox="0 0 200 6" preserveAspectRatio="none">
            <path
              d="M2 3c20-3 40 3 60 0s40-3 60 0 40 3 60 0 16-3 18 0"
              fill="none"
              stroke="currentColor"
              strokeWidth=".5"
              strokeDasharray="2 2.4"
              strokeLinecap="round"
              opacity=".55"
            />
          </svg>
        </span>
      </footer>

      <span className="imprint-plate__pencil" aria-hidden="true">
        <svg viewBox="0 0 220 16" preserveAspectRatio="none">
          <path
            className="imprint-plate__pencil-stroke"
            d="M2 9c16-6 32 4 48-1s32-6 48-1 32 4 48-2 32-6 48-1 14 0 16 0"
            fill="none"
            stroke="currentColor"
            strokeWidth=".85"
            strokeLinecap="round"
            pathLength="100"
            strokeDasharray="100 100"
          />
          <circle cx="218" cy="8" r="1.2" fill="currentColor" className="imprint-plate__pencil-bead" />
        </svg>
      </span>
    </section>
  )
}
