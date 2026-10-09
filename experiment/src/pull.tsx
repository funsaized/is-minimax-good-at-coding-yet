import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from 'react'
import { prefersStill } from './motion'
import { RegisterEye, Squeegee } from './marks'

/* what the press itself answers to. these are printed on the bed rather than
   printed next to the proof, because the bed is the only one of the two the
   reader is already looking at when they wonder what the keys do. */
const SHORTCUTS = [
  { keys: ['1', '2', '3'], label: 'put a plate up' },
  { keys: ['←', '→'], label: 'nudge the blade' },
  { keys: ['0'], label: 'snap to the gate' },
] as const

/* the plate offset, in the page's own unit: 0 is a perfect register */
export const PULL_MIN = -3
export const PULL_MAX = 3
export const PULL_REST = 1
export const PULL_GATE = 0.14
/* a misregistration you cannot see is a decoration, not a fault: the page has to
   open with the plates plainly apart, so a unit of blade is worth 3px of sheet */
export const PULL_RAMP = 3

/* THE LOUP[E] SPREADS THE ERROR, BUT IT DOES NOT UNREAD THE SENTENCE.

   the reach used to be .6 of the type size, which is not a misregistration at
   all — it is a second copy of every line laid on top of the first, and three of
   them at that. out at the loose end of the bed the film was a heap of
   overlapping letters: the one instrument on the sheet that shows the reader
   what the plates are doing was the only object on the page you could not read.
   and it was in that state when the page opened.

   so the reach is a fringe rather than a copy — about a seventh of the type,
   which is what ink spread at the edge of a letter actually looks like under a
   loupe — and the colour plates thin out as they wander, because a plate that is
   not where it belongs is a plate that is not printing much. the black keeps the
   words; the pink and the blue keep the argument about them. at the gate the
   fringe is zero and there is one voice, which is the same reward as before. */
const FILM_REACH = 0.145
/* and how far a wandering plate gives up its ink, which is what makes the fringe
   read as the edge of a stroke instead of as a whole second sentence */
const FILM_THIN = 0.52
/* the blue plate is cut a little under the pink, which is why the fringes read uneven */
const BLUE_RATIO = 0.62

const PAPER_TOP = '#f5f0e5'
const PAPER_BOTTOM = '#e3dbc7'
const INK_BLACK = '#15141b'
const INK_PINK = '#ff2e6b'
const INK_BLUE = '#2a3ec9'

/* the film is the poster, reduced: three lines on the same three rules, so the
   loupe is a reduction of the thing it is a loupe of rather than a second setting
   of the sentence that happens to fit in a strip. the mark is held out of the
   lines because on this sheet the mark is always the pink plate. */
const FILM_LINES = ['is Minimax M3', 'good at', 'frontend']
const FILM_MARK = '?'
const FILM_STACK =
  '"Helvetica Neue", Helvetica, Arial, "Avenir Next", "Segoe UI", system-ui, sans-serif'

/* THE OTHER HALF OF THE PLATE.

   the film was the poster reduced and the poster alone, and a plate is not a
   quarter of a sheet: it is the whole sheet. so the second poster is printed on
   the other side of the gate — the short answer, set at the step below the
   question because that is the step it is set at everywhere else on this page,
   and standing hard against the fore-edge because the question stands hard
   against the head edge. two masses, one gate, and a measure of air between
   them that is the same air the specimen on the sheet above is set in.

   and the answer does not misregister. it does not on the proof sheet, at the
   foot of the run, or in the bed's own readout, because it is the one sentence
   this press is allowed to get right — so on the film it is printed in black
   and one voice while the question beside it comes apart, which is what makes
   the arrival of the blade legible as the moment two sheets become one. */
const FILM_ANSWER = [
  { text: 'When the interface', voice: 'press' },
  { text: 'has a point of view', voice: 'press' },
  { text: 'you can feel,', voice: 'pink' },
  { text: 'and it knows when to stop moving.', voice: 'reading' },
] as const
const FILM_SERIF = '"Iowan Old Style", "Palatino Linotype", Palatino, Georgia, serif'
/* the ratio the sheet's own scale ladder gives the answer to the question —
   --claim over --question. the film prints it rather than picking a size that
   happens to fit, so the plate shows the same hierarchy the page sets. */
const FILM_ANSWER_RATIO = 0.6

/** where the coloured plates sit on the page, in css pixels */
export const plateOffset = (reg: number) => ({
  x: reg * PULL_RAMP,
  y: reg * PULL_RAMP * 0.46,
})

export const inRegister = (reg: number) => Math.abs(reg) <= PULL_GATE

const clamp = (value: number) => Math.min(PULL_MAX, Math.max(PULL_MIN, value))

/** the gate is magnetic: a blade released inside it is caught, not left hovering */
export const snapPull = (value: number) => (inRegister(value) ? 0 : clamp(value))

