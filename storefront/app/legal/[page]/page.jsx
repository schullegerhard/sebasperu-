import { notFound } from 'next/navigation'
import { getPageBySlug, getPages } from '../../../lib/data.js'
import { ORIGIN } from '../../../lib/seo.js'

export const revalidate = 300

// Texto por defecto (respaldo) si la API no responde o la página no existe en BD.
const COPY = {
  privacidad: { title: 'Política de Privacidad', body: ['En SebasPeru protegemos tus datos personales conforme a la Ley N.° 29733 del Perú.', 'Usamos tus datos únicamente para procesar pedidos, emitir comprobantes y brindar soporte.'] },
  terminos: { title: 'Términos y Condiciones', body: ['El uso de este sitio implica la aceptación de los términos y condiciones.', 'Los precios incluyen IGV y están en Soles (S/). Emitimos boleta o factura electrónica.'] },
  devoluciones: { title: 'Política de Cambios y Devoluciones', body: ['Dispones de 7 días calendario para cambios o devoluciones con el empaque original.', 'Los productos cuentan con garantía oficial de marca.'] },
  envios: { title: 'Política de Envíos', body: ['Realizamos envíos a todo el Perú. En Lima entregamos en 24 a 48 horas.', 'El costo de envío depende del destino y del peso del pedido.'] },
  'quienes-somos': { title: 'Quiénes somos', body: ['SebasPeru es una tienda online peruana especializada en tecnología para personas y empresas.', 'Ofrecemos asesoría especializada, factura electrónica y envíos a todo el Perú.'] },
  preguntas: { title: 'Preguntas frecuentes', body: ['¿Hacen envíos a todo el Perú? Sí, despachamos a nivel nacional.', '¿Qué métodos de pago aceptan? Mercado Pago, Yape, Plin, transferencia y tarjetas.'] },
  cookies: { title: 'Política de Cookies', body: ['Usamos cookies para mejorar tu experiencia, recordar tu carrito y analizar el tráfico.', 'Puedes administrar o eliminar las cookies desde la configuración de tu navegador.'] },
}

// SSG: pre-genera las páginas gestionadas (o las del respaldo) en build.
export async function generateStaticParams() {
  const pages = await getPages()
  const slugs = pages.length ? pages.map((p) => p.slug) : Object.keys(COPY)
  return slugs.map((page) => ({ page }))
}

export async function generateMetadata({ params }) {
  const { page } = await params
  const managed = await getPageBySlug(page)
  const c = COPY[page]
  const title = managed?.title || c?.title
  if (!title) return { title: 'Legal' }
  // Descripción dinámica a partir del contenido de la página (HTML gestionado o
  // el texto por defecto), recortada para el snippet de buscadores.
  const raw = managed?.body ? managed.body.replace(/<[^>]+>/g, ' ') : (c?.body?.join(' ') || '')
  const description = raw.replace(/\s+/g, ' ').trim().slice(0, 155)
  return {
    title, description,
    alternates: { canonical: `/legal/${page}` },
    openGraph: { title, description, url: `${ORIGIN}/legal/${page}` },
  }
}

export default async function Legal({ params }) {
  const { page } = await params
  const managed = await getPageBySlug(page)
  const c = COPY[page]
  if (!managed && !c) notFound()
  const title = managed?.title || c.title

  return (
    <div className="container page legal-page">
      <h1 className="page-title" style={{ marginBottom: 16 }}>{title}</h1>
      <div className="legal-body">
        {managed?.body
          ? <div className="legal-html" dangerouslySetInnerHTML={{ __html: managed.body }} />
          : c.body.map((p, i) => <p key={i}>{p}</p>)}
        <p className="muted small legal-updated">Para consultas escríbenos a ventas@sebasperu.com.</p>
      </div>
    </div>
  )
}
