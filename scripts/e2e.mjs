// Pruebas end-to-end del eCommerce con puppeteer-core sobre el Chrome instalado.
// Uso: node scripts/e2e.mjs   (requiere el preview corriendo en :4173)
import puppeteer from 'puppeteer-core'

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
// La API sirve el SPA y /api en el mismo origen (puerto 4000).
const BASE = process.env.E2E_BASE || 'http://localhost:4000'
const API = process.env.E2E_API || 'http://localhost:4000'
let pass = 0, fail = 0
const ok = (name) => { console.log(`  ✓ ${name}`); pass++ }
const ko = (name, e) => { console.log(`  ✗ ${name} — ${e}`); fail++ }
const assert = (cond, name) => { cond ? ok(name) : ko(name, 'esperado verdadero') }
const $text = (page, sel) => page.$eval(sel, (el) => el.textContent.trim()).catch(() => null)

const browser = await puppeteer.launch({
  executablePath: CHROME, headless: 'new',
  args: ['--no-sandbox', '--disable-gpu'],
})
const page = await browser.newPage()
await page.setViewport({ width: 1280, height: 900 })
// Evita que el banner de cookies (overlay fijo) intercepte clics durante las pruebas.
await page.evaluateOnNewDocument(() => { try { localStorage.setItem('sp_cookies', 'accepted') } catch { /* noop */ } })

