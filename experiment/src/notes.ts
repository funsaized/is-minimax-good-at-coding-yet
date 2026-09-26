export type WordId = 'm3' | 'good' | 'yet'

export type Note = {
  id: WordId
  index: string
  measure: string
  label: string
  title: string
  gloss: string
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
    title: 'A name worn like a habit',
    gloss: 'the subject',
    body: '“M3” is the only proper noun in the sentence, so it can carry weight without shouting. Give it structure instead of emphasis — a mark, a lockup, one repeatable sign of hand — and let the ordinary words stay ordinary.',
    look: [
      'Set it smaller than the sentence, not louder.',
      'Let the words around it keep their plain voice.',
      'Repeat the mark once, then stop using it.',
    ],
    prompt: 'what repeats on this page?',
    margin: 'the subject, held in two characters',
  },
  {
    id: 'good',
    index: '02',
    measure: 'six letters',
    label: 'good at',
    title: 'The standard, stated plainly',
    gloss: 'the hinge',
    body: '“Good at” is the plainest phrase in the sentence, and that is why it works. It needs no italics, no caps, no glow. The design should match its directness and spend its effort somewhere else — on the space around it.',
    look: [
      'No styling at all on these six letters.',
      'Give them the longest line on the page.',
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
    title: 'The pause, protected',
    gloss: 'the turn',
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
