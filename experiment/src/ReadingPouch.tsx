import {
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react'
import type { VoiceId } from './App'
import type { WordId, Note } from './notes'
import { NOTES } from './notes'

type ReadingPouchProps = {
  voice: VoiceId
  active: WordId
  setToday: string
}

const VOICE_NAME: Record<VoiceId, string> = {
  quiet: 'quiet cut',
  human: 'human hand',
  bold: 'bold signal',
}
const VOICE_FACE: Record<VoiceId, string> = {
  quiet: 'serif · italic · close set',
  human: 'serif · italic · warm',
  bold: 'sans · heavy · no apology',
}
const VOICE_LETTER: Record<VoiceId, string> = { quiet: 'A', human: 'B', bold: 'C' }

const WORD_GLYPH: Record<WordId, string> = { m3: '⌇', good: '∧', yet: '?' }
const WORD_LABEL: Record<WordId, string> = { m3: 'm³', good: 'good at', yet: 'yet?' }
const WORD_MARK: Record<WordId, string> = { m3: 'stet', good: 'caret', yet: 'query' }

const ORDER: WordId[] = ['m3', 'good', 'yet']

function dateTokens(setToday: string) {
  const [month, day, year] = setToday.split(' ')
  const dayNum = parseInt(day, 10)
  return {
    month: month ?? '',
    day: Number.isFinite(dayNum) ? dayNum.toString().padStart(2, '0') : '',
    year: year ?? '',
  }
}

function voiceFamily(voice: VoiceId): string {
  if (voice === 'bold') {
    return "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif"
  }
  return "'Iowan Old Style', 'Palatino Linotype', Georgia, serif"
}

const voiceWeight: Record<VoiceId, number> = { quiet: 400, human: 500, bold: 800 }
const voiceStyle: Record<VoiceId, 'italic' | 'normal'> = { quiet: 'italic', human: 'italic', bold: 'normal' }
const voiceTracking: Record<VoiceId, string> = { quiet: '-.022em', human: '-.018em', bold: '-.045em' }

export function ReadingPouch({ voice, active, setToday }: ReadingPouchProps) {
  const baseId = useId().replace(/:/g, '')
  const slipTexId = `rp-texture-${baseId}`
  const slipCordId = `rp-cord-${baseId}`

  const [openSet, setOpenSet] = useState<Set<WordId>>(() => new Set([active]))
  const [revealed, setRevealed] = useState(false)
  const [reduceMotion, setReduceMotion] = useState(false)
  const rootRef = useRef<HTMLElement | null>(null)
  const lastActive = useRef(active)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduceMotion(mq.matches)
    const onChange = () => setReduceMotion(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setRevealed(true)
      return
    }
    const node = rootRef.current
    if (!node) return
    const obs = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setRevealed(true)
            obs.unobserve(entry.target)
          }
        }
      },
      { threshold: 0.18, rootMargin: '0px 0px -8% 0px' },
    )
    obs.observe(node)
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    if (lastActive.current === active) return
    lastActive.current = active
    setOpenSet(prev => {
      if (prev.has(active)) return prev
      const next = new Set(prev)
      next.add(active)
      return next
    })
  }, [active])

  const tokens = dateTokens(setToday)
  const fullDate = `${tokens.month} ${tokens.day}, ${tokens.year}`

  const sampleStyle = {
    fontFamily: voiceFamily(voice),
    fontWeight: voiceWeight[voice],
    fontStyle: voiceStyle[voice],
    letterSpacing: voiceTracking[voice],
    textTransform: voice === 'bold' ? ('uppercase' as const) : ('none' as const),
  } as CSSProperties

  const pouchTone = `--quiet`
  const style = {
    '--rp-tone': `var(${pouchTone})`,
    '--rp-voice': `var(--${voice})`,
  } as CSSProperties

  const toggle = (id: WordId) => {
    setOpenSet(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const openAll = () => setOpenSet(new Set(ORDER))
  const closeAll = () => setOpenSet(new Set())

  const onSlipKey = (
    event: ReactKeyboardEvent<HTMLButtonElement>,
    id: WordId,
  ) => {
    const idx = ORDER.indexOf(id)
    let next = idx
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (idx + 1) % ORDER.length
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (idx - 1 + ORDER.length) % ORDER.length
    else if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = ORDER.length - 1
    if (event.key === 'Enter' || event.key === ' ' || event.key === 'Spacebar') {
      event.preventDefault()
      toggle(id)
      return
    }
    if (next === idx) return
    event.preventDefault()
    const node = document.getElementById(`rp-slip-${ORDER[next]}-${baseId}`)
    ;(node as HTMLButtonElement | null)?.focus()
  }

  const openedCount = openSet.size
  const everyOpen = openedCount === ORDER.length

  return (
    <section
      ref={rootRef}
      id="pouch"
      className={`reading-pouch reading-pouch--${voice} ${revealed ? 'is-revealed' : ''}`}
      style={style}
      aria-labelledby="reading-pouch-title"
      aria-describedby="reading-pouch-lede"
    >
      <svg className="reading-pouch__defs" aria-hidden="true" focusable="false">
        <defs>
          <pattern id={slipTexId} width="6" height="6" patternUnits="userSpaceOnUse">
            <circle cx="1.4" cy="1.4" r=".34" fill="var(--rp-voice)" opacity=".14" />
            <circle cx="4.6" cy="3.2" r=".22" fill="var(--rp-voice)" opacity=".1" />
          </pattern>
          <linearGradient id={slipCordId} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--rp-voice)" stopOpacity="0" />
            <stop offset="14%" stopColor="var(--rp-voice)" stopOpacity=".5" />
            <stop offset="86%" stopColor="var(--rp-voice)" stopOpacity=".5" />
            <stop offset="100%" stopColor="var(--rp-voice)" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      <span className="reading-pouch__void" aria-hidden="true" />

      <header className="reading-pouch__head">
        <span className="reading-pouch__folio" aria-hidden="true">
          <span className="reading-pouch__folio-rule" />
          <em>folio vi</em>
          <span className="reading-pouch__folio-dot">·</span>
          <em>the reader&apos;s pouch</em>
          <span className="reading-pouch__folio-rule" />
        </span>

        <h2 id="reading-pouch-title" className="reading-pouch__title">
          Three readings, <em>kept close.</em>
        </h2>

        <p id="reading-pouch-lede" className="section__lede reading-pouch__lede">
          A folded pocket at the foot of the page, holding one slip per word. Open any slip to read the
          compositor&apos;s note — the editorial copy the title rests on. Read them in any order; close them
          again when you are ready to leave.
        </p>

        <span className="reading-pouch__meta" aria-hidden="true">
          <span className="reading-pouch__meta-cell">
            <em>set on</em>
            <span>{fullDate}</span>
          </span>
          <span className="reading-pouch__meta-cell">
            <em>read in</em>
            <span>
              {VOICE_LETTER[voice]} · {VOICE_NAME[voice]}
            </span>
          </span>
          <span className="reading-pouch__meta-cell">
            <em>three slips</em>
            <span>{openedCount === 0 ? 'all closed' : everyOpen ? 'all open' : `${openedCount} of ${ORDER.length} open`}</span>
          </span>
        </span>
      </header>

      <div className="reading-pouch__ledge" aria-hidden="true">
        <svg viewBox="0 0 1200 12" preserveAspectRatio="none">
          <line x1="0" y1="6" x2="1200" y2="6" stroke="var(--rp-voice)" strokeWidth=".55" strokeDasharray="1 4" opacity=".5" />
          <circle cx="600" cy="6" r="2.4" fill="var(--rp-voice)" />
          <circle cx="600" cy="6" r="5" fill="none" stroke="var(--rp-voice)" strokeWidth=".4" opacity=".55" />
          <circle cx="0" cy="6" r="1.2" fill="var(--rp-voice)" opacity=".7" />
          <circle cx="1200" cy="6" r="1.2" fill="var(--rp-voice)" opacity=".7" />
        </svg>
      </div>

      <div className="reading-pouch__pockets" role="group" aria-label="The three reader slips, one per word">
        {NOTES.map((note, idx) => (
          <Slip
            key={note.id}
            note={note}
            idx={idx}
            open={openSet.has(note.id)}
            isActive={note.id === active}
            voice={voice}
            sampleStyle={sampleStyle}
            baseId={baseId}
            onToggle={() => toggle(note.id)}
            onKey={onSlipKey}
            textureId={slipTexId}
            cordId={slipCordId}
          />
        ))}
      </div>

      <span className="reading-pouch__pockets-rule" aria-hidden="true">
        <svg viewBox="0 0 1200 8" preserveAspectRatio="none">
          <line x1="0" y1="4" x2="1200" y2="4" stroke={`url(#${slipCordId})`} strokeWidth="1" />
        </svg>
      </span>

      <div className="reading-pouch__controls" role="group" aria-label="Open or close every slip at once">
        <button
          type="button"
          className="reading-pouch__control"
          onClick={openAll}
          aria-label="Open every slip"
        >
          <span className="reading-pouch__control-mark" aria-hidden="true">
            <svg viewBox="0 0 14 14">
              <path d="M2 7 L12 7 M2 4 L12 4 M2 10 L12 10" fill="none" stroke="currentColor" strokeWidth=".55" strokeLinecap="round" />
            </svg>
          </span>
          open every slip
        </button>
        <span className="reading-pouch__controls-dot" aria-hidden="true">·</span>
        <button
          type="button"
          className="reading-pouch__control"
          onClick={closeAll}
          aria-label="Close every slip"
        >
          <span className="reading-pouch__control-mark" aria-hidden="true">
            <svg viewBox="0 0 14 14">
              <path d="M7 2 L7 12 M4 5 L10 9 M10 5 L4 9" fill="none" stroke="currentColor" strokeWidth=".55" strokeLinecap="round" />
            </svg>
          </span>
          close every slip
        </button>
      </div>

      <footer className="reading-pouch__foot">
        <span className="reading-pouch__foot-rule" aria-hidden="true" />

        <p className="reading-pouch__foot-line" aria-hidden="true">
          <em>read close</em>
          <span>·</span>
          <em>the slips are kept close</em>
          <span>·</span>
          <em>the question stays open</em>
        </p>

        <a className="reading-pouch__return" href="#question">
          <span className="reading-pouch__return-glyph" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="14" height="14">
              <path
                d="M5 12h13M11 6l-6 6 6 6"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          back to the question
        </a>

        <span className="reading-pouch__foot-rule" aria-hidden="true" />

        <span className="reading-pouch__foot-sig" aria-hidden="true">
          <svg viewBox="0 0 64 14" preserveAspectRatio="none">
            <line x1="0" y1="7" x2="22" y2="7" stroke="currentColor" strokeWidth=".45" strokeLinecap="round" opacity=".5" />
            <path d="M22 7 Q26 1 30 7 Q26 13 22 7" fill="currentColor" opacity=".4" />
            <circle cx="32" cy="7" r="2" fill="currentColor" />
            <circle cx="32" cy="7" r=".7" fill="var(--night)" />
            <path d="M34 7 Q38 1 42 7 Q38 13 34 7" fill="currentColor" opacity=".4" />
            <line x1="42" y1="7" x2="64" y2="7" stroke="currentColor" strokeWidth=".45" strokeLinecap="round" opacity=".5" />
          </svg>
          <em>m³</em>
          <span>·</span>
          <em>pouch · vi</em>
          <span>·</span>
          <em>{fullDate}</em>
        </span>
      </footer>
    </section>
  )
}

