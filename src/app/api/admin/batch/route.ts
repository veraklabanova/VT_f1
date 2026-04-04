import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { generateExerciseText } from '@/lib/ai/claude'
import { generateExerciseImage } from '@/lib/ai/dalle'
import { buildImagePrompt } from '@/lib/ai/prompts'
import { generateBatchSchema } from '@/lib/validators'

export async function POST(request: Request) {
  const supabase = await createClient()
  const adminSupabase = createAdminClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Verify admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await request.json()
  const parsed = generateBatchSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Neplatná data' }, { status: 400 })
  }

  const { theme_id, difficulty, cognitive_tag_ids, count, prompt_text, prompt_image } = parsed.data

  // Get theme name
  const { data: theme } = await adminSupabase
    .from('themes')
    .select('name')
    .eq('id', theme_id)
    .single()

  if (!theme) return NextResponse.json({ error: 'Téma nenalezeno' }, { status: 404 })

  // Create batch record
  const { data: batch, error: batchError } = await adminSupabase
    .from('generation_batches')
    .insert({
      theme_id,
      difficulty,
      cognitive_tag_ids,
      count,
      prompt_text,
      prompt_image: prompt_image || null,
      status: 'processing',
      created_by: user.id,
    })
    .select()
    .single()

  if (batchError) return NextResponse.json({ error: batchError.message }, { status: 500 })

  let generated = 0
  let errors = 0

  for (let i = 0; i < count; i++) {
    try {
      // Generate text with Claude
      const text = await generateExerciseText(prompt_text)

      // Generate image with DALL-E
      let imageUrl: string | null = null
      try {
        const imagePrompt = prompt_image || buildImagePrompt(theme.name, text)
        const dalleUrl = await generateExerciseImage(imagePrompt)

        // Download and upload to Supabase Storage
        const imageRes = await fetch(dalleUrl)
        const imageBlob = await imageRes.blob()
        const fileName = `${batch.id}/${i + 1}.png`

        const { error: uploadError } = await adminSupabase.storage
          .from('exercises')
          .upload(fileName, imageBlob, { contentType: 'image/png' })

        if (!uploadError) {
          const { data: publicUrl } = adminSupabase.storage
            .from('exercises')
            .getPublicUrl(fileName)
          imageUrl = publicUrl.publicUrl
        }
      } catch (imgErr) {
        // Log image error but continue (text exercise still valid)
        await adminSupabase.from('error_logs').insert({
          batch_id: batch.id,
          error_type: 'image_generation',
          error_message: imgErr instanceof Error ? imgErr.message : 'Unknown image error',
          request_payload: { index: i, theme: theme.name },
          retryable: true,
        })
      }

      // Create exercise
      const { data: exercise, error: exError } = await adminSupabase
        .from('exercises')
        .insert({
          theme_id,
          difficulty,
          status: 'awaiting_review',
          text_content: text,
          image_url: imageUrl,
          batch_id: batch.id,
        })
        .select()
        .single()

      if (exError) throw exError

      // Add tags
      const tagInserts = cognitive_tag_ids.map((tag_id) => ({
        exercise_id: exercise.id,
        tag_id,
      }))
      await adminSupabase.from('exercise_tags').insert(tagInserts)

      generated++
    } catch (err) {
      errors++
      await adminSupabase.from('error_logs').insert({
        batch_id: batch.id,
        error_type: 'text_generation',
        error_message: err instanceof Error ? err.message : 'Unknown error',
        request_payload: { index: i, theme: theme.name, difficulty },
        retryable: true,
      })
    }
  }

  // Update batch status
  await adminSupabase
    .from('generation_batches')
    .update({ status: errors === count ? 'failed' : 'completed' })
    .eq('id', batch.id)

  return NextResponse.json({ batch_id: batch.id, generated, errors })
}
