import { useId } from 'react'
import type { CSSProperties } from 'react'
import type { VoiceId } from './Press'

type FolioTicketProps = {
  voice: VoiceId
  setToday: string
  folio: string
}

const TONE: Record<VoiceId, string> = {
  quiet: 'var(--blue)',
  human: 'var(--coral)',
  bold: 'var(--acid)',
}

const VOICE_LETTER: Record<VoiceId, string> = {
  quiet: 'A',
  human: 'B',
  bold: 'C',
}

const VOICE_LABEL: Record<VoiceId, string> = {
  quiet: 'quiet cut',
  human: 'human hand',
  bold: 'bold signal',
}

export function FolioTicket({ voice, setToday, folio }: FolioTicketProps) {
  const baseId = useId()
  const tagGradId = `folio-ticket-grad-${baseId.replace(/:/g, '')}`
  const style = { '--ticket-tone': TONE[voice] } as CSSProperties

  return (
    <figure className="folio-ticket" style={style} aria-hidden="true">
      <svg
        className="folio-ticket__string"
        viewBox="0 0 80 80"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M76 4 C 60 22, 44 42, 28 70"
          fill="none"
          stroke="currentColor"
          strokeWidth=".8"
          strokeLinecap="round"
          opacity=".6"
          className="folio-ticket__string-path"
        />
        <path
          d="M70 2 L 78 6 L 72 12"
          fill="none"
          stroke="currentColor"
          strokeWidth=".8"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity=".7"
        />
      </svg>

      <span className="folio-ticket__eyelet" aria-hidden="true">
        <svg viewBox="0 0 14 14">
          <circle cx="7" cy="7" r="5.4" fill="rgba(14, 18, 28, .92)" stroke="currentColor" strokeWidth=".6" />
          <circle cx="7" cy="7" r="2.4" fill="currentColor" opacity=".25" />
        </svg>
      </span>

      <span className="folio-ticket__card">
        <span className="folio-ticket__notch folio-ticket__notch--top" aria-hidden="true" />
        <span className="folio-ticket__notch folio-ticket__notch--bot" aria-hidden="true" />
        <span className="folio-ticket__edge" aria-hidden="true" />
        <svg className="folio-ticket__bg" viewBox="0 0 100 140" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <linearGradient id={tagGradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(243, 232, 200, .95)" />
              <stop offset="60%" stopColor="rgba(238, 222, 184, .92)" />
              <stop offset="100%" stopColor="rgba(228, 208, 168, .94)" />
            </linearGradient>
          </defs>
          <rect x="2" y="2" width="96" height="136" fill={`url(#${tagGradId})`} stroke="rgba(60, 40, 22, .25)" strokeWidth=".5" />
          <line x1="2" y1="32" x2="98" y2="32" stroke="rgba(60, 40, 22, .15)" strokeWidth=".4" strokeDasharray="1.2 1.6" />
          <line x1="2" y1="108" x2="98" y2="108" stroke="rgba(60, 40, 22, .15)" strokeWidth=".4" strokeDasharray="1.2 1.6" />
          <circle cx="50" cy="20" r="1.2" fill="rgba(60, 40, 22, .5)" />
        </svg>

        <span className="folio-ticket__row folio-ticket__row--top">
          <span className="folio-ticket__press">m³ press</span>
          <span className="folio-ticket__folio">folio {folio}</span>
        </span>

        <span className="folio-ticket__head">
          <span className="folio-ticket__seal" aria-hidden="true">
            <svg viewBox="0 0 28 28">
              <circle cx="14" cy="14" r="11.5" fill="none" stroke="currentColor" strokeWidth=".7" />
              <circle cx="14" cy="14" r="7" fill="none" stroke="currentColor" strokeWidth=".35" strokeDasharray=".8 1.6" opacity=".7" />
              <text
                x="14"
                y="17.5"
                textAnchor="middle"
                fontFamily="Georgia, 'Iowan Old Style', serif"
                fontStyle="italic"
                fontSize="9.5"
                fill="currentColor"
              >
                m³
              </text>
            </svg>
          </span>
          <span className="folio-ticket__copy">
            <span className="folio-ticket__eyebrow">a single impression</span>
            <span className="folio-ticket__title">composed<br />by hand</span>
          </span>
        </span>

        <span className="folio-ticket__ruler" aria-hidden="true">
          <svg viewBox="0 0 88 8" preserveAspectRatio="none">
            {Array.from({ length: 11 }).map((_, index) => (
              <line
                key={index}
                x1={index * 8.8}
                y1={index % 2 === 0 ? 0 : 4}
                x2={index * 8.8}
                y2="8"
                stroke="rgba(60, 40, 22, .35)"
                strokeWidth=".35"
              />
            ))}
          </svg>
        </span>

        <span className="folio-ticket__meta">
          <span className="folio-ticket__meta-row">
            <span className="folio-ticket__meta-label">voice</span>
            <span className="folio-ticket__meta-value">
              <span className="folio-ticket__voice-letter">{VOICE_LETTER[voice]}</span>
              <span>{VOICE_LABEL[voice]}</span>
            </span>
          </span>
          <span className="folio-ticket__meta-row">
            <span className="folio-ticket__meta-label">set</span>
            <span className="folio-ticket__meta-value folio-ticket__meta-value--date">{setToday}</span>
          </span>
        </span>

        <span className="folio-ticket__pin" aria-hidden="true">
          <svg viewBox="0 0 18 18">
            <ellipse cx="9" cy="16" rx="3.6" ry=".9" fill="rgba(14, 18, 28, .35)" />
            <line x1="9" y1="11" x2="9" y2="16" stroke="rgba(14, 18, 28, .35)" strokeWidth=".7" />
            <circle cx="9" cy="7" r="5" fill="var(--wax)" />
            <circle cx="7.5" cy="5.5" r="1.5" fill="rgba(255, 255, 255, .5)" />
            <circle cx="10.5" cy="9" r="1" fill="rgba(0, 0, 0, .25)" />
          </svg>
        </span>
      </span>
    </figure>
  )
}
