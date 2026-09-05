import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawn } from 'node:child_process'
import { createHash } from 'node:crypto'

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
export const RUNTIME = path.join(ROOT, '.runner')
export const TITLE = 'is Minimax M3 good at frontend yet?'
export const config = JSON.parse(await fs.readFile(path.join(ROOT, 'runner/config.json'), 'utf8'))
export const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))
export const hash = data => createHash('sha256').update(data).digest('hex')
export const exists = async p => { try { await fs.access(p); return true } catch { return false } }
export const readJSON = async (p, fallback) => { try { return JSON.parse(await fs.readFile(p, 'utf8')) } catch (e) { if (e.code === 'ENOENT' && fallback !== undefined) return fallback; throw e } }
export async function writeJSON(p, value) {
  await fs.mkdir(path.dirname(p), { recursive: true })
  const tmp = `${p}.${process.pid}.tmp`
  await fs.writeFile(tmp, JSON.stringify(value, null, 2) + '\n', { mode: 0o600 })
  await fs.rename(tmp, p)
}
export const readState = () => readJSON(path.join(RUNTIME, 'state.json'), { failures: 0, days: {} })
export const saveState = value => writeJSON(path.join(RUNTIME, 'state.json'), value)
export const readManifest = () => readJSON(path.join(ROOT, 'public/manifest.json'))
export const log = message => console.log(`[${new Date().toISOString()}] ${message}`)

export function command(bin, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(bin, args, { cwd: options.cwd ?? ROOT, env: options.env ?? process.env, detached: true, stdio: ['ignore', 'pipe', 'pipe'] })
    let stdout = '', stderr = '', timedOut = false
    const onOut = chunk => { stdout = (stdout + chunk).slice(-4_000_000); options.onStdout?.(chunk); if (options.echo) process.stdout.write(chunk) }
    const onErr = chunk => { stderr = (stderr + chunk).slice(-100_000); options.onStderr?.(chunk); if (options.echo) process.stderr.write(chunk) }
    child.stdout.on('data', onOut); child.stderr.on('data', onErr)
    const kill = () => { try { process.kill(-child.pid, 'SIGKILL') } catch {} }
    const timer = setTimeout(() => { timedOut = true; kill() }, options.timeout ?? 120_000)
    const onSignal = () => kill()
    process.once('SIGTERM', onSignal); process.once('SIGINT', onSignal)
    child.on('error', err => { clearTimeout(timer); process.off('SIGTERM', onSignal); process.off('SIGINT', onSignal); reject(err) })
    child.on('close', code => {
      clearTimeout(timer); process.off('SIGTERM', onSignal); process.off('SIGINT', onSignal)
      if (code === 0 && !timedOut) resolve(stdout.trim())
      else reject(new Error(`${bin} ${timedOut ? 'timed out' : `exited ${code}`}: ${(stderr || stdout).slice(-3500)}`))
    })
  })
}
export const git = (...args) => command('git', args)
export async function filesIn(dir, prefix = '') {
  const result = []
  for (const entry of await fs.readdir(path.join(dir, prefix), { withFileTypes: true })) {
    const rel = path.join(prefix, entry.name)
    if (entry.isSymbolicLink()) throw new Error(`Symlinks are not allowed in snapshots: ${rel}`)
    if (entry.isDirectory()) result.push(...await filesIn(dir, rel))
    else if (entry.isFile()) result.push(rel)
  }
  return result.sort()
}
export async function directorySize(dir) {
  if (!await exists(dir)) return 0
  const files = await filesIn(dir)
  const stats = await Promise.all(files.map(f => fs.stat(path.join(dir, f))))
  return stats.reduce((total, stat) => total + stat.size, 0)
}
export function parseUsage(output) {
  const usage = { estimatedCostUsd: 0, inputTokens: 0, outputTokens: 0, steps: 0 }
  let error
  for (const line of output.split('\n')) {
    let event; try { event = JSON.parse(line) } catch { continue }
    if (event.type === 'error') error = event.error?.data?.message ?? event.error?.message ?? JSON.stringify(event.error)
    if (event.type === 'step_finish') {
      usage.steps++
      usage.estimatedCostUsd += Number(event.part?.cost ?? 0)
      usage.inputTokens += Number(event.part?.tokens?.input ?? 0)
      usage.outputTokens += Number(event.part?.tokens?.output ?? 0)
    }
  }
  return { usage, error }
}
export function summarizeChangelog(text) {
  const lines = text.split('\n').map(line => line.trim()).filter(Boolean)
  const meaningful = lines.find(line => !/^#{1,6}\s/.test(line)) ?? lines[0] ?? 'Updated the page'
  return meaningful.replace(/^[-*]\s+/, '').replace(/^#+\s*/, '').slice(0, 120)
}
export function dailyGate(state, now = new Date()) {
  const day = now.toISOString().slice(0, 10)
  const entry = state.days?.[day] ?? { runs: 0, estimatedCostUsd: 0 }
  if (entry.runs >= config.maxRunsPerDay) return 'Daily run allowance reached'
  if (entry.estimatedCostUsd >= config.maxEstimatedDailyCostUsd) return 'Reported daily cost allowance reached'
  return null
}
export async function acquireLock() {
  await fs.mkdir(RUNTIME, { recursive: true })
  const lock = path.join(RUNTIME, 'lock')
  try { await fs.mkdir(lock) } catch (e) {
    if (e.code !== 'EEXIST') throw e
    const previous = await readJSON(path.join(lock, 'owner.json'), null)
    if (previous?.pid) {
      try { process.kill(previous.pid, 0); throw new Error(`Worker already running (PID ${previous.pid})`) }
      catch (err) { if (err.code !== 'ESRCH') throw err }
    } else {
      const stat = await fs.stat(lock)
      if (Date.now() - stat.mtimeMs < 60_000) throw new Error('Another worker is acquiring the lock')
    }
    await fs.rm(lock, { recursive: true, force: true }); await fs.mkdir(lock)
  }
  await writeJSON(path.join(lock, 'owner.json'), { pid: process.pid, startedAt: new Date().toISOString() })
  return () => fs.rm(lock, { recursive: true, force: true })
}
