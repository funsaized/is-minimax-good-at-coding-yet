# Changelog

## Iteration 446 — a held broadside

The hero title now reads as a printed broadside: four small printer's marks are added to the question, so the type itself carries the editorial logic. The page earns its held pause by adding visible proof to the line.

- Opening swash before the lead word "is" — a small italic ornament with a drawn stroke and two beads, drawn in on load, signals "the line begins here."
- Proof-reader's underline beneath the unmarked word "frontend" — a thin dashed rule with a tiny caret at its end, indicating "this is what the question is about." It lifts on hover/focus and strikes when the lever is pulled.
- A query seal hangs beneath the question mark — a small printer's chop with concentric rules and a centred italic "?", arriving with a soft spring when "yet" is marked or hovered. It strikes when the lever is pulled.
- A held-breath rule sits between the broadside and the compositor's note — a dotted line with two printer's marks flanking the small mono key "the page holds." It arrives 1.85s in and tints subtly with the active voice's tone.

All marks respect `prefers-reduced-motion`. Mobile widths scale the swash, seal, and key down so the broadside stays balanced on small screens. Title and document title preserved as required.
