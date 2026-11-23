import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useGames } from '../context/GamesContext'
import type { Difficulty, GameTag } from '../types'
import { DIFFICULTY_LABELS, GAME_TAGS, GAME_TAG_KEYS } from '../types'
import { cn } from '../lib/utils'
import { GameCard } from '../components/GameCard'
import { Button, Chip } from '../components/ui'
import { IconPlus, IconSearch, IconSliders, IconX } from '../components/icons'

type DurationFilter = 'corto' | 'medio' | 'largo' | 'maraton'

const DURATION_OPTIONS: Array<{ key: DurationFilter; label: string; test: (min: number) => boolean }> = [
  { key: 'corto', label: 'Hasta 30 min', test: (m) => m <= 30 },
  { key: 'medio', label: '30–60 min', test: (m) => m > 30 && m <= 60 },
  { key: 'largo', label: '1–2 h', test: (m) => m > 60 && m <= 120 },
  { key: 'maraton', label: 'Más de 2 h', test: (m) => m > 120 },
]

const PLAYER_OPTIONS = [2, 3, 4, 5, 6]
const DIFFICULTY_OPTIONS: Difficulty[] = [1, 2, 3, 4, 5]

interface Filters {
  players: number | null
  duration: DurationFilter | null
  difficulty: Difficulty | null
  tag: GameTag | null
}

const NO_FILTERS: Filters = { players: null, duration: null, difficulty: null, tag: null }

