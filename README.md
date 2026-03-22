# JSON Resume Online

A web app for building, previewing, and exporting resumes using the [JSON Resume](https://jsonresume.org) standard. Paste your resume JSON, pick from 20 themes, preview it instantly, and download as HTML or PDF. Preview at [Preview website](https://json-resume-online.onrender.com).

## Features

- **20 themes** — browse a live gallery and pick your favorite
- **JSON editor** — CodeMirror-powered editor with syntax highlighting and validation
- **Live preview** — renders your resume in an iframe using server-side theme packages
- **PDF export** — one-click download via Puppeteer (server-side)
- **HTML export** — download a standalone HTML file of your resume
- **Photo upload** — embed a profile photo directly into your resume JSON

## Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS v4, shadcn/ui
- **Backend**: Express 5, Puppeteer (PDF generation)
- **Theme rendering**: [`jsonresume-theme-*`](https://www.npmjs.com/search?q=jsonresume-theme) packages run server-side

## Local Development

Requires [Bun](https://bun.sh).

```bash
bun install

# Terminal 1 — Express server (theme rendering + PDF)
bun run dev:server

# Terminal 2 — Vite frontend
bun run dev
```

Open [http://localhost:5173](http://localhost:5173).

> The frontend calls the Express server at relative `/api/*` paths. In development, Vite proxies are not configured — run both processes and access the app via the Vite port.

## Deploying to Render

This repo includes a [`render.yaml`](render.yaml) for one-click deployment as a single web service. The Express server builds the Vite frontend and serves it as static files alongside the API.

1. Push to GitHub
2. In [Render](https://render.com), create a new **Web Service** from your repo
3. Render will auto-detect `render.yaml` and configure the build/start commands
4. Set a custom domain in the Render dashboard after deployment

**Build command**: `bun install && bun run build`
**Start command**: `bun start`

### Manual Render setup (without render.yaml)

| Setting       | Value                          |
| ------------- | ------------------------------ |
| Runtime       | Node                           |
| Build Command | `bun install && bun run build` |
| Start Command | `bun start`                    |

## Scripts

```bash
bun run dev          # Vite dev server (frontend only)
bun run dev:server   # Express server with watch mode
bun run build        # TypeScript check + Vite production build
bun run lint         # ESLint
bun run preview      # Preview the production build locally
bun start            # Run the production server
```

## Adding a Theme

1. Install the npm package: `bun add jsonresume-theme-<slug>`
2. Add the slug to `ALLOWED_THEMES` in [`server/index.ts`](server/index.ts)
3. Add a loader to [`server/renderer.ts`](server/renderer.ts)
4. Add an entry to `THEMES` in [`src/lib/themes.ts`](src/lib/themes.ts)

> Themes that use `pug` or `jade` as a template engine are not supported.

## Project Structure

```
src/
  components/        React UI components
  lib/               renderer, themes list, schema validation, sample resume
  pages/             ThemeGallery and ResumeBuilder pages
  assets/            Static assets (avatar image)
server/
  index.ts           Express server — API endpoints + static file serving
  renderer.ts        Server-side theme renderer
  sample-resume.ts   Sample resume used for gallery previews
```
