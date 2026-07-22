// Repositorio de datos con dos backends:
//  - PostgreSQL si DATABASE_URL está definido y las tablas existen.
//  - En memoria (sembrado desde el catálogo) como respaldo, para correr sin BD.
import pg from 'pg'
import bcrypt from 'bcryptjs'
import { products as seedProducts, categories as seedCategories } from './catalog.js'
import { ensureSchema } from './migrate.js'
import { PAGES_SEED } from './pages-seed.js'
import { resolveProductSlot, resolveCategorySlot } from './media.js'

// ---- Protección contra el "round-trip" del panel ----
// La API expone las imágenes como URLs /media/... Si el panel edita y re-guarda
// un registro, esa URL volvería como valor del campo y PISARÍA el base64
// original (perdiendo la imagen). Si el valor entrante es una URL /media/...,
// se conserva el valor ya guardado.
const OWN_MEDIA = /\/media\/[pbc]\/[^/]+\/([a-z]+\d*)-[0-9a-f]+\.[a-z]+$/i
const mediaSlot = (v) => { const m = typeof v === 'string' ? v.match(OWN_MEDIA) : null; return m ? m[1] : null }
const keepStored = (incoming, restore) => {
  const slot = mediaSlot(incoming)
  if (!slot) return incoming
  const prev = restore(slot)
  return prev != null && prev !== '' ? prev : incoming
}
function preserveProductImages(p, cur) {
  if (!cur) return p
  p.image = keepStored(p.image, (s) => resolveProductSlot(cur, s))
  if (Array.isArray(p.gallery)) p.gallery = p.gallery.map((v) => keepStored(v, (s) => resolveProductSlot(cur, s)))
  if (Array.isArray(p.images)) p.images = p.images.map((v) => keepStored(v, (s) => resolveProductSlot(cur, s)))
  return p
}
function preserveCategoryImages(c, cur) {
  if (!cur) return c
  c.image = keepStored(c.image, (s) => resolveCategorySlot(cur, s))
  c.bannerDesktop = keepStored(c.bannerDesktop, (s) => resolveCategorySlot(cur, s))
  c.bannerMobile = keepStored(c.bannerMobile, (s) => resolveCategorySlot(cur, s))
  if (c.seo) c.seo = { ...c.seo, ogImage: keepStored(c.seo.ogImage, (s) => resolveCategorySlot(cur, s)) }
  return c
}

let pool = null
export let usingDb = false

