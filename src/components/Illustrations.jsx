// Self-contained SVG illustrations used for product cards, category tiles,
// brand logos and article thumbnails. Keeps the replica fully offline.

/* ---------- PRODUCTS ----------
   Cada producto recibe `seed` (id) para elegir una variante de color, de modo
   que dos productos del mismo tipo se vean distintos en las tarjetas. */

// Paletas de laptop: [wallpaper A, wallpaper B, color de chasis, color de teclado].
const LAPTOP_VARIANTS = [
  ['#3b82f6', '#1e3a8a', '#cbd5e1', '#94a3b8'], // azul Windows (HP plata)
  ['#0f172a', '#3730a3', '#1f2937', '#0b1220'], // gamer oscuro (Legion)
  ['#06b6d4', '#0e7490', '#d8dee9', '#a3acbd'], // teal/abstracto (Ultrabook)
  ['#22c55e', '#065f46', '#cbd5e1', '#94a3b8'], // verde (Acer)
  ['#a855f7', '#5b21b6', '#e2e8f0', '#aab2c4'], // púrpura
  ['#f97316', '#9a3412', '#d6dbe4', '#9aa3b2'], // naranja atardecer
]
const pick = (arr, seed) => arr[((Number(seed) || 0) % arr.length + arr.length) % arr.length]

export const LaptopImg = ({ seed, brand, ...p }) => {
  const [a, b, body, keys] = pick(LAPTOP_VARIANTS, seed)
  const gid = `lapg${seed ?? 0}`
  return (
    <svg viewBox="0 0 200 150" {...p}>
      <rect x="45" y="28" width="110" height="70" rx="4" fill="#0f172a" />
      <rect x="50" y="33" width="100" height="60" rx="2" fill={`url(#${gid})`} />
      <circle cx="100" cy="63" r="13" fill="rgba(255,255,255,.16)" />
      <path d="M30 98h140l10 16H20z" fill={body} />
      <rect x="30" y="98" width="140" height="6" fill={keys} />
      <rect x="82" y="106" width="36" height="4" rx="2" fill={keys} />
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={a} />
          <stop offset="1" stopColor={b} />
        </linearGradient>
      </defs>
    </svg>
  )
}

// Paletas de impresora: [color de acento del panel].
const PRINTER_VARIANTS = ['#3b82f6', '#0ea5e9', '#111827', '#ef4444', '#10b981']

export const PrinterImg = ({ seed, brand, ...p }) => {
  const accent = pick(PRINTER_VARIANTS, seed)
  return (
    <svg viewBox="0 0 200 150" {...p}>
      <rect x="45" y="40" width="110" height="42" rx="6" fill="#1f2937" />
      <rect x="55" y="28" width="90" height="20" rx="3" fill="#374151" />
      <rect x="60" y="82" width="80" height="30" rx="4" fill="#e5e7eb" />
      <rect x="64" y="100" width="72" height="14" rx="2" fill="#f8fafc" />
      <rect x="120" y="46" width="26" height="10" rx="2" fill={accent} />
      <circle cx="60" cy="51" r="3" fill="#22c55e" />
      <rect x="150" y="55" width="14" height="34" rx="3" fill={accent} opacity="0.85" />
    </svg>
  )
}

const TONER_VARIANTS = ['#3b82f6', '#0f172a', '#0ea5e9', '#7c3aed', '#dc2626']

export const TonerImg = ({ seed, brand, ...p }) => {
  const accent = pick(TONER_VARIANTS, seed)
  return (
    <svg viewBox="0 0 200 150" {...p}>
      <rect x="38" y="60" width="124" height="34" rx="6" fill="#111827" />
      <rect x="150" y="66" width="22" height="22" rx="4" fill="#1f2937" />
      <rect x="48" y="48" width="60" height="16" rx="3" fill="#1f2937" />
      <rect x="52" y="68" width="40" height="6" rx="3" fill="#e5e7eb" />
      <rect x="52" y="78" width="28" height="5" rx="2" fill="#9ca3af" />
      <rect x="118" y="70" width="20" height="14" rx="2" fill={accent} />
    </svg>
  )
}

export const InkImg = ({ color = '#1d4ed8', label = '664', ...p }) => {
  const light = ['#eab308', '#facc15', '#fde047'].includes(color)
  return (
    <svg viewBox="0 0 200 150" {...p}>
      <rect x="84" y="20" width="14" height="12" fill="#0f172a" />
      <rect x="80" y="30" width="22" height="8" rx="2" fill="#1e293b" />
      <path d="M78 40h46l-3 78a6 6 0 0 1-6 6H87a6 6 0 0 1-6-6z" fill="#0f172a" />
      <rect x="84" y="64" width="34" height="44" rx="3" fill={color} />
      <rect x="88" y="70" width="26" height="6" rx="2" fill="rgba(255,255,255,.6)" />
      <text x="101" y="92" fontSize="11" fill={light ? '#0f172a' : '#fff'} textAnchor="middle" fontFamily="Inter" fontWeight="700">{label}</text>
    </svg>
  )
}