/* HOW WIDE THE GATE REACHES, and how hard it pulls.

   A gate is not sticky, it is magnetic: it takes the blade as the blade comes
   near, so the last fraction of a unit is where the press does most of its work.
   The old bed only caught the blade on release, which meant the reader dragged
   the whole width of the strip, watched the colour stay apart right up to the
   last pixel, and was then handed the reward all at once at the end of a gesture
   — a switch, rather than a press.

   So the bed now pulls while the drag is still live, over a band four times
   wider than the gate itself, and the page goes into register underneath the
   reader's hand about a third of a unit out. That is the moment the whole sheet
   is built around: the fringes close, the traps fill, the flats fuse and the
   lamp tightens, all while the blade is still moving.

   The curve is (distance / reach) raised to a power, which is continuous and
   flat at the edge of the band — nothing lurches when the magnet lets go, and a
   blade a long way from the gate is exactly as stiff as it always was. The
   power is above one so the magnet holds off through the middle of the approach
   and then takes the blade quickly at the end, which is what a magnet does. */
const MAGNET = 0.6
const MAGNET_CURVE = 2.6

const magnetic = (raw: number) => {
  const distance = Math.abs(raw)
  if (distance > MAGNET) return raw
  return raw * (distance / MAGNET) ** MAGNET_CURVE
}

/** the print-shop reading of an offset, in words */
export const registerText = (reg: number) =>
  inRegister(reg)
    ? 'in register'
    : `off register, ${reg > 0 ? 'plus' : 'minus'} ${Math.abs(reg).toFixed(2)}`

const unitFor = (width: number) => (width / (PULL_MAX * 2)) * 0.92

/**
 * How far the film shows the plates apart.
 *
 * The film magnifies the error, not the position: outside the gate the offset is
 * stretched out so a third of a unit is plainly a third of a unit, and inside the
 * gate it is exactly zero. The curve is eased so the loose end of the bed opens
 * up loud and the last fraction of a unit is the quiet part — the part the gate
 * takes. So the strip agrees with the page the instant the page does: one clean
 * voice, printed three times.
 */
const magnify = (reg: number) => {
  const out = (Math.abs(reg) - PULL_GATE) / (PULL_MAX - PULL_GATE)
  const eased = Math.pow(Math.min(1, Math.max(0, out)), 0.62)
  return Math.sign(reg) * eased
}

/** a six-pixel halftone tile, generated once and reused as a fill pattern */
const makeScreen = () => {
  const tile = document.createElement('canvas')
  tile.width = 6
  tile.height = 6
  const dot = tile.getContext('2d')
  if (dot) {
    dot.fillStyle = '#15141b'
    for (const [x, y] of [
      [1.5, 1.5],
      [4.5, 4.5],
    ] as const) {
      dot.beginPath()
      dot.arc(x, y, 0.95, 0, Math.PI * 2)
      dot.fill()
    }
  }
  return tile
}

/* how long the ink the blade lays down stays wet, and how many of the last
   points of the path the strip is willing to remember. a squeegee does not
   travel without printing: it puts a band of ink the width of its own path on
   the sheet, and that band dries. so the strip keeps a short tail of the
   gesture rather than only the position, and the reader can see the way they
   came. two and a half seconds is about as long as newsprint stays tacky. */
const WET_MS = 2500
const WET_MAX = 140
/* and how long the gate takes to take it back off. the blade that reaches the
   gate does not stop printing — it wipes, which is what a squeegee is for. */
const WIPE_MS = 620

/* =============================================================
   THE BLADE HAS MASS.

   A squeegee is not a cursor. It is a bar of rubber on a handle being
   pushed across a bed of wet ink, and when a reader lets go of one it
   does not stop dead at the pixel they released it on — it carries,
   and the bed takes the speed out of it.

   So the bed keeps the speed the drag was going at and coasts on it when
   the pointer lifts: a fraction of a second of travel measured in
   friction rather than in milliseconds, so the machine has one damping
   constant instead of a duration per gesture. What carries is the raw
   position, and the magnet is applied to it afterwards — the same order
   the drag uses, so the blade bends toward the gate on the way down
   exactly as it does under a hand, and a flick that would have sailed
   past the gate is taken by it on the way through rather than being
   handed the reward at the end of the gesture.

   It is capped hard. A pointer can cross the whole strip in three frames
   and the number that comes out of that is thirty units a second, which
   would throw the blade off the end of the bed and read as a bug rather
   than as weight. Four units is about a third of the bed of travel on a
   hard flick, which is what a bar of rubber on newsprint actually does.

   And a reader who has asked for stillness gets none of it: the coast
   is the one thing on this page that is motion rather than position, so
   for them the blade is simply caught, where it was released, by the
   same line of code that caught it before the mass was added.
   ============================================================= */
const FRICTION = 0.08
const FLICK = 4
const STOP_SPEED = 0.05

type Wet = { x: number; t: number }