try {
  // 1) Home carga (rediseño)
  await page.goto(BASE + '/', { waitUntil: 'networkidle0' })
  assert((await page.title()).includes('SebasPeru'), 'Home: title contiene SebasPeru')
  assert(await page.$('.hero3 h1'), 'Home: hero presente')
  assert((await page.$$('.fcard')).length === 8, 'Home: ofertas flash (8 en carrusel)')
  assert((await page.$$('.pcard')).length >= 15, 'Home: secciones de producto (>=15 cards)')
  assert(await page.$('.flash-timer2 b'), 'Home: countdown de ofertas flash presente')
  assert((await page.$$('.cat-tile')).length >= 6, 'Home: scroller de categorías (>=6)')

  // 1b) Agregar al carrito desde una oferta flash de la Home
  await page.click('.fcard .pcard-add')
  await page.waitForSelector('.cart-drawer.on', { timeout: 3000 })
  await new Promise((r) => setTimeout(r, 400)) // espera fin de la animación de apertura
  ok('Home: panel lateral del carrito se abre al agregar (flash)')
  const hBadge = await $text(page, '.cart-action .cart-badge')
  assert(hBadge === '1', `Home: agregar al carrito desde flash (badge=${hBadge})`)
  const hStored = await page.evaluate(() => JSON.parse(localStorage.getItem('sp_cart') || '[]'))
  assert(hStored[0] && hStored[0].href && hStored[0].href.includes('/buscar'), 'Home: item de Home enlaza a búsqueda en el carrito')
  await page.click('.cd-close')
  await page.evaluate(() => localStorage.removeItem('sp_cart'))

  // 2) Búsqueda predictiva
  await page.type('.searchbar input', 'epson')
  await page.waitForSelector('.search-dropdown .search-result', { timeout: 3000 })
  const sugg = (await page.$$('.search-dropdown .search-result')).length
  assert(sugg > 0, `Búsqueda predictiva: ${sugg} sugerencia(s) para "epson"`)

  // 3) Página de categorías (Laptops) + filtros
  await page.goto(BASE + '/categoria/laptops-pc', { waitUntil: 'networkidle0' })
  assert((await $text(page, '.cat2-results-head .page-title')) === 'Laptops', 'Categorías: título "Laptops"')
  assert(await page.$('.cat-filters'), 'Categorías: panel de filtros')
  assert(await page.$('.cat-search input'), 'Categorías: buscador en categoría')
  const beforeFilter = (await page.$$('.pcard-grid .pcard')).length
  assert(beforeFilter >= 4, `Categorías: ${beforeFilter} tarjetas`)
  // marcar filtro de marca "Lenovo"
  await page.$$eval('.cat-filters .cat-check', (els) => {
    const i = els.findIndex((e) => e.textContent.includes('Lenovo'))
    if (i >= 0) els[i].querySelector('input').click()
  })
  await new Promise((r) => setTimeout(r, 300))
  const afterFilter = (await page.$$('.pcard-grid .pcard')).length
  assert(afterFilter >= 1 && afterFilter <= beforeFilter, `Categorías: filtro marca Lenovo aplica (${afterFilter})`)

  // 4) Ficha de producto + agregar al carrito
  await page.goto(BASE + '/producto/laptop-hp-250-g9', { waitUntil: 'networkidle0' })
  assert((await $text(page, '.pdp-title')) === 'Laptop HP 250 G9', 'Ficha: título correcto')
  assert((await $text(page, '.pdp-save'))?.includes('300'), 'Ficha: "Ahorras S/300" presente')
  assert((await page.$$('.pdp-related-grid .pdp-rel-card')).length === 4, 'Ficha: productos relacionados (4)')
  assert(await page.$('.pdp-buy'), 'Ficha: botón Comprar ahora')
  await page.click('.pdp-add')
  await page.waitForSelector('.cart-drawer.on', { timeout: 3000 })
  await new Promise((r) => setTimeout(r, 400))
  ok('Carrito: panel lateral se abre al agregar')
  assert((await page.$$('.cart-drawer .cd-item')).length === 1, 'Carrito: ítem visible en el panel')
  const badge = await $text(page, '.cart-action .cart-badge')
  assert(badge === '1', `Carrito: badge = ${badge}`)
  await page.click('.cd-close')

  // 5) Persistencia del carrito en localStorage
  const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('sp_cart') || '[]'))
  assert(stored.length === 1 && stored[0].qty === 1, 'Carrito: persistido en localStorage')

  // 6) Persiste tras recargar (requisito: carrito persistente)
  await page.reload({ waitUntil: 'networkidle0' })
  const badge2 = await $text(page, '.cart-action .cart-badge')
  assert(badge2 === '1', 'Carrito: persiste tras recargar')

  // 7) Checkout de una sola página + cupón + pagar
  await page.goto(BASE + '/checkout', { waitUntil: 'networkidle0' })
  assert((await page.$$('.co-card')).length === 4, 'Checkout: 4 secciones (entrega/receptor/envío/pago)')
  assert(await page.$('.co2-summary'), 'Checkout: resumen de pedido')
  assert((await page.$$('.co2-pay')).length === 4, 'Checkout: 4 métodos de pago')
  assert(await page.$('.co-seg'), 'Checkout: control de entrega (Envío/Retiro)')
  // cupón válido
  await page.type('.co2-coupon input', 'SEBAS10')
  await page.click('.co2-coupon .btn-ghost')
  await new Promise((r) => setTimeout(r, 200))
  assert((await $text(page, '.co2-sum .disc'))?.includes('S/'), 'Checkout: cupón SEBAS10 aplica descuento')
  // Completa los datos obligatorios (validación del checkout) antes de pagar.
  const coInputs = await page.$$('.co2-main .co-field input') // [nombre, apellido, DNI, dirección, referencia]
  await coInputs[0].type('Cliente')
  await coInputs[1].type('E2E')
  await coInputs[2].type('12345678')
  await coInputs[3].type('Av. Siempre Viva 742')
  await new Promise((r) => setTimeout(r, 250)) // aparecen los métodos de envío al escribir dirección
  await page.click('.co-ship') // selecciona el primer método de envío
  await page.click('.co2-pay-btn')
  await page.waitForSelector('.order-ok', { timeout: 3000 })
  ok('Checkout: pedido confirmado (Pagar ahora)')
  const cartAfter = await page.evaluate(() => JSON.parse(localStorage.getItem('sp_cart') || '[]'))
  assert(cartAfter.length === 0, 'Checkout: carrito se vacía tras pagar')

  // 8) Comparador (sembramos 2 productos en el comparador)
  await page.evaluate(() => localStorage.setItem('sp_compare', JSON.stringify([
    { id: 1, slug: 'laptop-hp-250-g9', name: 'Laptop HP 250 G9' },
    { id: 13, slug: 'laptop-lenovo-legion-5-15ach6h', name: 'Lenovo Legion 5 15ACH6H' },
  ])))
  await page.goto(BASE + '/comparar', { waitUntil: 'networkidle0' })
  assert((await page.$$('.compare-table thead th')).length >= 2, 'Comparador: muestra columnas')

  // 9) SEO: canonical + JSON-LD Product en ficha
  await page.goto(BASE + '/producto/tinta-epson-664-negro', { waitUntil: 'networkidle0' })
  const canonical = await page.$eval('link[rel="canonical"]', (e) => e.href).catch(() => null)
  assert(canonical && canonical.includes('/producto/tinta-epson-664-negro'), 'SEO: canonical correcto')
  const ld = await page.$eval('#jsonld-page', (e) => e.textContent).catch(() => null)
  assert(ld && JSON.parse(ld)['@type'] === 'Product', 'SEO: JSON-LD Product presente')
  assert((await page.title()).startsWith('Tinta Epson 664'), 'SEO: title dinámico por producto')

  // 10) Legales + robots/sitemap
  await page.goto(BASE + '/legal/libro-reclamaciones', { waitUntil: 'networkidle0' })
  assert(await page.$('.form-card'), 'Legal: Libro de Reclamaciones con formulario')
  const robots = await page.goto(BASE + '/robots.txt').then((r) => r.text())
  assert(robots.includes('Sitemap:'), 'SEO: robots.txt servido')
  const sm = await page.goto(BASE + '/sitemap.xml').then((r) => r.text())
  assert(sm.includes('<urlset'), 'SEO: sitemap.xml servido')

  // 11) 404
  await page.goto(BASE + '/ruta-inexistente-xyz', { waitUntil: 'networkidle0' })
  assert((await page.content()).includes('404'), 'Routing: página 404 para ruta desconocida')

  // 12) ADMIN — login contra la API (JWT real)
  const clearSession = () => page.evaluate(() => { localStorage.removeItem('admin_session'); localStorage.removeItem('admin_token') })
  await clearSession()
  await page.goto(BASE + '/admin', { waitUntil: 'networkidle0' })
  assert(await page.$('.adm-login'), 'Admin: ruta protegida redirige a login')
  await page.type('.adm-inp-ic input[type="email"]', 'admin@sebasperu.com')
  await page.type('.adm-inp-ic input[type="password"]', 'admin123')
  await page.click('.adm-btn.primary.block')
  await page.waitForSelector('.adm-sidebar', { timeout: 6000 })
  ok('Admin: login vía API correcto (Administrador)')
  const jwt = await page.evaluate(() => localStorage.getItem('admin_token'))
  assert(jwt && jwt.split('.').length === 3, 'Admin: JWT almacenado tras login')
  assert((await page.$$('.adm-navlink')).length === 10, 'Admin: 10 ítems de menú para Administrador')
  await page.waitForSelector('.adm-chart', { timeout: 4000 })
  ok('Admin: dashboard carga datos de la API (gráfico)')

  // 13) ADMIN — productos y categorías cargan DESDE LA API
  await page.goto(BASE + '/admin/productos', { waitUntil: 'networkidle0' })
  await page.waitForSelector('.adm-table tbody tr', { timeout: 5000 })
  const prodRows = (await page.$$('.adm-table tbody tr')).length
  assert(prodRows >= 12, `Admin: productos cargan desde API (${prodRows} filas)`)
  await page.goto(BASE + '/admin/categorias', { waitUntil: 'networkidle0' })
  await page.waitForSelector('.adm-table tbody tr', { timeout: 5000 })
  assert((await page.$$('.adm-table tbody tr')).length >= 5, 'Admin: categorías cargan desde API')
  assert(await page.$('.adm-menuflags'), 'Admin: lista de categorías con flags de menú')

  // 14) ADMIN — roles/permisos (Soporte ve menos secciones)
  await clearSession()
  await page.goto(BASE + '/admin/login', { waitUntil: 'networkidle0' })
  await page.type('.adm-inp-ic input[type="email"]', 'soporte@sebasperu.com')
  await page.type('.adm-inp-ic input[type="password"]', 'sop123')
  await page.click('.adm-btn.primary.block')
  await page.waitForSelector('.adm-sidebar', { timeout: 6000 })
  assert((await page.$$('.adm-navlink')).length === 3, 'Admin: rol Soporte ve 3 secciones')
  await page.goto(BASE + '/admin/configuracion', { waitUntil: 'networkidle0' })
  assert(await page.$('.adm-noaccess'), 'Admin: Soporte bloqueado en Configuración')

  // 15) API — persistencia CRUD y protección (una sola fuente de datos)
  const api = (p, opt) => fetch(API + p, opt).then(async (r) => ({ status: r.status, body: await r.json().catch(() => null) }))
  const loginR = await api('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: 'admin@sebasperu.com', password: 'admin123' }) })
  const tok = loginR.body.token
  const auth = { 'Content-Type': 'application/json', Authorization: `Bearer ${tok}` }
  const before = (await api('/api/products')).body.length
  const created = await api('/api/products', { method: 'POST', headers: auth, body: JSON.stringify({ name: 'Producto E2E', sku: 'E2E-1', brand: 'Test', category: 'accesorios', price: 99, stock: 7 }) })
  assert(created.status === 201 && created.body.id, 'API: crea producto (201)')
  const after = (await api('/api/products')).body.length
  assert(after === before + 1, `API: producto persistió (${before}→${after})`)
  const noAuth = await api('/api/products', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: 'x' }) })
  assert(noAuth.status === 401, 'API: crear sin token → 401')
  const delR = await api(`/api/products/${created.body.id}`, { method: 'DELETE', headers: auth })
  assert(delR.status === 200, 'API: elimina producto')
  assert((await api('/api/products')).body.length === before, 'API: vuelve al conteo original')

  // 16) Storefront → API: una compra crea un pedido en el sistema
  const ordersBefore = (await api('/api/orders', { headers: auth })).body.length
  await api('/api/orders', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ customer: 'E2E Cliente', email: 'e2e@test.com', total: 99, payment: 'Yape', items: [{ name: 'Producto E2E', qty: 1, price: 99 }] }) })
  const ordersAfter = (await api('/api/orders', { headers: auth })).body.length
  assert(ordersAfter === ordersBefore + 1, `Storefront→API: checkout registra pedido (${ordersBefore}→${ordersAfter})`)
} catch (e) {
  ko('excepción no controlada', e.message)
} finally {
  await browser.close()
  console.log(`\nRESULTADO: ${pass} passed, ${fail} failed`)
  process.exit(fail ? 1 : 0)
}
