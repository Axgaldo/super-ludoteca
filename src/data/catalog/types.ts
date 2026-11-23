import type { GameDraft, GameTag } from '../../types'

/** Entrada del catálogo antes de aplicar etiquetas (se asignan en index.ts). */
export type CatalogEntry = Omit<GameDraft, 'tags'> & {
  id: string
  description: string
}

/** Ficha completa del catálogo, con etiquetas. */
export interface CatalogGame extends CatalogEntry {
  tags: GameTag[]
}
