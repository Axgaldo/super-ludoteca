import type { GameDraft, GameTag } from '../../types'
import type { CatalogGame } from './types'
import { CLASICOS } from './clasicos'
import { NUEVOS } from './nuevos'

export type { CatalogEntry, CatalogGame } from './types'

/**
 * Etiquetas / categorías de cada juego del catálogo.
 * Al añadir un juego nuevo a clasicos.ts o nuevos.ts, añade también sus etiquetas aquí.
 */
const TAGS: Record<string, GameTag[]> = {
  // Clásicos
  catan: ['euro', 'estrategia', 'familiar'],
  carcassonne: ['euro', 'familiar'],
  'aventureros-europa': ['familiar', 'euro'],
  azul: ['abstracto', 'familiar', 'euro'],
  splendor: ['euro', 'familiar'],
  'small-world': ['estrategia', 'tematico', 'familiar'],
  decrypto: ['party'],
  codenames: ['party'],
  dixit: ['party', 'familiar'],
  'siete-maravillas': ['euro', 'estrategia'],
  'love-letter': ['filler', 'familiar'],
  kingdomino: ['familiar', 'filler', 'abstracto'],
  'sushi-go': ['filler', 'party', 'familiar'],
  coup: ['party', 'filler'],
  wingspan: ['euro', 'estrategia'],
  root: ['estrategia', 'tematico'],
  jaipur: ['duelos', 'euro'],
  hanabi: ['cooperativo', 'filler'],
  'the-mind': ['cooperativo', 'party', 'filler'],
  'toma-6': ['filler', 'party'],
  dobble: ['party', 'filler', 'familiar'],
  'exploding-kittens': ['party', 'filler'],
  // Ampliación v1.1.0
  'castillos-toscana': ['euro', 'estrategia'],
  'castillos-borgona': ['euro'],
  ankh: ['estrategia', 'tematico'],
  rattus: ['euro', 'estrategia'],
  cascadia: ['familiar', 'abstracto', 'euro'],
  zombicide: ['cooperativo', 'tematico'],
  'marvel-zombies': ['cooperativo', 'tematico'],
  fallout: ['tematico', 'estrategia'],
  'gloomhaven-garras': ['cooperativo', 'campana', 'tematico'],
  'dilema-del-rey': ['campana', 'tematico', 'estrategia'],
  'catan-5-6': ['euro', 'estrategia', 'familiar'],
  'little-secret': ['party', 'filler'],
  cubitos: ['familiar', 'party'],
  furnace: ['euro', 'estrategia'],
  'terraforming-mars': ['euro', 'estrategia'],
  'one-round': ['party', 'filler'],
  'feed-the-kraken': ['party', 'tematico'],
  'chao-pescao': ['party', 'filler'],
  'wonders-duel-7': ['duelos', 'euro'],
  quest: ['party'],
  heroquest: ['tematico', 'familiar'],
  'brass-lancashire': ['euro', 'estrategia'],
}

/** Catálogo completo (44 juegos), con sus etiquetas aplicadas. */
export const CATALOG: CatalogGame[] = [...CLASICOS, ...NUEVOS].map((entry) => ({
  ...entry,
  tags: TAGS[entry.id] ?? [],
}))

/** Ids de los juegos de ejemplo del Modo Invitado Local. */
export const DEMO_CATALOG_IDS = ['catan', 'small-world', 'decrypto'] as const

/** Convierte una ficha del catálogo en un borrador editable (copias, sin referencias compartidas). */
export function catalogToDraft(c: CatalogGame): GameDraft {
  return {
    title: c.title,
    playersMin: c.playersMin,
    playersMax: c.playersMax,
    durationMin: c.durationMin,
    difficulty: c.difficulty,
    tags: [...c.tags],
    setup: [...c.setup],
    turn: [...c.turn],
    endCondition: c.endCondition,
    scoring: [...c.scoring],
    forgotten: c.forgotten.map((f) => ({ ...f })),
  }
}

/** Busca un juego del catálogo por su id. */
export function findCatalogGame(id: string): CatalogGame | undefined {
  return CATALOG.find((c) => c.id === id)
}
