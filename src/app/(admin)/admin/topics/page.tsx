import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, XCircle } from 'lucide-react'

const difficulties = ['lehka', 'stredni', 'tezsi'] as const
const difficultyLabels: Record<string, string> = { lehka: 'Lehká', stredni: 'Střední', tezsi: 'Těžší' }

const MOCK_THEMES = [
  { id: '1', name: 'Rodina' },
  { id: '2', name: 'Zahrada' },
  { id: '3', name: 'Dům' },
  { id: '4', name: 'Jaro' },
  { id: '5', name: 'Domácí práce' },
]

const MOCK_STATS: Record<string, Record<string, { count: number; tags: number }>> = {
  '1': { lehka: { count: 12, tags: 5 }, stredni: { count: 8, tags: 3 }, tezsi: { count: 3, tags: 2 } },
  '2': { lehka: { count: 15, tags: 6 }, stredni: { count: 11, tags: 4 }, tezsi: { count: 10, tags: 4 } },
  '3': { lehka: { count: 6, tags: 4 }, stredni: { count: 4, tags: 2 }, tezsi: { count: 2, tags: 1 } },
  '4': { lehka: { count: 10, tags: 4 }, stredni: { count: 10, tags: 5 }, tezsi: { count: 7, tags: 3 } },
  '5': { lehka: { count: 0, tags: 0 }, stredni: { count: 0, tags: 0 }, tezsi: { count: 0, tags: 0 } },
}

export default async function TopicsPage() {
  let themes = MOCK_THEMES
  let stats = MOCK_STATS

  try {
    const supabase = await createClient()
    const { data: dbThemes, error } = await supabase.from('themes').select('*').order('name')

    if (!error && dbThemes && dbThemes.length > 0) {
      themes = dbThemes
      const { data: exercises } = await supabase
        .from('exercises')
        .select('id, theme_id, difficulty, status, exercise_tags(tag_id)')
        .eq('status', 'approved')

      stats = {}
      for (const theme of themes) {
        stats[theme.id] = {}
        for (const diff of difficulties) {
          const diffExercises = (exercises || []).filter(
            (e: any) => e.theme_id === theme.id && e.difficulty === diff
          )
          const tagSet = new Set<string>()
          diffExercises.forEach((e: any) => {
            (e.exercise_tags as { tag_id: string }[])?.forEach((t) => tagSet.add(t.tag_id))
          })
          stats[theme.id][diff] = { count: diffExercises.length, tags: tagSet.size }
        }
      }
    }
  } catch {
    // Use mock data
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Přehled témat</h1>

      {themes.map((theme) => (
        <Card key={theme.id}>
          <CardHeader>
            <CardTitle>{theme.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              {difficulties.map((diff) => {
                const s = stats[theme.id]?.[diff] || { count: 0, tags: 0 }
                const countOk = s.count >= 10
                const tagsOk = s.tags >= 4
                const available = countOk && tagsOk

                return (
                  <div key={diff} className="border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{difficultyLabels[diff]}</span>
                      {available ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                    </div>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Cvičení:</span>
                        <Badge variant={countOk ? 'default' : 'destructive'}>{s.count} / 10</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Značky:</span>
                        <Badge variant={tagsOk ? 'default' : 'destructive'}>{s.tags} / 4</Badge>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
