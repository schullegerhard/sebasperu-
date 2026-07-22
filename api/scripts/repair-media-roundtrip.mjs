// Repara registros cuyo campo de imagen fue pisado por una URL /media/... (el
// "round-trip" del panel, ya bloqueado en store.js). Si otro registro conserva
// el MISMO contenido (mismo hash en la URL), lo restaura desde ahí.
// Uso:  node scripts/repair-media-roundtrip.mjs        (desde api/, usa .env)
import 'dotenv/config'
import pg from 'pg'
import crypto from 'node:crypto'

const url = process.env.DATABASE_URL
if (!url) { console.error('Falta DATABASE_URL'); process.exit(1) }
const isLocal = /@(localhost|127\.0\.0\.1)[:/]/.test(url)
const pool = new pg.Pool({ connectionString: url, max: 3, ssl: isLocal ? false : { rejectUnauthorized: false } })

const MEDIA = /\/media\/([pbc])\/[^/]+\/([a-z]+\d*)-([0-9a-f]+)\.[a-z]+$/i
const isData = (s) => typeof s === 'string' && s.startsWith('data:image')
const hash8 = (s) => crypto.createHash('sha1').update(s).digest('hex').slice(0, 10)

// Índice hash → base64 de TODO el contenido sano (para restaurar por hash).
const byHash = new Map()
const index = (v) => { if (isData(v)) byHash.set(hash8(v), v) }

const banners = (await pool.query('SELECT id, data FROM banners ORDER BY id')).rows
const products = (await pool.query('SELECT id, data FROM products ORDER BY id')).rows
const categories = (await pool.query('SELECT slug, data FROM categories ORDER BY slug')).rows
for (const r of banners) index(r.data?.image)
for (const r of products) { index(r.data?.image); (r.data?.gallery || []).forEach(index); (r.data?.images || []).forEach(index) }
for (const r of categories) { index(r.data?.image); index(r.data?.bannerDesktop); index(r.data?.bannerMobile); index(r.data?.seo?.ogImage) }
console.log(`Contenido sano indexado: ${byHash.size} imágenes`)

let fixed = 0; let lost = 0
const heal = (val, where) => {
  const m = typeof val === 'string' ? val.match(MEDIA) : null
  if (!m) return val
  const rec = byHash.get(m[3].toLowerCase())
  if (rec) { console.log(`  ✅ restaurado ${where} (hash ${m[3]})`); fixed++; return rec }
  console.log(`  ❌ SIN RESPALDO ${where} — hay que volver a subir la imagen (URL muerta: ${val.slice(0, 80)})`)
  lost++; return val
}

for (const r of banners) {
  const d = r.data; const before = JSON.stringify(d)
  d.image = heal(d.image, `banner #${r.id} «${d.title || ''}»`)
  if (JSON.stringify(d) !== before) await pool.query('UPDATE banners SET data=$2 WHERE id=$1', [r.id, JSON.stringify(d)])
}
for (const r of products) {
  const d = r.data; const before = JSON.stringify(d)
  d.image = heal(d.image, `producto #${r.id} «${d.name || ''}»`)
  if (Array.isArray(d.gallery)) d.gallery = d.gallery.map((v, i) => heal(v, `producto #${r.id} galería[${i}]`))
  if (Array.isArray(d.images)) d.images = d.images.map((v, i) => heal(v, `producto #${r.id} images[${i}]`))
  if (JSON.stringify(d) !== before) await pool.query('UPDATE products SET data=$2 WHERE id=$1', [r.id, JSON.stringify(d)])
}
for (const r of categories) {
  const d = r.data; const before = JSON.stringify(d)
  d.image = heal(d.image, `categoría ${r.slug} imagen`)
  d.bannerDesktop = heal(d.bannerDesktop, `categoría ${r.slug} bannerDesktop`)
  d.bannerMobile = heal(d.bannerMobile, `categoría ${r.slug} bannerMobile`)
  if (d.seo) d.seo.ogImage = heal(d.seo.ogImage, `categoría ${r.slug} ogImage`)
  if (JSON.stringify(d) !== before) await pool.query('UPDATE categories SET data=$2 WHERE slug=$1', [r.slug, JSON.stringify(d)])
}

console.log(`\nResultado: ${fixed} restauradas · ${lost} sin respaldo (re-subir en el panel)`)
await pool.end()
