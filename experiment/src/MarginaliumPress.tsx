import { useId, type CSSProperties } from 'react'
import type { VoiceId } from './Press'
import type { WordId } from './notes'

type MarginaliumPressProps = {
  voice: VoiceId
  word: WordId
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

const WORD_LABEL: Record<WordId, string> = { m3: 'm³', good: 'good at', yet: 'yet?' }

export function MarginaliumPress({ voice, word, setToday }: MarginaliumPressProps) {
  const baseId = useId().replace(/:/g, '')
  const grainId = `marginalium-press-grain-${baseId}`
  const tone = VOICE_TONE[voice]
  const voiceName = VOICE_NAME[voice]
  const wordLabel = WORD_LABEL[word]
  const style = {
    '--marginalium-tone': tone,
    '--marginalium-grain': `url(#${grainId})`,
  } as CSSProperties

  return (
    <aside
      className={`marginalium-press marginalium-press--${voice} marginalium-press--word-${word}`}
      aria-label={`A marginalium from the editor · read it twice · ${voiceName} · marked at ${wordLabel} · ${setToday}`}
      style={style}
    >
      <svg className="marginalium-press__defs" viewBox="0 0 600 200" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <filter id={grainId} x="-4%" y="-4%" width="108%" height="108%">
            <feTurbulence type="fractalNoise" baseFrequency="2.4" numOctaves="2" seed="53" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .42 0" />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
        </defs>
      </svg>

      <span className="marginalium-press__pin" aria-hidden="true">
        <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet">
          <g filter={`url(#${grainId})`} opacity=".9">
            <circle cx="12" cy="12" r="3.4" fill="none" stroke="currentColor" strokeWidth=".9" />
            <circle cx="12" cy="12" r="1.4" fill="currentColor" />
            <line x1="12" y1="2" x2="12" y2="6" stroke="currentColor" strokeWidth=".55" strokeLinecap="round" opacity=".55" />
            <line x1="12" y1="18" x2="12" y2="22" stroke="currentColor" strokeWidth=".55" strokeLinecap="round" opacity=".55" />
            <line x1="2" y1="12" x2="6" y2="12" stroke="currentColor" strokeWidth=".55" strokeLinecap="round" opacity=".55" />
            <line x1="18" y1="12" x2="22" y2="12" stroke="currentColor" strokeWidth=".55" strokeLinecap="round" opacity=".55" />
          </g>
        </svg>
      </span>

      <span className="marginalium-press__tack" aria-hidden="true">
        <svg viewBox="0 0 80 10" preserveAspectRatio="none">
          <g filter={`url(#${grainId})`} opacity=".7">
            <path
              d="M2 5c12-4 24 4 36-1s24-4 38 0"
              fill="none"
              stroke="currentColor"
              strokeWidth=".7"
              strokeLinecap="round"
              pathLength="100"
              className="marginalium-press__tack-stroke"
            />
          </g>
          <circle cx="78" cy="4" r="1.1" fill="currentColor" className="marginalium-press__tack-bead" />
        </svg>
      </span>

      <figure className="marginalium-press__note">
        <span className="marginalium-press__quote" aria-hidden="true">
          <svg viewBox="0 0 22 18" preserveAspectRatio="xMidYMid meet">
            <g filter={`url(#${grainId})`} opacity=".7">
              <path
                d="M4 12 C 4 6, 10 4, 12 4 C 10 8, 8 10, 8 14"
                fill="none"
                stroke="currentColor"
                strokeWidth=".9"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M13 12 C 13 6, 19 4, 21 4 C 19 8, 17 10, 17 14"
                fill="none"
                stroke="currentColor"
                strokeWidth=".9"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
          </svg>
        </span>
        <blockquote className="marginalium-press__body">
          <p>
            Read this page <em>twice</em>. The first time, the eye catches the verb. The second, the ear catches the question. The verb <em>good at</em> does the work in plain sight. The question mark is the part the page protects.
          </p>
        </blockquote>
        <figcaption className="marginalium-press__sign">
          <span className="marginalium-press__sign-mark" aria-hidden="true">—</span>
          <em className="marginalium-press__sign-name">m³</em>
          <span className="marginalium-press__sign-rule" aria-hidden="true">
            <svg viewBox="0 0 80 6" preserveAspectRatio="none">
              <path
                d="M2 3c14-4 28 4 42-1s28-4 34 0"
                fill="none"
                stroke="currentColor"
                strokeWidth=".7"
                strokeLinecap="round"
                opacity=".6"
              />
            </svg>
          </span>
          <span className="marginalium-press__sign-note">a marginalium, written in the margin</span>
        </figcaption>
      </figure>

      <span className="marginalium-press__pencil" aria-hidden="true">
        <svg viewBox="0 0 140 18" preserveAspectRatio="none">
          <g filter={`url(#${grainId})`} opacity=".55">
            <path
              d="M2 11c10-6 22 4 34-1s22-5 34-2 22 4 34-1 22-5 32-1"
              fill="none"
              stroke="currentColor"
              strokeWidth=".7"
              strokeLinecap="round"
              pathLength="100"
              className="marginalium-press__pencil-stroke"
            />
          </g>
          <circle cx="138" cy="9" r="1" fill="currentColor" className="marginalium-press__pencil-bead" />
        </svg>
        <em className="marginalium-press__pencil-tag">set in <span>{voiceName}</span> · marked at <span>{wordLabel}</span> · <span>{setToday}</span></em>
      </span>
    </aside>
  )
}