export const RouterImg = (p) => (
  <svg viewBox="0 0 200 150" {...p}>
    <rect x="50" y="78" width="100" height="34" rx="6" fill="#111827" />
    <rect x="60" y="95" width="80" height="6" rx="3" fill="#1f2937" />
    <circle cx="68" cy="88" r="2.5" fill="#22c55e" />
    <circle cx="78" cy="88" r="2.5" fill="#3b82f6" />
    <g stroke="#1f2937" strokeWidth="4" strokeLinecap="round">
      <path d="M70 78 60 36" />
      <path d="M90 78 84 32" />
      <path d="M110 78 116 32" />
      <path d="M130 78 140 36" />
    </g>
  </svg>
)

const HEADSET_VARIANTS = ['#3b82f6', '#ef4444', '#10b981', '#a855f7', '#f97316']

export const HeadsetImg = ({ seed, brand, ...p }) => {
  const accent = pick(HEADSET_VARIANTS, seed)
  return (
    <svg viewBox="0 0 200 150" {...p}>
      <path d="M58 86V72a42 42 0 0 1 84 0v14" fill="none" stroke="#111827" strokeWidth="7" />
      <rect x="48" y="80" width="20" height="34" rx="8" fill="#1f2937" />
      <rect x="132" y="80" width="20" height="34" rx="8" fill="#1f2937" />
      <rect x="50" y="84" width="16" height="26" rx="6" fill={accent} opacity="0.5" />
      <rect x="134" y="84" width="16" height="26" rx="6" fill={accent} opacity="0.5" />
      <path d="M52 110c0 14 8 22 22 24" fill="none" stroke="#1f2937" strokeWidth="6" strokeLinecap="round" />
      <rect x="68" y="128" width="24" height="8" rx="4" fill={accent} />
    </svg>
  )
}

/* ---------- CATEGORY TILES (reuse product art on light bg) ---------- */

export const OfficeChairImg = (p) => (
  <svg viewBox="0 0 200 150" {...p}>
    <rect x="70" y="30" width="60" height="56" rx="12" fill="#111827" />
    <rect x="74" y="86" width="52" height="18" rx="6" fill="#1f2937" />
    <path d="M100 104v18" stroke="#374151" strokeWidth="5" />
    <path d="M82 134l18-12 18 12" stroke="#374151" strokeWidth="5" fill="none" strokeLinecap="round" />
    <circle cx="82" cy="136" r="4" fill="#1f2937" />
    <circle cx="118" cy="136" r="4" fill="#1f2937" />
  </svg>
)

/* ---------- BRANDS ---------- */

export const HpLogo = (p) => (
  <svg viewBox="0 0 64 64" {...p}>
    <circle cx="32" cy="32" r="30" fill="none" stroke="#0096d6" strokeWidth="4" />
    <text x="32" y="42" fontSize="26" fill="#0096d6" textAnchor="middle" fontFamily="Arial" fontWeight="700" fontStyle="italic">hp</text>
  </svg>
)

export const EpsonLogo = (p) => (
  <svg viewBox="0 0 200 60" {...p}>
    <text x="100" y="34" fontSize="30" fill="#1a3aa0" textAnchor="middle" fontFamily="Arial" fontWeight="700" letterSpacing="1">EPSON</text>
    <text x="100" y="48" fontSize="9" fill="#1a3aa0" textAnchor="middle" fontFamily="Arial" letterSpacing="2">EXCEED YOUR VISION</text>
  </svg>
)

export const CanonLogo = (p) => (
  <svg viewBox="0 0 200 60" {...p}>
    <text x="100" y="42" fontSize="38" fill="#cc0000" textAnchor="middle" fontFamily="Arial" fontWeight="700" fontStyle="italic">Canon</text>
  </svg>
)

export const BrotherLogo = (p) => (
  <svg viewBox="0 0 200 60" {...p}>
    <text x="100" y="34" fontSize="28" fill="#1a4ba0" textAnchor="middle" fontFamily="Arial" fontWeight="700">brother</text>
    <text x="100" y="48" fontSize="11" fill="#1a4ba0" textAnchor="middle" fontFamily="Arial" fontStyle="italic">at your side</text>
  </svg>
)

