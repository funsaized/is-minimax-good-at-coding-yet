import { useEffect, useState, type CSSProperties } from 'react'

/**
 * THE COLUMN RAIL.
 *
 * The sheet prints its own armature: twelve equal columns, edge to edge, running
 * the height of every band. That is a good claim and it was never checked.
 * Iteration 504 said as much itself — a grid you can see is wallpaper — and then
 * stopped, because the ruling says nothing and the divisions were a private fact
 * between the stylesheet and whoever wrote it. Nobody reading this page could say
 * which columns a given band was set in, or where that band actually divides.
 *
 * So the armature is numbered at the head of every band, the way a press proof is
 * numbered: one figure to a column, set in the margin of its own track, so a
 * figure and the column it belongs to are the same x everywhere. Twelve of them,
 * in the furniture face at the finest tier, and in the blue this sheet prints
 * every measurement in — a column number is a measurement, and it is the first
 * one on the page that is about the page's own shape rather than about a phrase.
 *
 * AND IT REPORTS. The pink marks in the head of the row are the rules the band
 * being read is actually divided on, measured out of that band's own tracks
 * rather than written down here. That is the whole argument of the sheet turned
 * on the sheet: nothing on the rail is asserted, it is the layout answering a
 * question, and the only thing about it that moves is answered by the reader's
 * own position in the document. Below 1180 every band takes the full measure
 * undivided, and the rail says so with a dash.
 *
 * It is furniture and it carries no semantics. The bands it reports on are
 * already named by their own slugs and by the index in the bar, and what the
 * rail measures is said in plain words on the job ticket at the foot of the run.
 */

/** the armature, as a count — the same twelve the ruling prints */
const COLUMNS = 12

/** two figures, so a column number sits in a fixed box and twelve of them
 *  marching across the head of a band line up the way columns do */
const pad = (n: number) => String(n).padStart(2, '0')

const within = (n: number) => Math.min(COLUMNS, Math.max(1, n))

/**
 * The divisions a band prints, taken from its own tracks.
 *
 * Measured, not read out of a cascade. `getComputedStyle` on a grid-placement
 * property is specified-value behaviour on some engines and resolved-value
 * behaviour on others — `span 5` is a legal computed value and a legal resolved
 * one, and which one comes back is not something this page should depend on.
 *
 * So the tracks are measured. The page's own law is that a measurement is
 * printed in blue and never taken on trust, and the only honest source for
 * "which columns is this band set in" is the layout itself: the width of the
 * track divided into twelve gives the pitch, and the box of every child inside
 * it gives the columns that child actually occupies. Read this way the answer
 * cannot be wrong about `span`, cannot be wrong about `auto`, cannot be wrong
 * about what a media query did at this width, and cannot be left behind by
 * somebody editing the stylesheet — which a table of divisions would be within a
 * month.
 *
 * `data-split` is the one thing measurement cannot see: a track that draws a
 * division of its own instead of inheriting one from a track boundary. The
 * poster is the case in point — two halves of the measure with a rule on the
 * join, which is the boundary between column six and column seven and which no
 * child box reports because it belongs to the gap.
 *
 * And a child the grid never laid out is not a child to measure. The blade on
 * the top rule of the plate case is an absolutely positioned grid item: it is out
 * of flow, it is a third of the case wide, and its box says something about the
 * blade's position rather than about the armature. Anything taken out of flow is
 * skipped, which is the only way a grid child stops being a column.
 *
 * Column 1 and column 12 are dropped. Those are the trim edges of the type area
 * and the sheet already prints trim corners there; what is left is the set of
 * interior rules a band actually breaks on.
 */
const divisionsIn = (id: string): number[] => {
  const marks = new Set<number>()
  const band = document.getElementById(id)
  if (!band) return []

  band.querySelectorAll<HTMLElement>('[data-track]').forEach(track => {
    const own = track.dataset.split
    if (own) own.split(' ').map(Number).forEach(n => marks.add(within(n)))

    const frame = track.getBoundingClientRect()
    const pitch = frame.width / COLUMNS
    if (pitch <= 0) return

    for (const child of Array.from(track.children)) {
      if (getComputedStyle(child).position === 'absolute') continue
      const box = child.getBoundingClientRect()
      if (!box.width) continue
      marks.add(within(Math.round((box.left - frame.left) / pitch) + 1))
      marks.add(within(Math.round((box.right - frame.left) / pitch)))
    }
  })

  return [...marks].filter(n => n > 1 && n < COLUMNS).sort((a, b) => a - b)
}

const sameRun = (a: number[], b: number[]) =>
  a.length === b.length && a.every((n, i) => n === b[i])

/**
 * The divisions of whichever band is being read.
 *
 * Read after the first paint rather than during it, which is why the rail inks
 * itself in: the marks are the last thing on the sheet to arrive, and they arrive
 * in column order. Resize is the only other thing that can move a division —
 * it is the only thing that can change what the media queries left open, and it
 * is the only thing that can change the pitch the whole measure is divided by.
 *
 * The read is a few dozen boxes on a band boundary, not on a frame, and nothing
 * is written while it runs, so it costs one layout flush and no repaint.
 */
function useArmature(section: string): number[] {
  const [marks, setMarks] = useState<number[]>([])

  useEffect(() => {
    const read = () =>
      setMarks(found => {
        const next = divisionsIn(section)
        return sameRun(found, next) ? found : next
      })

    read()
    window.addEventListener('resize', read)
    return () => window.removeEventListener('resize', read)
  }, [section])

  return marks
}

export function ColumnRail({ section }: { section: string }) {
  const marks = useArmature(section)

  return (
    <div className="col-rail" aria-hidden="true">
      <ol className="col-rail__figs">
        {Array.from({ length: COLUMNS }, (_, i) => i + 1).map(n => (
          <li
            key={n}
            className="col-rail__fig"
            style={{ '--i': n - 1 } as CSSProperties}
            data-on={marks.includes(n) ? 'on' : 'off'}
          >
            {pad(n)}
          </li>
        ))}
      </ol>

      <p className="col-rail__slug">
        <span className="col-rail__slug-lead">armature · twelve columns</span>
        <span className="col-rail__slug-fact">
          divides at{' '}
          {marks.length ? (
            marks.map(n => (
              <span className="col-rail__n" key={n}>
                {pad(n)}
              </span>
            ))
          ) : (
            /* a band that takes the whole measure without breaking it is a real
               answer, and a dash is how a job ticket says so */
            <span className="col-rail__n">—</span>
          )}
        </span>
      </p>
    </div>
  )
}