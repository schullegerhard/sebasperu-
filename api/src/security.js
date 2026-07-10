// Seguridad del login y cabeceras de seguridad (sin dependencias externas).
//  - Protección contra fuerza bruta: bloquea por IP+correo tras varios intentos.
//  - Cabeceras de seguridad estándar en todas las respuestas.

const attempts = new Map() // key -> { count, first, blockedUntil }
const WINDOW = 15 * 60 * 1000  // ventana de conteo: 15 min
const MAX_FAILS = 5            // intentos fallidos permitidos por ventana
const BLOCK_MS = 15 * 60 * 1000 // bloqueo tras superar el máximo: 15 min

const keyOf = (req) => `${req.ip}|${String(req.body?.email || '').toLowerCase().trim()}`

// Middleware previo al login: rechaza si la combinación IP+correo está bloqueada.
export function loginRateLimit(req, res, next) {
  const rec = attempts.get(keyOf(req))
  const now = Date.now()
  if (rec?.blockedUntil && rec.blockedUntil > now) {
    const mins = Math.ceil((rec.blockedUntil - now) / 60000)
    res.set('Retry-After', String(Math.ceil((rec.blockedUntil - now) / 1000)))
    return res.status(429).json({ error: `Demasiados intentos fallidos. Vuelve a intentar en ${mins} min.` })
  }
  next()
}

// Registra el resultado del intento: limpia en éxito, cuenta/bloquea en fallo.
export function recordLoginResult(req, success) {
  const k = keyOf(req)
  const now = Date.now()
  if (success) { attempts.delete(k); return }
  const rec = attempts.get(k) || { count: 0, first: now }
  if (now - rec.first > WINDOW) { rec.count = 0; rec.first = now } // ventana expirada → reinicia
  rec.count += 1
  if (rec.count >= MAX_FAILS) { rec.blockedUntil = now + BLOCK_MS; rec.count = 0 }
  attempts.set(k, rec)
}

// Limpieza periódica del mapa (evita crecimiento indefinido).
const timer = setInterval(() => {
  const now = Date.now()
  for (const [k, r] of attempts) {
    if ((r.blockedUntil || 0) < now && (now - r.first) > WINDOW) attempts.delete(k)
  }
}, WINDOW)
timer.unref?.()

// Cabeceras de seguridad en todas las respuestas.
export function securityHeaders(req, res, next) {
  res.set('X-Content-Type-Options', 'nosniff')
  res.set('X-Frame-Options', 'DENY')
  res.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  res.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  res.set('Cross-Origin-Opener-Policy', 'same-origin')
  res.set('X-DNS-Prefetch-Control', 'off')
  res.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
  next()
}
