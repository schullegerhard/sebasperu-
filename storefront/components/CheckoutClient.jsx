'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ProductImage } from './imageMap.jsx'
import { useCart } from './CartProvider.jsx'
import { getCustomer, createOrder, payMercadoPago, payConfig } from '../lib/client.js'

const money = (n) => 'S/ ' + Number(n || 0).toLocaleString('es-PE', { minimumFractionDigits: 2 })

const PAYMENTS = [
  { id: 'mercadopago', label: 'Mercado Pago', desc: 'Tarjeta, Yape o saldo — pago seguro.', icon: '🔷', online: true },
  { id: 'contraentrega', label: 'Pago contra entrega', desc: 'Paga en efectivo al recibir.', icon: '💵' },
  { id: 'transferencia', label: 'Transferencia bancaria', desc: 'A nuestras cuentas.', icon: '🏛️' },
  { id: 'yape', label: 'Yape / Plin', desc: 'Desde tu celular.', icon: '📱' },
]

export default function CheckoutClient() {
  const { cart, total, clearCart, ready } = useCart()
  const [data, setData] = useState({ email: '', name: '', lastName: '', doc: '', delivery: 'domicilio', address: '', payment: 'contraentrega' })
  const [mp, setMp] = useState(false)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const [done, setDone] = useState(false)
  const set = (k) => (e) => setData((d) => ({ ...d, [k]: e.target.value }))

  useEffect(() => {
    const c = getCustomer(); if (c?.email) setData((d) => ({ ...d, email: c.email, name: d.name || (c.name || '').split(' ')[0] || '' }))
    const params = new URLSearchParams(window.location.search)
    if (params.get('status') === 'success') { clearCart(); setDone(true); window.history.replaceState({}, '', '/checkout'); return }
    payConfig().then((r) => { if (r?.mercadopago) { setMp(true); setData((d) => ({ ...d, payment: 'mercadopago' })) } }).catch(() => {})
  }, [])
  const payments = PAYMENTS.filter((p) => p.id !== 'mercadopago' || mp)

  const validate = () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) return 'Ingresa un correo válido para enviarte el detalle.'
    if (!data.name.trim() || !data.lastName.trim()) return 'Ingresa tu nombre y apellido.'
    if (!data.doc.trim()) return 'Ingresa tu DNI o CE.'
    if (data.delivery === 'domicilio' && !data.address.trim()) return 'Ingresa tu dirección de entrega.'
    return ''
  }

  const submit = async () => {
    const v = validate(); if (v) { setErr(v); return }
    setErr(''); setBusy(true)
    const region = data.delivery === 'tienda' ? 'Retiro en tienda' : 'Lima'
    const items = cart.map((i) => ({ name: i.name, qty: i.qty, price: i.price }))
    const order = { customer: `${data.name} ${data.lastName}`.trim(), email: data.email.trim(), total, region, items }
    try {
      if (data.payment === 'mercadopago') {
        const { init_point } = await payMercadoPago(order)
        if (init_point) { window.location.href = init_point; return }
      }
      await createOrder({ ...order, payment: PAYMENTS.find((p) => p.id === data.payment)?.label || data.payment })
      clearCart(); setDone(true); window.scrollTo(0, 0)
    } catch (e) { setErr(e.message || 'No se pudo procesar el pedido.'); setBusy(false) }
  }

  if (done) return (
    <div className="empty-state"><h2>¡Pedido confirmado!</h2><p className="muted">Gracias por tu compra. Te enviamos el detalle por correo y te contactaremos para la entrega.</p><Link className="btn-primary" href="/">Volver al inicio</Link></div>
  )
  if (ready && cart.length === 0) return (
    <div className="empty-state"><h2>Tu carrito está vacío</h2><Link className="btn-primary" href="/">Ver productos</Link></div>
  )

  return (
    <div className="co2-layout">
      <div className="co2-main">
        <section className="co-card">
          <h3 className="co-h">Contacto</h3>
          <p className="co-sub">Te enviaremos la confirmación de tu pedido a este correo.</p>
          <input type="email" placeholder="Correo electrónico" value={data.email} onChange={set('email')} />
        </section>
        <section className="co-card">
          <h3 className="co-h">Entrega</h3>
          <div className="co-seg">
            <button type="button" className={data.delivery === 'domicilio' ? 'on' : ''} onClick={() => setData((d) => ({ ...d, delivery: 'domicilio' }))}>Envío a domicilio</button>
            <button type="button" className={data.delivery === 'tienda' ? 'on' : ''} onClick={() => setData((d) => ({ ...d, delivery: 'tienda' }))}>Retiro en tienda</button>
          </div>
          <div className="co-grid2">
            <input placeholder="Nombre" value={data.name} onChange={set('name')} />
            <input placeholder="Apellido" value={data.lastName} onChange={set('lastName')} />
          </div>
          <input placeholder="DNI o CE" value={data.doc} onChange={set('doc')} />
          {data.delivery === 'domicilio' && <input placeholder="Dirección de entrega" value={data.address} onChange={set('address')} />}
        </section>
        <section className="co-card">
          <h3 className="co-h">Pago</h3>
          <div className="co2-pays">
            {payments.map((p) => (
              <label key={p.id} className={`co2-pay ${data.payment === p.id ? 'on' : ''}`}>
                <input type="radio" name="pay" checked={data.payment === p.id} onChange={() => setData((d) => ({ ...d, payment: p.id }))} />
                <span className="co2-pay-ic">{p.icon}</span>
                <span className="co2-pay-txt"><b>{p.label}</b><small>{p.desc}</small></span>
              </label>
            ))}
          </div>
        </section>
      </div>
      <aside className="co2-side">
        <div className="co-card">
          <h3 className="co-h">Resumen</h3>
          <div className="co2-items">
            {cart.map((i) => (
              <div className="co2-item" key={i.id}>
                <div className="co2-item-img"><ProductImage image={i.image} alt={i.name} /></div>
                <div className="co2-item-info"><b>{i.name}</b><small>Cantidad: {i.qty}</small></div>
                <span className="co2-item-price">{money(i.price * i.qty)}</span>
              </div>
            ))}
          </div>
          <div className="co2-total"><span>Total</span><b>{money(total)}</b></div>
          {err && <p className="co-err">{err}</p>}
          <button className="btn-primary block" onClick={submit} disabled={busy}>{busy ? 'Procesando…' : 'Pagar ahora'}</button>
          <p className="co2-terms">Al continuar aceptas los <Link href="/legal/terminos">Términos</Link> y la <Link href="/legal/privacidad">Privacidad</Link>.</p>
        </div>
      </aside>
    </div>
  )
}
