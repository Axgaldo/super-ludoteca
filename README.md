# 🎲 Super Ludoteca

[![Build](https://github.com/axgaldo/super-ludoteca/actions/workflows/deploy.yml/badge.svg?branch=main)](https://github.com/axgaldo/super-ludoteca/actions/workflows/deploy.yml)
[![Estado en producción](https://img.shields.io/website?url=https%3A%2F%2Faxgaldo.github.io%2Fsuper-ludoteca%2F&label=producci%C3%B3n&up_message=online&down_message=offline)](https://axgaldo.github.io/super-ludoteca/)
[![Versión](https://img.shields.io/github/package-json/v/axgaldo/super-ludoteca?label=versi%C3%B3n&color=f59e0b)](https://axgaldo.github.io/super-ludoteca/)

**[v1.3.0](https://axgaldo.github.io/super-ludoteca/)** · App en línea: **https://axgaldo.github.io/super-ludoteca/**

PWA móvil en español pensada como *companion* para tus partidas de juegos de mesa: organiza tu colección, filtra por jugadores, tiempo o dificultad y refresca las reglas en la mesa en 3 minutos, con un cajón de herramientas para no salir nunca de la app.

Creada por [@axgaldo](https://github.com/axgaldo).

## ✨ Características

- 📱 **PWA instalable** y optimizada para móvil, con modo oscuro por defecto (para no deslumbrar en la mesa) y modo claro opcional.
- 🔐 **Sincroniza en la nube** con tu cuenta de Google (Firebase) o funciona **sin configurar nada** en Modo Invitado Local con 3 juegos de ejemplo (Catán, Small World y Decrypto).
- 🗂️ **Mi Ludoteca:** buscador en tiempo real, filtros por nº de jugadores, duración, dificultad y **categoría**, y tarjetas con portada o degradado con iniciales.
- ⚡ **Ficha de refresco rápido (3 min)** por juego y 4 pestañas táctiles:
  1. **Preparación:** checklist interactivo que se marca en la mesa (con botón de reinicio).
  2. **Estructura del turno:** pasos numerados.
  3. **Fin y puntuación:** condición de final y cómo se suman los puntos.
  4. **Reglas olvidadas / Dudas:** las dudosas de siempre + **chat de IA con Gemini** que conoce el juego, sus reglas y el nº de jugadores de la sesión.
- ➕ **Añadir juegos en segundos:** catálogo precargado con **44 juegos** (Catán, Carcassonne, Azul, Cascadia, Terraforming Mars, Marvel Zombies, Brass, HeroQuest…) o formulario manual para los tuyos. Editar y eliminar con doble confirmación.
- 🏷️ **Categorías:** Party Game, Euro, Estrategia, Cooperativo, Temático, Familiar, Abstracto, Para 2, Campaña y Filler para filtrar y encontrar el juego perfecto para cada mesa.
- 🧰 **Cajón de herramientas de mesa:** selector de jugador inicial con animación, dados D6/D10/D20 con historial, contador de puntos/vida por jugadores y calculadora rápida.
- 🎨 **Ajustes de apariencia:** acentos cálidos/fríos, tipo de letra redonda/clásica/serif.

> Las portadas del catálogo se enlazan desde el CDN público de BoardGameGeek (`cf.geekdo-images.com`); si una imagen no carga, la tarjeta muestra el degradado con iniciales. Se pueden regenerar con `node scripts/fetch-bgg-images.mjs` (usa Wayback Machine porque la API XML de BGG exige registro).

## 🛠️ Tecnología

React 19 · TypeScript · Vite 7 · Tailwind CSS v4 · Firebase 12 (Auth + Firestore) · react-router v7 (hash) · Workbox (PWA) · Asistente de reglas con Gemini vía proxy propio.

## 🚀 Desarrollo local

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # typecheck + build de producción
npm run icons      # regenera los iconos PWA desde assets/logo-source.*
```

Sin configurar nada, la app arranca en **Modo Invitado Local**: aviso discreto en el login, datos en `localStorage`, 3 juegos de ejemplo y todas las funciones activas.

## 🔥 Configurar Firebase (10 minutos)

1. Entra en [console.firebase.google.com](https://console.firebase.google.com) con tu cuenta y pulsa **Añadir proyecto** (p. ej. `super-ludoteca`). Puedes desactivar Google Analytics.
2. **Build → Authentication → Comenzar** → habilita el proveedor **Google** (elige tu correo como correo de soporte).
3. **Build → Firestore Database → Crear base de datos** → elige región europea (p. ej. `europe-west`) y empieza en modo de prueba; después publica estas reglas en la pestaña **Reglas**:

   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /users/{uid}/{document=**} {
         allow read, write: if request.auth != null && request.auth.uid == uid;
       }
     }
   }
   ```

4. **⚙️ Configuración del proyecto → Tus apps → Web (`</>`)** → registra la app `super-ludoteca` y copia el objeto `firebaseConfig`.
5. Crea un archivo `.env.local` en la raíz (copiado de `.env.example`) con las 6 variables:

   ```env
   VITE_FIREBASE_API_KEY=...
   VITE_FIREBASE_AUTH_DOMAIN=...
   VITE_FIREBASE_PROJECT_ID=...
   VITE_FIREBASE_STORAGE_BUCKET=...
   VITE_FIREBASE_MESSAGING_SENDER_ID=...
   VITE_FIREBASE_APP_ID=...
   ```

6. **Authentication → Configuración → Dominios autorizados** → añade `axgaldo.github.io` (localhost ya está).

Con esto, el botón **Entrar con Google** lee y guarda los juegos en Firestore (`users/{uid}/games`), solo visibles para tu cuenta.

> ⚠️ **¿Error al añadir un juego?** Si usas Google y al añadir desde el catálogo aparece un error, revisa en este orden: 1) que la base de datos Firestore exista; 2) que hayas publicado las **reglas** del paso 3 (sin ellas todo se deniega con `permission-denied`); 3) que `axgaldo.github.io` esté en los dominios autorizados. La app muestra el motivo concreto en el banner de la ludoteca y en el formulario.

## 🤖 Asistente de reglas (Gemini con clave oculta)

El chat de dudas habla con Gemini **a través de un proxy propio** (Cloudflare Worker, gratis): la API key vive cifrada en Cloudflare y **nunca entra en el bundle ni en el repositorio**, así que no puede filtrarse. La app solo conoce la URL del proxy.

**Configuración (5 minutos, una sola vez):**

1. Despliega el Worker siguiendo [`worker/README.md`](worker/README.md): pega `worker/index.js` en el panel de Cloudflare y guarda `GEMINI_API_KEY` como **secret** (y `ALLOWED_ORIGINS` como variable de texto). Obtén la clave en [aistudio.google.com/apikey](https://aistudio.google.com/apikey).
2. Copia la URL del Worker a `VITE_AI_PROXY_URL` en `.env.local` (desarrollo) y dentro del secret `FIREBASE_ENV` (producción). Esa URL **no es secreta**.
3. Listo: el chat funciona y la clave sigue estando solo en Cloudflare.

- Modelo: `gemini-3.8-flash` con respaldo automático a modelos Flash más recientes y timeout por intento ([`worker/index.js`](worker/index.js)), porque Google retira modelos antiguos con el tiempo.
- Extra: el Worker acepta solo los orígenes de `ALLOWED_ORIGINS` y puede limitar peticiones por IP con un KV `RATE_LIMIT`.

> 🔍 **Verificación:** tras compilar, no debe quedar rastro de Gemini ni de tu clave en el cliente. Comprueba con `Select-String -Path dist\assets\*.js -Pattern "generativelanguage" -SimpleMatch` y repite buscando los primeros caracteres de tu clave: ambos deben devolver `False`/vacío. La app solo llama a la URL del proxy.

## 🌐 Despliegue en GitHub Pages

El push a `main` dispara el workflow `.github/workflows/deploy.yml` (build + publish). Solo hay que configurarlo una vez:

1. **Settings → Pages → Build and deployment → Source: GitHub Actions.**
2. **Settings → Secrets and variables → Actions → New repository secret**: crea **un único secret** llamado `FIREBASE_ENV` cuyo valor es el bloque de variables completo, copiado de tu `.env.local` (multilínea, sin comillas ni `export`):

   ```env
   VITE_FIREBASE_API_KEY=AIzaSyD…
   VITE_FIREBASE_AUTH_DOMAIN=super-ludoteca.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=super-ludoteca
   VITE_FIREBASE_STORAGE_BUCKET=super-ludoteca.firebasestorage.app
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
   VITE_FIREBASE_APP_ID=1:123456789012:web:abc123…
   ```

   El workflow vuelca ese secret en `.env.local` antes de compilar y avisa en el log si falta alguna variable. Tras crearlo, relanza la build: **Actions → «Deploy a GitHub Pages» → Re-run all jobs** (o haz cualquier push). Si el secret no existe, la web se despliega igualmente en Modo Invitado Local.

3. **Añade también la URL del proxy de IA** dentro del mismo bloque del secret: `VITE_AI_PROXY_URL=https://tu-worker.workers.dev`. Así el chat de dudas funcionará en la web desplegada. La URL del proxy es pública (no es un secreto; la API key sigue solo en Cloudflare).

> ⚠️ **El `.env`/`.env.local` de tu ordenador no se sube a GitHub**: solo sirve para desarrollo local. La web de GitHub Pages se compila con lo que haya en el secret `FIREBASE_ENV` (más los secrets que definas). Si cambias una variable, actualiza el secret y relanza el workflow.

> Nota técnica: el router usa *hash routing* (`#/`) porque GitHub Pages no soporta rutas de History API sin un `404.html`.

## 📁 Estructura y convenciones

La guía completa para trabajar en el repo (stack, estructura, convenciones de código, reglas de autoría y versionado) está en [`AGENTS.md`](AGENTS.md).

## 📄 Licencia

Consulta el archivo [LICENSE](LICENSE).

---

Hecho por [@axgaldo](https://github.com/axgaldo) · Versión [v1.3.0](https://axgaldo.github.io/super-ludoteca/)
