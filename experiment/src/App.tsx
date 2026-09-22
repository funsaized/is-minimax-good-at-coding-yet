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
import { FirstLight } from './FirstLight'
import { TitlePage } from './TitlePage'
import { Asterism } from './Asterism'
import { Hero } from './Hero'
import { FolioTurn } from './FolioTurn'
import { Press } from './Press'
import { ProofLine } from './ProofLine'
import { Specimen } from './Specimen'
import { Answer } from './Answer'
import { Colophon } from './Colophon'
import { PrinterMark, PressSigil } from './PrinterMark'
import { ReadingNote } from './ReadingNote'
import { SpineThread } from './SpineThread'
import { MarginMarks } from './MarginMarks'
import { ReadingCord } from './ReadingCord'
import { LastLight } from './LastLight'
import { QuestionHeld } from './QuestionHeld'
import { BreathPlate } from './BreathPlate'

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
  { id: 'notes', index: 'iii', label: 'the proof line', hint: 'three voices on the same cord' },
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

export function App() {
  const [selectedWord, setSelectedWord] = useState<WordId>('good')
  const [hoveredWord, setHoveredWord] = useState<WordId | null>(null)
  const [voice, setVoice] = useState<VoiceId>('quiet')
  const [activeSection, setActiveSection] = useState<string>('question')
  const [answerOpen, setAnswerOpen] = useState(false)
  const [announcement, setAnnouncement] = useState('')
  const [setToday] = useState(() => formatSetToday())
  const [pullCount, setPullCount] = useState(0)
  const [pullSignal, setPullSignal] = useState(0)
  const [isPulling, setIsPulling] = useState(false)
  const [keptCounts, setKeptCounts] = useState<Record<WordId, number>>({ m3: 0, good: 0, yet: 0 })
  const tokenRefs = useRef<Partial<Record<WordId, HTMLButtonElement | null>>>({})
  const answerTriggerRef = useRef<HTMLButtonElement | null>(null)
  const pullLockRef = useRef(false)

  const activeWord = hoveredWord ?? selectedWord

  const selectWord = useCallback((id: WordId, focus = false) => {
    const note = NOTES.find(item => item.id === id)
    setSelectedWord(prev => {
      if (prev !== id) {
        setKeptCounts(c => ({ ...c, [id]: (c[id] ?? 0) + 1 }))
      }
      return id
    })
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

  const handleProofSelect = useCallback((id: WordId, mode: 'word' | 'voice') => {
    if (mode === 'voice') {
      const target = id === 'm3' ? 'quiet' : id === 'good' ? 'human' : 'bold'
      setVoice(prev => {
        if (prev === target) return prev
        setAnnouncement(`Voice set in ${VOICE_NAME[target]}.`)
        return target
      })
    } else {
      selectWord(id, true)
    }
  }, [selectWord])

  const pullLever = useCallback(() => {
    if (pullLockRef.current) return
    pullLockRef.current = true
    setIsPulling(true)
    setPullCount(c => c + 1)
    setPullSignal(s => s + 1)
    setVoice(prev => {
      const next = NEXT_VOICE[prev]
      setAnnouncement(`Voice set in ${VOICE_NAME[next]}.`)
      return next
    })
    window.setTimeout(() => {
      setIsPulling(false)
      pullLockRef.current = false
    }, 900)
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

  useEffect(() => {
    if (typeof window === 'undefined') return
    const root = document.documentElement
    let raf = 0
    const compute = () => {
      const doc = document.documentElement
      const scrolled = window.scrollY
      const total = Math.max(1, doc.scrollHeight - window.innerHeight)
      const ratio = Math.max(0, Math.min(1, scrolled / total))
      root.style.setProperty('--page-prog', ratio.toFixed(3))
      raf = 0
    }
    const onScroll = () => {
      if (raf) return
      raf = window.requestAnimationFrame(compute)
    }
    compute()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) window.cancelAnimationFrame(raf)
    }
  }, [])

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
    '--pull-tone': `var(--${voice})`,
  } as CSSProperties

  const toggleAnswer = () => {
    const next = !answerOpen
    setAnswerOpen(next)
    setAnnouncement(next ? 'Answer unfolded.' : 'Answer folded back.')
  }

  const activeFolio = FOLIOS.find(f => f.id === activeSection) ?? FOLIOS[0]
  const activeFolioIndex = FOLIOS.findIndex(f => f.id === activeSection) + 1

  return (
    <main
      id="question"
      className={`app app--voice-${voice} app--word-${activeWord} ${isPulling ? 'app--pulling' : ''}`}
      style={style}
    >
      <PaperGrain />
      <span className="app__bg-grain" aria-hidden="true" />
      <span className="app__void" aria-hidden="true" />
      <span className="app__backdrop" aria-hidden="true" />
      <FirstLight />
      <CursorGlow />
      <SpineThread
        folios={FOLIOS as unknown as { id: string; index: string; label: string; hint: string }[]}
        activeId={activeSection}
        voice={voice}
        pullSignal={pullSignal}
        isPulling={isPulling}
      />

      <MarginMarks
        active={selectedWord}
        hover={hoveredWord}
        voice={voice}
        pullSignal={pullSignal}
        onSelect={id => selectWord(id, true)}
        onHover={setHoveredWord}
      />

      <header className="topbar" role="banner">
        <a className="brand" href="#question" aria-label="Return to the question">
          <PrinterMark size={34} voice={voice} />
          <span className="brand__copy">
            <strong>m<sup>3</sup> press</strong>
            <em>a single question, set three ways</em>
          </span>
        </a>

        <span className="topbar__folio" aria-label={`Now on folio ${activeFolio.index} · ${activeFolio.label}`}>
          <span className="topbar__folio-rule" aria-hidden="true" />
          <em>folio</em>
          <span className="topbar__folio-num" aria-hidden="true">{activeFolio.index}</span>
          <span className="topbar__folio-label" aria-hidden="true">· {activeFolio.label}</span>
          <span className="topbar__folio-rule" aria-hidden="true" />
        </span>

        <span className="topbar__sigil" aria-hidden="true">
          <PressSigil voice={voice} size={28} />
        </span>

        <span className={`status__voice status__voice--${voice}`} aria-label={`Voice: ${VOICE_NAME[voice]} (${VOICE_LETTER[voice]})`}>
          <span className="status__voice-glyph" aria-hidden="true">{VOICE_LETTER[voice]}</span>
          <em className="status__voice-name">{VOICE_NAME[voice]}</em>
        </span>
      </header>


      <TitlePage voice={voice} setToday={setToday} />

      <section className="hero reveal" aria-labelledby="hero-title-label">
        <Hero
          voice={voice}
          word={activeWord}
          hover={hoveredWord}
          setToday={setToday}
          pullSignal={pullSignal}
          onVoice={selectVoice}
          onWord={(id, focus) => selectWord(id, focus ?? false)}
          onHover={setHoveredWord}
          onWordKey={onWordKey}
          tokenRefs={tokenRefs}
        />
      </section>

      <aside className="hero-imprint" aria-label="The press signature, set beneath the title">
        <span className="hero-imprint__sigil" aria-hidden="true">
          <PressSigil voice={voice} size={26} />
        </span>
        <span className="hero-imprint__rule" aria-hidden="true" />
        <em className="hero-imprint__line">
          <span className="hero-imprint__mark">{`{ set in ${VOICE_NAME[voice]} · marked at ${activeWord === 'm3' ? 'm³' : activeWord === 'good' ? 'good at' : 'yet?'} }`}</span>
          <span aria-hidden="true">·</span>
          <span>read in the dark — the page is set, the question held open</span>
        </em>
        <span className="hero-imprint__rule" aria-hidden="true" />
        <span className="hero-imprint__date" aria-hidden="true">{setToday}</span>
      </aside>

      <div className="reading-cord-wrap">
        <ReadingCord
          voice={voice}
          active={activeWord}
          onSelect={id => selectWord(id, true)}
        />
      </div>

      <div className="page-inscription-wrap">
        <ReadingNote
          voice={voice}
          align="center"
          ornament="dots"
          size="md"
          tone="voice"
          caption="A note from the compositor, set beneath the title"
        >
          the question, held open — for the reader who arrived in the dark.
        </ReadingNote>
      </div>

      <div className="page-breath-wrap">
        <BreathPlate voice={voice} caption="one breath" aside="set the line · read the page" />
      </div>

      <span className="page-asterism-wrap" aria-hidden="true">
        <Asterism tone="voice" size="md" />
      </span>

      <FolioTurn index="ii" title="the press bed" hint="pull a lever · take an impression" voice={voice} />
      <Press
        voice={voice}
        word={activeWord}
        pullSignal={pullSignal}
        isPulling={isPulling}
        pullCount={pullCount}
        onPull={pullLever}
        setToday={setToday}
      />

      <FolioTurn index="iii" title="the proof line" hint="three voices, set on the same cord" voice={voice} />
      <ProofLine
        voice={voice}
        selected={selectedWord}
        pullSignal={pullSignal}
        onSelect={handleProofSelect}
      />

      <FolioTurn index="iv" title="the notation key" hint="how the three voices read" voice={voice} />
      <Specimen active={voice} onSelect={selectVoice} />

      <FolioTurn index="v" title="the answer" hint="folded once · then folded back" voice={voice} />
      <Answer
        open={answerOpen}
        onToggle={toggleAnswer}
        triggerRef={answerTriggerRef as RefObject<HTMLButtonElement>}
        voice={voice}
        word={activeWord}
        pullSignal={pullSignal}
        setToday={setToday}
      />

      <FolioTurn index="—" title="the colophon" hint="the page, signed off" voice={voice} soft />
      <Colophon
        voice={voice}
        word={activeWord}
        pullSignal={pullSignal}
        pullCount={pullCount}
        setToday={setToday}
        keptCounts={keptCounts}
      />

      <LastLight voice={voice} setToday={setToday} pullCount={pullCount} />

      <span className="page-asterism-wrap page-asterism-wrap--closing" aria-hidden="true">
        <Asterism tone="voice" size="md" />
      </span>

      <QuestionHeld voice={voice} word={activeWord} />

      <footer className="site-foot" aria-label="The page, in one line">
        <ReadingNote
          voice={voice}
          align="center"
          ornament="rule"
          size="md"
          tone="paper"
          caption="A final note, set at the foot of the page"
        >
          set at first light · read in the dark — {TITLE}
        </ReadingNote>

        <span className="site-foot__copy">
          <em>{TITLE}</em>
          <span aria-hidden="true">·</span>
          <span>composed and set on {setToday}, at first light</span>
        </span>
        <span className="site-foot__sig" aria-hidden="true">
          <span className="site-foot__sig-rule" />
          <em>m<sup>3</sup> press</em>
          <span className="site-foot__sig-mark" />
          <span className="site-foot__sig-rule" />
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
      <span className="sr-only">{`Now on folio ${activeFolioIndex} of ${FOLIOS.length} · ${activeFolio.label} · voice set in ${VOICE_NAME[voice]} (${VOICE_FACE[voice]}, letter ${VOICE_LETTER[voice]}) · ${pullCount} impressions on the day.`}</span>
    </main>
  )
}