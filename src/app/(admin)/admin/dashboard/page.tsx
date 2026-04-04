import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const difficultyLabels: Record<string, string> = { lehka: 'Lehká', stredni: 'Střední', tezsi: 'Těžší' }
const difficulties = ['lehka', 'stredni', 'tezsi'] as const

// Mock data for demo mode
const MOCK_THEMES = [
  { id: '1', name: 'Rodina' },
  { id: '2', name: 'Zahrada' },
  { id: '3', name: 'Dům' },
  { id: '4', name: 'Jaro' },
  { id: '5', name: 'Domácí práce' },
]

const MOCK_MATRIX: Record<string, Record<string, { count: number; tags: number; ok: boolean }>> = {
  '1': { lehka: { count: 12, tags: 5, ok: true }, stredni: { count: 8, tags: 3, ok: false }, tezsi: { count: 3, tags: 2, ok: false } },
  '2': { lehka: { count: 15, tags: 6, ok: true }, stredni: { count: 11, tags: 4, ok: true }, tezsi: { count: 10, tags: 4, ok: true } },
  '3': { lehka: { count: 6, tags: 4, ok: false }, stredni: { count: 4, tags: 2, ok: false }, tezsi: { count: 2, tags: 1, ok: false } },
  '4': { lehka: { count: 10, tags: 4, ok: true }, stredni: { count: 10, tags: 5, ok: true }, tezsi: { count: 7, tags: 3, ok: false } },
  '5': { lehka: { count: 0, tags: 0, ok: false }, stredni: { count: 0, tags: 0, ok: false }, tezsi: { count: 0, tags: 0, ok: false } },
}

export default async function AdminDashboardPage() {
  let themes = MOCK_THEMES
  let matrix = MOCK_MATRIX
  let pendingCount = 7
  let totalExercises = 98
  let totalUsers = 14

  try {
    const supabase = await createClient()
    const { data: dbThemes, error } = await supabase.from('themes').select('*').order('name')

    if (!error && dbThemes && dbThemes.length > 0) {
      themes = dbThemes
      const { data: exercises } = await supabase
        .from('exercises')
        .select('id, theme_id, difficulty, status, exercise_tags(tag_id)')

      const { count: pending } = await supabase
        .from('exercises')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'awaiting_review')

      const { count: users } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })

      pendingCount = pending || 0
      totalExercises = exercises?.length || 0
      totalUsers = users || 0

      // Build real matrix
      matrix = {}
      for (const theme of themes) {
        matrix[theme.id] = {}
        for (const diff of difficulties) {
          const diffExercises = (exercises || []).filter(
            (e: any) => e.theme_id === theme.id && e.difficulty === diff && e.status === 'approved'
          )
          const tags = new Set<string>()
          diffExercises.forEach((e: any) => {
            const eTags = e.exercise_tags as { tag_id: string }[]
            eTags?.forEach((t) => tags.add(t.tag_id))
          })
          matrix[theme.id][diff] = {
            count: diffExercises.length,
            tags: tags.size,
            ok: diffExercises.length >= 10 && tags.size >= 4,
          }
        }
      }
    }
  } catch {
    // Supabase unavailable — use mock data
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>K revizi</CardDescription>
            <CardTitle className="text-2xl">{pendingCount}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Celkem cvičení</CardDescription>
            <CardTitle className="text-2xl">{totalExercises}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Registrovaní uživatelé</CardDescription>
            <CardTitle className="text-2xl">{totalUsers}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Theme x Difficulty Matrix */}
      <Card>
        <CardHeader>
          <CardTitle>Matice témat a obtížností</CardTitle>
          <CardDescription>Počet schválených cvičení (potřeba min. 10 s 4+ značkami)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-3">Téma</th>
                  {difficulties.map((d) => (
                    <th key={d} className="text-center py-2 px-3">{difficultyLabels[d]}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {themes.map((theme) => (
                  <tr key={theme.id} className="border-b">
                    <td className="py-2 px-3 font-medium">{theme.name}</td>
                    {difficulties.map((d) => {
                      const cell = matrix[theme.id]?.[d]
                      return (
                        <td key={d} className="text-center py-2 px-3">
                          <Badge variant={cell?.ok ? 'default' : 'destructive'}>
                            {cell?.count || 0} cv. / {cell?.tags || 0} zn.
                          </Badge>
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
