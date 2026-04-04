import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { generateWorkbookPDF, getDifficultyLabel } from '@/lib/pdf/generate-workbook'
import { selectExercises } from '@/lib/workbook/select-exercises'
import type { ExerciseWithTags, DifficultyLevel, Theme } from '@/types'

export async function POST(request: Request) {
  const body = await request.json()
  const { theme_id, difficulty } = body as { theme_id: string; difficulty: DifficultyLevel }

  if (!theme_id || !difficulty) {
    return NextResponse.json({ error: 'Chybí theme_id nebo difficulty' }, { status: 400 })
  }

  const supabase = createAdminClient()

  // Get theme
  const { data: theme, error: themeError } = await supabase
    .from('themes')
    .select('*')
    .eq('id', theme_id)
    .single()

  if (themeError || !theme) {
    return NextResponse.json({ error: 'Téma nenalezeno' }, { status: 404 })
  }

  // Get exercises with tags
  const { data: exercises, error: exError } = await supabase
    .from('exercises')
    .select('*, exercise_tags(tag_id, cognitive_tags(*))')
    .eq('theme_id', theme_id)
    .eq('difficulty', difficulty)
    .eq('status', 'approved')

  if (exError || !exercises) {
    return NextResponse.json({ error: 'Nepodařilo se načíst cvičení' }, { status: 500 })
  }

  // Transform to ExerciseWithTags
  const exercisesWithTags: ExerciseWithTags[] = exercises.map((e: any) => ({
    ...e,
    tags: e.exercise_tags?.map((et: any) => et.cognitive_tags).filter(Boolean) || [],
  }))

  // Select 10 exercises
  let selected: ExerciseWithTags[]
  try {
    const result = selectExercises(exercisesWithTags, theme_id, difficulty)
    selected = result.exercises
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Chyba při výběru cvičení' },
      { status: 400 }
    )
  }

  // Generate PDF
  try {
    const pdfBuffer = await generateWorkbookPDF(theme as Theme, difficulty, selected)

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="vlastnim-tempem-${theme.name.toLowerCase()}-${difficulty}.pdf"`,
      },
    })
  } catch (err) {
    console.error('PDF generation error:', err)
    return NextResponse.json(
      { error: 'Chyba při generování PDF: ' + (err instanceof Error ? err.message : 'Neznámá chyba') },
      { status: 500 }
    )
  }
}
