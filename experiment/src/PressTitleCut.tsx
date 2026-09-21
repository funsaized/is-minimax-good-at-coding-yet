import { useEffect, useId, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react'
import type { VoiceId } from './Press'

type PressTitleCutProps = {
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

const VOICE_FACE: Record<VoiceId, string> = {
  quiet: 'serif · italic · close set',
  human: 'serif · italic · a hand that learned its warmth',
  bold: 'sans · heavy · no apology',
}

const VOICE_GLYPH: Record<VoiceId, string> = {
  quiet: '¶',
  human: '§',
  bold: '✦',
}

type Cut = {
  id: string
  glyph: string
  ink: string
  line: string
  width: number
}

const CUTS: Cut[] = [
  { id: 'one', glyph: 'I.', ink: 'lead', line: 'is Minimax M3', width: 1.04 },
  { id: 'two', glyph: 'II.', ink: 'press', line: 'good at frontend', width: 1 },
  { id: 'three', glyph: 'III.', ink: 'pause', line: 'yet?', width: 0.92 },
]

const READING_OF = 'read the title once — with the eye, then with the ear — and notice which word the question mark leans on.'

export function PressTitleCut({ voice, setToday }: PressTitleCutProps) {
  const baseId = useId().replace(/:/g, '')
  const grainId = `press-title-cut-grain-${baseId}`
  const sealGrainId = `press-title-cut-seal-grain-${baseId}`
  const frameGrainId = `press-title-cut-frame-grain-${baseId}`
  const rootRef = useRef<HTMLElement>(null)
  const [revealed, setRevealed] = useState(false)
  const tone = VOICE_TONE[voice]
  const style = {
    '--ptc-tone': tone,
    '--ptc-grain': `url(#${grainId})`,
    '--ptc-seal-grain': `url(#${sealGrainId})`,
    '--ptc-frame-grain': `url(#${frameGrainId})`,
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

  const onHeadingKey = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      const headline = document.getElementById('page-title')
      headline?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <aside
      ref={rootRef}
      className={`press-title-cut press-title-cut--${voice} ${revealed ? 'is-revealed' : ''}`}
      style={style}
      aria-label={`Press title cut · folio i · the question engraved as a single composed display plate · set in ${VOICE_NAME[voice]} on ${setToday}`}
    >
      <svg className="press-title-cut__defs" viewBox="0 0 1200 600" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <filter id={grainId} x="-2%" y="-30%" width="104%" height="160%">
            <feTurbulence type="fractalNoise" baseFrequency="0.84" numOctaves="2" seed="41" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 .14  0 0 0 0 .12  0 0 0 0 .19  0 0 0 .05 0" />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
          <filter id={sealGrainId} x="-12%" y="-12%" width="124%" height="124%">
            <feTurbulence type="fractalNoise" baseFrequency="2.6" numOctaves="2" seed="11" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .55 0" />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
          <filter id={frameGrainId} x="-4%" y="-30%" width="108%" height="160%">
            <feTurbulence type="fractalNoise" baseFrequency="2.4" numOctaves="2" seed="59" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .5 0" />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
        </defs>
      </svg>

      <span className="press-title-cut__wash" aria-hidden="true" />

      <span className="press-title-cut__grain" aria-hidden="true">
        <svg viewBox="0 0 1200 600" preserveAspectRatio="none">
          <rect x="0" y="0" width="1200" height="600" filter={`url(#${grainId})`} opacity=".05" />
        </svg>
      </span>

      <span className="press-title-cut__frame" aria-hidden="true">
        <span className="press-title-cut__frame-corner press-title-cut__frame-corner--tl">
          <svg viewBox="0 0 64 64">
            <g filter={`url(#${frameGrainId})`} opacity=".94">
              <path d="M2 32h22M2 32v-2M2 32h-2" stroke="currentColor" strokeWidth=".9" strokeLinecap="round" fill="none" />
              <path d="M2 16h12M2 16v-2" stroke="currentColor" strokeWidth=".55" strokeLinecap="round" fill="none" opacity=".6" />
              <path d="M14 2v12M16 2h-2" stroke="currentColor" strokeWidth=".55" strokeLinecap="round" fill="none" opacity=".6" />
              <path d="M2 2h10v10" stroke="currentColor" strokeWidth=".9" strokeLinecap="round" fill="none" />
              <circle cx="6" cy="6" r="1.2" fill="currentColor" />
              <circle cx="22" cy="32" r=".95" fill="currentColor" />
              <circle cx="32" cy="22" r=".95" fill="currentColor" opacity=".55" />
            </g>
          </svg>
        </span>
        <span className="press-title-cut__frame-corner press-title-cut__frame-corner--tr">
          <svg viewBox="0 0 64 64">
            <g filter={`url(#${frameGrainId})`} opacity=".94">
              <path d="M62 32h-22M62 32v-2M62 32h2" stroke="currentColor" strokeWidth=".9" strokeLinecap="round" fill="none" />
              <path d="M62 16h-12M62 16v-2" stroke="currentColor" strokeWidth=".55" strokeLinecap="round" fill="none" opacity=".6" />
              <path d="M50 2v12M48 2h2" stroke="currentColor" strokeWidth=".55" strokeLinecap="round" fill="none" opacity=".6" />
              <path d="M62 2h-10v10" stroke="currentColor" strokeWidth=".9" strokeLinecap="round" fill="none" />
              <circle cx="58" cy="6" r="1.2" fill="currentColor" />
              <circle cx="42" cy="32" r=".95" fill="currentColor" />
              <circle cx="32" cy="22" r=".95" fill="currentColor" opacity=".55" />
            </g>
          </svg>
        </span>
        <span className="press-title-cut__frame-corner press-title-cut__frame-corner--bl">
          <svg viewBox="0 0 64 64">
            <g filter={`url(#${frameGrainId})`} opacity=".94">
              <path d="M2 32h22M2 32v2M2 32h-2" stroke="currentColor" strokeWidth=".9" strokeLinecap="round" fill="none" />
              <path d="M2 48h12M2 48v2" stroke="currentColor" strokeWidth=".55" strokeLinecap="round" fill="none" opacity=".6" />
              <path d="M14 62v-12M16 62h-2" stroke="currentColor" strokeWidth=".55" strokeLinecap="round" fill="none" opacity=".6" />
              <path d="M2 62h10v-10" stroke="currentColor" strokeWidth=".9" strokeLinecap="round" fill="none" />
              <circle cx="6" cy="58" r="1.2" fill="currentColor" />
              <circle cx="22" cy="32" r=".95" fill="currentColor" />
              <circle cx="32" cy="42" r=".95" fill="currentColor" opacity=".55" />
            </g>
          </svg>
        </span>
        <span className="press-title-cut__frame-corner press-title-cut__frame-corner--br">
          <svg viewBox="0 0 64 64">
            <g filter={`url(#${frameGrainId})`} opacity=".94">
              <path d="M62 32h-22M62 32v2M62 32h2" stroke="currentColor" strokeWidth=".9" strokeLinecap="round" fill="none" />
              <path d="M62 48h-12M62 48v2" stroke="currentColor" strokeWidth=".55" strokeLinecap="round" fill="none" opacity=".6" />
              <path d="M50 62v-12M48 62h2" stroke="currentColor" strokeWidth=".55" strokeLinecap="round" fill="none" opacity=".6" />
              <path d="M62 62h-10v-10" stroke="currentColor" strokeWidth=".9" strokeLinecap="round" fill="none" />
              <circle cx="58" cy="58" r="1.2" fill="currentColor" />
              <circle cx="42" cy="32" r=".95" fill="currentColor" />
              <circle cx="32" cy="42" r=".95" fill="currentColor" opacity=".55" />
            </g>
          </svg>
        </span>
      </span>

      <span className="press-title-cut__band" aria-hidden="true">
        <span className="press-title-cut__band-mark" />
        <span className="press-title-cut__band-eyebrow">a press title cut</span>
        <span className="press-title-cut__band-sep" aria-hidden="true">·</span>
        <span className="press-title-cut__band-folio">folio i·</span>
        <span className="press-title-cut__band-tag">the question, set as a single composed display plate</span>
        <span className="press-title-cut__band-mark press-title-cut__band-mark--alt" />
      </span>

      <span className="press-title-cut__rule press-title-cut__rule--lead" aria-hidden="true">
        <svg viewBox="0 0 1200 8" preserveAspectRatio="none">
          <g filter={`url(#${frameGrainId})`}>
            <path
              className="press-title-cut__rule-stroke press-title-cut__rule-stroke--lead"
              d="M2 4c80-4 160 4 240 0s160-4 240 0 160 4 240 0 160-4 240 0 80-4 38 0"
              fill="none"
              stroke="currentColor"
              strokeWidth=".9"
              strokeLinecap="round"
              pathLength="100"
              strokeDasharray="100 100"
            />
          </g>
          <circle className="press-title-cut__rule-bead press-title-cut__rule-bead--lead" cx="2" cy="4" r="1.4" fill="currentColor" />
          <circle className="press-title-cut__rule-bead" cx="1198" cy="4" r="1.4" fill="currentColor" />
        </svg>
      </span>

      <div
        className="press-title-cut__plate"
        role="button"
        tabIndex={0}
        onKeyDown={onHeadingKey}
        aria-label={`The headline: ${CUTS.map(c => c.line).join(' ')}. Press enter to read the full title broadside.`}
      >
        <span className="press-title-cut__plate-mark press-title-cut__plate-mark--lead" aria-hidden="true">
          <svg viewBox="0 0 64 24" preserveAspectRatio="none">
            <g filter={`url(#${frameGrainId})`}>
              <path d="M2 12h44" fill="none" stroke="currentColor" strokeWidth=".55" strokeLinecap="round" />
              <path d="M50 12l10-5M50 12l10 5" fill="none" stroke="currentColor" strokeWidth=".55" strokeLinecap="round" />
              <circle cx="62" cy="12" r="1.1" fill="currentColor" />
            </g>
          </svg>
        </span>
        <span className="press-title-cut__plate-mark press-title-cut__plate-mark--trail" aria-hidden="true">
          <svg viewBox="0 0 64 24" preserveAspectRatio="none">
            <g filter={`url(#${frameGrainId})`}>
              <path d="M62 12h-44" fill="none" stroke="currentColor" strokeWidth=".55" strokeLinecap="round" />
              <path d="M14 12l-10-5M14 12l-10 5" fill="none" stroke="currentColor" strokeWidth=".55" strokeLinecap="round" />
              <circle cx="2" cy="12" r="1.1" fill="currentColor" />
            </g>
          </svg>
        </span>

        <h3 className="press-title-cut__lines">
          {CUTS.map((cut, index) => (
            <span
              key={`ptc-line-${cut.id}`}
              className={`press-title-cut__line press-title-cut__line--${cut.id}`}
              style={{ '--ptc-line-w': cut.width } as CSSProperties}
            >
              <span className="press-title-cut__line-mark" aria-hidden="true">{cut.glyph}</span>
              <span className="press-title-cut__line-text">{cut.line}</span>
              <span className="press-title-cut__line-ink" aria-hidden="true">
                <span className="press-title-cut__line-ink-key">{cut.ink}</span>
              </span>
            </span>
          ))}
        </h3>
      </div>

      <span className="press-title-cut__rule press-title-cut__rule--trail" aria-hidden="true">
        <svg viewBox="0 0 1200 8" preserveAspectRatio="none">
          <g filter={`url(#${frameGrainId})`}>
            <path
              className="press-title-cut__rule-stroke press-title-cut__rule-stroke--trail"
              d="M2 4c80-4 160 4 240 0s160-4 240 0 160 4 240 0 160-4 240 0 80-4 38 0"
              fill="none"
              stroke="currentColor"
              strokeWidth=".55"
              strokeLinecap="round"
              opacity=".7"
              pathLength="100"
              strokeDasharray="100 100"
            />
          </g>
          <circle cx="2" cy="4" r="1.1" fill="currentColor" opacity=".7" />
          <circle cx="1198" cy="4" r="1.1" fill="currentColor" opacity=".7" />
        </svg>
      </span>

      <div className="press-title-cut__foot">
        <p className="press-title-cut__copy" aria-label={READING_OF}>
          <span className="press-title-cut__copy-mark" aria-hidden="true">{VOICE_GLYPH[voice]}</span>
          <em className="press-title-cut__copy-line">{READING_OF}</em>
          <span className="press-title-cut__copy-mark press-title-cut__copy-mark--alt" aria-hidden="true">{VOICE_GLYPH[voice]}</span>
        </p>

        <span className="press-title-cut__seal" aria-hidden="true">
          <span className="press-title-cut__seal-disc">
            <svg viewBox="0 0 64 64">
              <g filter={`url(#${sealGrainId})`} opacity=".95">
                <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeWidth=".9" />
                <circle cx="32" cy="32" r="22" fill="none" stroke="currentColor" strokeWidth=".35" strokeDasharray=".8 1.6" opacity=".7" />
                <circle cx="32" cy="32" r="14.5" fill="none" stroke="currentColor" strokeWidth=".32" strokeDasharray=".6 1.2" opacity=".5" />
                <path
                  d="M32 6 L32 12 M32 52 L32 58 M6 32 L12 32 M52 32 L58 32"
                  stroke="currentColor"
                  strokeWidth=".5"
                  strokeLinecap="round"
                  opacity=".6"
                />
                <text x="32" y="29" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="3.6" letterSpacing="1.6" fill="currentColor">TITLE · CUT</text>
                <text x="32" y="40" textAnchor="middle" fontFamily="'Iowan Old Style', Georgia, serif" fontStyle="italic" fontSize="16" letterSpacing="-.04em" fill="currentColor">m³</text>
                <text x="32" y="50" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="3.2" letterSpacing="1.4" fill="currentColor">FOLIO · i</text>
              </g>
            </svg>
          </span>
          <span className="press-title-cut__seal-halo" aria-hidden="true" />
        </span>

        <span className="press-title-cut__meta" aria-hidden="true">
          <span className="press-title-cut__meta-row">
            <span className="press-title-cut__meta-key">set in</span>
            <span className="press-title-cut__meta-value press-title-cut__meta-value--voice">
              <em>{VOICE_NAME[voice]}</em>
              <span className="press-title-cut__meta-voice-face">{VOICE_FACE[voice]}</span>
            </span>
          </span>
          <span className="press-title-cut__meta-divider" aria-hidden="true">·</span>
          <span className="press-title-cut__meta-row">
            <span className="press-title-cut__meta-key">set on</span>
            <em className="press-title-cut__meta-value">{setToday}</em>
          </span>
          <span className="press-title-cut__meta-divider" aria-hidden="true">·</span>
          <span className="press-title-cut__meta-row">
            <span className="press-title-cut__meta-key">read</span>
            <em className="press-title-cut__meta-value">once with the eye · once with the ear</em>
          </span>
        </span>
      </div>

      <span className="press-title-cut__descent" aria-hidden="true">
        <svg viewBox="0 0 24 56" preserveAspectRatio="none">
          <g filter={`url(#${frameGrainId})`} opacity=".85">
            <path
              className="press-title-cut__descent-stroke"
              d="M12 2 C 12 14, 4 22, 12 32 S 12 50, 12 54"
              fill="none"
              stroke="currentColor"
              strokeWidth=".9"
              strokeLinecap="round"
              pathLength="100"
              strokeDasharray="100 100"
            />
          </g>
          <circle className="press-title-cut__descent-bead" cx="12" cy="54" r="1.6" fill="currentColor" />
        </svg>
        <span className="press-title-cut__descent-tag" aria-hidden="true">
          <span className="press-title-cut__descent-tag-rule" />
          <em>then · read on</em>
          <span className="press-title-cut__descent-tag-mark" aria-hidden="true">↓</span>
        </span>
      </span>

      <span className="sr-only" aria-live="polite">
        {`Press title cut. The question engraved: ${CUTS.map(c => c.line).join(' ')}. Set in ${VOICE_NAME[voice]} on ${setToday}.`}
      </span>
    </aside>
  )
}