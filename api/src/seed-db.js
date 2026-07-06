// Resiembra forzada de la base de datos (borra y recarga el catálogo).
// Uso: npm run db:seed   (requiere DATABASE_URL en .env)
import 'dotenv/config'
import pg from 'pg'
import { seedAll } from './migrate.js'

const url = process.env.DATABASE_URL
if (!url) { console.error('Define DATABASE_URL en .env'); process.exit(1) }
const isLocal = /@(localhost|127\.0\.0\.1)[:/]/.test(url)
const pool = new pg.Pool({ connectionString: url, ssl: isLocal ? false : { rejectUnauthorized: false } })

try {
  await pool.query(await import('node:fs').then((fs) => fs.readFileSync(new URL('../db/schema.sql', import.meta.url), 'utf8')))
  await seedAll(pool, { force: true })
  console.log('✅ Base de datos resembrada con el catálogo completo.')
} catch (e) {
  console.error('Error al sembrar:', e.message); process.exitCode = 1
} finally {
  await pool.end()
}
