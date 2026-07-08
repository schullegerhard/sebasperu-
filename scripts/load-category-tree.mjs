// Carga el árbol completo de categorías (src/data/menu.js) en la BD vía la API.
// - Asegura los 7 rubros principales (solo nombre; siguen sin parent).
// - Crea/enlaza cada subcategoría como REGISTRO con `parent` (Tóner/Tintas quedan
//   bajo Impresión; los ítems bajo su grupo o su rubro). Así descendantSlugs()
//   agrega los productos de las subcategorías a la categoría principal.
// Idempotente: PUT (merge) si ya existe, POST si es nueva. No pisa imagen/banners.
//
// Uso:  node scripts/load-category-tree.mjs      (API local apuntando a Supabase)
import { MAINS, CATEGORY_RECORDS } from '../src/data/menu.js'

const B = process.env.API || 'http://localhost:4000'
const login = await (await fetch(B + '/api/auth/login', {
  method: 'POST', headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'admin@sebasperu.com', password: 'admin123' }),
})).json()
if (!login.token) { console.error('login failed'); process.exit(1) }
const H = { 'Content-Type': 'application/json', Authorization: 'Bearer ' + login.token }

const existing = new Set((await (await fetch(B + '/api/categories')).json()).map((c) => c.slug))
let created = 0; let updated = 0

async function upsert(rec) {
  if (existing.has(rec.slug)) {
    const patch = { name: rec.name }
    if ('parent' in rec) patch.parent = rec.parent
    await fetch(B + '/api/categories/' + rec.slug, { method: 'PUT', headers: H, body: JSON.stringify(patch) })
    updated++
  } else {
    const body = { slug: rec.slug, name: rec.name, parent: rec.parent || '', image: rec.image || '' }
    await fetch(B + '/api/categories', { method: 'POST', headers: H, body: JSON.stringify(body) })
    existing.add(rec.slug); created++
  }
}

// 1) Asegura los rubros principales (nombre correcto; sin tocar parent).
for (const m of MAINS) await upsert({ slug: m.slug, name: m.name })
// 2) Crea/enlaza el árbol (subcategorías + grupos Tóner/Tintas con parent).
for (const rec of CATEGORY_RECORDS) await upsert(rec)

const after = await (await fetch(B + '/api/categories')).json()
const roots = after.filter((c) => !c.parent)
const toner = after.find((c) => c.slug === 'toner')
const tintas = after.find((c) => c.slug === 'tintas')
console.log(`created ${created}, updated ${updated}, total categorías: ${after.length}`)
console.log('rubros principales:', roots.map((c) => c.name).join(', '))
console.log('toner.parent =', toner?.parent, '| tintas.parent =', tintas?.parent)
console.log('UTF-8 ok:', after.every((c) => !(c.name || '').includes('�')))
