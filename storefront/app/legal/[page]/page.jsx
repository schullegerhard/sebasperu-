import { notFound } from 'next/navigation'

const COPY = {
  privacidad: { title: 'Política de Privacidad', body: ['En SebasPeru protegemos tus datos personales conforme a la Ley N.° 29733 del Perú.', 'Usamos tus datos únicamente para procesar pedidos, emitir comprobantes y brindar soporte.'] },
  terminos: { title: 'Términos y Condiciones', body: ['El uso de este sitio implica la aceptación de los términos y condiciones.', 'Los precios incluyen IGV y están en Soles (S/). Emitimos boleta o factura electrónica.'] },
  devoluciones: { title: 'Política de Cambios y Devoluciones', body: ['Dispones de 7 días calendario para cambios o devoluciones con el empaque original.', 'Los productos cuentan con garantía oficial de marca.'] },
  'quienes-somos': { title: 'Quiénes somos', body: ['SebasPeru es una tienda online peruana especializada en tecnología para personas y empresas.', 'Ofrecemos asesoría especializada, factura electrónica y envíos a todo el Perú.'] },
  preguntas: { title: 'Preguntas frecuentes', body: ['¿Hacen envíos a todo el Perú? Sí, despachamos a nivel nacional.', '¿Qué métodos de pago aceptan? Mercado Pago, Yape, Plin, transferencia y tarjetas.'] },
}

export function generateStaticParams() { return Object.keys(COPY).map((page) => ({ page })) }
export function generateMetadata({ params }) {
  const c = COPY[params.page]
  return c ? { title: c.title, description: c.body[0], alternates: { canonical: `/legal/${params.page}` } } : { title: 'Legal' }
}

export default function Legal({ params }) {
  const c = COPY[params.page]
  if (!c) notFound()
  return (
    <div className="container page legal-page">
      <h1 className="page-title" style={{ marginBottom: 16 }}>{c.title}</h1>
      <div className="legal-body">{c.body.map((p, i) => <p key={i}>{p}</p>)}</div>
    </div>
  )
}