/* --------------------------- datos en memoria --------------------------- */
const mem = {
  products: seedProducts.map((p) => ({ ...p })),
  categories: seedCategories.map((c) => ({ ...c, subcategories: [...c.subcategories] })),
  orders: [
    { id: 1000, code: 'PED-1000', customer: 'Juan Pérez García', email: 'juan@gmail.com', total: 1899, status: 'Pagado', payment: 'Yape', region: 'Lima', date: '2026-06-20', items: [{ name: 'Laptop HP 250 G9', qty: 1, price: 1899 }] },
    { id: 1001, code: 'PED-1001', customer: 'María López', email: 'maria@gmail.com', total: 747, status: 'Enviado', payment: 'Tarjeta', region: 'Arequipa', date: '2026-06-20', items: [{ name: 'Tóner HP 85A', qty: 2, price: 168 }] },
    { id: 1002, code: 'PED-1002', customer: 'Carlos Ruiz', email: 'carlos@empresa.pe', total: 3299, status: 'Pendiente', payment: 'Transferencia', region: 'Lima', date: '2026-06-19', items: [{ name: 'Lenovo Legion 5', qty: 1, price: 3299 }] },
  ],
  customers: [
    { id: 1, name: 'Juan Pérez García', email: 'juan@gmail.com', phone: '987 654 321', orders: 4, spent: 5240, since: '2025-11-02', type: 'Persona' },
    { id: 2, name: 'María López', email: 'maria@gmail.com', phone: '988 111 222', orders: 2, spent: 1446, since: '2026-01-15', type: 'Persona' },
    { id: 3, name: 'Empresa TechCorp', email: 'compras@techcorp.pe', phone: '01 555 4040', orders: 7, spent: 38900, since: '2025-08-20', type: 'Empresa' },
    { id: 4, name: 'Carlos Ruiz', email: 'carlos@empresa.pe', phone: '999 333 444', orders: 3, spent: 6890, since: '2026-02-10', type: 'Empresa' },
    { id: 5, name: 'Ana Torres', email: 'ana@gmail.com', phone: '977 888 999', orders: 1, spent: 168, since: '2026-05-01', type: 'Persona' },
    { id: 6, name: 'Pedro Castro', email: 'pedro@gmail.com', phone: '966 777 888', orders: 2, spent: 2738, since: '2026-03-22', type: 'Persona' },
  ],
  coupons: [
    { id: 1, code: 'SEBAS10', type: '%', value: 10, expires: '2026-12-31', active: true, uses: 42, minBuy: 0 },
    { id: 2, code: 'TECNO15', type: '%', value: 15, expires: '2026-09-30', active: true, uses: 18, minBuy: 500 },
    { id: 3, code: 'ENVIOGRATIS', type: 'envio', value: 0, expires: '2026-07-31', active: true, uses: 73, minBuy: 299 },
    { id: 4, code: 'BLACK50', type: 'S/', value: 50, expires: '2025-11-30', active: false, uses: 210, minBuy: 800 },
  ],
  settings: {
    name: 'SebasPeru', email: 'ventas@sebasperu.com', phone: '926 428 566', whatsapp: '925 552 042',
    address: 'Lima, Perú', ruc: '20512345678', currency: 'PEN', igv: 18,
    payments: { yape: true, plin: true, transferencia: true, tarjeta: true, contraentrega: true, mercadopago: true },
    shipping: { freeFrom: 299, limaFee: 15, provinceFee: 25 },
  },
  users: [
    { id: 1, name: 'Admin General', email: 'admin@sebasperu.com', role: 'Administrador', password_hash: bcrypt.hashSync('admin123', 8) },
    { id: 2, name: 'Carlos Vendedor', email: 'vendedor@sebasperu.com', role: 'Vendedor', password_hash: bcrypt.hashSync('vend123', 8) },
    { id: 3, name: 'Ana Almacén', email: 'almacen@sebasperu.com', role: 'Almacén', password_hash: bcrypt.hashSync('alm123', 8) },
    { id: 4, name: 'María Marketing', email: 'marketing@sebasperu.com', role: 'Marketing', password_hash: bcrypt.hashSync('mkt123', 8) },
    { id: 5, name: 'Sergio Soporte', email: 'soporte@sebasperu.com', role: 'Soporte', password_hash: bcrypt.hashSync('sop123', 8) },
  ],
  attributes: [],
  banners: [
    { id: 1, position: 0, active: true, theme: 'blue', badge: 'CYBERWEEK — Hasta 40% OFF', title: 'Tintas y Tóner al mejor precio del Perú', subtitle: 'HP, Epson, Canon, Brother y más marcas con garantía oficial. Envío a todo el país.', cta: 'Ver Tintas', link: '/categoria/tintas', image: '/img/photo-1612815154858-60aa4c59eaa6.jpg' },
    { id: 2, position: 1, active: true, theme: 'orange', badge: 'NUEVA COLECCIÓN 2024', title: 'Laptops HP, Dell y Lenovo desde S/ 1,899', subtitle: 'Procesadores Intel Core i5 e i7 de 12ª y 13ª generación. Cuotas sin intereses.', cta: 'Ver Laptops', link: '/categoria/laptops-pc', image: '/img/photo-1517336714731-489689fd1ca8.jpg' },
    { id: 3, position: 2, active: true, theme: 'green', badge: 'STOCK DISPONIBLE', title: 'Tóner original para impresoras láser', subtitle: 'HP, Samsung, Brother y Epson. Entrega en 24 horas en Lima.', cta: 'Ver Tóner', link: '/categoria/toner', image: '/img/photo-1586953208448-b95a79798f07.jpg' },
  ],
  pages: PAGES_SEED.map((p, i) => ({ id: i + 1, active: true, ...p })),
  oseq: 1003, pseq: Math.max(...seedProducts.map((p) => p.id)) + 1, cseq: 5, aseq: 1, bseq: 3, gseq: PAGES_SEED.length,
}

const slugify = (s) => (s || '').toString().toLowerCase().trim().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

