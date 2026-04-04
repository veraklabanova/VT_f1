'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Profile } from '@/types'

const roleLabels: Record<string, string> = {
  osoba_s_postizenim: 'Osoba s kognitivním postižením',
  pecujici: 'Pečující osoba',
  organizace: 'Organizace',
  admin: 'Administrátor',
}

const severityLabels: Record<string, string> = {
  lehka: 'Lehká',
  stredni: 'Střední',
  tezsi: 'Těžší',
}

export default function SettingsPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [email, setEmail] = useState('')

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      setEmail(user.email || '')

      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      setProfile(data as Profile | null)
    }
    load()
  }, [])

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-3xl font-bold">Nastavení</h1>

      <Card>
        <CardHeader>
          <CardTitle>Profil</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Email</span>
            <span>{email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Role</span>
            <Badge variant="secondary">{profile ? roleLabels[profile.role] : '...'}</Badge>
          </div>
          {profile?.severity_level && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Úroveň obtížnosti</span>
              <Badge>{severityLabels[profile.severity_level]}</Badge>
            </div>
          )}
          {profile?.organization_name && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Organizace</span>
              <span>{profile.organization_name}</span>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Změna hesla</CardTitle>
          <CardDescription>
            Pro změnu hesla nás kontaktujte na info@vlastnimtempem.cz
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  )
}
