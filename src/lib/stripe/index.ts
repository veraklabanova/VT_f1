import Stripe from 'stripe'

let stripeClient: Stripe | null = null

export function getStripe() {
  if (!stripeClient) {
    stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      typescript: true,
    })
  }
  return stripeClient
}

// Keep backward compatibility
export const stripe = new Proxy({} as Stripe, {
  get(_, prop) {
    return (getStripe() as any)[prop]
  },
})

export function getStripePrice(tier: 'individual' | 'institutional'): string {
  return tier === 'individual'
    ? process.env.STRIPE_PRICE_INDIVIDUAL!
    : process.env.STRIPE_PRICE_INSTITUTIONAL!
}
