'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Palette, Lock, ArrowRight } from 'lucide-react'
import type { Theme } from '@/types'

interface ThemeWithAvailability extends Theme {
  available: boolean
}

export default function ThemesPage() {
  const router = useRouter()
  const [themes, setThemes] = useState<ThemeWithAvailability[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadThemes() {
      const res = await fetch('/api/themes/available')
      if (res.ok) {
        const data = await res.json()
        setThemes(data.themes)
      }
      setLoading(false)
    }
    loadThemes()
  }, [])

  function handleSelect(themeId: string) {
    router.push(`/workbooks?theme=${themeId}`)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Vyberte téma</h1>
        <p className="text-muted-foreground mt-1">
          Zvolte si téma pro váš pracovní sešit.
        </p>
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}><CardContent className="p-6"><Skeleton className="h-32" /></CardContent></Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {themes.map((theme) => (
            <Card
              key={theme.id}
              className={`transition-shadow ${theme.available ? 'hover:shadow-lg cursor-pointer' : 'opacity-60'}`}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Palette className="h-8 w-8 text-primary" />
                  {!theme.available && <Lock className="h-4 w-4 text-muted-foreground" />}
                </div>
                <CardTitle>{theme.name}</CardTitle>
                <CardDescription>{theme.description}</CardDescription>
              </CardHeader>
              <CardContent>
                {theme.available ? (
                  <Button onClick={() => handleSelect(theme.id)} className="w-full gap-2">
                    Vybrat téma <ArrowRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <Badge variant="secondary" className="w-full justify-center py-2">
                    Připravujeme obsah
                  </Badge>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
