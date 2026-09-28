/**
 * Has the reader asked for stillness?
 *
 * Every movement on this sheet ends the moment this returns true, and the sheet
 * keeps working without it — the plates, the register, the ramp and the traps are
 * facts about the paper, not journeys. So this lives on its own rather than in
 * the component that happens to need it first: the bed asks for it as well, now
 * that the blade's own wet trail is something that can be declined.
 *
 * Read fresh each call rather than cached: a reader can change the preference
 * while the page is open, and a cached answer would keep the old sheet.
 */
export const prefersStill = () =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches
