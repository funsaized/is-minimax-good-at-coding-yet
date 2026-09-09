import { useEffect, useRef, useState } from 'react'
import { NOTES, type WordId } from './notes'

export type VoiceId = 'quiet' | 'human' | 'bold'

type PressBayProps = {
  voice: VoiceId
  word: WordId
  onVoice: (voice: VoiceId) => void
}

const VOICE_ORDER: VoiceId[] = ['quiet', 'human', 'bold']

const NEXT_VOICE: Record<VoiceId, VoiceId> = {
  quiet: 'human',
  human: 'bold',
  bold: 'quiet',
}

const VOICE_LABEL: Record<VoiceId, string> = {
  quiet: 'quiet cut',
  human: 'human hand',
  bold: 'bold signal',
}

const VOICE_FACE: Record<VoiceId, string> = {
  quiet: 'serif · italic · close set',
  human: 'serif · italic · warm',
  bold: 'sans · heavy · no apology',
}

const VOICE_LETTER: Record<VoiceId, string> = {
  quiet: 'A',
  human: 'B',
  bold: 'C',
}

const VOICE_LINES: Record<VoiceId, [string, string, string]> = {
  quiet: ['is Minimax', 'good at frontend', 'yet?'],
  human: ['is M3', 'good at frontend', 'yet?'],
  bold: ['IS', 'GOOD AT', 'FRONTEND YET?'],
}

const PROOF_LABEL: Record<WordId, string> = {
  m3: 'stet',
  good: 'caret',
  yet: 'query',
}

type PressLeverProps = {
  voice: VoiceId
  pulling: boolean
  onPull: () => void
}

function PressLever({ voice, pulling, onPull }: PressLeverProps) {
  return (
    <div className="press-bay__lever-set">
      <span className="press-bay__lever-cage" aria-hidden="true">
        <span className="press-bay__lever-cage-rail press-bay__lever-cage-rail--left" />
        <span className="press-bay__lever-cage-rail press-bay__lever-cage-rail--right" />
        <span className="press-bay__lever-cage-cap" />
      </span>
      <button
        type="button"
        className={`press-bay__lever press-bay__lever--${voice} ${pulling ? 'is-pulling' : ''}`}
        onClick={onPull}
        aria-label={`Pull the composing lever. The current press is set in the ${VOICE_LABEL[voice]} voice. Pulling cycles to the next pressing.`}
      >
        <span className="press-bay__lever-pull" aria-hidden="true">pull</span>
        <span className="press-bay__lever-handle" aria-hidden="true">
          <span className="press-bay__lever-knob" />
          <span className="press-bay__lever-knob-shadow" />
          <span className="press-bay__lever-knob-highlight" />
          <span className="press-bay__lever-knob-band" />
        </span>
        <span className="press-bay__lever-stem" aria-hidden="true">
          <span className="press-bay__lever-stem-rail" />
          <span className="press-bay__lever-stem-pin" />
        </span>
      </button>
      <span className="press-bay__lever-base" aria-hidden="true">
        <svg viewBox="0 0 92 92">
          <circle cx="46" cy="46" r="42" fill="none" stroke="currentColor" strokeWidth="1.1" />
          <circle cx="46" cy="46" r="34" fill="none" stroke="currentColor" strokeWidth=".5" strokeDasharray="2 3" />
          <circle cx="46" cy="46" r="22" fill="none" stroke="currentColor" strokeWidth=".4" opacity=".5" />
          <text x="46" y="52" textAnchor="middle" fontFamily="Georgia, serif" fontStyle="italic" fontSize="22" fill="currentColor">m³</text>
          <text x="46" y="20" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="4.6" letterSpacing="2.2" fill="currentColor" opacity=".7">PRESS · BAY</text>
          <text x="46" y="84" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="4.6" letterSpacing="2.2" fill="currentColor" opacity=".7">FOLIO · I</text>
          <path d="M14 46h6M72 46h6" stroke="currentColor" strokeWidth=".6" opacity=".55" />
        </svg>
      </span>
      <span className="press-bay__lever-shadow" aria-hidden="true" />
    </div>
  )
}

