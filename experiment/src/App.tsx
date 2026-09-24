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
import { CompositionRegister } from './CompositionRegister'
import { Hero } from './Hero'
import { FolioTurn } from './FolioTurn'
import { Press } from './Press'
import { ProofLine } from './ProofLine'
import { Specimen } from './Specimen'
import { HeldQuestion } from './HeldQuestion'
import { Answer } from './Answer'
import { PageHolds } from './PageHolds'
import { HeldSilence } from './HeldSilence'
import { Colophon } from './Colophon'
import { PrinterAtlas } from './PrinterAtlas'
import { SpineThread } from './SpineThread'
import { ReadingCompass } from './ReadingCompass'
import { ReadingPouch } from './ReadingPouch'
import { TheBookMark } from './TheBookMark'
import { LastLamp } from './LastLamp'
import { Imprint } from './Imprint'
import { Constellation } from './Constellation'
import { WordHoverNote } from './WordHoverNote'
import { SettingSeal } from './SettingSeal'
import { OverprintProof } from './OverprintProof'
import { PageSpine } from './PageSpine'
import { TypeCase } from './TypeCase'
import { Daybreak } from './Daybreak'
import { IterationMark, IterationFolioCard } from './IterationMark'

export type VoiceId = 'quiet' | 'human' | 'bold'

const NEXT_VOICE: Record<VoiceId, VoiceId> = { quiet: 'human', human: 'bold', bold: 'quiet' }
const VOICE_NAME: Record<VoiceId, string> = { quiet: 'quiet cut', human: 'human hand', bold: 'bold signal' }
const VOICE_FACE: Record<VoiceId, string> = {
  quiet: 'serif · italic · close set',
  human: 'serif · italic · warm',
  bold: 'sans · heavy · no apology',
}
const VOICE_LETTER: Record<VoiceId, string> = { quiet: 'A', human: 'B', bold: 'C' }

export const FOLIOS = [
  { id: 'prologue', index: '00', label: 'the prologue', hint: 'a single line, set three ways' },
  { id: 'question', index: 'i', label: 'the question', hint: 'one line, set three ways' },
  { id: 'press', index: 'ii', label: 'the press bed', hint: 'pull the lever, take an impression' },
  { id: 'notes', index: 'iii', label: 'the proof line', hint: 'three voices on the same cord' },
  { id: 'specimen', index: 'iv', label: 'the notation key', hint: 'how the three voices read' },
  { id: 'held', index: 'iv½', label: 'the held reading', hint: 'one line, three proofs, one plate' },
  { id: 'answer', index: 'v', label: 'the answer', hint: 'folded once, then folded back' },
  { id: 'page-holds', index: 'v½', label: 'the page holds', hint: 'one breath, after the answer' },
  { id: 'pouch', index: 'vi', label: "the reader's pouch", hint: 'three slips, kept close' },
] as const

const TITLE = 'is Minimax M3 good at frontend yet?'

const TIME_OF_DAY_FOLIOS = ['pre-dawn', 'first light', 'morning', 'midday', 'afternoon', 'softening', 'late still'] as const

function timeOfDayFor(ratio: number) {
  const r = Math.max(0, Math.min(1, ratio))
  if (r < 0.06) return 0
  if (r < 0.22) return r / 0.22 * 0.18
  if (r < 0.55) return 0.18 + ((r - 0.22) / 0.33) * 0.34
  if (r < 0.85) return 0.52 + ((r - 0.55) / 0.30) * 0.32
  return Math.min(1, 0.84 + (r - 0.85) / 0.15 * 0.16)
}

