import type { VercelRequest, VercelResponse } from '@vercel/node'
import {
  createCheckoutSession,
  type CreateCheckoutBody,
} from './_lib/createCheckoutSession.js'

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const body = (req.body ?? {}) as CreateCheckoutBody
    const origin =
      (typeof req.headers.origin === 'string' && req.headers.origin) ||
      process.env.SITE_URL ||
      'http://localhost:5173'

    const result = await createCheckoutSession(body, origin)

    if ('error' in result) {
      return res.status(result.status).json({ error: result.error })
    }

    return res.status(200).json({ url: result.url })
  } catch (error) {
    console.error('create-checkout-session error:', error)
    return res
      .status(500)
      .json({ error: 'Något gick fel vid anmälan. Försök igen.' })
  }
}
