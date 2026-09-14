import { useEffect, useState, type CSSProperties } from 'react'
import type { VoiceId } from './PressBay'
import type { WordId } from './notes'

type Folio = {
  id: string
  index: string
  label: string
  hint: string
}

const FOLIOS: Folio[] = [
  { id: 'question', index: 'i', label: 'the question', hint: 'a folio of one line, set three ways' },
  { id: 'press-room', index: 'i·', label: 'the press bay', hint: 'a lever, three voices, one pull' },
  { id: 'compose', index: 'ii', label: 'the compose floor', hint: 'the line held in pieces' },
  { id: 'contents', index: 'iii', label: 'this page, listed', hint: 'the press log · folio contents' },
  { id: 'day', index: 'iii·', label: 'the day sheet', hint: 'the hour, the week, the day’s record' },
  { id: 'note', index: '·', label: 'a folded slip', hint: 'a short letter to the reader' },
  { id: 'proof', index: 'iv', label: 'the second proof', hint: 'marks on the words worth keeping' },
  { id: 'pressings', index: 'v', label: 'three pressings', hint: 'the question set three ways' },
  { id: 'notes', index: 'vi', label: 'the marginalia', hint: 'three things worth keeping' },
  { id: 'answer', index: 'viii', label: 'the answer', hint: 'folded once, then folded back' },
]

const WORD_LABEL: Record<WordId, string> = { m3: 'm³', good: 'good at', yet: 'yet?' }
const VOICE_LABEL: Record<VoiceId, string> = { quiet: 'quiet cut', human: 'human hand', bold: 'bold signal' }

type FolioStitchProps = {
  activeId: string
  voice: VoiceId
  word: WordId
}

export function FolioStitch({ activeId, voice, word }: FolioStitchProps) {
  const [scrollY, setScrollY] = useState(0)
  const [docHeight, setDocHeight] = useState(1)
  const [viewport, setViewport] = useState(1)
  const activeIndex = Math.max(0, FOLIOS.findIndex(f => f.id === activeId))

  useEffect(() => {
    if (typeof window === 'undefined') return
    const compute = () => {
      const doc = document.documentElement
      setScrollY(window.scrollY)
      setDocHeight(Math.max(1, doc.scrollHeight))
      setViewport(window.innerHeight)
    }
    compute()
    window.addEventListener('scroll', compute, { passive: true })
    window.addEventListener('resize', compute)
    return () => {
      window.removeEventListener('scroll', compute)
      window.removeEventListener('resize', compute)
    }
  }, [])

  const fillHeight = Math.max(8, Math.min(100, (scrollY / Math.max(1, docHeight - viewport)) * 100))
  const activeFolio = FOLIOS[activeIndex] ?? FOLIOS[0]
  const nodeProgress = activeIndex / (FOLIOS.length - 1)
  const nowTop = `calc(${5 + nodeProgress * 90}% - 22px)`
  const style = {
    '--stitch-fill': `${fillHeight}%`,
    '--stitch-now-top': nowTop,
  } as CSSProperties

  return (
    <aside className={`folio-stitch folio-stitch--${voice}`} aria-label="Folio stitch" style={style}>
      <span className="sr-only">
        Reading folio {activeFolio.index} of {FOLIOS.length}: {activeFolio.label}. Press set in {VOICE_LABEL[voice]}, the mark is {WORD_LABEL[word]}.
      </span>
      <div className="folio-stitch__rule" aria-hidden="true">
        <span className="folio-stitch__rule-line" />
        <span className="folio-stitch__rule-fill" />
        <span className="folio-stitch__rule-bead" aria-hidden="true">
          <span className="folio-stitch__rule-bead-dot" />
        </span>
        <span className="folio-stitch__rule-cap folio-stitch__rule-cap--top" aria-hidden="true">
          <span aria-hidden="true">i</span>
          <span className="folio-stitch__rule-cap-tag">folio i</span>
        </span>
        <span className="folio-stitch__rule-cap folio-stitch__rule-cap--bot" aria-hidden="true">
          <span aria-hidden="true">viii</span>
          <span className="folio-stitch__rule-cap-tag">folio viii</span>
        </span>
        <ol className="folio-stitch__nodes">
          {FOLIOS.map((folio, index) => {
            const isActive = index === activeIndex
            const isPast = index < activeIndex
            return (
              <li
                key={folio.id}
                className={`folio-stitch__node ${isActive ? 'is-active' : ''} ${isPast ? 'is-past' : ''}`}
                style={{ '--node-i': index } as CSSProperties}
              >
                <span className="folio-stitch__node-pip" />
                <span className="folio-stitch__node-tick" />
              </li>
            )
          })}
        </ol>
        <span className="folio-stitch__now" aria-hidden="true">
          <span className="folio-stitch__now-folio">{activeFolio.index}</span>
          <span className="folio-stitch__now-mark">{activeFolio.label}</span>
        </span>
      </div>
      <span className="folio-stitch__press" aria-hidden="true">
        <span className="folio-stitch__press-eyebrow">the press is set in</span>
        <span className={`folio-stitch__press-voice folio-stitch__press-voice--${voice}`}>
          {VOICE_LABEL[voice]}
        </span>
        <span className="folio-stitch__press-word">the mark is {WORD_LABEL[word]}</span>
      </span>
    </aside>
  )
}