import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import './index.css'
import App from './App'
import { SettingsProvider } from './context/SettingsContext'
import { AuthProvider } from './context/AuthContext'
import { GamesProvider } from './context/GamesContext'

// PWA: registra el service worker y actualiza en segundo plano
registerSW({ immediate: true })

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SettingsProvider>
      <AuthProvider>
        <GamesProvider>
          <App />
        </GamesProvider>
      </AuthProvider>
    </SettingsProvider>
  </StrictMode>,
)
