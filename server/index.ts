import express from 'express'
import cors from 'cors'
import puppeteer from 'puppeteer'
import path from 'path'
import { fileURLToPath } from 'url'
import { renderResume } from './renderer.ts'
import { SAMPLE_RESUME } from './sample-resume.ts'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3001

app.use(cors())
app.use(express.json({ limit: '2mb' }))

const ALLOWED_THEMES = new Set([
  'stackoverflow', 'even', 'paper', 'spartan', 'flat',
  'orbit', 'onepage', 'cora',
  'modern', 'classy', 'straightforward', 'catppuccin', 'sceptile',
  'modern-extended', 'simplyelegant', 'timeline-fixed',
  'msresume', 'rnord', 'projects', 'printclassy',
])

// Server-side preview cache: theme slug → rendered HTML
// Pre-generated at startup so the first gallery load is instant
const previewCache = new Map<string, string>()

async function warmPreviewCache() {
  const themes = Array.from(ALLOWED_THEMES)
  console.log(`[preview cache] warming ${themes.length} themes…`)
  await Promise.all(
    themes.map(async (theme) => {
      try {
        const html = await renderResume(SAMPLE_RESUME, theme)
        previewCache.set(theme, html)
        console.log(`[preview cache] ✓ ${theme}`)
      } catch (err) {
        console.error(`[preview cache] ✗ ${theme}`, err)
      }
    })
  )
  console.log(`[preview cache] ready (${previewCache.size}/${themes.length} themes)`)
}

// GET /api/preview/:theme — returns locally-rendered HTML from cache
app.get('/api/preview/:theme', (req, res) => {
  const { theme } = req.params

  if (!ALLOWED_THEMES.has(theme)) {
    res.status(404).json({ error: 'Theme not available', theme })
    return
  }

  const html = previewCache.get(theme)
  if (!html) {
    // Cache miss (still warming) — render on demand
    renderResume(SAMPLE_RESUME, theme)
      .then((rendered) => {
        previewCache.set(theme, rendered)
        res.setHeader('Content-Type', 'text/html; charset=utf-8')
        res.send(rendered)
      })
      .catch((err) => {
        console.error('[preview render error]', err)
        res.status(500).json({ error: 'Failed to render theme' })
      })
    return
  }

  res.setHeader('Content-Type', 'text/html; charset=utf-8')
  res.setHeader('Cache-Control', 'public, max-age=3600')
  res.send(html)
})

// POST /api/render — returns rendered HTML for user's resume JSON
app.post('/api/render', async (req, res) => {
  const { resume, theme } = req.body as { resume: unknown; theme?: string }

  if (!resume || typeof resume !== 'object') {
    res.status(400).json({ error: 'Missing or invalid resume JSON' })
    return
  }

  const themeSlug = (typeof theme === 'string' && ALLOWED_THEMES.has(theme))
    ? theme
    : 'stackoverflow'

  try {
    const html = await renderResume(resume, themeSlug)
    res.json({ html, theme: themeSlug })
  } catch (err) {
    console.error('[render error]', err)
    res.status(500).json({ error: 'Failed to render resume' })
  }
})

// POST /api/pdf — returns PDF buffer
app.post('/api/pdf', async (req, res) => {
  const { resume, theme } = req.body as { resume: unknown; theme?: string }

  if (!resume || typeof resume !== 'object') {
    res.status(400).json({ error: 'Missing or invalid resume JSON' })
    return
  }

  const themeSlug = (typeof theme === 'string' && ALLOWED_THEMES.has(theme))
    ? theme
    : 'stackoverflow'

  let html: string
  try {
    html = await renderResume(resume, themeSlug)
  } catch (err) {
    console.error('[render error]', err)
    res.status(500).json({ error: 'Failed to render resume HTML' })
    return
  }

  let browser
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    })
    const page = await browser.newPage()
    await page.setContent(html, { waitUntil: 'networkidle0' })
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '0', right: '0', bottom: '0', left: '0' },
    })
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', 'inline; filename="resume.pdf"')
    res.send(Buffer.from(pdf))
  } catch (err) {
    console.error('[pdf error]', err)
    res.status(500).json({ error: 'Failed to generate PDF' })
  } finally {
    await browser?.close()
  }
})

// Serve the Vite-built frontend in production
const distPath = path.join(__dirname, '..', 'dist')
app.use(express.static(distPath))
app.get('*', (_req, res) => {
  res.sendFile(path.join(distPath, 'index.html'))
})

app.listen(PORT, () => {
  console.log(`JSON Resume server running at http://localhost:${PORT}`)
  // Warm cache after server is ready (non-blocking)
  warmPreviewCache().catch(console.error)
})
