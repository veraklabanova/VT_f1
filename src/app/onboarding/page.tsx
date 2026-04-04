'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Brain, Heart, Users, Building2, ArrowRight, ArrowLeft, Download, Loader2, CheckCircle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ASSESSMENT_QUESTIONS } from '@/lib/assessment/evaluate'
import { computeSeverity } from '@/lib/assessment/evaluate'
import type { UserRole, SeverityLevel } from '@/types'

const TOTAL_STEPS_INDIVIDUAL = 4 // role → assessment → theme → download
const TOTAL_STEPS_ORG = 3 // role → theme → download

const roleOptions = [
  {
    value: 'osoba_s_postizenim' as UserRole,
    label: 'Mám potíže s pamětí',
    description: 'Chci trénovat paměť a další schopnosti',
    icon: Heart,
    color: 'bg-blue-100 text-blue-600',
  },
  {
    value: 'pecujici' as UserRole,
    label: 'Starám se o blízkého',
    description: 'Hledám materiály pro pečovanou osobu',
    icon: Users,
    color: 'bg-green-100 text-green-600',
  },
  {
    value: 'organizace' as UserRole,
    label: 'Jsme organizace',
    description: 'Domov pro seniory, rehabilitační centrum aj.',
    icon: Building2,
    color: 'bg-purple-100 text-purple-600',
  },
]

const severityLabels: Record<SeverityLevel, string> = {
  lehka: 'Lehká',
  stredni: 'Střední',
  tezsi: 'Těžší',
}

// Fallback themes for local testing without Supabase
const FALLBACK_THEMES = [
  { id: 'theme-rodina', name: 'Rodina', description: 'Rodinné vztahy, společné aktivity a vzpomínky', available: true },
  { id: 'theme-zahrada', name: 'Zahrada', description: 'Zahradničení, rostliny, příroda kolem domu', available: true },
  { id: 'theme-dum', name: 'Dům', description: 'Domácnost, vybavení bytu, každodenní činnosti doma', available: false },
  { id: 'theme-jaro', name: 'Jaro', description: 'Jarní příroda, tradice a aktivity spojené s jarem', available: false },
  { id: 'theme-domaci-prace', name: 'Domácí práce', description: 'Vaření, úklid, praní a další domácí činnosti', available: false },
]

