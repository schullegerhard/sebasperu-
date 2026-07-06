import { Whatsapp } from './Icons.jsx'

export default function FloatingWhatsApp() {
  return (
    <a className="wa-pill" href="https://wa.me/51925552042?text=Hola%20SebasPeru,%20necesito%20información" target="_blank" rel="noreferrer" aria-label="WhatsApp">
      <Whatsapp size={24} />
      <span className="wa-col"><b>WhatsApp</b><small>925 552 042</small></span>
    </a>
  )
}
