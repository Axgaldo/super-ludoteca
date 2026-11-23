import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut as firebaseSignOut,
  type User,
} from 'firebase/auth'
import { getFirebase } from '../lib/firebase'
import { isFirebaseConfigured } from '../config/env'

const GUEST_KEY = 'sl:guest'

export type AuthStatus = 'loading' | 'signed-out' | 'user' | 'guest'

interface AuthContextValue {
  status: AuthStatus
  user: User | null
  guest: boolean
  firebaseConfigured: boolean
  authError: string | null
  signInWithGoogle: () => Promise<void>
  signInAsGuest: () => void
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

function friendlyAuthError(code: string): string {
  switch (code) {
    case 'auth/popup-blocked':
      return 'Tu navegador bloqueó la ventana emergente. Permite las pop-ups para este sitio e inténtalo otra vez.'
    case 'auth/unauthorized-domain':
      return 'Este dominio no está autorizado: añádelo en Firebase → Authentication → Settings → Authorized domains.'
    case 'auth/operation-not-allowed':
      return 'El proveedor Google no está habilitado en tu proyecto de Firebase.'
    case 'auth/network-request-failed':
      return 'Fallo de red al conectar con Firebase. Revisa tu conexión.'
    default:
      return 'No se pudo iniciar sesión con Google. Inténtalo otra vez.'
  }
}

/** Sesión: Google (Firebase) o Modo Invitado Local (persistido). */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [guest, setGuest] = useState<boolean>(() => {
    try {
      return localStorage.getItem(GUEST_KEY) === '1'
    } catch {
      return false
    }
  })
  const [loading, setLoading] = useState(true)
  const [authError, setAuthError] = useState<string | null>(null)

  useEffect(() => {
    const services = getFirebase()
    if (!services) {
      // Sin variables de entorno: no hay sesión en la nube que observar.
      setLoading(false)
      return
    }
    const unsubscribe = onAuthStateChanged(services.auth, (u) => {
      setUser(u)
      if (u) {
        // Si entra un usuario real, la sesión de invitado deja de tener sentido.
        try {
          localStorage.removeItem(GUEST_KEY)
        } catch {
          /* sin almacenamiento */
        }
        setGuest(false)
      }
      setLoading(false)
    })
    return unsubscribe
  }, [])

  const value = useMemo<AuthContextValue>(() => {
    const status: AuthStatus =
      loading ? 'loading' : user ? 'user' : guest ? 'guest' : 'signed-out'
    return {
      status,
      user,
      guest,
      firebaseConfigured: isFirebaseConfigured,
      authError,
      async signInWithGoogle() {
        const services = getFirebase()
        if (!services) {
          setAuthError('Firebase no está configurado: faltan las variables de entorno.')
          return
        }
        try {
          setAuthError(null)
          const provider = new GoogleAuthProvider()
          await signInWithPopup(services.auth, provider)
        } catch (err) {
          const code =
            typeof err === 'object' && err !== null && 'code' in err ? String(err.code) : ''
          // El usuario cerró la ventana: no hace falta asustarlo con un error.
          if (code !== 'auth/popup-closed-by-user' && code !== 'auth/cancelled-popup-request') {
            setAuthError(friendlyAuthError(code))
          }
        }
      },
      signInAsGuest() {
        try {
          localStorage.setItem(GUEST_KEY, '1')
        } catch {
          /* sin almacenamiento: la sesión de invitado vivirá solo en memoria */
        }
        setGuest(true)
      },
      async signOut() {
        try {
          localStorage.removeItem(GUEST_KEY)
        } catch {
          /* noop */
        }
        setGuest(false)
        const services = getFirebase()
        if (services && services.auth.currentUser) {
          await firebaseSignOut(services.auth)
        }
      },
    }
  }, [loading, user, guest, authError])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return ctx
}
