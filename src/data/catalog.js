import { slugify } from '../lib/util.js'

// ---------------------------------------------------------------------------
// Catálogo de productos de SebasPeru.
// `image` es una clave que se resuelve a un componente SVG en imageMap.jsx,
// manteniendo los datos serializables (útil para SEO / sitemap / pruebas).
// ---------------------------------------------------------------------------

// Taxonomía completa del catálogo — los mismos rubros del diseño Figma:
// Computación, Impresión, Redes, Almacenamiento, Periféricos, Energía y
// Accesorios. Cada categoría tiene una página real (/categoria/{slug}) con
// productos. Tóner y Tintas se mantienen como categorías propias (agrupadas
// bajo "Impresión" en el menú) para conservar sus páginas y enlaces.
export const categories = [
  {
    slug: 'laptops-pc', name: 'Computación', image: 'laptop',
    subcategories: [
      { slug: 'laptops', name: 'Laptops' },
      { slug: 'computadoras', name: 'Computadoras' },
      { slug: 'monitores', name: 'Monitores' },
      { slug: 'componentes', name: 'Componentes PC' },
    ],
  },
  {
    slug: 'impresoras', name: 'Impresión', image: 'printer',
    subcategories: [
      { slug: 'multifuncionales', name: 'Multifuncionales' },
      { slug: 'laser', name: 'Láser' },
      { slug: 'tinta-continua', name: 'Tinta continua' },
    ],
  },
  {
    slug: 'toner', name: 'Tóner', image: 'toner',
    subcategories: [
      { slug: 'toner-hp', name: 'Tóner HP' },
      { slug: 'toner-samsung', name: 'Tóner Samsung' },
      { slug: 'toner-brother', name: 'Tóner Brother' },
    ],
  },
  {
    slug: 'tintas', name: 'Tintas', image: 'ink',
    subcategories: [
      { slug: 'tinta-hp', name: 'Tinta HP' },
      { slug: 'tinta-epson', name: 'Tinta Epson' },
      { slug: 'tinta-canon', name: 'Tinta Canon' },
    ],
  },
  {
    slug: 'redes', name: 'Redes', image: 'router',
    subcategories: [
      { slug: 'routers', name: 'Routers' },
      { slug: 'access-point', name: 'Access Point' },
      { slug: 'switches', name: 'Switches' },
      { slug: 'cableado', name: 'Cableado' },
    ],
  },
  {
    slug: 'almacenamiento', name: 'Almacenamiento', image: 'laptop',
    subcategories: [
      { slug: 'ssd', name: 'SSD' },
      { slug: 'discos-duros', name: 'Discos Duros' },
      { slug: 'usb-microsd', name: 'USB & MicroSD' },
      { slug: 'memorias-ram', name: 'Memorias RAM' },
    ],
  },
  {
    slug: 'perifericos', name: 'Periféricos', image: 'headset',
    subcategories: [
      { slug: 'mouse-teclados', name: 'Mouse & Teclados' },
      { slug: 'gaming', name: 'Gaming' },
      { slug: 'audio', name: 'Audio' },
      { slug: 'webcams', name: 'Webcams' },
    ],
  },
  {
    slug: 'energia', name: 'Energía', image: 'router',
    subcategories: [
      { slug: 'ups', name: 'UPS & Estabilizadores' },
      { slug: 'fuentes', name: 'Fuentes de Poder' },
      { slug: 'vigilancia', name: 'Vigilancia' },
    ],
  },
  {
    slug: 'accesorios', name: 'Accesorios', image: 'chair',
    subcategories: [
      { slug: 'oficina', name: 'Oficina' },
      { slug: 'accesorios-laptop', name: 'Accesorios Laptop' },
      { slug: 'cables', name: 'Cables & Adaptadores' },
      { slug: 'software', name: 'Software' },
    ],
  },
]

export const brands = ['HP', 'Lenovo', 'Dell', 'ASUS', 'Acer', 'Epson', 'Canon', 'Brother', 'Samsung', 'Logitech', 'TP-Link']

