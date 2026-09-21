import { useCallback, useEffect, useId, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from 'react'
import { NOTES, type WordId } from './notes'
import { PressStamp } from './PressStamp'
import { type ImpressionMark } from './ImpressionRibbon'
import { PressLog } from './PressLog'
import { MarkedProof } from './MarkedProof'
import { LetterToReader } from './LetterToReader'
import { Press, type VoiceId } from './Press'
import { InkDust } from './InkDust'
import { InkTrail } from './InkTrail'
import { Almanac } from './Almanac'
import { MarginNotes } from './MarginNotes'
import { Watermark } from './Watermark'
import { TypePlate } from './TypePlate'
import { SecondReading } from './SecondReading'
import { ReadingFloor } from './ReadingFloor'

import { PaperGrain } from './PaperGrain'
import { KeptMark } from './KeptMark'
import { PressSignature } from './PressSignature'
import { WayfinderSeal } from './WayfinderSeal'
import { NotesSection } from './NotesSection'
import { FolioHinge } from './FolioHinge'
import { PressSpine } from './PressSpine'
import { PressRegister } from './PressRegister'
import { TitleBroadside } from './TitleBroadside'
import { BroadsideReveal } from './BroadsideReveal'
import { BroadsideEdge } from './BroadsideEdge'
import { FolioImprint } from './FolioImprint'

import { ReaderPlate } from './ReaderPlate'
import { PressLever } from './PressLever'
import { FolioLedger } from './FolioLedger'
import { ReadersNote } from './ReadersNote'
import { ReadingPrologue } from './ReadingPrologue'
import { LetterpressCatch } from './LetterpressCatch'
import { Opening } from './Opening'
import { AnswerCoda } from './AnswerCoda'
import { ExhalationPlate } from './ExhalationPlate'
import { PageReturn } from './PageReturn'

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
  { id: 'catch', index: 'vi·', label: 'signature' },
  { id: 'notes', index: 'vii', label: 'marginalia' },
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






function AnswerReveal({ open, onClose, triggerRef, voice, word, setToday }: {
  open: boolean
  onClose: () => void
  triggerRef: React.MutableRefObject<HTMLButtonElement | null>
  voice: VoiceId
  word: WordId
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
              pathLength="100"
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
    <footer className={`colophon ${signedReader ? 'is-signed' : ''}`} aria-label="Colophon — hand-pressed dedication">
      <div className="colophon__plate">
        <span className="colophon__corner colophon__corner--tl" aria-hidden="true" />
        <span className="colophon__corner colophon__corner--tr" aria-hidden="true" />
        <span className="colophon__corner colophon__corner--bl" aria-hidden="true" />
        <span className="colophon__corner colophon__corner--br" aria-hidden="true" />

        <header className="colophon__strip" aria-hidden="true">
          <span className="colophon__strip-tag">
            <span className="colophon__strip-dot" />
            <em>folio viii</em>
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
              <span className="colophon__row-sub">folio viii · the colophon</span>
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
  const [heroBodyVisible, setHeroBodyVisible] = useState(false)
  const [readerName, setReaderName] = useState('')
  const [leverStamping, setLeverStamping] = useState(false)
  const firstVoiceRef = useRef(true)
  const tokenRefs = useRef<Partial<Record<WordId, HTMLSpanElement | null>>>({})
  const answerTriggerRef = useRef<HTMLButtonElement>(null)
  const heroBodyRef = useRef<HTMLDivElement>(null)
  const leverStampTimerRef = useRef<number | null>(null)
  const bodyGrainId = useId().replace(/:/g, '')

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
    const elements = ['question', 'press', 'contents', 'day', 'note', 'reader-plate', 'proof', 'pressings', 'catch', 'notes', 'answer']
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
    return () => {
      if (leverStampTimerRef.current !== null) {
        window.clearTimeout(leverStampTimerRef.current)
        leverStampTimerRef.current = null
      }
    }
  }, [])

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
    setLeverStamping(true)
    if (leverStampTimerRef.current !== null) {
      window.clearTimeout(leverStampTimerRef.current)
    }
    leverStampTimerRef.current = window.setTimeout(() => setLeverStamping(false), 600)
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

  const openAnswerFromPause = () => {
    if (!answerOpen) setAnswerOpen(true)
    setAnnouncement('Answer revealed.')
    window.requestAnimationFrame(() => document.getElementById('answer')?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
  }

  return (
    <main className={`app app--voice-${voice} app--word-${activeWord} ${leverStamping ? 'is-lever-stamping' : ''}`}>
      <BroadsideReveal voice={voice} />
      <BroadsideEdge />
      <PaperGrain />
      <InkDust />
      <InkTrail />
      <div className="app__grain" aria-hidden="true" />
      <div className="app__pencil" aria-hidden="true" />
      <div className={`press-impact ${leverStamping ? 'is-stamping' : ''}`} aria-hidden="true" />
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
        <PressRegister voice={voice} word={activeWord} marks={marks} setToday={setToday} />
      </header>

      <PressSpine activeId={activeSection} voice={voice} />

      <div className="page">
        <FolioImprint voice={voice} setToday={setToday} />

        <Opening voice={voice} setToday={setToday}>
          <section className="hero hero--title-page" id="question" aria-labelledby="page-title">
            <h1 className="sr-only" id="page-title">{TITLE}</h1>
            <TitleBroadside
              voice={voice}
              word={activeWord}
              hover={hoveredWord}
              setToday={setToday}
              onVoice={selectVoice}
              onWord={(id, focus) => selectWord(id, focus ?? false)}
              onHover={setHoveredWord}
              tokenRefs={tokenRefs}
            />

            <ReadingPrologue
              voice={voice}
              word={activeWord}
              setToday={setToday}
              onWord={id => selectWord(id)}
              onLeverHint={() => window.requestAnimationFrame(() => answerTriggerRef.current?.focus())}
            />

            <PressLever
              ref={answerTriggerRef}
              voice={voice}
              answerOpen={answerOpen}
              readerName={readerName}
              onToggleAnswer={toggleAnswer}
              setToday={setToday}
              stamping={leverStamping}
            />
          </section>
        </Opening>

        <div className={`hero__body hero__body--anchored ${heroBodyVisible ? 'is-in-view' : ''}`} ref={heroBodyRef}>
            <span className="hero__body-plate" aria-hidden="true">
              <span className="hero__body-plate-rule" />
              <span className="hero__body-plate-tag">
                <span className="hero__body-plate-dot" />
                the reader's note <em>·</em> <em>front matter</em>
                <span className="hero__body-plate-dot" />
              </span>
              <span className="hero__body-plate-rule" />
            </span>

            <ReadersNote
              voice={voice}
              word={activeWord}
              hover={hoveredWord}
              setToday={setToday}
              onVoice={selectVoice}
              onWord={(id, focus) => selectWord(id, focus ?? false)}
              onHover={setHoveredWord}
            />

            </div>

        <FolioHinge voice={voice} setToday={setToday} />

        <div className="hero-trace hero-trace--log" aria-hidden="false">
          <PressLog voice={voice} word={activeWord} marks={marks} setToday={setToday} />
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

        <ReadingFloor voice={voice} setToday={setToday} />

        <ExhalationPlate voice={voice} word={activeWord} setToday={setToday} onOpenAnswer={openAnswerFromPause} />

        <AnswerReveal open={answerOpen} onClose={closeAnswer} triggerRef={answerTriggerRef} voice={voice} word={activeWord} setToday={setToday} />

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

        <section className="catch-section" id="catch" aria-labelledby="catch-title">
          <div className="catch-section__header">
            <p className="eyebrow"><span className="eyebrow__line" />the press signature <em>a single word, three settings</em></p>
            <h2 id="catch-title">Read the rule, <i>not the ornament.</i></h2>
            <p className="catch-section__lede">One word pulled through three presses. The same word, set three ways, on a single broadside. Pull any voice and the rule holds; the ornament changes.</p>
          </div>
          <LetterpressCatch voice={voice} word={activeWord} setToday={setToday} readerName={readerName} />
        </section>

        <PressSignature folio="viii" voice={voice} word={activeWord} setToday={setToday} variant="footer" />

        <Colophon voice={voice} word={activeWord} setToday={setToday} readerName={readerName} />
      </div>

      <MarginNotes activeId={activeSection} voice={voice} />

      <PageReturn voice={voice} setToday={setToday} />
      <span className="sr-only" aria-live="polite">{announcement}</span>
    </main>
  )
}
