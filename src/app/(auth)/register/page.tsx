'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Heart, Users, Building2 } from 'lucide-react'
import type { UserRole, AccountType } from '@/types'

const roleOptions = [
  { value: 'osoba_s_postizenim' as UserRole, label: 'Mám potíže s pamětí', icon: Heart, color: 'bg-blue-100 text-blue-600' },
  { value: 'pecujici' as UserRole, label: 'Starám se o blízkého', icon: Users, color: 'bg-green-100 text-green-600' },
  { value: 'organizace' as UserRole, label: 'Jsme organizace', icon: Building2, color: 'bg-purple-100 text-purple-600' },
]

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
  const typeFromUrl = searchParams.get('type') as UserRole | null

  const [selectedRole, setSelectedRole] = useState<UserRole | null>(typeFromUrl)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [orgName, setOrgName] = useState('')
  const [contactInfo, setContactInfo] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [hasOnboardingData, setHasOnboardingData] = useState(false)

  // Check if there's onboarding data in localStorage
  useEffect(() => {
    const data = localStorage.getItem('vt_onboarding')
    if (data) {
      const parsed = JSON.parse(data)
      setHasOnboardingData(true)
      if (!selectedRole && parsed.role) {
        setSelectedRole(parsed.role)
      }
    }
  }, [])

  // No role selected yet — show role picker
  if (!selectedRole) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Registrace</CardTitle>
          <CardDescription>Vyberte, kdo jste:</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {roleOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setSelectedRole(opt.value)}
              className="w-full flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors text-left"
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${opt.color}`}>
                <opt.icon className="h-5 w-5" />
              </div>
              <span className="font-medium">{opt.label}</span>
            </button>
          ))}
          <p className="text-sm text-center text-muted-foreground pt-2">
            Už máte účet?{' '}
            <Link href="/login" className="text-primary hover:underline">
              Přihlaste se
            </Link>
          </p>
        </CardContent>
      </Card>
    )
  }

  const roleInfo = roleLabels[selectedRole]
  const isOrg = selectedRole === 'organizace'
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

    // Read onboarding data from localStorage
    const onboardingRaw = localStorage.getItem('vt_onboarding')
    const onboarding = onboardingRaw ? JSON.parse(onboardingRaw) : null

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          account_type: accountType,
          role: selectedRole,
          organization_name: isOrg ? orgName : undefined,
          contact_info: isOrg ? contactInfo : undefined,
          // Pass onboarding data via metadata for post-registration processing
          onboarding_severity: onboarding?.severity || undefined,
          onboarding_answers: onboarding?.answers ? JSON.stringify(onboarding.answers) : undefined,
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
        <CardDescription>
          {roleInfo.description}
          {hasOnboardingData && (
            <span className="block mt-1 text-green-600 font-medium">
              Data z dotazníku budou automaticky přenesena do vašeho profilu.
            </span>
          )}
        </CardDescription>
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
                  placeholder="Např. Domov pro seniory Květinka"
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

          <div className="text-sm text-center space-y-1">
            {!typeFromUrl && (
              <button
                type="button"
                onClick={() => setSelectedRole(null)}
                className="text-primary hover:underline"
              >
                Změnit roli
              </button>
            )}
            <p className="text-muted-foreground">
              Už máte účet?{' '}
              <Link href="/login" className="text-primary hover:underline">
                Přihlaste se
              </Link>
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
