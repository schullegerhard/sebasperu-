import AccountClient from '../../components/AccountClient.jsx'

// Revalidación corta: sin esto la página es 100% estática y se sirve con
// Cache-Control s-maxage de 1 año → tras un redeploy la caché seguiría
// mostrando la versión anterior.
export const revalidate = 300

export const metadata = {
  title: 'Mi cuenta',
  description: 'Inicia sesión o crea tu cuenta en SebasPeru para ver tus pedidos y comprar más rápido.',
  alternates: { canonical: '/cuenta' },
  robots: { index: false, follow: true },
}

export default function Cuenta() {
  return (
    <div className="container page">
      <h1 className="page-title" style={{ marginBottom: 16 }}>Mi cuenta</h1>
      <AccountClient />
    </div>
  )
}
