# Changelog

## Iteration 157

A scholar's marginalia — once a reading completes, eight marked words in the answer and reply become hoverable and focusable anchors, each opening a small printed gloss below the panel. The notes draw on the same folio vocabulary that runs through the page (folium, ipse, legere, nunc, semel, iterum, tarde) and reward the reader for slowing down to look. Keyboard accessible, tap-to-pin on touch, and respectful of reduced-motion preferences.

### Changed

- `src/App.tsx`: added `ANSWER_GLOSSES` and `REPLY_GLOSSES` with eight word/observation pairs; added `wrapWithScholarAnchors` helper that splits a string around the matched words and renders each as a `scholar-anchor` span; added `ScholarGlosses` panel that renders the active observation; added `activeGloss` state and a phase-transition effect that clears it on a new reading; wired the anchors into the answer and reply text rendering, gated on `phase === 'complete'`.
- `src/style.css`: added styles for `.scholar-anchor` (dotted underline, coral hover, gold underscore), `.scholar-glosses` (paper card with coral rule and seal mark), with reduced-motion and small-viewport media queries.
