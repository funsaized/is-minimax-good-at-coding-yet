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
 * AND IT REPORTS ON ITS OWN BAND. The pink marks in the head of the row are the
 * rules the rail is printed above, measured out of that band's own tracks rather
 * than written down here. Nothing on the rail is asserted: it is the layout
 * answering a question, and a band that takes the full measure undivided says so
 * with a dash.
 *
 * They used to be the rules of whichever band happened to be on screen, printed
 * into all four rails at once — so the rail above the question could report the
 * divisions of the type list, and did for as long as the reader stood in the type
 * list. Four identical rows of figures, every one of them lying about three of
 * the four bands it sat above, which is the one thing an instrument must not do.
 * Each rail now measures the band it heads, so it is right or it is not right
 * from the first paint.
 *
 * WHICH IS WHAT MAKES THE QUIET ONE POSSIBLE. Because a rail now knows its own
 * band, the page can tell which of the four the reader is standing in and print
 * that one at full ink. The other three keep every figure, every mark and the
 * whole caption — nothing is removed, because a rail that vanishes at a narrow
 * width is what this sheet has spent five hundred iterations refusing to do — but
 * they step back a single weight. The difference between an instrument on the
 * bench and four of them shouting over each other is about eight per cent of
 * opacity, and it is the difference between reading a page and measuring it.
 *
 * AND THE RAIL HAS THE WIDTH OF THE PAPER. It used to print twelve figures at
 * every width and then be deleted outright below nine hundred pixels, which is
 * the one thing a measuring instrument must never do: on a phone the sheet was
 * printing a four-column armature and the rail — the thing that says so — was
 * gone, so the reader was left looking at hairlines in a measure they could not
 * account for. The count is now read off the layout rather than assumed, the
 * same --cols the ruling prints and the same --cols the bands are ruled in, so
 * the figures on the rail and the lines on the sheet cannot come apart; and the
 * rail is never removed, because at four figures wide it is legible on a phone
 * and it is the only line on the sheet that tells the reader what they are
 * looking at.
 *
 * It is furniture and it carries no semantics. The bands it reports on are
 * already named by their own slugs and by the index in the bar, and what the
 * rail measures is said in plain words on the job ticket at the foot of the run.
 */

/** the armature the sheet falls back to before anything has been measured */
const COLUMNS = 12

/** two figures, so a column number sits in a fixed box and twelve of them
 *  marching across the head of a band line up the way columns do */
const pad = (n: number) => String(n).padStart(2, '0')

/**
 * How many columns this sheet is actually ruled in, read off the layout.
 *
 * `getComputedStyle` on a custom property hands back the token as it was written
 * — `--cols` comes back as the string `12`, and as `6` and `4` where the media
 * queries have taken it down — which is exactly the number the ruling's gradient
 * and the bands' tracks are both built from, so reading it is reading the
 * layout rather than reading a constant out of this file. A sheet before its
 * first paint, or one with no computed style at all, keeps the twelve the type
 * area is declared with.
 *
 * It is re-read whenever the band changes and on resize, and a ResizeObserver on
 * the body catches a change of width the two of them somehow missed. Nothing is
 * written while it runs, so it costs one style flush on a band boundary.
 */
const readArmature = (): number => {
  /* `--cols` is the one number the armature is built from: the bands' tracks are
     repeat(var(--cols), ...), the printed rule is a gradient one --cols-th of
     the width, and the rail prints a figure to a column. `getComputedStyle` on a
     custom property hands back the token as it was written, which is why reading
     it here is reading the layout rather than reading a constant out of this
     file — the media queries own the number, and a band whose own track list
     happens to collapse to one column at a narrow width says nothing about the
     armature the whole sheet is ruled in.

     A sheet before its first paint, or one with no computed style at all, keeps
     the twelve the type area is declared with. */
  const count = Number.parseInt(
    getComputedStyle(document.documentElement).getPropertyValue('--cols'),
    10,
  )
  return Number.isFinite(count) && count > 1 && count < 64 ? count : COLUMNS
}

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
 * track divided into the armature gives the pitch, and the box of every child
 * inside it gives the columns that child actually occupies. Read this way the
 * answer cannot be wrong about `span`, cannot be wrong about `auto`, cannot be
 * wrong about what a media query did at this width, and cannot be left behind by
 * somebody editing the stylesheet — which a table of divisions would be within a
 * month.
 *
 * And a child the grid never laid out is not a child to measure. The blade on
 * the top rule of the plate case is an absolutely positioned grid item: it is out
 * of flow, it is a third of the case wide, and its box says something about the
 * blade's position rather than about the armature. Anything taken out of flow is
 * skipped, which is the only way a grid child stops being a column.
 *
 * And a child the grid placed is a whole number of tracks wide, because the
 * armature has no gap in it — the gutter is padding inside the columns. That is
 * the test that keeps a max-width out of the answer. A margin note capped at
 * forty-four characters sits in one column and stops four hundred pixels along
 * the row, and its box lands near the sixth track by coincidence; the rail used
 * to report that as a division the band is not divided on, and on a narrow
 * screen it is the only division the band has, so it would have been the one
 * mark on the rail and it was never printed. A box that is not a whole number of
 * tracks is a box something else narrowed, and the rail says nothing about it.
 *
 * Column 1 and the last column are dropped. Those are the trim edges of the type
 * area and the sheet already prints trim corners there; what is left is the set
 * of interior rules a band actually breaks on.
 */
