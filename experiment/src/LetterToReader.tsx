import { useEffect, useId, useRef, useState, type CSSProperties, type MouseEvent } from 'react'

type VoiceId = 'quiet' | 'human' | 'bold'

type LetterToReaderProps = {
  voice: VoiceId
  onReadAnswer: (event: MouseEvent<HTMLAnchorElement>) => void
}

const VOICE_TONE: Record<VoiceId, string> = {
  quiet: 'var(--blue)',
  human: 'var(--coral)',
  bold: 'var(--acid)',
}

const VOICE_FACE: Record<VoiceId, string> = {
  quiet: 'serif · italic · close set',
  human: 'serif · italic · warm',
  bold: 'display · heavy · no apology',
}

const VOICE_LETTER: Record<VoiceId, string> = { quiet: 'A', human: 'B', bold: 'C' }

function pad(n: number) {
  return String(n).padStart(2, '0')
}

function buildPostmarkLines(now: Date): string[] {
  const month = now.toLocaleString('en-US', { month: 'short' }).toUpperCase()
  const day = pad(now.getDate())
  const year = String(now.getFullYear()).slice(-2)
  const hour = pad(now.getHours() % 12 || 12)
  const minute = pad(now.getMinutes())
  return [`${month} ${day} '${year}`, '· PRESS BAY ·', `${hour}:${minute} LOCAL`]
}

function buildSignaturePath(seed: number, width = 220) {
  const w = width
  const baseY = 18
  const amp = 4 + (seed % 3) * 0.6
  const a = w * 0.16
  const b = w * 0.32
  const c = w * 0.5
  const d = w * 0.66
  const e = w * 0.84
  return [
    `M 2 ${baseY}`,
    `C ${a} ${baseY - amp}, ${b} ${baseY + amp * 0.7}, ${b + a * 0.4} ${baseY - 1}`,
    `S ${c} ${baseY + amp * 0.5}, ${c + a * 0.4} ${baseY - 2}`,
    `S ${d} ${baseY - amp * 0.6}, ${d + a * 0.3} ${baseY + 1}`,
    `S ${e} ${baseY + amp * 0.4}, ${w - 8} ${baseY - 1}`,
  ].join(' ')
}

