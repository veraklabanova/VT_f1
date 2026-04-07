'use client'

import Link from 'next/link'
import { useDemoMode } from '@/lib/demo/demo-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ClipboardList, Palette, BookOpen, ArrowRight, Shield } from 'lucide-react'

const severityLabels: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' }> = {
  lehka: { label: 'Lehká', variant: 'default' },
  stredni: { label: 'Střední', variant: 'secondary' },
  tezsi: { label: 'Těžší', variant: 'destructive' },
}

export function DemoDashboardPage() {
  const { currentAccount } = useDemoMode()
  const p = currentAccount.profile
  const isOrg = p.role === 'organizace'
  const isAdmin = p.role === 'admin'
  const needsAssessment = !isOrg && !isAdmin && !p.severity_level

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          {isOrg ? `Vítejte, ${p.organization_name}` : `Vítejte, ${currentAccount.name}`}
        </h1>
        <p className="text-muted-foreground mt-1">
          {isOrg
            ? 'Vyberte téma a stáhněte pracovní sešity pro vaše klienty.'
            : isAdmin
              ? 'Správa aplikace a obsahu.'
              : 'Váš osobní prostor pro kognitivní trénink.'}
        </p>
      </div>

      {/* Admin: link to admin section */}
      {isAdmin && (
        <Card className="border-2" style={{ borderColor: 'var(--lp-amber)', backgroundColor: 'var(--lp-amber-light)' }}>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="h-5 w-5" style={{ color: 'var(--lp-amber)' }} />
              Administrace
            </CardTitle>
            <CardDescription>
              Spravujte cvičení, témata a obsah aplikace.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/admin/dashboard">
              <Button className="gap-2">
                Přejít do administrace <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Status cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {!isOrg && !isAdmin && (
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Úroveň obtížnosti</CardDescription>
              <CardTitle className="text-lg">
                {p.severity_level ? (
                  <Badge variant={severityLabels[p.severity_level].variant}>
                    {severityLabels[p.severity_level].label}
                  </Badge>
                ) : (
                  <span className="text-amber-600">Nevyplněno</span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Link href="/assessment">
                <Button variant="outline" size="sm" className="gap-1">
                  <ClipboardList className="h-4 w-4" />
                  {p.severity_level ? 'Upravit dotazník' : 'Vyplnit dotazník'}
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Stažené sešity</CardDescription>
            <CardTitle className="text-2xl">0</CardTitle>
          </CardHeader>
          <CardContent>
            <Link href="/workbooks">
              <Button variant="outline" size="sm" className="gap-1">
                <BookOpen className="h-4 w-4" /> Historie sešitů
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Předplatné</CardDescription>
            <CardTitle className="text-lg">
              <Badge>Zdarma k dispozici</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Link href="/subscription">
              <Button variant="outline" size="sm" className="gap-1">
                Zobrazit nabídku
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Next steps */}
      {!isAdmin && (
        needsAssessment ? (
          <Card className="border-amber-200 bg-amber-50">
            <CardHeader>
              <CardTitle className="text-lg">Další krok: Vyplňte dotazník</CardTitle>
              <CardDescription>
                Před stažením prvního sešitu je potřeba vyplnit krátký dotazník,
                který pomůže určit správnou úroveň obtížnosti.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/assessment">
                <Button className="gap-2">
                  Vyplnit dotazník <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Vytvořit nový sešit</CardTitle>
              <CardDescription>
                Vyberte téma a stáhněte si pracovní sešit.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/themes">
                <Button className="gap-2">
                  <Palette className="h-4 w-4" /> Vybrat téma
                </Button>
              </Link>
            </CardContent>
          </Card>
        )
      )}
    </div>
  )
}
