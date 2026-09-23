import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react'
import type { VoiceId } from './App'
import type { WordId } from './notes'

type SpecimenSheetProps = {
  voice: VoiceId
  word: WordId
  hover: WordId | null
  pullSignal: number
  setToday: string
  onSelect: (voice: VoiceId) => void
}

type VoiceProof = {
  voice: VoiceId
  letter: string
  name: string
  face: string
  sample: string
  marked: Record<WordId, string>
  lead: string
  tail: string
  family: string
  weight: number
  style: 'italic' | 'normal'
  tracking: string
  uppercased: boolean
  glyph: string
  markLabel: string
  markSub: string
  gloss: string
  rule: string
  sig: string
  toneVar: string
  width: string
}

const PROOFS: VoiceProof[] = [
  {
    voice: 'quiet',
    letter: 'A',
    name: 'quiet cut',
    face: 'serif · italic · close set',
    sample: 'is m³ good at frontend yet?',
    marked: { m3: 'm³', good: 'good at', yet: 'yet' },
    lead: 'is',
    tail: '?',
    family: "'Iowan Old Style', 'Palatino Linotype', Georgia, serif",
    weight: 400,
    style: 'italic',
    tracking: '-.022em',
    uppercased: false,
    glyph: '⌇',
    markLabel: 'stet',
    markSub: 'let it stand',
    gloss: 'the line, read so softly it never asks for attention',
    rule: 'a quiet line is a careful line',
    sig: 'quiet cut · iowan old style · italic',
    toneVar: 'var(--quiet)',
    width: '0.5fr',
  },
  {
    voice: 'human',
    letter: 'B',
    name: 'human hand',
    face: 'serif · italic · warm',
    sample: 'is M3 good at frontend yet?',
    marked: { m3: 'M3', good: 'good at', yet: 'yet' },
    lead: 'is',
    tail: '?',
    family: "'Iowan Old Style', 'Palatino Linotype', Georgia, serif",
    weight: 500,
    style: 'italic',
    tracking: '-.016em',
    uppercased: false,
    glyph: '∧',
    markLabel: 'caret',
    markSub: 'make room',
    gloss: 'the line as a hand might write it',
    rule: 'a small wobble makes the machine feel less like a machine',
    sig: 'human hand · iowan old style · italic · warm',
    toneVar: 'var(--human)',
    width: '1fr',
  },
  {
    voice: 'bold',
    letter: 'C',
    name: 'bold signal',
    face: 'sans · heavy · no apology',
    sample: 'IS M3 GOOD AT FRONTEND YET?',
    marked: { m3: 'M3', good: 'GOOD AT', yet: 'YET' },
    lead: 'IS',
    tail: '?',
    family: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
    weight: 800,
    style: 'normal',
    tracking: '-.05em',
    uppercased: true,
    glyph: '∴',
    markLabel: 'query',
    markSub: 'protect the pause',
    gloss: 'the line, shouted honestly',
    rule: 'say the whole thing once, in the loudest voice you can keep honest',
    sig: 'bold signal · inter · heavy',
    toneVar: 'var(--bold)',
    width: '0.5fr',
  },
]

const ORDER: VoiceId[] = ['quiet', 'human', 'bold']

const HEAD_PROOF_GLYPHS: Record<VoiceId, string> = {
  quiet: '⌇',
  human: '∧',
  bold: '∴',
}

type MarkedSegment = { text: string; marked: boolean }

function buildSegments(proof: VoiceProof, word: WordId): MarkedSegment[] {
  const fullText = proof.sample
  if (proof.voice === 'bold') {
    const target = proof.marked[word]
    const before = fullText.indexOf(target)
    if (before === -1) return [{ text: fullText, marked: false }]
    const segments: MarkedSegment[] = []
    if (before > 0) segments.push({ text: fullText.slice(0, before), marked: false })
    segments.push({ text: target, marked: true })
    if (before + target.length < fullText.length) {
      segments.push({ text: fullText.slice(before + target.length), marked: false })
    }
    return segments
  }
  const lower = fullText.toLowerCase()
  const target = proof.marked[word].toLowerCase()
  const before = lower.indexOf(target)
  if (before === -1) return [{ text: fullText, marked: false }]
  const segments: MarkedSegment[] = []
  if (before > 0) segments.push({ text: fullText.slice(0, before), marked: false })
  segments.push({ text: fullText.slice(before, before + target.length), marked: true })
  const after = before + target.length
  if (after < fullText.length) segments.push({ text: fullText.slice(after), marked: false })
  return segments
}

