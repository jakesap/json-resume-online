import { useState, useCallback } from 'react'
import { Search } from 'lucide-react'
import { THEMES, type Theme } from '@/lib/themes'
import { ThemeCard } from '@/components/ThemeCard'

interface ThemeGalleryProps {
  onSelectTheme?: (theme: Theme) => void
}

export function ThemeGallery({ onSelectTheme }: ThemeGalleryProps) {
  const [search, setSearch] = useState('')
  const [unavailable, setUnavailable] = useState<Set<string>>(new Set())

  const handleUnavailable = useCallback((slug: string) => {
    setUnavailable((prev) => {
      if (prev.has(slug)) return prev
      const next = new Set(prev)
      next.add(slug)
      return next
    })
  }, [])

  const filtered = THEMES.filter(
    (t) =>
      !unavailable.has(t.slug) &&
      (t.label.toLowerCase().includes(search.toLowerCase()) ||
        t.slug.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="flex items-center gap-4 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search themes…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <span className="text-sm text-muted-foreground shrink-0">
          {filtered.length} theme{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {filtered.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
          No themes match "{search}"
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 overflow-y-auto pb-4">
          {filtered.map((theme) => (
            <ThemeCard
              key={theme.slug}
              theme={theme}
              onSelect={onSelectTheme}
              onUnavailable={handleUnavailable}
            />
          ))}
        </div>
      )}
    </div>
  )
}
