/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

interface ImportMetaEnv {
  /** Claves de Firebase (si faltan, la app arranca en Modo Invitado Local) */
  readonly VITE_FIREBASE_API_KEY?: string
  readonly VITE_FIREBASE_AUTH_DOMAIN?: string
  readonly VITE_FIREBASE_PROJECT_ID?: string
  readonly VITE_FIREBASE_STORAGE_BUCKET?: string
  readonly VITE_FIREBASE_MESSAGING_SENDER_ID?: string
  readonly VITE_FIREBASE_APP_ID?: string
  /** URL del proxy de IA (Cloudflare Worker). La API key vive allí, no en la build. */
  readonly VITE_AI_PROXY_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
