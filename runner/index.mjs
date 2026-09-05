import fs from 'node:fs/promises'
import path from 'node:path'
import { randomUUID } from 'node:crypto'
import { ROOT, RUNTIME, TITLE, config, command, readJSON, writeJSON, readState, saveState, readManifest, log, sleep, exists, hash, git, directorySize, acquireLock, dailyGate, parseUsage } from './lib.mjs'
import { captureSnapshot } from './browser.mjs'
import { makeCandidate, runModel, verifyCandidate } from './sandbox.mjs'
import { publishPending } from './publish.mjs'

async function commitIfChanged(message, paths) {
  await git('add', '--', ...paths)
  if (await git('diff', '--cached', '--name-only')) await git('commit', '-m', message)
  return git('rev-parse', 'HEAD')
}

async function finishCandidate() {
  let state = await readState()
  const p = state.pending
  if (!p) throw new Error('No candidate to finish')
  if (p.stage === 'validated') {
    if (!p.seed) {
      for (const directory of ['src', 'public']) {
        const dest = path.join(ROOT, 'experiment', directory)
        await fs.rm(dest, { recursive: true, force: true })
        await fs.cp(path.join(p.attempt, 'work', directory), dest, { recursive: true })
      }
      await fs.copyFile(path.join(p.attempt, 'work/CHANGELOG.md'), path.join(ROOT, 'experiment/CHANGELOG.md'))
    }
    p.sourceCommit = await commitIfChanged(p.seed ? 'chore: preserve original black-page seed' : `feat: MiniMax M3 iteration ${p.id} — ${p.summary}`, ['experiment'])
    p.stage = 'source'; state.pending = p; await saveState(state)
  }
  if (p.stage === 'source') {
    const folder = String(p.id).padStart(6, '0')
    const destination = path.join(ROOT, 'public/iterations', folder)
    const record = {
      id: p.id, parentId: p.id === 0 ? null : p.id - 1, createdAt: p.acceptedAt,
      summary: p.summary, path: `/iterations/${folder}/index.html`,
      screenshot: `/iterations/${folder}/desktop.png`, mobileScreenshot: `/iterations/${folder}/mobile.png`,
      sourceCommit: p.sourceCommit, model: p.seed ? 'seed' : config.model,
      durationSeconds: p.durationSeconds, promptHash: p.promptHash, usage: p.usage,
    }
    const metadataPath = path.join(destination, 'metadata.json')
    if (await exists(metadataPath)) {
      const previous = await readJSON(metadataPath)
      if (JSON.stringify(previous) !== JSON.stringify(record)) throw new Error('Refusing to overwrite an archived iteration')
    } else {
      await fs.mkdir(destination, { recursive: true })
      await fs.cp(path.join(p.attempt, 'work/dist'), destination, { recursive: true })
      for (const file of ['desktop.png', 'mobile.png']) await fs.copyFile(path.join(p.attempt, 'artifacts', file), path.join(destination, file))
      await writeJSON(metadataPath, record)
    }
    const manifest = await readManifest()
    if (!manifest.iterations.some(v => v.id === p.id)) {
      if (manifest.iterations.length !== p.id) throw new Error('Archive sequence is inconsistent')
      manifest.iterations.push(record)
      await writeJSON(path.join(ROOT, 'public/manifest.json'), manifest)
    }
    p.archiveCommit = await commitIfChanged(`archive: preserve iteration ${p.id}`, ['public'])
    p.stage = 'archived'; state.pending = p; await saveState(state)
  }
  return p
}

async function seed() {
  const manifest = await readManifest()
  if (manifest.iterations.length) { log('Seed already exists'); return }
  if ((await readState()).pending) { await finishCandidate(); return }
  const attempt = path.join(RUNTIME, 'attempts', 'seed')
  const work = path.join(attempt, 'work')
  await fs.mkdir(work, { recursive: true })
  await fs.cp(path.join(ROOT, 'experiment'), work, { recursive: true, filter: source => path.basename(source) !== 'dist' })
  // The seed is trusted scaffold code. Model-generated builds use the isolated sandbox.
  await command(path.join(ROOT, 'node_modules/.bin/tsc'), ['--noEmit'], { cwd: path.join(ROOT, 'experiment') })
  await command(path.join(ROOT, 'node_modules/.bin/vite'), ['build'], { cwd: path.join(ROOT, 'experiment') })
  await fs.cp(path.join(ROOT, 'experiment/dist'), path.join(work, 'dist'), { recursive: true })
  await captureSnapshot(path.join(work, 'dist'), path.join(attempt, 'artifacts'))
  const state = await readState()
  state.pending = { id: 0, seed: true, attempt, stage: 'validated', acceptedAt: new Date().toISOString(), summary: 'A black page. One question. The beginning.', durationSeconds: 0, promptHash: hash(await fs.readFile(path.join(ROOT, 'runner/prompt.md'))), usage: null }
  await saveState(state); await finishCandidate()
  log('Iteration 0 archived. Run npm run publish to deploy it.')
}

