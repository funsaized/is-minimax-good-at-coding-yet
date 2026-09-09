import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type KeyboardEvent as ReactKeyboardEvent } from 'react'
import { ComposeSpecimen } from './ComposeSpecimen'
import { MarginalThread } from './MarginalThread'
import { PressStamp } from './PressStamp'

const TITLE = 'is Minimax M3 good at frontend yet?'

type WordId = 'm3' | 'good' | 'yet'
type VoiceId = 'quiet' | 'human' | 'bold'

type Note = {
  id: WordId
  index: string
  folio: string
  label: string
  title: string
  gloss: string
  body: string
  prompt: string
  editor: string
  seen: string
}

type Voice = {
  id: VoiceId
  name: string
  descriptor: string
  body: string
  lines: [string, string, string]
}

type Stage = {
  id: 'set' | 'compose' | 'proof'
  name: string
  hint: string
}

const NOTES: Note[] = [
  {
    id: 'm3',
    index: '01',
    folio: 'i',
    label: 'M3',
    title: 'Keep the fingerprint',
    gloss: 'a habit, not a name',
    body: 'A useful page should leave evidence of a point of view. Not a logo. Not a trick. A small, repeatable act of judgment.',
    prompt: 'the maker is a habit',
    editor: 'a quiet corner of the title — leave it alone',
    seen: 'seen twice today',
  },
  {
    id: 'good',
    index: '02',
    folio: 'ii',
    label: 'good at',
    title: 'Choose one clear thing',
    gloss: 'confidence is generous',
    body: 'The interface gets quieter when it stops presenting every possible answer. A confident choice gives the reader somewhere to stand.',
    prompt: 'make room for attention',
    editor: 'the verb of the question — keep it present tense',
    seen: 'read aloud once',
  },
  {
    id: 'yet',
    index: '03',
    folio: 'iii',
    label: 'yet?',
    title: 'Protect the pause',
    gloss: 'the question stays open',
    body: '“Yet” carries the honest part. The space before an answer is not a gap to decorate; it is where the reader arrives.',
    prompt: 'leave room to arrive',
    editor: 'the question mark is doing real work here',
    seen: 'circled in pencil',
  },
]

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

const STAGES: Stage[] = [
  { id: 'set', name: 'set', hint: 'a question is fixed' },
  { id: 'compose', name: 'compose', hint: 'typography tries on the words' },
  { id: 'proof', name: 'proof', hint: 'an answer is allowed to arrive' },
]

