// URL pública de la TIENDA (App 2 · Next.js) para los enlaces "Ver en la tienda"
// del panel. El panel vive en panel.sebasperu.com; la tienda en sebasperu.com.
// Configurable con VITE_STORE_URL en build; por defecto apunta a la tienda pública.
export const STORE_URL = (import.meta.env.VITE_STORE_URL || 'https://sebasperu.com').replace(/\/$/, '')

// Construye una URL absoluta hacia la tienda pública a partir de una ruta.
export const storeUrl = (path = '/') => STORE_URL + (path.startsWith('/') ? path : `/${path}`)
