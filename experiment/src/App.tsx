import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type RefObject,
} from 'react'
import { NOTES, type WordId } from './notes'
import { CursorGlow } from './CursorGlow'
import { PaperGrain } from './PaperGrain'
import { ReadingPocket } from './ReadingPocket'
import { ReadingLedger } from './ReadingLedger'
import { Hero } from './Hero'
import { FolioTurn } from './FolioTurn'
import { Press } from './Press'
import { Marginalia } from './Marginalia'
import { Specimen } from './Specimen'
import { Answer } from './Answer'
import { Colophon } from './Colophon'

export type VoiceId = 'quiet' | 'human' | 'bold'

const VOICE_ORDER: VoiceId[] = ['quiet', 'human', 'bold']
const NEXT_VOICE: Record<VoiceId, VoiceId> = { quiet: 'human', human: 'bold', bold: 'quiet' }
const VOICE_NAME: Record<VoiceId, string> = { quiet: 'quiet cut', human: 'human hand', bold: 'bold signal' }
const VOICE_FACE: Record<VoiceId, string> = {
  quiet: 'serif · italic · close set',
  human: 'serif · italic · warm',
  bold: 'sans · heavy · no apology',
}
const VOICE_LETTER: Record<VoiceId, string> = { quiet: 'A', human: 'B', bold: 'C' }

export const FOLIOS = [
  { id: 'question', index: 'i', label: 'the question', hint: 'one line, set three ways' },
  { id: 'press', index: 'ii', label: 'the press bed', hint: 'pull the lever, take an impression' },
  { id: 'notes', index: 'iii', label: 'the marginalia', hint: 'three things worth keeping' },
  { id: 'specimen', index: 'iv', label: 'the notation key', hint: 'how the three voices read' },
  { id: 'answer', index: 'v', label: 'the answer', hint: 'folded once, then folded back' },
] as const

const TITLE = 'is Minimax M3 good at frontend yet?'

function formatSetToday() {
  const now = new Date()
  const month = now.toLocaleString('en-US', { month: 'long' }).toLowerCase()
  const day = now.getDate()
  const year = now.getFullYear()
  return `${month} ${day}, ${year}`
}

function BrandMark({ size = 30 }: { size?: number }) {
  return (
    <svg className="brand__mark" width={size} height={size} viewBox="0 0 42 42" aria-hidden="true">
      <circle cx="21" cy="21" r="18" fill="none" stroke="currentColor" strokeWidth=".9" />
      <circle cx="21" cy="21" r="13.5" fill="none" stroke="currentColor" strokeWidth=".5" strokeDasharray="1.2 2.4" />
      <text
        x="21"
        y="26"
        textAnchor="middle"
        fontFamily="Georgia, serif"
        fontStyle="italic"
        fontSize="12"
        fill="currentColor"
      >m³</text>
      <circle cx="21" cy="4.8" r=".9" fill="currentColor" />
      <circle cx="21" cy="37.2" r=".9" fill="currentColor" />
    </svg>
  )
}

function StatusLight() {
  return (
    <span className="status__dot" aria-hidden="true" />
  )
}

