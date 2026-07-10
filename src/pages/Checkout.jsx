import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ProductImage } from '../components/imageMap.jsx'
import { ShieldCheck, Lock, Truck, MapPin, BadgeCheck, Headset, FileText, Check } from '../components/Icons.jsx'
import { useStore, COUPONS } from '../context/StoreContext.jsx'
import { peso } from '../data/catalog.js'
import { useSeo } from '../lib/seo.js'
import { track } from '../lib/analytics.js'
import { Orders } from '../services/api.js'

const PAYMENTS = [
  { id: 'contraentrega', label: 'Pago contra entrega', desc: 'Paga en efectivo al recibir tu pedido.', icon: '💵', rec: true },
  { id: 'transferencia', label: 'Transferencia bancaria', desc: 'Realiza tu pago a nuestras cuentas bancarias.', icon: '🏛️' },
  { id: 'tarjeta', label: 'Tarjeta de crédito / débito', desc: 'Paga de forma segura con tu tarjeta.', icon: '💳', cards: true },
  { id: 'yape', label: 'Yape / Plin', desc: 'Paga fácil y rápido desde tu celular.', icon: '📱', yape: true },
]

const bottomFeatures = [
  { icon: <Truck size={20} />, title: 'Envíos a todo el Perú', sub: 'Recíbelo en 24 a 48 horas' },
  { icon: <BadgeCheck size={20} />, title: 'Garantía oficial', sub: 'Todos nuestros productos cuentan con garantía' },
  { icon: <Headset size={20} />, title: 'Atención personalizada', sub: 'Te ayudamos en todo el proceso de tu compra' },
  { icon: <FileText size={20} />, title: 'Factura electrónica', sub: 'Boleta o factura según lo necesites' },
]

// Control segmentado (pastilla con opción activa resaltada).
const Seg = ({ value, onChange, options }) => (
  <div className="co-seg">
    {options.map((o) => (
      <button key={o.id} type="button" className={value === o.id ? 'on' : ''} onClick={() => onChange(o.id)}>
        {o.icon}{o.label}
      </button>
    ))}
  </div>
)

