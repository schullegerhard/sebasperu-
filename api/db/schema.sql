-- Esquema de base de datos SebasPeru (PostgreSQL).
-- Ejecutar:  psql "$DATABASE_URL" -f db/schema.sql

CREATE TABLE IF NOT EXISTS categories (
  id          SERIAL PRIMARY KEY,
  slug        TEXT UNIQUE NOT NULL,
  name        TEXT NOT NULL,
  position    INT  NOT NULL DEFAULT 0,
  data        JSONB NOT NULL          -- categoría completa (incluye subcategorías)
);

CREATE TABLE IF NOT EXISTS products (
  id          INT PRIMARY KEY,
  slug        TEXT UNIQUE NOT NULL,
  sku         TEXT NOT NULL,
  name        TEXT NOT NULL,
  brand       TEXT,
  category    TEXT REFERENCES categories(slug),
  subcategory TEXT,
  price       NUMERIC(10,2) NOT NULL,
  old_price   NUMERIC(10,2),
  stock       INT NOT NULL DEFAULT 0,
  rating      NUMERIC(2,1) DEFAULT 0,
  reviews     INT DEFAULT 0,
  data        JSONB NOT NULL          -- producto completo (specs, highlights, etc.)
);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);

CREATE TABLE IF NOT EXISTS customers (
  id            SERIAL PRIMARY KEY,
  name          TEXT NOT NULL,
  email         TEXT UNIQUE NOT NULL,
  phone         TEXT,
  password_hash TEXT,          -- cuenta de cliente (registro/login en la tienda)
  type          TEXT DEFAULT 'Persona',
  since          DATE DEFAULT CURRENT_DATE
);

CREATE TABLE IF NOT EXISTS orders (
  id       SERIAL PRIMARY KEY,
  code     TEXT UNIQUE NOT NULL,
  customer TEXT NOT NULL,
  email    TEXT,
  total    NUMERIC(10,2) NOT NULL,
  status   TEXT NOT NULL DEFAULT 'Pendiente',
  payment  TEXT,
  region   TEXT,
  date     DATE NOT NULL DEFAULT CURRENT_DATE,
  items    JSONB NOT NULL DEFAULT '[]'
);

CREATE TABLE IF NOT EXISTS coupons (
  id       SERIAL PRIMARY KEY,
  code     TEXT UNIQUE NOT NULL,
  type     TEXT NOT NULL,            -- '%', 'S/', 'envio'
  value    NUMERIC(10,2) DEFAULT 0,
  expires  DATE,
  active   BOOLEAN DEFAULT TRUE,
  uses     INT DEFAULT 0,
  min_buy  NUMERIC(10,2) DEFAULT 0
);

CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  name          TEXT NOT NULL,
  email         TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role          TEXT NOT NULL DEFAULT 'Soporte'   -- Administrador|Vendedor|Almacén|Marketing|Soporte
);

CREATE TABLE IF NOT EXISTS settings (
  id   INT PRIMARY KEY DEFAULT 1,
  data JSONB NOT NULL
);

-- Atributos fijos para filtrar productos (RAM, Color, etc.) gestionados en el admin.
CREATE TABLE IF NOT EXISTS attributes (
  id   SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  data JSONB NOT NULL          -- { id, name, values:[], categories:[] }
);

-- Banners del carrusel principal (home) gestionados en el admin.
CREATE TABLE IF NOT EXISTS banners (
  id       SERIAL PRIMARY KEY,
  position INT NOT NULL DEFAULT 0,
  active   BOOLEAN DEFAULT TRUE,
  data     JSONB NOT NULL      -- { id, theme, badge, title, subtitle, cta, link, image, active }
);

-- Páginas de contenido editables (legales / institucionales) del pie de página.
CREATE TABLE IF NOT EXISTS pages (
  id       SERIAL PRIMARY KEY,
  slug     TEXT UNIQUE NOT NULL,
  active   BOOLEAN DEFAULT TRUE,
  data     JSONB NOT NULL      -- { id, slug, title, body(HTML), active }
);
