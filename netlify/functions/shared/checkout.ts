import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'
import {
  CURRENT_TOURNAMENT_ID,
  MAX_TEAMS,
  REGISTRATION_FEE_ORE,
  TOURNAMENT_FULL_MSG,
  TOURNAMENT_NAME,
} from './tournament.ts'

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

/** Count paid/confirmed teams for the active tournament only. */
export async function countRegisteredTeams(
  supabase: ReturnType<typeof getSupabaseClient>,
) {
  return supabase
    .from('teams')
    .select('*', { count: 'exact', head: true })
    .eq('tournament_id', CURRENT_TOURNAMENT_ID)
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

  const { count, error: countError } = await countRegisteredTeams(supabase)

  if (countError) {
    return { error: 'Något gick fel vid anmälan. Försök igen.', status: 500 }
  }

  if ((count ?? 0) >= MAX_TEAMS) {
    return {
      error: TOURNAMENT_FULL_MSG,
      status: 400,
    }
  }

  const stripe = new Stripe(getEnv('STRIPE_SECRET_KEY'))

  // Amount is controlled in code (REGISTRATION_FEE_ORE), not via STRIPE_PRICE_ID.
  const lineItems = [
    {
      price_data: {
        currency: 'sek',
        unit_amount: REGISTRATION_FEE_ORE,
        product_data: {
          name: `Sthlm Seven – ${TOURNAMENT_NAME}`,
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
      tournament_id: CURRENT_TOURNAMENT_ID,
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
  console.log('[stripe-webhook:local] Starting verification', {
    hasSignature: Boolean(signature),
    bodyType: typeof rawBody,
    bodyLength:
      typeof rawBody === 'string' ? rawBody.length : rawBody.byteLength,
  })

  if (!signature || Array.isArray(signature)) {
    console.error('[stripe-webhook:local] Missing stripe-signature')
    return { status: 400, body: 'Missing Stripe signature' }
  }

  const stripe = new Stripe(getEnv('STRIPE_SECRET_KEY'))
  const webhookSecret = getEnv('STRIPE_WEBHOOK_SECRET')

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret)
    console.log('[stripe-webhook:local] Signature verification succeeded', {
      eventType: event.type,
      eventId: event.id,
    })
  } catch (error) {
    console.error('[stripe-webhook:local] Signature verification failed:', error)
    return { status: 400, body: 'Invalid signature' }
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const metadata = session.metadata ?? {}

    console.log('[stripe-webhook:local] Metadata extracted', {
      sessionId: session.id,
      metadata,
    })

    const team_name = metadata.team_name?.trim()
    const captain_name = metadata.captain_name?.trim()
    const email = metadata.email?.trim()
    const phone = metadata.phone?.trim()
    const tournament_id =
      metadata.tournament_id?.trim() || CURRENT_TOURNAMENT_ID

    if (!team_name || !captain_name || !email || !phone) {
      console.error('[stripe-webhook:local] Missing team metadata', {
        sessionId: session.id,
        metadata,
      })
      return { status: 400, body: 'Missing team metadata' }
    }

    const supabase = getSupabaseClient()
    const { data, error: insertError } = await supabase
      .from('teams')
      .insert({
        team_name,
        captain_name,
        email,
        phone,
        tournament_id,
      })
      .select()

    console.log('[stripe-webhook:local] Supabase insert response', {
      data,
      error: insertError,
    })

    if (insertError) {
      console.error('[stripe-webhook:local] Failed to insert paid team:', insertError)
      return { status: 500, body: 'Database insert failed' }
    }
  }

  return { status: 200, body: JSON.stringify({ received: true }) }
}
