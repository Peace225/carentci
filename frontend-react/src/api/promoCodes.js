import API_BASE_URL from './config'

export async function validatePromoCode(code, clientWhatsapp) {
  const res = await fetch(`${API_BASE_URL}/api/promo-codes/validate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code, client_whatsapp: clientWhatsapp })
  })
  return res.json()
}