type SlipProps = {
  note: Note
  idx: number
  open: boolean
  isActive: boolean
  voice: VoiceId
  sampleStyle: CSSProperties
  baseId: string
  onToggle: () => void
  onKey: (event: ReactKeyboardEvent<HTMLButtonElement>, id: WordId) => void
  textureId: string
  cordId: string
}

function Slip({
  note,
  idx,
  open,
  isActive,
  voice,
  sampleStyle,
  baseId,
  onToggle,
  onKey,
  textureId,
  cordId,
}: SlipProps) {
  const slipStyle = {
    '--rp-slip-tone': `var(--${note.id === 'm3' ? 'quiet' : note.id === 'good' ? 'human' : 'bold'})`,
    '--rp-slip-delay': `${idx * 80}ms`,
  } as CSSProperties

  const panelStyle: CSSProperties =
    voice === 'bold'
      ? { ...sampleStyle, fontWeight: 800 }
      : voice === 'human'
        ? { ...sampleStyle, fontWeight: 500 }
        : sampleStyle

  return (
    <article
      className={`rp-slip rp-slip--${note.id} ${open ? 'is-open' : ''} ${isActive ? 'is-active' : ''} rp-slip--voice-${voice}`}
      style={slipStyle}
      aria-labelledby={`rp-slip-title-${note.id}-${baseId}`}
    >
      <span className="rp-slip__shadow" aria-hidden="true" />

      <span className="rp-slip__tab" aria-hidden="true">
        <svg viewBox="0 0 24 12" preserveAspectRatio="none">
          <path d="M0 12 L0 4 Q12 0 24 4 L24 12 Z" fill="currentColor" opacity=".12" />
          <line x1="0" y1="12" x2="24" y2="12" stroke="currentColor" strokeWidth=".4" strokeLinecap="round" opacity=".55" />
          <line x1="4" y1="6" x2="20" y2="6" stroke="currentColor" strokeWidth=".3" strokeDasharray=".6 1.4" opacity=".55" />
        </svg>
        <span className="rp-slip__tab-num">{String(idx + 1).padStart(2, '0')}</span>
      </span>

      <button
        id={`rp-slip-${note.id}-${baseId}`}
        type="button"
        className="rp-slip__cover"
        aria-expanded={open}
        aria-controls={`rp-slip-body-${note.id}-${baseId}`}
        onClick={onToggle}
        onKeyDown={event => onKey(event, note.id)}
        aria-label={`${WORD_LABEL[note.id]} — ${note.title}. ${open ? 'Press to fold back.' : 'Press to unfold.'}`}
      >
        <span className="rp-slip__cover-texture" aria-hidden="true">
          <svg viewBox="0 0 320 180" preserveAspectRatio="none">
            <rect width="320" height="180" fill={`url(#${textureId})`} />
          </svg>
        </span>

        <header className="rp-slip__cover-head">
          <span className="rp-slip__cover-mark" aria-hidden="true">
            <svg viewBox="0 0 18 18">
              <circle cx="9" cy="9" r="7.2" fill="none" stroke="currentColor" strokeWidth=".55" />
              <circle cx="9" cy="9" r="3.4" fill="currentColor" opacity=".85" />
              <circle cx="9" cy="9" r="1" fill="var(--night)" />
            </svg>
          </span>
          <span className="rp-slip__cover-glyph" aria-hidden="true">{WORD_GLYPH[note.id]}</span>
          <span className="rp-slip__cover-stack">
            <em className="rp-slip__cover-mark-label">{WORD_MARK[note.id]}</em>
            <span className="rp-slip__cover-mark-sub">{`${WORD_LABEL[note.id]} · ${note.folio}`}</span>
          </span>
        </header>

        <p className="rp-slip__cover-title" id={`rp-slip-title-${note.id}-${baseId}`}>
          <em>{note.title}</em>
        </p>

        <p className="rp-slip__cover-gloss">
          <em>{note.gloss}</em>
        </p>

        <span className="rp-slip__cover-cue" aria-hidden="true">
          <span className="rp-slip__cover-rule" />
          <em>{open ? 'fold back' : 'unfold the slip'}</em>
          <span className="rp-slip__cover-cord">
            <svg viewBox="0 0 24 4" preserveAspectRatio="none">
              <line x1="0" y1="2" x2="24" y2="2" stroke="currentColor" strokeWidth=".45" strokeDasharray="1 1.4" />
            </svg>
          </span>
          <em className="rp-slip__cover-cue-key">↵</em>
          <span className="rp-slip__cover-rule" />
        </span>
      </button>

      <div
        id={`rp-slip-body-${note.id}-${baseId}`}
        className="rp-slip__body"
        hidden={!open}
        aria-hidden={!open}
      >
        <span className="rp-slip__body-edge" aria-hidden="true">
          <svg viewBox="0 0 320 4" preserveAspectRatio="none">
            <line x1="0" y1="2" x2="320" y2="2" stroke={`url(#${cordId})`} strokeWidth=".7" />
          </svg>
        </span>

        <span className="rp-slip__sample-row" aria-hidden="true">
          <span className="rp-slip__sample-key">
            <em>set in</em>
            <span>{VOICE_LETTER[voice]} · {VOICE_NAME[voice]}</span>
          </span>
          <span
            className={`rp-slip__sample rp-slip__sample--${voice}`}
            style={panelStyle}
          >
            {note.id === 'm3' && 'is M\u00b3 good at frontend yet?'}
            {note.id === 'good' && 'is m\u00b3 good at frontend yet?'}
            {note.id === 'yet' && 'is m\u00b3 good at frontend yet?'}
          </span>
          <span className="rp-slip__sample-rule" />
        </span>

        <p className="rp-slip__body-text">{note.body}</p>

        <p className="rp-slip__body-prompt">
          <span className="rp-slip__body-prompt-key" aria-hidden="true">prompt</span>
          <em>{note.prompt}</em>
          <span className="rp-slip__body-prompt-dot" aria-hidden="true">·</span>
          <span className="rp-slip__body-prompt-face" aria-hidden="true">
            {VOICE_FACE[voice]}
          </span>
        </p>

        <span className="rp-slip__body-corner" aria-hidden="true">
          <svg viewBox="0 0 18 18">
            <circle cx="9" cy="9" r="7" fill="none" stroke="currentColor" strokeWidth=".45" opacity=".65" />
            <circle cx="9" cy="9" r="3.4" fill="currentColor" opacity=".4" />
            <circle cx="9" cy="9" r="1" fill="var(--night)" />
            <line x1="9" y1="0" x2="9" y2="2.4" stroke="currentColor" strokeWidth=".4" strokeLinecap="round" />
            <line x1="9" y1="15.6" x2="9" y2="18" stroke="currentColor" strokeWidth=".4" strokeLinecap="round" />
            <line x1="0" y1="9" x2="2.4" y2="9" stroke="currentColor" strokeWidth=".4" strokeLinecap="round" />
            <line x1="15.6" y1="9" x2="18" y2="9" stroke="currentColor" strokeWidth=".4" strokeLinecap="round" />
          </svg>
        </span>
      </div>
    </article>
  )
}
