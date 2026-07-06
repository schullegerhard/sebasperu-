// Capa de analítica (requisito 10). Empuja eventos a dataLayer (GTM/GA4).
// Las cuentas/IDs reales se configuran en index.html. Si no existe dataLayer
// (p. ej. en pruebas), los eventos quedan en consola sin romper la app.

export function track(event, params = {}) {
  if (typeof window === 'undefined') return
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({ event, ...params })
  // Clarity (si está cargado) — etiqueta el evento.
  if (typeof window.clarity === 'function') {
    try { window.clarity('event', event) } catch { /* noop */ }
  }
}

export function trackPageView(path, title) {
  track('page_view', { page_path: path, page_title: title })
}
