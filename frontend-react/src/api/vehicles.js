import API_BASE_URL from './config';

const PLACEHOLDER = "https://via.placeholder.com/400x300?text=Pas+d'image";

// 1. Headers : on n'envoie Authorization que si token existe
const getAuthHeaders = () => {
  const token = localStorage.getItem('adminToken');
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
};

// 2. Wrapper fetch centralisé
async function apiRequest(endpoint) {
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: getAuthHeaders()
  });

  // Gère le cas où le serveur renvoie du HTML au lieu de JSON
  let data;
  try {
    data = await res.json();
  } catch {
    throw new Error(`Erreur serveur ${res.status}`);
  }

  if (res.status === 401) {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    throw new Error("Session expirée");
  }

  if (!res.ok || data.success === false) {
    throw new Error(data.message || "Erreur lors de la récupération");
  }

  return data.data;
}

// 3. Parseur images
const parseVehicleImages = (rawImages) => {
  if (!rawImages) return [];
  let parsed = [];
  try {
    parsed = typeof rawImages === 'string' ? JSON.parse(rawImages) : rawImages;
    if (!Array.isArray(parsed)) parsed = [];
  } catch {
    parsed = [];
  }
  
  return parsed.map(url => {
    if (!url) return PLACEHOLDER;
    if (url.startsWith('http')) return url;
    return `${API_BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
  });
};

// 4. Normalisation unique pour éviter la duplication
const normalizeVehicle = (v) => {
  const images = parseVehicleImages(v.images);
  const isLocation = (v.type || v.category) === 'location';
  
  return {
    id: v.id,
    marque: v.brand || v.marque,
    modele: v.model || v.modele,
    category: v.category || v.categorie,
    annee: v.year || v.annee,
    carburant: v.fuel || v.carburant || 'Non spécifié',
    transmission: v.transmission || 'Non spécifiée',
    prix: isLocation ? (v.price_per_day || v.prix || 0) : (v.sale_price || v.prix || 0),
    type: v.type || (isLocation ? 'location' : 'vente'),
    image: images[0] || PLACEHOLDER,
    images,
    kilometrage: v.mileage || v.kilometrage || 0,
    is_active: v.is_active !== undefined ? v.is_active : 1,
    is_sold: (v.is_sold === true || v.is_sold === 1) ? 1 : 0
  };
};

export async function fetchRentalVehicles() {
  const vehicles = await apiRequest('/api/vehicles/type/location');
  
  return vehicles
    .filter(v => v.is_active !== 0 && v.status !== 'archived')
    .map(normalizeVehicle)
    .sort((a, b) => a.prix - b.prix);
}

export async function fetchSaleVehicles() {
  const vehicles = await apiRequest('/api/vehicles/type/vente');
  
  return vehicles
    .filter(v => v.is_active !== 0 && v.status !== 'archived')
    .map(normalizeVehicle)
    .sort((a, b) => {
      if (a.is_sold !== b.is_sold) return a.is_sold - b.is_sold;
      return a.prix - b.prix;
    });
}

export async function fetchVehicleById(id) {
  const v = await apiRequest(`/api/vehicles/${id}`);
  return normalizeVehicle(v);
}