import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { findUserByEmail } from './store.js'

const SECRET = process.env.JWT_SECRET || 'dev-secret-change-me'

export async function login(email, password) {
  const u = await findUserByEmail((email || '').trim())
  if (!u) return null
  const ok = bcrypt.compareSync(password, u.password_hash)
  if (!ok) return null
  const payload = { id: u.id, name: u.name, email: u.email, role: u.role }
  const token = jwt.sign(payload, SECRET, { expiresIn: '8h' })
  return { token, user: payload }
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
