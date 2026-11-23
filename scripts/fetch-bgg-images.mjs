// Genera src/data/catalog/images.ts con las portadas de BoardGameGeek.
//
// La API XML de BGG exige ahora una aplicación registrada + token (401 sin él),
// y sus páginas están detrás de Cloudflare. Este script usa la Wayback Machine:
//   1) availability API con la URL canónica (rápida, devuelve snapshots recientes)
//   2) CDX por prefijo como respaldo (más lento)
// y extrae de cada snapshot:
//   - __itemrep 246x300 → portada para las tarjetas
//   - og:image 1200x630 → portada ancha para la cabecera de la ficha
//
// Guarda el progreso en scripts/bgg-images-progress.json: al relanzarlo solo
// reintenta lo pendiente.
//
// Uso:  node scripts/fetch-bgg-images.mjs
// Es un script de mantenimiento (pocas veces al año); no forma parte del build.

import { readFile, writeFile } from 'node:fs/promises'

/** catalogId → [BGG game id, slug canónico] */
const GAMES = {
  catan: [13, 'catan'],
  carcassonne: [822, 'carcassonne'],
  'aventureros-europa': [14996, 'ticket-to-ride-europe'],
  azul: [230802, 'azul'],
  splendor: [148228, 'splendor'],
  'small-world': [40692, 'small-world'],
  decrypto: [225694, 'decrypto'],
  codenames: [178900, 'codenames'],
  dixit: [39856, 'dixit'],
  'siete-maravillas': [68448, '7-wonders'],
  'love-letter': [129622, 'love-letter'],
  kingdomino: [204583, 'kingdomino'],
  'sushi-go': [133473, 'sushi-go'],
  coup: [131357, 'coup'],
  wingspan: [266192, 'wingspan'],
  root: [237182, 'root'],
  jaipur: [54043, 'jaipur'],
  hanabi: [98778, 'hanabi'],
  'the-mind': [244992, 'the-mind'],
  'toma-6': [432, '6-nimmt'],
  dobble: [63268, 'spot-it'],
  'exploding-kittens': [172225, 'exploding-kittens'],
  'castillos-toscana': [300327, 'the-castles-of-tuscany'],
  'castillos-borgona': [363622, 'the-castles-of-burgundy-special-edition'],
  ankh: [285967, 'ankh-gods-of-egypt'],
  rattus: [42452, 'rattus'],
  cascadia: [295947, 'cascadia'],
  zombicide: [286751, 'zombicide-2nd-edition'],
  'marvel-zombies': [351817, 'marvel-zombies-a-zombicide-game'],
  fallout: [232918, 'fallout'],
  'gloomhaven-garras': [291457, 'gloomhaven-jaws-of-the-lion'],
  'dilema-del-rey': [245655, 'the-kings-dilemma'],
  'catan-5-6': [2807, 'catan-5-6-player-expansion'],
  'little-secret': [367367, 'little-secret'],
  cubitos: [298069, 'cubitos'],
  furnace: [318084, 'furnace'],
  'terraforming-mars': [167791, 'terraforming-mars'],
  'one-round': [436046, 'one-round'],
  'feed-the-kraken': [271601, 'feed-the-kraken'],
  'chao-pescao': [359893, 'sounds-fishy'],
  'wonders-duel-7': [173346, '7-wonders-duel'],
  quest: [316287, 'quest'],
  heroquest: [699, 'heroquest'],
  'brass-lancashire': [28720, 'brass-lancashire'],
}

const UA = 'super-ludoteca/1.3 (https://github.com/axgaldo/super-ludoteca)'
const PROGRESS_FILE = new URL('./bgg-images-progress.json', import.meta.url)
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

/** Snapshots concretos para cuando la API availability falla de forma persistente. */
const SNAPSHOT_OVERRIDES = {
  cascadia: {
    timestamp: '20261102075602',
    original: 'https://boardgamegeek.com/boardgame/295947/cascadia',
  },
}

async function loadProgress() {
  try {
    return JSON.parse(await readFile(PROGRESS_FILE, 'utf8'))
  } catch {
    return {}
  }
}

async function fetchText(url, timeoutMs = 30000) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const res = await fetch(url, { headers: { 'user-agent': UA }, signal: controller.signal })
    if (!res.ok) return null
    return await res.text()
  } catch {
    return null
  } finally {
    clearTimeout(timeout)
  }
}

async function fetchJson(url, timeoutMs = 20000) {
  const text = await fetchText(url, timeoutMs)
  if (!text) return null
  try {
    return JSON.parse(text)
  } catch {
    return null
  }
}

