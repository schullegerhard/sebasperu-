// El carrito es una página de utilidad: declara su canónica y se excluye del
// índice (la página es un componente cliente y no puede exportar metadata).
export const metadata = {
  title: 'Carrito de compra',
  alternates: { canonical: '/carrito' },
  robots: { index: false, follow: true },
}

export default function CarritoLayout({ children }) {
  return children
}
