import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { ensureChangelog } from '../runner/changelog.mjs'

async function fixture(t) {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'minimax-changelog-'))
  t.after(() => fs.rm(root, { recursive: true, force: true }))
  const baseline = path.join(root, 'before')
  const work = path.join(root, 'after')
  for (const dir of [baseline, work]) {
    await fs.mkdir(path.join(dir, 'src'), { recursive: true })
    await fs.mkdir(path.join(dir, 'public'))
    await fs.writeFile(path.join(dir, 'src/App.tsx'), 'original')
  }
  return { baseline, work }
}

for (const content of [null, '', '  \n']) {
  test(`missing or blank changelog is reconstructed from real changes (${JSON.stringify(content)})`, async t => {
    const { baseline, work } = await fixture(t)
    if (content !== null) await fs.writeFile(path.join(work, 'CHANGELOG.md'), content)
    await fs.writeFile(path.join(work, 'src/App.tsx'), 'changed')
    await fs.writeFile(path.join(baseline, 'public/old.svg'), 'old')
    await fs.writeFile(path.join(work, 'public/new.svg'), 'new')
    assert.equal(await ensureChangelog(work, baseline), 'Updated 3 page files (runner-generated changelog).')
    const result = await fs.readFile(path.join(work, 'CHANGELOG.md'), 'utf8')
    assert.match(result, /Modified src\/App.tsx/)
    assert.match(result, /Added public\/new.svg/)
    assert.match(result, /Deleted public\/old.svg/)
    assert.equal(await ensureChangelog(work, baseline), result.split('\n')[0])
  })
}

test('model-written changelog is preserved verbatim', async t => {
  const { baseline, work } = await fixture(t)
  const content = '# Iteration\n\nImproved typography.\n'
  await fs.writeFile(path.join(work, 'CHANGELOG.md'), content)
  assert.equal(await ensureChangelog(work, baseline), 'Improved typography.')
  assert.equal(await fs.readFile(path.join(work, 'CHANGELOG.md'), 'utf8'), content)
})

test('fallback cannot turn an unchanged page into an accepted attempt', async t => {
  const { baseline, work } = await fixture(t)
  await assert.rejects(ensureChangelog(work, baseline), /Model made no page changes/)
})

test('fallback rejects symlinks in page files', async t => {
  const { baseline, work } = await fixture(t)
  await fs.symlink('/etc/passwd', path.join(work, 'public/host-file'))
  await assert.rejects(ensureChangelog(work, baseline), /Symlinks are not allowed/)
})
