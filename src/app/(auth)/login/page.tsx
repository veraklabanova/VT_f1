'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/dashboard'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const supabase = createClient()
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (signInError) {
      setError(
        signInError.message === 'Invalid login credentials'
          ? 'Nesprávný email nebo heslo'
          : signInError.message
      )
      setLoading(false)
      return
    }

    router.push(redirect)
    router.refresh()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Přihlášení</CardTitle>
        <CardDescription>Přihlaste se ke svému účtu</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="vas@email.cz"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Heslo</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Přihlašuji...' : 'Přihlásit se'}
          </Button>

          <div className="text-sm text-center space-y-2">
            <p className="text-muted-foreground">
              Nemáte účet?{' '}
              <Link href="/register" className="text-primary hover:underline">
                Zaregistrujte se
              </Link>
            </p>
            <p className="text-muted-foreground text-xs">
              Zapomněli jste heslo? Kontaktujte nás na{' '}
              <span className="font-medium">info@vlastnimtempem.cz</span>
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