/* ------------------------------ init ------------------------------ */
export async function initStore() {
  const url = process.env.DATABASE_URL
  if (!url) { console.log('ℹ️  Sin DATABASE_URL → modo EN MEMORIA (datos de ejemplo).'); return }
  // Supabase / hosts remotos requieren SSL; localhost no.
  const isLocal = /@(localhost|127\.0\.0\.1)[:/]/.test(url)
  try {
    pool = new pg.Pool({ connectionString: url, max: 5, ssl: isLocal ? false : { rejectUnauthorized: false } })
    await pool.query('SELECT 1')
    await ensureSchema(pool)   // crea tablas (idempotente) y siembra si está vacía
    usingDb = true
    console.log('✅ Conectado a PostgreSQL (datos persistentes).')
  } catch (e) {
    console.log(`⚠️  PostgreSQL no disponible (${e.message}). Usando modo EN MEMORIA.`)
    pool = null
  }
}
export const getPool = () => pool

/* ============================== PRODUCTOS ============================== */
// Campos pesados (imágenes base64 y textos largos) que SOLO se necesitan en la
// ficha del producto, no en el listado. Se omiten del listado para que
// /api/products sea liviano y rápido (evita transferir megas de galerías).
const HEAVY_FIELDS = ['gallery', 'images', 'longDesc', 'description', 'documents']
const lightProduct = (p) => { const o = { ...p }; for (const k of HEAVY_FIELDS) delete o[k]; return o }

// Listado LIVIANO (sin galerías/textos largos). La ficha usa getProductBySlug (completo).
export async function listProducts() {
  if (usingDb) return (await pool.query('SELECT data FROM products ORDER BY id')).rows.map((r) => lightProduct(r.data))
  return mem.products.map(lightProduct)
}
export async function getProductBySlug(slug) {
  if (usingDb) return (await pool.query('SELECT data FROM products WHERE slug=$1', [slug])).rows[0]?.data || null
  return mem.products.find((p) => p.slug === slug) || null
}
// Producto COMPLETO por id (lo usa /media/* para leer la imagen base64 del slot).
export async function getProductById(id) {
  if (usingDb) return (await pool.query('SELECT data FROM products WHERE id=$1', [id])).rows[0]?.data || null
  return mem.products.find((p) => p.id === Number(id)) || null
}
export async function productsByCategory(catSlug) {
  if (usingDb) return (await pool.query('SELECT data FROM products WHERE category=$1 ORDER BY id', [catSlug])).rows.map((r) => r.data)
  return mem.products.filter((p) => p.category === catSlug)
}
export async function createProduct(input) {
  const base = { rating: 4.5, reviews: 0, offer: false, compatibilities: [], related: [], specs: {} }
  if (usingDb) {
    const id = (await pool.query('SELECT COALESCE(MAX(id),0)+1 AS n FROM products')).rows[0].n
    const p = { ...base, ...input, id, slug: input.slug || slugify(input.name) }
    await pool.query('INSERT INTO products (id,slug,sku,name,brand,category,subcategory,price,old_price,stock,rating,reviews,data) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)',
      [p.id, p.slug, p.sku, p.name, p.brand, p.category, p.subcategory, p.price, p.oldPrice || null, p.stock, p.rating, p.reviews, JSON.stringify(p)])
    return p
  }
  const p = { ...base, ...input, id: mem.pseq++, slug: input.slug || slugify(input.name) }
  mem.products.push(p); return p
}
export async function updateProduct(id, patch) {
  if (usingDb) {
    const cur = (await pool.query('SELECT data FROM products WHERE id=$1', [id])).rows[0]?.data
    if (!cur) return null
    const p = preserveProductImages({ ...cur, ...patch, id }, cur)
    await pool.query('UPDATE products SET sku=$2,name=$3,brand=$4,category=$5,subcategory=$6,price=$7,old_price=$8,stock=$9,data=$10 WHERE id=$1',
      [id, p.sku, p.name, p.brand, p.category, p.subcategory, p.price, p.oldPrice || null, p.stock, JSON.stringify(p)])
    return p
  }
  const i = mem.products.findIndex((p) => p.id === id)
  if (i < 0) return null
  mem.products[i] = preserveProductImages({ ...mem.products[i], ...patch, id }, mem.products[i]); return mem.products[i]
}
export async function removeProduct(id) {
  if (usingDb) { await pool.query('DELETE FROM products WHERE id=$1', [id]); return true }
  mem.products = mem.products.filter((p) => p.id !== id); return true
}
export async function setStock(id, stock) {
  return updateProduct(id, { stock: Math.max(0, stock) })
}

