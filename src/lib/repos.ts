import { collection, deleteDoc, doc, onSnapshot, setDoc } from 'firebase/firestore'
import { getFirebase } from './firebase'
import { DEMO_GAMES } from '../data/demoGames'
import type { Game } from '../types'

export type RepoMode = 'cloud' | 'local'

/** Abstracción del almacenamiento de juegos: Firestore (cloud) o localStorage (local). */
export interface GamesRepo {
  mode: RepoMode
  subscribe(onData: (games: Game[]) => void, onError?: (error: unknown) => void): () => void
  save(game: Game): Promise<void>
  remove(id: string): Promise<void>
}

// ─── Repositorio local (Modo Invitado) ─────────────────────────────────

const LS_KEY = 'sl:games:v1'
const SEEDED_KEY = 'sl:seeded'
const CHANGED_EVENT = 'sl:games-changed'

function readLocal(): Game[] | null {
  try {
    const raw = localStorage.getItem(LS_KEY)
    if (raw === null) return null
    const parsed: unknown = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as Game[]) : null
  } catch {
    return null
  }
}

function writeLocal(games: Game[]): void {
  localStorage.setItem(LS_KEY, JSON.stringify(games))
  window.dispatchEvent(new CustomEvent(CHANGED_EVENT))
}

/**
 * Repositorio local. La primera vez siembra los 3 juegos de ejemplo
 * (Catán, Small World y Decrypto) usando un flag para no re-sembrar
 * si el usuario borra todos sus juegos.
 */
export function createLocalRepo(seedDemo = true): GamesRepo {
  if (seedDemo) {
    try {
      if (localStorage.getItem(SEEDED_KEY) !== '1') {
        writeLocal([...DEMO_GAMES])
        localStorage.setItem(SEEDED_KEY, '1')
      }
    } catch {
      /* sin almacenamiento: se reintentará */
    }
  }
  return {
    mode: 'local',
    subscribe(onData) {
      const emit = () => onData(readLocal() ?? [])
      emit()
      const onCustom = () => emit()
      const onStorage = (e: StorageEvent) => {
        if (e.key === LS_KEY || e.key === null) emit()
      }
      window.addEventListener(CHANGED_EVENT, onCustom)
      window.addEventListener('storage', onStorage)
      return () => {
        window.removeEventListener(CHANGED_EVENT, onCustom)
        window.removeEventListener('storage', onStorage)
      }
    },
    async save(game) {
      const games = readLocal() ?? []
      const index = games.findIndex((g) => g.id === game.id)
      if (index >= 0) games[index] = game
      else games.push(game)
      writeLocal(games)
    },
    async remove(id) {
      writeLocal((readLocal() ?? []).filter((g) => g.id !== id))
    },
  }
}

/** Restaura los juegos de ejemplo que falten (solo en modo local). */
export function restoreDemoGamesLocally(): void {
  const games = readLocal() ?? []
  const present = new Set(games.map((g) => g.id))
  const missing = DEMO_GAMES.filter((g) => !present.has(g.id))
  if (missing.length > 0) writeLocal([...games, ...missing])
}

// ─── Repositorio Firestore (usuario con Google) ────────────────────────

/** Firestore rechaza los `undefined`: se sanea con un round-trip JSON. */
function sanitize<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T
}

export function createFirestoreRepo(uid: string): GamesRepo {
  const { db } = getFirebase()!
  const path = ['users', uid, 'games'] as const
  return {
    mode: 'cloud',
    subscribe(onData, onError) {
      const col = collection(db, ...path)
      return onSnapshot(
        col,
        (snap) => onData(snap.docs.map((d) => d.data() as Game)),
        (err) => onError?.(err),
      )
    },
    async save(game) {
      await setDoc(doc(db, ...path, game.id), sanitize(game))
    },
    async remove(id) {
      await deleteDoc(doc(db, ...path, id))
    },
  }
}
