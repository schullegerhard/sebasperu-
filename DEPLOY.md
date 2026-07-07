# Desplegar el storefront (link en vivo)

El storefront (tienda) funciona **de forma autónoma** con el catálogo estático:
productos, categorías, filtros, carrito y checkout funcionan sin backend. El
panel de administración y la persistencia de pedidos requieren además la API
(carpeta `api/`), pero **no es necesario para mostrarle la tienda al cliente**.

La build de producción está en `dist/` (2.1 MB, ya generada con `npm run build`).

---

## Opción A — Netlify Drop  ⚡ (lo más rápido, sin cuenta, ~1 min)

1. Ejecuta `npm run build` (ya hecho → carpeta `dist/`).
2. Abre https://app.netlify.com/drop
3. **Arrastra la carpeta `dist/`** a la página.
4. Netlify te da una URL pública al instante (ej. `https://random-name.netlify.app`).
   Envíasela al cliente.

> El archivo `public/_redirects` ya incluye el fallback SPA, así que rutas como
> `/categoria/toner` funcionan al recargar.

## Opción B — Deploy permanente con Git (Netlify / Vercel / Render)

El repo ya está inicializado (`git`, rama `main`, commits listos).

1. Crea un repositorio vacío en GitHub y conéctalo:
   ```bash
   git remote add origin https://github.com/TU-USUARIO/sebasperu.git
   git push -u origin main
   ```
2. En **Netlify** o **Vercel**: "New site from Git" → elige el repo.
   La configuración ya está en `netlify.toml` / `vercel.json`
   (build: `npm run build`, publish: `dist`). Deploy automático en cada push.

## Opción C — Un solo servicio con la API  →  incluye el ADMIN  ⭐

Este es el deploy que necesita el **panel de administración** (`/admin`) y todo
lo gestionable (productos, categorías, atributos, **banners**, pedidos, cupones).
Un solo servicio sirve TODO en un dominio:

- Tienda → `https://tu-app.onrender.com/`
- Admin → `https://tu-app.onrender.com/admin`
- API → `https://tu-app.onrender.com/api/*`

La API (`api/src/index.js`) sirve el build de Vite (`dist/`) en el mismo origen,
así que no hace falta CORS ni un segundo dominio. Ya está todo en `render.yaml`.

### Pasos (Render, gratis)
1. Sube el repo a GitHub (ver Opción B, paso 1).
2. En **Render** → **New → Blueprint** → conecta el repo. Detecta `render.yaml`
   y crea el servicio `sebasperu` con:
   - build: `npm install && npm run build && npm install --prefix api`
   - start: `node api/src/index.js`
3. En el dashboard del servicio → **Environment** → añade:
   - `DATABASE_URL` = tu URI de **Supabase/Postgres** (Session pooler, IPv4).
   - `JWT_SECRET` = Render lo genera solo (o pon uno propio).
4. Deploy. Al arrancar, la API crea las tablas y (si la BD está vacía) siembra el
   catálogo + usuarios automáticamente (`api/src/migrate.js`).

### Acceso al admin
- URL: `https://tu-app.onrender.com/admin`
- Usuarios demo sembrados (¡**cámbialos en producción**!):

  | Rol | Email | Contraseña |
  |---|---|---|
  | Administrador | `admin@sebasperu.com` | `admin123` |
  | Marketing (cupones/banners) | `marketing@sebasperu.com` | `mkt123` |
  | Almacén (stock/pedidos) | `almacen@sebasperu.com` | `alm123` |

  > 🔒 **Seguridad:** cambia estas contraseñas antes de entregar al cliente
  > (edita `api/src/seed-data.js` / la tabla `users`, o crea usuarios nuevos y
  > borra los demo). El `JWT_SECRET` debe ser único y privado.

### Acceso inmediato sin deploy (túnel temporal)
Para mostrar el admin **hoy** sin desplegar, expón la API local con un túnel:
`node scripts/tunnel.mjs` (usa `ngrok`; requiere un authtoken gratis). Da una URL
pública temporal a `http://localhost:4000` (tienda + `/admin` + API). Es temporal
—para permanente usa Render arriba.

---

## Opción SEO — Storefront Next.js (SSR/SSG) para buen posicionamiento

Para SEO óptimo (HTML renderizado en servidor, `sitemap.xml`, `robots.txt`,
metadatos por página y JSON-LD), hay un storefront en **Next.js 14** en
`storefront/` que **ya compila** (SSG/ISR de home, categorías y productos).

- Lee los MISMOS datos que el admin vía la API: define
  `NEXT_PUBLIC_API_URL=https://<tu-api>.onrender.com` (la de la Opción C).
- Deploy recomendado: **Vercel** (New Project → carpeta `storefront/`) o Render.
  Build: `npm install && npm run build`, start: `npm start`.
- Arquitectura sugerida: **Next.js público** (tienda, para SEO) +
  **servicio Opción C** para `/admin` y `/api`.

**Pendiente para el cutover (decisión + trabajo, ~días):**
1. La BD (Supabase) tiene el catálogo sembrado ANTIGUO; el Next.js (vía API)
   mostraría esos datos. Hay que **re-sembrar** la BD con el catálogo actual
   (`seedAll(pool, {force:true})` en `api/src/migrate.js` — ⚠️ borra ediciones)
   o gestionar el catálogo nuevo desde el admin.
2. Verificar paridad (carrito, checkout, cuenta, analítica) vs la SPA de Vite.
3. Mantener DOS frontends sincronizados (coste de mantenimiento).

> **Alternativa a considerar:** en lugar de mantener dos frontends, prerenderizar
> la SPA de Vite actual (una sola base de código). Es una decisión de arquitectura
> —conviene elegir antes de invertir en el cutover completo.

---

### Recomendación
- **Ver la tienda ya** → Opción A (Netlify Drop, sin backend).
- **Entregar el admin gestionable** → Opción C (Render, un servicio, con Supabase).
- **SEO** → decidir entre completar el Next.js (`storefront/`) o prerenderizar la
  SPA actual. La base Next.js ya existe y compila.
