// Client-side renderer — delegates all theme rendering to the Express server.
// The server (server/index.ts) renders using jsonresume-theme-* packages in Node.js,
// which is the environment those packages were designed for.

export async function renderTheme(resume: unknown, slug: string): Promise<string> {
  const response = await fetch('/api/render', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ resume, theme: slug }),
  })
  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: 'Server error' }))
    throw new Error((err as { error?: string }).error ?? 'Render failed')
  }
  const data = await response.json() as { html: string; theme: string }
  return data.html
}

export function printResume(html: string) {
  const win = window.open('', '_blank')
  if (!win) {
    alert('Please allow pop-ups to print your resume.')
    return
  }
  win.document.open()
  win.document.write(html)
  win.document.close()
  win.onload = () => {
    win.focus()
    win.print()
  }
}

export function downloadHtml(html: string, filename = 'resume.html') {
  const blob = new Blob([html], { type: 'text/html' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