/** 1) availability API con la URL canónica (rápido). */
async function findSnapshotFast(bggId, slug) {
  const data = await fetchJson(
    `https://archive.org/wayback/available?url=boardgamegeek.com/boardgame/${bggId}/${slug}`,
  )
  const closest = data?.archived_snapshots?.closest
  if (closest?.available && closest.timestamp) {
    return {
      timestamp: closest.timestamp,
      original: `https://boardgamegeek.com/boardgame/${bggId}/${slug}`,
    }
  }
  return null
}

/** 2) CDX por prefijo (respaldo, sin slug). */
async function findSnapshotSlow(bggId) {
  const url =
    `https://web.archive.org/cdx/search/cdx?url=boardgamegeek.com/boardgame/${bggId}/` +
    '&matchType=prefix&output=json&filter=statuscode:200&filter=mimetype:text/html&limit=-40'
  const text = await fetchText(url, 20000)
  if (!text) return null
  let rows
  try {
    rows = JSON.parse(text)
  } catch {
    return null
  }
  const data = rows.slice(1)
  if (data.length === 0) return null
  const canonical = new RegExp(
    `^https?://(?:www\\.)?boardgamegeek\\.com/boardgame/${bggId}(?:/[^/?#]+)?/?(?:\\?.*)?$`,
  )
  const candidates = data
    .filter((row) => canonical.test(row[2]))
    .sort((a, b) => Number(b[1]) - Number(a[1]))
  if (candidates.length === 0) return null
  const chosen = candidates[0]
  return { timestamp: chosen[1], original: chosen[2] }
}

/** Descarga el snapshot sin reescritura (id_) y extrae título, portada y og:image. */
async function extractImages({ timestamp, original }) {
  const html = await fetchText(`https://web.archive.org/web/${timestamp}id_/${original}`, 35000)
  if (!html) return null
  const title = /<title>([^<]*)<\/title>/i.exec(html)?.[1]?.trim() ?? ''
  const itemrep = /https:\/\/cf\.geekdo-images\.com\/[^"'\s]+__itemrep\/img\/[^"'\s]+/.exec(html)?.[0]
  const og = /<meta property="og:image" content="([^"]+)"/i.exec(html)?.[1]
  if (!itemrep || !og) return null
  return { title, image: itemrep, wide: og }
}

async function resolveGame(bggId, slug) {
  for (let attempt = 1; attempt <= 2; attempt++) {
    const fast = await findSnapshotFast(bggId, slug)
    if (fast) {
      const images = await extractImages(fast)
      if (images) return images
    }
    const slow = await findSnapshotSlow(bggId)
    if (slow) {
      const images = await extractImages(slow)
      if (images) return images
    }
    await sleep(attempt * 8000)
  }
  return null
}

const progress = await loadProgress()
const pending = Object.entries(GAMES).filter(([catalogId]) => !progress[catalogId])
console.log(`${Object.keys(progress).length} ya guardados, ${pending.length} pendientes`)

for (const [catalogId, [bggId, slug]] of pending) {
  const override = SNAPSHOT_OVERRIDES[catalogId]
  const result = override ? await extractImages(override) : await resolveGame(bggId, slug)
  if (result) {
    progress[catalogId] = result
    console.log(`✓ ${catalogId} (${bggId}) — ${result.title}`)
  } else {
    console.log(`✗ ${catalogId} (${bggId}) — sin snapshot utilizable`)
  }
  await writeFile(PROGRESS_FILE, JSON.stringify(progress, null, 2), 'utf8')
  await sleep(1500)
}

const entries = Object.entries(progress).sort(([a], [b]) => a.localeCompare(b))
const lines = entries.map(
  ([id, imgs]) =>
    `  ${JSON.stringify(id)}: {\n    image:\n      '${imgs.image}',\n    imageWide:\n      '${imgs.wide}',\n  },`,
)

const file = `// Generado por scripts/fetch-bgg-images.mjs — portadas de BoardGameGeek.
// Fuente: páginas de BGG archivadas en Wayback Machine (la API XML exige registro).
// Las imágenes se enlazan desde el CDN público cf.geekdo-images.com.
import type { CatalogImage } from './types'

export const BGG_IMAGES: Record<string, CatalogImage> = {
${lines.join('\n')}
}
`

await writeFile(new URL('../src/data/catalog/images.ts', import.meta.url), file, 'utf8')
console.log(`\n✅ ${entries.length}/${Object.keys(GAMES).length} imágenes en src/data/catalog/images.ts`)
const missing = Object.keys(GAMES).filter((id) => !progress[id])
if (missing.length > 0) console.log('Pendientes:', missing.join(', '))
