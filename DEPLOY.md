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

## Opción C — Un solo servicio con la API (tienda + admin + pedidos)

La API (`api/src/index.js`) sirve `dist/` en el mismo origen. Para un deploy
todo-en-uno en Render, el `buildCommand` debe construir el front antes de
arrancar la API (build en la raíz → `dist/`, luego `node api/src/index.js`).
Requiere además `DATABASE_URL` (Supabase/Postgres). Ver `render.yaml`.

---

### Recomendación para hoy
Usa **Opción A** para tener un link en vivo en minutos y enviárselo al cliente,
y en paralelo prepara la **Opción B** para el deploy permanente.
