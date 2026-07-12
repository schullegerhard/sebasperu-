import CheckoutClient from '../../components/CheckoutClient.jsx'

export const metadata = {
  title: 'Finalizar compra',
  description: 'Completa tu compra en SebasPeru de forma rápida y segura.',
  alternates: { canonical: '/checkout' },
  robots: { index: false }, // el checkout no se indexa
}

export default function Checkout() {
  return (
    <div className="container page">
      <h1 className="page-title" style={{ marginBottom: 16 }}>Finalizar compra</h1>
      <CheckoutClient />
    </div>
  )
}
