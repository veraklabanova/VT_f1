'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { computeSeverity } from '@/lib/assessment/evaluate'

/**
 * Transfers onboarding data from localStorage to the database
 * after a user registers and logs in for the first time.
 */
export function useOnboardingTransfer() {
  const [transferred, setTransferred] = useState(false)

  useEffect(() => {
    async function transfer() {
      const raw = localStorage.getItem('vt_onboarding')
      if (!raw) return

      const data = JSON.parse(raw)
      if (!data.answers || !data.severity) return

      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Check if user already has an assessment
      const { data: existing } = await supabase
        .from('assessment_responses')
        .select('id')
        .eq('user_id', user.id)
        .eq('is_current', true)
        .single()

      if (existing) {
        // Already has assessment — clean up localStorage
        localStorage.removeItem('vt_onboarding')
        return
      }

      const answers = data.answers
      const vals = [answers.q1, answers.q2, answers.q3, answers.q4, answers.q5, answers.q6, answers.q7]

      // Verify all answers exist
      if (vals.some((v: number | undefined) => v === undefined)) return

      const { averageScore, severity } = computeSeverity(vals)

      // Insert assessment
      await supabase.from('assessment_responses').insert({
        user_id: user.id,
        q1: answers.q1,
        q2: answers.q2,
        q3: answers.q3,
        q4: answers.q4,
        q5: answers.q5,
        q6: answers.q6,
        q7: answers.q7,
        average_score: averageScore,
        computed_severity: severity,
        is_current: true,
      })

      // Update profile severity
      await supabase
        .from('profiles')
        .update({ severity_level: severity })
        .eq('id', user.id)

      // Clean up
      localStorage.removeItem('vt_onboarding')
      setTransferred(true)
    }

    transfer()
  }, [])

  return transferred
}
