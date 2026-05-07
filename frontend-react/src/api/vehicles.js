import API_BASE_URL from './config';

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
 * Parseur universel pour le champ images (gère le JSONB de Supabase ou les anciens formats).
 */
const parseVehicleImages = (rawImages) => {
  if (!rawImages) return [];
  let parsed = [];
  try {
    // Supabase renvoie déjà un tableau, on gère juste le cas où c'est encore une string
    parsed = typeof rawImages === 'string' ? JSON.parse(rawImages) : rawImages;
    if (!Array.isArray(parsed)) parsed = [];
  } catch (e) {
    parsed = [];
  }
  
  return parsed.map(url => {
    if (!url) return "https://via.placeholder.com/400x300?text=Pas+d'image";
    if (url.startsWith('http')) return url; // Parfait pour tes nouvelles URLs Supabase Storage
    return `${API_BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`; // Fallback anciens uploads
  });
};

export async function fetchRentalVehicles() {
  const res = await fetch(`${API_BASE_URL}/api/vehicles/type/location`, {
    headers: getAuthHeaders()
  });
  
  if (res.status === 401) throw new Error("Session expirée");
  const data = await res.json();
  if (!data.success) throw new Error(data.message || "Erreur lors de la récupération");
  
  // Filtre is_active !== 0 pour masquer les véhicules archivés
  return data.data
    .filter(v => v.is_active !== 0 && v.status !== 'archived')
    .map(v => {
      const images = parseVehicleImages(v.images);
      return {
        id: v.id,
        marque: v.brand || v.marque,
        modele: v.model || v.modele,
        category: v.category || v.categorie,
        annee: v.year || v.annee,
        carburant: v.fuel || v.carburant || 'Non spécifié',
        transmission: v.transmission || 'Non spécifiée',
        prix: v.price_per_day || v.prix || 0,
        type: v.type || 'location',
        image: images[0] || "https://via.placeholder.com/400x300?text=Pas+d'image",
        images: images,
        kilometrage: v.mileage || v.kilometrage || 0,
        is_active: v.is_active !== undefined ? v.is_active : 1
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
  if (!data.success) throw new Error(data.message || "Erreur lors de la récupération");
  
  return data.data
    .filter(v => v.is_active !== 0 && v.status !== 'archived')
    .map(v => {
      const images = parseVehicleImages(v.images);
      return {
        id: v.id,
        marque: v.brand || v.marque,
        modele: v.model || v.modele,
        category: v.category || v.categorie,
        annee: v.year || v.annee,
        prix: v.sale_price || v.prix || 0,
        kilometrage: v.mileage || v.kilometrage || 0,
        carburant: v.fuel || v.carburant || 'Non spécifié',
        transmission: v.transmission || 'Non spécifiée',
        type: v.type || 'vente',
        image: images[0] || "https://via.placeholder.com/400x300?text=Pas+d'image",
        images: images,
        is_sold: (v.is_sold === true || v.is_sold === 1) ? 1 : 0,
        is_active: v.is_active !== undefined ? v.is_active : 1
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
  
  const images = parseVehicleImages(v.images);
  const isLocation = (v.type || v.category) === 'location';

  return {
    id: v.id,
    marque: v.brand || v.marque,
    modele: v.model || v.modele,
    category: v.category || v.categorie,
    type: v.type || (isLocation ? 'location' : 'vente'),
    prix: isLocation ? (v.price_per_day || v.prix) : (v.sale_price || v.prix),
    image: images[0] || "https://via.placeholder.com/400x300?text=Pas+d'image",
    images: images,
    annee: v.year || v.annee,
    carburant: v.fuel || v.carburant || 'Non spécifié',
    transmission: v.transmission || 'Non spécifiée',
    is_active: v.is_active !== undefined ? v.is_active : 1,
    is_sold: (v.is_sold === true || v.is_sold === 1) ? 1 : 0
  };
}