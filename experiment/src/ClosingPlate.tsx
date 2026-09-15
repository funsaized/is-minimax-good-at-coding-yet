import { useEffect, useId, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import type { VoiceId } from './Press'
import type { WordId } from './notes'
import type { ImpressionMark } from './ImpressionRibbon'
import { PressStamp } from './PressStamp'

type ClosingPlateProps = {
  voice: VoiceId
  word: WordId
  readerName: string
  marks: ImpressionMark[]
  setToday: string
  activeFolioIndex: string
  activeFolioLabel: string
}

const VOICE_LABEL: Record<VoiceId, string> = { quiet: 'quiet cut', human: 'human hand', bold: 'bold signal' }
const VOICE_FACE: Record<VoiceId, string> = {
  quiet: 'serif · italic · close set',
  human: 'serif · italic · warm',
  bold: 'sans · heavy · no apology',
}
const VOICE_SAMPLE: Record<VoiceId, { display: string; weight: number; style: 'normal' | 'italic'; family: string; tracking: string }> = {
  quiet: { display: 'is M3', weight: 400, style: 'italic', family: 'var(--serif)', tracking: '-0.022em' },
  human: { display: 'is M3', weight: 500, style: 'italic', family: 'var(--serif)', tracking: '-0.018em' },
  bold: { display: 'IS M3', weight: 800, style: 'normal', family: 'var(--sans)', tracking: '-0.05em' },
}
const VOICE_LETTER: Record<VoiceId, string> = { quiet: 'A', human: 'B', bold: 'C' }
const VOICE_TONE: Record<VoiceId, string> = {
  quiet: 'var(--blue)',
  human: 'var(--coral)',
  bold: 'var(--acid)',
}

const WORD_LABEL: Record<WordId, string> = { m3: 'm³', good: 'good at', yet: 'yet?' }
const WORD_MARK: Record<WordId, string> = { m3: 'stet', good: 'caret', yet: 'query' }
const WORD_INK: Record<WordId, string> = { m3: 'var(--acid)', good: 'var(--coral)', yet: 'var(--blue)' }

function buildSignaturePath(seed: number, width = 720) {
  const w = width
  const baseY = 22
  const amp = 6 + (seed % 4) * 0.6
  const a = w * 0.18
  const b = w * 0.36
  const c = w * 0.55
  const d = w * 0.74
  const e = w * 0.9
  return [
    `M 2 ${baseY}`,
    `C ${a} ${baseY - amp}, ${b} ${baseY + amp}, ${b + a * 0.5} ${baseY - 2}`,
    `S ${c} ${baseY + amp * 0.8}, ${c + a * 0.4} ${baseY - 1}`,
    `S ${d} ${baseY - amp * 0.6}, ${d + a * 0.3} ${baseY + 2}`,
    `S ${e} ${baseY + amp * 0.5}, ${w - 8} ${baseY - 1}`,
  ].join(' ')
}

export function ClosingPlate({
  voice,
  word,
  readerName,
  marks,
  setToday,
  activeFolioIndex,
  activeFolioLabel,
}: ClosingPlateProps) {
  const baseId = useId().replace(/:/g, '')
  const paperGrainId = `closing-plate-paper-${baseId}`
  const ruleGrainId = `closing-plate-rule-${baseId}`
  const rootRef = useRef<HTMLElement>(null)
  const [revealed, setRevealed] = useState(false)

  const tone = VOICE_TONE[voice]
  const style = {
    '--closing-tone': tone,
    '--closing-word-ink': WORD_INK[word],
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
        const visible = entries.some(entry => entry.isIntersecting)
        if (visible) {
          setRevealed(true)
          observer.disconnect()
        }
      },
      { threshold: 0.16, rootMargin: '0px 0px -8% 0px' },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  const pullCount = marks.reduce((acc, mark) => (mark.kind === 'pull' ? acc + 1 : acc), 0)
  const wordCount = marks.reduce((acc, mark) => (mark.kind === 'word' ? acc + 1 : acc), 0)
  const voiceCount = marks.reduce((acc, mark) => (mark.kind === 'voice' ? acc + 1 : acc), 0)
  const signedReader = readerName.trim()
  const addressedTo = signedReader ? `for ${signedReader}` : 'for the next reader'

  return (
    <footer
      ref={rootRef}
      className={`closing-plate closing-plate--${voice} ${revealed ? 'is-revealed' : ''} ${signedReader ? 'is-signed' : ''}`}
      style={style}
      aria-label="Closing press plate"
    >
      <span className="closing-plate__eyebrow" aria-hidden="true">
        <span className="closing-plate__eyebrow-mark closing-plate__eyebrow-mark--lead">‡</span>
        the colophon closes
        <span className="closing-plate__eyebrow-tag">
          <span className="closing-plate__eyebrow-dot" />
          back matter · folio viii·
          <span className="closing-plate__eyebrow-dot" />
        </span>
        <span className="closing-plate__eyebrow-mark">‡</span>
      </span>

      <div className="closing-plate__frame">
        <svg className="closing-plate__paper" viewBox="0 0 800 600" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <filter id={paperGrainId} x="0%" y="0%" width="100%" height="100%">
              <feTurbulence type="fractalNoise" baseFrequency="0.86" numOctaves="2" seed="44" stitchTiles="stitch" />
              <feColorMatrix type="matrix" values="0 0 0 0 .14  0 0 0 0 .13  0 0 0 0 .2  0 0 0 .05 0" />
              <feComposite in2="SourceGraphic" operator="in" />
            </filter>
          </defs>
          <rect x="0" y="0" width="800" height="600" filter={`url(#${paperGrainId})`} />
        </svg>

        <span className="closing-plate__crop closing-plate__crop--tl" aria-hidden="true" />
        <span className="closing-plate__crop closing-plate__crop--tr" aria-hidden="true" />
        <span className="closing-plate__crop closing-plate__crop--bl" aria-hidden="true" />
        <span className="closing-plate__crop closing-plate__crop--br" aria-hidden="true" />

        <span className="closing-plate__tipped" aria-hidden="true">
          <span className="closing-plate__tipped-mark" />
          tipped leaf · back matter
        </span>
        <span className="closing-plate__bleed" aria-hidden="true" />
        <span className="closing-plate__glue closing-plate__glue--top" aria-hidden="true" />
        <span className="closing-plate__glue closing-plate__glue--bottom" aria-hidden="true" />

        <svg
          className="closing-plate__rule"
          viewBox="0 0 720 8"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id={`closing-plate-rule-gradient-${baseId}`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
              <stop offset="14%" stopColor="currentColor" stopOpacity=".55" />
              <stop offset="50%" stopColor="currentColor" stopOpacity=".95" />
              <stop offset="86%" stopColor="currentColor" stopOpacity=".55" />
              <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
            </linearGradient>
            <filter id={ruleGrainId} x="-2%" y="-50%" width="104%" height="200%">
              <feTurbulence type="fractalNoise" baseFrequency="2.6" numOctaves="2" seed="29" stitchTiles="stitch" />
              <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .5 0" />
              <feComposite in2="SourceGraphic" operator="in" />
            </filter>
          </defs>
          <g filter={`url(#${ruleGrainId})`} opacity=".85">
            <path
              d="M2 4 L718 4"
              fill="none"
              stroke={`url(#closing-plate-rule-gradient-${baseId})`}
              strokeWidth=".9"
              strokeLinecap="round"
              pathLength="100"
              strokeDasharray="100 100"
              className="closing-plate__rule-stroke"
            />
          </g>
          <circle cx="2" cy="4" r="1.3" fill="currentColor" className="closing-plate__rule-bead closing-plate__rule-bead--lead" />
          <circle cx="718" cy="4" r="1.3" fill="currentColor" className="closing-plate__rule-bead closing-plate__rule-bead--trail" />
        </svg>

        <span className="closing-plate__signature-wrap" aria-hidden="true">
          <svg
            className="closing-plate__signature"
            viewBox="0 0 720 44"
            preserveAspectRatio="none"
          >
            <path
              d={buildSignaturePath(7)}
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              pathLength="100"
              strokeDasharray="100 100"
              className="closing-plate__signature-stroke"
            />
            <circle cx="714" cy="22" r="2.4" fill="currentColor" className="closing-plate__signature-bead" />
            <circle cx="714" cy="22" r="6" fill="none" stroke="currentColor" strokeWidth=".4" strokeDasharray=".8 1.6" opacity=".55" className="closing-plate__signature-halo" />
          </svg>
        </span>

        <div className="closing-plate__inscription">
          <span className="closing-plate__inscription-eyebrow" aria-hidden="true">
            <span className="closing-plate__inscription-eyebrow-mark" />
            this impression · set and signed
          </span>

          <p className="closing-plate__inscription-line">
            <span className="closing-plate__inscription-piece">
              <em className="closing-plate__inscription-key">set in</em>
              <span className={`closing-plate__inscription-voice closing-plate__inscription-voice--${voice}`}>
                <span className="closing-plate__inscription-voice-letter" aria-hidden="true">{VOICE_LETTER[voice]}</span>
                <em>{VOICE_LABEL[voice]}</em>
              </span>
            </span>
            <span className="closing-plate__inscription-sep" aria-hidden="true">·</span>
            <span className="closing-plate__inscription-piece">
              <em className="closing-plate__inscription-key">marked at</em>
              <span className={`closing-plate__inscription-word closing-plate__inscription-word--${word}`}>
                <span className="closing-plate__inscription-word-mark">{WORD_MARK[word]}</span>
                <em>{WORD_LABEL[word]}</em>
              </span>
            </span>
          </p>

          <p className="closing-plate__inscription-line closing-plate__inscription-line--alt">
            <span className="closing-plate__inscription-piece">
              <em className="closing-plate__inscription-key">addressed</em>
              <span className={`closing-plate__inscription-reader ${signedReader ? 'is-set' : ''}`}>
                {signedReader ? (
                  <>
                    <span className="closing-plate__inscription-reader-to" aria-hidden="true">to</span>
                    <em className="closing-plate__inscription-reader-name">{signedReader}</em>
                  </>
                ) : (
                  <em className="closing-plate__inscription-reader-name closing-plate__inscription-reader-name--unset">to the next reader</em>
                )}
              </span>
            </span>
            <span className="closing-plate__inscription-sep" aria-hidden="true">·</span>
            <span className="closing-plate__inscription-piece">
              <em className="closing-plate__inscription-key">set on</em>
              <span className="closing-plate__inscription-date">{setToday}</span>
            </span>
          </p>
        </div>

        <span className="closing-plate__presslog" aria-live="polite">
          <span className="closing-plate__presslog-rule closing-plate__presslog-rule--lead" aria-hidden="true" />
          <span className="closing-plate__presslog-mark" aria-hidden="true">※</span>
          <span className="closing-plate__presslog-body">
            <span className="closing-plate__presslog-tag">the press log</span>
            <span className="closing-plate__presslog-row">
              <em className="closing-plate__presslog-key">{pullCount}</em>
              <span className="closing-plate__presslog-suffix">{pullCount === 1 ? 'pull' : 'pulls'}</span>
              <span className="closing-plate__presslog-dot" aria-hidden="true">·</span>
              <em className="closing-plate__presslog-key">{wordCount}</em>
              <span className="closing-plate__presslog-suffix">{wordCount === 1 ? 'word marked' : 'words marked'}</span>
              <span className="closing-plate__presslog-dot" aria-hidden="true">·</span>
              <em className="closing-plate__presslog-key">{voiceCount}</em>
              <span className="closing-plate__presslog-suffix">{voiceCount === 1 ? 'voice set' : 'voice sets'}</span>
              <span className="closing-plate__presslog-dot" aria-hidden="true">·</span>
              <span className="closing-plate__presslog-now">now at folio <em>{activeFolioIndex}</em> · {activeFolioLabel}</span>
            </span>
          </span>
          <span className="closing-plate__presslog-mark closing-plate__presslog-mark--alt" aria-hidden="true">※</span>
          <span className="closing-plate__presslog-rule closing-plate__presslog-rule--trail" aria-hidden="true" />
        </span>

        <ol className="closing-plate__voices" aria-label="The three voices, set on this closing plate">
          {(['quiet', 'human', 'bold'] as VoiceId[]).map(v => {
            const sample = VOICE_SAMPLE[v]
            const isActive = v === voice
            const sampleStyle: CSSProperties = {
              fontFamily: sample.family,
              fontWeight: sample.weight,
              fontStyle: sample.style,
              letterSpacing: sample.tracking,
            }
            return (
              <li
                key={v}
                className={`closing-plate__voices-cell closing-plate__voices-cell--${v} ${isActive ? 'is-active' : ''}`}
              >
                <span className="closing-plate__voices-tag">
                  <span className="closing-plate__voices-letter" aria-hidden="true">{VOICE_LETTER[v]}</span>
                  <span className="closing-plate__voices-name">{VOICE_LABEL[v]}</span>
                </span>
                <span className="closing-plate__voices-sample" style={sampleStyle}>{sample.display}</span>
                <span className="closing-plate__voices-face">{VOICE_FACE[v]}</span>
                {isActive && <span className="closing-plate__voices-now" aria-hidden="true">active</span>}
              </li>
            )
          })}
        </ol>

        <div className="closing-plate__stamp" aria-hidden="true">
          <PressStamp voice={voice} size={88} />
          <span className="closing-plate__stamp-wax">
            <span className="closing-plate__stamp-wax-bead" />
            <span className="closing-plate__stamp-wax-wisp" />
          </span>
          <span className="closing-plate__stamp-tag">pressed at the close</span>
        </div>

        <div className="closing-plate__foot">
          <span className="closing-plate__foot-rule" aria-hidden="true" />
          <p className="closing-plate__foot-line">
            <em className="closing-plate__foot-em">the question stays open · this impression is set and signed</em>
            <span aria-hidden="true">·</span>
            <em className="closing-plate__foot-em closing-plate__foot-em--quiet">m³ press · back matter</em>
          </p>
          <a className="closing-plate__foot-back" href="#question" aria-label="Back to the title page">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M20 12H5M11 6l-6 6 6 6" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>back to the question</span>
          </a>
        </div>
      </div>

      <span className="sr-only" aria-live="polite">
        {`Closing plate set in ${VOICE_LABEL[voice]}, marked at ${WORD_LABEL[word]}, ${addressedTo}, on ${setToday}. Now reading folio ${activeFolioIndex}, ${activeFolioLabel}.`}
      </span>
    </footer>
  )
}
