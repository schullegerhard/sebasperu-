import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import { fileURLToPath } from 'node:url'
import { dirname, resolve, join } from 'node:path'
import { existsSync } from 'node:fs'
import {
  initStore, usingDb,
  listProducts, getProductBySlug, productsByCategory, createProduct, updateProduct, removeProduct, setStock,
  listCategories, getCategoryBySlug, createCategory, updateCategory, removeCategory, addSubcategory, removeSubcategory, moveCategory,
  listOrders, createOrder, setOrderStatus,
  listCustomers, listCoupons, saveCoupon, removeCoupon, toggleCoupon, getSettings, saveSettings,
  listAttributes, saveAttribute, removeAttribute,
  listBanners, saveBanner, removeBanner, toggleBanner, moveBanner,
  listPages, savePage, removePage,
} from './store.js'
import { login, requireAuth, requireRole } from './auth.js'

const app = express()
// CORS configurable: CORS_ORIGIN="https://tu-tienda.com,https://admin.tu-tienda.com" o "*".
const origins = (process.env.CORS_ORIGIN || '*').split(',').map((s) => s.trim())
app.use(cors({ origin: origins.includes('*') ? true : origins }))
app.use(express.json({ limit: '8mb' })) // permite imágenes de producto (data URL) en el cuerpo
app.use(morgan('dev'))

const ok = (res, data) => res.json(data)
const wrap = (fn) => (req, res) => Promise.resolve(fn(req, res)).catch((e) => { console.error(e); res.status(500).json({ error: e.message }) })

/* --------------------------- salud + auth --------------------------- */
app.get('/api/health', (req, res) => res.json({ status: 'ok', db: usingDb ? 'postgres' : 'memory', time: new Date().toISOString() }))
app.post('/api/auth/login', wrap(async (req, res) => {
  const { email, password } = req.body || {}
  const r = await login(email, password)
  return r ? ok(res, r) : res.status(401).json({ error: 'Credenciales inválidas' })
}))
app.get('/api/me', requireAuth, (req, res) => res.json(req.user))

/* ----------------------- PRODUCTOS (lectura pública) ----------------------- */
app.get('/api/products', wrap(async (req, res) => ok(res, await listProducts())))
app.get('/api/products/:slug', wrap(async (req, res) => {
  const p = await getProductBySlug(req.params.slug)
  return p ? ok(res, p) : res.status(404).json({ error: 'Producto no encontrado' })
}))
// Escritura (solo Administrador; stock también Almacén)
app.post('/api/products', requireAuth, requireRole(), wrap(async (req, res) => res.status(201).json(await createProduct(req.body))))
app.put('/api/products/:id', requireAuth, requireRole(), wrap(async (req, res) => {
  const p = await updateProduct(Number(req.params.id), req.body)
  return p ? ok(res, p) : res.status(404).json({ error: 'No encontrado' })
}))
app.delete('/api/products/:id', requireAuth, requireRole(), wrap(async (req, res) => { await removeProduct(Number(req.params.id)); res.json({ ok: true }) }))
app.patch('/api/products/:id/stock', requireAuth, requireRole('Almacén'), wrap(async (req, res) => ok(res, await setStock(Number(req.params.id), Number(req.body.stock)))))

/* ----------------------- CATEGORÍAS (lectura pública) ----------------------- */
app.get('/api/categories', wrap(async (req, res) => ok(res, await listCategories())))
app.get('/api/categories/:slug', wrap(async (req, res) => {
  const c = await getCategoryBySlug(req.params.slug)
  return c ? ok(res, c) : res.status(404).json({ error: 'Categoría no encontrada' })
}))
app.get('/api/categories/:slug/products', wrap(async (req, res) => ok(res, await productsByCategory(req.params.slug))))
app.post('/api/categories', requireAuth, requireRole(), wrap(async (req, res) => res.status(201).json(await createCategory(req.body))))
app.put('/api/categories/:slug', requireAuth, requireRole(), wrap(async (req, res) => ok(res, await updateCategory(req.params.slug, req.body))))
app.delete('/api/categories/:slug', requireAuth, requireRole(), wrap(async (req, res) => { await removeCategory(req.params.slug); res.json({ ok: true }) }))
app.post('/api/categories/:slug/subcategories', requireAuth, requireRole(), wrap(async (req, res) => ok(res, await addSubcategory(req.params.slug, req.body.name))))
app.delete('/api/categories/:slug/subcategories/:sub', requireAuth, requireRole(), wrap(async (req, res) => ok(res, await removeSubcategory(req.params.slug, req.params.sub))))
app.patch('/api/categories/:slug/move', requireAuth, requireRole(), wrap(async (req, res) => ok(res, await moveCategory(req.params.slug, Number(req.body.dir)))))

