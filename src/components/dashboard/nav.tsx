'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Brain, Home, ClipboardList, Palette, BookOpen, CreditCard, Settings, LogOut } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
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
}

export function DashboardNav({ profile, email }: DashboardNavProps) {
  const router = useRouter()
  const isOrg = profile.role === 'organizace'

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const navItems = [
    { href: '/dashboard', icon: Home, label: 'Přehled' },
    ...(!isOrg
      ? [{ href: '/assessment', icon: ClipboardList, label: 'Dotazník' }]
      : []),
    { href: '/themes', icon: Palette, label: 'Témata' },
    { href: '/workbooks', icon: BookOpen, label: 'Sešity' },
    { href: '/subscription', icon: CreditCard, label: 'Předplatné' },
  ]

  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-primary" />
            <span className="font-bold hidden sm:inline">Vlastním tempem</span>
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
          <span className="text-sm text-muted-foreground hidden sm:inline">
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
        </div>
      </div>
    </header>
  )
}
