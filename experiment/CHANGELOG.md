# Changelog

## 319 — a printer's device closes the title page

- The title page gains a single, hand-drawn broadside rule at its lower edge: two ink rules draw inward from either side, meeting at a small printer's flower (a four-petal device stamped with m³, ringed by a slow-turning dashed halo). A serif italic caption underneath reads "and so the title page, set · turn the leaf", and a small mono footer carries the device, voice, and date.
- The component uses the existing ink-grain filter style, voice-tone variation, and prefers-reduced-motion respect; on small screens the rule stacks vertically and the device centers.
- File added: `src/BroadsideRule.tsx`. CSS appended to `src/style.css`. Imported and rendered inside the title page section in `src/App.tsx` directly below the press lever.