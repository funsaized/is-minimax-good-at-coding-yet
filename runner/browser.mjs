import fs from 'node:fs/promises'
import path from 'node:path'
import http from 'node:http'
import { chromium } from 'playwright'
import { exists, TITLE } from './lib.mjs'

export const SNAPSHOT_CSP = "default-src 'self' data: blob:; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self' data:; connect-src 'none'; object-src 'none'; base-uri 'self'; form-action 'none'"
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.woff2': 'font/woff2', '.woff': 'font/woff', '.ico': 'image/x-icon' }
export async function serve(directory, { snapshot = false } = {}) {
  const server = http.createServer(async (req, res) => {
    try {
      const requestPath = decodeURIComponent(new URL(req.url, 'http://localhost').pathname)
      const target = path.resolve(directory, `.${requestPath.endsWith('/') ? requestPath + 'index.html' : requestPath}`)
      if (!target.startsWith(path.resolve(directory) + path.sep)) { res.writeHead(403); res.end(); return }
      const data = await fs.readFile(target)
      res.setHeader('Content-Type', mime[path.extname(target)] ?? 'application/octet-stream')
      res.setHeader('Access-Control-Allow-Origin', '*')
      res.setHeader('Cache-Control', 'no-store')
      if (snapshot || requestPath.startsWith('/iterations/')) res.setHeader('Content-Security-Policy', SNAPSHOT_CSP)
      res.end(data)
    } catch { res.writeHead(404); res.end('Not found') }
  })
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
  return { url: `http://127.0.0.1:${server.address().port}`, close: () => new Promise(resolve => server.close(resolve)) }
}
export async function launchBrowser() {
  const executablePath = process.env.CHROMIUM_PATH || (await exists('/usr/bin/chromium') ? '/usr/bin/chromium' : undefined)
  return chromium.launch({ executablePath, headless: true, args: ['--disable-dev-shm-usage'] })
}
export async function inspectPage(page, url, { title = true } = {}) {
  const failures = []
  const origin = new URL(url).origin
  page.on('pageerror', error => failures.push(error.message))
  page.on('response', response => { if (response.status() >= 400 && new URL(response.url()).origin === origin) failures.push(`${response.status()} ${response.url()}`) })
  await page.route('**/*', route => {
    const address = route.request().url()
    if (address.startsWith(origin + '/') || address.startsWith('data:') || address.startsWith('blob:')) return route.continue()
    failures.push(`External dependency: ${address}`)
    return route.abort()
  })
  await page.goto(url, { waitUntil: 'networkidle', timeout: 30_000 })
  if (title) {
    if (await page.title() !== TITLE) throw new Error('Required document title changed')
    await page.getByText(TITLE, { exact: true }).first().waitFor({ state: 'visible', timeout: 8000 })
  }
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 2)
  if (overflow) failures.push('Page overflows horizontally')
  if (failures.length) throw new Error(failures.join('\n'))
  return failures
}
export async function captureSnapshot(buildDir, artifactsDir) {
  await fs.mkdir(artifactsDir, { recursive: true })
  const host = await serve(buildDir, { snapshot: true })
  const browser = await launchBrowser()
  try {
    for (const [name, viewport] of [['desktop', { width: 1440, height: 760 }], ['mobile', { width: 390, height: 844 }]]) {
      const context = await browser.newContext({ viewport, reducedMotion: 'reduce' })
      const page = await context.newPage()
      await inspectPage(page, host.url + '/')
      await page.screenshot({ path: path.join(artifactsDir, `${name}.png`), fullPage: false, animations: 'disabled' })
      await context.close()
    }
  } finally { await browser.close(); await host.close() }
}
