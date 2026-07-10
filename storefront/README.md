# SebasPeru — Storefront SEO (Next.js 15 + React 19)

Tienda pública con **renderizado en el servidor**, pensada para SEO. Consume la
misma API (`/api/*`, PostgreSQL/Supabase) que el panel de administración, por lo
que muestra el catálogo real y las páginas editables.

## Tecnologías

- **Next.js 15** (App Router) + **React 19**
- **SSR** — cada página se renderiza en el servidor (HTML indexable, sin depender de JS).
- **SSG** — home, categorías, productos y páginas legales se pre-generan en `build`
  (`generateStaticParams`).
- **ISR** — se revalidan solos cada 60 s (`export const revalidate = 60`), así los
  cambios del panel aparecen sin reconstruir.
- **SEO**: `generateMetadata` (title/description/canonical/OpenGraph) por página,
  datos estructurados **JSON-LD** (`Product`, `BreadcrumbList`), `sitemap.xml` y
  `robots.txt` generados por el framework.

## Variables de entorno (`.env.local`)

```
NEXT_PUBLIC_API_URL=http://localhost:4000      # API REST (catálogo, categorías, páginas, banners)
NEXT_PUBLIC_SITE_URL=https://www.sebasperu.com  # dominio público (canonical/sitemap)
```

Si `NEXT_PUBLIC_API_URL` no responde, cae a un catálogo local de respaldo (no rompe).

## Desarrollo

```bash
cd storefront
npm install
npm run dev            # http://localhost:3000  (la API debe correr en :4000)
```

## Producción

```bash
npm run build          # genera las páginas estáticas leyendo la API
npm start              # sirve en :3000 (o el PORT del host)
```

La API (`../api`) debe estar accesible en `NEXT_PUBLIC_API_URL` durante el `build`
(para SSG) y en ejecución (para ISR/SSR).

## Despliegue

Recomendado en **Vercel** (Next.js nativo) o cualquier host Node:

- **Vercel**: proyecto con raíz `storefront/`; define `NEXT_PUBLIC_API_URL`
  (URL pública de la API, p. ej. el servicio de Render) y `NEXT_PUBLIC_SITE_URL`.
- **Node/Render**: `npm run build && npm start`; mismas variables de entorno.

El panel de administración (`/admin`) sigue en la app actual (Vite + Express); este
storefront es solo la parte pública orientada a SEO.
