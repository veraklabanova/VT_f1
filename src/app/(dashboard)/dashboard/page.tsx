import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ClipboardList, Palette, BookOpen, ArrowRight } from 'lucide-react'
import type { Profile } from '@/types'

const severityLabels: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' }> = {
  lehka: { label: 'Lehká', variant: 'default' },
  stredni: { label: 'Střední', variant: 'secondary' },
  tezsi: { label: 'Těžší', variant: 'destructive' },
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile) redirect('/login')

  const p = profile as Profile
  const isOrg = p.role === 'organizace'
  const isAdmin = p.role === 'admin'
  const needsAssessment = !isOrg && !isAdmin && !p.severity_level

  const { count: workbookCount } = await supabase
    .from('workbooks')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id) as { count: number | null }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          {isOrg ? `Vítejte, ${p.organization_name}` : 'Vítejte'}
        </h1>
        <p className="text-muted-foreground mt-1">
          {isOrg
            ? 'Vyberte téma a stáhněte pracovní sešity pro vaše klienty.'
            : 'Váš osobní prostor pro kognitivní trénink.'}
        </p>
      </div>

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
            <CardTitle className="text-2xl">{workbookCount || 0}</CardTitle>
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
              {p.free_workbook_used ? (
                <Badge variant="secondary">Potřeba předplatné</Badge>
              ) : (
                <Badge>Zdarma k dispozici</Badge>
              )}
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
      {needsAssessment ? (
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
      )}
    </div>
  )
}
