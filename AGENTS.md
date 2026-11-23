# AGENTS.md — Guía de trabajo para agentes de IA (y humanos)

**Super Ludoteca** es una PWA móvil en español: la herramienta *companion* para organizar tu colección de juegos de mesa y refrescar las reglas en la mesa en 3 minutos.

- **Build desplegada:** https://axgaldo.github.io/super-ludoteca/ — versión actual: [v1.0.0](https://axgaldo.github.io/super-ludoteca/)
- **Repositorio:** https://github.com/axgaldo/super-ludoteca

## Autoría (regla obligatoria)

- El autor y mantenedor es **[@axgaldo](https://github.com/axgaldo)**.
- NUNCA uses su nombre real en código, documentación o commits: siempre [@axgaldo](https://github.com/axgaldo) con enlace a su perfil de GitHub.
- Flujo de trabajo git: **el agente hace los commits; [@axgaldo](https://github.com/axgaldo) hace el `push` desde GitHub Desktop.** Nunca hagas push.

## Stack (decisión fijada, no cambiar sin preguntar)

| Capa | Elección | Motivo |
|---|---|---|
| Build | Vite 7 + TypeScript estricto (`tsc -b` && `vite build`) | Última versión, builds rápidas |
| UI | React 19, componentes funcionales + hooks | Sin clases, sin librerías de estado externas |
| Estilos | Tailwind CSS v4 (plugin `@tailwindcss/vite`, config en `src/index.css`) | Config CSS-first, tokens semánticos y acento dinámico |
| Router | react-router-dom v7 con `createHashRouter` | **Obligatorio:** GitHub Pages no soporta History API sin 404.html |
| Backend | Firebase 12 (Auth con Google + Firestore) | Solo si las variables de entorno están completas |
| Fallback | Modo Invitado Local (localStorage) | La app debe funcionar al 100% sin ninguna clave |
| PWA | vite-plugin-pwa (Workbox, `autoUpdate`) | Service worker + manifest |
| IA | Chat de reglas con **Gemini y DeepSeek** configurables (fetch directo, sin SDK) | Elegido por [@axgaldo](https://github.com/axgaldo) |
| Iconos | `npm run icons` genera los PNG de `public/` con `sharp`; fuente: `assets/logo-source.(png/jpg/webp)` si existe (logo IA) o `assets/logo.svg` (logo actual) | Reproducible con un comando |

## Comandos

```bash
npm install        # instalar dependencias
npm run dev        # desarrollo (http://localhost:5173)
npm run build      # typecheck + build de producción (dist/)
npm run preview    # servir la build localmente
npm run icons      # regenerar iconos PWA desde assets/logo-source.*
```

## Variables de entorno

Copia `.env.example` → `.env.local`. Nunca subas `.env.local` (está en `.gitignore`).

- `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_STORAGE_BUCKET`, `VITE_FIREBASE_MESSAGING_SENDER_ID`, `VITE_FIREBASE_APP_ID`
- Opcionales: `VITE_GEMINI_API_KEY`, `VITE_DEEPSEEK_API_KEY`

**Regla de oro:** si faltan las 6 variables de Firebase, la app arranca en *Modo Invitado Local* con un aviso discreto en el login y 3 juegos de ejemplo (Catán, Small World y Decrypto). Este fallback debe funcionar siempre; no lo rompas al refactorizar.

En producción (GitHub Pages) las variables viajan en **un único secret `FIREBASE_ENV`** (bloque `.env` multilínea) que el workflow vuelca en `.env.local` antes de compilar; no hay `.env` en el servidor.

## Estructura del proyecto

```
src/
├── main.tsx                 # providers + arranque (Settings → Auth → Games → Router)
├── App.tsx                  # rutas (createHashRouter) y layout raíz
├── index.css                # Tailwind v4 + tokens de tema (dark por defecto)
├── types.ts                 # modelo: Game, Difficulty, Settings, catálogos de opciones
├── config/env.ts            # constantes de la app + lectura de variables de entorno
├── data/
│   ├── catalog.ts           # catálogo precargado de 22 juegos con fichas completas
│   └── demoGames.ts         # los 3 juegos del modo invitado
├── lib/
│   ├── firebase.ts          # inicialización perezosa de Firebase (null si no está configurado)
│   ├── repos.ts             # repositorio de juegos: Firestore (cloud) o localStorage (local)
│   ├── ai.ts                # cliente del chat: Gemini y DeepSeek (fetch directo)
│   └── utils.ts             # cn(), gradientes de portada, iniciales, formatos
├── context/
│   ├── SettingsContext.tsx  # tema, acento, fuente, claves de IA (localStorage sl:settings:v1)
│   ├── AuthContext.tsx      # Google / invitado / sesión
│   └── GamesContext.tsx     # lista de juegos según repositorio activo
├── hooks/useLocalStorage.ts # persistencia con clave prefijada
├── components/
│   ├── icons.tsx            # SVG inline (sin librería de iconos)
│   ├── ui.tsx               # Button, Chip, Modal (bottom-sheet/centrado), ConfirmDialog, Field
│   ├── Header.tsx           # cabecera fija: logo, modo claro/oscuro, ajustes
│   ├── GameCard.tsx         # tarjeta de juego (imagen o degradado + iniciales)
│   ├── ChatPanel.tsx        # chat de dudas con contexto de la partida
│   ├── ToolsDrawer.tsx      # cajón: jugador inicial, dados, contador de puntos, calculadora
│   └── ...
└── views/
    ├── LoginView.tsx        # bienvenida + Google + modo invitado
    ├── LibraryView.tsx      # Mi Ludoteca: buscador, filtros, cuadrícula
    ├── GameDetailView.tsx   # ficha en 4 pestañas + editar/eliminar
    ├── GameFormView.tsx     # alta desde catálogo o formulario manual
    └── SettingsView.tsx     # apariencia, IA, datos, acerca de
```

## Convenciones de código

- **UI 100% en español.** Controles táctiles: botones `min-h-11`, pestañas grandes para el pulgar.
- Componentes en PascalCase; hooks y funciones en camelCase; tipos en PascalCase.
- **Colores:** prohibido usar grises duros (`bg-zinc-900`, etc.). Usa los tokens semánticos: `bg-app`, `bg-card`, `bg-elev`, `text-ink`, `text-muted`, `border-line`, y para el acento `bg-accent`, `text-accent-ink`, `bg-accent-soft`, `bg-accent-softer`. El acento y la fuente se cambian en runtime con CSS vars (`--accent`, `--app-font`) desde `SettingsContext`.
- **Dark por defecto:** la clase `.dark` va en `<html>`; los tokens se invierten en `src/index.css`. No esparzas variantes `dark:` por los componentes.
- **Persistencia local:** todas las claves de localStorage llevan prefijo `sl:` (`sl:games:v1`, `sl:guest`, `sl:settings:v1`, `sl:check:<idJuego>`, `sl:tools:*`).
- **Firestore:** datos en `users/{uid}/games/{gameId}`, reglas por uid (ver README). Sanea los `undefined` antes de escribir (Firestore los rechaza).
- **Accesibilidad:** `aria-label` en todos los botones de solo icono, contraste AA, foco visible.
- Los enlaces de versión siempre apuntan a la build: `[v1.0.0](https://axgaldo.github.io/super-ludoteca/)`.

## Git y versionado

- Commits convencionales en español y minúscula: `feat:`, `fix:`, `docs:`, `chore:`, `build:`.
- **Versionado semántico** `vMAJOR.MINOR.PATCH` desde [v1.0.0](https://axgaldo.github.io/super-ludoteca/). Al subir versión: actualizar `package.json`, `APP_VERSION` en `src/config/env.ts`, y el número mencionado en README/AGENTS (siempre como enlace a la build).
- El README empieza con tres badges: estado de la última build (workflow `deploy.yml`), estado del despliegue en producción (shields.io `website`) y versión (shields.io lee `package.json`, así que se actualiza sola al subir versión).
- Despliegue: push a `main` → GitHub Actions → GitHub Pages. Requisito único en el repo: *Settings → Pages → Source: GitHub Actions*.

## Auditoría de dependencias (estado conocido, v1.0.0)

`npm audit` reporta avisos **sin parche disponible dentro de los rangos actuales**; NO ejecutes `npm audit fix --force` (revierte Firebase a 9.x). Estado aceptado:

- `@grpc/grpc-js` / `@firebase/firestore` / `firebase` (high): transitivas del SDK oficial de Firebase; los avisos afectan a usos de gRPC en servidor, no a una app de navegador. Se resuelven cuando Google publique las versiones corregidas.
- `sharp`, `workbox-build`, `glob`, `minimatch` (moderate/high): solo se usan en build/ desarrollo (generación de iconos, workbox), no llegan al bundle de producción.

## Mapa de funcionalidades (v1.0.0)

1. **Login:** Google (`signInWithPopup`) o *Modo Invitado Local* si no hay Firebase. Aviso discreto si falta config.
2. **Mi Ludoteca:** búsqueda en tiempo real, filtros (jugadores / duración / dificultad), tarjetas con portada o degradado + iniciales, botón «+ Añadir juego».
3. **Ficha de refresco rápido** en 4 pestañas: Preparación (checklist interactivo persistente con reinicio), Turno (pasos numerados), Fin y Puntuación, Reglas Olvidadas/Dudas (aclaraciones + chat de IA con contexto de juego y nº de jugadores). Editar y eliminar con doble confirmación.
4. **Alta de juegos:** desde catálogo precargado (22 fichas completas, alta instantánea) o con formulario manual.
5. **Cajón de herramientas de mesa:** jugador inicial animado, dados D6/D10/D20 con historial, contador de puntos/vida por jugadores, calculadora básica.
6. **Ajustes:** modo oscuro/claro, acento (cálido/frío…), fuente, proveedor de IA y claves, cuenta, acerca de.

## Roadmap (no implementar sin pedirlo)

- v1.1: generación de fichas por IA desde el PDF del reglamento (decidido: pospuesto a favor del catálogo).
- v1.1+: exportar/importar ludoteca en JSON, más juegos en el catálogo, marcos de puntuación persistentes por juego.
