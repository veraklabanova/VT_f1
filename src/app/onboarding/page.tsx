'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Brain, Heart, Users, Building2, ArrowRight, ArrowLeft, Download, Loader2, CheckCircle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ASSESSMENT_QUESTIONS, computeSeverity, mapSeverityToDifficulty } from '@/lib/assessment/evaluate'
import { CoverPreview } from '@/components/workbook/cover-preview'
import type { UserRole, SeverityLevel } from '@/types'

const TOTAL_STEPS_INDIVIDUAL = 4 // role → assessment → theme → download
const TOTAL_STEPS_ORG = 3 // role → theme → download

const roleOptions = [
  {
    value: 'osoba_s_postizenim' as UserRole,
    label: 'Chci trénovat svou paměť',
    description: 'Hledám cvičení pro sebe, abych se udržel/a v kondici.',
    icon: Heart,
    color: 'bg-blue-100 text-blue-600',
  },
  {
    value: 'pecujici' as UserRole,
    label: 'Hledám sešit pro někoho blízkého',
    description: 'Chci pomoci s tréninkem paměti někomu v rodině.',
    icon: Users,
    color: 'bg-green-100 text-green-600',
  },
  {
    value: 'organizace' as UserRole,
    label: 'Hledáme materiály pro naše klienty',
    description: 'Pro domovy seniorů a centra.',
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

  async function downloadPdf(themeId: string, difficulty: string, label: string) {
    const res = await fetch('/api/workbooks/generate-pdf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ theme_id: themeId, difficulty }),
    })

    if (!res.ok) {
      const data = await res.json()
      throw new Error(data.error || 'Chyba při generování sešitu')
    }

    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    const themeName = themes.find((t) => t.id === themeId)?.name || 'sesit'
    a.href = url
    a.download = `vlastnim-tempem-${themeName.toLowerCase()}-${label}.pdf`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  async function handleGenerate() {
    if (!selectedTheme) return
    setGenerating(true)
    setError(null)

    try {
      if (isOrg) {
        for (const diff of ['lehka', 'stredni', 'tezsi'] as const) {
          await downloadPdf(selectedTheme, diff, diff)
        }
      } else {
        if (!severity) return
        const exerciseDifficulty = mapSeverityToDifficulty(severity)
        await downloadPdf(selectedTheme, exerciseDifficulty, exerciseDifficulty)
      }
      setDownloaded(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Chyba při generování')
    } finally {
      setGenerating(false)
    }
  }

  const stepProgress = Math.round(((step + 1) / totalSteps) * 100)

  return (
    <div className={`min-h-screen flex flex-col ${isFirstPerson ? 'simplified-mode a11y-theme' : ''}`} style={{ backgroundColor: 'var(--lp-bg-primary)', fontFamily: 'var(--font-nunito, var(--font-sans))' }}>
      {/* Header — fixed at top, matching landing page design */}
      <header className="fixed top-0 left-0 right-0 z-50" style={{ backgroundColor: 'var(--lp-card-bg)', borderBottom: '2px solid var(--lp-border)' }}>
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 no-underline">
            <Brain className="h-7 w-7" style={{ color: 'var(--lp-amber)' }} />
            <span className="text-xl font-bold" style={{ color: 'var(--lp-text)' }}>Vlastním tempem</span>
          </Link>
          {step > 0 && (
            <Badge variant="secondary" className="text-sm px-3 py-1">
              Krok {step + 1} z {totalSteps}
            </Badge>
          )}
        </div>
        {/* Progress bar */}
        <div className="h-1" style={{ backgroundColor: 'var(--lp-border)' }}>
          <div
            className="h-1 transition-all duration-300"
            style={{ width: `${stepProgress}%`, backgroundColor: 'var(--lp-amber)' }}
          />
        </div>
      </header>

      {/* Spacer for fixed header */}
      <div className="h-[4.5rem]" />

      <main className="max-w-3xl mx-auto px-4 py-8 flex-1">

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
              <Button variant="outline" size="default" onClick={() => setStep(0)} className="gap-2 mb-4">
                <ArrowLeft className="h-4 w-4" /> Zpět na výběr role
              </Button>
              <h1 className="text-3xl font-bold">Pojďme zjistit, co vám bude nejlépe vyhovovat</h1>
              <p className="text-muted-foreground mt-1">
                {isFirstPerson
                  ? 'Nemusíte se ničeho obávat. Tyto otázky nám jen napoví, jakou úroveň sešitu pro vás máme připravit, aby pro vás cvičení nebylo příliš těžké, ani příliš lehké.'
                  : 'Tyto otázky nám napoví, jakou úroveň sešitu připravit, aby cvičení nebylo příliš těžké, ani příliš lehké.'}
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
                  <div className="space-y-3">
                    {question.options.map((option) => (
                      <label
                        key={option.value}
                        className={`flex items-center gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all select-none
                          ${answers[question.id] === option.value
                            ? 'shadow-md'
                            : 'hover:shadow-md hover:-translate-y-px'}`}
                        style={{
                          backgroundColor: answers[question.id] === option.value ? 'var(--lp-amber-light)' : 'var(--lp-card-bg)',
                          borderColor: answers[question.id] === option.value ? 'var(--lp-amber)' : 'var(--lp-border)',
                          minHeight: '56px',
                        }}
                      >
                        <input
                          type="radio"
                          name={question.id}
                          value={option.value}
                          checked={answers[question.id] === option.value}
                          onChange={() => setAnswers((prev) => ({ ...prev, [question.id]: option.value }))}
                          className="sr-only"
                        />
                        <div
                          className="w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0"
                          style={{
                            borderColor: answers[question.id] === option.value ? 'var(--lp-amber)' : 'var(--lp-border)',
                            backgroundColor: answers[question.id] === option.value ? 'var(--lp-amber)' : 'transparent',
                          }}
                        >
                          {answers[question.id] === option.value && (
                            <CheckCircle className="h-4 w-4 text-white" />
                          )}
                        </div>
                        <span className={`text-base ${answers[question.id] === option.value ? 'font-semibold' : ''}`} style={{ color: 'var(--lp-text)' }}>
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
              <Button variant="outline" size="default" onClick={() => setStep(step - 1)} className="gap-2 mb-4">
                <ArrowLeft className="h-4 w-4" /> Zpět
              </Button>
              <h1 className="text-3xl font-bold">O čem si chcete číst a přemýšlet?</h1>
              <p className="text-muted-foreground mt-1">
                Vyberte si téma, které vás baví.
              </p>
              {severity && (
                <div className="mt-3 flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                  <CheckCircle className="h-5 w-5 text-green-600 shrink-0" />
                  <span className="text-green-800 font-medium">
                    Výborně, máme to! Podle vašich odpovědí vám bude nejlépe vyhovovat obtížnost „{severityLabels[severity]}". Teď už si jen vyberte téma.
                  </span>
                </div>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {themes.map((theme) => {
                const available = 'available' in theme ? theme.available : true
                return (
                  <Card
                    key={theme.id}
                    className={available
                      ? 'cursor-pointer hover:shadow-lg transition-all border-2 border-primary/20 hover:border-primary/50'
                      : 'opacity-40 pointer-events-none'}
                    onClick={available ? () => handleThemeSelect(theme.id) : undefined}
                  >
                    <CardHeader>
                      <CardTitle>{theme.name}</CardTitle>
                      <CardDescription>{theme.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {available ? (
                        <Button className="w-full gap-2">
                          Vybrat <ArrowRight className="h-4 w-4" />
                        </Button>
                      ) : (
                        <span className="text-sm text-muted-foreground italic">Připravujeme</span>
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
          <div className="space-y-6 max-w-2xl mx-auto text-center">
            {!downloaded ? (
              <>
                <div>
                  <h1 className="text-3xl font-bold" style={{ color: 'var(--lp-text)' }}>Skvělé, váš sešit je připraven!</h1>
                  <p className="mt-2" style={{ color: 'var(--lp-text-secondary)' }}>
                    {isOrg
                      ? 'Vygenerujeme 3 pracovní sešity (lehká, střední, těžší obtížnost).'
                      : `Pracovní sešit na obtížnosti „${severity ? severityLabels[severity] : ''}" je připraven ke stažení.`}
                  </p>
                </div>

                {/* Cover preview */}
                <CoverPreview
                  themeName={themes.find((t) => t.id === selectedTheme)?.name || ''}
                  difficultyLabel={severity ? severityLabels[severity] : isOrg ? 'Lehká / Střední / Těžší' : ''}
                />

                <div className="space-y-3 max-w-md mx-auto">
                  <span className="inline-block text-sm font-medium px-3 py-1 rounded-full" style={{ backgroundColor: 'var(--lp-sage-light)', color: 'var(--lp-sage)' }}>
                    Zdarma
                  </span>

                  <Button
                    onClick={handleGenerate}
                    disabled={generating}
                    size="lg"
                    className="w-full gap-2 text-lg py-6"
                  >
                    {generating ? (
                      <><Loader2 className="h-6 w-6 animate-spin" /> {isOrg ? 'Generuji sešity...' : 'Generuji sešit...'}</>
                    ) : (
                      <><Download className="h-6 w-6" /> {isOrg ? 'Stáhnout sešity ve třech obtížnostech (zdarma)' : 'Stáhnout můj první sešit (zdarma)'}</>
                    )}
                  </Button>
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  <p className="text-xs" style={{ color: 'var(--lp-text-secondary)' }}>
                    Pokud stahování nezačalo, <button onClick={handleGenerate} className="underline" style={{ color: 'var(--lp-amber)' }}>klikněte zde</button>.
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto" style={{ backgroundColor: 'var(--lp-sage-light)' }}>
                  <CheckCircle className="h-10 w-10" style={{ color: 'var(--lp-sage)' }} />
                </div>

                <h1 className="text-3xl font-bold" style={{ color: 'var(--lp-text)' }}>Sešit se stahuje k vám do počítače.</h1>
                <p style={{ color: 'var(--lp-text-secondary)' }}>
                  Můžete si ho rovnou vytisknout a v klidu se pustit do cvičení.
                  Líbí se vám náš přístup? Uložte si dnešní výsledek a získejte přístup k dalším krásným tématům.
                </p>

                <div className="space-y-3">
                  <Link href={`/register?type=${role}`}>
                    <Button size="lg" className="w-full gap-2 text-lg py-6">
                      Uložit výsledek a vytvořit bezplatný účet <ArrowRight className="h-5 w-5" />
                    </Button>
                  </Link>
                  <Link href="/">
                    <Button variant="outline" size="lg" className="w-full">
                      Zpět na hlavní stránku
                    </Button>
                  </Link>
                </div>

                <p className="text-sm" style={{ color: 'var(--lp-text-secondary)' }}>
                  S účtem získáte historii sešitů, přístup ke všem tématům a možnost generovat neomezené množství materiálů.
                </p>
              </>
            )}
          </div>
        )}
      </main>

      {/* Footer — matching landing page */}
      <div className="h-1" style={{ backgroundColor: 'var(--lp-divider)' }} />
      <footer className="py-6 px-4 text-center" style={{ backgroundColor: 'var(--lp-footer-bg)' }}>
        <p className="text-xs" style={{ color: 'var(--lp-text-on-dark-muted)' }}>
          &copy; {new Date().getFullYear()} — Kognitivní trénink
        </p>
      </footer>
    </div>
  )
}
