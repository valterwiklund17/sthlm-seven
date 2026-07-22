import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

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

  const { count, error: countError } = await supabase
    .from('teams')
    .select('*', { count: 'exact', head: true })

  if (countError) {
    console.error('[create-checkout-session] Count error:', countError)
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