function timeOfDayLabel(ratio: number) {
  const r = Math.max(0, Math.min(1, ratio))
  if (r < 0.14) return TIME_OF_DAY_FOLIOS[0]
  if (r < 0.30) return TIME_OF_DAY_FOLIOS[1]
  if (r < 0.46) return TIME_OF_DAY_FOLIOS[2]
  if (r < 0.62) return TIME_OF_DAY_FOLIOS[3]
  if (r < 0.78) return TIME_OF_DAY_FOLIOS[4]
  if (r < 0.92) return TIME_OF_DAY_FOLIOS[5]
  return TIME_OF_DAY_FOLIOS[6]
}

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
  const [activeSection, setActiveSection] = useState<string>('prologue')
  const [answerOpen, setAnswerOpen] = useState(false)
  const [announcement, setAnnouncement] = useState('')
  const [setToday] = useState(() => formatSetToday())
  const [pullCount, setPullCount] = useState(0)
  const [pullSignal, setPullSignal] = useState(0)
  const [isPulling, setIsPulling] = useState(false)
  const [flashKey, setFlashKey] = useState(0)
  const [keptCounts, setKeptCounts] = useState<Record<WordId, number>>({ m3: 0, good: 0, yet: 0 })
  const [timeOfDay, setTimeOfDay] = useState<string>(TIME_OF_DAY_FOLIOS[1])
  const [pageTime, setPageTime] = useState(0)
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
    setFlashKey(k => k + 1)
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
        const isInsideAnswer = (event.target as HTMLElement | null)?.closest('.answer')
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
      const time = timeOfDayFor(ratio)
      root.style.setProperty('--page-time', time.toFixed(3))
      setPageTime(time)
      setTimeOfDay(timeOfDayLabel(ratio))
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

  const jumpToFolio = useCallback((id: string) => {
    if (typeof window === 'undefined') return
    const node = document.getElementById(id)
    if (!node) return
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    node.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' })
    const link = node.querySelector<HTMLAnchorElement | HTMLButtonElement>('a[href], button')
    window.requestAnimationFrame(() => link?.focus({ preventScroll: true }))
    const folio = FOLIOS.find(f => f.id === id)
    if (folio) {
      setAnnouncement(`Now on folio ${folio.index} · ${folio.label}.`)
    }
  }, [])

  const activeFolioIndex = FOLIOS.findIndex(f => f.id === activeSection) + 1

  return (
    <main
      className={`app app--voice-${voice} app--word-${activeWord} ${isPulling ? 'app--pulling' : ''}`}
      style={style}
    >
      <PaperGrain />
      <span className="app__void" aria-hidden="true" />
      <span className="app__backdrop" aria-hidden="true" />
      <span className="app__atmo" aria-hidden="true" />
      <span className="app__horizon" aria-hidden="true" />
      <FirstLight />
      <Constellation voice={voice} pullSignal={pullSignal} />
      <span className="app__flash" aria-hidden="true" key={`flash-${flashKey}`} />
      <CursorGlow />
      <SpineThread
        folios={FOLIOS as unknown as { id: string; index: string; label: string; hint: string }[]}
        activeId={activeSection}
        voice={voice}
        pullSignal={pullSignal}
        isPulling={isPulling}
      />

      <PrinterAtlas
        folios={FOLIOS as unknown as { id: string; index: string; label: string; hint: string }[]}
        activeId={activeSection}
        voice={voice}
        timeOfDay={timeOfDay}
      />

      <ReadingCompass
        voice={voice}
        word={activeWord}
        pageTime={pageTime}
        pullSignal={pullSignal}
        isPulling={isPulling}
        setToday={setToday}
      />

      <header className="topbar" role="banner" aria-label="The page's composing register">
        <a className="skip-link" href="#hero-title-label">Skip to the question</a>
        <CompositionRegister
          folios={FOLIOS as unknown as { id: string; index: string; label: string }[]}
          activeId={activeSection}
          voice={voice}
          setToday={setToday}
          timeOfDay={timeOfDay}
          onCycleVoice={cycleVoice}
          onJump={jumpToFolio}
        />
        <span className="topbar__iteration" aria-label={`Iteration 463 of the press`}>
          <span className="topbar__iteration-rule" aria-hidden="true" />
          <span className="topbar__iteration-stack">
            <em>folio cdlxiii</em>
            <IterationMark voice={voice} size={28} variant="inline" numeral="463" label="cdlxiii" />
          </span>
        </span>
      </header>

      <PageSpine
        folios={FOLIOS as unknown as { id: string; index: string; label: string }[]}
        activeId={activeSection}
        voice={voice}
        progress={pageTime}
        onJump={jumpToFolio}
      />

      <Daybreak voice={voice} setToday={setToday} onVoice={selectVoice} />

      <TypeCase voice={voice} word={activeWord} setToday={setToday} onWord={(id, focus) => selectWord(id, focus ?? false)} />

      <SettingSeal voice={voice} word={activeWord} setToday={setToday} />

      <section id="question" className="hero reveal" aria-labelledby="hero-title-label">
        <Hero
          voice={voice}
          word={activeWord}
          hover={hoveredWord}
          setToday={setToday}
          pullSignal={pullSignal}
          setAnnouncement={setAnnouncement}
          onVoice={selectVoice}
          onWord={(id, focus) => selectWord(id, focus ?? false)}
          onHover={setHoveredWord}
          onWordKey={onWordKey}
          tokenRefs={tokenRefs}
        />
      </section>

      <WordHoverNote active={selectedWord} hover={hoveredWord} voice={voice} />

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

      <FolioTurn index="iv½" title="the held question" hint="one plate · one line · three faces" voice={voice} soft />
      <HeldQuestion voice={voice} setToday={setToday} onVoice={selectVoice} />

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

      <HeldSilence
        voice={voice}
        setToday={setToday}
        timeOfDay={timeOfDay}
        pullSignal={pullSignal}
      />

      <FolioTurn index="v½" title="the page holds" hint="one breath, after the answer" voice={voice} soft />
      <PageHolds voice={voice} setToday={setToday} />

      <FolioTurn index="—" title="the colophon" hint="the page, signed off" voice={voice} soft />
      <Colophon
        voice={voice}
        word={activeWord}
        pullSignal={pullSignal}
        pullCount={pullCount}
        setToday={setToday}
        keptCounts={keptCounts}
      />

      <FolioTurn index="vi" title="the reader's pouch" hint="three slips · kept close" voice={voice} />
      <ReadingPouch voice={voice} active={activeWord} setToday={setToday} />

      <FolioTurn index="vi½" title="the bookmark" hint="one line · kept after the broadside is set down" voice={voice} soft />
      <TheBookMark voice={voice} setToday={setToday} />

      <OverprintProof voice={voice} setToday={setToday} />

      <LastLamp voice={voice} setToday={setToday} />

      <Imprint voice={voice} setToday={setToday} />

      <IterationFolioCard
        voice={voice}
        variant="closing"
        numeral="463"
        caption="folio · cdlxiii"
        meta={`composed ${setToday} · set in ${VOICE_NAME[voice].toLowerCase()}`}
      />

      <span className="sr-only" aria-live="polite">{announcement}</span>
      <span className="sr-only">{`Now on folio ${activeFolioIndex} of ${FOLIOS.length} · voice set in ${VOICE_NAME[voice]} (${VOICE_FACE[voice]}, letter ${VOICE_LETTER[voice]}) · ${pullCount} impressions on the day · iteration 463, folio cdlxiii of the press.`}</span>
      <span className="sr-only" aria-live="off">{`Page-time · ${timeOfDay}`}</span>
    </main>
  )
}
