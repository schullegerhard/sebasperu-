// Cuenta de CLIENTE (tienda): registro, login y pedidos. Token separado del panel.
import { API_BASE } from './http.js'

const TOKEN = 'customer_token'
const USER = 'customer_user'
const H = { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' }

export const getCustomer = () => { try { return JSON.parse(localStorage.getItem(USER) || 'null') } catch { return null } }
export const getToken = () => localStorage.getItem(TOKEN)
export const logout = () => { localStorage.removeItem(TOKEN); localStorage.removeItem(USER); window.dispatchEvent(new Event('customer-auth')) }

const save = ({ token, customer }) => {
  localStorage.setItem(TOKEN, token)
  localStorage.setItem(USER, JSON.stringify(customer))
  window.dispatchEvent(new Event('customer-auth'))
  return customer
}

async function post(path, body) {
  const r = await fetch(API_BASE + path, { method: 'POST', headers: H, body: JSON.stringify(body) })
  const d = await r.json().catch(() => ({ error: 'Error de conexión' }))
  if (!r.ok) throw new Error(d.error || `Error ${r.status}`)
  return d
}

export const register = async (data) => save(await post('/api/account/register', data))
export const login = async (data) => save(await post('/api/account/login', data))

export async function myOrders() {
  const r = await fetch(API_BASE + '/api/account/orders', { headers: { ...H, Authorization: `Bearer ${getToken()}` } })
  if (!r.ok) { if (r.status === 401) logout(); throw new Error('Sesión expirada') }
  return r.json()
}
