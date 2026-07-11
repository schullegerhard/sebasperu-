# Despliegue en Hostinger (importando desde Git)

El proyecto son **dos aplicaciones Node.js** (Hostinger soporta ambas: Next.js y
Express). La base de datos es **PostgreSQL en Supabase** (no se usa MySQL).

```
Repositorio (Git)
├─ /            → App B: API + Panel (Express) — sirve /admin y /api, y la tienda Vite
├─ /storefront  → App A: Tienda pública (Next.js 15) — SEO (SSR/SSG/ISR)
└─ /api         → código del servidor Express (lo usa App B)
```

---

## App A — Tienda pública (Next.js, SEO)

| Campo | Valor |
|---|---|
| **Directorio raíz** | `storefront` |
| **Framework** | Next.js (autodetectado) |
| **Build** | `npm install && npm run build` |
| **Start** | `npm start`  *(usa el PORT que asigna Hostinger)* |
| **Dominio** | el principal, p. ej. `www.tudominio.com` |

**Variables de entorno:**
```
NEXT_PUBLIC_API_URL=https://panel.tudominio.com     # URL pública de la API (App B)
NEXT_PUBLIC_SITE_URL=https://www.tudominio.com      # dominio público (canonical/sitemap)
```

---

## App B — API + Panel de administración (Express + Vite)

| Campo | Valor |
|---|---|
| **Directorio raíz** | `/` (raíz del repo) |
| **Build** | `npm install --include=dev && npm run build && npm install --prefix api` |
| **Start** | `npm start`  *(= `node api/src/index.js`, usa el PORT de Hostinger)* |
| **Dominio** | un subdominio, p. ej. `panel.tudominio.com` |

> El panel queda en `https://panel.tudominio.com/admin`. Esta app también sirve
> `/api/*` (que consume la tienda Next.js) y una copia de la tienda en Vite.

**Variables de entorno (mínimas):**
```
DATABASE_URL=postgresql://...supabase...       # tu cadena de Supabase
JWT_SECRET=<un-secreto-largo-y-aleatorio>
CORS_ORIGIN=https://www.tudominio.com          # permite que la tienda llame a la API
PUBLIC_URL=https://panel.tudominio.com         # back_urls/webhook de Mercado Pago

# Correo (Gmail → contraseña de aplicación)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=tucorreo@gmail.com
SMTP_PASS=<contraseña-de-aplicacion>
MAIL_FROM=SebasPeru <tucorreo@gmail.com>

# Mercado Pago (TEST-… para pruebas, APP_USR-… en producción)
MP_ACCESS_TOKEN=<tu-access-token>
```

---

## Base de datos

- **Mantener Supabase** (PostgreSQL). No crear base MySQL en Hostinger.
- Solo copia la cadena de conexión de Supabase en `DATABASE_URL` (App B).
- Al primer arranque, la API crea las tablas y siembra el catálogo/páginas.

## Pasos resumidos

1. Sube el repo a Git (ya está).
2. En Hostinger, crea **App B** (raíz `/`) con las variables y el build/start de arriba → asígnale `panel.tudominio.com`.
3. Crea **App A** (raíz `storefront`) con sus dos variables → asígnale `www.tudominio.com`.
4. Verifica: `https://panel.tudominio.com/admin` (panel) y `https://www.tudominio.com` (tienda SEO).
5. Configura el **webhook de Mercado Pago** hacia `https://panel.tudominio.com/api/pay/mercadopago/webhook`.

## Nota de arquitectura (importante)

Hoy la **tienda Next.js** (App A) es el catálogo optimizado para SEO (SSR). El
**carrito/checkout, cuentas de cliente, Mercado Pago y correos** viven en la app
Express+Vite (App B). Opciones:

- **Simple y completo hoy:** usa **App B como sitio principal** (tiene TODO
  funcionando: catálogo, carrito, checkout, cuentas, pagos, correos, panel). El
  SEO es del lado del cliente (bueno, no SSR).
- **SEO máximo:** usa **App A (Next.js) como sitio principal** y enlaza el
  checkout a App B — o portamos el checkout/cuentas a Next.js para unificar todo
  en una sola app SSR (tarea adicional recomendada para el mejor resultado).
