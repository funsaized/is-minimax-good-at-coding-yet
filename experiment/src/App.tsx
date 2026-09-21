import { useCallback, useEffect, useId, useRef, useState, type CSSProperties, type KeyboardEvent as ReactKeyboardEvent } from 'react'
import { NOTES, type WordId } from './notes'
import { WayfinderSeal } from './WayfinderSeal'
import { HeroTitle } from './HeroTitle'
import { Press, type VoiceId } from './Press'
import { PaperGrain } from './PaperGrain'
import { NotesSection } from './NotesSection'
import { AnswerReveal } from './AnswerReveal'
import { Colophon } from './Colophon'
import { TypePlate } from './TypePlate'
import { ComposeSignature } from './ComposeSignature'
import { ReadingPocket } from './ReadingPocket'
import { OpeningLede } from './OpeningLede'
import { FolioTurn } from './FolioTurn'
import type { ImpressionMark } from './ImpressionRibbon'

const VOICE_CYCLE: Record<VoiceId, VoiceId> = {
  quiet: 'human',
  human: 'bold',
  bold: 'quiet',
}

const TITLE = 'is Minimax M3 good at frontend yet?'

const FOLIO_LEDGER: { id: string; index: string; label: string; hint: string; tone: VoiceId }[] = [
  { id: 'question', index: 'i', label: 'the question', hint: 'one line, set three ways', tone: 'quiet' },
  { id: 'press', index: 'ii', label: 'the press bed', hint: 'pull a lever, take an impression', tone: 'human' },
  { id: 'notes', index: 'iii', label: 'the marginalia', hint: 'three things worth keeping', tone: 'quiet' },
  { id: 'pressings', index: 'iv', label: 'three pressings', hint: 'the same line, three faces', tone: 'bold' },
  { id: 'answer', index: 'v', label: 'the answer', hint: 'folded once, then folded back', tone: 'human' },
]

const VOICE_META: Record<VoiceId, { name: string; letter: string; face: string }> = {
  quiet: { name: 'quiet cut', letter: 'a', face: 'serif · italic · close set' },
  human: { name: 'human hand', letter: 'b', face: 'serif · italic · warm' },
  bold: { name: 'bold signal', letter: 'c', face: 'sans · heavy · no apology' },
}

function formatSetToday() {
  const now = new Date()
  const month = now.toLocaleString('en-US', { month: 'short' }).toLowerCase()
  const day = String(now.getDate()).padStart(2, '0')
  const year = String(now.getFullYear()).slice(-2)
  return `${month} · ${day} · ${year}`
}

