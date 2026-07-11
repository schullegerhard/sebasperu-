// Migración + siembra automática. Crea las tablas (idempotente) y siembra
// el catálogo si la BD está vacía. Permite usar Supabase sin psql instalado.
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import bcrypt from 'bcryptjs'
import { products, categories } from './catalog.js'
import { USERS, COUPONS, CUSTOMERS, ORDERS, SETTINGS } from './seed-data.js'
import { PAGES_SEED } from './pages-seed.js'

const here = dirname(fileURLToPath(import.meta.url))
const schemaSql = readFileSync(resolve(here, '../db/schema.sql'), 'utf8')

export async function ensureSchema(pool) {
  await pool.query(schemaSql) // CREATE TABLE IF NOT EXISTS … (idempotente)
  // Columnas nuevas en tablas existentes (idempotente): cuenta de cliente.
  await pool.query('ALTER TABLE customers ADD COLUMN IF NOT EXISTS password_hash TEXT')
  const { rows } = await pool.query('SELECT COUNT(*)::int AS n FROM products')
  if (rows[0].n === 0) { await seedAll(pool); console.log('🌱 Base de datos sembrada (catálogo + usuarios).') }
  // Siembra las páginas de contenido si la tabla está vacía (idempotente): así
  // la BD actual y los despliegues nuevos tienen las páginas editables.
  const pc = await pool.query('SELECT COUNT(*)::int AS n FROM pages')
  if (pc.rows[0].n === 0) { await seedPages(pool); console.log('🌱 Páginas de contenido sembradas.') }
}

async function seedPages(pool) {
  for (const p of PAGES_SEED) {
    const data = { slug: p.slug, title: p.title, body: p.body, active: true }
    const r = await pool.query('INSERT INTO pages (slug, active, data) VALUES ($1,$2,$3) ON CONFLICT (slug) DO NOTHING RETURNING id', [p.slug, true, JSON.stringify(data)])
    if (r.rows[0]) await pool.query('UPDATE pages SET data = jsonb_set(data, \'{id}\', to_jsonb(id)) WHERE id=$1', [r.rows[0].id])
  }
}

export async function seedAll(pool, { force = false } = {}) {
  const c = await pool.connect()
  try {
    await c.query('BEGIN')
    if (force) await c.query('TRUNCATE products, categories, users, coupons, customers, orders, settings RESTART IDENTITY CASCADE')

    for (let i = 0; i < categories.length; i++) {
      const cat = categories[i]
      await c.query('INSERT INTO categories (slug,name,position,data) VALUES ($1,$2,$3,$4) ON CONFLICT (slug) DO NOTHING', [cat.slug, cat.name, i, JSON.stringify(cat)])
    }
    for (const p of products) {
      await c.query(
        `INSERT INTO products (id,slug,sku,name,brand,category,subcategory,price,old_price,stock,rating,reviews,data)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) ON CONFLICT (id) DO NOTHING`,
        [p.id, p.slug, p.sku, p.name, p.brand, p.category, p.subcategory, p.price, p.oldPrice || null, p.stock, p.rating, p.reviews, JSON.stringify(p)])
    }
    for (const [name, email, pass, role] of USERS) {
      await c.query('INSERT INTO users (name,email,password_hash,role) VALUES ($1,$2,$3,$4) ON CONFLICT (email) DO NOTHING', [name, email, bcrypt.hashSync(pass, 8), role])
    }
    for (const [code, type, value, expires, active, uses, minBuy] of COUPONS) {
      await c.query('INSERT INTO coupons (code,type,value,expires,active,uses,min_buy) VALUES ($1,$2,$3,$4,$5,$6,$7) ON CONFLICT (code) DO NOTHING', [code, type, value, expires, active, uses, minBuy])
    }
    for (const [name, email, phone, type, since] of CUSTOMERS) {
      await c.query('INSERT INTO customers (name,email,phone,type,since) VALUES ($1,$2,$3,$4,$5) ON CONFLICT (email) DO NOTHING', [name, email, phone, type, since])
    }
    for (const [code, customer, email, total, status, payment, region, date, items] of ORDERS) {
      await c.query('INSERT INTO orders (code,customer,email,total,status,payment,region,date,items) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) ON CONFLICT (code) DO NOTHING', [code, customer, email, total, status, payment, region, date, JSON.stringify(items)])
    }
    await c.query('INSERT INTO settings (id,data) VALUES (1,$1) ON CONFLICT (id) DO UPDATE SET data=$1', [JSON.stringify(SETTINGS)])
    await c.query('COMMIT')
  } catch (e) { await c.query('ROLLBACK'); throw e } finally { c.release() }
}
