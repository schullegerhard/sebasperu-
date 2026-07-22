import CheckoutClient from '../../components/CheckoutClient.jsx'

// Revalidación corta: sin esto la página es 100% estática y se sirve con
// Cache-Control s-maxage de 1 año → tras un redeploy la caché seguiría
// mostrando la versión anterior.
export const revalidate = 300

export const metadata = {
  title: 'Finalizar compra',
  description: 'Completa tu compra en SebasPeru de forma rápida y segura.',
  alternates: { canonical: '/checkout' },
  robots: { index: false, follow: true }, // el checkout no se indexa
}

export default function Checkout() {
  return (
    <div className="container page">
      <h1 className="page-title" style={{ marginBottom: 16 }}>Finalizar compra</h1>
      <CheckoutClient />
    </div>
  )
}
