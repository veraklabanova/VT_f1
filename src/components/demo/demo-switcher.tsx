'use client'

import { useDemoMode } from '@/lib/demo/demo-context'
import { ChevronDown, Heart, Users, Building2, Shield } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const roleIcons: Record<string, typeof Heart> = {
  pecujici: Users,
  osoba_s_postizenim: Heart,
  organizace: Building2,
  admin: Shield,
}

const roleLabels: Record<string, string> = {
  pecujici: 'Pečující',
  osoba_s_postizenim: 'Osoba',
  organizace: 'Organizace',
  admin: 'Admin',
}

export function DemoSwitcher() {
  const { currentAccount, accounts, switchAccount } = useDemoMode()
  const CurrentIcon = roleIcons[currentAccount.profile.role] || Users

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium transition-colors"
          style={{
            backgroundColor: 'var(--lp-amber-light)',
            color: 'var(--lp-amber)',
            border: '2px solid var(--lp-amber)',
            borderRadius: '9999px',
          }}
        >
          <CurrentIcon className="h-4 w-4" />
          <span className="hidden sm:inline">{currentAccount.name}</span>
          <span
            className="text-xs px-1.5 py-0.5 hidden md:inline"
            style={{
              backgroundColor: 'var(--lp-amber)',
              color: 'white',
              borderRadius: '9999px',
              fontSize: '10px',
            }}
          >
            {roleLabels[currentAccount.profile.role]}
          </span>
          <ChevronDown className="h-3 w-3" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <div className="px-3 py-2 text-xs font-semibold" style={{ color: 'var(--lp-text-secondary)' }}>
          Přepnout demo účet
        </div>
        {accounts.map((account) => {
          const Icon = roleIcons[account.profile.role] || Users
          const isActive = account.id === currentAccount.id
          return (
            <DropdownMenuItem
              key={account.id}
              onClick={() => switchAccount(account.id)}
              className="flex items-center gap-3 py-2.5 cursor-pointer"
              style={isActive ? { backgroundColor: 'var(--lp-amber-light)' } : undefined}
            >
              <Icon className="h-4 w-4 shrink-0" style={{ color: 'var(--lp-amber)' }} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{account.name}</p>
                <p className="text-xs" style={{ color: 'var(--lp-text-secondary)' }}>
                  {roleLabels[account.profile.role]}
                </p>
              </div>
              {isActive && (
                <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: 'var(--lp-amber)', color: 'white' }}>
                  Aktivní
                </span>
              )}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