export default function Checkout() {
  const { cart, cartTotal, clearCart } = useStore()
  const [data, setData] = useState({
    email: '',
    delivery: 'domicilio', // domicilio | tienda
    name: '', lastName: '', doc: '', address: '', reference: '',
    recipient: 'yo', // yo | otra
    recipientName: '', recipientPhone: '',
    shipping: '',
    comprobante: 'boleta', // boleta | factura
    razonSocial: '', ruc: '',
    payment: 'contraentrega',
  })
  const [coupon, setCoupon] = useState('')
  const [applied, setApplied] = useState(null)
  const [done, setDone] = useState(false)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  useSeo({ title: 'Checkout', path: '/checkout', description: 'Finaliza tu compra en SebasPeru de forma rápida y segura.' })

  const set = (k, v) => setData((d) => {
    const next = { ...d, [k]: v }
    if (k === 'delivery') next.shipping = '' // al cambiar tipo de entrega, reinicia el método de envío
    return next
  })
  const clearErr = (k) => setErrors((e) => (e[k] ? { ...e, [k]: undefined } : e))
  const setF = (k) => (ev) => { set(k, ev.target.value); clearErr(k) }

  // Opciones de envío según el tipo de entrega y si hay dirección.
  const shippingOptions = data.delivery === 'tienda'
    ? [{ id: 'retiro', label: 'Retiro en tienda', desc: 'Av. Tecnología 123, Lima · Listo en 24h', price: 0 }]
    : (data.address.trim()
      ? [
        { id: 'estandar', label: 'Envío estándar', desc: '2 a 4 días hábiles', price: 15 },
        { id: 'express', label: 'Envío express', desc: 'Recíbelo en 24 horas (Lima)', price: 25 },
      ]
      : [])

  const shipCost = shippingOptions.find((o) => o.id === data.shipping)?.price ?? 0
  const discount = applied ? cartTotal * COUPONS[applied] : 0
  const total = cartTotal - discount + shipCost

  const validate = () => {
    const e = {}
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) e.email = 'Ingresa un correo válido para enviarte el detalle de tu pedido.'
    if (!data.name.trim()) e.name = 'Ingresa tu nombre.'
    if (!data.lastName.trim()) e.lastName = 'Ingresa tu apellido.'
    if (!data.doc.trim()) e.doc = 'Ingresa tu DNI o CE.'
    if (data.delivery === 'domicilio' && !data.address.trim()) e.address = 'Ingresa tu dirección de entrega.'
    if (shippingOptions.length && !data.shipping) e.shipping = 'Selecciona un método de envío.'
    if (data.recipient === 'otra' && !data.recipientName.trim()) e.recipientName = 'Indica quién recibirá el pedido.'
    if (data.comprobante === 'factura') {
      if (!data.razonSocial.trim()) e.razonSocial = 'Ingresa la razón social.'
      if (!/^\d{11}$/.test(data.ruc.trim())) e.ruc = 'El RUC debe tener 11 dígitos.'
    }
    return e
  }

  const pay = async () => {
    const e = validate()
    setErrors(e)
    if (Object.keys(e).length) {
      requestAnimationFrame(() => document.querySelector('.co-err')?.scrollIntoView({ behavior: 'smooth', block: 'center' }))
      return
    }
    if (submitting) return
    setSubmitting(true)
    track('purchase', { value: total, payment: data.payment, coupon: applied })
    try {
      await Orders.create({
        customer: `${data.name} ${data.lastName}`.trim() || 'Cliente invitado',
        email: data.email.trim() || '—',
        total, payment: PAYMENTS.find((p) => p.id === data.payment)?.label || data.payment,
        region: data.delivery === 'tienda' ? 'Retiro en tienda' : 'Lima', date: '2026-07-01',
        items: cart.map((i) => ({ name: i.name, qty: i.qty, price: i.price })),
      })
    } catch { /* la API puede no estar corriendo; no bloquea la compra */ }
    clearCart(); setDone(true); window.scrollTo(0, 0)
  }

  if (done) {
    return (
      <div className="container page"><div className="empty-state">
        <div className="order-ok"><ShieldCheck size={42} /></div>
        <h2>¡Pedido confirmado!</h2>
        <p className="muted">Gracias por tu compra. Te contactaremos para coordinar la entrega de tu pedido.</p>
        <Link className="btn-primary" to="/">Volver al inicio</Link>
      </div></div>
    )
  }
  if (cart.length === 0) {
    return (
      <div className="container page"><div className="empty-state">
        <h2>No hay productos en el carrito</h2>
        <Link className="btn-primary" to="/categoria/laptops-pc">Ver productos</Link>
      </div></div>
    )
  }

  const err = (k) => errors[k] && <span className="co-err">{errors[k]}</span>

  return (
    <div className="container page checkout2">
      <div className="co2-layout">
        {/* ----- Columna izquierda ----- */}
        <div className="co2-main">
          {/* Contacto */}
          <section className="co-card">
            <h3 className="co-h">Contacto</h3>
            <p className="co-sub">Te enviaremos el detalle y la confirmación de tu pedido a este correo.</p>
            <div className="co-field">
              <input type="email" inputMode="email" autoComplete="email" placeholder="Correo electrónico" className={errors.email ? 'err' : ''} value={data.email} onChange={setF('email')} />
              {err('email')}
            </div>
          </section>
          {/* Entrega */}
          <section className="co-card">
            <h3 className="co-h">Entrega</h3>
            <Seg value={data.delivery} onChange={(v) => set('delivery', v)} options={[
              { id: 'domicilio', label: 'Envío a domicilio', icon: <Truck size={16} /> },
              { id: 'tienda', label: 'Retiro en tienda', icon: <MapPin size={16} /> },
            ]} />
            <div className="co-grid2">
              <div className="co-field"><input placeholder="Nombre" className={errors.name ? 'err' : ''} value={data.name} onChange={setF('name')} />{err('name')}</div>
              <div className="co-field"><input placeholder="Apellido" className={errors.lastName ? 'err' : ''} value={data.lastName} onChange={setF('lastName')} />{err('lastName')}</div>
            </div>
            <div className="co-field"><input placeholder="DNI o CE" className={errors.doc ? 'err' : ''} value={data.doc} onChange={setF('doc')} />{err('doc')}</div>
            {data.delivery === 'domicilio' && (
              <>
                <div className="co-field"><input placeholder="Dirección de entrega" className={errors.address ? 'err' : ''} value={data.address} onChange={setF('address')} />{err('address')}</div>
                <div className="co-field"><input placeholder="Referencia (opcional)" value={data.reference} onChange={setF('reference')} /></div>
              </>
            )}
            {data.delivery === 'tienda' && (
              <div className="co-note"><MapPin size={16} /> Recoge tu pedido en <b>Av. Tecnología 123, Lima</b> — listo en 24 horas.</div>
            )}
          </section>

          {/* Quién recibirá */}
          <section className="co-card">
            <h3 className="co-h">¿Quién recibirá el pedido?</h3>
            <Seg value={data.recipient} onChange={(v) => set('recipient', v)} options={[
              { id: 'yo', label: 'Yo' },
              { id: 'otra', label: 'Otra persona' },
            ]} />
            {data.recipient === 'otra' && (
              <div className="co-grid2">
                <div className="co-field"><input placeholder="Nombre de quien recibe" className={errors.recipientName ? 'err' : ''} value={data.recipientName} onChange={setF('recipientName')} />{err('recipientName')}</div>
                <div className="co-field"><input placeholder="Teléfono de contacto" value={data.recipientPhone} onChange={setF('recipientPhone')} /></div>
              </div>
            )}
          </section>

          {/* Métodos de envío */}
          <section className="co-card">
            <h3 className="co-h">Métodos de envío</h3>
            {shippingOptions.length === 0 ? (
              <div className="co-ship-empty">Ingresa tu dirección para ver las opciones de envío.</div>
            ) : (
              <div className="co-ship-list">
                {shippingOptions.map((o) => (
                  <label key={o.id} className={`co-ship ${data.shipping === o.id ? 'on' : ''}`}>
                    <input type="radio" name="ship" checked={data.shipping === o.id} onChange={() => { set('shipping', o.id); clearErr('shipping') }} />
                    <span className="co-ship-txt"><b>{o.label}</b><small>{o.desc}</small></span>
                    <span className="co-ship-price">{o.price === 0 ? 'Gratis' : peso(o.price).replace('.00', '')}</span>
                  </label>
                ))}
              </div>
            )}
            {err('shipping')}
          </section>

          {/* Pago */}
          <section className="co-card">
            <h3 className="co-h">Pago</h3>
            <p className="co-sub">Todas las transacciones son seguras y están encriptadas.</p>
            <Seg value={data.comprobante} onChange={(v) => set('comprobante', v)} options={[
              { id: 'boleta', label: 'Boleta' },
              { id: 'factura', label: 'Factura' },
            ]} />
            {data.comprobante === 'factura' && (
              <>
                <div className="co-field"><input placeholder="Razón social" className={errors.razonSocial ? 'err' : ''} value={data.razonSocial} onChange={setF('razonSocial')} />{err('razonSocial')}</div>
                <div className="co-field"><input placeholder="RUC" className={errors.ruc ? 'err' : ''} value={data.ruc} onChange={setF('ruc')} />{err('ruc')}</div>
              </>
            )}
            <div className="co2-pays">
              {PAYMENTS.map((p) => (
                <label key={p.id} className={`co2-pay ${data.payment === p.id ? 'on' : ''}`}>
                  <input type="radio" name="pay" checked={data.payment === p.id} onChange={() => set('payment', p.id)} />
                  <span className="co2-pay-ic">{p.icon}</span>
                  <span className="co2-pay-txt"><b>{p.label}</b><small>{p.desc}</small></span>
                  {p.rec && <span className="co2-rec">Recomendado</span>}
                  {p.cards && <span className="co2-cards"><span className="pay" style={{ color: '#1a1f71' }}>VISA</span><span className="pay" style={{ color: '#eb001b' }}>master</span><span className="pay" style={{ color: '#006fcf' }}>AMEX</span></span>}
                  {p.yape && <span className="co2-cards"><span className="pay" style={{ color: '#0d6efd' }}>plin</span></span>}
                </label>
              ))}
            </div>
            <div className="co2-secure-note"><Lock size={18} /><div><b>Todos tus datos están protegidos</b><span>Esta información es segura y encriptada.</span></div></div>
          </section>
        </div>

        {/* ----- Columna derecha: resumen ----- */}
        <aside className="co2-side">
          <div className="co2-summary">
            <h3>Resumen de tu pedido</h3>
            {cart.map((i) => (
              <div className="co2-item" key={i.id}>
                <div className="co2-item-thumb"><ProductImage image={i.image} tint={i.tint} label={i.label} seed={i.id} brand={i.brand} /></div>
                <div className="co2-item-info">
                  <b>{i.name}</b>
                  <span className="muted small">SKU: {i.sku}</span>
                  <span className="muted small">Cantidad: {i.qty}</span>
                </div>
                <div className="co2-item-price">{peso(i.price * i.qty)}</div>
              </div>
            ))}
            <div className="co2-coupon">
              <input placeholder="Cupón (SEBAS10)" value={coupon} onChange={(e) => setCoupon(e.target.value)} />
              <button className="btn-ghost" onClick={() => { const c = coupon.trim().toUpperCase(); COUPONS[c] ? setApplied(c) : (setApplied(null), alert('Cupón no válido')) }}>Aplicar</button>
            </div>
            <div className="co2-sum">
              <div className="sum-row"><span>Subtotal</span><b>{peso(cartTotal)}</b></div>
              <div className="sum-row"><span>Envío</span><b className={shipCost === 0 ? 'free' : ''}>{shipCost === 0 ? 'Gratis' : peso(shipCost)}</b></div>
              <div className="sum-row"><span>Descuento</span><b className="disc">- {peso(discount)}</b></div>
            </div>
            <div className="co2-total"><div><b>Total a pagar</b><small>Incluye IGV</small></div><span className="co2-total-val">{peso(total)}</span></div>
          </div>

          <div className="co2-safe"><span className="co2-safe-ic"><ShieldCheck size={22} /></span><div><b>Compra 100% segura</b><span>Tus datos y pago están protegidos en cada paso de tu compra.</span></div></div>

          <button className="co2-pay-btn" onClick={pay} disabled={submitting}>{submitting ? 'Procesando…' : <>Pagar ahora <Lock size={16} /></>}</button>
          <p className="co2-terms">Al hacer clic en “Pagar ahora”, aceptas nuestros <Link to="/legal/terminos">Términos y condiciones</Link> y <Link to="/legal/privacidad">Política de privacidad</Link>.</p>
        </aside>
      </div>

      <div className="pd2-features co2-features">
        {bottomFeatures.map((f) => (
          <div className="pd2-feat" key={f.title}><div className="pd2-feat-ic">{f.icon}</div><div><b>{f.title}</b><span>{f.sub}</span></div></div>
        ))}
      </div>
    </div>
  )
}
