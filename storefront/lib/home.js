// -------------------------------------------------------------------
// Datos de la Home (rediseño SebasPeru). Cada tarjeta es autónoma con
// su precio/descuento/stock tal como aparece en el mockup. Las tarjetas
// pueden agregarse al carrito; el enlace del título va a una búsqueda.
// -------------------------------------------------------------------

export const homeBrands = ['HP', 'Epson', 'Brother', 'Canon', 'Lenovo', 'ASUS', 'Dell', 'Logitech', 'Kingston']

export const homeCategories = [
  { name: 'Impresoras', image: 'printer', to: '/categoria/impresoras' },
  { name: 'Tóner', image: 'toner', to: '/categoria/toner' },
  { name: 'Tintas', image: 'ink', to: '/categoria/tintas' },
  { name: 'Laptops', image: 'laptop', to: '/categoria/laptops-pc' },
  { name: 'Accesorios', image: 'headset', to: '/categoria/accesorios' },
]

export const flashOffers = [
  { id: 201, sku: 'LEN-V15G4', name: 'Laptop Lenovo V15 G4 i5 1235U 8GB S/120G 15.6"', image: 'laptop', price: 1599, oldPrice: 2189, discount: 26, stock: 12 },
  { id: 202, sku: 'HP-ST515', name: 'Impresora HP Smart Tank 515 Multifuncional Wi-Fi', image: 'printer', price: 729, oldPrice: 1049, discount: 30, stock: 14 },
  { id: 203, sku: 'HP-CE285A', name: 'Tóner HP 85A CE285A Negra Original', image: 'toner', price: 168, oldPrice: 226, discount: 25, stock: 20 },
  { id: 204, sku: 'EP-504-BK', name: 'Tinta Epson 504 Negra Original', image: 'ink', tint: '#1f2937', label: '504', price: 44, oldPrice: 55, discount: 20, stock: 20 },
  { id: 205, sku: 'ASUS-VB15', name: 'Laptop ASUS Vivobook 15 i5 1235U 8GB S/120G SSD', image: 'laptop', price: 2099, oldPrice: 2789, discount: 25, stock: 6 },
]

export const impresorasBest = [
  { id: 211, sku: 'EP-L3250', name: 'Impresora Epson EcoTank L3250', subtitle: 'Multifuncional Wi-Fi', image: 'printer', price: 699, oldPrice: 1049, off: 33, rating: 4.5, reviews: 230, stock: 18, badge: 'MÁS VENDIDO' },
  { id: 212, sku: 'HP-M211DW', name: 'HP LaserJet M211dw', subtitle: 'Impresora Láser Monocromática', image: 'printer', price: 549, oldPrice: 749, off: 27, rating: 4.6, reviews: 78, stock: 32 },
  { id: 213, sku: 'BR-L350CDW', name: 'Brother DCP-L350CDW', subtitle: 'Multifuncional Color Wi-Fi', image: 'printer', price: 1769, oldPrice: 1999, off: 10, rating: 4.5, reviews: 80, stock: 8 },
  { id: 214, sku: 'CN-G3110', name: 'Canon G3110', subtitle: 'Multifuncional Tanque de Tinta', image: 'printer', price: 589, oldPrice: 789, off: 25, rating: 4.7, reviews: 145, stock: 20 },
  { id: 215, sku: 'HP-STS85', name: 'HP Smart Tank S85', subtitle: 'Multifuncional Wi-Fi', image: 'printer', price: 849, oldPrice: 1149, off: 26, rating: 4.5, reviews: 80, stock: 12 },
]

export const tonerBest = [
  { id: 221, sku: 'HP-CE285A', name: 'Tóner HP 85A CE285A', subtitle: 'Negro Original', image: 'toner', price: 168, oldPrice: 226, off: 29, rating: 4.7, reviews: 145, stock: 20 },
  { id: 222, sku: 'BR-TN760', name: 'Tóner Brother TN-760', subtitle: 'Negro Original', image: 'toner', price: 229, oldPrice: 318, off: 28, rating: 4.6, reviews: 143, stock: 16 },
  { id: 223, sku: 'SAM-D111S', name: 'Tóner Samsung MLT-D111S', subtitle: 'Negro Original', image: 'toner', price: 190, oldPrice: 249, off: 24, rating: 4.6, reviews: 190, stock: 20 },
  { id: 224, sku: 'CN-137', name: 'Tóner Canon 137', subtitle: 'Negro Original', image: 'toner', price: 168, oldPrice: 210, off: 20, rating: 4.5, reviews: 95, stock: 24 },
  { id: 225, sku: 'HP-CF226A', name: 'Tóner HP 26A CF226A', subtitle: 'Negro Original', image: 'toner', price: 349, oldPrice: 459, off: 24, rating: 4.6, reviews: 110, stock: 12 },
]

export const tintasBest = [
  { id: 231, sku: 'EP-504-BK', name: 'Tinta Epson 504 Negra', subtitle: 'Original', image: 'ink', tint: '#1f2937', label: '504', price: 44, oldPrice: 65, off: 32, rating: 4.7, reviews: 75, stock: 30 },
  { id: 232, sku: 'EP-504-C', name: 'Tinta Epson 504 Cian', subtitle: 'Original', image: 'ink', tint: '#06b6d4', label: '504', price: 48, oldPrice: 65, off: 26, rating: 4.6, reviews: 58, stock: 20 },
  { id: 233, sku: 'EP-504-M', name: 'Tinta Epson 504 Magenta', subtitle: 'Original', image: 'ink', tint: '#ec4899', label: '504', price: 48, oldPrice: 65, off: 26, rating: 4.6, reviews: 58, stock: 20 },
  { id: 234, sku: 'EP-504-Y', name: 'Tinta Epson 504 Amarilla', subtitle: 'Original', image: 'ink', tint: '#eab308', label: '504', price: 48, oldPrice: 65, off: 26, rating: 4.6, reviews: 58, stock: 16 },
  { id: 235, sku: 'CN-GI190', name: 'Tinta Canon GI-190 Negro', subtitle: 'Original', image: 'ink', tint: '#1f2937', label: '190', price: 46, oldPrice: 65, off: 29, rating: 4.5, reviews: 42, stock: 16 },
]
