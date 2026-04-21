const API_BASE_URL = import.meta.env.DEV
  ? 'http://localhost:5000'
  : 'https://www.carentci.com'

export default API_BASE_URL

// Session tracking
let sessionId = sessionStorage.getItem('visit_session_id')
if (!sessionId) {
  sessionId = 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
  sessionStorage.setItem('visit_session_id', sessionId)
}
export const SESSION_ID = sessionId

export function trackVisit(page, vehicleId = null, vehicleName = null, vehicleType = null) {
  fetch(API_BASE_URL + '/api/visits', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      session_id: sessionId,
      page,
      vehicle_id: vehicleId,
      vehicle_name: vehicleName,
      vehicle_type: vehicleType,
      referrer: document.referrer || null
    })
  }).catch(() => {})
}
