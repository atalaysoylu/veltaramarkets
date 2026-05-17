import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { existsSync } from 'node:fs'
import path from 'node:path'
import type { IncomingMessage, ServerResponse } from 'node:http'

type ApiHandler = (req: IncomingMessage, res: ServerResponse) => unknown | Promise<unknown>

/**
 * Vercel'in `@vercel/node` API'sini taklit eden minimum `res` yardımcıları.
 * Üretimde Vercel bu yardımcıları kendi çalışma zamanında zaten sağlar.
 */
function decorateRes(res: ServerResponse): ServerResponse {
  const r = res as ServerResponse & {
    status: (code: number) => typeof r
    json: (body: unknown) => typeof r
    send: (body: unknown) => typeof r
  }
  r.status = (code: number) => {
    r.statusCode = code
    return r
  }
  r.json = (body: unknown) => {
    if (!r.getHeader('Content-Type')) r.setHeader('Content-Type', 'application/json')
    r.end(JSON.stringify(body))
    return r
  }
  r.send = (body: unknown) => {
    if (body == null) {
      r.end()
    } else if (Buffer.isBuffer(body) || typeof body === 'string') {
      r.end(body)
    } else {
      r.json(body)
    }
    return r
  }
  return r
}

function decorateReq(req: IncomingMessage): IncomingMessage {
  const r = req as IncomingMessage & { query?: Record<string, string | string[]> }
  if (!r.query) {
    const idx = (req.url ?? '').indexOf('?')
    const qs = idx >= 0 ? (req.url ?? '').slice(idx + 1) : ''
    const params = new URLSearchParams(qs)
    const out: Record<string, string | string[]> = {}
    for (const [k, v] of params.entries()) {
      if (k in out) {
        const cur = out[k]
        out[k] = Array.isArray(cur) ? [...cur, v] : [cur as string, v]
      } else {
        out[k] = v
      }
    }
    r.query = out
  }
  return r
}

/**
 * `api/` altındaki Vercel serverless function dosyalarını local Vite dev sunucusunda da
 * `/api/<dosya>` olarak servis eder. Üretimde Vercel zaten kendi yönlendirmesini yapar.
 */
function localVercelApi(): Plugin {
  const apiDir = path.resolve(process.cwd(), 'api')

  function resolveHandlerFile(routePath: string): string | null {
    if (!routePath || routePath.startsWith('_')) return null
    const candidates = [
      path.join(apiDir, `${routePath}.ts`),
      path.join(apiDir, routePath, 'index.ts'),
    ]
    for (const file of candidates) {
      if (existsSync(file)) return file
    }
    return null
  }

  return {
    name: 'local-vercel-api',
    configureServer(server) {
      server.middlewares.use('/api', async (req, res, next) => {
        const url = req.url ?? ''
        const route = url.split('?')[0]?.replace(/^\//, '').replace(/\.ts$/, '') ?? ''
        const file = resolveHandlerFile(route)
        if (!file) return next()

        try {
          if (
            req.method === 'POST' ||
            req.method === 'PUT' ||
            req.method === 'PATCH' ||
            req.method === 'DELETE'
          ) {
            const chunks: Buffer[] = []
            for await (const chunk of req) chunks.push(chunk as Buffer)
            const raw = Buffer.concat(chunks).toString('utf8')
            let parsed: unknown = raw
            if (raw) {
              try {
                parsed = JSON.parse(raw)
              } catch {
                parsed = raw
              }
            } else {
              parsed = {}
            }
            ;(req as unknown as { body: unknown }).body = parsed
          }

          decorateReq(req)
          decorateRes(res)

          const mod = (await server.ssrLoadModule(file)) as { default?: ApiHandler }
          const handler = mod.default
          if (typeof handler !== 'function') {
            res.statusCode = 500
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ ok: false, reason: 'no_handler' }))
            return
          }

          await handler(req, res)
        } catch (err) {
          console.error('[local-vercel-api] handler error:', err)
          if (!res.headersSent) {
            res.statusCode = 500
            res.setHeader('Content-Type', 'application/json')
          }
          res.end(
            JSON.stringify({
              ok: false,
              reason: 'handler_error',
              detail: err instanceof Error ? err.message : String(err),
            }),
          )
        }
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), localVercelApi()],
})
