# Changelog

## Iteration 230 — a press ribbon and a second reading

A single unifying band that runs through the page, and a typographic specimen
that lets the same question be re-read in three voices.

- New `PressRibbon` (src/PressRibbon.tsx) sits beneath the hero and reappears
  between the day sheet and the answer. It binds the page together: the
  title set in the active voice, three tags showing all readings with the
  active one marked, and a quiet meta line with the day's date.
- New `SecondReading` (src/SecondReading.tsx) is a single, deliberate
  interactive specimen that shows the question set three ways. Hovering or
  focusing a tab shows that reading; clicking pulls the press. The three
  lines use the system serif italic and the system sans heavy so the
  difference is real, not nominal.
- The answer reveal's colophon (the close, the colophon line, the pull quote)
  gets a tighter, more deliberate frame — a `tip-in stamp`, a `trail dot`
  row, and a clearer `fold it back` button. The leaf itself keeps its paper
  feel but reads more confidently.
- Mobile layout: the hero voice row stacks on small screens, the press
  ribbon collapses gracefully, the second reading specimen simplifies to
  bordered tabs, and the title tightens its letter-spacing at narrow widths.
- Global rhythm: section padding, header spacing, and the answer reveal's
  small typographic ornaments were tightened so the page reads with a
  steadier beat without changing the section order.
