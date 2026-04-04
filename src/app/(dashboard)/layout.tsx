import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { DashboardNav } from '@/components/dashboard/nav'
import type { Profile } from '@/types'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile) redirect('/login')

  const isSimplified = profile.role === 'osoba_s_postizenim'

  return (
    <div className={isSimplified ? 'simplified-mode' : ''}>
      <DashboardNav profile={profile as Profile} email={user.email || ''} />
      <main className="max-w-5xl mx-auto px-4 py-8">
        <Suspense>{children}</Suspense>
      </main>
    </div>
  )
}
