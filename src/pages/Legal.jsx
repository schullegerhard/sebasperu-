import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Breadcrumbs } from '../components/ui.jsx'
import { useSeo } from '../lib/seo.js'
import { usePage } from '../context/ProductOverrides.jsx'
import { NotFound } from './Misc.jsx'

/* ---------- Libro de Reclamaciones (requisito 12, obligatorio en Perú) ---------- */
function LibroReclamaciones() {
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

const COPY = {
  privacidad: {
    title: 'Política de Privacidad',
    body: [
      'En SebasPeru protegemos tus datos personales conforme a la Ley N.° 29733 de Protección de Datos Personales del Perú.',
      'Recopilamos datos (nombre, correo, teléfono, dirección) únicamente para procesar pedidos, emitir comprobantes electrónicos, brindar soporte y enviarte comunicaciones que autorices.',
      'No compartimos tu información con terceros salvo proveedores logísticos y pasarelas de pago necesarios para completar tu compra.',
      'Puedes ejercer tus derechos ARCO (acceso, rectificación, cancelación y oposición) escribiendo a ventas@sebasperu.com.',
    ],
  },
  cookies: {
    title: 'Política de Cookies',
    body: [
      'Utilizamos cookies propias y de terceros para mejorar tu experiencia, recordar tu carrito, analizar el tráfico (Google Analytics 4, Microsoft Clarity) y personalizar contenido.',
      'Puedes aceptar o rechazar las cookies no esenciales desde el banner de consentimiento. Las cookies estrictamente necesarias permiten el funcionamiento del sitio.',
      'Puedes administrar o eliminar las cookies desde la configuración de tu navegador en cualquier momento.',
    ],
  },
  terminos: {
    title: 'Términos y Condiciones',
    body: [
      'El uso de este sitio implica la aceptación de los presentes términos y condiciones.',
      'Los precios incluyen IGV y están expresados en Soles (S/). Las ofertas son válidas hasta agotar stock.',
      'Aceptamos pagos mediante Mercado Pago, Yape, Plin, transferencia bancaria y tarjetas de crédito/débito.',
      'Emitimos boleta o factura electrónica por todas las compras. Los plazos de entrega dependen del destino y del método de envío seleccionado.',
    ],
  },
  devoluciones: {
    title: 'Política de Cambios y Devoluciones',
    body: [
      'Dispones de 7 días calendario desde la recepción del producto para solicitar un cambio o devolución, siempre que el producto se encuentre en su estado y empaque original.',
      'Los productos con garantía de fábrica (laptops, impresoras, redes) se gestionan según las condiciones de cada marca.',
      'Para iniciar una devolución, escríbenos a ventas@sebasperu.com indicando tu número de pedido.',
      'Los costos de envío de la devolución corren por cuenta del cliente, salvo en casos de producto defectuoso o error en el despacho.',
    ],
  },
  'quienes-somos': {
    title: 'Quiénes somos',
    body: [
      'SebasPeru es una tienda online peruana especializada en tecnología: laptops, impresoras, tóner, tintas, redes y accesorios de las mejores marcas.',
      'Nuestra misión es acercar tecnología confiable a personas y empresas de todo el Perú, con asesoría especializada, factura electrónica y envíos a nivel nacional.',
    ],
  },
  preguntas: {
    title: 'Preguntas frecuentes',
    body: [
      '¿Hacen envíos a todo el Perú? Sí, despachamos a nivel nacional mediante agencias de transporte.',
      '¿Emiten factura? Sí, emitimos boleta y factura electrónica para personas y empresas.',
      '¿Qué métodos de pago aceptan? Mercado Pago, Yape, Plin, transferencia y tarjetas.',
      '¿Los productos tienen garantía? Sí, todos cuentan con garantía según la marca y categoría.',
    ],
  },
}

export default function Legal() {
  const { page } = useParams()
  const isLR = page === 'libro-reclamaciones'
  // Página gestionada desde el admin (Admin → Páginas). Si no existe, se usa el
  // texto por defecto (COPY). El body gestionado es HTML del editor.
  const managed = usePage(page)
  const copy = COPY[page]
  const title = isLR ? 'Libro de Reclamaciones' : (managed?.title || copy?.title)

  useSeo({
    title,
    path: `/legal/${page}`,
    description: isLR ? 'Libro de Reclamaciones virtual de SebasPeru.' : (managed?.title || copy?.body?.[0]),
  })

  if (!isLR && !managed && !copy) return <NotFound />

  return (
    <div className="container page legal-page">
      <Breadcrumbs items={[{ label: 'Inicio', to: '/' }, { label: title }]} />
      <h1 className="page-title">{title}</h1>
      {isLR ? <LibroReclamaciones /> : (
        <div className="legal-body">
          {managed?.body
            ? <div className="legal-html" dangerouslySetInnerHTML={{ __html: managed.body }} />
            : copy.body.map((p, i) => <p key={i}>{p}</p>)}
          <p className="muted small legal-updated">Para consultas escríbenos a ventas@sebasperu.com.</p>
        </div>
      )}
    </div>
  )
}
