'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CreditCard, Check, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import type { Subscription } from '@/types'

export default function SubscriptionPage() {
  const searchParams = useSearchParams()
  const success = searchParams.get('success')
  const cancelled = searchParams.get('cancelled')

  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [loading, setLoading] = useState(true)
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [cancelLoading, setCancelLoading] = useState(false)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      setSubscription(data as Subscription | null)
      setLoading(false)
    }
    load()
  }, [])

  async function handleCheckout() {
    setCheckoutLoading(true)
    try {
      const res = await fetch('/api/subscription/create-checkout', { method: 'POST' })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      }
    } catch {
      toast.error('Chyba při vytváření platby')
    }
    setCheckoutLoading(false)
  }

  async function handleCancel() {
    if (!confirm('Opravdu chcete zrušit předplatné? Zůstane aktivní do konce aktuálního období.')) return
    setCancelLoading(true)
    try {
      const res = await fetch('/api/subscription/cancel', { method: 'POST' })
      if (res.ok) {
        toast.success('Předplatné bude zrušeno na konci aktuálního období')
        window.location.reload()
      }
    } catch {
      toast.error('Chyba při rušení předplatného')
    }
    setCancelLoading(false)
  }

  const isActive = subscription?.status === 'active'
  const isCancelled = subscription?.cancelled_at !== null

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-3xl font-bold">Předplatné</h1>

      {success && (
        <Alert>
          <AlertDescription>Předplatné bylo úspěšně aktivováno!</AlertDescription>
        </Alert>
      )}
      {cancelled && (
        <Alert>
          <AlertDescription>Platba byla zrušena. Můžete to zkusit znovu.</AlertDescription>
        </Alert>
      )}

      {/* Current status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Stav předplatného
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : isActive ? (
            <div className="space-y-3">
              <Badge>{isCancelled ? 'Zrušeno (aktivní do konce období)' : 'Aktivní'}</Badge>
              {subscription?.current_period_end && (
                <p className="text-sm text-muted-foreground">
                  {isCancelled ? 'Aktivní do' : 'Další platba'}:{' '}
                  {new Date(subscription.current_period_end).toLocaleDateString('cs-CZ')}
                </p>
              )}
              {!isCancelled && (
                <Button variant="outline" size="sm" onClick={handleCancel} disabled={cancelLoading}>
                  {cancelLoading ? 'Ruším...' : 'Zrušit předplatné'}
                </Button>
              )}
            </div>
          ) : (
            <p className="text-muted-foreground">Nemáte aktivní předplatné.</p>
          )}
        </CardContent>
      </Card>

      {/* Pricing */}
      {!isActive && (
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Individuální</CardTitle>
              <CardDescription>Pro pečující a osoby s postižením</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-3xl font-bold">199 Kč<span className="text-sm font-normal text-muted-foreground">/měsíc</span></div>
              <ul className="space-y-2 text-sm">
                <li className="flex gap-2"><Check className="h-4 w-4 text-green-600" /> Neomezené pracovní sešity</li>
                <li className="flex gap-2"><Check className="h-4 w-4 text-green-600" /> Všechna témata</li>
                <li className="flex gap-2"><Check className="h-4 w-4 text-green-600" /> Historie stahování</li>
              </ul>
              <Button className="w-full" onClick={handleCheckout} disabled={checkoutLoading}>
                {checkoutLoading ? 'Přesměrování...' : 'Předplatit'}
              </Button>
            </CardContent>
          </Card>

          <Card className="border-primary">
            <CardHeader>
              <Badge className="w-fit mb-2">Pro organizace</Badge>
              <CardTitle>Institucionální</CardTitle>
              <CardDescription>Pro domovy seniorů, rehabilitační centra</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-3xl font-bold">499 Kč<span className="text-sm font-normal text-muted-foreground">/měsíc</span></div>
              <ul className="space-y-2 text-sm">
                <li className="flex gap-2"><Check className="h-4 w-4 text-green-600" /> 3 sešity na téma (všechny obtížnosti)</li>
                <li className="flex gap-2"><Check className="h-4 w-4 text-green-600" /> Hromadné stahování ZIP</li>
                <li className="flex gap-2"><Check className="h-4 w-4 text-green-600" /> Historie stahování</li>
              </ul>
              <Button className="w-full" onClick={handleCheckout} disabled={checkoutLoading}>
                {checkoutLoading ? 'Přesměrování...' : 'Předplatit'}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
