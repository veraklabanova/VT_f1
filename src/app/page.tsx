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
        <section className="py-16 px-4 bg-gradient-to-b from-background to-secondary/50">
          <div className="max-w-5xl mx-auto text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
              Trénujte paměť a myšlení.
              <span className="text-primary block mt-1">V klidu a vlastním tempem.</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Připravili jsme pro vás pracovní sešity, které pomáhají udržovat
              mysl v kondici. Jsou sestavené odborníky a přizpůsobí se přesně tomu,
              co vy nebo vaši blízcí právě teď zvládnete.
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
                <h3 className="font-semibold mb-2">Odpovíte na pár otázek</h3>
                <p className="text-sm text-muted-foreground">
                  Zjistíme, jaká obtížnost pro vás bude ta pravá,
                  aby vás cvičení opravdu bavilo.
                </p>
              </div>
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-primary font-bold text-lg">2</span>
                </div>
                <h3 className="font-semibold mb-2">Vyberete si téma</h3>
                <p className="text-sm text-muted-foreground">
                  Zahrada, rodina nebo třeba tradice? Zvolte si to,
                  co je vašemu srdci nejbližší.
                </p>
              </div>
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-primary font-bold text-lg">3</span>
                </div>
                <h3 className="font-semibold mb-2">Vytisknete si sešit</h3>
                <p className="text-sm text-muted-foreground">
                  Hned si stáhnete PDF dokument, který si snadno
                  vytisknete doma. První je na nás.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Registration paths */}
        <section className="py-12 px-4 bg-secondary/50">
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
                  <CardTitle className="text-lg">Chci trénovat svou paměť</CardTitle>
                  <CardDescription>
                    Hledám cvičení pro sebe, abych se udržel/a v kondici.
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
                  <CardTitle className="text-lg">Hledám sešit pro někoho blízkého</CardTitle>
                  <CardDescription>
                    Chci pomoci s tréninkem paměti někomu v rodině.
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
                  <CardTitle className="text-lg">Hledáme materiály pro naše klienty</CardTitle>
                  <CardDescription>
                    Pro domovy seniorů a centra.
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
                  <h3 className="font-semibold mb-1">Sestavené odborníky</h3>
                  <p className="text-sm text-muted-foreground">
                    Cvičení cílí na paměť, pozornost, orientaci
                    a logické myšlení — přesně tam, kde je potřeba.
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
