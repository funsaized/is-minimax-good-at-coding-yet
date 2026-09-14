# Changelog

## Iteration 228 — a quieter title, a single press signature
Tightened the title page so the question can breathe; added a press signature that runs through the page as a unifying printer's mark; gave the three voices a more decisive typographic identity.

- Hero chrome: removed the deckle, registration marks, corner tab and bottom slip so the title sits alone inside the spread; the wax seal keeps its corner position with a softer drop.
- Title typography: quiet cut now sets smaller and tighter, human hand leans into a swashier italic with a warm coral tint, bold signal sits heavier, larger and tighter in sans caps; each voice picks up its own text-shadow so the press feels distinct, not just recolored.
- Press signature: a new `PressSignature` component (m³ seal + folio mark + voice + word mark + date, bookended by growing rules and a sweeping ink line) appears once at the foot of the hero and again at the foot of the page, just before the colophon.
- Removed a block of dead press-signature CSS from a previous iteration and re-threaded the existing ImpressionRibbon imports cleanly through `PressBay`/`notes`.
