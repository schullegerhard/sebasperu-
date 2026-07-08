// ---------------------------------------------------------------------------
// Árbol de categorías del menú principal (según Estructura_Categorias_SEBASTPERU).
// FUENTE ÚNICA: alimenta el mega-menú (Header.jsx) y los registros de categoría
// que se cargan en la BD (scripts/load-category-tree.mjs).
//
// Estructura: 7 rubros principales → columnas (grupos visuales) → ítems [slug,name].
// Tóner y Tintas van ANIDADAS bajo Impresión (columnas con `groupSlug`): se crean
// como categorías propias con parent='impresoras', y sus ítems cuelgan de ellas.
// El resto de ítems cuelga directamente del rubro principal.
//
// Archivo de DATOS PURO (sin React) para poder importarlo también desde Node.
// ---------------------------------------------------------------------------

export const MENU_TREE = [
  { slug: 'laptops-pc', name: 'Computación', to: '/categoria/laptops-pc', cols: [
    { title: 'Equipos', items: [['laptops', 'Laptops'], ['mini-pc', 'Mini PC'], ['computadoras', 'Computadoras'], ['all-in-one', 'All In One'], ['tablets', 'Tablets'], ['servidores', 'Servidores']] },
    { title: 'Visualización', items: [['monitores', 'Monitores'], ['componentes-pc', 'Componentes PC']] },
  ] },
  { slug: 'impresoras', name: 'Impresión', to: '/categoria/impresoras', cols: [
    { title: 'Impresoras', items: [['impresoras-inkjet', 'Impresoras Inkjet'], ['impresoras-laser', 'Impresoras Láser'], ['impresoras-multifuncion', 'Impresoras Multifunción'], ['impresoras-matriciales', 'Impresoras Matriciales'], ['impresoras-termicas', 'Impresoras Térmicas'], ['impresoras-etiquetas', 'Impresoras de Etiquetas'], ['escaneres', 'Escáneres']] },
    { title: 'Tóner', groupSlug: 'toner', groupName: 'Tóner', groupImage: 'toner', items: [['toner-hp', 'Tóner HP'], ['toner-brother', 'Tóner Brother'], ['toner-canon', 'Tóner Canon'], ['toner-samsung', 'Tóner Samsung'], ['toner-kyocera', 'Tóner Kyocera'], ['toner-ricoh', 'Tóner Ricoh'], ['toner-xerox', 'Tóner Xerox'], ['toner-lexmark', 'Tóner Lexmark'], ['toner-konica-minolta', 'Tóner Konica Minolta']] },
    { title: 'Tintas & Cintas', groupSlug: 'tintas', groupName: 'Tintas', groupImage: 'ink', items: [['tintas-epson', 'Tintas Epson'], ['tintas-canon', 'Tintas Canon'], ['tintas-hp', 'Tintas HP'], ['cintas-epson', 'Cintas Epson'], ['cintas-brother', 'Cintas Brother'], ['cintas-etiquetas', 'Cintas de Etiquetas']] },
    { title: 'Repuestos', items: [['unidades-imagen', 'Unidades de Imagen'], ['fusores', 'Fusores'], ['rodillos', 'Rodillos'], ['repuestos-impresoras', 'Repuestos para Impresoras']] },
  ] },
  { slug: 'redes', name: 'Redes', to: '/categoria/redes', cols: [
    { title: 'Conectividad', items: [['routers', 'Routers'], ['access-point', 'Access Point'], ['switches', 'Switches'], ['modems', 'Módems'], ['tarjetas-red', 'Tarjetas de Red'], ['adaptadores-wifi', 'Adaptadores WiFi'], ['antenas', 'Antenas']] },
    { title: 'Cableado', items: [['cables-red', 'Cables de Red'], ['patch-cord', 'Patch Cord'], ['rack', 'Rack'], ['organizadores', 'Organizadores']] },
  ] },
  { slug: 'almacenamiento', name: 'Almacenamiento', to: '/categoria/almacenamiento', cols: [
    { title: 'Almacenamiento', items: [['ssd', 'SSD'], ['disco-duro-interno', 'Disco Duro Interno'], ['disco-duro-externo', 'Disco Duro Externo'], ['memorias-usb', 'Memorias USB'], ['tarjetas-microsd', 'Tarjetas MicroSD'], ['nas', 'NAS']] },
    { title: 'Memorias', items: [['ram-ddr4', 'Memoria RAM DDR4'], ['ram-ddr5', 'Memoria RAM DDR5'], ['memorias-laptop', 'Memorias Laptop']] },
  ] },
  { slug: 'perifericos', name: 'Periféricos', to: '/categoria/perifericos', cols: [
    { title: 'Periféricos', items: [['mouse', 'Mouse'], ['teclados', 'Teclados'], ['webcams', 'Webcams'], ['lectores', 'Lectores'], ['presentadores', 'Presentadores'], ['hub-usb', 'Hub USB'], ['docking-station', 'Docking Station']] },
    { title: 'Gaming', items: [['mouse-gamer', 'Mouse Gamer'], ['teclado-gamer', 'Teclado Gamer'], ['headset-gamer', 'Headset Gamer'], ['mouse-pad', 'Mouse Pad'], ['sillas-gamer', 'Sillas Gamer'], ['mandos', 'Mandos']] },
    { title: 'Audio', items: [['audifonos', 'Audífonos'], ['parlantes', 'Parlantes'], ['microfonos', 'Micrófonos']] },
  ] },
  { slug: 'energia', name: 'Energía', to: '/categoria/energia', cols: [
    { title: 'Energía', items: [['ups', 'UPS'], ['estabilizadores', 'Estabilizadores'], ['supresores-pico', 'Supresores de Pico'], ['energia-cargadores', 'Cargadores'], ['energia-adaptadores', 'Adaptadores'], ['fuentes-poder', 'Fuentes de Poder']] },
    { title: 'Vigilancia', items: [['camaras-ip', 'Cámaras IP'], ['camaras-wifi', 'Cámaras WiFi'], ['dvr', 'DVR'], ['nvr', 'NVR'], ['accesorios-cctv', 'Accesorios CCTV']] },
  ] },
  { slug: 'accesorios', name: 'Accesorios', to: '/categoria/accesorios', cols: [
    { title: 'Oficina', items: [['calculadoras', 'Calculadoras'], ['trituradoras', 'Trituradoras'], ['plastificadoras', 'Plastificadoras'], ['encuadernadoras', 'Encuadernadoras'], ['guillotinas', 'Guillotinas']] },
    { title: 'Accesorios Laptop', items: [['mochilas', 'Mochilas'], ['maletines', 'Maletines'], ['bases-laptop', 'Bases para Laptop'], ['soportes-monitor', 'Soportes para Monitor']] },
    { title: 'Cables & Adaptadores', items: [['cables-hdmi', 'Cables HDMI'], ['cables-displayport', 'Cables DisplayPort'], ['accesorios-adaptadores', 'Adaptadores'], ['conversores', 'Conversores'], ['accesorios-cargadores', 'Cargadores']] },
    { title: 'Software', items: [['antivirus', 'Antivirus'], ['licencias-microsoft', 'Licencias Microsoft'], ['software', 'Software']] },
  ] },
]

// Rubros principales (nivel 0). Los slugs coinciden con los registros existentes.
export const MAINS = MENU_TREE.map((m) => ({ slug: m.slug, name: m.name }))

// Lista plana de registros de categoría a crear/asegurar (subcategorías + los
// registros de grupo Tóner/Tintas anidados bajo Impresión). Cada uno: {slug,name,parent,image?}.
export const CATEGORY_RECORDS = (() => {
  const out = []
  for (const main of MENU_TREE) {
    for (const col of main.cols) {
      const itemParent = col.groupSlug || main.slug
      if (col.groupSlug) out.push({ slug: col.groupSlug, name: col.groupName || col.title, parent: main.slug, image: col.groupImage })
      for (const [slug, name] of col.items) out.push({ slug, name, parent: itemParent })
    }
  }
  return out
})()
