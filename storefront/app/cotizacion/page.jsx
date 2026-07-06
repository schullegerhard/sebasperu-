export const metadata = {
  title: 'Solicitar cotización',
  description: 'Solicita una cotización para empresas en SebasPeru: equipos, suministros y facturación a tu medida.',
  alternates: { canonical: '/cotizacion' },
}
export default function Cotizacion() {
  return (
    <div className="container page">
      <h1 className="page-title" style={{ marginBottom: 6 }}>Solicitar cotización</h1>
      <p className="muted lead">Cuéntanos qué necesitas y te enviaremos una propuesta a tu medida con factura electrónica.</p>
      <form className="co-card form-card">
        <div className="form-grid">
          <label>Nombre completo *<input /></label><label>Empresa<input /></label>
          <label>RUC<input /></label><label>Correo *<input type="email" /></label>
          <label>Teléfono *<input /></label><label>Producto / SKU<input /></label>
          <label className="col-span">Mensaje<textarea rows="4" /></label>
        </div>
        <button className="btn-primary" type="button">Enviar solicitud</button>
      </form>
    </div>
  )
}