const seedProducts = [
  {
    id: 1, sku: 'HP-250G9-I5', slug: 'laptop-hp-250-g9',
    name: 'Laptop HP 250 G9', brand: 'HP', model: '250 G9',
    category: 'laptops-pc', subcategory: 'laptops', image: 'laptop',
    price: 1899, oldPrice: 2199, off: 16, stock: 8, rating: 4.8, reviews: 124, offer: true,
    subtitle: '15.6" FHD | 8GB | 512GB SSD',
    blurb: 'Intel Core i5 · 8GB RAM · 512GB SSD · 15.6" FHD · Windows 11',
    trendTag: '#Laptops', rankLabel: '#1 Más vendidos en Laptops HP',
    shortDesc: 'Laptop HP 250 G9 con procesador Intel Core i5, 8GB RAM y 512GB SSD. Ideal para trabajo, estudios y uso diario.',
    longDesc: 'La Laptop HP 250 G9 combina rendimiento y portabilidad en un diseño elegante y resistente. Perfecta para profesionales y estudiantes que necesitan productividad y confiabilidad en su día a día.',
    highlights: ['Rendimiento confiable para multitarea', 'Almacenamiento SSD para mayor velocidad', 'Diseño delgado y ligero', 'Batería de larga duración'],
    specs: { Procesador: 'Intel Core i5-1135G7 (11va Gen)', 'Memoria RAM': '8GB DDR4', Almacenamiento: '512GB SSD', Pantalla: '15.6" HD (1366 x 768)', 'Sistema Operativo': 'Windows 11 Home', Peso: '1.74 kg', Garantía: '1 año' },
    compatibilities: [], related: [16, 17, 18, 19, 20],
  },
  {
    id: 2, sku: 'EP-L3250', slug: 'impresora-epson-l3250',
    name: 'Impresora Epson L3250 Multifuncional', brand: 'Epson', model: 'L3250',
    category: 'impresoras', subcategory: 'tinta-continua', image: 'printer',
    price: 699, stock: 15, rating: 4.7, reviews: 98, offer: false,
    shortDesc: 'Multifuncional Epson EcoTank L3250 con sistema de tinta continua, WiFi e impresión móvil.',
    longDesc: 'La Epson EcoTank L3250 es una impresora multifuncional inalámbrica con sistema de tanque de tinta de alta capacidad que reduce drásticamente el costo por página. Imprime, escanea y copia con calidad profesional, y se conecta vía WiFi para imprimir desde tu smartphone con Epson Smart Panel.',
    specs: { Tipo: 'Multifuncional tinta continua', Conectividad: 'WiFi, USB', Funciones: 'Imprime / Escanea / Copia', 'Velocidad': '33 ppm negro', Garantía: '1 año' },
    compatibilities: ['Tinta Epson 664'], related: [4, 11, 1],
  },
  {
    id: 3, sku: 'HP-CE285A-85A', slug: 'toner-hp-85a-ce285a',
    name: 'Tóner HP 85A CE285A Negro Original', brand: 'HP', model: '85A CE285A',
    category: 'toner', subcategory: 'toner-hp', image: 'toner',
    price: 59, stock: 40, rating: 4.8, reviews: 124, offer: false,
    shortDesc: 'Cartucho de tóner HP 85A (CE285A) negro original, rendimiento 1600 páginas.',
    longDesc: 'El cartucho de tóner original HP 85A (CE285A) garantiza impresiones nítidas y consistentes página tras página. Diseñado para integrarse perfectamente con tu impresora HP LaserJet, ofrece un rendimiento aproximado de 1600 páginas y la confiabilidad de un consumible original.',
    specs: { Color: 'Negro', Rendimiento: '~1600 páginas', Tipo: 'Original', Garantía: '1 año' },
    compatibilities: ['HP LaserJet P1102', 'HP LaserJet M1132', 'HP LaserJet M1212nf'], related: [11, 2, 4],
  },
  {
    id: 4, sku: 'EP-664-BK', slug: 'tinta-epson-664-negro',
    name: 'Tinta Epson 664 Negro Original', brand: 'Epson', model: '664',
    category: 'tintas', subcategory: 'tinta-epson', image: 'ink',
    price: 39, stock: 60, rating: 4.9, reviews: 256, offer: false,
    shortDesc: 'Botella de tinta Epson 664 negro original de 70ml para impresoras EcoTank.',
    longDesc: 'La tinta original Epson 664 negra de 70ml está formulada para ofrecer resultados de impresión nítidos y duraderos en tu impresora EcoTank. Su práctico sistema de llenado evita derrames y garantiza un rendimiento óptimo a un costo por página excepcionalmente bajo.',
    specs: { Color: 'Negro', Contenido: '70 ml', Tipo: 'Original', Garantía: '6 meses' },
    compatibilities: ['Epson L3250', 'Epson L3210', 'Epson L1210', 'Epson L5290'], related: [2, 3, 11],
  },
  {
    id: 5, sku: 'TPL-ARCHERC6', slug: 'router-tp-link-archer-c6',
    name: 'Router TP-Link AC1200 Archer C6', brand: 'TP-Link', model: 'Archer C6',
    category: 'redes', subcategory: 'routers', image: 'router',
    price: 149, stock: 22, rating: 4.7, reviews: 75, offer: false,
    shortDesc: 'Router WiFi de doble banda AC1200 con 4 antenas y tecnología MU-MIMO.',
    longDesc: 'El TP-Link Archer C6 ofrece WiFi de doble banda AC1200 con velocidades combinadas de hasta 1200 Mbps. Sus 4 antenas externas y la tecnología MU-MIMO con Beamforming aseguran una cobertura estable y simultánea para todos tus dispositivos, ideal para hogares y oficinas pequeñas.',
    specs: { 'Velocidad': 'AC1200 (300+867 Mbps)', Bandas: 'Doble banda 2.4/5 GHz', Antenas: '4 externas', Puertos: '4x LAN Gigabit', Garantía: '1 año' },
    compatibilities: [], related: [11, 6, 2],
  },
  {
    id: 6, sku: 'LOG-H390', slug: 'audifonos-logitech-h390',
    name: 'Audífonos Logitech H390 USB', brand: 'Logitech', model: 'H390',
    category: 'perifericos', subcategory: 'audio', image: 'headset',
    price: 89, stock: 30, rating: 4.6, reviews: 62, offer: false,
    shortDesc: 'Audífonos USB Logitech H390 con micrófono con cancelación de ruido.',
    longDesc: 'Los audífonos Logitech H390 con conexión USB ofrecen sonido digital envolvente y un micrófono con cancelación de ruido ideal para videollamadas. Sus almohadillas acolchadas y diadema ajustable brindan comodidad durante largas jornadas de trabajo.',
    specs: { Conexión: 'USB', Micrófono: 'Con cancelación de ruido', Controles: 'En línea (volumen/mute)', Garantía: '2 años' },
    compatibilities: [], related: [1, 5, 11],
  },
  {
    id: 7, sku: 'HP-VICTUS15', slug: 'laptop-hp-victus-15',
    name: 'Laptop HP Victus 15 Gaming', brand: 'HP', model: 'Victus 15',
    category: 'laptops-pc', subcategory: 'laptops', image: 'laptop',
    price: 3499, oldPrice: 3899, stock: 5, rating: 4.8, reviews: 41, offer: true,
    shortDesc: 'Laptop gamer HP Victus 15 con Ryzen 5, RTX 3050 y 16GB RAM.',
    longDesc: 'La HP Victus 15 está pensada para gaming y creación de contenido. Con procesador AMD Ryzen 5, tarjeta gráfica NVIDIA RTX 3050, 16GB de RAM y pantalla de 144Hz, ejecuta los títulos más exigentes con fluidez.',
    specs: { Procesador: 'AMD Ryzen 5 5600H', RAM: '16GB DDR4', Gráficos: 'NVIDIA RTX 3050 4GB', Pantalla: '15.6" FHD 144Hz', Garantía: '1 año' },
    compatibilities: [], related: [1, 6, 5],
  },
  {
    id: 8, sku: 'BR-TN660', slug: 'toner-brother-tn660',
    name: 'Tóner Brother TN-660 Negro Original', brand: 'Brother', model: 'TN-660',
    category: 'toner', subcategory: 'toner-brother', image: 'toner',
    price: 119, stock: 18, rating: 4.7, reviews: 53, offer: false,
    shortDesc: 'Tóner Brother TN-660 de alto rendimiento, ~2600 páginas.',
    longDesc: 'El tóner original Brother TN-660 de alto rendimiento entrega aproximadamente 2600 páginas con texto nítido y profesional, optimizando el costo por impresión en tus equipos Brother.',
    specs: { Color: 'Negro', Rendimiento: '~2600 páginas', Tipo: 'Original alto rendimiento', Garantía: '1 año' },
    compatibilities: ['Brother HL-L2300D', 'Brother DCP-L2540DW', 'Brother MFC-L2700DW'], related: [3, 2, 4],
  },
  {
    id: 9, sku: 'CN-GI190', slug: 'tinta-canon-gi-190',
    name: 'Tinta Canon GI-190 Negro Original', brand: 'Canon', model: 'GI-190',
    category: 'tintas', subcategory: 'tinta-canon', image: 'ink',
    price: 45, stock: 35, rating: 4.6, reviews: 38, offer: false,
    shortDesc: 'Botella de tinta Canon GI-190 negro original para impresoras MegaTank.',
    longDesc: 'La tinta Canon GI-190 negra original ofrece impresiones de alta calidad y bajo costo por página para tus impresoras Canon PIXMA G-series MegaTank.',
    specs: { Color: 'Negro', Contenido: '135 ml', Tipo: 'Original', Garantía: '6 meses' },
    compatibilities: ['Canon G1110', 'Canon G2110', 'Canon G3110'], related: [4, 2, 8],
  },
  {
    id: 10, sku: 'SAM-T350', slug: 'monitor-samsung-t350',
    name: 'Monitor Samsung 24" T350 Full HD', brand: 'Samsung', model: 'T350',
    category: 'laptops-pc', subcategory: 'monitores', image: 'laptop',
    price: 549, stock: 12, rating: 4.7, reviews: 67, offer: false,
    shortDesc: 'Monitor Samsung 24" Full HD IPS, 75Hz, FreeSync.',
    longDesc: 'Monitor Samsung T350 de 24" con panel IPS Full HD, tasa de refresco de 75Hz y tecnología AMD FreeSync para imágenes fluidas. Diseño sin bordes en 3 lados, ideal para multitarea.',
    specs: { Tamaño: '24"', Resolución: '1920x1080 Full HD', Panel: 'IPS', Frecuencia: '75Hz', Garantía: '2 años' },
    compatibilities: [], related: [1, 7, 6],
  },
  {
    id: 11, sku: 'TPL-TLSG108', slug: 'switch-tp-link-sg108',
    name: 'Switch TP-Link TL-SG108 8 Puertos Gigabit', brand: 'TP-Link', model: 'TL-SG108',
    category: 'redes', subcategory: 'switches', image: 'router',
    price: 99, stock: 26, rating: 4.8, reviews: 89, offer: false,
    shortDesc: 'Switch no administrable de 8 puertos Gigabit, carcasa metálica.',
    longDesc: 'El TP-Link TL-SG108 amplía tu red con 8 puertos Gigabit plug-and-play. Su carcasa metálica robusta y el funcionamiento silencioso lo hacen ideal para hogares y oficinas.',
    specs: { Puertos: '8x Gigabit', Tipo: 'No administrable', Carcasa: 'Metálica', Garantía: '3 años' },
    compatibilities: [], related: [5, 6, 1],
  },
  {
    id: 12, sku: 'HP-M404DN', slug: 'impresora-hp-laserjet-m404dn',
    name: 'Impresora HP LaserJet Pro M404dn', brand: 'HP', model: 'M404dn',
    category: 'impresoras', subcategory: 'laser', image: 'printer',
    price: 1099, oldPrice: 1299, stock: 9, rating: 4.8, reviews: 44, offer: true,
    shortDesc: 'Impresora láser monocromática HP LaserJet Pro M404dn con dúplex y red.',
    longDesc: 'La HP LaserJet Pro M404dn es una impresora láser monocromática de alto rendimiento para entornos de trabajo exigentes. Imprime hasta 38 ppm, incluye impresión a doble cara automática y conexión Ethernet.',
    specs: { Tipo: 'Láser monocromática', 'Velocidad': '38 ppm', Dúplex: 'Automático', Conectividad: 'USB, Ethernet', Garantía: '1 año' },
    compatibilities: ['Tóner HP 58A', 'Tóner HP 59A'], related: [3, 2, 8],
  },
  {
    id: 13, sku: 'LEN-LEGION5', slug: 'laptop-lenovo-legion-5-15ach6h',
    name: 'Lenovo Legion 5 15ACH6H', brand: 'Lenovo', model: 'Legion 5 15ACH6H',
    category: 'laptops-pc', subcategory: 'laptops-gamer', image: 'laptop',
    price: 3299, oldPrice: 3799, off: 12, stock: 10, rating: 4.6, reviews: 98, offer: true,
    subtitle: 'Ryzen 5 5600H | 16GB | 512GB SSD',
    blurb: 'AMD Ryzen 5 5600H · 16GB RAM · 512GB SSD · GTX 1650 · 15.6" FHD · Windows 11',
    trendTag: '#Gaming', rankLabel: '#1 Más vendidos en Laptops Gamer',
    shortDesc: 'Laptop gamer Lenovo Legion 5 con Ryzen 5 5600H, GTX 1650 y 16GB RAM.',
    longDesc: 'La Lenovo Legion 5 ofrece potencia gamer con procesador AMD Ryzen 5 5600H, gráficos NVIDIA GTX 1650 y 16GB de RAM, con un sistema de refrigeración avanzado para largas sesiones.',
    highlights: ['Gráficos dedicados GTX 1650', 'Refrigeración Legion ColdFront', 'Teclado retroiluminado'],
    specs: { Procesador: 'AMD Ryzen 5 5600H', 'Memoria RAM': '16GB DDR4', Almacenamiento: '512GB SSD', Gráficos: 'NVIDIA GTX 1650 4GB', Pantalla: '15.6" FHD 120Hz', 'Sistema Operativo': 'Windows 11', Garantía: '1 año' },
    compatibilities: [], related: [1, 14, 15],
  },
  {
    id: 14, sku: 'ASUS-X1502ZA', slug: 'laptop-asus-vivobook-15-x1502za',
    name: 'ASUS Vivobook 15 X1502ZA', brand: 'ASUS', model: 'Vivobook 15 X1502ZA',
    category: 'laptops-pc', subcategory: 'ultrabooks', image: 'laptop',
    price: 2299, oldPrice: 3749, off: 39, stock: 9, rating: 4.5, reviews: 56, offer: true, flag: 'oferta',
    subtitle: 'i7 | 16GB | 512GB SSD',
    blurb: 'Intel Core i7 · 16GB RAM · 512GB SSD · 15.6" FHD · Windows 11',
    trendTag: '#Ultrabook', rankLabel: '#1 Más vendidos en Ultrabooks',
    shortDesc: 'Ultrabook ASUS Vivobook 15 con Intel Core i7, 16GB RAM y 512GB SSD.',
    longDesc: 'La ASUS Vivobook 15 X1502ZA combina un procesador Intel Core i7, 16GB de RAM y diseño delgado, ideal para productividad y entretenimiento.',
    highlights: ['Procesador Intel Core i7', 'Pantalla NanoEdge 15.6"', 'Diseño liviano'],
    specs: { Procesador: 'Intel Core i7-1255U', 'Memoria RAM': '16GB DDR4', Almacenamiento: '512GB SSD', Pantalla: '15.6" FHD', 'Sistema Operativo': 'Windows 11', Garantía: '1 año' },
    compatibilities: [], related: [1, 13, 15],
  },
  {
    id: 15, sku: 'ACER-A515-57', slug: 'laptop-acer-aspire-5-a515-57',
    name: 'Acer Aspire 5 A515-57', brand: 'Acer', model: 'Aspire 5 A515-57',
    category: 'laptops-pc', subcategory: 'laptops', image: 'laptop',
    price: 1999, stock: 14, rating: 4.5, reviews: 34, offer: false, flag: 'nuevo',
    subtitle: 'i5 | 8GB | 512GB SSD',
    blurb: 'Intel Core i5 · 8GB RAM · 512GB SSD · 15.6" FHD · Windows 11',
    trendTag: '#Nuevos', rankLabel: '#1 Más vendidos en Acer',
    shortDesc: 'Laptop Acer Aspire 5 con Intel Core i5, 8GB RAM y 512GB SSD.',
    longDesc: 'La Acer Aspire 5 A515-57 ofrece un equilibrio entre rendimiento y portabilidad con Intel Core i5 y pantalla Full HD, ideal para el día a día.',
    highlights: ['Pantalla Full HD', 'Diseño delgado de metal', 'Wi-Fi 6'],
    specs: { Procesador: 'Intel Core i5-1235U', 'Memoria RAM': '8GB DDR4', Almacenamiento: '512GB SSD', Pantalla: '15.6" FHD', 'Sistema Operativo': 'Windows 11', Garantía: '1 año' },
    compatibilities: [], related: [1, 13, 14],
  },
  {
    id: 16, sku: 'LEN-V15G4', slug: 'laptop-lenovo-v15-g4',
    name: 'Laptop Lenovo V15 G4', brand: 'Lenovo', model: 'V15 G4',
    category: 'laptops-pc', subcategory: 'laptops', image: 'laptop',
    price: 1599, oldPrice: 1899, off: 16, stock: 16, rating: 4.7, reviews: 98, offer: true,
    subtitle: '15.6" FHD | 8GB | 512GB SSD',
    blurb: 'Intel Core i5 · 8GB RAM · 512GB SSD · 15.6" FHD',
    trendTag: '#Laptops', rankLabel: '#1 Más vendidos en Lenovo',
    shortDesc: 'Laptop Lenovo V15 G4 con Intel Core i5, 8GB RAM y 512GB SSD.',
    longDesc: 'La Lenovo V15 G4 es una laptop confiable para trabajo y estudio, con pantalla Full HD y almacenamiento SSD rápido.',
    highlights: ['Pantalla Full HD', 'Almacenamiento SSD', 'Ligera y resistente'],
    specs: { Procesador: 'Intel Core i5-1235U', 'Memoria RAM': '8GB DDR4', Almacenamiento: '512GB SSD', Pantalla: '15.6" FHD', 'Sistema Operativo': 'Windows 11', Garantía: '1 año' },
    compatibilities: [], related: [1, 17, 18],
  },
  {
    id: 17, sku: 'ASUS-VB15', slug: 'laptop-asus-vivobook-15',
    name: 'Laptop ASUS Vivobook 15', brand: 'ASUS', model: 'Vivobook 15',
    category: 'laptops-pc', subcategory: 'laptops', image: 'laptop',
    price: 2090, oldPrice: 2390, off: 12, stock: 11, rating: 4.8, reviews: 76, offer: true,
    subtitle: 'i5 1235U | 8GB | 512GB SSD',
    blurb: 'Intel Core i5 1235U · 8GB RAM · 512GB SSD · 15.6" FHD',
    trendTag: '#Laptops', rankLabel: '#1 Más vendidos en ASUS',
    shortDesc: 'Laptop ASUS Vivobook 15 con Intel Core i5, 8GB RAM y 512GB SSD.',
    longDesc: 'La ASUS Vivobook 15 ofrece diseño delgado y rendimiento equilibrado para la productividad diaria.',
    highlights: ['Diseño NanoEdge', 'SSD veloz', 'Wi-Fi 6'],
    specs: { Procesador: 'Intel Core i5-1235U', 'Memoria RAM': '8GB DDR4', Almacenamiento: '512GB SSD', Pantalla: '15.6" FHD', 'Sistema Operativo': 'Windows 11', Garantía: '1 año' },
    compatibilities: [], related: [1, 16, 18],
  },
  {
    id: 18, sku: 'HP-255G9', slug: 'laptop-hp-255-g9',
    name: 'Laptop HP 255 G9', brand: 'HP', model: '255 G9',
    category: 'laptops-pc', subcategory: 'laptops', image: 'laptop',
    price: 1799, oldPrice: 2090, off: 15, stock: 13, rating: 4.7, reviews: 62, offer: true,
    subtitle: 'Ryzen 5 5625U | 8GB | 512GB',
    blurb: 'AMD Ryzen 5 5625U · 8GB RAM · 512GB SSD · 15.6" FHD',
    trendTag: '#Laptops', rankLabel: '#1 Más vendidos en HP',
    shortDesc: 'Laptop HP 255 G9 con AMD Ryzen 5, 8GB RAM y 512GB SSD.',
    longDesc: 'La HP 255 G9 con procesador AMD Ryzen 5 ofrece rendimiento fluido para tareas diarias y multitarea.',
    highlights: ['Procesador Ryzen 5', 'Almacenamiento SSD', 'Pantalla Full HD'],
    specs: { Procesador: 'AMD Ryzen 5 5625U', 'Memoria RAM': '8GB DDR4', Almacenamiento: '512GB SSD', Pantalla: '15.6" FHD', 'Sistema Operativo': 'Windows 11', Garantía: '1 año' },
    compatibilities: [], related: [1, 16, 17],
  },
  {
    id: 19, sku: 'ACER-A3', slug: 'laptop-acer-aspire-3',
    name: 'Laptop Acer Aspire 3', brand: 'Acer', model: 'Aspire 3',
    category: 'laptops-pc', subcategory: 'laptops', image: 'laptop',
    price: 1699, oldPrice: 1899, off: 10, stock: 15, rating: 4.6, reviews: 54, offer: true,
    subtitle: 'Ryzen 5 | 8GB | 512GB SSD',
    blurb: 'AMD Ryzen 5 · 8GB RAM · 512GB SSD · 15.6" FHD',
    trendTag: '#Laptops', rankLabel: '#1 Más vendidos en Acer',
    shortDesc: 'Laptop Acer Aspire 3 con AMD Ryzen 5, 8GB RAM y 512GB SSD.',
    longDesc: 'La Acer Aspire 3 es una laptop accesible y confiable para el día a día, con SSD y pantalla Full HD.',
    highlights: ['Buen rendimiento', 'SSD rápido', 'Ligera'],
    specs: { Procesador: 'AMD Ryzen 5', 'Memoria RAM': '8GB DDR4', Almacenamiento: '512GB SSD', Pantalla: '15.6" FHD', 'Sistema Operativo': 'Windows 11', Garantía: '1 año' },
    compatibilities: [], related: [1, 18, 20],
  },
  {
    id: 20, sku: 'DELL-INSP15', slug: 'laptop-dell-inspiron-15',
    name: 'Laptop Dell Inspiron 15', brand: 'Dell', model: 'Inspiron 15',
    category: 'laptops-pc', subcategory: 'laptops', image: 'laptop',
    price: 2149, oldPrice: 2590, off: 17, stock: 12, rating: 4.8, reviews: 81, offer: true,
    subtitle: 'i5 1235U | 8GB | 512GB SSD',
    blurb: 'Intel Core i5 1235U · 8GB RAM · 512GB SSD · 15.6" FHD',
    trendTag: '#Laptops', rankLabel: '#1 Más vendidos en Dell',
    shortDesc: 'Laptop Dell Inspiron 15 con Intel Core i5, 8GB RAM y 512GB SSD.',
    longDesc: 'La Dell Inspiron 15 combina diseño moderno y rendimiento confiable para trabajo y estudio.',
    highlights: ['Diseño moderno', 'SSD veloz', 'Pantalla Full HD'],
    specs: { Procesador: 'Intel Core i5-1235U', 'Memoria RAM': '8GB DDR4', Almacenamiento: '512GB SSD', Pantalla: '15.6" FHD', 'Sistema Operativo': 'Windows 11', Garantía: '1 año' },
    compatibilities: [], related: [1, 19, 16],
  },
]

