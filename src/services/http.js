// Cliente HTTP del administrador → API Express (con token JWT).
// - undefined (sin .env)  → localhost:4000 (modo dev típico)
// - '' (vacío, build prod) → relativo, mismo origen (la API sirve el front-end)
const raw = import.meta.env.VITE_API_URL
const BASE = raw === undefined ? 'http://localhost:4000' : raw

const token = () => localStorage.getItem('admin_token')

async function req(method, path, body) {
  const res = await fetch(BASE + path, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': 'true', // evita la página intersticial de ngrok en respuestas JSON
      ...(token() ? { Authorization: `Bearer ${token()}` } : {}),
    },
    body: body != null ? JSON.stringify(body) : undefined,
  })
  if (!res.ok) {
    const e = await res.json().catch(() => ({ error: res.statusText }))
    const err = new Error(e.error || `Error ${res.status}`)
    err.status = res.status
    throw err
  }
  if (res.status === 204) return null
  return res.json()
}

export const http = {
  get: (p) => req('GET', p),
  post: (p, b) => req('POST', p, b),
  put: (p, b) => req('PUT', p, b),
  del: (p) => req('DELETE', p),
  patch: (p, b) => req('PATCH', p, b),
}
export const API_BASE = BASE