export function LetterToReader({ voice, onReadAnswer }: LetterToReaderProps) {
  const baseId = useId().replace(/:/g, '')
  const paperId = `letter-paper-${baseId}`
  const grainId = `letter-grain-${baseId}`
  const ruleId = `letter-rule-${baseId}`
  const threadId = `letter-thread-${baseId}`
  const cancelGrainId = `letter-cancel-grain-${baseId}`
  const postmarkLines = buildPostmarkLines(new Date())
  const rootRef = useRef<HTMLElement>(null)
  const [revealed, setRevealed] = useState(false)
  const tone = VOICE_TONE[voice]
  const style = {
    '--letter-tone': tone,
    '--letter-paper': `url(#${paperId})`,
    '--letter-grain': `url(#${grainId})`,
    '--letter-rule': `url(#${ruleId})`,
    '--letter-thread': `url(#${threadId})`,
    '--letter-cancel-grain': `url(#${cancelGrainId})`,
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
      { threshold: 0.18, rootMargin: '0px 0px -8% 0px' },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={rootRef}
      id="note"
      className={`letter letter--${voice} ${revealed ? 'is-revealed' : ''}`}
      aria-labelledby="letter-title"
      style={style}
    >
      <svg className="letter__defs" viewBox="0 0 800 800" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <filter id={paperId} x="0%" y="0%" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.78" numOctaves="2" seed="61" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 .15  0 0 0 0 .11  0 0 0 0 .05  0 0 0 .09 0" />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
          <filter id={grainId} x="-2%" y="-2%" width="104%" height="104%">
            <feTurbulence type="fractalNoise" baseFrequency="2.4" numOctaves="2" seed="27" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 .07  0 0 0 0 .06  0 0 0 0 .04  0 0 0 .32 0" />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
          <filter id={cancelGrainId} x="-6%" y="-6%" width="112%" height="112%">
            <feTurbulence type="fractalNoise" baseFrequency="2.6" numOctaves="2" seed="19" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .42 0" />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
          <linearGradient id={ruleId} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
            <stop offset="14%" stopColor="currentColor" stopOpacity=".5" />
            <stop offset="50%" stopColor="currentColor" stopOpacity=".8" />
            <stop offset="86%" stopColor="currentColor" stopOpacity=".5" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
          <linearGradient id={threadId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
            <stop offset="50%" stopColor="currentColor" stopOpacity=".55" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      <header className="letter__plate" aria-hidden="true">
        <span className="letter__plate-mark" />
        <span className="letter__plate-tag">a folded slip · between iii &amp; iv</span>
        <span className="letter__plate-trail" aria-hidden="true">
          <svg viewBox="0 0 120 6" preserveAspectRatio="none">
            <path
              d="M2 3c12-3 26 3 42-1s28-3 42-1 24 4 32-1"
              fill="none"
              stroke="currentColor"
              strokeWidth=".7"
              strokeLinecap="round"
              className="letter__plate-trail-stroke"
            />
            <circle cx="118" cy="3" r="1" fill="currentColor" />
          </svg>
        </span>
      </header>

      <div className="letter__stage">
        <article className="letter__slip" aria-labelledby="letter-title">
          <span className="letter__slip-paper" aria-hidden="true">
            <svg viewBox="0 0 600 760" preserveAspectRatio="none">
              <rect x="0" y="0" width="600" height="760" fill="#f3ecd6" filter={`url(#${paperId})`} />
            </svg>
          </span>

          <span className="letter__glue letter__glue--top" aria-hidden="true" />
          <span className="letter__glue letter__glue--bottom" aria-hidden="true" />
          <span className="letter__tipped" aria-hidden="true">
            <span className="letter__tipped-mark" />
            tipped slip · back of folio iii
          </span>

          <span className="letter__corner letter__corner--tl" aria-hidden="true" />
          <span className="letter__corner letter__corner--tr" aria-hidden="true" />
          <span className="letter__corner letter__corner--bl" aria-hidden="true" />
          <span className="letter__corner letter__corner--br" aria-hidden="true" />

          <span className="letter__fold letter__fold--top" aria-hidden="true">
            <svg viewBox="0 0 600 28" preserveAspectRatio="none">
              <path
                d="M2 14c40-4 80 4 120 0s80-6 120-2 80 4 120-2 80-6 120-1 80 4 118 1"
                fill="none"
                stroke="currentColor"
                strokeWidth=".55"
                strokeLinecap="round"
                opacity=".55"
              />
              <path
                d="M2 18c40-3 80 3 120 0s80-3 120-1 80 3 120-1 80-3 120 0 80 3 118 0"
                fill="none"
                stroke="currentColor"
                strokeWidth=".4"
                strokeLinecap="round"
                opacity=".32"
              />
            </svg>
          </span>

          <span className="letter__rule letter__rule--head" aria-hidden="true">
            <svg viewBox="0 0 600 6" preserveAspectRatio="none">
              <path
                d="M2 3 L598 3"
                fill="none"
                stroke={`url(#${ruleId})`}
                strokeWidth=".7"
                strokeLinecap="round"
              />
              <circle cx="2" cy="3" r=".9" fill="currentColor" opacity=".55" />
              <circle cx="598" cy="3" r=".9" fill="currentColor" opacity=".55" />
            </svg>
          </span>

          <span className="letter__rule letter__rule--foot" aria-hidden="true">
            <svg viewBox="0 0 600 6" preserveAspectRatio="none">
              <path
                d="M2 3 L598 3"
                fill="none"
                stroke={`url(#${ruleId})`}
                strokeWidth=".7"
                strokeLinecap="round"
              />
              <circle cx="2" cy="3" r=".9" fill="currentColor" opacity=".55" />
              <circle cx="598" cy="3" r=".9" fill="currentColor" opacity=".55" />
            </svg>
          </span>

          <span className="letter__stamp" aria-hidden="true">
            <svg className="letter__stamp-svg" viewBox="0 0 80 96">
              <g filter={`url(#${grainId})`}>
                <rect x="2" y="2" width="76" height="92" fill="none" stroke="currentColor" strokeWidth=".7" />
                <rect x="6" y="6" width="68" height="84" fill="none" stroke="currentColor" strokeWidth=".4" strokeDasharray="1.4 1.8" opacity=".55" />
                <circle cx="40" cy="38" r="20" fill="none" stroke="currentColor" strokeWidth=".8" />
                <circle cx="40" cy="38" r="13" fill="none" stroke="currentColor" strokeWidth=".35" strokeDasharray="1 1.6" opacity=".6" />
                <text x="40" y="14" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="5" letterSpacing="1.4" fill="currentColor">m³ · PRESS</text>
                <text x="40" y="44" textAnchor="middle" fontFamily="Georgia, serif" fontStyle="italic" fontSize="14" fill="currentColor">is m³</text>
                <text x="40" y="54" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="3.6" letterSpacing="1.6" fill="currentColor" opacity=".75">good · at</text>
                <text x="40" y="62" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="3.6" letterSpacing="1.6" fill="currentColor" opacity=".75">frontend</text>
                <text x="40" y="74" textAnchor="middle" fontFamily="Georgia, serif" fontStyle="italic" fontSize="9" fill="currentColor">yet?</text>
                <text x="40" y="86" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="3.4" letterSpacing="1.4" fill="currentColor" opacity=".7">FOLIO · iv</text>
                <circle cx="40" cy="38" r="1.6" fill="currentColor" />
              </g>
            </svg>
          </span>

          <span className="letter__cancellation" aria-hidden="true">
            <svg className="letter__cancellation-svg" viewBox="0 0 168 168">
              <g filter={`url(#${cancelGrainId})`}>
                <circle cx="84" cy="84" r="74" fill="none" stroke="currentColor" strokeWidth=".9" />
                <circle cx="84" cy="84" r="68" fill="none" stroke="currentColor" strokeWidth=".35" strokeDasharray="1.4 2.4" opacity=".7" />
                <circle cx="84" cy="84" r="58" fill="none" stroke="currentColor" strokeWidth=".6" />
                {postmarkLines.map((line, idx) => (
                  <text
                    key={`${line}-${idx}`}
                    x="84"
                    y={28 + idx * 14}
                    textAnchor="middle"
                    fontFamily="ui-monospace, monospace"
                    fontSize={idx === 1 ? 5 : 6}
                    letterSpacing="2.2"
                    fill="currentColor"
                  >
                    {line}
                  </text>
                ))}
                {postmarkLines.slice(0, 2).map((line, idx) => (
                  <text
                    key={`arc-${line}-${idx}`}
                    x="84"
                    y={148 - idx * 12}
                    textAnchor="middle"
                    fontFamily="ui-monospace, monospace"
                    fontSize="5"
                    letterSpacing="2"
                    fill="currentColor"
                    opacity=".8"
                  >
                    {idx === 0 ? 'm³ · PRESS BAY' : 'folio · the slip'}
                  </text>
                ))}
                <line x1="20" y1="84" x2="148" y2="84" stroke="currentColor" strokeWidth=".5" opacity=".55" />
              </g>
            </svg>
          </span>

          <span className="letter__seal" aria-hidden="true">
            <svg className="letter__seal-svg" viewBox="0 0 96 96">
              <defs>
                <radialGradient id={`${baseId}-seal-wax`} cx="0.42" cy="0.38" r="0.7">
                  <stop offset="0%" stopColor={voice === 'human' ? 'rgba(255,148,131,1)' : voice === 'bold' ? 'rgba(232,255,140,1)' : 'rgba(180,205,255,1)'} />
                  <stop offset="62%" stopColor={voice === 'human' ? 'rgba(179,74,58,1)' : voice === 'bold' ? 'rgba(124,138,54,1)' : 'rgba(91,121,203,1)'} />
                  <stop offset="100%" stopColor="rgba(17,21,33,.85)" />
                </radialGradient>
                <filter id={`${baseId}-seal-grain`} x="-10%" y="-10%" width="120%" height="120%">
                  <feTurbulence type="fractalNoise" baseFrequency="2.2" numOctaves="2" seed="33" stitchTiles="stitch" />
                  <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .5 0" />
                  <feComposite in2="SourceGraphic" operator="in" />
                </filter>
              </defs>
              <g filter={`url(#${baseId}-seal-grain)`}>
                <path
                  d="M48 4 L60 14 L74 12 L78 26 L92 32 L84 44 L92 58 L78 64 L74 78 L60 76 L48 86 L36 76 L22 78 L18 64 L4 58 L12 44 L4 32 L18 26 L22 12 L36 14 Z"
                  fill={`url(#${baseId}-seal-wax)`}
                  stroke="rgba(17,21,33,.5)"
                  strokeWidth=".6"
                />
                <circle cx="48" cy="46" r="20" fill="none" stroke="rgba(243,236,214,.5)" strokeWidth=".55" />
                <circle cx="48" cy="46" r="14" fill="none" stroke="rgba(243,236,214,.3)" strokeWidth=".4" strokeDasharray=".8 1.6" />
                <text x="48" y="38" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="3.8" letterSpacing="1.4" fill="rgba(243,236,214,.85)">EDITOR'S</text>
                <text x="48" y="52" textAnchor="middle" fontFamily="Georgia, serif" fontStyle="italic" fontSize="14" fill="rgba(243,236,214,.95)">m³</text>
                <text x="48" y="62" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="3.6" letterSpacing="1.4" fill="rgba(243,236,214,.85)">SEAL · YES</text>
              </g>
              <circle cx="30" cy="34" r="4.4" fill="rgba(255,255,255,.4)" />
              <circle cx="32" cy="36" r="1.8" fill="rgba(255,255,255,.55)" />
            </svg>
            <span className="letter__seal-wax" aria-hidden="true">
              <span className="letter__seal-wax-bead" />
              <span className="letter__seal-wax-wisp" />
            </span>
          </span>

          <span className="letter__thread letter__thread--a" aria-hidden="true">
            <svg viewBox="0 0 600 240" preserveAspectRatio="none">
              <path
                d="M2 180 C 120 60, 240 220, 360 100 S 540 200, 598 60"
                fill="none"
                stroke={`url(#${threadId})`}
                strokeWidth="1.1"
                strokeLinecap="round"
                pathLength="100"
                className="letter__thread-stroke"
              />
              <circle cx="2" cy="180" r="1.2" fill="currentColor" opacity=".55" />
              <circle cx="598" cy="60" r="1.4" fill="currentColor" opacity=".55" />
            </svg>
          </span>

          <div className="letter__body">
            <div className="letter__address" aria-hidden="true">
              <span className="letter__address-row letter__address-row--from">
                <span className="letter__address-key">from</span>
                <span className="letter__address-value">
                  <em>m³ press</em>
                  <span className="letter__address-sub">volume i · the open question</span>
                </span>
              </span>
              <span className="letter__address-rule" aria-hidden="true">
                <svg viewBox="0 0 200 6" preserveAspectRatio="none">
                  <path
                    d="M2 3 L198 3"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth=".5"
                    strokeDasharray="2 3"
                    opacity=".55"
                  />
                </svg>
              </span>
              <span className="letter__address-row letter__address-row--to">
                <span className="letter__address-key">to</span>
                <span className="letter__address-value">
                  <em>the reader who arrives</em>
                  <span className="letter__address-sub">careful · unhurried · present</span>
                </span>
              </span>
            </div>

            <header className="letter__head">
              <span className="letter__head-eyebrow" aria-hidden="true">
                <span className="letter__head-eyebrow-tick" />
                a folded note
                <span className="letter__head-eyebrow-tick letter__head-eyebrow-tick--alt" />
              </span>
              <h2 id="letter-title">A short letter <i>to the reader.</i></h2>
              <p className="letter__head-byline" aria-hidden="true">
                <span className="letter__head-byline-key">set in</span>
                <span className={`letter__head-byline-voice letter__head-byline-voice--${voice}`}>
                  <span className="letter__head-byline-letter">{VOICE_LETTER[voice]}</span>
                  <em>{voice === 'human' ? 'human hand' : voice === 'bold' ? 'bold signal' : 'quiet cut'}</em>
                </span>
                <span className="letter__head-byline-face">{VOICE_FACE[voice]}</span>
              </p>
            </header>

            <div className="letter__copy">
              <p className="letter__salute">Dear reader,</p>
              <p>
                This page is one attempt to set a question that does not sit still. Three words are marked because they earn the marginalia. Three voices are tried because typography is part of any honest answer. The rest is the small work of binding a page — by hand, with attention.
              </p>
              <p>
                If you came looking for a verdict, the verdict is the question itself: <em>yet</em> — which is to say, not yet fixed, still moving.
              </p>
            </div>

            <footer className="letter__sign">
              <span className="letter__sign-mark" aria-hidden="true">—</span>
              <span className="letter__sign-body">
                <svg className="letter__sign-flourish" viewBox="0 0 220 36" preserveAspectRatio="none">
                  <path
                    d={buildSignaturePath(5)}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.1"
                    strokeLinecap="round"
                    pathLength="100"
                    className="letter__sign-flourish-stroke"
                  />
                  <circle cx="216" cy="18" r="1.6" fill="currentColor" className="letter__sign-flourish-bead" />
                </svg>
                <span className="letter__sign-name">the editor</span>
                <span className="letter__sign-meta">
                  <span>m³ press</span>
                  <span aria-hidden="true">·</span>
                  <span>set today · for a careful reader</span>
                </span>
              </span>
            </footer>

            <div className="letter__return">
              <span className="letter__return-rule" aria-hidden="true" />
              <a className="letter__return-cta" href="#answer" onClick={onReadAnswer}>
                <span className="letter__return-cta-line">
                  <span className="letter__return-cta-eyebrow">when you are ready</span>
                  <span className="letter__return-cta-label">read the editor's note</span>
                </span>
                <span className="letter__return-cta-arrow" aria-hidden="true">
                  <svg viewBox="0 0 28 28">
                    <path
                      d="M4 14h18M16 6l8 8-8 8"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <span className="letter__return-cta-tag" aria-hidden="true">
                  <span className="letter__return-cta-tag-dot" />
                  opens folio viii
                </span>
              </a>
              <span className="letter__return-folio" aria-hidden="true">
                <span className="letter__return-folio-mark" />
                slip iv · between iii &amp; the proof
              </span>
            </div>
          </div>

          <span className="letter__dog-ear" aria-hidden="true">
            <svg viewBox="0 0 56 56" className="letter__dog-ear-svg">
              <path d="M56 0 L0 56 L56 56 Z" fill="rgba(17,21,33,.08)" />
              <path d="M56 0 L0 56" stroke="rgba(17,21,33,.22)" strokeWidth=".8" fill="none" />
              <path d="M56 0 L0 56 L56 56" stroke="rgba(17,21,33,.32)" strokeWidth=".45" fill="none" />
              <path d="M48 8 L8 48" stroke="rgba(17,21,33,.16)" strokeWidth=".4" strokeDasharray="1.4 2" fill="none" />
            </svg>
          </span>

          <span className="letter__hand-note" aria-hidden="true">
            <span className="letter__hand-note-tick" />
            <em>please turn over</em>
          </span>
        </article>

        <aside className="letter__sidecar" aria-hidden="true">
          <span className="letter__sidecar-mark" />
          <span className="letter__sidecar-tag">a slip's itinerary</span>
          <span className="letter__sidecar-stops">
            <span className="letter__sidecar-stop">
              <span className="letter__sidecar-stop-num">iii</span>
              <span className="letter__sidecar-stop-name">listed</span>
            </span>
            <span className="letter__sidecar-stop-rule" aria-hidden="true">
              <svg viewBox="0 0 60 4" preserveAspectRatio="none">
                <path d="M2 2c10-3 22 3 32-1s18-2 24 0" fill="none" stroke="currentColor" strokeWidth=".5" strokeLinecap="round" />
              </svg>
            </span>
            <span className="letter__sidecar-stop is-current">
              <span className="letter__sidecar-stop-num">·</span>
              <span className="letter__sidecar-stop-name">this slip</span>
            </span>
            <span className="letter__sidecar-stop-rule" aria-hidden="true">
              <svg viewBox="0 0 60 4" preserveAspectRatio="none">
                <path d="M2 2c10-3 22 3 32-1s18-2 24 0" fill="none" stroke="currentColor" strokeWidth=".5" strokeLinecap="round" />
              </svg>
            </span>
            <span className="letter__sidecar-stop">
              <span className="letter__sidecar-stop-num">iv</span>
              <span className="letter__sidecar-stop-name">the proof</span>
            </span>
          </span>
          <span className="letter__sidecar-foot">
            <span className="letter__sidecar-foot-mark" />
            set between the page and the proof
          </span>
        </aside>
      </div>

      <span className="sr-only">
        A folded slip addressed to the reader, set in the {voice === 'human' ? 'human hand' : voice === 'bold' ? 'bold signal' : 'quiet cut'} voice between folio iii and the proof.
      </span>
    </section>
  )
}
