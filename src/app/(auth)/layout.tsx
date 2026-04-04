import { Suspense } from 'react'
import Link from 'next/link'
import { Brain } from 'lucide-react'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="border-b bg-white px-4 py-3">
        <Link href="/" className="flex items-center gap-2 max-w-5xl mx-auto">
          <Brain className="h-6 w-6 text-primary" />
          <span className="font-bold">Vlastním tempem</span>
        </Link>
      </header>
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <Suspense>{children}</Suspense>
        </div>
      </main>
    </div>
  )
}
