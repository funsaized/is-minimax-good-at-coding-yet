Iteration 300 — Composed the broadside's press signature: one word set three ways on a single sheet.

- Added LetterpressCatch, a new composed press-signature section that sits between the pressings and the marginalia. The section shows one word (the rule, "attention") set across the three voices on a single broadside, with the active voice stepping forward, a refined press seal anchoring the composition, and a footer that states the rule the three voices share.
- Wired the new section into the page navigation (SpreadRibbon trace, MarginThread folios, IntersectionObserver), the section spine, and the section ordering so the signature sits deliberately in the reading order between pressings and marginalia.
- Tightened the section's typography hierarchy: a refined eyebrow + serif-italic lede pairing, balanced h2 with italic emphasis, and a centered header composition that gives the new section its own voice while keeping it consistent with the page's editorial rhythm.
- Added a responsive layout for the catch: a three-column strip at desktop, a single stacked column under 900px, with the press seal centered on small screens. Honors prefers-reduced-motion and uses IntersectionObserver-based reveal.
- Kept the press seal, the dated set-today stamp, the marked word, and the active-voice badge as the section's four fixed points; nothing fabricated.
