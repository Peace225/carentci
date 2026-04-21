import API_BASE_URL, { SESSION_ID } from './config'

export async function createReservation(data) {
  const res = await fetch(`${API_BASE_URL}/api/reservations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...data, session_id: SESSION_ID })
  })
  return res.json()
}
