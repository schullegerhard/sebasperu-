import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { findUserByEmail } from './store.js'

const SECRET = process.env.JWT_SECRET || 'dev-secret-change-me'
if (process.env.NODE_ENV === 'production' && (!process.env.JWT_SECRET || SECRET === 'dev-secret-change-me')) {
  console.warn('⚠️  SEGURIDAD: define JWT_SECRET (secreto fuerte) en producción. Usando valor por defecto INSEGURO.')
}
// Hash señuelo: se compara SIEMPRE (aunque el correo no exista) para que el tiempo
// de respuesta sea constante y no se pueda enumerar usuarios por temporización.
const DUMMY_HASH = bcrypt.hashSync('sebasperu-timing-guard', 10)

export async function login(email, password) {
  const u = await findUserByEmail((email || '').trim())
  const ok = bcrypt.compareSync(String(password || ''), u ? u.password_hash : DUMMY_HASH)
  if (!u || !ok) return null
  const payload = { id: u.id, name: u.name, email: u.email, role: u.role }
  const token = jwt.sign(payload, SECRET, { expiresIn: '8h', issuer: 'sebasperu' })
  return { token, user: payload }
}

// ---- Cuentas de CLIENTE (tienda) — token separado del panel (type: customer) ----
export function customerToken(c) {
  return jwt.sign({ id: c.id, name: c.name, email: c.email, type: 'customer' }, SECRET, { expiresIn: '30d', issuer: 'sebasperu' })
}
export function requireCustomer(req, res, next) {
  const h = req.headers.authorization || ''
  const token = h.startsWith('Bearer ') ? h.slice(7) : null
  if (!token) return res.status(401).json({ error: 'No autenticado' })
  try {
    const u = jwt.verify(token, SECRET)
    if (u.type !== 'customer') return res.status(401).json({ error: 'Sesión inválida' })
    req.customer = u; next()
  } catch { res.status(401).json({ error: 'Sesión inválida o expirada' }) }
}

// Middleware: exige un Bearer token válido.
export function requireAuth(req, res, next) {
  const h = req.headers.authorization || ''
  const token = h.startsWith('Bearer ') ? h.slice(7) : null
  if (!token) return res.status(401).json({ error: 'No autenticado' })
  try { req.user = jwt.verify(token, SECRET); next() }
  catch { res.status(401).json({ error: 'Token inválido o expirado' }) }
}

// Middleware: exige uno de los roles indicados.
export const requireRole = (...roles) => (req, res, next) => {
  if (!req.user || (!roles.includes(req.user.role) && req.user.role !== 'Administrador'))
    return res.status(403).json({ error: 'Sin permisos' })
  next()
}