function LogoMark({ size = 30, accent = 'currentColor' }: { size?: number; accent?: string }) {
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

export function App() {
  const [answerOpen, setAnswerOpen] = useState(false)
  const [selectedWord, setSelectedWord] = useState<WordId>('good')
  const [hoveredWord, setHoveredWord] = useState<WordId | null>(null)
  const [voice, setVoice] = useState<VoiceId>('quiet')
  const [activeSection, setActiveSection] = useState('question')
  const [announcement, setAnnouncement] = useState('')
  const [marks, setMarks] = useState<ImpressionMark[]>([])
  const [setToday] = useState(() => formatSetToday())
  const [heroInView, setHeroInView] = useState(false)
  const firstVoiceRef = useRef(true)
  const tokenRefs = useRef<Partial<Record<WordId, HTMLSpanElement | null>>>({})
  const answerTriggerRef = useRef<HTMLButtonElement>(null)
  const heroRef = useRef<HTMLElement>(null)
  const grainId = useId().replace(/:/g, '')

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
    const elements = ['question', 'press', 'notes', 'pressings', 'answer']
      .map(id => document.getElementById(id))
      .filter((node): node is HTMLElement => Boolean(node))
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
    elements.forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!('IntersectionObserver' in window)) {
      setHeroInView(true)
      return
    }
    const node = heroRef.current
    if (!node) return
    const observer = new IntersectionObserver(
      entries => {
        if (entries.some(entry => entry.isIntersecting)) {
          setHeroInView(true)
          observer.disconnect()
        }
      },
      { threshold: 0.16, rootMargin: '0px 0px -6% 0px' },
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
          setAnnouncement(`Voice set in ${VOICE_META[next].name}.`)
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
    setAnnouncement(`${VOICE_META[id].name} set.`)
  }

  useEffect(() => {
    if (firstVoiceRef.current) {
      firstVoiceRef.current = false
      return
    }
    pushMark({ kind: 'voice', voice })
  }, [voice, pushMark])

  const toggleAnswer = () => {
    const next = !answerOpen
    setAnswerOpen(next)
    setAnnouncement(next ? 'Answer unfolded.' : 'Answer folded back.')
    if (next) {
      window.requestAnimationFrame(() => document.getElementById('answer')?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
    } else {
      window.requestAnimationFrame(() => answerTriggerRef.current?.focus())
    }
  }

  const closeAnswer = () => {
    setAnswerOpen(false)
    setAnnouncement('Answer folded back.')
  }

  const onVoiceKey = (event: ReactKeyboardEvent<HTMLButtonElement>, id: VoiceId) => {
    const order: VoiceId[] = ['quiet', 'human', 'bold']
    const index = order.indexOf(id)
    let nextIndex = index
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') nextIndex = (index + 1) % order.length
    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') nextIndex = (index - 1 + order.length) % order.length
    if (event.key === 'Home') nextIndex = 0
    if (event.key === 'End') nextIndex = order.length - 1
    if (nextIndex === index) return
    event.preventDefault()
    selectVoice(order[nextIndex])
  }

  const activeFolio = FOLIO_LEDGER.findIndex(f => f.id === activeSection)

  return (
    <main
      className={`app app--folio app--voice-${voice} app--word-${activeWord} ${heroInView ? 'is-hero-in' : ''}`}
      style={{ '--set-type-tone': 'var(--blue)' } as CSSProperties}
    >
      <PaperGrain />
      <svg className="app__defs" aria-hidden="true">
        <defs>
          <filter id={`app-grain-${grainId}`} x="-2%" y="-2%" width="104%" height="104%">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="3" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 .14  0 0 0 0 .12  0 0 0 0 .19  0 0 0 .035 0" />
          </filter>
        </defs>
      </svg>

      <header className="folio-header" role="banner">
        <a className="brand" href="#question" aria-label="Return to the question">
          <LogoMark size={32} />
          <span className="brand__copy">
            <strong>m³ press</strong>
            <em>an open question, set today</em>
          </span>
        </a>

        <nav className="folio-header__nav" aria-label="Folio ledger">
          <ol className="folio-header__nav-list">
            {FOLIO_LEDGER.map((folio, idx) => {
              const isActive = activeSection === folio.id
              return (
                <li key={folio.id} className={`folio-header__nav-item ${isActive ? 'is-active' : ''}`}>
                  <a className="folio-header__nav-link" href={`#${folio.id === 'specimen' ? 'pressings' : folio.id}`}>
                    <span className="folio-header__nav-num">{folio.index}</span>
                    <span className="folio-header__nav-label">{folio.label}</span>
                  </a>
                  {idx < FOLIO_LEDGER.length - 1 && <span className="folio-header__nav-rule" aria-hidden="true" />}
                </li>
              )
            })}
          </ol>
        </nav>

        <span className="folio-header__set" aria-hidden="false">
          <span className="folio-header__set-dot" />
          <span className="folio-header__set-label">
            <span>set</span>
            <em>{setToday}</em>
          </span>
          <WayfinderSeal activeId={activeSection} voice={voice} setToday={setToday} />
        </span>
      </header>

      <OpeningLede voice={voice} setToday={setToday} />

      <section
        ref={heroRef}
        className={`hero hero--title-page ${heroInView ? 'is-in' : ''}`}
        id="question"
        aria-labelledby="page-title"
      >
        <h1 className="sr-only" id="page-title">{TITLE}</h1>

        <div className="hero__title-zone">
          <HeroTitle
            voice={voice}
            word={activeWord}
            hover={hoveredWord}
            setToday={setToday}
            onVoice={selectVoice}
            onWord={(id, focus) => selectWord(id, focus ?? false)}
            onHover={setHoveredWord}
            tokenRefs={tokenRefs}
          />
        </div>

        <div className="hero__rail">
          <ReadingPocket
            voice={voice}
            word={activeWord}
            setToday={setToday}
            answerOpen={answerOpen}
            answerTriggerRef={answerTriggerRef}
            onToggleAnswer={toggleAnswer}
          />
        </div>
      </section>

      <FolioTurn
        index="ii"
        title="the press bed"
        hint="pull a lever · take an impression"
        voice={voice}
      />

      <Press voice={voice} word={activeWord} onVoice={selectVoice} />

      <FolioTurn
        index="iii"
        title="the marginalia"
        hint="three things worth keeping"
        voice={voice}
        soft
      />

      <NotesSection selected={selectedWord} onSelect={id => selectWord(id, true)} />

      <FolioTurn
        index="iv"
        title="three pressings"
        hint="the same line, three faces"
        voice={voice}
      />

      <section className="specimen-plate-section section" id="pressings" aria-labelledby="specimen-plate-title">
        <header className="section__header specimen-plate-section__header">
          <p className="eyebrow"><span className="eyebrow__line" />type specimen <em>the same line, three ways</em></p>
          <h2 id="specimen-plate-title">One question, <i>three pressings.</i></h2>
          <p className="section__lede">A specimen plate laid on the press room floor. Three rows set the same line — quiet cut, human hand, bold signal. Pull a row and the headline above answers with it.</p>
        </header>
        <TypePlate active={voice} onSelect={selectVoice} />
      </section>

      <AnswerReveal
        open={answerOpen}
        onClose={closeAnswer}
        triggerRef={answerTriggerRef}
        voice={voice}
        word={activeWord}
        setToday={setToday}
      />

      <FolioTurn
        index="v"
        title="the colophon"
        hint="the page, signed off"
        voice={voice}
      />

      <Colophon voice={voice} word={activeWord} setToday={setToday} readerName="" />

      <ComposeSignature voice={voice} word={activeWord} setToday={setToday} />

      <footer className="site-foot" aria-label="The page, in one line">
        <span className="site-foot__rule" aria-hidden="true" />
        <span className="site-foot__copy">
          <span aria-hidden="true">⤳</span>
          <em>{TITLE}</em>
          <span aria-hidden="true">·</span>
          <span>composed and set on {setToday}</span>
        </span>
        <a className="site-foot__back" href="#question">
          back to the question
          <ArrowIcon />
        </a>
        <span className="site-foot__rule site-foot__rule--alt" aria-hidden="true" />
      </footer>

      <span className="sr-only" aria-live="polite">{announcement}</span>
      <span className="sr-only">{`Now reading: folio ${String(Math.max(0, activeFolio) + 1)} of ${FOLIO_LEDGER.length} · ${FOLIO_LEDGER[Math.max(0, activeFolio)]?.label ?? ''}.`}</span>
    </main>
  )
}
