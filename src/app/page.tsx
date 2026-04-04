import Link from 'next/link'
import { Heart, Users, Building2, ArrowRight, BookOpen, Brain, Shield } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Yellow Prototype Banner */}
      <div className="bg-amber-100 border-b border-amber-300 px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-start gap-3">
          <Shield className="h-5 w-5 text-amber-700 mt-0.5 shrink-0" />
          <p className="text-sm text-amber-800">
            <strong>Toto je funkční prototyp</strong> aplikace Vlastním tempem.
            Slouží pro testování a demonstraci. Data a obsah mohou být neúplné.
            Aplikaci provozuje spolek Vlastním tempem, z.s.
          </p>
        </div>
      </div>

      {/* Header */}
      <header className="border-b bg-white">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="h-7 w-7 text-primary" />
            <span className="text-xl font-bold">Vlastním tempem</span>
          </div>
          <Link href="/login">
            <Button variant="outline" size="sm">Přihlásit se</Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1">
        <section className="py-16 px-4 bg-gradient-to-b from-white to-gray-50">
          <div className="max-w-5xl mx-auto text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
              Kognitivní trénink
              <span className="text-primary block mt-1">vlastním tempem</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Strukturované pracovní sešity pro osoby s kognitivním postižením
              a jejich pečující. Profesionálně navržené, přizpůsobené
              individuální úrovni.
            </p>
          </div>
        </section>

        {/* How it works */}
        <section className="py-12 px-4 bg-white">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-8">Jak to funguje</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-primary font-bold text-lg">1</span>
                </div>
                <h3 className="font-semibold mb-2">Vyplňte dotazník</h3>
                <p className="text-sm text-muted-foreground">
                  Krátký dotazník pomůže určit správnou úroveň obtížnosti
                  materiálů.
                </p>
              </div>
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-primary font-bold text-lg">2</span>
                </div>
                <h3 className="font-semibold mb-2">Vyberte téma</h3>
                <p className="text-sm text-muted-foreground">
                  Zvolte si téma, které je blízké — rodina, zahrada, domácnost
                  a další.
                </p>
              </div>
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-primary font-bold text-lg">3</span>
                </div>
                <h3 className="font-semibold mb-2">Stáhněte sešit</h3>
                <p className="text-sm text-muted-foreground">
                  Stáhněte si pracovní sešit ve formátu PDF — připravený
                  k vytištění.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Registration paths */}
        <section className="py-12 px-4 bg-gray-50">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-2">Začněte zdarma</h2>
            <p className="text-center text-muted-foreground mb-8">
              První pracovní sešit je zdarma. Vyberte, kdo jste:
            </p>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Person with impairment */}
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="text-center pb-2">
                  <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Heart className="h-7 w-7 text-blue-600" />
                  </div>
                  <CardTitle className="text-lg">Mám potíže s pamětí</CardTitle>
                  <CardDescription>
                    Chci trénovat paměť a další schopnosti
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Link href="/onboarding?role=osoba_s_postizenim">
                    <Button className="w-full gap-2">
                      Začít <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Caregiver */}
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="text-center pb-2">
                  <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Users className="h-7 w-7 text-green-600" />
                  </div>
                  <CardTitle className="text-lg">Starám se o blízkého</CardTitle>
                  <CardDescription>
                    Hledám materiály pro pečovanou osobu
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Link href="/onboarding?role=pecujici">
                    <Button className="w-full gap-2">
                      Začít <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Organization */}
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="text-center pb-2">
                  <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Building2 className="h-7 w-7 text-purple-600" />
                  </div>
                  <CardTitle className="text-lg">Jsme organizace</CardTitle>
                  <CardDescription>
                    Domov pro seniory, rehabilitační centrum aj.
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Link href="/onboarding?role=organizace">
                    <Button className="w-full gap-2">
                      Začít <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-12 px-4 bg-white">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="flex gap-4">
                <BookOpen className="h-6 w-6 text-primary shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Odborně navržené cvičení</h3>
                  <p className="text-sm text-muted-foreground">
                    Cvičení jsou navržena s ohledem na kognitivní funkce —
                    paměť, pozornost, orientaci, jazyk a logické myšlení.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <Brain className="h-6 w-6 text-primary shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Přizpůsobená obtížnost</h3>
                  <p className="text-sm text-muted-foreground">
                    Tři úrovně obtížnosti zajistí, že materiály odpovídají
                    aktuálním schopnostem.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white py-6 px-4">
        <div className="max-w-5xl mx-auto text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Vlastním tempem, z.s. Všechna práva vyhrazena.</p>
        </div>
      </footer>
    </div>
  )
}
