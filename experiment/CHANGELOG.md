# Changelog

## 318 — the front matter gains an imprint plate

The page's front matter gains a single, confident artifact — an imprint plate — set between the editor's note and the brief lever. It captures the present moment of the page (the active voice, the marked word, set today, the season, and the reader's inscription when set) in one coherent typographic composition: a small press-mark head, a hand-cut stamp, a five-cell grid with voice-toned and word-toned accents, a hand-drawn thread that points to the next folio, and a small italic colophon foot.

The plate is the page's "what I am reading, right now" — the front matter's memo, not its colophon. It earns its place by giving the reader a single, beautiful confirmation before they turn the page.

### What changed

- `src/ImprintPlate.tsx` — new component (460 lines): a section with a rule head, a press-mark + title head, a stamp, a five-cell grid (voice, marked word, set today, optional reader), a thread-and-tag pointing toward folio ii, a dashed-rule foot with two lines of inscription, and a hand-drawn pencil flourish. Includes four seasonal glyphs (winter star, spring leaf, summer sun, autumn leaf).
- `src/style.css` — added a self-contained block of styles for `.imprint-plate` and its BEM children: voice-toned accents (blue/coral/acid), word-toned ink for the marked cell (acid/coral/blue), dashed inner frame, hand-drawn seal with wax bead, three-tier responsive behavior (1080px / 720px / 480px), reduced-motion fallbacks, gentle in-view reveal, and hover micro-rotations on the head mark and stamp.
- `src/App.tsx` — imported `ImprintPlate` and placed it in the front matter between the folio-readings (specimen tray) and the hero-brief-lever (turn the page).

### What it does

- Mirrors the present state of the page in one place: voice letter, voice name, voice face; marked word, its mark, its kind; set today with the season, the hour, and a hand-drawn seasonal glyph; the reader's inscription when one has been set.
- Inherits the page's existing tone logic so the plate recolors as the reader pulls a voice, marks a word, or types a name — no new state, no new controls.
- Adds a single editorial beat to the journey: the editor's note is read, the three readings are set, and the imprint plate confirms the reading before the brief lever invites the reader onward.
- Uses local SVG only — for the seal, the four seasonal glyphs, the thread, the pencil mark, the dashed inner frame, and the wax bead. No remote assets.
- Respects reduced-motion: every dash-offset draw, bead fade-in, and reveal falls back to its resting state.
- Stacks to one column on narrow screens; the dashed rules between cells hide on tablet and mobile to avoid visual clutter.
