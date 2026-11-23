// Regenera los iconos PWA (public/) a partir del logo.
// Prioriza un logo raster generado por IA (assets/logo-source.png|jpg|webp);
// si no existe, usa el logo vectorial assets/logo.svg.
// Uso: npm run icons

import { mkdir, readdir } from 'node:fs/promises'
import sharp from 'sharp'

const DARK = '#09090b' // coincide con --app en modo oscuro
const OUT = 'public'

async function findSource() {
  const files = await readdir('assets')
  const raster = files.find((f) => /^logo-source\.(png|jpe?g|webp)$/i.test(f))
  if (raster) return `assets/${raster}`
  const svg = files.find((f) => /^logo\.svg$/i.test(f))
  if (svg) return `assets/${svg}`
  throw new Error('No encuentro assets/logo-source.(png|jpg|webp) ni assets/logo.svg')
}

const source = await findSource()
await mkdir(`${OUT}/icons`, { recursive: true })

// Iconos "any": el arte a borde completo
await sharp(source).resize(192, 192, { fit: 'contain', background: DARK }).png().toFile(`${OUT}/icons/icon-192.png`)
await sharp(source).resize(512, 512, { fit: 'contain', background: DARK }).png().toFile(`${OUT}/icons/icon-512.png`)
await sharp(source).resize(512, 512, { fit: 'contain', background: DARK }).png().toFile(`${OUT}/logo.png`)
await sharp(source).resize(180, 180, { fit: 'contain', background: DARK }).png().toFile(`${OUT}/apple-touch-icon.png`)
await sharp(source).resize(96, 96, { fit: 'contain', background: DARK }).png().toFile(`${OUT}/favicon.png`)

// Icono maskable: el arte al 72% dentro de lienzo seguro
const inner = await sharp(source)
  .resize(Math.round(512 * 0.72), Math.round(512 * 0.72), { fit: 'contain', background: DARK })
  .png()
  .toBuffer()
await sharp({ create: { width: 512, height: 512, channels: 4, background: DARK } })
  .composite([{ input: inner, gravity: 'center' }])
  .png()
  .toFile(`${OUT}/icons/icon-maskable-512.png`)

console.log('✔ Iconos PWA generados en', OUT, '(fuente:', source + ')')
