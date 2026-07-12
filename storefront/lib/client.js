'use client'
// Cliente de API para el navegador (cuenta, pedidos, pagos). Usa NEXT_PUBLIC_API_URL.
const API = process.env.NEXT_PUBLIC_API_URL || ''
const TOKEN = 'sp_customer_token'
const USER = 'sp_customer_user'
const H = { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' }

export const getCustomer = () => { try { return JSON.parse(localStorage.getItem(USER) || 'null') } catch { return null } }
export const getToken = () => (typeof localStorage !== 'undefined' ? localStorage.getItem(TOKEN) : null)
export const logout = () => { localStorage.removeItem(TOKEN); localStorage.removeItem(USER); window.dispatchEvent(new Event('sp-auth')) }
const save = ({ token, customer }) => {
  localStorage.setItem(TOKEN, token); localStorage.setItem(USER, JSON.stringify(customer))
  window.dispatchEvent(new Event('sp-auth')); return customer
}

async function req(method, path, body, auth) {
  const r = await fetch(`${API}${path}`, {
    method,
    headers: { ...H, ...(auth && getToken() ? { Authorization: `Bearer ${getToken()}` } : {}) },
    body: body != null ? JSON.stringify(body) : undefined,
  })
  const d = await r.json().catch(() => ({ error: 'Error de conexión' }))
  if (!r.ok) { if (r.status === 401 && auth) logout(); throw new Error(d.error || `Error ${r.status}`) }
  return d
}

// Cuenta de cliente
export const register = async (data) => save(await req('POST', '/api/account/register', data))
export const login = async (data) => save(await req('POST', '/api/account/login', data))
export const myOrders = () => req('GET', '/api/account/orders', null, true)

// Pedidos y pagos
export const payConfig = () => req('GET', '/api/pay/config')
export const createOrder = (order) => req('POST', '/api/orders', order)
export const payMercadoPago = (order) => req('POST', '/api/pay/mercadopago', order)

// Solicitud de cotización (empresas)
export const sendQuote = (data) => req('POST', '/api/quote', data)
