import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useSettings } from '../context/SettingsContext'
import { asset } from '../config/env'
import { IconMoon, IconSliders, IconSun } from './icons'

export function Header() {
  const { user, guest } = useAuth()
  const { settings, update } = useSettings()

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-app/85 backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-3xl items-center justify-between px-4 sm:px-6">
        <Link
          to="/"
          className="flex items-center gap-2.5 rounded-lg focus-visible:outline-2 focus-visible:outline-accent"
        >
          <img src={asset('logo.png')} alt="" className="h-8 w-8 rounded-lg shadow-sm" />
          <span className="text-lg font-extrabold tracking-tight">Super Ludoteca</span>
        </Link>

        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label={settings.mode === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            onClick={() => update({ mode: settings.mode === 'dark' ? 'light' : 'dark' })}
            className="rounded-full p-2.5 text-muted transition-colors hover:bg-card hover:text-ink"
          >
            {settings.mode === 'dark' ? <IconSun className="h-5 w-5" /> : <IconMoon className="h-5 w-5" />}
          </button>
          <Link
            to="/ajustes"
            aria-label="Ajustes"
            className="rounded-full p-2.5 text-muted transition-colors hover:bg-card hover:text-ink"
          >
            <IconSliders className="h-5 w-5" />
          </Link>
          {user?.photoURL ? (
            <img
              src={user.photoURL}
              alt={user.displayName ?? 'Tu avatar'}
              className="h-8 w-8 rounded-full border border-line"
            />
          ) : guest ? (
            <span className="rounded-full border border-accent/40 bg-accent-soft px-2.5 py-1 text-xs font-bold">
              Invitado
            </span>
          ) : null}
        </div>
      </div>
    </header>
  )
}