export function SpecimenSheet({ voice, word, hover, pullSignal, setToday, onSelect }: SpecimenSheetProps) {
  const baseId = useId().replace(/:/g, '')
  const [reducedMotion, setReducedMotion] = useState(false)
  const [strikeKey, setStrikeKey] = useState(0)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mq.matches)
    const onChange = () => setReducedMotion(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    setStrikeKey(k => k + 1)
  }, [pullSignal, voice])

  const activeId = hover ?? word
  const active = PROOFS.find(p => p.voice === voice)!
  const proofRefs = useRef<Partial<Record<VoiceId, HTMLButtonElement | null>>>({})

  useEffect(() => {
    const node = proofRefs.current[voice]
    if (!node || typeof window === 'undefined') return
    const active = document.activeElement
    if (active && (active === node || node.contains(active as Node))) {
      node.focus({ preventScroll: true })
    }
  }, [voice])

  const onProofKey = (event: ReactKeyboardEvent<HTMLButtonElement>, target: VoiceId) => {
    const index = ORDER.indexOf(target)
    let next: VoiceId | null = null
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault()
      next = ORDER[(index + 1) % ORDER.length]
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault()
      next = ORDER[(index - 1 + ORDER.length) % ORDER.length]
    } else if (event.key === 'Home') {
      event.preventDefault()
      next = ORDER[0]
    } else if (event.key === 'End') {
      event.preventDefault()
      next = ORDER[ORDER.length - 1]
    }
    if (next) {
      event.preventDefault()
      onSelect(next)
      window.requestAnimationFrame(() => proofRefs.current[next as VoiceId]?.focus())
    }
  }

  return (
    <figure
      className={`specimen-sheet specimen-sheet--${voice} ${reducedMotion ? 'is-quiet' : ''}`}
      aria-label={`The line set three ways, on one plate · now in ${active.name}`}
    >
      <svg className="specimen-sheet__defs" viewBox="0 0 1200 320" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id={`ss-rule-${baseId}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
            <stop offset="14%" stopColor="currentColor" stopOpacity=".55" />
            <stop offset="50%" stopColor="currentColor" stopOpacity=".82" />
            <stop offset="86%" stopColor="currentColor" stopOpacity=".55" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
          <linearGradient id={`ss-bed-${baseId}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(245, 238, 216, .035)" />
            <stop offset="100%" stopColor="rgba(8, 11, 22, .18)" />
          </linearGradient>
          <radialGradient id={`ss-warm-${baseId}`} cx="50%" cy="0%" r="60%">
            <stop offset="0%" stopColor="currentColor" stopOpacity=".18" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>

      <header className="specimen-sheet__head">
        <span className="specimen-sheet__eyebrow">
          <span className="specimen-sheet__eyebrow-mark" aria-hidden="true">¶</span>
          <em>folio i · the specimen</em>
          <span className="specimen-sheet__eyebrow-sep" aria-hidden="true">·</span>
          <em>one line · three voices · on one plate</em>
        </span>
        <span className="specimen-sheet__head-meta" aria-hidden="true">
          <span className="specimen-sheet__head-meta-rule" />
          <em>click any proof · arrow keys to cycle · set today</em>
          <span className="specimen-sheet__head-meta-date">{setToday}</span>
        </span>
      </header>

      <div className="specimen-sheet__plate" aria-hidden="true">
        <span className="specimen-sheet__plate-warm" />
        <span className="specimen-sheet__plate-rule specimen-sheet__plate-rule--top" />
        <span className="specimen-sheet__plate-rule specimen-sheet__plate-rule--bot" />

        <span className="specimen-sheet__corner specimen-sheet__corner--tl">
          <svg viewBox="0 0 14 14">
            <path d="M2 12 L2 2 L12 2" fill="none" stroke="currentColor" strokeWidth=".55" strokeLinecap="round" />
            <circle cx="2" cy="2" r="1" fill="currentColor" />
          </svg>
        </span>
        <span className="specimen-sheet__corner specimen-sheet__corner--tr">
          <svg viewBox="0 0 14 14">
            <path d="M12 12 L12 2 L2 2" fill="none" stroke="currentColor" strokeWidth=".55" strokeLinecap="round" />
            <circle cx="12" cy="2" r="1" fill="currentColor" />
          </svg>
        </span>
        <span className="specimen-sheet__corner specimen-sheet__corner--bl">
          <svg viewBox="0 0 14 14">
            <path d="M2 2 L2 12 L12 12" fill="none" stroke="currentColor" strokeWidth=".55" strokeLinecap="round" />
            <circle cx="2" cy="12" r="1" fill="currentColor" />
          </svg>
        </span>
        <span className="specimen-sheet__corner specimen-sheet__corner--br">
          <svg viewBox="0 0 14 14">
            <path d="M12 2 L12 12 L2 12" fill="none" stroke="currentColor" strokeWidth=".55" strokeLinecap="round" />
            <circle cx="12" cy="12" r="1" fill="currentColor" />
          </svg>
        </span>

        <span className="specimen-sheet__quoin specimen-sheet__quoin--l">
          <svg viewBox="0 0 28 220" preserveAspectRatio="none" aria-hidden="true">
            <path d="M2 6 L26 6 L22 18 L26 30 L22 42 L26 54 L22 66 L26 78 L22 90 L26 102 L22 114 L26 126 L22 138 L26 150 L22 162 L26 174 L22 186 L26 198 L2 198 Z" fill="rgba(245, 238, 216, .04)" stroke="rgba(245, 238, 216, .42)" strokeWidth=".55" />
            <line x1="6" y1="40" x2="22" y2="40" stroke="rgba(245, 238, 216, .42)" strokeWidth=".4" />
            <line x1="6" y1="80" x2="22" y2="80" stroke="rgba(245, 238, 216, .42)" strokeWidth=".4" />
            <line x1="6" y1="120" x2="22" y2="120" stroke="rgba(245, 238, 216, .42)" strokeWidth=".4" />
            <line x1="6" y1="160" x2="22" y2="160" stroke="rgba(245, 238, 216, .42)" strokeWidth=".4" />
            <circle cx="14" cy="11" r="1.1" fill="currentColor" />
            <circle cx="14" cy="192" r="1.1" fill="currentColor" />
          </svg>
        </span>
        <span className="specimen-sheet__quoin specimen-sheet__quoin--r">
          <svg viewBox="0 0 28 220" preserveAspectRatio="none" aria-hidden="true">
            <path d="M26 6 L2 6 L6 18 L2 30 L6 42 L2 54 L6 66 L2 78 L6 90 L2 102 L6 114 L2 126 L6 138 L2 150 L6 162 L2 174 L6 186 L2 198 L26 198 Z" fill="rgba(245, 238, 216, .04)" stroke="rgba(245, 238, 216, .42)" strokeWidth=".55" />
            <line x1="6" y1="40" x2="22" y2="40" stroke="rgba(245, 238, 216, .42)" strokeWidth=".4" />
            <line x1="6" y1="80" x2="22" y2="80" stroke="rgba(245, 238, 216, .42)" strokeWidth=".4" />
            <line x1="6" y1="120" x2="22" y2="120" stroke="rgba(245, 238, 216, .42)" strokeWidth=".4" />
            <line x1="6" y1="160" x2="22" y2="160" stroke="rgba(245, 238, 216, .42)" strokeWidth=".4" />
            <circle cx="14" cy="11" r="1.1" fill="currentColor" />
            <circle cx="14" cy="192" r="1.1" fill="currentColor" />
          </svg>
        </span>
      </div>

      <ol className="specimen-sheet__proofs" role="radiogroup" aria-label="Three voice proofs of the question">
        {PROOFS.map(proof => (
          <ProofSlip
            key={proof.voice}
            proof={proof}
            isActive={voice === proof.voice}
            word={word}
            activeId={activeId}
            onSelect={() => onSelect(proof.voice)}
            onKey={onProofKey}
            strikeKey={strikeKey}
            registerRef={node => {
              proofRefs.current[proof.voice] = node
            }}
          />
        ))}
      </ol>

      <footer className="specimen-sheet__foot">
        <span className="specimen-sheet__foot-rule" aria-hidden="true" />
        <em className="specimen-sheet__foot-line">
          <span className="specimen-sheet__foot-pin" aria-hidden="true">
            <svg viewBox="0 0 16 16">
              <circle cx="8" cy="8" r="6.4" fill="none" stroke="currentColor" strokeWidth=".55" />
              <circle cx="8" cy="8" r="2.6" fill="currentColor" />
              <circle cx="8" cy="8" r=".8" fill="var(--night)" />
            </svg>
          </span>
          now in <strong>{active.name}</strong> — three proofs, one plate, one question.
        </em>
        <span className="specimen-sheet__foot-rule" aria-hidden="true" />
      </footer>

      <span className="sr-only">
        The line set three ways · quiet cut {PROOFS[0].sample} · human hand {PROOFS[1].sample} · bold signal {PROOFS[2].sample}
      </span>
    </figure>
  )
}

