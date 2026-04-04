'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Archive, Loader2, ImageIcon } from 'lucide-react'
import { toast } from 'sonner'

const difficultyLabels: Record<string, string> = { lehka: 'Lehká', stredni: 'Střední', tezsi: 'Těžší' }

interface CatalogExercise {
  id: string
  text_content: string
  image_url: string | null
  difficulty: string
  theme_name: string
  tags: string[]
}

const MOCK_CATALOG: CatalogExercise[] = [
  { id: 'cat-1', text_content: 'Pojmenujte všechny členy vaší rodiny, které vidíte na rodinné fotografii.', image_url: null, difficulty: 'lehka', theme_name: 'Rodina', tags: ['Paměť', 'Jazykové dovednosti'] },
  { id: 'cat-2', text_content: 'Spočítejte, kolik květin je na záhonu. Seřaďte je podle barvy.', image_url: 'placeholder', difficulty: 'stredni', theme_name: 'Zahrada', tags: ['Pozornost', 'Logické myšlení'] },
  { id: 'cat-3', text_content: 'Nakreslete plánek vašeho bytu a označte, kde se nachází kuchyň.', image_url: 'placeholder', difficulty: 'lehka', theme_name: 'Dům', tags: ['Orientace', 'Vizuální vnímání'] },
  { id: 'cat-4', text_content: 'Vyjmenujte pět jarních květin, které znáte.', image_url: null, difficulty: 'lehka', theme_name: 'Jaro', tags: ['Paměť', 'Jazykové dovednosti'] },
  { id: 'cat-5', text_content: 'Popište správný postup praní prádla v pračce.', image_url: null, difficulty: 'stredni', theme_name: 'Domácí práce', tags: ['Paměť', 'Logické myšlení'] },
]

export default function CatalogPage() {
  const [exercises, setExercises] = useState<CatalogExercise[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from('exercises')
          .select('id, text_content, image_url, difficulty, themes(name), exercise_tags(cognitive_tags(label_cs))')
          .eq('status', 'approved')
          .order('created_at', { ascending: false })
          .limit(100)

        if (!error && data && data.length > 0) {
          setExercises(data.map((e: any) => ({
            id: e.id, text_content: e.text_content, image_url: e.image_url, difficulty: e.difficulty,
            theme_name: e.themes?.name || '', tags: e.exercise_tags?.map((et: any) => et.cognitive_tags?.label_cs).filter(Boolean) || [],
          })))
        } else {
          setExercises(MOCK_CATALOG)
        }
      } catch {
        setExercises(MOCK_CATALOG)
      }
      setLoading(false)
    }
    load()
  }, [])

  async function handleArchive(id: string) {
    if (!confirm('Opravdu chcete archivovat toto cvičení?')) return
    if (id.startsWith('cat-')) {
      toast.success('Archivováno (demo)')
      setExercises((prev) => prev.filter((e) => e.id !== id))
      return
    }
    try {
      const res = await fetch(`/api/exercises/${id}/review`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'archive' }),
      })
      if (res.ok) {
        toast.success('Cvičení archivováno')
        setExercises((prev) => prev.filter((e) => e.id !== id))
      }
    } catch { toast.error('Chyba') }
  }

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin" /></div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Katalog cvičení</h1>
        <Badge variant="secondary">{exercises.length} schválených</Badge>
      </div>

      <div className="space-y-4">
        {exercises.map((exercise) => (
          <Card key={exercise.id}>
            <CardContent className="p-4">
              <div className="flex gap-4">
                {exercise.image_url ? (
                  exercise.image_url === 'placeholder' ? (
                    <div className="w-24 h-24 bg-gray-100 rounded-lg shrink-0 flex items-center justify-center border">
                      <ImageIcon className="h-6 w-6 text-gray-400" />
                    </div>
                  ) : (
                    <img src={exercise.image_url} alt="" className="w-24 h-24 object-cover rounded-lg shrink-0" />
                  )
                ) : null}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <Badge variant="outline">{exercise.theme_name}</Badge>
                    <Badge variant="secondary">{difficultyLabels[exercise.difficulty]}</Badge>
                    {exercise.tags.map((tag, i) => (
                      <Badge key={i} variant="outline" className="text-xs">{tag}</Badge>
                    ))}
                  </div>
                  <p className="text-sm">{exercise.text_content}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => handleArchive(exercise.id)}>
                  <Archive className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