/**
 * The press bed. A squeegee blade rides on a strip of wet ink, and the black,
 * fluorescent pink and federal blue plates are all laid down at whatever offset
 * the blade is sitting at.
 *
 * The strip is not a diagram of the offset — it is the sentence. The film prints
 * the very same lines the title prints, at film size and under a loupe: the
 * plates are split while the blade is loose, and they close onto one clean voice
 * the moment the gate catches it. Everything the strip does, the page does too.
 *
 * and the blade now has a memory. it used to report one position and nothing
 * else, so a drag across a thousand pixels of wet ink left the sheet exactly as
 * clean as it found it — which is not what a squeegee does. the strip now keeps
 * the last couple of seconds of the gesture and prints it as a band of ink that
 * dries from the far end back, so the reader can see the road the blade took,
 * and the gate takes the band back off again: the ink goes outward from the blade
 * and there is nothing left behind it. that is the reward for registering, and
 * it is the only one on the page that is a thing the reader physically did.
 */
export function PullBed({
  reg,
  onSlide,
}: {
  reg: number
  onSlide: (value: number) => void
}) {
  const bedRef = useRef<HTMLDivElement>(null)
  const stripRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const screenRef = useRef<CanvasPattern | null>(null)
  const paintRef = useRef<() => void>(() => {})
  const draggingRef = useRef(false)
  const unitRef = useRef(0)
  const [unit, setUnit] = useState(120)
  const [dragging, setDragging] = useState(false)
  /* the blade is still travelling after the hand has come off it, which is not
     the same thing as a hand being on it — so it is its own flag, and the bar
     complains about the carry rather than about the drag */
  const [coasting, setCoasting] = useState(false)
  const settled = inRegister(reg)

  /* --- the wet trail, on its own canvas so the film underneath never repaints --- */

  const trailRef = useRef<HTMLCanvasElement>(null)
  const wetRef = useRef<Wet[]>([])
  const wipeRef = useRef(-1)
  const loopRef = useRef(0)
  const wetPaintRef = useRef<() => void>(() => {})
  const settledRef = useRef(settled)
  settledRef.current = settled

  const paintWet = useCallback(() => {
    const canvas = trailRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    const rect = canvas.getBoundingClientRect()
    const w = Math.max(1, Math.round(rect.width))
    const h = Math.max(1, Math.round(rect.height))
    const ratio = Math.min(2.5, window.devicePixelRatio || 1)
    const pixels = Math.round(w * ratio)
    const rows = Math.round(h * ratio)
    if (canvas.width !== pixels || canvas.height !== rows) {
      canvas.width = pixels
      canvas.height = rows
    }
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0)
    ctx.clearRect(0, 0, w, h)
    ctx.globalAlpha = 1

    const now = performance.now()
    const wet = wetRef.current
    while (wet.length && now - wet[0].t > WET_MS) wet.shift()

    /* the wipe is measured outward from the gate rather than from the newest
       point, because the newest point is the blade and the blade is what does
       the taking. an inch of the band on either side of the gate is the last to
       go, which is what a squeegee leaves behind it. */
    const gateX = Math.round(w / 2) + 0.5
    let cleared = 0
    if (wipeRef.current >= 0) {
      const run = (now - wipeRef.current) / WIPE_MS
      if (run >= 1) {
        wet.length = 0
        wipeRef.current = -1
        return
      }
      cleared = Math.max(0, run) * (w / 2 + 60)
    }

    const live = cleared ? wet.filter(point => Math.abs(point.x - gateX) > cleared) : wet
    if (live.length !== wet.length) {
      wet.length = 0
      for (const point of live) wet.push(point)
    }
    if (live.length < 2) return

    /* the band: heaviest just above the middle, where the film is printed, and
       feathered at both edges so it is ink soaking into stock and not a bar */
    const band = ctx.createLinearGradient(0, 0, 0, h)
    band.addColorStop(0, 'rgba(20, 19, 26, 0)')
    band.addColorStop(.34, 'rgba(20, 19, 26, .1)')
    band.addColorStop(.56, 'rgba(20, 19, 26, .2)')
    band.addColorStop(1, 'rgba(20, 19, 26, 0)')

    ctx.fillStyle = band
    for (let i = 1; i < live.length; i += 1) {
      const age = (now - live[i].t) / WET_MS
      ctx.globalAlpha = Math.max(0, 1 - age) ** 1.5
      if (ctx.globalAlpha < .012) continue
      ctx.fillRect(
        Math.min(live[i - 1].x, live[i].x),
        0,
        Math.max(1, Math.abs(live[i].x - live[i - 1].x) + .6),
        h,
      )
    }
    ctx.globalAlpha = 1

    /* and the bead of ink still standing up on the face of the blade, which is
       the only part of the band that is pink: it has not had time to soak in */
    const head = live[live.length - 1]
    const fresh = 1 - Math.min(1, (now - head.t) / (WET_MS * .45))
    if (fresh > .02 && wipeRef.current < 0) {
      const r = Math.max(7, unitFor(w) * .36)
      const bead = ctx.createRadialGradient(head.x, h / 2, 0, head.x, h / 2, r)
      bead.addColorStop(0, `rgba(255, 46, 107, ${(.32 * fresh).toFixed(3)})`)
      bead.addColorStop(1, 'rgba(255, 46, 107, 0)')
      ctx.fillStyle = bead
      ctx.fillRect(head.x - r, h / 2 - r, r * 2, r * 2)
    }
  }, [])
  wetPaintRef.current = paintWet

  /* the loop only runs while there is something wet on the sheet, so a reader
     who never touches the bed pays nothing for it at all */
  const startLoop = useCallback(() => {
    if (loopRef.current) return
    const tick = () => {
      loopRef.current = 0
      wetPaintRef.current()
      if (wetRef.current.length >= 2 || wipeRef.current >= 0) {
        loopRef.current = requestAnimationFrame(tick)
      }
    }
    loopRef.current = requestAnimationFrame(tick)
  }, [])

  useEffect(
    () => () => {
      if (loopRef.current) cancelAnimationFrame(loopRef.current)
      loopRef.current = 0
    },
    [],
  )

  /* the drag prints. the blade only lays ink while it is loose: once the gate
     has caught it the sheet is clean and stays clean until it is moved again.
     and it only prints at all for a reader who has not asked for stillness —
     the band drying is movement, so a still browser is given the clean sheet
     rather than the same band held still. */
  const layWet = useCallback(
    (clientX: number) => {
      const strip = stripRef.current
      if (!strip || settledRef.current || prefersStill()) return
      const x = clientX - strip.getBoundingClientRect().left
      const wet = wetRef.current
      const last = wet[wet.length - 1]
      if (last && Math.abs(last.x - x) < 1.6) return
      wet.push({ x, t: performance.now() })
      if (wet.length > WET_MAX) wet.shift()
      startLoop()
    },
    [startLoop],
  )

  /* and the arrival takes it back off, which is the last thing the blade does
     on this page and the only reward that is not also a change of state */
  useEffect(() => {
    if (settled) {
      if (wetRef.current.length >= 2 && !prefersStill()) {
        wipeRef.current = performance.now()
      } else {
        wetRef.current.length = 0
      }
      startLoop()
    } else {
      wipeRef.current = -1
    }
  }, [settled, startLoop])

  const paint = useCallback(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    const rect = canvas.getBoundingClientRect()
    const w = Math.max(1, Math.round(rect.width))
    const h = Math.max(1, Math.round(rect.height))
    const ratio = Math.min(2.5, window.devicePixelRatio || 1)
    const pixels = Math.round(w * ratio)
    const rows = Math.round(h * ratio)
    if (canvas.width !== pixels || canvas.height !== rows) {
      canvas.width = pixels
      canvas.height = rows
    }
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0)
    ctx.clearRect(0, 0, w, h)

    const unitNow = unitFor(w)
    if (Math.abs(unitNow - unitRef.current) > 0.5) {
      unitRef.current = unitNow
      setUnit(unitNow)
    }

    /* the paper this strip is cut from, with the drum banding still in it */
    const wash = ctx.createLinearGradient(0, 0, 0, h)
    wash.addColorStop(0, PAPER_TOP)
    wash.addColorStop(1, PAPER_BOTTOM)
    ctx.fillStyle = wash
    ctx.fillRect(0, 0, w, h)
    ctx.fillStyle = 'rgba(21, 20, 27, .04)'
    for (let y = 1; y < h; y += 3) ctx.fillRect(0, y, w, 1)

    /* the screen the stock is printed through — under the ink, not over it, so
       the type stays type and the paper stays paper */
    if (!screenRef.current) {
      const pattern = ctx.createPattern(makeScreen(), 'repeat')
      if (pattern) screenRef.current = pattern
    }
    if (screenRef.current) {
      ctx.globalAlpha = 0.11
      ctx.fillStyle = screenRef.current
      ctx.fillRect(0, 0, w, h)
      ctx.globalAlpha = 1
    }

    /* the trim edge, so the corners of the strip stay in frame */
    const inset = Math.max(7, Math.min(18, w * 0.022))
    const gate = Math.round(w / 2) + 0.5
    const bladeX = gate + reg * unitNow
    const gateHalf = Math.max(4, PULL_GATE * unitNow * 2.2)

    /* the gate window, so you can see where right is before you get there */
    ctx.fillStyle = settled ? 'rgba(255, 46, 107, .13)' : 'rgba(21, 20, 27, .05)'
    ctx.fillRect(gate - gateHalf, 0, gateHalf * 2, h)

    ctx.save()
    ctx.beginPath()
    ctx.rect(0, 0, w, h)
    ctx.clip()

    /* the poster, reduced — three lines on the sheet's own three rules. the size is
       a function of the space three lines have to live in, not of one line in the
       middle of the strip, so the reduction holds at every bed height */
    const pad = Math.max(13, Math.min(40, w * 0.038))
    const longest = Math.max(...FILM_LINES.map(line => line.length), FILM_MARK.length)
    const stackH = 3.53
    const size = Math.max(
      9,
      Math.min((h - 20) / stackH, (w - pad * 2) / (longest * 0.545)),
    )
    const leading = size * 1.2
    const baseline = (h - (leading * (FILM_LINES.length - 1) + size)) / 2 + size
    /* a misregistration is a fraction of the type, not of the sheet */
    const spread = magnify(reg)
    const reach = spread * size * FILM_REACH
    /* and how much ink a plate that has wandered off the letter is still laying
       down — which is the other half of why the fringe is a fringe */
    const thin = 1 - FILM_THIN * Math.abs(spread)

    ctx.textAlign = 'left'
    ctx.textBaseline = 'alphabetic'
    ctx.font = `800 ${size.toFixed(1)}px ${FILM_STACK}`

    const impression = (colour: string, dx: number, dy: number) => {
      ctx.fillStyle = colour
      FILM_LINES.forEach((line, index) => {
        ctx.fillText(line, pad + dx, baseline + index * leading + dy)
      })
      /* the mark is the pink plate everywhere on this sheet, including here */
      ctx.fillText(FILM_MARK, pad + dx, baseline + 2 * leading + dy)
    }

    /* three impressions, multiplied where they meet: near-black in register. the
       two colour plates are laid at the coverage a plate has when it is not on the
       letter, so out at the loose end they are a hair of pink and a hair of blue
       around a sentence you can still read. */
    ctx.globalCompositeOperation = 'multiply'
    impression(INK_BLACK, 0, 0)
    ctx.globalAlpha = thin
    impression(INK_PINK, reach, reach * 0.46)
    impression(INK_BLUE, -reach * BLUE_RATIO, -reach * BLUE_RATIO * 0.46)
    ctx.globalAlpha = 1
    ctx.globalCompositeOperation = 'source-over'

    /* THE MARK ITSELF, over the three plates and in none of them: the pause is
       printed once, in the press's own ink, exactly as it is on the poster — and
       it is the one thing on the film that never misregisters. */
    ctx.fillStyle = INK_PINK
    ctx.fillText(
      FILM_MARK,
      pad + ctx.measureText(FILM_LINES[2]).width,
      baseline + 2 * leading,
    )

    /* the wet trail: ink starved behind the blade, a shade deeper than the wash */
    const smear = unitNow * 1.7
    const left = reg >= 0 ? bladeX - smear : bladeX
    const shade = ctx.createLinearGradient(
      bladeX,
      0,
      reg >= 0 ? left : bladeX + smear,
      0,
    )
    shade.addColorStop(0, 'rgba(21, 20, 27, .2)')
    shade.addColorStop(1, 'rgba(21, 20, 27, 0)')
    ctx.fillStyle = shade
    ctx.fillRect(left, 0, smear, h)

    /* ink still standing up on the face of the blade */
    ctx.fillStyle = 'rgba(255, 255, 255, .26)'
    ctx.fillRect(bladeX - 1, 0, 2, h)
    ctx.restore()
    ctx.globalAlpha = 1

    const gateInk = settled ? 'rgba(255, 46, 107, .95)' : 'rgba(255, 46, 107, .5)'
    const ruleTop = Math.round(baseline - size * 0.72)
    /* the gate is capped at the cap height of the first line and the baseline of
       the last — the two lines it is actually registering */
    const ruleFoot = Math.round(baseline + leading * (FILM_LINES.length - 1))
    ctx.strokeStyle = gateInk
    ctx.lineWidth = 1
    ctx.setLineDash(settled ? [] : [3, 4])
    ctx.beginPath()
    ctx.moveTo(gate, 2)
    ctx.lineTo(gate, h - 2)
    ctx.stroke()
    ctx.setLineDash([])
    /* the gate wears end caps, the way a register mark does */
    ctx.fillStyle = gateInk
    ctx.fillRect(gate - 7, ruleTop, 14, 1.5)
    ctx.fillRect(gate - 7, ruleFoot - 1.5, 14, 1.5)

    /* and the film prints its own landing rule, because the mark at the end of
       the last line needs something to stand on here as much as it does on the
       sheet. the hair of paper left between the mark and the rule is the notch
       an ink trap fills, so the two pools close up as the plates agree — the
       same trap, off the same number, a third of the size. */
    const tail = FILM_LINES[FILM_LINES.length - 1]
    const markLeft = pad + ctx.measureText(tail).width
    const markWide = ctx.measureText(FILM_MARK).width
    const foot = ruleFoot + size * 0.13 + 0.5
    ctx.strokeStyle = settled ? 'rgba(42, 62, 201, .72)' : 'rgba(21, 20, 27, .24)'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(pad, foot)
    ctx.lineTo(markLeft + markWide, foot)
    ctx.stroke()
    const pool = settled ? 1 : 0.12
    const wide = size * 0.1
    const tall = size * 0.08
    const notchL = markLeft + size * 0.02
    const notchR = markLeft + markWide - size * 0.02
    ctx.fillStyle = settled ? INK_PINK : 'rgba(255, 46, 107, .45)'
    ctx.beginPath()
    ctx.moveTo(notchL, foot)
    ctx.lineTo(notchL - wide * pool, foot)
    ctx.lineTo(notchL, foot - tall * pool)
    ctx.closePath()
    ctx.moveTo(notchR, foot)
    ctx.lineTo(notchR + wide * pool, foot)
    ctx.lineTo(notchR, foot - tall * pool)
    ctx.closePath()
    ctx.fill()

    /* THE OTHER POSTER, ON THE OTHER SIDE OF THE GATE.

       the strip is a plate, and a plate carries the whole sheet: so the short
       answer is set here too, standing against the fore-edge the way the
       question stands against the head edge, at the step below it that the
       sheet's own ladder gives the answer to the question. the two blocks are
       the page's whole argument about size, printed eight hundred pixels apart,
       and the air between them is the measure both of them are set in.

       the answer is printed in black and in one voice on purpose — it is the
       sentence the press is allowed to get right, so it does not come apart
       under the blade while the question does. nothing here is drawn unless the
       strip is genuinely wide enough to set it in: below that the film is the
       question alone rather than the question and a fragment. */
    const answerFrom = markLeft + markWide
    const answerTo = w - inset
    const answerRoom = answerTo - answerFrom - Math.max(16, w * 0.03)
    if (answerRoom > 132) {
      const aLeadOf = (size: number) => size * 1.14
      let aSize = Math.min(size * FILM_ANSWER_RATIO, (h - 26) / 4.42)
      /* the press voice is what has to fit the strip; the reading line is set
         small enough that it never becomes the constraint, so the fit is measured
         on the two lines actually set at the answer's own step */
      const runWidth = (at: number) => {
        ctx.font = `800 ${at.toFixed(1)}px ${FILM_STACK}`
        let wide = 0
        FILM_ANSWER.forEach(line => {
          if (line.voice === 'reading') return
          wide = Math.max(wide, ctx.measureText(line.text).width)
        })
        return wide
      }
      const over = runWidth(aSize)
      if (over > answerRoom) aSize *= answerRoom / over
      const widest = runWidth(aSize)
      const readSize = aSize * 0.56
      const aLead = aLeadOf(aSize)
      const aBase = (h - (aLead * 3 + aSize)) / 2 + aSize

      ctx.textAlign = 'right'
      FILM_ANSWER.forEach((line, index) => {
        const y = aBase + index * aLead
        if (line.voice === 'reading') {
          ctx.font = `italic 500 ${readSize.toFixed(1)}px ${FILM_SERIF}`
          ctx.fillStyle = 'rgba(21, 20, 27, .66)'
        } else {
          ctx.font = `800 ${aSize.toFixed(1)}px ${FILM_STACK}`
          ctx.fillStyle = line.voice === 'pink' ? INK_PINK : INK_BLACK
        }
        ctx.fillText(line.text, answerTo, y)
      })

      /* and it lands on a rule of its own — the answer's, the same width as the
         run above it — with the ink gathered at the end of it: the same trap as
         the question's, off the same number, so the notch under the answer fills
         at the gate along with every other one on the sheet */
      const aFoot = Math.round(aBase + aLead * 3 + aSize * 0.14) + 0.5
      ctx.strokeStyle = settled ? 'rgba(42, 62, 201, .72)' : 'rgba(21, 20, 27, .2)'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(answerTo, aFoot)
      ctx.lineTo(answerTo - widest, aFoot)
      ctx.stroke()
      const aNotch = answerTo - widest
      const aPool = settled ? 1 : 0.12
      ctx.fillStyle = settled ? INK_PINK : 'rgba(255, 46, 107, .45)'
      ctx.beginPath()
      ctx.moveTo(aNotch, aFoot)
      ctx.lineTo(aNotch - aSize * 0.1 * aPool, aFoot)
      ctx.lineTo(aNotch, aFoot - aSize * 0.08 * aPool)
      ctx.closePath()
      ctx.fill()
      ctx.textAlign = 'left'
    }

    /* THE SCALE IS GONE, and it is the one thing on this strip that was doing no
       work. it was twelve ticks and a hairline under the type at two per cent
       contrast, which at any bed height on this sheet resolved into a smudge — and
       it was not reading the offset anyway: the offset has a rule of its own
       printed down the strip, the bed's own foot is lettered LOOSE / THE GATE /
       TIGHT, and the gauge in the bar carries the figure. what the space was
       actually for is the rest of the sheet. */

    /* trim corners */
    ctx.strokeStyle = 'rgba(21, 20, 27, .5)'
    for (const [x, y, dx, dy] of [
      [inset, 2, 1, 1],
      [w - inset, 2, -1, 1],
      [inset, h - 2, 1, -1],
      [w - inset, h - 2, -1, -1],
    ] as const) {
      ctx.beginPath()
      ctx.moveTo(x + dx * 9, y)
      ctx.lineTo(x, y)
      ctx.lineTo(x, y + dy * 9)
      ctx.stroke()
    }
  }, [reg, settled])

  paintRef.current = paint

  useEffect(() => {
    const frame = requestAnimationFrame(paint)
    return () => cancelAnimationFrame(frame)
  }, [paint])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !('ResizeObserver' in window)) return
    const observer = new ResizeObserver(() => {
      screenRef.current = null
      paintRef.current()
    })
    observer.observe(canvas)
    return () => observer.disconnect()
  }, [])

  const slideTo = (value: number) => onSlide(clamp(value))

  /** keyboard nudges get the same magnetism a release inside the gate gets */
  const nudgeTo = (value: number) => onSlide(snapPull(value))

  /* THE SPEED OF THE HAND. the bed was reading a position off the pointer and
     nothing else, so a blade had no momentum and a flick was indistinguishable
     from a slow drag — the reader let go and the machine stopped, which is what a
     cursor does and not what a squeegee does. the last two samples of the drag
     are enough to know how fast it was going; the dt is clamped because a tab
     that has been in the background reports one enormous interval, and thirty
     units a second is what you get from crossing the strip in a single frame. */
  const lastRaw = useRef({ x: 0, t: 0 })
  const speed = useRef(0)

  const move = (clientX: number) => {
    const bed = bedRef.current
    if (!bed) return
    const rect = bed.getBoundingClientRect()
    /* the cursor sets where the blade would sit; the gate has an opinion about
       the last third of a unit of it, and applies that opinion while the drag
       is still going rather than waiting to be released */
    const raw = (clientX - (rect.left + rect.width / 2)) / unitFor(rect.width)
    const now = performance.now()
    const held = lastRaw.current
    const dt = held.t ? Math.min(0.1, (now - held.t) / 1000) : 0
    if (dt > 0) speed.current = (raw - held.x) / dt
    held.x = raw
    held.t = now
    slideTo(magnetic(raw))
  }

  /* AND THE CARRY. one loop, mounted on release and taken off the sheet when the
     blade is caught, hits an end stop or runs out of speed. it drives the same
     number the drag drives, so nothing else on the page has to know it exists:
     the film, the wet band it lays down behind itself, the readout, the whole
     sheet coming into register under it — all of it is already following --reg.

     It starts from where the hand actually was, not from where the magnet had
     pulled the blade to. Those are two different numbers inside the last third
     of a unit, and starting from the second one would bend the carry through
     the magnet a second time — which on a release inside the band is a jump of
     a fifth of a unit in a single frame, and a machine that appears to decide
     the gate is a fault rather than a gate. */
  const coastRef = useRef(0)
  const coast = useCallback(
    (throwSpeed: number, from: number) => {
      if (coastRef.current) cancelAnimationFrame(coastRef.current)
      let raw = clamp(from)
      let v = Math.min(FLICK, Math.max(-FLICK, throwSpeed))
      let last = performance.now()
      setCoasting(true)

      const tick = () => {
        coastRef.current = 0
        const now = performance.now()
        const dt = Math.min(0.05, (now - last) / 1000)
        last = now
        /* the preference is read fresh every frame rather than once on the way in:
           a reader can ask for stillness while the blade is still travelling, and
           a carry that ignored them for the remaining three hundred milliseconds
           would be the one journey on the page that does */
        if (prefersStill()) {
          setCoasting(false)
          onSlide(snapPull(raw))
          return
        }
        raw += v * dt
        v *= FRICTION ** dt
        /* the gate is applied to the carry exactly as it is applied to the drag,
           so a flick that arrives at the band is bent into it on the way in */
        const shown = magnetic(raw)
        if (inRegister(shown)) {
          setCoasting(false)
          onSlide(0)
          return
        }
        if (
          Math.abs(v) < STOP_SPEED ||
          raw <= PULL_MIN ||
          raw >= PULL_MAX
        ) {
          setCoasting(false)
          onSlide(clamp(raw))
          return
        }
        onSlide(shown)
        /* a travelling squeegee prints. the band under the coast is the same band
           under the drag, dried from the far end back, so the road the blade took
           is on the paper whether the reader let go of it or threw it */
        const strip = stripRef.current
        if (strip) {
          const box = strip.getBoundingClientRect()
          layWet(box.left + box.width / 2 + shown * unitFor(box.width))
        }
        coastRef.current = requestAnimationFrame(tick)
      }

      coastRef.current = requestAnimationFrame(tick)
    },
    [layWet, onSlide],
  )

  useEffect(
    () => () => {
      if (coastRef.current) cancelAnimationFrame(coastRef.current)
      coastRef.current = 0
    },
    [],
  )

  const grab = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return
    /* a hand on the blade stops it where it is, however fast it was going */
    if (coastRef.current) {
      cancelAnimationFrame(coastRef.current)
      coastRef.current = 0
    }
    speed.current = 0
    lastRaw.current = { x: 0, t: 0 }
    draggingRef.current = true
    setDragging(true)
    event.currentTarget.setPointerCapture(event.pointerId)
    event.currentTarget.focus({ preventScroll: true })
    move(event.clientX)
    layWet(event.clientX)
  }

  const release = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return
    draggingRef.current = false
    setDragging(false)
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
    const thrown = speed.current
    const from = lastRaw.current.x
    speed.current = 0
    /* a blade that was barely moving has not been thrown, it has been put down,
       and putting a squeegee down inside the gate is caught rather than left
       hovering — which is the line the whole sheet is built on. a reader who has
       asked for stillness is given that same line and no travel at all. */
    if (prefersStill() || Math.abs(thrown) < 0.3) {
      slideTo(snapPull(reg))
      return
    }
    coast(thrown, from)
  }

  const keys = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    /* the bed is the one place on the sheet that owns the arrow keys outright, and
       it says so in the window as well as here. the two used to run together: a
       reader holding the bed and pressing → nudged the blade by the bed's tenth of a
       unit and then again by the window's 0.12, which is a machine that does not
       agree with its own label. the claim is made once, here. */
    const step = event.shiftKey ? 0.5 : 0.1
    let next: number | null = null
    if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') next = reg - step
    else if (event.key === 'ArrowRight' || event.key === 'ArrowUp') next = reg + step
    else if (event.key === 'PageDown') next = reg - 0.5
    else if (event.key === 'PageUp') next = reg + 0.5
    else if (event.key === 'Home') next = PULL_MIN
    else if (event.key === 'End') next = PULL_MAX
    else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      slideTo(0)
      return
    }
    if (next === null) return
    event.preventDefault()
    event.stopPropagation()
    nudgeTo(next)
  }

  return (
    <div
      ref={bedRef}
      className={`bed ${settled ? 'is-settled' : ''} ${dragging ? 'is-dragging' : ''}${
        coasting ? ' is-coasting' : ''
      }`}
      role="slider"
      tabIndex={0}
      aria-label="Plate offset. Drag the squeegee along the bed, or use the arrow keys, to bring the ink into register."
      aria-valuemin={PULL_MIN}
      aria-valuemax={PULL_MAX}
      aria-valuenow={Number(reg.toFixed(2))}
      aria-valuetext={registerText(reg)}
      onPointerDown={grab}
      onPointerMove={event => {
        if (!draggingRef.current) return
        move(event.clientX)
        layWet(event.clientX)
      }}
      onPointerUp={release}
      onPointerCancel={release}
      onKeyDown={keys}
      style={{ '--reg': reg, '--unit': `${unit}px` } as CSSProperties}
    >
      <div className="bed__head">
        <p className="bed__title">
          <span className="bed__dot" aria-hidden="true" />
          press bed
        </p>
        <p className="bed__read">
          <RegisterEye className="bed__eye" />
          <span>
            {settled ? 'in register' : <>{reg > 0 ? '+' : '−'}{Math.abs(reg).toFixed(2)} off register</>}
          </span>
        </p>
      </div>

      <div className="bed__strip" ref={stripRef}>
        {/* the plate is its own positioned box so the trail is exactly the size of
            the film and not of the strip: the band belongs on the ink, and the
            caption bar underneath the plate is not ink */}
        <span className="bed__plate">
          <canvas ref={canvasRef} className="bed__film" />
          <canvas ref={trailRef} className="bed__trail" />
        </span>
        <span className="bed__blade" aria-hidden="true">
          <Squeegee className="bed__arm" />
          <span className="bed__bar" />
        </span>
        <span className={`bed__stamp ${settled ? 'is-on' : ''}`} aria-hidden="true">
          in register
        </span>
        <p className="bed__caption" aria-hidden="true">
          the whole sheet · the question, and the answer it is answered by
        </p>
      </div>

      <p className="bed__foot">
        <span className="bed__hint">
          <span aria-hidden="true">↳</span> drag the blade
        </span>
        <ul className="keys">
          {SHORTCUTS.map(item => (
            <li key={item.label}>
              {item.keys.map(key => (
                <kbd key={key}>{key}</kbd>
              ))}
              <span>{item.label}</span>
            </li>
          ))}
        </ul>
        <span className="bed__scale" aria-hidden="true">
          <span>loose</span>
          <span className={`bed__gate ${settled ? 'is-on' : ''}`}>the gate</span>
          <span>tight</span>
        </span>
      </p>
    </div>
  )
}
