Make-ready: the press sheet now hands you the plate and you can pull it into register.

## The change
The page previously *looked* like a two-colour riso pull but never admitted it. This iteration makes
the misregistration real and operable. A single "plate offset" dial drives one pair of CSS variables
on `:root`, and everything that is printed on the sheet follows it: the hero title, the plate card
loupe, and the close-read specimen. A "pull to register" button eases the plate home on a rAF curve;
at zero, the fringes collapse and the type goes crisp. A three-plate registration eye in the plate
card reads the state — the black plate holds still, the pink and blue plates slide, and at register
all three collapse into one bullseye.

The offset is done with layered `text-shadow` on the live text, not duplicated ghost DOM, so the
title's accessible name and text content stay exactly `is Minimax M3 good at frontend yet?`. The
offset is scaled as a proportion of the type size (`--fringe-scale`) so the fringe reads as
misregistration on a 7rem headline and on a 2.4rem phone headline alike.

## What was added
- `MakeReady` control in the plate column: a real range input with a centre detent, loose/tight
  scale, tabular-numeric readout, `aria-valuetext`, and a `pull to register` button that animates the
  plate home. In register the button becomes a state, not a dead control.
- `RegisterEye` (`src/marks.tsx`): three registration crosses whose offsets are the plate offset.
- Paper tooth generated in-browser with an inline `feTurbulence` data-URI tile, replacing the
  repeating scanline gradients.
- `M3` given a hairline lockup — structure instead of emphasis, which is what phrase 01 actually
  argues for — with its own scaled fringe and a pull-driven ink shadow.
- The question mark rocks on a long loop and freezes on its neutral point while it is the phrase
  under the lens; its half-tone landing pad is now proportionally larger.
- The left rail reports the live register state and turns pink when the plate is home.

## What was removed
- The large half-tone "bloom" cloud behind the title. It was decorative weight competing with the
  title and animated `top`/`left` on every phrase change; the screened fringes now do that job with
  real meaning.
- The `HandArrow` margin SVG. It was stretched with `preserveAspectRatio="none"`, so the hand-drawn
  line was distorted into a smear. The margin note is now a pink gradient rule plus a serif pull.
- The infinite `mark-breathe` rotation that ran on every slugline mark on the page. Ambient motion
  on eight identical elements was noise, not character.
- Duplicate ghost layers in the specimen card (aria-hidden text copies of the phrase).
- The loupe's duplicate gloss line, which restated the index row it sat next to.

## What was tightened
- Specimen body: heading and copy now share one column, closing a row-gap hole between them.
- Index rows carry the short measure ("six letters") instead of a set line that wrapped to two.
- The index column is sticky, so the phrase list stays with the specimen while it scrolls.
- Answer section columns start together; the closing note no longer orphans a word.
- `text-wrap: balance` on headings, `pretty` on body copy; serif and mono both kept in use.

## Verification
`npm run build` (tsc + vite) passes. Rendered locally in Chromium at 1728 / 1440 / 860 / 390px:
no horizontal overflow, no console or page errors, document title and `h1` text content both exactly
`is Minimax M3 good at frontend yet?`. Verified keyboard paths — `1`/`2`/`3` pull a phrase into the
lens, arrows step the index and the plate, `Esc` re-covers the proof sheet, the range input is
native and focusable — and verified under `prefers-reduced-motion: reduce`, where the pull resolves
instantly to register, the rocking mark stops, the magnetic pull is disabled, and the plate control
still works.
