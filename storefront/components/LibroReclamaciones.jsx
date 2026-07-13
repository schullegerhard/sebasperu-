'use client'
import { useState } from 'react'

// Libro de Reclamaciones virtual (obligatorio en Perú, Ley N.° 29571).
export default function LibroReclamaciones() {
  const [sent, setSent] = useState(false)
  if (sent) {
    return (
      <div className="empty-state">
        <h2>Reclamo registrado</h2>
        <p className="muted">Hemos recibido tu reclamo. Recibirás respuesta en un plazo máximo de 15 días hábiles, conforme al Código de Protección y Defensa del Consumidor.</p>
      </div>
    )
  }
  return (
    <form className="co-card form-card" onSubmit={(e) => { e.preventDefault(); setSent(true) }}>
      <p className="muted">Conforme al Código de Protección y Defensa del Consumidor (Ley N.° 29571), SebasPeru pone a tu disposición este Libro de Reclamaciones virtual.</p>
      <h3>1. Identificación del consumidor</h3>
      <div className="form-grid">
        <label>Nombre completo *<input required /></label>
        <label>DNI / CE *<input required /></label>
        <label>Correo *<input type="email" required /></label>
        <label>Teléfono<input /></label>
        <label className="col-span">Domicilio<input /></label>
      </div>
      <h3>2. Detalle del reclamo</h3>
      <div className="form-grid">
        <label>Tipo
          <select><option>Reclamo</option><option>Queja</option></select>
        </label>
        <label>Pedido N.°<input /></label>
        <label className="col-span">Detalle *<textarea rows="4" required /></label>
        <label className="col-span">Pedido del consumidor<textarea rows="3" /></label>
      </div>
      <button className="btn-primary" type="submit">Enviar reclamo</button>
    </form>
  )
}