export const SamsungLogo = (p) => (
  <svg viewBox="0 0 200 60" {...p}>
    <text x="100" y="40" fontSize="30" fill="#1428a0" textAnchor="middle" fontFamily="Arial" fontWeight="700" letterSpacing="1">SAMSUNG</text>
  </svg>
)

export const LogitechLogo = (p) => (
  <svg viewBox="0 0 200 60" {...p}>
    <text x="100" y="40" fontSize="30" fill="#222" textAnchor="middle" fontFamily="Arial" fontWeight="400">logitech</text>
  </svg>
)

export const TpLinkLogo = (p) => (
  <svg viewBox="0 0 200 60" {...p}>
    <circle cx="44" cy="30" r="13" fill="none" stroke="#4acbd6" strokeWidth="4" />
    <path d="M44 23v14M37 30h14" stroke="#4acbd6" strokeWidth="4" strokeLinecap="round" />
    <text x="118" y="40" fontSize="26" fill="#4acbd6" textAnchor="middle" fontFamily="Arial" fontWeight="700">tp-link</text>
  </svg>
)

export const LenovoLogo = (p) => (
  <svg viewBox="0 0 200 60" {...p}>
    <rect x="40" y="16" width="120" height="28" fill="#e2231a" />
    <text x="100" y="37" fontSize="20" fill="#fff" textAnchor="middle" fontFamily="Arial" fontWeight="700">Lenovo</text>
  </svg>
)

export const AsusLogo = (p) => (
  <svg viewBox="0 0 200 60" {...p}>
    <text x="100" y="40" fontSize="32" fill="#1f1f1f" textAnchor="middle" fontFamily="Arial" fontWeight="800" letterSpacing="1">ASUS</text>
  </svg>
)

export const DellLogo = (p) => (
  <svg viewBox="0 0 200 60" {...p}>
    <circle cx="100" cy="30" r="24" fill="none" stroke="#007db8" strokeWidth="3" />
    <text x="100" y="38" fontSize="20" fill="#007db8" textAnchor="middle" fontFamily="Arial" fontWeight="800" letterSpacing="1">DELL</text>
  </svg>
)

export const KingstonLogo = (p) => (
  <svg viewBox="0 0 200 60" {...p}>
    <path d="M44 18l10 12-10 12-7-6 5-6-5-6z" fill="#dc2626" />
    <text x="115" y="38" fontSize="22" fill="#dc2626" textAnchor="middle" fontFamily="Arial" fontWeight="700">Kingston</text>
  </svg>
)

export const AcerLogo = (p) => (
  <svg viewBox="0 0 200 60" {...p}>
    <text x="100" y="40" fontSize="32" fill="#83b81a" textAnchor="middle" fontFamily="Arial" fontWeight="700" letterSpacing="1">acer</text>
  </svg>
)

/* ---------- ARTICLE THUMBS ---------- */

export const ArticlePrinter = (p) => (
  <svg viewBox="0 0 300 180" preserveAspectRatio="xMidYMid slice" {...p}>
    <rect width="300" height="180" fill="#eef2f7" />
    <rect x="100" y="60" width="100" height="40" rx="6" fill="#1f2937" />
    <rect x="110" y="48" width="80" height="18" rx="3" fill="#374151" />
    <rect x="115" y="100" width="70" height="26" rx="3" fill="#fff" />
    <rect x="160" y="66" width="22" height="9" rx="2" fill="#3b82f6" />
  </svg>
)

export const ArticleInk = (p) => (
  <svg viewBox="0 0 300 180" preserveAspectRatio="xMidYMid slice" {...p}>
    <rect width="300" height="180" fill="#eef2f7" />
    {['#06b6d4', '#ec4899', '#eab308', '#1e293b'].map((c, i) => (
      <g key={i}>
        <path d={`M${108 + i * 24} 70h18l-2 50h-14z`} fill={c} />
        <rect x={111 + i * 24} y="62" width="12" height="9" rx="2" fill="#0f172a" />
      </g>
    ))}
  </svg>
)

export const ArticleRouter = (p) => (
  <svg viewBox="0 0 300 180" preserveAspectRatio="xMidYMid slice" {...p}>
    <rect width="300" height="180" fill="#eef2f7" />
    <rect x="100" y="100" width="100" height="30" rx="6" fill="#111827" />
    <g stroke="#1f2937" strokeWidth="4" strokeLinecap="round">
      <path d="M118 100 110 60" />
      <path d="M140 100 134 56" />
      <path d="M160 100 166 56" />
      <path d="M182 100 190 60" />
    </g>
    <circle cx="116" cy="115" r="3" fill="#22c55e" />
  </svg>
)
