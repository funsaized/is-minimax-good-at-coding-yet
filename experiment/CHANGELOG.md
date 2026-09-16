# Changelog

## Iteration 289 — brief re-authored with a dropcap, a closing rule, and a keymark marginalium

The editor's note (hero brief) was well-composed but read like a generic editorial card. The pre-existing `.hero__dropcap` class had no element to bind to. The title above names three marked words (m³, good at, yet?); the brief only mentioned them in passing. This pass re-authors the brief as a single hand-set printed object so the entry to the page reads more like an editorial front matter.

- Added a hand-set dropcap "T" to the lead paragraph, in the active voice tone, using the pre-existing `.hero__dropcap` class. The class now earns its place; the brief opens as a printed piece.
- Added a small fleuron divider between the brief title's first row ("Three words. Three voices.") and its soft row ("One open question."). Quiet punctuation between two beats of type; tone shifts with the active voice.
- Added a hand-drawn closing rule (`hero__brief-divide`) between the body and the keymarks below. A center bead anchors the eye; the stroke draws in once the brief is in view.
- Added a new `<aside class="hero__brief-keymarks">` marginalium: a compact three-row block that names the three words of the title (m³, good at, yet?), their proof marks (stet, caret, query), and their editorial gloss (let it stand / make room / protect the pause). Each row is a real button — click to mark, hover to light up. The active word is drawn in its voice color (acid / coral / blue) with a hand-drawn caret beneath. The caret stroke draws in on hover or activation.
- New reduced-motion rules settle the divide stroke, the bead, the keymark caret, and the button transform to a static state.
- Responsive: on screens ≤ 720px the keymark rows collapse the caret beneath the word stack; on ≤ 540px the keymark and foot typography is tightened.