// ---------------------------------------------------------------------------
// Productos reales de los rubros nuevos del diseño (Redes, Almacenamiento,
// Periféricos, Energía y Accesorios). Se generan con un helper compacto para
// mantener el archivo legible; cada uno vive en su página /categoria/{category}.
// Tupla: [name, brand, category, subcategory, image, price, oldPrice, rating, reviews, badge]
// ---------------------------------------------------------------------------
const mk = (id, [name, brand, category, subcategory, image, price, oldPrice, rating, reviews, badge]) => ({
  id,
  sku: `${brand.toUpperCase().replace(/[^A-Z0-9]/g, '')}-${id}`,
  slug: slugify(name),
  name, brand, model: name.replace(/^\S+\s/, '').split('/')[0].trim().slice(0, 40),
  category, subcategory, image,
  price, oldPrice: oldPrice || null,
  off: oldPrice ? Math.round((1 - price / oldPrice) * 100) : 0,
  stock: 8 + (id % 25), rating, reviews, offer: !!oldPrice,
  ...(badge ? { badge } : {}),
  shortDesc: `${name}. Producto original con garantía oficial y stock disponible.`,
  longDesc: `${name}. Distribuido por SebasPeru con garantía oficial, comprobante de pago y envío a todo el Perú. Stock disponible para entrega inmediata en Lima.`,
  specs: { Marca: brand, Modelo: name.replace(/^\S+\s/, '').split('/')[0].trim().slice(0, 40), Garantía: '12 meses oficial', Condición: 'Nuevo', País: 'Perú' },
  compatibilities: [], related: [],
})

