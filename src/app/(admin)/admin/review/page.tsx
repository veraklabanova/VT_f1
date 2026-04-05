'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, XCircle, Archive, Loader2, ImageIcon } from 'lucide-react'
import { toast } from 'sonner'
import { ImageLightbox } from '@/components/ui/image-lightbox'

interface ReviewExercise {
  id: string
  text_content: string
  image_url: string | null
  difficulty: string
  theme_name: string
  tags: string[]
}

const difficultyLabels: Record<string, string> = { lehka: 'Lehká', stredni: 'Střední', tezsi: 'Těžší' }

const MOCK_EXERCISES: ReviewExercise[] = [
  { id: 'demo-1', text_content: 'Vzpomeňte si na tři věci, které jste dnes jedl/a k snídani. Napište je sem.', image_url: null, difficulty: 'lehka', theme_name: 'Rodina', tags: ['Paměť'] },
  { id: 'demo-2', text_content: 'Podívejte se na obrázek a najděte 5 rozdílů mezi levou a pravou stranou.', image_url: 'placeholder', difficulty: 'stredni', theme_name: 'Zahrada', tags: ['Pozornost', 'Vizuální vnímání'] },
  { id: 'demo-3', text_content: 'Seřaďte tyto činnosti podle toho, jak se obvykle dělají při přípravě oběda: servírování, vaření, nakupování, plánování.', image_url: null, difficulty: 'lehka', theme_name: 'Domácí práce', tags: ['Logické myšlení', 'Paměť'] },
  { id: 'demo-4', text_content: 'Jaké roční období je na obrázku? Vyjmenujte tři znaky, podle kterých jste to poznali.', image_url: 'placeholder', difficulty: 'tezsi', theme_name: 'Jaro', tags: ['Orientace', 'Jazykové dovednosti'] },
]

export default function ReviewPage() {
  const [exercises, setExercises] = useState<ReviewExercise[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    async function loadExercises() {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from('exercises')
          .select('id, text_content, image_url, difficulty, themes(name), exercise_tags(cognitive_tags(label_cs))')
          .eq('status', 'awaiting_review')
          .order('created_at', { ascending: false })
          .limit(50)

        if (!error && data && data.length > 0) {
          setExercises(data.map((e: any) => ({
            id: e.id,
            text_content: e.text_content,
            image_url: e.image_url,
            difficulty: e.difficulty,
            theme_name: e.themes?.name || '',
            tags: e.exercise_tags?.map((et: any) => et.cognitive_tags?.label_cs).filter(Boolean) || [],
          })))
        } else {
          setExercises(MOCK_EXERCISES)
        }
      } catch {
        setExercises(MOCK_EXERCISES)
      }
      setLoading(false)
    }
    loadExercises()
  }, [])

  async function handleAction(exerciseId: string, action: 'approve' | 'reject' | 'archive') {
    setActionLoading(exerciseId)

    if (exerciseId.startsWith('demo-')) {
      // Demo mode — just remove from list
      await new Promise((r) => setTimeout(r, 300))
      const msgs: Record<string, string> = { approve: 'Schváleno (demo)', reject: 'Zamítnuto (demo)', archive: 'Archivováno (demo)' }
      toast.success(msgs[action])
      setExercises((prev) => prev.filter((e) => e.id !== exerciseId))
      setActionLoading(null)
      return
    }

    try {
      const res = await fetch(`/api/exercises/${exerciseId}/review`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      })
      if (!res.ok) throw new Error('Chyba')
      const msgs: Record<string, string> = { approve: 'Schváleno', reject: 'Zamítnuto', archive: 'Archivováno' }
      toast.success(msgs[action])
      setExercises((prev) => prev.filter((e) => e.id !== exerciseId))
    } catch {
      toast.error('Chyba při akci')
    }
    setActionLoading(null)
  }

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin" /></div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Fronta k revizi</h1>
        <Badge variant="secondary">{exercises.length} čeká</Badge>
      </div>

      {exercises.length === 0 ? (
        <Card><CardContent className="text-center py-12 text-muted-foreground">Žádná cvičení k revizi.</CardContent></Card>
      ) : (
        <div className="space-y-4">
          {exercises.map((exercise) => (
            <Card key={exercise.id}>
              <CardContent className="p-4">
                <div className="flex gap-4">
                  {exercise.image_url ? (
                    exercise.image_url === 'placeholder' ? (
                      <div className="w-32 h-32 bg-gray-100 rounded-lg shrink-0 flex items-center justify-center border">
                        <ImageIcon className="h-8 w-8 text-gray-400" />
                      </div>
                    ) : (
                      <ImageLightbox src={exercise.image_url} />
                    )
                  ) : null}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="outline">{exercise.theme_name}</Badge>
                      <Badge variant="secondary">{difficultyLabels[exercise.difficulty]}</Badge>
                      {exercise.tags.map((tag, i) => (
                        <Badge key={i} variant="outline" className="text-xs">{tag}</Badge>
                      ))}
                    </div>
                    <p className="text-sm">{exercise.text_content}</p>
                    <div className="flex gap-2 pt-2">
                      <Button size="sm" onClick={() => handleAction(exercise.id, 'approve')} disabled={actionLoading === exercise.id} className="gap-1">
                        <CheckCircle className="h-4 w-4" /> Schválit
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleAction(exercise.id, 'archive')} disabled={actionLoading === exercise.id} className="gap-1">
                        <Archive className="h-4 w-4" /> Archivovat
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleAction(exercise.id, 'reject')} disabled={actionLoading === exercise.id} className="gap-1">
                        <XCircle className="h-4 w-4" /> Zamítnout
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
