import type { VoiceId } from './Press'

type VoiceSelectorProps = {
  voice: VoiceId
  onSelect: (id: VoiceId) => void
  onKey: (event: React.KeyboardEvent<HTMLButtonElement>, id: VoiceId) => void
}

type VoiceEntry = {
  id: VoiceId
  letter: string
  name: string
  face: string
}

const VOICES: VoiceEntry[] = [
  { id: 'quiet', letter: 'A', name: 'quiet cut', face: 'serif · italic' },
  { id: 'human', letter: 'B', name: 'human hand', face: 'serif · warm' },
  { id: 'bold', letter: 'C', name: 'bold signal', face: 'sans · heavy' },
]

export function VoiceSelector({ voice, onSelect, onKey }: VoiceSelectorProps) {
  return (
    <div className="hero__voice-line" role="tablist" aria-label="Choose a typographic voice">
      <span className="hero__voice-line-eyebrow" aria-hidden="true">
        <span className="hero__voice-line-eyebrow-mark" />
        set the press in
      </span>
      <ol className="hero__voice-line-list">
        {VOICES.map((entry, index) => {
          const isActive = entry.id === voice
          return (
            <li key={entry.id} className={`hero__voice-line-item ${isActive ? 'is-active' : ''}`}>
              <button
                type="button"
                className={`hero__voice-line-button hero__voice-line-button--${entry.id}`}
                onClick={() => onSelect(entry.id)}
                onKeyDown={event => onKey(event, entry.id)}
                role="tab"
                aria-selected={isActive}
                tabIndex={isActive ? 0 : -1}
              >
                <span className="hero__voice-line-bullet" aria-hidden="true">
                  <span className="hero__voice-line-bullet-dot" />
                  <span className="hero__voice-line-bullet-ring" />
                </span>
                <span className="hero__voice-line-letter" aria-hidden="true">{entry.letter}</span>
                <span className="hero__voice-line-name">{entry.name}</span>
                <span className="hero__voice-line-face">{entry.face}</span>
              </button>
              {index < VOICES.length - 1 && (
                <span className="hero__voice-line-divider" aria-hidden="true">
                  <svg viewBox="0 0 16 18" preserveAspectRatio="none">
                    <path d="M2 2 C 10 6, 6 12, 14 16" fill="none" stroke="currentColor" strokeWidth=".6" />
                  </svg>
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </div>
  )
}