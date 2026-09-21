import type { VoiceId } from './Press'
import type { WordId } from './notes'
import { PressStamp } from './PressStamp'
import { KeptMark } from './KeptMark'

type ColophonProps = {
  voice: VoiceId
  word: WordId
  setToday: string
  readerName: string
}

const VOICE_LETTER: Record<VoiceId, string> = { quiet: 'A', human: 'B', bold: 'C' }

function ArrowIcon() {
  return (
    <svg className="arrow-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 12h15M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function Colophon({ voice, word, setToday, readerName }: ColophonProps) {
  const tag = voice === 'bold' ? 'NO APOLOGIES' : voice === 'human' ? 'BY HAND' : 'SET WITH CARE'
  const voiceName = voice === 'bold' ? 'bold signal' : voice === 'human' ? 'human hand' : 'quiet cut'
  const mark = word === 'm3' ? 'stet' : word === 'good' ? 'caret' : 'query'
  const label = word === 'm3' ? 'M3' : word === 'good' ? 'good at' : 'yet?'
  const signedReader = readerName.trim()
  const signedLine = signedReader
    ? `impressed for ${signedReader}`
    : 'impressed for the next reader'

  return (
    <footer className={`colophon ${signedReader ? 'is-signed' : ''}`} aria-label="Colophon — hand-pressed dedication">
      <div className="colophon__plate">
        <span className="colophon__corner colophon__corner--tl" aria-hidden="true" />
        <span className="colophon__corner colophon__corner--tr" aria-hidden="true" />
        <span className="colophon__corner colophon__corner--bl" aria-hidden="true" />
        <span className="colophon__corner colophon__corner--br" aria-hidden="true" />

        <header className="colophon__strip" aria-hidden="true">
          <span className="colophon__strip-tag">
            <span className="colophon__strip-dot" />
            <em>folio v</em>
            <span aria-hidden="true">·</span>
            the colophon closes
            <span className="colophon__strip-dot" />
          </span>
          <span className="colophon__strip-rule" />
          <span className="colophon__strip-meta">
            m<sup>3</sup> press <span aria-hidden="true">·</span> imprint of this impression
          </span>
        </header>

        <div className="colophon__center">
          <span className="colophon__seal" aria-hidden="true">
            <span className="colophon__seal-halo" />
            <span className="colophon__seal-disc">
              <PressStamp voice={voice} size={188} />
            </span>
            <span className="colophon__seal-wax">
              <span className="colophon__seal-wax-bead" />
              <span className="colophon__seal-wax-wisp" />
            </span>
          </span>

          <div className="colophon__dedication">
            <span className="colophon__dedication-eyebrow">
              <span className="colophon__dedication-pilcrow" aria-hidden="true">¶</span>
              hand-pressed for
              <span className="colophon__dedication-pilcrow colophon__dedication-pilcrow--alt" aria-hidden="true">¶</span>
            </span>
            <em className="colophon__dedication-name">{signedReader || 'the next reader'}</em>
            <span className="colophon__dedication-line" aria-hidden="true">
              <svg viewBox="0 0 360 14" preserveAspectRatio="none">
                <path
                  d="M2 7c24-6 48 6 72-2s48-7 72-1 48 5 72-2 48-7 72-1 48 5 50-1"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth=".85"
                  strokeLinecap="round"
                  pathLength="100"
                  className="colophon__dedication-line-stroke"
                />
                <circle cx="356" cy="6" r="1.4" fill="currentColor" />
              </svg>
            </span>
            <span className="colophon__dedication-tag">
              <em>a single line · three readings · one breath</em>
            </span>
          </div>
        </div>

        <div className="colophon__meta">
          <div className="colophon__row">
            <span className="colophon__label">composed in</span>
            <span className="colophon__value colophon__voice-cell">
              <span className={`colophon__voice-letter colophon__voice-letter--${voice}`}>{VOICE_LETTER[voice]}</span>
              <em>{voiceName}</em>
              <span className="colophon__voice-tag">{tag}</span>
            </span>
          </div>
          <div className="colophon__row">
            <span className="colophon__label">marked at</span>
            <span className="colophon__value">
              <em>{label}</em>
              <span className="colophon__row-mark">{mark}</span>
            </span>
          </div>
          <div className="colophon__row">
            <span className="colophon__label">set on</span>
            <span className="colophon__value">
              <em>{setToday}</em>
              <span className="colophon__row-sub">folio v · the colophon</span>
            </span>
          </div>
        </div>

        <div className="colophon__signature" aria-hidden="true">
          <KeptMark voice={voice} variant="colophon" size={144} caption={`composed by m³ · ${signedLine} · ${setToday}`} />
        </div>

        <div className="colophon__foot">
          <p className="colophon__line">the question remains useful <i>because the answer can change</i></p>
          <a className="colophon__back" href="#question" aria-label="Back to the question">
            back to the question
            <ArrowIcon />
          </a>
        </div>
      </div>

      <p className="colophon__signature-note">
        <span aria-hidden="true">※</span>
        a quiet piece of an ongoing conversation about what good front-end work actually is.
      </p>
    </footer>
  )
}
