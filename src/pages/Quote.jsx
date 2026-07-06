import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Breadcrumbs } from '../components/ui.jsx'
import { FileText } from '../components/Icons.jsx'
import { useSeo } from '../lib/seo.js'
import { track } from '../lib/analytics.js'

// Solicitud de cotización para empresas (requisito 11).
export default function Quote() {
  const [sp] = useSearchParams()
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({
    name: '', company: '', ruc: '', email: '', phone: '',
    product: sp.get('producto') || '', qty: 1, message: '',
    // honeypot anti-spam (requisito 9): campo oculto que los bots rellenan.
    website: '',
  })
  useSeo({ title: 'Solicitud de cotización', path: '/cotizacion', description: 'Solicita una cotización para empresas en SebasPeru: equipos, suministros y facturación a tu medida.' })

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))
  const submit = (e) => {
    e.preventDefault()
    if (form.website) return // bot
    track('generate_lead', { product: form.product, qty: form.qty })
    setSent(true)
  }

  if (sent) {
    return (
      <div className="container page">
        <div className="empty-state">
          <div className="order-ok"><FileText size={40} /></div>
          <h2>¡Cotización enviada!</h2>
          <p className="muted">Un asesor de SebasPeru se pondrá en contacto contigo en menos de 24 horas hábiles.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container page">
      <Breadcrumbs items={[{ label: 'Inicio', to: '/' }, { label: 'Cotización' }]} />
      <h1 className="page-title">Solicitar cotización</h1>
      <p className="muted lead">Cuéntanos qué necesitas y te enviaremos una propuesta a tu medida con factura electrónica.</p>

      <form className="co-card form-card" onSubmit={submit}>
        <div className="form-grid">
          <label>Nombre completo *<input required value={form.name} onChange={(e) => set('name', e.target.value)} /></label>
          <label>Empresa<input value={form.company} onChange={(e) => set('company', e.target.value)} /></label>
          <label>RUC<input value={form.ruc} onChange={(e) => set('ruc', e.target.value)} /></label>
          <label>Correo *<input type="email" required value={form.email} onChange={(e) => set('email', e.target.value)} /></label>
          <label>Teléfono *<input required value={form.phone} onChange={(e) => set('phone', e.target.value)} /></label>
          <label>Producto / SKU<input value={form.product} onChange={(e) => set('product', e.target.value)} /></label>
          <label>Cantidad<input type="number" min="1" value={form.qty} onChange={(e) => set('qty', e.target.value)} /></label>
          <label className="col-span">Mensaje<textarea rows="4" value={form.message} onChange={(e) => set('message', e.target.value)} /></label>
          <input type="text" className="hp-field" tabIndex="-1" autoComplete="off"
            value={form.website} onChange={(e) => set('website', e.target.value)} aria-hidden="true" />
        </div>
        <button className="btn-primary" type="submit">Enviar solicitud</button>
      </form>
    </div>
  )
}
