import { envGeminiKey } from '../config/env'

// ─── Chat de reglas: Gemini incluido en la build ───────────────────────
// Sin SDK y sin claves de usuario: la app usa la clave VITE_GEMINI_API_KEY.
//
// Google retira modelos para usuarios nuevos con el tiempo (p. ej.
// gemini-2.5-flash responde 404) y los modelos punteros se saturan (503).
// Por eso: cadena de respaldo + timeout por intento.

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

/** Modelos en orden de preferencia: el primero que responda se usa. */
const GEMINI_MODELS = ['gemini-3.8-flash', 'gemini-flash-latest', 'gemini-flash-lite-latest']

/** Tiempo máximo por intento (ms). Un modelo saturado no debe bloquear el chat. */
const REQUEST_TIMEOUT_MS = 10_000

/** Error de disponibilidad del modelo: permite probar el siguiente de la cadena. */
class ModelUnavailableError extends Error {}

/** Pregunta a Gemini con el historial de la conversación. Devuelve el texto de respuesta. */
export async function askAi(messages: ChatMessage[], systemPrompt: string): Promise<string> {
  const key = envGeminiKey
  if (!key) {
    throw new Error(
      'El asistente de reglas no está configurado en esta build (falta VITE_GEMINI_API_KEY).',
    )
  }

  let lastError: Error | null = null
  for (const model of GEMINI_MODELS) {
    try {
      return await askModel(model, key, messages, systemPrompt)
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Error inesperado al hablar con Gemini.')
      lastError = error
      // Si es un fallo de disponibilidad del modelo, probamos el siguiente.
      if (!(err instanceof ModelUnavailableError)) throw error
    }
  }
  if (lastError instanceof ModelUnavailableError) {
    throw new Error(
      'Gemini está saturado o el modelo no está disponible ahora mismo. Espera un minuto e inténtalo otra vez.',
    )
  }
  throw lastError ?? new Error('No se pudo contactar con Gemini.')
}

async function askModel(
  model: string,
  key: string,
  messages: ChatMessage[],
  systemPrompt: string,
): Promise<string> {
  const controller = new AbortController()
  const timeoutId = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': key,
        },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemPrompt }] },
          contents: messages.map((m) => ({
            role: m.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: m.content }],
          })),
          generationConfig: { temperature: 0.4, maxOutputTokens: 1024 },
        }),
        signal: controller.signal,
      },
    )

    if (!res.ok) {
      // 404 (modelo retirado) y 503 (saturación) → probar el siguiente modelo.
      if (res.status === 404 || res.status === 503) {
        throw new ModelUnavailableError(`Modelo ${model} no disponible (código ${res.status}).`)
      }
      if (res.status === 400 || res.status === 401 || res.status === 403) {
        throw new Error('La clave de Gemini no es válida o no tiene permisos para esta API.')
      }
      if (res.status === 429) {
        throw new Error('Gemini ha alcanzado el límite de peticiones. Espera un momento e inténtalo otra vez.')
      }
      throw new Error(`Error de conexión con Gemini (código ${res.status}).`)
    }

    const data = (await res.json()) as {
      candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>
    }
    const text = (data.candidates?.[0]?.content?.parts ?? [])
      .map((p) => p.text ?? '')
      .join('')
      .trim()
    if (!text) throw new Error('Gemini no devolvió respuesta (quizá el mensaje fue bloqueado).')
    return text
  } catch (err) {
    if (err instanceof ModelUnavailableError) throw err
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new ModelUnavailableError(`Tiempo de espera agotado con ${model}.`)
    }
    if (err instanceof Error && err.name === 'AbortError') {
      throw new ModelUnavailableError(`Tiempo de espera agotado con ${model}.`)
    }
    if (err instanceof TypeError) {
      throw new Error('No se pudo conectar con Gemini. Revisa tu conexión a internet.')
    }
    throw err
  } finally {
    window.clearTimeout(timeoutId)
  }
}
