import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  const isOrg = profile?.role === 'organizace'
  const difficulties = isOrg ? ['lehka', 'stredni', 'tezsi'] : null

  // Get all themes
  const { data: themes } = await supabase
    .from('themes')
    .select('*')
    .order('name')

  if (!themes) return NextResponse.json({ themes: [] })

  // Get exercise counts per theme per difficulty
  const { data: exercises } = await supabase
    .from('exercises')
    .select('id, theme_id, difficulty, exercise_tags(tag_id)')
    .eq('status', 'approved')

  const availableThemes = []

  for (const theme of themes) {
    const themeExercises = exercises?.filter((e) => e.theme_id === theme.id) || []
    const difficultiesToCheck = difficulties || ['lehka', 'stredni', 'tezsi']
    let available = true

    for (const diff of difficultiesToCheck) {
      const diffExercises = themeExercises.filter((e) => e.difficulty === diff)
      if (diffExercises.length < 10) {
        available = false
        break
      }

      const uniqueTags = new Set<string>()
      for (const e of diffExercises) {
        const tags = e.exercise_tags as { tag_id: string }[]
        tags?.forEach((t) => uniqueTags.add(t.tag_id))
      }
      if (uniqueTags.size < 4) {
        available = false
        break
      }
    }

    availableThemes.push({ ...theme, available })
  }

  return NextResponse.json({ themes: availableThemes })
}
