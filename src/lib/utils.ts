import type { Difficulty, Game } from '../types'

/** Une clases condicionales: cn('a', isActive && 'b') */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ')
}

/** Identificador único con fallback para navegadores antiguos. */
export function uid(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID()
  return `id-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}

// ─── Portadas sin imagen: degradado + iniciales ───────────────────────

const GRADIENTS = [
  'bg-linear-to-br from-amber-400 to-orange-600',
  'bg-linear-to-br from-sky-400 to-indigo-600',
  'bg-linear-to-br from-emerald-400 to-teal-600',
  'bg-linear-to-br from-fuchsia-400 to-purple-600',
  'bg-linear-to-br from-rose-400 to-red-600',
  'bg-linear-to-br from-cyan-400 to-blue-600',
  'bg-linear-to-br from-lime-400 to-green-600',
  'bg-linear-to-br from-violet-400 to-fuchsia-600',
]

/** Degradado determinista (y estable) a partir del título. */
export function coverGradient(title: string): string {
  let h = 0
  for (let i = 0; i < title.length; i++) h = (h * 31 + title.charCodeAt(i)) >>> 0
  return GRADIENTS[h % GRADIENTS.length]
}

/** Iniciales del título (máx. 2) para la portada generada. */
export function initials(title: string): string {
  const words = title.split(/\s+/).filter((w) => w.length > 0)
  const first = words[0]?.[0] ?? '?'
  const second = words.length > 1 ? (words[1]?.[0] ?? '') : ''
  return (first + second).toUpperCase()
}

// ─── Formato de metadatos ──────────────────────────────────────────────

export function formatPlayers(game: Pick<Game, 'playersMin' | 'playersMax'>): string {
  if (game.playersMin === game.playersMax) return `${game.playersMin} jugador${game.playersMin === 1 ? '' : 'es'}`
  return `${game.playersMin}–${game.playersMax} jugadores`
}

export function formatPlayersShort(game: Pick<Game, 'playersMin' | 'playersMax'>): string {
  return game.playersMin === game.playersMax ? `${game.playersMin}` : `${game.playersMin}–${game.playersMax}`
}

export function formatDuration(min: number): string {
  if (min < 60) return `≈ ${min} min`
  const h = Math.floor(min / 60)
  const rest = min % 60
  return rest === 0 ? `≈ ${h} h` : `≈ ${h} h ${rest} min`
}

export function difficultyDotClass(d: Difficulty): string {
  return (
    {
      1: 'bg-emerald-500',
      2: 'bg-lime-500',
      3: 'bg-amber-500',
      4: 'bg-orange-500',
      5: 'bg-rose-500',
    } satisfies Record<Difficulty, string>
  )[d]
}
