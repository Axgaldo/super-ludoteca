import { getApp, getApps, initializeApp, type FirebaseApp } from 'firebase/app'
import { getAuth, type Auth } from 'firebase/auth'
import { getFirestore, type Firestore } from 'firebase/firestore'
import { firebaseEnv, isFirebaseConfigured } from '../config/env'

interface FirebaseServices {
  app: FirebaseApp
  auth: Auth
  db: Firestore
}

let services: FirebaseServices | null = null

/**
 * Inicialización perezosa de Firebase.
 * Devuelve null si las variables de entorno no están configuradas,
 * para que la app pueda ofrecer el Modo Invitado Local.
 */
export function getFirebase(): FirebaseServices | null {
  if (!isFirebaseConfigured) return null
  if (!services) {
    const config = firebaseEnv as Record<string, string>
    const app = getApps().length > 0 ? getApp() : initializeApp(config)
    services = { app, auth: getAuth(app), db: getFirestore(app) }
  }
  return services
}
