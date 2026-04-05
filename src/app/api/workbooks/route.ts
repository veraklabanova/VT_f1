import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { selectExercises } from '@/lib/workbook/select-exercises'
import { mapSeverityToDifficulty } from '@/lib/assessment/evaluate'
import { workbookRequestSchema } from '@/lib/validators'
import type { ExerciseWithTags, DifficultyLevel } from '@/types'

export async function POST(request: Request) {
  const supabase = await createClient()
  const adminSupabase = createAdminClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const parsed = workbookRequestSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Neplatná data' }, { status: 400 })
  }

  const { theme_id, difficulty } = parsed.data

  // Get profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 })

  const isOrg = profile.role === 'organizace'

  // I2: Assessment required for individuals
  if (!isOrg && !profile.severity_level) {
    return NextResponse.json(
      { error: 'Před vytvořením sešitu je potřeba vyplnit dotazník' },
      { status: 400 }
    )
  }

  // Check freemium / subscription
  if (profile.free_workbook_used) {
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single()

    if (!subscription || new Date(subscription.current_period_end) < new Date()) {
      return NextResponse.json(
        { error: 'Pro další sešity je potřeba aktivní předplatné' },
        { status: 403 }
      )
    }
  }

  // Determine difficulties to generate
  // For individuals: map severity (impairment level) to exercise difficulty (inverse)
  const difficultiesToGenerate: DifficultyLevel[] = isOrg
    ? ['lehka', 'stredni', 'tezsi']
    : [difficulty || mapSeverityToDifficulty(profile.severity_level)]

  // Get all approved exercises for the theme with tags
  const { data: exercises } = await adminSupabase
    .from('exercises')
    .select('*, exercise_tags(tag_id, cognitive_tags(*))')
    .eq('theme_id', theme_id)
    .eq('status', 'approved')

  if (!exercises) {
    return NextResponse.json({ error: 'Nepodařilo se načíst cvičení' }, { status: 500 })
  }

  // Transform to ExerciseWithTags
  const exercisesWithTags: ExerciseWithTags[] = exercises.map((e: any) => ({
    ...e,
    tags: e.exercise_tags?.map((et: any) => et.cognitive_tags) || [],
  }))

  const workbooks = []

  for (const diff of difficultiesToGenerate) {
    try {
      const { exercises: selected, seed } = selectExercises(
        exercisesWithTags,
        theme_id,
        diff
      )

      // For now, store workbook without PDF (PDF generation will be added)
      const { data: workbook, error: wbError } = await adminSupabase
        .from('workbooks')
        .insert({
          user_id: user.id,
          theme_id,
          difficulty: diff,
          pdf_url: '', // Will be filled after PDF generation
          seed,
        })
        .select()
        .single()

      if (wbError) throw new Error(wbError.message)

      // Insert workbook exercises
      const wbExercises = selected.map((exercise, idx) => ({
        workbook_id: workbook.id,
        exercise_id: exercise.id,
        position: idx + 1,
      }))

      await adminSupabase.from('workbook_exercises').insert(wbExercises)

      workbooks.push(workbook)
    } catch (err) {
      return NextResponse.json(
        { error: err instanceof Error ? err.message : 'Chyba při generování sešitu' },
        { status: 500 }
      )
    }
  }

  // Mark free workbook as used
  if (!profile.free_workbook_used) {
    await supabase
      .from('profiles')
      .update({ free_workbook_used: true })
      .eq('id', user.id)
  }

  return NextResponse.json({ workbooks })
}

export async function GET(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: workbooks } = await supabase
    .from('workbooks')
    .select('*, themes(*)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return NextResponse.json({ workbooks: workbooks || [] })
}