function ProofSlip({
  proof,
  isActive,
  word,
  activeId,
  onSelect,
  onKey,
  strikeKey,
  registerRef,
}: {
  proof: VoiceProof
  isActive: boolean
  word: WordId
  activeId: WordId
  onSelect: () => void
  onKey: (event: ReactKeyboardEvent<HTMLButtonElement>, target: VoiceId) => void
  strikeKey: number
  registerRef: (node: HTMLButtonElement | null) => void
}) {
  const sampleStyle = {
    fontFamily: proof.family,
    fontWeight: proof.weight,
    fontStyle: proof.style,
    letterSpacing: proof.tracking,
    textTransform: proof.uppercased ? ('uppercase' as const) : ('none' as const),
  } as CSSProperties

  const style = {
    '--ss-proof-tone': proof.toneVar,
    '--ss-proof-flex': proof.width,
    '--ss-active-id': activeId,
  } as CSSProperties

  const segments = useMemo(() => buildSegments(proof, word), [proof, word])

  return (
    <li
      className={`specimen-sheet__proof specimen-sheet__proof--${proof.voice} ${isActive ? 'is-active' : ''}`}
      style={style}
    >
      <button
        type="button"
        role="radio"
        aria-checked={isActive}
        className="specimen-sheet__proof-btn"
        onClick={onSelect}
        onKeyDown={event => onKey(event, proof.voice)}
        tabIndex={isActive ? 0 : -1}
        ref={registerRef}
        aria-label={`${proof.letter} · ${proof.name} · ${proof.face} · ${proof.gloss}`}
      >
        <span className="specimen-sheet__proof-head" aria-hidden="true">
          <span className="specimen-sheet__proof-letter">{proof.letter}</span>
          <span className="specimen-sheet__proof-stack">
            <em className="specimen-sheet__proof-name">{proof.name}</em>
            <span className="specimen-sheet__proof-face">{proof.face}</span>
          </span>
          <span className="specimen-sheet__proof-glyph">{proof.glyph}</span>
        </span>

        <span className="specimen-sheet__proof-rule" aria-hidden="true">
          <svg viewBox="0 0 200 4" preserveAspectRatio="none">
            <line x1="2" y1="2" x2="198" y2="2" stroke="currentColor" strokeWidth=".5" strokeDasharray="1 3" />
          </svg>
        </span>

        <span className="specimen-sheet__proof-marked" aria-hidden="true">
          <em>marked at</em>
          <span>{proof.marked[word]}</span>
          <span className="specimen-sheet__proof-marked-mark">{HEAD_PROOF_GLYPHS[proof.voice]}</span>
        </span>

        <span className="specimen-sheet__proof-sample-wrap">
          <span className="specimen-sheet__proof-sample" style={sampleStyle}>
            {segments.map((seg, idx) => (
              <span
                key={`${proof.voice}-${idx}-${seg.text}`}
                className={`specimen-sheet__proof-seg ${seg.marked ? 'is-marked' : ''}`}
              >
                {seg.text}
              </span>
            ))}
          </span>
          <span className="specimen-sheet__proof-baseline" aria-hidden="true">
            <svg viewBox="0 0 240 2" preserveAspectRatio="none">
              <line x1="2" y1="1" x2="238" y2="1" stroke="currentColor" strokeWidth=".5" opacity=".55" />
            </svg>
          </span>
        </span>

        <span className="specimen-sheet__proof-gloss" aria-hidden="true">
          <em>{proof.gloss}</em>
        </span>

        <span className="specimen-sheet__proof-mark" aria-hidden="true">
          <span className="specimen-sheet__proof-mark-glyph">{proof.glyph}</span>
          <span className="specimen-sheet__proof-mark-stack">
            <em>{proof.markLabel}</em>
            <em className="specimen-sheet__proof-mark-sub">— {proof.markSub}</em>
          </span>
        </span>

        <span className="specimen-sheet__proof-rule" aria-hidden="true">
          <svg viewBox="0 0 200 4" preserveAspectRatio="none">
            <line x1="2" y1="2" x2="198" y2="2" stroke="currentColor" strokeWidth=".5" strokeDasharray="1 3" />
          </svg>
        </span>

        <footer className="specimen-sheet__proof-sig" aria-hidden="true">
          <span className="specimen-sheet__proof-sig-rule" />
          <em className="specimen-sheet__proof-sig-line">{proof.sig}</em>
          <span className="specimen-sheet__proof-sig-rule" />
        </footer>

        <span
          className={`specimen-sheet__proof-strike ${isActive ? 'is-active' : ''}`}
          key={`strike-${proof.voice}-${strikeKey}`}
          aria-hidden="true"
        />
      </button>

      {isActive && (
        <span className="specimen-sheet__proof-pin" aria-hidden="true">
          <svg viewBox="0 0 18 18">
            <circle cx="9" cy="9" r="7" fill="currentColor" opacity=".85" />
            <circle cx="9" cy="9" r="7" fill="none" stroke="var(--night)" strokeWidth=".4" />
            <circle cx="9" cy="9" r="2.4" fill="var(--night)" />
          </svg>
          <em>now on the page</em>
        </span>
      )}
    </li>
  )
}
