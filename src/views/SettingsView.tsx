import { useState, type ReactNode } from 'react'
import { useAuth } from '../context/AuthContext'
import { useSettings } from '../context/SettingsContext'
import { useGames } from '../context/GamesContext'
import { ACCENTS, FONTS, type AccentKey, type FontKey, type ThemeMode } from '../types'
import { APP_URL, APP_VERSION, AUTHOR, REPO_URL, asset, hasAiProxy } from '../config/env'
import { askAi } from '../lib/ai'
import { cn, initials } from '../lib/utils'
import { Button } from '../components/ui'
import { IconCheck, IconMoon, IconSparkles, IconSun } from '../components/icons'

function SectionCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="overflow-hidden rounded-2xl border border-line bg-card">
      <h2 className="border-b border-line px-4 py-2.5 text-xs font-extrabold uppercase tracking-wider text-muted">
        {title}
      </h2>
      <div className="space-y-4 p-4">{children}</div>
    </section>
  )
}

/** Ajustes: apariencia, asistente de IA incluido, cuenta y acerca de. */
export default function SettingsView() {
  const { status, user, guest, firebaseConfigured, signOut } = useAuth()
  const { settings, update } = useSettings()
  const { mode, error: syncError, restoreDemos } = useGames()

  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState<string | null>(null)

  async function testConnection() {
    setTesting(true)
    setTestResult(null)
    try {
      const answer = await askAi(
        [{ role: 'user', content: 'Responde únicamente: listo' }],
        'Eres una prueba de conexión de Super Ludoteca.',
      )
      setTestResult(`✓ Conexión correcta con Gemini: «${answer.slice(0, 40)}»`)
    } catch (err) {
      setTestResult(err instanceof Error ? err.message : 'Error inesperado al probar la conexión.')
    } finally {
      setTesting(false)
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-extrabold tracking-tight">Ajustes</h1>

      {/* Apariencia */}
      <SectionCard title="Apariencia">
        <div className="space-y-2">
          <p className="text-sm font-bold">Modo</p>
          <div className="grid grid-cols-2 gap-2">
            {(['dark', 'light'] as ThemeMode[]).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => update({ mode: m })}
                className={cn(
                  'flex min-h-12 items-center justify-center gap-2 rounded-xl border font-bold transition-colors',
                  settings.mode === m ? 'border-accent bg-accent-soft text-ink' : 'border-line bg-card text-muted hover:text-ink',
                )}
              >
                {m === 'dark' ? <IconMoon className="h-5 w-5" /> : <IconSun className="h-5 w-5" />}
                {m === 'dark' ? 'Oscuro' : 'Claro'}
              </button>
            ))}
          </div>
          <p className="text-xs text-muted">El oscuro es ideal para no deslumbrar en la mesa.</p>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-bold">Color de acento</p>
          <div className="flex flex-wrap gap-3">
            {(Object.keys(ACCENTS) as AccentKey[]).map((key) => {
              const info = ACCENTS[key]
              const active = settings.accent === key
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => update({ accent: key })}
                  aria-label={info.label}
                  title={`${info.label} · ${info.hint}`}
                  className="flex h-11 w-11 items-center justify-center rounded-full transition-transform hover:scale-105 active:scale-95"
                  style={{
                    backgroundColor: info.color,
                    boxShadow: active ? `0 0 0 2px var(--app), 0 0 0 4px ${info.color}` : undefined,
                  }}
                >
                  {active && <IconCheck className="h-5 w-5" style={{ color: info.ink }} />}
                </button>
              )
            })}
          </div>
          <p className="text-xs text-muted">{ACCENTS[settings.accent].hint}</p>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-bold">Tipo de letra</p>
          <div className="space-y-2">
            {(Object.keys(FONTS) as FontKey[]).map((key) => {
              const info = FONTS[key]
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => update({ font: key })}
                  className={cn(
                    'flex w-full items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left transition-colors',
                    settings.font === key ? 'border-accent bg-accent-soft' : 'border-line bg-card hover:bg-elev',
                  )}
                >
                  <div>
                    <p className="text-sm font-bold">{info.label}</p>
                    <p className="text-sm text-muted" style={{ fontFamily: info.stack }}>
                      Fácil de leer en la mesa
                    </p>
                  </div>
                  {settings.font === key && <IconCheck className="h-5 w-5 shrink-0 text-accent" />}
                </button>
              )
            })}
          </div>
        </div>
      </SectionCard>

      {/* IA vía proxy */}
      <SectionCard title="Asistente de reglas (Gemini)">
        <div className="flex items-start gap-2">
          <IconSparkles className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
          <p className="text-sm">
            El chat de dudas usa <span className="font-bold">Gemini</span> a través de un proxy
            propio: la clave vive en Cloudflare (nunca en esta app) y no se puede extraer del
            navegador.
          </p>
        </div>

        <p className="text-sm text-muted">
          Estado:{' '}
          {hasAiProxy
            ? '✓ proxy configurado en esta build'
            : '✗ sin configurar (falta VITE_AI_PROXY_URL; ver worker/README.md)'}
        </p>

        {hasAiProxy && (
          <div className="flex flex-wrap items-center gap-3">
            <Button size="sm" variant="primary" onClick={() => void testConnection()} disabled={testing}>
              {testing ? 'Probando…' : 'Probar conexión'}
            </Button>
            {testResult && (
              <p
                className={cn(
                  'text-sm',
                  testResult.startsWith('✓')
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-rose-500',
                )}
              >
                {testResult}
              </p>
            )}
          </div>
        )}

        <p className="text-xs text-muted">
          Cómo funciona: la app llama al Cloudflare Worker (<code className="rounded bg-elev px-1 py-0.5">worker/</code>),
          que guarda la API key como secret cifrado y la usa para hablar con Gemini. Solo los orígenes
          permitidos pueden llamarlo y el Worker puede limitar peticiones por IP.
        </p>
      </SectionCard>

      {/* Cuenta y datos */}
      <SectionCard title="Cuenta y datos">
        {status === 'user' && user ? (
          <div className="flex items-center gap-3">
            {user.photoURL ? (
              <img src={user.photoURL} alt="" className="h-12 w-12 rounded-full border border-line" />
            ) : (
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-soft font-extrabold">
                {initials(user.displayName ?? 'Tú')}
              </span>
            )}
            <div className="min-w-0">
              <p className="truncate font-bold">{user.displayName ?? 'Tu cuenta'}</p>
              <p className="truncate text-sm text-muted">{user.email}</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-accent/40 bg-accent-soft px-2.5 py-1 text-xs font-bold">
              Invitado
            </span>
            <p className="text-sm text-muted">Tus datos viven solo en este dispositivo.</p>
          </div>
        )}

        {guest && (
          <Button size="sm" onClick={restoreDemos}>
            Restaurar juegos de ejemplo
          </Button>
        )}

        <Button size="sm" variant="danger" onClick={() => void signOut()}>
          Cerrar sesión
        </Button>

        <p className="text-xs text-muted">
          {mode === 'cloud'
            ? syncError
              ? `⚠ ${syncError}`
              : 'Sincronizando con Firestore en la nube de tu cuenta de Google.'
            : 'Modo local: si borras los datos del navegador, se pierden.'}
        </p>
      </SectionCard>

      {/* Acerca de */}
      <SectionCard title="Acerca de">
        <div className="flex items-center gap-3">
          <img src={asset('logo.png')} alt="" className="h-14 w-14 rounded-2xl shadow-sm" />
          <div>
            <p className="font-extrabold">Super Ludoteca</p>
            <a href={APP_URL} className="text-sm font-bold text-accent underline underline-offset-2">
              {APP_VERSION}
            </a>
          </div>
        </div>

        <p className="text-sm text-muted">
          Hecho por{' '}
          <a href={AUTHOR.url} className="font-bold text-accent underline underline-offset-2">
            {AUTHOR.name}
          </a>{' '}
          con React, Tailwind CSS y Firebase.
        </p>

        <a
          href={REPO_URL}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-bold text-accent"
        >
          Ver código en GitHub →
        </a>

        <p className="text-xs text-muted">
          Firebase: {firebaseConfigured ? 'configurado ✓' : 'sin configurar (la app funciona en modo invitado)'}
        </p>
      </SectionCard>
    </div>
  )
}
