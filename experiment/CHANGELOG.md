# Changelog

## Iteration 340 — the press breath
A single composed flourish ties the lever moment to the page; the title-page rhythm tightens.

### Added
- `PressBreath` — a quiet hairline and small mark that draws across the title-page edge once revealed. Re-pulses with a halo burst the moment the lever is pulled, confirming the press impact.
- A brief, voice-toned `press-impact` overlay that radiates from the title area during the stamp, fading within ~1.4s.

### Refined
- Title-page rhythm — tighter spacing between TitleBroadside, PressSignal, ReadingPrologue, PressLever, and TitleCoda so they read as one composed breath rather than five plates.
- ReadingPrologue (inside `.opening`) — softer inner chrome, centered lede, hidden vertical thread, tighter reading padding. The two readings remain interactive but feel less boxed.
- PressLever pull — the shaft tilts further forward (`32deg`), the open state glows softly, the bloom pulses on stamp, and the action line catches a faint tone shadow.
- TitleBroadside — `text-wrap: balance` on the statement, slightly wider gap on the middle line, a small stamping pulse on voice change.
- Running header — the set-mark briefly brightens during the lever stamp.
- Mobile — the lever spread collapses to a single column under 720px; the reading rows stack and the action button tightens.

### Notes
- No new packages, no remote assets, no fabricated stats.
- Reduced-motion preferences honored throughout the new motion.
- PressBreath sits between TitleCoda and the FolioHinge, semantically the "exhale" that closes folio i.