'use client'

import { useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import type { UserRole, AccountType } from '@/types'

const roleLabels: Record<string, { title: string; description: string }> = {
  osoba_s_postizenim: {
    title: 'Registrace — Mám potíže s pamětí',
    description: 'Vytvořte si účet pro přístup k tréninkovým materiálům.',
  },
  pecujici: {
    title: 'Registrace — Starám se o blízkého',
    description: 'Vytvořte si účet pečující osoby.',
  },
  organizace: {
    title: 'Registrace — Organizace',
    description: 'Vytvořte účet pro vaši organizaci.',
  },
}

export default function RegisterPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const type = searchParams.get('type') || 'pecujici'
  const roleInfo = roleLabels[type] || roleLabels.pecujici

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [orgName, setOrgName] = useState('')
  const [contactInfo, setContactInfo] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const isOrg = type === 'organizace'
  const role = type as UserRole
  const accountType: AccountType = isOrg ? 'organization' : 'individual'

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (isOrg && !orgName.trim()) {
      setError('Název organizace je povinný')
      setLoading(false)
      return
    }

    const supabase = createClient()
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          account_type: accountType,
          role,
          organization_name: isOrg ? orgName : undefined,
          contact_info: isOrg ? contactInfo : undefined,
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (signUpError) {
      setError(signUpError.message)
      setLoading(false)
      return
    }

    router.push('/verify-email')
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{roleInfo.title}</CardTitle>
        <CardDescription>{roleInfo.description}</CardDescription>
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
              placeholder="Alespoň 8 znaků"
              minLength={8}
              required
            />
          </div>

          {isOrg && (
            <>
              <div className="space-y-2">
                <Label htmlFor="orgName">Název organizace</Label>
                <Input
                  id="orgName"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  placeholder="Např. Domov pro seniory Kvetinka"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactInfo">Kontaktní údaje</Label>
                <Input
                  id="contactInfo"
                  value={contactInfo}
                  onChange={(e) => setContactInfo(e.target.value)}
                  placeholder="Telefon nebo kontaktní osoba"
                />
              </div>
            </>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Registruji...' : 'Zaregistrovat se'}
          </Button>

          <p className="text-sm text-center text-muted-foreground">
            Už máte účet?{' '}
            <Link href="/login" className="text-primary hover:underline">
              Přihlaste se
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
