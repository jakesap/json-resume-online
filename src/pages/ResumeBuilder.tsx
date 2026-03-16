import { useState, useEffect, useCallback, useRef } from 'react'
import { Eye, RotateCcw, FileDown, Download, ImagePlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { JsonEditor } from '@/components/JsonEditor'
import { ValidationPanel } from '@/components/ValidationPanel'
import { validateResumeJson, type ValidationResult } from '@/lib/schema'
import { THEMES, DEFAULT_THEME } from '@/lib/themes'
import { SAMPLE_RESUME } from '@/lib/sample-resume'
import { renderTheme, downloadHtml } from '@/lib/renderer'

function debounce<T extends (...args: Parameters<T>) => void>(fn: T, ms: number) {
  let timer: ReturnType<typeof setTimeout>
  return (...args: Parameters<T>) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), ms)
  }
}

interface ResumeBuilderProps {
  initialTheme?: string
}

export function ResumeBuilder({ initialTheme }: ResumeBuilderProps) {
  const [jsonValue, setJsonValue] = useState(() => JSON.stringify(SAMPLE_RESUME, null, 2))
  const [selectedTheme, setSelectedTheme] = useState(initialTheme ?? DEFAULT_THEME)
  const [validation, setValidation] = useState<ValidationResult | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const prevBlobRef = useRef<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const validateDebounced = useCallback(
    debounce((value: string) => setValidation(validateResumeJson(value)), 300),
    []
  )

  useEffect(() => { validateDebounced(jsonValue) }, [jsonValue, validateDebounced])
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { setValidation(validateResumeJson(jsonValue)) }, [])

  const isValid = validation?.valid === true

  function revokePreviousBlob() {
    if (prevBlobRef.current) {
      URL.revokeObjectURL(prevBlobRef.current)
      prevBlobRef.current = null
    }
  }

  async function renderToHtml(): Promise<string | null> {
    if (!isValid) return null
    setLoading(true)
    setError(null)
    try {
      const resume = JSON.parse(jsonValue)
      return await renderTheme(resume, selectedTheme)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Render failed')
      return null
    } finally {
      setLoading(false)
    }
  }

  async function handlePreview() {
    const html = await renderToHtml()
    if (!html) return
    revokePreviousBlob()
    const blob = new Blob([html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    prevBlobRef.current = url
    setPreviewUrl(url)
  }

  async function handleDownloadPdf() {
    if (!isValid) return
    setLoading(true)
    setError(null)
    try {
      const resume = JSON.parse(jsonValue)
      const response = await fetch('/api/pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resume, theme: selectedTheme }),
      })
      if (!response.ok) throw new Error('PDF generation failed')
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'resume.pdf'
      a.click()
      URL.revokeObjectURL(url)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'PDF generation failed')
    } finally {
      setLoading(false)
    }
  }

  async function handleDownloadHtml() {
    const html = await renderToHtml()
    if (html) downloadHtml(html, 'resume.html')
  }

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const dataUri = reader.result as string
      try {
        const parsed = JSON.parse(jsonValue)
        parsed.basics ??= {}
        parsed.basics.image = dataUri
        setJsonValue(JSON.stringify(parsed, null, 2))
      } catch {
        // JSON currently invalid — ignore
      }
    }
    reader.readAsDataURL(file)
  }

  function handleReset() {
    setJsonValue(JSON.stringify(SAMPLE_RESUME, null, 2))
    revokePreviousBlob()
    setPreviewUrl(null)
    setError(null)
  }

  return (
    <div className="flex gap-4 flex-1 min-h-0">
      {/* Left: Editor pane */}
      <div className="flex flex-col gap-3 w-105 shrink-0 min-h-0">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-sm font-semibold">JSON Resume</h2>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" onClick={() => fileInputRef.current?.click()} className="h-7 text-xs gap-1">
              <ImagePlus className="size-3" />
              Photo
            </Button>
            <Button variant="ghost" size="sm" onClick={handleReset} className="h-7 text-xs gap-1">
              <RotateCcw className="size-3" />
              Reset
            </Button>
          </div>
        </div>
        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />

        <div className="flex-1 rounded-xl border overflow-hidden min-h-0">
          <JsonEditor value={jsonValue} onChange={setJsonValue} className="h-full" />
        </div>

        <ValidationPanel result={validation} />
      </div>

      {/* Right: Controls + preview pane */}
      <div className="flex-1 flex flex-col gap-3 min-h-0 min-w-0">
        {/* Controls */}
        <div className="flex items-center gap-2 flex-wrap shrink-0">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <label className="text-sm font-medium shrink-0">Theme</label>
            <Select value={selectedTheme} onValueChange={setSelectedTheme}>
              <SelectTrigger className="w-56">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {THEMES.map((t) => (
                  <SelectItem key={t.slug} value={t.slug}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 shrink-0">
            <Button variant="outline" size="sm" disabled={!isValid || loading} onClick={handlePreview}>
              <Eye className="size-4" />
              Preview
            </Button>
            <Button variant="outline" size="sm" disabled={!isValid || loading} onClick={handleDownloadHtml}>
              <Download className="size-4" />
              HTML
            </Button>
          </div>
        </div>

        {/* Preview pane */}
        {loading && (
          <div className="flex-1 flex items-center justify-center bg-muted/30 rounded-xl border border-dashed">
            <p className="text-sm text-muted-foreground animate-pulse">Rendering…</p>
          </div>
        )}

        {!loading && error && (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 bg-red-50 rounded-xl border border-red-200 border-dashed">
            <p className="text-sm font-medium text-red-700">Render failed</p>
            <p className="text-xs text-red-500 max-w-xs text-center">{error}</p>
          </div>
        )}

        {!loading && !error && !previewUrl && (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 bg-muted/30 rounded-xl border border-dashed">
            <div className="text-center max-w-xs">
              <p className="text-sm font-medium">Your resume will appear here</p>
              <p className="text-xs text-muted-foreground mt-1">
                Select a theme and click "Preview" to see your resume, or "PDF" to download it.
              </p>
            </div>
          </div>
        )}

        {!loading && !error && previewUrl && (
          <div className="relative flex-1 min-h-0">
            <iframe
              src={previewUrl}
              title="Resume Preview"
              className="h-full w-full rounded-xl border shadow-sm"
            />
            <div className="absolute bottom-4 right-4">
              <Button size="sm" disabled={loading} onClick={handleDownloadPdf} className="shadow-md">
                <FileDown className="size-4" />
                Download PDF
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
