import puppeteer from 'puppeteer-core'
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const BASE = 'http://localhost:4000'
let pass = 0, fail = 0
const ok = (n) => { console.log('  ✓ ' + n); pass++ }
const ko = (n, e) => { console.log('  ✗ ' + n + ' — ' + e); fail++ }
const aok = (c, n) => c ? ok(n) : ko(n, 'falló')

const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox'] })
const page = await browser.newPage()
await page.setViewport({ width: 1280, height: 950 })
const clickText = (sel, text) => page.evaluate((s, t) => { const el = [...document.querySelectorAll(s)].find((x) => x.textContent.trim() === t); el && el.click() }, sel, text)

try {
  await page.goto(BASE + '/admin/login', { waitUntil: 'networkidle0' })
  await page.type('.adm-inp-ic input[type="email"]', 'admin@sebasperu.com')
  await page.type('.adm-inp-ic input[type="password"]', 'admin123')
  await page.click('.adm-btn.primary.block')
  await page.waitForSelector('.adm-sidebar', { timeout: 8000 })
  const tok = (await fetch(BASE + '/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: 'admin@sebasperu.com', password: 'admin123' }) }).then((r) => r.json())).token

  /* ---------- CATEGORÍA ---------- */
  await page.goto(BASE + '/admin/categorias', { waitUntil: 'networkidle0' })
  await page.waitForSelector('.adm-table tbody tr')
  await page.click('.adm-btn.primary')
  await page.waitForSelector('.adm-modal .fld-tabs')
  await page.type('.adm-modal input', 'Cat Test SEO')                 // Nombre (1er input)
  ok('Categoría: nombre escrito (slug se autogenera)')
  // parent via SearchSelect
  await page.click('.fld-ss-btn'); await page.waitForSelector('.fld-ss-pop')
  await clickText('.fld-ss-opt', 'Impresoras')
  // descripción rich text
  await page.click('.rt-area'); await page.keyboard.type('Descripción enriquecida de prueba')
  // SEO tab
  await clickText('.fld-tabs button', 'SEO')
  await page.waitForSelector('.adm-form-grid'); await new Promise((r) => setTimeout(r, 150))
  await page.type('.adm-modal input', 'Meta Title Cat Test')          // 1er input del tab SEO = keyword? -> es Keyword. Ajuste abajo
  // Visibilidad tab → footer on
  await clickText('.fld-tabs button', 'Visibilidad')
  await new Promise((r) => setTimeout(r, 150))
  await clickText('.fld-toggle span', 'Mostrar en Footer')
  await page.click('.adm-form-foot .adm-btn.primary')
  await page.waitForFunction(() => [...document.querySelectorAll('.adm-table tbody tr')].some((r) => r.textContent.includes('Cat Test SEO')), { timeout: 8000 })
  ok('Categoría: aparece en la lista tras guardar')

  const cats = await fetch(BASE + '/api/categories').then((r) => r.json())
  const cat = cats.find((c) => c.slug === 'cat-test-seo')
  aok(cat, 'Categoría: persistida en Supabase')
  aok(cat && cat.parent === 'impresoras', 'Categoría: campo "padre" persistido')
  aok(cat && (cat.description || '').includes('enriquecida'), 'Categoría: descripción enriquecida persistida')
  aok(cat && cat.showFooter === true, 'Categoría: flag "Mostrar en Footer" persistido')
  aok(cat && cat.seo && typeof cat.seo.robots === 'string', 'Categoría: bloque SEO persistido')

  /* ---------- PRODUCTO ---------- */
  await page.goto(BASE + '/admin/productos', { waitUntil: 'networkidle0' })
  await page.waitForSelector('.adm-table tbody tr')
  await page.click('.adm-btn.primary')
  await page.waitForSelector('.adm-modal .fld-tabs')
  const gi = await page.$$('.adm-modal input:not([type=file])')
  await gi[0].type('Prod Test Full')   // nombre
  await gi[2].type('PTF-1')            // SKU (0 nombre,1 slug,2 sku)
  await (await page.$$('.adm-modal select'))[1].select('accesorios') // category (0 status,1 categoria)
  // etiqueta
  await page.click('.fld-tags input'); await page.keyboard.type('gamer'); await page.keyboard.press('Enter')
  // precios e inventario
  await clickText('.fld-tabs button', 'Precios e inventario')
  await new Promise((r) => setTimeout(r, 150))
  const pi = await page.$$('.adm-modal input[type=number]')
  await pi[0].type('199')   // precio regular
  // atributos
  await clickText('.fld-tabs button', 'Atributos')
  await new Promise((r) => setTimeout(r, 150))
  await clickText('.fld-attrs .adm-link, .adm-link', 'Agregar atributo')
  await new Promise((r) => setTimeout(r, 150))
  const ar = await page.$$('.fld-attr-row input')
  await ar[0].type('RAM'); await ar[1].type('16GB')
  // stock (volver a inventario)
  await clickText('.fld-tabs button', 'Precios e inventario')
  await new Promise((r) => setTimeout(r, 150))
  const pi2 = await page.$$('.adm-modal input[type=number]')
  await pi2[pi2.length - 2].type('7')  // stock (penúltimo number: stock, último minStock)
  await page.click('.adm-form-foot .adm-btn.primary')
  await page.waitForFunction(() => [...document.querySelectorAll('.adm-table tbody tr')].some((r) => r.textContent.includes('Prod Test Full')), { timeout: 8000 })
  ok('Producto: aparece en la lista tras guardar')

  const prods = await fetch(BASE + '/api/products').then((r) => r.json())
  const prod = prods.find((p) => p.sku === 'PTF-1')
  aok(prod, 'Producto: persistido en Supabase')
  aok(prod && Array.isArray(prod.tags) && prod.tags.includes('gamer'), 'Producto: etiquetas persistidas')
  aok(prod && Array.isArray(prod.attributes) && prod.attributes.some((a) => a.name === 'RAM'), 'Producto: atributos persistidos')
  aok(prod && prod.slug === 'prod-test-full', 'Producto: slug autogenerado persistido')

  // cleanup
  if (cat) await fetch(`${BASE}/api/categories/cat-test-seo`, { method: 'DELETE', headers: { Authorization: `Bearer ${tok}` } })
  if (prod) await fetch(`${BASE}/api/products/${prod.id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${tok}` } })
  ok('Limpieza: categoría y producto de prueba eliminados')
} catch (e) { ko('excepción', e.message) }
finally { await browser.close(); console.log(`\nMÓDULOS: ${pass} passed, ${fail} failed`); process.exit(fail ? 1 : 0) }
