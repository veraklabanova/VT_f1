'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ASSESSMENT_QUESTIONS } from '@/lib/assessment/evaluate'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'

export default function AssessmentPage() {
  const router = useRouter()
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(false)
  const [role, setRole] = useState<string>('pecujici')
  const [existingSeverity, setExistingSeverity] = useState<string | null>(null)

  useEffect(() => {
    async function loadData() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: profile } = await supabase
        .from('profiles')
        .select('role, severity_level')
        .eq('id', user.id)
        .single()

      if (profile) {
        setRole(profile.role)
        setExistingSeverity(profile.severity_level)
      }

      // Load existing assessment
      const { data: assessment } = await supabase
        .from('assessment_responses')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_current', true)
        .single()

      if (assessment) {
        setAnswers({
          q1: assessment.q1,
          q2: assessment.q2,
          q3: assessment.q3,
          q4: assessment.q4,
          q5: assessment.q5,
          q6: assessment.q6,
          q7: assessment.q7,
        })
      }
    }
    loadData()
  }, [])

  const isFirstPerson = role === 'osoba_s_postizenim'
  const allAnswered = ASSESSMENT_QUESTIONS.every((q) => answers[q.id] !== undefined)

  async function handleSubmit() {
    if (!allAnswered) return
    setLoading(true)

    try {
      const res = await fetch('/api/assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(answers),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Chyba při ukládání')
      }

      toast.success('Dotazník byl uložen')
      router.push('/dashboard')
      router.refresh()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Chyba při ukládání')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold">Dotazník</h1>
        <p className="text-muted-foreground mt-1">
          {isFirstPerson
            ? 'Odpovězte na několik otázek o vašich každodenních schopnostech.'
            : 'Odpovězte na několik otázek o schopnostech pečované osoby.'}
        </p>
        {existingSeverity && (
          <Badge variant="secondary" className="mt-2">
            Aktuální úroveň: {existingSeverity === 'lehka' ? 'Lehká' : existingSeverity === 'stredni' ? 'Střední' : 'Těžší'}
          </Badge>
        )}
      </div>

      {ASSESSMENT_QUESTIONS.map((question, idx) => (
        <Card key={question.id}>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">
              {idx + 1}. {isFirstPerson ? question.text_first_person : question.text_third_person}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {question.options.map((option) => (
                <label
                  key={option.value}
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors
                    ${answers[question.id] === option.value
                      ? 'border-primary bg-primary/5'
                      : 'hover:bg-gray-50'}`}
                >
                  <input
                    type="radio"
                    name={question.id}
                    value={option.value}
                    checked={answers[question.id] === option.value}
                    onChange={() => setAnswers((prev) => ({ ...prev, [question.id]: option.value }))}
                    className="sr-only"
                  />
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0
                    ${answers[question.id] === option.value ? 'border-primary' : 'border-gray-300'}`}>
                    {answers[question.id] === option.value && (
                      <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                    )}
                  </div>
                  <span className="text-sm">
                    {isFirstPerson ? option.label_first_person : option.label_third_person}
                  </span>
                </label>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      <div className="flex gap-3">
        <Button onClick={handleSubmit} disabled={!allAnswered || loading} className="flex-1">
          {loading ? 'Ukládám...' : existingSeverity ? 'Aktualizovat dotazník' : 'Uložit dotazník'}
        </Button>
      </div>

      {!allAnswered && (
        <Alert>
          <AlertDescription>
            Odpovězte prosím na všechny otázky ({Object.keys(answers).length}/7).
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
