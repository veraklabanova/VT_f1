'use client'

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { DEMO_ACCOUNTS, DEFAULT_DEMO_ACCOUNT, type DemoAccount } from './accounts'

interface DemoContextValue {
  currentAccount: DemoAccount
  accounts: DemoAccount[]
  switchAccount: (id: string) => void
}

const DemoContext = createContext<DemoContextValue | null>(null)

export function DemoProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const [currentAccount, setCurrentAccount] = useState<DemoAccount>(() => {
    // Restore from localStorage if available
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('vt_demo_account')
      if (stored) {
        const found = DEMO_ACCOUNTS.find((a) => a.id === stored)
        if (found) return found
      }
    }
    return DEFAULT_DEMO_ACCOUNT
  })

  const switchAccount = useCallback((id: string) => {
    const account = DEMO_ACCOUNTS.find((a) => a.id === id)
    if (!account) return
    setCurrentAccount(account)
    localStorage.setItem('vt_demo_account', id)
    // Full page reload to re-render server components with correct demo profile
    const role = account.profile.role
    if (role === 'admin') {
      window.location.href = '/admin/dashboard'
    } else if (role === 'organizace') {
      window.location.href = '/onboarding?role=organizace'
    } else if (role === 'osoba_s_postizenim') {
      window.location.href = '/onboarding?role=osoba_s_postizenim'
    } else {
      window.location.href = '/onboarding?role=pecujici'
    }
  }, [])

  return (
    <DemoContext.Provider value={{ currentAccount, accounts: DEMO_ACCOUNTS, switchAccount }}>
      {children}
    </DemoContext.Provider>
  )
}

export function useDemoMode() {
  const ctx = useContext(DemoContext)
  if (!ctx) {
    throw new Error('useDemoMode must be used within a DemoProvider')
  }
  return ctx
}
