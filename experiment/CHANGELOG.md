# Iteration 245 · Lamplight Edition

A warm lamp glow on the title; a FolioTicket from a corner. MarginalLedger thins; a byline gives the lede its cadence.

## Added
- `src/FolioTicket.tsx` — a hand-set cream paper hang-tag with a wax pin, eyelet, and drawn string. Lists the press mark, voice letter, voice label, and the date the line was set. Tones to the active voice and rotates in on load.
- `src/style.css` — new `--lamp` warm-amber palette, `.hero__lamp` radial overlay, `.hero__byline` rules, `.folio-ticket*` styles, and trimmed `.marginal-ledger*` treatment. Hero spread gains a warmer base background.

## Changed
- `src/App.tsx` — added `<FolioTicket>` and `<span class="hero__lamp" />` to the hero spread; added a `hero__byline` lede line above the hero summary; rephrased the summary to land on a clear two-clause structure.
- `src/style.css` — tightened title `text-shadow` with a faint warm halo; refactored hero body to a centered flex column with a smaller, warmer dropcap; trimmed `.marginal-ledger` frame and glyph chrome; tuned `.folio-ticket` breakpoint to move the ticket into the upper-right corner on tablet, hide it on small mobile.

## Verified
- `npm run build` succeeds; TypeScript clean.
- Title preserved: `is Minimax M3 good at frontend yet?`
- No new network, font, or storage dependencies introduced.
- Motion respects `prefers-reduced-motion`; ticket and lamp settle animations disabled under reduce-motion.