/* ------------------------------- PEDIDOS ------------------------------- */
app.post('/api/orders', wrap(async (req, res) => {
  const { customer, email, total, payment, region, date, items } = req.body || {}
  if (!total || !items) return res.status(400).json({ error: 'Faltan campos del pedido' })
  res.status(201).json(await createOrder({ customer: customer || 'Invitado', email: email || '—', total, payment: payment || 'N/D', region: region || 'Lima', date: date || new Date().toISOString().slice(0, 10), items }))
}))
app.get('/api/orders', requireAuth, requireRole('Vendedor', 'Almacén', 'Soporte'), wrap(async (req, res) => ok(res, await listOrders())))
app.patch('/api/orders/:id/status', requireAuth, requireRole('Almacén'), wrap(async (req, res) => ok(res, await setOrderStatus(Number(req.params.id), req.body.status))))

/* ------------------------ CLIENTES / CUPONES / CONFIG ------------------------ */
app.get('/api/customers', requireAuth, requireRole('Vendedor', 'Soporte'), wrap(async (req, res) => ok(res, await listCustomers())))

app.get('/api/coupons', requireAuth, requireRole('Marketing'), wrap(async (req, res) => ok(res, await listCoupons())))
app.post('/api/coupons', requireAuth, requireRole('Marketing'), wrap(async (req, res) => res.status(201).json(await saveCoupon(req.body))))
app.put('/api/coupons/:id', requireAuth, requireRole('Marketing'), wrap(async (req, res) => ok(res, await saveCoupon({ ...req.body, id: Number(req.params.id) }))))
app.delete('/api/coupons/:id', requireAuth, requireRole('Marketing'), wrap(async (req, res) => { await removeCoupon(Number(req.params.id)); res.json({ ok: true }) }))
app.patch('/api/coupons/:id/toggle', requireAuth, requireRole('Marketing'), wrap(async (req, res) => ok(res, await toggleCoupon(Number(req.params.id)))))

app.get('/api/settings', requireAuth, wrap(async (req, res) => ok(res, await getSettings())))
app.put('/api/settings', requireAuth, requireRole('Marketing'), wrap(async (req, res) => ok(res, await saveSettings(req.body))))

// Atributos fijos para filtrar (lectura pública para la tienda; escritura solo Administrador).
app.get('/api/attributes', wrap(async (req, res) => ok(res, await listAttributes())))
app.post('/api/attributes', requireAuth, requireRole(), wrap(async (req, res) => res.status(201).json(await saveAttribute(req.body))))
app.put('/api/attributes/:id', requireAuth, requireRole(), wrap(async (req, res) => ok(res, await saveAttribute({ ...req.body, id: Number(req.params.id) }))))
app.delete('/api/attributes/:id', requireAuth, requireRole(), wrap(async (req, res) => { await removeAttribute(Number(req.params.id)); res.json({ ok: true }) }))

// Banners del carrusel principal (lectura pública para la tienda; escritura Marketing).
app.get('/api/banners', wrap(async (req, res) => ok(res, await listBanners())))
app.post('/api/banners', requireAuth, requireRole('Marketing'), wrap(async (req, res) => res.status(201).json(await saveBanner(req.body))))
app.put('/api/banners/:id', requireAuth, requireRole('Marketing'), wrap(async (req, res) => ok(res, await saveBanner({ ...req.body, id: Number(req.params.id) }))))
app.delete('/api/banners/:id', requireAuth, requireRole('Marketing'), wrap(async (req, res) => { await removeBanner(Number(req.params.id)); res.json({ ok: true }) }))
app.patch('/api/banners/:id/toggle', requireAuth, requireRole('Marketing'), wrap(async (req, res) => ok(res, await toggleBanner(Number(req.params.id)))))
app.patch('/api/banners/:id/move', requireAuth, requireRole('Marketing'), wrap(async (req, res) => ok(res, await moveBanner(Number(req.params.id), Number(req.body.dir)))))

// Páginas de contenido (legales/institucionales): lectura pública, escritura Marketing.
app.get('/api/pages', wrap(async (req, res) => ok(res, await listPages())))
app.post('/api/pages', requireAuth, requireRole('Marketing'), wrap(async (req, res) => res.status(201).json(await savePage(req.body))))
app.put('/api/pages/:id', requireAuth, requireRole('Marketing'), wrap(async (req, res) => ok(res, await savePage({ ...req.body, id: Number(req.params.id) }))))
app.delete('/api/pages/:id', requireAuth, requireRole('Marketing'), wrap(async (req, res) => { await removePage(Number(req.params.id)); res.json({ ok: true }) }))

// Sirve el front-end (build de Vite) en el mismo origen, si existe el dist.
// Así un solo dominio expone la tienda/admin (SPA) y la API (/api/*).
const dist = resolve(dirname(fileURLToPath(import.meta.url)), '../../dist')
if (existsSync(dist)) {
  app.use(express.static(dist))
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next()
    res.sendFile(join(dist, 'index.html'))
  })
  console.log('🖥️  Sirviendo front-end (SPA) desde /dist')
}

const PORT = process.env.PORT || 4000
initStore().then(() => {
  app.listen(PORT, () => console.log(`🚀 API SebasPeru en http://localhost:${PORT}  (modo: ${usingDb ? 'postgres' : 'memoria'})`))
})
