/**
 * Smoke test: walk the real flow in a real browser, on a phone and a desktop
 * viewport, and fail loudly on console errors or horizontal overflow.
 *
 * Overflow is checked explicitly because it is the failure this app keeps
 * producing: a grid child defaults to `min-width: auto`, so one long string
 * silently widens the whole page past the viewport on a phone.
 */
import { chromium, devices } from 'playwright'
import { createServer } from 'vite'

const server = await createServer({ server: { port: 5199, strictPort: true } })
await server.listen()
const base = 'http://localhost:5199'

const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' })
let failures = 0

for (const [label, ctxOpts] of [
  ['phone', { ...devices['Pixel 7'] }],
  ['desktop', { viewport: { width: 1440, height: 900 } }],
]) {
  const ctx = await browser.newContext(ctxOpts)
  const page = await ctx.newPage()
  const errors = []
  const badUrls = []
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()) })
  page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`))
  page.on('response', (r) => { if (r.status() >= 400) badUrls.push(`${r.status()} ${r.url()}`) })
  page.on('requestfailed', (r) => badUrls.push(`FAILED ${r.url()} ${r.failure()?.errorText || ''}`))

  const overflow = async (where) => {
    const bad = await page.evaluate(() =>
      document.documentElement.scrollWidth > document.documentElement.clientWidth + 1
        ? { scroll: document.documentElement.scrollWidth, client: document.documentElement.clientWidth }
        : null)
    if (bad) { console.log(`  ✗ [${label}] overflow at ${where}: ${bad.scroll}px in ${bad.client}px`); failures++ }
    else console.log(`  ✓ [${label}] no overflow at ${where}`)
  }

  await page.goto(base, { waitUntil: 'networkidle' })

  // 1. Age gate
  await page.waitForSelector('.gate', { timeout: 15000 })
  await overflow('age gate')
  await page.fill('.gate__input', '9')
  const modeText = await page.textContent('.gate__modelabel')
  console.log(`  · age 9 -> ${modeText.replace(/\s+/g, ' ').trim()}`)
  await page.click('.gate__go')

  // 2. Mission select
  await page.waitForSelector('.missions, .mission, [class*=mission]', { timeout: 15000 })
  await overflow('mission select')
  const missionBtn = page.locator('button', { hasText: /wildfire|flood|ice|start|choose|pick/i }).first()
  if (await missionBtn.count()) await missionBtn.click()
  else await page.locator('.shell button').first().click()

  // 3. Path map
  await page.waitForTimeout(700)
  await overflow('path map')

  // 4. Open first station -> should land on the LESSON, not options
  const node = page.locator('.pathnode__btn').first()
  if (await node.count()) {
    await node.click()
    await page.waitForTimeout(900)
    const hasLesson = await page.locator('.lesson').count()
    const hasAxis = await page.locator('.axis').count()
    const hasPhotoImg = await page.locator('.lesson__figure img').count()
    console.log(`  · station opens with lesson=${hasLesson} axis=${hasAxis} photo=${hasPhotoImg}`)
    if (!hasLesson || !hasAxis) { console.log(`  ✗ [${label}] station did not open on a lesson`); failures++ }
    await overflow('lesson')

    // photo actually loaded?
    const loaded = await page.evaluate(() => {
      const i = document.querySelector('.lesson__figure img')
      return i ? { complete: i.complete, w: i.naturalWidth } : null
    })
    console.log(`  · lesson photo: ${JSON.stringify(loaded)}`)
    if (loaded && loaded.w === 0) { console.log(`  ! [${label}] lesson photo did not load (may be sandbox network)`) }

    // 5. Go to Describe
    const next = page.locator('.lesson__next')
    if (await next.count()) {
      await next.click()
      await page.waitForTimeout(700)
      const hasDescribe = await page.locator('.describe__box').count()
      const seeds = await page.locator('.seed').count()
      console.log(`  · describe box=${hasDescribe} seeds=${seeds}`)
      if (!hasDescribe) { console.log(`  ✗ [${label}] no describe box`); failures++ }
      await overflow('describe')
    }
  } else {
    console.log(`  ✗ [${label}] no path node found`); failures++
  }

  /* Sandbox-only noise: the agent proxy's CA is not in this Chromium, so every
     outbound https request fails with ERR_CERT_AUTHORITY_INVALID here and
     works fine on a real device. Favicon 404s are cosmetic. Both are excluded
     so the test fails only on things that are actually broken. */
  const sandboxNoise = /favicon|fonts\.googleapis|fonts\.gstatic|ERR_CERT_AUTHORITY_INVALID|images-assets\.nasa\.gov|adafruit\.com/i
  const realBad = badUrls.filter((u) => !sandboxNoise.test(u))
  const genericConsole = /Failed to load resource/i
  const real = errors.filter((e) => !sandboxNoise.test(e) && !(genericConsole.test(e) && !realBad.length))
  if (real.length || realBad.length) {
    console.log(`  ✗ [${label}] errors:`)
    real.slice(0, 5).forEach((e) => console.log('     ', e.slice(0, 200)))
    realBad.slice(0, 5).forEach((u) => console.log('     ', u.slice(0, 160)))
    failures += real.length + realBad.length
  } else {
    console.log(`  ✓ [${label}] no console or network errors (sandbox TLS noise excluded)`)
  }

  await ctx.close()
}

await browser.close()
await server.close()
console.log(failures ? `\nFAILURES: ${failures}` : '\nALL CLEAR')
process.exit(failures ? 1 : 0)
