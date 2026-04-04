import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { stripe } from '@/lib/stripe'

export async function POST() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .single()

  if (!subscription?.stripe_subscription_id) {
    return NextResponse.json({ error: 'Žádné aktivní předplatné' }, { status: 404 })
  }

  await stripe.subscriptions.update(subscription.stripe_subscription_id, {
    cancel_at_period_end: true,
  })

  await supabase
    .from('subscriptions')
    .update({ cancelled_at: new Date().toISOString() })
    .eq('id', subscription.id)

  return NextResponse.json({ success: true })
}
