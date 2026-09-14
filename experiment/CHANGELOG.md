# Changelog

## Iteration 237 — margin gutter replaces the title's annotation row

The hero spread becomes a true editorial folio: a slim marginalia column now lives in the right gutter of the title, anchored beside the words it annotates.

- **New `MarginGutter` component** (`src/MarginGutter.tsx`) sits inside `hero__plate` next to the title. On wide screens (≥1180px) it appears as a vertical column to the right of the title; on narrower screens it collapses into a three-column grid below the title and finally a single-column stack on small viewports.
- **Hero plate re-composed as a two-column layout** (title left, gutter right) at ≥1180px; the title's font-size is reduced one step so both halves share the spread comfortably. Single-column layout returns at narrower widths.
- **Annotation ribbon retired from the hero** (`AnnotationRibbon` is no longer imported in `App.tsx`); its three-card role is now played by the gutter, which keeps the same marks (stet / caret / query), glosses, folio indices, and ink colours, but reads them as marginalia in the gutter rather than a separate band below the spread.
- **Active mark highlight** — the gutter's left border, header dot, mark tag, and word colour all switch to the active word's ink (acid / coral / blue). The active card slides two pixels left and a thin dashed thread arcs out of the gutter toward the title's marked word.
- **Keyboard-accessible and reduced-motion safe** — every note in the gutter is a button with `aria-pressed`, focus styling, and a polite announcement via the existing `selectWord` handler; the gutter's entry animation, thread draw, and slide transitions all disable under `prefers-reduced-motion: reduce`.
- **Mobile fallback** — at ≤1179px the gutter fills the spread width with a three-column grid of cards; at ≤880px it stacks into a single column. Connector threads hide on narrower screens to keep the layout calm.
- **Build** — `npm run build` runs clean (`tsc --noEmit && vite build`); no new dependencies introduced.