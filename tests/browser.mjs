import fs from 'node:fs/promises'
import path from 'node:path'
import os from 'node:os'
import assert from 'node:assert/strict'
import { ROOT, TITLE, readManifest, writeJSON } from '../runner/lib.mjs'
import { launchBrowser, serve } from '../runner/browser.mjs'

const tmp = await fs.mkdtemp(path.join(os.tmpdir(), 'minimax-viewer-test-'))
let host, browser
try {
  await fs.cp(path.join(ROOT, 'dist'), tmp, { recursive: true })
  const manifest = await readManifest()
  assert.ok(manifest.iterations.length, 'Run npm run seed first')
  // Fixtures are confined to this temporary test server, never the real archive.
  const fixture = manifest.iterations[0]
  manifest.iterations = [0, 1, 2].map(id => ({ ...fixture, id, summary: `Test iteration ${id}` }))
  await writeJSON(path.join(tmp, 'manifest.json'), manifest)
  host = await serve(tmp)
  browser = await launchBrowser()
  for (const viewport of [{ width: 1440, height: 1100 }, { width: 390, height: 844 }]) {
    const page = await browser.newPage({ viewport, reducedMotion: 'reduce' })
    const errors = []
    page.on('pageerror', e => errors.push(e.message))
    await page.goto(host.url, { waitUntil: 'networkidle' })
    await page.frameLocator('iframe').getByText(TITLE, { exact: true }).waitFor({ state: 'visible' })
    assert.equal(await page.locator('iframe').getAttribute('sandbox'), 'allow-scripts')
    assert.equal(await page.getByRole('slider').inputValue(), '2')
    await page.getByRole('button', { name: 'Previous iteration' }).click()
    await page.waitForURL('**/?iteration=1')
    assert.equal(await page.getByRole('slider').inputValue(), '1')
    await page.reload({ waitUntil: 'networkidle' })
    assert.equal(await page.getByRole('slider').inputValue(), '1')
    await page.getByRole('slider').focus()
    await page.keyboard.press('ArrowLeft')
    await page.waitForURL('**/?iteration=0')
    await page.getByRole('button', { name: 'Play evolution' }).click()
    await page.waitForURL('**/?iteration=1', { timeout: 6000 })
    await page.getByRole('button', { name: 'Pause playback' }).click()
    await page.getByRole('button', { name: 'Back to latest' }).click()
    assert.equal(new URL(page.url()).search, '')
    await page.getByRole('button', { name: 'What is this?' }).click()
    await page.getByRole('dialog').waitFor()
    await page.keyboard.press('Escape')
    assert.equal(await page.getByRole('dialog').count(), 0)
    await page.getByRole('button', { name: 'Expand page' }).click()
    await page.getByRole('button', { name: 'Exit expanded view' }).click()
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false)
    assert.deepEqual(errors, [])
    await fs.mkdir(path.join(ROOT, '.runner/review'), { recursive: true })
    await page.screenshot({ path: path.join(ROOT, `.runner/review/viewer-${viewport.width}.png`), fullPage: true })
    await page.close()
  }
  console.log('PASS: desktop/mobile iframe, timeline, permalinks, keyboard, autoplay, latest, dialog, expand, and overflow')
} finally { await browser?.close(); await host?.close(); await fs.rm(tmp, { recursive: true, force: true }) }
