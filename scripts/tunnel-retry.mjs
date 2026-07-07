import ngrok from 'ngrok'
const port = Number(process.env.PORT || 4000)
try { await ngrok.kill() } catch {}
await new Promise((r) => setTimeout(r, 3000))
let url = null
for (let i = 0; i < 6 && !url; i++) {
  try {
    url = await ngrok.connect({ addr: port, proto: 'http' })
    console.log('NGROK_URL=' + url)
  } catch (e) {
    const msg = (e && e.body && e.body.msg) || (e && e.message) || String(e)
    console.error(`try ${i + 1}: ${msg}`)
    if (i < 5) await new Promise((r) => setTimeout(r, 18000))
  }
}
if (!url) { console.error('GAVE_UP'); process.exit(1) }
setInterval(() => {}, 1 << 30)
