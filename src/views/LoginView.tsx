import { useAuth } from '../context/AuthContext'
import { APP_URL, APP_VERSION, AUTHOR, asset } from '../config/env'
import { IconDices, IconGoogle, IconSearch, IconSparkles } from '../components/icons'

/** Pantalla de bienvenida: Google o Modo Invitado Local (si no hay Firebase). */
export default function LoginView() {
  const { firebaseConfigured, signInWithGoogle, signInAsGuest, authError } = useAuth()

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-6 py-10">
      <div className="fade-up w-full max-w-sm space-y-6">
        <div className="flex flex-col items-center gap-4 text-center">
          <img
            src={asset('logo.png')}
            alt="Logo de Super Ludoteca"
            className="h-28 w-28 rounded-3xl shadow-lg"
          />
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Super Ludoteca</h1>
            <p className="mt-2 text-muted">
              Tu compañero en la mesa de juego: organiza tu colección y refresca las reglas en
              3 minutos, sin deslumbrar a nadie.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="rounded-xl border border-line bg-card p-2.5">
            <IconSearch className="mx-auto h-5 w-5 text-accent" />
            <p className="mt-1 text-[11px] font-semibold text-muted">Filtra y elige</p>
          </div>
          <div className="rounded-xl border border-line bg-card p-2.5">
            <IconDices className="mx-auto h-5 w-5 text-accent" />
            <p className="mt-1 text-[11px] font-semibold text-muted">Herramientas de mesa</p>
          </div>
          <div className="rounded-xl border border-line bg-card p-2.5">
            <IconSparkles className="mx-auto h-5 w-5 text-accent" />
            <p className="mt-1 text-[11px] font-semibold text-muted">Dudas con IA</p>
          </div>
        </div>

        {firebaseConfigured ? (
          <div className="space-y-3 rounded-2xl border border-line bg-card p-4">
            <button
              type="button"
              onClick={signInWithGoogle}
              className="flex min-h-12 w-full items-center justify-center gap-3 rounded-xl bg-white px-4 font-bold text-zinc-900 shadow-sm transition-transform hover:bg-zinc-100 active:scale-[0.98]"
            >
              <IconGoogle className="h-5 w-5" />
              Entrar con Google
            </button>
            <p className="text-center text-xs text-muted">
              Tus juegos se guardan en tu cuenta de Google (Firestore).
            </p>
            {authError && <p className="text-center text-sm text-rose-500">{authError}</p>}
          </div>
        ) : (
          <div className="space-y-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4">
            <p className="text-sm font-bold">Modo demo local</p>
            <p className="text-sm text-muted">
              La sincronización con Firebase aún no está configurada, pero puedes probar la app al
              100%: tus datos se guardarán solo en este dispositivo, con 3 juegos de ejemplo (Catán,
              Small World y Decrypto).
            </p>
            <button
              type="button"
              onClick={signInAsGuest}
              className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-accent px-4 font-bold text-accent-ink shadow-sm transition-transform hover:brightness-90 active:scale-[0.98]"
            >
              Entrar en modo invitado
            </button>
          </div>
        )}

        <footer className="flex flex-wrap items-center justify-center gap-2 text-xs text-muted">
          <a href={APP_URL} className="underline underline-offset-2 hover:text-ink">
            {APP_VERSION}
          </a>
          <span aria-hidden="true">·</span>
          <span>
            por{' '}
            <a href={AUTHOR.url} className="underline underline-offset-2 hover:text-ink">
              {AUTHOR.name}
            </a>
          </span>
        </footer>
      </div>
    </div>
  )
}