/* ============================== CATEGORÍAS ============================== */
export async function listCategories() {
  if (usingDb) return (await pool.query('SELECT data FROM categories ORDER BY position, id')).rows.map((r) => r.data)
  return mem.categories
}
export async function getCategoryBySlug(slug) {
  if (usingDb) return (await pool.query('SELECT data FROM categories WHERE slug=$1', [slug])).rows[0]?.data || null
  return mem.categories.find((c) => c.slug === slug) || null
}
export async function createCategory(input) {
  // Persiste TODOS los campos del módulo (padre, descripción, banners, SEO, flags…).
  const cat = { subcategories: [], ...input, slug: input.slug || slugify(input.name) }
  // Es un upsert: si la categoría ya existe, protege sus imágenes del round-trip.
  const prev = await getCategoryBySlug(cat.slug)
  if (prev) preserveCategoryImages(cat, prev)
  if (usingDb) {
    const pos = input.order != null && input.order !== '' ? Number(input.order)
      : (await pool.query('SELECT COALESCE(MAX(position),0)+1 AS n FROM categories')).rows[0].n
    await pool.query(
      `INSERT INTO categories (slug,name,position,data) VALUES ($1,$2,$3,$4)
       ON CONFLICT (slug) DO UPDATE SET name=$2, position=$3, data=$4`,
      [cat.slug, cat.name, pos, JSON.stringify(cat)])
    return cat
  }
  const i = mem.categories.findIndex((c) => c.slug === cat.slug)
  if (i >= 0) mem.categories[i] = cat; else mem.categories.push(cat)
  return cat
}
async function saveCategory(cat) {
  if (usingDb) { await pool.query('UPDATE categories SET name=$2, position=$3, data=$4 WHERE slug=$1', [cat.slug, cat.name, Number(cat.order) || 0, JSON.stringify(cat)]); return cat }
  const i = mem.categories.findIndex((c) => c.slug === cat.slug); if (i >= 0) mem.categories[i] = cat; return cat
}
export async function updateCategory(slug, patch) {
  const cat = await getCategoryBySlug(slug); if (!cat) return null
  return saveCategory(preserveCategoryImages({ ...cat, ...patch, slug }, cat))
}
export async function removeCategory(slug) {
  if (usingDb) { await pool.query('DELETE FROM categories WHERE slug=$1', [slug]); return true }
  mem.categories = mem.categories.filter((c) => c.slug !== slug); return true
}
export async function addSubcategory(slug, name) {
  const cat = await getCategoryBySlug(slug); if (!cat) return null
  cat.subcategories = [...cat.subcategories, { slug: slugify(name), name }]
  return saveCategory(cat)
}
export async function removeSubcategory(slug, subSlug) {
  const cat = await getCategoryBySlug(slug); if (!cat) return null
  cat.subcategories = cat.subcategories.filter((s) => s.slug !== subSlug)
  return saveCategory(cat)
}
export async function moveCategory(slug, dir) {
  const cats = await listCategories()
  const i = cats.findIndex((c) => c.slug === slug); const j = i + dir
  if (i < 0 || j < 0 || j >= cats.length) return cats
  if (usingDb) {
    await pool.query('UPDATE categories SET position=$2 WHERE slug=$1', [cats[i].slug, j])
    await pool.query('UPDATE categories SET position=$2 WHERE slug=$1', [cats[j].slug, i])
  } else {
    [mem.categories[i], mem.categories[j]] = [mem.categories[j], mem.categories[i]]
  }
  return listCategories()
}

/* ============================== PEDIDOS ============================== */
export async function listOrders() {
  if (usingDb) return (await pool.query('SELECT * FROM orders ORDER BY date DESC, id DESC')).rows
  return [...mem.orders].sort((a, b) => b.id - a.id)
}
export async function createOrder(o) {
  if (usingDb) {
    const code = `PED-${Date.now().toString().slice(-6)}`
    const r = await pool.query('INSERT INTO orders (code,customer,email,total,status,payment,region,date,items) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *',
      [code, o.customer, o.email, o.total, 'Pendiente', o.payment, o.region, o.date, JSON.stringify(o.items)])
    return r.rows[0]
  }
  const id = mem.oseq++
  const order = { id, code: `PED-${id}`, status: 'Pendiente', ...o }
  mem.orders.push(order); return order
}
export async function setOrderStatus(id, status) {
  if (usingDb) { const r = await pool.query('UPDATE orders SET status=$2 WHERE id=$1 RETURNING *', [id, status]); return r.rows[0] }
  const o = mem.orders.find((x) => x.id === id); if (o) o.status = status; return o
}

