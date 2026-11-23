import type { AiProvider } from '../types'

// ─── Chat de reglas: cliente mínimo para Gemini y DeepSeek ────────────
// Sin SDK: dos llamadas fetch directas desde el navegador.

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

const GEMINI_MODEL = 'gemini-2.5-flash'
const GEMINI_URL = (model: string, key: string) =>
  `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(key)}`

const DEEPSEEK_URL = 'https://api.deepseek.com/chat/completions'
const DEEPSEEK_MODEL = 'deepseek-chat'

/** Pregunta a la IA con el historial de la conversación. Devuelve el texto de respuesta. */
export async function askAi(
  provider: AiProvider,
  apiKey: string,
  messages: ChatMessage[],
  systemPrompt: string,
): Promise<string> {
  if (!apiKey) throw new Error('Falta la API key: configúrala en Ajustes.')
  if (provider === 'gemini') return askGemini(apiKey, messages, systemPrompt)
  return askDeepSeek(apiKey, messages, systemPrompt)
}

async function httpError(res: Response): Promise<never> {
  if (res.status === 401 || res.status === 403) {
    throw new Error('La API key no es válida o no tiene permisos. Revísala en Ajustes.')
  }
  if (res.status === 429) {
    throw new Error('Has superado el límite de la API. Espera un momento e inténtalo otra vez.')
  }
  throw new Error(`Error de conexión con la IA (código ${res.status}).`)
}

async function askGemini(apiKey: string, messages: ChatMessage[], systemPrompt: string): Promise<string> {
  const res = await fetch(GEMINI_URL(GEMINI_MODEL, apiKey), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: systemPrompt }] },
      contents: messages.map((m) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      })),
      generationConfig: { temperature: 0.4, maxOutputTokens: 1024 },
    }),
  })
  if (!res.ok) await httpError(res)
  const data = (await res.json()) as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>
  }
  const text = (data.candidates?.[0]?.content?.parts ?? [])
    .map((p) => p.text ?? '')
    .join('')
    .trim()
  if (!text) throw new Error('La IA no devolvió respuesta (quizá el mensaje fue bloqueado).')
  return text
}

async function askDeepSeek(apiKey: string, messages: ChatMessage[], systemPrompt: string): Promise<string> {
  const res = await fetch(DEEPSEEK_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: DEEPSEEK_MODEL,
      messages: [{ role: 'system', content: systemPrompt }, ...messages],
      temperature: 0.4,
      max_tokens: 1024,
    }),
  })
  if (!res.ok) await httpError(res)
  const data = (await res.json()) as { choices?: Array<{ message?: { content?: string } }> }
  const text = data.choices?.[0]?.message?.content?.trim()
  if (!text) throw new Error('La IA no devolvió respuesta.')
  return text
}
