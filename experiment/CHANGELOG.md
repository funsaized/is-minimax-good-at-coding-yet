# Changelog

## 235

the press leaves its mark on the page — pulling the lever now fires a brief ink strike at the press mark in the hero, re-letters the title, and lands a splash on the impression ribbon.

- Added a press-strike overlay (ring, inked line, spark) anchored to the press mark, so a lever pull is felt across the hero spread, not only inside the press bed.
- Re-keyed the hero title on each voice change so the lineIn animation re-fires; the marked words also pulse with their ink shadow on re-strike.
- Gave each new impression-ribbon mark a small ink-splash ring as it lands on the session tape.
- Tightened the lineIn entrance so the title re-strikes within ~0.7s, matching the press cadence.
- All motion is suppressed under prefers-reduced-motion; focus on a TitleToken is preserved when voice changes are triggered from the lever, voice tabs, or shift+v.