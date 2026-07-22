import type { Handler, HandlerResponse } from '@netlify/functions'
import { handleStripeWebhook } from './shared/checkout.js'

function getRawBody(event: {
  body: string | null
  isBase64Encoded: boolean
}): string {
  if (!event.body) {
    return ''
  }

  if (event.isBase64Encoded) {
    return Buffer.from(event.body, 'base64').toString('utf8')
  }

  return event.body
}

export const handler: Handler = async (event): Promise<HandlerResponse> => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { Allow: 'POST' },
      body: 'Method not allowed',
    }
  }

  try {
    const rawBody = getRawBody(event)
    const signature =
      event.headers['stripe-signature'] || event.headers['Stripe-Signature']

    const result = await handleStripeWebhook(rawBody, signature)

    return {
      statusCode: result.status,
      headers: { 'Content-Type': 'application/json' },
      body: result.body,
    }
  } catch (error) {
    console.error('stripe webhook error:', error)
    return {
      statusCode: 500,
      body: 'Webhook handler failed',
    }
  }
}
