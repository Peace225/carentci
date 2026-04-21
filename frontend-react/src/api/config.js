// On utilise une variable d'environnement pour plus de flexibilité sur Vercel
// Si la variable VITE_API_URL n'est pas définie, on retombe sur tes valeurs par défaut
const API_BASE_URL = import.meta.env.VITE_API_URL 
  ? import.meta.env.VITE_API_URL 
  : (import.meta.env.DEV ? 'http://localhost:5000' : 'https://www.carentci.com');

export default API_BASE_URL;

// Session tracking (Ton code est excellent ici, on le garde)
let sessionId = sessionStorage.getItem('visit_session_id');
if (!sessionId) {
  sessionId = 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  sessionStorage.setItem('visit_session_id', sessionId);
}
export const SESSION_ID = sessionId;

// Fonction de tracking
export function trackVisit(page, vehicleId = null, vehicleName = null, vehicleType = null) {
  // On évite de tracker en mode développement pour ne pas polluer tes stats
  if (import.meta.env.DEV) return;

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
  }).catch(() => {});
}