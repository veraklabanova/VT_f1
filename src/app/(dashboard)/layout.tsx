import { Suspense } from 'react'
import { isPrototypeMode } from '@/lib/prototype'
import { SiteFooter } from '@/components/shared/site-footer'
import type { Profile } from '@/types'

// Conditional imports — only load Supabase when not in prototype mode
async function getAuthProfile(): Promise<{ profile: Profile; email: string } | null> {
  if (isPrototypeMode) return null

  const { redirect } = await import('next/navigation')
  const { createClient } = await import('@/lib/supabase/server')
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile) redirect('/login')
  return { profile: profile as Profile, email: user.email || '' }
}

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  if (isPrototypeMode) {
    // In prototype mode, render client-side with demo context
    const { DemoDashboardShell } = await import('@/components/demo/demo-dashboard-shell')
    return <DemoDashboardShell>{children}</DemoDashboardShell>
  }

  const auth = await getAuthProfile()
  if (!auth) return null // Should never happen — getAuthProfile redirects

  const { DashboardNav } = await import('@/components/dashboard/nav')
  const { OnboardingSync } = await import('@/components/dashboard/onboarding-sync')
  const isSimplified = auth.profile.role === 'osoba_s_postizenim'

  return (
    <div className={`min-h-screen flex flex-col ${isSimplified ? 'simplified-mode' : ''}`} style={{ backgroundColor: 'var(--lp-bg-primary)', fontFamily: 'var(--font-nunito, var(--font-sans))' }}>
      <OnboardingSync />
      <DashboardNav profile={auth.profile} email={auth.email} />
      <main className="max-w-5xl mx-auto px-4 py-8 flex-1">
        <Suspense>{children}</Suspense>
      </main>
      <SiteFooter />
    </div>
  )
}
