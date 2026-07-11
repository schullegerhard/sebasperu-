// Envío de correos (confirmación de pedido) por SMTP/Gmail. Configurable por
// variables de entorno; si falta config, se omite el envío sin romper la compra.
//   SMTP_HOST (def. smtp.gmail.com) · SMTP_PORT (def. 465) · SMTP_USER · SMTP_PASS
//   MAIL_FROM (def. "SebasPeru <SMTP_USER>")
import nodemailer from 'nodemailer'

let cached // undefined = sin intentar; null = no configurado; objeto = transporte
function transport() {
  if (cached !== undefined) return cached
  const { SMTP_USER, SMTP_PASS, SMTP_HOST, SMTP_PORT } = process.env
  if (!SMTP_USER || !SMTP_PASS) { cached = null; return null }
  const port = Number(SMTP_PORT) || 465
  cached = nodemailer.createTransport({ host: SMTP_HOST || 'smtp.gmail.com', port, secure: port === 465, auth: { user: SMTP_USER, pass: SMTP_PASS } })
  return cached
}

const money = (n) => 'S/ ' + Number(n || 0).toLocaleString('es-PE', { minimumFractionDigits: 2 })

function orderHtml(order) {
  const rows = (order.items || []).map((i) => `
    <tr>
      <td style="padding:8px 0;border-bottom:1px solid #eef1f6">${i.name} <span style="color:#64748b">× ${i.qty}</span></td>
      <td style="padding:8px 0;border-bottom:1px solid #eef1f6;text-align:right">${money(i.price * i.qty)}</td>
    </tr>`).join('')
  return `<div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;color:#0f1c2e">
    <div style="background:#1a56ff;color:#fff;padding:22px 24px;border-radius:12px 12px 0 0">
      <h1 style="margin:0;font-size:20px">SEBASTPERU</h1>
    </div>
    <div style="border:1px solid #e8ecf3;border-top:none;border-radius:0 0 12px 12px;padding:24px">
      <h2 style="font-size:18px;margin:0 0 6px">¡Gracias por tu compra!</h2>
      <p style="color:#475569;margin:0 0 18px">Hemos recibido tu pedido <b>${order.code}</b>. Te contactaremos para coordinar la entrega.</p>
      <table style="width:100%;border-collapse:collapse;font-size:14px">${rows}
        <tr><td style="padding:12px 0 0;font-weight:800">Total</td><td style="padding:12px 0 0;text-align:right;font-weight:800">${money(order.total)}</td></tr>
      </table>
      <p style="color:#64748b;font-size:12.5px;margin:20px 0 0">Pago: ${order.payment} · Estado: ${order.status || 'Pendiente'}</p>
      <p style="color:#64748b;font-size:12.5px;margin:6px 0 0">¿Dudas? Escríbenos a ventas@sebasperu.com o por WhatsApp al 925 552 042.</p>
    </div>
  </div>`
}

export async function sendOrderConfirmation(order) {
  const t = transport()
  const to = order?.email
  if (!to || to === '—') return false
  if (!t) { console.log(`ℹ️  Email no configurado (SMTP_USER/PASS) — se omite la confirmación de ${order.code}`); return false }
  try {
    await t.sendMail({
      from: process.env.MAIL_FROM || `SebasPeru <${process.env.SMTP_USER}>`,
      to, subject: `Confirmación de tu pedido ${order.code} — SebasPeru`, html: orderHtml(order),
    })
    console.log(`📧 Confirmación enviada a ${to} (${order.code})`)
    return true
  } catch (e) { console.warn('⚠️  Error enviando email:', e.message); return false }
}
