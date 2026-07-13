'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Lock, ShieldCheck, Truck, Headset, Facebook, Instagram, Youtube, Mail } from './Icons.jsx'

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
  { title: 'Ayuda al cliente', links: [['Preguntas frecuentes', '/legal/preguntas'], ['Cobertura de envíos', '/legal/envios'], ['Seguimiento de pedido', '/cuenta'], ['Escríbenos por WhatsApp', 'https://wa.me/51925552042']] },
  { title: 'Legales', links: [['Política de privacidad', '/legal/privacidad'], ['Política de devoluciones', '/legal/devoluciones'], ['Términos y condiciones', '/legal/terminos'], ['Política de envíos', '/legal/envios']] },
]

export default function Footer() {
  const [email, setEmail] = useState('')
  const [accept, setAccept] = useState(false)
  const submit = (e) => { e.preventDefault(); if (accept) { setEmail(''); alert('¡Suscripción registrada!') } }

  return (
    <footer className="footer2">
      <div className="foot-trust-band">
        <div className="container foot-trust-cards">
          {footTrust.map((t) => (
            <div className="foot-trust-card" key={t.label}>{t.icon}<span>{t.label}</span></div>
          ))}
        </div>
      </div>
      <div className="container">
        <div className="footer2-grid">
          <div className="footer2-news">
            <img src="/logo.png" alt="SEBASTPERU" className="footer2-logo" width="170" height="40" />
            <h4>Suscríbete a nuestro newsletter</h4>
            <p>Al suscribirte, aceptas nuestros términos de servicio y política de privacidad. Puedes darte de baja en cualquier momento.</p>
            <form className="news2" onSubmit={submit}>
              <Mail size={14} className="news2-mail" />
              <input type="email" required placeholder="Correo electrónico" value={email} onChange={(e) => setEmail(e.target.value)} />
              <button type="submit">Suscribirme</button>
            </form>
            <label className="news2-check">
              <input type="checkbox" checked={accept} onChange={(e) => setAccept(e.target.checked)} />
              <span>Acepto los <Link href="/legal/terminos">términos y políticas</Link> del sitio.</span>
            </label>
            <div className="footer2-social">
              <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook"><Facebook size={17} /></a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram"><Instagram size={17} /></a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube"><Youtube size={17} /></a>
            </div>
          </div>

          {columns.map((c) => (
            <div className="footer2-col" key={c.title}>
              <h4>{c.title}</h4>
              <ul>
                {c.links.map(([label, to]) => (
                  <li key={label}>
                    {to.startsWith('http')
                      ? <a href={to} target="_blank" rel="noreferrer">{label}</a>
                      : <Link href={to}>{label}</Link>}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="footer2-bottom">
        <div className="container">
          <span className="copy">© 2025 SEBASTPERU S.A.C. — Suministros y Tecnología — Lima, Perú</span>
          <PaymentMarks />
        </div>
      </div>
    </footer>
  )
}
