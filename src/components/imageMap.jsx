import {
  LaptopImg, PrinterImg, TonerImg, InkImg, RouterImg, HeadsetImg, OfficeChairImg,
  HpLogo, EpsonLogo, CanonLogo, BrotherLogo, SamsungLogo, LogitechLogo, TpLinkLogo,
  LenovoLogo, AsusLogo, DellLogo, KingstonLogo, AcerLogo,
} from './Illustrations.jsx'
import { useImageOverride } from '../context/ProductOverrides.jsx'

const map = {
  laptop: LaptopImg, printer: PrinterImg, toner: TonerImg, ink: InkImg,
  router: RouterImg, headset: HeadsetImg, chair: OfficeChairImg,
}

// Detecta imágenes reales (subidas/URL/ruta local) vs. claves de ícono SVG.
const isUrl = (s) => typeof s === 'string' && (s.startsWith('data:') || s.startsWith('http') || s.startsWith('/uploads') || /^\/.+\.(jpe?g|png|webp|gif|avif)$/i.test(s))

// Resolve a product/category image to a real <img> (uploaded/URL) or an SVG icon.
// `seed` (a product id/number) selects a color variant so products of the same
// type still look visually distinct. For ink, optional `tint`/`label` color the bottle.
export const ProductImage = ({ image, tint, label, seed, brand, alt = '', ...props }) => {
  // Si el admin subió una imagen para este producto (por id = seed), úsala
  // en lugar de la ilustración SVG estática.
  const override = useImageOverride(seed)
  const src = override || image
  if (isUrl(src)) {
    const { className, style } = props
    return <img src={src} alt={alt} loading="lazy" className={className}
      style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', ...style }} />
  }
  const Cmp = map[image] || LaptopImg
  const extra = {}
  if (image === 'ink') {
    if (tint) extra.color = tint
    if (label) extra.label = label
  } else if (seed != null) {
    extra.seed = seed
  }
  if (brand) extra.brand = brand
  return <Cmp {...extra} {...props} />
}

export const brandLogo = {
  HP: HpLogo, Epson: EpsonLogo, Canon: CanonLogo, Brother: BrotherLogo,
  Samsung: SamsungLogo, Logitech: LogitechLogo, 'TP-Link': TpLinkLogo,
  Lenovo: LenovoLogo, ASUS: AsusLogo, Dell: DellLogo, Kingston: KingstonLogo,
  Acer: AcerLogo,
}
