import './globals.css'
import CartProvider from '../components/CartProvider.jsx'
import Header from '../components/Header.jsx'
import Footer from '../components/Footer.jsx'
import CartDrawer from '../components/CartDrawer.jsx'
import FloatingWhatsApp from '../components/FloatingWhatsApp.jsx'
import { ORIGIN, SITE, organizationJsonLd, websiteJsonLd, JsonLd } from '../lib/seo.js'

// Metadata global (App Router la renderiza en el <head> del HTML servidor).
export const metadata = {
  metadataBase: new URL(ORIGIN),
  title: { default: `${SITE} — Tecnología que impulsa tu negocio`, template: `%s | ${SITE}` },
  description: 'SebasPeru — Impresoras, tóner, tintas, laptops y accesorios de las mejores marcas. Ventas corporativas, factura electrónica y envíos a todo el Perú.',
  alternates: { canonical: '/' },
  openGraph: { type: 'website', locale: 'es_PE', siteName: SITE, url: ORIGIN },
  robots: { index: true, follow: true },
  icons: { icon: '/favicon.svg' },
}

export const viewport = { themeColor: '#1b4dd8' }

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <JsonLd data={organizationJsonLd()} />
        <JsonLd data={websiteJsonLd()} />
        <CartProvider>
          <Header />
          <main>{children}</main>
          <Footer />
          <CartDrawer />
          <FloatingWhatsApp />
        </CartProvider>
      </body>
    </html>
  )
}
