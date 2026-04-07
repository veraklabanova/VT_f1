export function SiteFooter() {
  return (
    <>
      <div className="h-1" style={{ backgroundColor: 'var(--lp-divider)' }} />
      <footer className="py-6 px-4 text-center" style={{ backgroundColor: 'var(--lp-footer-bg)' }}>
        <p className="text-xs" style={{ color: 'var(--lp-text-on-dark-muted)' }}>
          &copy; {new Date().getFullYear()} — Kognitivní trénink
        </p>
      </footer>
    </>
  )
}
