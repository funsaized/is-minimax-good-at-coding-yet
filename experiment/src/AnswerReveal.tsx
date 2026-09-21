import { useId, type MutableRefObject } from 'react'
import type { VoiceId } from './Press'
import type { WordId } from './notes'
import { PressStamp } from './PressStamp'
import { KeptMark } from './KeptMark'
import { AnswerCoda } from './AnswerCoda'

type AnswerRevealProps = {
  open: boolean
  onClose: () => void
  triggerRef: MutableRefObject<HTMLButtonElement | null>
  voice: VoiceId
  word: WordId
  setToday: string
}

function PencilIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3 21l4-1 11-11-3-3L4 17l-1 4zM14.5 6.5l3 3" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ArrowIcon() {
  return (
    <svg className="arrow-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 12h15M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function AnswerReveal({ open, onClose, triggerRef, voice, word, setToday }: AnswerRevealProps) {
  const leafGrainId = useId().replace(/:/g, '')
  return (
    <section
      className={`answer-reveal ${open ? 'is-open' : ''}`}
      id="answer"
      aria-labelledby="answer-title"
      aria-hidden={!open}
    >
      <div className="answer-reveal__clip">
        <div className="answer-reveal__leaf">
          <span className="answer-reveal__leaf-grain" aria-hidden="true">
            <svg viewBox="0 0 600 600" preserveAspectRatio="none">
              <defs>
                <filter id={`answer-leaf-paper-${leafGrainId}`} x="0%" y="0%" width="100%" height="100%">
                  <feTurbulence type="fractalNoise" baseFrequency="0.95" numOctaves="2" seed="22" stitchTiles="stitch" />
                  <feColorMatrix type="matrix" values="0 0 0 0 .14  0 0 0 0 .08  0 0 0 0 .04  0 0 0 .09 0" />
                  <feComposite in2="SourceGraphic" operator="in" />
                </filter>
              </defs>
              <rect x="28" y="0" width="544" height="600" fill="#f7f1e0" filter={`url(#answer-leaf-paper-${leafGrainId})`} />
            </svg>
          </span>
          <span className="answer-reveal__leaf-bleed" aria-hidden="true" />
          <span className="answer-reveal__leaf-cornermark" aria-hidden="true" />
          <span className="answer-reveal__tipped" aria-hidden="true">tipped in · folio v</span>
          <span className="answer-reveal__gluetop" aria-hidden="true" />
          <span className="answer-reveal__gluetop answer-reveal__gluetop--right" aria-hidden="true" />
          <span className="answer-reveal__foldline" aria-hidden="true">
            <svg viewBox="0 0 600 24" preserveAspectRatio="none">
              <path d="M2 12c40-6 80 6 120 0s80-8 120-2 80 6 120-4 80-8 120-1 80 6 118 1" fill="none" stroke="currentColor" strokeWidth=".9" strokeLinecap="round" />
            </svg>
          </span>
          <div className="answer-reveal__seal" aria-hidden="true">
            <PressStamp voice={voice} size={124} />
            <span className="answer-reveal__wax-drop" aria-hidden="true">
              <span className="answer-reveal__wax-drop-bead" />
              <span className="answer-reveal__wax-drop-wisp" />
            </span>
          </div>
          <svg className="answer-reveal__ink-drip" viewBox="0 0 36 110" aria-hidden="true">
            <path
              className="answer-reveal__ink-drip-stroke"
              d="M16 4c1 12-5 18 2 28s-4 22 2 32-2 22 1 32"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              pathLength="100"
            />
            <circle className="answer-reveal__ink-drip-bead" cx="20" cy="100" r="3" fill="currentColor" />
            <circle className="answer-reveal__ink-drip-splash" cx="12" cy="98" r="1.2" fill="currentColor" />
            <circle className="answer-reveal__ink-drip-splash answer-reveal__ink-drip-splash--alt" cx="26" cy="96" r=".8" fill="currentColor" />
          </svg>
          <div className="answer-reveal__inner">
            <div className="answer-reveal__row">
              <span className="answer-reveal__folio" aria-hidden="true">folio v · the proof</span>
              <span className="answer-reveal__stamp" aria-hidden="true">
                <span>m³</span>
                <em>for now</em>
              </span>
            </div>
            <span className="answer-reveal__trail" aria-hidden="true">
              <span className="answer-reveal__trail-dot" />
              <span className="answer-reveal__trail-dot" />
              <span className="answer-reveal__trail-dot" />
              <span className="answer-reveal__trail-dot answer-reveal__trail-dot--big" />
            </span>
            <div className="answer-reveal__copy">
              <p className="eyebrow eyebrow--dark"><span className="eyebrow__line" />the answer <em>for now</em></p>
              <p className="answer-reveal__prelude" aria-hidden="true">
                <span className="answer-reveal__prelude-mark">¶</span>
                <em>after two readings and three presses, the page exhales —</em>
              </p>
              <div className="answer-reveal__answer">
                <h2 id="answer-title">Yes — when it stops trying to look impressive.</h2>
                <span className="answer-reveal__answer-exhale" aria-hidden="true">
                  <svg className="answer-reveal__answer-exhale-svg" viewBox="0 0 320 36" preserveAspectRatio="xMaxYMid meet">
                    <path
                      className="answer-reveal__answer-exhale-stroke answer-reveal__answer-exhale-stroke--lead"
                      d="M2 22c14-10 30 6 56-2s36-8 60-2 40 6 64-2 40-8 60-2 36 6 56-2"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.1"
                      strokeLinecap="round"
                      pathLength="100"
                    />
                    <path
                      className="answer-reveal__answer-exhale-stroke answer-reveal__answer-exhale-stroke--trail"
                      d="M40 28c12-4 24 4 44-1s28-4 44 0 28 4 44-1 28-4 44-1 24 6 36-1 24-4 36-1 20 4 28-1"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth=".55"
                      strokeLinecap="round"
                      opacity=".55"
                      pathLength="100"
                    />
                    <circle className="answer-reveal__answer-exhale-bead" cx="314" cy="20" r="2.2" fill="currentColor" />
                    <circle className="answer-reveal__answer-exhale-halo" cx="314" cy="20" r="6" fill="none" stroke="currentColor" strokeWidth=".35" strokeDasharray=".8 2" opacity=".7" />
                  </svg>
                  <span className="answer-reveal__answer-exhale-tag">
                    <span className="answer-reveal__answer-exhale-tag-mark" />
                    <em>the answer, set down</em>
                  </span>
                </span>
              </div>
              <div className="answer-reveal__columns">
                <p>
                  The good part is not the gradient, the flourish, or the clever little mechanism. It is the moment the page gives you room to notice <em>one thing</em>. Then another.
                </p>
                <p>So this is a qualified yes: good at front-end means attentive to the person on the other side of the glass. The rest is decoration with a job to do.</p>
              </div>
              <div className="answer-reveal__pull">
                <span className="answer-reveal__pull-rule" aria-hidden="true" />
                <em>attention, not ornament</em>
                <span className="answer-reveal__pull-rule" aria-hidden="true" />
              </div>
              <div className="answer-reveal__colophon">
                <span>set in system serif</span>
                <span aria-hidden="true">·</span>
                <span>composed by hand</span>
                <span aria-hidden="true">·</span>
                <span>folded once</span>
              </div>
              <button type="button" className="answer-reveal__close" onClick={() => { onClose(); window.requestAnimationFrame(() => triggerRef.current?.focus()) }} tabIndex={open ? 0 : -1}>
                <PencilIcon />
                <span>fold it back</span>
                <ArrowIcon />
              </button>
              <AnswerCoda voice={voice} word={word} setToday={setToday} />
            </div>
          </div>
          <span className="answer-reveal__keep" aria-hidden="true">
            <KeptMark voice={voice} variant="answer" size={104} caption={`pressed in the ${voice === 'quiet' ? 'quiet cut' : voice === 'human' ? 'human hand' : 'bold signal'} voice · set on ${setToday}`} />
          </span>
          <span className="answer-reveal__fresh" aria-hidden="true">
            <span className="answer-reveal__fresh-tag">fresh impression</span>
            <svg viewBox="0 0 64 64" className="answer-reveal__fresh-seal">
              <defs>
                <filter id={`answer-fresh-grain-${leafGrainId}`} x="-10%" y="-10%" width="120%" height="120%">
                  <feTurbulence type="fractalNoise" baseFrequency="2.6" numOctaves="2" seed="9" stitchTiles="stitch" />
                  <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .5 0" />
                  <feComposite in2="SourceGraphic" operator="in" />
                </filter>
              </defs>
              <g filter={`url(#answer-fresh-grain-${leafGrainId})`} opacity="0.9">
                <circle cx="32" cy="32" r="26" fill="none" stroke="currentColor" strokeWidth=".9" />
                <circle cx="32" cy="32" r="20" fill="none" stroke="currentColor" strokeWidth=".35" strokeDasharray=".8 1.6" opacity=".7" />
                <text x="32" y="22" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="3.4" letterSpacing="1.2" fill="currentColor">YES</text>
                <text x="32" y="38" textAnchor="middle" fontFamily="Georgia, serif" fontStyle="italic" fontSize="14" fill="currentColor">m³</text>
                <text x="32" y="48" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="3.2" letterSpacing="1.1" fill="currentColor">FOR NOW</text>
              </g>
            </svg>
            <span className="answer-reveal__fresh-pencil" aria-hidden="true">
              <svg viewBox="0 0 80 12" preserveAspectRatio="none">
                <path d="M2 8c10-6 22 4 34-1s22-5 34-2 22 4 8 1" fill="none" stroke="currentColor" strokeWidth=".9" strokeLinecap="round" />
              </svg>
              <em>pressed at the moment of unfolding</em>
            </span>
          </span>
        </div>
      </div>
    </section>
  )
}
