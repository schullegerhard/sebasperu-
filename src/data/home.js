// -------------------------------------------------------------------
// Datos de la Home (diseño Figma del cliente). Nombres, precios, ratings
// y badges tal como aparecen en el diseño. Las imágenes son las mismas
// fotos (Unsplash) que usa el diseño original.
// -------------------------------------------------------------------

// Fotos del diseño servidas localmente (public/img) para carga fiable.
const img = (id) => `/img/${id}.jpg`

export const homeBrands = ['HP', 'Epson', 'Brother', 'Canon', 'Lenovo', 'ASUS', 'Dell', 'Logitech', 'Kingston']

// Franja de categorías de la Home — refleja las categorías reales de la barra
// de navegación (y del admin): Computación, Impresión, Tóner, Tintas, Redes,
// Almacenamiento, Periféricos, Energía, Accesorios.
export const homeCategories = [
  { name: 'Todo', image: img('photo-1496181133206-80ce9b88a853'), to: '/productos' },
  { name: 'Computación', image: img('photo-1517336714731-489689fd1ca8'), to: '/categoria/laptops-pc' },
  { name: 'Impresión', image: img('photo-1613395450289-e560907d9308'), to: '/categoria/impresoras' },
  { name: 'Tóner', image: img('photo-1586953208448-b95a79798f07'), to: '/categoria/toner' },
  { name: 'Tintas', image: img('photo-1558618666-fcd25c85cd64'), to: '/categoria/tintas' },
  { name: 'Redes', image: img('photo-1606904825846-647eb07f5be2'), to: '/categoria/redes' },
  { name: 'Almacenamiento', image: img('photo-1628557118391-56cd62c9f2cb'), to: '/categoria/almacenamiento' },
  { name: 'Periféricos', image: img('photo-1615663245857-ac93bb7c39e7'), to: '/categoria/perifericos' },
  { name: 'Energía', image: img('photo-1716062890647-60feae0609d0'), to: '/categoria/energia' },
  { name: 'Accesorios', image: img('photo-1553062407-98eeb64c6a62'), to: '/categoria/accesorios' },
]

// Ofertas Flash (image con badge + barra de stock).
export const flashOffers = [
  { id: 201, brand: 'HP', sku: 'HP-664-BK', name: 'Tinta HP 664 Negro', image: img('photo-1740884730591-8f4878e2cc64'), price: 39, oldPrice: 49, off: 20, stock: 8 },
  { id: 202, brand: 'HP', sku: 'HP-664-COL', name: 'Tinta HP 664 Color', image: img('photo-1706895040634-62055892cbbb'), price: 44, oldPrice: 55, off: 20, stock: 5 },
  { id: 203, brand: 'HP', sku: 'HP-CE285A', name: 'Tóner HP 85A CE285A', image: img('photo-1612815154858-60aa4c59eaa6'), price: 189, oldPrice: 229, off: 17, stock: 3 },
  { id: 204, brand: 'HP', sku: 'HP-240G10', name: 'Laptop HP 240 G10 15.6"', image: img('photo-1683128069421-2c1881f70ed7'), price: 2199, oldPrice: 2699, off: 19, stock: 2 },
  { id: 205, brand: 'EPSON', sku: 'EP-664-X4', name: 'Set Tintas Epson 664 x4', image: img('photo-1558618666-fcd25c85cd64'), price: 129, oldPrice: 160, off: 19, stock: 6 },
  { id: 206, brand: 'SAMSUNG', sku: 'MLT-D101S', name: 'Tóner Samsung MLT-D101S', image: img('photo-1586953208448-b95a79798f07'), price: 159, oldPrice: 199, off: 20, stock: 4 },
  { id: 207, brand: 'LENOVO', sku: 'LEN-IP3', name: 'Laptop Lenovo IdeaPad 3', image: img('photo-1496181133206-80ce9b88a853'), price: 1899, oldPrice: 2299, off: 17, stock: 2 },
  { id: 208, brand: 'BROTHER', sku: 'TN-1060', name: 'Tóner Brother TN-1060', image: img('photo-1541807084-5c52b6b3adef'), price: 145, oldPrice: 179, off: 19, stock: 7 },
]

