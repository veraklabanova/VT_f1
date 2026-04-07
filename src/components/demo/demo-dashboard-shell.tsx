'use client'

import { Suspense } from 'react'
import { useDemoMode } from '@/lib/demo/demo-context'
import { DashboardNav } from '@/components/dashboard/nav'
import { SiteFooter } from '@/components/shared/site-footer'

export function DemoDashboardShell({ children }: { children: React.ReactNode }) {
  const { currentAccount } = useDemoMode()
  const isSimplified = currentAccount.profile.role === 'osoba_s_postizenim'

  return (
    <div className={`min-h-screen flex flex-col ${isSimplified ? 'simplified-mode' : ''}`} style={{ backgroundColor: 'var(--lp-bg-primary)', fontFamily: 'var(--font-nunito, var(--font-sans))' }}>
      <DashboardNav profile={currentAccount.profile} email={currentAccount.email} isDemo />
      <main className="max-w-5xl mx-auto px-4 py-8 flex-1">
        <Suspense>{children}</Suspense>
      </main>
      <SiteFooter />
    </div>
  )
}
