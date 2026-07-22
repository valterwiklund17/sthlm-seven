import type { VercelRequest, VercelResponse } from '@vercel/node'
import { handleStripeWebhook } from '../_lib/createCheckoutSession.js'

export const config = {
  api: {
    bodyParser: false,
  },
}

async function readRawBody(req: VercelRequest): Promise<Buffer> {
  const chunks: Buffer[] = []
  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk)
  }
  return Buffer.concat(chunks)
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).send('Method not allowed')
  }

  try {
    const rawBody = await readRawBody(req)
    const result = await handleStripeWebhook(
      rawBody,
      req.headers['stripe-signature'],
    )
    res.status(result.status).send(result.body)
  } catch (error) {
    console.error('stripe webhook error:', error)
    res.status(500).send('Webhook handler failed')
  }
}
