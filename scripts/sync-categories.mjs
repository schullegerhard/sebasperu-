// Sincroniza las categorías de la BD (admin) con la barra de navegación del
// storefront: crea las que faltan (Almacenamiento, Periféricos, Energía) y
// renombra Computación/Impresión. Idempotente. UTF-8 correcto (fetch nativo).
const B = process.env.API || 'http://localhost:4000'
const login = await (await fetch(B + '/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: 'admin@sebasperu.com', password: 'admin123' }) })).json()
const H = { 'Content-Type': 'application/json', Authorization: 'Bearer ' + login.token }

const img = (id) => `/img/photo-${id}.jpg`
const NEW = [
  { slug: 'almacenamiento', name: 'Almacenamiento', image: img('1628557118391-56cd62c9f2cb'), subcategories: [
    { slug: 'ssd', name: 'SSD' }, { slug: 'discos-duros', name: 'Discos Duros' },
    { slug: 'usb-microsd', name: 'USB & MicroSD' }, { slug: 'memorias-ram', name: 'Memorias RAM' } ] },
  { slug: 'perifericos', name: 'Periféricos', image: img('1615663245857-ac93bb7c39e7'), subcategories: [
    { slug: 'mouse-teclados', name: 'Mouse & Teclados' }, { slug: 'gaming', name: 'Gaming' },
    { slug: 'audio', name: 'Audio' }, { slug: 'webcams', name: 'Webcams' } ] },
  { slug: 'energia', name: 'Energía', image: img('1716062890647-60feae0609d0'), subcategories: [
    { slug: 'ups', name: 'UPS & Estabilizadores' }, { slug: 'fuentes', name: 'Fuentes de Poder' },
    { slug: 'vigilancia', name: 'Vigilancia' } ] },
]
const RENAME = [
  ['laptops-pc', 'Computación'],
  ['impresoras', 'Impresión'],
]

const existing = await (await fetch(B + '/api/categories')).json()
const bySlug = Object.fromEntries(existing.map((c) => [c.slug, c]))

for (const cat of NEW) {
  if (bySlug[cat.slug]) { console.log('exists, skip:', cat.slug); continue }
  const r = await fetch(B + '/api/categories', { method: 'POST', headers: H, body: JSON.stringify(cat) })
  console.log('created', cat.slug, '->', r.status)
}
for (const [slug, name] of RENAME) {
  if (!bySlug[slug]) { console.log('missing to rename:', slug); continue }
  const r = await fetch(B + '/api/categories/' + slug, { method: 'PUT', headers: H, body: JSON.stringify({ name }) })
  console.log('renamed', slug, '->', name, r.status)
}

const after = await (await fetch(B + '/api/categories')).json()
console.log('\nfinal categories (' + after.length + '):')
after.filter((c) => !c.parent).forEach((c) => console.log(' ', c.slug, '|', c.name, '| U+FFFD:', (c.name || '').includes('�')))
