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
  const rawImages = v.Images || v.images || v.IMAGES;
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
    .filter(v => (v.is_active ?? v.Is_active ?? v.IS_ACTIVE) !== 0)
    .map(v => {
      const formattedImages = parseVehicleImages(v);
      return {
        id: v.id || v.Id || v.ID,
        marque: v.marque || v.Marque || v.MARQUE,
        modele: v.modele || v.Modele || v.MODELE,
        category: v.category || v.Category || v.CATEGORY || v.categorie || v.Categorie,
        annee: v.annee || v.Annee || v.ANNEE,
        carburant: v.carburant || v.Carburant || v.CARBURANT,
        transmission: v.transmission || v.Transmission || v.TRANSMISSION,
        prix: v.prix || v.Prix || v.PRIX,
        type: v.type || v.Type || v.TYPE,
        image: formattedImages[0] || null,
        images: formattedImages,
        kilometrage: v.kilometrage || v.Kilometrage || 0,
        is_active: v.is_active || v.Is_active
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
    .filter(v => (v.is_active ?? v.Is_active ?? v.IS_ACTIVE) !== 0)
    .map(v => {
      const formattedImages = parseVehicleImages(v);
      return {
        id: v.id || v.Id || v.ID,
        marque: v.marque || v.Marque || v.MARQUE,
        modele: v.modele || v.Modele || v.MODELE,
        category: v.category || v.Category || v.CATEGORY || v.categorie || v.Categorie,
        annee: v.annee || v.Annee || v.ANNEE,
        prix: v.sale_price || v.Sale_price || v.SALE_PRICE || v.prix || v.Prix,
        mileage: v.kilometrage || v.Kilometrage || v.mileage || v.Mileage,
        fuel: v.carburant || v.Carburant || v.fuel || v.Fuel,
        transmission: v.transmission || v.Transmission || v.TRANSMISSION,
        type: v.type || v.Type || v.TYPE,
        image: formattedImages[0] || null,
        images: formattedImages,
        is_sold: (v.is_sold == 1 || v.Is_sold == 1) ? 1 : 0,
        is_active: v.is_active || v.Is_active
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
    id: v.id || v.Id || v.ID,
    marque: v.marque || v.Marque || v.MARQUE,
    modele: v.modele || v.Modele || v.MODELE,
    category: v.category || v.Category || v.CATEGORY || v.categorie || v.Categorie,
    type: v.type || v.Type || v.TYPE,
    prix: (v.type || v.Type) === 'location' ? (v.prix || v.Prix) : (v.sale_price || v.Sale_price || v.prix || v.Prix),
    image: formattedImages[0] || null,
    images: formattedImages,
    annee: v.annee || v.Annee || v.ANNEE,
    carburant: v.carburant || v.Carburant || v.CARBURANT,
    transmission: v.transmission || v.Transmission || v.TRANSMISSION,
    is_active: v.is_active || v.Is_active
  };
}