const extraRows = [
  // Redes
  ['Router TP-Link Archer AX23 WiFi 6 Dual Band AX1800', 'TP-Link', 'redes', 'routers', 'router', 199, 249, 4.7, 210, 'OFERTA'],
  ['Router TP-Link Archer C80 AC1900 MU-MIMO', 'TP-Link', 'redes', 'routers', 'router', 179, 0, 4.6, 143, 'NUEVO'],
  ['Access Point Ubiquiti UniFi U6 Lite WiFi 6', 'Ubiquiti', 'redes', 'access-point', 'router', 329, 389, 4.8, 96, ''],
  ['Switch TP-Link TL-SG1008D 8 Puertos Gigabit', 'TP-Link', 'redes', 'switches', 'router', 129, 0, 4.7, 178, ''],
  ['Switch TP-Link TL-SG1016 16 Puertos Gigabit', 'TP-Link', 'redes', 'switches', 'router', 289, 349, 4.7, 64, ''],
  ['Adaptador WiFi USB TP-Link Archer T3U AC1300', 'TP-Link', 'redes', 'cableado', 'router', 69, 89, 4.5, 132, ''],
  ['Cable de Red UTP Cat6 Patch Cord 3 Metros', 'Genérico', 'redes', 'cableado', 'router', 15, 0, 4.5, 320, ''],
  // Almacenamiento
  ['SSD Kingston A400 480GB SATA 2.5"', 'Kingston', 'almacenamiento', 'ssd', 'laptop', 129, 159, 4.8, 540, 'OFERTA'],
  ['SSD Samsung 980 1TB NVMe M.2 PCIe 3.0', 'Samsung', 'almacenamiento', 'ssd', 'laptop', 329, 399, 4.9, 410, ''],
  ['Disco Duro Externo Western Digital Elements 1TB USB 3.0', 'Western Digital', 'almacenamiento', 'discos-duros', 'laptop', 189, 0, 4.7, 388, 'NUEVO'],
  ['Disco Duro Interno Seagate Barracuda 2TB 7200RPM', 'Seagate', 'almacenamiento', 'discos-duros', 'laptop', 219, 259, 4.7, 176, ''],
  ['Memoria USB Kingston DataTraveler 64GB USB 3.2', 'Kingston', 'almacenamiento', 'usb-microsd', 'laptop', 29, 39, 4.6, 612, ''],
  ['Tarjeta MicroSD SanDisk Ultra 128GB Clase 10', 'SanDisk', 'almacenamiento', 'usb-microsd', 'laptop', 45, 59, 4.8, 720, ''],
  ['Memoria RAM Kingston Fury 8GB DDR4 3200MHz', 'Kingston', 'almacenamiento', 'memorias-ram', 'laptop', 99, 129, 4.8, 264, ''],
  ['Memoria RAM Kingston Fury 16GB DDR5 5600MHz', 'Kingston', 'almacenamiento', 'memorias-ram', 'laptop', 259, 0, 4.8, 88, 'NUEVO'],
  // Periféricos
  ['Mouse Logitech M170 Inalámbrico', 'Logitech', 'perifericos', 'mouse-teclados', 'headset', 39, 49, 4.6, 430, ''],
  ['Teclado Logitech K120 USB Resistente a Salpicaduras', 'Logitech', 'perifericos', 'mouse-teclados', 'headset', 45, 0, 4.7, 512, ''],
  ['Combo Teclado y Mouse Logitech MK270 Inalámbrico', 'Logitech', 'perifericos', 'mouse-teclados', 'headset', 89, 109, 4.7, 298, ''],
  ['Mouse Gamer Logitech G203 Lightsync RGB 8000 DPI', 'Logitech', 'perifericos', 'gaming', 'headset', 119, 149, 4.8, 356, 'OFERTA'],
  ['Teclado Gamer Redragon Kumara K552 Mecánico RGB', 'Redragon', 'perifericos', 'gaming', 'headset', 149, 189, 4.7, 244, ''],
  ['Headset Gamer HyperX Cloud Stinger Core 7.1', 'HyperX', 'perifericos', 'gaming', 'headset', 199, 249, 4.8, 187, ''],
  ['Webcam Logitech C920 HD Pro 1080p', 'Logitech', 'perifericos', 'webcams', 'headset', 269, 319, 4.8, 402, 'NUEVO'],
  ['Parlantes Logitech Z200 Stereo 2.0', 'Logitech', 'perifericos', 'audio', 'headset', 129, 0, 4.6, 133, ''],
  // Energía
  ['UPS APC Back-UPS BX650LI 650VA 390W', 'APC', 'energia', 'ups', 'router', 219, 269, 4.7, 198, 'OFERTA'],
  ['UPS Forza NT-1011 1000VA 500W', 'Forza', 'energia', 'ups', 'router', 289, 0, 4.6, 124, ''],
  ['Estabilizador Forza FVR-1201 1200VA 8 Tomas', 'Forza', 'energia', 'ups', 'router', 99, 129, 4.5, 156, ''],
  ['Fuente de Poder Corsair CV550 550W 80 Plus Bronze', 'Corsair', 'energia', 'fuentes', 'router', 219, 259, 4.8, 210, 'NUEVO'],
  ['Supresor de Pico Forza FSP-1602 6 Tomas', 'Forza', 'energia', 'fuentes', 'router', 49, 0, 4.5, 98, ''],
  ['Cámara IP Hikvision 2MP WiFi Interior', 'Hikvision', 'energia', 'vigilancia', 'router', 129, 159, 4.7, 176, ''],
  ['DVR Hikvision 8 Canales 1080p Lite', 'Hikvision', 'energia', 'vigilancia', 'router', 349, 419, 4.7, 88, ''],
  // Accesorios
  ['Calculadora Casio HR-100RC con Impresión', 'Casio', 'accesorios', 'oficina', 'chair', 89, 0, 4.6, 142, ''],
  ['Trituradora de Papel GBC ShredMaster 8 Hojas', 'GBC', 'accesorios', 'oficina', 'chair', 349, 419, 4.5, 54, ''],
  ['Mochila para Laptop 15.6" Antirrobo con USB', 'Genérico', 'accesorios', 'accesorios-laptop', 'chair', 129, 169, 4.7, 231, 'OFERTA'],
  ['Maletín para Laptop 15.6" Ejecutivo', 'Genérico', 'accesorios', 'accesorios-laptop', 'chair', 99, 0, 4.6, 118, ''],
  ['Base Refrigerante para Laptop RGB 6 Ventiladores', 'Genérico', 'accesorios', 'accesorios-laptop', 'chair', 79, 99, 4.5, 176, ''],
  ['Cable HDMI 2.0 4K 60Hz 2 Metros', 'Genérico', 'accesorios', 'cables', 'chair', 25, 35, 4.7, 540, ''],
  ['Adaptador USB-C a HDMI 4K', 'Genérico', 'accesorios', 'cables', 'chair', 45, 0, 4.6, 288, ''],
  ['Antivirus ESET NOD32 1 Año 1 PC', 'ESET', 'accesorios', 'software', 'chair', 79, 99, 4.8, 143, ''],
  ['Licencia Microsoft Office 365 Personal 1 Año', 'Microsoft', 'accesorios', 'software', 'chair', 199, 249, 4.8, 205, 'NUEVO'],
]

