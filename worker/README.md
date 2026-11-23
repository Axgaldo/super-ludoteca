# Proxy de IA (Cloudflare Worker)

Este Worker mantiene la **API key de Gemini fuera del navegador**. La app solo
llama a la URL del Worker; la clave se guarda cifrada como secret en Cloudflare
y nunca aparece en el bundle ni en el repositorio.

## Despliegue en 5 minutos (panel web, sin instalar nada)

> **No hace falta conectar GitHub** ni crear un «proyecto»: el Worker es un
> único script que se pega en el editor de Cloudflare y se publica. El repo no
> se toca y entre GitHub y Cloudflare no se comparte ninguna credencial.

1. Crea una cuenta gratuita en [dash.cloudflare.com](https://dash.cloudflare.com) (sin tarjeta; el plan Free incluye 100.000 peticiones al día).
2. En el panel: **Workers & Pages** (pestaña *Workers*) → **Create** → **Create Worker**. Elige la plantilla **Hello World** (no «Import a repository» / «Connect to Git»).
3. Pulsa **Edit code**, borra el contenido y pega el archivo [`index.js`](index.js). **Deploy**.
4. **Settings → Variables and Secrets → Add**:
   - `GEMINI_API_KEY` — tipo **Secret** — tu clave de [AI Studio](https://aistudio.google.com/apikey).
   - `ALLOWED_ORIGINS` — tipo **Text** — `https://axgaldo.github.io,http://localhost:5173,http://localhost:4173`.
5. Copia la URL del Worker (`https://<nombre>.<usuario>.workers.dev`) y úsala como
   `VITE_AI_PROXY_URL` en `.env.local` (desarrollo) y dentro del secret
   `FIREBASE_ENV` (producción).
6. (Opcional) **RATE_LIMIT**: crea un KV namespace y añádelo como binding
   `RATE_LIMIT` para limitar a 40 peticiones/hora por IP.

## Alternativa por CLI

```bash
cd worker
npx wrangler deploy
npx wrangler secret put GEMINI_API_KEY
```

## Comprobación de que la clave no se filtra

Tras compilar la app, no debe quedar rastro de Gemini ni de la clave en `dist/`
(la app solo conoce la URL del Worker):

```bash
# PowerShell
Select-String -Path dist\assets\*.js -Pattern "generativelanguage" -SimpleMatch   # False
Select-String -Path dist\assets\*.js -Pattern "<primeros caracteres de tu clave>" -SimpleMatch  # False
```

Ojo: `AIza` sí aparece porque son las claves públicas de Firebase (por diseño).