export function App() {
  const [selectedWord, setSelectedWord] = useState<WordId>('good')
  const [hoveredWord, setHoveredWord] = useState<WordId | null>(null)
  const [voice, setVoice] = useState<VoiceId>('quiet')
  const [activeSection, setActiveSection] = useState<string>('question')
  const [answerOpen, setAnswerOpen] = useState(false)
  const [announcement, setAnnouncement] = useState('')
  const [setToday] = useState(() => formatSetToday())
  const tokenRefs = useRef<Partial<Record<WordId, HTMLButtonElement | null>>>({})
  const answerTriggerRef = useRef<HTMLButtonElement | null>(null)

  const activeWord = hoveredWord ?? selectedWord

  const selectWord = useCallback((id: WordId, focus = false) => {
    const note = NOTES.find(item => item.id === id)
    setSelectedWord(id)
    if (note) {
      setAnnouncement(`${note.title}. ${note.gloss}.`)
    }
    if (focus) {
      window.requestAnimationFrame(() => tokenRefs.current[id]?.focus())
    }
  }, [])

  const selectVoice = useCallback((id: VoiceId) => {
    setVoice(prev => {
      if (prev === id) return prev
      const next = id
      setAnnouncement(`Voice set in ${VOICE_NAME[next]}.`)
      return next
    })
  }, [])

  const cycleVoice = useCallback(() => {
    setVoice(prev => {
      const next = NEXT_VOICE[prev]
      setAnnouncement(`Voice set in ${VOICE_NAME[next]}.`)
      return next
    })
  }, [])

  useEffect(() => {
    document.title = TITLE
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return
    const elements = FOLIOS.map(f => document.getElementById(f.id)).filter(
      (node): node is HTMLElement => Boolean(node),
    )
    const observer = new IntersectionObserver(
      entries => {
        const visible = entries
          .filter(entry => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (visible[0]) setActiveSection(visible[0].target.id)
      },
      { rootMargin: '-30% 0px -55% 0px', threshold: [0.04, 0.18, 0.55] },
    )
    elements.forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return
    const elements = Array.from(document.querySelectorAll<HTMLElement>('.reveal'))
    if (!elements.length) return
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -8% 0px' },
    )
    elements.forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const onKey = (event: KeyboardEvent) => {
      if (event.defaultPrevented) return
      const target = event.target as HTMLElement | null
      const tag = target?.tagName?.toLowerCase()
      if (tag === 'input' || tag === 'textarea' || target?.isContentEditable) return

      if (event.shiftKey && (event.key === 'V' || event.key === 'v')) {
        event.preventDefault()
        cycleVoice()
        return
      }
      if (event.key === 'Escape' && answerOpen) {
        const target = event.target as HTMLElement | null
        const isInsideAnswer = target?.closest('.answer')
        if (isInsideAnswer) return
        setAnswerOpen(false)
        setAnnouncement('Answer folded back.')
        window.requestAnimationFrame(() => answerTriggerRef.current?.focus())
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [cycleVoice, answerOpen])

  const onWordKey = (event: ReactKeyboardEvent<HTMLButtonElement>, id: WordId) => {
    const order: WordId[] = ['m3', 'good', 'yet']
    const index = order.indexOf(id)
    let nextIndex = index
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') nextIndex = (index + 1) % order.length
    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') nextIndex = (index - 1 + order.length) % order.length
    if (event.key === 'Home') nextIndex = 0
    if (event.key === 'End') nextIndex = order.length - 1
    if (nextIndex === index) return
    event.preventDefault()
    selectWord(order[nextIndex], true)
  }

  const style = {
    '--set-type-tone': 'var(--quiet)',
  } as CSSProperties

  const toggleAnswer = () => {
    const next = !answerOpen
    setAnswerOpen(next)
    setAnnouncement(next ? 'Answer unfolded.' : 'Answer folded back.')
  }

  return (
    <main
      id="question"
      className={`app app--voice-${voice} app--word-${activeWord}`}
      style={style}
    >
      <PaperGrain />
      <span className="app__bg-grain" aria-hidden="true" />
      <span className="app__void" aria-hidden="true" />
      <span className="app__backdrop" aria-hidden="true" />
      <CursorGlow />

      <header className="topbar" role="banner">
        <a className="brand" href="#question" aria-label="Return to the question">
          <BrandMark size={32} />
          <span className="brand__copy">
            <strong>m³ press</strong>
            <em>an open question, set today</em>
          </span>
        </a>

        <div className="status" aria-label="Page status">
          <span className="status__date">{setToday}</span>
          <StatusLight />
        </div>
      </header>

      <ReadingLedger
        folios={FOLIOS as unknown as { id: string; index: string; label: string; hint: string }[]}
        activeId={activeSection}
        voice={voice}
        setToday={setToday}
      />

      <ReadingPocket
        voice={voice}
        setToday={setToday}
        folios={FOLIOS as unknown as { id: string; index: string; label: string; hint: string }[]}
      />

      <section className="hero reveal" aria-labelledby="hero-title-label">
        <Hero
          voice={voice}
          word={activeWord}
          hover={hoveredWord}
          setToday={setToday}
          onVoice={selectVoice}
          onWord={(id, focus) => selectWord(id, focus ?? false)}
          onHover={setHoveredWord}
          onWordKey={onWordKey}
          tokenRefs={tokenRefs}
        />
      </section>

      <FolioTurn index="ii" title="the press bed" hint="pull a lever · take an impression" voice={voice} />
      <Press voice={voice} word={activeWord} onVoice={selectVoice} setToday={setToday} />

      <FolioTurn index="iii" title="the marginalia" hint="three things worth keeping" voice={voice} />
      <Marginalia selected={selectedWord} onSelect={id => selectWord(id, true)} />

      <FolioTurn index="iv" title="the notation key" hint="how the three voices read" voice={voice} />
      <Specimen active={voice} onSelect={selectVoice} />

      <FolioTurn index="v" title="the answer" hint="folded once · then folded back" voice={voice} />
      <Answer
        open={answerOpen}
        onToggle={toggleAnswer}
        triggerRef={answerTriggerRef as RefObject<HTMLButtonElement>}
        voice={voice}
        word={activeWord}
        setToday={setToday}
      />

      <FolioTurn index="—" title="the colophon" hint="the page, signed off" voice={voice} soft />
      <Colophon voice={voice} word={activeWord} setToday={setToday} />

      <footer className="site-foot" aria-label="The page, in one line">
        <span className="site-foot__copy">
          <em>{TITLE}</em>
          <span aria-hidden="true">·</span>
          <span>composed and set on {setToday}</span>
        </span>
        <a className="site-foot__back" href="#question">
          back to the question
          <svg className="arrow-icon" width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M4 12h15M13 6l6 6-6 6"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>
      </footer>

      <span className="sr-only" aria-live="polite">{announcement}</span>
      <span className="sr-only">{`Now on folio ${FOLIOS.findIndex(f => f.id === activeSection) + 1} of ${FOLIOS.length} · ${FOLIOS.find(f => f.id === activeSection)?.label ?? ''} · voice set in ${VOICE_NAME[voice]} (${VOICE_FACE[voice]}, letter ${VOICE_LETTER[voice]}).`}</span>
    </main>
  )
}