async function once() {
  let state = await readState()
  if (state.pending) { await finishCandidate(); return publishPending() }
  if (await exists(path.join(RUNTIME, 'paused'))) throw new Error('Worker is paused; run npm run resume')
  const gate = dailyGate(state)
  if (gate) throw new Error(gate)
  if (await git('status', '--porcelain')) throw new Error('Working tree has uncommitted changes; commit them before starting the worker')
  await git('pull', '--ff-only', 'origin', 'main')
  const manifest = await readManifest()
  if (!manifest.iterations.length || !state.lastPublished) throw new Error('Publish the seed before starting MiniMax')
  if (await directorySize(path.join(ROOT, 'public/iterations')) >= config.maxArchiveBytes) throw new Error('Archive size limit reached; increase maxArchiveBytes deliberately before continuing')
  const id = manifest.iterations.at(-1).id + 1
  const started = Date.now()
  const attempt = path.join(RUNTIME, 'attempts', `${String(id).padStart(6, '0')}-${randomUUID()}`)
  await fs.mkdir(attempt, { recursive: true })
  const recent = manifest.iterations.slice(-8).map(v => `- Iteration ${v.id}: ${v.summary}`).join('\n')
  await makeCandidate(attempt, `# Current experiment\n\nYou are building iteration ${id}, based on published iteration ${id - 1}.\n\nRequired title: ${TITLE}\n\n## Recent history\n${recent}\n\nThe surrounding time-machine viewer is outside your workspace. Evolve only this page.\n`)
  const day = new Date().toISOString().slice(0, 10)
  state.days ??= {}; state.days[day] ??= { runs: 0, estimatedCostUsd: 0 }
  state.days[day].runs++
  state.activeAttempt = { id, attempt, startedAt: new Date(started).toISOString() }
  await saveState(state)
  log(`MiniMax M3 is developing iteration ${id}`)
  let result
  try {
    result = await runModel(attempt)
    const summary = await verifyCandidate(attempt)
    const work = path.join(attempt, 'work')
    // A changed changelog alone is not a completed visual attempt.
    const oldSource = await command('git', ['diff', '--no-index', '--stat', path.join(ROOT, 'experiment/src'), path.join(work, 'src')]).catch(e => e.message)
    const oldAssets = await command('git', ['diff', '--no-index', '--stat', path.join(ROOT, 'experiment/public'), path.join(work, 'public')]).catch(e => e.message)
    if (!oldSource && !oldAssets) throw new Error('Model made no page changes')
    await captureSnapshot(path.join(work, 'dist'), path.join(attempt, 'artifacts'))
    const size = await directorySize(path.join(work, 'dist')) + await directorySize(path.join(attempt, 'artifacts'))
    if (size > config.maxSnapshotBytes) throw new Error('Snapshot exceeds the configured size allowance')
    if (size + await directorySize(path.join(ROOT, 'public/iterations')) > config.maxArchiveBytes) throw new Error('Archive would exceed configured size allowance')
    state = await readState()
    state.pending = { id, attempt, stage: 'validated', startedAt: new Date(started).toISOString(), acceptedAt: new Date().toISOString(), summary, durationSeconds: Math.round((Date.now() - started) / 1000), ...result }
    await saveState(state)
  } finally {
    state = await readState()
    const raw = await fs.readFile(path.join(attempt, 'opencode.jsonl'), 'utf8').catch(() => '')
    const usage = result?.usage ?? parseUsage(raw).usage
    state.days[day].estimatedCostUsd += usage.estimatedCostUsd
    delete state.activeAttempt
    await saveState(state)
    // Only the model provider credential was copied here; remove it after the turn.
    await fs.rm(path.join(attempt, 'home/.local/share/opencode/auth.json'), { force: true })
  }
  await finishCandidate()
  return publishPending()
}

async function recordFailure(error) {
  const state = await readState()
  state.failures = (state.failures ?? 0) + 1
  state.lastError = { message: error.message, at: new Date().toISOString() }
  state.nextRunAt = new Date(Date.now() + Math.min(60, 5 * 2 ** (state.failures - 1)) * 60_000).toISOString()
  await saveState(state)
  log(`Attempt failed: ${error.message}`)
  if (state.failures >= config.maxConsecutiveFailures) {
    await fs.writeFile(path.join(RUNTIME, 'paused'), `Paused after ${state.failures} failures. ${error.message}\n`)
    log('Worker paused after repeated failures. Review npm run status, then npm run resume.')
  }
}

async function loop() {
  log(`Local worker started. Model: ${config.model}; interval: ${config.intervalMinutes} minutes`)
  for (;;) {
    const state = await readState()
    if (await exists(path.join(RUNTIME, 'paused')) || (!state.pending && dailyGate(state))) { await sleep(15_000); continue }
    if (state.nextRunAt && new Date(state.nextRunAt).getTime() > Date.now()) { await sleep(15_000); continue }
    try { await once() } catch (error) { await recordFailure(error) }
  }
}

const action = process.argv[2]
await fs.mkdir(RUNTIME, { recursive: true })
if (action === 'status') {
  const state = await readState()
  console.log(JSON.stringify({ paused: await exists(path.join(RUNTIME, 'paused')), model: config.model, intervalMinutes: config.intervalMinutes, ...state }, null, 2))
} else if (action === 'pause') {
  await fs.writeFile(path.join(RUNTIME, 'paused'), 'Paused by operator\n'); log('Paused. Any active iteration will finish publishing; no new iteration will start.')
} else if (action === 'resume') {
  // The pause marker can be changed while the worker holds its process lock.
  await fs.rm(path.join(RUNTIME, 'paused'), { force: true }); log('Resumed; the worker will retry at its next scheduled check.')
} else if (['seed', 'once', 'loop', 'publish'].includes(action)) {
  const release = await acquireLock()
  let terminating = false
  for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => {
    if (terminating) return
    terminating = true
    void release().finally(() => process.exit(0))
  })
  try {
    if (action === 'seed') await seed()
    if (action === 'once') await once()
    if (action === 'publish') { await finishCandidate(); await publishPending() }
    if (action === 'loop') await loop()
  } catch (error) { await recordFailure(error); process.exitCode = 1 }
  finally { await release() }
} else {
  console.error('Usage: node runner/index.mjs seed|once|loop|publish|status|pause|resume'); process.exitCode = 1
}
