# Changelog

## Iteration 154

The verso earns its own composed press catchword — a delicate italic slip that mirrors the recto catchword in idiom but speaks in the reply's own slower voice, completing the recto/verso opening symmetry.

- Added `ReplyCatchword` figure: thin gold rules, an italic cluster naming the reply ("the reply · set slowly, in this folio"), and a small leaf-and-fleuron sigil that stands in for the recto catchword's printer monogram.
- Placed the new catchword between the verso frontispiece and the three-voice verses, so the verso opening now reads: half-title → pin → reply catchword → verses.
- Revealed with the reply (uses the existing `replyShown` gate) and animated as the verso opens, with reduced-motion respect.
- Added a slow, gentle breath cycle to the leaf sigil (mirroring the recto catchword's monogram breath in the opposite direction), giving the reply its own quiet pulse.
- Added full responsive + reduced-motion CSS for `.reply-catchword*`, scaling rules and sigil at 720px and 480px breakpoints.