'use client'
import { useState } from 'react'
import { FileText } from './Icons.jsx'
import { sendQuote } from '../lib/client.js'

const EMPTY = { name: '', company: '', ruc: '', email: '', phone: '', product: '', qty: '', message: '', website: '' }

export default function QuoteClient() {
  const [form, setForm] = useState(EMPTY)
  const [sent, setSent] = useState(false)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    setErr(''); setBusy(true)
    try { await sendQuote(form); setSent(true); window.scrollTo(0, 0) }
    catch (x) { setErr(x.message || 'No se pudo enviar la solicitud.') }
    finally { setBusy(false) }
  }

  if (sent) return (
    <div className="empty-state">
      <div className="order-ok"><FileText size={40} /></div>
      <h2>¡Cotización enviada!</h2>
      <p className="muted">Un asesor de SebasPeru se pondrá en contacto contigo en menos de 24 horas hábiles.</p>
    </div>
  )

  return (
    <form className="co-card form-card" onSubmit={submit}>
      <div className="form-grid">
        <label>Nombre completo *<input required value={form.name} onChange={set('name')} /></label>
        <label>Empresa<input value={form.company} onChange={set('company')} /></label>
        <label>RUC<input value={form.ruc} onChange={set('ruc')} /></label>
        <label>Correo *<input type="email" required value={form.email} onChange={set('email')} /></label>
        <label>Teléfono *<input required value={form.phone} onChange={set('phone')} /></label>
        <label>Producto / SKU<input value={form.product} onChange={set('product')} /></label>
        <label>Cantidad<input type="number" min="1" value={form.qty} onChange={set('qty')} /></label>
        <label className="col-span">Mensaje<textarea rows="4" value={form.message} onChange={set('message')} /></label>
        {/* Honeypot anti-spam: oculto para personas, lo llenan los bots. */}
        <input type="text" className="hp-field" tabIndex={-1} autoComplete="off" aria-hidden="true"
          value={form.website} onChange={set('website')} />
      </div>
      {err && <p className="co-err">{err}</p>}
      <button className="btn-primary" type="submit" disabled={busy}>{busy ? 'Enviando…' : 'Enviar solicitud'}</button>
    </form>
  )
}
