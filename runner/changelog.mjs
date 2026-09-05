import fs from 'node:fs/promises'
import path from 'node:path'
import { filesIn, hash, summarizeChangelog } from './lib.mjs'

// Metadata must not discard an otherwise valid page when a model turn is truncated.
export async function ensureChangelog(work, baseline) {
  const filename = path.join(work, 'CHANGELOG.md')
  const existing = await fs.readFile(filename, 'utf8').catch(error => {
    if (error.code === 'ENOENT') return ''
    throw error
  })
  if (existing.trim()) return summarizeChangelog(existing)

  const changes = []
  for (const directory of ['src', 'public']) {
    const before = path.join(baseline, directory)
    const after = path.join(work, directory)
    const oldFiles = new Set(await filesIn(before))
    const newFiles = new Set(await filesIn(after))
    for (const file of [...new Set([...oldFiles, ...newFiles])].sort()) {
      let action
      if (!oldFiles.has(file)) action = 'Added'
      else if (!newFiles.has(file)) action = 'Deleted'
      else if (hash(await fs.readFile(path.join(before, file))) !== hash(await fs.readFile(path.join(after, file)))) action = 'Modified'
      if (action) changes.push(`${action} ${directory}/${file}`)
    }
  }
  if (!changes.length) throw new Error('Model made no page changes')
  const summary = `Updated ${changes.length} page file${changes.length === 1 ? '' : 's'} (runner-generated changelog).`
  await fs.writeFile(filename, `${summary}\n\nThe model omitted its changelog. The runner recorded these file changes automatically:\n\n${changes.map(change => `- ${change}`).join('\n')}\n`)
  return summary
}