const divisionsIn = (id: string, count: number): number[] => {
  const marks = new Set<number>()
  const band = document.getElementById(id)
  if (!band) return []

  const within = (n: number) => Math.min(count, Math.max(1, n))

  band.querySelectorAll<HTMLElement>('[data-track]').forEach(track => {
    const frame = track.getBoundingClientRect()
    const pitch = frame.width / count
    if (pitch <= 0) return

    for (const child of Array.from(track.children)) {
      if (getComputedStyle(child).position === 'absolute') continue
      const box = child.getBoundingClientRect()
      if (!box.width) continue
      const first = within(Math.round((box.left - frame.left) / pitch) + 1)
      const last = within(Math.round((box.right - frame.left) / pitch))
      /* a whole number of tracks, to within a pixel — see the note above */
      if (Math.abs(box.width - (last - first + 1) * pitch) > 1.5) continue
      marks.add(first)
      marks.add(last)
    }
  })

  return [...marks].filter(n => n > 1 && n < count).sort((a, b) => a - b)
}

const sameRun = (a: number[], b: number[]) =>
  a.length === b.length && a.every((n, i) => n === b[i])

/**
 * The armature and the divisions of whichever band is being read.
 *
 * Read after the first paint rather than during it, which is why the rail inks
 * itself in: the marks are the last thing on the sheet to arrive, and they arrive
 * in column order. A resize is the only other thing that can move a division —
 * it is the only thing that can change what the media queries left open, and it
 * is the only thing that can change the pitch the whole measure is divided by.
 *
 * The read is a few dozen boxes, and it happens once per rail rather than once per
 * band boundary: a rail's answer is a property of the band it heads, so it does
 * not change when the reader walks from one band to the next. Nothing is written
 * while it runs, so it costs one layout flush and no repaint.
 */
function useArmature(id: string): { count: number; marks: number[] } {
  const [read, setRead] = useState<{ count: number; marks: number[] }>({
    count: COLUMNS,
    marks: [],
  })

  useEffect(() => {
    const run = () => {
      const count = readArmature()
      const marks = divisionsIn(id, count)
      setRead(found => (found.count === count && sameRun(found.marks, marks) ? found : { count, marks }))
    }

    run()
    window.addEventListener('resize', run)
    /* a rotated phone reports its width before the media queries have caught up
       on the first frame, and a rail that printed twelve figures on a sheet
       ruled in four is worse than a rail a moment late */
    const measure =
      typeof ResizeObserver === 'function' ? new ResizeObserver(run) : null
    if (measure && document.body) measure.observe(document.body)
    return () => {
      window.removeEventListener('resize', run)
      measure?.disconnect()
    }
  }, [id])

  return read
}

const SPELLED = ['no', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve']

/** the count as a job ticket writes it, and the fallback if it is ever past twelve */
const counted = (n: number) => SPELLED[n] ?? String(n)

/**
 * The armature, and the divisions of the band this rail is printed above.
 *
 * `id` is that band's own id, and it is the whole of the rail's claim: the marks
 * are measured out of `#id` and nothing else. `live` is a separate thing — which
 * of the four rails the reader is standing in — and it only decides how loudly
 * the row is printed, never what it says.
 */
export function ColumnRail({ id, live = false }: { id: string; live?: boolean }) {
  const { count, marks } = useArmature(id)

  return (
    <div className="col-rail" aria-hidden="true" data-live={live ? 'on' : 'off'}>
      <ol className="col-rail__figs">
        {Array.from({ length: count }, (_, i) => i + 1).map(n => (
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
        <span className="col-rail__slug-lead">armature · {counted(count)} columns</span>
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