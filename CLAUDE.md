# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
bun run dev          # Start Vite dev server only (frontend, no server needed)
bun run dev:server   # Start the optional Express/Puppeteer server (not required)
bun run build        # TypeScript check + Vite production build
bun run lint         # ESLint
bun run preview      # Preview the production build locally
```

There are no tests.

## Architecture

This is a **100% client-side** React + Vite app. There is no required server — everything renders in the browser.

### How theme rendering works

Theme packages (`jsonresume-theme-*`) are standard npm packages designed for Node.js (they call `fs.readFileSync(__dirname + "/template.hbs")`). A custom Vite plugin called `inlineThemeTemplates` in `vite.config.ts` transforms these modules at build time, replacing every `readFileSync(...)` call with the actual file contents inlined as a string literal. This makes them work in the browser.

`src/lib/renderer.ts` exports:
- `renderTheme(resume, slug)` — dynamically imports the requested theme package and calls its `render()` function, returning an HTML string
- `printResume(html)` — opens a popup window and calls `window.print()` (browser-native PDF save)
- `downloadHtml(html)` — triggers a file download of the HTML string

The module-level `previewCache` Map in `ThemeCard.tsx` caches blob URLs for the lifetime of the page so gallery previews are only rendered once per session.

### Theme eligibility rules

Not all installed `jsonresume-theme-*` packages can run in the browser:
- **Excluded entirely**: themes that use `pug` or `jade` as a template engine (their compiler is Node.js-only and causes Vite pre-bundle failures)
- **Supported via the inline plugin**: themes that use `fs.readFileSync(__dirname + "/path")` or `path.join(__dirname, ...)` followed by `readFileSync`

To check whether a theme candidate is safe to add:
```bash
# Fails on pug/jade — exclude
grep -q '"pug"' node_modules/jsonresume-theme-SLUG/package.json && echo "EXCLUDE (pug)"
# Fails on fs at runtime unless handled by the inline plugin
grep -n "readFileSync\|__dirname" node_modules/jsonresume-theme-SLUG/index.js | head -5
```

When adding a new theme: add it to `THEME_PACKAGES` in `vite.config.ts`, to `THEME_LOADERS` in `src/lib/renderer.ts`, and to `THEMES` in `src/lib/themes.ts`.

### Node.js stubs

`src/stubs/fs.ts` is a no-op browser stub for the `fs` module. `path` is aliased to `path-browserify`. Both are configured in `vite.config.ts` under `resolve.alias`. After the inline plugin runs, these stubs are never actually called — they just prevent bundle errors from the lingering `require('fs')` references in theme packages.

### Key files

| File | Purpose |
|---|---|
| `vite.config.ts` | `inlineThemeTemplates` plugin, `fs`/`path` aliases, `__dirname` define, `optimizeDeps` |
| `src/lib/renderer.ts` | Client-side theme loader + print/download helpers |
| `src/lib/themes.ts` | Authoritative list of enabled themes |
| `src/lib/sample-resume.ts` | Comprehensive John Doe resume used as default; avatar imported as a Vite asset |
| `src/lib/schema.ts` | Embedded JSON Resume schema + AJV validation (draft-04, `$schema` stripped before compile) |
| `src/components/ThemeCard.tsx` | Lazy intersection-observer loading + module-level blob URL cache |
| `src/pages/ResumeBuilder.tsx` | JSON editor + theme selector + Preview / HTML download / Print PDF |
| `server/` | Optional Express server (PDF via Puppeteer). Not required; kept for reference. Run with `bun run dev:server`. |

### Layout constraints

The app uses `h-screen overflow-hidden` on the root and propagates height via `flex flex-col min-h-0` chains so both the JSON editor (CodeMirror) and the preview iframe scroll independently without the page scrolling. `TabsContent` in `src/components/ui/tabs.tsx` has `flex flex-col min-h-0` added to participate in this chain.
