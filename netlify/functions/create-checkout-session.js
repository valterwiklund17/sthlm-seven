import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'
import {
  CURRENT_TOURNAMENT_ID,
  MAX_TEAMS,
  REGISTRATION_FEE_ORE,
  TOURNAMENT_FULL_MSG,
  TOURNAMENT_NAME,
} from './shared/tournament.ts'

function getEnv(name) {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`)
  }
  return value
}

function getSupabaseClient() {
  const supabaseUrl =
    process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    process.env.SUPABASE_ANON_KEY ??
    process.env.VITE_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase environment variables')
  }

  return createClient(supabaseUrl, supabaseKey)
}

async function createCheckoutSession(body, origin) {
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

  // Only count paid/confirmed rows for the active tournament.
  // Rows are inserted exclusively by the Stripe webhook after payment.
  const { count, error: countError } = await supabase
    .from('teams')
    .select('*', { count: 'exact', head: true })
    .eq('tournament_id', CURRENT_TOURNAMENT_ID)

  if (countError) {
    console.error('[create-checkout-session] Count error:', countError)
    return { error: 'Något gick fel vid anmälan. Försök igen.', status: 500 }
  }

  console.log('[create-checkout-session] Registered teams count:', {
    tournament_id: CURRENT_TOURNAMENT_ID,
    count,
    max: MAX_TEAMS,
  })

  if ((count ?? 0) >= MAX_TEAMS) {
    console.error(
      '[create-checkout-session] Tournament full — aborting before Stripe',
      { count, tournament_id: CURRENT_TOURNAMENT_ID },
    )
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

export async function handler(event) {
  console.log('[create-checkout-session] Incoming request', {
    method: event.httpMethod,
    path: event.path,
  })

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json', Allow: 'POST' },
      body: JSON.stringify({ error: 'Method not allowed' }),
    }
  }

  try {
    const body = JSON.parse(event.body || '{}')
    const origin =
      event.headers.origin ||
      event.headers.Origin ||
      process.env.SITE_URL ||
      'http://localhost:5173'

    console.log('[create-checkout-session] Creating session', {
      origin,
      hasTeamName: Boolean(body.team_name),
      hasEmail: Boolean(body.email),
      tournament_id: CURRENT_TOURNAMENT_ID,
    })

    const result = await createCheckoutSession(body, origin)

    if (result.error) {
      console.error('[create-checkout-session] Failed:', result.error)
      return {
        statusCode: result.status,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: result.error }),
      }
    }

    console.log('[create-checkout-session] Session created successfully')
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: result.url }),
    }
  } catch (error) {
    console.error('[create-checkout-session] Unhandled error:', error)
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        error: 'Något gick fel vid anmälan. Försök igen.',
      }),
    }
  }
}
