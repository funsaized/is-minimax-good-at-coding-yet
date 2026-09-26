export type WordId = 'm3' | 'good' | 'yet'

export type Note = {
  id: WordId
  index: string
  measure: string
  label: string
  gloss: string
  set: string
  drop: string | null
  title: string
  body: string
  look: string[]
  prompt: string
  margin: string
}

export const NOTES: Note[] = [
  {
    id: 'm3',
    index: '01',
    measure: 'two characters',
    label: 'M3',
    gloss: 'the subject',
    set: 'two characters · one mark · set small',
    drop: null,
    title: 'A name worn like a habit',
    body: '“M3” is the only proper noun in the sentence, so it can carry weight without shouting. Give it structure instead of emphasis — a mark, a lockup, one repeatable sign of hand — and let the ordinary words stay ordinary. On this page it is set smaller than the sentence, on purpose.',
    look: [
      'Set it smaller than the sentence, not louder.',
      'Let the words around it keep their plain voice.',
      'Use the mark for structure; never use it for emphasis.',
    ],
    prompt: 'what repeats on this page?',
    margin: 'the subject, held in two characters',
  },
  {
    id: 'good',
    index: '02',
    measure: 'six letters',
    label: 'good at',
    gloss: 'the hinge',
    set: 'six letters · no treatment · own line',
    drop: null,
    title: 'The standard, stated plainly',
    body: '“Good at” is the plainest phrase in the sentence, and that is why it works. It needs no italics, no caps, no glow. The design should match its directness and spend its effort somewhere else — on the space around it.',
    look: [
      'No styling at all on these six letters.',
      'Give them a line of their own, at full width.',
      'Let the words after them do the showing off.',
    ],
    prompt: 'where is the effort actually spent?',
    margin: 'the plainest words hold the most weight',
  },
  {
    id: 'yet',
    index: '03',
    measure: 'three characters',
    label: 'yet?',
    gloss: 'the turn',
    set: 'three characters · the mark drops to its own line',
    drop: '?',
    title: 'The pause, protected',
    body: '“Yet” is a small door left open, and the question mark is doing real work. Give the mark somewhere to land: a rule, a card, a closing line. Unfinished is a tone, not a bug.',
    look: [
      'Let the question mark land on a line of its own.',
      'Stop the paragraph where the eye stops.',
      'Leave one thing unsaid, on purpose.',
    ],
    prompt: 'what do you refuse to finish?',
    margin: 'the sentence ends open; the page should not slam it shut',
  },
]

export const WORD_IDS: WordId[] = NOTES.map(note => note.id)

export const findNote = (id: WordId): Note => NOTES.find(note => note.id === id) ?? NOTES[0]

/** Split a label so the final character can drop onto its own line. */
export const phraseLines = (label: string, drop: string | null): string[] => {
  if (!drop || !label.endsWith(drop)) return [label]
  const head = label.slice(0, -drop.length).trimEnd()
  return head ? [head, drop] : [drop]
}