const extraProducts = extraRows.map((row, i) => mk(301 + i, row))

export const products = [...seedProducts, ...extraProducts]

// Metadatos por categoría para la página de listado (encabezado, subcategorías
// con conteos, marcas con conteos y rango de precio del mockup).
export const categoryMeta = {
  'laptops-pc': {
    title: 'Laptops',
    subtitle: 'Encuentra las mejores laptops para trabajo, estudio y entretenimiento.',
    crumb: [{ label: 'Laptops & PC', to: '/categoria/laptops-pc' }, { label: 'Laptops' }],
    subcats: [
      { name: 'Laptops', slug: '', count: 96 },
      { name: 'Laptops Gamer', slug: 'laptops-gamer', count: 24 },
      { name: 'Ultrabooks', slug: 'ultrabooks', count: 18 },
      { name: '2 en 1 / Convertibles', slug: 'convertibles', count: 14 },
      { name: 'Accesorios para Laptop', slug: 'monitores', count: 32 },
    ],
    brandCounts: [['HP', 28], ['Lenovo', 22], ['Dell', 18], ['ASUS', 15], ['Acer', 13]],
    price: [699, 6999],
    featured: [1, 13, 14, 15, 18, 20, 17, 19, 16, 7],
  },
}

export const getCategoryMeta = (slug) => categoryMeta[slug] || null

export const getProduct = (slug) => products.find((p) => p.slug === slug)
export const getCategory = (slug) => categories.find((c) => c.slug === slug)
export const byCategory = (catSlug) => products.filter((p) => p.category === catSlug)

export const peso = (n) =>
  'S/ ' + n.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
