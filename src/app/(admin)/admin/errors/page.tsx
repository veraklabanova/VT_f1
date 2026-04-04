'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { RefreshCw, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface ErrorItem {
  id: string
  error_type: string
  error_message: string
  retryable: boolean
  retried: boolean
  created_at: string
}

const MOCK_ERRORS: ErrorItem[] = [
  { id: 'err-1', error_type: 'image_generation', error_message: 'DALL-E 3 rate limit exceeded — too many requests', retryable: true, retried: false, created_at: '2026-04-03T14:22:00Z' },
  { id: 'err-2', error_type: 'text_generation', error_message: 'Claude API timeout after 30s', retryable: true, retried: true, created_at: '2026-04-03T10:15:00Z' },
  { id: 'err-3', error_type: 'image_generation', error_message: 'Content policy violation — prompt rejected', retryable: false, retried: false, created_at: '2026-04-02T16:45:00Z' },
]

export default function ErrorsPage() {
  const [errors, setErrors] = useState<ErrorItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from('error_logs')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(50)

        if (!error && data && data.length > 0) {
          setErrors(data as ErrorItem[])
        } else {
          setErrors(MOCK_ERRORS)
        }
      } catch {
        setErrors(MOCK_ERRORS)
      }
      setLoading(false)
    }
    load()
  }, [])

  async function handleRetry(errorId: string) {
    if (errorId.startsWith('err-')) {
      toast.success('Opakování spuštěno (demo)')
      setErrors((prev) => prev.map((e) => e.id === errorId ? { ...e, retried: true } : e))
      return
    }
    try {
      const res = await fetch(`/api/admin/errors/${errorId}/retry`, { method: 'POST' })
      if (res.ok) {
        toast.success('Opakování spuštěno')
        setErrors((prev) => prev.map((e) => e.id === errorId ? { ...e, retried: true } : e))
      }
    } catch { toast.error('Chyba') }
  }

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin" /></div>

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Chybový log</h1>

      {errors.length === 0 ? (
        <Card><CardContent className="text-center py-12 text-muted-foreground">Žádné chyby.</CardContent></Card>
      ) : (
        <div className="space-y-3">
          {errors.map((err) => (
            <Card key={err.id}>
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant={err.retried ? 'secondary' : 'destructive'}>{err.error_type}</Badge>
                    {err.retried && <Badge variant="outline">Opakováno</Badge>}
                    <span className="text-xs text-muted-foreground">
                      {new Date(err.created_at).toLocaleString('cs-CZ')}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{err.error_message}</p>
                </div>
                {err.retryable && !err.retried && (
                  <Button variant="outline" size="sm" onClick={() => handleRetry(err.id)} className="gap-1">
                    <RefreshCw className="h-4 w-4" /> Opakovat
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
