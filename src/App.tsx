import { Navigate, Outlet, createHashRouter, RouterProvider } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import { asset } from './config/env'
import { Header } from './components/Header'
import { ToolsFab } from './components/ToolsDrawer'
import LoginView from './views/LoginView'
import LibraryView from './views/LibraryView'
import GameDetailView from './views/GameDetailView'
import GameFormView from './views/GameFormView'
import SettingsView from './views/SettingsView'

/** Pantalla de carga de la sesión */
function Splash() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4">
      <img src={asset('logo.png')} alt="Super Ludoteca" className="h-24 w-24 rounded-3xl shadow-lg" />
      <p className="text-lg font-extrabold tracking-tight">Super Ludoteca</p>
    </div>
  )
}

/** Layout autenticado: cabecera + contenido + botón de herramientas */
function RootLayout() {
  const { status } = useAuth()

  if (status === 'loading') return <Splash />
  if (status === 'signed-out') return <LoginView />

  return (
    <div className="flex min-h-dvh flex-col">
      <Header />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 pb-32 pt-4 sm:px-6">
        <Outlet />
      </main>
      <ToolsFab />
    </div>
  )
}

// HashRouter: obligatorio en GitHub Pages (sin servidor para el fallback de rutas)
const router = createHashRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <LibraryView /> },
      { path: 'juego/:id', element: <GameDetailView /> },
      { path: 'nuevo', element: <GameFormView /> },
      { path: 'editar/:id', element: <GameFormView /> },
      { path: 'ajustes', element: <SettingsView /> },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
])

export default function App() {
  return <RouterProvider router={router} />
}