export const homeImpresoras = [
  { id: 211, brand: 'HP', sku: 'W1D32A', name: 'Impresora Multifunción HP DeskJet 2775 Wi-Fi/ Tinta HP 664/ 7.5 ppm/ W1D32A', image: img('photo-1612815154858-60aa4c59eaa6'), price: 299, oldPrice: 379, off: 21, rating: 5, reviews: 3210 },
  { id: 212, brand: 'EPSON', sku: 'C11CJ67303', name: 'Impresora Multifunción Epson EcoTank L3250 Wi-Fi/ Imprime Escanea Copia/ Tanque de Tinta/ C11CJ67303', image: img('photo-1613395450289-e560907d9308'), price: 699, oldPrice: 849, off: 18, rating: 5, reviews: 5840 },
  { id: 213, brand: 'HP', sku: '7MD66F', name: 'Impresora HP LaserJet M110w Láser Monocromática Wi-Fi/ 21 ppm/ Tóner 150A/ 7MD66F', image: img('photo-1765110278462-718471787c4b'), price: 599, oldPrice: 729, off: 18, rating: 5, reviews: 2103 },
  { id: 214, brand: 'CANON', sku: '4466C004', name: 'Impresora Multifunción Canon PIXMA G3160 MegaTank Wi-Fi/ Imprime Escanea Copia/ Color/ 4466C004', image: img('photo-1706895040634-62055892cbbb'), price: 649, rating: 5, reviews: 1540, badge: 'NUEVO' },
  { id: 215, brand: 'BROTHER', sku: 'DCPT520WYJ1', name: 'Impresora Multifunción Brother DCP-T520W Tanque de Tinta Wi-Fi/ Imprime Escanea Copia/ Color/ DCPT520WYJ1', image: img('photo-1774494168068-0f716c3aafcf'), price: 749, oldPrice: 899, off: 17, rating: 5, reviews: 987 },
]

export const homeToner = [
  { id: 221, brand: 'HP', sku: 'CE285A', name: 'Tóner HP 85A Negro CE285A/ LaserJet P1102 P1102W M1132 M1212/ Rendimiento 1600 pág.', image: img('photo-1586953208448-b95a79798f07'), price: 189, oldPrice: 229, off: 17, rating: 5, reviews: 3210 },
  { id: 222, brand: 'HP', sku: 'CB435A', name: 'Tóner HP 35A Negro CB435A/ LaserJet P1005 P1006 P1007 P1008/ Rendimiento 1500 pág.', image: img('photo-1586953208448-b95a79798f07'), price: 175, rating: 5, reviews: 2450, badge: 'NUEVO' },
  { id: 223, brand: 'SAMSUNG', sku: 'MLT-D101S', name: 'Tóner Samsung MLT-D101S Negro SU696A/ ML-2160 ML-2165 SCX-3400 SCX-3405/ Rendimiento 1500 pág.', image: img('photo-1586953208448-b95a79798f07'), price: 159, oldPrice: 199, off: 20, rating: 5, reviews: 1890 },
  { id: 224, brand: 'BROTHER', sku: 'TN-1060', name: 'Tóner Brother TN-1060 Negro/ HL-1110 HL-1112 DCP-1512 DCP-1602 MFC-1810/ Rendimiento 1000 pág.', image: img('photo-1586953208448-b95a79798f07'), price: 145, oldPrice: 179, off: 19, rating: 5, reviews: 1340 },
  { id: 225, brand: 'EPSON', sku: 'S050709', name: 'Tóner Epson M200 Negro S050709/ WorkForce AL-M200DN AL-MX200DWF/ Rendimiento 2500 pág.', image: img('photo-1586953208448-b95a79798f07'), price: 199, rating: 5, reviews: 780, badge: 'NUEVO' },
]

