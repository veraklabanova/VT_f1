import Link from 'next/link'
import { Brain } from 'lucide-react'

interface SiteHeaderProps {
  rightContent?: React.ReactNode
  /** Show the prototype banner */
  showBanner?: boolean
}

export function SiteHeader({ rightContent, showBanner = false }: SiteHeaderProps) {
  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      {showBanner && (
        <div className="px-4 py-3" style={{ backgroundColor: 'var(--lp-amber-light)', borderBottom: '1px solid var(--lp-amber)' }}>
          <div className="max-w-5xl mx-auto flex items-start gap-3">
            <p className="text-sm" style={{ color: 'var(--lp-text-secondary)' }}>
              <strong>Toto je funkční prototyp</strong> aplikace Vlastním tempem.
              Slouží pro testování a demonstraci.
            </p>
          </div>
        </div>
      )}
      <header style={{ backgroundColor: 'var(--lp-card-bg)', borderBottom: '2px solid var(--lp-border)' }}>
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 no-underline">
            <Brain className="h-7 w-7" style={{ color: 'var(--lp-amber)' }} />
            <span className="text-xl font-bold" style={{ color: 'var(--lp-text)' }}>Vlastním tempem</span>
          </Link>
          {rightContent}
        </div>
      </header>
    </div>
  )
}
