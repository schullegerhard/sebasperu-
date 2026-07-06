import { useState, useEffect, useCallback } from "react";
import { ShoppingCart } from "lucide-react";
import { Search } from "lucide-react";
import { Menu } from "lucide-react";
import { X } from "lucide-react";
import { Star } from "lucide-react";
import { Zap } from "lucide-react";
import { Shield } from "lucide-react";
import { Truck } from "lucide-react";
import { Headphones } from "lucide-react";
import { Cpu } from "lucide-react";
import { ArrowRight } from "lucide-react";
import { Plus } from "lucide-react";
import { Minus } from "lucide-react";
import { Trash2 } from "lucide-react";
import { Tag } from "lucide-react";
import { Heart } from "lucide-react";
import { Phone } from "lucide-react";
import { Mail } from "lucide-react";
import { MapPin } from "lucide-react";
import { Facebook } from "lucide-react";
import { Instagram } from "lucide-react";
import { Youtube } from "lucide-react";
import { ChevronLeft } from "lucide-react";
import { ChevronRight } from "lucide-react";
import { ChevronDown } from "lucide-react";
import { Printer } from "lucide-react";
import { Package } from "lucide-react";
import logoSrc from "@/imports/logo.png";
import productImgSrc from "@/imports/image-40.png";

// ─── Productos ────────────────────────────────────────────────────────────────

const PRODUCTS = [
  // Laptops
  {
    id: 1,
    name: "Laptop HP 15-FC0256LA Ryzen 5-7520U/ 16GB/ SSD 512GB/ 15.6\"/ FreeDOS/ B9TP9LA",
    brand: "HP",
    category: "laptops",
    price: 2199,
    originalPrice: 2699,
    rating: 4.8,
    reviews: 842,
    badge: "OFERTA",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=400&fit=crop&auto=format",
    specs: ["Intel Core i5-1335U", "8 GB RAM", "512 GB SSD"],
  },
  {
    id: 2,
    name: "Laptop Lenovo IdeaPad 3 15IAU7 Intel Core i5-1235U/ 8GB/ SSD 256GB/ 15.6\"/ Win11/ 82RK00NMLM",
    brand: "Lenovo",
    category: "laptops",
    price: 1899,
    originalPrice: 2299,
    rating: 4.7,
    reviews: 1103,
    badge: "OFERTA",
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&h=400&fit=crop&auto=format",
    specs: ["AMD Ryzen 5 7530U", "8 GB RAM", "256 GB SSD"],
  },
  {
    id: 3,
    name: "Laptop Dell Inspiron 15 3520 Intel Core i7-1255U/ 16GB/ SSD 512GB/ 15.6\"/ Win11/ i3520-7775BLK-PUS",
    brand: "Dell",
    category: "laptops",
    price: 2499,
    originalPrice: null,
    rating: 4.7,
    reviews: 674,
    badge: "NUEVO",
    image: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&h=400&fit=crop&auto=format",
    specs: ["Intel Core i7-1255U", "16 GB RAM", "512 GB SSD"],
  },
  {
    id: 4,
    name: "Laptop Asus VivoBook 15 X1504ZA-NJ147W Intel Core i5-1235U/ 8GB/ SSD 512GB/ 15.6\"/ Win11",
    brand: "ASUS",
    category: "laptops",
    price: 2099,
    originalPrice: 2499,
    rating: 4.6,
    reviews: 519,
    badge: "OFERTA",
    image: "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=600&h=400&fit=crop&auto=format",
    specs: ["Intel Core i5-1235U", "8 GB RAM", "512 GB NVMe"],
  },
  {
    id: 15,
    name: "Laptop Acer Aspire 5 A515-58M Ryzen 5-7530U/ 16GB/ SSD 512GB/ 15.6\"/ Win11/ NX.KHFAL.003",
    brand: "Acer",
    category: "laptops",
    price: 2299,
    originalPrice: 2699,
    rating: 4.7,
    reviews: 432,
    badge: "OFERTA",
    image: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=600&h=400&fit=crop&auto=format",
    specs: ["AMD Ryzen 5-7530U", "16 GB RAM", "512 GB SSD"],
  },
  {
    id: 16,
    name: "Laptop MSI Modern 15 B13M Intel Core i7-1355U/ 16GB/ SSD 512GB/ 15.6\"/ Win11/ 9S7-15H112-1293",
    brand: "MSI",
    category: "laptops",
    price: 2899,
    originalPrice: 3299,
    rating: 4.8,
    reviews: 287,
    badge: "OFERTA",
    image: "https://images.unsplash.com/photo-1593642634367-d91a135587b5?w=600&h=400&fit=crop&auto=format",
    specs: ["Intel Core i7-1355U", "16 GB RAM", "512 GB NVMe"],
  },
  // Tintas
  {
    id: 5,
    name: "Cartucho de Tinta HP 664 Negro F6V29AL/ DeskJet 2375 2775 3775/ Rendimiento 120 pág.",
    brand: "HP",
    category: "tintas",
    price: 39,
    originalPrice: 49,
    rating: 4.9,
    reviews: 4201,
    badge: "OFERTA",
    image: "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=600&h=400&fit=crop&auto=format",
    specs: ["2 ml de tinta", "HP DeskJet 2375/3775", "Rendimiento 120 pág."],
  },
  {
    id: 6,
    name: "Cartucho de Tinta HP 664 Tricolor F6V28AL/ DeskJet 2375 2775 3775/ Rendimiento 100 pág.",
    brand: "HP",
    category: "tintas",
    price: 44,
    originalPrice: 55,
    rating: 4.8,
    reviews: 3840,
    badge: "OFERTA",
    image: "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=600&h=400&fit=crop&auto=format",
    specs: ["Tricolor CMY", "HP DeskJet 2375/3775", "Rendimiento 100 pág."],
  },
  {
    id: 7,
    name: "Botella de Tinta Epson 504 Negro T504120-AL/ EcoTank L4150 L4160 L6161/ 7.7 ml/ 4500 pág.",
    brand: "Epson",
    category: "tintas",
    price: 35,
    originalPrice: null,
    rating: 4.8,
    reviews: 2980,
    badge: "NUEVO",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop&auto=format",
    specs: ["7.7 ml", "EcoTank L4150/L4160", "Rendimiento 4500 pág."],
  },
  {
    id: 8,
    name: "Pack x4 Botellas Tinta Epson 664 Negro+Cyan+Magenta+Amarillo/ EcoTank L110 L210 L355/ 70 ml c/u",
    brand: "Epson",
    category: "tintas",
    price: 129,
    originalPrice: 160,
    rating: 4.9,
    reviews: 5102,
    badge: "TOP",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop&auto=format",
    specs: ["Negro + CMY", "EcoTank L110/L210", "70 ml c/u"],
  },
  {
    id: 9,
    name: "Cartucho de Tinta Canon PG-745 Negro 8287B001AA/ PIXMA MG2410 MG2510 TS207/ 8 ml/ 180 pág.",
    brand: "Canon",
    category: "tintas",
    price: 42,
    originalPrice: 52,
    rating: 4.7,
    reviews: 1720,
    badge: "OFERTA",
    image: "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=600&h=400&fit=crop&auto=format",
    specs: ["8 ml", "PIXMA MG2410/MG2510", "Rendimiento 180 pág."],
  },
  // Impresoras
  {
    id: 20,
    name: "Impresora Multifunción HP DeskJet 2775 Wi-Fi/ Imprime Escanea Copia/ Tinta HP 664/ 7.5 ppm/ W1D32A",
    brand: "HP",
    category: "impresoras",
    price: 299,
    originalPrice: 379,
    rating: 4.7,
    reviews: 3210,
    badge: "OFERTA",
    image: "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=600&h=400&fit=crop&auto=format",
    specs: ["Multifunción", "Wi-Fi", "Imprime/Escanea/Copia"],
  },
  {
    id: 21,
    name: "Impresora Multifunción Epson EcoTank L3250 Wi-Fi/ Imprime Escanea Copia/ Tanque de Tinta/ C11CJ67303",
    brand: "Epson",
    category: "impresoras",
    price: 699,
    originalPrice: 849,
    rating: 4.9,
    reviews: 5840,
    badge: "TOP",
    image: "https://images.unsplash.com/photo-1613395450289-e560907d9308?w=600&h=400&fit=crop&auto=format",
    specs: ["Tanque de tinta", "Wi-Fi", "Imprime/Escanea/Copia"],
  },
  {
    id: 22,
    name: "Impresora HP LaserJet M110w Láser Monocromática Wi-Fi/ 21 ppm/ Tóner HP 150A/ 7MD66F",
    brand: "HP",
    category: "impresoras",
    price: 599,
    originalPrice: 729,
    rating: 4.8,
    reviews: 2103,
    badge: "OFERTA",
    image: "https://images.unsplash.com/photo-1765110278462-718471787c4b?w=600&h=400&fit=crop&auto=format",
    specs: ["Láser mono", "Wi-Fi", "21 ppm"],
  },
  {
    id: 23,
    name: "Impresora Multifunción Canon PIXMA G3160 MegaTank Wi-Fi/ Imprime Escanea Copia/ Color/ 4466C004",
    brand: "Canon",
    category: "impresoras",
    price: 649,
    originalPrice: null,
    rating: 4.7,
    reviews: 1540,
    badge: "NUEVO",
    image: "https://images.unsplash.com/photo-1706895040634-62055892cbbb?w=600&h=400&fit=crop&auto=format",
    specs: ["MegaTank", "Wi-Fi", "Imprime/Escanea/Copia"],
  },
  {
    id: 24,
    name: "Impresora Multifunción Brother DCP-T520W Tanque de Tinta Wi-Fi/ Imprime Escanea Copia/ Color/ DCPT520WYJ1",
    brand: "Brother",
    category: "impresoras",
    price: 749,
    originalPrice: 899,
    rating: 4.8,
    reviews: 987,
    badge: "OFERTA",
    image: "https://images.unsplash.com/photo-1774494168068-0f716c3aafcf?w=600&h=400&fit=crop&auto=format",
    specs: ["Tanque de tinta", "Wi-Fi", "Dúplex manual"],
  },
  {
    id: 25,
    name: "Impresora Multifunción Epson EcoTank L5590 Wi-Fi/ Fax/ ADF 30 hojas/ Imprime Escanea Copia/ C11CJ29303",
    brand: "Epson",
    category: "impresoras",
    price: 1099,
    originalPrice: 1299,
    rating: 4.9,
    reviews: 2310,
    badge: "TOP",
    image: "https://images.unsplash.com/photo-1612814266697-e5814f3063cf?w=600&h=400&fit=crop&auto=format",
    specs: ["Fax incluido", "Wi-Fi", "ADF 30 hojas"],
  },
  {
    id: 26,
    name: "Impresora Multifunción HP OfficeJet Pro 9120 Wi-Fi/ Dúplex Automático/ 22 ppm color/ ADF/ 4V2N0C",
    brand: "HP",
    category: "impresoras",
    price: 1249,
    originalPrice: 1499,
    rating: 4.8,
    reviews: 1760,
    badge: "OFERTA",
    image: "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=600&h=400&fit=crop&auto=format",
    specs: ["Dúplex automático", "Wi-Fi", "22 ppm color"],
  },
  // Tóner
  {
    id: 10,
    name: "Tóner HP 85A Negro CE285A/ LaserJet P1102 P1102W M1132 M1212/ Rendimiento 1600 pág.",
    brand: "HP",
    category: "toner",
    price: 189,
    originalPrice: 229,
    rating: 4.9,
    reviews: 3210,
    badge: "OFERTA",
    image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=600&h=400&fit=crop&auto=format",
    specs: ["1600 páginas", "HP LaserJet P1102/M1132", "Negro"],
  },
  {
    id: 11,
    name: "Tóner HP 35A Negro CB435A/ LaserJet P1005 P1006 P1007 P1008/ Rendimiento 1500 pág.",
    brand: "HP",
    category: "toner",
    price: 175,
    originalPrice: null,
    rating: 4.8,
    reviews: 2450,
    badge: "NUEVO",
    image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=600&h=400&fit=crop&auto=format",
    specs: ["1500 páginas", "HP LaserJet P1005/P1006", "Negro"],
  },
  {
    id: 12,
    name: "Tóner Samsung MLT-D101S Negro SU696A/ ML-2160 ML-2165 SCX-3400 SCX-3405/ Rendimiento 1500 pág.",
    brand: "Samsung",
    category: "toner",
    price: 159,
    originalPrice: 199,
    rating: 4.7,
    reviews: 1890,
    badge: "OFERTA",
    image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=600&h=400&fit=crop&auto=format",
    specs: ["1500 páginas", "ML-2160/SCX-3405", "Negro"],
  },
  {
    id: 13,
    name: "Tóner Brother TN-1060 Negro/ HL-1110 HL-1112 DCP-1512 DCP-1602 MFC-1810/ Rendimiento 1000 pág.",
    brand: "Brother",
    category: "toner",
    price: 145,
    originalPrice: 179,
    rating: 4.8,
    reviews: 1340,
    badge: "OFERTA",
    image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=600&h=400&fit=crop&auto=format",
    specs: ["1000 páginas", "HL-1110/DCP-1512", "Negro"],
  },
  {
    id: 14,
    name: "Tóner Epson M200 Negro S050709/ WorkForce AL-M200DN AL-MX200DWF/ Rendimiento 2500 pág.",
    brand: "Epson",
    category: "toner",
    price: 199,
    originalPrice: null,
    rating: 4.7,
    reviews: 780,
    badge: "NUEVO",
    image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=600&h=400&fit=crop&auto=format",
    specs: ["2500 páginas", "WorkForce M200/MX200", "Negro"],
  },
];

const CATEGORIES = [
  { id: "all", label: "Todo", icon: Zap },
  { id: "impresoras", label: "Impresoras", icon: Printer },
  { id: "laptops", label: "Laptops", icon: Cpu },
  { id: "tintas", label: "Tintas", icon: Printer },
  { id: "toner", label: "Tóner", icon: Package },
];

const MEGA_MENU = [
  {
    label: "Computación",
    cols: [
      { title: "Equipos", items: ["Laptops", "Mini PC", "Computadoras", "All In One", "Tablets", "Servidores"] },
      { title: "Visualización", items: ["Monitores", "Componentes PC"] },
    ],
  },
  {
    label: "Impresión",
    cols: [
      { title: "Impresoras", items: ["Impresoras Inkjet", "Impresoras Láser", "Impresoras Multifunción", "Impresoras Matriciales", "Impresoras Térmicas", "Impresoras de Etiquetas", "Escáneres"] },
      { title: "Tóner", items: ["Tóner HP", "Tóner Brother", "Tóner Canon", "Tóner Samsung", "Tóner Kyocera", "Tóner Ricoh", "Tóner Xerox", "Tóner Lexmark", "Tóner Konica Minolta"] },
      { title: "Tintas & Cintas", items: ["Tintas Epson", "Tintas Canon", "Tintas HP", "Cintas Epson", "Cintas Brother", "Cintas de Etiquetas"] },
      { title: "Repuestos", items: ["Unidades de Imagen", "Fusores", "Rodillos", "Repuestos para Impresoras"] },
    ],
  },
  {
    label: "Redes",
    cols: [
      { title: "Conectividad", items: ["Routers", "Access Point", "Switches", "Módems", "Tarjetas de Red", "Adaptadores WiFi", "Antenas"] },
      { title: "Cableado", items: ["Cables de Red", "Patch Cord", "Rack", "Organizadores"] },
    ],
  },
  {
    label: "Almacenamiento",
    cols: [
      { title: "Almacenamiento", items: ["SSD", "Disco Duro Interno", "Disco Duro Externo", "Memorias USB", "Tarjetas MicroSD", "NAS"] },
      { title: "Memorias", items: ["Memoria RAM DDR4", "Memoria RAM DDR5", "Memorias Laptop"] },
    ],
  },
  {
    label: "Periféricos",
    cols: [
      { title: "Periféricos", items: ["Mouse", "Teclados", "Webcams", "Lectores", "Presentadores", "Hub USB", "Docking Station"] },
      { title: "Gaming", items: ["Mouse Gamer", "Teclado Gamer", "Headset Gamer", "Mouse Pad", "Sillas Gamer", "Mandos"] },
      { title: "Audio", items: ["Audífonos", "Headsets Gamer", "Parlantes", "Micrófonos"] },
    ],
  },
  {
    label: "Energía",
    cols: [
      { title: "Energía", items: ["UPS", "Estabilizadores", "Supresores de Pico", "Cargadores", "Adaptadores", "Fuentes de Poder"] },
      { title: "Vigilancia", items: ["Cámaras IP", "Cámaras WiFi", "DVR", "NVR", "Accesorios CCTV"] },
    ],
  },
  {
    label: "Accesorios",
    cols: [
      { title: "Oficina", items: ["Calculadoras", "Trituradoras", "Plastificadoras", "Encuadernadoras", "Guillotinas"] },
      { title: "Accesorios Laptop", items: ["Mochilas", "Maletines", "Bases para Laptop", "Soportes para Monitor"] },
      { title: "Cables & Adaptadores", items: ["Cables HDMI", "Cables DisplayPort", "Adaptadores", "Conversores", "Cargadores"] },
      { title: "Software", items: ["Antivirus", "Licencias Microsoft", "Software"] },
    ],
  },
];

