import { useCallback, useEffect, useId, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from 'react'
import { NOTES, type WordId } from './notes'
import { PressStamp } from './PressStamp'
import { ImpressionRibbon, type ImpressionMark } from './ImpressionRibbon'
import { MarkedProof } from './MarkedProof'
import { LetterToReader } from './LetterToReader'
import { Press, type VoiceId } from './Press'
import { InkDust } from './InkDust'
import { InkTrail } from './InkTrail'
import { Almanac } from './Almanac'
import { MarginNotes } from './MarginNotes'
import { Watermark } from './Watermark'
import { TypePlate } from './TypePlate'
import { PressRibbon } from './PressRibbon'
import { SecondReading } from './SecondReading'
import { PressStrikeFlash } from './PressStrikeFlash'
import { FolioMark } from './FolioMark'

import { PaperGrain } from './PaperGrain'
import { KeptMark } from './KeptMark'
import { MarginalCaret } from './MarginalCaret'
import { MarginaliaStrip } from './MarginaliaStrip'
import { PressSignature } from './PressSignature'
import { TitleSweep } from './TitleSweep'
import { WayfinderSeal } from './WayfinderSeal'
import { TitleRule } from './TitleRule'
import { PressSignatureMark } from './PressSignatureMark'
import { NotesSection } from './NotesSection'
import { PageFold } from './PageFold'
import { PressSpine } from './PressSpine'
import { PlateProvenance } from './PlateProvenance'
import { FirstReading } from './FirstReading'
import { ReaderPlate } from './ReaderPlate'
import { PressPlate } from './PressPlate'
import { SpecimenTray } from './SpecimenTray'
import { FolioLedger } from './FolioLedger'
import { TitleFolio } from './TitleFolio'
import { ClosingPlate } from './ClosingPlate'

const VOICE_CYCLE: Record<VoiceId, VoiceId> = {
  quiet: 'human',
  human: 'bold',
  bold: 'quiet',
}

const TITLE = 'is Minimax M3 good at frontend yet?'

function formatSetToday() {
  const now = new Date()
  const month = now.toLocaleString('en-US', { month: 'short' }).toLowerCase()
  const day = String(now.getDate()).padStart(2, '0')
  const year = String(now.getFullYear()).slice(-2)
  return `${month} · ${day} · ${year}`
}

const READING_SECTIONS: { id: string; index: string; label: string }[] = [
  { id: 'question', index: 'i', label: 'question' },
  { id: 'press', index: 'ii', label: 'press bed' },
  { id: 'contents', index: 'iii', label: 'contents' },
  { id: 'day', index: 'iii·', label: 'day sheet' },
  { id: 'note', index: '·', label: 'note' },
  { id: 'reader-plate', index: '·', label: 'bookplate' },
  { id: 'proof', index: 'iv', label: 'proof' },
  { id: 'pressings', index: 'v', label: 'pressings' },
  { id: 'notes', index: 'vi', label: 'marginalia' },
  { id: 'answer', index: 'viii', label: 'answer' },
]

type Voice = {
  id: VoiceId
  name: string
  descriptor: string
  body: string
  lines: [string, string, string]
}

const VOICES: Voice[] = [
  {
    id: 'quiet',
    name: 'quiet cut',
    descriptor: 'small caps / close set',
    body: 'The practical reading. It gets out of the way and lets the question do the work.',
    lines: ['is Minimax', 'good at frontend', 'yet?'],
  },
  {
    id: 'human',
    name: 'human hand',
    descriptor: 'italic / a little warm',
    body: 'The personal reading. A little wobble makes the machine feel less like a machine.',
    lines: ['is M3', 'good at frontend', 'yet?'],
  },
  {
    id: 'bold',
    name: 'bold signal',
    descriptor: 'display / no apology',
    body: 'The poster reading. It answers with its whole chest, then leaves the room for doubt.',
    lines: ['IS', 'GOOD AT', 'FRONTEND YET?'],
  },
]

function LogoMark({ size = 38, accent = 'var(--acid)' }: { size?: number; accent?: string }) {
  return (
    <svg className="brand__mark" width={size} height={size} viewBox="0 0 42 42" aria-hidden="true" style={{ color: accent }}>
      <circle cx="21" cy="21" r="18.5" fill="none" stroke="currentColor" strokeWidth=".9" />
      <circle cx="21" cy="21" r="13.5" fill="none" stroke="currentColor" strokeWidth=".55" strokeDasharray="1.2 2.4" opacity=".85" />
      <path d="M8 21h26M21 8v26" stroke="currentColor" strokeWidth=".5" opacity=".4" />
      <path d="M5.5 19.5a16 16 0 0 1 31 0" fill="none" stroke="currentColor" strokeWidth=".55" opacity=".55" />
      <text x="21" y="25.5" textAnchor="middle" fontFamily="Georgia, serif" fontStyle="italic" fontSize="11.5" fill="currentColor">m³</text>
      <circle cx="21" cy="5.4" r=".95" fill="currentColor" />
      <circle cx="21" cy="36.6" r=".95" fill="currentColor" />
      <circle cx="5.4" cy="21" r=".65" fill="currentColor" opacity=".55" />
      <circle cx="36.6" cy="21" r=".65" fill="currentColor" opacity=".55" />
    </svg>
  )
}

function PaperWarmth({ voice }: { voice: VoiceId }) {
  return <span className={`paper-warmth paper-warmth--${voice}`} aria-hidden="true" />
}

const FOLIO_ORDER: string[] = ['question', 'press', 'contents', 'day', 'note', 'reader-plate', 'proof', 'pressings', 'notes', 'answer']

function ArrowIcon() {
  return (
    <svg className="arrow-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 12h15M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function PencilIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3 21l4-1 11-11-3-3L4 17l-1 4zM14.5 6.5l3 3" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}






function TitleToken({
  id,
  text,
  selected,
  onSelect,
  onHover,
  onLeave,
  tokenRef,
}: {
  id: WordId
  text: string
  selected: boolean
  onSelect: (id: WordId) => void
  onHover: (id: WordId) => void
  onLeave: () => void
  tokenRef: (node: HTMLSpanElement | null) => void
}) {
  return (
    <span
      ref={tokenRef}
      className={`title-token title-token--${id} ${selected ? 'is-selected' : ''}`}
      data-word={id}
      role="button"
      tabIndex={0}
      aria-pressed={selected}
      aria-describedby={`note-${id}`}
      onClick={() => onSelect(id)}
      onMouseEnter={() => onHover(id)}
      onMouseLeave={onLeave}
      onFocus={() => onHover(id)}
      onBlur={onLeave}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onSelect(id)
        }
      }}
    >
      <span className="title-token__text">{text}</span>
      <svg className="title-token__mark" viewBox="0 0 200 18" preserveAspectRatio="none" aria-hidden="true">
        <path
          className="title-token__stroke"
          d="M2 12 C 24 4, 48 16, 72 8 S 120 0, 144 10 S 178 14, 198 6"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          pathLength="100"
          strokeDasharray="100 100"
          strokeDashoffset="100"
        />
        <circle className="title-token__tail" cx="196" cy="6" r="1.8" />
      </svg>
      <span className="title-token__glyph" aria-hidden="true">
        <svg viewBox="0 0 60 22">
          <path d="M14 4 C 18 14, 10 16, 14 18" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
        </svg>
      </span>
    </span>
  )
}

