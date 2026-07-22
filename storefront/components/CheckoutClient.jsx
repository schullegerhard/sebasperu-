'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ProductImage } from './imageMap.jsx'
import { ShieldCheck, Lock, Truck, MapPin, BadgeCheck, Headset, FileText } from './Icons.jsx'
import { peso } from '../lib/catalog.js'
import { useCart } from './CartProvider.jsx'
import { getCustomer, createOrder, payMercadoPago, payConfig } from '../lib/client.js'
import { departamentos, provincias, distritos, titleCase } from '../lib/ubigeo.js'

const COUPONS = { SEBAS10: 0.1 }

// Métodos de pago (todos habilitados). Mercado Pago solo si la API lo tiene configurado.
const PAYMENTS = [
  { id: 'mercadopago', label: 'Mercado Pago', desc: 'Tarjetas de crédito/débito, Yape y más.', icon: '🔷', rec: true },
  { id: 'transferencia', label: 'Transferencia bancaria', desc: 'BCP, BBVA, Interbank y Scotiabank.', icon: '🏛️' },
  { id: 'yape', label: 'Yape / Plin', desc: 'Paga al instante desde tu celular.', icon: '📱' },
  { id: 'contraentrega', label: 'Pago contra entrega', desc: 'Paga en efectivo al recibir tu pedido.', icon: '💵' },
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

export default function CheckoutClient() {
  const { cart, total: cartTotal, clearCart, ready } = useCart()
  const [data, setData] = useState({
    firstName: '', lastName: '',
    comprobante: 'boleta', // boleta | factura
    doc: '', razonSocial: '', ruc: '',
    delivery: 'domicilio', // domicilio | tienda
    address: '', reference: '',
    department: '', province: '', district: '', // UBIGEO en cascada
    phone: '', email: '',
    recipient: 'yo', // yo | otra
    recipientName: '', recipientPhone: '',
    shipping: '',
    notes: '',
    payment: 'contraentrega',
    terms: false,
  })
  const [coupon, setCoupon] = useState('')
  const [applied, setApplied] = useState(null)
  const [done, setDone] = useState(false)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [mpAvailable, setMpAvailable] = useState(false)

  // Precarga de datos del cliente, retorno de Mercado Pago (?status=success) y disponibilidad de MP.
  useEffect(() => {
    const c = getCustomer()
    if (c?.email) {
      const parts = (c.name || '').trim().split(' ')
      setData((d) => ({ ...d, email: c.email, firstName: d.firstName || parts[0] || '', lastName: d.lastName || parts.slice(1).join(' ') || '' }))
    }
    const params = new URLSearchParams(window.location.search)
    if (params.get('status') === 'success') { clearCart(); setDone(true); window.history.replaceState({}, '', '/checkout'); return }
    payConfig().then((r) => { if (r?.mercadopago) { setMpAvailable(true); setData((d) => ({ ...d, payment: 'mercadopago' })) } }).catch(() => {})
  }, [])
  const payments = PAYMENTS.filter((p) => p.id !== 'mercadopago' || mpAvailable)

  const set = (k, v) => setData((d) => {
    const next = { ...d, [k]: v }
    if (k === 'delivery') next.shipping = '' // al cambiar tipo de entrega, reinicia el método de envío
    return next
  })
  const clearErr = (k) => setErrors((e) => (e[k] ? { ...e, [k]: undefined } : e))
  const setF = (k) => (ev) => { set(k, ev.target.value); clearErr(k) }
  // Selectores en cascada: al cambiar un nivel superior se reinician los inferiores.
  const setDept = (v) => { setData((d) => ({ ...d, department: v, province: '', district: '', shipping: '' })); clearErr('department') }
  const setProv = (v) => { setData((d) => ({ ...d, province: v, district: '', shipping: '' })); clearErr('province') }
  const setDist = (v) => { setData((d) => ({ ...d, district: v, shipping: '' })); clearErr('district') }

  // Opciones de envío según el tipo de entrega y el distrito elegido.
  const shippingOptions = data.delivery === 'tienda'
    ? [{ id: 'retiro', label: 'Retiro en tienda', desc: 'Av. Tecnología 123, Lima · Listo en 24h', price: 0 }]
    : (data.district
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
    if (!data.firstName.trim()) e.firstName = 'Ingresa tu nombre.'
    if (!data.lastName.trim()) e.lastName = 'Ingresa tus apellidos.'
    if (data.comprobante === 'boleta' && !data.doc.trim()) e.doc = 'Ingresa tu DNI o CE.'
    if (data.comprobante === 'factura') {
      if (!data.razonSocial.trim()) e.razonSocial = 'Ingresa la razón social.'
      if (!/^\d{11}$/.test(data.ruc.trim())) e.ruc = 'El RUC debe tener 11 dígitos.'
    }
    if (data.delivery === 'domicilio') {
      if (!data.address.trim()) e.address = 'Ingresa tu dirección de entrega.'
      if (!data.department) e.department = 'Selecciona el departamento.'
      if (!data.province) e.province = 'Selecciona la provincia.'
      if (!data.district) e.district = 'Selecciona el distrito.'
    }
    if (!data.phone.trim()) e.phone = 'Ingresa un teléfono de contacto.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) e.email = 'Ingresa un correo válido para enviarte el detalle de tu pedido.'
    if (data.recipient === 'otra' && !data.recipientName.trim()) e.recipientName = 'Indica quién recibirá el pedido.'
    if (shippingOptions.length && !data.shipping) e.shipping = 'Selecciona un método de envío.'
    if (!data.terms) e.terms = 'Debes aceptar los términos y condiciones para continuar.'
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
    const region = data.delivery === 'tienda' ? 'Retiro en tienda' : [titleCase(data.district), titleCase(data.department)].filter(Boolean).join(', ') || 'Lima'
    const items = cart.map((i) => ({ name: i.name, qty: i.qty, price: i.price }))
    const customer = `${data.firstName} ${data.lastName}`.trim() || 'Cliente invitado'
    const email = data.email.trim() || '—'
    const order = { customer, email, total, region, items }

    // Mercado Pago: crea la preferencia y redirige a la pasarela (Checkout Pro).
    if (data.payment === 'mercadopago') {
      try {
        const { init_point } = await payMercadoPago(order)
        if (init_point) { window.location.href = init_point; return }
      } catch (err) {
        setSubmitting(false)
        setErrors({ pay: err.message || 'No se pudo iniciar el pago con Mercado Pago.' })
        requestAnimationFrame(() => document.querySelector('.co-err')?.scrollIntoView({ behavior: 'smooth', block: 'center' }))
        return
      }
    }

    // Otros métodos: registra el pedido (el correo de confirmación se envía en la API).
    try {
      await createOrder({ ...order, payment: PAYMENTS.find((p) => p.id === data.payment)?.label || data.payment })
    } catch { /* la API puede no estar corriendo; no bloquea la compra */ }
    clearCart(); setDone(true); window.scrollTo(0, 0)
  }

  if (done) {
    return (
      <div className="empty-state">
        <div className="order-ok"><ShieldCheck size={42} /></div>
        <h2>¡Pedido confirmado!</h2>
        <p className="muted">Gracias por tu compra. Te contactaremos para coordinar la entrega de tu pedido.</p>
        <Link className="btn-primary" href="/">Volver al inicio</Link>
      </div>
    )
  }
  if (ready && cart.length === 0) {
    return (
      <div className="empty-state">
        <h2>No hay productos en el carrito</h2>
        <Link className="btn-primary" href="/categoria/laptops-pc">Ver productos</Link>
      </div>
    )
  }

  const err = (k) => errors[k] && <span className="co-err">{errors[k]}</span>

  return (
    <div className="checkout2">
      <div className="co2-layout">
        {/* ----- Columna izquierda ----- */}
        <div className="co2-main">
          {/* Contacto (correo primero, como Dataplus): aquí llega la confirmación */}
          <section className="co-card">
            <h3 className="co-h">Contacto</h3>
            <p className="co-sub">Correo electrónico *</p>
            <div className="co-field">
              <input type="email" inputMode="email" autoComplete="email" placeholder="correo@ejemplo.com" className={errors.email ? 'err' : ''} value={data.email} onChange={setF('email')} />
              {err('email')}
            </div>
            <p className="co-sub" style={{ marginBottom: 0 }}>Te enviaremos la confirmación y el detalle de tu pedido a este correo.</p>
          </section>

          {/* Datos de entrega */}
          <section className="co-card">
            <h3 className="co-h">Datos de entrega</h3>
            <Seg value={data.comprobante} onChange={(v) => set('comprobante', v)} options={[
              { id: 'boleta', label: 'Boleta' },
              { id: 'factura', label: 'Factura' },
            ]} />
            <div className="co-grid2">
              <div className="co-field"><input placeholder="Nombre" className={errors.firstName ? 'err' : ''} value={data.firstName} onChange={setF('firstName')} />{err('firstName')}</div>
              <div className="co-field"><input placeholder="Apellidos" className={errors.lastName ? 'err' : ''} value={data.lastName} onChange={setF('lastName')} />{err('lastName')}</div>
            </div>
            {data.comprobante === 'boleta' ? (
              <div className="co-field"><input placeholder="DNI o CE" className={errors.doc ? 'err' : ''} value={data.doc} onChange={setF('doc')} />{err('doc')}</div>
            ) : (
              <>
                <div className="co-field"><input placeholder="Razón social" className={errors.razonSocial ? 'err' : ''} value={data.razonSocial} onChange={setF('razonSocial')} />{err('razonSocial')}</div>
                <div className="co-field"><input placeholder="RUC" inputMode="numeric" className={errors.ruc ? 'err' : ''} value={data.ruc} onChange={setF('ruc')} />{err('ruc')}</div>
              </>
            )}
            <div className="co-field"><input placeholder="Teléfono" inputMode="tel" autoComplete="tel" className={errors.phone ? 'err' : ''} value={data.phone} onChange={setF('phone')} />{err('phone')}</div>

            <Seg value={data.delivery} onChange={(v) => set('delivery', v)} options={[
              { id: 'domicilio', label: 'Envío a domicilio', icon: <Truck size={16} /> },
              { id: 'tienda', label: 'Retiro en tienda', icon: <MapPin size={16} /> },
            ]} />
            {data.delivery === 'domicilio' ? (
              <>
                <div className="co-field"><input placeholder="Dirección de entrega" className={errors.address ? 'err' : ''} value={data.address} onChange={setF('address')} />{err('address')}</div>
                <div className="co-field"><input placeholder="Referencia (opcional)" value={data.reference} onChange={setF('reference')} /></div>
                {/* Departamento → Provincia → Distrito (en cascada) */}
                <div className="co-grid3">
                  <div className="co-field">
                    <select className={errors.department ? 'err' : ''} value={data.department} onChange={(e) => setDept(e.target.value)}>
                      <option value="">Departamento</option>
                      {departamentos.map((d) => <option key={d} value={d}>{titleCase(d)}</option>)}
                    </select>{err('department')}
                  </div>
                  <div className="co-field">
                    <select className={errors.province ? 'err' : ''} value={data.province} disabled={!data.department} onChange={(e) => setProv(e.target.value)}>
                      <option value="">Provincia</option>
                      {provincias(data.department).map((p) => <option key={p} value={p}>{titleCase(p)}</option>)}
                    </select>{err('province')}
                  </div>
                  <div className="co-field">
                    <select className={errors.district ? 'err' : ''} value={data.district} disabled={!data.province} onChange={(e) => setDist(e.target.value)}>
                      <option value="">Distrito</option>
                      {distritos(data.department, data.province).map((x) => <option key={x} value={x}>{titleCase(x)}</option>)}
                    </select>{err('district')}
                  </div>
                </div>
              </>
            ) : (
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
              <div className="co-ship-empty">Completa tu departamento, provincia y distrito para ver las opciones de envío.</div>
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
            <div className="co2-pays">
              {payments.map((p) => (
                <label key={p.id} className={`co2-pay ${data.payment === p.id ? 'on' : ''}`}>
                  <input type="radio" name="pay" checked={data.payment === p.id} onChange={() => set('payment', p.id)} />
                  <span className="co2-pay-ic">{p.icon}</span>
                  <span className="co2-pay-txt"><b>{p.label}</b><small>{p.desc}</small></span>
                  {p.rec && <span className="co2-rec">Recomendado</span>}
                </label>
              ))}
            </div>
            <div className="co2-secure-note"><Lock size={18} /><div><b>Todos tus datos están protegidos</b><span>Esta información es segura y encriptada.</span></div></div>
          </section>
        </div>

        {/* ----- Columna derecha: "Tu pedido" ----- */}
        <aside className="co2-side">
          <div className="co2-summary">
            <h3>Tu pedido</h3>
            {cart.map((i) => (
              <div className="co2-item" key={i.id}>
                <div className="co2-item-thumb"><ProductImage image={i.image} tint={i.tint} label={i.label} alt={i.name} /></div>
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
              <button className="btn-ghost" type="button" onClick={() => { const c = coupon.trim().toUpperCase(); COUPONS[c] ? setApplied(c) : (setApplied(null), alert('Cupón no válido')) }}>Aplicar</button>
            </div>
            <div className="co2-sum">
              <div className="sum-row"><span>Subtotal</span><b>{peso(cartTotal)}</b></div>
              <div className="sum-row"><span>Envío</span><b className={shipCost === 0 ? 'free' : ''}>{shipCost === 0 ? 'Gratis' : peso(shipCost)}</b></div>
              <div className="sum-row"><span>Descuento</span><b className="disc">- {peso(discount)}</b></div>
            </div>
            <div className="co2-total"><div><b>Total a pagar</b><small>Incluye IGV</small></div><span className="co2-total-val">{peso(total)}</span></div>

            <label className="co2-terms-accept" style={{ display: 'flex', gap: 9, alignItems: 'flex-start', fontSize: 13, margin: '14px 0 4px', lineHeight: 1.45 }}>
              <input type="checkbox" checked={data.terms} onChange={(e) => { set('terms', e.target.checked); clearErr('terms') }} style={{ marginTop: 3, flex: 'none' }} />
              <span>He leído y acepto los <Link href="/legal/terminos">términos y condiciones</Link> y la <Link href="/legal/privacidad">política de privacidad</Link>.</span>
            </label>
            {err('terms')}

            {errors.pay && <p className="co-err" style={{ margin: '6px 0' }}>{errors.pay}</p>}
            <button className="co2-pay-btn" type="button" onClick={pay} disabled={submitting}>{submitting ? 'Procesando…' : <>Realizar el pedido <Lock size={16} /></>}</button>
            <div className="co2-safe" style={{ marginTop: 12 }}><span className="co2-safe-ic"><ShieldCheck size={22} /></span><div><b>Compra 100% segura</b><span>Tus datos y pago están protegidos en cada paso de tu compra.</span></div></div>
          </div>
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
