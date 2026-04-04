'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { BookOpen, Download, Plus, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

const difficultyLabels: Record<string, string> = {
  lehka: 'Lehká',
  stredni: 'Střední',
  tezsi: 'Těžší',
}

interface WorkbookItem {
  id: string
  theme_id: string
  difficulty: string
  pdf_url: string
  created_at: string
  themes?: { name: string }
}

export default function WorkbooksPage() {
  const searchParams = useSearchParams()
  const themeId = searchParams.get('theme')

  const [workbooks, setWorkbooks] = useState<WorkbookItem[]>([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [downloadingId, setDownloadingId] = useState<string | null>(null)

  useEffect(() => {
    loadWorkbooks()
  }, [])

  async function loadWorkbooks() {
    const res = await fetch('/api/workbooks')
    if (res.ok) {
      const data = await res.json()
      setWorkbooks(data.workbooks)
    }
    setLoading(false)
  }

  async function generateWorkbook() {
    if (!themeId) return
    setGenerating(true)

    try {
      const res = await fetch('/api/workbooks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ theme_id: themeId }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Chyba při generování')
      }

      toast.success('Sešit byl vytvořen!')
      await loadWorkbooks()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Chyba při generování')
    } finally {
      setGenerating(false)
    }
  }

  async function handleDownload(wb: WorkbookItem) {
    // If workbook has a stored PDF URL, use it
    if (wb.pdf_url) {
      window.open(wb.pdf_url, '_blank')
      return
    }

    // Otherwise generate PDF on-the-fly
    setDownloadingId(wb.id)
    try {
      const res = await fetch('/api/workbooks/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          theme_id: wb.theme_id,
          difficulty: wb.difficulty,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Chyba při generování PDF')
      }

      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `vlastnim-tempem-${wb.themes?.name?.toLowerCase() || 'sesit'}-${wb.difficulty}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast.success('PDF staženo')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Chyba při stahování')
    } finally {
      setDownloadingId(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Pracovní sešity</h1>
          <p className="text-muted-foreground mt-1">
            Vaše vygenerované pracovní sešity.
          </p>
        </div>
        {themeId && (
          <Button onClick={generateWorkbook} disabled={generating} className="gap-2">
            {generating ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Generuji...</>
            ) : (
              <><Plus className="h-4 w-4" /> Vytvořit sešit</>
            )}
          </Button>
        )}
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <Card key={i}><CardContent className="p-6"><Skeleton className="h-20" /></CardContent></Card>
          ))}
        </div>
      ) : workbooks.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">Zatím nemáte žádné sešity</h3>
            <p className="text-muted-foreground">
              Vyberte téma a vytvořte svůj první pracovní sešit.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {workbooks.map((wb) => (
            <Card key={wb.id}>
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-4">
                  <BookOpen className="h-8 w-8 text-primary" />
                  <div>
                    <p className="font-semibold">{wb.themes?.name || 'Téma'}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary">{difficultyLabels[wb.difficulty]}</Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(wb.created_at).toLocaleDateString('cs-CZ')}
                      </span>
                    </div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={() => handleDownload(wb)}
                  disabled={downloadingId === wb.id}
                >
                  {downloadingId === wb.id ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> Generuji...</>
                  ) : (
                    <><Download className="h-4 w-4" /> Stáhnout PDF</>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
