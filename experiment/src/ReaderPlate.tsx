import { useEffect, useId, useRef, useState, type CSSProperties, type ChangeEvent } from 'react'

type ReaderPlateProps = {
  readerName: string
  onReaderNameChange: (name: string) => void
  setToday: string
}

const MAX_NAME = 28

function buildUnderline(width: number, seed: number) {
  const w = Math.max(60, Math.min(420, width))
  const amp = 2.4 + ((seed * 7) % 5) * 0.4
  const cy = 9 + ((seed * 13) % 3) * 0.5
  const k = w / 8
  return `M2 ${cy} C ${k} ${cy - amp}, ${k * 2} ${cy + amp}, ${k * 3} ${cy - 1} S ${k * 5} ${cy + amp * 0.7}, ${k * 6} ${cy - 1} S ${k * 7.4} ${cy + amp * 0.4}, ${w - 2} ${cy + 0.4}`
}

export function ReaderPlate({ readerName, onReaderNameChange, setToday }: ReaderPlateProps) {
  const [signed, setSigned] = useState(false)
  const [focused, setFocused] = useState(false)
  const [seed, setSeed] = useState(0)
  const [width, setWidth] = useState(320)
  const [sealTick, setSealTick] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const baseId = useId().replace(/:/g, '')
  const paperGrainId = `reader-plate-paper-${baseId}`
  const sealGrainId = `reader-plate-seal-${baseId}`

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onReaderNameChange(event.target.value.slice(0, MAX_NAME))
  }
  const handleFocus = () => setFocused(true)
  const handleBlur = () => {
    setFocused(false)
    if (readerName.trim().length > 0) {
      setSeed(value => value + 1)
      setSigned(true)
      setSealTick(value => value + 1)
    }
  }

  useEffect(() => {
    const node = inputRef.current
    if (!node) return
    const measure = () => setWidth(node.offsetWidth)
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(node)
    window.addEventListener('resize', measure)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [])

  const displayName = readerName.trim().length > 0 ? readerName.trim() : '—'
  const hasName = readerName.trim().length > 0
  const style = { '--reader-plate-tone': 'var(--coral)' } as CSSProperties

  return (
    <section
      className={`reader-plate section ${signed && hasName ? 'is-signed' : ''} ${focused ? 'is-focused' : ''} ${hasName ? 'has-value' : ''}`}
      id="reader-plate"
      aria-labelledby="reader-plate-title"
      style={style}
    >
      <div className="reader-plate__paper">
        <svg className="reader-plate__paper-grain" viewBox="0 0 600 600" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <filter id={paperGrainId} x="0%" y="0%" width="100%" height="100%">
              <feTurbulence type="fractalNoise" baseFrequency="0.92" numOctaves="2" seed="31" stitchTiles="stitch" />
              <feColorMatrix type="matrix" values="0 0 0 0 .14  0 0 0 0 .08  0 0 0 0 .04  0 0 0 .09 0" />
              <feComposite in2="SourceGraphic" operator="in" />
            </filter>
          </defs>
          <rect x="0" y="0" width="600" height="600" fill="#f3ecd6" filter={`url(#${paperGrainId})`} />
        </svg>

        <span className="reader-plate__plate-tag" aria-hidden="true">tipped slip · between iii &amp; iv</span>

        <span className="reader-plate__corner reader-plate__corner--tl" aria-hidden="true" />
        <span className="reader-plate__corner reader-plate__corner--tr" aria-hidden="true" />
        <span className="reader-plate__corner reader-plate__corner--bl" aria-hidden="true" />
        <span className="reader-plate__corner reader-plate__corner--br" aria-hidden="true" />

        <header className="reader-plate__head">
          <p className="eyebrow eyebrow--dark"><span className="eyebrow__line" />a bookplate <em>for this impression</em></p>
          <h2 id="reader-plate-title">Sign the <i>impression.</i></h2>
          <p className="reader-plate__lede">
            A bookplate claims a copy of the press run. Type your name and a hand-set line draws itself beneath it — a small wax seal lands, and the colophon below remembers.
          </p>
        </header>

        <div className="reader-plate__field">
          <span className="reader-plate__field-label" aria-hidden="true">
            <span className="reader-plate__field-label-mark">claimed by</span>
            <span className="reader-plate__field-label-rule" />
          </span>

          <div className="reader-plate__field-row">
            <input
              ref={inputRef}
              id="reader-name"
              className={`reader-plate__input ${hasName ? 'has-value' : ''}`}
              type="text"
              value={readerName}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              maxLength={MAX_NAME}
              placeholder="—"
              spellCheck={false}
              autoComplete="off"
              aria-describedby="reader-plate-hint"
            />
            <svg
              className="reader-plate__stroke"
              viewBox={`0 0 ${Math.max(60, width)} 18`}
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <defs>
                <filter id={`reader-stroke-grain-${baseId}`} x="-2%" y="-30%" width="104%" height="160%">
                  <feTurbulence type="fractalNoise" baseFrequency="2.6" numOctaves="2" seed={seed * 3 + 11} stitchTiles="stitch" />
                  <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .42 0" />
                  <feComposite in2="SourceGraphic" operator="in" />
                </filter>
              </defs>
              <g filter={`url(#reader-stroke-grain-${baseId})`}>
                <path
                  key={`reader-stroke-${seed}`}
                  d={buildUnderline(width, seed)}
                  fill="none"
                  stroke="var(--ink)"
                  strokeWidth="1.1"
                  strokeLinecap="round"
                  pathLength="100"
                  strokeDasharray="100 100"
                  strokeDashoffset={hasName ? 0 : 100}
                  className="reader-plate__stroke-path"
                />
              </g>
              <circle className="reader-plate__stroke-bead" cx={Math.max(60, width) - 2} cy="9" r="1.3" fill="var(--ink)" />
            </svg>
          </div>

          <span id="reader-plate-hint" className="reader-plate__hint" aria-hidden="true">
            {hasName ? (
              <>
                <em className="reader-plate__hint-glyph">⌇</em>
                a name pressed onto the impression · set today, {setToday}
              </>
            ) : (
              <>
                <em className="reader-plate__hint-glyph">·</em>
                one line, set by hand · press <kbd>tab</kbd> to seal the impression
              </>
            )}
          </span>
        </div>

        <div className="reader-plate__plate-row">
          <span className="reader-plate__plate-rule" aria-hidden="true" />
          <span className="reader-plate__plate-meta">
            <span className="reader-plate__plate-meta-row">
              <span className="reader-plate__plate-meta-eyebrow">impressed for</span>
              <em className="reader-plate__plate-meta-name">{displayName}</em>
            </span>
            <span className="reader-plate__plate-meta-row reader-plate__plate-meta-row--alt">
              <span className="reader-plate__plate-meta-eyebrow">set on</span>
              <em className="reader-plate__plate-meta-date">{setToday}</em>
            </span>
          </span>
          <span className="reader-plate__plate-rule reader-plate__plate-rule--end" />

          <span className={`reader-plate__seal ${signed && hasName ? 'is-pressed' : ''}`} aria-hidden="true" key={`seal-${sealTick}`}>
            <svg viewBox="0 0 100 100" className="reader-plate__seal-svg">
              <defs>
                <filter id={sealGrainId} x="-10%" y="-10%" width="120%" height="120%">
                  <feTurbulence type="fractalNoise" baseFrequency="1.9" numOctaves="2" seed="19" stitchTiles="stitch" />
                  <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .55 0" />
                  <feComposite in2="SourceGraphic" operator="in" />
                </filter>
              </defs>
              <g filter={`url(#${sealGrainId})`} opacity="0.9">
                <circle cx="50" cy="50" r="42" fill="none" stroke="var(--wax)" strokeWidth="1.1" />
                <circle cx="50" cy="50" r="36" fill="none" stroke="var(--wax)" strokeWidth=".4" strokeDasharray="1 2" opacity=".7" />
                <text
                  x="50" y="22"
                  textAnchor="middle"
                  fontFamily="ui-monospace, monospace"
                  fontSize="4.2"
                  letterSpacing="2.4"
                  fill="var(--wax)"
                >FOR · THE · READER</text>
                <text
                  x="50" y="60"
                  textAnchor="middle"
                  fontFamily="Georgia, serif"
                  fontStyle="italic"
                  fontSize="20"
                  fill="var(--wax)"
                >m³</text>
                <text
                  x="50" y="84"
                  textAnchor="middle"
                  fontFamily="ui-monospace, monospace"
                  fontSize="4"
                  letterSpacing="2.2"
                  fill="var(--wax)"
                >FOLIO · TODAY</text>
              </g>
            </svg>
            <span className="reader-plate__seal-wax" aria-hidden="true">
              <span className="reader-plate__seal-wax-bead" />
              <span className="reader-plate__seal-wax-wisp" />
              <span className="reader-plate__seal-wax-drip" />
            </span>
          </span>
        </div>

        <footer className="reader-plate__foot">
          <span className="reader-plate__foot-rule" aria-hidden="true" />
          <span className="reader-plate__foot-text">
            <em>a reader's mark</em>
            <span aria-hidden="true">·</span>
            <em>stays for this impression</em>
          </span>
          <span className="reader-plate__foot-rule" aria-hidden="true" />
        </footer>

        <span className="reader-plate__scrawl" aria-hidden="true">
          <svg viewBox="0 0 220 18" preserveAspectRatio="none" className="reader-plate__scrawl-svg">
            <path
              key={`reader-scrawl-${seed}`}
              className="reader-plate__scrawl-stroke"
              d="M2 12c12-8 24 4 36-1s24-6 36-2 24 6 36-2 24-6 36-1 24 4 38-2"
              fill="none"
              stroke="var(--ink)"
              strokeWidth="1"
              strokeLinecap="round"
              pathLength="100"
              strokeDasharray="100 100"
              strokeDashoffset={hasName ? 0 : 100}
            />
            <circle className="reader-plate__scrawl-bead" cx="216" cy="9" r="1.6" fill="var(--ink)" />
          </svg>
        </span>
      </div>

      <span className="sr-only" aria-live="polite">
        {hasName ? `Impression claimed by ${displayName}.` : ''}
      </span>
    </section>
  )
}