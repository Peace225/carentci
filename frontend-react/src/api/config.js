// src/api/config.js

const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.DEV 
    ? 'http://localhost:5000' 
    : 'https://carentci-backend-api.onrender.com' // Ton backend Render, pas le front
  );

export default API_BASE_URL;

// Session tracking sécurisé
let sessionId;
try {
  sessionId = sessionStorage.getItem('visit_session_id');
  if (!sessionId) {
    sessionId = `sess_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
    sessionStorage.setItem('visit_session_id', sessionId);
  }
} catch {
  // Fallback si sessionStorage bloqué : génère un ID temporaire
  sessionId = `sess_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
}

export const SESSION_ID = sessionId;

/**
 * Track une visite. Ne track pas en DEV pour éviter de polluer.
 */
export function trackVisit(page, vehicleId = null, vehicleName = null, vehicleType = null) {
  if (import.meta.env.DEV || !API_BASE_URL) return;

  fetch(`${API_BASE_URL}/api/visits`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    keepalive: true, // Important : la requête survit si l'user ferme la page
    body: JSON.stringify({
      session_id: sessionId,
      page,
      vehicle_id: vehicleId,
      vehicle_name: vehicleName,
      vehicle_type: vehicleType,
      referrer: document.referrer || null,
      user_agent: navigator.userAgent,
      timestamp: new Date().toISOString()
    })
  }).catch(() => {}); // Silent fail, on veut pas crasher l'app si le tracking fail
}