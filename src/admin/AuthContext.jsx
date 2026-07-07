import { createContext, useContext, useState, useCallback } from 'react'
import { http } from '../services/http.js'

const AuthContext = createContext(null)
export const useAuth = () => useContext(AuthContext)

// Cuentas demo (una por rol) — autenticadas contra la API.
export const DEMO_USERS = [
  { email: 'admin@sebasperu.com', pass: 'admin123', name: 'Admin General', role: 'Administrador' },
  { email: 'vendedor@sebasperu.com', pass: 'vend123', name: 'Carlos Vendedor', role: 'Vendedor' },
  { email: 'almacen@sebasperu.com', pass: 'alm123', name: 'Ana Almacén', role: 'Almacén' },
  { email: 'marketing@sebasperu.com', pass: 'mkt123', name: 'María Marketing', role: 'Marketing' },
  { email: 'soporte@sebasperu.com', pass: 'sop123', name: 'Sergio Soporte', role: 'Soporte' },
]

// Permisos por rol (acceso a páginas). '*' = acceso total.
export const ROLE_PERMS = {
  Administrador: ['*'],
  Vendedor: ['dashboard', 'orders', 'customers', 'reports'],
  'Almacén': ['dashboard', 'orders', 'inventory', 'products'],
  Marketing: ['dashboard', 'coupons', 'banners', 'reports', 'settings'],
  Soporte: ['dashboard', 'orders', 'customers'],
}

// Permisos de edición (quién puede modificar, no solo ver).
const MANAGE_PERMS = {
  Administrador: ['*'],
  'Almacén': ['inventory', 'orders'],
  Marketing: ['coupons', 'banners', 'settings'],
  Vendedor: [],
  Soporte: [],
}

const load = () => { try { return JSON.parse(localStorage.getItem('admin_session') || 'null') } catch { return null } }

export function AuthProvider({ children }) {
  const [user, setUser] = useState(load)

  // Autenticación real contra la API (devuelve JWT + usuario).
  const login = useCallback(async (email, pass) => {
    try {
      const { token, user: u } = await http.post('/api/auth/login', { email, password: pass })
      localStorage.setItem('admin_token', token)
      localStorage.setItem('admin_session', JSON.stringify(u))
      setUser(u)
      return { ok: true }
    } catch (e) {
      return { ok: false, error: e.status === 401 ? 'Credenciales inválidas' : 'No se pudo conectar con el servidor' }
    }
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('admin_session'); localStorage.removeItem('admin_token'); setUser(null)
  }, [])

  const can = useCallback((perm) => {
    if (!user) return false
    const perms = ROLE_PERMS[user.role] || []
    return perms.includes('*') || perms.includes(perm)
  }, [user])

  const canManage = useCallback((perm) => {
    if (!user) return false
    const perms = MANAGE_PERMS[user.role] || []
    return perms.includes('*') || perms.includes(perm)
  }, [user])

  return (
    <AuthContext.Provider value={{ user, login, logout, can, canManage }}>
      {children}
    </AuthContext.Provider>
  )
}
