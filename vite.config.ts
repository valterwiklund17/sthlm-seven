import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import type { IncomingMessage, ServerResponse } from 'node:http'

function readRawBody(req: IncomingMessage): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = []
    req.on('data', (chunk: Buffer | string) => {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
    })
    req.on('end', () => resolve(Buffer.concat(chunks)))
    req.on('error', reject)
  })
}

function loadProcessEnv(mode: string) {
  const env = loadEnv(mode, process.cwd(), '')
  for (const [key, value] of Object.entries(env)) {
    if (process.env[key] === undefined) {
      process.env[key] = value
    }
  }
  return env
}

function apiPlugin(): Plugin {
  return {
    name: 'sthlm-seven-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url?.split('?')[0]

        if (url === '/api/create-checkout-session') {
          await handleCreateCheckout(req, res, server.config.mode)
          return
        }

        if (url === '/api/webhooks/stripe') {
          await handleStripeWebhookRoute(req, res, server.config.mode)
          return
        }

        next()
      })
    },
  }
}

async function handleCreateCheckout(
  req: IncomingMessage,
  res: ServerResponse,
  mode: string,
) {
  if (req.method !== 'POST') {
    res.statusCode = 405
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ error: 'Method not allowed' }))
    return
  }

  try {
    const rawBody = await readRawBody(req)
    const body = JSON.parse(rawBody.toString('utf8') || '{}')
    const env = loadProcessEnv(mode)

    const { createCheckoutSession } = await import(
      './api/_lib/createCheckoutSession.ts'
    )

    const origin =
      (typeof req.headers.origin === 'string' && req.headers.origin) ||
      env.SITE_URL ||
      'http://localhost:5173'

    const result = await createCheckoutSession(body, origin)

    res.setHeader('Content-Type', 'application/json')
    if ('error' in result) {
      res.statusCode = result.status
      res.end(JSON.stringify({ error: result.error }))
      return
    }

    res.statusCode = 200
    res.end(JSON.stringify({ url: result.url }))
  } catch (error) {
    console.error('create-checkout-session error:', error)
    res.statusCode = 500
    res.setHeader('Content-Type', 'application/json')
    res.end(
      JSON.stringify({
        error: 'Något gick fel vid anmälan. Försök igen.',
      }),
    )
  }
}

async function handleStripeWebhookRoute(
  req: IncomingMessage,
  res: ServerResponse,
  mode: string,
) {
  if (req.method !== 'POST') {
    res.statusCode = 405
    res.end('Method not allowed')
    return
  }

  try {
    loadProcessEnv(mode)
    const rawBody = await readRawBody(req)
    const { handleStripeWebhook } = await import(
      './api/_lib/createCheckoutSession.ts'
    )
    const result = await handleStripeWebhook(
      rawBody,
      req.headers['stripe-signature'],
    )
    res.statusCode = result.status
    res.end(result.body)
  } catch (error) {
    console.error('stripe webhook error:', error)
    res.statusCode = 500
    res.end('Webhook handler failed')
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), apiPlugin()],
})
