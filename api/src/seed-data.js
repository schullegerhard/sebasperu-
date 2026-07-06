// Datos de siembra compartidos (usuarios, cupones, clientes, configuración).
export const USERS = [
  ['Admin General', 'admin@sebasperu.com', 'admin123', 'Administrador'],
  ['Carlos Vendedor', 'vendedor@sebasperu.com', 'vend123', 'Vendedor'],
  ['Ana Almacén', 'almacen@sebasperu.com', 'alm123', 'Almacén'],
  ['María Marketing', 'marketing@sebasperu.com', 'mkt123', 'Marketing'],
  ['Sergio Soporte', 'soporte@sebasperu.com', 'sop123', 'Soporte'],
]

export const COUPONS = [
  ['SEBAS10', '%', 10, '2026-12-31', true, 42, 0],
  ['TECNO15', '%', 15, '2026-09-30', true, 18, 500],
  ['ENVIOGRATIS', 'envio', 0, '2026-07-31', true, 73, 299],
  ['BLACK50', 'S/', 50, '2025-11-30', false, 210, 800],
]

export const CUSTOMERS = [
  ['Juan Pérez García', 'juan@gmail.com', '987 654 321', 'Persona', '2025-11-02'],
  ['María López', 'maria@gmail.com', '988 111 222', 'Persona', '2026-01-15'],
  ['Empresa TechCorp', 'compras@techcorp.pe', '01 555 4040', 'Empresa', '2025-08-20'],
  ['Carlos Ruiz', 'carlos@empresa.pe', '999 333 444', 'Empresa', '2026-02-10'],
]

export const ORDERS = [
  ['PED-1000', 'Juan Pérez García', 'juan@gmail.com', 1899, 'Pagado', 'Yape', 'Lima', '2026-06-20', [{ name: 'Laptop HP 250 G9', qty: 1, price: 1899 }]],
  ['PED-1001', 'María López', 'maria@gmail.com', 747, 'Enviado', 'Tarjeta', 'Arequipa', '2026-06-20', [{ name: 'Tóner HP 85A', qty: 2, price: 168 }]],
  ['PED-1002', 'Carlos Ruiz', 'carlos@empresa.pe', 3299, 'Pendiente', 'Transferencia', 'Lima', '2026-06-19', [{ name: 'Lenovo Legion 5', qty: 1, price: 3299 }]],
]

export const SETTINGS = {
  name: 'SebasPeru', email: 'ventas@sebasperu.com', phone: '926 428 566', whatsapp: '925 552 042',
  address: 'Lima, Perú', ruc: '20512345678', currency: 'PEN', igv: 18,
  payments: { yape: true, plin: true, transferencia: true, tarjeta: true, contraentrega: true, mercadopago: true },
  shipping: { freeFrom: 299, limaFee: 15, provinceFee: 25 },
}