function AnswerReveal({ open, onClose, triggerRef, voice, setToday }: {
  open: boolean
  onClose: () => void
  triggerRef: React.MutableRefObject<HTMLButtonElement | null>
  voice: VoiceId
  setToday: string
}) {
  const leafGrainId = useId().replace(/:/g, '')
  const dropcapGrainId = useId().replace(/:/g, '')
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
          <span className="answer-reveal__tipped" aria-hidden="true">tipped in · folio viii</span>
          <span className="answer-reveal__gluetop" aria-hidden="true" />
          <span className="answer-reveal__gluetop answer-reveal__gluetop--right" aria-hidden="true" />
          <span className="answer-reveal__foldline" aria-hidden="true">
            <svg viewBox="0 0 600 24" preserveAspectRatio="none">
              <path d="M2 12c40-6 80 6 120 0s80-8 120-2 80 6 120-4 80-8 120-1 80 6 118 1" fill="none" stroke="currentColor" strokeWidth=".9" strokeLinecap="round" />
            </svg>
          </span>
          <span className="answer-reveal__foldhere" aria-hidden="true">
            <svg viewBox="0 0 64 64" preserveAspectRatio="none">
              <circle cx="32" cy="32" r="11" fill="none" stroke="currentColor" strokeWidth=".55" />
              <circle cx="32" cy="32" r="14" fill="none" stroke="currentColor" strokeWidth=".35" strokeDasharray=".7 1.6" opacity=".6" />
              <path d="M32 18v28M18 32h28" stroke="currentColor" strokeWidth=".45" strokeLinecap="round" opacity=".7" />
              <circle cx="32" cy="32" r="1.4" fill="currentColor" />
            </svg>
            <span className="answer-reveal__foldhere-tag">fold · here</span>
            <span className="answer-reveal__foldhere-trail" aria-hidden="true">
              <svg viewBox="0 0 56 8" preserveAspectRatio="none">
                <path d="M2 4c8-4 18 4 28 0s20-2 24-1" fill="none" stroke="currentColor" strokeWidth=".5" strokeLinecap="round" />
              </svg>
            </span>
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
            />
            <circle className="answer-reveal__ink-drip-bead" cx="20" cy="100" r="3" fill="currentColor" />
            <circle className="answer-reveal__ink-drip-splash" cx="12" cy="98" r="1.2" fill="currentColor" />
            <circle className="answer-reveal__ink-drip-splash answer-reveal__ink-drip-splash--alt" cx="26" cy="96" r=".8" fill="currentColor" />
          </svg>
          <div className="answer-reveal__inner">
            <div className="answer-reveal__row">
              <span className="answer-reveal__folio" aria-hidden="true">folio viii · the proof</span>
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
              <h2 id="answer-title">Yes — when it stops trying to look impressive.</h2>
              <div className="answer-reveal__columns">
                <p>
                  <span className="answer-reveal__dropcap" aria-hidden="true">
                    <svg className="answer-reveal__dropcap-svg" viewBox="0 0 64 64" aria-hidden="true">
                      <defs>
                        <filter id={`answer-dropcap-grain-${dropcapGrainId}`} x="-6%" y="-6%" width="112%" height="112%">
                          <feTurbulence type="fractalNoise" baseFrequency="2.6" numOctaves="2" seed="11" stitchTiles="stitch" />
                          <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .5 0" />
                          <feComposite in2="SourceGraphic" operator="in" />
                        </filter>
                      </defs>
                      <g filter={`url(#answer-dropcap-grain-${dropcapGrainId})`} opacity=".95">
                        <text
                          x="32"
                          y="50"
                          textAnchor="middle"
                          fontFamily="Georgia, 'Iowan Old Style', serif"
                          fontStyle="italic"
                          fontSize="58"
                          letterSpacing="-.045em"
                          fill="currentColor"
                        >T</text>
                        <line x1="6" y1="10" x2="58" y2="10" stroke="currentColor" strokeWidth=".55" strokeLinecap="round" opacity=".55" />
                        <circle cx="32" cy="6" r="1.4" fill="currentColor" opacity=".7" />
                      </g>
                    </svg>
                  </span>
                  he good part is not the gradient, the flourish, or the clever little mechanism. It is the moment the page gives you room to notice <em>one thing</em>. Then another.
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
            </div>
          </div>
          <span className="answer-reveal__keep" aria-hidden="true">
            <KeptMark voice={voice} variant="answer" size={104} caption={`pressed in the ${voice === 'quiet' ? 'quiet cut' : voice === 'human' ? 'human hand' : 'bold signal'} voice · set on ${setToday}`} />
          </span>
          <span className="answer-reveal__fresh" aria-hidden="true">
            <span className="answer-reveal__fresh-tag">fresh impression</span>
            <svg viewBox="0 0 64 64" className="answer-reveal__fresh-seal">
              <defs>
                <filter id={`answer-fresh-grain`} x="-10%" y="-10%" width="120%" height="120%">
                  <feTurbulence type="fractalNoise" baseFrequency="2.6" numOctaves="2" seed="9" stitchTiles="stitch" />
                  <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .5 0" />
                  <feComposite in2="SourceGraphic" operator="in" />
                </filter>
              </defs>
              <g filter="url(#answer-fresh-grain)" opacity="0.9">
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



function Colophon({ voice, word, setToday, readerName }: { voice: VoiceId; word: WordId; setToday: string; readerName: string }) {
  const tag = voice === 'bold' ? 'NO APOLOGIES' : voice === 'human' ? 'BY HAND' : 'SET WITH CARE'
  const voiceName = voice === 'bold' ? 'bold signal' : voice === 'human' ? 'human hand' : 'quiet cut'
  const mark = word === 'm3' ? 'stet' : word === 'good' ? 'caret' : 'query'
  const label = word === 'm3' ? 'M3' : word === 'good' ? 'good at' : 'yet?'
  const signedReader = readerName.trim()
  const signedLine = signedReader
    ? `impressed for ${signedReader}`
    : 'impressed for the next reader'
  return (
    <footer className={`colophon ${signedReader ? 'is-signed' : ''}`} aria-label="Colophon">
      <div className="colophon__plate">
        <span className="colophon__date" aria-hidden="true">
          <span className="colophon__date-rule" />
          <span className="colophon__date-tag">
            <span className="colophon__date-dot" />
            set today · {setToday}
          </span>
          <span className="colophon__date-rule" />
        </span>
        <span className="colophon__crease" aria-hidden="true" />
        <span className="colophon__crease colophon__crease--v" aria-hidden="true" />
        <span className="colophon__flap" aria-hidden="true">
          <svg viewBox="0 0 100 60" preserveAspectRatio="none">
            <path d="M2 2L50 38L98 2" fill="none" stroke="currentColor" strokeWidth=".7" strokeDasharray="2 2.4" opacity=".55" />
            <circle cx="50" cy="38" r="1.6" fill="currentColor" opacity=".65" />
          </svg>
        </span>
        <div className="colophon__head">
          <div className="colophon__identity">
            <span className="colophon__mark">
              <LogoMark size={34} accent="var(--coral)" />
            </span>
            <div className="colophon__title">
              <span className="colophon__press">m³ press</span>
              <em>a single-page editorial experiment</em>
            </div>
          </div>
          <div className="colophon__seal" aria-hidden="true">
            <PressStamp voice={voice} size={68} />
            <span className="colophon__seal-wax" aria-hidden="true">
              <span className="colophon__seal-wax-bead" />
              <span className="colophon__seal-wax-wisp" />
            </span>
          </div>
        </div>
        <div className="colophon__grid">
          <div className="colophon__row">
            <span className="colophon__label">composed</span>
            <span className="colophon__value">by hand, folded once</span>
          </div>
          <div className="colophon__row">
            <span className="colophon__label">voice</span>
            <span className="colophon__value">{tag}</span>
          </div>
          <div className="colophon__row">
            <span className="colophon__label">impressed for</span>
            <span className={`colophon__value colophon__reader ${signedReader ? 'is-set' : ''}`}>
              <em className="colophon__reader-name">{signedReader || 'the next reader'}</em>
              <span className="colophon__reader-rule" aria-hidden="true">
                <svg viewBox="0 0 120 8" preserveAspectRatio="none">
                  <path
                    d="M2 4c12-4 26 4 42-1s28-5 42-1 24 6 32-1"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth=".8"
                    strokeLinecap="round"
                    className="colophon__reader-rule-stroke"
                  />
                  <circle className="colophon__reader-rule-bead" cx="118" cy="4" r="1" fill="currentColor" />
                </svg>
              </span>
            </span>
          </div>
          <div className="colophon__row">
            <span className="colophon__label">palette</span>
            <span className="colophon__swatches" aria-hidden="true">
              <span className="colophon__swatch" style={{ background: 'var(--acid)' }} title="acid" />
              <span className="colophon__swatch" style={{ background: 'var(--coral)' }} title="coral" />
              <span className="colophon__swatch" style={{ background: 'var(--blue)' }} title="blue" />
              <span className="colophon__swatch" style={{ background: 'var(--paper)' }} title="paper" />
            </span>
          </div>
        </div>
        <div className="colophon__foot">
          <p className="colophon__line">the question remains useful <i>because the answer can change</i></p>
          <a className="colophon__back" href="#question">back to the question <ArrowIcon /></a>
        </div>
        <div className="colophon__impression">
          <span className="colophon__impression-tag">
            <span className="colophon__impression-tag-dot" aria-hidden="true" />
            this impression
          </span>
          <span className="colophon__impression-line">
            <span className="colophon__impression-head">
              pulled in <em>{voiceName}</em> · the active mark is <em>{label}</em> <span className="colophon__impression-mark-tag" aria-hidden="true">({mark})</span> · <em>{signedLine}</em>
            </span>
            <span className="colophon__impression-meta">
              folio viii <span aria-hidden="true">·</span> press <em>·</em> m³ bay <span aria-hidden="true">·</span> shift + v to cycle
            </span>
          </span>
          <span className="colophon__impression-mark" aria-hidden="true">
            <svg viewBox="0 0 56 18">
              <path d="M2 11c6-8 14 4 22-3s8-6 14-1 12 4 16-1" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
              <circle cx="54" cy="9" r="1.6" fill="currentColor" />
            </svg>
          </span>
        </div>
        <div className="colophon__signature" aria-hidden="true">
          <KeptMark voice={voice} variant="colophon" size={120} caption={`composed by m³ · ${signedLine} · ${setToday}`} />
        </div>
      </div>
      <p className="colophon__signature-note">
        <span aria-hidden="true">※</span>
        a quiet piece of an ongoing conversation about what good front-end work actually is.
      </p>
    </footer>
  )
}

const VOICE_LABEL: Record<VoiceId, string> = { quiet: 'quiet cut', human: 'human hand', bold: 'bold signal' }
const VOICE_LETTER: Record<VoiceId, string> = { quiet: 'A', human: 'B', bold: 'C' }

export function App() {
  const [answerOpen, setAnswerOpen] = useState(false)
  const [selectedWord, setSelectedWord] = useState<WordId>('good')
  const [hoveredWord, setHoveredWord] = useState<WordId | null>(null)
  const [voice, setVoice] = useState<VoiceId>('quiet')
  const [activeSection, setActiveSection] = useState('question')
  const [announcement, setAnnouncement] = useState('')
  const [marks, setMarks] = useState<ImpressionMark[]>([])
  const [setToday] = useState(() => formatSetToday())
  const [strikeTick, setStrikeTick] = useState(0)
  const [heroBodyVisible, setHeroBodyVisible] = useState(false)
  const [readerName, setReaderName] = useState('')
  const firstVoiceRef = useRef(true)
  const tokenRefs = useRef<Partial<Record<WordId, HTMLSpanElement | null>>>({})
  const answerTriggerRef = useRef<HTMLButtonElement>(null)
  const heroBodyRef = useRef<HTMLDivElement>(null)
  const bodyGrainId = useId().replace(/:/g, '')
  const continueGrainId = useId().replace(/:/g, '')
  const continueFadeId = useId().replace(/:/g, '')

  const activeWord = hoveredWord ?? selectedWord

  const pushMark = useCallback((mark: ImpressionMark) => {
    setMarks(prev => {
      const next = [...prev, mark]
      return next.length > 24 ? next.slice(next.length - 24) : next
    })
  }, [])

  useEffect(() => {
    document.title = TITLE
  }, [])

  useEffect(() => {
    const elements = ['question', 'press', 'contents', 'day', 'note', 'reader-plate', 'proof', 'pressings', 'notes', 'answer']
      .map(id => document.getElementById(id))
      .filter((element): element is HTMLElement => Boolean(element))
    if (!('IntersectionObserver' in window)) return
    const observer = new IntersectionObserver(
      entries => {
        const visible = entries
          .filter(entry => entry.isIntersecting && entry.intersectionRatio > 0.05)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (visible[0]) setActiveSection(visible[0].target.id)
      },
      { rootMargin: '-22% 0px -58% 0px', threshold: [0.05, 0.25, 0.6] },
    )
    elements.forEach(element => observer.observe(element))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!('IntersectionObserver' in window)) {
      setHeroBodyVisible(true)
      return
    }
    const node = heroBodyRef.current
    if (!node) return
    const observer = new IntersectionObserver(
      entries => {
        const visible = entries.some(entry => entry.isIntersecting)
        if (visible) {
          setHeroBodyVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.18, rootMargin: '0px 0px -8% 0px' },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.defaultPrevented) return
      const target = event.target as HTMLElement | null
      const tag = target?.tagName?.toLowerCase()
      if (tag === 'input' || tag === 'textarea' || target?.isContentEditable) return
      if (event.shiftKey && (event.key === 'V' || event.key === 'v')) {
        event.preventDefault()
        setVoice(prev => {
          const next = VOICE_CYCLE[prev]
          const labelMap: Record<VoiceId, string> = { quiet: 'quiet cut', human: 'human hand', bold: 'bold signal' }
          setAnnouncement(`Lever pulled. Now setting in ${labelMap[next]}.`)
          pushMark({ kind: 'pull', voice: next, from: prev })
          return next
        })
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [pushMark])

  const selectWord = (id: WordId, focus = false) => {
    const note = NOTES.find(item => item.id === id)
    setSelectedWord(id)
    setAnnouncement(note ? `${note.label}: ${note.title}.` : '')
    pushMark({ kind: 'word', word: id })
    if (focus) window.requestAnimationFrame(() => tokenRefs.current[id]?.focus())
  }

  const selectVoice = (id: VoiceId) => {
    setVoice(prev => (prev === id ? prev : id))
    const next = VOICES.find(item => item.id === id)
    setAnnouncement(next ? `${next.name} selected.` : '')
  }

  useEffect(() => {
    pushMark({ kind: 'voice', voice })
  }, [voice, pushMark])

  useEffect(() => {
    if (firstVoiceRef.current) {
      firstVoiceRef.current = false
      return
    }
    setStrikeTick(tick => tick + 1)
  }, [voice])

  const selectVoiceByKey = (event: ReactKeyboardEvent<HTMLButtonElement>, id: VoiceId) => {
    const index = VOICES.findIndex(item => item.id === id)
    let nextIndex = index
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') nextIndex = (index + 1) % VOICES.length
    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') nextIndex = (index - 1 + VOICES.length) % VOICES.length
    if (event.key === 'Home') nextIndex = 0
    if (event.key === 'End') nextIndex = VOICES.length - 1
    if (nextIndex === index) return
    event.preventDefault()
    const next = VOICES[nextIndex].id
    selectVoice(next)
  }

  const toggleAnswer = () => {
    const next = !answerOpen
    setAnswerOpen(next)
    setAnnouncement(next ? 'Answer revealed.' : 'Answer folded away.')
    if (next) {
      window.requestAnimationFrame(() => document.getElementById('answer')?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
    } else {
      window.requestAnimationFrame(() => answerTriggerRef.current?.focus())
    }
  }

  const closeAnswer = () => {
    setAnswerOpen(false)
    setAnnouncement('Answer folded away.')
  }

  const openAnswerFromNav = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    if (!answerOpen) setAnswerOpen(true)
    window.requestAnimationFrame(() => document.getElementById('answer')?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
  }

  return (
    <main className={`app app--voice-${voice} app--word-${activeWord}`}>
      <PaperGrain />
      <InkDust />
      <InkTrail />
      <div className="app__grain" aria-hidden="true" />
      <div className="app__pencil" aria-hidden="true" />
      <Watermark />
      <header className="site-header site-header--single">
        <div className="site-header__row site-header__row--primary">
          <a className="brand" href="#question" aria-label="Return to the question">
            <LogoMark size={32} />
            <span className="brand__copy">
              <strong>m³ press</strong>
              <em>an open question, set today</em>
            </span>
          </a>
          <span className="site-header__set" aria-hidden="true">
            <span className="site-header__set-mark" />
            <span className="site-header__set-line">set <em>{setToday}</em></span>
            <span className="site-header__set-mark site-header__set-mark--alt" />
          </span>
          <WayfinderSeal activeId={activeSection} voice={voice} setToday={setToday} />
        </div>
      </header>

      <PressSpine activeId={activeSection} voice={voice} />

      <div className="page">
        <section className="hero" id="question" aria-labelledby="page-title">
          <span className="hero__epigraph" aria-label="Editorial epigraph">
            <span className="hero__epigraph-rule" aria-hidden="true" />
            <svg className="hero__epigraph-mark" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 3l1.6 5.2 5.2 1.6-5.2 1.6L12 16.6l-1.6-5.2L5.2 9.8l5.2-1.6z" fill="currentColor" opacity=".9" />
              <circle cx="12" cy="9.8" r="1.4" fill="var(--night)" />
            </svg>
            <em>on attention, ornament, &amp; the matter of good front-end work</em>
            <span className="hero__epigraph-rule hero__epigraph-rule--end" aria-hidden="true" />
          </span>

          <PlateProvenance voice={voice} setToday={setToday} />

          <FolioMark
            folio="i"
            setToday={setToday}
            voiceLabel={VOICE_LABEL[voice]}
            voiceLetter={VOICE_LETTER[voice]}
            voiceTone={voice === 'quiet' ? 'var(--blue)' : voice === 'human' ? 'var(--coral)' : 'var(--acid)'}
          />

          <div className="hero__spread">
            <PressStrikeFlash strikeTick={strikeTick} voice={voice} />
            <PaperWarmth voice={voice} />

            <div className="hero__plate">
              <MarginalCaret active={selectedWord} tokenRefs={tokenRefs} />
              <div className="hero__copy">
                <h1 key={`title-${strikeTick}`} className={`hero__title hero__title--${voice}`} id="page-title" aria-label={TITLE}>
                  <span className="title__line">is Minimax </span>
                  <span className="title__line">
                    <TitleToken id="m3" text="M3" selected={activeWord === 'm3'} onSelect={id => selectWord(id)} onHover={setHoveredWord} onLeave={() => setHoveredWord(null)} tokenRef={node => { tokenRefs.current.m3 = node }} />{' '}
                    <TitleToken id="good" text="good at" selected={activeWord === 'good'} onSelect={id => selectWord(id)} onHover={setHoveredWord} onLeave={() => setHoveredWord(null)} tokenRef={node => { tokenRefs.current.good = node }} />
                  </span>
                  <span className="title__line"> frontend <TitleToken id="yet" text="yet" selected={activeWord === 'yet'} onSelect={id => selectWord(id)} onHover={setHoveredWord} onLeave={() => setHoveredWord(null)} tokenRef={node => { tokenRefs.current.yet = node }} />
                    <span className={`title__question ${answerOpen ? 'is-sealed' : ''}`} aria-hidden="true">
                      <span className="title__question-glyph">?</span>
                      <span className="title__question-period" />
                    </span>
                  </span>
                </h1>

                <TitleRule voice={voice} active={selectedWord} hovered={hoveredWord} setToday={setToday} />
              </div>
            </div>

            <TitleSweep voice={voice} setToday={setToday} />

            <MarginaliaStrip
              active={selectedWord}
              hovered={hoveredWord}
              onHover={setHoveredWord}
              onLeave={() => setHoveredWord(null)}
              onSelect={id => selectWord(id)}
            />
          </div>

          <FirstReading voice={voice} setToday={setToday} />

          <div className="hero__chrome">
            <PressPlate
              ref={answerTriggerRef}
              voice={voice}
              answerOpen={answerOpen}
              readerName={readerName}
              onVoice={selectVoice}
              onVoiceKey={selectVoiceByKey}
              onToggleAnswer={toggleAnswer}
              setToday={setToday}
            />
          </div>

          <div className={`hero__body ${heroBodyVisible ? 'is-in-view' : ''}`} ref={heroBodyRef}>
            <span className="hero__body-plate" aria-hidden="true">
              <span className="hero__body-plate-rule" />
              <span className="hero__body-plate-tag">
                <span className="hero__body-plate-dot" />
                colophon of the title page
                <span className="hero__body-plate-dot" />
              </span>
              <span className="hero__body-plate-rule" />
            </span>

            <div className="hero__body-grid hero__body-grid--single">
              <div className="hero__summary">
                <span className="hero__dropcap" aria-hidden="true">
                  <svg className="hero__dropcap-svg" viewBox="0 0 64 64">
                    <defs>
                      <filter id={`dropcap-grain-${bodyGrainId}`} x="-6%" y="-6%" width="112%" height="112%">
                        <feTurbulence type="fractalNoise" baseFrequency="2.4" numOctaves="2" seed="4" stitchTiles="stitch" />
                        <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .5 0" />
                        <feComposite in2="SourceGraphic" operator="in" />
                      </filter>
                    </defs>
                    <g filter={`url(#dropcap-grain-${bodyGrainId})`} opacity=".95">
                      <circle cx="32" cy="32" r="29" fill="none" stroke="currentColor" strokeWidth=".7" opacity=".5" />
                      <circle cx="32" cy="32" r="24" fill="none" stroke="currentColor" strokeWidth=".35" strokeDasharray="1 2.2" opacity=".4" />
                      <text
                        x="32"
                        y="44"
                        textAnchor="middle"
                        fontFamily="Georgia, 'Iowan Old Style', serif"
                        fontStyle="italic"
                        fontSize="40"
                        fill="currentColor"
                      >A</text>
                      <line x1="18" y1="14" x2="46" y2="14" stroke="currentColor" strokeWidth=".55" strokeLinecap="round" opacity=".65" />
                      <circle cx="32" cy="10" r="1.4" fill="currentColor" opacity=".75" />
                    </g>
                  </svg>
                </span>
                <span className="hero__summary-text">
                  <span className="hero__summary-paragraph">
                    The title page is set to ask whether a machine can build a place that feels like <em>someone was here.</em> Three words earn the marginalia; three voices are tried because typography is part of any honest answer.
                  </span>
                  <span className="hero__summary-paragraph">
                    Read it once with the eye, again with the ear — and a third time, when the answer is folded open. The page is the press. You are the only reader it has.
                  </span>
                </span>
                <svg className="hero__summary-scrawl" viewBox="0 0 220 18" preserveAspectRatio="none" aria-hidden="true">
                  <path
                    className="hero__summary-scrawl-stroke"
                    d="M2 12c12-8 24 4 36-1s24-6 36-2 24 6 36-2 24-6 36-1 24 4 38-2"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeLinecap="round"
                    pathLength="100"
                  />
                  <circle className="hero__summary-scrawl-bead" cx="216" cy="9" r="1.6" fill="currentColor" />
                </svg>
              </div>

              <aside className="hero__readings" aria-label="Three readings of the question">
                <span className="hero__readings-rule hero__readings-rule--lead" aria-hidden="true" />
                <span className="hero__readings-eyebrow" aria-hidden="true">
                  <span className="hero__readings-eyebrow-mark" />
                  the same question, set three ways
                </span>
                <SpecimenTray active={voice} onSelect={selectVoice} />
                <span className="hero__readings-rule hero__readings-rule--trail" aria-hidden="true" />
                <span className="hero__readings-foot" aria-hidden="true">
                  pull a setting above · the title answers with whichever is active
                </span>
              </aside>
            </div>

            <figure className="hero__pull" aria-label="A printer's motto">
              <span className="hero__pull-rule" aria-hidden="true" />
              <span className="hero__pull-text">
                <em className="hero__pull-motto">set in type, kept in time</em>
                <span className="hero__pull-divider" aria-hidden="true">·</span>
                <span className="hero__pull-second">the page remembers · the question stays open</span>
              </span>
              <span className="hero__pull-rule hero__pull-rule--end" aria-hidden="true" />
            </figure>

            <a className="hero__continue" href="#press" aria-label="Turn the page to the press bed">
              <span className="hero__continue-corner" aria-hidden="true">
                <svg viewBox="0 0 64 64" className="hero__continue-corner-svg">
                  <defs>
                    <linearGradient id={`continue-fade-${continueFadeId}`} x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
                      <stop offset="42%" stopColor="currentColor" stopOpacity=".35" />
                      <stop offset="100%" stopColor="currentColor" stopOpacity=".75" />
                    </linearGradient>
                    <filter id={`continue-grain-${continueGrainId}`} x="-4%" y="-4%" width="108%" height="108%">
                      <feTurbulence type="fractalNoise" baseFrequency="3" numOctaves="2" seed="6" stitchTiles="stitch" />
                      <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .45 0" />
                      <feComposite in2="SourceGraphic" operator="in" />
                    </filter>
                  </defs>
                  <g filter={`url(#continue-grain-${continueGrainId})`}>
                    <path
                      d="M2 2 L4 60 L62 58"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth=".8"
                      strokeLinecap="round"
                      className="hero__continue-corner-edge"
                    />
                    <path
                      d="M2 2 L62 58 L62 4 Z"
                      fill={`url(#continue-fade-${continueFadeId})`}
                      className="hero__continue-corner-fold"
                    />
                    <path
                      d="M2 2 L62 58"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth=".9"
                      strokeLinecap="round"
                      className="hero__continue-corner-crease"
                    />
                    <path
                      d="M2 2 L18 2 M2 18 L2 2"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth=".5"
                      strokeLinecap="round"
                      opacity=".55"
                      className="hero__continue-corner-rule"
                    />
                    <circle cx="56" cy="56" r="1.6" fill="currentColor" className="hero__continue-corner-bead" />
                  </g>
                </svg>
              </span>
              <span className="hero__continue-body">
                <span className="hero__continue-imprint">composed by hand <em>·</em> for a careful reader</span>
                <span className="hero__continue-arrow">
                  <span className="hero__continue-arrow-text">
                    <span className="hero__continue-arrow-eyebrow">turn the page</span>
                    <span className="hero__continue-arrow-label">to the press bed</span>
                  </span>
                  <span aria-hidden="true" className="hero__continue-arrow-mark">
                    <svg viewBox="0 0 36 36" className="hero__continue-arrow-svg">
                      <path
                        className="hero__continue-arrow-curve"
                        d="M6 6c8 8 16 12 24 12M22 12h8M22 6l8 6-8 6"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </span>
              </span>
              <span className="hero__continue-hint" aria-hidden="true">
                <svg viewBox="0 0 90 12" preserveAspectRatio="none" className="hero__continue-hint-svg">
                  <path
                    d="M2 8c10-6 22 4 34-1s22-5 34-2 22 4 18 1"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth=".7"
                    strokeLinecap="round"
                    className="hero__continue-hint-stroke"
                  />
                  <circle cx="86" cy="7" r="1" fill="currentColor" className="hero__continue-hint-bead" />
                </svg>
                <span className="hero__continue-hint-tag">a small fold, a long look</span>
              </span>
            </a>

            <TitleFolio voice={voice} setToday={setToday} />
          </div>
        </section>

        <PageFold voice={voice} setToday={setToday} />

        <div className="hero-trace" aria-hidden="false">
          <ImpressionRibbon voice={voice} word={activeWord} marks={marks} setToday={setToday} />
        </div>

        <Press voice={voice} word={activeWord} onVoice={selectVoice} />

        <FolioLedger activeId={activeSection} />

        <LetterToReader voice={voice} onReadAnswer={openAnswerFromNav} />

        <ReaderPlate readerName={readerName} onReaderNameChange={setReaderName} setToday={setToday} />

        <Almanac voice={voice} word={activeWord} marks={marks} setToday={setToday} />

        <section className="second-reading-section section" aria-labelledby="second-reading-title">
          <div className="section__header second-reading-section__header">
            <p className="eyebrow"><span className="eyebrow__line" />a second reading <em>the same line, set again</em></p>
            <h2 id="second-reading-title">Read it <i>the second time.</i></h2>
            <p className="section__lede">A second specimen sits beneath the day sheet. The page is read once with the eye, and again with the ear. Pulling a voice here answers the line above as a single confident setting.</p>
          </div>
          <SecondReading voice={voice} onSelect={selectVoice} setToday={setToday} />
        </section>

        <PressRibbon voice={voice} setToday={setToday} className="press-ribbon--interlude" />

        <AnswerReveal open={answerOpen} onClose={closeAnswer} triggerRef={answerTriggerRef} voice={voice} setToday={setToday} />

        <MarkedProof selected={selectedWord} onSelect={id => selectWord(id, true)} />

        <section className="section specimen-plate-section" id="pressings" aria-labelledby="specimen-plate-title">
          <div className="section__header">
            <p className="eyebrow"><span className="eyebrow__line" />type specimen <em>folio v · three pressings of one question</em></p>
            <h2 id="specimen-plate-title">One question, <i>three pressings.</i></h2>
            <p className="section__lede">A specimen plate laid out on the press room floor. Three rows; each row sets the same line in a different voice. Pull one and the title above answers with it.</p>
          </div>
          <TypePlate active={voice} onSelect={selectVoice} />
        </section>

        <NotesSection selected={selectedWord} onSelect={id => selectWord(id, true)} />

        <PressSignature folio="viii" voice={voice} word={activeWord} setToday={setToday} variant="footer" />

        <Colophon voice={voice} word={activeWord} setToday={setToday} readerName={readerName} />
      </div>

      <MarginNotes activeId={activeSection} voice={voice} />

      <ClosingPlate
        voice={voice}
        word={activeWord}
        readerName={readerName}
        marks={marks}
        setToday={setToday}
        activeFolioIndex={READING_SECTIONS.find(item => item.id === activeSection)?.index ?? 'viii'}
        activeFolioLabel={READING_SECTIONS.find(item => item.id === activeSection)?.label ?? 'the answer'}
      />
      <span className="sr-only" aria-live="polite">{announcement}</span>
    </main>
  )
}
