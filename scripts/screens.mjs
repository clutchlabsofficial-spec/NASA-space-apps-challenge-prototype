import { chromium, devices } from 'playwright'
import { createServer } from 'vite'
const server = await createServer({ server: { port: 5197, strictPort: true } })
await server.listen()
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' })
let fail = 0
for (const [label, opts] of [['phone', devices['Pixel 7']], ['desktop', { viewport: { width: 1440, height: 900 } }]]) {
  const ctx = await browser.newContext(opts)
  for (const screen of ['launch', 'parts', 'guide', 'review']) {
    const page = await ctx.newPage()
    const errs = []
    page.on('pageerror', e => errs.push(e.message))
    page.on('console', m => { if (m.type()==='error' && !/Failed to load resource/.test(m.text())) errs.push(m.text()) })
    await page.goto(`http://localhost:5197/?screen=${screen}`, { waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(1500)
    const info = await page.evaluate(() => ({
      over: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
      sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth,
      text: (document.body.innerText || '').length,
    }))
    const bad = info.over || info.text < 50 || errs.length
    if (bad) fail++
    console.log(`${bad?'✗':'✓'} [${label}] ${screen}: text=${info.text} overflow=${info.over?`${info.sw}/${info.cw}`:'no'}${errs.length?` errors=${errs.slice(0,2).join(' | ').slice(0,180)}`:''}`)
    await page.close()
  }
  await ctx.close()
}
await browser.close(); await server.close()
console.log(fail ? `\nFAILURES: ${fail}` : '\nSCREENS OK')
process.exit(fail?1:0)
