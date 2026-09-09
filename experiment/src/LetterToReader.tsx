import type { MouseEvent } from 'react'

type VoiceId = 'quiet' | 'human' | 'bold'

type LetterToReaderProps = {
  voice: VoiceId
  onReadAnswer: (event: MouseEvent<HTMLAnchorElement>) => void
}

const SEAL_TONE: Record<VoiceId, string> = {
  quiet: 'var(--coral)',
  human: 'var(--coral)',
  bold: 'var(--acid)',
}

export function LetterToReader({ voice, onReadAnswer }: LetterToReaderProps) {
  const sealColor = SEAL_TONE[voice]
  return (
    <section className="letter section" id="note" aria-labelledby="letter-title">
      <div className="letter__sheet">
        <span className="letter__plate" aria-hidden="true">tipped slip · between ii &amp; iii</span>
        <span className="letter__crease letter__crease--v" aria-hidden="true" />
        <span className="letter__crease letter__crease--h" aria-hidden="true" />
        <span className="letter__dogeare" aria-hidden="true">
          <svg viewBox="0 0 36 36">
            <path d="M36 0 L0 36 L36 36 Z" fill="rgba(17,21,33,.08)" />
            <path d="M36 0 L0 36" stroke="rgba(17,21,33,.18)" strokeWidth=".8" fill="none" />
          </svg>
        </span>
        <span className="letter__pin" aria-hidden="true">
          <svg viewBox="0 0 60 60">
            <ellipse cx="30" cy="54" rx="9" ry="1.6" fill="rgba(0,0,0,.32)" />
            <circle cx="30" cy="28" r="18" fill={sealColor} />
            <circle cx="25" cy="23" r="5.5" fill="rgba(255,255,255,.42)" />
            <circle cx="34" cy="33" r="2.6" fill="rgba(0,0,0,.22)" />
            <text x="30" y="32" textAnchor="middle" fontFamily="Georgia, serif" fontStyle="italic" fontSize="10" fill={sealColor} opacity=".75">m³</text>
          </svg>
        </span>

        <header className="letter__head">
          <p className="eyebrow eyebrow--dark"><span className="eyebrow__line" />a folded note <em>before the proof</em></p>
          <h2 id="letter-title">A short letter <i>to the reader.</i></h2>
        </header>

        <div className="letter__body">
          <p className="letter__salute">Dear reader,</p>
          <p>
            This page is one attempt to set a question that does not sit still. Three words are marked because they earn the marginalia. Three voices are tried because typography is part of any honest answer. The rest is the small work of binding a page — by hand, with attention.
          </p>
          <p>
            If you came looking for a verdict, the verdict is the question itself: <em>yet</em> — which is to say, not yet fixed, still moving.
          </p>
          <p className="letter__sign">
            <span aria-hidden="true">—</span>
            <span>the editor</span>
          </p>
        </div>

        <footer className="letter__foot">
          <span className="letter__folio" aria-hidden="true">set today · for a careful reader</span>
          <a className="letter__cta" href="#answer" onClick={onReadAnswer}>
            <span>read the answer</span>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4 12h15M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </footer>
      </div>
    </section>
  )
}
