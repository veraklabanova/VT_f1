import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { computeSeverity } from '@/lib/assessment/evaluate'
import { assessmentSchema } from '@/lib/validators'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const parsed = assessmentSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Neplatná data', details: parsed.error.flatten() },
      { status: 400 }
    )
  }

  const { q1, q2, q3, q4, q5, q6, q7 } = parsed.data
  const { averageScore, severity } = computeSeverity([q1, q2, q3, q4, q5, q6, q7])

  // Insert new assessment (trigger handles setting is_current)
  const { error: insertError } = await supabase
    .from('assessment_responses')
    .insert({
      user_id: user.id,
      q1, q2, q3, q4, q5, q6, q7,
      average_score: averageScore,
      computed_severity: severity,
      is_current: true,
    })

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 })
  }

  // Update profile severity
  const { error: updateError } = await supabase
    .from('profiles')
    .update({ severity_level: severity })
    .eq('id', user.id)

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 })
  }

  return NextResponse.json({ severity, averageScore })
}
