// Sirve las imágenes de producto/banner (guardadas como data URL base64 en la BD)
// a través de URLs de archivo cacheables y rastreables. Así:
//   · el JSON-LD de la ficha puede incluir `image` (Google exige URL, no base64),
//   · el navegador/CDN cachea la imagen (mejor LCP) en vez de reincrustarla,
//   · el HTML de la tienda deja de pesar megas por cada base64.
// La imagen sigue viviendo como base64 en la BD (fuente de verdad): esto solo la
// EXPONE como archivo. Ver auditoría SEO 2.4.
import crypto from 'node:crypto'

export const isDataUrl = (s) => typeof s === 'string' && s.startsWith('data:image')

// Hash corto del contenido (para cache-busting y ETag). Acepta string o Buffer.
export const hash8 = (s) => crypto.createHash('sha1').update(s).digest('hex').slice(0, 10)

const EXT = {
  'image/jpeg': 'jpg', 'image/jpg': 'jpg', 'image/png': 'png', 'image/webp': 'webp',
  'image/gif': 'gif', 'image/svg+xml': 'svg', 'image/avif': 'avif',
}
const extOf = (dataUrl) => {
  const m = /^data:(image\/[a-z0-9.+-]+);base64,/i.exec(dataUrl || '')
  return (m && EXT[m[1].toLowerCase()]) || 'jpg'
}

// URL pública de la imagen. El hash del contenido va en la ruta: si la imagen
// cambia en el panel, la URL cambia (invalida cachés automáticamente).
const urlFor = (origin, kind, id, slot, dataUrl) =>
  `${origin}/media/${kind}/${id}/${slot}-${hash8(dataUrl)}.${extOf(dataUrl)}`

// Reemplaza los campos de imagen base64 de un producto por URLs (deja intactas
// las rutas /img/… y las URLs http ya existentes).
export function transformProduct(p, origin) {
  if (!p || typeof p !== 'object') return p
  const out = { ...p }
  if (isDataUrl(p.image)) out.image = urlFor(origin, 'p', p.id, 'main', p.image)
  if (Array.isArray(p.gallery)) out.gallery = p.gallery.map((v, i) => (isDataUrl(v) ? urlFor(origin, 'p', p.id, `g${i}`, v) : v))
  if (Array.isArray(p.images)) out.images = p.images.map((v, i) => (isDataUrl(v) ? urlFor(origin, 'p', p.id, `i${i}`, v) : v))
  return out
}

export function transformBanner(b, origin) {
  if (!b || typeof b !== 'object' || !isDataUrl(b.image)) return b
  return { ...b, image: urlFor(origin, 'b', b.id, 'main', b.image) }
}

// "slot-hash.ext" → "main" | "g0" | "i2" (los slots no llevan guiones).
export const slotFromFile = (file) => String(file || '').split('-')[0]

// Devuelve la data URL base64 del slot pedido del producto.
export function resolveProductSlot(p, slot) {
  if (!p) return null
  if (slot === 'main') return p.image
  let m
  if ((m = /^g(\d+)$/.exec(slot))) return Array.isArray(p.gallery) ? p.gallery[Number(m[1])] : null
  if ((m = /^i(\d+)$/.exec(slot))) return Array.isArray(p.images) ? p.images[Number(m[1])] : null
  return null
}

// data:image/xxx;base64,DATA → { mime, buffer } (o null si no es válida).
export function decodeDataUrl(dataUrl) {
  const m = /^data:(image\/[a-z0-9.+-]+);base64,(.*)$/is.exec(dataUrl || '')
  if (!m) return null
  return { mime: m[1].toLowerCase(), buffer: Buffer.from(m[2], 'base64') }
}
