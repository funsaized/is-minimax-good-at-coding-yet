Iteration 339 — FolioFold collapses into a single hand-pressed FolioHinge that does one thing: it folds the page.

The new plate sits where the four-tools section used to live, between the title-page front matter and the press bed. It runs a thin hand-drawn seam out of a pressed m³ seal, names the next folio in italic, and scrolls the reader to #press in a single confident motion. The press register above and the press bed below already carry the rest of the work — previewing tools, counting impressions, and showing the pulled line were all duplicate work that the hinge no longer has to repeat.

Details:
- Added src/FolioHinge.tsx — a single composed plate (eyebrow, rule, seal, rule, caption, hint, arrow) that replaces FolioFold in App.tsx.
- Added ~360 lines of CSS for the FolioHinge in src/style.css: voice-tinted seams (blue / coral / acid), stroke-dashoffset rule draw-on, spring-loaded seal press, hover and focus-visible treatments, full prefers-reduced-motion overrides, and tightened 720px / 480px responsive breakpoints.
- Removed the FolioFold import and usage from src/App.tsx so the new hinge is the sole transition between the front matter and the press section. The old FolioFold.tsx file is left in place but no longer rendered or bundled.
- Iteration is keyboard-accessible (the plate is a single <button>), mobile-friendly (the seal and arrow collapse gracefully at 480px), and respects reduced-motion preferences (all entrance animations have explicit overrides).
- Title "is Minimax M3 good at frontend yet?" preserved verbatim in index.html and document.title.
