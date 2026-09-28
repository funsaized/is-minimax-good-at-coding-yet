import type { CSSProperties } from 'react'
import { RegisterEye } from './marks'
import { inRegister } from './pull'

type Scale =
  | 'question'
  | 'claim'
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
  role: string
  stack: string
  steps: Step[]
}

/**
 * THE TYPE LIST.
 *
 * The last thing on the light sheet is the one thing the page has been claiming
 * all the way down: it is set in the grotesque, the serif and the mono, and it
 * is set in them on purpose. So the sheet ends by showing its work — a press
 * type list, three cells, each one a short ladder of the sizes that face is
 * actually used at, every sample annotated with the token that sets it and the
 * widest step of that token. The samples are the machine's own faces, which is
 * the argument: nothing was loaded, and the sizes carry the voice instead.
 *
 * And it is the only cell on the sheet that carries a moving figure. The gauge
 * is set in the furniture face, so the readout and the letterforms that print
 * it are in the same rectangle: while the blade is loose the number is loose
 * with it, and there is no separate panel anywhere on the page that says so.
 */
const FACES: Face[] = [
  {
    id: 'press',
    name: 'the press',
    kind: 'grotesque',
    role: 'the question, the answer, every number',
    stack:
      '"Helvetica Neue", Helvetica, Arial, "Avenir Next", "Segoe UI", system-ui, sans-serif',
    steps: [
      { token: '--question', size: '7.2rem', text: 'yet?', scale: 'question' },
      { token: '--claim', size: '4.3rem', text: 'yes —', scale: 'claim' },
      { token: '--sub', size: '1.5rem', text: 'The pause, protected', scale: 'sub' },
    ],
  },
  {
    id: 'reading',
    name: 'the reading',
    kind: 'serif',
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

export function TypeList({ reg }: { reg: number }) {
  const settled = inRegister(reg)

  return (
    <div className="type__body">
      <div className="type__grid">
        {FACES.map(face => (
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
              <p className="type__stack">{face.stack}</p>
              <p className="type__load">
                <span aria-hidden="true">↳</span> no file loaded
              </p>
            </footer>
          </article>
        ))}
      </div>

      <p className="type__foot">
        <span aria-hidden="true">↳</span>
        two poster sizes, three label tiers, and nothing in between louder than a section head
      </p>
    </div>
  )
}
