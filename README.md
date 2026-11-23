# 🎲 Super Ludoteca

[![Build](https://github.com/axgaldo/super-ludoteca/actions/workflows/deploy.yml/badge.svg?branch=main)](https://github.com/axgaldo/super-ludoteca/actions/workflows/deploy.yml)
[![Estado en producción](https://img.shields.io/website?url=https%3A%2F%2Faxgaldo.github.io%2Fsuper-ludoteca%2F&label=producci%C3%B3n&up_message=online&down_message=offline)](https://axgaldo.github.io/super-ludoteca/)
[![Versión](https://img.shields.io/github/package-json/v/axgaldo/super-ludoteca?label=versi%C3%B3n&color=f59e0b)](https://axgaldo.github.io/super-ludoteca/)

**[v1.0.0](https://axgaldo.github.io/super-ludoteca/)** · App en línea: **https://axgaldo.github.io/super-ludoteca/**

PWA móvil en español pensada como *companion* para tus partidas de juegos de mesa: organiza tu colección, filtra por jugadores, tiempo o dificultad y refresca las reglas en la mesa en 3 minutos, con un cajón de herramientas para no salir nunca de la app.

Creada por [@axgaldo](https://github.com/axgaldo).

## ✨ Características

- 📱 **PWA instalable** y optimizada para móvil, con modo oscuro por defecto (para no deslumbrar en la mesa) y modo claro opcional.
- 🔐 **Sincroniza en la nube** con tu cuenta de Google (Firebase) o funciona **sin configurar nada** en Modo Invitado Local con 3 juegos de ejemplo (Catán, Small World y Decrypto).
- 🗂️ **Mi Ludoteca:** buscador en tiempo real, filtros por nº de jugadores, duración y dificultad, y tarjetas con portada o degradado con iniciales.
- ⚡ **Ficha de refresco rápido (3 min)** por juego y 4 pestañas táctiles:
  1. **Preparación:** checklist interactivo que se marca en la mesa (con botón de reinicio).
  2. **Estructura del turno:** pasos numerados.
  3. **Fin y puntuación:** condición de final y cómo se suman los puntos.
  4. **Reglas olvidadas / Dudas:** las dudosas de siempre + **chat de IA** (Gemini o DeepSeek) que conoce el juego, sus reglas y el nº de jugadores de la sesión.
- ➕ **Añadir juegos en segundos:** catálogo precargado con 22 juegos populares (Catán, Carcassonne, Azul, Splendor, Small World, Decrypto…) o formulario manual para los tuyos. Editar y eliminar con doble confirmación.
- 🧰 **Cajón de herramientas de mesa:** selector de jugador inicial con animación, dados D6/D10/D20 con historial, contador de puntos/vida por jugadores y calculadora rápida.
- 🎨 **Ajustes de apariencia:** acentos cálidos/fríos, tipo de letra redonda/clásica/serif.

## 🛠️ Tecnología

React 19 · TypeScript · Vite 7 · Tailwind CSS v4 · Firebase 12 (Auth + Firestore) · react-router v7 (hash) · Workbox (PWA) · IA vía Gemini / DeepSeek.

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

## 🤖 Claves de IA para el chat de dudas

Opcional: se configuran dentro de la app (**Ajustes → Inteligencia artificial**, se guardan solo en tu dispositivo) o como variables de build.

| Proveedor | Obtener clave | Coste |
|---|---|---|
| **Gemini** (recomendado) | [aistudio.google.com/apikey](https://aistudio.google.com/apikey) | Capa gratuita generosa |
| **DeepSeek** | [platform.deepseek.com](https://platform.deepseek.com) | Muy barato |

## 🌐 Despliegue en GitHub Pages

El push a `main` dispara el workflow `.github/workflows/deploy.yml` (build + publish). Solo hay que configurarlo una vez:

1. **Settings → Pages → Build and deployment → Source: GitHub Actions.**
2. **Settings → Secrets and variables → Actions → New repository secret**: crea **un secret por cada variable** (no pegues el `.env` entero). El **nombre** debe ser exactamente el de la izquierda y el **valor** solo lo que va tras el `=` en tu `.env.local` (sin comillas, sin espacios finales y sin repetir el prefijo):

   | Nombre del secret | Valor (ejemplo) |
   |---|---|
   | `VITE_FIREBASE_API_KEY` | `AIzaSyD…` |
   | `VITE_FIREBASE_AUTH_DOMAIN` | `super-ludoteca.firebaseapp.com` |
   | `VITE_FIREBASE_PROJECT_ID` | `super-ludoteca` |
   | `VITE_FIREBASE_STORAGE_BUCKET` | `super-ludoteca.firebasestorage.app` |
   | `VITE_FIREBASE_MESSAGING_SENDER_ID` | `123456789012` |
   | `VITE_FIREBASE_APP_ID` | `1:123456789012:web:abc123…` |

   Tras añadirlos, relanza la build: **Actions → «Deploy a GitHub Pages» → Re-run all jobs** (o haz cualquier push). Si faltan, la web se despliega igualmente en Modo Invitado Local.

3. **Claves de IA (`VITE_GEMINI_API_KEY` / `VITE_DEEPSEEK_API_KEY`) — no recomendado como secrets**: cualquier variable `VITE_` acaba incrustada en el JavaScript público de la web (cualquiera puede leerla). La de Firebase es pública por diseño (la protección real son las reglas de Firestore), pero una clave de IA es facturable: configúrala desde **Ajustes** de la app, que solo la guarda en tu dispositivo.

> Nota técnica: el router usa *hash routing* (`#/`) porque GitHub Pages no soporta rutas de History API sin un `404.html`.

## 📁 Estructura y convenciones

La guía completa para trabajar en el repo (stack, estructura, convenciones de código, reglas de autoría y versionado) está en [`AGENTS.md`](AGENTS.md).

## 📄 Licencia

Consulta el archivo [LICENSE](LICENSE).

---

Hecho por [@axgaldo](https://github.com/axgaldo) · Versión [v1.0.0](https://axgaldo.github.io/super-ludoteca/)
