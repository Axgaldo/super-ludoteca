import { useEffect, useRef, useState } from 'react'
import type { Game } from '../types'
import { askAi, type ChatMessage } from '../lib/ai'
import { hasBuiltInAiKey } from '../config/env'
import { cn } from '../lib/utils'
import { Button, Chip } from './ui'
import { IconSend } from './icons'

const PLAYER_CONTEXT_OPTIONS = [2, 3, 4, 5, 6, 7, 8]
const HISTORY_LIMIT = 10

/** Prompt del árbitro de reglas: conoce el juego, la ficha y la sesión. */
function buildSystemPrompt(game: Game, players: number | null): string {
  return [
    'Eres el asistente de reglas de Super Ludoteca, una app española de apoyo para partidas de juegos de mesa.',
    'Responde SIEMPRE en español, de forma breve y directa (idealmente menos de 120 palabras), para resolver dudas EN MEDIO de una partida. Sin preámbulos ni cortesías.',
    'Si hay variantes caseras o de edición comunes para la duda, menciónalo en una línea al final.',
    '',
    `Partida actual: el juego es «${game.title}»${
      players ? `, jugado por ${players} jugadores` : ' (número de jugadores sin definir)'
    }.`,
    'Ficha resumen del juego (datos guardados por el usuario):',
    `Preparación: ${game.setup.join(' | ')}`,
    `Estructura del turno: ${game.turn.join(' | ')}`,
    `Fin de la partida: ${game.endCondition}`,
    `Puntuación: ${game.scoring.join(' | ')}`,
    game.forgotten.length > 0
      ? `Aclaraciones: ${game.forgotten.map((f) => `${f.title}: ${f.text}`).join(' | ')}`
      : '',
    '',
    'Si la respuesta no está en la ficha, usa tu conocimiento del juego real con ese nombre. Si no estás seguro o hay ediciones distintas, dilo y pregunta cuál se juega.',
  ]
    .filter(Boolean)
    .join('\n')
}

/** Renderiza las negritas sencillas de Gemini (**texto**) sin meter HTML. */
function renderText(content: string) {
  return content.split(/(\*\*[^*]+\*\*)/g).map((part, index) =>
    part.startsWith('**') && part.endsWith('**') ? (
      <strong key={index}>{part.slice(2, -2)}</strong>
    ) : (
      <span key={index}>{part}</span>
    ),
  )
}

/** Chat de dudas con contexto de la sesión de juego (Gemini incluido en la build). */
export function ChatPanel({ game }: { game: Game }) {
  const [players, setPlayers] = useState<number | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight })
  }, [messages, busy])

  async function send() {
    const text = input.trim()
    if (!text || busy) return
    const history = [...messages, { role: 'user' as const, content: text }]
    setMessages(history)
    setInput('')
    setBusy(true)
    setError(null)
    try {
      const answer = await askAi(history.slice(-HISTORY_LIMIT), buildSystemPrompt(game, players))
      setMessages((m) => [...m, { role: 'assistant', content: answer }])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error inesperado al hablar con la IA.')
    } finally {
      setBusy(false)
    }
  }

  if (!hasBuiltInAiKey) {
    return (
      <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4">
        <p className="text-sm font-bold">Asistente no disponible en esta build</p>
        <p className="mt-1 text-sm text-muted">
          Falta la clave de Gemini. Añade <code className="rounded bg-elev px-1 py-0.5 text-xs">VITE_GEMINI_API_KEY</code>{' '}
          al <code className="rounded bg-elev px-1 py-0.5 text-xs">.env.local</code> (o al secret{' '}
          <code className="rounded bg-elev px-1 py-0.5 text-xs">FIREBASE_ENV</code>) y vuelve a compilar.
        </p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-card">
      {/* Contexto de la sesión */}
      <div className="flex flex-wrap items-center gap-2 border-b border-line p-3">
        <p className="text-xs font-bold text-muted">Jugadores en la mesa:</p>
        <div className="flex flex-wrap gap-1.5">
          <Chip
            active={players === null}
            onClick={() => setPlayers(null)}
            className="min-h-8 px-2.5 text-xs"
            aria-label="Sin definir número de jugadores"
          >
            —
          </Chip>
          {PLAYER_CONTEXT_OPTIONS.map((n) => (
            <Chip
              key={n}
              active={players === n}
              onClick={() => setPlayers(n)}
              className="min-h-8 px-2.5 text-xs"
            >
              {n}
            </Chip>
          ))}
        </div>
      </div>

      <div className="space-y-3 p-3">
        <div ref={listRef} className="max-h-72 space-y-2 overflow-y-auto">
          {messages.length === 0 && (
            <p className="py-6 text-center text-sm text-muted">
              Pregunta cualquier duda de «{game.title}»: la IA conoce la ficha del juego
              {players ? ` y que jugáis ${players}` : ''}.
            </p>
          )}
          {messages.map((m, index) => (
            <div key={index} className={cn('flex', m.role === 'user' ? 'justify-end' : 'justify-start')}>
              <div
                className={cn(
                  'max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2 text-sm leading-relaxed',
                  m.role === 'user' ? 'bg-accent text-accent-ink' : 'bg-elev text-ink',
                )}
              >
                {renderText(m.content)}
              </div>
            </div>
          ))}
          {busy && <p className="py-1 text-center text-sm text-muted">Gemini está pensando…</p>}
        </div>

        {error && <p className="text-sm text-rose-500">{error}</p>}

        <form
          onSubmit={(e) => {
            e.preventDefault()
            void send()
          }}
          className="flex gap-2"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ej.: ¿puedo comerciar fuera de mi turno?"
            aria-label="Escribe tu duda"
            className="min-h-11 min-w-0 flex-1 rounded-xl border border-line bg-elev px-3 text-sm outline-none placeholder:text-muted/70 focus:border-accent"
          />
          <Button
            type="submit"
            variant="primary"
            aria-label="Enviar duda"
            disabled={busy || !input.trim()}
          >
            <IconSend className="h-5 w-5" />
          </Button>
        </form>
        <p className="text-[11px] text-muted">
          IA: Gemini · Las respuestas pueden fallar: en caso de disputa, manda el reglamento.
        </p>
      </div>
    </div>
  )
}
