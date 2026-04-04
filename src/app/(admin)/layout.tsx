import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Brain, LayoutDashboard, Wand2, CheckSquare, Library, FolderTree, AlertTriangle, Shield, Archive, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AdminLogout } from '@/components/admin/logout-button'

const adminNavItems = [
  { href: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/generate', icon: Wand2, label: 'Generování' },
  { href: '/admin/review', icon: CheckSquare, label: 'Revize' },
  { href: '/admin/catalog', icon: Library, label: 'Katalog' },
  { href: '/admin/archive', icon: Archive, label: 'Archiv' },
  { href: '/admin/topics', icon: FolderTree, label: 'Témata' },
  { href: '/admin/errors', icon: AlertTriangle, label: 'Chyby' },
]

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  let isDemo = false

  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      // No Supabase connection or not logged in → demo mode
      isDemo = true
    } else {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (profile?.role !== 'admin') redirect('/dashboard')
    }
  } catch {
    // Supabase unavailable → demo mode
    isDemo = true
  }

  return (
    <div className="min-h-screen">
      {isDemo && (
        <div className="bg-amber-100 border-b border-amber-300 px-4 py-2">
          <div className="max-w-7xl mx-auto flex items-center gap-2">
            <Shield className="h-4 w-4 text-amber-700 shrink-0" />
            <p className="text-sm text-amber-800">
              <strong>Demo mód</strong> — admin rozhraní bez připojení k databázi. Data jsou ukázková.
            </p>
          </div>
        </div>
      )}
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-6">
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-primary" />
            <span className="font-bold">Admin</span>
          </Link>
          <nav className="flex items-center gap-1 overflow-x-auto">
            {adminNavItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button variant="ghost" size="sm" className="gap-2 whitespace-nowrap">
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Button>
              </Link>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <Link href="/dashboard">
              <Button variant="outline" size="sm">Zpět do aplikace</Button>
            </Link>
            <AdminLogout />
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-8">{children}</main>
    </div>
  )
}
