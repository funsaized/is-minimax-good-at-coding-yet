import { useEffect, useId, useRef, useState, type CSSProperties } from 'react'
import type { VoiceId } from './Press'
import type { WordId } from './notes'
import { PressStamp } from './PressStamp'

type FolioSpreadProps = {
  voice: VoiceId
  word: WordId
  setToday: string
}

type VoiceFace = {
  family: string
  weight: number
  style: 'italic' | 'normal'
  tracking: string
  uppercased: boolean
  descriptor: string
  glyph: string
}

const VOICE_FACE: Record<VoiceId, VoiceFace> = {
  quiet: {
    family: "'Iowan Old Style', 'Palatino Linotype', Georgia, serif",
    weight: 400,
    style: 'italic',
    tracking: '-.025em',
    uppercased: false,
    descriptor: 'serif · italic · close set',
    glyph: '¶',
  },
  human: {
    family: "'Iowan Old Style', 'Palatino Linotype', Georgia, serif",
    weight: 500,
    style: 'italic',
    tracking: '-.018em',
    uppercased: false,
    descriptor: 'serif · italic · a hand that learned its warmth',
    glyph: '§',
  },
  bold: {
    family: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
    weight: 900,
    style: 'normal',
    tracking: '-.05em',
    uppercased: true,
    descriptor: 'sans · heavy · no apology',
    glyph: '◆',
  },
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

const VOICE_EYEBROW: Record<VoiceId, string> = {
  quiet: 'a quiet reading, set with care',
  human: 'a hand-set line, set by warmth',
  bold: 'a loud reading, set without apology',
}

const WORD_LABEL: Record<WordId, string> = { m3: 'M3', good: 'good at', yet: 'yet?' }
const WORD_GLOSS: Record<WordId, string> = { m3: 'the maker, set in the line', good: 'the verb, set in the line', yet: 'the pause, set in the line' }

function formatSeason(): string {
  const month = new Date().getMonth()
  if (month <= 1 || month === 11) return 'winter'
  if (month <= 4) return 'spring'
  if (month <= 7) return 'summer'
  return 'autumn'
}

export function FolioSpread({ voice, word, setToday }: FolioSpreadProps) {
  const baseId = useId().replace(/:/g, '')
  const grainId = `folio-spread-grain-${baseId}`
  const plateGrainId = `folio-spread-plate-grain-${baseId}`
  const ruleGrainId = `folio-spread-rule-grain-${baseId}`
  const sealGrainId = `folio-spread-seal-grain-${baseId}`
  const paperGrainId = `folio-spread-paper-grain-${baseId}`
  const rootRef = useRef<HTMLElement>(null)
  const versoRef = useRef<HTMLDivElement>(null)
  const rectoRef = useRef<HTMLDivElement>(null)
  const [revealed, setRevealed] = useState(false)
  const [verseTilt, setVerseTilt] = useState({ x: 0, y: 0 })
  const [rectoTilt, setRectoTilt] = useState({ x: 0, y: 0 })
  const [hovered, setHovered] = useState(false)
  const firstVoiceRef = useRef(true)

  const face = VOICE_FACE[voice]
  const season = formatSeason()
  const tone = VOICE_TONE[voice]

  const styleVars = {
    '--fs-tone': tone,
    '--fs-family': face.family,
    '--fs-weight': String(face.weight),
    '--fs-style': face.style,
    '--fs-tracking': face.tracking,
    '--fs-grain': `url(#${grainId})`,
    '--fs-plate-grain': `url(#${plateGrainId})`,
    '--fs-rule-grain': `url(#${ruleGrainId})`,
    '--fs-paper-grain': `url(#${paperGrainId})`,
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
      { threshold: 0.08, rootMargin: '0px 0px -6% 0px' },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (firstVoiceRef.current) {
      firstVoiceRef.current = false
      return
    }
    setVerseTilt({ x: 0, y: 0 })
    setRectoTilt({ x: 0, y: 0 })
  }, [voice])

  const onVerseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const node = versoRef.current
    if (!node) return
    const rect = node.getBoundingClientRect()
    if (rect.width === 0 || rect.height === 0) return
    const x = (event.clientX - rect.left) / rect.width - 0.5
    const y = (event.clientY - rect.top) / rect.height - 0.5
    setVerseTilt({ x: x * 4, y: y * 3 })
    setHovered(true)
  }

  const onVerseLeave = () => {
    setVerseTilt({ x: 0, y: 0 })
    setHovered(false)
  }

  const onRectoMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const node = rectoRef.current
    if (!node) return
    const rect = node.getBoundingClientRect()
    if (rect.width === 0 || rect.height === 0) return
    const x = (event.clientX - rect.left) / rect.width - 0.5
    const y = (event.clientY - rect.top) / rect.height - 0.5
    setRectoTilt({ x: -x * 4, y: y * 3 })
    setHovered(true)
  }

  const onRectoLeave = () => {
    setRectoTilt({ x: 0, y: 0 })
    setHovered(false)
  }

  const headlineStyle: CSSProperties = {
    fontFamily: face.family,
    fontWeight: face.weight,
    fontStyle: face.style,
    letterSpacing: face.tracking,
  }

  return (
    <aside
      ref={rootRef}
      className={`folio-spread folio-spread--${voice} folio-spread--word-${word} ${revealed ? 'is-revealed' : ''} ${hovered ? 'is-tracked' : ''}`}
      style={styleVars}
      aria-label={`Folio spread · folio i · the opening title page · twin pages opening to the question · set in ${VOICE_NAME[voice]} on ${setToday} · ${season} · marked at ${WORD_LABEL[word]}.`}
    >
      <svg className="folio-spread__defs" viewBox="0 0 1600 1000" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <filter id={grainId} x="-2%" y="-2%" width="104%" height="104%">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="51" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 .14  0 0 0 0 .12  0 0 0 0 .19  0 0 0 .04 0" />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
          <filter id={plateGrainId} x="-2%" y="-2%" width="104%" height="104%">
            <feTurbulence type="fractalNoise" baseFrequency="2.6" numOctaves="2" seed="57" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .35 0" />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
          <filter id={ruleGrainId} x="-2%" y="-50%" width="104%" height="200%">
            <feTurbulence type="fractalNoise" baseFrequency="2.4" numOctaves="2" seed="63" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .5 0" />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
          <filter id={sealGrainId} x="-12%" y="-12%" width="124%" height="124%">
            <feTurbulence type="fractalNoise" baseFrequency="2.6" numOctaves="2" seed="69" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .55 0" />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
          <filter id={paperGrainId} x="-2%" y="-2%" width="104%" height="104%">
            <feTurbulence type="fractalNoise" baseFrequency="0.78" numOctaves="2" seed="77" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 .14  0 0 0 0 .12  0 0 0 0 .19  0 0 0 .06 0" />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
          <linearGradient id={`folio-spread-vignette-${baseId}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="currentColor" stopOpacity=".06" />
            <stop offset="50%" stopColor="currentColor" stopOpacity="0" />
            <stop offset="100%" stopColor="currentColor" stopOpacity=".06" />
          </linearGradient>
        </defs>
      </svg>

      <span className="folio-spread__shadow folio-spread__shadow--lead" aria-hidden="true" />
      <span className="folio-spread__shadow folio-spread__shadow--trail" aria-hidden="true" />

      <header className="folio-spread__head" aria-hidden="false">
        <span className="folio-spread__head-mark" aria-hidden="true">
          <svg viewBox="0 0 18 18">
            <rect x="2" y="2" width="14" height="14" fill="none" stroke="currentColor" strokeWidth=".9" />
            <line x1="2" y1="9" x2="16" y2="9" stroke="currentColor" strokeWidth=".55" opacity=".7" />
          </svg>
        </span>
        <span className="folio-spread__head-stack">
          <span className="folio-spread__head-eyebrow">the opening spread</span>
          <span className="folio-spread__head-line">
            twin pages, set in the <em>{VOICE_NAME[voice]}</em> voice
          </span>
        </span>
        <span className="folio-spread__head-pip" aria-hidden="true">
          <svg viewBox="0 0 80 12" preserveAspectRatio="none">
            <g filter={`url(#${ruleGrainId})`}>
              <path d="M2 6c10-3 20 3 30 0s20-3 30 0 16 3 16 0" fill="none" stroke="currentColor" strokeWidth=".5" strokeLinecap="round" />
            </g>
            <circle cx="78" cy="6" r="1" fill="currentColor" />
          </svg>
        </span>
        <span className="folio-spread__head-folio">
          <span className="folio-spread__head-folio-key">folio</span>
          <em className="folio-spread__head-folio-num">i·</em>
          <span className="folio-spread__head-folio-tag">the opening spread</span>
        </span>
      </header>

      <div className="folio-spread__book" aria-hidden="false">
        <span className="folio-spread__spine" aria-hidden="true" />
        <span className="folio-spread__spine-crease" aria-hidden="true">
          <svg viewBox="0 0 6 800" preserveAspectRatio="none">
            <line x1="3" y1="0" x2="3" y2="800" stroke="currentColor" strokeWidth=".55" strokeDasharray="1.4 3.2" strokeLinecap="round" opacity=".4" />
          </svg>
        </span>

        <div
          ref={versoRef}
          className="folio-spread__page folio-spread__page--verso"
          style={{
            transform: `rotateY(${verseTilt.x.toFixed(2)}deg) rotateX(${(-verseTilt.y).toFixed(2)}deg)`,
          }}
          onMouseMove={onVerseMove}
          onMouseLeave={onVerseLeave}
        >
          <span className="folio-spread__page-paper" aria-hidden="true">
            <svg viewBox="0 0 800 1000" preserveAspectRatio="none">
              <rect x="0" y="0" width="800" height="1000" filter={`url(#${paperGrainId})`} opacity=".5" />
            </svg>
          </span>
          <span className="folio-spread__page-vignette" aria-hidden="true">
            <svg viewBox="0 0 800 1000" preserveAspectRatio="none">
              <rect x="0" y="0" width="800" height="1000" fill={`url(#folio-spread-vignette-${baseId})`} opacity=".55" />
            </svg>
          </span>
          <span className="folio-spread__page-corner folio-spread__page-corner--tl" aria-hidden="true" />
          <span className="folio-spread__page-corner folio-spread__page-corner--tr" aria-hidden="true" />
          <span className="folio-spread__page-corner folio-spread__page-corner--bl" aria-hidden="true" />
          <span className="folio-spread__page-corner folio-spread__page-corner--br" aria-hidden="true" />

          <span className="folio-spread__page-folio" aria-hidden="true">
            <span className="folio-spread__page-folio-key">verso</span>
            <span className="folio-spread__page-folio-rule" />
            <em className="folio-spread__page-folio-num">i</em>
          </span>

          <span className="folio-spread__page-glyph" aria-hidden="true">{face.glyph}</span>

          <span className="folio-spread__verso-eyebrow" aria-hidden="false">
            <span className="folio-spread__verso-eyebrow-mark" />
            <em>{VOICE_EYEBROW[voice]}</em>
          </span>

          <h2 className="folio-spread__headline" style={headlineStyle}>
            <span className="folio-spread__line folio-spread__line--a">
              <span className="folio-spread__line-static">{face.uppercased ? 'IS' : 'is'}</span>
            </span>
            <span className="folio-spread__line folio-spread__line--b">
              <span className="folio-spread__line-static">{face.uppercased ? 'Minimax M3' : 'Minimax M3'}</span>
            </span>
            <span className="folio-spread__line folio-spread__line--c">
              <span className="folio-spread__line-static">{face.uppercased ? 'GOOD AT' : 'good at'}</span>
              <span className="folio-spread__line-static folio-spread__line-static--alt">{face.uppercased ? 'FRONTEND' : 'frontend'}</span>
            </span>
            <span className="folio-spread__line folio-spread__line--d">
              <span className="folio-spread__line-static folio-spread__line-static--pause">{face.uppercased ? 'YET?' : 'yet?'}</span>
            </span>
          </h2>

          <span className="folio-spread__verso-rule" aria-hidden="true">
            <svg viewBox="0 0 480 4" preserveAspectRatio="none">
              <g filter={`url(#${ruleGrainId})`}>
                <path d="M2 2c40-1 80 1 120 0s80-1 120 0 80 1 120 0 80-1 116 0" fill="none" stroke="currentColor" strokeWidth=".55" strokeLinecap="round" />
              </g>
              <circle cx="240" cy="2" r="1.5" fill="currentColor" />
            </svg>
          </span>

          <span className="folio-spread__verso-mark" aria-hidden="true">
            <span className="folio-spread__verso-mark-letter" style={{ fontFamily: face.family, fontStyle: face.style, fontWeight: face.weight, letterSpacing: face.tracking }}>
              {VOICE_LETTER[voice]}
            </span>
            <span className="folio-spread__verso-mark-stack">
              <em className="folio-spread__verso-mark-line">{VOICE_NAME[voice]}</em>
              <span className="folio-spread__verso-mark-face">{face.descriptor}</span>
            </span>
          </span>
        </div>

        <div
          ref={rectoRef}
          className="folio-spread__page folio-spread__page--recto"
          style={{
            transform: `rotateY(${rectoTilt.x.toFixed(2)}deg) rotateX(${(-rectoTilt.y).toFixed(2)}deg)`,
          }}
          onMouseMove={onRectoMove}
          onMouseLeave={onRectoLeave}
        >
          <span className="folio-spread__page-paper" aria-hidden="true">
            <svg viewBox="0 0 800 1000" preserveAspectRatio="none">
              <rect x="0" y="0" width="800" height="1000" filter={`url(#${paperGrainId})`} opacity=".5" />
            </svg>
          </span>
          <span className="folio-spread__page-vignette" aria-hidden="true">
            <svg viewBox="0 0 800 1000" preserveAspectRatio="none">
              <rect x="0" y="0" width="800" height="1000" fill={`url(#folio-spread-vignette-${baseId})`} opacity=".55" />
            </svg>
          </span>
          <span className="folio-spread__page-corner folio-spread__page-corner--tl" aria-hidden="true" />
          <span className="folio-spread__page-corner folio-spread__page-corner--tr" aria-hidden="true" />
          <span className="folio-spread__page-corner folio-spread__page-corner--bl" aria-hidden="true" />
          <span className="folio-spread__page-corner folio-spread__page-corner--br" aria-hidden="true" />

          <span className="folio-spread__page-folio folio-spread__page-folio--recto" aria-hidden="true">
            <em className="folio-spread__page-folio-num">ii</em>
            <span className="folio-spread__page-folio-rule" />
            <span className="folio-spread__page-folio-key">recto</span>
          </span>

          <div className="folio-spread__recto-seal" aria-hidden="true">
            <span className="folio-spread__recto-seal-halo" />
            <span className="folio-spread__recto-seal-disc">
              <PressStamp voice={voice} size={148} />
            </span>
            <span className="folio-spread__recto-seal-wax">
              <span className="folio-spread__recto-seal-wax-bead" />
              <span className="folio-spread__recto-seal-wax-wisp" />
            </span>
          </div>

          <span className="folio-spread__recto-eyebrow" aria-hidden="false">
            <span className="folio-spread__recto-eyebrow-mark" />
            <em>the question, set today</em>
          </span>

          <p className="folio-spread__recto-question">
            <span className="folio-spread__recto-question-line" aria-hidden="true">
              <svg viewBox="0 0 280 8" preserveAspectRatio="none">
                <g filter={`url(#${ruleGrainId})`}>
                  <path d="M2 4c30-2 60 2 90 0s60-2 90 0 60 2 90-1" fill="none" stroke="currentColor" strokeWidth=".55" strokeLinecap="round" />
                </g>
                <circle cx="278" cy="4" r="1.2" fill="currentColor" />
              </svg>
            </span>
            <em className="folio-spread__recto-question-mark">is</em>
            <span className="folio-spread__recto-question-name">Minimax M3</span>
            <em className="folio-spread__recto-question-verb">good at</em>
            <span className="folio-spread__recto-question-noun">frontend</span>
            <em className="folio-spread__recto-question-pause">yet?</em>
            <span className="folio-spread__recto-question-line folio-spread__recto-question-line--alt" aria-hidden="true">
              <svg viewBox="0 0 280 8" preserveAspectRatio="none">
                <g filter={`url(#${ruleGrainId})`}>
                  <path d="M2 4c30-2 60 2 90 0s60-2 90 0 60 2 90-1" fill="none" stroke="currentColor" strokeWidth=".55" strokeLinecap="round" />
                </g>
                <circle cx="2" cy="4" r="1.2" fill="currentColor" />
              </svg>
            </span>
          </p>

          <span className="folio-spread__recto-rule" aria-hidden="true">
            <svg viewBox="0 0 360 4" preserveAspectRatio="none">
              <g filter={`url(#${ruleGrainId})`}>
                <path d="M2 2c30-1 60 1 90 0s60-1 90 0 60 1 90 0 60-1 88 0" fill="none" stroke="currentColor" strokeWidth=".55" strokeLinecap="round" />
              </g>
              <circle cx="180" cy="2" r="1.4" fill="currentColor" />
            </svg>
          </span>

          <div className="folio-spread__recto-meta">
            <span className="folio-spread__recto-cell">
              <span className="folio-spread__recto-cell-key">marked at</span>
              <span className="folio-spread__recto-cell-rule" />
              <em className="folio-spread__recto-cell-value">{WORD_LABEL[word]}</em>
              <span className="folio-spread__recto-cell-tag">{WORD_GLOSS[word]}</span>
            </span>
            <span className="folio-spread__recto-cell">
              <span className="folio-spread__recto-cell-key">set on</span>
              <span className="folio-spread__recto-cell-rule" />
              <em className="folio-spread__recto-cell-value">{setToday}</em>
              <span className="folio-spread__recto-cell-tag">folio i · {season}</span>
            </span>
            <span className="folio-spread__recto-cell">
              <span className="folio-spread__recto-cell-key">voice</span>
              <span className="folio-spread__recto-cell-rule" />
              <em className="folio-spread__recto-cell-value">{VOICE_NAME[voice]}</em>
              <span className="folio-spread__recto-cell-tag">{VOICE_LETTER[voice]} · {face.descriptor}</span>
            </span>
          </div>

          <span className="folio-spread__recto-sign" aria-hidden="true">
            <svg viewBox="0 0 240 14" preserveAspectRatio="none">
              <g filter={`url(#${ruleGrainId})`}>
                <path d="M2 8c12-6 24 4 36-1s24-7 36-1 24 4 36-2 24-7 36-1 24 4 36-2 24-7 36-1 12 4 12 4" fill="none" stroke="currentColor" strokeWidth=".7" strokeLinecap="round" />
              </g>
              <circle cx="238" cy="6" r="1.1" fill="currentColor" />
            </svg>
            <span className="folio-spread__recto-sign-tag">
              <span className="folio-spread__recto-sign-tag-mark" aria-hidden="true" />
              <em>the page opens to a single question</em>
            </span>
          </span>
        </div>
      </div>

      <footer className="folio-spread__foot" aria-hidden="true">
        <span className="folio-spread__foot-rule" />
        <span className="folio-spread__foot-text">
          <em>two pages</em>
          <span aria-hidden="true">·</span>
          <em>one question</em>
          <span aria-hidden="true">·</span>
          <em>three voices</em>
        </span>
        <span className="folio-spread__foot-rule folio-spread__foot-rule--alt" />
      </footer>

      <span className="sr-only" aria-live="polite">
        {`Opening spread revealed. Twin pages opening to the question, set in ${VOICE_NAME[voice]}, marked at ${WORD_LABEL[word]}.`}
      </span>
    </aside>
  )
}
