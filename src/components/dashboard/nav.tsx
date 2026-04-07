'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Brain, Home, ClipboardList, Palette, BookOpen, CreditCard, Settings, LogOut, Shield } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { DemoSwitcher } from '@/components/demo/demo-switcher'
import type { Profile } from '@/types'

const roleLabels: Record<string, string> = {
  osoba_s_postizenim: 'Osoba',
  pecujici: 'Pečující',
  organizace: 'Organizace',
  admin: 'Admin',
}

interface DashboardNavProps {
  profile: Profile
  email: string
  isDemo?: boolean
}

export function DashboardNav({ profile, email, isDemo = false }: DashboardNavProps) {
  const router = useRouter()
  const isOrg = profile.role === 'organizace'

  async function handleSignOut() {
    if (isDemo) {
      router.push('/')
      return
    }
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const isAdmin = profile.role === 'admin'

  const navItems = [
    { href: '/dashboard', icon: Home, label: 'Přehled' },
    ...(!isOrg && !isAdmin
      ? [{ href: '/assessment', icon: ClipboardList, label: 'Dotazník' }]
      : []),
    ...(!isAdmin ? [
      { href: '/themes', icon: Palette, label: 'Témata' },
      { href: '/workbooks', icon: BookOpen, label: 'Sešity' },
      { href: '/subscription', icon: CreditCard, label: 'Předplatné' },
    ] : []),
    ...(isAdmin ? [
      { href: '/admin/dashboard', icon: Shield, label: 'Administrace' },
    ] : []),
  ]

  return (
    <header className="sticky top-0 z-50" style={{ backgroundColor: 'var(--lp-card-bg)', borderBottom: '2px solid var(--lp-border)' }}>
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="flex items-center gap-2 no-underline">
            <Brain className="h-7 w-7" style={{ color: 'var(--lp-amber)' }} />
            <span className="text-xl font-bold hidden sm:inline" style={{ color: 'var(--lp-text)' }}>Vlastním tempem</span>
          </Link>
          <nav className="flex items-center gap-1">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button variant="ghost" size="sm" className="gap-2">
                  <item.icon className="h-4 w-4" />
                  <span className="hidden md:inline">{item.label}</span>
                </Button>
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          {isDemo ? (
            <DemoSwitcher />
          ) : (
            <>
              <span className="text-sm hidden sm:inline" style={{ color: 'var(--lp-text-secondary)' }}>
                {profile.organization_name || email.split('@')[0]}
                <span className="text-xs ml-1">({roleLabels[profile.role]})</span>
              </span>
              {profile.role === 'admin' && (
                <Link href="/admin/dashboard">
                  <Button variant="outline" size="sm">Admin</Button>
                </Link>
              )}
              <Link href="/settings">
                <Button variant="ghost" size="sm"><Settings className="h-4 w-4" /></Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
