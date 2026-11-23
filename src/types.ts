// ─── Modelo de datos de Super Ludoteca ────────────────────────────────

/** Dificultad de aprendizaje/aprendizaje para novatos (1 = muy fácil … 5 = muy alta) */
export type Difficulty = 1 | 2 | 3 | 4 | 5

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  1: 'Muy fácil',
  2: 'Fácil',
  3: 'Media',
  4: 'Alta',
  5: 'Muy alta',
}

/** Color de la insignia de cada dificultad (clases estáticas para que Tailwind las detecte) */
export const DIFFICULTY_CLASSES: Record<Difficulty, string> = {
  1: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/25',
  2: 'bg-lime-500/15 text-lime-700 dark:text-lime-400 border-lime-500/25',
  3: 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/25',
  4: 'bg-orange-500/15 text-orange-700 dark:text-orange-400 border-orange-500/25',
  5: 'bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-500/25',
}

// ─── Etiquetas / categorías ─────────────────────────────────────────────

export type GameTag =
  | 'party'
  | 'euro'
  | 'estrategia'
  | 'cooperativo'
  | 'tematico'
  | 'familiar'
  | 'abstracto'
  | 'duelos'
  | 'campana'
  | 'filler'

export const GAME_TAGS: Record<GameTag, { label: string; classes: string }> = {
  party: { label: 'Party Game', classes: 'bg-pink-500/15 text-pink-700 border-pink-500/25 dark:text-pink-300' },
  euro: { label: 'Euro', classes: 'bg-amber-500/15 text-amber-700 border-amber-500/25 dark:text-amber-300' },
  estrategia: { label: 'Estrategia', classes: 'bg-sky-500/15 text-sky-700 border-sky-500/25 dark:text-sky-300' },
  cooperativo: { label: 'Cooperativo', classes: 'bg-emerald-500/15 text-emerald-700 border-emerald-500/25 dark:text-emerald-300' },
  tematico: { label: 'Temático', classes: 'bg-violet-500/15 text-violet-700 border-violet-500/25 dark:text-violet-300' },
  familiar: { label: 'Familiar', classes: 'bg-lime-500/15 text-lime-700 border-lime-500/25 dark:text-lime-300' },
  abstracto: { label: 'Abstracto', classes: 'bg-teal-500/15 text-teal-700 border-teal-500/25 dark:text-teal-300' },
  duelos: { label: 'Para 2', classes: 'bg-cyan-500/15 text-cyan-700 border-cyan-500/25 dark:text-cyan-300' },
  campana: { label: 'Campaña', classes: 'bg-orange-500/15 text-orange-700 border-orange-500/25 dark:text-orange-300' },
  filler: { label: 'Filler', classes: 'bg-fuchsia-500/15 text-fuchsia-700 border-fuchsia-500/25 dark:text-fuchsia-300' },
}

export const GAME_TAG_KEYS = Object.keys(GAME_TAGS) as GameTag[]

/** Regla típica que siempre se olvida o aclaración importante */
export interface ForgottenRule {
  title: string
  text: string
}

/** Ficha de un juego de la ludoteca */
export interface Game {
  id: string
  title: string
  /** URL de imagen/portada (opcional: si falta, se genera un degradado con iniciales) */
  image?: string
  /** Imagen ancha para la cabecera de la ficha (opcional; si falta se usa `image`) */
  imageWide?: string
  playersMin: number
  playersMax: number
  /** Duración estimada en minutos */
  durationMin: number
  difficulty: Difficulty
  /** Categorías / etiquetas (opcional por compatibilidad con fichas antiguas) */
  tags?: GameTag[]
  /** Checklist de preparación */
  setup: string[]
  /** Pasos del turno de un jugador */
  turn: string[]
  /** Condición de final de partida */
  endCondition: string
  /** Cómo se suman los puntos */
  scoring: string[]
  /** Reglas olvidadas / aclaraciones */
  forgotten: ForgottenRule[]
  /** Si el juego vino del catálogo precargado */
  catalogId?: string
  createdAt: number
  updatedAt: number
}

/** Datos editables de un juego (sin id ni marcas de tiempo) */
export type GameDraft = Omit<Game, 'id' | 'createdAt' | 'updatedAt' | 'catalogId'>

// ─── Apariencia ────────────────────────────────────────────────────────

export type ThemeMode = 'dark' | 'light'
export type AccentKey = 'ambar' | 'cian' | 'violeta' | 'esmeralda' | 'rosa'
export type FontKey = 'redonda' | 'clasica' | 'serif'

export interface AccentInfo {
  label: string
  color: string
  /** Color de texto sobre el acento (para contraste) */
  ink: string
  hint: string
}

export const ACCENTS: Record<AccentKey, AccentInfo> = {
  ambar: { label: 'Ámbar cálido', color: '#f59e0b', ink: '#1c1917', hint: 'Cálido y acogedor para la mesa' },
  cian: { label: 'Cian frío', color: '#22d3ee', ink: '#083344', hint: 'Fresco y tecnológico' },
  violeta: { label: 'Violeta', color: '#a78bfa', ink: '#2e1065', hint: 'Sobrio y elegante' },
  esmeralda: { label: 'Esmeralda', color: '#34d399', ink: '#052e1b', hint: 'Natural y relajado' },
  rosa: { label: 'Rosa', color: '#fb7185', ink: '#4c0519', hint: 'Llamativo y divertido' },
}

export interface FontInfo {
  label: string
  stack: string
}

export const FONTS: Record<FontKey, FontInfo> = {
  redonda: { label: 'Redonda (Nunito)', stack: '"Nunito", ui-rounded, system-ui, sans-serif' },
  clasica: { label: 'Clásica (sistema)', stack: 'system-ui, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' },
  serif: { label: 'Serif (Lora)', stack: '"Lora", Georgia, "Times New Roman", serif' },
}

/** Ajustes de apariencia (la IA va fija en la build: Gemini, sin claves de usuario) */
export interface Settings {
  mode: ThemeMode
  accent: AccentKey
  font: FontKey
}

export const DEFAULT_SETTINGS: Settings = {
  mode: 'dark',
  accent: 'ambar',
  font: 'redonda',
}
