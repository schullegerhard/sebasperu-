import QuoteClient from '../../components/QuoteClient.jsx'

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
