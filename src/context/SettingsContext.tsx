import { createContext, useContext, useEffect, useMemo, type ReactNode } from 'react'
import { ACCENTS, DEFAULT_SETTINGS, FONTS, type Settings } from '../types'
import { useLocalStorage } from '../hooks/useLocalStorage'

interface SettingsContextValue {
  settings: Settings
  update: (patch: Partial<Settings>) => void
  reset: () => void
}

const SettingsContext = createContext<SettingsContextValue | null>(null)

const LIGHT_BG = '#f4f4f5'
const DARK_BG = '#09090b'

/** Apariencia y claves de IA del usuario, persistidas en localStorage. */
export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useLocalStorage<Settings>('sl:settings:v1', DEFAULT_SETTINGS)

  // Aplica tema, acento y fuente al <html> en cada cambio (runtime, sin recargar)
  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', settings.mode === 'dark')
    root.style.setProperty('--accent', ACCENTS[settings.accent].color)
    root.style.setProperty('--accent-ink', ACCENTS[settings.accent].ink)
    root.style.setProperty('--app-font', FONTS[settings.font].stack)
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', settings.mode === 'dark' ? DARK_BG : LIGHT_BG)
  }, [settings])

  const value = useMemo<SettingsContextValue>(
    () => ({
      settings,
      update: (patch) => setSettings((s) => ({ ...s, ...patch })),
      reset: () => setSettings({ ...DEFAULT_SETTINGS }),
    }),
    [settings, setSettings],
  )

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
}

export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext)
  if (!ctx) throw new Error('useSettings debe usarse dentro de SettingsProvider')
  return ctx
}
