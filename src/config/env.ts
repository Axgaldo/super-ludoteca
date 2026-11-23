// Constantes de la aplicación y lectura segura de variables de entorno.

export const APP_NAME = 'Super Ludoteca'
export const APP_VERSION = 'v1.1.0'
/** Toda mención a la versión enlaza a la build desplegada (GitHub Pages). */
export const APP_URL = 'https://axgaldo.github.io/super-ludoteca/'
export const REPO_URL = 'https://github.com/axgaldo/super-ludoteca'
export const GITHUB_PROFILE = 'https://github.com/axgaldo'

/** Autor de la app (usar siempre en vez del nombre real) */
export const AUTHOR = { name: '@axgaldo', url: GITHUB_PROFILE }

// ─── Firebase desde variables de entorno ──────────────────────────────

export const firebaseEnv = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

/** ¿Están las 6 variables de Firebase configuradas? Si no, se ofrece el Modo Invitado Local. */
export const isFirebaseConfigured = Object.values(firebaseEnv).every((v) => typeof v === 'string' && v.length > 0)

// ─── Asistente de reglas (Gemini incluido en la build) ────────────────

/** Clave de Gemini incluida en el build. No se configura desde la app. */
export const envGeminiKey = import.meta.env.VITE_GEMINI_API_KEY ?? ''

/** ¿La build trae clave para el chat de reglas? */
export const hasBuiltInAiKey = envGeminiKey.length > 0

/** Ruta de un asset público respetando el base path de GitHub Pages. */
export function asset(path: string): string {
  return `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`
}
