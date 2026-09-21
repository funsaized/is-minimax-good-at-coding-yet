# Changelog

## iteration 359 — folio

**A single, composed folio replaces the multi-screen press chase.** Header, hero, ledger, press bed, marginalia, specimen plate, answer leaf, and colophon now read as five numbered folios on one page.

### added
- A `folio-header` row with brand mark, an inline folio ledger nav, and a heartbeat-timed set-today stamp (replaces the prior 3-row register bar at top of page).
- A `hero-ledger` sidebar that names the page's five folios and tracks the active section in the voice tone.
- A `hero__voice-keys` typographic trio on the hero rail — three buttons (a / b / c) for the three voices, with the active voice tinted, the letter lifted and lit, and the tail ruling into the page.
- A `hero-marginalia` editor's note inline-aside on the hero rail (numbered i. ii. iii.), styled like a left-rule marginal pencil note.
- A `hero__reveal` button that replaces the prior lever trigger: pulls no mechanism, just unfolds the answer leaf, animated subtly when becoming `is-open`.
- A `folio-divider` between every folio, reading "folio ii · the press bed" etc., to give the page a clear sidenote rhythm.
- A `site-foot` footer that closes the page with the title repeated and a quiet `back to the question` link.
- New CSS in `style.css` under a `FOLIO OVERLAY` banner that re-colors the chrome (calmer paper/lead palette), brings the meta-glow tones to the right place, and adds responsive behavior.

### changed
- `App.tsx` rebuilt as a single composition: hero (with `TitleBroadside`) → press (`Press`) → marginalia (`NotesSection`) → specimen plate (`TypePlate`) → answer leaf (`AnswerReveal`) → colophon (`Colophon`). Each is used once, in order, with folio dividers between.
- The "answer unfolded" sound/stamping ring (`.is-lever-stamping` + `.press-impact`) is no longer driven from the reveal — the reveal and the lever are now separate moments.
- Voice keys now live in three places (header heartbeat dot, hero rail trio, specimen plate rows) instead of four, all tied to the same `voice` state.

### removed
- The 30+ transition/leverage/log/sigils/reading-floors that accumulated from iterations 350–358 are no longer wired into `App.tsx` (their files remain in `src/` so other iterations stay intact, but they don't render). This includes: `PressCadence`, `ReadingPulse`, `SetType`, `PressOpeningSpread`, `PressProofSlip`, `PressSignature`, `PressSpine`, `PressLever`, `PressLog`, `PressLamp`, `PressReceipt`, `FolioLedger`, `FolioHinge`, `LetterToReader`, `LetterpressCatch`, `ReadersNote`, `ReaderPlate`, `Opening`, `ReadingPrologue`, `ReadingFloor`, `SecondReading`, `ExhalationPlate`, `MarkedProof`, `Almanac`, `MarginNotes`, `WayfinderSeal` rendered chrome, `Watermark`, `PaperGrain` cinematic overlay, `InkDust`, `InkTrail`, `BroadsideReveal`, `BroadsideEdge`, `PageReturn`, `TitleFold`, `SetType`, `CompositionSpecimen`, and the prior long inline `AnswerReveal`/`Colophon` definitions (now in `src/AnswerReveal.tsx` and `src/Colophon.tsx`).
- The `marks`/pull-tally chrome that ran across prior pages is preserved only inside the slim `PressRegister` row under the header (kept one row, no separate log).

### retained
- The three voice mechanics, the `shift+v` keyboard cycle, the marginal `NOTES` data, the answer leaf's drop-cap and pull-quote, the colophon's seal, the impression marks buffer (kept for `PressRegister`), the `<h1 class="sr-only">` carrying the document title, and the existing CSS variables in `:root` — all untouched.
