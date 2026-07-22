import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

export type CreateCheckoutBody = {
  team_name: string
  captain_name: string
  email: string
  phone: string
}

export type CreateCheckoutResult =
  | { url: string }
  | { error: string; status: number }

function getEnv(name: string): string {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`)
  }
  return value
}

function getSupabaseClient() {
  const supabaseUrl =
    process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL
  // Prefer service role for secure server-side inserts (webhook).
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    process.env.SUPABASE_ANON_KEY ??
    process.env.VITE_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase environment variables')
  }

  return createClient(supabaseUrl, supabaseKey)
}

export async function createCheckoutSession(
  body: CreateCheckoutBody,
  origin: string,
): Promise<CreateCheckoutResult> {
  const { team_name, captain_name, email, phone } = body

  if (
    !team_name?.trim() ||
    !captain_name?.trim() ||
    !email?.trim() ||
    !phone?.trim()
  ) {
    return { error: 'Alla fält måste fyllas i.', status: 400 }
  }

  const supabase = getSupabaseClient()

  const { count, error: countError } = await supabase
    .from('teams')
    .select('*', { count: 'exact', head: true })

  if (countError) {
    return { error: 'Något gick fel vid anmälan. Försök igen.', status: 500 }
  }

  if ((count ?? 0) >= 16) {
    return { error: 'Turneringen är fullbokad', status: 403 }
  }

  const stripe = new Stripe(getEnv('STRIPE_SECRET_KEY'))

  const priceId = process.env.STRIPE_PRICE_ID
  const lineItems = priceId
    ? [{ price: priceId, quantity: 1 }]
    : [
        {
          price_data: {
            currency: 'sek',
            unit_amount: 100000,
            product_data: {
              name: 'Sthlm Seven – Anmälningsavgift',
            },
          },
          quantity: 1,
        },
      ]

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    allow_promotion_codes: true,
    customer_email: email.trim(),
    metadata: {
      team_name: team_name.trim(),
      captain_name: captain_name.trim(),
      email: email.trim(),
      phone: phone.trim(),
    },
    line_items: lineItems,
    success_url: `${origin}/?success=true`,
    cancel_url: `${origin}/#anmalan`,
  })

  if (!session.url) {
    return { error: 'Något gick fel vid anmälan. Försök igen.', status: 500 }
  }

  return { url: session.url }
}

export async function handleStripeWebhook(
  rawBody: Buffer | string,
  signature: string | string[] | undefined,
): Promise<{ status: number; body: string }> {
  if (!signature || Array.isArray(signature)) {
    return { status: 400, body: 'Missing Stripe signature' }
  }

  const stripe = new Stripe(getEnv('STRIPE_SECRET_KEY'))
  const webhookSecret = getEnv('STRIPE_WEBHOOK_SECRET')

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret)
  } catch (error) {
    console.error('Stripe webhook signature verification failed:', error)
    return { status: 400, body: 'Invalid signature' }
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const metadata = session.metadata ?? {}

    const team_name = metadata.team_name?.trim()
    const captain_name = metadata.captain_name?.trim()
    const email = metadata.email?.trim()
    const phone = metadata.phone?.trim()

    if (!team_name || !captain_name || !email || !phone) {
      console.error('Missing team metadata on checkout.session.completed', {
        sessionId: session.id,
        metadata,
      })
      return { status: 400, body: 'Missing team metadata' }
    }

    const supabase = getSupabaseClient()
    const { error: insertError } = await supabase.from('teams').insert({
      team_name,
      captain_name,
      email,
      phone,
    })

    if (insertError) {
      console.error('Failed to insert paid team:', insertError)
      return { status: 500, body: 'Database insert failed' }
    }
  }

  return { status: 200, body: JSON.stringify({ received: true }) }
}
