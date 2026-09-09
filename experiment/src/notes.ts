export type WordId = 'm3' | 'good' | 'yet'

export type Note = {
  id: WordId
  index: string
  folio: string
  label: string
  title: string
  gloss: string
  body: string
  prompt: string
  editor: string
  seen: string
}

export const NOTES: Note[] = [
  {
    id: 'm3',
    index: '01',
    folio: 'i',
    label: 'M3',
    title: 'Keep the fingerprint',
    gloss: 'a habit, not a name',
    body: 'A useful page should leave evidence of a point of view. Not a logo. Not a trick. A small, repeatable act of judgment.',
    prompt: 'the maker is a habit',
    editor: 'a quiet corner of the title — leave it alone',
    seen: 'seen twice today',
  },
  {
    id: 'good',
    index: '02',
    folio: 'ii',
    label: 'good at',
    title: 'Choose one clear thing',
    gloss: 'confidence is generous',
    body: 'The interface gets quieter when it stops presenting every possible answer. A confident choice gives the reader somewhere to stand.',
    prompt: 'make room for attention',
    editor: 'the verb of the question — keep it present tense',
    seen: 'read aloud once',
  },
  {
    id: 'yet',
    index: '03',
    folio: 'iii',
    label: 'yet?',
    title: 'Protect the pause',
    gloss: 'the question stays open',
    body: '“Yet” carries the honest part. The space before an answer is not a gap to decorate; it is where the reader arrives.',
    prompt: 'leave room to arrive',
    editor: 'the question mark is doing real work here',
    seen: 'circled in pencil',
  },
]