/* ============================== CLIENTES ============================== */
export async function listCustomers() {
  if (usingDb) return (await pool.query('SELECT * FROM customers ORDER BY id')).rows
  return mem.customers
}
// Cuenta de cliente (registro/login en la tienda).
export async function findCustomerByEmail(email) {
  const e = String(email || '').trim().toLowerCase()
  if (!e) return null
  if (usingDb) return (await pool.query('SELECT * FROM customers WHERE lower(email)=$1', [e])).rows[0] || null
  return mem.customers.find((c) => (c.email || '').toLowerCase() === e) || null
}
export async function createCustomer({ name, email, phone, password_hash }) {
  const e = String(email || '').trim().toLowerCase()
  if (usingDb) {
    // Si el correo ya existe (p. ej. creado por el panel) sin contraseña, la fija.
    const r = await pool.query(
      `INSERT INTO customers (name, email, phone, password_hash) VALUES ($1,$2,$3,$4)
       ON CONFLICT (email) DO UPDATE SET name=EXCLUDED.name, phone=COALESCE(EXCLUDED.phone, customers.phone),
         password_hash=COALESCE(customers.password_hash, EXCLUDED.password_hash) RETURNING *`,
      [name, e, phone || null, password_hash])
    return r.rows[0]
  }
  const existing = mem.customers.find((c) => (c.email || '').toLowerCase() === e)
  if (existing) { if (!existing.password_hash) existing.password_hash = password_hash; return existing }
  const c = { id: ++mem.cseq, name, email: e, phone: phone || '', password_hash, type: 'Persona', since: new Date(0).toISOString().slice(0, 10) }
  mem.customers.push(c); return c
}
// Pedidos de un cliente (por correo).
export async function ordersByEmail(email) {
  const e = String(email || '').trim().toLowerCase()
  if (usingDb) return (await pool.query('SELECT * FROM orders WHERE lower(email)=$1 ORDER BY id DESC', [e])).rows
  return mem.orders.filter((o) => (o.email || '').toLowerCase() === e).reverse()
}

/* ============================== CUPONES ============================== */
export async function listCoupons() {
  if (usingDb) return (await pool.query('SELECT * FROM coupons ORDER BY id')).rows.map((r) => ({ ...r, minBuy: Number(r.min_buy) }))
  return mem.coupons
}
export async function saveCoupon(data) {
  if (usingDb) {
    if (data.id) { const r = await pool.query('UPDATE coupons SET code=$2,type=$3,value=$4,expires=$5,active=$6,min_buy=$7 WHERE id=$1 RETURNING *', [data.id, data.code, data.type, data.value, data.expires || null, data.active, data.minBuy || 0]); return r.rows[0] }
    const r = await pool.query('INSERT INTO coupons (code,type,value,expires,active,uses,min_buy) VALUES ($1,$2,$3,$4,$5,0,$6) RETURNING *', [data.code, data.type, data.value, data.expires || null, data.active ?? true, data.minBuy || 0]); return r.rows[0]
  }
  if (data.id) { const i = mem.coupons.findIndex((c) => c.id === data.id); mem.coupons[i] = { ...mem.coupons[i], ...data }; return mem.coupons[i] }
  const c = { uses: 0, active: true, ...data, id: ++mem.cseq }; mem.coupons.push(c); return c
}
export async function removeCoupon(id) {
  if (usingDb) { await pool.query('DELETE FROM coupons WHERE id=$1', [id]); return true }
  mem.coupons = mem.coupons.filter((c) => c.id !== id); return true
}
export async function toggleCoupon(id) {
  if (usingDb) { const r = await pool.query('UPDATE coupons SET active = NOT active WHERE id=$1 RETURNING *', [id]); return r.rows[0] }
  const c = mem.coupons.find((x) => x.id === id); if (c) c.active = !c.active; return c
}

/* ============================== CONFIG ============================== */
export async function getSettings() {
  if (usingDb) { const r = await pool.query('SELECT data FROM settings WHERE id=1'); return r.rows[0]?.data || mem.settings }
  return mem.settings
}
export async function saveSettings(patch) {
  const merged = { ...(await getSettings()), ...patch }
  if (usingDb) { await pool.query('INSERT INTO settings (id,data) VALUES (1,$1) ON CONFLICT (id) DO UPDATE SET data=$1', [JSON.stringify(merged)]); return merged }
  mem.settings = merged; return merged
}

