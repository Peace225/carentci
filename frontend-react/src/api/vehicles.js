import API_BASE_URL from './config'

/**
 * Utilitaire pour les headers d'authentification.
 */
const getAuthHeaders = () => {
  const token = localStorage.getItem('adminToken');
  return {
    'Authorization': token ? `Bearer ${token}` : '',
    'Content-Type': 'application/json'
  };
};

/**
 * Utilitaire pour nettoyer les URLs d'images.
 */
const formatImageUrl = (url) => {
  if (!url) return "https://via.placeholder.com/400x300?text=Pas+d'image";
  if (url.startsWith('http')) return url;
  return `${API_BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
};

/**
 * Parseur universel pour le champ images (gère JSON string ou Array).
 */
const parseVehicleImages = (v) => {
  const rawImages = v.Images || v.images;
  let parsed = [];
  try {
    parsed = typeof rawImages === 'string' ? JSON.parse(rawImages) : (Array.isArray(rawImages) ? rawImages : []);
  } catch (e) {
    parsed = [];
  }
  return parsed.map(formatImageUrl);
};

export async function fetchRentalVehicles() {
  const res = await fetch(`${API_BASE_URL}/api/vehicles/type/location`, {
    headers: getAuthHeaders()
  });
  
  if (res.status === 401) throw new Error("Session expirée");
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  
  // Filtre is_active !== 0 pour masquer les véhicules archivés (Soft Delete)
  return data.data
    .filter(v => v.is_active !== 0)
    .map(v => {
      const formattedImages = parseVehicleImages(v);
      return {
        id: v.id,
        marque: v.marque,
        modele: v.modele,
        category: v.category,
        annee: v.annee,
        carburant: v.carburant,
        transmission: v.transmission,
        prix: v.prix,
        type: v.type,
        image: formattedImages[0] || null,
        images: formattedImages,
        kilometrage: v.kilometrage || 0,
        is_active: v.is_active
      };
    })
    .sort((a, b) => a.prix - b.prix);
}

export async function fetchSaleVehicles() {
  const res = await fetch(`${API_BASE_URL}/api/vehicles/type/vente`, {
    headers: getAuthHeaders()
  });
  
  if (res.status === 401) throw new Error("Session expirée");
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  
  return data.data
    .filter(v => v.is_active !== 0)
    .map(v => {
      const formattedImages = parseVehicleImages(v);
      return {
        id: v.id,
        marque: v.marque,
        modele: v.modele,
        category: v.category,
        annee: v.annee,
        prix: v.sale_price,
        mileage: v.kilometrage,
        fuel: v.carburant,
        transmission: v.transmission,
        type: v.type,
        image: formattedImages[0] || null,
        images: formattedImages,
        is_sold: v.is_sold == 1 ? 1 : 0,
        is_active: v.is_active
      };
    })
    .sort((a, b) => {
      if (a.is_sold !== b.is_sold) return a.is_sold - b.is_sold;
      return a.prix - b.prix;
    });
}

export async function fetchVehicleById(id) {
  const res = await fetch(`${API_BASE_URL}/api/vehicles/${id}`, {
    headers: getAuthHeaders()
  });
  
  const data = await res.json();
  if (!data.success) throw new Error('Véhicule non trouvé');
  const v = data.data;
  
  const formattedImages = parseVehicleImages(v);

  return {
    id: v.id,
    marque: v.marque,
    modele: v.modele,
    category: v.category,
    type: v.type,
    prix: v.type === 'location' ? v.prix : v.sale_price,
    image: formattedImages[0] || null,
    images: formattedImages,
    annee: v.annee,
    carburant: v.carburant,
    transmission: v.transmission,
    is_active: v.is_active
  };
}