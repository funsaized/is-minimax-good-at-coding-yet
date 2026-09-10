import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { parseUsage, dailyGate, config, filesIn, writeJSON, readJSON, summarizeChangelog, nextRunAt, failureRetryAt } from '../runner/lib.mjs'
import { serve } from '../runner/browser.mjs'
import { retryVercel } from '../runner/publish.mjs'

test('OpenCode failures are detected even when the process exits successfully', () => {
  const output = [
    'unstructured startup log',
    JSON.stringify({ type: 'step_finish', part: { cost: 0.02, tokens: { input: 120, output: 40 } } }),
    JSON.stringify({ type: 'step_finish', part: { cost: 0.03, tokens: { input: 200, output: 80 } } }),
    JSON.stringify({ type: 'error', error: { data: { message: 'Rate limit reached' } } }),
  ].join('\n')
  assert.deepEqual(parseUsage(output), { usage: { estimatedCostUsd: 0.05, inputTokens: 320, outputTokens: 120, steps: 2 }, error: 'Rate limit reached' })
})

test('daily limits stop new runs and reset on the next UTC date', () => {
  const state = { days: { '2026-09-05': { runs: config.maxRunsPerDay, estimatedCostUsd: 0 } } }
  assert.match(dailyGate(state, new Date('2026-09-05T23:59:00Z')), /run allowance/)
  assert.equal(dailyGate(state, new Date('2026-09-06T00:01:00Z')), null)
  state.days['2026-09-05'] = { runs: 1, estimatedCostUsd: config.maxEstimatedDailyCostUsd }
  assert.match(dailyGate(state, new Date('2026-09-05T01:00:00Z')), /cost allowance/)
})

test('timeline descriptions use the design summary rather than a generic changelog heading', () => {
  assert.equal(summarizeChangelog('# Iteration 1\n\nA warm composition with drifting particles.\n\n- Added SVG.'), 'A warm composition with drifting particles.')
  assert.equal(summarizeChangelog('Refined the typography.\n\nDetails'), 'Refined the typography.')
  assert.equal(summarizeChangelog('a'.repeat(200)).length, 120)
})

test('30-minute cadence includes generation time and never overlaps long turns', () => {
  const start = '2026-09-05T10:00:00.000Z'
  assert.equal(nextRunAt({ startedAt: start }, Date.parse('2026-09-05T10:06:00Z'), 30), '2026-09-05T10:30:00.000Z')
  assert.equal(nextRunAt({ startedAt: start }, Date.parse('2026-09-05T10:38:00Z'), 30), '2026-09-05T10:38:00.000Z')
  assert.equal(nextRunAt({ acceptedAt: '2026-09-05T10:06:00Z', durationSeconds: 360 }, Date.parse('2026-09-05T10:07:00Z'), 30), '2026-09-05T10:30:00.000Z')
  assert.equal(failureRetryAt(Date.parse('2026-09-05T10:00:00Z'), 30), '2026-09-05T10:30:00.000Z')
})

test('transient Vercel failures retry with exponential backoff', async () => {
  const delays = []
  let calls = 0
  const result = await retryVercel('test deployment', async () => {
    calls++
    if (calls < 3) throw new Error('Vercel exited 1: Error: Not authorized')
    return 'deployed'
  }, { attempts: 4, baseDelayMs: 10, wait: async delay => delays.push(delay) })
  assert.equal(result, 'deployed')
  assert.equal(calls, 3)
  assert.deepEqual(delays, [10, 20])
})

test('non-transient Vercel failures are not retried', async () => {
  let calls = 0
  await assert.rejects(retryVercel('test deployment', async () => {
    calls++
    throw new Error('Invalid project configuration')
  }, { wait: async () => {} }), /Invalid project configuration/)
  assert.equal(calls, 1)
})

test('snapshot validation rejects symlinks that could archive host files', async () => {
  const tmp = await fs.mkdtemp(path.join(os.tmpdir(), 'minimax-test-'))
  try {
    await fs.symlink('/etc/passwd', path.join(tmp, 'host-file'))
    await assert.rejects(filesIn(tmp), /Symlinks are not allowed/)
  } finally { await fs.rm(tmp, { recursive: true, force: true }) }
})

test('manifest writes are atomic and static assets permit opaque iframe origins', async () => {
  const tmp = await fs.mkdtemp(path.join(os.tmpdir(), 'minimax-test-'))
  let server
  try {
    await writeJSON(path.join(tmp, 'manifest.json'), { iterations: [{ id: 0 }] })
    await writeJSON(path.join(tmp, 'manifest.json'), { iterations: [{ id: 0 }, { id: 1 }] })
    assert.equal((await readJSON(path.join(tmp, 'manifest.json'))).iterations.length, 2)
    assert.deepEqual(await fs.readdir(tmp), ['manifest.json'])
    server = await serve(tmp, { snapshot: true })
    const response = await fetch(server.url + '/manifest.json')
    assert.equal(response.headers.get('access-control-allow-origin'), '*')
    assert.match(response.headers.get('content-security-policy'), /connect-src 'none'/)
    assert.equal((await fetch(server.url + '/missing.js')).status, 404)
  } finally { await server?.close(); await fs.rm(tmp, { recursive: true, force: true }) }
})
