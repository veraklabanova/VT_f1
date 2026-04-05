'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { RotateCcw, Loader2, ImageIcon } from 'lucide-react'
import { toast } from 'sonner'
import { ImageLightbox } from '@/components/ui/image-lightbox'

const difficultyLabels: Record<string, string> = { lehka: 'Lehká', stredni: 'Střední', tezsi: 'Těžší' }

interface ArchivedExercise {
  id: string
  text_content: string
  image_url: string | null
  difficulty: string
  theme_name: string
  tags: string[]
  reviewed_at: string | null
}

const MOCK_ARCHIVED: ArchivedExercise[] = [
  { id: 'arch-1', text_content: 'Kolik oken má váš byt? Nakreslete je.', image_url: 'placeholder', difficulty: 'lehka', theme_name: 'Dům', tags: ['Paměť', 'Vizuální vnímání'], reviewed_at: '2026-03-28T10:00:00Z' },
  { id: 'arch-2', text_content: 'Popište, jak vypadá váš oblíbený pokoj v domě.', image_url: null, difficulty: 'stredni', theme_name: 'Dům', tags: ['Jazykové dovednosti'], reviewed_at: '2026-03-25T14:30:00Z' },
  { id: 'arch-3', text_content: 'Vyjmenujte 3 druhy zeleniny, které se pěstují na zahradě.', image_url: 'placeholder', difficulty: 'lehka', theme_name: 'Zahrada', tags: ['Paměť', 'Jazykové dovednosti'], reviewed_at: '2026-03-20T09:15:00Z' },
]

export default function ArchivePage() {
  const [exercises, setExercises] = useState<ArchivedExercise[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from('exercises')
          .select('id, text_content, image_url, difficulty, reviewed_at, themes(name), exercise_tags(cognitive_tags(label_cs))')
          .eq('status', 'archived')
          .order('reviewed_at', { ascending: false })
          .limit(100)

        if (!error && data && data.length > 0) {
          setExercises(data.map((e: any) => ({
            id: e.id, text_content: e.text_content, image_url: e.image_url,
            difficulty: e.difficulty, reviewed_at: e.reviewed_at,
            theme_name: e.themes?.name || '',
            tags: e.exercise_tags?.map((et: any) => et.cognitive_tags?.label_cs).filter(Boolean) || [],
          })))
        } else {
          setExercises(MOCK_ARCHIVED)
        }
      } catch {
        setExercises(MOCK_ARCHIVED)
      }
      setLoading(false)
    }
    load()
  }, [])

  async function handleRestore(id: string) {
    setActionLoading(id)

    if (id.startsWith('arch-')) {
      await new Promise((r) => setTimeout(r, 300))
      toast.success('Obnoveno do revize (demo)')
      setExercises((prev) => prev.filter((e) => e.id !== id))
      setActionLoading(null)
      return
    }

    try {
      const res = await fetch(`/api/exercises/${id}/review`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'restore' }),
      })
      if (res.ok) {
        toast.success('Cvičení obnoveno do fronty revize')
        setExercises((prev) => prev.filter((e) => e.id !== id))
      }
    } catch {
      toast.error('Chyba při obnovení')
    }
    setActionLoading(null)
  }

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin" /></div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Archiv</h1>
        <Badge variant="secondary">{exercises.length} archivovaných</Badge>
      </div>

      {exercises.length === 0 ? (
        <Card><CardContent className="text-center py-12 text-muted-foreground">Archiv je prázdný.</CardContent></Card>
      ) : (
        <div className="space-y-4">
          {exercises.map((exercise) => (
            <Card key={exercise.id} className="opacity-80">
              <CardContent className="p-4">
                <div className="flex gap-4">
                  {exercise.image_url ? (
                    exercise.image_url === 'placeholder' ? (
                      <div className="w-24 h-24 bg-gray-100 rounded-lg shrink-0 flex items-center justify-center border">
                        <ImageIcon className="h-6 w-6 text-gray-400" />
                      </div>
                    ) : (
                      <ImageLightbox src={exercise.image_url} thumbnailClassName="w-24 h-24 object-cover rounded-lg shrink-0" />
                    )
                  ) : null}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <Badge variant="outline">{exercise.theme_name}</Badge>
                      <Badge variant="secondary">{difficultyLabels[exercise.difficulty]}</Badge>
                      {exercise.tags.map((tag, i) => (
                        <Badge key={i} variant="outline" className="text-xs">{tag}</Badge>
                      ))}
                      {exercise.reviewed_at && (
                        <span className="text-xs text-muted-foreground">
                          Archivováno: {new Date(exercise.reviewed_at).toLocaleDateString('cs-CZ')}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{exercise.text_content}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRestore(exercise.id)}
                    disabled={actionLoading === exercise.id}
                    className="gap-1 shrink-0"
                  >
                    <RotateCcw className="h-4 w-4" /> Obnovit
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
