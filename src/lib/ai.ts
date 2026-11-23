import { aiProxyUrl, hasAiProxy } from '../config/env'

// ─── Chat de reglas a través del proxy propio ─────────────────────────
// La API key de Gemini NO está en la app: vive en el Cloudflare Worker
// (worker/index.js) como secret. Aquí solo llamamos al proxy.

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

/** Tiempo máximo de espera del proxy (incluye su cadena de modelos con timeout). */
const PROXY_TIMEOUT_MS = 30_000

/** Pregunta al asistente con el historial de la conversación. Devuelve el texto de respuesta. */
export async function askAi(messages: ChatMessage[], systemPrompt: string): Promise<string> {
  if (!hasAiProxy) {
    throw new Error(
      'El asistente de reglas no está configurado en esta build (falta VITE_AI_PROXY_URL).',
    )
  }

  const controller = new AbortController()
  const timeoutId = window.setTimeout(() => controller.abort(), PROXY_TIMEOUT_MS)

  try {
    const res = await fetch(aiProxyUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ systemPrompt, messages }),
      signal: controller.signal,
    })

    const data = (await res.json().catch(() => null)) as { text?: string; error?: string } | null

    if (!res.ok) {
      throw new Error(data?.error || `Error del asistente (código ${res.status}).`)
    }
    const text = data?.text?.trim()
    if (!text) throw new Error('El asistente no devolvió respuesta.')
    return text
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new Error('El asistente ha tardado demasiado. Inténtalo de nuevo.')
    }
    if (err instanceof TypeError) {
      throw new Error('No se pudo conectar con el asistente. Revisa tu conexión a internet.')
    }
    throw err
  } finally {
    window.clearTimeout(timeoutId)
  }
}