/** Mi Ludoteca: buscador, filtros y cuadrícula de juegos. */
export default function LibraryView() {
  const { games, loading, mode, error } = useGames()
  const [query, setQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<Filters>(NO_FILTERS)

  const activeFilterCount =
    (filters.players !== null ? 1 : 0) +
    (filters.duration !== null ? 1 : 0) +
    (filters.difficulty !== null ? 1 : 0) +
    (filters.tag !== null ? 1 : 0)

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    const durationTest = DURATION_OPTIONS.find((d) => d.key === filters.duration)?.test
    return games.filter((g) => {
      if (q && !g.title.toLowerCase().includes(q)) return false
      if (filters.players !== null && !(g.playersMin <= filters.players && g.playersMax >= filters.players))
        return false
      if (durationTest && !durationTest(g.durationMin)) return false
      if (filters.difficulty !== null && g.difficulty !== filters.difficulty) return false
      if (filters.tag !== null && !(g.tags ?? []).includes(filters.tag)) return false
      return true
    })
  }, [games, query, filters])

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Mi Ludoteca</h1>
        <p className="text-sm text-muted">
          {loading
            ? 'Cargando…'
            : `${games.length} ${games.length === 1 ? 'juego' : 'juegos'}${
                mode === 'local' ? ' · modo invitado' : ''
              }`}
        </p>
      </div>

          {error && (
            <div className="rounded-xl border border-rose-500/40 bg-rose-500/10 p-3 text-sm text-rose-600 dark:text-rose-400">
              <p className="font-bold">Problema al sincronizar con Firestore</p>
              <p className="mt-0.5">{error}</p>
            </div>
          )}

      {/* Buscador + botón de filtros */}
      <div className="flex gap-2">
        <div className="flex h-11 min-w-0 flex-1 items-center gap-2 rounded-xl border border-line bg-card px-3">
          <IconSearch className="h-5 w-5 shrink-0 text-muted" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por título…"
            aria-label="Buscar juego por título"
            className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted/70"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label="Limpiar búsqueda"
              className="rounded-full p-1 text-muted transition-colors hover:text-ink"
            >
              <IconX className="h-4 w-4" />
            </button>
          )}
        </div>
        <button
          type="button"
          onClick={() => setShowFilters((v) => !v)}
          aria-label="Mostrar filtros"
          aria-expanded={showFilters}
          className={cn(
            'relative inline-flex h-11 items-center gap-2 rounded-xl border px-3 font-bold transition-colors',
            showFilters || activeFilterCount > 0
              ? 'border-accent bg-accent-soft text-ink'
              : 'border-line bg-card text-muted hover:text-ink',
          )}
        >
          <IconSliders className="h-5 w-5" />
          {activeFilterCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[11px] font-extrabold text-accent-ink">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Panel de filtros */}
      {showFilters && (
        <div className="fade-up space-y-4 rounded-2xl border border-line bg-card p-4">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-wide text-muted">Jugadores</p>
            <div className="flex flex-wrap gap-2">
              {PLAYER_OPTIONS.map((n) => (
                <Chip
                  key={n}
                  active={filters.players === n}
                  onClick={() => setFilters((f) => ({ ...f, players: f.players === n ? null : n }))}
                >
                  {n === 6 ? '6+' : `${n}`}
                </Chip>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-wide text-muted">Duración</p>
            <div className="flex flex-wrap gap-2">
              {DURATION_OPTIONS.map((d) => (
                <Chip
                  key={d.key}
                  active={filters.duration === d.key}
                  onClick={() => setFilters((f) => ({ ...f, duration: f.duration === d.key ? null : d.key }))}
                >
                  {d.label}
                </Chip>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-wide text-muted">
              Dificultad para novatos
            </p>
            <div className="flex flex-wrap gap-2">
              {DIFFICULTY_OPTIONS.map((d) => (
                <Chip
                  key={d}
                  active={filters.difficulty === d}
                  onClick={() => setFilters((f) => ({ ...f, difficulty: f.difficulty === d ? null : d }))}
                >
                  {DIFFICULTY_LABELS[d]}
                </Chip>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-wide text-muted">Categoría</p>
            <div className="flex flex-wrap gap-2">
              {GAME_TAG_KEYS.map((tag) => (
                <Chip
                  key={tag}
                  active={filters.tag === tag}
                  onClick={() => setFilters((f) => ({ ...f, tag: f.tag === tag ? null : tag }))}
                >
                  {GAME_TAGS[tag].label}
                </Chip>
              ))}
            </div>
          </div>

          {activeFilterCount > 0 && (
            <button
              type="button"
              onClick={() => setFilters(NO_FILTERS)}
              className="text-sm font-bold text-accent underline underline-offset-2"
            >
              Quitar todos los filtros
            </button>
          )}
        </div>
      )}

      {/* Cuadrícula */}
      {loading ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse overflow-hidden rounded-2xl border border-line bg-card">
              <div className="aspect-[4/5] bg-elev" />
              <div className="space-y-2 p-3">
                <div className="h-4 w-3/4 rounded bg-elev" />
                <div className="h-3 w-1/2 rounded bg-elev" />
              </div>
            </div>
          ))}
        </div>
      ) : visible.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {visible.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-line bg-card p-8 text-center">
          {games.length === 0 ? (
            <>
              <p className="font-bold">Tu ludoteca está vacía</p>
              <p className="mt-1 text-sm text-muted">
                Añade juegos desde el catálogo precargado o crea uno a mano.
              </p>
              <div className="mt-4 flex justify-center">
                <Link to="/nuevo">
                  <Button variant="primary">Añadir tu primer juego</Button>
                </Link>
              </div>
            </>
          ) : (
            <>
              <p className="font-bold">Ningún juego coincide</p>
              <p className="mt-1 text-sm text-muted">Prueba con otra búsqueda o quita filtros.</p>
            </>
          )}
        </div>
      )}

      {/* Botón flotante: añadir juego */}
      <Link
        to="/nuevo"
        aria-label="Añadir juego"
        className="fixed bottom-[calc(1.25rem+env(safe-area-inset-bottom))] right-4 z-40 inline-flex min-h-12 items-center gap-2 rounded-full bg-accent px-5 font-extrabold text-accent-ink shadow-lg transition-transform hover:brightness-90 active:scale-95"
      >
        <IconPlus className="h-5 w-5" />
        Añadir juego
      </Link>
    </div>
  )
}