export const homeTintas = [
  { id: 231, brand: 'HP', sku: 'F6V29AL', name: 'Cartucho de Tinta HP 664 Negro F6V29AL/ DeskJet 2375 2775 3775/ Rendimiento 120 pág.', image: img('photo-1612815154858-60aa4c59eaa6'), price: 39, oldPrice: 49, off: 20, rating: 5, reviews: 4201 },
  { id: 232, brand: 'HP', sku: 'F6V28AL', name: 'Cartucho de Tinta HP 664 Tricolor F6V28AL/ DeskJet 2375 2775 3775/ Rendimiento 100 pág.', image: img('photo-1612815154858-60aa4c59eaa6'), price: 44, oldPrice: 55, off: 20, rating: 5, reviews: 3840 },
  { id: 233, brand: 'EPSON', sku: 'T504120-AL', name: 'Botella de Tinta Epson 504 Negro T504120-AL/ EcoTank L4150 L4160 L6161/ 7.7 ml/ 4500 pág.', image: img('photo-1558618666-fcd25c85cd64'), price: 35, rating: 5, reviews: 2980, badge: 'NUEVO' },
  { id: 234, brand: 'EPSON', sku: 'EP-664-PACK', name: 'Pack x4 Botellas Tinta Epson 664 Negro+Cyan+Magenta+Amarillo/ EcoTank L110 L210 L355/ 70 ml c/u', image: img('photo-1558618666-fcd25c85cd64'), price: 129, oldPrice: 160, off: 19, rating: 5, reviews: 5102 },
  { id: 235, brand: 'CANON', sku: '8287B001AA', name: 'Cartucho de Tinta Canon PG-745 Negro 8287B001AA/ PIXMA MG2410 MG2510 TS207/ 8 ml/ 180 pág.', image: img('photo-1612815154858-60aa4c59eaa6'), price: 42, oldPrice: 52, off: 19, rating: 5, reviews: 1720 },
]

export const homeLaptops = [
  { id: 241, brand: 'HP', sku: 'B9TP9LA', name: 'Laptop HP 15-FC0256LA Ryzen 5-7520U/ 16GB/ SSD 512GB/ 15.6"/ FreeDOS/ B9TP9LA', image: img('photo-1517336714731-489689fd1ca8'), price: 2199, oldPrice: 2699, off: 19, rating: 5, reviews: 842 },
  { id: 242, brand: 'LENOVO', sku: '82RK00NMLM', name: 'Laptop Lenovo IdeaPad 3 15IAU7 Intel Core i5-1235U/ 8GB/ SSD 256GB/ 15.6"/ Win11/ 82RK00NMLM', image: img('photo-1496181133206-80ce9b88a853'), price: 1899, oldPrice: 2299, off: 17, rating: 5, reviews: 1103 },
  { id: 243, brand: 'DELL', sku: 'i3520-7775BLK', name: 'Laptop Dell Inspiron 15 3520 Intel Core i7-1255U/ 16GB/ SSD 512GB/ 15.6"/ Win11/ i3520-7775BLK-PUS', image: img('photo-1593642632559-0c6d3fc62b89'), price: 2499, rating: 5, reviews: 674, badge: 'NUEVO' },
  { id: 244, brand: 'ASUS', sku: 'X1504ZA-NJ147W', name: 'Laptop Asus VivoBook 15 X1504ZA-NJ147W Intel Core i5-1235U/ 8GB/ SSD 512GB/ 15.6"/ Win11', image: img('photo-1525547719571-a2d4ac8945e2'), price: 2099, oldPrice: 2499, off: 16, rating: 5, reviews: 519 },
  { id: 245, brand: 'ACER', sku: 'NX.KHFAL.003', name: 'Laptop Acer Aspire 5 A515-58M Ryzen 5-7530U/ 16GB/ SSD 512GB/ 15.6"/ Win11/ NX.KHFAL.003', image: img('photo-1541807084-5c52b6b3adef'), price: 2299, oldPrice: 2699, off: 15, rating: 5, reviews: 432 },
]
