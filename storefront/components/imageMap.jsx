import {
  LaptopImg, PrinterImg, TonerImg, InkImg, RouterImg, HeadsetImg, OfficeChairImg,
  HpLogo, EpsonLogo, CanonLogo, BrotherLogo, SamsungLogo, LogitechLogo, TpLinkLogo,
  LenovoLogo, AsusLogo, DellLogo, KingstonLogo,
} from './Illustrations.jsx'

const map = {
  laptop: LaptopImg, printer: PrinterImg, toner: TonerImg, ink: InkImg,
  router: RouterImg, headset: HeadsetImg, chair: OfficeChairImg,
}

const isUrl = (s) => typeof s === 'string' && (s.startsWith('data:') || s.startsWith('http') || s.startsWith('/uploads'))

// Resolve a product/category image to a real <img> (uploaded/URL) or an SVG icon.
export const ProductImage = ({ image, tint, label, alt = '', ...props }) => {
  if (isUrl(image)) {
    const { className, style } = props
    return <img src={image} alt={alt} loading="lazy" className={className}
      style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', ...style }} />
  }
  const Cmp = map[image] || LaptopImg
  const extra = {}
  if (image === 'ink') {
    if (tint) extra.color = tint
    if (label) extra.label = label
  }
  return <Cmp {...extra} {...props} />
}

export const brandLogo = {
  HP: HpLogo, Epson: EpsonLogo, Canon: CanonLogo, Brother: BrotherLogo,
  Samsung: SamsungLogo, Logitech: LogitechLogo, 'TP-Link': TpLinkLogo,
  Lenovo: LenovoLogo, ASUS: AsusLogo, Dell: DellLogo, Kingston: KingstonLogo,
}