// ─── Carrusel data ────────────────────────────────────────────────────────────

const SLIDES = [
  {
    id: 1,
    tag: "CYBERWEEK — Hasta 40% OFF",
    title: "Tintas y Tóner\nal mejor precio\ndel Perú",
    subtitle: "HP, Epson, Canon, Brother y más marcas con garantía oficial. Envío a todo el país.",
    cta: "Ver Tintas",
    ctaCategory: "tintas",
    accent: "#0047cc",
    bg: "linear-gradient(135deg, #001a6e 0%, #0047cc 55%, #1a7fff 100%)",
    image: "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=700&h=500&fit=crop&auto=format",
    badge: "bg-amber-400 text-[#001a6e]",
  },
  {
    id: 2,
    tag: "NUEVA COLECCIÓN 2024",
    title: "Laptops HP, Dell\ny Lenovo desde\nS/ 1,899",
    subtitle: "Procesadores Intel Core i5 e i7 de 12ª y 13ª generación. Cuotas sin intereses.",
    cta: "Ver Laptops",
    ctaCategory: "laptops",
    accent: "#ff4300",
    bg: "linear-gradient(135deg, #1a0a00 0%, #cc3300 55%, #ff5500 100%)",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=700&h=500&fit=crop&auto=format",
    badge: "bg-white text-[#cc3300]",
  },
  {
    id: 3,
    tag: "STOCK DISPONIBLE",
    title: "Tóner original\npara impresoras\nlaser",
    subtitle: "HP, Samsung, Brother y Epson. Entrega en 24 horas en Lima.",
    cta: "Ver Tóner",
    ctaCategory: "toner",
    accent: "#0e7a4a",
    bg: "linear-gradient(135deg, #00200f 0%, #0e7a4a 55%, #14a862 100%)",
    image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=700&h=500&fit=crop&auto=format",
    badge: "bg-white text-[#0e7a4a]",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

type CartItem = { product: (typeof PRODUCTS)[0]; qty: number };

function formatPrice(n: number) {
  return `S/ ${n.toLocaleString("es-PE", { minimumFractionDigits: 0 })}`;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} size={11}
          className={i <= Math.round(rating) ? "fill-amber-400 text-amber-400" : "fill-muted text-muted-foreground"} />
      ))}
    </div>
  );
}

const BADGE_STYLES: Record<string, string> = {
  OFERTA: "bg-[#ff4300] text-white",
  TOP: "bg-[#0047cc] text-white",
  NUEVO: "bg-emerald-500 text-white",
  HOT: "bg-orange-500 text-white",
};

// ─── Product Page ─────────────────────────────────────────────────────────────

