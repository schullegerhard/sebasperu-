// Capa de persistencia del administrador (mock con localStorage).
// En producción, estas funciones se reemplazarían por llamadas a una API REST.
import { products as seedProducts, categories as seedCategories } from '../data/catalog.js'

const read = (k, fb) => {
  try { const r = localStorage.getItem(k); return r ? JSON.parse(r) : fb } catch { return fb }
}
const write = (k, v) => { localStorage.setItem(k, JSON.stringify(v)); return v }

/* ----------------------------- SEEDS ----------------------------- */
const seedOrders = () => {
  const rows = [
    ['Juan Pérez García', 'juan@gmail.com', 1899, 'Pagado', 'Yape', 'Lima', '2026-06-20'],
    ['María López', 'maria@gmail.com', 747, 'Enviado', 'Tarjeta', 'Arequipa', '2026-06-20'],
    ['Carlos Ruiz', 'carlos@empresa.pe', 3299, 'Pendiente', 'Transferencia', 'Lima', '2026-06-19'],
    ['Ana Torres', 'ana@gmail.com', 168, 'Entregado', 'Contra entrega', 'Cusco', '2026-06-18'],
    ['Pedro Castro', 'pedro@gmail.com', 2149, 'Pagado', 'Tarjeta', 'La Libertad', '2026-06-18'],
    ['Lucía Méndez', 'lucia@empresa.pe', 597, 'Cancelado', 'Yape', 'Lima', '2026-06-17'],
    ['Jorge Salas', 'jorge@gmail.com', 1799, 'Enviado', 'Transferencia', 'Piura', '2026-06-16'],
    ['Rosa Díaz', 'rosa@gmail.com', 89, 'Entregado', 'Yape', 'Lima', '2026-06-15'],
    ['Empresa TechCorp', 'compras@techcorp.pe', 9890, 'Pendiente', 'Transferencia', 'Lima', '2026-06-15'],
    ['Diego Flores', 'diego@gmail.com', 549, 'Pagado', 'Plin', 'Tacna', '2026-06-14'],
  ]
  return rows.map((r, i) => ({
    id: 1000 + i, code: `PED-${1000 + i}`,
    customer: r[0], email: r[1], total: r[2], status: r[3], payment: r[4], region: r[5], date: r[6],
    items: [{ name: 'Producto de ejemplo', qty: 1, price: r[2] }],
  }))
}

const seedCustomers = () => ([
  { id: 1, name: 'Juan Pérez García', email: 'juan@gmail.com', phone: '987 654 321', orders: 4, spent: 5240, since: '2025-11-02', type: 'Persona' },
  { id: 2, name: 'María López', email: 'maria@gmail.com', phone: '988 111 222', orders: 2, spent: 1446, since: '2026-01-15', type: 'Persona' },
  { id: 3, name: 'Empresa TechCorp', email: 'compras@techcorp.pe', phone: '01 555 4040', orders: 7, spent: 38900, since: '2025-08-20', type: 'Empresa' },
  { id: 4, name: 'Carlos Ruiz', email: 'carlos@empresa.pe', phone: '999 333 444', orders: 3, spent: 6890, since: '2026-02-10', type: 'Empresa' },
  { id: 5, name: 'Ana Torres', email: 'ana@gmail.com', phone: '977 888 999', orders: 1, spent: 168, since: '2026-05-01', type: 'Persona' },
  { id: 6, name: 'Pedro Castro', email: 'pedro@gmail.com', phone: '966 777 888', orders: 2, spent: 2738, since: '2026-03-22', type: 'Persona' },
])

const seedCoupons = () => ([
  { id: 1, code: 'SEBAS10', type: '%', value: 10, expires: '2026-12-31', active: true, uses: 42, minBuy: 0 },
  { id: 2, code: 'TECNO15', type: '%', value: 15, expires: '2026-09-30', active: true, uses: 18, minBuy: 500 },
  { id: 3, code: 'ENVIOGRATIS', type: 'envio', value: 0, expires: '2026-07-31', active: true, uses: 73, minBuy: 299 },
  { id: 4, code: 'BLACK50', type: 'S/', value: 50, expires: '2025-11-30', active: false, uses: 210, minBuy: 800 },
])

/* --------------------------- INIT / GET --------------------------- */
export const KEYS = {
  products: 'admin_products', categories: 'admin_categories', orders: 'admin_orders',
  customers: 'admin_customers', coupons: 'admin_coupons', settings: 'admin_settings',
}

export function ensureSeed() {
  if (!localStorage.getItem(KEYS.products)) write(KEYS.products, seedProducts.map((p) => ({ ...p })))
  if (!localStorage.getItem(KEYS.categories)) write(KEYS.categories, seedCategories.map((c) => ({ ...c, subcategories: [...c.subcategories] })))
  if (!localStorage.getItem(KEYS.orders)) write(KEYS.orders, seedOrders())
  if (!localStorage.getItem(KEYS.customers)) write(KEYS.customers, seedCustomers())
  if (!localStorage.getItem(KEYS.coupons)) write(KEYS.coupons, seedCoupons())
  if (!localStorage.getItem(KEYS.settings)) write(KEYS.settings, {
    name: 'SebasPeru', email: 'ventas@sebasperu.com', phone: '926 428 566', whatsapp: '925 552 042',
    address: 'Lima, Perú', ruc: '20512345678', currency: 'PEN', igv: 18,
    payments: { yape: true, plin: true, transferencia: true, tarjeta: true, contraentrega: true, mercadopago: true },
    shipping: { freeFrom: 299, limaFee: 15, provinceFee: 25 },
  })
}

export const get = (key) => read(KEYS[key], [])
export const set = (key, value) => write(KEYS[key], value)
export const nextId = (rows) => (rows.length ? Math.max(...rows.map((r) => r.id || 0)) + 1 : 1)
