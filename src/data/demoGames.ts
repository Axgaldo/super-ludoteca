import type { Game } from '../types'
import { CATALOG, catalogToDraft, DEMO_CATALOG_IDS } from './catalog'

/**
 * Juegos de ejemplo del Modo Invitado Local:
 * Catán, Small World y Decrypto (según lo acordado con [@axgaldo]).
 */
const BASE = Date.now()

export const DEMO_GAMES: Game[] = DEMO_CATALOG_IDS.flatMap((catalogId, index) => {
  const entry = CATALOG.find((c) => c.id === catalogId)
  if (!entry) return []
  return [
    {
      ...catalogToDraft(entry),
      id: `demo-${catalogId}`,
      catalogId,
      createdAt: BASE - (DEMO_CATALOG_IDS.length - index),
      updatedAt: BASE - (DEMO_CATALOG_IDS.length - index),
    },
  ]
})