function ProductPage({
  productId,
  fromCategory,
  fromLabel,
  onAddToCart,
  onGoHome,
  onGoCategory,
  onGoProduct,
}: {
  productId: number;
  fromCategory?: string;
  fromLabel?: string;
  onAddToCart: (p: (typeof PRODUCTS)[0]) => void;
  onGoHome: () => void;
  onGoCategory?: (cat: string, label: string) => void;
  onGoProduct: (id: number) => void;
}) {
  const product = PRODUCTS.find((p) => p.id === productId)!;
  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [wished, setWished] = useState(false);
  const [addedFeedback, setAddedFeedback] = useState(false);
  const [activeTab, setActiveTab] = useState<"desc" | "specs" | "reviews">("desc");

  const images = [productImgSrc, product.image, productImgSrc, product.image];
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;
  const related = PRODUCTS.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  function handleAddToCart() {
    for (let i = 0; i < qty; i++) onAddToCart(product);
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 2000);
  }

  const SPECS = [
    { label: "Marca", value: product.brand },
    { label: "Modelo", value: `${product.brand}-${product.id.toString().padStart(5, "0")}` },
    { label: "Número de Parte", value: `${product.brand.toUpperCase()}${product.id.toString().padStart(6, "0")}` },
    { label: "Tiempo de Respuesta", value: product.specs[0] },
    { label: "Tasa de Refresco", value: product.specs[1] ?? "—" },
    { label: "Conectividad", value: product.specs[2] ?? "—" },
    { label: "Garantía", value: "12 meses oficial" },
    { label: "País", value: "Perú" },
    { label: "Color", value: "Negro" },
  ];

  const today = new Date();
  const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1);
  const plus2 = new Date(today); plus2.setDate(today.getDate() + 2);
  const plus4 = new Date(today); plus4.setDate(today.getDate() + 4);
  const fmt = (d: Date) => `${d.getDate().toString().padStart(2,"0")}/${(d.getMonth()+1).toString().padStart(2,"0")}`;

  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-2">

        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2 flex-wrap">
          <button onClick={onGoHome} className="hover:text-primary transition-colors">Inicio</button>
          <ChevronRight size={10} />
          {fromCategory && fromLabel && onGoCategory && (
            <>
              <button onClick={() => onGoCategory(fromCategory, fromLabel)} className="hover:text-primary transition-colors">{fromLabel}</button>
              <ChevronRight size={10} />
            </>
          )}
          <span className="text-foreground/60 truncate max-w-xs">{product.name}</span>
        </div>

        {/* Main layout: thumbnails | main image | info */}
        <div className="grid grid-cols-1 lg:grid-cols-[72px_1fr_1fr] gap-5 mb-8 items-start" style={{ alignItems: "start" }}>

          {/* ── Col 1: Thumbnail strip ── */}
          <div className="hidden lg:flex flex-col gap-2">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImg(i)}
                className={`w-full aspect-square rounded-lg border-2 overflow-hidden transition-all bg-white ${activeImg === i ? "border-primary shadow-md shadow-blue-100" : "border-border hover:border-primary/50 hover:shadow-sm"}`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>

          {/* ── Col 2: Main image ── */}
          <div className="bg-white rounded-xl border border-border overflow-hidden relative" style={{ aspectRatio: "1/1", boxShadow: "0 4px 24px rgba(26,86,255,0.10)" }}>
            <img src={images[activeImg]} alt={product.name} className="w-full h-full object-contain p-6" />
            {discount && (
              <div className="absolute top-3 left-3 bg-[#ff4300] text-white text-xs font-black px-2.5 py-1 rounded-lg shadow">
                -{discount}%
              </div>
            )}
            <button
              onClick={() => setWished((w) => !w)}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white shadow border border-border flex items-center justify-center hover:border-[#ff4300] transition-colors"
            >
              <Heart size={14} className={wished ? "fill-[#ff4300] text-[#ff4300]" : "text-muted-foreground"} />
            </button>
            <button onClick={() => setActiveImg((a) => (a - 1 + images.length) % images.length)} className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-black transition-colors shadow">
              <ChevronLeft size={18} />
            </button>
            <button onClick={() => setActiveImg((a) => (a + 1) % images.length)} className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-black transition-colors shadow">
              <ChevronRight size={18} />
            </button>
          </div>

          {/* ── Right: all product info ── */}
          <div className="flex flex-col gap-4 bg-white rounded-xl border border-border p-6 self-start" style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}>

            {/* Brand */}
            <p className="text-sm font-black text-primary uppercase tracking-widest">{product.brand}</p>

            {/* Title */}
            <h1 className="text-xl font-black text-foreground leading-snug" style={{ fontFamily: "Nunito Sans, sans-serif" }}>
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <StarRating rating={product.rating} />
              <span className="text-xs text-muted-foreground">({product.reviews.toLocaleString()} valoraciones)</span>
            </div>

            {/* Código */}
            <p className="text-xs text-muted-foreground">
              Código: <span className="font-mono font-bold text-foreground">{product.brand.toUpperCase()}{product.id.toString().padStart(6, "0")}</span>
            </p>

            {/* Price */}
            <div className="flex flex-col gap-1 border-t border-border pt-3">
              <div className="flex items-center gap-2">
                <span className="bg-[#ff4300] text-white text-[10px] font-black px-2 py-0.5 rounded">PRECIO ONLINE</span>
                {discount && <span className="text-xs font-bold text-[#ff4300]">-{discount}%</span>}
              </div>
              <div className="flex items-baseline gap-3">
                <span className="text-2xl font-black text-foreground" style={{ fontFamily: "Nunito Sans, sans-serif" }}>
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && (
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground">Precio regular</span>
                    <span className="text-sm text-muted-foreground line-through">{formatPrice(product.originalPrice)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Stock */}
            <p className="text-sm font-semibold text-emerald-600 flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              Disponible más de 10 unidades
            </p>

            {/* Shipping options (image-36) */}
            <div className="border border-border rounded-xl overflow-hidden">
              {/* Delivery details */}
              <div className="grid grid-cols-2 divide-x divide-border">
                <div className="px-3 py-2 flex flex-col gap-0.5">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <Truck size={12} className="text-[#6c1cd1] shrink-0" />
                    <span className="text-[11px] font-bold text-foreground">Envío a Lima:</span>
                    <span className="text-[9px] font-black text-white bg-emerald-500 px-1.5 py-0.5 rounded">Disponible</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground pl-4">Recíbelo mañana ({fmt(tomorrow)})</p>
                </div>
                <div className="px-3 py-2 flex flex-col gap-0.5">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <Truck size={12} className="text-[#6c1cd1] shrink-0" />
                    <span className="text-[11px] font-bold text-foreground">Envío a Provincias:</span>
                    <span className="text-[9px] font-black text-white bg-emerald-500 px-1.5 py-0.5 rounded">Disponible</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground pl-4">Llega entre el: {fmt(plus2)} - {fmt(plus4)}</p>
                </div>
              </div>
            </div>

            {/* Quantity + buttons */}
            <div className="flex flex-col gap-3 border-t border-border pt-3">
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-foreground">Cantidad</span>
                <div className="flex items-center border-2 border-border rounded-lg overflow-hidden">
                  <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-3 py-2 hover:bg-secondary transition-colors text-foreground font-black">
                    <Minus size={13} />
                  </button>
                  <span className="px-4 text-sm font-black text-foreground border-x border-border">{qty}</span>
                  <button onClick={() => setQty((q) => q + 1)} className="px-3 py-2 hover:bg-secondary transition-colors text-foreground font-black">
                    <Plus size={13} />
                  </button>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  className={`flex-1 flex items-center justify-center gap-2 text-white text-sm font-black py-3 rounded-xl transition-all active:scale-[0.98] ${addedFeedback ? "bg-emerald-600" : "bg-primary hover:bg-blue-700"}`}
                  style={{ boxShadow: "0 4px 14px rgba(0,85,255,0.25)" }}
                >
                  {addedFeedback ? <><Shield size={15} /> ¡Agregado!</> : <><ShoppingCart size={15} /> Añadir al carro</>}
                </button>
                <button
                  onClick={() => setWished((w) => !w)}
                  className={`flex items-center gap-1.5 text-sm font-bold px-4 py-3 rounded-xl border-2 transition-all ${wished ? "border-[#ff4300] text-[#ff4300] bg-red-50" : "border-border text-foreground hover:border-[#ff4300] hover:text-[#ff4300]"}`}
                >
                  <Heart size={15} className={wished ? "fill-[#ff4300]" : ""} />
                  Agregar a los favoritos
                </button>
              </div>
            </div>

            {/* Payment methods */}
            <div className="border-t border-border pt-3">
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-wider mb-2">Métodos de pago aceptados</p>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { label: "VISA", bg: "bg-white border-border", text: "text-[#1a1f71] italic" },
                  { label: "AMEX", bg: "bg-[#2671b9] border-[#2671b9]", text: "text-white tracking-widest" },
                  { label: "DINERS", bg: "bg-white border-border", text: "text-[#004a97]" },
                  { label: "BCP", bg: "bg-[#003da5] border-[#003da5]", text: "text-white" },
                  { label: "YAPE", bg: "bg-[#6c1cd1] border-[#6c1cd1]", text: "text-white" },
                  { label: "PLIN", bg: "bg-[#00b1d2] border-[#00b1d2]", text: "text-white" },
                ].map(({ label, bg, text }) => (
                  <div key={label} className={`h-6 px-2 border rounded flex items-center ${bg}`}>
                    <span className={`text-[9px] font-black ${text}`}>{label}</span>
                  </div>
                ))}
                <div className="h-6 px-2 bg-white border border-border rounded flex items-center gap-0.5">
                  <div className="w-3.5 h-3.5 rounded-full bg-[#eb001b]" />
                  <div className="w-3.5 h-3.5 rounded-full bg-[#f79e1b] -ml-1.5" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs — full width */}
        <div className="bg-white rounded-2xl border border-border overflow-hidden mb-5">
          <div className="flex border-b border-border">
            {(["desc", "specs", "reviews"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-8 py-4 text-sm font-bold transition-colors relative whitespace-nowrap ${activeTab === tab ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
              >
                {tab === "desc" ? "Descripción" : tab === "specs" ? "Especificaciones" : "Reseñas"}
                {activeTab === tab && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t" />}
              </button>
            ))}
          </div>
          <div className="p-6">
            {activeTab === "desc" && (
              <div className="max-w-4xl text-sm text-muted-foreground leading-relaxed">
                <p className="font-bold text-foreground text-base mb-3">{product.name}</p>
                <p className="mb-3">Producto original con garantía oficial de fábrica. Ideal para uso profesional y personal. Cuenta con las últimas tecnologías para garantizar el mejor rendimiento y durabilidad.</p>
                <p>En SEBASTPERU ofrecemos únicamente productos auténticos de las mejores marcas con factura y garantía oficial, respaldados por nuestro equipo de soporte técnico especializado en Lima y provincias.</p>
              </div>
            )}
            {activeTab === "specs" && (
              <div className="max-w-3xl">
                <table className="w-full text-sm border-collapse">
                  <tbody>
                    {SPECS.map((s, i) => (
                      <tr key={s.label} className={i % 2 === 0 ? "bg-[#f8f9fc]" : "bg-white"}>
                        <td className="py-2.5 px-4 font-bold text-foreground w-48 border-b border-border/50">{s.label}</td>
                        <td className="py-2.5 px-4 text-muted-foreground border-b border-border/50">{s.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {activeTab === "reviews" && (
              <div className="max-w-3xl flex flex-col gap-5">
                <div className="flex items-center gap-8">
                  <div className="text-center">
                    <p className="text-5xl font-black text-foreground" style={{ fontFamily: "Nunito Sans, sans-serif" }}>{product.rating}</p>
                    <StarRating rating={product.rating} />
                    <p className="text-xs text-muted-foreground mt-1">{product.reviews.toLocaleString()} reseñas</p>
                  </div>
                  <div className="flex-1 flex flex-col gap-1.5">
                    {[5,4,3,2,1].map((r) => (
                      <div key={r} className="flex items-center gap-2 text-xs">
                        <span className="text-muted-foreground w-2">{r}</span>
                        <Star size={11} className="fill-amber-400 text-amber-400 shrink-0" />
                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-amber-400 rounded-full" style={{ width: r === 5 ? "72%" : r === 4 ? "18%" : r === 3 ? "7%" : "2%" }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  {[
                    { name: "Carlos M.", rating: 5, text: "Excelente producto, llegó en perfecto estado y muy rápido. Totalmente recomendado.", date: "hace 3 días" },
                    { name: "María G.", rating: 5, text: "Muy buena calidad, exactamente como se describe. El envío fue muy rápido.", date: "hace 1 semana" },
                    { name: "Juan P.", rating: 4, text: "Buen producto, cumple con lo especificado. El embalaje estaba en perfecto estado.", date: "hace 2 semanas" },
                  ].map((rev) => (
                    <div key={rev.name} className="border border-border rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black text-sm">{rev.name[0]}</div>
                          <div>
                            <p className="text-sm font-bold">{rev.name}</p>
                            <p className="text-[10px] text-muted-foreground">{rev.date}</p>
                          </div>
                        </div>
                        <StarRating rating={rev.rating} />
                      </div>
                      <p className="text-sm text-muted-foreground">{rev.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Podría interesarte */}
        {related.length > 0 && (
          <div className="bg-white rounded-2xl border border-border p-5">
            <h2 className="text-base font-black text-foreground mb-4" style={{ fontFamily: "Nunito Sans, sans-serif" }}>
              Podría interesarte
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {related.map((p) => {
                const d = p.originalPrice ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100) : null;
                return (
                  <div
                    key={p.id}
                    onClick={() => onGoProduct(p.id)}
                    className="group bg-white border border-border rounded-xl overflow-hidden flex flex-col hover:shadow-md hover:border-primary/30 hover:-translate-y-0.5 transition-all cursor-pointer"
                  >
                    <div className="relative overflow-hidden bg-white" style={{ height: 180 }}>
                      <img src={productImgSrc} alt={p.name} className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300" />
                      {d && <div className="absolute top-2 left-2 bg-[#ff4300] text-white text-[10px] font-black px-1.5 py-0.5 rounded">-{d}%</div>}
                    </div>
                    <div className="p-3 flex flex-col gap-1 flex-1">
                      <p className="text-[10px] font-black text-primary uppercase tracking-wide">{p.brand}</p>
                      <p className="text-xs font-bold leading-snug line-clamp-3" style={{ fontFamily: "Nunito Sans, sans-serif" }}>{p.name}</p>
                      <div className="mt-auto pt-2">
                        <p className="text-sm font-black text-foreground">{formatPrice(p.price)}</p>
                        <button
                          onClick={(e) => { e.stopPropagation(); onAddToCart(p); }}
                          className="w-full mt-1.5 bg-primary text-white text-sm font-bold py-2 rounded-lg flex items-center justify-center gap-1.5 hover:bg-blue-700 transition-colors"
                        >
                          <ShoppingCart size={13} /> Agregar al carrito
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Category Info Data ───────────────────────────────────────────────────────

const CATEGORY_INFO: Record<string, {
  title: string;
  description: string;
  bullets: string[];
  image: string;
  bgColor: string;
}> = {
  laptops: {
    title: "Laptops para trabajo, estudio y gaming",
    description: "Encuentra la laptop ideal para cada necesidad. En SEBASTPERU contamos con los mejores modelos de HP, Lenovo, Dell, Asus y más marcas líderes con garantía oficial. Procesadores Intel Core de última generación y AMD Ryzen para máximo rendimiento.",
    bullets: ["Garantía oficial de fábrica 12 meses", "Procesadores Intel Core i5, i7 y AMD Ryzen 5, 7", "Memoria RAM desde 8 GB hasta 32 GB", "Almacenamiento SSD NVMe de alta velocidad", "Envío a todo el Perú en 24-48 horas"],
    image: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&h=500&fit=crop&auto=format",
    bgColor: "#eef3ff",
  },
  impresoras: {
    title: "Impresoras para el hogar y la oficina",
    description: "Soluciones de impresión para todo tipo de necesidades. Desde impresoras de tinta para el hogar hasta equipos láser de alto rendimiento para oficinas. Contamos con impresoras multifunción, de tanque de tinta, láser y matriciales de las mejores marcas.",
    bullets: ["Impresoras inkjet, láser y de tanque de tinta", "Multifunción: imprime, escanea y copia", "Conectividad Wi-Fi y USB", "Compatible con tintas y tóner originales", "Ideal para hogar, PYME y grandes empresas"],
    image: "https://images.unsplash.com/photo-1503694978374-8a2fa686963a?w=800&h=500&fit=crop&auto=format",
    bgColor: "#f0f7ff",
  },
  toner: {
    title: "Tóner original para impresoras láser",
    description: "Tóner original y compatible para todas las marcas y modelos de impresoras láser. Garantizamos la mejor calidad de impresión con el rendimiento óptimo para tu equipo. Disponemos de stock permanente de HP, Samsung, Brother, Canon y más.",
    bullets: ["Tóner original y compatible certificado", "HP, Samsung, Brother, Canon, Kyocera y más", "Rendimiento garantizado por páginas", "Stock permanente disponible", "Entrega express en Lima 24h"],
    image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800&h=500&fit=crop&auto=format",
    bgColor: "#f5f5f5",
  },
  tintas: {
    title: "Tintas para impresoras de inyección",
    description: "Cartuchos de tinta e botellas para impresoras de inyección de las principales marcas. Tintas originales HP, Epson, Canon y Brother para obtener impresiones de alta calidad con los colores más vibrantes y mayor durabilidad.",
    bullets: ["Cartuchos originales y botellas de tinta", "HP, Epson, Canon y Brother", "Alta definición en color y negro", "Compatible con impresoras EcoTank y DeskJet", "Precio justo con garantía de calidad"],
    image: "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=800&h=500&fit=crop&auto=format",
    bgColor: "#fff8f0",
  },
};

// ─── Category Page ────────────────────────────────────────────────────────────

type SortOption = "destacados" | "precio-asc" | "precio-desc" | "rating";

function CategoryPage({
  category,
  label,
  onAddToCart,
  onGoHome,
}: {
  category: string;
  label: string;
  onAddToCart: (p: (typeof PRODUCTS)[0]) => void;
  onGoHome: () => void;
  onGoProduct?: (id: number) => void;
}) {
  const all = PRODUCTS.filter((p) => p.category === category);

  const brands = [...new Set(all.map((p) => p.brand))];
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 999999]);
  const [sortBy, setSortBy] = useState<SortOption>("destacados");
  const [searchLocal, setSearchLocal] = useState("");

  const minPrice = Math.min(...all.map((p) => p.price));
  const maxPrice = Math.max(...all.map((p) => p.price));

  function toggleBrand(b: string) {
    setSelectedBrands((prev) => prev.includes(b) ? prev.filter((x) => x !== b) : [...prev, b]);
  }

  function clearFilters() {
    setSelectedBrands([]);
    setPriceRange([minPrice, maxPrice]);
    setSearchLocal("");
    setSortBy("destacados");
  }

  let filtered = all.filter((p) => {
    const matchBrand = selectedBrands.length === 0 || selectedBrands.includes(p.brand);
    const matchPrice = p.price >= priceRange[0] && p.price <= priceRange[1];
    const matchSearch = !searchLocal || p.name.toLowerCase().includes(searchLocal.toLowerCase());
    return matchBrand && matchPrice && matchSearch;
  });

  if (sortBy === "precio-asc") filtered = [...filtered].sort((a, b) => a.price - b.price);
  if (sortBy === "precio-desc") filtered = [...filtered].sort((a, b) => b.price - a.price);
  if (sortBy === "rating") filtered = [...filtered].sort((a, b) => b.rating - a.rating);

  const hasFilters = selectedBrands.length > 0 || priceRange[0] > minPrice || priceRange[1] < maxPrice || searchLocal;

  return (
    <div className="max-w-7xl mx-auto px-6 py-2">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-5">
        <button onClick={onGoHome} className="hover:text-primary transition-colors">Inicio</button>
        <ChevronRight size={12} />
        <span className="font-semibold text-foreground">{label}</span>
      </div>

      <div className="flex gap-6">
        {/* Sidebar filters */}
        <aside className="w-56 shrink-0 hidden lg:block">
          <div className="bg-white rounded-xl border border-border overflow-hidden sticky top-[130px]">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <h3 className="font-black text-sm" style={{ fontFamily: "Nunito Sans, sans-serif" }}>Filtros</h3>
              {hasFilters && (
                <button onClick={clearFilters} className="text-[11px] text-primary hover:underline font-semibold">
                  Limpiar
                </button>
              )}
            </div>

            {/* Search */}
            <div className="px-4 py-3 border-b border-border">
              <p className="text-[11px] font-black text-foreground uppercase tracking-wider mb-2">Buscar</p>
              <div className="relative">
                <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={searchLocal}
                  onChange={(e) => setSearchLocal(e.target.value)}
                  placeholder="Buscar en esta categoría…"
                  className="w-full border border-border rounded-lg pl-7 pr-2 py-1.5 text-xs focus:outline-none focus:border-primary transition-colors"
                />
              </div>
            </div>

            {/* Brand filter */}
            <div className="px-4 py-3 border-b border-border">
              <p className="text-[11px] font-black text-foreground uppercase tracking-wider mb-2.5">Marca</p>
              <div className="flex flex-col gap-2">
                {brands.map((b) => (
                  <label key={b} className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(b)}
                      onChange={() => toggleBrand(b)}
                      className="w-3.5 h-3.5 accent-primary rounded"
                    />
                    <span className="text-xs text-foreground/80 group-hover:text-primary transition-colors">{b}</span>
                    <span className="ml-auto text-[10px] text-muted-foreground bg-muted px-1.5 rounded-full">
                      {all.filter((p) => p.brand === b).length}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price filter */}
            <div className="px-4 py-3 border-b border-border">
              <p className="text-[11px] font-black text-foreground uppercase tracking-wider mb-2.5">Precio</p>
              <div className="flex gap-2 mb-2">
                <div className="flex-1">
                  <p className="text-[9px] text-muted-foreground mb-1">Mínimo</p>
                  <input
                    type="number"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                    className="w-full border border-border rounded px-2 py-1 text-xs focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-[9px] text-muted-foreground mb-1">Máximo</p>
                  <input
                    type="number"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                    className="w-full border border-border rounded px-2 py-1 text-xs focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
              <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
                <span>{formatPrice(minPrice)}</span>
                <span>{formatPrice(maxPrice)}</span>
              </div>
            </div>

            {/* Rating filter */}
            <div className="px-4 py-3">
              <p className="text-[11px] font-black text-foreground uppercase tracking-wider mb-2.5">Valoración</p>
              {[5, 4, 3].map((r) => (
                <label key={r} className="flex items-center gap-2 cursor-pointer group mb-1.5">
                  <input type="checkbox" className="w-3.5 h-3.5 accent-primary rounded" />
                  <div className="flex items-center gap-0.5">
                    {[1,2,3,4,5].map((i) => (
                      <Star key={i} size={10} className={i <= r ? "fill-amber-400 text-amber-400" : "fill-muted text-muted"} />
                    ))}
                    <span className="text-[11px] text-muted-foreground ml-1">y más</span>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center justify-between mb-4 bg-white rounded-xl border border-border px-4 py-3">
            <div>
              <h1 className="text-lg font-black text-foreground" style={{ fontFamily: "Nunito Sans, sans-serif" }}>{label}</h1>
              <p className="text-xs text-muted-foreground">{filtered.length} producto{filtered.length !== 1 ? "s" : ""} encontrado{filtered.length !== 1 ? "s" : ""}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground hidden sm:block">Ordenar por:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="border border-border rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-primary bg-white font-medium"
              >
                <option value="destacados">Destacados</option>
                <option value="precio-asc">Precio: Menor a Mayor</option>
                <option value="precio-desc">Precio: Mayor a Menor</option>
                <option value="rating">Mejor valorados</option>
              </select>
            </div>
          </div>

          {/* Active filters */}
          {hasFilters && (
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedBrands.map((b) => (
                <span key={b} className="flex items-center gap-1 bg-primary/10 text-primary text-xs font-semibold px-2.5 py-1 rounded-full border border-primary/20">
                  {b}
                  <button onClick={() => toggleBrand(b)} className="hover:text-red-500 transition-colors"><X size={11} /></button>
                </span>
              ))}
              {searchLocal && (
                <span className="flex items-center gap-1 bg-primary/10 text-primary text-xs font-semibold px-2.5 py-1 rounded-full border border-primary/20">
                  "{searchLocal}"
                  <button onClick={() => setSearchLocal("")} className="hover:text-red-500 transition-colors"><X size={11} /></button>
                </span>
              )}
            </div>
          )}

          {/* Grid */}
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-muted-foreground bg-white rounded-xl border border-border">
              <Search size={36} strokeWidth={1} />
              <p className="font-semibold text-sm">No encontramos productos con esos filtros</p>
              <button onClick={clearFilters} className="text-primary text-sm font-semibold hover:underline">Limpiar filtros</button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-2">
              {filtered.map((p) => {
                const discount = p.originalPrice ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100) : null;
                return (
                  <div key={p.id} onClick={() => onGoProduct?.(p.id)} className="group bg-white border-l-4 border-l-transparent border border-border rounded-xl overflow-hidden flex flex-col hover:shadow-xl hover:border-l-primary hover:-translate-y-0.5 transition-all duration-200 cursor-pointer">
                    <div className="relative bg-white flex items-center justify-center overflow-hidden" style={{ height: 180 }}>
                      <img src={productImgSrc} alt={p.name} className="w-full h-full object-contain p-2 transition-transform duration-300 group-hover:scale-105" />
                      {discount && (
                        <div className="absolute top-2 left-2 bg-[#ff4300] text-white text-[10px] font-black px-1.5 py-0.5 rounded">-{discount}%</div>
                      )}
                      {!discount && p.badge && (
                        <div className={`absolute top-2 left-2 text-[10px] font-black px-1.5 py-0.5 rounded ${BADGE_STYLES[p.badge] ?? ""}`}>{p.badge}</div>
                      )}
                      <button className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 flex items-center justify-center shadow-sm hover:bg-white transition-colors">
                        <Heart size={13} className="text-muted-foreground" />
                      </button>
                    </div>
                    <div className="p-3 flex flex-col gap-1.5 flex-1">
                      <p className="text-[10px] font-black text-primary uppercase tracking-wider">{p.brand}</p>
                      <p className="text-[13px] font-bold leading-[1.4] text-foreground" style={{ fontFamily: "Nunito Sans, sans-serif" }}>{p.name}</p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <StarRating rating={p.rating} />
                        <span className="text-[10px] text-muted-foreground">({p.reviews.toLocaleString()})</span>
                      </div>
                      <div className="mt-auto pt-1">
                        <div className="flex items-baseline gap-2 mb-1">
                          <span className="text-lg font-black text-foreground" style={{ fontFamily: "Nunito Sans, sans-serif" }}>{formatPrice(p.price)}</span>
                          {p.originalPrice && <span className="text-xs text-muted-foreground line-through">{formatPrice(p.originalPrice)}</span>}
                        </div>
                        <p className="text-[11px] text-muted-foreground mb-2">6 cuotas de <span className="font-bold text-primary">{formatPrice(Math.round(p.price / 6))}</span></p>
                        <button
                          onClick={(e) => { e.stopPropagation(); onAddToCart(p); }}
                          className="w-full bg-primary text-white text-sm font-bold py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 active:scale-95 transition-all"
                        >
                          <ShoppingCart size={14} /> Agregar al carrito
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Category description section */}
      {CATEGORY_INFO[category] && (() => {
        const info = CATEGORY_INFO[category];
        return (
          <div className="mt-8 rounded-2xl overflow-hidden border border-border" style={{ background: info.bgColor }}>
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Text */}
              <div className="px-8 py-10 flex flex-col justify-center">
                <span className="text-[11px] font-black text-primary uppercase tracking-widest mb-2">Sobre esta categoría</span>
                <h2 className="text-2xl font-black text-foreground mb-3 leading-tight" style={{ fontFamily: "Nunito Sans, sans-serif" }}>
                  {info.title}
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed mb-5">{info.description}</p>
                <ul className="flex flex-col gap-2">
                  {info.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2.5 text-sm text-foreground/80">
                      <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                      </div>
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
              {/* Image */}
              <div className="relative hidden lg:block" style={{ minHeight: 280 }}>
                <img
                  src={info.image}
                  alt={info.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[var(--bg)] to-transparent" style={{ ["--bg" as string]: info.bgColor }} />
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

// ─── Cart Page ────────────────────────────────────────────────────────────────

function CartPage({
  cart,
  onUpdateQty,
  onRemove,
  onGoHome,
  onGoCheckout,
  onGoProduct,
}: {
  cart: CartItem[];
  onUpdateQty: (id: number, qty: number) => void;
  onRemove: (id: number) => void;
  onGoHome: () => void;
  onGoCheckout: () => void;
  onGoProduct: (id: number) => void;
}) {
  const subtotal = cart.reduce((s, i) => s + i.product.price * i.qty, 0);
  const envio = subtotal >= 200 ? 0 : 15;
  const total = subtotal + envio;

  return (
    <div className="bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-6">
          <button onClick={onGoHome} className="hover:text-primary transition-colors">Inicio</button>
          <ChevronRight size={10} />
          <span className="text-foreground font-semibold">Mi carrito</span>
        </div>

        <h1 className="text-2xl font-black text-foreground mb-6" style={{ fontFamily: "Nunito Sans, sans-serif" }}>
          Mi carrito ({cart.reduce((s, i) => s + i.qty, 0)} productos)
        </h1>

        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-5 bg-white rounded-2xl border border-border">
            <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center">
              <ShoppingCart size={36} strokeWidth={1} className="text-muted-foreground" />
            </div>
            <div className="text-center">
              <p className="text-lg font-black text-foreground mb-1">Tu carrito está vacío</p>
              <p className="text-sm text-muted-foreground">Agrega productos para comenzar tu compra</p>
            </div>
            <button onClick={onGoHome} className="bg-primary text-white font-bold px-8 py-3 rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2">
              <ArrowRight size={16} className="rotate-180" /> Seguir comprando
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 items-start">

            {/* ── Products list ── */}
            <div className="flex flex-col gap-4">
              {/* Free shipping bar */}
              {subtotal < 200 && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-center gap-3">
                  <Truck size={18} className="text-amber-600 shrink-0" />
                  <div className="flex-1">
                    <p className="text-xs font-bold text-amber-800">
                      Te faltan <span className="text-amber-600">{formatPrice(200 - subtotal)}</span> para envío gratis
                    </p>
                    <div className="w-full h-1.5 bg-amber-200 rounded-full mt-1.5 overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full transition-all" style={{ width: `${Math.min((subtotal / 200) * 100, 100)}%` }} />
                    </div>
                  </div>
                </div>
              )}
              {subtotal >= 200 && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 flex items-center gap-2">
                  <Truck size={16} className="text-emerald-600" />
                  <p className="text-sm font-bold text-emerald-700">¡Tienes envío gratis!</p>
                </div>
              )}

              {/* Product cards */}
              <div className="bg-white rounded-2xl border border-border overflow-hidden">
                {cart.map(({ product, qty }, idx) => {
                  const discount = product.originalPrice
                    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                    : null;
                  return (
                    <div key={product.id} className={`flex gap-4 p-5 ${idx < cart.length - 1 ? "border-b border-border" : ""}`}>
                      {/* Image */}
                      <div
                        onClick={() => onGoProduct(product.id)}
                        className="w-24 h-24 rounded-xl overflow-hidden bg-secondary shrink-0 cursor-pointer hover:opacity-90 transition-opacity"
                      >
                        <img src={productImgSrc} alt={product.name} className="w-full h-full object-contain p-2" />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-black text-primary uppercase tracking-wider mb-0.5">{product.brand}</p>
                        <button
                          onClick={() => onGoProduct(product.id)}
                          className="text-sm font-bold text-foreground leading-snug text-left hover:text-primary transition-colors line-clamp-2"
                          style={{ fontFamily: "Nunito Sans, sans-serif" }}
                        >
                          {product.name}
                        </button>

                        <div className="flex items-center gap-2 mt-1">
                          {product.badge && (
                            <span className={`text-[10px] font-black px-1.5 py-0.5 rounded ${BADGE_STYLES[product.badge] ?? ""}`}>{product.badge}</span>
                          )}
                          {discount && (
                            <span className="text-[10px] font-black bg-[#ff4300] text-white px-1.5 py-0.5 rounded">-{discount}%</span>
                          )}
                          <span className="text-[10px] text-emerald-600 font-semibold">En stock</span>
                        </div>

                        <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
                          {/* Qty control */}
                          <div className="flex items-center border-2 border-border rounded-xl overflow-hidden">
                            <button
                              onClick={() => onUpdateQty(product.id, qty - 1)}
                              className="px-3 py-1.5 hover:bg-secondary transition-colors text-muted-foreground hover:text-primary"
                            >
                              <Minus size={13} />
                            </button>
                            <span className="px-3 py-1.5 text-sm font-black min-w-[32px] text-center">{qty}</span>
                            <button
                              onClick={() => onUpdateQty(product.id, qty + 1)}
                              className="px-3 py-1.5 hover:bg-secondary transition-colors text-muted-foreground hover:text-primary"
                            >
                              <Plus size={13} />
                            </button>
                          </div>

                          {/* Price + remove */}
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className="text-lg font-black text-foreground" style={{ fontFamily: "Nunito Sans, sans-serif" }}>
                                {formatPrice(product.price * qty)}
                              </p>
                              {qty > 1 && (
                                <p className="text-[10px] text-muted-foreground">{formatPrice(product.price)} c/u</p>
                              )}
                            </div>
                            <button
                              onClick={() => onRemove(product.id)}
                              className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-[#ff4300] hover:bg-red-50 transition-colors"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Continue shopping */}
              <button onClick={onGoHome} className="flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
                <ChevronLeft size={15} /> Seguir comprando
              </button>
            </div>

            {/* ── Order summary ── */}
            <div className="sticky top-24 flex flex-col gap-4">
              <div className="bg-white rounded-2xl border border-border overflow-hidden">
                <div className="px-5 py-4 border-b border-border">
                  <h2 className="text-base font-black text-foreground" style={{ fontFamily: "Nunito Sans, sans-serif" }}>Resumen del pedido</h2>
                </div>
                <div className="px-5 py-4 flex flex-col gap-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal ({cart.reduce((s, i) => s + i.qty, 0)} productos)</span>
                    <span className="font-semibold">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Envío</span>
                    {envio === 0
                      ? <span className="font-semibold text-emerald-600">Gratis</span>
                      : <span className="font-semibold">{formatPrice(envio)}</span>
                    }
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">IGV (18%)</span>
                    <span className="font-semibold text-muted-foreground">Incluido</span>
                  </div>
                  <div className="border-t border-border pt-3 flex justify-between">
                    <span className="font-black text-foreground">Total</span>
                    <span className="text-xl font-black text-foreground" style={{ fontFamily: "Nunito Sans, sans-serif" }}>{formatPrice(total)}</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    6 cuotas de <span className="font-black text-primary">{formatPrice(Math.round(total / 6))}</span> sin intereses
                  </p>
                </div>
                <div className="px-5 pb-5 flex flex-col gap-2">
                  <button
                    onClick={onGoCheckout}
                    className="w-full bg-primary text-white font-black py-3.5 rounded-xl flex items-center justify-center gap-2 hover:bg-blue-700 transition-all active:scale-[0.98]"
                    style={{ boxShadow: "0 4px 16px rgba(0,85,255,0.30)" }}
                  >
                    <ShoppingCart size={16} /> Proceder al pago
                  </button>
                  <button onClick={onGoHome} className="w-full border-2 border-border text-sm font-semibold py-2.5 rounded-xl hover:border-primary hover:text-primary transition-colors">
                    Seguir comprando
                  </button>
                </div>
              </div>

              {/* Trust */}
              <div className="bg-white rounded-2xl border border-border p-4 flex flex-col gap-3">
                {[
                  { icon: Shield, text: "Compra 100% segura", sub: "Datos encriptados SSL" },
                  { icon: Truck, text: "Envío a todo el Perú", sub: "Lima 24h · Provincias 3-7 días" },
                  { icon: Zap, text: "Múltiples medios de pago", sub: "Tarjeta, Yape, Plin, transferencia" },
                ].map(({ icon: Icon, text, sub }) => (
                  <div key={text} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Icon size={14} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-foreground">{text}</p>
                      <p className="text-[10px] text-muted-foreground">{sub}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Cards */}
              <div className="bg-white rounded-2xl border border-border p-4">
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-wider mb-2.5">Aceptamos</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    <div key="visa" className="h-6 px-2 border border-border rounded flex items-center"><span className="text-[#1a1f71] text-[10px] font-black italic">VISA</span></div>,
                    <div key="mc" className="h-6 px-2 border border-border rounded flex items-center gap-0.5"><div className="w-3 h-3 rounded-full bg-[#eb001b]" /><div className="w-3 h-3 rounded-full bg-[#f79e1b] -ml-1.5" /></div>,
                    <div key="amex" className="h-6 px-2 bg-[#2671b9] rounded flex items-center"><span className="text-white text-[9px] font-black">AMEX</span></div>,
                    <div key="bcp" className="h-6 px-2 bg-[#003da5] rounded flex items-center"><span className="text-white text-[9px] font-black">BCP</span></div>,
                    <div key="yape" className="h-6 px-2 bg-[#6c1cd1] rounded flex items-center"><span className="text-white text-[9px] font-black">YAPE</span></div>,
                    <div key="plin" className="h-6 px-2 bg-[#00b1d2] rounded flex items-center"><span className="text-white text-[9px] font-black">PLIN</span></div>,
                  ]}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Checkout Page ────────────────────────────────────────────────────────────

const DEPARTAMENTOS = ["Lima","Arequipa","La Libertad","Piura","Cusco","Junín","Lambayeque","Áncash","Loreto","Callao"];
const PROVINCIAS: Record<string, string[]> = {
  "Lima": ["Lima","Barranca","Cajatambo","Cañete","Huaral","Huarochirí","Huaura","Oyón","Yauyos"],
  "Arequipa": ["Arequipa","Camaná","Caravelí","Castilla","Caylloma","Condesuyos","Islay","La Unión"],
};
const DISTRITOS: Record<string, string[]> = {
  "Lima": ["Miraflores","San Isidro","Surco","La Molina","San Borja","Jesús María","Lince","Magdalena","Pueblo Libre"],
  "Arequipa": ["Arequipa","Cayma","Cerro Colorado","Characato","Jacobo Hunter","José Luis Bustamante","Mariano Melgar"],
};

function CheckoutPage({ cart, onGoHome }: {
  cart: CartItem[];
  onGoHome: () => void;
}) {
  const [email, setEmail] = useState("");
  const [createAccount, setCreateAccount] = useState(false);
  const [deliveryType, setDeliveryType] = useState<"domicilio" | "tienda">("domicilio");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [dni, setDni] = useState("");
  const [direccion, setDireccion] = useState("");
  const [referencia, setReferencia] = useState("");
  const [departamento, setDepartamento] = useState("");
  const [provincia, setProvincia] = useState("");
  const [distrito, setDistrito] = useState("");
  const [telefono, setTelefono] = useState("");
  const [receptor, setReceptor] = useState<"yo" | "otra">("yo");
  const [comprobante, setComprobante] = useState<"boleta" | "factura">("boleta");
  const [payMethod, setPayMethod] = useState<"tarjeta" | "pagoefectivo" | "transferencia">("tarjeta");
  const [cardNum, setCardNum] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExp, setCardExp] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [acceptReview, setAcceptReview] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const subtotal = cart.reduce((s, i) => s + i.product.price * i.qty, 0);

  const input = "w-full border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all bg-white placeholder-muted-foreground";
  const label = "block text-xs font-bold text-foreground mb-1.5";

  if (submitted) return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-6 px-6">
      <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
        <Shield size={28} className="text-emerald-600" />
      </div>
      <div className="text-center">
        <h1 className="text-2xl font-black text-foreground mb-2" style={{ fontFamily: "Nunito Sans, sans-serif" }}>¡Pedido realizado!</h1>
        <p className="text-muted-foreground text-sm">Te enviaremos la confirmación a <strong>{email}</strong></p>
      </div>
      <button onClick={onGoHome} className="bg-primary text-white font-bold px-8 py-3 rounded-xl hover:bg-blue-700 transition-colors">
        Volver al inicio
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Checkout header */}
      <div className="bg-white border-b border-border py-4 px-6 flex items-center justify-between">
        <button onClick={onGoHome} className="flex items-center shrink-0">
          <img src={logoSrc} alt="SEBASTPERU" className="h-9 w-auto object-contain" />
        </button>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Shield size={13} className="text-emerald-600" />
          Pago 100% seguro y encriptado
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8 items-start">

        {/* ── Left: Form ── */}
        <div className="flex flex-col gap-6">

          {/* Login banner */}
          <div className="bg-amber-500 text-white rounded-xl px-5 py-3.5 flex items-center gap-3">
            <div className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center shrink-0">
              <span className="text-xs font-black">!</span>
            </div>
            <p className="text-sm">¿Ya eres cliente? <button className="underline font-bold">Haz clic aquí para acceder</button></p>
          </div>

          {/* Contacto */}
          <div className="bg-white rounded-2xl border border-border p-6">
            <h2 className="text-lg font-black text-foreground mb-4" style={{ fontFamily: "Nunito Sans, sans-serif" }}>Contacto</h2>
            <div className="flex flex-col gap-3">
              <div>
                <label className={label}>Correo electrónico *</label>
                <input value={email} onChange={e => setEmail(e.target.value)} placeholder="correo@ejemplo.com" type="email" className={input} />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={createAccount} onChange={e => setCreateAccount(e.target.checked)} className="w-4 h-4 accent-primary" />
                <span className="text-sm text-foreground">¿Crear una cuenta?</span>
              </label>
            </div>
          </div>

          {/* Entrega */}
          <div className="bg-white rounded-2xl border border-border p-6">
            <h2 className="text-lg font-black text-foreground mb-4" style={{ fontFamily: "Nunito Sans, sans-serif" }}>Entrega</h2>
            <div className="flex flex-col gap-4">
              {/* Toggle envío / retiro */}
              <div className="flex rounded-xl border border-border overflow-hidden">
                {(["domicilio","tienda"] as const).map((t) => (
                  <button key={t} onClick={() => setDeliveryType(t)}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-bold transition-colors ${deliveryType === t ? "bg-primary text-white" : "bg-white text-muted-foreground hover:bg-secondary"}`}>
                    {t === "domicilio" ? <><Truck size={14} /> Envío a domicilio</> : <><MapPin size={14} /> Retiro en tienda</>}
                  </button>
                ))}
              </div>

              {deliveryType === "domicilio" && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={label}>Nombre *</label>
                      <input value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Nombre" className={input} />
                    </div>
                    <div>
                      <label className={label}>Apellido *</label>
                      <input value={apellido} onChange={e => setApellido(e.target.value)} placeholder="Apellido" className={input} />
                    </div>
                  </div>
                  <div>
                    <label className={label}>DNI o CE *</label>
                    <input value={dni} onChange={e => setDni(e.target.value)} placeholder="DNI o CE" maxLength={8} className={input} />
                  </div>
                  <div>
                    <label className={label}>Dirección de entrega *</label>
                    <input value={direccion} onChange={e => setDireccion(e.target.value)} placeholder="Av. ejemplo 123, Dpto 4B" className={input} />
                  </div>
                  <div>
                    <label className={label}>Referencia (opcional)</label>
                    <input value={referencia} onChange={e => setReferencia(e.target.value)} placeholder="Cerca al parque, frente al banco..." className={input} />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className={label}>Departamento *</label>
                      <select value={departamento} onChange={e => { setDepartamento(e.target.value); setProvincia(""); setDistrito(""); }} className={input}>
                        <option value="">Departamento</option>
                        {DEPARTAMENTOS.map(d => <option key={d}>{d}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className={label}>Provincia *</label>
                      <select value={provincia} onChange={e => { setProvincia(e.target.value); setDistrito(""); }} className={input}>
                        <option value="">Provincia</option>
                        {(PROVINCIAS[departamento] ?? []).map(p => <option key={p}>{p}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className={label}>Distrito *</label>
                      <select value={distrito} onChange={e => setDistrito(e.target.value)} className={input}>
                        <option value="">Distrito</option>
                        {(DISTRITOS[departamento] ?? []).map(d => <option key={d}>{d}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className={label}>Teléfono *</label>
                    <input value={telefono} onChange={e => setTelefono(e.target.value)} placeholder="987 654 321" type="tel" className={input} />
                  </div>
                  {/* Quién recibe */}
                  <div>
                    <p className="text-sm font-bold text-foreground mb-2">¿Quién recibirá el pedido?</p>
                    <div className="flex rounded-xl border border-border overflow-hidden">
                      {(["yo","otra"] as const).map((r) => (
                        <button key={r} onClick={() => setReceptor(r)}
                          className={`flex-1 py-3 text-sm font-bold transition-colors ${receptor === r ? "bg-primary text-white" : "bg-white text-muted-foreground hover:bg-secondary"}`}>
                          {r === "yo" ? "Yo" : "Otra persona"}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {deliveryType === "tienda" && (
                <div className="bg-blue-50 border border-primary/20 rounded-xl p-4 text-sm text-primary font-semibold flex items-center gap-2">
                  <MapPin size={16} /> Tienda: Av. Principal 123, Lima — Lunes a Sábado 9am–7pm
                </div>
              )}
            </div>
          </div>

          {/* Métodos de envío */}
          <div className="bg-white rounded-2xl border border-border p-6">
            <h2 className="text-lg font-black text-foreground mb-3" style={{ fontFamily: "Nunito Sans, sans-serif" }}>Métodos de envío</h2>
            {direccion ? (
              <div className="flex flex-col gap-2">
                {[
                  { id: "express", label: "Envío express Lima", desc: "Recíbelo hoy antes de las 2pm", price: "S/ 15" },
                  { id: "estandar", label: "Envío estándar", desc: "3-7 días hábiles a provincias", price: "S/ 10" },
                  { id: "gratis", label: "Envío gratis", desc: "Disponible en pedidos +S/ 200", price: "Gratis" },
                ].map((m) => (
                  <label key={m.id} className="flex items-center gap-3 border border-border rounded-xl px-4 py-3 cursor-pointer hover:border-primary/40 transition-colors">
                    <input type="radio" name="envio" defaultChecked={m.id === "gratis"} className="accent-primary" />
                    <div className="flex-1">
                      <p className="text-sm font-bold text-foreground">{m.label}</p>
                      <p className="text-xs text-muted-foreground">{m.desc}</p>
                    </div>
                    <span className={`text-sm font-black ${m.price === "Gratis" ? "text-emerald-600" : "text-foreground"}`}>{m.price}</span>
                  </label>
                ))}
              </div>
            ) : (
              <div className="bg-secondary rounded-xl px-4 py-3 text-sm text-muted-foreground">
                Ingresa tu dirección para ver las opciones de envío.
              </div>
            )}
          </div>

          {/* Pago */}
          <div className="bg-white rounded-2xl border border-border p-6">
            <h2 className="text-lg font-black text-foreground mb-1" style={{ fontFamily: "Nunito Sans, sans-serif" }}>Pago</h2>
            <p className="text-xs text-muted-foreground mb-4">Todas las transacciones son seguras y están encriptadas.</p>

            {/* Boleta / Factura */}
            <div className="flex rounded-xl border border-border overflow-hidden mb-5">
              {(["boleta","factura"] as const).map((c) => (
                <button key={c} onClick={() => setComprobante(c)}
                  className={`flex-1 py-3 text-sm font-bold capitalize transition-colors ${comprobante === c ? "bg-primary text-white" : "bg-white text-muted-foreground hover:bg-secondary"}`}>
                  {c}
                </button>
              ))}
            </div>

            {/* Payment methods */}
            <div className="flex flex-col gap-2">
              {/* Tarjeta */}
              <div className={`border-2 rounded-xl overflow-hidden transition-colors ${payMethod === "tarjeta" ? "border-primary" : "border-border"}`}>
                <button onClick={() => setPayMethod("tarjeta")}
                  className="w-full flex items-center gap-3 px-4 py-3.5">
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${payMethod === "tarjeta" ? "border-primary" : "border-muted-foreground"}`}>
                    {payMethod === "tarjeta" && <div className="w-2 h-2 rounded-full bg-primary" />}
                  </div>
                  <span className="text-sm font-bold flex-1 text-left">Tarjeta de débito o crédito</span>
                  <div className="flex gap-1.5 items-center">
                    <div className="bg-white border border-border rounded px-1.5 py-0.5"><span className="text-[#1a1f71] text-[10px] font-black italic">VISA</span></div>
                    <div className="flex"><div className="w-4 h-4 rounded-full bg-[#eb001b]" /><div className="w-4 h-4 rounded-full bg-[#f79e1b] -ml-2" /></div>
                    <div className="bg-[#2671b9] rounded px-1.5 py-0.5"><span className="text-white text-[9px] font-black">AMEX</span></div>
                  </div>
                </button>
                {payMethod === "tarjeta" && (
                  <div className="px-4 pb-4 flex flex-col gap-3 border-t border-border bg-[#f8f9ff]">
                    <div className="flex gap-2 pt-3">
                      {["VISA","MC","AMEX","DINERS"].map(c => (
                        <div key={c} className="h-6 px-2 bg-white border border-border rounded flex items-center text-[9px] font-black text-muted-foreground">{c}</div>
                      ))}
                    </div>
                    <div>
                      <label className={label}>Número de tarjeta *</label>
                      <input value={cardNum} onChange={e => setCardNum(e.target.value.replace(/\D/g,"").slice(0,16).replace(/(.{4})/g,"$1 ").trim())} placeholder="1234 1234 1234 1234" className={input} maxLength={19} />
                    </div>
                    <div>
                      <label className={label}>Nombre del titular *</label>
                      <input value={cardName} onChange={e => setCardName(e.target.value)} placeholder="Ej.: María López" className={input} />
                      <p className="text-xs text-primary mt-1">Complétalo como aparece en la tarjeta.</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className={label}>Vencimiento *</label>
                        <input value={cardExp} onChange={e => setCardExp(e.target.value)} placeholder="MM/AA" className={input} maxLength={5} />
                      </div>
                      <div>
                        <label className={label}>Código de seguridad *</label>
                        <div className="relative">
                          <input value={cardCvv} onChange={e => setCardCvv(e.target.value.replace(/\D/,"").slice(0,4))} placeholder="Ej.: 123" className={input} />
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full border border-border flex items-center justify-center cursor-help">
                            <span className="text-[10px] text-muted-foreground font-bold">?</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* PagoEfectivo */}
              <button onClick={() => setPayMethod("pagoefectivo")}
                className={`w-full flex items-center gap-3 px-4 py-3.5 border-2 rounded-xl transition-colors ${payMethod === "pagoefectivo" ? "border-primary" : "border-border"}`}>
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${payMethod === "pagoefectivo" ? "border-primary" : "border-muted-foreground"}`}>
                  {payMethod === "pagoefectivo" && <div className="w-2 h-2 rounded-full bg-primary" />}
                </div>
                <span className="text-sm font-bold flex-1 text-left">PagoEfectivo</span>
                <div className="w-8 h-8 rounded-lg bg-[#f5a623] flex items-center justify-center">
                  <span className="text-white text-[10px] font-black">PE</span>
                </div>
              </button>

              {/* Transferencia */}
              <button onClick={() => setPayMethod("transferencia")}
                className={`w-full flex items-center gap-3 px-4 py-3.5 border-2 rounded-xl transition-colors ${payMethod === "transferencia" ? "border-primary" : "border-border"}`}>
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${payMethod === "transferencia" ? "border-primary" : "border-muted-foreground"}`}>
                  {payMethod === "transferencia" && <div className="w-2 h-2 rounded-full bg-primary" />}
                </div>
                <span className="text-sm font-bold flex-1 text-left">Transferencia, depósito bancario</span>
              </button>
            </div>

            {payMethod === "transferencia" && (
              <div className="mt-3 bg-blue-50 border border-primary/20 rounded-xl p-4 text-xs text-foreground">
                <p className="font-bold mb-1">Datos bancarios:</p>
                <p>BCP — Cuenta Corriente: <strong>194-1234567-0-89</strong></p>
                <p>CCI: <strong>002-194-001234567089-10</strong></p>
                <p className="mt-1 text-muted-foreground">Envía el comprobante al WhatsApp: 925 552 042</p>
              </div>
            )}
          </div>

          {/* Términos y condiciones */}
          <div className="bg-white rounded-2xl border border-border p-6 flex flex-col gap-3">
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" checked={acceptReview} onChange={e => setAcceptReview(e.target.checked)} className="w-4 h-4 mt-0.5 accent-primary shrink-0" />
              <span className="text-xs text-muted-foreground">¿Te gustaría ser invitado a revisar tu pedido? Marca aquí para recibir un mensaje de CusRev con un formulario de revisión.</span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" checked={acceptTerms} onChange={e => setAcceptTerms(e.target.checked)} className="w-4 h-4 mt-0.5 accent-primary shrink-0" />
              <span className="text-xs text-muted-foreground">He leído y estoy de acuerdo con los <a href="#" className="text-primary underline">términos y condiciones</a> de la web</span>
            </label>
            <button
              onClick={() => acceptTerms && setSubmitted(true)}
              disabled={!acceptTerms}
              className="w-full bg-primary text-white font-black py-4 rounded-xl text-base flex items-center justify-center gap-2 hover:bg-blue-700 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              style={{ boxShadow: "0 4px 16px rgba(0,85,255,0.30)" }}
            >
              <ShoppingCart size={18} /> Realizar el pedido
            </button>
          </div>
        </div>

        {/* ── Right: Order summary ── */}
        <div className="sticky top-24">
          <div className="rounded-2xl overflow-hidden" style={{ background: "linear-gradient(160deg, #0047cc 0%, #0066ff 100%)" }}>
            {/* Products */}
            <div className="p-5 flex flex-col gap-3">
              {cart.map(({ product, qty }) => (
                <div key={product.id} className="flex gap-3">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-white/10 shrink-0 border border-white/20">
                    <img src={productImgSrc} alt={product.name} className="w-full h-full object-contain p-2" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-xs font-bold leading-snug line-clamp-3">{product.name}</p>
                    <p className="text-white/70 text-xs mt-1">× {qty}</p>
                  </div>
                  <p className="text-white font-black text-sm shrink-0">{formatPrice(product.price * qty)}</p>
                </div>
              ))}

              {cart.length === 0 && (
                <p className="text-white/60 text-sm text-center py-4">No hay productos en el carrito</p>
              )}
            </div>

            {/* Totals */}
            <div className="border-t border-white/20 px-5 py-4 flex flex-col gap-3">
              <div className="flex justify-between text-sm">
                <span className="text-white font-bold">Subtotal</span>
                <span className="text-white font-bold">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm border-t border-white/20 pt-3">
                <span className="text-white font-bold">Envío</span>
                <span className="text-white/70 font-semibold">A calcular</span>
              </div>
              <div className="flex justify-between border-t border-white/20 pt-3">
                <span className="text-white font-black text-base">Total</span>
                <span className="text-white font-black text-xl" style={{ fontFamily: "Nunito Sans, sans-serif" }}>{formatPrice(subtotal)}</span>
              </div>
            </div>

            {/* Trust badges */}
            <div className="border-t border-white/20 px-5 py-5 grid grid-cols-3 gap-3 text-center">
              {[
                { icon: Truck, text: "Envíos a todo\nel Perú" },
                { icon: Shield, text: "+5,000\npedidos entregados" },
                { icon: Zap, text: "Pagos\nseguros" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex flex-col items-center gap-2">
                  <div className="w-9 h-9 rounded-full border border-white/30 flex items-center justify-center">
                    <Icon size={16} className="text-white" strokeWidth={1.5} />
                  </div>
                  <p className="text-[10px] text-white/80 leading-tight whitespace-pre-line">{text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Secure badge */}
          <div className="flex items-center justify-center gap-2 mt-4 text-xs text-muted-foreground">
            <Shield size={13} className="text-emerald-600" />
            Transacciones 100% seguras y encriptadas
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Mega Menu Item ───────────────────────────────────────────────────────────

function MegaMenuItem({ item, onNavigate }: { item: (typeof MEGA_MENU)[0]; onNavigate: (cat: string, label: string) => void }) {
  const [open, setOpen] = useState(false);

  const CATEGORY_MAP: Record<string, string> = {
    "Laptops": "laptops", "Mini PC": "laptops", "Computadoras": "laptops", "All In One": "laptops",
    "Tablets": "celulares", "Monitores": "monitores",
    "Impresoras Inkjet": "impresoras", "Impresoras Láser": "impresoras", "Impresoras Multifunción": "impresoras",
    "Impresoras Matriciales": "impresoras", "Impresoras Térmicas": "impresoras", "Impresoras de Etiquetas": "impresoras", "Escáneres": "impresoras",
    "Tóner HP": "toner", "Tóner Brother": "toner", "Tóner Canon": "toner", "Tóner Samsung": "toner",
    "Tóner Kyocera": "toner", "Tóner Ricoh": "toner", "Tóner Xerox": "toner", "Tóner Lexmark": "toner", "Tóner Konica Minolta": "toner",
    "Tintas Epson": "tintas", "Tintas Canon": "tintas", "Tintas HP": "tintas",
    "Cintas Epson": "tintas", "Cintas Brother": "tintas", "Cintas de Etiquetas": "tintas",
    "Unidades de Imagen": "toner", "Fusores": "toner", "Rodillos": "toner", "Repuestos para Impresoras": "toner",
  };

  return (
    <div className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button
        onClick={() => onNavigate(CATEGORY_MAP[item.label] ?? item.label.toLowerCase(), item.label)}
        className="relative flex items-center gap-1 px-4 py-2.5 text-[13px] font-semibold hover:bg-white/10 transition-colors whitespace-nowrap group"
      >
        {item.label}
        <ChevronDown size={11} className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-white scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left" />
      </button>

      {open && (
        <div
          className="absolute top-full left-0 bg-white text-foreground shadow-xl border border-border rounded-b-xl overflow-hidden z-50"
          style={{ minWidth: 180 * item.cols.length }}
        >
          <div className="flex gap-0 divide-x divide-border">
            {item.cols.map((col) => (
              <div key={col.title} className="p-4 min-w-[170px]">
                <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-2">{col.title}</p>
                <ul className="flex flex-col gap-1">
                  {col.items.map((it) => (
                    <li key={it}>
                      <button
                        onClick={() => onNavigate(CATEGORY_MAP[it] ?? "all", it)}
                        className="text-xs text-foreground/70 hover:text-primary hover:font-semibold transition-colors block py-0.5 text-left w-full"
                      >
                        {it}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Carrusel Box ─────────────────────────────────────────────────────────────

function HeroCarousel({ onCategorySelect }: { onCategorySelect: (cat: string) => void }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => setActive((a) => (a + 1) % SLIDES.length), []);
  const prev = useCallback(() => setActive((a) => (a - 1 + SLIDES.length) % SLIDES.length), []);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(next, 5000);
    return () => clearInterval(t);
  }, [paused, next]);

  const slide = SLIDES[active];

  return (
    <section className="bg-background pt-0 pb-4">
      <div className="max-w-7xl mx-auto px-6">
        <div className="-mx-[65px]">
        <div
          className="relative overflow-hidden shadow-xl"
          style={{ background: slide.bg, transition: "background 0.6s ease", minHeight: 144 }}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* decorative layers */}
          <div className="absolute inset-0 opacity-5"
            style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
          <div className="absolute inset-0 opacity-15"
            style={{ backgroundImage: "radial-gradient(circle at 72% 50%, white 0%, transparent 55%)" }} />

          {/* slide content */}
          <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-6 items-center px-8 sm:px-12 py-4 sm:py-6">

            {/* text */}
            <div className="text-white" key={slide.id}>
              <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-1 rounded-full mb-4 ${slide.badge}`}>
                <Zap size={10} fill="currentColor" /> {slide.tag}
              </span>
              <h1
                className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight mb-3 whitespace-pre-line"
                style={{ fontFamily: "Nunito Sans, sans-serif" }}
              >
                {slide.title}
              </h1>
              <p className="text-white/80 text-sm sm:text-base mb-6 max-w-sm">{slide.subtitle}</p>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => onCategorySelect(slide.ctaCategory)}
                  className="flex items-center gap-2 bg-white font-bold px-5 py-2.5 rounded-xl hover:opacity-90 transition-opacity text-sm"
                  style={{ color: slide.accent }}
                >
                  {slide.cta} <ArrowRight size={15} />
                </button>
                <button
                  onClick={() => onCategorySelect("all")}
                  className="flex items-center gap-2 bg-white/15 border border-white/30 text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-white/25 transition-colors text-sm"
                >
                  Ver todo
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mt-5">
                {["Garantía oficial", "Envío gratis +S/ 200", "Cuotas sin intereses"].map((t) => (
                  <span key={t} className="flex items-center gap-1 text-[11px] text-white/70 bg-white/10 px-2.5 py-1 rounded-full">
                    <Shield size={9} className="text-white/80" /> {t}
                  </span>
                ))}
              </div>
            </div>

            {/* product image */}
            <div className="hidden lg:flex items-center justify-end pr-4">
              <div className="relative w-64 h-32 rounded-xl overflow-hidden shadow-2xl border border-white/20">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover opacity-90 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />
              </div>
            </div>
          </div>

          {/* prev / next buttons */}
          <button
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/25 hover:bg-black/45 text-white flex items-center justify-center transition-colors border border-white/20 backdrop-blur-sm"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/25 hover:bg-black/45 text-white flex items-center justify-center transition-colors border border-white/20 backdrop-blur-sm"
          >
            <ChevronRight size={16} />
          </button>

          {/* dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`rounded-full transition-all duration-300 ${i === active ? "w-5 h-2 bg-white" : "w-2 h-2 bg-white/40 hover:bg-white/70"}`}
              />
            ))}
          </div>

          {/* progress bar */}
          <div className="absolute bottom-0 left-0 w-full h-0.5 bg-white/15 rounded-b-2xl overflow-hidden">
            <div
              key={`${active}-${paused}`}
              className="h-full bg-white/60"
              style={{ animation: paused ? "none" : "carousel-progress 5s linear forwards" }}
            />
          </div>
        </div>
      </div>
      <style>{`@keyframes carousel-progress { from { width: 0% } to { width: 100% } }`}</style>
        </div>
    </section>
  );
}

// ─── Flash Offers ─────────────────────────────────────────────────────────────

const FLASH_PRODUCTS = [
  { id: 1,  name: "Tinta HP 664 Negro",         brand: "HP",      price: 39,   originalPrice: 49,   discount: 20, image: "https://images.unsplash.com/photo-1740884730591-8f4878e2cc64?w=300&h=300&fit=crop&auto=format", stock: 8 },
  { id: 5,  name: "Tinta HP 664 Color",          brand: "HP",      price: 44,   originalPrice: 55,   discount: 20, image: "https://images.unsplash.com/photo-1706895040634-62055892cbbb?w=300&h=300&fit=crop&auto=format", stock: 5 },
  { id: 10, name: "Tóner HP 85A CE285A",         brand: "HP",      price: 189,  originalPrice: 229,  discount: 17, image: "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=300&h=300&fit=crop&auto=format", stock: 3 },
  { id: 2,  name: 'Laptop HP 240 G10 15.6"',     brand: "HP",      price: 2199, originalPrice: 2699, discount: 19, image: "https://images.unsplash.com/photo-1683128069421-2c1881f70ed7?w=300&h=300&fit=crop&auto=format", stock: 2 },
  { id: 7,  name: "Set Tintas Epson 664 x4",     brand: "Epson",   price: 129,  originalPrice: 160,  discount: 19, image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop&auto=format", stock: 6 },
  { id: 12, name: "Tóner Samsung MLT-D101S",     brand: "Samsung", price: 159,  originalPrice: 199,  discount: 20, image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=300&h=300&fit=crop&auto=format", stock: 4 },
  { id: 3,  name: "Laptop Lenovo IdeaPad 3",     brand: "Lenovo",  price: 1899, originalPrice: 2299, discount: 17, image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&h=300&fit=crop&auto=format", stock: 2 },
  { id: 13, name: "Tóner Brother TN-1060",       brand: "Brother", price: 145,  originalPrice: 179,  discount: 19, image: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=300&h=300&fit=crop&auto=format", stock: 7 },
];

const FLASH_VISIBLE = 5;

function useCountdown(targetSeconds: number) {
  const [seconds, setSeconds] = useState(targetSeconds);
  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => (s > 0 ? s - 1 : targetSeconds)), 1000);
    return () => clearInterval(t);
  }, [targetSeconds]);
  const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
  const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
  const s = String(seconds % 60).padStart(2, "0");
  return { h, m, s };
}

function FlashOffers({ onAddToCart, onGoProduct }: { onAddToCart: (p: (typeof PRODUCTS)[0]) => void; onGoProduct?: (id: number) => void }) {
  const [start, setStart] = useState(0);
  const { h, m, s } = useCountdown(4 * 3600 + 23 * 60 + 47);
  const canPrev = start > 0;
  const canNext = start + FLASH_VISIBLE < FLASH_PRODUCTS.length;

  return (
    <section className="border-b border-border py-5" style={{ background: "linear-gradient(180deg, #fff7f0 0%, #ffffff 100%)" }}>
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-[#ff4300] text-white px-3 py-1.5 rounded-lg shadow-sm shadow-orange-200">
              <Zap size={14} fill="white" />
              <span className="text-sm font-black" style={{ fontFamily: "Nunito Sans, sans-serif" }}>Ofertas Flash</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-muted-foreground text-xs mr-1">Termina en</span>
              {[h, m, s].map((v, i) => (
                <span key={i} className="flex items-center gap-1">
                  <span className="bg-[#ff4300] text-white text-xs font-black px-1.5 py-0.5 rounded font-mono min-w-[24px] text-center">{v}</span>
                  {i < 2 && <span className="text-[#ff4300] font-black text-sm">:</span>}
                </span>
              ))}
            </div>
          </div>
          <a href="#" className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
            Ver todas <ChevronRight size={13} />
          </a>
        </div>

        {/* Carousel */}
        <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${FLASH_VISIBLE}, 1fr)` }}>
            {FLASH_PRODUCTS.slice(start, start + FLASH_VISIBLE).map((p) => (
              <div key={p.id} onClick={() => onGoProduct?.(p.id)} className="group bg-white border border-orange-100 rounded-xl overflow-hidden flex flex-col hover:shadow-md hover:border-orange-300 transition-all duration-200 cursor-pointer">
                <div className="relative bg-white flex items-center justify-center overflow-hidden" style={{ width: "100%", height: 180, minHeight: 180 }}>
                  <img src={productImgSrc} alt={p.name} className="w-full h-full object-contain p-2 transition-transform duration-300 group-hover:scale-105" />
                  <div className="absolute top-2 left-2 bg-[#ff4300] text-white text-[10px] font-black px-1.5 py-0.5 rounded flex items-center gap-0.5">
                    <Zap size={9} fill="white" /> -{p.discount}%
                  </div>
                  <div className="absolute bottom-2 left-2 right-2">
                    <div className="bg-black/60 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="h-full bg-[#ff4300] rounded-full"
                        style={{ width: `${Math.round((p.stock / 10) * 100)}%` }}
                      />
                    </div>
                    <p className="text-[9px] text-white/80 mt-0.5 font-mono">Solo {p.stock} disponibles</p>
                  </div>
                </div>
                <div className="p-2.5 flex flex-col gap-1 flex-1">
                  <p className="text-[10px] font-bold text-primary uppercase tracking-wide">{p.brand}</p>
                  <p className="text-[13px] font-bold leading-[1.45] overflow-visible" style={{ fontFamily: "Nunito Sans, sans-serif" }}>
                    {p.name}
                  </p>
                  <div className="mt-auto pt-1">
                    <div className="flex items-baseline gap-1.5 mb-1.5">
                      <span className="text-base font-black text-foreground" style={{ fontFamily: "Nunito Sans, sans-serif" }}>
                        {formatPrice(p.price)}
                      </span>
                      <span className="text-[10px] text-muted-foreground line-through">{formatPrice(p.originalPrice)}</span>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); onAddToCart(PRODUCTS.find((pr) => pr.id === p.id) ?? PRODUCTS[0]); }}
                      className="w-full bg-primary text-white text-sm font-bold py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 active:scale-95 transition-all"
                    >
                      <ShoppingCart size={14} /> Agregar al carrito
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
}

// ─── Product Row Carousel ─────────────────────────────────────────────────────

function ProductRowCarousel({
  title,
  category,
  onAddToCart,
  onViewAll,
  onGoProduct,
}: {
  title: string;
  category: string;
  onAddToCart: (p: (typeof PRODUCTS)[0]) => void;
  onViewAll: () => void;
  onGoProduct?: (id: number) => void;
}) {
  const items = PRODUCTS.filter((p) => p.category === category);
  const [start, setStart] = useState(0);
  const visible = 5;
  const canPrev = start > 0;
  const canNext = start + visible < items.length;

  return (
    <section className="bg-white border-b border-border py-5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-1 h-5 rounded-full bg-primary" />
            <h2 className="text-base font-black text-foreground" style={{ fontFamily: "Nunito Sans, sans-serif" }}>{title}</h2>
          </div>
          <button onClick={onViewAll} className="group flex items-center gap-1 text-xs font-bold text-primary hover:text-blue-700 transition-colors">
            Ver todos
            <ChevronRight size={13} className="transition-transform duration-200 group-hover:translate-x-0.5" />
          </button>
        </div>

        <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${visible}, 1fr)` }}>
            {items.slice(start, start + visible).map((p) => {
              const discount = p.originalPrice
                ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)
                : null;
              return (
                <div key={p.id} onClick={() => onGoProduct?.(p.id)} className="group bg-white border border-border rounded-xl overflow-hidden flex flex-col hover:shadow-md hover:border-primary/30 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer">
                  <div className="relative bg-white flex items-center justify-center overflow-hidden" style={{ width: "100%", height: 180, minHeight: 180 }}>
                    <img src={productImgSrc} alt={p.name} className="w-full h-full object-contain p-2 transition-transform duration-300 group-hover:scale-105" />
                    {discount && (
                      <div className="absolute top-2 left-2 bg-[#ff4300] text-white text-[10px] font-black px-1.5 py-0.5 rounded">
                        -{discount}%
                      </div>
                    )}
                    {!discount && p.badge && (
                      <div className={`absolute top-2 left-2 text-[10px] font-black px-1.5 py-0.5 rounded ${BADGE_STYLES[p.badge] ?? ""}`}>
                        {p.badge}
                      </div>
                    )}
                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/90 flex items-center justify-center shadow-sm hover:bg-white transition-colors"
                    >
                      <Heart size={11} className="text-muted-foreground" />
                    </button>
                  </div>
                  <div className="p-3 flex flex-col gap-1 flex-1">
                    <p className="text-[10px] font-bold text-primary uppercase tracking-wide">{p.brand}</p>
                    <p className="text-[13px] font-bold leading-[1.45]" style={{ fontFamily: "Nunito Sans, sans-serif" }}>
                      {p.name}
                    </p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <StarRating rating={p.rating} />
                      <span className="text-[10px] text-muted-foreground">({p.reviews.toLocaleString()})</span>
                    </div>
                    <div className="mt-auto pt-1">
                      <div className="flex items-baseline gap-1.5 mb-1">
                        <span className="text-base font-black text-foreground" style={{ fontFamily: "Nunito Sans, sans-serif" }}>
                          {formatPrice(p.price)}
                        </span>
                        {p.originalPrice && (
                          <span className="text-[10px] text-muted-foreground line-through">{formatPrice(p.originalPrice)}</span>
                        )}
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); onAddToCart(p); }}
                        className="w-full bg-primary text-white text-sm font-bold py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 active:scale-95 transition-all"
                      >
                        <ShoppingCart size={14} /> Agregar al carrito
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </section>
  );
}

// ─── Category Carousel ───────────────────────────────────────────────────────

const CAT_ITEMS = [
  { id: "all",     label: "Todo",         image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&h=300&fit=crop&auto=format" },
  { id: "tintas",  label: "Tintas",       image: "https://images.unsplash.com/photo-1706895040634-62055892cbbb?w=300&h=300&fit=crop&auto=format" },
  { id: "toner",   label: "Tóner",        image: "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=300&h=300&fit=crop&auto=format" },
  { id: "laptops", label: "Laptops",      image: "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=300&h=300&fit=crop&auto=format" },
  { id: "tintas",  label: "Tintas Epson", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop&auto=format" },
  { id: "toner",   label: "Tóner HP",     image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=300&h=300&fit=crop&auto=format" },
  { id: "laptops", label: "Laptops Dell", image: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=300&h=300&fit=crop&auto=format" },
  { id: "tintas",  label: "Tintas Canon", image: "https://images.unsplash.com/photo-1551971868-1bc03829fd98?w=300&h=300&fit=crop&auto=format" },
];

const VISIBLE = 6;

function CategoryCarousel({ onCategorySelect }: { onCategorySelect: (cat: string) => void }) {
  const [start, setStart] = useState(0);
  const canPrev = start > 0;
  const canNext = start + VISIBLE < CAT_ITEMS.length;

  return (
    <section className="bg-white border-b border-border py-5">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-base font-black text-foreground mb-4" style={{ fontFamily: "Nunito Sans, sans-serif" }}>
          Categorías
        </h2>

        <div className="grid grid-cols-6 gap-4">
            {CAT_ITEMS.slice(start, start + VISIBLE).map((cat, i) => (
              <button
                key={`${cat.id}-${i}-${start}`}
                onClick={() => onCategorySelect(cat.id)}
                className="group flex flex-col items-center gap-2 focus:outline-none"
              >
                <div className="w-full aspect-square rounded-xl overflow-hidden border-2 border-border group-hover:border-primary transition-all duration-200 group-hover:-translate-y-0.5 group-hover:shadow-lg group-hover:shadow-blue-100">
                  <img
                    src={cat.image}
                    alt={cat.label}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <p className="text-xs font-bold text-foreground text-center leading-tight">{cat.label}</p>
              </button>
            ))}
        </div>
      </div>
    </section>
  );
}

// ─── Product Card ─────────────────────────────────────────────────────────────

function ProductCard({
  product,
  onAddToCart,
  onGoProduct,
}: {
  product: (typeof PRODUCTS)[0];
  onAddToCart: (p: (typeof PRODUCTS)[0]) => void;
  onGoProduct?: (id: number) => void;
}) {
  const [wished, setWished] = useState(false);
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <div onClick={() => onGoProduct?.(product.id)} className="group relative bg-card border border-border rounded-xl overflow-hidden flex flex-col transition-all duration-200 hover:shadow-lg hover:shadow-blue-100 hover:-translate-y-0.5 cursor-pointer">
      <div className="relative overflow-hidden bg-white" style={{ width: "100%", height: 200, minHeight: 200 }}>
        <img src={productImgSrc} alt={product.name}
          className="w-full h-full object-contain p-2 transition-transform duration-500 group-hover:scale-105" />
        {discount && (
          <div className="absolute top-3 left-3 bg-[#ff4300] text-white text-[11px] font-bold px-2 py-0.5 rounded">
            -{discount}%
          </div>
        )}
        {!discount && product.badge && (
          <div className="absolute top-3 left-3">
            <span className={`px-2 py-0.5 text-[10px] font-bold tracking-widest uppercase rounded ${BADGE_STYLES[product.badge] ?? ""}`}>
              {product.badge}
            </span>
          </div>
        )}
        <button
          onClick={(e) => { e.stopPropagation(); setWished((w) => !w); }}
          className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-colors shadow-sm"
        >
          <Heart size={13} className={wished ? "fill-[#ff4300] text-[#ff4300]" : "text-muted-foreground"} />
        </button>
      </div>

      <div className="p-4 flex flex-col gap-2 flex-1">
        <p className="text-[11px] font-bold text-primary uppercase tracking-wider">{product.brand}</p>
        <h3 className="text-[13px] font-bold leading-[1.45] overflow-visible" style={{ fontFamily: "Nunito Sans, sans-serif" }}>
          {product.name}
        </h3>
        <div className="flex items-center gap-1.5">
          <StarRating rating={product.rating} />
          <span className="text-[11px] text-muted-foreground">({product.reviews.toLocaleString()})</span>
        </div>

        <div className="mt-auto pt-1">
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-xl font-black text-foreground" style={{ fontFamily: "Nunito Sans, sans-serif" }}>
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-muted-foreground line-through">{formatPrice(product.originalPrice)}</span>
            )}
          </div>
          <p className="text-[11px] text-muted-foreground mb-3">
            6 cuotas de <span className="font-bold text-primary">{formatPrice(Math.round(product.price / 6))}</span>
          </p>
          <button
            onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
            className="w-full bg-primary text-white text-sm font-bold py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 active:scale-95 transition-all"
          >
            <ShoppingCart size={14} /> Agregar al carrito
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Cart Drawer ──────────────────────────────────────────────────────────────

function CartDrawer({
  items, onClose, onUpdateQty, onRemove, onCheckout, onGoCart,
}: {
  items: CartItem[];
  onClose: () => void;
  onUpdateQty: (id: number, qty: number) => void;
  onRemove: (id: number) => void;
  onCheckout?: () => void;
  onGoCart?: () => void;
}) {
  const subtotal = items.reduce((s, i) => s + i.product.price * i.qty, 0);

  return (
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" onClick={onClose} />
      <div className="fixed top-0 right-0 h-full w-full max-w-[340px] bg-white z-50 flex flex-col shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="text-base font-black text-foreground" style={{ fontFamily: "Nunito Sans, sans-serif" }}>
            Carrito de compra
          </h2>
          <button onClick={onClose} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <X size={16} /> Cerrar
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 text-muted-foreground px-8">
            <ShoppingCart size={36} strokeWidth={1} />
            <p className="text-center text-sm">Tu carrito está vacío</p>
            <button onClick={onClose} className="bg-primary text-white text-sm font-bold px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Seguir comprando
            </button>
          </div>
        ) : (
          <>
            {/* Items */}
            <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-0">
              {items.map(({ product, qty }) => (
                <div key={product.id} className="flex gap-3 py-4 border-b border-border last:border-0">
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-secondary shrink-0 border border-border">
                    <img src={productImgSrc} alt={product.name} className="w-full h-full object-contain p-2" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs font-semibold text-foreground leading-snug line-clamp-2">{product.name}</p>
                      <button onClick={() => onRemove(product.id)} className="text-muted-foreground hover:text-[#ff4300] transition-colors shrink-0 mt-0.5">
                        <X size={14} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2 text-sm">
                        <button onClick={() => onUpdateQty(product.id, qty - 1)} className="w-6 h-6 flex items-center justify-center hover:text-primary transition-colors text-muted-foreground font-bold">-</button>
                        <span className="font-black text-foreground min-w-[20px] text-center">{qty}</span>
                        <button onClick={() => onUpdateQty(product.id, qty + 1)} className="w-6 h-6 flex items-center justify-center hover:text-primary transition-colors text-muted-foreground font-bold">+</button>
                      </div>
                      <p className="text-sm font-black text-foreground">{qty} × {formatPrice(product.price)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="border-t border-border p-4 flex flex-col gap-2.5">
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-foreground">Subtotal:</span>
                <span className="text-base font-black text-foreground" style={{ fontFamily: "Nunito Sans, sans-serif" }}>{formatPrice(subtotal)}</span>
              </div>
              <button
                onClick={() => { onClose(); onGoCart?.(); }}
                className="w-full border-2 border-border text-sm font-bold py-2.5 rounded-xl text-foreground hover:border-primary hover:text-primary transition-colors"
              >
                Ver carrito
              </button>
              <button
                onClick={() => { onClose(); onCheckout?.(); }}
                className="w-full bg-primary text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors"
                style={{ boxShadow: "0 4px 14px rgba(0,85,255,0.25)" }}
              >
                Finalizar compra
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<
    { type: "home" } |
    { type: "category"; category: string; label: string } |
    { type: "product"; productId: number; fromCategory?: string; fromLabel?: string } |
    { type: "cart" } |
    { type: "checkout" }
  >({ type: "home" });

  function goToCart() {
    setCurrentPage({ type: "cart" });
    setCartOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function goToCheckout() {
    setCurrentPage({ type: "checkout" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function navigateTo(category: string, label: string) {
    setCurrentPage({ type: "category", category, label });
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function navigateToProduct(productId: number, fromCategory?: string, fromLabel?: string) {
    setCurrentPage({ type: "product", productId, fromCategory, fromLabel });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function goHome() {
    setCurrentPage({ type: "home" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const filtered = PRODUCTS.filter((p) => {
    const matchCat = activeCategory === "all" || p.category === activeCategory;
    const matchSearch =
      !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  function addToCart(product: (typeof PRODUCTS)[0]) {
    setCart((prev) => {
      const ex = prev.find((i) => i.product.id === product.id);
      if (ex) return prev.map((i) => i.product.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { product, qty: 1 }];
    });
  }

  function updateQty(id: number, qty: number) {
    if (qty < 1) setCart((p) => p.filter((i) => i.product.id !== id));
    else setCart((p) => p.map((i) => i.product.id === id ? { ...i, qty } : i));
  }

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  return (
    <div className="min-h-screen bg-background text-foreground" style={{ fontFamily: "Inter, sans-serif" }}>

      {/* Checkout — standalone sin header/footer */}
      {currentPage.type === "checkout" && (
        <CheckoutPage cart={cart} onGoHome={goHome} />
      )}

      {currentPage.type === "checkout" ? null : <>

      {/* Top bar */}
      <div className="text-white text-[11px] py-1.5 hidden sm:block" style={{ background: "#0e3dbf" }}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-5">
            <a href="tel:017004000" className="flex items-center gap-1.5 hover:text-blue-200 transition-colors">
              <Phone size={11} /> (01) 700-4000
            </a>
            <a href="mailto:ventas@sebastperu.pe" className="flex items-center gap-1.5 hover:text-blue-200 transition-colors">
              <Mail size={11} /> ventas@sebastperu.pe
            </a>
            <span className="flex items-center gap-1.5 text-white/70">
              <MapPin size={11} /> Lima, Perú
            </span>
          </div>
          <div className="flex items-center gap-4 text-white/80">
            <span className="flex items-center gap-1"><Zap size={10} className="text-amber-300" /> Envío gratis +S/ 200</span>
            <span className="text-white/30">|</span>
            <span className="flex items-center gap-1"><Shield size={10} className="text-amber-300" /> Garantía oficial</span>
            <span className="text-white/30">|</span>
            <span className="flex items-center gap-1"><Truck size={10} className="text-amber-300" /> Entrega en 24h Lima</span>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-30" style={{ background: "#1a56ff", boxShadow: "0 2px 16px rgba(26,86,255,0.35)" }}>
        <div className="max-w-7xl mx-auto px-6 flex items-center h-[70px] gap-6 w-full">
          <button className="md:hidden text-white/80 hover:text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          {/* Logo */}
          <button onClick={goHome} className="flex items-center shrink-0">
            <img src={logoSrc} alt="SEBASTPERU" className="h-11 w-auto object-contain brightness-0 invert" />
          </button>

          <div className="w-px h-8 bg-white/20 hidden md:block shrink-0" />

          {/* Search */}
          <div className="flex-1 hidden sm:flex items-center">
            <div className="flex w-full rounded-xl overflow-hidden border-2 border-white/30 focus-within:border-white transition-colors shadow-sm">
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Busca tintas HP, tóner Samsung, laptops Dell…"
                className="flex-1 px-4 py-2.5 text-sm text-foreground placeholder-gray-400 focus:outline-none bg-white"
              />
              <button className="text-white px-5 flex items-center gap-2 transition-colors font-semibold text-sm shrink-0 hover:opacity-90" style={{ background: "#0e3dbf" }}>
                <Search size={15} />
                <span className="hidden lg:block">Buscar</span>
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 ml-auto">
            {/* Account */}
            <div className="hidden lg:flex items-center gap-2">
              <a href="#" className="flex flex-col items-start leading-tight px-3 py-2 rounded-lg border border-transparent hover:border-white/20 hover:bg-white/10 transition-all group">
                <span className="text-[10px] text-white/60 group-hover:text-white/80 transition-colors">¿Ya tienes cuenta?</span>
                <span className="font-black text-[13px] text-white">Inicia sesión</span>
              </a>
              <a href="#" className="text-[12px] font-black text-white border-2 border-white/50 hover:bg-white hover:text-primary transition-all px-3 py-2 rounded-lg whitespace-nowrap">
                Regístrate
              </a>
            </div>

            <div className="w-px h-8 bg-white/20 hidden lg:block shrink-0" />

            {/* Cart */}
            <button
              onClick={() => setCartOpen(true)}
              className="relative flex items-center gap-2.5 bg-white/15 hover:bg-white/25 border border-white/30 active:scale-95 transition-all text-white rounded-xl px-4 py-2"
            >
              <div className="relative">
                <ShoppingCart size={18} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-[#ff4300] text-white text-[9px] font-black flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </div>
              <div className="hidden sm:block leading-tight text-left">
                <p className="text-[9px] text-white/70 uppercase tracking-widest font-semibold">MI CARRITO</p>
                <p className="text-sm font-black">{formatPrice(cart.reduce((s, i) => s + i.product.price * i.qty, 0))}</p>
              </div>
            </button>
          </div>
        </div>

        <div className="h-px bg-white/10" />
        {/* Mega menu nav */}
        <nav className="hidden md:block text-white relative z-50" style={{ background: "#1a56ff" }}>
          <div className="max-w-7xl mx-auto px-6 flex">
            {MEGA_MENU.map((cat) => (
              <MegaMenuItem key={cat.label} item={cat} onNavigate={navigateTo} />
            ))}
            <a href="#" className="ml-auto px-4 py-2.5 text-[13px] font-black text-amber-300 hover:bg-white/10 transition-colors flex items-center gap-1.5 whitespace-nowrap">
              <Tag size={13} fill="currentColor" /> OFERTAS
            </a>
          </div>
        </nav>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-white px-4 py-3 flex flex-col gap-2">
            <div className="relative mb-2">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Busca productos…"
                className="w-full border border-border rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-primary"
              />
            </div>
            {MEGA_MENU.map((c) => (
              <a key={c.label} href="#" className="text-sm py-1.5 border-b border-border last:border-0 hover:text-primary transition-colors font-medium">{c.label}</a>
            ))}
          </div>
        )}
      </header>

      {/* Page content */}
      {currentPage.type === "cart" ? (
        <CartPage
          cart={cart}
          onUpdateQty={updateQty}
          onRemove={(id) => setCart((p) => p.filter((i) => i.product.id !== id))}
          onGoHome={goHome}
          onGoCheckout={goToCheckout}
          onGoProduct={(id) => navigateToProduct(id)}
        />
      ) : currentPage.type === "product" ? (
        <ProductPage
          productId={currentPage.productId}
          fromCategory={currentPage.fromCategory}
          fromLabel={currentPage.fromLabel}
          onAddToCart={addToCart}
          onGoHome={goHome}
          onGoCategory={navigateTo}
          onGoProduct={(id) => navigateToProduct(id, currentPage.fromCategory, currentPage.fromLabel)}
        />
      ) : currentPage.type === "category" ? (
        <CategoryPage
          category={currentPage.category}
          label={currentPage.label}
          onAddToCart={addToCart}
          onGoHome={goHome}
          onGoProduct={(id) => navigateToProduct(id, currentPage.category, currentPage.label)}
        />
      ) : (
        <>
      {/* Hero Carrusel */}
      <HeroCarousel onCategorySelect={(cat) => { setActiveCategory(cat); setSearchQuery(""); }} />

      {/* Trust strip */}
      <section className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4 grid grid-cols-2 sm:grid-cols-5 gap-4">
          {[
            { icon: Truck, title: "Envío gratis", desc: "En pedidos +S/ 200", color: "text-primary" },
            { icon: Shield, title: "Garantía oficial", desc: "12 meses de cobertura", color: "text-emerald-600" },
            { icon: Zap, title: "Entrega rápida", desc: "Lima: 24-48 horas", color: "text-amber-500" },
            { icon: Headphones, title: "Soporte 24/7", desc: "Chat y teléfono", color: "text-purple-600" },
          ].map(({ icon: Icon, title, desc, color }) => (
            <div key={title} className="flex items-center gap-3">
              <Icon size={22} className={color} />
              <div>
                <p className="text-sm font-bold">{title}</p>
                <p className="text-[11px] text-muted-foreground">{desc}</p>
              </div>
            </div>
          ))}

          {/* MercadoPago */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 overflow-hidden bg-[#009ee3]">
              <svg viewBox="0 0 48 48" className="w-6 h-6" fill="none">
                <circle cx="24" cy="24" r="24" fill="#009ee3"/>
                <path d="M8 26.5c0-8.56 7.16-15.5 16-15.5s16 6.94 16 15.5" stroke="white" strokeWidth="3.5" strokeLinecap="round"/>
                <circle cx="24" cy="27" r="4" fill="white"/>
              </svg>
            </div>
            <div>
              <p className="text-sm font-bold">Pagos seguros</p>
              <p className="text-[11px] text-muted-foreground">con MercadoPago</p>
            </div>
          </div>
        </div>
      </section>

      {/* Category carousel */}
      <CategoryCarousel onCategorySelect={(cat) => { setActiveCategory(cat); setSearchQuery(""); }} />

      {/* Flash offers */}
      <FlashOffers onAddToCart={addToCart} onGoProduct={(id) => navigateToProduct(id)} />

      {/* Banners duo */}
      <section className="bg-background py-5">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 gap-4">

          {/* Banner Impresoras */}
          <div className="relative overflow-hidden rounded-xl flex items-center" style={{ background: "linear-gradient(120deg, #003399 0%, #0055dd 60%, #3380ff 100%)", minHeight: 160 }}>
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 80% 50%, white 0%, transparent 55%)" }} />
            <div className="relative z-10 px-7 py-6 flex-1">
              <span className="text-[10px] font-bold text-blue-200 uppercase tracking-widest">Especial impresión</span>
              <h3 className="text-2xl font-black text-white leading-tight mt-1" style={{ fontFamily: "Nunito Sans, sans-serif" }}>
                Impresoras HP<br />
                <span className="text-amber-300">desde S/ 299</span>
              </h3>
              <p className="text-blue-100 text-xs mt-1 mb-3">Inkjet, multifunción y tanque de tinta</p>
              <button
                onClick={() => {}}
                className="inline-flex items-center gap-1.5 bg-white text-[#003399] text-xs font-bold px-4 py-1.5 rounded-lg hover:bg-blue-50 transition-colors"
              >
                Ver impresoras <ChevronRight size={13} />
              </button>
            </div>
            <div className="relative w-44 h-full shrink-0 hidden sm:block">
              <img
                src="https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=400&h=300&fit=crop&auto=format"
                alt="Impresora HP"
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0055dd] via-[#0055dd]/30 to-transparent" />
            </div>
          </div>

          {/* Banner Tóner */}
          <div className="relative overflow-hidden rounded-xl flex items-center" style={{ background: "linear-gradient(120deg, #1a1a2e 0%, #2d2d4e 60%, #3d3d6e 100%)", minHeight: 160 }}>
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 80% 50%, white 0%, transparent 55%)" }} />
            <div className="relative z-10 px-7 py-6 flex-1">
              <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Impresión láser</span>
              <h3 className="text-2xl font-black text-white leading-tight mt-1" style={{ fontFamily: "Nunito Sans, sans-serif" }}>
                Tóner original<br />
                <span className="text-[#00d4ff]">hasta 40% OFF</span>
              </h3>
              <p className="text-slate-300 text-xs mt-1 mb-3">HP, Samsung, Brother y Epson</p>
              <button
                onClick={() => {}}
                className="inline-flex items-center gap-1.5 bg-[#00d4ff] text-[#1a1a2e] text-xs font-bold px-4 py-1.5 rounded-lg hover:bg-cyan-300 transition-colors"
              >
                Ver tóner <ChevronRight size={13} />
              </button>
            </div>
            <div className="relative w-44 h-full shrink-0 hidden sm:block">
              <img
                src="https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=300&fit=crop&auto=format"
                alt="Tóner laser"
                className="w-full h-full object-cover opacity-70"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#2d2d4e] via-[#2d2d4e]/30 to-transparent" />
            </div>
          </div>

        </div>
      </section>


      <ProductRowCarousel
        title="Impresoras"
        category="impresoras"
        onAddToCart={addToCart}
        onViewAll={() => navigateTo("impresoras", "Impresoras")}
        onGoProduct={(id) => navigateToProduct(id, "impresoras", "Impresoras")}
      />

      {/* Toner banners duo */}
      <section className="bg-background py-5">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 gap-4">

          {/* Banner Tóner HP */}
          <div className="relative overflow-hidden rounded-xl flex items-center" style={{ background: "linear-gradient(120deg, #001a6e 0%, #0047cc 55%, #2266ff 100%)", minHeight: 155 }}>
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 85% 50%, white 0%, transparent 55%)" }} />
            <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
            <div className="relative z-10 px-7 py-5 flex-1">
              <span className="text-[10px] font-bold text-blue-200 uppercase tracking-widest">Tóner original</span>
              <h3 className="text-xl font-black text-white leading-tight mt-1" style={{ fontFamily: "Nunito Sans, sans-serif" }}>
                Tóner HP LaserJet<br />
                <span className="text-amber-300">desde S/ 145</span>
              </h3>
              <p className="text-blue-100 text-xs mt-1 mb-3">85A · 35A · 78A · 12A — stock disponible</p>
              <button
                onClick={() => {}}
                className="inline-flex items-center gap-1.5 bg-white text-[#001a6e] text-xs font-bold px-4 py-1.5 rounded-lg hover:bg-blue-50 transition-colors"
              >
                Ver tóner HP <ChevronRight size={13} />
              </button>
            </div>
            <div className="relative w-40 h-full shrink-0 hidden sm:block self-stretch">
              <img
                src="https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=300&fit=crop&auto=format"
                alt="Tóner HP"
                className="w-full h-full object-cover opacity-75"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0047cc] via-[#0047cc]/20 to-transparent" />
            </div>
          </div>

          {/* Banner Tóner Samsung / Brother */}
          <div className="relative overflow-hidden rounded-xl flex items-center" style={{ background: "linear-gradient(120deg, #0a2a0a 0%, #145214 55%, #1a6e1a 100%)", minHeight: 155 }}>
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 85% 50%, white 0%, transparent 55%)" }} />
            <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
            <div className="relative z-10 px-7 py-5 flex-1">
              <span className="text-[10px] font-bold text-green-300 uppercase tracking-widest">Tóner compatible</span>
              <h3 className="text-xl font-black text-white leading-tight mt-1" style={{ fontFamily: "Nunito Sans, sans-serif" }}>
                Samsung · Brother<br />
                <span className="text-yellow-300">hasta 35% OFF</span>
              </h3>
              <p className="text-green-100 text-xs mt-1 mb-3">MLT-D101S · TN-1060 · TN-760 — garantía oficial</p>
              <button
                onClick={() => {}}
                className="inline-flex items-center gap-1.5 bg-white text-[#0a2a0a] text-xs font-bold px-4 py-1.5 rounded-lg hover:bg-green-50 transition-colors"
              >
                Ver tóner <ChevronRight size={13} />
              </button>
            </div>
            <div className="relative w-40 h-full shrink-0 hidden sm:block self-stretch">
              <img
                src="https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=400&h=300&fit=crop&auto=format"
                alt="Tóner Samsung Brother"
                className="w-full h-full object-cover opacity-75"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#145214] via-[#145214]/20 to-transparent" />
            </div>
          </div>

        </div>
      </section>

      <ProductRowCarousel
        title="Tóner para Impresora"
        category="toner"
        onAddToCart={addToCart}
        onViewAll={() => navigateTo("toner", "Tóner para Impresora")}
        onGoProduct={(id) => navigateToProduct(id, "toner", "Tóner para Impresora")}
      />

      {/* Tintas wide banner */}
      <section className="bg-background py-4">
        <div className="max-w-7xl mx-auto px-6">
          <div className="relative overflow-hidden rounded-xl flex items-center" style={{ background: "linear-gradient(105deg, #003399 0%, #0055dd 40%, #1a7fff 70%, #66aaff 100%)", minHeight: 90 }}>
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 90% 50%, white 0%, transparent 50%)" }} />
            <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "20px 20px" }} />

            {/* left image */}
            <div className="relative w-32 h-full shrink-0 self-stretch hidden sm:block">
              <img src="https://images.unsplash.com/photo-1740884730591-8f4878e2cc64?w=300&h=200&fit=crop&auto=format" alt="Tintas" className="w-full h-full object-cover opacity-70" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0055dd]" />
            </div>

            {/* text */}
            <div className="relative z-10 flex-1 flex items-center justify-between px-7 py-4">
              <div>
                <span className="text-[10px] font-bold text-blue-200 uppercase tracking-widest">Tintas para impresora</span>
                <h3 className="text-xl font-black text-white leading-tight mt-0.5" style={{ fontFamily: "Nunito Sans, sans-serif" }}>
                  HP · Epson · Canon · Brother — <span className="text-amber-300">hasta 25% OFF</span>
                </h3>
                <p className="text-blue-100 text-xs mt-0.5">Originales y compatibles. Envío gratis en pedidos +S/ 200.</p>
              </div>
              <button
                onClick={() => {}}
                className="shrink-0 ml-6 inline-flex items-center gap-1.5 bg-white text-[#003399] text-xs font-bold px-5 py-2 rounded-lg hover:bg-blue-50 transition-colors whitespace-nowrap"
              >
                Ver tintas <ChevronRight size={13} />
              </button>
            </div>

            {/* right image */}
            <div className="relative w-32 h-full shrink-0 self-stretch hidden sm:block">
              <img src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop&auto=format" alt="Tintas Epson" className="w-full h-full object-cover opacity-70" />
              <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#1a7fff]" />
            </div>
          </div>
        </div>
      </section>

      <ProductRowCarousel
        title="Tintas para Impresora"
        category="tintas"
        onAddToCart={addToCart}
        onViewAll={() => navigateTo("tintas", "Tintas para Impresora")}
        onGoProduct={(id) => navigateToProduct(id, "tintas", "Tintas para Impresora")}
      />

      {/* Laptops 3 banners */}
      <section className="bg-background py-5">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-3 gap-4">

          {/* Banner HP */}
          <div className="relative overflow-hidden rounded-xl flex items-center" style={{ background: "linear-gradient(120deg, #001a6e 0%, #0047cc 55%, #2266ff 100%)", minHeight: 160 }}>
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 85% 50%, white 0%, transparent 55%)" }} />
            <div className="relative z-10 px-5 py-5 flex-1">
              <span className="text-[10px] font-bold text-blue-200 uppercase tracking-widest">Laptops HP</span>
              <h3 className="text-lg font-black text-white leading-tight mt-1" style={{ fontFamily: "Nunito Sans, sans-serif" }}>
                HP Pavilion<br /><span className="text-amber-300">desde S/ 1,899</span>
              </h3>
              <p className="text-blue-100 text-[11px] mt-1 mb-3">Intel Core i5 · i7 — 8GB a 16GB RAM</p>
              <button className="inline-flex items-center gap-1 bg-white text-[#001a6e] text-[11px] font-bold px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors">
                Ver HP <ChevronRight size={12} />
              </button>
            </div>
            <div className="relative w-28 h-full shrink-0 self-stretch hidden sm:block">
              <img src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&h=250&fit=crop&auto=format" alt="Laptop HP" className="w-full h-full object-cover opacity-75" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0047cc] via-[#0047cc]/20 to-transparent" />
            </div>
          </div>

          {/* Banner Lenovo */}
          <div className="relative overflow-hidden rounded-xl flex items-center" style={{ background: "linear-gradient(120deg, #1a0050 0%, #4c0099 55%, #7733cc 100%)", minHeight: 160 }}>
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 85% 50%, white 0%, transparent 55%)" }} />
            <div className="relative z-10 px-5 py-5 flex-1">
              <span className="text-[10px] font-bold text-purple-200 uppercase tracking-widest">Laptops Lenovo</span>
              <h3 className="text-lg font-black text-white leading-tight mt-1" style={{ fontFamily: "Nunito Sans, sans-serif" }}>
                IdeaPad · ThinkPad<br /><span className="text-yellow-300">desde S/ 1,799</span>
              </h3>
              <p className="text-purple-100 text-[11px] mt-1 mb-3">AMD Ryzen 5 · 7 — hasta 32GB RAM</p>
              <button className="inline-flex items-center gap-1 bg-white text-[#1a0050] text-[11px] font-bold px-3 py-1.5 rounded-lg hover:bg-purple-50 transition-colors">
                Ver Lenovo <ChevronRight size={12} />
              </button>
            </div>
            <div className="relative w-28 h-full shrink-0 self-stretch hidden sm:block">
              <img src="https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&h=250&fit=crop&auto=format" alt="Laptop Lenovo" className="w-full h-full object-cover opacity-75" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#4c0099] via-[#4c0099]/20 to-transparent" />
            </div>
          </div>

          {/* Banner Dell */}
          <div className="relative overflow-hidden rounded-xl flex items-center" style={{ background: "linear-gradient(120deg, #001f3f 0%, #003d7a 55%, #0066cc 100%)", minHeight: 160 }}>
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 85% 50%, white 0%, transparent 55%)" }} />
            <div className="relative z-10 px-5 py-5 flex-1">
              <span className="text-[10px] font-bold text-blue-200 uppercase tracking-widest">Laptops Dell</span>
              <h3 className="text-lg font-black text-white leading-tight mt-1" style={{ fontFamily: "Nunito Sans, sans-serif" }}>
                Inspiron · Vostro<br /><span className="text-cyan-300">desde S/ 2,299</span>
              </h3>
              <p className="text-blue-100 text-[11px] mt-1 mb-3">Intel Core i7 · i9 — SSD NVMe 512GB</p>
              <button className="inline-flex items-center gap-1 bg-white text-[#001f3f] text-[11px] font-bold px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors">
                Ver Dell <ChevronRight size={12} />
              </button>
            </div>
            <div className="relative w-28 h-full shrink-0 self-stretch hidden sm:block">
              <img src="https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=300&h=250&fit=crop&auto=format" alt="Laptop Dell" className="w-full h-full object-cover opacity-75" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#003d7a] via-[#003d7a]/20 to-transparent" />
            </div>
          </div>

        </div>
      </section>

      <ProductRowCarousel
        title="Laptops"
        category="laptops"
        onAddToCart={addToCart}
        onViewAll={() => navigateTo("laptops", "Laptops")}
        onGoProduct={(id) => navigateToProduct(id, "laptops", "Laptops")}
      />


      {/* Promo banner */}
      <section className="max-w-7xl mx-auto px-6 pb-10">
        <div className="relative rounded-2xl overflow-hidden bg-[#001a6e]">
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: "radial-gradient(circle at 80% 50%, white 0%, transparent 55%)" }} />
          <div className="relative px-8 py-10 sm:flex sm:items-center sm:justify-between gap-6">
            <div className="text-white">
              <span className="text-[11px] font-bold tracking-widest uppercase text-amber-300">Oferta especial</span>
              <h3 className="text-3xl font-black mt-1" style={{ fontFamily: "Nunito Sans, sans-serif" }}>
                Tóner HP desde S/ 145
              </h3>
              <p className="text-white/70 text-sm mt-1">
                Stock disponible. Compatibles con HP LaserJet, Samsung y Brother.
              </p>
            </div>
            <button
              onClick={() => setActiveCategory("toner")}
              className="mt-4 sm:mt-0 shrink-0 bg-amber-400 text-[#001a6e] font-bold px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-amber-300 transition-colors"
            >
              Ver tóner <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </section>

        </>
      )}

      {/* Footer */}
      <footer className="text-white" style={{ background: "#0e3dbf" }}>

        {/* Benefits strip */}
        <div className="border-b border-white/10">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-white/10">
              {[
                { icon: Truck,      label: "Entregas Nacionales" },
                { icon: Shield,     label: "Garantía en tus Compras" },
                { icon: Headphones, label: "Asesoría Oportuna" },
                { icon: Zap,        label: "Pagos Seguros y Flexibles" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex flex-col items-center justify-center gap-2 py-6 px-4 hover:bg-white/5 transition-colors">
                  <Icon size={24} className="text-white/80" strokeWidth={1.5} />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white/70 text-center">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main footer */}
        <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 sm:grid-cols-5 gap-8">

          {/* Newsletter */}
          <div className="sm:col-span-1">
            <img src={logoSrc} alt="SEBASTPERU" className="h-9 w-auto object-contain brightness-0 invert mb-4" />
            <h4 className="text-sm font-bold mb-1">Suscríbete a nuestra newsletter</h4>
            <p className="text-xs text-white/50 leading-relaxed mb-4">
              Al suscribirte, aceptas nuestros términos de servicio y política de privacidad. Puedes darte de baja en cualquier momento.
            </p>
            <div className="flex border-b border-white/30 mb-3">
              <Mail size={14} className="text-white/40 mr-2 self-center shrink-0" />
              <input
                type="email"
                placeholder="Correo electrónico"
                className="flex-1 bg-transparent text-sm text-white placeholder-white/30 focus:outline-none py-1"
              />
              <button className="text-xs font-bold text-white/80 hover:text-white transition-colors whitespace-nowrap pl-2">
                Suscribirme
              </button>
            </div>
            <label className="flex items-start gap-2 cursor-pointer">
              <input type="checkbox" className="mt-0.5 accent-white" />
              <span className="text-[11px] text-white/40 leading-snug">
                Acepto los <a href="#" className="underline text-white/60 hover:text-white">términos y políticas</a> del sitio.
              </span>
            </label>
            <div className="flex gap-2 mt-5">
              {[Facebook, Instagram, Youtube].map((Icon, i) => (
                <button key={i} className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                  <Icon size={14} />
                </button>
              ))}
            </div>
          </div>

          {/* Links columns */}
          {[
            { title: "Mi cuenta",        links: ["Mis pedidos", "Mis direcciones", "Cambiar contraseña", "Crear cuenta"] },
            { title: "La empresa",       links: ["Sobre nosotros", "Nuestra tienda", "Contacto", "Ventas corporativas"] },
            { title: "Ayuda al cliente", links: ["Preguntas frecuentes", "Cobertura de envíos", "Seguimiento de pedido", "Escríbenos por WhatsApp"] },
            { title: "Legales",          links: ["Política de privacidad", "Política de devoluciones", "Términos y condiciones", "Política de envíos"] },
          ].map(({ title, links }) => (
            <div key={title}>
              <h4 className="text-sm font-bold text-white mb-3">{title}</h4>
              <ul className="flex flex-col gap-2">
                {links.map((l) => (
                  <li key={l}>
                    <a href="#" className="text-xs text-white/55 hover:text-white transition-colors">{l}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10">
          <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-white/40">© 2025 SEBASTPERU S.A.C. — Suministros y Tecnología — Lima, Perú</p>
            <div className="flex items-center gap-2">
              {/* Visa */}
              <div className="bg-white rounded px-2 py-1 flex items-center justify-center h-7">
                <span className="text-[#1a1f71] text-xs font-black italic tracking-tight">VISA</span>
              </div>
              {/* Mastercard */}
              <div className="bg-white rounded px-1.5 py-1 flex items-center justify-center h-7 gap-0.5">
                <div className="w-4 h-4 rounded-full bg-[#eb001b]" />
                <div className="w-4 h-4 rounded-full bg-[#f79e1b] -ml-2 opacity-90" />
              </div>
              {/* Amex */}
              <div className="bg-[#2671b9] rounded px-2 py-1 flex items-center justify-center h-7">
                <span className="text-white text-[9px] font-black tracking-widest">AMEX</span>
              </div>
              {/* Diners */}
              <div className="bg-white rounded px-2 py-1 flex items-center justify-center h-7">
                <span className="text-[#004a97] text-[9px] font-black tracking-wide">DINERS</span>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {cartOpen && (
        <CartDrawer items={cart} onClose={() => setCartOpen(false)} onUpdateQty={updateQty} onRemove={(id) => setCart((p) => p.filter((i) => i.product.id !== id))} onCheckout={goToCheckout} onGoCart={goToCart} />
      )}

      {/* Back to top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-6 right-6 z-40 w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shadow-lg hover:bg-blue-700 hover:-translate-y-0.5 active:scale-95 transition-all"
        title="Volver arriba"
      >
        <ChevronLeft size={18} className="-rotate-90" />
      </button>

      {/* Floating WhatsApp button */}
      <a
        href="https://wa.me/51925552042"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-[#25d366] hover:bg-[#20ba5a] text-white px-4 py-3 rounded-full shadow-lg shadow-green-400/40 transition-all hover:scale-105 active:scale-95"
        style={{ boxShadow: "0 4px 20px rgba(37,211,102,0.45)" }}
      >
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white shrink-0">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
        <div className="leading-tight">
          <p className="text-[10px] text-white/80">¿Tienes dudas?</p>
          <p className="text-sm font-black">925 552 042</p>
        </div>
      </a>

      </> }
    </div>
  );
}
