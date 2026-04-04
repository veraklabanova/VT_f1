import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe'
import { createAdminClient } from '@/lib/supabase/admin'
import type Stripe from 'stripe'

export async function POST(request: Request) {
  const body = await request.text()
  const headersList = await headers()
  const signature = headersList.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const supabase = createAdminClient()

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      const userId = session.metadata?.user_id
      const tier = session.metadata?.tier as 'individual' | 'institutional'

      if (!userId || !session.subscription) break

      const subscription = await stripe.subscriptions.retrieve(
        session.subscription as string
      )

      await supabase.from('subscriptions').upsert({
        user_id: userId,
        stripe_subscription_id: subscription.id,
        stripe_customer_id: session.customer as string,
        tier: tier || 'individual',
        status: 'active',
        current_period_start: new Date((subscription as any).current_period_start * 1000).toISOString(),
        current_period_end: new Date((subscription as any).current_period_end * 1000).toISOString(),
      }, { onConflict: 'stripe_subscription_id' })

      break
    }

    case 'invoice.paid': {
      const invoice = event.data.object as Stripe.Invoice
      if (!(invoice as any).subscription) break

      const subscription = await stripe.subscriptions.retrieve(
        (invoice as any).subscription as string
      )

      await supabase
        .from('subscriptions')
        .update({
          status: 'active',
          current_period_start: new Date((subscription as any).current_period_start * 1000).toISOString(),
          current_period_end: new Date((subscription as any).current_period_end * 1000).toISOString(),
        })
        .eq('stripe_subscription_id', subscription.id)

      break
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription

      await supabase
        .from('subscriptions')
        .update({ status: 'expired' })
        .eq('stripe_subscription_id', subscription.id)

      break
    }

    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription
      const status = (subscription as any).cancel_at_period_end ? 'cancelled' : 'active'

      await supabase
        .from('subscriptions')
        .update({
          status,
          current_period_end: new Date((subscription as any).current_period_end * 1000).toISOString(),
          cancelled_at: (subscription as any).cancel_at_period_end
            ? new Date().toISOString()
            : null,
        })
        .eq('stripe_subscription_id', subscription.id)

      break
    }
  }

  return NextResponse.json({ received: true })
}
