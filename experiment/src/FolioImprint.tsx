import { useId, type CSSProperties } from 'react'
import type { VoiceId } from './Press'

type FolioImprintProps = {
  voice: VoiceId
  variant?: 'motto' | 'inscription' | 'sign-off'
  number?: string
}

const VOICE_TONE: Record<VoiceId, string> = {
  quiet: 'var(--blue)',
  human: 'var(--coral)',
  bold: 'var(--acid)',
}

const VOICE_GLYPH: Record<VoiceId, string> = {
  quiet: '·',
  human: '✦',
  bold: '■',
}

const MOTTO: Record<VoiceId, string> = {
  quiet: 'attention is a kind of care',
  human: 'a careful page makes the machine quieter',
  bold: 'say it once, then say it again, then stop',
}

const INSCRIPTION: Record<VoiceId, string> = {
  quiet: 'set today · read tomorrow · kept for the next reader',
  human: 'composed by hand, folded once, sent on its way',
  bold: 'pressed, signed, and left open on the desk',
}

const SIGN_OFF: Record<VoiceId, string> = {
  quiet: 'the line keeps its quiet, the question keeps its room',
  human: 'signed in pencil · the ink still drying',
  bold: 'pressed and posted · no apology, no revision',
}

export function FolioImprint({ voice, variant = 'motto', number }: FolioImprintProps) {
  const baseId = useId().replace(/:/g, '')
  const grainId = `folio-imprint-grain-${baseId}`
  const tone = VOICE_TONE[voice]
  const text = variant === 'motto' ? MOTTO[voice] : variant === 'sign-off' ? SIGN_OFF[voice] : INSCRIPTION[voice]
  const eyebrow =
    variant === 'motto' ? 'the press motto' : variant === 'sign-off' ? 'signing off' : 'an inscription'
  const style = {
    '--imprint-tone': tone,
    '--imprint-glyph': `"${VOICE_GLYPH[voice]}"`,
  } as CSSProperties

  return (
    <figure
      className={`folio-imprint folio-imprint--${variant} folio-imprint--${voice}`}
      style={style}
      aria-label={`${eyebrow} · ${text} · voice ${voice}${number ? ` · number ${number}` : ''}`}
    >
      <svg className="folio-imprint__defs" viewBox="0 0 800 40" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <filter id={grainId} x="-2%" y="-50%" width="104%" height="200%">
            <feTurbulence type="fractalNoise" baseFrequency="2.6" numOctaves="2" seed="83" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .42 0" />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
        </defs>
      </svg>

      <span className="folio-imprint__rule folio-imprint__rule--lead" aria-hidden="true">
        <svg viewBox="0 0 320 6" preserveAspectRatio="none">
          <g filter={`url(#${grainId})`}>
            <path
              d="M2 3c26-3 52 3 78 0s52-3 78 0 52 3 78 0 52-3 32 0"
              fill="none"
              stroke="currentColor"
              strokeWidth=".6"
              strokeLinecap="round"
              opacity=".7"
            />
          </g>
          <circle cx="2" cy="3" r="1" fill="currentColor" />
        </svg>
      </span>

      <span className="folio-imprint__head" aria-hidden="true">
        <span className="folio-imprint__head-glyph" />
        <em className="folio-imprint__head-eyebrow">{eyebrow}</em>
        {number && <span className="folio-imprint__head-num">№ {number}</span>}
        <span className="folio-imprint__head-glyph folio-imprint__head-glyph--alt" />
      </span>

      <blockquote className="folio-imprint__body">
        <span className="folio-imprint__body-glyph folio-imprint__body-glyph--lead" aria-hidden="true">
          “
        </span>
        <em className="folio-imprint__body-text">{text}</em>
        <span className="folio-imprint__body-glyph folio-imprint__body-glyph--trail" aria-hidden="true">
          ”
        </span>
      </blockquote>

      <figcaption className="folio-imprint__sign" aria-hidden="true">
        <span className="folio-imprint__sign-mark">—</span>
        <span className="folio-imprint__sign-name">m³ press</span>
        <span className="folio-imprint__sign-rule">
          <svg viewBox="0 0 100 4" preserveAspectRatio="none">
            <path
              d="M2 2c12-3 24 3 36-1s24-3 36 0 18 2 22 1"
              fill="none"
              stroke="currentColor"
              strokeWidth=".5"
              strokeLinecap="round"
              opacity=".6"
            />
            <circle cx="98" cy="2" r=".9" fill="currentColor" />
          </svg>
        </span>
        <span className="folio-imprint__sign-voice">
          set in <em>{voice === 'quiet' ? 'quiet cut' : voice === 'human' ? 'human hand' : 'bold signal'}</em>
        </span>
      </figcaption>

      <span className="folio-imprint__rule folio-imprint__rule--trail" aria-hidden="true">
        <svg viewBox="0 0 320 6" preserveAspectRatio="none">
          <g filter={`url(#${grainId})`}>
            <path
              d="M2 3c26-3 52 3 78 0s52-3 78 0 52 3 78 0 52-3 32 0"
              fill="none"
              stroke="currentColor"
              strokeWidth=".6"
              strokeLinecap="round"
              opacity=".55"
            />
          </g>
          <circle cx="318" cy="3" r="1" fill="currentColor" />
        </svg>
      </span>
    </figure>
  )
}