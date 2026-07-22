import type { Handler, HandlerResponse } from '@netlify/functions'
import {
  createCheckoutSession,
  type CreateCheckoutBody,
} from './shared/checkout.js'

export const handler: Handler = async (event): Promise<HandlerResponse> => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json', Allow: 'POST' },
      body: JSON.stringify({ error: 'Method not allowed' }),
    }
  }

  try {
    const body = JSON.parse(event.body || '{}') as CreateCheckoutBody
    const origin =
      event.headers.origin ||
      event.headers.Origin ||
      process.env.SITE_URL ||
      'http://localhost:5173'

    const result = await createCheckoutSession(body, origin)

    if ('error' in result) {
      return {
        statusCode: result.status,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: result.error }),
      }
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: result.url }),
    }
  } catch (error) {
    console.error('create-checkout-session error:', error)
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        error: 'Något gick fel vid anmälan. Försök igen.',
      }),
    }
  }
}
