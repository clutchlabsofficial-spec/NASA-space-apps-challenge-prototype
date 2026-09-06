// Collapse the Vite build into one self-contained HTML fragment suitable for
// publishing as an Artifact: no doctype, html, head or body tags — the host
// supplies those — with the stylesheet and bundle inlined.

import { readFile, writeFile, readdir, mkdir } from 'node:fs/promises'
import { join } from 'node:path'

const DIST = 'dist-artifact'
const OUT = 'artifact/cubesat-builder.html'

// A bundle can legitimately contain the characters "</script>" inside a string
// literal, which would close the tag early.
const escapeForInlineScript = (js) =>
  js.replace(/<\/script>/gi, '<\\/script>').replace(/<!--/g, '<\\!--')

const assets = await readdir(join(DIST, 'assets'))
const jsFile = assets.find((f) => f.endsWith('.js'))
const cssFile = assets.find((f) => f.endsWith('.css'))
if (!jsFile) throw new Error('No JS bundle found — run the artifact build first')

const js = await readFile(join(DIST, 'assets', jsFile), 'utf8')
const css = cssFile ? await readFile(join(DIST, 'assets', cssFile), 'utf8') : ''

const html = `<title>CubeSat Builder</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap" rel="stylesheet">
<style>
${css}
</style>
<div id="root"></div>
<script type="module">
${escapeForInlineScript(js)}
</script>
`

await mkdir('artifact', { recursive: true })
await writeFile(OUT, html, 'utf8')

const kb = (n) => `${(n / 1024).toFixed(1)} kB`
console.log(`${OUT}  ${kb(Buffer.byteLength(html))}  (js ${kb(js.length)}, css ${kb(css.length)})`)
