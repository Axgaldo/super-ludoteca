/**
 * Proxy de Gemini para Super Ludoteca.
 *
 * La API key de Gemini vive SOLO aquí, como secret de Cloudflare
 * (env.GEMINI_API_KEY): nunca se envía al navegador ni aparece en el bundle
 * de la app. El cliente solo conoce la URL de este Worker.
 *
 * Despliegue rápido (gratis):
 *   1. https://dash.cloudflare.com → Workers & Pages → Create → Worker
 *   2. Pega este archivo en el editor y pulsa Deploy
 *   3. Settings → Variables and Secrets → Add:
 *        - GEMINI_API_KEY  (tipo: Secret) = tu clave de Gemini
 *        - ALLOWED_ORIGINS (tipo: Text)   = https://axgaldo.github.io,http://localhost:5173,http://localhost:4173
 *   4. Copia la URL del Worker (https://<nombre>.<usuario>.workers.dev)
 *      a VITE_AI_PROXY_URL en .env.local y en el secret FIREBASE_ENV.
 *
 * Extra (opcional): crea un KV namespace llamado RATE_LIMIT y asígnalo al
 * Worker como binding RATE_LIMIT para limitar peticiones por IP (40/hora).
 */

const MODELS = ['gemini-3.8-flash', 'gemini-flash-latest', 'gemini-flash-lite-latest']
const TIMEOUT_MS = 10_000
const MAX_BODY_BYTES = 40_000
const MAX_MESSAGES = 12
const MAX_PROMPT_CHARS = 8_000
const MAX_MESSAGE_CHARS = 4_000
const MAX_OUTPUT_TOKENS = 1_024
const RATE_LIMIT_PER_HOUR = 40

function corsHeaders(origin, allowed) {
  const allowedOrigin = allowed.length === 0 || allowed.includes(origin)
  if (!allowedOrigin) return {}
  return {
    'Access-Control-Allow-Origin': origin || '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  }
}

function json(body, status, headers) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...headers, 'Content-Type': 'application/json; charset=utf-8' },
  })
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || ''
    const allowed = String(env.ALLOWED_ORIGINS || '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
    const cors = corsHeaders(origin, allowed)

    // Preflight CORS
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors })
    }
    if (request.method !== 'POST') {
      return json({ error: 'Método no permitido.' }, 405, cors)
    }
    // Solo los orígenes declarados pueden usar el proxy (defensa en profundidad)
    if (allowed.length > 0 && !allowed.includes(origin)) {
      return json({ error: 'Origen no autorizado.' }, 403, cors)
    }

    const apiKey = env.GEMINI_API_KEY
    if (!apiKey) {
      return json({ error: 'Proxy sin configurar: falta el secret GEMINI_API_KEY.' }, 500, cors)
    }

    const contentLength = Number(request.headers.get('content-length') || 0)
    if (contentLength > MAX_BODY_BYTES) {
      return json({ error: 'Petición demasiado grande.' }, 413, cors)
    }

    // Rate limit por IP (solo si el binding RATE_LIMIT existe)
    if (env.RATE_LIMIT) {
      try {
        const ip = request.headers.get('CF-Connecting-IP') || 'unknown'
        const hour = new Date().toISOString().slice(0, 13)
        const key = `rl:${ip}:${hour}`
        const used = Number((await env.RATE_LIMIT.get(key)) || 0)
        if (used >= RATE_LIMIT_PER_HOUR) {
          return json({ error: 'Demasiadas peticiones. Espera un rato.' }, 429, cors)
        }
        await env.RATE_LIMIT.put(key, String(used + 1), { expirationTtl: 3600 })
      } catch {
        /* Si el KV falla, no bloqueamos el chat */
      }
    }

    let payload
    try {
      payload = await request.json()
    } catch {
      return json({ error: 'JSON no válido.' }, 400, cors)
    }

    const systemPrompt = String(payload?.systemPrompt || '').slice(0, MAX_PROMPT_CHARS)
    const rawMessages = Array.isArray(payload?.messages) ? payload.messages : []
    const messages = rawMessages.slice(-MAX_MESSAGES).map((m) => ({
      role: m?.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: String(m?.content || '').slice(0, MAX_MESSAGE_CHARS) }],
    }))
    if (messages.length === 0) {
      return json({ error: 'Faltan mensajes.' }, 400, cors)
    }

    // Cadena de respaldo de modelos + timeout por intento
    for (const model of MODELS) {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS)
      try {
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
            body: JSON.stringify({
              systemInstruction: { parts: [{ text: systemPrompt }] },
              contents: messages,
              generationConfig: { temperature: 0.4, maxOutputTokens: MAX_OUTPUT_TOKENS },
            }),
            signal: controller.signal,
          },
        )
        clearTimeout(timeoutId)

        if (res.status === 404 || res.status === 503) continue // probamos el siguiente modelo

        if (res.status === 429) {
          return json({ error: 'Gemini ha alcanzado el límite de peticiones. Espera un momento.' }, 429, cors)
        }
        if (!res.ok) {
          return json({ error: 'Gemini rechazó la petición. Inténtalo más tarde.' }, 502, cors)
        }

        const data = await res.json()
        const text = (data.candidates?.[0]?.content?.parts || [])
          .map((p) => p.text || '')
          .join('')
          .trim()
        if (!text) return json({ error: 'Gemini no devolvió respuesta.' }, 502, cors)
        return json({ text }, 200, cors)
      } catch {
        clearTimeout(timeoutId)
        // timeout o error de red con este modelo: probamos el siguiente
      }
    }

    return json({ error: 'Gemini está saturado ahora mismo. Inténtalo en un minuto.' }, 503, cors)
  },
}
