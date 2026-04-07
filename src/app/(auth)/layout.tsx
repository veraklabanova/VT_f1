import { Suspense } from 'react'
import Link from 'next/link'
import { SiteFooter } from '@/components/shared/site-footer'
import { SiteHeader } from '@/components/shared/site-header'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--lp-bg-primary)', fontFamily: 'var(--font-nunito, var(--font-sans))' }}>
      <SiteHeader
        rightContent={
          <Link href="/login">
            <button
              className="px-5 py-2 text-sm font-semibold"
              style={{
                backgroundColor: 'transparent',
                color: 'var(--lp-amber)',
                border: '2px solid var(--lp-amber)',
                borderRadius: '9999px',
              }}
            >
              Přihlásit se
            </button>
          </Link>
        }
      />
      <div className="h-[5rem]" />
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <Suspense>{children}</Suspense>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
