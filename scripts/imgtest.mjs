import puppeteer from 'puppeteer-core'
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const BASE = 'http://localhost:4000'
let pass = 0, fail = 0
const ok = (n) => { console.log('  ✓ ' + n); pass++ }
const ko = (n, e) => { console.log('  ✗ ' + n + ' — ' + e); fail++ }

const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox'] })
const page = await browser.newPage()
await page.setViewport({ width: 1280, height: 950 })
try {
  // login (API serves SPA on 4000)
  await page.goto(BASE + '/admin/login', { waitUntil: 'networkidle0' })
  await page.type('.adm-inp-ic input[type="email"]', 'admin@sebasperu.com')
  await page.type('.adm-inp-ic input[type="password"]', 'admin123')
  await page.click('.adm-btn.primary.block')
  await page.waitForSelector('.adm-sidebar', { timeout: 8000 })

  await page.goto(BASE + '/admin/productos', { waitUntil: 'networkidle0' })
  await page.waitForSelector('.adm-table tbody tr')
  await page.click('.adm-btn.primary') // Nuevo producto
  await page.waitForSelector('.adm-modal .adm-imgfield')

  const inputs = await page.$$('.adm-modal input:not([type=file])')
  await inputs[0].type('FOTO TEST PROD')
  await inputs[1].type('IMG-TEST-1')
  await inputs[3].type('259')   // precio
  await inputs[5].type('5')     // stock
  const selects = await page.$$('.adm-modal select')
  await selects[0].select('accesorios')

  // genera una imagen real (canvas) y la inyecta en el input file
  await page.evaluate(() => new Promise((res) => {
    const c = document.createElement('canvas'); c.width = 320; c.height = 220
    const x = c.getContext('2d'); x.fillStyle = '#1b4dd8'; x.fillRect(0, 0, 320, 220)
    x.fillStyle = '#fff'; x.font = 'bold 30px sans-serif'; x.fillText('FOTO TEST', 70, 120)
    c.toBlob((blob) => {
      const file = new File([blob], 'foto.png', { type: 'image/png' })
      const dt = new DataTransfer(); dt.items.add(file)
      const input = document.querySelector('.adm-file input[type=file]')
      input.files = dt.files
      input.dispatchEvent(new Event('change', { bubbles: true }))
      res()
    }, 'image/png')
  }))
  await page.waitForSelector('.adm-imgpreview img', { timeout: 5000 })
  ok('Upload: vista previa muestra la imagen subida (<img>)')

  await page.click('.adm-modal .adm-form-foot .adm-btn.primary') // Crear producto
  await page.waitForFunction(() => [...document.querySelectorAll('.adm-table tbody tr')].some((r) => r.textContent.includes('FOTO TEST PROD')), { timeout: 8000 })
  ok('Guardado: el producto aparece en la tabla')

  const thumbIsImg = await page.evaluate(() => {
    const row = [...document.querySelectorAll('.adm-table tbody tr')].find((r) => r.textContent.includes('FOTO TEST PROD'))
    const img = row?.querySelector('.adm-prodthumb img')
    return !!img && img.src.startsWith('data:image')
  })
  thumbIsImg ? ok('Render: la miniatura es un <img> con data URL') : ko('Render miniatura', 'no es img data')

  await page.screenshot({ path: 'c:/Users/Administrator/Downloads/Pictures/ecsite/img_upload.png' })

  // Verifica persistencia en la API (Supabase)
  const list = await fetch(BASE + '/api/products').then((r) => r.json())
  const created = list.find((p) => p.sku === 'IMG-TEST-1')
  assertTruthy(created, 'API: producto persistido')
  const imgOk = created && typeof created.image === 'string' && created.image.startsWith('data:image')
  imgOk ? ok('Persistencia: imagen guardada en la BD (data URL)') : ko('Persistencia imagen', 'no data URL')

  // limpieza
  const tok = (await fetch(BASE + '/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: 'admin@sebasperu.com', password: 'admin123' }) }).then((r) => r.json())).token
  if (created) await fetch(`${BASE}/api/products/${created.id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${tok}` } })
  ok('Limpieza: producto de prueba eliminado')
} catch (e) { ko('excepción', e.message) }
finally { await browser.close(); console.log(`\nIMG: ${pass} passed, ${fail} failed`); process.exit(fail ? 1 : 0) }

function assertTruthy(v, n) { v ? ok(n) : ko(n, 'falsy') }