/* ============================== ATRIBUTOS ============================== */
// Atributos fijos para filtrar productos (RAM, Color…). `categories` vacío = aplica a todas.
function cleanAttribute(input) {
  return {
    name: (input.name || '').trim(),
    values: Array.isArray(input.values) ? [...new Set(input.values.map((v) => String(v).trim()).filter(Boolean))] : [],
    categories: Array.isArray(input.categories) ? input.categories.filter(Boolean) : [],
  }
}
export async function listAttributes() {
  if (usingDb) return (await pool.query('SELECT data FROM attributes ORDER BY id')).rows.map((r) => r.data)
  return mem.attributes
}
export async function saveAttribute(input) {
  const clean = cleanAttribute(input)
  if (!clean.name) throw new Error('El nombre del atributo es obligatorio.')
  if (usingDb) {
    if (input.id) {
      await pool.query('UPDATE attributes SET name=$2, data=$3 WHERE id=$1', [input.id, clean.name, JSON.stringify({ ...clean, id: Number(input.id) })])
      return { ...clean, id: Number(input.id) }
    }
    const r = await pool.query('INSERT INTO attributes (name, data) VALUES ($1, $2) RETURNING id', [clean.name, JSON.stringify(clean)])
    const id = r.rows[0].id
    await pool.query('UPDATE attributes SET data=$2 WHERE id=$1', [id, JSON.stringify({ ...clean, id })])
    return { ...clean, id }
  }
  if (input.id) { const i = mem.attributes.findIndex((a) => a.id === Number(input.id)); if (i >= 0) mem.attributes[i] = { ...clean, id: Number(input.id) }; return mem.attributes[i] }
  const a = { ...clean, id: mem.aseq++ }; mem.attributes.push(a); return a
}
export async function removeAttribute(id) {
  if (usingDb) { await pool.query('DELETE FROM attributes WHERE id=$1', [id]); return true }
  mem.attributes = mem.attributes.filter((a) => a.id !== id); return true
}

/* ============================== BANNERS (carrusel home) ============================== */
function cleanBanner(input) {
  return {
    slot: input.slot === 'promo' ? 'promo' : 'hero', // hero (carrusel) | promo (bloque)
    theme: input.theme || 'blue',                 // blue | orange | green | dark | purple | navy
    badge: (input.badge || '').trim(),
    title: (input.title || '').trim(),
    accent: (input.accent || '').trim(),          // línea destacada del promo (p. ej. "desde S/ 299")
    subtitle: (input.subtitle || '').trim(),
    cta: (input.cta || '').trim(),
    link: (input.link || '/productos').trim(),
    image: input.image || '',                     // data URL (subida) o ruta /img/…
    active: input.active !== false,
  }
}
export async function listBanners() {
  if (usingDb) return (await pool.query('SELECT data FROM banners ORDER BY position, id')).rows.map((r) => r.data)
  return [...mem.banners].sort((a, b) => a.position - b.position)
}
export async function saveBanner(input) {
  const clean = cleanBanner(input)
  if (usingDb) {
    if (input.id) {
      const cur = (await pool.query('SELECT data FROM banners WHERE id=$1', [input.id])).rows[0]?.data
      if (!cur) return null
      const b = { ...cur, ...clean, id: Number(input.id) }
      b.image = keepStored(b.image, () => cur.image) // round-trip del panel: conserva el base64
      await pool.query('UPDATE banners SET active=$2, data=$3 WHERE id=$1', [b.id, b.active, JSON.stringify(b)])
      return b
    }
    const pos = (await pool.query('SELECT COALESCE(MAX(position),0)+1 AS n FROM banners')).rows[0].n
    const r = await pool.query('INSERT INTO banners (position, active, data) VALUES ($1,$2,$3) RETURNING id', [pos, clean.active, JSON.stringify(clean)])
    const id = r.rows[0].id
    const b = { ...clean, id, position: pos }
    await pool.query('UPDATE banners SET data=$2 WHERE id=$1', [id, JSON.stringify(b)])
    return b
  }
  if (input.id) {
    const i = mem.banners.findIndex((b) => b.id === Number(input.id))
    if (i < 0) return null
    const cur = mem.banners[i]
    mem.banners[i] = { ...cur, ...clean, id: Number(input.id) }
    mem.banners[i].image = keepStored(mem.banners[i].image, () => cur.image)
    return mem.banners[i]
  }
  const pos = mem.banners.length ? Math.max(...mem.banners.map((b) => b.position)) + 1 : 0
  const b = { ...clean, id: ++mem.bseq, position: pos }
  mem.banners.push(b); return b
}
export async function getBannerById(id) {
  if (usingDb) return (await pool.query('SELECT data FROM banners WHERE id=$1', [id])).rows[0]?.data || null
  return mem.banners.find((b) => b.id === Number(id)) || null
}
export async function removeBanner(id) {
  if (usingDb) { await pool.query('DELETE FROM banners WHERE id=$1', [id]); return true }
  mem.banners = mem.banners.filter((b) => b.id !== id); return true
}
export async function toggleBanner(id) {
  if (usingDb) {
    const cur = (await pool.query('SELECT data FROM banners WHERE id=$1', [id])).rows[0]?.data
    if (!cur) return null
    const b = { ...cur, active: !cur.active }
    await pool.query('UPDATE banners SET active=$2, data=$3 WHERE id=$1', [id, b.active, JSON.stringify(b)])
    return b
  }
  const b = mem.banners.find((x) => x.id === id); if (b) b.active = !b.active; return b
}
export async function moveBanner(id, dir) {
  const list = await listBanners()
  const i = list.findIndex((b) => b.id === id); const j = i + dir
  if (i < 0 || j < 0 || j >= list.length) return list
  if (usingDb) {
    await pool.query('UPDATE banners SET position=$2 WHERE id=$1', [list[i].id, j])
    await pool.query('UPDATE banners SET position=$2 WHERE id=$1', [list[j].id, i])
  } else {
    list[i].position = j; list[j].position = i
  }
  return listBanners()
}

