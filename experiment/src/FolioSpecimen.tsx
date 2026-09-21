import { useEffect, useId, useRef, useState, type CSSProperties } from 'react'
import type { VoiceId } from './Press'

type FolioSpecimenProps = {
  voice: VoiceId
  setToday: string
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

const SEASON = (() => {
  const month = new Date().getMonth()
  if (month <= 1 || month === 11) return 'winter'
  if (month <= 4) return 'spring'
  if (month <= 7) return 'summer'
  return 'autumn'
})()

const VOICE_PHRASE: Record<VoiceId, string> = {
  quiet: 'a quiet line, set with care',
  human: 'a hand, learning its warmth',
  bold: 'a single loud line, kept honest',
}

const EDITORIAL = 'one open question, set by hand in three voices, pressed today for the next reader.'

export function FolioSpecimen({ voice, setToday }: FolioSpecimenProps) {
  const baseId = useId().replace(/:/g, '')
  const grainId = `folio-specimen-grain-${baseId}`
  const ruleGrainId = `folio-specimen-rule-grain-${baseId}`
  const monogramGrainId = `folio-specimen-mono-grain-${baseId}`
  const rootRef = useRef<HTMLElement>(null)
  const [revealed, setRevealed] = useState(false)

  const tone = VOICE_TONE[voice]
  const style = {
    '--folio-specimen-tone': tone,
    '--folio-specimen-grain': `url(#${grainId})`,
    '--folio-specimen-rule-grain': `url(#${ruleGrainId})`,
    '--folio-specimen-mono-grain': `url(#${monogramGrainId})`,
  } as CSSProperties

  useEffect(() => {
    const node = rootRef.current
    if (!node) {
      setRevealed(true)
      return
    }
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
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
      { threshold: 0.12, rootMargin: '0px 0px -4% 0px' },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <aside
      ref={rootRef}
      className={`folio-specimen folio-specimen--${voice} ${revealed ? 'is-revealed' : ''}`}
      style={style}
      aria-label={`Press specimen · folio i · ${EDITORIAL} · set on ${setToday} · ${SEASON} · bound in the ${VOICE_NAME[voice]} voice.`}
    >
      <svg className="folio-specimen__defs" viewBox="0 0 1200 240" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <filter id={grainId} x="-2%" y="-30%" width="104%" height="160%">
            <feTurbulence type="fractalNoise" baseFrequency="0.86" numOctaves="2" seed="19" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 .14  0 0 0 0 .12  0 0 0 0 .19  0 0 0 .05 0" />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
          <filter id={ruleGrainId} x="-2%" y="-50%" width="104%" height="200%">
            <feTurbulence type="fractalNoise" baseFrequency="2.4" numOctaves="2" seed="29" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .5 0" />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
          <filter id={monogramGrainId} x="-12%" y="-12%" width="124%" height="124%">
            <feTurbulence type="fractalNoise" baseFrequency="2.6" numOctaves="2" seed="37" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .55 0" />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
        </defs>
      </svg>

      <span className="folio-specimen__wash" aria-hidden="true" />

      <header className="folio-specimen__head" aria-hidden="true">
        <span className="folio-specimen__head-mark" />
        <span className="folio-specimen__head-eyebrow">press specimen</span>
        <span className="folio-specimen__head-sep">·</span>
        <span className="folio-specimen__head-tag">folio i · the opening plate</span>
        <span className="folio-specimen__head-mark folio-specimen__head-mark--alt" />
      </header>

      <div className="folio-specimen__rule folio-specimen__rule--lead" aria-hidden="true">
        <svg viewBox="0 0 1200 6" preserveAspectRatio="none">
          <g filter={`url(#${ruleGrainId})`}>
            <path
              className="folio-specimen__rule-stroke folio-specimen__rule-stroke--lead"
              d="M2 3c60-3 120 3 180 0s120-3 180 0 120 3 180 0 120-3 180 0 120 3 180 0 60-3 96 0"
              fill="none"
              stroke="currentColor"
              strokeWidth=".65"
              strokeLinecap="round"
              pathLength="100"
            />
          </g>
          <circle className="folio-specimen__rule-bead folio-specimen__rule-bead--lead" cx="2" cy="3" r="1.2" fill="currentColor" />
          <circle className="folio-specimen__rule-bead" cx="1198" cy="3" r="1.2" fill="currentColor" />
        </svg>
      </div>

      <div className="folio-specimen__body">
        <figure className="folio-specimen__monogram" aria-hidden="true">
          <span className="folio-specimen__monogram-frame">
            <svg viewBox="0 0 96 96">
              <g filter={`url(#${monogramGrainId})`} opacity=".96">
                <rect x="6" y="6" width="84" height="84" fill="none" stroke="currentColor" strokeWidth=".85" />
                <rect x="11" y="11" width="74" height="74" fill="none" stroke="currentColor" strokeWidth=".35" strokeDasharray=".8 1.6" opacity=".55" />
                <line x1="6" y1="48" x2="90" y2="48" stroke="currentColor" strokeWidth=".3" opacity=".45" />
                <line x1="48" y1="6" x2="48" y2="90" stroke="currentColor" strokeWidth=".3" opacity=".45" />
                <circle cx="6" cy="6" r="1.3" fill="currentColor" />
                <circle cx="90" cy="6" r="1.3" fill="currentColor" />
                <circle cx="6" cy="90" r="1.3" fill="currentColor" />
                <circle cx="90" cy="90" r="1.3" fill="currentColor" />
                <text
                  x="48"
                  y="42"
                  textAnchor="middle"
                  fontFamily="'Iowan Old Style', Georgia, serif"
                  fontStyle="italic"
                  fontSize="26"
                  letterSpacing="-.04em"
                  fill="currentColor"
                >m³</text>
                <text
                  x="48"
                  y="62"
                  textAnchor="middle"
                  fontFamily="ui-monospace, monospace"
                  fontSize="4.2"
                  letterSpacing="2.6"
                  fill="currentColor"
                  opacity=".78"
                >PRESS · SPECIMEN</text>
                <text
                  x="48"
                  y="78"
                  textAnchor="middle"
                  fontFamily="ui-monospace, monospace"
                  fontSize="3.6"
                  letterSpacing="2"
                  fill="currentColor"
                  opacity=".65"
                >FOLIO · i</text>
              </g>
            </svg>
            <span className="folio-specimen__monogram-halo" aria-hidden="true" />
            <span className="folio-specimen__monogram-tick folio-specimen__monogram-tick--a" aria-hidden="true" />
            <span className="folio-specimen__monogram-tick folio-specimen__monogram-tick--b" aria-hidden="true" />
          </span>
          <figcaption className="folio-specimen__monogram-tag">
            <span className="folio-specimen__monogram-tag-mark" aria-hidden="true">§</span>
            the house mark
            <span className="folio-specimen__monogram-tag-mark folio-specimen__monogram-tag-mark--alt" aria-hidden="true">§</span>
          </figcaption>
        </figure>

        <div className="folio-specimen__center">
          <p className="folio-specimen__prelude" aria-hidden="true">
            <span className="folio-specimen__prelude-mark" />
            <em>an open question, set today</em>
            <span className="folio-specimen__prelude-mark folio-specimen__prelude-mark--alt" />
          </p>
          <p className="folio-specimen__statement">
            <em className="folio-specimen__statement-text">{EDITORIAL}</em>
          </p>
          <p className="folio-specimen__aside" aria-hidden="true">
            <span className="folio-specimen__aside-rule" />
            <span className="folio-specimen__aside-key">read once</span>
            <span className="folio-specimen__aside-sep" aria-hidden="true">·</span>
            <span className="folio-specimen__aside-key">read twice</span>
            <span className="folio-specimen__aside-sep" aria-hidden="true">·</span>
            <span className="folio-specimen__aside-key">pull the lever</span>
            <span className="folio-specimen__aside-rule folio-specimen__aside-rule--alt" />
          </p>
        </div>

        <aside className="folio-specimen__voice-card" aria-label={`Voice ${VOICE_NAME[voice]} · set on ${setToday}`}>
          <span className="folio-specimen__voice-card-eyebrow" aria-hidden="true">bound in</span>
          <span className="folio-specimen__voice-card-letter" aria-hidden="true">
            <svg viewBox="0 0 48 48">
              <circle cx="24" cy="24" r="20" fill="none" stroke="currentColor" strokeWidth=".75" />
              <circle cx="24" cy="24" r="14.5" fill="none" stroke="currentColor" strokeWidth=".35" strokeDasharray=".7 1.4" opacity=".55" />
              <text
                x="24"
                y="32"
                textAnchor="middle"
                fontFamily="'Iowan Old Style', Georgia, serif"
                fontStyle="italic"
                fontSize="22"
                letterSpacing="-.04em"
                fill="currentColor"
              >{VOICE_LETTER[voice]}</text>
            </svg>
          </span>
          <span className="folio-specimen__voice-card-name">{VOICE_NAME[voice]}</span>
          <span className="folio-specimen__voice-card-phrase">
            <em>{VOICE_PHRASE[voice]}</em>
          </span>
          <span className="folio-specimen__voice-card-meta" aria-hidden="true">
            <span className="folio-specimen__voice-card-meta-row">
              <span className="folio-specimen__voice-card-meta-key">set</span>
              <em className="folio-specimen__voice-card-meta-val">{setToday}</em>
            </span>
            <span className="folio-specimen__voice-card-meta-row">
              <span className="folio-specimen__voice-card-meta-key">season</span>
              <em className="folio-specimen__voice-card-meta-val">{SEASON}</em>
            </span>
          </span>
          <span className="folio-specimen__voice-card-tick" aria-hidden="true">
            <svg viewBox="0 0 64 12" preserveAspectRatio="none">
              <g filter={`url(#${ruleGrainId})`}>
                <path
                  className="folio-specimen__voice-card-tick-stroke"
                  d="M2 6c8-4 16 4 24-1s16-4 24 0 8 4 12 1"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth=".55"
                  strokeLinecap="round"
                  pathLength="100"
                />
              </g>
              <circle cx="62" cy="6" r="1" fill="currentColor" />
            </svg>
            <em>set, then set again</em>
          </span>
        </aside>
      </div>

      <div className="folio-specimen__rule folio-specimen__rule--trail" aria-hidden="true">
        <svg viewBox="0 0 1200 6" preserveAspectRatio="none">
          <g filter={`url(#${ruleGrainId})`}>
            <path
              className="folio-specimen__rule-stroke folio-specimen__rule-stroke--trail"
              d="M2 3c60-3 120 3 180 0s120-3 180 0 120 3 180 0 120-3 180 0 120 3 180 0 60-3 96 0"
              fill="none"
              stroke="currentColor"
              strokeWidth=".55"
              strokeLinecap="round"
              opacity=".75"
              pathLength="100"
            />
          </g>
          <circle cx="2" cy="3" r=".95" fill="currentColor" opacity=".75" />
          <circle cx="1198" cy="3" r=".95" fill="currentColor" opacity=".75" />
        </svg>
      </div>

      <footer className="folio-specimen__foot" aria-hidden="true">
        <span className="folio-specimen__foot-mark" />
        <span className="folio-specimen__foot-text">
          <em>m³ press</em>
          <span className="folio-specimen__foot-sep" aria-hidden="true">·</span>
          an ongoing experiment
          <span className="folio-specimen__foot-sep" aria-hidden="true">·</span>
          set on <em>{setToday}</em>
          <span className="folio-specimen__foot-sep" aria-hidden="true">·</span>
          <em>{SEASON}</em>
        </span>
        <span className="folio-specimen__foot-mark folio-specimen__foot-mark--alt" />
      </footer>

      <span className="folio-specimen__thread" aria-hidden="true">
        <svg viewBox="0 0 24 64" preserveAspectRatio="none">
          <g filter={`url(#${ruleGrainId})`} opacity=".85">
            <path
              className="folio-specimen__thread-stroke"
              d="M12 2 C 12 14, 4 22, 12 32 S 12 50, 12 60"
              fill="none"
              stroke="currentColor"
              strokeWidth=".85"
              strokeLinecap="round"
              pathLength="100"
            />
          </g>
          <circle className="folio-specimen__thread-bead" cx="12" cy="60" r="1.5" fill="currentColor" />
        </svg>
        <span className="folio-specimen__thread-tag" aria-hidden="true">
          <span className="folio-specimen__thread-tag-rule" />
          <em>read</em>
          <span className="folio-specimen__thread-tag-mark" aria-hidden="true">↓</span>
        </span>
      </span>
    </aside>
  )
}