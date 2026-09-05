import fs from 'node:fs/promises'
import path from 'node:path'
import os from 'node:os'
import { ROOT, RUNTIME, command, config, git, log, readJSON, readState, saveState, writeJSON, sleep } from './lib.mjs'
import { SNAPSHOT_CSP, launchBrowser } from './browser.mjs'

export async function vercelAPI(endpoint, options = {}) {
  const { token } = await readJSON(path.join(os.homedir(), '.local/share/com.vercel.cli/auth.json'))
  const project = await readJSON(path.join(ROOT, '.vercel/project.json'))
  const separator = endpoint.includes('?') ? '&' : '?'
  const response = await fetch(`https://api.vercel.com${endpoint}${separator}teamId=${project.orgId}`, {
    ...options, headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', ...options.headers }, signal: AbortSignal.timeout(30_000),
  })
  const data = await response.json()
  if (!response.ok) throw new Error(`Vercel ${response.status}: ${data.error?.message ?? response.statusText}`)
  return data
}
export async function prepareOutput() {
  await command('npm', ['run', 'build'], { timeout: 120_000 })
  const output = path.join(ROOT, '.vercel/output')
  await fs.rm(output, { recursive: true, force: true })
  await fs.mkdir(output, { recursive: true })
  await fs.cp(path.join(ROOT, 'dist'), path.join(output, 'static'), { recursive: true })
  await writeJSON(path.join(output, 'config.json'), {
    version: 3,
    routes: [
      { src: '/iterations/(.*)', headers: { 'Access-Control-Allow-Origin': '*', 'Cache-Control': 'public, max-age=31536000, immutable', 'Content-Security-Policy': SNAPSHOT_CSP }, continue: true },
      { src: '/manifest.json', headers: { 'Cache-Control': 'no-store' }, continue: true },
      { src: '/', headers: { 'Cache-Control': 'no-cache' }, continue: true },
      { handle: 'filesystem' },
      { src: '/.*', status: 404 },
    ],
  })
}

export async function verifyDeployment(url, expectedId) {
  let manifest
  for (let retry = 0; retry < 12; retry++) {
    const response = await fetch(`${url}/manifest.json?t=${Date.now()}`, { cache: 'no-store', signal: AbortSignal.timeout(30_000) })
    if (response.ok) {
      const data = await response.json()
      if (data.iterations?.at(-1)?.id === expectedId) { manifest = data; break }
    }
    if (retry === 11) throw new Error(`Public manifest not ready for iteration ${expectedId} (HTTP ${response.status})`)
    await sleep(2500)
  }
  const version = manifest.iterations.at(-1)
  if (version?.id !== expectedId) throw new Error(`Expected iteration ${expectedId}, found ${version?.id}`)
  const browser = await launchBrowser()
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } })
    const errors = []
    page.on('pageerror', error => errors.push(error.message))
    await page.goto(`${url}/?iteration=${expectedId}`, { waitUntil: 'networkidle', timeout: 45_000 })
    await page.frameLocator('iframe').getByText('is Minimax M3 good at frontend yet?', { exact: true }).first().waitFor({ state: 'visible', timeout: 20_000 })
    if (errors.length) throw new Error(errors.join('\n'))
  } finally { await browser.close() }
}

export async function publishPending() {
  let state = await readState()
  const pending = state.pending
  if (!pending || pending.stage !== 'archived') throw new Error('No archived iteration is waiting to publish')
  if (await git('status', '--porcelain')) throw new Error('Working tree must be clean before publishing')
  if (await git('rev-parse', 'HEAD') !== pending.archiveCommit) throw new Error('HEAD moved since this iteration was prepared; review before publishing')
  log(`Pushing iteration ${pending.id} to GitHub`)
  await git('push', '-u', 'origin', 'main')
  if (!pending.deploymentUrl) {
    await prepareOutput()
    // The deployment is created without moving the public production domain.
    const output = await command(path.join(ROOT, 'node_modules/.bin/vercel'), ['deploy', '--prebuilt', '--prod', '--skip-domain', '--yes', '--no-color'], { timeout: 600_000, onStderr: chunk => process.stderr.write(chunk) })
    const urls = output.match(/https:\/\/[^\s]+\.vercel\.app/g)
    if (!urls?.length) throw new Error('Vercel did not return a deployment URL')
    pending.deploymentUrl = urls.at(-1)
    state.pending = pending; await saveState(state)
  }
  log(`Verifying ${pending.deploymentUrl}`)
  await verifyDeployment(pending.deploymentUrl, pending.id)
  await command(path.join(ROOT, 'node_modules/.bin/vercel'), ['promote', pending.deploymentUrl, '--yes', '--no-color'], { timeout: 240_000, echo: true })
  const publicUrl = `https://${config.projectName}.vercel.app`
  await verifyDeployment(publicUrl, pending.id)
  state = await readState()
  state.lastPublished = { id: pending.id, commit: pending.archiveCommit, url: publicUrl, deployedAt: new Date().toISOString() }
  state.nextRunAt = new Date(Date.now() + config.intervalMinutes * 60_000).toISOString()
  state.failures = 0
  delete state.pending; delete state.lastError
  await saveState(state)
  log(`Published iteration ${pending.id}: ${publicUrl}`)
  return publicUrl
}
