// Capa de datos del administrador → consume la API REST (Express).
// Todas las funciones son asíncronas (devuelven promesas).
import { http } from './http.js'

export const Products = {
  list: () => http.get('/api/products'),
  find: (slug) => http.get(`/api/products/${slug}`),
  save: (data) => (data.id ? http.put(`/api/products/${data.id}`, data) : http.post('/api/products', data)),
  remove: (id) => http.del(`/api/products/${id}`),
  setStock: (id, stock) => http.patch(`/api/products/${id}/stock`, { stock }),
}

export const Categories = {
  list: () => http.get('/api/categories'),
  create: (data) => http.post('/api/categories', data),
  update: (slug, patch) => http.put(`/api/categories/${slug}`, patch),
  remove: (slug) => http.del(`/api/categories/${slug}`),
  addSub: (slug, name) => http.post(`/api/categories/${slug}/subcategories`, { name }),
  removeSub: (slug, sub) => http.del(`/api/categories/${slug}/subcategories/${sub}`),
  move: (slug, dir) => http.patch(`/api/categories/${slug}/move`, { dir }),
}

export const Orders = {
  list: () => http.get('/api/orders'),
  setStatus: (id, status) => http.patch(`/api/orders/${id}/status`, { status }),
  create: (order) => http.post('/api/orders', order),
}

export const Customers = { list: () => http.get('/api/customers') }

export const Coupons = {
  list: () => http.get('/api/coupons'),
  save: (data) => (data.id ? http.put(`/api/coupons/${data.id}`, data) : http.post('/api/coupons', data)),
  remove: (id) => http.del(`/api/coupons/${id}`),
  toggle: (id) => http.patch(`/api/coupons/${id}/toggle`),
}

export const Settings = {
  get: () => http.get('/api/settings'),
  save: (patch) => http.put('/api/settings', patch),
}

export const Attributes = {
  list: () => http.get('/api/attributes'),
  save: (data) => (data.id ? http.put(`/api/attributes/${data.id}`, data) : http.post('/api/attributes', data)),
  remove: (id) => http.del(`/api/attributes/${id}`),
}

// Algunas lecturas dependen del rol; si la API responde 403, devolvemos vacío.
const safe = (p) => p.catch(() => [])

// Reportes/KPIs calculados en el cliente a partir de productos + pedidos + clientes.
export const Reports = {
  async data() {
    const [products, orders, customers] = await Promise.all([Products.list(), safe(Orders.list()), safe(Customers.list())])
    return { products, orders, customers }
  },
  kpis({ products, orders, customers }) {
    const today = orders.filter((o) => o.date === '2026-06-20')
    const paid = orders.filter((o) => o.status !== 'Cancelado')
    return {
      salesToday: today.reduce((n, o) => n + Number(o.total), 0),
      ordersTotal: orders.length,
      ordersPending: orders.filter((o) => o.status === 'Pendiente').length,
      revenue: paid.reduce((n, o) => n + Number(o.total), 0),
      customers: customers.length,
      products: products.length,
      lowStock: products.filter((p) => p.stock <= 10).length,
    }
  },
  salesByDay(orders) {
    const map = {}
    orders.filter((o) => o.status !== 'Cancelado').forEach((o) => { const d = String(o.date).slice(0, 10); map[d] = (map[d] || 0) + Number(o.total) })
    return Object.entries(map).sort(([a], [b]) => a.localeCompare(b)).map(([date, total]) => ({ date, total }))
  },
  topProducts(products) { return [...products].sort((a, b) => b.reviews - a.reviews).slice(0, 5) },
  lowStock(products) { return products.filter((p) => p.stock <= 10).sort((a, b) => a.stock - b.stock) },
}
