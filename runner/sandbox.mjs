import fs from 'node:fs/promises'
import path from 'node:path'
import os from 'node:os'
import { ROOT, command, filesIn, hash, parseUsage, writeJSON, config, summarizeChangelog } from './lib.mjs'

const protectedFiles = ['package.json', 'tsconfig.json', 'vite.config.ts', 'index.html', 'src/main.tsx']
export async function makeCandidate(attempt, context) {
  const work = path.join(attempt, 'work')
  await fs.mkdir(work, { recursive: true })
  await fs.cp(path.join(ROOT, 'experiment'), work, { recursive: true, filter: source => !['dist', 'node_modules'].includes(path.basename(source)) })
  await fs.writeFile(path.join(work, 'ITERATION_CONTEXT.md'), context)
  await fs.writeFile(path.join(work, 'CHANGELOG.md'), '')
  const auth = JSON.parse(await fs.readFile(path.join(os.homedir(), '.local/share/opencode/auth.json'), 'utf8'))
  if (!auth['minimax-coding-plan']) throw new Error('MiniMax provider is not authenticated in OpenCode')
  const home = path.join(attempt, 'home')
  await writeJSON(path.join(home, '.local/share/opencode/auth.json'), { 'minimax-coding-plan': auth['minimax-coding-plan'] })
  const agentConfig = {
    $schema: 'https://opencode.ai/config.json',
    model: config.model, share: 'disabled', autoupdate: false,
    permission: { '*': 'allow', webfetch: 'deny', websearch: 'deny', task: 'deny', external_directory: 'deny' },
    plugin: [],
  }
  await writeJSON(path.join(work, 'opencode.json'), agentConfig)
  return work
}
export async function sandboxCommand(attempt, bin, args, options = {}) {
  const work = path.join(attempt, 'work')
  const home = path.join(attempt, 'home')
  const nodeDir = path.dirname(path.dirname(await fs.realpath(process.execPath)))
  const opencodePath = (await command('which', ['opencode'])).trim()
  const resolver = await fs.realpath('/etc/resolv.conf')
  const mounts = [
    '--unshare-all', '--share-net', '--die-with-parent', '--new-session',
    '--ro-bind', '/usr', '/usr', '--symlink', 'usr/lib', '/lib', '--symlink', 'usr/lib', '/lib64',
    '--ro-bind', '/etc', '/etc', '--proc', '/proc', '--dev', '/dev', '--tmpfs', '/tmp',
    '--dir', '/opt', '--ro-bind', nodeDir, '/opt/node', '--ro-bind', opencodePath, '/opt/opencode',
    '--bind', home, '/home/agent', '--bind', work, '/work',
    '--ro-bind', path.join(ROOT, 'node_modules'), '/work/node_modules',
  ]
  // On systemd-resolved hosts /etc/resolv.conf points into /run, which is otherwise hidden.
  if (resolver !== '/etc/resolv.conf') mounts.push('--ro-bind', resolver, resolver)
  for (const f of [...protectedFiles, 'opencode.json', 'ITERATION_CONTEXT.md']) mounts.push('--ro-bind', path.join(work, f), `/work/${f}`)
  mounts.push('--chdir', '/work', '--clearenv',
    '--setenv', 'HOME', '/home/agent', '--setenv', 'PATH', '/opt/node/bin:/usr/bin:/bin',
    '--setenv', 'XDG_DATA_HOME', '/home/agent/.local/share', '--setenv', 'XDG_CONFIG_HOME', '/home/agent/.config',
    '--setenv', 'XDG_CACHE_HOME', '/home/agent/.cache', '--setenv', 'TERM', 'dumb',
    '--setenv', 'OPENCODE_DISABLE_AUTOUPDATE', 'true', '--setenv', 'OPENCODE_DISABLE_EXTERNAL_SKILLS', 'true',
    '--setenv', 'OPENCODE_DISABLE_LSP_DOWNLOAD', 'true', '--setenv', 'CI', 'true',
    '--setenv', 'npm_config_update_notifier', 'false', bin, ...args)
  return command('bwrap', mounts, options)
}
export async function runModel(attempt) {
  const prompt = await fs.readFile(path.join(ROOT, 'runner/prompt.md'), 'utf8')
  const outFile = await fs.open(path.join(attempt, 'opencode.jsonl'), 'a', 0o600)
  const errFile = await fs.open(path.join(attempt, 'opencode.stderr.log'), 'a', 0o600)
  let output
  try {
    output = await sandboxCommand(attempt, '/opt/opencode', ['run', '--pure', '--model', config.model, '--format', 'json', prompt], {
      timeout: config.timeoutMinutes * 60_000,
      onStdout: chunk => { void outFile.write(chunk) },
      onStderr: chunk => { void errFile.write(chunk) },
    })
  } finally { await outFile.close(); await errFile.close() }
  const { usage, error } = parseUsage(await fs.readFile(path.join(attempt, 'opencode.jsonl'), 'utf8'))
  if (error) throw new Error(`OpenCode: ${error}`)
  if (!usage.steps) throw new Error('OpenCode returned no completed model steps')
  return { usage, promptHash: hash(prompt) }
}
export async function verifyCandidate(attempt) {
  const work = path.join(attempt, 'work')
  const files = await filesIn(work)
  for (const file of protectedFiles) {
    if (hash(await fs.readFile(path.join(work, file))) !== hash(await fs.readFile(path.join(ROOT, 'experiment', file)))) throw new Error(`Protected file changed: ${file}`)
  }
  for (const file of files) {
    if (file.startsWith('src/') || file.startsWith('public/') || file.startsWith('dist/') || [...protectedFiles, 'CHANGELOG.md', 'opencode.json', 'ITERATION_CONTEXT.md'].includes(file)) continue
    throw new Error(`Unexpected file created by model: ${file}`)
  }
  const changes = (await fs.readFile(path.join(work, 'CHANGELOG.md'), 'utf8')).trim()
  if (!changes) throw new Error('Model did not write CHANGELOG.md')
  await sandboxCommand(attempt, '/opt/node/bin/npm', ['run', 'build'], { timeout: 120_000 })
  return summarizeChangelog(changes)
}
