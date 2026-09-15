import { useId } from 'react'
import type { CSSProperties } from 'react'
import type { VoiceId } from './Press'

type TitleFolioProps = {
  voice: VoiceId
  setToday: string
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

const VOICE_LABEL: Record<VoiceId, string> = {
  quiet: 'quiet cut',
  human: 'human hand',
  bold: 'bold signal',
}

export function TitleFolio({ voice, setToday }: TitleFolioProps) {
  const baseId = useId().replace(/:/g, '')
  const style = {
    '--title-folio-tone': VOICE_TONE[voice],
    '--title-folio-glyph': `"${VOICE_GLYPH[voice]}"`,
  } as CSSProperties
  return (
    <aside
      className={`title-folio title-folio--${voice}`}
      aria-label="The title page's signed folio closing"
      style={style}
    >
      <span className="title-folio__edge title-folio__edge--lead" aria-hidden="true">
        <svg viewBox="0 0 320 14" preserveAspectRatio="none">
          <path
            d="M2 7c26-3 52 3 78 0s52-3 78 0 52 3 78 0 52-3 78 0 4 0 6 0"
            fill="none"
            stroke="currentColor"
            strokeWidth=".9"
            strokeLinecap="round"
            pathLength="100"
            strokeDasharray="100 100"
            className="title-folio__edge-stroke"
          />
          <circle cx="2" cy="7" r="1.1" fill="currentColor" />
          <circle cx="318" cy="7" r="1.1" fill="currentColor" />
        </svg>
        <span className="title-folio__edge-tag">
          <span className="title-folio__edge-tag-glyph" aria-hidden="true">‡</span>
          folio ends · a pressed signature
          <span className="title-folio__edge-tag-glyph" aria-hidden="true">‡</span>
        </span>
      </span>

      <div className="title-folio__plate">
        <span className="title-folio__crop title-folio__crop--tl" aria-hidden="true" />
        <span className="title-folio__crop title-folio__crop--tr" aria-hidden="true" />
        <span className="title-folio__crop title-folio__crop--bl" aria-hidden="true" />
        <span className="title-folio__crop title-folio__crop--br" aria-hidden="true" />

        <span className="title-folio__head" aria-hidden="true">
          <span className="title-folio__head-mark">※</span>
          <span className="title-folio__head-text">imprint of the title page</span>
          <span className="title-folio__head-mark title-folio__head-mark--alt">※</span>
        </span>

        <div className="title-folio__row">
          <span className="title-folio__folio" aria-hidden="true">
            <span className="title-folio__folio-letter">i</span>
            <span className="title-folio__folio-stack">
              <span className="title-folio__folio-num">№ 01 / x</span>
              <span className="title-folio__folio-name">folio ends</span>
            </span>
            <span className="title-folio__folio-rule" />
          </span>

          <span className="title-folio__copy">
            <span className="title-folio__line">
              <span className="title-folio__line-mark" aria-hidden="true">
                <svg viewBox="0 0 12 12">
                  <circle cx="6" cy="6" r="5" fill="none" stroke="currentColor" strokeWidth=".5" />
                  <circle cx="6" cy="6" r="1.4" fill="currentColor" />
                </svg>
              </span>
              <span className="title-folio__line-eyebrow">composed by hand</span>
            </span>
            <em className="title-folio__inscription">for the next reader</em>
            <span className="title-folio__inscription-rule" aria-hidden="true">
              <svg viewBox="0 0 200 6" preserveAspectRatio="none">
                <path
                  d="M2 3c14-3 28 3 44-1s30-3 44 0 28 3 44-1 30-3 44 0 18 1 18 1"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth=".7"
                  strokeLinecap="round"
                  className="title-folio__inscription-rule-stroke"
                />
                <circle cx="198" cy="3" r="1" fill="currentColor" />
              </svg>
            </span>
            <span className="title-folio__date">
              <span className="title-folio__date-eyebrow">set today</span>
              <span className="title-folio__date-value">{setToday}</span>
            </span>
          </span>

          <span className="title-folio__stamp" aria-hidden="true">
            <svg viewBox="0 0 72 72">
              <defs>
                <filter id={`title-folio-stamp-grain-${baseId}`} x="-12%" y="-12%" width="124%" height="124%">
                  <feTurbulence type="fractalNoise" baseFrequency="2.6" numOctaves="2" seed="7" stitchTiles="stitch" />
                  <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .5 0" />
                  <feComposite in2="SourceGraphic" operator="in" />
                </filter>
              </defs>
              <g filter={`url(#title-folio-stamp-grain-${baseId})`} opacity=".92">
                <circle cx="36" cy="36" r="32" fill="none" stroke="currentColor" strokeWidth="1.1" />
                <circle cx="36" cy="36" r="26" fill="none" stroke="currentColor" strokeWidth=".35" strokeDasharray="1 2" opacity=".65" />
                <text x="36" y="22" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="4" letterSpacing="1.6" fill="currentColor">FOLIO · i</text>
                <text x="36" y="42" textAnchor="middle" fontFamily="Georgia, serif" fontStyle="italic" fontSize="17" fill="currentColor">m³</text>
                <text x="36" y="54" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="3.4" letterSpacing="1.4" fill="currentColor">PRESS · SIGNED</text>
              </g>
            </svg>
            <span className="title-folio__stamp-wax">
              <span className="title-folio__stamp-wax-bead" />
              <span className="title-folio__stamp-wax-wisp" />
            </span>
          </span>
        </div>

        <span className="title-folio__foot" aria-hidden="true">
          <span className="title-folio__foot-rule" />
          <span className="title-folio__foot-row">
            <span className="title-folio__foot-cell title-folio__foot-cell--press">
              <span className="title-folio__foot-cell-key">the press</span>
              <span className="title-folio__foot-cell-value">
                m<sup>3</sup>
              </span>
            </span>
            <span className="title-folio__foot-cell title-folio__foot-cell--voice">
              <span className="title-folio__foot-cell-key">set in</span>
              <span className={`title-folio__foot-cell-value title-folio__foot-cell-voice title-folio__foot-cell-voice--${voice}`}>
                <span className="title-folio__foot-cell-voice-glyph" aria-hidden="true" />
                {VOICE_LABEL[voice]}
              </span>
            </span>
            <span className="title-folio__foot-cell title-folio__foot-cell--cycle">
              <span className="title-folio__foot-cell-key">cycle</span>
              <span className="title-folio__foot-cell-value title-folio__foot-cell-kbd">
                <kbd>shift</kbd>
                <span aria-hidden="true">+</span>
                <kbd>v</kbd>
              </span>
            </span>
          </span>
          <span className="title-folio__foot-rule title-folio__foot-rule--trail" />
        </span>

        <span className="title-folio__pencil" aria-hidden="true">
          <svg viewBox="0 0 240 18" preserveAspectRatio="none">
            <path
              d="M2 10c18-7 36 4 54-1s36-7 54-1 36 4 54-2 36-7 54-1 14 0 18 0"
              fill="none"
              stroke="currentColor"
              strokeWidth=".8"
              strokeLinecap="round"
              pathLength="100"
              strokeDasharray="100 100"
              className="title-folio__pencil-stroke"
            />
            <circle cx="238" cy="8" r="1.2" fill="currentColor" className="title-folio__pencil-bead" />
          </svg>
        </span>
      </div>

      <span className="title-folio__trail" aria-hidden="true">
        <span className="title-folio__trail-cell title-folio__trail-cell--lead">
          <span className="title-folio__trail-tag">a press</span>
          <span className="title-folio__trail-text">one lever · one line · three settings</span>
        </span>
        <span className="title-folio__trail-mark" aria-hidden="true">→</span>
        <span className="title-folio__trail-cell">
          <span className="title-folio__trail-tag">folio ii</span>
          <span className="title-folio__trail-text">the press bed</span>
        </span>
      </span>
    </aside>
  )
}