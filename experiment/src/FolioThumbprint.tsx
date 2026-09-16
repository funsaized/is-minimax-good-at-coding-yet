import { useId, type CSSProperties } from 'react'
import type { VoiceId } from './Press'
import type { WordId } from './notes'

type FolioThumbprintProps = {
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
const VOICE_NAME: Record<VoiceId, string> = {
  quiet: 'quiet cut',
  human: 'human hand',
  bold: 'bold signal',
}
const VOICE_LETTER: Record<VoiceId, string> = { quiet: 'A', human: 'B', bold: 'C' }
const WORD_LABEL: Record<WordId, string> = { m3: 'm³', good: 'good at', yet: 'yet?' }
const WORD_GLYPH: Record<WordId, string> = { m3: '⌇', good: '∧', yet: '⌇' }

export function FolioThumbprint({ voice, word, setToday, readerName }: FolioThumbprintProps) {
  const baseId = useId().replace(/:/g, '')
  const grainId = `folio-thumbprint-grain-${baseId}`
  const tone = VOICE_TONE[voice]
  const reader = readerName.trim()
  const style = {
    '--thumbprint-tone': tone,
    '--thumbprint-grain': `url(#${grainId})`,
  } as CSSProperties
  const dateLine = `pressed on ${setToday}`
  return (
    <aside
      className={`folio-thumbprint folio-thumbprint--${voice} folio-thumbprint--word-${word} ${reader ? 'is-signed' : ''}`}
      aria-label={`A thumbprint of the page · ${VOICE_NAME[voice]} · marked at ${WORD_LABEL[word]} · ${reader ? `impressed for ${reader}` : 'impressed for the next reader'} · ${dateLine}`}
      style={style}
    >
      <svg className="folio-thumbprint__defs" viewBox="0 0 600 220" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <filter id={grainId} x="-2%" y="-2%" width="104%" height="104%">
            <feTurbulence type="fractalNoise" baseFrequency="2.4" numOctaves="2" seed="29" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .5 0" />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
        </defs>
      </svg>

      <span className="folio-thumbprint__rule folio-thumbprint__rule--lead" aria-hidden="true">
        <svg viewBox="0 0 320 12" preserveAspectRatio="none">
          <g filter={`url(#${grainId})`}>
            <path
              className="folio-thumbprint__rule-stroke"
              d="M2 6c20-4 40 4 60 0s40-4 60 0 40 4 60 0 40-4 60 0 16-1 18 0"
              fill="none"
              stroke="currentColor"
              strokeWidth=".8"
              strokeLinecap="round"
              pathLength="100"
              strokeDasharray="100 100"
            />
          </g>
          <circle className="folio-thumbprint__rule-bead" cx="2" cy="6" r="1" fill="currentColor" />
          <circle className="folio-thumbprint__rule-bead folio-thumbprint__rule-bead--end" cx="318" cy="6" r="1" fill="currentColor" />
        </svg>
        <span className="folio-thumbprint__rule-tag">
          <span className="folio-thumbprint__rule-tag-mark" />
          <span className="folio-thumbprint__rule-tag-text">
            folio i · a thumbprint <em>·</em> the page's own marginalium
          </span>
          <span className="folio-thumbprint__rule-tag-mark folio-thumbprint__rule-tag-mark--alt" />
        </span>
      </span>

      <div className="folio-thumbprint__body">
        <span className="folio-thumbprint__seal" aria-hidden="true">
          <svg viewBox="0 0 96 96">
            <g filter={`url(#${grainId})`} opacity=".95">
              <circle cx="48" cy="48" r="42" fill="none" stroke="currentColor" strokeWidth="1" />
              <circle cx="48" cy="48" r="34" fill="none" stroke="currentColor" strokeWidth=".35" strokeDasharray=".9 1.7" opacity=".7" />
              <circle cx="48" cy="48" r="22" fill="none" stroke="currentColor" strokeWidth=".3" opacity=".35" />
              <path
                d="M48 14 L48 22 M48 74 L48 82 M14 48 L22 48 M74 48 L82 48"
                stroke="currentColor"
                strokeWidth=".55"
                strokeLinecap="round"
                opacity=".55"
              />
              <text
                x="48"
                y="28"
                textAnchor="middle"
                fontFamily="ui-monospace, monospace"
                fontSize="4.4"
                letterSpacing="2.2"
                fill="currentColor"
                opacity=".78"
              >
                {VOICE_LETTER[voice]} · {WORD_LABEL[word].toUpperCase()}
              </text>
              <text
                x="48"
                y="58"
                textAnchor="middle"
                fontFamily="Georgia, 'Iowan Old Style', serif"
                fontStyle="italic"
                fontSize="28"
                letterSpacing="-.04em"
                fill="currentColor"
              >
                m³
              </text>
              <text
                x="48"
                y="74"
                textAnchor="middle"
                fontFamily="ui-monospace, monospace"
                fontSize="3.6"
                letterSpacing="1.6"
                fill="currentColor"
                opacity=".65"
              >
                PRESS · I
              </text>
            </g>
          </svg>
          <span className="folio-thumbprint__seal-glyph" aria-hidden="true">{WORD_GLYPH[word]}</span>
        </span>

        <span className="folio-thumbprint__copy">
          <span className="folio-thumbprint__copy-head" aria-hidden="true">
            <span className="folio-thumbprint__copy-eyebrow">
              <span className="folio-thumbprint__copy-eyebrow-mark" />
              <em>a thumbprint of this impression</em>
              <span className="folio-thumbprint__copy-eyebrow-mark folio-thumbprint__copy-eyebrow-mark--alt" />
            </span>
          </span>
          <p className="folio-thumbprint__copy-line">
            <em>Set in <span className="folio-thumbprint__copy-voice">{VOICE_NAME[voice]}</span>.</em>
            {' '}
            Marked at <em className="folio-thumbprint__copy-word">{WORD_LABEL[word]}</em>.
            {reader ? (
              <>
                {' '}
                Impressed for <em className="folio-thumbprint__copy-reader">{reader}</em>.
              </>
            ) : (
              <>
                {' '}
                <span className="folio-thumbprint__copy-open">Impressed for the next reader.</span>
              </>
            )}
            {' '}
            <span className="folio-thumbprint__copy-date">{dateLine}.</span>
          </p>
          <span className="folio-thumbprint__copy-foot" aria-hidden="true">
            <span className="folio-thumbprint__copy-foot-rule" />
            <span className="folio-thumbprint__copy-foot-text">
              a marginalium is a hand-written note in the press's own voice
            </span>
            <span className="folio-thumbprint__copy-foot-rule" />
          </span>
        </span>
      </div>

      <span className="folio-thumbprint__rule folio-thumbprint__rule--trail" aria-hidden="true">
        <svg viewBox="0 0 320 12" preserveAspectRatio="none">
          <g filter={`url(#${grainId})`}>
            <path
              d="M2 6c20-4 40 4 60 0s40-4 60 0 40 4 60 0 40-4 60 0 16-1 18 0"
              fill="none"
              stroke="currentColor"
              strokeWidth=".8"
              strokeLinecap="round"
              opacity=".55"
            />
          </g>
          <circle cx="2" cy="6" r="1" fill="currentColor" />
          <circle cx="318" cy="6" r="1" fill="currentColor" />
        </svg>
      </span>
    </aside>
  )
}
