import QuoteClient from '../../components/QuoteClient.jsx'

// Revalidación corta: sin esto la página es 100% estática y se sirve con
// Cache-Control s-maxage de 1 año → tras un redeploy la caché seguiría
// mostrando la versión anterior.
export const revalidate = 300

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
      <QuoteClient />
    </div>
  )
}
