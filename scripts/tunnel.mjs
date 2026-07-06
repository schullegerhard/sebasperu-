// Abre un túnel ngrok hacia el preview (puerto 4173) y mantiene el proceso vivo.
// Uso: NGROK_AUTHTOKEN=xxxx node scripts/tunnel.mjs
import ngrok from 'ngrok'

const token = process.env.NGROK_AUTHTOKEN
const port = Number(process.env.PORT || 4173)

try {
  if (token) await ngrok.authtoken(token)
  const url = await ngrok.connect({ addr: port, proto: 'http' })
  console.log('NGROK_URL=' + url)
  console.log('Forwarding ' + url + ' -> http://localhost:' + port)
} catch (e) {
  console.error('NGROK_ERROR=' + (e && e.message ? e.message : String(e)))
  if (e && e.body) console.error(JSON.stringify(e.body))
  process.exit(1)
}

// Mantener vivo el túnel.
setInterval(() => {}, 1 << 30)
