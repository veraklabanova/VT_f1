import type { Profile, UserRole } from '@/types'

export interface DemoAccount {
  id: string
  name: string
  email: string
  profile: Profile
}

export const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    id: 'demo-marie',
    name: 'Marie',
    email: 'marie@demo.cz',
    profile: {
      id: 'demo-marie',
      account_type: 'individual',
      role: 'pecujici' as UserRole,
      severity_level: 'stredni',
      organization_name: null,
      contact_info: null,
      free_workbook_used: false,
      created_at: '2026-01-01T00:00:00Z',
      updated_at: '2026-01-01T00:00:00Z',
    },
  },
  {
    id: 'demo-frantisek',
    name: 'František',
    email: 'frantisek@demo.cz',
    profile: {
      id: 'demo-frantisek',
      account_type: 'individual',
      role: 'osoba_s_postizenim' as UserRole,
      severity_level: 'tezsi',
      organization_name: null,
      contact_info: null,
      free_workbook_used: false,
      created_at: '2026-01-01T00:00:00Z',
      updated_at: '2026-01-01T00:00:00Z',
    },
  },
  {
    id: 'demo-azalka',
    name: 'Dům seniorů Azalka',
    email: 'azalka@demo.cz',
    profile: {
      id: 'demo-azalka',
      account_type: 'organization',
      role: 'organizace' as UserRole,
      severity_level: null,
      organization_name: 'Dům seniorů Azalka',
      contact_info: 'info@azalka.cz',
      free_workbook_used: false,
      created_at: '2026-01-01T00:00:00Z',
      updated_at: '2026-01-01T00:00:00Z',
    },
  },
  {
    id: 'demo-admin',
    name: 'Admin',
    email: 'admin@demo.cz',
    profile: {
      id: 'demo-admin',
      account_type: 'individual',
      role: 'admin' as UserRole,
      severity_level: null,
      organization_name: null,
      contact_info: null,
      free_workbook_used: false,
      created_at: '2026-01-01T00:00:00Z',
      updated_at: '2026-01-01T00:00:00Z',
    },
  },
]

export const DEFAULT_DEMO_ACCOUNT = DEMO_ACCOUNTS[0] // Marie
