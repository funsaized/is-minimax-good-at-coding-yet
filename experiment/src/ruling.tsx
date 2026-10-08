type RulingProps = {
  className?: string
  /**
   * Which stock the ruling is printed on. The light sheets carry it in ink into
   * newsprint, where the three plates overprint each other; the ink slab cannot
   * multiply anything, so there the same three rules are printed as light.
   */
  tone?: 'light' | 'slab'
  /**
   * Print this ruling a step back from the others.
   *
   * The armature is at press strength over the sheet that carries the poster,
   * which is the loudest piece of type on the page: the sheet was printing its
   * own grid at full weight directly underneath its own headline, and the two
   * fought. The proofing sheet further down takes the full strength, because
   * that is the band where the ruling is doing structural work rather than
   * sitting behind something that already shouts.
   */
  veil?: boolean
}

/**
 * THE RULING.
 *
 * Every press sheet is ruled: the type area is a rectangle of hairlines and the
 * whole page is set inside it. This one had never printed its own. The bands were
 * each composed on whatever grid suited them — two columns here, three there, a
 * fixed `62ch` in another place — and the only rules on the page were the ones
 * at the head of a section. The result was a sheet of good sections and no sheet.
 *
 * So the type area is printed now: twelve equal columns, edge to edge, running
 * the full height of every band — or six, or four, because the count is one
 * number on the root that the bands' tracks, this gradient and the rail at the
 * head of every band all read. The armature has the width of the paper it is
 * printed on, and all three of those agree about which width that is. The grid
 * has no gap in it. The gutter is
 * padding inside the columns instead, which is the only way a track boundary and
 * a printed rule can be the same x on every band — and that agreement is the
 * whole reason the ruling is worth printing. A grid you can only see is wallpaper.
 *
 * And it is printed by the same three plates as the type, at the same two ratios,
 * so the armature is out of register while the blade is loose and collapses into
 * one set of crisp lines at the gate. The last thing the reader learns about the
 * register is the shape of the page itself.
 *
 * It also rides the drying ramp, which is the detail that makes it press rather
 * than decoration: at the press the ruling is at its widest and the three plates
 * are plainly apart, and by the time the reader is reading the type list the
 * structure has almost closed on itself. The type dries and so does the grid it
 * is sitting on. Nothing here needs a hand from the reader, and every one of
 * these properties is a position rather than a journey, so a reader who has asked
 * for stillness gets exactly the same sheet.
 *
 * The markup is three empty plates and no geometry. The rules themselves are a
 * gradient at one twelfth of the width, which is why a band of any height costs
 * the same three nodes.
 */
export function Ruling({ className = '', tone = 'light', veil = false }: RulingProps) {
  return (
    <span
      className={`ruling ruling--${tone}${veil ? ' ruling--veil' : ''}${
        className ? ` ${className}` : ''
      }`}
      aria-hidden="true"
    >
      <i className="ruling__plate ruling__plate--blue" />
      <i className="ruling__plate ruling__plate--pink" />
      <i className="ruling__plate ruling__plate--black" />
    </span>
  )
}
