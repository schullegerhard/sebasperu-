import puppeteer from 'puppeteer-core'
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const OUT = 'c:/Users/Administrator/Downloads/Pictures/ecsite/'
const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox'] })
const page = await browser.newPage()
await page.setViewport({ width: 1380, height: 920 })
await page.goto('http://localhost:4173/admin/login', { waitUntil: 'networkidle0' })
await page.type('.adm-inp-ic input[type="email"]', 'admin@sebasperu.com')
await page.type('.adm-inp-ic input[type="password"]', 'admin123')
await page.click('.adm-btn.primary.block')
await page.waitForSelector('.adm-chart', { timeout: 6000 })
await new Promise((r) => setTimeout(r, 500))
await page.screenshot({ path: OUT + 'adm_live.png' })
console.log('saved adm_live.png')
await browser.close()
