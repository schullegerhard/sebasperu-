import Link from 'next/link'
import { Lock, ShieldCheck, Truck, Headset } from './Icons.jsx'

const PaymentMarks = () => (
  <div className="foot-pay">
    <svg viewBox="0 0 48 30" className="pm" aria-label="American Express"><rect width="48" height="30" rx="4" fill="#1F72CD" /><text x="24" y="13.5" textAnchor="middle" fill="#fff" fontFamily="Arial" fontWeight="700" fontSize="7">AMERICAN</text><text x="24" y="22" textAnchor="middle" fill="#fff" fontFamily="Arial" fontWeight="700" fontSize="7">EXPRESS</text></svg>
    <svg viewBox="0 0 48 30" className="pm" aria-label="Diners Club"><rect width="48" height="30" rx="4" fill="#fff" stroke="#e2e8f0" /><circle cx="20" cy="15" r="9" fill="none" stroke="#0079BE" strokeWidth="2.5" /><text x="32" y="18" textAnchor="middle" fill="#0079BE" fontFamily="Arial" fontWeight="700" fontSize="6">DINERS</text></svg>
    <svg viewBox="0 0 48 30" className="pm" aria-label="Mastercard"><rect width="48" height="30" rx="4" fill="#fff" stroke="#e2e8f0" /><circle cx="20" cy="15" r="8" fill="#EB001B" /><circle cx="28" cy="15" r="8" fill="#F79E1B" fillOpacity="0.85" /></svg>
    <svg viewBox="0 0 48 30" className="pm" aria-label="Visa"><rect width="48" height="30" rx="4" fill="#fff" stroke="#e2e8f0" /><text x="24" y="20" textAnchor="middle" fill="#1A1F71" fontFamily="Arial" fontWeight="800" fontStyle="italic" fontSize="13">VISA</text></svg>
  </div>
)

const footTrust = [
  { icon: <Truck size={22} />, label: 'ENTREGAS NACIONALES' },
  { icon: <ShieldCheck size={22} />, label: 'GARANTÍA EN TUS COMPRAS' },
  { icon: <Headset size={22} />, label: 'ASESORÍA OPORTUNA' },
  { icon: <Lock size={22} />, label: 'PAGOS SEGUROS Y FLEXIBLES' },
]

const columns = [
  { title: 'Mi cuenta', links: [['Mis pedidos', '/cuenta'], ['Mis direcciones', '/cuenta'], ['Cambiar contraseña', '/cuenta'], ['Crear cuenta', '/cuenta']] },
  { title: 'La empresa', links: [['Sobre nosotros', '/legal/quienes-somos'], ['Nuestra tienda', '/legal/quienes-somos'], ['Contacto', '/cotizacion'], ['Ventas corporativas', '/cotizacion']] },
  { title: 'Ayuda al cliente', links: [['Preguntas frecuentes', '/legal/preguntas'], ['Cobertura de envíos', '/legal/devoluciones'], ['Seguimiento de pedido', '/cuenta'], ['Escríbenos por WhatsApp', 'https://wa.me/51925552042']] },
  { title: 'Legales', links: [['Política de privacidad', '/legal/privacidad'], ['Política de devoluciones', '/legal/devoluciones'], ['Términos y condiciones', '/legal/terminos'], ['Política de envíos', '/legal/devoluciones']] },
]

export default function Footer() {
  return (
    <footer className="footer2">
      <div className="container">
        <div className="foot-trust-cards">
          {footTrust.map((t) => (
            <div className="foot-trust-card" key={t.label}>{t.icon}<span>{t.label}</span></div>
          ))}
        </div>
        <div className="footer2-grid">
          <div className="footer2-news">
            <h4>Suscríbete a nuestro newsletter</h4>
            <p>Al suscribirte, aceptas nuestros términos de servicio y política de privacidad. Puedes darte de baja en cualquier momento.</p>
            <form className="news2"><input type="email" placeholder="Correo electrónico" /><button type="button">Suscribirme</button></form>
            <label className="news2-check"><input type="checkbox" /> Acepto los <Link href="/legal/terminos">términos y políticas</Link> del sitio</label>
          </div>
          {columns.map((c) => (
            <div className="footer2-col" key={c.title}>
              <h4>{c.title}</h4>
              <ul>{c.links.map(([label, to]) => <li key={label}>{to.startsWith('http') ? <a href={to}>{label}</a> : <Link href={to}>{label}</Link>}</li>)}</ul>
            </div>
          ))}
        </div>
      </div>
      <div className="footer2-bottom">
        <div className="container">
          <span className="copy">© SEBASTPERU 2025</span>
          <PaymentMarks />
        </div>
      </div>
    </footer>
  )
}
