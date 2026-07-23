import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'
import { existsSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

function getLogoAttachment() {
  const candidates = [
    join(dirname(fileURLToPath(import.meta.url)), 'assets', 'sthlmsevenlogo.jpg'),
    join(process.cwd(), 'netlify/functions/assets/sthlmsevenlogo.jpg'),
    join(process.cwd(), 'assets', 'sthlmsevenlogo.jpg'),
  ]

  for (const filepath of candidates) {
    if (existsSync(filepath)) {
      console.log('[stripe-webhook] Found logo at', filepath)
      return {
        filename: 'sthlmsevenlogo.jpg',
        content: readFileSync(filepath),
      }
    }
  }

  console.error('[stripe-webhook] Logo file not found', { candidates })
  return null
}

function getHeader(headers, name) {
  const target = name.toLowerCase()
  for (const [key, value] of Object.entries(headers || {})) {
    if (key.toLowerCase() === target && typeof value === 'string') {
      return value
    }
  }
  return undefined
}

/**
 * Netlify may base64-encode the request body. Stripe signature verification
 * requires the exact raw UTF-8 payload Stripe sent.
 */
function extractRawBody(event) {
  console.log('[stripe-webhook] Extracting raw body', {
    isBase64Encoded: event.isBase64Encoded,
    bodyPresent: Boolean(event.body),
    bodyLength: event.body?.length ?? 0,
  })

  if (!event.body) {
    return ''
  }

  if (event.isBase64Encoded) {
    const decoded = Buffer.from(event.body, 'base64').toString('utf8')
    console.log('[stripe-webhook] Decoded base64 body', {
      decodedLength: decoded.length,
    })
    return decoded
  }

  return event.body
}

function getSupabaseClient() {
  const supabaseUrl =
    process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    process.env.SUPABASE_ANON_KEY ??
    process.env.VITE_SUPABASE_ANON_KEY

  console.log('[stripe-webhook] Supabase client config', {
    hasUrl: Boolean(supabaseUrl),
    hasServiceRoleKey: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
    hasAnonKey: Boolean(
      process.env.SUPABASE_ANON_KEY ?? process.env.VITE_SUPABASE_ANON_KEY,
    ),
  })

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase environment variables')
  }

  return createClient(supabaseUrl, supabaseKey)
}

export async function handler(event) {
  console.log('[stripe-webhook] Incoming request', {
    method: event.httpMethod,
    path: event.path,
  })

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { Allow: 'POST' },
      body: 'Method not allowed',
    }
  }

  try {
    const stripeSecret = process.env.STRIPE_SECRET_KEY
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

    console.log('[stripe-webhook] Env check', {
      hasStripeSecretKey: Boolean(stripeSecret),
      hasWebhookSecret: Boolean(webhookSecret),
      webhookSecretPrefix: webhookSecret?.slice(0, 6) ?? null,
    })

    if (!stripeSecret || !webhookSecret) {
      console.error('[stripe-webhook] Missing Stripe env vars')
      return {
        statusCode: 500,
        body: 'Server misconfigured',
      }
    }

    const rawBody = extractRawBody(event)
    const signature = getHeader(event.headers, 'stripe-signature')

    console.log('[stripe-webhook] Signature header check', {
      hasSignature: Boolean(signature),
      signatureLength: signature?.length ?? 0,
      rawBodyLength: rawBody.length,
      rawBodyStartsWith: rawBody.slice(0, 20),
    })

    if (!signature) {
      console.error('[stripe-webhook] Missing stripe-signature header')
      return {
        statusCode: 400,
        body: 'Missing Stripe signature',
      }
    }

    if (!rawBody) {
      console.error('[stripe-webhook] Empty request body')
      return {
        statusCode: 400,
        body: 'Empty body',
      }
    }

    const stripe = new Stripe(stripeSecret)

    let stripeEvent
    try {
      // Pass the exact raw string body — do not JSON.parse before this.
      stripeEvent = stripe.webhooks.constructEvent(
        rawBody,
        signature,
        webhookSecret,
      )
      console.log('[stripe-webhook] Signature verification succeeded', {
        eventId: stripeEvent.id,
        eventType: stripeEvent.type,
      })
    } catch (error) {
      console.error('[stripe-webhook] Signature verification FAILED', {
        message: error instanceof Error ? error.message : String(error),
      })
      return {
        statusCode: 400,
        body: `Webhook Error: ${
          error instanceof Error ? error.message : 'Invalid signature'
        }`,
      }
    }

    if (stripeEvent.type !== 'checkout.session.completed') {
      console.log('[stripe-webhook] Ignoring event type', {
        eventType: stripeEvent.type,
      })
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ received: true, ignored: true }),
      }
    }

    const session = stripeEvent.data.object
    const metadata = session.metadata ?? {}

    console.log('[stripe-webhook] Extracting metadata', {
      sessionId: session.id,
      metadata,
    })

    const team_name = metadata.team_name?.trim()
    const captain_name = metadata.captain_name?.trim()
    const email = metadata.email?.trim()
    const phone = metadata.phone?.trim()

    console.log('[stripe-webhook] Parsed team fields', {
      team_name,
      captain_name,
      email,
      phone,
    })

    if (!team_name || !captain_name || !email || !phone) {
      console.error('[stripe-webhook] Incomplete metadata — aborting insert')
      return {
        statusCode: 400,
        body: 'Missing team metadata',
      }
    }

    const supabase = getSupabaseClient()
    console.log('[stripe-webhook] Inserting team into Supabase...')

    const { data, error: insertError } = await supabase
      .from('teams')
      .insert({
        team_name,
        captain_name,
        email,
        phone,
      })
      .select()

    console.log('[stripe-webhook] Supabase insert response', {
      data,
      error: insertError,
    })

    if (insertError) {
      console.error('[stripe-webhook] Supabase insert FAILED', insertError)
      return {
        statusCode: 500,
        body: 'Database insert failed',
      }
    }

    console.log('[stripe-webhook] Team inserted successfully', {
      teamId: data?.[0]?.id,
    })

    const resendApiKey = process.env.RESEND_API_KEY
    if (!resendApiKey) {
      console.error('[stripe-webhook] RESEND_API_KEY missing — skipping email')
    } else {
      const resend = new Resend(resendApiKey)
      console.log('[stripe-webhook] Sending confirmation email to', email)

      const logoAttachment = getLogoAttachment()
      const emailPayload = {
        from: 'Sthlm Seven <info@sthlmseven.se>',
        to: email,
        subject: 'Anmälan bekräftad - Sthlm Seven',
        text: [
          `Hej ${captain_name},`,
          '',
          `Tack för er anmälan! Laget ${team_name} har nu säkrat en av de 16 platserna till Sthlm Seven.`,
          '',
          'Turneringen spelas den 14 augusti på Mälarhöjdens IP.',
          '',
          'Vi ses där!',
          '',
          'Vänliga hälsningar,',
          'Sthlm Seven',
        ].join('\n'),
        ...(logoAttachment
          ? {
              attachments: [
                {
                  filename: logoAttachment.filename,
                  content: logoAttachment.content,
                },
              ],
            }
          : {}),
      }

      try {
        const emailResult = await resend.emails.send(emailPayload)
        console.log('[stripe-webhook] Resend response', emailResult)
      } catch (error) {
        console.error('Resend API Error:', error)
      }
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ received: true }),
    }
  } catch (error) {
    console.error('[stripe-webhook] Unhandled error', error)
    return {
      statusCode: 500,
      body: 'Webhook handler failed',
    }
  }
}
