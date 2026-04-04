import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET(request: Request) {
  // Try to get user context for org-specific filtering
  let isOrg = false
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()
      isOrg = profile?.role === 'organizace'
    }
  } catch {
    // Not authenticated — fine for onboarding flow
  }

  // Use admin client to read themes and exercises (bypasses RLS)
  const adminSupabase = createAdminClient()

  const { data: themes } = await adminSupabase
    .from('themes')
    .select('*')
    .order('name')

  if (!themes) return NextResponse.json({ themes: [] })

  const { data: exercises } = await adminSupabase
    .from('exercises')
    .select('id, theme_id, difficulty, exercise_tags(tag_id)')
    .eq('status', 'approved')

  const availableThemes = []

  for (const theme of themes) {
    const themeExercises = exercises?.filter((e) => e.theme_id === theme.id) || []
    const difficultiesToCheck = isOrg
      ? ['lehka', 'stredni', 'tezsi']
      : ['lehka', 'stredni', 'tezsi']
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