/* ======================= PÁGINAS DE CONTENIDO ======================= */
const slugifyPage = (s) => slugify(s || '')
function cleanPage(input) {
  return {
    slug: slugifyPage(input.slug || input.title),
    title: (input.title || '').trim(),
    body: typeof input.body === 'string' ? input.body : '',
    active: input.active !== false,
  }
}
export async function listPages() {
  if (usingDb) return (await pool.query('SELECT data FROM pages ORDER BY id')).rows.map((r) => r.data)
  return [...mem.pages]
}
export async function savePage(input) {
  const clean = cleanPage(input)
  if (!clean.slug) return null
  if (usingDb) {
    // Upsert por slug: si existe la página con ese slug (o id), se actualiza.
    const cur = (await pool.query('SELECT id, data FROM pages WHERE slug=$1 OR id=$2', [clean.slug, input.id || 0])).rows[0]
    if (cur) {
      const page = { ...cur.data, ...clean, id: cur.id }
      await pool.query('UPDATE pages SET slug=$2, active=$3, data=$4 WHERE id=$1', [cur.id, page.slug, page.active, JSON.stringify(page)])
      return page
    }
    const r = await pool.query('INSERT INTO pages (slug, active, data) VALUES ($1,$2,$3) RETURNING id', [clean.slug, clean.active, JSON.stringify(clean)])
    const id = r.rows[0].id
    const page = { ...clean, id }
    await pool.query('UPDATE pages SET data=$2 WHERE id=$1', [id, JSON.stringify(page)])
    return page
  }
  const i = mem.pages.findIndex((p) => p.slug === clean.slug || (input.id && p.id === Number(input.id)))
  if (i >= 0) { mem.pages[i] = { ...mem.pages[i], ...clean, id: mem.pages[i].id }; return mem.pages[i] }
  const page = { ...clean, id: ++mem.gseq }
  mem.pages.push(page); return page
}
export async function removePage(id) {
  if (usingDb) { await pool.query('DELETE FROM pages WHERE id=$1', [id]); return true }
  mem.pages = mem.pages.filter((p) => p.id !== Number(id)); return true
}

/* ============================== USUARIOS ============================== */
export async function findUserByEmail(email) {
  if (usingDb) return (await pool.query('SELECT * FROM users WHERE email=$1', [email.toLowerCase()])).rows[0] || null
  return mem.users.find((u) => u.email === email.toLowerCase()) || null
}