function LogoMark({ size = 38, accent = 'var(--acid)' }: { size?: number; accent?: string }) {
  return (
    <svg className="brand__mark" width={size} height={size} viewBox="0 0 42 42" aria-hidden="true" style={{ color: accent }}>
      <circle cx="21" cy="21" r="18" fill="none" stroke="currentColor" strokeWidth="1" />
      <circle cx="21" cy="21" r="12" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="1.5 2.5" />
      <path d="M9 21h24M21 9v24" stroke="currentColor" strokeWidth=".7" opacity=".55" />
      <text x="21" y="25.5" textAnchor="middle" fontFamily="Georgia, serif" fontStyle="italic" fontSize="12" fill="currentColor">m³</text>
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

function NoteGlyph({ id }: { id: WordId }) {
  if (id === 'm3') {
    return (
      <svg viewBox="0 0 56 30" aria-hidden="true">
        <path d="M3 22c10-18 16 14 26-4 8-15 14 9 24-9" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        <circle cx="3" cy="22" r="1.4" fill="currentColor" />
      </svg>
    )
  }
  if (id === 'good') {
    return (
      <svg viewBox="0 0 56 30" aria-hidden="true">
        <path d="M6 22l22-14 22 14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M28 8v14M22 12l6-4 6 4" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 56 30" aria-hidden="true">
      <path d="M14 5c-4 4-4 10 0 14M22 5c-4 4-4 10 0 14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="6" cy="25" r="1.2" fill="currentColor" />
      <circle cx="14" cy="26" r="1.2" fill="currentColor" />
      <circle cx="22" cy="25" r="1.2" fill="currentColor" />
      <path d="M10 27h8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}

function getProofLabel(id: WordId): string {
  if (id === 'm3') return 'stet'
  if (id === 'good') return 'caret'
  return 'query'
}

function getProofSub(id: WordId): string {
  if (id === 'm3') return 'let it stand'
  if (id === 'good') return 'insert here'
  return 'mark for review'
}

function PushPin({ tone = 'wax' }: { tone?: 'wax' | 'acid' | 'blue' }) {
  const fill = tone === 'acid' ? 'var(--acid)' : tone === 'blue' ? 'var(--blue)' : 'var(--wax)'
  return (
    <svg className={`push-pin push-pin--${tone}`} viewBox="0 0 22 22" aria-hidden="true">
      <ellipse cx="11" cy="19" rx="4.5" ry="1.2" fill="rgba(0, 0, 0, .35)" />
      <line x1="11" y1="14" x2="11" y2="20" stroke="rgba(0, 0, 0, .35)" strokeWidth=".8" />
      <circle cx="11" cy="9" r="6.5" fill={fill} />
      <circle cx="9.5" cy="7.5" r="2" fill="rgba(255, 255, 255, .45)" />
      <circle cx="12" cy="10.5" r="1.2" fill="rgba(0, 0, 0, .25)" />
    </svg>
  )
}

function PinnedMarkSlip({ id, active }: { id: WordId; active: boolean }) {
  const note = NOTES.find(n => n.id === id)
  return (
    <div className={`slip slip--${id} ${active ? 'is-active' : ''}`} aria-hidden="true">
      <span className="slip__pin"><PushPin tone={id === 'm3' ? 'acid' : id === 'good' ? 'wax' : 'blue'} /></span>
      <span className="slip__paper">
        <span className="slip__head">
          <span className="slip__label">{getProofLabel(id)}</span>
          <span className="slip__glyph"><NoteGlyph id={id} /></span>
        </span>
        <span className="slip__sub">{getProofSub(id)}</span>
        {note && <span className="slip__editor">{note.editor}</span>}
        <span className="slip__tape" aria-hidden="true" />
      </span>
    </div>
  )
}

function Marginalia({ activeWord, tokenRefs }: {
  activeWord: WordId
  tokenRefs: React.MutableRefObject<Partial<Record<WordId, HTMLSpanElement | null>>>
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [y, setY] = useState(0)

  useLayoutEffect(() => {
    const update = () => {
      const tokenEl = tokenRefs.current[activeWord]
      const marginaliaEl = ref.current
      if (!tokenEl || !marginaliaEl) return
      const rail = marginaliaEl.parentElement
      if (!rail) return
      const tr = tokenEl.getBoundingClientRect()
      const rr = rail.getBoundingClientRect()
      setY(tr.top - rr.top + tr.height / 2)
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [activeWord, tokenRefs])

  const style = { ['--my' as string]: `${y}px` } as CSSProperties

  return (
    <div ref={ref} className={`marginalia marginalia--${activeWord}`} style={style}>
      <span className="marginalia__cork" aria-hidden="true" />
      <span className="marginalia__lead" aria-hidden="true" />
      <div className="marginalia__stack" key={activeWord}>
        <span className="marginalia__heading">editor's marks</span>
        <div className="marginalia__slips">
          <PinnedMarkSlip id="m3" active={activeWord === 'm3'} />
          <PinnedMarkSlip id="good" active={activeWord === 'good'} />
          <PinnedMarkSlip id="yet" active={activeWord === 'yet'} />
        </div>
        <span className="marginalia__foot">three pinned notes</span>
      </div>
      <span className="marginalia__lead marginalia__lead--end" aria-hidden="true" />
    </div>
  )
}

function HeaderRuler() {
  return (
    <div className="header-ruler" aria-hidden="true">
      <div className="header-ruler__line">
        {Array.from({ length: 32 }).map((_, index) => (
          <span key={index} className={index % 8 === 0 ? 'is-major' : index % 4 === 0 ? 'is-mid' : ''} />
        ))}
      </div>
    </div>
  )
}

function MakeReadyMarks() {
  return (
    <div className="make-ready" aria-hidden="true">
      <svg className="make-ready__corner make-ready__corner--tl" viewBox="0 0 18 18">
        <line x1="0" y1="14" x2="14" y2="14" />
        <line x1="14" y1="0" x2="14" y2="14" />
      </svg>
      <svg className="make-ready__corner make-ready__corner--tr" viewBox="0 0 18 18">
        <line x1="4" y1="14" x2="18" y2="14" />
        <line x1="4" y1="0" x2="4" y2="14" />
      </svg>
      <svg className="make-ready__corner make-ready__corner--bl" viewBox="0 0 18 18">
        <line x1="0" y1="4" x2="14" y2="4" />
        <line x1="14" y1="4" x2="14" y2="18" />
      </svg>
      <svg className="make-ready__corner make-ready__corner--br" viewBox="0 0 18 18">
        <line x1="4" y1="4" x2="18" y2="4" />
        <line x1="4" y1="4" x2="4" y2="18" />
      </svg>
      <svg className="make-ready__register" viewBox="0 0 16 16">
        <circle cx="8" cy="8" r="3" />
        <line x1="2" y1="8" x2="14" y2="8" />
        <line x1="8" y1="2" x2="8" y2="14" />
      </svg>
      <span className="make-ready__colorbar" aria-hidden="true" />
      <span className="make-ready__colorbar make-ready__colorbar--left" aria-hidden="true" />
    </div>
  )
}

function StageMarkers({ active }: { active: number }) {
  return (
    <ol className="stage-markers" aria-label="The three stages of the page">
      {STAGES.map((stage, index) => (
        <li
          key={stage.id}
          className={`stage-markers__item ${index === active ? 'is-active' : ''} ${index < active ? 'is-past' : ''}`}
          aria-current={index === active ? 'step' : undefined}
        >
          <span className="stage-markers__dot" aria-hidden="true">
            <span />
          </span>
          <span className="stage-markers__name">{stage.name}</span>
          <span className="stage-markers__hint">{stage.hint}</span>
        </li>
      ))}
    </ol>
  )
}

function PressFolio({ section }: { section: string }) {
  const map: Record<string, { folio: string; mark: string }> = {
    question: { folio: 'i', mark: 'set' },
    notes: { folio: 'ii', mark: 'marginalia' },
    voices: { folio: 'iii', mark: 'type drawer' },
    answer: { folio: 'iv', mark: 'proof' },
  }
  const entry = map[section] ?? map.question
  return (
    <span className="press-folio" aria-live="polite">
      <span className="press-folio__num">folio {entry.folio}</span>
      <span className="press-folio__mark" aria-hidden="true">·</span>
      <span className="press-folio__label">{entry.mark}</span>
    </span>
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
  circleKey,
}: {
  id: WordId
  text: string
  selected: boolean
  onSelect: (id: WordId) => void
  onHover: (id: WordId) => void
  onLeave: () => void
  tokenRef: (node: HTMLSpanElement | null) => void
  circleKey: number
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
      <svg className="title-token__circle" viewBox="0 0 80 38" aria-hidden="true" key={circleKey}>
        <path
          d="M40 6c14 0 32 4 32 13s-16 13-32 13S8 28 8 19 26 6 40 6Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeDasharray="160 200"
        />
        <path d="M10 14c-1 2-1.4 4-.6 5.4" fill="none" stroke="currentColor" strokeWidth=".9" strokeLinecap="round" />
        <circle cx="9" cy="18.6" r="1.1" fill="currentColor" />
      </svg>
      <span className="title-token__cross" aria-hidden="true">
        <svg viewBox="0 0 28 28">
          <line x1="2" y1="14" x2="26" y2="14" stroke="currentColor" strokeWidth=".7" strokeDasharray="2 2" />
          <line x1="14" y1="2" x2="14" y2="26" stroke="currentColor" strokeWidth=".7" strokeDasharray="2 2" />
        </svg>
      </span>
      <span className="title-token__set" aria-hidden="true" />
      {text}
    </span>
  )
}

function SpecimenStrip({ voice, word }: { voice: VoiceId; word: WordId }) {
  const current = VOICES.find(item => item.id === voice) ?? VOICES[0]
  const note = NOTES.find(item => item.id === word)
  const prompt = note?.prompt ?? 'leave room to arrive'
  const display = voice === 'bold' ? 'IS M3 GOOD AT FRONTEND YET?' : 'is M3 good at frontend yet?'
  return (
    <aside className={`specimen-strip specimen-strip--${voice}`} aria-label="The composed specimen">
      <div className="specimen-strip__head">
        <span className="specimen-strip__tag">specimen · {current.descriptor}</span>
        <span className="specimen-strip__id" aria-hidden="true">№ 03</span>
      </div>
      <div className="specimen-strip__art">
        <ComposeSpecimen voice={voice} display={display} />
      </div>
      <div className="specimen-strip__foot">
        <span className="specimen-strip__prompt">{prompt}</span>
        <span className="specimen-strip__rule" aria-hidden="true" />
      </div>
    </aside>
  )
}

function AnswerReveal({ open, onClose, triggerRef, voice }: {
  open: boolean
  onClose: () => void
  triggerRef: React.MutableRefObject<HTMLButtonElement | null>
  voice: VoiceId
}) {
  return (
    <section
      className={`answer-reveal ${open ? 'is-open' : ''}`}
      id="answer"
      aria-labelledby="answer-title"
      aria-hidden={!open}
    >
      <div className="answer-reveal__clip">
        <div className="answer-reveal__paper">
          <span className="answer-reveal__fold" aria-hidden="true" />
          <div className="answer-reveal__seal" aria-hidden="true">
            <PressStamp voice={voice} size={128} />
          </div>
          <div className="answer-reveal__inner">
            <div className="answer-reveal__row">
              <span className="answer-reveal__folio" aria-hidden="true">folio iv · the proof</span>
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
                  <span className="answer-reveal__dropcap" aria-hidden="true">T</span>
                  he good part is not the gradient, the flourish, or the clever little mechanism. It is the moment the page gives you room to notice <em>one thing</em>. Then another.
                </p>
                <p>So this is a qualified yes: good at front-end means attentive to the person on the other side of the glass. The rest is decoration with a job to do.</p>
              </div>
              <div className="answer-reveal__pull">
                <span aria-hidden="true" />
                <em>attention, not ornament</em>
                <span aria-hidden="true" />
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
        </div>
      </div>
    </section>
  )
}

function NotesSection({ selected, onSelect }: { selected: WordId; onSelect: (id: WordId) => void }) {
  return (
    <section className="section notes-section" id="notes" aria-labelledby="notes-title">
      <div className="section__header">
        <p className="eyebrow"><span className="eyebrow__line" />marginalia <em>three things worth keeping</em></p>
        <h2 id="notes-title">The page gets better when it <i>pays attention.</i></h2>
        <p className="section__lede">Hover or focus a marked word above. These are not rules; they are the small decisions underneath the surface.</p>
      </div>
      <div className="notes-grid">
        {NOTES.map(note => (
          <button
            key={note.id}
            id={`note-${note.id}`}
            type="button"
            className={`note-card note-card--${note.id} ${selected === note.id ? 'is-selected' : ''}`}
            aria-pressed={selected === note.id}
            onClick={() => onSelect(note.id)}
          >
            <span className="note-card__scrawl" aria-hidden="true">seen · {note.seen}</span>
            <span className="note-card__folio" aria-hidden="true">folio {note.folio}</span>
            <span className="note-card__head">
              <span>{note.index}</span>
              <NoteGlyph id={note.id} />
            </span>
            <span className="note-card__label">{note.label}</span>
            <strong>{note.title}</strong>
            <em>{note.gloss}</em>
            <span className="note-card__body">{note.body}</span>
            <span className="note-card__prompt">{note.prompt} <span aria-hidden="true">↗</span></span>
          </button>
        ))}
      </div>
    </section>
  )
}

function VoicesSection({ voice, onVoice, voiceRefs }: {
  voice: VoiceId
  onVoice: (id: VoiceId) => void
  voiceRefs: React.MutableRefObject<Partial<Record<VoiceId, HTMLButtonElement | null>>>
}) {
  const selectByKey = (event: ReactKeyboardEvent<HTMLButtonElement>, id: VoiceId) => {
    const index = VOICES.findIndex(item => item.id === id)
    let nextIndex = index
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') nextIndex = (index + 1) % VOICES.length
    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') nextIndex = (index - 1 + VOICES.length) % VOICES.length
    if (event.key === 'Home') nextIndex = 0
    if (event.key === 'End') nextIndex = VOICES.length - 1
    if (nextIndex === index) return
    event.preventDefault()
    const next = VOICES[nextIndex].id
    onVoice(next)
    window.requestAnimationFrame(() => voiceRefs.current[next]?.focus())
  }

  return (
    <section className="section voices-section" id="voices" aria-labelledby="voices-title">
      <div className="section__header voices-section__header">
        <p className="eyebrow eyebrow--dark"><span className="eyebrow__line" />type drawer <em>one question, three readings</em></p>
        <h2 id="voices-title">Let the same words <i>change clothes.</i></h2>
        <p className="section__lede">Choose a voice. The title above shifts with it, because typography is part of the answer.</p>
      </div>
      <div className="voice-triptych" role="tablist" aria-label="Choose a typographic voice">
        {VOICES.map(item => (
          <button
            key={item.id}
            ref={node => { voiceRefs.current[item.id] = node }}
            type="button"
            className={`voice-tile voice-tile--${item.id} ${voice === item.id ? 'is-active' : ''}`}
            role="tab"
            aria-selected={voice === item.id}
            tabIndex={voice === item.id ? 0 : -1}
            onClick={() => onVoice(item.id)}
            onKeyDown={event => selectByKey(event, item.id)}
          >
            <span className="voice-tile__head">
              <span className="voice-tile__letter" aria-hidden="true">{item.id === 'quiet' ? 'A' : item.id === 'human' ? 'B' : 'C'}</span>
              <span className="voice-tile__name">{item.name}</span>
              <span className="voice-tile__descriptor">{item.descriptor}</span>
            </span>
            <span className={`voice-tile__sample voice-tile__sample--${item.id}`} aria-hidden="true">
              <span>{item.lines[0]}</span>
              <span>{item.lines[1]}</span>
              <span>{item.lines[2]}</span>
            </span>
            <span className="voice-tile__foot">
              <span className="voice-tile__body">{item.body}</span>
              <span className="voice-tile__mark" aria-hidden="true">{voice === item.id ? '●' : '○'}</span>
            </span>
            <span className="voice-tile__stamp" aria-hidden="true">
              <PressStamp voice={voice} size={36} />
            </span>
          </button>
        ))}
      </div>
    </section>
  )
}

function PressSignature({ voice }: { voice: VoiceId }) {
  const tag = voice === 'bold' ? 'NO APOLOGIES' : voice === 'human' ? 'BY HAND' : 'SET WITH CARE'
  return (
    <svg className={`press-signature press-signature--${voice}`} viewBox="0 0 240 88" aria-hidden="true">
      <defs>
        <filter id="press-signature-grain" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="1.4" numOctaves="2" seed="9" stitchTiles="stitch" />
          <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .55 0" />
          <feComposite in2="SourceGraphic" operator="in" />
        </filter>
      </defs>
      <g filter="url(#press-signature-grain)" opacity=".88">
        <rect x="3" y="3" width="234" height="80" rx="2" fill="none" stroke="currentColor" strokeWidth="1.4" />
        <rect x="10" y="10" width="220" height="66" rx="1" fill="none" stroke="currentColor" strokeWidth=".5" strokeDasharray="1 3" />
        <text x="22" y="32" fontFamily="Georgia, serif" fontStyle="italic" fontSize="14" fill="currentColor">{tag}</text>
        <text x="22" y="64" fontFamily="ui-monospace, monospace" fontSize="7" letterSpacing="1.6" fill="currentColor" opacity=".75">PRESS · M³ · NO TWO PRESSES ALIKE</text>
        <line x1="22" y1="40" x2="158" y2="40" stroke="currentColor" strokeWidth=".4" opacity=".4" />
        <line x1="22" y1="71" x2="158" y2="71" stroke="currentColor" strokeWidth=".4" opacity=".4" />
        <text x="196" y="52" fontFamily="Georgia, serif" fontStyle="italic" fontSize="26" fill="currentColor" textAnchor="middle">m³</text>
        <text x="196" y="68" fontFamily="ui-monospace, monospace" fontSize="5.5" letterSpacing="1.4" fill="currentColor" opacity=".65" textAnchor="middle">OPUS · TODAY</text>
      </g>
    </svg>
  )
}

export function App() {
  const [answerOpen, setAnswerOpen] = useState(false)
  const [selectedWord, setSelectedWord] = useState<WordId>('good')
  const [hoveredWord, setHoveredWord] = useState<WordId | null>(null)
  const [voice, setVoice] = useState<VoiceId>('quiet')
  const [activeSection, setActiveSection] = useState('question')
  const [activeStage, setActiveStage] = useState(0)
  const [announcement, setAnnouncement] = useState('')
  const [circleKey, setCircleKey] = useState<Record<WordId, number>>({ m3: 0, good: 0, yet: 0 })
  const tokenRefs = useRef<Partial<Record<WordId, HTMLSpanElement | null>>>({})
  const voiceRefs = useRef<Partial<Record<VoiceId, HTMLButtonElement | null>>>({})
  const answerTriggerRef = useRef<HTMLButtonElement>(null)

  const activeWord = hoveredWord ?? selectedWord

  useEffect(() => {
    document.title = TITLE
  }, [])

  useEffect(() => {
    const elements = ['question', 'notes', 'voices', 'answer']
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
    if (activeSection === 'question') setActiveStage(answerOpen ? 2 : 0)
    else if (activeSection === 'notes') setActiveStage(1)
    else setActiveStage(2)
  }, [activeSection, answerOpen])

  const selectWord = (id: WordId, focus = false) => {
    const note = NOTES.find(item => item.id === id)
    setSelectedWord(id)
    setAnnouncement(note ? `${note.label}: ${note.title}.` : '')
    setCircleKey(keys => ({ ...keys, [id]: (keys[id] ?? 0) + 1 }))
    if (focus) window.requestAnimationFrame(() => tokenRefs.current[id]?.focus())
  }

  const selectVoice = (id: VoiceId) => {
    const next = VOICES.find(item => item.id === id)
    setVoice(id)
    setAnnouncement(next ? `${next.name} selected.` : '')
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
      <div className="app__grain" aria-hidden="true" />
      <div className="app__pencil" aria-hidden="true" />
      <svg className="press-mark-bg" viewBox="0 0 400 400" aria-hidden="true">
        <circle cx="200" cy="200" r="170" fill="none" stroke="currentColor" strokeWidth="1.4" />
        <circle cx="200" cy="200" r="150" fill="none" stroke="currentColor" strokeWidth=".6" strokeDasharray="2 4" />
        <text x="200" y="224" textAnchor="middle" fontFamily="Georgia, serif" fontStyle="italic" fontSize="96" fill="currentColor">m³</text>
      </svg>
      <MakeReadyMarks />
      <header className="site-header">
        <div className="site-header__row">
          <a className="brand" href="#question" aria-label="Return to the question">
            <LogoMark size={36} />
            <span className="brand__copy">
              <strong>m³ / compose desk</strong>
              <em>an open question</em>
            </span>
          </a>
          <nav className="site-nav" aria-label="Sections">
            <a href="#question" className={activeSection === 'question' ? 'is-active' : ''} aria-current={activeSection === 'question' ? 'location' : undefined}>question</a>
            <a href="#notes" className={activeSection === 'notes' ? 'is-active' : ''} aria-current={activeSection === 'notes' ? 'location' : undefined}>marginalia</a>
            <a href="#voices" className={activeSection === 'voices' ? 'is-active' : ''} aria-current={activeSection === 'voices' ? 'location' : undefined}>voices</a>
            <a href="#answer" className={activeSection === 'answer' ? 'is-active' : ''} aria-current={activeSection === 'answer' ? 'location' : undefined} onClick={openAnswerFromNav}>answer</a>
          </nav>
          <span className="site-header__note">
            <PressFolio section={activeSection} />
            <span className="site-header__sep" aria-hidden="true">·</span>
            <span className="site-header__tagline">a page that listens</span>
          </span>
        </div>
        <HeaderRuler />
      </header>

      <div className="page">
        <section className="hero" id="question" aria-labelledby="page-title">
          <div className="hero__eyebrow-row">
            <p className="eyebrow"><span className="eyebrow__line" />frontend experiment <em>read the question first</em></p>
            <StageMarkers active={activeStage} />
          </div>

          <div className="hero__layout">
            <div className="hero__copy">
              <h1 className={`hero__title hero__title--${voice}`} id="page-title" aria-label={TITLE}>
                <span className="title__line">is Minimax </span>
                <span className="title__line">
                  <TitleToken id="m3" text="M3" selected={activeWord === 'm3'} onSelect={id => selectWord(id)} onHover={setHoveredWord} onLeave={() => setHoveredWord(null)} tokenRef={node => { tokenRefs.current.m3 = node }} circleKey={circleKey.m3} />{' '}
                  <TitleToken id="good" text="good at" selected={activeWord === 'good'} onSelect={id => selectWord(id)} onHover={setHoveredWord} onLeave={() => setHoveredWord(null)} tokenRef={node => { tokenRefs.current.good = node }} circleKey={circleKey.good} />
                </span>
                <span className="title__line"> frontend <TitleToken id="yet" text="yet" selected={activeWord === 'yet'} onSelect={id => selectWord(id)} onHover={setHoveredWord} onLeave={() => setHoveredWord(null)} tokenRef={node => { tokenRefs.current.yet = node }} circleKey={circleKey.yet} />?</span>
                <span className="hero__title-fold" aria-hidden="true" />
              </h1>
              <span className="hero__annotation" aria-hidden="true">
                <span className="hero__annotation-mark">
                  <svg viewBox="0 0 40 16">
                    <path d="M2 13c5-7 12 5 18-3 4-5 8 4 12-2 2-3 4-1 6-4" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
                    <circle cx="2" cy="13" r="0.8" fill="currentColor" />
                  </svg>
                </span>
                <em>read each marked word — the marginalia listens</em>
                <span className="hero__annotation-rule" />
                <span className="hero__annotation-mark hero__annotation-mark--end" aria-hidden="true">
                  <PressStamp voice={voice} size={22} />
                </span>
              </span>
              <p className="hero__summary">
                <span className="hero__dropcap" aria-hidden="true">A</span>
                small, stubborn inquiry into whether a machine can make a page feel like <em>someone was here.</em>
              </p>
              <div className="hero__actions">
                <button ref={answerTriggerRef} type="button" className={`button button--primary ${answerOpen ? 'is-open' : ''}`} onClick={toggleAnswer} aria-expanded={answerOpen} aria-controls="answer">
                  <span>{answerOpen ? 'fold the answer back' : 'read the editor’s note'}</span>
                  <ArrowIcon />
                </button>
                <a className="text-link" href="#notes">follow the marginalia <span aria-hidden="true">↓</span></a>
              </div>
              <div className="hero__note">
                <span className="hero__note-mark" aria-hidden="true">*</span>
                <p><strong>Good front-end work</strong> is less about showing what can be made than noticing what should remain quiet.</p>
              </div>
            </div>
            <aside className="hero__spine" aria-label="Proofreader's marks for the marked words">
              <div className="spine__rail">
                <Marginalia activeWord={activeWord} tokenRefs={tokenRefs} />
              </div>
            </aside>
            <div className="hero__specimen">
              <SpecimenStrip voice={voice} word={activeWord} />
            </div>
          </div>
          <div className="hero__footer">
            <span><i className="hero__footer-dot" /> compose, slowly</span>
            <span>marked words open the margin</span>
            <span className="hero__footer-mark" aria-hidden="true">
              <PressStamp voice={voice} size={28} />
            </span>
            <a href="#answer" onClick={openAnswerFromNav} aria-label="Jump to the answer">↓</a>
          </div>
        </section>

        <AnswerReveal open={answerOpen} onClose={closeAnswer} triggerRef={answerTriggerRef} voice={voice} />

        <NotesSection selected={selectedWord} onSelect={id => selectWord(id, true)} />
        <VoicesSection voice={voice} onVoice={selectVoice} voiceRefs={voiceRefs} />

        <footer className="site-footer">
          <div className="site-footer__rule"><span /><LogoMark size={30} accent="var(--coral)" /><span /></div>
          <p className="site-footer__line">the question remains useful <i>because the answer can change</i></p>
          <div className="site-footer__press"><PressSignature voice={voice} /></div>
          <p className="site-footer__colophon">
            <span>set in system serif</span>
            <span aria-hidden="true">·</span>
            <span>composed by hand</span>
            <span aria-hidden="true">·</span>
            <span>folded once</span>
          </p>
          <a className="site-footer__back" href="#question">back to the question <ArrowIcon /></a>
        </footer>
      </div>

      <MarginalThread activeId={activeSection === 'question' || activeSection === 'notes' || activeSection === 'voices' || activeSection === 'answer' ? activeSection : 'question'} />
      <span className="sr-only" aria-live="polite">{announcement}</span>
    </main>
  )
}