export default function OnboardingPage() {
  const searchParams = useSearchParams()
  const initialRole = searchParams.get('role') as UserRole | null

  const [step, setStep] = useState(initialRole ? 1 : 0)
  const [role, setRole] = useState<UserRole | null>(initialRole)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [severity, setSeverity] = useState<SeverityLevel | null>(null)
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null)
  const [themes, setThemes] = useState<{ id: string; name: string; description: string | null; available: boolean }[]>(FALLBACK_THEMES)
  const [themesLoaded, setThemesLoaded] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [downloaded, setDownloaded] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isOrg = role === 'organizace'
  const isFirstPerson = role === 'osoba_s_postizenim'
  const totalSteps = isOrg ? TOTAL_STEPS_ORG : TOTAL_STEPS_INDIVIDUAL

  // Load themes from API
  useEffect(() => {
    async function loadThemes() {
      try {
        const res = await fetch('/api/themes/available')
        if (res.ok) {
          const data = await res.json()
          if (data.themes && data.themes.length > 0) {
            setThemes(data.themes)
          }
        }
      } catch {
        // Use fallback themes
      }
      setThemesLoaded(true)
    }
    loadThemes()
  }, [])

  // Compute current logical step based on role
  function getStepName(): string {
    if (isOrg) {
      if (step === 0) return 'role'
      if (step === 1) return 'theme'
      return 'download'
    }
    if (step === 0) return 'role'
    if (step === 1) return 'assessment'
    if (step === 2) return 'theme'
    return 'download'
  }

  const stepName = getStepName()

  function handleRoleSelect(r: UserRole) {
    setRole(r)
    setStep(1)
  }

  function handleAssessmentComplete() {
    const vals = ASSESSMENT_QUESTIONS.map((q) => answers[q.id])
    if (vals.some((v) => v === undefined)) return
    const { severity: s } = computeSeverity(vals as number[])
    setSeverity(s)

    // Save to localStorage for later registration
    localStorage.setItem('vt_onboarding', JSON.stringify({
      role,
      answers,
      severity: s,
    }))

    setStep(2)
  }

  function handleThemeSelect(themeId: string) {
    setSelectedTheme(themeId)

    // Save to localStorage
    const existing = JSON.parse(localStorage.getItem('vt_onboarding') || '{}')
    localStorage.setItem('vt_onboarding', JSON.stringify({
      ...existing,
      role,
      selectedTheme: themeId,
      severity,
    }))

    setStep(isOrg ? 2 : 3)
  }

  async function handleGenerate() {
    if (!selectedTheme || !severity) return
    setGenerating(true)
    setError(null)

    try {
      const res = await fetch('/api/workbooks/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          theme_id: selectedTheme,
          difficulty: severity,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Chyba při generování sešitu')
      }

      // Download the PDF
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      const themeName = themes.find((t) => t.id === selectedTheme)?.name || 'sesit'
      a.href = url
      a.download = `vlastnim-tempem-${themeName.toLowerCase()}-${severity}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      setDownloaded(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Chyba při generování')
    } finally {
      setGenerating(false)
    }
  }

  const stepProgress = Math.round(((step + 1) / totalSteps) * 100)

  return (
    <div className={`min-h-screen bg-gray-50 ${isFirstPerson ? 'simplified-mode' : ''}`}>
      {/* Header */}
      <header className="border-b bg-white px-4 py-3">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-primary" />
            <span className="font-bold">Vlastním tempem</span>
          </Link>
          {step > 0 && (
            <span className="text-sm text-muted-foreground">
              Krok {step + 1} z {totalSteps}
            </span>
          )}
        </div>
      </header>

      {/* Progress bar */}
      <div className="h-1 bg-gray-200">
        <div
          className="h-1 bg-primary transition-all duration-300"
          style={{ width: `${stepProgress}%` }}
        />
      </div>

      <main className="max-w-3xl mx-auto px-4 py-8">

        {/* Step 0: Role selection */}
        {stepName === 'role' && (
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold">Kdo jste?</h1>
              <p className="text-muted-foreground mt-2">
                Výběr ovlivní obsah a obtížnost materiálů.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {roleOptions.map((opt) => (
                <Card
                  key={opt.value}
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => handleRoleSelect(opt.value)}
                >
                  <CardHeader className="text-center pb-2">
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-2 ${opt.color}`}>
                      <opt.icon className="h-7 w-7" />
                    </div>
                    <CardTitle className="text-lg">{opt.label}</CardTitle>
                    <CardDescription>{opt.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <Button className="w-full gap-2">
                      Vybrat <ArrowRight className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Step 1 (individuals): Assessment */}
        {stepName === 'assessment' && (
          <div className="space-y-6 max-w-2xl mx-auto">
            <div>
              <Button variant="ghost" size="sm" onClick={() => setStep(0)} className="gap-1 mb-2">
                <ArrowLeft className="h-4 w-4" /> Zpět
              </Button>
              <h1 className="text-3xl font-bold">Krátký dotazník</h1>
              <p className="text-muted-foreground mt-1">
                {isFirstPerson
                  ? 'Odpovězte na několik otázek o vašich každodenních schopnostech. Pomůže to určit správnou obtížnost.'
                  : 'Odpovězte na několik otázek o schopnostech pečované osoby.'}
              </p>
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

            {Object.keys(answers).length < 7 && (
              <Alert>
                <AlertDescription>
                  Odpovězte prosím na všechny otázky ({Object.keys(answers).length}/7).
                </AlertDescription>
              </Alert>
            )}

            <Button
              onClick={handleAssessmentComplete}
              disabled={Object.keys(answers).length < 7}
              className="w-full gap-2"
              size="lg"
            >
              Pokračovat <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Theme selection */}
        {stepName === 'theme' && (
          <div className="space-y-6">
            <div>
              <Button variant="ghost" size="sm" onClick={() => setStep(step - 1)} className="gap-1 mb-2">
                <ArrowLeft className="h-4 w-4" /> Zpět
              </Button>
              <h1 className="text-3xl font-bold">Vyberte téma</h1>
              <p className="text-muted-foreground mt-1">
                Zvolte si téma, které je vám blízké.
              </p>
              {severity && (
                <Badge variant="secondary" className="mt-2">
                  Určená obtížnost: {severityLabels[severity]}
                </Badge>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {themes.map((theme) => {
                const available = 'available' in theme ? theme.available : true
                return (
                  <Card
                    key={theme.id}
                    className={available
                      ? 'cursor-pointer hover:shadow-lg transition-shadow border-primary/30'
                      : 'opacity-50'}
                  >
                    <CardHeader>
                      <CardTitle>{theme.name}</CardTitle>
                      <CardDescription>{theme.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {available ? (
                        <Button className="w-full gap-2" onClick={() => handleThemeSelect(theme.id)}>
                          Vybrat <ArrowRight className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Badge variant="secondary" className="w-full justify-center py-2">
                          Připravujeme
                        </Badge>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        )}

        {/* Download / Result */}
        {stepName === 'download' && (
          <div className="space-y-6 max-w-lg mx-auto text-center">
            {!downloaded ? (
              <>
                <div>
                  <h1 className="text-3xl font-bold">Váš sešit je připraven</h1>
                  <p className="text-muted-foreground mt-2">
                    {isOrg
                      ? 'Vygenerujeme 3 pracovní sešity (lehká, střední, těžší obtížnost).'
                      : `Pracovní sešit na obtížnosti "${severity ? severityLabels[severity] : ''}" je připraven ke stažení.`}
                  </p>
                </div>

                <Card>
                  <CardContent className="py-8">
                    <div className="space-y-4">
                      <div className="text-sm text-muted-foreground">
                        <p>Téma: <strong>{themes.find((t) => t.id === selectedTheme)?.name}</strong></p>
                        {severity && <p>Obtížnost: <strong>{severityLabels[severity]}</strong></p>}
                        <p>Formát: PDF, 12 stran, 10 cvičení</p>
                      </div>

                      <Badge className="text-lg px-4 py-1">Zdarma</Badge>

                      <Button
                        onClick={handleGenerate}
                        disabled={generating}
                        size="lg"
                        className="w-full gap-2"
                      >
                        {generating ? (
                          <><Loader2 className="h-5 w-5 animate-spin" /> Generuji sešit...</>
                        ) : (
                          <><Download className="h-5 w-5" /> Stáhnout sešit zdarma</>
                        )}
                      </Button>
                      {error && (
                        <Alert variant="destructive">
                          <AlertDescription>{error}</AlertDescription>
                        </Alert>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <>
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="h-10 w-10 text-green-600" />
                </div>

                <h1 className="text-3xl font-bold">Sešit byl stažen!</h1>
                <p className="text-muted-foreground">
                  Váš první pracovní sešit je zdarma. Pro další sešity si vytvořte účet.
                </p>

                <div className="space-y-3">
                  <Link href={`/register?type=${role}`}>
                    <Button size="lg" className="w-full gap-2">
                      Vytvořit účet pro další sešity <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/">
                    <Button variant="outline" size="lg" className="w-full">
                      Zpět na hlavní stránku
                    </Button>
                  </Link>
                </div>

                <p className="text-xs text-muted-foreground">
                  Registrací získáte přístup k historii sešitů a dalším tématům.
                </p>
              </>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
