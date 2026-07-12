import AccountClient from '../../components/AccountClient.jsx'

export const metadata = {
  title: 'Mi cuenta',
  description: 'Inicia sesión o crea tu cuenta en SebasPeru para ver tus pedidos y comprar más rápido.',
  alternates: { canonical: '/cuenta' },
}

export default function Cuenta() {
  return (
    <div className="container page">
      <h1 className="page-title" style={{ marginBottom: 16 }}>Mi cuenta</h1>
      <AccountClient />
    </div>
  )
}
