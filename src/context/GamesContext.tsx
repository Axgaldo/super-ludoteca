import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import {
  createFirestoreRepo,
  createLocalRepo,
  restoreDemoGamesLocally,
  type GamesRepo,
  type RepoMode,
} from '../lib/repos'
import { useAuth } from './AuthContext'
import { uid } from '../lib/utils'
import type { Game, GameDraft } from '../types'

interface SaveOptions {
  id?: string
  /** Si el juego viene del catálogo precargado */
  catalogId?: string
}

interface GamesContextValue {
  games: Game[]
  loading: boolean
  mode: RepoMode | null
  saveGame: (draft: GameDraft, opts?: SaveOptions) => Promise<Game>
  removeGame: (id: string) => Promise<void>
  restoreDemos: () => void
}

const GamesContext = createContext<GamesContextValue | null>(null)

function sortGames(games: Game[]): Game[] {
  return [...games].sort((a, b) => a.title.localeCompare(b.title, 'es'))
}

/** Lista de juegos según la sesión: Firestore (Google) o localStorage (invitado). */
export function GamesProvider({ children }: { children: ReactNode }) {
  const { status, user } = useAuth()
  const mode: RepoMode | null = status === 'user' ? 'cloud' : status === 'guest' ? 'local' : null
  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!mode) {
      setGames([])
      setLoading(false)
      return
    }
    setLoading(true)
    const repo: GamesRepo = mode === 'cloud' && user ? createFirestoreRepo(user.uid) : createLocalRepo()
    const unsubscribe = repo.subscribe(
      (next) => {
        setGames(sortGames(next))
        setLoading(false)
      },
      (error) => {
        console.error('Error al leer los juegos:', error)
        setGames([])
        setLoading(false)
      },
    )
    return unsubscribe
  }, [mode, user])

  const value = useMemo<GamesContextValue>(() => {
    const activeRepo = (): GamesRepo | null => {
      if (mode === 'cloud' && user) return createFirestoreRepo(user.uid)
      if (mode === 'local') return createLocalRepo(false)
      return null
    }
    return {
      games,
      loading,
      mode,
      async saveGame(draft, opts) {
        const repo = activeRepo()
        if (!repo) throw new Error('No hay sesión activa para guardar juegos.')
        const id = opts?.id ?? uid()
        const existing = games.find((g) => g.id === id)
        const game: Game = {
          ...draft,
          id,
          catalogId: opts?.catalogId ?? existing?.catalogId,
          createdAt: existing?.createdAt ?? Date.now(),
          updatedAt: Date.now(),
        }
        await repo.save(game)
        return game
      },
      async removeGame(id) {
        const repo = activeRepo()
        if (!repo) throw new Error('No hay sesión activa para eliminar juegos.')
        await repo.remove(id)
      },
      restoreDemos() {
        if (mode === 'local') restoreDemoGamesLocally()
      },
    }
  }, [games, loading, mode, user])

  return <GamesContext.Provider value={value}>{children}</GamesContext.Provider>
}

export function useGames(): GamesContextValue {
  const ctx = useContext(GamesContext)
  if (!ctx) throw new Error('useGames debe usarse dentro de GamesProvider')
  return ctx
}
