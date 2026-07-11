// Integración con Mercado Pago (Checkout Pro) vía API REST, sin dependencias.
// Configurable por entorno:  MP_ACCESS_TOKEN  (Access Token de tu cuenta MP).
const MP = 'https://api.mercadopago.com'
const token = () => process.env.MP_ACCESS_TOKEN

export const mpConfigured = () => !!token()

// Crea una preferencia de pago y devuelve el enlace de pago (init_point).
export async function createPreference(order, urls) {
  const items = (order.items || []).map((i) => ({
    title: String(i.name).slice(0, 250), quantity: Number(i.qty) || 1,
    unit_price: Number(i.price) || 0, currency_id: 'PEN',
  }))
  const body = {
    items,
    external_reference: String(order.id),
    back_urls: { success: urls.success, failure: urls.failure, pending: urls.success },
    auto_return: 'approved',
    notification_url: urls.notification,
    statement_descriptor: 'SEBASTPERU',
    ...(order.email && order.email !== '—' ? { payer: { email: order.email } } : {}),
  }
  const r = await fetch(`${MP}/checkout/preferences`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` },
    body: JSON.stringify(body),
  })
  const d = await r.json().catch(() => ({}))
  if (!r.ok) throw new Error(d.message || `Mercado Pago error ${r.status}`)
  return { id: d.id, init_point: d.init_point }
}

// Consulta el estado de un pago (para el webhook de confirmación).
export async function getPayment(id) {
  const r = await fetch(`${MP}/v1/payments/${id}`, { headers: { Authorization: `Bearer ${token()}` } })
  return r.ok ? r.json() : null
}