export function PressBay({ voice, word, onVoice }: PressBayProps) {
  const [pulling, triggerPull] = useStateFlag(180)
  const note = NOTES.find(n => n.id === word) ?? NOTES[0]
  const activeIndex = Math.max(0, NOTES.findIndex(n => n.id === word))
  const nextVoice = NEXT_VOICE[voice]
  const nextLines = VOICE_LINES[nextVoice]
  const voiceIndex = VOICE_ORDER.indexOf(voice)
  const stateLabel = pulling ? 'lever pulled' : 'lever at rest'

  const pull = () => {
    triggerPull(true)
    onVoice(NEXT_VOICE[voice])
  }

  return (
    <aside className={`press-bay press-bay--${voice} press-bay--word-${word}`} aria-label="The composing press">
      <header className="press-bay__head">
        <span className="press-bay__tag">
          <span className="press-bay__tag-dot" aria-hidden="true" />
          press bay
          <span className="press-bay__tag-sep" aria-hidden="true">·</span>
          folio i
        </span>
        <span className="press-bay__state" aria-live="polite">{stateLabel}</span>
      </header>

      <div className="press-bay__now">
        <span className="press-bay__now-eyebrow">the press is set in</span>
        <span className="press-bay__now-letter" aria-hidden="true">{VOICE_LETTER[voice]}</span>
        <span className="press-bay__now-name">{VOICE_LABEL[voice]}</span>
        <span className="press-bay__now-face">{VOICE_FACE[voice]}</span>
        <span className="press-bay__now-count" aria-hidden="true">
          {VOICE_ORDER.map((id, index) => (
            <span key={id} className={`press-bay__now-pip ${id === voice ? 'is-on' : ''}`}>
              {index < VOICE_ORDER.length - 1 && <span className="press-bay__now-pip-line" aria-hidden="true" />}
            </span>
          ))}
        </span>
      </div>

      <div className="press-bay__impression" aria-label="The next impression on the press">
        <span className="press-bay__impression-bar" aria-hidden="true">
          <span className="press-bay__impression-bar-line" />
          <span className="press-bay__impression-bar-text">next impression</span>
          <span className="press-bay__impression-bar-line" />
        </span>
        <div className={`press-bay__impression-card press-bay__impression-card--${nextVoice}`}>
          <span className="press-bay__impression-card-fold" aria-hidden="true" />
          <span className="press-bay__impression-card-corner press-bay__impression-card-corner--tl" aria-hidden="true" />
          <span className="press-bay__impression-card-corner press-bay__impression-card-corner--tr" aria-hidden="true" />
          <span className="press-bay__impression-card-corner press-bay__impression-card-corner--bl" aria-hidden="true" />
          <span className="press-bay__impression-card-corner press-bay__impression-card-corner--br" aria-hidden="true" />
          <span className="press-bay__impression-letter" aria-hidden="true">{VOICE_LETTER[nextVoice]}</span>
          <span className={`press-bay__impression-type press-bay__impression-type--${nextVoice}`} aria-hidden="true">
            <span>{nextLines[0]}</span>
            <span>{nextLines[1]}</span>
            <span>{nextLines[2]}</span>
          </span>
          <span className="press-bay__impression-foot">
            <span className="press-bay__impression-foot-meta">
              <span className="press-bay__impression-foot-label">pressing</span>
              <span className="press-bay__impression-foot-num">{String(voiceIndex + 2).padStart(2, '0')}/03</span>
            </span>
            <button
              type="button"
              className="press-bay__impression-swap"
              onClick={() => onVoice(nextVoice)}
              aria-label={`Set the press to the ${VOICE_LABEL[nextVoice]} voice now`}
            >
              <span>swap to {VOICE_LABEL[nextVoice]}</span>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 12h15M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </span>
        </div>
      </div>

      <div className="press-bay__lever-zone" aria-label="The composing lever">
        <span className="press-bay__lever-eyebrow" aria-hidden="true">
          <span className="press-bay__lever-eyebrow-line" />
          pull to cycle the press
          <span className="press-bay__lever-eyebrow-line" />
        </span>
        <PressLever voice={voice} pulling={pulling} onPull={pull} />
        <span className="press-bay__lever-hint" aria-hidden="true">click · or use <kbd>shift</kbd>+<kbd>v</kbd></span>
      </div>

      <div className="press-bay__plate" aria-live="polite">
        <span className="press-bay__plate-bar" aria-hidden="true">
          <span className="press-bay__plate-bar-line" />
          <span className="press-bay__plate-bar-text">on the plate</span>
          <span className="press-bay__plate-bar-line" />
        </span>
        <span className="press-bay__plate-row">
          <span className="press-bay__plate-mark">{PROOF_LABEL[word]}</span>
          <span className="press-bay__plate-label">{note.label}</span>
          <span className="press-bay__plate-folio" aria-hidden="true">№ {String(activeIndex + 1).padStart(2, '0')}</span>
        </span>
        <span className="press-bay__plate-gloss">“{note.gloss}”</span>
        <span className="press-bay__plate-prompt">{note.prompt}</span>
      </div>

      <div className="press-bay__rule" aria-label="The three marked words in reading order">
        <span className="press-bay__rule-line" />
        {NOTES.map((n, index) => (
          <span
            key={n.id}
            className={`press-bay__rule-node press-bay__rule-node--${n.id} ${word === n.id ? 'is-active' : ''}`}
            aria-hidden="true"
          >
            <span className="press-bay__rule-pip" />
            <span className="press-bay__rule-num">{String(index + 1).padStart(2, '0')}</span>
          </span>
        ))}
        <span className="press-bay__rule-line" />
      </div>
    </aside>
  )
}

function useStateFlag(durationMs: number) {
  const [flag, setFlag] = useState(false)
  const timer = useRef<number | null>(null)
  useEffect(() => () => {
    if (timer.current !== null) window.clearTimeout(timer.current)
  }, [])
  function trigger(next: boolean) {
    if (timer.current !== null) window.clearTimeout(timer.current)
    setFlag(next)
    if (next) {
      timer.current = window.setTimeout(() => setFlag(false), durationMs)
    }
  }
  return [flag, trigger] as const
}
