import type { CSSProperties } from 'react'
import { useFaceReading, type FaceReading, type Kind } from './faces'
import { RegisterEye } from './marks'
import { inRegister } from './pull'

type Scale =
  | 'claim'
  | 'specimen'
  | 'sub'
  | 'head'
  | 'read'
  | 'note'
  | 'fine'
  | 'label'
  | 'label2'
  | 'label3'

type Step = {
  /** the token that sets it, or the name of the size when there is no token */
  token: string
  /** the widest step of that size, which is the one the sample is set at */
  size: string
  /** the last cell of the furniture ladder is not type at all, it reads the blade */
  text?: string
  scale?: Scale
  live?: boolean
}

type Face = {
  id: string
  name: string
  kind: string
  /** which of the three families this is, for the measurement */
  measure: Kind
  role: string
  stack: string
  steps: Step[]
}

const ORDINALS = ['', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th']

/**
 * THE TYPE LIST.
 *
 * The last thing on the light sheet is the one thing the page has been claiming
 * all the way down: it is set in the grotesque, the serif and the mono, and it
 * is set in them on purpose. So the sheet ends by showing its work — three ruled
 * cells, each a short ladder of the sizes that face is actually used at, every
 * sample annotated with the token that sets it and the widest step of that
 * token. The samples are the machine's own faces, which is the argument:
 * nothing was loaded, and the sizes carry the voice instead.
 *
 * and each cell now reports the one fact nobody could have written down: what
 * this machine actually set it in. measured, cell by cell, at run time — see
 * `faces`. the chain is printed above the answer because the chain is the claim
 * and the answer is the proof, and on a machine with none of the six names on
 * it the cell says so instead of pretending.
 *
 * the one step this band does not print is the widest one on the page. the title
 * is set across the full measure, at a size no cell here could hold honestly,
 * and you have already read it. printing it again in a third of the width would
 * put a second poster in the middle of the sheet, and the page has exactly one
 * of those — at the very top — and exactly one more at the very bottom.
 *
 * the furniture cell is the only one that carries a moving figure. the gauge is
 * set in the face it is reporting on, so the readout and the letterforms that
 * print it are in the same rectangle, and there is no separate panel anywhere on
 * the page that says the number is live.
 */
const FACES: Face[] = [
  {
    id: 'press',
    name: 'the press',
    kind: 'grotesque',
    measure: 'sans',
    role: 'the question, the answer, every number',
    stack:
      '"Helvetica Neue", Helvetica, Arial, "Avenir Next", "Segoe UI", system-ui, sans-serif',
    /* deliberately not in ladder order: --head is a serif token and this is the
       grotesque cell, so the head is printed one cell over. a type list that
       listed a face's sizes out of order would be the one dishonest thing on a
       band whose whole job is to be a proof. */
    steps: [
      { token: '--claim', size: '4.3rem', text: 'yes —', scale: 'claim' },
      { token: '--specimen', size: '2.62rem', text: 'good at', scale: 'specimen' },
      { token: '--sub', size: '1.5rem', text: 'The pause, protected', scale: 'sub' },
    ],
  },
  {
    id: 'reading',
    name: 'the reading',
    kind: 'serif',
    measure: 'serif',
    role: 'the prose, and only the prose',
    stack: '"Iowan Old Style", "Palatino Linotype", Palatino, "Book Antiqua", Georgia, serif',
    steps: [
      { token: '--head', size: '3.2rem', text: 'Close read', scale: 'head' },
      { token: '--read', size: '1.22rem', text: 'Give it somewhere to land.', scale: 'read' },
      {
        token: 'the margin note',
        size: '.92rem',
        text: 'the sentence ends open; the page should not slam it shut',
        scale: 'note',
      },
      {
        token: 'the job ticket',
        size: '.95rem',
        text: 'local SVG and CSS only. no web fonts, no network',
        scale: 'fine',
      },
    ],
  },
  {
    id: 'furniture',
    name: 'the furniture',
    kind: 'mono',
    measure: 'mono',
    role: 'slugs, keys and figures — the labels, and only the labels',
    stack: 'ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace',
    steps: [
      { token: '--label', size: '.66rem', text: 'pick a phrase, or take the blade', scale: 'label' },
      { token: '--label-2', size: '.615rem', text: 'press proof · make ready', scale: 'label2' },
      { token: '--label-3', size: '.575rem', text: 'close read · 02 of 03', scale: 'label3' },
      { token: 'the gauge', size: 'as the blade sits', live: true },
    ],
  },
]

/** one line under each resolved name: how hard it was to get, and what it cost */
const receipt = (reading: FaceReading, face: Face) =>
  reading.fell
    ? `nothing in the chain is here · the platform's own ${face.measure}`
    : `${ORDINALS[reading.tried] ?? `${reading.tried}th`} of ${
        reading.chain.length
      } in the chain · measured, not asked for`

/**
 * The chain, in the order the sheet asked for it.
 *
 * The stack used to be printed here as the literal css it is written as: a
 * wrapped `font-family` string, quoted names and all, set at the same size as the
 * specimen it was annotating — which is both the ugliest thing on the sheet and
 * the least useful, because the question was never what the sheet hoped for. So
 * it now prints the families themselves, in order, with the one that actually
 * stuck in black and the rest in the muted tone.
 *
 * and when the chain fell all the way through, the generic the platform really
 * drew is put on the end — which is the honest reading of a bare box, and the
 * only place on the page where the answer is a face nobody asked for.
 */
const chainOf = (reading: FaceReading | null): string[] => {
  if (!reading) return []
  return reading.chain.includes(reading.resolved)
    ? reading.chain
    : [...reading.chain, reading.resolved]
}

export function TypeList({ reg }: { reg: number }) {
  const settled = inRegister(reg)

  return (
    <div className="type__body">
      <div className="type__grid">
        {FACES.map(face => {
          const reading = useFaceReading(face.stack, face.measure)
          const chain = chainOf(reading)
          return (
            <article className={`type__panel type__panel--${face.id} reveal`} key={face.id}>
              <header className="type__face">
                <h3 className="type__face-name">
                  {face.name}
                  <span className="type__face-kind">{face.kind}</span>
                </h3>
                <p className="type__face-role">{face.role}</p>
              </header>

              <ol className="type__steps">
                {face.steps.map((step, position) => (
                  <li
                    className={`type__step ${step.live ? 'type__step--live' : ''}`}
                    key={step.token}
                    style={{ '--i': position } as CSSProperties}
                  >
                    {step.live ? (
                      <p className="type__gauge" data-on={settled ? 'on' : 'off'}>
                        <RegisterEye className="type__eye" />
                        <span className="type__gauge-read">
                          {settled ? (
                            'in register'
                          ) : (
                            <>
                              {reg > 0 ? '+' : '−'}
                              {Math.abs(reg).toFixed(2)} off
                            </>
                          )}
                        </span>
                      </p>
                    ) : (
                      <p className={`type__sample type__sample--${step.scale}`}>{step.text}</p>
                    )}
                    <p className="type__note">
                      <span>{step.token}</span>
                      <span>{step.size}</span>
                    </p>
                  </li>
                ))}
              </ol>

              <footer className="type__panel-foot">
                {/* the chain the sheet asked for, and the one name in it that
                    stuck. nothing is downloaded, and this is the whole claim. */}
                <p className="type__chain">
                  <span className="type__chain-kicker">
                    <span aria-hidden="true">↳</span> the chain, as asked · no file loaded
                  </span>
                  <span className="type__chain-list">
                    {chain.length ? (
                      chain.map(name => (
                        <span
                          key={name}
                          className={name === reading?.resolved ? 'is-set' : undefined}
                        >
                          {name}
                        </span>
                      ))
                    ) : (
                      <span className="is-set">nothing measured here</span>
                    )}
                  </span>
                </p>
                <p className="type__resolved">
                  <span className="type__resolved-kicker">set in, on this machine</span>
                  {/* the answer is printed by the same three plates as everything
                      else on the sheet, at a quarter of the spread: a label this
                      small is set smaller, which is the page's own law applied to
                      a line that is new. */}
                  <span className="type__resolved-name" data-text={reading?.resolved ?? '—'}>
                    {reading?.resolved ?? '—'}
                  </span>
                  <span className="type__resolved-note">
                    {reading ? receipt(reading, face) : 'no canvas here to measure with'}
                  </span>
                </p>
              </footer>
            </article>
          )
        })}
      </div>
    </div>
  )
}
