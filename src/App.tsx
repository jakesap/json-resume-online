import { useState } from 'react'
import { FileText, LayoutGrid } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ThemeGallery } from '@/pages/ThemeGallery'
import { ResumeBuilder } from '@/pages/ResumeBuilder'
import { type Theme } from '@/lib/themes'

export default function App() {
  const [activeTab, setActiveTab] = useState('gallery')
  const [selectedTheme, setSelectedTheme] = useState<string | undefined>(undefined)

  function handleSelectTheme(theme: Theme) {
    setSelectedTheme(theme.slug)
    setActiveTab('builder')
  }

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Header */}
      <header className="border-b bg-card shrink-0">
        <div className="max-w-screen-2xl mx-auto px-6 py-4 flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-primary flex items-center justify-center">
              <FileText className="size-4 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-base font-semibold leading-tight">JSON Resume Online</h1>
              <p className="text-xs text-muted-foreground">Build and preview your resume</p>
            </div>
          </div>
          <a
            href="https://jsonresume.org"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto text-xs text-muted-foreground hover:text-foreground underline underline-offset-2"
          >
            jsonresume.org
          </a>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex flex-col min-h-0 max-w-screen-2xl mx-auto w-full px-6 py-6">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="flex flex-col flex-1 min-h-0 gap-4"
        >
          <TabsList className="self-start">
            <TabsTrigger value="gallery" className="gap-1.5">
              <LayoutGrid className="size-4" />
              Theme Gallery
            </TabsTrigger>
            <TabsTrigger value="builder" className="gap-1.5">
              <FileText className="size-4" />
              Resume Builder
            </TabsTrigger>
          </TabsList>

          <TabsContent value="gallery" className="flex-1 min-h-0 mt-0">
            <ThemeGallery onSelectTheme={handleSelectTheme} />
          </TabsContent>

          <TabsContent value="builder" className="flex-1 min-h-0 mt-0">
            <ResumeBuilder initialTheme={selectedTheme} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
