import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { renderTheme } from "@/lib/renderer";
import { SAMPLE_RESUME } from "@/lib/sample-resume";
import { type Theme } from "@/lib/themes";
import { Maximize2, WifiOff } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type PreviewStatus = "idle" | "loading" | "ok" | "unavailable";

// Module-level cache: slug → blob URL (persists for the page lifetime)
const previewCache = new Map<string, string>();

interface ThemeCardProps {
  theme: Theme;
  onSelect?: (theme: Theme) => void;
  onUnavailable?: (slug: string) => void;
}

export function ThemeCard({ theme, onSelect, onUnavailable }: ThemeCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [status, setStatus] = useState<PreviewStatus>(() =>
    previewCache.has(theme.slug) ? "ok" : "idle"
  );
  const [blobUrl, setBlobUrl] = useState<string | null>(
    () => previewCache.get(theme.slug) ?? null
  );

  // Lazy-load when card scrolls into view
  useEffect(() => {
    if (previewCache.has(theme.slug)) return;
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "300px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [theme.slug]);

  // Render preview once visible, skip if already cached
  useEffect(() => {
    if (!visible || previewCache.has(theme.slug)) return;
    let cancelled = false;
    setStatus("loading");

    renderTheme(SAMPLE_RESUME, theme.slug)
      .then((html) => {
        if (cancelled) return;
        const blob = new Blob([html], { type: "text/html" });
        const url = URL.createObjectURL(blob);
        previewCache.set(theme.slug, url);
        setBlobUrl(url);
        setStatus("ok");
      })
      .catch(() => {
        if (!cancelled) {
          setStatus("unavailable");
          onUnavailable?.(theme.slug);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [visible, theme.slug, onUnavailable]);

  return (
    <div ref={containerRef} className="group relative min-h-72 flex flex-col rounded-xl border bg-card overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* Iframe preview area */}
      <div className="relative bg-muted overflow-hidden" style={{ height: 260 }}>
        {(status === "idle" || status === "loading") && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted">
            <div className="animate-pulse text-muted-foreground text-xs">Loading…</div>
          </div>
        )}

        {status === "unavailable" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-muted/80">
            <WifiOff className="size-5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Preview unavailable</span>
          </div>
        )}

        {status === "ok" && blobUrl && (
          <iframe
            src={blobUrl}
            title={`${theme.label} theme preview`}
            className="pointer-events-none absolute top-0 left-0"
            style={{
              width: "1200px",
              height: "900px",
              transform: "scale(0.28)",
              transformOrigin: "top left",
            }}
            sandbox="allow-same-origin allow-scripts"
          />
        )}

        {status === "ok" && blobUrl && (
          <Dialog>
            <DialogTrigger asChild>
              <button className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm rounded-md p-1.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background cursor-pointer z-10">
                <Maximize2 className="size-3.5" />
              </button>
            </DialogTrigger>
            <DialogContent className="w-screen h-5/6 flex flex-col p-0 gap-0">
              <DialogHeader className="px-6 py-4 border-b shrink-0">
                <DialogTitle>{theme.label}</DialogTitle>
              </DialogHeader>
              <iframe
                src={blobUrl}
                title={`${theme.label} full preview`}
                className="flex-1 w-full"
                sandbox="allow-same-origin allow-scripts"
              />
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-3 py-2.5 gap-2">
        <span className="text-sm font-medium truncate">{theme.label}</span>
        {onSelect && (
          <Button
            size="sm"
            variant="outline"
            className="shrink-0 text-xs h-7"
            onClick={() => onSelect(theme)}
          >
            Use Theme
          </Button>
        )}
      </div>
    </div>
  );
}
