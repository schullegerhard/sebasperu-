// Siembra los bloques promocionales (slot='promo') en la BD vía la API, con el
// mismo contenido que traía el diseño (Home.jsx). Idempotente: si ya existe un
// promo con el mismo título, lo actualiza; si no, lo crea. Los banners del
// carrusel (slot='hero') no se tocan.
//
// Uso:  node scripts/seed-promo-banners.mjs      (API local apuntando a Supabase)
const B = process.env.API || 'http://localhost:4000'
const img = (id) => `/img/${id}.jpg`

const PROMOS = [
  { theme: 'blue',   badge: 'ESPECIAL IMPRESIÓN', title: 'Impresoras HP',        accent: 'desde S/ 299',   subtitle: 'Inkjet, multifunción y tanque de tinta',            cta: 'Ver impresoras', link: '/categoria/impresoras', image: img('photo-1612815154858-60aa4c59eaa6') },
  { theme: 'dark',   badge: 'IMPRESIÓN LÁSER',    title: 'Tóner original',       accent: 'hasta 40% OFF',  subtitle: 'HP, Samsung, Brother y Epson',                     cta: 'Ver tóner',      link: '/categoria/toner',      image: img('photo-1586953208448-b95a79798f07') },
  { theme: 'blue',   badge: 'TÓNER ORIGINAL',     title: 'Tóner HP LaserJet',    accent: 'desde S/ 145',   subtitle: '85A · 35A · 78A · 12A — stock disponible',         cta: 'Ver tóner HP',   link: '/categoria/toner',      image: img('photo-1586953208448-b95a79798f07') },
  { theme: 'green',  badge: 'TÓNER COMPATIBLE',   title: 'Samsung · Brother',    accent: 'hasta 35% OFF',  subtitle: 'MLT-D101S · TN-1060 · TN-760 — garantía oficial',  cta: 'Ver tóner',      link: '/categoria/toner',      image: img('photo-1612815154858-60aa4c59eaa6') },
  { theme: 'blue',   badge: 'LAPTOPS HP',         title: 'HP Pavilion',          accent: 'desde S/ 1,899', subtitle: 'Intel Core i5 · i7 — 8GB a 16GB RAM',              cta: 'Ver HP',         link: '/categoria/laptops-pc', image: img('photo-1517336714731-489689fd1ca8') },
  { theme: 'purple', badge: 'LAPTOPS LENOVO',     title: 'IdeaPad · ThinkPad',   accent: 'desde S/ 1,799', subtitle: 'AMD Ryzen 5 · 7 — hasta 32GB RAM',                 cta: 'Ver Lenovo',     link: '/categoria/laptops-pc', image: img('photo-1496181133206-80ce9b88a853') },
  { theme: 'navy',   badge: 'LAPTOPS DELL',       title: 'Inspiron · Vostro',    accent: 'desde S/ 2,299', subtitle: 'Intel Core i7 · i9 — SSD NVMe 512GB',              cta: 'Ver Dell',       link: '/categoria/laptops-pc', image: img('photo-1593642632559-0c6d3fc62b89') },
  { theme: 'blue',   badge: 'TINTAS PARA IMPRESORA', title: 'HP · Epson · Canon', accent: 'hasta 25% OFF', subtitle: 'Originales y compatibles. Envío gratis +S/ 200.',    cta: 'Ver tintas',     link: '/categoria/tintas',     image: img('photo-1612815154858-60aa4c59eaa6') },
]

const login = await (await fetch(B + '/api/auth/login', {
  method: 'POST', headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'admin@sebasperu.com', password: 'admin123' }),
})).json()
if (!login.token) { console.error('login failed'); process.exit(1) }
const H = { 'Content-Type': 'application/json', Authorization: 'Bearer ' + login.token }

const existing = await (await fetch(B + '/api/banners', { headers: H })).json()
const byTitle = new Map(existing.filter((b) => b.slot === 'promo').map((b) => [b.title, b.id]))
let created = 0; let updated = 0
for (const p of PROMOS) {
  const body = { ...p, slot: 'promo', active: true }
  if (byTitle.has(p.title)) { body.id = byTitle.get(p.title); await fetch(B + '/api/banners', { method: 'POST', headers: H, body: JSON.stringify(body) }); updated++ }
  else { await fetch(B + '/api/banners', { method: 'POST', headers: H, body: JSON.stringify(body) }); created++ }
}
const after = await (await fetch(B + '/api/banners', { headers: H })).json()
console.log(`promos: creados ${created}, actualizados ${updated}`)
console.log('total banners:', after.length, '| hero:', after.filter((b) => (b.slot || 'hero') === 'hero').length, '| promo:', after.filter((b) => b.slot === 'promo').length)
